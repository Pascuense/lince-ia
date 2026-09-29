#!/usr/bin/env bash
# Segunda fase tras azure-create.sh: OpenAI, VAPID y esquema de la base de datos.
# Uso (en Azure Cloud Shell, dentro del repo clonado):
#   ./scripts/azure-configure.sh
set -euo pipefail

RG=rg-lince
APP=lince-app
DB=lince-db-acnb
DBNAME=lince_db
DBUSER=lince_admin
DBHOST="$DB.mysql.database.azure.com"
CONTACT_EMAIL="${VAPID_CONTACT_EMAIL:-cristobalalisteg@gmail.com}"

echo "== 1/4 Azure OpenAI"
mapfile -t OAI < <(az cognitiveservices account list \
  --query "[?kind=='OpenAI'].[name,resourceGroup,properties.endpoint]" -o tsv)
if [ "${#OAI[@]}" -eq 0 ]; then
  echo "   No hay ningún recurso Azure OpenAI en la suscripción. Se omite este paso."
  echo "   Crea uno en el portal y luego ejecuta:"
  echo "   az webapp config appsettings set -g $RG -n $APP --settings AZURE_OPENAI_ENDPOINT=... AZURE_OPENAI_KEY=... AZURE_OPENAI_DEPLOYMENT=gpt-4o"
else
  OAI_NAME=""; OAI_RG=""; OAI_EP=""; OAI_DEPLOY=""
  for LINE in "${OAI[@]}"; do
    IFS=$'\t' read -r N R E <<<"$LINE"
    D=$(az cognitiveservices account deployment list -g "$R" -n "$N" \
      --query "[?contains(properties.model.name,'gpt-4o')].name | [0]" -o tsv 2>/dev/null || true)
    echo "   - $N ($R): deployment gpt-4o = ${D:-ninguno}"
    if [ -n "$D" ] && [ -z "$OAI_NAME" ]; then
      OAI_NAME=$N; OAI_RG=$R; OAI_EP=$E; OAI_DEPLOY=$D
    fi
  done
  if [ -z "$OAI_NAME" ]; then
    echo "   Ningún recurso tiene un deployment gpt-4o. Créalo en Azure AI Foundry y relanza."
  else
    KEY=$(az cognitiveservices account keys list -g "$OAI_RG" -n "$OAI_NAME" --query key1 -o tsv)
    az webapp config appsettings set -g "$RG" -n "$APP" -o none --settings \
      AZURE_OPENAI_ENDPOINT="$OAI_EP" AZURE_OPENAI_KEY="$KEY" AZURE_OPENAI_DEPLOYMENT="$OAI_DEPLOY"
    echo "   Configurado: $OAI_NAME / $OAI_DEPLOY"
  fi
fi

echo "== 2/4 Claves VAPID (push)"
EXISTING=$(az webapp config appsettings list -g "$RG" -n "$APP" \
  --query "[?name=='VAPID_PUBLIC_KEY'].value | [0]" -o tsv)
if [ -n "$EXISTING" ]; then
  VAPID_PUB=$EXISTING
  echo "   Ya existían; se conservan."
else
  VAPID_JSON=$(npx --yes web-push generate-vapid-keys --json)
  VAPID_PUB=$(echo "$VAPID_JSON" | node -pe 'JSON.parse(require("fs").readFileSync(0,"utf8")).publicKey')
  VAPID_PRIV=$(echo "$VAPID_JSON" | node -pe 'JSON.parse(require("fs").readFileSync(0,"utf8")).privateKey')
  az webapp config appsettings set -g "$RG" -n "$APP" -o none --settings \
    VAPID_PUBLIC_KEY="$VAPID_PUB" VAPID_PRIVATE_KEY="$VAPID_PRIV" VAPID_CONTACT_EMAIL="mailto:$CONTACT_EMAIL"
  echo "   Generadas y guardadas."
fi

echo "== 3/4 Esquema de la base de datos"
MYIP=$(curl -s https://api.ipify.org)
az mysql flexible-server firewall-rule create -g "$RG" -n "$DB" -r cloudshell \
  --start-ip-address "$MYIP" --end-ip-address "$MYIP" -o none 2>/dev/null || true
read -r -s -p "   Contraseña de MySQL ($DBUSER): " DBPASS; echo
MYSQL="mysql -h $DBHOST -u $DBUSER -p$DBPASS --ssl-mode=REQUIRED $DBNAME"
TABLES=$($MYSQL -N -e "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema='$DBNAME'")
if [ "$TABLES" -ge 9 ]; then
  echo "   La base de datos ya tiene $TABLES tablas; no se importa nada."
else
  $MYSQL < schema.sql
  echo "   schema.sql importado."
fi

echo "== 4/4 Reinicio de la app"
az webapp restart -g "$RG" -n "$APP" -o none

cat <<EOF

Listo. Último paso manual, en GitHub:
  Settings -> Secrets and variables -> Actions -> pestaña "Variables" -> New repository variable
    Name:  VITE_VAPID_PUBLIC_KEY
    Value: $VAPID_PUB
  y relanza el deploy para que el frontend incluya la clave.
EOF

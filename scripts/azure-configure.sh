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

# Chat models in order of preference; all work with the app's chat-completions calls.
CHAT_MODELS="gpt-4.1 gpt-4o gpt-5-mini gpt-5 gpt-4.1-mini gpt-4o-mini"
IMAGE_MODELS="gpt-image-1 gpt-image-1-mini"

find_deployment() { # $1=rg $2=account $3=space-separated model names
  local m d
  for m in $3; do
    d=$(az cognitiveservices account deployment list -g "$1" -n "$2" \
      --query "[?properties.model.name=='$m'].name | [0]" -o tsv 2>/dev/null || true)
    if [ -n "$d" ]; then echo "$d"; return; fi
  done
}

create_deployment() { # $1=rg $2=account $3=space-separated model names; prints deployment name
  local m v
  for m in $3; do
    v=$(az cognitiveservices account list-models -g "$1" -n "$2" \
      --query "[?name=='$m'].version | sort(@) | [-1]" -o tsv 2>/dev/null || true)
    if [ -z "$v" ]; then
      echo "      $m: no disponible en este recurso/región" >&2
      continue
    fi
    for SKU in GlobalStandard Standard; do
      local cap=50
      case "$m" in gpt-image*) cap=1 ;; esac
      if out=$(az cognitiveservices account deployment create -g "$1" -n "$2" \
        --deployment-name "$m" --model-name "$m" --model-version "$v" \
        --model-format OpenAI --sku-name "$SKU" --sku-capacity "$cap" -o none 2>&1); then
        echo "$m"; return
      fi
      echo "      $m ($SKU): $(echo "$out" | grep -v '^WARNING' | tail -1)" >&2
    done
  done
}

echo "== 1/4 Azure OpenAI"
mapfile -t OAI < <(az cognitiveservices account list \
  --query "[?kind=='OpenAI' || kind=='AIServices'].[name,resourceGroup,properties.endpoint]" -o tsv)
if [ "${#OAI[@]}" -eq 0 ]; then
  echo "   No hay ningún recurso Azure OpenAI en la suscripción. Se omite este paso."
else
  IFS=$'\t' read -r OAI_NAME OAI_RG OAI_EP <<<"${OAI[0]}"
  for LINE in "${OAI[@]}"; do
    IFS=$'\t' read -r N R E <<<"$LINE"
    echo "   - $N ($R). Deployments actuales:"
    az cognitiveservices account deployment list -g "$R" -n "$N" \
      --query "[].{deployment:name, modelo:properties.model.name}" -o tsv 2>/dev/null | sed 's/^/       /' || true
    if [ -n "$(find_deployment "$R" "$N" "$CHAT_MODELS")" ]; then
      OAI_NAME=$N; OAI_RG=$R; OAI_EP=$E
      break
    fi
  done
  echo "   Recurso elegido: $OAI_NAME"

  CHAT=$(find_deployment "$OAI_RG" "$OAI_NAME" "$CHAT_MODELS")
  if [ -z "$CHAT" ]; then
    echo "   No hay modelo de chat desplegado; creando uno..."
    CHAT=$(create_deployment "$OAI_RG" "$OAI_NAME" "$CHAT_MODELS")
  fi
  IMAGE=$(find_deployment "$OAI_RG" "$OAI_NAME" "$IMAGE_MODELS")
  if [ -z "$IMAGE" ]; then
    echo "   No hay modelo de imagen desplegado; intentando crear gpt-image-1..."
    IMAGE=$(create_deployment "$OAI_RG" "$OAI_NAME" "$IMAGE_MODELS")
  fi

  if [ -z "$CHAT" ]; then
    echo "   No se pudo crear un deployment de chat en $OAI_NAME (región o cuota)."
    echo "   Créalo a mano en https://ai.azure.com (modelo gpt-4.1 o gpt-4o) y relanza este script."
  else
    KEY=$(az cognitiveservices account keys list -g "$OAI_RG" -n "$OAI_NAME" --query key1 -o tsv)
    SETTINGS=(AZURE_OPENAI_ENDPOINT="$OAI_EP" AZURE_OPENAI_KEY="$KEY" AZURE_OPENAI_DEPLOYMENT="$CHAT")
    [ -n "$IMAGE" ] && SETTINGS+=(AZURE_OPENAI_IMAGE_DEPLOYMENT="$IMAGE")
    az webapp config appsettings set -g "$RG" -n "$APP" -o none --settings "${SETTINGS[@]}"
    echo "   Configurado: chat=$CHAT imagen=${IMAGE:-NINGUNO (generación de imágenes desactivada)}"
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
if [ "${SKIP_DB:-0}" = "1" ]; then
  echo "   Omitido (SKIP_DB=1)."
else
  MYIP=$(curl -s https://api.ipify.org)
  az mysql flexible-server firewall-rule create -g "$RG" -n "$DB" -r cloudshell \
    --start-ip-address "$MYIP" --end-ip-address "$MYIP" -o none 2>/dev/null || true
  read -r -s -p "   Contraseña de MySQL ($DBUSER): " DBPASS; echo
  # Cloud Shell ships the MariaDB client, which only understands --ssl
  if mysql --version 2>/dev/null | grep -qi mariadb; then SSLFLAG="--ssl"; else SSLFLAG="--ssl-mode=REQUIRED"; fi
  MYSQL="mysql -h $DBHOST -u $DBUSER -p$DBPASS $SSLFLAG $DBNAME"
  TABLES=$($MYSQL -N -e "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema='$DBNAME'")
  if [ "$TABLES" -ge 9 ]; then
    echo "   La base de datos ya tiene $TABLES tablas; no se importa nada."
  else
    $MYSQL < schema.sql
    echo "   schema.sql importado."
  fi
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

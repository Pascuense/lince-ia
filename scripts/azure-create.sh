#!/usr/bin/env bash
# Recrea desde cero la infraestructura de LINCE en Azure.
# Uso (en Azure Cloud Shell o con `az login` hecho):
#   DB_PASSWORD='una-contraseña-fuerte' ./scripts/azure-create.sh
set -euo pipefail

RG=rg-lince
LOC=francecentral
APP=lince-app
PLAN=lince-plan
DB=lince-db-acnb
DBNAME=lince_db
DBUSER=lince_admin
DBPASS="${DB_PASSWORD:?Define DB_PASSWORD antes de ejecutar}"
ST=stlinceuploads
CONTAINER=lince-uploads

echo "== Registro de proveedores de la suscripción (solo la primera vez)"
for NS in Microsoft.Web Microsoft.DBforMySQL Microsoft.Storage; do
  az provider register --namespace "$NS" --wait -o none
done

echo "== Grupo de recursos"
az group create -n "$RG" -l "$LOC" -o none

echo "== App Service (Linux, Node 22)"
az appservice plan create -g "$RG" -n "$PLAN" -l "$LOC" --is-linux --sku B1 -o none
if ! az webapp show -g "$RG" -n "$APP" -o none 2>/dev/null; then
  az webapp create -g "$RG" -p "$PLAN" -n "$APP" --runtime "NODE:22-lts" -o none
fi

echo "== MySQL Flexible Server"
if ! az mysql flexible-server show -g "$RG" -n "$DB" -o none 2>/dev/null; then
  az mysql flexible-server create -g "$RG" -n "$DB" -l "$LOC" \
    --admin-user "$DBUSER" --admin-password "$DBPASS" \
    --sku-name Standard_B1ms --tier Burstable --storage-size 32 --version 8.0.21 \
    --public-access 0.0.0.0 --yes -o none
fi
az mysql flexible-server db create -g "$RG" -s "$DB" -d "$DBNAME" -o none

echo "== Blob Storage"
if ! az storage account show -g "$RG" -n "$ST" -o none 2>/dev/null; then
  az storage account create -g "$RG" -n "$ST" -l "$LOC" --sku Standard_LRS -o none
fi
CONN=$(az storage account show-connection-string -g "$RG" -n "$ST" -o tsv)
az storage container create --name "$CONTAINER" --connection-string "$CONN" -o none

echo "== Configuración de la app"
az webapp config appsettings set -g "$RG" -n "$APP" -o none --settings \
  SCM_DO_BUILD_DURING_DEPLOYMENT=false \
  ENABLE_ORYX_BUILD=false \
  NODE_ENV=production \
  PORT=8080 \
  DATABASE_URL="mysql://$DBUSER:$DBPASS@$DB.mysql.database.azure.com:3306/$DBNAME?ssl={rejectUnauthorized:true}" \
  JWT_SECRET="$(openssl rand -hex 32)" \
  AZURE_STORAGE_CONNECTION_STRING="$CONN" \
  AZURE_STORAGE_CONTAINER="$CONTAINER"
az webapp config set -g "$RG" -n "$APP" --startup-file "npm start" -o none

echo "== Publish profile para GitHub Actions"
az webapp deployment list-publishing-profiles -g "$RG" -n "$APP" --xml > "$APP.PublishSettings"

cat <<EOF

Listo. URL: https://$APP.azurewebsites.net

Faltan por configurar A MANO (no se pueden generar aquí):
  1. Azure OpenAI: AZURE_OPENAI_ENDPOINT, AZURE_OPENAI_KEY, AZURE_OPENAI_DEPLOYMENT
  2. Push: VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY, VAPID_CONTACT_EMAIL  (npx web-push generate-vapid-keys)
     -> az webapp config appsettings set -g $RG -n $APP --settings CLAVE=valor ...
  3. Esquema de la BD: importar schema.sql o ejecutar npm run db:push con DATABASE_URL
  4. GitHub -> Settings -> Secrets -> AZUREAPPSERVICE_PUBLISHPROFILE_C33591B88D5B4BB7B54DC0945C555A20
     = contenido del fichero $APP.PublishSettings
EOF

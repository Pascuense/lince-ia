#!/usr/bin/env bash
set -euo pipefail

APP_NAME="${1:-lince-app}"
RESOURCE_GROUP="${2:-rg-lince}"

printf "\n🔧 Applying Azure App Service recovery settings...\n"
printf "   app: %s\n" "$APP_NAME"
printf "   rg : %s\n\n" "$RESOURCE_GROUP"

az webapp config appsettings set \
  --name "$APP_NAME" \
  --resource-group "$RESOURCE_GROUP" \
  --settings SCM_DO_BUILD_DURING_DEPLOYMENT=false ENABLE_ORYX_BUILD=false >/dev/null

echo "✅ Disabled Oryx build during deployment"

az webapp config set \
  --name "$APP_NAME" \
  --resource-group "$RESOURCE_GROUP" \
  --startup-file "node index.js" >/dev/null

echo "✅ Startup command set to: node index.js"

az webapp restart --name "$APP_NAME" --resource-group "$RESOURCE_GROUP" >/dev/null

echo "✅ App restarted"

echo "\n📋 Next checks:"
echo "1) GitHub Actions > deploy log should no longer run Oryx build"
echo "2) Azure Deployment Center > Logs"
echo "3) Runtime logs:"
echo "   az webapp log tail --name $APP_NAME --resource-group $RESOURCE_GROUP"

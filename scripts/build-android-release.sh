#!/bin/bash
# =============================================================================
# LINCE — Build de producción para Google Play Store
# =============================================================================
# Prerrequisitos:
#   - Java 17+  (java -version)
#   - Android Studio instalado con SDK 34+
#   - ANDROID_HOME configurado (o ANDROID_SDK_ROOT)
#   - Keystore generado (ver instrucciones abajo)
#
# Para generar el keystore por primera vez:
#   keytool -genkey -v -keystore lince-release.keystore \
#     -alias lince -keyalg RSA -keysize 2048 -validity 10000
#   → Guarda el .keystore en un lugar SEGURO, fuera del repositorio
#
# Variables de entorno requeridas:
#   KEYSTORE_PATH   → ruta absoluta al archivo .keystore
#   KEY_ALIAS       → alias del keystore (ej: "lince")
#   KEY_PASSWORD    → contraseña del keystore
#   STORE_PASSWORD  → contraseña del store (puede ser la misma)
# =============================================================================

set -e

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${GREEN}🦁 LINCE — Build Android para Play Store${NC}"
echo "========================================"

# Verificar prerrequisitos
if ! command -v java &> /dev/null; then
    echo -e "${RED}❌ Java no encontrado. Instala JDK 17+${NC}"
    exit 1
fi

if [ -z "$ANDROID_HOME" ] && [ -z "$ANDROID_SDK_ROOT" ]; then
    echo -e "${YELLOW}⚠️  ANDROID_HOME no configurado. Asegúrate de tener el SDK instalado.${NC}"
fi

# Verificar variables de firma
if [ -z "$KEYSTORE_PATH" ] || [ -z "$KEY_ALIAS" ] || [ -z "$KEY_PASSWORD" ]; then
    echo -e "${RED}❌ Variables de entorno de firma no configuradas.${NC}"
    echo "   Configura: KEYSTORE_PATH, KEY_ALIAS, KEY_PASSWORD, STORE_PASSWORD"
    exit 1
fi

# 1. Build del web app
echo -e "\n${YELLOW}📦 Paso 1: Build del web app (Vite)...${NC}"
npm run build:web

# 2. Sync con Capacitor
echo -e "\n${YELLOW}🔄 Paso 2: Sincronizando con Capacitor...${NC}"
npx cap sync android

# 3. Build del AAB firmado
echo -e "\n${YELLOW}🔨 Paso 3: Compilando AAB de producción...${NC}"
cd android

./gradlew bundleRelease \
  -Pandroid.injected.signing.store.file="$KEYSTORE_PATH" \
  -Pandroid.injected.signing.store.password="${STORE_PASSWORD:-$KEY_PASSWORD}" \
  -Pandroid.injected.signing.key.alias="$KEY_ALIAS" \
  -Pandroid.injected.signing.key.password="$KEY_PASSWORD"

cd ..

# 4. Mostrar resultado
AAB_PATH="android/app/build/outputs/bundle/release/app-release.aab"
if [ -f "$AAB_PATH" ]; then
    SIZE=$(du -sh "$AAB_PATH" | cut -f1)
    echo -e "\n${GREEN}✅ Build completado correctamente${NC}"
    echo -e "   📁 Archivo: ${AAB_PATH}"
    echo -e "   📏 Tamaño: ${SIZE}"
    echo -e "\n${YELLOW}📤 Próximo paso: Sube el .aab a Google Play Console${NC}"
    echo "   https://play.google.com/console"
else
    echo -e "${RED}❌ No se encontró el archivo AAB. Revisa los errores de Gradle.${NC}"
    exit 1
fi

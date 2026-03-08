#!/usr/bin/env bash
# =============================================================================
# clean-dev.sh — Full recovery script for LINCE dev environment
# Clears all Vite/esbuild caches and reinstalls dependencies
# Usage: bash scripts/clean-dev.sh
# =============================================================================

set -euo pipefail

echo "🧹 LINCE - Limpiando entorno de desarrollo..."

# Remove Vite cache
echo "  → Eliminando caché de Vite..."
rm -rf node_modules/.vite

# Remove esbuild cache
echo "  → Eliminando caché de esbuild..."
rm -rf node_modules/.cache

# Remove build output
echo "  → Eliminando carpeta dist/..."
rm -rf dist

# Reinstall dependencies
echo "  → Reinstalando dependencias..."
npm install --legacy-peer-deps

echo ""
echo "✅ Entorno limpio. Ejecuta 'npm run dev' para iniciar el servidor."

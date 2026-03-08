#!/usr/bin/env bash
# =============================================================================
# rebuild.sh — Complete rebuild of LINCE from scratch
# Clears all caches, removes dist, and rebuilds frontend + backend.
# Usage: bash scripts/rebuild.sh
# =============================================================================

set -euo pipefail

echo "🔨 LINCE - Reconstrucción completa desde cero..."

# Step 1: Clean everything
echo ""
echo "1/4 → Limpiando artefactos anteriores..."
rm -rf dist node_modules/.vite node_modules/.cache

# Step 2: Install dependencies
echo ""
echo "2/4 → Instalando dependencias..."
npm install --legacy-peer-deps

# Step 3: TypeScript check
echo ""
echo "3/4 → Verificando tipos TypeScript..."
npm run check

# Step 4: Production build
echo ""
echo "4/4 → Compilando para producción..."
npm run build

echo ""
echo "✅ Reconstrucción completada."
echo "   Frontend → dist/public/"
echo "   Backend  → dist/index.js"
echo ""
echo "Para iniciar en producción: npm start"

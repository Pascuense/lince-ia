#!/bin/bash
set -e

echo "🧹 Limpiando LINCE v2.0.0..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

echo "📁 Removiendo directorios de build..."
rm -rf node_modules/.vite
rm -rf dist
rm -rf build

echo "📦 Removiendo lockfile..."
rm -f pnpm-lock.yaml

echo "🔄 Reinstalando dependencias con pnpm..."
pnpm install

echo "✅ Cleanup completado"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🚀 Iniciando dev server con memoria optimizada..."
NODE_OPTIONS=--max-old-space-size=8192 npm run dev

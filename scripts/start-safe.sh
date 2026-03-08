#!/usr/bin/env bash
# =============================================================================
# start-safe.sh — Memory-optimized dev server start for LINCE
# Increases Node.js heap size to prevent OOM crashes during TypeScript
# compilation and HMR processing.
# Usage: bash scripts/start-safe.sh
# =============================================================================

set -euo pipefail

echo "🚀 LINCE - Iniciando servidor de desarrollo (modo seguro)..."
echo "   NODE_OPTIONS: --max-old-space-size=4096"
echo ""

export NODE_OPTIONS="--max-old-space-size=4096"
export NODE_ENV="development"

exec npm run dev

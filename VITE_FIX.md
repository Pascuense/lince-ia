# Vite Build Fix Guide — LINCE IA

## Quick Start (5 min)

```bash
npm run clean:all
npm run dev:safe
# Visita http://localhost:5173
```

## Scripts disponibles

| Script | Descripción |
|---|---|
| `npm run dev` | Dev server con 4 GB de memoria |
| `npm run dev:safe` | Dev server con 8 GB de memoria |
| `npm run dev:memory` | Dev server con 16 GB de memoria |
| `npm run clean:vite` | Limpia caché de Vite y reinicia |
| `npm run clean:all` | Limpieza completa + reinstala deps |
| `npm run fix:build` | Reinstala deps + dev:safe |

## Si el error persiste

```bash
# Opción 1: reinstalar y arrancar con más memoria
npm run fix:build

# Opción 2: máxima memoria
NODE_OPTIONS=--max-old-space-size=16384 npm run dev

# Opción 3: limpiar todo manualmente
rm -rf node_modules/.vite dist
pnpm install
npm run dev:safe
```

## Causas comunes del error `[plugin:vite:esbuild] The service is no longer running`

1. **Memoria insuficiente** — usar `npm run dev:safe` o `dev:memory`
2. **Caché corrupta** — ejecutar `npm run clean:vite`
3. **Dependencias desactualizadas** — ejecutar `npm run fix:build`
4. **Conflictos de HMR** — resuelto en `vite.config.ts` con `hmr.overlay: false`

## Configuración aplicada en vite.config.ts

- `server.hmr.overlay = false` — desactiva el overlay conflictivo
- `optimizeDeps` — pre-bundling optimizado de dependencias clave
- `esbuild.target = 'esnext'` — mejor optimización
- `build.minify = 'esbuild'` — minificación eficiente
- `build.target = 'esnext'` — compilación moderna

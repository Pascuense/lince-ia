# CLAUDE.md — LINCE IA

LINCE is a gamified EdTech platform for AI education (Spanish: _"Plataforma EdTech gamificada de formación en Inteligencia Artificial"_), owned by **ACNB IA SL**. Version 3.0.0. Deployed on Microsoft Azure.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, TailwindCSS 4, Vite 7, Wouter |
| Backend | Express 4, tRPC 11, Node.js 22+ |
| Database | Azure MySQL Flexible Server, Drizzle ORM |
| AI | Azure OpenAI Service (GPT-4o, DALL-E 3) |
| Storage | Azure Blob Storage |
| Auth | JWT (jsonwebtoken/jose) + bcrypt, HTTP-only cookie |
| Push | Web Push API (web-push + VAPID) |
| Mobile | Capacitor 6 (Android + iOS) |
| Testing | Vitest |
| Formatting | Prettier |

---

## Project Structure

```
lince-ia/
├── client/                    # React 19 frontend
│   ├── public/                # Static assets (manifest, icons, service worker)
│   └── src/
│       ├── _core/             # Core client utilities
│       ├── components/        # 60+ reusable UI components + ui/ (Radix-based)
│       ├── contexts/          # React contexts (see React Contexts section)
│       ├── hooks/             # Custom React hooks (see Hooks section)
│       ├── lib/               # Constants, utilities, accessControl (see lib section)
│       ├── pages/             # 40+ page components (see Frontend Routing)
│       ├── App.tsx            # Route definitions (wouter Switch/Route)
│       ├── main.tsx           # React entry point
│       └── index.css          # Global CSS theme (dark mode, LINCE brand colors)
├── server/                    # Express + tRPC backend
│   ├── auth.ts                # JWT/bcrypt auth, cookie helpers, REST auth routes
│   ├── cookies.ts             # Cookie parsing helpers
│   ├── db.ts                  # Drizzle ORM query helpers
│   ├── env.ts                 # Typed Azure environment variables (ENV object)
│   ├── imageGeneration.ts     # Azure OpenAI DALL-E 3 image generation
│   ├── index.ts               # Server entry point (Express + tRPC + static serve)
│   ├── llm.ts                 # Azure OpenAI chat completion helpers
│   ├── notification.ts        # Push notification content helpers
│   ├── pushScheduler.ts       # Scheduled push notification jobs
│   ├── pushService.ts         # Web Push API (VAPID) send logic
│   ├── routers.ts             # Main tRPC router (all procedures)
│   ├── storage.ts             # Azure Blob Storage upload/download
│   ├── systemRouter.ts        # Health check + admin tRPC router
│   ├── trpc.ts                # tRPC init, context, middleware (publicProcedure, protectedProcedure, adminProcedure)
│   └── vite.ts                # Vite dev server integration (development only)
├── shared/                    # Isomorphic code (used by both client and server)
│   ├── _core/                 # Core error types
│   ├── avatarPrompts.ts       # Avatar chat system prompts (default/global)
│   ├── avatarPrompts_aragonesa.ts    # Brand-specific avatar prompts
│   ├── avatarPrompts_especialistas.ts
│   ├── avatarPrompts_evento.ts
│   ├── avatarPrompts_family.ts
│   ├── avatarPrompts_musicalin_intl.ts
│   ├── avatarPrompts_ogcrew.ts
│   ├── avatarPrompts_zaragoza.ts
│   ├── avatarExpertise.ts     # Avatar expertise definitions
│   ├── avatarTasks.ts         # Avatar task definitions
│   ├── const.ts               # Shared constants
│   └── types.ts               # Re-exports all Drizzle schema types + core errors
├── drizzle/
│   └── schema.ts              # Drizzle ORM table definitions (9 tables, all types exported)
├── scripts/
│   ├── azure-recover.sh       # Azure App Service recovery script
│   ├── build-android-release.sh  # Android AAB build helper
│   └── validate-env.mjs       # Environment variable validation
├── .github/
│   └── workflows/
│       ├── main_lince-app.yml     # CI/CD: build + deploy to Azure App Service
│       └── android-release.yml   # Manual: build signed AAB for Google Play
├── .env.example               # Environment variable template
├── capacitor.config.ts        # Capacitor mobile config (appId: app.lince.ia)
├── drizzle.config.ts          # Drizzle Kit config (requires DATABASE_URL)
├── package.json               # Dependencies and scripts
├── schema.sql                 # Raw SQL schema (for direct MySQL import)
├── tsconfig.json              # TypeScript config (strict mode, path aliases)
├── vite.config.ts             # Vite config (root: client/, out: dist/public/)
└── vitest.config.ts           # Vitest config (tests in server/**/*.test.ts)
```

---

## Development Commands

```bash
npm run dev          # Start dev server (tsx watch on server/index.ts + Vite HMR)
npm run build        # Build frontend (Vite → dist/public/) + backend (esbuild CJS → dist/index.js)
npm run build:web    # Build frontend only
npm start            # Run production server (NODE_ENV=production node dist/index.js)
npm run check        # TypeScript type check (tsc --noEmit)
npm run format       # Format all files with Prettier
npm run test         # Run Vitest tests
npm run db:push      # Generate and apply Drizzle migrations
npm run db:seed      # Seed the database (server/seed.ts)
npm run check:env    # Validate required environment variables
npm run mobile:build # Build web + sync Capacitor
npm run mobile:android  # Build and open Android Studio
npm run mobile:ios      # Build and open Xcode
npm run mobile:sync  # Sync Capacitor only (no web build)
npm run mobile:copy  # Copy web assets to Capacitor without full sync
```

---

## Path Aliases

These aliases are configured in both `tsconfig.json` and `vite.config.ts`/`vitest.config.ts`:

| Alias | Resolves to |
|---|---|
| `@/*` | `client/src/*` |
| `@shared/*` | `shared/*` |
| `@assets/*` | `attached_assets/*` |

Always use these aliases for imports — never use relative paths that cross directory boundaries.

---

## Database Schema (9 tables)

All tables are defined in `drizzle/schema.ts` and types are re-exported from `shared/types.ts`.

| Table | Purpose |
|---|---|
| `users` | Admin system users (JWT/bcrypt login) |
| `game_players` | Game players (separate auth from admin users) |
| `prompt_creations` | Prompt Studio image generation history |
| `legal_acceptances` | NDA/IP/Terms acceptance audit log |
| `custom_courses` | Course Builder user-created courses |
| `tool_views` | Arsenal IA tool view tracking |
| `chat_sessions` | Player–avatar conversation sessions |
| `chat_messages` | Individual chat messages within sessions |
| `push_subscriptions` | Browser push notification subscriptions (VAPID) |

**Important**: `users` (admins) and `game_players` (game users) are completely separate tables with separate auth flows. Do not mix them.

### Notable Schema Details

- `game_players.username` ends in `-LIN` (male) or `-LINA` (female). Locked after registration.
- `game_players.levelsData` and `dailyRewardsData` are JSON columns with typed inference.
- `push_subscriptions.preferences` stores per-device notification settings (quiet hours, etc.).
- `chat_sessions` enforces one session per (player, avatar) pair — reopening continues the same conversation.
- `legal_acceptances` records device fingerprinting data for legal proof of terms acceptance.

---

## Authentication

Two separate auth systems coexist:

1. **Admin auth** (`users` table): Standard JWT via `server/auth.ts`. Login at `/login`. Sets `lince_session` HTTP-only cookie. Used for admin panel access.
2. **Game player auth** (`game_players` table): Handled via tRPC procedures in `server/routers.ts`. Players use username + password. Game state managed in `GameContext`.

### tRPC Procedure Types

Defined in `server/trpc.ts`:
- `publicProcedure` — No auth required
- `protectedProcedure` — Requires valid admin JWT cookie (`role: "user"` or `"admin"`)
- `adminProcedure` — Requires `role: "admin"` in JWT payload

### REST Auth Routes

```
POST /api/auth/register   → Create admin user, return JWT cookie
POST /api/auth/login      → Verify credentials, set JWT cookie
POST /api/auth/logout     → Clear JWT cookie
GET  /api/auth/me         → Return current user from cookie
```

---

## API Architecture (tRPC)

All business logic is in `server/routers.ts` exposed at `/api/trpc/*`. The client uses `@trpc/react-query` hooks (configured in `client/src/lib/trpc.ts`).

The tRPC router uses `superjson` as transformer (handles Dates, etc. automatically).

When adding new procedures:
1. Add to `server/routers.ts` (or create a sub-router and merge it)
2. Use `publicProcedure`, `protectedProcedure`, or `adminProcedure` as appropriate
3. Define input with `zod` schemas (project uses **Zod v4**)
4. The client will automatically get TypeScript types via inference

---

## Frontend Routing

Client-side routing uses `wouter`. Routes are defined in `client/src/App.tsx`.

### Public Routes (no registration required)
| Path | Page | Description |
|---|---|---|
| `/` | Home | Landing page |
| `/tutorial` | Tutorial | Onboarding tutorial |
| `/bienvenida` | Bienvenida | Welcome screen |
| `/arsenal-ia` | ArsenalIA | AI tools directory |
| `/arsenal-ia/:toolId` | ArsenalIADetail | Tool detail view |
| `/prompt-studio` | PromptStudio | IMAGELIN — image generation |
| `/promptear` | PromptGame | PROMPTLIN — prompt competition game |
| `/lincelin` | CreaTuLincelin | LINCELIN — avatar creator |
| `/personajes` | Personajes | Avatar gallery |
| `/jugar` | GameHub | Game levels hub |
| `/jugar/nivel-1` | Nivel1 | Level 1 |
| `/jugar/nivel-2` | Nivel2 | Level 2 |
| `/jugar/nivel-3` | Nivel3 | Level 3 |
| `/perfil` | MiPerfil | Player profile |
| `/perfil-publico` | PublicProfile | Public player profile |
| `/recompensas` | DailyRewards | Daily rewards |
| `/mercado` | Mercado | Marketplace/store |
| `/reto-diario` | RetoDiario | Daily challenge |
| `/progresion` | MapaProgresion | Progression map |
| `/aviso-legal` | AvisoLegal | Legal notice |
| `/como-jugar` | ComoJugar | How to play |
| `/artista/:code` | MundoArtista | Artist world (referral) |
| `/login` | Login | Admin login |
| `/registro` | Register | Admin registration |

### Admin-Only Routes
| Path | Page |
|---|---|
| `/mundo` | MundoLince |
| `/raids` | LinceRaids |
| `/raids-batalla` | RaidsBattle |
| `/academia` | AcademiaLince |
| `/catalogo-formativo` | CatalogoFormativo |
| `/course-builder` | CourseBuilder |
| `/avatar-customizer` | AvatarCustomizer |
| `/mi-panel` | UserDashboard |
| `/changelog` | Changelog |
| `/admin` | AdminPanel |
| `/guia-base44` | GuiaBase44 |
| `/prompt-profesional` | PromptProfesional |
| `/historial-prompts` | PromptHistory |
| `/galeria` | Galeria |

**Lazy loading**: All pages use `React.lazy()` for code splitting except `Register`, `Login`, and `NotFound` (eagerly loaded).

---

## React Contexts

| Context file | Provider | Hook | Purpose |
|---|---|---|---|
| `GameContext.tsx` | `GameProvider` | `useGame()` | Game state (player, XP, coins, levels, streaks, daily rewards, sync) |
| `ThemeContext.tsx` | `ThemeProvider` | `useTheme()` | Dark/light theme (default: dark) |
| `PRDLanguageContext.tsx` | `PRDLanguageProvider` | `usePRDLanguage()` | UI language + avatar country + username generation |
| `GuestContext.tsx` | `GuestProvider` | `useGuest()` | Guest/trial mode state |
| `LanguageContext.tsx` | — | — | Legacy/internal language helpers |

### Language Support

`PRDLanguageContext` supports **5 languages**: `es | en | zh | pt-BR | pt-PT`

Helper function `tl(lang, { es, en, zh, 'pt-BR', 'pt-PT' })` for inline translations.

Translation data lives in:
- `client/src/contexts/extendedTranslations.ts` — main translations (es/en/zh)
- `client/src/contexts/extendedTranslationsPtBR.ts` — Brazilian Portuguese
- `client/src/contexts/extendedTranslationsPtPT.ts` — European Portuguese

---

## Client-Side Libraries (`client/src/lib/`)

| File | Purpose |
|---|---|
| `accessControl.ts` | `isAdminUser()` helper for admin route guarding |
| `avatarConstants.ts` | Avatar key/name/image mappings |
| `gameConfig.ts` | Game configuration constants (XP thresholds, level definitions) |
| `gameConstants.ts` | Shared game constants (coin rewards, streak rules, etc.) |
| `offlineStore.ts` | Local offline progress storage helpers |
| `searchIndex.ts` | Global search index for `GlobalSearch` component |
| `trpc.ts` | tRPC client + React Query setup for the frontend |
| `usernameGenerator.ts` | Username generation logic (-LIN/-LINA suffixes) |
| `utils.ts` | General utilities (`cn()` for class merging, etc.) |

---

## Custom Hooks (`client/src/hooks/`)

| Hook | Purpose |
|---|---|
| `useComposition.ts` | IME composition state (for CJK input fields) |
| `useContentProtection.ts` | Disables right-click/copy on protected content |
| `useGameLang.ts` | Game-specific language resolution |
| `useMobile.tsx` | Mobile viewport detection |
| `useNotifications.ts` | Push notification subscription management |
| `useOfflineProgress.ts` | Offline-first progress sync logic |
| `usePWA.ts` | PWA install prompt + update detection |
| `usePersistFn.ts` | Stable function reference across renders |
| `useProgressiveUnlock.ts` | Feature unlock progression logic |
| `useServerPush.ts` | Server-Sent Events / polling for real-time updates |
| `useSwipeBack.ts` | iOS-style swipe-back gesture handler |

---

## Code Style & Formatting

Formatting is enforced by Prettier (`.prettierrc`). Run `npm run format` before committing.

Key rules:
- **Quotes**: Double quotes (`"`)
- **Semicolons**: Required
- **Trailing commas**: ES5 style
- **Print width**: 80 characters
- **Tab width**: 2 spaces (no tabs)
- **Arrow parens**: Omit when single arg (`x => x`)
- **Line endings**: LF

TypeScript is configured with `strict: true`. All new code must be strictly typed.

---

## Environment Variables

Copy `.env.example` to `.env` and fill in real values. Validate with `npm run check:env`.

### Required at runtime:
| Variable | Description |
|---|---|
| `DATABASE_URL` | MySQL connection string with SSL |
| `JWT_SECRET` | Long random string for JWT signing |
| `AZURE_OPENAI_ENDPOINT` | Azure OpenAI resource endpoint |
| `AZURE_OPENAI_KEY` | Azure OpenAI API key |
| `AZURE_OPENAI_DEPLOYMENT` | Deployment name (e.g., `gpt-4o`) |
| `AZURE_STORAGE_CONNECTION_STRING` | Azure Blob Storage connection string |
| `AZURE_STORAGE_CONTAINER` | Blob container name (default: `lince-uploads`) |
| `VAPID_PUBLIC_KEY` | VAPID public key for push notifications |
| `VAPID_PRIVATE_KEY` | VAPID private key |
| `VAPID_CONTACT_EMAIL` | Contact email for VAPID |
| `NODE_ENV` | `production` or `development` |
| `PORT` | Server port (default: 8080) |

All env vars are accessed via the typed `ENV` object in `server/env.ts`, not directly from `process.env`.

### Build-time (injected into frontend bundle):
| Variable | Description |
|---|---|
| `VITE_APP_TITLE` | Browser tab title |
| `VITE_VAPID_PUBLIC_KEY` | VAPID public key for client-side push subscription |

**Never commit real secrets.** Generate new VAPID keys with: `npx web-push generate-vapid-keys`

---

## Security

The server uses **Helmet.js** with a strict Content Security Policy defined in `server/index.ts`.

Current CSP directives:
- `scriptSrc`: self + Google Fonts
- `styleSrc`: self + inline + Google Fonts
- `imgSrc`: self + data: + blob: + `*.blob.core.windows.net`
- `fontSrc`: self + Google Fonts CDN
- `connectSrc`: self + Azure OpenAI + Azure Blob Storage
- `frameSrc`, `objectSrc`: none

**If adding new external resources** (scripts, images, fonts, external APIs), update the CSP in `server/index.ts`.

Additional security measures:
- Account lockout after repeated failed login attempts (implemented in `server/auth.ts`)
- File type/size validation in the storage layer
- Request body size limit: 10MB
- HSTS enabled in production (max-age: 1 year, includeSubDomains, preload)

---

## Testing

Tests are run with Vitest. Test files go in `server/**/*.test.ts` or `server/**/*.spec.ts`.

```bash
npm run test    # Run all tests once
```

The test environment is `node`. Tests resolve the same path aliases as the main build.

There are currently no frontend tests — Vitest is configured for server-side tests only.

---

## Build Output

```
dist/
├── index.js       # Bundled Express server (esbuild, CJS format)
└── public/        # Static frontend assets (Vite output)
    ├── index.html
    ├── assets/    # JS/CSS chunks
    └── ...
```

**Build command**: `esbuild server/index.ts --platform=node --bundle --format=cjs --outdir=dist --external:./vite --external:*.node`

The server in production serves `dist/public/` as static files and falls back to `index.html` for all non-API routes (SPA mode).

Build note: The server bundle uses CJS format and excludes `./vite` and `*.node` externals to avoid bundling the Vite dev toolchain. Azure App Service must have `SCM_DO_BUILD_DURING_DEPLOYMENT=false` and `ENABLE_ORYX_BUILD=false` set — it deploys pre-built artifacts.

---

## Mobile (Capacitor)

The app is also distributed as a native mobile app via Capacitor 6.

- **App ID**: `app.lince.ia`
- **Android**: Builds AAB (Android App Bundle) for Google Play. Uses HTTPS scheme for cookies.
- **iOS**: Uses `lince` URL scheme.
- **Web output**: `dist/public/` (must build web first)

Mobile build workflow:
```bash
npm run mobile:build    # Build web + cap sync
npm run mobile:android  # Open Android Studio
npm run mobile:ios      # Open Xcode
npm run mobile:copy     # Copy web assets only (faster than full sync)
```

The GitHub Actions workflow `.github/workflows/android-release.yml` handles signed AAB builds for the Play Store (triggered manually via `workflow_dispatch`).

---

## PWA & Offline Support

The app is a Progressive Web App (PWA):
- Service worker in `client/public/` handles offline caching
- `usePWA.ts` hook manages install prompts and update detection
- `useOfflineProgress.ts` + `offlineStore.ts` sync game progress when offline
- `OfflineSyncIndicator` component shows sync status to the user
- Push notifications via `useNotifications.ts` and VAPID (see `server/pushService.ts`)
- `NotificationScheduler` component triggers timed local notifications

---

## CI/CD

### Azure App Service (`main_lince-app.yml`)
Triggered on push to `main`. Builds the app and deploys the `dist/` folder to Azure App Service `lince-app` in resource group `rg-lince` (France Central region).

### Android Play Store (`android-release.yml`)
Manual trigger via GitHub Actions `workflow_dispatch`. Requires secrets:
- `ANDROID_KEYSTORE_BASE64` — base64-encoded keystore file
- `KEYSTORE_STORE_PASSWORD`, `KEYSTORE_KEY_ALIAS`, `KEYSTORE_KEY_PASSWORD`
- `VITE_VAPID_PUBLIC_KEY`

---

## Azure Infrastructure

| Resource | Name | Region |
|---|---|---|
| Resource Group | `rg-lince` | France Central |
| App Service | `lince-app` | France Central |
| MySQL Flexible Server | `lince-db-acnb.mysql.database.azure.com` | France Central |
| Database | `lince_db` | — |
| Azure Blob Storage | `lince-uploads` container | France Central |
| Azure OpenAI | `gpt-4o` deployment | France Central / Sweden Central |

### Azure Recovery

If the app stops responding:
```bash
./scripts/azure-recover.sh lince-app rg-lince
# or manually:
az webapp config appsettings set --name lince-app --resource-group rg-lince --settings SCM_DO_BUILD_DURING_DEPLOYMENT=false ENABLE_ORYX_BUILD=false
az webapp config set --name lince-app --resource-group rg-lince --startup-file "npm start"
az webapp restart --name lince-app --resource-group rg-lince
```

---

## Key Conventions for AI Assistants

1. **No Manus references**: This is the Azure-independent edition. Do not add any Manus OAuth, Manus CDN, or Manus Runtime dependencies.

2. **Drizzle ORM for all DB access**: Use query helpers in `server/db.ts`. Do not write raw SQL except in `schema.sql` for reference.

3. **Types from schema**: Import all DB types from `@shared/types` (re-exported from `drizzle/schema.ts`). Do not duplicate type definitions.

4. **tRPC for all new API endpoints**: Add procedures to `server/routers.ts`. Only use plain REST routes for auth (`server/auth.ts`).

5. **Zod v4 for validation**: All tRPC input must be validated with Zod schemas (project uses `zod` v4). Import from `zod`.

6. **ENV object for environment variables**: Access env vars through the typed `ENV` object from `server/env.ts`, not directly from `process.env`.

7. **Path aliases**: Always use `@/` for client imports and `@shared/` for shared code. Never use relative paths crossing directory boundaries.

8. **Lazy loading for new pages**: New pages added to `client/src/pages/` should be added with `React.lazy()` in `App.tsx`, not eagerly imported.

9. **Two separate user tables**: `users` = admin users, `game_players` = game players. Keep these completely separate.

10. **Security**: The server uses Helmet.js with a strict CSP. If new external resources are needed (scripts, images, fonts, APIs), update the CSP directives in `server/index.ts`.

11. **Language**: UI strings are in Spanish (`es`) by default. Full multilingual support covers `es/en/zh/pt-BR/pt-PT` via `PRDLanguageContext`. Use the `tl()` helper for inline translations. Add new translatable strings to `extendedTranslations.ts`.

12. **Dark theme**: The app defaults to dark mode. Brand primary color is `#00E5FF` (cyan). Background is `#0A0A0A`.

13. **Build format**: The server bundle is **CJS** (CommonJS), not ESM. The `--format=cjs` flag is used in the esbuild command. Do not change this — Azure App Service requires CJS for `node dist/index.js`.

14. **Port discovery**: The server auto-detects an available port starting from `ENV.port` (default 8080), scanning up to 20 ports. This handles dev environments with busy ports.

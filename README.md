# LINCE IA

> **Plataforma EdTech gamificada de formación en Inteligencia Artificial**
> _Owned by **ACNB IA SL** — [www.acnb.es](https://www.acnb.es)_

[![Version](https://img.shields.io/badge/version-2.0.0-00E5FF?style=flat-square)](package.json)
[![Node](https://img.shields.io/badge/node-22+-339933?style=flat-square&logo=node.js)](https://nodejs.org)
[![TypeScript](https://img.shields.io/badge/typescript-5.9.3-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org)
[![React](https://img.shields.io/badge/react-19-61DAFB?style=flat-square&logo=react)](https://react.dev)
[![License](https://img.shields.io/badge/license-MIT-green?style=flat-square)](LICENSE)

LINCE is a full-stack web and mobile application that teaches AI concepts through
gamification: XP, coins, levels, streaks, daily rewards, avatar chats, prompt
engineering challenges, and an AI tools catalogue. Deployed on Microsoft Azure.

---

## ✨ Key Features

| Feature | Description |
| --- | --- |
| 🎮 **Gamification engine** | XP, coins, levels, streaks, daily rewards, raids, and badges |
| 🤖 **Avatar chat** | Conversational AI avatars powered by Azure OpenAI GPT-4o |
| 🖼️ **Prompt Studio** | Image generation via Azure OpenAI DALL-E 3 with history |
| 📚 **Course Builder** | Admin tool to create and publish custom AI learning courses |
| 🛠️ **Arsenal IA** | Curated catalogue of AI tools with view tracking |
| 📲 **Mobile app** | Native Android & iOS via Capacitor 6 |
| 🔔 **Push notifications** | Web Push API with VAPID, scheduled jobs |
| 🌍 **Multilingual** | Spanish (default), English, and Chinese |
| 🌙 **Dark-first UI** | TailwindCSS 4 with brand cyan `#00E5FF` on `#0A0A0A` |

---

## 🚀 Quick Start (5 minutes)

### Prerequisites

- **Node.js 22+** — [nodejs.org](https://nodejs.org)
- **pnpm 10.4+** — `npm install -g pnpm`
- **MySQL 8+** (local or Azure) — connection string ready
- Azure OpenAI, Azure Blob Storage, and VAPID keys (see
  [README-AZURE-DEPLOYMENT.md](README-AZURE-DEPLOYMENT.md) to provision them)

### 1 — Clone and install

```bash
git clone https://github.com/Pascuense/lince-ia.git
cd lince-ia
pnpm install
```

### 2 — Configure environment

```bash
cp .env.example .env
# Fill in DATABASE_URL, JWT_SECRET, Azure keys, and VAPID keys
# Then validate:
pnpm check:env
```

### 3 — Initialize database

```bash
# Apply schema to your MySQL instance
mysql -h <host> -u <user> -p < schema.sql

# (Optional) seed sample data
pnpm db:seed
```

### 4 — Start development server

```bash
pnpm dev
# → http://localhost:8080
```

The dev server starts Express with hot-reload (`tsx watch`) and the Vite HMR
frontend simultaneously.

---

## 🏗️ Tech Stack

| Layer | Technology |
| --- | --- |
| **Frontend** | React 19, TailwindCSS 4, Vite 7, Wouter |
| **Backend** | Express 4, tRPC 11, Node.js 22+ |
| **Language** | TypeScript 5.9.3 (strict mode) |
| **Database** | Azure MySQL Flexible Server, Drizzle ORM |
| **AI** | Azure OpenAI Service (GPT-4o, DALL-E 3) |
| **Storage** | Azure Blob Storage |
| **Auth** | JWT (jose + jsonwebtoken) + bcrypt, HTTP-only cookie |
| **Push** | Web Push API (web-push + VAPID) |
| **Mobile** | Capacitor 6 (Android + iOS) |
| **Testing** | Vitest (32 test files, server-side) |
| **Formatting** | Prettier 3 |
| **Package manager** | pnpm 10.4.1 |

---

## 📁 Project Structure

```
lince-ia/
├── client/                    # React 19 frontend
│   ├── public/                # Static assets (manifest, icons, service worker)
│   └── src/
│       ├── _core/             # Core client utilities
│       ├── components/        # 65+ reusable UI components (Radix UI based)
│       ├── contexts/          # GameContext, ThemeContext, PRDLanguageContext, GuestContext
│       ├── hooks/             # Custom React hooks
│       ├── lib/               # Constants, utilities, accessControl
│       ├── pages/             # 43 page components (lazy-loaded)
│       ├── App.tsx            # Route definitions (wouter Switch/Route)
│       ├── main.tsx           # React entry point
│       └── index.css          # Global CSS theme
├── server/                    # Express + tRPC backend
│   ├── _core/                 # Core server modules (entry point: _core/index.ts)
│   ├── auth.ts                # JWT/bcrypt auth + REST auth routes
│   ├── db.ts                  # Drizzle ORM query helpers
│   ├── env.ts                 # Typed ENV object (Azure variables)
│   ├── routers.ts             # Main tRPC router (2300+ lines)
│   ├── trpc.ts                # tRPC init + procedure types
│   └── *.test.ts              # 32 Vitest test files
├── shared/                    # Isomorphic code (client + server)
│   ├── avatarPrompts*.ts      # Avatar personality system prompts (9 variants)
│   ├── const.ts               # Shared constants
│   └── types.ts               # Re-exports all Drizzle schema types
├── drizzle/
│   └── schema.ts              # 9 database table definitions
├── scripts/
│   ├── azure-recover.sh       # Azure App Service recovery script
│   └── validate-env.mjs       # Environment variable validation
├── .github/workflows/
│   ├── main_lince-app.yml     # CI/CD → Azure App Service
│   └── android-release.yml    # Manual → Google Play AAB
├── .env.example               # Environment variable template
├── schema.sql                 # Raw SQL schema (direct MySQL import)
└── capacitor.config.ts        # Mobile app config (appId: app.lince.ia)
```

---

## 🛠️ Development Commands

```bash
pnpm dev            # Dev server with HMR (http://localhost:8080)
pnpm build          # Build frontend (Vite) + backend (esbuild)
pnpm start          # Run production server
pnpm check          # TypeScript type check
pnpm format         # Format with Prettier
pnpm test           # Run Vitest test suite
pnpm check:env      # Validate environment variables
pnpm db:push        # Generate and apply Drizzle migrations
pnpm db:seed        # Seed database with sample data
pnpm mobile:build   # Build web + sync Capacitor
pnpm mobile:android # Build and open Android Studio
pnpm mobile:ios     # Build and open Xcode
```

---

## 🗄️ Database Schema

Nine tables in `drizzle/schema.ts`, imported via `shared/types.ts`:

| Table | Purpose |
| --- | --- |
| `users` | Admin system users (JWT/bcrypt login) |
| `game_players` | Game players — **separate auth from admins** |
| `prompt_creations` | Prompt Studio image generation history |
| `legal_acceptances` | NDA/IP/Terms acceptance audit log |
| `custom_courses` | Course Builder user-created courses |
| `tool_views` | Arsenal IA tool view tracking |
| `chat_sessions` | Player–avatar conversation sessions |
| `chat_messages` | Individual messages within sessions |
| `push_subscriptions` | Browser push notification subscriptions (VAPID) |

> **Important**: `users` (admins) and `game_players` (game users) are completely
> separate tables with separate authentication flows.

---

## 🔐 Authentication

Two separate auth systems:

1. **Admin auth** — `users` table, JWT cookie (`lince_session`), REST routes in
   `server/auth.ts`. Login at `/login`.
2. **Player auth** — `game_players` table, tRPC procedures in `server/routers.ts`,
   state managed in `GameContext`.

tRPC procedure middleware (in `server/trpc.ts`):

- `publicProcedure` — No auth required
- `protectedProcedure` — Valid admin JWT cookie required
- `adminProcedure` — `role: "admin"` in JWT payload required

---

## 🌐 API Architecture

All business logic is exposed via tRPC at `/api/trpc/*`. The client uses
`@trpc/react-query` hooks with full TypeScript inference.

REST auth routes (only exception to the tRPC rule):

```
POST /api/auth/register   → Create admin user
POST /api/auth/login      → Set JWT cookie
POST /api/auth/logout     → Clear JWT cookie
GET  /api/auth/me         → Return current user
```

---

## 📖 Documentation

| Document | Description |
| --- | --- |
| [CLAUDE.md](CLAUDE.md) | Full technical reference for developers and AI assistants |
| [README-AZURE-DEPLOYMENT.md](README-AZURE-DEPLOYMENT.md) | Step-by-step Azure deployment guide |
| [DEPLOYMENT.md](DEPLOYMENT.md) | Quick deployment checklist |
| [CONTRIBUTING.md](CONTRIBUTING.md) | Contribution guidelines |
| [.env.example](.env.example) | Environment variable template |

---

## 📱 Mobile

The app is distributed as a native mobile app via **Capacitor 6**:

- **App ID**: `app.lince.ia`
- **Android**: AAB (Android App Bundle) for Google Play
- **iOS**: `lince` URL scheme

Build workflow → see [DEPLOYMENT.md](DEPLOYMENT.md).

---

## ☁️ Azure Infrastructure

| Resource | Name | Region |
| --- | --- | --- |
| App Service | `lince-app` | France Central |
| MySQL Flexible Server | `lince-db-acnb` | France Central |
| Blob Storage | `lince-uploads` container | France Central |
| Azure OpenAI | `gpt-4o` deployment | France Central / Sweden Central |

---

## 🤝 Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for development setup, code style,
branch naming conventions, and PR guidelines.

---

## 📄 License

MIT — see `"license": "MIT"` in [package.json](package.json).

**ACNB IA SL** — cristobal@acnb.es — [www.acnb.es](https://www.acnb.es)

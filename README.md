# LINCE IA

> **Plataforma EdTech gamificada de formación en Inteligencia Artificial**

[![Version](https://img.shields.io/badge/version-3.0.0-00E5FF?style=flat-square)](./CLAUDE.md)
[![Node.js](https://img.shields.io/badge/Node.js-22%2B-339933?style=flat-square&logo=node.js)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)](https://react.dev/)
[![Azure](https://img.shields.io/badge/Azure-deployed-0078D4?style=flat-square&logo=microsoftazure)](https://azure.microsoft.com/)
[![License](https://img.shields.io/badge/license-Proprietary-red?style=flat-square)](#license)

**LINCE** is a gamified EdTech platform that teaches Artificial Intelligence through interactive gameplay, avatar-based conversations, prompt engineering, and curated AI tool discovery. Built and owned by **ACNB IA SL**, deployed on Microsoft Azure.

---

## ✨ Key Features

| Feature | Description |
|---|---|
| 🎮 **Gamified Learning** | XP, coins, streaks, daily rewards, and level progression |
| 🤖 **Avatar Chat** | Conversational AI avatars powered by Azure OpenAI (GPT-4o) |
| 🎨 **Prompt Studio** | Image generation with DALL-E 3 and prompt history |
| 📚 **Course Builder** | User-created custom courses and learning paths |
| 🧰 **Arsenal IA** | Curated directory of AI tools with usage tracking |
| 🔔 **Push Notifications** | Web Push (VAPID) with scheduled reminders |
| 📱 **Mobile App** | Native iOS & Android via Capacitor 6 |
| 🌐 **Multilingual UI** | Spanish (default), English, and Chinese |

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 19, TailwindCSS 4, Vite 7, Wouter |
| **Backend** | Express 4, tRPC 11, Node.js 22+ |
| **Database** | Azure MySQL Flexible Server, Drizzle ORM |
| **AI** | Azure OpenAI Service (GPT-4o, DALL-E 3) |
| **Storage** | Azure Blob Storage |
| **Auth** | JWT + bcrypt, HTTP-only cookies |
| **Push** | Web Push API (web-push + VAPID) |
| **Mobile** | Capacitor 6 (Android + iOS) |
| **Testing** | Vitest |
| **Formatting** | Prettier |

---

## 🚀 Quick Start

### Prerequisites

- **Node.js 22+** (check with `node -v`)
- **npm** (included with Node.js)
- A running **MySQL** instance (or Azure MySQL Flexible Server)
- Azure credentials for OpenAI, Blob Storage (see [Environment Setup](#-environment-setup))

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/Pascuense/lince-ia.git
cd lince-ia

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env
# Edit .env with your credentials (see Environment Setup below)

# 4. Push the database schema
npm run db:push

# 5. (Optional) Seed the database
npm run db:seed

# 6. Start the development server
npm run dev
```

The app will be available at **http://localhost:8080** (or the port defined in your `.env`).

---

## 📁 Project Structure

```
lince-ia/
├── client/          # React 19 frontend (Vite)
│   └── src/
│       ├── components/   # 60+ reusable UI components
│       ├── contexts/     # GameContext, ThemeContext, PRDLanguageContext, GuestContext
│       ├── hooks/        # Custom React hooks
│       ├── pages/        # 40+ page components (lazy-loaded)
│       └── App.tsx       # Route definitions (wouter)
├── server/          # Express + tRPC backend
│   ├── routers.ts        # All tRPC procedures (~2300+ lines)
│   ├── auth.ts           # JWT/bcrypt auth & REST auth routes
│   ├── db.ts             # Drizzle ORM query helpers
│   ├── env.ts            # Typed environment variables
│   └── index.ts          # Server entry point
├── shared/          # Isomorphic code (client + server)
│   ├── types.ts          # Re-exports all Drizzle schema types
│   └── const.ts          # Shared constants
├── drizzle/
│   └── schema.ts         # Database table definitions (9 tables)
├── scripts/         # Utility scripts (Azure recovery, Android build)
├── .env.example     # Environment variable template
├── CLAUDE.md        # Detailed technical documentation
└── README-AZURE-DEPLOYMENT.md  # Azure deployment guide
```

---

## ⚙️ Environment Setup

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

| Variable | Description |
|---|---|
| `DATABASE_URL` | MySQL connection string with SSL |
| `JWT_SECRET` | Long random string for JWT signing |
| `AZURE_OPENAI_ENDPOINT` | Azure OpenAI resource endpoint |
| `AZURE_OPENAI_KEY` | Azure OpenAI API key |
| `AZURE_OPENAI_DEPLOYMENT` | Deployment name (e.g. `gpt-4o`) |
| `AZURE_STORAGE_CONNECTION_STRING` | Azure Blob Storage connection string |
| `AZURE_STORAGE_CONTAINER` | Blob container name (default: `lince-uploads`) |
| `VAPID_PUBLIC_KEY` | VAPID public key for push notifications |
| `VAPID_PRIVATE_KEY` | VAPID private key |
| `VAPID_CONTACT_EMAIL` | Contact email for VAPID |
| `VITE_VAPID_PUBLIC_KEY` | VAPID public key (injected into frontend) |

Generate VAPID keys:

```bash
npx web-push generate-vapid-keys
```

Validate your environment:

```bash
npm run check:env
```

---

## 🧑‍💻 Development Workflow

```bash
npm run dev            # Start dev server (Express + Vite HMR)
npm run build          # Build frontend + backend for production
npm run build:web      # Build frontend only
npm start              # Run production server
npm run check          # TypeScript type check (tsc --noEmit)
npm run format         # Format all files with Prettier
npm run test           # Run Vitest tests
npm run db:push        # Generate and apply Drizzle migrations
npm run db:seed        # Seed the database
```

### Mobile

```bash
npm run mobile:build   # Build web + sync Capacitor
npm run mobile:android # Open Android Studio
npm run mobile:ios     # Open Xcode
```

---

## 🤝 Contributing

### Code Conventions

- **TypeScript strict mode** — all code must be strictly typed
- **Prettier formatting** — run `npm run format` before committing
- **Double quotes**, semicolons required, 2-space indentation
- **Path aliases** — use `@/` for client imports, `@shared/` for shared code; never use relative paths crossing directory boundaries
- **tRPC for all new API endpoints** — add procedures to `server/routers.ts`
- **Zod for all tRPC input validation**
- **Drizzle ORM for all database access** — use helpers in `server/db.ts`
- **Import types from `@shared/types`** — do not duplicate type definitions
- **New pages** should use `React.lazy()` in `App.tsx` for code splitting

### User Tables

There are two completely separate user systems — do not mix them:
- `users` table → admin users (JWT/bcrypt, `/login`)
- `game_players` table → game players (tRPC procedures, `GameContext`)

### Environment Variables

Access all env vars through the typed `ENV` object from `server/env.ts`, not directly from `process.env`.

---

## 📖 Documentation

| Document | Description |
|---|---|
| [CLAUDE.md](./CLAUDE.md) | Full technical reference (architecture, API, DB schema, auth, CI/CD) |
| [README-AZURE-DEPLOYMENT.md](./README-AZURE-DEPLOYMENT.md) | Step-by-step Azure deployment guide |
| [.env.example](./.env.example) | Environment variable template |

---

## 📄 License

**Proprietary** — All rights reserved.  
© ACNB IA SL. Unauthorized use, distribution, or modification is prohibited.

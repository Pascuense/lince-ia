# Contributing to LINCE IA

Thank you for your interest in contributing to LINCE! This guide covers
everything you need to get started.

---

## Table of Contents

- [Development Setup](#development-setup)
- [Code Style](#code-style)
- [Branch Naming Conventions](#branch-naming-conventions)
- [Commit Message Guidelines](#commit-message-guidelines)
- [Pull Request Process](#pull-request-process)
- [Testing Requirements](#testing-requirements)
- [Architecture Conventions](#architecture-conventions)

---

## Development Setup

### Prerequisites

| Tool | Version | Install |
| --- | --- | --- |
| Node.js | 22+ | [nodejs.org](https://nodejs.org) |
| pnpm | 10.4+ | `npm install -g pnpm` |
| MySQL | 8+ | Local or Azure instance |

### Steps

1. **Fork and clone** the repository:

   ```bash
   git clone https://github.com/<your-fork>/lince-ia.git
   cd lince-ia
   ```

2. **Install dependencies**:

   ```bash
   pnpm install
   ```

3. **Configure environment variables**:

   ```bash
   cp .env.example .env
   # Edit .env with your local values (MySQL, OpenAI, VAPID keys, etc.)
   pnpm check:env   # Validate all required variables are set
   ```

4. **Initialize the database**:

   ```bash
   # Import schema (creates all 9 tables)
   mysql -h <host> -u <user> -p < schema.sql

   # Or use Drizzle migrations:
   pnpm db:push
   ```

5. **Start the dev server**:

   ```bash
   pnpm dev
   # → http://localhost:8080
   ```

The dev server combines Express with hot-reload (tsx watch) and Vite HMR for
the frontend on the same port.

---

## Code Style

Formatting is enforced by **Prettier**. Run before committing:

```bash
pnpm format
```

**Prettier settings** (`.prettierrc`):

| Setting | Value |
| --- | --- |
| Quotes | Double (`"`) |
| Semicolons | Required |
| Trailing commas | ES5 |
| Print width | 80 chars |
| Tab width | 2 spaces (no tabs) |
| Arrow parens | Omit for single arg (`x => x`) |
| Line endings | LF |

**TypeScript** is configured with `strict: true`. All new code must be
fully typed — no `any` unless absolutely necessary with a comment explaining
why.

### Import Conventions

Use path aliases — never use relative paths crossing directory boundaries:

| Alias | Resolves to |
| --- | --- |
| `@/*` | `client/src/*` |
| `@shared/*` | `shared/*` |
| `@assets/*` | `attached_assets/*` |

### UI Components

- Prefer existing Radix UI primitives already installed in the project.
- New pages go in `client/src/pages/` and must be added with `React.lazy()`
  in `App.tsx`.
- New components go in `client/src/components/`.
- UI strings default to Spanish. Add multilingual support via
  `PRDLanguageContext` for any user-visible text.

### Backend Conventions

- **All new API endpoints** → tRPC procedures in `server/routers.ts`
  (or a merged sub-router). Only auth uses plain REST routes.
- **All tRPC input** must be validated with `zod` schemas.
- **All DB access** → Drizzle ORM via helpers in `server/db.ts`. No raw SQL
  except in `schema.sql`.
- **All DB types** → import from `@shared/types` (re-exported from
  `drizzle/schema.ts`).
- **Environment variables** → access through the typed `ENV` object from
  `server/env.ts`, never directly from `process.env`.
- **`users` vs `game_players`** → keep these completely separate. Admins use
  `users`; game participants use `game_players`.

### Security

The server uses **Helmet.js** with a strict CSP. If you need new external
resources (scripts, images, fonts, APIs), update the CSP directives in the
server entry point. Never commit secrets or API keys.

---

## Branch Naming Conventions

```
feat/<short-description>      # New feature
fix/<short-description>       # Bug fix
docs/<short-description>      # Documentation only
refactor/<short-description>  # Code refactoring
test/<short-description>      # Tests only
chore/<short-description>     # Build, config, tooling
```

Examples:

```
feat/avatar-voice-chat
fix/streak-reset-on-midnight
docs/update-deployment-guide
refactor/extract-auth-middleware
```

---

## Commit Message Guidelines

Follow the [Conventional Commits](https://www.conventionalcommits.org/)
specification:

```
<type>(<optional scope>): <short summary>

[optional body]

[optional footer]
```

**Types**: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`, `perf`

Examples:

```
feat(avatar): add voice transcription support
fix(game): correct XP calculation on daily reward claim
docs: add CONTRIBUTING.md
test(auth): add JWT expiry edge cases
chore: update pnpm lockfile
```

- Use the **imperative mood** in the summary ("add" not "added").
- Keep the summary under **72 characters**.
- Reference issues in the footer: `Closes #42`.

---

## Pull Request Process

1. **Create a branch** from `main` following the naming conventions above.

2. **Make your changes**, keeping commits atomic and well-described.

3. **Run checks locally** before opening a PR:

   ```bash
   pnpm format      # Auto-fix formatting
   pnpm check       # TypeScript type check
   pnpm test        # Run all tests
   ```

4. **Open a PR** against `main` with:
   - A clear title following commit conventions
   - A description explaining _what_ changed and _why_
   - Screenshots for any UI changes
   - Reference to the related issue (if applicable)

5. **Address review comments** promptly. Keep the PR focused — avoid
   bundling unrelated changes.

6. **CI must pass** (GitHub Actions build + test) before merging.

---

## Testing Requirements

Tests live in `server/**/*.test.ts` and are run with **Vitest**:

```bash
pnpm test              # Run all tests
pnpm test -- --watch   # Watch mode during development
```

**Expectations**:

- New server-side logic (tRPC procedures, utilities, auth helpers) should have
  corresponding test coverage.
- Tests use the `node` environment — no browser APIs.
- Use the same path aliases (`@shared/*`) as the main build.
- Keep tests isolated — mock external services (DB, Azure OpenAI, Blob
  Storage) rather than requiring live connections.
- There are currently no frontend tests; Vitest is server-side only.

---

## Architecture Conventions

For a comprehensive technical reference including database schema, auth flows,
API architecture, React contexts, CI/CD, and Azure infrastructure, see
[CLAUDE.md](CLAUDE.md).

Quick reference:

- **Frontend router**: [wouter](https://github.com/molefrog/wouter) — routes in
  `client/src/App.tsx`
- **API layer**: tRPC 11 with superjson transformer at `/api/trpc/*`
- **State management**: React Query (server state) + React Context (UI state)
- **Styling**: TailwindCSS 4 utility classes, dark mode default, brand cyan
  `#00E5FF`
- **Mobile**: Capacitor 6 — always build web first (`pnpm mobile:build`), then
  open native IDE

---

For questions or discussion, open an issue or contact **cristobal@acnb.es**.

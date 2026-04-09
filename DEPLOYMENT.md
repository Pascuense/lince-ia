# DEPLOYMENT.md — Quick Deployment Reference

> For the full step-by-step Azure setup guide, see
> **[README-AZURE-DEPLOYMENT.md](README-AZURE-DEPLOYMENT.md)**.

---

## Quick Deployment Checklist

Use this checklist for every deployment to Azure App Service.

### Pre-deployment

- [ ] All environment variables filled in and validated locally:
  ```bash
  pnpm check:env
  ```
- [ ] TypeScript compiles without errors:
  ```bash
  pnpm check
  ```
- [ ] All tests pass:
  ```bash
  pnpm test
  ```
- [ ] Code formatted:
  ```bash
  pnpm format
  ```
- [ ] Changes committed and pushed to `main`.

### Build

```bash
pnpm install      # Ensure lockfile is up to date
pnpm build        # Vite frontend → dist/public/ + esbuild server → dist/index.js
```

Expected output:

```
dist/
├── index.js        # Express server bundle
└── public/         # Static frontend assets
    ├── index.html
    └── assets/
```

### Deploy via GitHub Actions (recommended)

Push to `main` triggers `.github/workflows/main_lince-app.yml` automatically.
Monitor in **GitHub → Actions → deploy to azure**.

### Deploy manually (ZIP)

```bash
cd dist
zip -r ../lince-deploy.zip .
az webapp deploy \
  --name lince-app \
  --resource-group rg-lince \
  --src-path ../lince-deploy.zip \
  --type zip
```

### Post-deployment verification

- [ ] GitHub Actions (or manual deploy) completed with green status.
- [ ] All environment variables set in Azure App Service → Environment variables.
- [ ] App Service restarted after any env var changes.
- [ ] Open `https://lince-app.azurewebsites.net` and do a hard refresh
  (`Ctrl+F5`).
- [ ] Test login + main game flow.

---

## Environment Variables

### Required at Runtime

| Variable | Description |
| --- | --- |
| `DATABASE_URL` | MySQL connection string with SSL |
| `JWT_SECRET` | Long random string for JWT signing |
| `AZURE_OPENAI_ENDPOINT` | Azure OpenAI resource endpoint |
| `AZURE_OPENAI_KEY` | Azure OpenAI API key |
| `AZURE_OPENAI_DEPLOYMENT` | Deployment name (e.g. `gpt-4o`) |
| `AZURE_STORAGE_CONNECTION_STRING` | Azure Blob Storage connection string |
| `AZURE_STORAGE_CONTAINER` | Blob container name (`lince-uploads`) |
| `VAPID_PUBLIC_KEY` | VAPID public key |
| `VAPID_PRIVATE_KEY` | VAPID private key |
| `VAPID_CONTACT_EMAIL` | Contact email for VAPID |
| `NODE_ENV` | `production` |
| `PORT` | Server port (default: `8080`) |

### Build-time (Injected into Frontend Bundle)

| Variable | Description |
| --- | --- |
| `VITE_APP_TITLE` | Browser tab title |
| `VITE_VAPID_PUBLIC_KEY` | VAPID public key for push subscription |

Generate VAPID keys:

```bash
npx web-push generate-vapid-keys
```

Set environment variables in Azure:

```bash
az webapp config appsettings set \
  --name lince-app \
  --resource-group rg-lince \
  --settings KEY="VALUE" KEY2="VALUE2"
```

---

## Database Initialization

Apply schema to a fresh MySQL instance:

```bash
mysql -h <host> -u <user> -p --ssl-mode=REQUIRED < schema.sql
```

This creates 9 tables: `users`, `game_players`, `prompt_creations`,
`legal_acceptances`, `custom_courses`, `tool_views`, `chat_sessions`,
`chat_messages`, `push_subscriptions`.

Create the first admin user:

```bash
# Generate bcrypt hash (project uses ESM, so use dynamic import)
node --input-type=module <<'EOF'
import bcrypt from 'bcryptjs';
const hash = await bcrypt.hash('YOUR_PASSWORD', 12);
console.log(hash);
EOF

# Insert into MySQL
INSERT INTO users (email, passwordHash, name, role)
VALUES ('admin@example.com', '<hash>', 'Admin', 'admin');
```

---

## Azure App Service Configuration

These settings must be applied once (or after a recovery):

```bash
# Use Node.js 22 LTS
az webapp config set --name lince-app --resource-group rg-lince \
  --linux-fx-version "NODE|22-lts"

# Set startup command
az webapp config set --name lince-app --resource-group rg-lince \
  --startup-file "npm start"

# Disable Azure auto-build (deploy pre-built artifacts only)
az webapp config appsettings set --name lince-app --resource-group rg-lince \
  --settings SCM_DO_BUILD_DURING_DEPLOYMENT=false ENABLE_ORYX_BUILD=false

# Enable WebSockets (for tRPC batching)
az webapp config set --name lince-app --resource-group rg-lince \
  --web-sockets-enabled true
```

---

## Mobile (Capacitor)

### Android AAB (Google Play)

Trigger the **Android Release** workflow manually from GitHub Actions:
`Actions → android-release → Run workflow`.

Required secrets in GitHub repository settings:

- `ANDROID_KEYSTORE_BASE64`
- `KEYSTORE_STORE_PASSWORD`
- `KEYSTORE_KEY_ALIAS`
- `KEYSTORE_KEY_PASSWORD`
- `VITE_VAPID_PUBLIC_KEY`

### Local mobile build

```bash
pnpm mobile:build   # Build web + cap sync
pnpm mobile:android # Open Android Studio
pnpm mobile:ios     # Open Xcode
```

---

## Common Issues and Solutions

### App not starting after deployment

```bash
# Check live logs
az webapp log tail --name lince-app --resource-group rg-lince
```

1. Verify `dist/index.js` exists in the deployed artifact (Kudu →
   Debug console → `ls -la dist/`).
2. Verify startup command is `npm start`.
3. Verify `SCM_DO_BUILD_DURING_DEPLOYMENT=false` and
   `ENABLE_ORYX_BUILD=false` are set.

### MySQL connection error

- Confirm the App Service's outbound IP is whitelisted in Azure MySQL firewall
  rules.
- Verify `?ssl={"rejectUnauthorized":true}` is in `DATABASE_URL`.

### Azure OpenAI errors

- Run `az cognitiveservices account deployment list` to confirm the deployment
  name matches `AZURE_OPENAI_DEPLOYMENT`.

### Blob Storage upload errors

- Confirm container `lince-uploads` exists with **Blob** public access level.
- Verify the connection string in `AZURE_STORAGE_CONNECTION_STRING`.

### One-command recovery

```bash
./scripts/azure-recover.sh lince-app rg-lince
```

---

For full Azure provisioning steps (creating resources, configuring OpenAI,
Blob Storage, etc.) see **[README-AZURE-DEPLOYMENT.md](README-AZURE-DEPLOYMENT.md)**.

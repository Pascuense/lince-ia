# LINCE — Guía de Despliegue en Microsoft Azure

> **Plataforma EdTech gamificada de formación en Inteligencia Artificial**
> Propiedad de **ACNB IA SL** — www.acnb.es

---

## Datos del Entorno Azure

| Recurso | Nombre | Región |
|---|---|---|
| **Grupo de recursos** | `rg-lince` | France Central |
| **App Service** | `lince-app` | France Central |
| **MySQL Flexible Server** | `lince-db-acnb.mysql.database.azure.com` | France Central |
| **Base de datos** | `lince_db` | — |
| **Azure Blob Storage** | (crear cuenta de almacenamiento) | France Central |
| **Azure OpenAI Service** | (crear recurso OpenAI) | France Central / Sweden Central |

---

## Requisitos Previos

1. **Azure CLI** instalado y autenticado (`az login`)
2. **Node.js 22+** y **pnpm** instalados localmente
3. **Azure Database for MySQL Flexible Server** creado con:
   - Nombre del servidor: `lince-db-acnb`
   - Base de datos: `lince_db`
   - SSL habilitado
4. **Azure OpenAI Service** con un deployment de `gpt-4o` (o `gpt-4o-mini`)
5. **Azure Blob Storage** con un contenedor llamado `lince-uploads` (acceso público a nivel de blob)

---

## Paso 1: Crear la Base de Datos

```bash
# Conectar al servidor MySQL de Azure
mysql -h lince-db-acnb.mysql.database.azure.com \
      -u lince_admin \
      -p \
      --ssl-mode=REQUIRED \
      < schema.sql
```

Esto crea las 9 tablas necesarias:
- `users` — Administradores del sistema (auth JWT/bcrypt)
- `game_players` — Jugadores registrados en LINCE
- `prompt_creations` — Creaciones del Prompt Studio
- `legal_acceptances` — Aceptaciones legales (NDA/IP)
- `custom_courses` — Cursos personalizados
- `tool_views` — Tracking del Arsenal IA
- `chat_sessions` — Sesiones de chat con avatares
- `chat_messages` — Mensajes individuales de chat
- `push_subscriptions` — Suscripciones de notificaciones push

---

## Paso 2: Configurar Azure Blob Storage

```bash
# Crear cuenta de almacenamiento (si no existe)
az storage account create \
  --name linceblob \
  --resource-group rg-lince \
  --location francecentral \
  --sku Standard_LRS \
  --kind StorageV2

# Crear contenedor con acceso público a nivel de blob
az storage container create \
  --name lince-uploads \
  --account-name linceblob \
  --public-access blob

# Obtener la connection string
az storage account show-connection-string \
  --name linceblob \
  --resource-group rg-lince \
  --output tsv
```

---

## Paso 3: Configurar Azure OpenAI

```bash
# Crear recurso de Azure OpenAI (si no existe)
az cognitiveservices account create \
  --name lince-openai \
  --resource-group rg-lince \
  --kind OpenAI \
  --sku S0 \
  --location swedencentral

# Crear deployment de modelo
az cognitiveservices account deployment create \
  --name lince-openai \
  --resource-group rg-lince \
  --deployment-name gpt-4o \
  --model-name gpt-4o \
  --model-version "2024-08-06" \
  --model-format OpenAI \
  --sku-capacity 30 \
  --sku-name Standard

# Obtener endpoint y key
az cognitiveservices account show \
  --name lince-openai \
  --resource-group rg-lince \
  --query properties.endpoint -o tsv

az cognitiveservices account keys list \
  --name lince-openai \
  --resource-group rg-lince \
  --query key1 -o tsv
```

---

## Paso 4: Build del Proyecto

```bash
# Instalar dependencias
pnpm install

# Build del cliente (Vite) y servidor (esbuild)
pnpm build
```

Esto genera:
- `dist/public/` — Archivos estáticos del frontend (HTML, CSS, JS)
- `dist/index.js` — Servidor Express compilado

---

## Paso 5: Configurar Variables de Entorno en Azure

```bash
# Copiar .env.example a .env y rellenar valores reales
cp .env.example .env

# Configurar en Azure App Service
az webapp config appsettings set \
  --name lince-app \
  --resource-group rg-lince \
  --settings \
    DATABASE_URL="mysql://lince_admin:TU_PASSWORD@lince-db-acnb.mysql.database.azure.com:3306/lince_db?ssl={\"rejectUnauthorized\":true}" \
    JWT_SECRET="7adf4ebe6dde1a1335715620f70215bb456386dcae09d8944cba08c8182732a9e0495022afbad931bb142a7fb2f02c565993302b6d84085140ba7f32cce3852b" \
    AZURE_OPENAI_ENDPOINT="https://lince-openai.openai.azure.com" \
    AZURE_OPENAI_KEY="TU_KEY_AQUI" \
    AZURE_OPENAI_DEPLOYMENT="gpt-4o" \
    AZURE_STORAGE_CONNECTION_STRING="TU_CONNECTION_STRING" \
    AZURE_STORAGE_CONTAINER="lince-uploads" \
    VAPID_PUBLIC_KEY="BP3MKWcRIMkmyV5Y91BRwYSZJIJdsfqtWos3PDc_iL5MupRvUBGuG4pJjSSZuWB3yUHFK8KU9kB8PDukw_qiaRc" \
    VAPID_PRIVATE_KEY="OtJn81tB31F2WVr49pHmx5AET72we3IXI5j97tSaOSM" \
    VAPID_CONTACT_EMAIL="cristobal@acnb.es" \
    NODE_ENV="production" \
    VITE_APP_TITLE="LINCE - Aprende IA Jugando" \
    VITE_VAPID_PUBLIC_KEY="BP3MKWcRIMkmyV5Y91BRwYSZJIJdsfqtWos3PDc_iL5MupRvUBGuG4pJjSSZuWB3yUHFK8KU9kB8PDukw_qiaRc"
```

---

## Paso 6: Desplegar en Azure App Service

### Opción A: Despliegue con ZIP

```bash
# Crear archivo ZIP del build
cd dist
zip -r ../lince-deploy.zip .

# Desplegar
az webapp deploy \
  --name lince-app \
  --resource-group rg-lince \
  --src-path ../lince-deploy.zip \
  --type zip
```

### Opción B: Despliegue con Git

```bash
# Configurar deployment desde Git local
az webapp deployment source config-local-git \
  --name lince-app \
  --resource-group rg-lince

# Obtener URL de Git remoto
az webapp deployment list-publishing-credentials \
  --name lince-app \
  --resource-group rg-lince \
  --query scmUri -o tsv

# Añadir remoto y push
git remote add azure <URL_DEL_PASO_ANTERIOR>
git push azure main
```

### Opción C: GitHub Actions (CI/CD)

Crear `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Azure
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
      - uses: pnpm/action-setup@v4
        with:
          version: 9
      - run: pnpm install
      - run: pnpm build
      - uses: azure/webapps-deploy@v3
        with:
          app-name: lince-app
          publish-profile: ${{ secrets.AZURE_WEBAPP_PUBLISH_PROFILE }}
          package: dist
```

---

## Paso 7: Configurar App Service

```bash
# Configurar Node.js 22
az webapp config set \
  --name lince-app \
  --resource-group rg-lince \
  --linux-fx-version "NODE|22-lts"

# Configurar startup command
az webapp config set \
  --name lince-app \
  --resource-group rg-lince \
  --startup-file "node index.js"

# Habilitar WebSockets (para tRPC batch)
az webapp config set \
  --name lince-app \
  --resource-group rg-lince \
  --web-sockets-enabled true

# Configurar always-on
az webapp config set \
  --name lince-app \
  --resource-group rg-lince \
  --always-on true
```

---

## Paso 8: Crear el Primer Administrador

Después del despliegue, crear el admin desde MySQL:

```sql
-- Generar hash bcrypt para la contraseña del admin
-- Puedes usar: node -e "const bcrypt = require('bcryptjs'); bcrypt.hash('TU_PASSWORD', 12).then(console.log)"

INSERT INTO users (email, passwordHash, name, role)
VALUES (
  'cristobal@acnb.es',
  '$2a$12$HASH_GENERADO_AQUI',
  'Cristóbal',
  'admin'
);
```

---

## Estructura del Proyecto

```
lince-azure/
├── client/                    # Frontend React 19
│   ├── public/                # Assets estáticos (manifest, iconos, SW)
│   └── src/
│       ├── components/        # 60+ componentes UI
│       ├── contexts/          # Contextos React (Game, PRDLanguage)
│       ├── hooks/             # Custom hooks
│       ├── lib/               # Constantes (avatares, juego, herramientas)
│       ├── pages/             # 30+ páginas
│       ├── App.tsx            # Rutas
│       ├── main.tsx           # Punto de entrada
│       └── index.css          # Tema CSS
├── server/                    # Backend Express + tRPC
│   ├── auth.ts                # JWT auth (bcrypt + jose)
│   ├── cookies.ts             # Cookie helpers
│   ├── db.ts                  # Database helpers (Drizzle ORM)
│   ├── env.ts                 # Variables de entorno Azure
│   ├── imageGeneration.ts     # Azure OpenAI DALL-E
│   ├── index.ts               # Servidor Express
│   ├── llm.ts                 # Azure OpenAI Chat
│   ├── notification.ts        # Notificaciones
│   ├── pushScheduler.ts       # Scheduler de push
│   ├── pushService.ts         # Web Push (VAPID)
│   ├── routers.ts             # tRPC routers (2300+ líneas)
│   ├── storage.ts             # Azure Blob Storage
│   ├── systemRouter.ts        # Health check + admin
│   ├── trpc.ts                # tRPC context
│   └── vite.ts                # Vite dev helper
├── shared/                    # Código compartido
│   ├── avatarPrompts/         # 8 archivos de personalidades
│   ├── const.ts               # Constantes
│   └── types.ts               # Tipos compartidos
├── drizzle/                   # Schema y migraciones
│   └── schema.ts              # 9 tablas
├── .env.example               # Variables de entorno
├── schema.sql                 # SQL completo
├── package.json               # Dependencias
├── tsconfig.json              # TypeScript config
├── vite.config.ts             # Vite config
├── vitest.config.ts           # Test config
└── drizzle.config.ts          # Drizzle config
```

---

## Stack Tecnológico

| Capa | Tecnología |
|---|---|
| **Frontend** | React 19, Tailwind CSS 4, Vite 6 |
| **Backend** | Express 4, tRPC 11, Node.js 22 |
| **Base de datos** | Azure MySQL Flexible Server, Drizzle ORM |
| **IA** | Azure OpenAI Service (GPT-4o, DALL-E 3) |
| **Almacenamiento** | Azure Blob Storage |
| **Auth** | JWT (jose) + bcrypt |
| **Push** | Web Push API (web-push + VAPID) |
| **PWA** | Service Worker, Web App Manifest |

---

## Claves VAPID Generadas

Estas claves están incluidas en `.env.example` y son únicas para este despliegue:

```
Public:  BP3MKWcRIMkmyV5Y91BRwYSZJIJdsfqtWos3PDc_iL5MupRvUBGuG4pJjSSZuWB3yUHFK8KU9kB8PDukw_qiaRc
Private: OtJn81tB31F2WVr49pHmx5AET72we3IXI5j97tSaOSM
```

> **Nota:** Puedes generar nuevas claves con: `npx web-push generate-vapid-keys`

---

## Resolución de Problemas

### Error de conexión a MySQL
- Verificar que el firewall de Azure MySQL permite conexiones desde el App Service
- Verificar que SSL está habilitado: `?ssl={"rejectUnauthorized":true}`
- Comprobar credenciales en `DATABASE_URL`

### Error de Azure OpenAI
- Verificar que el deployment existe: `az cognitiveservices account deployment list`
- Comprobar que la región soporta el modelo seleccionado
- Verificar la key y el endpoint

### Error de Blob Storage
- Verificar que el contenedor `lince-uploads` existe con acceso público a nivel de blob
- Comprobar la connection string

### La app no arranca
- Revisar logs: `az webapp log tail --name lince-app --resource-group rg-lince`
- Verificar startup command: `node index.js`
- Comprobar que todas las variables de entorno están configuradas

---

## Contacto

**ACNB IA SL** — cristobal@acnb.es — www.acnb.es

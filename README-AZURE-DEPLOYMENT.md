# LINCE — Guía de Despliegue en Microsoft Azure

> **Plataforma EdTech gamificada de formación en Inteligencia Artificial**
> Propiedad de **ACNB IA SL** — www.acnb.es

---

## Datos del Entorno Azure

| Recurso                   | Nombre                                   | Región                          |
| ------------------------- | ---------------------------------------- | ------------------------------- |
| **Grupo de recursos**     | `rg-lince`                               | France Central                  |
| **App Service**           | `lince-app`                              | France Central                  |
| **MySQL Flexible Server** | `lince-db-acnb.mysql.database.azure.com` | France Central                  |
| **Base de datos**         | `lince_db`                               | —                               |
| **Azure Blob Storage**    | (crear cuenta de almacenamiento)         | France Central                  |
| **Azure OpenAI Service**  | (crear recurso OpenAI)                   | France Central / Sweden Central |

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
    JWT_SECRET="REEMPLAZAR_CON_UN_SECRETO_LARGO_Y_ALEATORIO" \
    AZURE_OPENAI_ENDPOINT="https://lince-openai.openai.azure.com" \
    AZURE_OPENAI_KEY="TU_KEY_AQUI" \
    AZURE_OPENAI_DEPLOYMENT="gpt-4o" \
    AZURE_STORAGE_CONNECTION_STRING="TU_CONNECTION_STRING" \
    AZURE_STORAGE_CONTAINER="lince-uploads" \
    VAPID_PUBLIC_KEY="TU_VAPID_PUBLIC_KEY" \
    VAPID_PRIVATE_KEY="TU_VAPID_PRIVATE_KEY" \
    VAPID_CONTACT_EMAIL="tu-email@tu-dominio.com" \
    NODE_ENV="production" \
    VITE_APP_TITLE="LINCE - Aprende IA Jugando" \
    VITE_VAPID_PUBLIC_KEY="TU_VAPID_PUBLIC_KEY"
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
  --startup-file "npm start"

# Asegurar build durante despliegue (si usas OneDeploy/ZipDeploy)
az webapp config appsettings set \
  --name lince-app \
  --resource-group rg-lince \
  --settings SCM_DO_BUILD_DURING_DEPLOYMENT=true

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

## Diagnóstico rápido en Azure (portal en español)

Si la página no abre, sigue este flujo:

1. **Implementación → Centro de implementación**
2. Entra a **Registros**
3. Abre el último despliegue y verifica si se ejecutaron `npm install` y `npm run build`
4. Si hay error (por ejemplo `vite not found`, `tsc`, `module not found`), copia 20–40 líneas alrededor

### Verificación definitiva de build (Kudu)

1. **Herramientas de desarrollo → Herramientas avanzadas**
2. Pulsa **Ir**
3. En Kudu: **Debug console → Bash**
4. Ejecuta:

```bash
ls -la
ls -la dist || echo "NO HAY dist"
ls -la dist/index.js || echo "NO HAY dist/index.js"
```

Si no existe `dist/index.js`, el despliegue no está dejando el build correcto para el comando de inicio.

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

| Capa               | Tecnología                               |
| ------------------ | ---------------------------------------- |
| **Frontend**       | React 19, Tailwind CSS 4, Vite 6         |
| **Backend**        | Express 4, tRPC 11, Node.js 22           |
| **Base de datos**  | Azure MySQL Flexible Server, Drizzle ORM |
| **IA**             | Azure OpenAI Service (GPT-4o, DALL-E 3)  |
| **Almacenamiento** | Azure Blob Storage                       |
| **Auth**           | JWT (jose) + bcrypt                      |
| **Push**           | Web Push API (web-push + VAPID)          |
| **PWA**            | Service Worker, Web App Manifest         |

---

## Claves VAPID

No guardes claves reales en el repositorio. Genera y configura las tuyas en cada entorno:

```bash
npx web-push generate-vapid-keys
```

Después copia los valores en `VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY` y `VITE_VAPID_PUBLIC_KEY`.

---

## Checklist rápido (cuando "necesito que funcione ya")

1. Confirmar que GitHub Actions (`build` y `deploy`) terminó en verde.
2. Verificar que todas las variables de entorno están cargadas en App Service.
3. Guardar cambios de variables y ejecutar `Restart` de la app.
4. En tu terminal (raíz del repo), validar variables localmente con `pnpm check:env`.
5. Abrir `https://<tu-app>.azurewebsites.net` y hacer `Ctrl+F5`.
6. Probar login + flujo principal del producto.
7. Si falla, revisar logs en vivo:

```bash
az webapp log tail --name lince-app --resource-group rg-lince
```

---

## Validación local rápida de entorno

Antes de desplegar, en la **raíz del proyecto** ejecuta:

```bash
pnpm check:env
```

Si quieres validar otro archivo, usa:

```bash
pnpm check:env -- --file .env.production
```

> El chequeo carga `.env` automáticamente (si existe), valida variables obligatorias de runtime (`DATABASE_URL`, `JWT_SECRET`, `AZURE_OPENAI_*`, `AZURE_STORAGE_*`, `VAPID_*`, `NODE_ENV`, `PORT`) y reporta `VITE_*` como recomendadas.

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
- Verificar startup command: `npm start` (o `node dist/index.js`)
- Comprobar que todas las variables de entorno están configuradas

---

## Contacto

**ACNB IA SL** — cristobal@acnb.es — www.acnb.es

# flycms frontend (RuoYi-Vue v3.9.0)

## Stack

Vue 3 + Element Plus + Vite 6 + Pinia + Vue Router 4.
Package manager is **yarn** (not npm/pnpm). No lint, typecheck, or test scripts are configured.

## Commands

| Command | Action |
|---|---|
| `yarn dev` | Dev server at **http://localhost:80** (not the Vite default 5173) |
| `yarn build:prod` | Production build → `dist/` |
| `yarn build:stage` | Staging build |
| `yarn preview` | Preview production build |

## Dev server quirks

- Dev port is **80** (`vite.config.js:45`). May require admin privileges on some systems.
- `/dev-api` routes proxy to `http://localhost:8080` (the Java backend).
- Path aliases: `@` → `./src`, `~` → project root.

## Architecture

- **Standard RuoYi admin**: `src/views/{system,monitor,tool}/`, `src/api/{system,monitor,tool}/`
- **CMS admin panel**: `src/views/cms/`, `src/api/cms/` — site/article/category/theme/tag/advertise management
- **Public-facing pages**: `src/views/web/` — dynamically routed via `/web/:siteCode/:theme?`. Site info loaded from `src/store/modules/cms.js`.
- **Entrypoint**: `src/main.js` — registers global components (Pagination, FileUpload, DictTag, etc.), plugins, directives.
- **Auth/permission guard**: `src/permission.js` — runs before each route; white-lists `/web/*` paths from auth.
- **API client**: `src/utils/request.js` — axios wrapper with token injection, auto-retry, download helper.

## Project quirks

- **`yarn.lock` is gitignored** (`.gitignore:23`). Do not commit it.
- **`.env.*` files are gitignored**. Create `.env.development.local` etc. for local overrides.
- `VITE_APP_BASE_API` controls the API proxy prefix (`/dev-api` in dev, `/prod-api` in production).
- Build output uses a custom chunk pattern: `static/js/[name]-[hash].js`, `static/[ext]/[name]-[hash].[ext]`.
- Uses `unplugin-auto-import` — some Vue APIs may auto-resolve without explicit imports.
- Uses `unplugin-vue-setup-extend-plus` — `<script setup>` components can use `name` attribute.
- SASS/SCSS support via `sass-embedded` (globally available, no extra config).
- SVG icon system via `vite-plugin-svg-icons` (use `<svg-icon icon-class="name" />`).

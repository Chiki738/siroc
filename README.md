# SIROC

SIROC es una plataforma web para registrar, revisar y validar organizaciones civiles en Perú. El panel centraliza solicitudes, cruza datos de representantes y organizaciones con servicios del backend, y expone un dashboard operativo para seguimiento institucional.

## Enfoque del proyecto

- Interfaz administrativa construida con React, TypeScript y Vite.
- Gestión de solicitudes, validaciones RENIEC/SUNAT y detalle de expedientes.
- Estilos propios sobre Bootstrap para una experiencia limpia, responsive y consistente.
- Configuración preparada para repositorios públicos: variables de entorno, lockfile de `pnpm` y documentación técnica.

## Stack principal

- React 19
- TypeScript 6
- Vite 6
- React Router 7
- TanStack Query 5
- Bootstrap 5
- HeroUI
- Lucide React
- SweetAlert2
- pnpm 11

## Estructura

```txt
src/
  assets/          Recursos visuales y estilos globales
  components/      Componentes reutilizables de navegación y UI
  config/          Endpoints y configuración por entorno
  dashboard/       Dashboard analítico servido con Python/Dash
  hooks/           Hooks de datos y casos de uso del frontend
  layouts/         Layouts de la aplicación administrativa
  pages/           Vistas principales del sistema
  services/        Integración con APIs externas y backend
  types/           Tipos compartidos de dominio
```

## Variables de entorno

Crea un archivo `.env` tomando como referencia `.env.example`.

```env
VITE_API_BASE_URL=https://hexagonal-63ip.onrender.com/api
VITE_DASHBOARD_URL=http://localhost:8050
VITE_UPLOADCARE_PUBLIC_KEY=replace-with-uploadcare-public-key
```

El dashboard Python usa variables `NEON_DB_*` para conectarse a la base de datos. No se deben versionar credenciales reales.

## Scripts

```bash
pnpm install
pnpm dev
pnpm lint
pnpm typecheck
pnpm build
pnpm preview
```

`pnpm dev` levanta el frontend con Vite y el dashboard local configurado en `src/dashboard/app.py`.

## Notas de mantenimiento

- Este repositorio usa únicamente `pnpm` para dependencias web.
- `pnpm-lock.yaml` debe mantenerse versionado.
- `package-lock.json`, `yarn.lock` y otros lockfiles no pertenecen a este proyecto.
- Los endpoints del frontend se centralizan en `src/config/api.ts`.
- Los estilos base de la experiencia SIROC viven en `src/assets/styles/global.css`.
- Vite se mantiene en la línea 6 junto con `@vitejs/plugin-react` 4 porque el salto a Vite 8/plugin 6 requiere peers adicionales de compilación que no forman parte de esta configuración.

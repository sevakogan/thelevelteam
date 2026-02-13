# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

TheLevelTeam is an agency portfolio site showcasing 5 client projects. Built with Next.js 14, Supabase, Framer Motion, and Vitest.

## Commands

```bash
npm run dev       # Dev server (localhost:3000)
npm run build     # Production build
npm run lint      # ESLint (next/core-web-vitals + next/typescript)
npm test          # Vitest watch mode
npm run test:ci   # Vitest single run (CI mode)
```

Run a single test: `npx vitest run src/__tests__/path/to/test.ts`

## Architecture

### Routing
- `/` — home page (server component fetching companies via `getCompanies()`)
- `/projects/[slug]` — dynamic project detail pages (SSG via `generateStaticParams()`)
- `/admin` — password-protected portfolio management (CRUD via API routes)
- `/api/companies` and `/api/companies/[id]` — REST endpoints for companies

### Data Layer
- `src/lib/supabase.ts` — browser client (anon key)
- `src/lib/supabase-server.ts` — server client (`SUPABASE_SERVICE_ROLE_KEY` for admin mutations)
- `src/lib/companies.ts` — fetches from Supabase with **hardcoded fallback data** if DB unavailable
- `src/lib/projectContent.ts` — static project details (features, screenshots, outcomes) decoupled from DB
- Table: `companies` (name, slug, tagline, description, image_url, live_url, colors, tech_stack, display_order, is_featured)

### Admin Authentication
API mutation routes (POST/PUT/DELETE) check `x-admin-password` header against `process.env.ADMIN_PASSWORD`. No session/JWT auth.

### Animations
- `src/lib/animations.ts` — shared Framer Motion variants (`fadeInUp`, `staggerContainer`, `scaleIn`)
- `src/lib/useParallax.ts` — custom scroll-linked parallax hook
- `src/components/ui/Starfield.tsx` — canvas-based twinkling starfield background

### Testing
- **Vitest** with jsdom, setup file `src/__tests__/setup.tsx`
- Mocks: `next/image` → plain `<img>`, `framer-motion` → plain elements with props stripped
- Tests in `src/__tests__/` (api/, admin/, components/)

### Path Alias
`@/*` → `./src/*`

## Environment Variables

```
NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
ADMIN_PASSWORD
```

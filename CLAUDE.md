# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
npm run dev       # start dev server at http://localhost:3000
npm run build     # production build
npm run lint      # run Biome linter (biome check)
npm run format    # auto-format with Biome
```

No test runner is configured. There is no `npm test`.

## Architecture

MiniStack UI is a **Next.js 16 + React 19** dashboard for browsing resources in a locally running [MiniStack](https://github.com/ministack/ministack) instance (a LocalStack-compatible AWS emulator). It is a pure read-only client — it does not manage state in the emulator, only displays it.

### Data flow

1. **`src/lib/ministack-client.ts`** — base HTTP client. All calls go to `NEXT_PUBLIC_MINISTACK_ENDPOINT` (default `http://localhost:4566`) with a dummy AWS v4 auth header.
2. **`src/lib/services/*.ts`** — one file per AWS service (S3, DynamoDB, Lambda, SQS, SNS, Secrets Manager). Each exports typed list functions that call `apiFetch` and parse the XML/JSON responses.
3. **`src/app/api/health/route.ts`** and **`src/app/api/reset/route.ts`** — Next.js Route Handlers that proxy `/_ministack/health` and `/_ministack/reset` from the server side (avoids CORS for those endpoints).
4. **`src/hooks/useHealth.ts`** — polls `/api/health` every 5 s, exposes `{ healthy, version, endpoint, services }`.
5. **Pages** call service list functions directly from the browser (client components) and display results.

### Layout & shell

- **`src/app/layout.tsx`** wraps everything in `<AppShell>`, which provides the `SearchContext` and renders `<Sidebar>` + `<TopBar>`.
- **`src/contexts/search.tsx`** — a simple React context for the global search query string; state lives in `AppShell`, cleared on navigation.
- **`src/components/Sidebar.tsx`** — collapsible left nav with per-service links; shows live health dot via `useHealth`.

### Pages

| Route | File | Purpose |
|---|---|---|
| `/` | `src/app/page.tsx` | Dashboard — service cards with resource counts, health stats |
| `/resources/[service]` | `src/app/resources/[service]/page.tsx` | Resource table for a single service; uses `SERVICE_CONFIG` map |

Both pages are `"use client"` components.

### Adding a new service

1. Create `src/lib/services/<name>.ts` with typed list functions using `apiFetch`.
2. Add the service to `SERVICES` in `src/app/page.tsx` (dashboard card).
3. Add the service key + `ServiceConfig` entry to `SERVICE_CONFIG` in `src/app/resources/[service]/page.tsx`.
4. Add the nav link to `NAV_ITEMS` in `src/components/Sidebar.tsx`.
5. Place the AWS icon SVG in `public/icons/aws/`.

## Tooling

- **Biome 2.x** handles both linting and formatting (replaces ESLint + Prettier). Config in `biome.json`. 2-space indent, organise-imports on save.
- **Tailwind CSS v4** via `@tailwindcss/postcss`. Theme tokens (`--color-background`, `--color-foreground`, font vars) are defined in `globals.css` using `@theme inline`.
- **TypeScript** strict mode. No `any` in service files.
- **Fonts**: JetBrains Mono is the body/code font; Geist Sans for headings; Geist Mono available via CSS var.

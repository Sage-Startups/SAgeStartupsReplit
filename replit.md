# Sage-Startups

AI-powered branding automation SaaS for startups.

## Project Overview

Sage-Startups gives founders access to a suite of AI bots for marketing, branding, advertising, and analytics — gated by subscription tier (free / pro / premium).

## Architecture

| Layer | Technology |
|---|---|
| Frontend | React 18 + TypeScript + Vite |
| Routing | wouter |
| Styling | Tailwind CSS + shadcn/ui (Radix primitives) |
| Server state | TanStack Query v5 |
| Backend | Node.js + Express + TypeScript (ESM) |
| Database | PostgreSQL via Neon serverless |
| ORM | Drizzle ORM + drizzle-zod |
| Sessions | connect-pg-simple (Postgres-backed) |
| Auth | Email/password (bcrypt) + Replit OIDC (optional) |
| Deployment | Railway |

## Dev Setup

```bash
cp .env.example .env   # fill in DATABASE_URL + SESSION_SECRET at minimum
npm install
npm run db:push        # create tables
npm run dev            # starts on port 5000
```

The app boots with zero secrets (uses MemStorage when DATABASE_URL is absent). Only DATABASE_URL + SESSION_SECRET are required for full functionality.

## Project Structure

```
client/          React SPA (Vite root)
  src/
    components/  shadcn/ui components + app components
    hooks/       Custom React hooks
    lib/         queryClient, utils
    pages/       Route-level page components
server/
  index.ts       Express bootstrap + listener
  routes.ts      All API route registration
  auth.ts        Bcrypt helpers, session utilities
  authRoutes.ts  /api/auth/* route handlers
  storage.ts     IStorage interface + MemStorage + DbStorage
  db.ts          Neon serverless connection
  vite.ts        Vite dev middleware
shared/
  schema.ts      Drizzle tables + Zod schemas + TS types
migrations/      Drizzle-generated SQL migrations
```

## Subscription Tiers

| Tier | Access |
|---|---|
| free | 2 bots per section, 7-day trial |
| pro | First half of each section |
| premium | All bots |

## User Preferences

- Keep all external services optional — app must boot with zero env vars
- Type-safe end-to-end via shared/schema.ts
- No comments explaining what code does; only non-obvious WHY comments
- No unused variables or backwards-compat shims
- Railway is the deployment target

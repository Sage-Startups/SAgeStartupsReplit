# Sage Startups — Deployment Guide

AI-powered branding automation SaaS. 67 AI bots across branding, marketing, advertising, and analytics.

## Tech Stack

| Layer | Tech |
|---|---|
| Frontend | React 18 + TypeScript + Vite, wouter, Tailwind CSS + shadcn/ui, TanStack Query v5 |
| Backend | Node.js + Express + TypeScript (ESM) |
| Database | PostgreSQL via Neon serverless, Drizzle ORM |
| Sessions | connect-pg-simple (Postgres) or in-memory fallback |
| AI | OpenAI gpt-4o + DALL-E 3 |
| Payments | Stripe |
| Email | SendGrid |
| Auth | Email/password sessions + optional Replit OIDC |

## Zero-Secret Boot

The app **boots with zero environment variables configured**. Missing secrets disable features gracefully:

| Missing secret | Behavior |
|---|---|
| `DATABASE_URL` | Uses in-memory storage (data lost on restart) |
| `OPENAI_API_KEY` | Bot runs return a friendly error message |
| `STRIPE_SECRET_KEY` | Checkout shows "unavailable" card |
| `SENDGRID_API_KEY` | Emails are logged to console, not sent |

## Environment Variables

### Required for Production

```bash
DATABASE_URL=postgres://...        # Neon or any Postgres connection string
SESSION_SECRET=<32+ random chars>  # Used to sign session cookies
```

### AI Bots
```bash
OPENAI_API_KEY=sk-...              # gpt-4o text + DALL-E 3 images
```

### Payments (Stripe)
```bash
STRIPE_SECRET_KEY=sk_live_...      # Server-side Stripe key
STRIPE_WEBHOOK_SECRET=whsec_...    # From Stripe webhook dashboard
VITE_STRIPE_PUBLIC_KEY=pk_live_... # Client-side (injected at build time)
VITE_STRIPE_PRO_PRICE_ID=price_... # Pro tier price ID from Stripe
VITE_STRIPE_PREMIUM_PRICE_ID=price_... # Premium tier price ID
```

### Email
```bash
SENDGRID_API_KEY=SG....            # SendGrid API key
SENDGRID_FROM_EMAIL=hello@sage-startups.com  # Verified sender
```

### Optional: Replit Auth
```bash
REPL_ID=<your-repl-id>
REPLIT_DOMAINS=your-app.replit.app
ISSUER_URL=https://replit.com/oidc  # Default, usually not needed
```

### Optional: Analytics
```bash
VITE_GA_MEASUREMENT_ID=G-WJTY2Z42SJ  # Google Analytics 4 ID
SITE_URL=https://sage-startups.com    # For sitemap.xml generation
```

## Local Development

```bash
npm install
npm run dev          # Starts Vite (port 5173) + Express (port 5000)
```

The Vite dev server proxies `/api/*` to Express on port 5000.

## Database Setup

```bash
# Push schema to database
npm run db:push

# Open Drizzle Studio (visual DB browser)
npm run db:studio
```

## Production Build

```bash
npm run build        # 1. vite build -> dist/public/  2. esbuild -> dist/server.js
npm start            # NODE_ENV=production node dist/server.js
```

The server binds on `HOST=0.0.0.0` (configurable) and `PORT=5000` (configurable).

## Replit Deployment

1. **Import** this repository into Replit
2. Set secrets in **Replit Secrets** panel (minimum: `DATABASE_URL`, `SESSION_SECRET`)
3. Click **Deploy -> Autoscale**
4. Under Deploy settings set:
   - **Build command**: `npm run build`
   - **Start command**: `npm start`
5. Click **Deploy**

After deploy, set additional secrets (`OPENAI_API_KEY`, Stripe keys) and redeploy to enable those features.

### Stripe Webhook Setup

After deploying, add a Stripe webhook:
1. Stripe Dashboard -> Developers -> Webhooks -> Add endpoint
2. URL: `https://your-app.replit.app/api/webhooks/stripe`
3. Events: `customer.subscription.created`, `customer.subscription.updated`, `customer.subscription.deleted`
4. Copy signing secret -> set as `STRIPE_WEBHOOK_SECRET`

## Architecture Notes

### Storage Fallback Pattern
```typescript
export const storage = hasDb() ? new DbStorage() : new MemStorage();
```
MemStorage uses in-memory Maps. Data is ephemeral but allows the app to run without a database.

### AI Safety Pattern
```typescript
export const openai = process.env.OPENAI_API_KEY
  ? { runBot, generateImage }
  : unavailable; // stubs that return error strings, never throw
```

### Rate Limiting
Bot runs: 60/user/hour (in-memory Map, resets per hour window).

### Early Bird Pricing
Users signing up before `2026-09-01T00:00:00Z` get `isEarlyBird=true` and see $22/mo pricing.
Cutoff is configurable in `server/authRoutes.ts` and `client/src/components/early-bird-banner.tsx`.

## API Reference

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/api/health` | No | Health check |
| POST | `/api/auth/register` | No | Sign up |
| POST | `/api/auth/login` | No | Sign in |
| POST | `/api/auth/logout` | No | Sign out |
| GET | `/api/auth/me` | Yes | Current user |
| PATCH | `/api/auth/me` | Yes | Update profile |
| GET | `/api/bots` | No | List all 67 bots |
| GET | `/api/bots/:id` | No | Get bot definition |
| POST | `/api/bots/:id/run` | Yes | Run a bot |
| GET | `/api/bot-sessions` | Yes | List sessions |
| GET | `/api/bot-sessions/:id` | Yes | Session + messages |
| DELETE | `/api/bot-sessions/:id` | Yes | Delete session |
| POST | `/api/waitlist` | No | Join waitlist |
| GET | `/api/waitlist/count` | No | Waitlist count |
| POST | `/api/stripe/create-subscription-intent` | Yes | Payment intent |
| POST | `/api/webhooks/stripe` | No | Stripe webhook |
| POST | `/api/analytics/event` | No | Track event |
| GET | `/api/analytics/stats` | No | Analytics summary |
| GET | `/sitemap.xml` | No | XML sitemap |
| GET | `/robots.txt` | No | Robots file |

# Deployment

Read this before deploying, changing production env vars, or updating the admin in prod.

## Architecture

The app runs on two free-tier services:

- **[Vercel](https://vercel.com)** — hosts the Next.js app (Hobby plan, free).
- **[Neon](https://neon.tech)** — serverless PostgreSQL (Free tier).

Both authenticate via "Sign in with GitHub". GitHub Pages hosts the static landing page
(see `docs/index.html`).

## Live URLs

| What | URL |
| --- | --- |
| App | <https://macrotracker-pro.vercel.app> |
| Landing | <https://lluviavea.github.io/macrotracker-pro/> |
| Neon console | your project dashboard |

## Required environment variables (Vercel)

Set these in **Vercel → Project → Settings → Environment Variables** (all environments):

| Key | Purpose |
| --- | --- |
| `DATABASE_URL` | Neon **pooled** connection string (`postgresql://...neon.tech/...?sslmode=require`). In the Neon "Connect" dialog pick the **Pooled connection** (hostname contains `-pooler`). The app disables prepared statements to work with PgBouncer. |
| `SESSION_SECRET` | JWT signing secret, ≥32 chars (`openssl rand -base64 32`) |
| `INITIAL_ADMIN_EMAIL` | Admin login email |
| `INITIAL_ADMIN_PASSWORD` | Admin login password |

Never commit these. `.env.local` is gitignored.

## Running migrations / seed against production

Keep the Neon connection string in `.env.local` as `PROD_DATABASE_URL` (do NOT replace the local
`DATABASE_URL` used by Docker). Then run:

```bash
# Push schema changes to Neon
DATABASE_URL="$(grep '^PROD_DATABASE_URL=' .env.local | cut -d= -f2-)" npx drizzle-kit push

# Seed admin user + catalog (also needs INITIAL_ADMIN_* and SESSION_SECRET from .env.local)
DATABASE_URL="$(grep '^PROD_DATABASE_URL=' .env.local | cut -d= -f2-)" \
  npx dotenv -e .env.local -- npx tsx lib/db/seed.ts
```

`dotenv-cli` does not override variables already in the environment, so the inline `DATABASE_URL`
(prod) wins while `INITIAL_ADMIN_*` / `SESSION_SECRET` are still loaded from `.env.local`.

> `seed.ts` deletes and recreates the admin's catalog. Run it once on a fresh DB, or to reset the
> catalog — it will wipe manual catalog edits.

## Updating the admin credentials in production

Change `INITIAL_ADMIN_EMAIL` / `INITIAL_ADMIN_PASSWORD` in `.env.local`, then:

```bash
DATABASE_URL="$(grep '^PROD_DATABASE_URL=' .env.local | cut -d= -f2-)" \
  npx dotenv -e .env.local -- npx tsx scripts/update-admin.ts
```

Also update the matching vars in the Vercel dashboard so new deployments stay consistent.

## How deploys happen

Vercel auto-deploys every push to `main`. The pre-push `hk` hook runs e2e tests locally first; a
failing e2e blocks the push. There is no CI workflow file — Vercel builds on its end using the env
vars from the dashboard.

## Rotating `SESSION_SECRET`

1. Generate a new secret: `openssl rand -base64 32`.
2. Update it in the Vercel dashboard.
3. Trigger a redeploy (Vercel → Deployments → Redeploy).
4. All existing sessions become invalid (users must log in again).

## Updating the landing page

The landing is static HTML served by GitHub Pages from `/docs` on `main`. Push changes to
`docs/index.html` / `docs/assets/landing.css` and GitHub Pages rebuilds automatically (~1 min).

The live-app URL is defined once in a `LIVE_URL` constant at the bottom of `docs/index.html`.

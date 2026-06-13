# Authentication

Read this when working on login, registration, sessions, or user scoping.

## Overview

The app uses custom credentials authentication:

- **Passwords**: hashed with `bcryptjs`.
- **Sessions**: signed JWT stored in an HTTP-only cookie named `session`.
- **Validation**: `jose` signs and verifies tokens (works in Edge proxy).
- **Authorization**: `proxy.ts` redirects guests to `/login` and blocks non-admins from `/admin`.

## Environment variables

Add these to `.env.local` (never commit `.env.local`):

```env
SESSION_SECRET=change-this-to-a-random-string-at-least-32-characters
INITIAL_ADMIN_EMAIL=lluvia@example.com
INITIAL_ADMIN_PASSWORD=changeme
```

- `SESSION_SECRET`: used to sign JWTs. Must be long and random.
- `INITIAL_ADMIN_EMAIL` / `INITIAL_ADMIN_PASSWORD`: creates the first admin on `just db-seed`.

## Flow

1. **Setup**: `just setup` runs `lib/db/seed.ts`, which creates the admin user and seeds their food catalog.
2. **Update admin**: `just db-update-admin` updates the admin email and password from `.env.local`.
3. **Register**: `POST /api/auth/register` creates a user, hashes the password, seeds their catalog, and sets the session cookie directly on the response.
4. **Login**: `POST /api/auth/login` verifies the password, creates a JWT, and sets the cookie directly on the response.
5. **Logout**: `POST /api/auth/logout` deletes the cookie from the response.
6. **Session check**: server components call `getSession()` from `lib/auth.ts`; proxy calls `getSessionFromRequest()`.

## Login page

The login form at `/[locale]/login` includes the shared `ThemeToggle` and `LangSwitcher` components in the card header, so users can switch dark/light mode and language (ES/EN) before authenticating.

## Local network access

When another device on the same WiFi accesses the dev server via the local IP (`http://192.168.x.x:3000`), Next.js may treat the request as cross-origin. `next.config.ts` sets `allowedDevOrigins` to the machine's local IPv4 addresses so login/register work from other laptops or phones. The session cookie is set with `path: '/'`, `sameSite: 'lax'`, and `secure: false` in development, so it is sent on same-origin requests over HTTP.

## E2E tests

Auth flows are covered by Playwright tests in `e2e/auth.spec.ts`:

```bash
just test-e2e     # headless run
just test-e2e-ui  # interactive UI mode
```

The tests start the dev server automatically (`webServer` in `playwright.config.ts`), log in as the seeded admin, register a new user with a unique email, and log out. They require `.env.local` with valid `INITIAL_ADMIN_EMAIL` and `INITIAL_ADMIN_PASSWORD`.

## Multi-tenancy

Every database query includes `user_id`:

- `foods.user_id`
- `log_entries.user_id`

API routes use `requireSession()` and pass `session.userId` to the data layer. Each user has their own food catalog and their own daily logs.

## Roles

- `admin`: can access `/admin` and manage the food catalog.
- `user`: can log food and view their own data only.

The proxy blocks `/admin` for non-admins; the admin page also checks the role server-side.

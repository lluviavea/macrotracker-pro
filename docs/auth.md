# Authentication

Read this when working on login, registration, sessions, or user scoping.

## Overview

The app uses custom credentials authentication:

- **Passwords**: hashed with `bcryptjs`.
- **Sessions**: signed JWT stored in an HTTP-only cookie named `session`.
- **Validation**: `jose` signs and verifies tokens (works in Edge middleware).
- **Authorization**: `middleware.ts` redirects guests to `/login` and blocks non-admins from `/admin`.

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
2. **Register**: `POST /api/auth/register` creates a user, hashes the password, seeds their catalog, and sets the session cookie.
3. **Login**: `POST /api/auth/login` verifies the password, creates a JWT, and sets the cookie.
4. **Logout**: `POST /api/auth/logout` deletes the cookie.
5. **Session check**: server components call `getSession()` from `lib/auth.ts`; middleware calls `getSessionFromRequest()`.

## Multi-tenancy

Every database query includes `user_id`:

- `foods.user_id`
- `log_entries.user_id`

API routes use `requireSession()` and pass `session.userId` to the data layer. Each user has their own food catalog and their own daily logs.

## Roles

- `admin`: can access `/admin` and manage the food catalog.
- `user`: can log food and view their own data only.

The middleware blocks `/admin` for non-admins; the admin page also checks the role server-side.

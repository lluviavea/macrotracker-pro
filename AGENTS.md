<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# MacroTracker

Food logging app. Food catalog + daily logs in PostgreSQL via Docker.
Macros calculated locally with a static nutrition lookup table.

## Conventions (CRITICAL)

- **HARD RULE: Commit and push after EVERY unit of work.** Before starting new work, check `git status` and `git log --oneline -3@\{push\}`. If there are uncommitted changes, STOP. Commit them first (atomic, 50/72 rule) and push. Never accumulate work across multiple sessions or features without pushing.
- **All dev commands go in Justfile, NOT in package.json scripts.** package.json only has `"prepare": "husky"`.
- **Pre-push hook runs tests + typecheck.** If it blocks you, fix before pushing.
- **Pre-commit hook runs lint-staged (ESLint).**
- **Commit-msg hook enforces conventional commits.**
- **DATABASE_URL must be set** in `.env.local` for DB operations.
- **SESSION_SECRET, INVITE_CODE, INITIAL_ADMIN_EMAIL, INITIAL_ADMIN_PASSWORD** must be set in `.env.local`. See `docs/auth.md`.
- **`just setup` is the one-time onboarding command** — it installs tools/dependencies, creates `.env.local` if missing, starts the DB, migrates, and seeds.
- **`just run` is the daily command** — it verifies Docker is running, starts the DB if it is not up, waits for PostgreSQL to be ready, pushes any pending schema changes, and starts the dev server.

## Dev Commands

```bash
just setup        # One-time: install deps, env, DB, migrate, seed
just db-start     # Start PostgreSQL via Docker Compose
just db-stop      # Stop PostgreSQL
just db-migrate   # Push Drizzle schema changes to DB
just db-seed      # Seed DB from NUTRITION_DATA (one-time, after fresh DB)
just db-reset     # Destroy + recreate DB + seed
just run          # Start dev server on :3000 (auto-starts DB + migrate)
just build        # Production build
just start        # Start production server
just lint         # Run ESLint
just test         # Run vitest
just typecheck    # Run tsc --noEmit
```

## Knowledge Map

Start with `docs/architecture.md` for the big picture. Then jump to the per-concern doc.

| When you need to... | Read this |
|---|---|
| Understand project structure, data flow, component tree, schema | `docs/architecture.md` |
| Work with auth, users, sessions, invite codes, roles | `docs/auth.md` |
| Work with the food catalog, NUTRITION_DATA, calculateMacros, FoodItem type | `docs/nutrition.md` |
| Work on the admin page at `/admin` (CRUD, auto-fill, sort, search) | `docs/admin.md` |
| Work on daily goals (localStorage, progress bars, GoalsModal) | `docs/goals.md` |
| Work on dark/light mode, ThemeProvider, anti-flash script | `docs/theme.md` |

## Docs

Update all documentation (`.md`) files whenever the corresponding code or config changes. Keep them
in sync — they are the source of truth for AI context. Prefer atomic commits per doc file.

## Common pitfalls

- `log_entries` stores **denormalized** macros. When a food is updated via `PUT /api/foods`, the
  API also recalculates dependent log entries (by `foodName + category`).
- `useFoodLog` uses **snapshot-based rollback** for update/delete (not for create). See
  `docs/architecture.md` for the data flow.
- The home page is bilingual: display `food.nameEn` in EN locale when present, else fall back to
  `food.name`.
- Goals live in `localStorage`, not the DB. See `docs/goals.md`.
- Theme uses Tailwind v4 `dark:` class + a pre-hydration inline script. See `docs/theme.md`.

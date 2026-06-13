# MacroTracker

Food logging app. Food catalog + daily logs in PostgreSQL via Docker.
Macros calculated locally with a static nutrition lookup table.

## Conventions (CRITICAL)

- **HARD RULE: Commit after every unit of work.** Before starting new work, check `git status`. If there are uncommitted changes, STOP. Commit them first (atomic, 50/72 rule). Push at the end of a session, when a feature/bugfix is complete, or before switching context — never end a session with unpushed commits. Check `git log --oneline -3@\{push\}` to confirm local commits are pushed.
- **All dev commands go in Justfile, NOT in package.json scripts.** package.json has no scripts.
- **Git hooks are managed by [hk](https://hk.jdx.dev/)** and configured in `hk.pkl`.
- **`just setup` installs hk hooks** with `hk install --mise`.
- **Pre-commit hook** runs editorconfig-checker, markdownlint-cli2, ESLint, typecheck, and unit tests via just recipes.
- **Pre-push hook** runs e2e tests via `just test-e2e`.
- **Commit-msg hook** validates conventional commits with `committed`.
- **Add tests for new features and bug fixes.** Use unit tests for logic, e2e tests for critical user paths. See `docs/testing.md`.
- **Update docs with every code/config change.** If a change affects project setup, conventions, dev commands, architecture, auth, nutrition, admin, goals, theme, or testing, update the corresponding `.md` file in the same commit. Never leave `AGENTS.md` or `README.md` stale.
- **DATABASE_URL must be set** in `.env.local` for DB operations.
- **SESSION_SECRET, INITIAL_ADMIN_EMAIL, INITIAL_ADMIN_PASSWORD** must be set in `.env.local`. See `docs/auth.md`.
- **`just setup` is the one-time onboarding command** — it installs tools/dependencies, creates `.env.local` if missing, starts the DB, migrates, and seeds the admin user and catalog.
- **`just run` is the daily command** — it verifies Docker is running, starts the DB if it is not up, waits for PostgreSQL to be ready, pushes any pending schema changes, and starts the dev server. It binds to `0.0.0.0` and prints both `http://localhost:3000` and the local network URL (e.g. `http://192.168.x.x:3000`). Share the **network URL**, not `localhost`, with other devices on the same WiFi.

## Dev Commands

```bash
just setup        # One-time: install deps, env, DB, migrate, seed
just db-start     # Start PostgreSQL via Docker Compose
just db-stop      # Stop PostgreSQL
just db-migrate   # Push Drizzle schema changes to DB
just db-seed      # Create admin user and seed their catalog (one-time, after fresh DB)
just db-update-admin # Update admin email/password from .env.local
just db-reset     # Destroy + recreate DB + seed
just run          # Start dev server on :3000 (auto-starts DB + migrate)
just build        # Production build
just start        # Start production server
just lint         # Run ESLint
just test         # Run vitest
just test-e2e     # Run Playwright e2e tests
just test-e2e-ui  # Run Playwright in UI mode
just typecheck    # Run tsc --noEmit
just hooks-install # Install hk git hooks
```

## Knowledge Map

Start with `docs/architecture.md` for the big picture. Then jump to the per-concern doc.

| When you need to... | Read this |
| --- | --- |
| Understand project structure, data flow, component tree, schema | `docs/architecture.md` |
| Work with auth, users, sessions, invite codes, roles | `docs/auth.md` |
| Work with the food catalog, NUTRITION_DATA, calculateMacros, FoodItem type | `docs/nutrition.md` |
| Work on the admin page at `/admin` (CRUD, auto-fill, sort, search) | `docs/admin.md` |
| Work on daily goals (localStorage, progress bars, GoalsModal) | `docs/goals.md` |
| Work on dark/light mode, ThemeProvider, anti-flash script | `docs/theme.md` |
| Add or change tests (unit, e2e, test conventions) | `docs/testing.md` |

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

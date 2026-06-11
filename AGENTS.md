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
- **Docker must be running** before `just run` if DB is needed.

## Dev Commands

```bash
just setup        # mise trust + install + npm install (first time only)
just db-start     # Start PostgreSQL via Docker Compose
just db-stop      # Stop PostgreSQL
just db-migrate   # Push Drizzle schema changes to DB
just db-seed      # Seed DB from Google Sheets (one-time)
just db-reset     # Destroy + recreate DB + seed
just run          # Start dev server on :3000
just build        # Production build
just start        # Start production server
just lint         # Run ESLint
just test         # Run vitest
just typecheck    # Run tsc --noEmit
```

## Knowledge Map

| When you need to... | Read this |
|---|---|
| Understand project structure, data flow, component tree | `docs/architecture.md` |
| Work with sheets, auth, spreadsheet ID, MCP server | `docs/google-sheets.md` |
| Handle nutrition types, macro formulas, measure types | `docs/nutrition.md` |

## Docs

Update all documentation (`.md`) files whenever the corresponding code or config changes. Keep them
in sync — they are the source of truth for AI context.

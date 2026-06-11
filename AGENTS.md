<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# MacroTracker

Food logging app. Foods from Google Sheets, macros calculated locally.

## Conventions (CRITICAL)

- **All dev commands go in Justfile, NOT in package.json scripts.** package.json only has `"prepare": "husky"`.
- **Pre-push hook runs tests + typecheck.** If it blocks you, fix before pushing.
- **Pre-commit hook runs lint-staged (ESLint).**
- **Commit-msg hook enforces conventional commits.**
- **Commit often, push after every meaningful change.**

## Dev Commands

```bash
just setup      # mise trust + install + npm install (first time only)
just run        # Start dev server on :3000
just build      # Production build
just start      # Start production server
just lint       # Run ESLint
just test       # Run vitest
just typecheck  # Run tsc --noEmit
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

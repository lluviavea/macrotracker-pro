# Testing

## Stack

- **Unit / integration tests**: [Vitest](https://vitest.dev/) with `@vitejs/plugin-react`
- **End-to-end tests**: [Playwright](https://playwright.dev/)

## Commands

```bash
just test          # Run vitest unit tests
just test-e2e      # Run Playwright e2e tests
just test-e2e-ui   # Run Playwright in UI mode
just screenshots   # Capture README/landing screenshots (requires dev server running)
```

## When to add tests

Add tests when you:

- Build a new feature (unit tests for logic, e2e for critical user paths)
- Fix a bug (add a regression test first if possible)
- Refactor core logic (tests protect behavior)

## Unit tests

- Live in `lib/__tests__/*.test.ts`
- Name the file after the module under test (e.g. `lib/__tests__/macros.test.ts` for `lib/macros.ts`)
- Prefer pure-function tests for logic; mock DB/auth only when necessary
- Run via `just test`

## E2E tests

- Live in `e2e/*.spec.ts`
- Cover critical user journeys (authentication, food logging, admin CRUD)
- Run via `just test-e2e`

### E2E conventions

- Wait for hydration before interacting:

  ```ts
  await page.goto("/es/login");
  await page.waitForLoadState("networkidle");
  ```

- Use role-based locators and localized button text:

  ```ts
  const submitButton = page.getByRole("button", { name: /iniciar/i });
  await expect(submitButton).toBeEnabled();
  await submitButton.click();
  ```

- Wait for navigation explicitly:

  ```ts
  await page.waitForURL("/es");
  ```

### E2E cleanup

E2E tests create temporary data (food items with `E2E-` prefix). Each test file has:

- **`afterEach`**: Tries to delete the specific test food created during that test
- **`afterAll`**: Safety net — deletes ALL foods with `E2E-` prefix, catching any leftovers from failed cleanups

If you see `E2E-Edit-*` items in your catalog after running tests, it means the cleanup failed (usually due to API errors or expired session). Run `just db-seed` to reset.

### E2E requirements

- `just test-e2e` reuses an existing dev server on `localhost:3000` when one is running.
- If no server is running, Playwright starts `just run`, which is slower and requires Docker.
- E2E tests share the local Docker database with any running dev instance, so test data can collide with manual usage.

## Screenshot capture

`scripts/capture-screenshots.mjs` (run via `just screenshots`) generates the screenshots used in
`README.md` and the GitHub Pages landing (`docs/index.html`). It is **not** part of the test suite.

How it works:

1. Requires a dev server already running (`just run` in another terminal).
2. Logs in as the admin via `POST /api/auth/login` (uses `INITIAL_ADMIN_*` from `.env.local`).
3. Creates demo log entries across the last 6 days via `POST /api/log` (uses real catalog foods,
    no `E2E-` items needed).
4. Captures light/dark home, weekly summary, goals modal, admin, and mobile views into
    `docs/screenshots/`.
5. Deletes every demo entry it created (tracked by ID, removed via `DELETE /api/log`).

If cleanup fails, leftover entries are harmless log rows for past dates — delete them manually in
the UI by navigating to the affected days.

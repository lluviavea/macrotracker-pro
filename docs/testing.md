# Testing

## Stack

- **Unit / integration tests**: [Vitest](https://vitest.dev/) with `@vitejs/plugin-react`
- **End-to-end tests**: [Playwright](https://playwright.dev/)

## Commands

```bash
just test          # Run vitest unit tests
just test-e2e      # Run Playwright e2e tests
just test-e2e-ui   # Run Playwright in UI mode
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

### E2E requirements

- `just test-e2e` reuses an existing dev server on `localhost:3000` when one is running.
- If no server is running, Playwright starts `just run`, which is slower and requires Docker.
- E2E tests share the local Docker database with any running dev instance, so test data can collide with manual usage.

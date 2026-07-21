import { test, expect } from "@playwright/test";

const ADMIN_EMAIL = process.env.INITIAL_ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.INITIAL_ADMIN_PASSWORD;

const NAME_ES_PLACEHOLDER = /ej\. pollo.*arroz/i;

test.describe("admin catalog", () => {
  test.skip(!ADMIN_EMAIL || !ADMIN_PASSWORD, "Admin credentials not configured");

  test("admin can edit a food and see the change without reload", async ({ page }) => {
    // Auto-accept the confirm() dialog used by delete (cleanup step)
    page.on("dialog", (dialog) => dialog.accept());

    await page.goto("/es/login");
    await page.waitForLoadState("networkidle");
    await page.fill('input[id="email"]', ADMIN_EMAIL!);
    await page.fill('input[id="password"]', ADMIN_PASSWORD!);
    await page.getByRole("button", { name: /iniciar/i }).click();
    await page.waitForURL("/es");

    await page.goto("/es/admin");
    await page.waitForLoadState("networkidle");

    // Create a throwaway food so the test never mutates real catalog data.
    // The Name(ES) field lives inside FoodAutocomplete, a controlled input.
    // Asserting the value before clicking submit guarantees React has flushed
    // the state update, otherwise the POST can fire with a stale empty name.
    const uniqueName = `E2E-Edit-${Date.now()}`;
    await page.getByRole("button", { name: /\+ agregar/i }).click();
    const nameEsInput = page.getByPlaceholder(NAME_ES_PLACEHOLDER);
    await nameEsInput.fill(uniqueName);
    await expect(nameEsInput).toHaveValue(uniqueName);
    await page.getByRole("button", { name: "Agregar comida", exact: true }).click();

    // Wait for the new row to land in the table (optimistic update + refetch).
    await expect(page.locator("table")).toContainText(uniqueName);

    // Edit the row: scope clicks to the row that contains the unique name,
    // so we don't depend on the search box (which races with React state).
    const editedName = `${uniqueName}-edited`;
    const createdRow = page.locator("tr", { hasText: uniqueName });
    await createdRow.getByRole("button", { name: /editar/i }).click();

    // Same race-prevention pattern: wait for React to flush before submit.
    await nameEsInput.fill(editedName);
    await expect(nameEsInput).toHaveValue(editedName);
    await page.getByRole("button", { name: /guardar cambios/i }).click();

    // No error banner should be visible after a successful save.
    await expect(page.getByTestId("admin-error-banner")).toHaveCount(0);

    // The renamed row should appear without a page reload.
    await expect(page.locator("table")).toContainText(editedName);

    // Reload and confirm the change persisted in the DB.
    await page.reload();
    await page.waitForLoadState("networkidle");
    await expect(page.locator("table")).toContainText(editedName);

    // Cleanup: delete the throwaway food.
    const editedRow = page.locator("tr", { hasText: editedName });
    await editedRow.getByRole("button", { name: /eliminar/i }).click();
    await expect(page.locator("table")).not.toContainText(editedName);
  });
});

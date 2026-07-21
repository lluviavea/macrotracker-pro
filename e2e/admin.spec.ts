import { test, expect } from "@playwright/test";

const ADMIN_EMAIL = process.env.INITIAL_ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.INITIAL_ADMIN_PASSWORD;

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

    // Create a throwaway food so the test never mutates real catalog data
    const uniqueName = `E2E-Edit-${Date.now()}`;
    await page.getByRole("button", { name: /\+ agregar/i }).click();
    await page.getByPlaceholder(/ej\. pollo.*arroz/i).fill(uniqueName);
    await page.getByRole("button", { name: "Agregar comida", exact: true }).click();

    // Filter the table down to exactly that row
    await page.getByPlaceholder(/buscar/i).fill(uniqueName);
    await expect(page.getByRole("button", { name: /editar/i })).toHaveCount(1);

    // Edit it: rename to {uniqueName}-edited
    const editedName = `${uniqueName}-edited`;
    await page.getByRole("button", { name: /editar/i }).click();
    await page.getByPlaceholder(/ej\. pollo.*arroz/i).fill(editedName);
    await page.getByRole("button", { name: /guardar cambios/i }).click();

    // Save succeeded -> no error banner is shown
    await expect(page.getByRole("alert")).toHaveCount(0);

    // Optimistic update + refetch -> the new name shows without a page reload
    await expect(page.locator("table")).toContainText(editedName);

    // Reload and confirm the change persisted in the DB
    await page.reload();
    await page.waitForLoadState("networkidle");
    await page.getByPlaceholder(/buscar/i).fill(editedName);
    await expect(page.getByRole("button", { name: /editar/i })).toHaveCount(1);

    // Cleanup: delete the throwaway food
    await page.getByRole("button", { name: /eliminar/i }).click();
    await expect(page.getByRole("button", { name: /editar/i })).toHaveCount(0);
  });
});

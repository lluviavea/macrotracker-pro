import { test, expect } from "@playwright/test";

const ADMIN_EMAIL = process.env.INITIAL_ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.INITIAL_ADMIN_PASSWORD;

test.describe("authentication", () => {
  test("admin can log in and log out", async ({ page }) => {
    test.skip(!ADMIN_EMAIL || !ADMIN_PASSWORD, "Admin credentials not configured");

    await page.goto("/es/login");
    await page.fill('input[id="email"]', ADMIN_EMAIL!);
    await page.fill('input[id="password"]', ADMIN_PASSWORD!);
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL("/es");
    await expect(page.locator("text=Cerrar sesión")).toBeVisible();

    await page.click("text=Cerrar sesión");
    await expect(page).toHaveURL("/es/login");
  });

  test("new user can register", async ({ page }) => {
    const email = `e2e-${Date.now()}@example.com`;
    const password = "Password123!";

    await page.goto("/es/register");
    await page.fill('input[id="email"]', email);
    await page.fill('input[id="password"]', password);
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL("/es");
    await expect(page.locator("text=Cerrar sesión")).toBeVisible();
  });
});

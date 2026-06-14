import { test, expect } from "@playwright/test";

const ADMIN_EMAIL = process.env.INITIAL_ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.INITIAL_ADMIN_PASSWORD;
const INVITE_CODE = process.env.INVITE_CODE;

test.describe("authentication", () => {
  test("admin can log in and log out", async ({ page }) => {
    test.skip(!ADMIN_EMAIL || !ADMIN_PASSWORD, "Admin credentials not configured");

    await page.goto("/es/login");
    await page.waitForLoadState("networkidle");

    await page.fill('input[id="email"]', ADMIN_EMAIL!);
    await page.fill('input[id="password"]', ADMIN_PASSWORD!);

    const submitButton = page.getByRole("button", { name: /iniciar/i });
    await expect(submitButton).toBeEnabled();
    await submitButton.click();

    await page.waitForURL("/es");
    await expect(page).toHaveURL("/es");
    await expect(page.locator("text=Cerrar sesión")).toBeVisible();

    await page.click("text=Cerrar sesión");
    await expect(page).toHaveURL("/es/login");
  });

  test("admin can log in by pressing Enter", async ({ page }) => {
    test.skip(!ADMIN_EMAIL || !ADMIN_PASSWORD, "Admin credentials not configured");

    await page.goto("/es/login");
    await page.waitForLoadState("networkidle");

    await page.fill('input[id="email"]', ADMIN_EMAIL!);
    await page.fill('input[id="password"]', ADMIN_PASSWORD!);

    await page.press('input[id="password"]', "Enter");

    await page.waitForURL("/es");
    await expect(page).toHaveURL("/es");
    await expect(page.locator("text=Cerrar sesión")).toBeVisible();
  });

  test("new user can register", async ({ page }) => {
    test.skip(!INVITE_CODE, "Invite code not configured");

    const email = `e2e-${Date.now()}@example.com`;
    const password = "Password123!";

    await page.goto("/es/register");
    await page.waitForLoadState("networkidle");

    await page.fill('input[id="email"]', email);
    await page.fill('input[id="password"]', password);
    await page.fill('input[id="inviteCode"]', INVITE_CODE!);

    const submitButton = page.getByRole("button", { name: /crear/i });
    await expect(submitButton).toBeEnabled();
    await submitButton.click();

    await page.waitForURL("/es");
    await expect(page).toHaveURL("/es");
    await expect(page.locator("text=Cerrar sesión")).toBeVisible();
  });
});

import { expect, test } from "@playwright/test";

test("test-app boots and renders the home page", async ({ page }) => {
  await page.goto("/");

  await expect(page).toHaveTitle(/TestApp/);
  await expect(
    page.getByRole("heading", { name: "Welcome to app!" })
  ).toBeVisible();
});

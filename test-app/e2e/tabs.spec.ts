import { expect, test } from "@playwright/test";

test("switching tabs hides the previously active tab's content", async ({
  page,
}) => {
  await page.goto("/tabs");

  const firstTabContent = page.getByText("Content for tab one.");
  const secondTabContent = page.getByText("Content for tab two.");

  await expect(firstTabContent).toBeVisible();
  await expect(secondTabContent).not.toBeVisible();

  await page.getByRole("tab", { name: "Tab Two" }).click();

  // The bug: `.mat-tab-body { display: block; }` (an author-stylesheet rule)
  // always wins the cascade over the browser's built-in `[hidden] { display:
  // none; }` UA rule, so the previously-active tab body never actually gets
  // hidden. `tab-body.ts` does eventually detach the leaving tab's content
  // once its 500ms slide-out animation completes (regardless of this CSS
  // bug), so a default-timeout `toBeVisible()` assertion would pass either
  // way and never catch the regression. Assert immediately (no room for the
  // animation to finish) to actually pin the previously-active tab's content
  // as hidden the instant the click happens, which is only true once
  // `[hidden]` wins the cascade.
  await expect(firstTabContent).not.toBeVisible({ timeout: 100 });
  await expect(secondTabContent).toBeVisible();
});

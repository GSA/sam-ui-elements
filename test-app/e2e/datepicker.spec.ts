import { expect, test } from "@playwright/test";

/**
 * GH-666: `calendarpopup` was a `static: true` `@ViewChild` on an
 * `*ngIf`-gated element, so it never resolved and the entire
 * outside-click-to-close path in `handleGlobalClick` was dead code. Fixing
 * that alone exposes a second defect: `handleGlobalClick` compared
 * `calendarButton.nativeElement !== event.target` with strict inequality,
 * and a real mouse click on the icon's centre lands on its `.sr-only` child
 * span, not the icon itself -- so the *opening* click was immediately
 * treated as an outside click and closed the calendar in the same event.
 * jsdom has no layout engine to hit-test against (a synthetic
 * `{ target }` object always lands exactly where the test says), so this
 * class of defect can only be caught with a real browser click. See
 * `picker.spec.ts`'s unit coverage for the containment-logic assertions
 * that jsdom *can* make.
 */

test("clicking the calendar icon opens the picker and it stays open", async ({
  page,
}) => {
  await page.goto("/datepicker");

  const calendarIcon = page.locator(".datepicker .fa-calendar");
  await calendarIcon.click();

  const popup = page.locator("#sam-date-calendar-popup");
  await expect(popup).toBeVisible();
  // Regression guard for the "opens then immediately closes in the same
  // event" defect: `handleGlobalClick` runs synchronously as the click
  // event bubbles to `document`, in the same task as the click that opened
  // the popup, so waiting for the next two paint frames (rather than a
  // fixed timeout) is enough to let it run before re-asserting visibility.
  await page.evaluate(
    () =>
      new Promise<void>((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(() => resolve()))
      )
  );
  await expect(popup).toBeVisible();
});

test("clicking outside the calendar closes it", async ({ page }) => {
  await page.goto("/datepicker");

  await page.locator(".datepicker .fa-calendar").click();
  const popup = page.locator("#sam-date-calendar-popup");
  await expect(popup).toBeVisible();

  await page.locator("h1").click();
  await expect(popup).not.toBeVisible();
});

test("opening the calendar disables other page elements, and closing it via outside click restores them", async ({
  page,
}) => {
  await page.goto("/datepicker");

  const beforeButton = page.locator("#before-button");
  const afterButton = page.locator("#after-button");

  // Baseline: neither sibling button is tabindex/aria-hidden-managed before
  // the calendar opens.
  await expect(beforeButton).not.toHaveAttribute("aria-hidden", "true");
  await expect(afterButton).not.toHaveAttribute("aria-hidden", "true");

  await page.locator(".datepicker .fa-calendar").click();
  const popup = page.locator("#sam-date-calendar-popup");
  await expect(popup).toBeVisible();

  await expect(beforeButton).toHaveAttribute("tabindex", "-1");
  await expect(beforeButton).toHaveAttribute("aria-hidden", "true");
  await expect(afterButton).toHaveAttribute("tabindex", "-1");
  await expect(afterButton).toHaveAttribute("aria-hidden", "true");

  await page.locator("h1").click();
  await expect(popup).not.toBeVisible();

  // disablePageTabIndex/enablePageTabIndex fully remove the tabindex
  // attribute for elements that had none originally (data-sam-noinitial-tabindex),
  // which is the case for these plain <button> elements -- so "restored"
  // means the attribute is gone entirely, not reset to some prior value.
  await expect(beforeButton).not.toHaveAttribute("tabindex", "-1");
  await expect(beforeButton).toHaveAttribute("aria-hidden", "false");
  await expect(afterButton).not.toHaveAttribute("tabindex", "-1");
  await expect(afterButton).toHaveAttribute("aria-hidden", "false");
});

test("opening the calendar via keyboard Enter still works", async ({
  page,
}) => {
  await page.goto("/datepicker");

  const calendarIcon = page.locator(".datepicker .fa-calendar");
  await calendarIcon.focus();
  await page.keyboard.press("Enter");

  await expect(page.locator("#sam-date-calendar-popup")).toBeVisible();
});

test("selecting a day, cancelling, and navigating months all still work", async ({
  page,
}) => {
  await page.goto("/datepicker");

  await page.locator(".datepicker .fa-calendar").click();
  const popup = page.locator("#sam-date-calendar-popup");
  await expect(popup).toBeVisible();

  const monthHeader = popup.locator(".datepicker__calendar__nav__header span");
  const initialMonth = await monthHeader.textContent();

  await popup.locator('[aria-label="Next Year"]').click();
  await expect(monthHeader).not.toHaveText(initialMonth ?? "");

  await popup.locator('[aria-label="Previous Year"]').click();
  await expect(monthHeader).toHaveText(initialMonth ?? "");

  await popup.locator(".datepicker__calendar__cancel").click();
  await expect(popup).not.toBeVisible();

  await page.locator(".datepicker .fa-calendar").click();
  await expect(popup).toBeVisible();

  const firstDay = popup
    .locator('.datepicker__calendar__month__day[role="button"]')
    .first();
  await firstDay.click();
  await expect(popup).not.toBeVisible();
});

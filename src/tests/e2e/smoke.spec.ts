import { test, expect } from "@playwright/test";

/**
 * MENTOR_TRACE: Requirement 5.2 - E2E Testing
 * Simple health check to ensure the server serves the app.
 */
test("should load the landing page and render the body", async ({ page }) => {
  await page.goto("/");

  await expect(page).toHaveTitle(/Habit Tracker/i);

  const body = page.locator("body");
  await expect(body).toBeVisible();
});

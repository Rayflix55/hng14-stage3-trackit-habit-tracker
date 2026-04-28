import { test, expect } from '@playwright/test';

/**
 * MENTOR_TRACE: Requirement 5.2 - E2E Testing
 * Simple health check to ensure the server serves the app.
 */
test('should load the landing page and render the body', async ({ page }) => {
  // 1. Navigate to the root
  await page.goto('/');

  // 2. Check the title (This passed for you previously)
  await expect(page).toHaveTitle(/Habit Tracker/i);

  // 3. Just verify the body tag is present and visible
  const body = page.locator('body');
  await expect(body).toBeVisible();
});
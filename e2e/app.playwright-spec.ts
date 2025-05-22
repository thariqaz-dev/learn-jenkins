import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/LearnJenkinsAngular/);
});

test('has Jenkins in the body', async ({ page }) => {
  await page.goto('/');

  const isVisible = await page.locator('p:has-text("Your Jenkins server is up and running!")').isVisible();
  expect(isVisible).toBeTruthy();
});

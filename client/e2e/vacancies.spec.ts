import { test, expect } from '@playwright/test';

test.describe('HRMO User Flow - Create Vacancy', () => {

  test('should login as hrmo, navigate to vacancies, and create a new vacancy', async ({ page }) => {
    
    await test.step('1. Navigate to login and submit credentials', async () => {
      await page.goto('/login');
      await page.getByLabel('Email or Username').fill('hrmo');
      await page.getByLabel('Password').fill('password123');
      await page.locator('button[type="submit"]').click();
    });

    await test.step('2. Verify dashboard loads', async () => {
      await expect(page.getByText('HR Management Dashboard')).toBeVisible({ timeout: 15000 });
      await expect(page).toHaveURL(/.*\//);
    });

    await test.step('3. Navigate to Vacancies page', async () => {
      await page.getByRole('link', { name: /vacancies/i }).first().click();
      await page.waitForURL('**/vacancies');
      await expect(page.getByRole('heading', { name: 'Plantilla Vacancies', level: 2 })).toBeVisible();
    });

    await test.step('4. Open Create Vacancy Modal', async () => {
      // Handle the case where the button might be labelled "Post New Vacancy" or "+ Create Vacancy"
      const createBtn = page.getByRole('button', { name: /Post New Vacancy|Create Vacancy/i }).first();
      await createBtn.click();
      await expect(page.getByRole('heading', { name: 'Post New Vacancy' })).toBeVisible();
    });

    const uniqueTitle = `Automated QA Tester ${Date.now()}`;
    
    await test.step('5. Fill vacancy details and submit', async () => {
      await page.getByPlaceholder(/e\.g\. Administrative Assistant III/i).fill(uniqueTitle);

      // Wait for API response to prevent flakiness
      const responsePromise = page.waitForResponse(
        (response) => response.url().includes('/api/vacancies') && response.request().method() === 'POST'
      );
      await page.getByRole('button', { name: 'Confirm & Create Posting' }).click();
      await responsePromise;
    });

    await test.step('6. Verify vacancy is successfully created', async () => {
      await expect(page.getByText('Vacancy created successfully')).toBeVisible();
      await expect(page.getByText(uniqueTitle)).toBeVisible();
    });
  });

});

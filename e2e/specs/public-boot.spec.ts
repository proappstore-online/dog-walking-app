import { test, expect } from '../fixtures';

// Public boot must not depend on creator-only schema operations or a session.
test('guest boot does not request a database migration', async ({ page }) => {
  const migrations: string[] = [];
  const errors: string[] = [];
  page.on('request', request => {
    if (new URL(request.url()).pathname.endsWith('/migrate')) migrations.push(request.url());
  });
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => {
    if (message.type() === 'error') errors.push(message.text());
  });
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Dog Walking App', exact: true })).toBeVisible();
  expect(migrations).toEqual([]);
  expect(errors).toEqual([]);
});

test('guest can reload and open a direct URL without a session', async ({ app }) => {
  await app.reload();
  await expect(app.getByRole('heading', { name: 'Dog Walking App', exact: true })).toHaveCount(1);
  await app.goto('/walkers/release-smoke');
  await expect(app.getByRole('heading', { name: 'Dog Walking App', exact: true })).toBeVisible();
});

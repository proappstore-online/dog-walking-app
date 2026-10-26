import { test, expect } from '../fixtures';

test('release HTML and its JavaScript and CSS assets are served successfully', async ({ page, request }) => {
  const response = await page.goto('/');
  expect(response?.status()).toBe(200);
  await expect(page.getByRole('heading', { name: 'Dog Walking App', exact: true })).toBeVisible();
  const commit = page.locator('meta[name="build-commit"]');
  await expect(commit).toHaveAttribute('content', process.env.EXPECTED_COMMIT_SHA || /^(development|[a-f0-9]{40})$/);
  const assets = await page.locator('script[type="module"][src], link[rel="stylesheet"][href]').evaluateAll(
    elements => elements.map(element => element.getAttribute('src') || element.getAttribute('href') || '')
  );
  expect(assets.length).toBeGreaterThanOrEqual(2);
  for (const asset of assets) {
    const result = await request.get(asset);
    expect(result.status(), asset).toBe(200);
    expect(result.headers()['content-type'], asset).toMatch(asset.endsWith('.css') ? /text\/css/ : /javascript/);
  }
});

for (const colorScheme of ['light', 'dark'] as const) {
  test(`guest screen fits a 375px viewport in ${colorScheme} mode`, async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.emulateMedia({ colorScheme });
    await page.goto('/');
    await expect(page.getByRole('heading', { name: 'Dog Walking App', exact: true })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
  });
}

/**
 * Shared Playwright fixtures for the Dog Walking App E2E suite.
 *
 * Usage in a spec:
 *   import { test, expect, hasSession } from '../fixtures';
 *
 * The `app` fixture is a Page already navigated to the app root.
 * When a session is configured (PLAYWRIGHT_SESSION_STORAGE env var or
 * storageState file present), `hasSession` is true and auth-gated tests run.
 */
import { test as base, expect, type Page } from '@playwright/test';
import path from 'path';
import fs from 'fs';

// ---------------------------------------------------------------------------
// Session detection
// ---------------------------------------------------------------------------
const SESSION_FILE = path.resolve(__dirname, '.auth/session.json');
export const hasSession: boolean =
  !!process.env.PLAYWRIGHT_SESSION_STORAGE || fs.existsSync(SESSION_FILE);

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------
type Fixtures = {
  /** Page already navigated to the app root (base URL from playwright.config). */
  app: Page;
};

export const test = base.extend<Fixtures>({
  app: async ({ page }, use) => {
    await page.goto('/');
    // Wait for the React root to be mounted — migrations complete before mount,
    // so presence of #root > * means migrations have finished.
    await page.waitForSelector('#root > *', { timeout: 15_000 });
    await use(page);
  },
});

export { expect };

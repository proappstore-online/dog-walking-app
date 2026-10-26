# Dog Walking App

React + TypeScript + Vite app hosted at https://dog-walking-app.proappstore.online.

## Build and test

Use Node 22 and pnpm 10.30.3:

```sh
pnpm install --frozen-lockfile
npm ci --prefix e2e
pnpm build
pnpm preview --host 127.0.0.1 --port 5173
# In another terminal:
E2E_BASE_URL=http://127.0.0.1:5173 pnpm test
```

Install Playwright Chromium with `cd e2e && npx playwright install chromium` if
it is not already available. `PLAYWRIGHT_BASE_URL` remains supported; the CI
variable `E2E_BASE_URL` takes precedence. JSON test results are written to
`e2e/results.json`.

## Release

Push to `main` runs `.github/workflows/deploy.yml`: locked dependency install,
TypeScript + Vite build, keyless R2 upload, then browser tests against production.
Build failures stop deployment. The HTML's `build-commit` meta tag contains the
GitHub commit SHA; the release smoke test compares it with `EXPECTED_COMMIT_SHA`
and checks that the JavaScript and CSS assets load.

```sh
E2E_BASE_URL=https://dog-walking-app.proappstore.online \
  EXPECTED_COMMIT_SHA="$(git rev-parse HEAD)" pnpm test
```

The current release renders the existing **Dog Walking App** heading. Directory
components are present in source but are not connected to the app, so the 24
existing data-dependent listing-card tests skip. The five public boot and release
tests run without sign-in, including reload, direct URL, asset and mobile checks.
This release does not establish directory, profile or listing management support.

Public startup does not run schema migrations: the SDK requires authentication
for migrations and previously left guests on a blank screen. The migration
helper remains in `src/lib/app.ts` for authenticated schema setup before wiring
in data features. There is currently no schema migration step in the release
workflow. No production database mutation is needed for the heading-only app.

Lint and format scripts/configuration are not currently provided by this repo.

# Quality Bar

> Every ticket and deploy must satisfy all items below. QA checks these before sign-off.

---

## TypeScript

- **`tsc --noEmit` exits 0** — zero errors, zero warnings.
- **No `as any`** — use proper generics: `app.db.query<Listing>(...)`, `app.db.query<ListingService>(...)`.
- **No `@ts-ignore` or `@ts-expect-error`** — none are expected in this codebase.
- **`strict: true`** in `tsconfig.json` — non-negotiable.
- **`user.login` for display, `user.id` as FK** — `user.name` and `user.email` do not exist on the PAS `User` type and will break the build.
- **Always pass `<T>` to `app.db.query<T>`** — untyped rows are `unknown[]` and cause cascading tsc errors.
- **`result.meta.last_row_id`** (snake_case) — NOT `lastRowId`. `execute` returns `{ meta }` only, no `.rows`.
- **SDK import paths:** hooks from `@proappstore/sdk/hooks`, components from `@proappstore/sdk/ui`, shell from `@proappstore/sdk/shell`, `initPro` from `@proappstore/sdk`. Wrong paths fail tsc.

---

## Lint

- ESLint exits 0 with zero errors.
- Required rules: `@typescript-eslint/recommended`, `react-hooks/rules-of-hooks`, `react-hooks/exhaustive-deps`.
- No unused imports or variables.
- Prettier formatting applied before commit (`npm run format`).

---

## SDK correctness checklist

| Pattern | Correct |
|---------|----------|
| Import hooks | `from '@proappstore/sdk/hooks'` |
| Import UI | `from '@proappstore/sdk/ui'` |
| Import shell | `from '@proappstore/sdk/shell'` |
| Sign in (GitHub) | `app.auth.signIn()` |
| Sign in (Google) | `app.auth.signIn('google')` |
| Sign in (Apple) | **Does not exist — never use** |
| `SignInButton` props | `{ app, label? }` only — no `provider` prop |
| User display name | `user.login` |
| User stable key | `user.id` |
| Typed query | `app.db.query<MyType>(sql, params)` |
| Execute return | `result.meta.last_row_id` (snake_case) |
| Migration entry | `{ name: string; sql: string }` only |
| Storage list | `.key` not `.name`; no `.url` → use `publicUrl(key)` |
| Geocode result | `results[0].lat` / `results[0].lng` NOT `.latitude` / `.longitude` |

---

## Accessibility (a11y)

- All images: non-empty, descriptive `alt` text.
- All form fields: `<label htmlFor>` association.
- No `tabIndex > 0`.
- Visible focus indicators on all interactive elements.
- WCAG AA colour contrast for all text (use `amber-600` on white, not `amber-500`).
- Icon-only buttons: `<span className="sr-only">...</span>` for screen reader label.

---

## Mobile

- Baseline viewport: 375 px (iPhone SE) — no overflow, no broken layouts.
- Listing grid single-column on mobile, two-column sm, three-column lg.
- Touch targets ≥ 44 × 44 px on all tappable elements.
- Photo upload `<input accept="image/*">` for device camera support.
- Forms usable with virtual keyboard visible.

---

## Security

- **Moderator writes** always call `app.roles.check('moderator') || app.roles.check('owner')` before executing — never trust a client-passed claim.
- **Walker writes** always scope SQL to `WHERE user_id = ?` bound to `app.auth.user.id`.
- **No secrets in client code** — any future external API calls go via `app.proxy.fetch`.
- **`contact_value` not bulk-exposed** — `list_listings` omits it; only `get_listing` and `get_my_listing` include it.

---

## Performance

- Directory queries always use `LIMIT ? OFFSET ?` — never `SELECT *` without a limit.
- Images: specify `width` + `height` to prevent CLS; use `loading="lazy"` below the fold.
- Photo uploads: client-side resize to max 1200 px wide before uploading (use `<canvas>`).
- No blocking `await` at module top-level — run `app.db.migrate` inside a React `useEffect` or app-init function.

---

## Definition of Done (per ticket)

- [ ] `tsc --noEmit` exits 0
- [ ] ESLint exits 0
- [ ] Relevant Playwright E2E spec passes
- [ ] Dark mode tested visually
- [ ] Mobile 375 px viewport tested
- [ ] No `as any` or `@ts-ignore` introduced
- [ ] PR description references ticket ID

---

## Playwright E2E coverage (minimum)

| Scenario | Key assertion |
|----------|---------------|
| Guest browses directory | Listing cards visible without sign-in |
| Guest views profile page | Bio, rate, contact CTA, map visible |
| Walker signs in and creates listing | Listing appears in directory |
| Walker edits listing | Updated fields shown in directory |
| Walker deactivates listing | Listing absent from public directory |
| Moderator removes any listing | Listing gone; confirmation shown |
| Non-owner cannot remove another's listing | Action blocked; error shown |
| City filter applied | Only matching city listings shown |
| Mobile layout at 375 px | No overflow; cards readable |

# SDK Plan

> Confirmed signatures from live PAS SDK docs (`read_docs`). Do NOT deviate.
> Reference: https://proappstore.online/skills.md

## 1. Initialisation

```ts
// src/lib/app.ts
import { initPro } from '@proappstore/sdk';
export const app = initPro({ appId: 'dog-walking-app' });
```

One singleton instance exported from `src/lib/app.ts` and imported everywhere.
**Never** import hooks/components from the root `@proappstore/sdk` — use the sub-paths below.

---

## 2. Authentication

### Import paths (critical — wrong path = tsc failure)

```ts
// Hooks (React)
import { useProAuth } from '@proappstore/sdk/hooks';
// UI components
import { SignInButton, ProfileMenu, Avatar } from '@proappstore/sdk/ui';
// Shell wrapper
import { ProShell } from '@proappstore/sdk/shell';
```

### User shape — EXACT, no other fields

```ts
type User = {
  id: string;           // e.g. "gh:123" — use as FK in DB rows
  login: string;        // display name — use this, NOT user.name or user.email
  avatarUrl: string | null;
  dateOfBirth: string | null;
};
// user.name and user.email DO NOT EXIST — writing them fails tsc
```

### Hook

```ts
const { user, loading, signIn, signOut } = useProAuth(app);
// signIn() via hook is zero-arg (GitHub only)
// For Google: call app.auth.signIn('google') directly
```

### Sign-in options

```ts
app.auth.signIn();          // GitHub (default)
app.auth.signIn('google');  // Google
// NO 'apple' — signIn('apple') FAILS tsc
await app.auth.signInWithEmail(email);  // magic-link
```

### SignInButton component — props: ONLY { app, label? }

```tsx
// Correct
<SignInButton app={app} label="List your services" />

// For Google, render your OWN button — SignInButton has no provider prop:
<button onClick={() => app.auth.signIn('google')}>Sign in with Google</button>
```

### Auth rules for this app

| Visitor | Can do |
|---------|--------|
| Guest (unauthenticated) | Browse directory, view profile pages |
| Any signed-in user | Create/edit/deactivate **own** listing |
| `moderator` role | Remove any listing |
| `owner` role | Full moderation + assign/revoke moderators |

---

## 3. RBAC (`app.roles`) — built-in, no custom table

> Use `app.roles` for ALL permission gating. Never a custom roles table, never hardcoded user IDs.
> Docs: https://proappstore.online/docs

```ts
// Check current user's role
const isMod   = await app.roles.check('moderator');  // → boolean
const isOwner = await app.roles.check('owner');       // → boolean

// Current user's roles list
const mine = await app.roles.myRoles();              // → string[]

// Assign / revoke (owner action)
await app.roles.assign(userId, 'moderator');          // userId = user.id string
await app.roles.revoke(userId, 'moderator');

// List all role assignments (owner-only)
const all = await app.roles.listAll();               // → RoleAssignment[]
```

| Role | Capability |
|------|------------|
| `owner` | Full moderation; assign/revoke moderators; auto-assigned to app creator |
| `moderator` | Remove any listing |
| *(any signed-in user)* | Create/edit/deactivate their own listing only |
| *(guest)* | Browse + view listings |

---

## 4. Database — `app.db` (Pro primitive)

```ts
// Migration — entry shape is { name, sql } ONLY
await app.db.migrate([
  { name: '0001_create_listings',         sql: '...' },
  { name: '0002_create_listing_services', sql: '...' },
]);

// Typed query (read)
const { rows } = await app.db.query<Listing>(
  'SELECT * FROM listings WHERE is_active = 1 ORDER BY created_at DESC LIMIT ? OFFSET ?',
  [pageSize, offset]
);
// Always pass <T>; without it rows are unknown[] → downstream tsc errors

// Execute (write — INSERT / UPDATE / DELETE)
const result = await app.db.execute(
  'INSERT INTO listings VALUES (?, ?, ...)',
  [id, userId, ...]
);
// result → { meta: { changes: number; duration: number; last_row_id: number } }
// NO .rows on execute; field is last_row_id (snake_case — NOT lastRowId)

// Batch (transactional — use for listing + services insert together)
await app.db.batch([
  { sql: 'INSERT INTO listings ...', params: [...] },
  { sql: 'INSERT INTO listing_services ...', params: [...] },
]);
// → array of { rows, meta } — one entry per statement
```

---

## 5. Storage — `app.storage` (Pro primitive)

> Walker photos are public (shown on listing cards). Use `uploadPublic`.

```ts
// Upload profile photo — public read, no auth required to view
const { key, url } = await app.storage.uploadPublic(
  `walkers/${userId}/photo.jpg`,   // storage key
  file,                            // File | Blob | ArrayBuffer
  'image/jpeg'
);

// Derive a no-auth URL for <img src> from a stored key
const src = app.storage.publicUrl(photoKey);
// Use this when rendering ListingCard and ProfilePage

// List files (admin cleanup)
const files = await app.storage.list();
// → { key: string; size: number; uploaded: string }[]
// Note: property is .key (NOT .name); there is NO .url — use publicUrl(key)

// Delete a photo (on listing deletion or photo replacement)
await app.storage.delete(photoKey);
```

**Key convention:** `walkers/{user_id}/photo.{ext}`  
One photo per walker. On update: delete old key then upload new (or overwrite same key).

---

## 6. Maps — `app.maps` (Pro primitive)

> Geocode suburb+city on listing creation/update; display a map pin on profile pages.

```ts
// Geocode suburb + city string → lat/lng to store in listings row
const results = await app.maps.geocode(`${suburb}, ${city}`);
// → GeoResult[]
// Each: { lat: number; lng: number; displayName: string; address: object; type: string; importance: number }
// Use results[0].lat / results[0].lng — NOT .latitude / .longitude

// Static tile for profile page map (simple <img>)
const tileUrl = app.maps.staticUrl(lat, lng);
// <img src={tileUrl} alt={`Map showing ${displayName}'s service area`} />

// Interactive embed URL (optional enhancement)
const embedUrl = app.maps.embedUrl(lat, lng);
// <iframe src={embedUrl} />
```

If geocoding returns 0 results, store `lat = null` / `lng = null` and omit the map.

---

## 7. ProShell

```tsx
import { ProShell } from '@proappstore/sdk/shell';
import { app } from './lib/app';

export default function Root() {
  return (
    <ProShell app={app} appName="Dog Walking" showThemeToggle>
      {/* router / page outlet here */}
    </ProShell>
  );
}
```

`ProShell` handles auth lifecycle, header chrome, theme toggle, and `ProfileMenu`. Use at the root.

---

## 8. Primitives NOT used in MVP

| Primitive | Reason skipped |
|-----------|----------------|
| `app.rooms` | No real-time features |
| `app.kv` | All data lives in `app.db` |
| `app.counters` | No cross-user counters needed |
| `app.ai` | No AI features in MVP |
| `app.email` / `app.sms` | Contact handled externally by walkers |
| `app.notifications` | No notification events in MVP |
| `app.subscription` | App is free to use for walkers and owners |
| `app.webhooks` | Not needed in MVP |
| `app.proxy.fetch` | No external secret-injected APIs |

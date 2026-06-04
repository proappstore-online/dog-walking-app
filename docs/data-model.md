# Data Model

> All tables created via `app.db.migrate(migrations)`. Each migration entry is `{ name: string; sql: string }` — NO `id`, `version`, `up`, or `down` fields.

## Migrations (in order)

```ts
await app.db.migrate([
  {
    name: '0001_create_listings',
    sql: `
      CREATE TABLE IF NOT EXISTS listings (
        id            TEXT PRIMARY KEY,
        user_id       TEXT NOT NULL,
        display_name  TEXT NOT NULL,
        bio           TEXT NOT NULL,
        suburb        TEXT NOT NULL,
        city          TEXT NOT NULL,
        lat           REAL,
        lng           REAL,
        rate_per_hour INTEGER NOT NULL,
        contact_type  TEXT NOT NULL,
        contact_value TEXT NOT NULL,
        photo_key     TEXT,
        is_active     INTEGER NOT NULL DEFAULT 1,
        created_at    TEXT NOT NULL,
        updated_at    TEXT NOT NULL
      )
    `
  },
  {
    name: '0002_create_listing_services',
    sql: `
      CREATE TABLE IF NOT EXISTS listing_services (
        id         TEXT PRIMARY KEY,
        listing_id TEXT NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
        service    TEXT NOT NULL
      )
    `
  }
]);
```

## Table: `listings`

| Column | Type | Notes |
|--------|------|-------|
| `id` | `TEXT` | UUID, primary key |
| `user_id` | `TEXT` | `user.id` from PAS auth (e.g. `"gh:123"`) |
| `display_name` | `TEXT` | Walker's chosen display name (user may override their `user.login`) |
| `bio` | `TEXT` | Free-text description, max 500 chars |
| `suburb` | `TEXT` | Suburb/neighbourhood |
| `city` | `TEXT` | City — primary filter field |
| `lat` | `REAL` | Geocoded latitude (nullable until geocoded) |
| `lng` | `REAL` | Geocoded longitude (nullable until geocoded) |
| `rate_per_hour` | `INTEGER` | Rate in whole currency units (display as `$N/hr`) |
| `contact_type` | `TEXT` | One of: `'email'`, `'phone'`, `'instagram'`, `'website'` |
| `contact_value` | `TEXT` | The raw contact value (email address, phone number, handle, URL) |
| `photo_key` | `TEXT` | R2 storage key (nullable); render with `app.storage.publicUrl(photo_key)` |
| `is_active` | `INTEGER` | `1` = visible, `0` = deactivated/soft-deleted (SQLite boolean) |
| `created_at` | `TEXT` | ISO-8601 timestamp |
| `updated_at` | `TEXT` | ISO-8601 timestamp |

**Future indexes (add in a follow-up migration if needed):** `city`, `user_id`.

## Table: `listing_services`

One-to-many: a listing can offer multiple service types.

| Column | Type | Notes |
|--------|------|-------|
| `id` | `TEXT` | UUID, primary key |
| `listing_id` | `TEXT` | FK → `listings.id` |
| `service` | `TEXT` | One of: `'solo_walk'`, `'group_walk'`, `'drop_in_visit'`, `'overnight_stay'`, `'puppy_care'` |

## TypeScript interfaces

```ts
export interface Listing {
  id: string;
  user_id: string;
  display_name: string;
  bio: string;
  suburb: string;
  city: string;
  lat: number | null;
  lng: number | null;
  rate_per_hour: number;
  contact_type: 'email' | 'phone' | 'instagram' | 'website';
  contact_value: string;
  photo_key: string | null;
  is_active: 0 | 1;
  created_at: string;
  updated_at: string;
}

export interface ListingService {
  id: string;
  listing_id: string;
  service: 'solo_walk' | 'group_walk' | 'drop_in_visit' | 'overnight_stay' | 'puppy_care';
}

// Composite view used in UI — join listings + services
export interface ListingWithServices extends Listing {
  services: ListingService['service'][];
}
```

## Query patterns

```ts
// Browse all active listings (public, paginated)
const { rows } = await app.db.query<Listing>(
  `SELECT * FROM listings WHERE is_active = 1 ORDER BY created_at DESC LIMIT ? OFFSET ?`,
  [pageSize, offset]
);

// Filter by city
const { rows } = await app.db.query<Listing>(
  `SELECT * FROM listings WHERE is_active = 1 AND city = ? ORDER BY created_at DESC LIMIT ? OFFSET ?`,
  [city, pageSize, offset]
);

// Get single listing by id
const { rows } = await app.db.query<Listing>(
  `SELECT * FROM listings WHERE id = ? AND is_active = 1`,
  [id]
);

// Get services for a listing
const { rows } = await app.db.query<ListingService>(
  `SELECT * FROM listing_services WHERE listing_id = ?`,
  [listingId]
);

// Get walker's own listing (including inactive)
const { rows } = await app.db.query<Listing>(
  `SELECT * FROM listings WHERE user_id = ?`,
  [userId]  // user.id from app.auth.user
);

// Insert listing (use app.db.batch to atomically insert listing + services)
const result = await app.db.execute(
  `INSERT INTO listings
     (id, user_id, display_name, bio, suburb, city, lat, lng,
      rate_per_hour, contact_type, contact_value, photo_key, is_active, created_at, updated_at)
   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?)`,
  [id, userId, displayName, bio, suburb, city, lat, lng,
   ratePerHour, contactType, contactValue, photoKey, now, now]
);
// result.meta.last_row_id  (snake_case — NOT lastRowId)
// execute returns { meta } only — NO .rows

// Soft-delete (deactivate)
await app.db.execute(
  `UPDATE listings SET is_active = 0, updated_at = ? WHERE id = ? AND user_id = ?`,
  [now, id, userId]
);
```

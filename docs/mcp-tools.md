# MCP Tool Surface

> The spec the Dev materialises into `mcp.json` at the repo root.
> These are the operations an external AI agent (or integration) should be able to call.

All tools operate against `app.db` tables (`listings`, `listing_services`).

---

## `list_listings`

| Field | Value |
|-------|-------|
| **Description** | Return a paginated list of active walker listings, optionally filtered by city. |
| **Operation** | Read |
| **Tables** | `listings` |
| **Params** | `city?: string`, `page?: number` (default 1), `pageSize?: number` (default 20) |
| **Scope** | Shared — public, no auth required |
| **Returns** | `{ rows: Listing[]; total: number; page: number; pageSize: number }` |
| **Note** | Omits `contact_value` to prevent bulk scraping. Owners see contact details only on `get_listing`. |

```sql
SELECT id, user_id, display_name, suburb, city, rate_per_hour,
       photo_key, is_active, created_at
FROM listings
WHERE is_active = 1 [AND city = ?]
ORDER BY created_at DESC
LIMIT ? OFFSET ?
```

---

## `get_listing`

| Field | Value |
|-------|-------|
| **Description** | Return a single active listing (with services and contact details) by ID. |
| **Operation** | Read |
| **Tables** | `listings`, `listing_services` |
| **Params** | `id: string` (required) |
| **Scope** | Shared — public, no auth required |
| **Returns** | `ListingWithServices \| null` (includes `contact_value`) |

```sql
SELECT * FROM listings WHERE id = ? AND is_active = 1
SELECT * FROM listing_services WHERE listing_id = ?
```

---

## `get_my_listing`

| Field | Value |
|-------|-------|
| **Description** | Return the calling user's own listing (active or inactive, including `contact_value`). |
| **Operation** | Read |
| **Tables** | `listings`, `listing_services` |
| **Params** | *(none — scoped to caller's `user.id`)* |
| **Scope** | Per-user — requires auth |
| **Returns** | `ListingWithServices \| null` |

```sql
SELECT * FROM listings WHERE user_id = ?
SELECT * FROM listing_services WHERE listing_id = ?
```

---

## `create_listing`

| Field | Value |
|-------|-------|
| **Description** | Create a new walker listing for the calling user. Fails if the user already has a listing. |
| **Operation** | Write |
| **Tables** | `listings`, `listing_services` |
| **Params** | `display_name: string`, `bio: string`, `suburb: string`, `city: string`, `rate_per_hour: number`, `contact_type: 'email'\|'phone'\|'instagram'\|'website'`, `contact_value: string`, `services: string[]` |
| **Scope** | Per-user — requires auth |
| **Returns** | `{ id: string }` |
| **Notes** | Geocodes `suburb + city` via `app.maps.geocode`; stores `lat`/`lng`. Inserts listing + service rows via `app.db.batch`. |

---

## `update_listing`

| Field | Value |
|-------|-------|
| **Description** | Update fields on the calling user's own listing. Only the listing owner may call this. |
| **Operation** | Write |
| **Tables** | `listings`, `listing_services` |
| **Params** | `id: string`, then any subset of: `display_name`, `bio`, `suburb`, `city`, `rate_per_hour`, `contact_type`, `contact_value`, `services` |
| **Scope** | Per-user — caller must own the listing (`WHERE user_id = ?`) |
| **Returns** | `{ ok: true }` |
| **Notes** | Re-geocode if `suburb` or `city` changes. If `services` provided, delete + re-insert `listing_services` rows in batch. |

---

## `deactivate_listing`

| Field | Value |
|-------|-------|
| **Description** | Soft-delete the calling user's own listing (sets `is_active = 0`). |
| **Operation** | Write |
| **Tables** | `listings` |
| **Params** | `id: string` |
| **Scope** | Per-user — caller must own the listing |
| **Returns** | `{ ok: true }` |

```sql
UPDATE listings SET is_active = 0, updated_at = ? WHERE id = ? AND user_id = ?
```

---

## `remove_listing` *(moderator / owner only)*

| Field | Value |
|-------|-------|
| **Description** | Hard-remove any listing. Gated to `moderator` or `owner` role. |
| **Operation** | Write |
| **Tables** | `listings`, `listing_services` |
| **Params** | `id: string` |
| **Scope** | Shared — requires `moderator` or `owner` role |
| **Returns** | `{ ok: true }` |
| **Notes** | Check `await app.roles.check('moderator') \|\| await app.roles.check('owner')` before executing. Batch-delete services then listing. |

---

## `list_cities`

| Field | Value |
|-------|-------|
| **Description** | Return distinct cities that have at least one active listing (for the filter dropdown). |
| **Operation** | Read |
| **Tables** | `listings` |
| **Params** | *(none)* |
| **Scope** | Shared — public, no auth required |
| **Returns** | `string[]` |

```sql
SELECT DISTINCT city FROM listings WHERE is_active = 1 ORDER BY city ASC
```

---

## Implementation notes for Dev

- All write tools must assert `app.auth.user !== null` and return a 401-equivalent error if not.
- `remove_listing` must additionally assert `app.roles.check('moderator') || app.roles.check('owner')`.
- Walker writes (`create`, `update`, `deactivate`) always scope the SQL `WHERE` to `user_id = app.auth.user.id`.
- `contact_value` is intentionally excluded from `list_listings` results to prevent bulk data scraping; include it only in `get_listing` and `get_my_listing`.
- Materialise these as named exports in root `mcp.json` for platform discovery.

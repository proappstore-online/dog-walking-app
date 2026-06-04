import { initPro } from '@proappstore/sdk';

export const app = initPro({ appId: 'dog-walking-app' });

export async function runMigrations(): Promise<void> {
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
}

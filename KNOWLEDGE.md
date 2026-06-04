> **Last reviewed: 2026-06-04**

# Dog Walking App — Knowledge Base

> **Ground truth for BA, Dev, and QA.** Do not build from memory; read this first.

## What the app is

A public directory where **dog walkers** can create a profile advertising their services (rates, service area, bio, photo) and expose contact details so **dog owners** can reach them directly. Think of it as a lightweight, searchable notice-board: walkers self-advertise, owners browse and get in touch.

## Market position

The app sits in a deliberate gap in the market — see [`docs/competitive-analysis.md`](docs/competitive-analysis.md) for the full breakdown.

| Competitor type | Examples | Problem |
|----------------|----------|---------|
| Managed marketplaces | Rover, Wag, Pawshake | 15–40 % commission; platform controls contact |
| Job-board hybrids | Care.com | Double paywall; not dog-specific |
| Unstructured social | Facebook Groups, Gumtree | Free but no permanent profiles, no search |
| **This app** | Dog Walking App | **Free, permanent, searchable — walkers own the relationship** |

**The gap:** zero-cost, zero-commission, direct-contact, permanent dog-walker directory — globally accessible. No existing product occupies this exact space.

**Core differentiators (never erode these):**
- Free to list, free to browse, zero commission — forever
- Walker's real contact info is on the profile; no in-platform messaging middleman
- Permanent profiles (no expiry) with structured data (rates, services, area)
- Works for any city worldwide — not geo-gated

## Users

| Persona | Description |
|---------|-------------|
| **Walker** | Signs in, creates/manages their public listing. Wants to be found and contacted. |
| **Owner** | Browses listings, filters by area/availability, views walker profiles, copies/clicks contact info. May or may not sign in. |
| **App owner** | The platform creator (auto-assigned `owner` role). Can moderate listings via built-in RBAC. |

Guests (unauthenticated owners) **can browse** — sign-in is only required to create or manage a listing.

## Core features (MVP)

1. **Walker listing creation** — authenticated walkers fill out a profile form (display name, bio, suburb/city, rates, contact method, profile photo).
2. **Public directory** — paginated, searchable card grid of all active walker listings. Filterable by suburb/city.
3. **Walker profile page** — full listing detail: photo, bio, rates, service area map pin, contact details.
4. **Walker dashboard** — edit or deactivate/delete own listing.
5. **Moderation** — app owner (and any `moderator`) can remove any listing via RBAC-gated UI.

## Explicit non-goals (do NOT build)

- In-app messaging / chat between owners and walkers (walkers share external contact info).
- Booking, scheduling, or calendar integration.
- Payment processing or in-app transactions.
- Review / rating system.
- Walker background-check verification.
- Push notifications in MVP (no events to notify about).
- Native mobile apps (PWA is sufficient).
- Multi-language / i18n.

## Documentation index

| File | Contents |
|------|----------|
| `docs/data-model.md` | DB tables, columns, types, migrations |
| `docs/sdk-plan.md` | Exact SDK primitives + signatures used |
| `docs/competitive-analysis.md` | Competitor breakdown, feature matrix, strategic implications |
| `docs/mcp-tools.md` | MCP tool surface for external AI access |
| `docs/design.md` | UX layout, design system, dark mode |
| `docs/quality.md` | Quality bar: tsc, lint, a11y, mobile |

## Tech stack (non-negotiable)

- **Framework:** React + TypeScript + Vite + Tailwind CSS
- **Platform:** ProAppStore (Cloudflare-hosted)
- **SDK:** `@proappstore/sdk` (Pro tier — DB + Storage required)
- **App ID:** `dog-walking-app`
- **Auth providers:** GitHub (default) and/or Google — NO Apple
- **License:** Pro (required for `app.db`, `app.storage`, `app.maps`)

## Key constraints

- `user.login` is the display name (NO `user.name`, NO `user.email` — those fields do not exist and break `tsc`).
- `user.id` (e.g. `"gh:123"`) is the stable foreign key stored in DB rows.
- All permission gating uses `app.roles` (built-in RBAC) — never a hand-rolled roles table.
- Listings browsing is **public** (no auth required to read).
- Walker profile photos stored via `app.storage.uploadPublic` and served via `app.storage.publicUrl`.

_Last reviewed: 2026-06-04._

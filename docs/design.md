# Design Conventions

## Layout

### Page structure

```
<ProShell>          ← handles header chrome, theme toggle, ProfileMenu
  <main>
    <DirectoryPage />  |  <ProfilePage />  |  <DashboardPage />  |  <AdminPage />
  </main>
</ProShell>
```

### Routes (client-side)

| Path | Page | Auth required |
|------|------|---------------|
| `/` | Directory — listing card grid | No |
| `/walkers/:id` | Walker profile detail | No |
| `/dashboard` | Walker's own listing manager | Yes |
| `/dashboard/edit` | Create / edit listing form | Yes |
| `/admin` | Moderator listing management | Yes + `moderator` or `owner` role |

---

## Component hierarchy

```
App (ProShell)
├── DirectoryPage
│   ├── SearchFilterBar  (city select + text search)
│   └── ListingGrid
│       └── ListingCard  (photo, name, suburb, rate badge, service chips)
├── ProfilePage
│   ├── WalkerHero       (photo, name, rate, CTA contact button)
│   ├── ServiceChips
│   ├── BioSection
│   └── MapPin           (app.maps.staticUrl img — hidden if lat/lng null)
├── DashboardPage
│   ├── ListingForm      (create / edit)
│   └── ListingPreview
└── AdminPage            (moderator-only)
    └── ListingTable     (all active listings, remove action)
```

---

## Design system

### Colour palette (Tailwind)

| Token | Light mode | Dark mode |
|-------|------------|-----------|
| Primary | `amber-500` | `amber-400` |
| Primary hover | `amber-600` | `amber-300` |
| Page background | `gray-50` | `gray-900` |
| Card surface | `white` | `gray-800` |
| Border | `gray-200` | `gray-700` |
| Text primary | `gray-900` | `gray-50` |
| Text muted | `gray-500` | `gray-400` |
| Destructive | `red-500` | `red-400` |

Warm amber = brand accent (evokes dogs, sunshine, outdoors).

> **Contrast note:** `amber-500` on white is 3.1:1 (fails WCAG AA for text).  
> Use `amber-600` for text on light backgrounds, `amber-400` for text on dark backgrounds.

### Typography

- Body: Tailwind default `font-sans` (system font stack — no custom fonts)
- Headings: `font-bold`, sizes `text-xl` → `text-4xl`
- Muted / secondary: `text-sm text-gray-500 dark:text-gray-400`

### Spacing

- Page horizontal padding: `px-4 sm:px-6 lg:px-8`
- Card grid gap: `gap-4 sm:gap-6`
- Section vertical padding: `py-8 sm:py-12`

---

## Dark mode

`ProShell` provides the theme toggle (`showThemeToggle` defaults to `true`). Use Tailwind `dark:` variants throughout — no custom theme provider.

```tsx
// Example card
<div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm p-4">
  <p className="text-gray-900 dark:text-gray-50 font-semibold">{name}</p>
  <p className="text-gray-500 dark:text-gray-400 text-sm">{suburb}</p>
</div>
```

---

## ListingCard

- Photo: fixed-height, `aspect-video` or `aspect-square`, `object-cover`, rounded top corners.
- Walker name: `font-semibold text-gray-900 dark:text-gray-50`
- Suburb, city: `text-sm text-gray-500 dark:text-gray-400`
- Rate badge: `bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200 text-xs font-medium px-2 py-0.5 rounded-full`
- Service chips: small pills, max 3 visible + "+ N more" overflow.
- Entire card is a `<Link>` to `/walkers/:id`.
- Hover: `hover:shadow-md hover:scale-[1.01] transition-all duration-150`.
- Placeholder if no photo: `bg-amber-100 dark:bg-amber-900` with a paw icon.

---

## Walker profile page

- Hero: large photo (or avatar circle if no photo), name, suburb, rate, contact CTA.
- Contact CTA (amber-500 button) — behaviour by `contact_type`:
  - `email` → `<a href="mailto:{value}">`
  - `phone` → `<a href="tel:{value}">`
  - `instagram` → `<a href="https://instagram.com/{value}" target="_blank">`
  - `website` → `<a href="{value}" target="_blank">`
- Map: `<img src={app.maps.staticUrl(lat, lng)} alt="..." />` below bio. Hidden when `lat`/`lng` null.
- Services: labelled chip list.

---

## Listing form (create / edit)

- Single column, `max-w-2xl mx-auto`.
- Label above input: `<label className="block text-sm font-medium text-gray-700 dark:text-gray-300">`
- Inputs: `border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-50 w-full focus-visible:ring-2 focus-visible:ring-amber-500`
- Photo upload: drag-and-drop zone + click-to-browse; show thumbnail preview.
- Rate: `<input type="number" min={1} />` rendered with `$N/hr` suffix label.
- Services: checkbox group (fixed enum, no free-text).
- Validation errors: `<p className="text-red-500 text-sm mt-1">{error}</p>`
- Primary action button: `bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-lg px-6 py-2`

---

## Accessibility (a11y)

- All `<img>` tags have descriptive `alt`.
- All `<input>` / `<select>` elements have a `<label htmlFor>` pair.
- No positive `tabIndex` values.
- Focus rings on all interactive elements: `focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:outline-none`
- Icon-only buttons include `<span className="sr-only">{description}</span>`.
- Map image: `alt={\`Map showing ${displayName}'s service area\`}`

---

## Mobile-first

- Listing grid: `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`
- All containers: `overflow-x-hidden`
- Touch targets ≥ 44 × 44 px: `min-h-[44px] min-w-[44px]` on buttons.
- Photo upload `<input accept="image/*">` (allows device camera on mobile).
- Forms must not break when virtual keyboard is open — use `pb-[env(safe-area-inset-bottom)]` at root.

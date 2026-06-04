# Competitive Analysis — Dog Walking App

> Last reviewed: 2026-06-04
> Purpose: ground truth for positioning decisions. Do not build features that erase the differentiator.

---

## 1. Landscape at a Glance

The dog-care market splits into three tiers. This app occupies a deliberate gap between all three.

| Tier | Examples | How it works | Core problem |
|------|----------|--------------|--------------|
| **Managed marketplaces** | Rover, Wag, Fetch! | Platform owns booking + payment; takes 15–25 % cut; controls contact | High fees, walkers locked in, no direct owner–walker relationship |
| **Job-board hybrids** | Care.com, Pawshake, Holidog | Subscription or commission; light vetting; messaging via platform | Still intermediated; subscription cost; patchy coverage outside US/EU |
| **Unstructured social** | Facebook Groups, Nextdoor, Gumtree/Craigslist | Free posts, no profiles, no search | No discoverability, no trust signals, no permanence |
| **➜ This app** | Dog Walking App | Free permanent profile; direct contact; zero commission | — |

---

## 2. Competitor Deep-Dives

### 2a. Rover (rover.com)
- **Model:** Managed marketplace. Platform handles booking calendar, payments, messaging.
- **Revenue:** 20 % service fee from walkers + 5–7 % booking fee from owners.
- **Strengths:** Huge brand, insurance coverage, review ecosystem, background checks.
- **Weaknesses for walkers:** 20 % cut on every job; platform can suspend profile; no direct owner contact; algorithm controls visibility; US/CA/EU-heavy.
- **Weaknesses for owners:** Can't contact walkers outside Rover; prices inflated by fee pass-through; no local neighbourhood walkers without an account.
- **Gap this app exploits:** Rover is expensive and intermediating. Walkers who already have a client base (or want one) just need a presence, not a middleman.

### 2b. Wag (wagwalking.com)
- **Model:** On-demand platform (Uber-style dispatch). Walkers apply, get vetted, then dispatched.
- **Revenue:** ~40 % of each booking.
- **Strengths:** Insurance, GPS tracking, in-app updates, instant bookings.
- **Weaknesses:** Extremely high commission; walkers are gig workers, not independent businesses; US-only; owner has no say in *which* walker shows up.
- **Gap this app exploits:** Wag is a staffing platform, not a directory. Independent walkers are excluded or disadvantaged.

### 2c. Care.com (care.com) — pet-care section
- **Model:** Subscription directory. Caregivers pay to appear; families pay to contact.
- **Revenue:** Monthly membership from both sides (~$20–40/mo for caregivers).
- **Strengths:** Cross-category (childcare, pet, elder); large user base.
- **Weaknesses:** Double paywall; trust concerns (historical data-quality issues); generic, not dog-focused; expensive for occasional walkers.
- **Gap this app exploits:** Zero cost. No paywall on either side.

### 2d. Pawshake (pawshake.com) — EU/AU-heavy
- **Model:** Commission marketplace (19 % from sitter/walker).
- **Strengths:** EU/AU traction, multi-service (walking, boarding, daycare).
- **Weaknesses:** Commission; platform messaging only; limited to countries they operate in.
- **Gap this app exploits:** Commission-free + global (any city can self-populate).

### 2e. Facebook Groups / Nextdoor
- **Model:** Free social posts in local neighbourhood groups.
- **Strengths:** Zero cost, wide reach, trusted community.
- **Weaknesses:** Posts disappear; no searchable profile; no service/rate structure; owner must scroll endlessly; no permanent presence for walker; no filtering.
- **Gap this app exploits:** Permanent, searchable, structured walker profiles with filterable city/suburb.

### 2f. Gumtree / Craigslist
- **Model:** Free classifieds.
- **Strengths:** Free, local, familiar.
- **Weaknesses:** No category-specific structure; posts expire; spam-heavy; no trust signals; listings require manual renewal.
- **Gap this app exploits:** Purpose-built category with persistent profiles and structured data (rates, services, service area).

---

## 3. Feature Matrix

| Feature | Rover | Wag | Care.com | Pawshake | FB Group | **This App** |
|---------|-------|-----|----------|----------|----------|--------------|
| Free for walkers | ✗ (20% cut) | ✗ (40% cut) | ✗ (sub) | ✗ (19%) | ✓ | **✓** |
| Free for owners | ✗ (fee) | ✗ (fee) | ✗ (sub) | ✗ (fee) | ✓ | **✓** |
| Direct contact | ✗ | ✗ | Partial | ✗ | ✓ | **✓** |
| Permanent profile | ✓ | ✓ | ✓ | ✓ | ✗ | **✓** |
| Searchable / filterable | ✓ | ✓ | ✓ | ✓ | ✗ | **✓** |
| No booking/payment required | ✗ | ✗ | ✗ | ✗ | ✓ | **✓** |
| Dog-specific | ✓ | ✓ | ✗ | ✓ | ✗ | **✓** |
| Works globally (no geo-gate) | ✗ | ✗ | ✗ | ✗ | ✓ | **✓** |
| Walker owns profile/contact | ✗ | ✗ | ✗ | ✗ | Partial | **✓** |

---

## 4. The Identified Gap

> **Zero-cost, zero-commission, direct-contact, permanent dog-walker directory — globally accessible.**

No competitor occupies this exact space:
- Free platforms (FB Groups, Gumtree) are unstructured and non-permanent.
- Structured platforms (Rover, Wag, Care, Pawshake) are either commission-based or paywalled and intermediated.

The gap is: **structured discoverability + zero friction + full walker ownership of the relationship.**

---

## 5. Strategic Implications for the Build

| Implication | What it means for features |
|-------------|---------------------------|
| **Zero-cost is the moat** | Never add mandatory listing fees or transaction fees — it would erase the differentiator. |
| **Direct contact is the value** | Walker's contact info (email, phone, Instagram, website) must be prominent on the profile. No in-platform messaging that intermediates. |
| **No booking engine** | Stay out of scheduling/booking — that's where the competition adds friction. Not-goal, locked. |
| **Global by default** | City/suburb filter must work for any city worldwide, not a country-specific dropdown. Free-text + geocode approach (already in data model) is correct. |
| **Permanence over posts** | Profile must persist until walker deactivates it — no expiry, no renewal prompts. |
| **Walker-owned data** | Walkers can edit/deactivate their own listing at any time. No lock-in. |
| **Trust signals (future)** | The one thing free/social channels lack that paid platforms have: trust. Photo, bio, service area map, and services list are the MVP trust layer. Reviews are a logical post-MVP addition. |

---

## 6. Post-MVP Opportunities (informed by gaps competitors leave)

These are **not** in scope for MVP but are natural next steps given competitor weaknesses:

| Opportunity | Rationale |
|-------------|-----------|
| **Verified reviews** | FB Groups have zero review structure; this is a trust differentiator vs. social channels. |
| **Insurance/certification badges** | Rover/Wag use vetting as a trust signal; a simple self-declared badge (e.g. "Insured") could close the trust gap without a full background-check system. |
| **Multiple contact methods per listing** | Currently one contact. Allowing phone + Instagram + website would increase reach. |
| **Walker availability indicator** | Simple "currently accepting new clients" toggle — none of the free channels offer this. |
| **Owner saved/favourites list** | Owners shortlisting walkers — unmet on free channels. |
| **Email alerts for new walkers in my city** | Rover/Wag do this; free channels don't. Uses `app.email`. |

---

*This document is KB-only. To build any of the above, take it to the PO in the Build tab.*

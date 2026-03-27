# Skyfall — Steam store checklist

Use this as a repo-side record of what exists locally vs. what was uploaded in [Steamworks Partner](https://partner.steamgames.com/). Official requirements and sizes: [Store graphical assets](https://partner.steamgames.com/doc/store/assets).

---

## Asset size reference (pixels)

| Asset | Size (W×H) | Notes |
|--------|------------|--------|
| Small capsule | **231 × 87** | Store lists, bundles |
| Main / large capsule | **616 × 353** | Primary capsule on store |
| Header capsule | **460 × 215** | Top of store page |
| Vertical capsule (optional) | **374 × 448** | Some placements |
| Library capsule | **600 × 900** | Steam client library grid |
| Library hero | **3840 × 1240** | Library detail header (replaceable hero) |
| Page background (optional) | **1438 × 810** | Behind store page content |

**Screenshots:** follow current Steam minimums (typically at least **1280px** on shortest side; **16∶9** is common). Capture at a **fixed resolution** (e.g. 1920×1080) with **no debug overlay**, HUD legible when scaled to store thumbnails (high contrast, readable type).

---

## Local paths (placeholders — add files or note “uploaded to partner only”)

Create the folder `assets/marketing/steam/` (or keep assets on shared drive; update paths below).

### Capsules & library

- [ ] Small capsule (231×87) → `assets/marketing/steam/capsule-small-231x87.png`
- [ ] Main capsule (616×353) → `assets/marketing/steam/capsule-main-616x353.png`
- [ ] Header capsule (460×215) → `assets/marketing/steam/capsule-header-460x215.png`
- [ ] Vertical capsule (374×448) — optional → `assets/marketing/steam/capsule-vertical-374x448.png`
- [ ] Library capsule (600×900) → `assets/marketing/steam/library-capsule-600x900.png`
- [ ] Library hero (3840×1240) → `assets/marketing/steam/library-hero-3840x1240.png`
- [ ] Page background (1438×810) — optional → `assets/marketing/steam/page-bg-1438x810.png`

### Screenshots (minimum 5)

- [ ] Screenshot 01 → `assets/marketing/steam/screenshots/01.png`
- [ ] Screenshot 02 → `assets/marketing/steam/screenshots/02.png`
- [ ] Screenshot 03 → `assets/marketing/steam/screenshots/03.png`
- [ ] Screenshot 04 → `assets/marketing/steam/screenshots/04.png`
- [ ] Screenshot 05 → `assets/marketing/steam/screenshots/05.png`

**Thumbnail readability:** avoid tiny UI text; use moments with clear silhouette and focal point; crop in-engine or in post if HUD is optional for a given shot.

### Copy & metadata (paste into Steamworks; keep source in repo)

- [ ] Short description (final) — see template below; Steam field has its own limit (treat **~300 characters** as a safe rough cap for drafting)
- [ ] Long description (final) — see template below
- [ ] Tags applied in Steamworks — see suggested list below
- [ ] Trailer / GIF — optional; link or file path: `___________________________`

---

## Short description template (~300 characters)

```
Skyfall is a fast procedural endless dodger: rising heat, boss checks, and perk 
drafts between bursts of movement. Chase a high score, spend meta between runs, 
and survive one more wave. [TUNE LENGTH FOR STEAM LIMIT]
```

*(Replace bracketed note; trim to fit the live character counter in Steamworks.)*

---

## Long description template

```
ABOUT
Skyfall drops you into an endless dodge loop with escalating pressure, shield 
management, and rhythm-breaking challenge beats. Between rounds, pick perks that 
reshape the run and push for a new personal best.

FEATURES
• Endless procedural dodging with heat phases and boss encounters
• Perk choices and meta progression between runs
• Achievements, daily-style contracts, and run summaries tuned for “one more try”
• Built for short sessions; keyboard-friendly controls

CONTROLS
[Document final shipping bindings — e.g. WASD / arrows, confirm keys for challenges.]

MODES / PLATFORMS
[Windows via Electron build, etc. — match actual SKU.]
```

---

## Suggested Steam tags

Use only tags that match the shipped game. Starting set:

- `Action`
- `Arcade`
- `Roguelite` *(if meta/perks between runs stay central)*
- `Procedural Generation`
- `Singleplayer`
- `2D`
- `Indie`
- `Score Attack`
- `Difficult` *(optional — only if accurate)*

Add or remove in Steamworks based on actual features and Steam’s tag picker.

---

## Partner-only / human steps

- [ ] App page created and app ID noted: `__________`
- [ ] Build uploaded via SteamPipe / depot layout (out of scope for this checklist)
- [ ] Pricing, release date, review regions — human / business (out of scope)

---

## Revision log

| Date | Change |
|------|--------|
| *(add as you ship)* | |

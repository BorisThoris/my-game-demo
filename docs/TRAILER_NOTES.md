# Trailer capture workflow (Skyfall)

Workflow for a **30–60s** store trailer: capture → edit → export → Steam upload. Axis **G** in `docs/FULLY_FLEDGED_EXPERIENCE.md`.

## Final file location (repo policy)

**There is no trailer `.mp4` checked into this repository yet.** When a master exists, keep it here:

| Path | Purpose |
|------|---------|
| `marketing/trailer-master.mp4` | **Recommended** master export (H.264/AAC, see below). Rename if you prefer, but keep one obvious canonical file. |

Large binaries are **ignored by Git** so clones stay small. Patterns in the repo root `.gitignore`:

- `marketing/*.mp4`
- `marketing/**/*.mp4`

After you drop a file under `marketing/`, it stays **local only** unless you change `.gitignore` or use **Git LFS** / external storage (Drive, Dropbox, studio NAS) and link from your release checklist.

**Human must capture:** actual gameplay footage in OBS (or equivalent), edit pacing and audio in an NLE, export the master, optionally upload to Steamworks. No automated substitute exists in-repo.

---

## Before recording: clean frame

1. **No DevTools** — Do not open browser DevTools (F12) or Electron devtools. Use a normal game window.
2. **Do not use `#/editor`** — The game listens for `window.location.hash === "#/editor"` and starts the editor scene (`app/index.js`). Open the game with **no hash** (e.g. `http://localhost:5173/` or your preview URL only). Remove `#/editor` from bookmarks or the address bar before capture.
3. **Build vs dev** — Prefer `npm run build` then `npm run preview` (or the packaged Electron build) for a stable, full-screen–friendly run. `npm run dev` is fine if the window is clean and performance is acceptable.

### Repeatable “hero” clips

There is **no dedicated trailer seed or chase-cam script** in the codebase today. For repeatable shots: rehearse the same start (menu → run), use the same resolution and zoom in OBS, and trim to the best take. If you add a fixed RNG or camera path later, document the exact steps here.

---

## OBS (or similar) capture settings

Target **Steam-friendly** dimensions and motion:

| Setting | Recommendation |
|---------|----------------|
| Base (canvas) resolution | **1920×1080**, **16:9** |
| Output / scaled resolution | Match canvas (1080p) unless you downscale deliberately; Steam accepts up to 1080p. |
| FPS | **30** or **60** (29.97 / 59.94 also OK) |
| Source | **Game Capture** (preferred) or **Window Capture** on the browser/Electron window; crop to the game view only (no URL bar if possible). |
| Audio | Capture **desktop/game** stereo; add **mic** only if you want voiceover (mix in your NLE). |

Recording format in OBS: use whatever your edit pipeline prefers (**MKV** or **FLV** while recording is fine); **re-encode to H.264/AAC in MP4** for the master and Steam (see Export).

---

## Storyboard (30–60 seconds)

Rough beat sheet; adjust lengths to fit music and pacing.

| Time | Beat | Content |
|------|------|---------|
| 0:00–0:03 | **Hook** | Strongest 1–2s of action or title sting — instant motion, readable silhouette. |
| 0:03–0:35 | **Loop showcase** | Core dodge / phase loop; show HUD so players know what playing feels like (Steam recommends gameplay-first). |
| 0:35–0:45 | **Boss** | Short boss moment — telegraph + dodge pattern. |
| 0:45–0:55 | **Perk** | Quick perk or power moment (pick a readable, flashy one). |
| 0:55–1:00 | **CTA** | End card: **Wishlist on Steam** (+ logo/title as needed). Assume some viewers have **sound off** — text or clear visual CTA. |

Total target: **30–60s**; shorter is fine for a first MVP trailer.

---

## Export: master file + Steam upload specs

Official reference: [Steamworks — Trailers](https://partner.steamgames.com/doc/store/trailer).

### Steam upload (summary)

- **Container:** `.mp4` (also `.mov`, `.wmv` accepted; **MP4 + H.264 is preferred**).
- **Video:** **H.264**, up to **1920×1080**, **high bitrate (5,000+ Kbps)**; Valve’s Adobe Media Encoder preset example uses **H.264 ~20 Mbps** with **AAC stereo 192 kbps**.
- **FPS:** **30 / 29.97** or **60 / 59.94**.
- **Audio:** **AAC**, **stereo**; sample rate **44.1 kHz or 48 kHz** (others can fail processing).
- **Aspect:** **16:9** preferred; 4:3 accepted.
- **Resolution pitfalls:** Prefer common sizes (**1920×1080** or **1280×720**) to avoid conversion errors.

### Master file naming

- Keep a lossless or high-quality intermediate in your NLE project folder (not necessarily in Git).
- Repo-oriented master (local only, under `marketing/`): e.g. `marketing/trailer-master.mp4` per table above.

---

## Music licensing (trailer bed)

- **No copyrighted commercial tracks** in the trailer unless you have a **written license** that covers **synchronized video (trailer)** and **distribution on Steam** (and anywhere else you post the same cut).
- **Safe approaches:** original score, licensed royalty-free/SFX packs with explicit trailer/VOD terms, or a composer agreement listing Steam + social platforms.
- If the game’s in-game music is licensed, **confirm the license covers marketing video** — game OST rights and **trailer** rights are often different. When in doubt, use a **separate trailer bed** with clear documentation (license PDF + attribution file next to the project, not necessarily in Git).

---

## Checklist

- [ ] URL has **no** `#/editor`; DevTools **closed**.
- [ ] 1080p, 30 or 60 fps, clean game frame.
- [ ] Storyboard beats covered in ~30–60s.
- [ ] Export: H.264 + AAC, stereo, 44.1/48 kHz, Steam bitrate/resolution guidance met.
- [ ] Music: licensed or original; trailer use documented.
- [ ] Master saved as `marketing/trailer-master.mp4` (local) or equivalent path; `.mp4` under `marketing/` remains gitignored until you adopt LFS or another policy.

---

## AGENT-45 acceptance (repo / policy)

| Criterion | How this repo satisfies it |
|-----------|----------------------------|
| One **final** `.mp4` in `marketing/` **or** agreed path + doc | **Agreed path:** `marketing/trailer-master.mp4` (documented above). File is **intentionally absent** from Git (see `.gitignore`); **human** captures and exports the binary. |
| **No** copyrighted music without license | Covered in **Music licensing (trailer bed)** above; do not ship a trailer track without documented rights. |

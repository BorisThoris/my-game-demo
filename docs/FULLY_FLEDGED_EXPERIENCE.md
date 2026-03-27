# What “fully fledged” means — and what was still missing

This document **defines axes** of a complete commercial-feeling game experience, maps **existing** work (AGENT-01–39 + current game), and points to **AGENT-40+** for gaps.

---

## 1. Definition: not one bar, but several

“Fully fledged” is ambiguous. Useful breakdown:

| Axis | Question it answers |
|------|---------------------|
| **A. Core loop depth** | Is one hour of play **varied and fair**? |
| **B. Content volume** | Enough **enemies, bosses, perks, challenges, modes** to delay repetition? |
| **C. Balance** | Difficulty **curves** and **rewards** feel intentional across skill levels? |
| **D. Sensory production** | **Audio** and **visual** identity feel finished, not prototype? |
| **E. Onboarding & clarity** | New players **understand** goals, failure, and progression (partially in 33, 16–19). |
| **F. Platform & trust** | **Steam/build/saves/settings** honest and robust (21–30, 23–24, 37–38). |
| **G. Discovery & conversion** | **Store page, trailer, screenshots** sell the game. |
| **H. Accessibility & input** | **Gamepad**, **locale**, **perf** on min spec (27 partial; 31 partial). |
| **I. Quality & shipping** | **CI**, **signing**, **playtest**, **changelog**—repeatable releases. |
| **J. Integrity & compliance** | **Save abuse**, **ratings**, **regional** rules—not glamorous but real for Steam. |

**AGENT-01–39** skew heavily toward **E + F** and **engineering honesty**, with **incremental** A/B via contracts, meta, modifiers, and optional strips. They **do not** systematically mandate **B, C, D, G, H (full), I, J**.

---

## 2. What you already have (baseline)

- Endless dodger with **heat**, **bosses**, **challenges**, **perks**, **objectives**, **contracts**, **meta**, **achievements**, **modes**, **options**, **pause**, **Electron path**, **tests**.
- **Research** (`POPULAR_SIMPLE_GAMES_FORMULA.md`) and **lean** roadmap (`SKYFALL_LEAN_FEATURES.md`).
- **Gap** tasks for Steam-shaped plumbing and UX honesty (`GAP_ANALYSIS_BEYOND_TASKS.md`, AGENT-21–39).

That is already **more than a jam game**; “fully fledged” means **raising the ceiling** on **content, sensation, and commercial wrapper**.

---

## 3. Gap analysis by axis (ultra deep)

### A. Core loop depth

**Risk:** Systems exist; **pacing** (time between bosses, challenge density, perk power spikes) may be uneven without a **directed tuning pass**.

**Missing from 01–39:** No task owns **spawn director + mode config + perk power** review as one **balance surface**.

**New:** **AGENT-41** (global balance & pacing).

---

### B. Content volume

**Risk:** “Enough” is subjective; without **targets**, scope creeps or ships thin.

**Missing:** Explicit **minimum viable content matrix** (e.g. N hazard families represented per phase, boss pattern count, perk count, challenge type rotation).

**New:** **AGENT-40** (content breadth targets + backlog of adds).

---

### C. Balance & difficulty

**Risk:** `lastCompletedLevel` and contracts scale difficulty, but **player-facing difficulty** (Easy/Normal/Hard) may be missing; **Boss Rush / Draft** may be undertuned relative to Classic.

**Missing:** Difficulty **presets** or **numeric multipliers**; **playtest notes** captured.

**Fold into 41** or **AGENT-52** if only presets—keep **41** as the main tuning owner.

---

### D. Sensory production (audio / visual)

**Risk:** Procedural/geometric art can feel **cohesive** or **generic**; **Arial** + default-ish SFX read as **prototype** unless deliberately styled.

**Partial coverage:** **AGENT-31** (font optional, safe mode).

**Missing:** **Dedicated music/SFX pass**, **mixing** against `musicVolume`/`sfxVolume`, **HUD/audio ducking**, **visual consistency** (tokens, contrast, boss read telegraphs).

**New:** **AGENT-42** (audio), **AGENT-43** (visual & readability).

---

### E. Onboarding & clarity

**Largely covered:** 16–19, 33, 10, lean tasks.

**Remaining gap:** **In-run** tooltips for **first** boss / **first** contract claim—could be a small follow-up under **33** or **40**; optional micro-task.

**Not adding a separate agent**—note under **40/33** coordination.

---

### F. Platform & trust

**Largely covered:** 21–30, 23–25, 37.

---

### G. Discovery & conversion (Steam / web)

**Risk:** Great game + **invisible** store page = poor conversion.

**Missing:** **Capsule**, **5+ screenshots**, **short/long copy**, **tags**, **trailer** (even 30s gameplay), **press kit** (logo, icon, fact sheet).

**New:** **AGENT-44** (store + press checklist), **AGENT-45** (trailer / capture workflow).

---

### H. Accessibility & input (full)

**Partial:** 27 keyboard, 31 a11y.

**Missing:** **Gamepad** navigation of menus + in-game; **glyph hints**; **Steam Input** descriptor optional; **i18n** string extraction.

**New:** **AGENT-46** (gamepad), **AGENT-47** (localization foundation).

---

### I. Performance & hardware floor

**Risk:** Particle + juice + hordes **drop frames** on Intel iGPU or old laptops; **no** documented min spec.

**Missing:** **Profiling** pass, **budget** (max active hazards), **degrade path** (reduce juice).

**New:** **AGENT-48** (performance & min spec).

---

### J. Engineering operations

**Risk:** Manual releases; **no** CI gate; **unsigned** Windows binaries worry some users.

**Missing:** **GitHub Actions** (or equivalent): `test`, `test:e2e`, `build`; **release checklist**; **versioning**; **code signing** notes for Windows.

**New:** **AGENT-49** (CI/CD + release engineering).

---

### K. Quality through humans

**Risk:** Only dev play; **blind spots** on difficulty and comprehension.

**Missing:** **Playtest** builds, **feedback** channel, **prioritization** rubric.

**New:** **AGENT-50** (playtest program).

---

### L. Competitive integrity (optional for score games)

**Risk:** **localStorage** saves and client-side leaderboards are **trivially editable**; Steam boards help only if **server-authoritative** or accepted as “for fun.”

**Missing:** **Threat model** doc; optional **server** or **accept casual integrity.**

**New:** **AGENT-51** (integrity & abuse — document + light mitigations).

---

### M. Steam / platform compliance (light)

**Risk:** **Achievement count mismatch** vs Steam partner; **depot** misconfig; **rating** questionnaire.

**New:** **AGENT-52** (Steam partner checklist + achievement parity), **AGENT-53** (content rating / regional notes — doc + checklist).

---

### N. Narrative flavor (optional)

**Risk:** Pure arcade can still use **one paragraph** of world + **character names** for perks—cheap retention.

**Optional new:** **AGENT-54** (light lore / flavor copy)—skip if you want pure abstract.

---

## 4. Wave recommendation

| Wave | Agents | Focus |
|------|--------|--------|
| **1** | 01–20 | Lean gameplay + hygiene (your original plan). |
| **2** | 21–39 | Honest shipping + Steam plumbing. |
| **3** | **40–48** | **Feel**: content targets, balance, audio, visual, store/trailer, gamepad, locale, perf. |
| **4** | **49–53** | **Ship**: CI/release, playtest, integrity doc, Steam compliance, ratings. |
| **5** | **54** | **Flavor** (optional). |

---

## 5. Task file mapping (AGENT-40+)

| ID | File | Primary axes |
|----|------|----------------|
| 40 | `AGENT-40-content-breadth-matrix.md` | B |
| 41 | `AGENT-41-balance-pacing-pass.md` | A, C |
| 42 | `AGENT-42-audio-production-pass.md` | D |
| 43 | `AGENT-43-visual-readability-pass.md` | D |
| 44 | `AGENT-44-steam-store-press-kit.md` | G |
| 45 | `AGENT-45-trailer-capture-workflow.md` | G |
| 46 | `AGENT-46-gamepad-steam-input.md` | H |
| 47 | `AGENT-47-localization-i18n-foundation.md` | H |
| 48 | `AGENT-48-performance-min-spec.md` | I |
| 49 | `AGENT-49-ci-cd-release-engineering.md` | J |
| 50 | `AGENT-50-playtest-feedback-program.md` | K |
| 51 | `AGENT-51-integrity-save-leaderboards.md` | L |
| 52 | `AGENT-52-steam-partner-achievement-parity.md` | M |
| 53 | `AGENT-53-ratings-regional-compliance.md` | M |
| 54 | `AGENT-54-lore-flavor-pass.md` | N |

---

## 6. Still not “tasks” (external or continuous)

- **Marketing spend**, **influencer outreach**, **community Discord moderation** — process, not repo tasks.
- **Ongoing live ops** (battle pass, seasons) — explicitly deferred in Tier C / `DEFERRED_FEATURES.md`.
- **Legal review by counsel** — tasks point to checklists, not substitute for lawyers.

---

## Related docs

- [`tasks/README.md`](../tasks/README.md) — full agent index after update  
- [`docs/GAP_ANALYSIS_BEYOND_TASKS.md`](./GAP_ANALYSIS_BEYOND_TASKS.md) — engineering gaps (21–39)  
- [`docs/SKYFALL_LEAN_FEATURES.md`](./SKYFALL_LEAN_FEATURES.md) — lean scope (01–20)

---

*Treat this file as the “why” for wave 3+; keep it updated when you close axes.*

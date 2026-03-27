# Saves & leaderboards — integrity stance

This document is the **threat model and product stance** for progression data stored on the client and for any score surfaces (local UI, Steam leaderboards). It exists so **store copy, in-game text, and engineering reality** stay aligned—see also **[`tasks/AGENT-30-offline-adapter-honesty-ui.md`](../tasks/AGENT-30-offline-adapter-honesty-ui.md)** for **when scores are not on Steam** (local adapter), and the same **honesty principle** here: **do not imply stronger guarantees than the build provides**.

---

## 1. Threat model: localStorage (and similar client storage)

**What honest attackers can do (no “hacking” mystique—this is normal):**

- **Read** save blobs (DevTools, scripts, another build).
- **Edit** or **replace** JSON/strings arbitrarily (unlocks, currency, stats, “high score” fields if stored locally).
- **Copy** saves between machines or profiles.
- **Delete** or **wipe** storage (privacy tools, reinstall, browser/Electron profile reset).

**What we do *not* get from the client alone:**

- Proof that a score or unlock **actually occurred** in unmodified gameplay.
- Protection against a determined player with file access—**obfuscation is not cryptography**.

This is **expected** for browser-style persistence and typical indie Electron/local-first games without a trusted server.

---

## 2. Steam leaderboards — what they assume

Steam’s leaderboard APIs are a **transport and display** layer: the game (or your backend, if you add one) **submits** scores. Valve does not magically prove a score was earned fairly on **client-only** submission paths.

**Implications:**

- If scores are computed and uploaded **only on the client**, a modified client or injected calls can submit **arbitrary** entries unless you add **server-side validation** (out of scope for the current casual stance below).
- **Leaderboards are still valuable** for many arcade titles as **social / motivational**—but marketing and UI must not describe them as **cryptographically verified** or **cheat-proof** unless you ship the matching backend and anti-abuse story.

Align leaderboard wording with **AGENT-30**: when the active adapter is **local**, do not describe rankings as **global Steam** competition; when **Steam** is connected, you may describe **Steam leaderboards** accurately—without overstating **integrity**.

---

## 3. UI and marketing: no false “verified” claims

**Do not use** (unless you implement the matching system and legal/comms review):

- “Verified scores,” “anti-cheat protected,” “server-validated,” “tamper-proof saves,” “cryptographically signed progression,” “guaranteed fair leaderboard.”

**Safe patterns** (examples—adapt to voice):

- **Saves:** “Progress is stored on this device,” “Local save—back up if you care,” optional “May be edited on PC; not validated online.”
- **Leaderboards (casual stance):** “Leaderboards are for fun,” “Scores are client-submitted,” “Not ranked for esports integrity.”

If you add **light** client mitigations (checksums, obfuscation), copy should still **not** imply **strong** security—only that casual accidental corruption may be **detected** or **discouraged**.

---

## 4. Chosen product stance (team agreement)

**Stance: Casual**

- **Saves:** Accept that **local** progression can be **tampered with**; prioritize **robustness** (don’t corrupt on parse errors) and **clear player expectations** over pretending saves are sealed.
- **Leaderboards:** Treat boards as **for fun / social**, not as a **certified competitive** surface.
- **Serious / server-authoritative scores:** **Out of scope** until the product funds backend design, abuse handling, and ongoing ops—documented here as a **possible future** if competitive integrity becomes a goal.

This matches [`docs/FULLY_FLEDGED_EXPERIENCE.md`](./FULLY_FLEDGED_EXPERIENCE.md) axis **L** (“accept casual integrity”) and pairs with **AGENT-30**’s rule: **no false global / Steam claims** for the **local** adapter.

---

## 5. Mitigations under the casual stance

| Area | Mitigation | What it does *not* do |
|------|------------|------------------------|
| **Saves** | Schema versioning, safe parse/defaults, optional backup/export if you add UX | Prevent intentional edits |
| **Saves** | Optional **Light** later: checksum or obfuscation **only if** copy still says “not secure against determined modification” | Stop dedicated tampering |
| **Leaderboards** | Honest copy; optional cap/rate-limit in code (minor friction only) | Stop fake submissions without a server |
| **Steam** | Submit only when adapter is Steam; surface connection state (**AGENT-30**) | Prove fairness |
| **Process** | Store page + in-game text reviewed against this doc before ship | — |

---

## 6. Alternatives (not current product promises)

- **Light:** Raise the bar for **casual** tampering and **accidental** corruption (checksum, obfuscation). Still **no** “verified” language.
- **Serious (future):** Server-authoritative score pipeline, replay validation, or trusted hardware paths—**explicitly deferred** until scoped and funded.

---

## 7. Copy checklist (store + in-game)

Use this when writing Steam **About**, **FAQ**, patch notes, and HUD/menu strings:

1. **Local adapter (AGENT-30):** State **online/off** and that **scores are local** when applicable—no **“global leaderboard”** wording.
2. **Steam connected:** You may say **Steam leaderboards** exist; do **not** claim **verified** or **cheat-proof** unless implementation matches §3.
3. **Saves:** Say **where** data lives (this device) and that **editing** is possible on PC if you want maximum clarity.
4. **Casual stance:** Boards/saves framed as **convenience and fun**, not **regulated esports integrity**.

---

## Related

- [`tasks/AGENT-51-integrity-save-leaderboards.md`](../tasks/AGENT-51-integrity-save-leaderboards.md) — task that introduced this doc  
- [`tasks/AGENT-30-offline-adapter-honesty-ui.md`](../tasks/AGENT-30-offline-adapter-honesty-ui.md) — offline/local **honesty** for adapter and leaderboard claims  
- [`docs/FULLY_FLEDGED_EXPERIENCE.md`](./FULLY_FLEDGED_EXPERIENCE.md) §**L** — competitive integrity gap context  

---

*Production anti-cheat is explicitly out of scope for this document; scope is clarity, stance, and copy/engineering alignment.*

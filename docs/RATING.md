# Content ratings & regional compliance

**Source:** [`docs/FULLY_FLEDGED_EXPERIENCE.md`](FULLY_FLEDGED_EXPERIENCE.md) axis **M** (legal awareness). **Task:** [`tasks/AGENT-53-ratings-regional-compliance.md`](../tasks/AGENT-53-ratings-regional-compliance.md).

---

## Disclaimer

This document is **not legal advice** and is **not a substitute for qualified counsel** in your jurisdiction. It supports internal planning and Steam/IARC questionnaire honesty only. Retaining a lawyer, COPPA analysis for children’s products, and jurisdiction-specific obligations remain **out of scope** for this repo doc unless you explicitly engage professionals.

---

## IARC / Steam content survey — checklist

Complete the **Steam** (IARC-backed) **content survey** for this title **honestly** before or as part of store setup. Use the live questionnaire in Steamworks; this list is a reminder, not a substitute for the official flow.

- [ ] **Violence** — Describe intensity, blood/gore, player vs. environment, fantasy vs. realistic tone.
- [ ] **Language** — Profanity, hate/harassment themes if present.
- [ ] **Sexual content** — None / mild / explicit per actual build and marketing.
- [ ] **Controlled substances** — Alcohol, tobacco, drugs if depicted.
- [ ] **Gambling / loot** — Real-money gambling, simulated gambling, paid random items.
- [ ] **User-generated content** — If players can share or create content, disclose moderation and risk.
- [ ] **Online interactions** — If multiplayer or shared features exist, note unpredictability of other players.
- [ ] **Mature themes** — Horror, suicide, crime, etc., only if applicable.
- [ ] **Review final assigned descriptors** — Confirm they match the shipped game and store page.

After submission, record the **official outcome** in the section below (descriptor string, date, role).

---

## Rating outcome (record after Steam/IARC)

| Field | Value |
|--------|--------|
| **Rating / descriptors** | *(placeholder — paste Steam-assigned IARC descriptors when available)* |
| **Date recorded** | *(YYYY-MM-DD)* |
| **Who completed survey** | *(name or role, e.g. “Publisher — Compliance”)* |

---

## Regions & currency

- **Geoblocking / sales:** Note here if you **block** sales or distribution in specific countries or regions (and why at a high level, e.g. policy choice vs. legal requirement — still not legal advice).
  - **Current stance:** *(placeholder — e.g. “Worldwide on Steam” or list exceptions.)*
- **Currency display:** If the product later shows **prices** or **IAP** in multiple currencies, document how amounts are sourced (store API, fixed table, etc.) and who owns updates. Until then: *not applicable* or *N/A*.

---

## Privacy & telemetry (cross-links)

If **telemetry** or **network upload** ships, align store/disclosure work with:

- [`tasks/AGENT-29-telemetry-upload-privacy.md`](../tasks/AGENT-29-telemetry-upload-privacy.md) — upload hook, consent, Options copy.
- [`tasks/AGENT-37-about-privacy-support.md`](../tasks/AGENT-37-about-privacy-support.md) — About / privacy / support surfaces and URLs.

Keep `docs/RATING.md` focused on **age/content descriptors**; privacy policy text lives with those tasks and your eventual policy URL.

---

## Revision log

| Date | Change |
|------|--------|
| *(add rows as descriptors or regional stance changes)* | |

# AGENT-51 — Integrity: saves & leaderboards (fully fledged §L)

## Source
[`docs/FULLY_FLEDGED_EXPERIENCE.md`](../docs/FULLY_FLEDGED_EXPERIENCE.md) axis **L**.

## Objective
**Threat model** (not paranoia—clarity):

1. **Doc** `docs/INTEGRITY.md` — what attackers can do with **localStorage** saves; what **Steam** leaderboards assume; **no false “verified”** claims in UI.
2. **Mitigations (pick what matches product)**  
   - **Casual:** accept tampering; boards “for fun.”  
   - **Light:** checksum/obfuscate save (raises bar, not crypto-secure).  
   - **Serious:** server authoritative scores (**out of scope** unless product funds backend—document as future).

## Acceptance criteria
- [ ] Store page / in-game copy **aligned** with truth (**AGENT-30** offline honesty cousin).
- [ ] Team agrees **one** stance documented.

## Out of scope
Building production anti-cheat.

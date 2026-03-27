# AGENT-47 — Localization (i18n) foundation (fully fledged §H)

## Source
[`docs/FULLY_FLEDGED_EXPERIENCE.md`](../docs/FULLY_FLEDGED_EXPERIENCE.md) axis **H**.

## Objective
**Phase 1** (this task): technical foundation without translating every string day one.

1. **String extraction strategy** — e.g. `i18n/en.json` + `t('key')` helper, or lightweight `strings.js` modules per scene.
2. **Locale switch** — `settings.locale` (`en`, `…`); default `en`.
3. **Options** — language dropdown (even if only `English` until translators ship).
4. **Font** — ensure **AGENT-31** font supports **Latin** at minimum; note CJK as future.

## Acceptance criteria
- [ ] **One** non-English locale **stub** (e.g. `pseudo` or `xx`) proves pipeline, **or** second real locale if cheap (e.g. `pt-BR` community).
- [ ] No string **concatenation** that breaks grammar in other languages (use placeholders).

## Out of scope
Professional translation of full game—budget separately.

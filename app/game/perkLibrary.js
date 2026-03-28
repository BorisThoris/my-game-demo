/**
 * Single source-of-truth library for perks, debuffs, and run modifiers.
 * Dev-friendly: add/edit entries here; categories and helpers for tooling and balance.
 *
 * Modifier keys (createBaseModifiers):
 *   moveSpeedMultiplier, maxShields, challengeScoreMultiplier,
 *   invulnerabilityMs, extraScorePerPickup
 */

// ---------------------------------------------------------------------------
// Categories (for filtering, UI tabs, and balance)
// ---------------------------------------------------------------------------

export const PERK_CATEGORIES = Object.freeze({
  movement: "movement",
  defense: "defense",
  score: "score",
  utility: "utility"
});

export const DEBUFF_CATEGORIES = Object.freeze({
  movement: "movement",
  defense: "defense",
  score: "score",
  curse: "curse"
});

export const RARITY = Object.freeze({
  common: "common",
  uncommon: "uncommon",
  rare: "rare"
});

// ---------------------------------------------------------------------------
// Base modifiers schema (default run state)
// ---------------------------------------------------------------------------

export const createBaseModifiers = () => ({
  moveSpeedMultiplier: 1,
  maxShields: 3,
  challengeScoreMultiplier: 1,
  invulnerabilityMs: 1150,
  extraScorePerPickup: 0
});

// ---------------------------------------------------------------------------
// PERK LIBRARY
// Each perk: id, title, description, category, featTags (≤3 names: mobility/defense/score), rarity?, iconFrame? (0–7), apply(modifiers)
// ---------------------------------------------------------------------------

export const PERK_LIBRARY = Object.freeze([
  // ---- Movement ----
  {
    id: "kinetic-boots",
    title: "Kinetic Boots",
    description: "+12% move speed.",
    category: PERK_CATEGORIES.movement,
    featTags: ["mobility"],
    rarity: RARITY.uncommon,
    iconFrame: 0,
    apply(modifiers) {
      return {
        ...modifiers,
        moveSpeedMultiplier: modifiers.moveSpeedMultiplier * 1.12
      };
    }
  },
  {
    id: "quick-step",
    title: "Quick Step",
    description: "+8% move speed.",
    category: PERK_CATEGORIES.movement,
    featTags: ["mobility"],
    rarity: RARITY.common,
    iconFrame: 0,
    apply(modifiers) {
      return {
        ...modifiers,
        moveSpeedMultiplier: modifiers.moveSpeedMultiplier * 1.08
      };
    }
  },
  {
    id: "afterburner",
    title: "Afterburner",
    description: "+15% move speed.",
    category: PERK_CATEGORIES.movement,
    featTags: ["mobility"],
    rarity: RARITY.rare,
    iconFrame: 0,
    apply(modifiers) {
      return {
        ...modifiers,
        moveSpeedMultiplier: modifiers.moveSpeedMultiplier * 1.15
      };
    }
  },
  {
    id: "sprint-master",
    title: "Sprint Master",
    description: "+10% move speed.",
    category: PERK_CATEGORIES.movement,
    featTags: ["mobility"],
    rarity: RARITY.common,
    iconFrame: 0,
    apply(modifiers) {
      return {
        ...modifiers,
        moveSpeedMultiplier: modifiers.moveSpeedMultiplier * 1.1
      };
    }
  },
  // ---- Defense ----
  {
    id: "magnetic-core",
    title: "Magnetic Core",
    description: "+1 max shield capacity.",
    category: PERK_CATEGORIES.defense,
    featTags: ["defense"],
    rarity: RARITY.uncommon,
    iconFrame: 1,
    apply(modifiers) {
      return {
        ...modifiers,
        maxShields: modifiers.maxShields + 1
      };
    }
  },
  {
    id: "thick-skin",
    title: "Thick Skin",
    description: "+1 max shield capacity.",
    category: PERK_CATEGORIES.defense,
    featTags: ["defense"],
    rarity: RARITY.common,
    iconFrame: 1,
    apply(modifiers) {
      return {
        ...modifiers,
        maxShields: modifiers.maxShields + 1
      };
    }
  },
  {
    id: "fortress",
    title: "Fortress",
    description: "+1 max shield capacity.",
    category: PERK_CATEGORIES.defense,
    featTags: ["defense"],
    rarity: RARITY.uncommon,
    iconFrame: 7,
    apply(modifiers) {
      return {
        ...modifiers,
        maxShields: modifiers.maxShields + 1
      };
    }
  },
  {
    id: "phase-buffer",
    title: "Phase Buffer",
    description: "Longer invulnerability after shield break.",
    category: PERK_CATEGORIES.defense,
    featTags: ["defense"],
    rarity: RARITY.uncommon,
    iconFrame: 2,
    apply(modifiers) {
      return {
        ...modifiers,
        invulnerabilityMs: modifiers.invulnerabilityMs + 350
      };
    }
  },
  {
    id: "reactive-plating",
    title: "Reactive Plating",
    description: "+250ms invulnerability after shield break.",
    category: PERK_CATEGORIES.defense,
    featTags: ["defense"],
    rarity: RARITY.common,
    iconFrame: 2,
    apply(modifiers) {
      return {
        ...modifiers,
        invulnerabilityMs: modifiers.invulnerabilityMs + 250
      };
    }
  },
  // ---- Score ----
  {
    id: "overclock",
    title: "Overclock",
    description: "+20% score bonus from challenge rewards.",
    category: PERK_CATEGORIES.score,
    featTags: ["score"],
    rarity: RARITY.uncommon,
    iconFrame: 3,
    apply(modifiers) {
      return {
        ...modifiers,
        challengeScoreMultiplier: modifiers.challengeScoreMultiplier * 1.2
      };
    }
  },
  {
    id: "scavenger",
    title: "Scavenger",
    description: "+2 bonus score per pickup collected.",
    category: PERK_CATEGORIES.score,
    featTags: ["score"],
    rarity: RARITY.common,
    iconFrame: 4,
    apply(modifiers) {
      return {
        ...modifiers,
        extraScorePerPickup: (modifiers.extraScorePerPickup ?? 0) + 2
      };
    }
  },
  {
    id: "high-roller",
    title: "High Roller",
    description: "+30% challenge score bonus.",
    category: PERK_CATEGORIES.score,
    featTags: ["score"],
    rarity: RARITY.rare,
    iconFrame: 3,
    apply(modifiers) {
      return {
        ...modifiers,
        challengeScoreMultiplier: modifiers.challengeScoreMultiplier * 1.3
      };
    }
  },
  {
    id: "treasure-sense",
    title: "Treasure Sense",
    description: "+3 bonus score per pickup.",
    category: PERK_CATEGORIES.score,
    featTags: ["score"],
    rarity: RARITY.uncommon,
    iconFrame: 4,
    apply(modifiers) {
      return {
        ...modifiers,
        extraScorePerPickup: (modifiers.extraScorePerPickup ?? 0) + 3
      };
    }
  },
  // ---- Utility ----
  {
    id: "lucky-charm",
    title: "Lucky Charm",
    description: "+5% move speed, +50ms invulnerability.",
    category: PERK_CATEGORIES.utility,
    featTags: ["mobility", "defense"],
    rarity: RARITY.common,
    iconFrame: 5,
    apply(modifiers) {
      return {
        ...modifiers,
        moveSpeedMultiplier: modifiers.moveSpeedMultiplier * 1.05,
        invulnerabilityMs: modifiers.invulnerabilityMs + 50
      };
    }
  },
  {
    id: "veteran",
    title: "Veteran",
    description: "+1 shield, +10% challenge score.",
    category: PERK_CATEGORIES.utility,
    featTags: ["defense", "score"],
    rarity: RARITY.rare,
    iconFrame: 6,
    apply(modifiers) {
      return {
        ...modifiers,
        maxShields: modifiers.maxShields + 1,
        challengeScoreMultiplier: modifiers.challengeScoreMultiplier * 1.1
      };
    }
  }
]);

// ---------------------------------------------------------------------------
// DEBUFF LIBRARY
// Applied by failed challenges, hazards, or events. Same apply(modifiers) pattern.
// ---------------------------------------------------------------------------

export const DEBUFF_LIBRARY = Object.freeze([
  {
    id: "sludge",
    title: "Sludge",
    description: "-10% move speed.",
    category: DEBUFF_CATEGORIES.movement,
    apply(modifiers) {
      return {
        ...modifiers,
        moveSpeedMultiplier: modifiers.moveSpeedMultiplier * 0.9
      };
    }
  },
  {
    id: "heavy-boots",
    title: "Heavy Boots",
    description: "-15% move speed.",
    category: DEBUFF_CATEGORIES.movement,
    apply(modifiers) {
      return {
        ...modifiers,
        moveSpeedMultiplier: modifiers.moveSpeedMultiplier * 0.85
      };
    }
  },
  {
    id: "cracked-core",
    title: "Cracked Core",
    description: "-1 max shield (min 1).",
    category: DEBUFF_CATEGORIES.defense,
    apply(modifiers) {
      return {
        ...modifiers,
        maxShields: Math.max(1, modifiers.maxShields - 1)
      };
    }
  },
  {
    id: "brittle",
    title: "Brittle",
    description: "-200ms invulnerability after shield break.",
    category: DEBUFF_CATEGORIES.defense,
    apply(modifiers) {
      return {
        ...modifiers,
        invulnerabilityMs: Math.max(300, modifiers.invulnerabilityMs - 200)
      };
    }
  },
  {
    id: "penalty-phase",
    title: "Penalty Phase",
    description: "-15% challenge score bonus.",
    category: DEBUFF_CATEGORIES.score,
    apply(modifiers) {
      return {
        ...modifiers,
        challengeScoreMultiplier: modifiers.challengeScoreMultiplier * 0.85
      };
    }
  },
  {
    id: "score-drain",
    title: "Score Drain",
    description: "-1 bonus score per pickup.",
    category: DEBUFF_CATEGORIES.score,
    apply(modifiers) {
      return {
        ...modifiers,
        extraScorePerPickup: Math.max(-5, (modifiers.extraScorePerPickup ?? 0) - 1)
      };
    }
  },
  {
    id: "curse-slow",
    title: "Curse of Sloth",
    description: "-8% move speed, -100ms invulnerability.",
    category: DEBUFF_CATEGORIES.curse,
    apply(modifiers) {
      return {
        ...modifiers,
        moveSpeedMultiplier: modifiers.moveSpeedMultiplier * 0.92,
        invulnerabilityMs: Math.max(400, modifiers.invulnerabilityMs - 100)
      };
    }
  },
  {
    id: "curse-frail",
    title: "Curse of Frailty",
    description: "-1 shield, -10% challenge score.",
    category: DEBUFF_CATEGORIES.curse,
    apply(modifiers) {
      return {
        ...modifiers,
        maxShields: Math.max(1, modifiers.maxShields - 1),
        challengeScoreMultiplier: modifiers.challengeScoreMultiplier * 0.9
      };
    }
  }
]);

// ---------------------------------------------------------------------------
// Dev helpers: lookup and filtering
// ---------------------------------------------------------------------------

export const getPerkById = (id) => PERK_LIBRARY.find((p) => p.id === id) ?? null;

/** True if every taken perk is tagged only with `tag` (at least one perk, ≥2 picks for purist). */
export const runUsesSingleFeatTagOnly = (ownedPerkIds, tag) => {
  if (!Array.isArray(ownedPerkIds) || ownedPerkIds.length < 2) {
    return false;
  }
  return ownedPerkIds.every((id) => {
    const tags = getPerkFeatTags(id);
    return tags.length > 0 && tags.every((t) => t === tag);
  });
};

export const getDebuffById = (id) => DEBUFF_LIBRARY.find((d) => d.id === id) ?? null;

export const getPerksByCategory = (category) =>
  PERK_LIBRARY.filter((p) => p.category === category);

export const getDebuffsByCategory = (category) =>
  DEBUFF_LIBRARY.filter((d) => d.category === category);

export const getAllPerkIds = () => PERK_LIBRARY.map((p) => p.id);

export const getAllDebuffIds = () => DEBUFF_LIBRARY.map((d) => d.id);

/** Icon frame for UI (0–7); caps to valid frame count. */
export const getPerkIconFrame = (perkId, maxFrames = 8) => {
  const index = PERK_LIBRARY.findIndex((p) => p.id === perkId);
  if (index < 0) return 0;
  const perk = PERK_LIBRARY[index];
  const frame = perk.iconFrame ?? index;
  return Math.min(Math.max(0, frame), maxFrames - 1);
};

const DEFAULT_FEAT_TAGS = {
  [PERK_CATEGORIES.movement]: ["mobility"],
  [PERK_CATEGORIES.defense]: ["defense"],
  [PERK_CATEGORIES.score]: ["score"]
};

/** ≤3 tag names (mobility / defense / score) for feat achievements (AGENT-09). */
export function getPerkFeatTags(perkId) {
  const p = getPerkById(perkId);
  if (!p) {
    return [];
  }
  if (Array.isArray(p.featTags) && p.featTags.length) {
    return [...p.featTags];
  }
  if (p.category === PERK_CATEGORIES.utility) {
    if (p.id === "lucky-charm") {
      return ["mobility", "defense"];
    }
    if (p.id === "veteran") {
      return ["defense", "score"];
    }
    return ["mobility", "score"];
  }
  return DEFAULT_FEAT_TAGS[p.category] ? [...DEFAULT_FEAT_TAGS[p.category]] : ["score"];
}

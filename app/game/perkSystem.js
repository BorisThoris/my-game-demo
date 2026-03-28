/**
 * Perk runtime: choice building and application.
 * All perk/debuff definitions live in perkLibrary.js.
 */

import {
  PERK_LIBRARY,
  createBaseModifiers as createBaseFromLibrary,
  getPerkIconFrame,
  getDebuffById
} from "./perkLibrary.js";

export { PERK_LIBRARY, getPerkIconFrame };
export {
  PERK_CATEGORIES,
  DEBUFF_CATEGORIES,
  RARITY,
  DEBUFF_LIBRARY,
  getPerkById,
  getDebuffById,
  getPerksByCategory,
  getDebuffsByCategory,
  getAllPerkIds,
  getAllDebuffIds,
  getPerkFeatTags
} from "./perkLibrary.js";

export const createBaseModifiers = createBaseFromLibrary;

export const buildPerkChoices = (ownedPerks, rng = Math.random, count = 3) => {
  const available = PERK_LIBRARY.filter((perk) => !ownedPerks.includes(perk.id));
  const pool = [...available];
  const choices = [];

  while (choices.length < count && pool.length > 0) {
    const index = Math.floor(rng() * pool.length);
    choices.push(pool[index]);
    pool.splice(index, 1);
  }

  return choices;
};

export const applyPerk = (modifiers, perkId) => {
  const perk = PERK_LIBRARY.find((entry) => entry.id === perkId);
  return perk ? perk.apply(modifiers) : modifiers;
};

/** Apply a debuff by id (e.g. from failed challenge or hazard). */
export const applyDebuff = (modifiers, debuffId) => {
  const debuff = getDebuffById(debuffId);
  return debuff ? debuff.apply(modifiers) : modifiers;
};

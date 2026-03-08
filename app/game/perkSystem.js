export const PERK_LIBRARY = [
  {
    id: "kinetic-boots",
    title: "Kinetic Boots",
    description: "+12% move speed.",
    apply(modifiers) {
      return {
        ...modifiers,
        moveSpeedMultiplier: modifiers.moveSpeedMultiplier * 1.12
      };
    }
  },
  {
    id: "magnetic-core",
    title: "Magnetic Core",
    description: "+1 max shield capacity.",
    apply(modifiers) {
      return {
        ...modifiers,
        maxShields: modifiers.maxShields + 1
      };
    }
  },
  {
    id: "overclock",
    title: "Overclock",
    description: "+20% score bonus from challenge rewards.",
    apply(modifiers) {
      return {
        ...modifiers,
        challengeScoreMultiplier: modifiers.challengeScoreMultiplier * 1.2
      };
    }
  },
  {
    id: "phase-buffer",
    title: "Phase Buffer",
    description: "Longer invulnerability after shield break.",
    apply(modifiers) {
      return {
        ...modifiers,
        invulnerabilityMs: modifiers.invulnerabilityMs + 350
      };
    }
  }
];

export const createBaseModifiers = () => ({
  moveSpeedMultiplier: 1,
  maxShields: 3,
  challengeScoreMultiplier: 1,
  invulnerabilityMs: 1150
});

export const buildPerkChoices = (ownedPerks, rng = Math.random, count = 3) => {
  const available = PERK_LIBRARY.filter(perk => !ownedPerks.includes(perk.id));
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
  const perk = PERK_LIBRARY.find(entry => entry.id === perkId);
  return perk ? perk.apply(modifiers) : modifiers;
};

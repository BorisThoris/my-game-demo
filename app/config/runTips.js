/**
 * One short game-over tip from simple run flags (AGENT-10).
 */

export function getPostRunTip({
  survivalTimeSec = 0,
  challengesCompleted = 0,
  bossClears = 0,
  score = 0,
  lastDeathSource = "",
  deathSource = ""
} = {}) {
  const src = String(lastDeathSource || deathSource || "").toLowerCase();
  if (survivalTimeSec < 20) {
    return "Tip: keep moving diagonally—open space beats standing still.";
  }
  if (src.includes("boss") || src.includes("projectile")) {
    return "Tip: watch boss telegraphs and save a shield for burst patterns.";
  }
  if (challengesCompleted === 0 && survivalTimeSec > 45) {
    return "Tip: challenges are optional pressure—answer 1 / 2 / 3 when you feel ready.";
  }
  if (bossClears === 0 && score > 80) {
    return "Tip: boss waves follow score pressure—stay near center until you learn the pattern.";
  }
  return "Tip: when the bar fills, heat rises—use recovery windows to grab shields.";
}

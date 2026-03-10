const DEFAULT_PHASE_SHIFT_RATIO = 0.5;

export function getBossPhaseShiftMs(config) {
  const ratio = config?.phaseShiftAtRatio ?? DEFAULT_PHASE_SHIFT_RATIO;
  return Math.max(0, (config?.durationMs ?? 0) * ratio);
}

export function shouldEnterPhaseTwo(config, lifeMs, hasShifted) {
  if (hasShifted) return false;
  return lifeMs >= getBossPhaseShiftMs(config);
}

export function getBossAttackProfile(config, phase = 1) {
  const baseCadence = Math.max(180, config?.attackCadenceMs ?? 900);
  const baseCount = Math.max(1, config?.projectileCount ?? 4);
  const baseSpread = Math.max(30, config?.projectileSpread ?? 120);
  const signatures = Array.isArray(config?.attackSignatures)
    ? config.attackSignatures
    : ["fan"];

  if (phase <= 1) {
    return {
      phase: 1,
      cadenceMs: baseCadence,
      projectileCount: baseCount,
      projectileSpread: baseSpread,
      signature: signatures[0] ?? "fan",
      telegraphMs: config?.telegraphMs?.[signatures[0]] ?? 380
    };
  }

  const phaseTwoSignature = signatures[1] ?? signatures[0] ?? "fan";
  const cadenceFactor = config?.phaseShiftCadenceFactor ?? 0.72;
  return {
    phase: 2,
    cadenceMs: Math.max(140, baseCadence * cadenceFactor),
    projectileCount: baseCount + (config?.phaseShiftProjectileBonus ?? 1),
    projectileSpread: baseSpread * (config?.phaseShiftSpreadFactor ?? 1.2),
    signature: phaseTwoSignature,
    telegraphMs: config?.telegraphMs?.[phaseTwoSignature] ?? 440
  };
}

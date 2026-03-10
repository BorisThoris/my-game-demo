const TELEMETRY_STORAGE_KEY = "skyfall.telemetry.v1";
const TELEMETRY_MAX_BATCH_SIZE = 250;

const listeners = new Set();
let uploadHook = null;

const safeJsonParse = value => {
  try {
    return JSON.parse(value);
  } catch (_) {
    return null;
  }
};

const getStorage = () => {
  if (typeof localStorage === "undefined") {
    return null;
  }
  return localStorage;
};

const readBatch = () => {
  const storage = getStorage();
  if (!storage) {
    return [];
  }

  const raw = storage.getItem(TELEMETRY_STORAGE_KEY);
  const parsed = safeJsonParse(raw);
  return Array.isArray(parsed) ? parsed : [];
};

const writeBatch = events => {
  const storage = getStorage();
  if (!storage) {
    return;
  }
  storage.setItem(TELEMETRY_STORAGE_KEY, JSON.stringify(events));
};

const persistTelemetryEvent = event => {
  const existing = readBatch();
  existing.push(event);
  const next = existing.slice(-TELEMETRY_MAX_BATCH_SIZE);
  writeBatch(next);
};

export const createRunId = () => `run-${Date.now()}-${Math.floor(Math.random() * 1e6)}`;

export const onTelemetryEvent = handler => {
  listeners.add(handler);
  return () => listeners.delete(handler);
};

export const emitTelemetryEvent = (eventName, payload = {}) => {
  const event = {
    eventName,
    timestamp: Date.now(),
    ...payload
  };

  persistTelemetryEvent(event);
  listeners.forEach(listener => listener(event));
  return event;
};

export const emitRunStart = payload => emitTelemetryEvent("run_start", payload);
export const emitRunEnd = payload => emitTelemetryEvent("run_end", payload);
export const emitDeathSource = payload => emitTelemetryEvent("death_source", payload);
export const emitPickupUsage = payload => emitTelemetryEvent("pickup_usage", payload);
export const emitBossOutcome = payload => emitTelemetryEvent("boss_outcome", payload);
export const emitChallengePerformance = payload =>
  emitTelemetryEvent("challenge_performance", payload);

export const getTelemetryBatch = () => readBatch();

export const clearTelemetryBatch = () => {
  writeBatch([]);
};

export const setTelemetryUploadHook = hook => {
  uploadHook = hook;
};

export const flushTelemetryBatch = async (hook = uploadHook) => {
  const events = readBatch();
  if (events.length === 0 || typeof hook !== "function") {
    return { uploaded: 0, skipped: true };
  }

  await hook(events);
  clearTelemetryBatch();
  return { uploaded: events.length, skipped: false };
};

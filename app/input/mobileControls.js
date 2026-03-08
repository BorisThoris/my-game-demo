/**
 * Virtual key state for mobile overlay. Updated by touch events so game code
 * can read them like keyboard cursors (e.g. virtualKeys.left === true when
 * the left touch zone is pressed).
 */
export const virtualKeys = {
  left: false,
  right: false,
  up: false,
  down: false
};

export function isMobile() {
  if (typeof navigator === "undefined") return false;
  return (
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
    (navigator.maxTouchPoints != null && navigator.maxTouchPoints > 0)
  );
}

const OVERLAY_ID = "mobile-controls-overlay";

function setKey(key, value) {
  if (virtualKeys[key] !== value) {
    virtualKeys[key] = value;
  }
}

function addListeners(btn, key) {
  const on = () => setKey(key, true);
  const off = () => setKey(key, false);

  btn.addEventListener("touchstart", on, { passive: true });
  btn.addEventListener("touchend", off, { passive: true });
  btn.addEventListener("touchcancel", off, { passive: true });
  btn.addEventListener("mousedown", on);
  btn.addEventListener("mouseup", off);
  btn.addEventListener("mouseleave", off);
}

export function initMobileControls() {
  if (!isMobile()) return;

  const container = document.getElementById(OVERLAY_ID);
  if (!container) return;

  const left = document.getElementById("mobile-btn-left");
  const right = document.getElementById("mobile-btn-right");
  const up = document.getElementById("mobile-btn-up");
  const down = document.getElementById("mobile-btn-down");

  if (left) addListeners(left, "left");
  if (right) addListeners(right, "right");
  if (up) addListeners(up, "up");
  if (down) addListeners(down, "down");

  container.classList.add("mobile-controls-visible");
}

import "./style.css";
import "./app/index.js";

function syncViewportHeight() {
  if (typeof window === "undefined" || typeof document === "undefined") return;
  document.documentElement.style.setProperty("--app-height", `${window.innerHeight}px`);
}

syncViewportHeight();
window.addEventListener("resize", syncViewportHeight);
window.addEventListener("orientationchange", syncViewportHeight);

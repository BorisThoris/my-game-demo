export function openExternalLink(url) {
  if (typeof window === "undefined" || typeof window.open !== "function") {
    return null;
  }

  return window.open(url, "_blank", "noopener,noreferrer");
}

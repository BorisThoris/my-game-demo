/**
 * Design tokens – single source of truth for colors, spacing, typography, z-index, and component layout.
 * Use theme.* in config and scenes. Colors come from the active theme (Settings → Theme).
 *
 * @example
 *   import { theme } from '../config/styleTokens';
 *   text.setStyle({ fill: theme.colors.semantic.text.score });
 */
import domain from "./domain/index.js";
import components from "./components/index.js";
import { getThemeId, getThemeColors } from "./themes.js";

/** Returns the full theme object for the currently selected theme (from settings). */
export function getTheme() {
  const colors = getThemeColors(getThemeId());
  return {
    ...domain,
    colors,
    components
  };
}

/** Live theme: every property access resolves to the current theme (so changing theme in settings takes effect). */
const theme = new Proxy(
  {},
  {
    get(_, prop) {
      return getTheme()[prop];
    }
  }
);

export default theme;
export { theme };

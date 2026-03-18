import { getTheme } from "./styleTokens/index.js";

function buildSceneStyles(theme) {
  const c = theme.colors;
  return {
    TITLE_STYLE: { font: "700 72px Arial", fill: c.semantic.text.score, align: "center" },
    BODY_STYLE: { font: "700 34px Arial", fill: c.base.white, align: "center" },
    HINT_STYLE: { font: "700 28px Arial", fill: c.semantic.text.accent, align: "center" },
    PANEL_TITLE_STYLE: { font: "700 40px Arial", fill: c.base.white, align: "center" },
    INFO_HEADING_STYLE: { font: "700 40px Arial", fill: c.base.white, align: "left" },
    INFO_BODY_STYLE: { font: "700 36px Arial", fill: c.base.white, align: "left" }
  };
}

export const TITLE_STYLE = new Proxy({}, { get(_, p) { return buildSceneStyles(getTheme()).TITLE_STYLE[p]; } });
export const BODY_STYLE = new Proxy({}, { get(_, p) { return buildSceneStyles(getTheme()).BODY_STYLE[p]; } });
export const HINT_STYLE = new Proxy({}, { get(_, p) { return buildSceneStyles(getTheme()).HINT_STYLE[p]; } });
export const PANEL_TITLE_STYLE = new Proxy({}, { get(_, p) { return buildSceneStyles(getTheme()).PANEL_TITLE_STYLE[p]; } });
export const INFO_HEADING_STYLE = new Proxy({}, { get(_, p) { return buildSceneStyles(getTheme()).INFO_HEADING_STYLE[p]; } });
export const INFO_BODY_STYLE = new Proxy({}, { get(_, p) { return buildSceneStyles(getTheme()).INFO_BODY_STYLE[p]; } });

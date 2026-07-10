// src/theme/themes/index.js
import { midnightInk } from "./midnightInk";
import { sageGarden } from "./sageGarden";
import { skyBreeze } from "./skyBreeze";
import { sakuraMist } from "./sakuraMist";

// 1. Export individual themes just in case
export { midnightInk, sageGarden, skyBreeze, sakuraMist };

// 2. Define your default theme ID string matching what ThemeProvider expects
export const DEFAULT_THEME = "midnight-ink";

// 3. Construct the key-value lookup object your ThemeProvider uses: THEMES[themeId]
export const THEMES = {
  "midnight-ink": midnightInk,
  "sage-garden": sageGarden,
  "sky-breeze": skyBreeze,
  "sakura-mist": sakuraMist,
};

// 4. Keep an array version handy if your settings page maps through them
export const ALL_THEMES = Object.values(THEMES);

import { Theme, getThemeColors } from "@code-hike/lighter";

export const THEME: Theme = "github-dark";

export type ThemeColors = Awaited<ReturnType<typeof getThemeColors>>;

import type { ComponentType } from "react";
import type { MessDetails } from "../../../../../types/mess";
import ClassicTheme from "./classic/ClassicTheme";
import ModernTheme from "./modern/ModernTheme";
import type { ThemeId } from "./registry";
import StandardTheme from "./standard/StandardTheme";
import WarmTheme from "./warm/WarmTheme";

export type ThemeComponent = ComponentType<{ mess: MessDetails }>;

export const THEME_COMPONENTS: Record<ThemeId, ThemeComponent> = {
  standard: StandardTheme,
  modern: ModernTheme,
  classic: ClassicTheme,
  warm: WarmTheme,
};

export * from "./registry";

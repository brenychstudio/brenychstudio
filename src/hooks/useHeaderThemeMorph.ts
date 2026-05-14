import { useEffect, type RefObject } from "react";

import type { HeaderTheme } from "../ui/header/headerThemeTokens";

export function useHeaderThemeMorph(
  headerRef: RefObject<HTMLElement | null>,
  theme: HeaderTheme,
  scrolled: boolean,
) {
  useEffect(() => {
    const element = headerRef.current;
    if (!element) return;

    element.style.setProperty("--header-bg", theme.surface);
    element.style.setProperty("--header-text", theme.foreground);
    element.style.setProperty("--header-muted", theme.muted);
    element.style.setProperty("--header-border", theme.border);
    element.style.setProperty("--header-chip-bg", theme.chipSurface);
    element.style.setProperty("--header-progress", theme.progress);
    element.style.setProperty("--header-action-bg", theme.actionSurface);
    element.style.setProperty("--header-action-text", theme.actionForeground);
    element.style.setProperty("--header-action-border", theme.actionBorder);
    element.style.setProperty("--header-active-chip-bg", theme.activeChipSurface);
    element.style.setProperty("--header-active-chip-text", theme.activeChipForeground);
    element.style.setProperty("--header-blur", `${scrolled ? theme.blur + 2 : theme.blur}px`);
    element.style.setProperty("--header-elevation", String(scrolled ? theme.elevation : theme.elevation * 0.35));
  }, [headerRef, scrolled, theme]);
}

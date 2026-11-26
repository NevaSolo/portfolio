"use client";

import { useSyncExternalStore } from "react";
import { THEME_STORAGE_KEY as STORAGE_KEY } from "./themeScript";

export type Theme = "dark" | "light";

const listeners = new Set<() => void>();

export function getTheme(): Theme {
  return document.documentElement.dataset.theme === "light" ? "light" : "dark";
}

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  root.dataset.theme = theme;
  root.style.colorScheme = theme;
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    // Private mode / blocked storage: the theme just won't persist.
  }
  listeners.forEach((l) => l());
}

/**
 * Switches theme. With an `origin` (viewport px), the new theme is revealed
 * as a circle growing from that point, where View Transitions are supported.
 */
export function toggleTheme(origin?: { x: number; y: number }) {
  const next: Theme = getTheme() === "dark" ? "light" : "dark";
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!origin || reduced || !("startViewTransition" in document)) {
    applyTheme(next);
    return;
  }

  const { x, y } = origin;
  const radius = Math.hypot(
    Math.max(x, window.innerWidth - x),
    Math.max(y, window.innerHeight - y)
  );
  const transition = document.startViewTransition(() => applyTheme(next));
  transition.ready.then(() => {
    document.documentElement.animate(
      { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
      {
        duration: 900,
        easing: "cubic-bezier(0.165, 0.84, 0.44, 1)",
        pseudoElement: "::view-transition-new(root)",
      }
    );
  });
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

export function useTheme(): Theme {
  return useSyncExternalStore(subscribe, getTheme, () => "dark");
}

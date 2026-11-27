"use client";

import { useSyncExternalStore } from "react";

// Set once the visitor clicks "Start" on the loading screen. Intro animations
// (hero title, buttons…) wait for it so they play after the loader, not behind it.
let entered = false;
const listeners = new Set<() => void>();

export function markSiteEntered() {
  if (entered) return;
  entered = true;
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useSiteEntered() {
  return useSyncExternalStore(
    subscribe,
    () => entered,
    () => false,
  );
}

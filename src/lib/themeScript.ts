export const THEME_STORAGE_KEY = "theme";

/**
 * Inlined in <head> (layout.tsx) and run before first paint, so a saved
 * light theme doesn't flash dark on load. Kept out of theme.ts because a
 * server component can't read plain values from a "use client" module.
 */
export const THEME_INIT_SCRIPT = `try{if(localStorage.getItem("${THEME_STORAGE_KEY}")==="light"){document.documentElement.dataset.theme="light";document.documentElement.style.colorScheme="light"}}catch(e){}`;

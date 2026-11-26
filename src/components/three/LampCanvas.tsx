"use client";

import dynamic from "next/dynamic";
import { toggleTheme, useTheme } from "@/lib/theme";

const Lamp = dynamic(() => import("./Lamp"), { ssr: false });

/** Decorative lamp behind the hero's left side; clicking it toggles the theme. */
export default function LampCanvas() {
  const lit = useTheme() === "light";

  return (
    <div className="absolute inset-y-0 left-0 hidden w-[60vw] max-w-[1100px] md:block">
      <Lamp />

      {/* Keyboard access: the 3D lamp itself only reacts to the mouse. */}
      <button
        type="button"
        onClick={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          toggleTheme({ x: r.left + r.width / 2, y: r.top + r.height / 2 });
        }}
        className="sr-only focus:not-sr-only focus:absolute focus:left-6 focus:top-28 focus:z-20 focus:rounded-full focus:bg-fg focus:px-4 focus:py-2 focus:text-xs focus:uppercase focus:tracking-widest focus:text-bg"
      >
        {lit ? "Activer le mode sombre" : "Activer le mode clair"}
      </button>

      <p
        aria-hidden
        className="pointer-events-none absolute bottom-10 left-10 text-[10px] uppercase tracking-[0.3em] text-fg-mute"
      >
        {lit ? "Éteins la lampe" : "Allume la lampe"}
      </p>
    </div>
  );
}

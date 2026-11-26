"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type Props = {
  /** Visible text. */
  children: ReactNode;
  /** Text revealed inside the disc that follows the cursor. */
  hidden: ReactNode;
  /** Disc radius in px. */
  radius?: number;
  /** Wrapper classes (spacing, width). */
  className?: string;
  /** Typography classes, applied to both layers so they line up. */
  textClassName?: string;
};

/**
 * A disc follows the pointer over the text and reveals an alternate
 * version of it. Pointer-only: on touch devices only the visible text shows.
 */
export default function CursorRevealText({
  children,
  hidden,
  radius = 140,
  className,
  textClassName,
}: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const layerRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const layer = layerRef.current;
    if (!wrap || !layer) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const follow = reduced ? 1 : 0.16;
    const grow = reduced ? 1 : 0.12;

    let clientX = 0;
    let clientY = 0;
    let tx = 0, ty = 0, x = 0, y = 0;
    let r = 0, tr = 0;
    let raf = 0;
    let running = false;

    const measure = () => {
      const b = layer.getBoundingClientRect();
      tx = clientX - b.left;
      ty = clientY - b.top;
    };

    const tick = () => {
      x += (tx - x) * follow;
      y += (ty - y) * follow;
      r += (tr - r) * grow;
      layer.style.setProperty("--mx", `${x}px`);
      layer.style.setProperty("--my", `${y}px`);
      layer.style.setProperty("--r", `${Math.max(r, 0)}px`);

      const settled =
        Math.abs(tx - x) < 0.2 && Math.abs(ty - y) < 0.2 && Math.abs(tr - r) < 0.2;
      if (settled) {
        running = false;
        return;
      }
      raf = requestAnimationFrame(tick);
    };

    const start = () => {
      if (running) return;
      running = true;
      raf = requestAnimationFrame(tick);
    };

    const onMove = (e: PointerEvent) => {
      clientX = e.clientX;
      clientY = e.clientY;
      measure();
      start();
    };
    const onEnter = (e: PointerEvent) => {
      onMove(e);
      // Spawn the disc under the pointer instead of sliding in from the last spot.
      if (r < 1) {
        x = tx;
        y = ty;
      }
      tr = radius;
      start();
    };
    const onLeave = () => {
      tr = 0;
      start();
    };
    // The text moves under a still pointer while scrolling.
    const onScroll = () => {
      if (tr === 0) return;
      measure();
      start();
    };

    wrap.addEventListener("pointerenter", onEnter);
    wrap.addEventListener("pointermove", onMove);
    wrap.addEventListener("pointerleave", onLeave);
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      wrap.removeEventListener("pointerenter", onEnter);
      wrap.removeEventListener("pointermove", onMove);
      wrap.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [radius]);

  return (
    <div ref={wrapRef} data-cursor="reveal" className={cn("relative", className)}>
      <p className={textClassName}>{children}</p>
      {/* Overlay extends by `radius` on every side so the disc isn't cut at the text's edges. */}
      <p
        ref={layerRef}
        aria-hidden
        className={cn(
          textClassName,
          "pointer-events-none absolute select-none bg-accent text-bg"
        )}
        style={{
          inset: -radius,
          padding: radius,
          clipPath: "circle(var(--r, 0px) at var(--mx, 50%) var(--my, 50%))",
        }}
      >
        {hidden}
      </p>
    </div>
  );
}

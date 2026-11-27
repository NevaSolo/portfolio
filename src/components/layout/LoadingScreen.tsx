"use client";

import { useEffect, useRef, useState } from "react";
import { animate } from "framer-motion";
import { markSiteEntered } from "@/lib/siteEnter";

// Intro loader modelled on minhpham.design: a thin beige ring draws itself
// around the logo as the page loads, the percentage sits inside the ring, then
// the ring unwinds, the logo lifts and a "Start" pill appears. Clicking it
// fades the overlay out and starts the page intro.

const BG = "#0d0d0d";
const INK = "#b7ab98";
// Circumference of the r=132 ring (2π·132 ≈ 829), used as the dash length.
const DASH = 829;
// GSAP power3.inOut / power3.out as cubic-béziers.
const EASE_IN_OUT: [number, number, number, number] = [0.77, 0, 0.175, 1];
const EASE_OUT: [number, number, number, number] = [0.165, 0.84, 0.44, 1];
// The page models: the loader only reaches 100 % once they are cached.
const ASSETS = ["/models/laptop.glb", "/models/lamp.glb"];

type Phase = "loading" | "ready" | "leaving" | "gone";

export default function LoadingScreen() {
  const [phase, setPhase] = useState<Phase>("loading");
  const [percent, setPercent] = useState(0);

  const rootRef = useRef<HTMLDivElement>(null);
  const circleRef = useRef<SVGCircleElement>(null);
  const ringRef = useRef<SVGSVGElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const startRef = useRef<HTMLButtonElement>(null);

  // Lock scrolling until the visitor enters the site.
  useEffect(() => {
    if (phase === "gone") return;
    const html = document.documentElement;
    const previous = html.style.overflow;
    html.style.overflow = "hidden";
    return () => {
      html.style.overflow = previous;
    };
  }, [phase]);

  // Progress loop: same easing logic as the reference — it crawls while the
  // page is still loading (never past 98 %), then runs to 100 % once it's done.
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let loaded = false;
    let pending = ASSETS.length;
    const markPageLoaded = () => {
      loaded = true;
    };
    if (document.readyState === "complete") markPageLoaded();
    else window.addEventListener("load", markPageLoaded, { once: true });
    ASSETS.forEach((url) =>
      fetch(url)
        .then((r) => r.arrayBuffer())
        .catch(() => undefined)
        .finally(() => {
          pending -= 1;
        }),
    );

    let delta = 0;
    let stuck = 0;
    let run = 0;
    let lowNet = 0;
    let max = 98;
    let raf = 0;
    let shown = -1;

    const tick = () => {
      const done = loaded && pending === 0;
      run += delta + stuck;
      if (!done) {
        delta *= 0.5 - lowNet;
        stuck = (stuck + 0.05) * 0.8;
        if (stuck >= 2) stuck = 0;
      } else {
        delta = 5;
        stuck = 0;
      }
      lowNet += 1e-4;
      if (run > 100) max = 100;
      const p = Math.min(Math.floor(run), done ? 100 : max);

      if (p !== shown) {
        shown = p;
        setPercent(p);
        circleRef.current?.style.setProperty("stroke-dashoffset", String(DASH - (p / 100) * DASH));
      }
      if (p >= 100) {
        setPhase("ready");
        return;
      }
      raf = requestAnimationFrame(tick);
    };

    if (reduced) {
      // No crawl animation: wait for the assets, then show Start directly.
      const wait = () => {
        if (loaded && pending === 0) setPhase("ready");
        else raf = requestAnimationFrame(wait);
      };
      raf = requestAnimationFrame(wait);
    } else {
      raf = requestAnimationFrame(tick);
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("load", markPageLoaded);
    };
  }, []);

  // "ready": the ring unwinds, ring + % fade, logo lifts, Start pill rises in.
  useEffect(() => {
    if (phase !== "ready") return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const k = reduced ? 0 : 1;
    const controls = [
      animate(2 * DASH, DASH, {
        duration: 0.6 * k,
        ease: EASE_IN_OUT,
        onUpdate: (v) => circleRef.current?.style.setProperty("stroke-dashoffset", String(v)),
      }),
      animate([ringRef.current!, textRef.current!], { opacity: 0 }, { duration: 0.6 * k, delay: 0.6 * k, ease: EASE_OUT }),
      animate(logoRef.current!, { y: -40 }, { duration: 0.6 * k, delay: 0.7 * k, ease: EASE_OUT }),
      animate(startRef.current!, { y: -40, opacity: 1 }, { duration: 0.6 * k, delay: 0.8 * k, ease: EASE_OUT }),
    ];
    const focus = setTimeout(() => startRef.current?.focus({ preventScroll: true }), 800 * k);
    return () => {
      clearTimeout(focus);
      controls.forEach((c) => c.stop());
    };
  }, [phase]);

  const onStart = () => {
    if (phase !== "ready") return;
    setPhase("leaving");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const k = reduced ? 0 : 1;
    setTimeout(markSiteEntered, 300 * k);
    animate(logoRef.current!, { opacity: 0 }, { duration: 0.3 * k, ease: EASE_OUT });
    animate(startRef.current!, { opacity: 0 }, { duration: 0.3 * k, delay: 0.1 * k, ease: EASE_OUT });
    animate(rootRef.current!, { opacity: 0 }, { duration: 0.5 * k, delay: 0.3 * k, ease: EASE_IN_OUT }).then(() =>
      setPhase("gone"),
    );
  };

  if (phase === "gone") return null;

  const showRing = percent > 1 || phase !== "loading";

  return (
    <div
      ref={rootRef}
      role="dialog"
      aria-modal="true"
      aria-label="Chargement du portfolio"
      className="fixed inset-0 z-[9992] flex items-center justify-center"
      style={{ background: BG }}
      onTouchMove={(e) => e.preventDefault()}
    >
      <div className="relative">
        <svg
          ref={ringRef}
          width="270"
          height="270"
          viewBox="0 0 270 270"
          fill="none"
          aria-hidden
          className="h-[225px] w-[225px] -rotate-90"
          style={{ opacity: showRing ? 1 : 0 }}
        >
          <circle
            ref={circleRef}
            cx="136"
            cy="136"
            r="132"
            stroke={INK}
            strokeDasharray={DASH}
            strokeDashoffset={DASH}
          />
        </svg>

        {/* Logo: beige disc with the FS monogram. */}
        <div
          ref={logoRef}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        >
          <div
            className="flex h-[53px] w-[53px] items-center justify-center rounded-full font-display text-base font-bold tracking-tight"
            style={{ background: INK, color: BG }}
          >
            FS
          </div>
        </div>

        <span
          ref={textRef}
          role="status"
          aria-live="polite"
          className="absolute left-0 top-0 mt-[15px] w-full text-center text-[10px] leading-[110%] tracking-[-0.03em]"
          style={{ color: INK, opacity: showRing ? 1 : 0 }}
        >
          {percent}%
        </span>

        <button
          ref={startRef}
          type="button"
          onClick={onStart}
          tabIndex={phase === "ready" ? 0 : -1}
          className="absolute bottom-0 left-[29px] flex h-[38px] w-[167px] items-center justify-center rounded-full border border-[#b7ab98] bg-transparent text-xs font-medium text-[#b7ab98] uppercase tracking-[0.3em] transition-colors duration-[600ms] ease-[cubic-bezier(0.165,0.84,0.44,1)] hover:bg-[#b7ab98] hover:text-[#0d0d0d] focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-[#b7ab98]"
          style={{
            opacity: 0,
            pointerEvents: phase === "ready" ? "auto" : "none",
          }}
        >
          Start
        </button>
      </div>
    </div>
  );
}

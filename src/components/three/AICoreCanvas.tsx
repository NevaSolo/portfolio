"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

const AICore = dynamic(() => import("./AICore"), { ssr: false });

export default function AICoreCanvas() {
  const reducedMotion = usePrefersReducedMotion();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  if (reducedMotion) {
    return (
      <div className="relative aspect-square w-full max-w-lg mx-auto">
        <div className="absolute inset-8 rounded-full border border-accent/30 bg-gradient-to-br from-accent/20 via-transparent to-accent-2/10 blur-2xl" />
      </div>
    );
  }

  return (
    <div className="relative aspect-square w-full max-w-lg mx-auto">
      <AICore particleCount={isMobile ? 900 : 2400} />
    </div>
  );
}

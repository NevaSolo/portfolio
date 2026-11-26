"use client";

import dynamic from "next/dynamic";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

const Laptop = dynamic(() => import("./Laptop"), { ssr: false });

export default function LaptopCanvas() {
  const reducedMotion = usePrefersReducedMotion();

  return (
    <div className="relative mx-auto aspect-square w-full max-w-lg">
      <Laptop still={reducedMotion} />
    </div>
  );
}

"use client";

import { useRef, type ReactNode } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * Text that "fills" left to right as it scrolls up through the viewport:
 * a dim copy underneath, a full-color copy on top revealed by clip-path.
 * Fills horizontally, so it reads best on single-line headings.
 */
export default function ScrollFillText({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 90%", "start 45%"],
  });
  const clipPath = useTransform(
    scrollYProgress,
    (v) => `inset(0 ${(1 - v) * 100}% 0 0)`
  );

  return (
    // inline-block: the box hugs the text, so the clip % maps to the word's width.
    <span ref={ref} className={cn("relative inline-block align-top", className)}>
      <span className="block opacity-15">{children}</span>
      <motion.span aria-hidden className="scroll-fill absolute inset-0" style={{ clipPath }}>
        {children}
      </motion.span>
    </span>
  );
}

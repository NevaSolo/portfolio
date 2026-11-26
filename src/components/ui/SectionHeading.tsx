"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import ScrollFillText from "@/components/ui/ScrollFillText";

export default function SectionHeading({
  eyebrow,
  title,
  align = "left",
  className,
}: {
  eyebrow: string;
  title: string;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div className={cn(align === "center" && "text-center", className)}>
      <motion.p
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5 }}
        className="text-xs uppercase tracking-[0.35em] text-accent"
      >
        {eyebrow}
      </motion.p>
      <motion.h2
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6, delay: 0.08 }}
        className="mt-3 font-display text-4xl uppercase tracking-tight sm:text-5xl md:text-6xl"
      >
        <ScrollFillText>{title}</ScrollFillText>
      </motion.h2>
    </div>
  );
}

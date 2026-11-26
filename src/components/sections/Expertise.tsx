"use client";

import { motion } from "framer-motion";
import SectionHeading from "@/components/ui/SectionHeading";
import { EXPERTISE } from "@/data/skills";
import TechIcon from "@/components/ui/TechIcon";

export default function Expertise() {
  return (
    <section className="px-6 py-28 md:px-10 md:py-36">
      <div className="mx-auto max-w-7xl">
        <SectionHeading eyebrow="What I Do" title="Expertise" />

        <div className="mt-14 grid gap-6 md:grid-cols-2">
          {EXPERTISE.map((group, i) => (
            <motion.div
              key={group.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="group relative overflow-hidden rounded-2xl border border-line bg-bg-soft p-8 transition-colors duration-500 hover:border-accent/50"
            >
              <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-accent/0 blur-3xl transition-colors duration-500 group-hover:bg-accent/10" />

              <p className="text-xs uppercase tracking-[0.3em] text-accent">
                {group.description}
              </p>
              <h3 className="mt-2 font-display text-2xl uppercase tracking-tight md:text-3xl">
                {group.title}
              </h3>

              <div className="mt-6 flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <span
                    key={item}
                    className="inline-flex items-center gap-2 rounded-full border border-line px-3.5 py-1.5 text-xs text-fg-dim transition-colors duration-300 group-hover:border-accent/30 group-hover:text-fg"
                  >
                    <TechIcon name={item} size={14} className="shrink-0" />
                    {item}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

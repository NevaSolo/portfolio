"use client";

import { motion } from "framer-motion";
import SectionHeading from "@/components/ui/SectionHeading";
import { SKILLS, LANGUAGES } from "@/data/skills";
import TechIcon from "@/components/ui/TechIcon";

export default function Skills() {
  return (
    <section id="skills" className="px-6 py-28 md:px-10 md:py-36">
      <div className="mx-auto max-w-7xl">
        <SectionHeading eyebrow="Toolbox" title="Skills" />

        <div className="mt-14 flex flex-wrap gap-3 md:gap-4">
          {SKILLS.map((skill, i) => (
            <motion.span
              key={skill}
              initial={{ opacity: 0, scale: 0.85 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.4, delay: (i % 8) * 0.04 }}
              whileHover={{ scale: 1.08, y: -3 }}
              className="inline-flex cursor-default items-center gap-2.5 rounded-full border border-line bg-bg-soft px-5 py-2.5 text-sm text-fg-dim transition-colors duration-300 hover:border-accent hover:text-accent hover:shadow-[0_0_24px_rgba(139,92,246,0.25)]"
              data-cursor="hover"
            >
              <TechIcon name={skill} size={18} className="shrink-0" />
              {skill}
            </motion.span>
          ))}
        </div>

        <div className="mt-24">
          <SectionHeading eyebrow="Languages" title="Langues" />
          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {LANGUAGES.map((lang, i) => (
              <motion.div
                key={lang.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="flex items-center justify-between rounded-2xl border border-line bg-bg-soft px-6 py-5"
              >
                <span className="font-display text-lg tracking-tight">{lang.name}</span>
                <span className="text-sm text-fg-mute">{lang.level}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

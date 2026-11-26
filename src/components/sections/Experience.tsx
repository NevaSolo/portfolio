"use client";

import { motion } from "framer-motion";
import SectionHeading from "@/components/ui/SectionHeading";
import { EXPERIENCE, EDUCATION } from "@/data/experience";

export default function Experience() {
  return (
    <section id="experience" className="px-6 py-28 md:px-10 md:py-36">
      <div className="mx-auto max-w-7xl">
        <SectionHeading eyebrow="Career" title="Experience" />

        <div className="mt-16 relative ml-3 border-l border-line md:ml-6">
          {EXPERIENCE.map((exp, i) => (
            <motion.div
              key={exp.company + exp.period}
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="relative pb-14 pl-8 last:pb-0 md:pl-12"
            >
              <span className="absolute -left-[7px] top-1.5 h-3.5 w-3.5 rounded-full border-2 border-accent bg-bg" />

              <p className="text-xs uppercase tracking-[0.25em] text-fg-mute">
                {exp.period}
              </p>
              <h3 className="mt-2 font-display text-xl uppercase tracking-tight md:text-2xl">
                {exp.company}
              </h3>
              <p className="mt-1 text-accent">{exp.role}</p>
              <p className="mt-3 max-w-2xl text-fg-dim">{exp.description}</p>

              {exp.tags && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {exp.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-line px-3 py-1 text-xs text-fg-dim"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </motion.div>
          ))}
        </div>

        <div className="mt-24">
          <SectionHeading eyebrow="Education" title="Formation" />
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {EDUCATION.map((edu, i) => (
              <motion.div
                key={edu.degree}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="rounded-2xl border border-line bg-bg-soft p-7"
              >
                <p className="text-xs uppercase tracking-[0.25em] text-fg-mute">
                  {edu.period}
                </p>
                <h4 className="mt-3 font-display text-lg uppercase leading-snug tracking-tight">
                  {edu.degree}
                </h4>
                <p className="mt-2 text-sm text-fg-dim">{edu.school}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

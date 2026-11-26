"use client";

import { motion } from "framer-motion";
import SectionHeading from "@/components/ui/SectionHeading";
import CursorRevealText from "@/components/ui/CursorRevealText";
import { STATS } from "@/data/skills";

export default function About() {
  return (
    // overflow-x-clip: contains the CursorRevealText overlay, which extends past the text.
    <section id="about" className="overflow-x-clip px-6 py-28 md:px-10 md:py-36">
      <div className="mx-auto max-w-7xl">
        <SectionHeading eyebrow="About Me" title="Qui suis-je" />

        <CursorRevealText
          className="mt-14 max-w-5xl"
          textClassName="font-display text-3xl leading-[1.15] tracking-tight sm:text-4xl md:text-5xl"
          hidden={
            <>
              Je transforme du café en code, et les bugs en features (presque)
              assumées.
            </>
          }
        >
          Je construis des applications web{" "}
          <span className="text-accent">intelligentes</span>, du premier pixel
          jusqu&apos;au modèle d&apos;IA.
        </CursorRevealText>

        <div className="mt-14 grid gap-16 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="space-y-6 text-lg leading-relaxed text-fg-dim"
          >
            <p>
              Développeur Full Stack sérieux et motivé, actuellement en{" "}
              <span className="text-fg">Master II Intelligence Artificielle</span> à
              l&apos;École Nationale d&apos;Informatique. Je conçois des applications
              complètes, du front-end au back-end, avec une attention particulière
              portée à la performance, à la sécurité et à l&apos;expérience
              utilisateur.
            </p>
            <p>
              Mon parcours m&apos;a permis de travailler sur des applications web
              dans différents domaines et d&apos;explorer progressivement
              l&apos;intelligence artificielle, le machine learning et les
              technologies modernes du web.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line">
            {STATS.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="bg-bg-soft p-6 md:p-8"
              >
                <p className="font-display text-3xl text-accent md:text-4xl">
                  {stat.value}
                </p>
                <p className="mt-2 text-xs uppercase tracking-wide text-fg-mute">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

"use client";

import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import MagneticButton from "@/components/ui/MagneticButton";

const LampCanvas = dynamic(() => import("@/components/three/LampCanvas"), {
  ssr: false,
});

const LaptopCanvas = dynamic(() => import("@/components/three/LaptopCanvas"), {
  ssr: false,
});

export default function Hero() {
  return (
    <section
      id="home"
      className="relative flex min-h-screen items-center overflow-hidden px-6 pt-28 pb-16 md:px-10"
    >
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_rgba(139,92,246,0.14),_transparent_60%)]" />

      <LampCanvas />

      {/* pointer-events-none on the grid so the lamp behind stays clickable
          wherever the columns don't cover it. */}
      <div className="pointer-events-none relative z-10 mx-auto grid w-full max-w-7xl items-center gap-16 lg:grid-cols-2">
        <div className="pointer-events-auto min-w-0">
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xs uppercase tracking-[0.35em] text-accent"
          >
            Full Stack Developer · AI Developer
          </motion.p>

          {/* Sized in vw so "SOLOMAMPIONONA" always fits its column. */}
          <h1 className="mt-6 font-display uppercase leading-[0.92] tracking-tight text-[9.5vw] md:text-[7vw] lg:text-[min(3.7vw,3.75rem)]">
            {["FANEVA", "SOLOMAMPIONONA"].map((word, i) => (
              <span key={word} className="block overflow-hidden">
                <motion.span
                  className="block text-glow"
                  initial={{ y: "110%" }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.9, delay: 0.3 + i * 0.12, ease: [0.16, 1, 0.3, 1] }}
                >
                  {word}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="mt-8 max-w-lg text-base leading-relaxed text-fg-dim md:text-lg"
          >
            Je conçois des expériences web modernes et des solutions intelligentes
            combinant développement Full Stack, intelligence artificielle et design
            interactif.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.85 }}
            className="mt-10 flex flex-wrap items-center gap-4"
          >
            <MagneticButton href="#projects">Voir mes projets</MagneticButton>
            <MagneticButton href="#contact" variant="outline">
              Me contacter
            </MagneticButton>
            <MagneticButton href="/cv.pdf" variant="outline" target="_blank">
              Voir mon CV
            </MagneticButton>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="pointer-events-auto relative order-first lg:order-last"
        >
          <LaptopCanvas />
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-fg-mute"
      >
        <span className="text-[10px] uppercase tracking-[0.3em]">Scroll to explore</span>
        <motion.span
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        >
          ↓
        </motion.span>
      </motion.div>
    </section>
  );
}

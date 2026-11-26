"use client";

import { useRef, type MouseEvent } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/data/projects";

export default function ProjectCard({
  project,
  onOpen,
  index,
}: {
  project: Project;
  onOpen: () => void;
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useSpring(useTransform(y, [-40, 40], [6, -6]), { stiffness: 200, damping: 20 });
  const rotateY = useSpring(useTransform(x, [-40, 40], [-6, 6]), { stiffness: 200, damping: 20 });

  const handleMove = (e: MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    x.set(e.clientX - rect.left - rect.width / 2);
    y.set(e.clientY - rect.top - rect.height / 2);
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  const onImage = Boolean(project.image);

  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, delay: (index % 2) * 0.1 }}
      className="group cursor-pointer"
      data-cursor="hover"
      onClick={onOpen}
    >
      <motion.div
        ref={ref}
        onMouseMove={handleMove}
        onMouseLeave={reset}
        style={{ rotateX, rotateY, transformPerspective: 900 }}
        className={`relative flex aspect-[4/3] flex-col justify-between overflow-hidden rounded-2xl border border-line p-7 md:p-9 ${
          project.featured
            ? "bg-gradient-to-br from-accent/15 via-bg-soft to-bg-soft"
            : "bg-bg-soft"
        }`}
      >
        {project.image ? (
          <>
            <Image
              src={project.image}
              alt=""
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              // Next's optimizer refuses SVG by default; illustrations are served as-is.
              unoptimized={project.image.endsWith(".svg")}
              className="object-cover object-left-top transition-transform duration-700 group-hover:scale-105"
            />
            {/* Dark scrim, same in both themes: legible label on top, title at the bottom. */}
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.45)_0%,rgba(0,0,0,0.05)_30%,rgba(0,0,0,0.2)_55%,rgba(0,0,0,0.88)_100%)] transition-opacity duration-500 group-hover:opacity-90" />
          </>
        ) : (
          <div className="pointer-events-none absolute -right-10 -bottom-10 font-display text-[10rem] leading-none text-fg/[0.03] transition-transform duration-500 group-hover:scale-110">
            {project.number}
          </div>
        )}

        <div className="relative z-10 flex items-start justify-between">
          <span
            className={
              onImage
                ? "rounded-full bg-black/45 px-3 py-1 text-[11px] uppercase tracking-[0.25em] text-white backdrop-blur-sm"
                : "text-xs uppercase tracking-[0.25em] text-accent"
            }
          >
            {project.category}
          </span>
          <span className={`text-xs ${onImage ? "text-white/80" : "text-fg-mute"}`}>
            {project.year}
          </span>
        </div>

        <div className={`relative z-10 ${onImage ? "text-white" : ""}`}>
          {project.client && (
            <p className={`mb-2 text-sm ${onImage ? "text-white/70" : "text-fg-mute"}`}>
              {project.client}
            </p>
          )}
          <h3 className="font-display text-2xl leading-tight tracking-tight md:text-3xl">
            {project.title}
          </h3>

          <div className="mt-4 flex flex-wrap gap-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            {project.technologies.slice(0, 4).map((t) => (
              <span
                key={t}
                className={`rounded-full px-2.5 py-1 text-[11px] ${
                  onImage ? "bg-white/15 text-white backdrop-blur-sm" : "bg-fg/10 text-fg"
                }`}
              >
                {t}
              </span>
            ))}
          </div>
        </div>

        <div
          className={`absolute right-7 top-7 flex h-10 w-10 items-center justify-center rounded-full border opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:border-accent group-hover:text-accent md:right-9 md:top-9 ${
            onImage ? "border-white/30 bg-black/30 text-white backdrop-blur-sm" : "border-line text-fg"
          }`}
        >
          <ArrowUpRight size={18} />
        </div>
      </motion.div>
    </motion.article>
  );
}

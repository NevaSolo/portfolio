"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { X, Github, ExternalLink } from "lucide-react";
import type { Project } from "@/data/projects";

export default function ProjectModal({
  project,
  onClose,
}: {
  project: Project | null;
  onClose: () => void;
}) {
  return (
    <AnimatePresence>
      {project && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[90] flex items-center justify-center bg-bg/90 backdrop-blur-md px-6"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-line bg-bg-soft p-8 md:p-12"
          >
            <button
              aria-label="Close"
              onClick={onClose}
              data-cursor="hover"
              className="absolute right-6 top-6 text-fg-dim transition-colors hover:text-fg"
            >
              <X size={22} />
            </button>

            {project.image && (
              <div className="relative mb-8 aspect-[16/10] overflow-hidden rounded-xl border border-line">
                <Image
                  src={project.image}
                  alt={`Aperçu de ${project.title}`}
                  fill
                  sizes="(min-width: 768px) 576px, 100vw"
                  unoptimized={project.image.endsWith(".svg")}
                  className="object-cover object-top"
                />
              </div>
            )}

            <span className="text-xs uppercase tracking-[0.3em] text-accent">
              {project.category} · {project.year}
            </span>
            {project.client && (
              <p className="mt-3 text-sm text-fg-mute">{project.client}</p>
            )}
            {project.period && (
              <p className="text-sm text-fg-mute">{project.period}</p>
            )}

            <h3 className="mt-4 font-display text-3xl uppercase tracking-tight md:text-4xl">
              {project.title}
            </h3>

            <p className="mt-6 leading-relaxed text-fg-dim">{project.description}</p>

            <div className="mt-8 flex flex-wrap gap-2">
              {project.technologies.map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-line px-3.5 py-1.5 text-xs text-fg-dim"
                >
                  {t}
                </span>
              ))}
            </div>

            {(project.github || project.demo) && (
              <div className="mt-10 flex flex-wrap gap-4">
                {project.github && (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noreferrer"
                    data-cursor="hover"
                    className="inline-flex items-center gap-2 rounded-full border border-line px-5 py-2.5 text-sm hover:border-accent hover:text-accent"
                  >
                    <Github size={16} /> GitHub
                  </a>
                )}
                {project.demo && (
                  <a
                    href={project.demo}
                    target="_blank"
                    rel="noreferrer"
                    data-cursor="hover"
                    className="inline-flex items-center gap-2 rounded-full bg-fg px-5 py-2.5 text-sm text-bg hover:bg-accent"
                  >
                    <ExternalLink size={16} /> Live Demo
                  </a>
                )}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

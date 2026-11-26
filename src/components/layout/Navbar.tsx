"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence, useScroll, useSpring } from "framer-motion";
import { Menu, X, Linkedin, Mail, FileText, Sun, Moon } from "lucide-react";
import { toggleTheme, useTheme } from "@/lib/theme";
import { NAV_LINKS } from "@/data/nav";
import { CONTACT } from "@/data/contact";
import { cn } from "@/lib/utils";

const SOCIALS = [
  { label: "LinkedIn", href: CONTACT.linkedin, icon: Linkedin, external: true },
  { label: "Email", href: `mailto:${CONTACT.email}`, icon: Mail, external: false },
  { label: "CV", href: "/cv.pdf", icon: FileText, external: true },
];

const SECTION_IDS = NAV_LINKS.map((l) => l.href.slice(1));

const EASE = "ease-[cubic-bezier(0.165,0.84,0.44,1)]";

/** Id of the section crossing the middle of the viewport. */
function useActiveSection(ids: readonly string[]) {
  const [active, setActive] = useState(ids[0]);

  useEffect(() => {
    const els = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: "-45% 0px -55% 0px" }
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [ids]);

  return active;
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const active = useActiveSection(SECTION_IDS);
  const theme = useTheme();
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* ── Desktop: left rail ─────────────────────────────── */}
      <aside className="fixed inset-y-0 left-0 z-50 hidden w-24 flex-col items-center justify-between py-10 md:flex">
        <a
          href="#home"
          aria-label="Retour en haut"
          data-cursor="hover"
          className={cn(
            "flex h-12 w-12 items-center justify-center rounded-full bg-fg font-display text-sm font-bold tracking-tight text-bg transition-colors duration-500 hover:bg-accent",
            EASE
          )}
        >
          FS
        </a>

        <ul className="flex flex-col items-center gap-7">
          {SOCIALS.map(({ label, href, icon: Icon, external }) => (
            <li key={label}>
              <a
                href={href}
                aria-label={label}
                title={label}
                data-cursor="hover"
                {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
                className={cn(
                  "block text-fg-dim transition-colors duration-500 hover:text-accent",
                  EASE
                )}
              >
                <Icon size={18} strokeWidth={1.75} />
              </a>
            </li>
          ))}
        </ul>
      </aside>

      {/* ── Desktop: vertical nav, top right ───────────────── */}
      <nav
        aria-label="Navigation principale"
        className="fixed right-10 top-10 z-50 hidden md:block"
      >
        <ul className="flex flex-col items-end gap-2.5">
          {NAV_LINKS.map((link) => {
            const isActive = active === link.href.slice(1);
            return (
              <li key={link.href}>
                <a
                  href={link.href}
                  data-cursor="hover"
                  aria-current={isActive ? "location" : undefined}
                  className={cn(
                    "flex items-center gap-3 text-xs uppercase tracking-[0.2em] transition-all duration-500",
                    EASE,
                    isActive ? "text-fg" : "text-fg-mute hover:-translate-x-1 hover:text-fg-dim"
                  )}
                >
                  <span
                    aria-hidden
                    className={cn(
                      "h-px bg-accent transition-all duration-500",
                      EASE,
                      isActive ? "w-6" : "w-0"
                    )}
                  />
                  {link.label}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* ── Desktop: scroll progress, bottom right ─────────── */}
      <div
        aria-hidden
        className="fixed bottom-10 right-10 z-50 hidden flex-col items-center gap-4 md:flex"
      >
        <span className="rotate-180 text-[10px] uppercase tracking-[0.3em] text-fg-mute [writing-mode:vertical-rl]">
          Scroll
        </span>
        <div className="relative h-24 w-px overflow-hidden bg-line">
          <motion.div
            style={{ scaleY: progress }}
            className="absolute inset-0 origin-top bg-accent"
          />
        </div>
      </div>

      {/* ── Mobile: top bar + burger ───────────────────────── */}
      <header
        className={`fixed top-0 inset-x-0 z-50 transition-colors duration-500 md:hidden ${
          scrolled ? "glass border-b border-line" : "bg-transparent"
        }`}
      >
        <nav className="flex items-center justify-between px-6 py-5">
          <a href="#home" className="font-display text-xl tracking-tight">
            FS<span className="text-accent">.</span>
          </a>

          <div className="flex items-center gap-5">
            {/* Mobile has no lamp: plain theme toggle. */}
            <button
              aria-label={theme === "light" ? "Activer le mode sombre" : "Activer le mode clair"}
              className="text-fg"
              onClick={(e) => toggleTheme({ x: e.clientX, y: e.clientY })}
            >
              {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
            </button>
            <button
              aria-label="Toggle menu"
              className="text-fg"
              onClick={() => setOpen((v) => !v)}
            >
              {open ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </nav>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="overflow-hidden glass border-t border-line"
            >
              <ul className="flex flex-col gap-1 px-6 py-6">
                {NAV_LINKS.map((link, i) => (
                  <motion.li
                    key={link.href}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <a
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className="block py-3 text-lg font-display uppercase tracking-wide text-fg"
                    >
                      {link.label}
                    </a>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}

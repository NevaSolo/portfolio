"use client";

import { useRef, useState, type ReactNode, type MouseEvent } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function MagneticButton({
  children,
  href,
  variant = "solid",
  className,
  onClick,
  type = "button",
  disabled,
  target,
}: {
  children: ReactNode;
  href?: string;
  variant?: "solid" | "outline";
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
  target?: string;
}) {
  const ref = useRef<HTMLAnchorElement | HTMLButtonElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  const handleMove = (e: MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setPos({ x: x * 0.35, y: y * 0.35 });
  };

  const reset = () => setPos({ x: 0, y: 0 });

  const classes = cn(
    "inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-medium uppercase tracking-wider transition-colors duration-300",
    variant === "solid"
      ? "bg-fg text-bg hover:bg-accent hover:text-fg"
      : "border border-line text-fg hover:border-accent hover:text-accent",
    className
  );

  const content = (
    <motion.span
      animate={{ x: pos.x, y: pos.y }}
      transition={{ type: "spring", stiffness: 150, damping: 12, mass: 0.5 }}
      className="inline-flex items-center gap-2"
    >
      {children}
    </motion.span>
  );

  if (href) {
    return (
      <a
        ref={ref as React.RefObject<HTMLAnchorElement>}
        href={href}
        target={target}
        rel={target === "_blank" ? "noreferrer" : undefined}
        data-cursor="hover"
        onMouseMove={handleMove}
        onMouseLeave={reset}
        className={classes}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      ref={ref as React.RefObject<HTMLButtonElement>}
      type={type}
      disabled={disabled}
      data-cursor="hover"
      onMouseMove={handleMove}
      onMouseLeave={reset}
      onClick={onClick}
      className={cn(classes, disabled && "pointer-events-none opacity-70")}
    >
      {content}
    </button>
  );
}

import {
  siCodeigniter,
  siCss3,
  siFlask,
  siHtml5,
  siJavascript,
  siLaravel,
  siMongodb,
  siMysql,
  siNextdotjs,
  siNodedotjs,
  siPhp,
  siPostgresql,
  siPython,
  siReact,
  siSymfony,
  siThreedotjs,
  siTypescript,
  siVuedotjs,
  type SimpleIcon,
} from "simple-icons";
import {
  BrainCircuit,
  Clapperboard,
  Database,
  MessageSquareText,
  MousePointerClick,
  Network,
  PenTool,
  ScanText,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

type Entry = { brand: SimpleIcon } | { generic: LucideIcon };

/** Keyed by lowercased skill name, as written in src/data/skills.ts. */
const ICONS: Record<string, Entry> = {
  html: { brand: siHtml5 },
  css: { brand: siCss3 },
  javascript: { brand: siJavascript },
  typescript: { brand: siTypescript },
  react: { brand: siReact },
  "react.js": { brand: siReact },
  "vue.js": { brand: siVuedotjs },
  "next.js": { brand: siNextdotjs },
  "node.js": { brand: siNodedotjs },
  laravel: { brand: siLaravel },
  symfony: { brand: siSymfony },
  flask: { brand: siFlask },
  codeigniter: { brand: siCodeigniter },
  php: { brand: siPhp },
  python: { brand: siPython },
  mysql: { brand: siMysql },
  postgresql: { brand: siPostgresql },
  mongodb: { brand: siMongodb },
  "three.js": { brand: siThreedotjs },
  "react three fiber": { brand: siThreedotjs },
  // Not brands: generic pictograms.
  sql: { generic: Database },
  "machine learning": { generic: BrainCircuit },
  "deep learning": { generic: Network },
  nlp: { generic: MessageSquareText },
  ocr: { generic: ScanText },
  "ai applications": { generic: Sparkles },
  "interactive web": { generic: MousePointerClick },
  "ux/ui": { generic: PenTool },
  "motion design": { generic: Clapperboard },
};

/** Near-black brand colors would vanish in dark mode: use the text color instead. */
function isNearBlack(hex: string) {
  const n = parseInt(hex, 16);
  const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  return 0.2126 * r + 0.7152 * g + 0.0722 * b < 40;
}

/** Logo for a skill name; renders nothing for unknown names. Decorative only. */
export default function TechIcon({
  name,
  size = 16,
  className,
}: {
  name: string;
  size?: number;
  className?: string;
}) {
  const entry = ICONS[name.toLowerCase()];
  if (!entry) return null;

  if ("generic" in entry) {
    const Icon = entry.generic;
    return <Icon aria-hidden size={size} strokeWidth={1.75} className={className} />;
  }

  const { path, hex } = entry.brand;
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill={isNearBlack(hex) ? "currentColor" : `#${hex}`}
      className={className}
    >
      <path d={path} />
    </svg>
  );
}

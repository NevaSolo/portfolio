import * as THREE from "three";

/** Code typed on the laptop screen. */
// Short lines + big font: the screen is only ~250px wide on the page.
const CODE = `// faneva.ts
const dev = {
  name: "Faneva",
  role: "Full Stack + AI",
};

async function build(idea) {
  const app = await ai(idea);
  return ship(app);
}`;

const KEYWORDS = new Set([
  "import", "from", "const", "export", "async", "function", "await", "return", "string",
]);

const COLORS = {
  bg: "#ffffff",
  bar: "#eeeef3",
  gutter: "#b4b4c0",
  text: "#24242c",
  keyword: "#7c3aed",
  string: "#0e8a7d",
  comment: "#9a9aa6",
  number: "#c2410c",
  fn: "#2563eb",
  caret: "#7c3aed",
};

type Token = { text: string; color: string };

function tokenize(line: string): Token[] {
  if (line.trimStart().startsWith("//")) return [{ text: line, color: COLORS.comment }];
  const out: Token[] = [];
  const re = /("[^"]*"?)|(\b\d+\b)|([A-Za-z_$][\w$]*)|(\s+)|(.)/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(line))) {
    const [t, str, num, word] = m;
    let color = COLORS.text;
    if (str) color = COLORS.string;
    else if (num) color = COLORS.number;
    else if (word && KEYWORDS.has(word)) color = COLORS.keyword;
    else if (word && line[re.lastIndex] === "(") color = COLORS.fn;
    out.push({ text: t, color });
  }
  return out;
}

const LINES = CODE.split("\n").map(tokenize);
const TOTAL_CHARS = CODE.replace(/\n/g, "").length;

// Canvas matches the screen's aspect (~7.15 × 4.77).
const W = 1536;
const H = 1024;
// The bottom ~20% of the panel sits behind the bezel: keep content above it.
const PAD_X = 40;
const BAR_H = 70;
const LINE_H = 72;
const FONT = `bold 60px ui-monospace, "SFMono-Regular", Menlo, Consolas, monospace`;

/**
 * Animated "editor" texture. Call `update(elapsed)` every frame;
 * it only redraws when the typed state actually changes.
 */
export function createCodeScreen(still: boolean) {
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d")!;

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;

  const CHARS_PER_SEC = 22;
  const HOLD = 4; // seconds to show the finished code before retyping
  const cycle = TOTAL_CHARS / CHARS_PER_SEC + HOLD;

  let lastKey = "";

  function draw(typed: number, caretOn: boolean) {
    ctx.fillStyle = COLORS.bg;
    ctx.fillRect(0, 0, W, H);

    // Window bar
    ctx.fillStyle = COLORS.bar;
    ctx.fillRect(0, 0, W, BAR_H);
    ["#ff5f57", "#febc2e", "#28c840"].forEach((c, i) => {
      ctx.fillStyle = c;
      ctx.beginPath();
      ctx.arc(40 + i * 34, BAR_H / 2, 11, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.font = FONT;
    ctx.textBaseline = "middle";
    let left = typed;
    const codeX = PAD_X + 110;
    let caretX = codeX;
    let caretY = BAR_H + 60;

    LINES.forEach((tokens, i) => {
      const y = BAR_H + 60 + i * LINE_H;
      ctx.fillStyle = COLORS.gutter;
      ctx.textAlign = "right";
      ctx.fillText(String(i + 1), PAD_X + 70, y);
      ctx.textAlign = "left";

      let x = codeX;
      if (left <= 0) return;
      for (const tok of tokens) {
        if (left <= 0) break;
        const text = tok.text.slice(0, left);
        left -= text.length;
        ctx.fillStyle = tok.color;
        ctx.fillText(text, x, y);
        x += ctx.measureText(text).width;
      }
      caretX = x;
      caretY = y;
    });

    if (caretOn) {
      ctx.fillStyle = COLORS.caret;
      ctx.fillRect(caretX + 3, caretY - 32, 8, 64);
    }
    texture.needsUpdate = true;
  }

  function update(elapsed: number) {
    const t = elapsed % cycle;
    const typed = still ? TOTAL_CHARS : Math.min(TOTAL_CHARS, Math.floor(t * CHARS_PER_SEC));
    const caretOn = still || typed < TOTAL_CHARS || Math.floor(elapsed * 2) % 2 === 0;
    const key = `${typed}:${caretOn}`;
    if (key === lastKey) return;
    lastKey = key;
    draw(typed, caretOn);
  }

  update(0);
  return { texture, update, dispose: () => texture.dispose() };
}

/**
 * The model's own UVs only cover part of the texture: project the screen
 * geometry onto its two largest axes so the canvas fills the whole panel.
 */
export function fitScreenUVs(geometry: THREE.BufferGeometry) {
  geometry.computeBoundingBox();
  const box = geometry.boundingBox!;
  const size = box.getSize(new THREE.Vector3());
  // Thinnest axis is the panel's normal; the other two span the screen.
  const axes = (["x", "y", "z"] as const)
    .map((a) => ({ a, s: size[a] }))
    .sort((p, q) => q.s - p.s);
  const [uAxis, vAxis] = [axes[0].a, axes[1].a];

  const pos = geometry.getAttribute("position");
  const uv = new Float32Array(pos.count * 2);
  const v3 = new THREE.Vector3();
  for (let i = 0; i < pos.count; i++) {
    v3.fromBufferAttribute(pos, i);
    uv[i * 2] = (v3[uAxis] - box.min[uAxis]) / size[uAxis];
    uv[i * 2 + 1] = (v3[vAxis] - box.min[vAxis]) / size[vAxis];
  }
  geometry.setAttribute("uv", new THREE.BufferAttribute(uv, 2));
}

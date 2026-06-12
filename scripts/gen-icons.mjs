// Generates the PWA icon set from an inline SVG using sharp.
// Run with: npm run icons
import sharp from "sharp";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const iconsDir = resolve(root, "public/icons");
mkdirSync(iconsDir, { recursive: true });

// `pad` is the empty margin (as a fraction) reserved around the wordmark —
// larger for the maskable variant so nothing is clipped by the OS mask.
const svg = (pad) => {
  const s = 512;
  const inset = s * pad;
  const fs = (s - inset * 2) * 0.5;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}" viewBox="0 0 ${s} ${s}">
  <defs>
    <radialGradient id="g" cx="32%" cy="28%" r="85%">
      <stop offset="0%" stop-color="#16121f"/>
      <stop offset="55%" stop-color="#0b0b12"/>
      <stop offset="100%" stop-color="#080808"/>
    </radialGradient>
  </defs>
  <rect width="${s}" height="${s}" fill="url(#g)"/>
  <text x="50%" y="50%" dy="0.34em" text-anchor="middle"
    font-family="-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', sans-serif"
    font-size="${fs}" font-weight="700" letter-spacing="-8" fill="#f0f0ee">IB</text>
  <circle cx="${s - inset - 26}" cy="${inset + 30}" r="13" fill="#4a9eff"/>
</svg>`;
};

const favicon = svg(0.18);
writeFileSync(resolve(root, "public/favicon.svg"), favicon, "utf8");

const targets = [
  { name: "icon-192.png", size: 192, pad: 0.18 },
  { name: "icon-512.png", size: 512, pad: 0.18 },
  { name: "icon-512-maskable.png", size: 512, pad: 0.28 },
  { name: "apple-touch-icon.png", size: 180, pad: 0.16 },
];

for (const t of targets) {
  await sharp(Buffer.from(svg(t.pad)))
    .resize(t.size, t.size)
    .png()
    .toFile(resolve(iconsDir, t.name));
  console.log("wrote", t.name);
}
console.log("wrote favicon.svg");

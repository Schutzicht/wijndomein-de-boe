#!/usr/bin/env node
/**
 * Hergenereer de fles/glas-keyframes (k6, k7, k8) met de ECHTE aangeleverde
 * beelden als referentie: de Moestuin-fles met echt label en het gebrande
 * De Boe-glas. Zo toont de climax van de scroll-film het echte product.
 *
 * Usage: source ~/.zshrc && node scripts/generate-real-bottle-keys.mjs
 */
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

dotenv.config();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const OUT = path.join(ROOT, "public", "film", "keyframes");
const SRC = path.join(ROOT, "public", "Input voor wijndomein de boe");

if (!process.env.GEMINI_API_KEY) { console.error("GEMINI_API_KEY ontbreekt"); process.exit(1); }
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const BOTTLE = path.join(SRC, "de fles van met echte logo en label Wijndomein-De-Boe-moestuin-276x1024.png");
const GLASS = path.join(SRC, "de glazen van wijndomein de boe incl logo.webp");

const BRAND = [
  "Photorealistic luxury product photography for Wijndomein De Boe.",
  "LIGHT, AIRY, high-key studio look: bright soft daylight, smooth cream-and-marble surface, lots of clean negative space, pale and elegant, fine-wine luxury editorial (Ruinart, Dom Perignon).",
  "Cinematic, wide, premium composition. Aspect ratio 16:9. No people, no extra text or captions anywhere except the real label that already exists on the product.",
].join(" ");

function imgPart(p) {
  const mime = p.endsWith(".webp") ? "image/webp" : p.endsWith(".png") ? "image/png" : "image/jpeg";
  return { inlineData: { mimeType: mime, data: fs.readFileSync(p).toString("base64") } };
}

const KEYS = [
  {
    name: "k6_fill",
    refs: [BOTTLE],
    prompt:
      "Use the EXACT bottle from the reference image, keeping its real paper label and yellow capsule exactly as-is (the label text must stay identical and legible, do not redesign it). " +
      "Show this bottle standing front-facing on cream marble in bright high-key studio light, pale golden wine inside, a few fine condensation droplets, generous clean negative space. Luxurious and minimal.",
  },
  {
    name: "k7_bottle",
    refs: [BOTTLE],
    prompt:
      "Hero product shot of the EXACT same bottle from the reference (identical real label and yellow capsule, text crisp and unchanged), standing front and slightly left of centre on cream marble, bright luxurious studio light and a long soft shadow, generous empty space on the right side of the frame. Pristine, premium, minimal.",
  },
  {
    name: "k8_pour",
    refs: [BOTTLE, GLASS],
    prompt:
      "The EXACT bottle from the first reference (keep the real label and yellow capsule, unchanged and legible) gently tilted and pouring pale golden wine into an elegant wine glass that is etched with the De Boe logo like in the second reference, standing on cream marble, bright high-key studio light, fine droplets caught in the light, generous empty space on the right. The final premium product moment.",
  },
];

async function gen({ name, prompt, refs }) {
  const parts = [...refs.map(imgPart), { text: `${BRAND}\n\n${prompt}` }];
  console.log(`generating: ${name} (refs: ${refs.length})`);
  const t0 = Date.now();
  const res = await ai.models.generateContent({ model: "gemini-3-pro-image-preview", contents: parts });
  const part = res.candidates?.[0]?.content?.parts?.find((p) => p.inlineData);
  if (!part) { console.warn(`  geen beelddata voor ${name}`); return; }
  fs.writeFileSync(path.join(OUT, `${name}.png`), Buffer.from(part.inlineData.data, "base64"));
  console.log(`saved: ${name}.png (${((Date.now() - t0) / 1000).toFixed(1)}s)`);
}

for (const k of KEYS) await gen(k);
console.log("klaar");

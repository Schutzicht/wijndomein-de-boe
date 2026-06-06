#!/usr/bin/env node
/**
 * Keyframe generation for the scroll-film (van de druif tot de wijn).
 * Light & luxe aesthetic. Each keyframe is a still; consecutive keyframes are
 * fed to an image-to-video model (start_image + end_image) to interpolate a
 * smooth, continuous motion between them. Some keyframes use a `ref` (a prior
 * keyframe) for visual consistency (same vineyard, same bottle).
 *
 * Usage: source ~/.zshrc && node scripts/generate-keyframes.mjs [--force] [--only=k6_fill]
 * Requires GEMINI_API_KEY.
 */

import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

dotenv.config();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, "..", "public", "film", "keyframes");

if (!process.env.GEMINI_API_KEY) { console.error("GEMINI_API_KEY ontbreekt"); process.exit(1); }
const args = process.argv.slice(2);
const FORCE = args.includes("--force");
const ONLY = args.find((a) => a.startsWith("--only="))?.split("=")[1];
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const BRAND = [
  "Photorealistic editorial photography for Wijndomein De Boe, a boutique vineyard on the Walcheren coast in Zeeland, the Netherlands.",
  "LIGHT, AIRY and LUXURIOUS aesthetic: bright soft natural daylight, high-key, pale cream and warm sand tones, lots of air and negative space, elegant and refined.",
  "Fine-wine luxury editorial finish, in the spirit of Ruinart, Dom Perignon, Aesop and Kinfolk. Subtle warm gold accents, gentle film grain, exquisite clarity.",
  "Cinematic, wide, premium composition. Aspect ratio 16:9.",
  "No people, no text, no logos, no labels, no watermarks, no readable lettering anywhere.",
].join(" ");

// Volgorde = filmvolgorde. ref = bestandsnaam van een eerder keyframe (consistentie).
const KEYS = [
  { name: "k0_aerial", prompt: "High aerial drone view of a coastal vineyard at soft morning light: long pale-green rows of vines on flat Zeeland land, the silver sea and bright luminous sky on the horizon, gentle sea haze. Airy, high-key, lots of sky. The very first frame of a cinematic journey." },
  { name: "k1_rows", ref: "k0_aerial", prompt: "The same vineyard, now a lower and closer aerial gliding just above the vine rows, the rows leading the eye forward, soft sunlight between the leaves, bright and clean. A continuation of the descending camera move." },
  { name: "k2_cluster", ref: "k1_rows", prompt: "Now very close among the same vines: a single ripe grape cluster in sharp focus, pale green-gold grapes with fine dew, soft creamy out-of-focus leaves and bright sky behind. Intimate, luminous, high-key." },
  { name: "k3_harvest", prompt: "Freshly harvested pale grapes tumbling into a clean light wooden crate, bright daylight, a few green leaves, soft cream background, elegant and tactile. No people. The moment of harvest." },
  { name: "k4_must", prompt: "Inside a bright, modern, airy winery: pale grape must and clear juice swirling, gleaming stainless steel and light oak, lots of soft daylight from large windows, clean and luxurious, cream and steel tones." },
  { name: "k5_cellar", prompt: "A bright, elegant wine cellar bathed in soft light: a graceful row of pale oak barrels receding, warm gold highlights, clean and airy rather than dark, refined and luxurious. The slow rijping of the wine." },
  { name: "k6_fill", prompt: "Studio product shot: an elegant tall slender clear-glass wine bottle with no label and a simple natural cork, being filled with pale golden wine, on a smooth cream and marble surface, bright soft high-key studio light, luxurious and minimal. Lots of clean negative space." },
  { name: "k7_bottle", ref: "k6_fill", prompt: "The exact same elegant clear-glass bottle, now full and standing as a hero, rotated to a beautiful three-quarter angle, on the same cream marble surface with soft luxurious studio light and a long gentle shadow. Pristine, premium, minimal. Keep the identical bottle shape and cork." },
  { name: "k8_pour", ref: "k7_bottle", prompt: "The same bottle gently pouring pale golden wine into an elegant crystal wine glass beside it, on the same cream marble surface, bright high-key luxury studio light, fine droplets, generous clean negative space on the right for a title. The final premium product moment. Keep the identical bottle." },
];

const filtered = ONLY ? KEYS.filter((k) => k.name === ONLY) : KEYS;

async function gen({ name, prompt, ref }) {
  const outPath = path.join(OUT, `${name}.png`);
  if (fs.existsSync(outPath) && !FORCE) { console.log(`skip: ${name}`); return; }
  const parts = [];
  if (ref) {
    const refPath = path.join(OUT, `${ref}.png`);
    if (fs.existsSync(refPath)) {
      parts.push({ inlineData: { mimeType: "image/png", data: fs.readFileSync(refPath).toString("base64") } });
      parts.push({ text: `${BRAND}\n\nUse the same location, palette, lighting and (where mentioned) the same bottle as the reference image. ${prompt}` });
    } else {
      console.warn(`  ref ${ref} ontbreekt, genereer zonder ref`);
      parts.push({ text: `${BRAND}\n\n${prompt}` });
    }
  } else {
    parts.push({ text: `${BRAND}\n\n${prompt}` });
  }
  console.log(`generating: ${name}${ref ? ` (ref ${ref})` : ""}`);
  const t0 = Date.now();
  try {
    const res = await ai.models.generateContent({ model: "gemini-3-pro-image-preview", contents: parts });
    const part = res.candidates?.[0]?.content?.parts?.find((p) => p.inlineData);
    if (!part) { console.warn(`  geen beelddata voor ${name}`); return; }
    fs.writeFileSync(outPath, Buffer.from(part.inlineData.data, "base64"));
    console.log(`saved: ${name}.png (${((Date.now() - t0) / 1000).toFixed(1)}s)`);
  } catch (e) { console.error(`failed: ${name} ${e.message}`); }
}

if (!fs.existsSync(OUT)) fs.mkdirSync(OUT, { recursive: true });
console.log(`\nKeyframes -> public/film/keyframes/\n`);
for (const k of filtered) await gen(k); // sequentieel, zodat refs naar eerdere bestaan
console.log("\nKlaar.\n");

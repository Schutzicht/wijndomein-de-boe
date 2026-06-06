#!/usr/bin/env node
/**
 * Brand image generation via Nano Banana Pro (Gemini 3 Pro Image).
 *
 * Usage:
 *   npm run generate:images                          # all missing images
 *   npm run generate:images -- --force               # regenerate everything
 *   npm run generate:images -- --only=<name> --force # one specific image
 *
 * Requires GEMINI_API_KEY (shell-env in ~/.zshrc, or local .env).
 */

import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.join(__dirname, "..");
const OUTPUT_DIR = path.join(PROJECT_ROOT, "public", "photos", "generated");

if (!process.env.GEMINI_API_KEY) {
  console.error("\x1b[31mGEMINI_API_KEY is not set.\x1b[0m  Add to ~/.zshrc: export GEMINI_API_KEY=AIza...");
  process.exit(1);
}

const args = process.argv.slice(2);
const FORCE = args.includes("--force");
const ONLY = args.find((a) => a.startsWith("--only="))?.split("=")[1];

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const BRAND = [
  "Photorealistic editorial photography for Wijndomein De Boe, a young boutique vineyard on the salty coastal terroir of the Walcheren peninsula in Zeeland, the Netherlands, where the vines grow on chalky, shell-rich sea-clay and sea-sand soil between the dunes and the North Sea.",
  "Visual language: cinematic, refined and atmospheric, painterly natural light, magazine-quality finish (think Kinfolk, Cereal magazine, Magazine F, fine-wine editorial).",
  "Palette: warm earthy tones, deep wine-red and oxblood, antique gold and brass, with cool coastal sea-green and pale dune light. Subtle natural film grain.",
  "Northern-European coastal light: low golden sun, soft sea haze, big Zeeland sky.",
  "No people in frame. No text, no logos, no watermarks, no captions, no bottle labels, no readable lettering anywhere.",
  "Shot on a medium-format camera, shallow depth of field where appropriate. Aspect ratio 16:9 (wide landscape) unless stated otherwise.",
].join(" ");

const IMAGES = [
  // ── Signature scroll-journey frames: van de druif tot de wijn ──
  {
    name: "journey-vine",
    prompt:
      "Wide cinematic establishing shot at golden hour. Long, perfectly aligned rows of grapevines heavy with ripening green-gold grapes on the flat Walcheren coast, leading the eye toward a glimpse of pale dunes and the silver North Sea on the horizon. " +
      "Sea breeze moving through the green leaves, warm low sun flare, faint salt haze in the air. Predominantly fresh green and amber-gold tones, hopeful and alive.",
  },
  {
    name: "journey-cluster",
    prompt:
      "Extreme cinematic close-up of one ripe grape cluster still on the vine, tiny droplets of dew and sea spray on the skins, glowing backlit by warm late-afternoon sun, soft out-of-focus green leaves behind. " +
      "Tones transitioning from green toward warm amber and the first hint of deep purple. Intimate, tactile, jewel-like.",
  },
  {
    name: "journey-cellar",
    prompt:
      "Atmospheric wine cellar interior. Rows of oak barrels receding into soft darkness, a single shaft of warm light cutting across them, dust motes floating, deep shadows, condensation and quiet. " +
      "Brass, oxblood and deep-brown tones. The mood of slow patient aging.",
  },
  {
    name: "journey-pour",
    prompt:
      "Dramatic cinematic close-up of red wine being poured into a crystal wine glass, the dark ruby stream catching a warm rim of light, a swirl and a few fine droplets frozen mid-air, near-black moody background. " +
      "Deep ruby red and antique gold. The triumphant final moment, the wine itself.",
  },

  // ── Hero / establishing ──
  {
    name: "hero-wijngaard",
    prompt:
      "Sweeping wide cinematic view of the De Boe vineyard estate on the Zeeland coast at first light. Geometric rows of vines stretching across flat reclaimed land, an old whitewashed Dutch garden cottage with a slate roof half-hidden among trees, the sea and big luminous sky beyond. " +
      "Soft morning mist over the rows, cool sea-green shadows warming to gold. Serene, premium, full of space.",
  },

  // ── Terroir / verhaal ──
  {
    name: "terroir-bodem",
    prompt:
      "Intimate macro at the base of a grapevine trunk: pale chalky clay-and-sand coastal soil studded with fragments of white seashells, a few tender green shoots pushing up, natural soft daylight, very shallow depth of field. Earthy, authentic, the story of the salty terroir.",
  },
  {
    name: "wijngaard-rij",
    prompt:
      "A single long row of grapevines photographed low and close, leaves textured with light, the row leading the eye toward the distant sea and an enormous soft Zeeland sky, low golden sun behind. Painterly depth, calm and cinematic.",
  },
  {
    name: "landgoed-boe",
    prompt:
      "An old characterful whitewashed Dutch garden cottage, 'de boe', with a weathered slate roof, climbing vines on the wall and a gnarled old fruit tree beside it, soft late-afternoon Zeeland light, an oasis of calm at the edge of the vineyard. Storybook but real.",
  },

  // ── Wijnen (product, no labels) ──
  {
    name: "fles-duo",
    prompt:
      "Premium minimal still life: two elegant unlabeled dark-glass wine bottles standing in soft coastal sand among wisps of beach grass at golden hour, the blurred sea behind, long warm shadows. Refined, editorial, absolutely no text or labels.",
  },
  {
    name: "wijn-wit",
    prompt:
      "Editorial product shot of a glass of pale golden-white wine resting on a weathered stone ledge outdoors, the vineyard softly blurred behind in bright clear coastal light, fine condensation on the bowl of the glass, a sprig of green nearby. Fresh and crisp. No label.",
  },
  {
    name: "wijn-rood",
    prompt:
      "Editorial product shot of a glass of deep ruby red wine on a dark oak table, moody warm directional light, a scatter of dark grapes and a single cork beside it, rich velvety shadows. Intimate and luxurious. No label.",
  },
  {
    name: "wijn-mousserend",
    prompt:
      "Editorial close-up of a tall champagne-method sparkling wine flute, endless fine bubbles rising in a column, bright airy backlight, pale gold liquid, a clean celebratory but refined mood, soft neutral background. No label.",
  },

  // ── Beleving ──
  {
    name: "proeverij-tafel",
    prompt:
      "An outdoor wine-tasting table set among the vine rows at golden hour: several glasses of white and red wine, a generous board of Zeeland cheeses, rustic bread and grapes, on a weathered wooden table, warm inviting low sun, vineyard and sea light behind. Convivial, no people.",
  },
  {
    name: "oogst-mand",
    prompt:
      "Close-up of the winemaker's craft without any person: a pair of well-used harvest secateurs and a woven basket brimming with just-picked grapes resting on a rough wooden workbench, warm low light, a few loose leaves and grapes around. Honest, hand-made, earthy.",
  },
];

const filtered = ONLY ? IMAGES.filter((i) => i.name === ONLY) : IMAGES;
if (ONLY && filtered.length === 0) {
  console.error(`No image named "${ONLY}". Available: ${IMAGES.map((i) => i.name).join(", ")}`);
  process.exit(1);
}

async function generateOne({ name, prompt }) {
  const outPath = path.join(OUTPUT_DIR, `${name}.png`);
  if (fs.existsSync(outPath) && !FORCE) {
    console.log(`\x1b[90mskip (exists): ${name}.png\x1b[0m`);
    return { name, status: "skip" };
  }
  console.log(`\x1b[36mgenerating: ${name}\x1b[0m`);
  const t0 = Date.now();
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-image-preview",
      contents: `${BRAND}\n\n${prompt}`,
    });
    const part = response.candidates?.[0]?.content?.parts?.find((p) => p.inlineData);
    if (!part) {
      console.warn(`\x1b[33m  no image data for ${name}\x1b[0m`);
      return { name, status: "empty" };
    }
    const buffer = Buffer.from(part.inlineData.data, "base64");
    fs.writeFileSync(outPath, buffer);
    console.log(`\x1b[32msaved: ${name}.png  (${(buffer.length / 1024).toFixed(0)} KB, ${((Date.now() - t0) / 1000).toFixed(1)}s)\x1b[0m`);
    return { name, status: "ok" };
  } catch (err) {
    console.error(`\x1b[31mfailed: ${name}  ${err.message}\x1b[0m`);
    return { name, status: "error" };
  }
}

async function main() {
  if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  console.log(`\nGenerating ${filtered.length} image(s) into public/photos/generated/\n`);
  const results = [];
  for (const img of filtered) results.push(await generateOne(img));
  const ok = results.filter((r) => r.status === "ok").length;
  const skip = results.filter((r) => r.status === "skip").length;
  const fail = results.filter((r) => r.status !== "ok" && r.status !== "skip").length;
  console.log(`\n\x1b[1mDone:\x1b[0m ${ok} generated, ${skip} skipped, ${fail} failed.\n`);
  if (fail > 0) process.exit(1);
}

main();

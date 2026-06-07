#!/usr/bin/env node
/** Converteer de gebruikte beelden naar WebP (ffmpeg-static, libwebp) en verwijder het origineel. */
import ffmpegPath from "ffmpeg-static";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");

// [relpad, maxbreedte, kwaliteit]
const jobs = [
  ["public/photos/generated/landgoed-boe.png", 1400, 80],
  ["public/photos/generated/terroir-bodem.png", 1400, 80],
  ["public/echt/wijnboer.jpg", 1300, 80],
  ["public/echt/sfeer/promo11.jpg", 1600, 76],
  ["public/echt/sfeer/promo59.jpg", 1600, 76],
  ["public/echt/sfeer/sfeer1.jpg", 1300, 78],
  ["public/echt/sfeer/sfeer2.jpg", 1500, 78],
  ["public/echt/sfeer/oogst.jpg", 1300, 78],
  ["public/echt/sfeer/drone1.jpg", 1600, 76],
  ["public/echt/sfeer/drone4.jpg", 1600, 76],
  ["public/echt/wijnen/moestuin.png", 460, 86],
  ["public/echt/wijnen/de-twi-gemete.png", 460, 86],
  ["public/echt/wijnen/tuin-van-zeeland.png", 460, 86],
  ["public/echt/wijnen/hof-triton.png", 460, 86],
  ["public/echt/wijnen/de-zes-oxhoofden.png", 460, 86],
  ["public/echt/wijnen/de-bogerd.png", 460, 86],
  ["public/echt/wijnen/clos-driehoek.png", 460, 86],
  ["public/echt/wijnen/tritons-hofjuweel.png", 460, 86],
  ["public/echt/wijnen/wijnkist.png", 460, 86],
  ["public/echt/wijnen/blanc-de-blancs.jpg", 460, 84],
  ["public/echt/wijnen/rose-brut.jpg", 460, 84],
  ["public/echt/wijnen/tuin-van-zeeland-brut.jpg", 460, 84],
  ["public/echt/wijnen/podcast-pakket.jpg", 460, 84],
];

let before = 0, after = 0;
for (const [rel, w, q] of jobs) {
  const src = path.join(ROOT, rel);
  if (!fs.existsSync(src)) { console.log("MIS", rel); continue; }
  const out = src.replace(/\.(png|jpe?g)$/i, ".webp");
  const sz0 = fs.statSync(src).size;
  try {
    execFileSync(ffmpegPath, ["-y", "-i", src, "-vf", `scale=min(${w}\\,iw):-1`, "-c:v", "libwebp", "-quality", String(q), "-compression_level", "6", out], { stdio: ["ignore", "ignore", "ignore"] });
  } catch (e) { console.log("FAIL", rel, e.message); continue; }
  if (fs.existsSync(out) && fs.statSync(out).size > 0) {
    const sz1 = fs.statSync(out).size; before += sz0; after += sz1;
    fs.rmSync(src);
    console.log(`ok ${path.basename(out)}  ${(sz0/1024).toFixed(0)}KB -> ${(sz1/1024).toFixed(0)}KB`);
  } else console.log("LEEG", rel);
}
console.log(`\nTotaal: ${(before/1e6).toFixed(1)}MB -> ${(after/1e6).toFixed(1)}MB`);

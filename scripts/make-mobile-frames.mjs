#!/usr/bin/env node
/** Maak een lichtere mobiele frameset (720px) uit public/film/frames/ -> public/film/frames-sm/ */
import ffmpegPath from "ffmpeg-static";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const SRC = path.join(ROOT, "public", "film", "frames");
const OUT = path.join(ROOT, "public", "film", "frames-sm");
fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });

const files = fs.readdirSync(SRC).filter((f) => /^f\d+\.jpg$/.test(f)).sort();
let bytes = 0;
for (const f of files) {
  const out = path.join(OUT, f);
  execFileSync(ffmpegPath, ["-y", "-i", path.join(SRC, f), "-vf", "scale=720:-2:flags=lanczos", "-q:v", "7", out], { stdio: ["ignore", "ignore", "ignore"] });
  bytes += fs.statSync(out).size;
}
console.log(`frames-sm: ${files.length} frames, ${(bytes / 1e6).toFixed(1)} MB (was ${(fs.readdirSync(SRC).reduce((a, f) => a + fs.statSync(path.join(SRC, f)).size, 0) / 1e6).toFixed(1)} MB)`);

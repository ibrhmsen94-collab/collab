// Sahne görselleri: icerik.gorseller (6 öğe: katalog adı ya da izinli https URL) → <sablon>/assets/g/s0..s5.jpg (1188×2112 dikey kırpım).
// İndirilenler cikti/TARIH/.gorsel/ altında önbelleğe alınır.
import { existsSync, mkdirSync, readFileSync, copyFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { join } from "node:path";
import { createHash } from "node:crypto";

export const GORSEL_SAYISI = 6;
const IZINLI = /^https:\/\/(www\.rockstargames\.com|media-rockstargames-com\.akamaized\.net|upload\.wikimedia\.org)\//;

export function cozumle(oge, katalog = {}) {
  if (typeof oge !== "string" || !oge.trim()) throw new Error("boş görsel");
  const u = katalog[oge] || oge;
  if (!IZINLI.test(u)) throw new Error(`izinsiz görsel kaynağı: ${oge}`);
  return u;
}

export function gorselHazirla(liste, { katalogYol, onbellek, hedefDir }) {
  if (!Array.isArray(liste) || liste.length !== GORSEL_SAYISI) throw new Error(`gorseller ${GORSEL_SAYISI} öğe olmalı`);
  const katalog = katalogYol && existsSync(katalogYol) ? JSON.parse(readFileSync(katalogYol, "utf8")) : {};
  mkdirSync(onbellek, { recursive: true });
  mkdirSync(hedefDir, { recursive: true });
  liste.forEach((oge, i) => {
    const url = cozumle(oge, katalog);
    const ham = join(onbellek, createHash("sha1").update(url).digest("hex").slice(0, 12) + ".img");
    if (!existsSync(ham)) execFileSync("curl", ["-sSfL", "-m", "60", "-A", "Mozilla/5.0", "-o", ham, url], { stdio: ["ignore", "ignore", "inherit"] });
    execFileSync("ffmpeg", ["-y", "-loglevel", "error", "-i", ham, "-vf",
      "scale=1188:2112:force_original_aspect_ratio=increase,crop=1188:2112", "-frames:v", "1", "-q:v", "3", join(hedefDir, `s${i}.jpg`)]);
  });
}

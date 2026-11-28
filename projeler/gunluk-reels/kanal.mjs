// Veri kökü: KANAL boşsa proje kökü (günlük reels), doluysa kanallar/<KANAL>/ (ör. gta6). icerik/ ve cikti/ bunun altındadır.
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const KOK = dirname(fileURLToPath(import.meta.url));
export function veriKok(kanal = process.env.KANAL) {
  if (!kanal) return KOK;
  if (!/^[a-z0-9-]{1,32}$/.test(kanal)) throw new Error(`Geçersiz KANAL: ${kanal}`);
  return join(KOK, "kanallar", kanal);
}

#!/usr/bin/env node
// Galeri satırı: node galeri.mjs TARIH <tr_url> <en_url> → cikti/TARIH/galeri-satir.json
// Sonra ArtifactData set (collection "videolar", doc_id TARIH, file_path bu dosya).
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
const KOK = dirname(fileURLToPath(import.meta.url));
const [tarih, tr, en] = process.argv.slice(2);
if (!/^\d{4}-\d{2}-\d{2}$/.test(tarih || "") || !tr || !en) { console.error("Kullanım: node galeri.mjs TARIH TR_URL EN_URL"); process.exit(1); }
const ic = JSON.parse(readFileSync(join(KOK, "icerik", `${tarih}.json`), "utf8"));
const satir = { tarih, konu: `${ic.konu} · ${ic.en.baslik}`, tr: { url: tr, id: tr.split("/").pop() }, en: { url: en, id: en.split("/").pop() },
  paylasim: readFileSync(join(KOK, "cikti", tarih, "PAYLASIM.md"), "utf8") };
const out = join(KOK, "cikti", tarih, "galeri-satir.json");
writeFileSync(out, JSON.stringify(satir));
console.log(out);

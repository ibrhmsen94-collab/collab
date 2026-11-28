#!/usr/bin/env node
// Günlük Reels üretici: icerik/<tarih>.json → cikti/<tarih>/reels-<tarih>-{tr,en}.mp4 + PAYLASIM.md
// Kullanım: node uret.mjs [YYYY-MM-DD] [--taslak]
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { sesUret, SAHNELER } from "./ses.mjs";

const KOK = dirname(fileURLToPath(import.meta.url));
const CLI = "/root/.claude/skills/hyperframes/scripts/plugin-cli.mjs";
export const DILLER = ["tr", "en"];
export const METIN = ["etiket", "baslik", "altbaslik", "f1b", "f1t", "f2b", "f2t", "f3b", "f3t", "gbaslik", "g1e", "g2e", "g3e", "g4e", "sonuc", "cta", "kaynak"];
export const SAYI = ["f1n", "f2n", "f3n", "g1d", "g2d", "g3d", "g4d"];
const SINIR = { baslik: 60, altbaslik: 70, f1t: 110, f2t: 110, f3t: 110, sonuc: 70, cta: 45, gbaslik: 40, f1b: 18, f2b: 18, f3b: 18 };

export function bugun(tz = "Europe/Istanbul") {
  return new Intl.DateTimeFormat("en-CA", { timeZone: tz, year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());
}

export function dogrula(ic) {
  const h = [];
  if (!ic || typeof ic !== "object") return ["İçerik nesne değil"];
  if (!ic.konu) h.push("konu eksik");
  if (!Array.isArray(ic.kaynaklar) || ic.kaynaklar.length === 0) h.push("kaynaklar eksik (en az 1 URL)");
  for (const d of DILLER) {
    const v = ic[d];
    if (!v) { h.push(`${d} bölümü eksik`); continue; }
    for (const k of METIN) {
      if (typeof v[k] !== "string" || !v[k].trim()) h.push(`${d}.${k} eksik`);
      else if (SINIR[k] && v[k].length > SINIR[k]) h.push(`${d}.${k} çok uzun (${v[k].length}>${SINIR[k]})`);
    }
    for (const k of SAYI) if (typeof v[k] !== "number" || !Number.isFinite(v[k]) || v[k] < 0) h.push(`${d}.${k} geçerli sayı değil`);
    if (!v.aciklama) h.push(`${d}.aciklama eksik`);
    if (!Array.isArray(v.seslendirme) || v.seslendirme.length !== SAHNELER.length || v.seslendirme.some((x) => typeof x !== "string" || !x.trim()))
      h.push(`${d}.seslendirme ${SAHNELER.length} dolu metin olmalı (kanca, 3 gerçek, grafik, kapanış)`);
    if (!Array.isArray(v.etiketler) || v.etiketler.length < 3) h.push(`${d}.etiketler en az 3 olmalı`);
  }
  for (const k of SAYI) if (ic.tr && ic.en && ic.tr[k] !== ic.en[k]) h.push(`${k} TR/EN farklı`);
  return h;
}

export function degiskenler(ic, d) {
  const v = ic[d];
  const o = { dil: d === "tr" ? "tr-TR" : "en-US" };
  for (const k of [...METIN, ...SAYI]) o[k] = v[k];
  if (ic.vurgu) o.vurgu = ic.vurgu;
  if (ic.vurgu2) o.vurgu2 = ic.vurgu2;
  return o;
}

export function paylasimMetni(ic, tarih) {
  const blok = (d) => {
    const v = ic[d];
    const et = v.etiketler.map((e) => (e.startsWith("#") ? e : "#" + e)).join(" ");
    const L = d === "tr"
      ? { yt: "YouTube Shorts", ig: "Instagram Reels", tt: "TikTok", bas: "Başlık", ac: "Açıklama" }
      : { yt: "YouTube Shorts", ig: "Instagram Reels", tt: "TikTok", bas: "Title", ac: "Description" };
    return [
      `## ${d.toUpperCase()} — reels-${tarih}-${d}.mp4`,
      `### ${L.yt}`, `**${L.bas}:** ${v.baslik} #Shorts`, `**${L.ac}:**`, "", `${v.aciklama}`, "", `${v.kaynak}`, et, "",
      `### ${L.ig}`, "", `${v.baslik}`, "", `${v.aciklama}`, "", `${v.cta} ➜`, "", et, "",
      `### ${L.tt}`, "", `${v.baslik} ${et.split(" ").slice(0, 5).join(" ")} #fyp`, "",
    ].join("\n");
  };
  return [`# ${tarih} — ${ic.konu}`, "", "Kaynaklar:", ...ic.kaynaklar.map((k) => `- ${k}`), "", blok("tr"), blok("en")].join("\n");
}

function main() {
  const args = process.argv.slice(2);
  const tarih = args.find((a) => /^\d{4}-\d{2}-\d{2}$/.test(a)) || bugun();
  const taslak = args.includes("--taslak");
  const dosya = join(KOK, "icerik", `${tarih}.json`);
  if (!existsSync(dosya)) { console.error(`Yok: ${dosya}`); process.exit(1); }
  const ic = JSON.parse(readFileSync(dosya, "utf8"));
  const hatalar = dogrula(ic);
  if (hatalar.length) { console.error("İçerik hatalı:\n- " + hatalar.join("\n- ")); process.exit(2); }
  const out = join(KOK, "cikti", tarih);
  mkdirSync(out, { recursive: true });
  for (const d of DILLER) {
    const vf = join(out, `.degiskenler-${d}.json`);
    writeFileSync(vf, JSON.stringify(degiskenler(ic, d)));
    const mp4 = join(out, `reels-${tarih}-${d}.mp4`);
    console.log(`Seslendirme: ${d}`);
    sesUret(d, ic[d].seslendirme, join(out, ".ses"), join(KOK, "sablon", "assets", "ses.wav"));
    console.log(`Render: ${d} → ${mp4}`);
    execFileSync("node", [CLI, "render", join(KOK, "sablon"), "--variables-file", vf, "-o", mp4,
      "-q", taslak ? "draft" : "delivery", "--crf", "24", "--quiet", "--skill=hyperframes"], { stdio: "inherit" });
  }
  writeFileSync(join(out, "PAYLASIM.md"), paylasimMetni(ic, tarih));
  console.log(`Tamam: ${out}`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) main();

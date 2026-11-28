#!/usr/bin/env node
// Günün TR+EN videolarını YouTube, Instagram ve TikTok'a (aynı hesaplara) yükler.
// Kullanım: node paylas/index.mjs [TARIH] [--kuru]   (--kuru: hiçbir şey yüklemez, planı yazdırır)
// Ortam: YT_CLIENT_ID YT_CLIENT_SECRET YT_REFRESH_TOKEN | IG_USER_ID IG_ACCESS_TOKEN | TT_CLIENT_KEY TT_CLIENT_SECRET TT_REFRESH_TOKEN
// Eksik kimlikli platform atlanır. Sonuç cikti/TARIH/PAYLASIM-DURUM.json'a yazılır; başarıyla yüklenen tekrar yüklenmez.
// Yenilenen tokenlar YENI_IG_TOKEN / YENI_TT_REFRESH dosyalarına yazılır (Action bunları GitHub Secrets'a geri kaydeder).
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import * as M from "./metin.mjs";
import * as P from "./platformlar.mjs";
import { veriKok } from "../kanal.mjs";

const KOK = join(dirname(fileURLToPath(import.meta.url)), "..");
const DILLER = ["tr", "en"];
const VERI = veriKok();

export function plan(env, durum) {
  const hazir = {
    youtube: !!(env.YT_CLIENT_ID && env.YT_CLIENT_SECRET && env.YT_REFRESH_TOKEN),
    instagram: !!(env.IG_USER_ID && env.IG_ACCESS_TOKEN),
    tiktok: !!(env.TT_CLIENT_KEY && env.TT_CLIENT_SECRET && env.TT_REFRESH_TOKEN),
  };
  const isler = [];
  for (const p of Object.keys(hazir)) for (const d of DILLER) {
    const k = `${p}-${d}`;
    if (!hazir[p]) isler.push({ k, atla: "kimlik bilgisi yok" });
    else if (durum[k]?.tamam) isler.push({ k, atla: "zaten paylaşıldı" });
    else isler.push({ k, p, d });
  }
  return isler;
}

async function main() {
  const args = process.argv.slice(2);
  const tarih = args.find((a) => /^\d{4}-\d{2}-\d{2}$/.test(a));
  if (!tarih) { console.error("Kullanım: node paylas/index.mjs TARIH [--kuru]"); process.exit(1); }
  const kuru = args.includes("--kuru");
  const ic = JSON.parse(readFileSync(join(VERI, "icerik", `${tarih}.json`), "utf8"));
  const dir = join(VERI, "cikti", tarih);
  const durumYol = join(dir, "PAYLASIM-DURUM.json");
  const durum = existsSync(durumYol) ? JSON.parse(readFileSync(durumYol, "utf8")) : {};
  const env = process.env;
  const isler = plan(env, durum);
  for (const i of isler) console.log(i.atla ? `- ${i.k}: atlandı (${i.atla})` : `- ${i.k}: yüklenecek`);
  if (kuru) return;

  const tok = {};
  let hata = 0;
  for (const i of isler.filter((x) => !x.atla)) {
    const video = join(dir, `reels-${tarih}-${i.d}.mp4`);
    try {
      let sonuc;
      if (i.p === "youtube") {
        tok.yt ??= await P.youtubeToken(env);
        sonuc = await P.youtubeYukle(tok.yt, video, M.youtube(ic, i.d), env.YT_GIZLILIK || "public");
      } else if (i.p === "instagram") {
        if (!tok.ig) {
          tok.ig = env.IG_ACCESS_TOKEN;
          try { const y = await P.instagramTokenYenile(tok.ig); if (y) { tok.ig = y; writeFileSync(join(KOK, "YENI_IG_TOKEN"), y); } }
          catch (e) { console.warn("Instagram token yenilenemedi, mevcut token kullanılıyor:", e.message); }
        }
        sonuc = await P.instagramYukle(tok.ig, env.IG_USER_ID, video, M.instagram(ic, i.d));
      } else {
        if (!tok.tt) { tok.tt = await P.tiktokToken(env); if (tok.tt.refresh) writeFileSync(join(KOK, "YENI_TT_REFRESH"), tok.tt.refresh); }
        sonuc = await P.tiktokYukle(tok.tt.access, video, M.tiktok(ic, i.d), env.TT_GIZLILIK || "PUBLIC_TO_EVERYONE");
      }
      durum[i.k] = { tamam: true, zaman: new Date().toISOString(), ...sonuc };
      console.log(`✓ ${i.k}`, JSON.stringify(sonuc));
    } catch (e) {
      hata++;
      durum[i.k] = { tamam: false, zaman: new Date().toISOString(), hata: e.message.slice(0, 500) };
      console.error(`✗ ${i.k}: ${e.message}`);
    }
    writeFileSync(durumYol, JSON.stringify(durum, null, 2));
  }
  if (hata) process.exit(3);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) main();

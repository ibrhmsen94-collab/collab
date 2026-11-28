#!/usr/bin/env node
// Serbest lisanslı görsel arama: node gorsel-ara.mjs "<sorgu>" [--kaynak openverse|nasa] [--n 10] [--onizle kolaj.jpg]
// Her satır JSON: { url, atif, en, boy, sayfa }. `url` doğrudan icerik.gorseller'e, `atif` icerik.gorselAtif'e yazılır.
// openverse: yalnızca ticari kullanım + değişiklik serbest lisanslar (CC0, PDM, BY, BY-SA), izinli sunucular.
import { execFileSync } from "node:child_process";
import { mkdtempSync, rmSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { IZINLI } from "./gorsel.mjs";

// curl: ortamın HTTPS vekil sunucusunu kullanır (Node fetch kullanmaz)
// 429 (hız sınırı) gelirse 20 sn arayla 4 kez dener.
const bekle = (ms) => Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
function getJSON(u) {
  for (let i = 0; ; i++) {
    try { return JSON.parse(execFileSync("curl", ["-sSfL", "-m", "30", "-A", "ReelsBot/1.0 (educational short videos)", u], { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] })); }
    catch (e) { if (i >= 3) throw new Error(`istek başarısız (${u.split("?")[0]}): ${String(e.stderr || e.message).trim()}`); bekle(20000); }
  }
}
const LIS = (r) => (["cc0", "pdm"].includes(r.license) ? r.license.toUpperCase() : `CC ${r.license.toUpperCase()} ${r.license_version || ""}`.trim());

export async function openverse(q, n = 10) {
  const u = `https://api.openverse.org/v1/images/?q=${encodeURIComponent(q)}&license_type=commercial,modification&page_size=20&mature=false`;
  const d = getJSON(u);
  return (d.results || []).filter((r) => IZINLI.test(r.url)).slice(0, n).map((r) => ({
    url: r.url, en: r.width, boy: r.height, sayfa: r.foreign_landing_url,
    atif: `"${r.title || "görsel"}" — ${r.creator || "bilinmiyor"}, ${LIS(r)} (${r.foreign_landing_url})`,
  }));
}

export async function nasa(q, n = 10) {
  const d = getJSON(`https://images-api.nasa.gov/search?q=${encodeURIComponent(q)}&media_type=image`);
  return (d.collection?.items || []).slice(0, n).map((it) => {
    const m = it.data?.[0] || {};
    const thumb = it.links?.[0]?.href || "";
    // her öğede ~large bulunmaz (403): varlık listesinden large > medium > orig seç
    let url = thumb.replace(/~(thumb|small|medium)\.jpg$/, "~large.jpg");
    try {
      const v = (getJSON(`https://images-api.nasa.gov/asset/${encodeURIComponent(m.nasa_id)}`).collection?.items || []).map((x) => x.href.replace(/^http:/, "https:"));
      url = ["large", "medium", "orig"].map((k) => v.find((h) => h.endsWith(`~${k}.jpg`))).find(Boolean) || url;
    } catch { /* varsayılan kalır */ }
    return { url, en: null, boy: null, sayfa: `https://images.nasa.gov/details/${m.nasa_id}`,
      atif: `"${m.title}" — NASA${m.center ? "/" + m.center : ""}, kamu malı` };
  }).filter((r) => IZINLI.test(r.url));
}

if (process.argv[1] && import.meta.url.endsWith(process.argv[1].split("/").pop())) {
  const a = process.argv.slice(2);
  const q = a.find((x) => !x.startsWith("--") && a[a.indexOf(x) - 1] !== "--kaynak" && a[a.indexOf(x) - 1] !== "--n" && a[a.indexOf(x) - 1] !== "--onizle");
  if (!q) { console.error('Kullanım: node gorsel-ara.mjs "<sorgu>" [--kaynak openverse|nasa] [--n 10]'); process.exit(1); }
  const k = a.includes("--kaynak") ? a[a.indexOf("--kaynak") + 1] : "openverse";
  const n = a.includes("--n") ? Number(a[a.indexOf("--n") + 1]) : 10;
  const r = await (k === "nasa" ? nasa : openverse)(q, n);
  r.forEach((x, i) => console.log(JSON.stringify({ no: i, ...x })));
  // --onizle <dosya.jpg>: sonuçları dikey kırpımla (soldan sağa, satır satır; no sırasıyla) tek kolajda göster
  if (a.includes("--onizle") && r.length) {
    const cikti = a[a.indexOf("--onizle") + 1];
    const t = mkdtempSync(join(tmpdir(), "onizle-"));
    r.forEach((x, i) => {
      const f = join(t, `f${String(i).padStart(2, "0")}.jpg`);
      try {
        execFileSync("curl", ["-sSfL", "-m", "30", "-A", "ReelsBot/1.0 (educational short videos)", "-o", f + ".src", x.url]);
        execFileSync("ffmpeg", ["-y", "-loglevel", "error", "-i", f + ".src", "-vf", "scale=216:384:force_original_aspect_ratio=increase,crop=216:384", "-frames:v", "1", f]);
      } catch { execFileSync("ffmpeg", ["-y", "-loglevel", "error", "-f", "lavfi", "-i", "color=c=gray:s=216x384", "-frames:v", "1", f]); }
    });
    // satır başına 5 kare (eksikler gri), hstack + vstack
    const dosyalar = r.map((_, i) => join(t, `f${String(i).padStart(2, "0")}.jpg`));
    while (dosyalar.length % 5) {
      const g = join(t, `bos${dosyalar.length}.jpg`);
      execFileSync("ffmpeg", ["-y", "-loglevel", "error", "-f", "lavfi", "-i", "color=c=black:s=216x384", "-frames:v", "1", g]);
      dosyalar.push(g);
    }
    const satir = dosyalar.length / 5;
    const fc = [...Array(satir).keys()].map((k) => `${[0, 1, 2, 3, 4].map((j) => `[${k * 5 + j}:v]`).join("")}hstack=5[r${k}]`);
    fc.push(satir > 1 ? `${[...Array(satir).keys()].map((k) => `[r${k}]`).join("")}vstack=${satir}[o]` : "[r0]null[o]");
    execFileSync("ffmpeg", ["-y", "-loglevel", "error", ...dosyalar.flatMap((f) => ["-i", f]), "-filter_complex", fc.join(";"), "-map", "[o]", "-frames:v", "1", cikti]);
    rmSync(t, { recursive: true, force: true });
    console.error(`önizleme: ${cikti}`);
  }
  if (!r.length) console.error("sonuç yok");
}

import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { dogrula, degiskenler, paylasimMetni, bugun } from "./uret.mjs";

const ornek = () => JSON.parse(readFileSync(new URL("./icerik/2026-11-25.json", import.meta.url)));

test("örnek içerik geçerli", () => assert.deepEqual(dogrula(ornek()), []));

test("tüm içerik dosyaları geçerli", () => {
  for (const f of readdirSync(new URL("./icerik/", import.meta.url)).filter((f) => f.endsWith(".json"))) {
    const ic = JSON.parse(readFileSync(new URL("./icerik/" + f, import.meta.url)));
    assert.deepEqual(dogrula(ic), [], f);
  }
});

test("eksik ve uzun alanlar yakalanır", () => {
  const ic = ornek();
  delete ic.en.baslik;
  ic.tr.baslik = "x".repeat(200);
  ic.tr.f1n = "100";
  const h = dogrula(ic);
  assert.ok(h.some((x) => x.startsWith("en.baslik eksik")));
  assert.ok(h.some((x) => x.startsWith("tr.baslik çok uzun")));
  assert.ok(h.some((x) => x.startsWith("tr.f1n")));
});

test("TR/EN sayı uyuşmazlığı yakalanır", () => {
  const ic = ornek();
  ic.en.g1d = 1;
  assert.ok(dogrula(ic).includes("g1d TR/EN farklı"));
});

test("değişkenler dile göre sayı biçimi taşır", () => {
  assert.equal(degiskenler(ornek(), "tr").dil, "tr-TR");
  assert.equal(degiskenler(ornek(), "en").dil, "en-US");
  assert.equal(degiskenler(ornek(), "en").baslik, ornek().en.baslik);
});

test("paylaşım metni üç platformu ve iki dili içerir", () => {
  const m = paylasimMetni(ornek(), "2026-11-25");
  for (const s of ["YouTube Shorts", "Instagram Reels", "TikTok", "## TR", "## EN", "#kalp", "#heart"]) assert.ok(m.includes(s), s);
});

test("bugun YYYY-MM-DD döner", () => assert.match(bugun(), /^\d{4}-\d{2}-\d{2}$/));

test("seslendirme eksik/yanlış uzunluk yakalanır", () => {
  const ic = ornek();
  ic.tr.seslendirme = ic.tr.seslendirme.slice(0, 3);
  delete ic.en.seslendirme;
  const h = dogrula(ic);
  assert.ok(h.some((x) => x.startsWith("tr.seslendirme")));
  assert.ok(h.some((x) => x.startsWith("en.seslendirme")));
});

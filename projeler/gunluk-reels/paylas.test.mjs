import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import * as M from "./paylas/metin.mjs";
import { plan } from "./paylas/index.mjs";

const ic = JSON.parse(readFileSync(new URL("./icerik/2026-11-27.json", import.meta.url)));

test("YouTube başlığı ≤100 karakter ve #Shorts içerir", () => {
  for (const d of ["tr", "en"]) {
    const m = M.youtube(ic, d);
    assert.ok(m.title.length <= 100 && m.title.includes("#Shorts"));
    assert.ok(m.description.length <= 4900);
    assert.equal(m.defaultLanguage, d);
  }
});

test("Instagram ve TikTok metni ≤2200 karakter, etiketli", () => {
  for (const d of ["tr", "en"]) {
    assert.ok(M.instagram(ic, d).length <= 2200 && M.instagram(ic, d).includes("#"));
    assert.ok(M.tiktok(ic, d).length <= 2200 && M.tiktok(ic, d).includes("#fyp"));
  }
});

test("uzun metin kesilir", () => {
  const uzun = structuredClone(ic);
  uzun.tr.aciklama = "x".repeat(5000);
  assert.ok(M.instagram(uzun, "tr").length <= 2200);
  assert.ok(M.youtube(uzun, "tr").description.length <= 4900);
});

test("plan: kimliği olmayan platform atlanır, paylaşılmış olan tekrar yüklenmez", () => {
  const env = { IG_USER_ID: "1", IG_ACCESS_TOKEN: "t" };
  const p = plan(env, { "instagram-tr": { tamam: true } });
  const k = Object.fromEntries(p.map((x) => [x.k, x]));
  assert.equal(k["youtube-tr"].atla, "kimlik bilgisi yok");
  assert.equal(k["tiktok-en"].atla, "kimlik bilgisi yok");
  assert.equal(k["instagram-tr"].atla, "zaten paylaşıldı");
  assert.equal(k["instagram-en"].p, "instagram");
  assert.equal(p.length, 6);
});

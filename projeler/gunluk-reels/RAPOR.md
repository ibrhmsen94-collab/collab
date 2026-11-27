# Günlük Reels — Rapor

Her gün 06:00'da (İstanbul) bilgilendirici, 30 sn, 1080×1920 dikey video: Türkçe + İngilizce. YouTube Shorts, Instagram Reels, TikTok için.

## Yapı
- `sablon/` — HyperFrames şablonu: animasyonlu gradyan arka plan, dönen tel-kafes küre, 3B perspektif ızgara, parçacıklar,
  sayaçlı halka grafikleri, cam kartlar, animasyonlu çubuk grafik, ilerleme çubuğu, sentez fon müziği (`assets/muzik.mp3`), seslendirme (`assets/ses.wav`, her render'da yeniden yazılır).
  Sahne akışı: kanca (0–4 sn) → 3 gerçek (4–22) → grafik (22–27) → kapanış/CTA (27–30).
  Yazılar platform güvenli alanında; uzun metin otomatik küçültülür.
- `icerik/TARIH.json` — günün içeriği (TR+EN, kaynaklar, renkler, açıklama, etiketler).
- `uret.mjs` — doğrular, iki dili render eder, `cikti/TARIH/PAYLASIM.md` (platform başına başlık/açıklama/etiket) yazar.
- `ses.mjs` — seslendirme: her sahneye ayrı cümle, ücretsiz yerel TTS (TR: Piper `tr_TR-dfki-medium`, EN: Kokoro `am_michael`),
  sığmayan cümle ≤%35 hızlandırılır, daha uzunsa hata; tek 30 sn iz (loudnorm −16 LUFS), müzik altta (%22).
- `uret.test.mjs`, `ses.test.mjs` — 10 test.
- `GUNLUK_GOREV.md` — zamanlanmış görevin adım adım talimatı.

## Kullanım
```
node --test
node uret.mjs 2026-11-25          # ~10 dk, iki video
node uret.mjs 2026-11-25 --taslak # hızlı önizleme
```

## Sınırlar / ENGEL
- Platformlara otomatik yükleme yok: YouTube/Instagram/TikTok hesap yetkisi ve API anahtarı gerekir. Videolar + `PAYLASIM.md` hazır; yüklemeyi kullanıcı yapar.
- Ses modelleri `collab` ortamının kurulum betiğiyle kurulur (Hugging Face erişimi gerekli).
- Video başına ~5–10 MB; depo yılda birkaç GB büyür. Gerekirse eski `cikti/` klasörleri arşivlenmeli (silme kullanıcı onayıyla).
- Denetim uyarıları (bilinçli): tek dosyalı kök kompozisyon (değişkenlerin tek yerden okunması için), sayaç `onUpdate` uyarısı (DOM ölçümü yok, yanlış pozitif).

## Üretim günlüğü
- 2026-11-25 — İnsan kalbi — BITTI (ilk örnek)
- 2026-11-27 — Şimşek — BITTI (sesli; elle üretildi, sabahki 'Ay' çalışması push edilemedi)

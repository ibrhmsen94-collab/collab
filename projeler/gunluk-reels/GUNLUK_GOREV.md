# Günlük Reels görevi (her gün 06:00, Europe/Istanbul)

Çalışma dizini: `projeler/gunluk-reels/`. Dal: `claude/gracious-pascal-i9slax`.

1. `git pull` ile dalı güncelle. `TARIH` = bugün (Europe/Istanbul, `node -e "import('./uret.mjs').then(m=>console.log(m.bugun()))"`).
2. **Konu seç:** `icerik/*.json` içindeki `konu` alanlarına bak, son 60 günde işlenmemiş, merak uyandıran, bilgilendirici bir konu seç
   (bilim, uzay, sağlık, tarih, teknoloji, doğa, ekonomi, psikoloji… dönüşümlü). Tıbbi/finansal tavsiye verme; sadece doğrulanabilir bilgi.
3. **Araştır:** WebSearch ile en az 2 güvenilir kaynaktan (kurum, üniversite, ansiklopedi, hakemli yayın) 3 sayısal gerçek + 4 değerli
   karşılaştırma verisi doğrula. Emin olmadığın sayıyı kullanma.
4. **İçerik yaz:** `icerik/TARIH.json` — şema için `icerik/2026-11-25.json` örneğine bak. TR ve EN doğal dilde yazılsın (çeviri kokmasın),
   sayılar iki dilde aynı. Kanca başlık soru veya şaşırtıcı iddia olsun. Konuya uygun `vurgu`/`vurgu2` rengi seç.
   Metin sınırları `uret.mjs` içindeki `SINIR` nesnesinde.
   `seslendirme`: her dil için 6 cümle (kanca 4 sn, 3 gerçek 6'şar sn, grafik 5 sn, kapanış 3 sn). Sayıları yazıyla yaz
   ("yüz bin", "one hundred thousand"); kısaltma/simge kullanma. Sahneye sığmazsa `uret.mjs` hata verir → cümleyi kısalt.
5. `node --test` geçmeli. Sonra `node uret.mjs TARIH` (≈10 dk) → `cikti/TARIH/` altında sesli TR+EN mp4 ve `PAYLASIM.md`.
6. **Kontrol:** her videodan 0.5, 7, 19, 24.5, 28.5. saniyelerden kare çıkar (ffmpeg), bak: taşan/kesilen metin, okunmayan yazı varsa
   içeriği kısalt ve yeniden render et. Ardından `denetci` ajanına içerik doğruluğu + kaynak kontrolü yaptır, bulguları düzelt.
7. `RAPOR.md` sonundaki "Üretim günlüğü"ne tek satır ekle: `- TARIH — konu — durum`.
8. Commit (`Reels TARIH: <konu>`) ve `git push -u origin claude/gracious-pascal-i9slax`.
9. Kullanıcıya PushNotification ile kısa Türkçe bildirim: konu + dosya yolları.

Kurallar: platformlara otomatik yükleme yapma (hesap/API anahtarı gerekir → kullanıcı yükler). Hata olursa günlüğe `ENGEL` + neden yaz,
yine de commit/push et ve bildir. Test atlama yok.

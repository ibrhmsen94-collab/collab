# GTA 6 günlük video görevi (her gün 17:00, Europe/Istanbul)

Çalışma dizini: `projeler/gunluk-reels/`. Dal: `claude/affectionate-hawking-t8ex5a`. Tüm komutlar `KANAL=gta6` ile çalışır.
Veriler: `kanallar/gta6/icerik/TARIH.json`, çıktı `kanallar/gta6/cikti/TARIH/`. Şablon/ses/paylaşım kodu günlük reels ile ortak.

1. `git pull`. `TARIH` = bugün (`node -e "import('./uret.mjs').then(m=>console.log(m.bugun()))"`).
   `kanallar/gta6/icerik/TARIH.json` zaten varsa ve galeride `gta6-TARIH` satırı varsa bitir.
2. **Konu seç:** önceki `kanallar/gta6/icerik/*.json` `konu` alanlarını tekrarlama. Önce son 48 saatin GTA 6 haberleri
   (Rockstar Newswire, Take-Two yatırımcı duyuruları, güncelleme/yama, GTA Online, PC sürümü, satış rakamları).
   Haber yoksa dönüşümlü bilgi konusu: harita/şehirler (Leonida, Vice City), karakterler (Lucia, Jason), seri tarihi
   (GTA 1–5 satış/çıkış yılları), fragman rekorları, geliştirme süresi/bütçe, sürüm karşılaştırmaları.
3. **Araştır:** WebSearch ile en az 2 güvenilir kaynak (Rockstar, Take-Two/SEC, büyük oyun basını). Söylenti, sızıntı ve
   analist tahminini gerçek gibi yazma; şirket tahminiyse açıklamada "tahmin" de. Emin olmadığın sayıyı kullanma.
   Spoiler serbest (hikâye, sonlar, gizli görevler, karakter kaderleri) — ama spoiler içeren bölümde `etiket`
   "SPOILER · GTA 6" / "SPOILER · GTA 6" olsun, `baslik` spoiler'ı doğrudan vermesin (kanca merak uyandırsın),
   `etiketler`e "spoiler" eklensin. Hikâye konuları için resmî kaynak yoksa birden çok büyük oyun sitesinin
   (IGN, GameSpot, Polygon, Eurogamer vb.) rehber/inceleme sayfalarıyla doğrula.
4. **İçerik yaz:** şema `kanallar/gta6/icerik/2026-11-28.json`. `etiket` "GTA 6 DOSYASI" / "GTA 6 FILES", `cta` takip çağrısı,
   renkler neon pembe/turuncu kalabilir. Kural ve sınırlar `GUNLUK_GOREV.md` 4. madde ile aynı (6 seslendirme cümlesi,
   sayılar yazıyla, "GTA altı" / "GTA six" diye seslendir). `tr.gorselKaynak`/`en.gorselKaynak`: "Görseller: Rockstar Games" /
   "Images: Rockstar Games".
   **Görseller:** `gorseller` = 6 öğe (kanca, gerçek 1-3, grafik, kapanış), her biri `gorsel-katalog.json` içindeki bir ad
   (Rockstar resmî GTA 6 galerisi: karakterler, Vice City, Leonida Keys, Grassrivers, Port Gellhorn, Mount Kalaga…) ya da
   izinli bir https URL (rockstargames.com, Rockstar akamaized CDN, upload.wikimedia.org). Konuyla eşleşen görsel seç
   (karakterden söz ediyorsan o karakter; bölgeden söz ediyorsan o bölge). Aynı görseli son 5 bölümde tekrar etme;
   logo/kapak (`Cover_Art`, `Logo`, `FOB_`) seçme. Seçtiklerine bak (uret sonrası `kanallar/gta6/sablon/assets/g/s*.jpg`).
   Yeni resmî görsel çıktıysa `rockstargames.com/VI/media` ve `/VI/launch-gallery` sayfalarından katalogu güncelle.
   Fragman videosu kesiti kullanma (otomatik telif eşleşmesi riski).
5. `node --test` geçmeli. `KANAL=gta6 node uret.mjs TARIH` → TR+EN mp4 + `PAYLASIM.md`.
6. **Kontrol:** `GUNLUK_GOREV.md` 6. madde (kareler + `denetci` ajanı ile doğruluk/kaynak kontrolü).
7. **Galeri:** `GUNLUK_GOREV.md` 7. madde; farklar: `KANAL=gta6 node galeri.mjs TARIH <tr_url> <en_url>`,
   `doc_id: "gta6-TARIH"`, `file_path: kanallar/gta6/cikti/TARIH/galeri-satir.json`.
8. `RAPOR.md` "Üretim günlüğü"ne: `- TARIH — [GTA 6] konu — durum`.
9. Commit (`GTA6 TARIH: <konu>`) ve `git push -u origin claude/affectionate-hawking-t8ex5a`. Push, YouTube/Instagram/TikTok
   paylaşımını GitHub Actions (`reels-paylas.yml`) ile tetikler. Reddedilirse `git pull --no-rebase` + tekrar; ağ hatasında 4 kez dene.
10. Kısa Türkçe özet: konu + galeri linki https://claude.ai/artifact/HLbVYda1atZmYiADcYyCeS

Kurallar: platformlara kendin yükleme yapma; hata olursa günlüğe `ENGEL` + neden yaz. Test atlama yok.

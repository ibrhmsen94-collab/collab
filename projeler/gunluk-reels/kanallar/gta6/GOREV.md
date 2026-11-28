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
   Spoiler (hikâye sonu vb.) verme.
4. **İçerik yaz:** şema `kanallar/gta6/icerik/2026-11-28.json`. `etiket` "GTA 6 DOSYASI" / "GTA 6 FILES", `cta` takip çağrısı,
   renkler neon pembe/turuncu kalabilir. Kural ve sınırlar `GUNLUK_GOREV.md` 4. madde ile aynı (6 seslendirme cümlesi,
   sayılar yazıyla, "GTA altı" / "GTA six" diye seslendir). Rockstar logosu, oyun görüntüsü, fragman kesiti kullanılmaz
   (telif): yalnızca şablonun özgün grafikleri.
5. `node --test` geçmeli. `KANAL=gta6 node uret.mjs TARIH` → TR+EN mp4 + `PAYLASIM.md`.
6. **Kontrol:** `GUNLUK_GOREV.md` 6. madde (kareler + `denetci` ajanı ile doğruluk/kaynak kontrolü).
7. **Galeri:** `GUNLUK_GOREV.md` 7. madde; farklar: `KANAL=gta6 node galeri.mjs TARIH <tr_url> <en_url>`,
   `doc_id: "gta6-TARIH"`, `file_path: kanallar/gta6/cikti/TARIH/galeri-satir.json`.
8. `RAPOR.md` "Üretim günlüğü"ne: `- TARIH — [GTA 6] konu — durum`.
9. Commit (`GTA6 TARIH: <konu>`) ve `git push -u origin claude/affectionate-hawking-t8ex5a`. Push, YouTube/Instagram/TikTok
   paylaşımını GitHub Actions (`reels-paylas.yml`) ile tetikler. Reddedilirse `git pull --no-rebase` + tekrar; ağ hatasında 4 kez dene.
10. Kısa Türkçe özet: konu + galeri linki https://claude.ai/artifact/HLbVYda1atZmYiADcYyCeS

Kurallar: platformlara kendin yükleme yapma; hata olursa günlüğe `ENGEL` + neden yaz. Test atlama yok.

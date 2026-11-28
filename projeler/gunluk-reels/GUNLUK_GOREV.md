# Günlük Reels görevi (her gün 06:00, Europe/Istanbul)

Çalışma dizini: `projeler/gunluk-reels/`. Dal: `claude/affectionate-hawking-t8ex5a` (GTA 6 kanalıyla ortak dal).

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
   Kapanış cümlesi en fazla 4 kelime (3 sn). Ses Chatterbox ile üretilir ve Whisper ile metne karşı denetlenir.
4b. **Görseller (gerçekçi, resimli video):** her sahneye konuyla birebir eşleşen gerçek bir fotoğraf seç (6 adet: kanca, gerçek 1-3,
   grafik, kapanış). Ara: `node gorsel-ara.mjs "<İngilizce sorgu>" --n 10 --onizle /tmp/kolaj.jpg` (uzay/bilim için ayrıca
   `--kaynak nasa`). Kolaja bak (soldan sağa, satır satır `no` sırası), net ve dikeye kırpılınca anlamlı kalan, yazı/logo/
   filigran içermeyen fotoğrafları seç. Yalnızca serbest lisanslı (CC0, PD, CC BY, CC BY-SA) sonuçlar gelir.
   JSON'a ekle: `"gorseller": [6 url]`, `"gorselAtif": [6 atif satırı]` (araçtan aynen), `tr.gorselKaynak`/`en.gorselKaynak`
   ("Görseller: Flickr (CC BY)" / "Images: NASA" gibi kısa). Görsel varsa ortak `sablon-gorsel/` şablonu (tam ekran fotoğraf,
   Ken Burns, neon geçişler) kullanılır. Arama 429/401 verirse bir dakika sonra tekrar dene; yine olmazsa `--kaynak nasa`
   ya da farklı sorgu. İndirme hatası verirse o görseli değiştir.
5. `node --test` geçmeli. Sonra `node uret.mjs TARIH` (≈10 dk) → `cikti/TARIH/` altında sesli TR+EN mp4 ve `PAYLASIM.md`.
6. **Kontrol:** her videodan 0.5, 7, 19, 24.5, 28.5. saniyelerden kare çıkar (ffmpeg), bak: taşan/kesilen metin, okunmayan yazı varsa
   içeriği kısalt ve yeniden render et. Ardından `denetci` ajanına içerik doğruluğu + kaynak kontrolü yaptır, bulguları düzelt.
7. **Galeriye yükle (asıl teslim):** Artifact aracıyla `url: "https://claude.ai/artifact/HLbVYda1atZmYiADcYyCeS"`, `asset: true`,
   `file_paths: [cikti/TARIH/reels-TARIH-tr.mp4, cikti/TARIH/reels-TARIH-en.mp4]` (mutlak yol) ile iki videoyu yükle.
   Dönen iki `/_blob/...` url ile `node galeri.mjs TARIH <tr_url> <en_url>` çalıştır, sonra ArtifactData
   `action: "set"`, `collection: "videolar"`, `doc_id: TARIH`, `file_path: cikti/TARIH/galeri-satir.json` ile satırı yaz.
   Sayfanın kendisini yeniden yayımlama.
8. `RAPOR.md` sonundaki "Üretim günlüğü"ne tek satır ekle: `- TARIH — konu — durum`.
9. Commit (`Reels TARIH: <konu>`) ve `git push -u origin claude/affectionate-hawking-t8ex5a`. Bu push YouTube/Instagram/TikTok
   paylaşımını (GitHub Actions) tetikler; reddedilirse `git pull --no-rebase` sonra tekrar, ağ hatasında 4 kez dene.
   Yine olmazsa videolar galeride kalır; özetinde "sosyal medyaya paylaşılamadı" diye belirt.
10. Kullanıcıya kısa Türkçe özet: konu + galeri linki https://claude.ai/artifact/HLbVYda1atZmYiADcYyCeS

Kurallar: platformlara kendin yükleme yapma; paylaşımı push sonrası GitHub Actions yapar (bkz. KURULUM-PAYLASIM.md). Hata olursa günlüğe `ENGEL` + neden yaz ve bildir. Test atlama yok.

**Önceden üretilmiş gün:** O günün videosu (`cikti/TARIH/reels-TARIH-tr.mp4`) depoda zaten varsa yeniden üretme;
yalnızca paylaşımı tetikle: `mcp__github__actions_run_trigger` (gerekirse ToolSearch ile yükle) — owner `ibrhmsen94-collab`,
repo `collab`, method `run_workflow`, workflow_id `reels-paylas.yml`, ref `claude/affectionate-hawking-t8ex5a`,
inputs `{"tarih": "TARIH", "kanal": ""}`. Sonra bitir. (Push ile gelen gelecek tarihli videolar otomatik paylaşılmaz.)

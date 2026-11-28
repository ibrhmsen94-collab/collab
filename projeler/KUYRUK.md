# Proje kuyruğu

Yeni proje eklemek için aşağıdaki şablonu kopyala. Ajan `BEKLIYOR` olanları sırayla alır.

<!-- ŞABLON
## proje-adi
- Durum: BEKLIYOR
- Amaç: (tek cümle)
- Gereksinimler:
  - ...
- Teknoloji: (boş bırakılırsa ajan seçer)
- Bitti sayılır: (kabul ölçütü)
-->

## adet-takibi
- Durum: BITTI (mağaza yayını kullanıcıda; bkz. projeler/adet-takibi/YAYINLAMA.md)
- Amaç: Gizlilik öncelikli, Türkçe/İngilizce adet takibi mobil uygulaması (iOS + Android).
- Gereksinimler:
  - Güncel uygulamalar araştırılıp referans alınır (`projeler/adet-takibi/arastirma/`).
  - Döngü kaydı, takvim, tahmin (adet/doğurgan pencere), belirti-ruh hali günlüğü, hatırlatma, istatistik.
  - Veriler yalnızca cihazda; hesap zorunlu değil.
- Teknoloji: Expo (React Native) + TypeScript
- Bitti sayılır: testler geçer, web önizlemede uçtan uca akış çalışır, RAPOR.md yazılmıştır.

## gunluk-reels
- Durum: DEVAM (sürekli; her gün 06:00 zamanlanmış görev — bkz. projeler/gunluk-reels/GUNLUK_GOREV.md)
- Amaç: Her gün TR+EN bilgilendirici dikey video (YouTube Shorts, Instagram Reels, TikTok).
- Gereksinimler:
  - Modern, gösterişli grafik/animasyon; 30 sn, 1080×1920.
  - Doğrulanmış kaynaklı içerik; platform başına paylaşım metni.
- Teknoloji: HyperFrames (HTML→video) + Node
- Bitti sayılır: o günün iki videosu + PAYLASIM.md commit/push edilmiş, kullanıcıya bildirilmiş.

## ai-para-takip
- Durum: DEVAM (zamanlanmış görevlerle sürekli)
- Amaç: Yapay zekâ ile para kazanma fırsatlarını takip edip haftalık rapor ve günlük fırsat bildirimi üretmek.
- Çıktı: `projeler/ai-para-takip/raporlar/YYYY-MM-DD.md`, günlük notlar `projeler/ai-para-takip/haberler.md`.

## gta6-video
- Durum: DEVAM (sürekli; her gün 17:00 zamanlanmış görev — bkz. projeler/gunluk-reels/kanallar/gta6/GOREV.md)
- Amaç: Her gün TR+EN GTA 6 bilgilendirici dikey video (YouTube Shorts, Instagram Reels, TikTok), otomatik paylaşım.
- Teknoloji: gunluk-reels hattı, `KANAL=gta6` (veriler `projeler/gunluk-reels/kanallar/gta6/`).
- Bitti sayılır: o günün iki videosu galeride + push ile GitHub Actions paylaşımı tetiklenmiş.

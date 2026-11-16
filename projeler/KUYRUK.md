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

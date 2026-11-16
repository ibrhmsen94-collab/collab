# Döngüm — rapor

Gizlilik öncelikli adet takibi uygulaması. Expo SDK 58, React Native 0.88, TypeScript. Türkçe/İngilizce.

## Yapılanlar
- Karşılama, Bugün, Takvim, Günlük kayıt, İstatistik, Ayarlar ekranları.
- Tahmin: son 6 döngünün yakın tarihe ağırlıklı ortalaması, ± gün belirsizlik ve güven düzeyi; aykırı döngüler ortalamadan dışlanır ama uyarı üretir.
- Yerel hatırlatmalar (gizli metin seçeneği), uygulama kilidi, dosya olarak yedek, onaylı içe aktarma, tüm veriyi silme.
- Veriler yalnızca cihazda (AsyncStorage); ağ isteği, hesap, analitik yok.

## Doğrulama
- `npm test`: 35 birim testi geçiyor. `npm run typecheck`: hatasız.
- `node e2e/smoke.js`: web derlemesinde uçtan uca akış geçiyor (ekran görüntüleri `ekran-goruntuleri/`).
- Gerçek iOS/Android cihazda denenmedi.

## Varsayımlar
- Doğurgan pencere varsayılan olarak kapalı; açılınca "korunma için kullanılamaz" uyarısıyla gösterilir.
- Lekelenme adet günü sayılmaz ama adeti bölmez.
- Normal aralıklar: döngü 21–35 gün, kanama ≤ 8 gün, döngüler arası fark ≤ 9 gün (FIGO/NHS).

## Denetim
Denetçi ajanının 15 bulgusu uygulandı. Uygulanmayan: Face ID izin metninin İngilizce yerelleştirmesi.

Açma ve mağazaya yükleme adımları: `YAYINLAMA.md`.

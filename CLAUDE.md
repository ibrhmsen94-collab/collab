# Ofis kuralları
- Dil: Türkçe. Kısa yanıt, gereksiz açıklama yok.
- İş kuyruğu: `projeler/KUYRUK.md`. Her proje bir başlık; durum: `BEKLIYOR` → `DEVAM` → `BITTI` / `ENGEL`.
- Her projenin çıktısı `projeler/<proje-adi>/` altında; kısa rapor `projeler/<proje-adi>/RAPOR.md`.
- Akış: `gelistirici` ajanı uygular → `denetci` ajanı inceler → düzeltme → commit.
- Kuyruk boşsa hiçbir şey yapma, hemen bitir (token tasarrufu).
- Silme, yayınlama, ücretli/dış servis gerektiren adımlarda dur, `ENGEL` yaz ve nedenini belirt.
- Test atlama/devre dışı bırakma yok; başarısız test raporlanır.

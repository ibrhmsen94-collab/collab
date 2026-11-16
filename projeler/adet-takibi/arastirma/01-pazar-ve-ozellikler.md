# Adet Takibi Uygulamaları: Pazar ve Özellik Araştırması

Tarih: 16 Kasım 2026

## 0. Yöntem ve güvenilirlik notu

- Bu rapor yalnızca web araması sonuçlarına dayanır. Oturumun ağ kısıtı nedeniyle sayfalar doğrudan açılamadı (apps.apple.com, mozillafoundation.org, bearable.app, unstar.app, captaincompliance.com erişime kapalıydı). Yani aşağıdaki veriler arama motorunun sayfa özetlerinden alındı; birincil sayfalar satır satır okunmadı.
- Mağaza puanları, fiyatlar ve Türkiye fiyatları bölgeye ve tarihe göre değişir. Karar öncesi canlı mağaza sayfasından teyit edilmeli.
- Kaynak kalitesi etiketleri: **[R]** resmi/birincil (şirket sitesi, destek sayfası, basın bülteni), **[B]** bağımsız basın/akademik/STK, **[Ü]** üçüncü taraf blog, toplayıcı veya rakip uygulamanın pazarlama sayfası (düşük güven).
- "Doğrulanamadı" yazan her şey gerçekten bulunamadı; tahmin yürütülmedi.

---

## 1. Pazarın genel görünümü

| Konu | Bulgu | Kaynak |
|---|---|---|
| Pazar büyüklüğü | "Adet sağlığı uygulamaları" 2025'te yaklaşık 2,0-2,1 milyar USD, 2026 tahmini yaklaşık 2,5 milyar USD, YBBO %18-20. Dar "period tracker" tanımlarında büyüme %5-10. Raporlar tanım farkı yüzünden birbirini tutmuyor. | [B/Ü] https://www.towardshealthcare.com/insights/menstrual-health-apps-market-sizing , https://www.fortunebusinessinsights.com/menstrual-health-apps-market-118738 |
| Lider | Flo: aylık 80 milyon+ aktif kullanıcı, 420 milyon indirme. | [R] https://www.morningstar.com/news/pr-newswire/20261012ph69455/flo-health-and-google-health-join-forces-to-put-womens-health-at-the-center-of-wearable-tracking-and-personalized-coaching |
| Platform baskısı | Apple iOS 27 ile Döngü Takibi'ne perimenopoz/menopoz ekledi (WWDC, 8 Haziran 2026). Google Health, Flo'ya stratejik yatırım yaptı (12 Ekim 2026). | [B] https://www.macrumors.com/2026/06/08/ios-27-adds-perimenopause-and-menopause-tracking/ |
| Gizlilik gündemi | Mozilla 16 Temmuz 2026'da altı uygulamayı test etti: Euki 10/10, Clue 8/10, Flo 7/10, Period Calendar 6/10, Spot On 5/10, Stardust 2/10. | [B] https://ppc.land/mozilla-rates-stardust-2-of-10-over-symptom-data-sent-to-third-parties/ , https://dhinsights.org/news/mozilla-report-reveals-wide-privacy-gaps-among-popular-period-tracking-apps |
| Hukuki risk | ABD'de jüri, Flo kullanıcılarının sağlık verisini topladığı için Meta'yı CIPA ihlalinden sorumlu buldu (Ağustos 2025). Flo, Google ve bir analitik firması karardan önce uzlaştı. | [B] https://www.cnbc.com/2025/08/07/jury-rules-meta-violated-law-in-period-tracking-app-data-case.html , https://therecord.media/jury-verdict-meta-flo-app-data-privacy-case |
| Yatırım | Clue, Ocak 2026'da Verdane'den "bugüne kadarki en büyük" yatırımını aldı (tutar açıklanmadı). | [B] https://femtechinsider.com/clue-receives-major-investment-from-verdane-to-accelerate-growth/ |
| Trend | Perimenopoz 2025-2026'nın en kalabalık yeni özellik alanı: Flo (Mayıs 2026), Clue, Natural Cycles (Ekim 2025), Oura (Mayıs 2026), Apple (iOS 27) hepsi mod/özellik çıkardı. | Aşağıdaki uygulama bölümleri |

---

## 2. Uygulama incelemeleri

### 2.1 Flo

| Başlık | Bulgu |
|---|---|
| Çekirdek | Regl ve yumurtlama tahmini, belirti kaydı, döngü geçmişi, hamilelik modu, perimenopoz, içerik/kurslar, sohbet asistanı, partner uygulaması. |
| Kayıt türleri | Kanama, belirtiler, ruh hali, cinsel aktivite/istek, akıntı vb. Tam kategori listesi bu araştırmada birincil kaynaktan **doğrulanamadı**. |
| Tahmin | Şirket "yapay zeka tabanlı" tahmin diyor; Ekim 2026 itibarıyla Fitbit biyometrik verisi tahminlere ekleniyor. [B] https://insider.fitt.co/?p=35239 |
| Onboarding | Çok uzun anket + sonunda ödeme duvarı. Bağımsız bir Mart 2026 incelemesi yaklaşık 12 dakika ölçtü. Flo bunu bilinçli büyüme deneyi olarak yürütüyor (bir adım iki kez %10 kaybettirdi, sonra %23 kazandırdı). [Ü] https://florentine-carob-c8a.notion.site/Scale-vs-Sentiment-A-2026-Strategic-Teardown-of-Flo-Health-3303f51528b2803c9e0ce3cb5f4ebc63 , [B] https://www.revenuecat.com/blog/growth/mike-charniatsou-flo-sub-club-podcast-2026.md |
| Ana ekran | Ortada büyük daire içinde "regle X gün" geri sayımı, altında hızlı belirti kaydı, sağ üstte takvim ikonu. Eleştiri: büyük pembe daire yer kaplıyor, bilgi yoğunluğu düşük. [Ü] https://ixd.prattsi.org/2025/09/design-critique-flo-ios-app/ , https://screensdesign.com/showcase/flo-period-pregnancy-tracker |
| Partner | Flo for Partners (Ekim 2023). Ücretsiz mi ücretli mi: **doğrulanamadı**. [B] https://en.wikipedia.org/wiki/Flo_(app) |
| Modlar | Hamilelik var. Flo for Perimenopause paketi Mayıs 2026'da yalnızca Premium kullanıcılara açıldı. [R] https://www.businesswire.com/news/home/20260514181897/en/The-Perimenopause-Conversation-Has-Arrived.-But-Clarity-Has-Not.-Flo-Health-Aims-to-Change-That |
| AI | "Ask Flo" / Health Assistant: Databricks üzerinde ince ayarlı LLM tabanlı sağlık asistanı (Haziran 2025 haberi). Bazı kullanıcı yorumları sohbetin kaldırıldığını veya paywall arkasına alındığını söylüyor; güncel durum **doğrulanamadı**. [B] https://www.digitalhealth.net/2025/06/flo-health-adopts-databricks-platform-to-power-analytics-and-ai , [R] https://help.flo.health/hc/en-us/articles/360052676191 |
| Giyilebilir | Google Health/Fitbit ile çok yıllı ortaklık, rıza temelli veri entegrasyonu (Ekim 2026). |
| Fiyat | ABD için kaynaklar çelişiyor: 39,99 USD/yıl ile 9,99 USD/ay (119,88 USD/yıl) arası rakamlar var. Flo çok sayıda fiyat kademesiyle test yapıyor. Türkiye TL fiyatı **doğrulanamadı**. [Ü] https://subger.com/tr/il/service/flo-health , https://apppricinglab.com/iap/apple/1038369065 |
| Ücretsiz | Regl/yumurtlama takibi ve tahmini, belirti kaydı, döngü geçmişi, Anonim Mod. [B] https://en.wikipedia.org/wiki/Flo_(app) |
| Gizlilik | Anonim Mod (Eylül 2022): ad, e-posta, IP sağlık verisine bağlanmaz; geçişte eski hesap silinir, cihaz kaybında veri kurtarılamaz. Mozilla 2026: 7/10, sağlık verisini reklam/analitik ortaklarıyla paylaşmıyor. Geçmiş: 2021 FTC anlaşması, 2025'te toplu davada 8 milyon USD uzlaşma. [R] https://flo.health/privacy-portal/anonymous-mode-faq , [B] https://www.hipaajournal.com/jury-trial-meta-flo-health-consumer-privacy/ |
| Puan | iOS+Android birleşik yaklaşık 4,72/5, 6,7 milyon yorum (Nisan 2026, toplayıcı). [Ü] https://marlvel.ai/api/llm/apps/health-fitness/flo-cycle-period-tracker |
| Övgü | En geniş özellik seti, içerik zenginliği, tahmin. |
| Şikayet | Paywall en büyük şikayet (bir analizde yorumların %49'u, bir diğerinde 1 yıldızlı yorumların %24'ü; yöntemler farklı, rakamlar birleştirilmemeli), "eskiden ücretsizdi" hissi, bitmeyen onboarding. [Ü] https://ayla-research.riajul.dev/ , https://unstar.app/blog/is-flo-legit-safe-period-tracker-app-reviews-2026 , [B] https://ie.trustpilot.com/review/flo.health?page=8 |
| Türkçe | App Store TR sayfası Türkçe ("Flo - Adet Takvimi, Yumurtlama"). Bir Türkçe kaynak sağlık yazılarının Türkçe olmadığını söylüyor (eski olabilir). [R] https://apps.apple.com/tr/app/flo-adet-takvimi-yumurtlama/id1038369065?l=tr |

### 2.2 Clue

| Başlık | Bulgu |
|---|---|
| Çekirdek | Bilim odaklı takip, 100+ "deneyim" kategorisi (duygular, PMS, istek, ağrı, cinsel istek, doğum kontrol yöntemi/hap vb.). [R] https://apps.apple.com/us/app/clue-period-cycle-tracker/id657189652 |
| Kayıt türleri | Kanama, ağrı, ruh hali, cinsel yaşam, doğum kontrolü kesin. BBT cihaz entegrasyonuyla geliyor. Akıntı/servikal mukus kategorisi bu aramada **doğrulanamadı**. |
| Tahmin | Ücretsizde "temel tahmin", Plus'ta gelişmiş tahmin ve örüntü analizi. [R] https://helloclue.com/clue-plus |
| Onboarding | Ayrıntı **doğrulanamadı**. Ücretsiz hesap oluşturuluyor. |
| Ana ekran | Dairesel "döngü görünümü" (cycle wheel): döngü günü, yaklaşan regl ve evreler tek bakışta; alternatif olarak takvim görünümü. Kayıt ekranındaki seçenek bolluğu yeni kullanıcıyı bunaltabiliyor. [Ü] https://screensdesign.com/showcase/clue-period-cycle-tracker |
| Partner | Clue Connect: partner, arkadaş veya aile ile paylaşım; alıcının ücretsiz Clue hesabı gerekir; Plus'a dahil. [R] https://support.helloclue.com/hc/en-us/articles/29048806152605-Premium-features-with-Clue-Plus , [Ü] https://thelowdown.com/blog/is-clue-plus-worth-it |
| Modlar | Conceive, Pregnancy, Perimenopause; hepsi Plus. Mod değişimi geçmiş veriyi taşımayı gerektirmiyor. [R] https://helloclue.com/articles/menopause/introducing-clue-perimenopause |
| AI | Tarihli bir AI özellik duyurusu **bulunamadı**. Yol haritasında "algoritmik içgörüler" ve giyilebilir veri var. |
| Giyilebilir | Oura (sıcaklık trendi, uyku, nabız), Plus gerektirir, iOS ve Android. [R] https://helloclue.com/landing/wearables/clue-plus-offer/oura |
| Fiyat | Yaklaşık 39,99 USD/yıl; aylık için 9 EUR ile 14,99 USD arası çelişkili rakamlar. [Ü] https://thevibecheck.app/blog/relationship-advice/clue-subscription-price-guide , https://horiva.pages.dev/compare/pricing/clue-pricing |
| Gizlilik | Berlin merkezli, GDPR kapsamında, "sağlık verisi satılmaz" beyanı. Mozilla 2026: 8/10; eleştiri: çok veri topluyor ve dış servisler cihazda Clue çalıştığını anlayabiliyor. Hesap zorunlu görünüyor. |
| Puan | Google Play yaklaşık 4,5 (1,4-1,5 milyon yorum, 50 milyon+ kurulum). App Store puanı **doğrulanamadı**. [Ü] https://appgoblin.info/apps/com.clue.android |
| Övgü | Cinsiyetsiz/sade tasarım, bilimsel ton, döngü çemberi. |
| Şikayet | Sürekli abonelik pop-up'ları, Plus'a taşınan özellikler. [R] https://play.google.com/store/apps/details?id=com.clue.android&hl=en_US |
| Türkçe | Var. 20'den fazla dil arasında Türkçe listeleniyor. [R] https://support.helloclue.com/hc/en-us/articles/4404372946580-How-can-I-change-the-language-in-the-app |

### 2.3 Natural Cycles

| Başlık | Bulgu |
|---|---|
| Çekirdek | FDA onaylı dijital doğum kontrolü. Sıcaklık temelli "Yeşil/Kırmızı gün" kararı. |
| Kayıt türleri | Sıcaklık (zorunlu çekirdek), regl, LH testi, belirtiler. Tam liste **doğrulanamadı**. |
| Tahmin | Sıcaklık + algoritma. Temmuz 2026'da yeni nesil algoritma için altıncı FDA 510(k) onayı. [R] https://www.streetinsider.com/PRNewswire/Natural+Cycles+Receives+Sixth+FDA+Clearance+for+Next-Generation+Fertility+Algorithm/26816411.html |
| Modlar | Beş mod: Birth Control, Plan Pregnancy, Follow Pregnancy, Postpartum, Perimenopause (Ekim 2025). Perimenopoz modunun FDA kapsamında olduğu **doğrulanamadı**. [R] https://www.naturalcycles.com/faqs |
| Partner | Partner View: doğurganlık durumu ve seçili bilgiler. [Ü] https://neura.health/insight/which-is-the-best-cycle-tracking-app |
| Giyilebilir | NC Band (129,99 USD; yıllık plana dahil), Oura Ring 2/3/4, Apple Watch Series 8+ / Ultra / SE3, Samsung (Galaxy Watch/Ring döngü özelliğinin altyapısı), Ağustos 2026'dan beri WHOOP. [R] https://www.naturalcycles.com/devices/nc-band , https://help.naturalcycles.com/hc/en-us/articles/13528212980893-How-does-Apple-Watch-work-with-Natural-Cycles |
| Fiyat | 21,99 USD/ay, 149-149,99 USD/yıl (Ekim 2026 teyitli). Ücretsiz katman yok. [R] https://apps.apple.com/us/app/natural-cycles-fertility-app/id765535549 |
| Gizlilik | Bu aramada ayrıntı **doğrulanamadı**. |
| Puan | Trustpilot 4,2/5 (1.740+ yorum). App Store puanı **doğrulanamadı**. |
| Şikayet | Fiyat artışı (İngiltere'de 30 GBP'den 89,99 GBP'ye), habersiz yenileme, iade reddi, düzensiz döngüde çok fazla kırmızı gün. [B] https://uk.trustpilot.com/review/www.naturalcycles.com?page=4 , https://www.bbb.org/us/ny/new-york/profile/internet-service/natural-cycles-0121-87142383/complaints |

### 2.4 Stardust

| Başlık | Bulgu |
|---|---|
| Çekirdek | Regl + astroloji/ay evreleri, "hormon içgörüleri", doğurganlık, hamilelik modu, Partner Mode. [R] https://stardust.app/faq |
| Ton | Esprili, sosyal, Z kuşağına dönük. Premium: doğum haritası + döngü evresi burçları, günlük tarot. |
| Partner | Partner Mode; partner SMS davetiyle katılır, kendi döngüsü olması gerekmez. |
| Fiyat | Çelişkili: 2,99 USD/hafta veya 24,99 USD/yıl; başka kaynak 7,99 USD/ay, 69,99 USD/yıl. Ücretsiz katman var. [Ü] https://www.go-go-gaia.com/blog/flo-vs-stardust.html |
| Gizlilik | En zayıf halka. 2022'de "uçtan uca şifreleme" iddiası TechCrunch tarafından çürütüldü ve politikadan çıkarıldı. Mozilla 2026: 2/10; uygulama açılır açılmaz üçüncü taraf izleyicilere veri gönderiyor. Privacy International: ad-soyad dahil analitik firmalarla paylaşım. [B] https://ppc.land/mozilla-rates-stardust-2-of-10-over-symptom-data-sent-to-third-parties/ , https://allaboutcookies.org/stardust-shared-users-health-data |
| Puan | App Store 4,8/5, yaklaşık 119 bin puan (Ekim 2026). [Ü] https://www.go-go-gaia.com/blog/flo-vs-clue-vs-stardust.html |
| Ders | Kişilik ve eğlence yüksek puan getiriyor; gizlilik pazarlaması teknik olarak doğrulanabilir olmalı. |

### 2.5 Apple Health Döngü Takibi

| Başlık | Bulgu |
|---|---|
| Kayıt türleri | Regl ve akış düzeyi, lekelenme, belirtiler, BBT, servikal mukus, yumurtlama testi, progesteron testi, gebelik testi, cinsel aktivite, etkenler (gebelik, emzirme, doğum kontrolü). [R] https://support.apple.com/120356 |
| Tahmin | Tahmine yalnızca döngü/regl uzunluğu, akış, yumurtlama testi, nabız ve bilek sıcaklığı girer. Belirti, mukus, BBT, cinsel aktivite tahmini etkilemez. Series 8+ ile geriye dönük yumurtlama tahmini. [R] https://www.apple.com/legal/ifu/cycle-tracking/ct-ifu-en_US.pdf |
| Bildirim | Regl ve doğurgan pencere tahmini, döngü sapması tespiti. |
| Perimenopoz | iOS 27: perimenopoz/menopoz evresi kaydı, sıcak basması ve gece terlemesi belirtileri, 40 yaş üstüne sapma bildirimi, eğitim içeriği. Yeni "Insights" sekmesi. [B] https://www.macrumors.com/2026/06/08/ios-27-adds-perimenopause-and-menopause-tracking/ , https://www.igeeksblog.com/apple-health-menopause-tracking/ |
| Partner | Döngüye özel partner paylaşımı bu aramada **doğrulanamadı** (genel Sağlık Paylaşımı özelliği kaynakla teyit edilmedi). |
| Fiyat | Ücretsiz, sistemle gelir (kaynakla ayrıca teyit edilmedi, genel bilgi). |
| Gizlilik | Cihaz üstü/şifreli Sağlık verisi (ayrıntı bu aramada teyit edilmedi). |
| Sınır | Doğum kontrolü için uygun değil. Yalnız Apple ekosistemi. |

### 2.6 Samsung Health

| Başlık | Bulgu |
|---|---|
| Çekirdek | Regl, doğurgan pencere ve yumurtlama tahmini; belirti, fiziksel durum, ruh hali günlüğü; cinsel aktivite kaydı. Akıntı ve yumurtlama testi kaydı **doğrulanamadı**. [R] https://www.samsung.com/ca/support/apps-services/track-your-menstrual-cycle-with-samsung-health/ |
| Tahmin | Natural Cycles altyapısı; Galaxy Ring, Watch7, Watch Ultra gece cilt sıcaklığını kullanır. Cihaz zorunlu değil. |
| Partner | Paylaşım yok (eski Samsung destek sayfası; güncel sayfada da geçmiyor). [R] https://www.samsung.com/sg/support/apps-services/samsung-health-cycle-tracking/ |
| Sınır | Yalnız Android. 2026'ya özel yeni döngü özelliği duyurusu bulunamadı. |
| Fiyat | Ücretsiz. |

### 2.7 Glow / Eve

| Başlık | Bulgu |
|---|---|
| Çekirdek | Glow: doğurganlık odaklı; BBT, servikal mukus, ruh hali kaydı, topluluk forumları, partner paylaşımı. Eve: daha genç/cinsel sağlık tonunda regl takibi. [R] https://glowing.com/resources/getting-pregnant/best-fertility-trackers |
| Fiyat | Glow Premium 15,99 USD/ay, 59,99 USD/yıl; uygulama içi satın almalar 29,99-59,99 USD. [Ü] https://apppricinglab.com/app/apple/1002275138 |
| Gizlilik | Mozilla 2022'de "Super creepy" etiketi; Glow ailesi tek gizlilik politikası kullanıyor. 2026 testinde yer alıp almadığı **doğrulanamadı**. [B] https://www.mozillafoundation.org/en/privacynotincluded/glow-eve-by-glow/ |
| Puan | Eve: App Store 4,7, yaklaşık 113,8 bin yorum. |
| Şikayet | En "spam" hissi veren uygulama, sık Premium teklifi. [Ü] https://motherfigure.com/mag/review-the-best-free-fertility-tracker-apps/ |

### 2.8 Ovia

| Başlık | Bulgu |
|---|---|
| Çekirdek | Doğurgan pencere tahmini, günlük 1-10 doğurganlık skoru, belirti/ruh hali/cinsel aktivite/beslenme, BBT, servikal sıvı ve pozisyon, ilaç kaydı. |
| Yapı | 2025'te "Ovia Health by Labcorp" oldu; hamilelik uygulaması ana uygulamaya birleştirildi. Menopoz ve doğum sonrası içerikleri var. [R] https://www.oviahealth.com/?p=329566 |
| Gelir modeli | B2B2C: işveren/sağlık planı üzerinden "Ovia+". Tüketici için uygulama içi satın alma listelenmiyor. [B] https://www.utsystem.edu/sites/default/files/documents/publication/2026/ut-select-ovia-health-overview/ovia-health.pdf |
| Gizlilik | PIN var. App Store etiketinde kimliğe bağlı sağlık, hassas bilgi ve konum verisi. 2019'da veri paylaşımı eleştirisi. |
| Puan | **Doğrulanamadı**. |

### 2.9 Period Tracker by GP Apps

| Başlık | Bulgu |
|---|---|
| Çekirdek | Tek dokunuşla regl başlangıcı, aylık takvim, ruh hali, belirti, kilo, sıcaklık, notlar. Hamile kalma modu ve doğuma geri sayım. |
| Tahmin | Son üç ayın döngü ortalaması (en basit yöntem). |
| Ek | Touch ID/parola kilidi, doktor için e-postayla dışa aktarım. |
| Fiyat | Ücretsiz + üyelik; ayrı "Period Tracker Deluxe" 9,99 USD tek seferlik. |
| Puan | App Store 4,8, 73 bin puan; Google Play 4,8, yaklaşık 72 bin yorum. [R] https://apps.apple.com/us/app/id330376830 |
| Gizlilik | "İzleme için kullanılan veri" kategorisi listeleniyor. |
| Övgü/şikayet | Sadelik ve görünüm övülüyor; yeniden tasarımlar ve yanlış tahmin şikayet ediliyor. [Ü] https://justuseapp.com/en/app/330376830/period-tracker-by-gp-apps/reviews |

### 2.10 My Calendar (SimpleInnovation)

| Başlık | Bulgu |
|---|---|
| Çekirdek | Döngü/regl tahmini, belirti ve ruh hali, doğurganlık penceresi, hatırlatıcılar, doğurganlık bilgisini gizleyen mod. |
| Gizlilik | Bir Play listesine göre hesapsız, cihaz üstü veri, isteğe bağlı PIN; e-postayla yedek. Aynı adla birden çok geliştirici var, dikkat. [R] https://play.google.com/store/apps/details?id=periodtracker.mycalendar.cycle.menstrual&hl=en_US |
| Fiyat | Ücretsiz (az reklamlı) + reklamsız premium. Rakam **doğrulanamadı**. |
| Puan | **Doğrulanamadı**. |

### 2.11 Maya (Sheroes)

| Başlık | Bulgu |
|---|---|
| Çekirdek | Regl, belirti, ruh hali, doğurganlık tahmini, hatırlatıcılar, hamilelik takibi, topluluk, cihazlar arası yedek, parola/biyometrik kilit. |
| Dil | 14 dil; Türkçe listede yok. [R] https://apps.apple.com/app/id492534636 |
| Gizlilik | 2019'da Privacy International: rıza alınmadan Facebook'a veri. Sonradan SDK'lar kaldırıldı, reklam SDK'sı kaldı. [B] https://privacyinternational.org/long-read/5564/maya-research-findings |
| Puan | Yaklaşık 4,5-4,8. |

### 2.12 drip (açık kaynak)

| Başlık | Bulgu |
|---|---|
| Çekirdek | Kanama, doğurganlık, cinsel yaşam, ruh hali, ağrı; semptotermal yöntem (BBT + servikal mukus veya serviks, ayarlardan seçilir). Grafikler. [R] https://dripapp.org/faq.html |
| Tahmin | Regl tahmini var; yalnız kanama verisinden doğurganlık varsayımı yapmaz. |
| Bildirim | Sonraki regl ve sıcaklık ölçümü hatırlatması. |
| Gizlilik | Tamamen cihaz üstü, hesap yok, reklam yok, parola koruması, içe/dışa aktarım. |
| Fiyat | Ücretsiz, tüm özellikler açık. iOS ve Android. [R] https://dripapp.org/ |
| Sınır | Küçük ekip, sınırlı cila; partner, giyilebilir, mod yok. |

### 2.13 Euki

| Başlık | Bulgu |
|---|---|
| Çekirdek | Regl takibi + cinsel sağlık bilgisi, doğum kontrol yöntemi testi, kürtaj ve düşük desteği. |
| Gizlilik | Sektörün en iyisi: veri toplanmaz, her şey cihazda; PIN (e-posta/telefona bağlı değil), zorla açtırma durumunda sahte ekran, anında silme veya haftalık otomatik silme. Mozilla 2026: 10/10. Zayıflık: korumalar varsayılan kapalı; PIN unutulursa veri kaybolur. [B] https://www.mozillafoundation.org/en/nothing-personal/euki-privacy-review/ |
| Dil | İngilizce ve İspanyolca. Ücretsiz. iOS ve Android. |

### 2.14 Periodical

| Başlık | Bulgu |
|---|---|
| Çekirdek | Minimal adet takvimi, Knaus-Ogino ile doğurgan gün hesabı, belirti kaydı, yerel yedek. Android. |
| Lisans | GPL-3.0; F-Droid sürüm 1.96 (20 Nisan 2026). [R] https://f-droid.org/en/packages/de.arnowelzel.android.periodical |
| Puan | Google Play 4,5, 166 puan, yaklaşık 25,6 bin kurulum. |

### 2.15 Bellabeat

| Başlık | Bulgu |
|---|---|
| Çekirdek | Ivy/Leaf giyilebilirleri + Wellness Coach; Period Diary: döngü ve regl süresi, ruh hali, belirti, sıcaklık, not. |
| Fiyat | Bellabeat+ 9,99 USD/ay, 99,99 USD/yıl. [R] https://apps.apple.com/us/app/-/id1005052173 |
| Gizlilik | 2022'de "Private Key Encryption (AES-256)": sunucudaki veri kullanıcı anahtarı olmadan okunamaz; güncel listede "isteğe bağlı". [R] https://prnewswire.com/news-releases/bellabeat-implements-private-key-encryption-aes-256-security-feature-for-mobile-app-to-protect-womens-reproductive-information-in-wake-of-roe-v-wade-overturn-301575736.html |
| Şikayet | Döngü uzunluğu yalnızca 15-40 gün seçilebiliyor; 60-90 günlük döngüsü olanlar dışlanıyor. 2026 kaynağı bulunamadı. |

### 2.16 Oura

| Başlık | Bulgu |
|---|---|
| Çekirdek | Cycle Insights + Fertile Window, Pregnancy Insights, Perimenopause Check-In, 12 aylık regl/doğurgan pencere tahmini (Kasım 2025 güncellemesi). [R] https://ouraring.com/blog/oura-cycle-insights-update/ |
| 2026 | 1 Mayıs 2026: hormonal doğum kontrolü desteği ve Menopause Insights (Menopause Impact Scale anketi). Hormonal kontrasepsiyonda doğurgan pencere gösterilmez. [R] https://ouraring.com/blog/hormonal-health-features/ |
| Doğruluk | Oura kendi çalışmasında yumurtlamayı döngülerin %96,4'ünde tespit ettiğini söylüyor; bağımsız bir inceleme klinik doğrulama eksikliğine işaret ediyor. |
| Entegrasyon | Natural Cycles, Clue. |
| Fiyat | Üyelik 5,99 USD/ay veya 69,99 USD/yıl + yüzük. [Ü] https://dupple.com/blog/whoop-vs-oura-2026 |

### 2.17 WHOOP

| Başlık | Bulgu |
|---|---|
| Çekirdek | Menstrual Cycle Insights: nabız, HRV, cilt sıcaklığı, solunum + kaydedilen regller ile regl tahmini, evre tahmini; uyku, yüklenme ve stres koçluğunu evreye göre ayarlar. [R] https://www.whoop.com/us/en/thelocker/whoop-feature-menstrual-cycle-coaching/ |
| 2026 | Mart 2026: Hormonal Symptom Insights and Predictions (dinamik tarih aralığı, belirti örüntüleri). Kadın sağlığı kan paneli (döngü evresine özel referans aralıkları, perimenopoz). Ağustos 2026: Natural Cycles entegrasyonu. [R] https://www.whoop.com/us/en/thelocker/2026-whats-new/ |
| Sınır | Yumurtlama dedektörü değil; gebe kalma/korunma için kullanılmamalı. Hormonal doğum kontrolü desteği dar. |
| Fiyat | Yıllık 199 / 239 / 359 USD (One / Peak / Life). [Ü] https://trackervs.com/pricing/whoop-pricing/ |

### 2.18 Türkiye pazarı

| Uygulama | Bulgu | Kaynak |
|---|---|---|
| Pepapp | Yerli; arayüz tamamen Türkçe. Regl, PMS, yumurtlama tahmini, hatırlatıcılar, hamilelik takibi, Apple Sağlık eşleşmesi, "Pepzine" içerik alanı (aşı takvimi, doğurganlık, menopoz). Geliştirici beyanı: 12 milyon+ indirme (bağımsız teyit yok). Premium: reklamsız + kişiselleştirilmiş içerik. Fiyatlar çelişkili: haftalık 29,99-99,99 TL, aylık 149,99 TL, yıllık 599,99 TL. | [R] https://apps.apple.com/tr/app/pepapp-adet-takvimi/id1130242486?l=tr |
| Period Calendar / "Adet Takibi - Regl Takvimi" (Simple Design) | Play'de 4,9 puan, 4,9 milyon yorum; reklam destekli. Geliştirici beyanı: 43 ülkede Sağlık kategorisinde 1 numara. Mozilla 2026: 6/10, Google ve InMobi'ye cihaz kimliği gönderiyor. | [R] https://play.google.com/store/apps/details?id=com.popularapp.periodcalendar&hl=en_US |
| Flo | Türkçe mağaza sayfası ve arayüz var. | [R] https://apps.apple.com/tr/app/flo-adet-takvimi-yumurtlama/id1038369065?l=tr |
| Clue | Türkçe destekli. | [R] https://support.helloclue.com/hc/en-us/articles/4404372946580-How-can-I-change-the-language-in-the-app |
| Diğer yerel | Elika, "Regl Takvimi - Adet Takibi" (Medyajans), "Adet takvimi-Gebelik hesaplama". İndirme/puan verileri **doğrulanamadı**. | [R] https://play.google.com/store/apps/details?id=app.elika.woman&hl=en_US |
| Türkçe desteği olmayanlar | Euki (EN/ES), Maya (14 dil, TR yok). Stardust, Natural Cycles, drip için Türkçe durumu **doğrulanamadı**. | |
| Güncel TR sıralaması | Türkiye mağaza üst sıralama listesi **doğrulanamadı** (Sensor Tower/AppMagic gerekir). Türkçe içerikli liste yazıları çoğunlukla 2024 ve öncesi. | [Ü] https://www.webtekno.com/adet-regl-takvimi-uygulamalari-android-iphone-h101938.html |
| Mevzuat | Sağlık verisi KVKK'da özel nitelikli veridir. 7499 sayılı Kanun (12 Mart 2024) m.6 ve m.9'u değiştirdi; yurt dışı aktarımda yeterlilik kararı / uygun güvence / arızi aktarım kademeleri var. Hukuki teyit şart. | [B] https://www.erdem-erdem.av.tr/bilgi-bankasi/kisisel-verilerin-korunmasi-kanununda-neler-degisti |

---

## 3. Sentez

### 3.1 Özellik karşılaştırma tablosu

Gösterim: ✓ var, P ücretli katmanda, C cihaz gerekir, - yok, ? doğrulanamadı.

| Uygulama | Akış yoğ. | Belirti/ruh hali | BBT | Servikal mukus | Hap/ilaç | Cinsel akt. | Partner | Hamilelik | Perimenopoz | AI asistan | Giyilebilir | Hesapsız/yerel | Türkçe | Ücretsiz çekirdek | Yıllık fiyat (USD) |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Flo | ✓ | ✓ | ? | ? | ? | ✓ | ✓ (ücret ?) | ✓ | P | ✓ (ücret ?) | Fitbit/Google | Anonim Mod | ✓ | ✓ | 40-120 (çelişkili) |
| Clue | ✓ | ✓ | P/C | ? | ✓ | ✓ | P | P | P | - | Oura (P) | - | ✓ | ✓ (temel) | ~40 |
| Natural Cycles | ✓ | ✓ | ✓ (çekirdek) | ? | ? | ✓ | ✓ | ✓ | ✓ | - | Band, Oura, Apple Watch, Samsung, WHOOP | - | ? | - | 149 |
| Stardust | ✓ | ✓ | ? | ? | ? | ? | ✓ | ✓ | ? | ? | ? | - | ? | ✓ | 25-70 (çelişkili) |
| Apple Health | ✓ | ✓ | ✓ | ✓ | etken olarak | ✓ | ? | etken olarak | ✓ (iOS 27) | - | Apple Watch | ✓ | ✓ (sistem dili) | ✓ | 0 |
| Samsung Health | ✓ | ✓ | C | ? | ? | ✓ | - | ? | ? | - | Galaxy Watch/Ring | ? | ✓ (sistem dili) | ✓ | 0 |
| Glow/Eve | ✓ | ✓ | ✓ | ✓ | ? | ✓ | ✓ | ✓ (ayrı uyg.) | ? | ? | ? | - | ? | ✓ (reklam/upsell) | 60 |
| Ovia | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ? | ✓ | içerik | - | ? | - | ? | ✓ | 0 (B2B2C) |
| GP Period Tracker | ✓ | ✓ | ✓ | ? | ? | ? | - | ✓ | - | - | - | ? | ? | ✓ | ? / Deluxe 9,99 tek sefer |
| My Calendar | ✓ | ✓ | ? | ? | ? | ? | - | ? | - | - | - | ✓ | ? | ✓ (reklam) | ? |
| Maya | ✓ | ✓ | ? | ? | ? | ? | - | ✓ | - | - | - | - | - | ✓ | ? |
| drip | ✓ | ✓ | ✓ | ✓ | ? | ✓ | - | - | - | - | - | ✓ | ? | ✓ (tamamı) | 0 |
| Euki | ✓ | ✓ | ? | ? | ✓ | ✓ | - | - | - | - | - | ✓ | - | ✓ (tamamı) | 0 |
| Periodical | ✓ | ✓ | ? | ? | - | ? | - | - | - | - | - | ✓ | ? | ✓ (tamamı) | 0 |
| Bellabeat | ✓ | ✓ | ✓ | ? | ? | ? | ? | ✓ | ? | koç | Ivy/Leaf | - | ? | kısmi | 100 |
| Oura | kayıt | etiket | C (otomatik) | - | ✓ (2026) | ? | ? | ✓ | ✓ | Advisor (?) | kendisi | - | ? | - | 70 + yüzük |
| WHOOP | kayıt | ✓ (2026) | C (otomatik) | - | dar | ? | ? | ? | kan paneli | koç | kendisi | - | ? | - | 199-359 |
| Pepapp | ✓ | ✓ | ? | ? | ? | ? | ? | ✓ | içerik | ? | Apple Sağlık | ? | ✓ | ✓ (reklam) | ~600 TL |
| Period Calendar | ✓ | ✓ | ? | ? | ✓ (?) | ✓ (?) | - | ✓ (?) | - | - | - | ? | ✓ | ✓ (reklam) | ? |

### 3.2 Kullanıcıların istediği ama eksik kalanlar (pazar boşlukları)

1. **Çekirdeği paywall'suz, dürüst ücretsiz katman.** En yüksek sesli şikayet. Flo ve Clue'da ücretsizden ücretliye taşınan özellikler "yem-tuzak" hissi yaratıyor. Kaynak: https://ayla-research.riajul.dev/ , https://unstar.app/blog/flo-clue-stardust-apple-health-period-tracking-apps-ranked-2026
2. **Kısa onboarding.** 12 dakikalık anket + paywall yerine 60 saniyede ilk değer. Kaynak: Flo teardown (yukarıda).
3. **Düzensiz döngüde dürüst tahmin.** PKOS, perimenopoz, doğum sonrası, hap bırakma. 28 gün ortalaması çöküyor; kullanıcılar tek tarih yerine aralık ve güven düzeyi istiyor. Sabit sınırlar (Bellabeat 15-40 gün) insanları dışlıyor. Kaynak: https://kimola.com/reports/consumer-insights-on-period-tracking-apps , https://ottyapp.com/blog/period-tracker-for-irregular-periods/
4. **Tahmini veri gibi kaydetmeme.** Tahmin edilen günde regli otomatik "başladı" sayan uygulamalar geçmişi bozuyor. Kaynak: https://www.kymarahealth.com/blog/best-free-period-tracking-app-2026-reddit
5. **Yaşam olaylarını modelleme.** Gebelik, doğum, düşük, emzirme, hap kullanımı ortalamaları bozmamalı ("hamilelik çok uzun döngü sayıldı" şikayeti).
6. **Doğrulanabilir gizlilik.** Yerel depolama, hesapsız kullanım, sıfır üçüncü taraf SDK. Mozilla'nın tek 10/10'u Euki; ama Euki'de tahmin/cila zayıf ve Türkçe yok. "Gizli ama güzel ve akıllı" boşluğu açık. Stardust örneği: pazarlama iddiası teknik gerçekle örtüşmezse itibar çöker.
7. **Veri sahipliği.** Kolay dışa/içe aktarım (CSV/PDF), doktor raporu, başka uygulamadan geçiş. Dışa aktarımın paywall'da olması şikayet konusu.
8. **Türkçe, yerel ve reklamsız seçenek.** Türkiye'de güçlü oyuncular ya reklam destekli (Period Calendar, Pepapp ücretsiz) ya da küresel ve pahalı. Gizlilik öncelikli, tam Türkçe, kültürel olarak uygun içerikli (ör. oruç/kaza günleri sayımı gibi ihtiyaçlar; talep **doğrulanamadı**, kullanıcı görüşmesiyle test edilmeli) bir ürün görünmüyor.
9. **Cinsiyetsiz, olgun, ayrık tasarım.** Pembe/çiçek estetiği ve kız çocuğu tonu itici bulunuyor; kullanıcılar ikon yüzünden uygulamayı ana ekrandan kaldırdığını söylüyor. Kaynak: https://dl.acm.org/doi/pdf/10.1145/3196839.3196850 , https://www.ncbi.nlm.nih.gov/books/NBK565608/
10. **Partner paylaşımının ücretsiz ve ayrıntılı izinli olması.** Clue'da ücretli, Samsung'da yok.
11. **Perimenopoz için ücretsiz temel destek.** Flo ve Clue'da ücretli; Apple ücretsiz veriyor ama yalnız iOS.
12. **Duygusal örüntü ve öz-yansıtma.** Sadece tarih değil, "bu evrede genelde nasıl hissediyorum" özetleri. Kaynak: https://cycleblueprint.com/best-period-tracker-apps-falling-short/
13. **Kararlılık.** Çökme ve veri kaybı Kimola raporunda öne çıkıyor.

### 3.3 Yeni uygulama için MVP özellik listesi

**Olmazsa olmaz (v1.0)**

| # | Özellik | Not |
|---|---|---|
| 1 | Regl başlangıç/bitiş kaydı, tek dokunuş | Geçmişe dönük toplu giriş dahil |
| 2 | Akış yoğunluğu (lekelenme, hafif, orta, yoğun) | |
| 3 | Belirti + ruh hali kaydı | 15-20 öğelik özenli set, gizlenebilir/yeniden sıralanabilir |
| 4 | Serbest not | |
| 5 | Tahmin: sonraki regl ve doğurgan pencere | Ağırlıklı ortalama + değişkenlik; tek gün yerine **aralık** ve "güven düzeyi" gösterimi; tahmin asla otomatik kayıt olmaz |
| 6 | Takvim (ay) + ana ekran özeti | |
| 7 | Bildirimler | Regl yaklaşıyor, gecikti, kayıt hatırlatması; kilit ekranında **ayrık metin** seçeneği |
| 8 | Hesapsız kullanım, yerel şifreli depolama | Sıfır üçüncü taraf analitik/reklam SDK'sı |
| 9 | Uygulama kilidi (biyometrik/PIN) | |
| 10 | Dışa/içe aktarım (CSV/JSON) ve tümünü sil | Ücretsiz |
| 11 | 60 saniyelik onboarding | En fazla 3-4 soru: son regl tarihi, tipik döngü uzunluğu (bilmiyorum seçeneği), amaç, bildirim izni |
| 12 | Türkçe + İngilizce | Türkçe birincil dil |
| 13 | Erişilebilirlik tabanı | Dinamik yazı, ekran okuyucu etiketleri, renge bağımlı olmayan kodlama, koyu mod |
| 14 | Döngü geçmişi ve temel istatistik | Ortalama, en kısa/en uzun, değişkenlik |

**Olsa iyi (v1.x)**

| # | Özellik |
|---|---|
| 1 | Hap/ilaç ve doğum kontrol yöntemi kaydı + hatırlatıcı |
| 2 | Cinsel aktivite, akıntı/servikal mukus, BBT (isteğe bağlı modüller, varsayılan kapalı) |
| 3 | Apple Health / Health Connect çift yönlü eşitleme |
| 4 | Doktor için PDF rapor |
| 5 | Yaşam olayı işaretleri: gebelik, doğum, düşük, emzirme, hap başlat/bırak (istatistikten hariç tutma) |
| 6 | Düzensiz döngü modu (PKOS vb.): tahmin aralığını genişletir, dili yumuşatır |
| 7 | Belirti örüntüsü özetleri ("regl öncesi 2 gün genelde baş ağrısı") |
| 8 | Ana ekran widget'ı, ayrık uygulama ikonu/adı |
| 9 | Uçtan uca şifreli isteğe bağlı yedek (anahtar kullanıcıda) |
| 10 | Kanıta dayalı kısa Türkçe içerik kütüphanesi |

**Sonra (v2+)**

| # | Özellik |
|---|---|
| 1 | Partner paylaşımı (ayrıntılı izin, tek yönlü, iptal edilebilir) |
| 2 | Hamile kalma modu ve hamilelik modu |
| 3 | Perimenopoz modu |
| 4 | Giyilebilir sıcaklık verisi (Apple Watch, Oura, Galaxy) |
| 5 | Cihaz üstü AI özet/soru-cevap (veri cihazdan çıkmadan) |
| 6 | Sahte ekran/baskı PIN'i, zamanlanmış otomatik silme (Euki modeli) |
| 7 | Ergen modu ve ebeveyn bağlamı |
| 8 | Saat uygulaması |

Bilinçli olarak dışarıda: doğum kontrolü iddiası (tıbbi cihaz mevzuatı gerektirir), topluluk forumu (moderasyon yükü), astroloji.

### 3.4 Önerilen ekran listesi ve bilgi mimarisi

Alt gezinme: **Bugün | Takvim | İçgörüler | Ayarlar**, ortada kalıcı **+ Kayıt** düğmesi.

| # | Ekran | İçerik |
|---|---|---|
| 0.1 | Karşılama | Değer önerisi + "verin telefonunda kalır" |
| 0.2 | Onboarding 1-3 | Son regl tarihi, tipik uzunluk (bilmiyorum), amaç (sadece takip / hamile kalmak / kaçınmak için farkındalık) |
| 0.3 | Bildirim ve kilit izni | Atlanabilir |
| 1.0 | Bugün | Döngü günü, evre, "regle yaklaşık X gün (±Y)" aralığı, bugünün kayıt özetleri, hızlı kayıt çipleri, tek bilgi kartı |
| 1.1 | Gecikme durumu | Suçlamayan dil, olası nedenler, "regl başladı" kısayolu |
| 2.0 | Takvim (ay) | Kaydedilen regl (dolu), tahmin (çizgili/soluk), doğurgan pencere (farklı desen), kayıt noktaları; yıl görünümüne geçiş |
| 2.1 | Gün ayrıntısı | O günün tüm kayıtları, düzenle |
| 2.2 | Regl düzenleme | Aralık seçerek toplu düzeltme |
| 3.0 | Kayıt sayfası (alt sayfa) | Akış, belirtiler, ruh hali, not; isteğe bağlı modüller; tek ekranda kaydet |
| 3.1 | Kategori özelleştirme | Göster/gizle, sırala, özel etiket |
| 4.0 | İçgörüler | Döngü uzunluğu grafiği, regl süresi, değişkenlik, belirti örüntüleri |
| 4.1 | Döngü geçmişi listesi | Her döngü satırı; olay işaretleri |
| 4.2 | Rapor/dışa aktarım | PDF, CSV |
| 5.0 | Ayarlar | Döngü ayarları, bildirimler, gizlilik ve kilit, veri (yedek/dışa aktar/sil), görünüm (tema, ikon), dil, hakkında |
| 5.1 | Gizlilik merkezi | Hangi veri nerede duruyor; düz dille; ağ çağrısı yok beyanı |
| 5.2 | Abonelik/destek | Şeffaf fiyat, ücretsiz kalanların listesi |
| 6.0 | İçerik (v1.x) | Kısa makaleler, kaynak gösterimli |

Kalıp kararları:
- Ana ekranda Flo tarzı geri sayım + Clue tarzı çember tartışması: MVP için **yatay döngü şeridi** (evreler bantlı) + büyük metin öneriyorum; çember dekoratif yer kaplıyor eleştirisi alıyor, şerit hem takvimle tutarlı hem ekran okuyucuya daha uygun.
- Kayıt 2 dokunuşu geçmemeli (Bugün'den çip veya + düğmesi).
- Tahmin ile kayıt görsel olarak her zaman ayrı (dolu ve çizgili).

### 3.5 UX/tasarım en iyi pratikleri

**Dil ve kapsayıcılık**
- "Kadın/kız" varsayımı yerine ikinci tekil şahıs: "döngün", "reglin". Türkçe'nin cinsiyetsiz zamirleri avantaj.
- Amaç dayatma yok: hamilelik, herkesin hedefi değil. Doğurganlık bilgisi kapatılabilir olmalı.
- Suçlayıcı/alarm verici ifadeler yok ("geciktin!" yerine "tahmin aralığının dışındasın").
- Terim seçimi: "adet", "regl", "âdet dönemi" için kullanıcı testi yapılmalı; arayüzde biri seçilip tutarlı kullanılmalı (öneri: "regl", mağaza anahtar kelimelerinde ikisi de).
- Tıbbi iddia sınırı: "tahmin" ve "yaklaşık" sözcükleri; doğum kontrolü için kullanılmaması uyarısı (Apple ve GP Apps de bunu açıkça yazıyor).
- Belirsizliği göster: tek tarih yerine aralık.

**Renk**
- Pembe/çiçek klişesinden kaçın (araştırma: kullanıcılar utanıp uygulamayı gizliyor). Nötr zemin + tek sıcak vurgu.
- Kanama için kırmızı ton anlamlı ama tek sinyal olmamalı: renk + desen + ikon + metin.
- Kırmızı-yeşil karşıtlığına yaslanma (Natural Cycles modeli renk körlüğünde sorunlu); mavi-turuncu eksen ve desen farkı daha güvenli.
- WCAG 2.2 AA: metin 4,5:1, büyük metin ve arayüz bileşeni 3:1. Açık ve koyu temada ayrı doğrula.

**Erişilebilirlik**
- Takvim hücreleri en az 44x44 pt, her hücrede tam sözlü etiket ("14 Kasım, regl 2. gün, orta akış, tahmin değil").
- Dinamik yazı boyutunda kırılmayan düzen; hareket azaltma tercihine saygı.
- Grafiklerin metin özeti.
- Tek elle kullanım: birincil eylemler alt yarıda.

**Gizlilik UX'i**
- Varsayılan güvenli: Euki'nin zayıflığı korumaların elle açılması. Kilit ve ayrık bildirim onboarding'de önerilmeli.
- Bildirim metni varsayılan olarak nötr ("Bugün için bir hatırlatma").
- Ayrık ikon ve uygulama adı seçeneği.
- Gizlilik iddiası doğrulanabilir olmalı: açık kaynak çekirdek veya bağımsız denetim; ağ izni yoksa bunu söyle.
- Veri silme tek ekranda, gerçekten kalıcı.

**Güven ve monetizasyon etiği**
- Paywall onboarding'in sonunda sürpriz olmamalı; ücretli özellikler baştan etiketli.
- Ücretsiz verilmiş özelliği sonradan ücretliye taşıma (en büyük nefret kaynağı).
- Kayıt akışında upsell pop-up'ı yok.

### 3.6 Gelir modeli önerisi

Pazar verisi: yıllık fiyatlar 25-150 USD arası; kullanıcı öfkesinin kaynağı fiyat değil, çekirdeğin kilitlenmesi ve sürpriz. Reklam modeli gizlilik konumlanmasıyla çelişir (Period Calendar reklam ağlarına cihaz kimliği gönderdiği için 6/10 aldı).

**Öneri: "cömert freemium", reklamsız, tek ve şeffaf abonelik + ömür boyu seçenek.**

| Katman | İçerik | Fiyat önerisi |
|---|---|---|
| Ücretsiz (kalıcı söz) | Tüm kayıt türleri, tahmin, takvim, bildirimler, kilit, dışa aktarım, temel istatistik | 0 |
| Plus | Gelişmiş içgörü/örüntü raporları, doktor PDF'i, şifreli bulut yedek ve çoklu cihaz, partner paylaşımı, tema/ikon paketleri, ileride modlar ve giyilebilir entegrasyon | Türkiye için yerel fiyat; Pepapp'in 149,99 TL/ay ve 599,99 TL/yıl seviyesi referans. Öneri: yıllık planı öne çıkar, aylık yaklaşık 1/6'sı |
| Ömür boyu | Plus'ın tek seferlik satın alımı | Yıllık fiyatın yaklaşık 2,5-3 katı (GP Apps Deluxe tek seferlik model emsali) |

İlkeler:
- Ücretsiz kalacakların listesi uygulamada ve mağaza sayfasında yazılı taahhüt olsun.
- 7 günlük deneme, yenilemeden önce bildirim (Natural Cycles'ın habersiz yenileme şikayetinden ders).
- Sunucu maliyeti doğuran özellikler (yedek, paylaşım) ücretli; cihazda çalışanlar ücretsiz. Bu ayrım kullanıcıya adil görünür ve anlatması kolaydır.
- İkinci aşama gelir: B2B2C (Ovia modeli: işveren/sigorta), yalnızca toplu ve anonim değil, **hiç veri paylaşmadan** lisans bazlı.
- Kaçınılacaklar: reklam, veri satışı/ortaklığı, haftalık abonelik (Stardust/Pepapp'te var; yüksek iade ve güvensizlik riski).

Fiyat rakamları test edilmeden kesinleşmemeli; TL fiyat emsalleri bu araştırmada çelişkiliydi.

---

## 4. Doğrulanamayanlar (açık liste)

- Türkiye App Store / Google Play güncel kategori sıralaması ve yerel uygulamaların indirme sayıları.
- Flo ve Clue'nun Türkiye TL fiyatları; Flo'nun kesin ABD liste fiyatı.
- Flo for Partners ve Ask Flo'nun ücretsiz/ücretli durumu; Ask Flo'nun güncel erişilebilirliği.
- Flo, Clue, Stardust, Samsung, GP Apps, My Calendar, Pepapp için eksiksiz kayıt kategorisi listeleri (tabloda "?" olan hücreler).
- App Store puanları: Clue, Natural Cycles, Ovia, My Calendar, Pepapp.
- Onboarding akışlarının adım adım dökümü (Flo dışında) ve bildirim türlerinin tam listeleri.
- Stardust, Natural Cycles, drip, Ovia, Glow için Türkçe desteği.
- Natural Cycles perimenopoz modunun FDA kapsamı.
- iOS 27'nin kesin yayın tarihi (ikincil kaynaklar Eylül 2026'ya işaret ediyor).
- Mozilla 2026 raporunun birincil metni (yalnız ikincil haberlerden aktarıldı).
- Türkiye'ye özgü kullanıcı ihtiyaçları (dini takvim bağlamı vb.): veri yok, kullanıcı görüşmesi gerekir.

Önerilen sonraki adım: ağ izin listesine apps.apple.com, play.google.com ve mozillafoundation.org eklenip mağaza sayfaları ile Türkiye yorumlarının doğrudan okunması; ardından 8-10 kullanıcı görüşmesi.

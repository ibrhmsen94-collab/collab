# Adet Takibi Uygulaması — Araştırma 02: Tıbbi/Algoritmik Doğruluk, Gizlilik-Mevzuat, Teknik Uygulama

Araştırma tarihi: 16 Kasım 2026

## 0. Yöntem, güven düzeyi ve sınırlamalar

- Bulgular web aramasıyla toplandı; her önemli iddianın yanında kaynak URL'si var.
- Doğrudan birincil kaynaktan teyit edilenler: Apple App Store Review Guidelines ve App Privacy Details (developer.apple.com sayfaları okundu), Expo SDK 58 belge kaynakları (GitHub `expo/expo` deposundaki `docs/pages/versions/v58.0.0/...` dosyaları okundu), paket sürümleri (npm kayıt defteri, 16.11.2026 sorgusu), `react-native-health-connect` ve `@kingstinct/react-native-healthkit` README/tip dosyaları (GitHub).
- Bu oturumun ağ kısıtı nedeniyle şu alan adlarının sayfaları doğrudan açılamadı: `acog.org`, `nhs.uk`, `cdc.gov`, `expo.dev`, `docs.expo.dev`, `support.google.com`, `pmc.ncbi.nlm.nih.gov`. Bu kaynaklara dair bilgiler arama sonucu özetlerinden alındı; metnin tam ifadesi gerekiyorsa birincil sayfa ayrıca kontrol edilmeli.
- "**Doğrulanamadı**" etiketi: bu oturumda kaynağıyla teyit edilemeyen, yalnızca tek ve zayıf kaynağa dayanan veya genel bilgiye dayalı ifadeler.
- Bölüm A.5'teki algoritma, kaynaklardaki bulgulardan türetilmiş bir **tasarım önerisidir**; klinik olarak doğrulanmış bir algoritma değildir.
- Bu belge hukuki veya tıbbi danışmanlık değildir; yayın öncesi bir hukukçu (KVKK/GDPR) ve tercihen bir kadın doğum uzmanı metinleri gözden geçirmeli.

---

## A. Tıbbi ve algoritmik doğruluk

### A.1 Normal aralıklar ve düzensizlik tanımları

| Kaynak | Döngü uzunluğu (normal) | Kanama süresi | Düzenlilik / düzensizlik |
|---|---|---|---|
| FIGO Sistem 1 (2018 revizyonu, Munro-Critchley-Fraser) | 24–38 gün; <24 "sık", >38 "seyrek" | ≤8 gün normal, >8 gün "uzamış" | En kısa–en uzun döngü farkı ≤7 gün (26–41 yaş), ≤9 gün (18–25 ve 42–45 yaş) "düzenli" |
| NHS (İngiltere) | 21–35 gün; aralık <21 veya >35 gün ise "düzensiz" | 7 günden uzun sürüyorsa hekime | Ergenlik ve menopoz çevresinde düzensizlik çoğunlukla normal |
| ACOG (ergenler, Committee Opinion 651) | Menarş sonrası ilk yıllarda döngülerin %90'ı 21–45 gün; 3. yılda %60–80'i 21–34 gün | Çoğunlukla 2–7 gün; >7 gün değerlendirme gerektirir | Tek bir döngüde bile 90 günden uzun aralık değerlendirme gerektirir |
| ACOG reVITALize tanımları | — | — | "Düzensiz kanama": bir yıl içinde en uzun ve en kısa aralık farkı tipik olarak >20 gün |

Kaynaklar:
- FIGO: https://www.pure.ed.ac.uk/ws/files/75445783/Munro_et_al_2018_International_Journal_of_Gynecology_26_Obstetrics.pdf ; özet tablo: https://www.msdmanuals.com/professional/multimedia/table/normal-menstrual-parameters ; StatPearls: https://ncbi.nlm.nih.gov/books/NBK500020
- NHS: https://www.nhs.uk/symptoms/irregular-periods ; https://www.nhs.uk/conditions/periods/period-problems/
- ACOG CO 651: https://pubmed.ncbi.nlm.nih.gov/26595586/ ; https://www.acog.org/clinical/clinical-guidance/committee-opinion/articles/2015/12/menstruation-in-girls-and-adolescents-using-the-menstrual-cycle-as-a-vital-sign ; ikincil özet: https://www.contemporarypediatrics.com/view/menses-vital-sign-teenaged-girls
- ACOG reVITALize: https://www.acog.org/practice-management/health-it-and-clinical-informatics/revitalize-gynecology-data-definitions

Notlar:
- FIGO (24–38) ile NHS (21–35) eşikleri farklıdır. Uygulamada kullanıcıya dönük uyarılar için daha yaygın bilinen ve daha muhafazakâr olmayan 21–35 (yetişkin) / 21–45 (ergen) eşiği, "düzenlilik" rozeti için FIGO'nun 7–9 günlük fark ölçütü önerilir.
- WHO'nun normal döngü aralığına dair ayrı bir sayısal tanımı bu oturumda bulunamadı (**doğrulanamadı**). WHO/JHU "Family Planning: A Global Handbook for Providers" takvim yöntemleri için eşikler verir (bkz. A.3): https://fphandbook.org/sites/default/files/JHU%20HBk22%20-%20Chapter%2018.pdf
- ACOG ergen metnindeki ayrıntılı liste (15 yaşına kadar menarş olmaması, 1–2 saatte bir ped değiştirme vb.) arama özetlerinde kısmen geçti; tam metin okunamadı (**kısmen doğrulandı**).

### A.2 Gerçek dünya verisi: "28 gün" efsanesi ve değişkenlik

- Bull ve ark. 2019 (npj Digital Medicine; Natural Cycles verisi): 124.648 kullanıcı, 612.613 ovulatuvar döngü. Ortalama döngü 29,3 gün; ortalama foliküler faz 16,9 gün (10–30), ortalama luteal faz 12,4 gün (7–17). Döngülerin yalnızca yaklaşık %13'ü 28 gündür. 25–45 yaş arasında döngü her yaş için ortalama 0,18 gün kısalır. Kişi içi döngü değişkenliği VKİ>35 olanlarda 0,4 gün (%14) daha yüksek; buradan taban kişi içi değişkenliğin yaklaşık 2,8–2,9 gün olduğu türetilebilir (türetim bana aittir). Yazarların sonucu: doğurgan dönemi belirlemek için yalnızca döngü uzunluğu yetmez, BBT gibi fizyolojik ölçüm gerekir. https://pubmed.ncbi.nlm.nih.gov/31482137/ ; https://pmc.ncbi.nlm.nih.gov/articles/PMC6710244
- Fehring ve ark. 2006 (141 kadın, 1.060 döngü, hormon monitörü): ortalama döngü 28,9 gün (SS 3,4); döngülerin %95'i 22–36 gün; kadınların %42,5'inde kendi döngüleri arasında 7 günden fazla fark; değişkenliğin çoğu foliküler fazdan gelir (foliküler faz %33,6 kadında >7 gün oynar, luteal faz %9'unda). https://pubmed.ncbi.nlm.nih.gov/16700687/
- Grieger ve Norman 2020 (JMIR; Flo, 1.579.819 kullanıcı): medyan döngüsü 28 gün olanlar yalnızca %16,32; %91,13'ünün medyanı 21–35 gün. https://www.jmir.org/2020/6/e17109/
- Li ve ark. 2023 (Apple Women's Health Study; 12.608 katılımcı, 165.668 döngü): döngü değişkenliği 35–39 yaşta en düşük; 20 yaş altında %46, 45–49 yaşta %45, 50 yaş üstünde %200 daha yüksek. Asyalı ve Hispanik katılımcılarda ve obezitede değişkenlik daha yüksek. https://pubmed.ncbi.nlm.nih.gov/37248288/ ; https://www.nature.com/articles/s41746-023-00848-1.pdf
- Luteal faz: Lenton ve ark. 1984: 14,13 ± 1,41 gün; ≤9 gün anormal kabul edilir. Fehring 2006'ya atfedilen 12,4 ± 2,0 gün değeri yalnızca ikincil atıflarda görüldü (**doğrulanamadı**). https://rrmacademy.org/library/normal-variation-in-the-length-of-the-luteal-phase-of-the-menstrual-cycle-identi-rec5wo2bhylu8qonu/ ; https://academic.oup.com/humrep/article/39/11/2565/7775370

Tasarım sonucu: Varsayılan 28 gün yerine kişisel geçmişe dayalı tahmin şart; "luteal faz = 14 gün" yalnızca bir varsayımdır ve ±2 günlük belirsizlik taşır.

### A.3 Tahmin yöntemleri ve kanıt düzeyi

**Doğurgan pencerenin biyolojisi**
- Wilcox, Weinberg, Baird 1995 (NEJM): gebeliklerin neredeyse tamamı, ovulasyon günüyle biten 6 günlük aralıktaki ilişkiye bağlanır. Gebe kalma olasılığı ovulasyondan 5 gün önce yaklaşık 0,10, ovulasyon günü 0,33 (sayılar ikincil özetten). https://rrmacademy.org/library/timing-of-sexual-intercourse-in-relation-to-ovulation-effects-on-the-probability-recl5w91id8jzz9n1/
- Wilcox, Dunson, Baird 2000 (BMJ; 221 kadın, 696 döngü): kadınların yalnızca yaklaşık %30'unda doğurgan pencere tümüyle 10–17. günler arasındadır; 6–21. günlerin her birinde doğurgan pencerede olma olasılığı en az %10'dur; döngüsünü düzenli sayan kadınlarda bile beklenen adet gününde bu olasılık %1–6'dır. https://www.bmj.com/lookup/volpage/321/1259 ; https://pmc.ncbi.nlm.nih.gov/articles/PMC27529

**Takvim tabanlı yöntemler**
- Standard Days Method (SDM): döngülerinin çoğu 26–32 gün olan kadınlar için; 8–19. günler doğurgan sayılır. Arévalo ve ark. 2002 (478 kadın): 13 döngüde doğru kullanımda %4,75, tipik kullanımda %11,96 gebelik. 2018 sistematik derlemesi: tipik kullanım 11,2–14,1. Yılda 2'den fazla döngü aralık dışındaysa yöntem daha az etkili. https://www.irh.org/wp-content/uploads/2013/04/Efficacy_SDM_2002.pdf ; https://fphandbook.org/node/2629
- Takvim ritim yöntemi (WHO el kitabı): son 6 döngü kullanılır; en uzun döngü − 11 = son doğurgan gün (örnek: 31 − 11 = 20). İlk doğurgan gün için yaygın formül en kısa döngü − 18'dir; bu kısım arama sonuçlarında görülmedi (**doğrulanamadı**). https://fphandbook.org/sites/default/files/legacy/book/fph_chapter17/fph_chap17_providing_cbm.shtml
- Johnson, Marriott, Zinaman 2018 (949 kadın, idrar hormonu ile ovulasyon): 28 günlük döngüde en olası ovulasyon günü 16. gündür ve yalnızca %21 olasılıkla; uygulamaların/takvim yöntemlerinin ovulasyon gününü tutturma oranı %21'i geçmez. Sonuç: yalnızca döngü uzunluğuna dayanan yöntemler ovulasyonu doğru tahmin edemez. https://informahealthcare.com/doi/full/10.1080/03007995.2018.1475348

**Semptotermal, BBT, LH**
- Semptotermal (Sensiplan), Frank-Herrmann ve ark. 2007 (900 kadın): 13 döngü sonunda 100 kadında 1,8 istenmeyen gebelik; kusursuz kullanım için sık anılan 0,4 değeri ikincil atıflardan (Peragallo Urrutia 2018 derlemesi) geliyor, 2007 makalesinin kendi metninden teyit edilemedi (**kısmen doğrulandı**). https://pubmed.ncbi.nlm.nih.gov/17314078/ ; https://rrmacademy.org/sympto-thermal-method/
- BBT: ovulasyonu geriye dönük doğrular, öngörmez. Ultrasona karşı bir çalışmada BBT duyarlılığı 0,77, özgüllüğü 0,33; ovulasyon BBT dip noktasının 6 gün öncesinden 4 gün sonrasına kadar gerçekleşebildi. https://www.aafp.org/pubs/afp/issues/2001/0901/p858.html
- LH idrar testi: LH tabanlı testler BBT çizelgesinden daha doğru ovulasyon tespiti sağlar (2004 derlemesi). LH yükselişi ile ovulasyon arası süre kaynaklara göre değişiyor (12–36 saat ile 72 saate kadar); kesin aralık **doğrulanamadı**. https://pubmed.ncbi.nlm.nih.gov/14742773/

**Uygulamaların doğruluğuna dair yayınlar**
- 2016 (Obstetrics & Gynecology): 20 web sitesi ve 33 uygulamadan yalnızca 1 site ve 3 uygulama doğurgan pencereyi doğru verdi (haber özetinden; birincil makale okunamadı). https://www.progress.org.uk/study-finds-most-fertility-tracker-apps-are-inaccurate/
- 2021 (Women's Health; 10 uygulama, 5 simüle profil): uygulamalar düzenli profili doğru tahmin etti, diğer dördünde 0–8 gün saptı; adet, ovulasyon ve doğurgan pencere için birbirleriyle çelişen bilgiler verdiler. https://doaj.org/article/0563b418834e4303aa94e4550e410ba1
- Li ve ark. 2021 (JAMIA; Clue, 186.000 kullanıcı, 2 milyondan fazla döngü): kullanıcının adet girmeyi atlaması döngü uzunluğunu yapay olarak şişirir; bunu açıkça modelleyen yaklaşım daha doğru tahmin verir ve döngü ilerledikçe tahmin güncellenebilir. https://pmc.ncbi.nlm.nih.gov/articles/PMC8714275
- Sporcu verisiyle durum-uzay modeli (Scientific Reports 2021): bir sonraki döngü uzunluğu için RMSE yaklaşık 1,64 gün. https://www.nature.com/articles/s41598-021-95960-1
- Genel bir "ortalama mutlak hata" kıyas değeri (tüketici uygulamaları için) bulunamadı (**doğrulanamadı**).

Yöntem seçimi için özet:

| Yöntem | Ne zaman | Artı | Eksi |
|---|---|---|---|
| Sabit 28 gün | Hiç veri yokken bile önerilmez | Basit | Kadınların %84'ünde yanlış merkez |
| Basit ortalama | n ≥ 3 | Anlaşılır | Aykırı ve atlanmış kayıtlara duyarlı |
| Medyan | n ≥ 3 | Aykırı değere dayanıklı | Eğilim değişimine yavaş tepki |
| Üstel ağırlıklı ortalama + küçülme (shrinkage) | n ≥ 1 | Az veride dengeli, yaşa bağlı kaymayı izler | Parametre seçimi gerekir |
| Üretici (generative) model, atlama olasılıklı | Büyük veri/sunucu | En iyi kalibrasyon | Cihaz içi, veri toplamayan uygulamada eğitilemez |

Öneri: cihaz içi, veri toplamayan mimaride "aykırı ayıklama + üstel ağırlıklı ortalama + öncül (prior) ile küçültme + tahmin aralığı" (A.5).

### A.4 Yaşa göre farklar

- Ergenler: menarş sonrası ilk yıllarda 21–45 gün normal; değişkenlik 20 yaş altında yaklaşık %46 daha yüksek (A.2). Uyarı eşikleri: <21 veya >45 gün, >7 gün kanama, 90 günden uzun aralık.
- Perimenopoz (STRAW+10): erken geçiş = ardışık döngü uzunlukları arasında ≥7 gün kalıcı fark (ilk değişken döngüden sonraki 10 döngü içinde tekrar); geç geçiş = ≥60 gün amenore; geç geçiş 1–3 yıl sürer. https://www.msdmanuals.com/professional/multimedia/table/stages-of-menopause ; https://pmc.ncbi.nlm.nih.gov/articles/PMC3232023
- Uygulama davranışı: 45 yaş üstünde değişkenlik artışını "olağan olabilir" diye çerçevele, tahmin aralığını genişlet; 12 ay adetsizlikten sonraki kanama için hekime yönlendir (menopoz sonrası kanama uyarısı; ifade genel tıbbi uygulamaya dayanır, bu oturumda kaynakla **doğrulanamadı**).

### A.5 Önerilen tahmin algoritması (kodlanabilir)

Aşağıdaki sabitler A.1–A.4'teki kaynaklardan türetilmiş tasarım tercihleridir; hepsi tek bir yapılandırma dosyasında tutulmalı.

**Tanımlar**
- Kanama günü: kullanıcının "adet" işaretlediği gün (lekelenme ayrı tür, döngü başlatmaz).
- Adet dönemi (episode): aralarında en fazla 2 kanamasız gün bulunan kanama günleri tek dönemde birleştirilir (tasarım tercihi).
- Döngü uzunluğu `L_i` = ardışık iki adet döneminin başlangıç günleri arasındaki gün farkı.
- Adet süresi `D_i` = dönemin ilk ve son kanama günü arası (dahil).

**Adım 1 — Geçerlilik ve aykırı ayıklama**

```
MIN_VALID = 15      // L < 15: büyük olasılıkla ara kanama ya da hatalı giriş -> kullanıcıya sor, istatistiğe alma
MAX_VALID = 90      // L > 90: tahmine alma; "doktora danışın" bayrağı (ACOG: 90 gün)
PENCERE   = son 8 geçerli döngü (tahmin), son 12 ay (düzenlilik)

med = median(geçerli L, son 8)
MADN = 1.4826 * median(|L_i - med|)
aykiri(L_i)  = n >= 4 ve |L_i - med| > max(10, 3*MADN)
atlanmis(L_i)= n >= 3 ve L_i >= 1.7*med ve L_i <= 2.4*med   // muhtemel girilmemiş adet (Li 2021)
```
- `atlanmis` durumunda kullanıcıya bir kez sor: "Bu arada bir adet dönemini girmeyi unutmuş olabilir misin?" Yanıt "evet/bilmiyorum" ise döngü tahminden çıkarılır; "hayır" ise uzun döngü olarak tutulur ve bayrak mantığına girer.
- Aykırı döngüler tahminden çıkarılır ama kullanıcıya gösterilen geçmişte ve düzensizlik bayraklarında kalır.
- Hormonal doğum kontrolü, gebelik, emzirme/lohusalık modları: tahmin kapatılır (çekilme kanaması doğal döngü değildir; tasarım tercihi).

**Adım 2 — Öncül (prior)**

```
mu0 = kullanıcının kurulumda girdiği "genelde kaç günde bir" değeri (21..45'e kırpılır)
      yoksa 29                      // Bull 29.3, Fehring 28.9
sigma0 = 3.0   (20–44 yaş)          // kişi içi değişkenlik ~2.8–2.9 gün (Bull'dan türetim)
       = 4.5   (<20 veya >=45 yaş, ya da yaş bilinmiyor ve kullanıcı "düzensiz" dediyse)  // Li 2023: +%45–46
kappa = 2      // öncülün "sanal döngü" ağırlığı
nu0   = 2
```

**Adım 3 — Merkez ve yayılım**

```
k = 0 en yeni döngü; w_k = 0.85^k          (en fazla 8 döngü)
W  = Σ w_k
n_eff = W^2 / Σ w_k^2

mu    = (kappa*mu0 + Σ w_k*L_k) / (kappa + W)
var   = (nu0*sigma0^2 + Σ w_k*(L_k - mu)^2) / (nu0 + W)
sigma = clamp(sqrt(var), 1.5, 10)
s_pred(1) = sigma * sqrt(1 + 1/(kappa + n_eff))
```
- n = 0: `mu = mu0`, `sigma = sigma0`.
- n = 1: `mu = (2*mu0 + L1)/3`; tek döngüyle kişiselleştirme sınırlı kalır, bu kasıtlıdır.
- n = 2: aynı formül; aykırı testi henüz çalışmaz.

**Adım 4 — Sonraki adet ve belirsizlik aralığı**

```
tahmin_j  = son_baslangic + round(j*mu)                    j = 1,2,3 (en fazla 3 döngü ileri)
s_pred(j) = sqrt( j*sigma^2 + (j*sigma)^2/(kappa + n_eff) )
aralik_j  = tahmin_j ± ceil(1.2816 * s_pred(j))           // %80 tahmin aralığı, en az ±1 gün
```
- Gösterim: tek tarih yerine "12–16 Aralık arası (en olası 14 Aralık)"; takvimde merkez gün dolu, aralık soluk.
- Yarı genişlik > 7 gün ise: "Döngülerin değişken olduğu için güvenilir tahmin yapılamıyor" ve yalnızca geniş bant göster.
- Güven etiketi: n ≤ 2 "düşük (öğreniyor)", 3–5 "orta", ≥6 ve sigma ≤ 3 "yüksek".
- Gecikme: bugün > aralık üst sınırı ise "X gün gecikti"; tahmini ileri kaydırma, yalnızca gecikmeyi göster. Geçen süre > 90 gün ise doktor uyarısı.
- Adet süresi tahmini: son 6 `D_i` medyanı; veri yoksa 5 gün (tipik 2–7 gün).

**Adım 5 — Ovulasyon ve doğurgan pencere (yalnızca bilgilendirme)**

```
LUTEAL = 14 (kullanıcı ayarı 10..16);  sigma_luteal = 2
ov      = tahmin_1 - LUTEAL
s_ov    = sqrt(s_pred(1)^2 + sigma_luteal^2)
ov_alt  = ov - ceil(1.2816*s_ov);  ov_ust = ov + ceil(1.2816*s_ov)
dogurgan_bant = [ov_alt - 5, ov_ust + 1]      // biyolojik pencere: ovulasyondan 5 gün önce..ovulasyon günü
```
- n < 3 veya döngü "düzensiz" ise doğurgan pencere varsayılan olarak gizli; kullanıcı açarsa geniş bant + uyarı.
- En iyi durumda bile (sigma = 1,5) bant yaklaşık 15 gün çıkar (s_ov ≈ 2,5 → ±4 gün, artı 6 günlük biyolojik pencere); bu, Wilcox 2000 ve Johnson 2018 bulgularıyla tutarlıdır ve dar "3 günlük doğurgan pencere" göstermenin yanıltıcı olacağını gösterir. Arayüzde `[ov-5, ov]` "en olası" çekirdek olarak koyu, geri kalan bant soluk gösterilebilir.
- Kullanıcı LH testi/BBT kaydederse (ileriki sürüm): pozitif LH → o döngü için `ov` = test günü + 1, `s_ov` = 1; BBT kayması → geriye dönük doğrulama ve kişisel luteal uzunluğun güncellenmesi.

**Adım 6 — Düzenlilik rozeti ve bayraklar**

```
fark12 = max(L) - min(L)   (son 12 ay, geçerli döngüler, n >= 3)
duzenli = fark12 <= 7 (26–41 yaş) | <= 9 (18–25, 42–45 yaş ya da yaş bilinmiyor)   // FIGO
```

**Örnek:** döngüler (yeniden eskiye) 30, 27, 29, 45, 28; yaş 30, mu0 = 29. med = 29; MADN = 1,48; eşik = max(10; 4,4) = 10; 45 → |45−29| = 16 > 10 aykırı (ayrıca 45 < 1,7×29 = 49,3 olduğundan "atlanmış" sayılmaz). Kalan 30, 27, 29, 28 ağırlıkları 1; 0,85; 0,7225; 0,614 → W = 3,187; ağırlıklı toplam = 91,09; mu = (58 + 91,09)/5,187 = 28,74 → 29 gün. var = (18 + 4,55)/5,187 = 4,35 → sigma ≈ 2,1; n_eff ≈ 3,9; s_pred ≈ 2,26; aralık = ±ceil(1,2816×2,26 = 2,89) = ±3 gün.

**Birim testleri için kabul ölçütleri:** n=0 için 29±ceil(1,28×3×sqrt(1,5)) = ±5 gün; tek aykırı döngü tahmini 1 günden fazla kaydırmamalı; atlanmış kayıt (ör. 58 gün) tahmini değiştirmemeli; 3 ileri döngüde aralık monoton genişlemeli.

### A.6 "Doktora danışın" tetikleyicileri

| Durum | Eşik (uygulama kuralı) | Dayanak |
|---|---|---|
| Kısa döngüler | Son 6 döngünün ≥3'ü <21 gün | NHS, ACOG ergen |
| Uzun döngüler | Son 6 döngünün ≥3'ü >35 gün (yetişkin) / >45 gün (menarştan sonraki ilk 3 yıl) | NHS, ACOG |
| Adetin kesilmesi | Son adetten bu yana ≥90 gün (gebelik/emzirme/menopoz modu kapalıyken) | ACOG: 3 ay ve üzeri sekonder amenore; ergenlerde tek döngüde 90 gün |
| Uzun kanama | Adet süresi >7 gün (FIGO'ya göre >8 gün "uzamış") | NHS, ACOG, CDC, FIGO |
| Yoğun kanama | 2 saatten kısa sürede ped/tampon dolması, çeyrek dolar (yaklaşık 2,5 cm) ve üzeri pıhtı, gece ped değiştirme ihtiyacı | CDC |
| Ara kanama / ilişki sonrası kanama | Kullanıcı 2+ döngüde kaydettiyse | NHS |
| Aşırı değişkenlik | Bir yılda en uzun–en kısa fark >20 gün | ACOG reVITALize |
| Menarş gecikmesi | 15 yaşına kadar adet başlamadıysa (kullanıcı beyanı) | ACOG: primer amenore |
| Menopoz sonrası kanama | 12 ay adetsizlikten sonra kanama | **Doğrulanamadı** (genel klinik kural) |
| Şiddetli ağrı, bayılma, ateş | Kullanıcı "çok şiddetli" işaretlediyse genel yönlendirme | **Doğrulanamadı** (bu oturumda kaynak aranmadı) |

Kaynaklar: https://www.acog.org/en/womens-health/faqs/amenorrhea-absence-of-periods ; https://cdc.gov/female-blood-disorders/about/heavy-menstrual-bleeding.html ; https://www.nhs.uk/conditions/periods/period-problems/ ; https://nidirect.gov.uk/conditions/irregular-periods

Uyarı tasarımı: teşhis dili kullanma ("PCOS olabilir" yok); "Bu örüntü bazen bir sağlık durumuna işaret edebilir; bir hekimle paylaşman iyi olur" tonu; aynı uyarıyı 90 günde bir tekrarlama; kullanıcı kapatabilsin; "hekime göster" için PDF/CSV özet dışa aktarımı sun.

### A.7 Tıbbi feragat ve doğum kontrolü iddiası

- Apple 1.4.1: yanlış veri verebilecek tıbbi uygulamalar daha sıkı incelenir; uygulamalar kullanıcıya tıbbi karar öncesi hekime danışmasını hatırlatmalıdır; düzenleyici onay varsa bağlantısı sunulmalıdır. https://developer.apple.com/app-store/review/guidelines/
- Google Play: tıbbi işlev sunan uygulamalar düzenleyici kanıt ya da feragat ister; hekime danışma uyarısının uygulama içinde açıkça gösterilmesi önerilir. https://support.google.com/googleplay/android-developer/answer/16555673
- Clue'nun mağaza metni: uygulama profesyonel tıbbi tavsiye, teşhis veya tedavinin yerini tutmaz. https://apps.apple.com/us/app/clue-period-cycle-tracker/id657189652
- Doğum kontrolü iddiasının riski:
  - Natural Cycles: FDA De Novo DEN170052 (10.08.2018), sınıf II, 21 CFR 884.5370, ürün kodu PYT; yalnızca 18 yaş üstü. Clue Birth Control 510(k) K193330 (18.02.2021). https://fda.innolitics.com/device/DEN170052 ; https://www.federalregister.gov/documents/2019/03/06/2019-04028/medical-devices-obstetrical-and-gynecological-devices-classification-of-the-software-application-for
  - Etkinlik: tipik kullanım Pearl İndeksi 6,9 (GA 6,5–7,2), kusursuz kullanım 1,0. https://pubmed.ncbi.nlm.nih.gov/28882680/
  - İsveç: bir hastanede Eylül–Aralık 2017'de kürtaj için başvuran 668 kadından 37'si uygulamayı kullanıyordu; düzenleyici inceleme Eylül 2018'de başarısızlık oranının beyan edilenle uyumlu olduğu sonucuyla kapandı. https://www.statnews.com/2018/09/13/sweden-regulator-no-issues-natural-cycles-app/
  - İngiltere ASA (Ağustos 2018): "son derece doğru doğum kontrol uygulaması" ifadesi yanıltıcı bulundu. https://digitalhealth.net/2018/09/natural-cycles-facebook-ad-banned
- Öneri (metin taslağı, TR): "Bu uygulama bir tıbbi cihaz değildir; teşhis koymaz, tedavi önermez. Tahminler geçmiş kayıtlarına dayalı istatistiksel kestirimlerdir ve yanılabilir. Doğurgan gün tahminleri gebelikten korunmak için **kullanılamaz**. Sağlığınla ilgili kararlar için hekime danış."
- Bu metin: (1) ilk açılışta onay ekranında, (2) doğurgan pencere ilk açıldığında, (3) Ayarlar > Hakkında içinde, (4) mağaza açıklamasında yer almalı. Mağaza metninde "doğum kontrolü", "korunma", "gebe kalmanı sağlar", "%X doğru" gibi ifadeler kullanılmamalı.

---

## B. Gizlilik ve mevzuat

### B.1 Örnek olaylar ve güncel gelişmeler

| Olay | Özet | Kaynak |
|---|---|---|
| FTC – Flo Health | Şikâyet Ocak 2021, nihai karar 22.06.2021. Flo, gizlilik vaadine rağmen gebelik durumu gibi verileri "app events" ile Facebook, Google, Fabric, AppsFlyer, Flurry'ye iletti. Para cezası yok; kullanıcı bildirimi, üçüncü taraflardan veri imhası talebi, bağımsız denetim. | https://www.ftc.gov/node/73903 ; https://www.mobihealthnews.com/news/fertility-app-flo-health-settles-ftc-over-sensitive-data-sharing-complaint |
| Frasco v. Flo Health (N.D. Cal., 3:21-cv-00757-JD) | 1 Ağustos 2025: jüri Meta'yı Kaliforniya CIPA ihlalinden sorumlu buldu (bazı kaynaklar 4 Ağustos diyor). Uzlaşmalar: Google 48 milyon, Flo 8 milyon, Flurry 3,5 milyon ABD doları. CIPA ihlal başına 5.000 dolar öngörür; davacılar yaklaşık 1,1 milyar dolar talep ediyor (Eylül 2026 haberi). Meta'nın karar sonrası itirazları reddedildi. Nihai tazminat kararı ve temyiz durumu **doğrulanamadı**. | https://techcrunch.com/2025/08/05/jury-rules-meta-violated-california-privacy-laws-by-collecting-menstrual-health-data-from-flo ; https://www.mlex.com/mlex/articles/2531613/meta-rejects-1-1bn-in-damages-sought-by-plaintiffs-in-us-flo-privacy-lawsuit ; https://www.labaton.com/Cases/Frasco-v-Flo-Health-Inc |
| FTC – Premom (Easy Healthcare) | Mayıs 2023: Health Breach Notification Rule ihlali; 100.000 dolar sivil ceza + eyaletlere 100.000 dolar. Veriler Google, AppsFlyer ve Çin merkezli Umeng ile Jiguang'a gitti. Reklam amaçlı sağlık verisi paylaşımı yasaklandı. | https://techcrunch.com/2023/05/18/ftc-premom-fertility-tracking-shared-data-google/ ; https://www.hipaajournal.com/200000-penalty-for-impermissible-sharing-of-premom-app-users-health-data/ |
| Roe sonrası (Dobbs, 2022) | Tüketici adet uygulamaları HIPAA kapsamında değil; şirkete gelen geçerli celp yerine getirilmek zorunda. Flo "anonim mod" çıkardı. Veri yalnızca cihazdaysa şirketten istenecek veri olmaz. Belirli kovuşturmalarda adet uygulaması verisinin kullanıldığı iddiaları **doğrulanamadı** (kaynaklar satıcı blogları). | https://goodmorningamerica.com/wellness/story/abortion-advocates-fear-period-tracking-apps-prosecute-abortion-85925714 ; https://ncnewsline.com/?p=177124 |
| ICO (İngiltere) | Eylül 2023'te 11 uygulamayı inceledi; sonuçta ciddi uyum sorunu ya da zarar kanıtı bulmadı, şeffaflık ve güvenlik iyileştirmesi istedi (sonuç tarihi **doğrulanamadı**, 2024 olduğu anlaşılıyor). | https://ico.org.uk/about-the-ico/media-centre/news-and-blogs/2023/09/ico-to-review-period-and-fertility-tracking-apps ; https://www.itpro.com/software/uk-app-developers-issued-warning-amid-concerns-over-user-privacy |
| Privacy International (Mayıs 2025) | 2019'a göre döngü verisinin üçüncü taraflarla paylaşımı azalmış; yine de üçüncü taraflar bir miktar kişisel/cihaz verisi işliyor. | https://privacyinternational.org/sites/default/files/2025-05/period%20tracking%20with%20recs.pdf |
| Cambridge Minderoo raporu (Haziran 2025) | "The High Stakes of Tracking Menstruation": döngü verisi tüketici profillemesi için "altın madeni"; kamu kurumlarının kendi uygulamasını geliştirmesi önerisi. | https://www.eurekalert.org/news-releases/1086640 ; https://www.digitalhealth.net/2025/06/researchers-call-for-stronger-regulation-of-period-tracking-apps/ |
| Hollanda – Bits of Freedom / AP (2026) | Mayıs 2026: Bits of Freedom, Flo hakkında GDPR m.77 şikâyeti (Hollanda'da 200.000'den fazla kullanıcı; özel nitelikli verinin gerekliliği yeterince gerekçelendirilmemiş). 4 Ağustos 2026: Hollanda veri koruma otoritesi (AP) kullanıcıları uyardı, soruşturma açmayı dışlamadı. | https://nltimes.nl/2026/05/31/group-files-complaint-app-flo-collecting-sexual-activity-pregnancy-intentions-info ; https://nltimes.nl/2026/08/04/dutch-privacy-agency-warns-risks-period-tracking-apps ; https://ppc.land/autoriteit-persoonsgegevens-warns-menstruation-apps-face-possible-probe/ |
| Mozilla Privacy Not Included (16 Temmuz 2026) | Puanlar: Euki 10/10 (veri cihazda, hesap yok), Clue 8, Flo 7, Period Calendar 6, Spot On 5, Stardust 2. Flo ve Clue fazla veri toplayıp sunucuda saklamakla eleştirildi (haber kaynaklarından). | https://cyberinsider.com/mozilla-study-ranks-euki-as-the-most-private-period-tracker/ ; https://www.mozillafoundation.org/en/nothing-personal/flo-app-privacy-review/ |

Çıkarım: cezaların ve davaların neredeyse tamamı **üçüncü taraf SDK'ları (analitik, reklam, atıf)** üzerinden gerçekleşti. Hesapsız, cihaz içi, SDK'sız mimari hem riski hem de pazarlama farkını belirler (Mozilla'nın tek tam puanı bu modele gitti).

### B.2 GDPR

- Adet/doğurganlık verisi sağlık verisidir; cinsel yaşam verisiyle birlikte GDPR m.9 özel kategoridir; işleme için pratikte açık rıza gerekir (CNIL sağlık verisi için ayrı ve açık rıza bekler). https://www.simmons-simmons.com/en/publications/cm3x6ddmg03zqtr0k9i1261m7/cnil-s-mobile-app-review-balancing-innovation-and-data-protection
- Yalnızca cihazda saklama: CNIL'e göre veri dış bağlantı olmadan yerelde, yalnızca kişisel amaçla tutuluyorsa ve hizmet sağlamaya yarayan bir işlev yoksa ev içi (household) istisnası uygulanabilir; yerel saklama tek başına GDPR'dan otomatik muafiyet sağlamaz. Geliştiricinin "veri sorumlusu" olup olmadığı, kişisel veriyi işleyip işlemediğine ve amaç/araçları belirleyip belirlemediğine bağlıdır (EDPB 07/2020). https://bclplaw.com/print/v2/content/1556192/mobile-apps-what-does-the-cnil-recommend-from-a-privacy-perspective.pdf ; https://www.insideprivacy.com/digital-health/german-data-protection-authorities-publish-paper-on-cloud-based-digital-health-applications/ ; https://www.chino.io/post/do-we-avoid-gdpr
- Yerel-yalnız uygulama için EDPB'nin doğrudan bir görüşü bulunamadı (**doğrulanamadı**).
- Pratik sonuç: geliştiriciye hiçbir kişisel veri ulaşmıyorsa (analitik, çökme raporu, bulut yedek, destek formu dahil) geliştiricinin işleme faaliyeti yoktur; çökme raporu ya da analitik eklendiği anda veri sorumlusu sıfatı ve m.9 yükümlülükleri doğar.

### B.3 Türkiye — KVKK

- Sağlık ve cinsel hayat verisi özel nitelikli kişisel veridir (m.6/1). 7499 sayılı Kanun (yürürlük 1 Haziran 2024) m.6/3'ü yeniden düzenledi: sağlık ve cinsel hayat verisinin ayrı rejimi kaldırıldı, tüm özel nitelikli veriler için genişletilmiş ortak işleme şartları getirildi; açık rıza bu şartlardan biridir. Bir tüketici uygulaması için fiilen uygulanabilir şart açık rızadır (yorum). https://www.erdem-erdem.av.tr/bilgi-bankasi/kisisel-verilerin-korunmasi-kanununda-degisiklik ; https://www.hukukihaber.net/kvk-kanununda-ozel-nitelikli-kisisel-verilerin-islenmesi-ve-yurt-disina-veri-aktarimi-kapsaminda-yapilan-degisikliklere-iliskin-degerlendirmeler
- Kurum rehberi: "Özel Nitelikli Kişisel Verilerin İşlenmesine İlişkin Rehber" (Şubat 2025). https://www.alomaliye.com/2025/03/03/ozel-nitelikli-kisisel-verilerin-islenmesine-iliskin-rehber/
- Yurt dışına aktarım (m.9, yeni rejim): yeterlilik kararı → uygun güvenceler (standart sözleşme, bağlayıcı şirket kuralları, taahhütname) → arızi istisnalar; açık rıza artık ilk dayanak değil, istisnai konumda. Kurul rehberi 2 Ocak 2025. Standart sözleşmenin imzadan sonra 5 iş günü içinde Kurula bildirilmesi yükümlülüğü ve cezası için: https://www.cottgroup.com/tr/component/zoo/item/standard-contract-notification-obligation-and-penalties?Itemid=204 (süre ayrıntısı bu oturumda sayfadan okunamadı, **kısmen doğrulandı**). Sonuç: yurt dışı sunuculu analitik, çökme raporu ya da bulut senkronu eklenirse m.9 devreye girer.
- VERBİS: 04.09.2025 tarihli 2025/1572 sayılı Kurul kararı (RG 01.10.2025, 33034) istisna eşiğini yıllık mali bilanço 100 milyon TL'ye yükseltti (çalışan sayısı eşiği 50); 25.12.2025 tarihli 2025/2393 sayılı karar uygulama esaslarını netleştirdi. Ana faaliyeti özel nitelikli veri işlemek olanlar için ayrı ölçütler var; tam metni görülemedi (**doğrulanamadı**). İstisna yalnızca sicil kaydını kaldırır; aydınlatma ve veri güvenliği yükümlülükleri sürer. https://www.alomaliye.com/2025/10/01/ozel-nitelikli-kisisel-veri-isleme-veri-sorumlularinin-verbise-kayit-yukumlulugune-iliskin-istisna-kriteri/ ; https://www.alomaliye.com/2026/01/13/kisisel-verileri-koruma-kurulunun-2025-1572-sayili-kararinin-uygulama-esaslari/ ; https://www.hukukihaber.net/kisisel-verileri-koruma-kurulunun-04092025-tarihli-ve-20251572-sayili-karari-isiginda-verbis-kayit-yukumlulugunun-istisna-kapsaminda-degisimi
- Veri yalnızca cihazdaysa geliştirici veri sorumlusu mudur? Doğrudan yanıtlayan Kurul kararı bulunamadı (**doğrulanamadı**). Kurul veri sorumlusunu "işlemenin amaç ve vasıtalarını belirleyen" üzerinden değerlendiriyor; geliştiriciye veri ulaşmıyorsa işleme faaliyeti olmadığı savunulabilir (yorum; hukukçu teyidi gerekir).
- Mobil bildirimler: Kurul'un Ocak 2026 kamuoyu duyurusu, anlık bildirimlerde amaçların ayrıştırılmasını ve tek tık toplu rızanın sonunu işaret ediyor (pazarlama bildirimleri için). Yerel hatırlatma bildirimi pazarlama değildir, yine de bildirim türleri ayrı ayrı açılıp kapanabilmeli. https://www.erdem-erdem.av.tr/bilgi-bankasi/mobil-uygulamalar-uzerinden-gonderilen-anlik-bildirimlere-iliskin-kamuoyu-duyurusu-yayimlandi
- Çocuklar: KVKK'da rıza için açık bir yaş sınırı yok; ayırt etme gücü ve ehliyet kurallarına göre değerlendiriliyor (GDPR'da 16, üye devletlerce 13'e inebilir). Ergen kullanıcı bekleniyorsa hesap/veri toplamama en güvenli yol. https://www.hukukihaber.net/gdpr-ve-kvkk-bakimindan-cocuklarin-kisisel-verilerinin-korunmasi-ve-konuya-iliskin-kurul-kararinin-degerlendirilmesi
- Kişisel Sağlık Verileri Hakkında Yönetmelik değişikliği: RG 4 Temmuz 2026, 33300 (tek kaynak; sağlık hizmeti sunucularına yöneliktir, tüketici uygulamasına etkisi **doğrulanamadı**). https://www.erdem-erdem.av.tr/bilgi-bankasi/saglik-verilerinin-islenmesine-iliskin-yeni-duzenleme

### B.4 ABD eyalet ve federal kurallar

- Washington My Health My Data Act (MHMDA): tüketici sağlık verisi (üreme sağlığı dahil) için rıza temelli rejim; Consumer Protection Act üzerinden özel dava hakkı (zarar ispatı gerekir, üç kata kadar tazminat). İlk dava: Maxwell v. Amazon.com, 10 Şubat 2025 (konum verisi/SDK). https://www.orrick.com/en/Insights/2025/02/First-Lawsuit-Filed-Under-Washingtons-My-Health-My-Data-Act ; https://www.wilmerhale.com/en/insights/blogs/wilmerhale-privacy-and-cybersecurity-law/20250220-first-lawsuit-filed-under-washingtons-my-health-my-data-act
- Nevada (SB 370) ve Connecticut benzer yasalara sahip, özel dava hakkı yok; New York Health Information Privacy Act'in güncel durumu **doğrulanamadı**.
- Kaliforniya AB 254 (yürürlük 1 Ocak 2024): "üreme veya cinsel sağlık uygulaması bilgisi" CMIA'daki "tıbbi bilgi" tanımına eklendi; adet/doğurganlık uygulamaları "sağlık hizmeti sağlayıcısı" sayılır. https://www.afslaw.com/perspectives/health-care-counsel-blog/california-adopts-privacy-protections-digital-reproductive ; https://www.manatt.com/insights/newsletters/health-highlights/california-enacts-laws-to-further-protect-reproduc
- FTC Health Breach Notification Rule: Premom'da uygulandı; 2024 güncellemesinin sağlık uygulamalarını açıkça kapsadığı bilgisi bu oturumda **doğrulanamadı**.
- Sonuç: veri toplamayan uygulama bu yasaların çoğunun tetikleyicisini (toplama, paylaşma, satış) oluşturmaz; yine de gizlilik politikasında bunu açıkça beyan etmek gerekir.

### B.5 Mağaza kuralları

**Apple** (https://developer.apple.com/app-store/review/guidelines/ ; https://developer.apple.com/app-store/app-privacy-details/)
- 1.4.1: tıbbi uygulamalar daha sıkı incelenir; hekime danışma hatırlatması; doğruluk iddiaları için veri ve yöntem açıklanmalı.
- 5.1.1(v): hesap temelli önemli özellik yoksa giriş zorunlu tutulamaz; hesap varsa uygulama içi hesap silme şart.
- 5.1.2(i): kişisel veri izin olmadan paylaşılamaz; üçüncü taraf (üçüncü taraf yapay zekâ dahil) paylaşımı açıkça bildirilip açık izin alınmalı; bildirim izni vermek özellik koşulu yapılamaz.
- 5.1.3(i): sağlık verisi reklam, pazarlama veya kullanım temelli veri madenciliği için kullanılamaz/paylaşılamaz. 5.1.3(ii): HealthKit'e yanlış veri yazılamaz ve **kişisel sağlık bilgisi iCloud'da saklanamaz**.
- 5.1.2(vi): HealthKit verisi pazarlama/reklam için kullanılamaz.
- Gizlilik etiketi: "Collect" = veriyi cihaz dışına, isteği anlık karşılamak için gerekenden uzun süre erişilebilir biçimde iletmek. "Yalnızca cihazda işlenen veri 'toplanmış' sayılmaz ve beyan edilmesi gerekmez." Sağlık verisi türü: "Health"; gebelik bilgisi "Sensitive Info". Gizlilik politikası URL'si zorunlu. Hedef: "Data Not Collected" etiketi.
- AB DSA: tüccar (trader) durumu beyanı zorunlu; tüccar sayılırsan adres, telefon ve e-posta AB mağaza sayfasında gösterilir (bireyler posta kutusu verebilir). Ücretsiz ve gelirsiz bir uygulama için "tüccar değil" beyanı mümkün olabilir; değerlendirme geliştiriciye aittir. https://www.revenuecat.com/blog/growth/am-i-a-trader-and-other-existential-questions-for-developers ; https://9to5mac.com/2024/08/15/app-store-eu-developers-address/
- 28 Nisan 2026'dan beri yüklemeler Xcode 26+ ve iOS 26 SDK ile derlenmiş olmalı. https://www.developer.apple.com/news/upcoming-requirements/

**Google Play**
- Health Content and Services politikası: sağlık uygulamaları Play Console'da "Health apps declaration" formunu doldurur (sağlık özelliği olmayanlar bile formu yanıtlar), kişisel/hassas veriyi anlatan gizlilik politikası yayımlar; yanıltıcı ya da zararlı sağlık işlevi yasak; tıbbi işlev için düzenleyici kanıt ya da feragat; AB için MDCG kılavuzu ölçütleri politikaya işlendi. Adet takibine özgü ayrı bir kural metni bu oturumda görülemedi (**doğrulanamadı**). https://support.google.com/googleplay/android-developer/answer/16555673 ; https://developer.android.com/health-and-fitness/health-connect/publish
- Data safety: "Collect" = veriyi cihaz dışına iletmek; yalnızca cihazda işlenen ve dışarı gönderilmeyen veri beyan edilmez; veri toplamayan uygulama da formu doldurur ve gizlilik politikası verir. https://support.google.com/googleplay/android-developer/answer/10787469?hl=en
- Health Connect: verisi kişisel ve hassas sayılır; yalnızca temel işlev için gereken izinler; Play sayfasındaki ve Health Connect'teki gizlilik politikası aynı olmalı; veri türü değişirse form yeniden doldurulur. https://developer.android.com/health-and-fitness/health-connect/declare-access
- Hedef API: 31 Ağustos 2026'dan itibaren yeni uygulama ve güncellemeler Android 16 (API 36) hedeflemeli. https://developer.android.com/google/play/requirements/target-sdk
- Yeni kişisel hesaplar (13 Kasım 2023 sonrası): üretime çıkmadan önce en az 12 test kullanıcısıyla kesintisiz 14 gün kapalı test; her yeni uygulama için ayrı. Kurumsal hesaplar muaf. https://www.testerscommunity.com/guides/how-many-testers-do-you-need-google-play (resmî yardım sayfası açılamadı; **ikincil kaynaklardan**)

### B.6 Tıbbi cihaz sınırı

- ABD: 21 CFR 884.5370 "gebeliği önleme amaçlı yazılım uygulaması" sınıf II (özel kontroller). Natural Cycles ve Clue Birth Control bu yolla yetkilendi (A.7). Yalnızca takip/tahmin yapan uygulamaların FDA'daki konumu (genel sağlıklı yaşam ürünü / uygulama takdiri) bu oturumda birincil kaynaktan **doğrulanamadı**.
- AB MDR: MDCG 2019-11'e göre yazılım, amacı MDR'deki tıbbi cihaz tanımına giriyorsa tıbbi cihaz yazılımıdır. Kılavuzdaki sınıf I örneği: doğrulanmış istatistiksel algoritmayla doğurganlık durumunu hesaplayarak **gebe kalmayı destekleyen** uygulama. Gebeliği önleme amaçlı uygulama Kural 15 ile sınıf IIb'dir; İsviçre Federal İdare Mahkemesi 2022'de bunu teyit etti. Kılavuzun revize hâli Haziran 2025'te yayımlandı (Kural 11 yorumu genişledi; sınıf I varsayımları yeniden değerlendirilmeli). https://blog.johner-institute.com/regulatory-affairs/class-i-software/ ; https://www.mondaq.com/life-sciences-biotechnology-nanotechnology/1246458/software-as-a-medical-device-swiss-federal-administrative-court-confirms-fertility-tracker-app-is-a-medical-device ; https://www.emergobyul.com/news/european-revision-primary-software-guidance-mdcg-2019-11-revision-1-small-changes-meaningful
- Türkiye: Tıbbi Cihaz Yönetmeliği'nin (TİTCK) MDR ile uyumlu olduğu genel bilgisi bu oturumda **doğrulanamadı**.
- Sınırın uygulamadaki karşılığı:
  - Güvenli taraf: kayıt tutma, takvim, geçmiş istatistikleri, "tahmini sonraki adet" (bilgilendirme), genel sağlık eğitimi.
  - Gri alan: "gebe kalmak için en uygun günler" vaadi → AB'de en az sınıf I tıbbi cihaz iddiası doğurabilir. Doğurgan pencereyi "tahmini, bilgilendirme amaçlı" etiketle, pazarlamada gebe kalma vaadi kullanma; AB'de bu özelliği öne çıkarmadan önce mevzuat danışmanlığı al.
  - Kırmızı çizgi: korunma/doğum kontrolü iddiası, teşhis ("PCOS tespiti"), tedavi önerisi.

### B.7 Önerilen gizlilik-öncelikli mimari

1. **Hesap yok, sunucu yok.** Kayıt, e-posta, cihaz kimliği, reklam kimliği toplanmaz. (Apple 5.1.1(v) ile uyumlu; Mozilla'nın tam puan ölçütü.)
2. **Üçüncü taraf SDK yok.** Analitik, atıf, reklam, çökme raporlama SDK'sı eklenmez. Hata bildirimi için kullanıcı eliyle "tanılama dosyası paylaş" (sağlık verisi içermeyen) seçeneği yeterli.
3. **Şifreli yerel depolama.** SQLCipher'lı SQLite; anahtar cihazın güvenli donanımında (C.2).
4. **Yedeklerin kontrolü.**
   - Android Auto Backup veritabanını Google Drive'a kopyalar; `android:allowBackup="false"` ya da veritabanını yedek kurallarından çıkar (expo-secure-store kendi verisini otomatik hariç tutar; veritabanı için ayrı kural gerekir).
   - iOS: 5.1.3(ii) sağlık bilgisinin iCloud'da saklanmasını yasaklar. Veritabanı dosyası iCloud cihaz yedeğine giriyorsa bu kuralla çelişebilir; dosyayı yedekten hariç tutmak (isExcludedFromBackup) güvenli yoldur. Expo'da bunun hazır API'si olup olmadığı **doğrulanamadı**; gerekirse küçük bir config plugin/yerel modül yazılır.
   - Kullanıcı kontrollü yedek: parola ile şifrelenmiş dışa aktarım dosyası (ör. scrypt/Argon2 ile türetilmiş anahtar + AES-GCM), kullanıcı istediği yere kaydeder; içe aktarma aynı dosyadan. Ayrıca hekim için okunabilir PDF/CSV özet (şifresiz, açık uyarıyla).
5. **Uygulama kilidi.** Biyometri + PIN yedeği; arka plana geçince içerik gizleme (son uygulamalar ekranında bulanık/boş görünüm); isteğe bağlı ekran görüntüsü engeli.
6. **Gizli bildirimler.** Varsayılan bildirim metni nötr ("Hatırlatma"), ayrıntılı metin kullanıcı tercihi; uygulama adı ve simgesi için isteğe bağlı nötr görünüm (ileriki sürüm).
7. **Tek dokunuşla tüm veriyi sil.** Veritabanı dosyası + anahtar + bildirimler birlikte silinir (iOS'ta SecureStore anahtarları yeniden kurulumda kalabildiği için ilk açılışta yetim anahtar temizliği yapılmalı).
8. **Ağ izni en aza.** Uygulama çalışma zamanında hiçbir ağ isteği yapmamalı; bu, bağımsız olarak doğrulanabilir bir vaat olur. OTA güncelleme (expo-updates) kullanılacaksa bunun bir ağ isteği olduğu politikada belirtilmeli; en temiz seçenek OTA'yı kapatmaktır.
9. **Şeffaflık.** Kısa, sade Türkçe/İngilizce gizlilik politikası (herkese açık URL şart); mümkünse açık kaynak.
10. **İleride bulut istenirse:** uçtan uca şifreli, isteğe bağlı, varsayılan kapalı; bu durumda KVKK m.6/m.9, VERBİS değerlendirmesi, GDPR m.9 ve MHMDA yükümlülükleri yeniden doğar.

---

## C. Teknik uygulama

### C.1 Expo / React Native güncel durum (Kasım 2026)

- Güncel kararlı sürüm: **Expo SDK 58** (15 Ekim 2026), React Native 0.88 ile; iOS 27 için derlenmiş. npm'de `expo@58.0.25`, `react-native@0.88.1` (16.11.2026). https://expo.dev/changelog/sdk-58
- Uyumluluk (Expo sürüm tablosu, arama özetinden): Android 7+ (minSdk 24), compileSdk 37, targetSdk 36; iOS 16.4+; Xcode 26.4+; Node en az 22.13. targetSdk 36, Play'in 31 Ağustos 2026 koşulunu karşılar. https://docs.expo.dev/versions/latest/
- React sürümü: üçüncü taraf bir PR başlığında "React 19.3" geçiyor (**doğrulanamadı**).
- SDK 58'in önemli değişiklikleri (changelog arama özeti + paket CHANGELOG'ları):
  - iOS'ta sahne tabanlı (scene-based) yaşam döngüsü; `AppDelegate.swift` özelleştirenler geçiş kılavuzuna bakmalı.
  - RN 0.87 ile Strict TypeScript API varsayılan; `react-native/Libraries/*` derin içe aktarmaları tip hatası.
  - Kaldırılan RN API'leri: `InteractionManager`, `Touchable` kök dışa aktarımı, `Modal` `animated` prop'u, `StatusBar`'ın `backgroundColor`/`translucent` prop'ları.
  - `expo-sqlite`: libSQL desteği kaldırıldı; SQLite 3.53.3 ve SQLCipher 4.17.0'a güncellendi. https://github.com/expo/expo/blob/main/packages/expo-sqlite/CHANGELOG.md
  - `expo-notifications`: ön plandaki bildirimler artık varsayılan olarak gösteriliyor; 58.1.0 ile `enableRemoteNotifications: false` eklenti seçeneği (yalnızca yerel bildirim kullanan uygulamalar APNs yetkisi almaz); 58.1.1 ile `getExactAlarmPermissionsAsync`/`requestExactAlarmPermissionsAsync`. https://github.com/expo/expo/blob/main/packages/expo-notifications/CHANGELOG.md
  - `expo-router`: gezinme çekirdeği değişti; router projeleri varsayılan olarak sunucu çıktısı üretir (yalnız mobil uygulamada etkisi sınırlı).
  - Expo CLI `NODE_ENV`'i komuta göre ayarlar; Android şablonunda yayın derlemelerinde R8 varsayılan açık.
  - macOS henüz desteklenmiyor.
- Önceki sürümler: SDK 57 (30 Haziran 2026, RN 0.86; `expo prebuild` yerel dizinleri varsayılan olarak temizleyip yeniden üretir), SDK 56 (21 Mayıs 2026, RN 0.85, Expo UI üretime hazır). https://expo.dev/changelog/sdk-57 ; https://expo.dev/changelog/sdk-56
- Yeni Mimari'nin (New Architecture) artık tek seçenek olduğu bilgisi bu oturumda **doğrulanamadı**; pratikte kullanılacak kütüphanelerin hepsi (Nitro modülleri dahil) Yeni Mimari gerektiriyor.
- Expo Go sınırları: SQLCipher Expo Go'da çalışmaz; Face ID Expo Go'da desteklenmez; HealthKit/Health Connect köprüleri Expo Go'da çalışmaz. Proje baştan **development build** (`expo-dev-client`) ile kurulmalı.

### C.2 Önerilen yığın ve doğrulanmış sürümler (npm, 16.11.2026)

| İhtiyaç | Paket | Sürüm | Not |
|---|---|---|---|
| Çatı | `expo` / `react-native` | 58.0.25 / 0.88.1 | |
| Gezinme | `expo-router` | 58.0.31 | |
| Veritabanı | `expo-sqlite` | 58.0.17 | SQLCipher eklenti seçeneği `useSQLCipher: true` |
| Tip güvenli sorgu (isteğe bağlı) | `drizzle-orm` | 0.45.4 | SDK 58 uyumu ayrıca denenmeli |
| Alternatif veritabanı | `@op-engineering/op-sqlite` | 19.0.5 | SQLCipher destekler; gerek duyulursa |
| Anahtar saklama | `expo-secure-store` | 58.0.3 | Keychain / Android Keystore |
| Rastgele anahtar | `expo-crypto` | 58.0.8 | |
| Yerel bildirim | `expo-notifications` | 58.1.9 | |
| Biyometri | `expo-local-authentication` | 58.0.3 | |
| Yerel ayar | `expo-localization` | 58.0.5 | |
| Çeviri | `i18next` + `react-i18next` | 27.1.3 + 18.0.2 | alternatif `i18n-js` 4.5.4 |
| Tarih | `date-fns` | 4.4.0 | `tr` yerel ayarı |
| Takvim | `@marceloterreiro/flash-calendar` | 2.0.0 | `@shopify/flash-list` ≥2 gerektirir |
| Takvim (alternatif) | `react-native-calendars` | 1.1314.0 | Wix; son kararlı sürüm Ocak 2026 |
| Dosya / paylaşım | `expo-file-system`, `expo-sharing`, `expo-document-picker` | 58.0.13, 58.0.23, 58.0.5 | Dışa/içe aktarım |
| HealthKit | `@kingstinct/react-native-healthkit` | 16.2.0 | Nitro modülleri; RN ≥0.79, React ≥19 |
| Health Connect | `react-native-health-connect` | 4.1.3 | v4'ten beri Expo eklentisi dahil; minSdk 26 |
| Geliştirme derlemesi / CLI | `expo-dev-client`, `eas-cli` | 58.0.20, 27.10.0 | |

`react-native-health` 1.19.0 en son Ekim 2024'te yayımlanmış; yeni proje için önerilmez.

**expo-sqlite + SQLCipher** (kaynak: https://docs.expo.dev/versions/latest/sdk/sqlite/ ; okunan dosya: https://github.com/expo/expo/blob/main/docs/pages/versions/v58.0.0/sdk/sqlite.mdx)

```json
{ "expo": { "plugins": [["expo-sqlite", { "useSQLCipher": true }]] } }
```
```ts
const db = await SQLite.openDatabaseAsync('app.db');
const cipher = await db.getFirstAsync<{ cipher_version: string }>('PRAGMA cipher_version');
if (cipher == null) throw new Error('SQLCipher yok: veritabanı şifrelenmeyecek');
await db.execAsync(`PRAGMA key = '${key}'`);
```
- Belgedeki kritik uyarı: ikili dosya SQLCipher içermiyorsa `PRAGMA key` hata vermeden yok sayılır ve veritabanı **şifresiz** kalır (Expo Go'da, `prebuild` yeniden çalıştırılmadığında ya da ilgili platformda `useSQLCipher` kapalıyken). `PRAGMA cipher_version` denetimi her açılışta yapılmalı ve CI'da test edilmeli.
- SQLCipher Android, iOS ve macOS'ta desteklenir; Expo Go'da desteklenmez.
- Android 16 KB sayfa boyutu ile `useSQLCipher` uyarısı için açık bir GitHub kaydı var; güncel durumu **doğrulanamadı**: https://github.com/expo/expo/issues/39792
- Anahtar yönetimi (öneri): ilk açılışta `expo-crypto` ile 32 baytlık rastgele anahtar üret, onaltılık dizge olarak `expo-secure-store`'a yaz, her açılışta `PRAGMA key` ile ver. SQLCipher'ın ham anahtar sözdizimi (`"x'...'"`) için Zetetic belgesi bu oturumda okunamadı (**doğrulanamadı**).

**expo-secure-store** (https://github.com/expo/expo/blob/main/docs/pages/versions/v58.0.0/sdk/securestore.mdx)
- Android: SharedPreferences, Android Keystore ile şifreli; uygulama kaldırılınca silinir. iOS: Keychain; aynı bundle ID ile yeniden kurulumda veriler **kalabilir** (garanti değil).
- Büyük değerler platformca reddedilebilir (geçmişte iOS'ta yaklaşık 2048 bayt sınırı); yalnızca anahtar/PIN özeti gibi küçük veriler saklanmalı.
- `requireAuthentication: true` ile saklanan veri, biyometri ayarı değişince (ör. yeni parmak izi) **erişilemez** olur. Veritabanı anahtarını buna bağlamak veri kaybı riski taşır; kilit ekranını uygulama düzeyinde (`expo-local-authentication`) uygulayıp anahtarı `requireAuthentication` olmadan saklamak daha güvenli bir denge.
- Android Auto Backup: özel yedek yapılandırması yoksa eklenti SecureStore verisini yedekten otomatik hariç tutar.
- Dışa aktarım uyumluluğu: belge `ios.config.usesNonExemptEncryption: false` ayarını gösterir. SQLCipher (AES-256) eklenince bu beyanın hâlâ geçerli olup olmadığı **doğrulanamadı**; Apple'ın "export compliance" belgesi kontrol edilmeli.

**expo-notifications (yerel)** (https://github.com/expo/expo/blob/main/docs/pages/versions/v58.0.0/sdk/notifications.mdx)
- Yerel bildirimler Expo Go'da da çalışır; uzak (push) bildirimler Android'de SDK 53'ten beri Expo Go'da yok. Bu uygulamada push gerekmez: `enableRemoteNotifications: false`.
- Android 13+: bildirim izni istemi, en az bir bildirim kanalı oluşturulmadan görünmez → önce `setNotificationChannelAsync`.
- Tam zamanlı alarm: Android 12+'da `SCHEDULE_EXACT_ALARM` gerekir, Android 14+'da yeni kurulumlarda varsayılan olarak reddedilir; `USE_EXACT_ALARM` yalnızca alarm/saat/takvim uygulamalarına Play politikasıyla serbest. Adet hatırlatması için tam zamanlı alarm gerekmez; izin isteme.
- `RECEIVE_BOOT_COMPLETED` otomatik eklenir (yeniden başlatmada zamanlanmış bildirimler geri yüklenir).
- Strateji: her veri değişiminde tüm zamanlanmış bildirimleri iptal edip yeniden kur (adet öncesi 2 gün, beklenen gün, gecikme, günlük kayıt hatırlatması). iOS'ta bekleyen yerel bildirim sayısı sınırı (64) bilgisi bu oturumda **doğrulanamadı**; ileriye en fazla 2–3 döngü zamanla.

**expo-local-authentication** (https://github.com/expo/expo/blob/main/docs/pages/versions/v58.0.0/sdk/local-authentication.mdx)
- Android'de Biometric Prompt, iOS'ta Face ID/Touch ID. iOS için `faceIDPermission` (NSFaceIDUsageDescription) eklenti seçeneği. Face ID Expo Go'da test edilemez.
- Biyometrisi olmayan cihazlar için uygulama içi PIN (özeti SecureStore'da) şart.

**i18n** (https://github.com/expo/expo/blob/main/docs/pages/guides/localization.mdx)
- `expo-localization` `getLocales()` ile cihaz dilini verir; `supportedLocales: ["tr","en"]` eklenti seçeneği sistem ayarlarından uygulama bazlı dil seçimini açar. Expo kılavuzu örnekte `i18n-js` kullanır; Lingui ve `react-i18next` de önerilenler arasında.
- Öneri: `i18next` + `react-i18next` (çoğul biçimleri, ad alanları, tip güvenliği). Türkçeye özgü dikkat noktaları: haftanın ilk günü Pazartesi, `toLocaleUpperCase('tr')` (i/İ, ı/I), tarih biçimi "14 Aralık". Tıbbi metinler ve feragat iki dilde de uzman gözden geçirmesinden geçmeli.

**Takvim bileşeni**
- `@marceloterreiro/flash-calendar` 2.0.0: FlashList tabanlı, gün hücresi özelleştirmesi ve aralık vurgusu için uygun; `@shopify/flash-list` ≥2 gerektirir.
- `react-native-calendars` 1.1314.0: olgun, "period marking" hazır; son kararlı sürüm Ocak 2026, sürüm sıklığı düşük.
- Üçüncü yol: `date-fns` + FlashList ile özel takvim (tahmin aralığının soluk bantla gösterimi gibi özel çizimler için en esnek).
- SDK 58 / RN 0.88 ile gerçek uyumluluk her iki kütüphane için de denenerek doğrulanmalı (**doğrulanamadı**).

**HealthKit / Health Connect köprüleri**
- HealthKit: `@kingstinct/react-native-healthkit` (config plugin: `NSHealthShareUsageDescription`, `NSHealthUpdateUsageDescription`; `react-native-nitro-modules` gerekir; Expo Go'da çalışmaz). https://github.com/kingstinct/react-native-healthkit
- İlgili HealthKit türleri: `menstrualFlow`, `intermenstrualBleeding`, `ovulationTestResult`, `cervicalMucusQuality`, `basalBodyTemperature`, `sexualActivity` (Apple belge sayfası içerik döndürmedi; adlar **doğrulanamadı**, https://developer.apple.com/documentation/healthkit/data-types).
- Health Connect: `react-native-health-connect` 4.x; kayıt türleri depoda doğrulandı: `MenstruationPeriod`, `MenstruationFlow`, `IntermenstrualBleeding`, `OvulationTest`, `CervicalMucus`, `BasalBodyTemperature`, `SexualActivity`. minSdk 26 ister (`expo-build-properties` ile); Expo'nun varsayılan 24'ünden yüksektir. https://github.com/matinzd/react-native-health-connect
- Öneri: sağlık platformu entegrasyonunu v1 dışında tut. Gerekçe: ek mağaza beyanları (Health apps declaration, HealthKit yetkisi), 5.1.3 kısıtları, veri yüzeyinin büyümesi. v2'de yalnızca kullanıcı isteğiyle, tek yönlü (uygulamadan sağlık platformuna yazma) başlanabilir.

### C.3 Mimari iskelet (öneri)

```
app/                     expo-router ekranları (takvim, kayıt, içgörüler, ayarlar, kilit)
src/domain/prediction/   A.5 algoritması: saf TypeScript, yan etkisiz, %100 birim testli
src/domain/flags/        A.6 kuralları
src/data/                expo-sqlite (SQLCipher) şema + göçler; repository katmanı
src/security/            anahtar yönetimi, uygulama kilidi, dışa aktarım şifrelemesi
src/notifications/       zamanlama (tahmin değişince yeniden kur)
src/i18n/                tr.json, en.json
```
- Şema çekirdeği: `day_log(date PK, flow, spotting, symptoms JSON, mood, note, bbt, lh)`, `period(id, start_date, end_date, user_confirmed)`, `settings(key, value)`. Tahminler saklanmaz, her açılışta hesaplanır.
- Tarihler saat dilimsiz `YYYY-MM-DD` dizgesi olarak tutulmalı (saat dilimi/yaz saati kaymalarında gün kaymasını önler).
- Tahmin modülü için özellik tabanlı testler: rastgele döngü dizilerinde aralık her zaman merkez tarihi içermeli, aykırı ekleme merkezi sınırlı kaydırmalı.

### C.4 Yayınlama adımları ve maliyetler

| Kalem | Maliyet | Not |
|---|---|---|
| Apple Developer Program | Yıllık 99 ABD doları (yerel para biriminde fiyat değişebilir) | Bireysel kayıt: iki adımlı doğrulamalı Apple hesabı, yasal reşit yaş, resmî ad. Ücret muafiyeti yalnızca kâr amacı gütmeyen kuruluş, eğitim kurumu ve kamu için. https://developer.apple.com/programs/enroll/ |
| Google Play Console | Tek seferlik 25 ABD doları | Kişisel hesapta 12 test kullanıcısı × 14 gün kapalı test koşulu |
| EAS Build | Ücretsiz katman: ayda 15 Android + 15 iOS derleme, düşük öncelik, 45 dk sınırı (üçüncü taraf güncel özetlerinden; eski kaynaklar 30 derleme diyor). Starter 19 dolar/ay (45 dolar derleme kredisi) | Resmî fiyat sayfası açılamadı (**ikincil kaynak**). https://docs.expo.dev/billing/plans.md ; https://expo.dev/pricing |
| Yerel derleme | Ücretsiz | `eas build --local` ya da `npx expo run:*`; iOS için macOS + Xcode 26.4+ gerekir |
| Gizlilik politikası barındırma | Ücretsiz mümkün | Her iki mağaza herkese açık URL ister |
| Alan adı (isteğe bağlı) | Yıllık küçük tutar | Destek e-postası ve politika için |

Adımlar:
1. `npx create-expo-app` (SDK 58) → `expo-dev-client` ekle → `app.json` eklentileri (sqlite/SQLCipher, secure-store, local-authentication, notifications `enableRemoteNotifications:false`, localization).
2. `eas build --profile development` ile cihazda geliştirme derlemesi (Expo Go yetmez).
3. Android: `allowBackup` ve yedek kuralları; hedef API 36 doğrulaması.
4. Mağaza varlıkları: TR/EN açıklama (iddiasız dil), ekran görüntüleri, gizlilik politikası URL'si, destek iletişimi.
5. App Store Connect: App Privacy = "Data Not Collected"; yaş derecelendirme anketi; export compliance; DSA tüccar beyanı; inceleme notuna "hesap yok, veri cihazda, tıbbi cihaz değil" açıklaması. Kategori: Health & Fitness (Medical değil).
6. Play Console: Data safety (veri toplanmıyor/paylaşılmıyor), Health apps declaration, içerik derecelendirme, hedef kitle; kapalı test (12 kişi, 14 gün) → üretim erişimi başvurusu.
7. `eas submit` ile gönderim; TestFlight ile iOS beta.

**Türkiye'den bireysel geliştirici notları**
- Apple üyelik ücreti: Apple forumlarında Türkiye'den 1.029 TL ödendiğine dair kullanıcı paylaşımları var; aynı forumlarda Türkiye'den ödemenin reddedildiği ve kaydın günlerce "Pending" kaldığı bildirimleri de var. Güncel resmî TL fiyatı **doğrulanamadı**. https://developer.apple.com/forums/thread/842043 ; https://developer.apple.com/forums/thread/809589
- Kayıt süresini takvime koy: Apple onayı gecikebilir; Google'da 14 günlük kapalı test zorunlu olduğundan yayın tarihinden en az 3–4 hafta önce hesaplar açılmalı ve 12 test kullanıcısı ayarlanmalı.
- Ücretsiz, reklamsız, uygulama içi satın almasız uygulamada gelir doğmadığı için vergi ve tüccar yükümlülükleri en aza iner. Gelir planlanırsa:
  - Türkiye dijital hizmet vergisi 1 Ocak 2026'dan itibaren %7,5'ten %5'e indi. https://www.cnbce.com/teknoloji/apple-app-store-gelirlerinde-turkiye-icin-vergi-guncellemesine-gitti-h24067
  - GİB'in 30.01.2026 tarihli özelgesi App Store/Google Play gelirlerinin vergilendirilmesini (kazanç indirimi, KDV istisnası) ele alıyor; şirketle ilgili olduğundan bireysel geliştiriciye uygulanması belirsiz. https://www.alomaliye.com/2026/02/18/app-store-ve-google-playden-elde-edilen-gelirler-nasil-vergilendirilir/
  - "Mobil uygulama geliştiriciliği kazanç istisnası, %15 stopaj, yıllık limit" bilgileri yalnızca bir blogda geçti (**doğrulanamadı**); mali müşavire danışılmalı.
  - Apple Small Business Program ile komisyon %15 (yıllık 1 milyon dolar altı; eşik üçüncü taraf kaynaktan). Google'ın 30 Haziran 2026'dan itibaren ilk 1 milyon dolarda %10 hizmet bedeli uyguladığı bilgisi tek kaynaklı (**doğrulanamadı**). https://developer.apple.com/programs/ ; https://www.ekonomigazetesi.com/kose-yazisi/dijital-ihracatta-munhasiran-cikmazi-73266
- AB'de yayımlanacaksa DSA tüccar beyanı: tüccar sayılırsan adres ve telefon mağaza sayfasında görünür; ev adresi yerine posta kutusu kullanılabilir.

---

## D. Açık kalan / yayın öncesi doğrulanacaklar

1. ACOG, NHS, CDC sayfalarının tam metni (eşiklerin birebir ifadesi).
2. Frasco v. Flo Health'te nihai tazminat kararı ve temyiz.
3. KVKK: yerel-yalnız uygulamada veri sorumlusu sıfatı (hukukçu görüşü); ana faaliyeti özel nitelikli veri olanlar için VERBİS ölçütleri.
4. AB MDR: doğurgan pencere gösteriminin "amaç" bakımından değerlendirilmesi (MDCG 2019-11 rev.1 metni).
5. iOS'ta veritabanı dosyasının iCloud yedeğinden hariç tutulması ve 5.1.3(ii) ile ilişkisi.
6. SQLCipher ile App Store export compliance beyanı.
7. Seçilen takvim kütüphanesinin SDK 58 / RN 0.88 uyumu; Android 16 KB sayfa boyutu + SQLCipher.
8. EAS fiyatları ve Apple TL üyelik ücreti (resmî sayfalar).
9. Feragat ve "doktora danışın" metinlerinin bir kadın doğum uzmanınca gözden geçirilmesi.

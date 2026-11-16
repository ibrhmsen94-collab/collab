# Döngüm — açma ve mağazalara yükleme

## 0. Hemen telefonda kullanmak için (mağaza gerekmez)
`telefon-uygulamasi/` klasörü kurulabilir bir web uygulamasıdır (PWA). İçindeki `OKU-BENI.txt` adımlarını izle: klasörü https://app.netlify.com/drop adresine bırak, telefonda aç, "Ana ekrana ekle". Yeniden üretmek için: `cd app && npm run build:web`.

## 1. Bilgisayarda açma
Gerekli: Node.js 20+ (https://nodejs.org).

```bash
cd app
npm install
npx expo start
```
- Telefonda: App Store / Play Store'dan **Expo Go** kur, terminaldeki QR kodu okut.
- Tarayıcıda: terminalde `w` tuşuna bas.
- Testler: `npm test` (birim), `npm run typecheck`.

## 2. Mağaza öncesi senin yapman gerekenler
1. **Hesaplar** (ücretli, onay birkaç gün sürebilir):
   - Apple Developer Program: yıllık 99 USD — https://developer.apple.com/programs/
   - Google Play Console: tek seferlik 25 USD — https://play.google.com/console
   - Expo hesabı (ücretsiz): https://expo.dev
2. **Uygulama kimliği:** `app/app.json` içindeki `ios.bundleIdentifier` ve `android.package` şu an `app.dongum`. Kendi alan adına göre değiştir (ör. `com.adin.dongum`); yayından sonra değiştirilemez.
3. **Simge ve açılış görseli:** `app/assets/` altındakiler Expo'nun varsayılan görselleri. Kendi 1024×1024 simgenle değiştir.
4. **Gizlilik politikası sayfası:** iki mağaza da herkese açık bir URL ister. İçerik basit: veri yalnızca cihazda, sunucuya hiçbir şey gönderilmiyor, üçüncü taraf yok.
5. **Gerçek telefonda deneme:** bildirimler, uygulama kilidi ve yedek paylaşımı yalnızca web önizlemesinde değil, telefonda denenmeli (henüz denenmedi).

## 3. Derleme ve yükleme (EAS)
```bash
npm install -g eas-cli
eas login
cd app
eas init
```
Deneme APK'sı (Android telefona doğrudan kurulur):
```bash
eas build --profile preview --platform android
```
Mağaza derlemeleri:
```bash
eas build --profile production --platform android
eas build --profile production --platform ios
```
Mağazaya gönderme:
```bash
eas submit --platform android
eas submit --platform ios
```
- iOS derlemesi için Mac gerekmez; EAS bulutta derler ve Apple hesabınla imzalar.
- Google Play, yeni kişisel hesaplarda yayından önce **12 test kullanıcısıyla 14 gün kapalı test** ister.
- İlk Android yüklemesi Play Console'dan elle yapılır (`.aab` dosyasını yükle); sonrakiler `eas submit` ile gider.

## 4. Mağaza formlarında dikkat
- **Veri beyanı:** Apple "Data Not Collected", Google Data safety "veri toplanmıyor/paylaşılmıyor" (uygulama hiçbir veriyi cihaz dışına göndermiyor).
- **Kategori:** Sağlık ve Fitness. Açıklamada **doğum kontrolü, gebe kalma ya da tanı iddiası yazma**; bu iddialar uygulamayı tıbbi cihaz kapsamına sokar.
- Uygulama içi "tıbbi cihaz değildir" uyarısı mevcut; mağaza açıklamasına da ekle.

## 5. Bilinen eksikler
- Veri cihazda şifrelenmeden duruyor (işletim sisteminin korumasına dayanıyor). Şifreli veritabanı sonraki adım.
- Yedek dosyası şifresiz.
- Hamilelik, perimenopoz, partner paylaşımı, giyilebilir cihaz bağlantısı yok.
- Ayrıntılı araştırma: `arastirma/` klasörü (yayın öncesi doğrulanacaklar listesi `02-tibbi-gizlilik-teknik.md` sonunda).

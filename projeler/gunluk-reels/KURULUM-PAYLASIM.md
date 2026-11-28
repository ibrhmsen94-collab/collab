# Otomatik paylaşım kurulumu (YouTube, Instagram, TikTok)

Her sabah yeni video `claude/gracious-pascal-i9slax` dalına geldiğinde GitHub Actions (`.github/workflows/reels-paylas.yml`)
TR ve EN videoyu aynı hesaplara yükler. Gizli anahtarlar yalnızca **GitHub Secrets**'ta durur.
Secret eklemek: GitHub'da depo → **Settings → Secrets and variables → Actions → New repository secret**.

Hangi platformun secret'ları eksikse o platform atlanır; istediğin sırayla kurabilirsin.

> Önemli: YouTube ve TikTok, yeni API projelerinden gelen videoları platform denetimi geçilene kadar **gizli** yayınlar.
> Denetim ücretsizdir (aşağıda). Instagram, kendi hesabın uygulamaya tanımlıysa hemen herkese açık paylaşır.

---

## 0. GitHub erişim anahtarı (token yenileme için, bir kez)
1. github.com → sağ üst profil → **Settings → Developer settings → Personal access tokens → Fine-grained tokens → Generate new token**.
2. Repository access: **Only select repositories → collab**. Permissions → **Secrets: Read and write**. Süre: 1 yıl.
3. Oluşan değeri `GH_PAT` adıyla secret olarak ekle.

## 1. Instagram (≈15 dk) — hemen herkese açık
Ön koşul: Instagram hesabın **Profesyonel (İşletme ya da İçerik Üreticisi)** olmalı (Ayarlar → Hesap türü).
1. developers.facebook.com → **My Apps → Create App** → kullanım: **Other** → tür: **Business**.
2. Uygulamaya **Instagram** ürününü ekle → **API setup with Instagram login**.
3. **Generate access tokens** bölümünde **Add account** → Instagram hesabınla giriş yap, izinleri onayla
   (`instagram_business_basic`, `instagram_business_content_publish`).
4. Hesabın yanında görünen **Generate token** → çıkan uzun ömürlü tokenı `IG_ACCESS_TOKEN` secret'ı yap.
5. Aynı satırdaki sayısal **Instagram user ID**'yi `IG_USER_ID` secret'ı yap.
Uygulama "Development" modunda kalabilir; kendi hesabın için onay gerekmez. Token 60 günlüktür, Action her çalışmada yeniler.

## 2. YouTube (≈15 dk) — denetime kadar gizli
1. console.cloud.google.com → yeni proje → **APIs & Services → Library → YouTube Data API v3 → Enable**.
2. **OAuth consent screen**: External, uygulama adı ver, kendi e-postanı test kullanıcısı ekle, sonra **Publish app**
   ("In production"; yoksa token 7 günde ölür. Doğrulanmamış uyarısı kendi hesabın için sorun değil).
3. **Credentials → Create credentials → OAuth client ID → Web application**.
   Authorized redirect URI: `https://developers.google.com/oauthplayground`
4. Client ID → `YT_CLIENT_ID`, Client secret → `YT_CLIENT_SECRET` secret'ları.
5. developers.google.com/oauthplayground → sağ üst ⚙ → **Use your own OAuth credentials** → ID ve secret'ı gir.
   Scope kutusuna `https://www.googleapis.com/auth/youtube.upload` yaz → **Authorize APIs** → kanal hesabınla giriş →
   **Exchange authorization code for tokens** → **Refresh token** değerini `YT_REFRESH_TOKEN` secret'ı yap.
6. Herkese açık yükleme için: **YouTube API Services Audit and Quota Extension Form** (support.google.com/youtube/contact/yt_api_form)
   doldur. Onaya kadar videolar "Özel" yüklenir; istersen YouTube Studio'dan elle "Herkese açık" yapabilirsin.

## 3. TikTok (≈20 dk + denetim) — denetime kadar sadece sana görünür
1. developers.tiktok.com → giriş → **Manage apps → Connect an app**.
2. Ürünler: **Login Kit** ve **Content Posting API** (Direct Post açık). Kapsamlar: `user.info.basic`, `video.publish`.
3. Login Kit → **Redirect URI**: `https://github.com/ibrhmsen94-collab/collab` (birebir; sonra yine aynısını gireceksin).
4. Uygulamayı incelemeye gönder (Submit for review). Onaylanınca **Client key** → `TT_CLIENT_KEY`, **Client secret** → `TT_CLIENT_SECRET`.
5. Tarayıcıda aç (CLIENT_KEY yerine kendi değerini koy):
   `https://www.tiktok.com/v2/auth/authorize/?client_key=CLIENT_KEY&scope=user.info.basic,video.publish&response_type=code&redirect_uri=https://github.com/ibrhmsen94-collab/collab&state=reels`
6. TikTok hesabınla onayla → GitHub sayfasına yönlenirsin; adres çubuğundaki `code=` ile `&state` arasındaki değeri kopyala.
7. GitHub → **Actions → TikTok yetkilendirme (tek seferlik) → Run workflow** → kodu ve redirect URI'yi gir.
   Kod birkaç dakika geçerli; hemen çalıştır. "TT_REFRESH_TOKEN kaydedildi" görünmeli.
8. Herkese açık paylaşım için uygulama sayfasından **Content Posting API audit** başvurusu yap. Onaya kadar TikTok
   hesabın **gizli** olmalı ve videolar "Sadece ben" yayınlanır.

---

## Deneme
GitHub → **Actions → Reels paylaş → Run workflow** → tarih `2026-11-27`, **kuru** işaretli → hangi platformların hazır
olduğunu gösterir. İşaretsiz çalıştırınca gerçekten yükler. Sonuç `cikti/TARIH/PAYLASIM-DURUM.json`'a yazılır;
başarıyla paylaşılan video bir daha yüklenmez.

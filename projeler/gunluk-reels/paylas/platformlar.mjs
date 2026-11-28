// Resmî API istemcileri: YouTube Data API v3, Instagram API (Instagram Login), TikTok Content Posting API.
// Tüm gizli değerler ortam değişkeninden (GitHub Secrets) gelir; hiçbiri loglanmaz.
import { readFileSync, statSync } from "node:fs";

const bekle = (ms) => new Promise((r) => setTimeout(r, ms));

async function istek(url, opt = {}, ad = "istek") {
  const r = await fetch(url, opt);
  const metin = await r.text();
  let json = null;
  try { json = metin ? JSON.parse(metin) : null; } catch {}
  if (!r.ok) throw new Error(`${ad} başarısız (HTTP ${r.status}): ${metin.slice(0, 400)}`);
  return { r, json };
}

// ---------- YouTube ----------
export async function youtubeToken(env) {
  const { json } = await istek("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ grant_type: "refresh_token", client_id: env.YT_CLIENT_ID, client_secret: env.YT_CLIENT_SECRET, refresh_token: env.YT_REFRESH_TOKEN }),
  }, "YouTube token");
  return json.access_token;
}

export async function youtubeYukle(token, dosya, meta, gizlilik = "public") {
  const boyut = statSync(dosya).size;
  const { r } = await istek("https://www.googleapis.com/upload/youtube/v3/videos?uploadType=resumable&part=snippet,status", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json; charset=UTF-8", "X-Upload-Content-Type": "video/mp4", "X-Upload-Content-Length": String(boyut) },
    body: JSON.stringify({
      snippet: { title: meta.title, description: meta.description, tags: meta.tags, categoryId: "27", defaultLanguage: meta.defaultLanguage, defaultAudioLanguage: meta.defaultLanguage },
      status: { privacyStatus: gizlilik, selfDeclaredMadeForKids: false },
    }),
  }, "YouTube başlat");
  const konum = r.headers.get("location");
  const { json } = await istek(konum, { method: "PUT", headers: { "Content-Type": "video/mp4", "Content-Length": String(boyut) }, body: readFileSync(dosya) }, "YouTube yükle");
  return { id: json.id, url: `https://youtube.com/shorts/${json.id}`, durum: json.status?.privacyStatus };
}

// ---------- Instagram (graph.instagram.com) ----------
const IG = "https://graph.instagram.com/v23.0";

export async function instagramTokenYenile(token) {
  const { json } = await istek(`https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token=${encodeURIComponent(token)}`, {}, "Instagram token yenile");
  return json.access_token;
}

export async function instagramYukle(token, kullaniciId, dosya, aciklama) {
  const boyut = statSync(dosya).size;
  const { json: kap } = await istek(`${IG}/${kullaniciId}/media`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ media_type: "REELS", upload_type: "resumable", caption: aciklama, share_to_feed: "true", access_token: token }),
  }, "Instagram kapsayıcı");
  await istek(kap.uri, { method: "POST", headers: { Authorization: `OAuth ${token}`, offset: "0", file_size: String(boyut) }, body: readFileSync(dosya) }, "Instagram yükle");
  for (let i = 0; i < 60; i++) {
    await bekle(10000);
    const { json } = await istek(`${IG}/${kap.id}?fields=status_code,status&access_token=${encodeURIComponent(token)}`, {}, "Instagram durum");
    if (json.status_code === "FINISHED") break;
    if (json.status_code === "ERROR" || json.status_code === "EXPIRED") throw new Error(`Instagram işleme hatası: ${json.status || json.status_code}`);
    if (i === 59) throw new Error("Instagram işleme 10 dakikada bitmedi");
  }
  const { json: yay } = await istek(`${IG}/${kullaniciId}/media_publish`, {
    method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ creation_id: kap.id, access_token: token }),
  }, "Instagram yayınla");
  return { id: yay.id };
}

// ---------- TikTok ----------
const TT = "https://open.tiktokapis.com/v2";

export async function tiktokToken(env) {
  const { json } = await istek(`${TT}/oauth/token/`, {
    method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ client_key: env.TT_CLIENT_KEY, client_secret: env.TT_CLIENT_SECRET, grant_type: "refresh_token", refresh_token: env.TT_REFRESH_TOKEN }),
  }, "TikTok token");
  if (!json.access_token) throw new Error(`TikTok token yanıtı geçersiz: ${json.error || "bilinmiyor"}`);
  return { access: json.access_token, refresh: json.refresh_token };
}

export async function tiktokYukle(token, dosya, baslik, tercih = "PUBLIC_TO_EVERYONE") {
  const json = { "Content-Type": "application/json; charset=UTF-8", Authorization: `Bearer ${token}` };
  const { json: ci } = await istek(`${TT}/post/publish/creator_info/query/`, { method: "POST", headers: json }, "TikTok hesap bilgisi");
  const secenek = ci.data?.privacy_level_options || [];
  const gizlilik = secenek.includes(tercih) ? tercih : (secenek.includes("SELF_ONLY") ? "SELF_ONLY" : secenek[0]);
  const boyut = statSync(dosya).size;
  const { json: ini } = await istek(`${TT}/post/publish/video/init/`, {
    method: "POST", headers: json,
    body: JSON.stringify({
      post_info: { title: baslik, privacy_level: gizlilik, disable_comment: false, disable_duet: false, disable_stitch: false },
      source_info: { source: "FILE_UPLOAD", video_size: boyut, chunk_size: boyut, total_chunk_count: 1 },
    }),
  }, "TikTok başlat");
  await istek(ini.data.upload_url, { method: "PUT", headers: { "Content-Type": "video/mp4", "Content-Range": `bytes 0-${boyut - 1}/${boyut}`, "Content-Length": String(boyut) }, body: readFileSync(dosya) }, "TikTok yükle");
  for (let i = 0; i < 40; i++) {
    await bekle(8000);
    const { json: st } = await istek(`${TT}/post/publish/status/fetch/`, { method: "POST", headers: json, body: JSON.stringify({ publish_id: ini.data.publish_id }) }, "TikTok durum");
    const s = st.data?.status;
    if (s === "PUBLISH_COMPLETE") return { id: ini.data.publish_id, gizlilik };
    if (s === "FAILED") throw new Error(`TikTok yayın hatası: ${st.data?.fail_reason}`);
  }
  return { id: ini.data.publish_id, gizlilik, not: "işleniyor" };
}

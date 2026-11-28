// Platform başına başlık/açıklama üretimi (saf fonksiyonlar, test edilir).
const etiket = (e) => (e.startsWith("#") ? e : "#" + e.replace(/\s+/g, ""));
const kes = (s, n) => (s.length <= n ? s : s.slice(0, n - 1).trimEnd() + "…");

export function youtube(ic, dil) {
  const v = ic[dil];
  const etiketler = v.etiketler.map(etiket);
  return {
    title: kes(`${v.baslik} #Shorts`, 100),
    description: kes([v.aciklama, "", v.kaynak, ...ic.kaynaklar, "", [...etiketler, "#Shorts"].join(" ")].join("\n"), 4900),
    tags: v.etiketler.map((e) => e.replace(/^#/, "")).slice(0, 15),
    defaultLanguage: dil,
  };
}

export function instagram(ic, dil) {
  const v = ic[dil];
  return kes([v.baslik, "", v.aciklama, "", `${v.cta} ➜`, "", v.kaynak, "", v.etiketler.map(etiket).join(" ")].join("\n"), 2200);
}

export function tiktok(ic, dil) {
  const v = ic[dil];
  return kes(`${v.baslik} ${v.aciklama} ${[...v.etiketler.map(etiket), "#fyp"].join(" ")}`, 2200);
}

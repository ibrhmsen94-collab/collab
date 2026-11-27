// Seslendirme: her sahne için ayrı cümle, sahne süresine sığdırma, tek 30 sn iz.
// Ana motor: Chatterbox Multilingual (doğal, MIT). Yoksa yedek: TR Piper, EN Kokoro.
import { execFileSync } from "node:child_process";
import { mkdirSync, writeFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

// Şablondaki sahne aralıkları (sn): kanca, 3 gerçek, grafik, kapanış
export const SAHNELER = [[0, 4], [4, 10], [10, 16], [16, 22], [22, 27], [27, 30]];
export const TOPLAM = 30;
const BAS = 0.15, SON = 0.25, MAX_HIZ = 1.35;

const KOK = dirname(fileURLToPath(import.meta.url));
const CB_PY = process.env.CB_PYTHON || "/opt/cb-venv/bin/python";
const PIPER = process.env.PIPER_BIN || "/opt/piper-venv/bin/piper";
const PIPER_TR = process.env.PIPER_TR || "/opt/piper-voices/tr_TR-dfki-medium.onnx";
const PY = process.env.HYPERFRAMES_PYTHON || "/opt/piper-venv/bin/python3";
const CLI = "/root/.claude/skills/hyperframes/scripts/plugin-cli.mjs";
const KOKORO_SES = process.env.KOKORO_SES || "am_michael";

export const pencere = (i) => SAHNELER[i][1] - SAHNELER[i][0] - BAS - SON;
export const hizGerekli = (sure, i) => Math.max(1, sure / pencere(i));
export const motor = () => (process.env.SES_MOTORU || (existsSync(CB_PY) ? "chatterbox" : "yedek"));

function sure(wav) {
  return parseFloat(execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", wav]).toString());
}

// Baş/son sessizliği kırp, isteğe bağlı hızlandır (perde korunur), 44.1 kHz stereo.
function isle(girdi, cikti, hiz = 1) {
  const f = ["silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.05",
    "areverse", "silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.1", "areverse"];
  if (hiz > 1) f.push(`atempo=${hiz.toFixed(3)}`);
  execFileSync("ffmpeg", ["-y", "-loglevel", "error", "-i", girdi, "-af", f.join(","), "-ar", "44100", "-ac", "2", cikti]);
  return sure(cikti);
}

function yedekSentez(dil, metin, wav) {
  if (dil === "tr") execFileSync(PIPER, ["-m", PIPER_TR, "-f", wav, "--sentence-silence", "0.1"], { input: metin, stdio: ["pipe", "ignore", "pipe"] });
  else execFileSync("node", [CLI, "tts", metin, "-v", KOKORO_SES, "-o", wav, "--json"], { env: { ...process.env, HYPERFRAMES_PYTHON: PY }, stdio: ["ignore", "ignore", "pipe"] });
}

// Döner: hedef wav yolu. Metin sahneye sığmazsa hata fırlatır.
export function sesUret(dil, parcalar, calisma, hedef) {
  mkdirSync(calisma, { recursive: true });
  const m = motor();
  if (m === "chatterbox") {
    const jf = join(calisma, `${dil}-metin.json`);
    writeFileSync(jf, JSON.stringify(parcalar));
    execFileSync(CB_PY, ["-I", join(KOK, "cb_tts.py"), dil, calisma, jf], { stdio: ["ignore", "inherit", "inherit"], timeout: 1800000 });
  } else {
    parcalar.forEach((metin, i) => yedekSentez(dil, metin, join(calisma, `${dil}-${i}-ham.wav`)));
  }
  const dosyalar = parcalar.map((_, i) => {
    const ham = join(calisma, `${dil}-${i}-ham.wav`), wav = join(calisma, `${dil}-${i}.wav`);
    const s = isle(ham, wav);
    const h = hizGerekli(s, i);
    if (h > MAX_HIZ) throw new Error(`${dil} seslendirme ${i + 1}. sahneye sığmıyor (${s.toFixed(1)} sn > ${pencere(i).toFixed(1)} sn); metni kısalt`);
    if (h > 1) isle(ham, wav, h * 1.02);
    return wav;
  });
  const girdiler = dosyalar.flatMap((f) => ["-i", f]);
  const gecikme = dosyalar.map((_, i) => `[${i}]adelay=${Math.round((SAHNELER[i][0] + BAS) * 1000)}:all=1[a${i}]`);
  const karisim = `${dosyalar.map((_, i) => `[a${i}]`).join("")}amix=inputs=${dosyalar.length}:normalize=0,apad=whole_dur=${TOPLAM},atrim=0:${TOPLAM},loudnorm=I=-16:TP=-1.5:LRA=11[o]`;
  execFileSync("ffmpeg", ["-y", "-loglevel", "error", ...girdiler, "-filter_complex", [...gecikme, karisim].join(";"), "-map", "[o]", "-ar", "44100", hedef]);
  if (!existsSync(hedef)) throw new Error("ses izi yazılamadı");
  return hedef;
}

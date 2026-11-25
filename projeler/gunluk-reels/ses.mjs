// Seslendirme: her sahne için yerel TTS (TR: Piper, EN: Kokoro), sahne süresine sığdırma, tek 30 sn iz.
import { execFileSync } from "node:child_process";
import { mkdirSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";

// Şablondaki sahne aralıkları (sn): kanca, 3 gerçek, grafik, kapanış
export const SAHNELER = [[0, 4], [4, 10], [10, 16], [16, 22], [22, 27], [27, 30]];
export const TOPLAM = 30;
const BAS = 0.15, SON = 0.25, MAX_HIZ = 1.35;

const PIPER = process.env.PIPER_BIN || "/opt/piper-venv/bin/piper";
const PIPER_TR = process.env.PIPER_TR || "/opt/piper-voices/tr_TR-dfki-medium.onnx";
const PY = process.env.HYPERFRAMES_PYTHON || "/opt/piper-venv/bin/python3";
const CLI = "/root/.claude/skills/hyperframes/scripts/plugin-cli.mjs";
const KOKORO_SES = process.env.KOKORO_SES || "am_michael";

export const pencere = (i) => SAHNELER[i][1] - SAHNELER[i][0] - BAS - SON;
export const hizGerekli = (sure, i) => Math.max(1, sure / pencere(i));

function sure(wav) {
  return parseFloat(execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", wav]).toString());
}

function sentezle(dil, metin, wav, hiz) {
  if (dil === "tr") {
    execFileSync(PIPER, ["-m", PIPER_TR, "-f", wav, "--length-scale", String(1 / hiz), "--sentence-silence", "0.1"], { input: metin, stdio: ["pipe", "ignore", "pipe"] });
  } else {
    execFileSync("node", [CLI, "tts", metin, "-v", KOKORO_SES, "-s", String(hiz), "-o", wav, "--json"], {
      env: { ...process.env, HYPERFRAMES_PYTHON: PY }, stdio: ["ignore", "ignore", "pipe"],
    });
  }
  return sure(wav);
}

// Döner: hedef wav yolu. Metin sahneye sığmazsa hata fırlatır.
export function sesUret(dil, parcalar, calisma, hedef) {
  mkdirSync(calisma, { recursive: true });
  const dosyalar = parcalar.map((metin, i) => {
    const wav = join(calisma, `${dil}-${i}.wav`);
    let s = sentezle(dil, metin, wav, 1);
    const h = hizGerekli(s, i);
    if (h > 1) {
      if (h > MAX_HIZ) throw new Error(`${dil} seslendirme ${i + 1}. sahneye sığmıyor (${s.toFixed(1)} sn > ${pencere(i).toFixed(1)} sn); metni kısalt`);
      s = sentezle(dil, metin, wav, h * 1.02);
    }
    return wav;
  });
  const girdiler = dosyalar.flatMap((f) => ["-i", f]);
  const gecikme = dosyalar.map((_, i) => `[${i}]aresample=44100,aformat=channel_layouts=stereo,adelay=${Math.round((SAHNELER[i][0] + BAS) * 1000)}:all=1[a${i}]`);
  const karisim = `${dosyalar.map((_, i) => `[a${i}]`).join("")}amix=inputs=${dosyalar.length}:normalize=0,apad=whole_dur=${TOPLAM},atrim=0:${TOPLAM},loudnorm=I=-16:TP=-1.5:LRA=11[o]`;
  execFileSync("ffmpeg", ["-y", "-loglevel", "error", ...girdiler, "-filter_complex", [...gecikme, karisim].join(";"), "-map", "[o]", "-ar", "44100", hedef]);
  if (!existsSync(hedef)) throw new Error("ses izi yazılamadı");
  return hedef;
}

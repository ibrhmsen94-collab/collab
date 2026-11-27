# Chatterbox Multilingual (MIT) ile toplu seslendirme + kalite kapısı.
# Her cümle üretildikten sonra Whisper ile dinlenir; metinden sapma (eksik/uydurma kelime) ya da aşırı uzunluk
# varsa farklı tohumla yeniden üretilir, en iyi deneme seçilir.
# Kullanım: python cb_tts.py <dil> <cikti_klasoru> <metinler.json>
import difflib, json, re, subprocess, sys, warnings
warnings.filterwarnings("ignore")
import numpy as np, torch, torchaudio
from chatterbox.mtl_tts import ChatterboxMultilingualTTS
from faster_whisper import WhisperModel

dil, klasor, dosya = sys.argv[1], sys.argv[2], sys.argv[3]
metinler = json.load(open(dosya, encoding="utf-8"))
model = ChatterboxMultilingualTTS.from_pretrained(device="cpu")
kulak = WhisperModel("medium", device="cpu", compute_type="int8")

SAYI = set("""sıfır bir iki üç dört beş altı yedi sekiz dokuz on yirmi otuz kırk elli altmış yetmiş seksen doksan yüz bin milyon milyar
zero one two three four five six seven eight nine ten eleven twelve thirteen fourteen fifteen sixteen seventeen eighteen nineteen
twenty thirty forty fifty sixty seventy eighty ninety hundred thousand million billion and""".split())

def kelimeler(s):
    s = s.lower().replace("'", " ").replace("’", " ")
    return [w for w in re.findall(r"[^\W\d_]+", s) if w not in SAYI]

def benzerlik(hedef, duyulan):
    return difflib.SequenceMatcher(None, kelimeler(hedef), kelimeler(duyulan)).ratio()

def dinle(wav, sr):
    a = torchaudio.functional.resample(wav, sr, 16000).squeeze(0).numpy().astype(np.float32)
    segs, _ = kulak.transcribe(a, language=dil, beam_size=1)
    return " ".join(s.text.strip() for s in segs)

def beklenen(metin):  # ~14 karakter/sn
    return max(1.0, len(metin) / 14.0)

for i, metin in enumerate(metinler):
    en_iyi = None
    for deneme in range(6):
        torch.manual_seed(1000 + i + 97 * deneme)
        wav = model.generate(metin, language_id=dil, exaggeration=0.55, cfg_weight=0.5, temperature=0.75)
        sure = wav.shape[-1] / model.sr
        duyulan = dinle(wav, model.sr)
        puan = benzerlik(metin, duyulan) - max(0.0, sure / beklenen(metin) - 1.4)
        if en_iyi is None or puan > en_iyi[1]:
            en_iyi = (wav, puan, sure, duyulan)
        if puan >= 0.9:
            break
        print(f"{i}: puan {puan:.2f}, {sure:.1f} sn, duyulan: {duyulan!r} → yeniden", flush=True)
    torchaudio.save(f"{klasor}/{dil}-{i}-ham.wav", en_iyi[0], model.sr)
    print(f"{i} puan={en_iyi[1]:.2f} sure={en_iyi[2]:.1f} duyulan={en_iyi[3]!r}", flush=True)
    if en_iyi[1] < 0.75:
        sys.exit(f"{dil} {i + 1}. cümle doğru seslendirilemedi (puan {en_iyi[1]:.2f}); metni sadeleştir")

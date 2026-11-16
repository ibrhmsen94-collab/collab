import { addDays, addMonths, diffDays, isValidDate, monthGrid } from './dates';
import { currentPhase, dayKind, getAlerts, getCycles, getPeriods, getStats, predict } from './cycles';
import type { Logs } from './types';

const S = { cycleLength: 28, periodLength: 5 };

function logsFrom(starts: string[], len = 5): Logs {
  const logs: Logs = {};
  for (const s of starts) for (let i = 0; i < len; i++) logs[addDays(s, i)] = { flow: 'medium' };
  return logs;
}

/** start'tan itibaren verilen döngü uzunluklarıyla adet başlangıçları üretir. */
function starts(first: string, lengths: number[]): string[] {
  const out = [first];
  for (const l of lengths) out.push(addDays(out[out.length - 1], l));
  return out;
}

describe('dates', () => {
  test('addDays/diffDays ay, yıl ve artık yıl sınırlarını geçer', () => {
    expect(addDays('2024-02-28', 1)).toBe('2024-02-29');
    expect(addDays('2025-12-31', 1)).toBe('2026-01-01');
    expect(diffDays('2026-03-01', '2026-04-01')).toBe(31);
    expect(diffDays('2026-04-01', '2026-03-01')).toBe(-31);
  });
  test('isValidDate geçersiz tarihleri reddeder', () => {
    expect(isValidDate('2026-02-30')).toBe(false);
    expect(isValidDate('2026-2-3')).toBe(false);
    expect(isValidDate(5)).toBe(false);
    expect(isValidDate('2026-11-16')).toBe(true);
  });
  test('monthGrid Pazartesi ile başlar ve 7nin katıdır', () => {
    const g = monthGrid('2026-11'); // 1 Kasım 2026 Pazar
    expect(g.length % 7).toBe(0);
    expect(g.indexOf('2026-11-01')).toBe(6);
    expect(g.filter(Boolean)).toHaveLength(30);
    expect(addMonths('2026-12', 1)).toBe('2027-01');
    expect(addMonths('2026-01', -1)).toBe('2025-12');
  });
});

describe('getPeriods', () => {
  test('ardışık günleri gruplar, bir günlük boşluğu birleştirir', () => {
    const logs: Logs = {
      '2026-01-01': { flow: 'heavy' }, '2026-01-02': { flow: 'medium' },
      '2026-01-04': { flow: 'light' }, // 1 gün boşluk → aynı adet
      '2026-01-07': { flow: 'light' }, // 2 gün boşluk → yeni adet
    };
    expect(getPeriods(logs)).toEqual([
      { start: '2026-01-01', end: '2026-01-04', length: 4 },
      { start: '2026-01-07', end: '2026-01-07', length: 1 },
    ]);
  });
  test('lekelenme ve akışsız kayıt adet sayılmaz', () => {
    expect(getPeriods({ '2026-01-01': { flow: 'spotting' }, '2026-01-02': { symptoms: ['cramps'] } })).toEqual([]);
  });
});

describe('getStats', () => {
  test('geçmiş yokken ayarlardaki varsayılanı kullanır', () => {
    const st = getStats([], { cycleLength: 30, periodLength: 4 });
    expect(st).toMatchObject({ avgCycle: 30, avgPeriod: 4, usingDefaults: true, confidence: 'low', uncertainty: 3 });
  });
  test('düzenli döngülerde yüksek güven ve ±1 gün', () => {
    const st = getStats(getPeriods(logsFrom(starts('2026-01-01', [28, 28, 29, 28]))), S);
    expect(st).toMatchObject({ cycleCount: 4, avgCycle: 28, confidence: 'high', uncertainty: 1, minCycle: 28, maxCycle: 29 });
  });
  test('aykırı döngü (kayıt atlanmış) ortalamaya girmez', () => {
    const st = getStats(getPeriods(logsFrom(starts('2025-01-01', [28, 84, 28, 28]))), S);
    expect(st.cycleCount).toBe(3);
    expect(st.avgCycle).toBe(28);
  });
  test('yakın döngüler daha ağır basar ve yalnızca son 6 döngü kullanılır', () => {
    const st = getStats(getPeriods(logsFrom(starts('2025-01-01', [40, 40, 26, 26, 26, 26, 32, 32]))), S);
    expect(st.cycleCount).toBe(6);
    expect(st.avgCycle).toBe(29); // (26*1+26*2+26*3+26*4+32*5+32*6)/21 = 29.1
    expect(st.maxCycle).toBe(32);
  });
  test('adet süresi tamamlanmış adetlerin medyanıdır; süren adet hariç', () => {
    const logs = { ...logsFrom(['2026-01-01', '2026-01-29'], 6), '2026-02-26': { flow: 'heavy' as const } };
    expect(getStats(getPeriods(logs), S).avgPeriod).toBe(6);
  });
});

describe('predict', () => {
  test('kayıt yoksa tahmin üretmez', () => {
    const p = predict({}, S, '2026-11-16');
    expect(p.upcoming).toEqual([]);
    expect(p.cycleDay).toBeNull();
    expect(currentPhase(p, '2026-11-16')).toBeNull();
  });
  test('tek adetle varsayılan uzunluktan tahmin eder', () => {
    const p = predict(logsFrom(['2026-11-01']), S, '2026-11-10');
    expect(p.cycleDay).toBe(10);
    expect(p.upcoming[0]).toMatchObject({ periodStart: '2026-11-29', periodEnd: '2026-12-03' });
    expect(p.current).toEqual({ ovulation: '2026-11-15', fertileStart: '2026-11-10', fertileEnd: '2026-11-16' });
    expect(p.upcoming[1].periodStart).toBe('2026-12-27');
    expect(p.lateBy).toBe(0);
  });
  test('gecikmede sıradaki adet bugüne kayar', () => {
    const p = predict(logsFrom(['2026-10-01']), S, '2026-11-02');
    expect(p.lateBy).toBe(4);
    expect(p.upcoming[0].periodStart).toBe('2026-11-02');
    expect(currentPhase(p, '2026-11-02')).toBe('late');
  });
  test('gelecekteki kayıtlar bugünün hesabını bozmaz', () => {
    const p = predict(logsFrom(['2026-11-01', '2026-12-20']), S, '2026-11-10');
    expect(p.lastPeriod?.start).toBe('2026-11-01');
  });
  test('evreler sırayla ilerler', () => {
    const logs = logsFrom(['2026-11-01']);
    const phase = (d: string) => currentPhase(predict(logs, S, d), d);
    expect(phase('2026-11-03')).toBe('menstrual');
    expect(phase('2026-11-08')).toBe('follicular');
    expect(phase('2026-11-15')).toBe('ovulatory');
    expect(phase('2026-11-20')).toBe('luteal');
  });
});

describe('dayKind', () => {
  const logs = { ...logsFrom(['2026-11-01']), '2026-11-08': { flow: 'spotting' as const } };
  const p = predict(logs, S, '2026-11-10');
  test('günleri doğru işaretler', () => {
    expect(dayKind('2026-11-02', logs, p, true)).toBe('period');
    expect(dayKind('2026-11-08', logs, p, true)).toBe('spotting');
    expect(dayKind('2026-11-15', logs, p, true)).toBe('ovulation');
    expect(dayKind('2026-11-12', logs, p, true)).toBe('fertile');
    expect(dayKind('2026-11-30', logs, p, true)).toBe('predictedPeriod');
    expect(dayKind('2026-11-22', logs, p, true)).toBeNull();
    expect(dayKind('2026-10-15', logs, p, true)).toBeNull();
  });
  test('doğurganlık gizliyken yalnızca adet gösterilir', () => {
    expect(dayKind('2026-11-15', logs, p, false)).toBeNull();
    expect(dayKind('2026-11-30', logs, p, false)).toBe('predictedPeriod');
  });
});

describe('getAlerts', () => {
  test('düzenli döngüde uyarı yok', () => {
    const s = starts('2026-01-01', [28, 29, 28]);
    expect(getAlerts(logsFrom(s), addDays(s[3], 10))).toEqual([]);
  });
  test('kısa, uzun, düzensiz döngü ve uzun adet', () => {
    const short = starts('2026-01-01', [19, 20, 19]);
    expect(getAlerts(logsFrom(short), addDays(short[3], 5))).toContain('shortCycles');
    const long = starts('2026-01-01', [38, 40, 39]);
    expect(getAlerts(logsFrom(long), addDays(long[3], 5))).toContain('longCycles');
    const irr = starts('2026-01-01', [24, 35, 27]);
    expect(getAlerts(logsFrom(irr), addDays(irr[3], 5))).toContain('irregular');
    expect(getAlerts(logsFrom(['2026-01-01'], 9), '2026-01-12')).toContain('longPeriod');
  });
  test('90 günden uzun süre adet yoksa uyarır', () => {
    expect(getAlerts(logsFrom(['2026-01-01']), '2026-04-05')).toContain('noPeriod90');
    expect(getAlerts(logsFrom(['2026-01-01']), '2026-03-01')).not.toContain('noPeriod90');
  });
});

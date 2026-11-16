import { addDays, diffDays, type ISODate } from './dates';
import type { Logs, Settings } from './types';

/** Lekelenme adet günü sayılmaz. */
const isPeriodFlow = (f?: string) => f === 'light' || f === 'medium' || f === 'heavy';

/** Arada en çok bu kadar kanamasız gün varsa aynı adet sayılır. */
export const MAX_GAP_IN_PERIOD = 1;
/** Ortalama hesabına giren döngü uzunluğu sınırları (gün). Dışındakiler eksik kayıt/özel durum sayılır. */
export const MIN_VALID_CYCLE = 15;
export const MAX_VALID_CYCLE = 60;
/** Tahminde kullanılan son döngü sayısı. */
export const HISTORY_WINDOW = 6;
export const LUTEAL_DAYS = 14;

export interface Period {
  start: ISODate;
  end: ISODate;
  length: number;
}

export interface Cycle {
  start: ISODate;
  length: number;
  periodLength: number;
  valid: boolean;
}

export function getPeriods(logs: Logs): Period[] {
  const days = Object.keys(logs).filter((d) => isPeriodFlow(logs[d].flow)).sort();
  const periods: Period[] = [];
  for (const d of days) {
    const last = periods[periods.length - 1];
    if (last && diffDays(last.end, d) <= MAX_GAP_IN_PERIOD + 1) {
      last.end = d;
      last.length = diffDays(last.start, d) + 1;
    } else {
      periods.push({ start: d, end: d, length: 1 });
    }
  }
  return periods;
}

/** Tamamlanmış döngüler (bir adet başlangıcından sonrakine). */
export function getCycles(periods: Period[]): Cycle[] {
  const cycles: Cycle[] = [];
  for (let i = 0; i < periods.length - 1; i++) {
    const length = diffDays(periods[i].start, periods[i + 1].start);
    cycles.push({
      start: periods[i].start,
      length,
      periodLength: periods[i].length,
      valid: length >= MIN_VALID_CYCLE && length <= MAX_VALID_CYCLE,
    });
  }
  return cycles;
}

const mean = (xs: number[]) => xs.reduce((a, b) => a + b, 0) / xs.length;

function median(xs: number[]): number {
  const s = [...xs].sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
}

function stdev(xs: number[]): number {
  if (xs.length < 2) return 0;
  const m = mean(xs);
  return Math.sqrt(xs.reduce((a, x) => a + (x - m) ** 2, 0) / (xs.length - 1));
}

/** Yakın döngülere daha çok ağırlık veren ortalama (ağırlıklar 1..n). */
function recencyWeightedMean(xs: number[]): number {
  let sum = 0;
  let w = 0;
  xs.forEach((x, i) => {
    sum += x * (i + 1);
    w += i + 1;
  });
  return sum / w;
}

export type Confidence = 'low' | 'medium' | 'high';

export interface Stats {
  cycleCount: number;
  avgCycle: number;
  avgPeriod: number;
  minCycle: number | null;
  maxCycle: number | null;
  /** Tahmin belirsizliği, ± gün */
  uncertainty: number;
  confidence: Confidence;
  /** Geçmiş yetersiz olduğundan ayarlardaki varsayılan kullanıldı */
  usingDefaults: boolean;
}

export function getStats(periods: Period[], settings: Pick<Settings, 'cycleLength' | 'periodLength'>): Stats {
  const lengths = getCycles(periods).filter((c) => c.valid).map((c) => c.length).slice(-HISTORY_WINDOW);
  // Devam ediyor olabilecek son adet hariç, tamamlanmış adet süreleri
  const periodLengths = periods.slice(0, -1).map((p) => p.length).slice(-HISTORY_WINDOW);
  const n = lengths.length;
  const usingDefaults = n === 0;
  const avgCycle = usingDefaults ? settings.cycleLength : Math.round(recencyWeightedMean(lengths));
  const avgPeriod = periodLengths.length ? Math.round(median(periodLengths)) : settings.periodLength;
  const sd = stdev(lengths);
  const uncertainty = n < 2 ? 3 : Math.min(7, Math.max(1, Math.round(sd)));
  const confidence: Confidence = n >= 3 && sd <= 2 ? 'high' : n >= 2 && sd <= 4 ? 'medium' : 'low';
  return {
    cycleCount: n,
    avgCycle,
    avgPeriod,
    minCycle: n ? Math.min(...lengths) : null,
    maxCycle: n ? Math.max(...lengths) : null,
    uncertainty,
    confidence,
    usingDefaults,
  };
}

export interface PredictedCycle {
  periodStart: ISODate;
  periodEnd: ISODate;
  ovulation: ISODate;
  fertileStart: ISODate;
  fertileEnd: ISODate;
}

export interface Prediction {
  stats: Stats;
  lastPeriod: Period | null;
  /** Bugünün döngü günü (1 = adetin ilk günü) */
  cycleDay: number | null;
  /** İçinde bulunulan döngünün tahmini yumurtlama/doğurgan penceresi */
  current: Omit<PredictedCycle, 'periodStart' | 'periodEnd'> | null;
  /** Sıradaki tahmini döngüler */
  upcoming: PredictedCycle[];
  /** Beklenen adet kaç gün gecikti (0 = gecikme yok) */
  lateBy: number;
  /** Şu an adet döneminde mi (son kayıtlı kanama bugün ya da dün) */
  inPeriod: boolean;
}

function fertileWindow(nextStart: ISODate) {
  const ovulation = addDays(nextStart, -LUTEAL_DAYS);
  return { ovulation, fertileStart: addDays(ovulation, -5), fertileEnd: addDays(ovulation, 1) };
}

export function predict(
  logs: Logs,
  settings: Pick<Settings, 'cycleLength' | 'periodLength'>,
  now: ISODate,
  count = 6,
): Prediction {
  const periods = getPeriods(logs).filter((p) => p.start <= now);
  const stats = getStats(periods, settings);
  const lastPeriod = periods[periods.length - 1] ?? null;
  if (!lastPeriod) {
    return { stats, lastPeriod, cycleDay: null, current: null, upcoming: [], lateBy: 0, inPeriod: false };
  }
  const expected = addDays(lastPeriod.start, stats.avgCycle);
  const lateBy = Math.max(0, diffDays(expected, now));
  // Gecikme varsa sıradaki adet "bugün" beklenir; geçmişe tahmin yazılmaz.
  const nextStart = lateBy > 0 ? now : expected;
  const upcoming: PredictedCycle[] = [];
  for (let i = 0; i < count; i++) {
    const periodStart = addDays(nextStart, i * stats.avgCycle);
    upcoming.push({
      periodStart,
      periodEnd: addDays(periodStart, stats.avgPeriod - 1),
      ...fertileWindow(addDays(periodStart, stats.avgCycle)),
    });
  }
  return {
    stats,
    lastPeriod,
    cycleDay: diffDays(lastPeriod.start, now) + 1,
    current: fertileWindow(expected),
    upcoming,
    lateBy,
    inPeriod: diffDays(lastPeriod.end, now) <= 1,
  };
}

export type DayKind = 'period' | 'spotting' | 'predictedPeriod' | 'ovulation' | 'fertile' | null;

/** Takvimde bir günün nasıl işaretleneceği. */
export function dayKind(d: ISODate, logs: Logs, p: Prediction, showFertility: boolean): DayKind {
  const flow = logs[d]?.flow;
  if (isPeriodFlow(flow)) return 'period';
  if (flow === 'spotting') return 'spotting';
  if (p.upcoming.some((c) => d >= c.periodStart && d <= c.periodEnd)) return 'predictedPeriod';
  if (!showFertility) return null;
  const windows = [...(p.current ? [p.current] : []), ...p.upcoming];
  // Geçmiş döngüler: kayıtlı bir sonraki adete göre geriye dönük hesap yapılmaz, yalnızca son adetten sonrası işaretlenir.
  if (p.lastPeriod && d <= p.lastPeriod.end) return null;
  if (windows.some((w) => d === w.ovulation)) return 'ovulation';
  if (windows.some((w) => d >= w.fertileStart && d <= w.fertileEnd)) return 'fertile';
  return null;
}

export type Phase = 'menstrual' | 'follicular' | 'ovulatory' | 'luteal' | 'late';

export function currentPhase(p: Prediction, now: ISODate): Phase | null {
  if (!p.lastPeriod || !p.current) return null;
  if (p.inPeriod) return 'menstrual';
  if (p.lateBy > 0) return 'late';
  if (now < p.current.fertileStart) return 'follicular';
  if (now <= p.current.fertileEnd) return 'ovulatory';
  return 'luteal';
}

export type Alert = 'shortCycles' | 'longCycles' | 'irregular' | 'longPeriod' | 'noPeriod90';

/** Hekime danışmayı önermeyi gerektirebilecek örüntüler (tanı değildir). */
export function getAlerts(logs: Logs, now: ISODate): Alert[] {
  const periods = getPeriods(logs).filter((p) => p.start <= now);
  const recent = getCycles(periods).slice(-HISTORY_WINDOW);
  const lengths = recent.filter((c) => c.valid).map((c) => c.length);
  const alerts: Alert[] = [];
  if (lengths.filter((l) => l < 21).length >= 2) alerts.push('shortCycles');
  if (lengths.filter((l) => l > 35).length >= 2) alerts.push('longCycles');
  if (lengths.length >= 3 && Math.max(...lengths) - Math.min(...lengths) > 9) alerts.push('irregular');
  if (periods.slice(-3).some((p) => p.length > 8)) alerts.push('longPeriod');
  const last = periods[periods.length - 1];
  if (last && diffDays(last.start, now) > 90) alerts.push('noPeriod90');
  return alerts;
}

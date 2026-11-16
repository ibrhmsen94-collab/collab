import { isValidDate } from './dates';
import {
  DEFAULT_SETTINGS, DISCHARGES, FLOWS, MOODS, SYMPTOMS, isEmptyLog,
  type AppData, type DayLog, type Logs, type Settings,
} from './types';

export const STORAGE_KEY = 'adet-takibi:v1';

export const emptyData = (): AppData => ({ version: 1, settings: { ...DEFAULT_SETTINGS }, logs: {} });

const clampInt = (v: unknown, min: number, max: number, fallback: number) =>
  typeof v === 'number' && Number.isFinite(v) ? Math.min(max, Math.max(min, Math.round(v))) : fallback;

const bool = (v: unknown, fallback: boolean) => (typeof v === 'boolean' ? v : fallback);

function pick<T extends string>(v: unknown, allowed: readonly T[]): T | undefined {
  return allowed.includes(v as T) ? (v as T) : undefined;
}

function pickMany<T extends string>(v: unknown, allowed: readonly T[]): T[] | undefined {
  if (!Array.isArray(v)) return undefined;
  const out = allowed.filter((a) => v.includes(a));
  return out.length ? out : undefined;
}

export function sanitizeLog(raw: unknown): DayLog | null {
  if (!raw || typeof raw !== 'object') return null;
  const r = raw as Record<string, unknown>;
  const log: DayLog = {
    flow: pick(r.flow, FLOWS),
    symptoms: pickMany(r.symptoms, SYMPTOMS),
    moods: pickMany(r.moods, MOODS),
    discharge: pick(r.discharge, DISCHARGES),
    bbt: typeof r.bbt === 'number' && r.bbt >= 34 && r.bbt <= 42 ? Math.round(r.bbt * 100) / 100 : undefined,
    sex: pick(r.sex, ['protected', 'unprotected'] as const),
    pill: r.pill === true ? true : undefined,
    note: typeof r.note === 'string' && r.note.trim() ? r.note.slice(0, 2000) : undefined,
  };
  (Object.keys(log) as (keyof DayLog)[]).forEach((k) => log[k] === undefined && delete log[k]);
  return isEmptyLog(log) ? null : log;
}

export function sanitizeSettings(raw: unknown): Settings {
  const r = (raw && typeof raw === 'object' ? raw : {}) as Record<string, unknown>;
  const d = DEFAULT_SETTINGS;
  return {
    onboarded: bool(r.onboarded, d.onboarded),
    lang: pick(r.lang, ['tr', 'en'] as const) ?? d.lang,
    cycleLength: clampInt(r.cycleLength, 15, 60, d.cycleLength),
    periodLength: clampInt(r.periodLength, 1, 10, d.periodLength),
    showFertility: bool(r.showFertility, d.showFertility),
    appLock: bool(r.appLock, d.appLock),
    remindPeriod: bool(r.remindPeriod, d.remindPeriod),
    remindPeriodDaysBefore: clampInt(r.remindPeriodDaysBefore, 0, 7, d.remindPeriodDaysBefore),
    remindFertile: bool(r.remindFertile, d.remindFertile),
    discreetNotifications: bool(r.discreetNotifications, d.discreetNotifications),
  };
}

/**
 * Depodan/içe aktarımdan gelen veriyi doğrular; tanınmayan alanları atar. Geçersizse hata fırlatır.
 * maxDate verilirse (içe aktarma) bu tarihten sonraki kayıtlar atılır.
 */
export function parseData(json: string, maxDate?: string): AppData {
  const raw: unknown = JSON.parse(json);
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) throw new Error('invalid');
  const r = raw as Record<string, unknown>;
  if (r.version !== 1 || !r.logs || typeof r.logs !== 'object' || Array.isArray(r.logs)) throw new Error('invalid');
  const logs: Logs = {};
  for (const [date, value] of Object.entries(r.logs as Record<string, unknown>)) {
    if (!isValidDate(date) || (maxDate && date > maxDate)) continue;
    const log = sanitizeLog(value);
    if (log) logs[date] = log;
  }
  return { version: 1, settings: sanitizeSettings(r.settings), logs };
}

export function serialize(data: AppData): string {
  return JSON.stringify(data);
}

/** Bir günün kaydını günceller; boş kalırsa günü siler. Yeni nesne döndürür. */
export function withLog(logs: Logs, date: string, patch: Partial<DayLog>): Logs {
  const next = { ...logs };
  const merged = sanitizeLog({ ...logs[date], ...patch });
  if (merged) next[date] = merged;
  else delete next[date];
  return next;
}

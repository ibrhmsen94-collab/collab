import type { ISODate } from './dates';

export type Flow = 'spotting' | 'light' | 'medium' | 'heavy';

export const FLOWS: Flow[] = ['spotting', 'light', 'medium', 'heavy'];

export const SYMPTOMS = [
  'cramps', 'headache', 'backache', 'bloating', 'breastTenderness', 'acne',
  'fatigue', 'nausea', 'cravings', 'insomnia', 'diarrhea', 'constipation',
] as const;
export type Symptom = (typeof SYMPTOMS)[number];

export const MOODS = ['happy', 'calm', 'energetic', 'sad', 'anxious', 'irritable', 'moodSwings'] as const;
export type Mood = (typeof MOODS)[number];

export const DISCHARGES = ['dry', 'sticky', 'creamy', 'eggWhite', 'watery'] as const;
export type Discharge = (typeof DISCHARGES)[number];

export interface DayLog {
  flow?: Flow;
  symptoms?: Symptom[];
  moods?: Mood[];
  discharge?: Discharge;
  /** Bazal vücut sıcaklığı, °C */
  bbt?: number;
  sex?: 'protected' | 'unprotected';
  pill?: boolean;
  note?: string;
}

export type Logs = Record<ISODate, DayLog>;

export type Lang = 'tr' | 'en';

export interface Settings {
  onboarded: boolean;
  lang: Lang;
  /** Yeterli geçmiş yokken kullanılan varsayılanlar */
  cycleLength: number;
  periodLength: number;
  showFertility: boolean;
  appLock: boolean;
  remindPeriod: boolean;
  remindPeriodDaysBefore: number;
  remindFertile: boolean;
  /** Bildirim metninde "adet" kelimesi geçmesin */
  discreetNotifications: boolean;
}

export interface AppData {
  version: 1;
  settings: Settings;
  logs: Logs;
}

export const DEFAULT_SETTINGS: Settings = {
  onboarded: false,
  lang: 'tr',
  cycleLength: 28,
  periodLength: 5,
  showFertility: true,
  appLock: false,
  remindPeriod: true,
  remindPeriodDaysBefore: 2,
  remindFertile: false,
  discreetNotifications: true,
};

export function isEmptyLog(l: DayLog): boolean {
  return !l.flow && !l.symptoms?.length && !l.moods?.length && !l.discharge
    && l.bbt == null && !l.sex && !l.pill && !l.note?.trim();
}

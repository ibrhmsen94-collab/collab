/** Tarihler saat dilimi/DST hatalarından kaçınmak için 'YYYY-MM-DD' metni olarak tutulur. */
export type ISODate = string;

const DAY_MS = 86_400_000;

function toUTC(d: ISODate): number {
  const [y, m, day] = d.split('-').map(Number);
  return Date.UTC(y, m - 1, day);
}

function fromUTC(ms: number): ISODate {
  return new Date(ms).toISOString().slice(0, 10);
}

export function isValidDate(d: unknown): d is ISODate {
  return typeof d === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(d) && fromUTC(toUTC(d)) === d;
}

export function today(now: Date = new Date()): ISODate {
  const p = (n: number) => String(n).padStart(2, '0');
  return `${now.getFullYear()}-${p(now.getMonth() + 1)}-${p(now.getDate())}`;
}

export function addDays(d: ISODate, n: number): ISODate {
  return fromUTC(toUTC(d) + n * DAY_MS);
}

/** b - a (gün). */
export function diffDays(a: ISODate, b: ISODate): number {
  return Math.round((toUTC(b) - toUTC(a)) / DAY_MS);
}

export function weekday(d: ISODate): number {
  return new Date(toUTC(d)).getUTCDay(); // 0 = Pazar
}

export function monthKey(d: ISODate): string {
  return d.slice(0, 7);
}

export function addMonths(month: string, n: number): string {
  const [y, m] = month.split('-').map(Number);
  const t = new Date(Date.UTC(y, m - 1 + n, 1));
  return t.toISOString().slice(0, 7);
}

export function daysInMonth(month: string): number {
  const [y, m] = month.split('-').map(Number);
  return new Date(Date.UTC(y, m, 0)).getUTCDate();
}

/** Takvim ızgarası: haftanın ilk günü Pazartesi; ay dışı hücreler null. */
export function monthGrid(month: string): (ISODate | null)[] {
  const first = `${month}-01`;
  const lead = (weekday(first) + 6) % 7;
  const cells: (ISODate | null)[] = Array(lead).fill(null);
  for (let i = 0; i < daysInMonth(month); i++) cells.push(addDays(first, i));
  while (cells.length % 7) cells.push(null);
  return cells;
}

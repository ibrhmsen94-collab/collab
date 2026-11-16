import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import { addDays, type ISODate } from './core/dates';
import type { Prediction } from './core/cycles';
import type { Settings } from './core/types';
import type { T } from './i18n';

export const notificationsSupported = Platform.OS !== 'web';

/** Yerel saatle sabah 09:00. */
function at9(d: ISODate): Date {
  const [y, m, day] = d.split('-').map(Number);
  return new Date(y, m - 1, day, 9, 0, 0);
}

export interface Reminder {
  date: ISODate;
  title: string;
  body: string;
}

/** Tahmine göre kurulacak hatırlatmalar (saf fonksiyon; test edilebilir). */
export function buildReminders(p: Prediction, s: Settings, t: T, now: ISODate): Reminder[] {
  const out: Reminder[] = [];
  const text = (title: string, body: string) =>
    s.discreetNotifications ? { title: t('notif.discreet.title'), body: t('notif.discreet.body') } : { title, body };
  for (const c of p.upcoming.slice(0, 3)) {
    if (s.remindPeriod) {
      const n = s.remindPeriodDaysBefore;
      const date = addDays(c.periodStart, -n);
      const body = n === 0 ? t('notif.period.bodyToday') : t('notif.period.body', { n });
      if (date > now) out.push({ date, ...text(t('notif.period.title'), body) });
    }
    if (s.remindFertile && s.showFertility && c.fertileStart > now) {
      out.push({ date: c.fertileStart, ...text(t('notif.fertile.title'), t('notif.fertile.body')) });
    }
  }
  return out;
}

export async function ensurePermission(): Promise<boolean> {
  if (!notificationsSupported) return false;
  const cur = await Notifications.getPermissionsAsync();
  if (cur.granted) return true;
  if (!cur.canAskAgain) return false;
  return (await Notifications.requestPermissionsAsync()).granted;
}

let chain: Promise<void> = Promise.resolve();
let generation = 0;

/**
 * Tüm planlı hatırlatmaları iptal edip güncel tahmine göre yeniden kurar.
 * Çağrılar sıraya alınır; yeni bir çağrı gelince eskisi yarıda bırakılır (yinelenen bildirim kalmaz).
 */
export function syncReminders(reminders: Reminder[], channelName: string): Promise<void> {
  const mine = ++generation;
  chain = chain.then(() => (mine === generation ? run(reminders, channelName, () => mine !== generation) : undefined));
  return chain;
}

async function run(reminders: Reminder[], channelName: string, stale: () => boolean): Promise<void> {
  if (!notificationsSupported) return;
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
    if (!reminders.length || !(await Notifications.getPermissionsAsync()).granted) return;
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('reminders', {
        name: channelName,
        importance: Notifications.AndroidImportance.DEFAULT,
        lockscreenVisibility: Notifications.AndroidNotificationVisibility.PRIVATE,
      });
    }
    for (const r of reminders) {
      if (stale()) return;
      await Notifications.scheduleNotificationAsync({
        content: { title: r.title, body: r.body },
        trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date: at9(r.date), channelId: 'reminders' },
      });
    }
  } catch {
    // Hatırlatma kurulamaması uygulamayı durdurmamalı
  }
}

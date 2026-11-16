import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { getLocales } from 'expo-localization';
import { STORAGE_KEY, emptyData, parseData, serialize, withLog } from './core/storage';
import type { AppData, DayLog, Lang, Settings } from './core/types';
import { translator, type T } from './i18n';

interface Store {
  data: AppData;
  t: T;
  setLog: (date: string, patch: Partial<DayLog>) => void;
  setSettings: (patch: Partial<Settings>) => void;
  replaceAll: (data: AppData) => void;
  deleteAll: () => Promise<void>;
}

const Ctx = createContext<Store | null>(null);

export function deviceLang(): Lang {
  try {
    return getLocales()[0]?.languageCode === 'tr' ? 'tr' : 'en';
  } catch {
    return 'tr';
  }
}

function initialData(): AppData {
  const d = emptyData();
  d.settings.lang = deviceLang();
  return d;
}

type State = { status: 'loading' } | { status: 'error' } | { status: 'ready'; data: AppData };

export function StoreProvider({ children, fallback, renderError }: {
  children: ReactNode;
  fallback: ReactNode;
  /** Kayıtlar okunamadığında gösterilir. Bu durumda depoya hiçbir şey yazılmaz. */
  renderError: (actions: { retry: () => void; reset: () => void }) => ReactNode;
}) {
  const [state, setState] = useState<State>({ status: 'loading' });

  const load = useCallback(() => {
    setState({ status: 'loading' });
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => setState({ status: 'ready', data: raw ? parseData(raw) : initialData() }))
      .catch(() => setState({ status: 'error' }));
  }, []);
  useEffect(load, [load]);

  // Okunamayan kaydı silmeden ayrı bir anahtara taşıyıp boş veriyle başlar.
  const reset = useCallback(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => (raw ? AsyncStorage.setItem(`${STORAGE_KEY}:corrupt`, raw) : undefined))
      .catch(() => {})
      .then(() => setState({ status: 'ready', data: initialData() }));
  }, []);

  const data = state.status === 'ready' ? state.data : null;
  useEffect(() => {
    if (data) AsyncStorage.setItem(STORAGE_KEY, serialize(data)).catch((e) => console.warn('Kayıt yazılamadı', e));
  }, [data]);

  const update = useCallback((fn: (d: AppData) => AppData) => {
    setState((s) => (s.status === 'ready' ? { status: 'ready', data: fn(s.data) } : s));
  }, []);
  const setLog = useCallback((date: string, patch: Partial<DayLog>) => update((d) => ({ ...d, logs: withLog(d.logs, date, patch) })), [update]);
  const setSettings = useCallback((patch: Partial<Settings>) => update((d) => ({ ...d, settings: { ...d.settings, ...patch } })), [update]);
  const replaceAll = useCallback((next: AppData) => update(() => next), [update]);
  const deleteAll = useCallback(async () => {
    await AsyncStorage.multiRemove([STORAGE_KEY, `${STORAGE_KEY}:corrupt`]);
    update(() => initialData());
  }, [update]);

  const lang = data?.settings.lang;
  const t = useMemo(() => translator(lang ?? 'tr'), [lang]);
  const value = useMemo<Store | null>(
    () => data && { data, t, setLog, setSettings, replaceAll, deleteAll },
    [data, t, setLog, setSettings, replaceAll, deleteAll],
  );

  if (state.status === 'error') return <>{renderError({ retry: load, reset })}</>;
  if (!value) return <>{fallback}</>;
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStore(): Store {
  const s = useContext(Ctx);
  if (!s) throw new Error('StoreProvider eksik');
  return s;
}

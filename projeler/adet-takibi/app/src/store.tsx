import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { getLocales } from 'expo-localization';
import { STORAGE_KEY, emptyData, parseData, serialize, withLog } from './core/storage';
import type { AppData, DayLog, Settings } from './core/types';
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

function initialData(): AppData {
  const d = emptyData();
  try {
    d.settings.lang = getLocales()[0]?.languageCode === 'tr' ? 'tr' : 'en';
  } catch {
    // dil algılanamazsa varsayılan kalır
  }
  return d;
}

export function StoreProvider({ children, fallback }: { children: ReactNode; fallback: ReactNode }) {
  const [data, setData] = useState<AppData | null>(null);
  const loaded = useRef(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => (raw ? parseData(raw) : initialData()))
      .catch(() => initialData())
      .then((d) => {
        loaded.current = true;
        setData(d);
      });
  }, []);

  useEffect(() => {
    if (data && loaded.current) AsyncStorage.setItem(STORAGE_KEY, serialize(data)).catch(() => {});
  }, [data]);

  const setLog = useCallback((date: string, patch: Partial<DayLog>) => {
    setData((d) => d && { ...d, logs: withLog(d.logs, date, patch) });
  }, []);
  const setSettings = useCallback((patch: Partial<Settings>) => {
    setData((d) => d && { ...d, settings: { ...d.settings, ...patch } });
  }, []);
  const replaceAll = useCallback((next: AppData) => setData(next), []);
  const deleteAll = useCallback(async () => {
    await AsyncStorage.removeItem(STORAGE_KEY);
    setData(initialData());
  }, []);

  const value = useMemo<Store | null>(
    () => data && { data, t: translator(data.settings.lang), setLog, setSettings, replaceAll, deleteAll },
    [data, setLog, setSettings, replaceAll, deleteAll],
  );

  if (!value) return <>{fallback}</>;
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStore(): Store {
  const s = useContext(Ctx);
  if (!s) throw new Error('StoreProvider eksik');
  return s;
}

import { StatusBar } from 'expo-status-bar';
import { useEffect, useMemo, useState } from 'react';
import { AppState, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { getAlerts, predict } from './src/core/cycles';
import { today as getToday, type ISODate } from './src/core/dates';
import type { TKey } from './src/i18n';
import { buildReminders, syncReminders } from './src/notifications';
import { CalendarScreen } from './src/screens/CalendarScreen';
import { Onboarding } from './src/screens/Onboarding';
import { SettingsScreen } from './src/screens/SettingsScreen';
import { Stats } from './src/screens/Stats';
import { Today } from './src/screens/Today';
import { StoreProvider, useStore } from './src/store';
import { useColors } from './src/theme';
import { Button } from './src/ui/kit';
import { LogSheet } from './src/ui/LogSheet';

const TABS = ['today', 'calendar', 'stats', 'settings'] as const;
type Tab = (typeof TABS)[number];
const ICONS: Record<Tab, string> = { today: '◉', calendar: '▦', stats: '▥', settings: '⚙' };

/** Gün değişimini ve uygulamanın öne gelişini izler. */
function useToday(): ISODate {
  const [now, setNow] = useState(getToday());
  useEffect(() => {
    const refresh = () => setNow(getToday());
    const sub = AppState.addEventListener('change', refresh);
    const id = setInterval(refresh, 60_000);
    return () => {
      sub.remove();
      clearInterval(id);
    };
  }, []);
  return now;
}

function Main() {
  const { data, t } = useStore();
  const c = useColors();
  const insets = useSafeAreaInsets();
  const now = useToday();
  const [tab, setTab] = useState<Tab>('today');
  const [logDate, setLogDate] = useState<ISODate | null>(null);
  const [locked, setLocked] = useState(data.settings.appLock && Platform.OS !== 'web');

  const prediction = useMemo(() => predict(data.logs, data.settings, now), [data.logs, data.settings, now]);
  const alerts = useMemo(() => getAlerts(data.logs, now), [data.logs, now]);

  useEffect(() => {
    void syncReminders(buildReminders(prediction, data.settings, t, now));
  }, [prediction, data.settings, t, now]);

  const unlock = async () => {
    const r = await LocalAuthentication.authenticateAsync({ promptMessage: t('lock.reason') });
    if (r.success) setLocked(false);
  };
  useEffect(() => {
    if (locked) void unlock();
    // Yalnızca açılışta bir kez dene
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // Arka plana geçince yeniden kilitle
  useEffect(() => {
    if (!data.settings.appLock || Platform.OS === 'web') return;
    const sub = AppState.addEventListener('change', (state) => state === 'background' && setLocked(true));
    return () => sub.remove();
  }, [data.settings.appLock]);

  if (!data.settings.onboarded) return <Onboarding />;
  if (locked) {
    return (
      <View style={[s.center, { backgroundColor: c.bg }]}>
        <Text style={{ color: c.text, fontSize: 20, fontWeight: '700', marginBottom: 12 }}>{t('lock.title')}</Text>
        <Button label={t('lock.unlock')} onPress={unlock} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: c.bg }}>
      <ScrollView contentContainerStyle={{ padding: 16, paddingTop: insets.top + 12, paddingBottom: 24, maxWidth: 560, width: '100%', alignSelf: 'center' }}>
        <Text accessibilityRole="header" style={[s.screenTitle, { color: c.text }]}>{t(`tab.${tab}` as TKey)}</Text>
        {tab === 'today' && <Today now={now} prediction={prediction} alerts={alerts} onLog={setLogDate} />}
        {tab === 'calendar' && <CalendarScreen now={now} prediction={prediction} onLog={setLogDate} />}
        {tab === 'stats' && <Stats now={now} prediction={prediction} alerts={alerts} />}
        {tab === 'settings' && <SettingsScreen />}
      </ScrollView>
      <View accessibilityRole="tablist" style={[s.tabs, { backgroundColor: c.card, borderColor: c.border, paddingBottom: insets.bottom }]}>
        {TABS.map((x) => (
          <Pressable
            key={x} testID={`tab-${x}`} accessibilityRole="tab" accessibilityState={{ selected: tab === x }}
            accessibilityLabel={t(`tab.${x}` as TKey)} onPress={() => setTab(x)} style={s.tab}
          >
            <Text style={{ fontSize: 20, color: tab === x ? c.primary : c.muted }}>{ICONS[x]}</Text>
            <Text style={{ fontSize: 12, color: tab === x ? c.primary : c.muted, fontWeight: tab === x ? '700' : '400' }}>{t(`tab.${x}` as TKey)}</Text>
          </Pressable>
        ))}
      </View>
      <LogSheet date={logDate} onClose={() => setLogDate(null)} />
    </View>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <StoreProvider fallback={<View style={{ flex: 1 }} />}>
        <Main />
      </StoreProvider>
      <StatusBar style="auto" />
    </SafeAreaProvider>
  );
}

const s = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  screenTitle: { fontSize: 30, fontWeight: '800', marginBottom: 12 },
  tabs: { flexDirection: 'row', borderTopWidth: StyleSheet.hairlineWidth },
  tab: { flex: 1, alignItems: 'center', justifyContent: 'center', minHeight: 56, paddingVertical: 6 },
});

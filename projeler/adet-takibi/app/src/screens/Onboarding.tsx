import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { addDays, monthKey, today as getToday, type ISODate } from '../core/dates';
import { withLog } from '../core/storage';
import type { Logs } from '../core/types';
import { useStore } from '../store';
import { useColors } from '../theme';
import { Body, Button, Card, Chip, Chips, Stepper } from '../ui/kit';
import { MonthCalendar } from '../ui/MonthCalendar';

export function Onboarding() {
  const { data, t, setSettings, replaceAll } = useStore();
  const c = useColors();
  const insets = useSafeAreaInsets();
  const now = getToday();
  const [step, setStep] = useState(0);
  const [month, setMonth] = useState(monthKey(now));
  const [last, setLast] = useState<ISODate | null>(null);
  const { lang, cycleLength, periodLength } = data.settings;

  const finish = () => {
    let logs: Logs = data.logs;
    if (last) {
      for (let i = 0; i < periodLength; i++) {
        const d = addDays(last, i);
        if (d <= now) logs = withLog(logs, d, { flow: 'medium' });
      }
    }
    replaceAll({ ...data, logs, settings: { ...data.settings, onboarded: true } });
  };

  return (
    <ScrollView
      style={{ backgroundColor: c.bg }}
      contentContainerStyle={{ padding: 20, paddingTop: insets.top + 32, paddingBottom: insets.bottom + 24, flexGrow: 1 }}
    >
      <Text style={{ color: c.muted, fontSize: 13, marginBottom: 8 }}>{step + 1} / 3</Text>
      {step === 0 && (
        <View>
          <Text accessibilityRole="header" style={[s.title, { color: c.text }]}>{t('onb.welcome')}</Text>
          <Card><Body>{t('onb.privacy')}</Body></Card>
          <Card>
            <Body muted style={{ marginBottom: 8 }}>{t('onb.lang')}</Body>
            <Chips>
              <Chip testID="lang-tr" label="Türkçe" selected={lang === 'tr'} onPress={() => setSettings({ lang: 'tr' })} />
              <Chip testID="lang-en" label="English" selected={lang === 'en'} onPress={() => setSettings({ lang: 'en' })} />
            </Chips>
          </Card>
          <Body muted style={{ fontSize: 13 }}>{t('disclaimer')}</Body>
        </View>
      )}
      {step === 1 && (
        <View>
          <Text accessibilityRole="header" style={[s.title, { color: c.text }]}>{t('onb.lastPeriod')}</Text>
          <Body muted style={{ marginBottom: 12 }}>{t('onb.lastPeriodHint')}</Body>
          <Card>
            <MonthCalendar
              month={month} onMonthChange={setMonth} today={now} selected={last} onSelect={setLast} maxDate={now}
              lang={lang} t={t} info={(d) => ({ kind: d === last ? 'period' : null, hasLog: false })}
            />
          </Card>
        </View>
      )}
      {step === 2 && (
        <View>
          <Text accessibilityRole="header" style={[s.title, { color: c.text }]}>{t('onb.lengths')}</Text>
          <Body muted style={{ marginBottom: 12 }}>{t('onb.lengthsHint')}</Body>
          <Card>
            <Stepper testID="onb-cycle" label={t('onb.cycleLength')} unit={t('days')} value={cycleLength} min={15} max={60} onChange={(v) => setSettings({ cycleLength: v })} />
            <Stepper testID="onb-period" label={t('onb.periodLength')} unit={t('days')} value={periodLength} min={1} max={10} onChange={(v) => setSettings({ periodLength: v })} />
          </Card>
        </View>
      )}
      <View style={{ flex: 1 }} />
      {step === 1 && !last ? <Button testID="onb-skip" kind="ghost" label={t('onb.skip')} onPress={() => setStep(2)} /> : null}
      {step < 2
        ? <Button testID="onb-next" label={t('next')} disabled={step === 1 && !last} onPress={() => setStep(step + 1)} />
        : <Button testID="onb-start" label={t('onb.start')} onPress={finish} />}
      {step > 0 ? <Button kind="ghost" label={t('back')} onPress={() => setStep(step - 1)} /> : null}
    </ScrollView>
  );
}

const s = StyleSheet.create({ title: { fontSize: 28, fontWeight: '800', marginBottom: 16 } });

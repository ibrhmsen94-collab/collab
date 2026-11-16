import { Pressable, StyleSheet, Text, View } from 'react-native';
import { addMonths, monthGrid, type ISODate } from '../core/dates';
import type { DayKind } from '../core/cycles';
import type { Lang } from '../core/types';
import { formatDate, monthName, weekdays, type T } from '../i18n';
import { useColors, type Colors } from '../theme';

export interface DayInfo {
  kind: DayKind;
  hasLog: boolean;
}

const KIND_LABEL = {
  period: 'cal.legend.period', spotting: 'cal.legend.spotting', predictedPeriod: 'cal.legend.predicted',
  ovulation: 'cal.legend.ovulation', fertile: 'cal.legend.fertile',
} as const;

function cellStyle(kind: DayKind, c: Colors) {
  switch (kind) {
    case 'period': return { bg: c.period, fg: '#FFFFFF', border: c.period, dashed: false };
    case 'predictedPeriod': return { bg: c.predicted, fg: c.text, border: c.period, dashed: true };
    case 'ovulation': return { bg: c.ovulation, fg: c.onOvulation, border: c.ovulation, dashed: false };
    case 'fertile': return { bg: c.fertile, fg: c.text, border: c.fertile, dashed: false };
    case 'spotting': return { bg: 'transparent', fg: c.text, border: c.spotting, dashed: false };
    default: return { bg: 'transparent', fg: c.text, border: 'transparent', dashed: false };
  }
}

export function MonthCalendar({ month, onMonthChange, info, today, selected, onSelect, lang, t, maxDate }: {
  month: string;
  onMonthChange: (m: string) => void;
  info: (d: ISODate) => DayInfo;
  today: ISODate;
  selected?: ISODate | null;
  onSelect: (d: ISODate) => void;
  lang: Lang;
  t: T;
  /** Bu tarihten sonraki günler seçilemez */
  maxDate?: ISODate;
}) {
  const c = useColors();
  const nav = (delta: number, label: string, sign: string) => (
    <Pressable
      testID={delta < 0 ? 'cal-prev' : 'cal-next'}
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={() => onMonthChange(addMonths(month, delta))}
      style={s.nav}
    >
      <Text style={{ color: c.primary, fontSize: 26 }}>{sign}</Text>
    </Pressable>
  );
  return (
    <View>
      <View style={s.header}>
        {nav(-1, t('cal.prev'), '‹')}
        <Text testID="cal-month" accessibilityRole="header" style={[s.title, { color: c.text }]}>{monthName(lang, month)}</Text>
        {nav(1, t('cal.nextMonth'), '›')}
      </View>
      <View style={s.grid}>
        {weekdays(lang).map((w) => (
          <View key={w} style={s.cell}><Text style={{ color: c.muted, fontSize: 12, fontWeight: '600' }}>{w}</Text></View>
        ))}
        {monthGrid(month).map((d, i) => {
          if (!d) return <View key={`e${i}`} style={s.cell} />;
          const { kind, hasLog } = info(d);
          const st = cellStyle(kind, c);
          const disabled = !!maxDate && d > maxDate;
          const isToday = d === today;
          const label = [formatDate(lang, d), isToday ? t('cal.today') : '', kind ? t(KIND_LABEL[kind]) : '', hasLog ? t('cal.legend.logged') : '']
            .filter(Boolean).join(', ');
          return (
            <Pressable
              key={d}
              testID={`day-${d}`}
              accessibilityRole="button"
              accessibilityLabel={label}
              accessibilityState={{ disabled, selected: selected === d }}
              disabled={disabled}
              onPress={() => onSelect(d)}
              style={s.cell}
            >
              <View style={[s.ring, { borderColor: selected === d ? c.primary : isToday ? c.text : 'transparent' }]}>
                <View style={[s.dot, { backgroundColor: st.bg, borderColor: st.border, borderStyle: st.dashed ? 'dashed' : 'solid', opacity: disabled && !kind ? 0.35 : 1 }]}>
                  <Text style={{ color: st.fg, fontSize: 15, fontWeight: isToday ? '800' : '500' }}>{Number(d.slice(8))}</Text>
                </View>
              </View>
              <View style={[s.mark, { backgroundColor: hasLog ? c.muted : 'transparent' }]} />
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

export function Legend({ t, showFertility }: { t: T; showFertility: boolean }) {
  const c = useColors();
  const items: [DayKind, string][] = [
    ['period', t('cal.legend.period')], ['predictedPeriod', t('cal.legend.predicted')], ['spotting', t('cal.legend.spotting')],
    ...(showFertility ? ([['fertile', t('cal.legend.fertile')], ['ovulation', t('cal.legend.ovulation')]] as [DayKind, string][]) : []),
  ];
  return (
    <View style={s.legend}>
      {items.map(([kind, label]) => {
        const st = cellStyle(kind, c);
        return (
          <View key={label} style={s.legendItem}>
            <View style={[s.legendDot, { backgroundColor: st.bg, borderColor: st.border, borderStyle: st.dashed ? 'dashed' : 'solid' }]} />
            <Text style={{ color: c.muted, fontSize: 13 }}>{label}</Text>
          </View>
        );
      })}
    </View>
  );
}

const s = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 },
  title: { fontSize: 18, fontWeight: '700' },
  nav: { width: 48, height: 48, alignItems: 'center', justifyContent: 'center' },
  grid: { flexDirection: 'row', flexWrap: 'wrap' },
  cell: { width: `${100 / 7}%`, height: 52, alignItems: 'center', justifyContent: 'center' },
  ring: { width: 42, height: 42, borderRadius: 21, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  dot: { width: 34, height: 34, borderRadius: 17, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  mark: { width: 4, height: 4, borderRadius: 2, marginTop: 1 },
  legend: { flexDirection: 'row', flexWrap: 'wrap', gap: 14, marginTop: 12 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendDot: { width: 14, height: 14, borderRadius: 7, borderWidth: 2 },
});

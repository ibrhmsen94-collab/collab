import { StyleSheet, Text, View } from 'react-native';
import { getCycles, getPeriods, type Alert, type Prediction } from '../core/cycles';
import type { ISODate } from '../core/dates';
import type { Symptom } from '../core/types';
import { formatDate } from '../i18n';
import { useStore } from '../store';
import { useColors } from '../theme';
import { Body, Card, H } from '../ui/kit';
import { AlertsCard } from './Today';

export function Stats({ now, prediction: p, alerts }: { now: ISODate; prediction: Prediction; alerts: Alert[] }) {
  const { data, t } = useStore();
  const c = useColors();
  const lang = data.settings.lang;
  const cycles = getCycles(getPeriods(data.logs).filter((x) => x.start <= now)).slice(-12).reverse();
  const maxLen = Math.max(35, ...cycles.filter((x) => x.valid).map((x) => x.length));
  const counts = new Map<Symptom, number>();
  for (const l of Object.values(data.logs)) for (const x of l.symptoms ?? []) counts.set(x, (counts.get(x) ?? 0) + 1);
  const top = [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5);
  const st = p.stats;
  const tile = (label: string, value: string, testID: string) => (
    <View style={[s.tile, { backgroundColor: c.card, borderColor: c.border }]}>
      <Text testID={testID} style={{ color: c.text, fontSize: 24, fontWeight: '800' }}>{value}</Text>
      <Text style={{ color: c.muted, fontSize: 13, marginTop: 2 }}>{label}</Text>
    </View>
  );
  return (
    <View>
      <View style={s.tiles}>
        {tile(t('stats.avgCycle'), `${st.avgCycle} ${t('days')}`, 'stat-cycle')}
        {tile(t('stats.avgPeriod'), `${st.avgPeriod} ${t('days')}`, 'stat-period')}
        {tile(t('stats.range'), st.minCycle != null ? `${st.minCycle}–${st.maxCycle}` : '–', 'stat-range')}
        {tile(t('stats.count'), String(st.cycleCount), 'stat-count')}
      </View>
      {st.usingDefaults ? <Body muted style={{ fontSize: 13, marginBottom: 12 }}>{t('today.basedOnDefaults')}</Body> : null}
      <AlertsCard alerts={alerts} />
      <Card>
        <H>{t('stats.history')}</H>
        {cycles.length === 0 ? <Body muted>{t('stats.noHistory')}</Body> : cycles.map((cy) => (
          <View key={cy.start} style={s.barRow} accessible accessibilityLabel={`${formatDate(lang, cy.start)}: ${cy.length} ${t('days')}`}>
            <Text style={{ color: c.muted, fontSize: 13, width: 78 }}>{formatDate(lang, cy.start)}</Text>
            <View style={[s.track, { backgroundColor: c.primarySoft }]}>
              <View style={{ width: `${Math.min(100, (cy.length / maxLen) * 100)}%`, backgroundColor: cy.valid ? c.primary : c.border, height: '100%', borderRadius: 6 }}>
                <View style={{ width: `${Math.min(100, (cy.periodLength / cy.length) * 100)}%`, backgroundColor: c.period, height: '100%', borderRadius: 6 }} />
              </View>
            </View>
            <Text style={{ color: c.text, fontSize: 14, fontWeight: '700', width: 34, textAlign: 'right' }}>{cy.length}</Text>
          </View>
        ))}
        {cycles.some((x) => !x.valid) ? <Body muted style={{ fontSize: 12, marginTop: 6 }}>▢ {t('stats.excluded')}</Body> : null}
      </Card>
      {top.length ? (
        <Card>
          <H>{t('stats.topSymptoms')}</H>
          {top.map(([x, n]) => (
            <View key={x} style={s.symRow}>
              <Body>{t(`sym.${x}`)}</Body>
              <Body muted>{t('stats.times', { n })}</Body>
            </View>
          ))}
        </Card>
      ) : null}
      <Body muted style={{ fontSize: 12, marginTop: 8 }}>{t('disclaimer')}</Body>
    </View>
  );
}

const s = StyleSheet.create({
  tiles: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 12 },
  tile: { flexBasis: '47%', flexGrow: 1, borderRadius: 16, borderWidth: StyleSheet.hairlineWidth, padding: 16 },
  barRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  track: { flex: 1, height: 12, borderRadius: 6, overflow: 'hidden' },
  symRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4 },
});

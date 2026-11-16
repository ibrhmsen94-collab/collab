import { StyleSheet, Text, View } from 'react-native';
import { addDays, diffDays, type ISODate } from '../core/dates';
import { currentPhase, type Alert, type Prediction } from '../core/cycles';
import { formatDate } from '../i18n';
import { useStore } from '../store';
import { useColors } from '../theme';
import { Body, Button, Card, H } from '../ui/kit';

export function AlertsCard({ alerts }: { alerts: Alert[] }) {
  const { t } = useStore();
  const c = useColors();
  if (!alerts.length) return null;
  return (
    <View testID="alerts" style={[s.warn, { backgroundColor: c.warnBg }]}>
      <Text style={{ color: c.warnText, fontWeight: '700', marginBottom: 6 }}>{t('alert.title')}</Text>
      {alerts.map((a) => <Text key={a} style={{ color: c.warnText, fontSize: 15, lineHeight: 21 }}>• {t(`alert.${a}`)}</Text>)}
      <Text style={{ color: c.warnText, fontSize: 13, marginTop: 8 }}>{t('alert.advice')}</Text>
    </View>
  );
}

export function Today({ now, prediction: p, alerts, onLog }: {
  now: ISODate; prediction: Prediction; alerts: Alert[]; onLog: (d: ISODate) => void;
}) {
  const { data, t, setLog } = useStore();
  const c = useColors();
  const { lang, showFertility } = data.settings;
  const phase = currentPhase(p, now);
  const next = p.upcoming[0];
  const log = data.logs[now];
  const bleedingToday = log?.flow && log.flow !== 'spotting';

  let headline = t('today.noData');
  if (p.lastPeriod && next) {
    const n = diffDays(now, next.periodStart);
    if (p.inPeriod) headline = t('today.periodDay', { n: Math.min(diffDays(p.lastPeriod.start, now) + 1, 99) });
    else if (p.lateBy > 0) headline = t('today.late', { n: p.lateBy });
    else if (n === 0) headline = t('today.periodToday');
    else if (n === 1) headline = t('today.periodTomorrow');
    else headline = t('today.periodIn', { n });
  }
  const range = (a: ISODate, b: ISODate) => `${formatDate(lang, a)} – ${formatDate(lang, b)}`;
  const u = p.stats.uncertainty;
  const summary = log
    ? [log.flow && t(`flow.${log.flow}`), ...(log.symptoms ?? []).map((x) => t(`sym.${x}`)), ...(log.moods ?? []).map((x) => t(`mood.${x}`))]
        .filter(Boolean).join(' · ')
    : '';

  return (
    <View>
      <View style={s.hero}>
        <View style={[s.ring, { borderColor: p.inPeriod ? c.period : phase === 'ovulatory' && showFertility ? c.ovulation : c.primary, backgroundColor: c.card }]}>
          {p.cycleDay ? <Text style={{ color: c.muted, fontSize: 14 }}>{t('today.cycleDay', { n: p.cycleDay })}</Text> : null}
          <Text testID="headline" accessibilityRole="header" style={[s.headline, { color: c.text }]}>{headline}</Text>
          {phase && (showFertility || phase !== 'ovulatory')
            ? <Text testID="phase" style={{ color: c.muted, fontSize: 14, marginTop: 4 }}>{t(`phase.${phase}`)}</Text>
            : null}
        </View>
      </View>

      {!p.lastPeriod ? <Body muted style={{ textAlign: 'center', marginBottom: 12 }}>{t('today.noDataHint')}</Body> : null}

      {!bleedingToday
        ? <Button testID="start-period" label={p.inPeriod ? t('today.endPeriod') : t('today.startPeriod')} onPress={() => setLog(now, { flow: 'medium' })} />
        : null}
      <Button testID="log-today" kind="ghost" label={log ? t('today.edit') : t('today.log')} onPress={() => onLog(now)} />
      <View style={{ height: 16 }} />

      {summary ? <Card><H>{t('today.todayLog')}</H><Body>{summary}</Body></Card> : null}

      {next ? (
        <Card>
          <H>{t('today.nextPeriod')}</H>
          <Text testID="next-period" style={[s.big, { color: c.text }]}>
            {u > 1 && p.lateBy === 0
              ? range(addDays(next.periodStart, -u) > now ? addDays(next.periodStart, -u) : now, addDays(next.periodStart, u))
              : formatDate(lang, next.periodStart)}
          </Text>
          <Body muted style={{ fontSize: 14 }}>
            {t('today.uncertainty', { n: u })} · {t(`conf.${p.stats.confidence}`)}
          </Body>
          {p.stats.usingDefaults ? <Body muted style={{ fontSize: 13, marginTop: 6 }}>{t('today.basedOnDefaults')}</Body> : null}
        </Card>
      ) : null}

      {showFertility && p.current && p.lateBy === 0 ? (
        <Card>
          <H>{t('today.fertile')}</H>
          {(() => {
            const w = now <= p.current.fertileEnd ? p.current : next;
            return w ? (
              <>
                <Text testID="fertile" style={[s.big, { color: c.text }]}>{range(w.fertileStart, w.fertileEnd)}</Text>
                <Body muted style={{ fontSize: 14 }}>{t('today.ovulation')}: {formatDate(lang, w.ovulation)}</Body>
                <Body muted style={{ fontSize: 13, marginTop: 6 }}>{t('set.fertilityHint')}</Body>
              </>
            ) : null;
          })()}
        </Card>
      ) : null}

      <AlertsCard alerts={alerts} />
      <Body muted style={{ fontSize: 12, marginTop: 8 }}>{t('disclaimer')}</Body>
    </View>
  );
}

const s = StyleSheet.create({
  hero: { alignItems: 'center', marginVertical: 12 },
  ring: { width: 240, height: 240, borderRadius: 120, borderWidth: 10, alignItems: 'center', justifyContent: 'center', padding: 24 },
  headline: { fontSize: 24, fontWeight: '800', textAlign: 'center', marginTop: 4 },
  big: { fontSize: 20, fontWeight: '700', marginBottom: 4 },
  warn: { borderRadius: 16, padding: 16, marginBottom: 12 },
});

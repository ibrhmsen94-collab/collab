import { useState } from 'react';
import { dayKind, type Prediction } from '../core/cycles';
import { monthKey, type ISODate } from '../core/dates';
import { useStore } from '../store';
import { Body, Button, Card } from '../ui/kit';
import { Legend, MonthCalendar } from '../ui/MonthCalendar';

export function CalendarScreen({ now, prediction, onLog }: { now: ISODate; prediction: Prediction; onLog: (d: ISODate) => void }) {
  const { data, t } = useStore();
  const [month, setMonth] = useState(monthKey(now));
  const { lang, showFertility } = data.settings;
  return (
    <>
      <Card>
        <MonthCalendar
          month={month} onMonthChange={setMonth} today={now} onSelect={onLog} maxDate={now} lang={lang} t={t}
          info={(d) => {
            const l = data.logs[d];
            return {
              kind: dayKind(d, data.logs, prediction, showFertility),
              hasLog: !!l && (!!l.symptoms?.length || !!l.moods?.length || !!l.note || !!l.discharge || l.bbt != null || !!l.sex || !!l.pill),
            };
          }}
        />
        <Legend t={t} showFertility={showFertility} />
      </Card>
      {month !== monthKey(now) ? <Button testID="cal-today" kind="ghost" label={t('cal.today')} onPress={() => setMonth(monthKey(now))} /> : null}
      <Body muted style={{ fontSize: 13, marginTop: 8 }}>{t('log.future')}</Body>
    </>
  );
}

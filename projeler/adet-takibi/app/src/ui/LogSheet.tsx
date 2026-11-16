import { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Modal, Platform, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { ISODate } from '../core/dates';
import { DISCHARGES, FLOWS, MOODS, SYMPTOMS, type DayLog } from '../core/types';
import { formatDate } from '../i18n';
import { useStore } from '../store';
import { useColors } from '../theme';
import { Button, Chip, Chips, H } from './kit';

function toggle<T>(list: T[] | undefined, item: T): T[] {
  const cur = list ?? [];
  return cur.includes(item) ? cur.filter((x) => x !== item) : [...cur, item];
}

/** Bir günün kaydını düzenler; her değişiklik anında kaydedilir. */
export function LogSheet({ date, onClose }: { date: ISODate | null; onClose: () => void }) {
  const { data, t, setLog } = useStore();
  const c = useColors();
  const insets = useSafeAreaInsets();
  const log: DayLog = (date && data.logs[date]) || {};
  const [bbt, setBbt] = useState('');
  const [note, setNote] = useState('');

  useEffect(() => {
    setBbt(log.bbt != null ? String(log.bbt) : '');
    setNote(log.note ?? '');
    // Yalnızca gün değişince alanları yeniden doldur
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date]);

  if (!date) return null;
  const set = (patch: Partial<DayLog>) => setLog(date, patch);
  const bbtValue = Number(bbt.replace(',', '.'));
  const bbtValid = bbt.trim() !== '' && Number.isFinite(bbtValue) && bbtValue >= 34 && bbtValue <= 42;
  const bbtError = bbt.trim() !== '' && !bbtValid;
  // Yazarken kaydedilir: geri tuşu, aşağı kaydırma ya da kilitlenme veri kaybettirmez.
  // Geçersiz girdi kayıtlı değeri silmez.
  const changeBbt = (v: string) => {
    setBbt(v);
    const n = Number(v.replace(',', '.'));
    if (v.trim() === '') set({ bbt: undefined });
    else if (Number.isFinite(n) && n >= 34 && n <= 42) set({ bbt: n });
  };
  const changeNote = (v: string) => {
    setNote(v);
    set({ note: v });
  };
  const input = { borderColor: c.border, color: c.text, backgroundColor: c.card };

  return (
    <Modal visible animationType="slide" onRequestClose={onClose} presentationStyle="pageSheet">
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1, backgroundColor: c.bg }}>
        <View style={[s.header, { borderColor: c.border, paddingTop: Platform.OS === 'android' ? insets.top + 8 : 16 }]}>
          <View style={{ flex: 1 }}>
            <Text style={{ color: c.muted, fontSize: 13 }}>{t('log.title')}</Text>
            <Text testID="log-date" accessibilityRole="header" style={{ color: c.text, fontSize: 20, fontWeight: '700' }}>
              {formatDate(data.settings.lang, date)}
            </Text>
          </View>
          <Button testID="log-done" label={t('done')} onPress={onClose} />
        </View>
        <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: insets.bottom + 32 }} keyboardShouldPersistTaps="handled">
          <H>{t('log.flow')}</H>
          <Chips>
            {FLOWS.map((f) => (
              <Chip key={f} testID={`flow-${f}`} label={t(`flow.${f}`)} selected={log.flow === f} onPress={() => set({ flow: log.flow === f ? undefined : f })} />
            ))}
          </Chips>
          <View style={s.gap} />
          <H>{t('log.symptoms')}</H>
          <Chips>
            {SYMPTOMS.map((x) => (
              <Chip key={x} testID={`sym-${x}`} label={t(`sym.${x}`)} selected={!!log.symptoms?.includes(x)} onPress={() => set({ symptoms: toggle(log.symptoms, x) })} />
            ))}
          </Chips>
          <View style={s.gap} />
          <H>{t('log.moods')}</H>
          <Chips>
            {MOODS.map((x) => (
              <Chip key={x} testID={`mood-${x}`} label={t(`mood.${x}`)} selected={!!log.moods?.includes(x)} onPress={() => set({ moods: toggle(log.moods, x) })} />
            ))}
          </Chips>
          <View style={s.gap} />
          <H>{t('log.discharge')}</H>
          <Chips>
            {DISCHARGES.map((x) => (
              <Chip key={x} label={t(`dis.${x}`)} selected={log.discharge === x} onPress={() => set({ discharge: log.discharge === x ? undefined : x })} />
            ))}
          </Chips>
          <View style={s.gap} />
          <H>{t('log.other')}</H>
          <Chips>
            {(['protected', 'unprotected'] as const).map((x) => (
              <Chip key={x} label={`${t('log.sex')}: ${t(`sex.${x}`)}`} selected={log.sex === x} onPress={() => set({ sex: log.sex === x ? undefined : x })} />
            ))}
            <Chip label={t('log.pill')} selected={!!log.pill} onPress={() => set({ pill: log.pill ? undefined : true })} />
          </Chips>
          <View style={s.gap} />
          <H>{t('log.bbt')}</H>
          <TextInput
            testID="log-bbt"
            accessibilityLabel={t('log.bbt')}
            value={bbt}
            onChangeText={changeBbt}
            onBlur={() => { if (bbtError) setBbt(log.bbt != null ? String(log.bbt) : ''); }}
            keyboardType="decimal-pad"
            placeholder="36.5"
            placeholderTextColor={c.muted}
            maxLength={5}
            style={[s.input, input, bbtError && { borderColor: c.danger }]}
          />
          {bbtError ? <Text testID="bbt-error" accessibilityLiveRegion="polite" style={{ color: c.danger, marginTop: 6 }}>{t('log.bbtInvalid')}</Text> : null}
          <View style={s.gap} />
          <H>{t('log.note')}</H>
          <TextInput
            testID="log-note"
            accessibilityLabel={t('log.note')}
            value={note}
            onChangeText={changeNote}
            placeholder={t('log.notePlaceholder')}
            placeholderTextColor={c.muted}
            multiline
            maxLength={2000}
            style={[s.input, input, { minHeight: 96, textAlignVertical: 'top' }]}
          />
          <View style={s.gap} />
          {data.logs[date] ? (
            <Button
              testID="log-clear"
              kind="danger"
              label={t('log.clear')}
              onPress={() => {
                setBbt('');
                setNote('');
                set({ flow: undefined, symptoms: [], moods: [], discharge: undefined, bbt: undefined, sex: undefined, pill: undefined, note: undefined });
              }}
            />
          ) : null}
        </ScrollView>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const s = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingBottom: 12, borderBottomWidth: StyleSheet.hairlineWidth },
  gap: { height: 22 },
  input: { borderWidth: 1, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, fontSize: 16 },
});

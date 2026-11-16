import { useState } from 'react';
import { Modal, Platform, Share, StyleSheet, Text, TextInput, View } from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';
import { parseData, serialize } from '../core/storage';
import { ensurePermission, notificationsSupported } from '../notifications';
import { useStore } from '../store';
import { useColors } from '../theme';
import { Body, Button, Card, Chip, Chips, H, Stepper, Toggle } from '../ui/kit';

function Dialog({ visible, children }: { visible: boolean; children: React.ReactNode }) {
  const c = useColors();
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={s.backdrop}><View style={[s.dialog, { backgroundColor: c.card }]}>{children}</View></View>
    </Modal>
  );
}

export function SettingsScreen() {
  const { data, t, setSettings, replaceAll, deleteAll } = useStore();
  const c = useColors();
  const st = data.settings;
  const [msg, setMsg] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [importing, setImporting] = useState(false);
  const [importText, setImportText] = useState('');
  const [importError, setImportError] = useState(false);

  const enableReminder = async (patch: Parameters<typeof setSettings>[0]) => {
    if (!notificationsSupported) return setMsg(t('set.notifWeb'));
    if (!(await ensurePermission())) return setMsg(t('set.notifDenied'));
    setMsg('');
    setSettings(patch);
  };

  const toggleLock = async (v: boolean) => {
    if (!v) return setSettings({ appLock: false });
    if (Platform.OS === 'web' || !(await LocalAuthentication.isEnrolledAsync())) return setMsg(t('set.lockUnavailable'));
    const r = await LocalAuthentication.authenticateAsync({ promptMessage: t('lock.reason') });
    if (r.success) {
      setMsg('');
      setSettings({ appLock: true });
    }
  };

  const exportData = async () => {
    const json = serialize(data);
    if (Platform.OS === 'web') {
      const a = document.createElement('a');
      a.href = URL.createObjectURL(new Blob([json], { type: 'application/json' }));
      a.download = 'dongum-yedek.json';
      a.click();
      URL.revokeObjectURL(a.href);
    } else {
      await Share.share({ message: json }).catch(() => {});
    }
  };

  const doImport = () => {
    try {
      const next = parseData(importText);
      replaceAll({ ...next, settings: { ...next.settings, onboarded: true, appLock: st.appLock } });
      setImporting(false);
      setImportText('');
      setImportError(false);
      setMsg(t('set.importOk'));
    } catch {
      setImportError(true);
    }
  };

  return (
    <View>
      {msg ? <View testID="settings-msg" style={[s.msg, { backgroundColor: c.warnBg }]}><Text style={{ color: c.warnText }}>{msg}</Text></View> : null}
      <Card>
        <H>{t('set.cycle')}</H>
        <Stepper testID="set-cycle" label={t('onb.cycleLength')} unit={t('days')} value={st.cycleLength} min={15} max={60} onChange={(v) => setSettings({ cycleLength: v })} />
        <Stepper testID="set-period" label={t('onb.periodLength')} unit={t('days')} value={st.periodLength} min={1} max={10} onChange={(v) => setSettings({ periodLength: v })} />
        <Toggle testID="set-fertility" label={t('set.showFertility')} value={st.showFertility} onChange={(v) => setSettings({ showFertility: v })} />
      </Card>
      <Card>
        <H>{t('set.reminders')}</H>
        <Toggle testID="set-remind-period" label={t('set.remindPeriod')} value={st.remindPeriod}
          onChange={(v) => (v ? enableReminder({ remindPeriod: true }) : setSettings({ remindPeriod: false }))} />
        {st.remindPeriod
          ? <Stepper label={t('set.daysBefore')} value={st.remindPeriodDaysBefore} min={0} max={7} onChange={(v) => setSettings({ remindPeriodDaysBefore: v })} />
          : null}
        {st.showFertility
          ? <Toggle label={t('set.remindFertile')} value={st.remindFertile}
              onChange={(v) => (v ? enableReminder({ remindFertile: true }) : setSettings({ remindFertile: false }))} />
          : null}
        <Toggle label={t('set.discreet')} hint={t('set.discreetHint')} value={st.discreetNotifications} onChange={(v) => setSettings({ discreetNotifications: v })} />
      </Card>
      <Card>
        <H>{t('set.privacy')}</H>
        <Toggle testID="set-lock" label={t('set.appLock')} value={st.appLock} onChange={toggleLock} />
        <Body muted style={{ fontSize: 13, marginTop: 6 }}>{t('onb.privacy')}</Body>
      </Card>
      <Card>
        <H>{t('set.language')}</H>
        <Chips>
          <Chip testID="set-lang-tr" label="Türkçe" selected={st.lang === 'tr'} onPress={() => setSettings({ lang: 'tr' })} />
          <Chip testID="set-lang-en" label="English" selected={st.lang === 'en'} onPress={() => setSettings({ lang: 'en' })} />
        </Chips>
      </Card>
      <Card>
        <H>{t('set.data')}</H>
        <Body muted style={{ fontSize: 13 }}>{t('set.exportWarn')}</Body>
        <Button testID="set-export" kind="ghost" label={t('set.export')} onPress={exportData} />
        <Button testID="set-import" kind="ghost" label={t('set.import')} onPress={() => setImporting(true)} />
        <Button testID="set-delete" kind="danger" label={t('set.deleteAll')} onPress={() => setConfirmDelete(true)} />
      </Card>
      <Card><H>{t('set.about')}</H><Body muted style={{ fontSize: 13 }}>{t('disclaimer')}</Body></Card>

      <Dialog visible={confirmDelete}>
        <Body>{t('set.deleteConfirm')}</Body>
        <Button testID="delete-yes" kind="danger" label={t('set.deleteYes')} onPress={() => { setConfirmDelete(false); void deleteAll(); }} />
        <Button testID="delete-no" label={t('cancel')} onPress={() => setConfirmDelete(false)} />
      </Dialog>
      <Dialog visible={importing}>
        <Body>{t('set.importHint')}</Body>
        <TextInput
          testID="import-text" accessibilityLabel={t('set.import')} value={importText}
          onChangeText={(v) => { setImportText(v); setImportError(false); }}
          multiline autoCapitalize="none" autoCorrect={false}
          style={[s.input, { borderColor: importError ? c.danger : c.border, color: c.text }]}
        />
        {importError ? <Text testID="import-error" style={{ color: c.danger, marginTop: 6 }}>{t('set.importBad')}</Text> : null}
        <Button testID="import-ok" label={t('set.import')} disabled={!importText.trim()} onPress={doImport} />
        <Button kind="ghost" label={t('cancel')} onPress={() => { setImporting(false); setImportError(false); }} />
      </Dialog>
    </View>
  );
}

const s = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 24 },
  dialog: { borderRadius: 20, padding: 20, maxWidth: 480, width: '100%', alignSelf: 'center' },
  input: { borderWidth: 1, borderRadius: 12, padding: 12, minHeight: 120, marginTop: 12, textAlignVertical: 'top', fontSize: 13 },
  msg: { borderRadius: 12, padding: 12, marginBottom: 12 },
});

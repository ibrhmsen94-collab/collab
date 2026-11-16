import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Switch, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { useColors } from '../theme';

export function Card({ children, style }: { children: ReactNode; style?: StyleProp<ViewStyle> }) {
  const c = useColors();
  return <View style={[s.card, { backgroundColor: c.card, borderColor: c.border }, style]}>{children}</View>;
}

export function H({ children }: { children: ReactNode }) {
  const c = useColors();
  return <Text accessibilityRole="header" style={[s.h, { color: c.muted }]}>{children}</Text>;
}

export function Body({ children, muted, style }: { children: ReactNode; muted?: boolean; style?: object }) {
  const c = useColors();
  return <Text style={[s.body, { color: muted ? c.muted : c.text }, style]}>{children}</Text>;
}

export function Button({ label, onPress, kind = 'primary', disabled, testID }: {
  label: string; onPress: () => void; kind?: 'primary' | 'ghost' | 'danger'; disabled?: boolean; testID?: string;
}) {
  const c = useColors();
  const bg = kind === 'primary' ? c.primary : 'transparent';
  const fg = kind === 'primary' ? c.onPrimary : kind === 'danger' ? c.danger : c.primary;
  return (
    <Pressable
      testID={testID}
      accessibilityRole="button"
      accessibilityState={{ disabled: !!disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        s.btn,
        { backgroundColor: bg, borderColor: kind === 'primary' ? c.primary : c.border, opacity: disabled ? 0.4 : pressed ? 0.75 : 1 },
      ]}
    >
      <Text style={[s.btnText, { color: fg }]}>{label}</Text>
    </Pressable>
  );
}

export function Chip({ label, selected, onPress, testID }: { label: string; selected: boolean; onPress: () => void; testID?: string }) {
  const c = useColors();
  return (
    <Pressable
      testID={testID}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: selected }}
      onPress={onPress}
      style={[s.chip, { backgroundColor: selected ? c.primary : c.card, borderColor: selected ? c.primary : c.border }]}
    >
      <Text style={{ color: selected ? c.onPrimary : c.text, fontSize: 15, fontWeight: selected ? '600' : '400' }}>{label}</Text>
    </Pressable>
  );
}

export function Chips({ children }: { children: ReactNode }) {
  return <View style={s.chips}>{children}</View>;
}

export function Stepper({ label, value, min, max, unit, onChange, testID }: {
  label: string; value: number; min: number; max: number; unit?: string; onChange: (v: number) => void; testID?: string;
}) {
  const c = useColors();
  const btn = (delta: number, sign: string) => (
    <Pressable
      testID={testID && `${testID}-${delta > 0 ? 'inc' : 'dec'}`}
      accessibilityRole="button"
      accessibilityLabel={`${label} ${sign}`}
      disabled={value + delta < min || value + delta > max}
      onPress={() => onChange(value + delta)}
      style={({ pressed }) => [s.stepBtn, { borderColor: c.border, opacity: value + delta < min || value + delta > max ? 0.3 : pressed ? 0.6 : 1 }]}
    >
      <Text style={{ color: c.primary, fontSize: 22, lineHeight: 24 }}>{sign}</Text>
    </Pressable>
  );
  return (
    <View style={s.row}>
      <Text style={[s.body, { color: c.text, flex: 1 }]}>{label}</Text>
      {btn(-1, '−')}
      <Text testID={testID && `${testID}-value`} style={[s.stepVal, { color: c.text }]}>{value}{unit ? ` ${unit}` : ''}</Text>
      {btn(1, '+')}
    </View>
  );
}

export function Toggle({ label, hint, value, onChange, testID }: {
  label: string; hint?: string; value: boolean; onChange: (v: boolean) => void; testID?: string;
}) {
  const c = useColors();
  return (
    <View style={s.row}>
      <View style={{ flex: 1, paddingRight: 12 }}>
        <Text style={[s.body, { color: c.text }]}>{label}</Text>
        {hint ? <Text style={{ color: c.muted, fontSize: 13, marginTop: 2 }}>{hint}</Text> : null}
      </View>
      <Switch testID={testID} accessibilityLabel={label} value={value} onValueChange={onChange} trackColor={{ true: c.primary, false: c.border }} />
    </View>
  );
}

const s = StyleSheet.create({
  card: { borderRadius: 16, borderWidth: StyleSheet.hairlineWidth, padding: 16, marginBottom: 12 },
  h: { fontSize: 13, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 10 },
  body: { fontSize: 16, lineHeight: 22 },
  btn: { minHeight: 48, borderRadius: 24, borderWidth: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 20, marginTop: 8 },
  btnText: { fontSize: 16, fontWeight: '600' },
  chip: { minHeight: 44, paddingHorizontal: 14, borderRadius: 22, borderWidth: 1, justifyContent: 'center' },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  row: { flexDirection: 'row', alignItems: 'center', minHeight: 48, paddingVertical: 4 },
  stepBtn: { width: 44, height: 44, borderRadius: 22, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  stepVal: { minWidth: 76, textAlign: 'center', fontSize: 16, fontWeight: '600' },
});

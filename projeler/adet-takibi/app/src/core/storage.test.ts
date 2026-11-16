import { emptyData, parseData, sanitizeLog, sanitizeSettings, serialize, withLog } from './storage';

describe('storage', () => {
  test('serialize → parseData gidiş-dönüşü veriyi korur', () => {
    const d = emptyData();
    d.settings.onboarded = true;
    d.logs['2026-11-01'] = { flow: 'heavy', symptoms: ['cramps'], moods: ['sad'], bbt: 36.6, note: 'x', pill: true };
    expect(parseData(serialize(d))).toEqual(d);
  });
  test('bozuk veya yabancı veriyi reddeder', () => {
    expect(() => parseData('not json')).toThrow();
    expect(() => parseData('[]')).toThrow();
    expect(() => parseData('{"version":2,"logs":{}}')).toThrow();
    expect(() => parseData('{"version":1}')).toThrow();
  });
  test('geçersiz tarih, alan ve değerleri ayıklar', () => {
    const d = parseData(JSON.stringify({
      version: 1,
      settings: { cycleLength: 999, lang: 'de', appLock: 'yes' },
      logs: {
        '2026-02-30': { flow: 'heavy' },
        '__proto__': { flow: 'heavy' },
        '2026-11-01': { flow: 'flood', symptoms: ['cramps', 'hack'], bbt: 99, evil: 1 },
        '2026-11-02': { symptoms: [] },
      },
    }));
    expect(d.logs).toEqual({ '2026-11-01': { symptoms: ['cramps'] } });
    expect(d.settings).toMatchObject({ cycleLength: 60, lang: 'tr', appLock: false });
  });
  test('içe aktarmada gelecekteki kayıtlar atılır, depodan okurken korunur', () => {
    const json = JSON.stringify({ version: 1, settings: {}, logs: { '2026-11-16': { flow: 'light' }, '2030-01-01': { flow: 'heavy' } } });
    expect(Object.keys(parseData(json, '2026-11-16').logs)).toEqual(['2026-11-16']);
    expect(Object.keys(parseData(json).logs)).toHaveLength(2);
  });
  test('__proto__ anahtarı prototipi kirletmez', () => {
    const d = parseData('{"version":1,"settings":{},"logs":{"__proto__":{"flow":"heavy"}}}');
    expect(d.logs).toEqual({});
    expect(({} as Record<string, unknown>).flow).toBeUndefined();
  });
  test('sanitizeLog boş kaydı null yapar, notu kısaltır', () => {
    expect(sanitizeLog({ note: '   ' })).toBeNull();
    expect(sanitizeLog(null)).toBeNull();
    expect(sanitizeLog({ note: 'a'.repeat(3000) })?.note).toHaveLength(2000);
  });
  test('sanitizeSettings eksik alanları varsayılanla doldurur', () => {
    expect(sanitizeSettings(undefined).cycleLength).toBe(28);
    expect(sanitizeSettings({ periodLength: 0 }).periodLength).toBe(1);
  });
  test('withLog birleştirir, boşalınca günü siler ve girdiyi değiştirmez', () => {
    const a = withLog({}, '2026-11-01', { flow: 'light' });
    const b = withLog(a, '2026-11-01', { symptoms: ['headache'] });
    expect(b['2026-11-01']).toEqual({ flow: 'light', symptoms: ['headache'] });
    const c = withLog(b, '2026-11-01', { flow: undefined, symptoms: [] });
    expect(c).toEqual({});
    expect(a['2026-11-01']).toEqual({ flow: 'light' });
  });
});

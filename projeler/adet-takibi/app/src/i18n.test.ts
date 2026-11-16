import { formatDate, translator } from './i18n';

describe('i18n', () => {
  test('İngilizce tekil/çoğul', () => {
    const t = translator('en');
    expect(t('today.late', { n: 1 })).toBe('Period is 1 day late');
    expect(t('today.late', { n: 2 })).toBe('Period is 2 days late');
    expect(t('today.uncertainty', { n: 1 })).toBe('± 1 day');
    expect(t('stats.times', { n: 1 })).toBe('1 time');
    expect(t('stats.times', { n: 11 })).toBe('11 times');
    expect(t('notif.period.body', { n: 1 })).toBe('It is predicted to start in 1 day.');
  });
  test('Türkçe parametre yerleştirme', () => {
    expect(translator('tr')('today.late', { n: 1 })).toBe('Adet 1 gün gecikti');
  });
  test('tarihte yıl yalnızca farklı yılda yazılır', () => {
    expect(formatDate('tr', '2026-11-16', 2026)).toBe('16 Kasım');
    expect(formatDate('tr', '2025-11-16', 2026)).toBe('16 Kasım 2025');
    expect(formatDate('en', '2025-11-16', 2026)).toBe('November 16, 2025');
  });
});

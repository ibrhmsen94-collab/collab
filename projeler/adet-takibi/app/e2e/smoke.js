// Web derlemesi üzerinde uçtan uca duman testi. Kullanım: node e2e/smoke.js <url> [ekran-görüntüsü-klasörü]
const { chromium } = require('playwright');
const assert = require('node:assert/strict');

const url = process.argv[2] || 'http://localhost:8099';
const shots = process.argv[3];
const NOW = new Date(2026, 10, 16, 10, 0, 0); // 16 Kasım 2026

(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, locale: 'tr-TR', deviceScaleFactor: shots ? 2 : 1 });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e)));
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
  await page.clock.install({ time: NOW });
  const shot = async (name) => shots && page.screenshot({ path: `${shots}/${name}.png` });
  const id = (x) => page.getByTestId(x);
  const text = async (x) => (await id(x).textContent()).trim();

  await page.goto(url);
  // Onboarding
  await id('lang-tr').waitFor();
  await shot('01-hosgeldin');
  await id('onb-next').click();
  await id('day-2026-11-20').waitFor();
  assert.equal(await id('day-2026-11-20').isDisabled(), true, 'gelecek gün seçilememeli');
  await id('day-2026-11-01').click();
  await shot('02-son-adet');
  await id('onb-next').click();
  await id('onb-cycle-inc').click();
  await id('onb-cycle-dec').click();
  assert.equal(await text('onb-cycle-value'), '28 gün');
  await id('onb-start').click();

  // Bugün: 1 Kasım başlangıç, 28 gün → 29 Kasım; bugün döngünün 16. günü
  await id('headline').waitFor();
  assert.equal(await text('headline'), 'Adete 13 gün');
  assert.equal(await text('phase'), 'Doğurgan dönem');
  assert.match(await text('next-period'), /26 Kasım – 2 Aralık/);
  assert.match(await text('fertile'), /10 Kasım – 16 Kasım/);
  await shot('03-bugun');

  // Günlük kayıt
  await id('log-today').click();
  await id('sym-cramps').click();
  await id('mood-calm').click();
  await id('log-bbt').fill('36,6');
  await id('log-note').fill('deneme notu');
  await shot('04-kayit');
  await id('log-done').click();
  await page.getByText('Kramp · Sakin').waitFor();

  // Takvim
  await id('tab-calendar').click();
  await id('day-2026-11-01').waitFor();
  const label = (d) => id(`day-${d}`).getAttribute('aria-label');
  assert.match(await label('2026-11-01'), /Adet/);
  assert.match(await label('2026-11-15'), /Yumurtlama/);
  assert.match(await label('2026-11-16'), /Bugün.*Doğurgan.*Kayıt var/);
  assert.match(await label('2026-11-29'), /Tahmini adet/);
  await shot('05-takvim');
  // Geçmişe ikinci bir adet ekle → döngü geçmişi oluşur
  await id('cal-prev').click();
  for (const d of ['2026-10-02', '2026-10-03', '2026-10-04']) {
    await id(`day-${d}`).click();
    await id('flow-heavy').click();
    await id('log-done').click();
  }

  // İstatistik: 2 Ekim → 1 Kasım = 30 gün
  await id('tab-stats').click();
  assert.equal(await text('stat-cycle'), '30 gün');
  assert.equal(await text('stat-count'), '1');
  assert.equal(await text('stat-period'), '3 gün');
  await page.getByText('Kramp').first().waitFor();
  await shot('06-istatistik');

  // Kalıcılık: yeniden yüklemede veri durur
  await page.reload();
  await id('headline').waitFor();
  assert.equal(await text('headline'), 'Adete 15 gün');

  // Ayarlar: dil, doğurganlık gizleme, hatalı içe aktarma, silme
  await id('tab-settings').click();
  await shot('07-ayarlar');
  await id('set-lang-en').click();
  await page.getByText('Show fertile window').waitFor();
  await id('set-lang-tr').click();
  await id('set-fertility').click();
  await id('tab-today').click();
  assert.equal(await id('fertile').count(), 0, 'doğurgan pencere gizlenmeli');
  await id('tab-settings').click();
  await id('set-import').click();
  await id('import-text').fill('{"bozuk":true}');
  await id('import-ok').click();
  await id('import-error').waitFor();
  await page.getByText('Vazgeç').last().click();
  await id('set-delete').click();
  await id('delete-yes').click();
  await id('lang-tr').waitFor(); // onboarding'e döndü
  assert.equal(await page.evaluate(() => Object.keys(localStorage).some((k) => (localStorage.getItem(k) || '').includes('deneme notu'))), false, 'silinen veri depoda kalmamalı');

  assert.deepEqual(errors, [], 'konsol hatası olmamalı');
  await browser.close();
  console.log('E2E OK');
})().catch((e) => {
  console.error(e);
  process.exit(1);
});

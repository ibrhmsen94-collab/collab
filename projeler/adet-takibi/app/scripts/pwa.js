// expo export sonrası dist/ klasörünü PWA'ya çevirir: etiketleri ekler, servis çalışanını üretir.
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');

const dist = path.join(__dirname, '..', 'dist');
const walk = (dir) =>
  fs.readdirSync(dir, { withFileTypes: true }).flatMap((d) => {
    const p = path.join(dir, d.name);
    return d.isDirectory() ? walk(p) : [p];
  });

const html = path.join(dist, 'index.html');
let src = fs.readFileSync(html, 'utf8');
if (!src.includes('manifest.webmanifest')) {
  const head = [
    '<link rel="manifest" href="manifest.webmanifest">',
    '<meta name="theme-color" content="#C2415B">',
    '<meta name="apple-mobile-web-app-capable" content="yes">',
    '<meta name="mobile-web-app-capable" content="yes">',
    '<meta name="apple-mobile-web-app-title" content="Döngüm">',
    '<meta name="apple-mobile-web-app-status-bar-style" content="default">',
    '<link rel="apple-touch-icon" href="icons/apple-touch-icon.png">',
  ].join('\n');
  src = src.replace('<head>', `<head>\n${head}`).replace('<html lang="en">', '<html lang="tr">');
  src = src.replace(
    '</body>',
    "<script>if('serviceWorker' in navigator){window.addEventListener('load',function(){navigator.serviceWorker.register('sw.js').catch(function(){})})}</script>\n</body>",
  );
  fs.writeFileSync(html, src);
}

const files = walk(dist)
  .map((f) => path.relative(dist, f).split(path.sep).join('/'))
  .filter((f) => !['sw.js', 'sw.template.js', 'metadata.json'].includes(f));
const list = ['./', ...files.map((f) => `./${f}`)];
const version = crypto.createHash('sha1').update(files.map((f) => f + fs.statSync(path.join(dist, f)).size).join()).digest('hex').slice(0, 10);
const sw = fs.readFileSync(path.join(__dirname, '..', 'public', 'sw.template.js'), 'utf8')
  .replace('__VERSION__', version)
  .replace('__FILES__', JSON.stringify(list));
fs.writeFileSync(path.join(dist, 'sw.js'), sw);
if (fs.existsSync(path.join(dist, 'sw.template.js'))) fs.rmSync(path.join(dist, 'sw.template.js'));
console.log(`PWA hazır: ${list.length} dosya önbelleğe alınacak (sürüm ${version})`);

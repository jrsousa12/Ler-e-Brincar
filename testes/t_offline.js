// Teste guardado: modo sem internet. Confere a lista do sw.js, o manifesto e abre o app offline.
// Uso: node testes/t_offline.js
'use strict';
const fs = require('fs'), path = require('path'), http = require('http');
const { chromium } = require('playwright');
const raiz = path.join(__dirname, '..');
let falhas = 0;
const ok = (c, m) => { if (!c) { falhas++; console.log('FALHA: ' + m); } };

// 1) Todo arquivo local usado pelo index.html precisa estar na lista do sw.js
const html = fs.readFileSync(path.join(raiz, 'index.html'), 'utf8');
const sw = fs.readFileSync(path.join(raiz, 'sw.js'), 'utf8');
const usados = [...html.matchAll(/(?:src|href)="([^":]+?)"/g)].map(m => m[1]).filter(u => !u.startsWith('data:'));
usados.forEach(u => { ok(sw.includes("'" + u + "'"), 'sw.js não lista: ' + u); ok(fs.existsSync(path.join(raiz, u)), 'não existe: ' + u); });
// 2) Manifesto e ícones
const man = JSON.parse(fs.readFileSync(path.join(raiz, 'manifest.json'), 'utf8'));
man.icons.forEach(i => ok(fs.existsSync(path.join(raiz, i.src)), 'ícone faltando: ' + i.src));
ok(man.start_url === './' && man.display === 'standalone', 'manifesto: start_url/display');

// 3) Navegador: 1ª visita guarda tudo; depois, sem rede, o app abre
const tipos = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.png': 'image/png' };
const srv = http.createServer((q, r) => {
  const f = path.join(raiz, q.url.split('?')[0] === '/' ? 'index.html' : decodeURIComponent(q.url.split('?')[0]));
  if (!f.startsWith(raiz) || !fs.existsSync(f)) { r.writeHead(404); return r.end(); }
  r.writeHead(200, { 'Content-Type': tipos[path.extname(f)] || 'application/octet-stream' }); r.end(fs.readFileSync(f));
}).listen(0, async () => {
  const url = 'http://localhost:' + srv.address().port + '/';
  const b = await chromium.launch();
  const ctx = await b.newContext();
  const p = await ctx.newPage();
  await p.goto(url);
  await p.evaluate(() => navigator.serviceWorker.ready);
  await p.waitForSelector('.card', { timeout: 5000 }).catch(() => {});
  ok(await p.evaluate(() => caches.keys().then(k => k.length > 0)), 'cache não foi criado');
  await ctx.setOffline(true);
  const q = await ctx.newPage();
  await q.goto(url);
  await q.waitForSelector('.card', { timeout: 5000 }).catch(() => {});
  ok((await q.locator('.bloco-menu').count()) === 4 && (await q.locator('.card-missao').count()) === 1, 'sem internet: tela inicial não abriu');
  ok(await q.evaluate(() => typeof Vue !== 'undefined' && typeof Dexie !== 'undefined'), 'sem internet: Vue/Dexie');
  await b.close(); srv.close();
  console.log(falhas ? falhas + ' falha(s)' : 'OK: app instalável e funciona sem internet');
  process.exit(falhas ? 1 : 0);
});

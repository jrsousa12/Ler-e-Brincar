// Motor: junta o app inteiro num só arquivo .html (abre com dois cliques, sem internet).
// Uso: node build/arquivo-unico.js [saida.html]   (padrão: build/previas/ler-e-brincar.html)
// Coloca dentro do HTML: CSS, JS, conteúdo, Vue/Dexie e as fontes (em base64).
// Sem service worker (não funciona em arquivo local); o progresso fica guardado no navegador.
const fs = require('fs');
const path = require('path');

const RAIZ = path.join(__dirname, '..');
const saida = path.resolve(process.argv[2] || path.join(RAIZ, 'build/previas/ler-e-brincar.html'));
const ler = (rel) => fs.readFileSync(path.join(RAIZ, rel), 'utf8');
const TIPOS = { '.woff2': 'font/woff2', '.png': 'image/png', '.svg': 'image/svg+xml' };

// Troca url(...) do CSS pelo próprio arquivo em base64.
function embutirUrls(css, pastaCss) {
  return css.replace(/url\((['"]?)([^)'"]+)\1\)/g, (todo, _a, ref) => {
    if (/^(data:|https?:)/.test(ref)) return todo;
    const arq = path.join(RAIZ, pastaCss, ref);
    if (!fs.existsSync(arq)) return todo;
    const tipo = TIPOS[path.extname(arq)] || 'application/octet-stream';
    return `url(data:${tipo};base64,${fs.readFileSync(arq).toString('base64')})`;
  });
}

let html = ler('index.html');
let nCss = 0, nJs = 0;

html = html.replace(/<link rel="stylesheet" href="([^"]+)">/g, (_t, rel) => {
  nCss++;
  return `<style>/* ${rel} */\n${embutirUrls(ler(rel), path.dirname(rel))}</style>`;
});

html = html.replace(/<script src="([^"]+)"><\/script>/g, (_t, rel) => {
  if (rel === 'js/registrar-sw.js') return '';
  nJs++;
  const js = ler(rel).replace(/<\/script/gi, '<\\/script');
  return `<script>/* ${rel} */\n${js}</script>`;
});

// Manifesto e ícone externo não funcionam em arquivo solto.
html = html.replace(/<link rel="manifest"[^>]*>\n?/, '').replace(/<link rel="apple-touch-icon"[^>]*>\n?/, '');

fs.mkdirSync(path.dirname(saida), { recursive: true });
fs.writeFileSync(saida, html);
const kb = Math.round(fs.statSync(saida).size / 1024);
console.log(`Arquivo único: ${path.relative(RAIZ, saida)} (${kb} KB; ${nCss} CSS, ${nJs} JS)`);

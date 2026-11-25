// Motor vetorizar (desenhos de colorir a partir de imagens do Gemini): copia o traço preto da imagem
// e transforma cada espaço branco fechado numa parte que a criança pinta com um toque.
// Uso:
//   node build/vetorizar.js                     todas as imagens de build/pedidos/imagens/
//   node build/vetorizar.js <imagem> [...]      só essas
//   --gravar      grava no app (passa ao build/colorir.js, que confere e faz a prévia)
// Nome da imagem: número do desenho que ela troca (ex.: 04-casa.jpg troca colorir-04).
// Desenho novo: usar o próximo número livre e pôr título e emoji em build/fichas/colorir-novos.json.
// Saída: build/pedidos/colorir-imagens.js (pedido) → build/colorir.js (prévia build/previas/colorir.png).
'use strict';
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const { chromium } = require('playwright');
const { engordar, separar, contornos } = require('./vetorizar-tracar');
const raiz = path.join(__dirname, '..');
// Desenhos novos (número que ainda não existe): título e emoji vêm desta ficha
const novos = JSON.parse(fs.readFileSync(path.join(__dirname, 'fichas/colorir-novos.json'), 'utf8'));
const N = 600;            // tamanho do quadro de trabalho (pixels)
const LIMIAR = 140;       // abaixo disto (0 a 255) é traço preto
const MENOR = 70;         // espaço menor que isto (pixels) não vira parte

// Abre a imagem no navegador, recorta o desenho (sem a margem) e devolve a máscara do traço N×N
async function lerTraco(b, arq) {
  const tipo = /\.png$/i.test(arq) ? 'png' : 'jpeg';
  const url = 'data:image/' + tipo + ';base64,' + fs.readFileSync(arq).toString('base64');
  const p = await b.newPage();
  const bits = await p.evaluate(async ({ url, N, LIMIAR }) => {
    const img = new Image();
    img.src = url;
    await img.decode();
    const W = img.width, H = img.height;
    const c = document.createElement('canvas');
    c.width = W; c.height = H;
    const g = c.getContext('2d');
    g.drawImage(img, 0, 0);
    const d = g.getImageData(0, 0, W, H).data;
    let x0 = W, y0 = H, x1 = 0, y1 = 0;
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      const i = (y * W + x) * 4;
      if ((d[i] + d[i + 1] + d[i + 2]) / 3 < LIMIAR) { x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y); }
    }
    const lado = Math.max(x1 - x0, y1 - y0) * 1.04;
    const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2;
    const q = document.createElement('canvas');
    q.width = q.height = N;
    const h = q.getContext('2d');
    h.fillStyle = '#fff'; h.fillRect(0, 0, N, N);
    h.drawImage(img, cx - lado / 2, cy - lado / 2, lado, lado, 0, 0, N, N);
    const e = h.getImageData(0, 0, N, N).data;
    let s = '';
    for (let i = 0; i < N * N; i++) s += (e[i * 4] + e[i * 4 + 1] + e[i * 4 + 2]) / 3 < LIMIAR ? '1' : '0';
    return s;
  }, { url, N, LIMIAR });
  await p.close();
  return Uint8Array.from(bits, ch => +ch);
}

// Máscara do traço → SVG: partes brancas por baixo (pintáveis) e o traço preto por cima (o toque passa)
function montarSvg(traco) {
  const fechado = engordar(traco, N, 1);
  const partes = separar(fechado, N).filter(r => r.area >= MENOR);
  const caminhos = partes.map(r => {
    const m = new Uint8Array(N * N);
    for (const i of r.pixels) m[i] = 1;
    return '<path d="' + contornos(engordar(m, N, 3), N) + '" fill="#FFFFFF"/>';
  });
  const linhas = '<path class="solto" d="' + contornos(traco, N, 0.6) + '" fill="black" fill-rule="evenodd"/>';
  return { svg: '<svg viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg">' + caminhos.join('') + linhas + '</svg>', partes: partes.length };
}

(async () => {
  const args = process.argv.slice(2);
  const gravar = args.includes('--gravar');
  let arqs = args.filter(a => !a.startsWith('--'));
  if (!arqs.length) {
    const pasta = path.join(raiz, 'build/pedidos/imagens');
    arqs = fs.readdirSync(pasta).filter(f => /\.(png|jpe?g)$/i.test(f)).sort().map(f => path.join(pasta, f));
  }
  const b = await chromium.launch();
  const pedido = [];
  for (const arq of arqs) {
    const num = path.basename(arq).match(/^(\d+)/);
    if (!num) { console.log('PULADA ' + path.basename(arq) + ': o nome precisa começar pelo número do desenho'); continue; }
    const id = 'colorir-' + num[1].padStart(2, '0');
    const { svg, partes } = montarSvg(await lerTraco(b, arq));
    pedido.push(Object.assign({ id, svg }, novos[num[1].padStart(2, '0')] || {}));
    console.log(id + ' ← ' + path.basename(arq) + ': ' + partes + ' partes para pintar, ' + Math.round(svg.length / 1024) + ' KB');
  }
  await b.close();
  const saida = path.join(raiz, 'build/pedidos/colorir-imagens.js');
  fs.writeFileSync(saida, '// Gerado por build/vetorizar.js: não editar à mão.\nmodule.exports = ' + JSON.stringify(pedido) + ';\n');
  const r = execFileSync('node', [path.join(__dirname, 'colorir.js'), saida, ...(gravar ? ['--gravar'] : [])], { encoding: 'utf8' });
  console.log(r.trim().split('\n').slice(-4).join('\n'));
})();

// Peças do motor vetorizar.js: trabalham com a "máscara" (1 = pixel marcado) de uma imagem quadrada.
// separar(): acha os espaços brancos fechados; contornos(): vira uma máscara em caminho SVG.
'use strict';

// Engorda a máscara em r pixels (fecha frestas pequenas do traço)
function engordar(m, n, r) {
  let a = m;
  for (let k = 0; k < r; k++) {
    const b = new Uint8Array(n * n);
    for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) {
      const i = y * n + x;
      b[i] = a[i] || (x > 0 && a[i - 1]) || (x < n - 1 && a[i + 1]) || (y > 0 && a[i - n]) || (y < n - 1 && a[i + n]) ? 1 : 0;
    }
    a = b;
  }
  return a;
}

// Separa os espaços brancos (fora do traço) em regiões; devolve [{ pixels, area, borda }]
function separar(traco, n) {
  const rot = new Int32Array(n * n).fill(-1);
  const regioes = [];
  const pilha = [];
  for (let s = 0; s < n * n; s++) {
    if (traco[s] || rot[s] >= 0) continue;
    const id = regioes.length;
    const pixels = [];
    let borda = false;
    rot[s] = id; pilha.push(s);
    while (pilha.length) {
      const i = pilha.pop();
      pixels.push(i);
      const x = i % n, y = (i - x) / n;
      if (x === 0 || y === 0 || x === n - 1 || y === n - 1) borda = true;
      for (const j of [x > 0 ? i - 1 : -1, x < n - 1 ? i + 1 : -1, y > 0 ? i - n : -1, y < n - 1 ? i + n : -1]) {
        if (j >= 0 && !traco[j] && rot[j] < 0) { rot[j] = id; pilha.push(j); }
      }
    }
    regioes.push({ pixels, area: pixels.length, borda });
  }
  return regioes;
}

// Contornos de uma máscara: segue as bordas dos pixels e fecha cada volta
function voltas(m, n) {
  const saidas = new Map();
  const chave = (x, y) => y * (n + 1) + x;
  const add = (x1, y1, x2, y2) => {
    const k = chave(x1, y1);
    if (!saidas.has(k)) saidas.set(k, []);
    saidas.get(k).push([x2, y2]);
  };
  const em = (x, y) => x >= 0 && y >= 0 && x < n && y < n && m[y * n + x];
  for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) {
    if (!m[y * n + x]) continue;
    if (!em(x, y - 1)) add(x, y, x + 1, y);
    if (!em(x + 1, y)) add(x + 1, y, x + 1, y + 1);
    if (!em(x, y + 1)) add(x + 1, y + 1, x, y + 1);
    if (!em(x - 1, y)) add(x, y + 1, x, y);
  }
  const lista = [];
  for (const [k0, l0] of saidas) {
    while (l0.length) {
      let x = k0 % (n + 1), y = (k0 - x) / (n + 1);
      const pts = [[x, y]];
      let [nx, ny] = l0.pop();
      while (!(nx === pts[0][0] && ny === pts[0][1])) {
        pts.push([nx, ny]);
        const l = saidas.get(chave(nx, ny));
        if (!l || !l.length) break;
        [nx, ny] = l.pop();
      }
      if (pts.length > 3) lista.push(pts);
    }
  }
  return lista;
}

// Tira pontos desnecessários (Douglas-Peucker), mantendo a forma
function enxugar(p, e) {
  if (p.length < 4) return p;
  const dist = (q, a, b) => {
    // distância até o segmento a–b (não até a reta inteira: senão corta caminho em idas e voltas)
    const dx = b[0] - a[0], dy = b[1] - a[1], L2 = dx * dx + dy * dy;
    const t = L2 ? Math.max(0, Math.min(1, ((q[0] - a[0]) * dx + (q[1] - a[1]) * dy) / L2)) : 0;
    return Math.hypot(q[0] - a[0] - t * dx, q[1] - a[1] - t * dy);
  };
  let maior = 0, k = 0;
  for (let i = 1; i < p.length - 1; i++) { const d = dist(p[i], p[0], p[p.length - 1]); if (d > maior) { maior = d; k = i; } }
  if (maior <= e) return [p[0], p[p.length - 1]];
  return enxugar(p.slice(0, k + 1), e).slice(0, -1).concat(enxugar(p.slice(k), e));
}

// Suaviza a escadinha dos pixels (média com os vizinhos)
function suavizar(p) {
  return p.map((q, i) => {
    const a = p[(i - 1 + p.length) % p.length], b = p[(i + 1) % p.length];
    return [(a[0] + 2 * q[0] + b[0]) / 4, (a[1] + 2 * q[1] + b[1]) / 4];
  });
}

// Máscara → atributo d do <path> (escala: n pixels viram 300 unidades)
function contornos(m, n, e = 1) {
  const s = 300 / n;
  const r = v => Math.round(v * s * 10) / 10;
  return voltas(m, n).map(cru => {
    const v = suavizar(suavizar(cru));   // tira a escadinha antes de simplificar (depois encolheria a forma)
    const meio = Math.floor(v.length / 2);
    const p = enxugar(v.slice(0, meio + 1), e).slice(0, -1).concat(enxugar(v.slice(meio).concat([v[0]]), e).slice(0, -1));
    return p.length < 3 ? '' : 'M' + p.map(q => r(q[0]) + ' ' + r(q[1])).join('L') + 'Z';
  }).join('');
}

module.exports = { engordar, separar, contornos };

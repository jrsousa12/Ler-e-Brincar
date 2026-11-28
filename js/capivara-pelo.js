// Pelo da capivara (SVG feito pelo código): tufinhos na borda das formas e fios por dentro.
// Sorteio com semente fixa: o desenho sai sempre igual. Caminhos aceitos: "M x,y", "C x,y x,y x,y", "L x,y" e "Z".
LB.capivaraPelo = (function () {
  'use strict';
  // Sorteio repetível (mulberry32).
  function sorteio(semente) {
    let a = semente >>> 0;
    return () => { a = (a + 0x6D2B79F5) >>> 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  }
  const n1 = v => Math.round(v * 10) / 10;

  // Espelha "x,y" para o lado direito (o desenho é simétrico em x = 160).
  const espelhar = d => d.replace(/(-?[\d.]+),(-?[\d.]+)/g, (_t, x, y) => n1(320 - x) + ',' + y);

  // Elipse como caminho (4 curvas), para também ganhar tufinhos.
  function elipse(cx, cy, rx, ry) {
    const k = 0.5523, p = (x, y) => n1(x) + ',' + n1(y);
    return 'M' + p(cx, cy - ry) + ' C' + p(cx + rx * k, cy - ry) + ' ' + p(cx + rx, cy - ry * k) + ' ' + p(cx + rx, cy) +
      ' C' + p(cx + rx, cy + ry * k) + ' ' + p(cx + rx * k, cy + ry) + ' ' + p(cx, cy + ry) +
      ' C' + p(cx - rx * k, cy + ry) + ' ' + p(cx - rx, cy + ry * k) + ' ' + p(cx - rx, cy) +
      ' C' + p(cx - rx, cy - ry * k) + ' ' + p(cx - rx * k, cy - ry) + ' ' + p(cx, cy - ry) + ' Z';
  }

  // Pontos ao longo do caminho, a cada "passo" px, com a direção da borda.
  function pontos(d, passo) {
    const partes = d.match(/[MCLZ]|-?[\d.]+,-?[\d.]+/g), lista = [];
    let atual = null, inicio = null, i = 0;
    const par = s => s.split(',').map(Number);
    const amostrar = (f, comp) => {
      const n = Math.max(2, Math.round(comp / passo));
      for (let k = 0; k < n; k++) { const t = k / n, a = f(t), b = f(t + 0.01); lista.push({ x: a[0], y: a[1], dx: b[0] - a[0], dy: b[1] - a[1] }); }
    };
    const reta = (a, b) => amostrar(t => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t], Math.hypot(b[0] - a[0], b[1] - a[1]));
    while (i < partes.length) {
      const c = partes[i++];
      if (c === 'M') { atual = inicio = par(partes[i++]); }
      else if (c === 'L') { const b = par(partes[i++]); reta(atual, b); atual = b; }
      else if (c === 'Z') { if (atual[0] !== inicio[0] || atual[1] !== inicio[1]) reta(atual, inicio); atual = inicio; }
      else if (c === 'C') {
        const p0 = atual, p1 = par(partes[i++]), p2 = par(partes[i++]), p3 = par(partes[i++]);
        const f = t => [0, 1].map(e => (1 - t) ** 3 * p0[e] + 3 * (1 - t) ** 2 * t * p1[e] + 3 * (1 - t) * t * t * p2[e] + t ** 3 * p3[e]);
        amostrar(f, Math.hypot(p1[0] - p0[0], p1[1] - p0[1]) + Math.hypot(p2[0] - p1[0], p2[1] - p1[1]) + Math.hypot(p3[0] - p2[0], p3[1] - p2[1]));
        atual = p3;
      }
    }
    return lista;
  }

  // Tufinhos apontando para fora da forma (caem um pouco para baixo, como pelo).
  // o: { passo, comp:[min,max], larg, cor, contorno, semente, centro:[x,y], so: (ponto) => bool, fator: (ponto) => número (alonga) }
  function tufos(d, o) {
    const r = sorteio(o.semente || 1), pts = pontos(d, o.passo || 5);
    const cx = o.centro ? o.centro[0] : pts.reduce((s, p) => s + p.x, 0) / pts.length;
    const cy = o.centro ? o.centro[1] : pts.reduce((s, p) => s + p.y, 0) / pts.length;
    let caminho = '';
    pts.forEach(p => {
      if (o.so && !o.so(p)) return;
      const m = Math.hypot(p.dx, p.dy) || 1, tx = p.dx / m, ty = p.dy / m;
      let nx = ty, ny = -tx;
      if (nx * (p.x - cx) + ny * (p.y - cy) < 0) { nx = -nx; ny = -ny; }
      const comp = (o.comp[0] + r() * (o.comp[1] - o.comp[0])) * (o.fator ? o.fator(p) : 1), larg = (o.larg || 4) * (0.7 + r() * 0.6), giro = (r() - 0.5) * 0.9;
      const px = p.x - nx * 2, py = p.y - ny * 2;
      const ponta = [px + (nx + tx * giro) * comp, py + (ny + tx * giro) * comp + comp * 0.25];
      const a = [px - tx * larg, py - ty * larg], b = [px + tx * larg, py + ty * larg];
      const meio = (q, s) => n1((q[0] + ponta[0]) / 2 + nx * s) + ',' + n1((q[1] + ponta[1]) / 2 + ny * s), bojo = larg * 0.4;
      caminho += 'M' + n1(a[0]) + ',' + n1(a[1]) + 'Q' + meio(a, bojo) + ' ' + n1(ponta[0]) + ',' + n1(ponta[1]) + 'Q' + meio(b, bojo) + ' ' + n1(b[0]) + ',' + n1(b[1]) + 'Z';
    });
    const borda = o.contorno ? ' stroke="' + o.contorno + '" stroke-width=".9" stroke-opacity=".3" stroke-linejoin="round"' : '';
    return '<path d="' + caminho + '" fill="' + o.cor + '"' + borda + ' filter="url(#cap-pelinho)"/>';
  }

  // Fios por dentro de uma elipse (cx, cy, rx, ry): riscos curtos, caindo para baixo e para fora.
  // o: { n, cores: [[cor, opacidade], ...], comp:[min,max], semente, fora: (x, y) => bool (pula a área) }
  function fios(cx, cy, rx, ry, o) {
    const r = sorteio(o.semente || 7), grupos = o.cores.map(() => '');
    for (let k = 0; k < o.n; k++) {
      const ang = r() * Math.PI * 2, raio = Math.sqrt(r());
      const x = cx + Math.cos(ang) * rx * raio, y = cy + Math.sin(ang) * ry * raio;
      if (o.fora && o.fora(x, y)) continue;
      const comp = o.comp[0] + r() * (o.comp[1] - o.comp[0]);
      const dir = Math.PI / 2 - ((x - cx) / rx) * 0.9 + (r() - 0.5) * 0.35;
      const fx = x + Math.cos(dir) * comp, fy = y + Math.sin(dir) * comp, curva = (r() - 0.5) * 3 - ((x - cx) / rx) * 2;
      grupos[k % grupos.length] += 'M' + n1(x) + ',' + n1(y) + 'Q' + n1((x + fx) / 2 + curva) + ',' + n1((y + fy) / 2) + ' ' + n1(fx) + ',' + n1(fy);
    }
    return '<g filter="url(#cap-fio)">' + grupos.map((d, i) => '<path d="' + d + '" stroke="' + o.cores[i][0] + '" stroke-opacity="' + o.cores[i][1] +
      '" stroke-width="' + (o.grossura || 1.3) + '" fill="none" stroke-linecap="round"/>').join('') + '</g>';
  }

  return { espelhar, elipse, pontos, tufos, fios };
})();

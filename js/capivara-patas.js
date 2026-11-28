// Patinhas e traços dos braços da capivara (SVG). Desenhadas em volta de (0,0), com a ponta para baixo (+y);
// cada uma vai para o lugar com translate + rotate. Cores: degradê url(#cap-pata) (fica em capivara.js).
LB.capivaraPatas = (function () {
  'use strict';
  const BORDA = '#6E3F2C', DEDO = '#C29079', FEIJAO = '#C89A86';
  const n1 = v => Math.round(v * 10) / 10;

  // Traço que afina: grosso no começo (ombro) e fino no fim (perto da patinha). d = "M x,y C x,y x,y x,y".
  function traco(d, w0, w1, op) {
    const v = d.match(/-?[\d.]+/g).map(Number), p = [0, 2, 4, 6].map(i => [v[i], v[i + 1]]);
    const f = t => [0, 1].map(e => (1 - t) ** 3 * p[0][e] + 3 * (1 - t) ** 2 * t * p[1][e] + 3 * (1 - t) * t * t * p[2][e] + t ** 3 * p[3][e]);
    const ida = [], volta = [], N = 24;
    for (let k = 0; k <= N; k++) {
      const t = k / N, a = f(t), b = f(Math.min(1, t + 0.01)), c = f(Math.max(0, t - 0.01));
      const dx = b[0] - c[0], dy = b[1] - c[1], m = Math.hypot(dx, dy) || 1, w = (w0 + (w1 - w0) * t * t) / 2;
      ida.push(n1(a[0] - dy / m * w) + ',' + n1(a[1] + dx / m * w)); volta.unshift(n1(a[0] + dy / m * w) + ',' + n1(a[1] - dx / m * w));
    }
    return '<path d="M' + ida.join(' L') + ' L' + volta.join(' L') + ' Z" fill="' + BORDA + '" fill-opacity="' + (op || 0.6) + '" filter="url(#cap-pelinho)"/>';
  }

  // Pelo do braço caindo por cima da pata (fios curtos que entram na pata pela parte de trás).
  function franja(cor, larg, y) {
    let d = '';
    for (let i = 0; i < 11; i++) {
      const x = -larg + (2 * larg * i) / 10, base = y - 2 + (x / larg) ** 2 * 5, c = 3 + ((i * 7) % 5) * 0.9;
      d += 'M' + n1(x - 2.2) + ',' + n1(base - 4) + ' Q' + n1(x - 1.2) + ',' + n1(base + c * 0.6) + ' ' + n1(x + 0.4) + ',' + n1(base + c) + ' Q' + n1(x + 1) + ',' + n1(base + c * 0.5) + ' ' + n1(x + 2.2) + ',' + n1(base - 4) + ' Z';
    }
    return '<path d="' + d + '" fill="' + cor + '" filter="url(#cap-pelinho)"/>';
  }

  // Pata de baixo (sentada): feijão com ponta arredondada, dois risquinhos de dedo, brilho e pelo por cima.
  function pata(cx, cy, giro, cor) {
    const borda = 'M-11,-11 C-13.5,-6 -14.5,0 -14,5 C-13.5,11 -7,14.5 0,14.5 C7,14.5 13.5,11 14,5 C14.5,0 13.5,-6 11,-11';
    return '<g transform="translate(' + cx + ' ' + cy + ') rotate(' + giro + ')">' +
      '<ellipse cx="0" cy="9" rx="13" ry="5" fill="#5E3426" opacity=".22" filter="url(#cap-leve)"/>' +
      '<path d="' + borda + ' Z" fill="url(#cap-pata)"/><path d="' + borda + '" fill="none" stroke="' + BORDA + '" stroke-width="1.3" stroke-opacity=".6" filter="url(#cap-pelinho)"/>' +
      '<ellipse cx="-3" cy="1" rx="5.5" ry="3.5" fill="#C99A80" opacity=".35" filter="url(#cap-leve)"/>' +
      '<path d="M-4.5,6 Q-4,9.5 -3,11.2 M4.5,6 Q4,9.5 3,11.2" stroke="' + DEDO + '" stroke-width="1.2" fill="none" stroke-linecap="round" opacity=".9"/>' +
      franja(cor, 9.5, -10.5) + '</g>';
  }

  // Mãozinha aberta (festa): palma redonda, 4 dedinhos, feijõezinhos claros e contorno único em volta de tudo.
  function mao(cx, cy, giro) {
    const DEDOS = [[-12, -9, -38], [-4.5, -14, -12], [4.5, -14, 12], [12, -9, 38]];
    const partes = (extra) => '<ellipse cx="0" cy="1" rx="14" ry="12.5"' + extra + '/>' +
      DEDOS.map(q => '<ellipse cx="' + q[0] + '" cy="' + q[1] + '" rx="5" ry="6.4" transform="rotate(' + q[2] + ' ' + q[0] + ' ' + q[1] + ')"' + extra + '/>').join('');
    return '<g transform="translate(' + cx + ' ' + cy + ') rotate(' + giro + ')">' +
      '<g fill="' + BORDA + '" stroke="' + BORDA + '" stroke-width="2.6" opacity=".6">' + partes('') + '</g>' +
      '<g fill="url(#cap-pata)">' + partes('') + '</g>' +
      '<g fill="' + FEIJAO + '" opacity=".75"><ellipse cx="0" cy="3" rx="6.5" ry="5"/>' +
      DEDOS.map(q => '<ellipse cx="' + q[0] * 0.95 + '" cy="' + (q[1] + 0.8) + '" rx="2.2" ry="2.7"/>').join('') + '</g>' +
      '<path d="M-8.5,-6 L-7.5,-2 M0,-7.5 L0,-3.5 M8.5,-6 L7.5,-2" stroke="' + BORDA + '" stroke-width="1" stroke-opacity=".5" stroke-linecap="round"/>' +
      '</g>';
  }

  // Braço que afina até o pulso: liga os ombros A e B aos dois lados do pulso da pata (q1, q2, em volta da pata),
  // chegando na direção da pata; assim a linha do braço segue direto no contorno da patinha. pata = [cx, cy, giro].
  function braco(A, B, pata, q1, q2, dir, k1, k2) {
    const g = pata[2] * Math.PI / 180, c = Math.cos(g), s = Math.sin(g), sg = Math.sign(q1[1]);
    const glob = q => [pata[0] + q[0] * c - q[1] * s, pata[1] + q[0] * s + q[1] * c], eixo = [-s * sg, c * sg];
    const pp = v => n1(v[0]) + ',' + n1(v[1]);
    const pontos = (O, q) => { const W = glob(q); return [O, [O[0] + dir[0] * k1, O[1] + dir[1] * k1], [W[0] + eixo[0] * k2, W[1] + eixo[1] * k2], W]; };
    const a = pontos(A, q1), b = pontos(B, q2), linha = v => 'M' + pp(v[0]) + ' C' + v.slice(1).map(pp).join(' ');
    return { la: linha(a), lb: linha(b), forma: linha(a) + ' L' + pp(b[3]) + ' C' + pp(b[2]) + ' ' + pp(b[1]) + ' ' + pp(b[0]) + ' Z' };
  }

  // Pelinho do braço por cima do pulso da mãozinha (a franja virada para a mão).
  const pulso = (cx, cy, giro, cor) => '<g transform="translate(' + cx + ' ' + cy + ') rotate(' + giro + ') scale(1 -1)">' + franja(cor, 8.5, -12) + '</g>';

  return { traco, pata, mao, braco, pulso };
})();

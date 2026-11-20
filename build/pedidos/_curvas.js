// Auxiliares de curva suave para os pedidos de desenho (mesmo molde do lote 2).
const { f, polar } = require('../desenho.js');

const r1 = v => +v.toFixed(1), pt = q => q.map(r1).join(' ');
// Polígono de retas com cantos arredondados (raio r).
const RP = (pts, r, fundo, sw) => {
  const n = pts.length; let d = '';
  pts.forEach((c, i) => {
    const a = pts[(i + n - 1) % n], b = pts[(i + 1) % n], u = [a[0] - c[0], a[1] - c[1]], v = [b[0] - c[0], b[1] - c[1]];
    const lu = Math.hypot(...u), lv = Math.hypot(...v), k = Math.min(r, lu / 2, lv / 2);
    d += `${i ? 'L' : 'M'}${pt([c[0] + u[0] / lu * k, c[1] + u[1] / lu * k])} Q${pt(c)} ${pt([c[0] + v[0] / lv * k, c[1] + v[1] / lv * k])} `;
  });
  return f('path', `d="${d}Z"`, fundo, sw);
};
// Retângulo de cantos bem arredondados (x, y = canto de cima; raio r).
const caixa = (x, y, w, h, r, fundo, sw) => RP([[x, y], [x + w, y], [x + w, y + h], [x, y + h]], r, fundo, sw);
// Estrela de cinco pontas e vales arredondados.
const estrela = (cx, cy, R, r, giro = -90, sw = 3, fundo = 'white') =>
  RP(Array.from({ length: 10 }, (_, i) => polar(cx, cy, i % 2 ? r : R, giro + i * 36)), R * 0.16, fundo, sw);

// Solzinho: coroa de 16 pontas arredondadas (R de fora) + miolo redondo.
const solMini = (x, y, R) => RP(Array.from({ length: 16 }, (_, i) => polar(x, y, i % 2 ? R * 0.74 : R, -90 + i * 22.5)), R * 0.13, 'white', 2.5) +
  f('circle', `cx="${x}" cy="${y}" r="${r1(R * 0.5)}"`, 'white', 2.5);

module.exports = { RP, caixa, estrela, solMini };

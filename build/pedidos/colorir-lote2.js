// Lote 2 de desenhos (19/11; suavizado 20/11): estrela, coração, barco, sol com nuvem, lua com estrelas. Rodar: node build/colorir.js build/pedidos/colorir-lote2.js [--gravar]
const { f, solto, olho, svg, nuvem, colina, polar, suave } = require('../desenho.js');
const p = require('../pecas/index.js');

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
// Estrela de pontas e vales arredondados.
const estrela = (cx, cy, R, r, giro = -90, sw = 3, fundo = 'white') =>
  RP(Array.from({ length: 10 }, (_, i) => polar(cx, cy, i % 2 ? r : R, giro + i * 36)), R * 0.16, fundo, sw);
// Coração clássico por equação (36 pontos, ponta de baixo em quina); centro x,y; e = escala.
const coracao = (x, y, e = 1, sw = 3) => {
  const k = 6.6 * e, pts = Array.from({ length: 36 }, (_, i) => {
    const t = i / 36 * 2 * Math.PI, X = 16 * Math.sin(t) ** 3, Y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
    return i === 18 ? [x + k * X, y + k * (Y - 2.5) - 10 * e, 1] : [x + k * X, y + k * (Y - 2.5) - 10 * e];
  });
  return f('path', `d="${suave(pts)}"`, 'white', sw);
};

const estrelaLia = svg(
  estrela(150, 156, 128, 62), estrela(150, 156, 78, 38, -90, 2.5),
  estrela(48, 48, 22, 10), estrela(256, 60, 18, 8), estrela(262, 250, 20, 9), estrela(40, 252, 16, 7),
  f('circle', 'cx="150" cy="158" r="22"', 'white', 2.5),
  f('circle', 'cx="122" cy="170" r="8"', 'white', 2.5), f('circle', 'cx="178" cy="170" r="8"', 'white', 2.5),
  olho(143, 154, 3.5), olho(157, 154, 3.5), solto('M142 164 Q150 172 158 164', 2.5)
);

const coracaoDesenho = svg(
  coracao(150, 160, 1.3), coracao(150, 160, 0.82, 2.5),
  coracao(50, 60, 0.26, 2.5), coracao(252, 52, 0.22, 2.5), coracao(262, 254, 0.2, 2.5), coracao(40, 250, 0.17, 2.5),
  f('ellipse', 'cx="104" cy="104" rx="16" ry="10" transform="rotate(-35 104 104)"', 'white', 2.5),
  p.flor({ x: 150, y: 150, e: 1.1 }), olho(150, 150, 3)
);

const barco = svg(
  p.raiosSol({ x: 238, y: 60, e: 0.36 }), f('circle', 'cx="238" cy="60" r="25"'),
  nuvem(30, 70, 0.9), nuvem(150, 44, 0.6),
  f('path', 'd="M0 250 Q40 232 75 246 Q112 262 150 246 Q190 230 225 246 Q262 262 300 244 L300 300 L0 300 Z"'),
  f('path', 'd="M150 42 C156 104 180 158 212 196 Q214 202 206 204 Q178 208 154 208 Q148 208 150 200 Z"'),
  f('path', 'd="M142 76 C134 128 114 168 82 194 Q76 199 84 201 Q112 205 138 204 Q144 204 142 198 Z"'),
  solto('M146 30 L146 224', 4),
  f('path', 'd="M146 30 Q168 22 188 32 Q168 42 146 42 Z"', 'white', 2.5),
  f('path', 'd="M52 206 Q150 224 248 206 Q242 252 216 262 Q150 276 84 262 Q58 252 52 206 Z"'),
  f('circle', 'cx="106" cy="236" r="9"', 'white', 2.5), f('circle', 'cx="150" cy="242" r="9"', 'white', 2.5), f('circle', 'cx="194" cy="236" r="9"', 'white', 2.5),
  f('path', 'd="M0 268 Q36 252 72 266 Q108 282 150 268 Q192 254 228 268 Q264 282 300 266 L300 300 L0 300 Z"'),
  solto('M30 284 Q50 278 70 284', 2), solto('M200 286 Q222 280 244 286', 2)
);

const solNuvem = svg(
  colina(272, 14),
  p.raiosSol({ x: 100, y: 112, e: 0.6 }), p.discoSol({ x: 100, y: 112, e: 0.6 }), p.rostoFeliz({ x: 100, y: 112, e: 0.6 }),
  nuvem(206, 62, 0.8),
  nuvem(124, 232, 2.1), nuvem(26, 258, 1.2),
  solto('M170 226 Q190 216 210 226', 2),
  p.flor({ x: 44, y: 264, e: 1.1 }), p.flor({ x: 250, y: 266 }), p.tufo({ x: 120 })
);

const luaEstrela = svg(
  f('path', 'd="M196 38 A112 112 0 1 0 256 214 A88 88 0 1 1 196 38 Z"'),
  f('circle', 'cx="92" cy="170" r="14"', 'white', 2.5), f('circle', 'cx="126" cy="214" r="9"', 'white', 2.5), f('circle', 'cx="76" cy="226" r="7"', 'white', 2.5),
  solto('M70 118 Q84 126 98 118', 2.5), solto('M64 142 Q70 148 78 144', 2),
  estrela(232, 118, 34, 16), estrela(266, 206, 22, 10), estrela(210, 44, 18, 8), estrela(262, 52, 14, 6), estrela(176, 238, 16, 7),
  nuvem(190, 288, 0.9), nuvem(24, 284, 0.8)
);

module.exports = [
  { id: 'colorir-02', svg: estrelaLia }, { id: 'colorir-03', svg: coracaoDesenho }, { id: 'colorir-13', svg: barco },
  { id: 'colorir-18', svg: solNuvem }, { id: 'colorir-21', svg: luaEstrela }
];

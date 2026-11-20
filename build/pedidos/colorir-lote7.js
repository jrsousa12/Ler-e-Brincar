// Lote 7 de desenhos (20/11), repaginado: curvas Bézier, retas com cantos arredondados, formas paramétricas.
// Rodar: node build/colorir.js build/pedidos/colorir-lote7.js [--gravar]
const { f, solto, olho, svg, nuvem, colina, polar, copa, suave } = require('../desenho.js');
const p = require('../pecas/index.js');

const W = 'white', r1 = v => +v.toFixed(1), pt = q => q.map(r1).join(' ');
const D = (d, fundo, sw) => f('path', `d="${d}"`, fundo, sw);                       // caminho com curvas à mão (M, C, Q, L)
const S = (pts, fundo, sw) => D(suave(pts), fundo, sw);                              // curva livre por pontos
const RP = (pts, r = 6, fundo, sw) => {                                              // polígono de retas com cantos arredondados
  const n = pts.length; let d = '';
  pts.forEach((c, i) => {
    const a = pts[(i + n - 1) % n], b = pts[(i + 1) % n], u = [a[0] - c[0], a[1] - c[1]], v = [b[0] - c[0], b[1] - c[1]];
    const lu = Math.hypot(...u), lv = Math.hypot(...v), k = Math.min(r, lu / 2, lv / 2);
    d += `${i ? 'L' : 'M'}${pt([c[0] + u[0] / lu * k, c[1] + u[1] / lu * k])} Q${pt(c)} ${pt([c[0] + v[0] / lv * k, c[1] + v[1] / lv * k])} `;
  });
  return D(d + 'Z', fundo, sw);
};
const RECT = (x, y, w, h, rx, fundo, sw) => f('rect', `x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}"`, fundo, sw);
const CIRC = (x, y, r, fundo, sw) => f('circle', `cx="${x}" cy="${y}" r="${r}"`, fundo, sw);
const hex = (cx, cy, R, giro = 30) => Array.from({ length: 6 }, (_, i) => polar(cx, cy, R, giro + i * 60));
const sol = (x, y) => [CIRC(x, y, 22), p.raiosSol({ x, y, e: 0.24 })];

// ---- Tartaruga ----
const tartaruga = svg(
  ...sol(48, 46), nuvem(196, 52, 0.9),
  colina(284, 10),
  D('M56 222 C44 224 34 218 26 206 C40 204 54 206 62 210 Z'),
  D('M62 236 C58 256 62 272 78 275 C94 277 102 264 100 240 Z'),
  D('M194 238 C190 258 194 274 212 277 C230 278 238 264 234 240 Z'),
  D('M224 206 C228 180 242 160 262 153 C282 147 298 160 293 177 C288 192 270 200 250 216 Z'),
  CIRC(271, 167, 7, W, 2.5), olho(273, 167, 3.5), solto('M274 186 Q283 184 290 176', 2.5),
  D('M46 234 C46 168 92 126 150 126 C208 126 254 168 254 234 Z'),
  RECT(36, 222, 228, 26, 13, W),
  RP(hex(150, 154, 22), 7, W, 2.5),
  RP(hex(102, 192, 25), 7, W, 2.5), RP(hex(150, 192, 25), 7, W, 2.5), RP(hex(198, 192, 25), 7, W, 2.5),
  solto('M50 235 L250 235', 2),
  p.flor({ x: 30, y: 292, e: 1.2 }), p.flor({ x: 256, y: 290 }), p.tufo({ x: 130 })
);

// ---- Girassol ----
const petala = g => {
  const b = polar(150, 112, 38, g), t = polar(150, 112, 98, g);
  const c1 = polar(150, 112, 62, g - 19), c2 = polar(150, 112, 90, g - 14), c3 = polar(150, 112, 90, g + 14), c4 = polar(150, 112, 62, g + 19);
  return [D(`M${pt(b)} C${pt(c1)} ${pt(c2)} ${pt(t)} C${pt(c3)} ${pt(c4)} ${pt(b)} Z`, W, 3), solto(`M${pt(polar(150, 112, 50, g))} L${pt(polar(150, 112, 80, g))}`, 2)];
};
const folha = (x, y, d, e = 1) => [D(`M${x} ${y} C${x + 30 * d * e} ${y - 34 * e} ${x + 74 * d * e} ${y - 40 * e} ${x + 92 * d * e} ${y - 14 * e} C${x + 66 * d * e} ${y + 14 * e} ${x + 26 * d * e} ${y + 14 * e} ${x} ${y} Z`, W),
  solto(`M${x + 4 * d} ${y - 1} Q${x + 46 * d * e} ${y - 14 * e} ${x + 84 * d * e} ${y - 13 * e}`, 2.5)];
const semente = Array.from({ length: 34 }, (_, i) => polar(150, 112, 4.4 * Math.sqrt(i + 1.5), i * 137.5)).map(([x, y]) => olho(x, y, 1.7));
const girassol = svg(
  ...sol(46, 44), nuvem(226, 50, 0.9),
  colina(284, 10),
  D('M144 150 C142 200 148 246 144 292 L158 292 C162 246 156 200 156 150 Z'),
  ...folha(156, 244, 1), ...folha(144, 262, -1, 0.9),
  ...[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].flatMap(i => petala(i * 30 + 8)),
  CIRC(150, 112, 40), CIRC(150, 112, 28, W, 2.5), ...semente,
  p.flor({ x: 46, y: 288, e: 1.3 }), p.flor({ x: 254, y: 288 }), p.tufo({ x: 100 }), p.tufo({ x: 204 })
);

// ---- Maçã: curva paramétrica (coração achatado, base mais estreita, covinhas no topo e na base) ----
const pontosMaca = (cx, cy, A, B) => Array.from({ length: 72 }, (_, i) => {
  const t = i / 72 * 2 * Math.PI, s = Math.sin(t), c = Math.cos(t), d = Math.min(t, 2 * Math.PI - t);
  const x = A * Math.sign(s) * Math.abs(s) ** 0.9 * (c < 0 ? 1 + 0.2 * c : 1);
  const y = -B * Math.sign(c) * Math.abs(c) ** 0.92 + B * 0.2 * Math.exp(-((d / 0.32) ** 2)) - B * 0.07 * Math.exp(-(((t - Math.PI) / 0.3) ** 2));
  return [cx + x, cy + y];
});
const mordida = (pts, cx, cy, A, B) => {                                              // tira uma mordida redonda do lado direito
  const bx = cx + A * 0.98, by = cy - B * 0.05, rb = A * 0.42, fora = pts.map(q => Math.hypot(q[0] - bx, q[1] - by) >= rb);
  const ini = fora.findIndex((v, i) => v && !fora[(i + 1) % pts.length]), n = pts.length;
  let fim = (ini + 1) % n; while (!fora[fim]) fim = (fim + 1) % n;
  const a0 = Math.atan2(pts[ini][1] - by, pts[ini][0] - bx), a1 = Math.atan2(pts[fim][1] - by, pts[fim][0] - bx);
  const arco = [0, 1, 2, 3, 4, 5, 6].map(k => { const a = a0 + (((a1 - a0 + 3 * Math.PI) % (2 * Math.PI)) - Math.PI) * k / 6; return [bx + rb * Math.cos(a), by + rb * Math.sin(a)]; });
  arco[0] = [...arco[0], 1]; arco[6] = [...arco[6], 1];
  const mantem = []; for (let k = fim; k !== ini; k = (k + 1) % n) mantem.push(pts[k]);
  return [...mantem, pts[ini], ...arco];
};
const folhaMaca = (x, y, e, d = 1) => [D(`M${x} ${y} C${x + 8 * d * e} ${y - 26 * e} ${x + 40 * d * e} ${y - 40 * e} ${x + 66 * d * e} ${y - 30 * e} C${x + 58 * d * e} ${y - 2 * e} ${x + 26 * d * e} ${y + 6 * e} ${x} ${y} Z`, W), solto(`M${x + 4 * d * e} ${y - 2 * e} Q${x + 30 * d * e} ${y - 20 * e} ${x + 58 * d * e} ${y - 28 * e}`, 2.5)];
const cabo = (x, y, e) => D(`M${x - 5 * e} ${y} C${x - 7 * e} ${y - 16 * e} ${x - 4 * e} ${y - 30 * e} ${x + 8 * e} ${y - 40 * e} L${x + 14 * e} ${y - 34 * e} C${x + 6 * e} ${y - 26 * e} ${x + 6 * e} ${y - 14 * e} ${x + 6 * e} ${y} Z`);
const macaInteira = (cx, cy, A, B, e, tipo) => [
  cabo(cx, cy - B * 0.72, e),
  tipo === 'mordida' ? S(mordida(pontosMaca(cx, cy, A, B), cx, cy, A, B)) : S(pontosMaca(cx, cy, A, B)),
  ...folhaMaca(cx + 6 * e, cy - B * 0.72 - 6 * e, e * 0.6),
  D(`M${cx - A * 0.62} ${cy - B * 0.3} C${cx - A * 0.66} ${cy - B * 0.55} ${cx - A * 0.5} ${cy - B * 0.7} ${cx - A * 0.32} ${cy - B * 0.74} C${cx - A * 0.4} ${cy - B * 0.55} ${cx - A * 0.46} ${cy - B * 0.4} ${cx - A * 0.62} ${cy - B * 0.3} Z`, W, 2.5)
];
const maca = svg(
  ...sol(252, 44), nuvem(14, 56, 0.9),
  D('M0 300 L0 246 C80 232 220 232 300 246 L300 300 Z'),
  ...macaInteira(150, 168, 78, 70, 1.6),
  ...macaInteira(50, 262, 38, 34, 0.9, 'mordida'), ...macaInteira(252, 262, 38, 34, 0.9),
  p.flor({ x: 108, y: 290, e: 1.1 }), p.flor({ x: 196, y: 288 })
);

// ---- Pato ----
const onda = (y, amp, per) => { let d = `M0 ${y}`; for (let x = 0; x < 300; x += per) d += ` Q${x + per / 4} ${y - amp} ${x + per / 2} ${y} T${x + per} ${y}`; return d + ' L300 300 L0 300 Z'; };
const junco = (x, h) => [D(`M${x - 3} 292 L${x - 2} ${292 - h} L${x + 2} ${292 - h} L${x + 3} 292 Z`, W, 2.5), D(`M${x} ${292 - h - 20} C${x + 10} ${292 - h - 8} ${x + 9} ${292 - h + 10} ${x} ${292 - h + 12} C${x - 9} ${292 - h + 10} ${x - 10} ${292 - h - 8} ${x} ${292 - h - 20} Z`, W, 2.5)];
const pato = svg(
  ...sol(252, 44), nuvem(20, 50, 0.9),
  D(onda(216, 8, 100), 'white'),
  D('M40 150 C64 160 100 176 140 174 C170 172 186 156 190 130 C192 100 206 72 236 70 C262 68 272 90 266 108 C262 126 248 134 240 146 C232 160 250 180 244 204 C236 232 196 246 148 246 C100 246 62 224 52 192 C48 176 46 160 40 150 Z'),
  D('M82 184 C108 166 156 174 180 206 C152 226 102 222 82 184 Z', W), solto('M104 184 C126 180 146 188 158 202', 2.5), solto('M100 194 C118 192 134 198 144 208', 2.5),
  D('M260 94 C274 90 290 98 298 106 C292 116 274 120 260 116 Z', W), solto('M266 106 Q282 108 292 106', 2.5),
  CIRC(231, 91, 8, W, 2.5), olho(233, 92, 4),
  D(onda(244, 8, 60), W),
  solto('M70 276 Q86 268 102 276', 2.5), solto('M190 278 Q208 270 226 278', 2.5),
  ...junco(30, 74), ...junco(270, 58),
  p.flor({ x: 140, y: 288, e: 1.1 })
);

// ---- Trem ----
const roda = (x, y, r) => [CIRC(x, y, r, W, 3), CIRC(x, y, r * 0.36, W, 2.5), solto(`M${x - r * 0.68} ${y} L${x + r * 0.68} ${y} M${x} ${y - r * 0.68} L${x} ${y + r * 0.68}`, 2)];
const trem = svg(
  ...sol(48, 46),
  copa(214, 82, 16, 13, 7, 0, 2.5), copa(186, 56, 21, 16, 8, 10, 2.5), copa(148, 36, 27, 19, 9, 0, 2.5),
  colina(286, 8),
  RECT(0, 268, 300, 14, 6, W),
  solto('M24 282 L24 288 M80 282 L80 288 M136 282 L136 288 M192 282 L192 288 M248 282 L248 288', 3),
  RP([[216, 116], [244, 116], [240, 160], [220, 160]], 4, W),
  D('M168 160 C168 128 204 128 204 160 Z', W),
  RECT(120, 156, 152, 86, 20),
  RECT(128, 192, 138, 14, 6, W, 2.5),
  RP([[206, 100], [254, 100], [248, 122], [212, 122]], 7, W),
  CIRC(262, 178, 9, W, 2.5),
  RP([[266, 246], [292, 270], [262, 270]], 6, W),
  RECT(52, 124, 86, 122, 8),
  RECT(66, 146, 56, 46, 10, W, 2.5),
  RECT(40, 102, 108, 26, 9, W),
  RECT(54, 238, 222, 14, 6, W),
  ...roda(96, 250, 24), ...roda(148, 250, 24), ...roda(214, 258, 16), ...roda(256, 258, 16),
  solto('M96 252 L148 252', 4),
  p.flor({ x: 20, y: 292, e: 0.9 }), p.tufo({ x: 284 })
);

module.exports = [
  { id: 'colorir-31', svg: tartaruga }, { id: 'colorir-32', svg: girassol }, { id: 'colorir-33', svg: maca },
  { id: 'colorir-34', svg: pato }, { id: 'colorir-35', svg: trem }
];

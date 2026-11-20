// Lote 6 de desenhos (20/11), repaginado no estilo do lote 7: curvas Bézier, retas arredondadas, formas paramétricas.
// Robô, dinossauro, lua com estrelas, pinguim, abelha.
// Rodar: node build/colorir.js build/pedidos/colorir-lote6.js [--gravar]
const { f, solto, olho, svg, nuvem, colina, polar, espelhar, suave } = require('../desenho.js');
const p = require('../pecas/index.js');
const { estrela, ov } = require('./_curvas.js');

const W = 'white', r1 = v => +v.toFixed(1), pt = q => q.map(r1).join(' ');
const D = (d, fundo, sw) => f('path', `d="${d}"`, fundo, sw);                       // caminho com curvas à mão
const S = (pts, fundo, sw) => D(suave(pts), fundo, sw);                              // curva livre por pontos
const RECT = (x, y, w, h, rx, fundo, sw) => f('rect', `x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}"`, fundo, sw);
const CIRC = (x, y, r, fundo, sw) => f('circle', `cx="${x}" cy="${y}" r="${r}"`, fundo, sw);
const sol = (x, y) => [CIRC(x, y, 22), p.raiosSol({ x, y, e: 0.24 })];

// ---- Robô: cabeça e corpo de caixa macia, tela com botões, braços e pés curvos ----
const robo = svg(
  estrela(40, 56, 18, 8), estrela(264, 50, 22, 10, -76), estrela(30, 150, 12, 5), estrela(272, 112, 13, 6),
  colina(286, 8),
  espelhar(D('M104 258 L134 258 L134 272 C148 274 154 284 146 289 L98 289 C90 284 92 274 104 272 Z')),
  espelhar(D('M82 176 C60 176 46 194 46 218 L46 236 C46 250 68 250 68 236 L68 222 C68 212 74 206 84 204 Z'), CIRC(56, 250, 13, W)),
  RECT(80, 158, 140, 104, 28),
  RECT(94, 172, 112, 66, 16, W),
  CIRC(120, 206, 10), estrela(150, 206, 13, 6), CIRC(180, 206, 10),
  RECT(134, 144, 32, 20, 6, W),
  espelhar(RECT(66, 88, 16, 36, 8)),
  RECT(78, 60, 144, 88, 34),
  RECT(92, 74, 116, 60, 22, W),
  espelhar(RECT(112, 90, 28, 26, 12, W), olho(126, 103, 6)),
  solto('M126 124 Q150 135 174 124', 2.5),
  solto('M150 62 C146 50 156 42 150 32', 3), CIRC(150, 22, 11),
  p.tufo({ x: 40 }), p.tufo({ x: 262 })
);

// ---- Dinossauro: cauda, corpo, pescoço com cabeça e pernas em curvas, placas e pintas ----
const placa = (x, y, g = 0) => f('path', `d="M${x - 14} ${y + 14} C${x - 12} ${y - 6} ${x - 4} ${y - 20} ${x} ${y - 30} C${x + 4} ${y - 20} ${x + 12} ${y - 6} ${x + 14} ${y + 14} Z" transform="rotate(${g} ${x} ${y + 10})"`);
const perna = x => D(`M${x} 216 L${x + 40} 216 C${x + 40} 238 ${x + 36} 254 ${x + 36} 270 C${x + 48} 272 ${x + 50} 284 ${x + 38} 284 L${x - 6} 284 C${x - 12} 278 ${x - 4} 272 ${x + 4} 270 C${x + 4} 254 ${x} 238 ${x} 216 Z`);
const dino = svg(
  ...sol(58, 46), nuvem(168, 44, 0.9),
  colina(290, 8),
  perna(132), perna(168), perna(98), perna(194),
  D('M12 146 C32 174 62 190 106 184 L112 232 C80 238 44 224 28 202 C20 188 14 168 12 146 Z'),
  D('M196 178 C214 140 216 100 226 70 C232 50 252 42 274 46 C292 50 300 70 292 88 C286 102 266 108 256 114 C246 122 250 150 256 190 C258 208 246 214 236 212 Z'),
  placa(104, 164, -20), placa(134, 148, -8), placa(168, 144, 0), placa(200, 152, 12),
  D('M88 200 C84 168 112 146 152 144 C196 142 232 162 238 200 C242 224 222 240 168 240 C122 240 92 232 88 200 Z'),
  ov(116, 178, 10, 8, 10, 2.5, W), ov(152, 168, 8, 7, 40, 2.5, W), ov(186, 174, 11, 8, -15, 2.5, W),
  ov(130, 198, 7, 6, 20, 2.5, W), ov(170, 208, 9, 7, -30, 2.5, W), ov(206, 196, 8, 6, 35, 2.5, W),
  ov(262, 77, 8, 7, 0, 2.5, W), olho(264, 78, 4), olho(285, 70, 2.5), solto('M258 98 Q276 101 288 90', 2.5),
  D('M20 286 C14 266 26 246 44 244 C62 246 74 266 68 286 Z'), solto('M32 266 Q42 258 50 268', 2.5),
  p.flor({ x: 268, y: 286 }), p.tufo({ x: 100 })
);

// ---- Lua com estrelas: lua gorda de arcos, estrelas arredondadas, colinas e pinheiros ----
const C1 = [124, 138, 90], C2 = [178, 112, 72];
const dd = Math.hypot(C2[0] - C1[0], C2[1] - C1[1]), aa = (C1[2] ** 2 - C2[2] ** 2 + dd * dd) / (2 * dd), hh = Math.sqrt(C1[2] ** 2 - aa * aa);
const ux = (C2[0] - C1[0]) / dd, uy = (C2[1] - C1[1]) / dd, Px = C1[0] + aa * ux, Py = C1[1] + aa * uy;
const topo1 = [Px + hh * uy, Py - hh * ux], base1 = [Px - hh * uy, Py + hh * ux];
const luaCres = D(`M${pt(topo1)} A${C1[2]} ${C1[2]} 0 1 0 ${pt(base1)} A${C2[2]} ${C2[2]} 0 0 1 ${pt(topo1)} Z`);
const andar = (cx, y0, w, h, e) => D(`M${pt([cx, y0])} C${pt([cx + w * 0.1 * e, y0 + h * 0.3 * e])} ${pt([cx + w * 0.35 * e, y0 + h * 0.65 * e])} ${pt([cx + w * 0.5 * e, y0 + h * e])} ` +
  `C${pt([cx + w * 0.2 * e, y0 + h * 0.9 * e])} ${pt([cx - w * 0.2 * e, y0 + h * 0.9 * e])} ${pt([cx - w * 0.5 * e, y0 + h * e])} ` +
  `C${pt([cx - w * 0.35 * e, y0 + h * 0.65 * e])} ${pt([cx - w * 0.1 * e, y0 + h * 0.3 * e])} ${pt([cx, y0])} Z`);
const pinheiro = (cx, topo, e) => [
  RECT(r1(cx - 5 * e), r1(topo + 116 * e), r1(10 * e), r1(24 * e), r1(2 * e)),
  ...[[56, 72, 60], [26, 56, 52], [0, 40, 46]].map(([dy, w, h]) => andar(cx, topo + dy * e, w, h, e))
];
const lua = svg(
  luaCres,
  solto('M54 116 Q64 126 76 116', 2.5), solto('M58 152 Q70 162 84 150', 2.5), ov(50, 136, 6, 5, 20, 2.5, W),
  estrela(170, 108, 14, 6, -80), estrela(150, 164, 9, 4), estrela(250, 58, 26, 12), estrela(280, 118, 14, 6, -70), estrela(38, 50, 14, 6),
  D('M0 300 L0 252 C30 236 80 232 124 244 C160 254 200 264 250 246 C272 240 288 242 300 250 L300 300 Z'),
  ...pinheiro(258, 124, 0.72), ...pinheiro(22, 168, 0.4),
  D('M0 300 L0 280 C50 262 110 272 160 280 C210 288 260 270 300 282 L300 300 Z'),
  p.flor({ x: 108, y: 288 }), p.tufo({ x: 204 })
);

// ---- Pinguim: corpo de pera, rosto em coração, olhos ovais, cachecol ondulado, pés de três dedos ----
const pinguim = svg(
  nuvem(18, 40, 0.8), estrela(110, 44, 14, 6), estrela(264, 70, 18, 8, -78), estrela(36, 140, 9, 4), estrela(270, 150, 10, 4),
  colina(272, 12),
  espelhar(D('M160 270 L196 268 C206 270 214 276 212 284 C206 286 202 282 198 280 C196 286 190 290 184 286 C180 284 178 282 176 282 C172 288 164 288 160 284 Z')),
  espelhar(D('M198 142 C226 148 248 176 256 214 C258 226 256 232 252 230 C236 228 220 206 208 184 Z')),
  D('M150 46 C184 46 204 74 204 112 C204 150 226 180 224 214 C222 250 196 276 150 276 C104 276 78 250 76 214 C74 180 96 150 96 112 C96 74 116 46 150 46 Z'),
  D('M150 164 C182 164 198 196 196 226 C194 252 176 266 150 266 C124 266 106 252 104 226 C102 196 118 164 150 164 Z', W),
  D('M150 102 C140 74 104 80 104 110 C104 128 128 142 150 146 C172 142 196 128 196 110 C196 80 160 74 150 102 Z', W),
  espelhar(ov(177, 103, 13, 9, -8, 2.5, W), olho(179, 103, 5)),
  D('M150 110 C158 112 166 118 166 122 C160 132 154 136 150 137 C146 136 140 132 134 122 C134 118 142 112 150 110 Z'),
  D('M88 152 C112 164 130 166 150 166 C170 166 188 164 212 152 C220 160 220 176 214 182 C190 192 170 192 150 192 C130 192 110 192 86 182 C80 176 80 160 88 152 Z'),
  D('M174 186 C186 190 196 192 202 196 C206 214 204 232 198 244 C190 248 182 240 178 228 C174 214 172 198 174 186 Z'),
  p.flor({ x: 50, y: 286 }), p.flor({ x: 256, y: 288 })
);

// ---- Abelha: corpo em gota com listras que acompanham a curva, asas de folha, cabeça e antenas ----
const T = [0.08, 0.18, 0.3, 0.42, 0.54, 0.66, 0.78, 0.88, 0.96];
const X0 = 46, X1 = 216, xAt = t => X0 + (X1 - X0) * t, yc = t => 182 - 10 * t;
const meia = t => 60 * Math.sin(Math.PI * Math.pow(t, 0.75)) ** 0.8;
const topo = t => [xAt(t), yc(t) - meia(t)], base = t => [xAt(t), yc(t) + meia(t) * 0.92];
const corpoAbelha = S([[...topo(0), 1], ...T.map(topo), ...[...T].reverse().map(base)]);
const faixaAbelha = (a, b) => {
  const ts = [a, a + (b - a) / 3, a + 2 * (b - a) / 3, b];
  return S([[...topo(a), 1], topo(ts[1]), topo(ts[2]), [...topo(b), 1], [xAt(b) + 10, yc(b)], [...base(b), 1], base(ts[2]), base(ts[1]), [...base(a), 1], [xAt(a) + 10, yc(a)]]);
};
const abelha = svg(
  ...sol(254, 40), nuvem(18, 50, 0.9),
  colina(282, 10),
  solto('M10 126 C28 106 50 106 62 126 C74 146 92 146 100 126', 2.5),
  D('M100 130 C74 108 66 70 84 48 C104 28 132 46 138 82 C142 106 126 124 104 130 Z', W, 3), solto('M104 124 C90 96 92 66 104 54', 2),
  D('M150 126 C146 92 160 58 190 46 C214 40 222 62 212 92 C204 114 186 126 162 128 Z', W, 3), solto('M162 118 C166 88 180 66 198 54', 2),
  corpoAbelha, faixaAbelha(0.2, 0.34), faixaAbelha(0.46, 0.6),
  solto('M98 228 C96 240 92 248 84 254', 3.5), solto('M132 232 C132 244 128 254 122 260', 3.5), solto('M162 230 C166 242 166 252 160 258', 3.5),
  D('M204 142 C204 120 226 110 250 114 C274 118 286 138 282 162 C278 188 258 198 232 194 C210 190 204 166 204 142 Z'),
  solto('M236 114 C236 100 244 92 252 86', 3), CIRC(254, 80, 8, W),
  solto('M258 120 C266 108 274 106 282 108', 3), CIRC(285, 106, 7, W),
  ov(238, 146, 11, 14, 0, 2.5, W), olho(240, 147, 6), solto('M238 112 Q242 100 252 100 M250 111 Q256 100 266 104', 2.5),
  solto('M232 178 C244 188 258 188 270 176', 2.5),
  p.flor({ x: 46, y: 284, e: 1.4 }), p.flor({ x: 250, y: 286 })
);

module.exports = [
  { id: 'colorir-26', svg: robo }, { id: 'colorir-27', svg: dino }, { id: 'colorir-28', svg: lua },
  { id: 'colorir-29', svg: pinguim }, { id: 'colorir-30', svg: abelha }
];

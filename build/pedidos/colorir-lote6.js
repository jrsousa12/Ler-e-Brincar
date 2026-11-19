// Lote 6 de desenhos (19/11): robô, dinossauro, lua com estrelas, pinguim, abelha. Rodar: node build/colorir.js build/pedidos/colorir-lote6.js [--gravar]
const { f, solto, olho, svg, nuvem, colina, copa, polar, espelhar } = require('../desenho.js');
const p = require('../pecas/index.js');

const sol = (x, y) => [f('circle', `cx="${x}" cy="${y}" r="22"`), p.raiosSol({ x, y, e: 0.24 })];

// ---- Robô: cabeça, corpo e membros de cantos redondos, painel com botões ----
const robo = svg(
  p.estrela({ x: 40, y: 56, R: 18, r: 8 }), p.estrela({ x: 262, y: 50, R: 22, r: 10 }), p.estrela({ x: 32, y: 150, R: 12, r: 5 }), p.estrela({ x: 270, y: 120, R: 13, r: 6 }),
  colina(284, 10),
  espelhar(f('rect', 'x="172" y="244" width="26" height="30" rx="8"'), f('rect', 'x="162" y="264" width="46" height="16" rx="8"')),
  espelhar(f('path', 'd="M218 174 Q258 182 262 222 L244 226 Q240 200 218 194 Z"'), f('circle', 'cx="254" cy="238" r="16"')),
  f('rect', 'x="80" y="160" width="140" height="92" rx="22"'),
  f('rect', 'x="106" y="178" width="88" height="50" rx="10"', 'white', 2.5),
  f('circle', 'cx="126" cy="203" r="9"', 'white', 2.5), f('circle', 'cx="150" cy="203" r="9"', 'white', 2.5), f('circle', 'cx="174" cy="203" r="9"', 'white', 2.5),
  solto('M116 188 L138 188 M162 188 L184 188', 2.5),
  f('rect', 'x="134" y="140" width="32" height="24" rx="6"'),
  espelhar(f('rect', 'x="210" y="88" width="18" height="36" rx="8"')),
  f('rect', 'x="86" y="62" width="128" height="84" rx="28"'),
  espelhar(f('circle', 'cx="184" cy="98" r="18"', 'white', 2.5), olho(184, 100, 7)),
  f('rect', 'x="116" y="120" width="68" height="16" rx="8"', 'white', 2.5), solto('M133 120 L133 136 M150 120 L150 136 M167 120 L167 136', 2),
  solto('M150 62 L150 38', 3), f('circle', 'cx="150" cy="30" r="10"'),
  p.tufo({ x: 40 }), p.tufo({ x: 262 })
);

// ---- Dinossauro: rabo, placas nas costas, pescoço e cabeça sorridente, ovo ----
const placa = (x, y) => f('path', `d="M${x - 16} ${y + 12} Q${x} ${y - 38} ${x + 16} ${y + 12} Z"`);
const dino = svg(
  ...sol(60, 46), nuvem(176, 44, 0.9),
  colina(278, 12),
  f('rect', 'x="98" y="226" width="30" height="42" rx="13"'), f('ellipse', 'cx="113" cy="270" rx="24" ry="11"'),
  f('rect', 'x="176" y="226" width="30" height="42" rx="13"'), f('ellipse', 'cx="191" cy="270" rx="24" ry="11"'),
  placa(108, 142), placa(136, 134), placa(164, 134), placa(192, 142),
  f('path', 'd="M86 166 Q40 176 12 148 Q30 216 90 226 Z"'),
  f('ellipse', 'cx="150" cy="190" rx="82" ry="56"'), f('ellipse', 'cx="150" cy="214" rx="54" ry="28"', 'white', 2.5),
  f('path', 'd="M190 168 Q224 142 220 104 L254 104 Q260 160 230 204 Z"'),
  f('ellipse', 'cx="242" cy="92" rx="42" ry="30"'),
  f('circle', 'cx="250" cy="84" r="10"', 'white', 2.5), olho(253, 85, 5), olho(280, 84, 2.5), solto('M244 104 Q264 116 282 100', 2.5),
  f('path', 'd="M210 190 Q232 190 238 206 Q222 210 208 204 Z"', 'white', 2.5),
  f('circle', 'cx="112" cy="168" r="8"', 'white', 2.5), f('circle', 'cx="146" cy="160" r="6"', 'white', 2.5), f('circle', 'cx="178" cy="170" r="9"', 'white', 2.5),
  f('ellipse', 'cx="36" cy="262" rx="22" ry="26"'), solto('M16 258 L26 250 L34 260 L44 250 L56 258', 2.5),
  p.flor({ x: 262, y: 284 }), p.tufo({ x: 70 })
);

// ---- Lua com estrelas: lua dorminhoca, estrelas de vários tamanhos, nuvem e colinas ----
const lua = svg(
  p.luaCrescente({ x: 120, y: 120, e: 1.5 }),
  p.estrela({ x: 176, y: 110, R: 14, r: 6 }), p.estrela({ x: 150, y: 168, R: 9, r: 4 }),
  p.estrela({ x: 240, y: 56, R: 26, r: 12 }), p.estrela({ x: 272, y: 128, R: 16, r: 7 }), p.estrela({ x: 214, y: 150, R: 12, r: 5 }),
  p.estrela({ x: 36, y: 56, R: 14, r: 6 }), p.estrela({ x: 42, y: 232, R: 15, r: 7 }), p.estrela({ x: 270, y: 186, R: 20, r: 9 }),
  nuvem(176, 210, 1.1),
  colina(266, 24), colina(284, 12),
  p.flor({ x: 70, y: 284 }), p.tufo({ x: 150 })
);

// ---- Pinguim: corpo em ovo, rosto em coração, cachecol, asas e pés ----
const pinguim = svg(
  p.estrela({ x: 110, y: 44, R: 14, r: 6 }), p.estrela({ x: 262, y: 70, R: 18, r: 8 }), p.estrela({ x: 36, y: 140, R: 9, r: 4 }), p.estrela({ x: 268, y: 150, R: 10, r: 4 }),
  nuvem(18, 40, 0.8),
  colina(272, 14),
  espelhar(f('ellipse', 'cx="178" cy="274" rx="28" ry="12"')),
  espelhar(f('path', 'd="M214 148 Q260 170 256 226 Q228 214 204 186 Z"')),
  f('ellipse', 'cx="150" cy="160" rx="76" ry="112"'), f('ellipse', 'cx="150" cy="208" rx="50" ry="62"', 'white', 2.5),
  f('path', 'd="M150 100 Q118 62 106 96 Q98 130 150 140 Q202 130 194 96 Q182 62 150 100 Z"', 'white', 2.5),
  espelhar(f('circle', 'cx="172" cy="98" r="12"', 'white', 2.5), olho(174, 100, 5)),
  f('path', 'd="M134 112 Q150 102 166 112 Q150 134 134 112 Z"'),
  f('path', 'd="M88 152 Q150 178 212 152 L216 174 Q150 200 84 174 Z"'), f('path', 'd="M174 180 L194 234 L170 240 L158 186 Z"'),
  p.flor({ x: 50, y: 286 }), p.flor({ x: 256, y: 288 })
);

// ---- Abelha: corpo listrado de lado, asas, antenas e rastro de voo ----
const faixaAbelha = (x1, x2) => {
  const y = x => +(176 - 54 * Math.sqrt(1 - ((x - 130) / 78) ** 2)).toFixed(1), y2 = x => +(352 - y(x)).toFixed(1);
  return f('path', `d="M${x1} ${y(x1)} Q${x1 + 12} 176 ${x1} ${y2(x1)} A78 54 0 0 0 ${x2} ${y2(x2)} Q${x2 + 12} 176 ${x2} ${y(x2)} A78 54 0 0 0 ${x1} ${y(x1)} Z"`);
};
const abelha = svg(
  ...sol(254, 40), nuvem(18, 50, 0.9),
  colina(280, 12),
  solto('M14 120 Q34 98 54 120 Q74 142 94 120', 2.5),
  f('path', 'd="M60 164 L22 184 L60 198 Z"'),
  f('ellipse', 'cx="112" cy="104" rx="24" ry="46" transform="rotate(-25 112 104)"', 'white', 3), f('ellipse', 'cx="158" cy="98" rx="22" ry="42" transform="rotate(20 158 98)"', 'white', 3),
  f('ellipse', 'cx="130" cy="176" rx="78" ry="54"'), faixaAbelha(96, 120), faixaAbelha(140, 164),
  f('circle', 'cx="222" cy="152" r="36"'),
  solto('M222 118 Q216 86 196 76', 3), f('circle', 'cx="194" cy="74" r="6"', 'white', 2.5), solto('M238 122 Q256 92 276 92', 3), f('circle', 'cx="278" cy="92" r="6"', 'white', 2.5),
  f('circle', 'cx="232" cy="146" r="12"', 'white', 2.5), olho(234, 147, 5), f('ellipse', 'cx="244" cy="168" rx="9" ry="6"', 'white', 2.5),
  solto('M212 166 Q226 180 242 170', 2.5),
  p.flor({ x: 56, y: 276, e: 1.5 }), p.flor({ x: 240, y: 286 })
);

module.exports = [
  { id: 'colorir-26', svg: robo }, { id: 'colorir-27', svg: dino }, { id: 'colorir-28', svg: lua },
  { id: 'colorir-29', svg: pinguim }, { id: 'colorir-30', svg: abelha }
];

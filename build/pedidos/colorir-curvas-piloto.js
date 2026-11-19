// Piloto "desenhos mais curvos e harmoniosos": refaz colorir-01 (Gato), 05 (Sol), 07 (Árvore), 10 (Borboleta), 19 (Castelo).
// Rodar: node build/pedidos/colorir-curvas-piloto.js   (troca só o svg de cada item, pelo motor build/item.js)
const { f, solto, olho, espelhar, polar, nuvem, colina, svg } = require('../desenho.js');
const novos = {};
const flor = (x, y) => [[0, -8], [8, 0], [0, 8], [-8, 0]].map(([dx, dy]) => f('circle', `cx="${x + dx}" cy="${y + dy}" r="6"`, 'white', 2)).join('') + f('circle', `cx="${x}" cy="${y}" r="5"`, 'white', 2);

novos['colorir-07'] = svg(
  colina(272),
  f('path', 'd="M132 280 C140 255 142 225 138 188 L162 188 C158 225 160 255 168 280 Z"'),
  solto('M148 215 C146 235 147 250 146 266 M156 225 C158 240 158 252 160 268', 2),
  f('path', 'd="M150 28 C186 12 228 30 226 62 C258 68 268 108 242 128 C258 160 228 192 196 180 C186 200 114 200 104 180 C72 192 42 160 58 128 C32 108 42 68 74 62 C72 30 114 12 150 28 Z"'),
  f('path', 'd="M100 92 C96 72 122 64 130 82 C138 100 108 112 100 92 Z"', 'white', 2.5),
  f('path', 'd="M168 70 C176 52 204 58 200 80 C196 100 164 92 168 70 Z"', 'white', 2.5),
  f('path', 'd="M72 140 C66 122 92 116 100 132 C106 148 78 158 72 140 Z"', 'white', 2.5),
  f('path', 'd="M196 124 C192 108 220 104 226 122 C230 140 202 144 196 124 Z"', 'white', 2.5),
  f('path', 'd="M122 142 C118 124 146 120 152 138 C158 156 128 162 122 142 Z"', 'white', 2.5),
  f('circle', 'cx="118" cy="98" r="9"', 'white', 2.5), f('circle', 'cx="186" cy="76" r="9"', 'white', 2.5),
  f('circle', 'cx="214" cy="132" r="9"', 'white', 2.5), f('circle', 'cx="150" cy="168" r="9"', 'white', 2.5),
  flor(62, 258), flor(238, 262)
);

novos['colorir-19'] = svg(
  nuvem(18, 48), nuvem(206, 40, 0.9),
  f('path', 'd="M0 300 L0 270 Q75 250 150 272 Q225 250 300 270 L300 300 Z"'),
  f('rect', 'x="62" y="180" width="176" height="94" rx="8"'),
  f('rect', 'x="34" y="125" width="58" height="150" rx="10"'),
  f('path', 'd="M26 128 Q58 104 63 60 Q68 104 100 128 Q63 118 26 128 Z"'),
  f('rect', 'x="208" y="125" width="58" height="150" rx="10"'),
  f('path', 'd="M200 128 Q232 104 237 60 Q242 104 274 128 Q237 118 200 128 Z"'),
  f('rect', 'x="104" y="112" width="92" height="162" rx="10"'),
  f('path', 'd="M94 116 Q140 92 150 34 Q160 92 206 116 Q150 104 94 116 Z"'),
  solto('M150 34 L150 12', 3), f('path', 'd="M150 12 Q172 4 190 14 Q172 24 150 22 Z"', 'white', 2.5),
  f('path', 'd="M130 274 L130 240 Q130 214 150 214 Q170 214 170 240 L170 274 Z"'),
  f('circle', 'cx="162" cy="246" r="3.5"', 'black', 1),
  f('path', 'd="M136 168 L136 156 Q136 142 150 142 Q164 142 164 156 L164 168 Z"'),
  f('path', 'd="M52 192 L52 184 Q52 172 63 172 Q74 172 74 184 L74 192 Z"'),
  f('path', 'd="M226 192 L226 184 Q226 172 237 172 Q248 172 248 184 L248 192 Z"'),
  solto('M110 196 L190 196', 2), solto('M104 130 Q150 138 196 130', 2),
  f('path', 'd="M20 288 Q34 268 48 288 Z"', 'white', 2.5), f('path', 'd="M252 288 Q266 268 280 288 Z"', 'white', 2.5)
);

novos['colorir-01'] = svg(
  f('path', 'd="M200 236 C252 244 278 206 264 166 C258 148 238 152 246 170 C256 196 240 214 200 218 Z"'),
  solto('M250 190 Q262 192 266 182 M246 210 Q258 214 266 204', 2),
  f('path', 'd="M96 150 C56 200 62 272 112 276 L188 276 C238 272 244 200 204 150 Z"'),
  f('ellipse', 'cx="150" cy="222" rx="36" ry="46"', 'white', 2.5),
  f('ellipse', 'cx="112" cy="276" rx="26" ry="12"'), f('ellipse', 'cx="188" cy="276" rx="26" ry="12"'),
  solto('M104 276 L104 268 M116 277 L116 269 M184 277 L184 269 M196 276 L196 268', 2),
  f('path', 'd="M98 88 Q84 46 96 24 Q128 34 142 64 Z"'), f('path', 'd="M202 88 Q216 46 204 24 Q172 34 158 64 Z"'),
  f('path', 'd="M106 76 Q100 52 105 42 Q121 48 128 62 Z"', 'white', 2.5), f('path', 'd="M194 76 Q200 52 195 42 Q179 48 172 62 Z"', 'white', 2.5),
  f('ellipse', 'cx="150" cy="112" rx="64" ry="54"'),
  solto('M150 60 L150 74 M136 63 L139 75 M164 63 L161 75', 2.5),
  f('path', 'd="M116 106 Q131 90 146 106 Q131 120 116 106 Z"', 'white', 2.5), f('path', 'd="M154 106 Q169 90 184 106 Q169 120 154 106 Z"', 'white', 2.5),
  olho(131, 106, 6), olho(169, 106, 6),
  f('path', 'd="M142 122 Q150 118 158 122 Q154 131 150 131 Q146 131 142 122 Z"', 'white', 2.5),
  solto('M150 131 L150 136 M150 136 Q143 145 134 139 M150 136 Q157 145 166 139', 2.5),
  solto('M110 124 L76 116 M110 130 L74 132 M190 124 L224 116 M190 130 L226 132', 2),
  f('path', 'd="M108 158 Q150 182 192 158 L194 172 Q150 198 106 172 Z"', 'white', 2.5),
  f('circle', 'cx="150" cy="192" r="9"', 'white', 2.5), solto('M144 192 L156 192', 2),
  f('circle', 'cx="244" cy="258" r="19"'), solto('M230 250 Q246 240 258 254 M228 262 Q246 252 262 266 M236 272 Q250 266 258 274', 2)
);

const sol = [];
for (let i = 0; i < 12; i++) {
  const a = i * 30 - 90, ponta = i % 2 ? 114 : 132, l = 13;
  const [bx1, by1] = polar(150, 150, 66, a - l), [bx2, by2] = polar(150, 150, 66, a + l);
  const [tx, ty] = polar(150, 150, ponta, a);
  const [c1x, c1y] = polar(150, 150, (66 + ponta) / 2 + 4, a - l * 0.9), [c2x, c2y] = polar(150, 150, (66 + ponta) / 2 + 4, a + l * 0.9);
  sol.push(f('path', `d="M${bx1} ${by1} Q${c1x} ${c1y} ${tx} ${ty} Q${c2x} ${c2y} ${bx2} ${by2} Z"`));
}
novos['colorir-05'] = svg(...sol,
  f('circle', 'cx="150" cy="150" r="64"'), f('circle', 'cx="150" cy="150" r="52"', 'white', 2),
  f('ellipse', 'cx="130" cy="138" rx="6" ry="9"', 'black', 1), f('ellipse', 'cx="170" cy="138" rx="6" ry="9"', 'black', 1),
  f('circle', 'cx="112" cy="162" r="9"', 'white', 2), f('circle', 'cx="188" cy="162" r="9"', 'white', 2),
  f('path', 'd="M128 164 Q150 196 172 164 Q150 172 128 164 Z"', 'white', 2.5),
  solto('M122 128 Q130 122 138 126 M162 126 Q170 122 178 128', 2)
);

const asaSup = f('path', 'd="M156 136 C170 70 230 20 272 48 C300 70 264 136 156 150 Z"');
const asaInf = f('path', 'd="M156 152 C222 150 272 176 258 222 C246 262 190 252 160 192 Z"');
novos['colorir-10'] = svg(
  espelhar(asaSup, asaInf,
    f('circle', 'cx="230" cy="84" r="24"', 'white', 2.5), f('circle', 'cx="230" cy="84" r="11"', 'white', 2.5),
    f('circle', 'cx="262" cy="56" r="6"', 'white', 2.5), f('circle', 'cx="196" cy="58" r="6"', 'white', 2.5), f('circle', 'cx="262" cy="112" r="6"', 'white', 2.5),
    f('circle', 'cx="214" cy="204" r="17"', 'white', 2.5), f('circle', 'cx="214" cy="204" r="7"', 'white', 2.5),
    f('circle', 'cx="244" cy="232" r="5"', 'white', 2.5), f('circle', 'cx="178" cy="234" r="5"', 'white', 2.5)),
  solto('M144 96 Q128 54 108 40 M156 96 Q172 54 192 40', 2.5),
  f('circle', 'cx="106" cy="38" r="6"', 'white', 2.5), f('circle', 'cx="194" cy="38" r="6"', 'white', 2.5),
  ...[132, 154, 176, 198, 218].map((y, i) => f('ellipse', `cx="150" cy="${y}" rx="${10 - i * 0.8}" ry="14"`)),
  f('circle', 'cx="150" cy="106" r="15"'), olho(144, 104, 2.4), olho(156, 104, 2.4), solto('M144 111 Q150 116 156 111', 2)
);

const { spawnSync } = require('child_process');
for (const [id, s] of Object.entries(novos)) {
  const r = spawnSync('node', [__dirname + '/../item.js', id, 'svg=' + s], { encoding: 'utf8' });
  console.log(id, (r.stdout + r.stderr).trim().split('\n').pop());
}

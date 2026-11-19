// Ajuste do piloto (pedido do dono, 19/11): gato com as quatro patas à vista; árvore refeita com copas em camadas,
// tronco com galhos, raízes e casca. Rodar: node build/colorir.js build/pedidos/colorir-curvas-ajuste.js [--gravar]
const { f, solto, olho, copa, svg } = require('../desenho.js');

// Gato sentado: patas de trás dobradas dos lados, patas da frente em pé no meio.
const gato = svg(
  f('path', 'd="M206 250 C258 252 282 212 268 170 C262 152 242 156 250 174 C260 202 244 226 204 232 Z"'),
  solto('M254 194 Q266 196 270 186 M250 216 Q262 220 270 210', 2),
  f('path', 'd="M96 150 C58 196 60 262 104 274 L196 274 C240 262 242 196 204 150 Z"'),
  f('path', 'd="M66 262 C56 226 76 198 104 204 C128 210 132 248 120 270 C108 282 76 282 66 262 Z"'),
  f('path', 'd="M234 262 C244 226 224 198 196 204 C172 210 168 248 180 270 C192 282 224 282 234 262 Z"'),
  f('path', 'd="M46 276 C44 264 62 260 80 266 C92 270 92 282 80 284 L56 284 C50 284 46 280 46 276 Z"'),
  f('path', 'd="M254 276 C256 264 238 260 220 266 C208 270 208 282 220 284 L244 284 C250 284 254 280 254 276 Z"'),
  solto('M58 276 L58 283 M68 274 L68 283 M242 276 L242 283 M232 274 L232 283', 2),
  f('path', 'd="M124 270 C121 246 121 222 125 202 L147 202 C147 226 147 248 147 270 Z"'),
  f('path', 'd="M176 270 C179 246 179 222 175 202 L153 202 C153 226 153 248 153 270 Z"'),
  f('path', 'd="M118 172 C118 200 124 212 130 218 L136 212 L143 222 L150 214 L157 222 L164 212 L170 218 C176 212 182 200 182 172 Z"', 'white', 2.5),
  f('ellipse', 'cx="133" cy="274" rx="17" ry="10"'), f('ellipse', 'cx="167" cy="274" rx="17" ry="10"'),
  solto('M128 276 L128 283 M138 276 L138 283 M162 276 L162 283 M172 276 L172 283', 2),
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
  f('circle', 'cx="150" cy="190" r="9"', 'white', 2.5), solto('M144 190 L156 190', 2)
);

// Árvore: tronco com dois galhos e raízes; copas de folhas em camadas (as de trás primeiro); maçãs com cabinho.
const maca = (x, y) => f('circle', `cx="${x}" cy="${y}" r="8.5"`, 'white', 2.5) + solto(`M${x} ${y - 8} Q${x + 1} ${y - 13} ${x + 4} ${y - 15}`, 2);
const tufo = x => solto(`M${x} 284 L${x - 4} 274 M${x + 4} 284 L${x + 4} 272 M${x + 8} 284 L${x + 12} 275`, 2);
const flor = (x, y) => [[0, -7], [7, 0], [0, 7], [-7, 0]].map(([dx, dy]) => f('circle', `cx="${x + dx}" cy="${y + dy}" r="5.5"`, 'white', 2)).join('') +
  f('circle', `cx="${x}" cy="${y}" r="4.5"`, 'white', 2);
const arvore = svg(
  f('path', 'd="M0 300 L0 280 Q75 266 150 278 Q225 266 300 280 L300 300 Z"'),
  f('path', 'd="M100 286 C118 280 128 270 132 248 C136 224 134 204 126 186 C116 170 100 160 86 154 L92 142 C108 150 122 158 136 170 ' +
    'C138 152 142 134 144 114 L156 114 C158 134 158 152 162 168 C174 154 190 144 206 136 L212 146 C196 156 180 168 172 186 ' +
    'C164 206 162 228 166 250 C170 270 182 280 200 286 C182 288 166 284 150 282 C134 284 118 288 100 286 Z"'),
  solto('M144 268 C142 248 144 228 142 208 M156 262 C158 244 156 226 158 204', 2),
  f('ellipse', 'cx="150" cy="232" rx="5" ry="8"', 'white', 2.5),
  copa(150, 86, 74, 52, 11, 10), copa(106, 66, 44, 34, 8, 20), copa(196, 64, 44, 34, 8, 0), copa(150, 46, 46, 30, 8, 15),
  copa(88, 124, 48, 34, 9, 5), copa(212, 120, 50, 34, 9, 15),
  maca(78, 120), maca(108, 142), maca(222, 132), maca(196, 110), maca(150, 110), maca(176, 52), maca(118, 60),
  tufo(28), tufo(76), tufo(218), tufo(262), flor(46, 270), flor(250, 268)
);

module.exports = [{ id: 'colorir-01', svg: gato }, { id: 'colorir-07', svg: arvore }];

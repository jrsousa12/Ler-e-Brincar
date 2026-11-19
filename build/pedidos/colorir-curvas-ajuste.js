// Ajuste do piloto (pedido do dono, 19/11): gato realista com as quatro patas à vista; árvore refeita com copas em camadas,
// tronco com galhos, raízes e casca. Rodar: node build/colorir.js build/pedidos/colorir-curvas-ajuste.js [--gravar]
const { f, solto, olho, copa, svg } = require('../desenho.js');

// Gato sentado de frente, mais realista: corpo em pera, coxas de trás por dentro do corpo, quatro patinhas do mesmo tamanho.
const gato = svg(
  f('path', 'd="M214 264 C250 266 274 250 270 224 C268 210 254 210 255 223 C257 238 244 248 216 249 Z"'),
  solto('M256 226 L269 228 M248 244 L258 254 M232 248 L236 262', 2),
  f('path', 'd="M112 156 C94 178 82 212 78 244 C76 264 88 278 106 278 L194 278 C212 278 224 264 222 244 C218 212 206 178 188 156 Z"'),
  f('path', 'd="M80 246 C82 224 94 210 110 210 C124 212 128 234 124 256 C121 270 112 278 102 278 C88 278 78 264 80 246 Z"'),
  f('path', 'd="M220 246 C218 224 206 210 190 210 C176 212 172 234 176 256 C179 270 188 278 198 278 C212 278 222 264 220 246 Z"'),
  f('ellipse', 'cx="100" cy="279" rx="17" ry="8.5"'), f('ellipse', 'cx="200" cy="279" rx="17" ry="8.5"'),
  solto('M95 281 L95 287 M105 281 L105 287 M195 281 L195 287 M205 281 L205 287', 2),
  f('path', 'd="M127 276 C125 250 125 224 129 200 L146 200 C146 226 146 252 146 276 Z"'),
  f('path', 'd="M173 276 C175 250 175 224 171 200 L154 200 C154 226 154 252 154 276 Z"'),
  f('path', 'd="M118 168 C118 196 124 210 130 216 L136 210 L143 220 L150 212 L157 220 L164 210 L170 216 C176 210 182 196 182 168 Z"', 'white', 2.5),
  f('ellipse', 'cx="136" cy="279" rx="16" ry="8.5"'), f('ellipse', 'cx="164" cy="279" rx="16" ry="8.5"'),
  solto('M131 281 L131 287 M141 281 L141 287 M159 281 L159 287 M169 281 L169 287', 2),
  f('path', 'd="M100 96 L88 28 Q124 34 144 62 Z"'), f('path', 'd="M200 96 L212 28 Q176 34 156 62 Z"'),
  f('path', 'd="M108 80 L99 46 Q120 48 132 64 Z"', 'white', 2.5), f('path', 'd="M192 80 L201 46 Q180 48 168 64 Z"', 'white', 2.5),
  f('path', 'd="M150 58 C182 58 204 76 210 102 L222 116 L208 118 L214 128 L200 130 C190 150 172 160 150 160 C128 160 110 150 100 130 L86 128 L92 118 L78 116 L90 102 C96 76 118 58 150 58 Z"'),
  solto('M150 62 L150 76 M136 65 L139 77 M164 65 L161 77', 2.5),
  f('path', 'd="M116 104 Q131 90 146 104 Q131 116 116 104 Z"', 'white', 2.5), f('path', 'd="M154 104 Q169 90 184 104 Q169 116 154 104 Z"', 'white', 2.5),
  f('ellipse', 'cx="131" cy="104" rx="3.5" ry="8"', 'black', 1), f('ellipse', 'cx="169" cy="104" rx="3.5" ry="8"', 'black', 1),
  f('path', 'd="M143 120 Q150 117 157 120 Q154 128 150 128 Q146 128 143 120 Z"', 'white', 2.5),
  solto('M150 128 L150 133 M150 133 Q144 141 136 136 M150 133 Q156 141 164 136', 2.5),
  solto('M112 122 L72 114 M112 128 L70 130 M188 122 L228 114 M188 128 L230 130', 2),
  f('path', 'd="M110 154 Q150 176 190 154 L192 168 Q150 192 108 168 Z"', 'white', 2.5),
  f('circle', 'cx="150" cy="186" r="9"', 'white', 2.5), solto('M144 186 L156 186', 2)
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
  copa(150, 88, 76, 54, 14, 10, 3, 0.1), copa(104, 66, 46, 34, 10, 20, 3, 0.12), copa(198, 62, 44, 34, 10, 0, 3, 0.12),
  copa(150, 44, 46, 30, 10, 15, 3, 0.12), copa(88, 124, 50, 34, 11, 5, 3, 0.12), copa(212, 120, 50, 36, 11, 15, 3, 0.12),
  maca(78, 120), maca(108, 142), maca(222, 132), maca(196, 110), maca(150, 110), maca(176, 52), maca(118, 60),
  tufo(28), tufo(76), tufo(218), tufo(262), flor(46, 270), flor(250, 268)
);

module.exports = [{ id: 'colorir-01', svg: gato }, { id: 'colorir-07', svg: arvore }];

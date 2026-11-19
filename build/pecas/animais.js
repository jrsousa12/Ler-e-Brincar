// Peças de animais, tiradas dos desenhos aprovados (gato colorir-01, borboleta colorir-10). Lado único: usar espelho para o outro.
'use strict';
const { f, solto, olho } = require('../desenho.js');
const tema = 'animais';

module.exports = [
  // Gato sentado de frente (colorir-01, aprovado 19/11)
  { nome: 'orelhaGato', descricao: 'orelha de gato pontuda com a parte de dentro (esquerda; espelho em x=184 para a direita)', ancora: [116, 62],
    desenho: () => f('path', 'd="M100 96 L88 28 Q124 34 144 62 Z"') + f('path', 'd="M108 80 L99 46 Q120 48 132 64 Z"', 'white', 2.5) },
  { nome: 'cabecaGato', descricao: 'cabeça de gato com tufos de pelo nas bochechas', ancora: [150, 110],
    desenho: () => f('path', 'd="M150 58 C182 58 204 76 210 102 L222 116 L208 118 L214 128 L200 130 C190 150 172 160 150 160 C128 160 110 150 100 130 L86 128 L92 118 L78 116 L90 102 C96 76 118 58 150 58 Z"') },
  { nome: 'listrasTesta', descricao: 'três listras de gato rajado na testa', ancora: [150, 70],
    desenho: () => solto('M150 62 L150 76 M136 65 L139 77 M164 65 L161 77', 2.5) },
  { nome: 'olhoGato', descricao: 'olho de gato amendoado com pupila em pé', ancora: [131, 104],
    desenho: () => f('path', 'd="M116 104 Q131 90 146 104 Q131 116 116 104 Z"', 'white', 2.5) + f('ellipse', 'cx="131" cy="104" rx="3.5" ry="8"', 'black', 1) },
  { nome: 'focinhoGato', descricao: 'nariz e boca de gato', ancora: [150, 126],
    desenho: () => f('path', 'd="M143 120 Q150 117 157 120 Q154 128 150 128 Q146 128 143 120 Z"', 'white', 2.5) +
      solto('M150 128 L150 133 M150 133 Q144 141 136 136 M150 133 Q156 141 164 136', 2.5) },
  { nome: 'bigodes', descricao: 'dois fios de bigode (esquerda; espelho para a direita)', ancora: [112, 125],
    desenho: () => solto('M112 122 L72 114 M112 128 L70 130', 2) },
  { nome: 'coleira', descricao: 'coleira curva no pescoço', ancora: [150, 168],
    desenho: () => f('path', 'd="M110 154 Q150 176 190 154 L192 168 Q150 192 108 168 Z"', 'white', 2.5) },
  { nome: 'guizo', descricao: 'guizo redondo da coleira', ancora: [150, 186],
    desenho: () => f('circle', 'cx="150" cy="186" r="9"', 'white', 2.5) + solto('M144 186 L156 186', 2) },
  { nome: 'corpoSentado', descricao: 'corpo em pera de bicho sentado de frente (ombros estreitos, base larga)', ancora: [150, 278],
    desenho: () => f('path', 'd="M112 156 C94 178 82 212 78 244 C76 264 88 278 106 278 L194 278 C212 278 224 264 222 244 C218 212 206 178 188 156 Z"') },
  { nome: 'coxaSentada', descricao: 'coxa traseira dobrada, por dentro do corpo (esquerda; espelho em x=198)', ancora: [102, 278],
    desenho: () => f('path', 'd="M80 246 C82 224 94 210 110 210 C124 212 128 234 124 256 C121 270 112 278 102 278 C88 278 78 264 80 246 Z"') },
  { nome: 'pernaFrente', descricao: 'perna dianteira em pé, fina (esquerda; espelho em x=163)', ancora: [137, 276],
    desenho: () => f('path', 'd="M127 276 C125 250 125 224 129 200 L146 200 C146 226 146 252 146 276 Z"') },
  { nome: 'pata', descricao: 'patinha oval com dois dedinhos (opção rx: largura, padrão 17)', ancora: [100, 279],
    desenho: (o) => f('ellipse', `cx="100" cy="279" rx="${o.rx || 17}" ry="8.5"`) + solto('M95 281 L95 287 M105 281 L105 287', 2) },
  { nome: 'peitoPelo', descricao: 'peito de pelo fofo com borda em zigue-zague (fica embaixo da coleira)', ancora: [150, 168],
    desenho: () => f('path', 'd="M118 168 C118 196 124 210 130 216 L136 210 L143 220 L150 212 L157 220 L164 210 L170 216 C176 210 182 196 182 168 Z"', 'white', 2.5) },
  { nome: 'raboDeitado', descricao: 'rabo listrado deitado no chão, curvado para cima (sai do lado direito)', ancora: [216, 256],
    desenho: () => f('path', 'd="M214 264 C250 266 274 250 270 224 C268 210 254 210 255 223 C257 238 244 248 216 249 Z"') +
      solto('M256 226 L269 228 M248 244 L258 254 M232 248 L236 262', 2) },

  // Borboleta (colorir-10): asas da direita; espelho em x=144 para a esquerda
  { nome: 'asaSuperior', descricao: 'asa de cima de borboleta com círculos e bolinhas (direita)', ancora: [156, 143],
    desenho: () => f('path', 'd="M156 136 C170 70 230 20 272 48 C300 70 264 136 156 150 Z"') +
      f('circle', 'cx="230" cy="84" r="24"', 'white', 2.5) + f('circle', 'cx="230" cy="84" r="11"', 'white', 2.5) +
      f('circle', 'cx="262" cy="56" r="6"', 'white', 2.5) + f('circle', 'cx="196" cy="58" r="6"', 'white', 2.5) + f('circle', 'cx="262" cy="112" r="6"', 'white', 2.5) },
  { nome: 'asaInferior', descricao: 'asa de baixo de borboleta com círculo e bolinhas (direita)', ancora: [158, 170],
    desenho: () => f('path', 'd="M156 152 C222 150 272 176 258 222 C246 262 190 252 160 192 Z"') +
      f('circle', 'cx="214" cy="204" r="17"', 'white', 2.5) + f('circle', 'cx="214" cy="204" r="7"', 'white', 2.5) +
      f('circle', 'cx="244" cy="232" r="5"', 'white', 2.5) + f('circle', 'cx="178" cy="234" r="5"', 'white', 2.5) },
  { nome: 'antena', descricao: 'antena curva com bolinha na ponta (direita)', ancora: [156, 96],
    desenho: () => solto('M156 96 Q172 54 192 40', 2.5) + f('circle', 'cx="194" cy="38" r="6"', 'white', 2.5) },
  { nome: 'corpoInseto', descricao: 'corpo de inseto em gomos que afinam para baixo', ancora: [150, 175],
    desenho: () => [132, 154, 176, 198, 218].map((y, i) => f('ellipse', `cx="150" cy="${y}" rx="${10 - i * 0.8}" ry="14"`)).join('') },
  { nome: 'cabecaInseto', descricao: 'cabecinha redonda sorridente de inseto', ancora: [150, 106],
    desenho: () => f('circle', 'cx="150" cy="106" r="15"') + olho(144, 104, 2.4) + olho(156, 104, 2.4) + solto('M144 111 Q150 116 156 111', 2) }
].map(p => Object.assign(p, { tema }));

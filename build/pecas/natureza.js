// Peças de natureza, tiradas dos desenhos aprovados (árvore colorir-07, castelo colorir-19).
// Peças pequenas (maçã, flor, tufo, moita) são desenhadas em volta do ponto 0,0: sempre passar x e y.
'use strict';
const { f, solto, copa, colina, suave } = require('../desenho.js');
const peca = require('./peca.js');
const tema = 'natureza';

const lista = [
  { nome: 'tronco', descricao: 'tronco com dois galhos, raízes abertas, casca e buraquinho', ancora: [150, 286],
    desenho: () => f('path', 'd="M100 286 C118 280 128 270 132 248 C136 224 134 204 126 186 C116 170 100 160 86 154 L92 142 C108 150 122 158 136 170 ' +
      'C138 152 142 134 144 114 L156 114 C158 134 158 152 162 168 C174 154 190 144 206 136 L212 146 C196 156 180 168 172 186 ' +
      'C164 206 162 228 166 250 C170 270 182 280 200 286 C182 288 166 284 150 282 C134 284 118 288 100 286 Z"') +
      solto('M144 268 C142 248 144 228 142 208 M156 262 C158 244 156 226 158 204', 2) + f('ellipse', 'cx="150" cy="232" rx="5" ry="8"', 'white', 2.5) },
  { nome: 'copaArvore', descricao: 'copa de árvore com seis grupos de folhas em camadas (cobre a ponta dos galhos do tronco)', ancora: [150, 100],
    desenho: () => copa(150, 88, 76, 54, 14, 10, 3, 0.1) + copa(104, 66, 46, 34, 10, 20, 3, 0.12) + copa(198, 62, 44, 34, 10, 0, 3, 0.12) +
      copa(150, 44, 46, 30, 10, 15, 3, 0.12) + copa(88, 124, 50, 34, 11, 5, 3, 0.12) + copa(212, 120, 50, 36, 11, 15, 3, 0.12) },
  { nome: 'maca', descricao: 'maçã pequena com cabinho (fruta da árvore)', ancora: [0, 0],
    desenho: () => f('circle', 'cx="0" cy="0" r="8.5"', 'white', 2.5) + solto('M0 -8 Q1 -13 4 -15', 2) },
  { nome: 'flor', descricao: 'florzinha de quatro pétalas redondas, para o chão', ancora: [0, 0],
    desenho: () => [[0, -7], [7, 0], [0, 7], [-7, 0]].map(([x, y]) => f('circle', `cx="${x}" cy="${y}" r="5.5"`, 'white', 2)).join('') + f('circle', 'cx="0" cy="0" r="4.5"', 'white', 2) },
  { nome: 'tufo', descricao: 'tufo de grama de três fios (não pinta), base em y=284', ancora: [0, 284],
    desenho: () => solto('M0 284 L-4 274 M4 284 L4 272 M8 284 L12 275', 2) },
  { nome: 'moita', descricao: 'moitinha em meia-lua no chão', ancora: [0, 0],
    desenho: () => f('path', 'd="M-14 0 Q0 -20 14 0 Z"', 'white', 2.5) },
  { nome: 'confeito', descricao: 'confeitinho oval de curva livre (granulado do sorvete); o.g gira em graus', ancora: [0, 0],
    desenho: (o) => { const a = (o.g ?? 0) * Math.PI / 180, c = Math.cos(a), s = Math.sin(a);
      const pts = Array.from({ length: 8 }, (_, i) => { const t = i * Math.PI / 4, k = 1 + 0.035 * Math.sin(i * 2.1), x = 7.5 * k * Math.cos(t), y = 4 * k * Math.sin(t); return [+(x * c - y * s).toFixed(1), +(x * s + y * c).toFixed(1)]; });
      return f('path', `d="${suave(pts)}"`, 'white', 2.5); } },
  { nome: 'coneSorvete', descricao: 'cone de sorvete (casquinha) com quadriculado, ponta para baixo, base larga em y=170', ancora: [150, 170],
    desenho: () => f('path', 'd="M84 170 L144 282 Q150 292 156 282 L216 170 Z"') +
      solto('M124 170 L165 246', 2) + solto('M176 170 L135 246', 2) + solto('M150 170 L180 224', 2) + solto('M150 170 L120 224', 2) + solto('M176 170 L194 202', 2) + solto('M124 170 L106 202', 2) },
  { nome: 'folhaJoaninha', descricao: 'folha larga de baixo, onde a joaninha pousa, com duas nervuras (centro em 150,236)', ancora: [150, 236],
    desenho: () => f('path', 'd="M10 236 Q60 160 150 176 Q240 160 290 236 Q250 300 150 296 Q50 300 10 236 Z"') +
      solto('M50 262 Q92 256 120 276', 2.5) + solto('M250 262 Q208 256 180 276', 2.5) },
  { nome: 'chaoArvore', descricao: 'chão suave da árvore (colina baixa)', ancora: [150, 280],
    desenho: () => colina(280, 14, 278) }
];

// Modelo inteiro aprovado, para usar de fundo em outros desenhos (ex.: { x: 240, y: 286, e: 0.4 }).
const pecas = Object.fromEntries(lista.map(p => [p.nome, peca(Object.assign(p, { tema }))]));
lista.push({ nome: 'arvoreMacas', descricao: 'árvore inteira aprovada: tronco, copa e sete maçãs (base no centro do tronco)', ancora: [150, 286],
  desenho: () => pecas.tronco() + pecas.copaArvore() +
    [[78, 120], [108, 142], [222, 132], [196, 110], [150, 110], [176, 52], [118, 60]].map(([x, y]) => pecas.maca({ x, y })).join('') });

module.exports = lista.map(p => Object.assign(p, { tema }));

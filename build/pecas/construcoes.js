// Peças de construções, tiradas do desenho aprovado do castelo (colorir-19). Tamanhos ajustáveis pelas opções.
'use strict';
const { f, solto } = require('../desenho.js');
const tema = 'construcoes';
// Arco: lados retos até "ombro", depois curva até o alto (janela e porta).
const arco = (ax, ay, m, a, o) => `M${ax - m} ${ay} L${ax - m} ${ay - o} Q${ax - m} ${ay - a} ${ax} ${ay - a} Q${ax + m} ${ay - a} ${ax + m} ${ay - o} L${ax + m} ${ay} Z`;

module.exports = [
  { nome: 'torre', descricao: 'bloco de pedra com cantos arredondados: torre, muro, prédio (opções l, a: largura e altura; base no meio)', ancora: [63, 275],
    desenho: (o) => { const l = o.l || 58, a = o.a || 150; return f('rect', `x="${63 - l / 2}" y="${275 - a}" width="${l}" height="${a}" rx="${o.rx || 10}"`); } },
  { nome: 'telhadoCone', descricao: 'telhado em cone de castelo, de lados curvos (opções meia: meia largura 37, altura 68, dobra 5, base 10)', ancora: [63, 128],
    desenho: (o) => {
      const m = o.meia || 37, h = o.altura || 68, d = o.dobra || 5, b = o.base || 10, x = 63, y = 128;
      return f('path', `d="M${x - m} ${y} Q${x - d} ${y - 24} ${x} ${y - h} Q${x + d} ${y - 24} ${x + m} ${y} Q${x} ${y - b} ${x - m} ${y} Z"`);
    } },
  { nome: 'janelaArco', descricao: 'janela em arco (opções meia 11, altura 20, ombro 8; base no meio)', ancora: [63, 192],
    desenho: (o) => f('path', `d="${arco(63, 192, o.meia || 11, o.altura || 20, o.ombro || 8)}"`) },
  { nome: 'portaArco', descricao: 'porta em arco com maçaneta (base no meio, 40 de largura)', ancora: [150, 274],
    desenho: () => f('path', `d="${arco(150, 274, 20, 60, 34)}"`) + f('circle', 'cx="162" cy="246" r="3.5"', 'black', 1) },
  { nome: 'bandeira', descricao: 'mastro com bandeirinha ao vento (encaixe na base do mastro)', ancora: [150, 34],
    desenho: () => solto('M150 34 L150 12', 3) + f('path', 'd="M150 12 Q172 4 190 14 Q172 24 150 22 Z"', 'white', 2.5) }
].map(p => Object.assign(p, { tema }));

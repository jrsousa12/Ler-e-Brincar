// Peças de céu, tiradas do desenho aprovado do sol (colorir-05).
'use strict';
const { f, solto, polar } = require('../desenho.js');
const tema = 'ceu';

module.exports = [
  { nome: 'raiosSol', descricao: 'raios de sol em gota, longos e curtos alternados (opção n: quantidade, padrão 12)', ancora: [150, 150],
    desenho: (o) => {
      const n = o.n || 12, passo = 360 / n, partes = [];
      for (let i = 0; i < n; i++) {
        const a = i * passo - 90, ponta = i % 2 ? 114 : 132, l = 13;
        const [bx1, by1] = polar(150, 150, 66, a - l), [bx2, by2] = polar(150, 150, 66, a + l), [tx, ty] = polar(150, 150, ponta, a);
        const [c1x, c1y] = polar(150, 150, (66 + ponta) / 2 + 4, a - l * 0.9), [c2x, c2y] = polar(150, 150, (66 + ponta) / 2 + 4, a + l * 0.9);
        partes.push(f('path', `d="M${bx1} ${by1} Q${c1x} ${c1y} ${tx} ${ty} Q${c2x} ${c2y} ${bx2} ${by2} Z"`));
      }
      return partes.join('');
    } },
  { nome: 'discoSol', descricao: 'disco do sol com anel por dentro', ancora: [150, 150],
    desenho: () => f('circle', 'cx="150" cy="150" r="64"') + f('circle', 'cx="150" cy="150" r="52"', 'white', 2) },
  { nome: 'rostoFeliz', descricao: 'rosto sorridente: olhos, sobrancelhas, bochechas e boca aberta (cabe num círculo de raio 50)', ancora: [150, 150],
    desenho: () => f('ellipse', 'cx="130" cy="138" rx="6" ry="9"', 'black', 1) + f('ellipse', 'cx="170" cy="138" rx="6" ry="9"', 'black', 1) +
      f('circle', 'cx="112" cy="162" r="9"', 'white', 2) + f('circle', 'cx="188" cy="162" r="9"', 'white', 2) +
      f('path', 'd="M128 164 Q150 196 172 164 Q150 172 128 164 Z"', 'white', 2.5) + solto('M122 128 Q130 122 138 126 M162 126 Q170 122 178 128', 2) },
  { nome: 'luaCrescente', descricao: 'lua crescente grossa, aberta para a direita (encaixe no meio da curva de fora)', ancora: [50, 172],
    desenho: () => f('path', 'd="M60 130 A46 46 0 1 0 84 214 A36 36 0 1 1 60 130 Z"') }
].map(p => Object.assign(p, { tema }));

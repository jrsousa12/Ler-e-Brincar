// Engrenagem das peças: cada peça é desenhada uma vez, na posição do desenho aprovado, com um ponto de encaixe (ancora).
// Cada peça sai marcada (<g data-peca>), para o motor contar o que ainda não está na biblioteca.
// Usar: peca(def) devolve uma função colocar({ x, y, e, espelho, ...opções }) → texto SVG.
//   sem x/y: fica onde foi aprovada · e: escala (o traço continua da mesma grossura) · espelho: vira para o outro lado
'use strict';
function peca(def) {
  for (const c of ['nome', 'tema', 'descricao', 'ancora', 'desenho']) if (!def[c]) throw new Error('peça sem ' + c + ': ' + (def.nome || '?'));
  const colocar = (o = {}) => {
    const [ax, ay] = def.ancora;
    const x = o.x ?? ax, y = o.y ?? ay, e = o.e ?? 1, s = o.espelho ? -1 : 1;
    let t = def.desenho(o);
    if (e !== 1) t = t.replace(/stroke-width="([\d.]+)"/g, (m, w) => `stroke-width="${+(w / e).toFixed(2)}"`);
    const mover = x === ax && y === ay && e === 1 && s === 1 ? '' :
      ` transform="translate(${x} ${y}) scale(${+(s * e).toFixed(3)} ${e}) translate(${-ax} ${-ay})"`;
    return `<g data-peca="${def.nome}"${mover}>${t}</g>`;
  };
  colocar.def = def;
  return colocar;
}
module.exports = peca;

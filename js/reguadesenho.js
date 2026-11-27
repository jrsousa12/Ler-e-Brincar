// Desenho da régua com objetos (SVG feito pelo código, sem imagem): LB.reguaDesenho(objetos, regua, guias).
// objetos: [{ nome, inicio, fim, cor }] em cm, um em cima do outro; regua = tamanho da régua em cm; guias = linha pontilhada na ponta.
LB.reguaDesenho = function (objetos, regua, guias) {
  'use strict';
  const U = 20, M = 12, LINHA = 30;                         // pixels por cm, margem, altura de cada objeto
  const x = cm => M + cm * U;
  const topo = objetos.length * LINHA + 8, largura = regua * U + 2 * M, altura = topo + 46;
  let s = '';
  objetos.forEach((o, i) => {
    const y = 6 + i * LINHA;
    s += '<rect class="reg-objeto" x="' + x(o.inicio) + '" y="' + y + '" width="' + (o.fim - o.inicio) * U + '" height="22" rx="6" fill="' + o.cor + '"/>'
      + '<text class="reg-nome" x="' + (x(o.inicio) + 8) + '" y="' + (y + 11) + '" dominant-baseline="central">' + o.nome + '</text>';
    if (guias) s += '<line class="reg-guia" x1="' + x(o.fim) + '" y1="' + y + '" x2="' + x(o.fim) + '" y2="' + topo + '"/>';
  });
  s += '<rect class="reg-regua" x="' + (M - 6) + '" y="' + topo + '" width="' + (regua * U + 12) + '" height="38" rx="5"/>';
  for (let n = 0; n <= regua; n++) {
    s += '<line class="reg-risco" x1="' + x(n) + '" y1="' + topo + '" x2="' + x(n) + '" y2="' + (topo + 12) + '"/>'
      + '<text class="reg-num" x="' + x(n) + '" y="' + (topo + 26) + '" text-anchor="middle">' + n + '</text>';
  }
  return '<svg class="regua-svg" viewBox="0 0 ' + largura + ' ' + altura + '" role="img" aria-label="Régua com objetos">' + s + '</svg>';
};

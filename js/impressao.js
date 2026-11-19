// Monta folhas para imprimir (desenho ou lista de atividades) em #print-container.
(function () {
  'use strict';
  const esc = t => String(t).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const cabecalho = (titulo, dica) =>
    '<div class="print-header">' +
    '<div class="print-topo"><span class="print-marca">Ler &amp; Brincar</span><span>Data: ___/___/_____</span></div>' +
    '<h1 class="print-titulo">' + esc(titulo) + '</h1>' +
    (dica ? '<p class="print-dica">' + esc(dica) + '</p>' : '') +
    '<div class="nome"><span>Nome: ____________________________________________</span></div></div>';

  function desenho(c) {
    return cabecalho('Para colorir: ' + c.titulo, 'Capriche nas cores!') + '<div class="print-desenho">' + c.svg + '</div>';
  }

  function atividades(lista, materia) {
    const itens = lista.map((a, i) => {
      const apoio = a.apoioVisual
        ? '<p>' + esc(a.apoioVisual.esquerda + ' ' + a.apoioVisual.operador + ' ' + a.apoioVisual.direita) + '</p>' : '';
      const opcoes = a.opcoes.map(o => '<span class="print-opcao">( ) ' + esc(o) + '</span>').join(' ');
      return '<div class="print-questao"><p><strong>' + (i + 1) + '.</strong> ' + esc(a.enunciado) + '</p>' + apoio + '<p>' + opcoes + '</p></div>';
    }).join('');
    return cabecalho('Atividades de ' + materia) + '<div class="print-body">' + itens + '</div>';
  }

  function imprimir(html) {
    const caixa = document.getElementById('print-container');
    caixa.innerHTML = html;
    document.body.classList.add('imprimindo');
    const limpar = () => { document.body.classList.remove('imprimindo'); window.removeEventListener('afterprint', limpar); };
    window.addEventListener('afterprint', limpar);
    window.print();
  }

  LB.impressao = { desenho, atividades, imprimir };
})();

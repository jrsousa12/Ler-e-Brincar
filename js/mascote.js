// Mascote: capivara em 3 humores, feita de imagens (icones/mascote-<humor>.png, 320×320, fundo transparente).
// 'normal' (respira), 'feliz' (acertou), 'festa' (missão completa). Uso no molde: v-html="mascote('feliz')".
// Para trocar o bicho, basta trocar as 3 imagens (mesmo nome, mesmo tamanho); animações em css/movimento.css.
LB.mascote = (function () {
  'use strict';
  const NOMES = { normal: 'normal', feliz: 'feliz', festa: 'em festa' };
  function desenho(humor) {
    const h = NOMES[humor] ? humor : 'normal';
    return '<img class="mascote-svg humor-' + h + '" src="icones/mascote-' + h + '.png" alt="Capivara ' + NOMES[h] + '" draggable="false">';
  }

  // Frase do balão no início, conforme o andamento da missão do dia.
  function frase(completa, feitos, total) {
    if (completa) return 'Missão completa! Que orgulho de você! Volte amanhã.';
    if (feitos > 0) return 'Você já fez ' + feitos + ' de ' + total + '. Vamos continuar?';
    return 'Oi! Vamos ler e brincar hoje? Toque em Começar!';
  }

  return { desenho, frase };
})();

// Mascote: capivara em 3 humores, desenhada em SVG pelo código (js/capivara*.js, carregados antes).
// 'normal' (respira e pisca), 'feliz' (acertou), 'festa' (missão completa, abana os braços). Uso no molde: v-html="mascote('feliz')".
// Animações em css/movimento.css (classes c-olhos, c-braco, c-confete).
LB.mascote = (function () {
  'use strict';
  const desenho = humor => LB.capivara.desenho(humor);

  // Frase do balão no início, conforme o andamento da missão do dia.
  function frase(completa, feitos, total) {
    if (completa) return 'Missão completa! Que orgulho de você! Volte amanhã.';
    if (feitos > 0) return 'Você já fez ' + feitos + ' de ' + total + '. Vamos continuar?';
    return 'Oi! Vamos ler e brincar hoje? Toque em Começar!';
  }

  return { desenho, frase };
})();

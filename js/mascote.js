// Mascote (Fase 7 etapa 3): capivara desenhada pelo próprio app, em 3 humores.
// 'normal' (pisca), 'feliz' (acertou), 'festa' (missão completa). Uso no molde: v-html="mascote('feliz')".
// Para trocar o bicho, basta refazer o desenho aqui (classes c-olhos e c-braco são usadas nas animações).
LB.mascote = (function () {
  'use strict';
  const ESCURO = '#3B2718', PELO = '#B98457', PELO_ESCURO = '#8A5E3B';
  const corpo =
    '<ellipse cx="60" cy="86" rx="34" ry="22" fill="#A8764C"/>' +
    '<ellipse cx="60" cy="92" rx="19" ry="13" fill="#D9AE82"/>';
  const patas =
    '<ellipse cx="46" cy="104" rx="8" ry="5" fill="' + PELO_ESCURO + '"/><ellipse cx="74" cy="104" rx="8" ry="5" fill="' + PELO_ESCURO + '"/>';
  const bracosBaixos =
    '<path d="M30 82Q26 94 34 98M90 82Q94 94 86 98" stroke="' + PELO_ESCURO + '" stroke-width="9" fill="none" stroke-linecap="round"/>';
  const bracosAltos =
    '<path class="c-braco" d="M32 84Q20 74 16 58" stroke="' + PELO_ESCURO + '" stroke-width="9" fill="none" stroke-linecap="round"/>' +
    '<path class="c-braco c-braco-d" d="M88 84Q100 74 104 58" stroke="' + PELO_ESCURO + '" stroke-width="9" fill="none" stroke-linecap="round"/>';
  const cabeca =
    '<ellipse cx="33" cy="22" rx="5.5" ry="4.5" fill="' + PELO_ESCURO + '"/><ellipse cx="87" cy="22" rx="5.5" ry="4.5" fill="' + PELO_ESCURO + '"/>' +
    '<rect x="23" y="20" width="74" height="58" rx="20" fill="' + PELO + '"/>' +
    '<circle cx="30" cy="52" r="4.5" fill="#FF8FB8" opacity=".6"/><circle cx="90" cy="52" r="4.5" fill="#FF8FB8" opacity=".6"/>' +
    '<rect x="35" y="43" width="50" height="33" rx="15" fill="' + PELO_ESCURO + '"/>' +
    '<path d="M50 50v5M70 50v5" stroke="' + ESCURO + '" stroke-width="3.5" stroke-linecap="round"/>' +
    '<path d="M54 64q6 5 12 0" stroke="' + ESCURO + '" stroke-width="2.5" fill="none" stroke-linecap="round"/>';
  const olhosAbertos =
    '<g class="c-olhos"><circle cx="40" cy="33" r="4.5" fill="' + ESCURO + '"/><circle cx="80" cy="33" r="4.5" fill="' + ESCURO + '"/>' +
    '<circle cx="41.6" cy="31.4" r="1.5" fill="#fff"/><circle cx="81.6" cy="31.4" r="1.5" fill="#fff"/></g>';
  const olhosFelizes =
    '<path d="M35 35Q40 28 45 35M75 35Q80 28 85 35" stroke="' + ESCURO + '" stroke-width="3.5" fill="none" stroke-linecap="round"/>';
  // Laranjinha na cabeça (jeito calmo da capivara); na festa vira chapéu.
  const laranja =
    '<circle cx="60" cy="15" r="8.5" fill="#FFA62B"/><circle cx="57" cy="12" r="2" fill="#FFD08A"/>' +
    '<path d="M60 6Q64 0 70 3Q65 7 60 6Z" fill="#3CC98A"/>';
  const chapeu =
    '<path d="M60 -2L48 22Q60 18 72 22Z" fill="#EE5A9E"/><path d="M55 10L65 10M52 17L68 17" stroke="#FFD34E" stroke-width="3" stroke-linecap="round"/>' +
    '<circle cx="60" cy="-2" r="4.5" fill="#FFD34E"/>';
  const confete =
    '<g class="c-confete"><path d="M10 14l3 6 6 1-5 4 1 6-5-3-6 3 1-6-5-4 6-1z" fill="#FFD34E"/>' +
    '<circle cx="106" cy="16" r="4" fill="#5CA0FF"/><rect x="100" y="96" width="7" height="7" rx="2" fill="#FF7DB6" transform="rotate(20 103 99)"/>' +
    '<circle cx="12" cy="96" r="3.5" fill="#3CC98A"/></g>';

  function desenho(humor) {
    const h = ['feliz', 'festa'].includes(humor) ? humor : 'normal';
    const partes = (h === 'festa' ? bracosAltos : '') + corpo + (h === 'festa' ? '' : bracosBaixos) + patas + cabeca +
      (h === 'normal' ? olhosAbertos : olhosFelizes) + (h === 'festa' ? chapeu + confete : laranja);
    return '<svg class="mascote-svg humor-' + h + '" viewBox="0 -6 120 118" role="img" aria-label="Capivara ' + h + '">' + partes + '</svg>';
  }

  // Frase do balão no início, conforme o andamento da missão do dia.
  function frase(completa, feitos, total) {
    if (completa) return 'Missão completa! Que orgulho de você! Volte amanhã.';
    if (feitos > 0) return 'Você já fez ' + feitos + ' de ' + total + '. Vamos continuar?';
    return 'Oi! Vamos ler e brincar hoje? Toque em Começar!';
  }

  return { desenho, frase };
})();

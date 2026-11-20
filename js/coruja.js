// Coruja (mascote, Fase 7 etapa 3): desenho feito pelo próprio app, em 3 humores.
// 'normal' (pisca), 'feliz' (acertou), 'festa' (missão completa). Uso no molde: v-html="coruja('feliz')".
LB.coruja = (function () {
  'use strict';
  const ESCURO = '#2B2250';
  const asasBaixas =
    '<path d="M28 60C12 66 10 90 30 100C27 87 29 74 35 64Z" fill="#6A4BE0"/>' +
    '<path d="M92 60C108 66 110 90 90 100C93 87 91 74 85 64Z" fill="#6A4BE0"/>';
  const asasAltas =
    '<path class="c-asa" d="M30 66C14 58 6 38 12 28C20 40 30 50 40 60Z" fill="#6A4BE0"/>' +
    '<path class="c-asa c-asa-d" d="M90 66C106 58 114 38 108 28C100 40 90 50 80 60Z" fill="#6A4BE0"/>';
  const corpo =
    '<path d="M31 36L27 12L47 27Q60 23 73 27L93 12L89 36Q100 52 98 74Q96 106 60 107Q24 106 22 74Q20 52 31 36Z" fill="#8E72FF"/>' +
    '<ellipse cx="60" cy="82" rx="24" ry="21" fill="#FFE9C7"/>' +
    '<path d="M46 80q3.5 4 7 0q3.5 4 7 0q3.5 4 7 0q3.5 4 7 0M49.5 90q3.5 4 7 0q3.5 4 7 0q3.5 4 7 0" stroke="#F2C98F" stroke-width="2.5" fill="none" stroke-linecap="round"/>' +
    '<circle cx="44" cy="51" r="17" fill="#fff"/><circle cx="76" cy="51" r="17" fill="#fff"/>';
  const olhosAbertos =
    '<g class="c-olhos"><circle cx="46" cy="52" r="8" fill="' + ESCURO + '"/><circle cx="74" cy="52" r="8" fill="' + ESCURO + '"/>' +
    '<circle cx="49" cy="49" r="2.6" fill="#fff"/><circle cx="77" cy="49" r="2.6" fill="#fff"/></g>';
  const olhosFelizes =
    '<path d="M35 55Q44 43 53 55M67 55Q76 43 85 55" stroke="' + ESCURO + '" stroke-width="4.5" fill="none" stroke-linecap="round"/>';
  const rosto =
    '<circle cx="29" cy="67" r="5" fill="#FF8FB8" opacity=".75"/><circle cx="91" cy="67" r="5" fill="#FF8FB8" opacity=".75"/>' +
    '<path d="M54 61Q60 58 66 61Q63 70 60 73Q57 70 54 61Z" fill="#FFA62B"/>' +
    '<path d="M47 105q3 6 6 0q3 6 6 0M61 105q3 6 6 0q3 6 6 0" stroke="#FFA62B" stroke-width="3.5" fill="none" stroke-linecap="round"/>';
  const chapeu =
    '<path d="M60 3L49 29Q60 26 71 29Z" fill="#EE5A9E"/><path d="M55 16L65 16M52 23L68 23" stroke="#FFD34E" stroke-width="3" stroke-linecap="round"/>' +
    '<circle cx="60" cy="4" r="4.5" fill="#FFD34E"/>';
  const confete =
    '<g class="c-confete"><path d="M10 14l3 6 6 1-5 4 1 6-5-3-6 3 1-6-5-4 6-1z" fill="#FFD34E"/>' +
    '<circle cx="104" cy="12" r="4" fill="#5CA0FF"/><rect x="100" y="96" width="7" height="7" rx="2" fill="#FF7DB6" transform="rotate(20 103 99)"/>' +
    '<circle cx="12" cy="96" r="3.5" fill="#3CC98A"/></g>';

  function desenho(humor) {
    const h = ['feliz', 'festa'].includes(humor) ? humor : 'normal';
    const partes = (h === 'festa' ? asasAltas : asasBaixas) + corpo +
      (h === 'normal' ? olhosAbertos : olhosFelizes) + rosto + (h === 'festa' ? chapeu + confete : '');
    return '<svg class="coruja-svg humor-' + h + '" viewBox="0 0 120 112" role="img" aria-label="Coruja ' + h + '">' + partes + '</svg>';
  }

  // Frase do balão no início, conforme o andamento da missão do dia.
  function frase(completa, feitos, total) {
    if (completa) return 'Missão completa! Que orgulho de você! Volte amanhã.';
    if (feitos > 0) return 'Você já fez ' + feitos + ' de ' + total + '. Vamos continuar?';
    return 'Oi! Vamos ler e brincar hoje? Toque em Começar!';
  }

  return { desenho, frase };
})();

// Capivara em SVG feita pelo código, 320×320, em 3 humores: 'normal', 'feliz', 'festa' (usada por js/mascote.js).
// Peças: LB.capivaraPelo (tufinhos e fios), LB.capivaraPatas (braços e patinhas) e LB.capivaraRosto (rosto e enfeites), carregadas antes.
// Classes animadas: c-olhos (pisca), c-braco / c-braco-d (abanam na festa), c-confete (brilha).
LB.capivara = (function () {
  'use strict';
  const P = LB.capivaraPelo, R = LB.capivaraRosto, T = LB.capivaraPatas;
  const CONTORNO = '#9C6446';

  const grad = (tipo, id, attrs, paradas) => '<' + tipo + 'Gradient id="' + id + '" ' + attrs + '>' +
    paradas.map(p => '<stop offset="' + p[0] + '" stop-color="' + p[1] + '"' + (p.length > 2 ? ' stop-opacity="' + p[2] + '"' : '') + '/>').join('') + '</' + tipo + 'Gradient>';
  const DEFS = '<defs>' +
    grad('radial', 'cap-cabeca', 'cx="50%" cy="28%" r="70%"', [[0, '#E6B487'], [.6, '#DDA77D'], [1, '#D19669']]) +
    grad('linear', 'cap-corpo', 'x1="0" y1="0" x2="0" y2="1"', [[0, '#D59D72'], [.45, '#C3855E'], [1, '#A06548']]) +
    grad('radial', 'cap-corpo-festa', 'cx="50%" cy="45%" r="62%"', [[0, '#E2A479'], [.65, '#D39168'], [1, '#BD7B58']]) +
    grad('radial', 'cap-pata', 'cx="45%" cy="35%" r="70%"', [[0, '#B07B60'], [.55, '#8E5A44'], [1, '#6F4333']]) +
    grad('radial', 'cap-volume', 'cx="50%" cy="38%" r="62%"', [[0, '#8A4E34', 0], [.72, '#8A4E34', 0], [1, '#8A4E34', .32]]) +
    grad('radial', 'cap-braco-luz', 'cx="42%" cy="40%" r="60%"', [[0, '#EDBD92', .75], [.6, '#E2AC80', .45], [1, '#D49A70', 0]]) +
    grad('radial', 'cap-orelha', 'cx="50%" cy="60%" r="60%"', [[0, '#C88A64'], [1, '#A86E50']]) +
    grad('linear', 'cap-braco', 'x1="0" y1="0" x2="1" y2="0"', [[0, '#C98B61'], [1, '#D9A075']]) +
    grad('radial', 'cap-focinho', 'cx="50%" cy="22%" r="80%"', [[0, '#C79079'], [.5, '#B07A64'], [1, '#9C6655']]) +
    grad('radial', 'cap-iris', 'cx="50%" cy="78%" r="70%"', [[0, '#B8684B'], [.55, '#7E3B2C'], [1, '#4A2018']]) +
    grad('radial', 'cap-laranja', 'cx="38%" cy="30%" r="72%"', [[0, '#FFC978'], [.5, '#FBA23C'], [1, '#EC7A28']]) +
    grad('linear', 'cap-folha', 'x1="0" y1="0" x2="1" y2="1"', [[0, '#8CBB6A'], [1, '#5E8E48']]) +
    grad('linear', 'cap-chapeu', 'x1="0" y1="0" x2="1" y2="1"', [[0, '#FBEDE2'], [1, '#E9C8B2']]) +
    grad('radial', 'cap-estrela', 'cx="50%" cy="45%" r="60%"', [[0, '#FFF8EC'], [1, '#FBE0C0']]) +
    '<filter id="cap-suave" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="4"/></filter>' +
    '<filter id="cap-macio" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation="1.8"/></filter>' +
    '<filter id="cap-leve" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="1.1"/></filter>' +
    '<filter id="cap-contorno" x="-5%" y="-5%" width="110%" height="110%"><feMorphology in="SourceAlpha" operator="dilate" radius="1.2" result="d"/>' +
    '<feFlood flood-color="#8A5540" flood-opacity=".55"/><feComposite in2="d" operator="in"/><feGaussianBlur stdDeviation=".45" result="c"/>' +
    '<feMerge><feMergeNode in="c"/><feMergeNode in="SourceGraphic"/></feMerge></filter>' +
    '<filter id="cap-pelinho" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation=".45"/></filter>' +
    '<filter id="cap-fio"><feGaussianBlur stdDeviation=".3"/></filter>' +
    '<clipPath id="cap-cone"><path d="M160,16 L194,84 Q160,96 126,84 Z"/></clipPath></defs>';

  // Orelhas: borda felpuda, por dentro mais clara.
  function orelhas() {
    const uma = (cx, s) => P.tufos(P.elipse(cx, 87, 18, 17), { passo: 4, comp: [2.5, 5], larg: 3, cor: '#9C6248', contorno: CONTORNO, semente: s, so: p => p.y < 100 }) +
      '<ellipse cx="' + cx + '" cy="87" rx="18.5" ry="17.5" fill="#9C6248"/><ellipse cx="' + (cx + (cx < 160 ? 2 : -2)) + '" cy="90" rx="11" ry="10" fill="url(#cap-orelha)" filter="url(#cap-leve)"/>';
    return uma(95, 21) + uma(225, 22);
  }

  // Corpo de pera para cada pose; tufos nas laterais e embaixo, fios por dentro.
  const CORPO = {
    normal: 'M90,214 C76,226 72,244 72,262 C72,284 84,298 100,305 C120,311 140,312 160,312 C180,312 200,311 220,305 C236,298 248,284 248,262 C248,244 244,226 230,214 Z',
    feliz: 'M86,214 C70,226 66,244 66,264 C66,286 78,300 98,306 C118,312 140,313 160,313 C180,313 202,312 222,306 C242,300 254,286 254,264 C254,244 250,226 234,214 Z',
    festa: 'M84,206 C72,226 76,246 78,262 C80,284 88,298 104,304 C124,310 142,310 160,310 C178,310 196,310 216,304 C232,298 240,284 242,262 C244,246 248,226 236,206 Z'
  };
  const corpo = h => P.tufos(CORPO[h], { passo: 3.2, comp: [2.5, 5.5], larg: 2.6, cor: h === 'festa' ? '#C68560' : '#AE6F50', contorno: CONTORNO, semente: 31, centro: [160, 250], so: p => p.y > 222, fator: p => tufo(p, 1) }) +
    '<path d="' + CORPO[h] + '" fill="url(#cap-corpo' + (h === 'festa' ? '-festa' : '') + ')"/><path d="' + CORPO[h] + '" fill="url(#cap-volume)"/>' +
    P.tufos(CORPO[h], { passo: 4, comp: [2, 4], larg: 2.2, cor: h === 'festa' ? '#D49A6E' : '#B97B56', semente: 33, centro: [160, 250], so: p => p.y > 226 }) +
    '<clipPath id="cap-rc-' + h + '"><path d="' + CORPO[h] + '"/></clipPath><g clip-path="url(#cap-rc-' + h + ')">' +
    P.fios(160, 268, 84, 42, { n: 150, comp: [9, 16], semente: 32, grossura: .8, cores: [['#EBB98E', .3], ['#A9694A', .14], ['#F6CFA6', .22]] }) + '</g>' +
''; 

  // Braços (lado esquerdo; o direito é o espelho): volume claro, traço que afina até a patinha e patinha caprichada.
  const volume = d => '<path d="' + d + '" fill="url(#cap-braco-luz)" filter="url(#cap-macio)"/>';
  const BRACO = {
    normal: () => { const b = T.braco([110, 246], [141, 250], [128, 302, -10], [-11, -11], [11, -11], [0, 1], 22, 14);
      return volume(b.forma) + T.traco(b.la, 2.6, 1.3) + T.traco(b.lb, 2.6, 1.3) + T.pata(128, 302, -10, '#B57653'); },
    feliz: () => { const b = T.braco([88, 240], [104, 236], [130, 286, -50], [-11, -11], [11, -11], [0, 1], 22, 14);
      return volume(b.forma) + T.traco(b.la, 2.6, 1.3) + T.traco(b.lb, 2.2, 1.3) + T.pata(130, 286, -50, '#BB7B55'); },
    festa: () => {
      const b = T.braco([100, 282], [120, 224], [42, 176, -28], [-9.5, 10], [9.5, 10], [-0.85, -0.5], 34, 22);
      return T.mao(42, 176, -28) + P.tufos(b.forma, { passo: 3.2, comp: [2.5, 5], larg: 2.6, cor: '#C98A5F', contorno: CONTORNO, semente: 41, so: p => p.y > 178 && Math.hypot(p.x - 44, p.y - 182) > 16 }) +
        '<path d="' + b.forma + '" fill="url(#cap-braco)"/>' + volume(b.forma) +
        T.traco(b.la, 1.8, 1.3) + T.traco(b.lb, 1.8, 1.3) + T.pulso(42, 176, -28, '#D29A6E');
    }
  };
  function bracos(h) {
    const esq = BRACO[h]();
    return '<g class="c-braco">' + esq + '</g><g class="c-braco c-braco-d"><g transform="matrix(-1 0 0 1 320 0)">' + esq + '</g></g>';
  }

  // Cabeça fofa: tufos em volta (mais compridos nas bochechas e no queixo), fios por dentro longe do rosto.
  const CABECA = 'M160,74 C198,74 228,86 236,108 C242,122 243,136 251,150 C257,162 258,176 256,190 C244,210 204,224 160,226 C116,224 76,210 64,190 C62,176 63,162 69,150 C77,136 78,122 84,108 C92,86 122,74 160,74 Z';
  const longe = (x, y) => ((x - 160) / 50) ** 2 + ((y - 176) / 54) ** 2 < 1 || Math.hypot(x - 110, y - 138) < 20 || Math.hypot(x - 212, y - 136) < 20;
  const tufo = (p, b) => b * (0.75 + 0.55 * Math.max(0, Math.sin(p.x * 0.13 + p.y * 0.09)));
  const cabeca = P.tufos(CABECA, { passo: 3.2, comp: [2.5, 5.5], larg: 2.6, cor: '#CF9367', contorno: CONTORNO, semente: 51, centro: [160, 150], fator: p => tufo(p, p.y > 200 ? 1.4 : p.y > 135 ? 1.6 : 1) }) +
    '<path d="' + CABECA + '" fill="url(#cap-cabeca)"/><path d="' + CABECA + '" fill="url(#cap-volume)" opacity=".8"/>' +
    P.tufos(CABECA, { passo: 4, comp: [2, 4.5], larg: 2.2, cor: '#C98C62', semente: 53, centro: [160, 150], fator: p => p.y > 135 ? 1.4 : 1 }) +
    '<clipPath id="cap-rc-cabeca"><path d="' + CABECA + '"/></clipPath><g clip-path="url(#cap-rc-cabeca)">' +
    P.fios(160, 148, 96, 74, { n: 260, comp: [7, 13], semente: 52, fora: longe, grossura: .8, cores: [['#F3C79C', .34], ['#B67650', .14], ['#FBDDB8', .26]] }) + '</g>';

  const sombraQueixo = '<ellipse cx="160" cy="230" rx="76" ry="9" fill="#87503F" opacity=".28" filter="url(#cap-suave)"/>';
  const contorno = parte => '<g filter="url(#cap-contorno)">' + parte + '</g>';

  function desenho(humor) {
    const h = CORPO[humor] ? humor : 'normal';
    return '<svg class="mascote-svg humor-' + h + '" viewBox="0 0 320 320" role="img" aria-label="Capivara ' + (h === 'festa' ? 'em festa' : h) + '">' + DEFS +
      (h === 'festa' ? R.confete : '') + contorno(orelhas()) + (h === 'festa' ? contorno(bracos(h)) + contorno(corpo(h)) : contorno(corpo(h)) + sombraQueixo + contorno(bracos(h))) + contorno(cabeca) + R.rosto(h) + (h === 'festa' ? R.chapeu : R.laranja) + '</svg>';
  }

  return { desenho };
})();

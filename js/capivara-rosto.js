// Rosto e enfeites da capivara (SVG, 320×320): olhos, sobrancelhas, bochechas, focinho, laranja, chapéu, estrela e confete.
// Classes animadas: c-olhos (pisca) e c-confete (brilha). Usa LB.capivaraPelo (carregar antes).
LB.capivaraRosto = (function () {
  'use strict';
  const P = LB.capivaraPelo, OLHO = '#5A2C22', NARIZ = '#6A382E';

  const sobrancelhas = '<g filter="url(#cap-leve)" fill="#A56B4C" opacity=".75">' +
    '<ellipse cx="113" cy="108" rx="9.5" ry="4.2" transform="rotate(-14 113 108)"/><ellipse cx="207" cy="108" rx="9.5" ry="4.2" transform="rotate(14 207 108)"/></g>';
  const bochechas = '<g filter="url(#cap-suave)" fill="#F39A98" opacity=".62"><ellipse cx="92" cy="163" rx="19" ry="11"/><ellipse cx="228" cy="163" rx="19" ry="11"/></g>';

  // Olho aberto: aro escuro, íris marrom-avermelhada (mais clara embaixo), dois brilhos.
  const olhoAberto = '<g class="c-olhos"><circle cx="110" cy="138" r="15" fill="#3E1E17"/><circle cx="110" cy="139" r="12.2" fill="url(#cap-iris)"/>' +
    '<circle cx="110" cy="137" r="6.2" fill="#2B130E" opacity=".75"/>' +
    '<circle cx="116" cy="131.5" r="5.6" fill="#fff"/><circle cx="103.5" cy="145.5" r="2.6" fill="#fff" opacity=".95"/>' +
    '<path d="M95.5,133 C99,124 117,121 125.5,131" stroke="#3E1E17" stroke-width="2.4" fill="none" stroke-linecap="round"/></g>';
  const piscando = '<path d="M196,141 C201,129 223,129 228,141" stroke="' + OLHO + '" stroke-width="4.6" fill="none" stroke-linecap="round"/>';
  const olhosFelizes = '<path d="M98,141 C103,126 127,126 132,141 M188,141 C193,126 217,126 222,141" stroke="' + OLHO + '" stroke-width="5.4" fill="none" stroke-linecap="round"/>';

  // Focinho em forma de sino (ponte do nariz clara, borda macia), narinas em gotinha e boca fina marrom-avermelhada.
  const narina = 'M136,158 C142,151 151,154 155,165 C149,161 142,160 136,158 Z';
  const focinho = '<path d="M160,127 C178,127 189,136 195,151 C203,168 207,188 202,205 C196,221 180,225 160,225 C140,225 124,221 118,205 C113,188 117,168 125,151 C131,136 142,127 160,127 Z" fill="url(#cap-focinho)" filter="url(#cap-leve)"/>' +
    '<g filter="url(#cap-suave)"><ellipse cx="160" cy="146" rx="17" ry="14" fill="#DCA88C" opacity=".5"/><ellipse cx="160" cy="214" rx="34" ry="9" fill="#87503F" opacity=".3"/></g>' +
    '<path d="' + narina + P.espelhar(narina) + '" fill="' + NARIZ + '"/>' +
    '<path d="M160,167 L160,196" stroke="' + NARIZ + '" stroke-width="2.4" stroke-linecap="round"/>' +
    '<path d="M141,187 Q149,198 160,197 Q171,198 181,186" stroke="' + NARIZ + '" stroke-width="2.8" fill="none" stroke-linecap="round" stroke-linejoin="round"/>';

  function rosto(h) {
    return sobrancelhas + bochechas + (h === 'festa' ? olhosFelizes : olhoAberto + piscando) + focinho;
  }

  // Laranjinha: contorno, casca pontilhada, brilho, cabinho e folha grande com nervura.
  const pontosCasca = [[150, 64], [158, 70], [168, 64], [172, 54], [146, 56], [163, 48], [154, 74], [174, 68]]
    .map(p => '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="1.1"/>').join('');
  const laranja = '<g><circle cx="160" cy="59" r="24" fill="url(#cap-laranja)" stroke="#DD6A22" stroke-width="1.3"/>' +
    '<g fill="#E07A26" opacity=".45">' + pontosCasca + '</g>' +
    '<ellipse cx="151" cy="49" rx="7" ry="5" fill="#FFE6BC" opacity=".75" transform="rotate(-30 151 49)"/>' +
    '<path d="M157,37 Q160,33 163,37" stroke="#7A8A3A" stroke-width="2" fill="none"/>' +
    '<path d="M160,37 L162,29" stroke="#6B4A2A" stroke-width="3" stroke-linecap="round"/>' +
    '<path d="M162,33 C167,22 181,18 192,22 C187,32 174,37 162,33 Z" fill="url(#cap-folha)" stroke="#4E7A3C" stroke-width="1"/>' +
    '<path d="M164,32 C172,28 181,25 189,23" stroke="#4E7A3C" stroke-width="1.4" fill="none"/></g>';

  // Chapéu de festa com listras, bolinhas e pompom felpudo.
  const pompom = P.tufos(P.elipse(160, 16, 9, 9), { passo: 3, comp: [3, 5], larg: 2.4, cor: '#F3CDB8', contorno: '#D9A792', semente: 11, centro: [160, 16] }) +
    '<circle cx="160" cy="16" r="9.5" fill="#F3CDB8"/><circle cx="157" cy="13" r="3.5" fill="#FBE4D6"/>';
  const chapeu = '<g transform="rotate(2 160 84)"><path d="M160,16 L194,84 Q160,96 126,84 Z" fill="url(#cap-chapeu)" stroke="#D9A792" stroke-width="1.5"/>' +
    '<g clip-path="url(#cap-cone)" stroke="#D8A08E" stroke-width="7" fill="none"><path d="M120,62 Q160,44 200,52"/><path d="M116,80 Q160,64 204,72"/><path d="M128,42 Q160,28 192,34"/></g>' +
    '<g fill="#fff"><circle cx="146" cy="70" r="2.2"/><circle cx="170" cy="58" r="2"/><circle cx="178" cy="80" r="2.2"/><circle cx="155" cy="46" r="1.8"/></g>' + pompom + '</g>';

  const estrela = (cx, cy, r) => {
    let d = '';
    for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, q = i % 2 ? r * .5 : r; d += (i ? 'L' : 'M') + (cx + q * Math.cos(a)).toFixed(1) + ',' + (cy + q * Math.sin(a)).toFixed(1); }
    return '<path d="' + d + 'Z" fill="url(#cap-estrela)" stroke="#E2AE84" stroke-width="3" stroke-linejoin="round"/>';
  };
  const CONFETES = [[77, 42, 6, '#7FA6F2'], [230, 38, 5, '#F08A92'], [275, 73, 8, '#6F9BF0'], [266, 110, 5, '#F5C07A'], [305, 132, 6, '#F08A92'],
    [313, 182, 4, '#F5C97A'], [18, 230, 4, '#8FB0F2'], [37, 272, 7, '#4FC287'], [272, 286, 7, '#F28C96']];
  const confete = '<g class="c-confete"><circle cx="28" cy="92" r="34" fill="#FFF1DC" filter="url(#cap-suave)"/>' + estrela(28, 92, 25) +
    '<circle cx="28" cy="126" r="2.5" fill="none" stroke="#F0D9C2" stroke-width="1.2"/>' +
    CONFETES.map(c => '<circle cx="' + c[0] + '" cy="' + c[1] + '" r="' + c[2] + '" fill="' + c[3] + '" opacity=".85"/>').join('') +
    '<rect x="286" y="238" width="10" height="13" rx="2" fill="#7FA6F2" transform="rotate(35 291 244)"/></g>';

  return { rosto, laranja, chapeu, confete };
})();

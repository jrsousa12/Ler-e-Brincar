// Regras da brincadeira "Ditado": sorteia as palavras e monta o teclado de letras. Sem tela (testado em testes/t_ditado.js).
// As palavras vêm de LB.silabas (conteudo/silabas.js, o mesmo banco do Monte a Palavra).
LB.ditadoRegras = (function () {
  'use strict';
  const embaralhar = lista => LB.rodada.embaralhar(lista);
  const ALFABETO = 'ABCDEFGHIJLMNOPQRSTUVXZ'.split('');
  // Letras que a criança costuma confundir: entram no teclado como distração.
  const PARECIDAS = { S: 'ZCX', Z: 'S', C: 'SQ', 'Ç': 'S', G: 'J', J: 'G', M: 'N', N: 'M', B: 'DP', D: 'BT', P: 'B', T: 'D', V: 'F', F: 'V', L: 'R', R: 'L', X: 'S', Q: 'C' };
  const POR_RODADA = 5;

  // Teclado de uma palavra: as letras dela + 3 de distração (as parecidas primeiro), tudo embaralhado.
  function teclado(palavra) {
    const letras = palavra.split('');
    const extras = [];
    const aceitar = l => { if (extras.length < 3 && !letras.includes(l) && !extras.includes(l)) extras.push(l); };
    embaralhar(letras.flatMap(l => (PARECIDAS[l] || '').split(''))).forEach(aceitar);
    embaralhar(ALFABETO).forEach(aceitar);
    return embaralhar([...letras, ...extras]).map((texto, i) => ({ id: 'l' + i + texto, texto }));
  }

  // Rodada de 5 palavras (sem repetir), das mais fáceis para as mais difíceis. 2 de nível 1 ou 2 para começar leve.
  function sortearRodada(lista) {
    const base = lista || LB.silabas || [];
    const faceis = embaralhar(base.filter(p => p.nivel <= 2)).slice(0, 2);
    const resto = embaralhar(base.filter(p => !faceis.includes(p))).slice(0, POR_RODADA - faceis.length);
    return [...faceis, ...resto].sort((a, b) => a.nivel - b.nivel)
      .map(p => ({ id: p.id, palavra: p.palavra, emoji: p.emoji, nivel: p.nivel, fala: 'Escreva a palavra ' + p.palavra.toLowerCase() + '.' }));
  }

  return { sortearRodada, teclado, POR_RODADA };
})();

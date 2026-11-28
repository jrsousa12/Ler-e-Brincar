// Regras da brincadeira "Letra que falta": figura + palavra com um buraco; escolher entre 3 letras. Sem tela (testado em testes/t_letrafalta.js).
// Palavras: LB.silabas. Letras erradas: as que a criança confunde (LB.ditadoRegras.PARECIDAS) e, se faltar, do alfabeto.
LB.letraFaltaRegras = (function () {
  'use strict';
  const embaralhar = lista => LB.rodada.embaralhar(lista);
  const POR_RODADA = 5;

  // Três letras: a certa e duas erradas (as parecidas primeiro).
  function opcoes(certa) {
    const erros = [];
    const aceitar = l => { if (erros.length < 2 && l !== certa && !erros.includes(l)) erros.push(l); };
    embaralhar((LB.ditadoRegras.PARECIDAS[certa] || '').split('')).forEach(aceitar);
    embaralhar(LB.ditadoRegras.ALFABETO).forEach(aceitar);
    return embaralhar([certa, ...erros]);
  }

  // Esconde uma letra da palavra, de preferência uma que costuma ser confundida (R, S, C, G, M...).
  function desafio(p) {
    const letras = p.palavra.split('');
    const dificeis = letras.map((l, i) => i).filter(i => LB.ditadoRegras.PARECIDAS[letras[i]]);
    const pos = embaralhar(dificeis.length ? dificeis : letras.map((l, i) => i))[0];
    const certa = letras[pos];
    return { id: p.id, palavra: p.palavra, emoji: p.emoji, nivel: p.nivel, pos, certa, opcoes: opcoes(certa),
      letras: letras.map((l, i) => i === pos ? '_' : l),
      fala: 'Que letra falta na palavra ' + p.palavra.toLowerCase() + '?' };
  }

  // Rodada de 5 palavras sem repetir, das mais fáceis para as mais difíceis (começa com uma de nível 1 ou 2).
  function sortearRodada(lista) {
    const base = lista || LB.silabas || [];
    const faceis = embaralhar(base.filter(p => p.nivel <= 2)).slice(0, 2);
    const resto = embaralhar(base.filter(p => !faceis.includes(p))).slice(0, POR_RODADA - faceis.length);
    return [...faceis, ...resto].sort((a, b) => a.nivel - b.nivel).map(desafio);
  }

  return { sortearRodada, desafio, opcoes, POR_RODADA };
})();

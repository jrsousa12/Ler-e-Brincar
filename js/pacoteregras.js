// Regras da brincadeira "Pacotes de contas": cada desafio é um pacote com 4 perguntas do mesmo tipo.
// Cada pergunta: { nivel, enunciado (aparece grande), fala (lida em voz alta), certa, opcoes (3, com a certa) }.
// O pacote: { nivel, titulo, fala, perguntas }. Testado em testes/t_pacote.js.
LB.pacoteRegras = (function () {
  'use strict';
  const TAMANHO_PACOTE = 4;
  const TETO = [0, 10, 20, 50, 100];   // tamanho máximo dos números por nível

  const sortearEntre = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  function embaralhar(lista) {
    const c = [...lista];
    for (let i = c.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [c[i], c[j]] = [c[j], c[i]]; }
    return c;
  }
  // Três opções: a certa e as duas primeiras erradas da lista (erros comuns primeiro).
  function opcoes(certa, erradas) {
    const erros = [];
    erradas.forEach(v => { if (erros.length < 2 && v >= 0 && v !== certa && !erros.includes(v)) erros.push(v); });
    return embaralhar([certa, ...erros]);
  }

  // Cada tipo de pacote sabe montar uma conta com o teto do nível.
  const TIPOS = {
    soma: {
      titulo: 'Somas',
      conta(t) {
        const a = sortearEntre(1, t / 2), b = sortearEntre(1, t - a), certa = a + b;
        return { enunciado: a + ' + ' + b + ' = ?', fala: 'Quanto é ' + a + ' mais ' + b + '?', certa,
          erradas: [certa + 1, certa - 1, certa + 10, certa - 10] };
      }
    },
    subtracao: {
      titulo: 'Subtrações',
      conta(t) {
        const a = sortearEntre(2, t), b = sortearEntre(1, a - 1), certa = a - b;
        return { enunciado: a + ' − ' + b + ' = ?', fala: 'Quanto é ' + a + ' menos ' + b + '?', certa,
          erradas: [certa + 1, certa - 1, a + b, certa + 10] };
      }
    },
    dobro: {
      titulo: 'Dobros',
      conta(t) {
        const a = sortearEntre(1, t / 2), certa = 2 * a;
        return { enunciado: 'O dobro de ' + a + ' = ?', fala: 'Qual é o dobro de ' + a + '?', certa,
          erradas: [certa + 1, certa - 1, certa + 2, a + 1] };
      }
    }
  };

  function pergunta(tipo, nivel) {
    const c = TIPOS[tipo].conta(TETO[nivel]);
    return { nivel, enunciado: c.enunciado, fala: c.fala, certa: c.certa, opcoes: opcoes(c.certa, c.erradas) };
  }

  // Um pacote: TAMANHO_PACOTE perguntas do mesmo tipo, no mesmo nível.
  function pacote(tipo, nivel) {
    const titulo = TIPOS[tipo].titulo;
    const perguntas = [];
    for (let i = 0; i < TAMANHO_PACOTE; i++) perguntas.push(pergunta(tipo, nivel));
    return { nivel, titulo, fala: 'Pacote de ' + titulo.toLowerCase() + '. Vamos lá!', perguntas };
  }

  // Rodada de 3 pacotes, do fácil ao difícil.
  const sortearRodada = () => [pacote('soma', 1), pacote('subtracao', 2), pacote('dobro', 3)];

  return { sortearRodada, pacote, pergunta, opcoes, TAMANHO_PACOTE };
})();

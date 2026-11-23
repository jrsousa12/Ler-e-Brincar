// Regras do "Trem dos números": sorteia o trem e calcula o certo. Sem tela: só contas (testadas em testes/t_trem.js).
// Nível 1: de 2 em 2. Nível 2: de 5 em 5. Nível 3: de 10 em 10. Nível 4: dois vagões vazios, passo misto.
LB.tremRegras = (function () {
  'use strict';
  const sortearEntre = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  const unico = lista => lista[Math.floor(Math.random() * lista.length)];
  function embaralhar(lista) {
    const c = [...lista];
    for (let i = c.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [c[i], c[j]] = [c[j], c[i]]; }
    return c;
  }
  const VAGOES = 5;
  const TETO = { 2: 30, 5: 100, 10: 200 };          // maior número que aparece em cada passo
  const PARES_VAZIOS = [[0, 2], [0, 3], [0, 4], [1, 3], [1, 4], [2, 4]];   // nunca dois vazios lado a lado

  // Três opções: o certo e dois erros comuns (errou o passo; contou de 1 em 1).
  function opcoes(certa, passo) {
    const erros = [];
    embaralhar([certa + passo, certa - passo, certa + 1, certa - 1]).forEach(v => {
      if (erros.length < 2 && v > 0 && v !== certa && !erros.includes(v)) erros.push(v);
    });
    return embaralhar([certa, ...erros]);
  }

  function trem(nivel, passo, vazios) {
    const inicio = passo * sortearEntre(1, TETO[passo] / passo - (VAGOES - 1));
    const numeros = Array.from({ length: VAGOES }, (_, i) => inicio + i * passo);
    return { nivel, passo, numeros, faltam: vazios.map(pos => ({ pos, certa: numeros[pos], opcoes: opcoes(numeros[pos], passo) })) };
  }

  const nivel1 = () => trem(1, 2, [sortearEntre(0, VAGOES - 1)]);
  const nivel2 = () => trem(2, 5, [sortearEntre(0, VAGOES - 1)]);
  const nivel3 = () => trem(3, 10, [sortearEntre(0, VAGOES - 1)]);
  const nivel4 = passo => trem(4, passo || unico([2, 5, 10]), unico(PARES_VAZIOS));

  // Rodada de 5 trens, do fácil ao difícil: níveis 1, 2, 3 e dois do nível 4 (com passos diferentes).
  function sortearRodada() {
    const [a, b] = embaralhar([2, 5, 10]);
    return [nivel1(), nivel2(), nivel3(), nivel4(a), nivel4(b)];
  }

  return { sortearRodada, nivel1, nivel2, nivel3, nivel4, opcoes };
})();

// Regras da brincadeira "Que horas são?": sorteia os desafios e calcula o certo. Sem tela: só contas (testadas em testes/t_relogio.js).
// Níveis (EF02MA19): 1 hora cheia · 2 meia hora · 3 ponteiros ↔ digital · 4 quanto tempo passou (horas inteiras).
// Desafio: { nivel, enunciado, fala, certa, opcoes (3, com a certa), modo ('texto' | 'relogio' = botões com mini relógio),
//            relogios: [{ h, m, rotulo }] desenhados em cima, dica, explicacao }.
// A hora é sempre escrita "h:mm" (ex.: "3:30"); no nível 4 a resposta é "N hora(s)".
LB.relogioRegras = (function () {
  'use strict';
  const sortearEntre = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  const unico = lista => lista[Math.floor(Math.random() * lista.length)];
  function embaralhar(lista) {
    const c = [...lista];
    for (let i = c.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [c[i], c[j]] = [c[j], c[i]]; }
    return c;
  }
  // Três opções: a certa e as duas primeiras erradas da lista (erros comuns primeiro).
  function opcoes(certa, erradas) {
    const erros = [];
    erradas.forEach(v => { if (erros.length < 2 && v !== certa && !erros.includes(v)) erros.push(v); });
    return embaralhar([certa, ...erros]);
  }

  const hora12 = h => ((h - 1 + 12) % 12) + 1;           // 0 vira 12, 13 vira 1
  const escrever = (h, m) => h + ':' + (m < 10 ? '0' : '') + m;
  const horas = n => n + (n === 1 ? ' hora' : ' horas');

  // Como a criança lê: "3 horas", "3 e meia".
  function dizer(h, m) { return m === 30 ? h + ' e meia' : horas(h); }

  // Erro de quem confunde os ponteiros: lê o grande como hora e o pequeno como minutos (de 5 em 5).
  function trocada(h, m) {
    return escrever(m === 30 ? 6 : 12, (h % 12) * 5);   // hora lida no ponteiro grande; minutos, no pequeno
  }

  // Erradas de um horário: ponteiros trocados, uma hora a mais, uma hora a menos.
  function erradasDe(h, m) {
    const mais = escrever(hora12(h + 1), m), menos = escrever(hora12(h - 1), m);
    return embaralhar([trocada(h, m), unico([mais, menos])]).concat([mais, menos]);
  }

  // Níveis 1 a 3: horários.
  function horario(nivel) {
    const h = sortearEntre(1, 12);
    const m = nivel === 1 ? 0 : nivel === 2 ? 30 : unico([0, 30]);
    const certa = escrever(h, m);
    const texto = dizer(h, m);
    const base = { nivel, certa, explicacao: 'São ' + texto + '.',
      dica: m === 30 ? 'Meia hora: o ponteiro grande aponta para baixo, no 6.' : 'Hora cheia: o ponteiro grande aponta para cima, no 12.' };
    const ponteiros = nivel === 3 && Math.random() < 0.5;   // nível 3: às vezes mostra o digital e pede o relógio
    if (!ponteiros) {
      return { ...base, enunciado: 'Que horas são?', fala: 'Que horas são? O ponteiro pequeno mostra a hora.', modo: 'texto',
        relogios: [{ h, m }], opcoes: opcoes(certa, erradasDe(h, m)) };
    }
    return { ...base, enunciado: 'Qual relógio mostra ' + certa + '?', fala: 'Qual relógio mostra ' + texto + '?', modo: 'relogio',
      relogios: [], opcoes: opcoes(certa, erradasDe(h, m)) };
  }

  // Nível 4: do relógio do começo ao do fim, quantas horas passaram.
  function duracao() {
    const inicio = sortearEntre(1, 8), passou = sortearEntre(1, 4), fim = inicio + passou;
    const certa = horas(passou);
    return { nivel: 4, certa, modo: 'texto', explicacao: 'Passaram ' + certa + '.', dica: 'Conte as horas, de uma em uma, do primeiro relógio ao segundo.',
      enunciado: 'Quantas horas passaram?', relogios: [{ h: inicio, m: 0, rotulo: 'Começou' }, { h: fim, m: 0, rotulo: 'Terminou' }],
      fala: 'Começou às ' + horas(inicio) + ' e terminou às ' + horas(fim) + '. Quantas horas passaram?',
      opcoes: opcoes(certa, embaralhar([horas(passou + 1), horas(passou - 1 || passou + 2), horas(passou + 2)])) };
  }

  const desafio = nivel => nivel === 4 ? duracao() : horario(nivel);

  // Rodada de 5 desafios, do fácil ao difícil.
  const sortearRodada = () => [1, 2, 3, 4, 4].map(desafio);

  return { sortearRodada, desafio, opcoes, escrever, dizer, trocada };
})();

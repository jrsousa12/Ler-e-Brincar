// Regras da brincadeira "Régua": sorteia os desafios e calcula o certo. Sem tela: só contas (testadas em testes/t_regua.js).
// Níveis (EF02MA16): 1 objeto no zero, até 8 cm · 2 objeto no zero, até 15 cm · 3 objeto fora do zero (fim − começo) · 4 qual é o mais comprido.
// Desafio: { nivel, enunciado, fala, certa, opcoes (3, com a certa), objetos: [{ nome, inicio, fim, cor }], regua (cm da régua), guias, dica, explicacao }.
// As respostas dos níveis 1 a 3 são escritas "N cm"; no nível 4 a resposta é o nome ("O lápis").
LB.reguaRegras = (function () {
  'use strict';
  const sortearEntre = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
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

  const OBJETOS = [
    { nome: 'lápis', art: 'o', cor: '#ffd54f' }, { nome: 'borracha', art: 'a', cor: '#f48fb1' },
    { nome: 'clipe', art: 'o', cor: '#b0bec5' }, { nome: 'canetinha', art: 'a', cor: '#81d4fa' },
    { nome: 'palito', art: 'o', cor: '#ffcc80' }, { nome: 'giz', art: 'o', cor: '#e1bee7' },
    { nome: 'fita', art: 'a', cor: '#a5d6a7' }, { nome: 'folha', art: 'a', cor: '#c5e1a5' }
  ];
  const sortearObjetos = n => embaralhar(OBJETOS).slice(0, n);
  const cm = n => n + ' cm';
  const com = o => o.art + ' ' + o.nome;                       // "o lápis"
  const maiuscula = t => t.charAt(0).toUpperCase() + t.slice(1);

  // Níveis 1 a 3: quantos centímetros tem o objeto.
  function medir(nivel) {
    const [o] = sortearObjetos(1);
    const inicio = nivel === 3 ? sortearEntre(1, 5) : 0;
    const comp = nivel === 1 ? sortearEntre(1, 8) : nivel === 2 ? sortearEntre(6, 15) : sortearEntre(2, 8);
    const fim = inicio + comp, certa = cm(comp);
    const erradas = (nivel === 3 ? [cm(fim), cm(comp + 1), cm(comp - 1)] : [cm(comp + 1), cm(comp - 1), cm(comp + 2)]).filter(v => parseInt(v) > 0);
    return { nivel, certa, objetos: [{ nome: o.nome, inicio, fim, cor: o.cor }], regua: nivel === 1 ? 10 : 15, guias: nivel === 1,
      enunciado: 'Quantos centímetros tem ' + com(o) + '?', fala: 'Quantos centímetros tem ' + com(o) + '?',
      dica: nivel === 3 ? 'Não começa no zero! Veja onde começa e onde termina e conte os centímetros.' : 'Comece no zero e veja em que número termina.',
      explicacao: nivel === 3 ? 'Começa no ' + inicio + ' e termina no ' + fim + ': ' + fim + ' − ' + inicio + ' = ' + certa + '.' : maiuscula(com(o)) + ' tem ' + certa + '.',
      opcoes: opcoes(certa, erradas) };
  }

  // Nível 4: três objetos, todos no zero, comprimentos diferentes; qual chega mais longe.
  function comparar() {
    const objs = sortearObjetos(3), comps = [];
    while (comps.length < 3) { const c = sortearEntre(2, 14); if (!comps.includes(c)) comps.push(c); }
    const objetos = objs.map((o, i) => ({ nome: o.nome, inicio: 0, fim: comps[i], cor: o.cor }));
    const mais = comps.indexOf(Math.max(...comps));
    const nomes = objs.map(o => maiuscula(com(o))), certa = nomes[mais];
    return { nivel: 4, certa, objetos, regua: 15, guias: false,
      enunciado: 'Qual é o mais comprido?', fala: 'Olhe a régua. Qual é o mais comprido?',
      dica: 'O mais comprido é o que chega mais longe na régua.',
      explicacao: certa + ' tem ' + cm(comps[mais]) + ': é o mais comprido.',
      opcoes: embaralhar(nomes) };
  }

  const desafio = nivel => nivel === 4 ? comparar() : medir(nivel);

  // Rodada de 5 desafios, do fácil ao difícil.
  const sortearRodada = () => [1, 2, 3, 4, 4].map(desafio);

  return { sortearRodada, desafio, opcoes, cm };
})();

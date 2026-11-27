// Regras da brincadeira "Formas": sorteia os desafios e calcula o certo. Sem tela: só contas (testadas em testes/t_formas.js).
// Níveis (EF02MA15): 1 toque na forma (todas retas, mesmo tamanho) · 2 toque na forma (girada e de tamanhos diferentes)
// · 3 que forma é esta? · 4 quantos lados tem? (só quadrado, retângulo e triângulo).
// Desafio: { nivel, enunciado, fala, certa, opcoes (3, com a certa), figura (forma grande, níveis 3 e 4) ou figuras { opção: desenho } (níveis 1 e 2), dica, explicacao }.
LB.formasRegras = (function () {
  'use strict';
  const unico = lista => lista[Math.floor(Math.random() * lista.length)];
  function embaralhar(lista) {
    const c = [...lista];
    for (let i = c.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [c[i], c[j]] = [c[j], c[i]]; }
    return c;
  }
  const FORMAS = ['círculo', 'quadrado', 'retângulo', 'triângulo'];
  const LADOS = { 'círculo': 0, 'quadrado': 4, 'retângulo': 4, 'triângulo': 3 };
  // Giros que continuam parecendo a mesma forma (o quadrado girado demais viraria "losango").
  const GIROS = { 'círculo': [0], 'quadrado': [0, 12, -12], 'retângulo': [0, 90, 14, -14], 'triângulo': [0, 90, 180, 270, 20, -20] };
  const CORES = ['#ef5350', '#42a5f5', '#66bb6a', '#ffca28', '#ab47bc', '#ff7043'];
  const SOBRE = {
    'círculo': 'O círculo é redondo: não tem lados nem pontas.',
    'quadrado': 'O quadrado tem 4 lados do mesmo tamanho.',
    'retângulo': 'O retângulo tem 4 lados: dois compridos e dois curtos.',
    'triângulo': 'O triângulo tem 3 lados e 3 pontas.'
  };
  const DICA = {
    'círculo': 'O círculo é redondo, sem pontas.',
    'quadrado': 'O quadrado tem 4 lados iguais.',
    'retângulo': 'O retângulo é esticado: dois lados compridos e dois curtos.',
    'triângulo': 'O triângulo tem 3 pontas.'
  };
  const lado = n => n + ' lados';

  const desenhar = (forma, cor, nivel) => ({ forma, cor,
    tam: nivel === 1 ? 1 : 0.62 + Math.floor(Math.random() * 5) * 0.09, giro: nivel === 1 ? 0 : unico(GIROS[forma]) });

  // Níveis 1 e 2: três formas diferentes para tocar na pedida.
  function tocar(nivel) {
    const tres = embaralhar(FORMAS).slice(0, 3), certa = unico(tres), cores = embaralhar(CORES);
    const figuras = {};
    tres.forEach((f, i) => { figuras[f] = desenhar(f, cores[i], nivel); });
    return { nivel, certa, opcoes: tres, figuras,
      enunciado: 'Toque no ' + certa + '.', fala: 'Toque no ' + certa + '.',
      dica: DICA[certa], explicacao: SOBRE[certa] };
  }

  // Nível 3: uma forma grande, qual é o nome.
  function nomear() {
    const certa = unico(FORMAS), outras = embaralhar(FORMAS.filter(f => f !== certa)).slice(0, 2);
    return { nivel: 3, certa, opcoes: embaralhar([certa, ...outras]), figura: desenhar(certa, unico(CORES), 3),
      enunciado: 'Que forma é esta?', fala: 'Que forma é esta?', dica: DICA[certa], explicacao: SOBRE[certa] };
  }

  // Nível 4: quantos lados tem (opções sempre 3, 4 e 5).
  function contarLados() {
    const forma = unico(['quadrado', 'retângulo', 'triângulo']), n = LADOS[forma];
    return { nivel: 4, certa: lado(n), opcoes: [lado(3), lado(4), lado(5)], figura: desenhar(forma, unico(CORES), 4),
      enunciado: 'Quantos lados tem?', fala: 'Quantos lados tem esta forma?',
      dica: 'Conte os lados, um por um, sem pular nenhum.', explicacao: SOBRE[forma] };
  }

  const desafio = nivel => nivel <= 2 ? tocar(nivel) : nivel === 3 ? nomear() : contarLados();

  // Rodada de 5 desafios, do fácil ao difícil.
  const sortearRodada = () => [1, 2, 3, 4, 4].map(desafio);

  return { sortearRodada, desafio, FORMAS, LADOS };
})();

// Evolução no tempo: só contas, a partir das respostas guardadas (js/tentativas.js).
// Semana = segunda a domingo. Só a 1ª tentativa de cada pergunta conta para o acerto.
(function () {
  'use strict';
  const MATERIAS = ['lingua-portuguesa', 'matematica'];
  const MIN_PERGUNTAS = 5;   // habilidade com menos que isso não entra na comparação
  const DIFERENCA = 15;      // pontos de diferença para dizer que melhorou/piorou

  function inicioSemana(d) {
    const x = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    x.setDate(x.getDate() - ((x.getDay() + 6) % 7));
    return x;
  }
  const chaveDia = d => d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
  const taxa = (certas, total) => total ? Math.round(certas / total * 100) : null;

  // Últimas `n` semanas (a mais antiga primeiro; a última é a semana de `hoje`).
  function semanas(registros, hoje, n) {
    const fim = inicioSemana(hoje);
    const lista = [];
    for (let i = n - 1; i >= 0; i--) {
      const ini = new Date(fim.getFullYear(), fim.getMonth(), fim.getDate() - 7 * i);
      lista.push({ inicio: ini, dias: new Set(), mat: {}, ultima: i === 0 });
      for (const m of MATERIAS) lista[lista.length - 1].mat[m] = { perguntas: 0, certas: 0 };
    }
    for (const r of registros) {
      const d = new Date(r.data);
      if (isNaN(d)) continue;
      const s = lista[Math.round((inicioSemana(d) - lista[0].inicio) / 604800000)];
      if (!s) continue;
      s.dias.add(chaveDia(d));
      if (r.tentativa === 1 && s.mat[r.materia]) {
        s.mat[r.materia].perguntas++;
        if (r.acertou) s.mat[r.materia].certas++;
      }
    }
    return lista.map(s => ({
      inicio: s.inicio, ultima: s.ultima, dias: s.dias.size,
      rotulo: s.inicio.getDate() + '/' + (s.inicio.getMonth() + 1),
      mat: Object.fromEntries(MATERIAS.map(m =>
        [m, { perguntas: s.mat[m].perguntas, taxa: taxa(s.mat[m].certas, s.mat[m].perguntas) }]))
    }));
  }

  // "de 55% para 72%" entre a 1ª e a última semana com respostas (null se houver só uma).
  function resumo(lista, materia) {
    const com = lista.filter(s => s.mat[materia].taxa !== null);
    if (com.length < 2) return null;
    return { de: com[0].mat[materia].taxa, para: com[com.length - 1].mat[materia].taxa };
  }

  // Compara as 2 últimas semanas com as 2 anteriores, por habilidade.
  function habilidades(registros, hoje) {
    const fim = inicioSemana(hoje);
    const dia = 86400000, ini1 = fim.getTime() - 7 * dia, ini2 = fim.getTime() - 21 * dia;
    const g = {};
    for (const r of registros) {
      if (r.tentativa !== 1) continue;
      const t = new Date(r.data).getTime();
      const periodo = t >= ini1 ? 'novo' : t >= ini2 ? 'velho' : null;
      if (!periodo) continue;
      const h = g[r.habilidade] || (g[r.habilidade] = { habilidade: r.habilidade, novo: [0, 0], velho: [0, 0] });
      h[periodo][1]++;
      if (r.acertou) h[periodo][0]++;
    }
    const mudou = Object.values(g)
      .filter(h => h.novo[1] >= MIN_PERGUNTAS && h.velho[1] >= MIN_PERGUNTAS)
      .map(h => ({ habilidade: h.habilidade, antes: taxa(...h.velho), agora: taxa(...h.novo) }))
      .map(h => ({ ...h, dif: h.agora - h.antes }));
    return {
      melhoraram: mudou.filter(h => h.dif >= DIFERENCA).sort((a, b) => b.dif - a.dif).slice(0, 3),
      pioraram: mudou.filter(h => h.dif <= -DIFERENCA).sort((a, b) => a.dif - b.dif).slice(0, 3)
    };
  }

  LB.evolucao = { semanas, resumo, habilidades, MATERIAS };
})();

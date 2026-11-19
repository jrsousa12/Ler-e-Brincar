// Missão do dia: 1 história + 3 de Português + 3 de Matemática + 1 desenho, em sequência.
// A escolha muda a cada dia (sorteio pela data) e prefere o que a criança ainda não fez.
// Português e Matemática: 1 (ou 2) do caderno de erros + novas puxando as habilidades fracas (js/caderno.js).
LB.usarMissao = function (ctx) {
  'use strict';
  const { computed } = Vue;
  const C = LB.CONTEUDO;
  const ROTULOS = {
    historia: ['📖', 'Ler uma história'], lp: ['📝', 'Português'],
    mat: ['🧮', 'Matemática'], colorir: ['🎨', 'Pintar um desenho']
  };
  const REVISAO = { lp: ['🔁', 'Revisão de Português'], mat: ['🔁', 'Revisão de Matemática'] };

  const dataDe = d => d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  const hoje = () => dataDe(new Date());

  function sorteador(semente) {
    let s = 7;
    for (const ch of semente) s = (s * 31 + ch.charCodeAt(0)) >>> 0;
    return () => { s = (s * 1103515245 + 12345) >>> 0; return s / 4294967296; };
  }

  // Sorteia n itens entre os mais fáceis ainda não feitos (se acabarem, entre todos).
  function escolher(lista, n, rnd) {
    const novos = lista.filter(x => !ctx.concluidos.value[x.id]);
    const base = novos.length >= n ? novos : lista;
    const fila = [...base].sort((a, b) => (a.nivel || 1) - (b.nivel || 1)).slice(0, n * 4);
    const saida = [];
    while (saida.length < n && fila.length) saida.push(fila.splice(Math.floor(rnd() * fila.length), 1)[0]);
    return saida;
  }

  // Atividades novas: nível mais fácil (ou o seguinte), sorteio com peso maior para habilidade fraca.
  function escolherFracas(lista, n, rnd, fora) {
    let resto = lista.filter(x => !fora.has(x.id) && !ctx.concluidos.value[x.id]);
    if (resto.length < n) resto = lista.filter(x => !fora.has(x.id));
    const minimo = Math.min(...resto.map(x => x.nivel || 1));
    const saida = [];
    while (saida.length < n && resto.length) {
      let base = resto.filter(x => (x.nivel || 1) <= minimo + 1);
      if (!base.length) base = resto;
      const pesos = base.map(x => LB.caderno.peso(ctx.caderno.value, x.habilidadeBNCC) * ((x.nivel || 1) === minimo ? 2 : 1));
      let r = rnd() * pesos.reduce((a, b) => a + b, 0), k = 0;
      while (k < base.length - 1 && (r -= pesos[k]) > 0) k++;
      saida.push(base[k]);
      resto = resto.filter(x => x !== base[k]);
    }
    return saida;
  }

  // 3 passos de uma matéria: nova, revisão(ões) do caderno, novas.
  function passosDaMateria(tipo, materia, rnd) {
    const lista = C.activities.filter(a => a.materia === materia);
    const ids = LB.caderno.paraRevisar(ctx.caderno.value, materia).filter(id => lista.some(a => a.id === id));
    const rev = ids.slice(0, ids.length >= 4 ? 2 : 1);
    const novas = escolherFracas(lista, 3 - rev.length, rnd, new Set(rev));
    const passos = novas.map(a => ({ tipo, id: a.id }));
    passos.splice(Math.min(1, passos.length), 0, ...rev.map(id => ({ tipo, id, revisao: true })));
    return passos;
  }

  function montar(data) {
    const rnd = sorteador(data);
    const lp = passosDaMateria('lp', 'lingua-portuguesa', rnd);
    const mat = passosDaMateria('mat', 'matematica', rnd);
    const passos = [{ tipo: 'historia', id: escolher(C.stories, 1, rnd)[0].id }];
    for (let i = 0; i < 3; i++) passos.push(lp[i], mat[i]);
    passos.push({ tipo: 'colorir', id: escolher(C.colorir, 1, rnd)[0].id });
    return { data, passos, feitos: passos.map(() => false), premiada: false };
  }

  function garantir() {
    if (!ctx.missao.value || ctx.missao.value.data !== hoje()) ctx.missao.value = montar(hoje());
  }

  const buscar = p => p.tipo === 'historia' ? C.stories.find(x => x.id === p.id)
    : p.tipo === 'colorir' ? C.colorir.find(x => x.id === p.id)
      : C.activities.find(x => x.id === p.id);

  const passosMissao = computed(() => {
    const m = ctx.missao.value;
    if (!m) return [];
    return m.passos.map((p, i) => {
      const [emoji, rotulo] = (p.revisao && REVISAO[p.tipo]) || ROTULOS[p.tipo];
      return { ...p, item: buscar(p), feito: m.feitos[i], emoji, rotulo };
    });
  });
  const passosFeitos = computed(() => passosMissao.value.filter(p => p.feito).length);
  const missaoCompleta = computed(() => passosMissao.value.length > 0 && passosFeitos.value === passosMissao.value.length);
  const proximoPasso = computed(() => passosMissao.value.findIndex(p => !p.feito));

  // Dias seguidos com missão completa (contando até hoje ou ontem).
  const diasSeguidos = computed(() => {
    const dias = new Set(ctx.diasMissao.value);
    const d = new Date();
    if (!dias.has(dataDe(d))) d.setDate(d.getDate() - 1);
    let n = 0;
    while (dias.has(dataDe(d))) { n++; d.setDate(d.getDate() - 1); }
    return n;
  });

  function abrirMissao() {
    garantir();
    ctx.irPara('missao');
    ctx.falarSozinho(missaoCompleta.value ? 'Missão completa! Volte amanhã.' : 'Missão do dia. Vamos lá!');
  }

  function fazerPasso(i) {
    const p = passosMissao.value[i];
    if (!p || !p.item) return;
    if (p.tipo === 'historia') ctx.abrir.historia(p.item);
    else if (p.tipo === 'colorir') ctx.abrir.colorir(p.item);
    else ctx.abrir.atividade(p.item);
    ctx.passoAtivo.value = i;
  }

  function marcarPasso(i) {
    const m = ctx.missao.value;
    if (!m || m.feitos[i]) return;
    const feitos = [...m.feitos];
    feitos[i] = true;
    ctx.missao.value = { ...m, feitos };
    if (feitos.every(Boolean) && !m.premiada) {
      ctx.missao.value.premiada = true;
      ctx.estrelas.value += 3;
      if (!ctx.diasMissao.value.includes(m.data)) ctx.diasMissao.value = [...ctx.diasMissao.value, m.data];
      setTimeout(() => LB.festa.grande(ctx.ajustes.value.som !== false), 300);
    }
  }

  return {
    garantir, marcarPasso, diasSeguidos,
    publico: { passosMissao, passosFeitos, missaoCompleta, proximoPasso, abrirMissao, fazerPasso }
  };
};

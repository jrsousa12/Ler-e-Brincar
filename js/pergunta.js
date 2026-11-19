// Regra de responder (histórias e atividades): acertou → festa; errou → incentivo e nova
// tentativa (a opção errada fica apagada); no 2º erro mostra a certa com a explicação.
// info() devolve { item, id, materia, habilidade, titulo, aoAcertar, aoPrimeira(deprimeira) } (aoPrimeira: uma vez, com o resultado da 1ª tentativa).
LB.criarResposta = function (ctx, info) {
  'use strict';
  const r = Vue.reactive({ erradas: [], terminou: false, acertou: false, mensagem: '' });
  const comSom = () => ctx.ajustes.value.som !== false;

  r.zerar = () => { r.erradas = []; r.terminou = false; r.acertou = false; r.mensagem = ''; };

  r.responder = (i) => {
    if (r.terminou || r.erradas.includes(i)) return;
    const d = info();
    const certa = LB.respostas.ehCorreta(d.item, i);
    LB.tentativas.registrar({
      id: d.id, materia: d.materia, habilidade: d.habilidade, titulo: d.titulo,
      acertou: certa, tentativa: r.erradas.length + 1
    });
    if (certa) {
      r.acertou = true;
      r.terminou = true;
      r.mensagem = LB.festa.elogio();
      LB.festa.acerto(comSom());
      ctx.estrelas.value++;
      if (d.aoAcertar) d.aoAcertar();
      if (r.erradas.length === 0 && d.aoPrimeira) d.aoPrimeira(true);
    } else {
      r.erradas.push(i);
      LB.festa.erro(comSom());
      r.terminou = r.erradas.length >= 2;
      if (r.erradas.length === 1 && d.aoPrimeira) d.aoPrimeira(false);
      r.mensagem = r.terminou ? 'Vamos ver juntos a resposta:' : LB.festa.incentivo();
    }
    ctx.falarSozinho(r.mensagem + (r.terminou && !r.acertou ? ' ' + d.item.explicacao : ''));
  };

  r.classe = (i) => {
    if (r.erradas.includes(i)) return 'errada';
    if (r.terminou && LB.respostas.ehCorreta(info().item, i)) return 'correta';
    return '';
  };
  r.bloqueada = (i) => r.terminou || r.erradas.includes(i);
  return r;
};

// Teste guardado: kit de rodada (js/rodada.js), sem navegador. Uso: node testes/t_rodada.js
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const raiz = path.join(__dirname, '..');

let falhas = 0;
const ok = (cond, msg) => { if (!cond) { falhas++; console.log('FALHA: ' + msg); } };

// Ambiente mínimo: Vue de verdade (vendor/) e festa/voz de mentira que só anotam.
const anotado = { festa: [], voz: [] };
const caixa = { window: { scrollTo() {} }, console };
caixa.LB = { festa: { erro: () => anotado.festa.push('erro'), acerto: () => anotado.festa.push('acerto') }, voz: { falar: t => anotado.voz.push(t) } };
vm.createContext(caixa);
vm.runInContext(fs.readFileSync(path.join(raiz, 'vendor/vue.global.prod.js'), 'utf8') + ';this.Vue = Vue;', caixa);
vm.runInContext(fs.readFileSync(path.join(raiz, 'js/rodada.js'), 'utf8'), caixa);
const { ref } = caixa.Vue;
caixa.LB.materiaDe = { teste: 'matematica' };   // onde fica a brincadeira (js/telas/materias.js)

const ctx = { tela: ref('atividades'), estrelas: ref(0), ajustes: ref({ som: true }), concluidos: {}, falados: [], terminou: null };
ctx.falarSozinho = t => ctx.falados.push(t);
ctx.marcarConcluido = id => { ctx.concluidos[id] = true; };
ctx.terminarItem = padrao => { ctx.terminou = padrao; };

// Rodada de 3 desafios: o do meio tem 2 perguntas.
const desafios = [
  { nome: 'a', certa: 1 },
  { nome: 'b', perguntas: [{ certa: 2 }, { certa: 3 }] },
  { nome: 'c', certa: 4 }
];
const r = caixa.LB.rodada(ctx, {
  id: 'teste',
  sortear: () => desafios,
  etapas: d => d.perguntas,
  frase: d => 'Desafio ' + d.nome,
  aoCarregar: d => { ctx.carregado = d.nome; },
  textos: { erro: v => 'Não foi ' + v, acerto: (q, d, final) => [final ? 'Fim ' + q.certa : 'Meio ' + q.certa, 'Falei ' + q.certa] }
});

r.abrir();
ok(ctx.tela.value === 'teste' && r.indice.value === 0 && r.atual.value.nome === 'a', 'abrir: vai para a tela e começa no 1º');
ok(ctx.falados[0] === 'Desafio a' && ctx.carregado === 'a', 'abrir: lê a frase e chama aoCarregar');
ok(r.pergunta.value.nome === 'a', 'sem etapas: a pergunta é o próprio desafio');

r.escolher(9);
ok(r.estado.value === 'tentar-novamente' && r.mensagem.value === 'Não foi 9' && ctx.estrelas.value === 0, 'erro: tenta de novo, sem estrela');
ok(anotado.festa.pop() === 'erro', 'erro: som de erro');
r.escolher(1);
ok(r.estado.value === 'correto' && r.mensagem.value === 'Fim 1' && ctx.estrelas.value === 1, 'acerto final: 1 estrela');
ok(anotado.voz.pop() === 'Falei 1' && anotado.festa.pop() === 'acerto', 'acerto: voz e festa');
r.escolher(9);
ok(r.estado.value === 'correto', 'depois do acerto, novo toque não muda nada');
ok(!r.ultimo.value, 'ainda não é o último');

r.seguir();
ok(r.atual.value.nome === 'b' && r.etapa.value === 0 && r.estado.value === '' && r.escolha.value === null, 'seguir: próximo desafio limpo');
r.escolher(2);
ok(r.mensagem.value === 'Meio 2' && ctx.estrelas.value === 1, '1ª pergunta de 2: sem estrela');
r.seguir();
ok(r.atual.value.nome === 'b' && r.etapa.value === 1 && r.pergunta.value.certa === 3, 'seguir: 2ª pergunta do mesmo desafio');
r.escolher(3);
ok(ctx.estrelas.value === 2, '2ª pergunta de 2: estrela');

r.seguir();
r.acertou('Manual', '');
ok(ctx.estrelas.value === 3 && r.estado.value === 'correto', 'acertou() manual (ex.: bandeja do Mercadinho) dá estrela');
ok(r.ultimo.value, 'último desafio reconhecido');
r.seguir();
ok(r.atual.value.nome === 'c', 'seguir no último não passa do fim');
r.concluir();
ok(ctx.concluidos.teste === true && ctx.terminou === 'matematica', 'concluir marca feito e volta para a matéria');

const nomes = Object.keys(r.exportar('Teste'));
['abrirTeste', 'escolherTeste', 'seguirTeste', 'concluirTeste', 'perguntaTeste', 'estadoTeste', 'ultimoTeste', 'indiceTeste', 'listaTeste']
  .forEach(n => ok(nomes.includes(n), 'exportar tem ' + n));

// Rodada sem conteúdo não abre a tela.
ctx.tela.value = 'atividades';
caixa.LB.rodada(ctx, { id: 'vazia', sortear: () => [], textos: {} }).abrir();
ok(ctx.tela.value === 'atividades', 'rodada vazia não abre a tela');

// Embaralhar: mesma lista em outra ordem, sem mexer na original.
const original = [1, 2, 3, 4, 5, 6];
const mist = caixa.LB.rodada.embaralhar(original);
ok(mist !== original && original.join() === '1,2,3,4,5,6' && [...mist].sort().join() === '1,2,3,4,5,6', 'embaralhar copia e mantém os itens');

console.log(falhas ? `t_rodada: ${falhas} falha(s)` : 't_rodada: OK');
process.exit(falhas ? 1 : 0);

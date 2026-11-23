// Teste guardado: gerador da Ordem dos Fatos (build/gerar-ordem.js). Uso: node testes/t_gerar_ordem.js
// Trabalha numa CÓPIA do conteúdo; o conteudo/ real não é tocado.
'use strict';
const path = require('path');
const g = require(path.join(__dirname, '../build/gerar-ordem.js'));
const copia = require('./_gerador');
let falhas = 0;
const ok = (cond, msg) => { if (!cond) { falhas++; console.log('FALHA: ' + msg); } };
const recusa = l => { try { g.montar(l); return ''; } catch (e) { return e.message; } };

const s = g.montar('Plantando feijão | colocou algodão no copo | Pôs o feijão e molhou. | Viu o broto nascer! | enunciado=Ordene o plantio');
ok(s.frases.join(' ') === 'Colocou algodão no copo. Pôs o feijão e molhou. Viu o broto nascer!', 'fatos na ordem, com maiúscula e ponto');
ok(s.enunciado === 'Ordene o plantio:', 'enunciado dado termina com dois-pontos');
ok(g.montar('Lanche da tarde | a | b | c').enunciado.endsWith(':'), 'sem enunciado usa o da ficha');
ok(g.montar('Uma rotina | Fez uma coisa bem comprida que tem muitas e muitas palavras demais para ler no botão | b | c')._avisos.length === 1, 'aviso de fato longo');
ok(recusa('Só dois | a | b').includes('3'), 'recusa com 2 fatos');
ok(recusa('Repetido | a | A | b').includes('repetidos'), 'recusa fatos repetidos');

const c = copia('build/gerar-ordem.js');
const ped = c.pedido('# teste\nPlantando feijão | Colocou algodão no copo | Pôs o feijão | Viu o broto\nLavando a bicicleta | Molhou a bicicleta | Passou sabão | Enxaguou e secou\n');
const antes = c.ler('ordem.js');
ok(c.rodar([ped]).cod === 0 && c.ler('ordem.js') === antes, 'sem --gravar não muda nada');
const r = c.rodar([ped, '--gravar']);
ok(r.cod === 0 && r.saida.includes('2 atividade(s)'), 'grava 2 sequências: ' + r.saida.trim().split('\n').pop());
const depois = c.ler('ordem.js');
ok(depois.startsWith(antes.slice(0, antes.lastIndexOf('}') + 1)) && depois.includes("id:'ord-51'"), 'continua do último id sem mexer no lote 1');
ok(c.validar().saida.includes('OK'), 'validador aceita o que foi gravado');
ok(c.rodar([ped, '--gravar']).cod === 1, 'gravar de novo recusa (título repetido)');
c.apagar();

console.log(falhas ? `t_gerar_ordem: ${falhas} falha(s)` : 't_gerar_ordem: OK');
process.exit(falhas ? 1 : 0);

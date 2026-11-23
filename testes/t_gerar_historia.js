// Teste guardado: gerador de histórias (build/gerar-historia.js). Uso: node testes/t_gerar_historia.js
// Trabalha numa CÓPIA do conteúdo; o conteudo/ real não é tocado.
'use strict';
const path = require('path');
const g = require(path.join(__dirname, '../build/gerar-historia.js'));
const copia = require('./_gerador');
let falhas = 0;
const ok = (cond, msg) => { if (!cond) { falhas++; console.log('FALHA: ' + msg); } };

const HIST = `= O bolo da vovó | 🎂 | nivel=3
Vovó Rosa fez um bolo de fubá. A cozinha ficou cheirosa.
Pedro ajudou a untar a forma. Depois, lavou as colheres.
O bolo saiu quentinho. Todos comeram no lanche.
? Que bolo a vovó fez? | Chocolate | *Fubá | Cenoura | O texto diz que era de fubá.
? O que Pedro lavou? | *As colheres | O chão | O carro | Ele lavou as colheres.
! Por que a cozinha ficou cheirosa? | *Por causa do bolo assando | Por causa do sabão | Porque choveu | O cheiro veio do bolo.`;
const linhas = HIST.split('\n');
const h = g.montar(linhas);
ok(h.texto.length === 6 && h.texto[1] === 'A cozinha ficou cheirosa.', 'parágrafos viram frases');
ok(h.perguntas[0].correta === 1 && h.perguntas[2].tipo === 'inferencia', '* marca a certa; ! é inferência');
ok(h.nivel === 3 && h.anoEscolar === 3 && h.autor === 'Domínio público' && h.habilidadesBNCC.length === 2, 'padrões da ficha');
const recusa = l => { try { g.montar(l); return ''; } catch (e) { return e.message; } };
ok(recusa(linhas.slice(0, 6)).includes('perguntas'), 'recusa com 2 perguntas');
ok(recusa([linhas[0], linhas[1], ...linhas.slice(4)]).includes('frases'), 'recusa com poucas frases');
ok(recusa([linhas[0], ...linhas.slice(1, 4), '? Sem certa | A | B | C | x', ...linhas.slice(5)]).includes('*'), 'recusa pergunta sem *');

const c = copia('build/gerar-historia.js');
const ped = c.pedido('# teste\n' + HIST + '\n');
const antes = c.ler('historias.js');
ok(c.rodar([ped]).cod === 0 && c.ler('historias.js') === antes, 'sem --gravar não muda nada');
const r = c.rodar([ped, '--gravar']);
ok(r.cod === 0 && r.saida.includes('1 atividade(s)'), 'grava 1 história: ' + r.saida.trim().split('\n').pop());
ok(c.validar().saida.includes('OK'), 'validador aceita o que foi gravado');
ok(c.rodar([ped, '--gravar']).cod === 1, 'gravar de novo recusa (título repetido)');
c.apagar();

console.log(falhas ? `t_gerar_historia: ${falhas} falha(s)` : 't_gerar_historia: OK');
process.exit(falhas ? 1 : 0);

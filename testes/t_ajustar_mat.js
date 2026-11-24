// Teste guardado: ajuste de Matemática (build/ajustar-mat.js e build/ajustar-mat-regras.js).
// Uso: node testes/t_ajustar_mat.js. Ponta a ponta numa CÓPIA do conteúdo; o conteudo/ real não é tocado.
'use strict';
const path = require('path');
const { execFileSync } = require('child_process');
const R = require('../build/ajustar-mat-regras');
const g = require('../build/gerar-mat');
const copia = require('./_gerador');
let falhas = 0;
const ok = (cond, msg) => { if (!cond) { falhas++; console.log('FALHA: ' + msg); } };

// 1. Regras: conta achada, problemas, sugestão
const soma = { tipo: 'operacao', enunciado: 'Quanto é 6 + 3?', opcoes: [8, 9, 10], correta: 9, explicacao: '6 + 3 = 9.' };
ok(JSON.stringify(R.contaDe(soma)) === '{"a":6,"op":"+","b":3,"r":9}', 'acha a conta na explicação');
ok(R.contaDe({ ...soma, opcoes: [10, 15, 20], correta: 15, enunciado: 'Cada pacote tem 5. Quantas em 3?', explicacao: '5 + 5 + 5 = 15 (ou 3 × 5).' }).op === '×', 'pula "5 + 5" de uma soma maior e acha 3 × 5');
ok(/certa no meio/.test(R.motivos(soma).join()), 'acha certa no meio (8, 9, 10)');
ok(/não é erro típico/.test(R.motivos({ ...soma, opcoes: [9, 10, 30] }).join()), 'acha errada que não é erro de criança');
ok(R.motivos({ ...soma, opcoes: [3, 9, 10] }).length === 0, 'erros típicos e não simétricos passam');
const sug = R.sugerir(soma);
ok(sug.length === 2 && !R.simetrica(9, sug.map(x => x.valor)) && sug.every(x => x.tipo !== '?'), 'sugestão da conta: 2 erradas com tipo e não simétricas');
const esc = { tipo: 'multipla', enunciado: 'Quantas unidades tem 2 dezenas?', opcoes: ['2', '10', '20'], correta: '20', explicacao: '2 dezenas = 20.' };
ok(R.certaDe(esc) === '20' && /longe/.test(R.motivos(esc).join()), 'escolha com certa em texto: acha errada longe');
ok(R.motivos(esc, ['trocou_ideia', 'dez_a_menos']).length === 0, 'tipos já conferidos no registro: não pergunta de novo');
ok(/não diz a certa/.test(R.motivos({ ...esc, explicacao: 'Conte as dezenas.' }).join()), 'explicação sem a certa');

// 2. Conferir a reescrita
const nova = (opcoes, tipos, correta = 0) => ({ opcoes, correta, tipos });
ok(R.conferir(soma, nova(['9', '10', '3'], ['um_a_mais', 'trocou_por_subtracao'])).length === 0, 'reescrita boa passa');
ok(/a certa mudou/.test(R.conferir(soma, nova(['8', '10', '3'], ['um_a_mais', 'trocou_por_subtracao'])).join()), 'não deixa mudar a certa');
ok(/não é \{um_a_mais\}/.test(R.conferir(soma, nova(['9', '11', '3'], ['um_a_mais', 'trocou_por_subtracao'])).join()), 'confere o valor do tipo');
ok(/certa no meio/.test(R.conferir(soma, nova(['9', '10', '8'], ['um_a_mais', 'um_a_menos'])).join()), 'recusa simétrica');
ok(/mesmo tipo/.test(R.conferir(soma, nova(['9', '10', '11'], ['perto', 'perto'])).join()), 'recusa tipos iguais');
ok(/não serve/.test(R.conferir(soma, nova(['9', '10', '3'], ['trocou_ideia', 'um_a_mais'])).join()), 'na conta, só erros calculáveis ou perto');
ok(R.conferir(esc, nova(['20', '2', '10'], ['trocou_ideia', 'dez_a_menos'])).length === 0, 'escolha: tipo livre e tipo calculado');

// 3. Gerador: nunca simétrico, sem zero, "vai um" só com dezena
ok(!R.simetrica(9, g.erradas('+', 6, 3, 9)) && !g.erradas('+', 5, 5, 10).includes(0), 'gerar-mat: sem simétrica e sem zero');
ok(g.erradas('+', 27, 15, 42).includes(32), 'gerar-mat: "esqueceu o vai um" continua na conta com dezena');

// 4. Ponta a ponta numa cópia: estraga dois itens → folha → aplicar → gravar → registro → validador
const cp = copia('build/ajustar-mat.js');
const env = { ...process.env, CONTEUDO_RAIZ: cp.pasta, REVISAO_RAIZ: cp.pasta };
const node = (arq, args) => { try { return execFileSync('node', [path.join(__dirname, '..', arq), ...args], { env }).toString(); } catch (e) { return e.stdout.toString(); } };
node('build/item.js', ['mat-005', 'opcoes:=[8,9,10]']);
node('build/item.js', ['mat-026', 'opcoes:=["2","10","20"]', 'correta=20']);
const folha = path.join(cp.pasta, 'folha.txt');
let s = node('build/ajustar-mat.js', ['mat-005', 'mat-026', '--folha', folha]);
ok(/2 item\(ns\)/.test(s) && /\(1 com \{\?\}/.test(s), 'folha com os 2 itens e 1 para completar: ' + s.trim());
let texto = cp.ler('folha.txt');
ok(/^mat-005 \| \*9 \| \d+ \{\w+\} \| \d+ \{\w+\}$/m.test(texto), 'linha da conta já vem completa');
s = node('build/ajustar-mat.js', ['--aplicar', folha]);
ok(/RECUSADO mat-026/.test(s), 'com {?} é recusado');
require('fs').writeFileSync(folha, texto.replace(/^mat-026 \|.*$/m, 'mat-026 | *20 | 2 {trocou_ideia} | 10 {dez_a_menos}'));
s = node('build/ajustar-mat.js', ['--aplicar', folha, '--gravar']);
ok(/2 aceito\(s\), 0 recusado\(s\) · gravado/.test(s), 'grava: ' + s.trim());
ok(cp.ler('registro.jsonl').split('\n').filter(l => l.includes('"ajuste":"mat"')).length === 2, 'anota no registro');
ok(/Nenhum item/.test(node('build/ajustar-mat.js', ['mat-005', 'mat-026', '--folha', folha])), 'depois de gravar, nada mais a ajustar');
ok(cp.validar().cod === 0, 'validador aceita o conteúdo ajustado');
cp.apagar();

console.log(falhas ? falhas + ' falha(s) no ajuste de Matemática' : 't_ajustar_mat: OK');
process.exit(falhas ? 1 : 0);

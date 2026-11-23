// Teste guardado: motor de ajuste de Português (build/ajustar-lp.js, regras em build/ajustar-regras.js)
// e importador do lote em JSON (build/importar-lp.js). Uso: node testes/t_ajustar.js
// Trabalha em CÓPIAS; o conteudo/ real não é tocado.
'use strict';
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const R = require(path.join(__dirname, '../build/ajustar-regras.js'));
const { ajustarLinha } = require(path.join(__dirname, '../build/ajustar-lp.js'));
const { linhaDe } = require(path.join(__dirname, '../build/importar-lp.js'));
const copia = require('./_gerador');
let falhas = 0;
const ok = (cond, msg) => { if (!cond) { falhas++; console.log('FALHA: ' + msg); } };

// 1. Regras
const enun = 'Leia: "Ao chegar em casa, Gabriel sentiu falta do caderno." Qual pista mostra que ele esqueceu o caderno?';
ok(R.textoDe(enun).startsWith('Ao chegar') && R.ehPista(enun), 'acha o texto lido e a pergunta de pista');
ok(R.foraDoTexto('Sentiu falta dele quando chegou em casa e foi arrumar a mochila.', R.textoDe(enun)).join() === 'arrumar,mochila', 'palavras fora do texto (chegou = chegar)');
ok(R.cortesDe('Lavou as frutas, coou o suco e provou.').join(' / ') === 'Lavou as frutas. / Lavou as frutas, coou o suco.', 'cortes só tiram o final');
const f = R.ajustarCerta('Sentiu falta dele quando chegou em casa e foi arrumar a mochila.', ['A professora avisou por telefone.', 'O caderno estava no estojo.'], enun);
ok(f.mudou && f.nova === 'Sentiu falta dele quando chegou em casa.' && !f.pendente, 'tira o trecho que não está no texto');
const c = R.ajustarCerta('Recolheram os pincéis, lavaram os copinhos e deixaram a sala limpa para a próxima turma.', ['Deixaram tinta derramada e copos sujos.', 'Saíram correndo sem guardar nada.'], 'Que pistas mostram responsabilidade?');
ok(c.mudou && c.nova === 'Recolheram os pincéis, lavaram os copinhos e deixaram a sala limpa.', 'certa comprida: fica o corte mais longo que resolve');
const p = R.ajustarCerta('Para não esquecer o prazo combinado com a professora.', ['Para desenhar.', 'Para brincar.'], 'Por que João usou a agenda?');
ok(!p.mudou && p.pendente.includes('ainda comprida'), 'sem corte seguro: não mexe e avisa como pendente');
ok(!R.ajustarCerta('Feliz', ['Com medo', 'Doente'], 'Como ele estava?').mudou, 'certa boa: não mexe');

// 2. Linha de pedido
const l = ajustarLinha('interpretacao | ' + enun + ' | *Sentiu falta dele quando chegou em casa e foi arrumar a mochila. | A professora avisou por telefone. | O caderno estava no estojo. | Explica. | nivel=2');
ok(l.mudou && l.linha.includes('| *Sentiu falta dele quando chegou em casa. |') && l.linha.endsWith('nivel=2'), 'pedido: troca só a certa e guarda as chaves');
ok(ajustarLinha('grafia | pássaro | 🐦') === null, 'pedido: moldes sem escolha são ignorados');

// 3. Importador
const li = linhaDe({ textoBase: 'O gato "Tom" dormiu | cedo.', enunciado: 'Quem dormiu?', opcoes: ['O cão', 'O gato', 'A ave'], correta: 1, explicacao: 'O texto diz.', categoria: 'Interpretação' }, { molde: 'interpretacao', nivel: '2' });
ok(li === "interpretacao | Leia: \"O gato 'Tom' dormiu / cedo.\" Quem dormiu? | O cão | *O gato | A ave | O texto diz. | titulo=Interpretação | nivel=2", 'importar: aspas e | trocados, * na certa, chaves no fim');
let erro = '';
try { linhaDe({ enunciado: 'E?', opcoes: ['a', 'b'], correta: 0, explicacao: 'x' }, { molde: 'interpretacao' }); } catch (e) { erro = e.message; }
ok(erro.includes('3 opções'), 'importar: recusa item sem 3 opções');

// 4. Ponta a ponta numa cópia: importar → gerar-lp --gravar → ajustar --conteudo → validador
const cp = copia('build/gerar-lp.js');
const json = path.join(cp.pasta, 'lote.json'), ped = path.join(cp.pasta, 'lote.txt');
const longo = { textoBase: 'Pedro lavou as laranjas e coou o suco.', enunciado: 'Qual pista mostra o cuidado de Pedro?', opcoes: ['Lavou as laranjas e coou o suco, deixando tudo bem limpinho na cozinha.', 'Não lavou as frutas antes.', 'Jogou o suco fora.'], correta: 0, explicacao: 'Lavar e coar mostram cuidado.' };
fs.writeFileSync(json, JSON.stringify([longo]));
const env = { ...process.env, CONTEUDO_RAIZ: cp.pasta };
const node = (arq, args) => execFileSync('node', [path.join(__dirname, '..', arq), ...args], { env }).toString();
const s1 = node('build/importar-lp.js', [json, ped, '--titulo', 'Pistas do texto']);
ok(s1.includes('1 corrigido') && fs.readFileSync(ped, 'utf8').includes('*Lavou as laranjas e coou o suco.'), 'importar já corrige a certa comprida');
ok(cp.rodar([ped, '--gravar']).cod === 0, 'gerar-lp grava o pedido importado');
fs.writeFileSync(json, JSON.stringify([Object.assign({}, longo, { enunciado: 'Qual pista mostra o capricho de Pedro?' })]));
node('build/importar-lp.js', [json, ped]);
fs.writeFileSync(ped, fs.readFileSync(ped, 'utf8').replace('*Lavou as laranjas e coou o suco.', '*' + longo.opcoes[0]));
cp.rodar([ped, '--gravar']);
const antes = cp.ler('lp.js');
const prev = node('build/ajustar-lp.js', ['--conteudo']);
ok(prev.includes('corrigido') && cp.ler('lp.js') === antes, 'conteúdo: prévia acha e não grava');
node('build/ajustar-lp.js', ['--conteudo', '--gravar']);
ok(cp.ler('lp.js') !== antes && node('build/ajustar-lp.js', ['--conteudo']).includes('0 corrigido'), 'conteúdo: --gravar corrige e a segunda passada não acha mais nada');
ok(cp.validar().cod === 0, 'validador aceita o conteúdo ajustado');
cp.apagar();

console.log(falhas ? 't_ajustar: ' + falhas + ' FALHA(S)' : 't_ajustar: OK');
process.exit(falhas ? 1 : 0);

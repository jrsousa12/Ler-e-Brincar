// Teste guardado: motor de ajuste de Português (build/ajustar-lp.js, regras em build/ajustar-regras.js,
// distratores por série em build/fichas/distratores.json) e importador do lote em JSON (build/importar-lp.js).
// Uso: node testes/t_ajustar.js. Trabalha em CÓPIAS; o conteudo/ real não é tocado.
'use strict';
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const R = require(path.join(__dirname, '../build/ajustar-regras.js'));
const { lerLinha } = require(path.join(__dirname, '../build/ajustar-lp.js'));
const { linhaDe, conferirItem } = require(path.join(__dirname, '../build/importar-lp.js'));
const copia = require('./_gerador');
let falhas = 0;
const ok = (cond, msg) => { if (!cond) { falhas++; console.log('FALHA: ' + msg); } };

// 1. Achar problemas
const enun = 'Leia: "Ao chegar em casa, Gabriel sentiu falta do caderno." Qual pista mostra que ele esqueceu o caderno?';
ok(R.textoDe(enun).startsWith('Ao chegar') && R.ehPista(enun), 'acha o texto lido e a pergunta de pista');
ok(R.foraDoTexto('Sentiu falta dele quando chegou em casa e foi arrumar a mochila.', R.textoDe(enun)).join() === 'arrumar,mochila', 'palavras fora do texto (chegou = chegar)');
const q = { enunciado: enun, nivel: 2, opcoes: ['Sentiu falta dele quando chegou em casa e foi arrumar a mochila.', 'A professora avisou.', 'Estava no estojo.'], correta: 0 };
const m = R.motivos(q).join(' / ');
ok(m.includes('comprida') && m.includes('arrumar, mochila'), 'motivos: certa comprida e palavras fora do texto');
ok(!R.motivos({ enunciado: 'Como ele estava?', nivel: 1, opcoes: ['Com medo', 'Feliz', 'Doente'], correta: 1 }).length, 'item bom: sem motivos');
ok(R.motivos({ enunciado: 'E?', nivel: 1, opcoes: ['Uma resposta certa com muito mais que quarenta e cinco letras', 'Uma errada também bem comprida e equilibrada aqui', 'Outra errada também bem comprida e equilibrada'], correta: 0 }).join().includes('acima de 45'), 'máximo da certa no 2º ano');
const p = R.plano(q);
ok(p.serie === '3º ano' && p.tipos.includes('parcial') && p.tipos.includes('exagero'), 'plano: nível 2 = 3º ano, com distratores do 3º ano');
ok(R.serieDe(1).nome === '2º ano' && !Object.keys(R.serieDe(1).tipos).includes('parcial'), '2º ano não usa distrator parcial');

// 2. Conferir a reescrita
const boa = { certa: 'Sentiu falta do caderno ao chegar em casa.', erradas: [{ texto: 'A professora avisou que ele esqueceu o caderno.', tipo: 'inventado' }, { texto: 'Sentiu falta do estojo ao sair da escola.', tipo: 'troca' }] };
ok(!R.conferir(q, boa).length, 'reescrita equilibrada e com tipos do 3º ano é aceita');
const erros = R.conferir(q, { certa: boa.certa, erradas: [{ texto: 'Dormiu.', tipo: 'troca' }, { texto: 'Foi para a lua e viu o caderno lá no alto do céu.', tipo: 'troca' }] }).join(' / ');
ok(erros.includes('Dormiu') && erros.includes('"lua"') && erros.includes('mesmo tipo'), 'recusa errada curta, absurda e tipos repetidos');
ok(R.conferir({ ...q, nivel: 1 }, { ...boa, erradas: [boa.erradas[0], { texto: boa.erradas[1].texto, tipo: 'parcial' }] }).join().includes('não é do 2º ano'), 'recusa distrator que não é da série');
ok(R.conferir(q, { ...boa, certa: 'Foi arrumar a mochila depois de jantar.' }).join().includes('fora do texto'), 'recusa certa fora do texto em pergunta de pista');

// 3. Linha da folha e importador
const l = lerLinha('lp-001 | Errada um {contrario} | *Certa | Errada dois {trecho} | explicacao=Nova.');
ok(l.id === 'lp-001' && l.correta === 1 && l.opcoes.join() === 'Errada um,Certa,Errada dois' && l.tipos.join() === 'contrario,trecho' && l.explicacao === 'Nova.', 'folha: lê certa, tipos e explicação');
const li = linhaDe({ textoBase: 'O gato "Tom" dormiu | cedo.', enunciado: 'Quem dormiu?', opcoes: ['O cão', 'O gato', 'A ave'], correta: 1, explicacao: 'O texto diz.', categoria: 'Interpretação' }, { molde: 'interpretacao', nivel: '2' });
ok(li === "interpretacao | Leia: \"O gato 'Tom' dormiu / cedo.\" Quem dormiu? | O cão | *O gato | A ave | O texto diz. | titulo=Interpretação | nivel=2", 'importar: aspas e | trocados, * na certa, chaves no fim');

const bom = { textoBase: 'Lia calçou as botas e pegou o guarda-chuva.', enunciado: 'Qual pista mostra que chovia?', opcoes: ['Ela pegou o guarda-chuva.', 'Ela calçou as botas.', 'Ela saiu sem as botas.'], correta: 0, explicacao: 'Guarda-chuva é para chuva.', tiposErradas: ['trecho', 'contrario'] };
ok(conferirItem(bom, 2).length === 0, 'conferir na chegada: item do roteiro passa');
const ruins = conferirItem({ ...bom, opcoes: ['Ela pegou o guarda-chuva.', 'Viu um dinossauro na rua.', 'Não.'], tiposErradas: ['troca', 'troca'] }, 2).join(' | ');
ok(/dinossauro/.test(ruins) && /mesmo tipo/.test(ruins) && /"Não\." com 4 letras/.test(ruins), 'conferir na chegada: acha absurdo, tipo repetido e errada curta');
ok(/falta "tiposErradas"/.test(conferirItem({ ...bom, tiposErradas: undefined }, 2).join()), 'conferir na chegada: pede os tipos que faltam');

// 4. Ponta a ponta numa cópia: importar → gerar-lp → folha → aplicar → validador e registro
const cp = copia('build/gerar-lp.js');
const env = { ...process.env, CONTEUDO_RAIZ: cp.pasta, REVISAO_RAIZ: cp.pasta };
const node = (arq, args) => { try { return execFileSync('node', [path.join(__dirname, '..', arq), ...args], { env }).toString(); } catch (e) { return e.stdout.toString(); } };
const json = path.join(cp.pasta, 'lote.json'), ped = path.join(cp.pasta, 'lote.txt'), folha = path.join(cp.pasta, 'lp-revisao.txt');
fs.writeFileSync(json, JSON.stringify([{ textoBase: 'Pedro lavou as laranjas e coou o suco.', enunciado: 'Qual pista mostra o cuidado de Pedro?', opcoes: ['Lavou as laranjas e coou o suco, deixando tudo bem limpinho na cozinha.', 'Não lavou.', 'Jogou fora.'], correta: 0, explicacao: 'Lavar e coar mostram cuidado.' }]));
ok(/fora do roteiro: nada/.test(node('build/importar-lp.js', [json, ped, '--nivel', '2'])) && !fs.existsSync(ped) && fs.readFileSync(json.replace(/\.json$/, '-conferencia.txt'), 'utf8').includes('tiposErradas'), 'importar: fora do roteiro não grava e escreve a conferência');
node('build/importar-lp.js', [json, ped, '--titulo', 'Pistas do texto', '--nivel', '2', '--aceitar']);
ok(cp.rodar([ped, '--gravar']).cod === 0, 'gerar-lp grava o pedido importado');
const id = [...cp.ler('lp.js').matchAll(/\{id:'(lp-\d+)'[^\n]*Pedro lavou/g)].pop()[1]; // o último gravado
ok(node('build/ajustar-lp.js', [id]).includes('1 item') && fs.readFileSync(folha, 'utf8').includes(id + ' | *Lavou'), 'monta a folha de revisão com o item');
const antes = cp.ler('lp.js');
fs.writeFileSync(folha, id + ' | *Lavou as laranjas e coou o suco. | Espremeu as laranjas sem lavar. {contrario} | Só lavou as laranjas, sem coar. {parcial}\n');
ok(node('build/ajustar-lp.js', ['--aplicar', folha]).includes('1 aceito') && cp.ler('lp.js') === antes, 'aplicar sem --gravar: só prévia');
node('build/ajustar-lp.js', ['--aplicar', folha, '--gravar']);
ok(cp.ler('lp.js').includes('Espremeu as laranjas sem lavar.') && node('build/ajustar-lp.js', [id]).includes('Nenhum'), 'aplicar --gravar troca as opções e o item sai da lista');
ok(JSON.parse(cp.ler('registro.jsonl').trim()).tipos.join() === 'contrario,parcial', 'registro guarda antes, depois e tipos');
ok(cp.validar().cod === 0, 'validador aceita o conteúdo ajustado');
fs.writeFileSync(folha, id + ' | *Lavou as laranjas e coou o suco. | Não. {contrario} | Só lavou as laranjas, sem coar. {parcial}\n');
ok(node('build/ajustar-lp.js', ['--aplicar', folha, '--gravar']).includes('nada gravado'), 'com recusa, nada é gravado');
cp.apagar();

// 5. Histórias (build/ajustar-historia.js): pergunta com certa comprida entra na folha, é reescrita e gravada
const ch = copia('build/gerar-lp.js');
const envH = { ...process.env, CONTEUDO_RAIZ: ch.pasta, REVISAO_RAIZ: ch.pasta };
const nodeH = (arq, args) => { try { return execFileSync('node', [path.join(__dirname, '..', arq), ...args], { env: envH }).toString(); } catch (e) { return e.stdout.toString(); } };
nodeH('build/item.js', ['historia-01', 'perguntas.0.opcoes:=["Azul","Um chapéu vermelho de gato","Verde"]', 'perguntas.0.correta:=1']);
const folhaH = path.join(ch.pasta, 'historia-revisao.txt');
ok(nodeH('build/ajustar-historia.js', ['historia-01']).includes('1 pergunta') && fs.readFileSync(folhaH, 'utf8').includes('historia-01#1 |'), 'histórias: acha a certa comprida e monta a folha');
fs.writeFileSync(folhaH, 'historia-01#1 | *Vermelho vivo | Azul bem claro {troca} | Verde escuro {inventado}\n');
ok(nodeH('build/ajustar-historia.js', ['--aplicar', folhaH, '--gravar']).includes('gravado'), 'histórias: aplica e grava');
ok(nodeH('build/ajustar-historia.js', ['historia-01']).includes('Nenhuma') && /historia-01#1/.test(ch.ler('registro.jsonl')), 'histórias: a pergunta sai da lista e fica no registro');
ok(ch.validar().cod === 0, 'histórias: validador aceita o conteúdo ajustado');
ch.apagar();

// 6. Enunciados longos (build/ajustar-enunciado.js): texto encurtado mantém a pista e as opções do texto
const E = require(path.join(__dirname, '../build/ajustar-enunciado.js'));
const qe = { id: 'lp-x', nivel: 2, enunciado: 'Leia: "Gabriel parou para conversar perto da praça e deixou o caderno no banco. Ao chegar em casa, sentiu falta dele." Como ele percebeu?', opcoes: ['Sentiu falta dele ao chegar em casa.', 'A professora avisou.', 'Estava no estojo.'], correta: 0, explicacao: 'O texto diz "sentiu falta dele".' };
ok(E.partes(qe.enunciado).pergunta === 'Como ele percebeu?', 'enunciado: separa texto e pergunta');
ok(!E.conferir(qe, 'Leia: "Gabriel deixou o caderno no banco. Ao chegar em casa, sentiu falta dele." Como ele percebeu?').length, 'enunciado: texto curto com a pista é aceito');
ok(E.conferir(qe, 'Leia: "Gabriel deixou o caderno no banco e foi para casa." Como ele percebeu?').join().includes('sumiu'), 'enunciado: recusa texto sem a pista da certa');
ok(E.conferir(qe, 'Leia: "' + 'Gabriel deixou o caderno no banco. Ao chegar em casa, sentiu falta dele. '.repeat(3) + '" Como?').join().includes('até 160'), 'enunciado: recusa acima do limite');
ok(E.conferir({ ...qe, opcoes: ['banco', 'praça', 'casa'] }, 'Leia: "Gabriel deixou o caderno no banco. Ao chegar em casa, sentiu falta dele." Onde?').join().includes('"praça"'), 'enunciado: recusa opção do texto que sumiu');
const ce = copia('build/gerar-lp.js');
const envE = { ...process.env, CONTEUDO_RAIZ: ce.pasta, REVISAO_RAIZ: ce.pasta };
const nodeE = args => { try { return execFileSync('node', [path.join(__dirname, '../build/ajustar-enunciado.js'), ...args], { env: envE }).toString(); } catch (e) { return e.stdout.toString(); } };
const curto = 'Helena e a mãe leram a receita juntas, passo a passo, para não esquecer nenhum ingrediente.';
execFileSync('node', [path.join(__dirname, '../build/item.js'), 'lp-253', 'enunciado=Leia: "' + curto + ' Depois foram ao mercado da esquina comprar farinha, ovos e leite." Qual pista mostra o motivo de elas lerem a receita passo a passo?'], { env: envE });
const folhaE = path.join(ce.pasta, 'enunciado-revisao.txt');
ok(nodeE(['lp-253']).includes('1 enunciado') && fs.readFileSync(folhaE, 'utf8').includes('lp-253 | texto='), 'enunciado: monta a folha');
fs.writeFileSync(folhaE, 'lp-253 | texto=' + curto + ' | pergunta=Qual pista mostra por que leram a receita passo a passo?\n');
ok(nodeE(['--aplicar', folhaE, '--gravar']).includes('gravado') && nodeE(['lp-253']).includes('Nenhum') && /"ajuste":"enunciado"/.test(ce.ler('registro.jsonl')), 'enunciado: grava, sai da lista e fica no registro');
ok(ce.validar().cod === 0, 'enunciado: validador aceita o conteúdo ajustado');
ce.apagar();

// certa comprida: mesma regra do conferir (limites em fichas/qualidade.json)
const comprida = (c, e) => R.motivos({ tipo: 'multipla', enunciado: 'Qual?', opcoes: [c, ...e], correta: 0 }).some(m => m.startsWith('certa comprida'));
ok(comprida('Café com leite', ['Suco', 'Chá']), 'certa de 14 letras contra erradas de 3 e 4 é comprida');
ok(!comprida('Ela guardou comida', ['Ela viajou para o sul', 'Ela passou muita fome']), 'certa parecida com as erradas não é comprida');
console.log(falhas ? 't_ajustar: ' + falhas + ' FALHA(S)' : 't_ajustar: OK');
process.exit(falhas ? 1 : 0);

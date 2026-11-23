// Teste guardado: gerador de Português (build/gerar-lp.js). Uso: node testes/t_gerar_lp.js
// Trabalha numa CÓPIA do conteúdo; o conteudo/ real não é tocado.
'use strict';
const path = require('path');
const g = require(path.join(__dirname, '../build/gerar-lp.js'));
const copia = require('./_gerador');
let falhas = 0;
const ok = (cond, msg) => { if (!cond) { falhas++; console.log('FALHA: ' + msg); } };
const recusa = linha => { try { g.montar(linha); return ''; } catch (e) { return e.message; } };

// 1. Moldes
const t = g.montar('troca | Lucas queria duas, [mas] só tinha uma.');
ok(t.tipo === 'completar' && t.correta === 'mas' && t.enunciado === 'Complete: "Lucas queria duas, ___ só tinha uma."', 'troca: [colchetes] viram ___');
ok(t.opcoes.includes('mais') && t.opcoes.includes('más') && t.explicacao.includes('oposição'), 'troca: erradas e explicação do grupo mas/mais/más');
ok(g.montar('troca | [Por que] você chorou?').opcoes.includes('Porque'), 'troca: maiúscula no começo vale para as erradas');
const gr = g.montar('grafia | pássaro | 🐦');
ok(gr.opcoes[gr.correta] === 'pássaro' && gr.opcoes.includes('páçaro') && gr.titulo === 'S ou SS', 'grafia: erros típicos (ç, s) e título da troca');
ok(g.montar('grafia | cachorro').opcoes.includes('cachoro'), 'grafia: rr → r');
ok(g.trocas('campo').some(x => x.palavra === 'canpo'), 'troca típica: m antes de p');
const p = g.montar('palavra | No sábado de manhã, Lucas acordou cedo para ajudar a avó. | Qual palavra do texto tem "nh"? | manhã | tem=nh');
ok(p.opcoes[p.correta] === 'manhã' && p.opcoes.every(o => p.enunciado.includes(o)), 'palavra: erradas tiradas do próprio texto');
ok(recusa('palavra | O gato dormiu. | Qual tem "nh"? | ninho | tem=nh').includes('não está no texto'), 'palavra: recusa resposta fora do texto');
ok(recusa('palavra | O ninho caiu no chão. | Qual tem "nh"? | ninho | tem=nh | erradas=chão/caiu') === '', 'palavra: erradas dadas e conferidas');
ok(recusa('palavra | O ninho e a linha. | Qual tem "nh"? | ninho | tem=nh | erradas=linha/o').includes('também tem'), 'palavra: errada que também serve é recusada');
const s = g.montar('silabas | bo-ne-ca');
ok(s.enunciado.includes('"boneca"') && s.opcoes[s.correta] === '3' && s.explicacao === 'BO-NE-CA: 3 sílabas.', 'silabas: conta sozinho');
const a = g.montar('alfabetica | casa, bola, dado');
ok(a.opcoes[a.correta] === 'bola' && a.nivel === 1, 'alfabetica: primeira');
ok(g.montar('alfabetica | macaco, mala, mesa | ultima=sim').nivel === 2, 'alfabetica: mesma letra inicial sobe o nível');
const i = g.montar('inferencia | O cão pulava ao ver o dono. Como ele estava? | Com medo | *Feliz | Doente | Pulos mostram alegria.');
ok(i.correta === 1 && i.habilidadeBNCC === 'EF15LP04' && i.titulo === 'Inferência', 'molde de escolha: * marca a certa; BNCC do molde');
ok(g.montar('sinonimo | Igual a "alegre"? | *Contente | Triste | Bravo | Contente é alegre. | nivel=3 | titulo=Sinônimo fácil').nivel === 3, 'chave=valor muda o nível');
for (const ruim of ['xyz | a | b', 'troca | sem lacuna', 'grafia | tampa', 'inferencia | E? | A | B | C | x', 'inferencia | E? | *A | B | C', 'silabas | cavalo']) ok(recusa(ruim), 'deveria recusar: ' + ruim);

// 2. Gravar numa cópia e passar no validador
const c = copia('build/gerar-lp.js');
const ped = c.pedido('# teste\ntroca | Ele comeu [mais] pão.\ngrafia | cachorro | 🐶\nsilabas | ja-ne-la | 🪟\ninferencia | A rua estava molhada de manhã. O que aconteceu? | *Choveu | Nevou | Fez sol | Rua molhada indica chuva.\n');
const antes = c.ler('lp.js');
ok(c.rodar([ped]).cod === 0 && c.ler('lp.js') === antes, 'sem --gravar não muda nada');
const r = c.rodar([ped, '--gravar']);
ok(r.cod === 0 && r.saida.includes('4 atividade(s)'), 'grava 4 atividades: ' + r.saida.trim().split('\n').pop());
ok(c.ler('lp.js').startsWith(antes.slice(0, antes.lastIndexOf('}') + 1)), 'o conteúdo antigo fica igual');
ok(c.validar().saida.includes('OK'), 'validador aceita o que foi gravado');
ok(c.rodar([ped, '--gravar']).cod === 1, 'gravar de novo recusa (já existe)');
c.apagar();

console.log(falhas ? `t_gerar_lp: ${falhas} falha(s)` : 't_gerar_lp: OK');
process.exit(falhas ? 1 : 0);

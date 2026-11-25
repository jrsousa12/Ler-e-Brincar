// Teste guardado: motor de desenhos de colorir (build/colorir.js + colorir-regras.js + kit desenho.js).
// Uso: node testes/t_colorir.js   Trabalha numa CÓPIA do conteúdo; o conteudo/ real não é tocado.
'use strict';
const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');
const raiz = path.join(__dirname, '..');
const { conferir } = require(path.join(raiz, 'build/colorir-regras.js'));
const k = require(path.join(raiz, 'build/desenho.js'));
let falhas = 0;
const ok = (cond, msg) => { if (!cond) { falhas++; console.log('FALHA: ' + msg); } };

// 1. Regras do estilo
const bom = k.svg(...[40, 80, 120, 160, 200, 240, 260, 280].map(x => k.f('circle', `cx="${x}" cy="150" r="10"`)), k.solto('M10 10 Q20 20 30 10'));
const r1 = conferir(bom);
ok(!r1.erros.length && !r1.avisos.length && r1.partes === 8, 'desenho do kit com 8 partes passa limpo (enfeite não conta)');
ok(conferir(bom.replace('class="solto" ', '')).erros.some(e => e.includes('fill="none"')), 'traço aberto sem solto() é erro');
ok(conferir(bom.replace('</svg>', '<line x1="0" y1="0" x2="9" y2="9"/></svg>')).erros.some(e => e.includes('<line>')), '<line> é erro');
ok(conferir(bom.replace('</svg>', '<text>oi</text></svg>')).erros.length > 0, 'texto é erro');
ok(conferir(bom.replace('0 0 300 300', '0 0 100 100')).erros.length > 0, 'viewBox errado é erro');
ok(conferir('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300"><circle r="9" fill="white" stroke="black"/></svg>').avisos.length === 2,
  'poucas partes e canto duro são avisos');
const esp = k.espelhar(k.f('circle', 'cx="200" cy="100" r="9"'));
ok(esp.includes('scale(-1,1)') && esp.split('<circle').length === 3, 'espelhar desenha os dois lados');

// 2. Motor numa cópia do conteúdo: trocar, criar, recusar com erro, prévia
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 't_colorir-'));
const cont = path.join(tmp, 'conteudo');
fs.mkdirSync(cont);
for (const f of ['historias', 'lp', 'mat', 'colorir', 'silabas']) fs.copyFileSync(path.join(raiz, 'conteudo', f + '.js'), path.join(cont, f + '.js'));
const env = Object.assign({}, process.env, { CONTEUDO_RAIZ: cont, PREVIA_PASTA: path.join(tmp, 'previas') });
const pedido = (nome, lista) => { const a = path.join(tmp, nome + '.js'); fs.writeFileSync(a, 'module.exports = ' + JSON.stringify(lista)); return a; };
const rodar = (...a) => { try { return execFileSync('node', [path.join(raiz, 'build/colorir.js'), ...a], { env, encoding: 'utf8' }); } catch (e) { return 'SAIU ' + e.status + '\n' + e.stdout; } };
const ler = () => { const LB = {}; new Function('LB', fs.readFileSync(path.join(cont, 'colorir.js'), 'utf8'))(LB); return LB.colorir; };
const total = ler().length;

const ruim = pedido('ruim', [{ id: 'colorir-02', svg: bom.replace('class="solto" ', '') }]);
const s1 = rodar(ruim, '--gravar', '--sem-previa');
ok(s1.startsWith('SAIU 1') && s1.includes('Nada gravado'), 'com erro não grava');
ok(rodar(pedido('semid', [{ id: 'colorir-99', svg: bom }]), '--sem-previa').includes('não existe'), 'id inexistente é recusado');
const livre = 'colorir-' + String(total + 1).padStart(2, '0');
ok(!rodar(pedido('novoid', [{ id: livre, titulo: 'Novo', emoji: '🧪', svg: bom }]), '--sem-previa').startsWith('SAIU'), 'novo com o próximo id livre (vetorizar) é aceito');
ok(rodar(pedido('pulou', [{ id: 'colorir-99', titulo: 'Novo', emoji: '🧪', svg: bom }]), '--sem-previa').includes('próximo livre'), 'novo com id que pula números é recusado');

const fora = k.svg(k.f('circle', 'cx="290" cy="150" r="40"'));
const lote = pedido('lote', [{ id: 'colorir-02', svg: bom }, { titulo: 'Teste', emoji: '🧪', svg: fora }]);
const s2 = rodar(lote);
ok(s2.includes('sai da folha'), 'prévia avisa desenho que sai da folha');
ok(fs.existsSync(path.join(tmp, 'previas/colorir.html')), 'prévia em HTML criada');
ok(ler()[1].svg !== bom, 'sem --gravar não muda o conteúdo');
const s3 = rodar(lote, '--gravar', '--sem-previa');
const depois = ler();
ok(s3.includes('Gravado: 2'), 'grava o lote');
ok(depois[1].svg === bom && depois[1].titulo === 'A estrela de Lia', 'troca só o svg do desenho existente');
ok(depois.length === total + 1 && depois[total].id === 'colorir-' + (total + 1) && depois[total].emoji === '🧪', 'desenho novo ganha o próximo id');
const v = execFileSync('node', [path.join(raiz, 'build/validar.js')], { env, encoding: 'utf8' });
ok(v.includes('OK'), 'conteúdo gravado passa no validador');
fs.rmSync(tmp, { recursive: true, force: true });

// 3. Biblioteca de peças (build/pecas/), aprendida dos lotes do Gemini por build/aprender.js
const p = require(path.join(raiz, 'build/pecas/index.js'));
const { avulsas } = require(path.join(raiz, 'build/colorir-regras.js'));
const { aprender, ancora } = require(path.join(raiz, 'build/aprender.js'));
const nomes = Object.keys(p).filter(n => p[n].def);
ok(nomes.length >= 20 && nomes.every(n => p[n].def.tema === 'aprendidas'), 'biblioteca só com as peças aprendidas dos lotes novos');
ok(nomes.every(n => p[n].def.descricao.length > 10 && p[n].def.ancora.length === 2), 'toda peça tem descrição e encaixe');
const parado = p.guizo({ x: 10, y: 20 }), grande = p.guizo({ x: 10, y: 20, e: 2 }), virado = p.orelhaGato({ espelho: true });
ok(parado.includes('data-peca="guizo"') && parado.includes('translate(10 20)'), 'colocar leva o encaixe para x, y');
ok(grande.includes('scale(2 2)') && grande.includes('stroke-width="1.25"'), 'escala não engrossa o traço');
ok(virado.includes('scale(-1 1)'), 'espelho vira a peça');
ok(!p.cabecaGato().includes('transform'), 'peça no lugar aprovado não ganha transform');
ok(p.par(p.orelhaGato).includes(`translate(${300 - p.orelhaGato.def.ancora[0]} `), 'par espelha do outro lado do eixo');
ok(String(ancora('<circle cx="10" cy="20" r="5"/>')) === '10,20', 'encaixe no meio da peça');
const lotes = fs.readdirSync(path.join(raiz, 'build/pedidos')).filter(a => /^colorir-gemini-\d+\.js$/.test(a))
  .flatMap(a => require(path.join(raiz, 'build/pedidos', a)));
ok(lotes.every(d => /^colorir-\d+$/.test(d.id)), 'todo desenho de lote tem número (senão, gravar de novo duplica)');
ok(lotes.length >= 5 && lotes.every(d => avulsas(d.svg) === 0 && !conferir(d.svg).erros.length), 'desenhos dos lotes novos só com peças e sem erro');
ok(aprender().every(q => lotes.some(d => d.svg.includes(">" + p[q.nome].def.desenho() + "</g>"))), 'cada peça no lugar repete o traço do desenho aprovado');
ok(avulsas(k.svg(p.guizo(), k.f('circle', 'r="3"'), k.solto('M0 0 L1 1'))) === 1, 'conta só a forma pintável fora da biblioteca');
const ap = execFileSync('node', [path.join(raiz, 'build/aprender.js'), '--conferir'], { encoding: 'utf8' });
ok(ap.includes('em dia'), 'biblioteca aprendida em dia com os lotes');
const b = execFileSync('node', [path.join(raiz, 'build/biblioteca.js'), '--conferir'], { encoding: 'utf8' });
ok(b.includes('em dia'), 'PECAS.md em dia e peças sem erro');

// 5. Motor vetorizar (imagem → desenho): quadrado preto com furo e um risco no meio
const tr = require(path.join(raiz, 'build/vetorizar-tracar.js'));
const n = 40, m = new Uint8Array(n * n);
for (let y = 4; y < 36; y++) for (let x = 4; x < 36; x++) m[y * n + x] = (x < 7 || x > 32 || y < 7 || y > 32 || x === 20) ? 1 : 0;
const reg = tr.separar(m, n);
ok(reg.filter(r => !r.borda).length === 2, 'risco divide o quadrado em 2 partes fechadas');
const d = tr.contornos(m, n);
const nums = d.match(/[\d.]+/g).map(Number);
ok((d.match(/M/g) || []).length === 3 && Math.min(...nums) < 35 && Math.max(...nums) > 265, 'contorno do traço não encolhe (borda de fora + 2 furos)');

console.log(falhas ? `t_colorir: ${falhas} FALHA(S)` : 't_colorir: OK');
process.exit(falhas ? 1 : 0);

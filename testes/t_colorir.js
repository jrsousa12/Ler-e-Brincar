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

// 3. Biblioteca de peças (build/pecas/)
const p = require(path.join(raiz, 'build/pecas/index.js'));
const { avulsas } = require(path.join(raiz, 'build/colorir-regras.js'));
const nomes = Object.keys(p).filter(n => p[n].def);
ok(nomes.length >= 30, 'biblioteca com as peças dos 5 modelos aprovados');
ok(nomes.every(n => p[n].def.descricao.length > 10 && p[n].def.ancora.length === 2), 'toda peça tem descrição e encaixe');
const parado = p.maca({ x: 10, y: 20 }), grande = p.maca({ x: 10, y: 20, e: 2 }), virado = p.orelhaGato({ espelho: true });
ok(parado.includes('data-peca="maca"') && parado.includes('translate(10 20)'), 'colocar leva o encaixe para x, y');
ok(grande.includes('scale(2 2)') && grande.includes('stroke-width="1.25"'), 'escala não engrossa o traço');
ok(virado.includes('scale(-1 1)'), 'espelho vira a peça');
ok(!p.cabecaGato().includes('transform'), 'peça no lugar aprovado não ganha transform');
ok(p.par(p.orelhaGato).includes('translate(184 62)'), 'par espelha do outro lado do eixo');
ok(avulsas(k.svg(p.tronco(), k.copa(1, 1, 5, 5), k.f('circle', 'r="3"'), k.solto('M0 0 L1 1'))) === 1, 'conta só a forma pintável fora da biblioteca');
const b = execFileSync('node', [path.join(raiz, 'build/biblioteca.js'), '--conferir'], { encoding: 'utf8' });
ok(b.includes('em dia'), 'PECAS.md em dia e peças sem erro');
const modelos = require(path.join(raiz, 'build/pedidos/colorir-modelos.js'));
ok(modelos.length === 5 && modelos.every(m => avulsas(m.svg) === 0 && !conferir(m.svg).erros.length), 'os 5 modelos montados só com peças');

console.log(falhas ? `t_colorir: ${falhas} FALHA(S)` : 't_colorir: OK');
process.exit(falhas ? 1 : 0);

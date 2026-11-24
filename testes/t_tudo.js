// Teste do motor 6 (build/tudo.js): mapa de etapas, ficha coerente e etapas internas.
'use strict';
const fs = require('fs');
const path = require('path');
const assert = require('assert');
const { escolher, INTERNAS, FICHA } = require('../build/tudo.js');

const RAIZ = path.join(__dirname, '..');

// 1. Toda etapa citada no mapa/navegador existe; todo comando aponta para arquivo real.
const nomes = Object.keys(FICHA.etapas);
for (const lista of [...Object.values(FICHA.mapa), FICHA.navegador]) {
  for (const n of lista) assert.ok(nomes.includes(n), `etapa desconhecida no mapa: ${n}`);
}
for (const [n, cmd] of Object.entries(FICHA.etapas)) {
  if (cmd === 'interno') assert.ok(INTERNAS[n], `etapa interna sem função: ${n}`);
  else assert.ok(fs.existsSync(path.join(RAIZ, cmd.split(' ')[0])), `arquivo não existe: ${cmd}`);
}

// 2. Todo teste da pasta testes/ está na lista de etapas.
for (const f of fs.readdirSync(path.join(RAIZ, 'testes')).filter((f) => /^t_.*\.js$/.test(f))) {
  assert.ok(nomes.includes(f.replace('.js', '')), `teste fora da ficha: ${f}`);
}

// 3. Escolha pelos arquivos alterados.
let r = escolher(['conteudo/lp.js']);
assert.ok(r.etapas.includes('validar') && r.etapas.includes('t_conteudo'));
assert.ok(!r.etapas.includes('t_gerar_mat'));
r = escolher(['js/sorteio.js']);
assert.ok(r.etapas.includes('t_sorteio') && r.etapas.includes('t_app'), 'prefixos js/ e js/sorteio.js somam');
r = escolher(['testes/t_item.js']);
assert.ok(r.etapas.includes('t_item'), 'teste alterado roda a si mesmo');
r = escolher(['README.md', 'build/fichas/mat.json']);
assert.deepStrictEqual(r.soltos, ['README.md']);
assert.deepStrictEqual(r.etapas, ['sintaxe', 'tamanho', 'catalogo', 't_gerar_mat', 't_importar_mat', 't_ajustar_mat']);
// Ordem segue a ficha, não a do mapa.
r = escolher(['conteudo/x.js']);
assert.deepStrictEqual(r.etapas, nomes.filter((n) => r.etapas.includes(n)));

// 4. Etapas internas passam no projeto atual.
assert.deepStrictEqual(INTERNAS.sintaxe(), []);
assert.deepStrictEqual(INTERNAS.tamanho(), []);

console.log('t_tudo: OK');

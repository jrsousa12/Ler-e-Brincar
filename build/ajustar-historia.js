// Motor de ajuste das Histórias (irmão do ajustar-lp.js): acha a resposta certa comprida demais nas
// perguntas de escolha das histórias e monta a folha de revisão; depois de reescrita, confere e grava.
// Uso:
//   node build/ajustar-historia.js [historia-05 ...] [--folha arq.txt]   → acha e monta a folha
//        (padrão build/revisao/historia-revisao.txt; sem ids = todas as histórias)
//   node build/ajustar-historia.js --aplicar <folha.txt> [--gravar]       → confere; --gravar grava
// Linha da folha: historia-05#1 | *certa curta | errada {tipo} | errada {tipo} | explicacao=...
// (#1 = número da pergunta dentro da história, como no conferir.js). Regras: build/ajustar-regras.js.
'use strict';
const fs = require('fs');
const path = require('path');
const { achar, todos } = require('./item');
const R = require('./ajustar-regras');
const { lerLinha } = require('./ajustar-lp');
const L = require('./fichas/qualidade.json').limites; // mesmos limites do conferir.js

const { lerFolha, regravar, anotar, fechar, principalAjuste } = require('./ajustar-comum');
const escolha = p => Array.isArray(p.opcoes) && p.opcoes.length === 3 && typeof p.correta === 'number';
// pergunta como item de escolha (nível vem da história)
const comoItem = (h, p) => ({ enunciado: p.enunciado, opcoes: p.opcoes, correta: p.correta, nivel: h.nivel });
// problemas: os do motor de Português + o aviso certa_mais_longa do conferir.js (limites da ficha de qualidade)
function problemas(h, p) {
  const q = comoItem(h, p), m = R.motivos(q), certa = String(p.opcoes[p.correta]);
  const maior = Math.max(...p.opcoes.filter((_, i) => i !== p.correta).map(o => String(o).length));
  if (!m.length && certa.length >= maior * L.certa_mais_longa_fator && certa.length - maior >= L.certa_mais_longa_letras) m.push('certa mais longa que as erradas (' + certa.length + ' × ' + maior + ')');
  return m;
}
const sep = id => { const [h, n] = id.split('#'); return [h, +n]; };

function bloco(h, n, p, m) {
  const q = comoItem(h, p), pl = R.plano(q), s = R.serieDe(h.nivel);
  const ops = p.opcoes.map((o, i) => (i === p.correta ? '*' : '') + o + (i === p.correta ? '' : ' {?}'));
  return ['# ' + h.id + '#' + n + ' · ' + pl.serie + ' · certa até ' + pl.maxCerta + ' letras, com outras palavras (não cortar) · erradas de ' + pl.erradas[0] + ' a ' + pl.erradas[1] + ' letras',
    '# problema: ' + m.join('; '),
    '# história: ' + h.texto.join(' '),
    '# pergunta: ' + p.enunciado,
    '# distratores do ' + pl.serie + ' (um tipo diferente em cada errada): ' + pl.tipos.map(t => t + ' = ' + s.tipos[t].como).join(' · '),
    h.id + '#' + n + ' | ' + ops.join(' | '), ''].join('\n');
}

function montarFolha(pedidos, arq) {
  const blocos = [];
  for (const r of todos().filter(x => x.nome === 'historias' && (!pedidos.length || pedidos.includes(x.id)))) {
    const h = achar(r.id).item;
    (h.perguntas || []).forEach((p, k) => {
      if (!escolha(p)) return;
      const m = problemas(h, p);
      if (m.length) blocos.push(bloco(h, k + 1, p, m));
    });
  }
  if (!blocos.length) { console.log('Nenhuma pergunta precisa de ajuste.'); return 0; }
  fs.mkdirSync(path.dirname(arq), { recursive: true });
  fs.writeFileSync(arq, '# Folha de revisão das histórias (build/ajustar-historia.js). Reescreva a linha de cada pergunta: certa mais curta com\n# outras palavras, erradas maiores, cada errada com {tipo}. Depois: node build/ajustar-historia.js --aplicar ' + path.relative(process.cwd(), arq) + '\n\n' + blocos.join('\n'));
  console.log(blocos.length + ' pergunta(s) precisam de ajuste → ' + path.relative(process.cwd(), arq));
  return 0;
}

function aplicar(arq, gravar) {
  const linhas = lerFolha(arq);
  const prontos = [], erros = [];
  for (const l of linhas) {
    const n = lerLinha(l);
    const [hid, num] = sep(n.id);
    let h;
    try { h = achar(hid).item; } catch (e) { erros.push(n.id + ': não existe'); continue; }
    const p = (h.perguntas || [])[num - 1];
    if (!p || !escolha(p)) { erros.push(n.id + ': pergunta de escolha não encontrada'); continue; }
    const nova = { certa: n.opcoes[n.correta], erradas: n.opcoes.filter((o, i) => i !== n.correta).map((t, i) => ({ texto: t, tipo: n.tipos[i] })) };
    const e = n.correta < 0 || n.opcoes.length !== 3 ? ['precisa de 3 opções, a certa com *'] : R.conferir(comoItem(h, p), nova);
    if (e.length) { erros.push(n.id + ': ' + e.join('; ')); continue; }
    prontos.push({ h, n, hid, num });
  }
  erros.forEach(l => console.log('RECUSADO ' + l));
  prontos.forEach(({ n }) => console.log('ok ' + n.id + ': "' + n.opcoes[n.correta] + '" · erradas ' + n.tipos.join(' + ')));
  if (gravar && !erros.length) {
    const reg = [];
    for (const { h, n, hid, num } of prontos) {
      const r0 = achar(hid); // relê: o arquivo muda a cada item gravado
      const p = r0.item.perguntas[num - 1];
      const antes = { opcoes: p.opcoes, correta: p.correta };
      Object.assign(p, { opcoes: n.opcoes, correta: n.correta }, n.explicacao ? { explicacao: n.explicacao } : {});
      regravar(r0);
      reg.push({ id: n.id, serie: R.serieDe(h.nivel).nome, antes, depois: { opcoes: n.opcoes, correta: n.correta }, tipos: n.tipos });
    }
    anotar(reg);
  }
  return fechar(prontos.length, erros.length, gravar);
}

function principal(argv) {
  return principalAjuste(argv, { folha: 'historia-revisao.txt', aplicar, montarFolha: (ids, folha) => montarFolha(ids, folha) });
}

if (require.main === module) process.exit(principal(process.argv.slice(2)));
module.exports = { principal };

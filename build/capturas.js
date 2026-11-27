// Motor de capturas (Fase 7, etapa 6): percorre todas as telas do app em celular e tablet,
// salva uma foto de cada e monta uma folha-resumo por tamanho, para revisar tudo de uma vez.
// Uso: node build/capturas.js            (todos os tamanhos)
//      node build/capturas.js tablet     (só os tamanhos cujo nome tem "tablet")
//      node build/capturas.js escuro     (celular com o aparelho no modo escuro)
// Saída: build/previas/capturas/<tamanho>/<tela>.png e build/previas/capturas-<tamanho>.png
'use strict';
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');
const raiz = path.join(__dirname, '..');
const saida = path.join(raiz, 'build', 'previas', 'capturas');

// Telas e tamanhos: lista única em build/capturas-telas.js
const { TAMANHOS, TELAS } = require('./capturas-telas');

async function fotografar(b, nome, tam) {
  const { escuro, ...viewport } = tam;
  const pasta = path.join(saida, nome);
  fs.mkdirSync(pasta, { recursive: true });
  const p = await b.newPage({ viewport, colorScheme: escuro ? 'dark' : 'light' });
  const erros = [];
  p.on('pageerror', e => erros.push(e.message));
  await p.goto('file://' + path.join(raiz, 'index.html'));
  await p.waitForSelector('.card', { timeout: 5000 }).catch(() => {});
  // Sem animações nas fotos, para sair tudo no lugar final
  await p.addStyleTag({ content: '*,*::before,*::after{animation:none!important;transition:none!important}' });
  const largos = [];
  for (const [tela, ir] of TELAS) {
    try { await p.evaluate(ir); } catch (e) { erros.push(tela + ': ' + e.message); continue; }
    await p.waitForTimeout(250);
    await p.evaluate(() => window.scrollTo(0, 0));
    const sobra = await p.evaluate(() => document.documentElement.scrollWidth - innerWidth);
    if (sobra > 1) largos.push(tela);
    await p.screenshot({ path: path.join(pasta, tela + '.png') });
  }
  await p.close();
  return { pasta, erros, largos };
}

// Folha-resumo: todas as fotos de um tamanho lado a lado, numa imagem só
async function folha(b, nome, viewport, pasta) {
  const fotos = fs.readdirSync(pasta).filter(f => f.endsWith('.png')).sort();
  const col = viewport.width > viewport.height ? 3 : 5;
  const larg = viewport.width > viewport.height ? 420 : 260;
  const html = `<body style="margin:0;padding:12px;background:#ddd;font:14px sans-serif;display:grid;grid-template-columns:repeat(${col},${larg}px);gap:12px">` +
    fotos.map(f => `<figure style="margin:0"><img src="file://${path.join(pasta, f)}" style="width:100%;border:1px solid #888"><figcaption>${f.replace('.png', '')}</figcaption></figure>`).join('') + '</body>';
  const arq = path.join(saida, '..', `capturas-${nome}.html`);
  fs.writeFileSync(arq, html);
  const p = await b.newPage({ viewport: { width: col * (larg + 12) + 12, height: 400 } });
  await p.goto('file://' + arq);
  await p.waitForTimeout(300);
  const png = path.join(saida, '..', `capturas-${nome}.png`);
  await p.screenshot({ path: png, fullPage: true });
  await p.close();
  fs.unlinkSync(arq);
  return png;
}

(async () => {
  const filtro = process.argv[2] || '';
  const b = await chromium.launch();
  let problemas = 0;
  for (const [nome, vp] of Object.entries(TAMANHOS)) {
    if (filtro && !nome.includes(filtro)) continue;
    const r = await fotografar(b, nome, vp);
    const png = await folha(b, nome, vp, r.pasta);
    console.log(`${nome} (${vp.width}x${vp.height}): ${TELAS.length} telas → ${path.relative(raiz, png)}`);
    if (r.largos.length) { problemas++; console.log('  AVISO: rolagem para o lado em ' + r.largos.join(', ')); }
    if (r.erros.length) { problemas++; console.log('  ERRO: ' + r.erros.join(' | ')); }
  }
  await b.close();
  process.exit(problemas ? 1 : 0);
})();

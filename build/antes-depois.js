// Motor antes/depois (Etapa A, 27/11): prova que uma mudança no CSS não mudou nada na tela.
// Fotografa todas as telas (build/capturas-telas.js) em vários tamanhos e temas e guarda o estilo
// final de cada elemento (também com o dedo em cima e apertando). Depois compara as duas rodadas.
// Uso: node build/antes-depois.js antes      (guarda o "antes", antes de mexer)
//      node build/antes-depois.js depois     (tira de novo, compara e monta as folhas lado a lado)
//      node build/antes-depois.js comparar   (só compara o que já foi guardado)
// Saída: build/previas/antes-depois/{antes,depois}/, relatório build/previas/antes-depois.txt,
//        folhas build/previas/antes-depois-<tamanho>.png
'use strict';
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { chromium } = require('playwright');
const { TAMANHOS, EXTRAS, TELAS, TELAS_EXTRAS } = require('./capturas-telas');
const pg = require('./antes-depois-pagina');
const raiz = path.join(__dirname, '..');
const pasta = path.join(raiz, 'build', 'previas', 'antes-depois');
const TODOS = { ...TAMANHOS, ...EXTRAS };
const COM_ESTADOS = ['celular', 'celular-escuro', 'celular-creme'];   // também com dedo em cima, apertando e foco
const ESTADOS = ['hover', 'active', 'hover+active', 'focus-visible'];
const TOQUE = 'button, a, label, .card, .carta-memoria, .dinheiro';
const ESPERA = 300;
const RUIDO = 100;

// Liga (ou desliga) :hover/:active/:focus-visible em todos os botões, cartões e links da tela
async function forcar(cdp, estado) {
  const { root } = await cdp.send('DOM.getDocument', { depth: 0 });
  const { nodeIds } = await cdp.send('DOM.querySelectorAll', { nodeId: root.nodeId, selector: TOQUE });
  for (const nodeId of nodeIds) await cdp.send('CSS.forcePseudoState', { nodeId, forcedPseudoClasses: estado ? estado.split('+') : [] });
}

// Deixa a tela assentar: 400 ms no relógio da página, um tempo real para desenhar, animações paradas
async function andar(p) {
  await p.clock.runFor(400);
  await p.waitForTimeout(ESPERA);
  await p.evaluate(pg.congelar);
}

async function rodada(b, destino) {
  fs.rmSync(destino, { recursive: true, force: true });
  const dic = {}, telas = {}, erros = [];
  const guardar = (chave, lista) => { telas[chave] = lista.map(([c, t]) => {
    const h = crypto.createHash('md5').update(t).digest('hex').slice(0, 16); dic[h] = t; return [c, h]; }); };
  for (const [tam, cfg] of Object.entries(TODOS)) {
    fs.mkdirSync(path.join(destino, tam), { recursive: true });
    const ctx = await b.newContext({ viewport: { width: cfg.width, height: cfg.height },
      colorScheme: cfg.escuro ? 'dark' : 'light', reducedMotion: cfg.calmo ? 'reduce' : 'no-preference' });
    await ctx.addInitScript(pg.SORTEIO_FIXO);
    const p = await ctx.newPage();
    // Relógio da página sob controle: os temporizadores só andam quando o motor manda (runFor)
    await p.clock.install({ time: new Date('2026-11-27T10:00:00') });
    if (cfg.impressao) await p.emulateMedia({ media: 'print' });
    p.on('pageerror', e => erros.push(tam + ': ' + e.message));
    await p.goto('file://' + path.join(raiz, 'index.html'));
    await p.waitForSelector('.card', { timeout: 5000 }).catch(() => {});
    await andar(p);
    if (cfg.classes) await p.evaluate(c => document.documentElement.classList.add(...c.split(' ')), cfg.classes);
    const cdp = await ctx.newCDPSession(p);
    await cdp.send('DOM.enable'); await cdp.send('CSS.enable');
    const ir = Object.fromEntries([...TELAS, ...TELAS_EXTRAS].map(([n, f]) => [n, f]));
    for (const [tela, f, antes] of [...TELAS, ...TELAS_EXTRAS]) {
      try {
        if (antes) { await p.evaluate(ir[antes]); await andar(p); }
        await p.evaluate(f);
      } catch (e) { erros.push(`${tam}/${tela}: ${e.message.split('\n')[0]}`); continue; }
      await andar(p);
      await p.screenshot({ path: path.join(destino, tam, tela + '.png'), animations: 'disabled', style: '.confete{display:none!important}' });
      guardar(`${tam}/${tela}`, await p.evaluate(pg.estilos));
      if (!COM_ESTADOS.includes(tam)) continue;
      for (const estado of ESTADOS) {
        await forcar(cdp, estado); await p.evaluate(pg.congelar);
        guardar(`${tam}/${tela}:${estado}`, await p.evaluate(pg.estilos));
        await forcar(cdp, null);
      }
    }
    await ctx.close();
  }
  fs.writeFileSync(path.join(destino, 'estilos.json'), JSON.stringify({ dic, telas, erros }));
  return erros;
}

// Diferenças de estilo de uma tela: "caminho  propriedade: antes → depois"
function diferencas(A, B, chave) {
  const semHead = (l) => (l || []).filter(([c]) => !c.startsWith('html>head'));   // <head> não aparece na tela
  const a = new Map(semHead(A.telas[chave])), d = new Map(semHead(B.telas[chave])), linhas = [];
  for (const [c, h] of a) {
    if (!d.has(c)) { linhas.push(`${c}  (sumiu)`); continue; }
    if (d.get(c) === h) continue;
    const pa = Object.fromEntries(A.dic[h].split('\n').map(l => [l.slice(0, l.indexOf(':')), l.slice(l.indexOf(':') + 1)]));
    const pd = Object.fromEntries(B.dic[d.get(c)].split('\n').map(l => [l.slice(0, l.indexOf(':')), l.slice(l.indexOf(':') + 1)]));
    for (const k of new Set([...Object.keys(pa), ...Object.keys(pd)])) if (pa[k] !== pd[k]) linhas.push(`${c}  ${k}: ${pa[k]} → ${pd[k]}`);
  }
  for (const c of d.keys()) if (!a.has(c)) linhas.push(`${c}  (apareceu)`);
  return linhas;
}

async function comparar(b) {
  const ler = (q) => JSON.parse(fs.readFileSync(path.join(pasta, q, 'estilos.json'), 'utf8'));
  const A = ler('antes'), B = ler('depois'), rel = [];
  let fotosIg = 0, fotosDif = 0, ruido = 0, telasDif = 0;
  const p = await b.newPage();
  for (const tam of Object.keys(TODOS)) {
    const dirA = path.join(pasta, 'antes', tam);
    for (const f of fs.existsSync(dirA) ? fs.readdirSync(dirA).sort() : []) {
      const fa = path.join(dirA, f), fd = path.join(pasta, 'depois', tam, f);
      if (!fs.existsSync(fd)) { fotosDif++; rel.push(`FOTO ${tam}/${f}: não existe no depois`); continue; }
      const ba = fs.readFileSync(fa), bd = fs.readFileSync(fd);
      if (ba.equals(bd)) { fotosIg++; continue; }
      const n = await p.evaluate(pg.pixelsDiferentes, ['data:image/png;base64,' + ba.toString('base64'), 'data:image/png;base64,' + bd.toString('base64')]);
      if (n === 0) { fotosIg++; continue; }
      // Até 100 pixels soltos: ruído do desenho do navegador (acontece mesmo sem mudar nada)
      if (n !== -1 && parseInt(n, 10) <= RUIDO) { ruido++; rel.push(`ruído ${tam}/${f}: ${n}`); continue; }
      fotosDif++; rel.push(`FOTO ${tam}/${f}: ${n === -1 ? 'tamanho diferente' : n}`);
    }
  }
  await p.close();
  for (const chave of Object.keys(A.telas)) {
    const l = diferencas(A, B, chave);
    if (!l.length) continue;
    telasDif++; rel.push(`ESTILO ${chave}: ${l.length} diferença(s)`, ...l.slice(0, 40).map(x => '  ' + x));
  }
  const total = Object.keys(A.telas).length;
  const resumo = `Fotos: ${fotosIg} iguais, ${ruido} com ruído (até ${RUIDO} pixels soltos), ${fotosDif} diferentes. Estilos: ${total - telasDif} de ${total} telas iguais.`;
  fs.writeFileSync(path.join(raiz, 'build', 'previas', 'antes-depois.txt'), [resumo, ...rel].join('\n') + '\n');
  return { resumo, ok: !fotosDif && !telasDif };
}

// Folha para o dono: cada tela com o antes à esquerda e o depois à direita
async function folha(b, tam) {
  const vp = TODOS[tam], larg = vp.width > vp.height ? 360 : 200;
  const fotos = fs.readdirSync(path.join(pasta, 'depois', tam)).filter(f => f.endsWith('.png')).sort();
  const img = (q, f) => `<img src="file://${path.join(pasta, q, tam, f)}" style="width:${larg}px;border:1px solid #888">`;
  const html = `<body style="margin:0;padding:12px;background:#ddd;font:14px sans-serif;display:flex;flex-wrap:wrap;gap:16px;width:${(larg * 2 + 28) * 3}px">` +
    fotos.map(f => `<figure style="margin:0">${img('antes', f)} ${img('depois', f)}<figcaption>${f.replace('.png', '')} — antes | depois</figcaption></figure>`).join('') + '</body>';
  const arq = path.join(pasta, `folha-${tam}.html`);
  fs.writeFileSync(arq, html);
  const p = await b.newPage({ viewport: { width: (larg * 2 + 28) * 3 + 24, height: 400 } });
  await p.goto('file://' + arq); await p.waitForTimeout(300);
  const png = path.join(raiz, 'build', 'previas', `antes-depois-${tam}.png`);
  await p.screenshot({ path: png, fullPage: true });
  await p.close(); fs.unlinkSync(arq);
  return path.relative(raiz, png);
}

(async () => {
  const modo = process.argv[2];
  if (!['antes', 'depois', 'comparar'].includes(modo)) { console.log('Uso: node build/antes-depois.js antes|depois|comparar'); process.exit(2); }
  const b = await chromium.launch();
  if (modo !== 'comparar') {
    const erros = await rodada(b, path.join(pasta, modo));
    console.log(`${modo}: ${Object.keys(TODOS).length} tamanhos × ${TELAS.length + TELAS_EXTRAS.length} telas guardados`);
    if (erros.length) console.log('  ERRO: ' + erros.slice(0, 5).join(' | '));
  }
  let ok = true;
  if (modo !== 'antes') {
    const r = await comparar(b);
    ok = r.ok;
    console.log(r.resumo + (ok ? ' Nada mudou na tela.' : ' Detalhes: build/previas/antes-depois.txt'));
    for (const tam of ['celular', 'tablet-deitado']) console.log('  folha: ' + await folha(b, tam));
  }
  await b.close();
  process.exit(ok ? 0 : 1);
})();

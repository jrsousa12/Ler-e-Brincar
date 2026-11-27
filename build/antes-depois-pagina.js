// Peças do motor antes/depois (build/antes-depois.js) que rodam dentro da página ou no navegador.
'use strict';

// Sorteio sempre igual (mesma ordem de botões nas duas rodadas) e clicar() das telas extras
const SORTEIO_FIXO = `(() => { let s = 42; Math.random = () => { s |= 0; s = s + 0x6D2B79F5 | 0;
  let t = Math.imul(s ^ s >>> 15, 1 | s); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
  return ((t ^ t >>> 14) >>> 0) / 4294967296; }; })();
window.clicar = (sel, n = 0) => { const e = document.querySelectorAll(sel)[n]; if (e) e.click(); };`;

// Para as animações: as que repetem são canceladas; as outras vão para o fim. Repete até
// nenhuma começar de novo (a festa começa uma animação quando a anterior acaba).
async function congelar() {
  const quadro = () => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
  for (let volta = 0; volta < 6; volta++) {
    const vivas = document.getAnimations().filter(a => a.playState === 'running' || a.playState === 'pending');
    if (!vivas.length && volta) break;
    vivas.forEach(a => {
      try { if (a.effect && a.effect.getTiming().iterations === Infinity) a.cancel(); else a.finish(); } catch (e) { a.cancel(); }
    });
    await quadro();
  }
  window.scrollTo(0, 0);
}

// Estilo final de cada elemento da tela: [caminho, "propriedade:valor" de todas as propriedades]
function estilos() {
  const texto = (cs) => { const l = []; for (let i = 0; i < cs.length; i++) l.push(cs[i] + ':' + cs.getPropertyValue(cs[i])); return l.join('\n'); };
  const nome = (e) => e.tagName.toLowerCase() + (typeof e.className === 'string' && e.className.trim() ? '.' + e.className.trim().split(/\s+/).join('.') : '');
  const saida = [];
  const visitar = (e, caminho) => {
    if (e.tagName === 'HEAD' || (e.classList && e.classList.contains('confete'))) return;   // <head> não aparece; confete cai em lugar sorteado
    saida.push([caminho, texto(getComputedStyle(e))]);
    for (const p of ['::before', '::after']) {
      const cs = getComputedStyle(e, p);
      if (cs.content && cs.content !== 'none' && cs.content !== 'normal') saida.push([caminho + p, texto(cs)]);
    }
    // Desenho de colorir tem milhares de partes iguais: bastam as primeiras
    const filhos = [...e.children].slice(0, e.closest('.svg-colorir svg') ? 5 : Infinity);
    filhos.forEach((f, i) => visitar(f, caminho + '>' + nome(f) + ':' + i));
  };
  visitar(document.documentElement, 'html');
  return saida;
}

// Compara duas fotos (data URL) pixel a pixel; devolve 0 (iguais), -1 (tamanho diferente) ou onde mudou
async function pixelsDiferentes([a, b]) {
  const carregar = (src) => new Promise(r => { const i = new Image(); i.onload = () => r(i); i.src = src; });
  const [ia, ib] = await Promise.all([carregar(a), carregar(b)]);
  if (ia.width !== ib.width || ia.height !== ib.height) return -1;
  const dados = (img) => { const c = document.createElement('canvas'); c.width = img.width; c.height = img.height;
    const g = c.getContext('2d'); g.drawImage(img, 0, 0); return g.getImageData(0, 0, c.width, c.height).data; };
  const da = dados(ia), db = dados(ib);
  let n = 0, x0 = 1e9, y0 = 1e9, x1 = -1, y1 = -1;
  for (let i = 0; i < da.length; i += 4) {
    if (da[i] === db[i] && da[i + 1] === db[i + 1] && da[i + 2] === db[i + 2]) continue;
    n++; const x = (i / 4) % ia.width, y = Math.floor(i / 4 / ia.width);
    x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x); y1 = Math.max(y1, y);
  }
  return n ? `${n} pixels diferentes em x ${x0}–${x1}, y ${y0}–${y1}` : 0;
}

module.exports = { SORTEIO_FIXO, congelar, estilos, pixelsDiferentes };

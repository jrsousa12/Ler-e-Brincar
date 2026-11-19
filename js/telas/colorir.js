// Telas "Colorir" (lista) e "Colorir item" (pintar o desenho tocando nas partes).
LB.usarColorir = function (ctx) {
  'use strict';
  const { ref, nextTick } = Vue;
  const colorirAtual = ref(null);
  const svgRef = ref(null);
  const corAtual = ref('#FF6B6B');
  const paletaCores = ['#FF6B6B', '#FFA94D', '#FFD43B', '#51CF66', '#4DABF7', '#9775FA', '#F783AC', '#8B5E3C', '#212529', '#FFFFFF'];

  function abrirColorir(c) {
    colorirAtual.value = c;
    ctx.tela.value = 'colorir-item';
    nextTick(() => { if (svgRef.value) svgRef.value.innerHTML = c.svg; });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function pintarForma(e) {
    const el = e.target;
    if (!el || el.tagName === 'svg') return;
    if (el.tagName === 'line') el.setAttribute('stroke', corAtual.value);
    else if (['path', 'circle', 'ellipse', 'rect', 'polygon'].includes(el.tagName)) el.setAttribute('fill', corAtual.value);
  }

  function resetarDesenho() {
    if (svgRef.value && colorirAtual.value) svgRef.value.innerHTML = colorirAtual.value.svg;
  }

  function concluirColorir() {
    if (colorirAtual.value) ctx.marcarConcluido(colorirAtual.value.id);
    ctx.irPara('colorir');
  }

  return { colorirAtual, svgRef, corAtual, paletaCores, abrirColorir, pintarForma, resetarDesenho, concluirColorir };
};

// Aviso amigável quando o app dá erro: em vez de tela parada, mostra "Recomeçar" (o progresso fica guardado no aparelho).
// Não depende de Vue nem de CSS: funciona mesmo se o resto não carregou.
(function () {
  'use strict';
  const IGNORAR = /ResizeObserver|Script error\.?$/;
  let aberto = false;

  function mostrar(motivo) {
    if (aberto || typeof document === 'undefined' || !document.body) return false;
    aberto = true;
    const caixa = document.createElement('div');
    caixa.id = 'aviso-erro';
    caixa.setAttribute('role', 'alert');
    caixa.style.cssText = 'position:fixed;inset:0;z-index:99999;display:flex;align-items:center;justify-content:center;padding:16px;background:rgba(0,0,0,.55);font-family:system-ui,sans-serif';
    caixa.innerHTML =
      '<div style="max-width:360px;background:#fff;color:#222;border-radius:20px;padding:24px;text-align:center;box-shadow:0 8px 24px rgba(0,0,0,.3)">' +
      '<div style="font-size:48px">🙈</div>' +
      '<h2 style="margin:8px 0;font-size:22px">Ops! Algo deu errado</h2>' +
      '<p style="margin:0 0 16px;font-size:17px;line-height:1.4">Não se preocupe: suas estrelas estão guardadas. Toque em Recomeçar.</p>' +
      '<button type="button" id="aviso-erro-botao" style="font-size:20px;font-weight:700;padding:12px 28px;border:0;border-radius:14px;background:#2f7de1;color:#fff;box-shadow:0 4px 0 #1b559f;cursor:pointer">Recomeçar</button>' +
      '</div>';
    document.body.appendChild(caixa);
    caixa.querySelector('#aviso-erro-botao').onclick = () => location.reload();
    if (typeof console !== 'undefined') console.error('Erro no app:', motivo);
    return true;
  }

  // Só erros de verdade; falhas sem importância (ex.: ResizeObserver) não assustam a criança.
  function tratar(erro, msg) {
    const texto = String(msg || (erro && erro.message) || erro || '');
    if (IGNORAR.test(texto)) return false;
    return mostrar(texto);
  }

  window.LB = window.LB || {};
  LB.avisoErro = { mostrar, tratar };
  if (typeof window.addEventListener === 'function') {
    window.addEventListener('error', e => { if (e.error || e.message) tratar(e.error, e.message); });
  }
})();

// Liga o modo sem internet (só em https ou localhost; em arquivo aberto direto, ignora).
// Versão nova baixada: avisa o app (evento 'lb-versao-nova'); LB.sw.atualizar() troca e recarrega.
LB.sw = { esperando: null, atualizar() {} };
if ('serviceWorker' in navigator && /^(https:|http:\/\/localhost|http:\/\/127\.0\.0\.1)/.test(location.href)) {
  const avisar = (w) => { LB.sw.esperando = w; window.dispatchEvent(new Event('lb-versao-nova')); };
  LB.sw.atualizar = () => {
    if (!LB.sw.esperando) return location.reload();
    navigator.serviceWorker.addEventListener('controllerchange', () => location.reload());
    LB.sw.esperando.postMessage({ tipo: 'ativar' });
  };
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js').then(reg => {
      if (reg.waiting && navigator.serviceWorker.controller) avisar(reg.waiting);
      reg.addEventListener('updatefound', () => {
        const novo = reg.installing;
        if (!novo) return;
        novo.addEventListener('statechange', () => {
          if (novo.state === 'installed' && navigator.serviceWorker.controller) avisar(novo);
        });
      });
    }).catch(() => {});
  });
}

// Liga o modo sem internet (só em https ou localhost; em arquivo aberto direto, ignora).
if ('serviceWorker' in navigator && /^(https:|http:\/\/localhost|http:\/\/127\.0\.0\.1)/.test(location.href)) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js').catch(() => {});
  });
}

# Biblioteca de peças dos desenhos de colorir

O motor aprende só com os desenhos novos do Gemini (decisão do dono, 24/11): as peças antigas foram apagadas.
Cada `<g data-peca="nome">` dos lotes `build/pedidos/colorir-gemini-<n>.js` vira uma peça em `aprendidas.js`.

## Receita de um lote novo (seguir sempre nesta ordem)
1. Salvar o lote do dono em `build/pedidos/colorir-gemini-<n>.js` (`module.exports = [{ id, svg }]`).
2. `node build/colorir.js build/pedidos/colorir-gemini-<n>.js` → mostrar a prévia ao dono.
3. Aprovado: `node build/colorir.js ... --gravar`.
4. `node build/aprender.js` (regera `aprendidas.js`, `PECAS.md` e a foto `build/previas/pecas.png`).
5. `node build/tudo.js`; subir `VERSAO` em `sw.js`.

## Regras
- `aprendidas.js` e `PECAS.md` são gerados: nunca editar à mão.
- Mesmo nome com outro formato em outro desenho ganha número (`bochecha2`); a cópia repetida no mesmo desenho (2ª orelha) é o outro lado.
- Usar num desenho: `p.nome()` fica onde foi aprovada; `p.nome({ x, y, e, espelho })` move, aumenta/diminui, vira; `p.par(p.nome)` faz o par simétrico.
- Desenho que não vier do Gemini: o que faltar, desenhar com `f()`/`solto()` do kit `build/desenho.js`.

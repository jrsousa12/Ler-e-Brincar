# Biblioteca de peças dos desenhos de colorir

O motor aprende com cada desenho aprovado: as partes viram peças aqui e os próximos desenhos são montados com elas.

## Receita de um desenho novo (seguir sempre nesta ordem)
1. Ler `PECAS.md` (lista gerada) e, se precisar ver, a foto `build/previas/pecas.png`.
2. Montar o pedido em `build/pedidos/<lote>.js` com as peças (exemplo: `build/pedidos/colorir-modelos.js`).
   - `p.nome()` fica onde foi aprovada; `p.nome({ x, y, e, espelho })` move, aumenta/diminui, vira; `p.par(p.nome)` faz o par simétrico.
3. Só o que **não** existe na biblioteca é desenhado à mão com `f()`/`solto()` do kit `build/desenho.js`.
4. `node build/colorir.js build/pedidos/<lote>.js` → olhar a prévia; mostrar ao dono e ajustar até ele aprovar.
5. Aprovado: cada parte nova que sirva a outros desenhos vira peça na ficha do tema (aviso "forma(s) fora da biblioteca").
   Refazer o pedido usando a peça nova, conferir que ficou igual e rodar `node build/biblioteca.js` (atualiza `PECAS.md`).
6. `node build/colorir.js ... --gravar` e `node build/tudo.js`.

## Regras de uma peça
- Ficha por tema: `animais.js`, `natureza.js`, `ceu.js`, `construcoes.js` (tema novo: criar a ficha e pôr em `TEMAS` no `index.js`).
- Campos: `nome` (camelCase, único), `descricao` (uma frase: o que é e qual lado), `ancora` (ponto de encaixe), `desenho(o)`.
- Desenhar nas coordenadas do desenho aprovado; peça pequena e solta (maçã, flor) em volta de 0,0.
- Peça de um lado só: desenhar um lado e dizer na descrição; o outro sai com `espelho`.
- Opções de tamanho (`o.l`, `o.meia`...) só quando o mesmo formato aparece em tamanhos diferentes.
- Modelo inteiro aprovado também pode virar peça (ex.: `arvoreMacas`), para usar de fundo.
- Nunca mudar o formato de uma peça já usada sem rever os desenhos que a usam (`node build/item.js --busca nomeDaPeca`).

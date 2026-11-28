# Testes guardados (`testes/`)

- Um arquivo por assunto (`t_<assunto>.js`); antes de criar, ampliar o que já existe. Teste novo entra nas etapas e no mapa de `build/fichas/etapas.json`.
- Ajudantes comuns: `_navegador.js` (abrir o app no navegador: `novaPagina`, `abrirApp`) e `_gerador.js` (cópia do conteúdo para os geradores).
- Rodar todos: `node build/tudo.js` (`--rapido` sem navegador).

## Lista
- `node testes/t_conteudo.js` (regra de resposta certa + validador)
- `node testes/t_app.js` (abre o app no navegador; `CAPTURAS=pasta` salva fotos; teste de navegador novo usa `testes/_navegador.js`: `novaPagina`, `abrirApp`)
- `node testes/t_sorteio.js` (sorteio da ordem das opções)
- `node testes/t_caderno.js` (caderno de erros e pontos fracos na missão)
- `node testes/t_nivel.js` (nível que sobe e desce por habilidade, `js/nivel.js`, guardado no caderno)
- `node testes/t_backup.js` (cópia de segurança)
- `node testes/t_silabas.js` (brincadeira Monte a Palavra, `js/telas/silabas.js`)
- `node testes/t_brincadeiras.js` (Memória e Som e Figura, `js/telas/memoria.js` e `somfigura.js`, palavras de `conteudo/silabas.js`)
- `node testes/t_mercado.js` (Mercadinho: pagar certinho, troco e dois produtos; contas em `js/mercadoregras.js`, produtos e preços em `conteudo/mercado.js`)
- `node testes/t_trem.js` (Trem dos números: sequências de 2, 5 e 10; contas em `js/tremregras.js`)
- `node testes/t_ordem.js` (Ordem dos Fatos: pôr 3 fatos em ordem; sequências em `conteudo/ordem.js`)
- `node testes/t_pacote.js` (Pacotes de contas: questões do banco de Matemática em pacotes de 4 por habilidade BNCC, ligadas ao caderno de erros; regras em `js/pacoteregras.js`)
- `node testes/t_estilos.js` (organização do CSS: todo arquivo no `index.html` e no `sw.js`, peças antes das telas, cada seletor com um só dono; lista de telas do motor antes/depois)

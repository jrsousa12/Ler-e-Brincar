# Roteiro para pedir desenhos de colorir ao Gemini (imagens)

Como usar: rode `node build/pedir.js desenho` (preenche a lista do que ainda falta e diz onde salvar), abra o Gemini, cole o texto e peça os desenhos um de cada vez.
Salve cada imagem em `build/pedidos/imagens/<número>-<nome>.jpg` (ex.: `06-flor.jpg`) e mande para o Claude dizendo o número de cada uma; ele roda `node build/vetorizar.js`.

---- INÍCIO ----

Você vai desenhar [QUANTIDADE] páginas de livro de colorir para uma criança de 8 anos, UMA IMAGEM POR VEZ.
Todas devem ter exatamente o mesmo estilo, o de um livro de colorir infantil moderno, alegre e fofo.

## Estilo (igual em todas as imagens)

- Imagem quadrada (1:1), fundo branco puro, com uma margem branca em volta. Sem moldura.
- Só traço preto sobre o branco: nada de cinza, sombra, hachura, degradê, cor ou preenchimento.
  A única parte preenchida de preto são as pupilas dos olhos (com um pontinho branco de brilho).
- Contorno externo do personagem GROSSO e firme; linhas de dentro (detalhes) mais finas.
- Todas as formas bem FECHADAS: sem falhas, sem linha que não se encontra, sem traço tracejado.
  (Cada espaço fechado vira uma parte que a criança pinta com um toque.)
- Personagem grande no centro, ocupando uns 70% da imagem, com carinha simpática:
  olhos grandes e redondos e um sorriso.
- Em volta, só poucos elementos de cenário, separados e simples (nuvens, sol, flores, grama, pedrinhas, borboleta).
- Áreas grandes e fáceis de pintar para uma criança de 8 anos: no máximo uns 60 espaços para colorir.
  Evite texturas pequenas e repetidas (pelos, escamas, folhinhas em excesso), traços muito juntos e detalhes minúsculos.
- Sem texto, letras, números, assinatura ou marca d'água.

## Os desenhos (faça um de cada vez, nesta ordem)

[LISTA]

Comece pelo primeiro. Quando eu disser "próximo", faça o seguinte da lista.
Desenhe o assunto de cada um com a sua própria cena (não repita o cenário do anterior).
Se uma imagem sair com traço aberto, cinza ou detalhe demais, refaça antes de passar para a próxima.

---- FIM ----

# Roteiro para pedir ideias de brincadeiras novas a outra IA

Como usar: rode `node build/pedir.js ideia` (preenche tudo e diz onde salvar), ou copie de "INÍCIO" até "FIM" e troque os [colchetes].
Quando a resposta chegar, salve em `build/pedidos/ideia-<lote>.txt`, escolha a ideia de que mais gostou e peça ao Claude:
"leia build/pedidos/ideia-<lote>.txt e monte a ideia N". Ele usa `node build/nova-brincadeira.js`.

---- INÍCIO ----

Você vai sugerir [QUANTIDADE] ideias de brincadeiras curtas para um app de celular e tablet,
para uma criança de 8 anos (BNCC, 2º e 3º ano do Ensino Fundamental) que tem dificuldade em
Língua Portuguesa e Matemática. Ela usa sozinha, em casa, sem internet.

## Como o app funciona (as ideias precisam caber nisto)

- Cada brincadeira é uma rodada de 5 a 8 desafios. A cada desafio a criança toca em botões grandes
  (2 a 6 botões, com palavra, número ou emoji) e recebe "acertou" ou "tente de novo".
- O app NÃO tem: arrastar com o dedo, desenhar, câmera, microfone, tempo correndo, placar contra outra pessoa,
  internet, imagens de fora (só emojis e texto).
- O app PODE: falar uma frase em voz alta, mostrar emojis, mostrar números e palavras, sortear a ordem dos botões.
- Brincadeiras que o app já tem (não repita): [JÁ EXISTEM].

## Formato da resposta

Responda SOMENTE no formato abaixo, uma ideia depois da outra, sem texto antes ou depois:

## Ideia 1: Nome curto da brincadeira
- emoji: 🕐
- matéria: mat (ou lp)
- habilidade BNCC: EF02MA18 (o código oficial)
- o que a criança aprende: uma frase.
- como é um desafio: o que aparece na tela, o que a criança toca e qual é a resposta certa.
- exemplo 1: tela: ... | botões: ..., ..., ... | certa: ...
- exemplo 2: tela: ... | botões: ..., ..., ... | certa: ...
- exemplo 3: tela: ... | botões: ..., ..., ... | certa: ...
- erros típicos: quais erros as respostas erradas imitam (erros que uma criança de 8 anos costuma fazer).
- como fica mais difícil: o que muda do desafio fácil para o difícil.

## Cuidados

- Pelo menos metade das ideias de [MATÉRIA].
- Regras simples, que a criança entende sem ler instruções longas.
- Nada de violência, medo ou competição; pode ter bichos, comida, casa, escola, natureza.
- Português do Brasil.

---- FIM ----

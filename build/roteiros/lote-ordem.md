# Roteiro para pedir sequências da "Ordem dos Fatos" a outra IA

Como usar: rode `node build/pedir.js ordem` (preenche tudo e diz onde salvar), ou copie de "INÍCIO" até "FIM" e troque os [colchetes].
Quando a resposta chegar, salve em `build/pedidos/ordem-<lote>.txt` e rode `node build/gerar-ordem.js build/pedidos/ordem-<lote>.txt --ver`; se estiver bom, o mesmo com `--gravar`.

---- INÍCIO ----

Você vai criar [QUANTIDADE] sequências de 3 fatos para uma brincadeira de pôr fatos em ordem,
para uma criança de 8 anos (BNCC, 2º e 3º ano do Ensino Fundamental), em português do Brasil.
A criança lê os 3 fatos embaralhados e coloca na ordem em que acontecem.

## Formato da resposta

Responda SOMENTE com as linhas abaixo, uma sequência por linha, sem numerar e sem texto antes ou depois:

Fazendo um sanduíche | Pegou o pão e a manteiga na cozinha. | Passou a manteiga e colocou o queijo. | Comeu o sanduíche sentado à mesa.
Plantando um feijão | Colocou algodão molhado no copinho. | Pôs o feijão em cima do algodão. | Viu nascer um brotinho verde. | enunciado=Ordene o que Lia fez com o feijão:

- 1º campo: um título de 2 a 5 palavras.
- 2º, 3º e 4º campos: os 3 fatos JÁ NA ORDEM CERTA (o app embaralha sozinho).
- 5º campo (opcional): "enunciado=" seguido da pergunta, quando quiser uma diferente da padrão.
- Separe os campos com " | " (espaço, barra, espaço). Não use "|" em outro lugar.

## Regras dos fatos

- Cada fato tem no máximo 12 palavras e termina com ponto.
- Só uma ordem pode fazer sentido: o 2º fato precisa do 1º, e o 3º precisa do 2º.
  Evite fatos que poderiam trocar de lugar (ex.: "escovou os dentes" e "penteou o cabelo").
- Os 3 fatos têm quase o mesmo tamanho, para a ordem não ser adivinhada pelo tamanho.
- Não use números ou palavras que entregam a ordem (primeiro, depois, por fim, no final, 1º).
- Situações de casa, escola, família, bichos, plantas, receitas e brincadeiras; nada assustador ou triste.

## Não repita estes títulos, que o app já tem

[JÁ EXISTEM]

---- FIM ----

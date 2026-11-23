# Roteiro para pedir um lote de questões de Português a outra IA

Como usar: copie tudo da linha "INÍCIO" até "FIM", troque o que está entre [colchetes] e cole na outra IA.
Quando o lote chegar, salve como `build/pedidos/lp-<lote>.json` e rode `node build/importar-lp.js build/pedidos/lp-<lote>.json`.
Se alguma questão fugir das regras, nada é gravado e sai o arquivo `lp-<lote>-conferencia.txt`: cole na outra IA, receba o lote corrigido e importe de novo. Depois, siga o passo "Lote em JSON do dono" do `CLAUDE.md`.

---- INÍCIO ----

Você vai criar [QUANTIDADE] questões de leitura e interpretação de texto em português do Brasil
para uma criança de 8 anos (BNCC, [2º ou 3º] ano do Ensino Fundamental).
Tema do lote: [TEMA, ex.: pistas do texto / causa e consequência / quem fez o quê].

## Formato da resposta

Responda SOMENTE com uma lista em JSON, sem nenhum texto antes ou depois e sem comentários.
Cada questão é um objeto assim:

[
  {
    "id": 1,
    "textoBase": "Lia acordou cedo. Calçou as botas e pegou o guarda-chuva antes de sair.",
    "enunciado": "Qual pista do texto mostra que estava chovendo?",
    "opcoes": [
      "Ela pegou o guarda-chuva.",
      "Ela acordou bem cedo.",
      "Ela saiu sem as botas."
    ],
    "correta": 0,
    "explicacao": "Quem pega guarda-chuva espera chuva. Acordar cedo não tem a ver com o tempo.",
    "tiposErradas": ["trecho", "contrario"]
  }
]

- "id": número de 1 em diante.
- "textoBase": texto curto (2 a 5 frases) que a criança lê. Pode faltar só se o enunciado já trouxer tudo.
- "enunciado": a pergunta, curta e clara.
- "opcoes": exatamente 3 opções.
- "correta": a posição da certa: 0 (primeira), 1 (segunda) ou 2 (terceira). Varie a posição.
- "explicacao": 1 ou 2 frases simples dizendo por que a certa está certa.
- "tiposErradas": o tipo de cada uma das 2 erradas, na ordem em que aparecem (lista abaixo).

## Regras da resposta certa

- Curta: no máximo 45 letras no 2º ano e 60 no 3º ano.
- Quando a pergunta fala em "pista" ou "segundo o texto", a certa usa palavras do próprio texto
  (no máximo 1 palavra nova).
- Só uma opção pode estar certa.

## Regras das respostas erradas

- Cada errada tem quase o mesmo tamanho da certa (nem muito menor, nem muito maior).
- Mesmo jeito de frase da certa: se a certa começa com "Porque" ou "Para", as erradas também.
- A errada nunca pode ser verdade pelo texto.
- Nada de opção absurda que a criança descarta sem ler (lua, neve, dinossauro, foguete, mágica...).
- As duas erradas de uma questão são de tipos DIFERENTES. Tipos aceitos:
  - 2º e 3º ano:
    - "trecho": outra informação verdadeira do texto, mas que não responde à pergunta.
    - "contrario": diz o contrário do que o texto conta.
    - "troca": troca o personagem, o objeto, o lugar ou o momento.
    - "inventado": coisa possível no dia a dia, mas que o texto não conta.
  - Só no 3º ano, também:
    - "parcial": só uma parte da resposta, ou uma parte certa junto com uma errada.
    - "exagero": generaliza ou exagera (sempre, nunca, todos, nenhum).

## Cuidados de escrita

- Português do Brasil, frases curtas, palavras do dia a dia de uma criança.
- Não use o caractere "|" em nenhum lugar.
- Nenhuma opção ou explicação pode começar com uma palavra seguida de "=" (ex.: "nivel=").
- Situações de casa, escola, família, bichos e brincadeiras; nada assustador ou triste demais.

---- FIM ----

# Roteiro para pedir um lote de questões de Matemática a outra IA

Como usar: copie tudo da linha "INÍCIO" até "FIM", troque o que está entre [colchetes] e cole na outra IA.
Quando o lote chegar, salve como `build/pedidos/mat-<lote>.txt` e rode `node build/gerar-mat.js build/pedidos/mat-<lote>.txt` (prévia) e depois com `--gravar`.

---- INÍCIO ----

Você vai criar [QUANTIDADE] questões de Matemática em português do Brasil
para uma criança de 8 anos (BNCC, [2º ou 3º] ano do Ensino Fundamental).
Tema do lote: [TEMA, ex.: problemas de juntar e tirar / dinheiro / dobro e metade / sequências].

## Formato da resposta

Responda SOMENTE com as linhas abaixo, uma questão por linha, sem nenhum texto antes ou depois.
Os campos são separados por " | " (barra em pé com um espaço de cada lado).
Pode separar grupos com uma linha de comentário que começa com "#".

Existem dois tipos de linha.

### Tipo 1: problema com conta (o programa cria as respostas erradas sozinho)

conta | emoji | enunciado | frase final

Exemplos:
# Juntar e tirar
11 - 4 | 🐟 | No aquário havia 11 peixes. Vovô levou 4 para outro aquário. Quantos ficaram? | Ficaram 7 peixes.
8 + 7 | 🪙 | Tito guardou 8 reais num dia e 7 no outro. Quanto guardou ao todo? | Ele guardou 15 reais.
3 x 4 | 🍪 | Cada pacote tem 3 biscoitos. Quantos biscoitos há em 4 pacotes? | São 12 biscoitos.
12 / 3 | 🍬 | Ana repartiu 12 balas entre 3 amigas, igualmente. Quantas cada uma ganhou? | Cada uma ganhou 4 balas.

- "conta": só dois números e um sinal: + (mais), - (menos), x (vezes) ou / (dividir). Ex.: 15 - 6.
- A conta tem que ser exatamente a que resolve o enunciado.
- Na subtração, o primeiro número é maior. Na divisão, a conta dá exata (sem resto).
- "emoji": um emoji só, ligado ao problema (🍎, 🪙 para dinheiro, 🎈, 🐟...).
- "enunciado": a história curta com a pergunta no fim.
- "frase final": a resposta numa frase completa, com o número certo.

### Tipo 2: questão de escolha (você escreve as 3 opções)

? pergunta | *certa | errada | errada | explicação | bncc=CÓDIGO | emoji=EMOJI

Exemplo:
? Qual número vem depois do 49? | *50 | 48 | 59 | Depois do 49 vem o 50. | bncc=EF02MA01 | emoji=🔢

- A linha começa com "?".
- Exatamente 3 opções; a certa leva "*" colado na frente. Varie a posição da certa.
- As erradas são erros que uma criança costuma cometer: contar um a mais ou a menos,
  errar a dezena, trocar a ordem dos algarismos (21 e 12), somar em vez de tirar.
- Nada de errada absurda, longe demais da certa.
- "explicação": 1 ou 2 frases simples dizendo por que a certa está certa.
- "bncc=" é obrigatório. Códigos mais usados:
  - 2º ano: EF02MA01 (comparar e ordenar números), EF02MA04 (compor e decompor), EF02MA05 (fatos de mais e menos),
    EF02MA06 (problemas de mais e menos), EF02MA07 (multiplicação), EF02MA08 (dobro e metade),
    EF02MA09 (sequências), EF02MA20 (dinheiro).
  - 3º ano: EF03MA01 (ler e escrever números), EF03MA03 (fatos básicos), EF03MA05 (cálculo mental),
    EF03MA06 (problemas de mais e menos), EF03MA07 (multiplicação), EF03MA08 (divisão).

## Cuidados de escrita

- Use problemas com conta (tipo 1) sempre que der; o tipo 2 só para o que não é uma conta só.
- Números do tamanho certo: 2º ano até 100; 3º ano até 1000.
- Não use o caractere "|" dentro do texto, só para separar os campos.
- Nenhum texto pode começar com uma palavra seguida de "=", a não ser bncc= e emoji=.
- Português do Brasil, frases curtas, situações de casa, escola, família, bichos e brincadeiras.

---- FIM ----

# Roteiro para pedir um lote de questões de Matemática a outra IA

Como usar: rode `node build/pedir.js mat` (escolhe o tema, preenche tudo e diz onde salvar), ou copie de "INÍCIO" até "FIM" e troque os [colchetes].
Quando o lote chegar, salve como `build/pedidos/mat-<lote>.json` e rode `node build/importar-mat.js build/pedidos/mat-<lote>.json --serie 2` (ou `--serie 3`).
Se alguma questão fugir das regras, nada é gravado e sai o arquivo `mat-<lote>-conferencia.txt`: cole na outra IA, receba o lote corrigido e importe de novo.
Depois: `node build/gerar-mat.js build/pedidos/mat-<lote>.txt` (prévia) e, se estiver bom, o mesmo com `--gravar`.

---- INÍCIO ----

Você vai criar [QUANTIDADE] questões de Matemática em português do Brasil
para uma criança de 8 anos (BNCC, [2º ou 3º] ano do Ensino Fundamental).
Tema do lote: [TEMA, ex.: problemas de juntar e tirar / dinheiro / dobro e metade / sequências].

## Formato da resposta

Responda SOMENTE com uma lista em JSON, sem nenhum texto antes ou depois e sem comentários.
Existem dois tipos de questão. Pode misturar os dois na mesma lista.

### Tipo 1: problema com conta (o programa cria as respostas erradas sozinho)

{
  "id": 1,
  "conta": "11 - 4",
  "resposta": 7,
  "emoji": "🐟",
  "enunciado": "No aquário havia 11 peixes. Vovô levou 4 para outro aquário. Quantos ficaram?",
  "fraseFinal": "Ficaram 7 peixes."
}

- "conta": só dois números e um sinal: + (mais), - (menos), x (vezes) ou / (dividir). Ex.: "15 - 6".
- A conta tem que ser exatamente a que resolve o enunciado.
- Na subtração, o primeiro número é maior. Na divisão, a conta dá exata (sem resto).
- "resposta": o resultado da conta, só o número. Faça a conta com cuidado: o programa confere.
- "emoji": um emoji só, ligado ao problema (🍎, 🪙 para dinheiro, 🎈, 🐟...).
- "enunciado": a história curta, com os dois números da conta escritos com algarismos (11, não "onze"),
  terminando com a pergunta e o ponto de interrogação. No máximo 160 letras.
- "fraseFinal": a resposta numa frase completa, com o número certo.

### Tipo 2: questão de escolha (você escreve as 3 opções)

{
  "id": 2,
  "enunciado": "Qual número vem depois do 49?",
  "opcoes": ["48", "50", "59"],
  "correta": 1,
  "explicacao": "Depois do 49 vem o 50.",
  "bncc": "EF02MA01",
  "emoji": "🔢",
  "tiposErradas": ["trocou_ideia", "dez_a_mais"]
}

- "opcoes": exatamente 3 opções, sem repetir.
- "correta": a posição da certa: 0 (primeira), 1 (segunda) ou 2 (terceira).
- "explicacao": 1 ou 2 frases simples, que dizem a resposta certa e por que ela está certa.
- "bncc": obrigatório (códigos abaixo).
- "emoji": opcional.
- "tiposErradas": o tipo de cada uma das 2 erradas, na ordem em que aparecem. As duas de tipos DIFERENTES:
  - "um_a_mais" / "um_a_menos": contou um a mais ou um a menos.
  - "dez_a_mais" / "dez_a_menos": errou a dezena (59 em vez de 49).
  - "inverteu_algarismos": trocou a ordem dos algarismos (21 e 12).
  - "esqueceu_vai_um": esqueceu o "vai um" da soma.
  - "subtraiu_ao_contrario": na subtração com troca, tirou o menor do maior em cada casa.
  - "trocou_por_soma" / "trocou_por_subtracao": fez a conta errada (somou em vez de tirar, ou o contrário).
  - "um_grupo_a_mais" / "um_grupo_a_menos": contou um grupo a mais ou a menos na multiplicação.
  - "trocou_ideia": confundiu uma ideia com outra (antes e depois, dobro e metade, par e ímpar, maior e menor).
  - "contrario": diz o contrário da certa (sim e não, sobra e falta).
  - "perto": número perto da certa, que a criança daria contando errado.
- Se a certa é um número, as erradas também são números, e perto dela
  (diferença de no máximo 10, ou de metade da certa quando ela for grande).
- A certa NÃO pode ficar no meio, à mesma distância das duas erradas (ex.: 49, 50, 51 ou 40, 50, 60):
  a criança acertaria sem pensar.
- Nada de errada absurda, que a criança descarta sem pensar.
- Códigos BNCC mais usados:
  - 2º ano: EF02MA01 (comparar e ordenar números), EF02MA04 (compor e decompor), EF02MA05 (fatos de mais e menos),
    EF02MA06 (problemas de mais e menos), EF02MA07 (multiplicação), EF02MA08 (dobro e metade),
    EF02MA09 (sequências), EF02MA20 (dinheiro).
  - 3º ano: EF03MA01 (ler e escrever números), EF03MA03 (fatos básicos), EF03MA05 (cálculo mental),
    EF03MA06 (problemas de mais e menos), EF03MA07 (multiplicação), EF03MA08 (divisão), EF03MA24 (compras e troco).

## Cuidados de escrita

- Use problemas com conta (tipo 1) sempre que der; o tipo 2 só para o que não é uma conta só.
- Números do tamanho certo: 2º ano até 100; 3º ano até 1000.
- Não use o caractere "|" em nenhum lugar.
- Nenhum texto pode começar com uma palavra seguida de "=" (ex.: "nivel=").
- Português do Brasil, frases curtas, situações de casa, escola, família, bichos e brincadeiras.

---- FIM ----

# Roteiro para pedir palavras do "Monte a Palavra" a outra IA

Como usar: rode `node build/pedir.js silabas` (preenche tudo e diz onde salvar), ou copie de "INÍCIO" até "FIM" e troque os [colchetes].
Quando a resposta chegar, salve em `build/pedidos/silabas-<lote>.txt` e rode `node build/gerar-silabas.js build/pedidos/silabas-<lote>.txt --ver`; se estiver bom, o mesmo com `--gravar`.

---- INÍCIO ----

Você vai criar [QUANTIDADE] palavras para uma brincadeira de montar palavras com sílabas,
para uma criança de 8 anos (BNCC, 2º e 3º ano do Ensino Fundamental), em português do Brasil.
A criança vê o emoji, ouve a dica e junta as sílabas na ordem certa.
Quantas de cada tipo: [NÍVEIS].

## Formato da resposta

Responda SOMENTE com as linhas abaixo, uma palavra por linha, sem numerar e sem texto antes ou depois:

MO-CHI-LA | 🎒 | Levo nas costas para a escola.
FO-CA | 🦭 | Nada no mar e bate palmas.

- 1º campo: a palavra em LETRAS MAIÚSCULAS, separada em sílabas por "-", do jeito que se separa na escola.
- 2º campo: UM emoji que mostra a palavra (a criança precisa reconhecer só pelo desenho).
- 3º campo: uma dica curta (até 10 palavras) que NÃO diz a palavra nem parte dela.
- Separe os campos com " | " (espaço, barra, espaço). Não use "|" em outro lugar.

## Tipos de palavra

- Tipo 1: 2 sílabas simples, de uma consoante e uma vogal (BO-LA, CA-SA, PA-TO).
- Tipo 2: 3 sílabas simples (SA-PA-TO, MA-CA-CO, PI-PO-CA).
- Tipo 3: com sílaba difícil: NH, LH, CH, QU, GU, RR, SS, encontros como BR, PR, TR, CL, ou sílaba com 3 letras
  (GA-LI-NHA, CHU-VA, PRA-TO, CAR-RO).

## Cuidados

- Palavras do dia a dia de uma criança: casa, escola, comida, bichos, brinquedos, natureza.
- Substantivos concretos, que dá para mostrar com um emoji.
- Use acento quando a palavra tem (CA-FÉ, SO-FÁ).
- Não repita estas palavras, que o app já tem: [JÁ EXISTEM].

---- FIM ----

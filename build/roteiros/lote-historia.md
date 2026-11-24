# Roteiro para pedir histórias com perguntas a outra IA

Como usar: rode `node build/pedir.js historia` (preenche tudo e diz onde salvar), ou copie de "INÍCIO" até "FIM" e troque os [colchetes].
Quando a resposta chegar, salve em `build/pedidos/historia-<lote>.txt` e rode `node build/gerar-historia.js build/pedidos/historia-<lote>.txt --ver`; se estiver bom, o mesmo com `--gravar`. Depois, `node build/ajustar-historia.js` revisa as opções.

---- INÍCIO ----

Você vai criar [QUANTIDADE] histórias curtas, cada uma com 3 perguntas, para uma criança de 8 anos
(BNCC, [2º ou 3º] ano do Ensino Fundamental), em português do Brasil.

## Formato da resposta

Responda SOMENTE no formato abaixo, sem texto antes ou depois. Cada história começa com uma linha "=":

= O pão quentinho | 🥖 | nivel=[NÍVEL]
Todo dia, Seu Antônio acende o forno da padaria. O cheiro de pão se espalha pela rua.
Rafael passa lá com o pai e ajuda a contar os pãezinhos. Um dia, ele vê um pacote rasgado e avisa o padeiro.
O padeiro agradece e separa o pacote para o lanche. Rafael sai contente.
? Quem acende o forno da padaria? | *Seu Antônio | Rafael | O pai de Rafael | O texto diz que Seu Antônio acende o forno.
? O que Rafael viu de errado? | *Um pacote rasgado | O forno apagado | A padaria fechada | Rafael viu um pacote rasgado e avisou.
! Por que Rafael saiu contente? | *Porque ajudou o padeiro | Porque ganhou um bolo | Porque a escola fechou | Ele avisou do pacote e o padeiro agradeceu.

- Linha "=": título (2 a 5 palavras) | UM emoji | nivel=[NÍVEL].
- Depois, o texto em 2 ou 3 linhas (parágrafos). O texto todo tem de 5 a 6 frases, cada uma com até 15 palavras.
- Depois, exatamente 3 perguntas:
  - "?" pergunta cuja resposta está escrita no texto (2 assim);
  - "!" pergunta de pista, cuja resposta a criança descobre pelo texto, mas não está escrita (1 assim, a última).
- Cada pergunta: pergunta | *certa | errada | errada | explicação. A certa tem "*" na frente.
- Separe os campos com " | " (espaço, barra, espaço). Não use "|" em outro lugar.

## Regras das opções

- Exatamente 3 opções; só uma certa.
- As 3 opções com quase o mesmo tamanho e o mesmo jeito de frase (se a certa começa com "Porque", as erradas também).
- Erradas de tipos diferentes: outra coisa verdadeira do texto que não responde à pergunta; o contrário do texto;
  troca de personagem, objeto ou lugar; coisa possível que o texto não conta.
- Nada de opção absurda que a criança descarta sem ler (lua, dinossauro, mágica).
- A explicação (1 frase) diz a resposta certa.

## Cuidados

- Situações de casa, escola, família, bichos, natureza e brincadeiras; nada assustador ou triste demais.
- Nenhum texto começa com uma palavra seguida de "=" (exceto o "nivel=" da linha do título).
- Não repita estes títulos, que o app já tem: [JÁ EXISTEM].

---- FIM ----

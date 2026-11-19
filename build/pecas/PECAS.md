# Peças dos desenhos de colorir

Gerado por `node build/biblioteca.js` (não editar à mão). Foto de todas: `build/previas/pecas.png`.

Desenho novo: montar com estas peças; o que faltar, desenhar como peça nova numa ficha de `build/pecas/` e rodar o motor de novo.
Colocar: `p.nome({ x, y, e, espelho })` (sem x/y fica onde foi aprovada; `e` = escala, o traço não engrossa).

## Base (`build/desenho.js`)
- f(tag, atributos, fundo, traço): forma pintável com contorno preto arredondado
- solto(d, traço): enfeite que não pinta (sorriso, bigode, casca, cabinho)
- olho(x, y, r): bolinha preta que não pinta (pupila)
- espelhar(...partes): desenha a metade direita e copia espelhada à esquerda (eixo x=150)
- polar(cx, cy, r, graus): ponto num círculo (raios, pétalas)
- nuvem(x, y, escala): nuvem pequena de céu
- copa(cx, cy, rx, ry, ondas, giro, traço, varia): contorno de folhas ondulado (árvore, arbusto, nuvem fofa)
- colina(y, onda, meio): chão ondulado de ponta a ponta
- svg(...partes): folha 300x300 pronta

## animais (`build/pecas/animais.js`)
- **orelhaGato** (encaixe 116,62): orelha de gato pontuda com a parte de dentro (esquerda; espelho em x=184 para a direita)
- **cabecaGato** (encaixe 150,110): cabeça de gato com tufos de pelo nas bochechas
- **listrasTesta** (encaixe 150,70): três listras de gato rajado na testa
- **olhoGato** (encaixe 131,104): olho de gato amendoado com pupila em pé
- **focinhoGato** (encaixe 150,126): nariz e boca de gato
- **bigodes** (encaixe 112,125): dois fios de bigode (esquerda; espelho para a direita)
- **coleira** (encaixe 150,168): coleira curva no pescoço
- **guizo** (encaixe 150,186): guizo redondo da coleira
- **corpoSentado** (encaixe 150,278): corpo em pera de bicho sentado de frente (ombros estreitos, base larga)
- **coxaSentada** (encaixe 102,278): coxa traseira dobrada, por dentro do corpo (esquerda; espelho em x=198)
- **pernaFrente** (encaixe 137,276): perna dianteira em pé, fina (esquerda; espelho em x=163)
- **pata** (encaixe 100,279): patinha oval com dois dedinhos (opção rx: largura, padrão 17)
- **peitoPelo** (encaixe 150,168): peito de pelo fofo com borda em zigue-zague (fica embaixo da coleira)
- **raboDeitado** (encaixe 216,256): rabo listrado deitado no chão, curvado para cima (sai do lado direito)
- **asaSuperior** (encaixe 156,143): asa de cima de borboleta com círculos e bolinhas (direita)
- **asaInferior** (encaixe 158,170): asa de baixo de borboleta com círculo e bolinhas (direita)
- **antena** (encaixe 156,96): antena curva com bolinha na ponta (direita)
- **corpoInseto** (encaixe 150,175): corpo de inseto em gomos que afinam para baixo
- **cabecaInseto** (encaixe 150,106): cabecinha redonda sorridente de inseto

## natureza (`build/pecas/natureza.js`)
- **tronco** (encaixe 150,286): tronco com dois galhos, raízes abertas, casca e buraquinho
- **copaArvore** (encaixe 150,100): copa de árvore com seis grupos de folhas em camadas (cobre a ponta dos galhos do tronco)
- **maca** (encaixe 0,0): maçã pequena com cabinho (fruta da árvore)
- **flor** (encaixe 0,0): florzinha de quatro pétalas redondas, para o chão
- **tufo** (encaixe 0,284): tufo de grama de três fios (não pinta), base em y=284
- **moita** (encaixe 0,0): moitinha em meia-lua no chão
- **chaoArvore** (encaixe 150,280): chão suave da árvore (colina baixa)
- **arvoreMacas** (encaixe 150,286): árvore inteira aprovada: tronco, copa e sete maçãs (base no centro do tronco)

## ceu (`build/pecas/ceu.js`)
- **raiosSol** (encaixe 150,150): raios de sol em gota, longos e curtos alternados (opção n: quantidade, padrão 12)
- **discoSol** (encaixe 150,150): disco do sol com anel por dentro
- **rostoFeliz** (encaixe 150,150): rosto sorridente: olhos, sobrancelhas, bochechas e boca aberta (cabe num círculo de raio 50)
- **luaCrescente** (encaixe 50,172): lua crescente grossa, aberta para a direita (encaixe no meio da curva de fora)

## construcoes (`build/pecas/construcoes.js`)
- **torre** (encaixe 63,275): bloco de pedra com cantos arredondados: torre, muro, prédio (opções l, a: largura e altura; base no meio)
- **telhadoCone** (encaixe 63,128): telhado em cone de castelo, de lados curvos (opções meia: meia largura 37, altura 68, dobra 5, base 10)
- **janelaArco** (encaixe 63,192): janela em arco (opções meia 11, altura 20, ombro 8; base no meio)
- **portaArco** (encaixe 150,274): porta em arco com maçaneta (base no meio, 40 de largura)
- **bandeira** (encaixe 150,34): mastro com bandeirinha ao vento (encaixe na base do mastro)

## formas (`build/pecas/formas.js`)
- **estrela** (encaixe 0,0): estrela de cinco pontas redondas (opções R: raio de fora 30, r: raio de dentro, padrão 0,47 de R, giro, sw: traço 3)
- **pentagono** (encaixe 0,0): pentágono de cantos redondos, remendo de bola (opções R: raio 22, giro; traço 2,5)

## transportes (`build/pecas/transportes.js`)
- **balaoGomos** (encaixe 150,204): copa de balão de ar quente em três faixas largas (borda, meio, centro) com anel na boca; encaixe no meio da boca, 150,204
- **cestaBalao** (encaixe 150,204): cesta de balão com chama, quatro cordas e duas listras; encaixe no meio da boca do balão, 150,204

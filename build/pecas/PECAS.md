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
- suave(pontos): contorno de curva livre por pontos [x,y] ([x,y,1] = quina); usar f('path', `d="${suave(pts)}"`)
- mancha(cx, cy, r, n, giro): caminho de mancha irregular (pintinha, pedra) no lugar de círculo
- svg(...partes): folha 300x300 pronta

## aprendidas (`build/pecas/aprendidas.js`)
- **caudaGato** (encaixe 243,228): parte "caudaGato" do desenho colorir-01 (colorir-gemini-1)
- **corpoGato** (encaixe 150,216): parte "corpoGato" do desenho colorir-01 (colorir-gemini-1)
- **barrigaGato** (encaixe 150,202): parte "barrigaGato" do desenho colorir-01 (colorir-gemini-1)
- **coxaSentada** (encaixe 106,242): parte "coxaSentada" do desenho colorir-01 (colorir-gemini-1)
- **pata** (encaixe 100,276): parte "pata" do desenho colorir-01 (colorir-gemini-1)
- **pernaFrente** (encaixe 135,236): parte "pernaFrente" do desenho colorir-01 (colorir-gemini-1)
- **orelhaGato** (encaixe 117,68): parte "orelhaGato" do desenho colorir-01 (colorir-gemini-1)
- **cabecaGato** (encaixe 150,108): parte "cabecaGato" do desenho colorir-01 (colorir-gemini-1)
- **listrasTesta** (encaixe 150,69): parte "listrasTesta" do desenho colorir-01 (colorir-gemini-1)
- **olhoGato** (encaixe 128,104): parte "olhoGato" do desenho colorir-01 (colorir-gemini-1)
- **bochecha** (encaixe 150,122): parte "bochecha" do desenho colorir-01 (colorir-gemini-1)
- **focinhoGato** (encaixe 150,127): parte "focinhoGato" do desenho colorir-01 (colorir-gemini-1)
- **bigodes** (encaixe 150,117): parte "bigodes" do desenho colorir-01 (colorir-gemini-1)
- **coleira** (encaixe 150,170): parte "coleira" do desenho colorir-01 (colorir-gemini-1)
- **guizo** (encaixe 150,182): parte "guizo" do desenho colorir-01 (colorir-gemini-1)
- **estrelaPrincipal** (encaixe 150,146): parte "estrelaPrincipal" do desenho colorir-02 (colorir-gemini-1)
- **mioloEstrela** (encaixe 150,151): parte "mioloEstrela" do desenho colorir-02 (colorir-gemini-1)
- **estrelinha** (encaixe 48,47): parte "estrelinha" do desenho colorir-02 (colorir-gemini-1)
- **bochecha2** (encaixe 150,168): parte "bochecha" do desenho colorir-02 (colorir-gemini-1)
- **rostoEstrela** (encaixe 150,162): parte "rostoEstrela" do desenho colorir-02 (colorir-gemini-1)
- **coracaoExterno** (encaixe 150,148): parte "coracaoExterno" do desenho colorir-03 (colorir-gemini-1)
- **coracaoMedio** (encaixe 150,161): parte "coracaoMedio" do desenho colorir-03 (colorir-gemini-1)
- **coracaoCanto** (encaixe 52,63): parte "coracaoCanto" do desenho colorir-03 (colorir-gemini-1)
- **brilhoCoracao** (encaixe 96,96): parte "brilhoCoracao" do desenho colorir-03 (colorir-gemini-1)
- **florCentro** (encaixe 150,150): parte "florCentro" do desenho colorir-03 (colorir-gemini-1)
- **colina** (encaixe 150,274): parte "colina" do desenho colorir-04 (colorir-gemini-1)
- **solCanto** (encaixe 248,48): parte "solCanto" do desenho colorir-04 (colorir-gemini-1)
- **nuvem** (encaixe 52,41): parte "nuvem" do desenho colorir-04 (colorir-gemini-1)
- **chamine** (encaixe 208,60): parte "chamine" do desenho colorir-04 (colorir-gemini-1)
- **paredeCasa** (encaixe 150,195): parte "paredeCasa" do desenho colorir-04 (colorir-gemini-1)
- **telhadoCasa** (encaixe 150,85): parte "telhadoCasa" do desenho colorir-04 (colorir-gemini-1)
- **janelaSotao** (encaixe 150,94): parte "janelaSotao" do desenho colorir-04 (colorir-gemini-1)
- **portaCasa** (encaixe 150,235): parte "portaCasa" do desenho colorir-04 (colorir-gemini-1)
- **janelaCasa** (encaixe 98,177): parte "janelaCasa" do desenho colorir-04 (colorir-gemini-1)
- **flor** (encaixe 52,280): parte "flor" do desenho colorir-04 (colorir-gemini-1)
- **raiosSol** (encaixe 150,150): parte "raiosSol" do desenho colorir-05 (colorir-gemini-1)
- **discoSol** (encaixe 150,150): parte "discoSol" do desenho colorir-05 (colorir-gemini-1)
- **bochecha3** (encaixe 150,162): parte "bochecha" do desenho colorir-05 (colorir-gemini-1)
- **rostoFeliz** (encaixe 150,157): parte "rostoFeliz" do desenho colorir-05 (colorir-gemini-1)

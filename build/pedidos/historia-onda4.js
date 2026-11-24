// Onda 4 de histórias (historia-42 a 61): textos maiores, 3º ano. Rodar: node build/pedidos/historia-onda4.js (acrescenta ao fim de conteudo/historias.js)
// Cada parágrafo é dividido em frases (uma por linha do texto). Pergunta 1 = a do pedido; 2 e 3 criadas.
const cores = ['linear-gradient(135deg,#ffe8cc,#fff3d6)', 'linear-gradient(135deg,#e0f0d0,#d6f5e3)', 'linear-gradient(135deg,#dbeafe,#e0f0ff)', 'linear-gradient(135deg,#fde2f3,#ffe0e0)'];
const frases = ps => ps.flatMap(p => p.split(/(?<=[.!?])\s+/));
const H = (n, titulo, emoji, ps, q) => ({
  id: 'historia-' + n, titulo, autor: 'Domínio público', anoEscolar: 3,
  habilidadesBNCC: ['EF02LP26', 'EF35LP04'], nivel: 3, emoji, corFundo: cores[n % 4], texto: frases(ps),
  perguntas: q.map((x, i) => ({ tipo: i === 2 ? 'inferencia' : 'multipla', enunciado: x[0], opcoes: x[1], correta: x[2], explicacao: x[3] }))
});
const novas = [
H(42, 'O pão quentinho da manhã', '🥖', [
 'Todo dia antes de a escola abrir, Seu Antônio acende o forno da padaria da esquina. O cheiro de pão assando se espalha pela rua e faz muita gente apressar o passo para buscar o café da manhã.',
 'Rafael costumava passar lá com o pai e ajudava a contar os pãezinhos que saíam da assadeira. Certo dia, percebeu que um pacote havia ficado rasgado na ponta e avisou Seu Antônio antes que alguém levasse.',
 'O padeiro agradeceu com um sorriso e separou o pacote para o lanche da equipe. Rafael saiu contente, sentindo que tinha ajudado a evitar desperdício.'], [
 ['O que Rafael percebeu de errado na padaria?', ['Que um pacote de pão estava rasgado na ponta.', 'Que o forno estava apagado.', 'Que a padaria tinha fechado mais cedo.'], 0, 'Rafael notou o pacote rasgado e avisou Seu Antônio para evitar desperdício.'],
 ['Quem acende o forno da padaria todo dia?', ['Rafael', 'Seu Antônio', 'O pai de Rafael'], 1, 'O texto diz que Seu Antônio acende o forno.'],
 ['Por que Rafael saiu contente da padaria?', ['Porque ganhou todos os pães', 'Porque sentiu que ajudou a evitar desperdício', 'Porque a escola foi cancelada'], 1, 'Ele avisou do pacote rasgado e sentiu que ajudou a evitar desperdício.']]),
H(43, 'A planta que precisava de sol', '🌿', [
 'Tia Lúcia tinha um vaso de manjericão em cima da mesa da cozinha, perto de uma janela pequena. Com o passar das semanas, as folhas ficaram mais claras e os ramos começaram a pender para o lado.',
 'Bia observou a planta e lembrou da aula de Ciências sobre luz e crescimento. Ela sugeriu colocar o vaso na varanda durante a manhã, onde batia o sol suave das primeiras horas.',
 'Depois de alguns dias recebendo luz e água na medida certa, o manjericão recuperou a cor verde-escura e o perfume ficou ainda mais forte. Tia Lúcia elogiou a atenção da sobrinha.'], [
 ['Por que as folhas do manjericão estavam ficando mais claras?', ['Porque estavam recebendo pouca luz do sol na mesa da cozinha.', 'Porque estavam dentro da geladeira.', 'Porque tinham sido cortadas com tesoura.'], 0, 'O texto mostra que a planta melhorou ao receber o sol da manhã na varanda.'],
 ['Onde Bia sugeriu colocar o vaso?', ['Na varanda, durante a manhã', 'Dentro do armário', 'Embaixo da pia'], 0, 'Ela sugeriu a varanda, onde batia o sol suave das primeiras horas.'],
 ['O que mostra que o manjericão ficou saudável de novo?', ['As folhas caíram todas', 'Ele recuperou a cor verde-escura e o perfume ficou mais forte', 'Ele ficou menor'], 1, 'A cor e o perfume voltaram, sinal de que a planta melhorou.']]),
H(44, 'O jogo de dominó na varanda', '🎲', [
 'No domingo à tarde, o calor diminuiu e o avô de Tiago puxou uma mesinha de madeira para a varanda. Ele tirou da caixa uma caixinha antiga de dominó e chamou o neto para uma partida.',
 'No começo, Tiago jogava sem pensar muito e acabava ficando sem peças que encaixavam nas pontas. O avô pediu que ele olhasse com calma os números que já estavam na mesa antes de escolher.',
 'Na segunda rodada, Tiago contou os pontos com atenção e planejou suas jogadas. Mesmo quando perdeu por uma peça, riu junto com o avô e combinou outra partida para a semana seguinte.'], [
 ['O que ajudou Tiago a jogar melhor na segunda rodada?', ['Observar os números na mesa e planejar as jogadas com calma.', 'Esconder as peças do avô.', 'Jogar sem olhar as próprias peças.'], 0, 'O avô orientou Tiago a olhar os números na mesa antes de jogar, e ele planejou melhor.'],
 ['Com quem Tiago jogou dominó?', ['Com o pai', 'Com o avô', 'Com a professora'], 1, 'O avô de Tiago o chamou para a partida.'],
 ['Como Tiago reagiu ao perder por uma peça?', ['Ficou bravo e foi embora', 'Riu com o avô e combinou outra partida', 'Escondeu o jogo'], 1, 'Ele riu junto com o avô e combinou outra partida.']]),
H(45, 'A bicicleta com o pneu murcho', '🚲', [
 'Mateus ia pedalar com os amigos no fim da tarde, mas, ao tirar a bicicleta da garagem, percebeu que o pneu de trás estava bem murcho. Se saísse daquele jeito, o passeio ia ficar difícil e podia até estragar a câmara de ar.',
 'Ele pegou a bomba de ar encostada na parede e começou a encher o pneu devagar, conferindo com a mão se estava ficando firme sem ficar duro demais.',
 'Quando o pneu ficou no ponto certo, Mateus testou o freio e saiu para encontrar a turma. Chegou na hora combinada e aproveitou a tarde inteira sem nenhum aperto.'], [
 ['O que Mateus fez antes de sair para pedalar com os amigos?', ['Encheu o pneu traseiro com a bomba de ar e testou o freio.', 'Deixou a bicicleta no quintal e foi a pé.', 'Tirou as duas rodas da bicicleta.'], 0, 'Ele encheu o pneu murcho com a bomba de ar e conferiu o freio antes de sair.'],
 ['Qual pneu estava murcho?', ['O da frente', 'O de trás', 'Os dois'], 1, 'O texto diz que o pneu de trás estava bem murcho.'],
 ['Por que Mateus conferiu o pneu com a mão?', ['Para saber se estava firme, sem ficar duro demais', 'Para deixá-lo murcho', 'Porque estava com frio'], 0, 'Ele queria o pneu firme, mas não duro demais.']]),
H(46, 'A receita de bolo da família', '🎂', [
 'No sábado, Helena e a mãe resolveram preparar um bolo simples para o lanche da tarde. Elas separaram os ingredientes sobre a bancada e leram a receita juntas, passo a passo, para não esquecer nada.',
 'Helena ficou responsável por medir o açúcar e a farinha com o copo medidor, enquanto a mãe misturava tudo com cuidado. As duas conversavam e contavam histórias da infância enquanto o forno esquentava.',
 'Quando o bolo ficou dourado e cresceu bonito, a casa inteira ficou com cheiro doce. Elas esperaram esfriar um pouco para cortar as fatias e servir com suco natural.'], [
 ['Qual foi a tarefa de Helena durante o preparo do bolo?', ['Medir o açúcar e a farinha com o copo medidor.', 'Acender o forno sozinha e cortar o bolo quente.', 'Lavar toda a louça antes de começar.'], 0, 'O segundo parágrafo informa que Helena mediu o açúcar e a farinha.'],
 ['Por que elas leram a receita juntas?', ['Para não esquecer nada', 'Para fazer o bolo mais rápido', 'Porque a receita estava escondida'], 0, 'Leram passo a passo para não esquecer nada.'],
 ['Por que elas esperaram o bolo esfriar um pouco?', ['Porque o bolo estava azedo', 'Para cortar as fatias sem se queimar', 'Porque o suco acabou'], 1, 'Esperar esfriar deixa cortar e servir com segurança.']]),
H(47, 'O caderno perdido no caminho', '📓', [
 'Na volta da escola, Gabriel parou para conversar com dois colegas perto da praça e deixou o caderno de atividades apoiado no banco. Quando chegou em casa, sentiu falta dele ao arrumar a mochila para o dia seguinte.',
 'Ele lembrou exatamente onde tinha parado e voltou depressa com o irmão mais novo. O banco ainda estava lá, mas o caderno não estava mais sobre a madeira.',
 'Os dois olharam em volta e viram o caderno perto de um canteiro, onde uma senhora o havia recolhido para não molhar. A senhora entregou o caderno a Gabriel, que agradeceu bastante e prometeu ter mais atenção.'], [
 ['Onde o caderno de Gabriel foi encontrado?', ['Perto de um canteiro, recolhido por uma senhora para não molhar.', 'Dentro da mochila do irmão.', 'Em cima da geladeira de casa.'], 0, 'Uma senhora havia recolhido o caderno perto de um canteiro para protegê-lo.'],
 ['Quando Gabriel sentiu falta do caderno?', ['Na escola', 'Ao arrumar a mochila em casa', 'Na praça'], 1, 'Ele sentiu falta ao arrumar a mochila para o dia seguinte.'],
 ['O que Gabriel aprendeu com o que aconteceu?', ['A ter mais atenção com suas coisas', 'A nunca mais ir à praça', 'A não usar caderno'], 0, 'Ele prometeu ter mais atenção.']]),
H(48, 'A sombra das árvores no recreio', '🌳', [
 'Durante o recreio, o sol forte deixava o pátio bem quente, e os alunos procuravam os cantos mais frescos para descansar. Um grupo formou uma roda embaixo das mangueiras, onde a sombra deixava o ar mais agradável.',
 'Em vez de correr debaixo do sol quente, eles inventaram um jogo de adivinhação com charadas e rimas. Todo mundo participava, esperando a sua vez de falar sem tumulto.',
 'Quando o sinal tocou avisando o fim do intervalo, todos levantaram calmos e organizados. A roda embaixo da árvore tinha virado o ponto de encontro favorito da turma.'], [
 ['Como o grupo aproveitou a sombra das mangueiras no recreio?', ['Fez uma roda e brincou de adivinhação com charadas e rimas.', 'Jogou bola no meio do sol quente.', 'Dormiu até o fim da aula.'], 0, 'O texto mostra que eles formaram uma roda na sombra e jogaram adivinhações.'],
 ['Por que os alunos procuravam cantos frescos?', ['Porque o sol forte deixava o pátio quente', 'Porque estava chovendo', 'Porque o pátio estava fechado'], 0, 'O sol forte deixava o pátio bem quente.'],
 ['O que mostra que a brincadeira foi organizada?', ['Todos esperavam a sua vez de falar', 'Todos gritavam ao mesmo tempo', 'Ninguém participou'], 0, 'Esperar a vez de falar mostra organização.']]),
H(49, 'A caixa de ferramentas do vizinho', '🔧', [
 'Seu Jorge, vizinho da casa ao lado, estava consertando a dobradiça de um portão que fazia barulho toda vez que abria. Caíam algumas gotas de chuva fina, e ele precisava terminar o serviço antes de escurecer.',
 'Cauã viu que o vizinho procurava uma chave de fenda e foi até a própria casa buscar a que o pai guardava na gaveta. Entregou a ferramenta na mão de Seu Jorge com cuidado.',
 'Com o parafuso bem apertado, o portão parou de ranger e abriu macio. Seu Jorge agradeceu a ajuda rápida de Cauã e mostrou como o ajuste tinha dado certo.'], [
 ['Qual problema o portão de Seu Jorge apresentava?', ['Fazia barulho ao abrir por causa da dobradiça.', 'Estava pintado de azul.', 'Não tinha fechadura.'], 0, 'O primeiro parágrafo diz que o portão fazia barulho toda vez que abria.'],
 ['O que Cauã buscou para ajudar?', ['Uma chave de fenda', 'Um guarda-chuva', 'Uma escada'], 0, 'Ele buscou a chave de fenda que o pai guardava na gaveta.'],
 ['Por que Seu Jorge agradeceu a Cauã?', ['Porque a ajuda rápida o ajudou a terminar o conserto', 'Porque Cauã pintou o portão', 'Porque Cauã levou a chuva embora'], 0, 'Com a ferramenta, o conserto foi concluído e o portão parou de ranger.']]),
H(50, 'O cartaz da feira de ciências', '🔬', [
 'A turma do 5º ano estava preparando um cartaz para explicar como economizar água em casa e na escola. Cada dupla ficou com uma parte: uns desenhavam, outros escreviam frases curtas e legíveis.',
 'Luana e Davi ficaram responsáveis por revisar o texto antes de colar na cartolina. Eles perceberam que duas palavras estavam repetidas e corrigiram com calma para o cartaz ficar claro.',
 'No dia da apresentação, vários visitantes pararam para ler o trabalho e elogiaram os exemplos simples. Luana e Davi explicaram cada dica com segurança.'], [
 ['O que Luana e Davi fizeram antes de colar o texto na cartolina?', ['Revisaram o texto e corrigiram palavras repetidas.', 'Rasgaram o cartaz e desistiram.', 'Pintaram o chão da sala com tinta guache.'], 0, 'Eles revisaram o texto e tiraram palavras repetidas para deixá-lo claro.'],
 ['Qual era o assunto do cartaz?', ['Como economizar água', 'Como plantar feijão', 'Como fazer pipa'], 0, 'O cartaz explicava como economizar água em casa e na escola.'],
 ['O que mostra que o trabalho agradou?', ['Os visitantes pararam para ler e elogiaram', 'Ninguém foi ver', 'O cartaz foi rasgado'], 0, 'Vários visitantes leram e elogiaram os exemplos.']]),
H(51, 'A tarde sem energia elétrica', '🕯️', [
 'No meio da tarde, uma ventania derrubou um galho sobre a fiação e a energia elétrica acabou na rua. A televisão e o ventilador desligaram na mesma hora, deixando a casa silenciosa.',
 'Em vez de ficar reclamando, Sofia abriu as janelas para deixar o vento entrar e pegou dois livros de histórias. Chamou a irmã mais nova para lerem juntas enquanto havia claridade.',
 'Quando a luz voltou no fim da tarde, as duas já tinham terminado uma história inteira. Sofia percebeu que dava para se divertir mesmo sem telas ligadas.'], [
 ['O que Sofia fez quando a energia elétrica acabou?', ['Abriu as janelas e leu histórias com a irmã aproveitando a luz natural.', 'Ligou o ventilador e a televisão.', 'Foi dormir e não acordou mais.'], 0, 'Ela abriu as janelas e leu histórias com a irmã enquanto havia claridade.'],
 ['O que causou a falta de energia?', ['Uma ventania derrubou um galho sobre a fiação', 'Uma chuva de granizo', 'A conta não foi paga'], 0, 'O galho caiu sobre a fiação e a energia acabou na rua.'],
 ['O que Sofia percebeu no fim da tarde?', ['Que dá para se divertir sem telas ligadas', 'Que não existe diversão sem televisão', 'Que ler é chato'], 0, 'Ela percebeu que dava para se divertir mesmo sem telas.']]),
H(52, 'O troco na banca de revistas e jornais', '💵', [
 'Otávio juntou moedas e notas durante duas semanas para comprar um gibi que queria muito ler. Chegou à banca com o dinheiro contado na mão e escolheu o exemplar da prateleira.',
 'O gibi custava quinze reais, e Otávio entregou uma nota de vinte reais ao atendente. Enquanto esperava o troco, conferiu mentalmente quanto deveria sobrar.',
 'Ele recebeu cinco reais de troco, guardou no bolso com cuidado e abriu o gibi logo em seguida. Saiu feliz, sabendo que tinha feito a conta direitinho.'], [
 ['Quanto Otávio recebeu de troco ao pagar R$ 20,00 por um gibi de R$ 15,00?', ['R$ 5,00.', 'R$ 15,00.', 'R$ 25,00.'], 0, 'A diferença entre R$ 20,00 e R$ 15,00 é R$ 5,00.'],
 ['Quanto tempo Otávio levou juntando dinheiro?', ['Um dia', 'Duas semanas', 'Um ano'], 1, 'Ele juntou moedas e notas durante duas semanas.'],
 ['Por que Otávio saiu feliz da banca?', ['Porque conseguiu o gibi e conferiu que o troco estava certo', 'Porque não pagou nada', 'Porque a banca fechou'], 0, 'Ele comprou o gibi e sabia que tinha feito a conta direitinho.']]),
H(53, 'A pipa presa no galho baixo', '🪁', [
 'Durante uma tarde de vento bom, Bruno e o primo empinavam pipa no campo perto de casa. A linha escapou de repente e a pipa acabou pousando em um galho baixo de uma árvore.',
 'Bruno teve vontade de puxar a linha com força para tentar arrancar, mas o primo lembrou que isso podia rasgar o papel. Eles decidiram esperar um pouco e olhar com calma.',
 'Com uma vara comprida e sem pressa, conseguiram soltar a pipa sem estragar nada. Enrolaram a linha direitinho e continuaram brincando com segurança.'], [
 ['Por que o primo pediu para Bruno não puxar a linha com força?', ['Porque puxar com força podia rasgar o papel da pipa.', 'Porque a pipa era feita de ferro.', 'Porque já era de noite.'], 0, 'O segundo parágrafo explica que puxar com força podia rasgar o papel da pipa.'],
 ['Onde a pipa ficou presa?', ['Em um galho baixo de uma árvore', 'No telhado de casa', 'No fio de luz'], 0, 'A pipa pousou em um galho baixo de uma árvore.'],
 ['O que ajudou a soltar a pipa sem estragar?', ['Uma vara comprida e calma', 'Um puxão forte', 'Uma tesoura'], 0, 'Eles usaram uma vara comprida, sem pressa.']]),
H(54, 'A organização dos livros da estante', '📚', [
 'A estante do quarto de Lorena estava tão cheia que os livros ficavam empilhados de qualquer jeito. Na hora de procurar um livro específico, ela demorava bastante e quase sempre bagunçava os outros.',
 'Numa manhã livre, Lorena tirou todos os livros, limpou a poeira das prateleiras com um pano seco e separou os títulos por assunto. Colocou os de histórias de um lado e os de ciências e jogos do outro.',
 'Quando terminou, ficou fácil achar qualquer livro em poucos segundos. Lorena sentiu que o quarto parecia mais organizado e convidativo.'], [
 ['Como Lorena organizou os livros na estante?', ['Separou por assunto depois de limpar as prateleiras.', 'Jogou todos dentro de um saco no chão.', 'Misturou tudo sem limpar.'], 0, 'Ela limpou as prateleiras e separou os livros por assunto.'],
 ['Qual era o problema antes da arrumação?', ['Ela demorava para achar um livro e bagunçava os outros', 'Não havia livros', 'A estante era pequena demais para um livro'], 0, 'Os livros ficavam empilhados e ela demorava para procurar.'],
 ['Qual foi o resultado da arrumação?', ['Ficou fácil achar qualquer livro em poucos segundos', 'Ela perdeu todos os livros', 'A estante quebrou'], 0, 'Depois de organizar, achar um livro ficou rápido.']]),
H(55, 'A visita à horta comunitária', '🥬', [
 'Na sexta-feira, a professora levou a turma para conhecer a horta cuidada pelos moradores do bairro. Havia canteiros de alface, coentro, pimentão e mudas recém-plantadas.',
 'O responsável pela horta mostrou como a terra úmida e fofa ajuda as raízes a crescerem bem. Os alunos fizeram perguntas e anotaram o que acharam mais interessante no caderno.',
 'Na volta para a escola, a turma comentou sobre a importância de cuidar dos espaços coletivos. Todos voltaram inspirados para cuidar melhor do jardim da escola.'], [
 ['O que o responsável pela horta mostrou para os alunos?', ['Como a terra úmida e fofa ajuda as raízes das plantas a crescerem.', 'Como construir um prédio de dez andares.', 'Por que não se deve regar as plantas.'], 0, 'O segundo parágrafo destaca a explicação sobre a terra úmida e fofa para as raízes.'],
 ['Quem cuidava da horta?', ['Os moradores do bairro', 'Os alunos da turma', 'Uma empresa'], 0, 'A horta era cuidada pelos moradores do bairro.'],
 ['O que a visita inspirou os alunos a fazer?', ['Cuidar melhor do jardim da escola', 'Arrancar as plantas', 'Fechar a horta'], 0, 'Todos voltaram inspirados para cuidar melhor do jardim da escola.']]),
H(56, 'A receita do suco natural', '🍊', [
 'O dia estava quente e Pedro resolveu preparar um suco de laranja natural para dividir com a família. Ele lavou bem as frutas na pia antes de cortar ao meio.',
 'Com cuidado para não se machucar, espremeu as metades e coou o suco para tirar os bagaços. Provou um pouquinho e viu que já estava docinho, sem precisar colocar açúcar.',
 'Colocou jarras na mesa com copos para todos e serviu bem gelado. A família elogiou o capricho de Pedro e aproveitou o refresco.'], [
 ['Por que Pedro não precisou colocar açúcar no suco de laranja?', ['Porque provou e viu que o suco já estava docinho.', 'Porque o suco tinha ficado azedo demais.', 'Porque não havia água na cozinha.'], 0, 'O texto informa que ele provou o suco e percebeu que já estava docinho.'],
 ['O que Pedro fez antes de cortar as laranjas?', ['Lavou bem as frutas na pia', 'Colocou açúcar', 'Serviu o suco'], 0, 'Ele lavou bem as frutas antes de cortar ao meio.'],
 ['Por que Pedro preparou o suco?', ['Porque o dia estava quente e queria dividir com a família', 'Porque estava doente', 'Porque ia vender o suco'], 0, 'O dia estava quente e ele quis dividir o suco com a família.']]),
H(57, 'O ensaio da apresentação escolar', '🎭', [
 'Faltava uma semana para a apresentação de teatro da escola, e o grupo ainda errava algumas falas na hora de entrar em cena. Alguns ficavam nervosos e falavam rápido demais.',
 'A professora pediu que todos respirassem fundo, falassem mais devagar e ouvissem uns aos outros com atenção. Repetiram a cena duas vezes seguidas e o ritmo melhorou bastante.',
 'Ao final do ensaio, o grupo percebeu que a calma fazia toda a diferença. Todos saíram mais confiantes para o dia do espetáculo.'], [
 ['O que ajudou o grupo a melhorar durante o ensaio de teatro?', ['Respirar fundo, falar mais devagar e ouvir os colegas com atenção.', 'Gritar o mais alto possível sem olhar para ninguém.', 'Cancelar a apresentação na véspera.'], 0, 'As orientações da professora para falar devagar e ouvir uns aos outros melhoraram o ensaio.'],
 ['Qual era o problema do grupo no começo?', ['Errava falas e alguns falavam rápido demais', 'Ninguém queria ensaiar', 'Não havia professora'], 0, 'O grupo errava falas e alguns falavam rápido por nervosismo.'],
 ['Como o grupo se sentiu ao final do ensaio?', ['Mais confiante', 'Mais nervoso', 'Sem vontade de apresentar'], 0, 'Todos saíram mais confiantes para o espetáculo.']]),
H(58, 'A coleta de tampinhas e garrafas', '♻️', [
 'Durante o mês, os alunos juntaram tampinhas plásticas e garrafas limpas em uma caixa grande na sala. O objetivo era separar o material reciclável em vez de misturar com o lixo comum.',
 'Toda sexta-feira, dois voluntários contavam o que havia sido arrecadado e separavam as tampinhas por cor. Era um momento rápido de organização que envolvia toda a turma.',
 'Ao fim do mês, a caixa estava cheia e pronta para ser encaminhada à reciclagem. A turma comemorou o resultado do trabalho em equipe.'], [
 ['Qual era o objetivo da caixa de tampinhas e garrafas na sala?', ['Separar o material reciclável em vez de misturar com o lixo comum.', 'Guardar brinquedos quebrados para jogar fora.', 'Encher de água para molhar o chão.'], 0, 'O primeiro parágrafo explica que o objetivo era separar o material reciclável do lixo comum.'],
 ['O que os voluntários faziam toda sexta-feira?', ['Contavam o material e separavam as tampinhas por cor', 'Jogavam tudo fora', 'Pintavam as garrafas'], 0, 'Eles contavam o arrecadado e separavam as tampinhas por cor.'],
 ['Por que a turma comemorou no fim do mês?', ['Porque o trabalho em equipe deu resultado', 'Porque a caixa quebrou', 'Porque acabaram as aulas'], 0, 'A caixa ficou cheia, fruto do trabalho em equipe.']]),
H(59, 'A carta para o primo distante', '✉️', [
 'Cauê queria contar para o primo que mora em outra cidade sobre o campeonato de futebol da escola. Em vez de mandar só uma mensagem apressada, decidiu escrever uma carta caprichada.',
 'Ele contou como foram os treinos, quem marcou o gol da vitória e o que tinha acontecido na comemoração. No fim, fez duas perguntas sobre a escola do primo.',
 'Leu tudo de novo para ver se fazia sentido e guardou num envelope com cuidado. Ficou animado imaginando a reação do primo ao ler cada detalhe.'], [
 ['O que Cauê escreveu no final da carta para o primo?', ['Duas perguntas sobre a escola do primo.', 'Uma lista de compras do supermercado.', 'A previsão do tempo do ano inteiro.'], 0, 'O segundo parágrafo diz que no fim ele fez duas perguntas sobre a escola do primo.'],
 ['Sobre o que Cauê queria contar ao primo?', ['O campeonato de futebol da escola', 'Uma viagem de avião', 'Uma festa de aniversário'], 0, 'Ele queria contar sobre o campeonato de futebol da escola.'],
 ['Por que Cauê leu a carta de novo antes de guardar?', ['Para ver se fazia sentido', 'Porque não sabia ler', 'Porque queria rasgar'], 0, 'Ele releu para conferir se a carta fazia sentido.']]),
H(60, 'O conserto da lâmpada do corredor', '💡', [
 'A lâmpada do corredor de casa estava piscando há dois dias e deixava a passagem escura à noite. O pai avisou que ia trocar a lâmpada assim que desligasse o interruptor geral para ter segurança.',
 'Larissa ajudou alcançando a lâmpada nova com as duas mãos, segurando pelo vidro com cuidado. O pai colocou a peça no lugar e testou depois de religar a energia.',
 'A luz acendeu firme e clara, iluminando todo o corredor sem piscar. Larissa achou bom ver como pequenas tarefas ficam seguras quando feitas com atenção.'], [
 ['O que o pai de Larissa fez antes de trocar a lâmpada para ter segurança?', ['Desligou a energia e o interruptor antes de mexer.', 'Subiu numa cadeira com os olhos vendados.', 'Jogou água na tomada.'], 0, 'O texto destaca que o cuidado com a segurança veio ao desligar antes de trocar.'],
 ['Qual era o problema da lâmpada do corredor?', ['Estava piscando há dois dias', 'Estava quebrada no chão', 'Estava muito forte'], 0, 'A lâmpada piscava há dois dias e deixava o corredor escuro.'],
 ['O que Larissa percebeu no final?', ['Que tarefas pequenas ficam seguras quando feitas com atenção', 'Que lâmpadas nunca queimam', 'Que o corredor não precisa de luz'], 0, 'Ela achou bom ver como a atenção deixa as tarefas seguras.']]),
H(61, 'A tarde de jogos de tabuleiro', '🎯', [
 'Chovia forte lá fora, e quatro amigos se reuniram na sala para jogar um jogo de tabuleiro. Antes de começar, leram juntos as regras rápidas para ninguém ter dúvida durante a partida.',
 'Cada um esperava a sua vez de jogar o dado e mover o pino, ajudando quando alguém esquecia uma regra. Mesmo quando a partida ficou disputada, o clima continuou amigável.',
 'No fim da tarde, todos guardaram as peças na caixa para não perder nenhuma. Combinaram de se reunir de novo no próximo sábado chuvoso.'], [
 ['O que os amigos fizeram antes de começar a partida?', ['Leram juntos as regras rápidas do jogo.', 'Esconderam todas as peças da caixa.', 'Foram embora antes de jogar.'], 0, 'O primeiro parágrafo informa que leram juntos as regras rápidas antes de começar.'],
 ['Quantos amigos jogaram?', ['Dois', 'Quatro', 'Dez'], 1, 'O texto diz que quatro amigos se reuniram na sala.'],
 ['Por que guardaram as peças na caixa no fim?', ['Para não perder nenhuma', 'Para jogar fora', 'Para esconder da chuva'], 0, 'Guardar na caixa evita perder peças.']])
];
const fs = require('fs'), arq = __dirname + '/../../conteudo/historias.js';
let t = fs.readFileSync(arq, 'utf8');
if (t.includes("id:'historia-42'")) { console.log('já gravado'); process.exit(0); }
const aq = s => "'" + String(s).replace(/\\/g, '\\\\').replace(/'/g, "\\'") + "'";
const ser = v => Array.isArray(v) ? '[' + v.map(ser).join(',') + ']' : typeof v === 'object' ? '{' + Object.entries(v).map(([k, x]) => k + ':' + ser(x)).join(',') + '}' : typeof v === 'number' ? v : aq(v);
const linhas = novas.map(h => ',\n' + ser(h)).join('');
t = t.replace(/\n\];\s*$/, linhas + '\n];\n');
fs.writeFileSync(arq, t);
console.log('gravadas', novas.length);

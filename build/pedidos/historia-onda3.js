// Onda 3 de histórias (historia-31 a 40). Rodar: node build/pedidos/historia-onda3.js  (acrescenta ao fim de conteudo/historias.js)
const H = (n, titulo, emoji, nivel, cor, texto, p) => ({
  id: 'historia-' + n, titulo, autor: 'Domínio público', anoEscolar: 2,
  habilidadesBNCC: ['EF02LP26', nivel === 1 ? 'EF15LP03' : 'EF15LP04'], nivel, emoji, corFundo: cor, texto,
  perguntas: p.map((q, i) => ({ tipo: i === 2 ? 'inferencia' : 'multipla', enunciado: q[0], opcoes: q[1], correta: q[2], explicacao: q[3] }))
});
const novas = [
H(31, 'O cachorro Pipoca', '🐶', 1, 'linear-gradient(135deg,#fff3d6,#ffe5b4)', [
  'Pipoca era um cachorro muito brincalhão.',
  'Todo dia ele corria atrás da bola no jardim.',
  'Um dia, a bola caiu num buraco pequeno.',
  'Pipoca latiu e chamou a menina Ana.',
  'Ana pegou a bola e deu um abraço em Pipoca.'], [
  ['Quem era Pipoca?', ['Um gato', 'Um cachorro', 'Um coelho'], 1, 'O texto diz que Pipoca era um cachorro.'],
  ['Onde a bola caiu?', ['Num buraco pequeno', 'No rio', 'Na casa'], 0, 'A bola caiu num buraco pequeno.'],
  ['Por que Pipoca latiu e chamou Ana?', ['Queria dormir', 'Precisava de ajuda para pegar a bola', 'Estava com fome'], 1, 'Ele não conseguia pegar a bola, então pediu ajuda.']]),
H(32, 'O leão e o ratinho', '🦁', 2, 'linear-gradient(135deg,#ffe8c2,#ffd9a0)', [
  'Um leão dormia debaixo de uma árvore grande.',
  'Um ratinho passou correndo e acordou o leão.',
  'O leão ficou bravo, mas o ratinho pediu desculpas.',
  'O leão sorriu e deixou o ratinho ir embora.',
  'Dias depois, o leão ficou preso numa rede.',
  'O ratinho roeu as cordas e salvou o leão.'], [
  ['Onde o leão dormia?', ['Dentro de uma toca', 'Debaixo de uma árvore', 'Na beira do rio'], 1, 'O leão dormia debaixo de uma árvore grande.'],
  ['O que o ratinho roeu?', ['As cordas da rede', 'Um pedaço de pão', 'Uma folha'], 0, 'Ele roeu as cordas e salvou o leão.'],
  ['Por que o ratinho ajudou o leão?', ['Porque o leão tinha sido bom com ele', 'Porque tinha medo do leão', 'Porque queria a rede'], 0, 'O leão tinha deixado o ratinho ir embora, e o ratinho quis retribuir.']]),
H(33, 'O arco-íris', '🌈', 1, 'linear-gradient(135deg,#e0f4ff,#fde2f3)', [
  'Choveu forte de manhã na casa de Lia.',
  'Depois, a chuva parou e o sol apareceu.',
  'Lia olhou pela janela e viu algo bonito no céu.',
  'Era um arco-íris cheio de cores.',
  'Ela chamou o irmão para ver também.'], [
  ['Quando choveu forte?', ['De manhã', 'De noite', 'De tarde'], 0, 'O texto diz que choveu forte de manhã.'],
  ['O que Lia viu no céu?', ['Uma estrela', 'Um balão', 'Um arco-íris'], 2, 'Lia viu um arco-íris cheio de cores.'],
  ['Por que Lia chamou o irmão?', ['Queria que ele visse o arco-íris', 'Queria brincar na chuva', 'Estava com medo'], 0, 'Ela achou bonito e quis dividir com o irmão.']]),
H(34, 'O aquário da escola', '🐠', 1, 'linear-gradient(135deg,#d6f1ff,#c2e6ff)', [
  'Na sala de aula havia um aquário pequeno.',
  'Nele moravam três peixinhos laranja.',
  'Todo dia, um aluno dava comida aos peixes.',
  'Hoje era a vez de Caio.',
  'Ele colocou só um pouquinho, do jeito que a professora ensinou.'], [
  ['Quantos peixinhos moravam no aquário?', ['Dois', 'Três', 'Cinco'], 1, 'O texto diz que eram três peixinhos laranja.'],
  ['Quem deu comida aos peixes hoje?', ['Caio', 'A professora', 'Lia'], 0, 'Hoje era a vez de Caio.'],
  ['Por que Caio colocou só um pouquinho de comida?', ['Porque estava com preguiça', 'Porque a professora ensinou assim', 'Porque a comida acabou'], 1, 'Ele fez do jeito que a professora ensinou.']]),
H(35, 'A maçã dividida', '🍎', 2, 'linear-gradient(135deg,#ffe0e0,#ffd0d0)', [
  'Teo ganhou uma maçã vermelha e grande.',
  'No recreio, ele viu Duda sem lanche.',
  'Teo pensou um pouco e cortou a maçã ao meio.',
  'Deu uma metade para Duda.',
  'Os dois comeram juntos e sorriram.'], [
  ['De que cor era a maçã?', ['Verde', 'Amarela', 'Vermelha'], 2, 'O texto diz que a maçã era vermelha e grande.'],
  ['Com quem Teo dividiu a maçã?', ['Com Duda', 'Com a professora', 'Com o irmão'], 0, 'Ele deu uma metade para Duda.'],
  ['Por que Teo dividiu a maçã?', ['Porque não gostava de maçã', 'Porque Duda estava sem lanche', 'Porque a maçã era pequena'], 1, 'Ele viu Duda sem lanche e quis ajudar.']]),
H(36, 'O elefante e o passarinho', '🐘', 2, 'linear-gradient(135deg,#e8eaf6,#d8dcf0)', [
  'Um elefante grande andava pela mata.',
  'Um passarinho fez o ninho na árvore dele.',
  'O elefante não queria balançar a árvore.',
  'Por isso, ele ficou parado por muitos dias.',
  'Quando os filhotes nasceram, o elefante sorriu feliz.'], [
  ['Onde o passarinho fez o ninho?', ['Numa árvore', 'Numa pedra', 'Numa casa'], 0, 'O ninho foi feito na árvore.'],
  ['Quanto tempo o elefante ficou parado?', ['Uma hora', 'Muitos dias', 'Uma noite'], 1, 'O texto diz que ele ficou parado por muitos dias.'],
  ['O que o elefante sentiu pelo passarinho?', ['Cuidado e carinho', 'Raiva', 'Medo'], 0, 'Ele ficou parado para não derrubar o ninho, por cuidado.']]),
H(37, 'O primeiro dia de aula', '🎒', 1, 'linear-gradient(135deg,#e6f7d9,#d4f0c0)', [
  'Hoje foi o primeiro dia de aula de Rui.',
  'Ele arrumou a mochila e vestiu o uniforme.',
  'No portão, a professora Sara esperava a turma.',
  'Rui ficou um pouco tímido no início.',
  'Depois, fez um amigo novo e brincou muito.'], [
  ['Como se chamava a professora?', ['Ana', 'Sara', 'Lia'], 1, 'A professora se chamava Sara.'],
  ['O que Rui fez depois de ficar tímido?', ['Foi embora', 'Chorou', 'Fez um amigo novo'], 2, 'Depois, ele fez um amigo novo e brincou muito.'],
  ['Como Rui se sentiu no final do dia?', ['Alegre', 'Zangado', 'Cansado de brincar'], 0, 'Ele fez um amigo e brincou muito, então ficou alegre.']]),
H(38, 'A borboleta', '🦋', 2, 'linear-gradient(135deg,#f3e5ff,#e6d4ff)', [
  'Primeiro, a borboleta era uma lagarta verde.',
  'Ela comia folhas o dia inteiro.',
  'Depois, se escondeu num casulo e ficou quietinha.',
  'Passaram-se os dias, e o casulo se abriu.',
  'De dentro saiu uma linda borboleta colorida.'], [
  ['Como era a lagarta no começo?', ['Azul', 'Verde', 'Amarela'], 1, 'No começo, ela era uma lagarta verde.'],
  ['O que a lagarta comia?', ['Folhas', 'Flores', 'Frutas'], 0, 'Ela comia folhas o dia inteiro.'],
  ['O que aconteceu dentro do casulo?', ['A lagarta foi embora', 'A lagarta virou borboleta', 'A lagarta ficou pequena'], 1, 'Com o tempo, a lagarta se transformou numa borboleta.']]),
H(39, 'A lua e o menino', '🌙', 1, 'linear-gradient(135deg,#e3e8ff,#cfd8ff)', [
  'À noite, Davi não conseguia dormir.',
  'Ele olhou pela janela e viu a lua grande.',
  'A lua brilhava e iluminava o quintal.',
  'Davi ficou olhando e sentiu calma.',
  'Logo ele fechou os olhos e dormiu.'], [
  ['O que Davi viu pela janela?', ['O sol', 'A lua', 'Um avião'], 1, 'Ele viu a lua grande.'],
  ['O que a lua iluminava?', ['O quintal', 'A escola', 'A rua toda'], 0, 'A lua iluminava o quintal.'],
  ['Por que Davi conseguiu dormir?', ['Porque ficou calmo olhando a lua', 'Porque a mãe cantou', 'Porque amanheceu'], 0, 'Olhar a lua trouxe calma, e ele dormiu.']]),
H(40, 'A joaninha perdida', '🐞', 2, 'linear-gradient(135deg,#ffe5e5,#ffd6d6)', [
  'Uma joaninha vermelha se perdeu no jardim.',
  'Ela não achava mais o caminho de casa.',
  'Uma formiguinha viu a joaninha triste.',
  'A formiga a levou até a folha onde ela morava.',
  'A joaninha agradeceu e as duas viraram amigas.'], [
  ['De que cor era a joaninha?', ['Vermelha', 'Azul', 'Preta'], 0, 'O texto diz que a joaninha era vermelha.'],
  ['Quem ajudou a joaninha?', ['Uma abelha', 'Uma formiguinha', 'Uma borboleta'], 1, 'Uma formiguinha viu a joaninha e a levou para casa.'],
  ['Como a joaninha se sentia antes de ser ajudada?', ['Feliz', 'Com sono', 'Triste e perdida'], 2, 'A formiguinha a viu triste porque ela estava perdida.']])
];
const fs = require('fs'), arq = __dirname + '/../../conteudo/historias.js';
let t = fs.readFileSync(arq, 'utf8');
if (t.includes("id:'historia-31'")) { console.log('já gravado'); process.exit(0); }
const aq = s => "'" + String(s).replace(/\\/g, '\\\\').replace(/'/g, "\\'") + "'";
const ser = v => Array.isArray(v) ? '[' + v.map(ser).join(',') + ']' : typeof v === 'object' ? '{' + Object.entries(v).map(([k, x]) => k + ':' + ser(x)).join(',') + '}' : typeof v === 'number' ? v : aq(v);
const linhas = novas.map(h => ',\n' + ser(h)).join('');
t = t.replace(/\n\];\s*$/, linhas.replace(/^,/, ',') + '\n];\n');
fs.writeFileSync(arq, t);
console.log('gravadas', novas.length);

// Onda 3 de colorir (colorir-31 a 35). Rodar: node build/pedidos/colorir-onda3.js  (acrescenta ao fim de conteudo/colorir.js)
// Formas brancas com contorno preto; as maiores primeiro, os detalhes por cima (tocar pinta a forma).
const f = (tag, a, fill = 'white', sw = 3) => `<${tag} ${a} fill="${fill}" stroke="black" stroke-width="${sw}"/>`;
const olho = (x, y, r = 5) => `<circle cx="${x}" cy="${y}" r="${r}" fill="black"/>`;
const svg = (...p) => '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300">' + p.join('') + '</svg>';
const grama = f('path', 'd="M20 280 Q50 260 80 280 Q110 260 140 280 Q170 260 200 280 Q230 260 260 280"');
const novas = [
  { id: 'colorir-31', titulo: 'Tartaruga', emoji: '🐢', svg: svg(
    f('ellipse', 'cx="75" cy="190" rx="22" ry="16"'), f('ellipse', 'cx="215" cy="190" rx="22" ry="16"'),
    f('ellipse', 'cx="95" cy="225" rx="22" ry="16"'), f('ellipse', 'cx="195" cy="225" rx="22" ry="16"'),
    f('circle', 'cx="255" cy="165" r="30"'), olho(265, 157), f('path', 'd="M258 178 Q268 183 276 176"', 'none', 2),
    f('path', 'd="M55 205 C60 80 240 80 245 205 Z"'),
    f('polygon', 'points="150,120 180,135 180,165 150,180 120,165 120,135"'),
    f('polygon', 'points="120,165 150,180 140,205 80,205"'), f('polygon', 'points="180,165 150,180 160,205 220,205"'),
    grama) },
  { id: 'colorir-32', titulo: 'Girassol', emoji: '🌻', svg: svg(
    f('rect', 'x="144" y="150" width="12" height="130"'),
    f('path', 'd="M150 230 Q100 200 85 235 Q115 255 150 240 Z"'), f('path', 'd="M150 205 Q200 175 215 210 Q185 230 150 215 Z"'),
    ...[0, 45, 90, 135, 180, 225, 270, 315].map(g => f('ellipse', `cx="150" cy="75" rx="18" ry="42" transform="rotate(${g} 150 117)"`)),
    f('circle', 'cx="150" cy="117" r="38"'), olho(138, 110, 4), olho(162, 110, 4),
    f('path', 'd="M135 128 Q150 142 165 128"', 'none', 2), grama) },
  { id: 'colorir-33', titulo: 'Maçã', emoji: '🍎', svg: svg(
    f('path', 'd="M150 85 Q60 55 50 150 Q45 250 120 265 Q150 272 180 265 Q255 250 250 150 Q240 55 150 85 Z"'),
    f('path', 'd="M150 85 Q148 55 160 35"', 'none', 5), f('path', 'd="M160 50 Q200 15 235 45 Q200 75 160 50 Z"'),
    f('circle', 'cx="105" cy="130" r="14"', 'white', 2), f('ellipse', 'cx="200" cy="175" rx="8" ry="5"', 'white', 2),
    f('ellipse', 'cx="120" cy="215" rx="8" ry="5"', 'white', 2)) },
  { id: 'colorir-34', titulo: 'Pato', emoji: '🦆', svg: svg(
    f('path', 'd="M40 180 Q40 260 130 262 Q230 265 250 190 Q255 160 225 165 Q180 175 150 150 Q60 130 40 180 Z"'),
    f('path', 'd="M95 195 Q130 160 175 200 Q140 235 95 195 Z"'),
    f('circle', 'cx="105" cy="95" r="45"'), f('path', 'd="M60 105 Q25 100 20 118 Q30 135 62 128 Z"', '#fff'),
    olho(100, 82), f('path', 'd="M20 285 Q50 265 80 285 Q110 265 140 285 Q170 265 200 285 Q230 265 260 285"', 'none', 3)) },
  { id: 'colorir-35', titulo: 'Trem', emoji: '🚂', svg: svg(
    f('rect', 'x="30" y="120" width="150" height="100" rx="8"'), f('rect', 'x="170" y="80" width="100" height="140" rx="8"'),
    f('rect', 'x="185" y="95" width="70" height="50"', 'white', 2), f('rect', 'x="40" y="60" width="30" height="62"'),
    f('path', 'd="M25 60 Q55 15 85 60 Z"'), f('rect', 'x="30" y="205" width="240" height="12"'),
    f('circle', 'cx="70" cy="240" r="28"'), f('circle', 'cx="145" cy="240" r="28"'), f('circle', 'cx="230" cy="240" r="28"'),
    f('circle', 'cx="70" cy="240" r="8"', 'white', 2), f('circle', 'cx="145" cy="240" r="8"', 'white', 2), f('circle', 'cx="230" cy="240" r="8"', 'white', 2),
    f('path', 'd="M25 270 L275 270"', 'none', 4), f('circle', 'cx="105" cy="165" r="22"'), f('circle', 'cx="105" cy="165" r="9"', 'white', 2)) }
];
const fs = require('fs'), arq = __dirname + '/../../conteudo/colorir.js', escrever = require('../escrever.js');
let t = fs.readFileSync(arq, 'utf8');
if (t.includes("id:'colorir-31'")) { console.log('já gravado'); process.exit(0); }
t = t.replace(/\n\];\s*$/, novas.map(n => ',\n' + escrever(n)).join('') + '\n];\n');
fs.writeFileSync(arq, t);
console.log('gravadas', novas.length);

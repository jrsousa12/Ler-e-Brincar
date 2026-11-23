// Brincadeira "Mercadinho": produtos e dinheiro. Para trocar produto ou preço, editar aqui.
// min/max = faixa de preço em reais inteiros (o nível 4 tira 50 centavos do preço sorteado). Regras da conta: js/mercadoregras.js.
window.LB = window.LB || {};
LB.mercado = {
  // Moedas e notas (valor em reais). Cada compra diz quais vão na carteira.
  dinheiro: [
    { valor: 0.5, tipo: 'moeda' },
    { valor: 1, tipo: 'moeda' },
    { valor: 2, tipo: 'nota' },
    { valor: 5, tipo: 'nota' },
    { valor: 10, tipo: 'nota' },
    { valor: 20, tipo: 'nota' },
    { valor: 50, tipo: 'nota' }
  ],
  produtos: [
    { emoji: '🍎', nome: 'maçã', min: 2, max: 5 },
    { emoji: '🍌', nome: 'banana', min: 2, max: 4 },
    { emoji: '🍇', nome: 'cacho de uva', min: 4, max: 9 },
    { emoji: '🍉', nome: 'fatia de melancia', min: 3, max: 6 },
    { emoji: '🥕', nome: 'cenoura', min: 2, max: 5 },
    { emoji: '🍞', nome: 'pão', min: 3, max: 7 },
    { emoji: '🥛', nome: 'leite', min: 4, max: 8 },
    { emoji: '🧃', nome: 'suco', min: 3, max: 6 },
    { emoji: '🍪', nome: 'biscoito', min: 2, max: 6 },
    { emoji: '🍫', nome: 'chocolate', min: 4, max: 9 },
    { emoji: '🍦', nome: 'sorvete', min: 5, max: 10 },
    { emoji: '🧁', nome: 'bolinho', min: 3, max: 8 },
    { emoji: '✏️', nome: 'lápis', min: 2, max: 5 },
    { emoji: '📒', nome: 'caderno', min: 8, max: 18 },
    { emoji: '⚽', nome: 'bola', min: 10, max: 20 },
    { emoji: '🧸', nome: 'ursinho', min: 12, max: 24 }
  ]
};

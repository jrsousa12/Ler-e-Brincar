// Nome curto de cada habilidade da BNCC, para a criança e para o adulto (texto oficial em build/fichas/bncc.json).
// LB.nomeHabilidade('EF03LP03') → 'Palavras com lh, nh e ch'; sem nome: o padrão dado (ou o próprio código).
(function () {
  'use strict';
  const NOMES = {
    EF01LP08: 'Sons e letras', EF01LP10: 'Ordem alfabética', EF02LP02: 'Sílabas', EF02LP03: 'Letras parecidas (f/v, t/d, p/b)',
    EF02LP04: 'Ler e escrever palavras', EF02LP05: 'Til, M e N', EF02LP08: 'Separar as palavras', EF02LP09: 'Pontuação',
    EF02LP10: 'Sinônimos e antônimos', EF02LP26: 'Ler e entender histórias', EF03LP01: 'Ortografia (c/qu, g/gu, r/rr, s/ss)',
    EF03LP03: 'Palavras com lh, nh e ch', EF03LP04: 'Acentos', EF03LP05: 'Contar sílabas', EF03LP06: 'Sílaba mais forte',
    EF03LP08: 'Substantivos e verbos', EF03LP09: 'Adjetivos', EF12LP07: 'Rimas', EF15LP03: 'Achar a informação no texto',
    EF35LP03: 'Ideia principal do texto', EF35LP04: 'Descobrir o que o texto não diz', EF35LP07: 'Escrever frases certinhas',
    EF35LP13: 'Palavras com X ou CH',
    EF02MA01: 'Comparar números', EF02MA04: 'Montar e desmontar números', EF02MA05: 'Somas e subtrações',
    EF02MA06: 'Problemas de somar e tirar', EF02MA07: 'Multiplicar', EF02MA08: 'Dobro e metade',
    EF02MA09: 'Sequências', EF02MA14: 'Sólidos nos objetos', EF02MA17: 'Pesado, leve e litro',
    EF02MA18: 'Calendário e semana', EF02MA20: 'Moedas e cédulas', EF03MA01: 'Números até 1000',
    EF03MA03: 'Fatos de somar e multiplicar', EF03MA06: 'Problemas de contas', EF03MA07: 'Problemas de multiplicar',
    EF03MA08: 'Dividir', EF03MA24: 'Compras e troco'
  };
  LB.nomeHabilidade = (h, padrao) => NOMES[h] || padrao || h;
})();

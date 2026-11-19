/** Dados didáticos separados da interface para facilitar manutenção. */
export const challenges = [
  {
    id: 'variaveis', category: 'Fundamentos', title: 'Uma primeira variável', level: 'Iniciante', minutes: 5,
    summary: 'Guarde seu nome em uma variável e mostre uma mensagem no terminal.',
    task: 'Crie uma variável chamada nome com um texto e use print() para exibi-la.',
    starter: '# Escreva seu código aqui\n',
    hints: [
      'Uma variável associa um nome a um valor. Em Python, usamos o sinal = para fazer isso.',
      'Para mostrar algo na tela, use a função print().',
      'Experimente juntar as duas ideias: nome = "Ana" e depois print(nome).'
    ],
    checks: [{ regex: /\bnome\s*=\s*(['"]).+?\1/, message: 'Crie a variável nome com um texto entre aspas.' }, { regex: /\bprint\s*\(\s*nome\s*\)/, message: 'Mostre a variável usando print(nome).' }]
  },
  {
    id: 'condicionais', category: 'Lógica', title: 'Pode entrar?', level: 'Iniciante', minutes: 8,
    summary: 'Use uma condição para verificar se uma pessoa tem 18 anos ou mais.',
    task: 'Crie a variável idade e escreva uma estrutura if para verificar se idade >= 18.',
    starter: 'idade = 20\n\n# Faça a verificação\n',
    hints: [
      'Uma condição permite que o programa tome decisões.',
      'Em Python, escrevemos if seguido de uma comparação e dois-pontos.',
      'Tente: if idade >= 18: e, na linha seguinte com recuo, print("Acesso permitido").'
    ],
    checks: [{ regex: /\bidade\s*=\s*\d+/, message: 'Defina uma idade numérica.' }, { regex: /\bif\s+idade\s*>=\s*18\s*:/, message: 'Use if idade >= 18:.' }, { regex: /\bprint\s*\(/, message: 'Mostre uma mensagem com print().' }]
  },
  {
    id: 'repeticao', category: 'Repetição', title: 'Contando até cinco', level: 'Intermediário', minutes: 10,
    summary: 'Faça uma contagem usando um laço de repetição.',
    task: 'Use for e range() para exibir os números de 1 a 5.',
    starter: '# Conte de 1 a 5\n',
    hints: [
      'O laço for permite repetir uma instrução várias vezes.',
      'range(início, fim) gera números sem incluir o valor final.',
      'Experimente: for numero in range(1, 6): e, dentro do bloco, print(numero).'
    ],
    checks: [{ regex: /\bfor\s+\w+\s+in\s+range\s*\(\s*1\s*,\s*6\s*\)\s*:/, message: 'Use for com range(1, 6).' }, { regex: /\bprint\s*\(/, message: 'Exiba os números usando print().' }]
  },
  {
    id: 'funcoes', category: 'Funções', title: 'Sua primeira função', level: 'Intermediário', minutes: 12,
    summary: 'Organize uma saudação em uma função reutilizável.',
    task: 'Crie uma função chamada saudacao que receba nome e retorne uma mensagem com esse nome.',
    starter: '# Defina sua função\n',
    hints: [
      'Funções organizam partes do programa que podem ser reaproveitadas.',
      'Uma função em Python começa com def nome_da_funcao(parametro):.',
      'Você pode escrever def saudacao(nome): e retornar uma string com return "Olá, " + nome.'
    ],
    checks: [{ regex: /\bdef\s+saudacao\s*\(\s*nome\s*\)\s*:/, message: 'Defina saudacao(nome).' }, { regex: /\breturn\b/, message: 'Retorne uma mensagem usando return.' }]
  }
];

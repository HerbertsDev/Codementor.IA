# CodeMentor AI — protótipo navegável

Protótipo da solução proposta na disciplina **Introdução à Inovação e Tecnologia (Módulo 3)**. O objetivo é demonstrar a experiência de um tutor de programação com orientação progressiva, não implementar um produto pronto.

## Como abrir

**Opção recomendada:** abra a pasta no VS Code e inicie um servidor local, por exemplo:

```bash
python -m http.server 8000
```

Depois, acesse `http://localhost:8000` no navegador. O projeto usa módulos JavaScript ES, que funcionam melhor com servidor HTTP local; abrir o arquivo diretamente pelo protocolo `file://` pode bloquear os módulos.

Não é necessário instalar bibliotecas, criar contas nem configurar chaves de API. A fonte tipográfica externa é opcional; sem internet, o navegador usa uma fonte de sistema.

## O que testar

1. Navegue pelas telas usando o menu lateral.
2. Abra um desafio, edite o código e clique em **Verificar tentativa**.
3. Solicite dicas progressivas, uma de cada vez.
4. Confira o avanço em **Meu progresso**.
5. Alterne entre os temas claro e escuro.
6. Recarregue a página: rascunhos e progresso permanecem neste navegador.

## Organização

```text
codementor-ai/
├── index.html                 # Ponto de entrada
├── src/
│   ├── main.js                # Navegação, eventos e composição das telas
│   ├── data/challenges.js     # Desafios e conteúdo didático
│   ├── services/evaluator.js  # Verificação textual ilustrativa
│   ├── services/storage.js    # Persistência com localStorage
│   ├── ui/icons.js            # Ícones SVG reutilizáveis
│   └── styles/main.css        # Layout, componentes, responsividade e temas
├── docs/
│   └── Documento_de_Apoio_CodeMentor_AI.pdf
└── README.md
```

## Limitações intencionais

- **Não existe integração com inteligência artificial real:** o tutor apresenta respostas predefinidas e contextualizadas.
- **O código Python não é executado:** a verificação procura padrões específicos, podendo aprovar soluções incompletas ou rejeitar soluções válidas diferentes do exemplo.
- Não há cadastro, backend, banco de dados remoto nem sincronização entre dispositivos.
- O armazenamento local não é apropriado para dados sensíveis ou ambientes compartilhados.

Essas escolhas mantêm o foco na apresentação da ideia e deixam claras as possibilidades de evolução futura.

## Evolução possível

Uma versão posterior poderia incluir execução de código em ambiente isolado, autenticação, testes automatizados por exercício e um serviço de tutoria com IA sob regras de proteção de dados. Essas funcionalidades **não** fazem parte deste protótipo.

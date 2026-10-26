# Datamob — Playwright Challenge

Desenvolvi esta suíte com Playwright, TypeScript e Playwright Test para
validar três comportamentos da aplicação pública
[Automation Exercise](https://automationexercise.com).

Mantive a solução proporcional ao escopo do desafio, com cenários
independentes, preparação de dados por API, Page Objects e evidências
para investigação de falhas.

## Cenários selecionados

Selecionei os cenários para cobrir autenticação positiva, rejeição de
credenciais inválidas e consistência dos dados do carrinho.

| Cenário | Comportamento verificado |
| --- | --- |
| Login com credenciais válidas | Identidade do usuário, opção de logout e formulário de login oculto. |
| Login com senha incorreta | Mensagem de erro, permanência do formulário e ausência dos indicadores de autenticação. |
| Adição de produto ao carrinho | Produto, preço unitário, quantidade, total e presença de apenas um item. |

No cenário negativo, utilizei o e-mail de uma conta válida e alterei
somente a senha. Assim, verifiquei especificamente a rejeição de uma
senha incorreta.

No carrinho, adicionei três unidades do produto Blue Top, com preço
unitário esperado de Rs. 500 e total esperado de Rs. 1500.

## Pré-requisitos

- Node.js 22 e npm.
- Acesso à internet.
- Chromium instalado pelo Playwright.

Validei a execução local no seguinte ambiente:

| Componente | Versão |
| --- | --- |
| Sistema operacional | Windows 10 |
| Node.js | 22.23.2 |
| npm | 10.9.8 |
| Playwright Test | 1.64.1 |
| TypeScript | 7.0.2 |

## Instalação

Após obter os arquivos do repositório, abra um terminal na pasta raiz
do desafio e execute:

```bash
npm ci
npx playwright install chromium
```

O `npm ci` instala as dependências conforme o `package-lock.json`.

Em ambientes Linux que precisem das dependências de sistema do navegador:

```bash
npx playwright install --with-deps chromium
```

Não é necessário cadastrar usuários manualmente ou fornecer credenciais
pessoais.

## Execução

Verificar a tipagem:

```bash
npm run typecheck
```

Executar os três cenários:

```bash
npm test
```

Executar com o navegador visível:

```bash
npm run test:headed
```

Executar somente os testes de autenticação:

```bash
npm test -- tests/auth.spec.ts
```

Executar somente o cenário de senha incorreta:

```bash
npm test -- tests/auth.spec.ts --grep "senha incorreta"
```

Executar somente o cenário de carrinho:

```bash
npm test -- tests/cart.spec.ts
```

Abrir o relatório HTML da última execução:

```bash
npm run report
```

Acesse o endereço informado no terminal. Para encerrar o servidor
do relatório, pressione `Ctrl+C`.

## Organização dos arquivos

| Caminho | Responsabilidade |
| --- | --- |
| `tests/auth.spec.ts` | Cenários e assertions de autenticação. |
| `tests/cart.spec.ts` | Cenário e assertions do carrinho. |
| `pages/login.page.ts` | Locators e interações da tela de login. |
| `pages/product.page.ts` | Locators e interações da página do produto e da confirmação de adição. |
| `pages/cart.page.ts` | Localização dos itens e das células do carrinho. |
| `fixtures/account.fixture.ts` | Preparação e limpeza das contas utilizadas nos testes. |
| `playwright.config.ts` | Configuração de execução, navegador, timeouts e evidências. |
| `tsconfig.json` | Configuração da verificação estática do TypeScript. |
| `package-lock.json` | Registro das versões das dependências. |

## Decisões técnicas

### TypeScript e Playwright Test

Escolhi TypeScript porque já utilizo essa linguagem profissionalmente
com Cypress. Assim, concentrei o esforço nos recursos do Playwright
e nas decisões de engenharia de testes.

Utilizei o Playwright Test para reunir execução, fixtures, assertions,
isolamento de navegador e relatórios.

Mantive a verificação de tipos em um comando próprio:
`npm run typecheck`.

### Page Objects

Organizei os locators e as interações em Page Objects e mantive os
cenários e as assertions nos arquivos de teste.

Essa separação centraliza os detalhes das páginas e facilita a manutenção.
Mantive a estrutura pequena, sem classes base ou camadas adicionais
para este escopo.

### Locators e sincronização

Priorizei locators por papel acessível, texto e atributos `data-qa`.
Configurei `testIdAttribute` para consultar esses atributos por meio
de `getByTestId`.

Utilizei seletores CSS para delimitar contêineres, produtos e células
específicas quando essa identificação era adequada à aplicação.

No carrinho, verifiquei preço, quantidade e total em suas respectivas
células, evitando validar um valor encontrado em outra coluna.

Utilizei as esperas das ações e as assertions de interface do Playwright,
sem adicionar esperas fixas com `waitForTimeout`.

### Preparação e limpeza de dados

Criei uma fixture para disponibilizar uma conta exclusiva por API
a cada teste de autenticação. Gerei e-mail e senha com UUID para reduzir
colisões entre execuções.

A preparação por API evita repetir o cadastro pela interface em cenários
cujo objetivo é verificar o login.

Validei tanto o sucesso HTTP quanto o campo `responseCode` retornado
pela aplicação, pois representam verificações distintas.

Coloquei a tentativa de exclusão da conta em um bloco `finally`,
incluindo os casos de falha do teste. Interrupções forçadas do processo
ou indisponibilidade da API podem impedir a limpeza.

No teste de carrinho, utilizei uma sessão de visitante, sem a fixture
de conta. Mantive os dados do único produto no próprio cenário.

### Configuração de execução

Configurei a suíte para Chromium, com um worker e sem repetição automática
de testes que falharam.

Essa escolha limita a carga sobre a aplicação pública e facilita
a investigação das falhas. As assertions de interface continuam
repetindo suas verificações até o timeout configurado.

Os cenários utilizam contextos de navegador isolados e não dependem
da ordem de execução.

## Relatórios e evidências

Configurei os recursos nativos do Playwright:

- Relatório HTML.
- Screenshot em caso de falha: `only-on-failure`.
- Trace preservado em caso de falha: `retain-on-failure`.
- Etapas nomeadas com `test.step`.

Por padrão, os arquivos das falhas ficam em subpastas de `test-results/`.
O terminal informa os caminhos dos anexos.

Para consultar as evidências:

```bash
npm run report
```

Selecione o teste que falhou e consulte a mensagem de erro, as etapas
e os anexos.

Para abrir um trace diretamente, substitua o caminho abaixo pelo caminho
informado na execução:

```bash
npx playwright show-trace "test-results/<pasta-do-teste>/trace.zip"
```

A screenshot registra o estado visual da aplicação. O diagnóstico
da assertion informa os valores esperado e recebido. O trace permite
investigar as ações, os estados da página e a falha registrada.

Mantive `node_modules/`, `playwright-report/`, `test-results/` e `.env`
no `.gitignore`.

## Validação realizada

Em 26/10/2026, executei os três cenários juntos e obtive três testes
aprovados.

Também provoquei uma falha controlada, alterando temporariamente o total
esperado do carrinho de Rs. 1500 para Rs. 1501.

Confirmei que:

- A assertion identificou a divergência entre esperado e recebido.
- A screenshot registrou o total de Rs. 1500 exibido pela aplicação.
- O trace registrou a expectativa de Rs. 1501 e as leituras de Rs. 1500.
- Foram gerados os arquivos de screenshot, trace e contexto do erro.

Após restaurar o cálculo correto, executei novamente a suíte completa
e obtive três testes aprovados.

A alteração utilizada para provocar a falha não faz parte da suíte final.

## Limitações e evolução

A execução depende da disponibilidade da aplicação pública e de suas APIs.
Mudanças no catálogo, na interface ou em serviços externos podem exigir
investigação e manutenção.

Limitei a cobertura aos três cenários apresentados e ao Chromium.
Essa suíte não representa uma regressão completa da aplicação.

Para ampliar a solução, avaliaria os seguintes pontos conforme os riscos
e as necessidades do produto:

- Cobertura por módulo, criticidade e regras de negócio.
- Estratégia de dados para cenários mais complexos.
- Configuração de múltiplos ambientes.
- Execução em pipeline com publicação de relatórios e evidências.
- Paralelismo conforme a capacidade do ambiente.
- Navegadores conforme a matriz de compatibilidade.
- Acompanhamento de instabilidade e responsabilidades de manutenção.
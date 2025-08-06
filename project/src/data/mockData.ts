import { Historia } from '../types';

export const mockHistorias: Historia[] = [
  {
    id: "JIRA-8123",
    titulo: "Adicionar produto ao carrinho com estoque em trânsito",
    descricao: "Como consultora, quero adicionar ao carrinho produtos com estoque em trânsito, mesmo com impacto no prazo",
    projeto: "Capta",
    criterios: [
      "Produto sem estoque nos CDs primário e secundário",
      "Captação em trânsito apenas no CD que possui impacto de prazo"
    ],
    cenarios: [
      {
        nome: "Adicionar produto com corte total no CD primário e captação em trânsito disponível",
        resultadoEsperado: "Produto em trânsito com impacto no prazo exibe aviso, opção de adiar entrega e botão 'Ver opções'.",
        massaDados: {
          produto: "812394 - Shampoo Karité 250ml",
          cdPrimario: "11 (sem estoque)",
          cdSecundario: "12 (sem estoque)",
          transito: "20 unidades em CD 11",
          impactoPrazo: "Sim"
        },
        gherkin: `Funcionalidade: Captação de produtos com estoque em trânsito\n  Cenário: Realizar pedido com captação em trânsito que tenha impacto no prazo de entrega\n    Dado que esteja sendo realizado um pedido que tenha um produto sem estoque nos CDs primário e secundário da consultora\n    E que o produto tenha estoque em trânsito apenas no CD que tenha impacto no prazo de entrega\n    Quando o produto for inserido no carrinho\n    Então deverá ser exibida a mensagem de produto indisponível com a opção de incluir o produto adiando a entrega do pedido\n    E um botão 'Ver opções' deverá ser exibido para a consultora escolher como proceder`,
        automacao: `@Automated
public class TestCaptacaoDeProdutosComEstoqueEmTransito {

    private WebDriver driver;
    private WebDriverWait wait;
    private String baseUrl;

    @Before
    public void setUp() {

        System.setProperty("webdriver.chrome.driver", "caminho/para/seu/chromedriver.exe");
        driver = new ChromeDriver();
        wait = new WebDriverWait(driver, 10);
        baseUrl = "URL_DA_APLICACAO";

    }

    @Test
    public void testRealizarPedidoComCaptacaoEmTransitoQueTenhaImpactoNoPrazoDeEntrega() {

        driver.get(baseUrl);


        // Passo 1: Realizar o pedido com produto sem estoque

        WebElement pedidoButton = wait.until(ExpectedConditions.presenceOfElementLocated(By.id("pedidoButton")));

        pedidoButton.click();


        // Passo 2: Verificar estoque em trânsito com impacto no prazo de entrega

        WebElement produtoStatus = wait.until(ExpectedConditions.presenceOfElementLocated(By.id("produtoStatus")));

        assertTrue(produtoStatus.getText().contains("Estoque em trânsito"));

 
        // Passo 3: Inserir produto no carrinho

        WebElement addCarrinhoButton = wait.until(ExpectedConditions.elementToBeClickable(By.id("addCarrinhoButton")));

        addCarrinhoButton.click();


        // Passo 4: Exibir mensagem e botão para opções

        WebElement mensagemProduto = wait.until(ExpectedConditions.presenceOfElementLocated(By.id("mensagemProduto")));

        assertTrue(mensagemProduto.getText().contains("Produto indisponível"));

        WebElement verOpcoesButton = wait.until(ExpectedConditions.presenceOfElementLocated(By.id("verOpcoesButton")));

        assertTrue(verOpcoesButton.isDisplayed());

    }`,
        status: {
          resultadoEsperado: "gerado",
          massaDados: "gerado",
          automacao: "gerado"
        }
      },
      {
        nome: "Adicionar produto com corte total no CD primário e captação em trânsito disponível",
        resultadoEsperado: "Produto em trânsito com impacto no prazo exibe aviso, opção de adiar entrega e botão 'Ver opções'.",
        massaDados: {
          produto: "812394 - Shampoo Karité 250ml",
          cdPrimario: "11 (sem estoque)",
          cdSecundario: "12 (sem estoque)",
          transito: "20 unidades em CD 11",
          impactoPrazo: "Sim"
        },
        gherkin: `Funcionalidade: Captação de produtos com estoque em trânsito\n  Cenário: Realizar pedido com captação em trânsito que tenha impacto no prazo de entrega\n    Dado que esteja sendo realizado um pedido que tenha um produto sem estoque nos CDs primário e secundário da consultora\n    E que o produto tenha estoque em trânsito apenas no CD que tenha impacto no prazo de entrega\n    Quando o produto for inserido no carrinho\n    Então deverá ser exibida a mensagem de produto indisponível com a opção de incluir o produto adiando a entrega do pedido\n    E um botão 'Ver opções' deverá ser exibido para a consultora escolher como proceder`,
        automacao: `@Automated
public class TestCaptacaoDeProdutosComEstoqueEmTransito {

    private WebDriver driver;
    private WebDriverWait wait;
    private String baseUrl;

    @Before
    public void setUp() {

        System.setProperty("webdriver.chrome.driver", "caminho/para/seu/chromedriver.exe");
        driver = new ChromeDriver();
        wait = new WebDriverWait(driver, 10);
        baseUrl = "URL_DA_APLICACAO";

    }

    @Test
    public void testRealizarPedidoComCaptacaoEmTransitoQueTenhaImpactoNoPrazoDeEntrega() {

        driver.get(baseUrl);


        // Passo 1: Realizar o pedido com produto sem estoque

        WebElement pedidoButton = wait.until(ExpectedConditions.presenceOfElementLocated(By.id("pedidoButton")));

        pedidoButton.click();


        // Passo 2: Verificar estoque em trânsito com impacto no prazo de entrega

        WebElement produtoStatus = wait.until(ExpectedConditions.presenceOfElementLocated(By.id("produtoStatus")));

        assertTrue(produtoStatus.getText().contains("Estoque em trânsito"));

 
        // Passo 3: Inserir produto no carrinho

        WebElement addCarrinhoButton = wait.until(ExpectedConditions.elementToBeClickable(By.id("addCarrinhoButton")));

        addCarrinhoButton.click();


        // Passo 4: Exibir mensagem e botão para opções

        WebElement mensagemProduto = wait.until(ExpectedConditions.presenceOfElementLocated(By.id("mensagemProduto")));

        assertTrue(mensagemProduto.getText().contains("Produto indisponível"));

        WebElement verOpcoesButton = wait.until(ExpectedConditions.presenceOfElementLocated(By.id("verOpcoesButton")));

        assertTrue(verOpcoesButton.isDisplayed());

    }`,
        status: {
          resultadoEsperado: "gerado",
          massaDados: "gerado",
          automacao: "gerado"
        }
      },
      {
        nome: "Adicionar produto com corte total no CD primário e captação em trânsito disponível",
        resultadoEsperado: "Produto em trânsito com impacto no prazo exibe aviso, opção de adiar entrega e botão 'Ver opções'.",
        massaDados: {
          produto: "812394 - Shampoo Karité 250ml",
          cdPrimario: "11 (sem estoque)",
          cdSecundario: "12 (sem estoque)",
          transito: "20 unidades em CD 11",
          impactoPrazo: "Sim"
        },
        gherkin: `Funcionalidade: Captação de produtos com estoque em trânsito\n  Cenário: Realizar pedido com captação em trânsito que tenha impacto no prazo de entrega\n    Dado que esteja sendo realizado um pedido que tenha um produto sem estoque nos CDs primário e secundário da consultora\n    E que o produto tenha estoque em trânsito apenas no CD que tenha impacto no prazo de entrega\n    Quando o produto for inserido no carrinho\n    Então deverá ser exibida a mensagem de produto indisponível com a opção de incluir o produto adiando a entrega do pedido\n    E um botão 'Ver opções' deverá ser exibido para a consultora escolher como proceder`,
        automacao: `@Automated
public class TestCaptacaoDeProdutosComEstoqueEmTransito {

    private WebDriver driver;
    private WebDriverWait wait;
    private String baseUrl;

    @Before
    public void setUp() {

        System.setProperty("webdriver.chrome.driver", "caminho/para/seu/chromedriver.exe");
        driver = new ChromeDriver();
        wait = new WebDriverWait(driver, 10);
        baseUrl = "URL_DA_APLICACAO";

    }

    @Test
    public void testRealizarPedidoComCaptacaoEmTransitoQueTenhaImpactoNoPrazoDeEntrega() {

        driver.get(baseUrl);


        // Passo 1: Realizar o pedido com produto sem estoque

        WebElement pedidoButton = wait.until(ExpectedConditions.presenceOfElementLocated(By.id("pedidoButton")));

        pedidoButton.click();


        // Passo 2: Verificar estoque em trânsito com impacto no prazo de entrega

        WebElement produtoStatus = wait.until(ExpectedConditions.presenceOfElementLocated(By.id("produtoStatus")));

        assertTrue(produtoStatus.getText().contains("Estoque em trânsito"));

 
        // Passo 3: Inserir produto no carrinho

        WebElement addCarrinhoButton = wait.until(ExpectedConditions.elementToBeClickable(By.id("addCarrinhoButton")));

        addCarrinhoButton.click();


        // Passo 4: Exibir mensagem e botão para opções

        WebElement mensagemProduto = wait.until(ExpectedConditions.presenceOfElementLocated(By.id("mensagemProduto")));

        assertTrue(mensagemProduto.getText().contains("Produto indisponível"));

        WebElement verOpcoesButton = wait.until(ExpectedConditions.presenceOfElementLocated(By.id("verOpcoesButton")));

        assertTrue(verOpcoesButton.isDisplayed());

    }`,
        status: {
          resultadoEsperado: "gerado",
          massaDados: "gerado",
          automacao: "gerado"
        }
      },
      {
        nome: "Adicionar produto com corte total no CD primário e captação em trânsito disponível",
        resultadoEsperado: "Produto em trânsito com impacto no prazo exibe aviso, opção de adiar entrega e botão 'Ver opções'.",
        massaDados: {
          produto: "812394 - Shampoo Karité 250ml",
          cdPrimario: "11 (sem estoque)",
          cdSecundario: "12 (sem estoque)",
          transito: "20 unidades em CD 11",
          impactoPrazo: "Sim"
        },
        gherkin: `Funcionalidade: Captação de produtos com estoque em trânsito\n  Cenário: Realizar pedido com captação em trânsito que tenha impacto no prazo de entrega\n    Dado que esteja sendo realizado um pedido que tenha um produto sem estoque nos CDs primário e secundário da consultora\n    E que o produto tenha estoque em trânsito apenas no CD que tenha impacto no prazo de entrega\n    Quando o produto for inserido no carrinho\n    Então deverá ser exibida a mensagem de produto indisponível com a opção de incluir o produto adiando a entrega do pedido\n    E um botão 'Ver opções' deverá ser exibido para a consultora escolher como proceder`,
        automacao: `@Automated
public class TestCaptacaoDeProdutosComEstoqueEmTransito {

    private WebDriver driver;
    private WebDriverWait wait;
    private String baseUrl;

    @Before
    public void setUp() {

        System.setProperty("webdriver.chrome.driver", "caminho/para/seu/chromedriver.exe");
        driver = new ChromeDriver();
        wait = new WebDriverWait(driver, 10);
        baseUrl = "URL_DA_APLICACAO";

    }

    @Test
    public void testRealizarPedidoComCaptacaoEmTransitoQueTenhaImpactoNoPrazoDeEntrega() {

        driver.get(baseUrl);


        // Passo 1: Realizar o pedido com produto sem estoque

        WebElement pedidoButton = wait.until(ExpectedConditions.presenceOfElementLocated(By.id("pedidoButton")));

        pedidoButton.click();


        // Passo 2: Verificar estoque em trânsito com impacto no prazo de entrega

        WebElement produtoStatus = wait.until(ExpectedConditions.presenceOfElementLocated(By.id("produtoStatus")));

        assertTrue(produtoStatus.getText().contains("Estoque em trânsito"));

 
        // Passo 3: Inserir produto no carrinho

        WebElement addCarrinhoButton = wait.until(ExpectedConditions.elementToBeClickable(By.id("addCarrinhoButton")));

        addCarrinhoButton.click();


        // Passo 4: Exibir mensagem e botão para opções

        WebElement mensagemProduto = wait.until(ExpectedConditions.presenceOfElementLocated(By.id("mensagemProduto")));

        assertTrue(mensagemProduto.getText().contains("Produto indisponível"));

        WebElement verOpcoesButton = wait.until(ExpectedConditions.presenceOfElementLocated(By.id("verOpcoesButton")));

        assertTrue(verOpcoesButton.isDisplayed());

    }`,
        status: {
          resultadoEsperado: "gerado",
          massaDados: "gerado",
          automacao: "gerado"
        }
      },
      {
        nome: "Adicionar produto com corte total no CD primário e captação em trânsito disponível",
        resultadoEsperado: "Produto em trânsito com impacto no prazo exibe aviso, opção de adiar entrega e botão 'Ver opções'.",
        massaDados: {
          produto: "812394 - Shampoo Karité 250ml",
          cdPrimario: "11 (sem estoque)",
          cdSecundario: "12 (sem estoque)",
          transito: "20 unidades em CD 11",
          impactoPrazo: "Sim"
        },
        gherkin: `Funcionalidade: Captação de produtos com estoque em trânsito\n  Cenário: Realizar pedido com captação em trânsito que tenha impacto no prazo de entrega\n    Dado que esteja sendo realizado um pedido que tenha um produto sem estoque nos CDs primário e secundário da consultora\n    E que o produto tenha estoque em trânsito apenas no CD que tenha impacto no prazo de entrega\n    Quando o produto for inserido no carrinho\n    Então deverá ser exibida a mensagem de produto indisponível com a opção de incluir o produto adiando a entrega do pedido\n    E um botão 'Ver opções' deverá ser exibido para a consultora escolher como proceder`,
        automacao: `@Automated
public class TestCaptacaoDeProdutosComEstoqueEmTransito {

    private WebDriver driver;
    private WebDriverWait wait;
    private String baseUrl;

    @Before
    public void setUp() {

        System.setProperty("webdriver.chrome.driver", "caminho/para/seu/chromedriver.exe");
        driver = new ChromeDriver();
        wait = new WebDriverWait(driver, 10);
        baseUrl = "URL_DA_APLICACAO";

    }

    @Test
    public void testRealizarPedidoComCaptacaoEmTransitoQueTenhaImpactoNoPrazoDeEntrega() {

        driver.get(baseUrl);


        // Passo 1: Realizar o pedido com produto sem estoque

        WebElement pedidoButton = wait.until(ExpectedConditions.presenceOfElementLocated(By.id("pedidoButton")));

        pedidoButton.click();


        // Passo 2: Verificar estoque em trânsito com impacto no prazo de entrega

        WebElement produtoStatus = wait.until(ExpectedConditions.presenceOfElementLocated(By.id("produtoStatus")));

        assertTrue(produtoStatus.getText().contains("Estoque em trânsito"));

 
        // Passo 3: Inserir produto no carrinho

        WebElement addCarrinhoButton = wait.until(ExpectedConditions.elementToBeClickable(By.id("addCarrinhoButton")));

        addCarrinhoButton.click();


        // Passo 4: Exibir mensagem e botão para opções

        WebElement mensagemProduto = wait.until(ExpectedConditions.presenceOfElementLocated(By.id("mensagemProduto")));

        assertTrue(mensagemProduto.getText().contains("Produto indisponível"));

        WebElement verOpcoesButton = wait.until(ExpectedConditions.presenceOfElementLocated(By.id("verOpcoesButton")));

        assertTrue(verOpcoesButton.isDisplayed());

    }`,
        status: {
          resultadoEsperado: "gerado",
          massaDados: "gerado",
          automacao: "gerado"
        }
      }
    ],
    status: {
      resultadoEsperado: "gerado",
      massaDados: "gerado",
      automacao: "gerado"
    }
  },
  {
    id: "JIRA-8124", 
    titulo: "Validar desconto progressivo por quantidade",
    descricao: "Como cliente, quero receber desconto progressivo baseado na quantidade de produtos",
    projeto: "Capta",
    criterios: [
      "Desconto aplicado automaticamente no carrinho",
      "Faixas de desconto configuráveis"
    ],
    cenarios: [
      {
        nome: "Aplicar desconto de 5% para pedidos acima de 3 unidades",
        resultadoEsperado: "Desconto aplicado no total do pedido",
        massaDados: {
          produto: "567891 - Condicionador Natural 300ml",
          cdPrimario: "11 (15 unidades)",
          cdSecundario: "12 (8 unidades)",
          transito: "0 unidades",
          impactoPrazo: "Não"
        },
        gherkin: ``,
        automacao: `@Automated
Cenário: Aplicar desconto progressivo
Dado que tenho produtos no carrinho
Quando a quantidade for maior que 3 unidades
Então deve aplicar desconto de 5%`,
        status: {
          resultadoEsperado: "gerado",
          massaDados: "em-geracao",
          automacao: "nao-gerado"
        }
      }
    ],
    status: {
      resultadoEsperado: "gerado",
      massaDados: "em-geracao", 
      automacao: "nao-gerado"
    }
  },
  {
    id: "JIRA-8125",
    titulo: "Finalizar pedido com múltiplas formas de pagamento",
    descricao: "Como cliente, quero finalizar pedido usando múltiplas formas de pagamento",
    projeto: "NaturaPay",
    criterios: [
      "Permitir combinação de cartão e PIX",
      "Validar limites de cada forma de pagamento"
    ],
    cenarios: [
      {
        nome: "Pagamento combinado cartão + PIX",
        resultadoEsperado: "Pedido finalizado com sucesso",
        massaDados: {
          produto: "445566 - Kit Presente Natal",
          cdPrimario: "11 (disponível)",
          cdSecundario: "12 (disponível)",
          transito: "0 unidades",
          impactoPrazo: "Não"
        },
        gherkin: ``,
        automacao: `Cenário: Pagamento múltiplo
Dado que tenho um pedido de R$ 200,00
Quando pago R$ 100,00 no cartão
E R$ 100,00 via PIX
Então o pedido deve ser aprovado`,
        status: {
          resultadoEsperado: "nao-gerado",
          massaDados: "nao-gerado",
          automacao: "nao-gerado"
        }
      }
    ],
    status: {
      resultadoEsperado: "nao-gerado",
      massaDados: "nao-gerado",
      automacao: "nao-gerado"
    }
  }
];
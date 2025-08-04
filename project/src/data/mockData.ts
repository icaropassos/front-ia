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
        resultadoEsperado: "Produto inserido no carrinho e entrega adiada recalculada",
        massaDados: {
          produto: "812394 - Shampoo Karité 250ml",
          cdPrimario: "11 (sem estoque)",
          cdSecundario: "12 (sem estoque)",
          transito: "20 unidades em CD 11",
          impactoPrazo: "Sim"
        },
        automacao: `@Automated
Cenário: Adicionar produto com corte total no CD primário e captação em trânsito disponível
Dado que o produto está indisponível no CD primário
E existe captação em trânsito com quantidade suficiente
Quando o cliente adiciona o produto ao carrinho
Então o sistema deve inserir a quantidade total via captação em trânsito`,
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
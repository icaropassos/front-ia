export interface Status {
  resultadoEsperado: 'nao-gerado' | 'em-geracao' | 'gerado';
  massaDados: 'nao-gerado' | 'em-geracao' | 'gerado';
  automacao: 'nao-gerado' | 'em-geracao' | 'gerado';
}

export interface Cenario {
  nome: string;
  resultadoEsperado: string;
  massaDados: {
    produto: string;
    cdPrimario: string;
    cdSecundario: string;
    transito: string;
    impactoPrazo: string;
  };
  gherkin: string;
  automacao: string;
  status: Status;
}

export interface Historia {
  id: string;
  historia_id: string;
  titulo: string;
  descricao: string;
  projeto_id: string;
  status_resultado_esperado: string;
  status_massa_dados: string;
  status_automacao: string;
}

export type StatusType = 'nao-gerado' | 'em-geracao' | 'gerado';
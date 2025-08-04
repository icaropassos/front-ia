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
  automacao: string;
  status: Status;
}

export interface Historia {
  id: string;
  titulo: string;
  descricao: string;
  criterios: string[];
  cenarios: Cenario[];
  projeto: string;
  status: Status;
}

export type StatusType = 'nao-gerado' | 'em-geracao' | 'gerado';
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Eye, CheckCircle, Clock, XCircle } from 'lucide-react';
import { mockHistorias } from '../data/mockData';
import StatusIndicator from './StatusIndicator';

const StoryDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const historia = mockHistorias.find(h => h.id === id);

  if (!historia) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">História não encontrada.</p>
        <Link to="/" className="text-blue-600 hover:text-blue-800 mt-2 inline-block">
          Voltar para listagem
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* Story Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <h1 className="text-2xl font-bold text-gray-900">{historia.titulo}</h1>
          <span className="text-sm font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded">
            {historia.id}
          </span>
        </div>
        
        <div className="mb-6">
          <h2 className="text-sm font-semibold text-gray-700 mb-2">Descrição</h2>
          <p className="text-gray-600">{historia.descricao}</p>
        </div>

        <div>
          <h2 className="text-sm font-semibold text-gray-700 mb-3">Critérios de Aceite</h2>
          <ul className="space-y-2">
            {historia.criterios.map((criterio, index) => (
              <li key={index} className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-gray-600">{criterio}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Test Scenarios */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Cenários de Teste Gerados pela IA</h2>
          <span className="text-sm text-gray-500">
            {historia.cenarios.length} cenário{historia.cenarios.length !== 1 ? 's' : ''} encontrado{historia.cenarios.length !== 1 ? 's' : ''}
          </span>
        </div>

        <div className="space-y-4">
          {historia.cenarios.map((cenario, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900 mb-3">{cenario.nome}</h3>
                  
                  <div className="flex gap-3 mb-4">
                    <StatusIndicator 
                      status={cenario.status.resultadoEsperado} 
                      label="Resultado Esperado" 
                    />
                    <StatusIndicator 
                      status={cenario.status.massaDados} 
                      label="Massa de Dados" 
                    />
                    <StatusIndicator 
                      status={cenario.status.automacao} 
                      label="Esqueleto da Automação" 
                    />
                  </div>
                </div>
                
                <Link
                  to={`/historia/${historia.id}/cenario/${index}`}
                  className="inline-flex items-center px-3 py-2 text-sm font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 transition-colors ml-4"
                >
                  <Eye className="h-4 w-4 mr-1" />
                  Ver Detalhes
                </Link>
              </div>
            </div>
          ))}
        </div>

        {historia.cenarios.length === 0 && (
          <div className="text-center py-8">
            <XCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Nenhum cenário de teste foi gerado ainda.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StoryDetails;
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Code, Database, Target, FileText } from 'lucide-react';
import { mockHistorias } from '../data/mockData';

const ScenarioDetails: React.FC = () => {
  const { id, cenarioIndex } = useParams<{ id: string; cenarioIndex: string }>();
  const historia = mockHistorias.find(h => h.id === id);
  const cenario = historia?.cenarios[parseInt(cenarioIndex || '0')];

  if (!historia || !cenario) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Cenário não encontrado.</p>
        <Link to="/" className="text-blue-600 hover:text-blue-800 mt-2 inline-block">
          Voltar para listagem
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <Link
          to={`/historia/${historia.id}`}
          className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Voltar para História
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{cenario.nome}</h1>
        <p className="text-gray-600">
          História: <span className="font-medium">{historia.titulo}</span> ({historia.id})
        </p>
      </div>

      <div className="grid gap-6">
        {/* Gherkin Scenario */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Code className="h-5 w-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900">Cenário em formato Gherkin</h2>
          </div>
          <div className="bg-gray-50 rounded-md p-4">
            <pre className="text-sm text-gray-800 whitespace-pre-wrap font-mono leading-relaxed">
              {cenario.automacao}
            </pre>
          </div>
        </div>

        {/* Expected Result */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Target className="h-5 w-5 text-green-600" />
            <h2 className="text-lg font-semibold text-gray-900">Resultado Esperado</h2>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-md p-4">
            <p className="text-gray-800">{cenario.resultadoEsperado}</p>
          </div>
        </div>

        {/* Test Data */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Database className="h-5 w-5 text-purple-600" />
            <h2 className="text-lg font-semibold text-gray-900">Massa de Dados</h2>
          </div>
          <div className="bg-purple-50 border border-purple-200 rounded-md p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(cenario.massaDados).map(([key, value]) => (
                <div key={key} className="flex justify-between items-center py-2 border-b border-purple-200 last:border-b-0">
                  <span className="font-medium text-gray-700 capitalize">
                    {key.replace(/([A-Z])/g, ' $1').toLowerCase()}:
                  </span>
                  <span className="text-gray-800 text-right">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Automation Skeleton */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <FileText className="h-5 w-5 text-orange-600" />
            <h2 className="text-lg font-semibold text-gray-900">Esqueleto da Automação (Selenium)</h2>
          </div>
          <div className="bg-orange-50 border border-orange-200 rounded-md p-4">
            <pre className="text-sm text-gray-800 whitespace-pre-wrap font-mono leading-relaxed">
              {cenario.automacao}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScenarioDetails;
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Eye, CheckCircle, Clock, XCircle } from 'lucide-react';
import { supabase } from '../supabaseClient';
import StatusIndicator from './StatusIndicator';
import Modal from './Modal';
import { useState, useEffect } from 'react';
import img1 from '../img/anexada1.png';
import img2 from '../img/anexada2.png';
import img3 from '../img/anexada3.png';

// Função para mapear status do banco para o StatusIndicator
const mapStatus = (status: string): 'gerado' | 'em-geracao' | 'nao-gerado' => {
  switch (status) {
    case 'Concluído':
      return 'gerado';
    case 'Em Geração':
      return 'em-geracao';
    case 'Não Gerado':
    default:
      return 'nao-gerado';
  }
};

const StoryDetails: React.FC = () => {
  const { historia_id } = useParams<{ historia_id: string }>();
  const [historia, setHistoria] = useState<any>(null);
  const [criterios, setCriterios] = useState<string[]>([]);
  const [cenarios, setCenarios] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setModalOpen] = useState(false);
  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      // Buscar detalhes da história pelo historia_id
      const { data: historiaData } = await supabase
        .from('historias')
        .select('*')
        .eq('historia_id', historia_id)
        .single();
      setHistoria(historiaData);
      // Buscar critérios e cenários pelo historia_id
      if (historiaData?.historia_id) {
        const { data: criteriosData } = await supabase
          .from('criterios')
          .select('criterio')
          .eq('historia_id', historiaData.historia_id);
        setCriterios(criteriosData ? criteriosData.map(c => c.criterio) : []);
        const { data: cenariosData } = await supabase
          .from('cenarios')
          .select('*')
          .eq('historia_id', historiaData.historia_id);
        setCenarios(cenariosData || []);
      } else {
        setCriterios([]);
        setCenarios([]);
      }
      setLoading(false);
    };
    if (historia_id) fetchData();
  }, [historia_id]);

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Carregando detalhes da história...</p>
      </div>
    );
  }
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
      <div className="relative bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <h1 className="text-2xl font-bold text-gray-900">{historia.titulo}</h1>
          <span className="text-sm font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded">
            {historia.historia_id}
          </span>
        </div>

        <div className="mb-6">
          <h2 className="text-sm font-semibold text-gray-700 mb-2">Descrição</h2>
          <p className="text-gray-600">
            {historia.descricao && historia.descricao.length > 250
              ? historia.descricao.slice(0, 250) + '...'
              : historia.descricao}
          </p>
        </div>

        <div>
          <h2 className="text-sm font-semibold text-gray-700 mb-3">Critérios de Aceite</h2>
          <ul className="space-y-2">
            {criterios.map((criterio, index) => (
              <li key={index} className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-gray-600">{criterio}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex justify-between items-end mt-8">
          <button
            onClick={openModal}
            className="absolute bottom-6 right-6 inline-flex items-center px-3 py-2 text-sm font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 transition-colors"
          >
            <Eye className="h-4 w-4 mr-1" />
            Ver Detalhes
          </button>
        </div>

      </div>

      {/* Test Scenarios */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Cenários de Teste Gerados pela IA</h2>
          <span className="text-sm text-gray-500">
            {cenarios.length} cenário{cenarios.length !== 1 ? 's' : ''} encontrado{cenarios.length !== 1 ? 's' : ''}
          </span>
        </div>

        <div className="space-y-4">
          {cenarios.map((cenario, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900 mb-3">{cenario.nome}</h3>
                  <div className="flex gap-3 mb-4">
                    <StatusIndicator
                      status={mapStatus(cenario.status_resultado_esperado)}
                      label="Resultado Esperado"
                    />
                    <StatusIndicator
                      status={mapStatus(cenario.status_massa_dados)}
                      label="Massa de Dados"
                    />
                    <StatusIndicator
                      status={mapStatus(cenario.status_automacao)}
                      label="Esqueleto da Automação"
                    />
                  </div>
                </div>
                <Link
                  to={`/historia/${historia.historia_id}/cenario/${index}`}
                  className="inline-flex items-center px-3 py-2 text-sm font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 transition-colors ml-4"
                >
                  <Eye className="h-4 w-4 mr-1" />
                  Ver Detalhes
                </Link>
              </div>
            </div>
          ))}
        </div>

        {cenarios.length === 0 && (
          <div className="text-center py-8">
            <XCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Nenhum cenário de teste foi gerado ainda.</p>
          </div>
        )}
      </div>
      <Modal isOpen={isModalOpen} onClose={closeModal} title="Detalhes da História">
        <h2 className="text-lg font-bold mb-2 text-gray-900">Descrição Completa</h2>
        <pre className="whitespace-pre-wrap text-gray-800 text-sm mb-4">
          {historia?.descricao || "Nenhum conteúdo encontrado."}
        </pre>
      </Modal>
    </div>

  );

};

export default StoryDetails;
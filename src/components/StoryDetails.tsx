import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Eye, CheckCircle, XCircle, Plus, Check, Trash2, Loader2, ExternalLink } from 'lucide-react';
import { supabase } from '../supabaseClient';
import StatusIndicator from './StatusIndicator';
import Modal from './Modal';
import { CreateScenarioModal } from './CreateScenarioModal';
import Toast from './Toast';
import ApprovalModal from './ApprovalModal';
import { Cenario } from '../types';
import { useState, useEffect } from 'react';

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
  const [isScenarioModalOpen, setScenarioModalOpen] = useState(false);
  const [isApproveModalOpen, setApproveModalOpen] = useState(false);
  const [isSubmittingToJira, setIsSubmittingToJira] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');
  const [selectedCenarioId, setSelectedCenarioId] = useState<string>('');
  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);
  const openScenarioModal = () => setScenarioModalOpen(true);
  const closeScenarioModal = () => setScenarioModalOpen(false);
  const openApproveModal = () => setApproveModalOpen(true);
  const closeApproveModal = () => setApproveModalOpen(false);
  const closeToast = () => setShowToast(false);

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

  const handleCreateScenario = async (newCenario: Cenario) => {
    if (!historia) return;
    
    try {
      const { data, error } = await supabase
        .from('cenarios')
        .insert([{
          historia_id: historia.historia_id,
          nome: newCenario.nome,
          gherkin: newCenario.gherkin,
          resultado_esperado: newCenario.resultadoEsperado,
          massa_dados: newCenario.massaDados,
          automacao: newCenario.automacao,
          status_resultado_esperado: newCenario.status.resultadoEsperado,
          status_massa_dados: newCenario.status.massaDados,
          status_automacao: newCenario.status.automacao
        }])
        .select();
      
      if (error) {
        console.error('Erro ao criar cenário:', error);
        return;
      }
      
      // Atualizar a lista de cenários
      setCenarios(prev => [...prev, ...(data || [])]);
    } catch (error) {
      console.error('Erro ao criar cenário:', error);
    }
  };

  const handleApproveCenario = (cenarioId: string) => {
    // Armazenar o ID do cenário selecionado
    setSelectedCenarioId(cenarioId);
    // Abrir modal de confirmação para integração com JIRA
    openApproveModal();
  };

  const handleRemoveCenario = async (cenarioId: string) => {
    try {
      const { error } = await supabase
        .from('cenarios')
        .delete()
        .eq('id', cenarioId);
      
      if (error) {
        console.error('Erro ao remover cenário:', error);
        return;
      }
      
      // Atualizar a lista de cenários
      setCenarios(prev => prev.filter(c => c.id !== cenarioId));
    } catch (error) {
      console.error('Erro ao remover cenário:', error);
    }
  };

  const handleApproveStory = async () => {
    // Fechar modal imediatamente
    closeApproveModal();
    setIsSubmittingToJira(true);
    
    try {
      const response = await fetch('https://sistemas-new-n8n-qa.sysmap.com.br/webhook/post-jira', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          historia_id: historia.historia_id,
          cenario_id: selectedCenarioId
        }),
      });

      if (response.ok) {
        // Verificar no Supabase se integracao_ok do cenário foi atualizado para true e buscar o link_jira
        const { data: updatedCenario } = await supabase
          .from('cenarios')
          .select('integracao_ok, link_jira')
          .eq('id', selectedCenarioId)
          .single();
        
        if (updatedCenario?.integracao_ok) {
          // Atualizar o cenário na lista local com link_jira
          setCenarios(prev => prev.map(c => 
            c.id === selectedCenarioId 
              ? { ...c, integracao_ok: true, link_jira: updatedCenario.link_jira }
              : c
          ));
          setToastMessage('Cenário aprovado e integrado ao JIRA com sucesso!');
          setToastType('success');
          setShowToast(true);
        } else {
          // Aguardar um pouco e tentar novamente (caso o webhook ainda esteja processando)
          setTimeout(async () => {
            const { data: recheckCenario } = await supabase
              .from('cenarios')
              .select('integracao_ok, link_jira')
              .eq('id', selectedCenarioId)
              .single();
              
            if (recheckCenario?.integracao_ok) {
              // Atualizar o cenário na lista local com link_jira
              setCenarios(prev => prev.map(c => 
                c.id === selectedCenarioId 
                  ? { ...c, integracao_ok: true, link_jira: recheckCenario.link_jira }
                  : c
              ));
              setToastMessage('Cenário aprovado e integrado ao JIRA com sucesso!');
              setToastType('success');
              setShowToast(true);
            }
          }, 3000);
        }
      } else {
        throw new Error('Erro na requisição ao JIRA');
      }
    } catch (error) {
      console.error('Erro ao aprovar história:', error);
      setToastMessage('Erro ao integrar com o JIRA. Tente novamente.');
      setToastType('error');
      setShowToast(true);
    } finally {
      setIsSubmittingToJira(false);
    }
  };

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
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500">
              {cenarios.length} cenário{cenarios.length !== 1 ? 's' : ''} encontrado{cenarios.length !== 1 ? 's' : ''}
            </span>
            <button
              onClick={openScenarioModal}
              className="inline-flex items-center px-3 py-2 text-sm font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 transition-colors"
            >
              <Plus className="h-4 w-4 mr-1" size={16} />
              Criar Novo Cenário
            </button>
          </div>
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

                <div className="flex gap-2 ml-4">
                  <Link
                    to={`/historia/${historia.historia_id}/cenario/${index}`}
                    className="inline-flex items-center px-3 py-2 text-sm font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 transition-colors"
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    Ver Detalhes
                  </Link>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-4">
                {cenario.integracao_ok ? (
                  <button
                    onClick={() => window.open(cenario.link_jira, '_blank')}
                    className="inline-flex items-center px-3 py-2 text-sm font-medium text-blue-700 bg-white border border-blue-300 rounded-md hover:bg-blue-50 transition-colors"
                  >
                    <ExternalLink className="h-4 w-4 mr-1" size={16} />
                    Ver no Jira
                  </button>
                ) : isSubmittingToJira && selectedCenarioId === cenario.id ? (
                  <button
                    disabled
                    className="inline-flex items-center px-3 py-2 text-sm font-medium text-yellow-700 bg-yellow-50 border border-yellow-200 rounded-md opacity-75 cursor-not-allowed"
                  >
                    <Loader2 className="h-4 w-4 mr-1 animate-spin" size={16} />
                    Processando...
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => handleApproveCenario(cenario.id)}
                      className="inline-flex items-center px-3 py-2 text-sm font-medium text-green-700 bg-green-50 border border-green-200 rounded-md hover:bg-green-100 transition-colors"
                    >
                      <Check className="h-4 w-4 mr-1" size={16} />
                      Aprovar
                    </button>
                    <button
                      onClick={() => handleRemoveCenario(cenario.id)}
                      className="inline-flex items-center px-3 py-2 text-sm font-medium text-red-700 bg-red-50 border border-red-200 rounded-md hover:bg-red-100 transition-colors"
                    >
                      <Trash2 className="h-4 w-4 mr-1" size={16} />
                      Remover
                    </button>
                  </>
                )}
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
      
      <CreateScenarioModal
        isOpen={isScenarioModalOpen}
        onClose={closeScenarioModal}
        onSave={handleCreateScenario}
      />
      
      <ApprovalModal
        isOpen={isApproveModalOpen}
        onClose={closeApproveModal}
        onConfirm={handleApproveStory}
        historiaId={historia?.historia_id || ''}
      />
      
      <Toast
        isVisible={showToast}
        message={toastMessage}
        type={toastType}
        onClose={closeToast}
      />
    </div>

  );

};

export default StoryDetails;
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Code, Database, Target, FileText, Check, Trash2, Loader2, ExternalLink } from 'lucide-react';
import { supabase } from '../supabaseClient';
import Modal from '../components/Modal';
import Toast from '../components/Toast';
import ApprovalModal from '../components/ApprovalModal';

interface Historia {
  id: string;
  historia_id: string;
  titulo: string;
  descricao: string;
}

interface Cenario {
  id: string;
  nome: string;
  resultado_esperado: string;
  gherkin: string;
  automacao: string;
  status_resultado_esperado: string;
  status_massa_dados: string;
  status_automacao: string;
  integracao_ok: boolean;
  link_jira: string;
}

interface MassaDados {
  produto: string;
  cd_primario: string;
  cd_secundario: string;
  transito: string;
  impacto_prazo: string;
}

const ScenarioDetails: React.FC = () => {
  const { historia_id, cenarioIndex } = useParams<{ historia_id: string; cenarioIndex: string }>();
  const [historia, setHistoria] = useState<Historia | null>(null);
  const [cenarios, setCenarios] = useState<Cenario[]>([]);
  const [massaDados, setMassaDados] = useState<MassaDados[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isApproveModalOpen, setApproveModalOpen] = useState(false);
  const [isSubmittingToJira, setIsSubmittingToJira] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');

  const cenarioIdx = parseInt(cenarioIndex || '0');
  const cenario = cenarios[cenarioIdx];

  // Função para determinar cores baseadas no status e seção
  const getStatusColors = (status: string, section: 'gherkin' | 'resultado' | 'massa' | 'automacao') => {
    const isCompleted = status?.toLowerCase() === 'concluído' || status?.toLowerCase() === 'concluido';
    const isInProgress = status?.toLowerCase() === 'em geração' || status?.toLowerCase() === 'em geracao';
    
    if (isCompleted) {
      switch (section) {
        case 'gherkin':
          return { icon: 'text-blue-600', bg: 'bg-blue-50 border-blue-200' };
        case 'resultado':
          return { icon: 'text-green-600', bg: 'bg-green-50 border-green-200' };
        case 'massa':
          return { icon: 'text-blue-600', bg: 'bg-blue-50 border-blue-200' };
        case 'automacao':
          return { icon: 'text-orange-600', bg: 'bg-orange-50 border-orange-200' };
      }
    } else if (isInProgress) {
      switch (section) {
        case 'gherkin':
          return { icon: 'text-blue-400', bg: 'bg-blue-100 border-blue-300' };
        case 'resultado':
          return { icon: 'text-green-400', bg: 'bg-green-100 border-green-300' };
        case 'massa':
          return { icon: 'text-blue-400', bg: 'bg-blue-100 border-blue-300' };
        case 'automacao':
          return { icon: 'text-orange-400', bg: 'bg-orange-100 border-orange-300' };
      }
    }
    
    // Não gerado - sempre cinza
    return { icon: 'text-gray-400', bg: 'bg-gray-50 border-gray-200' };
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!historia_id) return;

      setLoading(true);
      
      // Buscar história
      const { data: historiaData } = await supabase
        .from('historias')
        .select('*')
        .eq('historia_id', historia_id)
        .single();

      if (historiaData) {
        setHistoria(historiaData);

        // Buscar cenários
        const { data: cenariosData } = await supabase
          .from('cenarios')
          .select('*')
          .eq('historia_id', historia_id);

        if (cenariosData) {
          setCenarios(cenariosData);

          // Buscar massa de dados para o cenário específico
          if (cenariosData[cenarioIdx]) {
            const { data: massaData } = await supabase
              .from('massa_dados')
              .select('*')
              .eq('cenario_id', cenariosData[cenarioIdx].id);

            if (massaData) {
              setMassaDados(massaData);
            }
          }
        }
      }
      
      setLoading(false);
    };

    fetchData();
  }, [historia_id, cenarioIdx]);

  const handleApproveCenario = () => {
    // Abrir modal de confirmação para integração com JIRA
    setApproveModalOpen(true);
  };

  const handleApproveToJira = async () => {
    if (!cenario || !historia_id) return;
    
    // Fechar modal imediatamente
    setApproveModalOpen(false);
    setIsSubmittingToJira(true);
    
    try {
      const response = await fetch('https://sistemas-new-n8n-qa.sysmap.com.br/webhook/post-jira', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          historia_id: historia_id,
          cenario_id: cenario.id
        }),
      });

      if (response.ok) {
        // Verificar no Supabase se integracao_ok do cenário foi atualizado para true e buscar o link_jira
        const { data: updatedCenario } = await supabase
          .from('cenarios')
          .select('integracao_ok, link_jira')
          .eq('id', cenario.id)
          .single();
        
        if (updatedCenario?.integracao_ok) {
          // Atualizar o cenário na lista local com link_jira
          setCenarios(prev => prev.map(c => 
            c.id === cenario.id 
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
              .eq('id', cenario.id)
              .single();
              
            if (recheckCenario?.integracao_ok) {
              // Atualizar o cenário na lista local com link_jira
              setCenarios(prev => prev.map(c => 
                c.id === cenario.id 
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
      console.error('Erro ao aprovar cenário:', error);
      setToastMessage('Erro ao integrar com o JIRA. Tente novamente.');
      setToastType('error');
      setShowToast(true);
    } finally {
      setIsSubmittingToJira(false);
    }
  };

  const handleRemoveCenario = async () => {
    if (!cenario || !historia_id) return;
    
    if (!confirm('Tem certeza que deseja remover este cenário? Esta ação não pode ser desfeita.')) {
      return;
    }
    
    try {
      const { error } = await supabase
        .from('cenarios')
        .delete()
        .eq('id', cenario.id);
      
      if (error) {
        console.error('Erro ao remover cenário:', error);
        return;
      }
      
      // Redirecionar para a página da história
      window.location.href = `/historia/${historia_id}`;
    } catch (error) {
      console.error('Erro ao remover cenário:', error);
    }
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const openApproveModal = () => setApproveModalOpen(true);
  const closeApproveModal = () => setApproveModalOpen(false);
  const closeToast = () => setShowToast(false);

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Carregando cenário...</p>
      </div>
    );
  }

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
          to={`/historia/${historia.historia_id}`}
          className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Voltar para História
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{cenario.nome}</h1>
        <p className="text-gray-600">
          História: <span className="font-medium">{historia.titulo}</span> ({historia.historia_id})
        </p>
        <p className="text-gray-600">
          {historia.descricao && historia.descricao.length > 120
            ? (
              <>
                {historia.descricao.slice(0, 120)}...{' '}
                <button
                  onClick={openModal}
                  className="text-blue-600 hover:text-blue-800 underline"
                >
                  Ver detalhes completos
                </button>
              </>
            )
            : historia.descricao}
        </p>
        
        {/* Botões de Ação */}
        <div className="flex gap-3 mt-4">
          {cenario.integracao_ok ? (
            <button
              onClick={() => window.open(cenario.link_jira, '_blank')}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-700 bg-white border border-blue-300 rounded-md hover:bg-blue-50 transition-colors"
            >
              <ExternalLink className="h-4 w-4 mr-2" size={16} />
              Ver no JIRA
            </button>
          ) : isSubmittingToJira ? (
            <button
              disabled
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-yellow-700 bg-yellow-50 border border-yellow-200 rounded-md opacity-75 cursor-not-allowed"
            >
              <Loader2 className="h-4 w-4 mr-2 animate-spin" size={16} />
              Processando...
            </button>
          ) : (
            <>
              <button
                onClick={handleApproveCenario}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-green-700 bg-green-50 border border-green-200 rounded-md hover:bg-green-100 transition-colors"
              >
                <Check className="h-4 w-4 mr-2" size={16} />
                Aprovar Cenário
              </button>
              <button
                onClick={handleRemoveCenario}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-red-700 bg-red-50 border border-red-200 rounded-md hover:bg-red-100 transition-colors"
              >
                <Trash2 className="h-4 w-4 mr-2" size={16} />
                Remover Cenário
              </button>
            </>
          )}
        </div>
      </div>

      <div className="grid gap-6">
        {/* Gherkin Scenario */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Code className={`h-5 w-5 ${getStatusColors(cenario.status_resultado_esperado, 'gherkin').icon}`} />
            <h2 className="text-lg font-semibold text-gray-900">Cenário em formato Gherkin</h2>
          </div>
          <div className={`${getStatusColors(cenario.status_resultado_esperado, 'gherkin').bg} border rounded-md p-4`}>
            {cenario.gherkin && cenario.gherkin.trim() ? (
              <pre className="text-sm text-gray-800 whitespace-pre-wrap font-mono leading-relaxed">
                {cenario.gherkin}
              </pre>
            ) : (
              <p className="text-gray-500">Nenhum cenário Gherkin definido.</p>
            )}
          </div>
        </div>

        {/* Expected Result */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Target className={`h-5 w-5 ${getStatusColors(cenario.status_resultado_esperado, 'resultado').icon}`} />
            <h2 className="text-lg font-semibold text-gray-900">Resultado Esperado</h2>
          </div>
          <div className={`${getStatusColors(cenario.status_resultado_esperado, 'resultado').bg} border rounded-md p-4`}>
            {cenario.resultado_esperado && cenario.resultado_esperado.trim() ? (
              <p className="text-gray-800">{cenario.resultado_esperado}</p>
            ) : (
              <p className="text-gray-500">Nenhum resultado esperado definido para este cenário.</p>
            )}
          </div>
        </div>

        {/* Test Data */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Database className={`h-5 w-5 ${getStatusColors(cenario.status_massa_dados, 'massa').icon}`} />
            <h2 className="text-lg font-semibold text-gray-900">Massa de Dados</h2>
          </div>
          <div className={`${getStatusColors(cenario.status_massa_dados, 'massa').bg} border rounded-md p-4`}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {massaDados.map((massa, index) => {
                const massaColors = getStatusColors(cenario.status_massa_dados, 'massa');
                const borderColor = massaColors.bg.includes('blue') 
                  ? 'border-blue-200'
                  : massaColors.bg.includes('green')
                  ? 'border-green-200'
                  : 'border-gray-200';
                
                return (
                  <div key={index} className="space-y-2">
                    <div className={`flex justify-between items-center py-2 border-b ${borderColor}`}>
                      <span className="font-medium text-gray-700">Produto:</span>
                      <span className="text-gray-800">{massa.produto}</span>
                    </div>
                    <div className={`flex justify-between items-center py-2 border-b ${borderColor}`}>
                      <span className="font-medium text-gray-700">CD Primário:</span>
                      <span className="text-gray-800">{massa.cd_primario}</span>
                    </div>
                    <div className={`flex justify-between items-center py-2 border-b ${borderColor}`}>
                      <span className="font-medium text-gray-700">CD Secundário:</span>
                      <span className="text-gray-800">{massa.cd_secundario}</span>
                    </div>
                    <div className={`flex justify-between items-center py-2 border-b ${borderColor}`}>
                      <span className="font-medium text-gray-700">Trânsito:</span>
                      <span className="text-gray-800">{massa.transito}</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="font-medium text-gray-700">Impacto Prazo:</span>
                      <span className="text-gray-800">{massa.impacto_prazo}</span>
                    </div>
                  </div>
                );
              })}
              {massaDados.length === 0 && (
                <p className="text-gray-500 col-span-2">Nenhuma massa de dados encontrada para este cenário.</p>
              )}
            </div>
          </div>
        </div>

        {/* Automation Skeleton */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <FileText className={`h-5 w-5 ${getStatusColors(cenario.status_automacao, 'automacao').icon}`} />
            <h2 className="text-lg font-semibold text-gray-900">Esqueleto da Automação (Selenium)</h2>
          </div>
          <div className={`${getStatusColors(cenario.status_automacao, 'automacao').bg} border rounded-md p-4`}>
            {cenario.automacao && cenario.automacao.trim() ? (
              <pre className="text-sm text-gray-800 whitespace-pre-wrap font-mono leading-relaxed">
                {cenario.automacao}
              </pre>
            ) : (
              <p className="text-gray-500">Nenhum esqueleto de automação definido para este cenário.</p>
            )}
          </div>
        </div>
      </div>

      {/* Modal for Historia Details */}
      <Modal isOpen={isModalOpen} onClose={closeModal} title="Detalhes da História">
        <h2 className="text-lg font-bold mb-2 text-gray-900">Descrição Completa</h2>
        <pre className="whitespace-pre-wrap text-gray-800 text-sm mb-4">
          {historia?.descricao || "Nenhum conteúdo encontrado."}
        </pre>
      </Modal>

      {/* Modal de Confirmação para Aprovação */}
      <ApprovalModal
        isOpen={isApproveModalOpen}
        onClose={closeApproveModal}
        onConfirm={handleApproveToJira}
        historiaId={historia?.historia_id || ''}
      />

      {/* Toast de Notificação */}
      {showToast && (
        <Toast
          message={toastMessage}
          type={toastType}
          isVisible={showToast}
          onClose={closeToast}
        />
      )}
    </div>
  );
};

export default ScenarioDetails;
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter } from 'lucide-react';
import { supabase } from '../supabaseClient';
import StatusIndicator from './StatusIndicator';
import { Historia } from '../types';

const StoryListing: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProject, setSelectedProject] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [historias, setHistorias] = useState<Historia[]>([]);
  const [projetos, setProjetos] = useState<any[]>([]);
  const [cenariosMap, setCenariosMap] = useState<Record<string, any[]>>({});
  const [massaMap, setMassaMap] = useState<Record<string, any[]>>({});
  const [scriptsMap, setScriptsMap] = useState<Record<string, any[]>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistorias = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('historias')
        .select('*');
      if (error) {
        setHistorias([]);
        setCenariosMap({});
        setMassaMap({});
        setScriptsMap({});
      } else {
        setHistorias(data || []);
        // Buscar cenários, massa de dados e scripts para cada história
        const cenariosPromises = (data || []).map(async (hist: any) => {
          const { data: cenarios } = await supabase
            .from('cenarios')
            .select('*')
            .eq('historia_id', hist.historia_id);
          return { historia_id: hist.historia_id, cenarios: cenarios || [] };
        });
        const massaPromises = (data || []).map(async (hist: any) => {
          const { data: massas } = await supabase
            .from('massa_dados')
            .select('*')
            .eq('historia_id', hist.historia_id);
          return { historia_id: hist.historia_id, massas: massas || [] };
        });
        const scriptsPromises = (data || []).map(async (hist: any) => {
          const { data: scripts } = await supabase
            .from('scripts')
            .select('*')
            .eq('historia_id', hist.historia_id);
          return { historia_id: hist.historia_id, scripts: scripts || [] };
        });
        const cenariosResults = await Promise.all(cenariosPromises);
        const massaResults = await Promise.all(massaPromises);
        const scriptsResults = await Promise.all(scriptsPromises);
        // Montar mapas para acesso rápido
        const cenariosMapObj: Record<string, any[]> = {};
        cenariosResults.forEach(({ historia_id, cenarios }) => {
          cenariosMapObj[historia_id] = cenarios;
        });
        setCenariosMap(cenariosMapObj);
        const massaMapObj: Record<string, any[]> = {};
        massaResults.forEach(({ historia_id, massas }) => {
          massaMapObj[historia_id] = massas;
        });
        setMassaMap(massaMapObj);
        const scriptsMapObj: Record<string, any[]> = {};
        scriptsResults.forEach(({ historia_id, scripts }) => {
          scriptsMapObj[historia_id] = scripts;
        });
        setScriptsMap(scriptsMapObj);
      }
      setLoading(false);
    };
    const fetchProjetos = async () => {
      const { data, error } = await supabase
        .from('projetos')
        .select('*');
      if (!error) {
        setProjetos(data || []);
      }
    };
    fetchHistorias();
    fetchProjetos();
  }, []);

  const projects = projetos.map(p => p.nome);
  
  // Função para mapear status do banco para o formato do StatusIndicator
  const mapStatus = (status: string): 'nao-gerado' | 'em-geracao' | 'gerado' => {
    const statusLower = status?.toLowerCase();
    if (statusLower === 'concluído' || statusLower === 'concluido') {
      return 'gerado';
    } else if (statusLower === 'em geração' || statusLower === 'em geracao') {
      return 'em-geracao';
    } else {
      return 'nao-gerado';
    }
  };
  
  const filteredHistorias = historias.filter((historia: any) => {
    const projetoNome = projetos.find(p => p.id === historia.projeto_id)?.nome || '';
    const matchesSearch = historia.titulo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         historia.id?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesProject = !selectedProject || projetoNome === selectedProject;
    const matchesStatus = !selectedStatus || 
                         historia.status_resultado_esperado === selectedStatus ||
                         historia.status_massa_dados === selectedStatus ||
                         historia.status_automacao === selectedStatus;
    return matchesSearch && matchesProject && matchesStatus;
  });

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Histórias Funcionais</h1>
        <p className="text-gray-600">Gerencie e acompanhe o progresso de geração de testes por IA</p>
      </div>
      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Buscar Histórias
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Digite o título ou ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Projeto
            </label>
            <select
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Todos os projetos</option>
              {projects.map(project => (
                <option key={project} value={project}>{project}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status de Geração
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Todos os status</option>
              <option value="gerado">Gerado</option>
              <option value="em-geracao">Em Geração</option>
              <option value="nao-gerado">Não Gerado</option>
            </select>
          </div>
        </div>
      </div>
      {/* Stories List */}
      {loading ? (
        <div className="text-center py-12">
          <p className="text-gray-500">Carregando histórias...</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {filteredHistorias.map((historia) => (
            <div key={historia.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{historia.titulo}</h3>
                    <span className="text-sm font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
                      {historia.historia_id}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-3">
                    {historia.descricao && historia.descricao.length > 120
                      ? historia.descricao.slice(0, 120) + '...'
                      : historia.descricao}
                  </p>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Filter className="h-4 w-4" />
                    <span>{projetos.find(p => p.id === historia.projeto_id)?.nome || ''}</span>
                  </div>
                </div>
              </div>
              <div className="border-t border-gray-200 pt-4">
                <div className="flex items-center justify-between">
                  <div className="flex gap-3">
                    <StatusIndicator 
                      status={mapStatus(historia.status_resultado_esperado)} 
                      label="Resultado Esperado" 
                    />
                    <StatusIndicator 
                      status={mapStatus(historia.status_massa_dados)} 
                      label="Massa de Dados" 
                    />
                    <StatusIndicator 
                      status={mapStatus(historia.status_automacao)} 
                      label="Esqueleto da Automação" 
                    />
                  </div>
                  <Link
                    to={`/historia/${historia.historia_id}`}
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 transition-colors"
                  >
                    Ver Casos de Teste
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {!loading && filteredHistorias.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">Nenhuma história encontrada com os filtros aplicados.</p>
        </div>
      )}
    </div>
  );
};

export default StoryListing;
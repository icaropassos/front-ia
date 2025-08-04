import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter } from 'lucide-react';
import { mockHistorias } from '../data/mockData';
import StatusIndicator from './StatusIndicator';
import { Historia } from '../types';

const StoryListing: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProject, setSelectedProject] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  const projects = Array.from(new Set(mockHistorias.map(h => h.projeto)));
  
  const filteredHistorias = mockHistorias.filter((historia: Historia) => {
    const matchesSearch = historia.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         historia.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesProject = !selectedProject || historia.projeto === selectedProject;
    const matchesStatus = !selectedStatus || 
                         historia.status.resultadoEsperado === selectedStatus ||
                         historia.status.massaDados === selectedStatus ||
                         historia.status.automacao === selectedStatus;
    
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
      <div className="grid gap-6">
        {filteredHistorias.map((historia) => (
          <div key={historia.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">{historia.titulo}</h3>
                  <span className="text-sm font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    {historia.id}
                  </span>
                </div>
                <p className="text-gray-600 mb-3">{historia.descricao}</p>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Filter className="h-4 w-4" />
                  <span>{historia.projeto}</span>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <div className="flex items-center justify-between">
                <div className="flex gap-3">
                  <StatusIndicator 
                    status={historia.status.resultadoEsperado} 
                    label="Resultado Esperado" 
                  />
                  <StatusIndicator 
                    status={historia.status.massaDados} 
                    label="Massa de Dados" 
                  />
                  <StatusIndicator 
                    status={historia.status.automacao} 
                    label="Esqueleto da Automação" 
                  />
                </div>
                <Link
                  to={`/historia/${historia.id}`}
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 transition-colors"
                >
                  Ver Casos de Teste
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredHistorias.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">Nenhuma história encontrada com os filtros aplicados.</p>
        </div>
      )}
    </div>
  );
};

export default StoryListing;
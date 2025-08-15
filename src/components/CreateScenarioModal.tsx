import React, { useState } from 'react';
import { X, Plus } from 'lucide-react';
import { Cenario } from '../types';

interface CreateScenarioModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (cenario: Cenario) => void;
}

export const CreateScenarioModal: React.FC<CreateScenarioModalProps> = ({
  isOpen,
  onClose,
  onSave
}) => {
  const [formData, setFormData] = useState({
    nome: '',
    gherkin: '',
    resultadoEsperado: '',
    massaDados: '{\n  "produto": "",\n  "cdPrimario": "",\n  "cdSecundario": "",\n  "transito": "",\n  "impactoPrazo": ""\n}',
    automacao: ''
  });

  const [jsonError, setJsonError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate JSON
    let parsedMassaDados = {};
    try {
      parsedMassaDados = JSON.parse(formData.massaDados);
      setJsonError('');
    } catch (error) {
      setJsonError('JSON inválido. Por favor, verifique a sintaxe.');
      return;
    }
    
    const newCenario: Cenario = {
      nome: formData.nome,
      gherkin: formData.gherkin,
      resultadoEsperado: formData.resultadoEsperado,
      massaDados: parsedMassaDados,
      automacao: formData.automacao,
      status: {
        resultadoEsperado: formData.resultadoEsperado.trim() ? 'gerado' : 'nao-gerado',
        massaDados: Object.keys(parsedMassaDados).length > 0 && Object.values(parsedMassaDados).some(v => String(v).trim() !== '') ? 'gerado' : 'nao-gerado',
        automacao: formData.automacao.trim() ? 'gerado' : 'nao-gerado'
      }
    };

    onSave(newCenario);
    
    // Reset form
    setFormData({
      nome: '',
      gherkin: '',
      resultadoEsperado: '',
      massaDados: '{\n  "produto": "",\n  "cdPrimario": "",\n  "cdSecundario": "",\n  "transito": "",\n  "impactoPrazo": ""\n}',
      automacao: ''
    });
    
    onClose();
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleMassaDadosChange = (value: string) => {
    setFormData(prev => ({ ...prev, massaDados: value }));
    
    // Validate JSON in real-time
    try {
      JSON.parse(value);
      setJsonError('');
    } catch (error) {
      if (value.trim() !== '') {
        setJsonError('JSON inválido');
      } else {
        setJsonError('');
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Criar Novo Cenário de Teste</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Nome do Cenário */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Nome do Cenário *
            </label>
            <input
              type="text"
              required
              value={formData.nome}
              onChange={(e) => handleInputChange('nome', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ex: Adicionar produto com corte total no CD primário..."
            />
          </div>

          {/* Cenário Gherkin */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Cenário em formato Gherkin
            </label>
            <textarea
              value={formData.gherkin}
              onChange={(e) => handleInputChange('gherkin', e.target.value)}
              rows={6}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
              placeholder="Cenário: Nome do cenário&#10;Dado que...&#10;E...&#10;Quando...&#10;Então..."
            />
          </div>

          {/* Resultado Esperado */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Resultado Esperado
            </label>
            <textarea
              value={formData.resultadoEsperado}
              onChange={(e) => handleInputChange('resultadoEsperado', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Descreva o resultado esperado do teste..."
            />
          </div>

          {/* Massa de Dados */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-3">
              Massa de Dados (JSON)
            </label>
            <textarea
              value={formData.massaDados}
              onChange={(e) => handleMassaDadosChange(e.target.value)}
              rows={8}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm ${
                jsonError ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder='{\n  "produto": "812394 - Shampoo Karité 250ml",\n  "cdPrimario": "11 (sem estoque)",\n  "personId": "12345",\n  "countryCode": "BR",\n  "credits": 100\n}'
            />
            {jsonError && (
              <p className="mt-1 text-sm text-red-600">{jsonError}</p>
            )}
            <p className="mt-2 text-xs text-gray-500">
              Adicione qualquer campo personalizado que precisar para o teste (produto, personId, countryCode, credits, etc.)
            </p>
          </div>

          {/* Esqueleto da Automação */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Esqueleto da Automação (Selenium)
            </label>
            <textarea
              value={formData.automacao}
              onChange={(e) => handleInputChange('automacao', e.target.value)}
              rows={6}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
              placeholder="@Automated&#10;Cenário: Nome do cenário&#10;Dado que...&#10;E...&#10;Quando...&#10;Então..."
            />
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
            >
              <Plus size={16} />
              Criar Cenário
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

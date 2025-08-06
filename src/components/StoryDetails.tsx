@@ .. @@
 import React from 'react';
 import { useParams, Link } from 'react-router-dom';
-import { Eye, CheckCircle, Clock, XCircle } from 'lucide-react';
+import { Eye, CheckCircle, Clock, XCircle, Info, X, Download, Calendar } from 'lucide-react';
 import { mockHistorias } from '../data/mockData';
 import StatusIndicator from './StatusIndicator';

 const StoryDetails: React.FC = () => {
   const { id } = useParams<{ id: string }>();
   const historia = mockHistorias.find(h => h.id === id);
+  const [isModalOpen, setIsModalOpen] = React.useState(false);

   if (!historia) {
@@ .. @@
         <div className="flex items-center gap-3 mb-4">
           <h1 className="text-2xl font-bold text-gray-900">{historia.titulo}</h1>
           <span className="text-sm font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded">
             {historia.id}
           </span>
+          <button
+            onClick={() => setIsModalOpen(true)}
+            className="inline-flex items-center px-3 py-2 text-sm font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 transition-colors"
+          >
+            <Info className="h-4 w-4 mr-1" />
+            Ver Detalhes
+          </button>
         </div>
         
@@ .. @@
           </div>
         )}
       </div>
+
+      {/* Modal de Detalhes */}
+      {isModalOpen && (
+        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
+          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
+            {/* Header do Modal */}
+            <div className="flex items-center justify-between p-6 border-b border-gray-200">
+              <h2 className="text-xl font-semibold text-gray-900">
+                Detalhes da Funcionalidade: {historia.titulo}
+              </h2>
+              <button
+                onClick={() => setIsModalOpen(false)}
+                className="text-gray-400 hover:text-gray-600 transition-colors"
+              >
+                <X className="h-6 w-6" />
+              </button>
+            </div>
+
+            {/* Conteúdo do Modal com Scroll */}
+            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
+              {/* Contexto */}
+              <div className="mb-8">
+                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
+                  <Info className="h-5 w-5 text-blue-600 mr-2" />
+                  Contexto
+                </h3>
+                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
+                  <p className="text-gray-700 leading-relaxed">
+                    Quando a consultora adiciona um produto ao carrinho, o sistema verifica a disponibilidade nos CDs primário e secundário. 
+                    Caso não haja estoque, mas exista estoque em trânsito, o item pode ser incluído no pedido.
+                  </p>
+                  <p className="text-gray-700 leading-relaxed mt-3">
+                    Entretanto, se o CD de destino do item em trânsito impactar o prazo de entrega, a consultora deve escolher entre 
+                    adiar a entrega para receber o item ou seguir com o pedido sem ele.
+                  </p>
+                </div>
+              </div>
+
+              {/* Comportamento Esperado */}
+              <div className="mb-8">
+                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
+                  <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
+                  Comportamento Esperado
+                </h3>
+                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
+                  <ol className="list-decimal list-inside space-y-2 text-gray-700">
+                    <li>Verificar disponibilidade no CD primário e depois no secundário.</li>
+                    <li>Se não houver estoque, verificar se há item em trânsito.</li>
+                    <li>Se houver em trânsito sem impacto no prazo, adicionar automaticamente.</li>
+                    <li>Se houver apenas em CD com impacto no prazo, exibir um modal de confirmação com opção "Ver opções".</li>
+                  </ol>
+                </div>
+              </div>
+
+              {/* Modal de Confirmação */}
+              <div className="mb-8">
+                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
+                  <Eye className="h-5 w-5 text-purple-600 mr-2" />
+                  Modal de Confirmação Exibido
+                </h3>
+                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
+                  <div className="bg-white border border-purple-300 rounded-md p-4 mb-4">
+                    <p className="text-gray-800 italic">
+                      "O item solicitado não está disponível para pronta entrega, mas caso você possa esperar mais um pouquinho 
+                      para receber seu pedido inteiro, conseguiremos incluir este produto."
+                    </p>
+                  </div>
+                  <p className="text-gray-700 font-medium mb-2">A consultora poderá:</p>
+                  <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
+                    <li>Adicionar o produto (com entrega adiada);</li>
+                    <li>Descartar o item (não incluir no pedido).</li>
+                  </ul>
+                </div>
+              </div>
+
+              {/* Imagem 1 - Modal de Confirmação */}
+              <div className="mb-8">
+                <h4 className="text-md font-medium text-gray-800 mb-3">Exemplo do Modal de Confirmação:</h4>
+                <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
+                  <div className="bg-white rounded-lg shadow-md p-6 max-w-md mx-auto">
+                    <div className="flex items-center justify-center w-12 h-12 bg-orange-100 rounded-full mx-auto mb-4">
+                      <Clock className="h-6 w-6 text-orange-600" />
+                    </div>
+                    <h5 className="text-lg font-semibold text-gray-900 mb-2">Produto em Trânsito</h5>
+                    <p className="text-sm text-gray-600 mb-4">
+                      O item solicitado não está disponível para pronta entrega, mas caso você possa esperar mais um pouquinho...
+                    </p>
+                    <div className="flex gap-2">
+                      <button className="flex-1 px-3 py-2 bg-blue-600 text-white text-sm rounded-md">
+                        Adicionar Produto
+                      </button>
+                      <button className="flex-1 px-3 py-2 bg-gray-300 text-gray-700 text-sm rounded-md">
+                        Descartar Item
+                      </button>
+                    </div>
+                  </div>
+                  <div className="mt-4 flex items-center justify-center gap-2">
+                    <Download className="h-4 w-4 text-gray-500" />
+                    <button className="text-sm text-blue-600 hover:text-blue-800">
+                      Baixar imagem do modal
+                    </button>
+                  </div>
+                </div>
+              </div>
+
+              {/* Resultado Final */}
+              <div className="mb-8">
+                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
+                  <Calendar className="h-5 w-5 text-orange-600 mr-2" />
+                  Resultado ao Adicionar Produto com Entrega Adiada
+                </h3>
+                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
+                  <p className="text-gray-700 mb-3">O item aparece no carrinho com ícone de calendário e texto:</p>
+                  <div className="bg-white border border-orange-300 rounded-md p-3 mb-3">
+                    <div className="flex items-center gap-2">
+                      <Calendar className="h-4 w-4 text-orange-600" />
+                      <span className="text-sm text-orange-700 font-medium">"Este produto adiou a entrega"</span>
+                    </div>
+                  </div>
+                  <p className="text-gray-700">O prazo do pedido é recalculado com base no CD em trânsito.</p>
+                </div>
+              </div>
+
+              {/* Imagem 2 - Produto no Carrinho */}
+              <div className="mb-6">
+                <h4 className="text-md font-medium text-gray-800 mb-3">Exemplo do Produto no Carrinho:</h4>
+                <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
+                  <div className="bg-white rounded-lg shadow-md p-4 max-w-sm mx-auto">
+                    <div className="flex items-center gap-3 p-3 border border-gray-200 rounded-md">
+                      <div className="w-12 h-12 bg-gray-200 rounded-md flex items-center justify-center">
+                        <span className="text-xs text-gray-500">IMG</span>
+                      </div>
+                      <div className="flex-1">
+                        <h6 className="text-sm font-medium text-gray-900">Shampoo Karité 250ml</h6>
+                        <div className="flex items-center gap-1 mt-1">
+                          <Calendar className="h-3 w-3 text-orange-600" />
+                          <span className="text-xs text-orange-700">Este produto adiou a entrega</span>
+                        </div>
+                        <p className="text-xs text-gray-500 mt-1">Qtd: 1 | R$ 29,90</p>
+                      </div>
+                    </div>
+                  </div>
+                  <div className="mt-4 flex items-center justify-center gap-2">
+                    <Download className="h-4 w-4 text-gray-500" />
+                    <button className="text-sm text-blue-600 hover:text-blue-800">
+                      Baixar imagem do carrinho
+                    </button>
+                  </div>
+                </div>
+              </div>
+            </div>
+
+            {/* Footer do Modal */}
+            <div className="flex justify-end p-6 border-t border-gray-200">
+              <button
+                onClick={() => setIsModalOpen(false)}
+                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
+              >
+                Fechar
+              </button>
+            </div>
+          </div>
+        </div>
+      )}
     </div>
   );
 };
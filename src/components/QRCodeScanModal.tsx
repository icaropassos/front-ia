import React from 'react';
import { X, Copy, RotateCcw } from 'lucide-react';

interface QRCodeScanModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: string;
  type?: string;
  onCopy?: () => void;
  onContinueScanning?: () => void;
}

export const QRCodeScanModal: React.FC<QRCodeScanModalProps> = ({
  isOpen,
  onClose,
  result,
  type = "qr",
  onCopy,
  onContinueScanning
}) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    if (onCopy) {
      onCopy();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <div className="w-6 h-6 bg-green-600 rounded grid grid-cols-3 gap-0.5 p-1">
                {[...Array(9)].map((_, i) => (
                  <div key={i} className="bg-white rounded-sm"></div>
                ))}
              </div>
            </div>
            <h2 className="text-xl font-bold text-gray-900">QR Code</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Título */}
          <h3 className="text-lg font-semibold text-gray-900">
            Resultado do escaneamento
          </h3>

          {/* Resultado */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <div className="text-xl font-mono text-gray-900 mb-2">
              {result}
            </div>
            <div className="text-sm text-gray-500">
              Tipo: {type} • {result.length} caracteres
            </div>
          </div>

          {/* Botões de Ação */}
          <div className="space-y-3">
            <button
              onClick={handleCopy}
              className="w-full inline-flex items-center justify-center px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              <Copy className="h-5 w-5 mr-2" />
              Copiar
            </button>

            {onContinueScanning && (
              <button
                onClick={onContinueScanning}
                className="w-full inline-flex items-center justify-center px-4 py-3 text-green-700 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors font-medium"
              >
                <RotateCcw className="h-5 w-5 mr-2" />
                Continuar escaneando
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

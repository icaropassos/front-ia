import React from 'react';
import Modal from './Modal';

interface ApprovalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  historiaId: string;
}

const ApprovalModal: React.FC<ApprovalModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  historiaId
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Confirmar Aprovação">
      <div className="mb-4">
        <p className="text-gray-700 mb-4">
          Ao aprovar este cenário, os dados da história serão integrados ao JIRA automaticamente.
        </p>
        <div className="bg-gray-50 p-3 rounded border">
          <p className="text-sm text-gray-600">
            <strong>História ID:</strong> {historiaId}
          </p>
        </div>
        <p className="text-gray-700 mt-4">
          Deseja continuar com a aprovação e integração ao JIRA?
        </p>
      </div>
      <div className="flex justify-end gap-3">
        <button
          onClick={onClose}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 transition-colors"
        >
          Cancelar
        </button>
        <button
          onClick={onConfirm}
          className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 transition-colors"
        >
          Confirmar Aprovação
        </button>
      </div>
    </Modal>
  );
};

export default ApprovalModal;

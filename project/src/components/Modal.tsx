// components/Modal.tsx
import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-6 relative">
        <button className="absolute top-3 right-3 text-gray-500 hover:text-gray-700" onClick={onClose}>
          ×
        </button>
        <h2 className="text-xl font-semibold mb-4">{title}</h2>
        <div className="max-h-[70vh] overflow-y-auto">{children}</div>
      </div>
    </div>
  );
};

export default Modal;

import React from 'react';
import { StatusType } from '../types';

interface StatusIndicatorProps {
  status: StatusType;
  label: string;
}

const StatusIndicator: React.FC<StatusIndicatorProps> = ({ status, label }) => {
  const getStatusColor = (status: StatusType) => {
    switch (status) {
      case 'gerado':
        return 'bg-green-500';
      case 'em-geracao':
        return 'bg-blue-500';
      case 'nao-gerado':
        return 'bg-gray-400';
      default:
        return 'bg-gray-400';
    }
  };

  const getStatusBg = (status: StatusType) => {
    switch (status) {
      case 'gerado':
        return 'bg-green-50 text-green-800 border-green-200';
      case 'em-geracao':
        return 'bg-blue-50 text-blue-800 border-blue-200';
      case 'nao-gerado':
        return 'bg-gray-50 text-gray-600 border-gray-200';
      default:
        return 'bg-gray-50 text-gray-600 border-gray-200';
    }
  };

  return (
    <div className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium border ${getStatusBg(status)}`}>
      <div className={`w-2 h-2 rounded-full mr-2 ${getStatusColor(status)}`}></div>
      {label}
    </div>
  );
};

export default StatusIndicator;
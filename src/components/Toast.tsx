'use client';

import React from 'react';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onRetry }) => {
  return (
    <div className="flex items-center gap-4 p-4 bg-red-900/20 border border-red-700 rounded-lg">
      <div className="flex-1">
        <p className="text-red-400 text-sm">{message}</p>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-3 py-1 bg-red-700 text-white rounded hover:bg-red-600 transition-colors text-sm"
        >
          Retry
        </button>
      )}
    </div>
  );
};

interface SuccessMessageProps {
  message: string;
  onClose?: () => void;
}

export const SuccessMessage: React.FC<SuccessMessageProps> = ({ message, onClose }) => {
  React.useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="flex items-center gap-4 p-4 bg-green-900/20 border border-green-700 rounded-lg">
      <div className="flex-1">
        <p className="text-green-400 text-sm">{message}</p>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="text-green-400 hover:text-green-300 text-xl"
        >
          ×
        </button>
      )}
    </div>
  );
};

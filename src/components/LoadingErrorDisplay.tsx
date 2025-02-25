import React from "react";

interface LoadingErrorDisplayProps {
  isLoading: boolean;
  error: string | null;
  onRetry: () => void;
}

const LoadingErrorDisplay: React.FC<LoadingErrorDisplayProps> = ({
  isLoading,
  error,
  onRetry
}) => {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
        <div className="text-lg font-medium">Cargando espacios...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <div className="text-red-500 text-lg font-medium mb-4">{error}</div>
        <button 
          onClick={onRetry}
          className="px-4 py-2 bg-primary text-white rounded-md"
        >
          Intentar de nuevo
        </button>
      </div>
    );
  }

  return null;
};

export default LoadingErrorDisplay; 
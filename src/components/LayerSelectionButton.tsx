'use client';

import { useLayerSelection } from '../contexts/LayerSelectionContext';
import { Layers } from 'lucide-react';

export default function LayerSelectionButton() {
  const { dispatch, getSelectedLayersCount, getSelectedCitiesCount, hasAnySelections } = useLayerSelection();

  const handleOpenModal = () => {
    dispatch({ type: 'SET_MODAL_OPEN', payload: true });
  };

  return (
    <button
      onClick={handleOpenModal}
      className="fixed top-6 right-15 z-40 bg-white/90 backdrop-blur-sm hover:bg-white border border-gray-300 rounded-lg px-4 py-2 shadow-lg transition-all duration-200 hover:shadow-xl flex items-center space-x-2"
    >
      <Layers className="w-5 h-5 text-blue-600" />
      <span className="font-medium text-gray-700">Select Layers</span>
      {hasAnySelections() && (
        <div className="flex items-center space-x-1">
          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
            {getSelectedCitiesCount()}
          </span>
          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
            {getSelectedLayersCount()}
          </span>
        </div>
      )}
    </button>
  );
} 
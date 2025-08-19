'use client';

import { useLayerLoader } from '../hooks/useLayerLoader';
import { useLayerSelection } from '../contexts/LayerSelectionContext';
import { RefreshCw, CheckCircle, AlertCircle, Layers } from 'lucide-react';

export default function LayerStatusIndicator() {
  const { loading, error, loadedLayers, hasSelections, refreshLayers } = useLayerLoader();
  const { getSelectedLayersCount, getSelectedCitiesCount } = useLayerSelection();

  if (!hasSelections) {
    return null;
  }

  return (
    <div className="fixed top-6 left-6 z-40 bg-white/90 backdrop-blur-sm border border-gray-300 rounded-lg shadow-lg p-3 max-w-sm">
      <div className="flex items-center space-x-2 mb-2">
        <Layers className="w-5 h-5 text-blue-600" />
        <h3 className="font-medium text-gray-900">Layer Status</h3>
      </div>
      
      <div className="space-y-2 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-gray-600">Selected City:</span>
          <span className="font-medium text-gray-900">{getSelectedCitiesCount()}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-600">Selected Layers:</span>
          <span className="font-medium text-gray-900">{getSelectedLayersCount()}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-600">Loaded Layers:</span>
          <span className="font-medium text-gray-900">{loadedLayers.length}</span>
        </div>
      </div>

      <div className="mt-3 pt-2 border-t border-gray-200">
        {loading && (
          <div className="flex items-center space-x-2 text-blue-600">
            <RefreshCw className="w-4 h-4 animate-spin" />
            <span className="text-sm">Loading layers...</span>
          </div>
        )}
        
        {error && (
          <div className="flex items-center space-x-2 text-red-600">
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm">{error}</span>
          </div>
        )}
        
        {!loading && !error && loadedLayers.length > 0 && (
          <div className="flex items-center space-x-2 text-green-600">
            <CheckCircle className="w-4 h-4" />
            <span className="text-sm">Layers loaded successfully</span>
          </div>
        )}
      </div>

      <button
        onClick={refreshLayers}
        disabled={loading}
        className="mt-3 w-full px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? 'Loading...' : 'Refresh Layers'}
      </button>
    </div>
  );
} 
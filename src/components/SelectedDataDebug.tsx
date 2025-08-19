'use client';

import { useLayerSelection } from '../contexts/LayerSelectionContext';

export default function SelectedDataDebug() {
  const { state } = useLayerSelection();

  if (!state.selectedData.state_slug) {
    return null;
  }

  return (
    <div className="fixed bottom-6 left-6 z-40 bg-white/90 backdrop-blur-sm border border-gray-300 rounded-lg shadow-lg p-4 max-w-sm">
      <h3 className="font-medium text-gray-900 mb-2">Selected Data Debug</h3>
      <div className="text-xs space-y-1">
        <div><strong>State:</strong> {state.selectedData.state_name} ({state.selectedData.state_slug})</div>
        <div><strong>City:</strong> {state.selectedData.city_name} ({state.selectedData.city_slug})</div>
        <div><strong>Layers:</strong> {state.selectedData.layers_slugs.join(', ') || 'None'}</div>
      </div>
      <details className="mt-2">
        <summary className="cursor-pointer text-xs text-blue-600">Raw Data</summary>
        <pre className="text-xs text-gray-600 mt-1 overflow-auto max-h-32">
          {JSON.stringify(state.selectedData, null, 2)}
        </pre>
      </details>
    </div>
  );
} 
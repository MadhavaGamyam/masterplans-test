'use client';

import { useLayerSelection } from '../contexts/LayerSelectionContext';
import { useHierarchy } from '../hooks/useHierarchy';
import { X, MapPin, Layers } from 'lucide-react';

export default function LayerSelectionModal() {
  const { state, dispatch, isModalOpen, getSelectedLayersCount, getSelectedCitiesCount, hasAnySelections } = useLayerSelection();
  const { data: hierarchyData } = useHierarchy();

  const handleStateChange = (stateSlug: string) => {
    if (hierarchyData && stateSlug) {
      const selectedState = hierarchyData.hierarchy.find(item => item.state.slug === stateSlug)?.state || null;
      console.log('State change:', { stateSlug, selectedState });
      dispatch({ type: 'SET_SELECTED_STATE', payload: selectedState });
    } else if (!stateSlug) {
      // Clear state when empty option is selected
      dispatch({ type: 'SET_SELECTED_STATE', payload: null });
    }
  };

  const handleCityChange = (citySlug: string, cityName: string) => {
    dispatch({ type: 'SET_SELECTED_CITY', payload: { citySlug, cityName } });
  };

  const handleLayerToggle = (layerSlug: string) => {
    dispatch({ type: 'TOGGLE_LAYER', payload: { layerSlug } });
  };

  const handleClearAllSelections = () => {
    dispatch({ type: 'CLEAR_ALL_SELECTIONS' });
    // Also clear localStorage to avoid conflicts
    localStorage.removeItem('layerSelections');
  };

  const handleCloseModal = () => {
    dispatch({ type: 'SET_MODAL_OPEN', payload: false });
  };

  const selectedStateData = hierarchyData?.hierarchy.find(item => 
    item.state.code === state.selectedData?.state_slug || 
    item.state.slug === state.selectedData?.state_slug
  );
  const selectedCityData = selectedStateData?.cities.find(city => city.slug === state.selectedData?.city_slug);
  
  console.log('Modal render:', {
    stateSlug: state.selectedData?.state_slug,
    citySlug: state.selectedData?.city_slug,
    selectedStateData: selectedStateData?.state.name,
    selectedCityData: selectedCityData?.name,
    hierarchyData: hierarchyData?.hierarchy.map(h => ({ 
      code: h.state.code, 
      slug: h.state.slug,
      name: h.state.name 
    })),
    foundStateData: selectedStateData ? 'Found' : 'Not Found'
  });

  if (!isModalOpen) return null;

  return (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1100] p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[93vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <Layers className="w-6 h-6 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-900">Layer Selection</h2>
          </div>
          <button
            onClick={handleCloseModal}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {/* State Selection */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Select State
              </label>
              {state.selectedData.state_slug && (
                <button
                  onClick={() => handleStateChange('')}
                  className="text-xs text-red-600 hover:text-red-800 hover:underline"
                >
                  Clear State
                </button>
              )}
            </div>
            <select
              value={state.selectedData.state_slug || ''}
              onChange={(e) => {
                console.log('Dropdown change:', e.target.value);
                handleStateChange(e.target.value);
              }}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Choose a state...</option>
              {hierarchyData?.hierarchy.map((stateData) => (
                <option key={stateData.state.slug} value={stateData.state.slug}>
                  {stateData.state.name} ({stateData.state.code})
                </option>
              ))}
            </select>
            <div className="mt-2 text-xs text-gray-500">
              Current selection: {state.selectedData.state_slug || 'None'} - {state.selectedData.state_name || 'None'}
            </div>
          </div>

          {/* Selected State Info */}
          {state.selectedData.state_slug && selectedStateData && (
            <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center space-x-2 mb-2">
                <MapPin className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-semibold text-blue-900">
                  {selectedStateData.state.name} ({selectedStateData.state.code})
                </h3>
              </div>
              <p className="text-blue-700">
                {selectedStateData.statistics.total_cities} cities available
              </p>
              <div className="mt-2 text-xs text-gray-600">
                Debug: Found {selectedStateData.cities.length} cities
              </div>
            </div>
          )}
          
          {/* Debug Info */}
          {state.selectedData.state_slug && !selectedStateData && (
            <div className="mb-6 p-4 bg-red-50 rounded-lg border border-red-200">
              <div className="text-red-800">
                <strong>Debug:</strong> State selected but data not found
              </div>
              <div className="text-sm text-red-600 mt-1">
                Looking for: {state.selectedData.state_slug}
              </div>
              <div className="text-sm text-red-600">
                Available: {hierarchyData?.hierarchy.map(h => h.state.slug).join(', ')}
              </div>
            </div>
          )}

          {/* City Selection */}
          {state.selectedData.state_slug && selectedStateData && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Select City</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {selectedStateData.cities.map((city) => (
                  <label
                    key={city.slug}
                    className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                  >
                                         <input
                       type="radio"
                       name="city"
                       value={city.slug}
                       checked={state.selectedData.city_slug === city.slug}
                       onChange={() => handleCityChange(city.slug, city.name)}
                       className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                     />
                    <div>
                      <div className="font-medium text-gray-900">{city.name}</div>
                      <div className="text-sm text-gray-500">
                        {city.statistics.total_layers} layers, {city.statistics.total_features.toLocaleString()} features
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Layer Selection */}
          {state.selectedData.city_slug && selectedCityData && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Select Layers for {selectedCityData.name}</h3>
              {selectedCityData.layers.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {selectedCityData.layers.map((layer) => {
                    const isSelected = state.selectedData.layers_slugs.includes(layer.slug);
                    return (
                      <label
                        key={layer.slug}
                        className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleLayerToggle(layer.slug)}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <div>
                          <div className="font-medium text-gray-900">{layer.name}</div>
                          <div className="text-sm text-gray-500">
                            {layer.feature_count.toLocaleString()} features • {layer.category}
                          </div>
                        </div>
                      </label>
                    );
                  })}
                </div>
              ) : (
                <div className="text-sm text-gray-500 italic p-3">
                  No layers available for this city
                </div>
              )}
            </div>
          )}

          {/* Selection Summary */}
          {hasAnySelections() && (
            <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
              <h3 className="text-lg font-semibold text-green-900 mb-2">Selection Summary</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="font-medium text-green-700">Selected State:</span>
                  <div className="text-green-900">{selectedStateData?.state.name}</div>
                </div>
                <div>
                  <span className="font-medium text-green-700">Selected City:</span>
                  <div className="text-green-900">{selectedCityData?.name}</div>
                </div>
                <div>
                  <span className="font-medium text-green-700">Selected Layers:</span>
                  <div className="text-green-900">{getSelectedLayersCount()}</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleClearAllSelections}
              className="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
            >
              Clear All
            </button>
            {hasAnySelections() && (
              <span className="text-sm text-gray-600">
                {getSelectedCitiesCount()} city, {getSelectedLayersCount()} layers selected
              </span>
            )}
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={handleCloseModal}
              className="px-6 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleCloseModal}
              className="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Apply Selection
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 
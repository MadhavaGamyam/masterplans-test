import { useState, useEffect } from 'react';
import { useLayerSelection } from '../contexts/LayerSelectionContext';

interface LayerData {
  id: string;
  name: string;
  type: string;
  coordinates: number[][];
  properties: Record<string, unknown>;
}

interface LayerLoadingState {
  loading: boolean;
  error: string | null;
  loadedLayers: LayerData[];
}

export const useLayerLoader = () => {
  const [state, setState] = useState<LayerLoadingState>({
    loading: false,
    error: null,
    loadedLayers: [],
  });

  const { state: layerSelectionState, hasAnySelections } = useLayerSelection();

  // Function to load layers based on selections
  const loadSelectedLayers = async () => {
    if (!hasAnySelections()) {
      setState(prev => ({ ...prev, loadedLayers: [] }));
      return;
    }

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      // This is where you would call your API to load the selected layers
      const { state_slug, city_slug, layers_slugs } = layerSelectionState.selectedData;

      console.log('Loading layers for:', {
        state: state_slug,
        city: city_slug,
        layers: layers_slugs
      });

      // TODO: Replace this with actual API call
      // Example API call structure:
      // const response = await fetch('/api/layers', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     state_slug,
      //     city_slug,
      //     layers_slugs
      //   })
      // });
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock layer data - replace with actual API response
      const mockLayers: LayerData[] = layers_slugs.map(layerSlug => ({
        id: `${city_slug}_${layerSlug}`,
        name: `${city_slug} - ${layerSlug}`,
        type: 'Feature',
        coordinates: [[0, 0]], // Replace with actual coordinates from city data
        properties: {
          city: city_slug,
          city_name: layerSelectionState.selectedData.city_name,
          layer: layerSlug,
          state: state_slug,
          state_name: layerSelectionState.selectedData.state_name,
        },
      }));

      setState({
        loading: false,
        error: null,
        loadedLayers: mockLayers,
      });

    } catch (error) {
      setState({
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to load layers',
        loadedLayers: [],
      });
    }
  };

  // Auto-load layers when selections change
  useEffect(() => {
    if (hasAnySelections()) {
      loadSelectedLayers();
    } else {
      setState(prev => ({ ...prev, loadedLayers: [] }));
    }
  }, [layerSelectionState.selectedData, hasAnySelections, loadSelectedLayers]);

  // Function to clear loaded layers
  const clearLoadedLayers = () => {
    setState({
      loading: false,
      error: null,
      loadedLayers: [],
    });
  };

  // Function to refresh layers
  const refreshLayers = () => {
    loadSelectedLayers();
  };

  return {
    ...state,
    loadSelectedLayers,
    clearLoadedLayers,
    refreshLayers,
    hasSelections: hasAnySelections(),
  };
}; 
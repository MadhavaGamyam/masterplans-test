'use client';

import React, { createContext, useContext, useReducer, ReactNode } from 'react';

interface Layer {
  name: string;
  slug: string;
  status: string;
  is_live: boolean;
  tiles_generated: boolean;
  feature_count: number;
  category: string;
  bounds: any;
  tile_urls: any;
}

interface City {
  name: string;
  slug: string;
  center_lat: number;
  center_lng: number;
  is_active: boolean;
  is_live: boolean;
  statistics: {
    total_layers: number;
    processed_layers: number;
    layers_with_tiles: number;
    total_features: number;
  };
  status: string;
  layers: Layer[];
}

interface State {
  name: string;
  slug: string;
  code: string;
  center_lat: number | null;
  center_lng: number | null;
  is_active: boolean;
}

interface SelectedLayerData {
  state_slug: string | null;
  city_slug: string | null;
  layers_slugs: string[]; // Array of layer slugs
  state_name: string | null;
  city_name: string | null;
}

interface LayerSelectionState {
  selectedData: SelectedLayerData;
  isModalOpen: boolean;
}

type LayerSelectionAction =
  | { type: 'SET_SELECTED_STATE'; payload: State | null }
  | { type: 'SET_SELECTED_CITY'; payload: { citySlug: string; cityName: string } | null }
  | { type: 'TOGGLE_LAYER'; payload: { layerSlug: string } }
  | { type: 'CLEAR_ALL_SELECTIONS' }
  | { type: 'SET_MODAL_OPEN'; payload: boolean }
  | { type: 'LOAD_SELECTIONS_FROM_STORAGE'; payload: SelectedLayerData };

const initialState: LayerSelectionState = {
  selectedData: {
    state_slug: null,
    city_slug: null,
    layers_slugs: [],
    state_name: null,
    city_name: null,
  },
  isModalOpen: false,
};

function layerSelectionReducer(state: LayerSelectionState, action: LayerSelectionAction): LayerSelectionState {
  switch (action.type) {
    case 'SET_SELECTED_STATE':
      console.log('Reducer: SET_SELECTED_STATE', { payload: action.payload, currentState: state.selectedData });
      const newState = {
        ...state,
        selectedData: {
          ...state.selectedData,
          state_slug: action.payload?.slug || null,
          state_name: action.payload?.name || null,
          city_slug: null, // Clear city when state changes
          city_name: null, // Clear city name when state changes
          layers_slugs: [], // Clear layers when state changes
        },
      };
      console.log('Reducer: New state', newState.selectedData);
      return newState;

    case 'SET_SELECTED_CITY':
      if (action.payload) {
        return {
          ...state,
          selectedData: {
            ...state.selectedData,
            city_slug: action.payload.citySlug,
            city_name: action.payload.cityName,
            layers_slugs: [], // Clear layers when city changes
          },
        };
      }
      return {
        ...state,
        selectedData: {
          ...state.selectedData,
          city_slug: null,
          city_name: null,
          layers_slugs: [],
        },
      };

    case 'TOGGLE_LAYER':
      const { layerSlug } = action.payload;
      const currentLayers = state.selectedData.layers_slugs;
      
      if (currentLayers.includes(layerSlug)) {
        // Remove layer if already selected
        return {
          ...state,
          selectedData: {
            ...state.selectedData,
            layers_slugs: currentLayers.filter(slug => slug !== layerSlug),
          },
        };
      } else {
        // Add layer if not selected
        return {
          ...state,
          selectedData: {
            ...state.selectedData,
            layers_slugs: [...currentLayers, layerSlug],
          },
        };
      }

    case 'CLEAR_ALL_SELECTIONS':
      return {
        ...state,
        selectedData: {
          state_slug: null,
          city_slug: null,
          layers_slugs: [],
          state_name: null,
          city_name: null,
        },
      };

    case 'SET_MODAL_OPEN':
      return {
        ...state,
        isModalOpen: action.payload,
      };

    case 'LOAD_SELECTIONS_FROM_STORAGE':
      return {
        ...state,
        selectedData: action.payload,
      };

    default:
      return state;
  }
}

interface LayerSelectionContextType {
  state: LayerSelectionState;
  dispatch: React.Dispatch<LayerSelectionAction>;
  getSelectedLayersCount: () => number;
  getSelectedCitiesCount: () => number;
  hasAnySelections: () => boolean;
  isModalOpen: boolean;
}

const LayerSelectionContext = createContext<LayerSelectionContextType | undefined>(undefined);

export function LayerSelectionProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(layerSelectionReducer, initialState);

  // Load selections from localStorage on mount
  React.useEffect(() => {
    const savedSelections = localStorage.getItem('layerSelections');
    if (savedSelections) {
      try {
        const parsed = JSON.parse(savedSelections);
        dispatch({ type: 'LOAD_SELECTIONS_FROM_STORAGE', payload: parsed });
      } catch (error) {
        console.error('Error loading saved selections:', error);
      }
    }
  }, []);

  // Save selections to localStorage whenever they change
  React.useEffect(() => {
    localStorage.setItem('layerSelections', JSON.stringify(state.selectedData));
  }, [state.selectedData]);

  const getSelectedLayersCount = () => {
    return state.selectedData.layers_slugs.length;
  };

  const getSelectedCitiesCount = () => {
    return state.selectedData.city_slug ? 1 : 0;
  };

  const hasAnySelections = () => {
    return state.selectedData.state_slug !== null && state.selectedData.city_slug !== null && state.selectedData.layers_slugs.length > 0;
  };

  const value: LayerSelectionContextType = {
    state,
    dispatch,
    getSelectedLayersCount,
    getSelectedCitiesCount,
    hasAnySelections,
    isModalOpen: state.isModalOpen,
  };

  return (
    <LayerSelectionContext.Provider value={value}>
      {children}
    </LayerSelectionContext.Provider>
  );
}

export function useLayerSelection() {
  const context = useContext(LayerSelectionContext);
  if (context === undefined) {
    throw new Error('useLayerSelection must be used within a LayerSelectionProvider');
  }
  return context;
} 
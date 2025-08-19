import { useState, useEffect } from 'react';

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

interface StateData {
  state: State;
  statistics: {
    total_cities: number;
    total_layers: number;
    total_features: number;
  };
  cities: City[];
}

interface HierarchyResponse {
  status: string;
  total_states: number;
  hierarchy: StateData[];
}

export const useHierarchy = () => {
  const [data, setData] = useState<HierarchyResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHierarchy = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch('https://gis-map.1acre.in/api/hierarchy/');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result: HierarchyResponse = await response.json();
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error('Error fetching hierarchy data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHierarchy();
  }, []);

  // Helper function to get all cities with their coordinates
  const getAllCities = (): City[] => {
    if (!data) return [];
    return data.hierarchy.flatMap(stateData => stateData.cities);
  };

  // Helper function to get cities by state
  const getCitiesByState = (stateCode: string): City[] => {
    if (!data) return [];
    const stateData = data.hierarchy.find(item => item.state.code === stateCode);
    return stateData ? stateData.cities : [];
  };

  // Helper function to get state by code
  const getStateByCode = (stateCode: string): State | null => {
    if (!data) return null;
    const stateData = data.hierarchy.find(item => item.state.code === stateCode);
    return stateData ? stateData.state : null;
  };

  // Helper function to get total statistics
  const getTotalStatistics = () => {
    if (!data) return null;
    return {
      totalStates: data.total_states,
      totalCities: data.hierarchy.reduce((sum, state) => sum + state.statistics.total_cities, 0),
      totalLayers: data.hierarchy.reduce((sum, state) => sum + state.statistics.total_layers, 0),
      totalFeatures: data.hierarchy.reduce((sum, state) => sum + state.statistics.total_features, 0),
    };
  };

  return {
    data,
    loading,
    error,
    getAllCities,
    getCitiesByState,
    getStateByCode,
    getTotalStatistics,
  };
}; 
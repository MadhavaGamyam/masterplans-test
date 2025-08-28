import { useState, useEffect } from 'react';

interface Layer {
  id: number;
  name: string;
  slug: string;
  description: string;
  file_info: {
    original_filename: string;
    file_format: string;
    file_path: string;
    is_directory: boolean;
    file_pattern: string;
    source_files_count: number;
  };
  category: {
    code: string;
    name: string;
  };
  geometry_info: {
    geometry_type: string | null;
    has_valid_bbox: boolean;
    bounds: unknown;
    center_point: unknown;
  };
  processing_status: {
    is_processed: boolean;
    tiles_generated: boolean;
    feature_count: number;
    processing_errors: string;
  };
  tile_info: {
    tiles_generated: boolean;
    tile_cache_size: number;
    tile_urls: unknown;
  };
  metadata: {
    data_source: string;
    last_updated: string | null;
    created_at: string;
    updated_at: string;
  };
  statistics: {
    feature_count: number;
    file_breakdown: unknown;
  };
}

interface City {
  id: number;
  name: string;
  slug: string;
  state: {
    name: string;
    slug: string;
    code: string;
  };
  map_settings: {
    center_lat: number;
    center_lng: number;
    min_zoom: number;
    max_zoom: number;
  };
  status: {
    is_active: boolean;
    is_live: boolean;
    status: string;
  };
  statistics: {
    total_layer_groups: number;
    total_layers: number;
    layers_with_tiles: number;
    total_features: number;
    standalone_layers: number;
  };
  styling: Record<string, unknown>;
  layer_groups: unknown[];
  standalone_layers: Layer[];
  created_at: string;
}

interface State {
  id: number;
  name: string;
  slug: string;
  code: string;
  map_settings: {
    center_lat: number | null;
    center_lng: number | null;
    default_zoom: number;
  };
  status: {
    is_active: boolean;
  };
  statistics: {
    total_cities: number;
    total_layers: number;
    total_features: number;
  };
  cities: City[];
  created_at: string;
}

interface Category {
  name: string;
  description: string;
  default_color: string;
  default_stroke: string;
  default_opacity: number;
  display_order: number;
}

interface GlobalStatistics {
  total_states: number;
  total_cities: number;
  total_layers: number;
  total_features: number;
  total_categories: number;
}

interface HierarchyResponse {
  status: string;
  timestamp: string;
  global_statistics: GlobalStatistics;
  categories: Record<string, Category>;
  hierarchy: State[];
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
    return data.hierarchy.flatMap(state => state.cities);
  };

  // Helper function to get cities by state
  const getCitiesByState = (stateCode: string): City[] => {
    if (!data) return [];
    const state = data.hierarchy.find(item => item.code === stateCode);
    return state ? state.cities : [];
  };

  // Helper function to get state by code
  const getStateByCode = (stateCode: string): State | null => {
    if (!data) return null;
    const state = data.hierarchy.find(item => item.code === stateCode);
    return state || null;
  };

  // Helper function to get total statistics
  const getTotalStatistics = () => {
    if (!data) return null;
    return {
      totalStates: data.global_statistics.total_states,
      totalCities: data.global_statistics.total_cities,
      totalLayers: data.global_statistics.total_layers,
      totalFeatures: data.global_statistics.total_features,
      totalCategories: data.global_statistics.total_categories,
    };
  };

  // Helper function to get categories
  const getCategories = () => {
    if (!data) return {};
    return data.categories;
  };

  return {
    data,
    loading,
    error,
    getAllCities,
    getCitiesByState,
    getStateByCode,
    getTotalStatistics,
    getCategories,
  };
}; 
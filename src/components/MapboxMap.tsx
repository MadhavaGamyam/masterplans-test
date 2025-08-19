'use client';

import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useLayerSelection } from '../contexts/LayerSelectionContext';

// You'll need to add your Mapbox access token to your environment variables
// Create a .env.local file and add: NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=your_token_here
const MAPBOX_ACCESS_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

interface MapboxMapProps {
  center?: [number, number]; // [longitude, latitude]
  zoom?: number;
  style?: string;
  className?: string;
}

export default function MapboxMap({
  center = [78.4867, 17.3850], // Default to Hyderabad center
  zoom = 10,
  style = 'mapbox://styles/mapbox/satellite-streets-v12', // Satellite with roads and labels
  className = 'w-full h-full'
}: MapboxMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);


  const { state } = useLayerSelection();

  // Function to add layers to the map
  const addLayersToMap = () => {
    if (!map.current || !mapLoaded || !state.selectedData.state_slug || !state.selectedData.city_slug) {
      return;
    }

    console.log('Adding layers to map:', state.selectedData.layers_slugs);

    state.selectedData.layers_slugs.forEach((layerSlug) => {
      const layerId = `layer-${layerSlug}`;
      const sourceId = `source-${layerSlug}`;

      try {
        // Clean up existing layer and source
        if (map.current!.getLayer(layerId)) {
          map.current!.removeLayer(layerId);
        }
        if (map.current!.getSource(sourceId)) {
          map.current!.removeSource(sourceId);
        }

        // Add new source
        map.current!.addSource(sourceId, {
          type: "raster",
          tiles: [
            `https://gis-map.1acre.in/api/tiles/${state.selectedData.state_slug}/${state.selectedData.city_slug}/${layerSlug}/{z}/{x}/{y}.png`
          ],
          tileSize: 256,
          minzoom: 8,
          maxzoom: 18
        });

        // Add new layer
        map.current!.addLayer({
          id: layerId,
          type: 'raster',
          source: sourceId,
          paint: {
            'raster-opacity': 0.8,
            'raster-saturation': 0,
            'raster-contrast': 0.1
          }
        });

        console.log(`Added layer: ${layerId} with source: ${sourceId}`);
      } catch (error) {
        console.error(`Error adding layer ${layerSlug}:`, error);
      }
    });
  };

  // Function to remove layers that are no longer selected
  const removeUnselectedLayers = () => {
    if (!map.current || !mapLoaded) {
      return;
    }

    try {
      // Get all layers currently on the map
      const mapLayers = map.current.getStyle().layers || [];
      const mapSources = map.current.getStyle().sources || {};

      // Find custom layers (layers we added)
      const customLayerIds = mapLayers
        .filter(layer => layer.id.startsWith('layer-'))
        .map(layer => layer.id);

      // Find custom sources (sources we added)
      const customSourceIds = Object.keys(mapSources)
        .filter(sourceId => sourceId.startsWith('source-'));

      // Remove layers that are no longer in the selected layers
      customLayerIds.forEach(layerId => {
        const layerSlug = layerId.replace('layer-', '');
        if (!state.selectedData.layers_slugs.includes(layerSlug)) {
          console.log(`Removing unselected layer: ${layerId}`);
          if (map.current!.getLayer(layerId)) {
            map.current!.removeLayer(layerId);
          }
        }
      });

      // Remove sources that are no longer needed
      customSourceIds.forEach(sourceId => {
        const layerSlug = sourceId.replace('source-', '');
        if (!state.selectedData.layers_slugs.includes(layerSlug)) {
          console.log(`Removing unselected source: ${sourceId}`);
          if (map.current!.getSource(sourceId)) {
            map.current!.removeSource(sourceId);
          }
        }
      });

      console.log('Removed unselected layers and sources');
    } catch (error) {
      console.error('Error removing unselected layers:', error);
    }
  };

  // Function to remove all custom layers
  const removeAllCustomLayers = () => {
    if (!map.current || !mapLoaded) {
      return;
    }

    try {
      // Get all layers currently on the map
      const mapLayers = map.current.getStyle().layers || [];
      const mapSources = map.current.getStyle().sources || {};

      // Find custom layers and sources
      const customLayerIds = mapLayers
        .filter(layer => layer.id.startsWith('layer-'))
        .map(layer => layer.id);

      const customSourceIds = Object.keys(mapSources)
        .filter(sourceId => sourceId.startsWith('source-'));

      // Remove all custom layers
      customLayerIds.forEach(layerId => {
        if (map.current!.getLayer(layerId)) {
          map.current!.removeLayer(layerId);
        }
      });

      // Remove all custom sources
      customSourceIds.forEach(sourceId => {
        if (map.current!.getSource(sourceId)) {
          map.current!.removeSource(sourceId);
        }
      });

      console.log('Removed all custom layers and sources');
    } catch (error) {
      console.error('Error removing all layers:', error);
    }
  };

  // Effect to manage layers when selections change
  useEffect(() => {
    if (mapLoaded && map.current) {
      if (state.selectedData.layers_slugs.length > 0 && state.selectedData.state_slug && state.selectedData.city_slug) {
        // First remove unselected layers
        removeUnselectedLayers();
        // Then add new/remaining layers
        addLayersToMap();

      } else {
        // No layers selected, remove all custom layers
        removeAllCustomLayers();
      }
    }
  }, [state.selectedData, mapLoaded, removeUnselectedLayers, addLayersToMap, removeAllCustomLayers]);

  useEffect(() => {
    console.log('MapboxMap: Checking access token...');
    console.log('MAPBOX_ACCESS_TOKEN available:', !!MAPBOX_ACCESS_TOKEN);
    console.log('MAPBOX_ACCESS_TOKEN length:', MAPBOX_ACCESS_TOKEN?.length || 0);
    console.log('MAPBOX_ACCESS_TOKEN starts with pk.:', MAPBOX_ACCESS_TOKEN?.startsWith('pk.') || false);
    
    if (!MAPBOX_ACCESS_TOKEN) {
      console.error('Mapbox access token is required. Please add NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN to your environment variables.');
      return;
    }

    if (map.current) return; // Initialize map only once

    mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN;

    map.current = new mapboxgl.Map({
      container: mapContainer.current!,
      style: style,
      center: center,
      zoom: zoom,
      attributionControl: true,
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Add fullscreen control
    map.current.addControl(new mapboxgl.FullscreenControl(), 'top-right');

    // Add geolocate control
    map.current.addControl(
      new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true
        },
        trackUserLocation: true,
        showUserHeading: true
      }),
      'top-left'
    );

    map.current.on('load', () => {
      setMapLoaded(true);
      console.log('Map loaded successfully');
    });

    // Cleanup function
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [center, zoom, style]);

  // Update map when props change
  useEffect(() => {
    if (map.current && mapLoaded) {
      map.current.setCenter(center);
      map.current.setZoom(zoom);
    }
  }, [center, zoom, mapLoaded]);

  if (!MAPBOX_ACCESS_TOKEN) {
    return (
      <div className={`${className} bg-gray-100 flex items-center justify-center`}>
        <div className="text-center p-4">
          <p className="text-red-600 font-semibold">Mapbox Access Token Required</p>
          <p className="text-sm text-gray-600 mt-2">
            Please add NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN to your environment variables
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      <div ref={mapContainer} className="w-full h-full rounded-lg shadow-lg" />
    </div>
  );
} 
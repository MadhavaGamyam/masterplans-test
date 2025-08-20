'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useLayerSelection } from '../contexts/LayerSelectionContext';

// Fix for default markers in Leaflet
import L from 'leaflet';

// Extend the Layer interface to include our custom layerId
interface CustomTileLayer extends L.TileLayer {
  layerId?: string;
}

// Extend the Map interface to access internal layers
interface ExtendedMap extends L.Map {
  _layers: { [key: string]: CustomTileLayer };
}

delete (L.Icon.Default.prototype as { _getIconUrl?: string })._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
});

interface LeafletMapInnerProps {
  center?: [number, number]; // [latitude, longitude] - Note: Leaflet uses [lat, lng] order
  zoom?: number;
  className?: string;
}

// Component to handle layer management
function LayerManager() {
  const map = useMap();
  const { state } = useLayerSelection();
  const [mapLoaded, setMapLoaded] = useState(false);

  // Function to add layers to the map
  const addLayersToMap = () => {
    if (!map || !mapLoaded || !state.selectedData.state_slug || !state.selectedData.city_slug) {
      return;
    }

    console.log('Adding layers to map:', state.selectedData.layers_slugs);

    state.selectedData.layers_slugs.forEach((layerSlug) => {
      const layerId = `layer-${layerSlug}`;

      try {
        // Clean up existing layer by finding it in the map's layers
        const existingLayer = (map as ExtendedMap)._layers && 
          Object.values((map as ExtendedMap)._layers).find((layer: CustomTileLayer) => 
            layer.layerId === layerId
          );
        if (existingLayer) {
          map.removeLayer(existingLayer);
        }

        // Create new tile layer
        const tileLayer = L.tileLayer(
          `https://gis-map.1acre.in/api/tiles/${state.selectedData.state_slug}/${state.selectedData.city_slug}/${layerSlug}/{z}/{x}/{y}.png`,
          {
            tileSize: 256,
            minZoom: 8,
            maxZoom: 18,
            opacity: 0.8,
            attribution: `Layer: ${layerSlug}`
          }
        );

        // Add layer to map with custom ID
        (tileLayer as CustomTileLayer).layerId = layerId;
        tileLayer.addTo(map);

        console.log(`Added layer: ${layerId}`);
      } catch (error) {
        console.error(`Error adding layer ${layerSlug}:`, error);
      }
    });
  };

  // Function to remove layers that are no longer selected
  const removeUnselectedLayers = () => {
    if (!map || !mapLoaded) {
      return;
    }

    try {
      // Get all layers currently on the map using internal _layers property
      const mapLayers = (map as ExtendedMap)._layers ? Object.values((map as ExtendedMap)._layers) : [];

      // Find custom layers (layers we added)
      const customLayers = mapLayers.filter((layer: CustomTileLayer) => 
        layer.layerId && layer.layerId.startsWith('layer-')
      );

      // Remove layers that are no longer in the selected layers
      customLayers.forEach((layer: CustomTileLayer) => {
        const layerSlug = layer.layerId!.replace('layer-', '');
        if (!state.selectedData.layers_slugs.includes(layerSlug)) {
          console.log(`Removing unselected layer: ${layer.layerId}`);
          map.removeLayer(layer);
        }
      });

      console.log('Removed unselected layers');
    } catch (error) {
      console.error('Error removing unselected layers:', error);
    }
  };

  // Function to remove all custom layers
  const removeAllCustomLayers = () => {
    if (!map || !mapLoaded) {
      return;
    }

    try {
      // Get all layers currently on the map using internal _layers property
      const mapLayers = (map as ExtendedMap)._layers ? Object.values((map as ExtendedMap)._layers) : [];

      // Find custom layers and remove them
      const customLayers = mapLayers.filter((layer: CustomTileLayer) => 
        layer.layerId && layer.layerId.startsWith('layer-')
      );

      customLayers.forEach((layer: CustomTileLayer) => {
        map.removeLayer(layer);
      });

      console.log('Removed all custom layers');
    } catch (error) {
      console.error('Error removing all layers:', error);
    }
  };

  // Effect to manage layers when selections change
  useEffect(() => {
    if (mapLoaded && map) {
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
  }, [state.selectedData, mapLoaded]);

  // Set map as loaded when it's ready
  useEffect(() => {
    if (map && !mapLoaded) {
      setMapLoaded(true);
      console.log('Leaflet map loaded successfully');
    }
  }, [map, mapLoaded]);

  return null; // This component doesn't render anything
}

export default function LeafletMapInner({
  center = [17.3850, 78.4867], // Default to Hyderabad center - Note: [lat, lng] order for Leaflet
  zoom = 10,
  className = 'w-full h-full'
}: LeafletMapInnerProps) {
  return (
    <div className={className}>
      <MapContainer
        key={`${center[0]}-${center[1]}-${zoom}`}
        center={center}
        zoom={zoom}
        className="w-full h-full rounded-lg shadow-lg"
        attributionControl={true}
        zoomControl={true}
        scrollWheelZoom={true}
        doubleClickZoom={true}
        boxZoom={true}
        keyboard={true}
        dragging={true}
        touchZoom={true}
      >
        {/* Base tile layer */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* Custom layer manager */}
        <LayerManager />
      </MapContainer>
    </div>
  );
} 
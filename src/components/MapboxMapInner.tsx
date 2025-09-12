'use client';

import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useLayerSelection } from '../contexts/LayerSelectionContext';

const CITY_BOUNDS: Record<string, { center: [number, number]; zoom: number }> = {
  'amaravati': { center: [16.5062, 80.648], zoom: 11 },
  'tirupati': { center: [13.6288, 79.4192], zoom: 11 },
  'vijaywada___guntur___tenali___mangalagiri': { center: [20.5937, 78.9629], zoom: 11 },
  'kakinada': { center: [16.9891, 82.2475], zoom: 11 },
  'vizag': { center: [17.6868, 83.2185], zoom: 11 },
  'visakhapatnam': { center: [17.6868, 83.2185], zoom: 11 },
  'delhi': { center: [28.6139, 77.209], zoom: 11 },
  'gurgaon': { center: [28.4595, 77.0266], zoom: 11 },
  'noida': { center: [28.5355, 77.391], zoom: 11 },
  'yeida': { center: [28.4844, 77.5662], zoom: 11 },
  'faridabad': { center: [28.4089, 77.3178], zoom: 11 },
  'gr._noida': { center: [20.5937, 78.9629], zoom: 11 },
  'ghaziabad': { center: [28.6692, 77.4538], zoom: 11 },
  'sonipat': { center: [28.9931, 77.0151], zoom: 11 },
  'kharkhauda': { center: [28.8818, 76.9066], zoom: 11 },
  'bahadurgarh': { center: [28.6928, 76.9378], zoom: 11 },
  'sampla': { center: [28.7584, 76.7778], zoom: 11 },
  'badli': { center: [28.725, 77.0833], zoom: 11 },
  'badsa': { center: [28.0167, 76.8833], zoom: 11 },
  'farukhnagar': { center: [28.4333, 76.8167], zoom: 11 },
  'pataudi': { center: [28.3256, 76.7878], zoom: 11 },
  'dharuhera': { center: [28.2042, 76.7953], zoom: 11 },
  'gwal_pahari': { center: [28.4457, 77.1367], zoom: 11 },
  'sohna': { center: [28.275, 77.0667], zoom: 11 },
  'pirthala': { center: [28.8833, 76.6167], zoom: 11 },
  'palwal': { center: [28.1441, 77.3263], zoom: 11 },
  'loni': { center: [28.7485, 77.2849], zoom: 11 },
  'bhagpat___baraut___khekra': { center: [20.5937, 78.9629], zoom: 11 },
  'modinagar': { center: [28.9167, 77.5833], zoom: 11 },
  'bhiwadi': { center: [28.2099, 76.86], zoom: 11 },
  'ahmedabad___gandhinagar': { center: [20.5937, 78.9629], zoom: 11 },
  'bmrda': { center: [12.8406, 77.6602], zoom: 11 },
  'bengaluru': { center: [12.9716, 77.5946], zoom: 11 },
  'kochi': { center: [9.9312, 76.2673], zoom: 11 },
  'bhopal': { center: [23.2599, 77.4126], zoom: 11 },
  'indore': { center: [22.7196, 75.8577], zoom: 11 },
  'pithampur': { center: [22.6022, 75.6854], zoom: 11 },
  'mumbai': { center: [19.076, 72.8777], zoom: 11 },
  'bhubaneshwar': { center: [20.2961, 85.8245], zoom: 11 },
  'chandigarh': { center: [30.7333, 76.7794], zoom: 11 },
  'jaipur': { center: [26.9124, 75.7873], zoom: 11 },
  'jodhpur': { center: [26.2389, 73.0243], zoom: 11 },
  'ajmer': { center: [26.4499, 74.6399], zoom: 11 },
  'udaipur': { center: [24.5854, 73.7125], zoom: 11 },
  'chennai': { center: [13.0827, 80.2707], zoom: 11 },
  'hosur': { center: [12.7409, 77.8253], zoom: 11 },
  'coimbatore': { center: [11.0168, 76.9558], zoom: 11 },
  'hyderabad': { center: [17.385044, 78.486671], zoom: 11 },
  'warangal': { center: [17.9784, 79.6], zoom: 11 },
};

interface MapboxMapInnerProps {
  center?: [number, number];
  zoom?: number;
  className?: string;
}

export default function MapboxMapInner({
  center = [17.3850, 78.4867],
  zoom = 10,
  className = 'w-full h-full'
}: MapboxMapInnerProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const { state } = useLayerSelection();

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || '';

    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: 'mapbox://styles/mapbox/satellite-streets-v12',
      center: [center[1], center[0]],
      zoom,
      attributionControl: true,
      dragRotate: false,
      touchPitch: false
    });

    map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), 'top-right');

    map.on('load', () => {
      setMapLoaded(true);
    });

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [center, zoom]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapLoaded) return;

    const flyToCity = () => {
      if (!state.selectedData.city_slug) return;
      const city = CITY_BOUNDS[state.selectedData.city_slug];
      if (!city) return;
      map.flyTo({ center: [city.center[1], city.center[0]], zoom: city.zoom, duration: 1.5 });
    };

    const ensureRasterSourceAndLayer = (layerSlug: string) => {
      const id = `layer-${layerSlug}`;
      const sourceId = `${id}-src`;
      const existing = map.getLayer(id);
      if (existing) return; // already added
      map.addSource(sourceId, {
        type: 'raster',
        tiles: [
          `https://gis-map.1acre.in/api/tiles/${state.selectedData.state_slug}/${state.selectedData.city_slug}/${layerSlug}/{z}/{x}/{y}.png`
        ],
        tileSize: 256,
        minzoom: 8,
        maxzoom: 18
      });
      map.addLayer({
        id,
        type: 'raster',
        source: sourceId,
        paint: { 'raster-opacity': 0.8 },
      });
    };

    const removeUnselected = () => {
      const allLayers = map.getStyle().layers || [];
      const toRemove = allLayers
        .filter(l => l.id.startsWith('layer-'))
        .map(l => l.id)
        .filter(id => !state.selectedData.layers_slugs.includes(id.replace('layer-','')));

      toRemove.forEach(id => {
        const sourceId = `${id}-src`;
        if (map.getLayer(id)) map.removeLayer(id);
        if (map.getSource(sourceId)) map.removeSource(sourceId);
      });
    };

    if (state.selectedData.layers_slugs.length > 0 && state.selectedData.state_slug && state.selectedData.city_slug) {
      removeUnselected();
      state.selectedData.layers_slugs.forEach((slug) => ensureRasterSourceAndLayer(slug));
      flyToCity();
    } else {
      // remove all our custom
      const allLayers = map.getStyle().layers || [];
      allLayers.forEach(l => {
        if (l.id.startsWith('layer-')) {
          const sourceId = `${l.id}-src`;
          if (map.getLayer(l.id)) map.removeLayer(l.id);
          if (map.getSource(sourceId)) map.removeSource(sourceId);
        }
      });
    }
  }, [state.selectedData, mapLoaded]);

  return (
    <div className={className}>
      <div ref={containerRef} className="w-full h-full rounded-lg shadow-lg" />
    </div>
  );
} 
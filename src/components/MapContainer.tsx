'use client';

import { useHierarchy } from '../hooks/useHierarchy';
import MapboxMap from './MapboxMap';
import HierarchyDataDisplay from './HierarchyDataDisplay';
import LayerSelectionModal from './LayerSelectionModal';
import LayerSelectionButton from './LayerSelectionButton';
import LayerStatusIndicator from './LayerStatusIndicator';
import SelectedDataDebug from './SelectedDataDebug';

interface MapContainerProps {
  center?: [number, number];
  zoom?: number;
  className?: string;
}

// This is now a client component to use the hook
export default function MapContainer({
  center = [78.4867, 17.3850], // Hyderabad center
  zoom = 10,
  className = 'w-full h-screen'
}: MapContainerProps) {
  const { data, loading, error } = useHierarchy();

  return (
    <div className="w-full h-full">
      {/* Header */}
      {/* <div className="mb-6 p-6 bg-white shadow-sm border-b">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">India GIS Hierarchy Map</h1>
        <p className="text-gray-600">
          Interactive satellite map with roads and labels, displaying hierarchy data from the GIS API
        </p>
        {loading && (
          <div className="mt-3 flex items-center text-blue-600">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
            Loading hierarchy data...
          </div>
        )}
        {error && (
          <div className="mt-3 text-red-600">
            Error loading data: {error}
          </div>
        )} */}
      {/* </div> */}

      {/* Data Display */}
      {/* <div className="mb-6">
        <HierarchyDataDisplay />
      </div> */}
      
      {/* Map - Full Screen */}
      <MapboxMap
        center={center}
        zoom={zoom}
        className={className}
      />

      {/* Layer Selection Button */}
      <LayerSelectionButton />

      {/* Layer Status Indicator */}
      {/* <LayerStatusIndicator /> */}

      {/* Selected Data Debug */}
      {/* <SelectedDataDebug /> */}

      {/* Layer Selection Modal */}
      <LayerSelectionModal />
    </div>
  );
} 
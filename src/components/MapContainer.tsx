'use client';

import LeafletMap from './LeafletMap';
import LayerSelectionModal from './LayerSelectionModal';
import LayerSelectionButton from './LayerSelectionButton';

interface MapContainerProps {
  center?: [number, number];
  zoom?: number;
  className?: string;
}

// This is now a client component to use the hook
export default function MapContainer({
  center = [17.3850, 78.4867], // Hyderabad center - [lat, lng] for Leaflet
  zoom = 10,
  className = 'w-full h-screen'
}: MapContainerProps) {
  return (
    <div className="relative w-full h-full">
      {/* Map - Full Screen */}
      <LeafletMap
        center={center}
        zoom={zoom}
        className={className}
      />

      {/* Layer Selection Button */}
      <LayerSelectionButton />

      {/* Layer Selection Modal */}
      <LayerSelectionModal />
    </div>
  );
} 
'use client';

import dynamic from 'next/dynamic';

interface LeafletMapProps {
  center?: [number, number]; // [latitude, longitude] - Note: Leaflet uses [lat, lng] order
  zoom?: number;
  className?: string;
}

// Dynamically import the entire LeafletMap component to avoid SSR issues
const LeafletMapComponent = dynamic(() => import('./LeafletMapInner'), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-gray-100 flex items-center justify-center">Loading map...</div>
});

export default function LeafletMap(props: LeafletMapProps) {
  return <LeafletMapComponent {...props} />;
} 
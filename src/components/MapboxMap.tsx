'use client';

import dynamic from 'next/dynamic';

interface MapboxMapProps {
	center?: [number, number];
	zoom?: number;
	className?: string;
}

const MapboxMapComponent = dynamic<MapboxMapProps>(() => import('./MapboxMapInner'), {
	ssr: false,
	loading: () => <div className="w-full h-full bg-gray-100 flex items-center justify-center">Loading map...</div>
});

export default function MapboxMap(props: MapboxMapProps) {
	return <MapboxMapComponent {...props} />;
} 
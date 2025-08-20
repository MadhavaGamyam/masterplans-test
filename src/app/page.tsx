import MapContainer from '../components/MapContainer';

export default function Home() {
  return (
    <div className="h-screen w-screen overflow-hidden">
      <MapContainer 
        center={[17.3850, 78.4867]} // Hyderabad center coordinates [lat, lng] for Leaflet
        zoom={10}
        className="w-full h-full"
      />
    </div>
  );
}

import MapContainer from '../components/MapContainer';

export default function Home() {
  return (
    <div className="h-screen w-screen overflow-hidden">
      <MapContainer 
        center={[78.4867, 17.3850]} // Hyderabad center coordinates
        zoom={10}
        className="w-full h-full"
      />
    </div>
  );
}

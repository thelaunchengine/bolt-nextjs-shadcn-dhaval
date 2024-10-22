'use client'

import { useState, useEffect } from 'react';
import { useLeaflet } from '@/hooks/useLeaflet';

const bounds: [number, number][] = [
  [0, -82.381725616],
  [84.92212, 92.779928270]
];

const MapComponent = ({ onCoordinatesSelected }: { onCoordinatesSelected: (lat: number, lng: number) => void }) => {
  const { L, ReactLeaflet } = useLeaflet();
  const [clickedPoint, setClickedPoint] = useState<[number, number] | null>(null);

  useEffect(() => {
    if (!L || !ReactLeaflet) return;

    // Set up the default icon
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    });

    const { MapContainer, TileLayer, Rectangle, Marker, Popup, useMap, useMapEvents } = ReactLeaflet;

    const MapContent = () => {
      const map = useMap();
      
      useEffect(() => {
        map.fitBounds(bounds);
      }, [map]);

      useMapEvents({
        click: (e) => {
          const { lat, lng } = e.latlng;
          if (L.latLngBounds(bounds).contains(e.latlng)) {
            setClickedPoint([lat, lng]);
            onCoordinatesSelected(lat, lng);
          }
        },
      });

      return (
        <>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <Rectangle bounds={bounds} pathOptions={{ color: 'blue', weight: 1, fillOpacity: 0.1 }} />
          {clickedPoint && (
            <Marker position={clickedPoint}>
              <Popup>
                Clicked at: <br />
                Lat: {clickedPoint[0].toFixed(6)}, <br />
                Lng: {clickedPoint[1].toFixed(6)}
              </Popup>
            </Marker>
          )}
        </>
      );
    };

    const MapWithContent = () => (
      <MapContainer
        center={[42.46106, 5.199101327]}
        zoom={3}
        style={{ height: '600px', width: '100%', maxWidth: '1308px' }}
        scrollWheelZoom={false}
      >
        <MapContent />
      </MapContainer>
    );

    setMapComponent(() => MapWithContent);
  }, [L, ReactLeaflet, clickedPoint, onCoordinatesSelected]);

  const [MapComponent, setMapComponent] = useState<React.ComponentType | null>(null);

  if (!MapComponent) {
    return <div>Loading map...</div>;
  }

  return (
    <div className="w-full max-w-[1308px] overflow-x-auto">
      <MapComponent />
    </div>
  );
};

export default MapComponent;
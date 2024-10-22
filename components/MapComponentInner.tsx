'use client'

import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Rectangle, Marker, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const bounds: L.LatLngBoundsExpression = [
  [0, -82.381725616],
  [84.92212, 92.779928270]
];

const MapEvents = ({ onMapClick }: { onMapClick: (latlng: L.LatLng) => void }) => {
  useMapEvents({
    click: (e) => {
      onMapClick(e.latlng);
    },
  });
  return null;
};

const MapContent = ({ onCoordinatesSelected }: { onCoordinatesSelected: (lat: number, lng: number) => void }) => {
  const [clickedPoint, setClickedPoint] = useState<L.LatLng | null>(null);
  const map = useMap();

  useEffect(() => {
    if (map) {
      map.fitBounds(bounds);
    }
  }, [map]);

  const handleMapClick = (latlng: L.LatLng) => {
    if (L.latLngBounds(bounds).contains(latlng)) {
      setClickedPoint(latlng);
      onCoordinatesSelected(latlng.lat, latlng.lng);
    }
  };

  return (
    <>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <Rectangle bounds={bounds} pathOptions={{ color: 'blue', weight: 1, fillOpacity: 0.1 }} />
      {clickedPoint && (
        <Marker position={clickedPoint}>
          <L.Popup>
            Clicked at: <br />
            Lat: {clickedPoint.lat.toFixed(6)}, <br />
            Lng: {clickedPoint.lng.toFixed(6)}
          </L.Popup>
        </Marker>
      )}
      <MapEvents onMapClick={handleMapClick} />
    </>
  );
};

const MapComponentInner = ({ onCoordinatesSelected }: { onCoordinatesSelected: (lat: number, lng: number) => void }) => {
  const [mapReady, setMapReady] = useState(false);

  useEffect(() => {
    setMapReady(true);
  }, []);

  if (!mapReady) {
    return <div>Loading map...</div>;
  }

  return (
    <div className="w-full max-w-[1308px] overflow-x-auto">
      <MapContainer
        center={[42.46106, 5.199101327]}
        zoom={3}
        style={{ height: '600px', width: '100%', maxWidth: '1308px' }}
        scrollWheelZoom={false}
      >
        <MapContent onCoordinatesSelected={onCoordinatesSelected} />
      </MapContainer>
    </div>
  );
};

export default MapComponentInner;
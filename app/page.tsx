'use client'

import { useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import dynamic from 'next/dynamic';
import WhaleOccurrenceMap from '@/components/WhaleOccurrenceMap';

const MapComponent = dynamic(() => import('@/components/MapComponent'), {
  ssr: false,
  loading: () => <p>Loading map...</p>
});

function ErrorFallback({error}: {error: Error}) {
  return (
    <div role="alert" className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
      <p className="font-bold">Something went wrong:</p>
      <pre className="mt-2 text-sm">{error.message}</pre>
    </div>
  )
}

export default function Home() {
  const [selectedCoordinates, setSelectedCoordinates] = useState<{ latitude: number; longitude: number } | null>(null);

  const handleCoordinatesSelected = (lat: number, lng: number) => {
    setSelectedCoordinates({ latitude: lat, longitude: lng });
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-4">
      <h1 className="text-4xl font-bold mb-8">Whale Occurence Map</h1>
      <MapComponent onCoordinatesSelected={handleCoordinatesSelected} />
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        {selectedCoordinates && (
          <WhaleOccurrenceMap
            latitude={selectedCoordinates.latitude}
            longitude={selectedCoordinates.longitude}
          />
        )}
      </ErrorBoundary>
    </main>
  );
}
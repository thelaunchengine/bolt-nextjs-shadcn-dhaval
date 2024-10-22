import { useState, useEffect } from 'react';

export const useLeaflet = () => {
  const [L, setL] = useState<typeof import('leaflet') | null>(null);
  const [ReactLeaflet, setReactLeaflet] = useState<typeof import('react-leaflet') | null>(null);

  useEffect(() => {
    const loadLeaflet = async () => {
      const L = await import('leaflet');
      const ReactLeaflet = await import('react-leaflet');
      setL(L);
      setReactLeaflet(ReactLeaflet);
    };

    loadLeaflet();
  }, []);

  return { L, ReactLeaflet };
};
'use client'

import { useState, useEffect, useRef } from 'react';

const width = 1308;
const height = 1334;
const baseLongitude = -82.381725616;
const endLongitude = 92.779928270;
const mapWidthDegrees = endLongitude - baseLongitude;

const imageUrl = "https://ik.imagekit.io/w3joxx5pvz/WhaleOccurrence.png";

function getXYfromLatLon(lat: number, lon: number, baseLongitude: number, mapWidthDegrees: number, mapWidthPixels: number, mapHeightPixels: number) {
  const longitudeFactor = mapWidthDegrees / mapWidthPixels;
  const mapWidthRad = (mapWidthDegrees * Math.PI) / 180;

  const X = 1 + (lon - baseLongitude) / longitudeFactor;
  const latRad = (lat * Math.PI) / 180;

  const yFromEquator = Math.log(Math.tan(Math.PI / 4 + latRad / 2));

  let Y;
  if (yFromEquator >= 0) {
    Y = mapHeightPixels - (mapWidthPixels * yFromEquator) / mapWidthRad;
  } else {
    Y = mapHeightPixels + (mapWidthPixels * yFromEquator) / mapWidthRad;
  }
  return { X, Y };
}

const WhaleOccurrenceMap = ({ latitude, longitude }: { latitude: number | undefined; longitude: number | undefined }) => {
  const [pixelCoordinates, setPixelCoordinates] = useState<{ X: number; Y: number } | null>(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);
  const [riskIndex, setRiskIndex] = useState<number | null>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (latitude !== undefined && longitude !== undefined) {
      const coords = getXYfromLatLon(latitude, longitude, baseLongitude, mapWidthDegrees, width, height);
      setPixelCoordinates(coords);
    }
  }, [latitude, longitude]);

  useEffect(() => {
    if (imageLoaded && pixelCoordinates && canvasRef.current && imgRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        ctx.drawImage(imgRef.current, 0, 0, width, height);
        const imageData = ctx.getImageData(Math.round(pixelCoordinates.X), Math.round(pixelCoordinates.Y), 1, 1);
        const grayValue = imageData.data[0]; // Since it's grayscale, we can use any of R, G, or B
        setRiskIndex(1 - grayValue / 255); // Invert the value so that darker colors have higher risk
      }
    }
  }, [imageLoaded, pixelCoordinates]);

  useEffect(() => {
    if (pixelCoordinates && containerRef.current) {
      containerRef.current.scrollTo({
        left: pixelCoordinates.X - containerRef.current.clientWidth / 2,
        top: pixelCoordinates.Y - containerRef.current.clientHeight / 2,
        behavior: 'smooth'
      });
    }
  }, [pixelCoordinates]);

  if (imageError) {
    return <div className="text-red-500">{imageError}</div>;
  }

  return (
    <div className="w-full max-w-[1308px] mt-8">
      <h2 className="text-2xl font-bold mb-4">Whale Occurrence Map</h2>
      <div 
        ref={containerRef}
        className="relative overflow-auto"
        style={{ width: '100%', height: '600px', maxWidth: '100vw', maxHeight: '80vh' }}
      >
        {!imageLoaded && <div className="absolute inset-0 flex items-center justify-center">Loading image...</div>}
        <div className="relative" style={{ width: `${width}px`, height: `${height}px` }}>
          <img
            ref={imgRef}
            src={imageUrl}
            alt="Whale Occurrence Map"
            width={width}
            height={height}
            onError={(e) => {
              console.error('Error loading image:', e);
              setImageError(`Failed to load the image. Please check if the image URL is correct and accessible.`);
            }}
            onLoad={() => {
              console.log('Image loaded successfully');
              setImageLoaded(true);
            }}
            crossOrigin="anonymous"
          />
          <canvas
            ref={canvasRef}
            width={width}
            height={height}
            style={{ display: 'none' }}
          />
          {pixelCoordinates && (
            <div
              className="absolute w-4 h-4 bg-yellow-500 rounded-full animate-slow-blink"
              style={{
                left: `${pixelCoordinates.X}px`,
                top: `${pixelCoordinates.Y}px`,
                transform: 'translate(-50%, -50%)',
              }}
            />
          )}
        </div>
      </div>
      {pixelCoordinates && (
        <div className="mt-4 p-4 bg-white rounded shadow">
          <h2 className="text-xl font-semibold mb-2">Selected Location:</h2>
          <p>Latitude: {latitude?.toFixed(6)}</p>
          <p>Longitude: {longitude?.toFixed(6)}</p>
          <p>X: {pixelCoordinates.X.toFixed(2)}</p>
          <p>Y: {pixelCoordinates.Y.toFixed(2)}</p>
          {riskIndex !== null && (
            <p className="mt-2">
              <strong>Risk Index:</strong> {riskIndex.toFixed(4)}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default WhaleOccurrenceMap;
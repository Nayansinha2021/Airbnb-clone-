"use client";

import React, { useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";

interface MarkerItem {
  id: number;
  title: string;
  price?: number;
  lat: number;
  lng: number;
}

interface RealMapProps {
  center?: [number, number];
  zoom?: number;
  markers?: MarkerItem[];
  className?: string;
}

export default function RealMap({
  center = [20.5937, 78.9629], // Default center (India)
  zoom = 4,
  markers = [],
  className = "w-full h-full rounded-2xl"
}: RealMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !mapContainerRef.current) return;

    let L: any;
    async function initMap() {
      L = (await import("leaflet")).default;

      // Fix icon issues
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
        iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
        shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
      });

      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
      }

      const map = L.map(mapContainerRef.current, {
        center: center,
        zoom: zoom,
        zoomControl: false, // We'll render Airbnb custom + / - buttons
      });

      // OpenStreetMap vector tiles
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map);

      // Render custom price markers
      markers.forEach((m) => {
        if (!m.lat || !m.lng) return;

        if (m.price) {
          const priceIcon = L.divIcon({
            className: "custom-price-marker",
            html: `<div class="bg-white border border-gray-300 text-gray-900 font-bold text-xs px-2.5 py-1 rounded-full shadow-md hover:bg-black hover:text-white hover:scale-110 transition-all cursor-pointer">₹${m.price}</div>`,
            iconSize: [60, 24],
            iconAnchor: [30, 12],
          });
          L.marker([m.lat, m.lng], { icon: priceIcon })
            .addTo(map)
            .bindPopup(`<div class="p-1 font-sans"><strong class="text-xs font-bold block mb-1">${m.title}</strong><span class="text-xs text-rose-600 font-semibold">₹${m.price} / night</span></div>`);
        } else {
          // Default house pin
          const houseIcon = L.divIcon({
            className: "custom-house-pin",
            html: `<div class="w-10 h-10 bg-rose-600 text-white rounded-full flex items-center justify-center shadow-lg border-2 border-white transform hover:scale-110 transition-transform"><svg width="18" height="18" viewBox="0 0 32 32" fill="white"><path d="M16 2L2 14h4v16h8V20h4v10h8V14h4L16 2z"/></svg></div>`,
            iconSize: [40, 40],
            iconAnchor: [20, 20],
          });
          L.marker([m.lat, m.lng], { icon: houseIcon })
            .addTo(map)
            .bindPopup(`<strong class="text-xs font-bold">${m.title}</strong>`);
        }
      });

      mapInstanceRef.current = map;
    }

    initMap();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [center, zoom, markers]);

  const handleZoomIn = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.zoomIn();
    }
  };

  const handleZoomOut = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.zoomOut();
    }
  };

  return (
    <div className="relative w-full h-full min-h-[400px]">
      <div ref={mapContainerRef} className={className} />

      {/* Floating Zoom Controls (+ / -) matching Airbnb style in Image 2 */}
      <div className="absolute top-4 right-4 z-[400] flex flex-col bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden text-gray-800 font-bold text-lg">
        <button 
          onClick={handleZoomIn}
          className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 border-b border-gray-200 transition-colors"
          title="Zoom in"
        >
          +
        </button>
        <button 
          onClick={handleZoomOut}
          className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 transition-colors"
          title="Zoom out"
        >
          −
        </button>
      </div>
    </div>
  );
}

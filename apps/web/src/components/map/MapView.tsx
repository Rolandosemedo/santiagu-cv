"use client";

import { useEffect, useRef } from "react";
import type { Place } from "@/lib/types";
import { CATEGORIES } from "@/lib/types";

const SANTIAGO_CENTER: [number, number] = [15.07, -23.62];
const DEFAULT_ZOOM = 10;

interface MapViewProps {
  places: Place[];
  onPlaceSelect?: (place: Place) => void;
}

export function MapView({ places, onPlaceSelect }: MapViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<unknown>(null);
  const markersRef = useRef<unknown[]>([]);

  useEffect(() => {
    if (typeof window === "undefined" || !containerRef.current || mapRef.current) return;

    // Dynamic import to avoid SSR issues with Leaflet
    import("leaflet").then((L) => {
      // Fix default icon paths (Leaflet + bundlers issue)
      const icon = L.icon({
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
      });
      L.Marker.prototype.options.icon = icon;

      const map = L.map(containerRef.current!, {
        center: SANTIAGO_CENTER,
        zoom: DEFAULT_ZOOM,
        zoomControl: false,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map);

      L.control.zoom({ position: "bottomright" }).addTo(map);

      mapRef.current = map;

      // Add markers
      places.forEach((place) => {
        const category = CATEGORIES.find((c) => c.slug === place.category_slug);
        const color = category?.color ?? "#0B5E8A";
        const emoji = category?.emoji ?? "📍";

        const pinEl = L.divIcon({
          className: "",
          html: `<div style="
            background:${color};border:2px solid white;
            border-radius:50% 50% 50% 0;transform:rotate(-45deg);
            width:36px;height:36px;display:flex;align-items:center;justify-content:center;
            box-shadow:0 4px 12px rgba(0,0,0,0.25);cursor:pointer;">
            <span style="transform:rotate(45deg);font-size:16px">${emoji}</span>
          </div>`,
          iconSize: [36, 36],
          iconAnchor: [18, 36],
          popupAnchor: [0, -38],
        });

        const marker = L.marker([place.lat, place.lng], { icon: pinEl })
          .addTo(map)
          .bindPopup(`
            <div style="font-family:sans-serif;min-width:180px">
              <img src="${place.cover_url}" alt="${place.name}"
                style="width:100%;height:80px;object-fit:cover;border-radius:10px;margin-bottom:8px"/>
              <div style="font-size:11px;color:${color};font-weight:600;margin-bottom:2px">${emoji} ${category?.label}</div>
              <div style="font-weight:700;font-size:14px;color:#0B2E4A;margin-bottom:4px">${place.name}</div>
              <div style="font-size:12px;color:#6B7280">⭐ ${place.rating} (${place.review_count} avaliações)</div>
            </div>
          `, { maxWidth: 220 });

        marker.on("click", () => onPlaceSelect?.(place));
        markersRef.current.push(marker);
      });
    });

    return () => {
      if (mapRef.current) {
        (mapRef.current as { remove: () => void }).remove();
        mapRef.current = null;
        markersRef.current = [];
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="relative w-full h-full rounded-3xl overflow-hidden shadow-card">
      {/* Leaflet CSS */}
      <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
      />
      <div ref={containerRef} className="w-full h-full" />
    </div>
  );
}

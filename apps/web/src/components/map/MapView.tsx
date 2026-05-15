"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import mapboxgl from "mapbox-gl";
import type { Place } from "@/lib/types";
import { CATEGORIES } from "@/lib/types";

// Santiago island center
const SANTIAGO_CENTER: [number, number] = [-23.62, 15.07];
const DEFAULT_ZOOM = 9.5;

interface MapViewProps {
  places: Place[];
  onPlaceSelect?: (place: Place) => void;
}

export function MapView({ places, onPlaceSelect }: MapViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const [ready, setReady] = useState(false);

  // Init map
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    mapboxgl.accessToken =
      process.env.NEXT_PUBLIC_MAPBOX_TOKEN ?? "pk.PLACEHOLDER";

    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: "mapbox://styles/mapbox/outdoors-v12",
      center: SANTIAGO_CENTER,
      zoom: DEFAULT_ZOOM,
      attributionControl: false,
    });

    map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), "bottom-right");
    map.addControl(new mapboxgl.AttributionControl({ compact: true }), "bottom-left");
    map.addControl(new mapboxgl.GeolocateControl({ positionOptions: { enableHighAccuracy: true } }), "bottom-right");

    map.on("load", () => {
      mapRef.current = map;
      setReady(true);
    });

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Add markers when places change
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !ready) return;

    // Clear existing markers
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    places.forEach((place) => {
      const category = CATEGORIES.find((c) => c.slug === place.category_slug);
      const color = category?.color ?? "#0B5E8A";
      const emoji = category?.emoji ?? "📍";

      // Custom HTML marker
      const el = document.createElement("div");
      el.className = "map-pin";
      el.innerHTML = `
        <div style="
          background: ${color};
          border: 2px solid white;
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          width: 36px; height: 36px;
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 4px 12px rgba(0,0,0,0.25);
          cursor: pointer;
          transition: transform 0.2s ease;
        ">
          <span style="transform: rotate(45deg); font-size: 16px;">${emoji}</span>
        </div>
      `;

      el.addEventListener("mouseenter", () => {
        el.querySelector("div")!.style.transform = "rotate(-45deg) scale(1.15)";
      });
      el.addEventListener("mouseleave", () => {
        el.querySelector("div")!.style.transform = "rotate(-45deg) scale(1)";
      });

      // Popup
      const popup = new mapboxgl.Popup({
        offset: 25,
        closeButton: false,
        className: "santiagu-popup",
        maxWidth: "220px",
      }).setHTML(`
        <div style="padding: 12px; font-family: sans-serif;">
          <img src="${place.cover_url}" alt="${place.name}" style="width: 100%; height: 80px; object-fit: cover; border-radius: 10px; margin-bottom: 8px;" />
          <div style="font-size: 11px; color: ${color}; font-weight: 600; margin-bottom: 2px;">${emoji} ${category?.label}</div>
          <div style="font-weight: 700; font-size: 14px; color: #0B2E4A; margin-bottom: 4px;">${place.name}</div>
          <div style="font-size: 12px; color: #6B7280;">⭐ ${place.rating} (${place.review_count} avaliações)</div>
        </div>
      `);

      const marker = new mapboxgl.Marker(el)
        .setLngLat([place.lng, place.lat])
        .setPopup(popup)
        .addTo(map);

      el.addEventListener("click", () => {
        onPlaceSelect?.(place);
      });

      markersRef.current.push(marker);
    });
  }, [places, ready, onPlaceSelect]);

  return (
    <div className="relative w-full h-full rounded-3xl overflow-hidden shadow-card">
      <div ref={containerRef} className="w-full h-full" />
      {!ready && (
        <div className="absolute inset-0 bg-sand-light flex items-center justify-center">
          <div className="text-center">
            <div className="text-4xl mb-3 animate-bounce">🗺️</div>
            <p className="text-sm font-body text-muted">A carregar o mapa…</p>
          </div>
        </div>
      )}
    </div>
  );
}

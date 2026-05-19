"use client";
import { useRef, useEffect, useState } from "react";
import type { Place } from "@/lib/types";
import { CATEGORIES } from "@/lib/types";
const SANTIAGO_CENTER: [number, number] = [15.07, -23.62];
function loadLeaflet(): Promise<void> {
  return new Promise((resolve) => {
    if (!document.getElementById("leaflet-css")) {
      const link = document.createElement("link");
      link.id = "leaflet-css"; link.rel = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      document.head.appendChild(link);
    }
    if ((window as any).L) { resolve(); return; }
    const ex = document.getElementById("leaflet-js");
    if (ex) { ex.addEventListener("load", () => resolve()); return; }
    const s = document.createElement("script");
    s.id = "leaflet-js"; s.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
    s.async = true; s.onload = () => resolve();
    document.head.appendChild(s);
  });
}
interface MapViewProps { places: Place[]; onPlaceSelect?: (place: Place) => void; }
export function MapView({ places, onPlaceSelect }: MapViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    let destroyed = false;
    loadLeaflet().then(() => {
      if (destroyed || !containerRef.current) return;
      const L = (window as any).L;
      if (mapRef.current) { mapRef.current.remove(); mapRef.current = null; }
      const c = containerRef.current as any;
      if (c._leaflet_id) c._leaflet_id = null;
      const map = L.map(containerRef.current, { center: SANTIAGO_CENTER, zoom: 10, zoomControl: false });
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>', maxZoom: 19,
      }).addTo(map);
      L.control.zoom({ position: "bottomright" }).addTo(map);
      L.control.scale({ imperial: false, position: "bottomleft" }).addTo(map);
      mapRef.current = map;
      if (!destroyed) setReady(true);
    });
    return () => {
      destroyed = true;
      if (mapRef.current) { mapRef.current.remove(); mapRef.current = null; }
      setReady(false);
    };
  }, []);
  useEffect(() => {
    if (!ready || !mapRef.current) return;
    const L = (window as any).L; const map = mapRef.current;
    markersRef.current.forEach((m) => m.remove()); markersRef.current = [];
    places.forEach((place) => {
      if (!place.lat || !place.lng) return;
      const cat = CATEGORIES.find((c) => c.slug === place.category_slug);
      const color = cat?.color ?? "#0B5E8A"; const emoji = cat?.emoji ?? "📍";
      const icon = L.divIcon({ className: "", iconSize: [38,38], iconAnchor: [19,38], popupAnchor: [0,-42],
        html: `<div style="background:${color};border:2.5px solid white;border-radius:50% 50% 50% 0;transform:rotate(-45deg);width:36px;height:36px;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 12px rgba(0,0,0,0.25);cursor:pointer"><span style="transform:rotate(45deg);font-size:16px">${emoji}</span></div>` });
      const popup = L.popup({ maxWidth: 220, closeButton: false }).setContent(`<div style="padding:12px;font-family:sans-serif">${place.cover_url?`<img src="${place.cover_url}" style="width:100%;height:80px;object-fit:cover;border-radius:10px;margin-bottom:8px"/>`:"" }<div style="font-size:11px;color:${color};font-weight:600">${emoji} ${cat?.label??""}</div><div style="font-weight:700;font-size:14px;color:#0B2E4A">${place.name}</div><div style="font-size:12px;color:#6B7280">⭐ ${place.rating} (${place.review_count} avaliações)</div></div>`);
      const marker = L.marker([place.lat, place.lng], { icon }).addTo(map).bindPopup(popup);
      marker.on("click", () => onPlaceSelect?.(place));
      markersRef.current.push(marker);
    });
  }, [places, ready, onPlaceSelect]);
  return (
    <div className="relative w-full h-full rounded-3xl overflow-hidden shadow-card">
      <div ref={containerRef} className="w-full h-full" />
      {!ready && (<div className="absolute inset-0 bg-sand-light flex items-center justify-center"><div className="text-center"><div className="text-4xl mb-3 animate-bounce">🗺️</div><p className="text-sm font-body text-muted">A carregar o mapa…</p></div></div>)}
    </div>
  );
}

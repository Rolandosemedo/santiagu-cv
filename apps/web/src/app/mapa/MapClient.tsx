"use client";
import { useEffect, useRef, useState } from "react";

function loadLeaflet(): Promise<void> {
  return new Promise((resolve) => {
    if (!document.getElementById("leaflet-css")) {
      const l = document.createElement("link");
      l.id = "leaflet-css"; l.rel = "stylesheet";
      l.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      document.head.appendChild(l);
    }
    if ((window as any).L) { resolve(); return; }
    const s = document.createElement("script");
    s.id = "leaflet-js";
    s.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
    s.async = true; s.onload = () => resolve();
    document.head.appendChild(s);
  });
}

export function MapClient() {
  const ref = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let dead = false;
    loadLeaflet().then(() => {
      if (dead || !ref.current) return;
      const L = (window as any).L;
      if (mapRef.current) { mapRef.current.remove(); mapRef.current = null; }
      const c = ref.current as any;
      if (c._leaflet_id) c._leaflet_id = null;

      const map = L.map(ref.current, {
        center: [15.07, -23.62],
        zoom: 11,
        zoomControl: true,
      });

      // Mapa base OpenStreetMap — máximo detalhe
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map);

      L.control.scale({ imperial: false, position: "bottomleft" }).addTo(map);

      mapRef.current = map;
      if (!dead) setReady(true);
    });
    return () => {
      dead = true;
      if (mapRef.current) { mapRef.current.remove(); mapRef.current = null; }
    };
  }, []);

  return (
    <div style={{ position: "fixed", inset: 0 }}>
      <div ref={ref} style={{ width: "100%", height: "100%" }} />
      {!ready && (
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "#f0f4f8" }}>
          <p style={{ fontFamily: "sans-serif", fontSize: 18, color: "#0B5E8A" }}>🗺️ A carregar Santiago…</p>
        </div>
      )}
    </div>
  );
}

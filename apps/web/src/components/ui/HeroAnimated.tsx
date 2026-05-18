"use client";

import { useEffect, useState } from "react";

const SANTIAGO_PATH =
  "M 25 4 L 13 21 L 28 31 L 7 46 L 21 54 L 22 87 L 34 90 L 38 113 " +
  "L 22 129 L 25 151 L 16 177 L 8 183 L 18 237 L 11 251 L 13 267 " +
  "L 0 279 L 3 307 L 15 312 L 25 347 L 44 352 L 54 365 L 51 400 " +
  "L 111 465 L 140 480 L 206 485 L 229 499 L 240 481 L 256 484 " +
  "L 264 444 L 275 427 L 272 415 L 281 402 L 295 403 L 299 370 " +
  "L 286 358 L 286 340 L 268 318 L 241 266 L 240 238 L 220 233 " +
  "L 209 207 L 193 209 L 157 162 L 137 121 L 124 121 L 121 105 " +
  "L 84 80 L 75 59 L 85 38 L 84 24 L 63 5 L 51 19 L 40 0 Z";

export function HeroAnimated() {
  const [overlays, setOverlays] = useState(false);

  /* Portal + signature appear after title fade-in completes */
  useEffect(() => {
    const t = setTimeout(() => setOverlays(true), 3000);
    return () => clearTimeout(t);
  }, []);

  function scrollToContent() {
    document.getElementById("conteudo")?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <section
      className="relative overflow-hidden flex items-center justify-center"
      style={{
        minHeight: "100svh",
        background: "linear-gradient(180deg, #0096C7 0%, #023E8A 45%, #03045E 100%)",
      }}
    >
      {/* ── Portal CTA — top right ───────────────────────── */}
      <button
        onClick={scrollToContent}
        aria-label="Entra na ilha"
        className="absolute top-20 right-6 flex flex-col items-center gap-1 group focus:outline-none"
        style={{
          opacity: overlays ? 1 : 0,
          transition: "opacity 1.4s ease",
        }}
      >
        <svg width="36" height="46" viewBox="0 0 36 46" fill="none" aria-hidden="true">
          {/* pillars */}
          <rect x="1" y="22" width="7" height="23" rx="1.5" fill="rgba(255,255,255,0.20)" />
          <rect x="28" y="22" width="7" height="23" rx="1.5" fill="rgba(255,255,255,0.20)" />
          {/* outer arch */}
          <path
            d="M 1 22 A 17 17 0 0 1 35 22"
            stroke="rgba(255,255,255,0.50)"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
          />
          {/* inner arch */}
          <path
            d="M 6 22 A 12 12 0 0 1 30 22"
            stroke="rgba(255,255,255,0.25)"
            strokeWidth="1"
            fill="none"
            strokeLinecap="round"
          />
          {/* keystone */}
          <polygon points="14,8 18,1 22,8" fill="rgba(255,255,255,0.60)" />
        </svg>
        <span
          style={{
            color: "rgba(255,255,255,0.60)",
            fontSize: "10px",
            letterSpacing: "0.22em",
            fontFamily: "Georgia, serif",
            fontStyle: "normal",
          }}
          className="group-hover:opacity-100 transition-opacity"
        >
          ENTRA
        </span>
      </button>

      {/* ── Island silhouette + title ─────────────────────── */}
      <div className="relative" style={{ width: 300, height: 500 }}>

        {/* Santiago island — exact outline, centred, opacity 0.16 */}
        <svg
          width="300"
          height="500"
          viewBox="0 0 300 500"
          fill="none"
          aria-hidden="true"
          style={{ position: "absolute", inset: 0 }}
        >
          <path d={SANTIAGO_PATH} fill="white" opacity="0.16" />
        </svg>

        {/* Title: 233 px from island top, 38 px margin each side */}
        <div
          style={{
            position: "absolute",
            top: 233,
            left: 38,
            width: 224,          /* 300 - 38*2 */
          }}
        >
          <p
            style={{
              margin: 0,
              fontFamily: "Georgia, 'Times New Roman', serif",
              fontWeight: 300,
              fontSize: 44,
              lineHeight: 1,
              color: "#ffffff",
              whiteSpace: "nowrap",
              animation: "fadeIn 2.6s ease forwards",
              opacity: 0,        /* starts transparent; keyframe brings to 1 */
            }}
          >
            Santi&apos;Águ
          </p>
        </div>
      </div>

      {/* ── Signature — bottom left ───────────────────────── */}
      <p
        className="absolute bottom-10 left-6"
        style={{
          margin: 0,
          fontFamily: "Palatino, Georgia, serif",
          fontStyle: "italic",
          fontSize: 12,
          color: "white",
          letterSpacing: "0.06em",
          opacity: overlays ? 0.55 : 0,
          transition: "opacity 1.4s ease",
        }}
      >
        Ilha de Santiago · Cabo Verde
      </p>

      {/* ── Bottom wave ──────────────────────────────────── */}
      <svg
        className="absolute bottom-0 left-0 right-0"
        viewBox="0 0 1440 80"
        fill="white"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path d="M0,64L80,58.7C160,53,320,43,480,48C640,53,800,75,960,74.7C1120,75,1280,53,1360,42.7L1440,32L1440,80L1360,80C1280,80,1120,80,960,80C800,80,640,80,480,80C320,80,160,80,80,80L0,80Z" />
      </svg>
    </section>
  );
}

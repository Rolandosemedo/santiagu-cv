"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, TrendingUp } from "lucide-react";
import { Navbar } from "@/components/ui/Navbar";
import { PlaceCard } from "@/components/places/PlaceCard";
import { CATEGORIES } from "@/lib/types";
import type { Place } from "@/lib/types";

const SANTIAGO_PATH =
  "M 25 4 L 13 21 L 28 31 L 7 46 L 21 54 L 22 87 L 34 90 L 38 113 " +
  "L 22 129 L 25 151 L 16 177 L 8 183 L 18 237 L 11 251 L 13 267 " +
  "L 0 279 L 3 307 L 15 312 L 25 347 L 44 352 L 54 365 L 51 400 " +
  "L 111 465 L 140 480 L 206 485 L 229 499 L 240 481 L 256 484 " +
  "L 264 444 L 275 427 L 272 415 L 281 402 L 295 403 L 299 370 " +
  "L 286 358 L 286 340 L 268 318 L 241 266 L 240 238 L 220 233 " +
  "L 209 207 L 193 209 L 157 162 L 137 121 L 124 121 L 121 105 " +
  "L 84 80 L 75 59 L 85 38 L 84 24 L 63 5 L 51 19 L 40 0 Z";

const HERO_GRADIENT = "linear-gradient(180deg, #0096C7 0%, #023E8A 45%, #03045E 100%)";
const EASE = "cubic-bezier(0.25, 0.46, 0.45, 0.94)";

/* ═══════════════════════════════════════════════════════════
   DOOR PANEL — minimalist white-on-dark-blue silhouette
   viewBox 0 0 400 800.
   Both halves together form a complete arched portal:
     • arch centre is at the seam (x=400 left door / x=0 right door)
     • radius 365 px
   ═══════════════════════════════════════════════════════════ */
function DoorPanel({ side, open }: { side: "left" | "right"; open: boolean }) {
  const isLeft = side === "left";

  /* Gradient IDs must be unique per SVG instance */
  const bgId   = `door-bg-${side}`;
  const glowId = `door-glow-${side}`;

  /*
   * Arch geometry (both doors share the same circle):
   *   centre  → (400, 400) in left-door coords = (0, 400) in right-door coords
   *   radius  → 365
   *
   * Left door arch path:  M 35,400  A 365,365  0 0 1  400,35
   * Right door arch path: M 0,35    A 365,365  0 0 0  365,400
   *   (arc direction flipped so both doors curve the same way inward)
   */
  const archOuter = isLeft
    ? "M 35,400 A 365,365 0 0 1 400,35"
    : "M 0,35   A 365,365 0 0 0 365,400";

  const archInner = isLeft
    ? "M 62,400 A 338,338 0 0 1 400,62"
    : "M 0,62   A 338,338 0 0 0 338,400";

  /* Hinge x-positions */
  const hingeX    = isLeft ? 0   : 380;
  const hingeW    = 20;
  /* Handle x-position (inner / seam edge) */
  const handleX   = isLeft ? 355 : 0;
  const handleDir = isLeft ? 1   : -1; /* which side the pull bar extends */

  /* Darkening filter as door opens */
  const brightness = open ? 0.18 : 1;

  return (
    <svg
      viewBox="0 0 400 800"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      style={{
        position: "absolute", inset: 0,
        width: "100%", height: "100%",
        filter: `brightness(${brightness})`,
        transition: `filter 3s ${EASE}`,
      }}
    >
      <defs>
        <linearGradient id={bgId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#0096C7" />
          <stop offset="45%"  stopColor="#023E8A" />
          <stop offset="100%" stopColor="#03045E" />
        </linearGradient>
        {/* subtle inner glow on the seam edge */}
        <linearGradient id={glowId}
          x1={isLeft ? "1" : "0"} y1="0"
          x2={isLeft ? "0" : "1"} y2="0">
          <stop offset="0%"   stopColor="rgba(150,220,255,0.12)" />
          <stop offset="20%"  stopColor="rgba(150,220,255,0)" />
        </linearGradient>
      </defs>

      {/* ── Background ──────────────────────────────────────── */}
      <rect width="400" height="800" fill={`url(#${bgId})`} />

      {/* ── Arch fill (very subtle tint inside the arch area) ── */}
      <path d={archOuter}
        fill="rgba(255,255,255,0.04)"
        stroke="none"
        /* close path back to arch base for fill */
        strokeWidth="0"
      />

      {/* ── Outer arch stroke ───────────────────────────────── */}
      <path d={archOuter}
        fill="none"
        stroke="rgba(255,255,255,0.40)"
        strokeWidth="2.5"
        strokeLinecap="round"
      />

      {/* ── Inner arch (concentric) ─────────────────────────── */}
      <path d={archInner}
        fill="none"
        stroke="rgba(255,255,255,0.16)"
        strokeWidth="1.2"
        strokeLinecap="round"
      />

      {/* ── Pillar — outer edge ─────────────────────────────── */}
      <rect
        x={isLeft ? 0 : 365} y="400" width="35" height="400"
        fill="rgba(255,255,255,0.07)"
        stroke="rgba(255,255,255,0.28)" strokeWidth="1"
      />

      {/* ── Pillar — inner / seam edge ──────────────────────── */}
      <rect
        x={isLeft ? 365 : 0} y="400" width="35" height="400"
        fill="rgba(255,255,255,0.05)"
        stroke="rgba(255,255,255,0.22)" strokeWidth="1"
      />

      {/* ── Lower door body (rectangular below arch) ────────── */}
      <rect x="35" y="400" width="330" height="378"
        fill="rgba(255,255,255,0.03)" />

      {/* ── Inner door panel frame ──────────────────────────── */}
      <rect x="62" y="420" width="276" height="340" rx="3"
        fill="rgba(255,255,255,0.025)"
        stroke="rgba(255,255,255,0.18)" strokeWidth="1.5" />

      {/* ── Upper sub-panel ─────────────────────────────────── */}
      <rect x="82" y="438" width="236" height="115" rx="2"
        fill="none"
        stroke="rgba(255,255,255,0.11)" strokeWidth="1" />

      {/* ── Lower sub-panel ─────────────────────────────────── */}
      <rect x="82" y="578" width="236" height="165" rx="2"
        fill="none"
        stroke="rgba(255,255,255,0.11)" strokeWidth="1" />

      {/* ── Middle rail ─────────────────────────────────────── */}
      <line x1="62" y1="572" x2="338" y2="572"
        stroke="rgba(255,255,255,0.16)" strokeWidth="1.5" />

      {/* ── Handle (inner/seam edge) ────────────────────────── */}
      <rect
        x={isLeft ? 352 : 28} y="596" width="14" height="56" rx="7"
        fill="rgba(255,255,255,0.22)"
        stroke="rgba(255,255,255,0.35)" strokeWidth="1"
      />
      {/* handle grip highlight */}
      <rect
        x={isLeft ? 354 : 30} y="610" width="10" height="28" rx="5"
        fill="rgba(255,255,255,0.12)"
      />

      {/* ── Hinges × 3 (outer edge) ─────────────────────────── */}
      {[450, 590, 730].map((y) => (
        <rect key={y}
          x={hingeX} y={y - 5} width={hingeW} height="10" rx="2"
          fill="rgba(255,255,255,0.28)"
          stroke="rgba(255,255,255,0.40)" strokeWidth="0.8"
        />
      ))}

      {/* ── Keystone (half triangle at arch peak, seam edge) ── */}
      {isLeft ? (
        <polygon points="384,12 400,0 400,32"
          fill="rgba(255,255,255,0.55)" />
      ) : (
        <polygon points="16,12 0,0 0,32"
          fill="rgba(255,255,255,0.55)" />
      )}

      {/* ── Seam inner-glow ─────────────────────────────────── */}
      <rect width="400" height="800" fill={`url(#${glowId})`} />

      {/* ── Seam shadow (very edge) ─────────────────────────── */}
      <rect
        x={isLeft ? 392 : 0} y="0" width="8" height="800"
        fill="rgba(0,0,0,0.30)"
      />
    </svg>
  );
}

/* ── Flag star positions — static, contourX(y) − 20px ───────
 * y values = fixed % of 500px viewBox. x = left contour x − 20.
 * Above: 5%, 16%, 27%, 38%, 49%  →  y = 25, 80, 135, 190, 245
 * Below: 61%, 72%, 83%, 94%, ~100% →  y = 305, 360, 415, 470, 478
 * contourX interpolated from path left edge at each y.
 * ─────────────────────────────────────────────────────────── */
const STARS_ABOVE: [number, number][] = [
  // [x, y]  contourX(y) − 20
  [-1,  25],   // y=25:  contourX≈19
  [ 2,  80],   // y=80:  contourX≈22
  [ 3, 135],   // y=135: contourX≈23
  [-11, 190],  // y=190: contourX≈9
  [-6,  245],  // y=245: contourX≈14
];
const STARS_BELOW: [number, number][] = [
  [-13, 305],  // y=305: contourX≈7  (clamped from −17 for narrow screens)
  [ 30, 360],  // y=360: contourX≈50
  [ 45, 415],  // y=415: contourX≈65
  [ 82, 455],  // y=455 = (415+495)/2: contourX≈102
  [120, 495],  // y=495 (99%): contourX capped at 140 (last contour point)
];

/* ═══════════════════════════════════════════════════════════
   HOME CLIENT
   ═══════════════════════════════════════════════════════════ */
type Phase = "hero" | "opening" | "done";

export function HomeClient({ topPlaces }: { topPlaces: Place[] }) {
  const [phase, setPhase] = useState<Phase>("hero");
  const [doorsOpen, setDoorsOpen] = useState(false);
  const starsAbove = STARS_ABOVE;
  const starsBelow = STARS_BELOW;

  function enter() {
    if (phase !== "hero") return;
    setPhase("opening");
    requestAnimationFrame(() =>
      requestAnimationFrame(() => setDoorsOpen(true))
    );
    setTimeout(() => setPhase("done"), 3700);
  }

  const showHero       = phase !== "done";
  const showDoors      = phase === "opening";
  const contentVisible = phase !== "hero";

  return (
    <div style={{ overflowX: "hidden" }}>

      {/* ── Navbar ────────────────────────────────────────── */}
      <div style={{
        opacity: phase === "done" ? 1 : 0,
        transition: `opacity 0.7s ${EASE}`,
        pointerEvents: phase === "done" ? "auto" : "none",
      }}>
        <Navbar />
      </div>

      {/* ── Hero overlay ──────────────────────────────────── */}
      {showHero && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 40,
          display: "flex", alignItems: "center", justifyContent: "center",
          background: HERO_GRADIENT,
          opacity: phase === "opening" ? 0 : 1,
          transition: phase === "opening" ? "opacity 0.15s ease" : "none",
        }}>
          {/* Island silhouette + Cape Verde flag elements */}
          <div style={{ position: "relative", width: 300, height: 500, flexShrink: 0 }}>
            {/*
             * Left contour (top→base): (25,4)…(51,400)→(111,465)→(140,480)
             * White polyline = contourX - 6  (strokeWidth 6)
             * Red   polyline = contourX - 16 (strokeWidth 6)
             * Stars outside red line: textAnchor="end" at x = contourX - 22
             * Title zone centre ≈ y=250; stars above y=15→235, below y=270→470
             */}
            <svg width="300" height="500" viewBox="0 0 300 500"
              fill="none" aria-hidden="true" overflow="visible"
              style={{ position: "absolute", inset: 0 }}>

              {/* Island silhouette */}
              <path d={SANTIAGO_PATH} fill="white" opacity="0.16" />

              {/* White line — full left contour, offset -6px, 6px thick */}
              <polyline
                points="19,4 7,21 22,31 1,46 15,54 16,87 28,90 32,113 16,129 19,151 10,177 2,183 12,237 5,251 7,267 -6,279 -3,307 9,312 19,347 38,352 48,365 45,400 105,465 134,480"
                stroke="rgba(255,255,255,0.70)" strokeWidth="6" fill="none"
                strokeLinejoin="round" strokeLinecap="round"
              />

              {/* Red line — full left contour, offset -16px, 6px thick */}
              <polyline
                points="9,4 -3,21 12,31 -9,46 5,54 6,87 18,90 22,113 6,129 9,151 0,177 -8,183 2,237 -5,251 -3,267 -16,279 -13,307 -1,312 9,347 28,352 38,365 35,400 95,465 124,480"
                stroke="rgba(205,32,44,0.80)" strokeWidth="6" fill="none"
                strokeLinejoin="round" strokeLinecap="round"
              />

              {/* 5 stars above title (5%–49% of island height) */}
              {starsAbove.map(([x, y]) => (
                <text key={`sa-${y}`} x={x} y={y}
                  fontSize="13" fill="#FFD700" textAnchor="end" dominantBaseline="middle">★</text>
              ))}

              {/* 5 stars below title (61%–100% of island height) */}
              {starsBelow.map(([x, y]) => (
                <text key={`sb-${y}`} x={x} y={y}
                  fontSize="13" fill="#FFD700" textAnchor="end" dominantBaseline="middle">★</text>
              ))}
            </svg>
          </div>

          {/* Large title — centred over the full viewport width */}
          <p style={{
            position: "absolute",
            top: "50%", left: 0, right: 0,
            transform: "translateY(-50%)",
            margin: 0, padding: "0 2vw",
            fontFamily: "Georgia, 'Times New Roman', serif",
            fontWeight: 300, fontSize: "20vw", lineHeight: 1,
            color: "#fff", whiteSpace: "nowrap",
            textAlign: "center",
            animation: "fadeIn 2.6s ease forwards", opacity: 0,
            pointerEvents: "none",
          }}>
            Santi&apos;Águ
          </p>

          {/* Linha vertical — à direita do título */}
          <div style={{
            position: "absolute",
            left: "calc(50% + 19.5vw)",
            top: 70,
            bottom: 0,
            width: "0.6px",
            background: "rgba(255,255,255,0.75)",
            pointerEvents: "none",
          }} />

          {/* Portal button */}
          <button onClick={enter} aria-label="Entra na ilha"
            style={{
              position: "absolute", top: 24, right: 24,
              display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
              background: "none", border: "none", cursor: "pointer", padding: 8,
              animation: "fadeIn 1s 2.5s ease both", opacity: 0,
            }}>
            <svg width="36" height="46" viewBox="0 0 36 46" fill="none" aria-hidden="true">
              <rect x="1"  y="22" width="7" height="23" rx="1.5" fill="rgba(255,255,255,0.22)" />
              <rect x="28" y="22" width="7" height="23" rx="1.5" fill="rgba(255,255,255,0.22)" />
              <path d="M 1 22 A 17 17 0 0 1 35 22"
                stroke="rgba(255,255,255,0.55)" strokeWidth="3" fill="none" strokeLinecap="round" />
              <path d="M 6 22 A 12 12 0 0 1 30 22"
                stroke="rgba(255,255,255,0.28)" strokeWidth="1" fill="none" strokeLinecap="round" />
              <polygon points="14,8 18,1 22,8" fill="rgba(255,255,255,0.65)" />
            </svg>
            <span style={{
              color: "rgba(255,255,255,0.60)", fontSize: 10,
              letterSpacing: "0.22em", fontFamily: "Georgia, serif",
            }}>
              ENTRA
            </span>
          </button>
        </div>
      )}

      {/* ── Door panels ───────────────────────────────────── */}
      {showDoors && (
        <>
          {/*
           * "Entering" illusion: doors fold INWARD (toward the viewer's side)
           * Left door  — pivot on left  edge, right side swings toward viewer
           * Right door — pivot on right edge, left  side swings toward viewer
           * rotateY(+85deg) / rotateY(-85deg) with perspective 1200px
           */}
          <div style={{
            position: "fixed",
            top: 0, left: 0, bottom: 0, width: "50vw",
            zIndex: 50,
            overflow: "hidden",
            transformOrigin: "0% 50%",
            transform: doorsOpen
              ? `perspective(1200px) rotateY(85deg)`
              : `perspective(1200px) rotateY(0deg)`,
            transition: doorsOpen ? `transform 3s ${EASE}` : "none",
          }}>
            <DoorPanel side="left" open={doorsOpen} />
            <p style={{
              position: "absolute",
              top: "50%", right: 0,
              transform: "translateY(-50%)",
              margin: 0, padding: 0,
              fontFamily: "Georgia, 'Times New Roman', serif",
              fontWeight: 300, fontSize: "20vw", lineHeight: 1,
              color: "rgba(255,255,255,0.95)",
              whiteSpace: "nowrap", userSelect: "none", pointerEvents: "none",
              textAlign: "right",
              opacity: doorsOpen ? 0 : 1,
              transition: doorsOpen ? "opacity 1s ease 0.4s" : "none",
            }}>
              Santi&apos;
            </p>
          </div>

          <div style={{
            position: "fixed",
            top: 0, right: 0, bottom: 0, width: "50vw",
            zIndex: 50,
            overflow: "hidden",
            transformOrigin: "100% 50%",
            transform: doorsOpen
              ? `perspective(1200px) rotateY(-85deg)`
              : `perspective(1200px) rotateY(0deg)`,
            transition: doorsOpen ? `transform 3s ${EASE}` : "none",
          }}>
            <DoorPanel side="right" open={doorsOpen} />
            <p style={{
              position: "absolute",
              top: "50%", left: 0,
              transform: "translateY(-50%)",
              margin: 0, padding: 0,
              fontFamily: "Georgia, 'Times New Roman', serif",
              fontWeight: 300, fontSize: "20vw", lineHeight: 1,
              color: "rgba(255,255,255,0.95)",
              whiteSpace: "nowrap", userSelect: "none", pointerEvents: "none",
              opacity: doorsOpen ? 0 : 1,
              transition: doorsOpen ? "opacity 1s ease 0.4s" : "none",
            }}>
              Águ
            </p>
          </div>
        </>
      )}

      {/* ── Page content — emerges scale + fade ───────────── */}
      <div style={{
        opacity:   contentVisible ? 1 : 0,
        transform: contentVisible ? "scale(1)" : "scale(0.95)",
        /* delay 2.5 s so doors are visibly open before content surfaces */
        transition: phase === "opening"
          ? `opacity 0.9s ${EASE} 2.5s, transform 1s ${EASE} 2.5s`
          : "none",
        pointerEvents: contentVisible ? "auto" : "none",
        transformOrigin: "50% 40%",
      }}>

        {/* Categories */}
        <section id="conteudo" className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display font-bold text-ocean-dark text-2xl">
              Explorar por categoria
            </h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {CATEGORIES.map((cat, i) => (
              <Link
                key={cat.slug}
                href={`/explorar?category=${cat.slug}`}
                className="group flex flex-col items-center gap-2 p-5 rounded-3xl border border-ocean/8 bg-white
                           shadow-card hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-300"
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                <span className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl
                                 transition-transform duration-300 group-hover:scale-110"
                  style={{ backgroundColor: `${cat.color}15` }}>
                  {cat.emoji}
                </span>
                <span className="font-display font-semibold text-sm text-ocean-dark text-center leading-tight">
                  {cat.label}
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* Featured places */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-16">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-terra" />
              <h2 className="font-display font-bold text-ocean-dark text-2xl">
                Mais populares
              </h2>
            </div>
            <Link href="/explorar"
              className="text-sm font-display font-semibold text-ocean hover:text-ocean-dark transition-colors flex items-center gap-1">
              Ver todos <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {topPlaces.map((place, i) => (
              <div key={place.id} className="animate-fade-up"
                style={{ animationDelay: `${i * 0.08}s` }}>
                <PlaceCard place={place} variant="grid" />
              </div>
            ))}
          </div>
        </section>

        {/* Map CTA */}
        <section className="mx-4 sm:mx-6 mb-16 max-w-7xl lg:mx-auto">
          <div className="relative overflow-hidden rounded-3xl bg-ocean-dark p-8 sm:p-12 flex flex-col sm:flex-row items-center gap-6">
            <div className="absolute inset-0 opacity-10"
              style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }}
            />
            <div className="relative flex-1">
              <div className="text-sand font-body text-sm font-medium mb-2">🗺️ Mapa interativo</div>
              <h3 className="font-display font-bold text-white text-2xl sm:text-3xl mb-3">
                Explora Santiago no mapa
              </h3>
              <p className="font-body text-white/70 text-sm max-w-md">
                Descobre locais por raio, filtra por categoria e navega com o GPS. Tudo em tempo real.
              </p>
            </div>
            <Link href="/mapa"
              className="relative btn-primary bg-sand text-ocean-dark hover:bg-sand-dark shrink-0 px-8 py-3.5 text-base">
              Abrir Mapa <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-ocean/8 py-10 px-4 sm:px-6">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xl">🌊</span>
              <span className="font-display font-bold text-ocean-dark">
                Santi&apos;Águ<span className="text-ocean">.cv</span>
              </span>
            </div>
            <p className="font-body text-sm text-muted text-center">
              Feito com ❤️ para a Ilha de Santiago · Cabo Verde 🇨🇻
            </p>
            <div className="flex gap-4">
              {[
                { label: "Sobre", href: "/sobre" },
                { label: "Contacto", href: "/contacto" },
                { label: "Privacidade", href: "/privacidade" },
              ].map(item => (
                <Link key={item.label} href={item.href}
                  className="text-sm font-body text-muted hover:text-ocean transition-colors">
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

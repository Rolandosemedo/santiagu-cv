"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Navbar } from "@/components/ui/Navbar";
import { CATEGORIES } from "@/lib/types";

/* Vértices do polígono da ilha — fonte única de verdade. */
const ISLAND_POINTS: [number,number][] = [
  [25,4],[13,21],[28,31],[7,46],[21,54],[22,87],[34,90],[38,113],
  [22,129],[25,151],[16,177],[8,183],[18,237],[11,251],[13,267],
  [0,279],[3,307],[15,312],[25,347],[44,352],[54,365],[51,400],
  [111,465],[140,480],[206,485],[229,499],[240,481],[256,484],
  [264,444],[275,427],[272,415],[281,402],[295,403],[299,370],
  [286,358],[286,340],[268,318],[241,266],[240,238],[220,233],
  [209,207],[193,209],[157,162],[137,121],[124,121],[121,105],
  [84,80],[75,59],[85,38],[84,24],[63,5],[51,19],[40,0],
];

/* Catmull-Rom → cubic bezier: gera um path fechado suave. */
function smoothClosedPath(pts: [number,number][], t = 0.3): string {
  const n = pts.length;
  const d = [`M ${pts[0][0]} ${pts[0][1]}`];
  for (let i = 0; i < n; i++) {
    const p0 = pts[(i - 1 + n) % n], p1 = pts[i];
    const p2 = pts[(i + 1) % n],     p3 = pts[(i + 2) % n];
    d.push(
      `C ${(p1[0]+(p2[0]-p0[0])*t).toFixed(1)} ${(p1[1]+(p2[1]-p0[1])*t).toFixed(1)}` +
      ` ${(p2[0]-(p3[0]-p1[0])*t).toFixed(1)} ${(p2[1]-(p3[1]-p1[1])*t).toFixed(1)}` +
      ` ${p2[0]} ${p2[1]}`
    );
  }
  return d.join(" ") + " Z";
}

const SANTIAGO_PATH = smoothClosedPath(ISLAND_POINTS);

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


/* ═══════════════════════════════════════════════════════════
   HOME CLIENT
   ═══════════════════════════════════════════════════════════ */
type Phase = "hero" | "opening" | "done";

export function HomeClient() {
  const [phase, setPhase] = useState<Phase>("hero");
  const [doorsOpen, setDoorsOpen] = useState(false);
  const [tiLeft, setTiLeft] = useState<number | null>(null);

  useEffect(() => {
    function measure() {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      const fs = window.innerWidth * 0.20;
      ctx.font = `300 ${fs}px Georgia, ‘Times New Roman’, serif`;
      const fullWidth = ctx.measureText("Santi’Águ").width;
      const startX = window.innerWidth / 2 - fullWidth / 2;
      setTiLeft(startX + ctx.measureText("Sant").width);
    }
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

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
          background: HERO_GRADIENT,
          opacity: phase === "opening" ? 0 : 1,
          transition: phase === "opening" ? "opacity 0.15s ease" : "none",
        }}>
          {/* Silhueta — centrada via CSS, renderiza imediatamente */}
          <div style={{
            position: "absolute",
            left: "calc(50% - 150px)", top: "calc(50% - 250px)",
            width: 300, height: 500, pointerEvents: "none",
          }}>
            <svg width="300" height="500" viewBox="0 0 300 500" aria-hidden="true">
              <path d={SANTIAGO_PATH} fill="white" opacity="0.16" />
            </svg>
          </div>

          {/* Linha vermelha fina mascarada pelo título — coordenadas CSS puras */}
          <svg aria-hidden="true" style={{
            position: "absolute", inset: 0,
            width: "100%", height: "100%",
            pointerEvents: "none",
          }}>
            <defs>
              {/*
               * Mask em coordenadas root SVG (= píxeis de viewport).
               * O texto usa vw/vh para ficar alinhado com o título CSS
               * sem depender de medição JS.
               */}
              <mask id="title-mask">
                <rect width="100%" height="100%" fill="white" />
                <text
                  x="0" y="0"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  style={{
                    fontFamily: "Georgia, 'Times New Roman', serif",
                    fontWeight: 300,
                    fontSize: "20vw",
                    transform: "translate(50vw, 50vh)",
                  }}
                  fill="black"
                >
                  Santi&apos;Águ
                </text>
              </mask>
            </defs>
            {/* Mask no <g> externo (sem transform) → coordenadas de viewport */}
            <g mask="url(#title-mask)">
              <g style={{ transform: "translate(calc(50vw - 150px), calc(50vh - 250px))" }}>
                <path
                  d={SANTIAGO_PATH}
                  fill="none"
                  stroke="#CF2029"
                  strokeWidth="1.5"
                />
              </g>
            </g>
          </svg>

          {/* Título — centrado sobre todo o viewport */}
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

          {/* Portal button — integrado no título entre o "t" e o "i" */}
          {tiLeft !== null && (
          <button onClick={enter} aria-label="Entra na ilha"
            style={{
              position: "absolute",
              top: "calc(50% + 1cm)",
              left: tiLeft,
              transform: "translate(-50%, -50%)",
              display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
              background: "none", border: "none", cursor: "pointer", padding: 8,
              animation: "fadeIn 1s 2.5s ease both", opacity: 0,
              zIndex: 1,
            }}>
            <svg width="28" height="36" viewBox="0 0 36 46" fill="none" aria-hidden="true">
              <rect x="1"  y="22" width="7" height="23" rx="1.5" fill="rgba(255,255,255,0.22)" />
              <rect x="28" y="22" width="7" height="23" rx="1.5" fill="rgba(255,255,255,0.22)" />
              <path d="M 1 22 A 17 17 0 0 1 35 22"
                stroke="rgba(255,255,255,0.55)" strokeWidth="3" fill="none" strokeLinecap="round" />
              <path d="M 6 22 A 12 12 0 0 1 30 22"
                stroke="rgba(255,255,255,0.28)" strokeWidth="1" fill="none" strokeLinecap="round" />
              <polygon points="14,8 18,1 22,8" fill="rgba(255,255,255,0.65)" />
            </svg>
            <span style={{
              color: "rgba(255,255,255,0.60)", fontSize: 8,
              letterSpacing: "0.20em", fontFamily: "Georgia, serif",
            }}>
              ENTRA
            </span>
          </button>
          )}
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
                className="group relative overflow-hidden rounded-3xl shadow-card hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-300 aspect-[4/3]"
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                <img
                  src={cat.image}
                  alt={cat.label}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                <span className="absolute bottom-3 left-0 right-0 text-center font-display font-semibold text-sm text-white leading-tight px-2">
                  {cat.label}
                </span>
              </Link>
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

      </div>
    </div>
  );
}

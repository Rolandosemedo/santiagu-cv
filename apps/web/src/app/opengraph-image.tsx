import { ImageResponse } from "next/og";

export const alt = "Santi'Águ.cv — Descobre a Ilha de Santiago";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0B2E4A 0%, #0B5E8A 60%, #1A8FBF 100%)",
          fontFamily: "sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative circles */}
        <div
          style={{
            position: "absolute",
            top: -120,
            right: -120,
            width: 400,
            height: 400,
            borderRadius: "50%",
            background: "rgba(242,198,125,0.08)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -80,
            left: -80,
            width: 300,
            height: 300,
            borderRadius: "50%",
            background: "rgba(26,143,191,0.12)",
          }}
        />

        {/* Wave SVG at bottom */}
        <svg
          style={{ position: "absolute", bottom: 0, left: 0, right: 0 }}
          viewBox="0 0 1200 80"
          preserveAspectRatio="none"
          width="1200"
          height="80"
        >
          <path
            d="M0,64L80,58C160,53,320,43,480,48C640,53,800,75,960,75C1120,75,1280,53,1360,43L1440,32L1440,80L0,80Z"
            fill="rgba(242,198,125,0.15)"
          />
        </svg>

        {/* Logo */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            marginBottom: 32,
          }}
        >
          <span style={{ fontSize: 52 }}>🌊</span>
          <span
            style={{
              fontSize: 52,
              fontWeight: 800,
              color: "#FFFFFF",
              letterSpacing: "-1px",
            }}
          >
            Santi&apos;Águ
            <span style={{ color: "#F2C67D" }}>.cv</span>
          </span>
        </div>

        {/* Tagline */}
        <p
          style={{
            fontSize: 26,
            color: "rgba(255,255,255,0.80)",
            textAlign: "center",
            maxWidth: 700,
            lineHeight: 1.4,
            margin: 0,
          }}
        >
          Descobre restaurantes, praias, música e muito mais{" "}
          <span style={{ color: "#F2C67D" }}>na Ilha de Santiago</span>,
          Cabo Verde 🇨🇻
        </p>

        {/* Pills */}
        <div
          style={{
            display: "flex",
            gap: 12,
            marginTop: 40,
          }}
        >
          {["🍽️ Restaurantes", "🏖️ Praias", "🎶 Música", "🏛️ Histórico", "🏨 Hotéis"].map(
            (label) => (
              <div
                key={label}
                style={{
                  background: "rgba(255,255,255,0.12)",
                  border: "1px solid rgba(255,255,255,0.20)",
                  borderRadius: 999,
                  padding: "8px 18px",
                  fontSize: 18,
                  color: "rgba(255,255,255,0.90)",
                  fontWeight: 600,
                }}
              >
                {label}
              </div>
            )
          )}
        </div>
      </div>
    ),
    { ...size }
  );
}

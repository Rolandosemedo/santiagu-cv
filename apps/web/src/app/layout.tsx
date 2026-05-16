import type { Metadata } from "next";
import { Syne, DM_Sans } from "next/font/google";
import "./globals.css";
import "mapbox-gl/dist/mapbox-gl.css";

const syne = Syne({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-syne",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-dm-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Santi'Águ.cv — Descobre a Ilha de Santiago",
    template: "%s | Santi'Águ.cv",
  },
  description:
    "A plataforma completa para descobrir, explorar e reservar restaurantes, praias, eventos, alojamento e muito mais na Ilha de Santiago, Cabo Verde.",
  keywords: ["Santiago", "Cabo Verde", "turismo", "Praia", "Tarrafal", "restaurantes", "praias"],
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
  openGraph: {
    title: "Santi'Águ.cv",
    description: "Descobre tudo na Ilha de Santiago, Cabo Verde.",
    url: "https://santiagu.cv",
    siteName: "Santi'Águ.cv",
    locale: "pt_PT",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Santi'Águ.cv",
    description: "Descobre tudo na Ilha de Santiago, Cabo Verde.",
  },
  metadataBase: new URL("https://santiagu.cv"),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt" className={`${syne.variable} ${dmSans.variable}`}>
      <body className="font-body bg-white text-ocean-dark antialiased">
        {children}
      </body>
    </html>
  );
}

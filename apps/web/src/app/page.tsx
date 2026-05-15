import Link from "next/link";
import Image from "next/image";
import { ArrowRight, MapPin, Star, TrendingUp } from "lucide-react";
import { Navbar } from "@/components/ui/Navbar";
import { PlaceCard } from "@/components/places/PlaceCard";
import { CATEGORIES } from "@/lib/types";
import { fetchPlaces } from "@/lib/api";

export default async function HomePage() {
  // Fetch featured places (top rated)
  const { data: places } = await fetchPlaces({ limit: 6 });
  const topPlaces = places.sort((a, b) => b.rating - a.rating).slice(0, 6);

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* ── Hero ───────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-ocean-dark min-h-[540px] flex items-center">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-ocean-dark via-ocean to-ocean-light opacity-90" />

        {/* Decorative circles */}
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-sand/10 blur-3xl" />
        <div className="absolute -bottom-12 -left-12 w-64 h-64 rounded-full bg-verde/10 blur-2xl" />

        {/* Wave bottom */}
        <svg
          className="absolute bottom-0 left-0 right-0 text-white"
          viewBox="0 0 1440 80"
          fill="currentColor"
          preserveAspectRatio="none"
        >
          <path d="M0,64L80,58.7C160,53,320,43,480,48C640,53,800,75,960,74.7C1120,75,1280,53,1360,42.7L1440,32L1440,80L1360,80C1280,80,1120,80,960,80C800,80,640,80,480,80C320,80,160,80,80,80L0,80Z" />
        </svg>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-20 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white/90 text-xs font-body font-medium px-4 py-1.5 rounded-full mb-6 border border-white/20 animate-fade-in">
            <MapPin className="w-3.5 h-3.5" />
            Ilha de Santiago, Cabo Verde 🇨🇻
          </div>

          {/* Title */}
          <h1 className="font-display font-bold text-white text-4xl sm:text-5xl md:text-6xl tracking-tight mb-4 animate-fade-up">
            Descobre tudo em{" "}
            <span className="text-sand">Santiago</span>
          </h1>

          <p className="font-body text-white/75 text-lg max-w-xl mx-auto mb-10 animate-fade-up delay-100">
            Restaurantes, praias, música ao vivo, história e muito mais —
            tudo numa só plataforma.
          </p>

          {/* Search bar */}
          <div className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto mb-8 animate-fade-up delay-200">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Onde queres ir? Ex: Tarrafal, Cachupa…"
                className="w-full px-5 py-3.5 rounded-full text-ocean-dark font-body text-sm
                           focus:outline-none focus:ring-2 focus:ring-sand/50 shadow-lg"
              />
            </div>
            <Link
              href="/explorar"
              className="btn-primary bg-sand text-ocean-dark hover:bg-sand-dark px-6 py-3.5 shadow-lg"
            >
              Explorar
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Stats */}
          <div className="flex items-center justify-center gap-8 animate-fade-up delay-300">
            {[
              { value: "50+", label: "Locais" },
              { value: "8", label: "Categorias" },
              { value: "4.8★", label: "Avaliação média" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="font-display font-bold text-white text-xl">{stat.value}</div>
                <div className="font-body text-white/60 text-xs">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Categories ─────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
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
              <span
                className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl
                             transition-transform duration-300 group-hover:scale-110"
                style={{ backgroundColor: `${cat.color}15` }}
              >
                {cat.emoji}
              </span>
              <span className="font-display font-semibold text-sm text-ocean-dark text-center leading-tight">
                {cat.label}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Featured places ─────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-16">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-terra" />
            <h2 className="font-display font-bold text-ocean-dark text-2xl">
              Mais populares
            </h2>
          </div>
          <Link
            href="/explorar"
            className="text-sm font-display font-semibold text-ocean hover:text-ocean-dark transition-colors flex items-center gap-1"
          >
            Ver todos <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {topPlaces.map((place, i) => (
            <div
              key={place.id}
              className="animate-fade-up"
              style={{ animationDelay: `${i * 0.08}s` }}
            >
              <PlaceCard place={place} variant="grid" />
            </div>
          ))}
        </div>
      </section>

      {/* ── Map CTA ─────────────────────────────────────── */}
      <section className="mx-4 sm:mx-6 mb-16 max-w-7xl lg:mx-auto">
        <div className="relative overflow-hidden rounded-3xl bg-ocean-dark p-8 sm:p-12 flex flex-col sm:flex-row items-center gap-6">
          <div className="absolute inset-0 opacity-10"
               style={{
                 backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
               }}
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
          <Link
            href="/mapa"
            className="relative btn-primary bg-sand text-ocean-dark hover:bg-sand-dark shrink-0 px-8 py-3.5 text-base"
          >
            Abrir Mapa <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────── */}
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
            {["Sobre", "Contacto", "Privacidade"].map((item) => (
              <Link key={item} href="#" className="text-sm font-body text-muted hover:text-ocean transition-colors">
                {item}
              </Link>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}

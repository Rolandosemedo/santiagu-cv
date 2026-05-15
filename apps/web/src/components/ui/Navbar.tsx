"use client";

import { useState } from "react";
import { Search, Menu, X, MapPin } from "lucide-react";
import Link from "next/link";

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-ocean/8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <span className="text-xl">🌊</span>
          <span className="font-display font-bold text-ocean-dark text-lg tracking-tight">
            Santi&apos;Águ<span className="text-ocean">.cv</span>
          </span>
        </Link>

        {/* Desktop search */}
        <div className="hidden sm:flex flex-1 max-w-md relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
          <input
            type="text"
            placeholder="Pesquisar restaurantes, praias, eventos…"
            className="w-full pl-9 pr-4 py-2 rounded-full border border-ocean/15 text-sm
                       bg-ocean-dark/3 focus:outline-none focus:border-ocean/40 focus:bg-white
                       transition-all placeholder:text-muted font-body"
          />
        </div>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          <Link href="/explorar" className="text-sm font-display font-medium text-ocean-dark/70 hover:text-ocean px-3 py-1.5 rounded-full hover:bg-ocean/5 transition-all">
            Explorar
          </Link>
          <Link href="/mapa" className="text-sm font-display font-medium text-ocean-dark/70 hover:text-ocean px-3 py-1.5 rounded-full hover:bg-ocean/5 transition-all">
            Mapa
          </Link>
          <Link href="/eventos" className="text-sm font-display font-medium text-ocean-dark/70 hover:text-ocean px-3 py-1.5 rounded-full hover:bg-ocean/5 transition-all">
            Eventos
          </Link>
        </nav>

        {/* Auth buttons */}
        <div className="hidden md:flex items-center gap-2 shrink-0">
          <Link href="/auth/login" className="btn-secondary text-xs py-2 px-4">
            Entrar
          </Link>
          <Link href="/auth/register" className="btn-primary text-xs py-2 px-4">
            Registar
          </Link>
        </div>

        {/* Mobile menu toggle */}
        <button
          className="md:hidden p-2 rounded-full hover:bg-ocean/5 transition-all"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Menu"
        >
          {mobileOpen ? (
            <X className="w-5 h-5 text-ocean-dark" />
          ) : (
            <Menu className="w-5 h-5 text-ocean-dark" />
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-ocean/8 bg-white px-4 py-4 space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
            <input
              type="text"
              placeholder="Pesquisar…"
              className="w-full pl-9 pr-4 py-2.5 rounded-full border border-ocean/15 text-sm
                         bg-ocean-dark/3 focus:outline-none focus:border-ocean/40 font-body"
            />
          </div>
          <nav className="flex flex-col gap-1">
            {["Explorar", "Mapa", "Eventos"].map((item) => (
              <Link
                key={item}
                href={`/${item.toLowerCase()}`}
                className="text-sm font-display font-medium text-ocean-dark/80 px-3 py-2.5 rounded-xl hover:bg-ocean/5 transition-all"
                onClick={() => setMobileOpen(false)}
              >
                {item}
              </Link>
            ))}
          </nav>
          <div className="flex gap-2 pt-1">
            <Link href="/auth/login" className="btn-secondary flex-1 justify-center text-xs py-2.5">
              Entrar
            </Link>
            <Link href="/auth/register" className="btn-primary flex-1 justify-center text-xs py-2.5">
              Registar
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";

export function HeroSearch() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const params = query.trim() ? `?q=${encodeURIComponent(query.trim())}` : "";
    router.push(`/explorar${params}`);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto mb-8"
    >
      <label className="sr-only" htmlFor="hero-search">
        Pesquisar locais em Santiago
      </label>
      <div className="flex-1 relative">
        <input
          id="hero-search"
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Onde queres ir? Ex: Tarrafal, Cachupa…"
          className="w-full px-5 py-3.5 rounded-full text-ocean-dark font-body text-sm
                     focus:outline-none focus:ring-2 focus:ring-sand/50 shadow-lg"
        />
      </div>
      <button
        type="submit"
        className="btn-primary bg-sand text-ocean-dark hover:bg-sand-dark px-6 py-3.5 shadow-lg"
      >
        Explorar
        <ArrowRight className="w-4 h-4" />
      </button>
    </form>
  );
}

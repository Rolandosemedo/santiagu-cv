import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, MapPin, Heart, Globe, Star } from "lucide-react";
import { Navbar } from "@/components/ui/Navbar";

export const metadata: Metadata = {
  title: "Sobre",
  description:
    "Conhece a história e missão do Santi'Águ.cv — a plataforma para descobrir a Ilha de Santiago, Cabo Verde.",
};

const VALUES = [
  {
    emoji: "🌍",
    title: "Feito localmente",
    body: "Criado por pessoas que conhecem Santiago a fundo — cada local, cada sabor, cada história.",
  },
  {
    emoji: "✅",
    title: "Informação verificada",
    body: "Todos os locais passam por um processo de verificação antes de aparecerem na plataforma.",
  },
  {
    emoji: "🚀",
    title: "Sempre atualizado",
    body: "Horários, contactos e eventos são atualizados regularmente para que nunca fiques na mão.",
  },
  {
    emoji: "❤️",
    title: "Comunidade primeiro",
    body: "Apoiamos negócios locais e damos visibilidade a quem faz Santiago um lugar especial.",
  },
];

const STATS = [
  { value: "50+", label: "Locais listados" },
  { value: "8", label: "Categorias" },
  { value: "4.8★", label: "Avaliação média" },
  { value: "2024", label: "Ano de fundação" },
];

export default function SobrePage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* ── Hero ──────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-ocean-dark py-20 px-4 sm:px-6 text-center">
        <div className="absolute inset-0 bg-gradient-to-br from-ocean-dark via-ocean to-ocean-light opacity-90" />
        <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-sand/10 blur-3xl" />

        <svg
          className="absolute bottom-0 left-0 right-0 text-white"
          viewBox="0 0 1440 60"
          fill="currentColor"
          preserveAspectRatio="none"
        >
          <path d="M0,48L80,44C160,40,320,32,480,36C640,40,800,56,960,56C1120,56,1280,40,1360,32L1440,24L1440,60L0,60Z" />
        </svg>

        <div className="relative max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white/90 text-xs font-body font-medium px-4 py-1.5 rounded-full mb-6 border border-white/20">
            <Heart className="w-3.5 h-3.5" />
            A nossa história
          </div>
          <h1 className="font-display font-bold text-white text-4xl sm:text-5xl tracking-tight mb-4">
            Descobre Santiago,{" "}
            <span className="text-sand">com quem a conhece</span>
          </h1>
          <p className="font-body text-white/75 text-lg max-w-xl mx-auto">
            O Santi&apos;Águ.cv nasceu da vontade de mostrar ao mundo a riqueza
            da Ilha de Santiago — num só lugar, acessível a todos.
          </p>
        </div>
      </section>

      {/* ── Mission ───────────────────────────────────────── */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
        <h2 className="font-display font-bold text-ocean-dark text-2xl mb-4">
          A nossa missão
        </h2>
        <p className="font-body text-muted text-base leading-relaxed mb-4">
          Santiago é a maior ilha de Cabo Verde e a que concentra mais história,
          gastronomia, música e natureza. No entanto, durante muito tempo faltou
          uma plataforma digital que reunisse toda essa riqueza de forma simples e
          acessível — tanto para os residentes como para os visitantes.
        </p>
        <p className="font-body text-muted text-base leading-relaxed">
          O <strong className="text-ocean-dark">Santi&apos;Águ.cv</strong> veio
          preencher esse espaço. Reunimos restaurantes, praias, eventos, hotéis,
          locais históricos e muito mais, com informação verificada e sempre
          atualizada. O nosso objetivo é ser o guia definitivo de Santiago — e
          uma ferramenta de crescimento para os negócios locais.
        </p>
      </section>

      {/* ── Stats ─────────────────────────────────────────── */}
      <section className="bg-sand-light/50 py-12 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-6">
          {STATS.map((s) => (
            <div key={s.label} className="text-center">
              <div className="font-display font-bold text-ocean-dark text-3xl mb-1">
                {s.value}
              </div>
              <div className="font-body text-muted text-sm">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Values ────────────────────────────────────────── */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
        <h2 className="font-display font-bold text-ocean-dark text-2xl mb-8 text-center">
          Os nossos valores
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {VALUES.map((v) => (
            <div key={v.title} className="card p-6">
              <div className="text-3xl mb-3">{v.emoji}</div>
              <h3 className="font-display font-bold text-ocean-dark text-base mb-2">
                {v.title}
              </h3>
              <p className="font-body text-muted text-sm leading-relaxed">
                {v.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────── */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 pb-16">
        <div className="bg-ocean-dark rounded-3xl p-8 sm:p-12 text-center">
          <div className="text-4xl mb-4">🌊</div>
          <h3 className="font-display font-bold text-white text-2xl mb-3">
            Pronto para explorar Santiago?
          </h3>
          <p className="font-body text-white/70 text-sm mb-6 max-w-sm mx-auto">
            Descobre os melhores restaurantes, praias e experiências da ilha.
          </p>
          <Link
            href="/explorar"
            className="btn-primary bg-sand text-ocean-dark hover:bg-sand-dark px-8 py-3"
          >
            Começar a explorar
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────── */}
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
            ].map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="text-sm font-body text-muted hover:text-ocean transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}

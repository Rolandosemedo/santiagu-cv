import type { Metadata } from "next";
import Link from "next/link";
import { Mail, MessageSquare, MapPin } from "lucide-react";
import { Navbar } from "@/components/ui/Navbar";

export const metadata: Metadata = {
  title: "Contacto",
  description:
    "Fala connosco — sugestões, parcerias ou qualquer questão sobre o Santi'Águ.cv.",
};

export default function ContactoPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* ── Header ──────────────────────────────────────── */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 pt-12 pb-8">
        <div className="inline-flex items-center gap-2 bg-ocean/8 text-ocean text-xs font-body font-medium px-4 py-1.5 rounded-full mb-4">
          <MessageSquare className="w-3.5 h-3.5" />
          Fala connosco
        </div>
        <h1 className="font-display font-bold text-ocean-dark text-4xl mb-3">
          Contacto
        </h1>
        <p className="font-body text-muted text-base leading-relaxed">
          Tens uma sugestão, queres listar o teu negócio ou tens alguma questão?
          Entra em contacto — respondemos em menos de 24 horas.
        </p>
      </section>

      {/* ── Content ─────────────────────────────────────── */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 pb-16 grid grid-cols-1 sm:grid-cols-3 gap-8">
        {/* Form */}
        <form
          action="mailto:hello@santiagu.cv"
          method="dialog"
          className="sm:col-span-2 space-y-4"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="nome"
                className="block text-xs font-body font-medium text-ocean-dark mb-1.5"
              >
                Nome
              </label>
              <input
                id="nome"
                name="nome"
                type="text"
                required
                placeholder="O teu nome"
                className="w-full px-4 py-2.5 rounded-2xl border border-ocean/15 text-sm font-body
                           focus:outline-none focus:border-ocean/40 focus:ring-1 focus:ring-ocean/20
                           bg-white transition-all"
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-body font-medium text-ocean-dark mb-1.5"
              >
                E-mail
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                placeholder="o-teu@email.com"
                className="w-full px-4 py-2.5 rounded-2xl border border-ocean/15 text-sm font-body
                           focus:outline-none focus:border-ocean/40 focus:ring-1 focus:ring-ocean/20
                           bg-white transition-all"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="assunto"
              className="block text-xs font-body font-medium text-ocean-dark mb-1.5"
            >
              Assunto
            </label>
            <select
              id="assunto"
              name="assunto"
              className="w-full px-4 py-2.5 rounded-2xl border border-ocean/15 text-sm font-body
                         focus:outline-none focus:border-ocean/40 focus:ring-1 focus:ring-ocean/20
                         bg-white transition-all text-ocean-dark appearance-none"
            >
              <option value="">Seleciona um assunto</option>
              <option value="listar">Listar o meu negócio</option>
              <option value="sugestao">Sugestão ou feedback</option>
              <option value="parceria">Parceria</option>
              <option value="bug">Reportar um problema</option>
              <option value="outro">Outro</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="mensagem"
              className="block text-xs font-body font-medium text-ocean-dark mb-1.5"
            >
              Mensagem
            </label>
            <textarea
              id="mensagem"
              name="mensagem"
              required
              rows={5}
              placeholder="Escreve a tua mensagem aqui…"
              className="w-full px-4 py-2.5 rounded-2xl border border-ocean/15 text-sm font-body
                         focus:outline-none focus:border-ocean/40 focus:ring-1 focus:ring-ocean/20
                         bg-white transition-all resize-none"
            />
          </div>

          <button type="submit" className="btn-primary w-full justify-center py-3">
            Enviar mensagem
          </button>

          <p className="text-xs font-body text-muted text-center">
            Ao enviar, aceitas a nossa{" "}
            <Link href="/privacidade" className="text-ocean hover:underline">
              política de privacidade
            </Link>
            .
          </p>
        </form>

        {/* Sidebar */}
        <aside className="space-y-5">
          <div className="card p-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-9 h-9 rounded-xl bg-ocean/8 flex items-center justify-center">
                <Mail className="w-4 h-4 text-ocean" />
              </div>
              <h3 className="font-display font-semibold text-ocean-dark text-sm">
                E-mail
              </h3>
            </div>
            <a
              href="mailto:hello@santiagu.cv"
              className="text-sm font-body text-ocean hover:underline"
            >
              hello@santiagu.cv
            </a>
          </div>

          <div className="card p-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-9 h-9 rounded-xl bg-ocean/8 flex items-center justify-center">
                <MapPin className="w-4 h-4 text-ocean" />
              </div>
              <h3 className="font-display font-semibold text-ocean-dark text-sm">
                Localização
              </h3>
            </div>
            <p className="text-sm font-body text-muted">
              Praia, Ilha de Santiago
              <br />
              Cabo Verde 🇨🇻
            </p>
          </div>

          <div className="card p-5">
            <h3 className="font-display font-semibold text-ocean-dark text-sm mb-2">
              Queres listar o teu negócio?
            </h3>
            <p className="text-xs font-body text-muted leading-relaxed">
              Chega a milhares de turistas e residentes. Preenche o formulário
              com o assunto «Listar o meu negócio».
            </p>
          </div>
        </aside>
      </div>

    </div>
  );
}

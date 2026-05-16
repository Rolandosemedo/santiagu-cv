import type { Metadata } from "next";
import Link from "next/link";
import { Shield } from "lucide-react";
import { Navbar } from "@/components/ui/Navbar";

export const metadata: Metadata = {
  title: "Política de Privacidade",
  description: "Política de privacidade do Santi'Águ.cv — como recolhemos e usamos os teus dados.",
};

const SECTIONS = [
  {
    title: "1. Que dados recolhemos",
    body: `Recolhemos apenas os dados necessários para o funcionamento da plataforma:

• **Dados de conta:** nome, endereço de e-mail e palavra-passe (encriptada) quando te registas.
• **Dados de utilização:** páginas visitadas, pesquisas realizadas e locais guardados, de forma anónima e agregada.
• **Dados de reserva:** nome, contacto e detalhes da reserva quando utilizas a funcionalidade de reservas.
• **Cookies técnicos:** necessários para o funcionamento básico do site (sessão, preferências de idioma).`,
  },
  {
    title: "2. Como usamos os teus dados",
    body: `Os teus dados são utilizados exclusivamente para:

• Fornecer e melhorar os serviços da plataforma.
• Processar reservas e enviar confirmações.
• Enviar comunicações sobre a tua conta (apenas as essenciais).
• Melhorar a experiência com base em dados agregados e anónimos.

Nunca vendemos nem partilhamos os teus dados pessoais com terceiros para fins comerciais.`,
  },
  {
    title: "3. Cookies",
    body: `Utilizamos os seguintes tipos de cookies:

• **Essenciais:** necessários para o funcionamento do site (login, segurança). Não podem ser desativados.
• **Analíticos:** medimos o tráfego de forma anónima para melhorar a plataforma. Podes recusar estes cookies nas definições do browser.
• **Preferências:** guardam as tuas escolhas (idioma, modo de vista). Podem ser limpos a qualquer momento.

Não utilizamos cookies de publicidade ou rastreamento de terceiros.`,
  },
  {
    title: "4. Os teus direitos",
    body: `Nos termos do Regulamento Geral de Proteção de Dados (RGPD), tens direito a:

• **Acesso:** pedir uma cópia de todos os dados que temos sobre ti.
• **Retificação:** corrigir dados incorretos ou incompletos.
• **Eliminação:** solicitar a remoção dos teus dados ("direito ao esquecimento").
• **Portabilidade:** receber os teus dados num formato estruturado e legível por máquina.
• **Oposição:** opor-te ao tratamento dos teus dados para fins específicos.

Para exercer qualquer um destes direitos, contacta-nos em hello@santiagu.cv.`,
  },
  {
    title: "5. Segurança dos dados",
    body: `Aplicamos medidas técnicas e organizacionais adequadas para proteger os teus dados:

• Ligações encriptadas via HTTPS/TLS em todas as comunicações.
• Palavras-passe armazenadas com hashing seguro (bcrypt).
• Acesso restrito aos dados por parte da equipa.
• Backups regulares e planos de recuperação em caso de incidente.`,
  },
  {
    title: "6. Retenção de dados",
    body: `Guardamos os teus dados apenas durante o tempo necessário:

• Dados de conta: até eliminares a conta ou solicitares a remoção.
• Histórico de reservas: 3 anos após a reserva (obrigação legal).
• Dados analíticos anónimos: sem limite de retenção (não são pessoais).

Após o prazo aplicável, os dados são eliminados de forma segura e irreversível.`,
  },
  {
    title: "7. Alterações a esta política",
    body: `Esta política pode ser atualizada periodicamente. Quando forem feitas alterações significativas, notificamos os utilizadores registados por e-mail e publicamos a nova versão nesta página com a data de atualização.

Recomendamos que reveja esta política periodicamente.`,
  },
  {
    title: "8. Contacto",
    body: `Para questões relacionadas com privacidade, proteção de dados ou para exercer os teus direitos:

• **E-mail:** hello@santiagu.cv
• **Assunto:** "Proteção de Dados"

Respondemos no prazo máximo de 30 dias, conforme exigido pelo RGPD.`,
  },
];

export default function PrivacidadePage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* ── Header ──────────────────────────────────────── */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 pt-12 pb-8">
        <div className="inline-flex items-center gap-2 bg-verde/8 text-verde text-xs font-body font-medium px-4 py-1.5 rounded-full mb-4">
          <Shield className="w-3.5 h-3.5" />
          Os teus dados estão seguros
        </div>
        <h1 className="font-display font-bold text-ocean-dark text-4xl mb-3">
          Política de Privacidade
        </h1>
        <p className="font-body text-muted text-sm">
          Última atualização: maio de 2025 · Versão 1.0
        </p>
        <p className="font-body text-muted text-base leading-relaxed mt-3">
          A tua privacidade é importante para nós. Esta política explica de forma
          clara e transparente como recolhemos, usamos e protegemos os teus dados
          pessoais ao utilizares o Santi&apos;Águ.cv.
        </p>
      </section>

      {/* ── Sections ────────────────────────────────────── */}
      <article className="max-w-3xl mx-auto px-4 sm:px-6 pb-16 space-y-8">
        {SECTIONS.map((section) => (
          <section key={section.title} className="card p-6">
            <h2 className="font-display font-bold text-ocean-dark text-base mb-4">
              {section.title}
            </h2>
            <div className="font-body text-muted text-sm leading-relaxed whitespace-pre-line">
              {section.body.split(/\*\*(.*?)\*\*/g).map((part, i) =>
                i % 2 === 1 ? (
                  <strong key={i} className="text-ocean-dark font-medium">
                    {part}
                  </strong>
                ) : (
                  part
                )
              )}
            </div>
          </section>
        ))}

        <div className="text-center pt-4">
          <p className="font-body text-sm text-muted mb-4">
            Tens questões sobre privacidade?
          </p>
          <Link href="/contacto" className="btn-secondary">
            Fala connosco
          </Link>
        </div>
      </article>

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

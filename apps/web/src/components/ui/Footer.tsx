import Link from "next/link";

const NAV_LINKS = [
  { label: "Minha conta", href: "/auth/login" },
  { label: "Serviços", href: "/explorar" },
  { label: "Legislação", href: "/legislacao" },
  { label: "Feedback", href: "/contacto#feedback" },
  { label: "Contactos", href: "/contacto" },
  { label: "FAQs", href: "/faqs" },
];

export function Footer() {
  return (
    <footer style={{ backgroundColor: "#0A1628" }} className="text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        {/* Top row — logo + nav + app buttons */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-10">
          {/* Logo */}
          <div className="shrink-0">
            <Link href="/" className="inline-flex items-center gap-2">
              <span className="text-2xl">🌊</span>
              <span className="font-display font-bold text-xl tracking-tight text-white">
                Santi&apos;Águ<span className="text-ocean-light">.cv</span>
              </span>
            </Link>
            <p className="mt-3 text-sm text-white/50 max-w-xs font-body leading-relaxed">
              A plataforma para descobrir e explorar tudo na Ilha de Santiago, Cabo Verde.
            </p>
          </div>

          {/* Nav links */}
          <nav className="flex flex-wrap gap-x-8 gap-y-3 md:justify-center">
            {NAV_LINKS.map(({ label, href }) => (
              <Link
                key={label}
                href={href}
                className="text-sm font-body text-white/70 hover:text-white transition-colors"
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* App store buttons */}
          <div className="flex flex-col gap-3 shrink-0">
            <a
              href="#"
              className="inline-flex items-center gap-3 bg-white/10 hover:bg-white/20 transition-colors rounded-xl px-4 py-2.5 w-44"
              aria-label="Download on the App Store"
            >
              <AppleIcon />
              <div className="leading-tight">
                <p className="text-white/60 text-[10px] font-body uppercase tracking-wide">Download on the</p>
                <p className="text-white text-sm font-display font-semibold">App Store</p>
              </div>
            </a>
            <a
              href="#"
              className="inline-flex items-center gap-3 bg-white/10 hover:bg-white/20 transition-colors rounded-xl px-4 py-2.5 w-44"
              aria-label="Get it on Google Play"
            >
              <GooglePlayIcon />
              <div className="leading-tight">
                <p className="text-white/60 text-[10px] font-body uppercase tracking-wide">Get it on</p>
                <p className="text-white text-sm font-display font-semibold">Google Play</p>
              </div>
            </a>
          </div>
        </div>

        {/* Divider */}
        <div className="mt-10 border-t border-white/10" />

        {/* Bottom row — copyright + legal links */}
        <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <p className="text-xs text-white/40 font-body">
            © santiagu.cv 2026. Todos os direitos reservados.
          </p>
          <div className="flex items-center gap-4">
            <Link href="/termos" className="text-xs font-body text-white/40 hover:text-white/70 transition-colors">
              Termos de utilização
            </Link>
            <span className="text-white/20">·</span>
            <Link href="/privacidade" className="text-xs font-body text-white/40 hover:text-white/70 transition-colors">
              Política de privacidade
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function AppleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-6 h-6 fill-white shrink-0" xmlns="http://www.w3.org/2000/svg">
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
    </svg>
  );
}

function GooglePlayIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-6 h-6 shrink-0" xmlns="http://www.w3.org/2000/svg">
      <path d="M3.18 23.76c.3.17.64.24.99.2L14.59 12 11 8.41 3.18 23.76z" fill="#EA4335" />
      <path d="M20.96 10.34l-2.95-1.7-3.42 3.36 3.42 3.36 2.98-1.72c.85-.49.85-1.81-.03-2.3z" fill="#FBBC05" />
      <path d="M3.18.24C2.83.2 2.49.28 2.2.44l11.4 11.56 3.59-3.59L3.18.24z" fill="#4285F4" />
      <path d="M2.2.44C1.73.72 1.43 1.23 1.43 1.9v20.2c0 .67.3 1.18.77 1.46l.98.57L14.6 12 2.2.44z" fill="#34A853" />
    </svg>
  );
}

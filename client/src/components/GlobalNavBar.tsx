/**
 * GlobalNavBar: Barra de navegación global reutilizable para TODAS las páginas.
 * Orden: LINCE (inicio) → IMAGELIN → PROMPTLIN → LINCELIN → Avatares → Arsenal IA → ¡JUGAR!
 * Sin botón "Más". Sin candados. Cerrar sesión desde el nombre de usuario.
 * 
 * FIX: Los dropdowns (idioma, país, usuario) ahora están fuera del contenedor
 * con overflow-x-auto para que no se corten.
 */
import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { usePRDLanguage, tl} from "@/contexts/PRDLanguageContext";
import { PRDLanguageSelector } from "@/components/PRDLanguageSelector";
import { UserNavBadge } from "@/components/UserNavBadge";
import { isAdminUser } from "@/lib/accessControl";
import { GlobalSearch } from "@/components/GlobalSearch";

export function GlobalNavBar() {
  const { lang } = usePRDLanguage();
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isAdmin = isAdminUser();

  // Main links — always unlocked, new order: IMAGELIN → PROMPTLIN → LINCELIN → Avatares → Arsenal IA
  const MAIN_LINKS = [
    { href: "/prompt-studio", icon: "🖼️", label: "IMAGELIN", color: "text-purple-400 hover:text-purple-300 hover:bg-purple-400/10" },
    { href: "/promptear", icon: "🧠", label: "PROMPTLIN", color: "text-yellow-400 hover:text-yellow-300 hover:bg-yellow-400/10" },
    { href: "/lincelin", icon: "🎨", label: "LINCELIN", color: "text-pink-400 hover:text-pink-300 hover:bg-pink-400/10" },
    { href: "/personajes", icon: "🐱", label: tl(lang, { es: 'Avatares', en: 'Avatars', zh: '角色', 'pt-BR': 'Avatares', 'pt-PT': 'Avatares' }), color: "text-amber-400 hover:text-amber-300 hover:bg-amber-400/10" },
    { href: "/arsenal-ia", icon: "⚡", label: tl(lang, { es: 'Arsenal IA', en: 'AI Arsenal', zh: 'AI武器库', 'pt-BR': 'Arsenal IA', 'pt-PT': 'Arsenal IA' }), color: "text-cyan-300 hover:text-cyan-200 hover:bg-cyan-400/10" },
  ];

  const ADMIN_LINKS = [
    { href: "/mundo", icon: "🌍", label: tl(lang, { es: 'Mundo', en: 'World', zh: '世界', 'pt-BR': 'Mundo', 'pt-PT': 'Mundo' }), color: "text-amber-400 hover:text-amber-300 hover:bg-amber-400/10" },
    { href: "/raids", icon: "⚔️", label: "Raids", color: "text-red-400 hover:text-red-300 hover:bg-red-400/10" },
    { href: "/academia", icon: "🎓", label: tl(lang, { es: 'Academia', en: 'Academy', zh: '学院', 'pt-BR': 'Academia', 'pt-PT': 'Academia' }), color: "text-emerald-400 hover:text-emerald-300 hover:bg-emerald-400/10" },
  ];

  const ALL_LINKS = isAdmin ? [...MAIN_LINKS, ...ADMIN_LINKS] : MAIN_LINKS;

  const isActive = (href: string) => location === href || location.startsWith(href + "/");

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-[#0A0A0A]/95 backdrop-blur-md border-b border-[#00E5FF]/10" : "bg-[#0A0A0A]/80 backdrop-blur-sm"
      }`}
      role="navigation"
      aria-label="Global navigation"
    >
      <div className="container flex items-center justify-between h-14 gap-2">
        {/* Logo → Home */}
        <a href="/" className="flex items-center gap-0.5 flex-shrink-0">
          
          <span className="font-['Space_Grotesk'] font-bold text-base text-[#00E5FF]">LINCE</span>
        </a>

        {/* Desktop — split into two parts: links (can scroll) and controls (never clipped) */}
        <div className="hidden lg:flex items-center gap-0 flex-1 justify-end">
          {/* Navigation links — scrollable if needed */}
          <div className="flex items-center gap-0 overflow-x-auto scrollbar-hide">
            {ALL_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={`px-1.5 py-1.5 text-[11px] font-bold rounded-md transition-all whitespace-nowrap flex-shrink-0 ${
                  isActive(link.href)
                    ? link.color.split(" ")[0] + " bg-white/10"
                    : link.color
                }`}
              >
                {link.icon} {link.label}
              </a>
            ))}
            <a
              href="/jugar"
              className={`ml-1 px-3 py-1.5 text-[11px] font-black rounded-lg transition-all whitespace-nowrap flex-shrink-0 ${
                isActive("/jugar")
                  ? "text-black bg-[oklch(0.82_0.15_195)] shadow-[0_0_15px_oklch(0.82_0.15_195/0.5)]"
                  : "text-black bg-[oklch(0.82_0.15_195)] hover:brightness-110 shadow-[0_0_10px_oklch(0.82_0.15_195/0.3)]"
              }`}
            >
              🕹️ {tl(lang, { es: '¡JUGAR!', en: 'PLAY!', zh: '开始玩!', 'pt-BR': '¡JUGAR!', 'pt-PT': '¡JUGAR!' })}
            </a>
          </div>

          {/* Separator */}
          <div className="w-px h-4 bg-white/10 mx-1.5 flex-shrink-0" />

          {/* Controls — OUTSIDE overflow container so dropdowns are NOT clipped */}
          <div className="flex items-center gap-1 flex-shrink-0">
            <GlobalSearch lang={lang as "es" | "en" | "zh"} />
            <PRDLanguageSelector />
            <UserNavBadge variant="compact" className="ml-0.5" />
          </div>
        </div>

        {/* Mobile */}
        <div className="lg:hidden flex items-center gap-2">
          <GlobalSearch lang={lang as "es" | "en" | "zh"} />
          <PRDLanguageSelector />
          <button onClick={() => setMobileOpen(!mobileOpen)} className="text-white p-2" aria-label="Toggle menu">
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
              {mobileOpen ? <path d="M18 6L6 18M6 6l12 12" /> : <path d="M3 12h18M3 6h18M3 18h18" />}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-[#0A0A0A]/98 backdrop-blur-md border-t border-[#00E5FF]/10 p-4 max-h-[80vh] overflow-y-auto">
          {ALL_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className={`block w-full text-left px-4 py-3 text-sm font-bold rounded-md mb-1 ${
                isActive(link.href) ? link.color.split(" ")[0] + " bg-white/10" : link.color
              }`}
            >
              {link.icon} {link.label}
            </a>
          ))}
          <a
            href="/jugar"
            onClick={() => setMobileOpen(false)}
            className="block w-full text-center px-4 py-3 text-sm font-black text-black bg-[oklch(0.82_0.15_195)] hover:brightness-110 rounded-lg mb-1"
          >
            🕹️ {tl(lang, { es: '¡JUGAR!', en: 'PLAY!', zh: '开始玩!', 'pt-BR': '¡JUGAR!', 'pt-PT': '¡JUGAR!' })}
          </a>
          <div className="w-full h-px bg-white/10 my-2" />
          <div className="mt-2">
            <UserNavBadge variant="full" />
          </div>
        </div>
      )}
    </nav>
  );
}

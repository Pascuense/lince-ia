/**
 * Navigation component for Home.tsx
 * VERSIÓN ULTRA-ACCESIBLE: Dos filas en desktop, texto grande, targets táctiles enormes.
 * Diseño democrático: que un abuelo de 80 años pueda usarlo sin ayuda.
 */
import { useState, useEffect } from "react";
import { usePRDLanguage, tl } from "@/contexts/PRDLanguageContext";
import { PRDLanguageSelector } from "@/components/PRDLanguageSelector";
import { UserNavBadge } from "@/components/UserNavBadge";
import { isAdminUser } from "@/lib/accessControl";

const NAV_ITEMS = [
  { id: "avatares", label: "Especialistas", labelEn: "Specialists", labelZh: "专家" },
  { id: "familia", label: "Familia", labelEn: "Family", labelZh: "家族" },
  { id: "vision", label: "Visión", labelEn: "Vision", labelZh: "愿景" },
  { id: "gracias", label: "Gracias", labelEn: "Thanks", labelZh: "感谢" },
];

export { NAV_ITEMS };

export function Navigation({ activeSection }: { activeSection: string }) {
  const { lang } = usePRDLanguage();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMobileOpen(false);
  };

  const isAdmin = isAdminUser();

  // Main links — always visible
  const MAIN_LINKS = [
    { href: "/chat", icon: "👨‍👩‍👧‍👦", label: tl(lang, { es: 'Familia', en: 'Family', zh: '家庭', 'pt-BR': 'Família', 'pt-PT': 'Família' }), color: "text-amber-300" },
    { href: "/prompt-studio", icon: "🖼️", label: tl(lang, { es: 'Crear Imagen', en: 'Create Image', zh: '创建图片', 'pt-BR': 'Criar Imagem', 'pt-PT': 'Criar Imagem' }), color: "text-purple-300" },
    { href: "/arsenal-ia", icon: "⚡", label: tl(lang, { es: 'Herramientas IA', en: 'AI Tools', zh: 'AI工具', 'pt-BR': 'Ferramentas IA', 'pt-PT': 'Ferramentas IA' }), color: "text-cyan-300" },
    { href: "/lincelin", icon: "🎨", label: tl(lang, { es: 'Mi Avatar', en: 'My Avatar', zh: '我的头像', 'pt-BR': 'Meu Avatar', 'pt-PT': 'Meu Avatar' }), color: "text-pink-300" },
  ];

  const ADMIN_LINKS = [
    { href: "/promptear", icon: "🧠", label: tl(lang, { es: 'Aprender Prompts', en: 'Learn Prompts', zh: '学习提示词', 'pt-BR': 'Aprender Prompts', 'pt-PT': 'Aprender Prompts' }), color: "text-yellow-300" },
    { href: "/mundo", icon: "🌍", label: tl(lang, { es: 'Mundo', en: 'World', zh: '世界', 'pt-BR': 'Mundo', 'pt-PT': 'Mundo' }), color: "text-amber-300" },
    { href: "/raids", icon: "⚔️", label: tl(lang, { es: 'Batallas', en: 'Battles', zh: '战斗', 'pt-BR': 'Batalhas', 'pt-PT': 'Batalhas' }), color: "text-red-300" },
    { href: "/academia", icon: "🎓", label: tl(lang, { es: 'Cursos', en: 'Courses', zh: '课程', 'pt-BR': 'Cursos', 'pt-PT': 'Cursos' }), color: "text-emerald-300" },
  ];

  const ALL_LINKS = isAdmin ? [...MAIN_LINKS, ...ADMIN_LINKS] : MAIN_LINKS;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-[#0A0A0A]/95 backdrop-blur-md border-b border-[#00E5FF]/20" : "bg-[#0A0A0A]/80 backdrop-blur-sm"
      }`}
      role="navigation"
      aria-label="Main navigation"
    >
      {/* ===== DESKTOP: Two-row layout for maximum readability ===== */}
      <div className="hidden lg:block">
        {/* Top row: Logo + Language + User */}
        <div className="container flex items-center justify-between h-14 border-b border-white/5">
          <button onClick={() => scrollTo("hero")} className="flex items-center gap-2 flex-shrink-0 min-h-[48px] px-2" aria-label="LINCE Home">
            <img src="https://files.manuscdn.com/user_upload_by_module/session_file/310419663032363896/bUKqcjlDiFJuymcE.png" alt="LINCE" className="w-10 h-10 rounded-xl object-cover" />
            <span className="font-['Space_Grotesk'] font-black text-2xl tracking-tight">
              <span className="text-[#00E5FF]">LINCE</span> <span className="text-[#D4A843]">IA</span>
            </span>
          </button>

          <div className="flex items-center gap-3">
            <PRDLanguageSelector />
            <div className="w-px h-6 bg-white/10" />
            <UserNavBadge variant="compact" className="" />
          </div>
        </div>

        {/* Bottom row: Navigation links — BIG and spaced */}
        <div className="container flex items-center justify-center h-14 gap-2">
          {ALL_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`px-4 py-2.5 text-base font-bold rounded-xl transition-all whitespace-nowrap flex-shrink-0 min-h-[48px] flex items-center gap-2 ${link.color} opacity-80 hover:opacity-100 hover:bg-white/10`}
            >
              <span className="text-xl">{link.icon}</span>
              <span>{link.label}</span>
            </a>
          ))}

          {/* JUGAR button — most prominent */}
          <a
            href="/jugar"
            className="ml-2 px-6 py-2.5 text-base font-black rounded-xl transition-all whitespace-nowrap flex-shrink-0 min-h-[48px] flex items-center gap-2 text-black bg-[oklch(0.82_0.15_195)] hover:brightness-110 shadow-[0_0_12px_oklch(0.82_0.15_195/0.3)]"
          >
            <span className="text-xl">🕹️</span>
            <span>{tl(lang, { es: '¡JUGAR!', en: 'PLAY!', zh: '开始玩!', 'pt-BR': '¡JUGAR!', 'pt-PT': '¡JUGAR!' })}</span>
          </a>
        </div>
      </div>

      {/* ===== MOBILE: Compact header + full-screen menu ===== */}
      <div className="lg:hidden">
        <div className="container flex items-center justify-between h-14 gap-2">
          <button onClick={() => scrollTo("hero")} className="flex items-center gap-1.5 flex-shrink-0 min-h-[48px] px-1" aria-label="LINCE Home">
            <img src="https://files.manuscdn.com/user_upload_by_module/session_file/310419663032363896/bUKqcjlDiFJuymcE.png" alt="LINCE" className="w-8 h-8 rounded-lg object-cover" />
            <span className="font-['Space_Grotesk'] font-black text-xl">
              <span className="text-[#00E5FF]">LINCE</span> <span className="text-[#D4A843]">IA</span>
            </span>
          </button>

          <div className="flex items-center gap-2">
            <PRDLanguageSelector />
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="text-white p-3 min-h-[48px] min-w-[48px] flex items-center justify-center rounded-lg hover:bg-white/10"
              aria-label={mobileOpen ? "Cerrar menú" : "Abrir menú"}
            >
              <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2.5">
                {mobileOpen ? <path d="M18 6L6 18M6 6l12 12" /> : <path d="M3 12h18M3 6h18M3 18h18" />}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu — HUGE touch targets */}
      {mobileOpen && (
        <div className="lg:hidden bg-[#0A0A0A]/98 backdrop-blur-md border-t border-[#00E5FF]/20 p-5 max-h-[85vh] overflow-y-auto">
          {ALL_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-4 w-full text-left px-5 py-5 text-xl font-bold rounded-2xl mb-2 min-h-[64px] ${link.color} hover:bg-white/10`}
            >
              <span className="text-3xl">{link.icon}</span>
              <span>{link.label}</span>
            </a>
          ))}
          <a
            href="/jugar"
            onClick={() => setMobileOpen(false)}
            className="flex items-center justify-center gap-3 w-full text-center px-5 py-5 text-xl font-black text-black bg-[oklch(0.82_0.15_195)] hover:brightness-110 rounded-2xl mb-3 min-h-[64px]"
          >
            <span className="text-3xl">🕹️</span>
            <span>{tl(lang, { es: '¡JUGAR!', en: 'PLAY!', zh: '开始玩!', 'pt-BR': '¡JUGAR!', 'pt-PT': '¡JUGAR!' })}</span>
          </a>
          <div className="w-full h-px bg-white/10 my-4" />
          <div className="mt-3">
            <UserNavBadge variant="full" />
          </div>
        </div>
      )}
    </nav>
  );
}

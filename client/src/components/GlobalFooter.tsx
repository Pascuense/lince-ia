import { usePRDLanguage } from "@/contexts/PRDLanguageContext";
import { APP_VERSION, APP_BUILD_DATE } from "@/lib/gameConstants";

const TEXTS = {
  es: {
    rights: "© 2023-2026 ACNB IA SL. Todos los derechos reservados.",
    creator: "Creado por ACNB IA SL",
    legal: "Legal",
  },
  en: {
    rights: "© 2023-2026 ACNB IA SL. All rights reserved.",
    creator: "Created by ACNB IA SL",
    legal: "Legal Notice",
  },
  zh: {
    rights: "© 2023-2026 ACNB IA SL. 保留所有权利。",
    creator: "创建者：ACNB IA SL",
    legal: "法律声明",
  },
};

export function GlobalFooter({ className = "" }: { className?: string }) {
  let lang = "es";
  try {
    const ctx = usePRDLanguage();
    lang = ctx.lang;
  } catch {
    // fallback
  }
  const t = TEXTS[lang as keyof typeof TEXTS] || TEXTS.es;

  return (
    <footer className={`border-t border-white/[0.06] bg-[#0A0A0A]/80 backdrop-blur-sm ${className}`} role="contentinfo">
      <div className="container py-4 sm:py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Left: Copyright */}
          <div className="text-center sm:text-left">
            <p className="text-[#B0B0B0]/70 text-[11px] sm:text-xs">{t.rights}</p>
            <p className="text-[#00E5FF]/50 text-[10px] sm:text-[11px] mt-0.5">{t.creator}</p>
          </div>

          {/* Right: Legal + Version */}
          <div className="text-center sm:text-right">
            <a href="/aviso-legal" className="text-[#B0B0B0]/50 text-[10px] sm:text-[11px] hover:text-[#00E5FF] transition-colors block">
              {t.legal}
            </a>
            <p className="text-[#00E5FF]/25 text-[9px] sm:text-[10px] font-mono mt-1">
              v{APP_VERSION} · {APP_BUILD_DATE}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

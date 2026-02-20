import { useState, useRef, useEffect } from "react";

type LangCode = "es" | "en" | "zh";

const LANG_OPTIONS: { code: LangCode; flag: string; label: string; labelShort: string }[] = [
  { code: "es", flag: "🇪🇸", label: "Español", labelShort: "ES" },
  { code: "en", flag: "🇬🇧", label: "English", labelShort: "EN" },
  { code: "zh", flag: "🇨🇳", label: "中文", labelShort: "ZH" },
];

function getLang(): LangCode {
  try {
    const saved = localStorage.getItem("lince-prd-lang");
    if (saved === "en" || saved === "zh") return saved;
  } catch {}
  return "es";
}

function setLangStorage(code: LangCode) {
  localStorage.setItem("lince-prd-lang", code);
}

interface GameLanguageSelectorProps {
  onLanguageChange?: (lang: LangCode) => void;
  variant?: "pill" | "bar";
  className?: string;
}

export function GameLanguageSelector({ onLanguageChange, variant = "pill", className = "" }: GameLanguageSelectorProps) {
  const [lang, setLang] = useState<LangCode>(getLang);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const currentLang = LANG_OPTIONS.find(l => l.code === lang)!;

  const handleSelect = (code: LangCode) => {
    setLang(code);
    setLangStorage(code);
    setOpen(false);
    onLanguageChange?.(code);
    window.dispatchEvent(new CustomEvent("lince-lang-change", { detail: code }));
    try {
      const user = localStorage.getItem('lince-user');
      if (user) {
        const parsed = JSON.parse(user);
        if (parsed.id) {
          fetch('/api/trpc/gamePlayer.setLanguage', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ json: { playerId: Number(parsed.id), language: code } }),
          }).catch(() => {});
        }
      }
    } catch {}
  };

  if (variant === "bar") {
    return (
      <div className={`flex items-center gap-1 ${className}`}>
        {LANG_OPTIONS.map(opt => (
          <button key={opt.code} type="button" onClick={() => handleSelect(opt.code)}
            className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs font-semibold transition-all ${
              lang === opt.code ? "bg-[oklch(0.82_0.15_195)]/20 text-[oklch(0.82_0.15_195)] border border-[oklch(0.82_0.15_195)]/40" : "text-gray-500 hover:text-gray-300 hover:bg-white/5 border border-transparent"
            }`}>
            <span className="text-sm leading-none">{opt.flag}</span>
            <span>{opt.labelShort}</span>
          </button>
        ))}
      </div>
    );
  }

  return (
    <div ref={ref} className={`relative ${className}`} style={{ zIndex: 50 }}>
      <button onClick={(e) => { e.stopPropagation(); setOpen(!open); }}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/8 border border-white/15 hover:bg-white/12 hover:border-white/25 transition-all text-xs cursor-pointer"
        type="button">
        <span className="text-sm leading-none">{currentLang.flag}</span>
        <span className="text-white/80 font-semibold">{currentLang.labelShort}</span>
        <svg className={`w-3 h-3 text-white/50 transition-transform duration-200 ${open ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <>
          <div className="fixed inset-0" style={{ zIndex: 49 }} onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-1.5 w-36 bg-[oklch(0.12_0.01_240)] border border-white/15 rounded-xl shadow-2xl overflow-hidden" style={{ zIndex: 50 }} onClick={(e) => e.stopPropagation()}>
            {LANG_OPTIONS.map(opt => (
              <button key={opt.code} type="button" onClick={() => handleSelect(opt.code)}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-sm font-medium transition-all cursor-pointer ${
                  lang === opt.code ? "bg-[oklch(0.82_0.15_195)]/15 text-[oklch(0.82_0.15_195)]" : "text-white/70 hover:bg-white/8 hover:text-white"
                }`}>
                <span className="text-lg leading-none">{opt.flag}</span>
                <span>{opt.label}</span>
                {lang === opt.code && <span className="ml-auto text-[oklch(0.82_0.15_195)]">✓</span>}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

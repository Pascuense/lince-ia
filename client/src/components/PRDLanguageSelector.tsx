import { useState, useRef, useEffect } from "react";
import { usePRDLanguage, type PRDLanguage, type AvatarCountry, COUNTRY_FLAGS, COUNTRY_LABELS, tl} from "@/contexts/PRDLanguageContext";
import { showChangeToast } from "@/components/ChangeToast";

const LANG_OPTIONS: { code: PRDLanguage; flag: string; name: string }[] = [
  { code: "es", flag: "🇪🇸", name: "Español" },
  { code: "en", flag: "🇬🇧", name: "English" },
  { code: "zh", flag: "🇨🇳", name: "中文" },
  { code: "pt-BR", flag: "🇧🇷", name: "Português BR" },
  { code: "pt-PT", flag: "🇵🇹", name: "Português PT" },
];

const COUNTRY_OPTIONS: AvatarCountry[] = ["default", "es", "cl", "mx", "ar", "co", "pe", "br", "pt", "en", "zh"];

export function PRDLanguageSelector() {
  const { lang, setLang, country, setCountry } = usePRDLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const currentLang = LANG_OPTIONS.find(l => l.code === lang) || LANG_OPTIONS[0];

  return (
    <div ref={ref} className="relative" style={{ zIndex: 99999 }}>
      <button
        onClick={(e) => { e.stopPropagation(); setOpen(!open); }}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/10 border border-white/20 hover:bg-white/20 hover:border-white/30 transition-all text-sm cursor-pointer shadow-lg"
        aria-label="Select language and country"
        type="button"
      >
        <span className="text-lg leading-none">{currentLang.flag}</span>
        <span className="text-white/90 font-medium">{currentLang.name}</span>
        <svg className={`w-4 h-4 text-white/60 transition-transform duration-200 ${open ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
      </button>

      {open && (
        <>
          {/* Invisible overlay to catch clicks outside */}
          <div className="fixed inset-0" style={{ zIndex: 99998 }} onClick={() => setOpen(false)} />
          <div 
            className="absolute right-0 top-full mt-2 w-[22rem] bg-[#0c0c14] border border-white/15 rounded-xl shadow-2xl overflow-hidden"
            style={{ zIndex: 99999 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Language Section */}
            <div className="p-4 border-b border-white/10">
              <p className="text-[11px] uppercase tracking-widest text-cyan-400/70 mb-3 font-bold">
                {tl(lang, { es: "🌐 Idioma", en: "🌐 Language", zh: "🌐 语言", 'pt-BR': "🌐 Idioma", 'pt-PT': "🌐 Idioma" })}
              </p>
              <div className="grid grid-cols-3 gap-2">
                {LANG_OPTIONS.map(opt => (
                  <button
                    key={opt.code}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setLang(opt.code);
                      // Auto-set country when switching to Portuguese
                      if (opt.code === "pt-BR" && country !== "br") setCountry("br");
                      if (opt.code === "pt-PT" && country !== "pt") setCountry("pt");
                      showChangeToast(
                        tl(opt.code, {
                          es: `Idioma cambiado a ${opt.name}`,
                          en: `Language changed to ${opt.name}`,
                          zh: `语言已更改为 ${opt.name}`,
                          'pt-BR': `Idioma alterado para ${opt.name}`,
                          'pt-PT': `Idioma alterado para ${opt.name}`,
                        }),
                        opt.flag
                      );
                    }}
                    className={`flex items-center justify-center gap-1.5 px-2 py-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      lang === opt.code
                        ? "bg-cyan-500/20 text-cyan-300 border-2 border-cyan-400/50 shadow-[0_0_12px_rgba(0,229,255,0.15)]"
                        : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white/80 border-2 border-transparent"
                    }`}
                  >
                    <span className="text-lg leading-none">{opt.flag}</span>
                    <span className="truncate">{opt.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Country Section */}
            <div className="p-4">
              <p className="text-[11px] uppercase tracking-widest text-amber-400/70 mb-3 font-bold">
                {tl(lang, { es: "🏳️ País (nombres de avatares)", en: "🏳️ Country (avatar names)", zh: "🏳️ 国家（头像名称）", 'pt-BR': "🏳️ País (nomes dos avatares)", 'pt-PT': "🏳️ País (nomes dos avatares)" })}
              </p>
              <div className="grid grid-cols-3 gap-1.5">
                {COUNTRY_OPTIONS.map(c => (
                  <button
                    key={c}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setCountry(c);
                      setOpen(false);
                      const countryLabel = COUNTRY_LABELS[lang]?.[c] || COUNTRY_LABELS.es?.[c] || c;
                      showChangeToast(
                        tl(lang, {
                          es: `País: ${countryLabel} — Los nombres de avatares se actualizaron`,
                          en: `Country: ${countryLabel} — Avatar names updated`,
                          zh: `国家: ${countryLabel} — 头像名称已更新`,
                          'pt-BR': `País: ${countryLabel} — Nomes dos avatares atualizados`,
                          'pt-PT': `País: ${countryLabel} — Nomes dos avatares atualizados`,
                        }),
                        COUNTRY_FLAGS[c]
                      );
                    }}
                    className={`flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                      country === c
                        ? "bg-amber-500/20 text-amber-300 border border-amber-400/40"
                        : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white/80 border border-transparent"
                    }`}
                  >
                    <span className="text-base leading-none">{COUNTRY_FLAGS[c]}</span>
                    <span className="truncate">{COUNTRY_LABELS[lang]?.[c] || COUNTRY_LABELS.es?.[c] || c}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Quick close hint */}
            <div className="px-4 pb-3">
              <p className="text-[10px] text-white/30 text-center">
                {tl(lang, { es: "Selecciona un país para cerrar", en: "Select a country to close", zh: "选择国家关闭", 'pt-BR': "Selecione um país para fechar", 'pt-PT': "Selecione um país para fechar" })}
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

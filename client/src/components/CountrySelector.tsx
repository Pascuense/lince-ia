import { useState } from "react";
import {
  usePRDLanguage,
  type AvatarCountry,
  COUNTRY_FLAGS,
  COUNTRY_LABELS,
  AVATAR_NAMES_BY_COUNTRY,
} from "@/contexts/PRDLanguageContext";
import { Globe, ChevronDown, Check, MapPin } from "lucide-react";

const COUNTRY_OPTIONS: AvatarCountry[] = [
  "cl", "es", "mx", "ar", "co", "pe", "en", "zh", "default",
];

// Sample avatar key to show preview names
const PREVIEW_AVATARS = ["YAYALIN", "YAYALINA", "PAPALIN", "MAMALINA", "PEQUELIN"];

interface CountrySelectorProps {
  /** Compact mode shows only the flag + country name, no preview */
  compact?: boolean;
  /** Additional CSS classes */
  className?: string;
}

export function CountrySelector({ compact = false, className = "" }: CountrySelectorProps) {
  const { lang, country, setCountry, getAvatarNameForCountry } = usePRDLanguage();
  const [expanded, setExpanded] = useState(false);

  const labels: Record<string, Record<string, string>> = {
    es: {
      title: "Tu País",
      subtitle: "Los nombres de los avatares cambian según tu país",
      preview: "Vista previa de nombres",
      detected: "Detectado por ubicación",
      manual: "Selección manual",
      current: "País actual",
    },
    en: {
      title: "Your Country",
      subtitle: "Avatar names change based on your country",
      preview: "Name preview",
      detected: "Detected by location",
      manual: "Manual selection",
      current: "Current country",
    },
    zh: {
      title: "你的国家",
      subtitle: "头像名称会根据你的国家而变化",
      preview: "名称预览",
      detected: "根据位置检测",
      manual: "手动选择",
      current: "当前国家",
    },
  };

  const t = labels[lang] || labels.es;
  const geoDetected = typeof window !== "undefined" ? localStorage.getItem("lince-geo-detected") : null;

  const handleSelect = (c: AvatarCountry) => {
    setCountry(c);
    if (!compact) setExpanded(false);
  };

  // ─── Compact mode (for nav/header) ───
  if (compact) {
    return (
      <div className={`relative ${className}`}>
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-sm"
          aria-label={t.title}
          type="button"
        >
          <span className="text-base leading-none">{COUNTRY_FLAGS[country]}</span>
          <span className="text-white/80 font-medium text-xs hidden sm:inline">
            {COUNTRY_LABELS[lang][country]}
          </span>
          <ChevronDown className={`w-3 h-3 text-white/50 transition-transform ${expanded ? "rotate-180" : ""}`} />
        </button>

        {expanded && (
          <>
            <div className="fixed inset-0 z-[99998]" onClick={() => setExpanded(false)} />
            <div className="absolute right-0 top-full mt-1.5 w-56 bg-[#0c0c14] border border-white/15 rounded-xl shadow-2xl z-[99999] overflow-hidden">
              <div className="p-2.5">
                <p className="text-[10px] uppercase tracking-widest text-amber-400/70 mb-2 font-bold px-1">
                  {t.title}
                </p>
                <div className="space-y-0.5">
                  {COUNTRY_OPTIONS.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => handleSelect(c)}
                      className={`w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs font-medium transition-all ${
                        country === c
                          ? "bg-amber-500/20 text-amber-300"
                          : "text-white/60 hover:bg-white/5 hover:text-white/80"
                      }`}
                    >
                      <span className="text-base leading-none">{COUNTRY_FLAGS[c]}</span>
                      <span className="flex-1 text-left">{COUNTRY_LABELS[lang][c]}</span>
                      {country === c && <Check className="w-3.5 h-3.5 text-amber-400" />}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    );
  }

  // ─── Full mode (for profile page) ───
  return (
    <div className={`bg-[oklch(0.14_0.015_240)] rounded-2xl border border-white/5 overflow-hidden ${className}`}>
      {/* Header */}
      <div className="p-5 pb-4">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
            <Globe className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h3 className="font-display font-bold text-base text-white">{t.title}</h3>
            <p className="text-gray-500 text-xs">{t.subtitle}</p>
          </div>
        </div>

        {/* Current country display */}
        <div className="mt-4 flex items-center gap-3 p-3 rounded-xl bg-amber-500/5 border border-amber-500/15">
          <span className="text-3xl leading-none">{COUNTRY_FLAGS[country]}</span>
          <div className="flex-1">
            <p className="font-bold text-amber-300 text-sm">{COUNTRY_LABELS[lang][country]}</p>
            <p className="text-gray-500 text-[10px] flex items-center gap-1 mt-0.5">
              {geoDetected ? (
                <>
                  <MapPin className="w-3 h-3" />
                  {t.detected} ({geoDetected.replace(/^LANG_/, "")})
                </>
              ) : (
                <>
                  <Globe className="w-3 h-3" />
                  {t.manual}
                </>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Country grid */}
      <div className="px-5 pb-3">
        <div className="grid grid-cols-3 gap-1.5">
          {COUNTRY_OPTIONS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => handleSelect(c)}
              className={`relative flex flex-col items-center gap-1 px-2 py-3 rounded-xl text-xs font-medium transition-all ${
                country === c
                  ? "bg-amber-500/15 text-amber-300 border-2 border-amber-400/40 shadow-[0_0_12px_rgba(245,158,11,0.1)]"
                  : "bg-white/[0.03] text-white/50 hover:bg-white/[0.06] hover:text-white/70 border-2 border-transparent"
              }`}
            >
              {country === c && (
                <div className="absolute top-1 right-1">
                  <Check className="w-3 h-3 text-amber-400" />
                </div>
              )}
              <span className="text-2xl leading-none">{COUNTRY_FLAGS[c]}</span>
              <span className="text-center leading-tight">{COUNTRY_LABELS[lang][c]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Name preview */}
      <div className="px-5 pb-5">
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-white/[0.03] hover:bg-white/[0.05] transition-all text-xs text-gray-400"
        >
          <span>{t.preview}</span>
          <ChevronDown className={`w-3.5 h-3.5 transition-transform ${expanded ? "rotate-180" : ""}`} />
        </button>

        {expanded && (
          <div className="mt-2 space-y-1.5">
            {PREVIEW_AVATARS.map((key) => {
              const names = AVATAR_NAMES_BY_COUNTRY[key];
              if (!names) return null;
              return (
                <div key={key} className="flex items-center justify-between px-3 py-2 rounded-lg bg-white/[0.02]">
                  <span className="text-gray-500 text-[10px] font-mono">{key}</span>
                  <span className="text-amber-300 text-xs font-bold">
                    {getAvatarNameForCountry(key, country)}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

import { useState, useEffect } from "react";

const AGE_VERIFIED_KEY = "lince-age-verified";
const LINCE_LOGO = "https://files.manuscdn.com/user_upload_by_module/session_file/310419663032363896/jtEEtbRUpTtEBKGn.png";

type Lang = "es" | "en" | "zh" | "pt-BR" | "pt-PT";

const translations: Record<string, {
  title: string;
  subtitle: string;
  warning: string;
  question: string;
  yesBtn: string;
  noBtn: string;
  underageTitle: string;
  underageMsg: string;
  underageBack: string;
  legalNote: string;
  contact: string;
}> = {
  es: {
    title: "LINCE",
    subtitle: "Aprende IA de forma fácil y divertida",
    warning: "VERIFICACIÓN DE EDAD OBLIGATORIA",
    question: "¿Tienes 13 años o más?",
    yesBtn: "SÍ, TENGO 13 AÑOS O MÁS",
    noBtn: "NO, SOY MENOR DE 13 AÑOS",
    underageTitle: "Lo sentimos",
    underageMsg: "LINCE está diseñado para personas de 13 años o más. Si eres menor, pide a un adulto que te acompañe. Cumplimos con la normativa de protección de menores (LOPIVI, RGPD Art. 8, COPPA).",
    underageBack: "VOLVER",
    legalNote: "De acuerdo con el Reglamento General de Protección de Datos (RGPD) Art. 8 y la Ley Orgánica de Protección Integral a la Infancia y la Adolescencia (LOPIVI), el acceso a esta plataforma requiere tener al menos 13 años de edad.",
    contact: "Contacto: info@acnb.es",
  },
  en: {
    title: "LINCE",
    subtitle: "Learn AI the easy and fun way",
    warning: "MANDATORY AGE VERIFICATION",
    question: "Are you 13 years old or older?",
    yesBtn: "YES, I AM 13 OR OLDER",
    noBtn: "NO, I AM UNDER 13",
    underageTitle: "We're sorry",
    underageMsg: "LINCE is designed for people aged 13 and over. If you are younger, please ask an adult to accompany you. We comply with child protection regulations (LOPIVI, GDPR Art. 8, COPPA).",
    underageBack: "GO BACK",
    legalNote: "In accordance with the General Data Protection Regulation (GDPR) Art. 8 and the Spanish Organic Law for the Comprehensive Protection of Children and Adolescents (LOPIVI), access to this platform requires being at least 13 years old.",
    contact: "Contact: info@acnb.es",
  },
  zh: {
    title: "LINCE",
    subtitle: "轻松有趣地学习AI",
    warning: "强制年龄验证",
    question: "您是否年满13岁？",
    yesBtn: "是的，我已满13岁",
    noBtn: "不，我未满13岁",
    underageTitle: "很抱歉",
    underageMsg: "LINCE 专为13岁及以上的用户设计。如果您未满13岁，请让成年人陪同。我们遵守未成年人保护法规（LOPIVI、GDPR第8条、COPPA）。",
    underageBack: "返回",
    legalNote: "根据《通用数据保护条例》(GDPR) 第8条和西班牙《儿童和青少年全面保护组织法》(LOPIVI)，访问本平台需要年满13岁。",
    contact: "联系方式：info@acnb.es",
  },
};

const FLAG_MAP: Record<string, string> = { es: "🇪🇸", en: "🇬🇧", zh: "🇨🇳" };

export function AgeGate({ children }: { children: React.ReactNode }) {
  const [verified, setVerified] = useState<boolean | null>(null);
  const [rejected, setRejected] = useState(false);
  const [lang, setLang] = useState<Lang>("es");
  const [animateIn, setAnimateIn] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(AGE_VERIFIED_KEY);
      if (stored === "true") {
        setVerified(true);
        return;
      }
    } catch {}
    setVerified(false);
    setTimeout(() => setAnimateIn(true), 100);
  }, []);

  const handleVerify = () => {
    localStorage.setItem(AGE_VERIFIED_KEY, "true");
    setVerified(true);
  };

  const handleReject = () => {
    setRejected(true);
  };

  const handleBack = () => {
    setRejected(false);
  };

  // Loading
  if (verified === null) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="w-12 h-12 border-2 border-[#00E5FF]/30 border-t-[#00E5FF] rounded-full animate-spin" />
      </div>
    );
  }

  // Already verified
  if (verified) return <>{children}</>;

  const t = translations[lang];

  // Underage screen
  if (rejected) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-500/20 border-2 border-red-500/40 flex items-center justify-center">
            <svg className="w-10 h-10 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="font-['Space_Grotesk'] text-2xl font-bold text-white mb-4">{t.underageTitle}</h2>
          <p className="text-[#B0B0B0] text-sm leading-relaxed mb-6">{t.underageMsg}</p>
          <p className="text-[#00E5FF]/60 text-xs mb-6">{t.contact}</p>
          <button
            onClick={handleBack}
            className="px-6 py-3 bg-[#00E5FF]/10 border border-[#00E5FF]/30 rounded-lg text-[#00E5FF] font-medium hover:bg-[#00E5FF]/20 transition-colors"
          >
            {t.underageBack}
          </button>
        </div>
      </div>
    );
  }

  // Age verification screen
  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-full h-full" style={{
          backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 60px, rgba(0,229,255,0.03) 60px, rgba(0,229,255,0.03) 61px),
                           repeating-linear-gradient(90deg, transparent, transparent 60px, rgba(0,229,255,0.03) 60px, rgba(0,229,255,0.03) 61px)`
        }} />
      </div>

      <div className={`relative max-w-md w-full transition-all duration-700 ${animateIn ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
        {/* Language selector */}
        <div className="flex justify-center gap-2 mb-6">
          {(Object.keys(FLAG_MAP) as Lang[]).map((l) => (
            <button
              key={l}
              onClick={() => setLang(l)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                lang === l
                  ? "bg-[#00E5FF]/20 border border-[#00E5FF]/50 text-[#00E5FF]"
                  : "bg-white/5 border border-white/10 text-[#B0B0B0] hover:bg-white/10"
              }`}
            >
              {FLAG_MAP[l]}
            </button>
          ))}
        </div>

        {/* Main card */}
        <div className="bg-[#111111] border border-[#00E5FF]/20 rounded-2xl p-8 text-center">
          {/* Logo */}
          <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden border-3 border-[#00E5FF]/40 shadow-[0_0_30px_rgba(0,229,255,0.2)]">
            <img src={LINCE_LOGO} alt="LINCE" className="w-full h-full object-cover" />
          </div>

          {/* Title */}
          <h1 className="font-['Space_Grotesk'] text-3xl font-bold text-white mb-1">
            <span className="text-[#00E5FF]">LINCE</span>
          </h1>
          <p className="text-[#B0B0B0] text-sm mb-6">{t.subtitle}</p>

          {/* Warning badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/30 mb-6">
            <svg className="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <span className="text-amber-400 text-xs font-bold tracking-wider">{t.warning}</span>
          </div>

          {/* Question */}
          <h2 className="font-['Space_Grotesk'] text-xl font-semibold text-white mb-8">{t.question}</h2>

          {/* Buttons */}
          <div className="space-y-3">
            <button
              onClick={handleVerify}
              className="w-full py-4 bg-gradient-to-r from-[#00E5FF] to-[#00B8D4] text-black font-bold text-sm rounded-xl hover:brightness-110 transition-all shadow-[0_0_20px_rgba(0,229,255,0.3)]"
            >
              {t.yesBtn}
            </button>
            <button
              onClick={handleReject}
              className="w-full py-4 bg-red-500/10 border border-red-500/30 text-red-400 font-bold text-sm rounded-xl hover:bg-red-500/20 transition-colors"
            >
              {t.noBtn}
            </button>
          </div>

          {/* Legal note */}
          <p className="text-[#B0B0B0]/50 text-[10px] leading-relaxed mt-6">{t.legalNote}</p>
          <p className="text-[#00E5FF]/40 text-[10px] mt-2">{t.contact}</p>
        </div>

        {/* Footer */}
        <p className="text-center text-[#B0B0B0]/30 text-[10px] mt-4">
          © 2023-2026 ACNB IA SL · NIF B24838690
        </p>
      </div>
    </div>
  );
}

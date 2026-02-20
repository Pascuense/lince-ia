import { useState, useEffect } from "react";

const COOKIE_KEY = "lince_cookies_accepted";

const TEXTS = {
  es: {
    title: "Política de Cookies",
    body: "LINCE utiliza cookies propias y de terceros para mejorar tu experiencia, analizar el tráfico y personalizar el contenido. Al hacer clic en «Aceptar todas», consientes el uso de TODAS las cookies. Puedes gestionar tus preferencias en cualquier momento.",
    acceptAll: "Aceptar todas",
    acceptEssential: "Solo esenciales",
    settings: "Configurar",
    privacy: "Política de Privacidad",
    essential: "Cookies esenciales",
    essentialDesc: "Necesarias para el funcionamiento básico del sitio. No se pueden desactivar.",
    analytics: "Cookies analíticas",
    analyticsDesc: "Nos ayudan a entender cómo usas la plataforma para mejorarla.",
    marketing: "Cookies de marketing",
    marketingDesc: "Permiten mostrarte contenido personalizado y relevante.",
    save: "Guardar preferencias",
  },
  en: {
    title: "Cookie Policy",
    body: "LINCE uses its own and third-party cookies to improve your experience, analyze traffic and personalize content. By clicking 'Accept all', you consent to the use of ALL cookies. You can manage your preferences at any time.",
    acceptAll: "Accept all",
    acceptEssential: "Essential only",
    settings: "Settings",
    privacy: "Privacy Policy",
    essential: "Essential cookies",
    essentialDesc: "Required for the basic functioning of the site. Cannot be disabled.",
    analytics: "Analytics cookies",
    analyticsDesc: "Help us understand how you use the platform to improve it.",
    marketing: "Marketing cookies",
    marketingDesc: "Allow us to show you personalized and relevant content.",
    save: "Save preferences",
  },
  zh: {
    title: "Cookie政策",
    body: "LINCE使用自有和第三方Cookie来改善您的体验、分析流量和个性化内容。点击'全部接受'即表示您同意使用所有Cookie。您可以随时管理您的偏好设置。",
    acceptAll: "全部接受",
    acceptEssential: "仅必要",
    settings: "设置",
    privacy: "隐私政策",
    essential: "必要Cookie",
    essentialDesc: "网站基本功能所必需的。无法禁用。",
    analytics: "分析Cookie",
    analyticsDesc: "帮助我们了解您如何使用平台以改进它。",
    marketing: "营销Cookie",
    marketingDesc: "允许我们向您展示个性化的相关内容。",
    save: "保存偏好",
  },
};

export function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [analytics, setAnalytics] = useState(true);
  const [marketing, setMarketing] = useState(false);

  // Detect language from localStorage
  const storedLang = typeof window !== 'undefined' ? localStorage.getItem('lince-prd-lang') || 'es' : 'es';
  const lang = (storedLang === 'en' || storedLang === 'zh') ? storedLang : 'es';
  const txt = TEXTS[lang as keyof typeof TEXTS] || TEXTS.es;

  useEffect(() => {
    const accepted = localStorage.getItem(COOKIE_KEY);
    if (!accepted) setVisible(true);
  }, []);

  const accept = (type: 'all' | 'essential' | 'custom') => {
    const consent = {
      essential: true,
      analytics: type === 'all' || (type === 'custom' && analytics),
      marketing: type === 'all' || (type === 'custom' && marketing),
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem(COOKIE_KEY, JSON.stringify(consent));
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-end justify-center p-4 sm:p-6" role="dialog" aria-label={txt.title}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      <div className="relative w-full max-w-2xl bg-[#1A1A2E] border border-[#00E5FF]/20 rounded-2xl p-5 sm:p-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-center gap-3 mb-3">
          <span className="text-2xl">🍪</span>
          <h3 className="font-['Space_Grotesk'] font-bold text-white text-lg">{txt.title}</h3>
        </div>

        <p className="text-[#B0B0B0] text-sm leading-relaxed mb-4">{txt.body}</p>

        {/* Settings panel */}
        {showSettings && (
          <div className="mb-4 space-y-3 p-4 bg-white/[0.03] border border-white/[0.06] rounded-xl">
            {/* Essential - always on */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white text-sm font-medium">{txt.essential}</p>
                <p className="text-[#B0B0B0] text-xs">{txt.essentialDesc}</p>
              </div>
              <div className="w-10 h-5 bg-[#00E5FF] rounded-full flex items-center px-0.5 cursor-not-allowed">
                <div className="w-4 h-4 bg-white rounded-full ml-auto" />
              </div>
            </div>
            {/* Analytics */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white text-sm font-medium">{txt.analytics}</p>
                <p className="text-[#B0B0B0] text-xs">{txt.analyticsDesc}</p>
              </div>
              <button onClick={() => setAnalytics(!analytics)}
                className={`w-10 h-5 rounded-full flex items-center px-0.5 transition-colors ${analytics ? 'bg-[#00E5FF]' : 'bg-white/20'}`}
                aria-label={txt.analytics}>
                <div className={`w-4 h-4 bg-white rounded-full transition-all ${analytics ? 'ml-auto' : ''}`} />
              </button>
            </div>
            {/* Marketing */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white text-sm font-medium">{txt.marketing}</p>
                <p className="text-[#B0B0B0] text-xs">{txt.marketingDesc}</p>
              </div>
              <button onClick={() => setMarketing(!marketing)}
                className={`w-10 h-5 rounded-full flex items-center px-0.5 transition-colors ${marketing ? 'bg-[#00E5FF]' : 'bg-white/20'}`}
                aria-label={txt.marketing}>
                <div className={`w-4 h-4 bg-white rounded-full transition-all ${marketing ? 'ml-auto' : ''}`} />
              </button>
            </div>
          </div>
        )}

        {/* Buttons */}
        <div className="flex flex-wrap gap-2">
          <button onClick={() => accept('all')}
            className="flex-1 min-w-[120px] px-4 py-2.5 bg-[#00E5FF] text-black font-['Space_Grotesk'] font-bold text-sm rounded-lg hover:brightness-110 transition-all">
            {txt.acceptAll}
          </button>
          {showSettings ? (
            <button onClick={() => accept('custom')}
              className="flex-1 min-w-[120px] px-4 py-2.5 bg-[#D4A843] text-black font-['Space_Grotesk'] font-bold text-sm rounded-lg hover:brightness-110 transition-all">
              {txt.save}
            </button>
          ) : (
            <>
              <button onClick={() => accept('essential')}
                className="flex-1 min-w-[120px] px-4 py-2.5 bg-white/10 text-white font-['Space_Grotesk'] font-medium text-sm rounded-lg hover:bg-white/20 transition-all">
                {txt.acceptEssential}
              </button>
              <button onClick={() => setShowSettings(true)}
                className="px-4 py-2.5 bg-white/5 text-[#B0B0B0] font-['Space_Grotesk'] text-sm rounded-lg hover:bg-white/10 transition-all">
                {txt.settings}
              </button>
            </>
          )}
        </div>

        <div className="mt-3 text-center">
          <a href="/aviso-legal" className="text-[#00E5FF] text-xs hover:underline">{txt.privacy}</a>
        </div>
      </div>
    </div>
  );
}

import { useState } from "react";
import { usePRDLanguage, tl, type PRDLanguage } from "@/contexts/PRDLanguageContext";
import { Check, X, Crown, Zap, Building2, ChevronDown, ChevronUp } from "lucide-react";

// ─── PLAN DATA ───
interface PlanFeature {
  key: string;
  label: Record<string, string>;
  free: string | boolean;
  premium: string | boolean;
  enterprise: string | boolean;
  freeLabel?: Record<string, string>;
  premiumLabel?: Record<string, string>;
  enterpriseLabel?: Record<string, string>;
}

const PLAN_FEATURES: PlanFeature[] = [
  {
    key: "worlds",
    label: { es: "Mundos de contenido", en: "Content worlds", "pt-BR": "Mundos de conteúdo", "pt-PT": "Mundos de conteúdo" },
    free: true, premium: true, enterprise: true,
    freeLabel: { es: "2 mundos", en: "2 worlds", "pt-BR": "2 mundos", "pt-PT": "2 mundos" },
    premiumLabel: { es: "10 mundos completos", en: "10 full worlds", "pt-BR": "10 mundos completos", "pt-PT": "10 mundos completos" },
    enterpriseLabel: { es: "10 mundos + contenido personalizado", en: "10 worlds + custom content", "pt-BR": "10 mundos + conteúdo personalizado", "pt-PT": "10 mundos + conteúdo personalizado" },
  },
  {
    key: "avatars",
    label: { es: "Avatares", en: "Avatars", "pt-BR": "Avatares", "pt-PT": "Avatares" },
    free: true, premium: true, enterprise: true,
    freeLabel: { es: "1 avatar básico", en: "1 basic avatar", "pt-BR": "1 avatar básico", "pt-PT": "1 avatar básico" },
    premiumLabel: { es: "Avatares ilimitados", en: "Unlimited avatars", "pt-BR": "Avatares ilimitados", "pt-PT": "Avatares ilimitados" },
    enterpriseLabel: { es: "Ilimitados + personalización de marca", en: "Unlimited + brand customization", "pt-BR": "Ilimitados + personalização de marca", "pt-PT": "Ilimitados + personalização de marca" },
  },
  {
    key: "ads",
    label: { es: "Publicidad", en: "Advertising", "pt-BR": "Publicidade", "pt-PT": "Publicidade" },
    free: true, premium: true, enterprise: true,
    freeLabel: { es: "Con anuncios", en: "With ads", "pt-BR": "Com anúncios", "pt-PT": "Com anúncios" },
    premiumLabel: { es: "Sin anuncios", en: "No ads", "pt-BR": "Sem anúncios", "pt-PT": "Sem anúncios" },
    enterpriseLabel: { es: "Sin anuncios", en: "No ads", "pt-BR": "Sem anúncios", "pt-PT": "Sem anúncios" },
  },
  {
    key: "xp",
    label: { es: "XP y progresión", en: "XP & progression", "pt-BR": "XP e progressão", "pt-PT": "XP e progressão" },
    free: true, premium: true, enterprise: true,
    freeLabel: { es: "XP limitado", en: "Limited XP", "pt-BR": "XP limitado", "pt-PT": "XP limitado" },
    premiumLabel: { es: "XP ilimitado", en: "Unlimited XP", "pt-BR": "XP ilimitado", "pt-PT": "XP ilimitado" },
    enterpriseLabel: { es: "XP ilimitado", en: "Unlimited XP", "pt-BR": "XP ilimitado", "pt-PT": "XP ilimitado" },
  },
  {
    key: "certificates",
    label: { es: "Certificados", en: "Certificates", "pt-BR": "Certificados", "pt-PT": "Certificados" },
    free: false, premium: true, enterprise: true,
    freeLabel: { es: "No incluidos", en: "Not included", "pt-BR": "Não incluídos", "pt-PT": "Não incluídos" },
    premiumLabel: { es: "Certificados oficiales", en: "Official certificates", "pt-BR": "Certificados oficiais", "pt-PT": "Certificados oficiais" },
    enterpriseLabel: { es: "Certificados oficiales personalizados", en: "Custom official certificates", "pt-BR": "Certificados oficiais personalizados", "pt-PT": "Certificados oficiais personalizados" },
  },
  {
    key: "community",
    label: { es: "Comunidad", en: "Community", "pt-BR": "Comunidade", "pt-PT": "Comunidade" },
    free: true, premium: true, enterprise: true,
    freeLabel: { es: "Comunidad básica", en: "Basic community", "pt-BR": "Comunidade básica", "pt-PT": "Comunidade básica" },
    premiumLabel: { es: "Comunidad completa", en: "Full community", "pt-BR": "Comunidade completa", "pt-PT": "Comunidade completa" },
    enterpriseLabel: { es: "Comunidad privada corporativa", en: "Private corporate community", "pt-BR": "Comunidade privada corporativa", "pt-PT": "Comunidade privada corporativa" },
  },
  {
    key: "support",
    label: { es: "Soporte", en: "Support", "pt-BR": "Suporte", "pt-PT": "Suporte" },
    free: true, premium: true, enterprise: true,
    freeLabel: { es: "Soporte estándar", en: "Standard support", "pt-BR": "Suporte padrão", "pt-PT": "Suporte padrão" },
    premiumLabel: { es: "Soporte prioritario", en: "Priority support", "pt-BR": "Suporte prioritário", "pt-PT": "Suporte prioritário" },
    enterpriseLabel: { es: "Soporte dedicado", en: "Dedicated support", "pt-BR": "Suporte dedicado", "pt-PT": "Suporte dedicado" },
  },
  {
    key: "exclusive",
    label: { es: "Contenido exclusivo", en: "Exclusive content", "pt-BR": "Conteúdo exclusivo", "pt-PT": "Conteúdo exclusivo" },
    free: false, premium: true, enterprise: true,
    premiumLabel: { es: "Contenido premium exclusivo", en: "Exclusive premium content", "pt-BR": "Conteúdo premium exclusivo", "pt-PT": "Conteúdo premium exclusivo" },
    enterpriseLabel: { es: "Todo Premium + contenido a medida", en: "All Premium + custom content", "pt-BR": "Todo Premium + conteúdo sob medida", "pt-PT": "Todo Premium + conteúdo à medida" },
  },
  {
    key: "admin",
    label: { es: "Panel de administración", en: "Admin panel", "pt-BR": "Painel de administração", "pt-PT": "Painel de administração" },
    free: false, premium: false, enterprise: true,
    enterpriseLabel: { es: "Panel admin con reportes", en: "Admin panel with reports", "pt-BR": "Painel admin com relatórios", "pt-PT": "Painel admin com relatórios" },
  },
  {
    key: "api",
    label: { es: "API", en: "API", "pt-BR": "API", "pt-PT": "API" },
    free: false, premium: false, enterprise: true,
    enterpriseLabel: { es: "Acceso API completo", en: "Full API access", "pt-BR": "Acesso API completo", "pt-PT": "Acesso API completo" },
  },
  {
    key: "whitelabel",
    label: { es: "Personalización de marca", en: "Brand customization", "pt-BR": "Personalização de marca", "pt-PT": "Personalização de marca" },
    free: false, premium: false, enterprise: true,
    enterpriseLabel: { es: "White-label disponible", en: "White-label available", "pt-BR": "White-label disponível", "pt-PT": "White-label disponível" },
  },
];

// ─── TRANSLATIONS ───
function t(lang: string, key: string): string {
  const translations: Record<string, Record<string, string>> = {
    title: {
      es: "Planes y Precios",
      en: "Plans & Pricing",
      "pt-BR": "Planos e Preços",
      "pt-PT": "Planos e Preços",
    },
    subtitle: {
      es: "Elige el plan que mejor se adapte a ti",
      en: "Choose the plan that best fits you",
      "pt-BR": "Escolha o plano que melhor se adapta a você",
      "pt-PT": "Escolha o plano que melhor se adapta a si",
    },
    free: { es: "GRATIS", en: "FREE", "pt-BR": "GRÁTIS", "pt-PT": "GRÁTIS" },
    premium: { es: "PREMIUM", en: "PREMIUM", "pt-BR": "PREMIUM", "pt-PT": "PREMIUM" },
    enterprise: { es: "ENTERPRISE", en: "ENTERPRISE", "pt-BR": "ENTERPRISE", "pt-PT": "ENTERPRISE" },
    freePrice: { es: "0 €/mes", en: "€0/month", "pt-BR": "€0/mês", "pt-PT": "€0/mês" },
    premiumPrice: { es: "9,99 €/mes", en: "€9.99/month", "pt-BR": "€9,99/mês", "pt-PT": "€9,99/mês" },
    enterprisePrice: { es: "Personalizado", en: "Custom", "pt-BR": "Personalizado", "pt-PT": "Personalizado" },
    freeIdeal: {
      es: "Ideal para usuarios individuales que quieren probar",
      en: "Ideal for individual users who want to try",
      "pt-BR": "Ideal para usuários individuais que querem experimentar",
      "pt-PT": "Ideal para utilizadores individuais que querem experimentar",
    },
    premiumIdeal: {
      es: "Ideal para usuarios comprometidos con su formación en IA",
      en: "Ideal for users committed to their AI training",
      "pt-BR": "Ideal para usuários comprometidos com sua formação em IA",
      "pt-PT": "Ideal para utilizadores comprometidos com a sua formação em IA",
    },
    enterpriseIdeal: {
      es: "Ideal para empresas, instituciones educativas y organizaciones",
      en: "Ideal for companies, educational institutions and organizations",
      "pt-BR": "Ideal para empresas, instituições educacionais e organizações",
      "pt-PT": "Ideal para empresas, instituições educativas e organizações",
    },
    startFree: { es: "Empezar gratis", en: "Start free", "pt-BR": "Começar grátis", "pt-PT": "Começar grátis" },
    getPremium: { es: "Obtener Premium", en: "Get Premium", "pt-BR": "Obter Premium", "pt-PT": "Obter Premium" },
    contactUs: { es: "Contactar", en: "Contact us", "pt-BR": "Contactar", "pt-PT": "Contactar" },
    popular: { es: "MÁS POPULAR", en: "MOST POPULAR", "pt-BR": "MAIS POPULAR", "pt-PT": "MAIS POPULAR" },
    features: { es: "Características", en: "Features", "pt-BR": "Características", "pt-PT": "Características" },
    showAll: { es: "Ver todas las características", en: "Show all features", "pt-BR": "Ver todas as características", "pt-PT": "Ver todas as características" },
    hideDetails: { es: "Ocultar detalles", en: "Hide details", "pt-BR": "Ocultar detalhes", "pt-PT": "Ocultar detalhes" },
    perMonth: { es: "/mes", en: "/month", "pt-BR": "/mês", "pt-PT": "/mês" },
    no: { es: "No", en: "No", "pt-BR": "Não", "pt-PT": "Não" },
    comparisonTitle: {
      es: "Comparación detallada",
      en: "Detailed comparison",
      "pt-BR": "Comparação detalhada",
      "pt-PT": "Comparação detalhada",
    },
  };
  return translations[key]?.[lang] || translations[key]?.es || key;
}

// ─── FEATURE CELL ───
function FeatureCell({ value, label, lang, planType }: { value: string | boolean; label?: Record<string, string>; lang: string; planType: 'free' | 'premium' | 'enterprise' }) {
  if (label && label[lang]) {
    return <span className="text-sm sm:text-base text-white/80">{label[lang]}</span>;
  }
  if (typeof value === 'boolean') {
    return value ? (
      <Check size={22} className="text-emerald-400 mx-auto" strokeWidth={3} />
    ) : (
      <X size={22} className="text-white/20 mx-auto" strokeWidth={2} />
    );
  }
  return <span className="text-sm sm:text-base text-white/80">{value}</span>;
}

// ─── MAIN COMPONENT ───
export function PricingPlans({ embedded = false }: { embedded?: boolean }) {
  const { lang } = usePRDLanguage();
  const [showAllFeatures, setShowAllFeatures] = useState(false);
  const displayedFeatures = showAllFeatures ? PLAN_FEATURES : PLAN_FEATURES.slice(0, 7);

  return (
    <div className={`${embedded ? 'flex-1 overflow-y-auto' : 'min-h-screen bg-[#0b0f19]'}`}>
      <div className="max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        {/* ─── HEADER ─── */}
        <div className="text-center mb-10 sm:mb-14">
          <h1 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl text-white mb-4">
            {t(lang, 'title')}
          </h1>
          <p className="text-white/60 text-lg sm:text-xl max-w-xl mx-auto">
            {t(lang, 'subtitle')}
          </p>
        </div>

        {/* ─── PLAN CARDS (3 columns) ─── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 mb-12 sm:mb-16">

          {/* ── GRATIS ── */}
          <div className="relative bg-[#0f1520] border border-white/[0.08] rounded-2xl p-6 sm:p-8 flex flex-col">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 rounded-xl bg-white/[0.06] flex items-center justify-center">
                <Zap size={24} className="text-white/60" />
              </div>
              <div>
                <h2 className="font-display font-black text-xl sm:text-2xl text-white">
                  {t(lang, 'free')}
                </h2>
              </div>
            </div>
            <div className="mb-5">
              <span className="font-display font-black text-4xl sm:text-5xl text-white">0 €</span>
              <span className="text-white/40 text-lg ml-1">{t(lang, 'perMonth')}</span>
            </div>
            <p className="text-white/50 text-sm sm:text-base leading-relaxed mb-6 flex-1">
              {t(lang, 'freeIdeal')}
            </p>
            <a
              href="/chat"
              className="block w-full text-center py-4 rounded-xl text-base sm:text-lg font-bold bg-white/[0.08] text-white hover:bg-white/[0.14] border border-white/[0.1] transition-all"
            >
              {t(lang, 'startFree')}
            </a>
          </div>

          {/* ── PREMIUM ── */}
          <div className="relative bg-gradient-to-b from-[#D4A843]/[0.08] to-[#0f1520] border-2 border-[#D4A843]/40 rounded-2xl p-6 sm:p-8 flex flex-col ring-1 ring-[#D4A843]/20">
            {/* Popular badge */}
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-5 py-1.5 bg-[#D4A843] text-black text-xs sm:text-sm font-black rounded-full tracking-wider shadow-lg shadow-[#D4A843]/30">
              {t(lang, 'popular')}
            </div>
            <div className="flex items-center gap-3 mb-5 mt-2">
              <div className="w-12 h-12 rounded-xl bg-[#D4A843]/15 flex items-center justify-center">
                <Crown size={24} className="text-[#D4A843]" />
              </div>
              <div>
                <h2 className="font-display font-black text-xl sm:text-2xl text-[#D4A843]">
                  {t(lang, 'premium')}
                </h2>
              </div>
            </div>
            <div className="mb-5">
              <span className="font-display font-black text-4xl sm:text-5xl text-white">9,99 €</span>
              <span className="text-white/40 text-lg ml-1">{t(lang, 'perMonth')}</span>
            </div>
            <p className="text-[#D4A843]/70 text-sm sm:text-base leading-relaxed mb-6 flex-1">
              {t(lang, 'premiumIdeal')}
            </p>
            <a
              href="mailto:info@acnb.es?subject=LINCE%20IA%20Premium"
              className="block w-full text-center py-4 rounded-xl text-base sm:text-lg font-bold bg-[#D4A843] text-black hover:brightness-110 transition-all shadow-lg shadow-[#D4A843]/20"
            >
              {t(lang, 'getPremium')}
            </a>
          </div>

          {/* ── ENTERPRISE ── */}
          <div className="relative bg-[#0f1520] border border-[#00E5FF]/20 rounded-2xl p-6 sm:p-8 flex flex-col">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 rounded-xl bg-[#00E5FF]/10 flex items-center justify-center">
                <Building2 size={24} className="text-[#00E5FF]" />
              </div>
              <div>
                <h2 className="font-display font-black text-xl sm:text-2xl text-[#00E5FF]">
                  {t(lang, 'enterprise')}
                </h2>
              </div>
            </div>
            <div className="mb-5">
              <span className="font-display font-black text-3xl sm:text-4xl text-white">{t(lang, 'enterprisePrice')}</span>
            </div>
            <p className="text-[#00E5FF]/60 text-sm sm:text-base leading-relaxed mb-6 flex-1">
              {t(lang, 'enterpriseIdeal')}
            </p>
            <a
              href="mailto:info@acnb.es?subject=LINCE%20IA%20Enterprise"
              className="block w-full text-center py-4 rounded-xl text-base sm:text-lg font-bold bg-[#00E5FF]/15 text-[#00E5FF] hover:bg-[#00E5FF]/25 border border-[#00E5FF]/30 transition-all"
            >
              {t(lang, 'contactUs')}
            </a>
          </div>
        </div>

        {/* ─── COMPARISON TABLE ─── */}
        <div className="bg-[#0f1520] border border-white/[0.08] rounded-2xl overflow-hidden">
          <div className="p-5 sm:p-6 border-b border-white/[0.06]">
            <h2 className="font-display font-black text-xl sm:text-2xl text-white">
              {t(lang, 'comparisonTitle')}
            </h2>
          </div>

          {/* Table header */}
          <div className="grid grid-cols-4 gap-0 border-b border-white/[0.06] bg-white/[0.02]">
            <div className="p-4 sm:p-5 text-sm sm:text-base font-bold text-white/50">
              {t(lang, 'features')}
            </div>
            <div className="p-4 sm:p-5 text-center">
              <span className="text-sm sm:text-base font-black text-white/70">{t(lang, 'free')}</span>
            </div>
            <div className="p-4 sm:p-5 text-center bg-[#D4A843]/[0.04]">
              <span className="text-sm sm:text-base font-black text-[#D4A843]">{t(lang, 'premium')}</span>
            </div>
            <div className="p-4 sm:p-5 text-center">
              <span className="text-sm sm:text-base font-black text-[#00E5FF]">{t(lang, 'enterprise')}</span>
            </div>
          </div>

          {/* Table rows */}
          {displayedFeatures.map((feature, idx) => (
            <div
              key={feature.key}
              className={`grid grid-cols-4 gap-0 ${idx < displayedFeatures.length - 1 ? 'border-b border-white/[0.04]' : ''} hover:bg-white/[0.02] transition-colors`}
            >
              <div className="p-4 sm:p-5 flex items-center">
                <span className="text-sm sm:text-base font-medium text-white/70">
                  {feature.label[lang] || feature.label.es}
                </span>
              </div>
              <div className="p-4 sm:p-5 flex items-center justify-center text-center">
                <FeatureCell value={feature.free} label={feature.freeLabel} lang={lang} planType="free" />
              </div>
              <div className="p-4 sm:p-5 flex items-center justify-center text-center bg-[#D4A843]/[0.02]">
                <FeatureCell value={feature.premium} label={feature.premiumLabel} lang={lang} planType="premium" />
              </div>
              <div className="p-4 sm:p-5 flex items-center justify-center text-center">
                <FeatureCell value={feature.enterprise} label={feature.enterpriseLabel} lang={lang} planType="enterprise" />
              </div>
            </div>
          ))}

          {/* Show more/less toggle */}
          {PLAN_FEATURES.length > 7 && (
            <button
              onClick={() => setShowAllFeatures(!showAllFeatures)}
              className="w-full p-4 sm:p-5 flex items-center justify-center gap-2 text-[#00E5FF] hover:text-[#00E5FF]/80 hover:bg-white/[0.03] transition-all text-sm sm:text-base font-bold border-t border-white/[0.04]"
            >
              {showAllFeatures ? (
                <>
                  <ChevronUp size={18} />
                  {t(lang, 'hideDetails')}
                </>
              ) : (
                <>
                  <ChevronDown size={18} />
                  {t(lang, 'showAll')}
                </>
              )}
            </button>
          )}
        </div>

        {/* ─── IDEAL FOR SECTION ─── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-10">
          <div className="bg-[#0f1520] border border-white/[0.06] rounded-2xl p-5 sm:p-6 text-center">
            <Zap size={32} className="text-white/40 mx-auto mb-3" />
            <p className="text-white/60 text-sm sm:text-base leading-relaxed">
              {t(lang, 'freeIdeal')}
            </p>
          </div>
          <div className="bg-[#0f1520] border border-[#D4A843]/15 rounded-2xl p-5 sm:p-6 text-center">
            <Crown size={32} className="text-[#D4A843] mx-auto mb-3" />
            <p className="text-[#D4A843]/70 text-sm sm:text-base leading-relaxed">
              {t(lang, 'premiumIdeal')}
            </p>
          </div>
          <div className="bg-[#0f1520] border border-[#00E5FF]/15 rounded-2xl p-5 sm:p-6 text-center">
            <Building2 size={32} className="text-[#00E5FF] mx-auto mb-3" />
            <p className="text-[#00E5FF]/60 text-sm sm:text-base leading-relaxed">
              {t(lang, 'enterpriseIdeal')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PricingPlans;

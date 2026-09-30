/**
 * P2-7: Footer component extracted from Home.tsx
 */
import { usePRDLanguage, tl} from "@/contexts/PRDLanguageContext";
import { APP_VERSION, APP_BUILD_DATE } from "@/lib/gameConstants";

export function Footer() {
  const { t, tData, lang } = usePRDLanguage();
  return (
    <footer className="border-t border-white/[0.06]" role="contentinfo">
      <div className="py-12">
        <div className="container">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-8 mb-6 sm:mb-10">
            <div>
              <p className="font-display font-bold text-xl text-white mb-2">
                <span className="text-[#00E5FF]">LINCE</span><span className="text-[#D4A843] text-xs align-super">&reg;</span>
              </p>
              <p className="text-[#B0B0B0] text-sm mb-3">{t('hero.subtitle').split(' — ')[0] || 'Aprende IA Jugando'}</p>
              <p className="text-[#B0B0B0]/50 text-xs leading-relaxed">{tData('footer.legalText') as string}</p>
            </div>
            <div>
              <h4 className="font-display font-bold text-white text-sm mb-3">{tl(lang, { es: 'Legal', en: 'Legal', zh: '法律', 'pt-BR': 'Legal', 'pt-PT': 'Legal' })}</h4>
              <div className="space-y-2">
                <a href="/aviso-legal" className="block text-[#00E5FF] text-xs hover:underline">{tl(lang, { es: 'Legal', en: 'Legal', zh: '法律', 'pt-BR': 'Legal', 'pt-PT': 'Legal' })}</a>
                <a href="/aviso-legal#privacidad" className="block text-[#00E5FF] text-xs hover:underline">{tl(lang, { es: 'Política de Privacidad', en: 'Privacy Policy', zh: '隐私政策', 'pt-BR': 'Política de Privacidad', 'pt-PT': 'Política de Privacidad' })}</a>
                <a href="/aviso-legal#cookies" className="block text-[#00E5FF] text-xs hover:underline">{tl(lang, { es: 'Política de Cookies', en: 'Cookie Policy', zh: 'Cookie政策', 'pt-BR': 'Política de Cookies', 'pt-PT': 'Política de Cookies' })}</a>
                <a href="/aviso-legal#terminos" className="block text-[#00E5FF] text-xs hover:underline">{tl(lang, { es: 'Términos y Condiciones', en: 'Terms & Conditions', zh: '条款和条件', 'pt-BR': 'Términos y Condiciones', 'pt-PT': 'Términos y Condiciones' })}</a>
              </div>
              <p className="text-[#B0B0B0]/60 text-xs mt-2">Web: <a href="https://www.acnb.es" target="_blank" rel="noopener noreferrer" className="text-[#00E5FF] hover:underline">www.acnb.es</a></p>
            </div>
            <div>
              <h4 className="font-display font-bold text-white text-sm mb-3">{tData('footer.ipProtection') as string}</h4>
              <p className="text-[#B0B0B0]/60 text-xs leading-relaxed">{tData('footer.ipText') as string}</p>
            </div>
          </div>
          <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-6" />
          <div className="flex flex-col items-center gap-2 text-center">
            <p className="text-[#B0B0B0]/40 text-[10px]">{t('common.copyright')}</p>
            <p className="text-[#B0B0B0]/30 text-[10px] italic">{t('hero.subtitle').split(' — ')[0] || ''}</p>
            <p className="text-[#00E5FF]/30 text-[10px] font-mono mt-1">
              LINCE v{APP_VERSION} · {tl(lang, { es: 'Build', en: 'Build', zh: '构建', 'pt-BR': 'Build', 'pt-PT': 'Build' })} {APP_BUILD_DATE}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

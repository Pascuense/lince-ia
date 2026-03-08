/**
 * P2-9: NextStepFooter — Contextual footer that suggests the next action
 * Based on current page, shows a relevant CTA to keep the user engaged.
 */
import { usePRDLanguage, tl, type PRDLanguage } from "@/contexts/PRDLanguageContext";
import { useProgressiveUnlock } from "@/hooks/useProgressiveUnlock";
import { ArrowRight, Lock, Sparkles, Gamepad2, Palette, Brain, Globe, Swords, GraduationCap } from "lucide-react";

interface NextStep {
  icon: React.ReactNode;
  label: string;
  description: string;
  href: string;
  color: string;
  locked?: boolean;
}

import type { UnlockState } from "@/hooks/useProgressiveUnlock";

const STEP_MAP: Record<string, (lang: PRDLanguage, unlocks: UnlockState) => NextStep> = {
  "/jugar": (lang, unlocks) => ({
    icon: <Sparkles className="w-5 h-5" />,
    label: tl(lang, { es: 'Crear Imagen', en: 'Create Image', zh: '创建图像', 'pt-BR': 'Criar Imagem', 'pt-PT': 'Criar Imagem' }),
    description: tl(lang, { es: 'Crea imágenes con IA usando 4 campos simples', en: 'Create AI images with 4 simple fields', zh: '用4个简单字段创建AI图像', 'pt-BR': 'Crie imagens com IA usando 4 campos simples', 'pt-PT': 'Crie imagens com IA usando 4 campos simples' }),
    href: "/prompt-studio",
    color: "#9C27B0",
  }),
  "/prompt-studio": (lang, unlocks) => ({
    icon: <Brain className="w-5 h-5" />,
    label: tl(lang, { es: 'Aprender Prompts', en: 'Learn Prompts', zh: '学习提示词', 'pt-BR': 'Aprender Prompts', 'pt-PT': 'Aprender Prompts' }),
    description: tl(lang, { es: '6 modos de juego competitivos para dominar prompts', en: '6 competitive game modes to master prompts', zh: '6种竞技游戏模式掌握提示', 'pt-BR': '6 modos de jogo competitivos para dominar prompts', 'pt-PT': '6 modos de jogo competitivos para dominar prompts' }),
    href: "/promptear",
    color: "#7C3AED",
  }),
  "/promptear": (lang) => ({
    icon: <Palette className="w-5 h-5" />,
    label: "Mi Avatar",
    description: tl(lang, { es: 'Diseña tu avatar único con IA', en: 'Design your unique AI avatar', zh: '设计你独特的AI角色', 'pt-BR': 'Desenhe seu avatar único com IA', 'pt-PT': 'Desenhe o seu avatar único com IA' }),
    href: "/lincelin",
    color: "#EC4899",
  }),
  "/lincelin": (lang) => ({
    icon: <Gamepad2 className="w-5 h-5" />,
    label: tl(lang, { es: 'Conoce los Personajes', en: 'Meet the Characters', zh: '认识角色', 'pt-BR': 'Conheça os Personagens', 'pt-PT': 'Conheça as Personagens' }),
    description: tl(lang, { es: 'Chatea con los 65 avatares únicos de LINCE', en: 'Chat with 65 unique LINCE avatars', zh: '与65个独特的LINCE角色聊天', 'pt-BR': 'Converse com os 65 avatares únicos do LINCE', 'pt-PT': 'Converse com os 65 avatares únicos do LINCE' }),
    href: "/personajes",
    color: "#FFB300",
  }),
  "/personajes": (lang, unlocks) => ({
    icon: <Sparkles className="w-5 h-5" />,
    label: tl(lang, { es: 'Herramientas IA', en: 'AI Tools', zh: 'AI工具', 'pt-BR': 'Ferramentas IA', 'pt-PT': 'Ferramentas IA' }),
    description: tl(lang, { es: 'Descubre herramientas y recursos de IA', en: 'Discover AI tools and resources', zh: '发现AI工具和资源', 'pt-BR': 'Descubra ferramentas e recursos de IA', 'pt-PT': 'Descubra ferramentas e recursos de IA' }),
    href: "/arsenal-ia",
    color: "#00E5FF",
  }),
  "/arsenal-ia": (lang, unlocks) => ({
    icon: <Globe className="w-5 h-5" />,
    label: tl(lang, { es: 'Mundo LINCE', en: 'LINCE World', zh: 'LINCE世界', 'pt-BR': 'Mundo LINCE', 'pt-PT': 'Mundo LINCE' }),
    description: tl(lang, { es: 'Construye tu ciudad IA y compite', en: 'Build your AI city and compete', zh: '建造你的AI城市并竞争', 'pt-BR': 'Construa sua cidade IA e compita', 'pt-PT': 'Construa a sua cidade IA e compita' }),
    href: "/mundo",
    color: "#FFB300",
    locked: !unlocks.mundo,
  }),
  "/mundo": (lang, unlocks) => ({
    icon: <Swords className="w-5 h-5" />,
    label: "Batallas",
    description: tl(lang, { es: 'Desafíos cooperativos épicos de IA', en: 'Epic cooperative AI challenges', zh: '史诗级合作AI挑战', 'pt-BR': 'Desafios cooperativos épicos de IA', 'pt-PT': 'Desafios cooperativos épicos de IA' }),
    href: "/raids",
    color: "#EF4444",
    locked: !unlocks.raids,
  }),
  "/raids": (lang, unlocks) => ({
    icon: <GraduationCap className="w-5 h-5" />,
    label: tl(lang, { es: 'Cursos', en: 'Courses', zh: '课程', 'pt-BR': 'Cursos', 'pt-PT': 'Cursos' }),
    description: tl(lang, { es: 'Rutas de aprendizaje estructuradas de IA', en: 'Structured AI learning paths', zh: '结构化AI学习路径', 'pt-BR': 'Rotas de aprendizagem estruturadas de IA', 'pt-PT': 'Rotas de aprendizagem estruturadas de IA' }),
    href: "/academia",
    color: "#10B981",
    locked: !unlocks.academia,
  }),
};

// Default fallback
const DEFAULT_STEP = (lang: PRDLanguage, _unlocks?: UnlockState): NextStep => ({
  icon: <Gamepad2 className="w-5 h-5" />,
  label: tl(lang, { es: 'Juega a LINCE', en: 'Play LINCE', zh: '玩LINCE', 'pt-BR': 'Jogue LINCE', 'pt-PT': 'Jogue LINCE' }),
  description: tl(lang, { es: 'Comienza tu aventura de aprendizaje de IA', en: 'Start your AI learning adventure', zh: '开始你的AI学习冒险', 'pt-BR': 'Comece sua aventura de aprendizagem de IA', 'pt-PT': 'Comece a sua aventura de aprendizagem de IA' }),
  href: "/jugar",
  color: "#00E5FF",
});

export function NextStepFooter({ currentPath }: { currentPath: string }) {
  const { lang } = usePRDLanguage();
  const { unlocks } = useProgressiveUnlock();

  const stepFn = STEP_MAP[currentPath];
  const step = stepFn ? stepFn(lang, unlocks) : DEFAULT_STEP(lang);

  if (step.locked) {
    return (
      <div className="mt-8 mb-4 mx-auto max-w-2xl">
        <div className="flex items-center gap-4 px-6 py-4 bg-white/[0.02] border border-white/[0.06] rounded-2xl">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gray-500/10 text-gray-500">
            <Lock className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-500 font-['Space_Grotesk']">{step.label}</p>
            <p className="text-xs text-gray-600 truncate">
              {tl(lang, { es: 'Completa más niveles para desbloquear', en: 'Complete more levels to unlock', zh: '完成更多关卡解锁', 'pt-BR': 'Complete mais níveis para desbloquear', 'pt-PT': 'Complete mais níveis para desbloquear' })}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8 mb-4 mx-auto max-w-2xl">
      <a
        href={step.href}
        className="flex items-center gap-4 px-6 py-4 bg-white/[0.02] border border-white/[0.06] rounded-2xl hover:bg-white/[0.04] hover:border-white/[0.12] transition-all duration-300 group"
      >
        <div
          className="flex items-center justify-center w-10 h-10 rounded-xl"
          style={{ backgroundColor: `${step.color}15`, color: step.color }}
        >
          {step.icon}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-white font-['Space_Grotesk']">
            {tl(lang, { es: 'Siguiente:', en: 'Next:', zh: '下一步:', 'pt-BR': 'Próximo:', 'pt-PT': 'Próximo:' })}{' '}
            <span style={{ color: step.color }}>{step.label}</span>
          </p>
          <p className="text-xs text-[#B0B0B0] truncate">{step.description}</p>
        </div>
        <ArrowRight
          className="w-5 h-5 text-[#B0B0B0] group-hover:translate-x-1 transition-transform"
          style={{ color: step.color }}
        />
      </a>
    </div>
  );
}

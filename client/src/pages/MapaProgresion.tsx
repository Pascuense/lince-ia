import { useState, useMemo } from "react";
import { useGame } from "@/contexts/GameContext";
import { usePRDLanguage } from "@/contexts/PRDLanguageContext";
import { GlobalNavBar } from "@/components/GlobalNavBar";
import { BackButton } from "@/components/BackButton";
import RequireLogin from "@/components/RequireLogin";
import { Link } from "wouter";
import { Map, Lock, Check, ChevronRight, Star, Sparkles, Trophy, Zap } from "lucide-react";

// ─── Skill Tree Areas ───
interface SkillArea {
  id: string;
  name: Record<string, string>;
  desc: Record<string, string>;
  icon: string;
  color: string;
  bgGradient: string;
  skills: Skill[];
  unlockRequirement: { type: "xp" | "level" | "prompts" | "none"; value: number };
}

interface Skill {
  id: string;
  name: Record<string, string>;
  desc: Record<string, string>;
  xpRequired: number;
  route?: string;
}

const SKILL_AREAS: SkillArea[] = [
  {
    id: "fundamentos",
    name: { es: "Fundamentos de IA", en: "AI Fundamentals", zh: "AI基础" },
    desc: { es: "Aprende qué es la IA, cómo funciona y por qué importa.", en: "Learn what AI is, how it works and why it matters.", zh: "了解什么是AI，它如何工作以及为什么重要。" },
    icon: "🧠",
    color: "#00E5FF",
    bgGradient: "from-cyan-500/10 to-cyan-600/5",
    unlockRequirement: { type: "none", value: 0 },
    skills: [
      { id: "intro_ia", name: { es: "Intro a la IA", en: "Intro to AI", zh: "AI入门" }, desc: { es: "Conceptos básicos de inteligencia artificial", en: "Basic AI concepts", zh: "人工智能基本概念" }, xpRequired: 0, route: "/como-jugar" },
      { id: "tipos_ia", name: { es: "Tipos de IA", en: "Types of AI", zh: "AI类型" }, desc: { es: "IA generativa, predictiva, clasificadora...", en: "Generative, predictive, classifier AI...", zh: "生成式、预测式、分类器AI..." }, xpRequired: 50 },
      { id: "llm_basics", name: { es: "LLMs Básico", en: "LLMs Basics", zh: "LLM基础" }, desc: { es: "Cómo funcionan los modelos de lenguaje", en: "How language models work", zh: "语言模型如何工作" }, xpRequired: 100 },
      { id: "historia_ia", name: { es: "Historia de la IA", en: "History of AI", zh: "AI历史" }, desc: { es: "De Turing a GPT-5", en: "From Turing to GPT-5", zh: "从图灵到GPT-5" }, xpRequired: 150 },
      { id: "etica_ia", name: { es: "Ética en IA", en: "AI Ethics", zh: "AI伦理" }, desc: { es: "Sesgos, privacidad y uso responsable", en: "Bias, privacy and responsible use", zh: "偏见、隐私和负责任使用" }, xpRequired: 200 },
      { id: "modelos_open", name: { es: "Modelos Open Source", en: "Open Source Models", zh: "开源模型" }, desc: { es: "Llama, Mistral, Gemma y más", en: "Llama, Mistral, Gemma and more", zh: "Llama、Mistral、Gemma等" }, xpRequired: 250 },
      { id: "ia_vs_humanos", name: { es: "IA vs Humanos", en: "AI vs Humans", zh: "AI对比人类" }, desc: { es: "Fortalezas y limitaciones de la IA", en: "AI strengths and limitations", zh: "AI的优势和局限" }, xpRequired: 300 },
      { id: "futuro_ia", name: { es: "Futuro de la IA", en: "Future of AI", zh: "AI的未来" }, desc: { es: "AGI, singularidad y predicciones", en: "AGI, singularity and predictions", zh: "AGI、奇点和预测" }, xpRequired: 400 },
    ],
  },
  {
    id: "prompts",
    name: { es: "Arte del Prompt", en: "Art of Prompting", zh: "提示词艺术" },
    desc: { es: "Domina la escritura de prompts efectivos para cualquier IA.", en: "Master writing effective prompts for any AI.", zh: "掌握为任何AI编写有效提示词。" },
    icon: "✍️",
    color: "#D4A843",
    bgGradient: "from-amber-500/10 to-amber-600/5",
    unlockRequirement: { type: "xp", value: 50 },
    skills: [
      { id: "primer_prompt", name: { es: "Tu Primer Prompt", en: "Your First Prompt", zh: "你的第一个提示词" }, desc: { es: "Escribe y evalúa tu primer prompt", en: "Write and evaluate your first prompt", zh: "编写并评估你的第一个提示词" }, xpRequired: 0, route: "/jugar" },
      { id: "estructura", name: { es: "Estructura de Prompts", en: "Prompt Structure", zh: "提示词结构" }, desc: { es: "Rol, contexto, instrucción, formato", en: "Role, context, instruction, format", zh: "角色、上下文、指令、格式" }, xpRequired: 100, route: "/jugar" },
      { id: "chain_of_thought", name: { es: "Chain of Thought", en: "Chain of Thought", zh: "思维链" }, desc: { es: "Razonamiento paso a paso", en: "Step-by-step reasoning", zh: "逐步推理" }, xpRequired: 200 },
      { id: "few_shot", name: { es: "Few-Shot Learning", en: "Few-Shot Learning", zh: "少样本学习" }, desc: { es: "Enseña con ejemplos", en: "Teach with examples", zh: "用示例教学" }, xpRequired: 300 },
      { id: "system_prompts", name: { es: "System Prompts", en: "System Prompts", zh: "系统提示词" }, desc: { es: "Crea personalidades y roles para la IA", en: "Create AI personalities and roles", zh: "为AI创建个性和角色" }, xpRequired: 400, route: "/prompt-profesional" },
      { id: "prompt_negativo", name: { es: "Prompts Negativos", en: "Negative Prompts", zh: "负面提示词" }, desc: { es: "Lo que NO debe hacer la IA", en: "What AI should NOT do", zh: "AI不应该做什么" }, xpRequired: 500 },
      { id: "mega_prompts", name: { es: "Mega Prompts", en: "Mega Prompts", zh: "超级提示词" }, desc: { es: "Prompts complejos de 500+ palabras", en: "Complex 500+ word prompts", zh: "复杂的500+字提示词" }, xpRequired: 600 },
      { id: "prompt_chains", name: { es: "Cadenas de Prompts", en: "Prompt Chains", zh: "提示词链" }, desc: { es: "Secuencias de prompts encadenados", en: "Sequences of chained prompts", zh: "链式提示词序列" }, xpRequired: 750 },
      { id: "prompt_testing", name: { es: "Testing de Prompts", en: "Prompt Testing", zh: "提示词测试" }, desc: { es: "Evalúa y optimiza tus prompts", en: "Evaluate and optimize your prompts", zh: "评估和优化你的提示词" }, xpRequired: 850 },
      { id: "prompt_maestro", name: { es: "Maestro de Prompts", en: "Prompt Master", zh: "提示词大师" }, desc: { es: "Dominio total del arte del prompt", en: "Total mastery of prompt art", zh: "完全掌握提示词艺术" }, xpRequired: 1000, route: "/prompt-profesional" },
    ],
  },
  {
    id: "imagen",
    name: { es: "IA para Imágenes", en: "AI for Images", zh: "图像AI" },
    desc: { es: "Genera y edita imágenes con inteligencia artificial.", en: "Generate and edit images with AI.", zh: "用AI生成和编辑图像。" },
    icon: "🎨",
    color: "#8B5CF6",
    bgGradient: "from-purple-500/10 to-purple-600/5",
    unlockRequirement: { type: "xp", value: 200 },
    skills: [
      { id: "imagelin_basico", name: { es: "Crear Imagen Básico", en: "Create Image Basics", zh: "创建图像基础" }, desc: { es: "Genera tu primera imagen con IA", en: "Generate your first AI image", zh: "生成你的第一张AI图像" }, xpRequired: 0, route: "/prompt-studio" },
      { id: "estilos_arte", name: { es: "Estilos Artísticos", en: "Art Styles", zh: "艺术风格" }, desc: { es: "Domina diferentes estilos visuales", en: "Master different visual styles", zh: "掌握不同的视觉风格" }, xpRequired: 150 },
      { id: "composicion", name: { es: "Composición Avanzada", en: "Advanced Composition", zh: "高级构图" }, desc: { es: "Iluminación, perspectiva, color", en: "Lighting, perspective, color", zh: "光线、透视、色彩" }, xpRequired: 300 },
      { id: "fotorrealismo", name: { es: "Fotorrealismo", en: "Photorealism", zh: "写实主义" }, desc: { es: "Imágenes que parecen fotos reales", en: "Images that look like real photos", zh: "看起来像真实照片的图像" }, xpRequired: 450 },
      { id: "edicion_ia", name: { es: "Edición con IA", en: "AI Editing", zh: "AI编辑" }, desc: { es: "Inpainting, outpainting, upscale", en: "Inpainting, outpainting, upscale", zh: "修复、扩展、放大" }, xpRequired: 600 },
      { id: "branding_visual", name: { es: "Branding Visual", en: "Visual Branding", zh: "视觉品牌" }, desc: { es: "Logos, paletas, identidad visual", en: "Logos, palettes, visual identity", zh: "标志、调色板、视觉身份" }, xpRequired: 750 },
      { id: "video_ia", name: { es: "Video con IA", en: "AI Video", zh: "AI视频" }, desc: { es: "Genera y edita video con IA", en: "Generate and edit video with AI", zh: "用AI生成和编辑视频" }, xpRequired: 900 },
    ],
  },
  {
    id: "marketing",
    name: { es: "IA para Marketing", en: "AI for Marketing", zh: "营销AI" },
    desc: { es: "Usa IA para crear campañas, copies y estrategias.", en: "Use AI to create campaigns, copies and strategies.", zh: "使用AI创建活动、文案和策略。" },
    icon: "📢",
    color: "#10B981",
    bgGradient: "from-emerald-500/10 to-emerald-600/5",
    unlockRequirement: { type: "xp", value: 300 },
    skills: [
      { id: "copy_ia", name: { es: "Copywriting con IA", en: "AI Copywriting", zh: "AI文案写作" }, desc: { es: "Genera textos persuasivos", en: "Generate persuasive texts", zh: "生成有说服力的文本" }, xpRequired: 0 },
      { id: "rrss_ia", name: { es: "RRSS con IA", en: "Social Media with AI", zh: "AI社交媒体" }, desc: { es: "Contenido para redes sociales", en: "Social media content", zh: "社交媒体内容" }, xpRequired: 200 },
      { id: "email_ia", name: { es: "Email Marketing IA", en: "AI Email Marketing", zh: "AI邮件营销" }, desc: { es: "Campañas de email automatizadas", en: "Automated email campaigns", zh: "自动化邮件营销" }, xpRequired: 400 },
      { id: "seo_ia", name: { es: "SEO con IA", en: "AI SEO", zh: "AI SEO" }, desc: { es: "Optimiza contenido para buscadores", en: "Optimize content for search engines", zh: "为搜索引擎优化内容" }, xpRequired: 500 },
      { id: "video_marketing", name: { es: "Video Marketing IA", en: "AI Video Marketing", zh: "AI视频营销" }, desc: { es: "Guiones y storyboards con IA", en: "Scripts and storyboards with AI", zh: "用AI创建脚本和故事板" }, xpRequired: 600 },
      { id: "landing_pages", name: { es: "Landing Pages IA", en: "AI Landing Pages", zh: "AI着陆页" }, desc: { es: "Crea landing pages que convierten", en: "Create landing pages that convert", zh: "创建转化着陆页" }, xpRequired: 750 },
      { id: "analytics_ia", name: { es: "Analytics con IA", en: "AI Analytics", zh: "AI分析" }, desc: { es: "Interpreta datos de marketing con IA", en: "Interpret marketing data with AI", zh: "用AI解读营销数据" }, xpRequired: 850 },
      { id: "growth_hacking", name: { es: "Growth Hacking IA", en: "AI Growth Hacking", zh: "AI增长黑客" }, desc: { es: "Estrategias de crecimiento con IA", en: "Growth strategies with AI", zh: "用AI实现增长策略" }, xpRequired: 1000 },
    ],
  },
  {
    id: "codigo",
    name: { es: "IA para Código", en: "AI for Code", zh: "编程AI" },
    desc: { es: "Programa con asistencia de IA, desde cero hasta producción.", en: "Code with AI assistance, from scratch to production.", zh: "在AI辅助下编程，从零到生产。" },
    icon: "💻",
    color: "#F97316",
    bgGradient: "from-orange-500/10 to-orange-600/5",
    unlockRequirement: { type: "xp", value: 500 },
    skills: [
      { id: "code_basics", name: { es: "Código con IA Básico", en: "Basic AI Coding", zh: "基础AI编程" }, desc: { es: "Genera código simple con prompts", en: "Generate simple code with prompts", zh: "用提示词生成简单代码" }, xpRequired: 0 },
      { id: "debug_ia", name: { es: "Debugging con IA", en: "AI Debugging", zh: "AI调试" }, desc: { es: "Encuentra y corrige errores", en: "Find and fix bugs", zh: "查找和修复错误" }, xpRequired: 250 },
      { id: "app_ia", name: { es: "Apps con IA", en: "AI Apps", zh: "AI应用" }, desc: { es: "Crea aplicaciones completas", en: "Create complete applications", zh: "创建完整的应用程序" }, xpRequired: 500 },
      { id: "api_ia", name: { es: "APIs con IA", en: "AI APIs", zh: "AI API" }, desc: { es: "Integra APIs de IA en tus proyectos", en: "Integrate AI APIs in your projects", zh: "在你的项目中集成AI API" }, xpRequired: 650 },
      { id: "testing_ia", name: { es: "Testing con IA", en: "AI Testing", zh: "AI测试" }, desc: { es: "Tests automatizados con asistencia IA", en: "Automated tests with AI assistance", zh: "用AI辅助自动化测试" }, xpRequired: 800 },
      { id: "devops_ia", name: { es: "DevOps con IA", en: "AI DevOps", zh: "AI DevOps" }, desc: { es: "CI/CD y despliegue asistido por IA", en: "CI/CD and AI-assisted deployment", zh: "CI/CD和AI辅助部署" }, xpRequired: 950 },
      { id: "refactoring_ia", name: { es: "Refactoring con IA", en: "AI Refactoring", zh: "AI重构" }, desc: { es: "Mejora código existente con IA", en: "Improve existing code with AI", zh: "用AI改进现有代码" }, xpRequired: 1100 },
      { id: "arquitectura_ia", name: { es: "Arquitectura con IA", en: "AI Architecture", zh: "AI架构" }, desc: { es: "Diseña sistemas complejos con IA", en: "Design complex systems with AI", zh: "用AI设计复杂系统" }, xpRequired: 1200 },
    ],
  },
  {
    id: "negocio",
    name: { es: "IA para Negocios", en: "AI for Business", zh: "商业AI" },
    desc: { es: "Automatiza procesos, analiza datos y toma mejores decisiones.", en: "Automate processes, analyze data and make better decisions.", zh: "自动化流程、分析数据并做出更好的决策。" },
    icon: "💼",
    color: "#EC4899",
    bgGradient: "from-pink-500/10 to-pink-600/5",
    unlockRequirement: { type: "xp", value: 750 },
    skills: [
      { id: "analisis_datos", name: { es: "Análisis de Datos", en: "Data Analysis", zh: "数据分析" }, desc: { es: "Analiza datos con IA", en: "Analyze data with AI", zh: "用AI分析数据" }, xpRequired: 0 },
      { id: "automatizacion", name: { es: "Automatización", en: "Automation", zh: "自动化" }, desc: { es: "Automatiza tareas repetitivas", en: "Automate repetitive tasks", zh: "自动化重复任务" }, xpRequired: 300 },
      { id: "estrategia_ia", name: { es: "Estrategia IA", en: "AI Strategy", zh: "AI策略" }, desc: { es: "Implementa IA en tu empresa", en: "Implement AI in your company", zh: "在你的公司实施AI" }, xpRequired: 600 },
      { id: "finanzas_ia", name: { es: "Finanzas con IA", en: "AI Finance", zh: "AI财务" }, desc: { es: "Análisis financiero automatizado", en: "Automated financial analysis", zh: "自动化财务分析" }, xpRequired: 750 },
      { id: "rrhh_ia", name: { es: "RRHH con IA", en: "AI HR", zh: "AI人力资源" }, desc: { es: "Reclutamiento y gestión con IA", en: "AI recruitment and management", zh: "AI招聘和管理" }, xpRequired: 850 },
      { id: "ventas_ia", name: { es: "Ventas con IA", en: "AI Sales", zh: "AI销售" }, desc: { es: "Pipelines y CRM potenciados con IA", en: "AI-powered pipelines and CRM", zh: "AI驱动的管道和CRM" }, xpRequired: 1000 },
      { id: "legal_ia", name: { es: "Legal con IA", en: "AI Legal", zh: "AI法律" }, desc: { es: "Contratos y documentos legales con IA", en: "Contracts and legal docs with AI", zh: "用AI处理合同和法律文件" }, xpRequired: 1100 },
      { id: "emprendimiento_ia", name: { es: "Emprender con IA", en: "AI Entrepreneurship", zh: "AI创业" }, desc: { es: "Lanza tu negocio potenciado por IA", en: "Launch your AI-powered business", zh: "启动你的AI驱动业务" }, xpRequired: 1200 },
    ],
  },
];

const TT: Record<string, Record<string, string>> = {
  es: {
    title: "Mi Camino",
    subtitle: "Tu camino para dominar la IA",
    overall: "Progreso general",
    areas: "áreas",
    skills: "habilidades",
    unlocked: "Desbloqueadas",
    locked: "Bloqueadas",
    xpNeeded: "XP necesarios",
    yourXP: "Tu XP",
    start: "Empezar",
    continue: "Continuar",
    completed: "Completado",
    requiresXP: "Requiere",
    xp: "XP",
    explore: "Explorar",
  },
  en: {
    title: "My Path",
    subtitle: "Your path to mastering AI",
    overall: "Overall progress",
    areas: "areas",
    skills: "skills",
    unlocked: "Unlocked",
    locked: "Locked",
    xpNeeded: "XP needed",
    yourXP: "Your XP",
    start: "Start",
    continue: "Continue",
    completed: "Completed",
    requiresXP: "Requires",
    xp: "XP",
    explore: "Explore",
  },
  zh: {
    title: "我的路程",
    subtitle: "你掌握AI的道路",
    overall: "总体进度",
    areas: "领域",
    skills: "技能",
    unlocked: "已解锁",
    locked: "已锁定",
    xpNeeded: "需要XP",
    yourXP: "你的XP",
    start: "开始",
    continue: "继续",
    completed: "已完成",
    requiresXP: "需要",
    xp: "XP",
    explore: "探索",
  },
};

export default function MapaProgresion() {
  const { state } = useGame();
  const { lang } = usePRDLanguage();
  const l = lang as string;
  const t = (key: string) => TT[l]?.[key] || TT.es[key] || key;

  const [expandedArea, setExpandedArea] = useState<string | null>(null);

  const stats = useMemo(() => {
    const totalAreas = SKILL_AREAS.length;
    const totalSkills = SKILL_AREAS.reduce((sum, a) => sum + a.skills.length, 0);
    let unlockedAreas = 0;
    let completedSkills = 0;

    SKILL_AREAS.forEach(area => {
      const areaUnlocked = area.unlockRequirement.type === "none" || state.xp >= area.unlockRequirement.value;
      if (areaUnlocked) unlockedAreas++;
      area.skills.forEach(skill => {
        if (areaUnlocked && state.xp >= skill.xpRequired + (area.unlockRequirement.value || 0)) {
          completedSkills++;
        }
      });
    });

    return { totalAreas, totalSkills, unlockedAreas, completedSkills };
  }, [state.xp]);

  const overallProgress = Math.round((stats.completedSkills / stats.totalSkills) * 100);

  return (
    <RequireLogin>
      <div className="min-h-screen bg-[#0A0A0A]">
        <GlobalNavBar />
        <div className="container pt-20 pb-24">
          <BackButton />

          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-3 mb-3">
              <Map className="w-8 h-8 text-[#00E5FF]" />
              <h1 className="font-display font-bold text-3xl sm:text-4xl text-white">{t("title")}</h1>
            </div>
            <p className="text-[#B0B0B0] text-lg">{t("subtitle")}</p>
          </div>

          {/* Overall Progress */}
          <div className="bg-gradient-to-r from-[#1A1A2E] to-[#0F0F1A] border border-white/10 rounded-2xl p-6 mb-8">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-gray-400">{t("overall")}</span>
              <span className="font-display font-bold text-lg text-white">{overallProgress}%</span>
            </div>
            <div className="w-full h-3 bg-black/30 rounded-full overflow-hidden mb-4">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#00E5FF] to-cyan-400 transition-all duration-1000"
                style={{ width: `${overallProgress}%` }}
              />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-display font-bold text-[#00E5FF]">{state.xp}</div>
                <div className="text-xs text-gray-500">{t("yourXP")}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-display font-bold text-emerald-400">{stats.unlockedAreas}/{stats.totalAreas}</div>
                <div className="text-xs text-gray-500">{t("areas")} {t("unlocked").toLowerCase()}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-display font-bold text-amber-400">{stats.completedSkills}/{stats.totalSkills}</div>
                <div className="text-xs text-gray-500">{t("skills")}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-display font-bold text-purple-400">{state.totalPromptsWritten}</div>
                <div className="text-xs text-gray-500">Prompts</div>
              </div>
            </div>
          </div>

          {/* Skill Tree */}
          <div className="space-y-4">
            {SKILL_AREAS.map((area, areaIdx) => {
              const isUnlocked = area.unlockRequirement.type === "none" || state.xp >= area.unlockRequirement.value;
              const isExpanded = expandedArea === area.id;
              const areaSkillsDone = area.skills.filter(s => isUnlocked && state.xp >= s.xpRequired + (area.unlockRequirement.value || 0)).length;
              const areaProgress = Math.round((areaSkillsDone / area.skills.length) * 100);

              return (
                <div key={area.id} className="relative">
                  {/* Connector line */}
                  {areaIdx > 0 && (
                    <div className="absolute -top-4 left-8 w-0.5 h-4 bg-gradient-to-b from-transparent to-white/10" />
                  )}

                  <div
                    className={`bg-gradient-to-r ${area.bgGradient} border rounded-2xl overflow-hidden transition-all duration-300 cursor-pointer ${
                      isUnlocked ? "border-white/10 hover:border-white/20" : "border-white/5 opacity-60"
                    }`}
                    onClick={() => isUnlocked && setExpandedArea(isExpanded ? null : area.id)}
                  >
                    {/* Area header */}
                    <div className="p-5 flex items-center gap-4">
                      <div className={`text-3xl ${!isUnlocked ? "grayscale opacity-50" : ""}`}>{area.icon}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-display font-bold text-lg text-white truncate">
                            {area.name[l] || area.name.es}
                          </h3>
                          {!isUnlocked && <Lock className="w-4 h-4 text-gray-500 flex-shrink-0" />}
                          {areaProgress === 100 && <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />}
                        </div>
                        <p className="text-sm text-gray-400 truncate">{area.desc[l] || area.desc.es}</p>
                        {!isUnlocked && (
                          <p className="text-xs text-amber-400/70 mt-1">
                            {t("requiresXP")} {area.unlockRequirement.value} {t("xp")} ({state.xp}/{area.unlockRequirement.value})
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-3 flex-shrink-0">
                        {isUnlocked && (
                          <>
                            <div className="text-right hidden sm:block">
                              <div className="text-sm font-bold" style={{ color: area.color }}>{areaProgress}%</div>
                              <div className="text-xs text-gray-500">{areaSkillsDone}/{area.skills.length}</div>
                            </div>
                            <ChevronRight className={`w-5 h-5 text-gray-500 transition-transform ${isExpanded ? "rotate-90" : ""}`} />
                          </>
                        )}
                      </div>
                    </div>

                    {/* Progress bar */}
                    {isUnlocked && (
                      <div className="px-5 pb-1">
                        <div className="w-full h-1.5 bg-black/20 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-700"
                            style={{ width: `${areaProgress}%`, backgroundColor: area.color }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Expanded skills */}
                    {isExpanded && isUnlocked && (
                      <div className="px-5 pb-5 pt-3 space-y-2">
                        {area.skills.map((skill, skillIdx) => {
                          const skillUnlocked = state.xp >= skill.xpRequired + (area.unlockRequirement.value || 0);
                          return (
                            <div
                              key={skill.id}
                              className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${
                                skillUnlocked ? "bg-white/5" : "bg-black/20 opacity-50"
                              }`}
                            >
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                                skillUnlocked ? "bg-emerald-500/20 text-emerald-400" : "bg-gray-800 text-gray-600"
                              }`}>
                                {skillUnlocked ? <Check className="w-4 h-4" /> : <Lock className="w-3 h-3" />}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="text-sm font-medium text-white truncate">
                                  {skill.name[l] || skill.name.es}
                                </div>
                                <div className="text-xs text-gray-500 truncate">
                                  {skill.desc[l] || skill.desc.es}
                                </div>
                              </div>
                              {skill.route && skillUnlocked && (
                                <Link href={skill.route}>
                                  <button
                                    className="px-3 py-1 text-xs font-medium rounded-lg transition-colors"
                                    style={{ backgroundColor: `${area.color}20`, color: area.color }}
                                    onClick={e => e.stopPropagation()}
                                  >
                                    {t("explore")}
                                  </button>
                                </Link>
                              )}
                              {!skillUnlocked && (
                                <span className="text-xs text-gray-600 flex-shrink-0">
                                  {skill.xpRequired + (area.unlockRequirement.value || 0)} XP
                                </span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </RequireLogin>
  );
}

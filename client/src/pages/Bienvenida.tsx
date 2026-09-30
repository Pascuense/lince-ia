import { useState, useCallback, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { AVATAR_FRONTAL } from "@/lib/avatarConstants";
import {
  Sparkles,
  Gamepad2,
  Image,
  Brain,
  Users,
  Palette,
  Shield,
  Trophy,
  ArrowRight,
  ChevronRight,
  ChevronLeft,
  MessageCircle,
  Zap,
  Star,
  Coins,
  Flame,
  Swords,
  GraduationCap,
  Wand2,
  Target,
  Rocket,
  Check,
} from "lucide-react";
import { usePRDLanguage } from "@/contexts/PRDLanguageContext";

// ─── CDN IMAGES ───
const HERO_IMG = "/assets/yboYHmRuuKzxTKzs.png";

// ─── TYPES ───
interface WelcomeStep {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  features?: { icon: React.ReactNode; label: string; color: string }[];
  avatarKeys: (keyof typeof AVATAR_FRONTAL)[];
  accentColor: string;
  bgGradient: string;
  cta?: string;
}

// ─── STEPS DATA (i18n) ───
const STEPS: Record<string, WelcomeStep[]> = {
  es: [
    {
      id: "welcome",
      title: "Bienvenido a LINCE",
      subtitle: "Aprende IA Jugando",
      description:
        "La primera plataforma gamificada del mundo para aprender Inteligencia Artificial. Sin conocimientos previos. Sin complicaciones. Solo diversión y aprendizaje real.",
      avatarKeys: ["SABELIN", "PAPALIN", "CHAVALINA", "PEQUELINA", "YAYALIN"],
      accentColor: "#00E5FF",
      bgGradient: "from-cyan-950/40 via-[#0A0A0A] to-[#0A0A0A]",
    },
    {
      id: "avatars",
      title: "Conoce a tus Guías",
      subtitle: "89 Avatares con personalidad propia",
      description:
        "Cada avatar es un experto en un área diferente de la IA. Habla con ellos, pregúntales lo que quieras y aprende como si charlaras con un amigo. Desde SABELIN el sabio hasta CHAVALINA la creativa.",
      features: [
        { icon: <MessageCircle className="w-4 h-4" />, label: "Chat inteligente con cada avatar", color: "#00E5FF" },
        { icon: <Brain className="w-4 h-4" />, label: "Cada uno domina un tema diferente", color: "#D4A843" },
        { icon: <Star className="w-4 h-4" />, label: "Desbloquea nuevos compañeros", color: "#A78BFA" },
      ],
      avatarKeys: ["YAYALIN", "YAYALINA", "PAPALIN", "MAMALINA", "CHAVALIN", "CHAVALINA", "PEQUELIN", "PEQUELINA"],
      accentColor: "#D4A843",
      bgGradient: "from-amber-950/30 via-[#0A0A0A] to-[#0A0A0A]",
    },
    {
      id: "tools",
      title: "Tus Superpoderes IA",
      subtitle: "Herramientas que puedes usar ahora mismo",
      description:
        "LINCE te da acceso a herramientas reales de inteligencia artificial. Crea imágenes, diseña tu avatar, aprende a escribir prompts profesionales y explora más de 100 herramientas IA.",
      features: [
        { icon: <Image className="w-4 h-4" />, label: "Crear Imagen — Crea imágenes con IA", color: "#9C27B0" },
        { icon: <Palette className="w-4 h-4" />, label: "Mi Avatar — Diseña tu avatar único", color: "#EC4899" },
        { icon: <Target className="w-4 h-4" />, label: "Aprender Prompts — Domina los prompts", color: "#7C3AED" },
        { icon: <Shield className="w-4 h-4" />, label: "Herramientas IA — 100+ herramientas reales", color: "#00E5FF" },
      ],
      avatarKeys: ["PEQUELINA", "ATOLONDRALIN", "SABELIN"],
      accentColor: "#9C27B0",
      bgGradient: "from-purple-950/30 via-[#0A0A0A] to-[#0A0A0A]",
    },
    {
      id: "gamification",
      title: "Juega y Progresa",
      subtitle: "Gamificación de verdad",
      description:
        "Todo lo que haces en LINCE te da recompensas. Gana XP para subir de nivel, acumula LinceCoins para la Tienda, mantén tu racha diaria y compite en el ranking global.",
      features: [
        { icon: <Zap className="w-4 h-4" />, label: "XP y niveles de progresión", color: "#00FF88" },
        { icon: <Coins className="w-4 h-4" />, label: "LinceCoins para la Tienda", color: "#FFD700" },
        { icon: <Flame className="w-4 h-4" />, label: "Rachas diarias con bonus", color: "#FF6B35" },
        { icon: <Trophy className="w-4 h-4" />, label: "Ranking y ligas competitivas", color: "#D4A843" },
      ],
      avatarKeys: ["CHAVALIN", "MAMALINA", "PAPALIN"],
      accentColor: "#00FF88",
      bgGradient: "from-emerald-950/30 via-[#0A0A0A] to-[#0A0A0A]",
    },
    {
      id: "play",
      title: "Niveles y Aventuras",
      subtitle: "Aprende IA paso a paso",
      description:
        "3 niveles de dificultad creciente, cada uno con misiones únicas. Desde tu primer prompt hasta batallas PvP. Además: Batallas épicas, Cursos completos completos y un Mundo interactivo por explorar.",
      features: [
        { icon: <Gamepad2 className="w-4 h-4" />, label: "3 niveles con misiones únicas", color: "#00E5FF" },
        { icon: <Swords className="w-4 h-4" />, label: "Batallas — PvP de conocimiento", color: "#FF4444" },
        { icon: <GraduationCap className="w-4 h-4" />, label: "Cursos — Cursos completos de IA", color: "#4CAF50" },
        { icon: <Wand2 className="w-4 h-4" />, label: "Mundo LINCE — Explora y descubre", color: "#FFB300" },
      ],
      avatarKeys: ["SABELIN", "CHAVALINA", "PEQUELIN"],
      accentColor: "#00E5FF",
      bgGradient: "from-cyan-950/30 via-[#0A0A0A] to-[#0A0A0A]",
    },
    {
      id: "ready",
      title: "¡Tu Aventura Empieza Ahora!",
      subtitle: "Elige por dónde empezar",
      description:
        "Ya conoces todo lo que LINCE tiene para ti. Ahora es tu turno. Elige tu primera aventura y empieza a aprender IA de la forma más divertida posible.",
      avatarKeys: ["SABELIN", "PAPALIN", "MAMALINA", "CHAVALIN", "CHAVALINA", "PEQUELIN", "PEQUELINA", "YAYALIN", "YAYALINA", "ATOLONDRALIN"],
      accentColor: "#00E5FF",
      bgGradient: "from-cyan-950/40 via-[#0A0A0A] to-[#0A0A0A]",
    },
  ],
  en: [
    {
      id: "welcome",
      title: "Welcome to LINCE",
      subtitle: "Learn AI by Playing",
      description:
        "The world's first gamified platform for learning Artificial Intelligence. No prior knowledge needed. No complications. Just fun and real learning.",
      avatarKeys: ["SABELIN", "PAPALIN", "CHAVALINA", "PEQUELINA", "YAYALIN"],
      accentColor: "#00E5FF",
      bgGradient: "from-cyan-950/40 via-[#0A0A0A] to-[#0A0A0A]",
    },
    {
      id: "avatars",
      title: "Meet Your Guides",
      subtitle: "89 Avatars with unique personalities",
      description:
        "Each avatar is an expert in a different area of AI. Talk to them, ask anything and learn as if chatting with a friend. From SABELIN the wise to CHAVALINA the creative.",
      features: [
        { icon: <MessageCircle className="w-4 h-4" />, label: "Smart chat with each avatar", color: "#00E5FF" },
        { icon: <Brain className="w-4 h-4" />, label: "Each one masters a different topic", color: "#D4A843" },
        { icon: <Star className="w-4 h-4" />, label: "Unlock new companions", color: "#A78BFA" },
      ],
      avatarKeys: ["YAYALIN", "YAYALINA", "PAPALIN", "MAMALINA", "CHAVALIN", "CHAVALINA", "PEQUELIN", "PEQUELINA"],
      accentColor: "#D4A843",
      bgGradient: "from-amber-950/30 via-[#0A0A0A] to-[#0A0A0A]",
    },
    {
      id: "tools",
      title: "Your AI Superpowers",
      subtitle: "Tools you can use right now",
      description:
        "LINCE gives you access to real AI tools. Create images, design your avatar, learn to write professional prompts and explore 100+ AI tools.",
      features: [
        { icon: <Image className="w-4 h-4" />, label: "Create Image — Create images with AI", color: "#9C27B0" },
        { icon: <Palette className="w-4 h-4" />, label: "My Avatar — Design your unique avatar", color: "#EC4899" },
        { icon: <Target className="w-4 h-4" />, label: "Learn Prompts — Master prompts", color: "#7C3AED" },
        { icon: <Shield className="w-4 h-4" />, label: "AI Arsenal — 100+ real tools", color: "#00E5FF" },
      ],
      avatarKeys: ["PEQUELINA", "ATOLONDRALIN", "SABELIN"],
      accentColor: "#9C27B0",
      bgGradient: "from-purple-950/30 via-[#0A0A0A] to-[#0A0A0A]",
    },
    {
      id: "gamification",
      title: "Play and Progress",
      subtitle: "Real gamification",
      description:
        "Everything you do in LINCE earns rewards. Gain XP to level up, collect LinceCoins for the Shop, maintain your daily streak and compete in the global ranking.",
      features: [
        { icon: <Zap className="w-4 h-4" />, label: "XP and progression levels", color: "#00FF88" },
        { icon: <Coins className="w-4 h-4" />, label: "LinceCoins for the Shop", color: "#FFD700" },
        { icon: <Flame className="w-4 h-4" />, label: "Daily streaks with bonuses", color: "#FF6B35" },
        { icon: <Trophy className="w-4 h-4" />, label: "Ranking and competitive leagues", color: "#D4A843" },
      ],
      avatarKeys: ["CHAVALIN", "MAMALINA", "PAPALIN"],
      accentColor: "#00FF88",
      bgGradient: "from-emerald-950/30 via-[#0A0A0A] to-[#0A0A0A]",
    },
    {
      id: "play",
      title: "Levels and Adventures",
      subtitle: "Learn AI step by step",
      description:
        "3 difficulty levels, each with unique missions. From your first prompt to PvP battles. Plus: epic Battles, full Courses and an interactive World to explore.",
      features: [
        { icon: <Gamepad2 className="w-4 h-4" />, label: "3 levels with unique missions", color: "#00E5FF" },
        { icon: <Swords className="w-4 h-4" />, label: "Battles — PvP knowledge battles", color: "#FF4444" },
        { icon: <GraduationCap className="w-4 h-4" />, label: "Academy — Full AI courses", color: "#4CAF50" },
        { icon: <Wand2 className="w-4 h-4" />, label: "LINCE World — Explore and discover", color: "#FFB300" },
      ],
      avatarKeys: ["SABELIN", "CHAVALINA", "PEQUELIN"],
      accentColor: "#00E5FF",
      bgGradient: "from-cyan-950/30 via-[#0A0A0A] to-[#0A0A0A]",
    },
    {
      id: "ready",
      title: "Your Adventure Starts Now!",
      subtitle: "Choose where to begin",
      description:
        "Now you know everything LINCE has for you. It's your turn. Choose your first adventure and start learning AI in the most fun way possible.",
      avatarKeys: ["SABELIN", "PAPALIN", "MAMALINA", "CHAVALIN", "CHAVALINA", "PEQUELIN", "PEQUELINA", "YAYALIN", "YAYALINA", "ATOLONDRALIN"],
      accentColor: "#00E5FF",
      bgGradient: "from-cyan-950/40 via-[#0A0A0A] to-[#0A0A0A]",
    },
  ],
  zh: [
    {
      id: "welcome",
      title: "欢迎来到 LINCE",
      subtitle: "玩游戏学AI",
      description: "全球首个游戏化人工智能学习平台。无需任何基础知识。没有复杂操作。只有乐趣和真正的学习。",
      avatarKeys: ["SABELIN", "PAPALIN", "CHAVALINA", "PEQUELINA", "YAYALIN"],
      accentColor: "#00E5FF",
      bgGradient: "from-cyan-950/40 via-[#0A0A0A] to-[#0A0A0A]",
    },
    {
      id: "avatars",
      title: "认识你的向导",
      subtitle: "89个独特个性的虚拟角色",
      description: "每个角色都是AI不同领域的专家。与他们交谈，问任何问题，像和朋友聊天一样学习。",
      features: [
        { icon: <MessageCircle className="w-4 h-4" />, label: "与每个角色智能聊天", color: "#00E5FF" },
        { icon: <Brain className="w-4 h-4" />, label: "每个角色精通不同主题", color: "#D4A843" },
        { icon: <Star className="w-4 h-4" />, label: "解锁新伙伴", color: "#A78BFA" },
      ],
      avatarKeys: ["YAYALIN", "YAYALINA", "PAPALIN", "MAMALINA", "CHAVALIN", "CHAVALINA", "PEQUELIN", "PEQUELINA"],
      accentColor: "#D4A843",
      bgGradient: "from-amber-950/30 via-[#0A0A0A] to-[#0A0A0A]",
    },
    {
      id: "tools",
      title: "你的AI超能力",
      subtitle: "现在就可以使用的工具",
      description: "LINCE让你使用真正的AI工具。创建图像、设计你的角色、学习写专业提示词，探索100+AI工具。",
      features: [
        { icon: <Image className="w-4 h-4" />, label: "创建图像 — 用AI创建图像", color: "#9C27B0" },
        { icon: <Palette className="w-4 h-4" />, label: "我的角色 — 设计你的独特角色", color: "#EC4899" },
        { icon: <Target className="w-4 h-4" />, label: "学习提示词 — 掌握提示词", color: "#7C3AED" },
        { icon: <Shield className="w-4 h-4" />, label: "AI武器库 — 100+真实工具", color: "#00E5FF" },
      ],
      avatarKeys: ["PEQUELINA", "ATOLONDRALIN", "SABELIN"],
      accentColor: "#9C27B0",
      bgGradient: "from-purple-950/30 via-[#0A0A0A] to-[#0A0A0A]",
    },
    {
      id: "gamification",
      title: "玩耍与进步",
      subtitle: "真正的游戏化",
      description: "在LINCE中做的一切都能获得奖励。获得XP升级，收集LinceCoins，保持每日连胜，在全球排名中竞争。",
      features: [
        { icon: <Zap className="w-4 h-4" />, label: "XP和等级进阶", color: "#00FF88" },
        { icon: <Coins className="w-4 h-4" />, label: "LinceCoins商城", color: "#FFD700" },
        { icon: <Flame className="w-4 h-4" />, label: "每日连胜奖励", color: "#FF6B35" },
        { icon: <Trophy className="w-4 h-4" />, label: "排名和竞技联赛", color: "#D4A843" },
      ],
      avatarKeys: ["CHAVALIN", "MAMALINA", "PAPALIN"],
      accentColor: "#00FF88",
      bgGradient: "from-emerald-950/30 via-[#0A0A0A] to-[#0A0A0A]",
    },
    {
      id: "play",
      title: "关卡与冒险",
      subtitle: "一步步学习AI",
      description: "3个难度递增的关卡，每个都有独特任务。从你的第一个提示词到PvP战斗。还有：史诗对战、完整课程和互动世界。",
      features: [
        { icon: <Gamepad2 className="w-4 h-4" />, label: "3个独特任务关卡", color: "#00E5FF" },
        { icon: <Swords className="w-4 h-4" />, label: "对战 — PvP知识对战", color: "#FF4444" },
        { icon: <GraduationCap className="w-4 h-4" />, label: "学院 — 完整AI课程", color: "#4CAF50" },
        { icon: <Wand2 className="w-4 h-4" />, label: "LINCE世界 — 探索发现", color: "#FFB300" },
      ],
      avatarKeys: ["SABELIN", "CHAVALINA", "PEQUELIN"],
      accentColor: "#00E5FF",
      bgGradient: "from-cyan-950/30 via-[#0A0A0A] to-[#0A0A0A]",
    },
    {
      id: "ready",
      title: "你的冒险现在开始！",
      subtitle: "选择从哪里开始",
      description: "现在你知道LINCE为你准备的一切了。轮到你了。选择你的第一个冒险，以最有趣的方式开始学习AI。",
      avatarKeys: ["SABELIN", "PAPALIN", "MAMALINA", "CHAVALIN", "CHAVALINA", "PEQUELIN", "PEQUELINA", "YAYALIN", "YAYALINA", "ATOLONDRALIN"],
      accentColor: "#00E5FF",
      bgGradient: "from-cyan-950/40 via-[#0A0A0A] to-[#0A0A0A]",
    },
  ],
};

const LABELS: Record<string, { skip: string; next: string; prev: string; start: string; goPlay: string; goExplore: string; goAvatars: string; goTools: string }> = {
  es: { skip: "Saltar", next: "Siguiente", prev: "Anterior", start: "¡Empezar!", goPlay: "Jugar Ahora", goExplore: "Explorar Avatares", goAvatars: "Hablar con un Avatar", goTools: "Crear con IA" },
  en: { skip: "Skip", next: "Next", prev: "Previous", start: "Start!", goPlay: "Play Now", goExplore: "Explore Avatars", goAvatars: "Talk to an Avatar", goTools: "Create with AI" },
  zh: { skip: "跳过", next: "下一步", prev: "上一步", start: "开始！", goPlay: "立即游戏", goExplore: "探索角色", goAvatars: "与角色对话", goTools: "用AI创作" },
};

// ─── AVATAR CAROUSEL ───
function AvatarCarousel({ avatarKeys, accentColor }: { avatarKeys: (keyof typeof AVATAR_FRONTAL)[]; accentColor: string }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollPos, setScrollPos] = useState(0);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    let animFrame: number;
    let pos = 0;
    const speed = 0.3;
    const animate = () => {
      pos += speed;
      if (pos >= el.scrollWidth / 2) pos = 0;
      el.scrollLeft = pos;
      setScrollPos(pos);
      animFrame = requestAnimationFrame(animate);
    };
    animFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animFrame);
  }, [avatarKeys]);

  // Duplicate avatars for infinite scroll effect
  const doubledKeys = [...avatarKeys, ...avatarKeys, ...avatarKeys];

  return (
    <div className="relative overflow-hidden py-2">
      {/* Fade edges */}
      <div className="absolute left-0 top-0 bottom-0 w-16 z-10 bg-gradient-to-r from-[#0A0A0A] to-transparent pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-16 z-10 bg-gradient-to-l from-[#0A0A0A] to-transparent pointer-events-none" />
      <div ref={scrollRef} className="flex gap-3 overflow-hidden" style={{ scrollBehavior: "auto" }}>
        {doubledKeys.map((key, i) => (
          <div
            key={`${key}-${i}`}
            className="flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden border-2 transition-all"
            style={{
              borderColor: `${accentColor}50`,
              boxShadow: `0 0 15px ${accentColor}15`,
            }}
          >
            <img
              src={AVATAR_FRONTAL[key]}
              alt={key}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── PROGRESS DOTS ───
function ProgressDots({ total, current, accentColor }: { total: number; current: number; accentColor: string }) {
  return (
    <div className="flex items-center justify-center gap-2">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className="transition-all duration-500 rounded-full"
          style={{
            width: i === current ? "32px" : "8px",
            height: "8px",
            backgroundColor: i === current ? accentColor : i < current ? `${accentColor}60` : "rgba(255,255,255,0.15)",
            boxShadow: i === current ? `0 0 10px ${accentColor}40` : "none",
          }}
        />
      ))}
    </div>
  );
}

// ─── FEATURE LIST ───
function FeatureList({ features }: { features: { icon: React.ReactNode; label: string; color: string }[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-w-lg mx-auto">
      {features.map((f, i) => (
        <div
          key={i}
          className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all"
          style={{
            backgroundColor: `${f.color}08`,
            border: `1px solid ${f.color}18`,
          }}
        >
          <div
            className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: `${f.color}15`, color: f.color }}
          >
            {f.icon}
          </div>
          <span className="text-sm text-gray-300 font-medium">{f.label}</span>
        </div>
      ))}
    </div>
  );
}

// ─── FINAL STEP CTA BUTTONS ───
function FinalStepButtons({ labels, navigate, onComplete }: { labels: typeof LABELS.es; navigate: (to: string) => void; onComplete: () => void }) {
  const destinations = [
    { label: labels.goPlay, icon: <Gamepad2 className="w-5 h-5" />, path: "/jugar", color: "#00E5FF", primary: true },
    { label: labels.goTools, icon: <Wand2 className="w-5 h-5" />, path: "/prompt-studio", color: "#9C27B0", primary: false },
    { label: labels.goAvatars, icon: <MessageCircle className="w-5 h-5" />, path: "/personajes", color: "#D4A843", primary: false },
    { label: labels.goExplore, icon: <Users className="w-5 h-5" />, path: "/arsenal-ia", color: "#00FF88", primary: false },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-md mx-auto">
      {destinations.map((d, i) => (
        <button
          key={i}
          onClick={() => { onComplete(); navigate(d.path); }}
          className={`flex items-center justify-center gap-2 py-3.5 px-5 rounded-xl font-bold text-sm transition-all active:scale-95 ${
            d.primary
              ? "text-black col-span-1 sm:col-span-2 text-base py-4"
              : "text-white border border-white/10 hover:border-white/20"
          }`}
          style={
            d.primary
              ? { backgroundColor: d.color, boxShadow: `0 0 30px ${d.color}30` }
              : { backgroundColor: `${d.color}10` }
          }
        >
          {d.icon}
          {d.label}
        </button>
      ))}
    </div>
  );
}

// ─── MAIN COMPONENT ───
const ONBOARDING_KEY = "lince-bienvenida-completed";

export default function Bienvenida() {
  const [, navigate] = useLocation();
  const { lang } = usePRDLanguage();
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState<"next" | "prev">("next");
  const [isAnimating, setIsAnimating] = useState(false);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const steps = STEPS[lang] || STEPS.es;
  const labels = LABELS[lang] || LABELS.es;
  const step = steps[currentStep];
  const isFirst = currentStep === 0;
  const isLast = currentStep === steps.length - 1;

  // Check if already completed
  useEffect(() => {
    const completed = localStorage.getItem(ONBOARDING_KEY);
    if (completed === "true") {
      navigate("/home");
    }
  }, [navigate]);

  const goNext = useCallback(() => {
    if (isLast || isAnimating) return;
    setDirection("next");
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentStep((s) => s + 1);
      setIsAnimating(false);
    }, 200);
  }, [isLast, isAnimating]);

  const goPrev = useCallback(() => {
    if (isFirst || isAnimating) return;
    setDirection("prev");
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentStep((s) => s - 1);
      setIsAnimating(false);
    }, 200);
  }, [isFirst, isAnimating]);

  const handleComplete = useCallback(() => {
    localStorage.setItem(ONBOARDING_KEY, "true");
    localStorage.setItem("lince-tutorial-completed", "true");
  }, []);

  const handleSkip = useCallback(() => {
    handleComplete();
    navigate("/home");
  }, [handleComplete, navigate]);

  // Swipe support
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 60) {
      if (diff > 0) goNext();
      else goPrev();
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") goNext();
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "Escape") handleSkip();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [goNext, goPrev, handleSkip]);

  return (
    <div
      className="fixed inset-0 z-[9999] bg-[#0A0A0A] flex flex-col overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Background gradient */}
      <div className={`absolute inset-0 bg-gradient-to-b ${step.bgGradient} transition-all duration-700 pointer-events-none`} />

      {/* Hero image (only on first step) */}
      {isFirst && (
        <div className="absolute inset-0 pointer-events-none">
          <img src={HERO_IMG} alt="" className="w-full h-full object-cover opacity-15" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A]/60 via-[#0A0A0A]/80 to-[#0A0A0A]" />
        </div>
      )}

      {/* Top bar: skip + step counter */}
      <div className="relative z-10 flex items-center justify-between px-4 sm:px-6 pt-4 pb-2">
        <button
          onClick={handleSkip}
          className="text-gray-500 hover:text-gray-300 text-sm font-medium transition-colors px-3 py-1.5 rounded-lg hover:bg-white/5"
        >
          {labels.skip}
        </button>
        <div className="flex items-center gap-1.5">
          <span className="text-gray-600 text-xs font-mono">{currentStep + 1}/{steps.length}</span>
        </div>
        {/* Invisible spacer for centering */}
        <div className="w-16" />
      </div>

      {/* Main content area */}
      <div className="relative z-10 flex-1 flex flex-col justify-center px-4 sm:px-6 overflow-y-auto">
        <div
          className={`transition-all duration-300 ${
            isAnimating
              ? direction === "next"
                ? "opacity-0 translate-x-8"
                : "opacity-0 -translate-x-8"
              : "opacity-100 translate-x-0"
          }`}
        >
          {/* Step number badge */}
          <div className="flex justify-center mb-4">
            <div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase"
              style={{
                backgroundColor: `${step.accentColor}10`,
                color: step.accentColor,
                border: `1px solid ${step.accentColor}25`,
              }}
            >
              {isLast ? <Rocket className="w-3.5 h-3.5" /> : <Sparkles className="w-3.5 h-3.5" />}
              {step.id === "welcome" ? "LINCE" : `${currentStep}/${steps.length - 1}`}
            </div>
          </div>

          {/* Avatar carousel */}
          <div className="mb-5">
            <AvatarCarousel avatarKeys={step.avatarKeys} accentColor={step.accentColor} />
          </div>

          {/* Title */}
          <h1
            className="text-center font-display font-black text-3xl sm:text-4xl lg:text-5xl mb-2 transition-colors duration-500"
            style={{ color: step.accentColor }}
          >
            {step.title}
          </h1>

          {/* Subtitle */}
          <p
            className="text-center text-sm sm:text-base font-semibold mb-4 transition-colors duration-500"
            style={{ color: `${step.accentColor}90` }}
          >
            {step.subtitle}
          </p>

          {/* Description */}
          <p className="text-center text-gray-400 text-sm sm:text-base leading-relaxed mb-6 max-w-lg mx-auto">
            {step.description}
          </p>

          {/* Features (if any) */}
          {step.features && (
            <div className="mb-6">
              <FeatureList features={step.features} />
            </div>
          )}

          {/* Final step: action buttons */}
          {isLast && (
            <div className="mb-4">
              <FinalStepButtons labels={labels} navigate={navigate} onComplete={handleComplete} />
            </div>
          )}
        </div>
      </div>

      {/* Bottom navigation */}
      <div className="relative z-10 border-t border-white/5 bg-[#0A0A0A]/90 backdrop-blur-md">
        <div className="px-4 sm:px-6 py-4">
          {/* Progress dots */}
          <div className="mb-4">
            <ProgressDots total={steps.length} current={currentStep} accentColor={step.accentColor} />
          </div>

          {/* Nav buttons */}
          <div className="flex items-center justify-between max-w-lg mx-auto">
            <button
              onClick={goPrev}
              disabled={isFirst}
              className={`flex items-center gap-1 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isFirst
                  ? "text-gray-800 cursor-not-allowed"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              {labels.prev}
            </button>

            {!isLast ? (
              <button
                onClick={goNext}
                className="flex items-center gap-2 px-8 py-3 rounded-xl text-sm font-bold text-black transition-all hover:brightness-110 active:scale-95"
                style={{
                  backgroundColor: step.accentColor,
                  boxShadow: `0 0 20px ${step.accentColor}25`,
                }}
              >
                {labels.next}
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={() => { handleComplete(); navigate("/jugar"); }}
                className="flex items-center gap-2 px-8 py-3 rounded-xl text-sm font-bold text-black bg-[#00E5FF] transition-all hover:brightness-110 active:scale-95"
                style={{ boxShadow: "0 0 30px rgba(0,229,255,0.3)" }}
              >
                {labels.start}
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

import { useState, useEffect, useCallback, useRef } from "react";
import { useLocation } from "wouter";
import { X, ChevronRight, ChevronLeft, Sparkles, Gamepad2, Users, Palette, Share2 } from "lucide-react";

// ─── TYPES ───
interface TourStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  targetSelector?: string; // CSS selector for the element to highlight
  targetRoute?: string;    // Route to navigate to before highlighting
  position: "center" | "top" | "bottom" | "left" | "right";
  accentColor: string;
}

interface OnboardingTourProps {
  onComplete: () => void;
  lang?: "es" | "en" | "zh";
}

// ─── TOUR STEPS (i18n) ───
const STEPS: Record<string, TourStep[]> = {
  es: [
    {
      id: "welcome",
      title: "¡Bienvenido a LINCE!",
      description: "Soy tu guía en esta aventura de inteligencia artificial. En menos de 1 minuto te enseño las 4 cosas más importantes. ¿Listo?",
      icon: <Sparkles className="w-8 h-8" />,
      position: "center",
      accentColor: "#00E5FF",
    },
    {
      id: "avatars",
      title: "65 Avatares te esperan",
      description: "Cada avatar es un experto en IA con personalidad propia. Habla con ellos, aprende a su ritmo y desbloquea nuevos compañeros.",
      icon: <Users className="w-8 h-8" />,
      targetSelector: '[data-tour="avatars"]',
      position: "bottom",
      accentColor: "#D4A843",
    },
    {
      id: "play",
      title: "Aprende IA jugando",
      description: "6 niveles de dificultad creciente. Gana XP, sube de nivel y compite en el ranking. ¡La IA nunca fue tan divertida!",
      icon: <Gamepad2 className="w-8 h-8" />,
      targetSelector: '[data-tour="play"]',
      position: "bottom",
      accentColor: "#00FF88",
    },
    {
      id: "prompt-studio",
      title: "Crea imágenes con IA",
      description: "Crear Imagen es tu laboratorio creativo. Escribe una idea, elige un estilo y genera imágenes increíbles en segundos.",
      icon: <Palette className="w-8 h-8" />,
      targetSelector: '[data-tour="prompt-studio"]',
      position: "bottom",
      accentColor: "#FF6B6B",
    },
    {
      id: "share",
      title: "Comparte tus logros",
      description: "Todo lo que crees puedes compartirlo en WhatsApp, Instagram, Telegram y más. ¡Muestra al mundo lo que aprendes!",
      icon: <Share2 className="w-8 h-8" />,
      position: "center",
      accentColor: "#A78BFA",
    },
  ],
  en: [
    {
      id: "welcome",
      title: "Welcome to LINCE!",
      description: "I'm your AI adventure guide. In less than 1 minute I'll show you the 4 most important things. Ready?",
      icon: <Sparkles className="w-8 h-8" />,
      position: "center",
      accentColor: "#00E5FF",
    },
    {
      id: "avatars",
      title: "65 Avatars await you",
      description: "Each avatar is an AI expert with its own personality. Talk to them, learn at your pace and unlock new companions.",
      icon: <Users className="w-8 h-8" />,
      targetSelector: '[data-tour="avatars"]',
      position: "bottom",
      accentColor: "#D4A843",
    },
    {
      id: "play",
      title: "Learn AI by playing",
      description: "6 difficulty levels. Earn XP, level up and compete in the ranking. AI has never been this fun!",
      icon: <Gamepad2 className="w-8 h-8" />,
      targetSelector: '[data-tour="play"]',
      position: "bottom",
      accentColor: "#00FF88",
    },
    {
      id: "prompt-studio",
      title: "Create images with AI",
      description: "Create Image is your creative lab. Write an idea, choose a style and generate amazing images in seconds.",
      icon: <Palette className="w-8 h-8" />,
      targetSelector: '[data-tour="prompt-studio"]',
      position: "bottom",
      accentColor: "#FF6B6B",
    },
    {
      id: "share",
      title: "Share your achievements",
      description: "Everything you create can be shared on WhatsApp, Instagram, Telegram and more. Show the world what you learn!",
      icon: <Share2 className="w-8 h-8" />,
      position: "center",
      accentColor: "#A78BFA",
    },
  ],
  zh: [
    {
      id: "welcome",
      title: "欢迎来到 LINCE！",
      description: "我是你的AI冒险向导。不到1分钟，我会向你展示4个最重要的功能。准备好了吗？",
      icon: <Sparkles className="w-8 h-8" />,
      position: "center",
      accentColor: "#00E5FF",
    },
    {
      id: "avatars",
      title: "65个虚拟角色等着你",
      description: "每个角色都是AI专家，拥有独特个性。与他们交谈，按自己的节奏学习，解锁新伙伴。",
      icon: <Users className="w-8 h-8" />,
      targetSelector: '[data-tour="avatars"]',
      position: "bottom",
      accentColor: "#D4A843",
    },
    {
      id: "play",
      title: "玩游戏学AI",
      description: "6个难度等级。赚取经验值，升级并在排行榜上竞争。AI从未如此有趣！",
      icon: <Gamepad2 className="w-8 h-8" />,
      targetSelector: '[data-tour="play"]',
      position: "bottom",
      accentColor: "#00FF88",
    },
    {
      id: "prompt-studio",
      title: "用AI创作图像",
      description: "创建图像是你的创意实验室。写下想法，选择风格，几秒钟内生成惊人图像。",
      icon: <Palette className="w-8 h-8" />,
      targetSelector: '[data-tour="prompt-studio"]',
      position: "bottom",
      accentColor: "#FF6B6B",
    },
    {
      id: "share",
      title: "分享你的成就",
      description: "你创建的一切都可以分享到WhatsApp、Instagram、Telegram等。向世界展示你学到的东西！",
      icon: <Share2 className="w-8 h-8" />,
      position: "center",
      accentColor: "#A78BFA",
    },
  ],
};

const SKIP_LABELS: Record<string, string> = {
  es: "Saltar tour",
  en: "Skip tour",
  zh: "跳过导览",
};

const NEXT_LABELS: Record<string, string> = {
  es: "Siguiente",
  en: "Next",
  zh: "下一步",
};

const PREV_LABELS: Record<string, string> = {
  es: "Anterior",
  en: "Previous",
  zh: "上一步",
};

const FINISH_LABELS: Record<string, string> = {
  es: "¡Empezar!",
  en: "Let's go!",
  zh: "开始吧！",
};

// ─── COMPONENT ───
export function OnboardingTour({ onComplete, lang = "es" }: OnboardingTourProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [spotlightRect, setSpotlightRect] = useState<DOMRect | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const [, navigate] = useLocation();

  const steps = STEPS[lang] || STEPS.es;
  const step = steps[currentStep];
  const isFirst = currentStep === 0;
  const isLast = currentStep === steps.length - 1;

  // Entrance animation
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Find and highlight target element
  useEffect(() => {
    if (!step.targetSelector) {
      setSpotlightRect(null);
      return;
    }

    const findTarget = () => {
      const el = document.querySelector(step.targetSelector!);
      if (el) {
        const rect = el.getBoundingClientRect();
        setSpotlightRect(rect);
        // Scroll element into view if needed
        el.scrollIntoView({ behavior: "smooth", block: "center" });
      } else {
        setSpotlightRect(null);
      }
    };

    // Small delay to let the page render
    const timer = setTimeout(findTarget, 300);
    // Also listen for scroll/resize
    window.addEventListener("scroll", findTarget, { passive: true });
    window.addEventListener("resize", findTarget, { passive: true });

    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", findTarget);
      window.removeEventListener("resize", findTarget);
    };
  }, [step.targetSelector, currentStep]);

  const goNext = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);

    if (isLast) {
      setIsVisible(false);
      setTimeout(() => onComplete(), 300);
      return;
    }

    setCurrentStep((prev) => prev + 1);
    setTimeout(() => setIsAnimating(false), 400);
  }, [isLast, isAnimating, onComplete]);

  const goPrev = useCallback(() => {
    if (isAnimating || isFirst) return;
    setIsAnimating(true);
    setCurrentStep((prev) => prev - 1);
    setTimeout(() => setIsAnimating(false), 400);
  }, [isFirst, isAnimating]);

  const skip = useCallback(() => {
    setIsVisible(false);
    setTimeout(() => onComplete(), 300);
  }, [onComplete]);

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "Enter") goNext();
      else if (e.key === "ArrowLeft") goPrev();
      else if (e.key === "Escape") skip();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [goNext, goPrev, skip]);

  // Calculate card position based on spotlight
  const getCardStyle = (): React.CSSProperties => {
    if (!spotlightRect || step.position === "center") {
      return {
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
      };
    }

    const padding = 20;
    const cardWidth = Math.min(380, window.innerWidth - 32);

    if (step.position === "bottom") {
      return {
        position: "fixed",
        top: `${spotlightRect.bottom + padding}px`,
        left: `${Math.max(16, Math.min(spotlightRect.left, window.innerWidth - cardWidth - 16))}px`,
      };
    }

    if (step.position === "top") {
      return {
        position: "fixed",
        bottom: `${window.innerHeight - spotlightRect.top + padding}px`,
        left: `${Math.max(16, Math.min(spotlightRect.left, window.innerWidth - cardWidth - 16))}px`,
      };
    }

    return {
      position: "fixed",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
    };
  };

  return (
    <div
      className={`fixed inset-0 z-[9999] transition-opacity duration-300 ${isVisible ? "opacity-100" : "opacity-0 pointer-events-none"}`}
      role="dialog"
      aria-modal="true"
      aria-label="Tour de bienvenida"
    >
      {/* Overlay with spotlight cutout */}
      <svg className="absolute inset-0 w-full h-full" style={{ pointerEvents: "none" }}>
        <defs>
          <mask id="spotlight-mask">
            <rect width="100%" height="100%" fill="white" />
            {spotlightRect && (
              <rect
                x={spotlightRect.left - 8}
                y={spotlightRect.top - 8}
                width={spotlightRect.width + 16}
                height={spotlightRect.height + 16}
                rx="12"
                fill="black"
              />
            )}
          </mask>
        </defs>
        <rect
          width="100%"
          height="100%"
          fill="rgba(0,0,0,0.85)"
          mask="url(#spotlight-mask)"
          style={{ pointerEvents: "auto" }}
          onClick={skip}
        />
      </svg>

      {/* Spotlight border glow */}
      {spotlightRect && (
        <div
          className="absolute rounded-xl pointer-events-none transition-all duration-500"
          style={{
            left: spotlightRect.left - 10,
            top: spotlightRect.top - 10,
            width: spotlightRect.width + 20,
            height: spotlightRect.height + 20,
            boxShadow: `0 0 0 3px ${step.accentColor}, 0 0 30px ${step.accentColor}40`,
          }}
        />
      )}

      {/* Tour card */}
      <div
        ref={cardRef}
        className="w-[90vw] max-w-[380px] transition-all duration-500"
        style={{
          ...getCardStyle(),
          zIndex: 10000,
        }}
      >
        <div
          className="relative rounded-2xl overflow-hidden"
          style={{
            background: "linear-gradient(135deg, #111827 0%, #0A0A0A 100%)",
            border: `1px solid ${step.accentColor}30`,
            boxShadow: `0 0 40px ${step.accentColor}15, 0 20px 60px rgba(0,0,0,0.5)`,
          }}
        >
          {/* Skip button */}
          <button
            onClick={skip}
            className="absolute top-3 right-3 p-1.5 rounded-full text-gray-500 hover:text-white hover:bg-white/10 transition-colors z-10"
            aria-label={SKIP_LABELS[lang]}
          >
            <X className="w-4 h-4" />
          </button>

          {/* Content */}
          <div className="p-6 pt-5">
            {/* Step indicator */}
            <div className="flex items-center gap-1.5 mb-4">
              {steps.map((_, i) => (
                <div
                  key={i}
                  className="h-1 rounded-full transition-all duration-500"
                  style={{
                    width: i === currentStep ? "24px" : "8px",
                    backgroundColor: i === currentStep ? step.accentColor : i < currentStep ? `${step.accentColor}60` : "#374151",
                  }}
                />
              ))}
              <span className="ml-auto text-xs text-gray-500 font-mono">
                {currentStep + 1}/{steps.length}
              </span>
            </div>

            {/* Icon */}
            <div
              className="w-14 h-14 rounded-xl flex items-center justify-center mb-4 transition-colors duration-500"
              style={{
                backgroundColor: `${step.accentColor}15`,
                color: step.accentColor,
              }}
            >
              {step.icon}
            </div>

            {/* Title */}
            <h3
              className="font-['Space_Grotesk'] font-bold text-xl mb-2 transition-colors duration-500"
              style={{ color: step.accentColor }}
            >
              {step.title}
            </h3>

            {/* Description */}
            <p className="text-gray-300 text-sm leading-relaxed mb-6">
              {step.description}
            </p>

            {/* Navigation buttons */}
            <div className="flex items-center gap-3">
              {!isFirst && (
                <button
                  onClick={goPrev}
                  className="flex items-center gap-1 px-3 py-2 text-sm text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
                  aria-label={PREV_LABELS[lang]}
                >
                  <ChevronLeft className="w-4 h-4" />
                  {PREV_LABELS[lang]}
                </button>
              )}

              <button
                onClick={isFirst ? skip : undefined}
                className={`text-sm text-gray-500 hover:text-gray-300 transition-colors ${isFirst ? "cursor-pointer" : "invisible"}`}
                aria-label={SKIP_LABELS[lang]}
              >
                {SKIP_LABELS[lang]}
              </button>

              <button
                onClick={goNext}
                className="ml-auto flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-black transition-all hover:brightness-110 active:scale-95"
                style={{ backgroundColor: step.accentColor }}
                aria-label={isLast ? FINISH_LABELS[lang] : NEXT_LABELS[lang]}
              >
                {isLast ? FINISH_LABELS[lang] : NEXT_LABELS[lang]}
                {!isLast && <ChevronRight className="w-4 h-4" />}
                {isLast && <Sparkles className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import { tl } from "@/contexts/PRDLanguageContext";
import { useState, useEffect } from "react";
import { AVATAR_FRONTAL } from "@/lib/avatarConstants";

// ─── Translations ───
const T: Record<string, Record<string, string>> = {
  es: {
    welcome: "¡Bienvenido a",
    lince: "LINCE",
    tagline: "La primera app del mundo que te enseña Inteligencia Artificial jugando",
    step1Title: "Aprende IA",
    step1Desc: "Cursos interactivos de IA para todas las edades. Desde los 13 hasta los 99 años.",
    step2Title: "Juega y Gana",
    step2Desc: "Sube de nivel, gana LinceCoins y compite en el ranking mundial.",
    step3Title: "Tu Familia IA",
    step3Desc: "11 personajes te guían. Cada uno enseña diferente según tu edad.",
    step4Title: "Herramientas Reales",
    step4Desc: "Aprende a usar ChatGPT, Midjourney, y 100+ herramientas de IA.",
    startBtn: "¡EMPEZAR AHORA!",
    skipBtn: "Explorar por mi cuenta",
    slide: "de",
    next: "Siguiente",
    prev: "Anterior",
  },
  en: {
    welcome: "Welcome to",
    lince: "LINCE",
    tagline: "The world's first app that teaches you AI through play",
    step1Title: "Learn AI",
    step1Desc: "Interactive AI courses for all ages. From 13 to 99 years old.",
    step2Title: "Play & Win",
    step2Desc: "Level up, earn LinceCoins and compete in the global ranking.",
    step3Title: "Your AI Family",
    step3Desc: "11 characters guide you. Each one teaches differently based on your age.",
    step4Title: "Real Tools",
    step4Desc: "Learn to use ChatGPT, Midjourney, and 100+ AI tools.",
    startBtn: "START NOW!",
    skipBtn: "Explore on my own",
    slide: "of",
    next: "Next",
    prev: "Previous",
  },
  zh: {
    welcome: "欢迎来到",
    lince: "LINCE",
    tagline: "全球首个通过游戏教你人工智能的应用",
    step1Title: "学习AI",
    step1Desc: "适合所有年龄的互动AI课程。从13岁到99岁。",
    step2Title: "玩耍并获胜",
    step2Desc: "升级、赚取LinceCoins并在全球排名中竞争。",
    step3Title: "你的AI家族",
    step3Desc: "11个角色引导你。每个人根据你的年龄以不同方式教学。",
    step4Title: "真实工具",
    step4Desc: "学习使用ChatGPT、Midjourney和100多种AI工具。",
    startBtn: "立即开始！",
    skipBtn: "自己探索",
    slide: "/",
    next: "下一步",
    prev: "上一步",
  },
};

// Avatars to showcase in the family slide
const SHOWCASE_AVATARS = [
  { key: "PEQUELIN", name: "Duolincito", age: "13-17" },
  { key: "CHAVALIN", name: "Duolín Jr", age: "18-25" },
  { key: "MAMALINA", name: "Duolina", age: "30-45" },
  { key: "YAYALIN", name: "Duolino", age: "60-75" },
  { key: "SABELIN", name: "Duolingenio", age: "Mascota" },
];

interface WelcomeModalProps {
  userName: string;
  lang: "es" | "en" | "zh";
  onComplete: () => void;
  onSkip: () => void;
}

export default function WelcomeModal({ userName, lang, onComplete, onSkip }: WelcomeModalProps) {
  const t = T[lang] || T.es;
  const [currentSlide, setCurrentSlide] = useState(0);
  const [fadeIn, setFadeIn] = useState(true);
  const [showConfetti, setShowConfetti] = useState(true);
  const totalSlides = 4;

  // Confetti effect on mount
  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  const goToSlide = (index: number) => {
    setFadeIn(false);
    setTimeout(() => {
      setCurrentSlide(index);
      setFadeIn(true);
    }, 200);
  };

  const nextSlide = () => {
    if (currentSlide < totalSlides - 1) goToSlide(currentSlide + 1);
  };

  const prevSlide = () => {
    if (currentSlide > 0) goToSlide(currentSlide - 1);
  };

  // ─── SLIDES CONTENT (LINCE cyan #00E5FF + gold #D4A843 palette) ───
  const slides = [
    // Slide 0: Welcome + What is LINCE
    <div key="s0" className="flex flex-col items-center text-center px-4">
      <div className="relative mb-6">
        <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden border-3 border-[#00E5FF] shadow-[0_0_40px_rgba(0,229,255,0.4)]">
          <img src={AVATAR_FRONTAL.SABELIN} alt="LINCE" className="w-full h-full object-cover" />
        </div>
        <div className="absolute -bottom-2 -right-2 bg-[#00E5FF] text-black text-xs font-black px-3 py-1 rounded-full shadow-lg">
          IA
        </div>
      </div>
      <h2 className="text-2xl sm:text-3xl font-black text-white mb-1">
        {t.welcome} <span className="text-[#00E5FF]">{t.lince}</span>
      </h2>
      <p className="text-[#D4A843] font-bold text-base sm:text-lg mb-2">{userName}</p>
      <p className="text-gray-300 text-sm sm:text-base max-w-sm leading-relaxed">{t.tagline}</p>
    </div>,

    // Slide 1: Learn AI
    <div key="s1" className="flex flex-col items-center text-center px-4">
      <div className="w-20 h-20 sm:w-24 sm:h-24 mb-5 flex items-center justify-center rounded-2xl bg-gradient-to-br from-[#00E5FF]/20 to-[#D4A843]/20 border border-[#00E5FF]/30">
        <span className="text-4xl sm:text-5xl">🧠</span>
      </div>
      <h3 className="text-2xl sm:text-3xl font-black text-white mb-3">{t.step1Title}</h3>
      <p className="text-gray-300 text-sm sm:text-base max-w-sm leading-relaxed mb-6">{t.step1Desc}</p>
      <div className="flex gap-3 flex-wrap justify-center">
        {["ChatGPT", "Prompts", "Automatización", "Machine Learning"].map((tag) => (
          <span key={tag} className="px-3 py-1.5 bg-[#00E5FF]/10 border border-[#00E5FF]/30 rounded-full text-[#00E5FF] text-xs font-bold">{tag}</span>
        ))}
      </div>
    </div>,

    // Slide 2: Play & Win
    <div key="s2" className="flex flex-col items-center text-center px-4">
      <div className="w-20 h-20 sm:w-24 sm:h-24 mb-5 flex items-center justify-center rounded-2xl bg-gradient-to-br from-[#D4A843]/20 to-[#00E5FF]/20 border border-[#D4A843]/30">
        <span className="text-4xl sm:text-5xl">🏆</span>
      </div>
      <h3 className="text-2xl sm:text-3xl font-black text-white mb-3">{t.step2Title}</h3>
      <p className="text-gray-300 text-sm sm:text-base max-w-sm leading-relaxed mb-6">{t.step2Desc}</p>
      <div className="grid grid-cols-3 gap-3 w-full max-w-xs">
        <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-center">
          <span className="text-[#00E5FF] text-2xl font-black block">10</span>
          <span className="text-gray-400 text-[10px]">{tl(lang, { es: "Niveles", en: "Levels", zh: "等级", 'pt-BR': "Niveles", 'pt-PT': "Niveles" })}</span>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-center">
          <span className="text-[#D4A843] text-2xl font-black block">🪙</span>
          <span className="text-gray-400 text-[10px]">LinceCoins</span>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-center">
          <span className="text-[#00E5FF] text-2xl font-black block">🌍</span>
          <span className="text-gray-400 text-[10px]">Ranking</span>
        </div>
      </div>
    </div>,

    // Slide 3: Your AI Family
    <div key="s3" className="flex flex-col items-center text-center px-4">
      <h3 className="text-2xl sm:text-3xl font-black text-white mb-2">{t.step3Title}</h3>
      <p className="text-gray-300 text-sm max-w-sm leading-relaxed mb-5">{t.step3Desc}</p>
      <div className="flex items-end justify-center gap-2 sm:gap-3 mb-4">
        {SHOWCASE_AVATARS.map((av, i) => (
          <div key={av.key} className="flex flex-col items-center" style={{ animationDelay: `${i * 150}ms` }}>
            <div className={`rounded-full overflow-hidden border-2 shadow-lg ${i === 2 ? "w-16 h-16 sm:w-20 sm:h-20 border-[#00E5FF]" : i === 0 || i === 4 ? "w-10 h-10 sm:w-12 sm:h-12 border-[#D4A843]/50" : "w-12 h-12 sm:w-16 sm:h-16 border-[#00E5FF]/50"}`}>
              <img src={AVATAR_FRONTAL[av.key]} alt={av.name} className="w-full h-full object-cover" />
            </div>
            <span className="text-[9px] sm:text-[10px] text-gray-400 mt-1 font-medium">{av.name}</span>
            <span className="text-[8px] text-gray-600">{av.age}</span>
          </div>
        ))}
      </div>
      <p className="text-[#00E5FF] text-xs font-bold">
        {tl(lang, { es: "+11 personajes para cada generación", en: "+11 characters for every generation", zh: "+11个角色适合每一代", 'pt-BR': "+11 personajes para cada generación", 'pt-PT': "+11 personajes para cada generación" })}
      </p>
    </div>,
  ];

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      {/* Confetti particles */}
      {showConfetti && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {Array.from({ length: 30 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `-5%`,
                backgroundColor: ["#00E5FF", "#D4A843", "#00E5FF", "#76FF03", "#D4A843"][i % 5],
                animation: `confettiFall ${2 + Math.random() * 2}s ease-in forwards`,
                animationDelay: `${Math.random() * 1.5}s`,
              }}
            />
          ))}
        </div>
      )}

      {/* Modal card */}
      <div className="relative w-full max-w-lg bg-gradient-to-b from-[#0D0D12] to-[#0A0A0F] border border-white/10 rounded-3xl overflow-hidden shadow-[0_0_60px_rgba(0,229,255,0.15)]">
        {/* Top glow bar — LINCE colors */}
        <div className="h-1 bg-gradient-to-r from-[#00E5FF] via-[#D4A843] to-[#00E5FF]" />

        {/* Close/skip button */}
        <button
          onClick={onSkip}
          className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors z-10"
          aria-label="Close"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>

        {/* Slide content */}
        <div className={`px-6 pt-8 pb-4 min-h-[340px] sm:min-h-[380px] flex items-center justify-center transition-opacity duration-200 ${fadeIn ? "opacity-100" : "opacity-0"}`}>
          {slides[currentSlide]}
        </div>

        {/* Progress dots */}
        <div className="flex items-center justify-center gap-2 pb-4">
          {Array.from({ length: totalSlides }).map((_, i) => (
            <button
              key={i}
              onClick={() => goToSlide(i)}
              className={`rounded-full transition-all duration-300 ${
                i === currentSlide
                  ? "w-8 h-2.5 bg-[#00E5FF]"
                  : "w-2.5 h-2.5 bg-white/20 hover:bg-white/40"
              }`}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>

        {/* Navigation */}
        <div className="px-6 pb-6 flex items-center gap-3">
          {currentSlide > 0 && (
            <button
              onClick={prevSlide}
              className="flex-shrink-0 px-4 py-3 border border-white/10 rounded-xl text-gray-400 hover:text-white hover:border-white/30 transition-all text-sm font-bold"
            >
              {t.prev}
            </button>
          )}

          {currentSlide < totalSlides - 1 ? (
            <button
              onClick={nextSlide}
              className="flex-1 bg-gradient-to-r from-[#00E5FF] to-emerald-500 text-black font-black py-3.5 rounded-xl text-base hover:brightness-110 transition-all shadow-[0_0_20px_rgba(0,229,255,0.3)]"
            >
              {t.next}
            </button>
          ) : (
            <button
              onClick={onComplete}
              className="flex-1 bg-gradient-to-r from-[#00E5FF] to-[#D4A843] text-black font-black py-3.5 rounded-xl text-base hover:brightness-110 transition-all shadow-[0_0_25px_rgba(0,229,255,0.4)] animate-pulse"
            >
              {t.startBtn}
            </button>
          )}
        </div>

        {/* Skip link */}
        {currentSlide < totalSlides - 1 && (
          <div className="pb-5 text-center">
            <button onClick={onSkip} className="text-gray-500 hover:text-gray-300 text-xs transition-colors">
              {t.skipBtn}
            </button>
          </div>
        )}
      </div>

      {/* CSS for confetti animation */}
      <style>{`
        @keyframes confettiFall {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
      `}</style>
    </div>
  );
}

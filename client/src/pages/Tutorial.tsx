import { tl } from "@/contexts/PRDLanguageContext";
import { useState, useCallback } from "react";
import { useLocation } from "wouter";
import { AVATAR_FRONTAL } from "@/lib/avatarConstants";
import { ChevronRight, ChevronLeft, Sparkles, Gamepad2, Image, Brain, Users, Palette, Shield, Trophy, ArrowRight } from "lucide-react";

// ─── TUTORIAL STEPS ───
// Each step is a "slide" the user swipes through before playing.
// Written in plain, simple language so ANYONE can understand.

interface TutorialStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  accentColor: string;
  avatarKey?: keyof typeof AVATAR_FRONTAL;
  tip?: string;
}

const STEPS: Record<string, TutorialStep[]> = {
  es: [
    {
      id: "welcome",
      title: "Bienvenido a LINCE",
      description: "LINCE es una plataforma gamificada para aprender Inteligencia Artificial. No necesitas saber nada de tecnología. Aquí te explicamos todo lo que vas a encontrar.",
      icon: <Sparkles className="w-8 h-8" />,
      accentColor: "#00E5FF",
      avatarKey: "SABELIN",
      tip: "Este tutorial dura menos de 2 minutos. Cuando termines, estarás listo para jugar.",
    },
    {
      id: "avatars",
      title: "Los Avatares",
      description: "LINCE tiene más de 85 personajes. Cada uno es un experto en algo diferente: música, arte, tecnología, ciencia... Puedes hablar con ellos y te enseñan sobre IA como si fueran tus amigos.",
      icon: <Users className="w-8 h-8" />,
      accentColor: "#D4A843",
      avatarKey: "YAYALIN",
      tip: "Toca cualquier avatar para empezar una conversación. Pregúntale lo que quieras sobre IA.",
    },
    {
      id: "imagelin",
      title: "IMAGELIN — Crea imágenes con IA",
      description: "Escribe lo que quieres ver y la IA lo dibuja al instante. Por ejemplo: \"un gato con gafas de sol en la playa\". Así de fácil. No necesitas saber dibujar.",
      icon: <Image className="w-8 h-8" />,
      accentColor: "#9C27B0",
      avatarKey: "PEQUELINA",
      tip: "Cuanto más detallada sea tu descripción, mejor será la imagen. Prueba añadir colores, estilos y ambientes.",
    },
    {
      id: "lincelin",
      title: "LINCELIN — Diseña tu avatar",
      description: "Crea tu propio personaje lince personalizado. Elige un estilo (cyberpunk, fantasía, medieval...) y la IA genera un avatar único para ti. Es TU personaje en LINCE.",
      icon: <Palette className="w-8 h-8" />,
      accentColor: "#EC4899",
      avatarKey: "CHAVALINA",
      tip: "Puedes crear tantos avatares como quieras. Cada uno es diferente.",
    },
    {
      id: "promptlin",
      title: "PROMPTLIN — Aprende a hablar con la IA",
      description: "Un \"prompt\" es una instrucción que le das a la IA. Aquí aprendes a escribir prompts como un profesional. Hay 6 modos: Creativo, Técnico, Negocio, Ética, Speed Run y Batalla.",
      icon: <Brain className="w-8 h-8" />,
      accentColor: "#7C3AED",
      avatarKey: "ATOLONDRALIN",
      tip: "Esta es la habilidad más importante del futuro: saber comunicarte con la IA.",
    },
    {
      id: "arsenal",
      title: "Arsenal IA — Herramientas reales",
      description: "Un catálogo con más de 62 herramientas de IA reales: ChatGPT, Midjourney, DALL-E, Suno y muchas más. Cada una tiene una guía paso a paso para que aprendas a usarla.",
      icon: <Shield className="w-8 h-8" />,
      accentColor: "#00E5FF",
      avatarKey: "PAPALIN",
      tip: "Aquí aprendes las herramientas que se usan en el mundo real. Muy útil para tu trabajo o estudios.",
    },
    {
      id: "jugar",
      title: "¡JUGAR! — Niveles y aventuras",
      description: "LINCE tiene niveles como un videojuego. Empiezas en el Nivel 1 y vas avanzando. Cada nivel te enseña algo nuevo sobre IA. Ganas puntos (XP), monedas (LinceCoins) y subes en el ranking.",
      icon: <Gamepad2 className="w-8 h-8" />,
      accentColor: "#00FF88",
      avatarKey: "CHAVALIN",
      tip: "Nivel 1: Tu primer prompt. Nivel 2: Construye tu habitación virtual. Nivel 3: Combate PvP.",
    },
    {
      id: "rewards",
      title: "Recompensas y progresión",
      description: "Todo lo que haces en LINCE te da recompensas. Ganas XP para subir de nivel, LinceCoins para comprar cosas en el Mercado, y puedes mantener tu racha diaria para ganar bonificaciones extra.",
      icon: <Trophy className="w-8 h-8" />,
      accentColor: "#FFB300",
      avatarKey: "MAMALINA",
      tip: "Entra cada día para mantener tu racha y ganar recompensas extra.",
    },
    {
      id: "ready",
      title: "¡Estás listo para empezar!",
      description: "Ya conoces todo lo que LINCE tiene para ti. Ahora elige por dónde quieres empezar: habla con un avatar, crea una imagen, o lánzate directo a jugar. La aventura empieza ahora.",
      icon: <Sparkles className="w-8 h-8" />,
      accentColor: "#00E5FF",
      avatarKey: "SABELIN",
    },
  ],
  en: [
    {
      id: "welcome",
      title: "Welcome to LINCE",
      description: "LINCE is a gamified platform for learning Artificial Intelligence. You don't need to know anything about technology. Here we explain everything you'll find.",
      icon: <Sparkles className="w-8 h-8" />,
      accentColor: "#00E5FF",
      avatarKey: "SABELIN",
      tip: "This tutorial takes less than 2 minutes. When you finish, you'll be ready to play.",
    },
    {
      id: "avatars",
      title: "The Avatars",
      description: "LINCE has over 85 characters. Each one is an expert in something different: music, art, technology, science... You can talk to them and they teach you about AI like friends.",
      icon: <Users className="w-8 h-8" />,
      accentColor: "#D4A843",
      avatarKey: "YAYALIN",
      tip: "Tap any avatar to start a conversation. Ask them anything about AI.",
    },
    {
      id: "imagelin",
      title: "IMAGELIN — Create images with AI",
      description: "Write what you want to see and AI draws it instantly. For example: \"a cat with sunglasses on the beach\". That easy. No drawing skills needed.",
      icon: <Image className="w-8 h-8" />,
      accentColor: "#9C27B0",
      avatarKey: "PEQUELINA",
      tip: "The more detailed your description, the better the image. Try adding colors, styles and environments.",
    },
    {
      id: "lincelin",
      title: "LINCELIN — Design your avatar",
      description: "Create your own custom lynx character. Choose a style (cyberpunk, fantasy, medieval...) and AI generates a unique avatar for you. It's YOUR character in LINCE.",
      icon: <Palette className="w-8 h-8" />,
      accentColor: "#EC4899",
      avatarKey: "CHAVALINA",
      tip: "You can create as many avatars as you want. Each one is different.",
    },
    {
      id: "promptlin",
      title: "PROMPTLIN — Learn to talk to AI",
      description: "A \"prompt\" is an instruction you give to AI. Here you learn to write prompts like a pro. There are 6 modes: Creative, Technical, Business, Ethics, Speed Run and Battle.",
      icon: <Brain className="w-8 h-8" />,
      accentColor: "#7C3AED",
      avatarKey: "ATOLONDRALIN",
      tip: "This is the most important skill of the future: knowing how to communicate with AI.",
    },
    {
      id: "arsenal",
      title: "AI Arsenal — Real tools",
      description: "A catalog of 62+ real AI tools: ChatGPT, Midjourney, DALL-E, Suno and many more. Each has a step-by-step guide so you learn to use it.",
      icon: <Shield className="w-8 h-8" />,
      accentColor: "#00E5FF",
      avatarKey: "PAPALIN",
      tip: "Learn the tools used in the real world. Very useful for work or studies.",
    },
    {
      id: "jugar",
      title: "PLAY! — Levels and adventures",
      description: "LINCE has levels like a video game. Start at Level 1 and progress. Each level teaches something new about AI. Earn XP, LinceCoins and climb the ranking.",
      icon: <Gamepad2 className="w-8 h-8" />,
      accentColor: "#00FF88",
      avatarKey: "CHAVALIN",
      tip: "Level 1: Your first prompt. Level 2: Build your virtual room. Level 3: PvP combat.",
    },
    {
      id: "rewards",
      title: "Rewards and progression",
      description: "Everything you do in LINCE gives you rewards. Earn XP to level up, LinceCoins to buy things in the Market, and maintain your daily streak for extra bonuses.",
      icon: <Trophy className="w-8 h-8" />,
      accentColor: "#FFB300",
      avatarKey: "MAMALINA",
      tip: "Log in every day to keep your streak and earn extra rewards.",
    },
    {
      id: "ready",
      title: "You're ready to start!",
      description: "Now you know everything LINCE has for you. Choose where to begin: talk to an avatar, create an image, or jump straight into playing. The adventure starts now.",
      icon: <Sparkles className="w-8 h-8" />,
      accentColor: "#00E5FF",
      avatarKey: "SABELIN",
    },
  ],
  zh: [
    {
      id: "welcome",
      title: "欢迎来到LINCE",
      description: "LINCE是一个游戏化的人工智能学习平台。你不需要任何技术知识。这里我们会解释你将发现的一切。",
      icon: <Sparkles className="w-8 h-8" />,
      accentColor: "#00E5FF",
      avatarKey: "SABELIN",
      tip: "本教程不到2分钟。完成后，你就可以开始玩了。",
    },
    {
      id: "avatars",
      title: "虚拟角色",
      description: "LINCE有超过85个角色。每个都是不同领域的专家：音乐、艺术、技术、科学...你可以和他们交谈，他们像朋友一样教你AI。",
      icon: <Users className="w-8 h-8" />,
      accentColor: "#D4A843",
      avatarKey: "YAYALIN",
      tip: "点击任何角色开始对话。问他们任何关于AI的问题。",
    },
    {
      id: "imagelin",
      title: "IMAGELIN — 用AI创作图像",
      description: "写下你想看到的，AI立即绘制。例如：\"戴太阳镜的猫在海滩上\"。就这么简单。不需要绘画技能。",
      icon: <Image className="w-8 h-8" />,
      accentColor: "#9C27B0",
      avatarKey: "PEQUELINA",
      tip: "描述越详细，图像越好。试着添加颜色、风格和环境。",
    },
    {
      id: "lincelin",
      title: "LINCELIN — 设计你的角色",
      description: "创建你自己的定制猞猁角色。选择风格（赛博朋克、奇幻、中世纪...），AI为你生成独特的角色。",
      icon: <Palette className="w-8 h-8" />,
      accentColor: "#EC4899",
      avatarKey: "CHAVALINA",
      tip: "你可以创建任意数量的角色。每个都不同。",
    },
    {
      id: "promptlin",
      title: "PROMPTLIN — 学会与AI对话",
      description: "\"提示词\"是你给AI的指令。这里你学习像专业人士一样写提示词。有6种模式：创意、技术、商业、伦理、速度赛和对战。",
      icon: <Brain className="w-8 h-8" />,
      accentColor: "#7C3AED",
      avatarKey: "ATOLONDRALIN",
      tip: "这是未来最重要的技能：知道如何与AI沟通。",
    },
    {
      id: "arsenal",
      title: "AI武器库 — 真实工具",
      description: "62+真实AI工具目录：ChatGPT、Midjourney、DALL-E、Suno等。每个都有分步指南。",
      icon: <Shield className="w-8 h-8" />,
      accentColor: "#00E5FF",
      avatarKey: "PAPALIN",
      tip: "学习现实世界中使用的工具。对工作或学习非常有用。",
    },
    {
      id: "jugar",
      title: "玩游戏！— 关卡和冒险",
      description: "LINCE有像电子游戏一样的关卡。从第1关开始逐步前进。每关教你AI的新知识。赚取XP、LinceCoins并攀升排名。",
      icon: <Gamepad2 className="w-8 h-8" />,
      accentColor: "#00FF88",
      avatarKey: "CHAVALIN",
      tip: "第1关：你的第一个提示词。第2关：建造虚拟房间。第3关：PvP战斗。",
    },
    {
      id: "rewards",
      title: "奖励和进度",
      description: "在LINCE做的一切都有奖励。赚取XP升级，LinceCoins在商店购物，保持每日连续登录获得额外奖励。",
      icon: <Trophy className="w-8 h-8" />,
      accentColor: "#FFB300",
      avatarKey: "MAMALINA",
      tip: "每天登录保持连续记录，获得额外奖励。",
    },
    {
      id: "ready",
      title: "你已经准备好了！",
      description: "现在你知道LINCE为你准备的一切。选择从哪里开始：与角色交谈、创建图像，或直接开始游戏。冒险现在开始。",
      icon: <Sparkles className="w-8 h-8" />,
      accentColor: "#00E5FF",
      avatarKey: "SABELIN",
    },
  ],
};

const LABELS: Record<string, Record<string, string>> = {
  es: { next: "Siguiente", prev: "Anterior", skip: "Saltar tutorial", start: "¡EMPEZAR A JUGAR!", goHome: "Ir al inicio", goPlay: "¡JUGAR!" },
  en: { next: "Next", prev: "Previous", skip: "Skip tutorial", start: "START PLAYING!", goHome: "Go to home", goPlay: "PLAY!" },
  zh: { next: "下一步", prev: "上一步", skip: "跳过教程", start: "开始玩！", goHome: "回到首页", goPlay: "玩游戏！" },
};

function getLang(): "es" | "en" | "zh" {
  try {
    const saved = localStorage.getItem("lince-prd-lang");
    if (saved === "en" || saved === "zh") return saved;
  } catch {}
  return "es";
}

export default function Tutorial() {
  const [, navigate] = useLocation();
  const [lang] = useState(getLang);
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState<"next" | "prev">("next");

  const steps = STEPS[lang] || STEPS.es;
  const labels = LABELS[lang] || LABELS.es;
  const step = steps[currentStep];
  const isFirst = currentStep === 0;
  const isLast = currentStep === steps.length - 1;

  const goNext = useCallback(() => {
    if (isLast) {
      // Mark tutorial as completed
      localStorage.setItem("lince-tutorial-completed", "true");
      navigate("/jugar");
      return;
    }
    setDirection("next");
    setCurrentStep((prev) => prev + 1);
  }, [isLast, navigate]);

  const goPrev = useCallback(() => {
    if (isFirst) return;
    setDirection("prev");
    setCurrentStep((prev) => prev - 1);
  }, [isFirst]);

  const skip = useCallback(() => {
    localStorage.setItem("lince-tutorial-completed", "true");
    navigate("/jugar");
  }, [navigate]);

  // Touch swipe support
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const handleTouchStart = (e: React.TouchEvent) => setTouchStart(e.touches[0].clientX);
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    const diff = touchStart - e.changedTouches[0].clientX;
    if (diff > 60) goNext();
    else if (diff < -60) goPrev();
    setTouchStart(null);
  };

  return (
    <div
      className="min-h-screen bg-[#0A0A0A] text-white flex flex-col"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Header */}
      <header className="border-b border-[#00E5FF]/10 bg-[#0A0A0A]/95 backdrop-blur-md sticky top-0 z-50">
        <div className="container px-4 py-3 flex items-center justify-between">
          <span className="font-['Space_Grotesk'] font-bold text-lg">
            <span className="text-[#00E5FF]">LINCE</span>
          </span>
          <button onClick={skip} className="text-gray-500 text-xs hover:text-gray-300 transition-colors">
            {labels.skip}
          </button>
        </div>
      </header>

      {/* Progress bar */}
      <div className="w-full bg-white/5 h-1.5">
        <div
          className="h-full transition-all duration-500 ease-out rounded-r-full"
          style={{
            width: `${((currentStep + 1) / steps.length) * 100}%`,
            backgroundColor: step.accentColor,
            boxShadow: `0 0 10px ${step.accentColor}60`,
          }}
        />
      </div>

      {/* Main content */}
      <div className="flex-1 flex items-center justify-center px-4 py-6">
        <div className="max-w-lg w-full">
          {/* Step counter */}
          <div className="flex items-center justify-center gap-2 mb-6">
            {steps.map((_, i) => (
              <button
                key={i}
                onClick={() => { setDirection(i > currentStep ? "next" : "prev"); setCurrentStep(i); }}
                className="transition-all duration-300"
                style={{
                  width: i === currentStep ? "28px" : "8px",
                  height: "8px",
                  borderRadius: "4px",
                  backgroundColor: i === currentStep ? step.accentColor : i < currentStep ? `${step.accentColor}60` : "#374151",
                }}
              />
            ))}
          </div>

          {/* Avatar */}
          {step.avatarKey && AVATAR_FRONTAL[step.avatarKey] && (
            <div className="flex justify-center mb-5">
              <div
                className="w-24 h-24 rounded-full overflow-hidden border-3 transition-all duration-500"
                style={{
                  borderColor: `${step.accentColor}80`,
                  boxShadow: `0 0 30px ${step.accentColor}25`,
                }}
              >
                <img
                  src={AVATAR_FRONTAL[step.avatarKey]}
                  alt={step.avatarKey}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          )}

          {/* Icon */}
          <div className="flex justify-center mb-4">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-500"
              style={{
                backgroundColor: `${step.accentColor}15`,
                color: step.accentColor,
                boxShadow: `0 0 20px ${step.accentColor}10`,
              }}
            >
              {step.icon}
            </div>
          </div>

          {/* Title */}
          <h1
            className="text-center font-['Space_Grotesk'] font-black text-2xl sm:text-3xl mb-4 transition-colors duration-500"
            style={{ color: step.accentColor }}
          >
            {step.title}
          </h1>

          {/* Description */}
          <p className="text-center text-gray-300 text-base sm:text-lg leading-relaxed mb-5 max-w-md mx-auto">
            {step.description}
          </p>

          {/* Tip box */}
          {step.tip && (
            <div
              className="mx-auto max-w-md rounded-xl p-4 mb-6 transition-all duration-500"
              style={{
                backgroundColor: `${step.accentColor}08`,
                border: `1px solid ${step.accentColor}20`,
              }}
            >
              <p className="text-sm text-gray-400 text-center">
                <span style={{ color: step.accentColor }} className="font-bold">
                  {tl(lang, { es: "Consejo", en: "Tip", zh: "提示", 'pt-BR': "Consejo", 'pt-PT': "Consejo" })}:
                </span>{" "}
                {step.tip}
              </p>
            </div>
          )}

          {/* Last step: action buttons */}
          {isLast && (
            <div className="flex flex-col gap-3 max-w-sm mx-auto mb-4">
              <button
                onClick={() => { localStorage.setItem("lince-tutorial-completed", "true"); navigate("/jugar"); }}
                className="w-full py-4 rounded-xl font-black text-lg text-black bg-[#00E5FF] hover:brightness-110 transition-all shadow-[0_0_30px_rgba(0,229,255,0.3)] flex items-center justify-center gap-2"
              >
                {labels.goPlay} <Gamepad2 className="w-5 h-5" />
              </button>
              <button
                onClick={() => { localStorage.setItem("lince-tutorial-completed", "true"); navigate("/home"); }}
                className="w-full py-3 rounded-xl font-bold text-sm text-gray-400 border border-white/10 hover:bg-white/5 transition-all"
              >
                {labels.goHome}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Navigation buttons */}
      <div className="border-t border-white/5 bg-[#0A0A0A]/95 backdrop-blur-md">
        <div className="container px-4 py-4 flex items-center justify-between max-w-lg mx-auto">
          <button
            onClick={goPrev}
            disabled={isFirst}
            className={`flex items-center gap-1 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
              isFirst
                ? "text-gray-700 cursor-not-allowed"
                : "text-gray-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            {labels.prev}
          </button>

          <span className="text-gray-600 text-xs font-mono">
            {currentStep + 1} / {steps.length}
          </span>

          {!isLast ? (
            <button
              onClick={goNext}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold text-black transition-all hover:brightness-110 active:scale-95"
              style={{ backgroundColor: step.accentColor }}
            >
              {labels.next}
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={() => { localStorage.setItem("lince-tutorial-completed", "true"); navigate("/jugar"); }}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold text-black bg-[#00E5FF] transition-all hover:brightness-110 active:scale-95"
            >
              {labels.start}
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

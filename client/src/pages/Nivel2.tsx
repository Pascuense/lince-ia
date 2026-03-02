import { useState, useRef, useEffect } from "react";
import { useGame, type PromptResult } from "@/contexts/GameContext";
import { useGameLang } from "@/hooks/useGameLang";
import { AVATAR_FRONTAL, AVATAR_EXPRESSIONS, MUNDO_IMAGES } from "@/lib/avatarConstants";
import { Link, useLocation } from "wouter";
import RequireLogin from "@/components/RequireLogin";
import { GameLanguageSelector } from "@/components/GameLanguageSelector";
import { UserNavBadge } from "@/components/UserNavBadge";
import { TheoryLessonCard } from "@/components/TheoryLesson";
import { OptimalPromptFeedback } from "@/components/OptimalPromptFeedback";
import { DifficultyBadge } from "@/components/DifficultyBadge";
import { LEVEL2_THEORY, OPTIMAL_PROMPTS } from "@/lib/gameConstants";
import { GlobalNavBar } from "@/components/GlobalNavBar";
import { BackButton } from "@/components/BackButton";

// Room visual states — each prompt adds a layer
const ROOM_LAYERS = [
  { bg: "oklch(0.12 0.01 240)", label: "empty" },
  { bg: "linear-gradient(135deg, oklch(0.14 0.02 240), oklch(0.18 0.03 220))", label: "styled" },
  { bg: "linear-gradient(135deg, oklch(0.16 0.03 220), oklch(0.20 0.04 200))", label: "furnished" },
  { bg: "linear-gradient(135deg, oklch(0.18 0.04 200), oklch(0.22 0.05 180))", label: "decorated" },
];

const FURNITURE_ICONS = ["🛋️", "🪑", "📚", "🖥️", "🎮", "🎸", "🏮", "🪴", "🖼️", "🧸", "🕹️", "💡", "🎨", "🔮", "🌙"];
const DECOR_ICONS = ["🌿", "🎭", "🕯️", "📸", "🎪", "🌈", "✨", "🦋", "🌸", "🎵", "💎", "🌟", "🎀", "🏆", "🧩"];

const T: Record<string, Record<string, string>> = {
  es: {
    title: "NIVEL 2 — Tu Primera Habitación",
    subtitle: "Mundo LINCE · Construye con Prompts",
    locked: "Nivel bloqueado. Completa el Nivel 1 primero.",
    guideWelcome: "¡Bienvenido al Mundo LINCE! Soy MAMALINA, la madre de la familia. Aquí vas a construir tu propia habitación usando prompts.",
    guideExplain: "Tu casa está vacía ahora mismo. Con cada prompt que escribas, la habitación irá tomando forma. Primero el estilo, luego los muebles, y por último la decoración personal.",
    mission1Title: "Misión 1: Elige el estilo",
    mission1Desc: "Describe el estilo de tu habitación ideal. ¿Futurista con luces neón? ¿Acogedora con madera natural? ¿Minimalista japonesa? Cuantos más detalles, más bonita quedará.",
    mission1Hint: "Ejemplo: \"Quiero una habitación futurista con paredes oscuras, luces cyan en los bordes, suelo de cristal negro y un techo que parece el espacio\"",
    mission2Title: "Misión 2: Añade un mueble especial",
    mission2Desc: "Ahora añade un mueble único a tu habitación. No vale uno normal: tiene que ser especial, con algún poder o característica mágica. ¡Usa tu imaginación!",
    mission2Hint: "Ejemplo: \"Un escritorio holográfico flotante que proyecta pantallas de luz cyan, con cajones que se abren con comandos de voz\"",
    mission3Title: "Misión 3: Decoración personal",
    mission3Desc: "El toque final: añade decoración que haga la habitación TUYA. Cuadros, plantas, recuerdos, colores... lo que tú quieras. ¡Hazla única!",
    mission3Hint: "Ejemplo: \"Cuelga un cuadro holográfico que cambia de imagen según tu estado de ánimo, una planta bioluminiscente que brilla de noche, y una alfombra que reacciona a la música\"",
    placeholder: "Describe tu habitación...",
    send: "Construir ✨",
    next: "Siguiente Paso →",
    roomEmpty: "Tu habitación está vacía...",
    roomStyled: "¡El estilo está tomando forma!",
    roomFurnished: "¡Los muebles están en su sitio!",
    roomDecorated: "¡Tu habitación está completa!",
    excellent: "¡ESPECTACULAR! 🌟 MAMALINA está encantada con tu diseño.",
    great: "¡MUY BONITO! 🎉 Tu habitación tiene mucho estilo.",
    good: "¡BIEN! 👍 Buena descripción. Más detalles la harían perfecta.",
    ok: "ACEPTABLE 🤔 Funciona, pero podrías describir más detalles.",
    tryAgain: "INTENTA DE NUEVO 💪 Necesita más detalles para construir.",
    score: "Puntuación",
    coins: "LinceCoins",
    xp: "XP",
    levelComplete: "¡NIVEL 2 COMPLETADO!",
    levelCompleteDesc: "Has construido tu primera habitación. ¡Ahora toca defenderla en tu primer Raid!",
    totalRewards: "Recompensas totales",
    continueToLevel3: "Ir al Nivel 3 →",
    backToHub: "← Volver al Mapa",
    missionOf: "Paso {current} de {total}",
    yourRoom: "Tu Habitación",
  },
  en: {
    title: "LEVEL 2 — Your First Room",
    subtitle: "World LINCE · Build with Prompts",
    locked: "Level locked. Complete Level 1 first.",
    guideWelcome: "Welcome to World LINCE! I'm MAMALINA, the family mother. Here you'll build your own room using prompts.",
    guideExplain: "Your house is empty right now. With each prompt you write, the room will take shape. First the style, then furniture, and finally personal decoration.",
    mission1Title: "Mission 1: Choose the style",
    mission1Desc: "Describe the style of your ideal room. Futuristic with neon lights? Cozy with natural wood? Japanese minimalist? The more details, the prettier it will be.",
    mission1Hint: "Example: \"I want a futuristic room with dark walls, cyan lights on the edges, black crystal floor and a ceiling that looks like space\"",
    mission2Title: "Mission 2: Add a special furniture",
    mission2Desc: "Now add a unique piece of furniture. It can't be normal: it has to be special, with some power or magical feature. Use your imagination!",
    mission2Hint: "Example: \"A floating holographic desk that projects cyan light screens, with drawers that open with voice commands\"",
    mission3Title: "Mission 3: Personal decoration",
    mission3Desc: "The final touch: add decoration that makes the room YOURS. Paintings, plants, memories, colors... whatever you want. Make it unique!",
    mission3Hint: "Example: \"Hang a holographic painting that changes based on your mood, a bioluminescent plant that glows at night, and a rug that reacts to music\"",
    placeholder: "Describe your room...",
    send: "Build ✨",
    next: "Next Step →",
    roomEmpty: "Your room is empty...",
    roomStyled: "The style is taking shape!",
    roomFurnished: "The furniture is in place!",
    roomDecorated: "Your room is complete!",
    excellent: "SPECTACULAR! 🌟 MAMALINA loves your design.",
    great: "BEAUTIFUL! 🎉 Your room has great style.",
    good: "GOOD! 👍 Nice description. More details would make it perfect.",
    ok: "ACCEPTABLE 🤔 It works, but you could describe more details.",
    tryAgain: "TRY AGAIN 💪 Needs more details to build.",
    score: "Score",
    coins: "LinceCoins",
    xp: "XP",
    levelComplete: "LEVEL 2 COMPLETED!",
    levelCompleteDesc: "You've built your first room. Now it's time to defend it in your first Raid!",
    totalRewards: "Total rewards",
    continueToLevel3: "Go to Level 3 →",
    backToHub: "← Back to Map",
    missionOf: "Step {current} of {total}",
    yourRoom: "Your Room",
  },
  zh: {
    title: "第2关 — 你的第一个房间",
    subtitle: "LINCE世界 · 用提示词建造",
    locked: "关卡已锁定。请先完成第1关。",
    guideWelcome: "欢迎来到LINCE世界！我是MAMALINA，家族的母亲。在这里你将用提示词建造自己的房间。",
    guideExplain: "你的房子现在是空的。每写一个提示词，房间就会逐渐成形。先是风格，然后是家具，最后是个人装饰。",
    mission1Title: "任务1：选择风格",
    mission1Desc: "描述你理想房间的风格。霓虹灯的未来风？温暖的天然木材？日式极简？细节越多越漂亮。",
    mission1Hint: "示例：\"我想要一个未来风格的房间，深色墙壁，边缘有青色灯光，黑色水晶地板和看起来像太空的天花板\"",
    mission2Title: "任务2：添加特殊家具",
    mission2Desc: "现在添加一件独特的家具。不能是普通的：必须是特别的，有某种魔力或特征。发挥你的想象力！",
    mission2Hint: "示例：\"一张悬浮的全息桌子，投射青色光屏，抽屉可以用语音命令打开\"",
    mission3Title: "任务3：个人装饰",
    mission3Desc: "最后的点缀：添加让房间成为你的装饰。画作、植物、回忆、颜色...你想要什么都行。让它独一无二！",
    mission3Hint: "示例：\"挂一幅根据心情变化的全息画，一株夜间发光的生物荧光植物，和一块对音乐有反应的地毯\"",
    placeholder: "描述你的房间...",
    send: "建造 ✨",
    next: "下一步 →",
    roomEmpty: "你的房间是空的...",
    roomStyled: "风格正在成形！",
    roomFurnished: "家具已就位！",
    roomDecorated: "你的房间完成了！",
    excellent: "太壮观了！🌟 MAMALINA喜欢你的设计。",
    great: "很漂亮！🎉 你的房间很有风格。",
    good: "不错！👍 好的描述。更多细节会更完美。",
    ok: "可以接受 🤔 有效，但可以描述更多细节。",
    tryAgain: "再试一次 💪 需要更多细节来建造。",
    score: "分数",
    coins: "LinceCoins",
    xp: "XP",
    levelComplete: "第2关完成！",
    levelCompleteDesc: "你已经建造了第一个房间。现在是时候在你的第一次突袭中保卫它了！",
    totalRewards: "总奖励",
    continueToLevel3: "前往第3关 →",
    backToHub: "← 返回地图",
    missionOf: "步骤 {current} / {total}",
    yourRoom: "你的房间",
  },
};

function Nivel2Content() {
  const { lang } = useGameLang();
  const t = T[lang] || T.es;
  const { evaluatePrompt, completeLevel, addCoins, addXP, isLevelUnlocked, getLevelState } = useGame();
  const [, navigate] = useLocation();

  const [phase, setPhase] = useState<"intro" | "theory" | "playing" | "complete">("intro");
  const [currentMission, setCurrentMission] = useState(1);
  const [promptText, setPromptText] = useState("");
  const [lastResult, setLastResult] = useState<PromptResult | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [totalCoins, setTotalCoins] = useState(0);
  const [totalXP, setTotalXP] = useState(0);
  const [introStep, setIntroStep] = useState(0);
  const [roomItems, setRoomItems] = useState<string[]>([]);
  const [isBuilding, setIsBuilding] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const unlocked = isLevelUnlocked(2);

  const missions = [
    { title: t.mission1Title, desc: t.mission1Desc, hint: t.mission1Hint },
    { title: t.mission2Title, desc: t.mission2Desc, hint: t.mission2Hint },
    { title: t.mission3Title, desc: t.mission3Desc, hint: t.mission3Hint },
  ];

  const introTexts = [t.guideWelcome, t.guideExplain];
  const roomLabels = [t.roomEmpty, t.roomStyled, t.roomFurnished, t.roomDecorated];

  useEffect(() => {
    if (phase === "playing" && textareaRef.current && !showResult) {
      textareaRef.current.focus();
    }
  }, [phase, currentMission, showResult]);

  // Add random items to room on each mission complete
  const addRoomItems = (missionId: number) => {
    const icons = missionId === 2 ? FURNITURE_ICONS : DECOR_ICONS;
    const count = Math.floor(Math.random() * 3) + 3;
    const newItems: string[] = [];
    for (let i = 0; i < count; i++) {
      newItems.push(icons[Math.floor(Math.random() * icons.length)]);
    }
    setRoomItems(prev => [...prev, ...newItems]);
  };

  const handleSubmitPrompt = () => {
    if (!promptText.trim()) return;
    setIsBuilding(true);
    setShowResult(false);

    setTimeout(() => {
      const result = evaluatePrompt(promptText, 2, currentMission);
      setLastResult(result);
      addCoins(result.coins);
      addXP(result.xp);
      setTotalCoins(prev => prev + result.coins);
      setTotalXP(prev => prev + result.xp);
      if (currentMission >= 2) addRoomItems(currentMission);
      setIsBuilding(false);
      setShowResult(true);
    }, 2000);
  };

  const handleNextMission = () => {
    if (currentMission < 3) {
      setCurrentMission(prev => prev + 1);
      setPromptText("");
      setLastResult(null);
      setShowResult(false);
      setPhase("theory");
    } else {
      const avgScore = totalCoins > 0 ? Math.round((totalCoins / 150) * 100) : 50;
      const stars = avgScore >= 80 ? 3 : avgScore >= 50 ? 2 : 1;
      completeLevel(2, stars);
      setPhase("complete");
    }
  };

  if (!unlocked) {
    return (
      <div className="min-h-screen bg-[oklch(0.10_0.01_240)] text-white flex items-center justify-center">
      <BackButton variant="inline" fallbackPath="/jugar" />
      <GlobalNavBar />
        <div className="text-center px-6">
          <div className="text-8xl mb-6">🔒</div>
          <p className="text-gray-400 text-xl sm:text-2xl mb-8 leading-relaxed">{t.locked}</p>
          <Link href="/jugar" className="px-8 py-4 bg-[oklch(0.82_0.15_195)] text-black font-black rounded-2xl text-xl min-h-[56px] inline-flex items-center">{t.backToHub}</Link>
        </div>
      </div>
    );
  }

  // ─── INTRO ───
  if (phase === "intro") {
    return (
      <div className="min-h-screen bg-[oklch(0.10_0.01_240)] text-white">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 pt-32 sm:pt-36 pb-20">
          <div className="flex items-center justify-between mb-8">
            <Link href="/jugar" className="text-[oklch(0.82_0.15_195)] text-base sm:text-lg font-bold hover:underline min-h-[44px] flex items-center">{t.backToHub}</Link>
            <UserNavBadge variant="compact" />
          </div>
          <div className="text-center mb-10">
            <div className="flex items-center justify-center gap-2 mb-4">
              <span className="inline-block px-5 py-2 rounded-full bg-[oklch(0.35_0.08_150)]/20 text-[oklch(0.82_0.15_195)] text-sm sm:text-base font-bold tracking-wider">🏠 {t.subtitle}</span>
              <DifficultyBadge difficulty="medium" lang={lang} size="sm" />
            </div>
            <h1 className="text-4xl md:text-5xl font-black">{t.title}</h1>
          </div>
          <div className="flex flex-col items-center gap-8">
            <div className="w-48 h-48 sm:w-56 sm:h-56 rounded-full overflow-hidden border-4 border-[oklch(0.72_0.12_75)] shadow-[0_0_40px_oklch(0.72_0.12_75/0.3)]">
              <img src={AVATAR_FRONTAL.MAMALINA} alt="MAMALINA" className="w-full h-full object-cover" />
            </div>
            <div className="bg-[oklch(0.14_0.015_240)] border border-[oklch(0.72_0.12_75)]/30 rounded-2xl p-6 sm:p-8 max-w-lg relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-[oklch(0.14_0.015_240)] border-l border-t border-[oklch(0.72_0.12_75)]/30 rotate-45" />
              <p className="text-xl sm:text-2xl leading-relaxed text-gray-200">{introTexts[introStep]}</p>
            </div>
            <button
              onClick={() => {
                if (introStep < 1) setIntroStep(prev => prev + 1);
                else setPhase("theory");
              }}
              className="px-10 py-4 sm:py-5 bg-[oklch(0.72_0.12_75)] text-black font-black rounded-2xl hover:brightness-110 transition-all text-xl sm:text-2xl min-h-[56px] min-w-[200px]"
            >
              {introStep < 1 ? "Siguiente →" : "¡Construir! 🏠"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ─── THEORY LESSON ───
  if (phase === "theory") {
    const theoryLesson = LEVEL2_THEORY[currentMission - 1];
    return (
      <div className="min-h-screen bg-[oklch(0.10_0.01_240)] text-white">
        <div className="max-w-2xl mx-auto px-4 pt-8 pb-16">
          <div className="flex items-center justify-between mb-6">
            <Link href="/jugar" className="text-[oklch(0.82_0.15_195)] text-sm hover:underline">{t.backToHub}</Link>
            <div className="flex items-center gap-2">
              <DifficultyBadge difficulty="medium" lang={lang} size="sm" />
              <UserNavBadge variant="compact" />
            </div>
          </div>
          <TheoryLessonCard
            lesson={theoryLesson}
            lang={lang}
            missionNumber={currentMission}
            onContinue={() => setPhase("playing")}
            accentColor="oklch(0.72 0.12 75)"
          />
        </div>
      </div>
    );
  }

  // ─── COMPLETE ───
  if (phase === "complete") {
    const levelState = getLevelState(2);
    return (
      <div className="min-h-screen bg-[oklch(0.10_0.01_240)] text-white flex items-center justify-center">
        <div className="max-w-lg mx-auto px-4 text-center">
          <div className="w-40 h-40 sm:w-48 sm:h-48 mx-auto rounded-full overflow-hidden border-4 border-[oklch(0.72_0.12_75)] shadow-[0_0_50px_oklch(0.72_0.12_75/0.4)] mb-8">
            <img src={AVATAR_EXPRESSIONS.MAMALINA?.celebrando || AVATAR_FRONTAL.MAMALINA} alt="MAMALINA" className="w-full h-full object-cover" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-[oklch(0.72_0.12_75)] mb-4">🏠 {t.levelComplete}</h1>
          <p className="text-gray-300 text-xl sm:text-2xl mb-10 leading-relaxed">{t.levelCompleteDesc}</p>
          <div className="bg-[oklch(0.14_0.015_240)] border border-[oklch(0.72_0.12_75)]/30 rounded-2xl p-6 sm:p-8 mb-10">
            <h3 className="text-base text-gray-400 uppercase tracking-wider mb-6 font-bold">{t.totalRewards}</h3>
            <div className="flex justify-center gap-8 sm:gap-12">
              <div>
                <div className="text-4xl sm:text-5xl font-black text-[oklch(0.72_0.12_75)]">🪙 {totalCoins}</div>
                <div className="text-sm text-gray-400 mt-2">LinceCoins</div>
              </div>
              <div>
                <div className="text-4xl sm:text-5xl font-black text-[oklch(0.82_0.15_195)]">⚡ {totalXP}</div>
                <div className="text-sm text-gray-400 mt-2">XP</div>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <Link href="/jugar/nivel-3" className="block px-8 py-5 bg-[oklch(0.82_0.15_195)] text-black font-black rounded-2xl hover:brightness-110 transition-all text-xl sm:text-2xl text-center min-h-[60px]">
              {t.continueToLevel3}
            </Link>
            <Link href="/jugar" className="block px-6 py-4 border-2 border-gray-600 text-gray-300 rounded-2xl hover:bg-white/5 transition-all text-center text-lg font-bold min-h-[56px]">
              {t.backToHub}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ─── PLAYING ───
  const mission = missions[currentMission - 1];
  const roomLayer = ROOM_LAYERS[currentMission - (showResult ? 0 : 1)] || ROOM_LAYERS[0];

  return (
    <div className="min-h-screen bg-[oklch(0.10_0.01_240)] text-white">
      <GlobalNavBar />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-32 sm:pt-36 pb-20">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Link href="/jugar" className="text-[oklch(0.82_0.15_195)] text-base sm:text-lg font-bold hover:underline min-h-[44px] flex items-center">{t.backToHub}</Link>
          <div className="flex items-center gap-3 sm:gap-4">
            <DifficultyBadge difficulty="medium" lang={lang} />
            <GameLanguageSelector variant="pill" />
            <span className="text-base font-bold text-[oklch(0.72_0.12_75)]">🪙 {totalCoins}</span>
            <span className="text-base font-bold text-[oklch(0.82_0.15_195)]">⚡ {totalXP}</span>
          </div>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between text-sm sm:text-base text-gray-400 mb-3">
            <span className="font-bold">{t.missionOf.replace("{current}", String(currentMission)).replace("{total}", "3")}</span>
          </div>
          <div className="h-3 bg-[oklch(0.18_0.01_240)] rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-[oklch(0.35_0.08_150)] to-[oklch(0.72_0.12_75)] rounded-full transition-all duration-700"
              style={{ width: `${((currentMission - (showResult ? 0 : 1)) / 3) * 100}%` }} />
          </div>
        </div>

        {/* Room preview */}
        <div className="mb-6 rounded-2xl border-2 border-[oklch(0.82_0.15_195)]/20 overflow-hidden" style={{ background: roomLayer.bg }}>
          <div className="p-6 min-h-[180px] relative">
            <div className="absolute top-3 left-3 text-xs text-gray-500">{t.yourRoom}</div>
            <div className="text-center pt-6">
              <p className="text-gray-400 text-sm mb-3">{roomLabels[Math.min(currentMission - (showResult ? 0 : 1), 3)]}</p>
              {roomItems.length > 0 && (
                <div className="flex flex-wrap justify-center gap-3 mt-4">
                  {roomItems.map((item, i) => (
                    <span key={i} className="text-3xl" style={{
                      transform: `rotate(${Math.random() * 20 - 10}deg)`,
                      opacity: 0.8 + Math.random() * 0.2,
                    }}>{item}</span>
                  ))}
                </div>
              )}
              {currentMission === 1 && !showResult && roomItems.length === 0 && (
                <div className="text-5xl opacity-20 mt-4">🏚️</div>
              )}
            </div>
          </div>
        </div>

        {/* Guide + Mission */}
        <div className="flex gap-4 sm:gap-5 mb-6">
          <div className="shrink-0 w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-3 border-[oklch(0.72_0.12_75)]/50">
            <img src={AVATAR_FRONTAL.MAMALINA} alt="MAMALINA" className="w-full h-full object-cover" />
          </div>
          <div className="bg-[oklch(0.14_0.015_240)] border border-[oklch(0.72_0.12_75)]/20 rounded-2xl p-5 sm:p-6 flex-1">
            <h3 className="font-bold text-lg sm:text-xl text-[oklch(0.72_0.12_75)] mb-2">{mission.title}</h3>
            <p className="text-gray-300 text-base sm:text-lg leading-relaxed">{mission.desc}</p>
          </div>
        </div>

        {/* Hint */}
        <div className="bg-[oklch(0.72_0.12_75)]/5 border border-[oklch(0.72_0.12_75)]/20 rounded-xl p-4 sm:p-5 mb-6">
          <p className="text-sm sm:text-base text-[oklch(0.72_0.12_75)] font-mono leading-relaxed">{mission.hint}</p>
        </div>

        {/* Input */}
        {!showResult && !isBuilding && (
          <div className="mb-6">
            <textarea
              ref={textareaRef}
              value={promptText}
              onChange={e => setPromptText(e.target.value)}
              placeholder={t.placeholder}
              rows={5}
              className="w-full bg-[oklch(0.14_0.015_240)] border-2 border-[oklch(0.72_0.12_75)]/30 rounded-2xl p-5 sm:p-6 text-white placeholder-gray-500 focus:border-[oklch(0.72_0.12_75)] focus:outline-none focus:shadow-[0_0_20px_oklch(0.72_0.12_75/0.2)] transition-all resize-none text-lg sm:text-xl"
            />
            <div className="flex justify-between items-center mt-4">
              <span className="text-sm text-gray-500 font-medium">{promptText.trim().split(/\s+/).filter(Boolean).length} palabras</span>
              <button onClick={handleSubmitPrompt} disabled={!promptText.trim()}
                className="px-8 py-4 bg-[oklch(0.72_0.12_75)] text-black font-black rounded-2xl hover:brightness-110 transition-all disabled:opacity-30 disabled:cursor-not-allowed text-lg sm:text-xl min-h-[56px]">
                {t.send}
              </button>
            </div>
          </div>
        )}

        {/* Building animation */}
        {isBuilding && (
          <div className="text-center py-8">
            <div className="text-4xl mb-3 animate-bounce">🏗️</div>
            <div className="inline-flex items-center gap-2 text-[oklch(0.72_0.12_75)]">
              <div className="w-2 h-2 rounded-full bg-current animate-bounce" style={{ animationDelay: "0ms" }} />
              <div className="w-2 h-2 rounded-full bg-current animate-bounce" style={{ animationDelay: "150ms" }} />
              <div className="w-2 h-2 rounded-full bg-current animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
            <p className="text-gray-400 text-sm mt-2">Construyendo...</p>
          </div>
        )}

        {/* Result */}
        {showResult && lastResult && (
          <div className="space-y-4">
            <div className="bg-[oklch(0.14_0.015_240)] border border-gray-700 rounded-xl p-4">
              <p className="text-xs text-gray-500 mb-1">Tu prompt:</p>
              <p className="text-gray-200 italic">"{lastResult.text}"</p>
            </div>
            <div className={`rounded-2xl p-6 border-2 ${
              lastResult.score >= 85 ? "border-[oklch(0.72_0.12_75)] bg-[oklch(0.72_0.12_75)]/10" :
              lastResult.score >= 45 ? "border-[oklch(0.82_0.15_195)] bg-[oklch(0.82_0.15_195)]/10" :
              "border-gray-600 bg-gray-800/30"
            }`}>
              <p className="font-bold text-lg sm:text-xl mb-5">{t[lastResult.feedback as keyof typeof t]}</p>
              <div className="grid grid-cols-3 gap-3 sm:gap-4 text-center">
                <div className="bg-black/20 rounded-xl p-4">
                  <div className="text-3xl sm:text-4xl font-black">{lastResult.score}</div>
                  <div className="text-sm text-gray-400 mt-1">{t.score}</div>
                </div>
                <div className="bg-black/20 rounded-xl p-4">
                  <div className="text-3xl sm:text-4xl font-black text-[oklch(0.72_0.12_75)]">+{lastResult.coins}</div>
                  <div className="text-sm text-gray-400 mt-1">{t.coins}</div>
                </div>
                <div className="bg-black/20 rounded-xl p-4">
                  <div className="text-3xl sm:text-4xl font-black text-[oklch(0.82_0.15_195)]">+{lastResult.xp}</div>
                  <div className="text-sm text-gray-400 mt-1">{t.xp}</div>
                </div>
              </div>
            </div>
            {/* Optimal prompt feedback */}
            {OPTIMAL_PROMPTS[2]?.[currentMission] && (
              <OptimalPromptFeedback
                optimalPrompt={OPTIMAL_PROMPTS[2][currentMission]}
                userScore={lastResult.score}
                lang={lang}
                accentColor="oklch(0.72 0.12 75)"
              />
            )}
            <button onClick={handleNextMission}
              className="w-full px-8 py-5 bg-[oklch(0.72_0.12_75)] text-black font-black rounded-2xl hover:brightness-110 transition-all text-xl sm:text-2xl min-h-[60px]">
              {currentMission < 3 ? t.next : "🏠 " + t.levelComplete}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}


export default function Nivel2() {
  return (
    <RequireLogin>
      <Nivel2Content />
    </RequireLogin>
  );
}

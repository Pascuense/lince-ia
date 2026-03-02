import { useState, useRef, useEffect } from "react";
import { useGame, type PromptResult } from "@/contexts/GameContext";
import { useGameLang } from "@/hooks/useGameLang";
import { AVATAR_FRONTAL, AVATAR_EXPRESSIONS } from "@/lib/avatarConstants";
import { Link } from "wouter";
import RequireLogin from "@/components/RequireLogin";
import { GameLanguageSelector } from "@/components/GameLanguageSelector";
import { UserNavBadge } from "@/components/UserNavBadge";
import { TheoryLessonCard } from "@/components/TheoryLesson";
import { OptimalPromptFeedback } from "@/components/OptimalPromptFeedback";
import { DifficultyBadge } from "@/components/DifficultyBadge";
import { LEVEL1_THEORY, OPTIMAL_PROMPTS } from "@/lib/gameConstants";
import { GlobalNavBar } from "@/components/GlobalNavBar";
import { BackButton } from "@/components/BackButton";

const T: Record<string, Record<string, string>> = {
  es: {
    title: "NIVEL 1 — Tu Primer Prompt",
    subtitle: "Cursos LINCE · Sala de Texto",
    guideWelcome: "¡Hola! Soy YAYALIN, el padre de la familia. Hoy vas a aprender algo increíble: hablar con la Inteligencia Artificial.",
    guideExplain: "Un prompt es una instrucción que le das a la IA. Cuanto mejor escribas tu prompt, mejor será el resultado. ¡Es como un hechizo mágico: las palabras correctas hacen magia!",
    guideReady: "¿Listo para escribir tu primer prompt? Primero, una mini-lección teórica para que sepas cómo funciona.",
    mission1Title: "Misión 1: Tu primer saludo",
    mission1Desc: "Escribe una instrucción para que la IA te salude de una forma especial. Sé creativo: dile cómo quieres que te salude, en qué idioma, con qué estilo...",
    mission1Hint: "Ejemplo: \"Salúdame como si fueras un pirata espacial que acaba de descubrir un planeta nuevo\"",
    mission2Title: "Misión 2: Nombra tu mascota robot",
    mission2Desc: "Pide a la IA que invente un nombre único para tu mascota robot. Describe cómo es tu mascota: ¿qué forma tiene? ¿qué poderes tiene? ¿de qué color es?",
    mission2Hint: "Ejemplo: \"Inventa un nombre para mi mascota robot que es un gato de metal azul que puede volar y lanza rayos por los ojos\"",
    mission3Title: "Misión 3: Tu habitación ideal",
    mission3Desc: "Describe tu habitación ideal para que la IA la pueda imaginar. Incluye colores, muebles, decoración, iluminación, estilo... ¡cuantos más detalles, mejor!",
    mission3Hint: "Ejemplo: \"Diseña una habitación futurista con paredes de cristal que cambian de color, una cama flotante con luces neón cyan, y un techo que muestra las estrellas\"",
    placeholder: "Escribe tu prompt aquí...",
    send: "Enviar Prompt ✨",
    next: "Siguiente Misión →",
    excellent: "¡INCREÍBLE! 🌟 Tu prompt es espectacular. YAYALIN está impresionado.",
    great: "¡MUY BIEN! 🎉 Excelente prompt. Tienes talento para hablar con la IA.",
    good: "¡BIEN! 👍 Buen prompt. Intenta añadir más detalles la próxima vez.",
    ok: "ACEPTABLE 🤔 Tu prompt funciona, pero podrías ser más específico y creativo.",
    tryAgain: "INTENTA DE NUEVO 💪 Escribe más detalles. Recuerda: cuanto más describas, mejor.",
    score: "Puntuación",
    coins: "LinceCoins ganados",
    xp: "XP ganados",
    levelComplete: "¡NIVEL 1 COMPLETADO!",
    levelCompleteDesc: "Has aprendido a escribir prompts. Ahora estás listo para construir tu primera habitación en el Mundo LINCE.",
    totalRewards: "Recompensas totales",
    continueToLevel2: "Ir al Nivel 2 →",
    backToHub: "← Volver al Mapa",
    missionOf: "Misión {current} de {total}",
    guideThinking: "Hmm, déjame ver tu prompt...",
    guideCelebrating: "¡Eso es! ¡Estás aprendiendo muy rápido!",
    yourPrompt: "Tu prompt:",
    words: "palabras",
  },
  en: {
    title: "LEVEL 1 — Your First Prompt",
    subtitle: "LINCE Academy · Text Room",
    guideWelcome: "Hi! I'm YAYALIN, the family father. Today you'll learn something amazing: how to talk to Artificial Intelligence.",
    guideExplain: "A prompt is an instruction you give to the AI. The better you write your prompt, the better the result. It's like a magic spell: the right words make magic!",
    guideReady: "Ready to write your first prompt? First, a mini theory lesson so you know how it works.",
    mission1Title: "Mission 1: Your first greeting",
    mission1Desc: "Write an instruction for the AI to greet you in a special way. Be creative: tell it how you want to be greeted, in what language, with what style...",
    mission1Hint: "Example: \"Greet me as if you were a space pirate who just discovered a new planet\"",
    mission2Title: "Mission 2: Name your robot pet",
    mission2Desc: "Ask the AI to invent a unique name for your robot pet. Describe your pet: what shape is it? What powers does it have? What color is it?",
    mission2Hint: "Example: \"Invent a name for my robot pet that is a blue metal cat that can fly and shoots lasers from its eyes\"",
    mission3Title: "Mission 3: Your ideal room",
    mission3Desc: "Describe your ideal room so the AI can imagine it. Include colors, furniture, decoration, lighting, style... the more details, the better!",
    mission3Hint: "Example: \"Design a futuristic room with crystal walls that change color, a floating bed with cyan neon lights, and a ceiling that shows the stars\"",
    placeholder: "Write your prompt here...",
    send: "Send Prompt ✨",
    next: "Next Mission →",
    excellent: "INCREDIBLE! 🌟 Your prompt is spectacular. YAYALIN is impressed.",
    great: "GREAT! 🎉 Excellent prompt. You have talent for talking to AI.",
    good: "GOOD! 👍 Nice prompt. Try adding more details next time.",
    ok: "ACCEPTABLE 🤔 Your prompt works, but you could be more specific and creative.",
    tryAgain: "TRY AGAIN 💪 Write more details. Remember: the more you describe, the better.",
    score: "Score",
    coins: "LinceCoins earned",
    xp: "XP earned",
    levelComplete: "LEVEL 1 COMPLETED!",
    levelCompleteDesc: "You've learned to write prompts. Now you're ready to build your first room in World LINCE.",
    totalRewards: "Total rewards",
    continueToLevel2: "Go to Level 2 →",
    backToHub: "← Back to Map",
    missionOf: "Mission {current} of {total}",
    guideThinking: "Hmm, let me see your prompt...",
    guideCelebrating: "That's it! You're learning so fast!",
    yourPrompt: "Your prompt:",
    words: "words",
  },
  zh: {
    title: "第1关 — 你的第一个提示词",
    subtitle: "LINCE学院 · 文字教室",
    guideWelcome: "你好！我是YAYALIN，家族的父亲。今天你将学到一件神奇的事：如何与人工智能对话。",
    guideExplain: "提示词是你给AI的指令。你写得越好，结果就越好。就像魔法咒语：正确的词语创造奇迹！",
    guideReady: "准备好写你的第一个提示词了吗？首先，一个迷你理论课让你了解它是如何工作的。",
    mission1Title: "任务1：你的第一个问候",
    mission1Desc: "写一个指令让AI用特别的方式问候你。发挥创意：告诉它你想要什么样的问候...",
    mission1Hint: "示例：\"像一个刚发现新星球的太空海盗一样向我问好\"",
    mission2Title: "任务2：给你的机器人宠物起名",
    mission2Desc: "让AI为你的机器人宠物发明一个独特的名字。描述你的宠物：什么形状？什么能力？什么颜色？",
    mission2Hint: "示例：\"为我的蓝色金属猫机器人宠物起个名字，它会飞，眼睛能发射激光\"",
    mission3Title: "任务3：你理想的房间",
    mission3Desc: "描述你理想的房间，让AI能想象出来。包括颜色、家具、装饰、灯光、风格...细节越多越好！",
    mission3Hint: "示例：\"设计一个未来风格的房间，有变色水晶墙、带青色霓虹灯的悬浮床和显示星空的天花板\"",
    placeholder: "在这里写你的提示词...",
    send: "发送提示词 ✨",
    next: "下一个任务 →",
    excellent: "太棒了！🌟 你的提示词非常出色。YAYALIN印象深刻。",
    great: "很好！🎉 优秀的提示词。你很有与AI对话的天赋。",
    good: "不错！👍 好的提示词。下次试着添加更多细节。",
    ok: "可以接受 🤔 你的提示词有效，但可以更具体和有创意。",
    tryAgain: "再试一次 💪 写更多细节。记住：描述越多越好。",
    score: "分数",
    coins: "获得LinceCoins",
    xp: "获得XP",
    levelComplete: "第1关完成！",
    levelCompleteDesc: "你已经学会了写提示词。现在准备在LINCE世界建造你的第一个房间。",
    totalRewards: "总奖励",
    continueToLevel2: "前往第2关 →",
    backToHub: "← 返回地图",
    missionOf: "任务 {current} / {total}",
    guideThinking: "嗯，让我看看你的提示词...",
    guideCelebrating: "就是这样！你学得真快！",
    yourPrompt: "你的提示词：",
    words: "词",
  },
};

function Nivel1Content() {
  const { lang } = useGameLang();
  const t = T[lang] || T.es;
  const { evaluatePrompt, completeLevel, addCoins, addXP, getLevelState } = useGame();

  const [phase, setPhase] = useState<"intro" | "theory" | "playing" | "complete">("intro");
  const [currentMission, setCurrentMission] = useState(1);
  const [promptText, setPromptText] = useState("");
  const [lastResult, setLastResult] = useState<PromptResult | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [avatarMood, setAvatarMood] = useState<"feliz" | "pensando" | "celebrando">("feliz");
  const [totalCoins, setTotalCoins] = useState(0);
  const [totalXP, setTotalXP] = useState(0);
  const [introStep, setIntroStep] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const levelState = getLevelState(1);

  const missions = [
    { title: t.mission1Title, desc: t.mission1Desc, hint: t.mission1Hint },
    { title: t.mission2Title, desc: t.mission2Desc, hint: t.mission2Hint },
    { title: t.mission3Title, desc: t.mission3Desc, hint: t.mission3Hint },
  ];

  const introTexts = [t.guideWelcome, t.guideExplain, t.guideReady];

  useEffect(() => {
    if (phase === "playing" && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [phase, currentMission, showResult]);

  const handleSubmitPrompt = () => {
    if (!promptText.trim()) return;
    setAvatarMood("pensando");
    setShowResult(false);

    setTimeout(() => {
      const result = evaluatePrompt(promptText, 1, currentMission);
      setLastResult(result);
      addCoins(result.coins);
      addXP(result.xp);
      setTotalCoins(prev => prev + result.coins);
      setTotalXP(prev => prev + result.xp);
      setAvatarMood(result.score >= 45 ? "celebrando" : "feliz");
      setShowResult(true);
    }, 1500);
  };

  const handleNextMission = () => {
    if (currentMission < 3) {
      setCurrentMission(prev => prev + 1);
      setPromptText("");
      setLastResult(null);
      setShowResult(false);
      setAvatarMood("feliz");
      // Show theory lesson before each new mission
      setPhase("theory");
    } else {
      // Level complete
      const avgScore = totalCoins > 0 ? Math.round((totalCoins / 105) * 100) : 50;
      const stars = avgScore >= 80 ? 3 : avgScore >= 50 ? 2 : 1;
      completeLevel(1, stars);
      setPhase("complete");
    }
  };

  const avatarImg = AVATAR_EXPRESSIONS.YAYALIN?.[avatarMood] || AVATAR_FRONTAL.YAYALIN;

  // ─── INTRO PHASE ───
  if (phase === "intro") {
    return (
      <div className="min-h-screen bg-[oklch(0.10_0.01_240)] text-white">
      <BackButton variant="inline" fallbackPath="/jugar" />
      <GlobalNavBar />
        <div className="max-w-2xl mx-auto px-4 sm:px-6 pt-32 sm:pt-36 pb-20">
          <div className="flex items-center justify-between mb-8">
            <Link href="/jugar" className="text-[oklch(0.82_0.15_195)] text-base sm:text-lg font-bold hover:underline min-h-[44px] flex items-center">{t.backToHub}</Link>
            <UserNavBadge variant="compact" />
          </div>
          <div className="text-center mb-10">
            <div className="flex items-center justify-center gap-2 mb-4">
              <span className="inline-block px-5 py-2 rounded-full bg-[oklch(0.82_0.15_195)]/10 text-[oklch(0.82_0.15_195)] text-sm sm:text-base font-bold tracking-wider">🎓 {t.subtitle}</span>
              <DifficultyBadge difficulty="easy" lang={lang} size="sm" />
            </div>
            <h1 className="text-4xl md:text-5xl font-black">{t.title}</h1>
          </div>

          {/* Avatar + dialogue */}
          <div className="flex flex-col items-center gap-8">
            <div className="w-48 h-48 sm:w-56 sm:h-56 rounded-full overflow-hidden border-4 border-[oklch(0.82_0.15_195)] shadow-[0_0_40px_oklch(0.82_0.15_195/0.3)]">
              <img src={AVATAR_FRONTAL.YAYALIN} alt="YAYALIN" className="w-full h-full object-cover" />
            </div>
            <div className="bg-[oklch(0.14_0.015_240)] border border-[oklch(0.82_0.15_195)]/30 rounded-2xl p-6 sm:p-8 max-w-lg relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-[oklch(0.14_0.015_240)] border-l border-t border-[oklch(0.82_0.15_195)]/30 rotate-45" />
              <p className="text-xl sm:text-2xl leading-relaxed text-gray-200">{introTexts[introStep]}</p>
            </div>
            <button
              onClick={() => {
                if (introStep < 2) setIntroStep(prev => prev + 1);
                else setPhase("theory");
              }}
              className="px-10 py-4 sm:py-5 bg-[oklch(0.82_0.15_195)] text-black font-black rounded-2xl hover:brightness-110 transition-all text-xl sm:text-2xl min-h-[56px] min-w-[200px]"
            >
              {introStep < 2 ? "Siguiente →" : "¡Empezar! 🚀"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ─── THEORY LESSON PHASE ───
  if (phase === "theory") {
    const theoryLesson = LEVEL1_THEORY[currentMission - 1];
    return (
      <div className="min-h-screen bg-[oklch(0.10_0.01_240)] text-white">
        <div className="max-w-2xl mx-auto px-4 pt-8 pb-16">
          <div className="flex items-center justify-between mb-6">
            <Link href="/jugar" className="text-[oklch(0.82_0.15_195)] text-sm hover:underline">{t.backToHub}</Link>
            <div className="flex items-center gap-2">
              <DifficultyBadge difficulty="easy" lang={lang} size="sm" />
              <UserNavBadge variant="compact" />
            </div>
          </div>
          <TheoryLessonCard
            lesson={theoryLesson}
            lang={lang}
            missionNumber={currentMission}
            onContinue={() => setPhase("playing")}
            accentColor="oklch(0.82 0.15 195)"
          />
        </div>
      </div>
    );
  }

  // ─── COMPLETE PHASE ───
  if (phase === "complete") {
    return (
      <div className="min-h-screen bg-[oklch(0.10_0.01_240)] text-white flex items-center justify-center">
        <div className="max-w-lg mx-auto px-6 text-center">
          <div className="w-40 h-40 sm:w-48 sm:h-48 mx-auto rounded-full overflow-hidden border-4 border-[oklch(0.72_0.12_75)] shadow-[0_0_50px_oklch(0.72_0.12_75/0.4)] mb-8">
            <img src={AVATAR_EXPRESSIONS.YAYALIN?.celebrando || AVATAR_FRONTAL.YAYALIN} alt="YAYALIN" className="w-full h-full object-cover" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-[oklch(0.72_0.12_75)] mb-4">🏆 {t.levelComplete}</h1>
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
              <div>
                <div className="text-4xl sm:text-5xl font-black text-yellow-400">{"\u2b50".repeat(levelState.stars || 1)}</div>
                <div className="text-sm text-gray-400 mt-2">{t.score}</div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <Link href="/jugar/nivel-2" className="block px-8 py-5 bg-[oklch(0.82_0.15_195)] text-black font-black rounded-2xl hover:brightness-110 transition-all text-xl sm:text-2xl text-center min-h-[60px]">
              {t.continueToLevel2}
            </Link>
            <Link href="/jugar" className="block px-6 py-4 border-2 border-gray-600 text-gray-300 rounded-2xl hover:bg-white/5 transition-all text-center text-lg font-bold min-h-[56px]">
              {t.backToHub}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ─── PLAYING PHASE ───
  const mission = missions[currentMission - 1];
  const optimalPrompt = OPTIMAL_PROMPTS[1]?.[currentMission];

  return (
    <div className="min-h-screen bg-[oklch(0.10_0.01_240)] text-white">
      <GlobalNavBar />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-32 sm:pt-36 pb-20">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Link href="/jugar" className="text-[oklch(0.82_0.15_195)] text-base sm:text-lg font-bold hover:underline min-h-[44px] flex items-center">{t.backToHub}</Link>
          <div className="flex items-center gap-3 sm:gap-4">
            <DifficultyBadge difficulty="easy" lang={lang} />
            <GameLanguageSelector variant="pill" />
            <span className="text-base font-bold text-[oklch(0.72_0.12_75)]">🪙 {totalCoins}</span>
            <span className="text-base font-bold text-[oklch(0.82_0.15_195)]">⚡ {totalXP}</span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm sm:text-base text-gray-400 mb-3">
            <span className="font-bold">{t.missionOf.replace("{current}", String(currentMission)).replace("{total}", "3")}</span>
            <span className="font-medium">{mission.title}</span>
          </div>
          <div className="h-3 bg-[oklch(0.18_0.01_240)] rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[oklch(0.82_0.15_195)] to-[oklch(0.72_0.12_75)] rounded-full transition-all duration-700"
              style={{ width: `${((currentMission - (showResult ? 0 : 1)) / 3) * 100}%` }}
            />
          </div>
        </div>

        {/* Avatar + Mission */}
        <div className="flex gap-4 sm:gap-5 mb-6">
          <div className="shrink-0 w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-3 border-[oklch(0.82_0.15_195)]/50">
            <img src={avatarImg} alt="YAYALIN" className="w-full h-full object-cover" />
          </div>
          <div className="bg-[oklch(0.14_0.015_240)] border border-[oklch(0.82_0.15_195)]/20 rounded-2xl p-5 sm:p-6 flex-1">
            <h3 className="font-bold text-lg sm:text-xl text-[oklch(0.82_0.15_195)] mb-2">{mission.title}</h3>
            <p className="text-gray-300 text-base sm:text-lg leading-relaxed">{mission.desc}</p>
          </div>
        </div>

        {/* Hint */}
        <div className="bg-[oklch(0.72_0.12_75)]/5 border border-[oklch(0.72_0.12_75)]/20 rounded-xl p-4 sm:p-5 mb-6">
          <p className="text-sm sm:text-base text-[oklch(0.72_0.12_75)] font-mono leading-relaxed">{mission.hint}</p>
        </div>

        {/* Prompt input */}
        {!showResult && (
          <div className="mb-6">
            <textarea
              ref={textareaRef}
              value={promptText}
              onChange={e => setPromptText(e.target.value)}
              placeholder={t.placeholder}
              rows={5}
              className="w-full bg-[oklch(0.14_0.015_240)] border-2 border-[oklch(0.82_0.15_195)]/30 rounded-2xl p-5 sm:p-6 text-white placeholder-gray-500 focus:border-[oklch(0.82_0.15_195)] focus:outline-none focus:shadow-[0_0_20px_oklch(0.82_0.15_195/0.2)] transition-all resize-none text-lg sm:text-xl"
            />
            <div className="flex justify-between items-center mt-4">
              <span className="text-sm text-gray-500 font-medium">{promptText.trim().split(/\s+/).filter(Boolean).length} {t.words}</span>
              <button
                onClick={handleSubmitPrompt}
                disabled={!promptText.trim()}
                className="px-8 py-4 bg-[oklch(0.82_0.15_195)] text-black font-black rounded-2xl hover:brightness-110 transition-all disabled:opacity-30 disabled:cursor-not-allowed text-lg sm:text-xl min-h-[56px]"
              >
                {t.send}
              </button>
            </div>
          </div>
        )}

        {/* Result */}
        {showResult && lastResult && (
          <div className="space-y-4">
            {/* Written prompt display */}
            <div className="bg-[oklch(0.14_0.015_240)] border border-gray-700 rounded-xl p-4">
              <p className="text-xs text-gray-500 mb-1">{t.yourPrompt}</p>
              <p className="text-gray-200 italic">"{lastResult.text}"</p>
            </div>

            {/* Score card */}
            <div className={`rounded-2xl p-6 border-2 ${
              lastResult.score >= 85 ? "border-[oklch(0.72_0.12_75)] bg-[oklch(0.72_0.12_75)]/10" :
              lastResult.score >= 45 ? "border-[oklch(0.82_0.15_195)] bg-[oklch(0.82_0.15_195)]/10" :
              "border-gray-600 bg-gray-800/30"
            }`}>
              <div className="flex items-center gap-4 sm:gap-5 mb-5">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-3 border-current flex-shrink-0">
                  <img src={avatarImg} alt="YAYALIN" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-lg sm:text-xl">{t[lastResult.feedback as keyof typeof t]}</p>
                </div>
              </div>

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

            {/* Optimal prompt feedback — shows the correct solution */}
            {optimalPrompt && (
              <OptimalPromptFeedback
                optimalPrompt={optimalPrompt}
                userScore={lastResult.score}
                lang={lang}
                accentColor="oklch(0.82 0.15 195)"
              />
            )}

            <button
              onClick={handleNextMission}
              className="w-full px-8 py-5 bg-[oklch(0.82_0.15_195)] text-black font-black rounded-2xl hover:brightness-110 transition-all text-xl sm:text-2xl min-h-[60px]"
            >
              {currentMission < 3 ? t.next : "🏆 " + t.levelComplete}
            </button>
          </div>
        )}

        {/* Thinking animation */}
        {!showResult && avatarMood === "pensando" && (
          <div className="text-center py-8">
            <div className="inline-flex items-center gap-2 text-[oklch(0.82_0.15_195)]">
              <div className="w-2 h-2 rounded-full bg-current animate-bounce" style={{ animationDelay: "0ms" }} />
              <div className="w-2 h-2 rounded-full bg-current animate-bounce" style={{ animationDelay: "150ms" }} />
              <div className="w-2 h-2 rounded-full bg-current animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
            <p className="text-gray-400 text-sm mt-2">{t.guideThinking}</p>
          </div>
        )}
      </div>
    </div>
  );
}


export default function Nivel1() {
  return (
    <RequireLogin>
      <Nivel1Content />
    </RequireLogin>
  );
}

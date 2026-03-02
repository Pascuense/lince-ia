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
import { LEVEL3_THEORY, OPTIMAL_PROMPTS } from "@/lib/gameConstants";
import { GlobalNavBar } from "@/components/GlobalNavBar";
import { BackButton } from "@/components/BackButton";

// NPC rival prompts (pre-written) — the player must beat these
const RIVAL_PROMPTS: Record<string, Record<number, { text: string; score: number }>> = {
  es: {
    1: { text: "Levanto un muro de piedra gigante frente a la puerta principal", score: 40 },
    2: { text: "Lanzo una bola de fuego hacia la habitación del enemigo", score: 45 },
    3: { text: "Pongo una trampa invisible en la entrada que congela a quien pise", score: 50 },
  },
  en: {
    1: { text: "I raise a giant stone wall in front of the main door", score: 40 },
    2: { text: "I throw a fireball towards the enemy's room", score: 45 },
    3: { text: "I place an invisible trap at the entrance that freezes anyone who steps on it", score: 50 },
  },
  zh: {
    1: { text: "我在大门前竖起一堵巨大的石墙", score: 40 },
    2: { text: "我向敌人的房间发射一个火球", score: 45 },
    3: { text: "我在入口放置一个隐形陷阱，踩到的人会被冻住", score: 50 },
  },
};

const RAID_STYLES = [
  { icon: "🔥", name: "Fuego", color: "oklch(0.65 0.2 30)" },
  { icon: "❄️", name: "Hielo", color: "oklch(0.75 0.15 230)" },
  { icon: "⚡", name: "Rayo", color: "oklch(0.80 0.18 90)" },
  { icon: "🌑", name: "Sombra", color: "oklch(0.45 0.1 300)" },
];

const T: Record<string, Record<string, string>> = {
  es: {
    title: "NIVEL 3 — Tu Primer Raid",
    subtitle: "LINCE Batallas · Combate PvP",
    locked: "Nivel bloqueado. Completa el Nivel 2 primero.",
    guideWelcome: "¡Alerta! Soy ATOLONDRALIN, el tío aventurero. Un rival está atacando tu habitación. ¡Tienes que defenderla con tus prompts!",
    guideExplain: "En las Batallas, gana quien escriba el mejor prompt. Tu prompt se compara con el del rival: si tu puntuación es mayor, ganas la ronda. ¡Escribe con todo el detalle y creatividad que puedas!",
    mission1Title: "Ronda 1: ¡Protege la puerta!",
    mission1Desc: "El rival intenta entrar por la puerta principal. Escribe un prompt de defensa: una barrera, un muro, un escudo... ¡lo que sea para bloquear la entrada!",
    mission1Hint: "Tip: Describe materiales, tamaño, poderes especiales. Ejemplo: \"Creo un escudo de energía cyan de 3 metros que electrocuta a quien lo toque\"",
    mission2Title: "Ronda 2: ¡Contraataca!",
    mission2Desc: "¡Es tu turno de atacar! Escribe un prompt ofensivo para dañar la base del rival. Elige un estilo: fuego, hielo, rayo o sombra.",
    mission2Hint: "Tip: Sé específico con el ataque. Ejemplo: \"Invoco una tormenta de rayos dorados que caen en espiral sobre la base enemiga, derritiendo sus defensas\"",
    mission3Title: "Ronda 3: ¡Trampa final!",
    mission3Desc: "Última ronda. Crea una trampa creativa e inesperada. Cuanto más original y detallada, más puntos. ¡Sorprende al rival!",
    mission3Hint: "Tip: Las trampas creativas puntúan más. Ejemplo: \"Creo un suelo ilusorio que parece normal pero es un portal que teletransporta al rival a una jaula de cristal flotante\"",
    placeholder: "Escribe tu prompt de combate...",
    send: "¡Atacar! ⚔️",
    next: "Siguiente Ronda →",
    rivalAttacks: "El rival ataca:",
    yourDefense: "Tu prompt:",
    vsLabel: "VS",
    youWin: "¡GANASTE esta ronda!",
    youLose: "El rival ganó esta ronda...",
    tie: "¡Empate!",
    excellent: "¡DEVASTADOR! 🌟 Tu prompt es imparable. ATOLONDRALIN está orgulloso.",
    great: "¡POTENTE! 🎉 Gran prompt de combate. El rival no tiene nada que hacer.",
    good: "¡BIEN! 👍 Buen intento. Más detalles harían tu ataque más fuerte.",
    ok: "ACEPTABLE 🤔 Funciona, pero necesitas más creatividad para ganar.",
    tryAgain: "DÉBIL 💪 Tu prompt necesita más fuerza. Añade detalles y creatividad.",
    score: "Puntuación",
    coins: "LinceCoins",
    xp: "XP",
    rivalScore: "Rival",
    levelComplete: "¡NIVEL 3 COMPLETADO!",
    levelCompleteDesc: "¡Has sobrevivido a tu primer Raid! Ya dominas los 3 pilares de LINCE: aprender, construir y combatir.",
    totalRewards: "Recompensas totales",
    backToHub: "← Volver al Mapa",
    missionOf: "Ronda {current} de {total}",
    roundsWon: "Rondas ganadas",
    victory: "¡VICTORIA!",
    defeat: "Derrota",
    allLevelsComplete: "¡Has completado los 3 niveles! Más niveles próximamente...",
    backToHome: "← Volver al Inicio",
  },
  en: {
    title: "LEVEL 3 — Your First Raid",
    subtitle: "LINCE Batallas · PvP Combat",
    locked: "Level locked. Complete Level 2 first.",
    guideWelcome: "Alert! I'm ATOLONDRALIN, the adventurous uncle. A rival is attacking your room. You must defend it with your prompts!",
    guideExplain: "In Battles, whoever writes the best prompt wins. Your prompt is compared to the rival's: if your score is higher, you win the round. Write with all the detail and creativity you can!",
    mission1Title: "Round 1: Protect the door!",
    mission1Desc: "The rival is trying to enter through the main door. Write a defense prompt: a barrier, a wall, a shield... anything to block the entrance!",
    mission1Hint: "Tip: Describe materials, size, special powers. Example: \"I create a 3-meter cyan energy shield that electrocutes anyone who touches it\"",
    mission2Title: "Round 2: Counterattack!",
    mission2Desc: "Your turn to attack! Write an offensive prompt to damage the rival's base. Choose a style: fire, ice, lightning or shadow.",
    mission2Hint: "Tip: Be specific with the attack. Example: \"I summon a storm of golden lightning bolts that spiral down onto the enemy base, melting their defenses\"",
    mission3Title: "Round 3: Final trap!",
    mission3Desc: "Last round. Create a creative and unexpected trap. The more original and detailed, the more points. Surprise the rival!",
    mission3Hint: "Tip: Creative traps score higher. Example: \"I create an illusory floor that looks normal but is a portal that teleports the rival to a floating crystal cage\"",
    placeholder: "Write your combat prompt...",
    send: "Attack! ⚔️",
    next: "Next Round →",
    rivalAttacks: "Rival attacks:",
    yourDefense: "Your prompt:",
    vsLabel: "VS",
    youWin: "You WON this round!",
    youLose: "The rival won this round...",
    tie: "Tie!",
    excellent: "DEVASTATING! 🌟 Your prompt is unstoppable. ATOLONDRALIN is proud.",
    great: "POWERFUL! 🎉 Great combat prompt. The rival has no chance.",
    good: "GOOD! 👍 Nice try. More details would make your attack stronger.",
    ok: "ACCEPTABLE 🤔 It works, but you need more creativity to win.",
    tryAgain: "WEAK 💪 Your prompt needs more power. Add details and creativity.",
    score: "Score",
    coins: "LinceCoins",
    xp: "XP",
    rivalScore: "Rival",
    levelComplete: "LEVEL 3 COMPLETED!",
    levelCompleteDesc: "You survived your first Raid! You now master the 3 pillars of LINCE: learn, build and fight.",
    totalRewards: "Total rewards",
    backToHub: "← Back to Map",
    missionOf: "Round {current} of {total}",
    roundsWon: "Rounds won",
    victory: "VICTORY!",
    defeat: "Defeat",
    allLevelsComplete: "You've completed all 3 levels! More levels coming soon...",
    backToHome: "← Back to Home",
  },
  zh: {
    title: "第3关 — 你的第一次突袭",
    subtitle: "LINCE突袭 · PvP战斗",
    locked: "关卡已锁定。请先完成第2关。",
    guideWelcome: "警报！我是ATOLONDRALIN，冒险的叔叔。一个对手正在攻击你的房间。你必须用提示词保卫它！",
    guideExplain: "在突袭中，写出最好提示词的人获胜。你的提示词与对手的比较：如果你的分数更高，你就赢了。尽可能详细和有创意地写！",
    mission1Title: "第1回合：保护门！",
    mission1Desc: "对手试图从大门进入。写一个防御提示词：屏障、墙壁、盾牌...任何能阻挡入口的东西！",
    mission1Hint: "提示：描述材料、大小、特殊能力。示例：\"我创建一个3米高的青色能量盾，触碰者会被电击\"",
    mission2Title: "第2回合：反击！",
    mission2Desc: "轮到你进攻了！写一个攻击提示词来破坏对手的基地。选择风格：火、冰、雷或暗影。",
    mission2Hint: "提示：具体描述攻击。示例：\"我召唤一场金色闪电风暴，螺旋落在敌人基地上，融化他们的防御\"",
    mission3Title: "第3回合：最终陷阱！",
    mission3Desc: "最后一回合。创建一个创意且出人意料的陷阱。越原创越详细，得分越高。给对手一个惊喜！",
    mission3Hint: "提示：创意陷阱得分更高。示例：\"我创建一个看起来正常但实际是传送门的幻觉地板，将对手传送到漂浮的水晶笼中\"",
    placeholder: "写你的战斗提示词...",
    send: "攻击！⚔️",
    next: "下一回合 →",
    rivalAttacks: "对手攻击：",
    yourDefense: "你的提示词：",
    vsLabel: "VS",
    youWin: "你赢了这一回合！",
    youLose: "对手赢了这一回合...",
    tie: "平局！",
    excellent: "毁灭性的！🌟 你的提示词势不可挡。ATOLONDRALIN很自豪。",
    great: "强大！🎉 出色的战斗提示词。对手毫无机会。",
    good: "不错！👍 好的尝试。更多细节会让你的攻击更强。",
    ok: "可以接受 🤔 有效，但需要更多创意才能获胜。",
    tryAgain: "太弱了 💪 你的提示词需要更多力量。添加细节和创意。",
    score: "分数",
    coins: "LinceCoins",
    xp: "XP",
    rivalScore: "对手",
    levelComplete: "第3关完成！",
    levelCompleteDesc: "你在第一次突袭中幸存了下来！你现在掌握了LINCE的3个支柱：学习、建造和战斗。",
    totalRewards: "总奖励",
    backToHub: "← 返回地图",
    missionOf: "回合 {current} / {total}",
    roundsWon: "赢得回合",
    victory: "胜利！",
    defeat: "失败",
    allLevelsComplete: "你已完成所有3个关卡！更多关卡即将推出...",
    backToHome: "← 返回首页",
  },
};

function Nivel3Content() {
  const { lang } = useGameLang();
  const t = T[lang] || T.es;
  const { evaluatePrompt, completeLevel, addCoins, addXP, isLevelUnlocked } = useGame();

  const [phase, setPhase] = useState<"intro" | "theory" | "playing" | "complete">("intro");
  const [currentRound, setCurrentRound] = useState(1);
  const [promptText, setPromptText] = useState("");
  const [lastResult, setLastResult] = useState<PromptResult | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [totalCoins, setTotalCoins] = useState(0);
  const [totalXP, setTotalXP] = useState(0);
  const [roundsWon, setRoundsWon] = useState(0);
  const [introStep, setIntroStep] = useState(0);
  const [isFighting, setIsFighting] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState<number | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const unlocked = isLevelUnlocked(3);
  const rivalPrompts = RIVAL_PROMPTS[lang] || RIVAL_PROMPTS.es;

  const missions = [
    { title: t.mission1Title, desc: t.mission1Desc, hint: t.mission1Hint },
    { title: t.mission2Title, desc: t.mission2Desc, hint: t.mission2Hint },
    { title: t.mission3Title, desc: t.mission3Desc, hint: t.mission3Hint },
  ];

  const introTexts = [t.guideWelcome, t.guideExplain];

  useEffect(() => {
    if (phase === "playing" && textareaRef.current && !showResult && !isFighting) {
      textareaRef.current.focus();
    }
  }, [phase, currentRound, showResult, isFighting]);

  const handleSubmitPrompt = () => {
    if (!promptText.trim()) return;
    setIsFighting(true);
    setShowResult(false);

    setTimeout(() => {
      const result = evaluatePrompt(promptText, 3, currentRound);
      setLastResult(result);
      addCoins(result.coins);
      addXP(result.xp);
      setTotalCoins(prev => prev + result.coins);
      setTotalXP(prev => prev + result.xp);

      const rivalScore = rivalPrompts[currentRound]?.score || 40;
      if (result.score > rivalScore) {
        setRoundsWon(prev => prev + 1);
      }
      setIsFighting(false);
      setShowResult(true);
    }, 2500);
  };

  const handleNextRound = () => {
    if (currentRound < 3) {
      setCurrentRound(prev => prev + 1);
      setPromptText("");
      setLastResult(null);
      setShowResult(false);
      setSelectedStyle(null);
      setPhase("theory");
    } else {
      const avgScore = totalCoins > 0 ? Math.round((totalCoins / 210) * 100) : 50;
      const stars = roundsWon >= 3 ? 3 : roundsWon >= 2 ? 2 : 1;
      completeLevel(3, stars);
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
              <span className="inline-block px-5 py-2 rounded-full bg-red-500/10 text-red-400 text-sm sm:text-base font-bold tracking-wider">⚔️ {t.subtitle}</span>
              <DifficultyBadge difficulty="hard" lang={lang} size="sm" />
            </div>
            <h1 className="text-4xl md:text-5xl font-black">{t.title}</h1>
          </div>
          <div className="flex flex-col items-center gap-8">
            <div className="w-48 h-48 sm:w-56 sm:h-56 rounded-full overflow-hidden border-4 border-red-500 shadow-[0_0_40px_rgba(239,68,68,0.3)]">
              <img src={AVATAR_FRONTAL.ATOLONDRALIN} alt="ATOLONDRALIN" className="w-full h-full object-cover" />
            </div>
            <div className="bg-[oklch(0.14_0.015_240)] border border-red-500/30 rounded-2xl p-6 sm:p-8 max-w-lg relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-[oklch(0.14_0.015_240)] border-l border-t border-red-500/30 rotate-45" />
              <p className="text-xl sm:text-2xl leading-relaxed text-gray-200">{introTexts[introStep]}</p>
            </div>
            <button
              onClick={() => {
                if (introStep < 1) setIntroStep(prev => prev + 1);
                else setPhase("theory");
              }}
              className="px-10 py-4 sm:py-5 bg-red-500 text-white font-black rounded-2xl hover:brightness-110 transition-all text-xl sm:text-2xl min-h-[56px] min-w-[200px]"
            >
              {introStep < 1 ? "Siguiente →" : "¡A luchar! ⚔️"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ─── THEORY LESSON ───
  if (phase === "theory") {
    const theoryLesson = LEVEL3_THEORY[currentRound - 1];
    return (
      <div className="min-h-screen bg-[oklch(0.10_0.01_240)] text-white">
        <div className="max-w-2xl mx-auto px-4 pt-8 pb-16">
          <div className="flex items-center justify-between mb-6">
            <Link href="/jugar" className="text-[oklch(0.82_0.15_195)] text-sm hover:underline">{t.backToHub}</Link>
            <div className="flex items-center gap-2">
              <DifficultyBadge difficulty="hard" lang={lang} size="sm" />
              <UserNavBadge variant="compact" />
            </div>
          </div>
          <TheoryLessonCard
            lesson={theoryLesson}
            lang={lang}
            missionNumber={currentRound}
            onContinue={() => setPhase("playing")}
            accentColor="oklch(0.65 0.2 30)"
          />
        </div>
      </div>
    );
  }

  // ─── COMPLETE ───
  if (phase === "complete") {
    const won = roundsWon >= 2;
    return (
      <div className="min-h-screen bg-[oklch(0.10_0.01_240)] text-white flex items-center justify-center">
        <div className="max-w-lg mx-auto px-4 text-center">
          <div className="w-40 h-40 sm:w-48 sm:h-48 mx-auto rounded-full overflow-hidden border-4 border-[oklch(0.72_0.12_75)] shadow-[0_0_50px_oklch(0.72_0.12_75/0.4)] mb-8">
            <img src={AVATAR_EXPRESSIONS.ATOLONDRALIN?.celebrando || AVATAR_FRONTAL.ATOLONDRALIN} alt="ATOLONDRALIN" className="w-full h-full object-cover" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-[oklch(0.72_0.12_75)] mb-3">⚔️ {t.levelComplete}</h1>
          <p className="text-3xl sm:text-4xl font-black mb-3">{won ? t.victory : t.defeat}</p>
          <p className="text-gray-300 text-xl mb-3">{t.roundsWon}: {roundsWon}/3</p>
          <p className="text-gray-400 text-xl sm:text-2xl mb-10 leading-relaxed">{t.levelCompleteDesc}</p>

          <div className="bg-[oklch(0.14_0.015_240)] border border-[oklch(0.72_0.12_75)]/30 rounded-2xl p-6 sm:p-8 mb-8">
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

          <div className="bg-[oklch(0.82_0.15_195)]/10 border border-[oklch(0.82_0.15_195)]/30 rounded-2xl p-6 sm:p-8 mb-10">
            <p className="text-[oklch(0.82_0.15_195)] font-black text-xl sm:text-2xl">🎉 {t.allLevelsComplete}</p>
          </div>

          <div className="flex flex-col gap-4">
            <Link href="/jugar" className="block px-8 py-5 bg-[oklch(0.82_0.15_195)] text-black font-black rounded-2xl hover:brightness-110 transition-all text-xl sm:text-2xl text-center min-h-[60px]">
              {t.backToHub}
            </Link>
            <Link href="/" className="block px-6 py-4 border-2 border-gray-600 text-gray-300 rounded-2xl hover:bg-white/5 transition-all text-center text-lg font-bold min-h-[56px]">
              {t.backToHome}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ─── PLAYING ───
  const mission = missions[currentRound - 1];
  const rivalPrompt = rivalPrompts[currentRound];

  return (
    <div className="min-h-screen bg-[oklch(0.10_0.01_240)] text-white">
      <GlobalNavBar />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-32 sm:pt-36 pb-20">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Link href="/jugar" className="text-[oklch(0.82_0.15_195)] text-base sm:text-lg font-bold hover:underline min-h-[44px] flex items-center">{t.backToHub}</Link>
          <div className="flex items-center gap-3 sm:gap-4">
            <DifficultyBadge difficulty="hard" lang={lang} />
            <GameLanguageSelector variant="pill" />
            <span className="text-base font-bold text-[oklch(0.72_0.12_75)]">🪙 {totalCoins}</span>
            <span className="text-base font-bold text-[oklch(0.82_0.15_195)]">⚡ {totalXP}</span>
            <span className="text-base font-bold text-green-400">🏆 {roundsWon}/3</span>
          </div>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between text-sm sm:text-base text-gray-400 mb-3">
            <span className="font-bold">{t.missionOf.replace("{current}", String(currentRound)).replace("{total}", "3")}</span>
          </div>
          <div className="h-3 bg-[oklch(0.18_0.01_240)] rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-red-500 to-orange-500 rounded-full transition-all duration-700"
              style={{ width: `${((currentRound - (showResult ? 0 : 1)) / 3) * 100}%` }} />
          </div>
        </div>

        {/* Rival's attack display */}
        <div className="mb-6 bg-red-500/5 border border-red-500/20 rounded-2xl p-5 sm:p-6">
          <div className="flex items-center gap-4 mb-3">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden border-2 border-red-500/50 shrink-0">
              <img src={AVATAR_FRONTAL.ATOLONDRALIN} alt="Rival" className="w-full h-full object-cover" />
            </div>
            <div>
              <p className="text-sm sm:text-base text-red-400 font-bold mb-1">{t.rivalAttacks}</p>
              <p className="text-gray-300 text-base sm:text-lg italic leading-relaxed">"{rivalPrompt?.text}"</p>
            </div>
          </div>
          <div className="text-right text-sm text-gray-500 font-medium">{t.rivalScore}: {rivalPrompt?.score}/100</div>
        </div>

        {/* Guide + Mission */}
        <div className="bg-[oklch(0.14_0.015_240)] border border-red-500/20 rounded-2xl p-5 sm:p-6 mb-5">
          <h3 className="font-bold text-lg sm:text-xl text-red-400 mb-2">{mission.title}</h3>
          <p className="text-gray-300 text-base sm:text-lg leading-relaxed">{mission.desc}</p>
        </div>

        {/* Raid style selector (round 2 only) */}
        {currentRound === 2 && !showResult && !isFighting && (
          <div className="flex gap-2 mb-4">
            {RAID_STYLES.map((style, i) => (
              <button key={i} onClick={() => setSelectedStyle(i)}
                className={`flex-1 py-2 rounded-xl text-center text-sm font-bold transition-all ${
                  selectedStyle === i
                    ? "border-2 bg-white/10"
                    : "border border-gray-700 hover:bg-white/5"
                }`}
                style={{ borderColor: selectedStyle === i ? style.color : undefined }}>
                <span className="text-xl">{style.icon}</span>
                <div className="text-xs mt-1">{style.name}</div>
              </button>
            ))}
          </div>
        )}

        {/* Hint */}
        <div className="bg-orange-500/5 border border-orange-500/20 rounded-xl p-4 sm:p-5 mb-6">
          <p className="text-sm sm:text-base text-orange-400 font-mono leading-relaxed">{mission.hint}</p>
        </div>

        {/* Input */}
        {!showResult && !isFighting && (
          <div className="mb-6">
            <textarea
              ref={textareaRef}
              value={promptText}
              onChange={e => setPromptText(e.target.value)}
              placeholder={t.placeholder}
              rows={5}
              className="w-full bg-[oklch(0.14_0.015_240)] border-2 border-red-500/30 rounded-2xl p-5 sm:p-6 text-white placeholder-gray-500 focus:border-red-500 focus:outline-none focus:shadow-[0_0_20px_rgba(239,68,68,0.2)] transition-all resize-none text-lg sm:text-xl"
            />
            <div className="flex justify-between items-center mt-4">
              <span className="text-sm text-gray-500 font-medium">{promptText.trim().split(/\s+/).filter(Boolean).length} palabras</span>
              <button onClick={handleSubmitPrompt} disabled={!promptText.trim()}
                className="px-8 py-4 bg-red-500 text-white font-black rounded-2xl hover:brightness-110 transition-all disabled:opacity-30 disabled:cursor-not-allowed text-lg sm:text-xl min-h-[56px]">
                {t.send}
              </button>
            </div>
          </div>
        )}

        {/* Fighting animation */}
        {isFighting && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4 animate-pulse">⚔️</div>
            <div className="inline-flex items-center gap-2 text-red-400">
              <div className="w-2 h-2 rounded-full bg-current animate-bounce" style={{ animationDelay: "0ms" }} />
              <div className="w-2 h-2 rounded-full bg-current animate-bounce" style={{ animationDelay: "150ms" }} />
              <div className="w-2 h-2 rounded-full bg-current animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
            <p className="text-gray-400 text-sm mt-2">Comparando prompts...</p>
          </div>
        )}

        {/* Result */}
        {showResult && lastResult && (
          <div className="space-y-4">
            {/* VS comparison */}
            <div className="grid grid-cols-[1fr_auto_1fr] gap-4 items-center">
              <div className="bg-[oklch(0.82_0.15_195)]/10 border border-[oklch(0.82_0.15_195)]/30 rounded-xl p-4 sm:p-5 text-center">
                <p className="text-sm text-gray-400 mb-2">Tú</p>
                <p className="text-4xl sm:text-5xl font-black text-[oklch(0.82_0.15_195)]">{lastResult.score}</p>
              </div>
              <div className="text-3xl font-black text-gray-500">{t.vsLabel}</div>
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 sm:p-5 text-center">
                <p className="text-sm text-gray-400 mb-2">{t.rivalScore}</p>
                <p className="text-4xl sm:text-5xl font-black text-red-400">{rivalPrompt?.score}</p>
              </div>
            </div>

            {/* Win/lose banner */}
            <div className={`text-center py-4 rounded-xl font-black text-xl sm:text-2xl ${
              lastResult.score > (rivalPrompt?.score || 0)
                ? "bg-green-500/10 text-green-400 border border-green-500/30"
                : lastResult.score === (rivalPrompt?.score || 0)
                ? "bg-yellow-500/10 text-yellow-400 border border-yellow-500/30"
                : "bg-red-500/10 text-red-400 border border-red-500/30"
            }`}>
              {lastResult.score > (rivalPrompt?.score || 0) ? t.youWin :
               lastResult.score === (rivalPrompt?.score || 0) ? t.tie : t.youLose}
            </div>

            {/* Feedback */}
            <div className={`rounded-2xl p-5 border-2 ${
              lastResult.score >= 85 ? "border-[oklch(0.72_0.12_75)] bg-[oklch(0.72_0.12_75)]/10" :
              lastResult.score >= 45 ? "border-[oklch(0.82_0.15_195)] bg-[oklch(0.82_0.15_195)]/10" :
              "border-gray-600 bg-gray-800/30"
            }`}>
              <p className="font-bold text-lg sm:text-xl mb-4">{t[lastResult.feedback as keyof typeof t]}</p>
              <div className="grid grid-cols-2 gap-4 text-center">
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
            {OPTIMAL_PROMPTS[3]?.[currentRound] && (
              <OptimalPromptFeedback
                optimalPrompt={OPTIMAL_PROMPTS[3][currentRound]}
                userScore={lastResult.score}
                lang={lang}
                accentColor="oklch(0.65 0.2 30)"
              />
            )}
            <button onClick={handleNextRound}
              className="w-full px-8 py-5 bg-red-500 text-white font-black rounded-2xl hover:brightness-110 transition-all text-xl sm:text-2xl min-h-[60px]">
              {currentRound < 3 ? t.next : "⚔️ " + t.levelComplete}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}


export default function Nivel3() {
  return (
    <RequireLogin>
      <Nivel3Content />
    </RequireLogin>
  );
}

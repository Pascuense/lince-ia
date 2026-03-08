import { useGame } from "@/contexts/GameContext";
import { useGameLang } from "@/hooks/useGameLang";
import { AVATAR_FRONTAL } from "@/lib/avatarConstants";
import { Link } from "wouter";
import RequireLogin from "@/components/RequireLogin";
import { GameLanguageSelector } from "@/components/GameLanguageSelector";
import { UserNavBadge } from "@/components/UserNavBadge";
import { DifficultyBadge } from "@/components/DifficultyBadge";
import { LEVEL_DIFFICULTY } from "@/lib/gameConstants";
import { GlobalNavBar } from "@/components/GlobalNavBar";

const T: Record<string, Record<string, string>> = {
  es: {
    title: "LINCE",
    subtitle: "Mapa de Aventura",
    linceCoins: "LinceCoins",
    xp: "Experiencia",
    streak: "Racha",
    days: "días",
    prompts: "Prompts",
    level1: "Tu Primer Prompt",
    level1Desc: "Aprende a hablar con la IA en la Academia",
    level1World: "Academia LINCE",
    level2: "Tu Primera Habitación",
    level2Desc: "Construye tu casa en el Mundo LINCE",
    level2World: "Mundo LINCE",
    level3: "Tu Primer Raid",
    level3Desc: "Defiende tu casa en un combate PvP",
    level3World: "LINCE Batallas",
    locked: "Bloqueado",
    completed: "Completado",
    play: "JUGAR",
    replay: "REPETIR",
    comingSoon: "Próximamente",
    level4: "Habitación Avanzada",
    level4Desc: "Construye habitaciones con prompts complejos",
    level5: "Raid en Equipo",
    level5Desc: "Combate cooperativo con amigos",
    level6: "Examen de la Academia",
    level6Desc: "Demuestra todo lo aprendido",
    backToHome: "← Inicio",
    resetProgress: "Reiniciar progreso",
    resetConfirm: "¿Seguro? Se perderá todo el progreso.",
    stars: "estrellas",
    player: "Jugador",
    logout: "Cerrar sesión",
    dailyReward: "Premio del Día",
    dailyRewardClaim: "¡Reclama tus LinceCoins!",
    dailyRewardClaimed: "Vuelve mañana",
    hello: "¡Hola",
    welcome: "¡Bienvenido a LINCE! Aprende IA jugando.",
    nextStep: "TU PRÓXIMO PASO",
    completeLevel: "¡Completa el Nivel",
    toUnlock: "para desbloquear el Mundo LINCE!",
    unlockedSections: "Secciones desbloqueadas",
    specialists: "Especialistas",
    myProgress: "Mi Progreso",
    learnPrompts: "Aprender Prompts",
    world: "Mundo",
    battles: "Batallas",
    courses: "Cursos",
    yourAdventure: "Tu Aventura",
  },
  en: {
    title: "LINCE",
    subtitle: "Adventure Map",
    linceCoins: "LinceCoins",
    xp: "Experience",
    streak: "Streak",
    days: "days",
    prompts: "Prompts",
    level1: "Your First Prompt",
    level1Desc: "Learn to talk to AI at the Academy",
    level1World: "LINCE Academy",
    level2: "Your First Room",
    level2Desc: "Build your house in World LINCE",
    level2World: "World LINCE",
    level3: "Your First Raid",
    level3Desc: "Defend your house in PvP combat",
    level3World: "LINCE Battles",
    locked: "Locked",
    completed: "Completed",
    play: "PLAY",
    replay: "REPLAY",
    comingSoon: "Coming Soon",
    level4: "Advanced Room",
    level4Desc: "Build rooms with complex prompts",
    level5: "Team Raid",
    level5Desc: "Cooperative combat with friends",
    level6: "Academy Exam",
    level6Desc: "Prove everything you've learned",
    backToHome: "← Home",
    resetProgress: "Reset progress",
    resetConfirm: "Are you sure? All progress will be lost.",
    stars: "stars",
    player: "Player",
    logout: "Log out",
    dailyReward: "Daily Reward",
    dailyRewardClaim: "Claim your LinceCoins!",
    dailyRewardClaimed: "Come back tomorrow",
    hello: "Hello",
    welcome: "Welcome to LINCE! Learn AI by playing.",
    nextStep: "YOUR NEXT STEP",
    completeLevel: "Complete Level",
    toUnlock: "to unlock World LINCE!",
    unlockedSections: "Unlocked sections",
    specialists: "Specialists",
    myProgress: "My Progress",
    learnPrompts: "Learn Prompts",
    world: "World",
    battles: "Battles",
    courses: "Courses",
    yourAdventure: "Your Adventure",
  },
  zh: {
    title: "LINCE",
    subtitle: "冒险地图",
    linceCoins: "LinceCoins",
    xp: "经验",
    streak: "连续",
    days: "天",
    prompts: "提示词",
    level1: "你的第一个提示词",
    level1Desc: "在学院学习与AI对话",
    level1World: "LINCE学院",
    level2: "你的第一个房间",
    level2Desc: "在LINCE世界建造你的房子",
    level2World: "LINCE世界",
    level3: "你的第一次突袭",
    level3Desc: "在PvP战斗中保卫你的房子",
    level3World: "LINCE突袭",
    locked: "已锁定",
    completed: "已完成",
    play: "开始",
    replay: "重玩",
    comingSoon: "即将推出",
    level4: "高级房间",
    level4Desc: "用复杂提示词建造房间",
    level5: "团队突袭",
    level5Desc: "与朋友合作战斗",
    level6: "学院考试",
    level6Desc: "证明你学到的一切",
    backToHome: "← 首页",
    resetProgress: "重置进度",
    resetConfirm: "确定吗？所有进度将丢失。",
    stars: "星",
    player: "玩家",
    logout: "退出登录",
    dailyReward: "每日奖励",
    dailyRewardClaim: "领取你的LinceCoins！",
    dailyRewardClaimed: "明天再来",
    hello: "你好",
    welcome: "欢迎来到LINCE！通过游戏学习AI。",
    nextStep: "你的下一步",
    completeLevel: "完成第",
    toUnlock: "级以解锁LINCE世界！",
    unlockedSections: "已解锁区域",
    specialists: "专家",
    myProgress: "我的进度",
    learnPrompts: "学习提示词",
    world: "世界",
    battles: "战斗",
    courses: "课程",
    yourAdventure: "你的冒险",
  },
};

const LEVEL_CONFIG = [
  { id: 1, icon: "🎓", color: "oklch(0.82 0.15 195)", gradient: "from-[oklch(0.82_0.15_195)] to-[oklch(0.65_0.12_195)]", avatar: "YAYALIN", route: "/jugar/nivel-1" },
  { id: 2, icon: "🏠", color: "oklch(0.72 0.12 75)", gradient: "from-[oklch(0.72_0.12_75)] to-[oklch(0.55_0.10_75)]", avatar: "MAMALINA", route: "/jugar/nivel-2" },
  { id: 3, icon: "⚔️", color: "oklch(0.65 0.2 30)", gradient: "from-red-500 to-red-700", avatar: "ATOLONDRALIN", route: "/jugar/nivel-3" },
];

const FUTURE_LEVELS = [
  { id: 4, icon: "🏰" },
  { id: 5, icon: "🤝" },
  { id: 6, icon: "🎓" },
];

function JugarContent() {
  const { lang } = useGameLang();
  const t = T[lang] || T.es;
  const { state, isLevelUnlocked, getLevelState, resetGame, loggedUser, canClaimDailyReward, logout: gameLogout } = useGame();
  const canClaim = canClaimDailyReward();

  const handleReset = () => {
    if (window.confirm(t.resetConfirm)) {
      resetGame();
    }
  };

  const handleLogout = () => {
    gameLogout();
    window.location.href = '/';
  };

  // Find next level to complete
  const nextLevel = LEVEL_CONFIG.find(l => isLevelUnlocked(l.id) && !getLevelState(l.id).completed);
  const completedCount = LEVEL_CONFIG.filter(l => getLevelState(l.id).completed).length;

  return (
    <div className="min-h-screen bg-[oklch(0.10_0.01_240)] text-white">
      <GlobalNavBar />
      <div className="pt-32 sm:pt-36 pb-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">

          {/* ═══ WELCOME CARD ═══ */}
          {loggedUser && (
            <div className="mb-6 bg-gradient-to-r from-[oklch(0.15_0.02_240)] to-[oklch(0.13_0.015_240)] border border-[oklch(0.82_0.15_195)]/20 rounded-2xl p-5 sm:p-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[oklch(0.82_0.15_195)]/20 border-2 border-[oklch(0.82_0.15_195)]/40 flex items-center justify-center text-2xl sm:text-3xl font-black text-[oklch(0.82_0.15_195)] flex-shrink-0">
                  {loggedUser.username.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="font-['Space_Grotesk'] font-bold text-xl sm:text-2xl text-white">
                    {t.hello}, {loggedUser.username}!
                  </h2>
                  <p className="text-gray-400 text-sm sm:text-base mt-0.5">{t.welcome}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <GameLanguageSelector variant="pill" />
                  <button onClick={handleLogout} className="text-gray-500 hover:text-gray-300 text-sm transition-colors px-3 py-2 rounded-lg hover:bg-white/5 min-h-[44px]">
                    {t.logout}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ═══ NEXT STEP BANNER ═══ */}
          {nextLevel && (
            <div className="mb-6 bg-gradient-to-r from-[oklch(0.82_0.15_195)]/15 to-[oklch(0.72_0.12_75)]/15 border border-[oklch(0.82_0.15_195)]/30 rounded-2xl p-5 sm:p-6">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">{nextLevel.icon}</span>
                <span className="text-[oklch(0.82_0.15_195)] text-xs sm:text-sm font-black tracking-wider uppercase">{t.nextStep}</span>
              </div>
              <p className="text-white font-bold text-lg sm:text-xl">
                {t.completeLevel} {nextLevel.id} {t.toUnlock}
              </p>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-gray-400 text-sm">{t.unlockedSections}</span>
                <span className="text-[oklch(0.82_0.15_195)] font-bold text-lg">{completedCount}/{LEVEL_CONFIG.length}</span>
              </div>
            </div>
          )}

          {/* ═══ STATS BAR — BIG and clear ═══ */}
          <div className="grid grid-cols-4 gap-3 mb-8">
            <div className="bg-[oklch(0.14_0.015_240)] rounded-2xl p-4 text-center border border-[oklch(0.72_0.12_75)]/25">
              <div className="text-2xl sm:text-3xl font-black text-[oklch(0.72_0.12_75)]">🪙 {state.linceCoins}</div>
              <div className="text-xs sm:text-sm text-gray-400 mt-1 font-medium">{t.linceCoins}</div>
            </div>
            <div className="bg-[oklch(0.14_0.015_240)] rounded-2xl p-4 text-center border border-[oklch(0.82_0.15_195)]/25">
              <div className="text-2xl sm:text-3xl font-black text-[oklch(0.82_0.15_195)]">⚡ {state.xp}</div>
              <div className="text-xs sm:text-sm text-gray-400 mt-1 font-medium">{t.xp}</div>
            </div>
            <div className="bg-[oklch(0.14_0.015_240)] rounded-2xl p-4 text-center border border-orange-500/25">
              <div className="text-2xl sm:text-3xl font-black text-orange-400">🔥 {state.streak}</div>
              <div className="text-xs sm:text-sm text-gray-400 mt-1 font-medium">{t.streak}</div>
            </div>
            <div className="bg-[oklch(0.14_0.015_240)] rounded-2xl p-4 text-center border border-purple-500/25">
              <div className="text-2xl sm:text-3xl font-black text-purple-400">✍️ {state.totalPromptsWritten}</div>
              <div className="text-xs sm:text-sm text-gray-400 mt-1 font-medium">{t.prompts}</div>
            </div>
          </div>

          {/* ═══ QUICK ACCESS — Big buttons ═══ */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
            <Link href="/recompensas" className={`flex flex-col items-center justify-center gap-2 p-5 rounded-2xl border min-h-[100px] transition-all hover:scale-[1.02] ${
              canClaim
                ? "bg-gradient-to-br from-[oklch(0.72_0.12_75)]/20 to-[oklch(0.82_0.15_195)]/20 border-[oklch(0.72_0.12_75)]/40 shadow-[0_0_20px_oklch(0.72_0.12_75/0.15)]"
                : "bg-[oklch(0.14_0.015_240)] border-[oklch(0.72_0.12_75)]/20"
            }`}>
              <span className={`text-3xl ${canClaim ? 'animate-bounce' : ''}`}>🎁</span>
              <span className={`text-sm sm:text-base font-bold text-center ${canClaim ? 'text-[oklch(0.72_0.12_75)]' : 'text-gray-400'}`}>{t.dailyReward}</span>
              {canClaim && (
                <span className="text-xs px-2 py-1 rounded-full bg-[oklch(0.72_0.12_75)] text-black font-black">
                  +{[10,15,20,30,40,50,100][(state.dailyRewards?.consecutiveDays || 0) % 7]} 🪙
                </span>
              )}
            </Link>
            <Link href="/chat" className="flex flex-col items-center justify-center gap-2 p-5 rounded-2xl border border-amber-500/20 bg-[oklch(0.14_0.015_240)] min-h-[100px] transition-all hover:scale-[1.02] hover:bg-amber-500/10">
              <span className="text-3xl">👨‍👩‍👧‍👦</span>
              <span className="text-sm sm:text-base font-bold text-amber-300">{t.specialists}</span>
            </Link>
            <Link href="/promptear" className="flex flex-col items-center justify-center gap-2 p-5 rounded-2xl border border-yellow-500/20 bg-[oklch(0.14_0.015_240)] min-h-[100px] transition-all hover:scale-[1.02] hover:bg-yellow-500/10">
              <span className="text-3xl">🧠</span>
              <span className="text-sm sm:text-base font-bold text-yellow-300">{t.learnPrompts}</span>
            </Link>
            <Link href="/mi-progreso" className="flex flex-col items-center justify-center gap-2 p-5 rounded-2xl border border-purple-500/20 bg-[oklch(0.14_0.015_240)] min-h-[100px] transition-all hover:scale-[1.02] hover:bg-purple-500/10">
              <span className="text-3xl">📊</span>
              <span className="text-sm sm:text-base font-bold text-purple-300">{t.myProgress}</span>
            </Link>
          </div>

          {/* ═══ YOUR ADVENTURE — Level path ═══ */}
          <h2 className="font-['Space_Grotesk'] font-bold text-2xl sm:text-3xl text-white mb-6">{t.yourAdventure}</h2>

          <div className="relative">
            {/* Connecting line */}
            <div className="absolute left-9 sm:left-10 top-0 bottom-0 w-1 bg-gradient-to-b from-[oklch(0.82_0.15_195)] via-[oklch(0.72_0.12_75)] to-gray-700 rounded-full" />

            {/* Active Levels */}
            <div className="space-y-5">
              {LEVEL_CONFIG.map((level) => {
                const unlocked = isLevelUnlocked(level.id);
                const levelState = getLevelState(level.id);
                const completed = levelState.completed;
                const tKey = `level${level.id}` as keyof typeof t;
                const tDescKey = `level${level.id}Desc` as keyof typeof t;
                const tWorldKey = `level${level.id}World` as keyof typeof t;

                return (
                  <div key={level.id} className="relative flex gap-4 sm:gap-5 items-start">
                    {/* Node circle — BIGGER */}
                    <div className={`relative z-10 w-[72px] h-[72px] sm:w-20 sm:h-20 rounded-full flex items-center justify-center text-3xl sm:text-4xl shrink-0 border-[3px] transition-all ${
                      completed
                        ? `bg-gradient-to-br ${level.gradient} border-white/20`
                        : unlocked
                        ? `bg-[oklch(0.14_0.015_240)]`
                        : "bg-[oklch(0.14_0.015_240)] border-gray-700"
                    }`}
                    style={{
                      borderColor: completed || unlocked ? level.color : undefined,
                      boxShadow: completed ? `0 0 25px ${level.color}` : unlocked ? `0 0 15px ${level.color}` : undefined,
                    }}>
                      {!unlocked ? "🔒" : level.icon}
                    </div>

                    {/* Card — BIGGER text */}
                    <div className={`flex-1 rounded-2xl p-5 sm:p-6 border transition-all ${
                      completed
                        ? `bg-gradient-to-r ${level.gradient.replace('from-', 'from-').replace('to-', 'to-')}/10 border-white/10`
                        : unlocked
                        ? "bg-[oklch(0.14_0.015_240)] border-[oklch(0.82_0.15_195)]/30 shadow-[0_0_20px_oklch(0.82_0.15_195/0.1)]"
                        : "bg-[oklch(0.12_0.01_240)] border-gray-800 opacity-50"
                    }`}>
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2 flex-wrap">
                            <span className="text-sm px-3 py-1 rounded-full font-bold" style={{
                              backgroundColor: `color-mix(in oklch, ${level.color}, transparent 85%)`,
                              color: level.color,
                            }}>
                              {t[tWorldKey]}
                            </span>
                            {completed && <span className="text-sm text-green-400 font-bold">✓ {t.completed}</span>}
                            <DifficultyBadge difficulty={LEVEL_DIFFICULTY[level.id]} lang={lang} size="sm" />
                          </div>
                          <h3 className="font-['Space_Grotesk'] font-bold text-xl sm:text-2xl text-white">{t[tKey]}</h3>
                          <p className="text-gray-400 text-base sm:text-lg mt-1">{t[tDescKey]}</p>
                          {completed && levelState.stars > 0 && (
                            <div className="mt-2 text-yellow-400 text-xl">
                              {"⭐".repeat(levelState.stars)}{"☆".repeat(3 - levelState.stars)}
                              <span className="text-sm text-gray-500 ml-2">{levelState.stars}/3 {t.stars}</span>
                            </div>
                          )}
                        </div>

                        {/* Avatar — BIGGER */}
                        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden border-[3px] shrink-0" style={{ borderColor: level.color }}>
                          <img src={AVATAR_FRONTAL[level.avatar]} alt={level.avatar} className="w-full h-full object-cover" />
                        </div>
                      </div>

                      {/* Action button — BIGGER */}
                      {unlocked && (
                        <Link href={level.route}
                          className="mt-4 block w-full text-center py-4 rounded-2xl font-black text-lg sm:text-xl transition-all min-h-[56px] flex items-center justify-center"
                          style={{
                            backgroundColor: completed ? "transparent" : level.color,
                            color: completed ? level.color : "black",
                            border: completed ? `2px solid ${level.color}` : "none",
                          }}>
                          {completed ? `🔄 ${t.replay}` : `▶ ${t.play}`}
                        </Link>
                      )}
                      {!unlocked && (
                        <div className="mt-4 w-full text-center py-4 rounded-2xl font-bold text-lg bg-gray-800 text-gray-500 min-h-[56px] flex items-center justify-center">
                          🔒 {t.locked}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {/* Future levels */}
              {FUTURE_LEVELS.map((level) => {
                const tKey = `level${level.id}` as keyof typeof t;
                const tDescKey = `level${level.id}Desc` as keyof typeof t;
                return (
                  <div key={level.id} className="relative flex gap-4 sm:gap-5 items-start opacity-30">
                    <div className="relative z-10 w-[72px] h-[72px] sm:w-20 sm:h-20 rounded-full flex items-center justify-center text-3xl shrink-0 bg-[oklch(0.12_0.01_240)] border-[3px] border-gray-800">
                      🔒
                    </div>
                    <div className="flex-1 rounded-2xl p-5 sm:p-6 bg-[oklch(0.12_0.01_240)] border border-gray-800">
                      <h3 className="font-['Space_Grotesk'] font-bold text-lg sm:text-xl text-gray-500">{t[tKey] || `Nivel ${level.id}`}</h3>
                      <p className="text-gray-600 text-base mt-1">{t[tDescKey] || t.comingSoon}</p>
                      <div className="mt-4 w-full text-center py-3 rounded-2xl text-base bg-gray-800 text-gray-600 font-bold">
                        {t.comingSoon}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Reset button */}
          <div className="mt-16 text-center">
            <button onClick={handleReset} className="text-sm text-gray-600 hover:text-gray-400 transition-colors underline px-4 py-3 min-h-[44px]">
              {t.resetProgress}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Jugar() {
  // If tutorial not completed, redirect to tutorial first
  const tutorialCompleted = typeof window !== 'undefined' && localStorage.getItem('lince-tutorial-completed') === 'true';
  if (!tutorialCompleted) {
    if (typeof window !== 'undefined') window.location.href = '/tutorial';
    return null;
  }
  return (
    <RequireLogin>
      <JugarContent />
    </RequireLogin>
  );
}

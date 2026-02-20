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
    prompts: "Prompts escritos",
    level1: "Tu Primer Prompt",
    level1Desc: "Aprende a hablar con la IA en la Academia",
    level1World: "Academia LINCE",
    level2: "Tu Primera Habitación",
    level2Desc: "Construye tu casa en el Mundo LINCE",
    level2World: "Mundo LINCE",
    level3: "Tu Primer Raid",
    level3Desc: "Defiende tu casa en un combate PvP",
    level3World: "LINCE Raids",
    locked: "Bloqueado",
    completed: "Completado",
    play: "Jugar",
    replay: "Repetir",
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
    dailyReward: "Recompensa Diaria",
    dailyRewardClaim: "¡Reclama tus LinceCoins!",
    dailyRewardClaimed: "Vuelve mañana",
  },
  en: {
    title: "LINCE",
    subtitle: "Adventure Map",
    linceCoins: "LinceCoins",
    xp: "Experience",
    streak: "Streak",
    days: "days",
    prompts: "Prompts written",
    level1: "Your First Prompt",
    level1Desc: "Learn to talk to AI at the Academy",
    level1World: "LINCE Academy",
    level2: "Your First Room",
    level2Desc: "Build your house in World LINCE",
    level2World: "World LINCE",
    level3: "Your First Raid",
    level3Desc: "Defend your house in PvP combat",
    level3World: "LINCE Raids",
    locked: "Locked",
    completed: "Completed",
    play: "Play",
    replay: "Replay",
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
  },
  zh: {
    title: "LINCE",
    subtitle: "冒险地图",
    linceCoins: "LinceCoins",
    xp: "经验",
    streak: "连续",
    days: "天",
    prompts: "已写提示词",
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

  return (
    <div className="pt-14 min-h-screen bg-[oklch(0.10_0.01_240)] text-white">
      <GlobalNavBar />
      <div className="max-w-2xl mx-auto px-4 pt-6 pb-16">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <Link href="/" className="text-[oklch(0.82_0.15_195)] text-sm hover:underline">{t.backToHome}</Link>
          <div className="flex items-center gap-3">
            <GameLanguageSelector variant="pill" />
            <UserNavBadge variant="compact" />
            <div className="text-right">
              <h1 className="text-2xl font-black bg-gradient-to-r from-[oklch(0.82_0.15_195)] to-[oklch(0.72_0.12_75)] bg-clip-text text-transparent">{t.title}</h1>
              <p className="text-xs text-gray-500">{t.subtitle}</p>
            </div>
          </div>
        </div>

        {/* Player info bar */}
        {loggedUser && (
          <div className="mb-6 bg-gradient-to-r from-[oklch(0.82_0.15_195)]/10 to-[oklch(0.72_0.12_75)]/10 border border-[oklch(0.82_0.15_195)]/20 rounded-xl p-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[oklch(0.82_0.15_195)]/20 border border-[oklch(0.82_0.15_195)]/40 flex items-center justify-center text-lg font-black text-[oklch(0.82_0.15_195)]">
                {loggedUser.username.charAt(0)}
              </div>
              <div>
                <p className="font-bold text-white text-sm">{loggedUser.username}</p>
                <p className="text-gray-400 text-[10px]">{loggedUser.realName} · {loggedUser.email}</p>
              </div>
            </div>
            <button onClick={handleLogout} className="text-gray-500 hover:text-gray-300 text-xs transition-colors">
              {t.logout}
            </button>
          </div>
        )}

        {/* Daily Rewards Banner */}
        <Link href="/recompensas">
          <div className={`mb-4 p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all hover:scale-[1.01] ${
            canClaim
              ? "bg-gradient-to-r from-[oklch(0.72_0.12_75)]/15 to-[oklch(0.82_0.15_195)]/15 border-[oklch(0.72_0.12_75)]/40 shadow-[0_0_15px_oklch(0.72_0.12_75/0.15)]"
              : "bg-[oklch(0.14_0.015_240)] border-gray-800"
          }`}>
            <div className="flex items-center gap-3">
              <span className={`text-2xl ${canClaim ? 'animate-bounce' : ''}`}>🎁</span>
              <div>
                <p className={`font-bold text-sm ${canClaim ? 'text-[oklch(0.72_0.12_75)]' : 'text-gray-500'}`}>{t.dailyReward}</p>
                <p className={`text-xs ${canClaim ? 'text-gray-400' : 'text-gray-600'}`}>
                  {canClaim ? t.dailyRewardClaim : t.dailyRewardClaimed}
                </p>
              </div>
            </div>
            {canClaim && (
              <div className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-[oklch(0.72_0.12_75)] to-[oklch(0.82_0.15_195)] text-black text-xs font-black">
                🪙 +{[10,15,20,30,40,50,100][(state.dailyRewards?.consecutiveDays || 0) % 7]}
              </div>
            )}
          </div>
        </Link>

        {/* Stats bar */}
        <div className="grid grid-cols-4 gap-2 mb-8">
          <div className="bg-[oklch(0.14_0.015_240)] rounded-xl p-3 text-center border border-[oklch(0.72_0.12_75)]/20">
            <div className="text-xl font-black text-[oklch(0.72_0.12_75)]">🪙 {state.linceCoins}</div>
            <div className="text-[10px] text-gray-500 mt-1">{t.linceCoins}</div>
          </div>
          <div className="bg-[oklch(0.14_0.015_240)] rounded-xl p-3 text-center border border-[oklch(0.82_0.15_195)]/20">
            <div className="text-xl font-black text-[oklch(0.82_0.15_195)]">⚡ {state.xp}</div>
            <div className="text-[10px] text-gray-500 mt-1">{t.xp}</div>
          </div>
          <div className="bg-[oklch(0.14_0.015_240)] rounded-xl p-3 text-center border border-orange-500/20">
            <div className="text-xl font-black text-orange-400">🔥 {state.streak}</div>
            <div className="text-[10px] text-gray-500 mt-1">{t.streak}</div>
          </div>
          <div className="bg-[oklch(0.14_0.015_240)] rounded-xl p-3 text-center border border-purple-500/20">
            <div className="text-xl font-black text-purple-400">✍️ {state.totalPromptsWritten}</div>
            <div className="text-[10px] text-gray-500 mt-1">{t.prompts}</div>
          </div>
        </div>

        {/* Level path — vertical map */}
        <div className="relative">
          {/* Connecting line */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[oklch(0.82_0.15_195)] via-[oklch(0.72_0.12_75)] to-gray-700" />

          {/* Levels */}
          <div className="space-y-6">
            {LEVEL_CONFIG.map((level) => {
              const unlocked = isLevelUnlocked(level.id);
              const levelState = getLevelState(level.id);
              const completed = levelState.completed;
              const tKey = `level${level.id}` as keyof typeof t;
              const tDescKey = `level${level.id}Desc` as keyof typeof t;
              const tWorldKey = `level${level.id}World` as keyof typeof t;

              return (
                <div key={level.id} className="relative flex gap-4 items-start">
                  {/* Node */}
                  <div className={`relative z-10 w-16 h-16 rounded-full flex items-center justify-center text-2xl shrink-0 border-3 transition-all ${
                    completed
                      ? `bg-gradient-to-br ${level.gradient} border-white/20`
                      : unlocked
                      ? `bg-[oklch(0.14_0.015_240)]`
                      : "bg-[oklch(0.14_0.015_240)] border-gray-700"
                  }`}
                  style={{
                    borderColor: completed || unlocked ? level.color : undefined,
                    boxShadow: completed ? `0 0 20px ${level.color}` : unlocked ? `0 0 10px ${level.color}` : undefined,
                  }}>
                    {!unlocked ? "🔒" : level.icon}
                  </div>

                  {/* Card */}
                  <div className={`flex-1 rounded-2xl p-4 border transition-all ${
                    completed
                      ? "bg-[oklch(0.14_0.015_240)] border-green-500/30"
                      : unlocked
                      ? "bg-[oklch(0.14_0.015_240)] border-[oklch(0.82_0.15_195)]/30 shadow-[0_0_15px_oklch(0.82_0.15_195/0.1)]"
                      : "bg-[oklch(0.12_0.01_240)] border-gray-800 opacity-50"
                  }`}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs px-2 py-0.5 rounded-full font-bold" style={{
                            backgroundColor: `color-mix(in oklch, ${level.color}, transparent 85%)`,
                            color: level.color,
                          }}>
                            {t[tWorldKey]}
                          </span>
                          {completed && <span className="text-xs text-green-400">✓ {t.completed}</span>}
                          <DifficultyBadge difficulty={LEVEL_DIFFICULTY[level.id]} lang={lang} size="sm" />
                        </div>
                        <h3 className="font-bold text-lg">{t[tKey]}</h3>
                        <p className="text-gray-400 text-sm">{t[tDescKey]}</p>
                        {completed && levelState.stars > 0 && (
                          <div className="mt-1 text-yellow-400 text-sm">
                            {"⭐".repeat(levelState.stars)}{"☆".repeat(3 - levelState.stars)}
                          </div>
                        )}
                      </div>

                      {/* Avatar */}
                      <div className="w-12 h-12 rounded-full overflow-hidden border-2 shrink-0" style={{ borderColor: level.color }}>
                        <img src={AVATAR_FRONTAL[level.avatar]} alt={level.avatar} className="w-full h-full object-cover" />
                      </div>
                    </div>

                    {/* Action button */}
                    {unlocked && (
                      <Link href={level.route}
                        className="mt-3 block w-full text-center py-2.5 rounded-xl font-bold text-sm transition-all"
                        style={{
                          backgroundColor: completed ? "transparent" : level.color,
                          color: completed ? level.color : "black",
                          border: completed ? `1px solid ${level.color}` : "none",
                        }}>
                        {completed ? t.replay : t.play}
                      </Link>
                    )}
                    {!unlocked && (
                      <div className="mt-3 w-full text-center py-2.5 rounded-xl font-bold text-sm bg-gray-800 text-gray-600">
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
                <div key={level.id} className="relative flex gap-4 items-start opacity-30">
                  <div className="relative z-10 w-16 h-16 rounded-full flex items-center justify-center text-2xl shrink-0 bg-[oklch(0.12_0.01_240)] border-2 border-gray-800">
                    🔒
                  </div>
                  <div className="flex-1 rounded-2xl p-4 bg-[oklch(0.12_0.01_240)] border border-gray-800">
                    <h3 className="font-bold text-gray-500">{t[tKey] || `Nivel ${level.id}`}</h3>
                    <p className="text-gray-600 text-sm">{t[tDescKey] || t.comingSoon}</p>
                    <div className="mt-3 w-full text-center py-2 rounded-xl text-xs bg-gray-800 text-gray-600">
                      {t.comingSoon}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Reset button */}
        <div className="mt-12 text-center">
          <button onClick={handleReset} className="text-xs text-gray-600 hover:text-gray-400 transition-colors underline">
            {t.resetProgress}
          </button>
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

import { tl } from "@/contexts/PRDLanguageContext";
import { useState, useEffect } from "react";
import { useGame } from "@/contexts/GameContext";
import { AVATAR_FRONTAL, AVATAR_EXPRESSIONS, getAvatarImage } from "@/lib/avatarConstants";
import { AvatarSelector } from "@/components/AvatarSelector";
import { Link } from "wouter";
import { Camera } from "lucide-react";
import { UnlockBanner } from "@/components/UnlockBanner";
import { useProgressiveUnlock } from "@/hooks/useProgressiveUnlock";
import { NextStepFooter } from "@/components/NextStepFooter";
import { LEVEL_MAP } from "@/lib/gameConfig";
import { GlobalNavBar } from "@/components/GlobalNavBar";
import { BackButton } from "@/components/BackButton";

// ─── Translations ───
const T: Record<string, Record<string, string>> = {
  es: {
    greeting: "¡Hola",
    subtitle: "Tu Aventura",
    linceCoins: "LinceCoins",
    xp: "XP",
    streak: "Racha",
    days: "días",
    level1: "Habla con la IA",
    level1Desc: "Aprende a escribir tu primer prompt",
    level2: "Decora tu Mundo",
    level2Desc: "Construye tu espacio en el Mundo LINCE",
    level3: "Tu Primera Batalla",
    level3Desc: "Defiende tu espacio en combate PvP",
    locked: "Bloqueado",
    completed: "Completado",
    play: "JUGAR",
    replay: "Repetir",
    comingSoon: "Próximamente",
    level4: "Prompts Avanzados",
    level4Desc: "Domina prompts complejos",
    level5: "Batalla en Equipo",
    level5Desc: "Combate cooperativo",
    level6: "Prueba Final",
    level6Desc: "Demuestra todo lo aprendido",
    dailyReward: "Premio del Día",
    dailyRewardDesc: "¡Recoge tus LinceCoins!",
    dailyRewardClaimed: "Vuelve mañana",
    personajes: "Especialistas",
    perfil: "Mi Progreso",
    logout: "Salir",
    stars: "estrellas",
    welcomeMsg: "¡Bienvenido a LINCE! Aprende IA jugando. Cada nivel te enseña a escribir mejores prompts.",
  },
  en: {
    greeting: "Hello",
    subtitle: "Your Adventure",
    linceCoins: "LinceCoins",
    xp: "XP",
    streak: "Streak",
    days: "days",
    level1: "Talk to AI",
    level1Desc: "Learn to write your first prompt",
    level2: "Decorate Your World",
    level2Desc: "Build your space in LINCE World",
    level3: "Your First Battle",
    level3Desc: "Defend your space in PvP combat",
    locked: "Locked",
    completed: "Completed",
    play: "PLAY",
    replay: "Replay",
    comingSoon: "Coming Soon",
    level4: "Advanced Prompts",
    level4Desc: "Master complex prompts",
    level5: "Team Battle",
    level5Desc: "Cooperative combat",
    level6: "Final Test",
    level6Desc: "Prove everything you learned",
    dailyReward: "Daily Prize",
    dailyRewardDesc: "Collect your LinceCoins!",
    dailyRewardClaimed: "Come back tomorrow",
    personajes: "Specialists",
    perfil: "My Progress",
    logout: "Log Out",
    stars: "stars",
    welcomeMsg: "Welcome to LINCE! Learn AI by playing. Each level teaches you to write better prompts.",
  },
  zh: {
    greeting: "你好",
    subtitle: "你的冒险之旅",
    linceCoins: "林斯币",
    xp: "经验值",
    streak: "连续",
    days: "天",
    level1: "与AI对话",
    level1Desc: "学习写你的第一个提示词",
    level2: "装饰你的世界",
    level2Desc: "在LINCE世界建造你的空间",
    level3: "你的第一场战斗",
    level3Desc: "在PvP战斗中保卫你的空间",
    locked: "锁定",
    completed: "已完成",
    play: "开始",
    replay: "重玩",
    comingSoon: "即将推出",
    level4: "高级提示词",
    level4Desc: "掌握复杂提示词",
    level5: "团队战斗",
    level5Desc: "合作战斗",
    level6: "最终测试",
    level6Desc: "证明你所学到的一切",
    dailyReward: "今日奖品",
    dailyRewardDesc: "领取你的林斯币！",
    dailyRewardClaimed: "明天再来",
    personajes: "专家",
    perfil: "我的进度",
    logout: "退出",
    stars: "星",
    welcomeMsg: "欢迎来到LINCE！通过游戏学习AI。每个关卡教你写更好的提示词。",
  },
};

// ─── Level Data ───
const LEVELS = LEVEL_MAP;

export default function GameHub() {
  const { state, isLoggedIn, loggedUser, canClaimDailyReward, logout } = useGame();
  const [lang, setLang] = useState<"es" | "en" | "zh">("es");
  const t = T[lang] || T.es;

  // Load language from logged user or localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem("lince-user");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.language && ["es", "en", "zh"].includes(parsed.language)) {
          setLang(parsed.language);
        }
      }
    } catch { /* ignore */ }
  }, []);

  const avatarImg = getAvatarImage(state.avatarKey) || AVATAR_FRONTAL.PEQUELIN;
  const avatarExpression = state.xp > 100
    ? AVATAR_EXPRESSIONS[state.avatarKey]?.celebrando
    : AVATAR_EXPRESSIONS[state.avatarKey]?.feliz;

  const canClaim = canClaimDailyReward();
  const { unlocks, isRouteUnlocked, refetch: refetchUnlocks } = useProgressiveUnlock();
  const [showAvatarSelector, setShowAvatarSelector] = useState(false);
  const [savingAvatar, setSavingAvatar] = useState(false);

  const handleAvatarChange = async (newKey: string) => {
    setSavingAvatar(true);
    try {
      const stored = localStorage.getItem("lince-user");
      if (!stored) throw new Error("No user");
      const user = JSON.parse(stored);
      const gameToken = localStorage.getItem("lince-game-token");
      if (user.id && gameToken) {
        await fetch("/api/trpc/gamePlayer.setAvatar", {
          method: "POST",
          headers: { "Content-Type": "application/json", "x-game-token": gameToken },
          credentials: "include",
          body: JSON.stringify({ json: { playerId: Number(user.id), avatarKey: newKey } }),
        });
      }
      user.avatarKey = newKey;
      localStorage.setItem("lince-user", JSON.stringify(user));
      const gameState = localStorage.getItem("lince_game_state");
      if (gameState) {
        const gs = JSON.parse(gameState);
        gs.avatarKey = newKey;
        localStorage.setItem("lince_game_state", JSON.stringify(gs));
      }
      window.dispatchEvent(new CustomEvent("lince-avatar-change", { detail: newKey }));
      window.dispatchEvent(new CustomEvent("lince-login"));
      setShowAvatarSelector(false);
      setTimeout(() => window.location.reload(), 300);
    } catch { /* ignore */ } finally {
      setSavingAvatar(false);
    }
  };

  const handleLogout = () => {
    logout();
    localStorage.removeItem("lince-user");
    localStorage.removeItem("lince-game-token");
    localStorage.removeItem("lince_game_state");
    window.location.href = "/login";
  };

  return (
    <div className="pt-14 min-h-screen bg-[oklch(0.10_0.01_240)] text-white">
      <BackButton variant="inline" />
      <GlobalNavBar />
      {/* ─── Top Navigation Bar ─── */}

      {/* ─── Player Stats Bar ─── */}
      <div className="bg-[oklch(0.12_0.01_240)] border-b border-white/5">
        <div className="container px-4 py-3 flex items-center justify-between gap-2 overflow-x-auto">
          <div className="flex items-center gap-1 flex-shrink-0">
            <span className="text-lg">🪙</span>
            <span className="text-[oklch(0.72_0.12_75)] font-bold text-sm">{state.linceCoins}</span>
          </div>
          <div className="flex items-center gap-1 flex-shrink-0">
            <span className="text-lg">⚡</span>
            <span className="text-[oklch(0.82_0.15_195)] font-bold text-sm">{state.xp} {t.xp}</span>
          </div>
          <div className="flex items-center gap-1 flex-shrink-0">
            <span className="text-lg">🔥</span>
            <span className="text-orange-400 font-bold text-sm">{state.streak} {t.days}</span>
          </div>
          <div className="flex items-center gap-1 flex-shrink-0">
            <span className="text-lg">📝</span>
            <span className="text-gray-400 font-bold text-sm">{state.totalPromptsWritten}</span>
          </div>
        </div>
      </div>

      {/* ─── Welcome Message with Avatar ─── */}
      <div className="container px-4 pt-6 pb-4">
        <div className="flex items-start gap-4 bg-[oklch(0.14_0.015_240)] rounded-2xl p-4 border border-[oklch(0.82_0.15_195)]/10">
          <button onClick={() => setShowAvatarSelector(true)} className="relative group w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 border-2 border-[oklch(0.82_0.15_195)]/30 hover:border-[oklch(0.82_0.15_195)] transition-colors" title="Cambiar avatar">
            <img src={avatarExpression || avatarImg} alt="Avatar" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-xl">
              <Camera className="w-5 h-5 text-white" />
            </div>
          </button>
          <div className="flex-1 min-w-0">
            <h2 className="font-['Space_Grotesk'] font-bold text-lg text-white">
              {t.greeting}, {loggedUser?.realName || loggedUser?.username || state.playerName}!
            </h2>
            <p className="text-gray-400 text-sm mt-1 leading-relaxed">{t.welcomeMsg}</p>
          </div>
        </div>
      </div>

      {/* ─── Progressive Unlock Banner ─── */}
      <div className="container px-4 pb-2">
        <UnlockBanner lang={lang} />
      </div>

      {/* ─── Quick Actions ─── */}
      <div className="container px-4 pb-4">
        <div className="grid grid-cols-3 gap-3">
          {/* Daily Reward */}
          <Link
            href="/recompensas"
            className={`relative flex flex-col items-center gap-2 p-4 rounded-xl border transition-all ${
              canClaim
                ? "bg-gradient-to-br from-amber-500/20 to-yellow-500/10 border-amber-500/30 hover:border-amber-400/60"
                : "bg-[oklch(0.14_0.015_240)] border-white/5 hover:border-white/10"
            }`}
          >
            {canClaim && (
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
            )}
            <span className="text-2xl">🎁</span>
            <span className="text-xs font-bold text-center leading-tight">
              {canClaim ? t.dailyReward : t.dailyRewardClaimed}
            </span>
          </Link>

          {/* Characters */}
          <Link
            href="/personajes"
            className="flex flex-col items-center gap-2 p-4 rounded-xl bg-[oklch(0.14_0.015_240)] border border-white/5 hover:border-[oklch(0.82_0.15_195)]/30 transition-all"
          >
            <span className="text-2xl">👥</span>
            <span className="text-xs font-bold text-center">{t.personajes}</span>
          </Link>

          {/* Profile */}
          <Link
            href="/perfil"
            className="flex flex-col items-center gap-2 p-4 rounded-xl bg-[oklch(0.14_0.015_240)] border border-white/5 hover:border-[oklch(0.82_0.15_195)]/30 transition-all"
          >
            <span className="text-2xl">👤</span>
            <span className="text-xs font-bold text-center">{t.perfil}</span>
          </Link>
        </div>

        {/* Extra quick links — with lock indicators */}
        <div className="grid grid-cols-4 gap-2 mt-3">
          {[
            { href: "/promptear", icon: "🎯", label: "Aprender Prompts", unlockKey: "promptear" as const, activeStyle: "bg-gradient-to-br from-purple-500/20 to-pink-500/10 border-purple-500/30 hover:border-purple-400/60" },
            { href: "/mundo", icon: "🌍", label: "Mundo", unlockKey: "mundo" as const, activeStyle: "bg-[oklch(0.14_0.015_240)] border-white/5 hover:border-amber-500/30" },
            { href: "/raids", icon: "⚔️", label: "Batallas", unlockKey: "raids" as const, activeStyle: "bg-[oklch(0.14_0.015_240)] border-white/5 hover:border-red-500/30" },
            { href: "/academia", icon: "🎓", label: "Cursos", unlockKey: "academia" as const, activeStyle: "bg-[oklch(0.14_0.015_240)] border-white/5 hover:border-emerald-500/30" },
          ].map((item) => {
            const isLocked = !unlocks[item.unlockKey];
            return isLocked ? (
              <div
                key={item.href}
                className="relative flex flex-col items-center gap-1 p-3 rounded-xl bg-[oklch(0.10_0.01_240)] border border-white/5 opacity-40 cursor-not-allowed"
                title={tl(lang, { es: 'Bloqueado', en: 'Locked', zh: '锁定', 'pt-BR': 'Bloqueado', 'pt-PT': 'Bloqueado' })}
              >
                <span className="text-xl grayscale">{item.icon}</span>
                <span className="text-[10px] font-bold text-center text-gray-500">{item.label}</span>
                <span className="absolute -top-1 -right-1 text-[10px]">🔒</span>
              </div>
            ) : (
              <Link key={item.href} href={item.href} className={`flex flex-col items-center gap-1 p-3 rounded-xl border transition-all ${item.activeStyle}`}>
                <span className="text-xl">{item.icon}</span>
                <span className="text-[10px] font-bold text-center">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* ─── Level Map ─── */}
      <div className="container px-4 pb-8">
        <h2 className="font-['Space_Grotesk'] font-bold text-xl mb-4">
          {t.subtitle}
        </h2>

        <div className="space-y-4">
          {LEVELS.map((level, idx) => {
            const levelState = state.levels.find((l) => l.id === level.id);
            const isUnlocked = level.id <= state.currentLevel;
            const isCompleted = levelState?.completed || false;
            const isCurrent = level.id === state.currentLevel && !isCompleted;
            const isComingSoon = level.id > 3;
            const stars = levelState?.stars || 0;

            const titleKey = `level${level.id}` as keyof typeof t;
            const descKey = `level${level.id}Desc` as keyof typeof t;

            return (
              <div key={level.id} className="relative">
                {/* Connector line */}
                {idx > 0 && (
                  <div className="absolute -top-4 left-8 w-0.5 h-4 bg-gradient-to-b from-white/10 to-white/5" />
                )}

                {isComingSoon ? (
                  <div className="flex items-center gap-4 p-4 rounded-xl bg-[oklch(0.14_0.015_240)] border border-white/5 opacity-50">
                    <div className="w-14 h-14 rounded-xl bg-gray-800 flex items-center justify-center text-2xl flex-shrink-0">
                      🔒
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-gray-500">{t[titleKey] || `Nivel ${level.id}`}</h3>
                      <p className="text-gray-600 text-xs mt-0.5">{t[descKey] || ""}</p>
                      <span className="inline-block mt-1 text-[10px] bg-gray-800 text-gray-500 px-2 py-0.5 rounded-full">
                        {t.comingSoon}
                      </span>
                    </div>
                  </div>
                ) : (
                  <Link
                    href={isUnlocked ? level.path : "#"}
                    className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${
                      isCurrent
                        ? `bg-gradient-to-r ${level.color} border-transparent shadow-lg ${level.bgGlow} shadow-xl`
                        : isCompleted
                        ? "bg-[oklch(0.14_0.015_240)] border-emerald-500/30 hover:border-emerald-400/50"
                        : isUnlocked
                        ? "bg-[oklch(0.14_0.015_240)] border-[oklch(0.82_0.15_195)]/20 hover:border-[oklch(0.82_0.15_195)]/40"
                        : "bg-[oklch(0.14_0.015_240)] border-white/5 opacity-50 cursor-not-allowed"
                    }`}
                  >
                    <div
                      className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 ${
                        isCurrent ? "bg-white/20" : "bg-[oklch(0.18_0.01_240)]"
                      }`}
                    >
                      {isCompleted ? "✅" : level.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className={`font-bold ${isCurrent ? "text-white" : isCompleted ? "text-emerald-400" : "text-white"}`}>
                        {t[titleKey] || `Nivel ${level.id}`}
                      </h3>
                      <p className={`text-xs mt-0.5 ${isCurrent ? "text-white/70" : "text-gray-400"}`}>
                        {t[descKey] || ""}
                      </p>
                      {isCompleted && stars > 0 && (
                        <div className="flex items-center gap-0.5 mt-1">
                          {[1, 2, 3].map((s) => (
                            <span key={s} className={`text-sm ${s <= stars ? "text-yellow-400" : "text-gray-600"}`}>
                              ★
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="flex-shrink-0">
                      {isCurrent && (
                        <span className="px-4 py-2 bg-white/20 rounded-lg font-black text-sm">
                          {t.play}
                        </span>
                      )}
                      {isCompleted && (
                        <span className="px-3 py-1.5 bg-emerald-500/20 text-emerald-400 rounded-lg font-bold text-xs">
                          {t.replay}
                        </span>
                      )}
                      {isUnlocked && !isCurrent && !isCompleted && (
                        <span className="px-3 py-1.5 bg-[oklch(0.82_0.15_195)]/20 text-[oklch(0.82_0.15_195)] rounded-lg font-bold text-xs">
                          {t.play}
                        </span>
                      )}
                    </div>
                  </Link>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* P2-9: Next Step Footer */}
      <NextStepFooter currentPath="/jugar" />

      {/* ─── Footer ─── */}
      <div className="container px-4 pb-6 text-center">
        <p className="text-gray-600 text-xs">
          LINCE &copy; 2024-2026 ACNB IA SL
        </p>
      </div>

      {/* Avatar Selector Modal */}
      <AvatarSelector
        isOpen={showAvatarSelector}
        onClose={() => setShowAvatarSelector(false)}
        currentAvatarKey={state.avatarKey}
        onSelect={handleAvatarChange}
        saving={savingAvatar}
      />
    </div>
  );
}

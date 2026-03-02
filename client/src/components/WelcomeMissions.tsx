import { useState, useEffect, useCallback } from "react";
import { useGame } from "@/contexts/GameContext";
import { Link } from "wouter";
import { AVATAR_FRONTAL, getAvatarImage } from "@/lib/avatarConstants";

// ─── MISSION DEFINITIONS ───
interface Mission {
  id: string;
  icon: string;
  reward: number; // LinceCoins
  xpReward: number;
  route: string;
  checkKey: string; // localStorage key to check completion
}

const MISSIONS: Mission[] = [
  {
    id: "chat_avatar",
    icon: "💬",
    reward: 25,
    xpReward: 15,
    route: "/personajes",
    checkKey: "lince-mission-chat",
  },
  {
    id: "create_image",
    icon: "🖼️",
    reward: 30,
    xpReward: 20,
    route: "/prompt-studio",
    checkKey: "lince-mission-image",
  },
  {
    id: "play_level",
    icon: "🕹️",
    reward: 40,
    xpReward: 25,
    route: "/tutorial",
    checkKey: "lince-mission-play",
  },
  {
    id: "explore_arsenal",
    icon: "🛡️",
    reward: 20,
    xpReward: 10,
    route: "/arsenal-ia",
    checkKey: "lince-mission-arsenal",
  },
  {
    id: "create_lincelin",
    icon: "🎨",
    reward: 35,
    xpReward: 20,
    route: "/lincelin",
    checkKey: "lince-mission-lincelin",
  },
];

const T: Record<string, Record<string, string>> = {
  es: {
    title: "Misiones de Bienvenida",
    subtitle: "Completa estas misiones para ganar LinceCoins y conocer LINCE",
    reward: "Recompensa",
    coins: "LinceCoins",
    xp: "XP",
    completed: "Completada",
    go: "Ir",
    allDone: "Has completado todas las misiones de bienvenida",
    bonusTitle: "Bonus Completado",
    bonusDesc: "Has ganado un bonus extra por completar TODAS las misiones",
    bonusReward: "BONUS: +100 LinceCoins + 50 XP",
    progress: "Progreso",
    dismiss: "Cerrar",
    // Mission names
    chat_avatar: "Chatea con un avatar",
    chat_avatar_desc: "Ve a Personajes y habla con cualquier avatar IA",
    create_image: "Crea tu primera imagen",
    create_image_desc: "Usa Crear Imagen para generar una imagen con IA",
    play_level: "Completa el tutorial",
    play_level_desc: "Aprende cómo funciona LINCE antes de jugar",
    explore_arsenal: "Explora las Herramientas IA",
    explore_arsenal_desc: "Descubre las herramientas de inteligencia artificial",
    create_lincelin: "Crea tu Avatar",
    create_lincelin_desc: "Diseña tu propio avatar personalizado con IA",
  },
  en: {
    title: "Welcome Missions",
    subtitle: "Complete these missions to earn LinceCoins and explore LINCE",
    reward: "Reward",
    coins: "LinceCoins",
    xp: "XP",
    completed: "Completed",
    go: "Go",
    allDone: "You've completed all welcome missions",
    bonusTitle: "Bonus Complete",
    bonusDesc: "You earned an extra bonus for completing ALL missions",
    bonusReward: "BONUS: +100 LinceCoins + 50 XP",
    progress: "Progress",
    dismiss: "Close",
    chat_avatar: "Chat with an avatar",
    chat_avatar_desc: "Go to Characters and talk to any AI avatar",
    create_image: "Create your first image",
    create_image_desc: "Use Create Image to generate an image with AI",
    play_level: "Complete the tutorial",
    play_level_desc: "Learn how LINCE works before playing",
    explore_arsenal: "Explore the AI Arsenal",
    explore_arsenal_desc: "Discover artificial intelligence tools",
    create_lincelin: "Create your Avatar",
    create_lincelin_desc: "Design your own custom avatar with AI",
  },
  zh: {
    title: "欢迎任务",
    subtitle: "完成这些任务以赚取LinceCoins并探索LINCE",
    reward: "奖励",
    coins: "林斯币",
    xp: "经验值",
    completed: "已完成",
    go: "前往",
    allDone: "你已完成所有欢迎任务",
    bonusTitle: "奖励完成",
    bonusDesc: "完成所有任务获得额外奖励",
    bonusReward: "奖励: +100 林斯币 + 50 经验值",
    progress: "进度",
    dismiss: "关闭",
    chat_avatar: "与角色聊天",
    chat_avatar_desc: "前往角色页面与任何AI角色交谈",
    create_image: "创建你的第一张图片",
    create_image_desc: "使用创建图像用AI生成图片",
    play_level: "完成教程",
    play_level_desc: "在玩之前了解LINCE的运作方式",
    explore_arsenal: "探索AI武器库",
    explore_arsenal_desc: "发现人工智能工具",
    create_lincelin: "创建你的角色",
    create_lincelin_desc: "用AI设计你自己的自定义角色",
  },
};

const WELCOME_MISSIONS_KEY = "lince-welcome-missions";
const WELCOME_BONUS_KEY = "lince-welcome-bonus-claimed";
const WELCOME_DISMISSED_KEY = "lince-welcome-missions-dismissed";

export function WelcomeMissions({ lang = "es" }: { lang?: "es" | "en" | "zh" }) {
  const { addCoins, addXP, state } = useGame();
  const t = T[lang] || T.es;
  const [completedMissions, setCompletedMissions] = useState<string[]>([]);
  const [bonusClaimed, setBonusClaimed] = useState(false);
  const [showCelebration, setShowCelebration] = useState<string | null>(null);
  const [dismissed, setDismissed] = useState(false);

  // Load completed missions from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(WELCOME_MISSIONS_KEY);
      if (stored) setCompletedMissions(JSON.parse(stored));
      const bonus = localStorage.getItem(WELCOME_BONUS_KEY);
      if (bonus === "true") setBonusClaimed(true);
      const dis = localStorage.getItem(WELCOME_DISMISSED_KEY);
      if (dis === "true") setDismissed(true);
    } catch { /* ignore */ }
  }, []);

  // Check for mission completions based on user activity
  useEffect(() => {
    const checkMissions = () => {
      const newCompleted: string[] = [...completedMissions];
      let changed = false;

      // Chat mission: check if any chat session exists
      if (!newCompleted.includes("chat_avatar")) {
        const chatDone = localStorage.getItem("lince-mission-chat");
        if (chatDone === "true") {
          newCompleted.push("chat_avatar");
          changed = true;
        }
      }

      // Image mission
      if (!newCompleted.includes("create_image")) {
        const imgDone = localStorage.getItem("lince-mission-image");
        if (imgDone === "true") {
          newCompleted.push("create_image");
          changed = true;
        }
      }

      // Play level / tutorial mission
      if (!newCompleted.includes("play_level")) {
        const tutDone = localStorage.getItem("lince-tutorial-completed");
        if (tutDone === "true") {
          newCompleted.push("play_level");
          changed = true;
        }
      }

      // Arsenal mission
      if (!newCompleted.includes("explore_arsenal")) {
        const arsenalDone = localStorage.getItem("lince-mission-arsenal");
        if (arsenalDone === "true") {
          newCompleted.push("explore_arsenal");
          changed = true;
        }
      }

      // Lincelin mission
      if (!newCompleted.includes("create_lincelin")) {
        const lincelinDone = localStorage.getItem("lince-mission-lincelin");
        if (lincelinDone === "true") {
          newCompleted.push("create_lincelin");
          changed = true;
        }
      }

      if (changed) {
        setCompletedMissions(newCompleted);
        localStorage.setItem(WELCOME_MISSIONS_KEY, JSON.stringify(newCompleted));

        // Find newly completed mission and show celebration
        const newest = newCompleted.filter(m => !completedMissions.includes(m));
        if (newest.length > 0) {
          const mission = MISSIONS.find(m => m.id === newest[0]);
          if (mission) {
            addCoins(mission.reward);
            addXP(mission.xpReward);
            setShowCelebration(mission.id);
            setTimeout(() => setShowCelebration(null), 3000);
          }
        }
      }
    };

    checkMissions();
    // Re-check periodically
    const interval = setInterval(checkMissions, 2000);
    return () => clearInterval(interval);
  }, [completedMissions, addCoins, addXP]);

  // Check for all-complete bonus
  useEffect(() => {
    if (bonusClaimed) return;
    if (completedMissions.length === MISSIONS.length) {
      addCoins(100);
      addXP(50);
      setBonusClaimed(true);
      localStorage.setItem(WELCOME_BONUS_KEY, "true");
      setShowCelebration("bonus");
      setTimeout(() => setShowCelebration(null), 4000);
    }
  }, [completedMissions, bonusClaimed, addCoins, addXP]);

  const handleDismiss = useCallback(() => {
    setDismissed(true);
    localStorage.setItem(WELCOME_DISMISSED_KEY, "true");
  }, []);

  // Don't show if dismissed and all complete, or if dismissed
  if (dismissed && completedMissions.length === MISSIONS.length) return null;
  if (dismissed) return null;

  const completedCount = completedMissions.length;
  const totalCount = MISSIONS.length;
  const progressPct = Math.round((completedCount / totalCount) * 100);
  const avatarImg = getAvatarImage(state.avatarKey) || AVATAR_FRONTAL.LUMALIN;

  return (
    <div className="relative bg-gradient-to-br from-[oklch(0.14_0.02_240)] to-[oklch(0.12_0.015_260)] rounded-2xl border border-[oklch(0.82_0.15_195)]/15 overflow-hidden">
      {/* Celebration overlay */}
      {showCelebration && (
        <div className="absolute inset-0 z-20 bg-black/60 backdrop-blur-sm flex items-center justify-center animate-in fade-in duration-300">
          <div className="text-center p-6">
            {showCelebration === "bonus" ? (
              <>
                <div className="text-5xl mb-3 animate-bounce">🎉</div>
                <h3 className="font-['Space_Grotesk'] font-bold text-xl text-[oklch(0.72_0.12_75)] mb-2">{t.bonusTitle}</h3>
                <p className="text-gray-300 text-sm mb-2">{t.bonusDesc}</p>
                <p className="text-[oklch(0.82_0.15_195)] font-bold text-sm">{t.bonusReward}</p>
              </>
            ) : (
              <>
                <div className="text-5xl mb-3 animate-bounce">✅</div>
                <h3 className="font-['Space_Grotesk'] font-bold text-lg text-emerald-400 mb-1">
                  {t[showCelebration] || "Mission Complete"}
                </h3>
                <p className="text-gray-300 text-sm">{t.completed}!</p>
                <p className="text-[oklch(0.72_0.12_75)] font-bold text-xs mt-2">
                  +{MISSIONS.find(m => m.id === showCelebration)?.reward} {t.coins} · +{MISSIONS.find(m => m.id === showCelebration)?.xpReward} {t.xp}
                </p>
              </>
            )}
          </div>
        </div>
      )}

      {/* Header */}
      <div className="p-4 pb-2 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-[oklch(0.82_0.15_195)]/40">
            <img src={avatarImg} alt="Avatar" className="w-full h-full object-cover" />
          </div>
          <div>
            <h3 className="font-['Space_Grotesk'] font-bold text-sm text-white">{t.title}</h3>
            <p className="text-gray-500 text-[10px] max-w-[200px]">{t.subtitle}</p>
          </div>
        </div>
        <button
          onClick={handleDismiss}
          className="text-gray-600 hover:text-gray-400 text-xs px-2 py-1 rounded transition-colors"
        >
          {t.dismiss}
        </button>
      </div>

      {/* Progress bar */}
      <div className="px-4 pb-3">
        <div className="flex items-center justify-between mb-1">
          <span className="text-gray-500 text-[10px]">{t.progress}</span>
          <span className="text-[oklch(0.82_0.15_195)] text-[10px] font-bold">{completedCount}/{totalCount}</span>
        </div>
        <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[oklch(0.82_0.15_195)] to-emerald-400 rounded-full transition-all duration-700"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* Missions list */}
      <div className="px-4 pb-4 space-y-2">
        {MISSIONS.map((mission) => {
          const isCompleted = completedMissions.includes(mission.id);
          return (
            <div
              key={mission.id}
              className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                isCompleted
                  ? "bg-emerald-500/5 border border-emerald-500/20"
                  : "bg-white/[0.02] border border-white/5 hover:border-[oklch(0.82_0.15_195)]/20"
              }`}
            >
              <span className={`text-xl flex-shrink-0 ${isCompleted ? "grayscale-0" : ""}`}>{mission.icon}</span>
              <div className="flex-1 min-w-0">
                <p className={`text-xs font-bold ${isCompleted ? "text-emerald-400 line-through" : "text-white"}`}>
                  {t[mission.id] || mission.id}
                </p>
                <p className="text-gray-500 text-[10px] truncate">
                  {t[`${mission.id}_desc`] || ""}
                </p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className="text-[oklch(0.72_0.12_75)] text-[10px] font-bold">
                  +{mission.reward} 🪙
                </span>
                {isCompleted ? (
                  <span className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="3">
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  </span>
                ) : (
                  <Link
                    href={mission.route}
                    className="px-3 py-1 rounded-lg bg-[oklch(0.82_0.15_195)]/10 border border-[oklch(0.82_0.15_195)]/30 text-[oklch(0.82_0.15_195)] text-[10px] font-bold hover:bg-[oklch(0.82_0.15_195)]/20 transition-all"
                  >
                    {t.go}
                  </Link>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* All done bonus */}
      {bonusClaimed && (
        <div className="mx-4 mb-4 p-3 rounded-xl bg-gradient-to-r from-[oklch(0.72_0.12_75)]/10 to-emerald-500/10 border border-[oklch(0.72_0.12_75)]/20 text-center">
          <p className="text-[oklch(0.72_0.12_75)] text-xs font-bold">🎉 {t.allDone}</p>
        </div>
      )}
    </div>
  );
}

import { useGame } from "@/contexts/GameContext";
import { usePRDLanguage } from "@/contexts/PRDLanguageContext";
import { useState, useEffect } from "react";
import { Shield } from "lucide-react";

const T: Record<string, Record<string, string>> = {
  es: {
    streak: "Racha",
    days: "días",
    day: "día",
    atRisk: "¡Tu racha está en peligro!",
    protected: "Protegida con escudo",
    lost: "Racha perdida...",
    noStreak: "Sin racha",
    keepGoing: "¡Sigue así!",
    onFire: "¡En llamas!",
    legendary: "¡LEGENDARIO!",
  },
  en: {
    streak: "Streak",
    days: "days",
    day: "day",
    atRisk: "Your streak is at risk!",
    protected: "Protected with shield",
    lost: "Streak lost...",
    noStreak: "No streak",
    keepGoing: "Keep going!",
    onFire: "On fire!",
    legendary: "LEGENDARY!",
  },
  zh: {
    streak: "连续",
    days: "天",
    day: "天",
    atRisk: "你的连续记录有危险！",
    protected: "盾牌保护中",
    lost: "连续记录丢失...",
    noStreak: "无连续",
    keepGoing: "继续加油！",
    onFire: "火力全开！",
    legendary: "传说级！",
  },
};

// Check if user has an active shield
function hasActiveShield(): boolean {
  try {
    const shields = JSON.parse(localStorage.getItem("lince_active_shields") || "[]");
    return shields.length > 0;
  } catch { return false; }
}

// Check if streak is at risk (hasn't played today and it's past 18:00)
function isStreakAtRisk(lastPlayedDate: string): boolean {
  if (!lastPlayedDate) return false;
  const today = new Date().toISOString().split("T")[0];
  if (lastPlayedDate === today) return false;
  const hour = new Date().getHours();
  return hour >= 18;
}

interface StreakFireProps {
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  showRisk?: boolean;
  className?: string;
}

export function StreakFire({ size = "md", showLabel = true, showRisk = true, className = "" }: StreakFireProps) {
  const { state } = useGame();
  const { lang } = usePRDLanguage();
  const l = lang as string;
  const t = (key: string) => T[l]?.[key] || T.es[key] || key;

  const [atRisk, setAtRisk] = useState(false);
  const [shielded, setShielded] = useState(false);

  useEffect(() => {
    setAtRisk(isStreakAtRisk(state.lastPlayedDate));
    setShielded(hasActiveShield());
  }, [state.lastPlayedDate]);

  const streak = state.streak;
  const sizeClasses = {
    sm: "text-lg",
    md: "text-2xl",
    lg: "text-4xl",
  };

  const fireIntensity = streak === 0 ? 0 : streak < 3 ? 1 : streak < 7 ? 2 : streak < 14 ? 3 : 4;

  const fireColors = [
    "", // no fire
    "text-orange-400", // small
    "text-orange-500", // medium
    "text-red-500", // hot
    "text-amber-400", // legendary
  ];

  const getMessage = () => {
    if (streak === 0) return t("noStreak");
    if (streak >= 14) return t("legendary");
    if (streak >= 7) return t("onFire");
    return t("keepGoing");
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Fire icon with animation */}
      <div className={`relative ${sizeClasses[size]}`}>
        {streak > 0 ? (
          <span
            className={`inline-block ${fireColors[fireIntensity]} ${
              fireIntensity >= 3 ? "animate-pulse" : ""
            }`}
            style={{
              filter: fireIntensity >= 2 ? `drop-shadow(0 0 ${fireIntensity * 3}px ${fireIntensity >= 4 ? "#fbbf24" : "#f97316"})` : undefined,
              animation: atRisk && !shielded ? "streakShake 0.5s ease-in-out infinite" : undefined,
            }}
          >
            🔥
          </span>
        ) : (
          <span className="inline-block opacity-30 grayscale">🔥</span>
        )}
        {/* Shield indicator */}
        {shielded && streak > 0 && (
          <Shield className="absolute -top-1 -right-1 w-3 h-3 text-cyan-400" />
        )}
      </div>

      {/* Streak number + label */}
      {showLabel && (
        <div className="flex flex-col">
          <span className={`font-display font-bold leading-none ${
            size === "lg" ? "text-2xl" : size === "md" ? "text-lg" : "text-sm"
          } ${streak > 0 ? "text-white" : "text-gray-500"}`}>
            {streak}
          </span>
          <span className={`text-[10px] uppercase tracking-wider ${
            atRisk && !shielded ? "text-red-400" : "text-gray-500"
          }`}>
            {streak === 1 ? t("day") : t("days")}
          </span>
        </div>
      )}

      {/* Risk warning */}
      {showRisk && atRisk && !shielded && streak > 0 && (
        <span className="text-xs text-red-400 font-medium animate-pulse ml-1">
          {t("atRisk")}
        </span>
      )}

      {/* Streak message */}
      {showLabel && size === "lg" && (
        <span className={`text-xs font-medium ml-1 ${
          streak >= 14 ? "text-amber-400" : streak >= 7 ? "text-orange-400" : "text-gray-500"
        }`}>
          {getMessage()}
        </span>
      )}

      <style>{`
        @keyframes streakShake {
          0%, 100% { transform: translateX(0) rotate(0); }
          25% { transform: translateX(-2px) rotate(-5deg); }
          75% { transform: translateX(2px) rotate(5deg); }
        }
      `}</style>
    </div>
  );
}

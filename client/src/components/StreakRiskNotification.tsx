import { useState, useEffect } from "react";
import { useGame } from "@/contexts/GameContext";
import { usePRDLanguage } from "@/contexts/PRDLanguageContext";
import { X, Shield, Flame } from "lucide-react";
import { Link } from "wouter";

const T: Record<string, Record<string, string>> = {
  es: {
    title: "¡Tu racha está en peligro!",
    subtitle: "Llevas",
    days: "días seguidos",
    action: "No pierdas tu progreso. Juega ahora o usa un escudo.",
    play: "Jugar ahora",
    shield: "Usar escudo",
    buyShield: "Comprar escudo",
    dismiss: "Recordar luego",
    noShields: "No tienes escudos",
    shieldUsed: "¡Escudo activado! Tu racha está protegida por hoy.",
  },
  en: {
    title: "Your streak is at risk!",
    subtitle: "You've been going for",
    days: "days straight",
    action: "Don't lose your progress. Play now or use a shield.",
    play: "Play now",
    shield: "Use shield",
    buyShield: "Buy shield",
    dismiss: "Remind me later",
    noShields: "No shields available",
    shieldUsed: "Shield activated! Your streak is protected for today.",
  },
  zh: {
    title: "你的连续记录有危险！",
    subtitle: "你已经连续",
    days: "天",
    action: "不要失去你的进度。现在玩或使用盾牌。",
    play: "现在玩",
    shield: "使用盾牌",
    buyShield: "购买盾牌",
    dismiss: "稍后提醒",
    noShields: "没有可用的盾牌",
    shieldUsed: "盾牌已激活！你的连续记录今天受到保护。",
  },
};

const DISMISSED_KEY = "lince_streak_risk_dismissed";
const SHIELDS_KEY = "lince_active_shields";

function getShieldCount(): number {
  try {
    const purchased = JSON.parse(localStorage.getItem("lince_purchased_items") || "[]");
    const used = JSON.parse(localStorage.getItem(SHIELDS_KEY) || "[]");
    const shieldItems = purchased.filter((id: string) => id.startsWith("shield_"));
    return Math.max(0, shieldItems.length - used.length);
  } catch { return 0; }
}

export function StreakRiskNotification() {
  const { state } = useGame();
  const { lang } = usePRDLanguage();
  const l = lang as string;
  const t = (key: string) => T[l]?.[key] || T.es[key] || key;

  const [visible, setVisible] = useState(false);
  const [shieldCount, setShieldCount] = useState(0);

  useEffect(() => {
    if (state.streak < 2) return; // Only show for streaks >= 2

    const today = new Date().toISOString().split("T")[0];
    if (state.lastPlayedDate === today) return; // Already played today

    const hour = new Date().getHours();
    if (hour < 18) return; // Only show after 6 PM

    // Check if already dismissed today
    const dismissed = localStorage.getItem(DISMISSED_KEY);
    if (dismissed === today) return;

    setShieldCount(getShieldCount());
    setVisible(true);
  }, [state.streak, state.lastPlayedDate]);

  const dismiss = () => {
    const today = new Date().toISOString().split("T")[0];
    localStorage.setItem(DISMISSED_KEY, today);
    setVisible(false);
  };

  const useShield = () => {
    try {
      const today = new Date().toISOString().split("T")[0];
      const used = JSON.parse(localStorage.getItem(SHIELDS_KEY) || "[]");
      used.push({ date: today, usedAt: Date.now() });
      localStorage.setItem(SHIELDS_KEY, JSON.stringify(used));
      setVisible(false);
    } catch { /* ignore */ }
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-gradient-to-b from-[#1A1A2E] to-[#0F0F1A] border border-red-500/30 rounded-2xl p-6 max-w-md w-full shadow-[0_0_40px_rgba(239,68,68,0.15)] animate-in slide-in-from-bottom-4">
        {/* Close */}
        <button onClick={dismiss} className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors">
          <X className="w-5 h-5" />
        </button>

        {/* Fire animation */}
        <div className="text-center mb-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-500/10 mb-3">
            <span className="text-4xl animate-pulse" style={{ filter: "drop-shadow(0 0 10px #ef4444)" }}>🔥</span>
          </div>
          <h3 className="font-['Space_Grotesk'] font-bold text-xl text-red-400">{t("title")}</h3>
          <p className="text-[#B0B0B0] mt-1">
            {t("subtitle")} <strong className="text-white">{state.streak}</strong> {t("days")}
          </p>
          <p className="text-sm text-gray-500 mt-2">{t("action")}</p>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2">
          <Link href="/jugar" onClick={dismiss}>
            <button className="w-full py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold rounded-xl hover:brightness-110 transition-all flex items-center justify-center gap-2">
              <Flame className="w-5 h-5" />
              {t("play")}
            </button>
          </Link>

          {shieldCount > 0 ? (
            <button
              onClick={useShield}
              className="w-full py-3 bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 font-bold rounded-xl hover:bg-cyan-500/20 transition-all flex items-center justify-center gap-2"
            >
              <Shield className="w-5 h-5" />
              {t("shield")} ({shieldCount})
            </button>
          ) : (
            <Link href="/mercado" onClick={dismiss}>
              <button className="w-full py-3 bg-amber-500/10 text-amber-400 border border-amber-500/30 font-bold rounded-xl hover:bg-amber-500/20 transition-all flex items-center justify-center gap-2">
                <Shield className="w-5 h-5" />
                {t("buyShield")}
              </button>
            </Link>
          )}

          <button
            onClick={dismiss}
            className="w-full py-2 text-gray-500 text-sm hover:text-gray-400 transition-colors"
          >
            {t("dismiss")}
          </button>
        </div>
      </div>
    </div>
  );
}

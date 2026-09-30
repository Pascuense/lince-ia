/**
 * UnlockCelebration — Animated modal with confetti when a section is unlocked.
 * 
 * Listens to `recentUnlocks` from useProgressiveUnlock and shows a celebration
 * overlay with confetti burst, the unlocked section name, icon, and a motivational
 * message. Auto-dismisses after 6 seconds or on click.
 * 
 * Multi-language: ES / EN / ZH
 */
import { useEffect, useRef, useState, useCallback } from "react";
import confetti from "canvas-confetti";
import { useProgressiveUnlock, UNLOCK_LABELS, type UnlockState } from "@/hooks/useProgressiveUnlock";

type Lang = "es" | "en" | "zh" | "pt-BR" | "pt-PT";

// ─── Section icons & colors ───
const SECTION_META: Record<keyof UnlockState, { icon: string; color: string; route: string }> = {
  jugar:          { icon: "🎮", color: "#00E5FF", route: "/jugar" },
  creaTuLincelin: { icon: "🎨", color: "#D4A843", route: "/lincelin" },
  personajes:     { icon: "👥", color: "#00E5FF", route: "/personajes" },
  perfil:         { icon: "👤", color: "#D4A843", route: "/perfil" },
  recompensas:    { icon: "🎁", color: "#00E5FF", route: "/recompensas" },
  arsenalIA:      { icon: "🛡️", color: "#00E5FF", route: "/arsenal-ia" },
  promptStudio:   { icon: "✨", color: "#D4A843", route: "/prompt-studio" },
  promptear:      { icon: "⚡", color: "#FF6B35", route: "/promptear" },
  mundo:          { icon: "🌍", color: "#4CAF50", route: "/mundo" },
  raids:          { icon: "⚔️", color: "#FF4444", route: "/raids" },
  academia:       { icon: "🎓", color: "#9C27B0", route: "/academia" },
};

// ─── Motivational messages ───
const MESSAGES: Record<string, {
  title: string;
  unlocked: string;
  congrats: string;
  explore: string;
  close: string;
}> = {
  es: {
    title: "¡DESBLOQUEADO!",
    unlocked: "Has desbloqueado",
    congrats: "¡Sigue así, campeón! Cada logro te acerca a ser un maestro de la IA.",
    explore: "Explorar ahora",
    close: "Cerrar",
  },
  en: {
    title: "UNLOCKED!",
    unlocked: "You unlocked",
    congrats: "Keep it up, champion! Every achievement brings you closer to AI mastery.",
    explore: "Explore now",
    close: "Close",
  },
  zh: {
    title: "已解锁！",
    unlocked: "你解锁了",
    congrats: "继续加油，冠军！每一个成就都让你更接近AI大师。",
    explore: "立即探索",
    close: "关闭",
  },
};

// ─── Confetti burst function ───
function fireConfetti() {
  const duration = 3000;
  const end = Date.now() + duration;

  // Initial big burst
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 },
    colors: ["#00E5FF", "#D4A843", "#FF6B35", "#4CAF50", "#9C27B0", "#FFD700"],
    zIndex: 10001,
  });

  // Continuous side bursts
  const interval = setInterval(() => {
    if (Date.now() > end) {
      clearInterval(interval);
      return;
    }
    confetti({
      particleCount: 30,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.65 },
      colors: ["#00E5FF", "#D4A843", "#FFD700"],
      zIndex: 10001,
    });
    confetti({
      particleCount: 30,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.65 },
      colors: ["#00E5FF", "#D4A843", "#FFD700"],
      zIndex: 10001,
    });
  }, 250);

  return () => clearInterval(interval);
}

// ─── Get language from localStorage ───
function getGameLang(): Lang {
  try {
    const user = localStorage.getItem("lince-user");
    if (user) {
      const parsed = JSON.parse(user);
      if (parsed.language && ["es", "en", "zh"].includes(parsed.language)) {
        return parsed.language as Lang;
      }
    }
  } catch { /* ignore */ }
  return "es";
}

export function UnlockCelebration() {
  const { recentUnlocks } = useProgressiveUnlock();
  const [visible, setVisible] = useState(false);
  const [displayedUnlocks, setDisplayedUnlocks] = useState<string[]>([]);
  const [isExiting, setIsExiting] = useState(false);
  const cleanupRef = useRef<(() => void) | null>(null);
  const autoCloseRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lang = getGameLang();
  const t = MESSAGES[lang] || MESSAGES.es;

  // Show celebration when new unlocks appear
  useEffect(() => {
    if (recentUnlocks.length > 0) {
      // Filter out base sections that are always unlocked (not interesting to celebrate)
      const interestingUnlocks = recentUnlocks.filter(
        k => !["jugar", "creaTuLincelin", "personajes", "perfil", "recompensas"].includes(k)
      );
      if (interestingUnlocks.length === 0) return;

      setDisplayedUnlocks(interestingUnlocks);
      setVisible(true);
      setIsExiting(false);

      // Fire confetti
      cleanupRef.current = fireConfetti();

      // Auto-close after 6 seconds
      autoCloseRef.current = setTimeout(() => {
        handleClose();
      }, 6000);
    }

    return () => {
      if (cleanupRef.current) cleanupRef.current();
      if (autoCloseRef.current) clearTimeout(autoCloseRef.current);
    };
  }, [recentUnlocks]);

  const handleClose = useCallback(() => {
    setIsExiting(true);
    if (autoCloseRef.current) clearTimeout(autoCloseRef.current);
    setTimeout(() => {
      setVisible(false);
      setDisplayedUnlocks([]);
      setIsExiting(false);
    }, 400);
  }, []);

  const handleExplore = useCallback((route: string) => {
    handleClose();
    // Navigate after animation
    setTimeout(() => {
      window.location.href = route;
    }, 450);
  }, [handleClose]);

  if (!visible || displayedUnlocks.length === 0) return null;

  return (
    <div
      className={`fixed inset-0 z-[10000] flex items-center justify-center p-4 transition-all duration-400 ${
        isExiting ? "opacity-0 scale-95" : "opacity-100 scale-100"
      }`}
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
      aria-label={t.title}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className={`relative max-w-md w-full rounded-2xl overflow-hidden transition-all duration-500 ${
          isExiting ? "translate-y-8 opacity-0" : "translate-y-0 opacity-100"
        }`}
        onClick={e => e.stopPropagation()}
        style={{
          background: "linear-gradient(135deg, #0A0A0A 0%, #1A1A2E 50%, #0A0A0A 100%)",
          border: "2px solid rgba(0, 229, 255, 0.3)",
          boxShadow: "0 0 60px rgba(0, 229, 255, 0.15), 0 0 120px rgba(212, 168, 67, 0.1)",
        }}
      >
        {/* Animated top glow bar */}
        <div
          className="h-1 w-full"
          style={{
            background: "linear-gradient(90deg, #00E5FF, #D4A843, #FF6B35, #4CAF50, #9C27B0, #00E5FF)",
            backgroundSize: "200% 100%",
            animation: "shimmer 2s linear infinite",
          }}
        />

        {/* Content */}
        <div className="p-6 sm:p-8 text-center">
          {/* Title with glow */}
          <h2
            className="font-display font-black text-3xl sm:text-4xl mb-2 tracking-wider"
            style={{
              color: "#00E5FF",
              textShadow: "0 0 20px rgba(0, 229, 255, 0.5), 0 0 40px rgba(0, 229, 255, 0.3)",
            }}
          >
            {t.title}
          </h2>

          <p className="text-gray-400 text-sm mb-6">{t.unlocked}</p>

          {/* Unlocked sections */}
          <div className="space-y-3 mb-6">
            {displayedUnlocks.map((key) => {
              const meta = SECTION_META[key as keyof UnlockState];
              const label = UNLOCK_LABELS[key as keyof UnlockState];
              if (!meta || !label) return null;

              return (
                <div
                  key={key}
                  className="flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all hover:scale-[1.02]"
                  style={{
                    background: `linear-gradient(135deg, ${meta.color}15 0%, ${meta.color}08 100%)`,
                    border: `1px solid ${meta.color}40`,
                  }}
                  onClick={() => handleExplore(meta.route)}
                >
                  {/* Icon with glow */}
                  <div
                    className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                    style={{
                      background: `${meta.color}20`,
                      boxShadow: `0 0 20px ${meta.color}30`,
                    }}
                  >
                    {meta.icon}
                  </div>

                  {/* Label */}
                  <div className="flex-1 text-left">
                    <p
                      className="font-display font-bold text-lg"
                      style={{ color: meta.color }}
                    >
                      {label[lang] || label.es}
                    </p>
                    <p className="text-gray-500 text-xs mt-0.5">{t.explore} →</p>
                  </div>

                  {/* Unlock badge */}
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0"
                    style={{
                      background: `${meta.color}30`,
                      color: meta.color,
                    }}
                  >
                    🔓
                  </div>
                </div>
              );
            })}
          </div>

          {/* Motivational message */}
          <p className="text-gray-400 text-sm leading-relaxed mb-6 px-2">
            {t.congrats}
          </p>

          {/* Close button */}
          <button
            onClick={handleClose}
            className="px-6 py-2.5 rounded-lg text-sm font-semibold transition-all hover:brightness-110"
            style={{
              background: "linear-gradient(135deg, #00E5FF, #00B8D4)",
              color: "#0A0A0A",
              boxShadow: "0 0 20px rgba(0, 229, 255, 0.3)",
            }}
          >
            {t.close}
          </button>
        </div>
      </div>

      {/* CSS animation for shimmer */}
      <style>{`
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  );
}

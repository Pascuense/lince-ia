/**
 * P1-4: UnlockBanner — Shows what's locked and how to unlock it
 * Used in GameHub to display progressive unlock status
 */
import { useProgressiveUnlock, UNLOCK_LABELS, UNLOCK_REQUIREMENTS, type UnlockState } from "@/hooks/useProgressiveUnlock";

interface UnlockBannerProps {
  lang: "es" | "en" | "zh";
}

const T = {
  es: {
    nextStep: "Tu próximo paso",
    unlocked: "Desbloqueado",
    locked: "Bloqueado",
    progressTitle: "Tu Progreso",
    unlockedSections: "Secciones desbloqueadas",
  },
  en: {
    nextStep: "Your next step",
    unlocked: "Unlocked",
    locked: "Locked",
    progressTitle: "Your Progress",
    unlockedSections: "Unlocked sections",
  },
  zh: {
    nextStep: "你的下一步",
    unlocked: "已解锁",
    locked: "锁定",
    progressTitle: "你的进度",
    unlockedSections: "已解锁的部分",
  },
};

// Sections to show in the unlock progress (only those that require progression)
// arsenalIA, promptStudio, promptear are now always unlocked — removed from this list
const UNLOCK_SECTIONS: { key: keyof UnlockState; icon: string; color: string }[] = [
  { key: "mundo", icon: "🌍", color: "#D4A843" },
  { key: "raids", icon: "⚔️", color: "#FF4444" },
  { key: "academia", icon: "🎓", color: "#4CAF50" },
];

export function UnlockBanner({ lang }: UnlockBannerProps) {
  const { unlocks, nextAction } = useProgressiveUnlock();
  const t = T[lang] || T.es;

  const unlockedCount = UNLOCK_SECTIONS.filter(s => unlocks[s.key]).length;
  const totalCount = UNLOCK_SECTIONS.length;
  const allUnlocked = unlockedCount === totalCount;

  if (allUnlocked) return null;

  return (
    <div className="bg-gradient-to-r from-[oklch(0.14_0.02_240)] to-[oklch(0.12_0.02_260)] rounded-2xl border border-[oklch(0.82_0.15_195)]/10 p-4 mb-4">
      {/* Next action callout */}
      {nextAction && (
        <div className="flex items-center gap-3 mb-4 p-3 rounded-xl bg-[oklch(0.82_0.15_195)]/5 border border-[oklch(0.82_0.15_195)]/20">
          <span className="text-2xl">🎯</span>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] uppercase tracking-wider text-[oklch(0.82_0.15_195)]/60 font-bold mb-0.5">{t.nextStep}</p>
            <p className="text-sm font-bold text-[oklch(0.82_0.15_195)]">{nextAction.label[lang] || nextAction.label.es}</p>
          </div>
        </div>
      )}

      {/* Progress bar */}
      <div className="flex items-center gap-3 mb-3">
        <span className="text-xs text-gray-400 font-medium">{t.unlockedSections}</span>
        <div className="flex-1 h-1.5 bg-[oklch(0.18_0.01_240)] rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[oklch(0.82_0.15_195)] to-[#D4A843] rounded-full transition-all duration-700"
            style={{ width: `${(unlockedCount / totalCount) * 100}%` }}
          />
        </div>
        <span className="text-xs font-bold text-[oklch(0.82_0.15_195)]">{unlockedCount}/{totalCount}</span>
      </div>

      {/* Section pills */}
      <div className="flex flex-wrap gap-2">
        {UNLOCK_SECTIONS.map((section) => {
          const isUnlocked = unlocks[section.key];
          const label = UNLOCK_LABELS[section.key][lang] || UNLOCK_LABELS[section.key].es;
          const requirement = UNLOCK_REQUIREMENTS[section.key][lang] || UNLOCK_REQUIREMENTS[section.key].es;

          return (
            <div
              key={section.key}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition-all ${
                isUnlocked
                  ? "bg-white/5 text-white"
                  : "bg-black/30 text-gray-600"
              }`}
              title={isUnlocked ? t.unlocked : requirement}
            >
              <span className={`text-sm ${isUnlocked ? "" : "grayscale opacity-50"}`}>{section.icon}</span>
              <span>{label}</span>
              {isUnlocked ? (
                <span className="text-[9px] text-green-400">✓</span>
              ) : (
                <span className="text-[9px]">🔒</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

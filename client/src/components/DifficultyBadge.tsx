import { DIFFICULTY_CONFIG, type Difficulty } from "@/lib/gameConstants";

interface DifficultyBadgeProps {
  difficulty: Difficulty;
  lang: string;
  size?: "sm" | "md";
}

export function DifficultyBadge({ difficulty, lang, size = "sm" }: DifficultyBadgeProps) {
  const config = DIFFICULTY_CONFIG[difficulty];
  const l = lang as "es" | "en" | "zh";
  const label = config.label[l] || config.label.es;

  if (size === "md") {
    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-bold ${config.bgClass}`}>
        {config.icon} {label}
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[10px] font-bold ${config.bgClass}`}>
      {config.icon} {label}
    </span>
  );
}

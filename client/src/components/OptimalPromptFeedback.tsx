import { useState } from "react";
import type { OptimalPrompt } from "@/lib/gameConstants";

interface OptimalPromptFeedbackProps {
  optimalPrompt: OptimalPrompt;
  userScore: number;
  lang: string;
  accentColor?: string;
}

export function OptimalPromptFeedback({ optimalPrompt, userScore, lang, accentColor = "oklch(0.82 0.15 195)" }: OptimalPromptFeedbackProps) {
  const [expanded, setExpanded] = useState(false);
  const l = lang as "es" | "en" | "zh";

  const labels = {
    es: {
      seeOptimal: "Ver el prompt que da máxima puntuación",
      hideOptimal: "Ocultar solución",
      optimalTitle: "Prompt óptimo (puntuación máxima)",
      maxScore: "Puntuación máxima posible",
      yourScore: "Tu puntuación",
      whyWorks: "¿Por qué funciona?",
      tryToImprove: "Intenta acercarte a este nivel de detalle en tu próximo prompt.",
      greatJob: "¡Excelente! Tu prompt está muy cerca del óptimo.",
    },
    en: {
      seeOptimal: "See the prompt that gives maximum score",
      hideOptimal: "Hide solution",
      optimalTitle: "Optimal prompt (maximum score)",
      maxScore: "Maximum possible score",
      yourScore: "Your score",
      whyWorks: "Why does it work?",
      tryToImprove: "Try to reach this level of detail in your next prompt.",
      greatJob: "Excellent! Your prompt is very close to optimal.",
    },
    zh: {
      seeOptimal: "查看获得最高分的提示词",
      hideOptimal: "隐藏答案",
      optimalTitle: "最佳提示词（最高分）",
      maxScore: "最高可能分数",
      yourScore: "你的分数",
      whyWorks: "为什么有效？",
      tryToImprove: "在下一个提示词中尝试达到这个细节水平。",
      greatJob: "太棒了！你的提示词非常接近最佳水平。",
    },
  };
  const t = labels[l] || labels.es;

  const scoreDiff = optimalPrompt.maxScore - userScore;
  const isClose = scoreDiff <= 15;

  return (
    <div className="mt-3">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full py-2.5 rounded-xl border border-dashed text-sm font-bold transition-all hover:scale-[1.005] flex items-center justify-center gap-2"
        style={{
          borderColor: `color-mix(in oklch, ${accentColor}, transparent 50%)`,
          color: accentColor,
        }}
      >
        <span>{expanded ? "📖" : "🔍"}</span>
        {expanded ? t.hideOptimal : t.seeOptimal}
      </button>

      {expanded && (
        <div className="mt-3 rounded-2xl p-5 border" style={{
          borderColor: `color-mix(in oklch, oklch(0.72 0.12 75), transparent 60%)`,
          background: `color-mix(in oklch, oklch(0.72 0.12 75), transparent 92%)`,
        }}>
          <h4 className="font-bold text-sm text-[oklch(0.72_0.12_75)] uppercase tracking-wider mb-3">
            📝 {t.optimalTitle}
          </h4>

          {/* Optimal prompt text */}
          <div className="bg-black/30 rounded-xl p-4 mb-4 border border-[oklch(0.72_0.12_75)]/20">
            <p className="text-gray-100 leading-relaxed text-sm italic">
              "{optimalPrompt.text[l] || optimalPrompt.text.es}"
            </p>
          </div>

          {/* Score comparison */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-black/20 rounded-xl p-3 text-center">
              <div className="text-xl font-black text-[oklch(0.72_0.12_75)]">{optimalPrompt.maxScore}</div>
              <div className="text-[10px] text-gray-400">{t.maxScore}</div>
            </div>
            <div className="bg-black/20 rounded-xl p-3 text-center">
              <div className="text-xl font-black" style={{ color: accentColor }}>{userScore}</div>
              <div className="text-[10px] text-gray-400">{t.yourScore}</div>
            </div>
          </div>

          {/* Explanation */}
          <div className="rounded-xl p-3 bg-black/20 border border-[oklch(0.72_0.12_75)]/15">
            <p className="text-xs font-bold text-[oklch(0.72_0.12_75)] mb-1">💡 {t.whyWorks}</p>
            <p className="text-xs text-gray-300 leading-relaxed">
              {optimalPrompt.explanation[l] || optimalPrompt.explanation.es}
            </p>
          </div>

          {/* Encouragement */}
          <p className="text-xs text-gray-400 mt-3 text-center italic">
            {isClose ? t.greatJob : t.tryToImprove}
          </p>
        </div>
      )}
    </div>
  );
}

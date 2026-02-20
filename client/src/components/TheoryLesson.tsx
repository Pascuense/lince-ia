import { useState } from "react";
import type { TheoryLesson as TheoryLessonType } from "@/lib/gameConstants";

interface TheoryLessonProps {
  lesson: TheoryLessonType;
  lang: string;
  missionNumber: number;
  onContinue: () => void;
  accentColor?: string; // oklch color string
}

export function TheoryLessonCard({ lesson, lang, missionNumber, onContinue, accentColor = "oklch(0.82 0.15 195)" }: TheoryLessonProps) {
  const [showTip, setShowTip] = useState(false);
  const l = lang as "es" | "en" | "zh";

  const labels = {
    es: { theory: "Mini-lección teórica", mission: `Antes de la Misión ${missionNumber}`, tip: "Consejo para máxima puntuación", understood: "¡Entendido! Empezar misión", showTip: "Ver consejo" },
    en: { theory: "Mini theory lesson", mission: `Before Mission ${missionNumber}`, tip: "Tip for maximum score", understood: "Got it! Start mission", showTip: "Show tip" },
    zh: { theory: "迷你理论课", mission: `任务${missionNumber}之前`, tip: "获得最高分的提示", understood: "明白了！开始任务", showTip: "查看提示" },
  };
  const t = labels[l] || labels.es;

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header badge */}
      <div className="flex items-center gap-2 mb-4">
        <span className="text-2xl">{lesson.icon}</span>
        <div>
          <p className="text-xs font-bold tracking-wider uppercase" style={{ color: accentColor }}>{t.theory}</p>
          <p className="text-[10px] text-gray-500">{t.mission}</p>
        </div>
      </div>

      {/* Lesson card */}
      <div className="rounded-2xl p-6 border-2" style={{
        borderColor: `color-mix(in oklch, ${accentColor}, transparent 70%)`,
        background: `color-mix(in oklch, ${accentColor}, transparent 92%)`,
      }}>
        <h3 className="font-black text-xl mb-3" style={{ color: accentColor }}>
          {lesson.title[l] || lesson.title.es}
        </h3>
        <p className="text-gray-200 leading-relaxed text-base mb-4">
          {lesson.content[l] || lesson.content.es}
        </p>

        {/* Tip section */}
        {!showTip ? (
          <button
            onClick={() => setShowTip(true)}
            className="w-full py-2.5 rounded-xl border border-dashed text-sm font-bold transition-all hover:scale-[1.01]"
            style={{
              borderColor: `color-mix(in oklch, ${accentColor}, transparent 50%)`,
              color: accentColor,
            }}
          >
            💡 {t.showTip}
          </button>
        ) : (
          <div className="rounded-xl p-4 border" style={{
            borderColor: `color-mix(in oklch, ${accentColor}, transparent 60%)`,
            background: `color-mix(in oklch, ${accentColor}, transparent 88%)`,
          }}>
            <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: accentColor }}>
              💡 {t.tip}
            </p>
            <p className="text-sm text-gray-300 leading-relaxed">
              {lesson.tip[l] || lesson.tip.es}
            </p>
          </div>
        )}
      </div>

      {/* Continue button */}
      <button
        onClick={onContinue}
        className="mt-6 w-full py-4 rounded-xl font-black text-lg text-black transition-all hover:brightness-110 hover:scale-[1.01]"
        style={{ backgroundColor: accentColor }}
      >
        {t.understood}
      </button>
    </div>
  );
}

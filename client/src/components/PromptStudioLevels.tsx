/**
 * P1-5: Prompt Studio 5-Level Progression System
 * 
 * Levels: Básico → Aprendiz → Intermedio → Avanzado → Maestro
 * 
 * Progress is based on:
 * - Number of prompts created
 * - Average quality score
 * - Images generated
 */
import { useState, useEffect, useMemo } from "react";
import { Star, Lock, ChevronRight, Trophy, Zap } from "lucide-react";

// ─── Level Definitions ───
export interface PromptLevel {
  id: number;
  key: string;
  name: Record<string, string>;
  icon: string;
  color: string;
  minPrompts: number;
  minAvgScore: number;
  minImages: number;
  perks: Record<string, string[]>;
}

export const PROMPT_LEVELS: PromptLevel[] = [
  {
    id: 1,
    key: "basico",
    name: { es: "Básico", en: "Basic", zh: "基础" },
    icon: "🌱",
    color: "#4CAF50",
    minPrompts: 0,
    minAvgScore: 0,
    minImages: 0,
    perks: {
      es: ["Acceso al formulario de 4 campos", "Evaluación en tiempo real", "Hasta 3 imágenes/día"],
      en: ["Access to 4-field form", "Real-time evaluation", "Up to 3 images/day"],
      zh: ["访问4字段表单", "实时评估", "每天最多3张图片"],
    },
  },
  {
    id: 2,
    key: "aprendiz",
    name: { es: "Aprendiz", en: "Apprentice", zh: "学徒" },
    icon: "📚",
    color: "#2196F3",
    minPrompts: 5,
    minAvgScore: 30,
    minImages: 3,
    perks: {
      es: ["Mejora automática de prompts por IA", "Desglose técnico del prompt", "Hasta 5 imágenes/día"],
      en: ["AI-powered prompt enhancement", "Technical prompt breakdown", "Up to 5 images/day"],
      zh: ["AI驱动的提示增强", "技术提示分解", "每天最多5张图片"],
    },
  },
  {
    id: 3,
    key: "intermedio",
    name: { es: "Intermedio", en: "Intermediate", zh: "中级" },
    icon: "⚡",
    color: "#D4A843",
    minPrompts: 15,
    minAvgScore: 50,
    minImages: 10,
    perks: {
      es: ["Todos los estilos desbloqueados", "Historial completo de prompts", "Hasta 10 imágenes/día"],
      en: ["All styles unlocked", "Full prompt history", "Up to 10 images/day"],
      zh: ["所有风格解锁", "完整提示历史", "每天最多10张图片"],
    },
  },
  {
    id: 4,
    key: "avanzado",
    name: { es: "Avanzado", en: "Advanced", zh: "高级" },
    icon: "🔥",
    color: "#FF5722",
    minPrompts: 30,
    minAvgScore: 65,
    minImages: 20,
    perks: {
      es: ["Modo profesional desbloqueado", "Edición de imágenes generadas", "Hasta 20 imágenes/día"],
      en: ["Professional mode unlocked", "Edit generated images", "Up to 20 images/day"],
      zh: ["专业模式解锁", "编辑生成的图片", "每天最多20张图片"],
    },
  },
  {
    id: 5,
    key: "maestro",
    name: { es: "Maestro", en: "Master", zh: "大师" },
    icon: "👑",
    color: "#9C27B0",
    minPrompts: 50,
    minAvgScore: 75,
    minImages: 35,
    perks: {
      es: ["Acceso ilimitado", "Compartir en galería pública", "Badge de Maestro en perfil"],
      en: ["Unlimited access", "Share to public gallery", "Master badge on profile"],
      zh: ["无限访问", "分享到公共画廊", "个人资料上的大师徽章"],
    },
  },
];

// ─── Helper: Calculate current level from stats ───
export function calculatePromptLevel(stats: { totalPrompts: number; avgScore: number; totalImages: number }): {
  currentLevel: PromptLevel;
  nextLevel: PromptLevel | null;
  progress: { prompts: number; score: number; images: number };
} {
  let currentIdx = 0;
  for (let i = PROMPT_LEVELS.length - 1; i >= 0; i--) {
    const level = PROMPT_LEVELS[i];
    if (
      stats.totalPrompts >= level.minPrompts &&
      stats.avgScore >= level.minAvgScore &&
      stats.totalImages >= level.minImages
    ) {
      currentIdx = i;
      break;
    }
  }

  const current = PROMPT_LEVELS[currentIdx];
  const next = currentIdx < PROMPT_LEVELS.length - 1 ? PROMPT_LEVELS[currentIdx + 1] : null;

  const progress = next
    ? {
        prompts: Math.min(100, Math.round(((stats.totalPrompts - current.minPrompts) / (next.minPrompts - current.minPrompts)) * 100)),
        score: Math.min(100, Math.round(((stats.avgScore - current.minAvgScore) / (next.minAvgScore - current.minAvgScore)) * 100)),
        images: Math.min(100, Math.round(((stats.totalImages - current.minImages) / (next.minImages - current.minImages)) * 100)),
      }
    : { prompts: 100, score: 100, images: 100 };

  return { currentLevel: current, nextLevel: next, progress };
}

// ─── Level Badge Component ───
export function PromptLevelBadge({ level, size = "sm" }: { level: PromptLevel; size?: "sm" | "md" | "lg" }) {
  const sizes = {
    sm: "text-[10px] px-2 py-0.5 gap-1",
    md: "text-xs px-3 py-1 gap-1.5",
    lg: "text-sm px-4 py-1.5 gap-2",
  };

  return (
    <span
      className={`inline-flex items-center font-bold rounded-full ${sizes[size]}`}
      style={{ backgroundColor: `${level.color}15`, color: level.color, border: `1px solid ${level.color}30` }}
    >
      <span>{level.icon}</span>
      <span>{level.name.es}</span>
    </span>
  );
}

// ─── Level Progress Card ───
interface LevelProgressProps {
  stats: { totalPrompts: number; avgScore: number; totalImages: number };
  lang: "es" | "en" | "zh";
  compact?: boolean;
}

const T = {
  es: {
    yourLevel: "Tu Nivel",
    nextLevel: "Siguiente Nivel",
    prompts: "Prompts creados",
    avgScore: "Puntuación media",
    images: "Imágenes generadas",
    maxLevel: "¡Has alcanzado el nivel máximo!",
    toUnlock: "Para subir de nivel:",
    perks: "Ventajas de tu nivel",
  },
  en: {
    yourLevel: "Your Level",
    nextLevel: "Next Level",
    prompts: "Prompts created",
    avgScore: "Average score",
    images: "Images generated",
    maxLevel: "You've reached the maximum level!",
    toUnlock: "To level up:",
    perks: "Your level perks",
  },
  zh: {
    yourLevel: "你的等级",
    nextLevel: "下一等级",
    prompts: "创建的提示",
    avgScore: "平均分数",
    images: "生成的图片",
    maxLevel: "你已达到最高等级！",
    toUnlock: "升级条件：",
    perks: "你的等级特权",
  },
};

export function PromptLevelProgress({ stats, lang, compact = false }: LevelProgressProps) {
  const t = T[lang] || T.es;
  const { currentLevel, nextLevel, progress } = useMemo(
    () => calculatePromptLevel(stats),
    [stats]
  );

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <PromptLevelBadge level={currentLevel} size="sm" />
        {nextLevel && (
          <div className="flex items-center gap-1">
            <div className="w-16 h-1 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${Math.round((progress.prompts + progress.score + progress.images) / 3)}%`,
                  backgroundColor: nextLevel.color,
                }}
              />
            </div>
            <span className="text-[9px] text-gray-500">{nextLevel.icon}</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="p-4 rounded-xl bg-gradient-to-r from-white/[0.02] to-white/[0.01] border border-white/[0.06]">
      {/* Current level */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400 font-medium">{t.yourLevel}</span>
          <PromptLevelBadge level={currentLevel} size="md" />
        </div>
        {nextLevel && (
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <ChevronRight className="w-3 h-3" />
            <span>{nextLevel.icon} {nextLevel.name[lang] || nextLevel.name.es}</span>
          </div>
        )}
      </div>

      {/* Progress to next level */}
      {nextLevel ? (
        <div className="space-y-2">
          <p className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">{t.toUnlock}</p>
          {[
            { label: t.prompts, current: stats.totalPrompts, target: nextLevel.minPrompts, pct: progress.prompts },
            { label: t.avgScore, current: Math.round(stats.avgScore), target: nextLevel.minAvgScore, pct: progress.score },
            { label: t.images, current: stats.totalImages, target: nextLevel.minImages, pct: progress.images },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-3">
              <span className="text-[10px] text-gray-400 w-28 flex-shrink-0">{item.label}</span>
              <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${item.pct}%`, backgroundColor: nextLevel.color }}
                />
              </div>
              <span className="text-[10px] font-mono text-gray-500 w-14 text-right">
                {item.current}/{item.target}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-[#9C27B0]/10 border border-[#9C27B0]/20">
          <Trophy className="w-5 h-5 text-[#9C27B0]" />
          <span className="text-sm font-bold text-[#9C27B0]">{t.maxLevel}</span>
        </div>
      )}

      {/* Current level perks */}
      <div className="mt-3 pt-3 border-t border-white/5">
        <p className="text-[10px] text-gray-500 font-medium uppercase tracking-wider mb-2">{t.perks}</p>
        <div className="flex flex-wrap gap-1.5">
          {(currentLevel.perks[lang] || currentLevel.perks.es).map((perk, i) => (
            <span key={i} className="text-[10px] px-2 py-1 rounded-full bg-white/5 text-gray-300">
              {perk}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── All Levels Overview (for info/help section) ───
export function AllLevelsOverview({ lang }: { lang: "es" | "en" | "zh" }) {
  return (
    <div className="space-y-2">
      {PROMPT_LEVELS.map((level, i) => (
        <div
          key={level.key}
          className="flex items-center gap-3 p-3 rounded-lg border border-white/5 bg-white/[0.01]"
        >
          <span className="text-2xl">{level.icon}</span>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm" style={{ color: level.color }}>
                {level.name[lang] || level.name.es}
              </span>
              <span className="text-[10px] text-gray-500">Nivel {level.id}</span>
            </div>
            <p className="text-[10px] text-gray-500 mt-0.5">
              {level.minPrompts > 0 && `${level.minPrompts} prompts · `}
              {level.minAvgScore > 0 && `${level.minAvgScore}% media · `}
              {level.minImages > 0 && `${level.minImages} imágenes`}
              {level.minPrompts === 0 && "Nivel inicial"}
            </p>
          </div>
          <div className="flex flex-col gap-0.5">
            {(level.perks[lang] || level.perks.es).slice(0, 2).map((perk, j) => (
              <span key={j} className="text-[9px] text-gray-500 text-right">{perk}</span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

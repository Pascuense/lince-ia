/**
 * P2-10: Centralized game configuration
 * Hardcoded data extracted from page components for easier maintenance.
 */

// ─── LEVEL MAP (from GameHub.tsx) ───
export const LEVEL_MAP = [
  { id: 1, path: "/jugar/nivel-1", icon: "🎓", color: "from-cyan-500 to-blue-600", bgGlow: "shadow-cyan-500/30" },
  { id: 2, path: "/jugar/nivel-2", icon: "🏠", color: "from-emerald-500 to-green-600", bgGlow: "shadow-emerald-500/30" },
  { id: 3, path: "/jugar/nivel-3", icon: "⚔️", color: "from-red-500 to-orange-600", bgGlow: "shadow-red-500/30" },
  { id: 4, path: "#", icon: "🏗️", color: "from-purple-500 to-indigo-600", bgGlow: "shadow-purple-500/30" },
  { id: 5, path: "#", icon: "🤝", color: "from-amber-500 to-yellow-600", bgGlow: "shadow-amber-500/30" },
  { id: 6, path: "#", icon: "🎓", color: "from-pink-500 to-rose-600", bgGlow: "shadow-pink-500/30" },
] as const;

// ─── LINCELIN AVATAR STYLES (from CreaTuLincelin.tsx) ───
export const LINCELIN_STYLES = [
  { id: "urban" as const, label: "MUSICALIN", emoji: "🔥", desc: "Street style, cadenas, sneakers, graffiti neon", color: "#FF6B35" },
  { id: "neon" as const, label: "Cyberpunk", emoji: "⚡", desc: "Futurista, holográfico, neón intenso", color: "#00E5FF" },
  { id: "classic" as const, label: "Clásico", emoji: "✨", desc: "Elegante, dorado, retrato clásico", color: "#D4A843" },
  { id: "retro" as const, label: "Retro", emoji: "🎮", desc: "80s/90s, synthwave, VHS aesthetic", color: "#E040FB" },
  { id: "minimal" as const, label: "Minimal", emoji: "🌿", desc: "Limpio, suave, pastel, minimalista", color: "#66BB6A" },
] as const;

export type LincelinStyleId = typeof LINCELIN_STYLES[number]["id"];

// ─── FAMILY MEMBER ROLES (from CreaTuLincelin.tsx) ───
export const FAMILY_ROLES = [
  "Papá", "Mamá", "Hijo", "Hija", "Abuelo", "Abuela", "Mascota", "Otro"
] as const;

export type FamilyRole = typeof FAMILY_ROLES[number];

// ─── PROGRESSIVE UNLOCK THRESHOLDS ───
export const UNLOCK_THRESHOLDS = {
  /** Level required to unlock Herramientas IA + Crear Imagen + Aprender Prompts */
  LEVEL_1_COMPLETE: 1,
  /** Level required to unlock Mundo LINCE */
  LEVEL_2_COMPLETE: 2,
  /** Level required to unlock Batallas */
  LEVEL_3_COMPLETE: 3,
  /** XP required to unlock Cursos */
  ACADEMIA_XP: 500,
} as const;

// ─── PROMPT STUDIO LEVELS (from PromptStudioLevels.tsx) ───
export const PROMPT_LEVELS = [
  { id: 1, name: "Básico", nameEn: "Basic", nameZh: "基础", color: "#B0B0B0", minPrompts: 0, minAvgScore: 0, minImages: 0 },
  { id: 2, name: "Aprendiz", nameEn: "Apprentice", nameZh: "学徒", color: "#00E5FF", minPrompts: 3, minAvgScore: 40, minImages: 1 },
  { id: 3, name: "Intermedio", nameEn: "Intermediate", nameZh: "中级", color: "#D4A843", minPrompts: 10, minAvgScore: 60, minImages: 5 },
  { id: 4, name: "Avanzado", nameEn: "Advanced", nameZh: "高级", color: "#9C27B0", minPrompts: 25, minAvgScore: 75, minImages: 15 },
  { id: 5, name: "Maestro", nameEn: "Master", nameZh: "大师", color: "#FF6B35", minPrompts: 50, minAvgScore: 85, minImages: 30 },
] as const;

// ─── NAV SECTION ITEMS (from HomeNavigation.tsx) ───
export const HOME_NAV_SECTIONS = [
  { id: "vision", label: "Visión", labelEn: "Vision", labelZh: "愿景" },
  { id: "gracias", label: "Gracias", labelEn: "Thanks", labelZh: "感谢" },
  { id: "urban", label: "Urban", labelEn: "Urban", labelZh: "城市" },
  { id: "avatares", label: "Avatares", labelEn: "Avatars", labelZh: "角色" },
  { id: "familia", label: "Familia", labelEn: "Family", labelZh: "家族" },
] as const;

// ─── CDN ASSETS ───
export const CDN_ASSETS = {
  HERO_IMG: "https://files.manuscdn.com/user_upload_by_module/session_file/310419663032363896/yboYHmRuuKzxTKzs.png",
  DUOLINGO_LOGO: "https://files.manuscdn.com/user_upload_by_module/session_file/310419663032363896/qgXZcfwSCwpzPeFx.png",
  SABELIN_FALLBACK: "https://files.manuscdn.com/user_upload_by_module/session_file/310419663032363896/jtEEtbRUpTtEBKGn.png",
  GAMIFICATION_BANNER: "https://files.manuscdn.com/user_upload_by_module/session_file/310419663032363896/tfGGDPjUkHfjrzUV.png",
  BG_CIRCUIT: "https://files.manuscdn.com/user_upload_by_module/session_file/310419663032363896/lYyiMFzPopBynGTY.png",
} as const;

// ─── THEME COLORS ───
export const THEME = {
  primary: "#00E5FF",
  secondary: "#D4A843",
  background: "#0A0A0A",
  surface: "#1A1A2E",
  textPrimary: "#FFFFFF",
  textSecondary: "#B0B0B0",
  accent: {
    cyan: "#00E5FF",
    gold: "#D4A843",
    purple: "#9C27B0",
    red: "#FF5252",
    green: "#00C853",
    pink: "#EC4899",
    orange: "#FF6B35",
  },
} as const;

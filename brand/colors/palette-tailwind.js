/**
 * LINCE — Paleta de Colores para Tailwind CSS
 * Versión 2.0.0 | ACNB IA SL
 *
 * Uso:
 *   import palette from './brand/colors/palette-tailwind.js';
 *   // En tailwind.config.js:
 *   export default { theme: { extend: { colors: palette } } }
 *
 *   O usa directamente tailwind.config.extension.js en la raíz del proyecto.
 */

/** @type {Record<string, Record<string, string>>} */
const palette = {
  // Colores de marca principal
  brand: {
    cyan: "#00E5FF",
    "cyan-dark": "#0099CC",
    "cyan-light": "#33ECFF",
    orange: "#FF6B35",
    "orange-dark": "#CC5229",
    "orange-light": "#FF8555",
    gold: "#FFD700",
    "gold-dark": "#CC9900",
    "gold-light": "#FFE033",
  },

  // Colores semánticos
  semantic: {
    success: "#00D084",
    "success-dark": "#009960",
    "success-bg": "rgba(0, 208, 132, 0.15)",
    warning: "#FFD700",
    "warning-dark": "#CC9900",
    "warning-bg": "rgba(255, 215, 0, 0.15)",
    error: "#FF3B3B",
    "error-dark": "#CC2F2F",
    "error-bg": "rgba(255, 59, 59, 0.15)",
    info: "#00E5FF",
    "info-bg": "rgba(0, 229, 255, 0.15)",
  },

  // Superficies del tema oscuro
  surface: {
    bg: "#0A0A0A",
    card: "#1A1A1A",
    elevated: "#242424",
    hover: "#2A2A2A",
    border: "#333333",
    "border-subtle": "#1E1E1E",
  },

  // Escala de grises extendida
  gray: {
    50: "#FAFAFA",
    100: "#F3F4F6",
    200: "#E5E7EB",
    300: "#D1D5DB",
    400: "#9CA3AF",
    500: "#6B7280",
    600: "#4B5563",
    700: "#374151",
    800: "#1F2937",
    900: "#111827",
    950: "#0A0A0A",
  },

  // Colores del juego
  game: {
    xp: "#00E5FF",
    coins: "#FFD700",
    streak: "#FF6B35",
    health: "#FF3B3B",
    bronze: "#CD7F32",
    silver: "#C0C0C0",
    gold: "#FFD700",
    platinum: "#E5E4E2",
    diamond: "#B9F2FF",
    elite: "#9C27B0",
  },
};

export default palette;

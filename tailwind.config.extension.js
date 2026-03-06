/**
 * LINCE — Tailwind CSS Config Extension
 * Versión 2.0.0 | ACNB IA SL
 *
 * Este archivo extiende la configuración de Tailwind CSS con la paleta
 * de colores, tipografía y tokens de diseño oficiales de LINCE.
 *
 * Uso:
 *   En tailwind.config.js / tailwind.config.ts:
 *
 *   import linceExtension from './tailwind.config.extension.js';
 *   export default {
 *     content: [...],
 *     theme: {
 *       extend: linceExtension.theme.extend,
 *     },
 *   };
 *
 * Para Tailwind v4 (CSS-first), importar directamente
 * brand/colors/CSS_VARIABLES.css y usar las custom properties en los estilos.
 */

/** @type {import('tailwindcss').Config} */
const linceExtension = {
  theme: {
    extend: {
      // ─── Paleta de Colores ─────────────────────────────────
      colors: {
        // Colores de marca
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
          warning: "#FFD700",
          "warning-dark": "#CC9900",
          error: "#FF3B3B",
          "error-dark": "#CC2F2F",
          info: "#00E5FF",
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

        // Colores del juego
        game: {
          xp: "#00E5FF",
          coins: "#FFD700",
          streak: "#FF6B35",
          health: "#FF3B3B",
          bronze: "#CD7F32",
          silver: "#C0C0C0",
          platinum: "#E5E4E2",
          diamond: "#B9F2FF",
          elite: "#9C27B0",
        },
      },

      // ─── Tipografía ────────────────────────────────────────
      fontFamily: {
        display: [
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "sans-serif",
        ],
        body: [
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "sans-serif",
        ],
        mono: [
          "Fira Code",
          "Fira Mono",
          "Cascadia Code",
          "Source Code Pro",
          "Consolas",
          "monospace",
        ],
      },

      fontSize: {
        "2xs": ["0.625rem", { lineHeight: "1rem" }], // 10px — use only for decorative/non-essential text; min accessible size is 12px
        xs: ["0.75rem", { lineHeight: "1.4" }], // 12px
        sm: ["0.875rem", { lineHeight: "1.5" }], // 14px
        base: ["1rem", { lineHeight: "1.6" }], // 16px
        lg: ["1.125rem", { lineHeight: "1.6" }], // 18px
        xl: ["1.25rem", { lineHeight: "1.4" }], // 20px
        "2xl": ["1.5rem", { lineHeight: "1.3" }], // 24px
        "3xl": ["1.75rem", { lineHeight: "1.3" }], // 28px
        "4xl": ["2.25rem", { lineHeight: "1.2" }], // 36px
        "5xl": ["3rem", { lineHeight: "1.1" }], // 48px
        "6xl": ["4.5rem", { lineHeight: "1.0" }], // 72px
      },

      fontWeight: {
        light: "300",
        normal: "400",
        medium: "500",
        semibold: "600",
        bold: "700",
        extrabold: "800",
        black: "900",
      },

      // ─── Espaciado (8px base) ──────────────────────────────
      spacing: {
        0.5: "2px",
        1: "4px",
        1.5: "6px",
        2: "8px",
        2.5: "10px",
        3: "12px",
        3.5: "14px",
        4: "16px",
        5: "20px",
        6: "24px",
        7: "28px",
        8: "32px",
        9: "36px",
        10: "40px",
        11: "44px",
        12: "48px",
        14: "56px",
        16: "64px",
        18: "72px",
        20: "80px",
        24: "96px",
        28: "112px",
        32: "128px",
        36: "144px",
        40: "160px",
        48: "192px",
        56: "224px",
        64: "256px",
      },

      // ─── Border Radius ─────────────────────────────────────
      borderRadius: {
        none: "0px",
        xs: "2px",
        sm: "4px",
        md: "8px",
        lg: "12px",
        xl: "16px",
        "2xl": "24px",
        "3xl": "32px",
        full: "9999px",
      },

      // ─── Sombras ───────────────────────────────────────────
      boxShadow: {
        sm: "0 1px 3px rgba(0,0,0,0.4), 0 1px 2px rgba(0,0,0,0.3)",
        md: "0 4px 6px rgba(0,0,0,0.5), 0 2px 4px rgba(0,0,0,0.3)",
        lg: "0 10px 15px rgba(0,0,0,0.6), 0 4px 6px rgba(0,0,0,0.4)",
        xl: "0 20px 25px rgba(0,0,0,0.7), 0 10px 10px rgba(0,0,0,0.5)",
        "2xl": "0 25px 50px rgba(0,0,0,0.8)",
        "glow-cyan":
          "0 0 20px rgba(0,229,255,0.3), 0 0 40px rgba(0,229,255,0.1)",
        "glow-orange":
          "0 0 20px rgba(255,107,53,0.3), 0 0 40px rgba(255,107,53,0.1)",
        "glow-gold":
          "0 0 20px rgba(255,215,0,0.4), 0 0 40px rgba(255,215,0,0.15)",
        "glow-green":
          "0 0 20px rgba(0,208,132,0.3), 0 0 40px rgba(0,208,132,0.1)",
        none: "none",
      },

      // ─── Breakpoints ───────────────────────────────────────
      screens: {
        xs: "480px",
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1536px",
      },

      // ─── Z-Index ───────────────────────────────────────────
      zIndex: {
        base: "0",
        raised: "10",
        dropdown: "100",
        sticky: "200",
        overlay: "300",
        modal: "400",
        popover: "500",
        toast: "600",
        tooltip: "700",
      },

      // ─── Animaciones ───────────────────────────────────────
      transitionDuration: {
        fast: "100ms",
        normal: "200ms",
        moderate: "300ms",
        slow: "500ms",
        slower: "800ms",
      },

      transitionTimingFunction: {
        "ease-out-expo": "cubic-bezier(0.0, 0.0, 0.2, 1.0)",
        "ease-in-expo": "cubic-bezier(0.4, 0.0, 1.0, 1.0)",
        spring: "cubic-bezier(0.34, 1.56, 0.64, 1.0)",
      },

      keyframes: {
        fadeIn: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        fadeInUp: {
          from: { opacity: "0", transform: "translateY(16px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        scaleIn: {
          from: { opacity: "0", transform: "scale(0.92)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
        slideInRight: {
          from: { opacity: "0", transform: "translateX(24px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
        pulseGlow: {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(0, 229, 255, 0.4)" },
          "50%": { boxShadow: "0 0 20px 8px rgba(0, 229, 255, 0.1)" },
        },
        xpGain: {
          "0%": { opacity: "1", transform: "translateY(0)" },
          "100%": { opacity: "0", transform: "translateY(-32px)" },
        },
        streakFire: {
          "0%, 100%": { transform: "scale(1) rotate(-2deg)" },
          "50%": { transform: "scale(1.1) rotate(2deg)" },
        },
        levelUp: {
          "0%": { transform: "scale(1)", filter: "brightness(1)" },
          "25%": { transform: "scale(1.1)", filter: "brightness(1.3)" },
          "50%": { transform: "scale(0.95)", filter: "brightness(1.1)" },
          "75%": { transform: "scale(1.05)", filter: "brightness(1.2)" },
          "100%": { transform: "scale(1)", filter: "brightness(1)" },
        },
        wiggle: {
          "0%, 100%": { transform: "rotate(0deg)" },
          "25%": { transform: "rotate(10deg)" },
          "50%": { transform: "rotate(-10deg)" },
          "75%": { transform: "rotate(5deg)" },
        },
      },

      animation: {
        "fade-in": "fadeIn 200ms ease-out",
        "fade-in-up": "fadeInUp 300ms ease-out",
        "scale-in": "scaleIn 200ms ease-out",
        "slide-in-right": "slideInRight 200ms ease-out",
        "pulse-glow": "pulseGlow 2s ease-in-out infinite",
        "xp-gain": "xpGain 1s ease-out forwards",
        "streak-fire": "streakFire 1.5s ease-in-out infinite",
        "level-up": "levelUp 600ms ease-in-out",
        wiggle: "wiggle 1s ease-in-out infinite",
      },

      // ─── Gradientes Background ─────────────────────────────
      backgroundImage: {
        "gradient-brand":
          "linear-gradient(135deg, #00E5FF 0%, #0099CC 100%)",
        "gradient-gold": "linear-gradient(135deg, #FFD700 0%, #FF8C00 100%)",
        "gradient-dark": "linear-gradient(135deg, #1A1A1A 0%, #111111 100%)",
        "gradient-hero":
          "radial-gradient(ellipse at 50% 0%, rgba(0,229,255,0.15) 0%, transparent 70%)",
        "gradient-achievement":
          "linear-gradient(135deg, #1A1200 0%, #1A1A1A 100%)",
      },

      // ─── Max Width ─────────────────────────────────────────
      maxWidth: {
        content: "1280px",
        wide: "1440px",
      },
    },
  },
};

export default linceExtension;

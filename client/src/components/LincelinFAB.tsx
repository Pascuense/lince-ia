import { useState, useEffect, useCallback, useRef } from "react";
import { Link, useLocation } from "wouter";
import { AVATAR_FRONTAL } from "@/lib/avatarConstants";

/**
 * LincelinFAB — Unified floating action button with Lincelin avatar.
 * Replaces the 3 separate floating buttons (Accessibility, Help, Home).
 * 
 * On tap: expands a radial menu with 3 options:
 * 1. Home (navigate to /)
 * 2. Help (contextual tips)
 * 3. Accessibility (open widget)
 * 
 * On mobile: sits above the MobileBottomNav.
 * On desktop: sits in the bottom-right corner.
 * 
 * Features a gentle floating animation when idle.
 */

// ─── HELP CONTENT ───
const HELP_CONTENT: Record<string, { title: string; tips: string[] }> = {
  "/": {
    title: "Portada LINCE",
    tips: [
      "Desliza hacia abajo para ver todas las secciones.",
      "Toca los avatares para conocer a cada personaje.",
      "Usa la barra inferior para navegar rápidamente.",
    ],
  },
  "/jugar": {
    title: "Centro de Juego",
    tips: [
      "Elige un nivel para empezar a aprender IA.",
      "Completa lecciones para ganar LinceCoins.",
      "Reclama tu recompensa diaria cada 24 horas.",
    ],
  },
  "/personajes": {
    title: "Galería de Personajes",
    tips: [
      "Toca cualquier personaje para ver su ficha completa.",
      "Desde la ficha puedes iniciar un chat con el avatar.",
      "Cada personaje es experto en un área diferente de la IA.",
    ],
  },
  "/prompt-studio": {
    title: "IMAGELIN",
    tips: [
      "Rellena los 4 campos y la IA mejorará tu prompt.",
      "Prueba el modo Visual para generar imágenes con IA.",
      "Prueba el modo Profesional para crear prompts de texto.",
    ],
  },
  "/arsenal-ia": {
    title: "Arsenal IA",
    tips: [
      "Explora más de 60 herramientas de IA organizadas por categoría.",
      "Filtra por tipo: Chat, Imagen, Video, Audio, Código...",
      "Toca una herramienta para ver su guía paso a paso.",
    ],
  },
  "/catalogo-formativo": {
    title: "Catálogo Formativo",
    tips: [
      "Más de 120 cursos de 7 horas cada uno.",
      "Filtra por categoría y nivel (Básico/Intermedio/Avanzado).",
      "Contacta para inscribirte en cualquier curso.",
    ],
  },
  "/como-jugar": {
    title: "Cómo Jugar",
    tips: [
      "Lee la guía completa antes de empezar.",
      "Cada avatar explica el juego adaptado a su audiencia.",
      "Consulta el manual de herramientas para sacar el máximo partido.",
    ],
  },
  "/mundo": {
    title: "Mundo LINCE",
    tips: [
      "Explora las diferentes regiones del mundo LINCE.",
      "Cada zona tiene misiones y desafíos únicos.",
      "Completa misiones para desbloquear nuevas áreas.",
    ],
  },
  "/raids": {
    title: "LINCE Raids",
    tips: [
      "Los raids son desafíos cooperativos en equipo.",
      "Forma equipo con otros jugadores para completar misiones.",
      "Las recompensas son mayores cuanto más difícil sea el raid.",
    ],
  },
};

// ─── ACCESSIBILITY LABELS ───
const A11Y_LABELS: Record<string, Record<string, string>> = {
  es: {
    title: "Accesibilidad", fontSize: "Tamaño de texto", contrast: "Alto contraste",
    dyslexia: "Fuente para dislexia", animations: "Reducir animaciones",
    cursor: "Cursor grande", links: "Resaltar enlaces", reset: "Restablecer", close: "Cerrar",
  },
  en: {
    title: "Accessibility", fontSize: "Text size", contrast: "High contrast",
    dyslexia: "Dyslexia font", animations: "Reduce animations",
    cursor: "Large cursor", links: "Highlight links", reset: "Reset", close: "Close",
  },
  zh: {
    title: "无障碍", fontSize: "文字大小", contrast: "高对比度",
    dyslexia: "阅读障碍字体", animations: "减少动画",
    cursor: "大光标", links: "突出链接", reset: "重置", close: "关闭",
  },
};

interface A11ySettings {
  fontSize: number;
  highContrast: boolean;
  dyslexiaFont: boolean;
  reduceAnimations: boolean;
  largeCursor: boolean;
  highlightLinks: boolean;
}
const DEFAULT_A11Y: A11ySettings = {
  fontSize: 1, highContrast: false, dyslexiaFont: false,
  reduceAnimations: false, largeCursor: false, highlightLinks: false,
};

type PanelMode = "closed" | "menu" | "help" | "a11y";

const WELCOME_MESSAGES: Record<string, { greeting: string; cta: string }> = {
  es: { greeting: "¡Hola! Soy Lincelin", cta: "Tócame si necesitas ayuda" },
  en: { greeting: "Hi! I'm Lincelin", cta: "Tap me if you need help" },
  zh: { greeting: "你好！我是 Lincelin", cta: "点我获取帮助" },
};

const LS_KEY_WELCOME = "lince-fab-welcome-seen";

export function LincelinFAB() {
  const [mode, setMode] = useState<PanelMode>("closed");
  const [showWelcome, setShowWelcome] = useState(false);
  const [welcomeDismissing, setWelcomeDismissing] = useState(false);
  const [location] = useLocation();
  const fabRef = useRef<HTMLDivElement>(null);

  // Accessibility settings
  const [a11y, setA11y] = useState<A11ySettings>(() => {
    try {
      const saved = localStorage.getItem("lince-accessibility");
      return saved ? { ...DEFAULT_A11Y, ...JSON.parse(saved) } : DEFAULT_A11Y;
    } catch { return DEFAULT_A11Y; }
  });

  const lang = (() => {
    try { return localStorage.getItem("lince-game-lang") || "es"; } catch { return "es"; }
  })();
  const t = A11Y_LABELS[lang] || A11Y_LABELS.es;

  // Apply accessibility settings
  useEffect(() => {
    localStorage.setItem("lince-accessibility", JSON.stringify(a11y));
    const root = document.documentElement;
    const sizes = [0.85, 1, 1.15, 1.35];
    root.style.fontSize = `${sizes[a11y.fontSize] * 16}px`;
    root.classList.toggle("high-contrast", a11y.highContrast);
    root.classList.toggle("dyslexia-font", a11y.dyslexiaFont);
    root.classList.toggle("reduce-motion", a11y.reduceAnimations);
    root.classList.toggle("large-cursor", a11y.largeCursor);
    root.classList.toggle("highlight-links", a11y.highlightLinks);
  }, [a11y]);

  const updateA11y = (key: keyof A11ySettings, value: boolean | number) => {
    setA11y((prev) => ({ ...prev, [key]: value }));
  };

  // Close on outside click
  useEffect(() => {
    if (mode === "closed") return;
    const handler = (e: MouseEvent) => {
      if (fabRef.current && !fabRef.current.contains(e.target as Node)) {
        setMode("closed");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [mode]);

  // Close on route change
  useEffect(() => { setMode("closed"); }, [location]);

  // Welcome tooltip — show once on first visit, after a short delay
  useEffect(() => {
    try {
      if (localStorage.getItem(LS_KEY_WELCOME)) return;
    } catch { return; }
    const showTimer = setTimeout(() => setShowWelcome(true), 1500);
    const hideTimer = setTimeout(() => {
      setWelcomeDismissing(true);
      setTimeout(() => {
        setShowWelcome(false);
        setWelcomeDismissing(false);
        try { localStorage.setItem(LS_KEY_WELCOME, "1"); } catch {}
      }, 400);
    }, 7000);
    return () => { clearTimeout(showTimer); clearTimeout(hideTimer); };
  }, []);

  const dismissWelcome = useCallback(() => {
    setWelcomeDismissing(true);
    setTimeout(() => {
      setShowWelcome(false);
      setWelcomeDismissing(false);
      try { localStorage.setItem(LS_KEY_WELCOME, "1"); } catch {}
    }, 400);
  }, []);

  const toggleMenu = useCallback(() => {
    if (showWelcome) dismissWelcome();
    setMode((m) => (m === "closed" ? "menu" : "closed"));
  }, [showWelcome, dismissWelcome]);

  // Help content
  const helpKey = Object.keys(HELP_CONTENT)
    .filter((k) => location.startsWith(k))
    .sort((a, b) => b.length - a.length)[0] || "/";
  const help = HELP_CONTENT[helpKey] || HELP_CONTENT["/"];

  const isHome = location === "/";

  return (
    <div ref={fabRef} className="fixed z-[9998] bottom-[5.5rem] right-3 md:bottom-6 md:right-6">
      {/* ─── RADIAL MENU ─── */}
      {mode === "menu" && (
        <div className="absolute bottom-16 right-0 flex flex-col items-end gap-2 animate-in fade-in slide-in-from-bottom-2 duration-200">
          {/* Home button — only show if not on home */}
          {!isHome && (
            <Link
              href="/"
              className="flex items-center gap-2 group"
              onClick={() => setMode("closed")}
            >
              <span className="px-2.5 py-1 rounded-lg bg-black/80 text-white text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                Inicio
              </span>
              <span className="w-10 h-10 rounded-full bg-[oklch(0.82_0.15_195)] shadow-[0_0_12px_oklch(0.82_0.15_195/0.4)] flex items-center justify-center transition-transform hover:scale-110">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
              </span>
            </Link>
          )}

          {/* Help button */}
          <button
            onClick={() => setMode("help")}
            className="flex items-center gap-2 group"
          >
            <span className="px-2.5 py-1 rounded-lg bg-black/80 text-white text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              Ayuda
            </span>
            <span className="w-10 h-10 rounded-full bg-[#00FF88] shadow-[0_0_12px_rgba(0,255,136,0.4)] flex items-center justify-center text-black font-bold text-sm transition-transform hover:scale-110">
              ?
            </span>
          </button>

          {/* Accessibility button */}
          <button
            onClick={() => setMode("a11y")}
            className="flex items-center gap-2 group"
          >
            <span className="px-2.5 py-1 rounded-lg bg-black/80 text-white text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              {t.title}
            </span>
            <span className="w-10 h-10 rounded-full bg-[oklch(0.72_0.12_75)] shadow-[0_0_12px_oklch(0.72_0.12_75/0.4)] flex items-center justify-center transition-transform hover:scale-110">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="4.5" r="2.5" />
                <path d="M12 7v5" />
                <path d="M8 21l4-9 4 9" />
                <path d="M6 12h12" />
              </svg>
            </span>
          </button>
        </div>
      )}

      {/* ─── HELP PANEL ─── */}
      {mode === "help" && (
        <div className="absolute bottom-16 right-0 w-72 bg-[#111111] border border-[#00FF88]/30 rounded-2xl shadow-2xl p-5 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-[#00FF88] flex items-center justify-center text-black font-bold text-xs">?</span>
              <h3 className="font-['Space_Grotesk'] font-bold text-sm text-white">{help.title}</h3>
            </div>
            <button onClick={() => setMode("closed")} className="w-6 h-6 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/60 text-xs">✕</button>
          </div>
          <ul className="space-y-2.5">
            {help.tips.map((tip, i) => (
              <li key={i} className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-[#00FF88]/20 text-[#00FF88] flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5">{i + 1}</span>
                <span className="text-white/80 text-xs leading-relaxed">{tip}</span>
              </li>
            ))}
          </ul>
          <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between">
            <a href="/como-jugar" className="text-[#00FF88] text-[10px] font-medium hover:underline" onClick={() => setMode("closed")}>
              Ver guía completa →
            </a>
            <button
              onClick={() => {
                setMode("closed");
                localStorage.removeItem("lince-onboarding-completed");
                localStorage.setItem("lince-needs-onboarding", "true");
                window.location.reload();
              }}
              className="text-[oklch(0.82_0.15_195)] text-[10px] font-medium hover:underline"
            >
              Repetir tour ↻
            </button>
          </div>
        </div>
      )}

      {/* ─── ACCESSIBILITY PANEL ─── */}
      {mode === "a11y" && (
        <div className="absolute bottom-16 right-0 w-72 bg-[#1A1A2E] border border-[oklch(0.72_0.12_75)]/30 rounded-2xl shadow-2xl p-4 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-[oklch(0.72_0.12_75)] font-bold text-sm">{t.title}</h3>
            <button onClick={() => setMode("closed")} className="text-gray-400 hover:text-white" aria-label={t.close}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
            </button>
          </div>
          {/* Font size */}
          <div className="mb-3">
            <label className="text-gray-300 text-xs mb-1 block">{t.fontSize}</label>
            <div className="flex gap-1">
              {[0, 1, 2, 3].map((i) => (
                <button key={i} onClick={() => updateA11y("fontSize", i)}
                  className={`flex-1 py-1 rounded text-center transition-all ${a11y.fontSize === i ? "bg-[oklch(0.72_0.12_75)] text-black font-bold" : "bg-white/10 text-gray-300 hover:bg-white/20"}`}
                  style={{ fontSize: `${11 + i * 2}px` }} aria-label={`${t.fontSize} ${i + 1}`}>A</button>
              ))}
            </div>
          </div>
          {/* Toggles */}
          {([
            { key: "highContrast" as const, label: t.contrast },
            { key: "dyslexiaFont" as const, label: t.dyslexia },
            { key: "reduceAnimations" as const, label: t.animations },
            { key: "largeCursor" as const, label: t.cursor },
            { key: "highlightLinks" as const, label: t.links },
          ]).map(({ key, label }) => (
            <div key={key} className="flex items-center justify-between py-1.5 border-t border-white/5">
              <span className="text-gray-300 text-xs">{label}</span>
              <button onClick={() => updateA11y(key, !a11y[key])}
                className={`w-9 h-[18px] rounded-full transition-all relative ${a11y[key] ? "bg-[oklch(0.72_0.12_75)]" : "bg-white/20"}`}
                role="switch" aria-checked={a11y[key] as boolean} aria-label={label}>
                <span className={`absolute top-[2px] w-[14px] h-[14px] rounded-full bg-white transition-all ${a11y[key] ? "left-[18px]" : "left-[2px]"}`} />
              </button>
            </div>
          ))}
          <button onClick={() => { setA11y(DEFAULT_A11Y); }}
            className="w-full mt-2 py-1.5 text-xs text-gray-400 hover:text-white border border-white/10 rounded-lg hover:border-white/30 transition-all">
            {t.reset}
          </button>
        </div>
      )}

      {/* ─── WELCOME TOOLTIP ─── */}
      {showWelcome && mode === "closed" && (
        <div
          className={`absolute bottom-[4.5rem] right-0 transition-all duration-400 ${
            welcomeDismissing ? "opacity-0 translate-y-2" : "opacity-100 translate-y-0"
          }`}
          style={{ animation: welcomeDismissing ? "none" : "tooltipBounceIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)" }}
        >
          <div className="relative bg-[#111827] border border-[oklch(0.82_0.15_195)]/40 rounded-2xl px-4 py-3 shadow-[0_0_24px_oklch(0.82_0.15_195/0.15)] max-w-[200px]">
            {/* Speech bubble arrow */}
            <div className="absolute -bottom-2 right-5 w-4 h-4 bg-[#111827] border-r border-b border-[oklch(0.82_0.15_195)]/40 rotate-45" />
            <p className="font-['Space_Grotesk'] font-bold text-[oklch(0.82_0.15_195)] text-sm leading-tight">
              {(WELCOME_MESSAGES[lang] || WELCOME_MESSAGES.es).greeting}
            </p>
            <p className="text-white/70 text-xs mt-1 leading-snug">
              {(WELCOME_MESSAGES[lang] || WELCOME_MESSAGES.es).cta}
            </p>
            <button
              onClick={dismissWelcome}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/50 hover:text-white text-[10px] transition-colors"
              aria-label="Cerrar"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* ─── MAIN FAB BUTTON (Lincelin) ─── */}
      <button
        onClick={toggleMenu}
        aria-label="Menú de ayuda LINCE"
        className={`relative w-14 h-14 rounded-full overflow-hidden border-2 transition-all duration-300 shadow-lg ${
          mode !== "closed"
            ? "border-[oklch(0.82_0.15_195)] shadow-[0_0_20px_oklch(0.82_0.15_195/0.5)] scale-110"
            : "border-[oklch(0.82_0.15_195)]/40 shadow-[0_0_12px_oklch(0.82_0.15_195/0.2)] hover:border-[oklch(0.82_0.15_195)] hover:shadow-[0_0_20px_oklch(0.82_0.15_195/0.4)]"
        }`}
        style={{
          animation: mode === "closed" ? "lincelinFloat 3s ease-in-out infinite" : "none",
        }}
      >
        <img
          src={AVATAR_FRONTAL.PEQUELIN}
          alt="LINCE Helper"
          className="w-full h-full object-cover"
        />
        {/* Glow ring when closed */}
        {mode === "closed" && (
          <span
            className="absolute inset-0 rounded-full"
            style={{
              background: "radial-gradient(circle, transparent 60%, oklch(0.82 0.15 195 / 0.15) 100%)",
              animation: "lincelinPulse 2s ease-in-out infinite",
            }}
          />
        )}
        {/* X overlay when open */}
        {mode !== "closed" && (
          <span className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </span>
        )}
      </button>

      {/* CSS Animations */}
      <style>{`
        @keyframes lincelinFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
        @keyframes lincelinPulse {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
        @keyframes tooltipBounceIn {
          0% { opacity: 0; transform: translateY(12px) scale(0.9); }
          60% { opacity: 1; transform: translateY(-3px) scale(1.02); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
}

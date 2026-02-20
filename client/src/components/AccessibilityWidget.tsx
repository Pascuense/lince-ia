import { useState, useEffect } from "react";

const LABELS: Record<string, Record<string, string>> = {
  es: {
    title: "Accesibilidad",
    fontSize: "Tamaño de texto",
    contrast: "Alto contraste",
    dyslexia: "Fuente para dislexia",
    animations: "Reducir animaciones",
    cursor: "Cursor grande",
    links: "Resaltar enlaces",
    reset: "Restablecer",
    close: "Cerrar",
    small: "A",
    medium: "A",
    large: "A",
    xlarge: "A",
  },
  en: {
    title: "Accessibility",
    fontSize: "Text size",
    contrast: "High contrast",
    dyslexia: "Dyslexia font",
    animations: "Reduce animations",
    cursor: "Large cursor",
    links: "Highlight links",
    reset: "Reset",
    close: "Close",
    small: "A",
    medium: "A",
    large: "A",
    xlarge: "A",
  },
  zh: {
    title: "无障碍",
    fontSize: "文字大小",
    contrast: "高对比度",
    dyslexia: "阅读障碍字体",
    animations: "减少动画",
    cursor: "大光标",
    links: "突出链接",
    reset: "重置",
    close: "关闭",
    small: "A",
    medium: "A",
    large: "A",
    xlarge: "A",
  },
};

interface AccessibilitySettings {
  fontSize: number;
  highContrast: boolean;
  dyslexiaFont: boolean;
  reduceAnimations: boolean;
  largeCursor: boolean;
  highlightLinks: boolean;
}

const DEFAULT_SETTINGS: AccessibilitySettings = {
  fontSize: 1,
  highContrast: false,
  dyslexiaFont: false,
  reduceAnimations: false,
  largeCursor: false,
  highlightLinks: false,
};

export function AccessibilityWidget() {
  const [open, setOpen] = useState(false);
  const [settings, setSettings] = useState<AccessibilitySettings>(() => {
    try {
      const saved = localStorage.getItem("lince-accessibility");
      return saved ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) } : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  const lang = (() => {
    try {
      return localStorage.getItem("lince-game-lang") || "es";
    } catch {
      return "es";
    }
  })();
  const t = LABELS[lang] || LABELS.es;

  useEffect(() => {
    localStorage.setItem("lince-accessibility", JSON.stringify(settings));
    applySettings(settings);
  }, [settings]);

  const applySettings = (s: AccessibilitySettings) => {
    const root = document.documentElement;

    // Font size
    const sizes = [0.85, 1, 1.15, 1.35];
    root.style.fontSize = `${sizes[s.fontSize] * 16}px`;

    // High contrast
    if (s.highContrast) {
      root.classList.add("high-contrast");
    } else {
      root.classList.remove("high-contrast");
    }

    // Dyslexia font
    if (s.dyslexiaFont) {
      root.classList.add("dyslexia-font");
    } else {
      root.classList.remove("dyslexia-font");
    }

    // Reduce animations
    if (s.reduceAnimations) {
      root.classList.add("reduce-motion");
    } else {
      root.classList.remove("reduce-motion");
    }

    // Large cursor
    if (s.largeCursor) {
      root.classList.add("large-cursor");
    } else {
      root.classList.remove("large-cursor");
    }

    // Highlight links
    if (s.highlightLinks) {
      root.classList.add("highlight-links");
    } else {
      root.classList.remove("highlight-links");
    }
  };

  const update = (key: keyof AccessibilitySettings, value: boolean | number) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const reset = () => {
    setSettings(DEFAULT_SETTINGS);
  };

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(!open)}
        aria-label={t.title}
        className="fixed bottom-4 left-4 z-[9999] w-12 h-12 rounded-full bg-[#00E5FF] text-black flex items-center justify-center shadow-lg hover:bg-[#00E5FF]/90 transition-all"
        style={{ fontSize: "20px" }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="4.5" r="2.5" />
          <path d="M12 7v5" />
          <path d="M8 21l4-9 4 9" />
          <path d="M6 12h12" />
        </svg>
      </button>

      {/* Panel */}
      {open && (
        <div
          className="fixed bottom-20 left-4 z-[9999] w-72 bg-[#1A1A2E] border border-[#00E5FF]/30 rounded-xl shadow-2xl p-4"
          role="dialog"
          aria-label={t.title}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[#00E5FF] font-bold text-lg">{t.title}</h3>
            <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-white" aria-label={t.close}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Font size */}
          <div className="mb-3">
            <label className="text-gray-300 text-sm mb-1 block">{t.fontSize}</label>
            <div className="flex gap-1">
              {[0, 1, 2, 3].map((i) => (
                <button
                  key={i}
                  onClick={() => update("fontSize", i)}
                  className={`flex-1 py-1.5 rounded text-center transition-all ${
                    settings.fontSize === i
                      ? "bg-[#00E5FF] text-black font-bold"
                      : "bg-white/10 text-gray-300 hover:bg-white/20"
                  }`}
                  style={{ fontSize: `${12 + i * 3}px` }}
                  aria-label={`${t.fontSize} ${i + 1}`}
                >
                  A
                </button>
              ))}
            </div>
          </div>

          {/* Toggle options */}
          {([
            { key: "highContrast" as const, label: t.contrast },
            { key: "dyslexiaFont" as const, label: t.dyslexia },
            { key: "reduceAnimations" as const, label: t.animations },
            { key: "largeCursor" as const, label: t.cursor },
            { key: "highlightLinks" as const, label: t.links },
          ]).map(({ key, label }) => (
            <div key={key} className="flex items-center justify-between py-2 border-t border-white/5">
              <span className="text-gray-300 text-sm">{label}</span>
              <button
                onClick={() => update(key, !settings[key])}
                className={`w-10 h-5 rounded-full transition-all relative ${
                  settings[key] ? "bg-[#00E5FF]" : "bg-white/20"
                }`}
                role="switch"
                aria-checked={settings[key] as boolean}
                aria-label={label}
              >
                <span
                  className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${
                    settings[key] ? "left-5" : "left-0.5"
                  }`}
                />
              </button>
            </div>
          ))}

          {/* Reset */}
          <button
            onClick={reset}
            className="w-full mt-3 py-2 text-sm text-gray-400 hover:text-white border border-white/10 rounded-lg hover:border-white/30 transition-all"
          >
            {t.reset}
          </button>
        </div>
      )}
    </>
  );
}

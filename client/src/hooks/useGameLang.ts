import { useState, useEffect, useCallback } from "react";

export type GameLang = "es" | "en" | "zh";

const STORAGE_KEY = "lince-prd-lang";

function getStoredLang(): GameLang {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === "en" || saved === "zh") return saved;
  } catch {}
  return "es";
}

/**
 * Lightweight language hook that reads/writes localStorage directly.
 * Replaces usePRDLanguage() in game pages without needing a context provider.
 * Listens for 'lince-lang-change' events from GameLanguageSelector.
 */
export function useGameLang() {
  const [lang, setLangState] = useState<GameLang>(getStoredLang);

  const setLang = useCallback((newLang: GameLang) => {
    setLangState(newLang);
    localStorage.setItem(STORAGE_KEY, newLang);
    window.dispatchEvent(new CustomEvent("lince-lang-change", { detail: newLang }));
  }, []);

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail === "es" || detail === "en" || detail === "zh") {
        setLangState(detail);
      }
    };
    window.addEventListener("lince-lang-change", handler);
    return () => window.removeEventListener("lince-lang-change", handler);
  }, []);

  return { lang, setLang };
}

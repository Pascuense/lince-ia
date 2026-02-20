import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useLocation } from "wouter";
import {
  searchContent,
  getSuggestedSearches,
  CATEGORY_ICONS,
  type SearchResult,
  type SearchCategory,
} from "@/lib/searchIndex";

// ─── i18n ───
const T = {
  es: {
    placeholder: "Buscar cursos, herramientas, personajes...",
    noResults: "Sin resultados para",
    trySuggestions: "Prueba con:",
    recentLabel: "Búsquedas sugeridas",
    shortcut: "Buscar",
    close: "Cerrar",
    navigateHint: "para navegar",
    selectHint: "para seleccionar",
    closeHint: "para cerrar",
  },
  en: {
    placeholder: "Search courses, tools, characters...",
    noResults: "No results for",
    trySuggestions: "Try:",
    recentLabel: "Suggested searches",
    shortcut: "Search",
    close: "Close",
    navigateHint: "to navigate",
    selectHint: "to select",
    closeHint: "to close",
  },
  zh: {
    placeholder: "搜索课程、工具、角色...",
    noResults: "没有找到结果",
    trySuggestions: "试试：",
    recentLabel: "推荐搜索",
    shortcut: "搜索",
    close: "关闭",
    navigateHint: "导航",
    selectHint: "选择",
    closeHint: "关闭",
  },
};

interface GlobalSearchProps {
  lang?: "es" | "en" | "zh";
}

export function GlobalSearch({ lang = "es" }: GlobalSearchProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [, navigate] = useLocation();
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const t = T[lang] || T.es;

  const results = useMemo(() => searchContent(query, lang, 15), [query, lang]);
  const suggestions = useMemo(() => getSuggestedSearches(lang), [lang]);

  // Group results by category
  const groupedResults = useMemo(() => {
    const groups: Record<string, SearchResult[]> = {};
    for (const r of results) {
      if (!groups[r.categoryLabel]) groups[r.categoryLabel] = [];
      groups[r.categoryLabel].push(r);
    }
    return groups;
  }, [results]);

  // Flat list for keyboard nav
  const flatResults = results;

  // ─── Open/Close ───
  const open = useCallback(() => {
    setIsOpen(true);
    setQuery("");
    setSelectedIndex(0);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    setQuery("");
    setSelectedIndex(0);
  }, []);

  // ─── Keyboard shortcut: Cmd/Ctrl+K ───
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (isOpen) close();
        else open();
      }
      if (e.key === "Escape" && isOpen) {
        close();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, open, close]);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Reset selection when results change
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Scroll selected item into view
  useEffect(() => {
    if (!listRef.current) return;
    const items = listRef.current.querySelectorAll("[data-search-item]");
    items[selectedIndex]?.scrollIntoView({ block: "nearest" });
  }, [selectedIndex]);

  // ─── Navigate to result ───
  const goToResult = useCallback(
    (result: SearchResult) => {
      navigate(result.path);
      close();
    },
    [navigate, close]
  );

  // ─── Keyboard navigation ───
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((i) => Math.min(i + 1, flatResults.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && flatResults[selectedIndex]) {
      e.preventDefault();
      goToResult(flatResults[selectedIndex]);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={open}
        className="flex items-center gap-1.5 px-2.5 py-1.5 text-[10px] sm:text-[11px] font-medium text-white/50 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-all border border-white/10 hover:border-white/20"
        aria-label={t.shortcut}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.3-4.3" />
        </svg>
        <span className="hidden sm:inline">{t.shortcut}</span>
        <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[9px] font-mono text-white/30 bg-white/5 rounded border border-white/10">
          <span className="text-[8px]">⌘</span>K
        </kbd>
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-start justify-center pt-[10vh] sm:pt-[15vh]" role="dialog" aria-modal="true" aria-label={t.shortcut}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={close} />

      {/* Modal */}
      <div className="relative w-[95vw] max-w-[640px] bg-[#0D0D12] border border-white/10 rounded-2xl shadow-2xl shadow-[#00E5FF]/5 overflow-hidden">
        {/* Search input */}
        <div className="flex items-center gap-3 px-4 sm:px-5 py-3.5 border-b border-white/10">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#00E5FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={t.placeholder}
            className="flex-1 bg-transparent text-white text-sm sm:text-base placeholder:text-white/30 outline-none font-['Space_Grotesk']"
            autoComplete="off"
            spellCheck={false}
          />
          <button onClick={close} className="flex-shrink-0 px-2 py-1 text-[10px] font-medium text-white/40 bg-white/5 rounded-md border border-white/10 hover:text-white/60 transition-colors">
            ESC
          </button>
        </div>

        {/* Results area */}
        <div ref={listRef} className="max-h-[50vh] overflow-y-auto py-2" style={{ scrollbarWidth: "thin", scrollbarColor: "#00E5FF20 transparent" }}>
          {query.trim() === "" ? (
            /* Suggestions */
            <div className="px-4 sm:px-5 py-3">
              <p className="text-[11px] font-medium text-white/30 uppercase tracking-wider mb-3">{t.recentLabel}</p>
              <div className="flex flex-wrap gap-2">
                {suggestions.map((s) => (
                  <button
                    key={s}
                    onClick={() => setQuery(s)}
                    className="px-3 py-1.5 text-xs font-medium text-white/60 bg-white/5 hover:bg-[#00E5FF]/10 hover:text-[#00E5FF] rounded-lg border border-white/10 hover:border-[#00E5FF]/30 transition-all"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : flatResults.length === 0 ? (
            /* No results */
            <div className="px-5 py-8 text-center">
              <div className="text-3xl mb-3">🔍</div>
              <p className="text-white/50 text-sm">
                {t.noResults} <span className="text-white font-medium">"{query}"</span>
              </p>
              <p className="text-white/30 text-xs mt-2">{t.trySuggestions}</p>
              <div className="flex flex-wrap justify-center gap-2 mt-3">
                {suggestions.slice(0, 4).map((s) => (
                  <button
                    key={s}
                    onClick={() => setQuery(s)}
                    className="px-2.5 py-1 text-[11px] text-white/50 hover:text-[#00E5FF] bg-white/5 hover:bg-[#00E5FF]/10 rounded-md transition-all"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            /* Grouped results */
            Object.entries(groupedResults).map(([categoryLabel, items]) => (
              <div key={categoryLabel} className="mb-1">
                <div className="px-4 sm:px-5 py-1.5">
                  <p className="text-[10px] font-bold text-white/25 uppercase tracking-widest">
                    {CATEGORY_ICONS[items[0].category as SearchCategory]} {categoryLabel}
                  </p>
                </div>
                {items.map((result) => {
                  const idx = flatResults.indexOf(result);
                  const isSelected = idx === selectedIndex;
                  return (
                    <button
                      key={result.id}
                      data-search-item
                      onClick={() => goToResult(result)}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      className={`w-full flex items-center gap-3 px-4 sm:px-5 py-2.5 text-left transition-all ${
                        isSelected
                          ? "bg-[#00E5FF]/10 border-l-2 border-[#00E5FF]"
                          : "border-l-2 border-transparent hover:bg-white/5"
                      }`}
                    >
                      <span className="text-lg flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg bg-white/5">
                        {result.icon}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium truncate ${isSelected ? "text-[#00E5FF]" : "text-white/90"}`}>
                          {result.title[lang]}
                        </p>
                        <p className="text-[11px] text-white/40 truncate mt-0.5">
                          {result.description[lang]}
                        </p>
                      </div>
                      {isSelected && (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#00E5FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 opacity-60">
                          <polyline points="9 18 15 12 9 6" />
                        </svg>
                      )}
                    </button>
                  );
                })}
              </div>
            ))
          )}
        </div>

        {/* Footer hints */}
        <div className="flex items-center gap-4 px-4 sm:px-5 py-2.5 border-t border-white/5 bg-white/[0.02]">
          <div className="flex items-center gap-1.5 text-[10px] text-white/25">
            <kbd className="px-1.5 py-0.5 font-mono bg-white/5 rounded border border-white/10">↑↓</kbd>
            <span>{t.navigateHint}</span>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] text-white/25">
            <kbd className="px-1.5 py-0.5 font-mono bg-white/5 rounded border border-white/10">↵</kbd>
            <span>{t.selectHint}</span>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] text-white/25">
            <kbd className="px-1.5 py-0.5 font-mono bg-white/5 rounded border border-white/10">esc</kbd>
            <span>{t.closeHint}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GlobalSearch;

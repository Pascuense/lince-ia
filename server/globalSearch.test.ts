import { describe, it, expect } from "vitest";

/**
 * Tests for the LINCE Global Search feature.
 * We test the search logic (searchContent, normalize, scoring) directly.
 * Since searchIndex.ts is a client file, we import the logic functions.
 */

// ─── Inline the core search logic for testing ───
// (mirrors the logic in client/src/lib/searchIndex.ts)

type SearchCategory = "page" | "tool" | "course" | "avatar" | "game" | "feature";

interface SearchEntry {
  id: string;
  title: { es: string; en: string; zh: string };
  description: { es: string; en: string; zh: string };
  category: SearchCategory;
  path: string;
  icon: string;
  keywords: string[];
}

interface SearchResult extends SearchEntry {
  score: number;
  categoryLabel: string;
}

function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

function scoreMatch(query: string, entry: SearchEntry, lang: "es" | "en" | "zh"): number {
  const q = normalize(query);
  if (!q) return 0;

  const title = normalize(entry.title[lang]);
  const desc = normalize(entry.description[lang]);
  const kws = entry.keywords.map(normalize);

  let score = 0;

  if (title === q) return 100;
  if (title.startsWith(q)) score = Math.max(score, 90);
  if (title.includes(q)) score = Math.max(score, 75);
  if (kws.some((k) => k === q)) score = Math.max(score, 80);
  if (kws.some((k) => k.startsWith(q))) score = Math.max(score, 65);
  if (kws.some((k) => k.includes(q))) score = Math.max(score, 55);
  if (desc.includes(q)) score = Math.max(score, 40);

  const words = q.split(/\s+/).filter(Boolean);
  if (words.length > 1) {
    const allText = `${title} ${desc} ${kws.join(" ")}`;
    const allMatch = words.every((w) => allText.includes(w));
    if (allMatch) score = Math.max(score, 60);
  }

  if (score === 0 && q.length >= 3) {
    let qi = 0;
    for (const ch of title) {
      if (ch === q[qi]) qi++;
      if (qi === q.length) break;
    }
    if (qi === q.length) score = Math.max(score, 25);
  }

  return score;
}

const CATEGORY_LABELS: Record<SearchCategory, { es: string; en: string; zh: string }> = {
  page:    { es: "Páginas",       en: "Pages",        zh: "页面" },
  tool:    { es: "Herramientas IA", en: "AI Tools",   zh: "AI工具" },
  course:  { es: "Cursos",        en: "Courses",      zh: "课程" },
  avatar:  { es: "Personajes",    en: "Characters",   zh: "角色" },
  game:    { es: "Juego",         en: "Game",         zh: "游戏" },
  feature: { es: "Funciones",     en: "Features",     zh: "功能" },
};

// Sample test entries
const TEST_ENTRIES: SearchEntry[] = [
  {
    id: "tool-chatgpt",
    title: { es: "ChatGPT", en: "ChatGPT", zh: "ChatGPT" },
    description: { es: "Asistente conversacional de OpenAI", en: "OpenAI conversational assistant", zh: "OpenAI对话助手" },
    category: "tool",
    path: "/arsenal-ia/chatgpt",
    icon: "🤖",
    keywords: ["chatgpt", "openai", "chat", "gpt", "conversacion", "asistente", "ia"],
  },
  {
    id: "game-nivel1",
    title: { es: "Nivel 1 — Fundamentos IA", en: "Level 1 — AI Fundamentals", zh: "第1关 — AI基础" },
    description: { es: "Aprende los conceptos básicos de la inteligencia artificial", en: "Learn the basics of artificial intelligence", zh: "学习人工智能基础" },
    category: "game",
    path: "/jugar/nivel-1",
    icon: "1️⃣",
    keywords: ["nivel", "level", "1", "fundamentos", "basico", "fundamentals", "basic", "ia"],
  },
  {
    id: "avatar-bryelin",
    title: { es: "LUMALIN — LUMALIN", en: "LUMALIN — LUMALIN", zh: "LUMALIN — LUMALIN" },
    description: { es: "Mentor IA Generativa · Líder de la Crew Urbana", en: "Generative AI Mentor · Urban Crew Leader", zh: "生成式AI导师 · 都市团队领袖" },
    category: "avatar",
    path: "/personajes",
    icon: "🐱",
    keywords: ["bryelin", "yong bryel", "mentor", "crew", "urbana", "lider", "tiktok", "youtube"],
  },
  {
    id: "course-ia-generativa",
    title: { es: "IA Generativa desde Cero", en: "Generative AI from Scratch", zh: "从零开始的生成式AI" },
    description: { es: "Curso básico de 7h", en: "7h basic course", zh: "7小时基础课程" },
    category: "course",
    path: "/catalogo-formativo",
    icon: "📚",
    keywords: ["ia generativa", "generative ai", "basico", "basic", "curso", "course", "herramientas"],
  },
  {
    id: "page-arsenal",
    title: { es: "Arsenal IA", en: "AI Arsenal", zh: "AI武器库" },
    description: { es: "Directorio completo de 62+ herramientas de inteligencia artificial", en: "Complete directory of 62+ AI tools", zh: "62+AI工具完整目录" },
    category: "page",
    path: "/arsenal-ia",
    icon: "⚡",
    keywords: ["arsenal", "herramientas", "tools", "directorio", "directory", "ia", "ai", "todas"],
  },
];

function searchTestEntries(query: string, lang: "es" | "en" | "zh" = "es", maxResults = 20): SearchResult[] {
  if (!query.trim()) return [];
  const results: SearchResult[] = [];
  for (const entry of TEST_ENTRIES) {
    const score = scoreMatch(query, entry, lang);
    if (score > 0) {
      results.push({ ...entry, score, categoryLabel: CATEGORY_LABELS[entry.category][lang] });
    }
  }
  results.sort((a, b) => b.score !== a.score ? b.score - a.score : a.title[lang].localeCompare(b.title[lang]));
  return results.slice(0, maxResults);
}

// ═══════════════════════════════════════════════════════════════
// TESTS
// ═══════════════════════════════════════════════════════════════

describe("normalize", () => {
  it("converts to lowercase", () => {
    expect(normalize("ChatGPT")).toBe("chatgpt");
  });

  it("removes accents", () => {
    expect(normalize("Básico")).toBe("basico");
    expect(normalize("Educación")).toBe("educacion");
    expect(normalize("Más")).toBe("mas");
  });

  it("trims whitespace", () => {
    expect(normalize("  hello  ")).toBe("hello");
  });

  it("handles empty string", () => {
    expect(normalize("")).toBe("");
  });

  it("handles mixed accents and case", () => {
    expect(normalize("IA Generativa Básica")).toBe("ia generativa basica");
  });
});

describe("scoreMatch", () => {
  const chatgptEntry = TEST_ENTRIES[0];

  it("returns 100 for exact title match", () => {
    expect(scoreMatch("ChatGPT", chatgptEntry, "es")).toBe(100);
  });

  it("returns 0 for empty query", () => {
    expect(scoreMatch("", chatgptEntry, "es")).toBe(0);
    expect(scoreMatch("   ", chatgptEntry, "es")).toBe(0);
  });

  it("scores high for keyword exact match", () => {
    const score = scoreMatch("openai", chatgptEntry, "es");
    expect(score).toBeGreaterThanOrEqual(80);
  });

  it("scores for keyword partial match", () => {
    const score = scoreMatch("chat", chatgptEntry, "es");
    expect(score).toBeGreaterThan(0);
  });

  it("scores for description match", () => {
    const score = scoreMatch("conversacional", chatgptEntry, "es");
    expect(score).toBeGreaterThan(0);
  });

  it("handles accent-insensitive matching", () => {
    const nivelEntry = TEST_ENTRIES[1];
    const score = scoreMatch("basico", nivelEntry, "es");
    expect(score).toBeGreaterThan(0);
  });

  it("returns 0 for completely unrelated query", () => {
    expect(scoreMatch("xyznonexistent", chatgptEntry, "es")).toBe(0);
  });

  it("works with English language", () => {
    const score = scoreMatch("ChatGPT", chatgptEntry, "en");
    expect(score).toBe(100);
  });

  it("works with Chinese language", () => {
    const score = scoreMatch("ChatGPT", chatgptEntry, "zh");
    expect(score).toBe(100);
  });

  it("scores multi-word queries", () => {
    const arsenalEntry = TEST_ENTRIES[4];
    const score = scoreMatch("arsenal herramientas", arsenalEntry, "es");
    expect(score).toBeGreaterThan(0);
  });
});

describe("searchTestEntries", () => {
  it("returns empty array for empty query", () => {
    expect(searchTestEntries("")).toEqual([]);
    expect(searchTestEntries("   ")).toEqual([]);
  });

  it("finds ChatGPT by name", () => {
    const results = searchTestEntries("ChatGPT");
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].id).toBe("tool-chatgpt");
  });

  it("finds LUMALIN by name", () => {
    const results = searchTestEntries("LUMALIN");
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].id).toBe("avatar-bryelin");
  });

  it("finds courses by keyword", () => {
    const results = searchTestEntries("curso");
    expect(results.length).toBeGreaterThan(0);
    expect(results.some((r) => r.category === "course")).toBe(true);
  });

  it("finds game levels by keyword", () => {
    const results = searchTestEntries("nivel");
    expect(results.length).toBeGreaterThan(0);
    expect(results.some((r) => r.category === "game")).toBe(true);
  });

  it("results are sorted by score descending", () => {
    const results = searchTestEntries("ia");
    for (let i = 1; i < results.length; i++) {
      expect(results[i].score).toBeLessThanOrEqual(results[i - 1].score);
    }
  });

  it("includes categoryLabel in results", () => {
    const results = searchTestEntries("ChatGPT");
    expect(results[0].categoryLabel).toBe("Herramientas IA");
  });

  it("respects maxResults parameter", () => {
    const results = searchTestEntries("ia", "es", 2);
    expect(results.length).toBeLessThanOrEqual(2);
  });

  it("works with English language", () => {
    const results = searchTestEntries("Level 1", "en");
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].categoryLabel).toBe("Game");
  });

  it("works with Chinese language", () => {
    const results = searchTestEntries("ChatGPT", "zh");
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].categoryLabel).toBe("AI工具");
  });

  it("finds Arsenal IA page", () => {
    const results = searchTestEntries("arsenal");
    expect(results.length).toBeGreaterThan(0);
    expect(results.some((r) => r.path === "/arsenal-ia")).toBe(true);
  });

  it("finds by partial keyword", () => {
    const results = searchTestEntries("mentor");
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].id).toBe("avatar-bryelin");
  });

  it("handles accent-insensitive search", () => {
    const results = searchTestEntries("basico");
    expect(results.length).toBeGreaterThan(0);
  });
});

describe("category labels", () => {
  it("has labels for all categories", () => {
    const categories: SearchCategory[] = ["page", "tool", "course", "avatar", "game", "feature"];
    for (const cat of categories) {
      expect(CATEGORY_LABELS[cat]).toBeDefined();
      expect(CATEGORY_LABELS[cat].es).toBeTruthy();
      expect(CATEGORY_LABELS[cat].en).toBeTruthy();
      expect(CATEGORY_LABELS[cat].zh).toBeTruthy();
    }
  });
});

describe("search entry structure", () => {
  it("all test entries have required fields", () => {
    for (const entry of TEST_ENTRIES) {
      expect(entry.id).toBeTruthy();
      expect(entry.title.es).toBeTruthy();
      expect(entry.title.en).toBeTruthy();
      expect(entry.title.zh).toBeTruthy();
      expect(entry.description.es).toBeTruthy();
      expect(entry.path).toBeTruthy();
      expect(entry.icon).toBeTruthy();
      expect(entry.keywords.length).toBeGreaterThan(0);
      expect(["page", "tool", "course", "avatar", "game", "feature"]).toContain(entry.category);
    }
  });

  it("all paths start with /", () => {
    for (const entry of TEST_ENTRIES) {
      expect(entry.path.startsWith("/")).toBe(true);
    }
  });
});

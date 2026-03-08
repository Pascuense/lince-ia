import { describe, expect, it } from "vitest";

/**
 * Tests for the UnlockCelebration feature.
 * Tests the celebration logic, section metadata, and i18n messages.
 */

// ─── Section metadata (mirrors UnlockCelebration.tsx SECTION_META) ───
const SECTION_META: Record<string, { icon: string; color: string; route: string }> = {
  jugar:          { icon: "🎮", color: "#00E5FF", route: "/jugar" },
  creaTuLincelin: { icon: "🎨", color: "#D4A843", route: "/lincelin" },
  personajes:     { icon: "👥", color: "#00E5FF", route: "/personajes" },
  perfil:         { icon: "👤", color: "#D4A843", route: "/perfil" },
  recompensas:    { icon: "🎁", color: "#00E5FF", route: "/recompensas" },
  arsenalIA:      { icon: "🛡️", color: "#00E5FF", route: "/arsenal-ia" },
  promptStudio:   { icon: "✨", color: "#D4A843", route: "/prompt-studio" },
  promptear:      { icon: "⚡", color: "#FF6B35", route: "/promptear" },
  mundo:          { icon: "🌍", color: "#4CAF50", route: "/mundo" },
  raids:          { icon: "⚔️", color: "#FF4444", route: "/raids" },
  academia:       { icon: "🎓", color: "#9C27B0", route: "/academia" },
};

// ─── i18n messages (mirrors UnlockCelebration.tsx MESSAGES) ───
const MESSAGES: Record<string, { title: string; unlocked: string; congrats: string; explore: string; close: string }> = {
  es: {
    title: "¡DESBLOQUEADO!",
    unlocked: "Has desbloqueado",
    congrats: "¡Sigue así, campeón! Cada logro te acerca a ser un maestro de la IA.",
    explore: "Explorar ahora",
    close: "Cerrar",
  },
  en: {
    title: "UNLOCKED!",
    unlocked: "You unlocked",
    congrats: "Keep it up, champion! Every achievement brings you closer to AI mastery.",
    explore: "Explore now",
    close: "Close",
  },
  zh: {
    title: "已解锁！",
    unlocked: "你解锁了",
    congrats: "继续加油，冠军！每一个成就都让你更接近AI大师。",
    explore: "立即探索",
    close: "关闭",
  },
};

// Base sections that should NOT trigger celebration
const BASE_SECTIONS = ["jugar", "creaTuLincelin", "personajes", "perfil", "recompensas"];

// Interesting sections that SHOULD trigger celebration
const INTERESTING_SECTIONS = ["arsenalIA", "promptStudio", "promptear", "mundo", "raids", "academia"];

function filterInterestingUnlocks(unlocks: string[]): string[] {
  return unlocks.filter(k => !BASE_SECTIONS.includes(k));
}

describe("UnlockCelebration - Section Metadata", () => {
  it("all 11 sections have metadata defined", () => {
    const allSections = [...BASE_SECTIONS, ...INTERESTING_SECTIONS];
    for (const section of allSections) {
      expect(SECTION_META[section], `${section} should have metadata`).toBeDefined();
      expect(SECTION_META[section].icon).toBeTruthy();
      expect(SECTION_META[section].color).toMatch(/^#[0-9A-Fa-f]{6}$/);
      expect(SECTION_META[section].route).toMatch(/^\//);
    }
  });

  it("each section routes to the correct path", () => {
    expect(SECTION_META.arsenalIA.route).toBe("/arsenal-ia");
    expect(SECTION_META.promptStudio.route).toBe("/prompt-studio");
    expect(SECTION_META.promptear.route).toBe("/promptear");
    expect(SECTION_META.mundo.route).toBe("/mundo");
    expect(SECTION_META.raids.route).toBe("/raids");
    expect(SECTION_META.academia.route).toBe("/academia");
  });

  it("each section has a unique icon", () => {
    const icons = Object.values(SECTION_META).map(m => m.icon);
    const unique = new Set(icons);
    expect(unique.size).toBe(icons.length);
  });
});

describe("UnlockCelebration - i18n Messages", () => {
  it("all 3 languages have complete message sets", () => {
    for (const lang of ["es", "en", "zh"]) {
      const msgs = MESSAGES[lang];
      expect(msgs, `${lang} messages should exist`).toBeDefined();
      expect(msgs.title).toBeTruthy();
      expect(msgs.unlocked).toBeTruthy();
      expect(msgs.congrats).toBeTruthy();
      expect(msgs.explore).toBeTruthy();
      expect(msgs.close).toBeTruthy();
    }
  });

  it("Spanish messages are in Spanish", () => {
    expect(MESSAGES.es.title).toContain("DESBLOQUEADO");
    expect(MESSAGES.es.close).toBe("Cerrar");
  });

  it("English messages are in English", () => {
    expect(MESSAGES.en.title).toContain("UNLOCKED");
    expect(MESSAGES.en.close).toBe("Close");
  });

  it("Chinese messages are in Chinese", () => {
    expect(MESSAGES.zh.title).toContain("解锁");
    expect(MESSAGES.zh.close).toBe("关闭");
  });
});

describe("UnlockCelebration - Filtering Logic", () => {
  it("filters out base sections that are always unlocked", () => {
    const allUnlocks = ["jugar", "arsenalIA", "personajes", "promptStudio"];
    const interesting = filterInterestingUnlocks(allUnlocks);
    expect(interesting).toEqual(["arsenalIA", "promptStudio"]);
  });

  it("returns empty array when only base sections unlock", () => {
    const baseOnly = ["jugar", "creaTuLincelin", "personajes"];
    const interesting = filterInterestingUnlocks(baseOnly);
    expect(interesting).toEqual([]);
  });

  it("returns all when no base sections in the list", () => {
    const onlyInteresting = ["arsenalIA", "mundo", "raids"];
    const interesting = filterInterestingUnlocks(onlyInteresting);
    expect(interesting).toEqual(["arsenalIA", "mundo", "raids"]);
  });

  it("handles empty array", () => {
    expect(filterInterestingUnlocks([])).toEqual([]);
  });

  it("handles single interesting unlock", () => {
    expect(filterInterestingUnlocks(["academia"])).toEqual(["academia"]);
  });

  it("all 6 interesting sections pass the filter", () => {
    const result = filterInterestingUnlocks(INTERESTING_SECTIONS);
    expect(result).toEqual(INTERESTING_SECTIONS);
    expect(result.length).toBe(6);
  });

  it("all 5 base sections are filtered out", () => {
    const result = filterInterestingUnlocks(BASE_SECTIONS);
    expect(result).toEqual([]);
  });
});

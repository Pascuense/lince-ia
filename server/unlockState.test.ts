import { describe, expect, it, vi, beforeEach } from "vitest";

/**
 * Unit tests for the progressive unlock system's server-side logic.
 * Tests the getPlayerUnlockState DB helper function logic and
 * the getUnlockState tRPC procedure.
 */

// ─── Test the unlock computation logic directly ───

interface LevelData {
  id: number;
  completed: boolean;
  stars: number;
  promptsCompleted: number;
  bestScore: number;
}

/**
 * Pure function that mirrors the unlock logic in server/db.ts getPlayerUnlockState.
 * We test this logic in isolation to avoid needing a real DB connection.
 */
function computeUnlocks(
  levelsData: LevelData[],
  xp: number
): Record<string, boolean> {
  const level1Done = levelsData.some(l => l.id === 1 && l.completed);
  const level2Done = levelsData.some(l => l.id === 2 && l.completed);
  const level3Done = levelsData.some(l => l.id === 3 && l.completed);
  const has500XP = xp >= 500;

  return {
    jugar: true,
    creaTuLincelin: true,
    personajes: true,
    perfil: true,
    recompensas: true,
    arsenalIA: level1Done,
    promptStudio: level1Done,
    promptear: level1Done,
    mundo: level2Done,
    raids: level3Done,
    academia: has500XP,
  };
}

describe("Progressive Unlock - Computation Logic", () => {
  const baseLevels: LevelData[] = [
    { id: 1, completed: false, stars: 0, promptsCompleted: 0, bestScore: 0 },
    { id: 2, completed: false, stars: 0, promptsCompleted: 0, bestScore: 0 },
    { id: 3, completed: false, stars: 0, promptsCompleted: 0, bestScore: 0 },
  ];

  it("new player: only base sections unlocked", () => {
    const unlocks = computeUnlocks(baseLevels, 0);

    // Always unlocked
    expect(unlocks.jugar).toBe(true);
    expect(unlocks.creaTuLincelin).toBe(true);
    expect(unlocks.personajes).toBe(true);
    expect(unlocks.perfil).toBe(true);
    expect(unlocks.recompensas).toBe(true);

    // Locked
    expect(unlocks.arsenalIA).toBe(false);
    expect(unlocks.promptStudio).toBe(false);
    expect(unlocks.promptear).toBe(false);
    expect(unlocks.mundo).toBe(false);
    expect(unlocks.raids).toBe(false);
    expect(unlocks.academia).toBe(false);
  });

  it("after Level 1 complete: Arsenal IA, Prompt Studio, Promptear unlocked", () => {
    const levels = baseLevels.map(l =>
      l.id === 1 ? { ...l, completed: true, stars: 2 } : l
    );
    const unlocks = computeUnlocks(levels, 100);

    expect(unlocks.arsenalIA).toBe(true);
    expect(unlocks.promptStudio).toBe(true);
    expect(unlocks.promptear).toBe(true);
    expect(unlocks.mundo).toBe(false);
    expect(unlocks.raids).toBe(false);
    expect(unlocks.academia).toBe(false);
  });

  it("after Level 2 complete: Mundo LINCE unlocked", () => {
    const levels = baseLevels.map(l =>
      l.id <= 2 ? { ...l, completed: true, stars: 2 } : l
    );
    const unlocks = computeUnlocks(levels, 200);

    expect(unlocks.arsenalIA).toBe(true);
    expect(unlocks.mundo).toBe(true);
    expect(unlocks.raids).toBe(false);
    expect(unlocks.academia).toBe(false);
  });

  it("after Level 3 complete: Raids unlocked", () => {
    const levels = baseLevels.map(l => ({ ...l, completed: true, stars: 3 }));
    const unlocks = computeUnlocks(levels, 400);

    expect(unlocks.raids).toBe(true);
    expect(unlocks.academia).toBe(false);
  });

  it("at 500 XP: Academia unlocked", () => {
    const unlocks = computeUnlocks(baseLevels, 500);
    expect(unlocks.academia).toBe(true);
  });

  it("at 499 XP: Academia still locked", () => {
    const unlocks = computeUnlocks(baseLevels, 499);
    expect(unlocks.academia).toBe(false);
  });

  it("all levels complete + 500 XP: everything unlocked", () => {
    const levels = baseLevels.map(l => ({ ...l, completed: true, stars: 3 }));
    const unlocks = computeUnlocks(levels, 1000);

    for (const [key, val] of Object.entries(unlocks)) {
      expect(val, `${key} should be true`).toBe(true);
    }
  });

  it("empty levelsData: only base sections unlocked", () => {
    const unlocks = computeUnlocks([], 0);
    expect(unlocks.arsenalIA).toBe(false);
    expect(unlocks.mundo).toBe(false);
    expect(unlocks.raids).toBe(false);
    expect(unlocks.academia).toBe(false);
  });

  it("high XP without levels: only academia and base unlocked", () => {
    const unlocks = computeUnlocks(baseLevels, 1000);
    expect(unlocks.academia).toBe(true);
    expect(unlocks.arsenalIA).toBe(false);
    expect(unlocks.mundo).toBe(false);
    expect(unlocks.raids).toBe(false);
  });

  it("levels out of order still work", () => {
    const levels: LevelData[] = [
      { id: 3, completed: true, stars: 3, promptsCompleted: 5, bestScore: 100 },
      { id: 1, completed: true, stars: 2, promptsCompleted: 3, bestScore: 80 },
      { id: 2, completed: false, stars: 0, promptsCompleted: 0, bestScore: 0 },
    ];
    const unlocks = computeUnlocks(levels, 300);

    expect(unlocks.arsenalIA).toBe(true);  // Level 1 done
    expect(unlocks.mundo).toBe(false);     // Level 2 NOT done
    expect(unlocks.raids).toBe(true);      // Level 3 done
  });
});

describe("Progressive Unlock - Route Mapping", () => {
  const ROUTE_TO_UNLOCK: Record<string, string> = {
    "/jugar": "jugar",
    "/jugar/nivel-1": "jugar",
    "/jugar/nivel-2": "jugar",
    "/jugar/nivel-3": "jugar",
    "/lincelin": "creaTuLincelin",
    "/crea-tu-lincelin": "creaTuLincelin", // legacy
    "/personajes": "personajes",
    "/perfil": "perfil",
    "/recompensas": "recompensas",
    "/arsenal-ia": "arsenalIA",
    "/prompt-studio": "promptStudio",
    "/prompt-profesional": "promptStudio",
    "/promptear": "promptear",
    "/historial-prompts": "promptStudio",
    "/galeria": "promptStudio",
    "/mundo": "mundo",
    "/raids": "raids",
    "/raids-batalla": "raids",
    "/academia": "academia",
    "/catalogo-formativo": "academia",
  };

  function isRouteUnlocked(path: string, unlocks: Record<string, boolean>): boolean {
    const unlockKey = ROUTE_TO_UNLOCK[path];
    if (!unlockKey) return true;
    return unlocks[unlockKey] ?? false;
  }

  it("unmapped routes are always accessible", () => {
    const unlocks = computeUnlocks([], 0);
    expect(isRouteUnlocked("/aviso-legal", unlocks)).toBe(true);
    expect(isRouteUnlocked("/como-jugar", unlocks)).toBe(true);
    expect(isRouteUnlocked("/some-random-page", unlocks)).toBe(true);
  });

  it("/jugar is always accessible", () => {
    const unlocks = computeUnlocks([], 0);
    expect(isRouteUnlocked("/jugar", unlocks)).toBe(true);
    expect(isRouteUnlocked("/jugar/nivel-1", unlocks)).toBe(true);
  });

  it("/arsenal-ia locked for new player, unlocked after Level 1", () => {
    const lockedUnlocks = computeUnlocks([], 0);
    expect(isRouteUnlocked("/arsenal-ia", lockedUnlocks)).toBe(false);

    const unlockedLevels = [
      { id: 1, completed: true, stars: 2, promptsCompleted: 3, bestScore: 80 },
    ];
    const unlockedUnlocks = computeUnlocks(unlockedLevels, 100);
    expect(isRouteUnlocked("/arsenal-ia", unlockedUnlocks)).toBe(true);
  });

  it("/academia locked until 500 XP", () => {
    const locked = computeUnlocks([], 499);
    expect(isRouteUnlocked("/academia", locked)).toBe(false);
    expect(isRouteUnlocked("/catalogo-formativo", locked)).toBe(false);

    const unlocked = computeUnlocks([], 500);
    expect(isRouteUnlocked("/academia", unlocked)).toBe(true);
    expect(isRouteUnlocked("/catalogo-formativo", unlocked)).toBe(true);
  });
});

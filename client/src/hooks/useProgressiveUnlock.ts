/**
 * P1-4 + DB Persistence: Progressive Onboarding System
 * 
 * Controls what sections are unlocked based on player progress.
 * 
 * For AUTHENTICATED users (logged-in game players):
 *   - Fetches unlock state from the database via tRPC (getUnlockState)
 *   - Falls back to local GameContext state while loading
 *   - DB is the single source of truth; local state is optimistic cache
 * 
 * For UNAUTHENTICATED users:
 *   - Uses local GameContext state (localStorage-backed)
 * 
 * Admins bypass all locks.
 * 
 * Unlock rules:
 * - After registration: Jugar (Level 1) + Mi Avatar + Especialistas
 * - After Level 1 complete: Herramientas IA + Crear Imagen
 * - After Level 2 complete: Mundo LINCE
 * - After Level 3 complete: Batallas
 * - After 500 XP: Cursos
 */
import { useMemo, useEffect, useRef, useState, useCallback } from "react";
import { useGame } from "@/contexts/GameContext";
import { isAdminUser } from "@/lib/accessControl";
import { trpc } from "@/lib/trpc";

export interface UnlockState {
  /** Always unlocked after registration */
  jugar: boolean;
  creaTuLincelin: boolean;
  personajes: boolean;
  perfil: boolean;
  recompensas: boolean;
  /** Unlocked after Level 1 */
  arsenalIA: boolean;
  promptStudio: boolean;
  promptear: boolean;
  /** Unlocked after Level 2 */
  mundo: boolean;
  /** Unlocked after Level 3 */
  raids: boolean;
  /** Unlocked at 500 XP */
  academia: boolean;
}

export interface UnlockInfo {
  unlocks: UnlockState;
  /** What the user should do next */
  nextAction: { key: string; label: Record<string, string> } | null;
  /** Recently unlocked sections (for celebration UI) */
  recentUnlocks: string[];
  /** Check if a specific route path is unlocked */
  isRouteUnlocked: (path: string) => boolean;
  /** Whether the unlock state is loaded from the database */
  isDbSynced: boolean;
  /** Force refetch from DB */
  refetch: () => void;
}

// Map route paths to unlock keys
const ROUTE_TO_UNLOCK: Record<string, keyof UnlockState> = {
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

const NEXT_ACTIONS: Record<string, { key: string; label: Record<string, string> }> = {
  level1: {
    key: "level1",
    label: {
      es: "¡Completa el Nivel 1 para desbloquear Herramientas IA y Crear Imagen!",
      en: "Complete Level 1 to unlock AI Tools and Create Image!",
      zh: "完成第1关解锁AI武器库和山猫图像！",
    },
  },
  level2: {
    key: "level2",
    label: {
      es: "¡Completa el Nivel 2 para desbloquear el Mundo LINCE!",
      en: "Complete Level 2 to unlock World LINCE!",
      zh: "完成第2关解锁LINCE世界！",
    },
  },
  level3: {
    key: "level3",
    label: {
      es: "¡Completa el Nivel 3 para desbloquear las Batallas!",
      en: "Complete Level 3 to unlock Battles!",
      zh: "完成第3关解锁突袭！",
    },
  },
  xp500: {
    key: "xp500",
    label: {
      es: "¡Consigue 500 XP para desbloquear los Cursos!",
      en: "Reach 500 XP to unlock the Academy!",
      zh: "获得500经验值解锁学院！",
    },
  },
};

// ─── Local storage key for caching DB unlock state ───
const DB_UNLOCK_CACHE_KEY = "lince-db-unlock-state";

function cacheDbUnlocks(playerId: number, unlocks: Record<string, boolean>) {
  try {
    localStorage.setItem(DB_UNLOCK_CACHE_KEY, JSON.stringify({ playerId, unlocks, ts: Date.now() }));
  } catch { /* ignore */ }
}

function loadCachedDbUnlocks(playerId: number): Record<string, boolean> | null {
  try {
    const raw = localStorage.getItem(DB_UNLOCK_CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    // Only use cache if same player and less than 5 minutes old
    if (parsed.playerId === playerId && Date.now() - parsed.ts < 5 * 60 * 1000) {
      return parsed.unlocks;
    }
  } catch { /* ignore */ }
  return null;
}

/** Compute unlock state from local levels + xp */
function computeLocalUnlocks(levels: Array<{ id: number; completed: boolean }>, xp: number): UnlockState {
  const level2Done = levels.some(l => l.id === 2 && l.completed);
  const level3Done = levels.some(l => l.id === 3 && l.completed);
  const has500XP = xp >= 500;

  return {
    jugar: true,
    creaTuLincelin: true,
    personajes: true,
    perfil: true,
    recompensas: true,
    // Herramientas IA, Crear Imagen, and Aprender Prompts are ALWAYS unlocked for all users
    arsenalIA: true,
    promptStudio: true,
    promptear: true,
    mundo: level2Done,
    raids: level3Done,
    academia: has500XP,
  };
}

function computeNextAction(unlocks: UnlockState) {
  // arsenalIA, promptStudio, promptear are always unlocked — skip level1 check
  if (!unlocks.mundo) return NEXT_ACTIONS.level2;
  if (!unlocks.raids) return NEXT_ACTIONS.level3;
  if (!unlocks.academia) return NEXT_ACTIONS.xp500;
  return null;
}

const ALL_UNLOCKED: UnlockState = {
  jugar: true,
  creaTuLincelin: true,
  personajes: true,
  perfil: true,
  recompensas: true,
  arsenalIA: true,
  promptStudio: true,
  promptear: true,
  mundo: true,
  raids: true,
  academia: true,
};

export function useProgressiveUnlock(): UnlockInfo {
  const { state, loggedUser } = useGame();
  const admin = isAdminUser();
  const playerId = loggedUser?.id;

  // Track previous unlocks for celebration detection
  const prevUnlocksRef = useRef<string>("");
  const [recentUnlocks, setRecentUnlocks] = useState<string[]>([]);

  // ─── DB query for authenticated users ───
  const dbQuery = trpc.gamePlayer.getUnlockState.useQuery(
    { playerId: playerId! },
    {
      enabled: !!playerId && !admin,
      staleTime: 30_000,       // Consider fresh for 30s
      refetchInterval: 60_000, // Re-check every 60s
      retry: 2,
    }
  );

  // Listen for level-complete and xp-milestone events to refetch from DB
  useEffect(() => {
    if (!playerId || admin) return;
    const handleLevelComplete = () => {
      // Wait 2s for syncProgress to reach the DB, then refetch
      setTimeout(() => dbQuery.refetch(), 2000);
    };
    const handleXPMilestone = () => {
      setTimeout(() => dbQuery.refetch(), 2000);
    };
    window.addEventListener('lince-level-complete', handleLevelComplete);
    window.addEventListener('lince-xp-milestone', handleXPMilestone);
    return () => {
      window.removeEventListener('lince-level-complete', handleLevelComplete);
      window.removeEventListener('lince-xp-milestone', handleXPMilestone);
    };
  }, [playerId, admin, dbQuery]);

  const refetch = useCallback(() => {
    if (playerId && !admin) {
      dbQuery.refetch();
    }
  }, [playerId, admin, dbQuery]);

  // Cache DB results to localStorage for instant load next time
  useEffect(() => {
    if (dbQuery.data?.unlocks && playerId) {
      cacheDbUnlocks(playerId, dbQuery.data.unlocks);
    }
  }, [dbQuery.data, playerId]);

  return useMemo(() => {
    // Admins get everything unlocked
    if (admin) {
      return {
        unlocks: ALL_UNLOCKED,
        nextAction: null,
        recentUnlocks: [],
        isRouteUnlocked: () => true,
        isDbSynced: true,
        refetch,
      };
    }

    let unlocks: UnlockState;
    let isDbSynced = false;

    if (playerId && dbQuery.data?.unlocks) {
      // ─── DB data available: use it as source of truth ───
      const dbUnlocks = dbQuery.data.unlocks;
      unlocks = {
        jugar: dbUnlocks.jugar ?? true,
        creaTuLincelin: dbUnlocks.creaTuLincelin ?? true,
        personajes: dbUnlocks.personajes ?? true,
        perfil: dbUnlocks.perfil ?? true,
        recompensas: dbUnlocks.recompensas ?? true,
        // Always unlocked for all users
        arsenalIA: true,
        promptStudio: true,
        promptear: true,
        mundo: dbUnlocks.mundo ?? false,
        raids: dbUnlocks.raids ?? false,
        academia: dbUnlocks.academia ?? false,
      };
      isDbSynced = true;
    } else if (playerId) {
      // ─── DB loading: use cached DB state or local state as fallback ───
      const cached = loadCachedDbUnlocks(playerId);
      if (cached) {
        unlocks = {
          jugar: cached.jugar ?? true,
          creaTuLincelin: cached.creaTuLincelin ?? true,
          personajes: cached.personajes ?? true,
          perfil: cached.perfil ?? true,
          recompensas: cached.recompensas ?? true,
          // Always unlocked for all users
          arsenalIA: true,
          promptStudio: true,
          promptear: true,
          mundo: cached.mundo ?? false,
          raids: cached.raids ?? false,
          academia: cached.academia ?? false,
        };
      } else {
        // Fallback to local GameContext state
        unlocks = computeLocalUnlocks(state.levels, state.xp);
      }
    } else {
      // ─── Not authenticated: use local state ───
      unlocks = computeLocalUnlocks(state.levels, state.xp);
    }

    // Merge: if local state has MORE unlocks than DB (optimistic), use the union
    // This prevents locking a section the user just unlocked locally before DB sync
    if (playerId) {
      const localUnlocks = computeLocalUnlocks(state.levels, state.xp);
      const keys = Object.keys(unlocks) as (keyof UnlockState)[];
      for (const key of keys) {
        if (localUnlocks[key] && !unlocks[key]) {
          unlocks[key] = true;
        }
      }
    }

    const nextAction = computeNextAction(unlocks);

    // Detect recent unlocks for celebration
    const unlockHash = JSON.stringify(unlocks);
    if (prevUnlocksRef.current && prevUnlocksRef.current !== unlockHash) {
      try {
        const prev = JSON.parse(prevUnlocksRef.current) as Record<string, boolean>;
        const newlyUnlocked: string[] = [];
        for (const [key, val] of Object.entries(unlocks)) {
          if (val && !prev[key]) {
            newlyUnlocked.push(key);
          }
        }
        if (newlyUnlocked.length > 0) {
          setRecentUnlocks(newlyUnlocked);
          try {
            localStorage.setItem("lince-recent-unlocks", JSON.stringify(newlyUnlocked));
          } catch { /* ignore */ }
          // Clear celebration after 10 seconds
          setTimeout(() => {
            setRecentUnlocks([]);
            try { localStorage.removeItem("lince-recent-unlocks"); } catch { /* ignore */ }
          }, 10_000);
        }
      } catch { /* ignore */ }
    }
    prevUnlocksRef.current = unlockHash;

    const isRouteUnlocked = (path: string): boolean => {
      const unlockKey = ROUTE_TO_UNLOCK[path];
      if (!unlockKey) return true;
      return unlocks[unlockKey];
    };

    return { unlocks, nextAction, recentUnlocks, isRouteUnlocked, isDbSynced, refetch };
  }, [admin, state.levels, state.xp, playerId, dbQuery.data, recentUnlocks, refetch]);
}

/** Translations for unlock names */
export const UNLOCK_LABELS: Record<keyof UnlockState, Record<string, string>> = {
  jugar: { es: "Jugar", en: "Play", zh: "游戏" },
  creaTuLincelin: { es: "Mi Avatar", en: "My Avatar", zh: "我的角色" },
  personajes: { es: "Personajes", en: "Characters", zh: "角色" },
  perfil: { es: "Mi Perfil", en: "My Profile", zh: "我的资料" },
  recompensas: { es: "Recompensas", en: "Rewards", zh: "奖励" },
  arsenalIA: { es: "Herramientas IA", en: "AI Tools", zh: "AI工具" },
  promptStudio: { es: "Crear Imagen", en: "Create Image", zh: "创建图像" },
  promptear: { es: "Aprender Prompts", en: "Learn Prompts", zh: "学习提示词" },
  mundo: { es: "Mundo LINCE", en: "World LINCE", zh: "LINCE世界" },
  raids: { es: "Batallas", en: "Battles", zh: "对战" },
  academia: { es: "Cursos", en: "Courses", zh: "课程" },
};

/** Unlock requirement descriptions */
export const UNLOCK_REQUIREMENTS: Record<keyof UnlockState, Record<string, string>> = {
  jugar: { es: "Disponible desde el inicio", en: "Available from start", zh: "从一开始就可用" },
  creaTuLincelin: { es: "Disponible desde el inicio", en: "Available from start", zh: "从一开始就可用" },
  personajes: { es: "Disponible desde el inicio", en: "Available from start", zh: "从一开始就可用" },
  perfil: { es: "Disponible desde el inicio", en: "Available from start", zh: "从一开始就可用" },
  recompensas: { es: "Disponible desde el inicio", en: "Available from start", zh: "从一开始就可用" },
  arsenalIA: { es: "Disponible desde el inicio", en: "Available from start", zh: "从一开始就可用" },
  promptStudio: { es: "Disponible desde el inicio", en: "Available from start", zh: "从一开始就可用" },
  promptear: { es: "Disponible desde el inicio", en: "Available from start", zh: "从一开始就可用" },
  mundo: { es: "Completa el Nivel 2", en: "Complete Level 2", zh: "完成第2关" },
  raids: { es: "Completa el Nivel 3", en: "Complete Level 3", zh: "完成第3关" },
  academia: { es: "Consigue 500 XP", en: "Reach 500 XP", zh: "获得500经验值" },
};

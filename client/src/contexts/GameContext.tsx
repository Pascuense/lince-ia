import { createContext, useContext, useState, useCallback, useEffect, useRef, type ReactNode } from "react";
import { handleExpiredGameSession } from "@/lib/gameSession";
import { addToSyncQueue, requestBackgroundSync, isIndexedDBAvailable, saveOfflineState } from "@/lib/offlineStore";

// ─── Types ───────────────────────────────────────────────────────────
export interface PromptResult {
  text: string;
  score: number;       // 0-100
  feedback: string;
  coins: number;
  xp: number;
}

export interface LevelState {
  id: number;
  completed: boolean;
  stars: number;        // 0-3
  promptsCompleted: number;
  bestScore: number;
}

export interface DailyRewardDay {
  day: number;         // 1-7
  coins: number;       // reward amount
  bonus: string;       // description
  claimed: boolean;
}

export interface DailyRewardsState {
  lastClaimDate: string;       // ISO date string YYYY-MM-DD
  consecutiveDays: number;     // 0-7 streak
  totalDaysClaimed: number;
  weekProgress: boolean[];     // 7 booleans for current week
}

export interface GameState {
  playerName: string;
  avatarKey: string;
  linceCoins: number;
  xp: number;
  currentLevel: number;
  levels: LevelState[];
  totalPromptsWritten: number;
  streak: number;
  lastPlayedDate: string;
  dailyRewards: DailyRewardsState;
}

interface LoggedUser {
  id?: number;
  email: string;
  username: string;
  realName: string;
  avatarKey?: string;
}

interface GameContextType {
  state: GameState;
  evaluatePrompt: (prompt: string, level: number, mission: number) => PromptResult;
  completeLevel: (levelId: number, stars: number) => void;
  addCoins: (amount: number) => void;
  addXP: (amount: number) => void;
  setPlayerName: (name: string) => void;
  resetGame: () => void;
  isLevelUnlocked: (levelId: number) => boolean;
  getLevelState: (levelId: number) => LevelState;
  isLoggedIn: boolean;
  loggedUser: LoggedUser | null;
  claimDailyReward: () => { coins: number; xp: number; day: number } | null;
  canClaimDailyReward: () => boolean;
  getDailyRewardSchedule: () => DailyRewardDay[];
  syncProgressToServer: () => void;
  logout: () => void;
}

// ─── Default State ───────────────────────────────────────────────────
const DEFAULT_DAILY_REWARDS: DailyRewardsState = {
  lastClaimDate: "",
  consecutiveDays: 0,
  totalDaysClaimed: 0,
  weekProgress: [false, false, false, false, false, false, false],
};

// Reward schedule: escalating coins per consecutive day
const DAILY_REWARD_SCHEDULE: { coins: number; xp: number; bonusKey: string }[] = [
  { coins: 10, xp: 5,  bonusKey: "day1" },
  { coins: 15, xp: 8,  bonusKey: "day2" },
  { coins: 20, xp: 10, bonusKey: "day3" },
  { coins: 30, xp: 15, bonusKey: "day4" },
  { coins: 40, xp: 20, bonusKey: "day5" },
  { coins: 50, xp: 25, bonusKey: "day6" },
  { coins: 100, xp: 50, bonusKey: "day7" },
];

const DEFAULT_STATE: GameState = {
  playerName: "",
  avatarKey: "",
  linceCoins: 0,
  xp: 0,
  currentLevel: 1,
  levels: [
    { id: 1, completed: false, stars: 0, promptsCompleted: 0, bestScore: 0 },
    { id: 2, completed: false, stars: 0, promptsCompleted: 0, bestScore: 0 },
    { id: 3, completed: false, stars: 0, promptsCompleted: 0, bestScore: 0 },
  ],
  totalPromptsWritten: 0,
  streak: 0,
  lastPlayedDate: "",
  dailyRewards: { ...DEFAULT_DAILY_REWARDS },
};

// ─── Prompt Evaluation Engine ────────────────────────────────────────
const LEVEL_KEYWORDS: Record<number, Record<number, string[]>> = {
  1: {
    1: ["hola", "saluda", "saludo", "buenos", "hi", "hello", "greet", "presenta", "nombre", "bienvenido"],
    2: ["mascota", "robot", "nombre", "llama", "inventa", "crea", "pet", "name", "create", "imagine", "original"],
    3: ["habitación", "habitacion", "room", "diseña", "imagina", "colores", "ventana", "cama", "luz", "describe", "detalle", "estilo", "paredes", "techo"],
  },
  2: {
    1: ["estilo", "moderno", "futurista", "acogedor", "minimalista", "style", "cozy", "futuristic", "neon", "natural", "espacioso", "luminoso", "diseño"],
    2: ["mueble", "silla", "mesa", "estantería", "lámpara", "sofá", "escritorio", "furniture", "chair", "desk", "lamp", "shelf", "especial", "único"],
    3: ["decoración", "cuadro", "planta", "alfombra", "poster", "foto", "decoration", "art", "personal", "recuerdo", "favorito", "color"],
  },
  3: {
    1: ["barrera", "proteger", "muro", "escudo", "puerta", "bloquear", "barrier", "protect", "wall", "shield", "door", "block", "defensa", "fuerte"],
    2: ["atacar", "contraataque", "rayo", "fuego", "hielo", "sombra", "attack", "counter", "fire", "ice", "lightning", "shadow", "golpe", "poder"],
    3: ["trampa", "sorpresa", "engaño", "oculto", "secreto", "trap", "surprise", "hidden", "trick", "creativo", "inesperado", "ingenioso"],
  },
};

function evaluatePromptQuality(text: string, levelId: number, missionId: number): PromptResult {
  const trimmed = text.trim();
  if (!trimmed) return { text: trimmed, score: 0, feedback: "empty", coins: 0, xp: 0 };

  let score = 0;
  const words = trimmed.toLowerCase().split(/\s+/);
  const wordCount = words.length;

  // Length scoring (0-30 points)
  if (wordCount >= 3) score += 5;
  if (wordCount >= 5) score += 5;
  if (wordCount >= 8) score += 5;
  if (wordCount >= 12) score += 5;
  if (wordCount >= 18) score += 5;
  if (wordCount >= 25) score += 5;

  // Keyword matching (0-35 points)
  const keywords = LEVEL_KEYWORDS[levelId]?.[missionId] || [];
  const matchedKeywords = keywords.filter(kw => trimmed.toLowerCase().includes(kw));
  const keywordScore = Math.min(35, matchedKeywords.length * 7);
  score += keywordScore;

  // Creativity indicators (0-20 points)
  if (trimmed.includes(",")) score += 4;
  if (trimmed.includes("como") || trimmed.includes("like")) score += 4;
  if (/[!¡]/.test(trimmed)) score += 3;
  if (/[?¿]/.test(trimmed)) score += 3;
  if (new Set(words).size / wordCount > 0.7) score += 3;
  if (wordCount > 15 && new Set(words).size > 10) score += 3;

  // Specificity bonus (0-15 points)
  const hasNumbers = /\d/.test(trimmed);
  const hasAdjectives = /(?:grande|pequeño|brillante|oscuro|suave|fuerte|mágico|increíble|beautiful|amazing|powerful|bright|dark|soft|strong|magical)/i.test(trimmed);
  const hasColors = /(?:rojo|azul|verde|amarillo|cyan|dorado|negro|blanco|red|blue|green|yellow|gold|black|white|purple|pink)/i.test(trimmed);
  if (hasNumbers) score += 5;
  if (hasAdjectives) score += 5;
  if (hasColors) score += 5;

  score = Math.min(100, Math.max(5, score));

  // Calculate rewards based on score
  const baseCoins = levelId === 1 ? 35 : levelId === 2 ? 50 : 70;
  const baseXP = levelId === 1 ? 17 : levelId === 2 ? 25 : 35;
  const coins = Math.round(baseCoins * (score / 100));
  const xp = Math.round(baseXP * (score / 100));

  // Generate feedback key
  let feedback: string;
  if (score >= 85) feedback = "excellent";
  else if (score >= 65) feedback = "great";
  else if (score >= 45) feedback = "good";
  else if (score >= 25) feedback = "ok";
  else feedback = "tryAgain";

  return { text: trimmed, score, feedback, coins, xp };
}

// ─── Context ─────────────────────────────────────────────────────────
const GameContext = createContext<GameContextType | null>(null);

const STORAGE_KEY = "lince_game_state";

function loadState(): GameState {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (!parsed.levels || parsed.levels.length < 3) {
        parsed.levels = DEFAULT_STATE.levels;
      }
      return { ...DEFAULT_STATE, ...parsed };
    }
  } catch { /* ignore */ }
  return { ...DEFAULT_STATE };
}

function saveState(state: GameState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch { /* ignore */ }
}

// Helper to get the logged-in user from localStorage
function getLoggedUser(): LoggedUser | null {
  try {
    const stored = localStorage.getItem('lince-user');
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed.username && parsed.realName) {
        // Ensure id is always a number (may be stored as string from older versions)
        if (parsed.id !== undefined) parsed.id = Number(parsed.id);
        return parsed;
      }
    }
  } catch { /* ignore */ }
  return null;
}

// Debounced server sync helper
function debounce<T extends (...args: any[]) => void>(fn: T, delay: number): T {
  let timer: ReturnType<typeof setTimeout>;
  return ((...args: any[]) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  }) as T;
}

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<GameState>(() => {
    const localState = loadState();
    // If user is logged in, merge their DB data from localStorage cache
    const user = getLoggedUser();
    if (user) {
      return {
        ...localState,
        playerName: user.username || localState.playerName,
        avatarKey: (user as any).avatarKey || localState.avatarKey || "",
        linceCoins: (user as any).linceCoins ?? localState.linceCoins,
        xp: (user as any).xp ?? localState.xp,
        currentLevel: (user as any).currentLevel ?? localState.currentLevel,
        totalPromptsWritten: (user as any).totalPromptsWritten ?? localState.totalPromptsWritten,
        streak: (user as any).streak ?? localState.streak,
        lastPlayedDate: (user as any).lastPlayedDate ?? localState.lastPlayedDate,
        levels: (user as any).levelsData ?? localState.levels,
        dailyRewards: (user as any).dailyRewardsData ?? localState.dailyRewards,
      };
    }
    return localState;
  });
  const [loggedUser, setLoggedUser] = useState<LoggedUser | null>(getLoggedUser);
  const syncTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Persist on every change (localStorage + IndexedDB offline snapshot)
  useEffect(() => {
    saveState(state);
    // Also save to IndexedDB for offline recovery
    const user = getLoggedUser();
    if (user?.id && isIndexedDBAvailable()) {
      saveOfflineState(user.id, state).catch(() => {});
    }
  }, [state]);

  // Debounced sync to server (every 5 seconds after changes)
  const syncProgressToServer = useCallback(() => {
    const user = getLoggedUser();
    if (!user?.id) return;

    // Use fetch directly to avoid needing trpc client in context
    const payload = {
      playerId: user.id,
      linceCoins: state.linceCoins,
      xp: state.xp,
      currentLevel: state.currentLevel,
      totalPromptsWritten: state.totalPromptsWritten,
      streak: state.streak,
      lastPlayedDate: state.lastPlayedDate,
      levelsData: state.levels,
      dailyRewardsData: state.dailyRewards,
    };

    const gameToken = localStorage.getItem('lince-game-token');
    const fetchHeaders: Record<string, string> = { 'Content-Type': 'application/json' };
    if (gameToken) fetchHeaders['x-game-token'] = gameToken;
    fetch('/api/trpc/gamePlayer.syncProgress', {
      method: 'POST',
      headers: fetchHeaders,
      credentials: 'include',
      body: JSON.stringify({ json: payload }),
    }).then((res) => {
      if (res.status === 401) handleExpiredGameSession();
    }).catch(async (err) => {
      console.warn('[GameContext] Failed to sync progress to server, queuing offline:', err);
      // Queue for background sync when offline
      if (isIndexedDBAvailable()) {
        try {
          await addToSyncQueue({
            type: 'progress',
            payload,
            playerId: user.id!,
            timestamp: Date.now(),
          });
          await requestBackgroundSync();
          console.log('[GameContext] Progress queued for background sync');
        } catch (queueErr) {
          console.warn('[GameContext] Failed to queue offline:', queueErr);
        }
      }
    });
  }, [state]);

  // Auto-sync progress to server every 30 seconds if user is logged in and state changed
  const lastSyncedRef = useRef<string>("");
  useEffect(() => {
    const user = getLoggedUser();
    if (!user?.id) return;

    const stateHash = JSON.stringify({
      linceCoins: state.linceCoins,
      xp: state.xp,
      currentLevel: state.currentLevel,
      totalPromptsWritten: state.totalPromptsWritten,
      streak: state.streak,
    });

    if (stateHash === lastSyncedRef.current) return;

    if (syncTimerRef.current) clearTimeout(syncTimerRef.current);
    syncTimerRef.current = setTimeout(() => {
      lastSyncedRef.current = stateHash;
      syncProgressToServer();
    }, 5000);

    return () => {
      if (syncTimerRef.current) clearTimeout(syncTimerRef.current);
    };
  }, [state.linceCoins, state.xp, state.currentLevel, state.totalPromptsWritten, state.streak, syncProgressToServer]);

  // Sync on page unload
  useEffect(() => {
    const handleBeforeUnload = () => {
      const user = getLoggedUser();
      if (!user?.id) return;
      // Use sendBeacon for reliable sync on page close
      const payload = JSON.stringify({
        json: {
          playerId: user.id,
          linceCoins: state.linceCoins,
          xp: state.xp,
          currentLevel: state.currentLevel,
          totalPromptsWritten: state.totalPromptsWritten,
          streak: state.streak,
          lastPlayedDate: state.lastPlayedDate,
          levelsData: state.levels,
          dailyRewardsData: state.dailyRewards,
        },
      });
      // sendBeacon cannot send custom headers, use fetch with keepalive instead
      const beaconToken = localStorage.getItem('lince-game-token');
      const beaconHeaders: Record<string, string> = { 'Content-Type': 'application/json' };
      if (beaconToken) beaconHeaders['x-game-token'] = beaconToken;
      try {
        fetch('/api/trpc/gamePlayer.syncProgress', {
          method: 'POST',
          headers: beaconHeaders,
          body: payload,
          credentials: 'include',
          keepalive: true,
        });
      } catch {
        // Fallback to sendBeacon (won't have auth but better than nothing)
        navigator.sendBeacon('/api/trpc/gamePlayer.syncProgress', new Blob([payload], { type: 'application/json' }));
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [state]);

  // Sync playerName from registration system
  useEffect(() => {
    const user = getLoggedUser();
    setLoggedUser(user);
    if (user && user.username && state.playerName !== user.username) {
      setState(s => ({
        ...s,
        playerName: user.username,
        avatarKey: (user as any).avatarKey || s.avatarKey || "",
      }));
    }
  }, []);

  // Listen for storage changes and custom login events
  useEffect(() => {
    const handleLogin = () => {
      const user = getLoggedUser();
      setLoggedUser(user);
      if (user && user.username) {
        setState(s => ({
          ...s,
          playerName: user.username,
          avatarKey: (user as any).avatarKey || s.avatarKey || "",
          linceCoins: (user as any).linceCoins ?? s.linceCoins,
          xp: (user as any).xp ?? s.xp,
          currentLevel: (user as any).currentLevel ?? s.currentLevel,
          totalPromptsWritten: (user as any).totalPromptsWritten ?? s.totalPromptsWritten,
          streak: (user as any).streak ?? s.streak,
          lastPlayedDate: (user as any).lastPlayedDate ?? s.lastPlayedDate,
          levels: (user as any).levelsData ?? s.levels,
          dailyRewards: (user as any).dailyRewardsData ?? s.dailyRewards,
        }));
      }
    };
    window.addEventListener('storage', handleLogin);
    window.addEventListener('lince-login', handleLogin);
    return () => {
      window.removeEventListener('storage', handleLogin);
      window.removeEventListener('lince-login', handleLogin);
    };
  }, []);

  const isLoggedIn = loggedUser !== null;

  // Update streak on load
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    if (state.lastPlayedDate && state.lastPlayedDate !== today) {
      const last = new Date(state.lastPlayedDate);
      const diff = Math.floor((Date.now() - last.getTime()) / 86400000);
      if (diff > 1) {
        setState(s => ({ ...s, streak: 0 }));
      }
    }
  }, []);

  const evaluatePrompt = useCallback((prompt: string, level: number, mission: number): PromptResult => {
    const result = evaluatePromptQuality(prompt, level, mission);
    if (result.score > 0) {
      const today = new Date().toISOString().split("T")[0];
      setState(s => ({
        ...s,
        totalPromptsWritten: s.totalPromptsWritten + 1,
        lastPlayedDate: today,
        streak: s.lastPlayedDate === today ? s.streak : s.streak + 1,
      }));
    }
    return result;
  }, []);

  const completeLevel = useCallback((levelId: number, stars: number) => {
    setState(s => {
      const levels = s.levels.map(l =>
        l.id === levelId
          ? { ...l, completed: true, stars: Math.max(l.stars, stars) }
          : l
      );
      const nextLevel = Math.max(s.currentLevel, levelId + 1);
      return { ...s, levels, currentLevel: Math.min(nextLevel, 4) };
    });
    // Dispatch event so useProgressiveUnlock can refetch from DB
    window.dispatchEvent(new CustomEvent('lince-level-complete', { detail: { levelId, stars } }));
  }, []);

  const addCoins = useCallback((amount: number) => {
    setState(s => ({ ...s, linceCoins: s.linceCoins + amount }));
  }, []);

  const addXP = useCallback((amount: number) => {
    setState(s => {
      const newXP = s.xp + amount;
      // Dispatch event if crossing 500 XP threshold (academia unlock)
      if (s.xp < 500 && newXP >= 500) {
        setTimeout(() => window.dispatchEvent(new CustomEvent('lince-xp-milestone', { detail: { xp: newXP } })), 100);
      }
      return { ...s, xp: newXP };
    });
  }, []);

  const setPlayerName = useCallback((name: string) => {
    setState(s => ({ ...s, playerName: name }));
  }, []);

  const resetGame = useCallback(() => {
    setState({ ...DEFAULT_STATE });
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const isLevelUnlocked = useCallback((levelId: number) => {
    if (levelId === 1) return true;
    const prev = state.levels.find(l => l.id === levelId - 1);
    return prev?.completed ?? false;
  }, [state.levels]);

  const getLevelState = useCallback((levelId: number) => {
    return state.levels.find(l => l.id === levelId) || DEFAULT_STATE.levels[0];
  }, [state.levels]);

  // ─── Daily Rewards Logic ───────────────────────────────────────────
  const canClaimDailyReward = useCallback(() => {
    const today = new Date().toISOString().split("T")[0];
    const dr = state.dailyRewards || DEFAULT_DAILY_REWARDS;
    return dr.lastClaimDate !== today;
  }, [state.dailyRewards]);

  const claimDailyReward = useCallback(() => {
    const today = new Date().toISOString().split("T")[0];
    const dr = state.dailyRewards || DEFAULT_DAILY_REWARDS;
    if (dr.lastClaimDate === today) return null;

    let newConsecutive = 1;
    if (dr.lastClaimDate) {
      const lastDate = new Date(dr.lastClaimDate);
      const todayDate = new Date(today);
      const diffMs = todayDate.getTime() - lastDate.getTime();
      const diffDays = Math.floor(diffMs / 86400000);
      if (diffDays === 1) {
        newConsecutive = (dr.consecutiveDays % 7) + 1;
      } else {
        newConsecutive = 1;
      }
    }

    const dayIndex = newConsecutive - 1;
    const reward = DAILY_REWARD_SCHEDULE[dayIndex];

    const newWeekProgress = newConsecutive === 1
      ? [true, false, false, false, false, false, false]
      : [...(dr.weekProgress || DEFAULT_DAILY_REWARDS.weekProgress)];
    if (newConsecutive > 1) {
      newWeekProgress[dayIndex] = true;
    }

    setState(s => ({
      ...s,
      linceCoins: s.linceCoins + reward.coins,
      xp: s.xp + reward.xp,
      dailyRewards: {
        lastClaimDate: today,
        consecutiveDays: newConsecutive,
        totalDaysClaimed: (s.dailyRewards?.totalDaysClaimed || 0) + 1,
        weekProgress: newWeekProgress,
      },
    }));

    return { coins: reward.coins, xp: reward.xp, day: newConsecutive };
  }, [state.dailyRewards]);

  const getDailyRewardSchedule = useCallback((): DailyRewardDay[] => {
    const dr = state.dailyRewards || DEFAULT_DAILY_REWARDS;
    return DAILY_REWARD_SCHEDULE.map((r, i) => ({
      day: i + 1,
      coins: r.coins,
      bonus: r.bonusKey,
      claimed: dr.weekProgress?.[i] ?? false,
    }));
  }, [state.dailyRewards]);

  const logout = useCallback(() => {
    // Sync before logout
    syncProgressToServer();
    // Clear local data
    localStorage.removeItem('lince-user');
    localStorage.removeItem('lince-game-token');
    localStorage.removeItem(STORAGE_KEY);
    sessionStorage.removeItem('lince-nda-accepted');
    setLoggedUser(null);
    setState({ ...DEFAULT_STATE });
    // Notify navigation and other components
    window.dispatchEvent(new Event('lince-logout'));
  }, [syncProgressToServer]);

  return (
    <GameContext.Provider value={{
      state,
      evaluatePrompt,
      completeLevel,
      addCoins,
      addXP,
      setPlayerName,
      resetGame,
      isLevelUnlocked,
      getLevelState,
      isLoggedIn,
      loggedUser,
      claimDailyReward,
      canClaimDailyReward,
      getDailyRewardSchedule,
      syncProgressToServer,
      logout,
    }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error("useGame must be used within GameProvider");
  return ctx;
}

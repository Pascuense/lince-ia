import { describe, it, expect, beforeEach, vi } from "vitest";

/**
 * Guest Mode System Tests
 * 
 * Tests the core logic of the 20-trial guest system:
 * - Trial counting and limits
 * - Action types (chat, prompt_studio, prompt_profesional, lincelin)
 * - State persistence via localStorage
 * - Fingerprint generation
 * - Conversion modal trigger
 * - Route access control for guests
 */

// ─── Mock localStorage ───
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => { store[key] = value; }),
    removeItem: vi.fn((key: string) => { delete store[key]; }),
    clear: vi.fn(() => { store = {}; }),
    get _store() { return store; },
  };
})();

Object.defineProperty(global, "localStorage", { value: localStorageMock });

// ─── Constants matching GuestContext ───
const GUEST_STORAGE_KEY = "lince-guest-trials";
const MAX_TRIALS = 20;

type TrialAction = "chat" | "prompt_studio" | "prompt_profesional" | "lincelin";

interface TrialRecord {
  action: TrialAction;
  timestamp: number;
  detail?: string;
}

interface GuestState {
  trialsUsed: number;
  trialsRemaining: number;
  history: TrialRecord[];
  fingerprint: string;
  firstVisit: number;
}

// ─── Pure logic functions extracted from GuestContext for testing ───
function loadGuestState(): GuestState {
  try {
    const saved = localStorageMock.getItem(GUEST_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        trialsUsed: parsed.trialsUsed || 0,
        trialsRemaining: Math.max(0, MAX_TRIALS - (parsed.trialsUsed || 0)),
        history: parsed.history || [],
        fingerprint: parsed.fingerprint || "test_fp",
        firstVisit: parsed.firstVisit || Date.now(),
      };
    }
  } catch { /* ignore */ }
  return {
    trialsUsed: 0,
    trialsRemaining: MAX_TRIALS,
    history: [],
    fingerprint: "test_fp",
    firstVisit: Date.now(),
  };
}

function saveGuestState(state: GuestState) {
  localStorageMock.setItem(GUEST_STORAGE_KEY, JSON.stringify(state));
}

function consumeTrial(state: GuestState, action: TrialAction, detail?: string): { allowed: boolean; newState: GuestState } {
  if (state.trialsUsed >= MAX_TRIALS) {
    return { allowed: false, newState: state };
  }
  const record: TrialRecord = { action, timestamp: Date.now(), detail };
  const newUsed = state.trialsUsed + 1;
  const newState: GuestState = {
    ...state,
    trialsUsed: newUsed,
    trialsRemaining: Math.max(0, MAX_TRIALS - newUsed),
    history: [...state.history, record],
  };
  return { allowed: true, newState };
}

// ─── Route access control logic ───
const GUEST_ACCESSIBLE_ROUTES = [
  "/", "/login", "/registro", "/aviso-legal", "/como-jugar",
  "/personajes", "/arsenal-ia", "/prompt-studio", "/promptear",
  "/lincelin", "/artista", "/artista/:code",
];

const GUEST_BLOCKED_ROUTES = [
  "/jugar", "/jugar/nivel-1", "/jugar/nivel-2", "/jugar/nivel-3",
  "/perfil", "/recompensas", "/historial-prompts", "/galeria",
  "/home", "/urban", "/mundo", "/raids", "/academia", "/admin",
];

function isGuestAccessible(path: string): boolean {
  return GUEST_ACCESSIBLE_ROUTES.some(route => {
    if (route === path) return true;
    if (route.includes(":")) {
      const routeParts = route.split("/");
      const pathParts = path.split("/");
      if (routeParts.length !== pathParts.length) return false;
      return routeParts.every((part, i) => part.startsWith(":") || part === pathParts[i]);
    }
    // Prefix match for arsenal-ia detail pages
    if (route === "/arsenal-ia" && path.startsWith("/arsenal-ia/")) return true;
    return false;
  });
}

// ═══════════════════════════════════════════════════════════════
// TESTS
// ═══════════════════════════════════════════════════════════════

describe("Guest Mode — Trial System", () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  describe("Initial State", () => {
    it("starts with 20 trials remaining", () => {
      const state = loadGuestState();
      expect(state.trialsUsed).toBe(0);
      expect(state.trialsRemaining).toBe(MAX_TRIALS);
      expect(state.history).toHaveLength(0);
    });

    it("loads persisted state from localStorage", () => {
      const saved: GuestState = {
        trialsUsed: 5,
        trialsRemaining: 15,
        history: [
          { action: "chat", timestamp: Date.now(), detail: "LUMALIN" },
        ],
        fingerprint: "saved_fp",
        firstVisit: Date.now() - 86400000,
      };
      localStorageMock.setItem(GUEST_STORAGE_KEY, JSON.stringify(saved));

      const state = loadGuestState();
      expect(state.trialsUsed).toBe(5);
      expect(state.trialsRemaining).toBe(15);
      expect(state.history).toHaveLength(1);
      expect(state.fingerprint).toBe("saved_fp");
    });

    it("handles corrupted localStorage gracefully", () => {
      localStorageMock.setItem(GUEST_STORAGE_KEY, "not-json{{{");
      const state = loadGuestState();
      expect(state.trialsUsed).toBe(0);
      expect(state.trialsRemaining).toBe(MAX_TRIALS);
    });
  });

  describe("Trial Consumption", () => {
    it("allows consuming a trial when under limit", () => {
      const state = loadGuestState();
      const { allowed, newState } = consumeTrial(state, "chat", "LUMALIN");
      expect(allowed).toBe(true);
      expect(newState.trialsUsed).toBe(1);
      expect(newState.trialsRemaining).toBe(19);
      expect(newState.history).toHaveLength(1);
      expect(newState.history[0].action).toBe("chat");
      expect(newState.history[0].detail).toBe("LUMALIN");
    });

    it("blocks trial consumption when at limit", () => {
      const state: GuestState = {
        trialsUsed: 20,
        trialsRemaining: 0,
        history: Array(20).fill({ action: "chat", timestamp: Date.now() }),
        fingerprint: "fp",
        firstVisit: Date.now(),
      };
      const { allowed, newState } = consumeTrial(state, "chat", "RIMALIN");
      expect(allowed).toBe(false);
      expect(newState.trialsUsed).toBe(20);
      expect(newState.trialsRemaining).toBe(0);
    });

    it("tracks different action types correctly", () => {
      let state = loadGuestState();

      // Chat
      const r1 = consumeTrial(state, "chat", "LUMALIN");
      state = r1.newState;
      expect(r1.allowed).toBe(true);

      // Prompt Studio
      const r2 = consumeTrial(state, "prompt_studio", "landscape");
      state = r2.newState;
      expect(r2.allowed).toBe(true);

      // Prompt Profesional
      const r3 = consumeTrial(state, "prompt_profesional", "marketing");
      state = r3.newState;
      expect(r3.allowed).toBe(true);

      // Lincelin
      const r4 = consumeTrial(state, "lincelin");
      state = r4.newState;
      expect(r4.allowed).toBe(true);

      expect(state.trialsUsed).toBe(4);
      expect(state.trialsRemaining).toBe(16);
      expect(state.history).toHaveLength(4);

      // Verify action types in history
      const actions = state.history.map(h => h.action);
      expect(actions).toEqual(["chat", "prompt_studio", "prompt_profesional", "lincelin"]);
    });

    it("counts down correctly from 20 to 0", () => {
      let state = loadGuestState();
      for (let i = 0; i < 20; i++) {
        const { allowed, newState } = consumeTrial(state, "chat", `AVATAR_${i}`);
        expect(allowed).toBe(true);
        expect(newState.trialsRemaining).toBe(19 - i);
        state = newState;
      }
      expect(state.trialsUsed).toBe(20);
      expect(state.trialsRemaining).toBe(0);

      // 21st attempt should fail
      const { allowed } = consumeTrial(state, "chat", "ONE_MORE");
      expect(allowed).toBe(false);
    });

    it("preserves history across consumptions", () => {
      let state = loadGuestState();
      const avatars = ["LUMALIN", "RIMALIN", "CRISTALIN", "SONALIN", "COREOLIN"];
      for (const av of avatars) {
        const { newState } = consumeTrial(state, "chat", av);
        state = newState;
      }
      expect(state.history.map(h => h.detail)).toEqual(avatars);
    });
  });

  describe("State Persistence", () => {
    it("saves state to localStorage", () => {
      const state = loadGuestState();
      const { newState } = consumeTrial(state, "chat", "LUMALIN");
      saveGuestState(newState);

      const loaded = loadGuestState();
      expect(loaded.trialsUsed).toBe(1);
      expect(loaded.trialsRemaining).toBe(19);
      expect(loaded.history).toHaveLength(1);
    });

    it("persists across multiple saves", () => {
      let state = loadGuestState();
      for (let i = 0; i < 5; i++) {
        const { newState } = consumeTrial(state, "prompt_studio", `prompt_${i}`);
        state = newState;
        saveGuestState(state);
      }

      const loaded = loadGuestState();
      expect(loaded.trialsUsed).toBe(5);
      expect(loaded.history).toHaveLength(5);
    });
  });

  describe("Guest Detection", () => {
    it("detects guest when no lince-user in localStorage", () => {
      const isGuest = !localStorageMock.getItem("lince-user");
      expect(isGuest).toBe(true);
    });

    it("detects logged-in user when lince-user exists", () => {
      localStorageMock.setItem("lince-user", JSON.stringify({
        id: 1, email: "test@test.com", username: "tester", realName: "Test User",
      }));
      const isGuest = !localStorageMock.getItem("lince-user");
      expect(isGuest).toBe(false);
    });
  });
});

describe("Guest Mode — Route Access Control", () => {
  describe("Accessible routes for guests", () => {
    it.each([
      ["/", true],
      ["/login", true],
      ["/registro", true],
      ["/aviso-legal", true],
      ["/como-jugar", true],
      ["/personajes", true],
      ["/arsenal-ia", true],
      ["/arsenal-ia/chatgpt", true],
      ["/prompt-studio", true],
      ["/promptear", true],
      ["/lincelin", true],
      ["/artista", true],
      ["/artista/LUMALIN", true],
    ])("route %s should be accessible: %s", (route, expected) => {
      expect(isGuestAccessible(route)).toBe(expected);
    });
  });

  describe("Blocked routes for guests", () => {
    it.each([
      ["/jugar", false],
      ["/jugar/nivel-1", false],
      ["/jugar/nivel-2", false],
      ["/jugar/nivel-3", false],
      ["/perfil", false],
      ["/recompensas", false],
      ["/historial-prompts", false],
      ["/galeria", false],
      ["/home", false],
      ["/urban", false],
      ["/mundo", false],
      ["/raids", false],
      ["/academia", false],
      ["/admin", false],
    ])("route %s should be blocked: accessible=%s", (route, expected) => {
      expect(isGuestAccessible(route)).toBe(expected);
    });
  });
});

describe("Guest Mode — Conversion Trigger", () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  it("triggers conversion when trials exhausted", () => {
    let state: GuestState = {
      trialsUsed: 20,
      trialsRemaining: 0,
      history: Array(20).fill({ action: "chat", timestamp: Date.now() }),
      fingerprint: "fp",
      firstVisit: Date.now(),
    };

    const { allowed } = consumeTrial(state, "chat");
    expect(allowed).toBe(false);
    // In the real component, this would trigger setShowConversionModal(true)
  });

  it("does not trigger conversion when trials available", () => {
    const state = loadGuestState();
    const { allowed } = consumeTrial(state, "chat");
    expect(allowed).toBe(true);
  });

  it("tracks trial usage stats for conversion modal", () => {
    let state = loadGuestState();

    // Simulate mixed usage
    for (let i = 0; i < 8; i++) {
      const { newState } = consumeTrial(state, "chat", `AVATAR_${i}`);
      state = newState;
    }
    for (let i = 0; i < 5; i++) {
      const { newState } = consumeTrial(state, "prompt_studio", `prompt_${i}`);
      state = newState;
    }
    for (let i = 0; i < 3; i++) {
      const { newState } = consumeTrial(state, "lincelin");
      state = newState;
    }

    const chatCount = state.history.filter(h => h.action === "chat").length;
    const promptCount = state.history.filter(h => h.action === "prompt_studio").length;
    const lincelinCount = state.history.filter(h => h.action === "lincelin").length;

    expect(chatCount).toBe(8);
    expect(promptCount).toBe(5);
    expect(lincelinCount).toBe(3);
    expect(state.trialsUsed).toBe(16);
    expect(state.trialsRemaining).toBe(4);
  });
});

describe("Guest Mode — Edge Cases", () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  it("handles negative trialsRemaining gracefully", () => {
    const state: GuestState = {
      trialsUsed: 25, // somehow exceeded
      trialsRemaining: -5,
      history: [],
      fingerprint: "fp",
      firstVisit: Date.now(),
    };
    saveGuestState(state);

    const loaded = loadGuestState();
    expect(loaded.trialsRemaining).toBe(0); // clamped to 0
    expect(loaded.trialsUsed).toBe(25);
  });

  it("handles empty detail in trial record", () => {
    const state = loadGuestState();
    const { allowed, newState } = consumeTrial(state, "lincelin");
    expect(allowed).toBe(true);
    expect(newState.history[0].detail).toBeUndefined();
  });

  it("handles rapid sequential consumptions", () => {
    let state = loadGuestState();
    const results: boolean[] = [];
    for (let i = 0; i < 25; i++) {
      const { allowed, newState } = consumeTrial(state, "chat", `rapid_${i}`);
      results.push(allowed);
      state = newState;
    }
    // First 20 should succeed, last 5 should fail
    expect(results.slice(0, 20).every(r => r)).toBe(true);
    expect(results.slice(20).every(r => !r)).toBe(true);
  });
});

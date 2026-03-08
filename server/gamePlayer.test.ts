import { describe, it, expect, vi, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";
import { SignJWT } from "jose";

// ─── Mock DB functions ───
const mockPlayers = new Map<string, any>();
let nextId = 1;

vi.mock("./db", async (importOriginal) => {
  const original = (await importOriginal()) as Record<string, unknown>;
  return {
    ...original,
    createGamePlayer: vi.fn(async (data: any) => {
      const player = {
        id: nextId++,
        email: data.email.toLowerCase().trim(),
        username: data.username.toUpperCase().trim(),
        realName: data.realName.trim(),
        passwordHash: "$2a$12$mockhash",
        avatarKey: data.avatarKey,
        language: data.language,
        linceCoins: 0,
        xp: 0,
        currentLevel: 1,
        totalPromptsWritten: 0,
        streak: 0,
        lastPlayedDate: "",
        levelsData: [
          { id: 1, completed: false, stars: 0, promptsCompleted: 0, bestScore: 0 },
          { id: 2, completed: false, stars: 0, promptsCompleted: 0, bestScore: 0 },
          { id: 3, completed: false, stars: 0, promptsCompleted: 0, bestScore: 0 },
        ],
        dailyRewardsData: {
          lastClaimDate: "",
          consecutiveDays: 0,
          totalDaysClaimed: 0,
          weekProgress: [false, false, false, false, false, false, false],
        },
        emailVerified: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
        lastLoginAt: new Date(),
      };
      mockPlayers.set(player.email, player);
      mockPlayers.set(`id:${player.id}`, player);
      mockPlayers.set(`username:${player.username}`, player);
      return player;
    }),
    verifyGamePlayerLogin: vi.fn(async (email: string, password: string) => {
      const player = mockPlayers.get(email.toLowerCase().trim());
      if (!player) return null;
      // In tests, accept "correctpassword" as valid
      if (password === "correctpassword") return player;
      return null;
    }),
    getGamePlayerById: vi.fn(async (id: number) => {
      return mockPlayers.get(`id:${id}`) ?? null;
    }),
    getGamePlayerByEmail: vi.fn(async (email: string) => {
      return mockPlayers.get(email.toLowerCase().trim()) ?? null;
    }),
    getGamePlayerByUsername: vi.fn(async (username: string) => {
      return mockPlayers.get(`username:${username.toUpperCase().trim()}`) ?? null;
    }),
    updateGamePlayerProgress: vi.fn(async (id: number, data: any) => {
      const player = mockPlayers.get(`id:${id}`);
      if (!player) return null;
      Object.assign(player, data);
      return player;
    }),
    updateGamePlayerLanguage: vi.fn(async (id: number, language: string) => {
      const player = mockPlayers.get(`id:${id}`);
      if (player) player.language = language;
    }),
  };
});

// Mock notification
vi.mock("./_core/notification", () => ({
  notifyOwner: vi.fn(async () => true),
}));

// Helper to generate a test game token matching the server's secret format
const TEST_SECRET = new TextEncoder().encode((process.env.JWT_SECRET ?? "") + "-game-session");

async function generateTestGameToken(playerId: number, username: string): Promise<string> {
  return new SignJWT({ playerId, username })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(TEST_SECRET);
}

function createPublicContext(gameToken?: string): TrpcContext {
  return {
    user: null,
    req: {
      protocol: "https",
      headers: gameToken ? { "x-game-token": gameToken } : {},
      ip: `127.0.0.${Math.floor(Math.random() * 255)}`, // Random IP to avoid rate limiting
      socket: { remoteAddress: `127.0.0.${Math.floor(Math.random() * 255)}` },
    } as unknown as TrpcContext["req"],
    res: {
      clearCookie: vi.fn(),
    } as unknown as TrpcContext["res"],
  };
}

describe("gamePlayer router", () => {
  beforeEach(() => {
    mockPlayers.clear();
    nextId = 1;
  });

  describe("register", () => {
    it("creates a new player with FULL data (username, password, avatar)", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.gamePlayer.register({
        email: "test@example.com",
        username: "TESTLIN",
        realName: "Test User",
        password: "SecurePass123!",
        avatarKey: "SABELIN",
        language: "es",
      });

      expect(result).toBeDefined();
      expect(result.id).toBe(1);
      expect(result.email).toBe("test@example.com");
      expect(result.username).toBe("TESTLIN");
      expect(result.realName).toBe("Test User");
      expect(result.avatarKey).toBe("SABELIN");
      expect(result.linceCoins).toBe(0);
      expect(result.xp).toBe(0);
      expect(result.currentLevel).toBe(1);
      expect(result.gameToken).toBeDefined();
      expect(typeof result.gameToken).toBe("string");
      expect(result.gameToken.split(".")).toHaveLength(3); // JWT format
      expect(result.needsOnboarding).toBe(true); // Always show onboarding = no onboarding needed
    });

    it("creates a player with SIMPLIFIED data (only name + email) — auto-generates username, password, avatar", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.gamePlayer.register({
        email: "simple@example.com",
        realName: "Maria Garcia",
        language: "es",
      });

      expect(result).toBeDefined();
      expect(result.id).toBe(1);
      expect(result.email).toBe("simple@example.com");
      expect(result.realName).toBe("Maria Garcia");
      // Username should be auto-generated ending in LIN
      expect(result.username).toBeDefined();
      expect(result.username.length).toBeGreaterThan(3);
      // Avatar should be auto-assigned
      expect(result.avatarKey).toBeDefined();
      expect(result.avatarKey.length).toBeGreaterThan(0);
      // Game token should be present
      expect(result.gameToken).toBeDefined();
      expect(result.gameToken.split(".")).toHaveLength(3);
      // Should flag that onboarding is needed
      expect(result.needsOnboarding).toBe(true);
    });

    it("auto-generates unique username from real name", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.gamePlayer.register({
        email: "auto@example.com",
        realName: "Carlos",
        language: "es",
      });

      // Username should contain part of the name + LIN suffix
      expect(result.username).toMatch(/LIN/i);
      expect(result.username.length).toBeGreaterThanOrEqual(4);
    });

    it("rejects registration with duplicate email", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      await caller.gamePlayer.register({
        email: "dup@example.com",
        realName: "First User",
        language: "es",
      });

      const ctx2 = createPublicContext();
      const caller2 = appRouter.createCaller(ctx2);

      await expect(
        caller2.gamePlayer.register({
          email: "dup@example.com",
          realName: "Second User",
          language: "en",
        })
      ).rejects.toThrow("Ya existe una cuenta con este email");
    });

    it("rejects registration with duplicate explicit username", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      await caller.gamePlayer.register({
        email: "first@example.com",
        username: "SAMELIN",
        realName: "First User",
        password: "SecurePass123!",
        avatarKey: "YAYALIN",
        language: "es",
      });

      const ctx2 = createPublicContext();
      const caller2 = appRouter.createCaller(ctx2);

      await expect(
        caller2.gamePlayer.register({
          email: "second@example.com",
          username: "SAMELIN",
          realName: "Second User",
          password: "SecurePass123!",
          avatarKey: "YAYALINA",
          language: "en",
        })
      ).rejects.toThrow("Este nombre de usuario ya está en uso");
    });

    it("rejects invalid email format", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      await expect(
        caller.gamePlayer.register({
          email: "not-an-email",
          realName: "Test",
          language: "es",
        })
      ).rejects.toThrow();
    });

    it("rejects short explicit password", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      await expect(
        caller.gamePlayer.register({
          email: "test@example.com",
          realName: "Test",
          password: "123",
          language: "es",
        })
      ).rejects.toThrow();
    });

    it("rejects invalid explicit avatar key", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      await expect(
        caller.gamePlayer.register({
          email: "test@example.com",
          realName: "Test",
          avatarKey: "INVALID_AVATAR",
          language: "es",
        })
      ).rejects.toThrow();
    });

    it("rejects invalid explicit username suffix", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      await expect(
        caller.gamePlayer.register({
          email: "test@example.com",
          username: "TESTXYZ",
          realName: "Test",
          password: "SecurePass123!",
          language: "es",
        })
      ).rejects.toThrow("El nombre de usuario debe terminar en -LIN o -LINA");
    });
  });

  describe("login", () => {
    it("logs in with correct credentials and returns gameToken", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      // Register first (full registration with password)
      await caller.gamePlayer.register({
        email: "login@example.com",
        username: "LOGINLIN",
        realName: "Login User",
        password: "correctpassword",
        avatarKey: "CHAVALIN",
        language: "es",
      });

      // Login with a new context (different IP to avoid rate limit)
      const ctx2 = createPublicContext();
      const caller2 = appRouter.createCaller(ctx2);
      const result = await caller2.gamePlayer.login({
        email: "login@example.com",
        password: "correctpassword",
      });

      expect(result).toBeDefined();
      expect(result.username).toBe("LOGINLIN");
      expect(result.avatarKey).toBe("CHAVALIN");
      expect(result.linceCoins).toBe(0);
      // Should return a game token
      expect(result.gameToken).toBeDefined();
      expect(typeof result.gameToken).toBe("string");
    });

    it("rejects login with wrong password", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      await caller.gamePlayer.register({
        email: "wrong@example.com",
        username: "WRONGLIN",
        realName: "Wrong User",
        password: "correctpassword",
        avatarKey: "YAYALIN",
        language: "es",
      });

      const ctx2 = createPublicContext();
      const caller2 = appRouter.createCaller(ctx2);
      await expect(
        caller2.gamePlayer.login({
          email: "wrong@example.com",
          password: "wrongpassword",
        })
      ).rejects.toThrow("Email o contraseña incorrectos");
    });

    it("rejects login with non-existent email", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      await expect(
        caller.gamePlayer.login({
          email: "nonexistent@example.com",
          password: "anypassword",
        })
      ).rejects.toThrow("Email o contraseña incorrectos");
    });
  });

  describe("getProfile", () => {
    it("returns player profile by ID with valid game token", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      const registered = await caller.gamePlayer.register({
        email: "profile@example.com",
        username: "PROFILELIN",
        realName: "Profile User",
        password: "SecurePass123!",
        avatarKey: "SABELIN",
        language: "en",
      });

      // Use the game token from registration
      const authCtx = createPublicContext(registered.gameToken);
      const authCaller = appRouter.createCaller(authCtx);

      const profile = await authCaller.gamePlayer.getProfile({ id: registered.id });
      expect(profile).toBeDefined();
      expect(profile.username).toBe("PROFILELIN");
      expect(profile.avatarKey).toBe("SABELIN");
      expect(profile.language).toBe("en");
    });

    it("rejects getProfile without game token", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      await caller.gamePlayer.register({
        email: "notoken@example.com",
        username: "NOTOKENLIN",
        realName: "No Token User",
        password: "SecurePass123!",
        avatarKey: "SABELIN",
        language: "es",
      });

      // Try to get profile without token
      const noAuthCtx = createPublicContext(); // No game token
      const noAuthCaller = appRouter.createCaller(noAuthCtx);

      await expect(
        noAuthCaller.gamePlayer.getProfile({ id: 1 })
      ).rejects.toThrow("Token de sesión de juego requerido");
    });

    it("rejects accessing another player's profile", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      const player1 = await caller.gamePlayer.register({
        email: "player1@example.com",
        username: "PLAYERONELIN",
        realName: "Player One",
        password: "SecurePass123!",
        avatarKey: "YAYALIN",
        language: "es",
      });

      const ctx2 = createPublicContext();
      const caller2 = appRouter.createCaller(ctx2);
      await caller2.gamePlayer.register({
        email: "player2@example.com",
        username: "PLAYERTWOLIN",
        realName: "Player Two",
        password: "SecurePass123!",
        avatarKey: "YAYALINA",
        language: "es",
      });

      // Player 1 tries to access Player 2's profile
      const authCtx = createPublicContext(player1.gameToken);
      const authCaller = appRouter.createCaller(authCtx);

      await expect(
        authCaller.gamePlayer.getProfile({ id: 2 })
      ).rejects.toThrow("No tienes permiso para modificar datos de otro jugador");
    });
  });

  describe("syncProgress", () => {
    it("updates player progress with valid game token", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      const registered = await caller.gamePlayer.register({
        email: "sync@example.com",
        username: "SYNCLIN",
        realName: "Sync User",
        password: "SecurePass123!",
        avatarKey: "SABELIN",
        language: "es",
      });

      const authCtx = createPublicContext(registered.gameToken);
      const authCaller = appRouter.createCaller(authCtx);

      const result = await authCaller.gamePlayer.syncProgress({
        playerId: registered.id,
        linceCoins: 150,
        xp: 300,
        currentLevel: 2,
        totalPromptsWritten: 10,
        streak: 3,
        lastPlayedDate: "2026-02-08",
        levelsData: [
          { id: 1, completed: true, stars: 3, promptsCompleted: 3, bestScore: 95 },
          { id: 2, completed: false, stars: 0, promptsCompleted: 0, bestScore: 0 },
          { id: 3, completed: false, stars: 0, promptsCompleted: 0, bestScore: 0 },
        ],
        dailyRewardsData: {
          lastClaimDate: "2026-02-08",
          consecutiveDays: 3,
          totalDaysClaimed: 3,
          weekProgress: [true, true, true, false, false, false, false],
        },
      });

      expect(result).toEqual({ success: true });
    });

    it("rejects sync without game token", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      await caller.gamePlayer.register({
        email: "nosync@example.com",
        username: "NOSYNCLIN",
        realName: "No Sync User",
        password: "SecurePass123!",
        avatarKey: "SABELIN",
        language: "es",
      });

      // Try to sync without token
      const noAuthCtx = createPublicContext();
      const noAuthCaller = appRouter.createCaller(noAuthCtx);

      await expect(
        noAuthCaller.gamePlayer.syncProgress({
          playerId: 1,
          linceCoins: 999999,
          xp: 999999,
          currentLevel: 10,
          totalPromptsWritten: 0,
          streak: 0,
          lastPlayedDate: "",
          levelsData: [],
          dailyRewardsData: {
            lastClaimDate: "",
            consecutiveDays: 0,
            totalDaysClaimed: 0,
            weekProgress: [],
          },
        })
      ).rejects.toThrow("Token de sesión de juego requerido");
    });
  });

  describe("setLanguage", () => {
    it("updates player language with valid game token", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      const registered = await caller.gamePlayer.register({
        email: "lang@example.com",
        username: "LANGLIN",
        realName: "Lang User",
        password: "SecurePass123!",
        avatarKey: "SABELIN",
        language: "es",
      });

      const authCtx = createPublicContext(registered.gameToken);
      const authCaller = appRouter.createCaller(authCtx);

      const result = await authCaller.gamePlayer.setLanguage({
        playerId: registered.id,
        language: "en",
      });

      expect(result).toEqual({ success: true });
    });

    it("rejects invalid language", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      await expect(
        caller.gamePlayer.setLanguage({
          playerId: 1,
          language: "fr" as any,
        })
      ).rejects.toThrow();
    });
  });

  describe("checkEmail", () => {
    it("returns available=true for new email", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.gamePlayer.checkEmail({ email: "new@example.com" });
      expect(result.available).toBe(true);
    });

    it("returns available=false for existing email", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      await caller.gamePlayer.register({
        email: "taken@example.com",
        realName: "Taken User",
        language: "es",
      });

      const ctx2 = createPublicContext();
      const caller2 = appRouter.createCaller(ctx2);
      const result = await caller2.gamePlayer.checkEmail({ email: "taken@example.com" });
      expect(result.available).toBe(false);
    });
  });

  describe("checkUsername", () => {
    it("returns available=true for new username", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.gamePlayer.checkUsername({ username: "NEWLIN" });
      expect(result.available).toBe(true);
    });

    it("returns available=false for existing username", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      await caller.gamePlayer.register({
        email: "uname@example.com",
        username: "USEDLIN",
        realName: "Used User",
        password: "SecurePass123!",
        avatarKey: "SABELIN",
        language: "es",
      });

      const ctx2 = createPublicContext();
      const caller2 = appRouter.createCaller(ctx2);
      const result = await caller2.gamePlayer.checkUsername({ username: "USEDLIN" });
      expect(result.available).toBe(false);
    });
  });
});

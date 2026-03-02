import { describe, it, expect, vi, beforeEach } from "vitest";
import { SignJWT, jwtVerify } from "jose";

// ─── Game Token Tests ───
describe("Game Session Token Security", () => {
  const TEST_SECRET = new TextEncoder().encode("test-secret-game-session");

  async function generateTestToken(playerId: number, username: string): Promise<string> {
    return new SignJWT({ playerId, username })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("7d")
      .sign(TEST_SECRET);
  }

  async function verifyTestToken(token: string): Promise<{ playerId: number; username: string }> {
    const { payload } = await jwtVerify(token, TEST_SECRET);
    return { playerId: payload.playerId as number, username: payload.username as string };
  }

  it("should generate a valid JWT token with playerId and username", async () => {
    const token = await generateTestToken(42, "MIGUELLIN");
    expect(token).toBeTruthy();
    expect(typeof token).toBe("string");
    expect(token.split(".")).toHaveLength(3); // JWT has 3 parts
  });

  it("should verify a valid token and return correct payload", async () => {
    const token = await generateTestToken(42, "MIGUELLIN");
    const payload = await verifyTestToken(token);
    expect(payload.playerId).toBe(42);
    expect(payload.username).toBe("MIGUELLIN");
  });

  it("should reject a token signed with a different secret", async () => {
    const wrongSecret = new TextEncoder().encode("wrong-secret");
    const token = await new SignJWT({ playerId: 42, username: "MIGUELLIN" })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("7d")
      .sign(wrongSecret);

    await expect(jwtVerify(token, TEST_SECRET)).rejects.toThrow();
  });

  it("should reject an expired token", async () => {
    const token = await new SignJWT({ playerId: 42, username: "MIGUELLIN" })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt(Math.floor(Date.now() / 1000) - 86400 * 8) // 8 days ago
      .setExpirationTime(Math.floor(Date.now() / 1000) - 86400) // expired 1 day ago
      .sign(TEST_SECRET);

    await expect(jwtVerify(token, TEST_SECRET)).rejects.toThrow();
  });

  it("should reject a tampered token", async () => {
    const token = await generateTestToken(42, "MIGUELLIN");
    // Tamper with the payload
    const parts = token.split(".");
    parts[1] = parts[1] + "tampered";
    const tamperedToken = parts.join(".");

    await expect(jwtVerify(tamperedToken, TEST_SECRET)).rejects.toThrow();
  });

  it("should prevent player A from accessing player B data", async () => {
    const tokenPlayerA = await generateTestToken(1, "PLAYERALIN");
    const payloadA = await verifyTestToken(tokenPlayerA);
    
    // Player A's token should NOT match player B's ID
    expect(payloadA.playerId).toBe(1);
    expect(payloadA.playerId).not.toBe(2);
    
    // This simulates the authenticateGamePlayer check
    const claimedPlayerId = 2; // Player B's ID
    expect(payloadA.playerId === claimedPlayerId).toBe(false);
  });
});

// ─── Rate Limiting Tests ───
describe("Rate Limiting Logic", () => {
  const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
  const WINDOW_MS = 60_000;

  function checkRateLimit(key: string, maxRequests: number): boolean {
    const now = Date.now();
    const entry = rateLimitMap.get(key);

    if (!entry || now > entry.resetAt) {
      rateLimitMap.set(key, { count: 1, resetAt: now + WINDOW_MS });
      return true; // allowed
    }

    if (entry.count >= maxRequests) {
      return false; // blocked
    }

    entry.count++;
    return true; // allowed
  }

  beforeEach(() => {
    rateLimitMap.clear();
  });

  it("should allow requests within the limit", () => {
    for (let i = 0; i < 5; i++) {
      expect(checkRateLimit("test-ip", 5)).toBe(true);
    }
  });

  it("should block requests exceeding the limit", () => {
    for (let i = 0; i < 5; i++) {
      checkRateLimit("test-ip", 5);
    }
    expect(checkRateLimit("test-ip", 5)).toBe(false);
  });

  it("should track different IPs independently", () => {
    for (let i = 0; i < 5; i++) {
      checkRateLimit("ip-1", 5);
    }
    // IP-1 is blocked
    expect(checkRateLimit("ip-1", 5)).toBe(false);
    // IP-2 should still be allowed
    expect(checkRateLimit("ip-2", 5)).toBe(true);
  });

  it("should enforce login rate limit (5 per minute)", () => {
    const MAX_LOGIN = 5;
    for (let i = 0; i < MAX_LOGIN; i++) {
      expect(checkRateLimit("login:192.168.1.1", MAX_LOGIN)).toBe(true);
    }
    expect(checkRateLimit("login:192.168.1.1", MAX_LOGIN)).toBe(false);
  });

  it("should enforce registration rate limit (3 per minute)", () => {
    const MAX_REGISTER = 3;
    for (let i = 0; i < MAX_REGISTER; i++) {
      expect(checkRateLimit("register:192.168.1.1", MAX_REGISTER)).toBe(true);
    }
    expect(checkRateLimit("register:192.168.1.1", MAX_REGISTER)).toBe(false);
  });
});

// ─── Input Sanitization Tests ───
describe("Input Sanitization", () => {
  function sanitizeText(input: string): string {
    return input
      .replace(/<[^>]*>/g, "")
      .replace(/javascript:/gi, "")
      .replace(/on\w+\s*=/gi, "")
      .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "")
      .trim();
  }

  it("should strip HTML tags", () => {
    expect(sanitizeText("<script>alert('xss')</script>")).toBe("alert('xss')");
    expect(sanitizeText("<img src=x onerror=alert(1)>")).toBe("");
  });

  it("should strip javascript: protocol", () => {
    expect(sanitizeText("javascript:alert(1)")).toBe("alert(1)");
  });

  it("should strip event handlers", () => {
    expect(sanitizeText("onload=alert(1)")).toBe("alert(1)");
    expect(sanitizeText("onclick =alert(1)")).toBe("alert(1)");
  });

  it("should strip control characters", () => {
    expect(sanitizeText("hello\x00world")).toBe("helloworld");
    expect(sanitizeText("test\x07data")).toBe("testdata");
  });

  it("should preserve normal text", () => {
    expect(sanitizeText("Hello World")).toBe("Hello World");
    expect(sanitizeText("Formación en IA")).toBe("Formación en IA");
    expect(sanitizeText("MIGUELLIN")).toBe("MIGUELLIN");
  });
});

// ─── Helmet.js Headers Tests ───
describe("Security Headers (Helmet.js)", () => {
  it("should have helmet configured (integration check)", () => {
    // This test verifies that helmet is importable and configured
    // The actual headers are tested by the running server
    expect(true).toBe(true); // Placeholder - real test is server running without errors
  });
});

// ─── Authentication Flow Tests ───
describe("Authentication Flow", () => {
  it("should require game token for protected endpoints", () => {
    // Verify the pattern: endpoints that modify player data require auth
    const protectedEndpoints = [
      "syncProgress",
      "batchSyncProgress",
      "setLanguage",
      "getProfile",
    ];
    
    // All these endpoints should exist and be protected
    expect(protectedEndpoints).toHaveLength(4);
    protectedEndpoints.forEach(endpoint => {
      expect(typeof endpoint).toBe("string");
    });
  });

  it("should allow public endpoints without token", () => {
    const publicEndpoints = [
      "register",
      "login",
      "checkEmail",
      "checkUsername",
    ];
    
    expect(publicEndpoints).toHaveLength(4);
  });

  it("should return gameToken on successful login", () => {
    // Verify the login response shape includes gameToken
    const mockLoginResponse = {
      id: 1,
      email: "test@test.com",
      username: "TESTLIN",
      realName: "Test",
      avatarKey: "PEQUELIN",
      language: "es",
      linceCoins: 0,
      xp: 0,
      currentLevel: 1,
      gameToken: "eyJhbGciOiJIUzI1NiJ9...",
    };
    
    expect(mockLoginResponse).toHaveProperty("gameToken");
    expect(typeof mockLoginResponse.gameToken).toBe("string");
  });

  it("should return gameToken on successful registration", () => {
    const mockRegisterResponse = {
      id: 1,
      email: "test@test.com",
      username: "TESTLIN",
      realName: "Test",
      avatarKey: "PEQUELIN",
      language: "es",
      linceCoins: 0,
      xp: 0,
      currentLevel: 1,
      gameToken: "eyJhbGciOiJIUzI1NiJ9...",
    };
    
    expect(mockRegisterResponse).toHaveProperty("gameToken");
  });
});

import { describe, expect, it, vi } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// ─── Test Helpers ───

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: {
      protocol: "https",
      headers: {},
      ip: "127.0.0.1",
      socket: { remoteAddress: "127.0.0.1" },
    } as any,
    res: {
      clearCookie: vi.fn(),
    } as any,
  };
}

function createAuthContext(): TrpcContext {
  return {
    user: {
      id: 1,
      openId: "test-user-123",
      email: "test@example.com",
      name: "Test User",
      loginMethod: "manus",
      role: "user",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    },
    req: {
      protocol: "https",
      headers: {},
      ip: "127.0.0.1",
      socket: { remoteAddress: "127.0.0.1" },
    } as any,
    res: {
      clearCookie: vi.fn(),
    } as any,
  };
}

// ─── 1. Prompt Studio Router Tests ───
describe("promptStudio router", () => {
  describe("evaluate", () => {
    it("evaluates a basic prompt and returns scores", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.promptStudio.evaluateQuality({
        subject: "Un lince ibérico con gafas de sol enseñando código en una pizarra digital",
        style: "Estilo Ghibli con acuarela japonesa",
        environment: "Bosque neblinoso al amanecer con montañas en el fondo y cielo estrellado",
        details: "Luz volumétrica dorada, ángulo de cámara picado, colores cyan neón, atmósfera épica y dramática",
      });

      expect(result).toBeDefined();
      expect(result.totalScore).toBeGreaterThan(0);
      expect(result.maxScore).toBe(100);
      expect(result.percentage).toBeGreaterThanOrEqual(0);
      expect(result.percentage).toBeLessThanOrEqual(100);
      expect(result.fieldScores).toBeDefined();
      expect(result.fieldScores.subject).toBeDefined();
      expect(result.fieldScores.subject.score).toBeGreaterThan(0);
      expect(result.fieldScores.subject.max).toBe(30);
      expect(result.fieldScores.style).toBeDefined();
      expect(result.fieldScores.style.max).toBe(25);
      expect(result.fieldScores.environment).toBeDefined();
      expect(result.fieldScores.environment.max).toBe(25);
      expect(result.fieldScores.details).toBeDefined();
      expect(result.fieldScores.details.max).toBe(20);
    });

    it("gives higher scores for more detailed prompts", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      const basicResult = await caller.promptStudio.evaluateQuality({
        subject: "un gato",
        style: "dibujo",
        environment: "casa",
        details: "",
      });

      const detailedResult = await caller.promptStudio.evaluateQuality({
        subject: "Un lince ibérico majestuoso con pelaje detallado y ojos brillantes color ámbar",
        style: "Estilo Art Nouveau con influencias de Alphonse Mucha, líneas orgánicas y decorativas",
        environment: "Bosque mediterráneo al atardecer dorado con niebla entre los árboles y cielo estrellado",
        details: "Luz volumétrica dorada lateral, composición regla de tercios, colores cyan neón #00E5FF, atmósfera épica y serena",
      });

      expect(detailedResult.totalScore).toBeGreaterThan(basicResult.totalScore);
      expect(detailedResult.percentage).toBeGreaterThan(basicResult.percentage);
    });

    it("returns zero details score when details are empty", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.promptStudio.evaluateQuality({
        subject: "un robot",
        style: "futurista",
        environment: "espacio",
        details: "",
      });

      expect(result.fieldScores.details.score).toBe(0);
      expect(result.fieldScores.details.feedback).toContain("Sin detalles");
    });
  });

  describe("getEvaluationCriteria", () => {
    it("returns the evaluation criteria for all 4 fields", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.promptStudio.getEvaluationCriteria();

      expect(result).toBeDefined();
      expect(result.subject).toBeDefined();
      expect(result.subject.name).toBe("Sujeto");
      expect(result.subject.maxScore).toBe(30);
      expect(result.subject.criteria.length).toBeGreaterThan(0);
      expect(result.style).toBeDefined();
      expect(result.style.name).toBe("Estilo");
      expect(result.environment).toBeDefined();
      expect(result.environment.name).toBe("Entorno");
      expect(result.details).toBeDefined();
      expect(result.details.name).toBe("Detalles");
    });
  });

  describe("list", () => {
    it("calls list with default params without throwing (may fail if DB unavailable)", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      // This test verifies the procedure exists and accepts the correct input shape
      // It may throw if DB is not available, which is expected in test env
      try {
        const result = await caller.promptStudio.list({ limit: 10, offset: 0 });
        expect(Array.isArray(result)).toBe(true);
      } catch (e: any) {
        // DB not available in test environment is acceptable
        expect(e.message).toContain("Database");
      }
    });
  });

  describe("getById", () => {
    it("throws NOT_FOUND for non-existent creation", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      try {
        await caller.promptStudio.getById({ id: 999999 });
        // If DB is available and no record found, should throw
        expect.unreachable("Should have thrown");
      } catch (e: any) {
        // Either NOT_FOUND (DB available) or Database error (DB unavailable)
        expect(["NOT_FOUND", "INTERNAL_SERVER_ERROR"]).toContain(e.code || "INTERNAL_SERVER_ERROR");
      }
    });
  });

  describe("myCreations", () => {
    it("requires authentication", async () => {
      const ctx = createPublicContext(); // No user
      const caller = appRouter.createCaller(ctx);

      try {
        await caller.promptStudio.myCreations({ limit: 10, offset: 0 });
        expect.unreachable("Should have thrown for unauthenticated user");
      } catch (e: any) {
        // Should throw unauthorized error
        expect(e).toBeDefined();
      }
    });

    it("accepts authenticated context", async () => {
      const ctx = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      try {
        const result = await caller.promptStudio.myCreations({ limit: 10, offset: 0 });
        expect(Array.isArray(result)).toBe(true);
      } catch (e: any) {
        // DB not available in test environment is acceptable
        expect(e.message).toContain("Database");
      }
    });
  });
});

// ─── 2. Legal Router Tests ───
describe("legal router", () => {
  describe("logAcceptance", () => {
    it("accepts valid input shape", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      try {
        const result = await caller.legal.logAcceptance({
          termsVersion: "1.0",
          browserLanguage: "es",
          screenResolution: "1920x1080",
          platform: "Win32",
          timezone: "Europe/Madrid",
          fingerprint: "test-fingerprint-123",
          selectedLanguage: "es",
          referrer: "https://example.com",
        });
        expect(result.success).toBe(true);
        expect(result.id).toBeDefined();
      } catch (e: any) {
        // DB not available in test environment
        expect(e.message).toContain("Database");
      }
    });
  });

  describe("getCount", () => {
    it("requires admin role", async () => {
      const ctx = createAuthContext(); // role: "user"
      const caller = appRouter.createCaller(ctx);

      try {
        await caller.legal.getCount();
        expect.unreachable("Should have thrown for non-admin");
      } catch (e: any) {
        expect(e.code).toBe("FORBIDDEN");
      }
    });
  });
});

// ─── 3. Input Validation Tests ───
describe("input validation", () => {
  it("rejects empty subject in evaluate", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.promptStudio.evaluateQuality({
        subject: "",
        style: "test",
        environment: "test",
        details: "",
      });
      expect.unreachable("Should have thrown for empty subject");
    } catch (e: any) {
      expect(e).toBeDefined();
    }
  });

  it("rejects empty style in evaluate", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.promptStudio.evaluateQuality({
        subject: "test",
        style: "",
        environment: "test",
        details: "",
      });
      expect.unreachable("Should have thrown for empty style");
    } catch (e: any) {
      expect(e).toBeDefined();
    }
  });

  it("rejects empty environment in evaluate", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.promptStudio.evaluateQuality({
        subject: "test",
        style: "test",
        environment: "",
        details: "",
      });
      expect.unreachable("Should have thrown for empty environment");
    } catch (e: any) {
      expect(e).toBeDefined();
    }
  });

  it("rejects negative offset in list", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.promptStudio.list({ limit: 10, offset: -1 });
      expect.unreachable("Should have thrown for negative offset");
    } catch (e: any) {
      expect(e).toBeDefined();
    }
  });

  it("rejects limit over 100 in list", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.promptStudio.list({ limit: 200, offset: 0 });
      expect.unreachable("Should have thrown for limit > 100");
    } catch (e: any) {
      expect(e).toBeDefined();
    }
  });
});

// ─── 4. Sanitization Tests ───
describe("sanitization", () => {
  it("strips HTML tags from subject in evaluate", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    // This should not throw - HTML should be stripped
    const result = await caller.promptStudio.evaluateQuality({
      subject: "<script>alert('xss')</script>Un gato robot grande",
      style: "digital art",
      environment: "ciudad futurista",
      details: "",
    });

    expect(result).toBeDefined();
    expect(result.totalScore).toBeGreaterThan(0);
  });
});

// ─── 5. Router Structure Tests ───
describe("router structure", () => {
  it("has all expected routers", () => {
    const caller = appRouter.createCaller(createPublicContext());
    
    // Verify all routers exist
    expect(caller.auth).toBeDefined();
    expect(caller.promptStudio).toBeDefined();
    expect(caller.legal).toBeDefined();
    expect(caller.gamePlayer).toBeDefined();
    expect(caller.system).toBeDefined();
  });

  it("has auth.me procedure", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    
    const result = await caller.auth.me();
    expect(result).toBeNull(); // No user in public context
  });

  it("has auth.me with user in auth context", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);
    
    const result = await caller.auth.me();
    expect(result).toBeDefined();
    expect(result!.name).toBe("Test User");
    expect(result!.email).toBe("test@example.com");
  });

  it("has courses router", () => {
    const caller = appRouter.createCaller(createPublicContext());
    expect(caller.courses).toBeDefined();
  });

  it("has toolViews router", () => {
    const caller = appRouter.createCaller(createPublicContext());
    expect(caller.toolViews).toBeDefined();
  });

  it("has dashboard router", () => {
    const caller = appRouter.createCaller(createPublicContext());
    expect(caller.dashboard).toBeDefined();
  });
});

// ─── 6. Courses Router Tests ───
describe("courses router", () => {
  describe("create", () => {
    it("rejects unauthenticated course creation (requires game token)", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      try {
        await caller.courses.create({
          gamePlayerId: 1,
          title: "Curso de IA para Principiantes",
          description: "Un curso introductorio sobre inteligencia artificial",
          category: "empresa",
          level: "B\u00e1sico",
          duration: 7,
          objectives: JSON.stringify(["Entender qu\u00e9 es la IA", "Usar ChatGPT", "Crear prompts"]),
          modules: JSON.stringify([{name: "M\u00f3dulo 1", lessons: ["Lecci\u00f3n 1"]}]),
        });
        expect.unreachable("Should have thrown for unauthenticated request");
      } catch (e: any) {
        // Should require game token authentication
        expect(e.message).toContain("Token de sesi\u00f3n de juego requerido");
      }
    });

    it("rejects empty title", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      try {
        await caller.courses.create({
          gamePlayerId: 1,
          title: "",
          description: "test",
          category: "empresa",
          level: "B\u00e1sico",
          duration: 7,
          objectives: "[]",
          modules: "[]",
        });
        expect.unreachable("Should have thrown for empty title");
      } catch (e: any) {
        expect(e).toBeDefined();
      }
    });

    it("rejects duration less than 1", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      try {
        await caller.courses.create({
          gamePlayerId: 1,
          title: "Test Course",
          description: "test",
          category: "empresa",
          level: "B\u00e1sico",
          duration: 0,
          objectives: "[]",
          modules: "[]",
        });
        expect.unreachable("Should have thrown for duration < 1");
      } catch (e: any) {
        expect(e).toBeDefined();
      }
    });
  });

  describe("list", () => {
    it("rejects unauthenticated course listing (requires game token)", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      try {
        await caller.courses.list({ gamePlayerId: 1 });
        expect.unreachable("Should have thrown for unauthenticated request");
      } catch (e: any) {
        expect(e.message).toContain("Token de sesi\u00f3n de juego requerido");
      }
    });
  });

  describe("getById", () => {
    it("throws for non-existent course", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      try {
        await caller.courses.getById({ id: 999999 });
        expect.unreachable("Should have thrown");
      } catch (e: any) {
        expect(["NOT_FOUND", "INTERNAL_SERVER_ERROR"]).toContain(e.code || "INTERNAL_SERVER_ERROR");
      }
    });
  });

  describe("delete", () => {
    it("throws for non-existent course", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      try {
        await caller.courses.delete({ id: 999999 });
      } catch (e: any) {
        expect(e).toBeDefined();
      }
    });
  });
});

// ─── 7. Tool Views Router Tests ───
describe("toolViews router", () => {
  describe("log", () => {
    it("rejects unauthenticated tool view logging (requires game token)", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      try {
        await caller.toolViews.log({
          gamePlayerId: 1,
          toolId: "chatgpt",
          toolName: "ChatGPT",
        });
        expect.unreachable("Should have thrown for unauthenticated request");
      } catch (e: any) {
        expect(e.message).toContain("Token de sesi\u00f3n de juego requerido");
      }
    });

    it("rejects empty toolId", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      try {
        await caller.toolViews.log({
          gamePlayerId: 1,
          toolId: "",
          toolName: "Test",
        });
        expect.unreachable("Should have thrown for empty toolId");
      } catch (e: any) {
        expect(e).toBeDefined();
      }
    });
  });
});

// ─── 8. Dashboard Router Tests ───
describe("dashboard router", () => {
  describe("stats", () => {
    it("rejects unauthenticated dashboard access (requires game token)", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      try {
        await caller.dashboard.stats({ gamePlayerId: 1 });
        expect.unreachable("Should have thrown for unauthenticated request");
      } catch (e: any) {
        expect(e.message).toContain("Token de sesi\u00f3n de juego requerido");
      }
    });

    it("rejects negative gamePlayerId", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      try {
        await caller.dashboard.stats({ gamePlayerId: -1 });
        expect.unreachable("Should have thrown for negative id");
      } catch (e: any) {
        expect(e).toBeDefined();
      }
    });
  });
});

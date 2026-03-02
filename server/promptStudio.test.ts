import { describe, expect, it, vi, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// Mock the LLM module - return structured JSON matching the new response_format
vi.mock("./_core/llm", () => ({
  invokeLLM: vi.fn().mockResolvedValue({
    choices: [
      {
        message: {
          content: JSON.stringify({
            enhancedPrompt:
              "A majestic Iberian lynx wearing futuristic AR glasses, teaching artificial intelligence concepts through holographic displays, cyberpunk style with neon cyan and gold lighting, set in a modern urban environment with towering skyscrapers, ultra detailed, 8k resolution, professional digital art",
            composition: "Rule of thirds, centered subject with depth layers",
            lighting: "Neon rim lighting with volumetric fog",
            colorPalette: "Cyan #00E5FF, Gold #D4A843, Dark backgrounds",
            technicalTerms: "8K, ultra-detailed, ray tracing, subsurface scattering",
            artisticReferences: "Cyberpunk 2077 aesthetic, Blade Runner atmosphere",
          }),
        },
      },
    ],
  }),
}));

// Mock the image generation module
vi.mock("./_core/imageGeneration", () => ({
  generateImage: vi.fn().mockResolvedValue({
    url: "https://example.com/generated-image.png",
  }),
}));

// Mock the database module
vi.mock("./db", () => {
  const baseMock = {
    id: 1,
    userId: null,
    subject: "Un lince ibérico enseñando IA",
    style: "cyberpunk",
    environment: "ciudad",
    details: "Colores neón cyan y dorado",
    enhancedPrompt: null,
    imageUrl: null,
    status: "pending",
    errorMessage: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  return {
    createPromptCreation: vi.fn().mockResolvedValue({ ...baseMock }),
    updatePromptCreation: vi.fn().mockImplementation(async (id: number, data: any) => ({
      ...baseMock,
      id,
      ...data,
    })),
    getPromptCreationById: vi.fn().mockResolvedValue(baseMock),
    listPromptCreations: vi.fn().mockResolvedValue([baseMock]),
    listUserPromptCreations: vi.fn().mockResolvedValue([baseMock]),
  };
});

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: {
      protocol: "https",
      headers: {},
      ip: "127.0.0.1",
    } as TrpcContext["req"],
    res: {
      clearCookie: vi.fn(),
    } as unknown as TrpcContext["res"],
  };
}

function createAuthContext(): TrpcContext {
  return {
    user: {
      id: 1,
      openId: "test-user",
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
      ip: "127.0.0.2",
    } as TrpcContext["req"],
    res: {
      clearCookie: vi.fn(),
    } as unknown as TrpcContext["res"],
  };
}

describe("promptStudio", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ─── Evaluation Criteria ───
  describe("getEvaluationCriteria", () => {
    it("returns all 4 evaluation criteria with scores", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.promptStudio.getEvaluationCriteria();

      expect(result).toBeDefined();
      expect(result.subject).toBeDefined();
      expect(result.style).toBeDefined();
      expect(result.environment).toBeDefined();
      expect(result.details).toBeDefined();

      // Check structure
      expect(result.subject.maxScore).toBe(30);
      expect(result.style.maxScore).toBe(25);
      expect(result.environment.maxScore).toBe(25);
      expect(result.details.maxScore).toBe(20);

      // Check criteria arrays
      expect(result.subject.criteria.length).toBeGreaterThan(0);
      expect(result.subject.criteria[0]).toHaveProperty("name");
      expect(result.subject.criteria[0]).toHaveProperty("weight");
      expect(result.subject.criteria[0]).toHaveProperty("description");
    });
  });

  // ─── Quality Evaluation ───
  describe("evaluateQuality", () => {
    it("evaluates a good prompt with high score", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.promptStudio.evaluateQuality({
        subject: "Un lince ibérico con gafas de realidad aumentada enseñando inteligencia artificial a una clase de robots",
        style: "cyberpunk estilo Blade Runner con elementos Art Nouveau",
        environment: "Ciudad futurista al atardecer con niebla volumétrica y edificios de cristal en el horizonte",
        details: "Colores neón cyan #00E5FF y dorado, iluminación volumétrica dramática, ángulo de cámara en contrapicado, estado de ánimo épico",
      });

      expect(result).toBeDefined();
      expect(result.totalScore).toBeGreaterThan(0);
      expect(result.maxScore).toBe(100);
      expect(result.percentage).toBeGreaterThan(50);
      expect(result.fieldScores).toBeDefined();
      expect(result.fieldScores.subject).toHaveProperty("score");
      expect(result.fieldScores.subject).toHaveProperty("max");
      expect(result.fieldScores.subject).toHaveProperty("feedback");
    });

    it("evaluates a minimal prompt with lower score", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.promptStudio.evaluateQuality({
        subject: "gato",
        style: "cartoon",
        environment: "casa",
        details: "",
      });

      expect(result.percentage).toBeLessThan(50);
      expect(result.fieldScores.details.score).toBe(0);
    });

    it("sanitizes HTML in inputs", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.promptStudio.evaluateQuality({
        subject: "<script>alert('xss')</script>Un lince",
        style: "realista",
        environment: "naturaleza",
        details: "",
      });

      // Should not throw - sanitization handles it
      expect(result).toBeDefined();
      expect(result.totalScore).toBeGreaterThan(0);
    });
  });

  // ─── Enhance Prompt ───
  describe("enhancePrompt", () => {
    it("enhances a prompt and returns structured breakdown", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.promptStudio.enhancePrompt({
        subject: "Un lince ibérico",
        style: "cyberpunk",
        environment: "ciudad",
        details: "Colores neón",
      });

      expect(result).toBeDefined();
      expect(result.enhancedPrompt).toBeTruthy();
      expect(typeof result.enhancedPrompt).toBe("string");
      expect(result.enhancedPrompt.length).toBeGreaterThan(10);

      // Check breakdown is returned
      expect(result.breakdown).toBeDefined();
      expect(result.breakdown.composition).toBeTruthy();
      expect(result.breakdown.lighting).toBeTruthy();
      expect(result.breakdown.colorPalette).toBeTruthy();
      expect(result.breakdown.technicalTerms).toBeTruthy();
      expect(result.breakdown.artisticReferences).toBeTruthy();

      // Check evaluation is returned
      expect(result.evaluation).toBeDefined();
      expect(result.evaluation.totalScore).toBeGreaterThan(0);
      expect(result.evaluation.fieldScores).toBeDefined();
    });

    it("rejects empty subject", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      await expect(
        caller.promptStudio.enhancePrompt({
          subject: "",
          style: "cyberpunk",
          environment: "ciudad",
        })
      ).rejects.toThrow();
    });

    it("rejects empty style", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      await expect(
        caller.promptStudio.enhancePrompt({
          subject: "Un lince",
          style: "",
          environment: "ciudad",
        })
      ).rejects.toThrow();
    });

    it("rejects empty environment", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      await expect(
        caller.promptStudio.enhancePrompt({
          subject: "Un lince",
          style: "cyberpunk",
          environment: "",
        })
      ).rejects.toThrow();
    });

    it("rejects subject exceeding max length", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      await expect(
        caller.promptStudio.enhancePrompt({
          subject: "a".repeat(501),
          style: "cyberpunk",
          environment: "ciudad",
        })
      ).rejects.toThrow();
    });
  });

  // ─── Create (Full Flow) ───
  describe("create", () => {
    it("creates a prompt, enhances it, and generates an image", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.promptStudio.create({
        subject: "Un lince ibérico enseñando IA",
        style: "cyberpunk",
        environment: "ciudad",
        details: "Colores neón cyan y dorado",
      });

      expect(result).toBeDefined();
      expect(result.imageUrl).toBe("https://example.com/generated-image.png");
      expect(result.status).toBe("completed");

      // Check evaluation is included
      expect(result.evaluation).toBeDefined();
      expect(result.evaluation.totalScore).toBeGreaterThan(0);

      // Check breakdown is included
      expect(result.breakdown).toBeDefined();
      expect(result.breakdown.composition).toBeTruthy();
    });

    it("works without optional details field", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.promptStudio.create({
        subject: "Un gato espacial",
        style: "cartoon",
        environment: "espacio",
      });

      expect(result).toBeDefined();
      expect(result.status).toBe("completed");
    });

    it("handles subject with extra whitespace by sanitizing", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      // Whitespace-only subject passes zod min(1) check (3 chars)
      // but sanitizeText trims it to empty, which still proceeds
      // The system handles this gracefully
      const result = await caller.promptStudio.create({
        subject: "Un gato con espacios   ",
        style: "cartoon",
        environment: "espacio",
      });

      expect(result).toBeDefined();
      expect(result.status).toBe("completed");
    });
  });

  // ─── List (Gallery) ───
  describe("list", () => {
    it("lists prompt creations with default pagination", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.promptStudio.list({});

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
    });

    it("accepts custom limit and offset", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.promptStudio.list({ limit: 10, offset: 5 });

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
    });

    it("rejects limit over 100", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      await expect(
        caller.promptStudio.list({ limit: 101, offset: 0 })
      ).rejects.toThrow();
    });

    it("rejects negative offset", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      await expect(
        caller.promptStudio.list({ limit: 10, offset: -1 })
      ).rejects.toThrow();
    });
  });

  // ─── Get By ID ───
  describe("getById", () => {
    it("returns a single creation by ID", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.promptStudio.getById({ id: 1 });

      expect(result).toBeDefined();
      expect(result?.id).toBe(1);
    });

    it("rejects non-positive IDs", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      await expect(
        caller.promptStudio.getById({ id: 0 })
      ).rejects.toThrow();
    });
  });

  // ─── My Creations (Protected) ───
  describe("myCreations", () => {
    it("requires authentication", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      await expect(
        caller.promptStudio.myCreations({})
      ).rejects.toThrow();
    });

    it("returns creations for authenticated user", async () => {
      const ctx = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.promptStudio.myCreations({});

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
    });
  });
});

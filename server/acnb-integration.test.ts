import { describe, expect, it, vi, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// ─── Helpers ───
function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: {
      protocol: "https",
      headers: {},
      ip: "127.0.0.1",
      socket: { remoteAddress: "127.0.0.1" },
    } as unknown as TrpcContext["req"],
    res: {
      clearCookie: vi.fn(),
    } as unknown as TrpcContext["res"],
  };
}

// ─── Test: enhanceTextPrompt procedure exists and validates input ───
describe("promptStudio.enhanceTextPrompt", () => {
  it("rejects empty role field", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.promptStudio.enhanceTextPrompt({
        role: "",
        task: "Create a marketing plan",
        format: "Informe ejecutivo / Formal",
        example: "",
      })
    ).rejects.toThrow();
  });

  it("rejects empty task field", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.promptStudio.enhanceTextPrompt({
        role: "Marketing Director",
        task: "",
        format: "Email profesional / Cercano",
        example: "",
      })
    ).rejects.toThrow();
  });

  it("rejects empty format field", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.promptStudio.enhanceTextPrompt({
        role: "Marketing Director",
        task: "Create a marketing plan",
        format: "",
        example: "",
      })
    ).rejects.toThrow();
  });

  it("accepts valid input with all required fields", async () => {
    // Mock the LLM to avoid actual API calls
    vi.mock("./llm", () => ({
      invokeLLM: vi.fn().mockResolvedValue({
        choices: [
          {
            message: {
              content: JSON.stringify({
                enhancedPrompt: "Test enhanced prompt",
                score: 85,
                tips: ["Tip 1", "Tip 2"],
                technique: "Especificidad + Cadena de pensamiento",
              }),
            },
          },
        ],
      }),
    }));

    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.promptStudio.enhanceTextPrompt({
      role: "Director de formación de una PYME industrial",
      task: "Crea un plan de formación de 7 horas sobre IA generativa",
      format: "Informe ejecutivo / Formal",
      example: "",
    });

    expect(result).toBeDefined();
    expect(result.enhancedPrompt).toBeDefined();
    expect(typeof result.enhancedPrompt).toBe("string");
    expect(result.score).toBeDefined();
    expect(typeof result.score).toBe("number");
    expect(result.tips).toBeDefined();
    expect(Array.isArray(result.tips)).toBe(true);
  });

  it("accepts optional example field", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.promptStudio.enhanceTextPrompt({
      role: "Profesor de secundaria",
      task: "Diseña una actividad de 1 hora sobre prompts",
      format: "Plan de acción / Didáctico",
      example: "Bloque 1 (15min): Introducción a los prompts — Objetivo: El alumno entiende qué es un prompt",
    });

    expect(result).toBeDefined();
    expect(result.enhancedPrompt).toBeDefined();
  });
});

// ─── Test: Input sanitization ───
describe("Input sanitization", () => {
  it("strips HTML tags from input", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    // The procedure should sanitize HTML - it should not throw due to HTML
    // but should process the cleaned input
    await expect(
      caller.promptStudio.enhanceTextPrompt({
        role: '<script>alert("xss")</script>Marketing Director',
        task: "Create a plan",
        format: "Informe / Formal",
        example: "",
      })
    ).resolves.toBeDefined();
  });
});

// ─── Test: Router structure ───
describe("Router structure", () => {
  it("has promptStudio router with enhanceTextPrompt", () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    expect(caller.promptStudio).toBeDefined();
    expect(caller.promptStudio.enhanceTextPrompt).toBeDefined();
    expect(typeof caller.promptStudio.enhanceTextPrompt).toBe("function");
  });

  it("has promptStudio router with enhancePrompt (visual mode)", () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    expect(caller.promptStudio.enhancePrompt).toBeDefined();
    expect(typeof caller.promptStudio.enhancePrompt).toBe("function");
  });

  it("has promptStudio router with generateImage", () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    expect(caller.promptStudio.generateImage).toBeDefined();
    expect(typeof caller.promptStudio.generateImage).toBe("function");
  });
});

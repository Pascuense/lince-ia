import { describe, it, expect } from "vitest";
import { readFileSync, existsSync } from "fs";
import { resolve } from "path";

// ─── Schema Tests ───
describe("Legal Acceptance - Database Schema", () => {
  const schemaPath = resolve(__dirname, "../drizzle/schema.ts");
  const schemaContent = readFileSync(schemaPath, "utf-8");

  it("should have legalAcceptances table defined", () => {
    expect(schemaContent).toContain('export const legalAcceptances = mysqlTable("legal_acceptances"');
  });

  it("should have all required columns", () => {
    const requiredColumns = [
      "termsVersion",
      "ipAddress",
      "userAgent",
      "browserLanguage",
      "screenResolution",
      "platform",
      "timezone",
      "fingerprint",
      "selectedLanguage",
      "referrer",
      "gamePlayerId",
      "userId",
      "acceptedAt",
    ];
    for (const col of requiredColumns) {
      expect(schemaContent).toContain(col);
    }
  });

  it("should export LegalAcceptance and InsertLegalAcceptance types", () => {
    expect(schemaContent).toContain("export type LegalAcceptance");
    expect(schemaContent).toContain("export type InsertLegalAcceptance");
  });

  it("should have auto-increment primary key", () => {
    // The table should have an id with autoincrement
    expect(schemaContent).toMatch(/legalAcceptances[\s\S]*?autoincrement\(\)\.primaryKey\(\)/);
  });

  it("should have acceptedAt with defaultNow", () => {
    expect(schemaContent).toMatch(/acceptedAt[\s\S]*?defaultNow\(\)/);
  });
});

// ─── Database Helper Tests ───
describe("Legal Acceptance - Database Helpers", () => {
  const dbPath = resolve(__dirname, "./db.ts");
  const dbContent = readFileSync(dbPath, "utf-8");

  it("should export logLegalAcceptance function", () => {
    expect(dbContent).toContain("export async function logLegalAcceptance");
  });

  it("should export getLegalAcceptances function", () => {
    expect(dbContent).toContain("export async function getLegalAcceptances");
  });

  it("should export getLegalAcceptancesByFingerprint function", () => {
    expect(dbContent).toContain("export async function getLegalAcceptancesByFingerprint");
  });

  it("should export getLegalAcceptanceCount function", () => {
    expect(dbContent).toContain("export async function getLegalAcceptanceCount");
  });

  it("should import legalAcceptances from schema", () => {
    expect(dbContent).toContain("legalAcceptances");
    expect(dbContent).toContain("InsertLegalAcceptance");
    expect(dbContent).toContain("LegalAcceptance");
  });

  it("logLegalAcceptance should accept all required fields", () => {
    // Check the function signature includes key fields
    expect(dbContent).toMatch(/logLegalAcceptance[\s\S]*?termsVersion: string/);
    expect(dbContent).toMatch(/logLegalAcceptance[\s\S]*?ipAddress/);
    expect(dbContent).toMatch(/logLegalAcceptance[\s\S]*?userAgent/);
    expect(dbContent).toMatch(/logLegalAcceptance[\s\S]*?fingerprint/);
  });
});

// ─── Router Tests ───
describe("Legal Acceptance - tRPC Router", () => {
  const routerPath = resolve(__dirname, "./routers.ts");
  const routerContent = readFileSync(routerPath, "utf-8");

  it("should have legalRouter defined", () => {
    expect(routerContent).toContain("const legalRouter = router(");
  });

  it("should have logAcceptance as a public procedure", () => {
    expect(routerContent).toContain("logAcceptance: publicProcedure");
  });

  it("should have getCount as a protected procedure (admin only)", () => {
    expect(routerContent).toContain("getCount: protectedProcedure");
  });

  it("should have list as a protected procedure (admin only)", () => {
    // list endpoint should be protected
    expect(routerContent).toMatch(/list:\s*protectedProcedure/);
  });

  it("should register legal router in appRouter", () => {
    expect(routerContent).toContain("legal: legalRouter");
  });

  it("should extract the client IP through the shared proxy-aware helper", () => {
    expect(routerContent).toContain("const ipAddress = getClientIP(ctx)");
    expect(routerContent).toContain('from "./clientIp"');
  });

  it("should extract user-agent from request headers", () => {
    expect(routerContent).toContain("user-agent");
  });

  it("should validate termsVersion input", () => {
    expect(routerContent).toContain('termsVersion: z.string().max(16)');
  });

  it("should enforce admin role on getCount", () => {
    expect(routerContent).toContain('ctx.user.role !== "admin"');
  });

  it("should enforce admin role on list", () => {
    // Both getCount and list should check admin role
    const adminChecks = routerContent.match(/ctx\.user\.role !== "admin"/g);
    expect(adminChecks).not.toBeNull();
    expect(adminChecks!.length).toBeGreaterThanOrEqual(2);
  });

  it("should import logLegalAcceptance from db", () => {
    expect(routerContent).toContain("logLegalAcceptance");
  });
});

// ─── Frontend Integration Tests ───
describe("Legal Acceptance - Frontend Integration", () => {
  const legalGatePath = resolve(__dirname, "../client/src/components/LegalGate.tsx");
  const legalGateContent = readFileSync(legalGatePath, "utf-8");

  it("should import trpc client", () => {
    expect(legalGateContent).toContain('import { trpc } from "@/lib/trpc"');
  });

  it("should call legal.logAcceptance mutation", () => {
    expect(legalGateContent).toContain("trpc.legal.logAcceptance.useMutation()");
  });

  it("should generate device fingerprint", () => {
    expect(legalGateContent).toContain("generateFingerprint");
  });

  it("should send termsVersion in mutation", () => {
    expect(legalGateContent).toContain("termsVersion: LEGAL_VERSION");
  });

  it("should send browser signals: language, screen, platform, timezone", () => {
    expect(legalGateContent).toContain("browserLanguage: navigator.language");
    expect(legalGateContent).toContain("screenResolution:");
    expect(legalGateContent).toContain("platform: navigator.platform");
    expect(legalGateContent).toContain("timezone:");
  });

  it("should send selected language", () => {
    expect(legalGateContent).toContain("selectedLanguage: lang");
  });

  it("should send referrer", () => {
    expect(legalGateContent).toContain("referrer: document.referrer");
  });

  it("should not block UI if logging fails (fire-and-forget)", () => {
    // The mutation should be called with .mutate (not .mutateAsync) and wrapped in try/catch
    expect(legalGateContent).toContain("logAcceptanceMutation.mutate(");
    expect(legalGateContent).toContain("// Don't block acceptance if logging fails");
  });

  it("should still save to localStorage after logging", () => {
    expect(legalGateContent).toContain("localStorage.setItem");
    expect(legalGateContent).toContain("LEGAL_ACCEPTED_KEY");
  });
});

// ─── Migration Tests ───
describe("Legal Acceptance - Migration", () => {
  const migrationsDir = resolve(__dirname, "../drizzle");

  it("should have migration files generated", () => {
    expect(existsSync(migrationsDir)).toBe(true);
  });

  it("should have a migration that creates legal_acceptances table", () => {
    // Check that at least one migration SQL file mentions legal_acceptances
    const fs = require("fs");
    const files = fs.readdirSync(migrationsDir).filter((f: string) => f.endsWith(".sql"));
    const hasLegalMigration = files.some((f: string) => {
      const content = fs.readFileSync(resolve(migrationsDir, f), "utf-8");
      return content.includes("legal_acceptances");
    });
    expect(hasLegalMigration).toBe(true);
  });
});

// ─── Fingerprint Security Tests ───
describe("Legal Acceptance - Fingerprint Security", () => {
  const legalGatePath = resolve(__dirname, "../client/src/components/LegalGate.tsx");
  const legalGateContent = readFileSync(legalGatePath, "utf-8");

  it("should use multiple browser signals for fingerprinting", () => {
    const signals = [
      "navigator.userAgent",
      "navigator.language",
      "screen.width",
      "screen.height",
      "screen.colorDepth",
      "navigator.platform",
      "timeZone",
      "getTimezoneOffset",
      "hardwareConcurrency",
    ];
    for (const signal of signals) {
      expect(legalGateContent).toContain(signal);
    }
  });

  it("should hash the fingerprint (not send raw signals)", () => {
    expect(legalGateContent).toContain("fp_");
    expect(legalGateContent).toContain("toString(36)");
  });
});

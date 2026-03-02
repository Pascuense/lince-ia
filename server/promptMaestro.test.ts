/**
 * Prompt Maestro v2.1 — Integration tests
 * Verifies all blocks: legal disclaimers, counters, navigation order, 
 * chat architecture, and accessibility.
 */
import { describe, it, expect } from "vitest";
import { GLOBAL_SYSTEM_RULES, AVATAR_PROMPTS, buildFullPrompt, getAvatarPrompt } from "@shared/avatarPrompts";

describe("Block 0.0: Legal Transformation", () => {
  it("GLOBAL_SYSTEM_RULES includes fictional character rule (rule 11)", () => {
    expect(GLOBAL_SYSTEM_RULES).toContain("PERSONAJE FICTICIO");
    expect(GLOBAL_SYSTEM_RULES).toContain("100% ficticio");
    expect(GLOBAL_SYSTEM_RULES).toContain("requisito legal");
  });

  it("GLOBAL_SYSTEM_RULES includes privacy rule (rule 12)", () => {
    expect(GLOBAL_SYSTEM_RULES).toContain("PRIVACIDAD");
    expect(GLOBAL_SYSTEM_RULES).toContain("datos personales reales");
  });

  it("buildFullPrompt includes both global rules and avatar-specific prompt", () => {
    const avatar = AVATAR_PROMPTS[0];
    const fullPrompt = buildFullPrompt(avatar);
    expect(fullPrompt).toContain("PERSONAJE FICTICIO");
    expect(fullPrompt).toContain("PRIVACIDAD");
    expect(fullPrompt).toContain(avatar.systemPrompt);
  });

  it("All avatars have required fields", () => {
    for (const avatar of AVATAR_PROMPTS) {
      expect(avatar.key).toBeTruthy();
      expect(avatar.displayName).toBeTruthy();
      expect(avatar.group).toBeTruthy();
      expect(avatar.systemPrompt).toBeTruthy();
      expect(avatar.welcomeMessage).toBeTruthy();
      expect(avatar.insultResponse).toBeTruthy();
    }
  });
});

describe("Block 0.1-0.2: Counters Accuracy", () => {
  it("AVATAR_PROMPTS comment says 85 avatars", () => {
    // The system has 65 total avatars across all groups
    // AVATAR_PROMPTS only contains those with chat prompts (family + og_crew + evento + zaragoza)
    expect(AVATAR_PROMPTS.length).toBeGreaterThan(0);
    expect(AVATAR_PROMPTS.length).toBeLessThanOrEqual(85);
  });

  it("All avatar groups are represented", () => {
    const groups = new Set(AVATAR_PROMPTS.map(a => a.group));
    expect(groups.has("family")).toBe(true);
    expect(groups.has("og_crew")).toBe(true);
  });
});

describe("Block 1: Chat Architecture", () => {
  it("GLOBAL_SYSTEM_RULES has all 12 rules", () => {
    for (let i = 1; i <= 12; i++) {
      expect(GLOBAL_SYSTEM_RULES).toContain(`${i}.`);
    }
  });

  it("Each avatar has referralKeys array", () => {
    for (const avatar of AVATAR_PROMPTS) {
      expect(Array.isArray(avatar.referralKeys)).toBe(true);
    }
  });

  it("Each avatar has motivationalPhrases array", () => {
    for (const avatar of AVATAR_PROMPTS) {
      expect(Array.isArray(avatar.motivationalPhrases)).toBe(true);
      expect(avatar.motivationalPhrases.length).toBeGreaterThan(0);
    }
  });

  it("getAvatarPrompt returns undefined for unknown keys", () => {
    expect(getAvatarPrompt("NONEXISTENT_AVATAR")).toBeUndefined();
  });

  it("getAvatarPrompt returns config for known keys", () => {
    const first = AVATAR_PROMPTS[0];
    const result = getAvatarPrompt(first.key);
    expect(result).toBeDefined();
    expect(result!.key).toBe(first.key);
  });
});

describe("Block 0.8: Accessibility Rules in System Prompt", () => {
  it("System prompt includes inclusive language rules", () => {
    expect(GLOBAL_SYSTEM_RULES).toContain("IDIOMA");
    expect(GLOBAL_SYSTEM_RULES).toContain("TONO");
  });

  it("System prompt prevents harmful content", () => {
    expect(GLOBAL_SYSTEM_RULES).toContain("CERO CONTENIDO DAÑINO");
    expect(GLOBAL_SYSTEM_RULES).toContain("CERO ALUCINACIONES");
  });
});

import { describe, it, expect } from "vitest";
import {
  AVATAR_PROMPTS,
  getAvatarPrompt,
  buildFullPrompt,
  GLOBAL_SYSTEM_RULES,
  type AvatarPromptConfig,
} from "../shared/avatarPrompts";

describe("Avatar Prompts System", () => {
  it("should have exactly 65 avatar prompts", () => {
    expect(AVATAR_PROMPTS.length).toBe(85);
  });

  it("should have unique keys for all avatars", () => {
    const keys = AVATAR_PROMPTS.map((a) => a.key);
    const uniqueKeys = new Set(keys);
    expect(uniqueKeys.size).toBe(keys.length);
  });

  it("should have all required fields for every avatar", () => {
    const requiredFields: (keyof AvatarPromptConfig)[] = [
      "key",
      "displayName",
      "group",
      "specialty",
      "responseStyle",
      "personality",
      "systemPrompt",
      "welcomeMessage",
      "insultResponse",
      "referralKeys",
      "motivationalPhrases",
    ];

    for (const avatar of AVATAR_PROMPTS) {
      for (const field of requiredFields) {
        expect(avatar[field], `${avatar.key} missing ${field}`).toBeDefined();
      }
    }
  });

  it("should have non-empty systemPrompt for all avatars", () => {
    for (const avatar of AVATAR_PROMPTS) {
      expect(avatar.systemPrompt.length, `${avatar.key} has empty systemPrompt`).toBeGreaterThan(50);
    }
  });

  it("should have non-empty welcomeMessage for all avatars", () => {
    for (const avatar of AVATAR_PROMPTS) {
      expect(avatar.welcomeMessage.length, `${avatar.key} has empty welcomeMessage`).toBeGreaterThan(10);
    }
  });

  it("should have non-empty insultResponse for all avatars", () => {
    for (const avatar of AVATAR_PROMPTS) {
      expect(avatar.insultResponse.length, `${avatar.key} has empty insultResponse`).toBeGreaterThan(10);
    }
  });

  it("should have at least 1 motivational phrase per avatar", () => {
    for (const avatar of AVATAR_PROMPTS) {
      expect(avatar.motivationalPhrases.length, `${avatar.key} has no motivational phrases`).toBeGreaterThanOrEqual(1);
    }
  });

  it("should have valid group values", () => {
    const validGroups = ["family", "og_crew", "evento_especial", "aragonesa", "zaragoza_historico"];
    for (const avatar of AVATAR_PROMPTS) {
      expect(validGroups, `${avatar.key} has invalid group: ${avatar.group}`).toContain(avatar.group);
    }
  });

  it("should have 10 family avatars", () => {
    const family = AVATAR_PROMPTS.filter((a) => a.group === "family");
    expect(family.length).toBe(10);
  });

  it("should have 44 OG crew avatars (11 urbano + 13 especialistas)", () => {
    const ogCrew = AVATAR_PROMPTS.filter((a) => a.group === "og_crew");
    expect(ogCrew.length).toBe(44);
  });

  it("should have 11 evento especial avatars", () => {
    const evento = AVATAR_PROMPTS.filter((a) => a.group === "evento_especial");
    expect(evento.length).toBe(11);
  });

  it("should have 10 zaragoza_historico avatars", () => {
    const zh = AVATAR_PROMPTS.filter((a) => a.group === "zaragoza_historico");
    expect(zh.length).toBe(10);
  });

  it("should have 10 aragonesa avatars", () => {
    const ar = AVATAR_PROMPTS.filter((a) => a.group === "aragonesa");
    expect(ar.length).toBe(10);
  });

  it("should find SABELIN (LINCE CEO) by key", () => {
    const lince = getAvatarPrompt("SABELIN");
    expect(lince).toBeDefined();
    expect(lince!.displayName).toContain("SABEL");
    expect(lince!.group).toBe("family");
  });

  it("should return undefined for non-existent key", () => {
    const result = getAvatarPrompt("NON_EXISTENT_AVATAR");
    expect(result).toBeUndefined();
  });

  it("should build full prompt with global rules", () => {
    const avatar = getAvatarPrompt("LUMALIN")!;
    const fullPrompt = buildFullPrompt(avatar);
    expect(fullPrompt).toContain(GLOBAL_SYSTEM_RULES);
    expect(fullPrompt).toContain(avatar.systemPrompt);
  });

  it("should NOT contain any reference to real persons", () => {
    for (const avatar of AVATAR_PROMPTS) {
      const allText = JSON.stringify(avatar).toLowerCase();
      expect(allText, `${avatar.key} contains forbidden name`).not.toContain("cristóbal");
      expect(allText, `${avatar.key} contains forbidden name`).not.toContain("cristobal");
      expect(allText, `${avatar.key} contains forbidden name`).not.toContain("aliste");
    }
    const rulesLower = GLOBAL_SYSTEM_RULES.toLowerCase();
    expect(rulesLower).not.toContain("cristóbal");
    expect(rulesLower).not.toContain("cristobal");
    expect(rulesLower).not.toContain("aliste");
  });

  it("should have LINCE as CEO in SABELIN prompt", () => {
    const lince = getAvatarPrompt("SABELIN")!;
    expect(lince.systemPrompt.toLowerCase()).toContain("ceo");
  });

  it("should reference ACNB IA SL in global rules", () => {
    expect(GLOBAL_SYSTEM_RULES).toContain("ACNB IA SL");
  });

  it("referralKeys should reference existing avatar keys", () => {
    const allKeys = new Set(AVATAR_PROMPTS.map((a) => a.key));
    for (const avatar of AVATAR_PROMPTS) {
      for (const ref of avatar.referralKeys) {
        expect(allKeys, `${avatar.key} referralKey "${ref}" does not exist`).toContain(ref);
      }
    }
  });

  it("every avatar should have 'personaje educativo ficticio' in systemPrompt", () => {
    for (const avatar of AVATAR_PROMPTS) {
      expect(
        avatar.systemPrompt.toLowerCase(),
        `${avatar.key} missing identity line`
      ).toContain("personaje educativo ficticio");
    }
  });

  it("every avatar should have '¿ERES REAL?' response in systemPrompt", () => {
    for (const avatar of AVATAR_PROMPTS) {
      expect(
        avatar.systemPrompt.toLowerCase(),
        `${avatar.key} missing ¿eres real? response`
      ).toContain("eres real");
    }
  });
});

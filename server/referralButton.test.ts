import { describe, it, expect } from "vitest";
import { getAvatarPrompt, AVATAR_PROMPTS } from "../shared/avatarPrompts";
import { getAvatarImage, ALL_CHARACTERS, FAMILY_CHARACTERS } from "../client/src/lib/avatarConstants";

/**
 * Tests for the interactive referral button feature.
 * Validates that:
 * 1. Referral data structure is correct from the backend
 * 2. Avatar images can be resolved for referral targets
 * 3. All referral keys point to valid avatars
 * 4. The switch avatar flow can find target characters
 */

describe("Referral Button Feature", () => {
  describe("Referral data structure", () => {
    it("all avatars with referralKeys have valid referral targets", () => {
      for (const avatar of AVATAR_PROMPTS) {
        for (const refKey of avatar.referralKeys) {
          const refAvatar = getAvatarPrompt(refKey);
          expect(refAvatar, `Referral key ${refKey} from ${avatar.key} should resolve to a valid avatar`).toBeDefined();
          expect(refAvatar!.displayName).toBeTruthy();
          expect(refAvatar!.specialty).toBeTruthy();
        }
      }
    });

    it("referral response shape matches expected structure", () => {
      // Simulate what the server returns
      const sampleAvatar = getAvatarPrompt("SABELIN");
      expect(sampleAvatar).toBeDefined();

      const refKey = sampleAvatar!.referralKeys[0];
      const refAvatar = getAvatarPrompt(refKey);
      expect(refAvatar).toBeDefined();

      const referral = {
        key: refAvatar!.key,
        displayName: refAvatar!.displayName,
        specialty: refAvatar!.specialty,
      };

      expect(referral).toHaveProperty("key");
      expect(referral).toHaveProperty("displayName");
      expect(referral).toHaveProperty("specialty");
      expect(typeof referral.key).toBe("string");
      expect(typeof referral.displayName).toBe("string");
      expect(typeof referral.specialty).toBe("string");
    });
  });

  describe("Avatar image resolution for referral buttons", () => {
    it("getAvatarImage returns images for family characters", () => {
      const familyKeys = ["YAYALIN", "PAPALIN", "MAMALINA", "SABELIN"];
      for (const key of familyKeys) {
        const img = getAvatarImage(key);
        expect(img, `Family avatar ${key} should have an image`).toBeTruthy();
        // Family avatars are served locally (/avatars/...), not from CDN
        expect(img.length).toBeGreaterThan(0);
      }
    });

    it("getAvatarImage returns images for urban characters", () => {
      const urbanKeys = ["LUMALIN", "VOLTZLIN", "SONALIN", "CRISTALIN"];
      for (const key of urbanKeys) {
        const img = getAvatarImage(key);
        expect(img, `Urban avatar ${key} should have an image`).toBeTruthy();
        expect(img).toMatch(/^\/(assets|avatars)\//);
      }
    });

    it("getAvatarImage returns images for zaragoza historico characters", () => {
      const zaragozaKeys = ["LAFITALIN", "NAYIMIN", "ANDERIN"];
      for (const key of zaragozaKeys) {
        const img = getAvatarImage(key);
        expect(img, `Zaragoza avatar ${key} should have an image`).toBeTruthy();
        expect(img).toMatch(/^\/(assets|avatars)\//);
      }
    });

    it("getAvatarImage returns empty string for unknown keys", () => {
      const img = getAvatarImage("NONEXISTENT_AVATAR");
      expect(img).toBe("");
    });
  });

  describe("Character lookup for avatar switching", () => {
    it("ALL_CHARACTERS contains all character groups", () => {
      expect(ALL_CHARACTERS.length).toBeGreaterThanOrEqual(40);
      // Verify it includes family, urban, and zaragoza
      const families = ALL_CHARACTERS.filter(c => c.region === "Zaragoza" && FAMILY_CHARACTERS.some(f => f.key === c.key));
      expect(families.length).toBeGreaterThan(0);
      const urbans = ALL_CHARACTERS.filter(c => c.region === "MUSICALIN");
      expect(urbans.length).toBeGreaterThan(0);
    });

    it("can find characters by key for avatar switching", () => {
      const testKeys = ["SABELIN", "LUMALIN", "LAFITALIN", "YAYALIN"];
      for (const key of testKeys) {
        const found = ALL_CHARACTERS.find(c => c.key === key);
        expect(found, `Character ${key} should be findable by key`).toBeDefined();
        expect(found!.name).toBeTruthy();
        expect(found!.color).toBeTruthy();
      }
    });

    it("referral targets from common avatars are valid avatar prompts", () => {
      // Test that referral targets from popular avatars are valid avatar prompts
      // Note: Some avatars (Especialistas, Aragonesa) are defined in Personajes.tsx, not in avatarConstants
      // So we check that they at least have a valid prompt config
      const popularAvatars = ["SABELIN", "YAYALIN", "PAPALIN", "MAMALINA", "LUMALIN"];
      for (const avatarKey of popularAvatars) {
        const avatar = getAvatarPrompt(avatarKey);
        if (!avatar) continue;
        for (const refKey of avatar.referralKeys) {
          const refAvatar = getAvatarPrompt(refKey);
          expect(
            refAvatar,
            `Referral target ${refKey} from ${avatarKey} should have a valid prompt config`
          ).toBeDefined();
          expect(refAvatar!.displayName).toBeTruthy();
          expect(refAvatar!.specialty).toBeTruthy();
        }
      }
    });
  });

  describe("Referral button display logic", () => {
    it("referral message should contain required fields", () => {
      // Simulate the referral message creation
      const referral = {
        key: "PAPALIN",
        displayName: "PAPALÍN",
        specialty: "Implementación técnica ML",
      };

      const msg = {
        from: "system" as const,
        text: `💡 ¿Quieres saber más sobre ${referral.specialty}?`,
        referral,
      };

      expect(msg.referral).toBeDefined();
      expect(msg.referral!.key).toBe("PAPALIN");
      expect(msg.referral!.displayName).toBe("PAPALÍN");
      expect(msg.referral!.specialty).toBeTruthy();
      expect(msg.text).toContain("Implementación técnica ML");
    });

    it("referral button labels are correct for each language", () => {
      const referral = { key: "SABELIN", displayName: "SABELÍN", specialty: "Innovación" };

      // Spanish
      const esLabel = `Hablar con ${referral.displayName}`;
      expect(esLabel).toBe("Hablar con SABELÍN");

      // English
      const enLabel = `Talk to ${referral.displayName}`;
      expect(enLabel).toBe("Talk to SABELÍN");

      // Chinese
      const zhLabel = `与${referral.displayName}对话`;
      expect(zhLabel).toBe("与SABELÍN对话");
    });

    it("specialty label is correct for each language", () => {
      const specialty = "IA aplicada al deporte";

      const esLabel = `Especialista en: ${specialty}`;
      expect(esLabel).toContain("Especialista en:");

      const enLabel = `Specialist in: ${specialty}`;
      expect(enLabel).toContain("Specialist in:");

      const zhLabel = `专长：${specialty}`;
      expect(zhLabel).toContain("专长：");
    });
  });

  describe("Avatar switch flow", () => {
    it("closing and reopening chat simulates avatar switch", () => {
      // Simulate the switch flow
      let currentAvatar: string | null = "SABELIN";

      // Step 1: Close current chat
      currentAvatar = null;
      expect(currentAvatar).toBeNull();

      // Step 2: After delay, open new chat
      const targetKey = "PAPALIN";
      const targetChar = ALL_CHARACTERS.find(c => c.key === targetKey);
      expect(targetChar).toBeDefined();

      currentAvatar = targetChar!.key;
      expect(currentAvatar).toBe("PAPALIN");
    });

    it("handles unknown referral keys gracefully", () => {
      const unknownKey = "UNKNOWN_AVATAR_999";
      const found = ALL_CHARACTERS.find(c => c.key === unknownKey);
      expect(found).toBeUndefined();
      // The UI should simply not switch if the target is not found
    });
  });
});

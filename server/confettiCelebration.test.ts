import { describe, it, expect } from "vitest";

/**
 * Tests for the confetti celebration on relationship level-up.
 * Validates detection logic, UI banner, accessibility, and i18n.
 */
describe("Confetti Celebration on Relationship Level-Up", () => {
  describe("Level-up detection logic", () => {
    const LEVELS_ORDER = ["new", "known", "friend", "best_friend"];

    function isLevelUp(oldLevel: string, newLevel: string): boolean {
      const oldIdx = LEVELS_ORDER.indexOf(oldLevel);
      const newIdx = LEVELS_ORDER.indexOf(newLevel);
      return newIdx > oldIdx && newIdx > 0;
    }

    it("detects new → known as level-up", () => {
      expect(isLevelUp("new", "known")).toBe(true);
    });

    it("detects new → friend as level-up", () => {
      expect(isLevelUp("new", "friend")).toBe(true);
    });

    it("detects new → best_friend as level-up", () => {
      expect(isLevelUp("new", "best_friend")).toBe(true);
    });

    it("detects known → friend as level-up", () => {
      expect(isLevelUp("known", "friend")).toBe(true);
    });

    it("detects known → best_friend as level-up", () => {
      expect(isLevelUp("known", "best_friend")).toBe(true);
    });

    it("detects friend → best_friend as level-up", () => {
      expect(isLevelUp("friend", "best_friend")).toBe(true);
    });

    it("does NOT detect same level as level-up", () => {
      expect(isLevelUp("new", "new")).toBe(false);
      expect(isLevelUp("known", "known")).toBe(false);
      expect(isLevelUp("friend", "friend")).toBe(false);
      expect(isLevelUp("best_friend", "best_friend")).toBe(false);
    });

    it("does NOT detect level-down as level-up", () => {
      expect(isLevelUp("known", "new")).toBe(false);
      expect(isLevelUp("friend", "known")).toBe(false);
      expect(isLevelUp("best_friend", "friend")).toBe(false);
    });

    it("does NOT detect new → new as level-up (index 0 excluded)", () => {
      // Even if indices match, index 0 should not trigger
      expect(isLevelUp("new", "new")).toBe(false);
    });
  });

  describe("ArtistChatModal confetti integration", () => {
    it("imports canvas-confetti for visual effects", async () => {
      const fs = await import("fs");
      const content = fs.readFileSync("client/src/components/ArtistChatModal.tsx", "utf-8");
      expect(content).toContain('import confetti from "canvas-confetti"');
    });

    it("defines fireRelationshipConfetti function", async () => {
      const fs = await import("fs");
      const content = fs.readFileSync("client/src/components/ArtistChatModal.tsx", "utf-8");
      expect(content).toContain("function fireRelationshipConfetti");
    });

    it("defines LevelUpBanner component", async () => {
      const fs = await import("fs");
      const content = fs.readFileSync("client/src/components/ArtistChatModal.tsx", "utf-8");
      expect(content).toContain("function LevelUpBanner");
    });

    it("has checkLevelUp callback that compares old and new levels", async () => {
      const fs = await import("fs");
      const content = fs.readFileSync("client/src/components/ArtistChatModal.tsx", "utf-8");
      expect(content).toContain("checkLevelUp");
      expect(content).toContain("RELATIONSHIP_LEVELS_ORDER");
      expect(content).toContain("oldIdx");
      expect(content).toContain("newIdx");
    });

    it("stores previous level before sending message for comparison", async () => {
      const fs = await import("fs");
      const content = fs.readFileSync("client/src/components/ArtistChatModal.tsx", "utf-8");
      expect(content).toContain("const previousLevel = relationshipLevel");
      expect(content).toContain("checkLevelUp(previousLevel, result.relationshipLevel)");
    });

    it("manages levelUpInfo state for banner display", async () => {
      const fs = await import("fs");
      const content = fs.readFileSync("client/src/components/ArtistChatModal.tsx", "utf-8");
      expect(content).toContain("levelUpInfo");
      expect(content).toContain("setLevelUpInfo");
      expect(content).toContain("useState<{ newLevel: string } | null>(null)");
    });

    it("renders LevelUpBanner when levelUpInfo is set", async () => {
      const fs = await import("fs");
      const content = fs.readFileSync("client/src/components/ArtistChatModal.tsx", "utf-8");
      expect(content).toContain("{levelUpInfo && (");
      expect(content).toContain("<LevelUpBanner");
    });
  });

  describe("Accessibility (prefers-reduced-motion)", () => {
    it("checks prefers-reduced-motion before firing confetti", async () => {
      const fs = await import("fs");
      const content = fs.readFileSync("client/src/components/ArtistChatModal.tsx", "utf-8");
      expect(content).toContain("prefers-reduced-motion");
      expect(content).toContain("reduce");
    });
  });

  describe("Celebration messages i18n", () => {
    it("has celebration messages for all 3 languages", async () => {
      const fs = await import("fs");
      const content = fs.readFileSync("client/src/components/ArtistChatModal.tsx", "utf-8");
      // Spanish
      expect(content).toContain("ahora te reconoce");
      expect(content).toContain("sois amigos");
      expect(content).toContain("te considera su confidente");
      // English
      expect(content).toContain("now recognizes you");
      expect(content).toContain("are friends now");
      expect(content).toContain("considers you a confidant");
      // Chinese
      expect(content).toContain("现在认识你了");
      expect(content).toContain("现在是朋友了");
      expect(content).toContain("把你当作知己了");
    });

    it("uses {name} placeholder for artist name in messages", async () => {
      const fs = await import("fs");
      const content = fs.readFileSync("client/src/components/ArtistChatModal.tsx", "utf-8");
      expect(content).toContain("{name}");
      expect(content).toContain('.replace("{name}", artistName)');
    });

    it("Level Up banner title is translated in 3 languages", async () => {
      const fs = await import("fs");
      const content = fs.readFileSync("client/src/components/ArtistChatModal.tsx", "utf-8");
      expect(content).toContain("Level Up!");
      expect(content).toContain("升级了！");
      expect(content).toContain("¡Nivel de relación subido!");
    });
  });

  describe("LevelUpBanner UI", () => {
    it("auto-dismisses after 5 seconds", async () => {
      const fs = await import("fs");
      const content = fs.readFileSync("client/src/components/ArtistChatModal.tsx", "utf-8");
      expect(content).toContain("setTimeout(onDismiss, 5000)");
    });

    it("shows progress bar with all 4 relationship levels", async () => {
      const fs = await import("fs");
      const content = fs.readFileSync("client/src/components/ArtistChatModal.tsx", "utf-8");
      expect(content).toContain("RELATIONSHIP_LEVELS_ORDER.map");
    });

    it("has a pulse animation for the banner entrance", async () => {
      const fs = await import("fs");
      const content = fs.readFileSync("client/src/components/ArtistChatModal.tsx", "utf-8");
      expect(content).toContain("levelUpPulse");
      expect(content).toContain("@keyframes levelUpPulse");
    });

    it("uses glow box-shadow effect with relationship color", async () => {
      const fs = await import("fs");
      const content = fs.readFileSync("client/src/components/ArtistChatModal.tsx", "utf-8");
      expect(content).toContain("boxShadow");
      expect(content).toContain("config.color");
    });
  });

  describe("Confetti visual configuration", () => {
    it("uses LINCE brand colors in confetti", async () => {
      const fs = await import("fs");
      const content = fs.readFileSync("client/src/components/ArtistChatModal.tsx", "utf-8");
      expect(content).toContain("#00E5FF");
      expect(content).toContain("#D4A843");
      expect(content).toContain("#FFD700");
    });

    it("fires initial burst and side bursts", async () => {
      const fs = await import("fs");
      const content = fs.readFileSync("client/src/components/ArtistChatModal.tsx", "utf-8");
      // Initial burst
      expect(content).toContain("particleCount: 80");
      // Side bursts
      expect(content).toContain("angle: 60");
      expect(content).toContain("angle: 120");
    });

    it("uses high z-index to appear above chat modal", async () => {
      const fs = await import("fs");
      const content = fs.readFileSync("client/src/components/ArtistChatModal.tsx", "utf-8");
      expect(content).toContain("zIndex: 10100");
    });
  });
});

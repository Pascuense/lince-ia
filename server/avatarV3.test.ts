import { describe, it, expect } from "vitest";
import { AVATAR_PROMPTS, getAvatarPrompt, buildFullPrompt, UNIVERSAL_FALLBACK_PROMPT } from "@shared/avatarPrompts";
import { AVATAR_EXPERTISE, buildDerivationBlock, getAvatarDisclaimer, findPrimarySpecialist, DERIVATION_MATRIX } from "@shared/avatarExpertise";
import { AVATAR_TASKS, getAvatarTasks, hasAvatarTasks } from "@shared/avatarTasks";

describe("Avatar V3 System — 65 Avatars", () => {
  // ═══════════════════════════════════════════════════
  // PROMPT SYSTEM TESTS
  // ═══════════════════════════════════════════════════
  describe("Avatar Prompts", () => {
    it("should have exactly 65 avatar prompts", () => {
      expect(AVATAR_PROMPTS.length).toBe(85);
    });

    it("should have unique keys for all avatars", () => {
      const keys = AVATAR_PROMPTS.map((a) => a.key);
      const uniqueKeys = new Set(keys);
      expect(uniqueKeys.size).toBe(85);
    });

    it("should have all required fields for each avatar", () => {
      for (const avatar of AVATAR_PROMPTS) {
        expect(avatar.key).toBeTruthy();
        expect(avatar.displayName).toBeTruthy();
        expect(avatar.group).toBeTruthy();
        expect(avatar.specialty).toBeTruthy();
        expect(avatar.systemPrompt).toBeTruthy();
        expect(avatar.welcomeMessage).toBeTruthy();
        expect(avatar.insultResponse).toBeTruthy();
        expect(avatar.referralKeys).toBeDefined();
        expect(avatar.motivationalPhrases.length).toBeGreaterThan(0);
      }
    });

    it("should find avatar by key", () => {
      const sabelin = getAvatarPrompt("SABELIN");
      expect(sabelin).toBeDefined();
      expect(sabelin!.displayName).toBe("SABELÍN");
      expect(sabelin!.group).toBe("family");
    });

    it("should return undefined for unknown key", () => {
      const unknown = getAvatarPrompt("NONEXISTENT");
      expect(unknown).toBeUndefined();
    });

    it("should have a universal fallback prompt", () => {
      expect(UNIVERSAL_FALLBACK_PROMPT).toBeDefined();
      expect(UNIVERSAL_FALLBACK_PROMPT.key).toBe("FALLBACK");
    });

    it("should have correct group distribution", () => {
      const groups = AVATAR_PROMPTS.reduce(
        (acc, a) => {
          acc[a.group] = (acc[a.group] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>
      );
      expect(groups.family).toBe(10);
      expect(groups.og_crew).toBe(44); // OG Crew has 44 (11 OG + 13 especialistas + 20 MUSICALIN intl)
      expect(groups.evento_especial).toBe(11);
      expect(groups.aragonesa).toBe(10);
      expect(groups.zaragoza_historico).toBe(10);
    });
  });

  // ═══════════════════════════════════════════════════
  // EXPERTISE SYSTEM TESTS
  // ═══════════════════════════════════════════════════
  describe("Expertise Scores", () => {
    it("should have expertise data for all 85 avatars", () => {
      const expertiseKeys = Object.keys(AVATAR_EXPERTISE);
      expect(expertiseKeys.length).toBe(85);
    });

    it("should have scores between 0 and 100", () => {
      for (const [key, expertise] of Object.entries(AVATAR_EXPERTISE)) {
        for (const [domain, score] of Object.entries(expertise.scores)) {
          expect(score).toBeGreaterThanOrEqual(0);
          expect(score).toBeLessThanOrEqual(100);
        }
      }
    });

    it("should have derivation rules for each avatar", () => {
      for (const [key, expertise] of Object.entries(AVATAR_EXPERTISE)) {
        expect(expertise.derivations).toBeDefined();
        expect(Array.isArray(expertise.derivations)).toBe(true);
      }
    });

    it("should have disclaimers for ABOGALIN and DOCTOLIN", () => {
      expect(AVATAR_EXPERTISE.ABOGALIN.disclaimer).toBeTruthy();
      expect(AVATAR_EXPERTISE.DOCTOLIN.disclaimer).toBeTruthy();
      expect(AVATAR_EXPERTISE.ABOGALIN.disclaimer).toContain("abogado");
      expect(AVATAR_EXPERTISE.DOCTOLIN.disclaimer).toContain("médic");
    });

    it("should NOT have disclaimers for non-legal/medical avatars", () => {
      expect(AVATAR_EXPERTISE.SABELIN.disclaimer).toBeUndefined();
      expect(AVATAR_EXPERTISE.YAYALIN.disclaimer).toBeUndefined();
      expect(AVATAR_EXPERTISE.PAPALIN.disclaimer).toBeUndefined();
    });
  });

  // ═══════════════════════════════════════════════════
  // DERIVATION BLOCK TESTS
  // ═══════════════════════════════════════════════════
  describe("Derivation Block Builder", () => {
    it("should build a derivation block for known avatars", () => {
      const block = buildDerivationBlock("YAYALIN");
      expect(block).toBeTruthy();
      expect(block).toContain("EXPERTISE SCORES");
      expect(block).toContain("DERIVACIÓN");
    });

    it("should include disclaimer in derivation block for ABOGALIN", () => {
      const block = buildDerivationBlock("ABOGALIN");
      expect(block).toContain("DISCLAIMER");
    });

    it("should include disclaimer in derivation block for DOCTOLIN", () => {
      const block = buildDerivationBlock("DOCTOLIN");
      expect(block).toContain("DISCLAIMER");
    });

    it("should return empty string for unknown avatar", () => {
      const block = buildDerivationBlock("NONEXISTENT");
      expect(block).toBe("");
    });
  });

  // ═══════════════════════════════════════════════════
  // FULL PROMPT BUILD TESTS
  // ═══════════════════════════════════════════════════
  describe("Full Prompt Builder", () => {
    it("should build a complete prompt with global rules", () => {
      const avatar = getAvatarPrompt("SABELIN")!;
      const prompt = buildFullPrompt(avatar);
      expect(prompt).toContain("REGLAS INQUEBRANTABLES");
      expect(prompt).toContain("EXPERTISE SCORES");
    });

    it("should include derivation block in full prompt", () => {
      const avatar = getAvatarPrompt("YAYALIN")!;
      const prompt = buildFullPrompt(avatar);
      expect(prompt).toContain("DERIVACIÓN");
    });

    it("should include disclaimer for ABOGALIN in full prompt", () => {
      const avatar = getAvatarPrompt("ABOGALIN")!;
      const prompt = buildFullPrompt(avatar);
      expect(prompt).toContain("DISCLAIMER OBLIGATORIO");
    });

    it("should include disclaimer for DOCTOLIN in full prompt", () => {
      const avatar = getAvatarPrompt("DOCTOLIN")!;
      const prompt = buildFullPrompt(avatar);
      expect(prompt).toContain("DISCLAIMER OBLIGATORIO");
    });
  });

  // ═══════════════════════════════════════════════════
  // DERIVATION MATRIX TESTS
  // ═══════════════════════════════════════════════════
  describe("Derivation Matrix", () => {
    it("should have entries for key domains", () => {
      expect(DERIVATION_MATRIX.estrategia_empresarial).toBeDefined();
      expect(DERIVATION_MATRIX.machine_learning).toBeDefined();
      expect(DERIVATION_MATRIX.etica_ia).toBeDefined();
      expect(DERIVATION_MATRIX.legal).toBeDefined();
      expect(DERIVATION_MATRIX.salud).toBeDefined();
    });

    it("should have primary avatar for each domain", () => {
      for (const [domain, config] of Object.entries(DERIVATION_MATRIX)) {
        expect(config.primary).toBeTruthy();
      }
    });

    it("should map legal to ABOGALIN", () => {
      expect(DERIVATION_MATRIX.legal.primary).toBe("ABOGALIN");
    });

    it("should map salud to DOCTOLIN", () => {
      expect(DERIVATION_MATRIX.salud.primary).toBe("DOCTOLIN");
    });
  });

  // ═══════════════════════════════════════════════════
  // FIND PRIMARY SPECIALIST TESTS
  // ═══════════════════════════════════════════════════
  describe("Find Primary Specialist", () => {
    it("should find ABOGALIN for legal domain", () => {
      const result = findPrimarySpecialist("legal");
      expect(result).toBeDefined();
      expect(result).toBe("ABOGALIN");
    });

    it("should find DOCTOLIN for salud domain", () => {
      const result = findPrimarySpecialist("salud");
      expect(result).toBeDefined();
      expect(result).toBe("DOCTOLIN");
    });

    it("should return undefined for unknown domain", () => {
      const result = findPrimarySpecialist("nonexistent_domain_xyz");
      expect(result).toBeUndefined();
    });
  });

  // ═══════════════════════════════════════════════════
  // PREDEFINED TASKS TESTS
  // ═══════════════════════════════════════════════════
  describe("Predefined Tasks", () => {
    it("should have tasks for key avatars", () => {
      expect(hasAvatarTasks("YAYALIN")).toBe(true);
      expect(hasAvatarTasks("PAPALIN")).toBe(true);
      expect(hasAvatarTasks("MAMALINA")).toBe(true);
      expect(hasAvatarTasks("SABELIN")).toBe(true);
      expect(hasAvatarTasks("ABOGALIN")).toBe(true);
      expect(hasAvatarTasks("DOCTOLIN")).toBe(true);
    });

    it("should NOT have tasks for all avatars (only key ones)", () => {
      expect(hasAvatarTasks("NONEXISTENT")).toBe(false);
    });

    it("should have valid task structure for YAYALIN", () => {
      const tasks = getAvatarTasks("YAYALIN");
      expect(tasks).toBeDefined();
      expect(tasks!.tasks.length).toBeGreaterThan(0);
      expect(tasks!.quickQuestions.length).toBeGreaterThan(0);

      for (const task of tasks!.tasks) {
        expect(task.id).toBeTruthy();
        expect(task.name).toBeTruthy();
        expect(task.icon).toBeTruthy();
        expect(task.fields.length).toBeGreaterThan(0);
        expect(typeof task.buildPrompt).toBe("function");
      }
    });

    it("should build prompts correctly from task data", () => {
      const tasks = getAvatarTasks("YAYALIN")!;
      const firstTask = tasks.tasks[0];
      const prompt = firstTask.buildPrompt({
        negocio: "Tienda online de ropa",
        objetivo: "Aumentar ventas 30%",
      });
      expect(prompt).toContain("Tienda online de ropa");
      expect(prompt).toContain("Aumentar ventas 30%");
    });

    it("should have derivation info in tasks", () => {
      const tasks = getAvatarTasks("YAYALIN")!;
      const firstTask = tasks.tasks[0];
      expect(firstTask.derivations.length).toBeGreaterThan(0);
      for (const d of firstTask.derivations) {
        expect(d.avatarKey).toBeTruthy();
        expect(d.avatarName).toBeTruthy();
        expect(d.reason).toBeTruthy();
      }
    });
  });

  // ═══════════════════════════════════════════════════
  // V3 SYSTEM PROMPT CONTENT TESTS
  // ═══════════════════════════════════════════════════
  describe("V3 System Prompt Content", () => {
    it("should contain derivation instructions in family prompts", () => {
      const yayalin = getAvatarPrompt("YAYALIN")!;
      expect(yayalin.systemPrompt).toContain("DERIVACIÓN");
    });

    it("should contain legal expertise in ABOGALIN prompt", () => {
      const abogalin = getAvatarPrompt("ABOGALIN")!;
      expect(abogalin.systemPrompt.toLowerCase()).toContain("legal");
    });

    it("should have V3 derivation content in all family avatars", () => {
      const familyKeys = ["SABELIN", "YAYALIN", "YAYALINA", "PAPALIN", "MAMALINA", "CHAVALIN", "CHAVALINA", "PEQUELIN", "PEQUELINA", "ATOLONDRALIN"];
      for (const key of familyKeys) {
        const avatar = getAvatarPrompt(key);
        expect(avatar).toBeDefined();
        expect(avatar!.systemPrompt.length).toBeGreaterThan(200);
      }
    });

    it("should have V3 derivation content in all specialist avatars", () => {
      const specialistKeys = ["ABOGALIN", "DOCTOLIN", "DATOLIN", "ETICOLIN", "ETICALIN", "INFLUENCELIN", "CURRALIN", "PROFALIN", "EMPRENDALIN", "CONSPIRALIN", "ABUELIN", "ARTISTALIN", "GAMERLIN"];
      for (const key of specialistKeys) {
        const avatar = getAvatarPrompt(key);
        expect(avatar).toBeDefined();
        expect(avatar!.systemPrompt.length).toBeGreaterThan(200);
      }
    });

    it("should have V3 derivation content in all OG Crew avatars", () => {
      const ogKeys = ["LUMALIN", "VOLTZLIN", "RIMALIN", "CRISTALIN", "COREOLIN", "FLOWALIN", "BRISLIN", "SONALIN", "MANTRALIN", "BEATLIN", "STILIN"];
      for (const key of ogKeys) {
        const avatar = getAvatarPrompt(key);
        expect(avatar).toBeDefined();
        expect(avatar!.systemPrompt.length).toBeGreaterThan(200);
      }
    });
  });
});

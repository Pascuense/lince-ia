import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: {
      protocol: "https",
      headers: { "x-forwarded-for": "127.0.0.1" },
      ip: "127.0.0.1",
      socket: { remoteAddress: "127.0.0.1" },
    } as unknown as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as unknown as TrpcContext["res"],
  };
}

describe("avatarChat.listAvatars", () => {
  it("returns all 85 avatars with required fields", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const avatars = await caller.avatarChat.listAvatars();

    expect(avatars.length).toBe(85);
    for (const avatar of avatars) {
      expect(avatar.key).toBeTruthy();
      expect(avatar.displayName).toBeTruthy();
      expect(["family", "og_crew", "evento_especial", "aragonesa", "zaragoza_historico"]).toContain(avatar.group);
      expect(avatar.specialty).toBeTruthy();
      expect(avatar.responseStyle).toBeTruthy();
      expect(avatar.welcomeMessage).toBeTruthy();
    }
  });

  it("includes all three groups", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const avatars = await caller.avatarChat.listAvatars();

    const groups = new Set(avatars.map((a) => a.group));
    expect(groups.has("family")).toBe(true);
    expect(groups.has("og_crew")).toBe(true);
    expect(groups.has("evento_especial")).toBe(true);
  });

  it("does not include ALISTELIN", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const avatars = await caller.avatarChat.listAvatars();

    const keys = avatars.map((a) => a.key);
    expect(keys).not.toContain("ALISTELIN");
  });
});

describe("avatarChat.getAvatarInfo", () => {
  it("returns detailed info for LUMALIN", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const info = await caller.avatarChat.getAvatarInfo({ avatarKey: "LUMALIN" });

    expect(info.key).toBe("LUMALIN");
    expect(info.displayName).toBeTruthy();
    expect(info.group).toBe("og_crew");
    expect(info.specialty).toBeTruthy();
    expect(info.personality).toBeTruthy();
    expect(info.welcomeMessage).toBeTruthy();
    expect(info.motivationalPhrases.length).toBeGreaterThan(0);
  });

  it("returns detailed info for SABELIN (CEO LINCE)", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const info = await caller.avatarChat.getAvatarInfo({ avatarKey: "SABELIN" });

    expect(info.key).toBe("SABELIN");
    expect(info.group).toBe("family");
    expect(info.specialty).toBeTruthy();
    expect(info.welcomeMessage).toBeTruthy();
  });

  it("returns info for Evento Especial avatars", async () => {
    const eventoKeys = [
      "SIRENLIN", "ZOTEALIN", "PULSOLIN", "GRAFALIN", "CRONOSLIN",
      "GAMELIN", "TRAPZOLIN", "WAVELIN", "KUMEYLIN", "VERSOLIN",
    ];
    const caller = appRouter.createCaller(createPublicContext());

    for (const key of eventoKeys) {
      const info = await caller.avatarChat.getAvatarInfo({ avatarKey: key });
      expect(info.key).toBe(key);
      expect(info.group).toBe("evento_especial");
      expect(info.specialty).toBeTruthy();
    }
  });

  it("throws NOT_FOUND for invalid avatar key", async () => {
    const caller = appRouter.createCaller(createPublicContext());

    await expect(
      caller.avatarChat.getAvatarInfo({ avatarKey: "NONEXISTENT" })
    ).rejects.toThrow();
  });

  it("throws NOT_FOUND for ALISTELIN", async () => {
    const caller = appRouter.createCaller(createPublicContext());

    await expect(
      caller.avatarChat.getAvatarInfo({ avatarKey: "ALISTELIN" })
    ).rejects.toThrow();
  });
});

describe("avatarChat.sendMessage", () => {
  it("throws NOT_FOUND for invalid avatar key", async () => {
    const caller = appRouter.createCaller(createPublicContext());

    await expect(
      caller.avatarChat.sendMessage({
        avatarKey: "INVALID_AVATAR",
        message: "Hola",
        language: "es",
      })
    ).rejects.toThrow();
  });

  it("returns insult response for offensive messages", async () => {
    const caller = appRouter.createCaller(createPublicContext());

    const result = await caller.avatarChat.sendMessage({
      avatarKey: "LUMALIN",
      message: "eres un idiota",
      language: "es",
    });

    expect(result.isInsultResponse).toBe(true);
    expect(result.response).toBeTruthy();
    expect(result.avatarKey).toBe("LUMALIN");
  });

  it("returns insult response for English offensive messages", async () => {
    const caller = appRouter.createCaller(createPublicContext());

    const result = await caller.avatarChat.sendMessage({
      avatarKey: "RIMALIN",
      message: "you are stupid",
      language: "en",
    });

    expect(result.isInsultResponse).toBe(true);
    expect(result.response).toBeTruthy();
  });

  it("returns insult response for accented offensive words", async () => {
    const caller = appRouter.createCaller(createPublicContext());

    const result = await caller.avatarChat.sendMessage({
      avatarKey: "CRISTALIN",
      message: "eres un imbécil",
      language: "es",
    });

    expect(result.isInsultResponse).toBe(true);
  });

  it("rejects messages longer than 2000 characters", async () => {
    const caller = appRouter.createCaller(createPublicContext());

    await expect(
      caller.avatarChat.sendMessage({
        avatarKey: "LUMALIN",
        message: "a".repeat(2001),
        language: "es",
      })
    ).rejects.toThrow();
  });

  it("rejects empty messages", async () => {
    const caller = appRouter.createCaller(createPublicContext());

    await expect(
      caller.avatarChat.sendMessage({
        avatarKey: "LUMALIN",
        message: "",
        language: "es",
      })
    ).rejects.toThrow();
  });

  it("accepts valid history format", async () => {
    const caller = appRouter.createCaller(createPublicContext());

    // This should not throw for input validation (may fail on LLM call but that's expected)
    // We test insult path which doesn't call LLM
    const result = await caller.avatarChat.sendMessage({
      avatarKey: "LUMALIN",
      message: "eres un idiota tonto",
      history: [
        { role: "user", content: "Hola" },
        { role: "assistant", content: "¡Hola! Soy LUMALIN" },
      ],
      language: "es",
    });

    expect(result.isInsultResponse).toBe(true);
  });

  it("rejects history with more than 100 messages", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const longHistory = Array.from({ length: 101 }, (_, i) => ({
      role: (i % 2 === 0 ? "user" : "assistant") as "user" | "assistant",
      content: `Message ${i}`,
    }));

    await expect(
      caller.avatarChat.sendMessage({
        avatarKey: "LUMALIN",
        message: "Hola",
        history: longHistory,
        language: "es",
      })
    ).rejects.toThrow();
  });
});

describe("avatarChat - no Cristóbal Aliste references", () => {
  it("no avatar welcome message contains Cristóbal or Aliste", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const avatars = await caller.avatarChat.listAvatars();

    for (const avatar of avatars) {
      const lower = avatar.welcomeMessage.toLowerCase();
      expect(lower).not.toContain("cristóbal");
      expect(lower).not.toContain("cristobal");
      expect(lower).not.toContain("aliste");
    }
  });
});

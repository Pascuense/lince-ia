import { describe, expect, it } from "vitest";
import { AVATAR_PROMPTS } from "@shared/avatarPrompts";
import {
  ID_TO_AVATAR_KEY,
  getCharacterIdByAvatarKey,
  resolveChatDashboardReferralAction,
  toCanonicalAvatarKey,
} from "../client/src/lib/avatarRouting";

describe("avatarRouting integrity", () => {
  it("all Personajes mapping keys exist in shared avatar prompts", () => {
    const validAvatarKeys = new Set(AVATAR_PROMPTS.map((a) => a.key));

    for (const [characterId, avatarKey] of Object.entries(ID_TO_AVATAR_KEY)) {
      expect(
        validAvatarKeys.has(avatarKey),
        `${characterId} maps to invalid avatar key: ${avatarKey}`
      ).toBe(true);
    }
  });

  it("canonicalizes accented avatar keys", () => {
    expect(toCanonicalAvatarKey("papalín")).toBe("PAPALIN");
    expect(toCanonicalAvatarKey(" eticolín ")).toBe("ETICOLIN");
  });

  it("resolves character id from canonical avatar key", () => {
    expect(getCharacterIdByAvatarKey("SABELIN")).toBe("sabelin");
    expect(getCharacterIdByAvatarKey("sabelín")).toBe("sabelin");
  });
});

describe("ChatDashboard referral fallback", () => {
  it("returns local switch action when avatar exists in local list", () => {
    const action = resolveChatDashboardReferralAction(["YAYALIN", "PAPALIN"], "papalin");

    expect(action).toEqual({ kind: "switch", avatarKey: "PAPALIN" });
  });

  it("returns redirect action when avatar is not in local list", () => {
    const action = resolveChatDashboardReferralAction(["YAYALIN", "PAPALIN"], "lumalín");

    expect(action).toEqual({ kind: "redirect", path: "/personajes?ref=LUMALIN" });
  });
});

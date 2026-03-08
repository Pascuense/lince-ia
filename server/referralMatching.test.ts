import { describe, expect, it } from "vitest";
import { normalizeReferralText, resolveReferralFromResponse } from "./referralMatching";

describe("referralMatching", () => {
  it("normalizes accents and casing", () => {
    const normalized = normalizeReferralText("Papalín, ética y números");
    expect(normalized).toBe("PAPALIN ETICA Y NUMEROS");
  });

  it("matches referral when response mentions display name without accents", () => {
    const referral = resolveReferralFromResponse(
      "Te recomiendo hablar con Eticolin para profundizar en este tema.",
      ["ETICOLIN"]
    );

    expect(referral).toBeDefined();
    expect(referral?.key).toBe("ETICOLIN");
  });

  it("matches referral when response mentions canonical key", () => {
    const referral = resolveReferralFromResponse(
      "Si quieres codigo y modelos, PAPALIN te puede ayudar.",
      ["MAMALINA", "PAPALIN"]
    );

    expect(referral).toBeDefined();
    expect(referral?.key).toBe("PAPALIN");
  });

  it("uses referralKeys priority when multiple referrals are present", () => {
    const referral = resolveReferralFromResponse(
      "MAMALINA y PAPALIN te podrian ayudar con eso.",
      ["PAPALIN", "MAMALINA"]
    );

    expect(referral?.key).toBe("PAPALIN");
  });

  it("returns null when there is no referral mention", () => {
    const referral = resolveReferralFromResponse(
      "Vamos a resolverlo juntos paso a paso.",
      ["PAPALIN", "MAMALINA"]
    );

    expect(referral).toBeNull();
  });
});

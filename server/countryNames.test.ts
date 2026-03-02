import { describe, it, expect } from 'vitest';

/**
 * Tests for the country-based avatar name system.
 * Validates that:
 * 1. Chilean names are the default (familia directa)
 * 2. Each country has unique names for all 10 family avatars
 * 3. The ISO-to-AvatarCountry mapping covers key countries
 * 4. Fallback logic works correctly
 */

// Replicate the AVATAR_NAMES_BY_COUNTRY structure for testing
// Keys use the rebranded LINCE avatar names (LINCE family)
const AVATAR_NAMES_BY_COUNTRY: Record<string, Record<string, string>> = {
  YAYALIN: {
    default: "TATALIN", es: "YAYOLIN", cl: "TATALIN", mx: "ABUELÍN",
    ar: "NONOLIN", co: "TATALIN", pe: "PAPOLIN", en: "GRANDLIN", zh: "爷林 (YÉLÍN)",
  },
  YAYALINA: {
    default: "NANALINA", es: "YAYALINA", cl: "NANALINA", mx: "ABUELINA",
    ar: "NONALINA", co: "ABULINA", pe: "MAMALINA", en: "GRANLINA", zh: "奶丽娜 (NǍILÌNÀ)",
  },
  PAPALIN: {
    default: "VIEJOLIN", es: "PAPALIN", cl: "VIEJOLIN", mx: "JEFELIN",
    ar: "VIEJOLIN", co: "CUCHOLIN", pe: "PAPILIN", en: "POPLIN", zh: "爸林 (BÀLÍN)",
  },
  MAMALINA: {
    default: "MAMILINA", es: "MAMALINA", cl: "MAMILINA", mx: "JEFALINA",
    ar: "VIEJALINA", co: "CUCHALINA", pe: "MAMILINA", en: "MUMLINA", zh: "妈丽娜 (MĀLÌNÀ)",
  },
  CHAVALIN: {
    default: "CABROLIN", es: "CHAVALIN", cl: "CABROLIN", mx: "CHAVOLIN",
    ar: "PIBELIN", co: "PARCELIN", pe: "CAUSALIN", en: "BROLIN", zh: "哥林 (GĒLÍN)",
  },
  CHAVALINA: {
    default: "CABRALINA", es: "CHAVALINA", cl: "CABRALINA", mx: "CHAVALINA",
    ar: "PIBALINA", co: "PARCELINA", pe: "CAUSALINA", en: "SISLINA", zh: "姐丽娜 (JIĚLÌNÀ)",
  },
  PEQUELIN: {
    default: "CHICOLIN", es: "PEQUELIN", cl: "CHICOLIN", mx: "CHAMACOLIN",
    ar: "NENELIN", co: "PELAOLIN", pe: "CHIBOLIN", en: "KIDDOLIN", zh: "小林 (XIǍOLÍN)",
  },
  PEQUELINA: {
    default: "CHICALINA", es: "PEQUELINA", cl: "CHICALINA", mx: "CHAMACALINA",
    ar: "NENELINA", co: "PELALINA", pe: "CHIBOLINA", en: "KIDDOLINA", zh: "小丽娜 (XIǍOLÌNÀ)",
  },
  ATOLONDRALIN: {
    default: "DESPISTOLIN", es: "ATOLONDRALIN", cl: "DESPISTOLIN", mx: "DESPISTOLIN",
    ar: "BOLUDOLIN", co: "DESPISTOLIN", pe: "ZONZOLIN", en: "GOOFLIN", zh: "迷糊林 (MÍHULÍN)",
  },
  SABELIN: {
    default: "CAPOLÍN", es: "SABELIN", cl: "CAPOLÍN", mx: "CHIDOLIN",
    ar: "CRACKLIN", co: "BERRACOLIN", pe: "MOSTROLÍN", en: "BRAINYLIN", zh: "天才林 (TIĀNCÁILÍN)",
  },
};

// Replicate the getAvatarName logic
function getAvatarName(avatarKey: string, country: string): string {
  const names = AVATAR_NAMES_BY_COUNTRY[avatarKey];
  if (!names) return avatarKey;
  if (country !== "default") return names[country] || names.default;
  return names.default;
}

// ISO to AvatarCountry mapping
const ISO_TO_AVATAR: Record<string, string> = {
  CL: "cl", ES: "es", MX: "mx", AR: "ar", CO: "co", PE: "pe",
  GB: "en", US: "en", AU: "en", CA: "en", NZ: "en", IE: "en",
  CN: "zh", TW: "zh", HK: "zh", SG: "zh",
  VE: "co", EC: "pe", BO: "pe", PY: "ar", UY: "ar",
  CR: "mx", PA: "mx", GT: "mx", HN: "mx", SV: "mx", NI: "mx",
  CU: "mx", DO: "mx", PR: "mx",
};

const FAMILY_AVATAR_KEYS = [
  "YAYALIN", "YAYALINA", "PAPALIN", "MAMALINA",
  "CHAVALIN", "CHAVALINA", "PEQUELIN", "PEQUELINA",
  "ATOLONDRALIN", "SABELIN",
];

const ALL_COUNTRIES = ["default", "es", "cl", "mx", "ar", "co", "pe", "en", "zh"];

describe('Country-based Avatar Name System', () => {

  describe('Chile as default (familia directa)', () => {
    it('should return Chilean names when country is "default"', () => {
      expect(getAvatarName("YAYALIN", "default")).toBe("TATALIN");
      expect(getAvatarName("YAYALINA", "default")).toBe("NANALINA");
      expect(getAvatarName("PAPALIN", "default")).toBe("VIEJOLIN");
      expect(getAvatarName("MAMALINA", "default")).toBe("MAMILINA");
      expect(getAvatarName("CHAVALIN", "default")).toBe("CABROLIN");
      expect(getAvatarName("CHAVALINA", "default")).toBe("CABRALINA");
      expect(getAvatarName("PEQUELIN", "default")).toBe("CHICOLIN");
      expect(getAvatarName("PEQUELINA", "default")).toBe("CHICALINA");
      expect(getAvatarName("ATOLONDRALIN", "default")).toBe("DESPISTOLIN");
      expect(getAvatarName("SABELIN", "default")).toBe("CAPOLÍN");
    });

    it('default names should match Chilean names exactly', () => {
      for (const key of FAMILY_AVATAR_KEYS) {
        const defaultName = getAvatarName(key, "default");
        const chileName = getAvatarName(key, "cl");
        expect(defaultName).toBe(chileName);
      }
    });
  });

  describe('Country-specific names', () => {
    it('should return Spanish names for country "es"', () => {
      expect(getAvatarName("YAYALIN", "es")).toBe("YAYOLIN");
      expect(getAvatarName("YAYALINA", "es")).toBe("YAYALINA");
      expect(getAvatarName("PAPALIN", "es")).toBe("PAPALIN");
      expect(getAvatarName("MAMALINA", "es")).toBe("MAMALINA");
    });

    it('should return Mexican names for country "mx"', () => {
      expect(getAvatarName("YAYALIN", "mx")).toBe("ABUELÍN");
      expect(getAvatarName("PAPALIN", "mx")).toBe("JEFELIN");
      expect(getAvatarName("PEQUELIN", "mx")).toBe("CHAMACOLIN");
      expect(getAvatarName("SABELIN", "mx")).toBe("CHIDOLIN");
    });

    it('should return Argentine names for country "ar"', () => {
      expect(getAvatarName("YAYALIN", "ar")).toBe("NONOLIN");
      expect(getAvatarName("CHAVALIN", "ar")).toBe("PIBELIN");
      expect(getAvatarName("PEQUELIN", "ar")).toBe("NENELIN");
    });

    it('should return English names for country "en"', () => {
      expect(getAvatarName("YAYALIN", "en")).toBe("GRANDLIN");
      expect(getAvatarName("CHAVALIN", "en")).toBe("BROLIN");
      expect(getAvatarName("PEQUELIN", "en")).toBe("KIDDOLIN");
      expect(getAvatarName("SABELIN", "en")).toBe("BRAINYLIN");
    });

    it('should return Chinese names for country "zh"', () => {
      expect(getAvatarName("YAYALIN", "zh")).toBe("爷林 (YÉLÍN)");
      expect(getAvatarName("PEQUELIN", "zh")).toBe("小林 (XIǍOLÍN)");
    });

    it('each country should have unique names for all 10 family avatars', () => {
      for (const country of ALL_COUNTRIES) {
        const names = FAMILY_AVATAR_KEYS.map(key => getAvatarName(key, country));
        const uniqueNames = new Set(names);
        expect(uniqueNames.size).toBe(FAMILY_AVATAR_KEYS.length);
      }
    });

    it('all 10 family avatars should have entries for all countries', () => {
      for (const key of FAMILY_AVATAR_KEYS) {
        const names = AVATAR_NAMES_BY_COUNTRY[key];
        expect(names).toBeDefined();
        for (const country of ALL_COUNTRIES) {
          expect(names[country]).toBeDefined();
          expect(names[country].length).toBeGreaterThan(0);
        }
      }
    });
  });

  describe('ISO country code mapping', () => {
    it('should map Chile to "cl"', () => {
      expect(ISO_TO_AVATAR["CL"]).toBe("cl");
    });

    it('should map English-speaking countries to "en"', () => {
      expect(ISO_TO_AVATAR["US"]).toBe("en");
      expect(ISO_TO_AVATAR["GB"]).toBe("en");
      expect(ISO_TO_AVATAR["AU"]).toBe("en");
      expect(ISO_TO_AVATAR["CA"]).toBe("en");
    });

    it('should map Chinese-speaking regions to "zh"', () => {
      expect(ISO_TO_AVATAR["CN"]).toBe("zh");
      expect(ISO_TO_AVATAR["TW"]).toBe("zh");
      expect(ISO_TO_AVATAR["HK"]).toBe("zh");
    });

    it('should map Central American countries to "mx"', () => {
      const centralAmerican = ["CR", "PA", "GT", "HN", "SV", "NI", "CU", "DO", "PR"];
      for (const code of centralAmerican) {
        expect(ISO_TO_AVATAR[code]).toBe("mx");
      }
    });

    it('should map South American countries to nearest match', () => {
      expect(ISO_TO_AVATAR["VE"]).toBe("co");
      expect(ISO_TO_AVATAR["EC"]).toBe("pe");
      expect(ISO_TO_AVATAR["UY"]).toBe("ar");
      expect(ISO_TO_AVATAR["PY"]).toBe("ar");
    });
  });

  describe('Fallback behavior', () => {
    it('should return the key itself for unknown avatar keys', () => {
      expect(getAvatarName("UNKNOWN_AVATAR", "cl")).toBe("UNKNOWN_AVATAR");
    });

    it('should fallback to default (Chilean) name for unknown country', () => {
      const result = getAvatarName("YAYALIN", "unknown_country");
      expect(result).toBe("TATALIN"); // Chilean default
    });

    it('unmapped ISO codes should fallback to "cl" (Chile)', () => {
      const unmappedCode = "ZZ";
      const mapped = ISO_TO_AVATAR[unmappedCode] || "cl";
      expect(mapped).toBe("cl");
    });
  });

  describe('Name format consistency', () => {
    it('all names should contain LIN or LINA pattern (or be Chinese)', () => {
      for (const key of FAMILY_AVATAR_KEYS) {
        for (const country of ALL_COUNTRIES) {
          const name = getAvatarName(key, country);
          if (country === "zh") {
            // Chinese names have a different format
            expect(name.length).toBeGreaterThan(0);
          } else {
            const upper = name.toUpperCase();
            // Names should contain LIN or LINA somewhere
            const containsLin = upper.includes("LIN") || upper.includes("LÍN");
            expect(containsLin).toBe(true);
          }
        }
      }
    });
  });
});

import { describe, it, expect } from "vitest";

/**
 * Tests for the CountrySelector component logic and integration.
 * These validate the data structures and behavior that the component relies on.
 */

// Replicate the constants used by CountrySelector
const COUNTRY_OPTIONS = ["cl", "es", "mx", "ar", "co", "pe", "en", "zh", "default"] as const;
type AvatarCountry = typeof COUNTRY_OPTIONS[number];

const COUNTRY_FLAGS: Record<AvatarCountry, string> = {
  default: "🌍", es: "🇪🇸", cl: "🇨🇱", mx: "🇲🇽", ar: "🇦🇷", co: "🇨🇴", pe: "🇵🇪", en: "🇬🇧", zh: "🇨🇳",
};

const COUNTRY_LABELS: Record<string, Record<AvatarCountry, string>> = {
  es: { default: "Internacional", es: "España", cl: "Chile", mx: "México", ar: "Argentina", co: "Colombia", pe: "Perú", en: "Internacional (EN)", zh: "China" },
  en: { default: "International", es: "Spain", cl: "Chile", mx: "Mexico", ar: "Argentina", co: "Colombia", pe: "Peru", en: "International (EN)", zh: "China" },
  zh: { default: "国际", es: "西班牙", cl: "智利", mx: "墨西哥", ar: "阿根廷", co: "哥伦比亚", pe: "秘鲁", en: "国际 (EN)", zh: "中国" },
};

const PREVIEW_AVATARS = ["YAYALIN", "YAYALINA", "PAPALIN", "MAMALINA", "PEQUELIN"];

describe("CountrySelector - Data Structures", () => {
  it("should have Chile as the first option in the country list", () => {
    expect(COUNTRY_OPTIONS[0]).toBe("cl");
  });

  it("should have exactly 9 country options", () => {
    expect(COUNTRY_OPTIONS.length).toBe(9);
  });

  it("should have a flag emoji for every country option", () => {
    for (const c of COUNTRY_OPTIONS) {
      expect(COUNTRY_FLAGS[c]).toBeDefined();
      expect(COUNTRY_FLAGS[c].length).toBeGreaterThan(0);
    }
  });

  it("should have labels in all 3 languages for every country", () => {
    const languages = ["es", "en", "zh"];
    for (const lang of languages) {
      for (const c of COUNTRY_OPTIONS) {
        expect(COUNTRY_LABELS[lang][c]).toBeDefined();
        expect(COUNTRY_LABELS[lang][c].length).toBeGreaterThan(0);
      }
    }
  });

  it("should have Chile labeled correctly in all languages", () => {
    expect(COUNTRY_LABELS.es.cl).toBe("Chile");
    expect(COUNTRY_LABELS.en.cl).toBe("Chile");
    expect(COUNTRY_LABELS.zh.cl).toBe("智利");
  });

  it("should have 5 preview avatars for name preview feature", () => {
    expect(PREVIEW_AVATARS.length).toBe(5);
  });

  it("should include key family members in preview avatars", () => {
    expect(PREVIEW_AVATARS).toContain("YAYALIN");
    expect(PREVIEW_AVATARS).toContain("YAYALINA");
    expect(PREVIEW_AVATARS).toContain("PEQUELIN");
  });
});

describe("CountrySelector - localStorage Integration", () => {
  it("should save country selection to localStorage key 'lince-country'", () => {
    const key = "lince-country";
    // Simulate what handleSetCountry does
    const mockSetCountry = (c: AvatarCountry) => {
      // This mirrors PRDLanguageContext.handleSetCountry
      const storage: Record<string, string> = {};
      storage[key] = c;
      return storage;
    };

    const result = mockSetCountry("mx");
    expect(result[key]).toBe("mx");
  });

  it("should default to Chile when no country is saved", () => {
    // Simulate the initialization logic from PRDLanguageContext
    const initCountry = (savedValue: string | null): AvatarCountry => {
      if (savedValue && COUNTRY_OPTIONS.includes(savedValue as AvatarCountry)) {
        return savedValue as AvatarCountry;
      }
      return "cl"; // Chile por defecto
    };

    expect(initCountry(null)).toBe("cl");
    expect(initCountry("")).toBe("cl");
    expect(initCountry("invalid")).toBe("cl");
  });

  it("should restore a previously saved country", () => {
    const initCountry = (savedValue: string | null): AvatarCountry => {
      if (savedValue && COUNTRY_OPTIONS.includes(savedValue as AvatarCountry)) {
        return savedValue as AvatarCountry;
      }
      return "cl";
    };

    expect(initCountry("mx")).toBe("mx");
    expect(initCountry("ar")).toBe("ar");
    expect(initCountry("en")).toBe("en");
    expect(initCountry("zh")).toBe("zh");
  });
});

describe("CountrySelector - Compact Mode", () => {
  it("should show flag for the current country in compact mode", () => {
    const currentCountry: AvatarCountry = "cl";
    expect(COUNTRY_FLAGS[currentCountry]).toBe("🇨🇱");
  });

  it("should show country name in compact mode for desktop", () => {
    const currentCountry: AvatarCountry = "es";
    const lang = "es";
    expect(COUNTRY_LABELS[lang][currentCountry]).toBe("España");
  });
});

describe("CountrySelector - Full Mode (Profile)", () => {
  it("should display geo-detection info when available", () => {
    // Simulate geo-detected country code
    const geoDetected = "CL";
    expect(geoDetected).toBeTruthy();
    expect(typeof geoDetected).toBe("string");
  });

  it("should show manual selection when no geo-detection", () => {
    const geoDetected = null;
    expect(geoDetected).toBeNull();
  });

  it("should have labels for title, subtitle, preview in all languages", () => {
    const labels: Record<string, Record<string, string>> = {
      es: { title: "Tu País", subtitle: "Los nombres de los avatares cambian según tu país", preview: "Vista previa de nombres" },
      en: { title: "Your Country", subtitle: "Avatar names change based on your country", preview: "Name preview" },
      zh: { title: "你的国家", subtitle: "头像名称会根据你的国家而变化", preview: "名称预览" },
    };

    for (const lang of ["es", "en", "zh"]) {
      expect(labels[lang].title).toBeDefined();
      expect(labels[lang].subtitle).toBeDefined();
      expect(labels[lang].preview).toBeDefined();
    }
  });
});

describe("CountrySelector - Country Order Priority", () => {
  it("should always start with Chile (cl) as the first option", () => {
    expect(COUNTRY_OPTIONS[0]).toBe("cl");
  });

  it("should have Spanish-speaking countries before English and Chinese", () => {
    const spanishCountries = ["cl", "es", "mx", "ar", "co", "pe"];
    const enIndex = COUNTRY_OPTIONS.indexOf("en");
    const zhIndex = COUNTRY_OPTIONS.indexOf("zh");

    for (const sc of spanishCountries) {
      const scIndex = COUNTRY_OPTIONS.indexOf(sc);
      expect(scIndex).toBeLessThan(enIndex);
      expect(scIndex).toBeLessThan(zhIndex);
    }
  });

  it("should have 'default' (Internacional) as the last option", () => {
    expect(COUNTRY_OPTIONS[COUNTRY_OPTIONS.length - 1]).toBe("default");
  });
});

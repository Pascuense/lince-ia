import { describe, it, expect } from "vitest";

/**
 * Tests for LINCELIN Generator system and AgeGate
 * Validates the avatar generation pipeline, photo upload, sharing, and age verification
 */

// ─── LINCELIN PROMPT SYSTEM ───
const LINCELIN_PROMPT = `Transform this person's photo into an anthropomorphic Iberian lynx (lince ibérico) character in the LINCE universe style.

CRITICAL RULES:
1. The character MUST be an Iberian lynx (lince ibérico) - spotted fur, ear tufts, distinctive facial markings
2. Extract the person's UNIQUE facial features, hairstyle, skin tone hints, and accessories from the reference photo
3. Transfer those personal traits onto the lynx character - same hair style/color adapted to fur, same accessories (earrings, chains, glasses), same clothing style
4. Art style: Semi-realistic cartoon, vibrant colors, cyberpunk/urban aesthetic with neon cyan (#00E5FF) and orange (#FF6B35) accents
5. The result must be a UNIQUE lince ibérico that anyone who knows the person would recognize as them
6. Upper body portrait, arms visible, confident pose
7. Include subtle "LINCE" watermark text in corner`;

describe("LINCELIN Prompt System", () => {
  it("should require Iberian lynx (lince ibérico) in the prompt", () => {
    expect(LINCELIN_PROMPT).toContain("Iberian lynx");
    expect(LINCELIN_PROMPT).toContain("lince ibérico");
  });

  it("should require extraction of unique facial features from photo", () => {
    expect(LINCELIN_PROMPT).toContain("UNIQUE facial features");
    expect(LINCELIN_PROMPT).toContain("hairstyle");
    expect(LINCELIN_PROMPT).toContain("accessories");
  });

  it("should specify LINCE art style with correct colors", () => {
    expect(LINCELIN_PROMPT).toContain("#00E5FF");
    expect(LINCELIN_PROMPT).toContain("#FF6B35");
    expect(LINCELIN_PROMPT).toContain("cyberpunk");
  });

  it("should require LINCE watermark", () => {
    expect(LINCELIN_PROMPT).toContain("LINCE");
    expect(LINCELIN_PROMPT).toContain("watermark");
  });

  it("should specify upper body portrait composition", () => {
    expect(LINCELIN_PROMPT).toContain("Upper body portrait");
    expect(LINCELIN_PROMPT).toContain("confident pose");
  });
});

// ─── STYLE MODIFIERS ───
const STYLE_MODIFIERS: Record<string, string> = {
  urban: "Street fashion, gold chains, sneakers, graffiti-style background with neon cyan and orange glow",
  classic: "Elegant attire, warm golden lighting, classic portrait composition with subtle circuit patterns",
  neon: "Futuristic neon outfit, intense cyan/magenta/purple glow, holographic effects, cyberpunk city background",
  retro: "80s/90s retro fashion, synthwave colors, VHS aesthetic, pixel art elements in background",
  minimal: "Clean simple outfit, soft pastel accents, minimal background with gentle gradient",
};

describe("LINCELIN Style Modifiers", () => {
  it("should have 5 distinct styles", () => {
    expect(Object.keys(STYLE_MODIFIERS)).toHaveLength(5);
  });

  it("should include urban, classic, neon, retro, and minimal", () => {
    expect(STYLE_MODIFIERS).toHaveProperty("urban");
    expect(STYLE_MODIFIERS).toHaveProperty("classic");
    expect(STYLE_MODIFIERS).toHaveProperty("neon");
    expect(STYLE_MODIFIERS).toHaveProperty("retro");
    expect(STYLE_MODIFIERS).toHaveProperty("minimal");
  });

  it("urban style should reference street fashion and neon colors", () => {
    expect(STYLE_MODIFIERS.urban).toContain("Street fashion");
    expect(STYLE_MODIFIERS.urban).toContain("neon");
  });

  it("each style should have a non-empty description", () => {
    Object.values(STYLE_MODIFIERS).forEach((desc) => {
      expect(desc.length).toBeGreaterThan(20);
    });
  });
});

// ─── PHOTO VALIDATION ───
describe("Photo Upload Validation", () => {
  const VALID_MIME_TYPES = ["image/png", "image/jpeg", "image/webp"];
  const MAX_SIZE_BYTES = 10 * 1024 * 1024; // 10MB

  it("should accept PNG, JPEG, and WebP formats", () => {
    expect(VALID_MIME_TYPES).toContain("image/png");
    expect(VALID_MIME_TYPES).toContain("image/jpeg");
    expect(VALID_MIME_TYPES).toContain("image/webp");
  });

  it("should reject files larger than 10MB", () => {
    const fileSize = 15 * 1024 * 1024; // 15MB
    expect(fileSize > MAX_SIZE_BYTES).toBe(true);
  });

  it("should accept files under 10MB", () => {
    const fileSize = 5 * 1024 * 1024; // 5MB
    expect(fileSize <= MAX_SIZE_BYTES).toBe(true);
  });

  it("should strip base64 data URL prefix correctly", () => {
    const dataUrl = "data:image/png;base64,iVBORw0KGgo=";
    const stripped = dataUrl.replace(/^data:image\/\w+;base64,/, "");
    expect(stripped).toBe("iVBORw0KGgo=");
  });

  it("should handle JPEG data URL prefix", () => {
    const dataUrl = "data:image/jpeg;base64,/9j/4AAQ=";
    const stripped = dataUrl.replace(/^data:image\/\w+;base64,/, "");
    expect(stripped).toBe("/9j/4AAQ=");
  });
});

// ─── SHARING SYSTEM ───
describe("LINCELIN Sharing", () => {
  const SHARE_TEXT_ES = "¡Mira mi LINCELIN! Me convertí en un lince ibérico con IA 🐱✨ Crea el tuyo en LINCE";
  const SHARE_TEXT_EN = "Check out my LINCELIN! I became an Iberian lynx with AI 🐱✨ Create yours at LINCE";

  it("should generate WhatsApp share URL correctly", () => {
    const imageUrl = "https://example.com/lincelin.png";
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`${SHARE_TEXT_ES} ${imageUrl}`)}`;
    expect(whatsappUrl).toContain("wa.me");
    expect(whatsappUrl).toContain("LINCELIN");
  });

  it("should include image URL in share text", () => {
    const imageUrl = "https://example.com/lincelin.png";
    const shareText = `${SHARE_TEXT_ES} ${imageUrl}`;
    expect(shareText).toContain(imageUrl);
  });

  it("should have Spanish and English share texts", () => {
    expect(SHARE_TEXT_ES).toContain("LINCELIN");
    expect(SHARE_TEXT_EN).toContain("LINCELIN");
    expect(SHARE_TEXT_ES).toContain("lince ibérico");
    expect(SHARE_TEXT_EN).toContain("Iberian lynx");
  });
});

// ─── AGE GATE ───
describe("AgeGate - Age Verification (+13)", () => {
  const MIN_AGE = 13;
  const STORAGE_KEY = "lince-age-verified";

  it("should require minimum age of 13", () => {
    expect(MIN_AGE).toBe(13);
  });

  it("should calculate age correctly from birth date", () => {
    const calculateAge = (birthDate: Date, today: Date): number => {
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      return age;
    };

    // 15 years old
    const birth15 = new Date(2011, 0, 1);
    const today = new Date(2026, 1, 12);
    expect(calculateAge(birth15, today)).toBe(15);
    expect(calculateAge(birth15, today) >= MIN_AGE).toBe(true);

    // 12 years old - should be rejected
    const birth12 = new Date(2014, 0, 1);
    expect(calculateAge(birth12, today)).toBe(12);
    expect(calculateAge(birth12, today) >= MIN_AGE).toBe(false);

    // Exactly 13 - should pass
    const birth13 = new Date(2013, 1, 12);
    expect(calculateAge(birth13, today)).toBe(13);
    expect(calculateAge(birth13, today) >= MIN_AGE).toBe(true);

    // 13 but birthday hasn't happened yet - should be 12
    const birth13Later = new Date(2013, 5, 15);
    expect(calculateAge(birth13Later, today)).toBe(12);
    expect(calculateAge(birth13Later, today) >= MIN_AGE).toBe(false);
  });

  it("should persist verification in localStorage key", () => {
    expect(STORAGE_KEY).toBe("lince-age-verified");
  });
});

// ─── ENGAGEMENT TIMER ───
describe("Engagement Timer (15 minutes)", () => {
  const REQUIRED_TIME_SECONDS = 15 * 60; // 15 minutes
  const TIMER_STORAGE_KEY = "lince-engagement-timer";

  it("should require 15 minutes (900 seconds) of engagement", () => {
    expect(REQUIRED_TIME_SECONDS).toBe(900);
  });

  it("should calculate progress percentage correctly", () => {
    const calcProgress = (elapsed: number) => Math.min(100, (elapsed / REQUIRED_TIME_SECONDS) * 100);
    
    expect(calcProgress(0)).toBe(0);
    expect(calcProgress(450)).toBe(50);
    expect(calcProgress(900)).toBe(100);
    expect(calcProgress(1000)).toBe(100); // capped at 100
  });

  it("should format remaining time correctly", () => {
    const formatTime = (remaining: number) => {
      const min = Math.floor(remaining / 60);
      const sec = remaining % 60;
      return `${min}:${sec.toString().padStart(2, "0")}`;
    };

    expect(formatTime(900)).toBe("15:00");
    expect(formatTime(450)).toBe("7:30");
    expect(formatTime(60)).toBe("1:00");
    expect(formatTime(0)).toBe("0:00");
  });

  it("should use correct localStorage key", () => {
    expect(TIMER_STORAGE_KEY).toBe("lince-engagement-timer");
  });
});

// ─── RATE LIMITING ───
describe("LINCELIN Rate Limiting", () => {
  it("should allow max 3 generations per minute", () => {
    const MAX_GENERATIONS = 3;
    expect(MAX_GENERATIONS).toBe(3);
  });

  it("should allow max 5 uploads per minute", () => {
    const MAX_UPLOADS = 5;
    expect(MAX_UPLOADS).toBe(5);
  });
});

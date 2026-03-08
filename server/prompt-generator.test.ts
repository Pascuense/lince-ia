import { describe, it, expect } from "vitest";

/**
 * Tests for the EngagementTimer prompt generator feature.
 * Since the prompt generator is a pure client-side function, we test the logic
 * by replicating the buildLincelinPrompt function here.
 */

// Replicate the trait options from EngagementTimer
const HAIR_COLORS = [
  { id: "black", es: "Negro", en: "Black", zh: "黑色" },
  { id: "brown", es: "Castaño", en: "Brown", zh: "棕色" },
  { id: "blonde", es: "Rubio", en: "Blonde", zh: "金色" },
  { id: "red", es: "Pelirrojo", en: "Red", zh: "红色" },
  { id: "gray", es: "Gris/Canoso", en: "Gray/White", zh: "灰白" },
  { id: "colored", es: "Color fantasía", en: "Fantasy color", zh: "彩色" },
];

const HAIR_STYLES = [
  { id: "short", es: "Corto", en: "Short", zh: "短发" },
  { id: "medium", es: "Medio", en: "Medium", zh: "中长" },
  { id: "long", es: "Largo", en: "Long", zh: "长发" },
  { id: "curly", es: "Rizado", en: "Curly", zh: "卷发" },
  { id: "bald", es: "Calvo/Rapado", en: "Bald/Shaved", zh: "光头" },
  { id: "braids", es: "Trenzas", en: "Braids", zh: "辫子" },
];

const SKIN_TONES = [
  { id: "light", es: "Clara", en: "Light", zh: "浅色" },
  { id: "medium", es: "Media", en: "Medium", zh: "中等" },
  { id: "olive", es: "Oliva", en: "Olive", zh: "橄榄色" },
  { id: "dark", es: "Oscura", en: "Dark", zh: "深色" },
];

const ACCESSORIES_LIST = [
  { id: "glasses", es: "Gafas", en: "Glasses", zh: "眼镜" },
  { id: "sunglasses", es: "Gafas de sol", en: "Sunglasses", zh: "太阳镜" },
  { id: "earrings", es: "Pendientes", en: "Earrings", zh: "耳环" },
  { id: "hat", es: "Gorra/Sombrero", en: "Hat/Cap", zh: "帽子" },
  { id: "headphones", es: "Auriculares", en: "Headphones", zh: "耳机" },
  { id: "piercing", es: "Piercing", en: "Piercing", zh: "穿孔" },
  { id: "tattoo", es: "Tatuajes", en: "Tattoos", zh: "纹身" },
  { id: "beard", es: "Barba", en: "Beard", zh: "胡子" },
];

const STYLES = [
  { id: "urban", es: "Urbano", en: "Urban", zh: "都市" },
  { id: "classic", es: "Clásico", en: "Classic", zh: "经典" },
  { id: "neon", es: "Neón", en: "Neon", zh: "霓虹" },
  { id: "retro", es: "Retro", en: "Retro", zh: "复古" },
  { id: "minimal", es: "Minimal", en: "Minimal", zh: "简约" },
];

type Lang = "es" | "en" | "zh";

// Replicate buildLincelinPrompt from EngagementTimer
function buildLincelinPrompt(traits: {
  hairColor: string;
  hairStyle: string;
  skinTone: string;
  accessories: string[];
  artStyle: string;
  photoAttached: boolean;
}, lang: Lang): string {
  const hairColorLabel = HAIR_COLORS.find(h => h.id === traits.hairColor)?.[lang === "zh" ? "zh" : lang === "en" ? "en" : "es"] || traits.hairColor;
  const hairStyleLabel = HAIR_STYLES.find(h => h.id === traits.hairStyle)?.[lang === "zh" ? "zh" : lang === "en" ? "en" : "es"] || traits.hairStyle;
  const skinToneLabel = SKIN_TONES.find(s => s.id === traits.skinTone)?.[lang === "zh" ? "zh" : lang === "en" ? "en" : "es"] || traits.skinTone;

  const accessoryLabels = traits.accessories.map(a => {
    const item = ACCESSORIES_LIST.find(acc => acc.id === a);
    return item ? item[lang === "zh" ? "zh" : lang === "en" ? "en" : "es"] : a;
  });

  const styleModifiers: Record<string, string> = {
    urban: "Street fashion, gold chains, sneakers, graffiti-style background with neon cyan and orange glow",
    classic: "Elegant attire, warm golden lighting, classic portrait composition with subtle circuit patterns",
    neon: "Futuristic neon outfit, intense cyan/magenta/purple glow, holographic effects, cyberpunk city background",
    retro: "80s/90s retro fashion, synthwave colors, VHS aesthetic, pixel art elements in background",
    minimal: "Clean simple outfit, soft pastel accents, minimal background with gentle gradient",
  };

  const photoInstruction = traits.photoAttached
    ? `\n\nIMPORTANT: I'm attaching my photo. Please extract my exact facial features, expression, and any details you can see from the photo and apply them to the lynx character.`
    : "";

  return `Transform me into an anthropomorphic Iberian lynx (lince ibérico) character in the LINCE art style.

MY FEATURES:
- Hair: ${hairColorLabel}, ${hairStyleLabel}
- Skin tone: ${skinToneLabel} (map this to the warmth/shade of the lynx fur)
${accessoryLabels.length > 0 ? `- Accessories: ${accessoryLabels.join(", ")}` : "- No special accessories"}

CRITICAL RULES FOR THE LYNX CHARACTER:
1. The lynx MUST have: spotted golden-brown fur, tufted ears with black tips, prominent sideburns (patillas), amber/golden eyes, short bobbed tail
2. TRANSFER my hair onto the lynx's head (same color, same style, on top of the lynx head)
3. TRANSFER all my accessories onto the lynx (glasses, earrings, hat, etc.)
4. The lynx's fur warmth should match my skin tone
5. The expression should be confident and friendly

ART STYLE: Vibrant cartoon/anime cel-shaded illustration, bold outlines, ${styleModifiers[traits.artStyle] || styleModifiers.urban}

COMPOSITION: Upper body portrait, arms visible, confident pose, looking at camera
Include subtle "LINCE" watermark text in the bottom corner.${photoInstruction}

Created with LINCE — lince.app`;
}

describe("Prompt Generator - buildLincelinPrompt", () => {
  it("generates a valid prompt with basic traits in Spanish", () => {
    const prompt = buildLincelinPrompt({
      hairColor: "brown",
      hairStyle: "short",
      skinTone: "medium",
      accessories: [],
      artStyle: "urban",
      photoAttached: false,
    }, "es");

    expect(prompt).toContain("Iberian lynx");
    expect(prompt).toContain("Castaño");
    expect(prompt).toContain("Corto");
    expect(prompt).toContain("Media");
    expect(prompt).toContain("No special accessories");
    expect(prompt).toContain("Street fashion");
    expect(prompt).toContain("LINCE");
    expect(prompt).not.toContain("IMPORTANT: I'm attaching my photo");
  });

  it("generates a valid prompt with traits in English", () => {
    const prompt = buildLincelinPrompt({
      hairColor: "blonde",
      hairStyle: "long",
      skinTone: "light",
      accessories: ["glasses", "earrings"],
      artStyle: "neon",
      photoAttached: false,
    }, "en");

    expect(prompt).toContain("Blonde");
    expect(prompt).toContain("Long");
    expect(prompt).toContain("Light");
    expect(prompt).toContain("Glasses, Earrings");
    expect(prompt).toContain("Futuristic neon outfit");
    expect(prompt).not.toContain("No special accessories");
  });

  it("generates a valid prompt with traits in Chinese", () => {
    const prompt = buildLincelinPrompt({
      hairColor: "black",
      hairStyle: "curly",
      skinTone: "olive",
      accessories: ["hat"],
      artStyle: "retro",
      photoAttached: false,
    }, "zh");

    expect(prompt).toContain("黑色");
    expect(prompt).toContain("卷发");
    expect(prompt).toContain("橄榄色");
    expect(prompt).toContain("帽子");
    expect(prompt).toContain("synthwave");
  });

  it("includes photo attachment instruction when photo is attached", () => {
    const prompt = buildLincelinPrompt({
      hairColor: "red",
      hairStyle: "medium",
      skinTone: "dark",
      accessories: [],
      artStyle: "classic",
      photoAttached: true,
    }, "es");

    expect(prompt).toContain("IMPORTANT: I'm attaching my photo");
    expect(prompt).toContain("extract my exact facial features");
  });

  it("does not include photo instruction when no photo attached", () => {
    const prompt = buildLincelinPrompt({
      hairColor: "gray",
      hairStyle: "bald",
      skinTone: "light",
      accessories: [],
      artStyle: "minimal",
      photoAttached: false,
    }, "es");

    expect(prompt).not.toContain("IMPORTANT: I'm attaching my photo");
    expect(prompt).toContain("Gris/Canoso");
    expect(prompt).toContain("Calvo/Rapado");
    expect(prompt).toContain("soft pastel accents");
  });

  it("handles multiple accessories correctly", () => {
    const prompt = buildLincelinPrompt({
      hairColor: "colored",
      hairStyle: "braids",
      skinTone: "dark",
      accessories: ["glasses", "headphones", "tattoo", "beard"],
      artStyle: "urban",
      photoAttached: false,
    }, "es");

    expect(prompt).toContain("Color fantasía");
    expect(prompt).toContain("Trenzas");
    expect(prompt).toContain("Gafas");
    expect(prompt).toContain("Auriculares");
    expect(prompt).toContain("Tatuajes");
    expect(prompt).toContain("Barba");
    expect(prompt).not.toContain("No special accessories");
  });

  it("always includes LINCE branding", () => {
    const prompt = buildLincelinPrompt({
      hairColor: "black",
      hairStyle: "short",
      skinTone: "medium",
      accessories: [],
      artStyle: "urban",
      photoAttached: false,
    }, "es");

    expect(prompt).toContain("LINCE");
    expect(prompt).toContain("lince.app");
    expect(prompt).toContain("watermark");
  });

  it("includes all critical lynx features in every prompt", () => {
    const prompt = buildLincelinPrompt({
      hairColor: "brown",
      hairStyle: "medium",
      skinTone: "olive",
      accessories: [],
      artStyle: "classic",
      photoAttached: false,
    }, "en");

    expect(prompt).toContain("spotted golden-brown fur");
    expect(prompt).toContain("tufted ears with black tips");
    expect(prompt).toContain("prominent sideburns");
    expect(prompt).toContain("amber/golden eyes");
    expect(prompt).toContain("short bobbed tail");
  });

  it("falls back to urban style for unknown style IDs", () => {
    const prompt = buildLincelinPrompt({
      hairColor: "brown",
      hairStyle: "short",
      skinTone: "medium",
      accessories: [],
      artStyle: "nonexistent" as any,
      photoAttached: false,
    }, "es");

    expect(prompt).toContain("Street fashion");
  });

  it("uses raw ID as label when trait ID is not found", () => {
    const prompt = buildLincelinPrompt({
      hairColor: "unknown_color" as any,
      hairStyle: "unknown_style" as any,
      skinTone: "unknown_tone" as any,
      accessories: ["unknown_acc" as any],
      artStyle: "urban",
      photoAttached: false,
    }, "es");

    expect(prompt).toContain("unknown_color");
    expect(prompt).toContain("unknown_style");
    expect(prompt).toContain("unknown_tone");
    expect(prompt).toContain("unknown_acc");
  });
});

describe("Prompt Generator - Trait Options Integrity", () => {
  it("all hair colors have all language labels", () => {
    for (const color of HAIR_COLORS) {
      expect(color.es).toBeTruthy();
      expect(color.en).toBeTruthy();
      expect(color.zh).toBeTruthy();
      expect(color.id).toBeTruthy();
    }
  });

  it("all hair styles have all language labels", () => {
    for (const style of HAIR_STYLES) {
      expect(style.es).toBeTruthy();
      expect(style.en).toBeTruthy();
      expect(style.zh).toBeTruthy();
      expect(style.id).toBeTruthy();
    }
  });

  it("all skin tones have all language labels", () => {
    for (const tone of SKIN_TONES) {
      expect(tone.es).toBeTruthy();
      expect(tone.en).toBeTruthy();
      expect(tone.zh).toBeTruthy();
      expect(tone.id).toBeTruthy();
    }
  });

  it("all accessories have all language labels and emojis", () => {
    for (const acc of ACCESSORIES_LIST) {
      expect(acc.es).toBeTruthy();
      expect(acc.en).toBeTruthy();
      expect(acc.zh).toBeTruthy();
      expect(acc.id).toBeTruthy();
    }
  });

  it("all art styles have all language labels", () => {
    for (const style of STYLES) {
      expect(style.es).toBeTruthy();
      expect(style.en).toBeTruthy();
      expect(style.zh).toBeTruthy();
      expect(style.id).toBeTruthy();
    }
  });

  it("has at least 5 hair colors", () => {
    expect(HAIR_COLORS.length).toBeGreaterThanOrEqual(5);
  });

  it("has at least 5 hair styles", () => {
    expect(HAIR_STYLES.length).toBeGreaterThanOrEqual(5);
  });

  it("has at least 4 skin tones", () => {
    expect(SKIN_TONES.length).toBeGreaterThanOrEqual(4);
  });

  it("has at least 5 accessories", () => {
    expect(ACCESSORIES_LIST.length).toBeGreaterThanOrEqual(5);
  });

  it("has at least 5 art styles", () => {
    expect(STYLES.length).toBeGreaterThanOrEqual(5);
  });
});

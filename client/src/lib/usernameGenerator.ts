/**
 * Username generator for LINCE.
 * Generates country-specific LINCE usernames from real names.
 * Each country has its own suffix style.
 */

// Country-specific suffix configurations
const COUNTRY_SUFFIXES: Record<string, { suffixes: string[]; style: string }> = {
  // Spanish-speaking countries
  ES: { suffixes: ["LIN", "LINA", "OLIN", "ELIN"], style: "spanish" },
  CL: { suffixes: ["LIN", "LINA", "OLIN", "ELIN"], style: "spanish" },
  AR: { suffixes: ["LIN", "LINA", "OLIN", "ELIN"], style: "spanish" },
  MX: { suffixes: ["LIN", "LINA", "OLIN", "ELIN"], style: "spanish" },
  CO: { suffixes: ["LIN", "LINA", "OLIN", "ELIN"], style: "spanish" },
  PE: { suffixes: ["LIN", "LINA", "OLIN", "ELIN"], style: "spanish" },
  EC: { suffixes: ["LIN", "LINA", "OLIN", "ELIN"], style: "spanish" },
  VE: { suffixes: ["LIN", "LINA", "OLIN", "ELIN"], style: "spanish" },
  UY: { suffixes: ["LIN", "LINA", "OLIN", "ELIN"], style: "spanish" },
  PY: { suffixes: ["LIN", "LINA", "OLIN", "ELIN"], style: "spanish" },
  BO: { suffixes: ["LIN", "LINA", "OLIN", "ELIN"], style: "spanish" },
  CR: { suffixes: ["LIN", "LINA", "OLIN", "ELIN"], style: "spanish" },
  PA: { suffixes: ["LIN", "LINA", "OLIN", "ELIN"], style: "spanish" },
  DO: { suffixes: ["LIN", "LINA", "OLIN", "ELIN"], style: "spanish" },
  GT: { suffixes: ["LIN", "LINA", "OLIN", "ELIN"], style: "spanish" },
  HN: { suffixes: ["LIN", "LINA", "OLIN", "ELIN"], style: "spanish" },
  SV: { suffixes: ["LIN", "LINA", "OLIN", "ELIN"], style: "spanish" },
  NI: { suffixes: ["LIN", "LINA", "OLIN", "ELIN"], style: "spanish" },
  CU: { suffixes: ["LIN", "LINA", "OLIN", "ELIN"], style: "spanish" },
  PR: { suffixes: ["LIN", "LINA", "OLIN", "ELIN"], style: "spanish" },
  // English-speaking
  US: { suffixes: ["LYNX", "LYN", "LINX", "LYNCE"], style: "english" },
  GB: { suffixes: ["LYNX", "LYN", "LINX", "LYNCE"], style: "english" },
  CA: { suffixes: ["LYNX", "LYN", "LINX", "LYNCE"], style: "english" },
  AU: { suffixes: ["LYNX", "LYN", "LINX", "LYNCE"], style: "english" },
  NZ: { suffixes: ["LYNX", "LYN", "LINX", "LYNCE"], style: "english" },
  IE: { suffixes: ["LYNX", "LYN", "LINX", "LYNCE"], style: "english" },
  // Chinese
  CN: { suffixes: ["LINX", "LIN", "LYNX", "LING"], style: "chinese" },
  TW: { suffixes: ["LINX", "LIN", "LYNX", "LING"], style: "chinese" },
  HK: { suffixes: ["LINX", "LIN", "LYNX", "LING"], style: "chinese" },
  // Portuguese
  BR: { suffixes: ["LINCE", "LIN", "LINA", "OLIN"], style: "portuguese" },
  PT: { suffixes: ["LINCE", "LIN", "LINA", "OLIN"], style: "portuguese" },
  // French
  FR: { suffixes: ["LYNX", "LIN", "LINA", "ELIN"], style: "french" },
  BE: { suffixes: ["LYNX", "LIN", "LINA", "ELIN"], style: "french" },
  CH: { suffixes: ["LYNX", "LIN", "LINA", "ELIN"], style: "french" },
  // German
  DE: { suffixes: ["LUCHS", "LIN", "LYNX", "ELIN"], style: "german" },
  AT: { suffixes: ["LUCHS", "LIN", "LYNX", "ELIN"], style: "german" },
  // Italian
  IT: { suffixes: ["LINCE", "LIN", "LINA", "OLIN"], style: "italian" },
  // Japanese
  JP: { suffixes: ["LINX", "LIN", "LYNX", "LING"], style: "japanese" },
  // Korean
  KR: { suffixes: ["LINX", "LIN", "LYNX", "LING"], style: "korean" },
  // Default
  DEFAULT: { suffixes: ["LIN", "LINA", "OLIN", "ELIN"], style: "spanish" },
};

function removeAccents(s: string): string {
  return s.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function spanishSyllables(word: string): string[] {
  const v = "AEIOU";
  const syls: string[] = [];
  let cur = "";
  for (let i = 0; i < word.length; i++) {
    cur += word[i];
    if (!v.includes(word[i])) continue;
    const next = word[i + 1];
    const next2 = word[i + 2];
    if (!next) { syls.push(cur); cur = ""; break; }
    if (v.includes(next)) {
      syls.push(cur); cur = "";
    } else if (next2 && !v.includes(next2)) {
      cur += next; syls.push(cur); cur = ""; i++;
    } else if (next2 && v.includes(next2)) {
      syls.push(cur); cur = "";
    }
  }
  if (cur) syls.push(cur);
  return syls.filter(s => s.length > 0);
}

/**
 * Generate LINCE usernames based on the user's country.
 * Each country gets localized suffixes for the LINCE family.
 */
export function generateLinUsernames(name: string, countryCode?: string): string[] {
  const raw = name.trim().toUpperCase().replace(/[^A-ZÁÉÍÓÚÑÜ ]/gi, "");
  const config = COUNTRY_SUFFIXES[countryCode || "ES"] || COUNTRY_SUFFIXES.DEFAULT;
  const mainSuffix = config.suffixes[0];
  const altSuffix = config.suffixes[1];

  if (!raw || raw.length < 2) {
    return [
      `LINCE${mainSuffix}`,
      `LINCE${altSuffix}`,
      `LINCE${mainSuffix}`,
      `LINCEIA${mainSuffix}`,
      `LINCE${altSuffix}A`,
    ];
  }

  const clean = removeAccents(raw);
  const syls = spanishSyllables(clean);
  const candidates = new Set<string>();

  // 1. Full name + main suffix
  if (clean.length <= 8) {
    candidates.add(clean + mainSuffix);
    candidates.add(clean + altSuffix);
  }

  // 2. Name minus last vowel/char + suffix
  const trimmed = clean.replace(/[AEIOU]+$/, "");
  if (trimmed.length >= 2 && trimmed !== clean) {
    candidates.add(trimmed + mainSuffix);
    candidates.add(trimmed + altSuffix);
  }

  // 3. Second half of name + suffix
  if (syls.length >= 2) {
    const half2 = syls.slice(Math.ceil(syls.length / 2)).join("");
    if (half2.length >= 2) {
      candidates.add(half2 + mainSuffix);
      candidates.add(half2 + altSuffix);
    }
    const from2 = syls.slice(1).join("");
    if (from2.length >= 2 && from2 !== half2) {
      candidates.add(from2 + mainSuffix);
      candidates.add(from2 + altSuffix);
    }
  }

  // 4. First syllable(s) up to 4-5 chars + suffix
  let pref = "";
  for (const s of syls) {
    if ((pref + s).length <= 5) pref += s;
    else break;
  }
  if (pref.length >= 2) {
    candidates.add(pref + mainSuffix);
    candidates.add(pref + altSuffix);
  }

  // 5. First 2-3 chars + O + main suffix
  const p2 = clean.slice(0, 2);
  const p3 = clean.slice(0, Math.min(3, clean.length));
  candidates.add(p3 + "O" + mainSuffix);
  candidates.add(p2 + "O" + mainSuffix);

  // 6. Diminutive style with country suffix
  if (syls.length >= 1 && syls[0].length >= 2) {
    candidates.add(syls[0] + "E" + mainSuffix);
    if (config.suffixes[2]) {
      candidates.add(syls[0] + config.suffixes[2]);
    }
  }

  // 7. Short names
  if (clean.length <= 4) {
    candidates.add(clean + "O" + mainSuffix);
    candidates.add(clean + "O" + altSuffix);
  }

  // Filter & rank
  let results = Array.from(candidates)
    .filter(n => n.length >= 5 && n.length <= 16)
    .filter(n => {
      return config.suffixes.some(s => n.endsWith(s));
    });

  results.sort((a, b) => {
    const idealA = Math.abs(a.length - 8);
    const idealB = Math.abs(b.length - 8);
    return idealA - idealB;
  });

  results = Array.from(new Set(results)).slice(0, 6);

  // IA suffix fallback
  if (results.length < 6) {
    const iaVariants = [
      clean.slice(0, 4) + "IA" + mainSuffix,
      clean.slice(0, 3) + "IA" + altSuffix,
      p2 + "IA" + altSuffix,
    ].filter(n => n.length >= 6 && n.length <= 16);
    for (const v of iaVariants) {
      if (results.length >= 6) break;
      if (!results.includes(v)) results.push(v);
    }
  }

  return results.slice(0, 6);
}

/**
 * Get the list of available countries with their labels and flags.
 */
export const COUNTRIES = [
  { code: "ES", flag: "\ud83c\uddea\ud83c\uddf8", label: { es: "Espa\u00f1a", en: "Spain", zh: "\u897f\u73ed\u7259" } },
  { code: "CL", flag: "\ud83c\udde8\ud83c\uddf1", label: { es: "Chile", en: "Chile", zh: "\u667a\u5229" } },
  { code: "AR", flag: "\ud83c\udde6\ud83c\uddf7", label: { es: "Argentina", en: "Argentina", zh: "\u963f\u6839\u5ef7" } },
  { code: "MX", flag: "\ud83c\uddf2\ud83c\uddfd", label: { es: "M\u00e9xico", en: "Mexico", zh: "\u58a8\u897f\u54e5" } },
  { code: "CO", flag: "\ud83c\udde8\ud83c\uddf4", label: { es: "Colombia", en: "Colombia", zh: "\u54e5\u4f26\u6bd4\u4e9a" } },
  { code: "PE", flag: "\ud83c\uddf5\ud83c\uddea", label: { es: "Per\u00fa", en: "Peru", zh: "\u79d8\u9c81" } },
  { code: "EC", flag: "\ud83c\uddea\ud83c\udde8", label: { es: "Ecuador", en: "Ecuador", zh: "\u5384\u74dc\u591a\u5c14" } },
  { code: "VE", flag: "\ud83c\uddfb\ud83c\uddea", label: { es: "Venezuela", en: "Venezuela", zh: "\u59d4\u5185\u745e\u62c9" } },
  { code: "UY", flag: "\ud83c\uddfa\ud83c\uddfe", label: { es: "Uruguay", en: "Uruguay", zh: "\u4e4c\u62c9\u572d" } },
  { code: "PY", flag: "\ud83c\uddf5\ud83c\uddfe", label: { es: "Paraguay", en: "Paraguay", zh: "\u5df4\u62c9\u572d" } },
  { code: "BO", flag: "\ud83c\udde7\ud83c\uddf4", label: { es: "Bolivia", en: "Bolivia", zh: "\u73bb\u5229\u7ef4\u4e9a" } },
  { code: "CR", flag: "\ud83c\udde8\ud83c\uddf7", label: { es: "Costa Rica", en: "Costa Rica", zh: "\u54e5\u65af\u8fbe\u9ece\u52a0" } },
  { code: "PA", flag: "\ud83c\uddf5\ud83c\udde6", label: { es: "Panam\u00e1", en: "Panama", zh: "\u5df4\u62ff\u9a6c" } },
  { code: "DO", flag: "\ud83c\udde9\ud83c\uddf4", label: { es: "Rep. Dominicana", en: "Dominican Rep.", zh: "\u591a\u7c73\u5c3c\u52a0" } },
  { code: "GT", flag: "\ud83c\uddec\ud83c\uddf9", label: { es: "Guatemala", en: "Guatemala", zh: "\u5371\u5730\u9a6c\u62c9" } },
  { code: "CU", flag: "\ud83c\udde8\ud83c\uddfa", label: { es: "Cuba", en: "Cuba", zh: "\u53e4\u5df4" } },
  { code: "PR", flag: "\ud83c\uddf5\ud83c\uddf7", label: { es: "Puerto Rico", en: "Puerto Rico", zh: "\u6ce2\u591a\u9ece\u5404" } },
  { code: "US", flag: "\ud83c\uddfa\ud83c\uddf8", label: { es: "Estados Unidos", en: "United States", zh: "\u7f8e\u56fd" } },
  { code: "GB", flag: "\ud83c\uddec\ud83c\udde7", label: { es: "Reino Unido", en: "United Kingdom", zh: "\u82f1\u56fd" } },
  { code: "CA", flag: "\ud83c\udde8\ud83c\udde6", label: { es: "Canad\u00e1", en: "Canada", zh: "\u52a0\u62ff\u5927" } },
  { code: "BR", flag: "\ud83c\udde7\ud83c\uddf7", label: { es: "Brasil", en: "Brazil", zh: "\u5df4\u897f" } },
  { code: "PT", flag: "\ud83c\uddf5\ud83c\uddf9", label: { es: "Portugal", en: "Portugal", zh: "\u8461\u8404\u7259" } },
  { code: "FR", flag: "\ud83c\uddeb\ud83c\uddf7", label: { es: "Francia", en: "France", zh: "\u6cd5\u56fd" } },
  { code: "DE", flag: "\ud83c\udde9\ud83c\uddea", label: { es: "Alemania", en: "Germany", zh: "\u5fb7\u56fd" } },
  { code: "IT", flag: "\ud83c\uddee\ud83c\uddf9", label: { es: "Italia", en: "Italy", zh: "\u610f\u5927\u5229" } },
  { code: "CN", flag: "\ud83c\udde8\ud83c\uddf3", label: { es: "China", en: "China", zh: "\u4e2d\u56fd" } },
  { code: "JP", flag: "\ud83c\uddef\ud83c\uddf5", label: { es: "Jap\u00f3n", en: "Japan", zh: "\u65e5\u672c" } },
  { code: "KR", flag: "\ud83c\uddf0\ud83c\uddf7", label: { es: "Corea del Sur", en: "South Korea", zh: "\u97e9\u56fd" } },
  { code: "AU", flag: "\ud83c\udde6\ud83c\uddfa", label: { es: "Australia", en: "Australia", zh: "\u6fb3\u5927\u5229\u4e9a" } },
];

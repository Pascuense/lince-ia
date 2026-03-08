import { createContext, useContext, useState, useCallback, useMemo, useEffect, useRef, type ReactNode } from "react";
import { extendedTranslations } from "./extendedTranslations";

export type PRDLanguage = "es" | "en" | "zh" | "pt-BR" | "pt-PT";
export type AvatarCountry = "default" | "es" | "cl" | "mx" | "ar" | "co" | "pe" | "en" | "zh" | "br" | "pt";

// Helper for inline translations across 5 languages
// Usage: tl(lang, { es: 'Hola', en: 'Hello', zh: '你好', 'pt-BR': 'Olá', 'pt-PT': 'Olá' })
export function tl(lang: PRDLanguage, texts: Partial<Record<PRDLanguage, string>>): string {
  return texts[lang] || texts.es || '';
}

interface PRDLanguageContextType {
  lang: PRDLanguage;
  setLang: (lang: PRDLanguage) => void;
  t: (key: string) => string;
  tData: (key: string) => any;
  country: AvatarCountry;
  setCountry: (c: AvatarCountry) => void;
  getAvatarName: (avatarKey: string) => string;
  getAvatarNameForCountry: (avatarKey: string, country: AvatarCountry) => string;
  generateUsernames: (realName: string) => string[];
}

const PRDLanguageContext = createContext<PRDLanguageContextType | null>(null);

export function usePRDLanguage() {
  const ctx = useContext(PRDLanguageContext);
  if (!ctx) throw new Error("usePRDLanguage must be used within PRDLanguageProvider");
  return ctx;
}

function deepGet(obj: any, path: string): any {
  return path.split(".").reduce((acc, part) => acc?.[part], obj);
}

// ═══════════════════════════════════════════════════════
// USERNAME GENERATOR -LIN / -LINA
// ═══════════════════════════════════════════════════════
function removeAccents(s: string): string {
  return s.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

// Smart syllable splitter for Spanish names
function spanishSyllables(word: string): string[] {
  const v = "AEIOU";
  const syls: string[] = [];
  let cur = "";
  for (let i = 0; i < word.length; i++) {
    cur += word[i];
    if (!v.includes(word[i])) continue; // consonant, keep building
    // We're on a vowel. Decide where to split.
    const next = word[i + 1];
    const next2 = word[i + 2];
    if (!next) { syls.push(cur); cur = ""; break; } // end of word
    if (v.includes(next)) {
      // Two vowels: split between them (simplified)
      syls.push(cur); cur = "";
    } else if (next2 && !v.includes(next2)) {
      // VCC pattern: consonant cluster, split after first C
      cur += next; syls.push(cur); cur = ""; i++;
    } else if (next2 && v.includes(next2)) {
      // VCV pattern: split before C
      syls.push(cur); cur = "";
    }
  }
  if (cur) syls.push(cur);
  return syls.filter(s => s.length > 0);
}

function generateLinNames(name: string): string[] {
  const raw = name.trim().toUpperCase().replace(/[^A-ZÁÉÍÓÚÑÜ ]/gi, "");
  if (!raw || raw.length < 2) return ["PAPALIN", "MAMALINA", "LINCELIN", "LINCEIALIN", "MAMALINALINA"];
  const clean = removeAccents(raw);
  const syls = spanishSyllables(clean);
  const candidates = new Set<string>();

  // === CORE STRATEGIES (produce the best names) ===

  // 1. Full name + LIN / LINA (most natural)
  // Ana → ANALIN, Luisa → LUISALIN
  if (clean.length <= 8) {
    candidates.add(clean + "LIN");
    candidates.add(clean + "LINA");
  }

  // 2. Name minus last vowel/char + LIN / LINA
  // Ana → ANABLIN, Luisa → LUISLIN (not great)
  // Better: trim to last consonant cluster
  const trimmed = clean.replace(/[AEIOU]+$/, "");
  if (trimmed.length >= 2 && trimmed !== clean) {
    candidates.add(trimmed + "LIN");
    candidates.add(trimmed + "LINA");
  }

  // 3. Second half of name + LIN (nickname style)
  // Ana → ANALIN, Maria → RIALIN
  if (syls.length >= 2) {
    const half2 = syls.slice(Math.ceil(syls.length / 2)).join("");
    if (half2.length >= 2) {
      candidates.add(half2 + "LIN");
      candidates.add(half2 + "LINA");
    }
    // Also try from second syllable
    const from2 = syls.slice(1).join("");
    if (from2.length >= 2 && from2 !== half2) {
      candidates.add(from2 + "LIN");
      candidates.add(from2 + "LINA");
    }
  }

  // 4. First syllable(s) up to 4-5 chars + LIN
  // Ana → ANALIN, Maria → MARLIN
  let pref = "";
  for (const s of syls) {
    if ((pref + s).length <= 5) pref += s;
    else break;
  }
  if (pref.length >= 2) {
    candidates.add(pref + "LIN");
    candidates.add(pref + "LINA");
  }

  // 5. First 2-3 chars + OLIN (playful)
  // Ana → ANOLIN, Luisa → LUOLIN
  const p2 = clean.slice(0, 2);
  const p3 = clean.slice(0, Math.min(3, clean.length));
  candidates.add(p3 + "OLIN");
  candidates.add(p2 + "OLIN");

  // 6. Diminutive style: first syllable + ELIN/ILINA
  if (syls.length >= 1 && syls[0].length >= 2) {
    candidates.add(syls[0] + "ELIN");
    candidates.add(syls[0] + "ILINA");
  }

  // 7. For short names (<=4), also full + OLIN
  if (clean.length <= 4) {
    candidates.add(clean + "OLIN");
    candidates.add(clean + "OLINA");
  }

  // === FILTER & RANK ===
  const validEndings = ["LIN", "LINA"];
  let results = Array.from(candidates)
    .filter(n => n.length >= 5 && n.length <= 16)
    .filter(n => validEndings.some(e => n.endsWith(e)))
    .filter(n => {
      // Must not be just LIN/LINA
      const base = n.endsWith("LINA") ? n.slice(0, -4) : n.slice(0, -3);
      return base.length >= 2;
    });

  // Sort by quality: shorter names first, prefer names that sound natural
  results.sort((a, b) => {
    // Prefer names 6-10 chars
    const idealA = Math.abs(a.length - 8);
    const idealB = Math.abs(b.length - 8);
    return idealA - idealB;
  });

  // Remove duplicates and limit
  results = Array.from(new Set(results)).slice(0, 6);

  // === IA SUFFIX FALLBACK: if not enough options, add IA variants ===
  if (results.length < 6) {
    const iaVariants = [
      clean.slice(0, 4) + "IALIN",
      clean.slice(0, 3) + "IALINA",
      clean.slice(0, 4) + "IALIN",
      p2 + "IALINA",
    ].filter(n => n.length >= 6 && n.length <= 16 && validEndings.some(e => n.endsWith(e)));
    for (const v of iaVariants) {
      if (results.length >= 6) break;
      if (!results.includes(v)) results.push(v);
    }
  }

  return results.slice(0, 6);
}

export function PRDLanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<PRDLanguage>(() => {
    const saved = localStorage.getItem("lince-prd-lang");
    if (saved === "en" || saved === "zh" || saved === "es" || saved === "pt-BR" || saved === "pt-PT") return saved as PRDLanguage;
    const bl = navigator.language;
    if (bl === "pt-BR" || bl.startsWith("pt-BR")) return "pt-BR";
    if (bl.startsWith("pt")) return "pt-PT";
    if (bl.startsWith("zh")) return "zh";
    if (bl.startsWith("en")) return "en";
    return "es";
  });

  // ═══ CHILE SIEMPRE POR DEFECTO (familia directa) ═══
  // Si el usuario nunca eligió país, arranca con España.
  // Luego la geolocalización por IP puede actualizarlo automáticamente.
  const [country, setCountry] = useState<AvatarCountry>(() => {
    const saved = localStorage.getItem("lince-country");
    const geoSource = localStorage.getItem("lince-geo-detected");
    // Migración: si el país fue asignado automáticamente como Chile (antiguo default),
    // reemplazar por España. Solo afecta a usuarios sin elección manual.
    if (saved === "cl" && (geoSource === "FALLBACK_CL" || geoSource === null)) {
      localStorage.setItem("lince-country", "es");
      return "es";
    }
    if (saved && ["default","es","cl","mx","ar","co","pe","en","zh","br","pt"].includes(saved)) return saved as AvatarCountry;
    return "es"; // España por defecto
  });

  // Auto-detección de país por IP (solo la primera vez, si no hay selección guardada)
  const geoDetected = useRef(false);
  useEffect(() => {
    const saved = localStorage.getItem("lince-country");
    if (saved || geoDetected.current) return; // El usuario ya eligió o ya detectamos
    geoDetected.current = true;

    const ISO_TO_AVATAR: Record<string, AvatarCountry> = {
      CL: "cl", ES: "es", MX: "mx", AR: "ar", CO: "co", PE: "pe",
      GB: "en", US: "en", AU: "en", CA: "en", NZ: "en", IE: "en",
      CN: "zh", TW: "zh", HK: "zh", SG: "zh",
      BR: "br", PT: "pt", AO: "pt", MZ: "pt",
      // Otros países hispanohablantes → mapeo más cercano
      VE: "co", EC: "pe", BO: "pe", PY: "ar", UY: "ar",
      CR: "mx", PA: "mx", GT: "mx", HN: "mx", SV: "mx", NI: "mx",
      CU: "mx", DO: "mx", PR: "mx",
    };

    // Intentar múltiples APIs de geolocalización (fallback chain)
    const tryGeo = async () => {
      try {
        // API 1: ip-api.com (gratis, sin key, HTTP)
        const r1 = await fetch("http://ip-api.com/json/?fields=countryCode", { signal: AbortSignal.timeout(3000) });
        if (r1.ok) {
          const d1 = await r1.json();
          if (d1.countryCode) {
            const mapped = ISO_TO_AVATAR[d1.countryCode] || "es";
            setCountry(mapped);
            localStorage.setItem("lince-country", mapped);
            localStorage.setItem("lince-geo-detected", d1.countryCode);
            return;
          }
        }
      } catch { /* silently fail, try next */ }

      try {
        // API 2: ipapi.co (gratis, HTTPS)
        const r2 = await fetch("https://ipapi.co/json/", { signal: AbortSignal.timeout(3000) });
        if (r2.ok) {
          const d2 = await r2.json();
          if (d2.country_code) {
            const mapped = ISO_TO_AVATAR[d2.country_code] || "es";
            setCountry(mapped);
            localStorage.setItem("lince-country", mapped);
            localStorage.setItem("lince-geo-detected", d2.country_code);
            return;
          }
        }
      } catch { /* silently fail */ }

      // Si todo falla → España por defecto
      localStorage.setItem("lince-country", "es");
      localStorage.setItem("lince-geo-detected", "FALLBACK_ES");
    };

    tryGeo();
  }, []);

  const handleSetLang = useCallback((newLang: PRDLanguage) => {
    setLang(newLang);
    localStorage.setItem("lince-prd-lang", newLang);
  }, []);

  const handleSetCountry = useCallback((c: AvatarCountry) => {
    setCountry(c);
    localStorage.setItem("lince-country", c);
  }, []);

  const t = useCallback((key: string): string => {
    const val = deepGet(prdTranslations[lang], key);
    if (typeof val === "string") return val;
    const fallback = deepGet(prdTranslations.es, key);
    if (typeof fallback === "string") return fallback;
    return key;
  }, [lang]);

  const tData = useCallback((key: string): any => {
    const val = deepGet(prdTranslations[lang], key);
    if (val !== undefined) return val;
    const fallback = deepGet(prdTranslations.es, key);
    if (fallback !== undefined) return fallback;
    return key;
  }, [lang]);

  // FIX: getAvatarName now uses useMemo-derived function that captures current country
  const getAvatarName = useMemo(() => {
    return (avatarKey: string): string => {
      const names = AVATAR_NAMES_BY_COUNTRY[avatarKey];
      if (!names) return avatarKey;
      if (country !== "default") return names[country] || names.default;
      return names.default;
    };
  }, [country]);

  const getAvatarNameForCountry = useCallback((avatarKey: string, c: AvatarCountry): string => {
    const names = AVATAR_NAMES_BY_COUNTRY[avatarKey];
    if (!names) return avatarKey;
    return names[c] || names.default;
  }, []);

  const generateUsernames = useCallback((realName: string): string[] => {
    return generateLinNames(realName);
  }, []);

  const value = useMemo(() => ({
    lang, setLang: handleSetLang, t, tData, country, setCountry: handleSetCountry,
    getAvatarName, getAvatarNameForCountry, generateUsernames
  }), [lang, handleSetLang, t, tData, country, handleSetCountry, getAvatarName, getAvatarNameForCountry, generateUsernames]);

  return (
    <PRDLanguageContext.Provider value={value}>
      {children}
    </PRDLanguageContext.Provider>
  );
}

// ═══════════════════════════════════════════════════════
// AVATAR NAMES BY COUNTRY — Cariñosos por generación
// Abuelos: Yayo/Tata/Abuelito/Nono/Grandpa/爷爷
// Adultos: Papi/Viejo/Jefe/Cucho/Pop/爸爸
// Jóvenes: Chaval/Cabro/Chavo/Pibe/Bro/哥们
// Niños: Peque/Cabrito/Chamaco/Nene/Kiddo/小朋友
// ═══════════════════════════════════════════════════════
export const AVATAR_NAMES_BY_COUNTRY: Record<string, Record<string, string>> = {
  // === ABUELOS (65+) ===
  YAYALIN: {
    default: "ABUELO",
    es: "ABUELO",
    cl: "TATA",
    mx: "ABUELO",
    ar: "NONO",
    co: "TATA",
    pe: "ABUELO",
    en: "GRANDPA",
    zh: "爷爷",
    br: "VOVÔ",
    pt: "AVÔ",
  },
  YAYALINA: {
    default: "ABUELA",
    es: "ABUELA",
    cl: "NANA",
    mx: "ABUELA",
    ar: "NONA",
    co: "ABU",
    pe: "ABUELA",
    en: "GRANNY",
    zh: "奶奶",
    br: "VOVÓ",
    pt: "AVÓ",
  },
  // === ADULTOS (35-64) ===
  PAPALIN: {
    default: "PAPÁ",
    es: "PAPÁ",
    cl: "VIEJO",
    mx: "JEFE",
    ar: "VIEJO",
    co: "CUCHO",
    pe: "PAPI",
    en: "POP",
    zh: "爸爸",
    br: "PAI",
    pt: "PAI",
  },
  MAMALINA: {
    default: "MAMÁ",
    es: "MAMÁ",
    cl: "MAMI",
    mx: "JEFA",
    ar: "VIEJA",
    co: "CUCHA",
    pe: "MAMI",
    en: "MUM",
    zh: "妈妈",
    br: "MÃE",
    pt: "MÃE",
  },
  // === JÓVENES (16-34) ===
  CHAVALIN: {
    default: "HIJO",
    es: "HIJO",
    cl: "CABRO",
    mx: "CHAVO",
    ar: "PIBE",
    co: "PARCE",
    pe: "CAUSA",
    en: "BRO",
    zh: "哥们",
    br: "MANO",
    pt: "GAJO",
  },
  CHAVALINA: {
    default: "HIJA",
    es: "HIJA",
    cl: "CABRA",
    mx: "CHAVA",
    ar: "PIBA",
    co: "PARCERA",
    pe: "CAUSA",
    en: "SIS",
    zh: "姐妹",
    br: "MANA",
    pt: "GAJA",
  },
  // === NIÑOS (6-15) ===
  PEQUELIN: {
    default: "NIÑO",
    es: "NIÑO",
    cl: "CHICO",
    mx: "CHAMACO",
    ar: "NENE",
    co: "PELAO",
    pe: "CHIBOLO",
    en: "KIDDO",
    zh: "小朋友",
    br: "MOLEQUE",
    pt: "MIÚDO",
  },
  PEQUELINA: {
    default: "NIÑA",
    es: "NIÑA",
    cl: "CHICA",
    mx: "CHAMACA",
    ar: "NENA",
    co: "PELADA",
    pe: "CHIBOLA",
    en: "KIDDO",
    zh: "小朋友",
    br: "MOLECA",
    pt: "MIÚDA",
  },
  // === ESPECIALES ===
  ATOLONDRALIN: {
    default: "TÍO",
    es: "TÍO",
    cl: "DESPISTADO",
    mx: "ATARANTADO",
    ar: "DESPISTADO",
    co: "DESPARCHADO",
    pe: "DESPISTADO",
    en: "GOOFY",
    zh: "糊涂",
    br: "ATRAPALHADO",
    pt: "TRAPALHÃO",
  },
  SABELIN: {
    default: "PRIMO",
    es: "PRIMO",
    cl: "CAPO",
    mx: "CHIDO",
    ar: "CRACK",
    co: "BERRACO",
    pe: "MOSTRO",
    en: "BRAINY",
    zh: "天才",
    br: "CRAQUE",
    pt: "CRAQUE",
  },
};

export const COUNTRY_FLAGS: Partial<Record<AvatarCountry, string>> = {
  default: "🌍", es: "🇪🇸", cl: "🇨🇱", mx: "🇲🇽", ar: "🇦🇷", co: "🇨🇴", pe: "🇵🇪", en: "🇬🇧", zh: "🇨🇳", br: "🇧🇷", pt: "🇵🇹",
};

export const COUNTRY_LABELS: Record<PRDLanguage, Record<AvatarCountry, string>> = {
  es: { default: "Internacional", es: "España", cl: "Chile", mx: "México", ar: "Argentina", co: "Colombia", pe: "Perú", en: "Internacional (EN)", zh: "China", br: "Brasil", pt: "Portugal" },
  en: { default: "International", es: "Spain", cl: "Chile", mx: "Mexico", ar: "Argentina", co: "Colombia", pe: "Peru", en: "International (EN)", zh: "China", br: "Brazil", pt: "Portugal" },
  zh: { default: "国际", es: "西班牙", cl: "智利", mx: "墨西哥", ar: "阿根廷", co: "哥伦比亚", pe: "秘鲁", en: "国际 (EN)", zh: "中国", br: "巴西", pt: "葡萄牙" },
  "pt-BR": { default: "Internacional", es: "Espanha", cl: "Chile", mx: "México", ar: "Argentina", co: "Colômbia", pe: "Peru", en: "Internacional (EN)", zh: "China", br: "Brasil", pt: "Portugal" },
  "pt-PT": { default: "Internacional", es: "Espanha", cl: "Chile", mx: "México", ar: "Argentina", co: "Colômbia", pe: "Peru", en: "Internacional (EN)", zh: "China", br: "Brasil", pt: "Portugal" },
};

// ═══════════════════════════════════════════════════════
// PRD TRANSLATIONS — ES / EN / ZH
// ═══════════════════════════════════════════════════════
const _basePrdTranslations: Partial<Record<PRDLanguage, any>> = {
  es: {
    langName: "Español",
    langFlag: "🇪🇸",
    nav: { vision: "Visión", gracias: "Gracias", avatares: "Especialistas", personalizar: "Personalizar", familia: "Familia", gamificacion: "Gamificación", contenido: "Contenido", arquitectura: "Arquitectura", flujos: "Flujos", monetizacion: "Monetización", accesibilidad: "Accesibilidad", roadmap: "Roadmap", entregables: "Entregables", registro: "Registro", mundo: "Mundo", raids: "Batallas", academia: "Cursos", comoJugar: "Cómo Jugar", arsenalIA: "Herramientas IA", cursos: "Cursos", jugar: "¡JUGAR!", login: "Iniciar Sesión", promptProfesional: "Prompt Profesional", catalogoFormativo: "Todos los Cursos", courseBuilder: "Crea tu Curso", historialPrompts: "Historial Prompts", miPanel: "Mi Progreso" },
    nda: {
      title: "ACUERDO DE CONFIDENCIALIDAD",
      subtitle: "DOCUMENTO CONFIDENCIAL — ACCESO RESTRINGIDO",
      ndaTitle: "ACUERDO DE NO DIVULGACIÓN (NDA)",
      titular: "TITULAR:", titularValue: "ACNB IA SL, con domicilio social en España.",
      creador: "CREADOR:", creadorValue: "ACNB IA SL",
      clausula1Title: "CLÁUSULA 1 — OBJETO",
      clausula1Text: "El presente acuerdo tiene por objeto proteger la información confidencial contenida en este documento, incluyendo pero no limitado a: conceptos de producto, diseños de personajes, arquitectura técnica, modelos de negocio, estrategias de gamificación, roadmap de desarrollo y cualquier otro material relacionado con el proyecto LINCE®.",
      clausula2Title: "CLÁUSULA 2 — DEFINICIÓN DE INFORMACIÓN CONFIDENCIAL",
      clausula2Text: "Se considera información confidencial toda la información contenida en este sitio web, incluyendo: (a) el concepto y diseño de la plataforma LINCE®; (b) los personajes PAPALIN®, MAMALINA®, YAYALIN®, PEQUELIN®, PEQUELINA®, ATOLONDRALIN®, SABELIN® y toda la Familia LINCE®; (c) la estructura pedagógica y de contenidos; (d) la arquitectura técnica y modelo de datos; (e) los planes de monetización y roadmap; (f) cualquier material gráfico, textual o audiovisual.",
      clausula3Title: "CLÁUSULA 3 — OBLIGACIONES",
      clausula3Text: "Al acceder a este contenido, usted se compromete a: (a) NO reproducir, copiar, distribuir ni compartir ninguna parte de este documento; (b) NO utilizar la información para desarrollar productos competidores o similares; (c) NO divulgar el contenido a terceros sin autorización expresa y por escrito de ACNB IA SL; (d) NO realizar capturas de pantalla, grabaciones o cualquier forma de registro del contenido; (e) Mantener la más estricta confidencialidad sobre todo lo visualizado.",
      clausula4Title: "CLÁUSULA 4 — PROPIEDAD INTELECTUAL",
      clausula4Text: "Todos los derechos de propiedad intelectual e industrial sobre LINCE® y sus contenidos pertenecen exclusivamente a ACNB IA SL y ACNB IA SL. El acceso a este documento NO otorga ningún derecho, licencia ni autorización de uso sobre la propiedad intelectual contenida.",
      clausula5Title: "CLÁUSULA 5 — LEGISLACIÓN APLICABLE",
      clausula5Text: "Este acuerdo se rige por la legislación española, incluyendo: Ley de Propiedad Intelectual (RDL 1/1996), Ley de Marcas (Ley 17/2001), Ley de Competencia Desleal (Ley 3/1991), Código Penal (artículos 270-272 sobre delitos contra la propiedad intelectual), RGPD, Convenio de Berna y Tratado OMPI.",
      clausula6Title: "CLÁUSULA 6 — CONSECUENCIAS DEL INCUMPLIMIENTO",
      clausula6Text: "El incumplimiento de cualquiera de las obligaciones establecidas en este acuerdo podrá dar lugar a acciones legales civiles y penales, incluyendo reclamaciones por daños y perjuicios, medidas cautelares y denuncia penal por revelación de secretos empresariales.",
      checkboxLabel: "He leído y acepto íntegramente el Acuerdo de Confidencialidad (NDA). Entiendo que este contenido es propiedad exclusiva de ACNB IA SL y ACNB IA SL, y me comprometo a no divulgar, copiar ni utilizar la información contenida sin autorización expresa.",
      acceptBtn: "ACEPTO EL NDA — ACCEDER AL DOCUMENTO",
      rejectBtn: "NO ACEPTO — SALIR",
      footer: "© 2026 ACNB IA SL. Todos los derechos reservados. Creado por ACNB IA SL",
      footerSub: "Este acceso queda registrado. Cualquier uso no autorizado será perseguido legalmente.",
    },
    hero: { prd: "Documento de Producto v1.0", title: "LINCE", subtitle: "Aprende IA jugando — Para todas las edades", description: "Aprende IA jugando. Elige tu personaje, completa retos y sube de nivel. De 13 a 90 años.", stat1: "Avatares jugables", stat2: "Niveles de juego", stat3: "Idiomas disponibles", stat4: "Colecciones de avatares", preparedBy: "Preparado por: Dirección de Producto — ACNB", date: "Febrero 2026" },
    vision: { sectionTitle: "Visión de Producto LINCE", sectionSubtitle: "Abrir las puertas de la inteligencia artificial para todas las generaciones", problemTitle: "El Problema", solutionTitle: "La Solución", metricsTitle: "Métricas de Éxito", diffTitle: "Diferenciación Clave" },
    gracias: { sectionTitle: "Gracias, Duolingo", sectionSubtitle: "Sin vosotros, nada de esto sería posible" },
    avatars: { sectionTitle: "Sistema de Avatares Educativos de IA", sectionSubtitle: "La Familia LINCE — 10 tutores virtuales de inteligencia artificial, 64 imágenes, adaptación por generación", inclusiveTitle: "Elección Libre e Inclusiva", flowTitle: "FLUJO DE SELECCIÓN:", flowFooter: "CERO estereotipos. CERO limitaciones. TOTAL libertad.", adaptTitle: "Adaptación del Contenido por Generación" },
    personalization: {
      sectionTitle: "Personalización Inclusiva de Avatares",
      sectionSubtitle: "Total libertad de elección — Cualquier persona elige cualquier avatar y lo personaliza como quiera",
      philosophy: "No importa quién seas ni de dónde vengas. Aquí cada persona es libre de ser quien quiera.",
      philosophyHighlight: "Tu avatar, tu identidad, tus reglas.",
      philosophySub: "Sin restricciones de género, edad, apariencia ni capacidad. Tu avatar, tus reglas.",
      tryPrototype: "PROBAR PROTOTIPO INTERACTIVO",
      tabAppearance: "Apariencia", tabIdentity: "Identidad", tabDiversity: "Diversidad Funcional", tabShop: "Tienda",
      nameByCountry: "Nombre según país de descarga",
      customNameLabel: "O escribe tu propio nombre",
      customNameHint: "Tu nombre terminado en -LIN o -LINA",
      customNameError: "El nombre debe terminar en -LIN o -LINA",
      customNamePlaceholder: "Ej: PABLOLIN, MARIALINA...",
    },
    family: { sectionTitle: "Perfiles de la Familia LINCE — Tutores de IA", sectionSubtitle: "Cada miembro enseña inteligencia artificial a su generación, en su idioma, a su ritmo", filterAll: "Todos", filterElderly: "Abuelos (65+)", filterAdults: "Adultos (35-64)", filterYouth: "Jóvenes (16-34)", filterKids: "Niños (6-15)", filterSpecial: "Especiales", expressionsTitle: "Expresiones disponibles", teachesTitle: "Qué enseña", appearsTitle: "Cuándo aparece", approachTitle: "Enfoque pedagógico", philosophyQuote: "Una familia que enseña IA a todas las generaciones", philosophySubtext: "Cada avatar está diseñado con algoritmos pedagógicos específicos para su generación", statCharacters: "Personajes", statImages: "Imágenes", statGenerations: "Generaciones", statExpressions: "Expresiones" },
    accessibility: { sectionTitle: "Accesibilidad y Cumplimiento Normativo", sectionSubtitle: "100% inclusiva — Cumplimiento total de la normativa española y europea de accesibilidad digital" },
    gamification: { sectionTitle: "Sistema de Juego y Recompensas", sectionSubtitle: "Así te motivamos para que sigas aprendiendo cada día" },
    content: { sectionTitle: "Estructura de Contenido", sectionSubtitle: "10 mundos temáticos de IA con más de 100 cursos especializados" },
    architecture: { sectionTitle: "Arquitectura Técnica", sectionSubtitle: "Tecnología preparada para crecer" },
    flows: { sectionTitle: "Flujos de Usuario", sectionSubtitle: "Experiencias diseñadas para cada tipo de usuario" },
    monetization: { sectionTitle: "Modelo de Monetización", sectionSubtitle: "Freemium + Premium + B2B Enterprise" },
    roadmap: { sectionTitle: "Roadmap de Desarrollo", sectionSubtitle: "Plan de implementación por fases" },
    deliverables: { sectionTitle: "Entregables y Prioridades", sectionSubtitle: "Clasificación MoSCoW de funcionalidades" },
    common: { copyright: "© 2026 ACNB IA SL. Todos los derechos reservados.", createdBy: "Creado por ACNB IA SL | Documento confidencial", creator: "Creado por ACNB IA SL", back: "Volver", next: "Siguiente", previous: "Anterior", download: "Descargar", save: "Guardar", close: "Cerrar", selectCountry: "Seleccionar país", customName: "Nombre personalizado" },
    customizer: {
      title: "Personaliza tu Avatar LINCE",
      subtitle: "Elige, personaliza y haz tuyo a tu compañero de aprendizaje de IA",
      step1: "Elige Avatar", step2: "Apariencia", step3: "Nombre", step4: "Accesorios", step5: "Ropa", step6: "Diversidad", step7: "Resumen",
      philosophyNote: "Cualquier persona puede elegir cualquier avatar. No hay etiquetas, no hay límites.",
      philosophyBold: "Tu avatar, tu identidad, tus reglas.",
      preview: "Vista previa",
      furColor: "Color de pelaje", eyeColor: "Color de ojos", spotPattern: "Patrón de manchas", hairstyle: "Peinado",
      clothing: "Ropa", clothingColor: "Color de ropa", headAccessory: "Accesorio cabeza", accessory: "Accesorio",
      pronouns: "Pronombres", voiceType: "Tipo de voz",
      assistiveDevice: "Dispositivo de asistencia", assistiveFree: "SIEMPRE GRATUITO",
      exportJSON: "Descargar JSON", exportPNG: "Descargar PNG",
      nameByCountry: "Nombre según país", customNameLabel: "O escribe tu propio nombre",
      generation: "Generación", role: "Rol", expression: "Expresión",
      nameStep: "Elige el nombre de tu avatar",
      nameStepDesc: "Selecciona un nombre según tu país o crea uno personalizado terminado en -LIN o -LINA",
      customNameInput: "Escribe tu nombre personalizado",
      customNameRule: "Debe terminar en -LIN o -LINA",
      nameExamples: "Ejemplos: PABLOLIN, MARIALINA, CARLOLIN, SOFIALINA, ALEXLIN, VALENTINALINA",
      selectedName: "Nombre seleccionado",
      chooseAvatar: "Elige tu compañero de aprendizaje",
      chooseAvatarDesc: "Cualquier avatar, cualquier persona. Sin restricciones de género ni edad.",
      inclusivePhilosophy: "Filosofía inclusiva",
      inclusiveDesc: "La generación es solo una sugerencia. Cualquier persona puede elegir cualquier avatar. No hay etiquetas, no hay límites. Tu avatar, tu identidad, tus reglas.",
      headerTitle: "Prototipo Interactivo — Personalización de Avatar",
      backToPRD: "Inicio",
      selected: "Seleccionado",
      clothingType: "Tipo de prenda",
      clothingDesc: "Toda la ropa está disponible para todos. Sin etiquetas de género.",
    },
    register: {
      title: "Únete a LINCE",
      subtitle: "Crea tu cuenta y empieza a aprender IA con tu avatar personalizado",
      emailLabel: "Correo electrónico",
      emailPlaceholder: "tu@email.com",
      passwordLabel: "Contraseña",
      passwordPlaceholder: "Mínimo 8 caracteres",
      confirmPasswordLabel: "Confirmar contraseña",
      confirmPasswordPlaceholder: "Repite tu contraseña",
      realNameLabel: "Tu nombre real",
      realNamePlaceholder: "Ej: Ana, María, John...",
      realNameHint: "Lo usaremos para generar opciones de nombre de usuario",
      usernameLabel: "Tu nombre LINCE",
      usernameHint: "Todos los nombres terminan en -LIN o -LINA",
      usernamePlaceholder: "Ej: CRISTOLIN, MARIALINA...",
      usernameRule: "Debe terminar en -LIN o -LINA",
      generateBtn: "Generar opciones",
      orCustom: "O escribe tu propio nombre:",
      suggestedNames: "Nombres sugeridos para ti:",
      registerBtn: "CREAR MI CUENTA LINCE",
      alreadyAccount: "¿Ya tienes cuenta?",
      loginLink: "Inicia sesión",
      registering: "Creando tu cuenta...",
      success: "¡Cuenta creada! Bienvenido/a a LINCE",
      errorEmail: "Introduce un email válido",
      errorPassword: "La contraseña debe tener al menos 8 caracteres",
      errorPasswordMatch: "Las contraseñas no coinciden",
      errorName: "Introduce tu nombre",
      errorUsername: "El nombre debe terminar en -LIN o -LINA",
      errorUsernameTaken: "Este nombre ya está en uso. Prueba otro.",
      privacyConsent: "He leído y acepto la",
      privacyLink: "Política de Privacidad",
      privacyAnd: "y los",
      termsLink: "Términos de Uso",
      dataProtectionTitle: "Protección de tus datos",
      dataProtectionText: "En LINCE nos tomamos muy en serio la protección de tus datos personales. Cumplimos con el Reglamento General de Protección de Datos (RGPD) de la UE y la Ley Orgánica 3/2018 de Protección de Datos Personales (LOPDGDD) de España.",
      dataWhat: "¿Qué datos recogemos?",
      dataWhatText: "Solo tu email, contraseña (cifrada) y nombre de usuario. Nada más hasta que decidas pasar a Premium.",
      dataWhy: "¿Para qué los usamos?",
      dataWhyText: "Exclusivamente para gestionar tu cuenta, guardar tu progreso de aprendizaje y personalizar tu experiencia.",
      dataWho: "¿Quién accede a tus datos?",
      dataWhoText: "Solo ACNB IA SL. NUNCA vendemos, compartimos ni cedemos tus datos a terceros.",
      dataRights: "Tus derechos",
      dataRightsText: "Tienes derecho a acceder, rectificar, suprimir, portar y oponerte al tratamiento de tus datos. Puedes ejercerlos escribiendo a privacidad@lince.com.",
      dataDelete: "¿Puedo borrar mi cuenta?",
      dataDeleteText: "Sí, en cualquier momento desde tu perfil. Todos tus datos se eliminan de forma permanente e irreversible en un plazo máximo de 30 días.",
      dataSecurity: "Seguridad",
      dataSecurityText: "Tus datos se almacenan cifrados con estándares AES-256. Las contraseñas se hashean con bcrypt. Conexiones protegidas con TLS 1.3.",
      dataMinors: "Menores de edad",
      dataMinorsText: "Los menores de 14 años necesitan autorización de un tutor legal. Entre 14 y 18 años pueden registrarse con consentimiento informado.",
      premiumDataTitle: "Datos adicionales en Premium",
      premiumDataText: "Si decides pasar a Premium, te pediremos datos adicionales (nombre completo, fecha de nacimiento, país) para personalizar mejor tu experiencia y cumplir con la normativa fiscal. Estos datos se tratan con el mismo nivel de protección.",
    },
    privacy: {
      title: "Política de Privacidad",
      lastUpdated: "Última actualización: Febrero 2026",
      controller: "Responsable del tratamiento: ACNB IA SL",
      controllerAddress: "Domicilio social: España",
      controllerEmail: "Email de contacto: privacidad@lince.com",
      dpo: "Delegado de Protección de Datos: dpo@lince.com",
    },
  },

  en: {
    langName: "English",
    langFlag: "🇬🇧",
    nav: { vision: "Vision", gracias: "Thanks", avatares: "Avatars", personalizar: "Customize", familia: "Family", gamificacion: "Gamification", contenido: "Content", arquitectura: "Architecture", flujos: "Flows", monetizacion: "Monetization", accesibilidad: "Accessibility", roadmap: "Roadmap", entregables: "Deliverables", registro: "Register", mundo: "World", raids: "Batallas", academia: "Academy", comoJugar: "How to Play", arsenalIA: "AI Tools", cursos: "Courses", jugar: "PLAY!", login: "Sign In", promptProfesional: "Pro Prompt", catalogoFormativo: "All Courses", courseBuilder: "Crea tu Curso", historialPrompts: "Prompt History", miPanel: "My Progress" },
    nda: {
      title: "CONFIDENTIALITY AGREEMENT",
      subtitle: "CONFIDENTIAL DOCUMENT — RESTRICTED ACCESS",
      ndaTitle: "NON-DISCLOSURE AGREEMENT (NDA)",
      titular: "OWNER:", titularValue: "ACNB IA SL, registered in Spain.",
      creador: "CREATOR:", creadorValue: "ACNB IA SL",
      clausula1Title: "CLAUSE 1 — PURPOSE",
      clausula1Text: "This agreement aims to protect the confidential information contained in this document, including but not limited to: product concepts, character designs, technical architecture, business models, gamification strategies, development roadmap, and any other material related to the LINCE® project.",
      clausula2Title: "CLAUSE 2 — DEFINITION OF CONFIDENTIAL INFORMATION",
      clausula2Text: "All information contained in this website is considered confidential, including: (a) the concept and design of the LINCE® platform; (b) the characters PAPALIN®, MAMALINA®, YAYALIN®, PEQUELIN®, PEQUELINA®, ATOLONDRALIN®, SABELIN® and the entire LINCE® Family; (c) the pedagogical and content structure; (d) the technical architecture and data model; (e) monetization plans and roadmap; (f) any graphic, textual, or audiovisual material.",
      clausula3Title: "CLAUSE 3 — OBLIGATIONS",
      clausula3Text: "By accessing this content, you agree to: (a) NOT reproduce, copy, distribute, or share any part of this document; (b) NOT use the information to develop competing or similar products; (c) NOT disclose the content to third parties without express written authorization from ACNB IA SL; (d) NOT take screenshots, recordings, or any form of content capture; (e) Maintain the strictest confidentiality about everything viewed.",
      clausula4Title: "CLAUSE 4 — INTELLECTUAL PROPERTY",
      clausula4Text: "All intellectual and industrial property rights over LINCE® and its contents belong exclusively to ACNB IA SL and ACNB IA SL. Access to this document does NOT grant any right, license, or authorization to use the intellectual property contained herein.",
      clausula5Title: "CLAUSE 5 — APPLICABLE LAW",
      clausula5Text: "This agreement is governed by Spanish law, including: Intellectual Property Law (RDL 1/1996), Trademark Law (Law 17/2001), Unfair Competition Law (Law 3/1991), Criminal Code (articles 270-272 on intellectual property crimes), GDPR, Berne Convention, and WIPO Treaty.",
      clausula6Title: "CLAUSE 6 — CONSEQUENCES OF BREACH",
      clausula6Text: "Breach of any of the obligations established in this agreement may give rise to civil and criminal legal actions, including claims for damages, injunctive measures, and criminal prosecution for disclosure of trade secrets.",
      checkboxLabel: "I have read and fully accept the Confidentiality Agreement (NDA). I understand that this content is the exclusive property of ACNB IA SL and ACNB IA SL, and I commit to not disclose, copy, or use the information contained without express authorization.",
      acceptBtn: "I ACCEPT THE NDA — ACCESS DOCUMENT",
      rejectBtn: "I DO NOT ACCEPT — EXIT",
      footer: "© 2026 ACNB IA SL. All rights reserved. Created by ACNB IA SL",
      footerSub: "This access is logged. Any unauthorized use will be legally pursued.",
    },
    hero: { prd: "Product Document v1.0", title: "LINCE", subtitle: "Learn AI by playing — For all ages", description: "Learn AI by playing. Choose your character, complete challenges and level up. Ages 13 to 90.", stat1: "Playable avatars", stat2: "Game levels", stat3: "Languages available", stat4: "Avatar collections", preparedBy: "Prepared by: Product Direction — ACNB", date: "February 2026" },
    vision: { sectionTitle: "LINCE Product Vision", sectionSubtitle: "Bring artificial intelligence training to everyone, for all generations", problemTitle: "The Problem", solutionTitle: "The Solution", metricsTitle: "Success Metrics", diffTitle: "Key Differentiation" },
    gracias: { sectionTitle: "Thank You, Duolingo", sectionSubtitle: "Without you, none of this would be possible" },
    avatars: { sectionTitle: "AI Educational Avatar System", sectionSubtitle: "The LINCE Family — 10 virtual AI tutors, 64 images, generation-based adaptation", inclusiveTitle: "Free & Inclusive Choice", flowTitle: "SELECTION FLOW:", flowFooter: "ZERO stereotypes. ZERO limitations. TOTAL freedom.", adaptTitle: "Content Adaptation by Generation" },
    personalization: {
      sectionTitle: "Inclusive Avatar Customization",
      sectionSubtitle: "Total freedom of choice — Anyone chooses any avatar and customizes it as they wish",
      philosophy: "It doesn't matter who you are or where you come from. Here every person is free to be whoever they want.",
      philosophyHighlight: "Your avatar, your identity, your rules.",
      philosophySub: "No restrictions of gender, age, appearance, or ability. Your avatar, your rules.",
      tryPrototype: "TRY INTERACTIVE PROTOTYPE",
      tabAppearance: "Appearance", tabIdentity: "Identity", tabDiversity: "Functional Diversity", tabShop: "Shop",
      nameByCountry: "Name by download country",
      customNameLabel: "Or type your own name",
      customNameHint: "Your name ending in -LIN or -LINA",
      customNameError: "Name must end in -LIN or -LINA",
      customNamePlaceholder: "E.g.: PABLOLIN, MARIALINA...",
    },
    family: { sectionTitle: "LINCE Family Profiles — AI Tutors", sectionSubtitle: "Each member teaches AI to their generation, in their language, at their pace", filterAll: "All", filterElderly: "Elderly (65+)", filterAdults: "Adults (35-64)", filterYouth: "Youth (16-34)", filterKids: "Kids (6-15)", filterSpecial: "Special", expressionsTitle: "Available expressions", teachesTitle: "What they teach", appearsTitle: "When they appear", approachTitle: "Teaching approach", philosophyQuote: "A family that teaches AI to every generation", philosophySubtext: "Each avatar is designed with generation-specific pedagogical algorithms", statCharacters: "Characters", statImages: "Images", statGenerations: "Generations", statExpressions: "Expressions" },
    accessibility: { sectionTitle: "Accessibility & Regulatory Compliance", sectionSubtitle: "100% inclusive — Full compliance with Spanish and European digital accessibility regulations" },
    gamification: { sectionTitle: "Game & Rewards System", sectionSubtitle: "How we keep you motivated to learn every day" },
    content: { sectionTitle: "Content Structure", sectionSubtitle: "10 AI thematic worlds with over 100 specialized courses" },
    architecture: { sectionTitle: "Technical Architecture", sectionSubtitle: "Scalable and modern technology stack" },
    flows: { sectionTitle: "User Flows", sectionSubtitle: "Experiences designed for each type of user" },
    monetization: { sectionTitle: "Monetization Model", sectionSubtitle: "Freemium + Premium + B2B Enterprise" },
    roadmap: { sectionTitle: "Development Roadmap", sectionSubtitle: "Phased implementation plan" },
    deliverables: { sectionTitle: "Deliverables & Priorities", sectionSubtitle: "MoSCoW feature classification" },
    common: { copyright: "© 2026 ACNB IA SL. All rights reserved.", createdBy: "Created by ACNB IA SL | Confidential document", creator: "Created by ACNB IA SL", back: "Back", next: "Next", previous: "Previous", download: "Download", save: "Save", close: "Close", selectCountry: "Select country", customName: "Custom name" },
    customizer: {
      title: "Customize Your LINCE Avatar",
      subtitle: "Choose, customize, and make your AI learning companion your own",
      step1: "Choose Avatar", step2: "Appearance", step3: "Name", step4: "Accessories", step5: "Clothing", step6: "Diversity", step7: "Summary",
      philosophyNote: "Anyone can choose any avatar. No labels, no limits.",
      philosophyBold: "Your avatar, your identity, your rules.",
      preview: "Preview",
      furColor: "Fur color", eyeColor: "Eye color", spotPattern: "Spot pattern", hairstyle: "Hairstyle",
      clothing: "Clothing", clothingColor: "Clothing color", headAccessory: "Head accessory", accessory: "Accessory",
      pronouns: "Pronouns", voiceType: "Voice type",
      assistiveDevice: "Assistive device", assistiveFree: "ALWAYS FREE",
      exportJSON: "Download JSON", exportPNG: "Download PNG",
      nameByCountry: "Name by country", customNameLabel: "Or type your own name",
      generation: "Generation", role: "Role", expression: "Expression",
      nameStep: "Choose your avatar's name",
      nameStepDesc: "Select a name based on your country or create a custom one ending in -LIN or -LINA",
      customNameInput: "Type your custom name",
      customNameRule: "Must end in -LIN or -LINA",
      nameExamples: "Examples: PABLOLIN, MARIALINA, CARLOLIN, SOFIALINA, ALEXLIN, VALENTINALINA",
      selectedName: "Selected name",
      chooseAvatar: "Choose your learning companion",
      chooseAvatarDesc: "Any avatar, any person. No gender or age restrictions.",
      inclusivePhilosophy: "Inclusive philosophy",
      inclusiveDesc: "Generation is just a suggestion. Anyone can choose any avatar. No labels, no limits. Your avatar, your identity, your rules.",
      headerTitle: "Interactive Prototype — Avatar Customization",
      backToPRD: "Home",
      selected: "Selected",
      clothingType: "Clothing type",
      clothingDesc: "All clothing is available for everyone. No gender labels.",
    },
    register: {
      title: "Join LINCE",
      subtitle: "Create your account and start learning AI with your personalized avatar",
      emailLabel: "Email address",
      emailPlaceholder: "you@email.com",
      passwordLabel: "Password",
      passwordPlaceholder: "Minimum 8 characters",
      confirmPasswordLabel: "Confirm password",
      confirmPasswordPlaceholder: "Repeat your password",
      realNameLabel: "Your real name",
      realNamePlaceholder: "E.g.: John, María, Wei...",
      realNameHint: "We'll use it to generate username options",
      usernameLabel: "Your LINCE name",
      usernameHint: "All names end in -LIN or -LINA",
      usernamePlaceholder: "E.g.: JOHNLIN, MARIALINA...",
      usernameRule: "Must end in -LIN or -LINA",
      generateBtn: "Generate options",
      orCustom: "Or type your own name:",
      suggestedNames: "Suggested names for you:",
      registerBtn: "CREATE MY LINCE ACCOUNT",
      alreadyAccount: "Already have an account?",
      loginLink: "Log in",
      registering: "Creating your account...",
      success: "Account created! Welcome to LINCE",
      errorEmail: "Enter a valid email",
      errorPassword: "Password must be at least 8 characters",
      errorPasswordMatch: "Passwords don't match",
      errorName: "Enter your name",
      errorUsername: "Name must end in -LIN or -LINA",
      errorUsernameTaken: "This name is already taken. Try another.",
      privacyConsent: "I have read and accept the",
      privacyLink: "Privacy Policy",
      privacyAnd: "and the",
      termsLink: "Terms of Use",
      dataProtectionTitle: "Your data protection",
      dataProtectionText: "At LINCE we take the protection of your personal data very seriously. We comply with the EU General Data Protection Regulation (GDPR) and Spain's Organic Law 3/2018 on Personal Data Protection (LOPDGDD).",
      dataWhat: "What data do we collect?",
      dataWhatText: "Only your email, password (encrypted) and username. Nothing else until you decide to go Premium.",
      dataWhy: "What do we use it for?",
      dataWhyText: "Exclusively to manage your account, save your learning progress and personalize your experience.",
      dataWho: "Who accesses your data?",
      dataWhoText: "Only ACNB IA SL. We NEVER sell, share or transfer your data to third parties.",
      dataRights: "Your rights",
      dataRightsText: "You have the right to access, rectify, delete, port and object to the processing of your data. You can exercise them by writing to privacy@lince.com.",
      dataDelete: "Can I delete my account?",
      dataDeleteText: "Yes, at any time from your profile. All your data is permanently and irreversibly deleted within a maximum of 30 days.",
      dataSecurity: "Security",
      dataSecurityText: "Your data is stored encrypted with AES-256 standards. Passwords are hashed with bcrypt. Connections protected with TLS 1.3.",
      dataMinors: "Minors",
      dataMinorsText: "Children under 14 need authorization from a legal guardian. Between 14 and 18 they can register with informed consent.",
      premiumDataTitle: "Additional data for Premium",
      premiumDataText: "If you decide to go Premium, we'll ask for additional data (full name, date of birth, country) to better personalize your experience and comply with tax regulations. This data is treated with the same level of protection.",
    },
    privacy: {
      title: "Privacy Policy",
      lastUpdated: "Last updated: February 2026",
      controller: "Data controller: ACNB IA SL",
      controllerAddress: "Registered office: Spain",
      controllerEmail: "Contact email: privacy@lince.com",
      dpo: "Data Protection Officer: dpo@lince.com",
    },
  },

  zh: {
    langName: "中文",
    langFlag: "🇨🇳",
    nav: { vision: "愿景", gracias: "致谢", avatares: "头像", personalizar: "个性化", familia: "家族", gamificacion: "游戏化", contenido: "内容", arquitectura: "架构", flujos: "流程", monetizacion: "变现", accesibilidad: "无障碍", roadmap: "路线图", entregables: "交付物", registro: "注册", mundo: "世界", raids: "突袭", academia: "学院", comoJugar: "如何游玩", arsenalIA: "AI武器库", cursos: "课程", jugar: "开始玩！", login: "登录", promptProfesional: "专业提示词", catalogoFormativo: "课程目录", courseBuilder: "课程构建器", historialPrompts: "提示词历史", miPanel: "我的面板" },
    nda: {
      title: "保密协议",
      subtitle: "机密文件 — 限制访问",
      ndaTitle: "保密协议 (NDA)",
      titular: "所有者：", titularValue: "ACNB IA SL，注册于西班牙。",
      creador: "创作者：", creadorValue: "ACNB IA SL",
      clausula1Title: "第一条 — 目的",
      clausula1Text: "本协议旨在保护本文件中包含的机密信息，包括但不限于：产品概念、角色设计、技术架构、商业模式、游戏化策略、开发路线图以及与LINCE®项目相关的任何其他材料。",
      clausula2Title: "第二条 — 机密信息定义",
      clausula2Text: "本网站中包含的所有信息均被视为机密信息，包括：(a) LINCE®平台的概念和设计；(b) PAPALIN®、MAMALINA®、YAYALIN®、PEQUELIN®、PEQUELINA®、ATOLONDRALIN®、SABELIN®角色及整个LINCE®家族；(c) 教学和内容结构；(d) 技术架构和数据模型；(e) 变现计划和路线图；(f) 任何图形、文本或视听材料。",
      clausula3Title: "第三条 — 义务",
      clausula3Text: "访问此内容即表示您同意：(a) 不复制、分发或分享本文件的任何部分；(b) 不使用该信息开发竞争或类似产品；(c) 未经ACNB IA SL明确书面授权，不向第三方披露内容；(d) 不截屏、录制或以任何形式记录内容；(e) 对所有查看内容保持最严格的保密。",
      clausula4Title: "第四条 — 知识产权",
      clausula4Text: "LINCE®及其内容的所有知识产权和工业产权均专属于ACNB IA SL及ACNB IA SL。访问本文件不授予任何权利、许可或使用其中包含的知识产权的授权。",
      clausula5Title: "第五条 — 适用法律",
      clausula5Text: "本协议受西班牙法律管辖，包括：知识产权法（RDL 1/1996）、商标法（Law 17/2001）、不正当竞争法（Law 3/1991）、刑法（第270-272条关于知识产权犯罪）、GDPR、伯尔尼公约和WIPO条约。",
      clausula6Title: "第六条 — 违约后果",
      clausula6Text: "违反本协议规定的任何义务可能导致民事和刑事法律诉讼，包括损害赔偿索赔、禁令措施和因泄露商业秘密的刑事起诉。",
      checkboxLabel: "我已阅读并完全接受保密协议（NDA）。我理解此内容是ACNB IA SL及ACNB IA SL的专有财产，我承诺未经明确授权不会披露、复制或使用所含信息。",
      acceptBtn: "我接受NDA — 访问文件",
      rejectBtn: "我不接受 — 退出",
      footer: "© 2026 ACNB IA SL. 版权所有。由ACNB IA SL创建",
      footerSub: "此访问已记录。任何未经授权的使用将被依法追究。",
    },
    hero: { prd: "产品需求文档 v1.0", title: "LINCE", subtitle: "玩着学AI — 面向所有年龄段的AI培训", description: "玩游戏学AI。选择你的角色，完成挑战，升级。适合 13 到 90 岁。", stat1: "可玩头像", stat2: "游戏关卡", stat3: "可用语言", stat4: "头像系列", preparedBy: "编制：产品部 — ACNB", date: "2026年2月" },
    vision: { sectionTitle: "LINCE 产品愿景", sectionSubtitle: "让所有世代都能获得人工智能培训", problemTitle: "问题", solutionTitle: "解决方案", metricsTitle: "成功指标", diffTitle: "核心差异化" },
    gracias: { sectionTitle: "感谢 Duolingo", sectionSubtitle: "没有你们，这一切都不可能" },
    avatars: { sectionTitle: "AI教育头像系统", sectionSubtitle: "LINCE家族 — 10个虚拟AI导师，64张图片，基于世代的适配", inclusiveTitle: "自由包容的选择", flowTitle: "选择流程：", flowFooter: "零刻板印象。零限制。完全自由。", adaptTitle: "按世代的内容适配" },
    personalization: {
      sectionTitle: "包容性头像个性化",
      sectionSubtitle: "完全自由选择 — 任何人选择任何头像并按自己的意愿个性化",
      philosophy: "不管你是谁，来自哪里。在这里每个人都可以自由地成为自己想成为的人。",
      philosophyHighlight: "你的头像，你的身份，你的规则。",
      philosophySub: "不限性别、年龄、外貌或能力。你的头像，你的规则。",
      tryPrototype: "试用互动原型",
      tabAppearance: "外观", tabIdentity: "身份", tabDiversity: "功能多样性", tabShop: "商店",
      nameByCountry: "按下载国家的名称",
      customNameLabel: "或输入你自己的名称",
      customNameHint: "以 -LIN 或 -LINA 结尾的名称",
      customNameError: "名称必须以 -LIN 或 -LINA 结尾",
      customNamePlaceholder: "例如：PABLOLIN, MARIALINA...",
    },
    family: { sectionTitle: "LINCE家族档案 — AI导师", sectionSubtitle: "每个成员用自己的语言、按自己的节奏教授人工智能", filterAll: "全部", filterElderly: "老年 (65+)", filterAdults: "成人 (35-64)", filterYouth: "青年 (16-34)", filterKids: "儿童 (6-15)", filterSpecial: "特殊", expressionsTitle: "可用表情", teachesTitle: "教授内容", appearsTitle: "出现时机", approachTitle: "教学方法", philosophyQuote: "一个教所有世代AI的家族", philosophySubtext: "每个头像都配备了针对其世代的专门教学算法", statCharacters: "角色", statImages: "图片", statGenerations: "世代", statExpressions: "表情" },
    accessibility: { sectionTitle: "无障碍与法规合规", sectionSubtitle: "100%包容 — 完全符合西班牙和欧洲数字无障碍法规" },
    gamification: { sectionTitle: "游戏与奖励系统", sectionSubtitle: "让你每天都有动力继续学习" },
    content: { sectionTitle: "内容结构", sectionSubtitle: "10个AI主题世界，超过100门专业课程" },
    architecture: { sectionTitle: "技术架构", sectionSubtitle: "可扩展的现代技术栈" },
    flows: { sectionTitle: "用户流程", sectionSubtitle: "为每种用户类型设计的体验" },
    monetization: { sectionTitle: "变现模式", sectionSubtitle: "免费增值 + 高级版 + B2B企业版" },
    roadmap: { sectionTitle: "开发路线图", sectionSubtitle: "分阶段实施计划" },
    deliverables: { sectionTitle: "交付物与优先级", sectionSubtitle: "MoSCoW功能分类" },
    common: { copyright: "© 2026 ACNB IA SL. 版权所有。", createdBy: "由ACNB IA SL创建 | 机密文件", creator: "由ACNB IA SL创建", back: "返回", next: "下一步", previous: "上一步", download: "下载", save: "保存", close: "关闭", selectCountry: "选择国家", customName: "自定义名称" },
    customizer: {
      title: "个性化你的LINCE头像",
      subtitle: "选择、个性化，让你的AI学习伙伴成为你自己的",
      step1: "选择头像", step2: "外观", step3: "名称", step4: "配饰", step5: "服装", step6: "多样性", step7: "总结",
      philosophyNote: "任何人都可以选择任何头像。没有标签，没有限制。",
      philosophyBold: "你的头像，你的身份，你的规则。",
      preview: "预览",
      furColor: "毛色", eyeColor: "眼睛颜色", spotPattern: "斑点图案", hairstyle: "发型",
      clothing: "服装", clothingColor: "服装颜色", headAccessory: "头部配饰", accessory: "配饰",
      pronouns: "代词", voiceType: "声音类型",
      assistiveDevice: "辅助设备", assistiveFree: "永久免费",
      exportJSON: "下载JSON", exportPNG: "下载PNG",
      nameByCountry: "按国家名称", customNameLabel: "或输入你自己的名称",
      generation: "世代", role: "角色", expression: "表情",
      nameStep: "选择你的头像名称",
      nameStepDesc: "根据你的国家选择名称，或创建以 -LIN 或 -LINA 结尾的自定义名称",
      customNameInput: "输入你的自定义名称",
      customNameRule: "必须以 -LIN 或 -LINA 结尾",
      nameExamples: "示例：PABLOLIN, MARIALINA, CARLOLIN, SOFIALINA, ALEXLIN, VALENTINALINA",
      selectedName: "已选名称",
      chooseAvatar: "选择你的学习伙伴",
      chooseAvatarDesc: "任何头像，任何人。没有性别或年龄限制。",
      inclusivePhilosophy: "包容哲学",
      inclusiveDesc: "世代只是一个建议。任何人都可以选择任何头像。没有标签，没有限制。你的头像，你的身份，你的规则。",
      headerTitle: "互动原型 — 头像个性化",
      backToPRD: "首页",
      selected: "已选",
      clothingType: "服装类型",
      clothingDesc: "所有服装对所有人开放。没有性别标签。",
    },
    register: {
      title: "加入 LINCE",
      subtitle: "创建你的账户，开始用个性化头像学习人工智能",
      emailLabel: "电子邮箱",
      emailPlaceholder: "you@email.com",
      passwordLabel: "密码",
      passwordPlaceholder: "至少8个字符",
      confirmPasswordLabel: "确认密码",
      confirmPasswordPlaceholder: "重复你的密码",
      realNameLabel: "你的真实姓名",
      realNamePlaceholder: "例如：小明、María、John...",
      realNameHint: "我们将用它来生成用户名选项",
      usernameLabel: "你的 LINCE 名称",
      usernameHint: "所有名称以 -LIN 或 -LINA 结尾",
      usernamePlaceholder: "例如：XIAOLIN, MARIALINA...",
      usernameRule: "必须以 -LIN 或 -LINA 结尾",
      generateBtn: "生成选项",
      orCustom: "或输入你自己的名称：",
      suggestedNames: "为你推荐的名称：",
      registerBtn: "创建我的 LINCE 账户",
      alreadyAccount: "已有账户？",
      loginLink: "登录",
      registering: "正在创建你的账户...",
      success: "账户已创建！欢迎来到 LINCE",
      errorEmail: "请输入有效的电子邮箱",
      errorPassword: "密码至少需要8个字符",
      errorPasswordMatch: "两次密码不一致",
      errorName: "请输入你的姓名",
      errorUsername: "名称必须以 -LIN 或 -LINA 结尾",
      errorUsernameTaken: "此名称已被使用，请尝试其他名称。",
      privacyConsent: "我已阅读并接受",
      privacyLink: "隐私政策",
      privacyAnd: "和",
      termsLink: "使用条款",
      dataProtectionTitle: "你的数据保护",
      dataProtectionText: "在 LINCE，我们非常重视你的个人数据保护。我们遵守欧盟《通用数据保护条例》(GDPR) 和西班牙《个人数据保护组织法》3/2018 (LOPDGDD)。",
      dataWhat: "我们收集哪些数据？",
      dataWhatText: "仅收集你的电子邮箱、密码（加密存储）和用户名。在你决定升级到高级版之前不会收集其他数据。",
      dataWhy: "我们用这些数据做什么？",
      dataWhyText: "仅用于管理你的账户、保存学习进度和个性化你的体验。",
      dataWho: "谁可以访问你的数据？",
      dataWhoText: "仅 ACNB IA SL。我们绝不出售、分享或转让你的数据给第三方。",
      dataRights: "你的权利",
      dataRightsText: "你有权访问、更正、删除、转移和反对处理你的数据。你可以通过写信至 privacy@lince.com 行使这些权利。",
      dataDelete: "我可以删除我的账户吗？",
      dataDeleteText: "可以，随时可以从你的个人资料中删除。所有数据将在最多30天内永久且不可逆地删除。",
      dataSecurity: "安全性",
      dataSecurityText: "你的数据使用 AES-256 标准加密存储。密码使用 bcrypt 哈希。连接使用 TLS 1.3 保护。",
      dataMinors: "未成年人",
      dataMinorsText: "14岁以下的儿童需要法定监护人的授权。14至18岁可以在知情同意的情况下注册。",
      premiumDataTitle: "高级版额外数据",
      premiumDataText: "如果你决定升级到高级版，我们将要求额外数据（全名、出生日期、国家）以更好地个性化你的体验并遵守税务法规。这些数据享有同等级别的保护。",
    },
    privacy: {
      title: "隐私政策",
      lastUpdated: "最后更新：2026年2月",
      controller: "数据控制者：ACNB IA SL",
      controllerAddress: "注册地址：西班牙",
      controllerEmail: "联系邮箱：privacy@lince.com",
      dpo: "数据保护官：dpo@lince.com",
    },
  },

  // ═══════════════════════════════════════════════════════════
  // PORTUGUÊS DO BRASIL (PT-BR)
  // ═══════════════════════════════════════════════════════════
  "pt-BR": {
    langName: "Português (BR)",
    langFlag: "🇧🇷",
    nav: { vision: "Visão", gracias: "Obrigado", avatares: "Especialistas", personalizar: "Personalizar", familia: "Família", gamificacion: "Gamificação", contenido: "Conteúdo", arquitectura: "Arquitetura", flujos: "Fluxos", monetizacion: "Monetização", accesibilidad: "Acessibilidade", roadmap: "Roadmap", entregables: "Entregáveis", registro: "Cadastro", mundo: "Mundo", raids: "Batallas", academia: "Cursos", comoJugar: "Como Jogar", arsenalIA: "Herramientas IA", cursos: "Cursos", jugar: "JOGAR!", login: "Entrar", promptProfesional: "Prompt Profissional", catalogoFormativo: "Todos os Cursos", courseBuilder: "Cria o teu Curso", historialPrompts: "Histórico de Prompts", miPanel: "Meu Progresso" },
    nda: {
      title: "ACORDO DE CONFIDENCIALIDADE",
      subtitle: "DOCUMENTO CONFIDENCIAL — ACESSO RESTRITO",
      ndaTitle: "ACORDO DE NÃO DIVULGAÇÃO (NDA)",
      titular: "TITULAR:", titularValue: "ACNB IA SL, com sede social na Espanha.",
      creador: "CRIADOR:", creadorValue: "ACNB IA SL",
      clausula1Title: "CLÁUSULA 1 — OBJETO",
      clausula1Text: "O presente acordo tem por objeto proteger a informação confidencial contida neste documento, incluindo mas não limitado a: conceitos de produto, designs de personagens, arquitetura técnica, modelos de negócio, estratégias de gamificação, roadmap de desenvolvimento e qualquer outro material relacionado ao projeto LINCE®.",
      clausula2Title: "CLÁUSULA 2 — DEFINIÇÃO DE INFORMAÇÃO CONFIDENCIAL",
      clausula2Text: "Considera-se informação confidencial toda a informação contida neste site, incluindo: (a) o conceito e design da plataforma LINCE®; (b) os personagens PAPALIN®, MAMALINA®, YAYALIN®, PEQUELIN®, PEQUELINA®, ATOLONDRALIN®, SABELIN® e toda a Família LINCE®; (c) a estrutura pedagógica e de conteúdos; (d) a arquitetura técnica e modelo de dados; (e) os planos de monetização e roadmap; (f) qualquer material gráfico, textual ou audiovisual.",
      clausula3Title: "CLÁUSULA 3 — OBRIGAÇÕES",
      clausula3Text: "Ao acessar este conteúdo, você se compromete a: (a) NÃO reproduzir, copiar, distribuir nem compartilhar nenhuma parte deste documento; (b) NÃO utilizar a informação para desenvolver produtos concorrentes ou similares; (c) NÃO divulgar o conteúdo a terceiros sem autorização expressa e por escrito da ACNB IA SL; (d) NÃO realizar capturas de tela, gravações ou qualquer forma de registro do conteúdo; (e) Manter a mais estrita confidencialidade sobre tudo o que foi visualizado.",
      clausula4Title: "CLÁUSULA 4 — PROPRIEDADE INTELECTUAL",
      clausula4Text: "Todos os direitos de propriedade intelectual e industrial sobre LINCE® e seus conteúdos pertencem exclusivamente à ACNB IA SL. O acesso a este documento NÃO outorga nenhum direito, licença nem autorização de uso sobre a propriedade intelectual contida.",
      clausula5Title: "CLÁUSULA 5 — LEGISLAÇÃO APLICÁVEL",
      clausula5Text: "Este acordo é regido pela legislação espanhola, incluindo: Lei de Propriedade Intelectual (RDL 1/1996), Lei de Marcas (Lei 17/2001), Lei de Concorrência Desleal (Lei 3/1991), Código Penal (artigos 270-272 sobre delitos contra a propriedade intelectual), RGPD, Convenção de Berna e Tratado OMPI.",
      clausula6Title: "CLÁUSULA 6 — CONSEQUÊNCIAS DO DESCUMPRIMENTO",
      clausula6Text: "O descumprimento de qualquer das obrigações estabelecidas neste acordo poderá dar lugar a ações legais civis e penais, incluindo reclamações por danos e prejuízos, medidas cautelares e denúncia penal por revelação de segredos empresariais.",
      checkboxLabel: "Li e aceito integralmente o Acordo de Confidencialidade (NDA). Entendo que este conteúdo é propriedade exclusiva da ACNB IA SL e me comprometo a não divulgar, copiar nem utilizar a informação contida sem autorização expressa.",
      acceptBtn: "ACEITO O NDA — ACESSAR O DOCUMENTO",
      rejectBtn: "NÃO ACEITO — SAIR",
      footer: "© 2026 ACNB IA SL. Todos os direitos reservados. Criado por ACNB IA SL",
      footerSub: "Este acesso fica registrado. Qualquer uso não autorizado será perseguido legalmente.",
    },
    hero: { prd: "Documento de Produto v1.0", title: "LINCE", subtitle: "Aprenda IA jogando — Para todas as idades", description: "Aprenda IA jogando. Escolha seu personagem, complete desafios e suba de nível. De 13 a 90 anos.", stat1: "Avatares jogáveis", stat2: "Níveis de jogo", stat3: "Idiomas disponíveis", stat4: "Coleções de avatares", preparedBy: "Preparado por: Direção de Produto — ACNB", date: "Fevereiro 2026" },
    vision: { sectionTitle: "Visão de Produto LINCE", sectionSubtitle: "Abrir as portas da inteligência artificial para todas as gerações", problemTitle: "O Problema", solutionTitle: "A Solução", metricsTitle: "Métricas de Sucesso", diffTitle: "Diferenciação Chave" },
    gracias: { sectionTitle: "Obrigado, Duolingo", sectionSubtitle: "Sem vocês, nada disso seria possível" },
    avatars: { sectionTitle: "Sistema de Avatares Educativos de IA", sectionSubtitle: "A Família LINCE — 10 tutores virtuais de IA, 64 imagens, adaptação por geração", inclusiveTitle: "Escolha Livre e Inclusiva", flowTitle: "FLUXO DE SELEÇÃO:", flowFooter: "ZERO estereótipos. ZERO limitações. TOTAL liberdade.", adaptTitle: "Adaptação do Conteúdo por Geração" },
    personalization: {
      sectionTitle: "Personalização Inclusiva de Avatares",
      sectionSubtitle: "Total liberdade de escolha — Qualquer pessoa escolhe qualquer avatar e personaliza como quiser",
      philosophy: "Não importa quem você é nem de onde vem. Aqui cada pessoa é livre para ser quem quiser.",
      philosophyHighlight: "Seu avatar, sua identidade, suas regras.",
      philosophySub: "Sem restrições de gênero, idade, aparência nem capacidade. Seu avatar, suas regras.",
      tryPrototype: "EXPERIMENTAR PROTÓTIPO INTERATIVO",
      tabAppearance: "Aparência", tabIdentity: "Identidade", tabDiversity: "Diversidade Funcional", tabShop: "Loja",
      nameByCountry: "Nome segundo país de download",
      customNameLabel: "Ou escreva seu próprio nome",
      customNameHint: "Seu nome terminado em -LIN ou -LINA",
      customNameError: "O nome deve terminar em -LIN ou -LINA",
      customNamePlaceholder: "Ex: PABLOLIN, MARIALINA...",
    },
    family: { sectionTitle: "Perfis da Família LINCE — Tutores de IA", sectionSubtitle: "Cada membro ensina inteligência artificial à sua geração, no seu idioma, no seu ritmo", filterAll: "Todos", filterElderly: "Avós (65+)", filterAdults: "Adultos (35-64)", filterYouth: "Jovens (16-34)", filterKids: "Crianças (6-15)", filterSpecial: "Especiais", expressionsTitle: "Expressões disponíveis", teachesTitle: "O que ensina", appearsTitle: "Quando aparece", approachTitle: "Abordagem pedagógica", philosophyQuote: "Uma família que ensina IA a todas as gerações", philosophySubtext: "Cada avatar é projetado com algoritmos pedagógicos específicos para sua geração", statCharacters: "Personagens", statImages: "Imagens", statGenerations: "Gerações", statExpressions: "Expressões" },
    accessibility: { sectionTitle: "Acessibilidade e Conformidade Normativa", sectionSubtitle: "100% inclusiva — Cumprimento total da normativa espanhola e europeia de acessibilidade digital" },
    gamification: { sectionTitle: "Sistema de Jogo e Recompensas", sectionSubtitle: "Assim te motivamos para que continues a aprender todos os dias" },
    content: { sectionTitle: "Estrutura de Conteúdo", sectionSubtitle: "10 mundos temáticos de IA com mais de 100 cursos especializados" },
    architecture: { sectionTitle: "Arquitetura Técnica", sectionSubtitle: "Tecnologia preparada para crescer" },
    flows: { sectionTitle: "Fluxos de Usuário", sectionSubtitle: "Experiências projetadas para cada tipo de usuário" },
    monetization: { sectionTitle: "Modelo de Monetização", sectionSubtitle: "Freemium + Premium + B2B Enterprise" },
    roadmap: { sectionTitle: "Roadmap de Desenvolvimento", sectionSubtitle: "Plano de implementação por fases" },
    deliverables: { sectionTitle: "Entregáveis e Prioridades", sectionSubtitle: "Classificação MoSCoW de funcionalidades" },
    common: { copyright: "© 2026 ACNB IA SL. Todos os direitos reservados.", createdBy: "Criado por ACNB IA SL | Documento confidencial", creator: "Criado por ACNB IA SL", back: "Voltar", next: "Próximo", previous: "Anterior", download: "Baixar", save: "Salvar", close: "Fechar", selectCountry: "Selecionar país", customName: "Nome personalizado" },
    customizer: {
      title: "Personalize seu Avatar LINCE",
      subtitle: "Escolha, personalize e faça seu o companheiro de aprendizado de IA",
      step1: "Escolher Avatar", step2: "Aparência", step3: "Nome", step4: "Acessórios", step5: "Roupa", step6: "Diversidade", step7: "Resumo",
      philosophyNote: "Qualquer pessoa pode escolher qualquer avatar. Sem rótulos, sem limites.",
      philosophyBold: "Seu avatar, sua identidade, suas regras.",
      preview: "Pré-visualização",
      furColor: "Cor do pelo", eyeColor: "Cor dos olhos", spotPattern: "Padrão de manchas", hairstyle: "Penteado",
      clothing: "Roupa", clothingColor: "Cor da roupa", headAccessory: "Acessório de cabeça", accessory: "Acessório",
      pronouns: "Pronomes", voiceType: "Tipo de voz",
      assistiveDevice: "Dispositivo de assistência", assistiveFree: "SEMPRE GRATUITO",
      exportJSON: "Baixar JSON", exportPNG: "Baixar PNG",
      nameByCountry: "Nome segundo país", customNameLabel: "Ou escreva seu próprio nome",
      generation: "Geração", role: "Função", expression: "Expressão",
      nameStep: "Escolha o nome do seu avatar",
      nameStepDesc: "Selecione um nome segundo seu país ou crie um personalizado terminado em -LIN ou -LINA",
      customNameInput: "Escreva seu nome personalizado",
      customNameRule: "Deve terminar em -LIN ou -LINA",
      nameExamples: "Exemplos: PABLOLIN, MARIALINA, CARLOLIN, SOFIALINA, ALEXLIN, VALENTINALINA",
      selectedName: "Nome selecionado",
      chooseAvatar: "Escolha seu companheiro de aprendizado",
      chooseAvatarDesc: "Qualquer avatar, qualquer pessoa. Sem restrições de gênero nem idade.",
      inclusivePhilosophy: "Filosofia inclusiva",
      inclusiveDesc: "A geração é apenas uma sugestão. Qualquer pessoa pode escolher qualquer avatar. Sem rótulos, sem limites. Seu avatar, sua identidade, suas regras.",
      headerTitle: "Protótipo Interativo — Personalização de Avatar",
      backToPRD: "Início",
      selected: "Selecionado",
      clothingType: "Tipo de roupa",
      clothingDesc: "Toda a roupa está disponível para todos. Sem rótulos de gênero.",
    },
    register: {
      title: "Junte-se ao LINCE",
      subtitle: "Crie sua conta e comece a aprender IA com seu avatar personalizado",
      emailLabel: "E-mail", emailPlaceholder: "voce@email.com",
      passwordLabel: "Senha", passwordPlaceholder: "Mínimo 8 caracteres",
      confirmPasswordLabel: "Confirmar senha", confirmPasswordPlaceholder: "Repita sua senha",
      realNameLabel: "Seu nome real", realNamePlaceholder: "Ex: Ana, Maria, João...",
      realNameHint: "Usaremos para gerar opções de nome de usuário",
      usernameLabel: "Seu nome LINCE", usernameHint: "Todos os nomes terminam em -LIN ou -LINA",
      usernamePlaceholder: "Ex: JOAOLIN, MARIALINA...", usernameRule: "Deve terminar em -LIN ou -LINA",
      generateBtn: "Gerar opções", orCustom: "Ou escreva seu próprio nome:",
      suggestedNames: "Nomes sugeridos para você:",
      registerBtn: "CRIAR MINHA CONTA LINCE",
      alreadyAccount: "Já tem conta?", loginLink: "Entrar",
      registering: "Criando sua conta...", success: "Conta criada! Bem-vindo/a ao LINCE",
      errorEmail: "Insira um e-mail válido", errorPassword: "A senha deve ter pelo menos 8 caracteres",
      errorPasswordMatch: "As senhas não coincidem", errorName: "Insira seu nome",
      errorUsername: "O nome deve terminar em -LIN ou -LINA",
      errorUsernameTaken: "Este nome já está em uso. Tente outro.",
      privacyConsent: "Li e aceito a", privacyLink: "Política de Privacidade",
      privacyAnd: "e os", termsLink: "Termos de Uso",
      dataProtectionTitle: "Proteção dos seus dados",
      dataProtectionText: "No LINCE levamos muito a sério a proteção dos seus dados pessoais. Cumprimos o Regulamento Geral de Proteção de Dados (RGPD) da UE e a Lei Orgânica 3/2018 de Proteção de Dados Pessoais (LOPDGDD) da Espanha.",
      dataWhat: "Que dados recolhemos?", dataWhatText: "Apenas seu e-mail, senha (cifrada) e nome de usuário. Nada mais até que decida passar para Premium.",
      dataWhy: "Para que os usamos?", dataWhyText: "Exclusivamente para gerir sua conta, guardar seu progresso de aprendizado e personalizar sua experiência.",
      dataWho: "Quem acessa seus dados?", dataWhoText: "Apenas ACNB IA SL. NUNCA vendemos, compartilhamos nem cedemos seus dados a terceiros.",
      dataRights: "Seus direitos", dataRightsText: "Você tem direito a acessar, retificar, suprimir, portar e opor-se ao tratamento dos seus dados. Pode exercê-los escrevendo para privacidade@lince.com.",
      dataDelete: "Posso apagar minha conta?", dataDeleteText: "Sim, a qualquer momento a partir do seu perfil. Todos os seus dados são eliminados de forma permanente e irreversível num prazo máximo de 30 dias.",
      dataSecurity: "Segurança", dataSecurityText: "Seus dados são armazenados cifrados com padrões AES-256. As senhas são hasheadas com bcrypt. Conexões protegidas com TLS 1.3.",
      dataMinors: "Menores de idade", dataMinorsText: "Menores de 14 anos precisam de autorização de um tutor legal. Entre 14 e 18 anos podem se cadastrar com consentimento informado.",
      premiumDataTitle: "Dados adicionais no Premium", premiumDataText: "Se decidir passar para Premium, pediremos dados adicionais (nome completo, data de nascimento, país) para personalizar melhor sua experiência e cumprir a normativa fiscal.",
    },
    privacy: {
      title: "Política de Privacidade", lastUpdated: "Última atualização: Fevereiro 2026",
      controller: "Responsável pelo tratamento: ACNB IA SL", controllerAddress: "Sede social: Espanha",
      controllerEmail: "E-mail de contato: privacidade@lince.com", dpo: "Encarregado de Proteção de Dados: dpo@lince.com",
    },
  },

  // ═══════════════════════════════════════════════════════════
  // PORTUGUÊS DE PORTUGAL (PT-PT)
  // ═══════════════════════════════════════════════════════════
  "pt-PT": {
    langName: "Português (PT)",
    langFlag: "🇵🇹",
    nav: { vision: "Visão", gracias: "Obrigado", avatares: "Especialistas", personalizar: "Personalizar", familia: "Família", gamificacion: "Gamificação", contenido: "Conteúdo", arquitectura: "Arquitetura", flujos: "Fluxos", monetizacion: "Monetização", accesibilidad: "Acessibilidade", roadmap: "Roadmap", entregables: "Entregáveis", registro: "Registo", mundo: "Mundo", raids: "Batallas", academia: "Cursos", comoJugar: "Como Jogar", arsenalIA: "Herramientas IA", cursos: "Cursos", jugar: "JOGAR!", login: "Iniciar Sessão", promptProfesional: "Prompt Profissional", catalogoFormativo: "Todos los Cursos", courseBuilder: "Cria o teu Curso", historialPrompts: "Histórico de Prompts", miPanel: "O Meu Progresso" },
    nda: {
      title: "ACORDO DE CONFIDENCIALIDADE",
      subtitle: "DOCUMENTO CONFIDENCIAL — ACESSO RESTRITO",
      ndaTitle: "ACORDO DE NÃO DIVULGAÇÃO (NDA)",
      titular: "TITULAR:", titularValue: "ACNB IA SL, com sede social em Espanha.",
      creador: "CRIADOR:", creadorValue: "ACNB IA SL",
      clausula1Title: "CLÁUSULA 1 — OBJETO",
      clausula1Text: "O presente acordo tem por objeto proteger a informação confidencial contida neste documento, incluindo mas não limitado a: conceitos de produto, designs de personagens, arquitetura técnica, modelos de negócio, estratégias de gamificação, roadmap de desenvolvimento e qualquer outro material relacionado com o projeto LINCE®.",
      clausula2Title: "CLÁUSULA 2 — DEFINIÇÃO DE INFORMAÇÃO CONFIDENCIAL",
      clausula2Text: "Considera-se informação confidencial toda a informação contida neste sítio web, incluindo: (a) o conceito e design da plataforma LINCE®; (b) os personagens PAPALIN®, MAMALINA®, YAYALIN®, PEQUELIN®, PEQUELINA®, ATOLONDRALIN®, SABELIN® e toda a Família LINCE®; (c) a estrutura pedagógica e de conteúdos; (d) a arquitetura técnica e modelo de dados; (e) os planos de monetização e roadmap; (f) qualquer material gráfico, textual ou audiovisual.",
      clausula3Title: "CLÁUSULA 3 — OBRIGAÇÕES",
      clausula3Text: "Ao aceder a este conteúdo, compromete-se a: (a) NÃO reproduzir, copiar, distribuir nem partilhar nenhuma parte deste documento; (b) NÃO utilizar a informação para desenvolver produtos concorrentes ou similares; (c) NÃO divulgar o conteúdo a terceiros sem autorização expressa e por escrito da ACNB IA SL; (d) NÃO realizar capturas de ecrã, gravações ou qualquer forma de registo do conteúdo; (e) Manter a mais estrita confidencialidade sobre tudo o que foi visualizado.",
      clausula4Title: "CLÁUSULA 4 — PROPRIEDADE INTELECTUAL",
      clausula4Text: "Todos os direitos de propriedade intelectual e industrial sobre LINCE® e os seus conteúdos pertencem exclusivamente à ACNB IA SL. O acesso a este documento NÃO outorga nenhum direito, licença nem autorização de uso sobre a propriedade intelectual contida.",
      clausula5Title: "CLÁUSULA 5 — LEGISLAÇÃO APLICÁVEL",
      clausula5Text: "Este acordo é regido pela legislação espanhola, incluindo: Lei de Propriedade Intelectual (RDL 1/1996), Lei de Marcas (Lei 17/2001), Lei de Concorrência Desleal (Lei 3/1991), Código Penal (artigos 270-272 sobre delitos contra a propriedade intelectual), RGPD, Convenção de Berna e Tratado OMPI.",
      clausula6Title: "CLÁUSULA 6 — CONSEQUÊNCIAS DO INCUMPRIMENTO",
      clausula6Text: "O incumprimento de qualquer das obrigações estabelecidas neste acordo poderá dar lugar a ações legais civis e penais, incluindo reclamações por danos e prejuízos, medidas cautelares e denúncia penal por revelação de segredos empresariais.",
      checkboxLabel: "Li e aceito integralmente o Acordo de Confidencialidade (NDA). Compreendo que este conteúdo é propriedade exclusiva da ACNB IA SL e comprometo-me a não divulgar, copiar nem utilizar a informação contida sem autorização expressa.",
      acceptBtn: "ACEITO O NDA — ACEDER AO DOCUMENTO",
      rejectBtn: "NÃO ACEITO — SAIR",
      footer: "© 2026 ACNB IA SL. Todos os direitos reservados. Criado por ACNB IA SL",
      footerSub: "Este acesso fica registado. Qualquer uso não autorizado será perseguido legalmente.",
    },
    hero: { prd: "Documento de Produto v1.0", title: "LINCE", subtitle: "Aprenda IA a jogar — Para todas as idades", description: "Aprenda IA a jogar. Escolha o seu personagem, complete desafios e suba de nível. Dos 13 aos 90 anos.", stat1: "Avatares jogáveis", stat2: "Níveis de jogo", stat3: "Idiomas disponíveis", stat4: "Coleções de avatares", preparedBy: "Preparado por: Direção de Produto — ACNB", date: "Fevereiro 2026" },
    vision: { sectionTitle: "Visão de Produto LINCE", sectionSubtitle: "Abrir as portas da inteligência artificial para todas as gerações", problemTitle: "O Problema", solutionTitle: "A Solução", metricsTitle: "Métricas de Sucesso", diffTitle: "Diferenciação Chave" },
    gracias: { sectionTitle: "Obrigado, Duolingo", sectionSubtitle: "Sem vocês, nada disto seria possível" },
    avatars: { sectionTitle: "Sistema de Avatares Educativos de IA", sectionSubtitle: "A Família LINCE — 10 tutores virtuais de IA, 64 imagens, adaptação por geração", inclusiveTitle: "Escolha Livre e Inclusiva", flowTitle: "FLUXO DE SELEÇÃO:", flowFooter: "ZERO estereótipos. ZERO limitações. TOTAL liberdade.", adaptTitle: "Adaptação do Conteúdo por Geração" },
    personalization: {
      sectionTitle: "Personalização Inclusiva de Avatares",
      sectionSubtitle: "Total liberdade de escolha — Qualquer pessoa escolhe qualquer avatar e personaliza como quiser",
      philosophy: "Não importa quem é nem de onde vem. Aqui cada pessoa é livre para ser quem quiser.",
      philosophyHighlight: "O seu avatar, a sua identidade, as suas regras.",
      philosophySub: "Sem restrições de género, idade, aparência nem capacidade. O seu avatar, as suas regras.",
      tryPrototype: "EXPERIMENTAR PROTÓTIPO INTERATIVO",
      tabAppearance: "Aparência", tabIdentity: "Identidade", tabDiversity: "Diversidade Funcional", tabShop: "Loja",
      nameByCountry: "Nome segundo país de download",
      customNameLabel: "Ou escreva o seu próprio nome",
      customNameHint: "O seu nome terminado em -LIN ou -LINA",
      customNameError: "O nome deve terminar em -LIN ou -LINA",
      customNamePlaceholder: "Ex: PABLOLIN, MARIALINA...",
    },
    family: { sectionTitle: "Perfis da Família LINCE — Tutores de IA", sectionSubtitle: "Cada membro ensina inteligência artificial à sua geração, na sua língua, ao seu ritmo", filterAll: "Todos", filterElderly: "Avós (65+)", filterAdults: "Adultos (35-64)", filterYouth: "Jovens (16-34)", filterKids: "Crianças (6-15)", filterSpecial: "Especiais", expressionsTitle: "Expressões disponíveis", teachesTitle: "O que ensina", appearsTitle: "Quando aparece", approachTitle: "Abordagem pedagógica", philosophyQuote: "Uma família que ensina IA a todas as gerações", philosophySubtext: "Cada avatar é concebido com algoritmos pedagógicos específicos para a sua geração", statCharacters: "Personagens", statImages: "Imagens", statGenerations: "Gerações", statExpressions: "Expressões" },
    accessibility: { sectionTitle: "Acessibilidade e Conformidade Normativa", sectionSubtitle: "100% inclusiva — Cumprimento total da normativa espanhola e europeia de acessibilidade digital" },
    gamification: { sectionTitle: "Sistema de Jogo e Recompensas", sectionSubtitle: "Assim o motivamos para que continue a aprender todos os dias" },
    content: { sectionTitle: "Estrutura de Conteúdo", sectionSubtitle: "10 mundos temáticos de IA com mais de 100 cursos especializados" },
    architecture: { sectionTitle: "Arquitetura Técnica", sectionSubtitle: "Tecnologia preparada para crescer" },
    flows: { sectionTitle: "Fluxos de Utilizador", sectionSubtitle: "Experiências concebidas para cada tipo de utilizador" },
    monetization: { sectionTitle: "Modelo de Monetização", sectionSubtitle: "Freemium + Premium + B2B Enterprise" },
    roadmap: { sectionTitle: "Roadmap de Desenvolvimento", sectionSubtitle: "Plano de implementação por fases" },
    deliverables: { sectionTitle: "Entregáveis e Prioridades", sectionSubtitle: "Classificação MoSCoW de funcionalidades" },
    common: { copyright: "© 2026 ACNB IA SL. Todos os direitos reservados.", createdBy: "Criado por ACNB IA SL | Documento confidencial", creator: "Criado por ACNB IA SL", back: "Voltar", next: "Seguinte", previous: "Anterior", download: "Descarregar", save: "Guardar", close: "Fechar", selectCountry: "Selecionar país", customName: "Nome personalizado" },
    customizer: {
      title: "Personalize o seu Avatar LINCE",
      subtitle: "Escolha, personalize e faça seu o companheiro de aprendizagem de IA",
      step1: "Escolher Avatar", step2: "Aparência", step3: "Nome", step4: "Acessórios", step5: "Roupa", step6: "Diversidade", step7: "Resumo",
      philosophyNote: "Qualquer pessoa pode escolher qualquer avatar. Sem rótulos, sem limites.",
      philosophyBold: "O seu avatar, a sua identidade, as suas regras.",
      preview: "Pré-visualização",
      furColor: "Cor do pelo", eyeColor: "Cor dos olhos", spotPattern: "Padrão de manchas", hairstyle: "Penteado",
      clothing: "Roupa", clothingColor: "Cor da roupa", headAccessory: "Acessório de cabeça", accessory: "Acessório",
      pronouns: "Pronomes", voiceType: "Tipo de voz",
      assistiveDevice: "Dispositivo de assistência", assistiveFree: "SEMPRE GRATUITO",
      exportJSON: "Descarregar JSON", exportPNG: "Descarregar PNG",
      nameByCountry: "Nome segundo país", customNameLabel: "Ou escreva o seu próprio nome",
      generation: "Geração", role: "Função", expression: "Expressão",
      nameStep: "Escolha o nome do seu avatar",
      nameStepDesc: "Selecione um nome segundo o seu país ou crie um personalizado terminado em -LIN ou -LINA",
      customNameInput: "Escreva o seu nome personalizado",
      customNameRule: "Deve terminar em -LIN ou -LINA",
      nameExamples: "Exemplos: PABLOLIN, MARIALINA, CARLOLIN, SOFIALINA, ALEXLIN, VALENTINALINA",
      selectedName: "Nome selecionado",
      chooseAvatar: "Escolha o seu companheiro de aprendizagem",
      chooseAvatarDesc: "Qualquer avatar, qualquer pessoa. Sem restrições de género nem idade.",
      inclusivePhilosophy: "Filosofia inclusiva",
      inclusiveDesc: "A geração é apenas uma sugestão. Qualquer pessoa pode escolher qualquer avatar. Sem rótulos, sem limites. O seu avatar, a sua identidade, as suas regras.",
      headerTitle: "Protótipo Interativo — Personalização de Avatar",
      backToPRD: "Início",
      selected: "Selecionado",
      clothingType: "Tipo de roupa",
      clothingDesc: "Toda a roupa está disponível para todos. Sem rótulos de género.",
    },
    register: {
      title: "Junte-se ao LINCE",
      subtitle: "Crie a sua conta e comece a aprender IA com o seu avatar personalizado",
      emailLabel: "E-mail", emailPlaceholder: "voce@email.com",
      passwordLabel: "Palavra-passe", passwordPlaceholder: "Mínimo 8 caracteres",
      confirmPasswordLabel: "Confirmar palavra-passe", confirmPasswordPlaceholder: "Repita a sua palavra-passe",
      realNameLabel: "O seu nome real", realNamePlaceholder: "Ex: Ana, Maria, João...",
      realNameHint: "Usaremos para gerar opções de nome de utilizador",
      usernameLabel: "O seu nome LINCE", usernameHint: "Todos os nomes terminam em -LIN ou -LINA",
      usernamePlaceholder: "Ex: JOAOLIN, MARIALINA...", usernameRule: "Deve terminar em -LIN ou -LINA",
      generateBtn: "Gerar opções", orCustom: "Ou escreva o seu próprio nome:",
      suggestedNames: "Nomes sugeridos para si:",
      registerBtn: "CRIAR A MINHA CONTA LINCE",
      alreadyAccount: "Já tem conta?", loginLink: "Iniciar sessão",
      registering: "A criar a sua conta...", success: "Conta criada! Bem-vindo/a ao LINCE",
      errorEmail: "Insira um e-mail válido", errorPassword: "A palavra-passe deve ter pelo menos 8 caracteres",
      errorPasswordMatch: "As palavras-passe não coincidem", errorName: "Insira o seu nome",
      errorUsername: "O nome deve terminar em -LIN ou -LINA",
      errorUsernameTaken: "Este nome já está em uso. Tente outro.",
      privacyConsent: "Li e aceito a", privacyLink: "Política de Privacidade",
      privacyAnd: "e os", termsLink: "Termos de Utilização",
      dataProtectionTitle: "Proteção dos seus dados",
      dataProtectionText: "No LINCE levamos muito a sério a proteção dos seus dados pessoais. Cumprimos o Regulamento Geral de Proteção de Dados (RGPD) da UE e a Lei Orgânica 3/2018 de Proteção de Dados Pessoais (LOPDGDD) de Espanha.",
      dataWhat: "Que dados recolhemos?", dataWhatText: "Apenas o seu e-mail, palavra-passe (cifrada) e nome de utilizador. Nada mais até que decida passar para Premium.",
      dataWhy: "Para que os usamos?", dataWhyText: "Exclusivamente para gerir a sua conta, guardar o seu progresso de aprendizagem e personalizar a sua experiência.",
      dataWho: "Quem acede aos seus dados?", dataWhoText: "Apenas ACNB IA SL. NUNCA vendemos, partilhamos nem cedemos os seus dados a terceiros.",
      dataRights: "Os seus direitos", dataRightsText: "Tem direito a aceder, retificar, suprimir, portar e opor-se ao tratamento dos seus dados. Pode exercê-los escrevendo para privacidade@lince.com.",
      dataDelete: "Posso apagar a minha conta?", dataDeleteText: "Sim, a qualquer momento a partir do seu perfil. Todos os seus dados são eliminados de forma permanente e irreversível num prazo máximo de 30 dias.",
      dataSecurity: "Segurança", dataSecurityText: "Os seus dados são armazenados cifrados com padrões AES-256. As palavras-passe são hasheadas com bcrypt. Conexões protegidas com TLS 1.3.",
      dataMinors: "Menores de idade", dataMinorsText: "Menores de 14 anos precisam de autorização de um tutor legal. Entre 14 e 18 anos podem registar-se com consentimento informado.",
      premiumDataTitle: "Dados adicionais no Premium", premiumDataText: "Se decidir passar para Premium, pediremos dados adicionais (nome completo, data de nascimento, país) para personalizar melhor a sua experiência e cumprir a normativa fiscal.",
    },
    privacy: {
      title: "Política de Privacidade", lastUpdated: "Última atualização: Fevereiro 2026",
      controller: "Responsável pelo tratamento: ACNB IA SL", controllerAddress: "Sede social: Espanha",
      controllerEmail: "E-mail de contacto: privacidade@lince.com", dpo: "Encarregado de Proteção de Dados: dpo@lince.com",
    },
  },
};

// Deep merge: preserves base keys when extended adds sub-keys to the same top-level object
function deepMerge(base: any, ext: any): any {
  const result = { ...base };
  for (const key of Object.keys(ext)) {
    if (
      result[key] &&
      typeof result[key] === 'object' &&
      !Array.isArray(result[key]) &&
      typeof ext[key] === 'object' &&
      !Array.isArray(ext[key])
    ) {
      result[key] = { ...result[key], ...ext[key] };
    } else {
      result[key] = ext[key];
    }
  }
  return result;
}

const prdTranslations: Record<string, any> = {
  es: deepMerge(_basePrdTranslations.es, extendedTranslations.es || {}),
  en: deepMerge(_basePrdTranslations.en, extendedTranslations.en || {}),
  zh: deepMerge(_basePrdTranslations.zh, extendedTranslations.zh || {}),
  "pt-BR": deepMerge(_basePrdTranslations["pt-BR"] || _basePrdTranslations.es, (extendedTranslations as any)["pt-BR"] || {}),
  "pt-PT": deepMerge(_basePrdTranslations["pt-PT"] || _basePrdTranslations.es, (extendedTranslations as any)["pt-PT"] || {}),
};

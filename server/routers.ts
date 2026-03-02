import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { invokeLLM } from "./_core/llm";
import { generateImage } from "./_core/imageGeneration";
import { storagePut } from "./storage";
import { SignJWT, jwtVerify } from "jose";
import { ENV } from "./_core/env";
import {
  createPromptCreation,
  updatePromptCreation,
  getPromptCreationById,
  listPromptCreations,
  listUserPromptCreations,
  createGamePlayer,
  verifyGamePlayerLogin,
  getGamePlayerById,
  getGamePlayerByEmail,
  getGamePlayerByUsername,
  updateGamePlayerProgress,
  updateGamePlayerLanguage,
  updateGamePlayerAvatar,
  logLegalAcceptance,
  getLegalAcceptances,
  getLegalAcceptanceCount,
  createCustomCourse,
  updateCustomCourse,
  deleteCustomCourse,
  listUserCourses,
  getCustomCourseById,
  logToolView,
  getUserDashboardStats,
  deleteGamePlayerAccount,
  getPlayerUnlockState,
  getOrCreateChatSession,
  saveChatMessage,
  updateRelationshipLevel,
  getChatHistory,
  listPlayerChatSessions,
  deleteChatSession,
} from "./db";
import { notifyOwner } from "./_core/notification";
import { getAvatarPrompt, buildFullPrompt, AVATAR_PROMPTS } from "@shared/avatarPrompts";
import {
  savePushSubscription,
  removePushSubscription,
  updateSubscriptionPreferences,
  sendPushToPlayer,
  sendPushBroadcast,
  sendStreakReminders,
  sendDailyRewardReminders,
  cleanupExpiredSubscriptions,
} from "./pushService";

// ─── Security: Input Sanitization ───
function sanitizeText(input: string): string {
  return input
    .replace(/<[^>]*>/g, "") // Strip HTML tags
    .replace(/javascript:/gi, "") // Strip JS protocol
    .replace(/on\w+\s*=/gi, "") // Strip event handlers
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "") // Strip control chars
    .trim();
}

// ─── Security: Rate Limiting (in-memory per IP) ───
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_WINDOW_MS = 60_000; // 1 minute
const RATE_LIMIT_MAX_GENERATE = 5; // max 5 image generations per minute
const RATE_LIMIT_MAX_ENHANCE = 15; // max 15 prompt enhancements per minute
const RATE_LIMIT_MAX_LOGIN = 5; // max 5 login attempts per minute per IP
const RATE_LIMIT_MAX_REGISTER = 3; // max 3 registrations per minute per IP
const RATE_LIMIT_MAX_AVATAR_CHAT = 20; // max 20 avatar chat messages per minute

// Safety valve: if rate limit map grows too large (memory protection for 5000+ concurrent users)
// This prevents memory exhaustion from distributed attacks
const RATE_LIMIT_MAP_MAX_SIZE = 50_000;
function enforceMapSizeLimit(): void {
  if (rateLimitMap.size > RATE_LIMIT_MAP_MAX_SIZE) {
    const toRemove = Math.floor(rateLimitMap.size * 0.25);
    let removed = 0;
    const keys = Array.from(rateLimitMap.keys());
    for (let i = 0; i < keys.length && removed < toRemove; i++) {
      rateLimitMap.delete(keys[i]);
      removed++;
    }
    console.warn(`[RateLimit] Map size exceeded ${RATE_LIMIT_MAP_MAX_SIZE}, pruned ${removed} entries`);
  }
}

function checkRateLimit(key: string, maxRequests: number): void {
  enforceMapSizeLimit();
  const now = Date.now();
  const entry = rateLimitMap.get(key);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(key, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return;
  }

  if (entry.count >= maxRequests) {
    throw new TRPCError({
      code: "TOO_MANY_REQUESTS",
      message: `Demasiadas solicitudes. Espera ${Math.ceil((entry.resetAt - now) / 1000)} segundos antes de intentar de nuevo.`,
    });
  }

  entry.count++;
}

// Clean up rate limit map periodically (every 30s for high-traffic scenarios)
setInterval(() => {
  const now = Date.now();
  Array.from(rateLimitMap.entries()).forEach(([key, entry]) => {
    if (now > entry.resetAt) rateLimitMap.delete(key);
  });
}, 30_000);

// ─── Security: Game Session Token (JWT) ───
const GAME_TOKEN_SECRET = new TextEncoder().encode(ENV.cookieSecret + "-game-session");
const GAME_TOKEN_EXPIRY = "7d"; // 7 days

/** Generate a signed game session token for a player */
async function generateGameToken(playerId: number, username: string): Promise<string> {
  return new SignJWT({ playerId, username })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(GAME_TOKEN_EXPIRY)
    .sign(GAME_TOKEN_SECRET);
}

/** Verify a game session token and return the playerId */
async function verifyGameToken(token: string): Promise<{ playerId: number; username: string }> {
  try {
    const { payload } = await jwtVerify(token, GAME_TOKEN_SECRET);
    if (typeof payload.playerId !== "number" || typeof payload.username !== "string") {
      throw new Error("Invalid token payload");
    }
    return { playerId: payload.playerId as number, username: payload.username as string };
  } catch {
    throw new TRPCError({ code: "UNAUTHORIZED", message: "Sesión de juego inválida o expirada. Inicia sesión de nuevo." });
  }
}

/** Extract and validate game token from request, ensuring playerId matches */
async function authenticateGamePlayer(ctx: any, claimedPlayerId: number): Promise<{ playerId: number; username: string }> {
  const authHeader = ctx.req.headers["x-game-token"] as string | undefined;
  if (!authHeader) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: "Token de sesión de juego requerido. Inicia sesión." });
  }
  const session = await verifyGameToken(authHeader);
  if (session.playerId !== claimedPlayerId) {
    throw new TRPCError({ code: "FORBIDDEN", message: "No tienes permiso para modificar datos de otro jugador." });
  }
  return session;
}

/** Helper to get client IP from request context */
function getClientIP(ctx: any): string {
  return (
    (ctx.req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() ||
    ctx.req.socket?.remoteAddress ||
    "unknown"
  );
}

// ─── Evaluation Parameters ───
/**
 * Evaluation criteria for each of the 4 fields.
 * These are returned to the frontend for display and education.
 */
const EVALUATION_CRITERIA = {
  subject: {
    name: "Sujeto",
    maxScore: 30,
    criteria: [
      { name: "Especificidad", weight: 10, description: "Cuanto más específico sea el sujeto, mejor resultado. 'Un lince ibérico con gafas de sol enseñando código' > 'un animal'" },
      { name: "Claridad", weight: 10, description: "El sujeto debe ser comprensible y sin ambigüedades. Evita abstracciones vagas." },
      { name: "Imaginabilidad", weight: 10, description: "¿Se puede visualizar fácilmente? Los sujetos concretos y visuales producen mejores imágenes." },
    ],
  },
  style: {
    name: "Estilo",
    maxScore: 25,
    criteria: [
      { name: "Coherencia", weight: 10, description: "El estilo debe ser compatible con el sujeto. Un retrato hiperrealista de un personaje pixel-art no funciona." },
      { name: "Definición", weight: 8, description: "Estilos bien definidos (ej: 'acuarela japonesa') dan mejores resultados que genéricos." },
      { name: "Referencia artística", weight: 7, description: "Mencionar artistas o movimientos específicos (ej: 'estilo Ghibli', 'Art Nouveau') mejora la precisión." },
    ],
  },
  environment: {
    name: "Entorno",
    maxScore: 25,
    criteria: [
      { name: "Atmósfera", weight: 10, description: "Un buen entorno define la atmósfera. 'Bosque neblinoso al amanecer' > 'naturaleza'." },
      { name: "Profundidad", weight: 8, description: "Entornos con capas (primer plano, fondo, cielo) crean composiciones más ricas." },
      { name: "Iluminación implícita", weight: 7, description: "El entorno sugiere iluminación: 'atardecer dorado' implica luz cálida lateral." },
    ],
  },
  details: {
    name: "Detalles",
    maxScore: 20,
    criteria: [
      { name: "Colores específicos", weight: 5, description: "Nombrar colores exactos (ej: 'cyan neón #00E5FF') da control preciso sobre la paleta." },
      { name: "Iluminación explícita", weight: 5, description: "Definir tipo de luz: volumétrica, rim light, contraluz, luz suave difusa, etc." },
      { name: "Composición", weight: 5, description: "Indicar ángulo de cámara, regla de tercios, primer plano vs panorámica, etc." },
      { name: "Estado de ánimo", weight: 5, description: "Emociones y sensaciones: épico, sereno, misterioso, alegre, dramático." },
    ],
  },
};

/**
 * Evaluates the quality of the 4 input fields and returns a score + feedback.
 */
function evaluatePromptQuality(input: {
  subject: string;
  style: string;
  environment: string;
  details: string;
}): { totalScore: number; maxScore: number; percentage: number; fieldScores: Record<string, { score: number; max: number; feedback: string }> } {
  const fieldScores: Record<string, { score: number; max: number; feedback: string }> = {};

  // Subject evaluation
  const subjectLen = input.subject.length;
  let subjectScore = 0;
  let subjectFeedback = "";
  if (subjectLen > 50) { subjectScore += 10; subjectFeedback = "Excelente especificidad. "; }
  else if (subjectLen > 20) { subjectScore += 6; subjectFeedback = "Buena especificidad, podrías añadir más detalle. "; }
  else { subjectScore += 3; subjectFeedback = "Muy corto — sé más específico. "; }

  if (!/[,;:]/.test(input.subject) && subjectLen < 30) { subjectScore += 3; subjectFeedback += "Claro y directo. "; }
  else if (subjectLen > 20) { subjectScore += 7; subjectFeedback += "Buena claridad. "; }
  else { subjectScore += 5; subjectFeedback += "Aceptable. "; }

  const visualWords = /color|luz|brillante|oscuro|grande|pequeño|alto|bajo|joven|viejo|robot|persona|animal|edificio|paisaje/i;
  if (visualWords.test(input.subject)) { subjectScore += 10; subjectFeedback += "Buena imaginabilidad visual."; }
  else if (subjectLen > 30) { subjectScore += 7; subjectFeedback += "Imaginabilidad aceptable."; }
  else { subjectScore += 4; subjectFeedback += "Añade elementos visuales concretos."; }

  fieldScores.subject = { score: Math.min(subjectScore, 30), max: 30, feedback: subjectFeedback.trim() };

  // Style evaluation
  let styleScore = 0;
  let styleFeedback = "";
  const specificStyles = /ghibli|art nouveau|bauhaus|impresionista|cubista|surrealista|pop art|vaporwave|steampunk|gothic|renaissance/i;
  if (specificStyles.test(input.style)) { styleScore = 25; styleFeedback = "Estilo muy específico y definido — excelente referencia artística."; }
  else if (input.style.length > 10) { styleScore = 18; styleFeedback = "Buen estilo. Podrías añadir una referencia artística específica para mejorar."; }
  else { styleScore = 12; styleFeedback = "Estilo básico. Prueba a ser más específico (ej: 'acuarela japonesa' en vez de 'acuarela')."; }
  fieldScores.style = { score: Math.min(styleScore, 25), max: 25, feedback: styleFeedback };

  // Environment evaluation
  let envScore = 0;
  let envFeedback = "";
  const atmosphericWords = /amanecer|atardecer|noche|lluvia|niebla|nieve|tormenta|dorado|crepúsculo|bruma|neón|estrellado/i;
  const depthWords = /fondo|primer plano|horizonte|cielo|suelo|montañas|edificios|árboles|nubes/i;
  if (atmosphericWords.test(input.environment)) { envScore += 10; envFeedback = "Excelente atmósfera. "; }
  else if (input.environment.length > 15) { envScore += 6; envFeedback = "Buena atmósfera. "; }
  else { envScore += 3; envFeedback = "Añade elementos atmosféricos (hora del día, clima). "; }

  if (depthWords.test(input.environment)) { envScore += 8; envFeedback += "Buena profundidad. "; }
  else { envScore += 4; envFeedback += "Añade capas de profundidad. "; }

  envScore += input.environment.length > 20 ? 7 : 3;
  envFeedback += input.environment.length > 20 ? "Iluminación implícita detectada." : "Describe más el entorno para mejor iluminación.";
  fieldScores.environment = { score: Math.min(envScore, 25), max: 25, feedback: envFeedback.trim() };

  // Details evaluation
  let detailsScore = 0;
  let detailsFeedback = "";
  if (!input.details || input.details.length === 0) {
    detailsScore = 0;
    detailsFeedback = "Sin detalles adicionales. Añadir colores, iluminación y composición mejoraría mucho el resultado.";
  } else {
    const colorWords = /color|#[0-9a-f]{3,6}|rojo|azul|verde|cyan|dorado|neón|pastel|monocromático/i;
    const lightWords = /luz|iluminación|sombra|contraluz|volumétrica|rim light|suave|dramática|cenital/i;
    const compWords = /ángulo|cámara|primer plano|panorámica|cenital|picado|contrapicado|regla de tercios|bokeh/i;
    const moodWords = /épico|sereno|misterioso|alegre|dramático|melancólico|energético|tranquilo|oscuro|brillante/i;

    if (colorWords.test(input.details)) { detailsScore += 5; detailsFeedback += "Colores especificados. "; } else { detailsScore += 1; detailsFeedback += "Añade colores específicos. "; }
    if (lightWords.test(input.details)) { detailsScore += 5; detailsFeedback += "Iluminación definida. "; } else { detailsScore += 1; detailsFeedback += "Define el tipo de iluminación. "; }
    if (compWords.test(input.details)) { detailsScore += 5; detailsFeedback += "Composición indicada. "; } else { detailsScore += 1; detailsFeedback += "Indica composición/ángulo. "; }
    if (moodWords.test(input.details)) { detailsScore += 5; detailsFeedback += "Estado de ánimo definido."; } else { detailsScore += 1; detailsFeedback += "Añade estado de ánimo."; }
  }
  fieldScores.details = { score: Math.min(detailsScore, 20), max: 20, feedback: detailsFeedback.trim() };

  const totalScore = Object.values(fieldScores).reduce((sum, f) => sum + f.score, 0);
  const maxScore = 100;

  return { totalScore, maxScore, percentage: Math.round((totalScore / maxScore) * 100), fieldScores };
}

/**
 * MASSIVELY IMPROVED: Enhances the 4 simple fields into a detailed, professional
 * image generation prompt using the LLM with structured JSON output.
 */
async function enhancePromptWithAI(input: {
  subject: string;
  style: string;
  environment: string;
  details: string;
}): Promise<{ enhancedPrompt: string; breakdown: { composition: string; lighting: string; colorPalette: string; technicalTerms: string; artisticReferences: string } }> {
  const result = await invokeLLM({
    messages: [
      {
        role: "system",
        content: `You are the world's top prompt engineer for AI image generation, trained on millions of successful prompts from Midjourney, DALL-E 3, and Stable Diffusion.

Your mission: Transform 4 simple user inputs into an EXTREMELY detailed, professional-grade image prompt that will produce STUNNING, gallery-worthy results.

## YOUR ENHANCEMENT PROCESS:

### STEP 1 — SUBJECT ENRICHMENT
- Add precise physical descriptions (textures, materials, proportions)
- Include action/pose details if applicable
- Add emotional expression or character traits
- Specify exact quantities and spatial relationships

### STEP 2 — STYLE AMPLIFICATION
- Map the user's style choice to specific artistic techniques
- Add rendering quality terms (subsurface scattering, ray tracing, etc.)
- Reference specific artists or art movements when relevant
- Include medium-specific details (brush strokes for painting, film grain for photo)

### STEP 3 — ENVIRONMENT CONSTRUCTION
- Build a complete scene with foreground, midground, and background
- Add atmospheric effects (volumetric fog, dust particles, lens flares)
- Specify time of day and weather conditions
- Include environmental storytelling elements

### STEP 4 — TECHNICAL MASTERY
- Add professional photography/art terms
- Specify camera settings if photographic (f/1.4, 85mm, shallow DOF)
- Include post-processing style (color grading, HDR, film emulation)
- Add quality anchors (8K, ultra-detailed, masterpiece, award-winning)

### STEP 5 — MOOD & ATMOSPHERE
- Define the emotional tone through color temperature
- Add sensory descriptions (warm, cold, ethereal, gritty)
- Include narrative elements that suggest a story
- Balance complexity with coherence

## OUTPUT FORMAT:
Return a JSON object with:
- "enhancedPrompt": The complete, final prompt (3-5 rich sentences in English)
- "composition": Brief description of the composition approach
- "lighting": The lighting setup described
- "colorPalette": The color palette being used
- "technicalTerms": Key technical terms added
- "artisticReferences": Any artistic references included

CRITICAL RULES:
- Output MUST be in English regardless of input language
- The enhanced prompt must be 3-5 sentences, densely packed with visual detail
- Never include negative prompts or what NOT to show
- Never include meta-instructions like "generate an image of..."
- Start directly with the subject description`,
      },
      {
        role: "user",
        content: `SUBJECT: ${input.subject}
STYLE: ${input.style}
ENVIRONMENT: ${input.environment}
DETAILS: ${input.details || "No additional details specified — use your expertise to add the best possible details"}`,
      },
    ],
    response_format: {
      type: "json_schema",
      json_schema: {
        name: "enhanced_prompt",
        strict: true,
        schema: {
          type: "object",
          properties: {
            enhancedPrompt: { type: "string", description: "The complete enhanced prompt for image generation" },
            composition: { type: "string", description: "Brief composition approach" },
            lighting: { type: "string", description: "Lighting setup" },
            colorPalette: { type: "string", description: "Color palette" },
            technicalTerms: { type: "string", description: "Key technical terms" },
            artisticReferences: { type: "string", description: "Artistic references" },
          },
          required: ["enhancedPrompt", "composition", "lighting", "colorPalette", "technicalTerms", "artisticReferences"],
          additionalProperties: false,
        },
      },
    },
  });

  const content = result.choices[0]?.message?.content;
  let textContent = "";
  if (typeof content === "string") {
    textContent = content;
  } else if (Array.isArray(content)) {
    textContent = content
      .filter((c) => c.type === "text")
      .map((c) => (c as { type: "text"; text: string }).text)
      .join(" ");
  }

  try {
    const parsed = JSON.parse(textContent);
    return {
      enhancedPrompt: parsed.enhancedPrompt?.trim() || textContent.trim(),
      breakdown: {
        composition: parsed.composition || "",
        lighting: parsed.lighting || "",
        colorPalette: parsed.colorPalette || "",
        technicalTerms: parsed.technicalTerms || "",
        artisticReferences: parsed.artisticReferences || "",
      },
    };
  } catch {
    // Fallback if JSON parsing fails
    return {
      enhancedPrompt: textContent.trim(),
      breakdown: {
        composition: "Auto-detected",
        lighting: "Auto-detected",
        colorPalette: "Auto-detected",
        technicalTerms: "8K, ultra-detailed",
        artisticReferences: "N/A",
      },
    };
  }
}

// ─── Professional Text Prompt Enhancement (Anthropic 6 Techniques) ───
async function enhanceTextPromptWithAI(input: {
  role: string;
  task: string;
  format: string;
  example: string;
}): Promise<{ enhancedPrompt: string; score: number; tips: string[]; technique: string }> {
  const result = await invokeLLM({
    messages: [
      {
        role: "system",
        content: `Eres un experto en ingeniería de prompts basado en las 6 técnicas oficiales de Anthropic y la filosofía de Dario Amodei ("intervenir quirúrgicamente, ser pragmático y basado en evidencia").

Tu misión: Tomar 4 inputs simples del usuario y construir un prompt profesional EXTREMADAMENTE efectivo.

## LAS 6 TÉCNICAS DE ANTHROPIC QUE APLICAS INTERNAMENTE:
1. **Sé específico y directo** — Sin rodeos, instrucciones claras
2. **Usa ejemplos (few-shot)** — Si el usuario da ejemplo, úsalo como patrón
3. **Deja que la IA piense (chain of thought)** — Estructura el razonamiento paso a paso
4. **Usa formato XML/estructurado** — Organiza secciones con marcadores claros
5. **Da un rol al modelo** — Asigna expertise específica
6. **Prefill / Restricciones** — Establece límites y formato de salida

## FILOSOFÍA DARIO AMODEI (CEO Anthropic, 2025):
- "Estamos en la adolescencia tecnológica" — los prompts deben ser maduros y responsables
- "50% de empleos white-collar serán disrumpidos en 1-5 años" — saber hacer prompts es SUPERVIVENCIA profesional
- "Intervenir quirúrgicamente" — prompts precisos, no genéricos
- "Pragmático y basado en evidencia" — resultados medibles

## PROCESO:
1. Toma el ROL del usuario → conviértelo en un system prompt con expertise específica
2. Toma la TAREA → descomponla en pasos claros con chain of thought
3. Toma el FORMATO → estructura la salida esperada con marcadores
4. Toma el EJEMPLO (si existe) → úsalo como few-shot learning
5. Aplica restricciones inteligentes automáticamente
6. Añade instrucciones de calidad (verificar datos, citar fuentes, ser específico)

## OUTPUT FORMAT (JSON):
- "enhancedPrompt": El prompt profesional completo listo para copiar y usar (en español)
- "score": Puntuación de calidad del prompt del usuario (0-100)
- "tips": Array de 3 consejos específicos para mejorar (en español)
- "technique": Qué técnica de Anthropic fue la más relevante aplicada

CRÍTICO:
- El prompt mejorado DEBE estar en español
- Debe ser directamente usable (copiar y pegar en cualquier IA)
- No incluir meta-instrucciones como "este es un prompt para..."
- Empezar directamente con el contenido del prompt`,
      },
      {
        role: "user",
        content: `ROL Y CONTEXTO: ${input.role}\nTAREA: ${input.task}\nFORMATO Y TONO: ${input.format}\nEJEMPLO: ${input.example || "No proporcionado — aplica las mejores prácticas automáticamente"}`,
      },
    ],
    response_format: {
      type: "json_schema",
      json_schema: {
        name: "enhanced_text_prompt",
        strict: true,
        schema: {
          type: "object",
          properties: {
            enhancedPrompt: { type: "string", description: "The complete enhanced prompt in Spanish" },
            score: { type: "integer", description: "Quality score 0-100" },
            tips: { type: "array", items: { type: "string" }, description: "3 improvement tips in Spanish" },
            technique: { type: "string", description: "Most relevant Anthropic technique applied" },
          },
          required: ["enhancedPrompt", "score", "tips", "technique"],
          additionalProperties: false,
        },
      },
    },
  });

  const content = result.choices[0]?.message?.content;
  let textContent = "";
  if (typeof content === "string") {
    textContent = content;
  } else if (Array.isArray(content)) {
    textContent = content
      .filter((c) => c.type === "text")
      .map((c) => (c as { type: "text"; text: string }).text)
      .join(" ");
  }

  try {
    const parsed = JSON.parse(textContent);
    return {
      enhancedPrompt: parsed.enhancedPrompt?.trim() || textContent.trim(),
      score: parsed.score || 50,
      tips: parsed.tips || ["Sé más específico en la tarea", "Añade un ejemplo concreto", "Define el formato de salida"],
      technique: parsed.technique || "Especificidad y claridad",
    };
  } catch {
    return {
      enhancedPrompt: textContent.trim(),
      score: 50,
      tips: ["Sé más específico en la tarea", "Añade un ejemplo concreto", "Define el formato de salida"],
      technique: "Especificidad y claridad",
    };
  }
}

// ─── Valid avatar keys ───
const VALID_AVATAR_KEYS = [
  // Familia Zaragoza
  "YAYALIN", "YAYALINA", "PAPALIN", "MAMALINA",
  "CHAVALIN", "CHAVALINA", "PEQUELIN", "PEQUELINA",
  "ATOLONDRALIN", "SABELIN",
  // MUSICALIN
  "LUMALIN", "VOLTZLIN", "RIMALIN", "CRISTALIN", "SONALIN",
  "COREOLIN", "MANTRALIN", "BRISLIN", "BEATLIN", "FLOWALIN", "STILIN",
  // Evento Especial (Urbano extendido)
  "SIRENLIN", "ZOTEALIN", "PULSOLIN", "GRAFALIN", "CRONOSLIN",
  "GAMELIN", "TRAPZOLIN", "WAVELIN", "KUMEYLIN", "VERSOLIN", "MARAKLIN",
  // Zaragoza Histórico
  "LAFITALIN", "NAYIMIN", "ANDERIN", "GABILIN", "PARDEZALIN",
  "CAMINERIN", "SENORIN", "AGUADIN", "VILLALIN", "SORIANIN",
  // Aragonesa
  "MANOLIN", "PILARIN", "CIERZOLIN", "GOYALIN", "JOTALIN",
  "TERNELIN", "BATURRALIN", "MUDEJARIN", "EBROLIN", "BORRAJIN",
  // Especialistas
  "ETICOLIN", "DATOLIN", "ETICALIN", "ABOGALIN", "INFLUENCELIN",
  "CURRALIN", "DOCTOLIN", "PROFALIN", "EMPRENDALIN", "CONSPIRALIN",
  "ABUELIN", "ARTISTALIN", "GAMERLIN",
] as const;

// ─── Game Player Router ───
const gamePlayerRouter = router({
  /** Register a new game player — RATE LIMITED */
  register: publicProcedure
    .input(
      z.object({
        email: z.string().email("Email inválido").max(320),
        realName: z.string().min(2, "Nombre mínimo 2 caracteres").max(128),
        // All below are now OPTIONAL for ultra-simple registration
        username: z.string().min(3).max(30).optional(),
        password: z.string().min(6).max(128).optional(),
        avatarKey: z.string().refine(
          (v) => VALID_AVATAR_KEYS.includes(v as any),
          { message: "Avatar no válido" }
        ).optional(),
        language: z.enum(["es", "en", "zh"]).default("es"),
        country: z.string().min(2).max(5).default("ES"),
        instagramUser: z.string().max(128).optional(),
        registrationCode: z.string().max(64).optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      // Rate limit registrations per IP
      const ip = getClientIP(ctx);
      checkRateLimit(`register:${ip}`, RATE_LIMIT_MAX_REGISTER);
      // Sanitize
      const email = sanitizeText(input.email).toLowerCase().trim();
      const realName = sanitizeText(input.realName).trim();
      const country = (input.country || "ES").toUpperCase().trim();
      const registrationCode = input.registrationCode ? sanitizeText(input.registrationCode).trim() : undefined;
      const instagramUser = input.instagramUser ? sanitizeText(input.instagramUser).replace(/^@/, "").trim() : undefined;

      // Auto-generate username from realName if not provided
      let username: string;
      if (input.username) {
        username = sanitizeText(input.username).toUpperCase().trim();
        // Validate username format: must end in LIN or LINA (or other valid suffixes)
        const validSuffixes = ["LIN", "LINA", "LYNX", "LYN", "LINX", "LYNCE", "LING", "LINCE", "LUCHS", "OLIN", "ELIN"];
        if (!validSuffixes.some(s => username.endsWith(s))) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "El nombre de usuario debe terminar en -LIN o -LINA (ej: MIGUELLIN, SOFILINA)",
          });
        }
      } else {
        // Auto-generate: take first part of name + LIN suffix
        const cleanName = realName.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase().replace(/[^A-Z]/g, "");
        const baseName = cleanName.slice(0, 6) || "LINCE";
        username = baseName + "LIN";
        // Ensure uniqueness by appending random digits if needed
        let existing = await getGamePlayerByUsername(username);
        let attempts = 0;
        while (existing && attempts < 20) {
          const rand = Math.floor(Math.random() * 999) + 1;
          username = baseName + rand + "LIN";
          existing = await getGamePlayerByUsername(username);
          attempts++;
        }
      }

      // Auto-generate password if not provided (random 12-char)
      const password = input.password || Array.from({ length: 12 }, () => "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#".charAt(Math.floor(Math.random() * 57))).join("");

      // Auto-assign random avatar if not provided
      const avatarKey = input.avatarKey || VALID_AVATAR_KEYS[Math.floor(Math.random() * VALID_AVATAR_KEYS.length)];

      // Check if email already exists
      const existingEmail = await getGamePlayerByEmail(email);
      if (existingEmail) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Ya existe una cuenta con este email",
        });
      }

      // Check if username already exists (for explicitly provided usernames)
      if (input.username) {
        const existingUsername = await getGamePlayerByUsername(username);
        if (existingUsername) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "Este nombre de usuario ya está en uso",
          });
        }
      }

      // Create the player
      const player = await createGamePlayer({
        email,
        username,
        realName,
        password,
        avatarKey,
        language: input.language,
        country,
        instagramUser,
        registrationCode,
      });

      // Notify owner of new registration
      try {
        await notifyOwner({
          title: `Nuevo jugador LINCE: ${username}`,
          content: `Nombre: ${realName}\nEmail: ${email}\nAvatar: ${avatarKey}\nIdioma: ${input.language}\nPaís: ${country}\nRegistro simplificado: ${!input.password ? 'SÍ' : 'NO'}`,
        });
      } catch { /* non-critical */ }

      // Generate game session token
      const gameToken = await generateGameToken(player.id, player.username);

      return {
        id: player.id,
        email: player.email,
        username: player.username,
        realName: player.realName,
        avatarKey: player.avatarKey,
        language: player.language,
        linceCoins: player.linceCoins,
        xp: player.xp,
        currentLevel: player.currentLevel,
        gameToken,
        needsOnboarding: true, // Always show onboarding for new users
      };
    }),

  /** Login a game player — RATE LIMITED */
  login: publicProcedure
    .input(
      z.object({
        email: z.string().email().max(320),
        password: z.string().min(1).max(128),
      })
    )
    .mutation(async ({ input, ctx }) => {
      // Rate limit login attempts per IP
      const ip = getClientIP(ctx);
      checkRateLimit(`login:${ip}`, RATE_LIMIT_MAX_LOGIN);

      const player = await verifyGamePlayerLogin(input.email, input.password);
      if (!player) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Email o contraseña incorrectos",
        });
      }

      // Generate game session token
      const gameToken = await generateGameToken(player.id, player.username);

      return {
        id: player.id,
        email: player.email,
        username: player.username,
        realName: player.realName,
        avatarKey: player.avatarKey,
        language: player.language,
        linceCoins: player.linceCoins,
        xp: player.xp,
        currentLevel: player.currentLevel,
        totalPromptsWritten: player.totalPromptsWritten,
        streak: player.streak,
        lastPlayedDate: player.lastPlayedDate,
        levelsData: player.levelsData,
        dailyRewardsData: player.dailyRewardsData,
        gameToken,
      };
    }),

  /** Get player profile by ID — AUTHENTICATED */
  getProfile: publicProcedure
    .input(z.object({ id: z.number().int().positive() }))
    .query(async ({ input, ctx }) => {
      // Authenticate: only the player themselves can view full profile
      await authenticateGamePlayer(ctx, input.id);
      const player = await getGamePlayerById(input.id);
      if (!player) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Jugador no encontrado" });
      }
      return {
        id: player.id,
        username: player.username,
        realName: player.realName,
        avatarKey: player.avatarKey,
        language: player.language,
        linceCoins: player.linceCoins,
        xp: player.xp,
        currentLevel: player.currentLevel,
        totalPromptsWritten: player.totalPromptsWritten,
        streak: player.streak,
        lastPlayedDate: player.lastPlayedDate,
        levelsData: player.levelsData,
        dailyRewardsData: player.dailyRewardsData,
      };
    }),

  /** Sync game progress from client — AUTHENTICATED */
  syncProgress: publicProcedure
    .input(
      z.object({
        playerId: z.number().int().positive(),
        linceCoins: z.number().int().min(0),
        xp: z.number().int().min(0),
        currentLevel: z.number().int().min(1).max(10),
        totalPromptsWritten: z.number().int().min(0),
        streak: z.number().int().min(0),
        lastPlayedDate: z.string().max(10),
        levelsData: z.array(z.object({
          id: z.number(),
          completed: z.boolean(),
          stars: z.number(),
          promptsCompleted: z.number(),
          bestScore: z.number(),
        })),
        dailyRewardsData: z.object({
          lastClaimDate: z.string(),
          consecutiveDays: z.number(),
          totalDaysClaimed: z.number(),
          weekProgress: z.array(z.boolean()),
        }),
      })
    )
    .mutation(async ({ input, ctx }) => {
      // Rate limit: max 20 progress syncs per minute per IP
      const ip = getClientIP(ctx);
      checkRateLimit(`sync:${ip}`, 20);
      // Authenticate: only the player themselves can sync their progress
      await authenticateGamePlayer(ctx, input.playerId);
      const updated = await updateGamePlayerProgress(input.playerId, {
        linceCoins: input.linceCoins,
        xp: input.xp,
        currentLevel: input.currentLevel,
        totalPromptsWritten: input.totalPromptsWritten,
        streak: input.streak,
        lastPlayedDate: input.lastPlayedDate,
        levelsData: input.levelsData,
        dailyRewardsData: input.dailyRewardsData,
      });
      if (!updated) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Jugador no encontrado" });
      }
      return { success: true };
    }),

  /** Update player language preference — AUTHENTICATED */
  setLanguage: publicProcedure
    .input(
      z.object({
        playerId: z.number().int().positive(),
        language: z.enum(["es", "en", "zh"]),
      })
    )
    .mutation(async ({ input, ctx }) => {
      // Rate limit: max 10 language changes per minute per IP
      const ip = getClientIP(ctx);
      checkRateLimit(`setlang:${ip}`, 10);
      // Authenticate: only the player themselves can change their language
      await authenticateGamePlayer(ctx, input.playerId);
      await updateGamePlayerLanguage(input.playerId, input.language);
      return { success: true };
    }),

  /** Change avatar — AUTHENTICATED */
  setAvatar: publicProcedure
    .input(
      z.object({
        playerId: z.number().int().positive(),
        avatarKey: z.string().refine(
          (v) => VALID_AVATAR_KEYS.includes(v as any),
          { message: "Avatar no válido" }
        ),
      })
    )
    .mutation(async ({ input, ctx }) => {
      // Rate limit: max 10 avatar changes per minute per IP
      const ip = getClientIP(ctx);
      checkRateLimit(`avatar:${ip}`, 10);
      await authenticateGamePlayer(ctx, input.playerId);
      await updateGamePlayerAvatar(input.playerId, input.avatarKey);
      return { success: true, avatarKey: input.avatarKey };
    }),

  /** Batch sync progress from offline queue (Background Sync) — AUTHENTICATED */
  batchSyncProgress: publicProcedure
    .input(
      z.object({
        playerId: z.number().int().positive(),
        actions: z.array(
          z.object({
            type: z.enum(['progress', 'levelComplete', 'dailyReward', 'promptResult', 'coinsEarned']),
            payload: z.record(z.string(), z.any()),
            timestamp: z.number(),
          })
        ).min(1).max(100),
      })
    )
    .mutation(async ({ input, ctx }) => {
      // Rate limit: max 5 batch syncs per minute per IP
      const ip = getClientIP(ctx);
      checkRateLimit(`batchsync:${ip}`, 5);
      // Authenticate: only the player themselves can batch sync
      await authenticateGamePlayer(ctx, input.playerId);
      const player = await getGamePlayerById(input.playerId);
      if (!player) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Jugador no encontrado' });
      }

      // Sort actions by timestamp and apply them sequentially
      const sortedActions = [...input.actions].sort((a, b) => a.timestamp - b.timestamp);

      // Build the final state by applying all actions
      let currentState = {
        linceCoins: player.linceCoins,
        xp: player.xp,
        currentLevel: player.currentLevel,
        totalPromptsWritten: player.totalPromptsWritten,
        streak: player.streak,
        lastPlayedDate: player.lastPlayedDate,
        levelsData: player.levelsData || [],
        dailyRewardsData: player.dailyRewardsData || {
          lastClaimDate: '',
          consecutiveDays: 0,
          totalDaysClaimed: 0,
          weekProgress: [false, false, false, false, false, false, false],
        },
      };

      for (const action of sortedActions) {
        switch (action.type) {
          case 'progress':
            // Full state sync — use the payload directly
            if (action.payload.linceCoins !== undefined) currentState.linceCoins = Number(action.payload.linceCoins);
            if (action.payload.xp !== undefined) currentState.xp = Number(action.payload.xp);
            if (action.payload.currentLevel !== undefined) currentState.currentLevel = Number(action.payload.currentLevel);
            if (action.payload.totalPromptsWritten !== undefined) currentState.totalPromptsWritten = Number(action.payload.totalPromptsWritten);
            if (action.payload.streak !== undefined) currentState.streak = Number(action.payload.streak);
            if (action.payload.lastPlayedDate !== undefined) currentState.lastPlayedDate = String(action.payload.lastPlayedDate);
            if (action.payload.levelsData) currentState.levelsData = action.payload.levelsData as typeof currentState.levelsData;
            if (action.payload.dailyRewardsData) currentState.dailyRewardsData = action.payload.dailyRewardsData as typeof currentState.dailyRewardsData;
            break;

          case 'levelComplete':
            // Increment-style: apply level completion
            if (action.payload.levelId && action.payload.stars !== undefined) {
              const levels = [...(currentState.levelsData as any[])];
              const idx = levels.findIndex((l: any) => l.id === Number(action.payload.levelId));
              if (idx >= 0) {
                levels[idx] = {
                  ...levels[idx],
                  completed: true,
                  stars: Math.max(levels[idx].stars || 0, Number(action.payload.stars)),
                };
                currentState.levelsData = levels;
                currentState.currentLevel = Math.max(currentState.currentLevel, Number(action.payload.levelId) + 1);
              }
            }
            break;

          case 'coinsEarned':
            if (action.payload.coins) currentState.linceCoins += Number(action.payload.coins);
            if (action.payload.xp) currentState.xp += Number(action.payload.xp);
            break;

          case 'promptResult':
            if (action.payload.coins) currentState.linceCoins += Number(action.payload.coins);
            if (action.payload.xp) currentState.xp += Number(action.payload.xp);
            currentState.totalPromptsWritten += 1;
            break;

          case 'dailyReward':
            if (action.payload.coins) currentState.linceCoins += Number(action.payload.coins);
            if (action.payload.xp) currentState.xp += Number(action.payload.xp);
            if (action.payload.dailyRewardsData) {
              currentState.dailyRewardsData = action.payload.dailyRewardsData as typeof currentState.dailyRewardsData;
            }
            break;
        }
      }

      // Apply the final merged state to the database
      const updated = await updateGamePlayerProgress(input.playerId, currentState);
      if (!updated) {
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Error al sincronizar progreso' });
      }

      return {
        success: true,
        syncedActions: sortedActions.length,
        finalState: {
          linceCoins: currentState.linceCoins,
          xp: currentState.xp,
          currentLevel: currentState.currentLevel,
          totalPromptsWritten: currentState.totalPromptsWritten,
          streak: currentState.streak,
        },
      };
    }),

  /** Check if email is available */
  checkEmail: publicProcedure
    .input(z.object({ email: z.string().email().max(320) }))
    .query(async ({ input }) => {
      const existing = await getGamePlayerByEmail(input.email);
      return { available: !existing };
    }),

  /** Check if username is available */
  checkUsername: publicProcedure
    .input(z.object({ username: z.string().min(3).max(30) }))
    .query(async ({ input }) => {
      const existing = await getGamePlayerByUsername(input.username);
      return { available: !existing };
    }),

  /** Get progressive unlock state from DB — AUTHENTICATED */
  getUnlockState: publicProcedure
    .input(z.object({ playerId: z.number().int().positive() }))
    .query(async ({ input, ctx }) => {
      const ip = getClientIP(ctx);
      checkRateLimit(`unlock:${ip}`, 30);
      await authenticateGamePlayer(ctx, input.playerId);
      const state = await getPlayerUnlockState(input.playerId);
      if (!state) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Jugador no encontrado" });
      }
      return state;
    }),

  /** P0-2: GDPR Account Deletion */
  deleteAccount: publicProcedure
    .input(z.object({
      email: z.string().email(),
      password: z.string().min(1),
    }))
    .mutation(async ({ input }) => {
      const player = await verifyGamePlayerLogin(input.email, input.password);
      if (!player) {
        throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Credenciales incorrectas' });
      }
      const deleted = await deleteGamePlayerAccount(player.id);
      if (!deleted) {
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Error al eliminar la cuenta' });
      }
      try {
        await notifyOwner({ title: 'GDPR: Cuenta eliminada', content: `Usuario ${player.username} (${player.email}) elimin\u00f3 su cuenta.` });
      } catch {}
      return { success: true };
    }),
});

// ─── Prompt Studio Router ───
const promptStudioRouter = router({
  /** Get evaluation criteria (public, no auth needed) */
  getEvaluationCriteria: publicProcedure.query(() => {
    return EVALUATION_CRITERIA;
  }),

  /** Evaluate prompt quality without generating anything */
  evaluateQuality: publicProcedure
    .input(
      z.object({
        subject: z.string().min(1).max(500),
        style: z.string().min(1).max(128),
        environment: z.string().min(1).max(256),
        details: z.string().max(1000).optional().default(""),
      })
    )
    .mutation(({ input }) => {
      return evaluatePromptQuality({
        subject: sanitizeText(input.subject),
        style: sanitizeText(input.style),
        environment: sanitizeText(input.environment),
        details: sanitizeText(input.details || ""),
      });
    }),

  /** Create a new prompt and generate an image — SECURED */
  create: publicProcedure
    .input(
      z.object({
        subject: z.string().min(1, "El sujeto es obligatorio").max(500),
        style: z.string().min(1, "El estilo es obligatorio").max(128),
        environment: z.string().min(1, "El entorno es obligatorio").max(256),
        details: z.string().max(1000).optional().default(""),
      })
    )
    .mutation(async ({ input, ctx }) => {
      // Rate limit by IP or user
      const clientKey = `gen:${ctx.user?.id || ctx.req.ip || "anon"}`;
      checkRateLimit(clientKey, RATE_LIMIT_MAX_GENERATE);

      // Sanitize all inputs
      const cleanSubject = sanitizeText(input.subject);
      const cleanStyle = sanitizeText(input.style);
      const cleanEnvironment = sanitizeText(input.environment);
      const cleanDetails = sanitizeText(input.details || "");

      // Evaluate quality before generating
      const evaluation = evaluatePromptQuality({
        subject: cleanSubject,
        style: cleanStyle,
        environment: cleanEnvironment,
        details: cleanDetails,
      });

      // 1. Create the record in DB with pending status
      const creation = await createPromptCreation({
        userId: ctx.user?.id ?? null,
        subject: cleanSubject,
        style: cleanStyle,
        environment: cleanEnvironment,
        details: cleanDetails || null,
        status: "pending",
      });

      try {
        // 2. Enhance the prompt with AI
        await updatePromptCreation(creation.id, { status: "generating" });

        const { enhancedPrompt, breakdown } = await enhancePromptWithAI({
          subject: cleanSubject,
          style: cleanStyle,
          environment: cleanEnvironment,
          details: cleanDetails,
        });

        await updatePromptCreation(creation.id, { enhancedPrompt });

        // 3. Generate the image using the enhanced prompt
        const { url: imageUrl } = await generateImage({
          prompt: enhancedPrompt,
        });

        // 4. Update with the final result
        const updated = await updatePromptCreation(creation.id, {
          imageUrl: imageUrl || null,
          status: "completed",
        });

        return { ...updated, evaluation, breakdown };
      } catch (error: any) {
        // Mark as failed
        await updatePromptCreation(creation.id, {
          status: "failed",
          errorMessage: error?.message || "Error desconocido",
        });
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Error al generar la imagen: ${error?.message || "Error desconocido"}`,
        });
      }
    }),

  /** Professional text prompt enhancement — Anthropic 6 Techniques */
  enhanceTextPrompt: publicProcedure
    .input(
      z.object({
        role: z.string().min(1, "El rol es obligatorio").max(500),
        task: z.string().min(1, "La tarea es obligatoria").max(2000),
        format: z.string().min(1, "El formato es obligatorio").max(500),
        example: z.string().max(2000).optional().default(""),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const clientKey = `textprompt:${ctx.user?.id || ctx.req.ip || "anon"}`;
      checkRateLimit(clientKey, RATE_LIMIT_MAX_ENHANCE);

      const cleanRole = sanitizeText(input.role);
      const cleanTask = sanitizeText(input.task);
      const cleanFormat = sanitizeText(input.format);
      const cleanExample = sanitizeText(input.example || "");

      const result = await enhanceTextPromptWithAI({
        role: cleanRole,
        task: cleanTask,
        format: cleanFormat,
        example: cleanExample,
      });

      return result;
    }),

  /** Preview: enhance the prompt + evaluate quality — SECURED */
  enhancePrompt: publicProcedure
    .input(
      z.object({
        subject: z.string().min(1).max(500),
        style: z.string().min(1).max(128),
        environment: z.string().min(1).max(256),
        details: z.string().max(1000).optional().default(""),
      })
    )
    .mutation(async ({ input, ctx }) => {
      // Rate limit
      const clientKey = `enh:${ctx.user?.id || ctx.req.ip || "anon"}`;
      checkRateLimit(clientKey, RATE_LIMIT_MAX_ENHANCE);

      // Sanitize
      const cleanSubject = sanitizeText(input.subject);
      const cleanStyle = sanitizeText(input.style);
      const cleanEnvironment = sanitizeText(input.environment);
      const cleanDetails = sanitizeText(input.details || "");

      // Evaluate
      const evaluation = evaluatePromptQuality({
        subject: cleanSubject,
        style: cleanStyle,
        environment: cleanEnvironment,
        details: cleanDetails,
      });

      // Enhance
      const { enhancedPrompt, breakdown } = await enhancePromptWithAI({
        subject: cleanSubject,
        style: cleanStyle,
        environment: cleanEnvironment,
        details: cleanDetails,
      });

      return { enhancedPrompt, evaluation, breakdown };
    }),

  /** Get a single creation by ID */
  getById: publicProcedure
    .input(z.object({ id: z.number().int().positive() }))
    .query(async ({ input }) => {
      const creation = await getPromptCreationById(input.id);
      if (!creation) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Creación no encontrada" });
      }
      return creation;
    }),

  /** List all completed creations (gallery) */
  list: publicProcedure
    .input(
      z.object({
        limit: z.number().int().min(1).max(100).optional().default(50),
        offset: z.number().int().min(0).optional().default(0),
      })
    )
    .query(async ({ input }) => {
      return listPromptCreations(input.limit, input.offset);
    }),

  /** List creations for the current user */
  myCreations: protectedProcedure
    .input(
      z.object({
        limit: z.number().int().min(1).max(100).optional().default(50),
        offset: z.number().int().min(0).optional().default(0),
      })
    )
    .query(async ({ input, ctx }) => {
      return listUserPromptCreations(ctx.user.id, input.limit, input.offset);
    }),
});

// ─── Legal Acceptance Router ───
const legalRouter = router({
  /** Log a legal acceptance - public endpoint (no auth required, gate is pre-login) */
  logAcceptance: publicProcedure
    .input(
      z.object({
        termsVersion: z.string().max(16),
        browserLanguage: z.string().max(16).optional(),
        screenResolution: z.string().max(32).optional(),
        platform: z.string().max(64).optional(),
        timezone: z.string().max(64).optional(),
        fingerprint: z.string().max(128).optional(),
        selectedLanguage: z.string().max(5).optional(),
        referrer: z.string().max(2048).optional(),
        gamePlayerId: z.number().int().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      // Rate limit: max 5 legal acceptances per minute per IP
      const ip = getClientIP(ctx);
      checkRateLimit(`legal:${ip}`, 5);

      // Extract IP and User-Agent from request headers (server-side)
      const ipAddress =
        (ctx.req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() ||
        ctx.req.socket?.remoteAddress ||
        null;
      const userAgent = (ctx.req.headers["user-agent"] as string) || null;

      // Get userId if user is authenticated
      const userId = ctx.user?.id ?? null;

      const acceptance = await logLegalAcceptance({
        termsVersion: input.termsVersion,
        ipAddress,
        userAgent,
        browserLanguage: input.browserLanguage ?? null,
        screenResolution: input.screenResolution ?? null,
        platform: input.platform ?? null,
        timezone: input.timezone ?? null,
        fingerprint: input.fingerprint ?? null,
        selectedLanguage: input.selectedLanguage ?? null,
        referrer: input.referrer ?? null,
        gamePlayerId: input.gamePlayerId ?? null,
        userId,
      });

      return { success: true, id: acceptance.id };
    }),

  /** Get total acceptance count - admin only */
  getCount: protectedProcedure.query(async ({ ctx }) => {
    if (ctx.user.role !== "admin") {
      throw new TRPCError({ code: "FORBIDDEN", message: "Admin only" });
    }
    return getLegalAcceptanceCount();
  }),

  /** List recent acceptances - admin only */
  list: protectedProcedure
    .input(
      z.object({
        limit: z.number().int().min(1).max(500).optional().default(100),
        offset: z.number().int().min(0).optional().default(0),
      })
    )
    .query(async ({ input, ctx }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin only" });
      }
      return getLegalAcceptances(input.limit, input.offset);
    }),
});

// ─── Courses Router ───
const coursesRouter = router({
  create: publicProcedure
    .input(
      z.object({
        gamePlayerId: z.number().int(),
        title: z.string().min(1).max(256),
        description: z.string().optional(),
        category: z.string().default("ia"),
        difficulty: z.string().default("beginner"),
        targetAudience: z.string().optional(),
        estimatedHours: z.number().int().min(0).default(0),
        courseData: z.any(),
        status: z.enum(["draft", "published"]).optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      // Rate limit: max 10 course creations per minute per IP
      const ip = getClientIP(ctx);
      checkRateLimit(`course-create:${ip}`, 10);
      // Authenticate: only the player can create their own courses
      await authenticateGamePlayer(ctx, input.gamePlayerId);
      return createCustomCourse({
        gamePlayerId: input.gamePlayerId,
        title: sanitizeText(input.title),
        description: input.description ? sanitizeText(input.description) : undefined,
        category: input.category,
        difficulty: input.difficulty,
        targetAudience: input.targetAudience ? sanitizeText(input.targetAudience) : undefined,
        estimatedHours: input.estimatedHours,
        courseData: input.courseData,
        status: input.status,
      });
    }),

  update: publicProcedure
    .input(
      z.object({
        id: z.number().int(),
        gamePlayerId: z.number().int(),
        title: z.string().min(1).max(256).optional(),
        description: z.string().nullable().optional(),
        category: z.string().optional(),
        difficulty: z.string().optional(),
        targetAudience: z.string().nullable().optional(),
        estimatedHours: z.number().int().min(0).optional(),
        courseData: z.any().optional(),
        status: z.enum(["draft", "published"]).optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      // Rate limit: max 10 course updates per minute per IP
      const ip = getClientIP(ctx);
      checkRateLimit(`course-update:${ip}`, 10);
      // Authenticate: only the player can update their own courses
      await authenticateGamePlayer(ctx, input.gamePlayerId);
      const { id, gamePlayerId, ...data } = input;
      if (data.title) data.title = sanitizeText(data.title);
      if (data.description) data.description = sanitizeText(data.description);
      if (data.targetAudience) data.targetAudience = sanitizeText(data.targetAudience);
      return updateCustomCourse(id, gamePlayerId, data);
    }),

  delete: publicProcedure
    .input(z.object({ id: z.number().int(), gamePlayerId: z.number().int() }))
    .mutation(async ({ input, ctx }) => {
      // Rate limit: max 10 course deletes per minute per IP
      const ip = getClientIP(ctx);
      checkRateLimit(`course-delete:${ip}`, 10);
      // Authenticate: only the player can delete their own courses
      await authenticateGamePlayer(ctx, input.gamePlayerId);
      return deleteCustomCourse(input.id, input.gamePlayerId);
    }),

  list: publicProcedure
    .input(
      z.object({
        gamePlayerId: z.number().int(),
        limit: z.number().int().min(1).max(100).optional().default(50),
        offset: z.number().int().min(0).optional().default(0),
      })
    )
    .query(async ({ input, ctx }) => {
      // Authenticate: only the player can list their own courses
      await authenticateGamePlayer(ctx, input.gamePlayerId);
      return listUserCourses(input.gamePlayerId, input.limit, input.offset);
    }),

  getById: publicProcedure
    .input(z.object({ id: z.number().int() }))
    .query(async ({ input }) => {
      return getCustomCourseById(input.id);
    }),
});

// ─── Tool Views Router ───
const toolViewsRouter = router({
  log: publicProcedure
    .input(
      z.object({
        gamePlayerId: z.number().int(),
        toolId: z.string().min(1).max(64),
        toolName: z.string().min(1).max(128),
      })
    )
    .mutation(async ({ input, ctx }) => {
      // Rate limit: max 30 tool view logs per minute per IP
      const ip = getClientIP(ctx);
      checkRateLimit(`toolview:${ip}`, 30);
      // Authenticate: only the player can log their own tool views
      await authenticateGamePlayer(ctx, input.gamePlayerId);
      await logToolView(input);
      return { success: true };
    }),
});

// ─── Dashboard Router ───
const dashboardRouter = router({
  stats: publicProcedure
    .input(z.object({ gamePlayerId: z.number().int() }))
    .query(async ({ input, ctx }) => {
      // Authenticate: only the player can view their own dashboard
      await authenticateGamePlayer(ctx, input.gamePlayerId);
      return getUserDashboardStats(input.gamePlayerId);
    }),
});

// ─── Prompt Game Router (Juego de Promptear) ───
const promptGameRouter = router({
  /** Evaluate a prompt in the game context using LLM */
  evaluate: publicProcedure
    .input(
      z.object({
        prompt: z.string().min(5, "El prompt debe tener al menos 5 caracteres").max(2000),
        category: z.enum(["creative", "technical", "business", "ethical", "speed", "battle"]),
        challenge: z.string().max(500).optional(),
        language: z.enum(["es", "en", "zh"]).default("es"),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const ip = getClientIP(ctx);
      checkRateLimit(`promptGame:${ip}`, 10); // 10 evaluations per minute

      const cleanPrompt = sanitizeText(input.prompt);
      const langLabel = input.language === "es" ? "español" : input.language === "en" ? "English" : "中文";

      const result = await invokeLLM({
        messages: [
          {
            role: "system",
            content: `You are the LINCE Prompt Evaluator — a fun, encouraging AI judge for a gamified prompt-writing competition.

Evaluate the user's prompt across 6 dimensions (each 0-20 points, total max 100 + up to 20 bonus):
1. **Creativity** (0-20): Originality, unexpected angles, imagination
2. **Precision** (0-20): Clarity, specificity, no ambiguity
3. **Technique** (0-20): Proper AI prompt engineering (context, role, format, examples)
4. **Impact** (0-20): Would this prompt produce amazing results?
5. **Ethics** (0-20): Responsible, inclusive, positive impact
6. **Bonus** (0-20): Extra points for exceptional quality, humor, or brilliance

Category context: ${input.category}
${input.challenge ? `Challenge: ${input.challenge}` : ""}

Respond in ${langLabel}. Be encouraging but honest. Use gaming language ("¡Combo!", "Critical hit!", "Level up!").

JSON output:
- scores: { creativity, precision, technique, impact, ethics, bonus } (each 0-20)
- totalScore: sum of all scores (0-120)
- grade: S/A/B/C/D/F (S=100+, A=80-99, B=60-79, C=40-59, D=20-39, F=0-19)
- feedback: 2-3 sentences of fun, encouraging feedback
- tips: array of 2 specific improvement tips
- xpEarned: totalScore * 2
- coinsEarned: Math.floor(totalScore / 10) * 5
- title: A fun title for this prompt (e.g., "El Prompt Legendario", "Prompt de Bronce")
- streak_bonus: true if score > 70`,
          },
          {
            role: "user",
            content: cleanPrompt,
          },
        ],
        response_format: {
          type: "json_schema",
          json_schema: {
            name: "prompt_game_evaluation",
            strict: true,
            schema: {
              type: "object",
              properties: {
                scores: {
                  type: "object",
                  properties: {
                    creativity: { type: "integer" },
                    precision: { type: "integer" },
                    technique: { type: "integer" },
                    impact: { type: "integer" },
                    ethics: { type: "integer" },
                    bonus: { type: "integer" },
                  },
                  required: ["creativity", "precision", "technique", "impact", "ethics", "bonus"],
                  additionalProperties: false,
                },
                totalScore: { type: "integer" },
                grade: { type: "string" },
                feedback: { type: "string" },
                tips: { type: "array", items: { type: "string" } },
                xpEarned: { type: "integer" },
                coinsEarned: { type: "integer" },
                title: { type: "string" },
                streak_bonus: { type: "boolean" },
              },
              required: ["scores", "totalScore", "grade", "feedback", "tips", "xpEarned", "coinsEarned", "title", "streak_bonus"],
              additionalProperties: false,
            },
          },
        },
      });

      const content = result.choices[0]?.message?.content;
      let textContent = "";
      if (typeof content === "string") {
        textContent = content;
      } else if (Array.isArray(content)) {
        textContent = content
          .filter((c) => c.type === "text")
          .map((c) => (c as { type: "text"; text: string }).text)
          .join(" ");
      }

      try {
        return JSON.parse(textContent);
      } catch {
        return {
          scores: { creativity: 10, precision: 10, technique: 10, impact: 10, ethics: 10, bonus: 0 },
          totalScore: 50,
          grade: "C",
          feedback: "¡Buen intento! Sigue practicando para mejorar tu puntuación.",
          tips: ["Sé más específico en tu prompt", "Añade contexto y formato de salida"],
          xpEarned: 100,
          coinsEarned: 25,
          title: "Prompt Aprendiz",
          streak_bonus: false,
        };
      }
    }),

  /** Get random challenge for a category */
  getChallenge: publicProcedure
    .input(
      z.object({
        category: z.enum(["creative", "technical", "business", "ethical", "speed", "battle"]),
        language: z.enum(["es", "en", "zh"]).default("es"),
      })
    )
    .query(({ input }) => {
      const challenges: Record<string, Record<string, string[]>> = {
        es: {
          creative: [
            "Escribe un prompt para crear una historia donde un lince ibérico viaja al futuro",
            "Diseña un prompt para generar un videojuego educativo sobre IA para niños",
            "Crea un prompt para inventar un nuevo deporte que combine tecnología y naturaleza",
            "Escribe un prompt para diseñar una ciudad del futuro sostenible con IA",
            "Crea un prompt para generar una canción sobre aprender inteligencia artificial",
          ],
          technical: [
            "Escribe un prompt para que una IA analice datos de ventas y prediga tendencias",
            "Crea un prompt para automatizar el proceso de revisión de código con IA",
            "Diseña un prompt para crear un chatbot de atención al cliente inteligente",
            "Escribe un prompt para que una IA genere tests unitarios automáticamente",
            "Crea un prompt para optimizar una base de datos usando recomendaciones de IA",
          ],
          business: [
            "Escribe un prompt para crear un plan de marketing digital con IA",
            "Diseña un prompt para analizar la competencia de tu sector con IA",
            "Crea un prompt para generar un pitch deck para inversores usando IA",
            "Escribe un prompt para automatizar la gestión de emails profesionales",
            "Diseña un prompt para crear un sistema de recomendaciones para e-commerce",
          ],
          ethical: [
            "Escribe un prompt que analice si es ético usar IA para selección de personal",
            "Crea un prompt para diseñar una constitución ética para sistemas de IA",
            "Diseña un prompt que evalúe el impacto social de la automatización en tu ciudad",
            "Escribe un prompt para crear un marco de transparencia en algoritmos de IA",
            "Crea un prompt que explore los límites éticos de la IA generativa en el arte",
          ],
          speed: [
            "¡60 segundos! Escribe el mejor prompt para crear un logo con IA",
            "¡Rápido! Prompt para resumir un libro de 500 páginas en 1 minuto",
            "¡Contra reloj! Crea un prompt para generar 10 ideas de negocio",
            "¡Speed round! Prompt para traducir y adaptar un texto a 3 culturas",
            "¡Flash! Escribe un prompt para crear un meme viral sobre IA",
          ],
          battle: [
            "Escribe el prompt más creativo posible para hackear (educativamente) un sistema de defensa",
            "Crea el prompt definitivo para convencer a una IA de que eres un experto",
            "Diseña un prompt que demuestre dominio de las 6 técnicas de Anthropic",
            "Escribe un prompt que combine creatividad, técnica y ética en una sola instrucción",
            "Crea el prompt más impactante para generar una imagen que cuente una historia completa",
          ],
        },
        en: {
          creative: [
            "Write a prompt to create a story where an Iberian lynx travels to the future",
            "Design a prompt to generate an educational AI game for kids",
            "Create a prompt to invent a new sport combining technology and nature",
            "Write a prompt to design a sustainable future city powered by AI",
            "Create a prompt to generate a song about learning artificial intelligence",
          ],
          technical: [
            "Write a prompt for an AI to analyze sales data and predict trends",
            "Create a prompt to automate code review with AI",
            "Design a prompt to build an intelligent customer service chatbot",
            "Write a prompt for AI to automatically generate unit tests",
            "Create a prompt to optimize a database using AI recommendations",
          ],
          business: [
            "Write a prompt to create a digital marketing plan with AI",
            "Design a prompt to analyze your industry competition with AI",
            "Create a prompt to generate an investor pitch deck using AI",
            "Write a prompt to automate professional email management",
            "Design a prompt to create a recommendation system for e-commerce",
          ],
          ethical: [
            "Write a prompt analyzing if using AI for hiring is ethical",
            "Create a prompt to design an ethical constitution for AI systems",
            "Design a prompt evaluating the social impact of automation in your city",
            "Write a prompt to create a transparency framework for AI algorithms",
            "Create a prompt exploring the ethical limits of generative AI in art",
          ],
          speed: [
            "60 seconds! Write the best prompt to create a logo with AI",
            "Quick! Prompt to summarize a 500-page book in 1 minute",
            "Against the clock! Create a prompt to generate 10 business ideas",
            "Speed round! Prompt to translate and adapt text to 3 cultures",
            "Flash! Write a prompt to create a viral AI meme",
          ],
          battle: [
            "Write the most creative prompt to educationally hack a defense system",
            "Create the ultimate prompt to convince an AI you're an expert",
            "Design a prompt demonstrating mastery of Anthropic's 6 techniques",
            "Write a prompt combining creativity, technique, and ethics in one instruction",
            "Create the most impactful prompt to generate an image telling a complete story",
          ],
        },
        zh: {
          creative: [
            "写一个提示词，创作一个伊比利亚猞猁穿越到未来的故事",
            "设计一个提示词，为儿童生成一个关于AI的教育游戏",
            "创建一个提示词，发明一项结合科技与自然的新运动",
            "写一个提示词，设计一个由AI驱动的可持续未来城市",
            "创建一个提示词，生成一首关于学习人工智能的歌曲",
          ],
          technical: [
            "写一个提示词，让AI分析销售数据并预测趋势",
            "创建一个提示词，用AI自动化代码审查流程",
            "设计一个提示词，构建智能客服聊天机器人",
            "写一个提示词，让AI自动生成单元测试",
            "创建一个提示词，使用AI建议优化数据库",
          ],
          business: [
            "写一个提示词，用AI创建数字营销计划",
            "设计一个提示词，用AI分析行业竞争",
            "创建一个提示词，用AI生成投资者演示文稿",
            "写一个提示词，自动化专业邮件管理",
            "设计一个提示词，为电商创建推荐系统",
          ],
          ethical: [
            "写一个提示词，分析用AI进行招聘是否道德",
            "创建一个提示词，为AI系统设计道德宪法",
            "设计一个提示词，评估自动化对城市的社会影响",
            "写一个提示词，为AI算法创建透明度框架",
            "创建一个提示词，探索生成式AI在艺术中的道德边界",
          ],
          speed: [
            "60秒！写出最好的AI创建logo提示词",
            "快！用提示词在1分钟内总结一本500页的书",
            "倒计时！创建一个生成10个商业创意的提示词",
            "极速回合！写一个将文本翻译并适应3种文化的提示词",
            "闪电！写一个创建AI病毒式传播表情包的提示词",
          ],
          battle: [
            "写出最有创意的提示词来教育性地入侵防御系统",
            "创建终极提示词，说服AI你是专家",
            "设计一个展示Anthropic 6种技术掌握的提示词",
            "写一个在一条指令中结合创意、技术和道德的提示词",
            "创建最具影响力的提示词，生成一张讲述完整故事的图片",
          ],
        },
      };

      const lang = input.language;
      const cat = input.category;
      const pool = challenges[lang]?.[cat] || challenges.es[cat] || challenges.es.creative;
      const randomChallenge = pool[Math.floor(Math.random() * pool.length)];
      return { challenge: randomChallenge, category: cat };
    }),
  /** Guided step-by-step prompt evaluation with detailed feedback on each component */
  evaluateGuided: publicProcedure
    .input(
      z.object({
        context: z.string().max(500).default(""),
        role: z.string().max(500).default(""),
        task: z.string().min(5).max(1000),
        format: z.string().max(500).default(""),
        examples: z.string().max(1000).default(""),
        constraints: z.string().max(500).default(""),
        level: z.number().min(1).max(5).default(1),
        language: z.enum(["es", "en", "zh"]).default("es"),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const ip = getClientIP(ctx);
      checkRateLimit(`promptGameGuided:${ip}`, 10);
      const langLabel = input.language === "es" ? "español" : input.language === "en" ? "English" : "中文";
      const fullPrompt = [
        input.context && `Contexto: ${input.context}`,
        input.role && `Rol: ${input.role}`,
        `Tarea: ${input.task}`,
        input.format && `Formato: ${input.format}`,
        input.examples && `Ejemplos: ${input.examples}`,
        input.constraints && `Restricciones: ${input.constraints}`,
      ].filter(Boolean).join("\n");
      const result = await invokeLLM({
        messages: [
          {
            role: "system",
            content: `You are LINCE MENTOR, the LINCE prompt-writing coach. You evaluate prompts component by component, teaching users how to write better prompts.

The user is at Level ${input.level}/5. Adjust difficulty and expectations accordingly:
- Level 1 (Novato): Basic prompts, be very encouraging, focus on having a clear task
- Level 2 (Aprendiz): Expect context + task, teach about specificity
- Level 3 (Intermedio): Expect role + context + task + format, teach about structure
- Level 4 (Avanzado): Expect all components, teach about examples and edge cases
- Level 5 (Maestro): Expert level, expect near-perfect prompts with all techniques

Evaluate each component separately with specific, actionable feedback.

Respond in ${langLabel}. Be encouraging but specific about improvements.
Use gaming language and LINCE personality (fun, educational, motivating).

JSON output:
- overallScore: 0-100
- grade: S/A/B/C/D/F
- title: Fun achievement title
- components: object with keys (context, role, task, format, examples, constraints) each having:
  - score: 0-20
  - status: "excellent" | "good" | "needs_work" | "missing" | "not_required"
  - feedback: 1-2 sentences of specific feedback
  - suggestion: A concrete example of how to improve (or "" if excellent)
  - errorType: "" | "too_vague" | "too_short" | "missing_detail" | "wrong_approach" | "good"
- generalFeedback: 2-3 sentences of overall encouraging feedback
- nextLevelTip: What they need to do to reach the next level
- promptRewrite: A rewritten, improved version of their prompt showing best practices
- techniquesUsed: array of technique names they used correctly
- techniquesMissing: array of technique names they should add
- xpEarned: overallScore * 3
- coinsEarned: Math.floor(overallScore / 10) * 5
- streak_bonus: true if score > 70`,
          },
          { role: "user", content: fullPrompt },
        ],
        response_format: {
          type: "json_schema",
          json_schema: {
            name: "guided_prompt_evaluation",
            strict: true,
            schema: {
              type: "object",
              properties: {
                overallScore: { type: "integer" },
                grade: { type: "string" },
                title: { type: "string" },
                components: {
                  type: "object",
                  properties: {
                    context: { type: "object", properties: { score: { type: "integer" }, status: { type: "string" }, feedback: { type: "string" }, suggestion: { type: "string" }, errorType: { type: "string" } }, required: ["score", "status", "feedback", "suggestion", "errorType"], additionalProperties: false },
                    role: { type: "object", properties: { score: { type: "integer" }, status: { type: "string" }, feedback: { type: "string" }, suggestion: { type: "string" }, errorType: { type: "string" } }, required: ["score", "status", "feedback", "suggestion", "errorType"], additionalProperties: false },
                    task: { type: "object", properties: { score: { type: "integer" }, status: { type: "string" }, feedback: { type: "string" }, suggestion: { type: "string" }, errorType: { type: "string" } }, required: ["score", "status", "feedback", "suggestion", "errorType"], additionalProperties: false },
                    format: { type: "object", properties: { score: { type: "integer" }, status: { type: "string" }, feedback: { type: "string" }, suggestion: { type: "string" }, errorType: { type: "string" } }, required: ["score", "status", "feedback", "suggestion", "errorType"], additionalProperties: false },
                    examples: { type: "object", properties: { score: { type: "integer" }, status: { type: "string" }, feedback: { type: "string" }, suggestion: { type: "string" }, errorType: { type: "string" } }, required: ["score", "status", "feedback", "suggestion", "errorType"], additionalProperties: false },
                    constraints: { type: "object", properties: { score: { type: "integer" }, status: { type: "string" }, feedback: { type: "string" }, suggestion: { type: "string" }, errorType: { type: "string" } }, required: ["score", "status", "feedback", "suggestion", "errorType"], additionalProperties: false },
                  },
                  required: ["context", "role", "task", "format", "examples", "constraints"],
                  additionalProperties: false,
                },
                generalFeedback: { type: "string" },
                nextLevelTip: { type: "string" },
                promptRewrite: { type: "string" },
                techniquesUsed: { type: "array", items: { type: "string" } },
                techniquesMissing: { type: "array", items: { type: "string" } },
                xpEarned: { type: "integer" },
                coinsEarned: { type: "integer" },
                streak_bonus: { type: "boolean" },
              },
              required: ["overallScore", "grade", "title", "components", "generalFeedback", "nextLevelTip", "promptRewrite", "techniquesUsed", "techniquesMissing", "xpEarned", "coinsEarned", "streak_bonus"],
              additionalProperties: false,
            },
          },
        },
      });
      const content = result.choices[0]?.message?.content;
      let textContent = "";
      if (typeof content === "string") { textContent = content; }
      else if (Array.isArray(content)) { textContent = content.filter((c: any) => c.type === "text").map((c: any) => c.text).join(" "); }
      try { return JSON.parse(textContent); }
      catch {
        return {
          overallScore: 50, grade: "C", title: "Prompt Aprendiz",
          components: {
            context: { score: 8, status: "needs_work", feedback: "Intenta añadir más contexto.", suggestion: "Ej: 'Soy un profesor de secundaria que necesita...'", errorType: "too_vague" },
            role: { score: 8, status: "needs_work", feedback: "Define un rol claro.", suggestion: "Ej: 'Actúa como un experto en marketing digital'", errorType: "missing_detail" },
            task: { score: 12, status: "good", feedback: "La tarea está clara pero podría ser más específica.", suggestion: "", errorType: "good" },
            format: { score: 8, status: "needs_work", feedback: "Especifica el formato de salida.", suggestion: "Ej: 'Responde en formato de lista con 5 puntos'", errorType: "missing_detail" },
            examples: { score: 5, status: "missing", feedback: "Añadir ejemplos mejora mucho el resultado.", suggestion: "Ej: 'Por ejemplo: [tu ejemplo aquí]'", errorType: "missing_detail" },
            constraints: { score: 5, status: "missing", feedback: "Las restricciones ayudan a acotar la respuesta.", suggestion: "Ej: 'Máximo 200 palabras, tono profesional'", errorType: "missing_detail" },
          },
          generalFeedback: "Buen intento. Sigue practicando para mejorar.",
          nextLevelTip: "Intenta incluir todos los componentes del prompt.",
          promptRewrite: "[Versión mejorada no disponible]",
          techniquesUsed: [], techniquesMissing: ["Contexto", "Rol", "Formato"],
          xpEarned: 150, coinsEarned: 25, streak_bonus: false,
        };
      }
    }),
});

// ─── LINCELIN Generator Router ───
const LINCELIN_PROMPT = `Transform this person's photo into an anthropomorphic Iberian lynx (lince ibérico) character in the LINCE art style. CRITICAL RULES:
1. EXTRACT the person's unique facial traits from the photo: their hairstyle, hair color, skin tone undertone, facial expression, any accessories (glasses, earrings, piercings, hats), tattoos, and clothing style
2. CREATE an Iberian lynx with: spotted golden-brown fur, tufted ears with black tips, prominent sideburns, amber eyes, short bobbed tail
3. TRANSFER the person's traits onto the lynx: same hairstyle on top of lynx head, same accessories, same clothing, same expression, same skin tone mapped to fur warmth
4. Art style: vibrant cartoon/anime cel-shaded illustration, bold outlines, neon cyan and orange accent glow, dark cyberpunk background with circuit patterns
5. The result must be a UNIQUE lince ibérico that anyone who knows the person would recognize as them
6. Upper body portrait, arms visible, confident pose
7. Include subtle "LINCE" watermark text in corner`;

const lincelinRouter = router({
  /** Upload a photo and get a URL back for LINCELIN generation */
  uploadPhoto: publicProcedure
    .input(
      z.object({
        photoBase64: z.string().min(100, "Foto inválida"),
        mimeType: z.enum(["image/png", "image/jpeg", "image/webp"]).default("image/png"),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const ip = getClientIP(ctx);
      checkRateLimit(`lincelin-upload:${ip}`, 5); // 5 uploads per minute

      // Strip data URL prefix if present
      const base64Data = input.photoBase64.replace(/^data:image\/\w+;base64,/, "");
      const buffer = Buffer.from(base64Data, "base64");

      // Validate size (max 10MB)
      if (buffer.length > 10 * 1024 * 1024) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "La foto es demasiado grande (máx 10MB)" });
      }

      const ext = input.mimeType === "image/jpeg" ? "jpg" : input.mimeType === "image/webp" ? "webp" : "png";
      const key = `lincelin-photos/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      const { url } = await storagePut(key, buffer, input.mimeType);

      return { success: true, photoUrl: url };
    }),

  /** Generate a LINCELIN avatar from a user's uploaded photo URL */
  generate: publicProcedure
    .input(
      z.object({
        photoUrl: z.string().min(10, "URL de foto inválida"),
        style: z.enum(["urban", "classic", "neon", "retro", "minimal"]).default("urban"),
        accessories: z.string().max(200).optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const ip = getClientIP(ctx);
      checkRateLimit(`lincelin:${ip}`, 3); // 3 generations per minute max

      const styleModifiers: Record<string, string> = {
        urban: "Street fashion, gold chains, sneakers, graffiti-style background with neon cyan and orange glow",
        classic: "Elegant attire, warm golden lighting, classic portrait composition with subtle circuit patterns",
        neon: "Futuristic neon outfit, intense cyan/magenta/purple glow, holographic effects, cyberpunk city background",
        retro: "80s/90s retro fashion, synthwave colors, VHS aesthetic, pixel art elements in background",
        minimal: "Clean simple outfit, soft pastel accents, minimal background with gentle gradient",
      };

      const fullPrompt = `${LINCELIN_PROMPT}\n\nStyle variation: ${styleModifiers[input.style] || styleModifiers.urban}${input.accessories ? `\nAdditional details: ${sanitizeText(input.accessories)}` : ""}`;

      try {
        const { url: imageUrl } = await generateImage({
          prompt: fullPrompt,
          originalImages: [{
            url: input.photoUrl,
            mimeType: "image/png",
          }],
        });

        return {
          success: true,
          imageUrl: imageUrl || "",
          style: input.style,
        };
      } catch (error: any) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Error generando tu LINCELIN: ${error.message || "Inténtalo de nuevo"}`,
        });
      }
    }),
});

// ─── Avatar Chat Router (LLM-powered conversations) ───
const BANNED_WORDS_CHAT = [
  "idiota", "estupido", "estúpido", "imbecil", "imbécil", "tonto", "pendejo",
  "mierda", "puta", "puto", "cabrón", "cabron", "hijo de", "hdp", "ctm",
  "weon", "weón", "huevón", "huevon", "conchetumare", "concha", "culiao",
  "maricón", "maricon", "fuck", "shit", "asshole", "bitch", "damn", "idiot",
  "stupid", "dumb", "retard", "bastard", "dick", "crap",
  "蠢", "笨蛋", "白痴", "混蛋", "傻逼", "操",
];

function chatContainsInsult(text: string): boolean {
  const lower = text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  return BANNED_WORDS_CHAT.some((w) => lower.includes(w.normalize("NFD").replace(/[\u0300-\u036f]/g, "")));
}

const avatarChatRouter = router({
  /** Get list of all available avatars with their basic info */
  listAvatars: publicProcedure.query(() => {
    return AVATAR_PROMPTS.map((a) => ({
      key: a.key,
      displayName: a.displayName,
      group: a.group,
      specialty: a.specialty,
      responseStyle: a.responseStyle,
      welcomeMessage: a.welcomeMessage,
    }));
  }),

  /** Send a message to an avatar and get an LLM-powered response */
  sendMessage: publicProcedure
    .input(
      z.object({
        avatarKey: z.string().min(1).max(50),
        message: z.string().min(1).max(2000),
        history: z.array(
          z.object({
            role: z.enum(["user", "assistant"]),
            content: z.string(),
          })
        ).max(20).default([]),
        language: z.enum(["es", "en", "zh"]).default("es"),
        /** Optional: if provided, messages are persisted to DB */
        gamePlayerId: z.number().int().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      // Rate limit
      const ip = getClientIP(ctx);
      checkRateLimit(`avatar-chat:${ip}`, RATE_LIMIT_MAX_AVATAR_CHAT);

      // Get avatar prompt config
      const avatarConfig = getAvatarPrompt(input.avatarKey);
      if (!avatarConfig) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Avatar "${sanitizeText(input.avatarKey)}" no encontrado.`,
        });
      }

      // Check for insults
      if (chatContainsInsult(input.message)) {
        return {
          response: avatarConfig.insultResponse,
          avatarKey: input.avatarKey,
          isInsultResponse: true,
          referral: null,
        };
      }

      // Sanitize user message
      const sanitizedMessage = sanitizeText(input.message);

      // Build the full system prompt
      const systemPrompt = buildFullPrompt(avatarConfig);

      // Build conversation history for LLM
      const messages: Array<{ role: "system" | "user" | "assistant"; content: string }> = [
        { role: "system", content: systemPrompt },
      ];

      // Add conversation history (last 20 messages max)
      for (const msg of input.history.slice(-20)) {
        messages.push({
          role: msg.role,
          content: msg.role === "user" ? sanitizeText(msg.content) : msg.content,
        });
      }

      // Add current message
      messages.push({ role: "user", content: sanitizedMessage });

      try {
        const result = await invokeLLM({
          messages,
          maxTokens: 1024,
        });

        const responseText = typeof result.choices[0]?.message?.content === "string"
          ? result.choices[0].message.content
          : Array.isArray(result.choices[0]?.message?.content)
            ? result.choices[0].message.content
                .filter((c: any) => c.type === "text")
                .map((c: any) => c.text)
                .join("")
            : "Lo siento, no pude generar una respuesta. ¡Inténtalo de nuevo!";

        // Check if the avatar suggested a referral
        let referral: { key: string; displayName: string; specialty: string } | null = null;
        if (avatarConfig.referralKeys.length > 0) {
          for (const refKey of avatarConfig.referralKeys) {
            const refAvatar = getAvatarPrompt(refKey);
            if (refAvatar && responseText.toLowerCase().includes(refAvatar.displayName.toLowerCase())) {
              referral = {
                key: refAvatar.key,
                displayName: refAvatar.displayName,
                specialty: refAvatar.specialty,
              };
              break;
            }
          }
        }

        // Persist to DB if gamePlayerId is provided
        let relationshipLevel = "new";
        if (input.gamePlayerId) {
          try {
            const session = await getOrCreateChatSession(input.gamePlayerId, input.avatarKey);
            if (session) {
              await saveChatMessage(session.id, "user", sanitizedMessage);
              await saveChatMessage(session.id, "assistant", responseText);
              relationshipLevel = await updateRelationshipLevel(session.id);
            }
          } catch (e) {
            console.error("[AvatarChat] Failed to persist messages:", e);
          }
        }

        return {
          response: responseText,
          avatarKey: input.avatarKey,
          isInsultResponse: false,
          referral,
          relationshipLevel,
        };
      } catch (error: any) {
        console.error(`[AvatarChat] LLM error for ${input.avatarKey}:`, error.message);
        // Fallback: return a personality-consistent error message
        const fallbackMessages: Record<string, string> = {
          es: `¡Ups! Mi cerebro de lince tuvo un cortocircuito. ${avatarConfig.motivationalPhrases[0] || "¡Sigue aprendiendo!"} Inténtalo de nuevo en unos segundos.`,
          en: `Oops! My lynx brain had a short circuit. ${avatarConfig.motivationalPhrases[0] || "Keep learning!"} Try again in a few seconds.`,
          zh: `哎呀！我的山猫大脑短路了。${avatarConfig.motivationalPhrases[0] || "继续学习！"} 请几秒后再试。`,
        };
        return {
          response: fallbackMessages[input.language] || fallbackMessages.es,
          avatarKey: input.avatarKey,
          isInsultResponse: false,
          referral: null,
        };
      }
    }),

  /** Get a specific avatar's welcome message and info */
  getAvatarInfo: publicProcedure
    .input(z.object({ avatarKey: z.string().min(1).max(50) }))
    .query(({ input }) => {
      const config = getAvatarPrompt(input.avatarKey);
      if (!config) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Avatar "${sanitizeText(input.avatarKey)}" no encontrado.`,
        });
      }
      return {
        key: config.key,
        displayName: config.displayName,
        group: config.group,
        specialty: config.specialty,
        responseStyle: config.responseStyle,
        personality: config.personality,
        welcomeMessage: config.welcomeMessage,
        referralKeys: config.referralKeys,
        motivationalPhrases: config.motivationalPhrases,
      };
    }),

  /** Get chat history for a player+avatar pair */
  getHistory: publicProcedure
    .input(z.object({
      gamePlayerId: z.number().int(),
      avatarKey: z.string().min(1).max(50),
      limit: z.number().int().min(1).max(50).default(20),
    }))
    .query(async ({ input, ctx }) => {
      await authenticateGamePlayer(ctx, input.gamePlayerId);
      const session = await getOrCreateChatSession(input.gamePlayerId, input.avatarKey);
      if (!session) return { messages: [], relationshipLevel: "new" as const, messageCount: 0 };
      const messages = await getChatHistory(session.id, input.limit);
      return {
        messages: messages.map(m => ({ role: m.role, content: m.content, createdAt: m.createdAt })),
        relationshipLevel: session.relationshipLevel,
        messageCount: session.messageCount,
      };
    }),

  /** List all chat sessions for a player */
  listSessions: publicProcedure
    .input(z.object({ gamePlayerId: z.number().int() }))
    .query(async ({ input, ctx }) => {
      await authenticateGamePlayer(ctx, input.gamePlayerId);
      const sessions = await listPlayerChatSessions(input.gamePlayerId);
      return sessions.map(s => ({
        id: s.id,
        avatarKey: s.avatarKey,
        messageCount: s.messageCount,
        relationshipLevel: s.relationshipLevel,
        lastMessagePreview: s.lastMessagePreview,
        updatedAt: s.updatedAt,
      }));
    }),

  /** Delete a chat session */
  deleteSession: publicProcedure
    .input(z.object({
      sessionId: z.number().int(),
      gamePlayerId: z.number().int(),
    }))
    .mutation(async ({ input, ctx }) => {
      await authenticateGamePlayer(ctx, input.gamePlayerId);
      const deleted = await deleteChatSession(input.sessionId, input.gamePlayerId);
      if (!deleted) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Sesión de chat no encontrada." });
      }
      return { success: true };
    }),

  /** Generate an image from a text prompt within chat, with LINCELIN watermark */
  generateChatImage: publicProcedure
    .input(z.object({
      prompt: z.string().min(3).max(500),
      avatarKey: z.string().min(1).max(50),
    }))
    .mutation(async ({ input, ctx }) => {
      // Rate limit image generation
      const ip = getClientIP(ctx);
      checkRateLimit(`chat-image:${ip}`, 5); // max 5 image generations per window

      const cleanPrompt = sanitizeText(input.prompt);

      try {
        // Generate the image
        const { url: imageUrl } = await generateImage({
          prompt: `${cleanPrompt}. Style: digital art, high quality, vibrant colors. Small watermark text "LINCELIN" in bottom-right corner.`,
        });

        if (!imageUrl) {
          throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "No se pudo generar la imagen." });
        }

        return {
          imageUrl,
          prompt: cleanPrompt,
          avatarKey: input.avatarKey,
        };
      } catch (error: any) {
        console.error(`[ChatImage] Generation error:`, error.message);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Error al generar la imagen. Inténtalo de nuevo.",
        });
      }
    }),
});

// ─── Push Notifications Router ───
const pushNotificationsRouter = router({
  /** Subscribe a browser to push notifications */
  subscribe: publicProcedure
    .input(
      z.object({
        playerId: z.number(),
        subscription: z.object({
          endpoint: z.string(),
          keys: z.object({
            p256dh: z.string(),
            auth: z.string(),
          }),
        }),
        userAgent: z.string().optional(),
        preferences: z.object({
          streakReminder: z.boolean(),
          missionAlerts: z.boolean(),
          dailyRewardReminder: z.boolean(),
          quietHoursStart: z.number().min(0).max(23),
          quietHoursEnd: z.number().min(0).max(23),
        }).optional(),
      })
    )
    .mutation(async ({ input }) => {
      const result = await savePushSubscription(
        input.playerId,
        input.subscription,
        input.userAgent,
        input.preferences
      );
      return { success: true, subscriptionId: result.id };
    }),

  /** Unsubscribe a browser from push notifications */
  unsubscribe: publicProcedure
    .input(
      z.object({
        playerId: z.number(),
        endpoint: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      await removePushSubscription(input.playerId, input.endpoint);
      return { success: true };
    }),

  /** Update notification preferences */
  updatePreferences: publicProcedure
    .input(
      z.object({
        playerId: z.number(),
        endpoint: z.string(),
        preferences: z.object({
          streakReminder: z.boolean(),
          missionAlerts: z.boolean(),
          dailyRewardReminder: z.boolean(),
          quietHoursStart: z.number().min(0).max(23),
          quietHoursEnd: z.number().min(0).max(23),
        }),
      })
    )
    .mutation(async ({ input }) => {
      await updateSubscriptionPreferences(input.playerId, input.endpoint, input.preferences);
      return { success: true };
    }),

  /** Send a test push notification to a specific player */
  sendTest: publicProcedure
    .input(
      z.object({
        playerId: z.number(),
      })
    )
    .mutation(async ({ input }) => {
      const result = await sendPushToPlayer(input.playerId, {
        title: "LINCE - Test",
        body: "Si ves esto, las notificaciones push funcionan correctamente.",
        url: "/jugar",
        tag: "test-push",
      });
      return result;
    }),

  /** Get VAPID public key for client subscription */
  getVapidKey: publicProcedure.query(() => {
    return { vapidPublicKey: process.env.VITE_VAPID_PUBLIC_KEY || "" };
  }),

  /** Admin: trigger streak reminders manually */
  triggerStreakReminders: publicProcedure.mutation(async ({ ctx }) => {
    const result = await sendStreakReminders();
    return result;
  }),

  /** Admin: trigger daily reward reminders manually */
  triggerRewardReminders: publicProcedure.mutation(async () => {
    const result = await sendDailyRewardReminders();
    return result;
  }),

  /** Admin: cleanup expired subscriptions */
  cleanup: publicProcedure.mutation(async () => {
    const count = await cleanupExpiredSubscriptions();
    return { cleaned: count };
  }),

  /** Admin: send broadcast notification to all users */
  broadcast: publicProcedure
    .input(
      z.object({
        title: z.string().min(1).max(100),
        body: z.string().min(1).max(500),
        url: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const result = await sendPushBroadcast({
        title: input.title,
        body: input.body,
        url: input.url || "/",
        tag: "broadcast",
      });
      return result;
    }),
});

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),
  gamePlayer: gamePlayerRouter,
  promptStudio: promptStudioRouter,
  promptGame: promptGameRouter,
  legal: legalRouter,
  courses: coursesRouter,
  toolViews: toolViewsRouter,
  dashboard: dashboardRouter,
  lincelin: lincelinRouter,
  avatarChat: avatarChatRouter,
  pushNotifications: pushNotificationsRouter,
});

export type AppRouter = typeof appRouter;

/**
 * CANONICAL AVATAR IMAGES — Single source of truth for ALL pages
 * Import this file in Home.tsx, AcademiaLince.tsx, MundoLince.tsx, LinceRaids.tsx
 * NEVER define avatar URLs locally in page files.
 */

// Frontal portrait images — PRIMARY image for each character everywhere
export const AVATAR_FRONTAL: Record<string, string> = {
  YAYALIN: "/avatars/YAYALIN_frontal.png",
  YAYALINA: "/avatars/YAYALINA_frontal.png",
  PAPALIN: "/avatars/PAPALIN_frontal.png",
  MAMALINA: "/avatars/MAMALINA_frontal.png",
  CHAVALIN: "/avatars/CHAVALIN_frontal.png",
  CHAVALINA: "/avatars/CHAVALINA_frontal.png",
  PEQUELIN: "/avatars/PEQUELIN_frontal.png",
  PEQUELINA: "/avatars/PEQUELINA_frontal.png",
  ATOLONDRALIN: "/avatars/ATOLONDRALIN_frontal.png",
  SABELIN: "/avatars/SABELIN_frontal.png",
};

// Educational themed portraits
export const AVATAR_EDU: Record<string, string> = {
  YAYALIN: "/avatars/YAYALIN_edu.png",
  YAYALINA: "/avatars/YAYALINA_edu.png",
  PAPALIN: "/avatars/PAPALIN_edu.png",
  MAMALINA: "/avatars/MAMALINA_frontal.png",
  CHAVALIN: "/avatars/CHAVALIN_frontal.png",
  CHAVALINA: "/avatars/CHAVALINA_edu.png",
  PEQUELIN: "/avatars/PEQUELIN_frontal.png",
  PEQUELINA: "/avatars/PEQUELINA_edu.png",
  ATOLONDRALIN: "/avatars/ATOLONDRALIN_edu.png",
  SABELIN: "/avatars/SABELIN_frontal.png",
};

// Expression variants — used in expanded Family profiles
export const AVATAR_EXPRESSIONS: Record<string, Record<string, string>> = {
  YAYALIN: {
    feliz: "/avatars/YAYALIN_frontal.png",
    pensando: "/avatars/YAYALIN_fondo.png",
    celebrando: "/avatars/YAYALIN_celebrando.png",
  },
  YAYALINA: {
    feliz: "/avatars/ugzleSCDCooMlYXp.png",
    pensando: "/avatars/UVTLFHmkpBatMpJg.png",
    celebrando: "/avatars/bYgktTTMftbqxtOU.png",
  },
  PAPALIN: {
    feliz: "/avatars/FCWSeqIKUElLlyvX.png",
    pensando: "/avatars/iJRwIUHvjeFUkMWT.png",
    celebrando: "/avatars/CRDLvOASyzhdTRzg.png",
  },
  MAMALINA: {
    feliz: "/avatars/AeBgePjknhKWpoyx.png",
    pensando: "/avatars/XYeveGLEGvBaZvJp.png",
    celebrando: "/avatars/kHdPfPdUYsudgYrR.png",
  },
  CHAVALIN: {
    feliz: "/avatars/DBeBLdvTlDBdIxGu.png",
    pensando: "/avatars/yQbXJJGhqVOWSbHl.png",
    celebrando: "/avatars/QbvxgnrqLFmfzWcL.png",
  },
  CHAVALINA: {
    feliz: "/avatars/ZpnKqhsEhXwSuRQk.png",
    pensando: "/avatars/yEImAJfQhjWQEdSw.png",
    celebrando: "/avatars/tlshQKeJrOXOVeng.png",
  },
  PEQUELIN: {
    feliz: "/avatars/FhcrDEXORbKBvgwF.png",
    pensando: "/avatars/HyeoErvQROUrpPPa.png",
    celebrando: "/avatars/OOwWBdkEDrTFnsJG.png",
  },
  PEQUELINA: {
    feliz: "/avatars/pDxOiOubFMAlyuSh.png",
    pensando: "/avatars/kWbJIdVfrFAQQSye.png",
    celebrando: "/avatars/zPwYDkVmOqREAtyv.png",
  },
  ATOLONDRALIN: {
    feliz: "/avatars/ZqhhIEkyPYKCCJpV.png",
    pensando: "/avatars/OEcDTFRjrrpnAhyA.png",
    celebrando: "/avatars/vkllglNCWfFXszDL.png",
  },
  SABELIN: {
    feliz: "/avatars/iviBILbCRaLBCfbZ.png",
    pensando: "/avatars/ETWrsjACQxqnMOLQ.png",
    celebrando: "/avatars/aWNRltCJsZQAqJWP.png",
  },
};

// Background scene images — used behind Family profile cards
export const AVATAR_BG: Record<string, string> = {
  YAYALIN: '/avatars/personaje_YAYALIN_escena.png',
  YAYALINA: '/avatars/personaje_YAYALINA_escena.png',
  PAPALIN: '/avatars/personaje_PAPALIN_escena.png',
  MAMALINA: '/avatars/personaje_MAMALINA_escena.png',
  CHAVALIN: '/avatars/personaje_CHAVALIN_escena.png',
  CHAVALINA: '/avatars/personaje_CHAVALINA_escena.png',
  PEQUELIN: '/avatars/personaje_PEQUELIN_escena.png',
  PEQUELINA: '/avatars/personaje_PEQUELINA_escena.png',
  ATOLONDRALIN: '/avatars/personaje_ATOLONDRALIN_escena.png',
  SABELIN: '/avatars/personaje_SABELIN_escena.png',
};

// Scene images for Mundo LINCE
export const MUNDO_IMAGES = {
  hero: '/avatars/HERO_IMG_principal.png',
  familyWorld: '/avatars/SbEGHjajCJjASNUh.png',
  friendsWorld: '/avatars/OAVCOqXZjzoOcUgU.png',
  activities: '/avatars/WkIFPMxERNkqsXTd.png',
  connection: '/avatars/personaje_FAMILIA_grupo.png',
};

// Scene images for LINCE Raids
export const RAIDS_IMAGES = {
  hero: '/avatars/WVvCaISFJPMmvrzg.png',
  attack: '/avatars/mfoJVCQIDWeJBXRh.png',
  defense: '/avatars/ZpUPCtTHNEfHaqru.png',
  leaderboard: '/avatars/YTVfzhDosEKGAutF.png',
};

// Hero background for Academia
export const ACADEMIA_HERO_BG = "/avatars/GAMIFICATION_BANNER.png";

// ─── MUSICALIN AVATARS — Avatares musicales que enseñan IA ───
export const AVATAR_MUSICALIN: Record<string, string> = {
  LUMALIN: "https://files.manuscdn.com/user_upload_by_module/session_file/310419663032363896/wmbFHlPORzphQZQT.png",
  VOLTZLIN: "https://files.manuscdn.com/user_upload_by_module/session_file/310419663032363896/MtRGLffLGoCBxIBs.png",
  RIMALIN: "https://files.manuscdn.com/user_upload_by_module/session_file/310419663032363896/vVfIUOobYTRSPQMF.png",
  CRISTALIN: "https://files.manuscdn.com/user_upload_by_module/session_file/310419663032363896/frBvXFauVvWGNUJG.png",
  SONALIN: "https://files.manuscdn.com/user_upload_by_module/session_file/310419663032363896/gcHkmqKAyaKjXHqz.png",
  COREOLIN: "https://files.manuscdn.com/user_upload_by_module/session_file/310419663032363896/kTfEkJxwfZzZXViE.png",
  MANTRALIN: "https://files.manuscdn.com/user_upload_by_module/session_file/310419663032363896/zbUuzhdCbOrsYvjW.png",
  BRISLIN: "https://files.manuscdn.com/user_upload_by_module/session_file/310419663032363896/pxhbjeBCmdnsukZi.png",
  BEATLIN: "https://files.manuscdn.com/user_upload_by_module/session_file/310419663032363896/CFqQUZcjvmVWdhDW.png",
  FLOWALIN: "https://files.manuscdn.com/user_upload_by_module/session_file/310419663032363896/AOAYrMiAKKuPkKWa.png",
  STILIN: "https://files.manuscdn.com/user_upload_by_module/session_file/310419663032363896/vTSyiwjLRpmXtsDq.png",
  // ─── MÁS ARTISTAS MUSICALIN ───
  SIRENLIN: "https://files.manuscdn.com/user_upload_by_module/session_file/310419663032363896/wOwOIHYprhCMMurR.png",
  ZOTEALIN: "https://files.manuscdn.com/user_upload_by_module/session_file/310419663032363896/ysIsNVluZOEktZxs.png",
  PULSOLIN: "https://files.manuscdn.com/user_upload_by_module/session_file/310419663032363896/KZhRoYVeHPjpBRKA.png",
  GRAFALIN: "https://files.manuscdn.com/user_upload_by_module/session_file/310419663032363896/GMuFWaYaNiSxbhxI.png",
  CRONOSLIN: "https://files.manuscdn.com/user_upload_by_module/session_file/310419663032363896/yHHRduJqpAfAzGbb.png",
  GAMELIN: "https://files.manuscdn.com/user_upload_by_module/session_file/310419663032363896/gqAtVIuewqfLlaQq.png",
  TRAPZOLIN: "https://files.manuscdn.com/user_upload_by_module/session_file/310419663032363896/XczTxmsnGQwTBdEE.png",
  WAVELIN: "https://files.manuscdn.com/user_upload_by_module/session_file/310419663032363896/xbugWZwlsYIJYCQx.png",
  KUMEYLIN: "https://files.manuscdn.com/user_upload_by_module/session_file/310419663032363896/eBmEYDLSzWzlocrG.png",
  VERSOLIN: "https://files.manuscdn.com/user_upload_by_module/session_file/310419663032363896/xtHFGdKxBGLRPhTG.png",
  MARAKLIN: "https://files.manuscdn.com/user_upload_by_module/session_file/310419663032363896/geqtQbikPxHcwszX.png",
  // ─── ARTISTAS MUSICALIN INTERNACIONALES ───
  // España
  FLAMENCALIN: "https://files.manuscdn.com/user_upload_by_module/session_file/310419663032363896/OvTSLRrMNwncblai.png",
  IBERALIN: "https://files.manuscdn.com/user_upload_by_module/session_file/310419663032363896/AMWHxFtnPpLwhRND.png",
  TONALIN: "https://files.manuscdn.com/user_upload_by_module/session_file/310419663032363896/zprUjbZbqVXmogdd.png",
  SOLEARLIN: "https://files.manuscdn.com/user_upload_by_module/session_file/310419663032363896/bKRGizVxtAUeQLVE.png",
  GADITAKLIN: "https://files.manuscdn.com/user_upload_by_module/session_file/310419663032363896/MtajFjxYroHRFXgb.png",
  // Argentina
  TANGARLIN: "https://files.manuscdn.com/user_upload_by_module/session_file/310419663032363896/XPWKNTepaHsdJBTO.png",
  CUMBIELIN: "https://files.manuscdn.com/user_upload_by_module/session_file/310419663032363896/ayQwKXDgHrGHELOa.png",
  PAMPALIN: "https://files.manuscdn.com/user_upload_by_module/session_file/310419663032363896/xImfszNepFRnPDHI.png",
  MILONGUELIN: "https://files.manuscdn.com/user_upload_by_module/session_file/310419663032363896/YUZHttriuoYrAWOw.png",
  GAUCHALIN: "https://files.manuscdn.com/user_upload_by_module/session_file/310419663032363896/nQFoptgRdTPqemrZ.png",
  // Puerto Rico
  BORIQUALIN: "https://files.manuscdn.com/user_upload_by_module/session_file/310419663032363896/OazJQMWbyaKzScoa.png",
  TROPIKLIN: "https://files.manuscdn.com/user_upload_by_module/session_file/310419663032363896/bMIupKthafrXoTYv.png",
  PERREALIN: "https://files.manuscdn.com/user_upload_by_module/session_file/310419663032363896/RqMGGDOCufAinhyS.png",
  ISLALINA: "https://files.manuscdn.com/user_upload_by_module/session_file/310419663032363896/dELBQSvbGXIVkcwU.png",
  SALSALIN: "https://files.manuscdn.com/user_upload_by_module/session_file/310419663032363896/MCuvraIALoZMhOKh.png",
  // Colombia
  CUMBIALIN: "https://files.manuscdn.com/user_upload_by_module/session_file/310419663032363896/VkUbpywZYIkWxyvd.png",
  VALLENATALIN: "https://files.manuscdn.com/user_upload_by_module/session_file/310419663032363896/nrGRsGBDdKemZcAR.png",
  PARCELIN: "https://files.manuscdn.com/user_upload_by_module/session_file/310419663032363896/eAPlwzqOZxzZVglc.png",
  CAFETALIN: "https://files.manuscdn.com/user_upload_by_module/session_file/310419663032363896/uBsfdukBOokvVhUd.png",
  CHAMPETAKLIN: "https://files.manuscdn.com/user_upload_by_module/session_file/310419663032363896/pRYFRyXXRrPumdpO.png",
};

// ─── MUSICALIN CHARACTER DATA ───
export interface CharacterData {
  key: string;
  name: string;
  realArtist?: string;
  role: Record<string, string>;
  specialty: Record<string, string>;
  region: string;
  flag: string;
  color: string;
}

export const MUSICALIN_CHARACTERS: CharacterData[] = [
  { key: "LUMALIN", name: "LUMALÍN", role: { es: "Mentor IA Generativa", en: "Generative AI Mentor", zh: "生成式AI导师" }, specialty: { es: "Creación de contenido con IA", en: "AI content creation", zh: "AI内容创作" }, region: "MUSICALIN", flag: "🎵", color: "#FF6B35" },
  { key: "VOLTZLIN", name: "VOLTZLÍN", role: { es: "Director Academia LINCE", en: "LINCE Academy Director", zh: "LINCE学院院长" }, specialty: { es: "Liderazgo y estrategia IA", en: "AI leadership & strategy", zh: "AI领导力与战略" }, region: "MUSICALIN", flag: "🎵", color: "#9C27B0" },
  { key: "RIMALIN", name: "RIMALÍN", role: { es: "Profesor Prompts Creativos", en: "Creative Prompts Professor", zh: "创意提示词教授" }, specialty: { es: "Prompt engineering creativo", en: "Creative prompt engineering", zh: "创意提示词工程" }, region: "MUSICALIN", flag: "🎵", color: "#00BCD4" },
  { key: "CRISTALIN", name: "CRISTALÍN", role: { es: "Experto Automatización", en: "Automation Expert", zh: "自动化专家" }, specialty: { es: "Automatización de procesos", en: "Process automation", zh: "流程自动化" }, region: "MUSICALIN", flag: "🎵", color: "#E91E63" },
  { key: "SONALIN", name: "SONALÍN", role: { es: "Especialista Marketing IA", en: "AI Marketing Specialist", zh: "AI营销专家" }, specialty: { es: "Marketing digital con IA", en: "Digital marketing with AI", zh: "AI数字营销" }, region: "MUSICALIN", flag: "🎵", color: "#4CAF50" },
  { key: "COREOLIN", name: "COREOLÍN", role: { es: "Coach Creatividad Musical", en: "Musical Creativity Coach", zh: "音乐创意教练" }, specialty: { es: "IA aplicada a música", en: "AI applied to music", zh: "AI音乐应用" }, region: "MUSICALIN", flag: "🎵", color: "#FF9800" },
  { key: "MANTRALIN", name: "MANTRALÍN", role: { es: "Instructor Machine Learning", en: "Machine Learning Instructor", zh: "机器学习讲师" }, specialty: { es: "Fundamentos de ML", en: "ML fundamentals", zh: "ML基础" }, region: "MUSICALIN", flag: "🎵", color: "#2196F3" },
  { key: "BRISLIN", name: "BRISLÍN", role: { es: "Mentora IA Emprendedoras", en: "AI Mentor for Entrepreneurs", zh: "创业者AI导师" }, specialty: { es: "Emprendimiento con IA", en: "AI entrepreneurship", zh: "AI创业" }, region: "MUSICALIN", flag: "🎵", color: "#F44336" },
  { key: "BEATLIN", name: "BEATLÍN", role: { es: "Profesor IA y Arte Digital", en: "AI & Digital Art Professor", zh: "AI与数字艺术教授" }, specialty: { es: "Arte generativo con IA", en: "Generative art with AI", zh: "AI生成艺术" }, region: "MUSICALIN", flag: "🎵", color: "#673AB7" },
  { key: "FLOWALIN", name: "FLOWALÍN", role: { es: "Embajadora Internacional", en: "International Ambassador", zh: "国际大使" }, specialty: { es: "IA para marca personal", en: "AI for personal branding", zh: "AI个人品牌" }, region: "MUSICALIN", flag: "🎵", color: "#E040FB" },
  { key: "STILIN", name: "STILÍN", role: { es: "Streamer & Coach IA Gaming", en: "Streamer & AI Gaming Coach", zh: "主播与AI游戏教练" }, specialty: { es: "Streaming con IA, gaming y entretenimiento digital", en: "AI streaming, gaming & digital entertainment", zh: "AI直播、游戏与数字娱乐" }, region: "MUSICALIN", flag: "🎵", color: "#1DB954" },
];

// ─── MÁS AVATARES MUSICALIN ───
export const EVENTO_ESPECIAL_CHARACTERS: CharacterData[] = [
  { key: "SIRENLIN", name: "SIRENLÍN", role: { es: "Maestro del Flow Viral", en: "Viral Flow Master", zh: "病毒式流行大师" }, specialty: { es: "IA para Marketing Viral — Cómo hacer que tu contenido explote en TikTok, Instagram y YouTube usando algoritmos de IA. Desde análisis de tendencias hasta optimización de hashtags y timing perfecto.", en: "AI Viral Marketing — How to make your content explode on TikTok, Instagram and YouTube using AI algorithms", zh: "AI病毒式营销" }, region: "MUSICALIN", flag: "🎵", color: "#FF6B00" },
  { key: "ZOTEALIN", name: "ZOTEALÍN", role: { es: "Rey del Party & Video IA", en: "Party King & AI Video", zh: "派对之王与AI视频" }, specialty: { es: "IA para Video y Efectos Visuales — Crea videoclips profesionales sin estudio. Aprende a usar IA para generar efectos especiales, editar videos automáticamente y crear visuales que hipnoticen a tu audiencia.", en: "AI Video & Visual Effects — Create professional music videos without a studio using AI", zh: "AI视频与视觉效果" }, region: "MUSICALIN", flag: "🎵", color: "#E040FB" },
  { key: "PULSOLIN", name: "PULSOLÍN", role: { es: "Ingeniero de Sonido IA", en: "AI Sound Engineer", zh: "AI音频工程师" }, specialty: { es: "IA para Producción Musical — Masteriza, mezcla y produce beats como un profesional usando herramientas de IA. Desde Suno hasta Udio, aprende a crear música con inteligencia artificial que suene a chart-topper.", en: "AI Music Production — Master, mix and produce beats like a pro using AI tools", zh: "AI音乐制作" }, region: "MUSICALIN", flag: "🎵", color: "#00BCD4" },
  { key: "GRAFALIN", name: "GRAFALÍN", role: { es: "Estratega de Redes IA", en: "AI Social Media Strategist", zh: "AI社交媒体策略师" }, specialty: { es: "IA para Redes Sociales — Domina Instagram, TikTok y Twitter con IA. Programa publicaciones, analiza métricas, genera captions perfectos y construye tu marca personal.", en: "AI Social Media — Master Instagram, TikTok and Twitter with AI", zh: "AI社交媒体" }, region: "MUSICALIN", flag: "🎵", color: "#37474F" },
  { key: "CRONOSLIN", name: "CRONOSLÍN", role: { es: "Artista Digital & Creador IA", en: "Digital Artist & AI Creator", zh: "数字艺术家与AI创作者" }, specialty: { es: "IA para Arte Digital — Crea obras de arte únicas con Midjourney, DALL-E y Stable Diffusion. Desde portadas de álbum hasta NFTs, transforma tu visión artística en realidad digital con el poder de la IA generativa.", en: "AI Digital Art — Create unique artworks with Midjourney, DALL-E and Stable Diffusion", zh: "AI数字艺术" }, region: "MUSICALIN", flag: "🎵", color: "#FF7043" },
  { key: "GAMELIN", name: "GAMELÍN", role: { es: "Mentor & Coach IA", en: "Mentor & AI Coach", zh: "导师与AI教练" }, specialty: { es: "IA para Emprendimiento Musical — Experiencia en la industria + IA = negocio imparable. Aprende a monetizar tu música, gestionar contratos y construir tu imperio usando herramientas de inteligencia artificial.", en: "AI Music Entrepreneurship — Industry experience + AI = unstoppable business", zh: "AI音乐创业" }, region: "MUSICALIN", flag: "🎵", color: "#795548" },
  { key: "TRAPZOLIN", name: "TRAPZOLÍN", role: { es: "Comandante de Datos IA", en: "AI Data Commander", zh: "AI数据指挥官" }, specialty: { es: "IA para Análisis de Datos — Los números no mienten. Aprende a usar IA para analizar estadísticas de Spotify, YouTube y redes sociales. Descubre qué funciona, qué no, y toma decisiones basadas en datos reales.", en: "AI Data Analysis — Numbers don't lie. Learn to use AI to analyze Spotify, YouTube and social media stats", zh: "AI数据分析" }, region: "MUSICALIN", flag: "🎵", color: "#455A64" },
  { key: "WAVELIN", name: "WAVELÍN", role: { es: "Diseñador de Experiencias IA", en: "AI Experience Designer", zh: "AI体验设计师" }, specialty: { es: "IA para Diseño UX/UI — Diseña apps, webs y experiencias digitales que enamoren. Usa IA para crear prototipos rápidos, generar interfaces y testear usabilidad.", en: "AI UX/UI Design — Design apps, websites and digital experiences that captivate", zh: "AI UX/UI设计" }, region: "MUSICALIN", flag: "🎵", color: "#26C6DA" },
  { key: "KUMEYLIN", name: "KUMEYLÍN", role: { es: "Estratega de Ciberseguridad IA", en: "AI Cybersecurity Strategist", zh: "AI网络安全策略师" }, specialty: { es: "IA para Ciberseguridad — Protege tu música, tu marca y tus datos. Aprende a usar IA para detectar amenazas, proteger cuentas de redes sociales y mantener tu identidad digital segura.", en: "AI Cybersecurity — Protect your music, brand and data with AI", zh: "AI网络安全" }, region: "MUSICALIN", flag: "🎵", color: "#558B2F" },
  { key: "VERSOLIN", name: "VERSOLÍN", role: { es: "Poeta Digital & Storyteller IA", en: "Digital Poet & AI Storyteller", zh: "数字诗人与AI故事大师" }, specialty: { es: "IA para Storytelling & Escritura Creativa — Escribe letras que toquen el alma. Usa IA para generar rimas, construir narrativas y crear historias que conecten con tu audiencia.", en: "AI Storytelling & Creative Writing — Write lyrics that touch the soul using AI", zh: "AI叙事与创意写作" }, region: "MUSICALIN", flag: "🎵", color: "#8D6E63" },
  { key: "MARAKLIN", name: "MARAKLÍN", role: { es: "Reina del Empoderamiento IA", en: "AI Empowerment Queen", zh: "AI赋能女王" }, specialty: { es: "IA para Empoderamiento & Marca Personal Femenina — Construye tu imperio digital con IA. Desde crear tu marca personal hasta monetizar tu contenido, aprende a usar inteligencia artificial para dominar las redes.", en: "AI Empowerment & Female Personal Branding — Build your digital empire with AI", zh: "AI赋能与女性个人品牌" }, region: "MUSICALIN", flag: "🎵", color: "#E91E63" },
  // ─── ARTISTAS MUSICALIN INTERNACIONALES ───
  // España 🇪🇸
  { key: "FLAMENCALIN", name: "FLAMENCALÍN", role: { es: "Diva del Flamenco-Pop & IA", en: "Flamenco-Pop Diva & AI", zh: "弗拉门戈流行天后与AI" }, specialty: { es: "IA para Música Flamenca & Fusión — Fusiona el arte flamenco con la tecnología. Aprende a usar IA para componer, producir y mezclar ritmos flamencos con pop, electrónica y trap.", en: "AI for Flamenco Music & Fusion — Fuse flamenco art with technology using AI", zh: "AI弗拉门戈音乐与融合" }, region: "MUSICALIN", flag: "🇪🇸", color: "#C62828" },
  { key: "IBERALIN", name: "IBERALÍN", role: { es: "Productora Electrónica & IA", en: "Electronic Producer & AI", zh: "电子音乐制作人与AI" }, specialty: { es: "IA para Producción Electrónica — Crea beats electrónicos con inteligencia artificial. Desde sintetizadores virtuales hasta mastering automático, domina la música electrónica con herramientas de IA.", en: "AI Electronic Production — Create electronic beats with artificial intelligence", zh: "AI电子音乐制作" }, region: "MUSICALIN", flag: "🇪🇸", color: "#1565C0" },
  { key: "TONALIN", name: "TONALÍN", role: { es: "Rey del Reggaetón Ibérico & IA", en: "Iberian Reggaeton King & AI", zh: "伊比利亚雷鬼之王与AI" }, specialty: { es: "IA para Reggaetón & Urbano — Produce reggaetón con IA. Aprende a crear instrumentales, autotune inteligente, y estrategias de lanzamiento viral para dominar las plataformas de streaming.", en: "AI for Reggaeton & Urban — Produce reggaeton with AI tools", zh: "AI雷鬼与都市音乐" }, region: "MUSICALIN", flag: "🇪🇸", color: "#F9A825" },
  { key: "SOLEARLIN", name: "SOLEARLÍN", role: { es: "Cantante R&B Soul & IA", en: "R&B Soul Singer & AI", zh: "R&B灵魂歌手与AI" }, specialty: { es: "IA para R&B & Soul — Crea música soul con alma digital. Usa IA para armonías vocales, arreglos orquestales y producción de baladas que lleguen al corazón.", en: "AI for R&B & Soul — Create soul music with digital soul using AI", zh: "AI R&B与灵魂音乐" }, region: "MUSICALIN", flag: "🇪🇸", color: "#6A1B9A" },
  { key: "GADITAKLIN", name: "GADITAKLÍN", role: { es: "Productor Hip-Hop & IA", en: "Hip-Hop Producer & AI", zh: "嘻哈制作人与AI" }, specialty: { es: "IA para Producción Hip-Hop — Crea beats, samplea con IA y produce hip-hop de nivel profesional. Desde boom bap hasta trap, aprende las herramientas de IA que usan los productores top.", en: "AI Hip-Hop Production — Create beats, sample with AI and produce professional hip-hop", zh: "AI嘻哈制作" }, region: "MUSICALIN", flag: "🇪🇸", color: "#2E7D32" },
  // Argentina 🇦🇷
  { key: "TANGARLIN", name: "TANGARLÍN", role: { es: "Artista Tango-Electrónico & IA", en: "Tango-Electronic Artist & AI", zh: "探戈电子艺术家与AI" }, specialty: { es: "IA para Tango & Fusión Electrónica — Reinventa el tango con tecnología. Usa IA para fusionar bandoneón con sintetizadores, crear remixes de tango clásico y producir shows audiovisuales inmersivos.", en: "AI for Tango & Electronic Fusion — Reinvent tango with technology", zh: "AI探戈与电子融合" }, region: "MUSICALIN", flag: "🇦🇷", color: "#B71C1C" },
  { key: "CUMBIELIN", name: "CUMBIELÍN", role: { es: "Cantante Cumbia-Pop & IA", en: "Cumbia-Pop Singer & AI", zh: "坎比亚流行歌手与AI" }, specialty: { es: "IA para Cumbia & Pop Latino — Haz bailar al mundo con cumbia potenciada por IA. Aprende a producir cumbia digital, crear coreografías virales y distribuir tu música globalmente.", en: "AI for Cumbia & Latin Pop — Make the world dance with AI-powered cumbia", zh: "AI坎比亚与拉丁流行" }, region: "MUSICALIN", flag: "🇦🇷", color: "#FF6F00" },
  { key: "PAMPALIN", name: "PAMPALÍN", role: { es: "Rockero & Trapero Digital & IA", en: "Digital Rocker & Trapper & AI", zh: "数字摇滚与陷阱音乐人与AI" }, specialty: { es: "IA para Rock & Trap — Fusiona la energía del rock con la actitud del trap usando IA. Desde guitarras distorsionadas con autotune hasta videoclips generados por IA.", en: "AI for Rock & Trap — Fuse rock energy with trap attitude using AI", zh: "AI摇滚与陷阱音乐" }, region: "MUSICALIN", flag: "🇦🇷", color: "#37474F" },
  { key: "MILONGUELIN", name: "MILONGUELÍN", role: { es: "Cantante Pop Urbano & IA", en: "Urban Pop Singer & AI", zh: "都市流行歌手与AI" }, specialty: { es: "IA para Pop Urbano — Crea hits de pop urbano con IA. Desde composición de letras hasta producción de videoclips, domina todas las herramientas digitales para ser trending.", en: "AI for Urban Pop — Create urban pop hits with AI", zh: "AI都市流行" }, region: "MUSICALIN", flag: "🇦🇷", color: "#EC407A" },
  { key: "GAUCHALIN", name: "GAUCHALÍN", role: { es: "DJ Folk-Electrónico & IA", en: "Folk-Electronic DJ & AI", zh: "民谣电子DJ与AI" }, specialty: { es: "IA para Folk & Electrónica — Conecta las raíces folklóricas con la música electrónica usando IA. Crea sets que mezclen chacarera con house, zamba con techno.", en: "AI for Folk & Electronic — Connect folk roots with electronic music using AI", zh: "AI民谣与电子" }, region: "MUSICALIN", flag: "🇦🇷", color: "#00897B" },
  // Puerto Rico 🇵🇷
  { key: "BORIQUALIN", name: "BORIQUALÍN", role: { es: "Reina del Reggaetón & IA", en: "Reggaeton Queen & AI", zh: "雷鬼女王与AI" }, specialty: { es: "IA para Reggaetón Femenino — Domina el reggaetón con poder femenino e IA. Desde producción de perreo hasta estrategias de branding musical, aprende a ser la reina del género.", en: "AI for Female Reggaeton — Dominate reggaeton with female power and AI", zh: "AI女性雷鬼" }, region: "MUSICALIN", flag: "🇵🇷", color: "#00E676" },
  { key: "TROPIKLIN", name: "TROPIKLÍN", role: { es: "Cantante Tropical-Pop & IA", en: "Tropical-Pop Singer & AI", zh: "热带流行歌手与AI" }, specialty: { es: "IA para Música Tropical — Crea vibes tropicales con IA. Desde reggae hasta dancehall, aprende a producir música que suene a playa, sol y buen rollo con herramientas de inteligencia artificial.", en: "AI for Tropical Music — Create tropical vibes with AI", zh: "AI热带音乐" }, region: "MUSICALIN", flag: "🇵🇷", color: "#00BFA5" },
  { key: "PERREALIN", name: "PERREALÍN", role: { es: "Maestro del Perreo & Trap IA", en: "Perreo & Trap Master & AI", zh: "Perreo与陷阱大师与AI" }, specialty: { es: "IA para Perreo & Trap Latino — Produce los beats más duros del trap latino con IA. Aprende a usar 808s generados por IA, autotune avanzado y técnicas de producción que suenan a millón.", en: "AI for Perreo & Latin Trap — Produce the hardest Latin trap beats with AI", zh: "AI Perreo与拉丁陷阱" }, region: "MUSICALIN", flag: "🇵🇷", color: "#7B1FA2" },
  { key: "ISLALINA", name: "ISLALINA", role: { es: "Artista R&B Latino & IA", en: "Latin R&B Artist & AI", zh: "拉丁R&B艺术家与AI" }, specialty: { es: "IA para R&B Latino — Crea R&B con sabor caribeño usando IA. Desde armonías vocales hasta producción de álbumes completos, aprende a usar IA para crear música que enamore.", en: "AI for Latin R&B — Create R&B with Caribbean flavor using AI", zh: "AI拉丁R&B" }, region: "MUSICALIN", flag: "🇵🇷", color: "#CE93D8" },
  { key: "SALSALIN", name: "SALSALÍN", role: { es: "Maestro Salsa-Electrónica & IA", en: "Salsa-Electronic Master & AI", zh: "萨尔萨电子大师与AI" }, specialty: { es: "IA para Salsa & Fusión — Reinventa la salsa con tecnología. Usa IA para crear arreglos de salsa moderna, fusionar ritmos caribeños con electrónica y producir shows en vivo espectaculares.", en: "AI for Salsa & Fusion — Reinvent salsa with technology", zh: "AI萨尔萨与融合" }, region: "MUSICALIN", flag: "🇵🇷", color: "#EF6C00" },
  // Colombia 🇨🇴
  { key: "CUMBIALIN", name: "CUMBIALÍN", role: { es: "Artista Cumbia-Electrónica & IA", en: "Cumbia-Electronic Artist & AI", zh: "坎比亚电子艺术家与AI" }, specialty: { es: "IA para Cumbia Electrónica — Fusiona la cumbia colombiana con beats electrónicos usando IA. Desde samples de gaita hasta drops de EDM, crea la cumbia del futuro.", en: "AI for Electronic Cumbia — Fuse Colombian cumbia with electronic beats using AI", zh: "AI电子坎比亚" }, region: "MUSICALIN", flag: "🇨🇴", color: "#FDD835" },
  { key: "VALLENATALIN", name: "VALLENATALÍN", role: { es: "Cantante Vallenato-Pop & IA", en: "Vallenato-Pop Singer & AI", zh: "巴耶纳托流行歌手与AI" }, specialty: { es: "IA para Vallenato & Pop — Moderniza el vallenato con IA. Aprende a fusionar acordeón con producción digital, crear letras con IA y llevar la música vallenata al mundo.", en: "AI for Vallenato & Pop — Modernize vallenato with AI", zh: "AI巴耶纳托与流行" }, region: "MUSICALIN", flag: "🇨🇴", color: "#43A047" },
  { key: "PARCELIN", name: "PARCELÍN", role: { es: "Artista Urbano & IA", en: "Urban Artist & AI", zh: "都市艺术家与AI" }, specialty: { es: "IA para Música Urbana Latina — Produce reggaetón y trap con el sabor colombiano usando IA. Desde beats de dembow hasta estrategias de distribución en Spotify y Apple Music.", en: "AI for Latin Urban Music — Produce reggaeton and trap with Colombian flavor using AI", zh: "AI拉丁都市音乐" }, region: "MUSICALIN", flag: "🇨🇴", color: "#FF8F00" },
  { key: "CAFETALIN", name: "CAFETALÍN", role: { es: "Cantautora Indie-Folk & IA", en: "Indie-Folk Singer-Songwriter & AI", zh: "独立民谣创作歌手与AI" }, specialty: { es: "IA para Indie & Folk — Crea música indie con alma artesanal usando IA. Desde composición de letras poéticas hasta producción acústica con herramientas digitales inteligentes.", en: "AI for Indie & Folk — Create indie music with artisanal soul using AI", zh: "AI独立与民谣" }, region: "MUSICALIN", flag: "🇨🇴", color: "#795548" },
  { key: "CHAMPETAKLIN", name: "CHAMPETAKLÍN", role: { es: "Maestro Champeta & Afrobeat IA", en: "Champeta & Afrobeat Master & AI", zh: "尚佩塔与非洲节拍大师与AI" }, specialty: { es: "IA para Champeta & Afrobeat — Lleva los ritmos afrocolombianos al mundo con IA. Produce champeta, afrobeat y fusiones africanas con herramientas de inteligencia artificial.", en: "AI for Champeta & Afrobeat — Bring Afro-Colombian rhythms to the world with AI", zh: "AI尚佩塔与非洲节拍" }, region: "MUSICALIN", flag: "🇨🇴", color: "#E65100" },
];

// ─── ALL MUSICALIN CHARACTERS (original + extended) ───
export const ALL_MUSICALIN_CHARACTERS: CharacterData[] = [
  ...MUSICALIN_CHARACTERS,
  ...EVENTO_ESPECIAL_CHARACTERS,
];

// ─── BACKWARDS COMPATIBILITY ALIASES ───
export const AVATAR_CHILE_URBANO = AVATAR_MUSICALIN;
export const CHILE_URBANO_CHARACTERS = MUSICALIN_CHARACTERS;
export const ALL_URBANO_CHARACTERS = ALL_MUSICALIN_CHARACTERS;

// ─── ZARAGOZA HISTÓRICO AVATARS — 10 leyendas del Real Zaragoza como linces ───
export const AVATAR_ZARAGOZA_HISTORICO: Record<string, string> = {
  LAFITALIN: "https://files.manuscdn.com/user_upload_by_module/session_file/310419663032363896/ESiZCEZdjKzJlwmx.png",
  NAYIMIN: "https://files.manuscdn.com/user_upload_by_module/session_file/310419663032363896/VkJDeEmKUkiJDkRT.png",
  ANDERIN: "https://files.manuscdn.com/user_upload_by_module/session_file/310419663032363896/BFicBhwzXAfViSHr.png",
  GABILIN: "https://files.manuscdn.com/user_upload_by_module/session_file/310419663032363896/HRnOUZFqczRlVjif.png",
  PARDEZALIN: "https://files.manuscdn.com/user_upload_by_module/session_file/310419663032363896/YUlSAnwMTMJNAHrd.png",
  CAMINERIN: "https://files.manuscdn.com/user_upload_by_module/session_file/310419663032363896/NwczymQeCpGqknvG.png",
  SENORIN: "https://files.manuscdn.com/user_upload_by_module/session_file/310419663032363896/TqBjDWCiLFtzCeQg.png",
  AGUADIN: "https://files.manuscdn.com/user_upload_by_module/session_file/310419663032363896/MIviFaaMhvcUldoa.png",
  VILLALIN: "https://files.manuscdn.com/user_upload_by_module/session_file/310419663032363896/MyUfcoNTxSigkPOZ.png",
  SORIANIN: "https://files.manuscdn.com/user_upload_by_module/session_file/310419663032363896/gwKklDmJDjokCUIp.png",
};

// ─── AVATAR PROFILE PICS (Familia LINCE estilo foto de familia) ───
export const AVATAR_PROFILE_PIC: Record<string, string> = {
  SABELIN: "/avatars/SABELIN_profile.png",
  YAYALIN: "/avatars/YAYALIN_profile.png",
  YAYALINA: "/avatars/YAYALINA_profile.png",
  PAPALIN: "/avatars/PAPALIN_profile.png",
  MAMALINA: "/avatars/MAMALINA_profile.png",
  CHAVALIN: "/avatars/CHAVALIN_profile.png",
  CHAVALINA: "/avatars/CHAVALINA_profile.png",
  PEQUELIN: "/avatars/PEQUELIN_profile.png",
  PEQUELINA: "/avatars/PEQUELINA_profile.png",
  ATOLONDRALIN: "/avatars/ATOLONDRALIN_profile.png",
};

// ─── ZARAGOZA HISTÓRICO CHARACTER DATA ───
export const ZARAGOZA_HISTORICO_CHARACTERS: CharacterData[] = [
  { key: "LAFITALIN", name: "LAFITALÍN", role: { es: "El Goleador Estratega", en: "The Strategic Scorer", zh: "战略射手" }, specialty: { es: "IA aplicada al deporte, análisis táctico con datos, estrategia competitiva", en: "AI applied to sports, tactical data analysis, competitive strategy", zh: "AI体育应用、战术数据分析、竞争策略" }, region: "Zaragoza", flag: "🇪🇸", color: "#1E40AF" },
  { key: "NAYIMIN", name: "NAYIMÍN", role: { es: "El Mago del Gol Imposible", en: "The Impossible Goal Wizard", zh: "不可能进球的魔法师" }, specialty: { es: "Creatividad extrema con IA, soluciones inesperadas, pensar fuera de la caja", en: "Extreme AI creativity, unexpected solutions, thinking outside the box", zh: "极限AI创意、意外解决方案" }, region: "Zaragoza", flag: "🇪🇸", color: "#7C3AED" },
  { key: "ANDERIN", name: "ANDERÍN", role: { es: "El Motor Incansable", en: "The Tireless Engine", zh: "不知疲倦的引擎" }, specialty: { es: "Automatización de procesos con IA, workflows incansables, eficiencia operativa", en: "AI process automation, tireless workflows, operational efficiency", zh: "AI流程自动化、不知疲倦的工作流" }, region: "Zaragoza", flag: "🇪🇸", color: "#DC2626" },
  { key: "GABILIN", name: "GABILÍN", role: { es: "El Capitán Líder", en: "The Captain Leader", zh: "队长领袖" }, specialty: { es: "Liderazgo de equipos IA, gestión de proyectos tech, coordinación de equipos", en: "AI team leadership, tech project management, team coordination", zh: "AI团队领导、技术项目管理" }, region: "Zaragoza", flag: "🇪🇸", color: "#B91C1C" },
  { key: "PARDEZALIN", name: "PARDEZALÍN", role: { es: "El Goleador Silencioso", en: "The Silent Scorer", zh: "沉默的射手" }, specialty: { es: "Análisis de datos con IA, métricas de rendimiento, KPIs y dashboards", en: "AI data analysis, performance metrics, KPIs and dashboards", zh: "AI数据分析、绩效指标" }, region: "Zaragoza", flag: "🇪🇸", color: "#059669" },
  { key: "CAMINERIN", name: "CAMINERÍN", role: { es: "El Arquitecto del Juego", en: "The Game Architect", zh: "比赛建筑师" }, specialty: { es: "Arquitectura de sistemas IA, diseño de soluciones, visión panorámica", en: "AI systems architecture, solution design, panoramic vision", zh: "AI系统架构、解决方案设计" }, region: "Zaragoza", flag: "🇪🇸", color: "#1D4ED8" },
  { key: "SENORIN", name: "SEÑORÍN", role: { es: "El Héroe de los Títulos", en: "The Trophy Hero", zh: "冠军英雄" }, specialty: { es: "IA para momentos decisivos, toma de decisiones bajo presión, clutch thinking", en: "AI for decisive moments, decision-making under pressure", zh: "AI关键时刻决策" }, region: "Zaragoza", flag: "🇪🇸", color: "#D97706" },
  { key: "AGUADIN", name: "AGUADÍN", role: { es: "El Muro Defensivo", en: "The Defensive Wall", zh: "防守之墙" }, specialty: { es: "Ciberseguridad con IA, protección de datos, defensa digital", en: "AI cybersecurity, data protection, digital defense", zh: "AI网络安全、数据保护" }, region: "Zaragoza", flag: "🇪🇸", color: "#475569" },
  { key: "VILLALIN", name: "VILLALÍN", role: { es: "El Relámpago Letal", en: "The Lethal Lightning", zh: "致命闪电" }, specialty: { es: "Prototipado rápido con IA, MVPs veloces, ejecución explosiva", en: "Rapid AI prototyping, fast MVPs, explosive execution", zh: "快速AI原型、敏捷MVP" }, region: "Zaragoza", flag: "🇪🇸", color: "#EA580C" },
  { key: "SORIANIN", name: "SORIANÍN", role: { es: "El Creativo Elegante", en: "The Elegant Creative", zh: "优雅的创意者" }, specialty: { es: "IA generativa creativa, diseño con IA, visión artística computacional", en: "Creative generative AI, AI design, computational artistic vision", zh: "创意生成AI、AI设计" }, region: "Zaragoza", flag: "🇪🇸", color: "#7C3AED" },
];

// ─── ZARAGOZA / SPAIN FAMILY DATA ───
export const FAMILY_CHARACTERS: CharacterData[] = [
  { key: "YAYALIN", name: "ABUELO", role: { es: "Abuelo · Director General", en: "Grandfather · CEO", zh: "祖父·总监" }, specialty: { es: "Estrategia empresarial IA", en: "AI business strategy", zh: "AI商业战略" }, region: "Zaragoza", flag: "🇪🇸", color: "#00E5FF" },
  { key: "YAYALINA", name: "ABUELA", role: { es: "Abuela · Sabiduría Digital", en: "Grandmother · Digital Wisdom", zh: "祖母·数字智慧" }, specialty: { es: "IA para mayores", en: "AI for seniors", zh: "老年人AI" }, region: "Zaragoza", flag: "🇪🇸", color: "#D4A843" },
  { key: "PAPALIN", name: "PAPÁ", role: { es: "Padre · Profesor IA", en: "Father · AI Professor", zh: "父亲·AI教授" }, specialty: { es: "Machine Learning avanzado", en: "Advanced Machine Learning", zh: "高级机器学习" }, region: "Zaragoza", flag: "🇪🇸", color: "#00C853" },
  { key: "MAMALINA", name: "MAMÁ", role: { es: "Madre · Investigadora", en: "Mother · Researcher", zh: "母亲·研究员" }, specialty: { es: "Ética e investigación IA", en: "AI ethics & research", zh: "AI伦理与研究" }, region: "Zaragoza", flag: "🇪🇸", color: "#FF4081" },
  { key: "CHAVALIN", name: "HIJO", role: { es: "Hijo Adolescente · Gamer", en: "Teen Son · Gamer", zh: "青少年·游戏玩家" }, specialty: { es: "IA en videojuegos", en: "AI in gaming", zh: "游戏AI" }, region: "Zaragoza", flag: "🇪🇸", color: "#7C4DFF" },
  { key: "CHAVALINA", name: "HIJA", role: { es: "Hija Adolescente · Creativa", en: "Teen Daughter · Creative", zh: "青少年·创意" }, specialty: { es: "Diseño con IA", en: "AI design", zh: "AI设计" }, region: "Zaragoza", flag: "🇪🇸", color: "#FF6D00" },
  { key: "PEQUELIN", name: "NIÑO", role: { es: "Niño · Explorador", en: "Child · Explorer", zh: "儿童·探索者" }, specialty: { es: "IA para niños", en: "AI for kids", zh: "儿童AI" }, region: "Zaragoza", flag: "🇪🇸", color: "#00BFA5" },
  { key: "PEQUELINA", name: "NIÑA", role: { es: "Niña · Curiosa", en: "Child · Curious", zh: "儿童·好奇" }, specialty: { es: "Creatividad infantil con IA", en: "Kids creativity with AI", zh: "儿童AI创意" }, region: "Zaragoza", flag: "🇪🇸", color: "#F50057" },
  { key: "ATOLONDRALIN", name: "TÍO", role: { es: "Tío · Hacker Ético", en: "Uncle · Ethical Hacker", zh: "叔叔·道德黑客" }, specialty: { es: "Ciberseguridad IA", en: "AI cybersecurity", zh: "AI网络安全" }, region: "Zaragoza", flag: "🇪🇸", color: "#FF3D00" },
  { key: "SABELIN", name: "PRIMO", role: { es: "Primo · Genio Inventor", en: "Cousin · Genius Inventor", zh: "表兄·天才发明家" }, specialty: { es: "Innovación y startups IA", en: "AI innovation & startups", zh: "AI创新与创业" }, region: "Zaragoza", flag: "🇪🇸", color: "#FFAB00" },
];

// ─── ALL CHARACTERS COMBINED ───
export const ALL_CHARACTERS: CharacterData[] = [
  ...FAMILY_CHARACTERS,
  ...MUSICALIN_CHARACTERS,
  ...EVENTO_ESPECIAL_CHARACTERS,
  ...ZARAGOZA_HISTORICO_CHARACTERS,
];

// ─── HELPER: get avatar image by key from any collection ───
export function getAvatarImage(key: string): string {
  return AVATAR_FRONTAL[key] || AVATAR_MUSICALIN[key] || AVATAR_ZARAGOZA_HISTORICO[key] || AVATAR_PROFILE_PIC[key] || '';
}

// Helper: get profile pic (for small thumbnails in sidebar)
export function getAvatarProfilePic(key: string): string {
  return AVATAR_PROFILE_PIC[key] || AVATAR_FRONTAL[key] || AVATAR_MUSICALIN[key] || AVATAR_ZARAGOZA_HISTORICO[key] || '';
}

// ─── HELPER: get all characters by region ───
export function getCharactersByRegion(region: string): CharacterData[] {
  return ALL_CHARACTERS.filter(c => c.region.toLowerCase().includes(region.toLowerCase()));
}

// ─── HELPER: get all unique regions ───
export function getAllRegions(): string[] {
  return Array.from(new Set(ALL_CHARACTERS.map(c => c.region)));
}

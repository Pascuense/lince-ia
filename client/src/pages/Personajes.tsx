import { useState, useMemo, useRef, useEffect } from "react";
import { UserNavBadge } from "@/components/UserNavBadge";
import { AVATAR_FRONTAL, AVATAR_MUSICALIN, AVATAR_ZARAGOZA_HISTORICO, type CharacterData } from "@/lib/avatarConstants";
import { usePRDLanguage, AVATAR_NAMES_BY_COUNTRY } from "@/contexts/PRDLanguageContext";
import { GlobalNavBar } from "@/components/GlobalNavBar";
import { FictionalDisclaimer } from "@/components/FictionalDisclaimer";
import { BackButton } from "@/components/BackButton";
import { ArtistChatModal } from "@/components/ArtistChatModal";
import { useLocation } from "wouter";
import { getAvatarKeyForCharacterId, getCharacterIdByAvatarKey, toCanonicalAvatarKey } from "@/lib/avatarRouting";

// ─── SPECIALTY BADGE HELPER ───
function getSpecialtyBadge(speciality: string): string {
  const s = speciality.toLowerCase();
  if (s.includes('ética') || s.includes('etic')) return '⚖️ Ética IA';
  if (s.includes('ciberseguridad') || s.includes('protección de datos') || s.includes('defensa digital')) return '🛡️ Ciberseguridad';
  if (s.includes('prompt')) return '✨ Prompts';
  if (s.includes('automatización') || s.includes('workflow')) return '⚙️ Automatización';
  if (s.includes('liderazgo') || s.includes('gestión de proyectos') || s.includes('coordinación')) return '👑 Liderazgo IA';
  if (s.includes('análisis de datos') || s.includes('métricas') || s.includes('kpi') || s.includes('dashboard')) return '📊 Datos & Analytics';
  if (s.includes('arquitectura') || s.includes('diseño de soluciones')) return '🏗️ Arquitectura IA';
  if (s.includes('prototipado') || s.includes('mvp') || s.includes('ejecución')) return '⚡ Prototipado Rápido';
  if (s.includes('generativa') || s.includes('arte') || s.includes('diseño con ia') || s.includes('artístic')) return '🎨 IA Generativa';
  if (s.includes('storytelling') || s.includes('historia')) return '📚 Storytelling IA';
  if (s.includes('creatividad') || s.includes('fuera de la caja') || s.includes('inesperada')) return '💡 Creatividad IA';
  if (s.includes('decisión') || s.includes('presión') || s.includes('clutch')) return '🎯 Decisión IA';
  if (s.includes('deporte') || s.includes('táctico') || s.includes('competitiv')) return '⚽ Deporte & IA';
  if (s.includes('marketing') || s.includes('contenido') || s.includes('redes social')) return '📣 Marketing IA';
  if (s.includes('educación') || s.includes('pedagog') || s.includes('enseñanza')) return '🎓 Educación IA';
  if (s.includes('salud') || s.includes('bienestar') || s.includes('mental')) return '🩺 Salud & IA';
  if (s.includes('música') || s.includes('audio') || s.includes('sonido')) return '🎵 Audio & IA';
  if (s.includes('finanzas') || s.includes('inversión') || s.includes('fintech')) return '💰 Finanzas IA';
  if (s.includes('legal') || s.includes('regulación') || s.includes('normativ')) return '📋 Legal & IA';
  if (s.includes('accesibilidad') || s.includes('inclusi')) return '♿ Accesibilidad IA';
  if (s.includes('videojuego') || s.includes('gaming') || s.includes('juego')) return '🎮 Gaming & IA';
  if (s.includes('robótica') || s.includes('hardware') || s.includes('iot')) return '🤖 Robótica & IA';
  if (s.includes('idioma') || s.includes('traducción') || s.includes('nlp') || s.includes('lenguaje')) return '🌐 NLP & Idiomas';
  if (s.includes('imagen') || s.includes('visual') || s.includes('fotograf')) return '🖼️ Visión IA';
  if (s.includes('negocio') || s.includes('empresa') || s.includes('pyme') || s.includes('emprendimiento')) return '💼 Negocio & IA';
  if (s.includes('programación') || s.includes('código') || s.includes('desarrollo') || s.includes('devops')) return '💻 Desarrollo IA';
  if (s.includes('sostenibilidad') || s.includes('medio ambiente') || s.includes('clima')) return '🌿 Sostenibilidad IA';
  if (s.includes('gastronomia') || s.includes('cocina') || s.includes('culinari')) return '🍳 Gastronomía & IA';
  if (s.includes('moda') || s.includes('textil') || s.includes('fashion')) return '👗 Moda & IA';
  return '🧠 IA Aplicada';
}

// ─── CHARACTER DATA ───
type Character = {
  id: string;
  name: string;
  role: string;
  gender: "M" | "F";
  description: string;
  personality: string;
  speciality: string;
  image: string;
  color: string; // accent color for the card
  isRealPerson?: boolean; // true if inspired by a real living person
  realPersonName?: string; // name of the real person for disclaimer
};

// GRUPO 1: Familia Original (10)
const FAMILIA_ORIGINAL: Character[] = [
  {
    id: "yayolin",
    name: "ABUELO",
    role: "El Abuelo Intenso",
    gender: "M",
    description: "Te enseña los fundamentos de la IA desde cero",
    personality: "Directo, sin filtro, apasionado, brutalmente honesto",
    speciality: "Verdades incómodas sobre la IA que nadie quiere escuchar",
    image: AVATAR_FRONTAL.YAYALIN,
    color: "#FF6B35",
  },
  {
    id: "yayalina",
    name: "ABUELA",
    role: "La Abuela Cariñosa",
    gender: "F",
    description: "Explica la IA paso a paso para personas mayores",
    personality: "Cálida, paciente, sabia, con analogías cotidianas",
    speciality: "Hacer que cualquier concepto de IA sea entendible para todos",
    image: AVATAR_FRONTAL.YAYALINA,
    color: "#E8A87C",
  },
  {
    id: "papalin",
    name: "PAPÁ",
    role: "El Estratega Profesional",
    gender: "M",
    description: "Lidera tu aprendizaje de IA de principio a fin",
    personality: "Analítico, orientado a resultados, pragmático, mentor",
    speciality: "IA aplicada a negocios, productividad y estrategia empresarial",
    image: AVATAR_FRONTAL.PAPALIN,
    color: "#3B82F6",
  },
  {
    id: "mamalina",
    name: "MAMÁ",
    role: "La Organizadora Empática",
    gender: "F",
    description: "Guía a mayores con paciencia infinita en el uso de IA",
    personality: "Empática, organizadora, equilibrada, protectora",
    speciality: "Equilibrio entre tecnología y bienestar, IA con propósito humano",
    image: AVATAR_FRONTAL.MAMALINA,
    color: "#EC4899",
  },
  {
    id: "chavalin",
    name: "HIJO",
    role: "El Hype Man Gen Z",
    gender: "M",
    description: "Enseña IA a niños con juegos y retos divertidos",
    personality: "Energético, viral, trendy, hype, siempre conectado",
    speciality: "Hacer la IA accesible y cool para la Generación Z",
    image: AVATAR_FRONTAL.CHAVALIN,
    color: "#10B981",
  },
  {
    id: "chavalina",
    name: "HIJA",
    role: "La Creativa Digital",
    gender: "F",
    description: "Crea contigo arte digital e imágenes con Midjourney",
    personality: "Creativa, artística, visionaria, experimentadora",
    speciality: "IA generativa, arte digital, diseño y creatividad con IA",
    image: AVATAR_FRONTAL.CHAVALINA,
    color: "#A855F7",
  },
  {
    id: "pequelin",
    name: "NIÑO",
    role: "El Explorador Curioso",
    gender: "M",
    description: "Construye apps y webs con IA sin saber programar",
    personality: "Curioso, inocente, preguntón, sorprendente",
    speciality: "Preguntas fundamentales sobre IA que nadie más hace",
    image: AVATAR_FRONTAL.PEQUELIN,
    color: "#F59E0B",
  },
  {
    id: "pequelina",
    name: "NIÑA",
    role: "La Profesora Junior",
    gender: "F",
    description: "Demuestra lo que la IA puede hacer en tiempo real",
    personality: "Didáctica, dulce, simplificadora, paciente",
    speciality: "Enseñar IA a niños y principiantes absolutos",
    image: AVATAR_FRONTAL.PEQUELINA,
    color: "#F472B6",
  },
  {
    id: "atolondralin",
    name: "TÍO",
    role: "El Torpecillo Adorable",
    gender: "M",
    description: "Demuestra que equivocarse con IA es parte de aprender",
    personality: "Despistado, gracioso, resiliente, auténtico",
    speciality: "Aprender de los errores con IA, normalizar el fallo",
    image: AVATAR_FRONTAL.ATOLONDRALIN,
    color: "#EF4444",
  },
  {
    id: "sabelin",
    name: "PRIMO",
    role: "El Genio Sutil",
    gender: "M",
    description: "Te guía con preguntas para que descubras la IA por ti mismo",
    personality: "Sutil, profundo, socrático, iluminador",
    speciality: "Pensamiento crítico aplicado a la IA, reflexión profunda",
    image: AVATAR_FRONTAL.SABELIN,
    color: "#6366F1",
  },
];

// GRUPO 2: Especialistas (13)
const ESPECIALISTAS: Character[] = [
  {
    id: "eticolin",
    name: "ETICOLÍN",
    role: "La Investigadora Cool",
    gender: "F",
    description: "Evalúa cualquier herramienta IA con criterios éticos reales",
    personality: "Directa, ingeniosa, investigadora, sin pelos en la lengua",
    speciality: "Ética de la IA, sesgos algorítmicos, EU AI Act, dilemas morales",
    image: "https://files.manuscdn.com/user_upload_by_module/session_file/310419663032363896/ajiaIbKOPwyPDkUH.png",
    color: "#8B5CF6",
  },
  {
    id: "datolin",
    name: "DATOLÍN",
    role: "El Fumeta Genio",
    gender: "M",
    description: "Analiza datasets complejos con ChatGPT y Google Sheets IA",
    personality: "Relajado, gracioso, pícaro, genio disfrazado de vago",
    speciality: "RGPD, privacidad de datos, qué hacen las IAs con tu información",
    image: "https://files.manuscdn.com/user_upload_by_module/session_file/310419663032363896/sEgoRVeZEfinCSjX.png",
    color: "#22C55E",
  },
  {
    id: "eticalin",
    name: "ETICALÍN",
    role: "La Profesora de Ética",
    gender: "F",
    description: "Detecta sesgos y garantiza el uso ético de la IA",
    personality: "Académica, rigurosa, accesible, justa",
    speciality: "Ética aplicada a la IA, filosofía de la tecnología, marcos regulatorios",
    image: "https://files.manuscdn.com/user_upload_by_module/session_file/310419663032363896/GzAoPGrFFcTlIWwe.png",
    color: "#D4A843",
  },
  {
    id: "abogalin",
    name: "ABOGALÍN",
    role: "El Abogado Buitre de la IA",
    gender: "M",
    description: "Navega el EU AI Act y los derechos digitales con IA",
    personality: "Astuto, rápido, irónico, siempre encuentra la trampa",
    speciality: "Propiedad intelectual, copyright de contenido IA, demandas Big Tech",
    image: "https://files.manuscdn.com/user_upload_by_module/session_file/310419663032363896/OldfUfbiKwJNWrVz.png",
    color: "#78716C",
  },
  {
    id: "influencelin",
    name: "INFLUENCELÍN",
    role: "La Influencer que Descubrió la Verdad",
    gender: "F",
    description: "Escala tu presencia en redes sociales con IA como aliada",
    personality: "Glamurosa, reveladora, auténtica, conectada",
    speciality: "Deepfakes, filtros IA, manipulación algorítmica de redes sociales",
    image: "https://files.manuscdn.com/user_upload_by_module/session_file/310419663032363896/XHusJemglBUJYsTH.png",
    color: "#F43F5E",
  },
  {
    id: "curralin",
    name: "CURRALÍN",
    role: "El Trabajador Preocupado",
    gender: "M",
    description: "Potencia tu carrera profesional con LinkedIn AI y Notion",
    personality: "Preocupado, honesto, representativo, esperanzado",
    speciality: "IA y empleo, automatización, reconversión profesional",
    image: "https://files.manuscdn.com/user_upload_by_module/session_file/310419663032363896/eamRyPwpzgjqnwaY.png",
    color: "#F97316",
  },
  {
    id: "doctolin",
    name: "DOCTOLÍN",
    role: "La Médica Escéptica",
    gender: "F",
    description: "Usa IA para buscar información médica verificada y fiable",
    personality: "Escéptica, rigurosa, científica, protectora",
    speciality: "IA en salud, diagnóstico asistido, apps médicas, bioética",
    image: "https://files.manuscdn.com/user_upload_by_module/session_file/310419663032363896/vlMTJFnDdJNdCkcL.png",
    color: "#06B6D4",
  },
  {
    id: "profalin",
    name: "PROFALÍN",
    role: "El Profesor Vieja Escuela",
    gender: "M",
    description: "Perfecciona tus prompts con la técnica CREA paso a paso",
    personality: "Tradicional, escéptico, sabio, adaptándose",
    speciality: "IA en educación, pedagogía vs tecnología, brecha digital docente",
    image: "https://files.manuscdn.com/user_upload_by_module/session_file/310419663032363896/fHzPQXuVPYTWXbZi.png",
    color: "#92400E",
  },
  {
    id: "emprendalin",
    name: "EMPRENDALÍN",
    role: "La Emprendedora Hiperactiva",
    gender: "F",
    description: "Lanza tu negocio usando IA en cada paso del camino",
    personality: "Hiperactiva, práctica, obsesionada con la eficiencia",
    speciality: "Herramientas IA para startups, automatización de negocios, growth hacking",
    image: "https://files.manuscdn.com/user_upload_by_module/session_file/310419663032363896/lVjQlxiAwkRMFxXj.png",
    color: "#2563EB",
  },
  {
    id: "conspiralin",
    name: "CONSPIRALÍN",
    role: "El Conspiranoico Reformado",
    gender: "M",
    description: "Detecta deepfakes y noticias falsas generadas por IA",
    personality: "Desconfiado pero reformándose, investigador, sorprendente",
    speciality: "Desinformación sobre IA, mitos vs realidades, fact-checking tecnológico",
    image: "https://files.manuscdn.com/user_upload_by_module/session_file/310419663032363896/KvWiFByaYOmfjPTu.png",
    color: "#65A30D",
  },
  {
    id: "abuelin",
    name: "ABUELÍN",
    role: "La Abuelita Digital",
    gender: "F",
    description: "Da tus primeros pasos con la IA de forma segura y sin miedo",
    personality: "Tierna, decidida, valiente, inspiradora",
    speciality: "Alfabetización digital para mayores, estafas digitales, inclusión",
    image: "https://files.manuscdn.com/user_upload_by_module/session_file/310419663032363896/gqQwwTeePsNproay.png",
    color: "#D946EF",
  },
  {
    id: "artistalin",
    name: "ARTISTALÍN",
    role: "El Artista Furioso",
    gender: "M",
    description: "Crea imágenes con IA simplemente describiendo lo que imaginas",
    personality: "Apasionado, furioso, creativo, en conflicto",
    speciality: "IA generativa y arte, derechos de autor, el debate 'IA no es arte'",
    image: "https://files.manuscdn.com/user_upload_by_module/session_file/310419663032363896/CrLXBeJExUZRmDRp.png",
    color: "#DC2626",
  },
  {
    id: "gamerlin",
    name: "GAMERLÍN",
    role: "El Gamer Competitivo",
    gender: "M",
    description: "Mejora en videojuegos y crea contenido gaming con IA",
    personality: "Competitivo, nocturno, apasionado, comunidad",
    speciality: "IA en videojuegos, NPCs inteligentes, trampas con IA, matchmaking",
    image: "https://files.manuscdn.com/user_upload_by_module/session_file/310419663032363896/DQOaFidFiiWYpvHc.png",
    color: "#4ADE80",
  },
];

// GRUPO 3: MUSICALIN — 42 avatares cantantes que enseñan IA (España, Argentina, Puerto Rico, Colombia y más)
const URBANO: Character[] = [
  { id: "trapzolin", name: "TRAPZOLÍN", role: "Comandante de Datos IA", gender: "M", description: "Analiza datos de Spotify y redes con IA para tomar decisiones", personality: "Analítico, duro, preciso, leyenda", speciality: "IA para Análisis de Datos, estadísticas de streaming, decisiones basadas en datos", image: AVATAR_MUSICALIN.TRAPZOLIN, color: "#455A64", isRealPerson: false },
  { id: "lumalin", name: "LUMALÍN", role: "Mentor IA Generativa", gender: "M", description: "Crea contenido con IA generativa usando el flow musical", personality: "Creativo, autentico, flow natural, mentor nato", speciality: "Creacion de contenido con IA, prompt engineering creativo", image: AVATAR_MUSICALIN.LUMALIN, color: "#FF6B35", isRealPerson: false },
  { id: "cristalin", name: "CRISTALÍN", role: "Experto Automatizacion", gender: "M", description: "Automatiza flujos de trabajo con n8n y Zapier AI", personality: "Eficiente, practico, automatizador compulsivo", speciality: "Automatizacion de procesos, workflows con IA, Make/Zapier", image: AVATAR_MUSICALIN.CRISTALIN, color: "#E91E63", isRealPerson: false },
  { id: "cronoslin", name: "CRONOSLÍN", role: "Artista Digital & Creador IA", gender: "M", description: "Genera arte digital único con Midjourney y Stable Diffusion", personality: "Multifacético, creativo, visual, artístico", speciality: "IA para Arte Digital, portadas de álbum, NFTs, visión artística digital", image: AVATAR_MUSICALIN.CRONOSLIN, color: "#FF7043", isRealPerson: false },
  { id: "sirenlin", name: "SIRENLÍN", role: "Maestro del Flow Viral", gender: "M", description: "Hace explotar tu contenido en TikTok con algoritmos de IA", personality: "Viral, explosivo, estratégico, imparable", speciality: "IA para Marketing Viral, análisis de tendencias, optimización de hashtags y timing", image: AVATAR_MUSICALIN.SIRENLIN, color: "#FF6B00", isRealPerson: false },
  { id: "kumeylin", name: "KUMEYLÍN", role: "Estratega de Ciberseguridad IA", gender: "M", description: "Enseña ciberseguridad y cómo protegerse de la IA maliciosa", personality: "Militar, protector, directo, implacable", speciality: "IA para Ciberseguridad, detección de amenazas, protección de identidad digital", image: AVATAR_MUSICALIN.KUMEYLIN, color: "#558B2F", isRealPerson: false },
  { id: "versolin", name: "VERSOLÍN", role: "Poeta Digital & Storyteller IA", gender: "M", description: "Escribe letras y narrativas con IA como co-escritor creativo", personality: "Poético, melancólico, profundo, creativo", speciality: "IA para Storytelling & Escritura Creativa, generación de rimas, narrativas", image: AVATAR_MUSICALIN.VERSOLIN, color: "#8D6E63", isRealPerson: false },
  { id: "rimalin", name: "RIMALÍN", role: "Profesor Prompts Creativos", gender: "M", description: "Domina el arte del prompt engineering desde el nivel 0", personality: "Ingenioso, preciso, creativo, didactico", speciality: "Prompt engineering creativo, tecnicas avanzadas de prompts", image: AVATAR_MUSICALIN.RIMALIN, color: "#00BCD4", isRealPerson: false },
  { id: "brislin", name: "BRISLÍN", role: "Mentora IA Emprendedoras", gender: "F", description: "Empodera emprendedoras con herramientas de IA prácticas", personality: "Empoderada, visionaria, mentora, rompedora", speciality: "Emprendimiento con IA, startups tech, liderazgo femenino", image: AVATAR_MUSICALIN.BRISLIN, color: "#F44336", isRealPerson: false },
  { id: "wavelin", name: "WAVELÍN", role: "Diseñador de Experiencias IA", gender: "M", description: "Diseña apps y experiencias digitales con IA generativa", personality: "Creativo, UX-obsesionado, nueva generación, innovador", speciality: "IA para Diseño UX/UI, prototipos rápidos, interfaces generativas", image: AVATAR_MUSICALIN.WAVELIN, color: "#26C6DA", isRealPerson: false },
  { id: "sonalin", name: "SONALÍN", role: "Especialista Marketing IA", gender: "M", description: "Diseña campañas de marketing completas con IA", personality: "Estrategico, viral, carismatico, orientado a resultados", speciality: "Marketing digital con IA, growth hacking, viralizacion", image: AVATAR_MUSICALIN.SONALIN, color: "#4CAF50", isRealPerson: false },
  { id: "zotealin", name: "ZOTEALÍN", role: "Rey del Party & Video IA", gender: "M", description: "Crea vídeos cortos virales con CapCut AI y OpusClip", personality: "Fiestero, visual, creativo, magnético", speciality: "IA para Video y Efectos Visuales, edición automática, visuales hipnóticos", image: AVATAR_MUSICALIN.ZOTEALIN, color: "#E040FB", isRealPerson: false },
  { id: "grafalin", name: "GRAFALÍN", role: "Estratega de Redes IA", gender: "M", description: "Domina redes sociales con IA para crecer tu audiencia", personality: "Global, estratégico, marca personal, OG del trap", speciality: "IA para Redes Sociales, programación de publicaciones, análisis de métricas", image: AVATAR_MUSICALIN.GRAFALIN, color: "#37474F", isRealPerson: false },
  { id: "mantralin", name: "MANTRALÍN", role: "Instructor Machine Learning", gender: "M", description: "Explica Machine Learning con analogías que cualquiera entiende", personality: "Callejero, accesible, tecnico pero cercano", speciality: "Fundamentos de ML, redes neuronales, TensorFlow para principiantes", image: AVATAR_MUSICALIN.MANTRALIN, color: "#2196F3", isRealPerson: false },
  { id: "flowalin", name: "FLOWALÍN", role: "Embajadora Internacional", gender: "F", description: "Crea tu marca personal global con IA y branding digital", personality: "Global, bilingue, marca personal, conectora", speciality: "IA para marca personal, branding internacional, redes globales", image: AVATAR_MUSICALIN.FLOWALIN, color: "#E040FB", isRealPerson: false },
  { id: "pulsolin", name: "PULSOLÍN", role: "Ingeniero de Sonido IA", gender: "M", description: "Produce música y beats con herramientas de IA generativa", personality: "Técnico, melódico, innovador, west coast", speciality: "IA para Producción Musical, Suno, Udio, beats con IA", image: AVATAR_MUSICALIN.PULSOLIN, color: "#00BCD4", isRealPerson: false },
  { id: "beatlin", name: "BEATLÍN", role: "Profesor IA y Arte Digital", gender: "M", description: "Fusiona arte digital con IA generativa de vanguardia", personality: "Vanguardista, artistico, experimental, profundo", speciality: "Arte generativo con IA, Midjourney, DALL-E, Stable Diffusion", image: AVATAR_MUSICALIN.BEATLIN, color: "#673AB7", isRealPerson: false },
  { id: "stilin", name: "STILÍN", role: "Streamer & Coach IA Gaming", gender: "M", description: "Enseña a usar IA para streaming y entretenimiento digital", personality: "Callejero, autentico, streamer nato, competitivo", speciality: "Streaming con IA, gaming, entretenimiento digital, creacion de contenido en vivo", image: AVATAR_MUSICALIN.STILIN, color: "#1DB954", isRealPerson: false },
  { id: "coreolin", name: "COREOLÍN", role: "Coach Creatividad Musical", gender: "M", description: "Crea canciones completas con Suno AI en segundos", personality: "Musical, inspirador, fusion tradicion-tech", speciality: "IA aplicada a musica, produccion musical con IA, Suno/Udio", image: AVATAR_MUSICALIN.COREOLIN, color: "#FF9800", isRealPerson: false },
  { id: "voltzlin", name: "VOLTZLÍN", role: "Director Academia LINCE", gender: "M", description: "Lidera proyectos de IA con visión estratégica y energía", personality: "Lider, magnetico, visionario, imparable", speciality: "Liderazgo y estrategia IA, direccion de equipos creativos", image: AVATAR_MUSICALIN.VOLTZLIN, color: "#9C27B0", isRealPerson: false },
  { id: "gamelin", name: "GAMELÍN", role: "OG Mentor & Coach IA", gender: "M", description: "Monetiza tu talento con IA para emprendimiento musical", personality: "Veterano, sabio, mentor, respetado", speciality: "IA para Emprendimiento Musical, monetización, gestión de contratos", image: AVATAR_MUSICALIN.GAMELIN, color: "#795548", isRealPerson: false },
  { id: "maraklin", name: "MARAKLÍN", role: "Reina del Empoderamiento IA", gender: "F", description: "Construye imperios digitales con IA y empodera mujeres en tech", personality: "Feroz, empoderada, leal, reina, auténtica, imparable", speciality: "IA para Empoderamiento & Marca Personal Femenina, monetización de contenido, dominio de redes", image: AVATAR_MUSICALIN.MARAKLIN, color: "#E91E63", isRealPerson: false },
  // ─── ARTISTAS MUSICALIN INTERNACIONALES ───
  // España 🇪🇸
  { id: "flamencalin", name: "FLAMENCALÍN", role: "Diva del Flamenco-Pop & IA", gender: "F", description: "Fusiona el arte flamenco con la tecnología para crear música única", personality: "Apasionada, flamenca, poderosa, artística", speciality: "IA para Música Flamenca & Fusión, composición, producción flamenca-pop", image: AVATAR_MUSICALIN.FLAMENCALIN, color: "#C62828", isRealPerson: false },
  { id: "iberalin", name: "IBERALÍN", role: "Productora Electrónica & IA", gender: "F", description: "Crea beats electrónicos con inteligencia artificial de vanguardia", personality: "Futurista, técnica, cool, innovadora", speciality: "IA para Producción Electrónica, sintetizadores virtuales, mastering automático", image: AVATAR_MUSICALIN.IBERALIN, color: "#1565C0", isRealPerson: false },
  { id: "tonalin", name: "TONALÍN", role: "Rey del Reggaetón Ibérico & IA", gender: "M", description: "Produce reggaetón con IA y estrategias de lanzamiento viral", personality: "Seguro, carismático, musical, viral", speciality: "IA para Reggaetón & Música Latina, instrumentales, autotune inteligente", image: AVATAR_MUSICALIN.TONALIN, color: "#F9A825", isRealPerson: false },
  { id: "solearlin", name: "SOLEARLÍN", role: "Cantante R&B Soul & IA", gender: "F", description: "Crea música soul con alma digital y armonías vocales con IA", personality: "Sensual, profunda, emotiva, elegante", speciality: "IA para R&B & Soul, armonías vocales, arreglos orquestales", image: AVATAR_MUSICALIN.SOLEARLIN, color: "#6A1B9A", isRealPerson: false },
  { id: "gaditaklin", name: "GADITAKLÍN", role: "Productor Hip-Hop & IA", gender: "M", description: "Crea beats y produce hip-hop profesional con herramientas de IA", personality: "Creativo, técnico, old school, visionario", speciality: "IA para Producción Hip-Hop, sampling con IA, boom bap y trap", image: AVATAR_MUSICALIN.GADITAKLIN, color: "#2E7D32", isRealPerson: false },
  // Argentina 🇦🇷
  { id: "tangarlin", name: "TANGARLÍN", role: "Artista Tango-Electrónico & IA", gender: "F", description: "Reinventa el tango fusionando bandoneón con sintetizadores e IA", personality: "Elegante, intensa, dramática, sofisticada", speciality: "IA para Tango & Fusión Electrónica, remixes, shows audiovisuales", image: AVATAR_MUSICALIN.TANGARLIN, color: "#B71C1C", isRealPerson: false },
  { id: "cumbielin", name: "CUMBIELÍN", role: "Cantante Cumbia-Pop & IA", gender: "F", description: "Hace bailar al mundo con cumbia potenciada por inteligencia artificial", personality: "Alegre, colorida, energética, contagiosa", speciality: "IA para Cumbia & Pop Latino, cumbia digital, coreografías virales", image: AVATAR_MUSICALIN.CUMBIELIN, color: "#FF6F00", isRealPerson: false },
  { id: "pampalin", name: "PAMPALÍN", role: "Rockero & Trapero Digital & IA", gender: "M", description: "Fusiona la energía del rock con la actitud del trap usando IA", personality: "Rebelde, intenso, auténtico, salvaje", speciality: "IA para Rock & Trap, guitarras con autotune, videoclips con IA", image: AVATAR_MUSICALIN.PAMPALIN, color: "#37474F", isRealPerson: false },
  { id: "milonguelin", name: "MILONGUELÍN", role: "Cantante Pop Latino & IA", gender: "F", description: "Crea hits de pop latino con IA para ser trending en todas las plataformas", personality: "Cool, moderna, trendsetter, magnética", speciality: "IA para Pop Latino, composición de letras, producción de videoclips", image: AVATAR_MUSICALIN.MILONGUELIN, color: "#EC407A", isRealPerson: false },
  { id: "gauchalin", name: "GAUCHALÍN", role: "DJ Folk-Electrónico & IA", gender: "M", description: "Conecta raíces folklóricas con música electrónica usando IA", personality: "Sabio, conectado, fusionador, auténtico", speciality: "IA para Folk & Electrónica, chacarera con house, zamba con techno", image: AVATAR_MUSICALIN.GAUCHALIN, color: "#00897B", isRealPerson: false },
  // Puerto Rico 🇵🇷
  { id: "boriqualin", name: "BORIQUALÍN", role: "Reina del Reggaetón & IA", gender: "F", description: "Domina el reggaetón con poder femenino e inteligencia artificial", personality: "Feroz, poderosa, segura, reina del perreo", speciality: "IA para Reggaetón Femenino, producción de perreo, branding musical", image: AVATAR_MUSICALIN.BORIQUALIN, color: "#00E676", isRealPerson: false },
  { id: "tropiklin", name: "TROPIKLÍN", role: "Cantante Tropical-Pop & IA", gender: "F", description: "Crea vibes tropicales con IA que suenan a playa y buen rollo", personality: "Radiante, tropical, positiva, libre", speciality: "IA para Música Tropical, reggae, dancehall, producción tropical", image: AVATAR_MUSICALIN.TROPIKLIN, color: "#00BFA5", isRealPerson: false },
  { id: "perrealin", name: "PERREALÍN", role: "Maestro del Perreo & Trap IA", gender: "M", description: "Produce los beats más duros del trap latino con IA avanzada", personality: "Duro, callejero, intenso, imparable", speciality: "IA para Perreo & Trap Latino, 808s con IA, autotune avanzado", image: AVATAR_MUSICALIN.PERREALIN, color: "#7B1FA2", isRealPerson: false },
  { id: "islalina", name: "ISLALINA", role: "Artista R&B Latino & IA", gender: "F", description: "Crea R&B con sabor caribeño usando IA para música que enamora", personality: "Elegante, serena, romántica, soñadora", speciality: "IA para R&B Latino, armonías vocales, producción de álbumes", image: AVATAR_MUSICALIN.ISLALINA, color: "#CE93D8", isRealPerson: false },
  { id: "salsalin", name: "SALSALÍN", role: "Maestro Salsa-Electrónica & IA", gender: "M", description: "Reinventa la salsa con tecnología y fusión electrónica", personality: "Carismático, elegante, bailable, clásico", speciality: "IA para Salsa & Fusión, arreglos modernos, shows en vivo", image: AVATAR_MUSICALIN.SALSALIN, color: "#EF6C00", isRealPerson: false },
  // Colombia 🇨🇴
  { id: "cumbialin", name: "CUMBIALÍN", role: "Artista Cumbia-Electrónica & IA", gender: "F", description: "Fusiona la cumbia colombiana con beats electrónicos usando IA", personality: "Vibrante, cultural, energética, innovadora", speciality: "IA para Cumbia Electrónica, samples de gaita, drops de EDM", image: AVATAR_MUSICALIN.CUMBIALIN, color: "#FDD835", isRealPerson: false },
  { id: "vallenatalin", name: "VALLENATALÍN", role: "Cantante Vallenato-Pop & IA", gender: "F", description: "Moderniza el vallenato fusionando acordeón con producción digital", personality: "Dulce, apasionada, tradicional-moderna, cálida", speciality: "IA para Vallenato & Pop, fusión acordeón-digital, letras con IA", image: AVATAR_MUSICALIN.VALLENATALIN, color: "#43A047", isRealPerson: false },
  { id: "parcelin", name: "PARCELÍN", role: "Artista Musical & IA", gender: "M", description: "Produce reggaetón y trap con sabor colombiano usando IA", personality: "Intenso, seguro, callejero, ambicioso", speciality: "IA para Música Latina, beats de dembow, distribución digital", image: AVATAR_MUSICALIN.PARCELIN, color: "#FF8F00", isRealPerson: false },
  { id: "cafetalin", name: "CAFETALÍN", role: "Cantautora Indie-Folk & IA", gender: "F", description: "Crea música indie con alma artesanal usando herramientas de IA", personality: "Sensible, poética, cálida, auténtica", speciality: "IA para Indie & Folk, composición poética, producción acústica", image: AVATAR_MUSICALIN.CAFETALIN, color: "#795548", isRealPerson: false },
  { id: "champetaklin", name: "CHAMPETAKLÍN", role: "Maestro Champeta & Afrobeat IA", gender: "M", description: "Lleva los ritmos afrocolombianos al mundo con inteligencia artificial", personality: "Vibrante, alegre, cultural, contagioso", speciality: "IA para Champeta & Afrobeat, fusiones africanas, producción con IA", image: AVATAR_MUSICALIN.CHAMPETAKLIN, color: "#E65100", isRealPerson: false },
];

// GRUPO 4b: Colección Aragonesa (10 — sin Lafitalín, movido a Zaragoza Histórico)
const ARAGONESES: Character[] = [
  {
    id: "manolin",
    name: "MAÑOLIN",
    role: "El Baturro Tozudo",
    gender: "M",
    description: "Aplica la IA al trabajo en equipo y la colaboración",
    personality: "Tozudo, noble, directo, orgulloso de sus raíces",
    speciality: "Persistencia en el aprendizaje de IA, no rendirse nunca",
    image: "https://files.manuscdn.com/user_upload_by_module/session_file/310419663032363896/jDgVYaQZiEIJVorX.png",
    color: "#DC2626",
  },
  {
    id: "pilarin",
    name: "PILARÍN",
    role: "La Pilarica Tech",
    gender: "F",
    description: "Crea presentaciones impactantes con Gamma y PowerPoint IA",
    personality: "Protectora, firme, inspiradora, comunitaria",
    speciality: "Comunidad tech aragonesa, networking, apoyo mutuo en IA",
    image: "https://files.manuscdn.com/user_upload_by_module/session_file/310419663032363896/CxAMPhdznJvBLpIb.png",
    color: "#7C3AED",
  },
  {
    id: "cierzolin",
    name: "CIERZOLÍN",
    role: "El Viento Imparable",
    gender: "M",
    description: "Usa IA para tomar mejores decisiones con datos reales",
    personality: "Veloz, imparable, disperso pero eficaz, energético",
    speciality: "Noticias de IA a toda velocidad, estar siempre al día",
    image: "https://files.manuscdn.com/user_upload_by_module/session_file/310419663032363896/CYKjvyMAzBrGPUIy.png",
    color: "#0EA5E9",
  },
  {
    id: "goyalin",
    name: "GOYALÍN",
    role: "El Artista Visionario",
    gender: "M",
    description: "Crea contenido creativo con herramientas de IA generativa",
    personality: "Visionario, provocador, genial, entre lo clásico y lo futurista",
    speciality: "IA y arte, creatividad computacional, visión artística de la tecnología",
    image: "https://files.manuscdn.com/user_upload_by_module/session_file/310419663032363896/lciRQYltLfQvNCeX.png",
    color: "#B45309",
  },
  {
    id: "jotalin",
    name: "JOTALÍN",
    role: "La Cantadora Digital",
    gender: "F",
    description: "Automatiza tareas repetitivas con flujos IA sin código",
    personality: "Apasionada, musical, fusión tradición-futuro, expresiva",
    speciality: "IA y música, preservación cultural con tecnología, creatividad sonora",
    image: "https://files.manuscdn.com/user_upload_by_module/session_file/310419663032363896/ZJgkottPEafUdIcZ.png",
    color: "#E11D48",
  },
  {
    id: "ternelin",
    name: "TERNELÍN",
    role: "El Terne Valiente",
    gender: "M",
    description: "Protege datos y sistemas con ciberseguridad basada en IA",
    personality: "Valiente, decidido, duro pero noble, protector",
    speciality: "Ciberseguridad, protección digital, enfrentar los retos de la IA sin miedo",
    image: "https://files.manuscdn.com/user_upload_by_module/session_file/310419663032363896/FWdLAjGvfOyyipXv.png",
    color: "#1E293B",
  },
  {
    id: "baturralin",
    name: "BATURRALÍN",
    role: "La Baturra Sabia",
    gender: "F",
    description: "Genera informes y resúmenes ejecutivos con IA en minutos",
    personality: "Astuta, práctica, sabia, con retranca",
    speciality: "Sentido común aplicado a la IA, soluciones prácticas, no complicarse",
    image: "https://files.manuscdn.com/user_upload_by_module/session_file/310419663032363896/AxgrDBjSdwQlPuiH.png",
    color: "#A16207",
  },
  {
    id: "mudejarin",
    name: "MUDEJARÍN",
    role: "La Arquitecta Cultural",
    gender: "F",
    description: "Diseña arquitecturas de sistemas IA desde cero",
    personality: "Elegante, integradora, arquitecta de ideas, multicultural",
    speciality: "Arquitectura de IA, diseño de sistemas, fusión cultural y tecnológica",
    image: "https://files.manuscdn.com/user_upload_by_module/session_file/310419663032363896/qkEShIzCxoUOYqOH.png",
    color: "#D4A843",
  },
  {
    id: "ebrolin",
    name: "EBROLÍN",
    role: "El Río del Conocimiento",
    gender: "M",
    description: "Usa la IA para tomar mejores decisiones con datos reales",
    personality: "Sereno, conector, profundo, fluido",
    speciality: "Flujo de información, conectar comunidades de IA, conocimiento compartido",
    image: "https://files.manuscdn.com/user_upload_by_module/session_file/310419663032363896/lGGlkLtvYRsPZgwP.png",
    color: "#0891B2",
  },
  {
    id: "borrajin",
    name: "BORRAJÍN",
    role: "La Cocinera del Conocimiento",
    gender: "F",
    description: "Aplica la IA a proyectos de innovación y emprendimiento",
    personality: "Nutritiva, creativa, paciente, transformadora",
    speciality: "Hacer digeribles los conceptos complejos de IA, recetas de aprendizaje",
    image: "https://files.manuscdn.com/user_upload_by_module/session_file/310419663032363896/tHgqsSuqUhkWgeqx.png",
    color: "#059669",
  },
];

// GRUPO 5: Zaragoza Histórico — 10 leyendas del Real Zaragoza
const ZARAGOZA_HISTORICO: Character[] = [
  {
    id: "lafitalin",
    name: "BOROLIN",
    role: "El Goleador Estratega",
    gender: "M",
    description: "Explica la historia de la IA con storytelling épico",
    personality: "Estratégico, líder, competitivo, leal a sus colores",
    speciality: "IA aplicada al deporte, análisis táctico con datos, estrategia competitiva",
    image: AVATAR_ZARAGOZA_HISTORICO.LAFITALIN,
    color: "#1E40AF",
      isRealPerson: false,
  },
  {
    id: "nayimin",
    name: "MONCAYOLIN",
    role: "El Mago del Gol Imposible",
    gender: "M",
    description: "Usa IA para diseñar estrategias ganadoras",
    personality: "Audaz, mágico, visionario, atrevido",
    speciality: "Creatividad extrema con IA, soluciones inesperadas, pensar fuera de la caja",
    image: AVATAR_ZARAGOZA_HISTORICO.NAYIMIN,
    color: "#7C3AED",
      isRealPerson: false,
  },
  {
    id: "anderin",
    name: "EBROLÍN",
    role: "El Motor Incansable",
    gender: "M",
    description: "Automatiza procesos con IA sin parar ni rendirse",
    personality: "Incansable, determinado, trabajador, leal",
    speciality: "Automatización de procesos con IA, workflows incansables, eficiencia operativa",
    image: AVATAR_ZARAGOZA_HISTORICO.ANDERIN,
    color: "#DC2626",
      isRealPerson: false,
  },
  {
    id: "gabilin",
    name: "BATUROLIN",
    role: "El Capitán Líder",
    gender: "M",
    description: "Lidera equipos tech con la intensidad de un capitán",
    personality: "Líder, intenso, comprometido, capitán nato",
    speciality: "Liderazgo de equipos IA, gestión de proyectos tech, coordinación de equipos",
    image: AVATAR_ZARAGOZA_HISTORICO.GABILIN,
    color: "#B91C1C",
      isRealPerson: false,
  },
  {
    id: "pardezalin",
    name: "CORONALIN",
    role: "El Goleador Silencioso",
    gender: "M",
    description: "Analiza datos con precisión letal y crea dashboards IA",
    personality: "Silencioso, preciso, analítico, letal",
    speciality: "Análisis de datos con IA, métricas de rendimiento, KPIs y dashboards",
    image: AVATAR_ZARAGOZA_HISTORICO.PARDEZALIN,
    color: "#059669",
      isRealPerson: false,
  },
  {
    id: "caminerin",
    name: "CESARLIN",
    role: "El Arquitecto del Juego",
    gender: "M",
    description: "Entrena tu liderazgo con simulaciones de IA conversacional",
    personality: "Cerebral, estratégico, visionario, arquitecto",
    speciality: "Arquitectura de sistemas IA, diseño de soluciones, visión panorámica",
    image: AVATAR_ZARAGOZA_HISTORICO.CAMINERIN,
    color: "#1D4ED8",
      isRealPerson: false,
  },
  {
    id: "senorin",
    name: "ROMEROLIN",
    role: "El Héroe de los Títulos",
    gender: "M",
    description: "Toma decisiones rápidas bajo presión con ayuda de IA",
    personality: "Heroico, decisivo, clutch, determinante, veloz",
    speciality: "IA para momentos decisivos, toma de decisiones bajo presión, clutch thinking",
    image: AVATAR_ZARAGOZA_HISTORICO.SENORIN,
    color: "#D97706",
      isRealPerson: false,
  },
  {
    id: "aguadin",
    name: "BARDELIN",
    role: "El Muro Defensivo",
    gender: "M",
    description: "Protege datos y sistemas como un muro defensivo con IA",
    personality: "Sólido, fiable, protector, implacable, leal",
    speciality: "Ciberseguridad con IA, protección de datos, defensa digital",
    image: AVATAR_ZARAGOZA_HISTORICO.AGUADIN,
    color: "#475569",
      isRealPerson: false,
  },
  {
    id: "villalin",
    name: "MAESTRALIN",
    role: "El Relámpago Letal",
    gender: "M",
    description: "Ejecuta prototipos rápidos con IA a velocidad de relámpago",
    personality: "Explosivo, veloz, letal, imparable, confiado",
    speciality: "Prototipado rápido con IA, MVPs veloces, ejecución explosiva",
    image: AVATAR_ZARAGOZA_HISTORICO.VILLALIN,
    color: "#EA580C",
      isRealPerson: false,
  },
  {
    id: "sorianin",
    name: "GALALIN",
    role: "El Creativo Elegante",
    gender: "M",
    description: "Crea con IA generativa combinando arte y precisión técnica",
    personality: "Elegante, creativo, técnico, artístico, inteligente",
    speciality: "IA generativa creativa, diseño con IA, visión artística computacional",
    image: AVATAR_ZARAGOZA_HISTORICO.SORIANIN,
    color: "#7C3AED",
      isRealPerson: false,
  },
];

// ─── FILTER TABS ───
const ALL_CHARS = [...FAMILIA_ORIGINAL, ...ESPECIALISTAS, ...URBANO, ...ARAGONESES, ...ZARAGOZA_HISTORICO];

const GROUPS = [
  { id: "todos", label: "Todos", count: ALL_CHARS.length },
  { id: "familia", label: "Familia Original", count: FAMILIA_ORIGINAL.length },
  { id: "especialistas", label: "Especialistas", count: ESPECIALISTAS.length },
  { id: "musicalin", label: "MUSICALIN", count: URBANO.length },
  { id: "aragoneses", label: "Aragonesa", count: ARAGONESES.length },
  { id: "zaragoza", label: "Zaragoza Histórico", count: ZARAGOZA_HISTORICO.length },
] as const;

// ─── CHARACTER CARD ───
/** Convert a Character to the CharacterData format expected by ArtistChatModal */
function charToArtist(char: Character): CharacterData {
  const key = getAvatarKeyForCharacterId(char.id);
  return {
    key,
    name: char.name,
    role: { es: char.role, en: char.role, zh: char.role },
    specialty: { es: char.speciality, en: char.speciality, zh: char.speciality },
    region: "LINCE",
    flag: "",
    color: char.color,
  };
}

function CharacterCard({ char, onClick, onChat, displayName, index = 0 }: { char: Character; onClick: () => void; onChat: () => void; displayName?: string; index?: number }) {
  return (
    <div
      className="group relative bg-[#111111] border border-white/5 rounded-2xl overflow-hidden hover:border-white/20 transition-all duration-300 hover:scale-[1.02] text-left w-full animate-[fadeInUp_0.4s_ease-out_both]"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <button onClick={onClick} className="w-full text-left">
        <div className="relative aspect-square overflow-hidden">
          <img
            src={char.image}
            alt={`Personaje educativo ${char.name}, especialista en ${char.speciality}`}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent" />
          <div className="absolute top-3 right-3">
            <span
              className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider"
              style={{ backgroundColor: `${char.color}30`, color: char.color, border: `1px solid ${char.color}50` }}
            >
              {char.gender === "F" ? "♀" : "♂"}
            </span>
          </div>
        </div>
        <div className="p-4 pb-2">
          {/* Specialty Badge */}
          <div className="mb-1.5">
            <span
              className="inline-block px-2 py-0.5 rounded-full text-[9px] font-bold tracking-wide bg-white/5 text-white/70 border border-white/10"
            >
              {getSpecialtyBadge(char.speciality)}
            </span>
          </div>
          <h3
            className="font-['Space_Grotesk'] font-bold text-lg leading-tight"
            style={{ color: char.color }}
          >
            {displayName || char.name}
          </h3>
          {displayName && displayName !== char.name && (
            <p className="text-white/30 text-[10px] font-medium">({char.name})</p>
          )}
          <p className="text-white/60 text-xs font-medium mt-0.5">{char.role}</p>
          {char.isRealPerson && (
            <FictionalDisclaimer variant="badge" realName={char.realPersonName} className="mt-1.5" />
          )}
          <p className="text-white/40 text-xs mt-2 line-clamp-2 leading-relaxed">{char.description}</p>
        </div>
      </button>
      <div className="px-4 pb-4">
        <button
          onClick={(e) => { e.stopPropagation(); onChat(); }}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all hover:brightness-110"
          style={{ backgroundColor: `${char.color}20`, color: char.color, border: `1px solid ${char.color}40` }}
          aria-label={`Chatear con ${char.name}`}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          Chatear
        </button>
      </div>
    </div>
  );
}

// ─── CHARACTER MODAL ───
function CharacterModal({ char, onClose, onChat, displayName }: { char: Character; onClose: () => void; onChat: () => void; displayName?: string }) {
  // BLOQUE 6: Keyboard accessibility - Escape to close
  const modalRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleKey);
    modalRef.current?.focus();
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);
  return (
    <div ref={modalRef} role="dialog" aria-modal="true" aria-label={`Detalles de ${char.name}`} tabIndex={-1} className="pt-14 fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <BackButton variant="inline" />
      <GlobalNavBar />
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
      <div
        className="relative bg-[#111111] border border-white/10 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
        >
          ✕
        </button>

        <div className="flex flex-col sm:flex-row">
          <div className="sm:w-2/5 aspect-square sm:aspect-auto sm:min-h-[400px] relative overflow-hidden rounded-t-2xl sm:rounded-l-2xl sm:rounded-tr-none">
            <img src={char.image} alt={`Personaje educativo ${char.name}, especialista en ${char.speciality}`} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-transparent to-transparent sm:bg-gradient-to-r" />
          </div>

          <div className="sm:w-3/5 p-6 sm:p-8">
            <div className="flex items-center gap-2 mb-1">
              <span
                className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider"
                style={{ backgroundColor: `${char.color}30`, color: char.color, border: `1px solid ${char.color}50` }}
              >
                {char.gender === "F" ? "Femenino" : "Masculino"}
              </span>
            </div>

            <h2
              className="font-['Space_Grotesk'] font-bold text-3xl mt-2"
              style={{ color: char.color }}
            >
              {displayName || char.name}
            </h2>
            {displayName && displayName !== char.name && (
              <p className="text-white/40 text-xs">Nombre original: {char.name}</p>
            )}
            <p className="text-white/60 text-sm font-medium mt-1">{char.role}</p>
            {/* Specialty Badge in Modal */}
            <div className="mt-2 flex flex-wrap gap-1.5">
              <span
                className="inline-block px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide"
                style={{ backgroundColor: `${char.color}15`, color: char.color, border: `1px solid ${char.color}30` }}
              >
                {getSpecialtyBadge(char.speciality)}
              </span>
            </div>
            {char.isRealPerson && (
              <FictionalDisclaimer variant="inline" realName={char.realPersonName} className="mt-2" />
            )}

            <div className="mt-6 space-y-4">
              <div>
                <h4 className="text-[#00E5FF] text-xs font-bold uppercase tracking-wider mb-1">Descripción</h4>
                <p className="text-white/70 text-sm leading-relaxed">{char.description}</p>
              </div>
              <div>
                <h4 className="text-[#D4A843] text-xs font-bold uppercase tracking-wider mb-1">Personalidad</h4>
                <p className="text-white/70 text-sm">{char.personality}</p>
              </div>
              <div>
                <h4 className="text-[#00E5FF] text-xs font-bold uppercase tracking-wider mb-1">Especialidad</h4>
                <p className="text-white/70 text-sm">{char.speciality}</p>
              </div>
            </div>

            {/* Chat Button */}
            <button
              onClick={onChat}
              className="mt-6 w-full flex items-center justify-center gap-2.5 px-5 py-3 rounded-xl text-sm font-bold transition-all hover:brightness-110 hover:scale-[1.02]"
              style={{ backgroundColor: `${char.color}25`, color: char.color, border: `1px solid ${char.color}50`, boxShadow: `0 0 20px ${char.color}15` }}
              aria-label={`Chatear con ${char.name}`}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
              Chatear con {displayName || char.name}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── MAIN PAGE ───
export default function Personajes() {
  const [activeGroup, setActiveGroup] = useState<string>("todos");
  const [selectedChar, setSelectedChar] = useState<Character | null>(null);
  const [chatChar, setChatChar] = useState<Character | null>(null);
  const { getAvatarName } = usePRDLanguage();
  const [location, navigate] = useLocation();

  // Open chat with a character (close detail modal first)
  const openChat = (char: Character) => {
    setSelectedChar(null);
    setChatChar(char);
  };

  // Switch to a different avatar from a referral button
  const handleSwitchAvatar = (avatarKey: string) => {
    const canonicalKey = toCanonicalAvatarKey(avatarKey);
    if (!canonicalKey) return;

    const targetId = getCharacterIdByAvatarKey(canonicalKey);
    if (!targetId) return;

    const targetChar = ALL_CHARS.find((c) => c.id === targetId);
    if (!targetChar) return;

    setChatChar(null);
    // Small delay to allow modal close animation
    setTimeout(() => setChatChar(targetChar), 150);
  };

  // Resolve display name for family characters based on country
  const getDisplayName = (char: Character): string => {
    const avatarKey = getAvatarKeyForCharacterId(char.id);
    if (avatarKey) return getAvatarName(avatarKey);
    return char.name;
  };

  useEffect(() => {
    if (!location.startsWith("/personajes")) return;

    const searchParams = new URLSearchParams(window.location.search);
    const referralParam = searchParams.get("ref");
    if (!referralParam) return;

    const clearReferralParam = () => {
      searchParams.delete("ref");
      const nextQuery = searchParams.toString();
      navigate(nextQuery ? "/personajes?" + nextQuery : "/personajes");
    };

    const canonicalReferralKey = toCanonicalAvatarKey(referralParam);
    if (!canonicalReferralKey) {
      clearReferralParam();
      return;
    }

    const targetId = getCharacterIdByAvatarKey(canonicalReferralKey);
    if (targetId) {
      const targetChar = ALL_CHARS.find((c) => c.id === targetId);
      if (targetChar) {
        setSelectedChar(null);
        setChatChar(targetChar);
      }
    }

    clearReferralParam();
  }, [location, navigate]);

  const getCharacters = () => {
    switch (activeGroup) {
      case "familia": return FAMILIA_ORIGINAL;
      case "especialistas": return ESPECIALISTAS;
      case "musicalin": return URBANO;
      case "aragoneses": return ARAGONESES;
      case "zaragoza": return ZARAGOZA_HISTORICO;
      default: return ALL_CHARS;
    }
  };

  const characters = getCharacters();

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#0A0A0A]/95 backdrop-blur-md border-b border-white/5">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <a href="/" className="flex items-center gap-1">
              
              <span className="font-['Space_Grotesk'] font-bold text-base text-[#00E5FF]">LINCE</span>
            </a>
            <span className="text-white/20">|</span>
            <h1 className="font-['Space_Grotesk'] font-semibold text-sm text-white/80">Personajes</h1>
          </div>
          <UserNavBadge />
        </div>
      </header>

      {/* Hero */}
      <section className="py-12 sm:py-20">
        <div className="container text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#00E5FF]/30 bg-[#00E5FF]/5 mb-6">
            <span className="w-2 h-2 rounded-full bg-[#00E5FF] animate-pulse" />
            <span className="text-[#00E5FF] text-xs font-medium">{ALL_CHARS.length} personajes. Todos con chat IA. Toca uno y empieza a aprender.</span>
          </div>
          <h2 className="font-['Space_Grotesk'] font-bold text-4xl sm:text-6xl text-white mb-4">
            Conoce a la <span className="text-[#00E5FF]">Familia</span>
          </h2>
          <p className="text-white/50 text-lg max-w-2xl mx-auto">
            Cada personaje LINCE tiene una personalidad única, una especialidad en IA y una forma de comunicar que conecta con diferentes audiencias. Descúbrelos todos.
          </p>
        </div>
      </section>

      {/* Filter Tabs */}
      <section className="sticky top-16 z-30 bg-[#0A0A0A]/95 backdrop-blur-md border-b border-white/5 py-3">
        <div className="container">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
            {GROUPS.map((g) => (
              <button
                key={g.id}
                onClick={() => setActiveGroup(g.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                  activeGroup === g.id
                    ? "bg-[#00E5FF] text-black font-bold"
                    : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white"
                }`}
              >
                {g.label}
                <span className={`ml-1.5 text-xs ${activeGroup === g.id ? "text-black/60" : "text-white/30"}`}>
                  {g.count}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Group Headers + Grid */}
      <section className="py-8 sm:py-12">
        <div className="container">
          {activeGroup === "todos" ? (
            <>
              {/* Familia Original */}
              <div className="mb-12">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-1 h-8 bg-[#00E5FF] rounded-full" />
                  <div>
                    <h3 className="font-['Space_Grotesk'] font-bold text-2xl text-white">Familia Original</h3>
                    <p className="text-white/40 text-sm">Los 10 personajes fundadores de LINCE</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {FAMILIA_ORIGINAL.map((c, i) => (
                    <CharacterCard key={c.id} char={c} index={i} onClick={() => setSelectedChar(c)} onChat={() => openChat(c)} displayName={getDisplayName(c)} />
                  ))}
                </div>
              </div>

              {/* Especialistas */}
              <div className="mb-12">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-1 h-8 bg-[#D4A843] rounded-full" />
                  <div>
                    <h3 className="font-['Space_Grotesk'] font-bold text-2xl text-white">Especialistas</h3>
                    <p className="text-white/40 text-sm">Expertos en ética, datos, derecho, salud, educación y más</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {ESPECIALISTAS.map((c, i) => (
                    <CharacterCard key={c.id} char={c} index={i} onClick={() => setSelectedChar(c)} onChat={() => openChat(c)} displayName={getDisplayName(c)} />
                  ))}
                </div>
              </div>

              {/* MUSICALIN */}
              <div className="mb-12">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-1 h-8 bg-[#FF6B35] rounded-full" />
                  <div>
                    <h3 className="font-['Space_Grotesk'] font-bold text-2xl text-white">MUSICALIN</h3>
                    <p className="text-white/40 text-sm">{URBANO.length} avatares cantantes ficticios — artistas musicales de todo el mundo</p>
                  </div>
                </div>
                <FictionalDisclaimer variant="banner" className="mb-4" />
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {URBANO.map((c, i) => (
                    <CharacterCard key={c.id} char={c} index={i} onClick={() => setSelectedChar(c)} onChat={() => openChat(c)} displayName={getDisplayName(c)} />
                  ))}
                </div>
              </div>

              {/* Aragoneses */}
              <div className="mb-12">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-1 h-8 bg-[#DC2626] rounded-full" />
                  <div>
                    <h3 className="font-['Space_Grotesk'] font-bold text-2xl text-white">Colección Aragonesa</h3>
                    <p className="text-white/40 text-sm">{ARAGONESES.length} personajes con el carácter maño</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {ARAGONESES.map((c, i) => (
                    <CharacterCard key={c.id} char={c} index={i} onClick={() => setSelectedChar(c)} onChat={() => openChat(c)} displayName={getDisplayName(c)} />
                  ))}
                </div>
              </div>

              {/* Zaragoza Histórico */}
              <div className="mb-12">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-1 h-8 bg-[#1E40AF] rounded-full" />
                  <div>
                    <h3 className="font-['Space_Grotesk'] font-bold text-2xl text-white">Zaragoza Histórico</h3>
                    <p className="text-white/40 text-sm">10 leyendas del Real Zaragoza — de Nayim a David Villa</p>
                  </div>
                </div>
                <FictionalDisclaimer variant="banner" className="mb-4" />
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {ZARAGOZA_HISTORICO.map((c, i) => (
                    <CharacterCard key={c.id} char={c} index={i} onClick={() => setSelectedChar(c)} onChat={() => openChat(c)} displayName={getDisplayName(c)} />
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {characters.map((c, i) => (
                <CharacterCard key={c.id} char={c} index={i} onClick={() => setSelectedChar(c)} onChat={() => openChat(c)} displayName={getDisplayName(c)} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Stats Footer */}
      <section className="py-8 border-t border-white/5">
        <div className="container">
          <div className="flex flex-wrap justify-center gap-6 sm:gap-12">
            <div className="text-center">
              <span className="font-['Space_Grotesk'] font-bold text-3xl text-[#00E5FF]">{ALL_CHARS.length}</span>
              <p className="text-white/40 text-xs mt-1">Personajes totales</p>
            </div>
            <div className="text-center">
              <span className="font-['Space_Grotesk'] font-bold text-3xl text-[#D4A843]">5</span>
              <p className="text-white/40 text-xs mt-1">Colecciones</p>
            </div>
            <div className="text-center">
              <span className="font-['Space_Grotesk'] font-bold text-3xl text-[#EC4899]">
                {ALL_CHARS.filter(c => c.gender === "F").length}
              </span>
              <p className="text-white/40 text-xs mt-1">Personajes femeninos</p>
            </div>
            <div className="text-center">
              <span className="font-['Space_Grotesk'] font-bold text-3xl text-[#3B82F6]">
                {ALL_CHARS.filter(c => c.gender === "M").length}
              </span>
              <p className="text-white/40 text-xs mt-1">Personajes masculinos</p>
            </div>
          </div>
        </div>
      </section>

      {/* Back to Home */}
      <section className="py-8 pb-16">
        <div className="container text-center">
          <a
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#00E5FF]/10 border border-[#00E5FF]/30 rounded-xl text-[#00E5FF] font-medium hover:bg-[#00E5FF]/20 transition-all"
          >
            ← Volver al inicio
          </a>
        </div>
      </section>

      {/* Detail Modal */}
      {selectedChar && <CharacterModal char={selectedChar} onClose={() => setSelectedChar(null)} onChat={() => openChat(selectedChar)} displayName={getDisplayName(selectedChar)} />}

      {/* Chat Modal */}
      {chatChar && (
        <ArtistChatModal
          artist={charToArtist(chatChar)}
          lang="es"
          onClose={() => setChatChar(null)}
          onSwitchAvatar={handleSwitchAvatar}
        />
      )}
    </div>
  );
}

import { useState, useMemo } from "react";
import { useRoute } from "wouter";
import {
  ArrowLeft,
  ArrowRight,
  ExternalLink,
  Zap,
  CheckCircle,
  Lightbulb,
  Star,
  BookOpen,
  ChevronRight,
  MessageSquare,
  Image,
  Video,
  Music,
  Code,
  FileText,
  Brain,
  Briefcase,
  Palette,
} from "lucide-react";
import { AVATAR_FRONTAL, AVATAR_EXPRESSIONS } from "@/lib/avatarConstants";
import { useGameLang } from "@/hooks/useGameLang";
import { UserNavBadge } from "@/components/UserNavBadge";
import { GlobalNavBar } from "@/components/GlobalNavBar";
import { BackButton } from "@/components/BackButton";

// ─── Tool type ───
interface ToolGuide {
  steps: { title: string; desc: string; tip?: string }[];
  avatarKey: string;
  avatarQuote: string;
  useCases: string[];
  proTips: string[];
  difficulty: "Principiante" | "Intermedio" | "Avanzado";
  timeToLearn: string;
}

interface Tool {
  id: string;
  name: string;
  category: string;
  url: string;
  desc: string;
  featured?: boolean;
  free: boolean;
  screenshot?: string;
  guide: ToolGuide;
}

// CDN screenshots for tools
const TOOL_SCREENSHOTS: Record<string, string> = {
  chatgpt: "https://files.manuscdn.com/user_upload_by_module/session_file/310419663032363896/YFBZOJkVssudUALq.jpg",
  midjourney: "https://files.manuscdn.com/user_upload_by_module/session_file/310419663032363896/jGkhSwiIQCaLNxdr.jpg",
  gemini: "https://files.manuscdn.com/user_upload_by_module/session_file/310419663032363896/kwjBnngUaGANOqxW.jpg",
  dalle: "https://files.manuscdn.com/user_upload_by_module/session_file/310419663032363896/aOPMZSLgiFQWDwMn.png",
  "canva-ia": "https://files.manuscdn.com/user_upload_by_module/session_file/310419663032363896/CJjdrLluXiatQmeZ.png",
  runway: "https://files.manuscdn.com/user_upload_by_module/session_file/310419663032363896/RPCDFxqmrfWTozSp.png",
  suno: "https://files.manuscdn.com/user_upload_by_module/session_file/310419663032363896/VSlsCtuAdcOwWFmI.jpg",
  kling: "https://files.manuscdn.com/user_upload_by_module/session_file/310419663032363896/JLdknqDeXZLhXGAW.jpg",
};

// ─── Category meta ───
const CATEGORY_META: Record<string, { label: string; icon: string; color: string }> = {
  chat: { label: "Chat IA", icon: "💬", color: "#00E5FF" },
  imagen: { label: "Imagen", icon: "🎨", color: "#D4A843" },
  video: { label: "Video", icon: "🎬", color: "#FF5252" },
  audio: { label: "Audio", icon: "🎵", color: "#9C27B0" },
  codigo: { label: "Código", icon: "💻", color: "#00C853" },
  texto: { label: "Texto", icon: "📝", color: "#2196F3" },
  productividad: { label: "Productividad", icon: "⚡", color: "#FF9800" },
  diseno: { label: "Diseño", icon: "🎯", color: "#E91E63" },
  investigacion: { label: "Investigación", icon: "🔬", color: "#00BCD4" },
};

// ─── TOOLS WITH GUIDES ───
const TOOLS_WITH_GUIDES: Tool[] = [
  // ── Chat IA ──
  {
    id: "chatgpt", name: "ChatGPT", category: "chat", url: "https://chatgpt.com",
    desc: "IA conversacional de OpenAI. GPT-5.x, imágenes, voz y agentes.", featured: true, free: true,
    guide: {
      steps: [
        { title: "Crear cuenta en OpenAI", desc: "Ve a chatgpt.com y regístrate con email o Google. La versión gratuita incluye GPT-5 con límites de uso.", tip: "Usa un email profesional para mejor organización." },
        { title: "Escribir tu primer prompt", desc: "En el campo de texto, escribe una instrucción clara. Ejemplo: 'Explícame qué es machine learning como si tuviera 10 años'.", tip: "Sé específico: en vez de 'háblame de IA', di 'compara 3 tipos de redes neuronales con ejemplos prácticos'." },
        { title: "Usar GPTs personalizados", desc: "Explora la tienda de GPTs para encontrar asistentes especializados en marketing, código, educación, etc.", tip: "Puedes crear tu propio GPT con instrucciones personalizadas." },
        { title: "Subir archivos y analizar", desc: "Arrastra PDFs, imágenes o CSVs al chat. GPT-5 puede analizar documentos, extraer datos y crear resúmenes.", tip: "Para análisis de datos, sube un CSV y pide 'analiza tendencias y crea un gráfico'." },
        { title: "Generar imágenes con ChatGPT Images", desc: "Escribe 'genera una imagen de...' y ChatGPT usará su generador nativo (GPT Image), que sustituyó a DALL-E en 2026.", tip: "Añade detalles de estilo: 'en estilo acuarela', 'fotorrealista', 'pixel art'. También edita fotos que subas." },
      ],
      avatarKey: "SABELIN", avatarQuote: "ChatGPT es como tener un asistente que nunca duerme. La clave está en saber preguntar bien.",
      useCases: ["Redacción de emails profesionales", "Análisis de documentos y datos", "Generación de código", "Brainstorming de ideas", "Traducción y corrección de textos"],
      proTips: ["Usa 'Custom Instructions' para que recuerde tu contexto profesional", "Crea hilos separados por proyecto para mantener contexto", "Pide que actúe como un rol específico: 'Eres un experto en marketing digital con 15 años de experiencia'"],
      difficulty: "Principiante", timeToLearn: "15 min",
    },
  },
  {
    id: "claude", name: "Claude", category: "chat", url: "https://claude.ai",
    desc: "IA de Anthropic. Razonamiento avanzado, análisis de documentos largos.", featured: true, free: true,
    guide: {
      steps: [
        { title: "Registrarse en Claude", desc: "Ve a claude.ai y crea una cuenta. La versión gratuita incluye Claude Sonnet 5 con límites diarios.", tip: "Claude es especialmente bueno para análisis largo, razonamiento complejo y programación." },
        { title: "Subir documentos largos", desc: "Claude puede procesar hasta 1M tokens (~750.000 palabras). Sube PDFs, contratos o manuales completos.", tip: "Pide 'resume los puntos clave' o 'encuentra inconsistencias en este contrato'." },
        { title: "Usar Projects", desc: "Crea un Project para agrupar conversaciones y documentos relacionados. Claude mantiene el contexto entre chats.", tip: "Ideal para proyectos de investigación o desarrollo de producto." },
        { title: "Razonamiento paso a paso", desc: "Pide a Claude que 'piense paso a paso'. Activa el razonamiento extendido para problemas complejos.", tip: "Para matemáticas o lógica, di 'resuelve esto paso a paso mostrando tu razonamiento'." },
      ],
      avatarKey: "MAMALINA", avatarQuote: "Claude es mi favorito para documentos largos. Puede leer un libro entero y encontrar exactamente lo que necesitas.",
      useCases: ["Análisis de contratos legales", "Investigación académica", "Escritura creativa", "Debugging de código complejo", "Resumen de documentos extensos"],
      proTips: ["Usa Artifacts para que genere código, documentos o visualizaciones interactivas", "Claude es más conservador que ChatGPT — ideal para contenido que necesita precisión", "Pide que cite las partes específicas del documento que usa para sus respuestas"],
      difficulty: "Principiante", timeToLearn: "10 min",
    },
  },
  {
    id: "gemini", name: "Gemini", category: "chat", url: "https://gemini.google.com",
    desc: "IA de Google. Multimodal, integración con Google Workspace.", featured: true, free: true,
    guide: {
      steps: [
        { title: "Acceder con tu cuenta Google", desc: "Ve a gemini.google.com. Si tienes Gmail, ya tienes acceso automático.", tip: "Gemini se integra con todo el ecosistema Google." },
        { title: "Usar Gemini en Gmail y Docs", desc: "Activa 'Gemini para Workspace' para tener IA dentro de Gmail, Docs, Sheets y Slides.", tip: "En Gmail, usa 'Ayúdame a escribir' para generar respuestas profesionales." },
        { title: "Búsqueda con IA", desc: "Gemini tiene acceso a búsqueda de Google en tiempo real. Pide información actualizada.", tip: "Ideal para investigación de mercado y noticias recientes." },
        { title: "Análisis multimodal", desc: "Sube imágenes, videos o audio. Gemini puede analizar contenido visual y auditivo.", tip: "Sube una foto de una pizarra y pide que transcriba y organice las notas." },
      ],
      avatarKey: "PAPALIN", avatarQuote: "Si ya usas Google para todo, Gemini es tu mejor aliado. Se integra con Gmail, Docs y todo el ecosistema.",
      useCases: ["Redacción de emails en Gmail", "Análisis de hojas de cálculo", "Creación de presentaciones", "Búsqueda de información actualizada", "Análisis de imágenes y videos"],
      proTips: ["Google AI Pro ($19.99/mes) incluye Gemini 3.x Pro, Veo, Nano Banana Pro, NotebookLM ampliado y 2TB", "Usa Gemini en Google Sheets para fórmulas complejas y análisis de datos", "Pide que genere código Apps Script para automatizar tareas en Google Workspace"],
      difficulty: "Principiante", timeToLearn: "10 min",
    },
  },
  {
    id: "perplexity", name: "Perplexity", category: "chat", url: "https://perplexity.ai",
    desc: "IA de búsqueda con fuentes verificadas. Ideal para investigación.", featured: true, free: true,
    guide: {
      steps: [
        { title: "Hacer tu primera búsqueda", desc: "Escribe una pregunta como en Google, pero recibirás una respuesta completa con fuentes citadas.", tip: "Perplexity siempre cita sus fuentes — puedes verificar cada afirmación." },
        { title: "Usar Focus modes", desc: "Selecciona el modo de búsqueda: Academic (papers), Writing (redacción), Math (cálculos), etc.", tip: "El modo Academic busca directamente en bases de datos científicas." },
        { title: "Crear Collections", desc: "Agrupa búsquedas relacionadas en Collections para proyectos de investigación.", tip: "Comparte Collections con tu equipo para investigación colaborativa." },
        { title: "Preguntas de seguimiento", desc: "Después de cada respuesta, Perplexity sugiere preguntas relacionadas para profundizar.", tip: "Usa las preguntas sugeridas para explorar un tema de forma exhaustiva." },
      ],
      avatarKey: "SABELIN", avatarQuote: "Perplexity es el Google del futuro. Cada respuesta viene con sus fuentes, así que puedes confiar en lo que dice.",
      useCases: ["Investigación de mercado con fuentes", "Verificación de datos y fact-checking", "Investigación académica", "Análisis competitivo", "Búsqueda de estadísticas actualizadas"],
      proTips: ["Pro Search hace múltiples búsquedas y sintetiza la información", "Usa el modo 'Copilot' para que haga preguntas clarificadoras antes de buscar", "Exporta las respuestas con fuentes para incluir en informes"],
      difficulty: "Principiante", timeToLearn: "5 min",
    },
  },
  // ── Imagen ──
  {
    id: "midjourney", name: "Midjourney", category: "imagen", url: "https://midjourney.com",
    desc: "Generación de imágenes artísticas de alta calidad. Líder en estética.", featured: true, free: false,
    guide: {
      steps: [
        { title: "Unirse al servidor Discord", desc: "Midjourney funciona a través de Discord. Únete al servidor oficial o usa la web en midjourney.com.", tip: "La versión web es más intuitiva que Discord para principiantes." },
        { title: "Escribir tu primer prompt", desc: "Usa /imagine seguido de tu descripción. Ejemplo: '/imagine a futuristic city at sunset, cyberpunk style'.", tip: "En inglés genera mejores resultados que en español." },
        { title: "Usar parámetros avanzados", desc: "Añade --ar 16:9 para aspecto, --v 8 para la versión actual, --style raw para menos estilización.", tip: "--chaos 50 genera variaciones más creativas e inesperadas." },
        { title: "Refinar con Vary y Upscale", desc: "Después de generar, usa los botones U1-U4 para ampliar y V1-V4 para crear variaciones.", tip: "Usa 'Vary (Subtle)' para cambios pequeños y 'Vary (Strong)' para cambios grandes." },
        { title: "Crear con imagen de referencia", desc: "Sube una imagen y Midjourney la usará como referencia de estilo o composición.", tip: "Combina --iw 2 para dar más peso a la imagen de referencia." },
      ],
      avatarKey: "PEQUELINA", avatarQuote: "¡Midjourney hace las imágenes más bonitas! Es como tener un artista mágico que dibuja lo que le pidas.",
      useCases: ["Arte conceptual y ilustraciones", "Diseño de personajes", "Fondos y escenarios", "Contenido para redes sociales", "Mockups de productos"],
      proTips: ["Usa 'describe' con una imagen para obtener prompts que la reproduzcan", "Combina estilos: 'watercolor painting in the style of Studio Ghibli'", "Para logos, añade 'simple, flat design, vector, white background'"],
      difficulty: "Intermedio", timeToLearn: "30 min",
    },
  },
  {
    id: "canva-ia", name: "Canva IA", category: "imagen", url: "https://canva.com",
    desc: "Diseño gráfico con IA integrada. Templates, presentaciones, social media.", featured: true, free: true,
    guide: {
      steps: [
        { title: "Crear cuenta gratuita", desc: "Regístrate en canva.com. La versión gratuita incluye miles de templates y herramientas de IA.", tip: "Canva Pro tiene más funciones de IA pero la versión gratuita es muy completa." },
        { title: "Elegir un template", desc: "Busca templates por tipo: Instagram post, presentación, CV, flyer, etc. Personaliza colores y textos.", tip: "Usa 'Brand Kit' para mantener consistencia en todos tus diseños." },
        { title: "Usar Magic Design", desc: "Sube una imagen o describe lo que necesitas y Canva genera diseños automáticamente.", tip: "Magic Design funciona mejor con descripciones específicas del propósito." },
        { title: "Generar imágenes con IA", desc: "Usa 'Text to Image' para generar imágenes directamente dentro de tus diseños.", tip: "Selecciona el estilo (foto, dibujo, 3D) antes de generar." },
        { title: "Editar con Magic Eraser", desc: "Elimina objetos no deseados de fotos con un clic. También usa Magic Edit para reemplazar elementos.", tip: "Magic Expand amplía los bordes de una imagen con IA." },
      ],
      avatarKey: "CHAVALINA", avatarQuote: "Canva es perfecto para crear contenido visual sin ser diseñador. ¡Yo hago todos mis posts de Instagram aquí!",
      useCases: ["Posts para redes sociales", "Presentaciones profesionales", "Diseño de CVs y portfolios", "Flyers y material de marketing", "Edición rápida de fotos"],
      proTips: ["Usa 'Resize' para adaptar un diseño a múltiples formatos de golpe", "Los 'Brand Kits' guardan tus colores, fuentes y logos para consistencia", "Canva Docs permite crear documentos con diseño profesional"],
      difficulty: "Principiante", timeToLearn: "15 min",
    },
  },
  // ── Video ──
  {
    id: "runway", name: "Runway", category: "video", url: "https://runway.com",
    desc: "Suite de video IA. Generación, edición, efectos. Gen-4.5.", featured: true, free: true,
    guide: {
      steps: [
        { title: "Crear cuenta en Runway", desc: "Regístrate en runway.com. Recibes 125 créditos gratuitos para empezar.", tip: "Gen-4.5, el modelo más potente, requiere el plan Standard ($12/mes anual)." },
        { title: "Generar video desde texto", desc: "Usa Gen-4.5: describe la escena y Runway genera un clip de 5-10 segundos.", tip: "Sé muy descriptivo: 'cámara lenta, un gato caminando por un tejado al atardecer, cinematográfico'." },
        { title: "Imagen a video", desc: "Sube una imagen estática y Runway la anima. Ideal para dar vida a ilustraciones.", tip: "Las imágenes con composición clara generan mejores animaciones." },
        { title: "Eliminar fondos de video", desc: "Green Screen IA elimina el fondo de cualquier video sin necesidad de pantalla verde.", tip: "Funciona mejor con sujetos bien definidos y buena iluminación." },
      ],
      avatarKey: "CHAVALIN", avatarQuote: "Runway es el futuro del video. Puedes crear clips cinematográficos solo con texto. ¡Es alucinante!",
      useCases: ["Clips para redes sociales", "Animación de ilustraciones", "Efectos visuales", "Eliminación de fondos", "Prototipos de video"],
      proTips: ["Usa 'Motion Brush' para controlar qué partes de la imagen se mueven", "Combina varios clips generados para crear videos más largos", "Exporta en alta resolución para uso profesional"],
      difficulty: "Intermedio", timeToLearn: "20 min",
    },
  },
  // ── Audio ──
  {
    id: "elevenlabs", name: "ElevenLabs", category: "audio", url: "https://elevenlabs.io",
    desc: "Clonación de voz y text-to-speech ultra realista. Multilingüe.", featured: true, free: true,
    guide: {
      steps: [
        { title: "Crear cuenta", desc: "Regístrate en elevenlabs.io. La versión gratuita incluye 10.000 caracteres/mes.", tip: "Suficiente para probar varias voces y generar audios cortos." },
        { title: "Elegir una voz", desc: "Explora la biblioteca de voces. Filtra por idioma, género, tono (profesional, cálido, enérgico).", tip: "Prueba varias voces antes de elegir — cada una tiene personalidad distinta." },
        { title: "Generar tu primer audio", desc: "Pega tu texto, selecciona la voz y ajusta estabilidad y claridad. Haz clic en 'Generate'.", tip: "Estabilidad alta = voz más consistente. Baja = más expresiva y emocional." },
        { title: "Clonar tu propia voz", desc: "Sube 1-5 minutos de audio de tu voz. ElevenLabs crea un clon que habla como tú.", tip: "Graba en un lugar silencioso, hablando de forma natural y variada." },
      ],
      avatarKey: "YAYALIN", avatarQuote: "ElevenLabs puede hacer que tu voz hable en 29 idiomas. En mi época, eso era ciencia ficción.",
      useCases: ["Narración de videos y podcasts", "Audiolibros", "Asistentes de voz personalizados", "Doblaje multilingüe", "Accesibilidad (lectura de textos)"],
      proTips: ["Usa SSML tags para controlar pausas y énfasis", "El modo 'Projects' permite narrar documentos largos con múltiples voces", "Combina con Suno para crear podcasts con música de fondo"],
      difficulty: "Principiante", timeToLearn: "10 min",
    },
  },
  {
    id: "suno", name: "Suno", category: "audio", url: "https://suno.com",
    desc: "Generación de música completa con IA. Letra, melodía, producción.", featured: true, free: true,
    guide: {
      steps: [
        { title: "Acceder a Suno", desc: "Ve a suno.com y crea una cuenta. Recibes 50 créditos diarios gratuitos (10 canciones, sin uso comercial).", tip: "Cada canción usa 5 créditos. Pro ($10/mes) desbloquea el modelo v5.5 y las descargas comerciales." },
        { title: "Describir tu canción", desc: "Escribe una descripción: 'canción pop alegre sobre aprender IA, en español, ritmo pegadizo'.", tip: "Incluye género, idioma, mood y tema para mejores resultados." },
        { title: "Modo Custom", desc: "Escribe tus propias letras y elige el estilo musical. Más control sobre el resultado.", tip: "Usa [Verse], [Chorus], [Bridge] para estructurar la canción." },
        { title: "Extender y mezclar", desc: "Extiende canciones que te gusten, cambia secciones o mezcla estilos.", tip: "Usa 'Continue From' para añadir más versos a una canción existente." },
      ],
      avatarKey: "PEQUELIN", avatarQuote: "¡Suno es increíble! Puedo crear canciones sobre lo que quiera. ¡Hice una canción sobre mi gato!",
      useCases: ["Jingles para marketing", "Música de fondo para videos", "Canciones educativas", "Prototipos musicales", "Entretenimiento y creatividad"],
      proTips: ["Combina géneros: 'jazz hip-hop fusion' genera resultados únicos", "Usa 'instrumental' si solo necesitas música sin letra", "Descarga en MP3 para usar en tus proyectos"],
      difficulty: "Principiante", timeToLearn: "5 min",
    },
  },
  // ── Código ──
  {
    id: "github-copilot", name: "GitHub Copilot", category: "codigo", url: "https://github.com/features/copilot",
    desc: "Asistente de código IA. Autocompletado, chat, agente y revisión de código.", featured: true, free: true,
    guide: {
      steps: [
        { title: "Activar Copilot", desc: "Activa el plan Free en github.com/features/copilot e instala la extensión en VS Code. Pro cuesta $10/mes.", tip: "Estudiantes y contribuidores open-source tienen Pro gratis." },
        { title: "Autocompletado inteligente", desc: "Empieza a escribir código y Copilot sugiere líneas completas. Tab para aceptar.", tip: "Escribe un comentario describiendo lo que quieres y Copilot genera el código." },
        { title: "Chat con Copilot", desc: "Abre el panel de chat (Ctrl+I) y pregunta sobre tu código. Puede explicar, refactorizar o debuggear.", tip: "Selecciona código y pregunta 'explica este código' o 'optimiza esto'." },
        { title: "Generar tests", desc: "Selecciona una función y pide 'genera tests unitarios para esta función'.", tip: "Copilot genera tests con buena cobertura de edge cases." },
      ],
      avatarKey: "SABELIN", avatarQuote: "Copilot es como pair programming con un experto 24/7. No reemplaza saber programar, pero multiplica tu velocidad.",
      useCases: ["Autocompletado de código", "Generación de tests", "Documentación automática", "Refactorización", "Aprendizaje de nuevos lenguajes"],
      proTips: ["Escribe comentarios claros antes del código — Copilot los usa como contexto", "Usa /fix para que corrija errores automáticamente", "El agente de Copilot puede implementar issues completos de GitHub y abrir el PR por ti"],
      difficulty: "Intermedio", timeToLearn: "15 min",
    },
  },
  {
    id: "cursor", name: "Cursor", category: "codigo", url: "https://cursor.com",
    desc: "Editor de código con IA integrada. Agentes en paralelo y Composer.", featured: true, free: true,
    guide: {
      steps: [
        { title: "Descargar Cursor", desc: "Ve a cursor.com y descarga el editor. Es un fork de VS Code — todas tus extensiones funcionan. El plan Hobby es gratis; Pro cuesta $20/mes.", tip: "Importa tu configuración de VS Code automáticamente." },
        { title: "Chat contextual (Ctrl+L)", desc: "Abre el chat y pregunta sobre tu proyecto. Cursor entiende todo tu codebase.", tip: "Cursor indexa tu proyecto completo — puede responder sobre cualquier archivo." },
        { title: "Edición inline (Ctrl+K)", desc: "Selecciona código y describe el cambio. Cursor modifica el código directamente.", tip: "Di 'añade manejo de errores' o 'convierte a TypeScript' y lo hace in-place." },
        { title: "Agente (Ctrl+Shift+I)", desc: "Describe una feature completa y el agente de Cursor genera/modifica múltiples archivos, ejecuta comandos y tests.", tip: "Puedes lanzar varios agentes en paralelo o en segundo plano para tareas largas." },
      ],
      avatarKey: "CHAVALIN", avatarQuote: "Cursor es VS Code con superpoderes. El Composer puede implementar features enteras en segundos.",
      useCases: ["Desarrollo full-stack", "Refactorización de proyectos", "Aprendizaje de código existente", "Debugging avanzado", "Prototipado rápido"],
      proTips: ["Añade un archivo .cursorrules con instrucciones sobre tu proyecto", "Usa @file para referenciar archivos específicos en el chat", "Cursor puede leer documentación web si le das una URL"],
      difficulty: "Intermedio", timeToLearn: "20 min",
    },
  },
  // ── Texto ──
  {
    id: "gamma", name: "Gamma", category: "texto", url: "https://gamma.app",
    desc: "Presentaciones y documentos con IA. Diseño automático profesional.", featured: true, free: true,
    guide: {
      steps: [
        { title: "Crear cuenta en Gamma", desc: "Regístrate en gamma.app. Recibes créditos gratuitos para crear presentaciones.", tip: "Gamma genera presentaciones completas en segundos." },
        { title: "Describir tu presentación", desc: "Escribe el tema y Gamma genera un outline. Ajusta los puntos antes de generar.", tip: "Sé específico: 'Presentación de 10 slides sobre IA en educación para inversores'." },
        { title: "Personalizar diseño", desc: "Elige un tema visual, cambia colores, fuentes y layout de cada slide.", tip: "Gamma adapta el diseño al contenido — no necesitas mover elementos manualmente." },
        { title: "Exportar y compartir", desc: "Exporta como PDF, PPT o comparte un link interactivo.", tip: "El link interactivo incluye analytics de quién vio tu presentación." },
      ],
      avatarKey: "YAYALINA", avatarQuote: "Gamma me ayudó a crear mi primera presentación digital. ¡Y quedó más bonita que las de mis nietos!",
      useCases: ["Presentaciones de negocio", "Pitch decks para inversores", "Material educativo", "Informes visuales", "Documentos interactivos"],
      proTips: ["Pega texto largo y Gamma lo convierte en slides automáticamente", "Usa 'Restyle' para cambiar el diseño completo sin perder contenido", "Integra videos, GIFs y embeds directamente en las slides"],
      difficulty: "Principiante", timeToLearn: "10 min",
    },
  },
  // ── Productividad ──
  {
    id: "zapier", name: "Zapier AI", category: "productividad", url: "https://zapier.com",
    desc: "Automatización de workflows con IA. Conecta 6000+ apps.", featured: true, free: true,
    guide: {
      steps: [
        { title: "Crear cuenta en Zapier", desc: "Regístrate en zapier.com. El plan gratuito incluye 100 tareas/mes.", tip: "100 tareas gratuitas son suficientes para automatizar procesos básicos." },
        { title: "Crear tu primer Zap", desc: "Un Zap conecta un trigger (evento) con una acción. Ejemplo: 'Cuando recibo un email → guardar en Google Sheets'.", tip: "Empieza con automatizaciones simples de 2 pasos." },
        { title: "Usar IA en los Zaps", desc: "Añade el paso 'AI by Zapier' para procesar texto con IA dentro de tus automatizaciones.", tip: "Usa IA para clasificar emails, resumir textos o generar respuestas automáticas." },
        { title: "Chatbots y Interfaces", desc: "Crea chatbots e interfaces sin código que se conectan a tus Zaps.", tip: "Ideal para formularios inteligentes que procesan datos automáticamente." },
      ],
      avatarKey: "PAPALIN", avatarQuote: "Zapier automatiza las tareas repetitivas. Yo lo uso para que mis emails se organicen solos.",
      useCases: ["Automatización de email marketing", "Sincronización entre apps", "Procesamiento automático de formularios", "Notificaciones inteligentes", "Flujos de aprobación"],
      proTips: ["Usa 'Paths' para crear lógica condicional en tus automatizaciones", "Zapier Tables funciona como una base de datos simple sin código", "Combina múltiples Zaps para crear workflows complejos"],
      difficulty: "Intermedio", timeToLearn: "25 min",
    },
  },
  // ── Diseño ──
  {
    id: "figma", name: "Figma AI", category: "diseno", url: "https://figma.com",
    desc: "Diseño colaborativo con IA. Figma Make, componentes, auto-layout.", featured: true, free: true,
    guide: {
      steps: [
        { title: "Crear cuenta en Figma", desc: "Regístrate en figma.com. El plan Starter gratuito incluye 3 archivos de diseño con colaboración y créditos de IA.", tip: "Figma funciona en el navegador — no necesitas instalar nada." },
        { title: "Aprender Auto Layout", desc: "Auto Layout es la base de Figma. Permite crear diseños responsivos que se adaptan al contenido.", tip: "Piensa en Auto Layout como flexbox de CSS — es el mismo concepto." },
        { title: "Usar componentes", desc: "Crea componentes reutilizables con variantes. Cambia propiedades sin duplicar diseños.", tip: "Los componentes con variantes ahorran horas de trabajo repetitivo." },
        { title: "Figma Make", desc: "Describe una app o convierte un frame en prototipo funcional con Figma Make, incluido en los asientos Full de pago.", tip: "Cada asiento tiene créditos de IA mensuales; Figma Make es lo que más consume." },
      ],
      avatarKey: "ATOLONDRALIN", avatarQuote: "Figma es donde los diseñadores profesionales trabajan. ¡Yo lo uso para diseñar... bueno, intento diseñar!",
      useCases: ["Diseño de interfaces (UI)", "Prototipos interactivos", "Sistemas de diseño", "Colaboración en tiempo real", "Handoff a desarrolladores"],
      proTips: ["Usa Dev Mode para que los desarrolladores vean CSS, medidas y assets", "Los plugins de la comunidad añaden superpoderes: iconos, fotos, IA", "Figma Slides es una alternativa a PowerPoint con diseño profesional"],
      difficulty: "Intermedio", timeToLearn: "45 min",
    },
  },
  // ── Investigación ──
  {
    id: "notebooklm", name: "NotebookLM", category: "investigacion", url: "https://notebooklm.google.com",
    desc: "IA de Google para investigación. Sube documentos, genera podcasts.", featured: true, free: true,
    guide: {
      steps: [
        { title: "Crear un notebook", desc: "Ve a notebooklm.google.com y crea un nuevo notebook. Sube PDFs, docs o pega URLs.", tip: "Puedes subir hasta 50 fuentes por notebook." },
        { title: "Hacer preguntas", desc: "Pregunta sobre tus documentos y NotebookLM responde citando las fuentes exactas.", tip: "Cada respuesta incluye citas clickeables que te llevan al párrafo original." },
        { title: "Generar resúmenes", desc: "Pide resúmenes, FAQs, guías de estudio o briefings a partir de tus documentos.", tip: "Ideal para preparar exámenes o resumir investigaciones largas." },
        { title: "Crear Audio o Video Overview", desc: "NotebookLM genera un podcast (o un vídeo explicativo) donde dos 'presentadores IA' discuten tus documentos.", tip: "Google AI Pro amplía a 300 fuentes por notebook y 5× la cuota de uso." },
      ],
      avatarKey: "YAYALINA", avatarQuote: "NotebookLM convierte documentos aburridos en podcasts entretenidos. ¡Hasta yo puedo escuchar investigaciones mientras cocino!",
      useCases: ["Investigación académica", "Preparación de exámenes", "Análisis de documentos legales", "Resumen de informes", "Creación de podcasts educativos"],
      proTips: ["Sube múltiples fuentes sobre el mismo tema para análisis cruzado", "El Audio Overview es perfecto para aprender mientras haces otras cosas", "Usa NotebookLM para preparar presentaciones basadas en datos"],
      difficulty: "Principiante", timeToLearn: "10 min",
    },
  },
];

// ─── Translations ───
const TRANSLATIONS: Record<string, Record<string, string>> = {
  es: {
    backToArsenal: "Volver al Arsenal",
    stepByStep: "Guía Paso a Paso",
    step: "Paso",
    tip: "Consejo",
    useCases: "Casos de Uso",
    proTips: "Tips de Experto",
    openTool: "Abrir Herramienta",
    difficulty: "Dificultad",
    timeToLearn: "Tiempo de aprendizaje",
    free: "Gratis",
    premium: "Premium",
    prev: "Anterior",
    next: "Siguiente",
    toolNotFound: "Herramienta no encontrada",
    goBack: "Volver a Herramientas IA",
    avatarSays: "dice:",
    screenshot: "Interfaz de la herramienta",
    screenshotCaption: "Captura real de la interfaz de",
  },
  en: {
    backToArsenal: "Back to Arsenal",
    stepByStep: "Step-by-Step Guide",
    step: "Step",
    tip: "Tip",
    useCases: "Use Cases",
    proTips: "Expert Tips",
    openTool: "Open Tool",
    difficulty: "Difficulty",
    timeToLearn: "Learning time",
    free: "Free",
    premium: "Premium",
    prev: "Previous",
    next: "Next",
    toolNotFound: "Tool not found",
    goBack: "Back to AI Arsenal",
    avatarSays: "says:",
    screenshot: "Tool Interface",
    screenshotCaption: "Real screenshot of",
  },
  zh: {
    backToArsenal: "返回武器库",
    stepByStep: "分步指南",
    step: "步骤",
    tip: "提示",
    useCases: "使用场景",
    proTips: "专家技巧",
    openTool: "打开工具",
    difficulty: "难度",
    timeToLearn: "学习时间",
    free: "免费",
    premium: "付费",
    prev: "上一个",
    next: "下一个",
    toolNotFound: "未找到工具",
    goBack: "返回AI武器库",
    avatarSays: "说：",
    screenshot: "工具界面",
    screenshotCaption: "实际截图",
  },
};

export default function ArsenalIADetail() {
  const [, params] = useRoute("/arsenal-ia/:toolId");
  const toolId = params?.toolId || "";
  const { lang } = useGameLang();
  const tr = TRANSLATIONS[lang] || TRANSLATIONS.es;

  const [activeStep, setActiveStep] = useState(0);

  const tool = useMemo(() => TOOLS_WITH_GUIDES.find((t) => t.id === toolId), [toolId]);

  const toolIndex = useMemo(() => TOOLS_WITH_GUIDES.findIndex((t) => t.id === toolId), [toolId]);
  const prevTool = toolIndex > 0 ? TOOLS_WITH_GUIDES[toolIndex - 1] : null;
  const nextTool = toolIndex < TOOLS_WITH_GUIDES.length - 1 ? TOOLS_WITH_GUIDES[toolIndex + 1] : null;

  const catMeta = tool ? CATEGORY_META[tool.category] || { label: tool.category, icon: "🔧", color: "#00E5FF" } : null;

  if (!tool) {
    return (
      <div className="pt-14 bg-[#0A0A0A] min-h-screen flex items-center justify-center">
      <BackButton variant="inline" fallbackPath="/arsenal-ia" />
      <GlobalNavBar />
        <div className="text-center">
          <Zap className="w-16 h-16 text-[#00E5FF]/20 mx-auto mb-4" />
          <h1 className="text-white text-2xl font-bold mb-2">{tr.toolNotFound}</h1>
          <a href="/arsenal-ia" className="text-[#00E5FF] hover:underline">{tr.goBack}</a>
        </div>
      </div>
    );
  }

  const avatarImg = AVATAR_FRONTAL[tool.guide.avatarKey] || AVATAR_FRONTAL.SABELIN;
  const avatarExpr = AVATAR_EXPRESSIONS[tool.guide.avatarKey];

  return (
    <div className="bg-[#0A0A0A] min-h-screen">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#0A0A0A]/95 backdrop-blur-md border-b border-[#00E5FF]/10">
        <div className="container flex items-center justify-between h-16">
          <a href="/arsenal-ia" className="flex items-center gap-2 text-[#B0B0B0] hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">{tr.backToArsenal}</span>
          </a>
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium px-3 py-1 rounded-full border" style={{ color: catMeta!.color, borderColor: `${catMeta!.color}40`, backgroundColor: `${catMeta!.color}10` }}>
              {catMeta!.icon} {catMeta!.label}
            </span>
            <UserNavBadge variant="compact" />
          </div>
        </div>
      </header>

      <main className="pt-24 pb-16">
        <div className="container max-w-4xl">
          {/* Tool Header */}
          <div className="mb-10">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
              <div className="flex-1">
                <h1 className="font-display font-bold text-3xl sm:text-4xl text-white mb-2">{tool.name}</h1>
                <p className="text-[#B0B0B0] text-base leading-relaxed">{tool.desc}</p>
              </div>
              <a href={tool.url} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm transition-all hover:scale-105"
                style={{ backgroundColor: catMeta!.color, color: "#0A0A0A" }}>
                <ExternalLink className="w-4 h-4" /> {tr.openTool}
              </a>
            </div>

            {/* Meta badges */}
            <div className="flex flex-wrap gap-2">
              <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-white/[0.05] border border-white/[0.1] text-[#B0B0B0]">
                📊 {tr.difficulty}: <span className="text-white">{tool.guide.difficulty}</span>
              </span>
              <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-white/[0.05] border border-white/[0.1] text-[#B0B0B0]">
                ⏱️ {tr.timeToLearn}: <span className="text-white">{tool.guide.timeToLearn}</span>
              </span>
              <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${tool.free ? "bg-[#00C853]/10 border border-[#00C853]/30 text-[#00C853]" : "bg-[#FF9800]/10 border border-[#FF9800]/30 text-[#FF9800]"}`}>
                {tool.free ? `✓ ${tr.free}` : `⭐ ${tr.premium}`}
              </span>
            </div>
          </div>

          {/* Avatar Guide Quote */}
          <div className="mb-10 p-5 rounded-2xl bg-white/[0.03] border border-white/[0.08]">
            <div className="flex items-start gap-4">
              <img src={avatarExpr?.feliz || avatarImg} alt="" className="w-14 h-14 rounded-full object-cover border-2 flex-shrink-0" style={{ borderColor: catMeta!.color }} />
              <div>
                <p className="text-xs font-bold mb-1" style={{ color: catMeta!.color }}>
                  {tool.guide.avatarKey.replace(/_/g, " ")} {tr.avatarSays}
                </p>
                <p className="text-[#B0B0B0] text-sm italic leading-relaxed">"{tool.guide.avatarQuote}"</p>
              </div>
            </div>
          </div>

          {/* Tool Screenshot */}
          {TOOL_SCREENSHOTS[tool.id] && (
            <div className="mb-10">
              <h2 className="font-display font-bold text-base text-white mb-4 flex items-center gap-2">
                <Image className="w-4 h-4" style={{ color: catMeta!.color }} /> {tr.screenshot || 'Interfaz de la herramienta'}
              </h2>
              <div className="rounded-2xl overflow-hidden border border-white/[0.1] bg-white/[0.02]">
                <img
                  src={TOOL_SCREENSHOTS[tool.id]}
                  alt={`Captura de pantalla de ${tool.name}`}
                  className="w-full h-auto object-contain max-h-[400px]"
                  loading="lazy"
                />
                <div className="px-4 py-2 bg-white/[0.02] border-t border-white/[0.06]">
                  <p className="text-[#666] text-xs text-center">
                    {tr.screenshotCaption || 'Captura real de la interfaz de'} {tool.name} — {new Date().getFullYear()}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Step-by-Step Guide */}
          <div className="mb-10">
            <h2 className="font-display font-bold text-xl text-white mb-6 flex items-center gap-2">
              <BookOpen className="w-5 h-5" style={{ color: catMeta!.color }} /> {tr.stepByStep}
            </h2>

            {/* Step tabs */}
            <div className="flex gap-1 mb-6 overflow-x-auto pb-2">
              {tool.guide.steps.map((_, i) => (
                <button key={i} onClick={() => setActiveStep(i)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                    activeStep === i
                      ? "text-[#0A0A0A]"
                      : i < activeStep
                        ? "bg-white/[0.05] text-[#00C853] border border-[#00C853]/30"
                        : "bg-white/[0.02] text-[#B0B0B0] border border-white/[0.06] hover:border-white/[0.15]"
                  }`}
                  style={activeStep === i ? { backgroundColor: catMeta!.color } : {}}>
                  {i < activeStep ? <CheckCircle className="w-3.5 h-3.5" /> : <span>{i + 1}</span>}
                  <span className="hidden sm:inline">{tr.step} {i + 1}</span>
                </button>
              ))}
            </div>

            {/* Active step content */}
            <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/[0.08]">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold" style={{ backgroundColor: `${catMeta!.color}20`, color: catMeta!.color }}>
                  {activeStep + 1}
                </div>
                <h3 className="font-display font-bold text-lg text-white pt-0.5">
                  {tool.guide.steps[activeStep].title}
                </h3>
              </div>
              <p className="text-[#B0B0B0] text-sm leading-relaxed mb-4 ml-11">
                {tool.guide.steps[activeStep].desc}
              </p>
              {tool.guide.steps[activeStep].tip && (
                <div className="ml-11 flex items-start gap-2 p-3 rounded-xl bg-[#D4A843]/[0.06] border border-[#D4A843]/20">
                  <Lightbulb className="w-4 h-4 text-[#D4A843] flex-shrink-0 mt-0.5" />
                  <p className="text-[#D4A843] text-xs leading-relaxed">
                    <span className="font-bold">{tr.tip}:</span> {tool.guide.steps[activeStep].tip}
                  </p>
                </div>
              )}

              {/* Navigation */}
              <div className="flex justify-between mt-6 ml-11">
                <button onClick={() => setActiveStep(Math.max(0, activeStep - 1))}
                  disabled={activeStep === 0}
                  className="flex items-center gap-1 text-xs font-medium text-[#B0B0B0] hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                  <ArrowLeft className="w-3.5 h-3.5" /> {tr.prev}
                </button>
                <button onClick={() => setActiveStep(Math.min(tool.guide.steps.length - 1, activeStep + 1))}
                  disabled={activeStep === tool.guide.steps.length - 1}
                  className="flex items-center gap-1 text-xs font-medium hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  style={{ color: catMeta!.color }}>
                  {tr.next} <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Use Cases & Pro Tips */}
          <div className="grid sm:grid-cols-2 gap-4 mb-10">
            {/* Use Cases */}
            <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.08]">
              <h3 className="font-display font-bold text-base text-white mb-4 flex items-center gap-2">
                <Star className="w-4 h-4" style={{ color: catMeta!.color }} /> {tr.useCases}
              </h3>
              <ul className="space-y-2">
                {tool.guide.useCases.map((uc, i) => (
                  <li key={i} className="flex items-start gap-2 text-[#B0B0B0] text-sm">
                    <ChevronRight className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" style={{ color: catMeta!.color }} />
                    {uc}
                  </li>
                ))}
              </ul>
            </div>

            {/* Pro Tips */}
            <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.08]">
              <h3 className="font-display font-bold text-base text-white mb-4 flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-[#D4A843]" /> {tr.proTips}
              </h3>
              <ul className="space-y-3">
                {tool.guide.proTips.map((tip, i) => (
                  <li key={i} className="flex items-start gap-2 text-[#B0B0B0] text-xs leading-relaxed">
                    <span className="text-[#D4A843] font-bold flex-shrink-0">#{i + 1}</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Navigation between tools */}
          <div className="flex justify-between items-center p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
            {prevTool ? (
              <a href={`/arsenal-ia/${prevTool.id}`} className="flex items-center gap-2 text-[#B0B0B0] hover:text-white transition-colors text-sm">
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">{prevTool.name}</span>
              </a>
            ) : <div />}
            <a href="/arsenal-ia" className="text-xs font-medium px-3 py-1.5 rounded-full border border-white/[0.1] text-[#B0B0B0] hover:text-white hover:border-white/[0.2] transition-all">
              {tr.backToArsenal}
            </a>
            {nextTool ? (
              <a href={`/arsenal-ia/${nextTool.id}`} className="flex items-center gap-2 text-[#B0B0B0] hover:text-white transition-colors text-sm">
                <span className="hidden sm:inline">{nextTool.name}</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            ) : <div />}
          </div>
        </div>
      </main>
    </div>
  );
}

// Export the tools list for use in ArsenalIA page
export { TOOLS_WITH_GUIDES };

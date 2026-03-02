/**
 * LINCE Global Search Index
 * Central index of all searchable content across the site.
 * Each entry has: id, title, description, category, path, keywords, icon, lang variants
 */

export type SearchCategory =
  | "page"
  | "tool"
  | "course"
  | "avatar"
  | "game"
  | "feature";

export interface SearchEntry {
  id: string;
  title: { es: string; en: string; zh: string };
  description: { es: string; en: string; zh: string };
  category: SearchCategory;
  path: string;
  icon: string;
  keywords: string[];
}

// ─── Category labels ───
export const CATEGORY_LABELS: Record<SearchCategory, { es: string; en: string; zh: string }> = {
  page:    { es: "Páginas",       en: "Pages",        zh: "页面" },
  tool:    { es: "Herramientas IA", en: "AI Tools",   zh: "AI工具" },
  course:  { es: "Cursos",        en: "Courses",      zh: "课程" },
  avatar:  { es: "Personajes",    en: "Characters",   zh: "角色" },
  game:    { es: "Juego",         en: "Game",         zh: "游戏" },
  feature: { es: "Funciones",     en: "Features",     zh: "功能" },
};

export const CATEGORY_ICONS: Record<SearchCategory, string> = {
  page: "📄",
  tool: "⚡",
  course: "📚",
  avatar: "🐱",
  game: "🎮",
  feature: "✨",
};

// ─── SEARCH INDEX ───
export const SEARCH_INDEX: SearchEntry[] = [
  // ═══ PAGES ═══
  {
    id: "page-home",
    title: { es: "Portada PRD", en: "PRD Landing", zh: "PRD首页" },
    description: { es: "Documento de Requisitos del Producto LINCE", en: "LINCE Product Requirements Document", zh: "LINCE产品需求文档" },
    category: "page",
    path: "/home",
    icon: "🏠",
    keywords: ["home", "portada", "landing", "prd", "inicio", "principal"],
  },
  {
    id: "page-urban",
    title: { es: "Landing Urbana", en: "Urban Landing", zh: "都市首页" },
    description: { es: "Página principal con la Crew Urbana LINCE", en: "Main page with the LINCE Urban Crew", zh: "LINCE都市团队主页" },
    category: "page",
    path: "/",
    icon: "🏙️",
    keywords: ["urban", "urbana", "crew", "artistas", "landing", "principal"],
  },
  {
    id: "page-mundo",
    title: { es: "Mundo LINCE", en: "LINCE World", zh: "LINCE世界" },
    description: { es: "Explora el mundo interactivo de LINCE con todos los personajes", en: "Explore the interactive LINCE world with all characters", zh: "探索LINCE的互动世界" },
    category: "page",
    path: "/mundo",
    icon: "🌍",
    keywords: ["mundo", "world", "explorar", "mapa", "interactivo"],
  },
  {
    id: "page-raids",
    title: { es: "LINCE Batallas", en: "LINCE Batallas", zh: "LINCE对战" },
    description: { es: "Desafíos cooperativos y batallas de conocimiento IA", en: "Cooperative challenges and AI knowledge battles", zh: "合作挑战和AI知识战斗" },
    category: "page",
    path: "/raids",
    icon: "⚔️",
    keywords: ["raids", "batalla", "battle", "cooperativo", "desafio", "pvp"],
  },
  {
    id: "page-academia",
    title: { es: "Cursos LINCE", en: "LINCE Courses", zh: "LINCE课程" },
    description: { es: "Centro de aprendizaje avanzado de inteligencia artificial", en: "Advanced AI learning center", zh: "高级AI学习中心" },
    category: "page",
    path: "/academia",
    icon: "🎓",
    keywords: ["academia", "academy", "aprender", "learn", "educacion", "formacion"],
  },
  {
    id: "page-como-jugar",
    title: { es: "Cómo Jugar", en: "How to Play", zh: "如何游玩" },
    description: { es: "Guía completa para empezar a jugar en LINCE", en: "Complete guide to start playing LINCE", zh: "LINCE完整游戏指南" },
    category: "page",
    path: "/como-jugar",
    icon: "🎮",
    keywords: ["como", "jugar", "guia", "tutorial", "instrucciones", "empezar", "how", "play"],
  },
  {
    id: "page-personajes",
    title: { es: "Personajes", en: "Characters", zh: "角色" },
    description: { es: "Conoce a todos los avatares de la familia y la Crew LINCE", en: "Meet all LINCE family and Crew avatars", zh: "认识所有LINCE家族和团队角色" },
    category: "page",
    path: "/personajes",
    icon: "🐱",
    keywords: ["personajes", "characters", "avatares", "familia", "crew", "lince"],
  },
  {
    id: "page-changelog",
    title: { es: "Novedades", en: "Changelog", zh: "更新日志" },
    description: { es: "Historial de actualizaciones y nuevas funcionalidades", en: "Update history and new features", zh: "更新历史和新功能" },
    category: "page",
    path: "/changelog",
    icon: "📋",
    keywords: ["changelog", "novedades", "actualizaciones", "updates", "historial", "version"],
  },
  {
    id: "page-aviso-legal",
    title: { es: "Legal", en: "Legal Notice", zh: "法律声明" },
    description: { es: "Información legal, privacidad y cookies de ACNB IA SL", en: "Legal information, privacy and cookies", zh: "法律信息、隐私和Cookie" },
    category: "page",
    path: "/aviso-legal",
    icon: "⚖️",
    keywords: ["legal", "aviso", "privacidad", "cookies", "rgpd", "acnb"],
  },

  // ═══ GAME ═══
  {
    id: "game-hub",
    title: { es: "Jugar", en: "Play", zh: "开始游戏" },
    description: { es: "Hub principal del juego con niveles y progreso", en: "Main game hub with levels and progress", zh: "主游戏中心" },
    category: "game",
    path: "/jugar",
    icon: "🕹️",
    keywords: ["jugar", "play", "game", "hub", "niveles", "levels", "inicio"],
  },
  {
    id: "game-nivel1",
    title: { es: "Nivel 1 — Fundamentos IA", en: "Level 1 — AI Fundamentals", zh: "第1关 — AI基础" },
    description: { es: "Aprende los conceptos básicos de la inteligencia artificial", en: "Learn the basics of artificial intelligence", zh: "学习人工智能基础" },
    category: "game",
    path: "/jugar/nivel-1",
    icon: "1️⃣",
    keywords: ["nivel", "level", "1", "fundamentos", "basico", "fundamentals", "basic", "ia"],
  },
  {
    id: "game-nivel2",
    title: { es: "Nivel 2 — Prompts Avanzados", en: "Level 2 — Advanced Prompts", zh: "第2关 — 高级提示" },
    description: { es: "Domina el arte de crear prompts efectivos", en: "Master the art of creating effective prompts", zh: "掌握创建有效提示的艺术" },
    category: "game",
    path: "/jugar/nivel-2",
    icon: "2️⃣",
    keywords: ["nivel", "level", "2", "prompts", "avanzado", "advanced"],
  },
  {
    id: "game-nivel3",
    title: { es: "Nivel 3 — IA Creativa", en: "Level 3 — Creative AI", zh: "第3关 — 创意AI" },
    description: { es: "Explora la generación de imágenes y contenido creativo con IA", en: "Explore image generation and creative AI content", zh: "探索AI图像生成和创意内容" },
    category: "game",
    path: "/jugar/nivel-3",
    icon: "3️⃣",
    keywords: ["nivel", "level", "3", "creativa", "creative", "imagenes", "images"],
  },
  {
    id: "game-rewards",
    title: { es: "Recompensas Diarias", en: "Daily Rewards", zh: "每日奖励" },
    description: { es: "Reclama tus LinceCoins diarios y mantén tu racha", en: "Claim your daily LinceCoins and keep your streak", zh: "领取每日LinceCoins并保持连续" },
    category: "game",
    path: "/recompensas",
    icon: "🎁",
    keywords: ["recompensas", "rewards", "diario", "daily", "lincecoins", "racha", "streak"],
  },
  {
    id: "game-promptear",
    title: { es: "Aprender Prompts", en: "Learn Prompts", zh: "学习提示词" },
    description: { es: "Juego interactivo de creación de prompts con puntuación", en: "Interactive prompt creation game with scoring", zh: "互动提示创建游戏" },
    category: "game",
    path: "/promptear",
    icon: "🧠",
    keywords: ["promptlin", "promptear", "prompt", "game", "juego", "interactivo", "puntuacion"],
  },

  // ═══ FEATURES ═══
  {
    id: "feature-prompt-studio",
    title: { es: "Crear Imagen", en: "Create Image", zh: "创建图像" },
    description: { es: "Crea prompts visuales con 4 campos inteligentes y genera imágenes con IA", en: "Create visual prompts with 4 smart fields and generate AI images", zh: "用4个智能字段创建视觉提示并生成AI图像" },
    category: "feature",
    path: "/prompt-studio",
    icon: "🎨",
    keywords: ["prompt", "studio", "visual", "imagen", "image", "generar", "generate", "ia", "ai"],
  },
  {
    id: "feature-prompt-pro",
    title: { es: "Prompt Profesional", en: "Professional Prompt", zh: "专业提示" },
    description: { es: "Crea prompts profesionales con técnicas Anthropic avanzadas", en: "Create professional prompts with advanced Anthropic techniques", zh: "使用高级Anthropic技术创建专业提示" },
    category: "feature",
    path: "/prompt-profesional",
    icon: "💼",
    keywords: ["prompt", "profesional", "professional", "anthropic", "tecnicas", "negocio", "business"],
  },
  {
    id: "feature-galeria",
    title: { es: "Galería de Imágenes IA", en: "AI Image Gallery", zh: "AI图像画廊" },
    description: { es: "Galería con todas las imágenes generadas por la comunidad", en: "Gallery with all community-generated images", zh: "社区生成的所有图像画廊" },
    category: "feature",
    path: "/galeria",
    icon: "🖼️",
    keywords: ["galeria", "gallery", "imagenes", "images", "ia", "ai", "generadas"],
  },
  {
    id: "feature-historial",
    title: { es: "Historial de Prompts", en: "Prompt History", zh: "提示历史" },
    description: { es: "Consulta todos tus prompts guardados y creaciones anteriores", en: "View all your saved prompts and previous creations", zh: "查看所有保存的提示和之前的创作" },
    category: "feature",
    path: "/historial-prompts",
    icon: "📜",
    keywords: ["historial", "history", "prompts", "guardados", "saved", "anteriores"],
  },
  {
    id: "feature-avatar-customizer",
    title: { es: "Personalizar Avatar", en: "Customize Avatar", zh: "自定义头像" },
    description: { es: "Crea y personaliza tu propio avatar de lince ibérico", en: "Create and customize your own Iberian lynx avatar", zh: "创建和自定义你的伊比利亚猞猁头像" },
    category: "feature",
    path: "/avatar-customizer",
    icon: "✏️",
    keywords: ["avatar", "personalizar", "customize", "lince", "crear", "create", "mi avatar"],
  },
  {
    id: "feature-course-builder",
    title: { es: "Constructor de Cursos", en: "Course Builder", zh: "课程构建器" },
    description: { es: "Diseña y crea tus propios cursos de IA personalizados", en: "Design and create your own custom AI courses", zh: "设计和创建你自己的AI课程" },
    category: "feature",
    path: "/course-builder",
    icon: "🏗️",
    keywords: ["course", "builder", "constructor", "cursos", "crear", "disenar", "personalizado"],
  },
  {
    id: "feature-perfil",
    title: { es: "Mi Perfil", en: "My Profile", zh: "我的资料" },
    description: { es: "Tu perfil de jugador con estadísticas y logros", en: "Your player profile with stats and achievements", zh: "你的玩家资料和成就" },
    category: "feature",
    path: "/perfil",
    icon: "👤",
    keywords: ["perfil", "profile", "estadisticas", "stats", "logros", "achievements"],
  },
  {
    id: "feature-dashboard",
    title: { es: "Mi Panel", en: "My Dashboard", zh: "我的面板" },
    description: { es: "Panel personal con resumen de actividad y progreso", en: "Personal dashboard with activity summary and progress", zh: "个人面板和活动摘要" },
    category: "feature",
    path: "/mi-panel",
    icon: "📊",
    keywords: ["panel", "dashboard", "actividad", "activity", "progreso", "progress", "resumen"],
  },

  // ═══ AI TOOLS (top 20 from Arsenal IA) ═══
  {
    id: "tool-chatgpt",
    title: { es: "ChatGPT", en: "ChatGPT", zh: "ChatGPT" },
    description: { es: "Asistente conversacional de OpenAI — el más popular del mundo", en: "OpenAI conversational assistant — the most popular in the world", zh: "OpenAI对话助手 — 世界上最受欢迎的" },
    category: "tool",
    path: "/arsenal-ia/chatgpt",
    icon: "🤖",
    keywords: ["chatgpt", "openai", "chat", "gpt", "conversacion", "asistente", "ia"],
  },
  {
    id: "tool-gemini",
    title: { es: "Google Gemini", en: "Google Gemini", zh: "Google Gemini" },
    description: { es: "IA multimodal de Google con acceso a búsqueda en tiempo real", en: "Google multimodal AI with real-time search access", zh: "Google多模态AI" },
    category: "tool",
    path: "/arsenal-ia/gemini",
    icon: "💎",
    keywords: ["gemini", "google", "bard", "multimodal", "busqueda", "search"],
  },
  {
    id: "tool-claude",
    title: { es: "Claude (Anthropic)", en: "Claude (Anthropic)", zh: "Claude (Anthropic)" },
    description: { es: "IA de Anthropic especializada en análisis largo y razonamiento", en: "Anthropic AI specialized in long analysis and reasoning", zh: "Anthropic AI专注于长分析和推理" },
    category: "tool",
    path: "/arsenal-ia/claude",
    icon: "🧩",
    keywords: ["claude", "anthropic", "analisis", "razonamiento", "reasoning", "largo"],
  },
  {
    id: "tool-midjourney",
    title: { es: "Midjourney", en: "Midjourney", zh: "Midjourney" },
    description: { es: "Generador de imágenes artísticas de alta calidad", en: "High-quality artistic image generator", zh: "高质量艺术图像生成器" },
    category: "tool",
    path: "/arsenal-ia/midjourney",
    icon: "🎨",
    keywords: ["midjourney", "imagen", "image", "arte", "art", "generar", "generate"],
  },
  {
    id: "tool-dall-e",
    title: { es: "DALL-E 3", en: "DALL-E 3", zh: "DALL-E 3" },
    description: { es: "Generador de imágenes de OpenAI integrado en ChatGPT", en: "OpenAI image generator integrated in ChatGPT", zh: "集成在ChatGPT中的OpenAI图像生成器" },
    category: "tool",
    path: "/arsenal-ia/dall-e-3",
    icon: "🖼️",
    keywords: ["dall-e", "dalle", "openai", "imagen", "image", "generar"],
  },
  {
    id: "tool-stable-diffusion",
    title: { es: "Stable Diffusion", en: "Stable Diffusion", zh: "Stable Diffusion" },
    description: { es: "Modelo open-source de generación de imágenes", en: "Open-source image generation model", zh: "开源图像生成模型" },
    category: "tool",
    path: "/arsenal-ia/stable-diffusion",
    icon: "🌀",
    keywords: ["stable", "diffusion", "open source", "imagen", "image", "gratis", "free"],
  },
  {
    id: "tool-copilot",
    title: { es: "GitHub Copilot", en: "GitHub Copilot", zh: "GitHub Copilot" },
    description: { es: "Asistente de código IA para programadores", en: "AI code assistant for programmers", zh: "程序员AI代码助手" },
    category: "tool",
    path: "/arsenal-ia/github-copilot",
    icon: "💻",
    keywords: ["copilot", "github", "codigo", "code", "programar", "programming"],
  },
  {
    id: "tool-canva",
    title: { es: "Canva IA", en: "Canva AI", zh: "Canva AI" },
    description: { es: "Diseño gráfico con asistente de IA integrado", en: "Graphic design with integrated AI assistant", zh: "集成AI助手的图形设计" },
    category: "tool",
    path: "/arsenal-ia/canva-ia",
    icon: "🎯",
    keywords: ["canva", "diseno", "design", "grafico", "graphic", "plantillas", "templates"],
  },
  {
    id: "tool-elevenlabs",
    title: { es: "ElevenLabs", en: "ElevenLabs", zh: "ElevenLabs" },
    description: { es: "Generación de voz ultra-realista con IA", en: "Ultra-realistic AI voice generation", zh: "超逼真AI语音生成" },
    category: "tool",
    path: "/arsenal-ia/elevenlabs",
    icon: "🎙️",
    keywords: ["elevenlabs", "voz", "voice", "audio", "tts", "speech", "hablar"],
  },
  {
    id: "tool-runway",
    title: { es: "Runway ML", en: "Runway ML", zh: "Runway ML" },
    description: { es: "Generación y edición de video con IA", en: "AI video generation and editing", zh: "AI视频生成和编辑" },
    category: "tool",
    path: "/arsenal-ia/runway-ml",
    icon: "🎬",
    keywords: ["runway", "video", "editar", "edit", "generar", "generate", "ml"],
  },
  {
    id: "tool-suno",
    title: { es: "Suno AI", en: "Suno AI", zh: "Suno AI" },
    description: { es: "Generación de música y canciones completas con IA", en: "AI music and complete song generation", zh: "AI音乐和完整歌曲生成" },
    category: "tool",
    path: "/arsenal-ia/suno-ai",
    icon: "🎵",
    keywords: ["suno", "musica", "music", "cancion", "song", "generar", "audio"],
  },
  {
    id: "tool-perplexity",
    title: { es: "Perplexity AI", en: "Perplexity AI", zh: "Perplexity AI" },
    description: { es: "Buscador inteligente con respuestas citadas y fuentes", en: "Smart search engine with cited answers and sources", zh: "带引用答案和来源的智能搜索引擎" },
    category: "tool",
    path: "/arsenal-ia/perplexity",
    icon: "🔍",
    keywords: ["perplexity", "buscar", "search", "investigar", "research", "fuentes", "sources"],
  },

  // ═══ COURSES (representative selection) ═══
  {
    id: "course-ia-generativa",
    title: { es: "IA Generativa desde Cero", en: "Generative AI from Scratch", zh: "从零开始的生成式AI" },
    description: { es: "Curso básico de 7h — Identifica herramientas, crea prompts, evalúa riesgos", en: "7h basic course — Identify tools, create prompts, evaluate risks", zh: "7小时基础课程" },
    category: "course",
    path: "/catalogo-formativo",
    icon: "📚",
    keywords: ["ia generativa", "generative ai", "basico", "basic", "curso", "course", "herramientas"],
  },
  {
    id: "course-prompt-engineering",
    title: { es: "Prompt Engineering Avanzado", en: "Advanced Prompt Engineering", zh: "高级提示工程" },
    description: { es: "Curso avanzado de 7h — Domina técnicas de prompting profesional", en: "7h advanced course — Master professional prompting techniques", zh: "7小时高级课程" },
    category: "course",
    path: "/catalogo-formativo",
    icon: "📚",
    keywords: ["prompt", "engineering", "avanzado", "advanced", "tecnicas", "profesional"],
  },
  {
    id: "course-machine-learning",
    title: { es: "Machine Learning para Empresas", en: "Machine Learning for Business", zh: "企业机器学习" },
    description: { es: "Curso intermedio de 7h — Aplica ML en decisiones empresariales", en: "7h intermediate course — Apply ML in business decisions", zh: "7小时中级课程" },
    category: "course",
    path: "/catalogo-formativo",
    icon: "📚",
    keywords: ["machine learning", "ml", "empresas", "business", "datos", "data", "prediccion"],
  },
  {
    id: "course-chatgpt-negocios",
    title: { es: "ChatGPT para Negocios", en: "ChatGPT for Business", zh: "商业ChatGPT" },
    description: { es: "Curso básico de 7h — Automatiza tareas con ChatGPT en tu empresa", en: "7h basic course — Automate tasks with ChatGPT", zh: "7小时基础课程" },
    category: "course",
    path: "/catalogo-formativo",
    icon: "📚",
    keywords: ["chatgpt", "negocios", "business", "automatizar", "automate", "empresa"],
  },
  {
    id: "course-ia-educacion",
    title: { es: "IA en Educación", en: "AI in Education", zh: "教育中的AI" },
    description: { es: "Curso intermedio de 7h — Integra IA en el aula y la enseñanza", en: "7h intermediate course — Integrate AI in teaching", zh: "7小时中级课程" },
    category: "course",
    path: "/catalogo-formativo",
    icon: "📚",
    keywords: ["educacion", "education", "aula", "classroom", "ensenar", "teach", "profesor"],
  },
  {
    id: "course-ia-marketing",
    title: { es: "IA para Marketing Digital", en: "AI for Digital Marketing", zh: "数字营销AI" },
    description: { es: "Curso intermedio de 7h — Campañas, contenido y análisis con IA", en: "7h intermediate course — Campaigns, content and analysis with AI", zh: "7小时中级课程" },
    category: "course",
    path: "/catalogo-formativo",
    icon: "📚",
    keywords: ["marketing", "digital", "campanas", "campaigns", "contenido", "content", "redes"],
  },
  {
    id: "course-automatizacion",
    title: { es: "Automatización con IA", en: "AI Automation", zh: "AI自动化" },
    description: { es: "Curso avanzado de 7h — Workflows, bots y procesos automáticos", en: "7h advanced course — Workflows, bots and automated processes", zh: "7小时高级课程" },
    category: "course",
    path: "/catalogo-formativo",
    icon: "📚",
    keywords: ["automatizacion", "automation", "workflows", "bots", "procesos", "zapier", "make"],
  },
  {
    id: "course-ia-salud",
    title: { es: "IA en Salud", en: "AI in Healthcare", zh: "医疗AI" },
    description: { es: "Curso intermedio de 7h — Aplicaciones de IA en el sector sanitario", en: "7h intermediate course — AI applications in healthcare", zh: "7小时中级课程" },
    category: "course",
    path: "/catalogo-formativo",
    icon: "📚",
    keywords: ["salud", "health", "healthcare", "medico", "medical", "sanitario", "hospital"],
  },

  // ═══ AVATARS (Family + Crew highlights) ═══
  {
    id: "avatar-bryelin",
    title: { es: "LUMALÍN — LUMALÍN", en: "LUMALÍN — LUMALÍN", zh: "LUMALÍN — LUMALÍN" },
    description: { es: "Mentor IA Generativa · Líder de la Crew Urbana · 249K YouTube", en: "Generative AI Mentor · Urban Crew Leader · 249K YouTube", zh: "生成式AI导师 · 都市团队领袖" },
    category: "avatar",
    path: "/personajes",
    icon: "🐱",
    keywords: ["bryelin", "yong bryel", "mentor", "crew", "urbana", "lider", "tiktok", "youtube"],
  },
  {
    id: "avatar-voodoolin",
    title: { es: "VOLTZLÍN — VOLTZLÍN", en: "VOLTZLÍN — VOLTZLÍN", zh: "VOLTZLÍN — VOLTZLÍN" },
    description: { es: "#1 MUSICALIN · 962M streams · Crew Musical", en: "#1 MUSICALIN · 962M streams · Music Crew", zh: "#1 MUSICALIN · 9.62亿播放" },
    category: "avatar",
    path: "/personajes",
    icon: "🐱",
    keywords: ["voodoolin", "voltzlin", "musicalin", "musica", "streams", "crew"],
  },
  {
    id: "avatar-duolino",
    title: { es: "YAYALIN — El Abuelo Sabio", en: "YAYALIN — The Wise Grandfather", zh: "YAYALIN — 智慧爷爷" },
    description: { es: "Padre y Director General de la Familia LINCE", en: "Father and CEO of the LINCE Family", zh: "LINCE家族的父亲和总监" },
    category: "avatar",
    path: "/personajes",
    icon: "🐱",
    keywords: ["duolino", "abuelo", "grandfather", "padre", "father", "sabio", "wise", "familia"],
  },
  {
    id: "avatar-yayolin",
    title: { es: "YAYOLÍN — La Abuela Sabia", en: "YAYOLÍN — The Wise Grandmother", zh: "YAYOLÍN — 智慧奶奶" },
    description: { es: "Abuela de la familia · Sabiduría Digital · IA para mayores", en: "Family grandmother · Digital Wisdom · AI for seniors", zh: "家族祖母 · 数字智慧" },
    category: "avatar",
    path: "/personajes",
    icon: "🐱",
    keywords: ["yayolin", "abuela", "grandmother", "sabiduria", "wisdom", "mayores", "seniors"],
  },
  {
    id: "avatar-duolingenio",
    title: { es: "SABELIN — El Genio", en: "SABELIN — The Genius", zh: "SABELIN — 天才" },
    description: { es: "El genio de la familia · Experto en tecnología avanzada", en: "Family genius · Advanced technology expert", zh: "家族天才 · 高级技术专家" },
    category: "avatar",
    path: "/personajes",
    icon: "🐱",
    keywords: ["duolingenio", "genio", "genius", "tecnologia", "technology", "experto"],
  },
  {
    id: "avatar-duolinpistado",
    title: { es: "ATOLONDRALIN — El Despistado", en: "ATOLONDRALIN — The Absent-Minded", zh: "ATOLONDRALIN — 迷糊" },
    description: { es: "El despistado simpático de la familia · Aprende a su ritmo", en: "The lovable absent-minded family member", zh: "可爱的迷糊家族成员" },
    category: "avatar",
    path: "/personajes",
    icon: "🐱",
    keywords: ["duolinpistado", "despistado", "absent", "simpatico", "divertido", "funny"],
  },

  // ═══ ARSENAL IA PAGE ═══
  {
    id: "page-arsenal",
    title: { es: "Herramientas IA", en: "AI Tools", zh: "AI工具" },
    description: { es: "Directorio completo de 62+ herramientas de inteligencia artificial", en: "Complete directory of 62+ AI tools", zh: "62+AI工具完整目录" },
    category: "page",
    path: "/arsenal-ia",
    icon: "⚡",
    keywords: ["arsenal", "herramientas", "tools", "directorio", "directory", "ia", "ai", "todas"],
  },
  {
    id: "page-catalogo",
    title: { es: "Todos los Cursos", en: "All Courses", zh: "所有课程" },
    description: { es: "120 cursos de IA organizados por categoría y nivel", en: "120 AI courses organized by category and level", zh: "按类别和级别组织的120个AI课程" },
    category: "page",
    path: "/catalogo-formativo",
    icon: "📚",
    keywords: ["catalogo", "catalog", "formativo", "training", "cursos", "courses", "120"],
  },
  // ═══ MUSICALIN INTERNACIONAL ═══
  {
    id: "avatar-flamencalin",
    title: { es: "FLAMENCALÍN — Maestra Flamenco & IA", en: "FLAMENCALÍN — Flamenco & AI Master", zh: "FLAMENCALÍN — 弗拉明戈与AI大师" },
    description: { es: "Fusión flamenco-electrónica con IA · España · MUSICALIN", en: "Flamenco-electronic fusion with AI · Spain · MUSICALIN", zh: "弗拉明戈电子融合AI · 西班牙" },
    category: "avatar",
    path: "/personajes",
    icon: "🐱",
    keywords: ["flamencalin", "flamenco", "españa", "spain", "musicalin", "buleria", "fusion"],
  },
  {
    id: "avatar-iberalin",
    title: { es: "IBERALÍN — Productor Electrónica & IA", en: "IBERALÍN — Electronic Producer & AI", zh: "IBERALÍN — 电子音乐制作人AI" },
    description: { es: "Electrónica indie con IA · España · MUSICALIN", en: "Indie electronic with AI · Spain · MUSICALIN", zh: "独立电子音乐AI · 西班牙" },
    category: "avatar",
    path: "/personajes",
    icon: "🐱",
    keywords: ["iberalin", "electronica", "indie", "españa", "spain", "musicalin", "productor"],
  },
  {
    id: "avatar-tonalin",
    title: { es: "TONALÍN — Compositora Pop & IA", en: "TONALÍN — Pop Composer & AI", zh: "TONALÍN — 流行作曲家AI" },
    description: { es: "Composición pop latino con IA · España · MUSICALIN", en: "Latin pop composition with AI · Spain · MUSICALIN", zh: "拉丁流行作曲AI · 西班牙" },
    category: "avatar",
    path: "/personajes",
    icon: "🐱",
    keywords: ["tonalin", "pop", "compositora", "españa", "spain", "musicalin", "melodia"],
  },
  {
    id: "avatar-solearlin",
    title: { es: "SOLEARLÍN — Maestra Rumba & IA", en: "SOLEARLÍN — Rumba & AI Master", zh: "SOLEARLÍN — 伦巴与AI大师" },
    description: { es: "Rumba y fusión mediterránea con IA · España · MUSICALIN", en: "Rumba and Mediterranean fusion with AI · Spain · MUSICALIN", zh: "伦巴和地中海融合AI · 西班牙" },
    category: "avatar",
    path: "/personajes",
    icon: "🐱",
    keywords: ["solearlin", "rumba", "mediterranea", "españa", "spain", "musicalin", "fiesta"],
  },
  {
    id: "avatar-gaditaklin",
    title: { es: "GADITAKLÍN — MC Hip-Hop & IA", en: "GADITAKLÍN — Hip-Hop MC & AI", zh: "GADITAKLÍN — 嘴哈MC与AI" },
    description: { es: "Hip-hop y rap con IA · España · MUSICALIN", en: "Hip-hop and rap with AI · Spain · MUSICALIN", zh: "嘴哈和说唱AI · 西班牙" },
    category: "avatar",
    path: "/personajes",
    icon: "🐱",
    keywords: ["gaditaklin", "hiphop", "rap", "mc", "españa", "spain", "musicalin", "barras"],
  },
  {
    id: "avatar-tangarlin",
    title: { es: "TANGARLÍN — Maestro Tango Electrónico & IA", en: "TANGARLÍN — Electronic Tango Master & AI", zh: "TANGARLÍN — 电子探戈大师AI" },
    description: { es: "Tango electrónico con IA · Argentina · MUSICALIN", en: "Electronic tango with AI · Argentina · MUSICALIN", zh: "电子探戈AI · 阿根廷" },
    category: "avatar",
    path: "/personajes",
    icon: "🐱",
    keywords: ["tangarlin", "tango", "electronico", "argentina", "musicalin", "bandoneon"],
  },
  {
    id: "avatar-cumbielin",
    title: { es: "CUMBIELÍN — Maestro Cumbia Digital & IA", en: "CUMBIELÍN — Digital Cumbia Master & AI", zh: "CUMBIELÍN — 数字坎比亚大师AI" },
    description: { es: "Cumbia digital y remix con IA · Argentina · MUSICALIN", en: "Digital cumbia and remix with AI · Argentina · MUSICALIN", zh: "数字坎比亚和混音AI · 阿根廷" },
    category: "avatar",
    path: "/personajes",
    icon: "🐱",
    keywords: ["cumbielin", "cumbia", "digital", "remix", "argentina", "musicalin"],
  },
  {
    id: "avatar-pampalin",
    title: { es: "PAMPALÍN — Rockero & IA", en: "PAMPALÍN — Rocker & AI", zh: "PAMPALÍN — 摇滚乐手AI" },
    description: { es: "Rock y folk argentino con IA · Argentina · MUSICALIN", en: "Argentine rock and folk with AI · Argentina · MUSICALIN", zh: "阿根廷摇滚和民谣AI · 阿根廷" },
    category: "avatar",
    path: "/personajes",
    icon: "🐱",
    keywords: ["pampalin", "rock", "folk", "argentina", "musicalin", "guitarra"],
  },
  {
    id: "avatar-milonguelin",
    title: { es: "MILONGUELÍN — Maestra Folklore & IA", en: "MILONGUELÍN — Folklore & AI Master", zh: "MILONGUELÍN — 民俗与AI大师" },
    description: { es: "Folklore y milonga digital con IA · Argentina · MUSICALIN", en: "Digital folklore and milonga with AI · Argentina · MUSICALIN", zh: "数字民俗和米隆加AI · 阿根廷" },
    category: "avatar",
    path: "/personajes",
    icon: "🐱",
    keywords: ["milonguelin", "folklore", "milonga", "argentina", "musicalin", "payada"],
  },
  {
    id: "avatar-gauchalin",
    title: { es: "GAUCHALÍN — Productora Trap Argentino & IA", en: "GAUCHALÍN — Argentine Trap Producer & AI", zh: "GAUCHALÍN — 阿根廷Trap制作人AI" },
    description: { es: "Trap argentino y música urbana con IA · Argentina · MUSICALIN", en: "Argentine trap and urban music with AI · Argentina · MUSICALIN", zh: "阿根廷Trap和都市音乐AI · 阿根廷" },
    category: "avatar",
    path: "/personajes",
    icon: "🐱",
    keywords: ["gauchalin", "trap", "urbano", "argentina", "musicalin", "808"],
  },
  {
    id: "avatar-boriqualin",
    title: { es: "BORIQUALÍN — Productora Reggaetón & IA", en: "BORIQUALÍN — Reggaeton Producer & AI", zh: "BORIQUALÍN — 雷鬼顿制作人AI" },
    description: { es: "Reggaetón y dembow con IA · Puerto Rico · MUSICALIN", en: "Reggaeton and dembow with AI · Puerto Rico · MUSICALIN", zh: "雷鬼顿和Dembow AI · 波多黎各" },
    category: "avatar",
    path: "/personajes",
    icon: "🐱",
    keywords: ["boriqualin", "reggaeton", "dembow", "puertorico", "musicalin", "hit"],
  },
  {
    id: "avatar-tropiklin",
    title: { es: "TROPIKLÍN — Productor Tropical & IA", en: "TROPIKLÍN — Tropical Producer & AI", zh: "TROPIKLÍN — 热带制作人AI" },
    description: { es: "Música tropical y pop caribeño con IA · Puerto Rico · MUSICALIN", en: "Tropical music and Caribbean pop with AI · Puerto Rico · MUSICALIN", zh: "热带音乐和加勒比流行AI · 波多黎各" },
    category: "avatar",
    path: "/personajes",
    icon: "🐱",
    keywords: ["tropiklin", "tropical", "caribe", "puertorico", "musicalin", "reggae"],
  },
  {
    id: "avatar-perrealin",
    title: { es: "PERREALÍN — Maestro Trap Latino & IA", en: "PERREALÍN — Latin Trap Master & AI", zh: "PERREALÍN — 拉丁Trap大师AI" },
    description: { es: "Trap latino y perreo con IA · Puerto Rico · MUSICALIN", en: "Latin trap and perreo with AI · Puerto Rico · MUSICALIN", zh: "拉丁Trap和Perreo AI · 波多黎各" },
    category: "avatar",
    path: "/personajes",
    icon: "🐱",
    keywords: ["perrealin", "trap", "perreo", "puertorico", "musicalin", "808"],
  },
  {
    id: "avatar-islalina",
    title: { es: "ISLALINA — Artista R&B Latino & IA", en: "ISLALINA — Latin R&B Artist & AI", zh: "ISLALINA — 拉丁R&B艺术家AI" },
    description: { es: "R&B latino y soul con IA · Puerto Rico · MUSICALIN", en: "Latin R&B and soul with AI · Puerto Rico · MUSICALIN", zh: "拉丁R&B和灵魂乐AI · 波多黎各" },
    category: "avatar",
    path: "/personajes",
    icon: "🐱",
    keywords: ["islalina", "rnb", "soul", "puertorico", "musicalin", "vocal"],
  },
  {
    id: "avatar-salsalin",
    title: { es: "SALSALÍN — Maestro Salsa & IA", en: "SALSALÍN — Salsa Master & AI", zh: "SALSALÍN — 萨尔萨大师AI" },
    description: { es: "Salsa y fusión electrónica con IA · Puerto Rico · MUSICALIN", en: "Salsa and electronic fusion with AI · Puerto Rico · MUSICALIN", zh: "萨尔萨和电子融合AI · 波多黎各" },
    category: "avatar",
    path: "/personajes",
    icon: "🐱",
    keywords: ["salsalin", "salsa", "fusion", "puertorico", "musicalin", "clave"],
  },
  {
    id: "avatar-cumbialin",
    title: { es: "CUMBIALÍN — Artista Cumbia Electrónica & IA", en: "CUMBIALÍN — Electronic Cumbia Artist & AI", zh: "CUMBIALÍN — 电子坎比亚艺术家AI" },
    description: { es: "Cumbia electrónica y fusión con IA · Colombia · MUSICALIN", en: "Electronic cumbia and fusion with AI · Colombia · MUSICALIN", zh: "电子坎比亚和融合AI · 哥伦比亚" },
    category: "avatar",
    path: "/personajes",
    icon: "🐱",
    keywords: ["cumbialin", "cumbia", "electronica", "colombia", "musicalin", "gaita"],
  },
  {
    id: "avatar-vallenatalin",
    title: { es: "VALLENATALÍN — Cantante Vallenato-Pop & IA", en: "VALLENATALÍN — Vallenato-Pop Singer & AI", zh: "VALLENATALÍN — 巴耶纳托流行歌手AI" },
    description: { es: "Vallenato moderno con IA · Colombia · MUSICALIN", en: "Modern vallenato with AI · Colombia · MUSICALIN", zh: "现代巴耶纳托AI · 哥伦比亚" },
    category: "avatar",
    path: "/personajes",
    icon: "🐱",
    keywords: ["vallenatalin", "vallenato", "pop", "colombia", "musicalin", "acordeon"],
  },
  {
    id: "avatar-parcelin",
    title: { es: "PARCELÍN — Artista Musical & IA", en: "PARCELÍN — Musical Artist & AI", zh: "PARCELÍN — 都市艺术家AI" },
    description: { es: "Música urbana latina con IA · Colombia · MUSICALIN", en: "Latin urban music with AI · Colombia · MUSICALIN", zh: "拉丁都市音乐AI · 哥伦比亚" },
    category: "avatar",
    path: "/personajes",
    icon: "🐱",
    keywords: ["parcelin", "urbano", "reggaeton", "colombia", "musicalin", "negocio"],
  },
  {
    id: "avatar-cafetalin",
    title: { es: "CAFETALÍN — Cantautora Indie-Folk & IA", en: "CAFETALÍN — Indie-Folk Singer-Songwriter & AI", zh: "CAFETALÍN — 独立民谣创作歌手AI" },
    description: { es: "Indie-folk y composición artesanal con IA · Colombia · MUSICALIN", en: "Indie-folk and artisanal composition with AI · Colombia · MUSICALIN", zh: "独立民谣和手工作曲AI · 哥伦比亚" },
    category: "avatar",
    path: "/personajes",
    icon: "🐱",
    keywords: ["cafetalin", "indie", "folk", "cantautora", "colombia", "musicalin", "poesia"],
  },
  {
    id: "avatar-champetaklin",
    title: { es: "CHAMPETAKLÍN — Maestro Champeta & Afrobeat IA", en: "CHAMPETAKLÍN — Champeta & Afrobeat Master AI", zh: "CHAMPETAKLÍN — 尚佩塔与非洲节拍大师AI" },
    description: { es: "Champeta y afrobeat con IA · Colombia · MUSICALIN", en: "Champeta and afrobeat with AI · Colombia · MUSICALIN", zh: "尚佩塔和非洲节拍AI · 哥伦比亚" },
    category: "avatar",
    path: "/personajes",
    icon: "🐱",
    keywords: ["champetaklin", "champeta", "afrobeat", "colombia", "musicalin", "pico"],
  },
];

// ─── SEARCH LOGIC ───

/**
 * Normalize text for search: lowercase, remove accents, trim
 */
function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

/**
 * Calculate match score between query and entry
 * Returns 0 (no match) to 100 (perfect match)
 */
function scoreMatch(query: string, entry: SearchEntry, lang: "es" | "en" | "zh"): number {
  const q = normalize(query);
  if (!q) return 0;

  const title = normalize(entry.title[lang]);
  const desc = normalize(entry.description[lang]);
  const kws = entry.keywords.map(normalize);

  let score = 0;

  // Exact title match
  if (title === q) return 100;

  // Title starts with query
  if (title.startsWith(q)) score = Math.max(score, 90);

  // Title contains query
  if (title.includes(q)) score = Math.max(score, 75);

  // Keyword exact match
  if (kws.some((k) => k === q)) score = Math.max(score, 80);

  // Keyword starts with query
  if (kws.some((k) => k.startsWith(q))) score = Math.max(score, 65);

  // Keyword contains query
  if (kws.some((k) => k.includes(q))) score = Math.max(score, 55);

  // Description contains query
  if (desc.includes(q)) score = Math.max(score, 40);

  // Multi-word: all words must appear somewhere
  const words = q.split(/\s+/).filter(Boolean);
  if (words.length > 1) {
    const allText = `${title} ${desc} ${kws.join(" ")}`;
    const allMatch = words.every((w) => allText.includes(w));
    if (allMatch) score = Math.max(score, 60);
  }

  // Fuzzy: check if query chars appear in order (for typos)
  if (score === 0 && q.length >= 3) {
    let qi = 0;
    for (const ch of title) {
      if (ch === q[qi]) qi++;
      if (qi === q.length) break;
    }
    if (qi === q.length) score = Math.max(score, 25);
  }

  return score;
}

export interface SearchResult extends SearchEntry {
  score: number;
  categoryLabel: string;
}

/**
 * Search the index and return sorted results
 */
export function searchContent(
  query: string,
  lang: "es" | "en" | "zh" = "es",
  maxResults: number = 20
): SearchResult[] {
  if (!query.trim()) return [];

  const results: SearchResult[] = [];

  for (const entry of SEARCH_INDEX) {
    const score = scoreMatch(query, entry, lang);
    if (score > 0) {
      results.push({
        ...entry,
        score,
        categoryLabel: CATEGORY_LABELS[entry.category][lang],
      });
    }
  }

  // Sort by score descending, then alphabetically
  results.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return a.title[lang].localeCompare(b.title[lang]);
  });

  return results.slice(0, maxResults);
}

/**
 * Get recent/popular searches (placeholder for future DB integration)
 */
export function getSuggestedSearches(lang: "es" | "en" | "zh" = "es"): string[] {
  const suggestions: Record<string, string[]> = {
    es: ["ChatGPT", "Prompt", "Nivel 1", "Cursos IA", "Midjourney", "LUMALIN", "Arsenal"],
    en: ["ChatGPT", "Prompt", "Level 1", "AI Courses", "Midjourney", "LUMALIN", "Arsenal"],
    zh: ["ChatGPT", "提示", "第1关", "AI课程", "Midjourney", "LUMALIN", "武器库"],
  };
  return suggestions[lang] || suggestions.es;
}

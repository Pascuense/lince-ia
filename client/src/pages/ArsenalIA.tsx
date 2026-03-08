import { useState, useMemo, useEffect } from "react";
import {
  ArrowLeft,
  Search,
  Zap,
  MessageSquare,
  Image,
  Video,
  Music,
  Code,
  FileText,
  Brain,
  Briefcase,
  Palette,
  Globe,
  Shield,
  ExternalLink,
  Star,
  Filter,
  X,
  BookOpen,
  Target,
  Clock,
  CheckCircle,
  ArrowRight,
  Lightbulb,
  Info,
  GraduationCap,
  Megaphone,
  DollarSign,
  Gift,
} from "lucide-react";
import { UserNavBadge } from "@/components/UserNavBadge";
import { AVATAR_FRONTAL, AVATAR_EXPRESSIONS } from "@/lib/avatarConstants";
import { TOOLS_WITH_GUIDES } from "./ArsenalIADetail";
import { GlobalNavBar } from "@/components/GlobalNavBar";
import { BackButton } from "@/components/BackButton";

// ─── Avatar Guide for Arsenal IA ───
const GUIDE_AVATAR = {
  name: "TÍO",
  role: "El Explorador Tech",
  img: AVATAR_FRONTAL.ATOLONDRALIN,
  expr: AVATAR_EXPRESSIONS.ATOLONDRALIN,
  color: "#00E5FF",
};

// ─── Category Avatars ───
const CATEGORY_AVATARS: Record<string, { key: string; name: string; quote: string }> = {
  chat: { key: "SABELIN", name: "Duolingenio", quote: "Los chats IA son tu puerta de entrada al mundo de la inteligencia artificial. Aprende a preguntar bien y obtendrás respuestas increíbles." },
  imagen: { key: "MAMALINA", name: "Duolina", quote: "La generación de imágenes con IA es pura magia. Con un buen prompt, puedes crear arte que antes solo existía en tu imaginación." },
  video: { key: "CHAVALIN", name: "Duolín Jr", quote: "El video con IA está revolucionando la creación de contenido. Desde clips cortos hasta películas, todo es posible." },
  audio: { key: "PEQUELINA", name: "Duolincita", quote: "La música y el audio con IA abren un mundo de posibilidades creativas. Desde canciones hasta podcasts profesionales." },
  codigo: { key: "PAPALIN", name: "Duolín", quote: "Como ingeniero, te digo: estas herramientas de código con IA son el futuro. Programar nunca fue tan accesible." },
  texto: { key: "CHAVALINA", name: "Duolina Jr", quote: "Escribir con IA no es hacer trampa, es ser más eficiente. Estas herramientas te ayudan a comunicar mejor." },
  productividad: { key: "YAYALIN", name: "Duolino", quote: "En mis años de experiencia, la productividad es la clave. Estas herramientas automatizan lo repetitivo." },
  diseno: { key: "ATOLONDRALIN", name: "Duolinpistado", quote: "El diseño con IA democratiza la creatividad. Ya no necesitas ser diseñador para crear cosas profesionales." },
  investigacion: { key: "YAYALINA", name: "Duolina Abuela", quote: "La investigación con IA te permite encontrar y analizar información como nunca antes." },
  educacion: { key: "SABELIN", name: "LINCE", quote: "La educación con IA personaliza el aprendizaje. Cada persona aprende a su ritmo con su propio tutor inteligente." },
  marketing: { key: "YAYALIN", name: "Duolino", quote: "El marketing con IA te permite llegar a más personas con menos esfuerzo. Automatiza, analiza y optimiza." },
};

// ─── Tool Categories ───
const CATEGORIES = [
  { id: "all", label: "Todas", icon: <Zap className="w-4 h-4" />, color: "#00E5FF" },
  { id: "chat", label: "Chat IA", icon: <MessageSquare className="w-4 h-4" />, color: "#00E5FF" },
  { id: "imagen", label: "Imagen", icon: <Image className="w-4 h-4" />, color: "#D4A843" },
  { id: "video", label: "Video", icon: <Video className="w-4 h-4" />, color: "#FF5252" },
  { id: "audio", label: "Audio", icon: <Music className="w-4 h-4" />, color: "#9C27B0" },
  { id: "codigo", label: "Código", icon: <Code className="w-4 h-4" />, color: "#00C853" },
  { id: "texto", label: "Texto", icon: <FileText className="w-4 h-4" />, color: "#2196F3" },
  { id: "productividad", label: "Productividad", icon: <Briefcase className="w-4 h-4" />, color: "#FF9800" },
  { id: "diseno", label: "Diseño", icon: <Palette className="w-4 h-4" />, color: "#E91E63" },
  { id: "investigacion", label: "Investigación", icon: <Brain className="w-4 h-4" />, color: "#00BCD4" },
  { id: "educacion", label: "Educación", icon: <GraduationCap className="w-4 h-4" />, color: "#4CAF50" },
  { id: "marketing", label: "Marketing", icon: <Megaphone className="w-4 h-4" />, color: "#FF6F00" },
];

// ─── Pricing type ───
type PricingInfo = { free: boolean; freeTier?: string; price?: string; tokenValue?: string };

// ─── Tools Database (100 herramientas) ───
const TOOLS: Array<{
  name: string; category: string; url: string; desc: string;
  featured?: boolean; free: boolean; pricing: PricingInfo; example?: string;
}> = [
  // ═══ CHAT IA (11) ═══
  { name: "ChatGPT", category: "chat", url: "https://chat.openai.com", desc: "IA conversacional de OpenAI. Modelo GPT-4o. Texto, imagen, código, análisis de archivos.", featured: true, free: true, pricing: { free: true, freeTier: "GPT-4o mini ilimitado + GPT-4o limitado", price: "Plus: $20/mes (GPT-4o ilimitado, DALL-E, análisis avanzado)", tokenValue: "~$0.005/1K tokens input" }, example: "Escribe: 'Analiza este PDF y dame un resumen ejecutivo en 5 puntos'" },
  { name: "Claude", category: "chat", url: "https://claude.ai", desc: "IA de Anthropic. Razonamiento avanzado, análisis de documentos largos (200K tokens).", featured: true, free: true, pricing: { free: true, freeTier: "Claude Sonnet limitado (~30 msgs/día)", price: "Pro: $20/mes (uso ilimitado, Claude Opus)", tokenValue: "~$0.003/1K tokens input (Sonnet)" }, example: "Sube un contrato de 50 páginas y pide: 'Identifica las 3 cláusulas más riesgosas'" },
  { name: "Gemini", category: "chat", url: "https://gemini.google.com", desc: "IA de Google. Multimodal, integración con Google Workspace.", featured: true, free: true, pricing: { free: true, freeTier: "Gemini Flash gratis ilimitado", price: "Advanced: $19.99/mes (Gemini Ultra, 2TB Drive)", tokenValue: "~$0.00025/1K tokens (Flash)" }, example: "Pide: 'Analiza mis últimos 10 emails en Gmail y crea un resumen de tareas pendientes'" },
  { name: "Perplexity", category: "chat", url: "https://perplexity.ai", desc: "Motor de búsqueda IA con fuentes verificadas. Ideal para investigación.", featured: true, free: true, pricing: { free: true, freeTier: "5 búsquedas Pro/día + ilimitadas básicas", price: "Pro: $20/mes (búsquedas Pro ilimitadas, GPT-4, Claude)", tokenValue: "N/A - por búsqueda" }, example: "Pregunta: '¿Cuáles son las últimas tendencias en IA generativa 2025?' con fuentes" },
  { name: "Copilot", category: "chat", url: "https://copilot.microsoft.com", desc: "IA de Microsoft integrada con Office 365 y Bing.", free: true, pricing: { free: true, freeTier: "Acceso básico gratuito con GPT-4", price: "Pro: $20/mes (integración Office 365 completa)", tokenValue: "N/A" }, example: "En Word: 'Reescribe este párrafo en tono más profesional'" },
  { name: "DeepSeek", category: "chat", url: "https://chat.deepseek.com", desc: "IA china open-source. Fuerte en razonamiento matemático y código.", free: true, pricing: { free: true, freeTier: "Completamente gratuito sin límites", price: "API: $0.14/millón tokens input", tokenValue: "$0.00014/1K tokens" }, example: "Pide: 'Resuelve esta integral paso a paso y explica cada transformación'" },
  { name: "Mistral", category: "chat", url: "https://chat.mistral.ai", desc: "IA europea. Modelos eficientes, multilingüe, cumple RGPD.", free: true, pricing: { free: true, freeTier: "Chat gratuito ilimitado", price: "API: desde $0.04/millón tokens", tokenValue: "$0.00004/1K tokens" }, example: "Escribe en español, francés o alemán y obtén respuestas nativas en cada idioma" },
  { name: "Grok", category: "chat", url: "https://grok.x.ai", desc: "IA de xAI (Elon Musk). Acceso a datos en tiempo real de X/Twitter.", free: false, pricing: { free: false, freeTier: "No tiene tier gratuito", price: "X Premium: $8/mes (incluye Grok)", tokenValue: "N/A" }, example: "Pregunta: '¿Qué está siendo tendencia ahora mismo en X sobre IA?'" },
  { name: "Meta AI (Llama)", category: "chat", url: "https://meta.ai", desc: "IA de Meta con modelos Llama 3 open-source. Integrada en WhatsApp e Instagram.", free: true, pricing: { free: true, freeTier: "Completamente gratuito", price: "Open-source, sin coste de licencia", tokenValue: "Gratis (self-hosted)" }, example: "Úsalo directamente en WhatsApp: envía un mensaje a Meta AI en cualquier chat" },
  { name: "Pi", category: "chat", url: "https://pi.ai", desc: "IA conversacional empática de Inflection. Diseñada para ser amigable y personal.", free: true, pricing: { free: true, freeTier: "Completamente gratuito", price: "Sin plan de pago", tokenValue: "N/A" }, example: "Dile: 'Estoy estresado con el trabajo, ¿puedes ayudarme a organizar mis prioridades?'" },
  { name: "ChatGPT Go", category: "chat", url: "https://chatgpt.com", desc: "Versión web gratuita de ChatGPT. Acceso a GPT-4o mini sin registro.", free: true, pricing: { free: true, freeTier: "GPT-4o mini sin límites", price: "Gratis (funciones limitadas vs Plus)", tokenValue: "N/A" }, example: "Accede sin cuenta y pregunta lo que necesites al instante" },

  // ═══ IMAGEN (12) ═══
  { name: "Midjourney", category: "imagen", url: "https://midjourney.com", desc: "Líder en generación de imágenes artísticas. Calidad estética incomparable.", featured: true, free: false, pricing: { free: false, freeTier: "No tiene tier gratuito", price: "Basic: $10/mes (200 imgs), Standard: $30/mes (ilimitado)", tokenValue: "~$0.05/imagen (Basic)" }, example: "Prompt: '/imagine cyberpunk city at sunset, neon lights, rain, cinematic --ar 16:9'" },
  { name: "DALL-E 3", category: "imagen", url: "https://openai.com/dall-e-3", desc: "Generación de imágenes de OpenAI. Integrado en ChatGPT. Entiende lenguaje natural.", featured: true, free: true, pricing: { free: true, freeTier: "2 imágenes/día en ChatGPT Free", price: "Via ChatGPT Plus: $20/mes (ilimitado)", tokenValue: "API: ~$0.04/imagen (1024x1024)" }, example: "En ChatGPT: 'Genera una ilustración de un gato astronauta en estilo acuarela'" },
  { name: "Stable Diffusion", category: "imagen", url: "https://stability.ai", desc: "Generación open-source. Ejecuta en tu PC sin costes mensuales.", free: true, pricing: { free: true, freeTier: "Open-source gratis (necesita GPU)", price: "DreamStudio: $10 = 1000 créditos (~500 imgs)", tokenValue: "~$0.02/imagen" }, example: "Instala ComfyUI y genera: 'portrait of a warrior, oil painting style, dramatic lighting'" },
  { name: "Leonardo AI", category: "imagen", url: "https://leonardo.ai", desc: "Modelos especializados para juegos, personajes y diseño profesional.", free: true, pricing: { free: true, freeTier: "150 tokens/día (~30 imágenes)", price: "Apprentice: $12/mes (8500 tokens)", tokenValue: "~5 tokens/imagen" }, example: "Selecciona modelo 'RPG' y genera: 'epic fantasy warrior with golden armor'" },
  { name: "Ideogram", category: "imagen", url: "https://ideogram.ai", desc: "Excelente generando texto legible dentro de imágenes. Ideal para logos y carteles.", free: true, pricing: { free: true, freeTier: "10 prompts/día (40 imágenes)", price: "Plus: $8/mes (100 prompts/día)", tokenValue: "~$0.002/imagen (Plus)" }, example: "Genera: 'A neon sign that says LINCE in cyberpunk style'" },
  { name: "Flux", category: "imagen", url: "https://flux.ai", desc: "Modelo de Black Forest Labs. Alta calidad, generación ultra rápida.", free: true, pricing: { free: true, freeTier: "Disponible gratis en varias plataformas", price: "API: ~$0.003/imagen (vía Replicate)", tokenValue: "$0.003/imagen" }, example: "Usa en Replicate: 'professional headshot of a business woman, studio lighting'" },
  { name: "Adobe Firefly", category: "imagen", url: "https://firefly.adobe.com", desc: "IA de Adobe. Comercialmente seguro, entrenado solo con contenido con licencia.", free: true, pricing: { free: true, freeTier: "25 créditos/mes gratis", price: "Premium: $4.99/mes (100 créditos)", tokenValue: "1 crédito = 1 imagen" }, example: "Genera: 'tropical beach sunset, watercolor style' y úsalo en tu proyecto comercial sin riesgo legal" },
  { name: "Canva IA", category: "imagen", url: "https://canva.com", desc: "Diseño gráfico con IA. Templates, presentaciones, social media, todo en uno.", featured: true, free: true, pricing: { free: true, freeTier: "50 usos de Magic Write/mes + templates gratis", price: "Pro: $13/mes (todo ilimitado, marca)", tokenValue: "N/A" }, example: "Crea un post de Instagram: elige template → Magic Write → genera texto → publica" },
  { name: "Recraft AI", category: "imagen", url: "https://recraft.ai", desc: "Generador de vectores SVG e imágenes. Ideal para iconos y diseño gráfico.", free: true, pricing: { free: true, freeTier: "50 imágenes/día gratis", price: "Pro: $20/mes (ilimitado, alta resolución)", tokenValue: "~$0.01/imagen (Pro)" }, example: "Genera: 'flat vector icon of a robot head, blue and cyan colors, SVG style'" },
  { name: "Krea AI", category: "imagen", url: "https://krea.ai", desc: "Generación de imágenes en tiempo real mientras escribes. Resultados instantáneos.", free: true, pricing: { free: true, freeTier: "50 generaciones/día", price: "Pro: $30/mes (ilimitado, alta resolución)", tokenValue: "~$0.015/imagen" }, example: "Escribe y ve cómo la imagen se genera en tiempo real mientras tecleas tu descripción" },
  { name: "Playground AI", category: "imagen", url: "https://playground.com", desc: "Editor de imágenes IA con múltiples modelos. Interfaz intuitiva.", free: true, pricing: { free: true, freeTier: "500 imágenes/día gratis", price: "Pro: $15/mes (calidad mejorada, sin cola)", tokenValue: "~$0.001/imagen" }, example: "Usa el modo 'Mixed Image Editing' para combinar foto real + generación IA" },
  { name: "Clipdrop", category: "imagen", url: "https://clipdrop.co", desc: "Suite de edición IA de Stability AI. Elimina fondos, relight, upscale.", free: true, pricing: { free: true, freeTier: "Herramientas básicas gratis con watermark", price: "Pro: $9/mes (sin watermark, alta resolución)", tokenValue: "N/A" }, example: "Sube una foto → 'Relight' → cambia la iluminación como si fuera un estudio profesional" },

  // ═══ VIDEO (10) ═══
  { name: "Sora", category: "video", url: "https://sora.com", desc: "Generación de video de OpenAI. Clips realistas de hasta 1 minuto.", featured: true, free: false, pricing: { free: false, freeTier: "Incluido en ChatGPT Plus (limitado)", price: "ChatGPT Plus: $20/mes, Pro: $200/mes", tokenValue: "~50 videos/mes (Plus)" }, example: "Prompt: 'A golden retriever puppy playing in autumn leaves, slow motion, cinematic'" },
  { name: "Runway", category: "video", url: "https://runwayml.com", desc: "Suite de video IA más completa. Gen-3 Alpha, edición, efectos especiales.", featured: true, free: true, pricing: { free: true, freeTier: "125 créditos gratis (~25 segundos)", price: "Standard: $15/mes (625 créditos)", tokenValue: "5 créditos/segundo de video" }, example: "Sube una foto y genera: 'make this person walk forward slowly, cinematic lighting'" },
  { name: "Pika", category: "video", url: "https://pika.art", desc: "Videos creativos con efectos únicos: Inflate 3D, Melt, Explode, Crush.", free: true, pricing: { free: true, freeTier: "150 créditos/mes (~10 videos)", price: "Standard: $10/mes (700 créditos)", tokenValue: "~15 créditos/video" }, example: "Sube foto de un objeto → efecto 'Inflate' → se convierte en 3D animado" },
  { name: "HeyGen", category: "video", url: "https://heygen.com", desc: "Avatares de video IA realistas. Clona tu apariencia y voz en 130+ idiomas.", free: true, pricing: { free: true, freeTier: "1 minuto de video gratis", price: "Creator: $29/mes (15 min/mes)", tokenValue: "~$1.93/minuto (Creator)" }, example: "Crea tu avatar → escribe un guión → genera video profesional en español, inglés y chino" },
  { name: "Synthesia", category: "video", url: "https://synthesia.io", desc: "Videos con presentadores IA para empresas. 160+ avatares, 130+ idiomas.", free: false, pricing: { free: false, freeTier: "Demo gratuita (1 video de prueba)", price: "Starter: $22/mes (10 min/mes)", tokenValue: "~$2.20/minuto" }, example: "Elige avatar → pega tu guión de formación → genera video profesional en minutos" },
  { name: "CapCut", category: "video", url: "https://capcut.com", desc: "Editor de video gratuito de ByteDance. Subtítulos automáticos, efectos IA.", free: true, pricing: { free: true, freeTier: "Edición completa gratis (con watermark)", price: "Pro: $8/mes (sin watermark, 100GB cloud)", tokenValue: "N/A" }, example: "Sube video → Auto Captions → elige estilo de subtítulos → exporta para TikTok" },
  { name: "Kling AI", category: "video", url: "https://klingai.com", desc: "Generación de video de Kuaishou. Alta calidad, movimiento realista, lip-sync.", free: true, pricing: { free: true, freeTier: "66 créditos/día (~6 videos)", price: "Standard: $5.99/mes (660 créditos/mes)", tokenValue: "~10 créditos/video" }, example: "Prompt: 'A cat wearing sunglasses walking on a beach, slow motion, 4K'" },
  { name: "Luma Dream Machine", category: "video", url: "https://lumalabs.ai", desc: "Video 3D y escenas realistas desde texto. Especializado en movimiento de cámara.", free: true, pricing: { free: true, freeTier: "30 generaciones/mes gratis", price: "Standard: $30/mes (120 generaciones)", tokenValue: "~$0.25/generación" }, example: "Genera: 'drone shot flying over a futuristic city, golden hour, 4K'" },
  { name: "Hedra", category: "video", url: "https://hedra.com", desc: "Avatares animados desde foto + audio. Lip-sync perfecto, expresiones naturales.", free: true, pricing: { free: true, freeTier: "300 créditos/mes (~50 segundos 720p)", price: "Creator: $30/mes (3600 créditos, 1080p)", tokenValue: "~6 créditos/segundo" }, example: "Sube tu foto + graba audio → Hedra anima tu cara con lip-sync perfecto" },
  { name: "InVideo AI", category: "video", url: "https://invideo.io", desc: "Genera videos completos desde texto. Ideal para marketing y redes sociales.", free: true, pricing: { free: true, freeTier: "10 min/semana con watermark", price: "Plus: $28/mes (50 min/mes, sin watermark)", tokenValue: "~$0.56/minuto" }, example: "Escribe: 'Crea un video de 60 segundos sobre los beneficios de la IA para pymes'" },

  // ═══ AUDIO (9) ═══
  { name: "ElevenLabs", category: "audio", url: "https://elevenlabs.io", desc: "Clonación de voz y text-to-speech ultra realista. 29 idiomas.", featured: true, free: true, pricing: { free: true, freeTier: "10,000 caracteres/mes (~10 min audio)", price: "Starter: $5/mes (30K chars), Creator: $22/mes (100K chars)", tokenValue: "~$0.0002/carácter" }, example: "Clona tu voz con 30 segundos de audio → genera narración en cualquier idioma" },
  { name: "Suno", category: "audio", url: "https://suno.ai", desc: "Genera canciones completas con IA: letra, melodía, voz, producción.", featured: true, free: true, pricing: { free: true, freeTier: "50 créditos/día (~10 canciones)", price: "Pro: $10/mes (2500 créditos/mes)", tokenValue: "5 créditos/canción" }, example: "Escribe: 'reggaeton romántico sobre un amor de verano en Barcelona, voz masculina'" },
  { name: "Udio", category: "audio", url: "https://udio.com", desc: "Generación de música IA de alta calidad. Múltiples géneros y estilos.", free: true, pricing: { free: true, freeTier: "10 generaciones/día", price: "Standard: $10/mes (1200 generaciones/mes)", tokenValue: "~$0.008/generación" }, example: "Genera: 'epic orchestral soundtrack for a fantasy movie trailer, dramatic'" },
  { name: "Murf AI", category: "audio", url: "https://murf.ai", desc: "Voiceover IA profesional. 120+ voces realistas en 20+ idiomas.", free: true, pricing: { free: true, freeTier: "10 minutos de audio gratis", price: "Creator: $23/mes (48 horas/año)", tokenValue: "~$0.48/hora" }, example: "Elige voz 'Español - Carlos' → pega tu guión → genera narración profesional" },
  { name: "Descript", category: "audio", url: "https://descript.com", desc: "Edición de audio/video basada en texto. Elimina muletillas automáticamente.", free: true, pricing: { free: true, freeTier: "1 hora de transcripción/mes", price: "Hobbyist: $24/mes (10 horas/mes)", tokenValue: "~$2.40/hora" }, example: "Sube tu podcast → edita el audio editando el texto → elimina 'ehhh' y silencios" },
  { name: "Whisper", category: "audio", url: "https://openai.com/whisper", desc: "Transcripción de audio de OpenAI. Open-source, 99 idiomas.", free: true, pricing: { free: true, freeTier: "Open-source completamente gratis", price: "API: $0.006/minuto de audio", tokenValue: "$0.006/minuto" }, example: "Transcribe una reunión de 1 hora en español con 98% de precisión por $0.36" },
  { name: "Speechify", category: "audio", url: "https://speechify.com", desc: "Texto a voz natural. Lee PDFs, webs y documentos en voz alta.", free: true, pricing: { free: true, freeTier: "Lectura básica gratuita", price: "Premium: $139/año (~$11.60/mes)", tokenValue: "N/A - ilimitado" }, example: "Instala extensión → selecciona texto en cualquier web → escúchalo con voz natural" },
  { name: "Adobe Podcast", category: "audio", url: "https://podcast.adobe.com", desc: "Mejora calidad de audio con IA. Elimina ruido de fondo profesionalmente.", free: true, pricing: { free: true, freeTier: "Enhance Speech completamente gratis", price: "Gratis (parte de Adobe)", tokenValue: "N/A" }, example: "Sube audio grabado con móvil → Enhance Speech → suena como estudio profesional" },
  { name: "Soundraw", category: "audio", url: "https://soundraw.io", desc: "Música IA personalizada. Ajusta tempo, instrumentos, mood en tiempo real.", free: true, pricing: { free: true, freeTier: "Crear y previsualizar gratis, 1 descarga", price: "Creator: $16.99/mes (descargas ilimitadas)", tokenValue: "N/A" }, example: "Selecciona: mood 'energético' + género 'electrónica' + 120 BPM → genera y personaliza" },

  // ═══ CÓDIGO (9) ═══
  { name: "GitHub Copilot", category: "codigo", url: "https://github.com/features/copilot", desc: "Asistente de código IA de GitHub/Microsoft. Autocompletado, chat, revisión.", featured: true, free: false, pricing: { free: false, freeTier: "Gratis para estudiantes y open-source", price: "Individual: $10/mes, Business: $19/mes", tokenValue: "N/A" }, example: "Escribe un comentario: '// función que ordena array por fecha' → Copilot genera el código" },
  { name: "Cursor", category: "codigo", url: "https://cursor.sh", desc: "Editor de código con IA. Fork de VS Code con chat, edición y generación.", featured: true, free: true, pricing: { free: true, freeTier: "2000 completions + 50 slow requests/mes", price: "Pro: $20/mes (500 fast requests/mes)", tokenValue: "~$0.04/request" }, example: "Selecciona código → Ctrl+K → 'refactoriza esto para usar async/await' → aplica" },
  { name: "Replit", category: "codigo", url: "https://replit.com", desc: "IDE online con IA. Genera, ejecuta y despliega código en la nube.", free: true, pricing: { free: true, freeTier: "IDE gratuito + IA básica", price: "Replit Core: $25/mes (IA avanzada, más recursos)", tokenValue: "N/A" }, example: "Escribe: 'Crea una API REST en Python con Flask que gestione una lista de tareas'" },
  { name: "v0 by Vercel", category: "codigo", url: "https://v0.dev", desc: "Genera interfaces React/Next.js desde texto. Componentes shadcn/ui.", free: true, pricing: { free: true, freeTier: "10 generaciones/mes gratis", price: "Premium: $20/mes (ilimitado)", tokenValue: "~$2/generación" }, example: "Escribe: 'dashboard con sidebar, gráfico de barras y tabla de usuarios' → genera código" },
  { name: "Bolt.new", category: "codigo", url: "https://bolt.new", desc: "Genera apps web completas desde texto. Full-stack en segundos.", free: true, pricing: { free: true, freeTier: "Generaciones limitadas gratis", price: "Pro: $20/mes (tokens ilimitados)", tokenValue: "N/A" }, example: "Escribe: 'Crea un clon de Trello con drag & drop y autenticación' → app completa" },
  { name: "Windsurf", category: "codigo", url: "https://codeium.com/windsurf", desc: "IDE con IA de Codeium. Autocompletado contextual y chat integrado.", free: true, pricing: { free: true, freeTier: "Autocompletado ilimitado gratis", price: "Pro: $10/mes (chat avanzado, más modelos)", tokenValue: "N/A" }, example: "Abre tu proyecto → Windsurf entiende todo el contexto → sugiere código inteligente" },
  { name: "Tabnine", category: "codigo", url: "https://tabnine.com", desc: "Autocompletado IA que funciona en tu IDE. Privacidad: código no sale de tu máquina.", free: true, pricing: { free: true, freeTier: "Autocompletado básico gratis", price: "Pro: $12/mes (modelos avanzados, personalización)", tokenValue: "N/A" }, example: "Instala en VS Code → empieza a escribir → Tabnine completa funciones enteras" },
  { name: "Aider", category: "codigo", url: "https://aider.chat", desc: "Programación IA desde terminal. Open-source, usa GPT-4 o Claude.", free: true, pricing: { free: true, freeTier: "Open-source gratis (necesitas API key)", price: "Gratis + coste de API del modelo elegido", tokenValue: "Depende del modelo" }, example: "En terminal: 'aider --model gpt-4 → /add app.py → refactoriza el manejo de errores'" },
  { name: "Amazon Q Developer", category: "codigo", url: "https://aws.amazon.com/q/developer", desc: "IA de Amazon para código. Autocompletado, chat, seguridad, migración.", free: true, pricing: { free: true, freeTier: "Tier individual completamente gratis", price: "Business: $19/usuario/mes", tokenValue: "N/A" }, example: "Integra en VS Code → pide: 'genera tests unitarios para esta función Lambda'" },

  // ═══ TEXTO (10) ═══
  { name: "Jasper", category: "texto", url: "https://jasper.ai", desc: "Copywriting IA para marketing. Blogs, emails, anuncios, social media.", free: false, pricing: { free: false, freeTier: "7 días de prueba gratis", price: "Creator: $49/mes (1 usuario, ilimitado)", tokenValue: "N/A - ilimitado" }, example: "Template 'Blog Post' → tema: 'IA en educación' → genera artículo de 1500 palabras" },
  { name: "Copy.ai", category: "texto", url: "https://copy.ai", desc: "Generación de contenido marketing. Templates y workflows automatizados.", free: true, pricing: { free: true, freeTier: "2000 palabras/mes gratis", price: "Pro: $49/mes (ilimitado)", tokenValue: "N/A" }, example: "Elige 'Product Description' → describe tu producto → genera 5 variaciones de copy" },
  { name: "Writesonic", category: "texto", url: "https://writesonic.com", desc: "Escritura IA. Artículos SEO, landing pages, descripciones de producto.", free: true, pricing: { free: true, freeTier: "10,000 palabras/mes gratis", price: "Individual: $16/mes (ilimitado)", tokenValue: "N/A" }, example: "Genera: 'Artículo SEO de 2000 palabras sobre beneficios del yoga para principiantes'" },
  { name: "Grammarly", category: "texto", url: "https://grammarly.com", desc: "Corrección gramatical y estilo con IA. Inglés y multilingüe.", free: true, pricing: { free: true, freeTier: "Corrección básica gratuita ilimitada", price: "Premium: $12/mes (tono, claridad, plagio)", tokenValue: "N/A" }, example: "Instala extensión → escribe en cualquier web → Grammarly corrige gramática y sugiere mejoras" },
  { name: "Notion AI", category: "texto", url: "https://notion.so", desc: "IA integrada en Notion. Resúmenes, traducciones, generación de contenido.", free: true, pricing: { free: true, freeTier: "20 respuestas IA gratis", price: "AI Add-on: $10/mes por miembro", tokenValue: "N/A" }, example: "En cualquier página de Notion: selecciona texto → 'Resumir' o 'Traducir al inglés'" },
  { name: "Gamma", category: "texto", url: "https://gamma.app", desc: "Presentaciones y documentos con IA. Diseño automático profesional.", featured: true, free: true, pricing: { free: true, freeTier: "400 créditos gratis (10 presentaciones)", price: "Plus: $10/mes (ilimitado)", tokenValue: "40 créditos/presentación" }, example: "Escribe: 'Presentación sobre estrategia de marketing digital 2025' → 10 slides listas" },
  { name: "DeepL", category: "texto", url: "https://deepl.com", desc: "Traductor IA premium. Calidad superior a Google Translate en idiomas europeos.", free: true, pricing: { free: true, freeTier: "1500 caracteres por traducción", price: "Pro: $8.74/mes (archivos, glosarios, ilimitado)", tokenValue: "~$0.025/1000 chars" }, example: "Traduce un documento legal de español a alemán manteniendo el formato original" },
  { name: "QuillBot", category: "texto", url: "https://quillbot.com", desc: "Parafraseo IA. Reescribe textos manteniendo el significado con diferentes tonos.", free: true, pricing: { free: true, freeTier: "125 palabras por parafraseo", price: "Premium: $9.95/mes (ilimitado, 7 modos)", tokenValue: "N/A" }, example: "Pega un párrafo → elige modo 'Formal' → obtén versión profesional del mismo texto" },
  { name: "Rytr", category: "texto", url: "https://rytr.me", desc: "Escritura IA económica. 40+ templates, 30+ idiomas.", free: true, pricing: { free: true, freeTier: "10,000 caracteres/mes gratis", price: "Saver: $9/mes (100K chars), Unlimited: $29/mes", tokenValue: "~$0.00009/char" }, example: "Template 'Email' → tono: profesional → tema: seguimiento de propuesta → genera email" },
  { name: "Wordtune", category: "texto", url: "https://wordtune.com", desc: "Reescritura IA. Mejora claridad, tono y estilo de tus textos.", free: true, pricing: { free: true, freeTier: "10 reescrituras/día gratis", price: "Plus: $9.99/mes (ilimitado)", tokenValue: "N/A" }, example: "Selecciona una frase → Wordtune ofrece 5 alternativas más claras y profesionales" },

  // ═══ PRODUCTIVIDAD (11) ═══
  { name: "Zapier AI", category: "productividad", url: "https://zapier.com", desc: "Automatización de workflows con IA. Conecta 6000+ apps sin código.", featured: true, free: true, pricing: { free: true, freeTier: "100 tareas/mes + 5 zaps gratis", price: "Starter: $19.99/mes (750 tareas)", tokenValue: "~$0.027/tarea" }, example: "Automatiza: 'Cuando reciba email con factura → extraer datos → añadir a Google Sheets'" },
  { name: "Make (Integromat)", category: "productividad", url: "https://make.com", desc: "Automatización visual de procesos. Más flexible que Zapier para flujos complejos.", free: true, pricing: { free: true, freeTier: "1000 operaciones/mes gratis", price: "Core: $9/mes (10K operaciones)", tokenValue: "~$0.0009/operación" }, example: "Crea flujo visual: Webhook → procesar datos → enviar a CRM → notificar por Slack" },
  { name: "n8n", category: "productividad", url: "https://n8n.io", desc: "Automatización open-source. Self-hosted, personalizable, sin límites.", free: true, pricing: { free: true, freeTier: "Open-source gratis (self-hosted)", price: "Cloud: $20/mes (5K ejecuciones)", tokenValue: "~$0.004/ejecución" }, example: "Instala en tu servidor → conecta APIs → automatiza procesos sin límites ni costes" },
  { name: "Otter.ai", category: "productividad", url: "https://otter.ai", desc: "Transcripción de reuniones en tiempo real. Resúmenes y action items automáticos.", free: true, pricing: { free: true, freeTier: "300 min/mes de transcripción", price: "Pro: $16.99/mes (1200 min/mes)", tokenValue: "~$0.014/minuto" }, example: "Conecta con Zoom → Otter transcribe la reunión → genera resumen con tareas asignadas" },
  { name: "Fireflies.ai", category: "productividad", url: "https://fireflies.ai", desc: "Asistente de reuniones IA. Transcribe, resume y busca en tus reuniones.", free: true, pricing: { free: true, freeTier: "800 min de almacenamiento", price: "Pro: $18/mes (ilimitado)", tokenValue: "N/A" }, example: "Invita a fred@fireflies.ai a tu reunión → transcripción automática + resumen por email" },
  { name: "Reclaim AI", category: "productividad", url: "https://reclaim.ai", desc: "Gestión inteligente de calendario. Prioriza tareas y protege tiempo de enfoque.", free: true, pricing: { free: true, freeTier: "Plan gratuito con funciones básicas", price: "Starter: $8/mes (hábitos, analytics)", tokenValue: "N/A" }, example: "Conecta Google Calendar → Reclaim programa automáticamente tus tareas en huecos libres" },
  { name: "Taskade", category: "productividad", url: "https://taskade.com", desc: "Gestión de proyectos con IA. Genera tareas, mind maps, workflows automáticos.", free: true, pricing: { free: true, freeTier: "1 espacio de trabajo gratis", price: "Pro: $8/mes/usuario (IA ilimitada)", tokenValue: "N/A" }, example: "Escribe: 'Plan de lanzamiento de producto' → genera proyecto con tareas, plazos y responsables" },
  { name: "Mem", category: "productividad", url: "https://mem.ai", desc: "Notas IA auto-organizadas. Encuentra información sin carpetas ni etiquetas.", free: true, pricing: { free: true, freeTier: "Funciones básicas gratis", price: "Pro: $14.99/mes (IA avanzada, integraciones)", tokenValue: "N/A" }, example: "Escribe notas libremente → Mem las organiza por contexto → busca: '¿qué decidimos sobre el presupuesto?'" },
  { name: "Tome", category: "productividad", url: "https://tome.app", desc: "Presentaciones IA. Genera slides completas desde una idea.", free: true, pricing: { free: true, freeTier: "500 créditos gratis", price: "Pro: $16/mes (ilimitado)", tokenValue: "~50 créditos/presentación" }, example: "Escribe: 'Pitch deck para startup educativa' → genera presentación de 10 slides con diseño" },
  { name: "Beautiful.ai", category: "productividad", url: "https://beautiful.ai", desc: "Presentaciones inteligentes. Diseño automático que se adapta al contenido.", free: true, pricing: { free: true, freeTier: "14 días de prueba gratis", price: "Pro: $12/mes (ilimitado, exportar)", tokenValue: "N/A" }, example: "Añade datos → Beautiful.ai ajusta automáticamente el layout para que se vea profesional" },
  { name: "Coda AI", category: "productividad", url: "https://coda.io", desc: "Documentos + automatización + IA. Como Notion pero con más poder de cálculo.", free: true, pricing: { free: true, freeTier: "Documentos gratis + IA limitada", price: "Pro: $10/mes (IA ilimitada, automatizaciones)", tokenValue: "N/A" }, example: "Crea tabla de seguimiento → Coda AI genera fórmulas y automatiza notificaciones" },

  // ═══ DISEÑO (9) ═══
  { name: "Figma AI", category: "diseno", url: "https://figma.com", desc: "Diseño colaborativo con IA. Genera componentes, auto-layout, prototipado.", featured: true, free: true, pricing: { free: true, freeTier: "3 proyectos gratis + IA básica", price: "Professional: $15/mes (ilimitado)", tokenValue: "N/A" }, example: "Selecciona frame → 'Generate UI' → describe: 'formulario de registro moderno' → genera" },
  { name: "Framer", category: "diseno", url: "https://framer.com", desc: "Diseño web con IA. Genera sitios completos y responsivos desde texto.", free: true, pricing: { free: true, freeTier: "1 sitio gratis (con dominio framer)", price: "Mini: $5/mes, Basic: $15/mes (dominio propio)", tokenValue: "N/A" }, example: "Escribe: 'Landing page para app de fitness, estilo minimalista' → sitio web completo" },
  { name: "Looka", category: "diseno", url: "https://looka.com", desc: "Generación de logos y branding con IA. Kit de marca completo.", free: true, pricing: { free: true, freeTier: "Generar y previsualizar gratis", price: "Basic: $20 (1 logo), Premium: $65 (kit completo)", tokenValue: "Pago único" }, example: "Ingresa nombre + industria + colores preferidos → genera 100+ opciones de logo" },
  { name: "Remove.bg", category: "diseno", url: "https://remove.bg", desc: "Elimina fondos de imágenes automáticamente con IA. Resultados en 5 segundos.", free: true, pricing: { free: true, freeTier: "1 imagen HD gratis + previews ilimitados", price: "Créditos: desde $0.20/imagen", tokenValue: "$0.20/imagen HD" }, example: "Sube foto de producto → fondo eliminado en 5 segundos → descarga PNG transparente" },
  { name: "Photoroom", category: "diseno", url: "https://photoroom.com", desc: "Edición de fotos de producto con IA. E-commerce, social media, catálogos.", free: true, pricing: { free: true, freeTier: "Edición básica gratis con watermark", price: "Pro: $9.99/mes (sin watermark, batch)", tokenValue: "N/A" }, example: "Sube foto de producto → elimina fondo → añade fondo profesional → listo para tienda" },
  { name: "Spline AI", category: "diseno", url: "https://spline.design", desc: "Diseño 3D con IA en el navegador. Genera objetos 3D desde texto.", free: true, pricing: { free: true, freeTier: "Editor 3D completo gratis", price: "Pro: $7/mes (exportar, colaborar)", tokenValue: "N/A" }, example: "Escribe: 'robot futurista con ojos brillantes' → genera modelo 3D interactivo" },
  { name: "Uizard", category: "diseno", url: "https://uizard.io", desc: "Wireframes y mockups desde texto o bocetos a mano. Prototipado rápido.", free: true, pricing: { free: true, freeTier: "3 proyectos gratis", price: "Pro: $12/mes (ilimitado, componentes)", tokenValue: "N/A" }, example: "Sube foto de boceto en papel → Uizard lo convierte en wireframe digital editable" },
  { name: "Galileo AI", category: "diseno", url: "https://usegalileo.ai", desc: "Genera diseños UI completos desde descripciones de texto. Alta fidelidad.", free: true, pricing: { free: true, freeTier: "Acceso limitado gratuito", price: "Pro: $19/mes (generaciones ilimitadas)", tokenValue: "N/A" }, example: "Describe: 'app de delivery con mapa, lista de restaurantes y carrito' → diseño completo" },
  { name: "Vizcom", category: "diseno", url: "https://vizcom.ai", desc: "Transforma bocetos a mano en renders fotorrealistas. Ideal para diseño industrial.", free: true, pricing: { free: true, freeTier: "Renders limitados gratis", price: "Pro: $29/mes (ilimitado, alta resolución)", tokenValue: "N/A" }, example: "Dibuja boceto de zapatilla → Vizcom genera render 3D fotorrealista con materiales" },

  // ═══ INVESTIGACIÓN (8) ═══
  { name: "NotebookLM", category: "investigacion", url: "https://notebooklm.google.com", desc: "IA de Google para investigación. Sube documentos, genera podcasts y resúmenes.", featured: true, free: true, pricing: { free: true, freeTier: "Completamente gratuito", price: "Gratis (producto de Google)", tokenValue: "N/A" }, example: "Sube 5 PDFs de investigación → pide: 'genera un podcast de 10 minutos resumiendo los hallazgos'" },
  { name: "Consensus", category: "investigacion", url: "https://consensus.app", desc: "Búsqueda de papers académicos con IA. Respuestas basadas en ciencia.", free: true, pricing: { free: true, freeTier: "20 búsquedas IA/mes", price: "Premium: $8.99/mes (ilimitado)", tokenValue: "~$0.45/búsqueda" }, example: "Pregunta: '¿La meditación reduce la ansiedad?' → respuesta con citas de 10+ papers" },
  { name: "Elicit", category: "investigacion", url: "https://elicit.com", desc: "Asistente de investigación IA. Analiza papers, extrae datos, compara estudios.", free: true, pricing: { free: true, freeTier: "5000 créditos gratis", price: "Plus: $10/mes (12K créditos/mes)", tokenValue: "~1 crédito/paper analizado" }, example: "Busca: 'efectos del ejercicio en la depresión' → tabla comparativa de 20 estudios" },
  { name: "Semantic Scholar", category: "investigacion", url: "https://semanticscholar.org", desc: "Buscador académico con IA de Allen Institute. 200M+ papers indexados.", free: true, pricing: { free: true, freeTier: "Completamente gratuito", price: "Gratis (sin restricciones)", tokenValue: "N/A" }, example: "Busca papers y usa 'TLDR' para ver resúmenes automáticos de cada artículo" },
  { name: "Connected Papers", category: "investigacion", url: "https://connectedpapers.com", desc: "Visualiza conexiones entre papers. Mapas de conocimiento interactivos.", free: true, pricing: { free: true, freeTier: "5 gráficos/mes gratis", price: "Academic: $3/mes (ilimitado)", tokenValue: "~$0.60/gráfico" }, example: "Pega DOI de un paper → genera mapa visual de papers relacionados y citados" },
  { name: "SciSpace", category: "investigacion", url: "https://scispace.com", desc: "Lee y comprende papers con IA. Explicaciones simplificadas de artículos complejos.", free: true, pricing: { free: true, freeTier: "5 papers/mes con IA", price: "Premium: $12/mes (ilimitado)", tokenValue: "~$2.40/paper" }, example: "Sube paper técnico → SciSpace explica cada sección en lenguaje simple con ejemplos" },
  { name: "Humata", category: "investigacion", url: "https://humata.ai", desc: "Análisis de PDFs con IA. Pregunta sobre tus documentos y obtén respuestas citadas.", free: true, pricing: { free: true, freeTier: "60 páginas/mes gratis", price: "Pro: $14.99/mes (ilimitado)", tokenValue: "~$0.25/página" }, example: "Sube contrato de 100 páginas → pregunta: '¿cuáles son las penalizaciones por incumplimiento?'" },
  { name: "Litmaps", category: "investigacion", url: "https://litmaps.com", desc: "Mapas de literatura científica. Descubre papers relevantes automáticamente.", free: true, pricing: { free: true, freeTier: "5 mapas gratis", price: "Pro: $10/mes (ilimitado)", tokenValue: "~$2/mapa" }, example: "Añade 3 papers clave → Litmaps genera mapa con 50+ papers relacionados por relevancia" },

  // ═══ EDUCACIÓN (3) ═══
  { name: "Duolingo", category: "educacion", url: "https://duolingo.com", desc: "Aprende idiomas jugando con IA. La inspiración de LINCE. 40+ idiomas.", featured: true, free: true, pricing: { free: true, freeTier: "Completamente gratis (con anuncios)", price: "Plus: $6.99/mes (sin anuncios, vidas ilimitadas)", tokenValue: "N/A" }, example: "5 minutos al día → lecciones adaptativas → rachas y XP → aprende jugando" },
  { name: "Khan Academy Khanmigo", category: "educacion", url: "https://khanacademy.org", desc: "Tutor IA personalizado. Matemáticas, ciencias, programación. Todo gratis.", free: true, pricing: { free: true, freeTier: "Todo el contenido gratis", price: "Khanmigo: $4/mes (tutor IA personal)", tokenValue: "N/A" }, example: "Pide a Khanmigo: 'Explícame derivadas como si tuviera 15 años' → explicación paso a paso" },
  { name: "Quizlet AI", category: "educacion", url: "https://quizlet.com", desc: "Flashcards IA. Genera tarjetas de estudio automáticamente desde tus apuntes.", free: true, pricing: { free: true, freeTier: "Flashcards básicas gratis", price: "Plus: $7.99/mes (IA, sin anuncios)", tokenValue: "N/A" }, example: "Sube apuntes de biología → Quizlet genera 50 flashcards + test de práctica automático" },

  // ═══ MARKETING/SEO (4) ═══
  { name: "Surfer SEO", category: "marketing", url: "https://surferseo.com", desc: "SEO con IA. Optimiza contenido para posicionar en Google. Análisis de competencia.", free: true, pricing: { free: true, freeTier: "Herramientas básicas gratis", price: "Essential: $89/mes (30 artículos/mes)", tokenValue: "~$2.97/artículo" }, example: "Escribe artículo → Surfer analiza top 10 de Google → sugiere palabras clave y estructura" },
  { name: "Semrush AI", category: "marketing", url: "https://semrush.com", desc: "Suite de marketing digital con IA. SEO, PPC, redes sociales, contenido.", free: true, pricing: { free: true, freeTier: "10 búsquedas/día gratis", price: "Pro: $139.95/mes (completo)", tokenValue: "N/A" }, example: "Analiza dominio competidor → ve sus keywords → genera estrategia SEO con IA" },
  { name: "HubSpot AI", category: "marketing", url: "https://hubspot.com", desc: "CRM + marketing + ventas con IA. Automatización de emails y leads.", free: true, pricing: { free: true, freeTier: "CRM gratuito + herramientas básicas", price: "Starter: $20/mes (email marketing, formularios)", tokenValue: "N/A" }, example: "CRM gratis → IA genera emails personalizados → automatiza seguimiento de leads" },
  { name: "Hootsuite AI", category: "marketing", url: "https://hootsuite.com", desc: "Gestión de redes sociales con IA. Programa posts, analiza rendimiento.", free: true, pricing: { free: true, freeTier: "30 días de prueba gratis", price: "Professional: $99/mes (10 cuentas sociales)", tokenValue: "N/A" }, example: "Conecta Instagram + Twitter + LinkedIn → IA sugiere mejor hora → programa 30 posts" },
  { name: "Hedra", category: "video", url: "https://hedra.com", desc: "Avatares animados desde fotos. Convierte selfies en personajes que hablan y cantan con IA.", featured: true, free: true, pricing: { free: true, freeTier: "5 vídeos gratis/mes (30s)", price: "Pro: $9/mes (vídeos ilimitados, 2 min)", tokenValue: "~$1.80/vídeo" }, example: "Sube tu selfie + texto → Hedra anima tu cara hablando con labios sincronizados" },
  { name: "Writesonic", category: "texto", url: "https://writesonic.com", desc: "Redacción IA para marketing. Blogs, anuncios, landing pages, emails en segundos.", free: true, pricing: { free: true, freeTier: "10.000 palabras/mes gratis", price: "Pro: $19/mes (ilimitado + GPT-4)", tokenValue: "~$0.002/palabra" }, example: "Escribe: 'Blog sobre beneficios del yoga' → artículo SEO de 1500 palabras en 30 segundos" },
  { name: "Otter.ai", category: "audio", url: "https://otter.ai", desc: "Transcripción de reuniones con IA. Notas automáticas, resúmenes y action items.", free: true, pricing: { free: true, freeTier: "300 min/mes gratis", price: "Pro: $16.99/mes (6000 min/mes)", tokenValue: "~$0.003/minuto" }, example: "Graba reunión de Zoom → Otter transcribe en tiempo real → genera resumen con tareas" },
  { name: "Descript", category: "audio", url: "https://descript.com", desc: "Edición de audio/vídeo como texto. Borra palabras del texto y se borran del audio.", free: true, pricing: { free: true, freeTier: "1 hora de transcripción gratis", price: "Pro: $24/mes (10h transcripción + exportación)", tokenValue: "~$2.40/hora" }, example: "Sube podcast → edita eliminando 'ehh' y silencios del texto → audio limpio automático" },
];

// ─── Detailed tool descriptions for modal ───
const TOOL_DETAILS: Record<string, { whatIs: string; bestFor: string[]; howToStart: string; avatar: string }> = {
  "ChatGPT": { whatIs: "ChatGPT es la IA conversacional más popular del mundo, creada por OpenAI. Usa el modelo GPT-4o para entender y generar texto, analizar imágenes, escribir código y crear imágenes con DALL-E 3 integrado.", bestFor: ["Redactar emails, informes y documentos profesionales", "Analizar datos y documentos (PDFs, CSVs, imágenes)", "Generar y depurar código en cualquier lenguaje", "Brainstorming y generación de ideas creativas"], howToStart: "Ve a chat.openai.com, crea cuenta gratuita. Versión free incluye GPT-4o mini. Plus ($20/mes) desbloquea GPT-4o, DALL-E 3 y análisis avanzado.", avatar: "SABELIN" },
  "Claude": { whatIs: "Claude es la IA de Anthropic, diseñada para ser segura y útil. Destaca en razonamiento complejo, análisis de documentos largos (hasta 200K tokens) y escritura creativa de alta calidad.", bestFor: ["Análisis de documentos extensos (contratos, informes)", "Razonamiento lógico y resolución de problemas complejos", "Escritura creativa y literaria", "Programación con explicaciones detalladas"], howToStart: "Visita claude.ai, regístrate con email. Versión gratuita incluye Claude Sonnet. Pro cuesta $20/mes.", avatar: "SABELIN" },
  "Gemini": { whatIs: "Gemini es la IA de Google, integrada con Gmail, Docs, Drive y Maps. Multimodal: entiende texto, imágenes, audio y video.", bestFor: ["Integración con Google Workspace", "Análisis multimodal (texto + imagen + audio)", "Búsqueda con información actualizada", "Generación de contenido para YouTube"], howToStart: "Accede a gemini.google.com con tu cuenta Google. Gratis. Advanced ($19.99/mes) ofrece modelo más potente.", avatar: "SABELIN" },
  "Midjourney": { whatIs: "Midjourney es el líder en generación de imágenes artísticas con IA. Calidad estética impresionante, desde fotorrealismo hasta estilos artísticos únicos.", bestFor: ["Arte conceptual e ilustraciones", "Diseño de personajes y escenarios", "Fotografía artística", "Branding y diseño visual"], howToStart: "Ve a midjourney.com y suscríbete (desde $10/mes). Escribe /imagine seguido de tu descripción.", avatar: "MAMALINA" },
  "Hedra": { whatIs: "Hedra crea avatares animados a partir de una foto y audio. Genera lip-sync perfecto y expresiones faciales naturales. Ideal para contenido personalizado y presentaciones.", bestFor: ["Crear avatares animados desde una foto", "Lip-sync perfecto con cualquier audio", "Videos personalizados para redes sociales", "Presentaciones con tu avatar hablando"], howToStart: "Regístrate en hedra.com. 300 créditos gratis/mes (~50 segundos 720p). Creator: $30/mes para 1080p.", avatar: "CHAVALIN" },
  "Suno": { whatIs: "Suno genera canciones completas con IA: letra, melodía, voz y producción. Describe el estilo y tema, y obtén una canción profesional en segundos.", bestFor: ["Crear canciones originales con letra y melodía", "Producción musical sin conocimientos técnicos", "Jingles y música para contenido", "Experimentar con géneros musicales"], howToStart: "Ve a suno.ai. 50 créditos/día gratis (~10 canciones). Pro: $10/mes para 2500 créditos.", avatar: "PEQUELINA" },
  "ElevenLabs": { whatIs: "ElevenLabs ofrece clonación de voz y text-to-speech ultra realista en 29 idiomas. Puedes clonar tu propia voz con solo 30 segundos de audio.", bestFor: ["Narración profesional para videos y podcasts", "Clonación de voz personalizada", "Audiolibros y contenido educativo", "Doblaje multilingüe"], howToStart: "Regístrate en elevenlabs.io. 10K caracteres/mes gratis (~10 min). Starter: $5/mes.", avatar: "PEQUELINA" },
  "Runway": { whatIs: "Runway es la suite de video IA más completa. Gen-3 Alpha genera videos de alta calidad, con herramientas de edición, eliminación de fondos y efectos especiales.", bestFor: ["Generación de video desde texto o imagen", "Edición profesional de video con IA", "Efectos especiales y motion graphics", "Contenido para marketing"], howToStart: "Regístrate en runwayml.com. 125 créditos gratis (~25 segundos). Standard: $15/mes.", avatar: "CHAVALIN" },
  "Kling AI": { whatIs: "Kling AI de Kuaishou genera videos de alta calidad con movimiento realista y lip-sync. Uno de los mejores generadores de video gratuitos disponibles.", bestFor: ["Videos con movimiento realista", "Lip-sync y animación facial", "Contenido para redes sociales", "Clips creativos y artísticos"], howToStart: "Ve a klingai.com. 66 créditos/día gratis (~6 videos). Standard: $5.99/mes.", avatar: "CHAVALIN" },
  "HeyGen": { whatIs: "HeyGen crea videos con avatares IA realistas que hablan en 130+ idiomas. Puedes clonar tu apariencia y voz para crear contenido personalizado.", bestFor: ["Videos de formación corporativa", "Presentaciones con avatar personal", "Marketing personalizado", "Traducción de videos"], howToStart: "Regístrate en heygen.com. 1 minuto gratis. Creator: $29/mes (15 min/mes).", avatar: "YAYALIN" },
};

// ─── Tool Detail Modal ───
function ToolDetailModal({ tool, onClose }: { tool: typeof TOOLS[0]; onClose: () => void }) {
  const details = TOOL_DETAILS[tool.name];
  const hasGuide = TOOLS_WITH_GUIDES.some(g => g.name === tool.name);
  const catAvatar = CATEGORY_AVATARS[tool.category];
  const avatarKey = details?.avatar || catAvatar?.key || "SABELIN";
  const avatarImg = AVATAR_FRONTAL[avatarKey] || AVATAR_FRONTAL.SABELIN;
  const avatarExpr = AVATAR_EXPRESSIONS[avatarKey];
  const catColor = CATEGORIES.find(c => c.id === tool.category)?.color || "#00E5FF";

  return (
    <div className="pt-14 fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
      <BackButton variant="inline" />
      <GlobalNavBar />
      <div className="bg-gradient-to-b from-[#0D1117] to-[#1A1A2E] border border-white/10 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${catColor}20` }}>
              <Info className="w-5 h-5" style={{ color: catColor }} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">{tool.name}</h2>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: `${catColor}15`, color: catColor }}>
                  {CATEGORIES.find(c => c.id === tool.category)?.label}
                </span>
                {tool.free ? (
                  <span className="text-[10px] font-bold text-[#00C853] px-2 py-0.5 rounded-full bg-[#00C853]/10">Gratis</span>
                ) : (
                  <span className="text-[10px] font-bold text-[#FF9800] px-2 py-0.5 rounded-full bg-[#FF9800]/10">Premium</span>
                )}
              </div>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
            <X className="w-4 h-4 text-white" />
          </button>
        </div>

        <div className="p-5 space-y-5">
          {/* Avatar Guide */}
          <div className="flex items-start gap-3 p-4 rounded-xl bg-white/[0.03] border border-white/[0.08]">
            <img src={avatarExpr?.feliz || avatarImg} alt="" className="w-12 h-12 rounded-full object-cover border-2 flex-shrink-0" style={{ borderColor: catColor }} />
            <div>
              <p className="text-xs font-bold mb-1" style={{ color: catColor }}>{avatarKey.replace(/_/g, " ")} te explica:</p>
              <p className="text-gray-300 text-sm italic leading-relaxed">
                "{catAvatar?.quote || `Esta herramienta es una de las mejores en su categoría.`}"
              </p>
            </div>
          </div>

          {details ? (
            <>
              <div>
                <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                  <BookOpen className="w-4 h-4" style={{ color: catColor }} /> ¿Qué es {tool.name}?
                </h3>
                <p className="text-gray-300 text-sm leading-relaxed">{details.whatIs}</p>
              </div>
              <div>
                <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                  <Target className="w-4 h-4" style={{ color: catColor }} /> Ideal para:
                </h3>
                <ul className="space-y-1.5">
                  {details.bestFor.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-gray-300 text-sm">
                      <CheckCircle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" style={{ color: catColor }} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.08]">
                <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-yellow-400" /> ¿Cómo empezar?
                </h3>
                <p className="text-gray-300 text-sm leading-relaxed">{details.howToStart}</p>
              </div>
            </>
          ) : (
            <div>
              <h3 className="text-sm font-bold text-white mb-2">Descripción</h3>
              <p className="text-gray-300 text-sm leading-relaxed">{tool.desc}</p>
            </div>
          )}

          {/* Pricing Details */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-[#00E5FF]/5 to-[#D4A843]/5 border border-white/[0.08]">
            <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-[#D4A843]" /> Precios y acceso
            </h3>
            <div className="space-y-2">
              {tool.pricing.freeTier && (
                <div className="flex items-start gap-2">
                  <Gift className="w-3.5 h-3.5 mt-0.5 text-[#00C853] flex-shrink-0" />
                  <div>
                    <span className="text-[#00C853] text-xs font-bold">Gratis: </span>
                    <span className="text-gray-300 text-xs">{tool.pricing.freeTier}</span>
                  </div>
                </div>
              )}
              {tool.pricing.price && (
                <div className="flex items-start gap-2">
                  <DollarSign className="w-3.5 h-3.5 mt-0.5 text-[#D4A843] flex-shrink-0" />
                  <div>
                    <span className="text-[#D4A843] text-xs font-bold">Pago: </span>
                    <span className="text-gray-300 text-xs">{tool.pricing.price}</span>
                  </div>
                </div>
              )}
              {tool.pricing.tokenValue && tool.pricing.tokenValue !== "N/A" && (
                <div className="flex items-start gap-2">
                  <Zap className="w-3.5 h-3.5 mt-0.5 text-[#00E5FF] flex-shrink-0" />
                  <div>
                    <span className="text-[#00E5FF] text-xs font-bold">Valor token: </span>
                    <span className="text-gray-300 text-xs">{tool.pricing.tokenValue}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Example */}
          {tool.example && (
            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.08]">
              <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                <ArrowRight className="w-4 h-4" style={{ color: catColor }} /> Ejemplo de uso:
              </h3>
              <p className="text-gray-400 text-sm italic leading-relaxed">"{tool.example}"</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <a
              href={tool.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-bold text-sm transition-all hover:scale-[1.02]"
              style={{ backgroundColor: catColor, color: "#0A0A0A" }}
            >
              <ExternalLink className="w-4 h-4" /> Abrir {tool.name}
            </a>
            {hasGuide && (
              <a
                href={`/arsenal-ia/${TOOLS_WITH_GUIDES.find(g => g.name === tool.name)!.id}`}
                className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-bold text-sm border transition-all hover:scale-[1.02]"
                style={{ borderColor: `${catColor}40`, color: catColor }}
              >
                <BookOpen className="w-4 h-4" /> Ver guía paso a paso
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ArsenalIA() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedTool, setSelectedTool] = useState<typeof TOOLS[0] | null>(null);

  // Mark arsenal mission as complete for welcome missions
  useEffect(() => {
    try { localStorage.setItem("lince-mission-arsenal", "true"); } catch {}
  }, []);

  const filteredTools = useMemo(() => {
    return TOOLS.filter((tool) => {
      const matchesCategory = activeCategory === "all" || tool.category === activeCategory;
      const matchesSearch = search === "" ||
        tool.name.toLowerCase().includes(search.toLowerCase()) ||
        tool.desc.toLowerCase().includes(search.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [search, activeCategory]);

  const featuredTools = useMemo(() => TOOLS.filter(t => t.featured), []);

  const categoryColor = (catId: string) => CATEGORIES.find(c => c.id === catId)?.color || "#00E5FF";

  return (
    <div className="bg-[#0A0A0A] min-h-screen">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#0A0A0A]/95 backdrop-blur-md border-b border-[#00E5FF]/10">
        <div className="container flex items-center justify-between h-16">
          <a href="/" className="flex items-center gap-1">
            <ArrowLeft className="w-4 h-4 text-[#B0B0B0]" />
            
            <span className="font-['Space_Grotesk'] font-bold text-base text-[#00E5FF]">LINCE</span>
          </a>
          <div className="flex items-center gap-2">
            <span className="text-[#00E5FF] text-xs font-medium px-3 py-1 rounded-full bg-[#00E5FF]/10 border border-[#00E5FF]/30 flex items-center gap-1.5">
              <Zap className="w-3 h-3" /> {TOOLS.length} herramientas
            </span>
            <UserNavBadge variant="compact" />
          </div>
        </div>
      </header>

      <main className="pt-24 pb-16">
        <div className="container max-w-6xl">
          {/* Hero */}
          <div className="text-center mb-10">
            <div className="flex justify-center mb-4">
              <div className="relative">
                <img src={GUIDE_AVATAR.img} alt={GUIDE_AVATAR.name} className="w-20 h-20 rounded-full object-cover border-2 border-[#00E5FF]" />
                <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#00E5FF] flex items-center justify-center">
                  <Zap className="w-3 h-3 text-[#0A0A0A]" />
                </div>
              </div>
            </div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#00E5FF]/30 bg-[#00E5FF]/5 mb-4">
              <Zap className="w-4 h-4 text-[#00E5FF]" />
              <span className="text-[#00E5FF] text-sm font-medium">Ecosistema de Herramientas IA</span>
            </div>
            <h1 className="font-['Space_Grotesk'] font-bold text-4xl sm:text-6xl text-white mb-5">
              Arsenal <span className="text-[#00E5FF]">IA</span>
            </h1>
            <p className="text-white/70 text-lg sm:text-xl max-w-2xl mx-auto mb-3">
              <span className="text-[#00E5FF] font-bold">{TOOLS.length} herramientas</span> de inteligencia artificial organizadas en{" "}
              <span className="text-[#D4A843] font-bold">{CATEGORIES.length - 1} categorías</span>.
              Todas verificadas, con precios actualizados y ejemplos de uso.
            </p>
            <p className="text-cyan-400/70 text-base max-w-xl mx-auto">
              Haz clic en cualquier herramienta para ver precios, acceso gratuito, valor del token y ejemplo de uso.
            </p>
            <div className="mt-4 inline-flex items-center gap-3 px-5 py-3 rounded-2xl bg-white/[0.03] border border-[#00E5FF]/15">
              <img src={GUIDE_AVATAR.expr?.feliz || GUIDE_AVATAR.img} alt="" className="w-10 h-10 rounded-full object-cover" />
              <p className="text-[#B0B0B0] text-sm italic text-left">
                "Soy <span className="text-[#00E5FF] font-bold">Duolinpistado</span>, el explorador tech.
                Probé cada una de estas {TOOLS.length} herramientas para que tú solo uses las mejores."
              </p>
            </div>
          </div>

          {/* Search */}
          <div className="relative mb-8">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-white/30" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar herramienta por nombre o descripción..."
              className="w-full pl-14 pr-5 py-4 bg-white/[0.04] border-2 border-white/[0.1] rounded-2xl text-lg text-white placeholder:text-white/30 focus:border-[#00E5FF]/50 focus:outline-none transition-colors"
            />
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2.5 mb-10">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all border-2 ${
                  activeCategory === cat.id
                    ? `text-[#0A0A0A] border-transparent`
                    : "bg-white/[0.02] border-white/[0.06] text-[#B0B0B0] hover:border-white/[0.15] hover:text-white"
                }`}
                style={activeCategory === cat.id ? { backgroundColor: cat.color } : {}}
              >
                {cat.icon} {cat.label}
                {cat.id !== "all" && (
                  <span className="text-[10px] opacity-70">
                    ({TOOLS.filter(t => t.category === cat.id).length})
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Featured Section */}
          {activeCategory === "all" && !search && (
            <div className="mb-10">
              <h3 className="font-['Space_Grotesk'] font-bold text-white text-lg mb-4 flex items-center gap-2">
                <Star className="w-5 h-5 text-[#D4A843]" /> Destacadas
              </h3>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {featuredTools.map((tool, i) => (
                  <button key={i} onClick={() => setSelectedTool(tool)}
                    className="group p-4 bg-gradient-to-br from-[#D4A843]/[0.06] to-transparent border border-[#D4A843]/20 rounded-xl hover:border-[#D4A843]/40 transition-all text-left">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-['Space_Grotesk'] font-bold text-white text-sm group-hover:text-[#D4A843] transition-colors truncate">{tool.name}</h4>
                      <Info className="w-3.5 h-3.5 text-[#B0B0B0]/30 group-hover:text-[#D4A843] transition-colors flex-shrink-0" />
                    </div>
                    <p className="text-[#B0B0B0] text-[11px] leading-relaxed line-clamp-2">{tool.desc}</p>
                    <div className="flex items-center gap-2 mt-2">
                      {tool.free && <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold">FREE</span>}
                      {tool.pricing?.price && <span className="text-[9px] text-[#B0B0B0]/50">{tool.pricing.price.split('(')[0]}</span>}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Search bar */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#B0B0B0]/50" />
            <input
              type="text"
              placeholder="Buscar herramienta..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-[#111] border border-[#222] rounded-xl text-white text-sm placeholder:text-[#B0B0B0]/40 focus:border-[#00E5FF]/50 focus:outline-none transition-colors"
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#B0B0B0]/50 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Results count */}
          <p className="text-white/50 text-sm mb-5 font-medium">{filteredTools.length} de {TOOLS.length} herramientas</p>

          {/* Tools Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredTools.map((tool, i) => (
              <button key={i} onClick={() => setSelectedTool(tool)}
                className="group p-5 sm:p-6 bg-[#111] border-2 border-[#222] rounded-2xl hover:border-[#00E5FF]/30 transition-all text-left min-h-[140px]">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-['Space_Grotesk'] font-bold text-white text-base sm:text-lg group-hover:text-[#00E5FF] transition-colors">{tool.name}</h4>
                  <div className="flex items-center gap-2">
                    {tool.featured && <Star className="w-4 h-4 text-[#D4A843]" />}
                    <Info className="w-4 h-4 text-[#B0B0B0]/30 group-hover:text-[#00E5FF] transition-colors" />
                  </div>
                </div>
                <p className="text-white/60 text-sm leading-relaxed line-clamp-2 mb-4">{tool.desc}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    {tool.free && <span className="text-xs px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 font-bold">GRATIS</span>}
                    <span className="text-xs px-2.5 py-1 rounded-lg" style={{ backgroundColor: `${categoryColor(tool.category)}15`, color: categoryColor(tool.category) }}>
                      {CATEGORIES.find(c => c.id === tool.category)?.label}
                    </span>
                  </div>
                  {tool.pricing?.freeTier && <span className="text-xs text-white/30 truncate max-w-[160px]">{tool.pricing.freeTier}</span>}
                </div>
              </button>
            ))}
          </div>

          {filteredTools.length === 0 && (
            <div className="text-center py-16">
              <p className="text-[#B0B0B0] text-sm">No se encontraron herramientas para "{search}"</p>
            </div>
          )}
        </div>
      </main>

      {/* Tool Detail Modal */}
      {selectedTool && <ToolDetailModal tool={selectedTool} onClose={() => setSelectedTool(null)} />}
    </div>
  );
}

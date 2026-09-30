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
  Bot,
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
  agentes: { key: "PAPALIN", name: "Duolín", quote: "Los agentes son el gran salto de 2026: ya no solo responden, hacen tareas enteras por ti. Empieza con encargos pequeños y revisa siempre el resultado." },
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
  { id: "agentes", label: "Agentes", icon: <Bot className="w-4 h-4" />, color: "#7C4DFF" },
];

// ─── Pricing type ───
type PricingInfo = { free: boolean; freeTier?: string; price?: string; tokenValue?: string };

// ─── Tools Database (datos revisados: septiembre 2026) ───
export const TOOLS_LAST_UPDATE = "septiembre 2026";

const TOOLS: Array<{
  name: string; category: string; url: string; desc: string;
  featured?: boolean; free: boolean; pricing: PricingInfo; example?: string;
}> = [
  // ═══ CHAT IA (11) ═══
  { name: "ChatGPT", category: "chat", url: "https://chatgpt.com", desc: "IA conversacional de OpenAI. GPT-5.x, ChatGPT Images, voz, agentes y Deep Research.", featured: true, free: true, pricing: { free: true, freeTier: "GPT-5 con límites (~10 mensajes cada 5 h) e imágenes limitadas", price: "Go: $8/mes · Plus: $20/mes · Pro: desde $100/mes", tokenValue: "API GPT-5: ~$1.25/millón tokens entrada" }, example: "Escribe: 'Analiza este PDF y dame un resumen ejecutivo en 5 puntos'" },
  { name: "Claude", category: "chat", url: "https://claude.ai", desc: "IA de Anthropic. Claude Opus y Sonnet 5, contexto de hasta 1M tokens, Artifacts y Claude Code.", featured: true, free: true, pricing: { free: true, freeTier: "Claude Sonnet 5 con límites de uso diarios", price: "Pro: $20/mes ($17 anual) · Max: $100–200/mes", tokenValue: "API Sonnet: ~$3/millón tokens entrada" }, example: "Sube un contrato de 50 páginas y pide: 'Identifica las 3 cláusulas más riesgosas'" },
  { name: "Gemini", category: "chat", url: "https://gemini.google.com", desc: "IA de Google. Gemini 3.x Pro, multimodal, integrada en Gmail, Docs, Android y Chrome.", featured: true, free: true, pricing: { free: true, freeTier: "Gemini Flash gratis con límites diarios", price: "AI Plus: $4.99 · AI Pro: $19.99/mes · AI Ultra: desde $99.99/mes", tokenValue: "API Gemini 3 Pro: $2/millón tokens entrada" }, example: "Pide: 'Analiza mis últimos 10 emails en Gmail y crea un resumen de tareas pendientes'" },
  { name: "Perplexity", category: "chat", url: "https://perplexity.ai", desc: "Motor de búsqueda IA con fuentes verificadas. Navegador Comet y agentes.", featured: true, free: true, pricing: { free: true, freeTier: "Búsquedas básicas ilimitadas + 5-10 búsquedas Pro/día", price: "Pro: $20/mes · Max: $200/mes · Estudiantes: $10/mes", tokenValue: "N/A - por búsqueda" }, example: "Pregunta: '¿Cuáles son las últimas tendencias en IA generativa en 2026?' con fuentes" },
  { name: "Copilot", category: "chat", url: "https://copilot.microsoft.com", desc: "IA de Microsoft. Copilot Chat gratis e integrado en Windows, Edge y Microsoft 365.", free: true, pricing: { free: true, freeTier: "Copilot Chat gratis (chat, búsqueda web, imágenes limitadas)", price: "Microsoft 365 Premium: $19.99/mes (sustituye a Copilot Pro desde oct. 2025)", tokenValue: "N/A" }, example: "En Word: 'Reescribe este párrafo en tono más profesional'" },
  { name: "DeepSeek", category: "chat", url: "https://chat.deepseek.com", desc: "IA china de pesos abiertos. DeepSeek V4: razonamiento, matemáticas y código a bajo coste.", free: true, pricing: { free: true, freeTier: "App y web gratis con V4, búsqueda web y archivos", price: "API V4 Flash: $0.30/millón tokens entrada", tokenValue: "$0.0003/1K tokens" }, example: "Pide: 'Resuelve esta integral paso a paso y explica cada transformación'" },
  { name: "Mistral (Le Chat)", category: "chat", url: "https://chat.mistral.ai", desc: "IA europea. Mistral Large 3, multilingüe, cumple RGPD. Le Chat se renombró a Vibe en 2026.", free: true, pricing: { free: true, freeTier: "~25 mensajes/día gratis", price: "Pro: $14.99/mes · Estudiantes: $5.99/mes", tokenValue: "API desde $0.04/millón tokens" }, example: "Escribe en español, francés o alemán y obtén respuestas nativas en cada idioma" },
  { name: "Grok", category: "chat", url: "https://grok.com", desc: "IA de xAI. Grok 4.x con búsqueda en tiempo real en X, voz, imágenes y Grok Build.", free: true, pricing: { free: true, freeTier: "Plan gratuito con límites (Grok 4.6, imágenes, voz)", price: "SuperGrok Lite: $10 · SuperGrok: $30 · Plus: $100 · Heavy: $300/mes", tokenValue: "N/A" }, example: "Pregunta: '¿Qué está siendo tendencia ahora mismo en X sobre IA?'" },
  { name: "Meta AI (Llama)", category: "chat", url: "https://meta.ai", desc: "IA de Meta con Llama 4. Integrada en WhatsApp, Instagram, Facebook y app propia.", free: true, pricing: { free: true, freeTier: "Completamente gratuito, sin plan de pago", price: "Llama: pesos abiertos, sin coste de licencia", tokenValue: "Gratis (self-hosted)" }, example: "Úsalo directamente en WhatsApp: escribe @MetaAI en cualquier chat de grupo" },
  { name: "Pi", category: "chat", url: "https://pi.ai", desc: "IA conversacional empática de Inflection. Sigue activa aunque la empresa se centra en empresas.", free: true, pricing: { free: true, freeTier: "Completamente gratuito", price: "Sin plan de pago", tokenValue: "N/A" }, example: "Dile: 'Estoy estresado con el trabajo, ¿puedes ayudarme a organizar mis prioridades?'" },
  { name: "ChatGPT Go", category: "chat", url: "https://chatgpt.com", desc: "Plan económico de ChatGPT: más mensajes, imágenes y memoria que el gratuito por poco dinero.", free: false, pricing: { free: false, freeTier: "No (es el plan de pago más barato de OpenAI)", price: "Go: $8/mes (con anuncios en algunas regiones)", tokenValue: "N/A" }, example: "Ideal si el plan gratuito se te queda corto pero no necesitas Plus" },

  // ═══ IMAGEN (12) ═══
  { name: "Midjourney", category: "imagen", url: "https://midjourney.com", desc: "Líder en generación de imágenes artísticas. V8.1 por defecto y generación de vídeo.", featured: true, free: false, pricing: { free: false, freeTier: "No tiene tier gratuito", price: "Basic: $10/mes · Standard: $30 · Pro: $60 · Mega: $120 (-20% anual)", tokenValue: "~3,3 h de GPU rápida/mes (Basic)" }, example: "Prompt: '/imagine cyberpunk city at sunset, neon lights, rain, cinematic --ar 16:9'" },
  { name: "ChatGPT Images (GPT Image)", category: "imagen", url: "https://chatgpt.com", desc: "Generador de imágenes nativo de ChatGPT (GPT Image 2.5). Sustituyó a DALL-E 3, retirado en 2026.", featured: true, free: true, pricing: { free: true, freeTier: "Pocas imágenes/día en ChatGPT Free", price: "Más límite con ChatGPT Go ($8) o Plus ($20)", tokenValue: "API gpt-image: ~$0.04/imagen" }, example: "En ChatGPT: 'Genera una ilustración de un gato astronauta en estilo acuarela'" },
  { name: "Stable Diffusion", category: "imagen", url: "https://stability.ai", desc: "Modelos abiertos de Stability AI (SD 3.5, Stable Image Ultra). Ejecútalos en tu PC sin cuotas.", free: true, pricing: { free: true, freeTier: "Open-source gratis en local (necesita GPU)", price: "DreamStudio: 100 créditos gratis, luego $10 = 1.000 créditos", tokenValue: "API: $0.03–0.08/imagen" }, example: "Instala ComfyUI y genera: 'portrait of a warrior, oil painting style, dramatic lighting'" },
  { name: "Leonardo AI", category: "imagen", url: "https://leonardo.ai", desc: "Plataforma de imagen y vídeo (propiedad de Canva). Modelos para juegos, personajes y diseño.", free: true, pricing: { free: true, freeTier: "150 tokens/día (~20 imágenes, uso no comercial)", price: "Essential: $12/mes (8.500 tokens) · Premium: $30", tokenValue: "5–8 tokens/imagen" }, example: "Selecciona un modelo de estilo RPG y genera: 'epic fantasy warrior with golden armor'" },
  { name: "Ideogram", category: "imagen", url: "https://ideogram.ai", desc: "El mejor con texto legible dentro de imágenes (Ideogram 3.0 y 4.0). Logos y carteles.", free: true, pricing: { free: true, freeTier: "10 créditos/semana en cola lenta", price: "Plus: $20/mes (1.000 créditos prioritarios) · Pro: $60", tokenValue: "~$0.02/imagen (Ideogram 3.0)" }, example: "Genera: 'A neon sign that says LINCE in cyberpunk style'" },
  { name: "Flux", category: "imagen", url: "https://bfl.ai", desc: "Modelos de Black Forest Labs (FLUX.2). Alta fidelidad; FLUX.1 Schnell es abierto y gratis.", free: true, pricing: { free: true, freeTier: "FLUX.1 Schnell open-source; FLUX.2 Klein en local", price: "API/Playground: desde $0.014/imagen (1 crédito = $0.01)", tokenValue: "$0.03/imagen (FLUX.2 Pro)" }, example: "Usa el Playground de BFL: 'professional headshot of a business woman, studio lighting'" },
  { name: "Adobe Firefly", category: "imagen", url: "https://firefly.adobe.com", desc: "IA de Adobe (Firefly Image Model 5). Comercialmente segura, integrada en Photoshop y Express.", free: true, pricing: { free: true, freeTier: "Generaciones diarias limitadas con marca de agua", price: "Standard: $9.99/mes (2.000 créditos) · Pro: $19.99", tokenValue: "1 crédito = 1 imagen estándar" }, example: "Genera: 'tropical beach sunset, watercolor style' y úsalo en tu proyecto comercial sin riesgo legal" },
  { name: "Canva IA", category: "imagen", url: "https://canva.com", desc: "Diseño con IA: Magic Studio, Canva AI 2.0, Dream Lab, texto a vídeo. Todo en uno.", featured: true, free: true, pricing: { free: true, freeTier: "Plan gratis con usos de IA limitados", price: "Pro: ~$15/mes ($12/mes anual)", tokenValue: "2.000 usos IA estándar/mes (Pro)" }, example: "Crea un post de Instagram: elige plantilla → Canva AI → genera texto e imagen → publica" },
  { name: "Recraft AI", category: "imagen", url: "https://recraft.ai", desc: "Generador de vectores SVG e imágenes (Recraft V3). Ideal para iconos y diseño gráfico.", free: true, pricing: { free: true, freeTier: "50 créditos/día gratis", price: "Basic: $10/mes · Pro: $20/mes", tokenValue: "~$0.01/imagen (Pro)" }, example: "Genera: 'flat vector icon of a robot head, blue and cyan colors, SVG style'" },
  { name: "Krea AI", category: "imagen", url: "https://krea.ai", desc: "Imagen y vídeo en tiempo real mientras escribes. Acceso a decenas de modelos en un sitio.", free: true, pricing: { free: true, freeTier: "Generaciones diarias limitadas", price: "Basic: $10/mes · Pro: $35/mes", tokenValue: "~$0.015/imagen" }, example: "Escribe y ve cómo la imagen se genera en tiempo real mientras tecleas tu descripción" },
  { name: "Playground AI", category: "imagen", url: "https://playground.com", desc: "Generador y editor con varios modelos (Nano Banana, GPT Image). Plantillas de diseño.", free: true, pricing: { free: true, freeTier: "10 imágenes cada 3 h + 3 ediciones pro/mes", price: "Pro: $15/mes ($12 anual) · Pro Plus: $45", tokenValue: "~$0.01/imagen (Pro)" }, example: "Sube una foto real y pídele que la edite con un modelo pro" },
  { name: "Clipdrop", category: "imagen", url: "https://clipdrop.co", desc: "Suite de edición IA (ahora de Jasper). Quita fondos, relight, upscale, cleanup.", free: true, pricing: { free: true, freeTier: "20 usos/día por herramienta", price: "Pro: ~$15/mes (1.000 operaciones/día)", tokenValue: "N/A" }, example: "Sube una foto → 'Relight' → cambia la iluminación como si fuera un estudio profesional" },

  // ═══ VIDEO (10) ═══
  { name: "Sora", category: "video", url: "https://sora.chatgpt.com", desc: "Sora 2 de OpenAI. Vídeo con audio sincronizado, app social propia y 'cameos'.", featured: true, free: false, pricing: { free: false, freeTier: "Sin generación gratuita desde enero de 2026", price: "Según plan de ChatGPT (condiciones cambiantes en 2026) · API: $0.10/segundo", tokenValue: "Sora 2 Pro API: $0.30–0.70/segundo" }, example: "Prompt: 'A golden retriever puppy playing in autumn leaves, slow motion, cinematic'" },
  { name: "Runway", category: "video", url: "https://runway.com", desc: "Suite de vídeo IA. Gen-4.5, edición, efectos y herramientas de producción.", featured: true, free: true, pricing: { free: true, freeTier: "125 créditos únicos (Gen-4.5 requiere plan de pago)", price: "Standard: $12/mes anual (625 créditos) · Pro: $28", tokenValue: "12 créditos/segundo (Gen-4.5)" }, example: "Sube una foto y genera: 'make this person walk forward slowly, cinematic lighting'" },
  { name: "Pika", category: "video", url: "https://pika.art", desc: "Vídeos creativos con Pika 2.5: Pikaffects (melt, explode, inflate), escenas y lip-sync.", free: true, pricing: { free: true, freeTier: "80 créditos/mes a 480p", price: "Standard: $10/mes ($8 anual, 700 créditos)", tokenValue: "12–40 créditos por vídeo de 5 s" }, example: "Sube foto de un objeto → efecto 'Inflate' → se convierte en 3D animado" },
  { name: "HeyGen", category: "video", url: "https://heygen.com", desc: "Avatares de vídeo realistas (Avatar IV/V). Clona tu imagen y voz en 175+ idiomas.", free: true, pricing: { free: true, freeTier: "3 vídeos/mes con marca de agua", price: "Creator: $29/mes (600 créditos) · Pro: $49", tokenValue: "20 créditos/minuto (Avatar IV)" }, example: "Crea tu avatar → escribe un guión → genera vídeo profesional en español, inglés y chino" },
  { name: "Synthesia", category: "video", url: "https://synthesia.io", desc: "Vídeos con presentadores IA para empresas. 230+ avatares, 140+ idiomas, doblaje.", free: true, pricing: { free: true, freeTier: "Basic gratis: 10 min/mes con marca de agua", price: "Starter: $29/mes ($18 anual) · Creator: $89", tokenValue: "~$2.90/minuto (Starter)" }, example: "Elige avatar → pega tu guión de formación → genera vídeo profesional en minutos" },
  { name: "CapCut", category: "video", url: "https://capcut.com", desc: "Editor de vídeo de ByteDance. Subtítulos automáticos, efectos y avatares IA.", free: true, pricing: { free: true, freeTier: "Edición completa gratis (funciones pro con marca de agua)", price: "Pro: desde ~$10/mes", tokenValue: "N/A" }, example: "Sube vídeo → Auto Captions → elige estilo de subtítulos → exporta para TikTok" },
  { name: "Kling AI", category: "video", url: "https://kling.ai", desc: "Kling VIDEO 3.0 de Kuaishou. Movimiento realista, audio nativo y lip-sync.", free: true, pricing: { free: true, freeTier: "66 créditos/día (360–540p, marca de agua)", price: "Standard: $6.99/mes (660 créditos) · Pro: $29.99", tokenValue: "6–9 créditos/segundo a 720p" }, example: "Prompt: 'A cat wearing sunglasses walking on a beach, slow motion, 4K'" },
  { name: "Luma Dream Machine", category: "video", url: "https://lumalabs.ai", desc: "Luma AI (Ray 3). Vídeo realista con control de cámara y escenas 3D.", free: true, pricing: { free: true, freeTier: "~30 generaciones/mes con marca de agua", price: "Plus: $30/mes · Pro: $90 · Ultra: $300", tokenValue: "~$0.25/generación" }, example: "Genera: 'drone shot flying over a futuristic city, golden hour, 4K'" },
  { name: "Hedra", category: "video", url: "https://hedra.com", desc: "Avatares animados (Character-3) desde foto + audio. Lip-sync y expresiones naturales.", featured: true, free: true, pricing: { free: true, freeTier: "300 créditos/mes con marca de agua", price: "Basic: $15/mes (1.500 créditos) · Creator: $30", tokenValue: "3–6 créditos/segundo" }, example: "Sube tu foto + graba audio → Hedra anima tu cara con lip-sync perfecto" },
  { name: "InVideo AI", category: "video", url: "https://invideo.io", desc: "Genera vídeos completos desde texto. Ideal para marketing y redes sociales.", free: true, pricing: { free: true, freeTier: "10 min/semana con marca de agua", price: "Plus: $28/mes (50 min/mes, sin marca de agua)", tokenValue: "~$0.56/minuto" }, example: "Escribe: 'Crea un vídeo de 60 segundos sobre los beneficios de la IA para pymes'" },

  // ═══ AUDIO (9) ═══
  { name: "ElevenLabs", category: "audio", url: "https://elevenlabs.io", desc: "Voz IA ultra realista (Eleven v3). Clonación, doblaje y agentes de voz en 70+ idiomas.", featured: true, free: true, pricing: { free: true, freeTier: "10.000 créditos/mes (~10 min de audio)", price: "Starter: $6/mes · Creator: $22/mes (121K créditos)", tokenValue: "~$0.0002/carácter" }, example: "Clona tu voz con 30 segundos de audio → genera narración en cualquier idioma" },
  { name: "Suno", category: "audio", url: "https://suno.com", desc: "Canciones completas con IA (v5/v5.5): letra, melodía, voz y producción.", featured: true, free: true, pricing: { free: true, freeTier: "50 créditos/día (~10 canciones, sin uso comercial)", price: "Pro: $10/mes (2.500 créditos) · Premier: $30", tokenValue: "5 créditos/canción" }, example: "Escribe: 'reggaeton romántico sobre un amor de verano en Barcelona, voz masculina'" },
  { name: "Udio", category: "audio", url: "https://udio.com", desc: "Música IA con licencias de UMG y Warner. En 2026 solo streaming: las descargas siguen desactivadas.", free: true, pricing: { free: true, freeTier: "100 créditos/mes (máx. 10/día)", price: "Standard: $10/mes · Pro: $30/mes", tokenValue: "~$0.004/generación" }, example: "Genera: 'epic orchestral soundtrack for a fantasy movie trailer, dramatic'" },
  { name: "Murf AI", category: "audio", url: "https://murf.ai", desc: "Voiceover IA profesional. 200+ voces realistas en 20+ idiomas.", free: true, pricing: { free: true, freeTier: "10 minutos de audio gratis", price: "Creator: $23/mes", tokenValue: "~$0.48/hora" }, example: "Elige voz 'Español - Carlos' → pega tu guión → genera narración profesional" },
  { name: "Descript", category: "audio", url: "https://descript.com", desc: "Edición de audio/vídeo basada en texto. Borra palabras del texto y desaparecen del audio.", free: true, pricing: { free: true, freeTier: "1 hora de transcripción/mes", price: "Hobbyist: $24/mes (10 horas/mes)", tokenValue: "~$2.40/hora" }, example: "Sube tu podcast → edita el audio editando el texto → elimina 'ehhh' y silencios" },
  { name: "Whisper", category: "audio", url: "https://openai.com/whisper", desc: "Transcripción de audio de OpenAI. Open-source, 99 idiomas.", free: true, pricing: { free: true, freeTier: "Open-source completamente gratis", price: "API: $0.006/minuto de audio", tokenValue: "$0.006/minuto" }, example: "Transcribe una reunión de 1 hora en español con 98% de precisión por $0.36" },
  { name: "Speechify", category: "audio", url: "https://speechify.com", desc: "Texto a voz natural. Lee PDFs, webs y documentos en voz alta.", free: true, pricing: { free: true, freeTier: "Lectura básica gratuita", price: "Premium: $139/año (~$11.60/mes)", tokenValue: "N/A - ilimitado" }, example: "Instala extensión → selecciona texto en cualquier web → escúchalo con voz natural" },
  { name: "Adobe Podcast", category: "audio", url: "https://podcast.adobe.com", desc: "Mejora calidad de audio con IA. Elimina ruido de fondo profesionalmente.", free: true, pricing: { free: true, freeTier: "Enhance Speech gratis (1 h/día)", price: "Más horas con planes de Adobe", tokenValue: "N/A" }, example: "Sube audio grabado con móvil → Enhance Speech → suena como estudio profesional" },
  { name: "Soundraw", category: "audio", url: "https://soundraw.io", desc: "Música IA personalizada. Ajusta tempo, instrumentos, mood en tiempo real.", free: true, pricing: { free: true, freeTier: "Crear y previsualizar gratis", price: "Creator: $16.99/mes (descargas ilimitadas)", tokenValue: "N/A" }, example: "Selecciona: mood 'energético' + género 'electrónica' + 120 BPM → genera y personaliza" },

  // ═══ CÓDIGO (9) ═══
  { name: "GitHub Copilot", category: "codigo", url: "https://github.com/features/copilot", desc: "Asistente de código de GitHub/Microsoft. Autocompletado, chat, agente y revisión de PRs.", featured: true, free: true, pricing: { free: true, freeTier: "Plan Free: completions y chat limitados al mes", price: "Pro: $10/mes · Pro+: $39 · Max: $100 (facturación por uso desde jun. 2026)", tokenValue: "N/A" }, example: "Escribe un comentario: '// función que ordena array por fecha' → Copilot genera el código" },
  { name: "Cursor", category: "codigo", url: "https://cursor.com", desc: "Editor de código con IA. Agentes en paralelo, Composer y modo background.", featured: true, free: true, pricing: { free: true, freeTier: "Hobby: uso limitado gratis", price: "Pro: $20/mes · Pro+: $60 · Ultra: $200", tokenValue: "Pro incluye $20 de uso de modelos" }, example: "Selecciona código → Ctrl+K → 'refactoriza esto para usar async/await' → aplica" },
  { name: "Replit", category: "codigo", url: "https://replit.com", desc: "IDE online con Replit Agent. Genera, ejecuta y despliega apps en la nube.", free: true, pricing: { free: true, freeTier: "Starter: créditos diarios de Agent, 1 app publicada", price: "Core: $25/mes ($20 anual) con $25 de créditos", tokenValue: "N/A" }, example: "Escribe: 'Crea una API REST en Python con Flask que gestione una lista de tareas'" },
  { name: "v0 by Vercel", category: "codigo", url: "https://v0.app", desc: "Genera interfaces y apps React/Next.js desde texto. Componentes shadcn/ui.", free: true, pricing: { free: true, freeTier: "$5 de créditos/mes, 7 mensajes/día", price: "Team: $30/usuario/mes (el plan Premium de $20 se retiró)", tokenValue: "Facturación por tokens" }, example: "Escribe: 'dashboard con sidebar, gráfico de barras y tabla de usuarios' → genera código" },
  { name: "Bolt.new", category: "codigo", url: "https://bolt.new", desc: "Genera apps web completas desde texto. Full-stack en segundos.", free: true, pricing: { free: true, freeTier: "1M tokens/mes (máx. 300K/día)", price: "Pro: $25/mes (10M tokens)", tokenValue: "N/A" }, example: "Escribe: 'Crea un clon de Trello con drag & drop y autenticación' → app completa" },
  { name: "Windsurf", category: "codigo", url: "https://windsurf.com", desc: "IDE con IA de Cognition (creadores de Devin). Agente Cascade con contexto del proyecto.", free: true, pricing: { free: true, freeTier: "Autocompletado ilimitado gratis", price: "Pro: $20/mes · Max: $200", tokenValue: "Cuotas diarias/semanales" }, example: "Abre tu proyecto → Windsurf entiende todo el contexto → sugiere código inteligente" },
  { name: "Tabnine", category: "codigo", url: "https://tabnine.com", desc: "Autocompletado IA para tu IDE. Privacidad: puede funcionar sin enviar código fuera.", free: true, pricing: { free: true, freeTier: "Autocompletado básico gratis", price: "Dev: $9/mes · Enterprise: $39/usuario", tokenValue: "N/A" }, example: "Instala en VS Code → empieza a escribir → Tabnine completa funciones enteras" },
  { name: "Aider", category: "codigo", url: "https://aider.chat", desc: "Programación IA desde terminal. Open-source, usa GPT-5, Claude o modelos locales.", free: true, pricing: { free: true, freeTier: "Open-source gratis (necesitas API key)", price: "Gratis + coste de API del modelo elegido", tokenValue: "Depende del modelo" }, example: "En terminal: 'aider --model sonnet → /add app.py → refactoriza el manejo de errores'" },
  { name: "Kiro (AWS)", category: "codigo", url: "https://kiro.dev", desc: "IDE agéntico de AWS que sustituye a Amazon Q Developer. Desarrollo guiado por specs.", free: true, pricing: { free: true, freeTier: "Free: 50 créditos/mes", price: "Pro: $20/mes · Pro+: $40 · Power: $200", tokenValue: "N/A" }, example: "Describe la feature → Kiro genera la spec, las tareas y el código con tests" },

  // ═══ TEXTO (10) ═══
  { name: "Jasper", category: "texto", url: "https://jasper.ai", desc: "Copywriting IA para marketing. Blogs, emails, anuncios, social media.", free: false, pricing: { free: false, freeTier: "7 días de prueba gratis", price: "Creator: $49/mes ($39 anual) · Pro: $69", tokenValue: "N/A - ilimitado" }, example: "Plantilla 'Blog Post' → tema: 'IA en educación' → genera artículo de 1500 palabras" },
  { name: "Copy.ai", category: "texto", url: "https://copy.ai", desc: "Generación de contenido marketing. Workflows y agentes de ventas.", free: true, pricing: { free: true, freeTier: "2.000 palabras/mes gratis", price: "Starter: $49/mes (ilimitado)", tokenValue: "N/A" }, example: "Elige 'Product Description' → describe tu producto → genera 5 variaciones de copy" },
  { name: "Writesonic", category: "texto", url: "https://writesonic.com", desc: "Escritura y SEO con IA. Artículos, landing pages, descripciones de producto.", free: true, pricing: { free: true, freeTier: "Prueba gratuita limitada", price: "Desde ~$16–19/mes (ilimitado)", tokenValue: "N/A" }, example: "Genera: 'Artículo SEO de 2000 palabras sobre beneficios del yoga para principiantes'" },
  { name: "Grammarly", category: "texto", url: "https://grammarly.com", desc: "Corrección y escritura con IA en cualquier app. Ahora parte de la suite Superhuman.", free: true, pricing: { free: true, freeTier: "Corrección básica + 100 prompts IA/mes", price: "Pro: $12/mes anual ($30 mensual)", tokenValue: "N/A" }, example: "Instala extensión → escribe en cualquier web → Grammarly corrige gramática y sugiere mejoras" },
  { name: "Notion AI", category: "texto", url: "https://notion.so", desc: "IA integrada en Notion: Agent, notas de reuniones y búsqueda. Incluida en el plan Business.", free: true, pricing: { free: true, freeTier: "Prueba limitada en Free y Plus", price: "Business: $20/usuario/mes (IA completa)", tokenValue: "N/A" }, example: "En cualquier página de Notion: selecciona texto → 'Resumir' o 'Traducir al inglés'" },
  { name: "Gamma", category: "texto", url: "https://gamma.app", desc: "Presentaciones, documentos y webs con IA. Diseño automático profesional.", featured: true, free: true, pricing: { free: true, freeTier: "400 créditos únicos", price: "Plus: $9/mes (1.000 créditos) · Pro: $18", tokenValue: "40 créditos/presentación" }, example: "Escribe: 'Presentación sobre estrategia de marketing digital 2026' → 10 slides listas" },
  { name: "DeepL", category: "texto", url: "https://deepl.com", desc: "Traductor IA premium. Calidad superior en idiomas europeos. DeepL Write para redacción.", free: true, pricing: { free: true, freeTier: "50.000 caracteres/mes", price: "Starter: $8.74/mes anual (300K caracteres, archivos)", tokenValue: "~$0.025/1000 caracteres" }, example: "Traduce un documento legal de español a alemán manteniendo el formato original" },
  { name: "QuillBot", category: "texto", url: "https://quillbot.com", desc: "Parafraseo IA. Reescribe textos manteniendo el significado con diferentes tonos.", free: true, pricing: { free: true, freeTier: "125 palabras por parafraseo", price: "Premium: $9.95/mes (ilimitado)", tokenValue: "N/A" }, example: "Pega un párrafo → elige modo 'Formal' → obtén versión profesional del mismo texto" },
  { name: "Rytr", category: "texto", url: "https://rytr.me", desc: "Escritura IA económica. 40+ plantillas, 30+ idiomas.", free: true, pricing: { free: true, freeTier: "10.000 caracteres/mes gratis", price: "Unlimited: $9/mes · Premium: $29", tokenValue: "N/A" }, example: "Plantilla 'Email' → tono: profesional → tema: seguimiento de propuesta → genera email" },
  { name: "Wordtune", category: "texto", url: "https://wordtune.com", desc: "Reescritura IA. Mejora claridad, tono y estilo de tus textos.", free: true, pricing: { free: true, freeTier: "10 reescrituras/día gratis", price: "Plus: $9.99/mes (ilimitado)", tokenValue: "N/A" }, example: "Selecciona una frase → Wordtune ofrece 5 alternativas más claras y profesionales" },

  // ═══ PRODUCTIVIDAD (10) ═══
  { name: "Zapier AI", category: "productividad", url: "https://zapier.com", desc: "Automatización con IA. 8.000+ apps, Agents, Tables e Interfaces sin código.", featured: true, free: true, pricing: { free: true, freeTier: "100 tareas/mes, Zaps de 2 pasos", price: "Professional: $19.99/mes anual ($29.99 mensual, 750 tareas)", tokenValue: "~$0.027/tarea" }, example: "Automatiza: 'Cuando reciba email con factura → extraer datos → añadir a Google Sheets'" },
  { name: "Make", category: "productividad", url: "https://make.com", desc: "Automatización visual de procesos. Más flexible que Zapier para flujos complejos.", free: true, pricing: { free: true, freeTier: "1.000 créditos/mes, 2 escenarios activos", price: "Core: $9/mes anual ($10.59 mensual, 10K créditos)", tokenValue: "~$0.001/operación" }, example: "Crea flujo visual: Webhook → procesar datos → enviar a CRM → notificar por Slack" },
  { name: "n8n", category: "productividad", url: "https://n8n.io", desc: "Automatización open-source con nodos de IA. Self-hosted sin límites o en la nube.", free: true, pricing: { free: true, freeTier: "Community Edition gratis (self-hosted)", price: "Cloud Starter: €20/mes anual (2.500 ejecuciones)", tokenValue: "~€0.008/ejecución" }, example: "Instala en tu servidor → conecta APIs → automatiza procesos sin límites ni costes" },
  { name: "Otter.ai", category: "productividad", url: "https://otter.ai", desc: "Transcripción de reuniones en tiempo real. Resúmenes y tareas automáticas.", free: true, pricing: { free: true, freeTier: "300 min/mes de transcripción", price: "Pro: $16.99/mes (1.200 min/mes)", tokenValue: "~$0.014/minuto" }, example: "Conecta con Zoom → Otter transcribe la reunión → genera resumen con tareas asignadas" },
  { name: "Fireflies.ai", category: "productividad", url: "https://fireflies.ai", desc: "Asistente de reuniones IA. Transcribe, resume y busca en tus reuniones.", free: true, pricing: { free: true, freeTier: "Transcripción limitada gratis", price: "Pro: $18/mes ($10 anual)", tokenValue: "N/A" }, example: "Invita a fred@fireflies.ai a tu reunión → transcripción automática + resumen por email" },
  { name: "Reclaim AI", category: "productividad", url: "https://reclaim.ai", desc: "Gestión inteligente de calendario (de Dropbox). Prioriza tareas y protege tiempo de enfoque.", free: true, pricing: { free: true, freeTier: "Plan gratuito con funciones básicas", price: "Starter: $10/mes", tokenValue: "N/A" }, example: "Conecta Google Calendar → Reclaim programa automáticamente tus tareas en huecos libres" },
  { name: "Taskade", category: "productividad", url: "https://taskade.com", desc: "Gestión de proyectos con agentes IA. Genera tareas, mind maps y workflows.", free: true, pricing: { free: true, freeTier: "1 espacio de trabajo gratis", price: "Pro: $10/mes/usuario (IA ilimitada)", tokenValue: "N/A" }, example: "Escribe: 'Plan de lanzamiento de producto' → genera proyecto con tareas, plazos y responsables" },
  { name: "Mem", category: "productividad", url: "https://mem.ai", desc: "Notas IA auto-organizadas. Encuentra información sin carpetas ni etiquetas.", free: true, pricing: { free: true, freeTier: "Funciones básicas gratis", price: "Pro: $14.99/mes", tokenValue: "N/A" }, example: "Escribe notas libremente → Mem las organiza → busca: '¿qué decidimos sobre el presupuesto?'" },
  { name: "Beautiful.ai", category: "productividad", url: "https://beautiful.ai", desc: "Presentaciones inteligentes. Diseño automático que se adapta al contenido.", free: true, pricing: { free: true, freeTier: "14 días de prueba gratis", price: "Pro: $12/mes (ilimitado, exportar)", tokenValue: "N/A" }, example: "Añade datos → Beautiful.ai ajusta automáticamente el layout para que se vea profesional" },
  { name: "Superhuman Docs (Coda)", category: "productividad", url: "https://superhuman.com", desc: "Coda pasó a ser Superhuman Docs (jul. 2026), junto a Grammarly y Superhuman Mail.", free: true, pricing: { free: true, freeTier: "Plan gratuito con documentos e IA limitada", price: "Pro: $12/mes anual · Business: $33", tokenValue: "N/A" }, example: "Crea tabla de seguimiento → la IA genera fórmulas y automatiza notificaciones" },

  // ═══ DISEÑO (9) ═══
  { name: "Figma AI", category: "diseno", url: "https://figma.com", desc: "Diseño colaborativo con IA: Figma Make (prompt → app) y créditos de IA por asiento.", featured: true, free: true, pricing: { free: true, freeTier: "Starter gratis (3 archivos) + créditos de IA", price: "Professional: $16/mes anual por Full seat ($20 mensual)", tokenValue: "3.000 créditos IA/mes (Full seat)" }, example: "Abre Figma Make → describe: 'formulario de registro moderno' → genera app interactiva" },
  { name: "Framer", category: "diseno", url: "https://framer.com", desc: "Diseño web con IA. Genera sitios completos y responsivos desde texto.", free: true, pricing: { free: true, freeTier: "1 sitio gratis (con dominio framer)", price: "Mini: $5/mes · Basic: $15/mes (dominio propio)", tokenValue: "N/A" }, example: "Escribe: 'Landing page para app de fitness, estilo minimalista' → sitio web completo" },
  { name: "Looka", category: "diseno", url: "https://looka.com", desc: "Generación de logos y branding con IA. Kit de marca completo.", free: true, pricing: { free: true, freeTier: "Generar y previsualizar gratis", price: "Basic: $20 (1 logo) · Premium: $65 (kit completo)", tokenValue: "Pago único" }, example: "Ingresa nombre + industria + colores preferidos → genera 100+ opciones de logo" },
  { name: "Remove.bg", category: "diseno", url: "https://remove.bg", desc: "Elimina fondos de imágenes automáticamente con IA. Resultados en 5 segundos.", free: true, pricing: { free: true, freeTier: "1 imagen HD gratis + previews ilimitados", price: "Créditos: desde $0.20/imagen", tokenValue: "$0.20/imagen HD" }, example: "Sube foto de producto → fondo eliminado en 5 segundos → descarga PNG transparente" },
  { name: "Photoroom", category: "diseno", url: "https://photoroom.com", desc: "Edición de fotos de producto con IA. E-commerce, social media, catálogos.", free: true, pricing: { free: true, freeTier: "Edición básica gratis con marca de agua", price: "Pro: $9.99/mes (sin marca de agua, batch)", tokenValue: "N/A" }, example: "Sube foto de producto → elimina fondo → añade fondo profesional → listo para tienda" },
  { name: "Spline AI", category: "diseno", url: "https://spline.design", desc: "Diseño 3D con IA en el navegador. Genera objetos 3D desde texto.", free: true, pricing: { free: true, freeTier: "Editor 3D completo gratis", price: "Pro: $7/mes (exportar, colaborar)", tokenValue: "N/A" }, example: "Escribe: 'robot futurista con ojos brillantes' → genera modelo 3D interactivo" },
  { name: "Uizard", category: "diseno", url: "https://uizard.io", desc: "Wireframes y mockups desde texto o bocetos (de Miro desde 2024). Prototipado rápido.", free: true, pricing: { free: true, freeTier: "2 proyectos y 3 generaciones IA/mes", price: "Pro: $12/mes (500 generaciones)", tokenValue: "N/A" }, example: "Sube foto de boceto en papel → Uizard lo convierte en wireframe digital editable" },
  { name: "Google Stitch", category: "diseno", url: "https://stitch.withgoogle.com", desc: "Antes Galileo AI, ahora experimento de Google Labs. UI desde texto o imagen, exporta a Figma y HTML.", free: true, pricing: { free: true, freeTier: "Gratis: 400 créditos de diseño/día", price: "Sin plan de pago (Google Labs)", tokenValue: "N/A" }, example: "Describe: 'app de delivery con mapa, lista de restaurantes y carrito' → diseño completo" },
  { name: "Vizcom", category: "diseno", url: "https://vizcom.ai", desc: "Transforma bocetos a mano en renders fotorrealistas. Ideal para diseño industrial.", free: true, pricing: { free: true, freeTier: "Renders limitados gratis", price: "Pro: $29/mes (ilimitado, alta resolución)", tokenValue: "N/A" }, example: "Dibuja boceto de zapatilla → Vizcom genera render 3D fotorrealista con materiales" },

  // ═══ INVESTIGACIÓN (8) ═══
  { name: "NotebookLM", category: "investigacion", url: "https://notebooklm.google.com", desc: "IA de Google para investigación. Sube fuentes, genera podcasts, vídeos y resúmenes con citas.", featured: true, free: true, pricing: { free: true, freeTier: "Gratis: 100 notebooks, 50 fuentes por notebook", price: "Google AI Pro: $19.99/mes (300 fuentes, 5× cuota)", tokenValue: "N/A" }, example: "Sube 5 PDFs de investigación → pide: 'genera un podcast de 10 minutos resumiendo los hallazgos'" },
  { name: "Consensus", category: "investigacion", url: "https://consensus.app", desc: "Búsqueda de papers académicos con IA. Respuestas basadas en ciencia.", free: true, pricing: { free: true, freeTier: "Búsquedas básicas ilimitadas + créditos IA limitados", price: "Premium: $8.99/mes anual", tokenValue: "N/A" }, example: "Pregunta: '¿La meditación reduce la ansiedad?' → respuesta con citas de 10+ papers" },
  { name: "Elicit", category: "investigacion", url: "https://elicit.com", desc: "Asistente de investigación IA. Analiza papers, extrae datos, compara estudios.", free: true, pricing: { free: true, freeTier: "Créditos gratuitos limitados", price: "Plus: $12/mes anual", tokenValue: "~1 crédito/paper analizado" }, example: "Busca: 'efectos del ejercicio en la depresión' → tabla comparativa de 20 estudios" },
  { name: "Semantic Scholar", category: "investigacion", url: "https://semanticscholar.org", desc: "Buscador académico con IA de Allen Institute. 200M+ papers indexados.", free: true, pricing: { free: true, freeTier: "Completamente gratuito", price: "Gratis (sin restricciones)", tokenValue: "N/A" }, example: "Busca papers y usa 'TLDR' para ver resúmenes automáticos de cada artículo" },
  { name: "Connected Papers", category: "investigacion", url: "https://connectedpapers.com", desc: "Visualiza conexiones entre papers. Mapas de conocimiento interactivos.", free: true, pricing: { free: true, freeTier: "5 gráficos/mes gratis", price: "Academic: $6/mes (ilimitado)", tokenValue: "~$1.20/gráfico" }, example: "Pega DOI de un paper → genera mapa visual de papers relacionados y citados" },
  { name: "SciSpace", category: "investigacion", url: "https://scispace.com", desc: "Lee y comprende papers con IA. Explicaciones simplificadas de artículos complejos.", free: true, pricing: { free: true, freeTier: "Uso limitado con IA", price: "Premium: $12/mes anual", tokenValue: "N/A" }, example: "Sube paper técnico → SciSpace explica cada sección en lenguaje simple con ejemplos" },
  { name: "Humata", category: "investigacion", url: "https://humata.ai", desc: "Análisis de PDFs con IA. Pregunta sobre tus documentos y obtén respuestas citadas.", free: true, pricing: { free: true, freeTier: "60 páginas/mes gratis", price: "Student: $1.99/mes · Expert: $9.99/mes", tokenValue: "N/A" }, example: "Sube contrato de 100 páginas → pregunta: '¿cuáles son las penalizaciones por incumplimiento?'" },
  { name: "Litmaps", category: "investigacion", url: "https://litmaps.com", desc: "Mapas de literatura científica. Descubre papers relevantes automáticamente.", free: true, pricing: { free: true, freeTier: "Mapas limitados gratis", price: "Pro: $10/mes (ilimitado)", tokenValue: "N/A" }, example: "Añade 3 papers clave → Litmaps genera mapa con 50+ papers relacionados por relevancia" },

  // ═══ EDUCACIÓN (3) ═══
  { name: "Duolingo", category: "educacion", url: "https://duolingo.com", desc: "Aprende idiomas jugando con IA. La inspiración de LINCE. 40+ idiomas, videollamadas con IA.", featured: true, free: true, pricing: { free: true, freeTier: "Completamente gratis (con anuncios)", price: "Super: ~$12.99/mes · Max: $29.99/mes ($14 anual) con Video Call IA", tokenValue: "N/A" }, example: "5 minutos al día → lecciones adaptativas → rachas y XP → aprende jugando" },
  { name: "Khan Academy Khanmigo", category: "educacion", url: "https://khanacademy.org", desc: "Tutor IA personalizado. Matemáticas, ciencias, programación. Gratis para profesores.", free: true, pricing: { free: true, freeTier: "Todo el contenido de Khan Academy gratis", price: "Khanmigo: $4/mes ($44/año) para familias; gratis para docentes", tokenValue: "N/A" }, example: "Pide a Khanmigo: 'Explícame derivadas como si tuviera 15 años' → explicación paso a paso" },
  { name: "Quizlet AI", category: "educacion", url: "https://quizlet.com", desc: "Flashcards IA. Genera tarjetas de estudio automáticamente desde tus apuntes.", free: true, pricing: { free: true, freeTier: "Flashcards básicas gratis", price: "Plus: $7.99/mes (IA, sin anuncios)", tokenValue: "N/A" }, example: "Sube apuntes de biología → Quizlet genera 50 flashcards + test de práctica automático" },

  // ═══ MARKETING/SEO (4) ═══
  { name: "Surfer SEO", category: "marketing", url: "https://surferseo.com", desc: "SEO con IA. Optimiza contenido para posicionar en Google y en respuestas de IA.", free: false, pricing: { free: false, freeTier: "Prueba gratuita limitada", price: "Essential: $99/mes", tokenValue: "N/A" }, example: "Escribe artículo → Surfer analiza top 10 de Google → sugiere palabras clave y estructura" },
  { name: "Semrush AI", category: "marketing", url: "https://semrush.com", desc: "Suite de marketing digital con IA. SEO, PPC, redes sociales y visibilidad en IA.", free: true, pricing: { free: true, freeTier: "10 búsquedas/día gratis", price: "Pro: $139.95/mes", tokenValue: "N/A" }, example: "Analiza dominio competidor → ve sus keywords → genera estrategia SEO con IA" },
  { name: "HubSpot AI", category: "marketing", url: "https://hubspot.com", desc: "CRM + marketing + ventas con IA (Breeze). Automatización de emails y leads.", free: true, pricing: { free: true, freeTier: "CRM gratuito + herramientas básicas", price: "Starter: desde $15/asiento/mes", tokenValue: "N/A" }, example: "CRM gratis → IA genera emails personalizados → automatiza seguimiento de leads" },
  { name: "Hootsuite AI", category: "marketing", url: "https://hootsuite.com", desc: "Gestión de redes sociales con IA. Programa posts, analiza rendimiento.", free: false, pricing: { free: false, freeTier: "30 días de prueba gratis", price: "Standard: $99/mes (5 cuentas sociales)", tokenValue: "N/A" }, example: "Conecta Instagram + TikTok + LinkedIn → IA sugiere mejor hora → programa 30 posts" },

  // ═══ AGENTES IA (7) — nuevos en 2025-2026 ═══
  { name: "ChatGPT Agent", category: "agentes", url: "https://chatgpt.com", desc: "Modo agente de ChatGPT: navega, usa el ordenador virtual, rellena formularios y encadena tareas.", featured: true, free: false, pricing: { free: false, freeTier: "No disponible en el plan gratuito", price: "Incluido en Plus ($20/mes) con límite mensual de tareas", tokenValue: "N/A" }, example: "Pide: 'Busca 3 vuelos Madrid-Lisboa para el viernes, compáralos en una tabla y prepara la reserva'" },
  { name: "Manus", category: "agentes", url: "https://manus.im", desc: "Agente autónomo general: investiga, crea webs, presentaciones y hojas de cálculo solo.", featured: true, free: true, pricing: { free: true, freeTier: "300 créditos/día (modo Lite), 1 tarea simultánea", price: "Pro: $20/mes (4.000 créditos) · $40 (8.000)", tokenValue: "~1 crédito por paso del agente" }, example: "Escribe: 'Investiga a mis 5 competidores y crea un informe con gráficos' → lo hace de principio a fin" },
  { name: "Genspark", category: "agentes", url: "https://genspark.ai", desc: "Super agente todo-en-uno: chat multi-modelo, slides, hojas de cálculo, llamadas y navegación.", free: true, pricing: { free: true, freeTier: "100 créditos/día; chat e imagen sin coste", price: "Plus: $24.99/mes · Pro: $249.99", tokenValue: "N/A" }, example: "Pide: 'Crea una presentación de 10 slides sobre energía solar con datos actualizados'" },
  { name: "Perplexity Computer", category: "agentes", url: "https://perplexity.ai", desc: "Agente de Perplexity (feb. 2026) que orquesta varios modelos para tareas largas y complejas.", free: false, pricing: { free: false, freeTier: "No incluido en Free ni Pro", price: "Max: $200/mes (10.000 créditos de Computer)", tokenValue: "N/A" }, example: "Encárgale: 'Analiza este dataset, genera un informe y prepara un email con conclusiones'" },
  { name: "Comet (Perplexity)", category: "agentes", url: "https://perplexity.ai/comet", desc: "Navegador con agente IA integrado. Resume, compara y ejecuta acciones en las webs por ti.", featured: true, free: true, pricing: { free: true, freeTier: "Gratis en Windows, Mac, iOS y Android", price: "Funciones avanzadas con Perplexity Pro ($20/mes)", tokenValue: "N/A" }, example: "En cualquier web: 'Compara este producto con los 3 más vendidos de Amazon'" },
  { name: "Dia (navegador)", category: "agentes", url: "https://diabrowser.com", desc: "Navegador IA de The Browser Company (Atlassian). Chatea con tus pestañas y automatiza tareas.", free: true, pricing: { free: true, freeTier: "Gratis", price: "Plan Pro con más uso de IA", tokenValue: "N/A" }, example: "Abre 5 pestañas de artículos → 'Resume las diferencias entre todos'" },
  { name: "Zapier Agents", category: "agentes", url: "https://zapier.com/agents", desc: "Agentes que trabajan con tus 8.000+ apps: leen, deciden y actúan sin flujos fijos.", free: true, pricing: { free: true, freeTier: "Actividades limitadas gratis", price: "Incluido en planes de Zapier (desde $19.99/mes)", tokenValue: "N/A" }, example: "Crea agente: 'Cuando llegue un lead, investígalo en LinkedIn y prepara un email personalizado'" },

  // ═══ NOVEDADES 2025-2026 en otras categorías ═══
  { name: "Kimi (Moonshot)", category: "chat", url: "https://kimi.com", desc: "IA china con modelos K2 de pesos abiertos. Muy fuerte en agentes, código y contexto largo.", free: true, pricing: { free: true, freeTier: "Chat gratis con límites", price: "API: uso por tokens (~$5–30/mes uso personal)", tokenValue: "Desde $0.15/millón tokens" }, example: "Pide: 'Lee estos 3 PDFs de 100 páginas y compara sus conclusiones'" },
  { name: "Qwen Chat", category: "chat", url: "https://chat.qwen.ai", desc: "IA de Alibaba (Qwen 3.x). Chat, imagen y vídeo gratis; modelos abiertos para ejecutar en local.", free: true, pricing: { free: true, freeTier: "Chat gratuito; modelos abiertos gratis", price: "API desde $0.15/millón tokens", tokenValue: "$0.00015/1K tokens" }, example: "Genera texto, imagen y vídeo desde el mismo chat sin pagar" },
  { name: "Nano Banana (Gemini)", category: "imagen", url: "https://gemini.google.com", desc: "Generador y editor de imágenes de Google (Nano Banana 2 / Pro). Edición conversacional muy fiel.", featured: true, free: true, pricing: { free: true, freeTier: "20 imágenes/día (Nano Banana 2); Pro solo unas pocas", price: "Google AI Pro: $19.99/mes (100 imágenes Pro/día)", tokenValue: "API: $0.134/imagen (Pro 2K)" }, example: "Sube tu foto y pide: 'Ponme en una playa al atardecer con la misma cara y ropa'" },
  { name: "Google Veo 3.1 (Flow)", category: "video", url: "https://labs.google/flow", desc: "Vídeo con audio nativo de Google. Flow añade escenas, personajes y agente de dirección.", featured: true, free: true, pricing: { free: true, freeTier: "50 créditos/día en Flow (clips Veo 3.1 Lite)", price: "AI Pro: $19.99/mes (+1.000 créditos) · AI Ultra: desde $99.99", tokenValue: "API: $0.64–3.20 por clip de 8 s" }, example: "Prompt: 'Un chef explica una receta en una cocina soleada, cámara al hombro, con su voz'" },
  { name: "Higgsfield", category: "video", url: "https://higgsfield.ai", desc: "Plataforma con 15+ modelos de vídeo e imagen (Seedance, Veo, Kling, Hailuo) en una sola cuota.", free: true, pricing: { free: true, freeTier: "Créditos de prueba limitados", price: "Starter: $15/mes · Plus: $39 · Ultra: $99", tokenValue: "~$1.20–1.55 por clip Seedance de 8 s" }, example: "Elige Seedance 2.0 → sube foto → 'Movimiento de cámara cinematográfico con audio'" },
  { name: "Hailuo (MiniMax)", category: "video", url: "https://hailuoai.video", desc: "Generador de vídeo de MiniMax (Hailuo H3). Físicas realistas y buen seguimiento de prompts.", free: true, pricing: { free: true, freeTier: "Créditos diarios limitados con marca de agua", price: "Standard: $14.99/mes (1.000 créditos)", tokenValue: "~$0.44 por clip de 6 s a 768p" }, example: "Prompt: 'Una bailarina de flamenco gira en cámara lenta, luz cálida de tablao'" },
  { name: "ElevenMusic", category: "audio", url: "https://elevenlabs.io/music", desc: "Música IA de ElevenLabs (Music v2). Entrenada con datos licenciados, apta para uso comercial.", free: true, pricing: { free: true, freeTier: "7 canciones/día en la app", price: "Más uso con planes de ElevenLabs (desde $6/mes)", tokenValue: "N/A" }, example: "Escribe: 'Balada pop en español que pase a rock en el estribillo' → canción de 3 min" },
  { name: "Google Flow Music (Lyria)", category: "audio", url: "https://labs.google/flow", desc: "Música con Lyria 3.5 de DeepMind: canciones de 3 min, covers, edición por secciones y vídeo.", free: true, pricing: { free: true, freeTier: "Incluido en los créditos diarios de Flow", price: "Más créditos con Google AI Pro ($19.99/mes)", tokenValue: "N/A" }, example: "Pide: 'Canción infantil sobre reciclar, ukelele y coro' → genera y edita por secciones" },
  { name: "Claude Code", category: "codigo", url: "https://claude.com/claude-code", desc: "Agente de programación de Anthropic en terminal, IDE y web. Entiende repos enteros y ejecuta tareas.", featured: true, free: false, pricing: { free: false, freeTier: "No incluido en el plan gratuito", price: "Con Claude Pro ($20/mes) o Max ($100–200)", tokenValue: "También por API (~$3/M tokens Sonnet)" }, example: "En tu repo: 'Añade tests a este módulo, arregla lo que falle y abre un PR'" },
  { name: "OpenAI Codex", category: "codigo", url: "https://chatgpt.com/codex", desc: "Agente de programación de OpenAI (CLI, IDE y nube). Trabaja en paralelo sobre tu repositorio.", free: false, pricing: { free: false, freeTier: "No incluido en el plan gratuito", price: "Con ChatGPT Plus ($20/mes) · Pro: desde $100", tokenValue: "N/A" }, example: "Delega: 'Migra este proyecto de JavaScript a TypeScript y ejecuta los tests'" },
  { name: "Google Antigravity", category: "codigo", url: "https://antigravity.google", desc: "Plataforma de desarrollo agent-first de Google (2026). Agentes que planifican, codifican y verifican.", free: true, pricing: { free: true, freeTier: "Tier gratuito pequeño", price: "Con Google AI Pro/Ultra o licencia empresarial", tokenValue: "N/A" }, example: "Encárgale una feature completa y revisa el plan y las capturas que genera" },
  { name: "Lovable", category: "codigo", url: "https://lovable.dev", desc: "Crea apps web completas (front + Supabase) desde texto. La herramienta europea de 'vibe coding'.", featured: true, free: true, pricing: { free: true, freeTier: "5 créditos/día (máx. 30/mes)", price: "Pro: $25/mes ($21 anual, 100 créditos) · Business: $50", tokenValue: "1 crédito por mensaje" }, example: "Escribe: 'App para reservar pistas de pádel con login y pagos' → app desplegada" },
  { name: "Base44", category: "codigo", url: "https://base44.com", desc: "Constructor de apps sin código con IA (de Wix). Base de datos, usuarios y despliegue incluidos.", free: true, pricing: { free: true, freeTier: "Mensajes limitados gratis", price: "Starter: $20/mes · Builder: $50", tokenValue: "N/A" }, example: "Describe: 'CRM sencillo para mi academia con alumnos y pagos' → app lista para usar" },
  { name: "Cline", category: "codigo", url: "https://cline.bot", desc: "Agente de programación open-source para VS Code. Usa el modelo que quieras con tu propia API key.", free: true, pricing: { free: true, freeTier: "Open-source gratis (pagas solo la API)", price: "Gratis + coste del modelo elegido", tokenValue: "Depende del modelo" }, example: "Instala en VS Code → conecta tu API → 'Implementa el endpoint de login con JWT'" },
  { name: "Devin", category: "codigo", url: "https://devin.ai", desc: "Ingeniero de software IA de Cognition. Trabaja en tareas completas en su propio entorno.", free: false, pricing: { free: false, freeTier: "Sin plan gratuito", price: "Core: desde $20/mes (pago por uso)", tokenValue: "~$2.25 por unidad de cómputo" }, example: "Asigna un issue de GitHub → Devin lo resuelve y abre el PR con explicación" },
  { name: "Google AI Mode", category: "investigacion", url: "https://google.com/ai", desc: "Modo IA del buscador de Google: respuestas razonadas con Gemini, seguimiento y Deep Search.", free: true, pricing: { free: true, freeTier: "Gratis para todos", price: "Deep Search ampliado con Google AI Pro", tokenValue: "N/A" }, example: "Pregunta: 'Qué portátil comprar para edición de vídeo por menos de 1.200 €' → comparación con fuentes" },
  { name: "ChatGPT Modo Estudio", category: "educacion", url: "https://chatgpt.com", desc: "Modo de ChatGPT que guía paso a paso en vez de dar la respuesta. Ideal para aprender de verdad.", free: true, pricing: { free: true, freeTier: "Gratis en todos los planes", price: "Sin coste adicional", tokenValue: "N/A" }, example: "Activa Modo Estudio y pide: 'Ayúdame a entender las ecuaciones de segundo grado'" },
];

// ─── Detailed tool descriptions for modal ───
const TOOL_DETAILS: Record<string, { whatIs: string; bestFor: string[]; howToStart: string; avatar: string }> = {
  "ChatGPT": { whatIs: "ChatGPT es la IA conversacional más popular del mundo, creada por OpenAI. En 2026 usa los modelos GPT-5.x para razonar, generar texto y código, analizar archivos, hablar por voz, generar imágenes (ChatGPT Images) y ejecutar tareas como agente.", bestFor: ["Redactar emails, informes y documentos profesionales", "Analizar datos y documentos (PDFs, CSVs, imágenes)", "Generar y depurar código en cualquier lenguaje", "Investigación profunda (Deep Research) y tareas de agente"], howToStart: "Ve a chatgpt.com y crea una cuenta gratuita: incluye GPT-5 con límites. Go ($8/mes) amplía el uso; Plus ($20/mes) desbloquea agente, más imágenes y Deep Research.", avatar: "SABELIN" },
  "Claude": { whatIs: "Claude es la IA de Anthropic, diseñada para ser segura y útil. Los modelos Claude Opus y Sonnet 5 destacan en razonamiento complejo, análisis de documentos muy largos (hasta 1M tokens), escritura de calidad y programación con Claude Code.", bestFor: ["Análisis de documentos extensos (contratos, informes)", "Razonamiento lógico y resolución de problemas complejos", "Escritura creativa y literaria", "Programación con agentes (Claude Code)"], howToStart: "Visita claude.ai y regístrate. La versión gratuita incluye Claude Sonnet 5 con límites. Pro cuesta $20/mes y Max desde $100/mes para uso intensivo.", avatar: "SABELIN" },
  "Gemini": { whatIs: "Gemini es la IA de Google, integrada con Gmail, Docs, Drive y Maps. Multimodal: entiende texto, imágenes, audio y video.", bestFor: ["Integración con Google Workspace", "Análisis multimodal (texto + imagen + audio)", "Búsqueda con información actualizada", "Generación de contenido para YouTube"], howToStart: "Accede a gemini.google.com con tu cuenta Google. Gratis con límites diarios. Google AI Pro ($19.99/mes) desbloquea Gemini 3.x Pro, Deep Research, Veo y NotebookLM ampliado.", avatar: "SABELIN" },
  "Midjourney": { whatIs: "Midjourney es el líder en generación de imágenes artísticas con IA. Con V8.1 (2026) ofrece fotorrealismo, estilos únicos y también generación de vídeo.", bestFor: ["Arte conceptual e ilustraciones", "Diseño de personajes y escenarios", "Fotografía artística", "Branding y diseño visual"], howToStart: "Ve a midjourney.com y suscríbete (Basic desde $10/mes). Usa la web o Discord y escribe tu descripción en /imagine.", avatar: "MAMALINA" },
  "Hedra": { whatIs: "Hedra crea avatares animados a partir de una foto y audio. Genera lip-sync perfecto y expresiones faciales naturales. Ideal para contenido personalizado y presentaciones.", bestFor: ["Crear avatares animados desde una foto", "Lip-sync perfecto con cualquier audio", "Videos personalizados para redes sociales", "Presentaciones con tu avatar hablando"], howToStart: "Regístrate en hedra.com. 300 créditos gratis/mes con marca de agua. Basic: $15/mes (1.500 créditos); Creator: $30/mes.", avatar: "CHAVALIN" },
  "Suno": { whatIs: "Suno genera canciones completas con IA: letra, melodía, voz y producción. Describe el estilo y tema, y obtén una canción profesional en segundos.", bestFor: ["Crear canciones originales con letra y melodía", "Producción musical sin conocimientos técnicos", "Jingles y música para contenido", "Experimentar con géneros musicales"], howToStart: "Ve a suno.com. 50 créditos/día gratis (~10 canciones, sin uso comercial). Pro: $10/mes para 2.500 créditos y descargas comerciales.", avatar: "PEQUELINA" },
  "ElevenLabs": { whatIs: "ElevenLabs ofrece voz IA ultra realista (Eleven v3) en 70+ idiomas: text-to-speech, clonación, doblaje, agentes de voz y, desde 2026, música con ElevenMusic. Puedes clonar tu propia voz con solo 30 segundos de audio.", bestFor: ["Narración profesional para videos y podcasts", "Clonación de voz personalizada", "Audiolibros y contenido educativo", "Doblaje multilingüe"], howToStart: "Regístrate en elevenlabs.io. 10.000 créditos/mes gratis (~10 min). Starter: $6/mes; Creator: $22/mes.", avatar: "PEQUELINA" },
  "Runway": { whatIs: "Runway es una de las suites de vídeo IA más completas. Gen-4.5 genera vídeos de alta calidad y consistencia, con herramientas de edición, eliminación de fondos y efectos especiales.", bestFor: ["Generación de video desde texto o imagen", "Edición profesional de video con IA", "Efectos especiales y motion graphics", "Contenido para marketing"], howToStart: "Regístrate en runway.com. 125 créditos gratis de prueba (Gen-4.5 requiere plan). Standard: $12/mes anual.", avatar: "CHAVALIN" },
  "Kling AI": { whatIs: "Kling AI de Kuaishou (VIDEO 3.0) genera vídeos con movimiento realista, audio nativo y lip-sync. Tiene el tier gratuito más generoso entre los grandes generadores de vídeo.", bestFor: ["Videos con movimiento realista", "Lip-sync y animación facial", "Contenido para redes sociales", "Clips creativos y artísticos"], howToStart: "Ve a kling.ai. 66 créditos/día gratis (con marca de agua). Standard: $6.99/mes.", avatar: "CHAVALIN" },
  "HeyGen": { whatIs: "HeyGen crea videos con avatares IA realistas (Avatar IV/V) que hablan en 175+ idiomas. Puedes clonar tu apariencia y voz para crear contenido personalizado.", bestFor: ["Videos de formación corporativa", "Presentaciones con avatar personal", "Marketing personalizado", "Traducción de videos"], howToStart: "Regístrate en heygen.com. 3 vídeos/mes gratis con marca de agua. Creator: $29/mes (600 créditos).", avatar: "YAYALIN" },
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
            
            <span className="font-display font-bold text-base text-[#00E5FF]">LINCE</span>
          </a>
          <div className="flex items-center gap-2">
            <span className="text-[#00E5FF] text-xs font-medium px-3 py-1 rounded-full bg-[#00E5FF]/10 border border-[#00E5FF]/30 flex items-center gap-1.5">
              <Zap className="w-3 h-3" /> {TOOLS.length} herramientas
            </span>
            <span className="hidden sm:flex text-[#D4A843] text-xs font-medium px-3 py-1 rounded-full bg-[#D4A843]/10 border border-[#D4A843]/30 items-center gap-1.5">
              <Clock className="w-3 h-3" /> Actualizado: {TOOLS_LAST_UPDATE}
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
            <h1 className="font-display font-bold text-4xl sm:text-6xl text-white mb-5">
              Arsenal <span className="text-[#00E5FF]">IA</span>
            </h1>
            <p className="text-white/70 text-lg sm:text-xl max-w-2xl mx-auto mb-3">
              <span className="text-[#00E5FF] font-bold">{TOOLS.length} herramientas</span> de inteligencia artificial organizadas en{" "}
              <span className="text-[#D4A843] font-bold">{CATEGORIES.length - 1} categorías</span>.
              Todas verificadas, con precios revisados en {TOOLS_LAST_UPDATE} y ejemplos de uso.
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
              <h3 className="font-display font-bold text-white text-lg mb-4 flex items-center gap-2">
                <Star className="w-5 h-5 text-[#D4A843]" /> Destacadas
              </h3>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {featuredTools.map((tool, i) => (
                  <button key={i} onClick={() => setSelectedTool(tool)}
                    className="group p-4 bg-gradient-to-br from-[#D4A843]/[0.06] to-transparent border border-[#D4A843]/20 rounded-xl hover:border-[#D4A843]/40 transition-all text-left">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-display font-bold text-white text-sm group-hover:text-[#D4A843] transition-colors truncate">{tool.name}</h4>
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
                  <h4 className="font-display font-bold text-white text-base sm:text-lg group-hover:text-[#00E5FF] transition-colors">{tool.name}</h4>
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

import { useState, useEffect, useRef } from 'react';
import { Link } from 'wouter';
import { UserNavBadge } from '@/components/UserNavBadge';
import { useGameLang } from "@/hooks/useGameLang";
import { PRDLanguageSelector } from '../components/PRDLanguageSelector';
import { GameLanguageSelector } from '../components/GameLanguageSelector';
import { AVATAR_FRONTAL, AVATAR_EXPRESSIONS, AVATAR_BG, MUNDO_IMAGES, RAIDS_IMAGES, ACADEMIA_HERO_BG } from '../lib/avatarConstants';
import { GlossaryTooltip } from '../components/GlossaryTooltip';
import { usePRDLanguage, tl} from '@/contexts/PRDLanguageContext';
import { GlobalNavBar } from "@/components/GlobalNavBar";

/* ─── Hook: IntersectionObserver ─── */
function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setIsVisible(true); }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, isVisible };
}

function FadeIn({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const { ref, isVisible } = useInView();
  return (
    <div ref={ref} className={`transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"} ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

/* ─── Translations ─── */
const T = {
  es: {
    heroTitle: 'CÓMO',
    heroAccent: 'EMPEZAR',
    heroSub: 'Guía rápida para entender LINCE en 2 minutos',
    heroDesc: 'LINCE es una plataforma donde aprendes Inteligencia Artificial jugando. No necesitas saber nada de tecnología. Solo elige una herramienta y empieza.',
    step1: '1. Regístrate gratis',
    step1desc: 'Crea tu cuenta con usuario y contraseña. Es gratis y tarda 30 segundos.',
    step2: '2. Elige una herramienta',
    step2desc: 'Cada herramienta te enseña algo diferente. Empieza por la que más te llame la atención.',
    step3: '3. Aprende jugando',
    step3desc: 'Escribe, crea, explora. Todo lo que haces te da puntos (XP) y monedas (LinceCoins).',
    toolsTitle: 'Las 6 herramientas de LINCE',
    toolsSub: 'Cada una hace algo diferente. Aquí te explicamos qué es y para qué sirve cada una.',
    recoTitle: '¿Por dónde empiezo?',
    recoSub: 'Nuestra recomendación según tu perfil',
    recoNew: 'Si nunca has usado IA',
    recoNewDesc: 'Empieza por los Avatares. Elige un personaje y chatea con él. Te explicará todo como si fuera un amigo.',
    recoCurious: 'Si quieres crear algo ya',
    recoCuriousDesc: 'Ve directo a IMAGELIN. Escribe qué imagen quieres y la IA la genera al instante. Es la forma más rápida de ver la magia de la IA.',
    recoGamer: 'Si te gustan los retos',
    recoGamerDesc: 'Entra a ¡JUGAR! Tienes niveles, misiones y competiciones. Aprenderás sin darte cuenta.',
    recoProf: 'Si quieres aprender herramientas reales',
    recoProfDesc: 'El Arsenal IA tiene 62+ herramientas reales (ChatGPT, Midjourney, etc.) con guías paso a paso.',
    promptTitle: '¿Qué es un Prompt?',
    promptDesc: 'Un prompt es una instrucción que le escribes a la IA. Es como pedirle algo a un asistente muy inteligente. Cuanto mejor expliques lo que quieres, mejor resultado obtienes.',
    promptBad: 'Prompt malo: "Haz algo bonito"',
    promptGood: 'Prompt bueno: "Crea una imagen de un gato lince con gafas de sol, estilo cyberpunk, fondo de ciudad nocturna"',
    promptTip: 'Truco: sé específico. Incluye detalles como estilo, colores, contexto y formato.',
    faqTitle: 'Preguntas frecuentes',
    faq1q: '¿Es gratis?',
    faq1a: 'Sí. El registro es gratis y tienes acceso a todas las herramientas. Algunas funciones avanzadas requieren LinceCoins que ganas jugando.',
    faq2q: '¿Necesito saber de tecnología?',
    faq2a: 'No. LINCE está diseñado para todas las edades y niveles. Desde niños de 6 años hasta abuelos de 80.',
    faq3q: '¿Es seguro para niños?',
    faq3a: 'Sí. Hay controles parentales, filtros de contenido y moderación activa. Los menores de 13 años necesitan permiso de un adulto.',
    faq4q: '¿Qué son los LinceCoins?',
    faq4a: 'Son la moneda del juego. Los ganas completando actividades y los usas para desbloquear avatares, fondos y objetos especiales en el Mercado.',
    faq5q: '¿Puedo jugar con mi familia?',
    faq5a: 'Sí. Cada miembro de la familia puede crear su cuenta y hay misiones familiares que dan el doble de recompensas.',
    ctaTitle: '¿Listo para empezar?',
    ctaDesc: 'Regístrate gratis y empieza tu aventura en LINCE.',
    ctaBtn: 'Crear cuenta gratis',
    ctaExplore: 'Explorar sin cuenta',
  },
  en: {
    heroTitle: 'HOW TO',
    heroAccent: 'START',
    heroSub: 'Quick guide to understand LINCE in 2 minutes',
    heroDesc: 'LINCE is a platform where you learn Artificial Intelligence by playing. You don\'t need to know anything about technology. Just pick a tool and start.',
    step1: '1. Register for free',
    step1desc: 'Create your account with username and password. It\'s free and takes 30 seconds.',
    step2: '2. Pick a tool',
    step2desc: 'Each tool teaches you something different. Start with whichever catches your eye.',
    step3: '3. Learn by playing',
    step3desc: 'Write, create, explore. Everything you do earns points (XP) and coins (LinceCoins).',
    toolsTitle: 'The 6 tools of LINCE',
    toolsSub: 'Each one does something different. Here\'s what each one is and what it\'s for.',
    recoTitle: 'Where should I start?',
    recoSub: 'Our recommendation based on your profile',
    recoNew: 'If you\'ve never used AI',
    recoNewDesc: 'Start with Avatars. Choose a character and chat with them. They\'ll explain everything like a friend.',
    recoCurious: 'If you want to create something now',
    recoCuriousDesc: 'Go straight to IMAGELIN. Describe what image you want and AI generates it instantly.',
    recoGamer: 'If you like challenges',
    recoGamerDesc: 'Enter PLAY!. You have levels, missions and competitions. You\'ll learn without realizing it.',
    recoProf: 'If you want to learn real tools',
    recoProfDesc: 'The AI Arsenal has 62+ real tools (ChatGPT, Midjourney, etc.) with step-by-step guides.',
    promptTitle: 'What is a Prompt?',
    promptDesc: 'A prompt is an instruction you write for the AI. It\'s like asking a very smart assistant for something. The better you explain what you want, the better the result.',
    promptBad: 'Bad prompt: "Make something pretty"',
    promptGood: 'Good prompt: "Create an image of a lynx cat with sunglasses, cyberpunk style, neon city background"',
    promptTip: 'Tip: be specific. Include details like style, colors, context and format.',
    faqTitle: 'Frequently asked questions',
    faq1q: 'Is it free?',
    faq1a: 'Yes. Registration is free and you have access to all tools. Some advanced features require LinceCoins earned by playing.',
    faq2q: 'Do I need tech knowledge?',
    faq2a: 'No. LINCE is designed for all ages and levels. From 6-year-old kids to 80-year-old grandparents.',
    faq3q: 'Is it safe for kids?',
    faq3a: 'Yes. There are parental controls, content filters and active moderation. Children under 13 need adult permission.',
    faq4q: 'What are LinceCoins?',
    faq4a: 'They\'re the game currency. You earn them by completing activities and use them to unlock avatars, backgrounds and special items in the Market.',
    faq5q: 'Can I play with my family?',
    faq5a: 'Yes. Each family member can create their account and there are family missions that give double rewards.',
    ctaTitle: 'Ready to start?',
    ctaDesc: 'Register for free and begin your LINCE adventure.',
    ctaBtn: 'Create free account',
    ctaExplore: 'Explore without account',
  },
  zh: {
    heroTitle: '如何',
    heroAccent: '开始',
    heroSub: '2分钟快速了解LINCE',
    heroDesc: 'LINCE是一个通过游戏学习人工智能的平台。你不需要任何技术知识。只需选择一个工具并开始。',
    step1: '1. 免费注册',
    step1desc: '用用户名和密码创建账户。免费，只需30秒。',
    step2: '2. 选择一个工具',
    step2desc: '每个工具教你不同的东西。从最吸引你的开始。',
    step3: '3. 玩中学',
    step3desc: '写作、创造、探索。你做的一切都能赚取积分(XP)和金币(LinceCoins)。',
    toolsTitle: 'LINCE的6个工具',
    toolsSub: '每个都做不同的事。这里解释每个工具是什么以及用途。',
    recoTitle: '我应该从哪里开始？',
    recoSub: '根据你的情况推荐',
    recoNew: '如果你从未使用过AI',
    recoNewDesc: '从角色开始。选一个角色和它聊天。它会像朋友一样解释一切。',
    recoCurious: '如果你想立刻创造东西',
    recoCuriousDesc: '直接去IMAGELIN。描述你想要的图像，AI立即生成。',
    recoGamer: '如果你喜欢挑战',
    recoGamerDesc: '进入立即游玩。有关卡、任务和竞赛。你会在不知不觉中学会。',
    recoProf: '如果你想学习真实工具',
    recoProfDesc: 'AI武器库有62+个真实工具（ChatGPT、Midjourney等），配有分步指南。',
    promptTitle: '什么是Prompt？',
    promptDesc: 'Prompt是你写给AI的指令。就像向一个非常聪明的助手提要求。你解释得越好，结果越好。',
    promptBad: '差的Prompt："做点好看的"',
    promptGood: '好的Prompt："创建一张戴墨镜的山猫图像，赛博朋克风格，霓虹城市背景"',
    promptTip: '技巧：要具体。包括风格、颜色、背景和格式等细节。',
    faqTitle: '常见问题',
    faq1q: '免费吗？',
    faq1a: '是的。注册免费，可以使用所有工具。一些高级功能需要通过游戏赚取的LinceCoins。',
    faq2q: '需要技术知识吗？',
    faq2a: '不需要。LINCE为所有年龄和水平设计。从6岁儿童到80岁老人。',
    faq3q: '对孩子安全吗？',
    faq3a: '是的。有家长控制、内容过滤和主动审核。13岁以下需要成人许可。',
    faq4q: '什么是LinceCoins？',
    faq4a: '游戏货币。通过完成活动赚取，用于解锁角色、背景和市场中的特殊物品。',
    faq5q: '可以和家人一起玩吗？',
    faq5a: '可以。每个家庭成员可以创建账户，还有双倍奖励的家庭任务。',
    ctaTitle: '准备好了吗？',
    ctaDesc: '免费注册，开始你的LINCE冒险。',
    ctaBtn: '创建免费账户',
    ctaExplore: '无需账户探索',
  },
};

/* ─── Tools data ─── */
const TOOLS = {
  es: [
    {
      icon: '🕹️',
      name: '¡JUGAR!',
      color: '#00E5FF',
      gradient: 'from-cyan-500/10 to-cyan-600/5',
      border: 'border-cyan-500/30',
      href: '/jugar',
      what: '¿Qué es?',
      whatDesc: 'Tu mapa de aventura. Un recorrido por niveles donde aprendes IA paso a paso, como en un videojuego.',
      how: '¿Cómo funciona?',
      howDesc: 'Empiezas en el Nivel 1 ("Tu Primer Prompt") y avanzas desbloqueando niveles. Cada nivel te enseña algo nuevo: escribir prompts, crear habitaciones virtuales, defender tu casa en combates PvP...',
      earn: '¿Qué ganas?',
      earnDesc: 'XP para subir de nivel, LinceCoins para comprar en el Mercado, y conocimiento real de IA.',
      tip: 'Empieza aquí si quieres una experiencia guiada de principio a fin.',
      avatar: 'CHAVALIN',
    },
    {
      icon: '🖼️',
      name: 'IMAGELIN',
      color: '#9C27B0',
      gradient: 'from-purple-500/10 to-purple-600/5',
      border: 'border-purple-500/30',
      href: '/prompt-studio',
      what: '¿Qué es?',
      whatDesc: 'Un creador de imágenes con IA. Tú describes lo que quieres y la IA lo genera en segundos.',
      how: '¿Cómo funciona?',
      howDesc: 'Rellenas 4 campos simples: Sujeto (qué quieres), Estilo (cómo se ve), Entorno (dónde está) y Detalles (extras). La IA genera la imagen al instante. Puedes descargarla en PNG.',
      earn: '¿Qué ganas?',
      earnDesc: 'Imágenes únicas creadas por ti, XP por cada generación, y aprendes a escribir prompts visuales.',
      tip: 'La forma más rápida de ver la magia de la IA. Perfecto para empezar.',
      avatar: 'PEQUELINA',
    },
    {
      icon: '🎨',
      name: 'LINCELIN',
      color: '#EC4899',
      gradient: 'from-pink-500/10 to-pink-600/5',
      border: 'border-pink-500/30',
      href: '/lincelin',
      what: '¿Qué es?',
      whatDesc: 'Un diseñador de avatares lince personalizados. Creas tu propio personaje único con IA.',
      how: '¿Cómo funciona?',
      howDesc: 'Eliges un estilo (cyberpunk, fantasía, steampunk...), ajustas colores y accesorios, y la IA genera tu avatar lince personalizado. Es TU personaje único en LINCE.',
      earn: '¿Qué ganas?',
      earnDesc: 'Tu avatar personalizado, XP por creación, y aprendes sobre generación de imágenes con IA.',
      tip: 'Ideal si te gusta personalizar y crear cosas únicas.',
      avatar: 'CHAVALINA',
    },
    {
      icon: '🐱',
      name: 'Avatares',
      color: '#FFB300',
      gradient: 'from-amber-500/10 to-amber-600/5',
      border: 'border-amber-500/30',
      href: '/personajes',
      what: '¿Qué es?',
      whatDesc: 'La galería de todos los personajes de LINCE. Más de 65 avatares lince, cada uno con su personalidad y especialidad.',
      how: '¿Cómo funciona?',
      howDesc: 'Exploras las familias de personajes (Familia LINCECE, Especialistas, MUSICALIN, Aragoneses...). Puedes ver su historia, sus expresiones, y lo mejor: chatear con ellos. Cada avatar es un profesor de IA diferente.',
      earn: '¿Qué ganas?',
      earnDesc: 'Conversaciones con IA personalizadas, aprendes de cada especialidad, y desbloqueas avatares para tu perfil.',
      tip: 'Perfecto si nunca has usado IA. Chatea con un avatar y él te guía.',
      avatar: 'SABELIN',
    },
    {
      icon: '⚡',
      name: 'Arsenal IA',
      color: '#00E5FF',
      gradient: 'from-cyan-500/10 to-teal-600/5',
      border: 'border-teal-500/30',
      href: '/arsenal-ia',
      what: '¿Qué es?',
      whatDesc: 'Un catálogo de más de 62 herramientas de IA reales, organizadas por categoría, con guías paso a paso.',
      how: '¿Cómo funciona?',
      howDesc: 'Buscas la herramienta que necesitas (texto, imagen, vídeo, código, música...), lees la guía, ves ejemplos reales, y aprendes a usarla. Incluye ChatGPT, Midjourney, DALL-E, Suno, Runway y muchas más.',
      earn: '¿Qué ganas?',
      earnDesc: 'Conocimiento práctico de herramientas reales que puedes usar en tu trabajo o estudios.',
      tip: 'Ideal si quieres aprender herramientas de IA que se usan en el mundo real.',
      avatar: 'PAPALIN',
    },
    {
      icon: '🧠',
      name: 'PROMPTLIN',
      color: '#7C3AED',
      gradient: 'from-violet-500/10 to-violet-600/5',
      border: 'border-violet-500/30',
      href: '/promptear',
      what: '¿Qué es?',
      whatDesc: 'La academia de prompts. Un juego competitivo donde aprendes a escribir instrucciones para la IA como un profesional.',
      how: '¿Cómo funciona?',
      howDesc: 'Tienes 6 modos: Creativo, Técnico, Negocio, Ética, Speed Run y Battle. En cada modo escribes prompts y la IA los evalúa en tiempo real. El Lince Mentor te da feedback y te dice cómo mejorar.',
      earn: '¿Qué ganas?',
      earnDesc: 'La habilidad más importante del futuro: saber comunicarte con la IA. Además, XP, LinceCoins y posición en el ranking.',
      tip: 'Para los que quieren dominar los prompts y competir.',
      avatar: 'ATOLONDRALIN',
    },
  ],
  en: [
    {
      icon: '🕹️', name: 'PLAY!', color: '#00E5FF', gradient: 'from-cyan-500/10 to-cyan-600/5', border: 'border-cyan-500/30', href: '/jugar',
      what: 'What is it?', whatDesc: 'Your adventure map. A level-by-level journey where you learn AI step by step, like a video game.',
      how: 'How does it work?', howDesc: 'Start at Level 1 ("Your First Prompt") and progress by unlocking levels. Each level teaches something new: writing prompts, building virtual rooms, defending your house in PvP battles...',
      earn: 'What do you earn?', earnDesc: 'XP to level up, LinceCoins for the Market, and real AI knowledge.',
      tip: 'Start here for a guided experience from start to finish.', avatar: 'CHAVALIN',
    },
    {
      icon: '🖼️', name: 'IMAGELIN', color: '#9C27B0', gradient: 'from-purple-500/10 to-purple-600/5', border: 'border-purple-500/30', href: '/prompt-studio',
      what: 'What is it?', whatDesc: 'An AI image creator. You describe what you want and AI generates it in seconds.',
      how: 'How does it work?', howDesc: 'Fill 4 simple fields: Subject (what), Style (how it looks), Environment (where), Details (extras). AI generates the image instantly. Download as PNG.',
      earn: 'What do you earn?', earnDesc: 'Unique images created by you, XP per generation, and you learn visual prompt writing.',
      tip: 'The fastest way to see AI magic. Perfect to start.', avatar: 'PEQUELINA',
    },
    {
      icon: '🎨', name: 'LINCELIN', color: '#EC4899', gradient: 'from-pink-500/10 to-pink-600/5', border: 'border-pink-500/30', href: '/lincelin',
      what: 'What is it?', whatDesc: 'A custom lynx avatar designer. Create your own unique character with AI.',
      how: 'How does it work?', howDesc: 'Choose a style (cyberpunk, fantasy, steampunk...), adjust colors and accessories, and AI generates your custom lynx avatar.',
      earn: 'What do you earn?', earnDesc: 'Your personalized avatar, creation XP, and you learn about AI image generation.',
      tip: 'Ideal if you like customizing and creating unique things.', avatar: 'CHAVALINA',
    },
    {
      icon: '🐱', name: 'Avatars', color: '#FFB300', gradient: 'from-amber-500/10 to-amber-600/5', border: 'border-amber-500/30', href: '/personajes',
      what: 'What is it?', whatDesc: 'The gallery of all LINCE characters. 65+ lynx avatars, each with their personality and specialty.',
      how: 'How does it work?', howDesc: 'Explore character families (LINCECE Family, Specialists, MUSICALIN, Aragonese...). See their story, expressions, and best of all: chat with them. Each avatar is a different AI teacher.',
      earn: 'What do you earn?', earnDesc: 'Personalized AI conversations, learn from each specialty, and unlock avatars for your profile.',
      tip: 'Perfect if you\'ve never used AI. Chat with an avatar and it guides you.', avatar: 'SABELIN',
    },
    {
      icon: '⚡', name: 'AI Arsenal', color: '#00E5FF', gradient: 'from-cyan-500/10 to-teal-600/5', border: 'border-teal-500/30', href: '/arsenal-ia',
      what: 'What is it?', whatDesc: 'A catalog of 62+ real AI tools, organized by category, with step-by-step guides.',
      how: 'How does it work?', howDesc: 'Search for the tool you need (text, image, video, code, music...), read the guide, see real examples, and learn to use it. Includes ChatGPT, Midjourney, DALL-E, Suno, Runway and more.',
      earn: 'What do you earn?', earnDesc: 'Practical knowledge of real tools you can use at work or school.',
      tip: 'Ideal if you want to learn real-world AI tools.', avatar: 'PAPALIN',
    },
    {
      icon: '🧠', name: 'PROMPTLIN', color: '#7C3AED', gradient: 'from-violet-500/10 to-violet-600/5', border: 'border-violet-500/30', href: '/promptear',
      what: 'What is it?', whatDesc: 'The prompt academy. A competitive game where you learn to write AI instructions like a pro.',
      how: 'How does it work?', howDesc: '6 modes: Creative, Technical, Business, Ethics, Speed Run and Battle. Write prompts and AI evaluates them in real time. The Lynx Mentor gives you feedback.',
      earn: 'What do you earn?', earnDesc: 'The most important skill of the future: communicating with AI. Plus XP, LinceCoins and ranking position.',
      tip: 'For those who want to master prompts and compete.', avatar: 'ATOLONDRALIN',
    },
  ],
  zh: [
    {
      icon: '🕹️', name: '立即游玩！', color: '#00E5FF', gradient: 'from-cyan-500/10 to-cyan-600/5', border: 'border-cyan-500/30', href: '/jugar',
      what: '这是什么？', whatDesc: '你的冒险地图。一个逐级学习AI的旅程，就像电子游戏。',
      how: '怎么玩？', howDesc: '从第1关（"你的第一个Prompt"）开始，逐步解锁关卡。每关教你新东西：写提示词、建虚拟房间、PvP防御...',
      earn: '能获得什么？', earnDesc: '升级XP、市场LinceCoins和真正的AI知识。',
      tip: '想要从头到尾的引导体验，从这里开始。', avatar: 'CHAVALIN',
    },
    {
      icon: '🖼️', name: 'IMAGELIN', color: '#9C27B0', gradient: 'from-purple-500/10 to-purple-600/5', border: 'border-purple-500/30', href: '/prompt-studio',
      what: '这是什么？', whatDesc: 'AI图像创作器。你描述想要的，AI几秒内生成。',
      how: '怎么用？', howDesc: '填4个简单字段：主题、风格、环境、细节。AI立即生成图像。可下载PNG。',
      earn: '能获得什么？', earnDesc: '你创作的独特图像、每次生成的XP，学习视觉提示词写作。',
      tip: '体验AI魔力最快的方式。完美的起点。', avatar: 'PEQUELINA',
    },
    {
      icon: '🎨', name: 'LINCELIN', color: '#EC4899', gradient: 'from-pink-500/10 to-pink-600/5', border: 'border-pink-500/30', href: '/lincelin',
      what: '这是什么？', whatDesc: '自定义山猫角色设计器。用AI创建你独特的角色。',
      how: '怎么用？', howDesc: '选择风格（赛博朋克、奇幻、蒸汽朋克...），调整颜色和配件，AI生成你的专属山猫角色。',
      earn: '能获得什么？', earnDesc: '你的个性化角色、创作XP，学习AI图像生成。',
      tip: '喜欢定制和创造独特事物的理想选择。', avatar: 'CHAVALINA',
    },
    {
      icon: '🐱', name: '角色', color: '#FFB300', gradient: 'from-amber-500/10 to-amber-600/5', border: 'border-amber-500/30', href: '/personajes',
      what: '这是什么？', whatDesc: '所有LINCE角色的画廊。65+个山猫角色，各有个性和专长。',
      how: '怎么用？', howDesc: '探索角色家族。查看故事、表情，最棒的是：和他们聊天。每个角色都是不同的AI老师。',
      earn: '能获得什么？', earnDesc: '个性化AI对话、各专业知识、解锁个人资料角色。',
      tip: '从未用过AI？和角色聊天，它会引导你。', avatar: 'SABELIN',
    },
    {
      icon: '⚡', name: 'AI武器库', color: '#00E5FF', gradient: 'from-cyan-500/10 to-teal-600/5', border: 'border-teal-500/30', href: '/arsenal-ia',
      what: '这是什么？', whatDesc: '62+个真实AI工具目录，按类别组织，配有分步指南。',
      how: '怎么用？', howDesc: '搜索你需要的工具（文本、图像、视频、代码、音乐...），阅读指南，看真实示例。包括ChatGPT、Midjourney等。',
      earn: '能获得什么？', earnDesc: '可在工作或学习中使用的实用工具知识。',
      tip: '想学习真实世界AI工具的理想选择。', avatar: 'PAPALIN',
    },
    {
      icon: '🧠', name: 'PROMPTLIN', color: '#7C3AED', gradient: 'from-violet-500/10 to-violet-600/5', border: 'border-violet-500/30', href: '/promptear',
      what: '这是什么？', whatDesc: '提示词学院。一个竞技游戏，学习像专业人士一样写AI指令。',
      how: '怎么用？', howDesc: '6种模式：创意、技术、商业、伦理、极速、对战。写提示词，AI实时评估。山猫导师给你反馈。',
      earn: '能获得什么？', earnDesc: '未来最重要的技能：与AI沟通。加上XP、LinceCoins和排名。',
      tip: '想掌握提示词和竞争的人的选择。', avatar: 'ATOLONDRALIN',
    },
  ],
};

/* ─── Recommendation profiles ─── */
const RECO_PROFILES = {
  es: [
    { emoji: '🌱', title: 'Si nunca has usado IA', desc: 'Empieza por los Avatares. Elige un personaje y chatea con él. Te explicará todo como si fuera un amigo.', href: '/personajes', btn: 'Ir a Avatares', color: '#FFB300' },
    { emoji: '✨', title: 'Si quieres crear algo ya', desc: 'Ve directo a IMAGELIN. Escribe qué imagen quieres y la IA la genera al instante.', href: '/prompt-studio', btn: 'Ir a IMAGELIN', color: '#9C27B0' },
    { emoji: '🎮', title: 'Si te gustan los retos', desc: 'Entra a ¡JUGAR! Tienes niveles, misiones y competiciones. Aprenderás sin darte cuenta.', href: '/jugar', btn: 'Ir a Jugar', color: '#00E5FF' },
    { emoji: '💼', title: 'Si quieres herramientas reales', desc: 'El Arsenal IA tiene 62+ herramientas reales (ChatGPT, Midjourney, etc.) con guías paso a paso.', href: '/arsenal-ia', btn: 'Ir al Arsenal', color: '#00E5FF' },
  ],
  en: [
    { emoji: '🌱', title: 'If you\'ve never used AI', desc: 'Start with Avatars. Choose a character and chat with them.', href: '/personajes', btn: 'Go to Avatars', color: '#FFB300' },
    { emoji: '✨', title: 'If you want to create now', desc: 'Go straight to IMAGELIN. Describe your image and AI generates it instantly.', href: '/prompt-studio', btn: 'Go to IMAGELIN', color: '#9C27B0' },
    { emoji: '🎮', title: 'If you like challenges', desc: 'Enter PLAY!. Levels, missions and competitions.', href: '/jugar', btn: 'Go to Play', color: '#00E5FF' },
    { emoji: '💼', title: 'If you want real tools', desc: 'AI Arsenal has 62+ real tools with step-by-step guides.', href: '/arsenal-ia', btn: 'Go to Arsenal', color: '#00E5FF' },
  ],
  zh: [
    { emoji: '🌱', title: '从未用过AI', desc: '从角色开始。选一个角色和它聊天。', href: '/personajes', btn: '去角色', color: '#FFB300' },
    { emoji: '✨', title: '想立刻创造', desc: '直接去IMAGELIN。描述图像，AI立即生成。', href: '/prompt-studio', btn: '去IMAGELIN', color: '#9C27B0' },
    { emoji: '🎮', title: '喜欢挑战', desc: '进入立即游玩。关卡、任务和竞赛。', href: '/jugar', btn: '去游玩', color: '#00E5FF' },
    { emoji: '💼', title: '想学真实工具', desc: 'AI武器库有62+个真实工具和分步指南。', href: '/arsenal-ia', btn: '去武器库', color: '#00E5FF' },
  ],
};

/* ─── FAQ data ─── */
const FAQ = {
  es: [
    { q: '¿Es gratis?', a: 'Sí. El registro es gratis y tienes acceso a todas las herramientas. Algunas funciones avanzadas requieren LinceCoins que ganas jugando.' },
    { q: '¿Necesito saber de tecnología?', a: 'No. LINCE está diseñado para todas las edades y niveles. Desde niños de 6 años hasta abuelos de 80.' },
    { q: '¿Es seguro para niños?', a: 'Sí. Hay controles parentales, filtros de contenido y moderación activa. Los menores de 13 años necesitan permiso de un adulto.' },
    { q: '¿Qué son los LinceCoins?', a: 'Son la moneda del juego. Los ganas completando actividades y los usas para desbloquear avatares, fondos y objetos especiales en el Mercado.' },
    { q: '¿Puedo jugar con mi familia?', a: 'Sí. Cada miembro de la familia puede crear su cuenta y hay misiones familiares que dan el doble de recompensas.' },
  ],
  en: [
    { q: 'Is it free?', a: 'Yes. Registration is free and you have access to all tools. Some advanced features require LinceCoins earned by playing.' },
    { q: 'Do I need tech knowledge?', a: 'No. LINCE is designed for all ages and levels.' },
    { q: 'Is it safe for kids?', a: 'Yes. Parental controls, content filters and active moderation. Under 13 need adult permission.' },
    { q: 'What are LinceCoins?', a: 'Game currency earned by completing activities. Use them to unlock avatars, backgrounds and special items.' },
    { q: 'Can I play with family?', a: 'Yes. Each member creates their account. Family missions give double rewards.' },
  ],
  zh: [
    { q: '免费吗？', a: '是的。注册免费，可使用所有工具。一些高级功能需要游戏赚取的LinceCoins。' },
    { q: '需要技术知识吗？', a: '不需要。LINCE为所有年龄和水平设计。' },
    { q: '对孩子安全吗？', a: '是的。有家长控制、内容过滤和主动审核。' },
    { q: '什么是LinceCoins？', a: '游戏货币。完成活动赚取，用于解锁角色和特殊物品。' },
    { q: '可以和家人一起玩吗？', a: '可以。每人创建账户，家庭任务双倍奖励。' },
  ],
};


/* ═══════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════════ */
export default function ComoJugar() {
  const { lang } = useGameLang();
  const { getAvatarName } = usePRDLanguage();
  const t = T[lang as keyof typeof T] || T.es;
  const tools = TOOLS[lang as keyof typeof TOOLS] || TOOLS.es;
  const recos = RECO_PROFILES[lang as keyof typeof RECO_PROFILES] || RECO_PROFILES.es;
  const faqs = FAQ[lang as keyof typeof FAQ] || FAQ.es;

  const [expandedTool, setExpandedTool] = useState<number | null>(null);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white font-['Inter',sans-serif] pt-14">
      <GlobalNavBar />

      {/* ═══ HERO ═══ */}
      <section className="pt-16 sm:pt-20 pb-12 px-4 relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={ACADEMIA_HERO_BG} alt="" className="w-full h-full object-cover opacity-15" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A]/80 via-[#0A0A0A]/60 to-[#0A0A0A]" />
        </div>
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <FadeIn>
            <h1 className="font-['Space_Grotesk'] text-5xl sm:text-7xl font-black mb-4 leading-tight">
              <span className="text-white">{t.heroTitle} </span>
              <span className="text-[#00E5FF]">{t.heroAccent}</span>
            </h1>
          </FadeIn>
          <FadeIn delay={100}>
            <p className="text-[#FFD700] text-lg sm:text-xl font-semibold mb-4">{t.heroSub}</p>
          </FadeIn>
          <FadeIn delay={200}>
            <p className="text-[#B0B0B0] text-base max-w-2xl mx-auto leading-relaxed mb-10">{t.heroDesc}</p>
          </FadeIn>

          {/* 3 steps */}
          <FadeIn delay={300}>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
              {[
                { num: '1', icon: '📝', title: t.step1, desc: t.step1desc, color: '#00E5FF' },
                { num: '2', icon: '🎯', title: t.step2, desc: t.step2desc, color: '#FFD700' },
                { num: '3', icon: '🚀', title: t.step3, desc: t.step3desc, color: '#10B981' },
              ].map((s, i) => (
                <div key={i} className="bg-[#111]/80 border border-[#1A1A2E] rounded-xl p-5 text-left">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-black" style={{ backgroundColor: s.color + '20', color: s.color }}>{s.num}</span>
                    <span className="text-xl">{s.icon}</span>
                  </div>
                  <h3 className="font-['Space_Grotesk'] font-bold text-sm mb-1" style={{ color: s.color }}>{s.title}</h3>
                  <p className="text-[#888] text-xs leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══ TOOLS — The 6 tools explained ═══ */}
      <section className="py-12 sm:py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <FadeIn>
            <div className="text-center mb-10">
              <h2 className="font-['Space_Grotesk'] text-3xl sm:text-4xl font-black text-white mb-3">{t.toolsTitle}</h2>
              <p className="text-[#B0B0B0] text-lg">{t.toolsSub}</p>
            </div>
          </FadeIn>

          <div className="space-y-4">
            {tools.map((tool, i) => (
              <FadeIn key={i} delay={i * 60}>
                <div
                  className={`bg-gradient-to-r ${tool.gradient} border ${tool.border} rounded-2xl overflow-hidden transition-all duration-300 ${expandedTool === i ? 'ring-1' : ''}`}
                  style={expandedTool === i ? { outlineColor: tool.color, outlineWidth: '1px', outlineStyle: 'solid' } : {}}
                >
                  {/* Header — always visible */}
                  <button
                    onClick={() => setExpandedTool(expandedTool === i ? null : i)}
                    className="w-full flex items-center gap-4 p-5 sm:p-6 text-left"
                  >
                    <span className="text-3xl sm:text-4xl flex-shrink-0">{tool.icon}</span>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-['Space_Grotesk'] font-black text-lg sm:text-xl" style={{ color: tool.color }}>{tool.name}</h3>
                      <p className="text-[#888] text-sm mt-0.5 truncate">{tool.whatDesc}</p>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <div className="w-10 h-10 rounded-full overflow-hidden bg-[#1A1A2E] hidden sm:block">
                        <img src={AVATAR_FRONTAL[tool.avatar]} alt="" className="w-full h-full object-contain" />
                      </div>
                      <svg className={`w-5 h-5 text-[#555] transition-transform ${expandedTool === i ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </button>

                  {/* Expanded content */}
                  {expandedTool === i && (
                    <div className="px-5 sm:px-6 pb-6 pt-0">
                      <div className="border-t border-white/5 pt-5">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
                          <div>
                            <h4 className="font-bold text-white text-sm mb-1">{tool.what}</h4>
                            <p className="text-[#B0B0B0] text-sm leading-relaxed">{tool.whatDesc}</p>
                          </div>
                          <div>
                            <h4 className="font-bold text-white text-sm mb-1">{tool.how}</h4>
                            <p className="text-[#B0B0B0] text-sm leading-relaxed">{tool.howDesc}</p>
                          </div>
                          <div>
                            <h4 className="font-bold text-white text-sm mb-1">{tool.earn}</h4>
                            <p className="text-[#B0B0B0] text-sm leading-relaxed">{tool.earnDesc}</p>
                          </div>
                        </div>
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
                          <div className="flex items-center gap-2 bg-[#0A0A0A]/60 rounded-lg px-3 py-2 border border-white/5">
                            <div className="w-8 h-8 rounded-full overflow-hidden bg-[#1A1A2E] flex-shrink-0">
                              <img src={AVATAR_FRONTAL[tool.avatar]} alt="" className="w-full h-full object-contain" />
                            </div>
                            <p className="text-xs text-[#888] italic">"{tool.tip}"</p>
                          </div>
                          <Link href={tool.href} className="px-5 py-2.5 rounded-xl font-bold text-sm text-black transition-all hover:brightness-110 flex-shrink-0" style={{ backgroundColor: tool.color }}>
                            {tl(lang, { es: 'Ir ahora', en: 'Go now', zh: '立即前往', 'pt-BR': 'Ir ahora', 'pt-PT': 'Ir ahora' })} →
                          </Link>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ RECOMMENDATIONS ═══ */}
      <section className="py-12 sm:py-16 px-4 bg-gradient-to-b from-transparent via-[#00E5FF]/3 to-transparent">
        <div className="max-w-4xl mx-auto">
          <FadeIn>
            <div className="text-center mb-10">
              <h2 className="font-['Space_Grotesk'] text-3xl sm:text-4xl font-black text-white mb-3">{t.recoTitle}</h2>
              <p className="text-[#B0B0B0] text-lg">{t.recoSub}</p>
            </div>
          </FadeIn>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {recos.map((r, i) => (
              <FadeIn key={i} delay={i * 80}>
                <div className="bg-[#111]/80 border border-[#1A1A2E] rounded-2xl p-6 hover:border-white/10 transition-all h-full flex flex-col">
                  <span className="text-3xl mb-3">{r.emoji}</span>
                  <h3 className="font-['Space_Grotesk'] font-bold text-lg mb-2" style={{ color: r.color }}>{r.title}</h3>
                  <p className="text-[#B0B0B0] text-sm leading-relaxed flex-1 mb-4">{r.desc}</p>
                  <Link href={r.href} className="inline-flex items-center gap-1 text-sm font-bold transition-colors hover:underline" style={{ color: r.color }}>
                    {r.btn} →
                  </Link>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ WHAT IS A PROMPT? ═══ */}
      <section className="py-12 sm:py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <FadeIn>
            <div className="bg-gradient-to-br from-[#00E5FF]/5 to-[#FFD700]/5 border border-[#00E5FF]/20 rounded-2xl p-6 sm:p-8">
              <h2 className="font-['Space_Grotesk'] text-2xl sm:text-3xl font-black text-[#00E5FF] mb-4">{t.promptTitle}</h2>
              <p className="text-[#B0B0B0] leading-relaxed mb-6">{t.promptDesc}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-4">
                  <p className="text-red-400 text-sm font-medium">{t.promptBad}</p>
                </div>
                <div className="bg-green-500/5 border border-green-500/20 rounded-xl p-4">
                  <p className="text-green-400 text-sm font-medium">{t.promptGood}</p>
                </div>
              </div>
              <div className="bg-[#0A0A0A] rounded-xl p-4 border border-[#00E5FF]/10">
                <p className="text-[#FFD700] text-sm font-medium">{t.promptTip}</p>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══ FAQ ═══ */}
      <section className="py-12 sm:py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <FadeIn>
            <div className="text-center mb-10">
              <h2 className="font-['Space_Grotesk'] text-3xl sm:text-4xl font-black text-white mb-3">{t.faqTitle}</h2>
            </div>
          </FadeIn>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <FadeIn key={i} delay={i * 50}>
                <div className="bg-[#111]/80 border border-[#1A1A2E] rounded-xl overflow-hidden">
                  <button
                    onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                    className="w-full flex items-center justify-between p-5 text-left"
                  >
                    <h3 className="font-['Space_Grotesk'] font-bold text-base text-white">{faq.q}</h3>
                    <svg className={`w-5 h-5 text-[#555] transition-transform flex-shrink-0 ml-3 ${expandedFaq === i ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {expandedFaq === i && (
                    <div className="px-5 pb-5 pt-0">
                      <p className="text-[#B0B0B0] text-sm leading-relaxed">{faq.a}</p>
                    </div>
                  )}
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section className="py-16 px-4 bg-gradient-to-t from-[#00E5FF]/5 to-transparent">
        <FadeIn>
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="font-['Space_Grotesk'] text-3xl sm:text-4xl font-black text-white mb-4">{t.ctaTitle}</h2>
            <p className="text-[#B0B0B0] mb-8">{t.ctaDesc}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/registro" className="bg-[#00E5FF] text-black px-8 py-3 rounded-xl font-bold text-lg hover:bg-[#00E5FF]/80 transition-colors text-center">
                {t.ctaBtn}
              </Link>
              <Link href="/" className="bg-[#1A1A2E] text-white px-8 py-3 rounded-xl font-bold text-lg hover:bg-[#1A1A2E]/80 transition-colors border border-[#333] text-center">
                {t.ctaExplore}
              </Link>
            </div>
          </div>
        </FadeIn>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer className="border-t border-[#1A1A2E] py-6 px-4 text-center">
        <p className="text-[#555] text-xs">© 2026 ACNB IA SL. {lang === 'es' ? 'Todos los derechos reservados.' : lang === 'zh' ? '保留所有权利。' : 'All rights reserved.'}</p>
      </footer>
    </div>
  );
}

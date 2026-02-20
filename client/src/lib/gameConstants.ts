// ─── APP VERSION ─────────────────────────────────────────────────────
export const APP_VERSION = "1.4.0";
export const APP_BUILD_DATE = "2026-02-13";

// ─── CHANGELOG ──────────────────────────────────────────────────────
export interface ChangelogEntry {
  version: string;
  date: string;
  title: Record<string, string>;
  changes: Record<string, string[]>;
}

export const CHANGELOG: ChangelogEntry[] = [
  {
    version: "1.4.0",
    date: "2026-02-13",
    title: { es: "Lecciones teóricas y feedback mejorado", en: "Theory lessons and improved feedback", zh: "理论课程和改进反馈" },
    changes: {
      es: [
        "Mini-lecciones teóricas antes de cada misión",
        "Indicador de dificultad en cada nivel (Fácil/Medio/Difícil)",
        "Feedback correctivo: ahora muestra la solución óptima del prompt",
        "Versión visible en el footer de la app",
        "Notificación de actualizaciones al iniciar sesión",
      ],
      en: [
        "Mini theory lessons before each mission",
        "Difficulty indicator on each level (Easy/Medium/Hard)",
        "Corrective feedback: now shows optimal prompt solution",
        "App version visible in footer",
        "Update notification on login",
      ],
      zh: [
        "每个任务前的迷你理论课程",
        "每个关卡的难度指示器（简单/中等/困难）",
        "纠正反馈：现在显示最佳提示词解决方案",
        "应用版本在页脚可见",
        "登录时更新通知",
      ],
    },
  },
  {
    version: "1.3.0",
    date: "2026-02-12",
    title: { es: "Generador LINCELIN y mejoras UX", en: "LINCELIN Generator and UX improvements", zh: "LINCELIN生成器和UX改进" },
    changes: {
      es: [
        "Generador de avatares LINCELIN con IA",
        "Colores LINCE (cyan/gold) en registro y login",
        "WelcomeModal mejorado",
        "Búsqueda global con Cmd+K",
      ],
      en: [
        "LINCELIN avatar generator with AI",
        "LINCE colors (cyan/gold) in registration and login",
        "Improved WelcomeModal",
        "Global search with Cmd+K",
      ],
      zh: [
        "使用AI的LINCELIN头像生成器",
        "注册和登录中的LINCE颜色（青色/金色）",
        "改进的欢迎弹窗",
        "使用Cmd+K的全局搜索",
      ],
    },
  },
  {
    version: "1.2.0",
    date: "2026-02-10",
    title: { es: "Sistema de recompensas y PWA", en: "Rewards system and PWA", zh: "奖励系统和PWA" },
    changes: {
      es: [
        "Recompensas diarias con racha de 7 días",
        "App instalable (PWA) con soporte offline",
        "Sincronización de progreso con servidor",
      ],
      en: [
        "Daily rewards with 7-day streak",
        "Installable app (PWA) with offline support",
        "Progress sync with server",
      ],
      zh: [
        "每日奖励与7天连续签到",
        "可安装应用（PWA）支持离线",
        "与服务器同步进度",
      ],
    },
  },
];

// ─── DIFFICULTY LEVELS ──────────────────────────────────────────────
export type Difficulty = "easy" | "medium" | "hard";

export const DIFFICULTY_CONFIG: Record<Difficulty, {
  label: Record<string, string>;
  color: string;
  icon: string;
  bgClass: string;
}> = {
  easy: {
    label: { es: "Fácil", en: "Easy", zh: "简单" },
    color: "oklch(0.75 0.18 145)", // green
    icon: "🟢",
    bgClass: "bg-green-500/15 border-green-500/40 text-green-400",
  },
  medium: {
    label: { es: "Medio", en: "Medium", zh: "中等" },
    color: "oklch(0.80 0.16 85)", // yellow/gold
    icon: "🟡",
    bgClass: "bg-yellow-500/15 border-yellow-500/40 text-yellow-400",
  },
  hard: {
    label: { es: "Difícil", en: "Hard", zh: "困难" },
    color: "oklch(0.65 0.22 25)", // red
    icon: "🔴",
    bgClass: "bg-red-500/15 border-red-500/40 text-red-400",
  },
};

export const LEVEL_DIFFICULTY: Record<number, Difficulty> = {
  1: "easy",
  2: "medium",
  3: "hard",
};

// ─── THEORY LESSONS (mini-lecciones teóricas antes de cada misión) ──
// Cada lección es muy corta (2-3 frases) para gente que NO sabe NADA de IA
export interface TheoryLesson {
  title: Record<string, string>;
  content: Record<string, string>;
  tip: Record<string, string>;
  icon: string;
}

// Level 1 theory lessons — "Tu Primer Prompt"
export const LEVEL1_THEORY: TheoryLesson[] = [
  {
    title: {
      es: "¿Qué es un Prompt?",
      en: "What is a Prompt?",
      zh: "什么是提示词？",
    },
    content: {
      es: "Un prompt es simplemente una instrucción que le das a la inteligencia artificial. Es como hablar con un asistente muy inteligente: tú le dices qué quieres y él lo hace. Cuanto más claro seas, mejor resultado obtendrás.",
      en: "A prompt is simply an instruction you give to artificial intelligence. It's like talking to a very smart assistant: you tell it what you want and it does it. The clearer you are, the better the result.",
      zh: "提示词就是你给人工智能的指令。就像和一个非常聪明的助手说话：你告诉它你想要什么，它就会去做。你说得越清楚，结果就越好。",
    },
    tip: {
      es: "Piensa en el prompt como una receta de cocina: cuantos más ingredientes (detalles) pongas, mejor será el plato (resultado).",
      en: "Think of a prompt like a cooking recipe: the more ingredients (details) you add, the better the dish (result).",
      zh: "把提示词想象成烹饪食谱：你添加的配料（细节）越多，菜肴（结果）就越好。",
    },
    icon: "💡",
  },
  {
    title: {
      es: "El Secreto: Sé Específico",
      en: "The Secret: Be Specific",
      zh: "秘诀：要具体",
    },
    content: {
      es: "La IA no puede leer tu mente. Si dices \"hazme un dibujo\", el resultado será genérico. Pero si dices \"hazme un dibujo de un gato azul volando sobre una ciudad de noche con luces neón\", el resultado será increíble. Los detalles son tu superpoder.",
      en: "AI can't read your mind. If you say \"make me a drawing\", the result will be generic. But if you say \"make me a drawing of a blue cat flying over a city at night with neon lights\", the result will be amazing. Details are your superpower.",
      zh: "AI无法读取你的想法。如果你说\"给我画一幅画\"，结果会很普通。但如果你说\"给我画一只蓝色的猫在夜晚飞过有霓虹灯的城市\"，结果会很惊人。细节是你的超能力。",
    },
    tip: {
      es: "Incluye: colores, tamaños, estilos, emociones, comparaciones (\"como si fuera...\"). ¡Cada detalle suma puntos!",
      en: "Include: colors, sizes, styles, emotions, comparisons (\"as if it were...\"). Every detail adds points!",
      zh: "包括：颜色、大小、风格、情感、比较（\"就好像...\"）。每个细节都能加分！",
    },
    icon: "🎯",
  },
  {
    title: {
      es: "Tu Creatividad Vale Puntos",
      en: "Your Creativity Earns Points",
      zh: "你的创造力能得分",
    },
    content: {
      es: "En LINCE, tu prompt se evalúa por: longitud (escribe al menos 15 palabras), palabras clave (usa palabras relacionadas con la misión), creatividad (usa comparaciones, preguntas, exclamaciones) y detalles específicos (colores, números, adjetivos).",
      en: "In LINCE, your prompt is evaluated by: length (write at least 15 words), keywords (use words related to the mission), creativity (use comparisons, questions, exclamations) and specific details (colors, numbers, adjectives).",
      zh: "在LINCE中，你的提示词按以下标准评估：长度（至少写15个词）、关键词（使用与任务相关的词）、创造力（使用比较、问题、感叹号）和具体细节（颜色、数字、形容词）。",
    },
    tip: {
      es: "Para máxima puntuación: escribe +25 palabras, incluye colores y adjetivos, usa comas para separar ideas, y añade comparaciones creativas.",
      en: "For maximum score: write 25+ words, include colors and adjectives, use commas to separate ideas, and add creative comparisons.",
      zh: "获得最高分：写25个以上的词，包含颜色和形容词，用逗号分隔想法，添加创意比较。",
    },
    icon: "⭐",
  },
];

// Level 2 theory lessons — "Tu Primera Habitación"
export const LEVEL2_THEORY: TheoryLesson[] = [
  {
    title: {
      es: "IA y Diseño: Crea con Palabras",
      en: "AI and Design: Create with Words",
      zh: "AI与设计：用文字创造",
    },
    content: {
      es: "La inteligencia artificial puede crear imágenes, diseños y mundos enteros solo con tus palabras. Herramientas como DALL-E, Midjourney o Stable Diffusion convierten tus descripciones en imágenes reales. Aquí practicarás esa habilidad.",
      en: "Artificial intelligence can create images, designs and entire worlds just with your words. Tools like DALL-E, Midjourney or Stable Diffusion turn your descriptions into real images. Here you'll practice that skill.",
      zh: "人工智能可以仅凭你的文字创造图像、设计和整个世界。DALL-E、Midjourney或Stable Diffusion等工具将你的描述转化为真实图像。在这里你将练习这项技能。",
    },
    tip: {
      es: "Describe el ambiente, la iluminación, los materiales y el estilo. Ejemplo: \"futurista con luces neón\" es mejor que solo \"bonito\".",
      en: "Describe the atmosphere, lighting, materials and style. Example: \"futuristic with neon lights\" is better than just \"pretty\".",
      zh: "描述氛围、灯光、材料和风格。例如：\"带有霓虹灯的未来风格\"比仅仅说\"漂亮\"要好。",
    },
    icon: "🎨",
  },
  {
    title: {
      es: "Muebles con Personalidad",
      en: "Furniture with Personality",
      zh: "有个性的家具",
    },
    content: {
      es: "Cuando le pides a la IA que cree un mueble, no digas solo \"una silla\". Dile qué la hace especial: ¿de qué material es? ¿tiene algún poder? ¿brilla? ¿flota? En el mundo de la IA, lo imposible es posible.",
      en: "When you ask AI to create furniture, don't just say \"a chair\". Tell it what makes it special: what material? Does it have powers? Does it glow? Float? In the AI world, the impossible is possible.",
      zh: "当你让AI创造家具时，不要只说\"一把椅子\"。告诉它是什么让它特别：什么材料？有什么能力？会发光吗？会漂浮吗？在AI的世界里，不可能变为可能。",
    },
    tip: {
      es: "Usa adjetivos únicos: \"holográfico\", \"flotante\", \"bioluminiscente\", \"que reacciona al tacto\". ¡Cuanto más loco, más puntos!",
      en: "Use unique adjectives: \"holographic\", \"floating\", \"bioluminescent\", \"touch-reactive\". The crazier, the more points!",
      zh: "使用独特的形容词：\"全息的\"、\"漂浮的\"、\"生物发光的\"、\"触摸反应的\"。越疯狂，分数越高！",
    },
    icon: "🛋️",
  },
  {
    title: {
      es: "El Toque Personal",
      en: "The Personal Touch",
      zh: "个人风格",
    },
    content: {
      es: "La decoración es lo que hace un espacio TUYO. En IA, los mejores prompts de decoración incluyen elementos emocionales: recuerdos, colores favoritos, objetos con significado. La IA responde mejor cuando le das contexto personal.",
      en: "Decoration is what makes a space YOURS. In AI, the best decoration prompts include emotional elements: memories, favorite colors, meaningful objects. AI responds better when you give it personal context.",
      zh: "装饰是让空间成为你自己的东西。在AI中，最好的装饰提示词包含情感元素：回忆、最喜欢的颜色、有意义的物品。当你给AI个人背景时，它的回应会更好。",
    },
    tip: {
      es: "Mezcla lo real con lo fantástico: \"una foto de mi familia que cobra vida por las noches\" o \"una planta que cambia de color según la música\".",
      en: "Mix real with fantastic: \"a photo of my family that comes alive at night\" or \"a plant that changes color with the music\".",
      zh: "将现实与幻想混合：\"一张晚上会活过来的家庭照片\"或\"一棵随音乐变色的植物\"。",
    },
    icon: "✨",
  },
];

// Level 3 theory lessons — "Tu Primer Raid"
export const LEVEL3_THEORY: TheoryLesson[] = [
  {
    title: {
      es: "IA Competitiva: Prompts de Batalla",
      en: "Competitive AI: Battle Prompts",
      zh: "竞争性AI：战斗提示词",
    },
    content: {
      es: "En el mundo real, las empresas compiten creando los mejores prompts para obtener mejores resultados de la IA. Aquí simularemos eso: tu prompt compite contra el de un rival. Quien escriba mejor, gana. Es como un duelo de creatividad.",
      en: "In the real world, companies compete by creating the best prompts to get better AI results. Here we'll simulate that: your prompt competes against a rival's. Whoever writes better, wins. It's like a creativity duel.",
      zh: "在现实世界中，公司通过创建最佳提示词来获得更好的AI结果。在这里我们将模拟这一点：你的提示词与对手的竞争。谁写得更好，谁就赢。这就像创意决斗。",
    },
    tip: {
      es: "En una batalla de prompts, gana el que es más ESPECÍFICO y DETALLADO. No basta con decir \"ataco\": describe CÓMO, CON QUÉ, y QUÉ EFECTO tiene.",
      en: "In a prompt battle, the most SPECIFIC and DETAILED wins. It's not enough to say \"I attack\": describe HOW, WITH WHAT, and WHAT EFFECT it has.",
      zh: "在提示词战斗中，最具体和详细的人获胜。仅仅说\"我攻击\"是不够的：描述如何攻击、用什么攻击、有什么效果。",
    },
    icon: "⚔️",
  },
  {
    title: {
      es: "Estrategia: Ataque y Defensa",
      en: "Strategy: Attack and Defense",
      zh: "策略：攻击与防御",
    },
    content: {
      es: "Los mejores prompts de combate tienen 3 partes: 1) QUÉ haces (\"creo un escudo\"), 2) CÓMO es (\"de energía cyan que electrocuta\"), 3) QUÉ EFECTO tiene (\"bloquea cualquier ataque físico y devuelve el daño\"). Esta estructura te dará máxima puntuación.",
      en: "The best combat prompts have 3 parts: 1) WHAT you do (\"I create a shield\"), 2) HOW it is (\"of cyan energy that electrocutes\"), 3) WHAT EFFECT it has (\"blocks any physical attack and returns damage\"). This structure gives maximum score.",
      zh: "最好的战斗提示词有3个部分：1）你做什么（\"我创建一个盾牌\"），2）它是怎样的（\"会电击的青色能量\"），3）有什么效果（\"阻挡任何物理攻击并反弹伤害\"）。这种结构能获得最高分。",
    },
    tip: {
      es: "Usa elementos: fuego, hielo, rayo, sombra. Describe materiales, tamaños y poderes especiales. ¡Sé el más creativo!",
      en: "Use elements: fire, ice, lightning, shadow. Describe materials, sizes and special powers. Be the most creative!",
      zh: "使用元素：火、冰、雷、暗影。描述材料、大小和特殊能力。做最有创意的人！",
    },
    icon: "🛡️",
  },
  {
    title: {
      es: "Trampas Creativas: Piensa Diferente",
      en: "Creative Traps: Think Different",
      zh: "创意陷阱：换个思路",
    },
    content: {
      es: "Las trampas más efectivas son las que SORPRENDEN. La IA valora la originalidad. En vez de \"pongo una trampa\", piensa en algo que nadie esperaría: trampas invisibles, que cambian de forma, que usan la psicología del rival contra él mismo.",
      en: "The most effective traps are those that SURPRISE. AI values originality. Instead of \"I set a trap\", think of something nobody would expect: invisible traps, shape-shifting ones, traps that use the rival's psychology against them.",
      zh: "最有效的陷阱是那些令人惊讶的。AI重视原创性。不要说\"我设置一个陷阱\"，想想没人会预料到的东西：隐形陷阱、变形陷阱、利用对手心理的陷阱。",
    },
    tip: {
      es: "Palabras clave que suman puntos: \"secreto\", \"oculto\", \"sorpresa\", \"inesperado\", \"creativo\", \"ingenioso\". ¡Úsalas!",
      en: "Keywords that add points: \"secret\", \"hidden\", \"surprise\", \"unexpected\", \"creative\", \"ingenious\". Use them!",
      zh: "能加分的关键词：\"秘密\"、\"隐藏\"、\"惊喜\"、\"意想不到\"、\"创意\"、\"巧妙\"。使用它们！",
    },
    icon: "🪤",
  },
];

// ─── OPTIMAL PROMPTS (soluciones correctas para cada misión) ────────
// Estos son los prompts que darían la máxima puntuación posible
export interface OptimalPrompt {
  text: Record<string, string>;
  maxScore: number;
  explanation: Record<string, string>;
}

export const OPTIMAL_PROMPTS: Record<number, Record<number, OptimalPrompt>> = {
  1: {
    1: {
      text: {
        es: "Salúdame como si fueras un pirata espacial que acaba de descubrir un planeta nuevo lleno de cristales brillantes de color cyan, con una voz grave y emocionada, en español, incluyendo 3 datos curiosos sobre el universo",
        en: "Greet me as if you were a space pirate who just discovered a new planet full of bright cyan crystals, with a deep and excited voice, in English, including 3 fun facts about the universe",
        zh: "像一个刚发现充满明亮青色水晶的新星球的太空海盗一样向我问好，用低沉而兴奋的声音，用中文，包括3个关于宇宙的有趣事实",
      },
      maxScore: 95,
      explanation: {
        es: "Este prompt tiene +25 palabras, incluye palabras clave (saluda, nombre, bienvenido), usa comparaciones (\"como si fueras\"), tiene colores (cyan), adjetivos (brillantes, grave, emocionada), números (3) y es muy creativo.",
        en: "This prompt has 25+ words, includes keywords (greet, name, welcome), uses comparisons (\"as if you were\"), has colors (cyan), adjectives (bright, deep, excited), numbers (3) and is very creative.",
        zh: "这个提示词有25个以上的词，包含关键词（问好、名字、欢迎），使用比较（\"就像\"），有颜色（青色），形容词（明亮、低沉、兴奋），数字（3），而且非常有创意。",
      },
    },
    2: {
      text: {
        es: "Inventa un nombre original para mi mascota robot que es un gato de metal azul brillante con ojos dorados que puede volar, lanza rayos cyan por los ojos, tiene 3 colas mecánicas y ronronea como un motor de nave espacial",
        en: "Invent an original name for my robot pet that is a bright blue metal cat with golden eyes that can fly, shoots cyan lasers from its eyes, has 3 mechanical tails and purrs like a spaceship engine",
        zh: "为我的机器人宠物起一个原创名字，它是一只明亮的蓝色金属猫，有金色的眼睛，会飞，眼睛能发射青色激光，有3条机械尾巴，像太空船引擎一样发出呼噜声",
      },
      maxScore: 95,
      explanation: {
        es: "Incluye: mascota, robot, nombre, inventa, crea, original + colores (azul, dorado, cyan) + adjetivos (brillante, mecánicas) + números (3) + comparación (\"como un motor\") + muchos detalles específicos.",
        en: "Includes: pet, robot, name, invent, create, original + colors (blue, golden, cyan) + adjectives (bright, mechanical) + numbers (3) + comparison (\"like an engine\") + many specific details.",
        zh: "包含：宠物、机器人、名字、发明、创造、原创 + 颜色（蓝色、金色、青色）+ 形容词（明亮、机械）+ 数字（3）+ 比较（\"像引擎\"）+ 许多具体细节。",
      },
    },
    3: {
      text: {
        es: "Diseña una habitación futurista con paredes de cristal negro que cambian de color según tu estado de ánimo, una cama flotante con luces neón cyan en los bordes, un techo transparente que muestra las estrellas en tiempo real, 5 plantas bioluminiscentes verdes y una alfombra suave como una nube",
        en: "Design a futuristic room with black crystal walls that change color based on your mood, a floating bed with cyan neon edge lights, a transparent ceiling showing stars in real time, 5 green bioluminescent plants and a carpet soft as a cloud",
        zh: "设计一个未来风格的房间，有根据心情变色的黑色水晶墙，边缘有青色霓虹灯的悬浮床，实时显示星空的透明天花板，5棵绿色生物发光植物和像云一样柔软的地毯",
      },
      maxScore: 98,
      explanation: {
        es: "Prompt perfecto: +30 palabras, palabras clave (habitación, diseña, colores, cama, luz, describe, detalle, estilo, paredes, techo), colores (negro, cyan, verdes), adjetivos (futurista, flotante, bioluminiscentes, suave, transparente), número (5), comparación (\"como una nube\").",
        en: "Perfect prompt: 30+ words, keywords (room, design, colors, bed, light, describe, detail, style, walls, ceiling), colors (black, cyan, green), adjectives (futuristic, floating, bioluminescent, soft, transparent), number (5), comparison (\"as a cloud\").",
        zh: "完美提示词：30个以上的词，关键词（房间、设计、颜色、床、灯光、描述、细节、风格、墙壁、天花板），颜色（黑色、青色、绿色），形容词（未来的、漂浮的、生物发光的、柔软的、透明的），数字（5），比较（\"像云一样\"）。",
      },
    },
  },
  2: {
    1: {
      text: {
        es: "Quiero una habitación futurista con paredes oscuras de obsidiana pulida, luces cyan en los bordes del techo y el suelo, un estilo minimalista japonés con toques de neón, ventanas panorámicas que muestran un paisaje de ciudad cyberpunk de noche, y una iluminación suave que cambia según la hora del día",
        en: "I want a futuristic room with dark polished obsidian walls, cyan lights on ceiling and floor edges, a Japanese minimalist style with neon touches, panoramic windows showing a cyberpunk city landscape at night, and soft lighting that changes with the time of day",
        zh: "我想要一个未来风格的房间，有抛光黑曜石的深色墙壁，天花板和地板边缘有青色灯光，日式极简风格带有霓虹点缀，全景窗户展示夜晚的赛博朋克城市景观，以及随时间变化的柔和照明",
      },
      maxScore: 96,
      explanation: {
        es: "Incluye estilo (futurista, minimalista, japonés, cyberpunk), materiales (obsidiana), colores (oscuras, cyan), detalles de iluminación, y elementos arquitectónicos específicos.",
        en: "Includes style (futuristic, minimalist, Japanese, cyberpunk), materials (obsidian), colors (dark, cyan), lighting details, and specific architectural elements.",
        zh: "包含风格（未来、极简、日式、赛博朋克），材料（黑曜石），颜色（深色、青色），照明细节和具体建筑元素。",
      },
    },
    2: {
      text: {
        es: "Un escritorio holográfico flotante de cristal azul que proyecta 3 pantallas de luz cyan, con cajones que se abren con comandos de voz, una silla ergonómica que se adapta a tu cuerpo como un guante, y una lámpara inteligente dorada que cambia de intensidad según lo que estés haciendo",
        en: "A floating holographic blue crystal desk that projects 3 cyan light screens, with drawers that open with voice commands, an ergonomic chair that adapts to your body like a glove, and a golden smart lamp that changes intensity based on what you're doing",
        zh: "一张漂浮的蓝色水晶全息桌面，投射3个青色光屏，抽屉通过语音命令打开，一把像手套一样适应你身体的人体工学椅，以及一盏根据你在做什么而改变亮度的金色智能灯",
      },
      maxScore: 96,
      explanation: {
        es: "Muebles con personalidad: holográfico, flotante, inteligente. Incluye materiales (cristal), colores (azul, cyan, dorada), números (3), comparación (\"como un guante\"), y funcionalidades únicas.",
        en: "Furniture with personality: holographic, floating, smart. Includes materials (crystal), colors (blue, cyan, golden), numbers (3), comparison (\"like a glove\"), and unique functionalities.",
        zh: "有个性的家具：全息、漂浮、智能。包含材料（水晶），颜色（蓝色、青色、金色），数字（3），比较（\"像手套\"），和独特功能。",
      },
    },
    3: {
      text: {
        es: "Cuelga un cuadro holográfico grande que cambia de imagen según tu estado de ánimo, una planta bioluminiscente verde que brilla suavemente de noche y reacciona a la música, una alfombra inteligente roja que masajea tus pies, y 5 fotos flotantes de recuerdos favoritos que giran lentamente en el aire",
        en: "Hang a large holographic painting that changes image based on your mood, a green bioluminescent plant that glows softly at night and reacts to music, a smart red carpet that massages your feet, and 5 floating photos of favorite memories slowly spinning in the air",
        zh: "挂一幅根据心情变化图像的大型全息画作，一棵夜晚柔和发光并对音乐做出反应的绿色生物发光植物，一块按摩你脚的智能红色地毯，以及5张在空中缓慢旋转的最爱回忆的漂浮照片",
      },
      maxScore: 96,
      explanation: {
        es: "Decoración personal y emocional: recuerdos, estado de ánimo, reacciona a la música. Colores (verde, roja), adjetivos (holográfico, bioluminiscente, inteligente, flotantes), número (5), y elementos sensoriales.",
        en: "Personal and emotional decoration: memories, mood, reacts to music. Colors (green, red), adjectives (holographic, bioluminescent, smart, floating), number (5), and sensory elements.",
        zh: "个人和情感装饰：回忆、心情、对音乐的反应。颜色（绿色、红色），形容词（全息、生物发光、智能、漂浮），数字（5），和感官元素。",
      },
    },
  },
  3: {
    1: {
      text: {
        es: "Creo un escudo de energía cyan de 5 metros de alto que electrocuta a cualquiera que lo toque, reforzado con 3 capas de hielo mágico irrompible, con sensores que detectan movimiento y activan una alarma de rayo dorado que ciega al atacante durante 10 segundos",
        en: "I create a 5-meter tall cyan energy shield that electrocutes anyone who touches it, reinforced with 3 layers of unbreakable magic ice, with sensors that detect movement and activate a golden lightning alarm that blinds the attacker for 10 seconds",
        zh: "我创建一个5米高的青色能量盾牌，触碰者会被电击，用3层不可破坏的魔法冰加固，带有检测运动的传感器，激活金色闪电警报，使攻击者失明10秒",
      },
      maxScore: 97,
      explanation: {
        es: "Defensa perfecta: barrera + proteger + escudo + bloquear. Números (5, 3, 10), colores (cyan, dorado), materiales (energía, hielo), adjetivos (irrompible, mágico), y múltiples capas de defensa.",
        en: "Perfect defense: barrier + protect + shield + block. Numbers (5, 3, 10), colors (cyan, golden), materials (energy, ice), adjectives (unbreakable, magic), and multiple defense layers.",
        zh: "完美防御：屏障+保护+盾牌+阻挡。数字（5、3、10），颜色（青色、金色），材料（能量、冰），形容词（不可破坏、魔法），和多层防御。",
      },
    },
    2: {
      text: {
        es: "Invoco una tormenta de 100 rayos dorados que caen en espiral sobre la base enemiga, derritiendo sus defensas de hielo, seguida de una onda de fuego azul que se expande como un tsunami de 3 metros, y finalmente una lluvia de sombras que oscurece toda la zona durante 30 segundos",
        en: "I summon a storm of 100 golden lightning bolts that spiral down onto the enemy base, melting their ice defenses, followed by a blue fire wave that expands like a 3-meter tsunami, and finally a rain of shadows that darkens the entire zone for 30 seconds",
        zh: "我召唤100道金色闪电螺旋降落在敌人基地上，融化他们的冰防御，接着是像3米海啸一样扩展的蓝色火焰波，最后是使整个区域黑暗30秒的暗影之雨",
      },
      maxScore: 98,
      explanation: {
        es: "Ataque épico: fuego + rayo + sombra combinados. Números (100, 3, 30), colores (dorados, azul), comparación (\"como un tsunami\"), y secuencia de 3 ataques encadenados.",
        en: "Epic attack: fire + lightning + shadow combined. Numbers (100, 3, 30), colors (golden, blue), comparison (\"like a tsunami\"), and sequence of 3 chained attacks.",
        zh: "史诗攻击：火+雷+暗影组合。数字（100、3、30），颜色（金色、蓝色），比较（\"像海啸\"），和3个连锁攻击序列。",
      },
    },
    3: {
      text: {
        es: "Creo una trampa invisible que imita la voz del rival para atraerlo a una habitación falsa hecha de espejos, donde 7 copias holográficas de sí mismo lo confunden, mientras el suelo se convierte en arena movediza dorada que lo atrapa lentamente, y un campo de fuerza secreto sella la salida",
        en: "I create an invisible trap that mimics the rival's voice to lure them into a fake room made of mirrors, where 7 holographic copies of themselves confuse them, while the floor turns into golden quicksand that slowly traps them, and a secret force field seals the exit",
        zh: "我创建一个模仿对手声音的隐形陷阱，引诱他们进入一个由镜子组成的假房间，7个他们自己的全息副本让他们困惑，同时地板变成缓慢困住他们的金色流沙，一个秘密力场封住出口",
      },
      maxScore: 98,
      explanation: {
        es: "Trampa maestra: invisible + sorpresa + engaño + oculto + secreto + creativo + inesperado + ingenioso. Número (7), color (dorada), y una secuencia de trampas psicológicas encadenadas.",
        en: "Master trap: invisible + surprise + deception + hidden + secret + creative + unexpected + ingenious. Number (7), color (golden), and a sequence of chained psychological traps.",
        zh: "大师陷阱：隐形+惊喜+欺骗+隐藏+秘密+创意+意想不到+巧妙。数字（7），颜色（金色），和一系列连锁心理陷阱。",
      },
    },
  },
};

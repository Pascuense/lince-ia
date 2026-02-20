import { useState, useEffect, useMemo } from "react";
import { useGame } from "@/contexts/GameContext";
import { usePRDLanguage } from "@/contexts/PRDLanguageContext";
import { GlobalNavBar } from "@/components/GlobalNavBar";
import { BackButton } from "@/components/BackButton";
import RequireLogin from "@/components/RequireLogin";
import { toast } from "sonner";
import { Trophy, Clock, Send, Star, Crown, Medal, Flame, Sparkles, Users } from "lucide-react";

// ─── Daily Challenge Templates ───
interface ChallengeTemplate {
  id: string;
  title: Record<string, string>;
  description: Record<string, string>;
  category: string;
  difficulty: "easy" | "medium" | "hard";
  rewardCoins: number;
  rewardXP: number;
  timeLimit: number; // seconds
  evaluationCriteria: string[];
}

const CHALLENGE_POOL: ChallengeTemplate[] = [
  {
    id: "logo_prompt",
    title: { es: "Prompt para Logo", en: "Logo Prompt", zh: "Logo提示词" },
    description: { es: "Crea el mejor prompt para generar un logo de restaurante italiano moderno.", en: "Create the best prompt to generate a modern Italian restaurant logo.", zh: "创建最佳提示词来生成现代意大利餐厅标志。" },
    category: "imagen",
    difficulty: "easy",
    rewardCoins: 25,
    rewardXP: 50,
    timeLimit: 180,
    evaluationCriteria: ["especificidad", "estilo visual", "detalles técnicos"],
  },
  {
    id: "email_ventas",
    title: { es: "Email de Ventas", en: "Sales Email", zh: "销售邮件" },
    description: { es: "Escribe un prompt para que la IA genere un email de ventas persuasivo para un curso online de fotografía.", en: "Write a prompt for AI to generate a persuasive sales email for an online photography course.", zh: "编写一个提示词，让AI生成一封关于在线摄影课程的有说服力的销售邮件。" },
    category: "texto",
    difficulty: "medium",
    rewardCoins: 40,
    rewardXP: 75,
    timeLimit: 240,
    evaluationCriteria: ["persuasión", "estructura", "personalización"],
  },
  {
    id: "plan_marketing",
    title: { es: "Plan de Marketing", en: "Marketing Plan", zh: "营销计划" },
    description: { es: "Crea un prompt para generar un plan de marketing digital de 30 días para una tienda de ropa sostenible.", en: "Create a prompt to generate a 30-day digital marketing plan for a sustainable clothing store.", zh: "创建一个提示词，为可持续服装店生成30天数字营销计划。" },
    category: "estrategia",
    difficulty: "hard",
    rewardCoins: 60,
    rewardXP: 100,
    timeLimit: 300,
    evaluationCriteria: ["completitud", "creatividad", "viabilidad"],
  },
  {
    id: "chatbot_prompt",
    title: { es: "System Prompt para Chatbot", en: "Chatbot System Prompt", zh: "聊天机器人系统提示词" },
    description: { es: "Diseña un system prompt para un chatbot de atención al cliente de una aerolínea.", en: "Design a system prompt for an airline customer service chatbot.", zh: "为航空公司客户服务聊天机器人设计系统提示词。" },
    category: "técnico",
    difficulty: "hard",
    rewardCoins: 60,
    rewardXP: 100,
    timeLimit: 300,
    evaluationCriteria: ["claridad de rol", "manejo de edge cases", "tono profesional"],
  },
  {
    id: "historia_corta",
    title: { es: "Historia Corta con IA", en: "Short Story with AI", zh: "AI短篇故事" },
    description: { es: "Escribe un prompt para generar una historia corta de ciencia ficción ambientada en Zaragoza en 2050.", en: "Write a prompt to generate a short sci-fi story set in Zaragoza in 2050.", zh: "编写一个提示词，生成一个以2050年萨拉戈萨为背景的科幻短篇故事。" },
    category: "creativo",
    difficulty: "medium",
    rewardCoins: 40,
    rewardXP: 75,
    timeLimit: 240,
    evaluationCriteria: ["originalidad", "ambientación", "estructura narrativa"],
  },
  {
    id: "analisis_datos",
    title: { es: "Análisis de Datos", en: "Data Analysis", zh: "数据分析" },
    description: { es: "Crea un prompt para que la IA analice datos de ventas mensuales y genere insights accionables.", en: "Create a prompt for AI to analyze monthly sales data and generate actionable insights.", zh: "创建一个提示词，让AI分析月度销售数据并生成可操作的洞察。" },
    category: "datos",
    difficulty: "medium",
    rewardCoins: 40,
    rewardXP: 75,
    timeLimit: 240,
    evaluationCriteria: ["precisión", "formato de datos", "insights solicitados"],
  },
  {
    id: "cv_optimizado",
    title: { es: "CV Optimizado", en: "Optimized Resume", zh: "优化简历" },
    description: { es: "Diseña un prompt para que la IA optimice un CV para una posición de Product Manager en una startup tech.", en: "Design a prompt for AI to optimize a resume for a Product Manager position at a tech startup.", zh: "设计一个提示词，让AI为科技初创公司的产品经理职位优化简历。" },
    category: "profesional",
    difficulty: "easy",
    rewardCoins: 25,
    rewardXP: 50,
    timeLimit: 180,
    evaluationCriteria: ["relevancia", "keywords", "formato ATS"],
  },
  { id: "post_instagram", title: { es: "Post de Instagram", en: "Instagram Post", zh: "Instagram帖子" }, description: { es: "Crea un prompt para generar un caption viral de Instagram para una marca de cafe artesanal.", en: "Create a prompt to generate a viral Instagram caption for an artisan coffee brand.", zh: "创建提示词为手工咖啡品牌生成病毒式Instagram标题" }, category: "rrss", difficulty: "easy", rewardCoins: 25, rewardXP: 50, timeLimit: 120, evaluationCriteria: ["engagement", "hashtags", "call-to-action"] },
  { id: "guion_video", title: { es: "Guion de Video", en: "Video Script", zh: "视频脚本" }, description: { es: "Escribe un prompt para generar un guion de 60 segundos para un reel de TikTok sobre productividad.", en: "Write a prompt to generate a 60-second script for a TikTok reel about productivity.", zh: "编写提示词生成关于生产力的60秒TikTok脚本" }, category: "video", difficulty: "medium", rewardCoins: 40, rewardXP: 75, timeLimit: 240, evaluationCriteria: ["gancho", "estructura", "call-to-action"] },
  { id: "landing_page", title: { es: "Landing Page", en: "Landing Page", zh: "着陆页" }, description: { es: "Disena un prompt para generar el copy de una landing page de una app de meditacion.", en: "Design a prompt to generate landing page copy for a meditation app.", zh: "设计提示词为冥想应用生成着陆页文案" }, category: "texto", difficulty: "hard", rewardCoins: 60, rewardXP: 100, timeLimit: 300, evaluationCriteria: ["propuesta de valor", "CTA", "beneficios"] },
  { id: "receta_ia", title: { es: "Receta con IA", en: "AI Recipe", zh: "AI食谱" }, description: { es: "Crea un prompt para que la IA genere una receta creativa con solo 5 ingredientes.", en: "Create a prompt for AI to generate a creative recipe with only 5 ingredients.", zh: "创建提示词让AI用仅5种食材生成创意食谱" }, category: "creativo", difficulty: "easy", rewardCoins: 25, rewardXP: 50, timeLimit: 150, evaluationCriteria: ["creatividad", "restricciones", "presentacion"] },
  { id: "traductor_cultural", title: { es: "Traductor Cultural", en: "Cultural Translator", zh: "文化翻译" }, description: { es: "Disena un prompt para traducir un texto adaptandolo culturalmente del espanol al japones.", en: "Design a prompt to translate text with cultural adaptation from Spanish to Japanese.", zh: "设计提示词将文本从西班牙语文化适应性翻译为日语" }, category: "texto", difficulty: "hard", rewardCoins: 60, rewardXP: 100, timeLimit: 300, evaluationCriteria: ["adaptacion cultural", "matices", "contexto"] },
  { id: "codigo_python", title: { es: "Codigo Python", en: "Python Code", zh: "Python代码" }, description: { es: "Escribe un prompt para que la IA genere un script Python que analice sentimientos de tweets.", en: "Write a prompt for AI to generate a Python script that analyzes tweet sentiments.", zh: "编写提示词让AI生成分析推文情感的Python脚本" }, category: "codigo", difficulty: "hard", rewardCoins: 60, rewardXP: 100, timeLimit: 300, evaluationCriteria: ["especificidad tecnica", "librerias", "output esperado"] },
  { id: "podcast_intro", title: { es: "Intro de Podcast", en: "Podcast Intro", zh: "播客开场" }, description: { es: "Crea un prompt para generar la introduccion de un podcast sobre emprendimiento tech.", en: "Create a prompt to generate a tech entrepreneurship podcast introduction.", zh: "创建提示词生成科技创业播客的开场白" }, category: "audio", difficulty: "medium", rewardCoins: 40, rewardXP: 75, timeLimit: 200, evaluationCriteria: ["tono", "gancho", "branding"] },
  { id: "personaje_juego", title: { es: "Personaje de Videojuego", en: "Game Character", zh: "游戏角色" }, description: { es: "Disena un prompt para crear la descripcion visual de un personaje RPG con backstory.", en: "Design a prompt to create a visual description of an RPG character with backstory.", zh: "设计提示词创建带有背景故事的RPG角色视觉描述" }, category: "creativo", difficulty: "medium", rewardCoins: 40, rewardXP: 75, timeLimit: 240, evaluationCriteria: ["detalle visual", "personalidad", "coherencia"] },
  { id: "seo_articulo", title: { es: "Articulo SEO", en: "SEO Article", zh: "SEO文章" }, description: { es: "Crea un prompt para generar un articulo SEO de 800 palabras sobre inteligencia artificial en salud.", en: "Create a prompt to generate an 800-word SEO article about AI in healthcare.", zh: "创建提示词生成关于医疗AI的800字SEO文章" }, category: "texto", difficulty: "medium", rewardCoins: 40, rewardXP: 75, timeLimit: 240, evaluationCriteria: ["keywords", "estructura H1-H3", "meta description"] },
  { id: "prompt_negativo", title: { es: "Prompt Negativo", en: "Negative Prompt", zh: "负面提示词" }, description: { es: "Escribe el mejor prompt negativo para evitar artefactos en generacion de imagenes fotorrealistas.", en: "Write the best negative prompt to avoid artifacts in photorealistic image generation.", zh: "编写最佳负面提示词避免照片级真实图像生成中的伪影" }, category: "imagen", difficulty: "hard", rewardCoins: 60, rewardXP: 100, timeLimit: 180, evaluationCriteria: ["especificidad", "cobertura de artefactos", "tecnica"] },
  { id: "asistente_virtual", title: { es: "Asistente Virtual", en: "Virtual Assistant", zh: "虚拟助手" }, description: { es: "Disena un system prompt completo para un asistente virtual de atencion al cliente de una aerolinea.", en: "Design a complete system prompt for an airline customer service virtual assistant.", zh: "设计完整的系统提示词用于航空公司客户服务虚拟助手" }, category: "profesional", difficulty: "hard", rewardCoins: 60, rewardXP: 100, timeLimit: 300, evaluationCriteria: ["rol definido", "limites", "tono"] },
  { id: "meme_generator", title: { es: "Generador de Memes", en: "Meme Generator", zh: "表情包生成器" }, description: { es: "Crea un prompt para generar la imagen perfecta de un meme sobre programadores y bugs.", en: "Create a prompt to generate the perfect meme image about programmers and bugs.", zh: "创建提示词生成关于程序员和bug的完美表情包图像" }, category: "creativo", difficulty: "easy", rewardCoins: 25, rewardXP: 50, timeLimit: 120, evaluationCriteria: ["humor", "relevancia", "formato meme"] },
  { id: "pitch_elevator", title: { es: "Elevator Pitch", en: "Elevator Pitch", zh: "电梯演讲" }, description: { es: "Escribe un prompt para generar un elevator pitch de 30 segundos para una startup de IA educativa.", en: "Write a prompt to generate a 30-second elevator pitch for an educational AI startup.", zh: "编写提示词生成教育AI初创公司的30秒电梯演讲" }, category: "profesional", difficulty: "medium", rewardCoins: 40, rewardXP: 75, timeLimit: 180, evaluationCriteria: ["concision", "propuesta de valor", "hook"] },
  { id: "tutorial_tecnico", title: { es: "Tutorial Tecnico", en: "Technical Tutorial", zh: "技术教程" }, description: { es: "Crea un prompt para generar un tutorial paso a paso sobre como usar la API de OpenAI.", en: "Create a prompt to generate a step-by-step tutorial on using the OpenAI API.", zh: "创建提示词生成关于使用OpenAI API的分步教程" }, category: "codigo", difficulty: "medium", rewardCoins: 40, rewardXP: 75, timeLimit: 240, evaluationCriteria: ["claridad", "pasos secuenciales", "codigo ejemplo"] },
  { id: "carta_formal", title: { es: "Carta Formal", en: "Formal Letter", zh: "正式信函" }, description: { es: "Disena un prompt para redactar una carta formal de reclamacion a una compania de seguros.", en: "Design a prompt to draft a formal complaint letter to an insurance company.", zh: "设计提示词起草给保险公司的正式投诉信" }, category: "texto", difficulty: "easy", rewardCoins: 25, rewardXP: 50, timeLimit: 180, evaluationCriteria: ["formalidad", "estructura", "argumentacion"] },
  { id: "ilustracion_libro", title: { es: "Ilustracion de Libro", en: "Book Illustration", zh: "书籍插图" }, description: { es: "Crea un prompt para generar una ilustracion de portada para una novela de ciencia ficcion.", en: "Create a prompt to generate a cover illustration for a science fiction novel.", zh: "创建提示词为科幻小说生成封面插图" }, category: "imagen", difficulty: "hard", rewardCoins: 60, rewardXP: 100, timeLimit: 240, evaluationCriteria: ["composicion", "estilo", "narrativa visual"] },
  { id: "sql_query", title: { es: "Query SQL", en: "SQL Query", zh: "SQL查询" }, description: { es: "Escribe un prompt para que la IA genere una query SQL compleja con JOINs y subqueries.", en: "Write a prompt for AI to generate a complex SQL query with JOINs and subqueries.", zh: "编写提示词让AI生成包含JOIN和子查询的复杂SQL查询" }, category: "codigo", difficulty: "hard", rewardCoins: 60, rewardXP: 100, timeLimit: 240, evaluationCriteria: ["complejidad", "optimizacion", "claridad"] },
  { id: "hilo_twitter", title: { es: "Hilo de X/Twitter", en: "X/Twitter Thread", zh: "X/Twitter帖子串" }, description: { es: "Crea un prompt para generar un hilo viral de 10 tweets sobre tendencias de IA en 2026.", en: "Create a prompt to generate a viral 10-tweet thread about AI trends in 2026.", zh: "创建提示词生成关于2026年AI趋势的10条推文病毒式帖子串" }, category: "rrss", difficulty: "medium", rewardCoins: 40, rewardXP: 75, timeLimit: 240, evaluationCriteria: ["gancho inicial", "valor por tweet", "CTA final"] },
  { id: "presentacion_slides", title: { es: "Presentacion de Slides", en: "Slide Presentation", zh: "幻灯片演示" }, description: { es: "Disena un prompt para generar el contenido de 10 slides sobre transformacion digital.", en: "Design a prompt to generate content for 10 slides about digital transformation.", zh: "设计提示词生成关于数字化转型的10张幻灯片内容" }, category: "profesional", difficulty: "medium", rewardCoins: 40, rewardXP: 75, timeLimit: 300, evaluationCriteria: ["estructura", "datos clave", "diseno sugerido"] },
  { id: "personaje_novela", title: { es: "Personaje de Novela", en: "Novel Character", zh: "小说角色" }, description: { es: "Crea un prompt para desarrollar un personaje complejo con arco narrativo para una novela.", en: "Create a prompt to develop a complex character with narrative arc for a novel.", zh: "创建提示词为小说开发具有叙事弧线的复杂角色" }, category: "creativo", difficulty: "hard", rewardCoins: 60, rewardXP: 100, timeLimit: 300, evaluationCriteria: ["profundidad", "motivaciones", "conflicto interno"] },
  { id: "automatizacion_zapier", title: { es: "Automatizacion Zapier", en: "Zapier Automation", zh: "Zapier自动化" }, description: { es: "Escribe un prompt para disenar un flujo de automatizacion con 5 pasos en Zapier.", en: "Write a prompt to design a 5-step automation workflow in Zapier.", zh: "编写提示词设计Zapier中的5步自动化工作流" }, category: "estrategia", difficulty: "medium", rewardCoins: 40, rewardXP: 75, timeLimit: 240, evaluationCriteria: ["flujo logico", "triggers", "acciones"] },
  { id: "logo_minimalista", title: { es: "Logo Minimalista", en: "Minimalist Logo", zh: "极简标志" }, description: { es: "Crea un prompt para generar un logo minimalista para una fintech de pagos moviles.", en: "Create a prompt to generate a minimalist logo for a mobile payments fintech.", zh: "创建提示词为移动支付金融科技公司生成极简标志" }, category: "imagen", difficulty: "medium", rewardCoins: 40, rewardXP: 75, timeLimit: 180, evaluationCriteria: ["simplicidad", "memorabilidad", "escalabilidad"] },
  { id: "newsletter", title: { es: "Newsletter Semanal", en: "Weekly Newsletter", zh: "每周通讯" }, description: { es: "Disena un prompt para generar una newsletter semanal sobre novedades en IA.", en: "Design a prompt to generate a weekly newsletter about AI news.", zh: "设计提示词生成关于AI新闻的每周通讯" }, category: "texto", difficulty: "easy", rewardCoins: 25, rewardXP: 50, timeLimit: 200, evaluationCriteria: ["estructura", "curacion de contenido", "tono"] },
];

// Get today's challenge deterministically based on date
function getTodayChallenge(): ChallengeTemplate {
  const today = new Date();
  const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000);
  return CHALLENGE_POOL[dayOfYear % CHALLENGE_POOL.length];
}

// Leaderboard entry
interface LeaderboardEntry {
  rank: number;
  name: string;
  score: number;
  time: number;
  date: string;
}

const LEADERBOARD_KEY = "lince_daily_leaderboard";
const SUBMISSION_KEY = "lince_daily_submission";

function getLeaderboard(): LeaderboardEntry[] {
  try {
    const data = JSON.parse(localStorage.getItem(LEADERBOARD_KEY) || "[]");
    const today = new Date().toISOString().split("T")[0];
    return data.filter((e: LeaderboardEntry) => e.date === today).sort((a: LeaderboardEntry, b: LeaderboardEntry) => b.score - a.score);
  } catch { return []; }
}

function addToLeaderboard(entry: Omit<LeaderboardEntry, "rank">) {
  try {
    const data = JSON.parse(localStorage.getItem(LEADERBOARD_KEY) || "[]");
    data.push({ ...entry, rank: 0 });
    // Keep last 7 days
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - 7);
    const cutoffStr = cutoff.toISOString().split("T")[0];
    const filtered = data.filter((e: LeaderboardEntry) => e.date >= cutoffStr);
    localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(filtered));
  } catch { /* ignore */ }
}

function hasSubmittedToday(): boolean {
  try {
    const today = new Date().toISOString().split("T")[0];
    return localStorage.getItem(SUBMISSION_KEY) === today;
  } catch { return false; }
}

function markSubmitted() {
  const today = new Date().toISOString().split("T")[0];
  localStorage.setItem(SUBMISSION_KEY, today);
}

// Simple prompt scoring (client-side heuristic)
function scorePrompt(prompt: string, challenge: ChallengeTemplate): number {
  let score = 0;
  const words = prompt.trim().split(/\s+/).length;

  // Length scoring (10-200 words ideal)
  if (words >= 10 && words <= 30) score += 15;
  else if (words > 30 && words <= 80) score += 25;
  else if (words > 80 && words <= 150) score += 20;
  else if (words > 150) score += 10;
  else score += 5;

  // Structure scoring
  if (prompt.includes("\n")) score += 10; // Has line breaks (structured)
  if (/[1-9]\.|[-•]/.test(prompt)) score += 10; // Has lists
  if (prompt.includes('"') || prompt.includes("'")) score += 5; // Has quotes/examples

  // Specificity scoring
  const specificWords = ["específico", "detallado", "incluye", "formato", "tono", "estilo", "ejemplo", "paso", "estructura", "objetivo",
    "specific", "detailed", "include", "format", "tone", "style", "example", "step", "structure", "objective"];
  const matches = specificWords.filter(w => prompt.toLowerCase().includes(w));
  score += Math.min(matches.length * 5, 20);

  // Technical keywords
  const techWords = ["prompt", "IA", "AI", "GPT", "modelo", "output", "input", "contexto", "rol", "system",
    "model", "context", "role", "temperature", "token"];
  const techMatches = techWords.filter(w => prompt.toLowerCase().includes(w.toLowerCase()));
  score += Math.min(techMatches.length * 3, 15);

  // Difficulty bonus
  if (challenge.difficulty === "hard") score = Math.round(score * 1.2);
  else if (challenge.difficulty === "medium") score = Math.round(score * 1.1);

  return Math.min(score, 100);
}

const DIFFICULTY_COLORS: Record<string, { bg: string; text: string; label: Record<string, string> }> = {
  easy: { bg: "bg-emerald-500/10", text: "text-emerald-400", label: { es: "Fácil", en: "Easy", zh: "简单" } },
  medium: { bg: "bg-amber-500/10", text: "text-amber-400", label: { es: "Medio", en: "Medium", zh: "中等" } },
  hard: { bg: "bg-red-500/10", text: "text-red-400", label: { es: "Difícil", en: "Hard", zh: "困难" } },
};

const TT: Record<string, Record<string, string>> = {
  es: {
    title: "Reto Diario",
    subtitle: "Compite cada día con el mejor prompt",
    todayChallenge: "Reto de Hoy",
    timeLeft: "Tiempo restante",
    submit: "Enviar Prompt",
    submitted: "¡Prompt enviado!",
    alreadySubmitted: "Ya participaste hoy",
    comeBack: "Vuelve mañana para un nuevo reto",
    ranking: "Ranking del Día",
    noEntries: "Sé el primero en participar hoy",
    yourScore: "Tu puntuación",
    reward: "Recompensa",
    placeholder: "Escribe tu mejor prompt aquí...",
    characters: "caracteres",
    you: "Tú",
    criteria: "Se evalúa",
    timeUp: "¡Tiempo agotado!",
    start: "Empezar reto",
    seconds: "s",
  },
  en: {
    title: "Daily Challenge",
    subtitle: "Compete every day with the best prompt",
    todayChallenge: "Today's Challenge",
    timeLeft: "Time left",
    submit: "Submit Prompt",
    submitted: "Prompt submitted!",
    alreadySubmitted: "Already participated today",
    comeBack: "Come back tomorrow for a new challenge",
    ranking: "Today's Ranking",
    noEntries: "Be the first to participate today",
    yourScore: "Your score",
    reward: "Reward",
    placeholder: "Write your best prompt here...",
    characters: "characters",
    you: "You",
    criteria: "Evaluated on",
    timeUp: "Time's up!",
    start: "Start challenge",
    seconds: "s",
  },
  zh: {
    title: "每日挑战",
    subtitle: "每天用最佳提示词竞争",
    todayChallenge: "今日挑战",
    timeLeft: "剩余时间",
    submit: "提交提示词",
    submitted: "提示词已提交！",
    alreadySubmitted: "今天已经参加过了",
    comeBack: "明天回来参加新挑战",
    ranking: "今日排名",
    noEntries: "成为今天第一个参与者",
    yourScore: "你的得分",
    reward: "奖励",
    placeholder: "在这里写下你最好的提示词...",
    characters: "字符",
    you: "你",
    criteria: "评估标准",
    timeUp: "时间到！",
    start: "开始挑战",
    seconds: "s",
  },
};

export default function RetoDiario() {
  const { state, addCoins, addXP } = useGame();
  const { lang } = usePRDLanguage();
  const l = lang as string;
  const t = (key: string) => TT[l]?.[key] || TT.es[key] || key;

  const challenge = useMemo(() => getTodayChallenge(), []);
  const [prompt, setPrompt] = useState("");
  const [submitted, setSubmitted] = useState(hasSubmittedToday);
  const [score, setScore] = useState<number | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>(getLeaderboard);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [started, setStarted] = useState(false);

  // Timer
  useEffect(() => {
    if (!started || timeLeft === null || timeLeft <= 0 || submitted) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev === null || prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [started, timeLeft, submitted]);

  // Auto-submit on time up
  useEffect(() => {
    if (timeLeft === 0 && !submitted && prompt.trim().length > 0) {
      handleSubmit();
    }
  }, [timeLeft]);

  const startChallenge = () => {
    setStarted(true);
    setTimeLeft(challenge.timeLimit);
  };

  const handleSubmit = () => {
    if (submitted || prompt.trim().length < 10) return;

    const promptScore = scorePrompt(prompt, challenge);
    setScore(promptScore);
    setSubmitted(true);
    markSubmitted();

    // Add rewards
    const coinReward = Math.round(challenge.rewardCoins * (promptScore / 100));
    const xpReward = Math.round(challenge.rewardXP * (promptScore / 100));
    addCoins(coinReward);
    addXP(xpReward);

    // Add to leaderboard
    const today = new Date().toISOString().split("T")[0];
    const timeUsed = challenge.timeLimit - (timeLeft || 0);
    addToLeaderboard({
      name: state.playerName || "Anónimo",
      score: promptScore,
      time: timeUsed,
      date: today,
    });

    setLeaderboard(getLeaderboard());
    toast.success(`${t("submitted")} +${coinReward} 🪙 +${xpReward} XP`);
  };

  const dc = DIFFICULTY_COLORS[challenge.difficulty];

  return (
    <RequireLogin>
      <div className="min-h-screen bg-[#0A0A0A]">
        <GlobalNavBar />
        <div className="container pt-20 pb-24">
          <BackButton />

          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-3 mb-3">
              <Trophy className="w-8 h-8 text-amber-400" />
              <h1 className="font-['Space_Grotesk'] font-bold text-3xl sm:text-4xl text-white">{t("title")}</h1>
            </div>
            <p className="text-[#B0B0B0] text-lg">{t("subtitle")}</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Challenge Card */}
            <div className="lg:col-span-2">
              <div className="bg-gradient-to-br from-[#1A1A2E] to-[#0F0F1A] border border-white/10 rounded-2xl p-6">
                {/* Challenge header */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <span className="text-xs text-[#00E5FF] font-medium uppercase tracking-wider">{t("todayChallenge")}</span>
                    <h2 className="font-['Space_Grotesk'] font-bold text-2xl text-white mt-1">
                      {challenge.title[l] || challenge.title.es}
                    </h2>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${dc.bg} ${dc.text}`}>
                    {dc.label[l] || dc.label.es}
                  </span>
                </div>

                <p className="text-[#B0B0B0] leading-relaxed mb-4">
                  {challenge.description[l] || challenge.description.es}
                </p>

                {/* Criteria */}
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="text-xs text-gray-500">{t("criteria")}:</span>
                  {challenge.evaluationCriteria.map(c => (
                    <span key={c} className="text-xs px-2 py-0.5 bg-white/5 text-gray-400 rounded-full">{c}</span>
                  ))}
                </div>

                {/* Reward info */}
                <div className="flex items-center gap-4 mb-6 p-3 bg-amber-500/5 border border-amber-500/20 rounded-xl">
                  <Sparkles className="w-5 h-5 text-amber-400 flex-shrink-0" />
                  <span className="text-sm text-amber-400">
                    {t("reward")}: 🪙 {challenge.rewardCoins} + {challenge.rewardXP} XP
                  </span>
                </div>

                {/* Timer */}
                {started && timeLeft !== null && !submitted && (
                  <div className={`flex items-center gap-2 mb-4 p-3 rounded-xl ${
                    timeLeft < 30 ? "bg-red-500/10 border border-red-500/30" : "bg-white/5 border border-white/10"
                  }`}>
                    <Clock className={`w-5 h-5 ${timeLeft < 30 ? "text-red-400 animate-pulse" : "text-[#00E5FF]"}`} />
                    <span className={`font-['Space_Grotesk'] font-bold text-xl ${timeLeft < 30 ? "text-red-400" : "text-white"}`}>
                      {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, "0")}
                    </span>
                    <span className="text-gray-500 text-sm">{t("timeLeft")}</span>
                  </div>
                )}

                {/* Input area */}
                {!started && !submitted ? (
                  <button
                    onClick={startChallenge}
                    className="w-full py-4 bg-gradient-to-r from-[#00E5FF] to-cyan-600 text-black font-bold rounded-xl hover:brightness-110 transition-all text-lg flex items-center justify-center gap-2"
                  >
                    <Flame className="w-5 h-5" />
                    {t("start")} ({Math.floor(challenge.timeLimit / 60)}:{(challenge.timeLimit % 60).toString().padStart(2, "0")})
                  </button>
                ) : submitted ? (
                  <div className="text-center py-8">
                    {score !== null && (
                      <div className="mb-4">
                        <div className="text-6xl font-['Space_Grotesk'] font-bold text-amber-400 mb-2">{score}</div>
                        <div className="text-gray-400">{t("yourScore")}</div>
                        <div className="flex justify-center gap-1 mt-2">
                          {[1,2,3,4,5].map(s => (
                            <Star key={s} className={`w-6 h-6 ${s <= Math.ceil(score / 20) ? "text-amber-400 fill-amber-400" : "text-gray-700"}`} />
                          ))}
                        </div>
                      </div>
                    )}
                    <p className="text-emerald-400 font-medium">{t("comeBack")}</p>
                  </div>
                ) : (
                  <>
                    <textarea
                      value={prompt}
                      onChange={e => setPrompt(e.target.value)}
                      placeholder={t("placeholder")}
                      className="w-full h-40 bg-black/30 border border-white/10 rounded-xl p-4 text-white placeholder-gray-600 resize-none focus:outline-none focus:border-[#00E5FF]/50 transition-colors"
                      disabled={timeLeft === 0}
                    />
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-xs text-gray-500">{prompt.length} {t("characters")}</span>
                      <button
                        onClick={handleSubmit}
                        disabled={prompt.trim().length < 10 || timeLeft === 0}
                        className="px-6 py-2.5 bg-[#00E5FF] text-black font-bold rounded-xl hover:bg-[#00E5FF]/90 transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-2"
                      >
                        <Send className="w-4 h-4" />
                        {t("submit")}
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Leaderboard */}
            <div>
              <div className="bg-gradient-to-br from-[#1A1A2E] to-[#0F0F1A] border border-white/10 rounded-2xl p-5">
                <h3 className="font-['Space_Grotesk'] font-bold text-lg text-white mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5 text-amber-400" />
                  {t("ranking")}
                </h3>

                {leaderboard.length === 0 ? (
                  <div className="text-center py-8 text-gray-500 text-sm">{t("noEntries")}</div>
                ) : (
                  <div className="space-y-2">
                    {leaderboard.slice(0, 10).map((entry, i) => {
                      const isMe = entry.name === (state.playerName || "Anónimo");
                      const rankIcon = i === 0 ? <Crown className="w-4 h-4 text-amber-400" /> :
                                       i === 1 ? <Medal className="w-4 h-4 text-gray-300" /> :
                                       i === 2 ? <Medal className="w-4 h-4 text-amber-700" /> : null;
                      return (
                        <div
                          key={i}
                          className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${
                            isMe ? "bg-[#00E5FF]/10 border border-[#00E5FF]/20" : "bg-white/3 hover:bg-white/5"
                          }`}
                        >
                          <span className="w-6 text-center font-bold text-sm text-gray-500">
                            {rankIcon || `${i + 1}`}
                          </span>
                          <span className={`flex-1 text-sm font-medium truncate ${isMe ? "text-[#00E5FF]" : "text-white"}`}>
                            {entry.name} {isMe && `(${t("you")})`}
                          </span>
                          <span className="font-['Space_Grotesk'] font-bold text-amber-400 text-sm">{entry.score}</span>
                          <span className="text-xs text-gray-600">{entry.time}{t("seconds")}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </RequireLogin>
  );
}

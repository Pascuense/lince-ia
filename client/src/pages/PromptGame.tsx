import { useState, useCallback, useEffect, useMemo } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  Loader2, Zap, Target, Brain, Flame,
  Shield, Swords, Trophy, Star, RefreshCw,
  Lightbulb, TrendingUp, Wand2, Copy,
  BookOpen, PenTool, Users, ArrowLeft,
  GraduationCap, CheckCircle2, XCircle, AlertTriangle,
  ArrowRight, HelpCircle, Eye, Layers,
} from "lucide-react";
import { AVATAR_FRONTAL } from "@/lib/avatarConstants";
import { GlobalNavBar } from "@/components/GlobalNavBar";
import { BackButton } from "@/components/BackButton";
import { useGameLang } from "@/hooks/useGameLang";

// ─── Translations ───
const T: Record<string, Record<string, string>> = {
  es: {
    heroTitle: "PROMPT", heroTitleAccent: "LIN", heroSubtitle: "ACADEMIA DE PROMPTS",
    heroDesc: "Aprende a escribir prompts como un profesional. El Lince Mentor te guia paso a paso, te dice que errores cometes y como mejorar cada componente.",
    startGuided: "Modo Guiado", startGuidedDesc: "Aprende paso a paso con feedback en tiempo real",
    startFree: "Modo Libre", startFreeDesc: "Escribe tu prompt y recibe evaluacion completa",
    startChallenge: "Desafio Diario", startChallengeDesc: "Reto nuevo cada dia con ranking",
    level: "Nivel", novato: "Novato", aprendiz: "Aprendiz", intermedio: "Intermedio", avanzado: "Avanzado", maestro: "Maestro",
    step: "Paso", of: "de",
    context: "Contexto", contextDesc: "Cual es la situacion? Para que necesitas esto?",
    contextPlaceholder: "Ej: Soy un profesor de secundaria que necesita crear material educativo sobre cambio climatico para alumnos de 15 anos...",
    contextTip: "Un buen contexto le dice a la IA QUIEN eres, DONDE estas y POR QUE necesitas ayuda. Cuanto mas contexto, mejor resultado.",
    role: "Rol de la IA", roleDesc: "Que personaje o experto quieres que sea la IA?",
    rolePlaceholder: "Ej: Actua como un experto en educacion ambiental con 20 anos de experiencia creando contenido para adolescentes...",
    roleTip: "Asignar un rol especifico hace que la IA responda con la expertise adecuada. Se especifico: no solo experto, sino experto en X con Y experiencia.",
    task: "Tarea", taskDesc: "Que quieres que haga exactamente?",
    taskPlaceholder: "Ej: Crea una guia interactiva de 5 actividades practicas sobre el impacto del cambio climatico en Espana...",
    taskTip: "La tarea es el corazon del prompt. Se lo mas especifico posible: que, cuanto, para quien, con que nivel de detalle.",
    format: "Formato de salida", formatDesc: "Como quieres que te responda?",
    formatPlaceholder: "Ej: Responde en formato de tabla con columnas: Actividad | Duracion | Materiales | Objetivo. Tono didactico. Maximo 1000 palabras...",
    formatTip: "Definir el formato evita respuestas genericas. Especifica: tipo (lista, tabla, ensayo), tono (formal, cercano), extension y estructura.",
    examples: "Ejemplos", examplesDesc: "Muestrale a la IA un ejemplo de lo que esperas",
    examplesPlaceholder: "Ej: Ejemplo de actividad: Huella de Carbono Personal — Los alumnos calculan su huella usando una calculadora online y proponen 3 cambios...",
    examplesTip: "Los ejemplos son la tecnica mas poderosa. Le muestran a la IA EXACTAMENTE lo que quieres. Un buen ejemplo vale mas que mil instrucciones.",
    constraints: "Restricciones", constraintsDesc: "Que NO debe hacer o que limites tiene?",
    constraintsPlaceholder: "Ej: No uses tecnicismos cientificos complejos. Evita datos alarmistas. Incluye siempre una solucion positiva...",
    constraintsTip: "Las restricciones acotan la respuesta. Dile que evitar, que limites respetar y que tono NO usar.",
    next: "Siguiente", prev: "Anterior", skip: "Saltar (opcional)",
    evaluate: "Evaluar mi Prompt", evaluating: "El Lince Mentor esta analizando...",
    yourPrompt: "Tu prompt completo", results: "Resultados",
    componentAnalysis: "Analisis por componente",
    excellent: "Excelente", good: "Bien", needsWork: "Mejorar", missing: "Falta", notRequired: "Opcional",
    suggestion: "Sugerencia", improvedVersion: "Version mejorada por el Lince Mentor",
    techniquesUsed: "Tecnicas que usaste", techniquesMissing: "Tecnicas que te faltan",
    nextLevelTip: "Para subir de nivel", playAgain: "Jugar de nuevo", backToMenu: "Volver al menu",
    copyPrompt: "Copiar prompt mejorado", copied: "Prompt copiado al portapapeles",
    xpEarned: "XP ganado", coinsEarned: "LinceCoins",
    totalGames: "Partidas", bestScore: "Mejor", avgScore: "Media", history: "Historial",
    noHistory: "Aun no has jugado. Empieza tu primera partida!",
    guidedTitle: "Construye tu prompt paso a paso", guidedSubtitle: "El Lince Mentor te guia en cada componente",
    freeTitle: "Escribe tu prompt libremente", freeSubtitle: "Recibe evaluacion detallada de cada componente",
    freePlaceholder: "Escribe tu prompt completo aqui. Incluye contexto, rol, tarea, formato, ejemplos y restricciones...",
    challengeTitle: "Desafio del dia", challengeSubtitle: "Completa el reto y compite por la mejor puntuacion",
    required: "Obligatorio", optional: "Opcional",
    livePreview: "Vista previa del prompt", overallScore: "Puntuacion total", grade: "Grado",
    feedback: "Feedback del Mentor", showTip: "Ver consejo", hideTip: "Ocultar consejo",
    howItWorks: "Como funciona?", build: "Construye", buildDesc: "Escribe tu prompt paso a paso. Cada componente tiene una guia y consejos.",
    learn: "Aprende", learnDesc: "El Lince Mentor analiza cada parte y te dice exactamente que mejorar.",
    improve: "Mejora", improveDesc: "Recibe una version mejorada de tu prompt y sube de nivel.",
    recommended: "RECOMENDADO", fields: "campos", empty: "vacio",
    guided: "Guiado", challenge: "Desafio", free: "Libre",
    minChars: "La tarea debe tener al menos 5 caracteres", minCharsFree: "Escribe al menos 10 caracteres",
    mentorTip: "Un prompt profesional tiene 6 componentes: Contexto, Rol, Tarea, Formato, Ejemplos y Restricciones. Intenta incluir todos para obtener la mejor puntuacion!",
  },
  en: {
    heroTitle: "PROMPT", heroTitleAccent: "LIN", heroSubtitle: "PROMPT ACADEMY",
    heroDesc: "Learn to write prompts like a professional. The Lince Mentor guides you step by step, tells you what mistakes you make and how to improve each component.",
    startGuided: "Guided Mode", startGuidedDesc: "Learn step by step with real-time feedback",
    startFree: "Free Mode", startFreeDesc: "Write your prompt and get full evaluation",
    startChallenge: "Daily Challenge", startChallengeDesc: "New challenge every day with ranking",
    level: "Level", novato: "Novice", aprendiz: "Apprentice", intermedio: "Intermediate", avanzado: "Advanced", maestro: "Master",
    step: "Step", of: "of",
    context: "Context", contextDesc: "What is the situation? What do you need this for?",
    contextPlaceholder: "Ex: I am a high school teacher who needs to create educational material about climate change for 15-year-old students...",
    contextTip: "Good context tells the AI WHO you are, WHERE you are, and WHY you need help. More context = better results.",
    role: "AI Role", roleDesc: "What character or expert should the AI be?",
    rolePlaceholder: "Ex: Act as an environmental education expert with 20 years of experience creating content for teenagers...",
    roleTip: "Assigning a specific role makes the AI respond with the right expertise. Be specific.",
    task: "Task", taskDesc: "What exactly do you want it to do?",
    taskPlaceholder: "Ex: Create an interactive guide with 5 practical activities about climate change impact...",
    taskTip: "The task is the heart of the prompt. Be as specific as possible: what, how much, for whom.",
    format: "Output Format", formatDesc: "How do you want the response?",
    formatPlaceholder: "Ex: Respond in table format with columns: Activity | Duration | Materials | Objective...",
    formatTip: "Defining the format avoids generic responses. Specify: type, tone, length and structure.",
    examples: "Examples", examplesDesc: "Show the AI an example of what you expect",
    examplesPlaceholder: "Ex: Example activity: Personal Carbon Footprint — Students calculate their footprint...",
    examplesTip: "Examples are the most powerful technique. They show the AI EXACTLY what you want.",
    constraints: "Constraints", constraintsDesc: "What should it NOT do or what limits does it have?",
    constraintsPlaceholder: "Ex: Do not use complex scientific jargon. Avoid alarmist data...",
    constraintsTip: "Constraints narrow the response. Tell it what to avoid and what limits to respect.",
    next: "Next", prev: "Previous", skip: "Skip (optional)",
    evaluate: "Evaluate my Prompt", evaluating: "Lince Mentor is analyzing...",
    yourPrompt: "Your complete prompt", results: "Results",
    componentAnalysis: "Component analysis",
    excellent: "Excellent", good: "Good", needsWork: "Improve", missing: "Missing", notRequired: "Optional",
    suggestion: "Suggestion", improvedVersion: "Improved version by Lince Mentor",
    techniquesUsed: "Techniques you used", techniquesMissing: "Techniques you are missing",
    nextLevelTip: "To level up", playAgain: "Play again", backToMenu: "Back to menu",
    copyPrompt: "Copy improved prompt", copied: "Prompt copied to clipboard",
    xpEarned: "XP earned", coinsEarned: "LinceCoins",
    totalGames: "Games", bestScore: "Best", avgScore: "Average", history: "History",
    noHistory: "No games yet. Start your first game!",
    guidedTitle: "Build your prompt step by step", guidedSubtitle: "Lince Mentor guides you through each component",
    freeTitle: "Write your prompt freely", freeSubtitle: "Get detailed evaluation of each component",
    freePlaceholder: "Write your complete prompt here. Include context, role, task, format, examples and constraints...",
    challengeTitle: "Daily Challenge", challengeSubtitle: "Complete the challenge and compete for the best score",
    required: "Required", optional: "Optional",
    livePreview: "Prompt preview", overallScore: "Overall score", grade: "Grade",
    feedback: "Mentor Feedback", showTip: "Show tip", hideTip: "Hide tip",
    howItWorks: "How does it work?", build: "Build", buildDesc: "Write your prompt step by step. Each component has a guide and tips.",
    learn: "Learn", learnDesc: "The Lince Mentor analyzes each part and tells you exactly what to improve.",
    improve: "Improve", improveDesc: "Get an improved version of your prompt and level up.",
    recommended: "RECOMMENDED", fields: "fields", empty: "empty",
    guided: "Guided", challenge: "Challenge", free: "Free",
    minChars: "Task must have at least 5 characters", minCharsFree: "Write at least 10 characters",
    mentorTip: "A professional prompt has 6 components: Context, Role, Task, Format, Examples and Constraints. Try to include all for the best score!",
  },
  zh: {
    heroTitle: "PROMPT", heroTitleAccent: "LIN", heroSubtitle: "提示词学院",
    heroDesc: "学习像专业人士一样编写提示词。猞猁导师逐步指导你。",
    startGuided: "引导模式", startGuidedDesc: "逐步学习，实时反馈",
    startFree: "自由模式", startFreeDesc: "编写提示词并获得完整评估",
    startChallenge: "每日挑战", startChallengeDesc: "每天新挑战",
    level: "等级", novato: "新手", aprendiz: "学徒", intermedio: "中级", avanzado: "高级", maestro: "大师",
    step: "步骤", of: "/",
    context: "上下文", contextDesc: "情况是什么？", contextPlaceholder: "例：我是一名高中教师...", contextTip: "好的上下文告诉AI你是谁。",
    role: "AI角色", roleDesc: "你希望AI扮演什么角色？", rolePlaceholder: "例：扮演一位专家...", roleTip: "分配特定角色使AI以正确的专业知识回应。",
    task: "任务", taskDesc: "你想让它做什么？", taskPlaceholder: "例：创建一份指南...", taskTip: "任务是提示词的核心。",
    format: "输出格式", formatDesc: "你想要什么样的回复？", formatPlaceholder: "例：以表格格式回复...", formatTip: "定义格式避免通用回复。",
    examples: "示例", examplesDesc: "向AI展示示例", examplesPlaceholder: "例：示例活动...", examplesTip: "示例是最强大的技术。",
    constraints: "约束", constraintsDesc: "有什么限制？", constraintsPlaceholder: "例：不要使用复杂术语...", constraintsTip: "约束缩小回复范围。",
    next: "下一步", prev: "上一步", skip: "跳过",
    evaluate: "评估", evaluating: "分析中...",
    yourPrompt: "完整提示词", results: "结果", componentAnalysis: "组件分析",
    excellent: "优秀", good: "良好", needsWork: "需改进", missing: "缺失", notRequired: "可选",
    suggestion: "建议", improvedVersion: "改进版本",
    techniquesUsed: "使用的技术", techniquesMissing: "缺少的技术",
    nextLevelTip: "升级提示", playAgain: "再玩", backToMenu: "返回",
    copyPrompt: "复制", copied: "已复制",
    xpEarned: "XP", coinsEarned: "LinceCoins",
    totalGames: "游戏", bestScore: "最佳", avgScore: "平均", history: "历史",
    noHistory: "还没有玩过！",
    guidedTitle: "逐步构建提示词", guidedSubtitle: "导师指导你",
    freeTitle: "自由编写", freeSubtitle: "获得详细评估",
    freePlaceholder: "在这里写你的提示词...",
    challengeTitle: "每日挑战", challengeSubtitle: "完成挑战",
    required: "必填", optional: "可选",
    livePreview: "预览", overallScore: "总分", grade: "等级",
    feedback: "反馈", showTip: "显示提示", hideTip: "隐藏提示",
    howItWorks: "如何运作？", build: "构建", buildDesc: "逐步编写。",
    learn: "学习", learnDesc: "导师分析每个部分。",
    improve: "改进", improveDesc: "获得改进版本。",
    recommended: "推荐", fields: "字段", empty: "空",
    guided: "引导", challenge: "挑战", free: "自由",
    minChars: "至少5个字符", minCharsFree: "至少10个字符",
    mentorTip: "专业提示词有6个组件。",
  },
};

type GameMode = "menu" | "guided" | "free" | "challenge" | "results";
type ComponentKey = "context" | "role" | "task" | "format" | "examples" | "constraints";

interface ComponentResult {
  score: number; status: string; feedback: string; suggestion: string; errorType: string;
}

interface GuidedResult {
  overallScore: number; grade: string; title: string;
  components: Record<ComponentKey, ComponentResult>;
  generalFeedback: string; nextLevelTip: string; promptRewrite: string;
  techniquesUsed: string[]; techniquesMissing: string[];
  xpEarned: number; coinsEarned: number; streak_bonus: boolean;
}

interface HistoryEntry {
  mode: string; score: number; grade: string; title: string; level: number; timestamp: number;
}

const LEVELS = [
  { id: 1, name: "novato", color: "#B0B0B0", requiredFields: ["task"], minScore: 0 },
  { id: 2, name: "aprendiz", color: "#00C853", requiredFields: ["context", "task"], minScore: 30 },
  { id: 3, name: "intermedio", color: "#00E5FF", requiredFields: ["role", "context", "task", "format"], minScore: 50 },
  { id: 4, name: "avanzado", color: "#D4A843", requiredFields: ["role", "context", "task", "format", "examples"], minScore: 70 },
  { id: 5, name: "maestro", color: "#FFD700", requiredFields: ["role", "context", "task", "format", "examples", "constraints"], minScore: 85 },
];

const STEPS: { key: ComponentKey; icon: typeof Target; required: boolean; levelRequired: number }[] = [
  { key: "context", icon: Layers, required: false, levelRequired: 2 },
  { key: "role", icon: Users, required: false, levelRequired: 3 },
  { key: "task", icon: Target, required: true, levelRequired: 1 },
  { key: "format", icon: PenTool, required: false, levelRequired: 3 },
  { key: "examples", icon: BookOpen, required: false, levelRequired: 4 },
  { key: "constraints", icon: Shield, required: false, levelRequired: 5 },
];

const GRADE_COLORS: Record<string, string> = {
  S: "#FFD700", A: "#00E5FF", B: "#00C853", C: "#D4A843", D: "#FF9800", F: "#FF5252",
};

const STATUS_CONFIG: Record<string, { icon: typeof CheckCircle2; color: string; label: string }> = {
  excellent: { icon: CheckCircle2, color: "#00C853", label: "excellent" },
  good: { icon: CheckCircle2, color: "#00E5FF", label: "good" },
  needs_work: { icon: AlertTriangle, color: "#FF9800", label: "needsWork" },
  missing: { icon: XCircle, color: "#FF5252", label: "missing" },
  not_required: { icon: HelpCircle, color: "#666", label: "notRequired" },
};

// ─── Main Component ───
export default function PromptGame() {
  const { lang } = useGameLang();
  const t = (key: string) => T[lang]?.[key] || T.es[key] || key;

  const [mode, setMode] = useState<GameMode>("menu");
  const [level, setLevel] = useState(1);
  const [currentStep, setCurrentStep] = useState(0);
  const [showTip, setShowTip] = useState<string | null>(null);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [result, setResult] = useState<GuidedResult | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [challenge, setChallenge] = useState("");
  const [fields, setFields] = useState<Record<ComponentKey, string>>({
    context: "", role: "", task: "", format: "", examples: "", constraints: "",
  });
  const [freePrompt, setFreePrompt] = useState("");

  const evaluateGuidedMutation = trpc.promptGame.evaluateGuided.useMutation();
  const evaluateMutation = trpc.promptGame.evaluate.useMutation();
  const challengeQuery = trpc.promptGame.getChallenge.useQuery(
    { category: "creative", language: lang },
    { enabled: false }
  );

  useEffect(() => {
    try {
      const saved = localStorage.getItem("lince-promptear-history");
      if (saved) setHistory(JSON.parse(saved));
      const savedLevel = localStorage.getItem("lince-promptear-level");
      if (savedLevel) setLevel(parseInt(savedLevel) || 1);
    } catch {}
  }, []);

  const saveHistory = useCallback((entries: HistoryEntry[]) => {
    setHistory(entries);
    localStorage.setItem("lince-promptear-history", JSON.stringify(entries.slice(0, 50)));
  }, []);

  const updateField = useCallback((key: ComponentKey, value: string) => {
    setFields(prev => ({ ...prev, [key]: value }));
  }, []);

  const localScore = useMemo(() => {
    let score = 0;
    if (fields.task.length > 50) score += 30; else if (fields.task.length > 20) score += 18; else if (fields.task.length > 5) score += 8;
    if (fields.context.length > 30) score += 18; else if (fields.context.length > 10) score += 10;
    if (fields.role.length > 20) score += 15; else if (fields.role.length > 5) score += 8;
    if (fields.format.length > 15) score += 15; else if (fields.format.length > 5) score += 8;
    if (fields.examples.length > 30) score += 12; else if (fields.examples.length > 10) score += 6;
    if (fields.constraints.length > 15) score += 10; else if (fields.constraints.length > 5) score += 5;
    return Math.min(score, 100);
  }, [fields]);

  const localScoreColor = localScore >= 70 ? "#00C853" : localScore >= 40 ? "#D4A843" : "#FF5252";

  const handleEvaluateGuided = useCallback(async () => {
    if (fields.task.length < 5) { toast.error(t("minChars")); return; }
    setIsEvaluating(true);
    try {
      const res = await evaluateGuidedMutation.mutateAsync({
        context: fields.context, role: fields.role, task: fields.task,
        format: fields.format, examples: fields.examples, constraints: fields.constraints,
        level, language: lang,
      });
      setResult(res);
      setMode("results");
      if (res.overallScore >= 85 && level < 5) {
        const newLevel = Math.min(level + 1, 5);
        setLevel(newLevel);
        localStorage.setItem("lince-promptear-level", String(newLevel));
        toast.success(lang === "es" ? `Subiste al nivel ${newLevel}!` : `Level up to ${newLevel}!`);
      }
      try {
        const gameState = localStorage.getItem("lince-game-state");
        if (gameState) {
          const state = JSON.parse(gameState);
          state.linceCoins = (state.linceCoins || 0) + (res.coinsEarned || 0);
          state.xp = (state.xp || 0) + (res.xpEarned || 0);
          state.totalPromptsWritten = (state.totalPromptsWritten || 0) + 1;
          localStorage.setItem("lince-game-state", JSON.stringify(state));
        }
      } catch {}
      const newEntry: HistoryEntry = {
        mode: mode === "challenge" ? "challenge" : "guided",
        score: res.overallScore, grade: res.grade, title: res.title, level, timestamp: Date.now(),
      };
      saveHistory([newEntry, ...history]);
    } catch (err: any) { toast.error(err.message || "Error al evaluar"); }
    finally { setIsEvaluating(false); }
  }, [fields, level, lang, mode, history, saveHistory, evaluateGuidedMutation, t]);

  const handleEvaluateFree = useCallback(async () => {
    if (freePrompt.length < 10) { toast.error(t("minCharsFree")); return; }
    setIsEvaluating(true);
    try {
      const res = await evaluateMutation.mutateAsync({ prompt: freePrompt, category: "creative", language: lang });
      const normalized = res.totalScore > 100 ? Math.round(res.totalScore * 100 / 120) : res.totalScore;
      setResult({
        overallScore: normalized, grade: res.grade, title: res.title,
        components: {
          context: { score: res.scores.creativity, status: res.scores.creativity >= 15 ? "excellent" : res.scores.creativity >= 10 ? "good" : "needs_work", feedback: "", suggestion: "", errorType: "" },
          role: { score: res.scores.precision, status: res.scores.precision >= 15 ? "excellent" : res.scores.precision >= 10 ? "good" : "needs_work", feedback: "", suggestion: "", errorType: "" },
          task: { score: res.scores.technique, status: res.scores.technique >= 15 ? "excellent" : res.scores.technique >= 10 ? "good" : "needs_work", feedback: "", suggestion: "", errorType: "" },
          format: { score: res.scores.impact, status: res.scores.impact >= 15 ? "excellent" : res.scores.impact >= 10 ? "good" : "needs_work", feedback: "", suggestion: "", errorType: "" },
          examples: { score: res.scores.ethics, status: res.scores.ethics >= 15 ? "excellent" : res.scores.ethics >= 10 ? "good" : "needs_work", feedback: "", suggestion: "", errorType: "" },
          constraints: { score: res.scores.bonus, status: res.scores.bonus >= 10 ? "excellent" : res.scores.bonus >= 5 ? "good" : "needs_work", feedback: "", suggestion: "", errorType: "" },
        },
        generalFeedback: res.feedback, nextLevelTip: res.tips.join(" "), promptRewrite: "",
        techniquesUsed: [], techniquesMissing: [],
        xpEarned: res.xpEarned, coinsEarned: res.coinsEarned, streak_bonus: res.streak_bonus,
      });
      setMode("results");
      const newEntry: HistoryEntry = { mode: "free", score: normalized, grade: res.grade, title: res.title, level, timestamp: Date.now() };
      saveHistory([newEntry, ...history]);
    } catch (err: any) { toast.error(err.message || "Error al evaluar"); }
    finally { setIsEvaluating(false); }
  }, [freePrompt, lang, level, history, saveHistory, evaluateMutation, t]);

  const startChallenge = useCallback(async () => {
    const res = await challengeQuery.refetch();
    if (res.data) setChallenge(res.data.challenge);
    setFields({ context: "", role: "", task: "", format: "", examples: "", constraints: "" });
    setCurrentStep(0); setResult(null); setMode("challenge");
  }, [challengeQuery]);

  const resetGame = useCallback(() => {
    setFields({ context: "", role: "", task: "", format: "", examples: "", constraints: "" });
    setFreePrompt(""); setCurrentStep(0); setResult(null); setShowTip(null);
  }, []);

  const totalGames = history.length;
  const bestScore = history.length > 0 ? Math.max(...history.map(h => h.score)) : 0;
  const avgScore = history.length > 0 ? Math.round(history.reduce((a, h) => a + h.score, 0) / history.length) : 0;
  const levelConfig = LEVELS[level - 1];

  // ═══════════════════════════════════════════════════════
  // MENU
  // ═══════════════════════════════════════════════════════
  if (mode === "menu") {
    return (
      <div className="min-h-screen bg-[#0A0A0A] text-white">
        <GlobalNavBar />
        <div className="container pt-24 pb-16 max-w-4xl">
          <BackButton />
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#00E5FF]/30 bg-[#00E5FF]/5 mb-6">
              <GraduationCap className="w-4 h-4 text-[#00E5FF]" />
              <span className="text-[#00E5FF] text-sm font-medium">{t("heroSubtitle")}</span>
            </div>
            <h1 className="font-['Space_Grotesk'] font-bold text-5xl sm:text-7xl text-white mb-4">
              {t("heroTitle")}<span className="text-[#00E5FF]">{t("heroTitleAccent")}</span>
            </h1>
            <p className="text-[#B0B0B0] text-lg max-w-2xl mx-auto leading-relaxed mb-8">{t("heroDesc")}</p>
            <div className="inline-flex items-center gap-3 px-5 py-3 rounded-xl border border-white/10 bg-[#1A1A2E]">
              <div className="flex items-center gap-1">
                {LEVELS.map((l) => (
                  <div key={l.id} className="w-3 h-3 rounded-full transition-all"
                    style={{ background: l.id <= level ? l.color : "#333", boxShadow: l.id === level ? `0 0 8px ${l.color}` : "none" }} />
                ))}
              </div>
              <span className="text-sm font-medium" style={{ color: levelConfig.color }}>
                {t("level")} {level}: {t(levelConfig.name)}
              </span>
            </div>
          </div>

          {totalGames > 0 && (
            <div className="grid grid-cols-3 gap-4 mb-10">
              <div className="bg-[#1A1A2E] border border-[#00E5FF]/20 rounded-xl p-4 text-center">
                <Trophy className="w-5 h-5 text-[#D4A843] mx-auto mb-1" />
                <div className="text-2xl font-bold text-[#D4A843]">{bestScore}</div>
                <div className="text-xs text-[#B0B0B0]">{t("bestScore")}</div>
              </div>
              <div className="bg-[#1A1A2E] border border-[#00E5FF]/20 rounded-xl p-4 text-center">
                <Target className="w-5 h-5 text-[#00E5FF] mx-auto mb-1" />
                <div className="text-2xl font-bold text-[#00E5FF]">{avgScore}</div>
                <div className="text-xs text-[#B0B0B0]">{t("avgScore")}</div>
              </div>
              <div className="bg-[#1A1A2E] border border-[#00E5FF]/20 rounded-xl p-4 text-center">
                <Flame className="w-5 h-5 text-[#FF5252] mx-auto mb-1" />
                <div className="text-2xl font-bold text-[#FF5252]">{totalGames}</div>
                <div className="text-xs text-[#B0B0B0]">{t("totalGames")}</div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
            <button onClick={() => { resetGame(); setMode("guided"); }}
              className="group relative overflow-hidden rounded-xl border border-[#00E5FF]/30 bg-gradient-to-br from-[#00E5FF]/10 to-transparent p-6 text-left transition-all hover:border-[#00E5FF]/60 hover:shadow-[0_0_30px_rgba(0,229,255,0.1)]">
              <div className="w-14 h-14 rounded-xl bg-[#00E5FF]/15 flex items-center justify-center mb-4">
                <GraduationCap className="w-7 h-7 text-[#00E5FF]" />
              </div>
              <h3 className="font-['Space_Grotesk'] font-bold text-xl text-white mb-2">{t("startGuided")}</h3>
              <p className="text-sm text-[#B0B0B0] leading-relaxed">{t("startGuidedDesc")}</p>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#00E5FF] opacity-0 group-hover:opacity-100 transition-opacity" />
              <span className="absolute top-3 right-3 px-2 py-0.5 text-[10px] font-bold rounded-full bg-[#00E5FF]/20 text-[#00E5FF] border border-[#00E5FF]/30">
                {t("recommended")}
              </span>
            </button>
            <button onClick={() => { resetGame(); setMode("free"); }}
              className="group relative overflow-hidden rounded-xl border border-[#D4A843]/30 bg-gradient-to-br from-[#D4A843]/10 to-transparent p-6 text-left transition-all hover:border-[#D4A843]/60">
              <div className="w-14 h-14 rounded-xl bg-[#D4A843]/15 flex items-center justify-center mb-4">
                <PenTool className="w-7 h-7 text-[#D4A843]" />
              </div>
              <h3 className="font-['Space_Grotesk'] font-bold text-xl text-white mb-2">{t("startFree")}</h3>
              <p className="text-sm text-[#B0B0B0] leading-relaxed">{t("startFreeDesc")}</p>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#D4A843] opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
            <button onClick={startChallenge}
              className="group relative overflow-hidden rounded-xl border border-[#FF5252]/30 bg-gradient-to-br from-[#FF5252]/10 to-transparent p-6 text-left transition-all hover:border-[#FF5252]/60">
              <div className="w-14 h-14 rounded-xl bg-[#FF5252]/15 flex items-center justify-center mb-4">
                <Swords className="w-7 h-7 text-[#FF5252]" />
              </div>
              <h3 className="font-['Space_Grotesk'] font-bold text-xl text-white mb-2">{t("startChallenge")}</h3>
              <p className="text-sm text-[#B0B0B0] leading-relaxed">{t("startChallengeDesc")}</p>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#FF5252] opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          </div>

          <div className="bg-[#1A1A2E] rounded-xl border border-white/10 p-6 mb-10">
            <h3 className="font-['Space_Grotesk'] font-bold text-lg text-white mb-4 flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-[#D4A843]" /> {t("howItWorks")}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { icon: "1", title: t("build"), desc: t("buildDesc") },
                { icon: "2", title: t("learn"), desc: t("learnDesc") },
                { icon: "3", title: t("improve"), desc: t("improveDesc") },
              ].map((item, i) => (
                <div key={i} className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#00E5FF]/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-[#00E5FF]">{item.icon}</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm mb-1">{item.title}</h4>
                    <p className="text-xs text-[#B0B0B0] leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {history.length > 0 && (
            <div>
              <h2 className="font-['Space_Grotesk'] font-semibold text-xl text-white mb-4">{t("history")}</h2>
              <div className="space-y-2">
                {history.slice(0, 10).map((entry, idx) => (
                  <div key={idx} className="flex items-center gap-3 bg-[#1A1A2E] rounded-lg p-3 border border-white/5">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-[#00E5FF]/10">
                      {entry.mode === "guided" ? <GraduationCap className="w-4 h-4 text-[#00E5FF]" /> :
                       entry.mode === "challenge" ? <Swords className="w-4 h-4 text-[#FF5252]" /> :
                       <PenTool className="w-4 h-4 text-[#D4A843]" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-white truncate">{entry.title}</div>
                      <div className="text-xs text-[#B0B0B0]">
                        {entry.mode === "guided" ? t("guided") : entry.mode === "challenge" ? t("challenge") : t("free")} · Lv.{entry.level} · {new Date(entry.timestamp).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold" style={{ color: GRADE_COLORS[entry.grade] || "#B0B0B0" }}>{entry.grade}</div>
                      <div className="text-xs text-[#B0B0B0]">{entry.score} pts</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════
  // GUIDED MODE / CHALLENGE
  // ═══════════════════════════════════════════════════════
  if (mode === "guided" || mode === "challenge") {
    const step = STEPS[currentStep];
    const StepIcon = step.icon;
    const isRequired = step.required || level >= step.levelRequired;
    const filledSteps = STEPS.filter(s => fields[s.key].length > 0).length;
    const canEvaluate = fields.task.length >= 5;

    return (
      <div className="min-h-screen bg-[#0A0A0A] text-white">
        <GlobalNavBar />
        <div className="container pt-24 pb-16 max-w-4xl">
          <BackButton />
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="font-['Space_Grotesk'] font-bold text-2xl text-white">
                {mode === "challenge" ? t("challengeTitle") : t("guidedTitle")}
              </h1>
              <p className="text-sm text-[#B0B0B0]">
                {mode === "challenge" ? t("challengeSubtitle") : t("guidedSubtitle")}
              </p>
            </div>
            <span className="text-sm font-medium" style={{ color: levelConfig.color }}>
              Lv.{level} {t(levelConfig.name)}
            </span>
          </div>

          {mode === "challenge" && challenge && (
            <div className="rounded-xl border border-[#FF5252]/30 bg-[#FF5252]/5 p-4 mb-6">
              <div className="flex items-center gap-2 mb-2">
                <Swords className="w-5 h-5 text-[#FF5252]" />
                <span className="font-bold text-[#FF5252]">{t("challengeTitle")}</span>
              </div>
              <p className="text-white text-sm leading-relaxed">{challenge}</p>
            </div>
          )}

          <div className="flex items-center gap-1 mb-8">
            {STEPS.map((s, idx) => {
              const filled = fields[s.key].length > 0;
              const active = idx === currentStep;
              const Icon = s.icon;
              return (
                <button key={s.key} onClick={() => setCurrentStep(idx)}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-xs font-medium transition-all ${
                    active ? "bg-[#00E5FF]/15 text-[#00E5FF] border border-[#00E5FF]/30" :
                    filled ? "bg-[#00C853]/10 text-[#00C853] border border-[#00C853]/20" :
                    "bg-[#1A1A2E] text-[#666] border border-white/5"
                  }`}>
                  <Icon className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{t(s.key)}</span>
                  {filled && <CheckCircle2 className="w-3 h-3 text-[#00C853]" />}
                </button>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">
            <div className="lg:col-span-4">
              <div className="bg-[#1A1A2E] rounded-xl border border-white/10 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#00E5FF]/15 flex items-center justify-center">
                      <StepIcon className="w-5 h-5 text-[#00E5FF]" />
                    </div>
                    <div>
                      <h2 className="font-['Space_Grotesk'] font-bold text-lg text-white">
                        {t("step")} {currentStep + 1} {t("of")} 6: {t(step.key)}
                      </h2>
                      <p className="text-sm text-[#B0B0B0]">{t(`${step.key}Desc`)}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 text-[10px] font-bold rounded-full ${
                    isRequired ? "bg-[#FF5252]/20 text-[#FF5252] border border-[#FF5252]/30" :
                    "bg-[#666]/20 text-[#666] border border-[#666]/30"
                  }`}>
                    {isRequired ? t("required") : t("optional")}
                  </span>
                </div>

                <Textarea value={fields[step.key]} onChange={(e) => updateField(step.key, e.target.value)}
                  placeholder={t(`${step.key}Placeholder`)}
                  className="min-h-[160px] bg-[#0A0A0A] border-white/10 focus:border-[#00E5FF]/50 text-white placeholder:text-[#444] resize-none text-base leading-relaxed mb-4"
                  maxLength={step.key === "examples" ? 1000 : 500} />

                <div className="flex items-center justify-between">
                  <span className="text-xs text-[#666]">{fields[step.key].length}/{step.key === "examples" ? 1000 : 500}</span>
                  <button onClick={() => setShowTip(showTip === step.key ? null : step.key)}
                    className="text-xs text-[#D4A843] hover:text-[#D4A843]/80 flex items-center gap-1 transition-colors">
                    <Lightbulb className="w-3 h-3" />
                    {showTip === step.key ? t("hideTip") : t("showTip")}
                  </button>
                </div>

                {showTip === step.key && (
                  <div className="mt-4 p-4 rounded-xl bg-[#D4A843]/5 border border-[#D4A843]/20">
                    <div className="flex items-start gap-3">
                      <img src={AVATAR_FRONTAL.YAYALIN} alt="Lince Mentor" className="w-10 h-10 rounded-full object-cover flex-shrink-0" />
                      <div>
                        <span className="text-xs font-bold text-[#D4A843] block mb-1">LINCE MENTOR</span>
                        <p className="text-sm text-[#B0B0B0] leading-relaxed">{t(`${step.key}Tip`)}</p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between mt-6">
                  <Button onClick={() => setCurrentStep(Math.max(0, currentStep - 1))} disabled={currentStep === 0}
                    variant="outline" className="border-white/20 text-white hover:bg-white/5 disabled:opacity-30">
                    <ArrowLeft className="w-4 h-4 mr-1" /> {t("prev")}
                  </Button>
                  <div className="flex items-center gap-2">
                    {!isRequired && fields[step.key].length === 0 && currentStep < 5 && (
                      <Button onClick={() => setCurrentStep(currentStep + 1)} variant="ghost" className="text-[#666] hover:text-white">
                        {t("skip")}
                      </Button>
                    )}
                    {currentStep < 5 ? (
                      <Button onClick={() => setCurrentStep(currentStep + 1)}
                        className="bg-[#00E5FF] text-black font-bold hover:bg-[#00E5FF]/80">
                        {t("next")} <ArrowRight className="w-4 h-4 ml-1" />
                      </Button>
                    ) : (
                      <Button onClick={handleEvaluateGuided} disabled={!canEvaluate || isEvaluating}
                        className="bg-gradient-to-r from-[#00E5FF] to-[#00C853] text-black font-bold hover:opacity-90 disabled:opacity-30">
                        {isEvaluating ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> {t("evaluating")}</> :
                          <><Zap className="w-4 h-4 mr-2" /> {t("evaluate")}</>}
                      </Button>
                    )}
                  </div>
                </div>
              </div>

              {currentStep < 5 && canEvaluate && (
                <div className="mt-4">
                  <Button onClick={handleEvaluateGuided} disabled={isEvaluating} variant="outline"
                    className="w-full border-[#00E5FF]/30 text-[#00E5FF] hover:bg-[#00E5FF]/10">
                    {isEvaluating ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> {t("evaluating")}</> :
                      <><Zap className="w-4 h-4 mr-2" /> {t("evaluate")} ({filledSteps}/6 {t("fields")})</>}
                  </Button>
                </div>
              )}
            </div>

            <div className="lg:col-span-3">
              <div className="bg-[#1A1A2E] rounded-xl border border-white/10 p-5 sticky top-24">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-['Space_Grotesk'] font-bold text-sm text-white flex items-center gap-2">
                    <Eye className="w-4 h-4 text-[#00E5FF]" /> {t("livePreview")}
                  </h3>
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{ background: `${localScoreColor}20`, color: localScoreColor }}>
                    {localScore}
                  </div>
                </div>
                <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden mb-4">
                  <div className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${localScore}%`, background: localScoreColor }} />
                </div>
                <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
                  {STEPS.map((s) => {
                    const val = fields[s.key];
                    const Icon = s.icon;
                    if (!val) return (
                      <div key={s.key} className="flex items-center gap-2 text-[#444] text-xs py-1">
                        <Icon className="w-3 h-3" /> <span className="italic">{t(s.key)} — {t("empty")}</span>
                      </div>
                    );
                    return (
                      <div key={s.key} className="border-l-2 border-[#00E5FF]/30 pl-3 py-1">
                        <div className="flex items-center gap-1 text-[#00E5FF] text-xs font-bold mb-0.5">
                          <Icon className="w-3 h-3" /> {t(s.key)}
                        </div>
                        <p className="text-xs text-[#B0B0B0] leading-relaxed line-clamp-3">{val}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════
  // FREE MODE
  // ═══════════════════════════════════════════════════════
  if (mode === "free") {
    return (
      <div className="min-h-screen bg-[#0A0A0A] text-white">
        <GlobalNavBar />
        <div className="container pt-24 pb-16 max-w-3xl">
          <BackButton />
          <div className="mb-6">
            <h1 className="font-['Space_Grotesk'] font-bold text-2xl text-white mb-1">{t("freeTitle")}</h1>
            <p className="text-sm text-[#B0B0B0]">{t("freeSubtitle")}</p>
          </div>
          <div className="bg-[#1A1A2E] rounded-xl border border-white/10 p-6 mb-6">
            <Textarea value={freePrompt} onChange={(e) => setFreePrompt(e.target.value)}
              placeholder={t("freePlaceholder")}
              className="min-h-[300px] bg-[#0A0A0A] border-white/10 focus:border-[#D4A843]/50 text-white placeholder:text-[#444] resize-none text-base leading-relaxed"
              maxLength={2000} />
            <div className="flex items-center justify-between mt-2">
              <span className="text-xs text-[#666]">{freePrompt.length}/2000</span>
            </div>
          </div>
          <Button onClick={handleEvaluateFree} disabled={freePrompt.length < 10 || isEvaluating}
            className="w-full h-14 text-lg font-bold rounded-xl bg-gradient-to-r from-[#D4A843] to-[#D4A843]/80 text-black hover:opacity-90 disabled:opacity-30">
            {isEvaluating ? <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> {t("evaluating")}</> :
              <><Zap className="w-5 h-5 mr-2" /> {t("evaluate")}</>}
          </Button>
          <div className="mt-6 p-4 bg-[#1A1A2E] rounded-xl border border-[#D4A843]/20">
            <div className="flex items-start gap-3">
              <img src={AVATAR_FRONTAL.YAYALIN} alt="Mentor" className="w-10 h-10 rounded-full object-cover flex-shrink-0" />
              <div>
                <span className="text-xs font-bold text-[#D4A843] block mb-1">LINCE MENTOR</span>
                <p className="text-sm text-[#B0B0B0] leading-relaxed">{t("mentorTip")}</p>
              </div>
            </div>
          </div>
          <Button onClick={() => setMode("menu")} variant="outline"
            className="w-full mt-4 border-white/20 text-white hover:bg-white/5">
            <ArrowLeft className="w-4 h-4 mr-2" /> {t("backToMenu")}
          </Button>
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════
  // RESULTS
  // ═══════════════════════════════════════════════════════
  if (mode === "results" && result) {
    const gradeColor = GRADE_COLORS[result.grade] || "#B0B0B0";
    return (
      <div className="min-h-screen bg-[#0A0A0A] text-white">
        <GlobalNavBar />
        <div className="container pt-24 pb-16 max-w-4xl">
          <BackButton />
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-[#1A1A2E] mb-4">
              <Trophy className="w-4 h-4 text-[#D4A843]" />
              <span className="text-sm font-medium text-[#D4A843]">{result.title}</span>
            </div>
            <div className="flex items-center justify-center gap-6 mb-4">
              <div>
                <div className="text-6xl font-bold font-['Space_Grotesk']" style={{ color: gradeColor }}>{result.grade}</div>
                <div className="text-sm text-[#B0B0B0]">{t("grade")}</div>
              </div>
              <div className="w-px h-16 bg-white/10" />
              <div>
                <div className="text-5xl font-bold font-['Space_Grotesk'] text-white">{result.overallScore}</div>
                <div className="text-sm text-[#B0B0B0]">{t("overallScore")}</div>
              </div>
            </div>
            <div className="flex items-center justify-center gap-4">
              <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#00E5FF]/10 border border-[#00E5FF]/20">
                <Zap className="w-3 h-3 text-[#00E5FF]" />
                <span className="text-xs font-bold text-[#00E5FF]">+{result.xpEarned} XP</span>
              </div>
              <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#D4A843]/10 border border-[#D4A843]/20">
                <Star className="w-3 h-3 text-[#D4A843]" />
                <span className="text-xs font-bold text-[#D4A843]">+{result.coinsEarned} LC</span>
              </div>
            </div>
          </div>

          <div className="bg-[#1A1A2E] rounded-xl border border-white/10 p-6 mb-6">
            <h3 className="font-['Space_Grotesk'] font-bold text-lg text-white mb-4 flex items-center gap-2">
              <Brain className="w-5 h-5 text-[#00E5FF]" /> {t("componentAnalysis")}
            </h3>
            <div className="space-y-4">
              {(Object.entries(result.components) as [ComponentKey, ComponentResult][]).map(([key, comp]) => {
                const statusCfg = STATUS_CONFIG[comp.status] || STATUS_CONFIG.needs_work;
                const StatusIcon = statusCfg.icon;
                const stepInfo = STEPS.find(s => s.key === key);
                const SIcon = stepInfo?.icon || Target;
                return (
                  <div key={key} className="rounded-xl border border-white/5 p-4 bg-[#0A0A0A]">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <SIcon className="w-4 h-4 text-[#B0B0B0]" />
                        <span className="font-bold text-white text-sm">{t(key)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <StatusIcon className="w-4 h-4" style={{ color: statusCfg.color }} />
                        <span className="text-xs font-bold" style={{ color: statusCfg.color }}>{t(statusCfg.label)}</span>
                        <span className="text-xs text-[#666]">{comp.score}/20</span>
                      </div>
                    </div>
                    <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden mb-2">
                      <div className="h-full rounded-full transition-all duration-700" style={{ width: `${(comp.score / 20) * 100}%`, background: statusCfg.color }} />
                    </div>
                    {comp.feedback && <p className="text-sm text-[#B0B0B0] leading-relaxed mb-1">{comp.feedback}</p>}
                    {comp.suggestion && (
                      <div className="flex items-start gap-2 mt-2 p-2 rounded-lg bg-[#D4A843]/5 border border-[#D4A843]/10">
                        <Lightbulb className="w-3 h-3 text-[#D4A843] mt-0.5 flex-shrink-0" />
                        <p className="text-xs text-[#D4A843] leading-relaxed">{comp.suggestion}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-[#1A1A2E] rounded-xl border border-white/10 p-6 mb-6">
            <div className="flex items-start gap-4">
              <img src={AVATAR_FRONTAL.YAYALIN} alt="Mentor" className="w-12 h-12 rounded-full object-cover flex-shrink-0" />
              <div>
                <h3 className="font-['Space_Grotesk'] font-bold text-lg text-white mb-2">{t("feedback")}</h3>
                <p className="text-[#B0B0B0] leading-relaxed mb-3">{result.generalFeedback}</p>
                {result.nextLevelTip && (
                  <div className="flex items-start gap-2 p-3 rounded-xl bg-[#00E5FF]/5 border border-[#00E5FF]/20">
                    <TrendingUp className="w-4 h-4 text-[#00E5FF] mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="text-xs font-bold text-[#00E5FF] block mb-0.5">{t("nextLevelTip")}</span>
                      <p className="text-sm text-[#B0B0B0]">{result.nextLevelTip}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {result.promptRewrite && result.promptRewrite !== "[Version mejorada no disponible]" && (
            <div className="bg-gradient-to-br from-[#00E5FF]/5 to-[#D4A843]/5 rounded-xl border border-[#00E5FF]/20 p-6 mb-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-['Space_Grotesk'] font-bold text-lg text-white flex items-center gap-2">
                  <Wand2 className="w-5 h-5 text-[#00E5FF]" /> {t("improvedVersion")}
                </h3>
                <Button onClick={() => { navigator.clipboard.writeText(result.promptRewrite); toast.success(t("copied")); }}
                  variant="outline" size="sm" className="border-[#00E5FF]/30 text-[#00E5FF] hover:bg-[#00E5FF]/10">
                  <Copy className="w-3 h-3 mr-1" /> {t("copyPrompt")}
                </Button>
              </div>
              <div className="bg-[#0A0A0A] rounded-lg p-4 border border-white/5">
                <p className="text-sm text-[#B0B0B0] leading-relaxed whitespace-pre-wrap">{result.promptRewrite}</p>
              </div>
            </div>
          )}

          {(result.techniquesUsed.length > 0 || result.techniquesMissing.length > 0) && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              {result.techniquesUsed.length > 0 && (
                <div className="bg-[#1A1A2E] rounded-xl border border-[#00C853]/20 p-5">
                  <h4 className="font-bold text-sm text-[#00C853] mb-3 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" /> {t("techniquesUsed")}
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {result.techniquesUsed.map((tech, i) => (
                      <span key={i} className="px-2 py-1 text-xs rounded-full bg-[#00C853]/10 text-[#00C853] border border-[#00C853]/20">{tech}</span>
                    ))}
                  </div>
                </div>
              )}
              {result.techniquesMissing.length > 0 && (
                <div className="bg-[#1A1A2E] rounded-xl border border-[#FF9800]/20 p-5">
                  <h4 className="font-bold text-sm text-[#FF9800] mb-3 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" /> {t("techniquesMissing")}
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {result.techniquesMissing.map((tech, i) => (
                      <span key={i} className="px-2 py-1 text-xs rounded-full bg-[#FF9800]/10 text-[#FF9800] border border-[#FF9800]/20">{tech}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <Button onClick={() => { resetGame(); setMode("guided"); }}
              className="h-12 font-bold rounded-xl bg-[#00E5FF] text-black hover:bg-[#00E5FF]/80">
              <RefreshCw className="w-4 h-4 mr-2" /> {t("playAgain")}
            </Button>
            <Button onClick={() => { resetGame(); setMode("menu"); }} variant="outline"
              className="h-12 font-bold rounded-xl border-white/20 text-white hover:bg-white/5">
              {t("backToMenu")}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

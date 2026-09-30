import { useState, useEffect, useRef, useMemo } from "react";
import ShareDownloadBar from "@/components/ShareDownloadBar";
import { useGuest } from "@/contexts/GuestContext";
import { trpc } from "@/lib/trpc";
import { NextStepFooter } from "@/components/NextStepFooter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import {
  Wand2,
  Sparkles,
  Image as ImageIcon,
  Eye,
  ArrowLeft,
  Loader2,
  Download,
  Copy,
  RefreshCw,
  Palette,
  MapPin,
  FileText,
  Lightbulb,
  ChevronDown,
  ChevronRight,
  Shield,
  BarChart3,
  Zap,
  Target,
  CheckCircle2,
  AlertTriangle,
  Info,
  Star,
  TrendingUp,
} from "lucide-react";
import { AVATAR_FRONTAL, AVATAR_EXPRESSIONS } from "@/lib/avatarConstants";
import { UserNavBadge } from "@/components/UserNavBadge";
import { PromptLevelProgress, PromptLevelBadge, calculatePromptLevel, PROMPT_LEVELS } from "@/components/PromptStudioLevels";
// GlobalNavBar and BackButton removed - not needed in PromptStudio

// ─── Avatar Guide Data ───
const AVATAR_GUIDES = [
  {
    name: "PRIMO",
    role: "Genio Creativo",
    img: AVATAR_FRONTAL.SABELIN,
    expressionHappy: AVATAR_EXPRESSIONS.SABELIN?.feliz,
    expressionThinking: AVATAR_EXPRESSIONS.SABELIN?.pensando,
    color: "#00E5FF",
  },
  {
    name: "MAMÁ",
    role: "Mamá Artista",
    img: AVATAR_FRONTAL.MAMALINA,
    expressionHappy: AVATAR_EXPRESSIONS.MAMALINA?.feliz,
    expressionThinking: AVATAR_EXPRESSIONS.MAMALINA?.pensando,
    color: "#D4A843",
  },
  {
    name: "NIÑA",
    role: "Exploradora Digital",
    img: AVATAR_FRONTAL.PEQUELINA,
    expressionHappy: AVATAR_EXPRESSIONS.PEQUELINA?.feliz,
    expressionThinking: AVATAR_EXPRESSIONS.PEQUELINA?.pensando,
    color: "#9C27B0",
  },
];

// ─── Constants ───
const STYLE_OPTIONS = [
  { value: "realista", label: "Realista / Fotográfico", icon: "📷" },
  { value: "cartoon", label: "Cartoon / Animación", icon: "🎨" },
  { value: "acuarela", label: "Acuarela", icon: "🖌️" },
  { value: "3d-render", label: "3D Render", icon: "🧊" },
  { value: "pixel-art", label: "Pixel Art", icon: "👾" },
  { value: "oil-painting", label: "Pintura al Óleo", icon: "🖼️" },
  { value: "minimalista", label: "Minimalista", icon: "⬜" },
  { value: "cyberpunk", label: "Cyberpunk / Neon", icon: "🌃" },
  { value: "anime", label: "Anime / Manga", icon: "🎌" },
  { value: "sketch", label: "Boceto / Dibujo", icon: "✏️" },
];

const ENVIRONMENT_OPTIONS = [
  { value: "estudio", label: "Estudio Profesional", icon: "📸", thumb: "https://files.manuscdn.com/user_upload_by_module/session_file/310419663032363896/BeRfFKiJADZGBlVC.jpg", desc: "Ideal para retratos, fotos de producto y fondos controlados con iluminación profesional" },
  { value: "naturaleza", label: "Naturaleza", icon: "🌿", thumb: "https://files.manuscdn.com/user_upload_by_module/session_file/310419663032363896/NDtaPNNUuCjxmzxR.jpg", desc: "Bosques, montañas, ríos y paisajes al aire libre con luz natural" },
  { value: "ciudad", label: "Ciudad Urbana", icon: "🏙️", thumb: "https://files.manuscdn.com/user_upload_by_module/session_file/310419663032363896/hGpVLMgftxVdCKls.jpg", desc: "Calles, edificios, graffiti y ambientes metropolitanos con energía urbana" },
  { value: "espacio", label: "Espacio Exterior", icon: "🚀", thumb: "https://files.manuscdn.com/user_upload_by_module/session_file/310419663032363896/AIBohNxmLHdDhNEw.jpg", desc: "Galaxias, nebulosas, planetas y escenas cósmicas con estrellas" },
  { value: "marino", label: "Marino", icon: "🐠", thumb: "https://files.manuscdn.com/user_upload_by_module/session_file/310419663032363896/FZPHTyPrUmwkiaEN.jpg", desc: "Océanos, arrecifes de coral, vida marina y escenas subacuáticas" },
  { value: "fantasia", label: "Mundo de Fantasía", icon: "🏰", thumb: "https://files.manuscdn.com/user_upload_by_module/session_file/310419663032363896/FCEHRWDwHVzhCBHm.jpg", desc: "Castillos mágicos, criaturas fantásticas y mundos de ensueño" },
  { value: "interior", label: "Interior Moderno", icon: "🏠", thumb: "https://files.manuscdn.com/user_upload_by_module/session_file/310419663032363896/FZLRaIVSjAoqclFg.jpg", desc: "Habitaciones, oficinas y espacios interiores con diseño contemporáneo" },
  { value: "desierto", label: "Desierto", icon: "🏜️", thumb: "https://files.manuscdn.com/user_upload_by_module/session_file/310419663032363896/AjEcMsrxQAKKzWea.jpg", desc: "Dunas, arena dorada, atardeceres cálidos y paisajes áridos" },
  { value: "noche", label: "Escena Nocturna", icon: "🌙", thumb: "https://files.manuscdn.com/user_upload_by_module/session_file/310419663032363896/KgdzzzbBUXSLUOFd.jpg", desc: "Luces de neón, cielos estrellados y ambientes nocturnos con contraste" },
  { value: "abstracto", label: "Fondo Abstracto", icon: "🎭", thumb: "https://files.manuscdn.com/user_upload_by_module/session_file/310419663032363896/kaKioVtFHqgiJdGA.jpg", desc: "Formas geométricas, gradientes de color y texturas artísticas" },
];

// ─── Avatar-driven Examples ───
const EXAMPLE_PROMPTS = [
  {
    avatar: AVATAR_GUIDES[0],
    quote: "¡Mira lo que puedo crear! Un lince futurista enseñando IA en una ciudad de neón.",
    subject: "Un lince ibérico enseñando inteligencia artificial a estudiantes universitarios",
    style: "cyberpunk",
    environment: "ciudad",
    details: "Colores neón cyan y dorado, hologramas flotantes con código, atmósfera futurista, iluminación volumétrica dramática",
  },
  {
    avatar: AVATAR_GUIDES[1],
    quote: "Yo prefiero algo más cálido... una familia aprendiendo junta con luz dorada.",
    subject: "Una familia multigeneracional aprendiendo con tablets y robots amigables",
    style: "realista",
    environment: "interior",
    details: "Iluminación cálida dorada, sonrisas genuinas, pantallas con gráficos de IA, bokeh suave en el fondo",
  },
  {
    avatar: AVATAR_GUIDES[2],
    quote: "¡Yo quiero un robot profe dando clase en un mundo mágico con estrellas!",
    subject: "Un robot profesor amigable dando clase de machine learning a niños curiosos",
    style: "cartoon",
    environment: "fantasia",
    details: "Colores brillantes pastel, burbujas de conocimiento flotando, estrellas y partículas mágicas, composición centrada",
  },
];

// ─── Evaluation Criteria (mirrors server-side) ───
const EVALUATION_CRITERIA = {
  subject: {
    name: "Sujeto",
    color: "#00E5FF",
    icon: "📝",
    maxScore: 30,
    criteria: [
      { name: "Especificidad", weight: 10, description: "Cuanto más específico sea el sujeto, mejor resultado. 'Un lince ibérico con gafas de sol enseñando código' > 'un animal'" },
      { name: "Claridad", weight: 10, description: "El sujeto debe ser comprensible y sin ambigüedades. Evita abstracciones vagas." },
      { name: "Imaginabilidad", weight: 10, description: "¿Se puede visualizar fácilmente? Los sujetos concretos y visuales producen mejores imágenes." },
    ],
  },
  style: {
    name: "Estilo",
    color: "#D4A843",
    icon: "🎨",
    maxScore: 25,
    criteria: [
      { name: "Coherencia", weight: 10, description: "El estilo debe ser compatible con el sujeto. Un retrato hiperrealista de un personaje pixel-art no funciona." },
      { name: "Definición", weight: 8, description: "Estilos bien definidos (ej: 'acuarela japonesa') dan mejores resultados que genéricos." },
      { name: "Referencia artística", weight: 7, description: "Mencionar artistas o movimientos específicos (ej: 'estilo Ghibli', 'Art Nouveau') mejora la precisión." },
    ],
  },
  environment: {
    name: "Entorno",
    color: "#00C853",
    icon: "🌍",
    maxScore: 25,
    criteria: [
      { name: "Atmósfera", weight: 10, description: "Un buen entorno define la atmósfera. 'Bosque neblinoso al amanecer' > 'naturaleza'." },
      { name: "Profundidad", weight: 8, description: "Entornos con capas (primer plano, fondo, cielo) crean composiciones más ricas." },
      { name: "Iluminación implícita", weight: 7, description: "El entorno sugiere iluminación: 'atardecer dorado' implica luz cálida lateral." },
    ],
  },
  details: {
    name: "Detalles",
    color: "#9C27B0",
    icon: "✨",
    maxScore: 20,
    criteria: [
      { name: "Colores específicos", weight: 5, description: "Nombrar colores exactos (ej: 'cyan neón #00E5FF') da control preciso sobre la paleta." },
      { name: "Iluminación explícita", weight: 5, description: "Definir tipo de luz: volumétrica, rim light, contraluz, luz suave difusa, etc." },
      { name: "Composición", weight: 5, description: "Indicar ángulo de cámara, regla de tercios, primer plano vs panorámica, etc." },
      { name: "Estado de ánimo", weight: 5, description: "Emociones y sensaciones: épico, sereno, misterioso, alegre, dramático." },
    ],
  },
};

// ─── Client-side evaluation ───
function evaluateLocally(input: { subject: string; style: string; environment: string; details: string }) {
  const fieldScores: Record<string, { score: number; max: number; feedback: string; level: "low" | "medium" | "high" }> = {};

  const subLen = input.subject.length;
  let ss = 0;
  let sf = "";
  if (subLen > 50) { ss += 10; sf = "Excelente especificidad. "; }
  else if (subLen > 20) { ss += 6; sf = "Buena especificidad, podrías añadir más detalle. "; }
  else if (subLen > 0) { ss += 3; sf = "Muy corto — sé más específico. "; }
  if (subLen > 20) { ss += 7; sf += "Buena claridad. "; } else if (subLen > 0) { ss += 5; sf += "Aceptable. "; }
  const visualWords = /color|luz|brillante|oscuro|grande|pequeño|alto|bajo|joven|viejo|robot|persona|animal|edificio|paisaje|lince|gato|perro|niño|familia/i;
  if (visualWords.test(input.subject)) { ss += 10; sf += "Buena imaginabilidad visual."; }
  else if (subLen > 30) { ss += 7; sf += "Imaginabilidad aceptable."; }
  else if (subLen > 0) { ss += 4; sf += "Añade elementos visuales concretos."; }
  const subScore = Math.min(ss, 30);
  fieldScores.subject = { score: subScore, max: 30, feedback: sf.trim(), level: subScore >= 22 ? "high" : subScore >= 14 ? "medium" : "low" };

  let stScore = 0;
  let stFeedback = "";
  const specificStyles = /ghibli|art nouveau|bauhaus|impresionista|cubista|surrealista|pop art|vaporwave|steampunk|gothic|renaissance/i;
  if (specificStyles.test(input.style)) { stScore = 25; stFeedback = "Estilo muy específico y definido."; }
  else if (input.style.length > 10) { stScore = 18; stFeedback = "Buen estilo. Podrías añadir referencia artística."; }
  else if (input.style.length > 0) { stScore = 12; stFeedback = "Estilo básico. Prueba ser más específico."; }
  fieldScores.style = { score: Math.min(stScore, 25), max: 25, feedback: stFeedback, level: stScore >= 20 ? "high" : stScore >= 14 ? "medium" : "low" };

  let es = 0;
  let ef = "";
  const atmosphericWords = /amanecer|atardecer|noche|lluvia|niebla|nieve|tormenta|dorado|crepúsculo|bruma|neón|estrellado/i;
  const depthWords = /fondo|primer plano|horizonte|cielo|suelo|montañas|edificios|árboles|nubes/i;
  if (atmosphericWords.test(input.environment)) { es += 10; ef = "Excelente atmósfera. "; }
  else if (input.environment.length > 15) { es += 6; ef = "Buena atmósfera. "; }
  else if (input.environment.length > 0) { es += 3; ef = "Añade elementos atmosféricos. "; }
  if (depthWords.test(input.environment)) { es += 8; ef += "Buena profundidad. "; }
  else if (input.environment.length > 0) { es += 4; ef += "Añade capas de profundidad. "; }
  es += input.environment.length > 20 ? 7 : input.environment.length > 0 ? 3 : 0;
  ef += input.environment.length > 20 ? "Iluminación implícita detectada." : input.environment.length > 0 ? "Describe más el entorno." : "";
  const envScore = Math.min(es, 25);
  fieldScores.environment = { score: envScore, max: 25, feedback: ef.trim(), level: envScore >= 18 ? "high" : envScore >= 10 ? "medium" : "low" };

  let ds = 0;
  let df = "";
  if (!input.details || input.details.length === 0) {
    df = "Sin detalles. Añadir colores, iluminación y composición mejoraría el resultado.";
  } else {
    const colorWords = /color|#[0-9a-f]{3,6}|rojo|azul|verde|cyan|dorado|neón|pastel|monocromático/i;
    const lightWords = /luz|iluminación|sombra|contraluz|volumétrica|rim light|suave|dramática|cenital/i;
    const compWords = /ángulo|cámara|primer plano|panorámica|cenital|picado|contrapicado|regla de tercios|bokeh/i;
    const moodWords = /épico|sereno|misterioso|alegre|dramático|melancólico|energético|tranquilo|oscuro|brillante/i;
    if (colorWords.test(input.details)) { ds += 5; df += "Colores especificados. "; } else { ds += 1; df += "Añade colores. "; }
    if (lightWords.test(input.details)) { ds += 5; df += "Iluminación definida. "; } else { ds += 1; df += "Define iluminación. "; }
    if (compWords.test(input.details)) { ds += 5; df += "Composición indicada. "; } else { ds += 1; df += "Indica composición. "; }
    if (moodWords.test(input.details)) { ds += 5; df += "Estado de ánimo definido."; } else { ds += 1; df += "Añade estado de ánimo."; }
  }
  const detScore = Math.min(ds, 20);
  fieldScores.details = { score: detScore, max: 20, feedback: df.trim(), level: detScore >= 14 ? "high" : detScore >= 8 ? "medium" : "low" };

  const totalScore = Object.values(fieldScores).reduce((sum, f) => sum + f.score, 0);
  return { totalScore, maxScore: 100, percentage: Math.round((totalScore / 100) * 100), fieldScores };
}

// ─── Score Bar Component ───
function ScoreBar({ score, max, color, label }: { score: number; max: number; color: string; label: string }) {
  const pct = max > 0 ? Math.round((score / max) * 100) : 0;
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs">
        <span className="text-[#B0B0B0]">{label}</span>
        <span className="font-mono font-bold" style={{ color }}>{score}/{max}</span>
      </div>
      <div className="h-2 rounded-full bg-white/[0.06] overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500 ease-out"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}

// ─── Level Badge ───
function LevelBadge({ level }: { level: "low" | "medium" | "high" }) {
  const config = {
    low: { label: "Mejorable", color: "#FF5252", icon: AlertTriangle },
    medium: { label: "Bueno", color: "#D4A843", icon: TrendingUp },
    high: { label: "Excelente", color: "#00C853", icon: CheckCircle2 },
  };
  const c = config[level];
  const Icon = c.icon;
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold" style={{ backgroundColor: `${c.color}15`, color: c.color, border: `1px solid ${c.color}30` }}>
      <Icon className="w-3 h-3" />
      {c.label}
    </span>
  );
}

// ─── Main Component ───
export default function PromptStudio(props?: any) {
  const embedded = props?.embedded ?? false;
  const [subject, setSubject] = useState("");
  const [style, setStyle] = useState("");
  const [environment, setEnvironment] = useState("");
  const [details, setDetails] = useState("");
  const [enhancedPrompt, setEnhancedPrompt] = useState("");
  const [breakdown, setBreakdown] = useState<{ composition: string; lighting: string; colorPalette: string; technicalTerms: string; artisticReferences: string } | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [showMethodology, setShowMethodology] = useState(false);
  const [showEvalCriteria, setShowEvalCriteria] = useState(false);
  const [activeEvalField, setActiveEvalField] = useState<string | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  // P1-5: Level progression stats from localStorage
  const [promptStats, setPromptStats] = useState({ totalPrompts: 0, avgScore: 0, totalImages: 0 });
  useEffect(() => {
    try {
      const stored = localStorage.getItem("lince-prompt-stats");
      if (stored) setPromptStats(JSON.parse(stored));
    } catch { /* ignore */ }
  }, []);
  const updatePromptStats = (newScore: number, generatedImg: boolean) => {
    setPromptStats(prev => {
      const newTotal = prev.totalPrompts + 1;
      const newAvg = ((prev.avgScore * prev.totalPrompts) + newScore) / newTotal;
      const newImages = prev.totalImages + (generatedImg ? 1 : 0);
      const updated = { totalPrompts: newTotal, avgScore: Math.round(newAvg), totalImages: newImages };
      localStorage.setItem("lince-prompt-stats", JSON.stringify(updated));
      return updated;
    });
  };
  const { currentLevel } = calculatePromptLevel(promptStats);

  const liveEval = useMemo(() => evaluateLocally({ subject, style, environment, details }), [subject, style, environment, details]);

  // Guest trial system
  const { isGuest, consumeTrial, canUseTrial, setShowConversionModal } = useGuest();

  const createMutation = trpc.promptStudio.create.useMutation({
    onSuccess: (data: any) => {
      if (data?.imageUrl) {
        setGeneratedImage(data.imageUrl);
        setEnhancedPrompt(data.enhancedPrompt || "");
        if (data.breakdown) setBreakdown(data.breakdown);
        updatePromptStats(liveEval.percentage, true);
        // Mark image mission as complete for welcome missions
        try { localStorage.setItem("lince-mission-image", "true"); } catch {}
        toast.success("Imagen generada con éxito — guardada en base de datos");
        setTimeout(() => resultRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }), 300);
      }
    },
    onError: (error: any) => toast.error(`Error: ${error.message}`),
  });

  const previewMutation = trpc.promptStudio.enhancePrompt.useMutation({
    onSuccess: (data: any) => {
      setEnhancedPrompt(data.enhancedPrompt);
      if (data.breakdown) setBreakdown(data.breakdown);
      updatePromptStats(liveEval.percentage, false);
      toast.success("Prompt mejorado por IA — compara con tu input original");
    },
    onError: (error: any) => toast.error(`Error: ${error.message}`),
  });

  const isGenerating = createMutation.isPending;
  const isPreviewing = previewMutation.isPending;
  const isFormValid = subject.trim() && style.trim() && environment.trim();

  const handleGenerate = () => {
    if (!isFormValid) { toast.error("Completa los 3 campos obligatorios"); return; }
    // Guest trial gate: consume 1 trial per image generation
    if (isGuest) {
      if (!canUseTrial()) { setShowConversionModal(true); return; }
      if (!consumeTrial("prompt_studio", subject.trim())) return;
    }
    setGeneratedImage(null);
    setBreakdown(null);
    createMutation.mutate({ subject: subject.trim(), style: style.trim(), environment: environment.trim(), details: details.trim() });
  };

  const handlePreview = () => {
    if (!isFormValid) { toast.error("Completa los 3 campos obligatorios"); return; }
    setBreakdown(null);
    previewMutation.mutate({ subject: subject.trim(), style: style.trim(), environment: environment.trim(), details: details.trim() });
  };

  const handleExample = (ex: typeof EXAMPLE_PROMPTS[0]) => {
    setSubject(ex.subject); setStyle(ex.style); setEnvironment(ex.environment); setDetails(ex.details);
    setEnhancedPrompt(""); setGeneratedImage(null); setBreakdown(null);
  };

  const handleReset = () => {
    setSubject(""); setStyle(""); setEnvironment(""); setDetails("");
    setEnhancedPrompt(""); setGeneratedImage(null); setBreakdown(null);
  };

  const copyPrompt = () => {
    if (enhancedPrompt) { navigator.clipboard.writeText(enhancedPrompt); toast.success("Prompt copiado al portapapeles"); }
  };

  const scoreColor = liveEval.percentage >= 70 ? "#00C853" : liveEval.percentage >= 40 ? "#D4A843" : "#FF5252";

  // Pick a random guide avatar for the hero
  const heroAvatar = AVATAR_GUIDES[0]; // SABELIN — the creative genius

  if (embedded) {
    return (
      <div className="bg-[#0d1219] overflow-y-auto h-full">
        <div className="max-w-4xl mx-auto px-4 sm:px-8 pt-6 pb-20">
          {/* Hero - Grande y claro */}
          <div className="text-center mb-10">
            <div className="flex justify-center mb-4">
              <div className="relative">
                <img src={heroAvatar.img} alt={heroAvatar.name} className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-3" style={{ borderColor: heroAvatar.color }} />
                <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-[#00E5FF] flex items-center justify-center">
                  <Wand2 className="w-4 h-4 text-[#0A0A0A]" />
                </div>
              </div>
            </div>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-white mb-2">
              Crear <span className="text-[#00E5FF]">Imagen</span> con IA
            </h2>
            <p className="text-white/60 text-base sm:text-lg max-w-lg mx-auto leading-relaxed">
              Rellena los <span className="text-[#00E5FF] font-bold">4 pasos</span> y genera tu imagen.
            </p>
          </div>

          {/* Puntuación simplificada - Grande y visual */}
          <div className="mb-10 p-5 sm:p-6 bg-gradient-to-r from-[#00E5FF]/[0.05] to-[#D4A843]/[0.05] border border-white/[0.1] rounded-2xl">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-display font-bold text-white text-lg sm:text-xl flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-[#00E5FF]" />
                Tu puntuación
              </h3>
              <div className="flex items-center gap-3">
                <span className="font-display font-black text-3xl sm:text-4xl" style={{ color: scoreColor }}>{liveEval.percentage}%</span>
                <div className="w-16 h-16 relative">
                  <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                    <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="3.5" />
                    <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke={scoreColor} strokeWidth="3.5" strokeDasharray={`${liveEval.percentage}, 100`} className="transition-all duration-500" />
                  </svg>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {(["subject", "style", "environment", "details"] as const).map((key) => {
                const crit = EVALUATION_CRITERIA[key];
                const score = liveEval.fieldScores[key];
                const pct = score ? Math.round((score.score / crit.maxScore) * 100) : 0;
                return (
                  <div key={key} className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xl">{crit.icon}</span>
                      <span className="text-sm font-bold text-white">{crit.name}</span>
                    </div>
                    <div className="h-3 rounded-full bg-white/[0.08] overflow-hidden mb-1">
                      <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, backgroundColor: crit.color }} />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold" style={{ color: crit.color }}>{score?.score || 0}/{crit.maxScore}</span>
                      {score && (
                        <span className="text-xs font-bold" style={{ color: score.level === 'high' ? '#00C853' : score.level === 'medium' ? '#D4A843' : '#FF5252' }}>
                          {score.level === 'high' ? '\u2705' : score.level === 'medium' ? '\u{1F7E1}' : '\u{1F534}'}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Formulario - Dos columnas en desktop */}
          <div className="grid lg:grid-cols-[1fr_400px] gap-8">
            <div className="space-y-8">
              {/* PASO 1: Sujeto */}
              <div className="p-5 sm:p-6 rounded-2xl bg-white/[0.02] border-2 border-[#00E5FF]/20">
                <label className="flex items-center gap-3 text-white font-display font-bold text-lg sm:text-xl mb-4">
                  <span className="w-10 h-10 rounded-full bg-[#00E5FF]/20 flex items-center justify-center text-[#00E5FF] font-black text-lg">1</span>
                  ¿Qué quieres crear?
                  <span className="text-[#FF5252] text-sm">*</span>
                </label>
                <Input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Ej: Un lince ibérico enseñando IA" 
                  className="bg-white/[0.05] border-2 border-white/[0.15] text-white text-base sm:text-lg placeholder:text-white/30 focus:border-[#00E5FF]/60 h-14 sm:h-16 rounded-xl px-5" maxLength={500} />
                <p className="text-white/40 text-sm mt-2">{subject.length}/500 caracteres</p>
              </div>

              {/* PASO 2: Estilo Visual */}
              <div className="p-5 sm:p-6 rounded-2xl bg-white/[0.02] border-2 border-[#D4A843]/20">
                <label className="flex items-center gap-3 text-white font-display font-bold text-lg sm:text-xl mb-4">
                  <span className="w-10 h-10 rounded-full bg-[#D4A843]/20 flex items-center justify-center text-[#D4A843] font-black text-lg">2</span>
                  Elige un estilo
                  <span className="text-[#FF5252] text-sm">*</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                  {STYLE_OPTIONS.map((opt) => (
                    <button key={opt.value} onClick={() => setStyle(opt.value)}
                      className={`p-4 rounded-xl text-center transition-all border-2 font-semibold ${
                        style === opt.value 
                          ? "bg-[#D4A843]/15 border-[#D4A843] text-[#D4A843] shadow-[0_0_15px_rgba(212,168,67,0.2)]" 
                          : "bg-white/[0.03] border-white/[0.08] text-white/70 hover:border-white/[0.2] hover:bg-white/[0.05]"
                      }`}>
                      <span className="text-2xl sm:text-3xl block mb-2">{opt.icon}</span>
                      <span className="text-xs sm:text-sm block leading-tight">{opt.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* PASO 3: Entorno */}
              <div className="p-5 sm:p-6 rounded-2xl bg-white/[0.02] border-2 border-[#00C853]/20">
                <label className="flex items-center gap-3 text-white font-display font-bold text-lg sm:text-xl mb-4">
                  <span className="w-10 h-10 rounded-full bg-[#00C853]/20 flex items-center justify-center text-[#00C853] font-black text-lg">3</span>
                  Elige un entorno
                  <span className="text-[#FF5252] text-sm">*</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                  {ENVIRONMENT_OPTIONS.map((opt) => (
                    <Tooltip key={opt.value}>
                      <TooltipTrigger asChild>
                        <button onClick={() => setEnvironment(opt.value)}
                          aria-label={`${opt.label}: ${opt.desc}`}
                          className={`group relative rounded-xl text-center transition-all duration-300 border-2 font-semibold overflow-hidden ${
                            environment === opt.value 
                              ? "border-[#00C853] shadow-[0_0_15px_rgba(0,200,83,0.2)] env-card-selected" 
                              : "border-white/[0.08] hover:border-white/[0.2] hover:scale-[1.03]"
                          }`}>
                          <div className="relative w-full aspect-square">
                            <img src={opt.thumb} alt={opt.label} className={`w-full h-full object-cover transition-transform duration-300 ${
                              environment === opt.value ? "scale-105" : "group-hover:scale-110"
                            }`} loading="lazy" />
                            <div className={`absolute inset-0 transition-all duration-300 ${
                              environment === opt.value 
                                ? "bg-[#00C853]/20" 
                                : "bg-black/10 group-hover:bg-black/5"
                            }`} />
                            {environment === opt.value && (
                              <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-[#00C853] flex items-center justify-center shadow-lg env-check-pop">
                                <CheckCircle2 className="w-4 h-4 text-white" />
                              </div>
                            )}
                          </div>
                          <div className={`px-2 py-2.5 transition-all duration-300 ${
                            environment === opt.value ? "bg-[#00C853]/15 text-[#00C853]" : "bg-white/[0.03] text-white/70"
                          }`}>
                            <span className="text-xs sm:text-sm block leading-tight font-semibold">{opt.icon} {opt.label}</span>
                          </div>
                        </button>
                      </TooltipTrigger>
                      <TooltipContent side="bottom" className="max-w-[200px] bg-[#1a1a2e] text-white border border-[#00E5FF]/20 shadow-[0_0_12px_rgba(0,229,255,0.1)] px-3 py-2">
                        <p className="text-xs leading-relaxed">{opt.desc}</p>
                      </TooltipContent>
                    </Tooltip>
                  ))}
                </div>
              </div>

              {/* PASO 4: Detalles */}
              <div className="p-5 sm:p-6 rounded-2xl bg-white/[0.02] border-2 border-[#9C27B0]/20">
                <label className="flex items-center gap-3 text-white font-display font-bold text-lg sm:text-xl mb-4">
                  <span className="w-10 h-10 rounded-full bg-[#9C27B0]/20 flex items-center justify-center text-[#9C27B0] font-black text-lg">4</span>
                  Detalles extra
                  <span className="text-white/40 text-sm ml-1">(opcional)</span>
                </label>
                <Textarea value={details} onChange={(e) => setDetails(e.target.value)} placeholder="Colores, iluminación, estado de ánimo..." 
                  className="bg-white/[0.05] border-2 border-white/[0.15] text-white text-base sm:text-lg placeholder:text-white/30 focus:border-[#9C27B0]/60 min-h-[100px] resize-none rounded-xl px-5 py-4" maxLength={1000} />
              </div>

              {/* Botones de acción - GRANDES */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button onClick={handleGenerate} disabled={!isFormValid || isGenerating}
                  className="flex-1 h-16 sm:h-18 text-lg sm:text-xl bg-[#00E5FF] text-[#0A0A0A] font-display font-black hover:bg-[#00E5FF]/90 shadow-[0_0_30px_rgba(0,229,255,0.3)] disabled:opacity-40 rounded-2xl">
                  {isGenerating ? (<><Loader2 className="w-6 h-6 mr-3 animate-spin" />Generando...</>) : (<><ImageIcon className="w-6 h-6 mr-3" />GENERAR IMAGEN</>)}
                </Button>
                <Button onClick={handlePreview} disabled={!isFormValid || isPreviewing} variant="outline"
                  className="h-16 sm:h-18 text-base sm:text-lg border-2 border-[#D4A843]/40 text-[#D4A843] hover:bg-[#D4A843]/10 font-bold rounded-2xl px-8">
                  {isPreviewing ? (<><Loader2 className="w-5 h-5 mr-2 animate-spin" />Mejorando...</>) : (<><Eye className="w-5 h-5 mr-2" />Ver Prompt</>)}
                </Button>
                <Button onClick={handleReset} variant="outline" className="h-16 sm:h-18 text-base border-2 border-white/15 text-white/50 hover:bg-white/5 rounded-2xl px-6">
                  <RefreshCw className="w-5 h-5 mr-2" /> Limpiar
                </Button>
              </div>
            </div>

            {/* Columna derecha: Resultado */}
            <div className="space-y-4">
              {enhancedPrompt && (
                <div className="p-5 bg-[#D4A843]/5 border border-[#D4A843]/20 rounded-2xl">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-display font-bold text-[#D4A843] text-base flex items-center gap-2"><Wand2 className="w-4 h-4" /> Prompt Mejorado</h4>
                    <button onClick={copyPrompt} className="text-[#B0B0B0] hover:text-white transition-colors p-2"><Copy className="w-5 h-5" /></button>
                  </div>
                  <p className="text-[#B0B0B0] text-sm leading-relaxed">{enhancedPrompt}</p>
                </div>
              )}
              <div ref={resultRef}>
                {isGenerating && (
                  <div className="aspect-square bg-white/[0.02] border-2 border-[#00E5FF]/20 rounded-2xl flex flex-col items-center justify-center gap-4">
                    <div className="relative"><div className="w-16 h-16 rounded-full border-3 border-[#00E5FF]/30 border-t-[#00E5FF] animate-spin" /><Wand2 className="w-7 h-7 text-[#00E5FF] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" /></div>
                    <p className="text-white font-bold text-lg">Generando tu imagen...</p>
                    <p className="text-white/40 text-sm">Esto puede tardar unos segundos</p>
                  </div>
                )}
                {generatedImage && !isGenerating && (
                  <div className="space-y-4">
                    <div className="relative group rounded-2xl overflow-hidden border-2 border-[#00E5FF]/30">
                      <img src={generatedImage} alt="Imagen generada" className="w-full object-contain" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                        <button onClick={async () => { try { const resp = await fetch(generatedImage); const blob = await resp.blob(); const u = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = u; a.download = `lince-ia-${Date.now()}.png`; a.click(); URL.revokeObjectURL(u); } catch { window.open(generatedImage, '_blank'); } }}
                          className="flex items-center gap-2 px-5 py-3 bg-[#00E5FF] text-[#0A0A0A] rounded-xl font-bold text-sm">
                          <Download className="w-5 h-5" /> Descargar imagen
                        </button>
                      </div>
                    </div>
                    <ShareDownloadBar
                      content={{
                        type: "image",
                        url: generatedImage,
                        text: enhancedPrompt || [subject, style, environment, details].filter(Boolean).join(" | "),
                        filename: `lince-ia-${Date.now()}.png`,
                      }}
                      compact
                      className="mt-2"
                    />
                    <div className="flex items-center gap-3 p-4 bg-[#00C853]/5 border border-[#00C853]/20 rounded-xl">
                      <CheckCircle2 className="w-5 h-5 text-[#00C853]" />
                      <p className="text-[#00C853] text-sm font-bold">Imagen generada con sello LINCE IA</p>
                    </div>
                  </div>
                )}
                {!generatedImage && !isGenerating && (
                  <div className="aspect-square bg-white/[0.02] border-2 border-white/[0.08] rounded-2xl flex flex-col items-center justify-center gap-4 border-dashed relative overflow-hidden">
                    {environment ? (
                      <>
                        <img key={environment} src={ENVIRONMENT_OPTIONS.find(e => e.value === environment)?.thumb} alt={ENVIRONMENT_OPTIONS.find(e => e.value === environment)?.label}
                          className="absolute inset-0 w-full h-full object-cover opacity-20 env-thumb-fade" />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A]/90 via-[#0A0A0A]/50 to-transparent" />
                        <div className="relative z-10 flex flex-col items-center gap-3">
                          <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-[#00C853]/30 shadow-[0_0_15px_rgba(0,200,83,0.15)] env-thumb-fade">
                            <img key={`thumb-${environment}`} src={ENVIRONMENT_OPTIONS.find(e => e.value === environment)?.thumb} alt="" className="w-full h-full object-cover" />
                          </div>
                          <p className="text-[#00C853] text-base font-bold text-center">
                            {ENVIRONMENT_OPTIONS.find(e => e.value === environment)?.icon} {ENVIRONMENT_OPTIONS.find(e => e.value === environment)?.label}
                          </p>
                          <p className="text-white/40 text-sm text-center px-6">Completa los campos y pulsa "Generar Imagen"</p>
                        </div>
                      </>
                    ) : (
                      <>
                        <img src={heroAvatar.expressionThinking || heroAvatar.img} alt="" className="w-20 h-20 rounded-full object-cover opacity-30" />
                        <p className="text-white/40 text-base text-center px-6">Tu imagen aparecerá aquí</p>
                        <p className="text-white/25 text-sm text-center px-6">Rellena los 4 pasos y pulsa "Generar Imagen"</p>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#0A0A0A] min-h-screen">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#0A0A0A]/95 backdrop-blur-md border-b border-[#00E5FF]/10">
        <div className="container flex items-center justify-between h-16">
          <a href="/" className="flex items-center gap-1">
            <ArrowLeft className="w-4 h-4 text-[#B0B0B0]" />
            
            <span className="font-display font-bold text-base text-[#00E5FF]">LINCE</span>
          </a>
          <div className="flex items-center gap-3">
            <div className="flex rounded-full border border-white/10 overflow-hidden">
              <span className="px-3 py-1.5 text-xs font-bold text-[#0A0A0A] bg-[#00E5FF]">
                Crear Imagen
              </span>
              <a href="/prompt-profesional"
                className="px-3 py-1.5 text-xs font-medium text-[#B0B0B0] hover:text-white hover:bg-white/5 transition-all">
                Texto Pro
              </a>
            </div>
            <PromptLevelBadge level={currentLevel} size="sm" />
            <a href="/galeria" className="text-[#D4A843] text-xs font-medium px-3 py-1 rounded-full bg-[#D4A843]/10 border border-[#D4A843]/30 hover:bg-[#D4A843]/20 transition-colors">
              Galería
            </a>
            <UserNavBadge variant="compact" />
          </div>
        </div>
      </header>

      <main className="pt-24 pb-16">
        <div className="container max-w-6xl">
          {/* Hero with Avatar Guide */}
          <div className="text-center mb-10">
            <div className="flex justify-center mb-4">
              <div className="relative">
                <img
                  src={heroAvatar.img}
                  alt={heroAvatar.name}
                  className="w-20 h-20 rounded-full object-cover border-2"
                  style={{ borderColor: heroAvatar.color }}
                />
                <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#00E5FF] flex items-center justify-center">
                  <Wand2 className="w-3 h-3 text-[#0A0A0A]" />
                </div>
              </div>
            </div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#00E5FF]/30 bg-[#00E5FF]/5 mb-4">
              <Wand2 className="w-4 h-4 text-[#00E5FF]" />
              <span className="text-[#00E5FF] text-sm font-medium">Generación de Imágenes con IA — Conectado en Vivo</span>
            </div>

            {/* P1-5: Level Progress */}
            <div className="max-w-md mx-auto mb-4">
              <PromptLevelProgress stats={promptStats} lang="es" compact={false} />
            </div>
            <h1 className="font-display font-bold text-4xl sm:text-6xl text-white mb-2">
              IMA<span className="text-[#00E5FF]">GELIN</span>
            </h1>
            <p className="text-base sm:text-lg font-semibold text-white/50 font-display uppercase tracking-widest mb-5">Crea imágenes con IA en 4 pasos</p>
            <p className="text-white/60 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed">
              Crea imágenes con IA rellenando <span className="text-[#00E5FF] font-bold">4 campos simples</span>.
              Evaluación en tiempo real + mejora automática del prompt + generación instantánea.
              <span className="text-[#D4A843] font-medium"> Todo queda guardado en base de datos de forma segura.</span>
            </p>
            {/* Avatar speech bubble */}
            <div className="mt-4 inline-flex items-center gap-3 px-5 py-3 rounded-2xl bg-white/[0.03] border border-[#00E5FF]/15">
              <img src={heroAvatar.expressionHappy || heroAvatar.img} alt="" className="w-10 h-10 rounded-full object-cover" />
              <p className="text-[#B0B0B0] text-sm italic text-left">
                "Yo soy <span className="text-[#00E5FF] font-bold">{heroAvatar.name}</span>, tu guía creativo.
                Rellena los campos y yo te ayudo a crear imágenes increíbles con IA."
              </p>
            </div>
          </div>

          {/* ─── LIVE SCORE DASHBOARD ─── */}
          <div className="mb-8 p-5 bg-gradient-to-r from-[#00E5FF]/[0.03] via-white/[0.01] to-[#D4A843]/[0.03] border border-white/[0.08] rounded-xl">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
              <div className="flex items-center gap-3">
                <BarChart3 className="w-5 h-5 text-[#00E5FF]" />
                <h3 className="font-display font-bold text-white text-sm">Evaluación en Tiempo Real</h3>
                <span className="text-[#B0B0B0]/60 text-xs">(se actualiza mientras escribes)</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-center">
                  <span className="font-display font-bold text-2xl" style={{ color: scoreColor }}>{liveEval.percentage}%</span>
                  <p className="text-[#B0B0B0]/60 text-[10px]">Calidad</p>
                </div>
                <div className="w-16 h-16 relative">
                  <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                    <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="3" />
                    <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke={scoreColor} strokeWidth="3" strokeDasharray={`${liveEval.percentage}, 100`} className="transition-all duration-500" />
                  </svg>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {(["subject", "style", "environment", "details"] as const).map((key) => {
                const crit = EVALUATION_CRITERIA[key];
                const score = liveEval.fieldScores[key];
                return (
                  <div key={key} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium" style={{ color: crit.color }}>{crit.icon} {crit.name}</span>
                      {score && <LevelBadge level={score.level} />}
                    </div>
                    <ScoreBar score={score?.score || 0} max={crit.maxScore} color={crit.color} label="" />
                    {score?.feedback && <p className="text-[#B0B0B0]/60 text-[10px] leading-tight line-clamp-2">{score.feedback}</p>}
                  </div>
                );
              })}
            </div>
          </div>

          {/* ─── EVALUATION CRITERIA ACCORDION ─── */}
          <div className="mb-6">
            <button
              onClick={() => setShowEvalCriteria(!showEvalCriteria)}
              className="w-full flex items-center justify-between p-4 bg-white/[0.02] border border-white/[0.06] rounded-xl hover:border-[#D4A843]/30 transition-all"
            >
              <div className="flex items-center gap-3">
                <Target className="w-5 h-5 text-[#D4A843]" />
                <span className="font-display font-bold text-white text-sm">Parámetros de Evaluación — Cómo se puntúa cada campo</span>
              </div>
              <ChevronDown className={`w-5 h-5 text-[#B0B0B0] transition-transform duration-300 ${showEvalCriteria ? "rotate-180" : ""}`} />
            </button>

            {showEvalCriteria && (
              <div className="mt-2 p-5 bg-white/[0.02] border border-white/[0.06] rounded-xl space-y-4">
                <p className="text-[#B0B0B0] text-sm">
                  Cada campo se evalúa con criterios específicos que suman un total de <span className="text-white font-bold">100 puntos</span>.
                  La evaluación ocurre en tiempo real mientras escribes y también en el servidor al generar.
                </p>
                <div className="grid sm:grid-cols-2 gap-3">
                  {(Object.entries(EVALUATION_CRITERIA) as [string, typeof EVALUATION_CRITERIA.subject][]).map(([key, field]) => (
                    <div key={key}>
                      <button
                        onClick={() => setActiveEvalField(activeEvalField === key ? null : key)}
                        className="w-full flex items-center justify-between p-3 rounded-lg border transition-all"
                        style={{
                          backgroundColor: activeEvalField === key ? `${field.color}08` : "rgba(255,255,255,0.02)",
                          borderColor: activeEvalField === key ? `${field.color}40` : "rgba(255,255,255,0.06)",
                        }}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{field.icon}</span>
                          <span className="font-display font-bold text-sm" style={{ color: field.color }}>{field.name}</span>
                          <span className="text-[#B0B0B0]/60 text-xs">({field.maxScore} pts)</span>
                        </div>
                        <ChevronRight className={`w-4 h-4 text-[#B0B0B0] transition-transform ${activeEvalField === key ? "rotate-90" : ""}`} />
                      </button>
                      {activeEvalField === key && (
                        <div className="mt-1 p-3 space-y-2 bg-white/[0.01] rounded-lg border border-white/[0.04]">
                          {field.criteria.map((c, i) => (
                            <div key={i} className="flex items-start gap-2">
                              <span className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: field.color }} />
                              <div>
                                <p className="text-white text-xs font-medium">{c.name} <span className="text-[#B0B0B0]/40">({c.weight} pts)</span></p>
                                <p className="text-[#B0B0B0]/70 text-[11px] leading-relaxed">{c.description}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <div className="p-3 bg-[#00E5FF]/5 border border-[#00E5FF]/20 rounded-lg">
                  <p className="text-[#00E5FF] text-xs font-bold flex items-center gap-1.5"><Shield className="w-3.5 h-3.5" /> Seguridad</p>
                  <p className="text-[#B0B0B0] text-xs mt-1">
                    Todos los inputs se sanitizan (se eliminan HTML, scripts, caracteres de control).
                    Rate limiting activo: máx. 5 generaciones/min y 15 previews/min.
                    Todo se guarda en base de datos con trazabilidad completa.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* ─── METHODOLOGY ACCORDION ─── */}
          <div className="mb-8">
            <button
              onClick={() => setShowMethodology(!showMethodology)}
              className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-[#00E5FF]/5 via-[#9C27B0]/5 to-[#D4A843]/5 border border-[#00E5FF]/20 rounded-xl hover:border-[#00E5FF]/40 transition-all"
            >
              <div className="flex items-center gap-3">
                <Lightbulb className="w-5 h-5 text-[#D4A843]" />
                <span className="font-display font-bold text-white text-sm">Metodología: Cómo crear prompts efectivos</span>
              </div>
              <ChevronDown className={`w-5 h-5 text-[#B0B0B0] transition-transform duration-300 ${showMethodology ? "rotate-180" : ""}`} />
            </button>

            {showMethodology && (
              <div className="mt-2 p-6 bg-white/[0.02] border border-white/[0.06] rounded-xl space-y-6">
                <p className="text-[#B0B0B0] text-sm leading-relaxed">
                  Simplificamos la creación de prompts profesionales en solo 4 pasos.
                  No necesitas ser experto — nuestra IA hace el trabajo pesado.
                </p>
                <div className="grid sm:grid-cols-2 gap-4">
                  {[
                    { num: "1", title: "SUJETO", color: "#00E5FF", text: "¿Qué quieres crear? Describe el elemento principal. Sé específico: 'un lince con gafas de sol' > 'un animal'." },
                    { num: "2", title: "ESTILO", color: "#D4A843", text: "¿Cómo quieres que se vea? Elige un estilo visual: realista, cartoon, acuarela, 3D, pixel art, cyberpunk, anime, etc." },
                    { num: "3", title: "ENTORNO", color: "#00C853", text: "¿Dónde ocurre la escena? Define el ambiente: estudio, naturaleza, ciudad, espacio, fantasía, interior moderno, etc." },
                    { num: "4", title: "DETALLES", color: "#9C27B0", text: "Añade extras: colores específicos, estado de ánimo, iluminación, elementos adicionales. Opcional pero mejora mucho el resultado." },
                  ].map((step) => (
                    <div key={step.num} className="p-4 rounded-lg" style={{ backgroundColor: `${step.color}08`, border: `1px solid ${step.color}20` }}>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="w-7 h-7 rounded-full flex items-center justify-center font-bold text-sm" style={{ backgroundColor: `${step.color}20`, color: step.color }}>{step.num}</span>
                        <h4 className="font-display font-bold text-white text-sm">{step.title}</h4>
                      </div>
                      <p className="text-[#B0B0B0] text-xs">{step.text}</p>
                    </div>
                  ))}
                </div>
                <div className="p-4 bg-[#00E5FF]/5 border border-[#00E5FF]/20 rounded-lg">
                  <p className="text-[#00E5FF] text-xs font-bold mb-1 flex items-center gap-1.5"><Zap className="w-3.5 h-3.5" /> ¿Qué hace la IA con tus 4 campos?</p>
                  <p className="text-[#B0B0B0] text-xs">
                    Nuestra IA toma tus 4 inputs simples y los transforma en un prompt profesional extremadamente detallado,
                    añadiendo términos técnicos de composición, iluminación, calidad y estilo artístico.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* ─── AVATAR-DRIVEN EXAMPLES ─── */}
          <div className="mb-8">
            <h3 className="font-display font-semibold text-white text-sm mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#D4A843]" />
              La familia LINCE te muestra ejemplos — haz clic para probar
            </h3>
            <div className="grid sm:grid-cols-3 gap-3">
              {EXAMPLE_PROMPTS.map((ex, i) => (
                <button key={i} onClick={() => handleExample(ex)}
                  className="text-left p-4 bg-white/[0.03] border border-white/[0.06] rounded-xl hover:border-white/[0.2] transition-all group">
                  {/* Avatar + Speech */}
                  <div className="flex items-start gap-3 mb-3">
                    <img
                      src={ex.avatar.img}
                      alt={ex.avatar.name}
                      className="w-12 h-12 rounded-full object-cover border-2 flex-shrink-0 group-hover:scale-105 transition-transform"
                      style={{ borderColor: ex.avatar.color }}
                    />
                    <div>
                      <p className="text-xs font-bold" style={{ color: ex.avatar.color }}>{ex.avatar.name}</p>
                      <p className="text-[#B0B0B0] text-[11px] italic leading-snug mt-0.5">"{ex.quote}"</p>
                    </div>
                  </div>
                  {/* Prompt preview */}
                  <p className="text-white text-xs font-medium mb-1 group-hover:text-[#00E5FF] transition-colors line-clamp-2">{ex.subject}</p>
                  <p className="text-[#B0B0B0] text-[10px]">{STYLE_OPTIONS.find(s => s.value === ex.style)?.label} · {ENVIRONMENT_OPTIONS.find(e => e.value === ex.environment)?.label}</p>
                </button>
              ))}
            </div>
          </div>

          {/* ─── FORM + PREVIEW ─── */}
          <div className="grid lg:grid-cols-[1fr_420px] gap-8">
            {/* Left: Form */}
            <div className="space-y-6">
              {/* Field 1: Subject */}
              <div>
                <label className="flex items-center gap-2 text-white font-display font-bold text-base sm:text-lg mb-3">
                  <FileText className="w-5 h-5 text-[#00E5FF]" />
                  <span className="text-[#00E5FF] text-xl font-black">1.</span> ¿Qué quieres crear?
                  <span className="text-[#FF5252] text-sm">*</span>
                  {liveEval.fieldScores.subject && <LevelBadge level={liveEval.fieldScores.subject.level} />}
                </label>
                <Input
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Ej: Un lince ibérico enseñando inteligencia artificial a estudiantes universitarios"
                  className="bg-white/[0.04] border-2 border-white/[0.1] text-white text-base placeholder:text-white/30 focus:border-[#00E5FF]/50 h-14 rounded-xl"
                  maxLength={500}
                />
                <div className="flex items-center justify-between mt-2">
                  <p className="text-white/30 text-xs">{subject.length}/500 — Sé específico para mejores resultados</p>
                  {liveEval.fieldScores.subject?.feedback && subject.length > 0 && (
                    <p className="text-[#B0B0B0]/60 text-[10px] max-w-[60%] text-right">{liveEval.fieldScores.subject.feedback}</p>
                  )}
                </div>
              </div>

              {/* Field 2: Style */}
              <div>
                <label className="flex items-center gap-2 text-white font-display font-bold text-base sm:text-lg mb-3">
                  <Palette className="w-5 h-5 text-[#D4A843]" />
                  <span className="text-[#D4A843] text-xl font-black">2.</span> Estilo Visual
                  <span className="text-[#FF5252] text-sm">*</span>
                  {liveEval.fieldScores.style && style && <LevelBadge level={liveEval.fieldScores.style.level} />}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                  {STYLE_OPTIONS.map((opt) => (
                    <button key={opt.value} onClick={() => setStyle(opt.value)}
                      className={`p-3 sm:p-3.5 rounded-xl text-center transition-all border-2 text-sm font-semibold ${
                        style === opt.value
                          ? "bg-[#D4A843]/15 border-[#D4A843]/50 text-[#D4A843]"
                          : "bg-white/[0.02] border-white/[0.06] text-[#B0B0B0] hover:border-white/[0.15] hover:text-white"
                      }`}>
                      <span className="text-lg block mb-1">{opt.icon}</span>
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Field 3: Environment */}
              <div>
                <label className="flex items-center gap-2 text-white font-display font-bold text-base sm:text-lg mb-3">
                  <MapPin className="w-5 h-5 text-[#00C853]" />
                  <span className="text-[#00C853] text-xl font-black">3.</span> Entorno / Escenario
                  <span className="text-[#FF5252] text-sm">*</span>
                  {liveEval.fieldScores.environment && environment && <LevelBadge level={liveEval.fieldScores.environment.level} />}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                  {ENVIRONMENT_OPTIONS.map((opt) => (
                    <Tooltip key={opt.value}>
                      <TooltipTrigger asChild>
                        <button onClick={() => setEnvironment(opt.value)}
                          aria-label={`${opt.label}: ${opt.desc}`}
                          className={`group relative rounded-xl text-center transition-all duration-300 border-2 font-semibold overflow-hidden ${
                            environment === opt.value
                              ? "border-[#00C853]/50 shadow-[0_0_12px_rgba(0,200,83,0.15)] env-card-selected"
                              : "border-white/[0.06] hover:border-white/[0.15] hover:scale-[1.03]"
                          }`}>
                          <div className="relative w-full aspect-[4/3]">
                            <img src={opt.thumb} alt={opt.label} className={`w-full h-full object-cover transition-transform duration-300 ${
                              environment === opt.value ? "scale-105" : "group-hover:scale-110"
                            }`} loading="lazy" />
                            <div className={`absolute inset-0 transition-all duration-300 ${
                              environment === opt.value
                                ? "bg-[#00C853]/20"
                                : "bg-black/10 group-hover:bg-black/5"
                            }`} />
                            {environment === opt.value && (
                              <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-[#00C853] flex items-center justify-center env-check-pop">
                                <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                              </div>
                            )}
                          </div>
                          <div className={`px-2 py-2 text-sm transition-all duration-300 ${
                            environment === opt.value ? "bg-[#00C853]/15 text-[#00C853]" : "bg-white/[0.02] text-[#B0B0B0]"
                          }`}>
                            <span className="text-xs block leading-tight font-semibold">{opt.icon} {opt.label}</span>
                          </div>
                        </button>
                      </TooltipTrigger>
                      <TooltipContent side="bottom" className="max-w-[200px] bg-[#1a1a2e] text-white border border-[#00E5FF]/20 shadow-[0_0_12px_rgba(0,229,255,0.1)] px-3 py-2">
                        <p className="text-xs leading-relaxed">{opt.desc}</p>
                      </TooltipContent>
                    </Tooltip>
                  ))}
                </div>
              </div>

              {/* Field 4: Details */}
              <div>
                <label className="flex items-center gap-2 text-white font-display font-bold text-base sm:text-lg mb-3">
                  <Sparkles className="w-5 h-5 text-[#9C27B0]" />
                  <span className="text-[#9C27B0] text-xl font-black">4.</span> Detalles Adicionales
                  <span className="text-white/40 text-sm font-normal">(opcional)</span>
                  {liveEval.fieldScores.details && details && <LevelBadge level={liveEval.fieldScores.details.level} />}
                </label>
                <Textarea
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder="Ej: Colores neón cyan y dorado, hologramas flotantes, iluminación volumétrica dramática, composición centrada..."
                  className="bg-white/[0.04] border-2 border-white/[0.1] text-white text-base placeholder:text-white/30 focus:border-[#9C27B0]/50 min-h-[100px] resize-none rounded-xl"
                  maxLength={1000}
                />
                <div className="flex items-center justify-between mt-2">
                  <p className="text-white/30 text-xs">{details.length}/1000</p>
                  {liveEval.fieldScores.details?.feedback && details.length > 0 && (
                    <p className="text-[#B0B0B0]/60 text-[10px] max-w-[60%] text-right">{liveEval.fieldScores.details.feedback}</p>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Button onClick={handleGenerate} disabled={!isFormValid || isGenerating}
                  className="flex-1 h-14 text-base bg-[#00E5FF] text-[#0A0A0A] font-display font-black hover:bg-[#00E5FF]/90 shadow-[0_0_20px_rgba(0,229,255,0.3)] disabled:opacity-40 rounded-xl">
                  {isGenerating ? (<><Loader2 className="w-5 h-5 mr-2 animate-spin" />Generando imagen...</>) : (<><ImageIcon className="w-5 h-5 mr-2" />Generar Imagen con IA</>)}
                </Button>
                <Button onClick={handlePreview} disabled={!isFormValid || isPreviewing} variant="outline"
                  className="h-14 text-base border-2 border-[#D4A843]/30 text-[#D4A843] hover:bg-[#D4A843]/10 font-display font-bold rounded-xl">
                  {isPreviewing ? (<><Loader2 className="w-5 h-5 mr-2 animate-spin" />Mejorando...</>) : (<><Eye className="w-5 h-5 mr-2" />Ver Prompt Mejorado</>)}
                </Button>
                <Button onClick={handleReset} variant="outline" className="h-14 text-base border-2 border-white/10 text-white/50 hover:bg-white/5 rounded-xl">
                  <RefreshCw className="w-5 h-5 mr-2" />Limpiar
                </Button>
              </div>
            </div>

            {/* Right: Preview Panel */}
            <div className="space-y-4">
              {/* Enhanced Prompt Preview */}
              {enhancedPrompt && (
                <div className="p-4 bg-[#D4A843]/5 border border-[#D4A843]/20 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-display font-bold text-[#D4A843] text-sm flex items-center gap-2">
                      <Wand2 className="w-4 h-4" /> Prompt Mejorado por IA
                    </h4>
                    <button onClick={copyPrompt} className="text-[#B0B0B0] hover:text-white transition-colors" title="Copiar prompt">
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-[#B0B0B0] text-xs leading-relaxed font-mono">{enhancedPrompt}</p>
                </div>
              )}

              {/* AI Breakdown */}
              {breakdown && (
                <div className="p-4 bg-[#9C27B0]/5 border border-[#9C27B0]/20 rounded-xl">
                  <h4 className="font-display font-bold text-[#9C27B0] text-sm flex items-center gap-2 mb-3">
                    <Zap className="w-4 h-4" /> Desglose de la Mejora IA
                  </h4>
                  <div className="space-y-2">
                    {[
                      { label: "Composición", value: breakdown.composition, color: "#00E5FF" },
                      { label: "Iluminación", value: breakdown.lighting, color: "#D4A843" },
                      { label: "Paleta de Color", value: breakdown.colorPalette, color: "#00C853" },
                      { label: "Términos Técnicos", value: breakdown.technicalTerms, color: "#FF5252" },
                      { label: "Referencias Artísticas", value: breakdown.artisticReferences, color: "#9C27B0" },
                    ].map((item) => (
                      item.value && item.value !== "N/A" && item.value !== "Auto-detected" ? (
                        <div key={item.label} className="flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: item.color }} />
                          <div>
                            <span className="text-white text-[11px] font-medium">{item.label}:</span>
                            <span className="text-[#B0B0B0] text-[11px] ml-1">{item.value}</span>
                          </div>
                        </div>
                      ) : null
                    ))}
                  </div>
                </div>
              )}

              {/* Generated Image */}
              <div ref={resultRef}>
                {isGenerating && (
                  <div className="aspect-square bg-white/[0.02] border border-[#00E5FF]/20 rounded-xl flex flex-col items-center justify-center gap-4">
                    <div className="relative">
                      <div className="w-16 h-16 rounded-full border-2 border-[#00E5FF]/30 border-t-[#00E5FF] animate-spin" />
                      <Wand2 className="w-6 h-6 text-[#00E5FF] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                    </div>
                    <div className="text-center">
                      <p className="text-white font-display font-bold text-sm">Generando tu imagen...</p>
                      <p className="text-[#B0B0B0] text-xs mt-1">La IA está mejorando tu prompt y creando la imagen</p>
                      <p className="text-[#00E5FF]/60 text-[10px] mt-2">Guardando en base de datos de forma segura</p>
                    </div>
                  </div>
                )}

                {generatedImage && !isGenerating && (
                  <div className="space-y-3">
                    <div className="relative group rounded-xl overflow-hidden border border-[#00E5FF]/30">
                      <img src={generatedImage} alt="Imagen generada por IA" className="w-full object-contain" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                        <button
                          onClick={async () => {
                            try {
                              const resp = await fetch(generatedImage);
                              const blob = await resp.blob();
                              const img = new Image(); img.crossOrigin = 'anonymous';
                              img.onload = () => {
                                const c = document.createElement('canvas'); c.width = img.width; c.height = img.height;
                                const cx = c.getContext('2d'); if (!cx) return;
                                cx.drawImage(img, 0, 0);
                                const sh = Math.max(36, img.height * 0.06);
                                cx.fillStyle = 'rgba(0,0,0,0.55)'; cx.fillRect(0, img.height - sh, img.width, sh);
                                const fs = Math.max(14, Math.min(24, img.width * 0.028));
                                cx.font = `bold ${fs}px 'Space Grotesk', sans-serif`; cx.textBaseline = 'middle';
                                const ym = img.height - sh / 2;
                                cx.fillStyle = '#00E5FF'; cx.textAlign = 'left'; cx.fillText('LINCE IA', 12, ym);
                                cx.fillStyle = 'rgba(255,255,255,0.6)'; cx.textAlign = 'right'; cx.font = `${fs*0.8}px 'Space Grotesk', sans-serif`; cx.fillText('lince.app', img.width - 12, ym);
                                c.toBlob((b) => { if (!b) return; const u = URL.createObjectURL(b); const a = document.createElement('a'); a.href = u; a.download = `lince-ia-${Date.now()}.png`; a.click(); URL.revokeObjectURL(u); }, 'image/png');
                              };
                              img.src = URL.createObjectURL(blob);
                            } catch { /* fallback */ window.open(generatedImage, '_blank'); }
                          }}
                          className="flex items-center gap-2 px-4 py-2 bg-[#00E5FF] text-[#0A0A0A] rounded-lg font-bold text-xs cursor-pointer">
                          <Download className="w-4 h-4" /> Descargar PNG
                        </button>
                      </div>
                    </div>
                    {/* Share/Download bar */}
                    <ShareDownloadBar
                      content={{
                        type: "image",
                        url: generatedImage,
                        text: enhancedPrompt || [subject, style, environment, details].filter(Boolean).join(" | "),
                        filename: `lince-ia-${Date.now()}.png`,
                        recommendedTool: { id: "midjourney", name: "Midjourney", why: "Lleva tu imagen al siguiente nivel" },
                      }}
                      className="mt-3"
                    />
                    {/* Avatar celebration */}
                    <div className="flex items-center gap-3 p-3 bg-[#00C853]/5 border border-[#00C853]/15 rounded-lg">
                      <img src={heroAvatar.expressionHappy || heroAvatar.img} alt="" className="w-8 h-8 rounded-full object-cover" />
                      <div>
                        <p className="text-[#00C853] text-xs font-bold flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> Imagen generada y guardada</p>
                        <p className="text-[#B0B0B0] text-[10px]">{heroAvatar.name}: "¡Quedó genial! Puedes descargarla o generar otra."</p>
                      </div>
                    </div>
                  </div>
                )}

                {!generatedImage && !isGenerating && (
                  <div className="aspect-square bg-white/[0.02] border border-white/[0.06] rounded-xl flex flex-col items-center justify-center gap-3 border-dashed relative overflow-hidden">
                    {environment ? (
                      <>
                        <img key={environment} src={ENVIRONMENT_OPTIONS.find(e => e.value === environment)?.thumb} alt={ENVIRONMENT_OPTIONS.find(e => e.value === environment)?.label}
                          className="absolute inset-0 w-full h-full object-cover opacity-15 env-thumb-fade" />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A]/90 via-[#0A0A0A]/50 to-transparent" />
                        <div className="relative z-10 flex flex-col items-center gap-2">
                          <div className="w-14 h-14 rounded-xl overflow-hidden border-2 border-[#00C853]/30 shadow-[0_0_12px_rgba(0,200,83,0.1)] env-thumb-fade">
                            <img key={`thumb-${environment}`} src={ENVIRONMENT_OPTIONS.find(e => e.value === environment)?.thumb} alt="" className="w-full h-full object-cover" />
                          </div>
                          <p className="text-[#00C853] text-sm font-bold text-center">
                            {ENVIRONMENT_OPTIONS.find(e => e.value === environment)?.icon} {ENVIRONMENT_OPTIONS.find(e => e.value === environment)?.label}
                          </p>
                          <p className="text-white/35 text-[10px] text-center px-4">Completa los campos y pulsa "Generar Imagen con IA"</p>
                        </div>
                      </>
                    ) : (
                      <>
                        <img src={heroAvatar.expressionThinking || heroAvatar.img} alt="" className="w-16 h-16 rounded-full object-cover opacity-30" />
                        <p className="text-[#B0B0B0]/40 text-sm text-center px-4">Tu imagen generada aparecerá aquí</p>
                        <p className="text-[#B0B0B0]/30 text-[10px] text-center px-4">Rellena los campos y haz clic en "Generar Imagen con IA"</p>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Prompt Summary */}
              <div className="p-4 bg-white/[0.02] border border-white/[0.06] rounded-xl">
                <h4 className="font-display font-bold text-white text-xs mb-3 flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-[#00E5FF]" /> Resumen de tu Prompt
                </h4>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-[#B0B0B0]">Sujeto:</span>
                    <span className="text-white font-medium truncate ml-2 max-w-[220px]">{subject || "—"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#B0B0B0]">Estilo:</span>
                    <span className="text-[#D4A843] font-medium">{STYLE_OPTIONS.find(s => s.value === style)?.label || "—"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#B0B0B0]">Entorno:</span>
                    <span className="text-[#00C853] font-medium">{ENVIRONMENT_OPTIONS.find(e => e.value === environment)?.label || "—"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#B0B0B0]">Detalles:</span>
                    <span className="text-[#9C27B0] font-medium">{details ? `${details.length} chars` : "—"}</span>
                  </div>
                  <div className="pt-2 mt-2 border-t border-white/[0.06] flex justify-between">
                    <span className="text-[#B0B0B0]">Puntuación:</span>
                    <span className="font-display font-bold" style={{ color: scoreColor }}>{liveEval.percentage}/100</span>
                  </div>
                </div>
              </div>

              {/* Security badge */}
              <div className="p-3 bg-[#00C853]/5 border border-[#00C853]/15 rounded-lg flex items-center gap-2">
                <Shield className="w-4 h-4 text-[#00C853] flex-shrink-0" />
                <p className="text-[#B0B0B0] text-[10px]">
                  <span className="text-[#00C853] font-bold">Seguro:</span> Inputs sanitizados, rate limiting activo, todo guardado en BD con trazabilidad completa.
                </p>
              </div>
            </div>
          </div>

          {/* Footer CTA */}
          <div className="mt-16 text-center">
            <div className="inline-block p-8 rounded-2xl bg-gradient-to-b from-[#00E5FF]/[0.04] to-transparent border border-[#00E5FF]/10">
              <p className="font-display text-xl text-white font-medium mb-2">¿Quieres ver todas las creaciones?</p>
              <p className="text-[#B0B0B0] text-sm mb-4">Explora la galería de imágenes generadas por la comunidad LINCE</p>
              <a href="/galeria" className="inline-flex items-center gap-2 px-6 py-3 bg-[#D4A843] text-[#0A0A0A] rounded-xl font-display font-bold text-sm hover:bg-[#D4A843]/90 transition-colors">
                <ImageIcon className="w-4 h-4" /> Ver Galería
              </a>
            </div>
          </div>
        </div>

        {/* P2-9: Next Step Footer */}
        <NextStepFooter currentPath="/prompt-studio" />
      </main>
    </div>
  );
}

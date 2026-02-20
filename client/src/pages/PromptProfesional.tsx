import { useState, useMemo } from "react";
import { trpc } from "@/lib/trpc";
import { useGuest } from "@/contexts/GuestContext";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  Wand2,
  Sparkles,
  ArrowLeft,
  Loader2,
  Copy,
  RefreshCw,
  Shield,
  Zap,
  Target,
  CheckCircle2,
  Lightbulb,
  ChevronDown,
  Brain,
  FileText,
  MessageSquare,
  BookOpen,
  Briefcase,
  Code,
  PenTool,
  Users,
  TrendingUp,
  Star,
} from "lucide-react";
import { AVATAR_FRONTAL, AVATAR_EXPRESSIONS } from "@/lib/avatarConstants";
import { UserNavBadge } from "@/components/UserNavBadge";
import { GlobalNavBar } from "@/components/GlobalNavBar";
import { BackButton } from "@/components/BackButton";

// ─── Avatar Guides for Professional Mode ───
const PRO_AVATARS = [
  { name: "YAYALIN", role: "El Abuelo Sabio", specialty: "Estrategia y Dirección", img: AVATAR_FRONTAL.YAYALIN, expr: AVATAR_EXPRESSIONS.YAYALIN, color: "#00E5FF" },
  { name: "MAMALINA", role: "La Mamá Artista", specialty: "Creatividad y Contenido", img: AVATAR_FRONTAL.MAMALINA, expr: AVATAR_EXPRESSIONS.MAMALINA, color: "#D4A843" },
  { name: "PAPALIN", role: "El Papá Ingeniero", specialty: "Código y Tecnología", img: AVATAR_FRONTAL.LINCE, expr: AVATAR_EXPRESSIONS.LINCE, color: "#00C853" },
  { name: "CHAVALIN", role: "El Hijo Mayor", specialty: "Marketing y Análisis", img: AVATAR_FRONTAL.CHAVALIN, expr: AVATAR_EXPRESSIONS.CHAVALIN, color: "#FF5252" },
  { name: "CHAVALINA", role: "La Hija Mayor", specialty: "RRHH y Comunicación", img: AVATAR_FRONTAL.CHAVALINA, expr: AVATAR_EXPRESSIONS.CHAVALINA, color: "#9C27B0" },
  { name: "SABELIN", role: "El Genio Creativo", specialty: "Formación y Educación", img: AVATAR_FRONTAL.SABELIN, expr: AVATAR_EXPRESSIONS.SABELIN, color: "#00BCD4" },
];

// ─── Professional Templates ───
const PRO_TEMPLATES = [
  {
    name: "Email Profesional",
    icon: <MessageSquare className="w-4 h-4" />,
    avatarIdx: 0,
    quote: "En mis años de experiencia, un buen email abre más puertas que mil llamadas.",
    role: "Redactor de comunicaciones corporativas con 10 años de experiencia en empresas tecnológicas",
    task: "Escribe un email profesional para presentar una propuesta de colaboración a un potencial socio estratégico",
    format: "Email formal pero cercano, máximo 200 palabras, con asunto, saludo, 3 párrafos y despedida",
    example: "",
  },
  {
    name: "Plan de Clase IA",
    icon: <BookOpen className="w-4 h-4" />,
    avatarIdx: 5,
    quote: "¡Yo diseño los cursos de 7 horas! Cada bloque tiene un objetivo medible.",
    role: "Formador especializado en inteligencia artificial para profesionales no técnicos",
    task: "Diseña un plan de clase de 7 horas sobre IA generativa aplicada al marketing digital, con objetivos medibles",
    format: "Estructura: Objetivos, 7 bloques de 1h, actividades prácticas por bloque, evaluación final. Tono didáctico y motivador",
    example: "Bloque 1 (1h): Qué es la IA generativa — Objetivo: El alumno identifica 5 herramientas de IA generativa y su aplicación en marketing",
  },
  {
    name: "Análisis de Mercado",
    icon: <TrendingUp className="w-4 h-4" />,
    avatarIdx: 3,
    quote: "Los datos no mienten. Dame los números y te doy la estrategia.",
    role: "Analista de mercado senior especializado en apps educativas en Europa",
    task: "Analiza el mercado de formación en IA para PYMES en España: tamaño, competidores, oportunidades y barreras de entrada",
    format: "Informe ejecutivo con datos verificables, tablas comparativas, conclusiones accionables. Máximo 1500 palabras",
    example: "",
  },
  {
    name: "Código con IA",
    icon: <Code className="w-4 h-4" />,
    avatarIdx: 2,
    quote: "El código limpio es poesía. Déjame mostrarte cómo pedirle a la IA que lo escriba.",
    role: "Desarrollador senior full-stack con experiencia en React, Node.js y bases de datos SQL",
    task: "Crea una función que valide y sanitice inputs de usuario para prevenir inyección SQL y XSS",
    format: "Código TypeScript comentado, con tests unitarios, manejo de errores y documentación JSDoc",
    example: "function sanitize(input: string): string { // eliminar tags HTML, scripts, caracteres de control... }",
  },
  {
    name: "Contenido Creativo",
    icon: <PenTool className="w-4 h-4" />,
    avatarIdx: 1,
    quote: "Las palabras tienen poder. Yo te enseño a crear textos que enamoren.",
    role: "Copywriter creativo especializado en storytelling para marcas de tecnología",
    task: "Escribe el copy para una landing page de una app para aprender IA jugando",
    format: "Hero section (título + subtítulo + CTA), 3 secciones de beneficios, testimonial ficticio, CTA final. Tono inspirador pero no exagerado",
    example: "",
  },
  {
    name: "RRHH / Selección",
    icon: <Users className="w-4 h-4" />,
    avatarIdx: 4,
    quote: "Encontrar al talento correcto es un arte. La IA nos ayuda a no perder a nadie.",
    role: "Director de Recursos Humanos con experiencia en selección de perfiles tecnológicos",
    task: "Redacta una oferta de empleo para un Especialista en IA Aplicada que formará a equipos comerciales de PYMES",
    format: "Estructura: Sobre nosotros, Responsabilidades (5-7), Requisitos (must/nice-to-have), Beneficios, Proceso de selección",
    example: "",
  },
];

// ─── Format + Tone quick options ───
const FORMAT_OPTIONS = [
  { value: "informe", label: "Informe ejecutivo", icon: "📊" },
  { value: "email", label: "Email profesional", icon: "📧" },
  { value: "lista", label: "Lista estructurada", icon: "📋" },
  { value: "narrativa", label: "Narrativa / Story", icon: "📖" },
  { value: "codigo", label: "Código técnico", icon: "💻" },
  { value: "tabla", label: "Tabla comparativa", icon: "📐" },
  { value: "plan", label: "Plan de acción", icon: "🎯" },
  { value: "presentacion", label: "Presentación / Pitch", icon: "🎤" },
];

const TONE_OPTIONS = [
  { value: "formal", label: "Formal", icon: "👔" },
  { value: "cercano", label: "Cercano", icon: "🤝" },
  { value: "tecnico", label: "Técnico", icon: "🔬" },
  { value: "persuasivo", label: "Persuasivo", icon: "💡" },
  { value: "didactico", label: "Didáctico", icon: "📚" },
  { value: "directo", label: "Directo", icon: "🎯" },
];

// ─── Client-side quick score ───
function quickScore(role: string, task: string, format: string, example: string) {
  let score = 0;
  // Role (0-25)
  if (role.length > 50) score += 25;
  else if (role.length > 20) score += 15;
  else if (role.length > 0) score += 8;
  // Task (0-35)
  if (task.length > 100) score += 35;
  else if (task.length > 40) score += 22;
  else if (task.length > 0) score += 10;
  // Format (0-25)
  if (format.length > 30) score += 25;
  else if (format.length > 10) score += 15;
  else if (format.length > 0) score += 8;
  // Example (0-15)
  if (example.length > 50) score += 15;
  else if (example.length > 10) score += 8;
  return Math.min(score, 100);
}

export default function PromptProfesional() {
  const [role, setRole] = useState("");
  const [task, setTask] = useState("");
  const [selectedFormat, setSelectedFormat] = useState("");
  const [selectedTone, setSelectedTone] = useState("");
  const [formatCustom, setFormatCustom] = useState("");
  const [example, setExample] = useState("");
  const [enhancedPrompt, setEnhancedPrompt] = useState("");
  const [aiScore, setAiScore] = useState<number | null>(null);
  const [tips, setTips] = useState<string[]>([]);
  const [technique, setTechnique] = useState("");
  const [showMethodology, setShowMethodology] = useState(false);

  // Build the combined format string
  const formatString = useMemo(() => {
    const parts: string[] = [];
    if (selectedFormat) {
      const opt = FORMAT_OPTIONS.find(f => f.value === selectedFormat);
      if (opt) parts.push(`Formato: ${opt.label}`);
    }
    if (selectedTone) {
      const opt = TONE_OPTIONS.find(t => t.value === selectedTone);
      if (opt) parts.push(`Tono: ${opt.label}`);
    }
    if (formatCustom.trim()) parts.push(formatCustom.trim());
    return parts.join(". ");
  }, [selectedFormat, selectedTone, formatCustom]);

  const localScore = useMemo(() => quickScore(role, task, formatString, example), [role, task, formatString, example]);
  const scoreColor = localScore >= 70 ? "#00C853" : localScore >= 40 ? "#D4A843" : "#FF5252";

  const isFormValid = role.trim().length > 0 && task.trim().length > 0 && formatString.trim().length > 0;

  // tRPC mutation
  const enhanceMutation = trpc.promptStudio.enhanceTextPrompt.useMutation({
    onSuccess: (data: any) => {
      setEnhancedPrompt(data.enhancedPrompt);
      setAiScore(data.score);
      setTips(data.tips || []);
      setTechnique(data.technique || "");
      toast.success("Prompt profesional generado con las 6 técnicas de Anthropic");
    },
    onError: (error: any) => toast.error(`Error: ${error.message}`),
  });

  // Guest trial system
  const { isGuest, consumeTrial, canUseTrial, setShowConversionModal } = useGuest();

  const handleGenerate = () => {
    if (!isFormValid) { toast.error("Completa los 3 campos obligatorios"); return; }
    // Guest trial gate
    if (isGuest) {
      if (!canUseTrial()) { setShowConversionModal(true); return; }
      if (!consumeTrial("prompt_profesional", role.trim())) return;
    }
    setEnhancedPrompt("");
    setAiScore(null);
    setTips([]);
    setTechnique("");
    enhanceMutation.mutate({
      role: role.trim(),
      task: task.trim(),
      format: formatString.trim(),
      example: example.trim(),
    });
  };

  const handleTemplate = (tpl: typeof PRO_TEMPLATES[0]) => {
    setRole(tpl.role);
    setTask(tpl.task);
    setFormatCustom(tpl.format);
    setSelectedFormat("");
    setSelectedTone("");
    setExample(tpl.example);
    setEnhancedPrompt("");
    setAiScore(null);
    setTips([]);
    setTechnique("");
  };

  const handleReset = () => {
    setRole(""); setTask(""); setSelectedFormat(""); setSelectedTone(""); setFormatCustom(""); setExample("");
    setEnhancedPrompt(""); setAiScore(null); setTips([]); setTechnique("");
  };

  const copyPrompt = () => {
    if (enhancedPrompt) { navigator.clipboard.writeText(enhancedPrompt); toast.success("Prompt copiado al portapapeles — listo para usar en cualquier IA"); }
  };

  const isGenerating = enhanceMutation.isPending;

  return (
    <div className="pt-14 bg-[#0A0A0A] min-h-screen">
      <BackButton variant="inline" />
      <GlobalNavBar />
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#0A0A0A]/95 backdrop-blur-md border-b border-[#00E5FF]/10">
        <div className="container flex items-center justify-between h-16">
          <a href="/" className="flex items-center gap-1">
            <ArrowLeft className="w-4 h-4 text-[#B0B0B0]" />
            
            <span className="font-['Space_Grotesk'] font-bold text-base text-[#00E5FF]">LINCE</span>
          </a>
          <div className="flex items-center gap-3">
            {/* Mode Toggle */}
            <div className="flex rounded-full border border-white/10 overflow-hidden">
              <a href="/prompt-studio"
                className="px-3 py-1.5 text-xs font-medium text-[#B0B0B0] hover:text-white hover:bg-white/5 transition-all">
                Imagen
              </a>
              <span className="px-3 py-1.5 text-xs font-bold text-[#0A0A0A] bg-[#D4A843]">
                Texto Pro
              </span>
            </div>
            <span className="text-[#D4A843] text-xs font-medium px-3 py-1 rounded-full bg-[#D4A843]/10 border border-[#D4A843]/30 flex items-center gap-1.5">
              <Brain className="w-3 h-3" /> Anthropic AI
            </span>
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
                  src={PRO_AVATARS[0].img}
                  alt={PRO_AVATARS[0].name}
                  className="w-20 h-20 rounded-full object-cover border-2 border-[#D4A843]"
                />
                <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#D4A843] flex items-center justify-center">
                  <Brain className="w-3 h-3 text-[#0A0A0A]" />
                </div>
              </div>
            </div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#D4A843]/30 bg-[#D4A843]/5 mb-4">
              <Brain className="w-4 h-4 text-[#D4A843]" />
              <span className="text-[#D4A843] text-sm font-medium">Modo Profesional — Prompts de Texto con IA</span>
            </div>
            <h1 className="font-['Space_Grotesk'] font-bold text-4xl sm:text-5xl text-white mb-4">
              Prompt <span className="text-[#D4A843]">Profesional</span>
            </h1>
            <p className="text-[#B0B0B0] text-lg max-w-2xl mx-auto">
              Crea prompts de trabajo con <span className="text-[#D4A843] font-bold">4 campos inteligentes</span>.
              La IA aplica internamente las <span className="text-[#00E5FF] font-bold">6 técnicas de Anthropic</span> para
              generar prompts profesionales que puedes copiar y usar en cualquier IA.
            </p>
            {/* Avatar speech bubble */}
            <div className="mt-4 inline-flex items-center gap-3 px-5 py-3 rounded-2xl bg-white/[0.03] border border-[#D4A843]/15">
              <img src={PRO_AVATARS[0].expr?.feliz || PRO_AVATARS[0].img} alt="" className="w-10 h-10 rounded-full object-cover" />
              <p className="text-[#B0B0B0] text-sm italic text-left">
                "Yo soy <span className="text-[#00E5FF] font-bold">{PRO_AVATARS[0].name.replace('_', ' ')}</span>, el abuelo sabio.
                Aquí cada miembro de la familia te enseña a crear prompts profesionales."
              </p>
            </div>
            <p className="text-[#B0B0B0]/50 text-xs mt-3 italic">
              "Saber hacer prompts es supervivencia profesional" — Dario Amodei, CEO Anthropic
            </p>
          </div>

          {/* ─── LIVE SCORE ─── */}
          <div className="mb-8 p-4 bg-gradient-to-r from-[#D4A843]/[0.04] via-white/[0.01] to-[#00E5FF]/[0.04] border border-white/[0.08] rounded-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Target className="w-5 h-5 text-[#D4A843]" />
                <span className="font-['Space_Grotesk'] font-bold text-white text-sm">Calidad del Prompt</span>
                <span className="text-[#B0B0B0]/50 text-xs">(se actualiza mientras escribes)</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-['Space_Grotesk'] font-bold text-2xl" style={{ color: scoreColor }}>{localScore}%</span>
                <div className="w-12 h-12 relative">
                  <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                    <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="3" />
                    <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke={scoreColor} strokeWidth="3" strokeDasharray={`${localScore}, 100`} className="transition-all duration-500" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* ─── AVATAR-DRIVEN TEMPLATES ─── */}
          <div className="mb-8">
            <h3 className="font-['Space_Grotesk'] font-semibold text-white text-sm mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#D4A843]" />
              La familia LINCE te muestra ejemplos — haz clic para cargar
            </h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {PRO_TEMPLATES.map((tpl, i) => {
                const avatar = PRO_AVATARS[tpl.avatarIdx ?? 0];
                return (
                  <button key={i} onClick={() => handleTemplate(tpl)}
                    className="text-left p-4 bg-white/[0.03] border border-white/[0.06] rounded-xl hover:border-white/[0.2] transition-all group">
                    <div className="flex items-start gap-3 mb-2">
                      <img
                        src={avatar.img}
                        alt={avatar.name}
                        className="w-12 h-12 rounded-full object-cover border-2 flex-shrink-0 group-hover:scale-105 transition-transform"
                        style={{ borderColor: avatar.color }}
                      />
                      <div>
                        <div className="flex items-center gap-2 mb-0.5">
                          {tpl.icon}
                          <span className="text-xs font-bold" style={{ color: avatar.color }}>{tpl.name}</span>
                        </div>
                        <p className="text-[#B0B0B0]/60 text-[10px]">{avatar.name.replace('_', ' ')} — {avatar.specialty}</p>
                      </div>
                    </div>
                    <p className="text-[#B0B0B0] text-[11px] italic leading-snug">"{tpl.quote}"</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ─── FORM + RESULT ─── */}
          <div className="grid lg:grid-cols-[1fr_420px] gap-8">
            {/* Left: Form */}
            <div className="space-y-6">
              {/* Field 1: Role + Context */}
              <div>
                <label className="flex items-center gap-2 text-white font-['Space_Grotesk'] font-bold text-sm mb-2">
                  <Briefcase className="w-4 h-4 text-[#00E5FF]" />
                  <span className="text-[#00E5FF]">1.</span> Rol y Contexto
                  <span className="text-[#FF5252] text-xs">*</span>
                </label>
                <p className="text-[#B0B0B0]/60 text-xs mb-2">¿Quién eres y para qué contexto? La IA asumirá esta expertise.</p>
                <Textarea
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="Ej: Director de formación de una PYME industrial que necesita capacitar a 50 empleados en IA aplicada a producción"
                  className="bg-white/[0.03] border-white/[0.08] text-white placeholder:text-[#B0B0B0]/40 focus:border-[#00E5FF]/50 min-h-[70px] resize-none"
                  maxLength={500}
                />
                <p className="text-[#B0B0B0]/40 text-[10px] mt-1">{role.length}/500</p>
              </div>

              {/* Field 2: Task */}
              <div>
                <label className="flex items-center gap-2 text-white font-['Space_Grotesk'] font-bold text-sm mb-2">
                  <FileText className="w-4 h-4 text-[#D4A843]" />
                  <span className="text-[#D4A843]">2.</span> Tarea
                  <span className="text-[#FF5252] text-xs">*</span>
                </label>
                <p className="text-[#B0B0B0]/60 text-xs mb-2">¿Qué necesitas exactamente? Sé lo más específico posible.</p>
                <Textarea
                  value={task}
                  onChange={(e) => setTask(e.target.value)}
                  placeholder="Ej: Crea un plan de formación de 7 horas sobre IA generativa para el departamento comercial, con objetivos medibles por bloque y actividades prácticas que puedan aplicar al día siguiente"
                  className="bg-white/[0.03] border-white/[0.08] text-white placeholder:text-[#B0B0B0]/40 focus:border-[#D4A843]/50 min-h-[100px] resize-none"
                  maxLength={2000}
                />
                <p className="text-[#B0B0B0]/40 text-[10px] mt-1">{task.length}/2000</p>
              </div>

              {/* Field 3: Format + Tone */}
              <div>
                <label className="flex items-center gap-2 text-white font-['Space_Grotesk'] font-bold text-sm mb-2">
                  <Target className="w-4 h-4 text-[#00C853]" />
                  <span className="text-[#00C853]">3.</span> Formato y Tono
                  <span className="text-[#FF5252] text-xs">*</span>
                </label>
                <p className="text-[#B0B0B0]/60 text-xs mb-3">¿Cómo lo quieres? Selecciona formato y tono, o escribe tu propio.</p>

                {/* Format chips */}
                <div className="mb-3">
                  <p className="text-[#B0B0B0]/50 text-[10px] mb-1.5 uppercase tracking-wider">Formato</p>
                  <div className="flex flex-wrap gap-2">
                    {FORMAT_OPTIONS.map((opt) => (
                      <button key={opt.value} onClick={() => setSelectedFormat(selectedFormat === opt.value ? "" : opt.value)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${
                          selectedFormat === opt.value
                            ? "bg-[#00C853]/15 border-[#00C853]/50 text-[#00C853]"
                            : "bg-white/[0.02] border-white/[0.06] text-[#B0B0B0] hover:border-white/[0.15] hover:text-white"
                        }`}>
                        {opt.icon} {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tone chips */}
                <div className="mb-3">
                  <p className="text-[#B0B0B0]/50 text-[10px] mb-1.5 uppercase tracking-wider">Tono</p>
                  <div className="flex flex-wrap gap-2">
                    {TONE_OPTIONS.map((opt) => (
                      <button key={opt.value} onClick={() => setSelectedTone(selectedTone === opt.value ? "" : opt.value)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${
                          selectedTone === opt.value
                            ? "bg-[#D4A843]/15 border-[#D4A843]/50 text-[#D4A843]"
                            : "bg-white/[0.02] border-white/[0.06] text-[#B0B0B0] hover:border-white/[0.15] hover:text-white"
                        }`}>
                        {opt.icon} {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Custom format text */}
                <Textarea
                  value={formatCustom}
                  onChange={(e) => setFormatCustom(e.target.value)}
                  placeholder="Instrucciones adicionales de formato: máximo 500 palabras, incluir tabla comparativa, usar viñetas..."
                  className="bg-white/[0.03] border-white/[0.08] text-white placeholder:text-[#B0B0B0]/40 focus:border-[#00C853]/50 min-h-[60px] resize-none"
                  maxLength={500}
                />
              </div>

              {/* Field 4: Example (optional) */}
              <div>
                <label className="flex items-center gap-2 text-white font-['Space_Grotesk'] font-bold text-sm mb-2">
                  <Lightbulb className="w-4 h-4 text-[#9C27B0]" />
                  <span className="text-[#9C27B0]">4.</span> Ejemplo
                  <span className="text-[#B0B0B0] text-xs font-normal">(opcional pero potente)</span>
                </label>
                <p className="text-[#B0B0B0]/60 text-xs mb-2">Muéstrale a la IA un ejemplo de lo que quieres. Esto activa el <span className="text-[#9C27B0] font-bold">few-shot learning</span> — la técnica más poderosa de Anthropic.</p>
                <Textarea
                  value={example}
                  onChange={(e) => setExample(e.target.value)}
                  placeholder="Ej: Bloque 1 (1h): Qué es la IA generativa — Objetivo: El alumno identifica 5 herramientas de IA generativa y su aplicación en marketing"
                  className="bg-white/[0.03] border-white/[0.08] text-white placeholder:text-[#B0B0B0]/40 focus:border-[#9C27B0]/50 min-h-[70px] resize-none"
                  maxLength={2000}
                />
                <p className="text-[#B0B0B0]/40 text-[10px] mt-1">{example.length}/2000</p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Button onClick={handleGenerate} disabled={!isFormValid || isGenerating}
                  className="flex-1 h-12 bg-[#D4A843] text-[#0A0A0A] font-['Space_Grotesk'] font-bold hover:bg-[#D4A843]/90 shadow-[0_0_20px_rgba(212,168,67,0.3)] disabled:opacity-40">
                  {isGenerating ? (<><Loader2 className="w-5 h-5 mr-2 animate-spin" />Generando prompt...</>) : (<><Wand2 className="w-5 h-5 mr-2" />Generar Prompt Profesional</>)}
                </Button>
                <Button onClick={handleReset} variant="outline" className="h-12 border-white/10 text-[#B0B0B0] hover:bg-white/5">
                  <RefreshCw className="w-4 h-4 mr-2" />Limpiar
                </Button>
              </div>
            </div>

            {/* Right: Result Panel */}
            <div className="space-y-4">
              {/* Enhanced Prompt Result */}
              {enhancedPrompt && (
                <div className="p-5 bg-[#D4A843]/5 border border-[#D4A843]/20 rounded-xl">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-['Space_Grotesk'] font-bold text-[#D4A843] text-sm flex items-center gap-2">
                      <Wand2 className="w-4 h-4" /> Prompt Profesional Generado
                    </h4>
                    <button onClick={copyPrompt} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#D4A843]/10 text-[#D4A843] text-xs font-bold hover:bg-[#D4A843]/20 transition-colors">
                      <Copy className="w-3.5 h-3.5" /> Copiar
                    </button>
                  </div>
                  <div className="text-[#B0B0B0] text-xs leading-relaxed font-['JetBrains_Mono'] whitespace-pre-wrap max-h-[400px] overflow-y-auto pr-2">
                    {enhancedPrompt}
                  </div>
                </div>
              )}

              {/* AI Score + Tips */}
              {aiScore !== null && (
                <div className="p-4 bg-[#00E5FF]/5 border border-[#00E5FF]/20 rounded-xl">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-['Space_Grotesk'] font-bold text-[#00E5FF] text-sm flex items-center gap-2">
                      <Zap className="w-4 h-4" /> Análisis IA
                    </h4>
                    <span className="font-['Space_Grotesk'] font-bold text-lg" style={{ color: aiScore >= 70 ? "#00C853" : aiScore >= 40 ? "#D4A843" : "#FF5252" }}>
                      {aiScore}/100
                    </span>
                  </div>

                  {technique && (
                    <div className="flex items-center gap-2 mb-3 p-2 bg-[#9C27B0]/10 border border-[#9C27B0]/20 rounded-lg">
                      <Brain className="w-3.5 h-3.5 text-[#9C27B0]" />
                      <span className="text-[#9C27B0] text-[11px] font-bold">Técnica Anthropic aplicada:</span>
                      <span className="text-[#B0B0B0] text-[11px]">{technique}</span>
                    </div>
                  )}

                  {tips.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-[#00E5FF] text-[11px] font-bold">Consejos para mejorar:</p>
                      {tips.map((tip, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <Star className="w-3 h-3 text-[#D4A843] mt-0.5 flex-shrink-0" />
                          <span className="text-[#B0B0B0] text-[11px]">{tip}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Loading state with avatar */}
              {isGenerating && (
                <div className="p-8 bg-white/[0.02] border border-[#D4A843]/20 rounded-xl flex flex-col items-center justify-center gap-4">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-full border-2 border-[#D4A843]/30 border-t-[#D4A843] animate-spin" />
                    <img src={PRO_AVATARS[0].expr?.pensando || PRO_AVATARS[0].img} alt="" className="w-8 h-8 rounded-full object-cover absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                  </div>
                  <div className="text-center">
                    <p className="text-white font-['Space_Grotesk'] font-bold text-sm">Aplicando las 6 técnicas de Anthropic...</p>
                    <p className="text-[#B0B0B0] text-xs mt-1">La familia LINCE está construyendo tu prompt profesional</p>
                  </div>
                </div>
              )}

              {/* Empty state with avatar */}
              {!enhancedPrompt && !isGenerating && (
                <div className="p-8 bg-white/[0.02] border border-white/[0.06] rounded-xl flex flex-col items-center justify-center gap-3 border-dashed">
                  <img src={PRO_AVATARS[0].expr?.pensando || PRO_AVATARS[0].img} alt="" className="w-16 h-16 rounded-full object-cover opacity-30" />
                  <p className="text-[#B0B0B0]/40 text-sm text-center">Tu prompt profesional aparecerá aquí</p>
                  <p className="text-[#B0B0B0]/30 text-[10px] text-center px-4">Rellena los campos y haz clic en "Generar Prompt Profesional"</p>
                </div>
              )}

              {/* Anthropic Badge */}
              <div className="p-3 bg-[#9C27B0]/5 border border-[#9C27B0]/15 rounded-lg">
                <p className="text-[#B0B0B0] text-[10px]">
                  <span className="text-[#9C27B0] font-bold">Metodología Anthropic:</span> Este modo aplica internamente las 6 técnicas oficiales de ingeniería de prompts:
                  especificidad, ejemplos (few-shot), cadena de pensamiento, formato estructurado, asignación de rol y restricciones.
                </p>
              </div>

              {/* Security badge */}
              <div className="p-3 bg-[#00C853]/5 border border-[#00C853]/15 rounded-lg flex items-center gap-2">
                <Shield className="w-4 h-4 text-[#00C853] flex-shrink-0" />
                <p className="text-[#B0B0B0] text-[10px]">
                  <span className="text-[#00C853] font-bold">Seguro:</span> Inputs sanitizados, rate limiting activo. Tus prompts no se almacenan.
                </p>
              </div>
            </div>
          </div>

          {/* ─── METHODOLOGY ACCORDION ─── */}
          <div className="mt-12 mb-8">
            <button
              onClick={() => setShowMethodology(!showMethodology)}
              className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-[#D4A843]/5 via-[#9C27B0]/5 to-[#00E5FF]/5 border border-[#D4A843]/20 rounded-xl hover:border-[#D4A843]/40 transition-all"
            >
              <div className="flex items-center gap-3">
                <Brain className="w-5 h-5 text-[#D4A843]" />
                <span className="font-['Space_Grotesk'] font-bold text-white text-sm">Las 6 Técnicas de Anthropic — Cómo funciona este modo</span>
              </div>
              <ChevronDown className={`w-5 h-5 text-[#B0B0B0] transition-transform duration-300 ${showMethodology ? "rotate-180" : ""}`} />
            </button>

            {showMethodology && (
              <div className="mt-2 p-6 bg-white/[0.02] border border-white/[0.06] rounded-xl space-y-6">
                <p className="text-[#B0B0B0] text-sm leading-relaxed">
                  Este modo aplica internamente las <span className="text-[#D4A843] font-bold">6 técnicas oficiales de ingeniería de prompts de Anthropic</span>,
                  combinadas con la filosofía de <span className="text-[#00E5FF] font-bold">Dario Amodei</span> sobre el uso responsable y efectivo de la IA.
                  Tú solo rellenas 4 campos simples — la IA hace el trabajo pesado.
                </p>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {[
                    { num: "1", title: "Especificidad", color: "#00E5FF", text: "Instrucciones claras y directas. Sin ambigüedades. La IA convierte tu input en instrucciones quirúrgicas." },
                    { num: "2", title: "Few-Shot Learning", color: "#D4A843", text: "Si das un ejemplo, la IA lo usa como patrón. Es la técnica más poderosa para obtener exactamente lo que quieres." },
                    { num: "3", title: "Chain of Thought", color: "#00C853", text: "La IA estructura el razonamiento paso a paso. Descompone tareas complejas en pasos manejables." },
                    { num: "4", title: "Formato Estructurado", color: "#9C27B0", text: "Organiza la salida con secciones, marcadores y estructura clara. El resultado es ordenado y profesional." },
                    { num: "5", title: "Asignación de Rol", color: "#FF5252", text: "Le da a la IA una expertise específica basada en tu contexto. Un experto en marketing responde diferente que un ingeniero." },
                    { num: "6", title: "Restricciones", color: "#00BCD4", text: "Establece límites inteligentes: longitud, formato de salida, qué incluir y qué no. Evita respuestas genéricas." },
                  ].map((step) => (
                    <div key={step.num} className="p-4 rounded-lg" style={{ backgroundColor: `${step.color}08`, border: `1px solid ${step.color}20` }}>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="w-7 h-7 rounded-full flex items-center justify-center font-bold text-sm" style={{ backgroundColor: `${step.color}20`, color: step.color }}>{step.num}</span>
                        <h4 className="font-['Space_Grotesk'] font-bold text-white text-sm">{step.title}</h4>
                      </div>
                      <p className="text-[#B0B0B0] text-xs">{step.text}</p>
                    </div>
                  ))}
                </div>

                <div className="p-4 bg-[#D4A843]/5 border border-[#D4A843]/20 rounded-lg">
                  <p className="text-[#D4A843] text-xs font-bold mb-1 flex items-center gap-1.5"><Zap className="w-3.5 h-3.5" /> Filosofía Dario Amodei (CEO Anthropic)</p>
                  <p className="text-[#B0B0B0] text-xs leading-relaxed">
                    "Estamos en la adolescencia tecnológica. El 50% de los empleos white-collar de nivel de entrada serán disrumpidos en 1-5 años.
                    Saber crear prompts efectivos no es un lujo — es supervivencia profesional. Intervenir quirúrgicamente, ser pragmático y basado en evidencia."
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Footer CTA */}
          <div className="mt-8 text-center">
            <div className="inline-flex gap-4">
              <a href="/prompt-studio" className="inline-flex items-center gap-2 px-6 py-3 bg-[#00E5FF]/10 border border-[#00E5FF]/30 text-[#00E5FF] rounded-xl font-['Space_Grotesk'] font-bold text-sm hover:bg-[#00E5FF]/20 transition-colors">
                <Sparkles className="w-4 h-4" /> IMAGELIN
              </a>
              <a href="/arsenal-ia" className="inline-flex items-center gap-2 px-6 py-3 bg-[#D4A843]/10 border border-[#D4A843]/30 text-[#D4A843] rounded-xl font-['Space_Grotesk'] font-bold text-sm hover:bg-[#D4A843]/20 transition-colors">
                <Zap className="w-4 h-4" /> Arsenal IA
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

import React, { useState, useMemo } from "react";
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
  { name: "MAMÁ", role: "La Mamá Artista", specialty: "Creatividad y Contenido", img: AVATAR_FRONTAL.MAMALINA, expr: AVATAR_EXPRESSIONS.MAMALINA, color: "#D4A843" },
  { name: "PAPÁ", role: "El Papá Ingeniero", specialty: "Código y Tecnología", img: AVATAR_FRONTAL.LINCE, expr: AVATAR_EXPRESSIONS.LINCE, color: "#00C853" },
  { name: "HIJO", role: "El Hijo Mayor", specialty: "Marketing y Análisis", img: AVATAR_FRONTAL.CHAVALIN, expr: AVATAR_EXPRESSIONS.CHAVALIN, color: "#FF5252" },
  { name: "HIJA", role: "La Hija Mayor", specialty: "RRHH y Comunicación", img: AVATAR_FRONTAL.CHAVALINA, expr: AVATAR_EXPRESSIONS.CHAVALINA, color: "#9C27B0" },
  { name: "PRIMO", role: "El Genio Creativo", specialty: "Formación y Educación", img: AVATAR_FRONTAL.SABELIN, expr: AVATAR_EXPRESSIONS.SABELIN, color: "#00BCD4" },
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

export default function PromptProfesional(props: any) {
  const embedded = props?.embedded === true;
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

  if (embedded) {
    return (
      <div className="bg-[#0d1219] overflow-y-auto h-full">
        <div className="max-w-4xl mx-auto px-4 sm:px-8 pt-6 pb-20">
          {/* Hero - Igual que PromptStudio */}
          <div className="text-center mb-10">
            <div className="flex justify-center mb-4">
              <div className="relative">
                <img src={PRO_AVATARS[0].img} alt={PRO_AVATARS[0].name} className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-3" style={{ borderColor: '#D4A843' }} />
                <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-[#D4A843] flex items-center justify-center">
                  <Brain className="w-4 h-4 text-[#0A0A0A]" />
                </div>
              </div>
            </div>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-white mb-2">
              Generar <span className="text-[#D4A843]">Prompt</span> con IA
            </h2>
            <p className="text-white/60 text-base sm:text-lg max-w-lg mx-auto leading-relaxed">
              Rellena los <span className="text-[#D4A843] font-bold">4 pasos</span> y genera tu prompt profesional.
            </p>
          </div>

          {/* Puntuación simplificada - Igual que PromptStudio */}
          <div className="mb-10 p-5 sm:p-6 bg-gradient-to-r from-[#D4A843]/[0.05] to-[#00E5FF]/[0.05] border border-white/[0.1] rounded-2xl">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-display font-bold text-white text-lg sm:text-xl flex items-center gap-2">
                <Target className="w-5 h-5 text-[#D4A843]" />
                Tu puntuación
              </h3>
              <div className="flex items-center gap-3">
                <span className="font-display font-black text-3xl sm:text-4xl" style={{ color: scoreColor }}>{localScore}%</span>
                <div className="w-16 h-16 relative">
                  <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                    <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="3.5" />
                    <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke={scoreColor} strokeWidth="3.5" strokeDasharray={`${localScore}, 100`} className="transition-all duration-500" />
                  </svg>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { key: "rol", name: "Rol", icon: "🎭", color: "#00E5FF", score: role.length > 50 ? 25 : role.length > 20 ? 15 : role.length > 0 ? 8 : 0, max: 25 },
                { key: "tarea", name: "Tarea", icon: "🎯", color: "#D4A843", score: task.length > 100 ? 35 : task.length > 40 ? 22 : task.length > 0 ? 10 : 0, max: 35 },
                { key: "formato", name: "Formato", icon: "📋", color: "#00C853", score: formatString.length > 30 ? 25 : formatString.length > 10 ? 15 : formatString.length > 0 ? 8 : 0, max: 25 },
                { key: "ejemplo", name: "Ejemplo", icon: "💡", color: "#9C27B0", score: example.length > 50 ? 15 : example.length > 10 ? 8 : 0, max: 15 },
              ].map((crit) => {
                const pct = Math.round((crit.score / crit.max) * 100);
                return (
                  <div key={crit.key} className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xl">{crit.icon}</span>
                      <span className="text-sm font-bold text-white">{crit.name}</span>
                    </div>
                    <div className="h-3 rounded-full bg-white/[0.08] overflow-hidden mb-1">
                      <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, backgroundColor: crit.color }} />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold" style={{ color: crit.color }}>{crit.score}/{crit.max}</span>
                      <span className="text-xs font-bold" style={{ color: pct >= 80 ? '#00C853' : pct >= 50 ? '#D4A843' : '#FF5252' }}>
                        {pct >= 80 ? '\u2705' : pct >= 50 ? '\u{1F7E1}' : pct > 0 ? '\u{1F534}' : ''}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Formulario - Dos columnas en desktop (igual que PromptStudio) */}
          <div className="grid lg:grid-cols-[1fr_400px] gap-8">
            <div className="space-y-8">
              {/* PASO 1: Rol y Contexto */}
              <div className="p-5 sm:p-6 rounded-2xl bg-white/[0.02] border-2 border-[#00E5FF]/20">
                <label className="flex items-center gap-3 text-white font-display font-bold text-lg sm:text-xl mb-4">
                  <span className="w-10 h-10 rounded-full bg-[#00E5FF]/20 flex items-center justify-center text-[#00E5FF] font-black text-lg">1</span>
                  ¿Quién eres?
                  <span className="text-[#FF5252] text-sm">*</span>
                </label>
                <Textarea value={role} onChange={(e) => setRole(e.target.value)}
                  placeholder="Ej: Director de formación de una PYME que necesita capacitar a 50 empleados en IA"
                  className="bg-white/[0.05] border-2 border-white/[0.15] text-white text-base sm:text-lg placeholder:text-white/30 focus:border-[#00E5FF]/60 min-h-[80px] resize-none rounded-xl px-5 py-4"
                  maxLength={500} />
                <p className="text-white/40 text-sm mt-2">{role.length}/500 caracteres</p>
              </div>

              {/* PASO 2: Tarea */}
              <div className="p-5 sm:p-6 rounded-2xl bg-white/[0.02] border-2 border-[#D4A843]/20">
                <label className="flex items-center gap-3 text-white font-display font-bold text-lg sm:text-xl mb-4">
                  <span className="w-10 h-10 rounded-full bg-[#D4A843]/20 flex items-center justify-center text-[#D4A843] font-black text-lg">2</span>
                  ¿Qué necesitas?
                  <span className="text-[#FF5252] text-sm">*</span>
                </label>
                <Textarea value={task} onChange={(e) => setTask(e.target.value)}
                  placeholder="Ej: Crea un plan de formación de 7 horas sobre IA generativa con objetivos medibles"
                  className="bg-white/[0.05] border-2 border-white/[0.15] text-white text-base sm:text-lg placeholder:text-white/30 focus:border-[#D4A843]/60 min-h-[100px] resize-none rounded-xl px-5 py-4"
                  maxLength={2000} />
                <p className="text-white/40 text-sm mt-2">{task.length}/2000 caracteres</p>
              </div>

              {/* PASO 3: Formato y Tono */}
              <div className="p-5 sm:p-6 rounded-2xl bg-white/[0.02] border-2 border-[#00C853]/20">
                <label className="flex items-center gap-3 text-white font-display font-bold text-lg sm:text-xl mb-4">
                  <span className="w-10 h-10 rounded-full bg-[#00C853]/20 flex items-center justify-center text-[#00C853] font-black text-lg">3</span>
                  Elige formato y tono
                  <span className="text-[#FF5252] text-sm">*</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                  {FORMAT_OPTIONS.map((opt) => (
                    <button key={opt.value} onClick={() => setSelectedFormat(selectedFormat === opt.value ? "" : opt.value)}
                      className={`p-4 rounded-xl text-center transition-all border-2 font-semibold ${
                        selectedFormat === opt.value
                          ? "bg-[#00C853]/15 border-[#00C853] text-[#00C853] shadow-[0_0_15px_rgba(0,200,83,0.2)]"
                          : "bg-white/[0.03] border-white/[0.08] text-white/70 hover:border-white/[0.2] hover:bg-white/[0.05]"
                      }`}>
                      <span className="text-2xl sm:text-3xl block mb-2">{opt.icon}</span>
                      <span className="text-xs sm:text-sm block leading-tight">{opt.label}</span>
                    </button>
                  ))}
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-4">
                  {TONE_OPTIONS.map((opt) => (
                    <button key={opt.value} onClick={() => setSelectedTone(selectedTone === opt.value ? "" : opt.value)}
                      className={`p-3 rounded-xl text-center transition-all border-2 font-semibold ${
                        selectedTone === opt.value
                          ? "bg-[#D4A843]/15 border-[#D4A843] text-[#D4A843] shadow-[0_0_15px_rgba(212,168,67,0.2)]"
                          : "bg-white/[0.03] border-white/[0.08] text-white/70 hover:border-white/[0.2] hover:bg-white/[0.05]"
                      }`}>
                      <span className="text-xl block mb-1">{opt.icon}</span>
                      <span className="text-[10px] sm:text-xs block leading-tight">{opt.label}</span>
                    </button>
                  ))}
                </div>
                <Textarea value={formatCustom} onChange={(e) => setFormatCustom(e.target.value)}
                  placeholder="Instrucciones extra: máximo 500 palabras, incluir tabla, usar viñetas..."
                  className="bg-white/[0.05] border-2 border-white/[0.15] text-white text-base placeholder:text-white/30 focus:border-[#00C853]/60 min-h-[60px] resize-none rounded-xl px-5 py-3"
                  maxLength={500} />
              </div>

              {/* PASO 4: Ejemplo */}
              <div className="p-5 sm:p-6 rounded-2xl bg-white/[0.02] border-2 border-[#9C27B0]/20">
                <label className="flex items-center gap-3 text-white font-display font-bold text-lg sm:text-xl mb-4">
                  <span className="w-10 h-10 rounded-full bg-[#9C27B0]/20 flex items-center justify-center text-[#9C27B0] font-black text-lg">4</span>
                  Ejemplo
                  <span className="text-white/40 text-sm ml-1">(opcional)</span>
                </label>
                <Textarea value={example} onChange={(e) => setExample(e.target.value)}
                  placeholder="Ej: Bloque 1 (1h): Qué es la IA generativa — Objetivo: El alumno identifica 5 herramientas"
                  className="bg-white/[0.05] border-2 border-white/[0.15] text-white text-base sm:text-lg placeholder:text-white/30 focus:border-[#9C27B0]/60 min-h-[80px] resize-none rounded-xl px-5 py-4"
                  maxLength={2000} />
              </div>

              {/* Botones de acción - GRANDES */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button onClick={handleGenerate} disabled={!isFormValid || isGenerating}
                  className="flex-1 h-16 sm:h-18 text-lg sm:text-xl bg-[#D4A843] text-[#0A0A0A] font-display font-black hover:bg-[#D4A843]/90 shadow-[0_0_30px_rgba(212,168,67,0.3)] disabled:opacity-40 rounded-2xl">
                  {isGenerating ? (<><Loader2 className="w-6 h-6 mr-3 animate-spin" />Generando...</>) : (<><Wand2 className="w-6 h-6 mr-3" />GENERAR PROMPT</>)}
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
                    <h4 className="font-display font-bold text-[#D4A843] text-base flex items-center gap-2"><Wand2 className="w-4 h-4" /> Tu Prompt Profesional</h4>
                    <button onClick={copyPrompt} className="text-[#B0B0B0] hover:text-white transition-colors p-2"><Copy className="w-5 h-5" /></button>
                  </div>
                  <div className="text-[#B0B0B0] text-sm leading-relaxed whitespace-pre-wrap max-h-[400px] overflow-y-auto pr-2">
                    {enhancedPrompt}
                  </div>
                </div>
              )}

              {aiScore !== null && (
                <div className="p-4 bg-[#00E5FF]/5 border border-[#00E5FF]/20 rounded-2xl">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-display font-bold text-[#00E5FF] text-sm flex items-center gap-2"><Zap className="w-4 h-4" /> Análisis IA</h4>
                    <span className="font-display font-bold text-xl" style={{ color: aiScore >= 70 ? '#00C853' : aiScore >= 40 ? '#D4A843' : '#FF5252' }}>{aiScore}/100</span>
                  </div>
                  {technique && (
                    <div className="flex items-center gap-2 mb-3 p-2 bg-[#9C27B0]/10 border border-[#9C27B0]/20 rounded-lg">
                      <Brain className="w-3 h-3 text-[#9C27B0]" />
                      <span className="text-[#9C27B0] text-xs font-bold">{technique}</span>
                    </div>
                  )}
                  {tips.length > 0 && (
                    <div className="space-y-1.5">
                      {tips.map((tip, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <Star className="w-3 h-3 text-[#D4A843] mt-0.5 flex-shrink-0" />
                          <span className="text-[#B0B0B0] text-xs">{tip}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {isGenerating && (
                <div className="aspect-square bg-white/[0.02] border-2 border-[#D4A843]/20 rounded-2xl flex flex-col items-center justify-center gap-4">
                  <div className="relative"><div className="w-16 h-16 rounded-full border-3 border-[#D4A843]/30 border-t-[#D4A843] animate-spin" /><Brain className="w-7 h-7 text-[#D4A843] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" /></div>
                  <p className="text-white font-bold text-lg">Generando tu prompt...</p>
                  <p className="text-white/40 text-sm">Aplicando las 6 técnicas de Anthropic</p>
                </div>
              )}

              {!enhancedPrompt && !isGenerating && (
                <div className="aspect-square bg-white/[0.02] border-2 border-white/[0.08] rounded-2xl flex flex-col items-center justify-center gap-4 border-dashed">
                  <img src={PRO_AVATARS[0].expr?.pensando || PRO_AVATARS[0].img} alt="" className="w-20 h-20 rounded-full object-cover opacity-30" />
                  <p className="text-white/40 text-base text-center px-6">Tu prompt aparecerá aquí</p>
                  <p className="text-white/25 text-sm text-center px-6">Rellena los 4 pasos y pulsa "Generar Prompt"</p>
                </div>
              )}

              <div className="flex items-center gap-3 p-4 bg-[#9C27B0]/5 border border-[#9C27B0]/20 rounded-xl">
                <Brain className="w-5 h-5 text-[#9C27B0]" />
                <p className="text-[#9C27B0] text-sm font-bold">Metodología Anthropic · 6 técnicas profesionales</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-14 bg-[#0A0A0A] min-h-screen">
      <BackButton variant="inline" />
      <GlobalNavBar />
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#0A0A0A]/95 backdrop-blur-md border-b border-[#00E5FF]/10">
        <div className="container flex items-center justify-between h-16">
          <a href="/" className="flex items-center gap-1">
            <ArrowLeft className="w-4 h-4 text-[#B0B0B0]" />
            <span className="font-display font-bold text-base text-[#00E5FF]">LINCE IA</span>
          </a>
          <div className="flex items-center gap-3">
            <div className="flex rounded-full border border-white/10 overflow-hidden">
              <a href="/prompt-studio" className="px-3 py-1.5 text-xs font-medium text-[#B0B0B0] hover:text-white hover:bg-white/5 transition-all">Imagen</a>
              <span className="px-3 py-1.5 text-xs font-bold text-[#0A0A0A] bg-[#D4A843]">Texto Pro</span>
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
                <img src={PRO_AVATARS[0].img} alt={PRO_AVATARS[0].name} className="w-20 h-20 rounded-full object-cover border-2 border-[#D4A843]" />
                <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#D4A843] flex items-center justify-center">
                  <Brain className="w-3 h-3 text-[#0A0A0A]" />
                </div>
              </div>
            </div>
            <h1 className="font-display font-bold text-4xl sm:text-5xl text-white mb-4">
              Prompt <span className="text-[#D4A843]">Profesional</span>
            </h1>
            <p className="text-[#B0B0B0] text-lg max-w-2xl mx-auto">
              Crea prompts de trabajo con <span className="text-[#D4A843] font-bold">4 campos inteligentes</span>.
            </p>
          </div>
          <p className="text-center text-[#B0B0B0] text-sm">Usa la versión embebida en el ChatDashboard para la experiencia completa.</p>
        </div>
      </main>
    </div>
  );
}

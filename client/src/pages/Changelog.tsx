import { useState } from "react";
import { AVATAR_FRONTAL, AVATAR_EXPRESSIONS } from "@/lib/avatarConstants";
import { UserNavBadge } from "@/components/UserNavBadge";
import {
  Sparkles, Gamepad2, Image, BookOpen, Wrench, Shield, Globe,
  Zap, GraduationCap, Palette, Trophy, Clock, CheckCircle2, Circle,
  ArrowLeft, Rocket
} from "lucide-react";
import { GlobalNavBar } from "@/components/GlobalNavBar";
import { BackButton } from "@/components/BackButton";

const YAYALIN_IMG = AVATAR_FRONTAL.YAYALIN;

type ChangeStatus = "live" | "beta" | "coming";

interface ChangeEntry {
  date: string;
  title: string;
  description: string;
  status: ChangeStatus;
  icon: React.ReactNode;
  version?: string;
}

const CHANGELOG: ChangeEntry[] = [
  {
    date: "Feb 2026",
    title: "IMAGELIN Visual",
    description: "Crea prompts para imágenes con IA usando 4 campos simples: Sujeto, Estilo, Entorno y Detalles. La IA mejora tu prompt automáticamente.",
    status: "live",
    icon: <Image size={18} />,
    version: "v1.0",
  },
  {
    date: "Feb 2026",
    title: "Prompt Profesional",
    description: "Modo avanzado con 4 campos inteligentes para crear prompts de texto/trabajo. Basado en las 6 técnicas oficiales de Anthropic.",
    status: "live",
    icon: <Sparkles size={18} />,
    version: "v1.0",
  },
  {
    date: "Feb 2026",
    title: "Arsenal IA — 59 Herramientas",
    description: "Directorio completo de herramientas de inteligencia artificial organizadas en 9 categorías. Filtros, búsqueda y badges Gratis/Premium.",
    status: "live",
    icon: <Wrench size={18} />,
    version: "v1.0",
  },
  {
    date: "Feb 2026",
    title: "Catálogo Formativo — 120 Cursos",
    description: "Cursos presenciales de 7 horas en 8 categorías, con 3 objetivos medibles por curso. Alineados con DigComp 2.2.",
    status: "live",
    icon: <GraduationCap size={18} />,
    version: "v1.0",
  },
  {
    date: "Feb 2026",
    title: "Familia LINCE — 10 Avatares",
    description: "Sistema de avatares educativos con 64 imágenes, expresiones y personalización por generación. Cada avatar enseña IA a su ritmo.",
    status: "live",
    icon: <Palette size={18} />,
    version: "v1.0",
  },
  {
    date: "Feb 2026",
    title: "Gamificación — 3 Niveles Jugables",
    description: "Sistema de niveles con preguntas de IA, vidas, puntos y ranking. Recompensas diarias y racha de aprendizaje.",
    status: "live",
    icon: <Gamepad2 size={18} />,
    version: "v1.0",
  },
  {
    date: "Feb 2026",
    title: "Galería de Creaciones",
    description: "Galería comunitaria donde se muestran las mejores imágenes generadas con IMAGELIN.",
    status: "live",
    icon: <Image size={18} />,
    version: "v1.0",
  },
  {
    date: "Feb 2026",
    title: "Multiidioma (ES/EN/ZH)",
    description: "Toda la plataforma disponible en español, inglés y chino mandarín. Nombres de avatares adaptados por país.",
    status: "live",
    icon: <Globe size={18} />,
    version: "v1.0",
  },
  {
    date: "Feb 2026",
    title: "NDA + Protección de Contenido",
    description: "Acuerdo de confidencialidad obligatorio, marca de agua, protección contra captura de pantalla y copia.",
    status: "live",
    icon: <Shield size={18} />,
    version: "v1.0",
  },
  {
    date: "Próximamente",
    title: "Course Builder Interactivo",
    description: "Diseña tus propios cursos personalizados eligiendo módulos, duración y herramientas. Tu formación a medida.",
    status: "coming",
    icon: <BookOpen size={18} />,
  },
  {
    date: "Próximamente",
    title: "Más Niveles de Juego (4-10)",
    description: "Niveles avanzados con desafíos de prompting, automatización y machine learning. Bosses y raids cooperativos.",
    status: "coming",
    icon: <Trophy size={18} />,
  },
  {
    date: "Próximamente",
    title: "Certificaciones Digitales",
    description: "Certificados verificables al completar cursos y niveles. Integración con LinkedIn y portfolio profesional.",
    status: "coming",
    icon: <Rocket size={18} />,
  },
];

const STATUS_CONFIG: Record<ChangeStatus, { label: string; color: string; bg: string; border: string }> = {
  live: { label: "Activo", color: "text-emerald-400", bg: "bg-emerald-400/10", border: "border-emerald-400/40" },
  beta: { label: "Beta", color: "text-[#D4A843]", bg: "bg-[#D4A843]/10", border: "border-[#D4A843]/40" },
  coming: { label: "Próximamente", color: "text-[#B0B0B0]", bg: "bg-white/5", border: "border-white/10" },
};

export default function Changelog() {
  const [filter, setFilter] = useState<ChangeStatus | "all">("all");

  const filtered = filter === "all" ? CHANGELOG : CHANGELOG.filter((c) => c.status === filter);
  const liveCount = CHANGELOG.filter((c) => c.status === "live").length;
  const comingCount = CHANGELOG.filter((c) => c.status === "coming").length;

  return (
    <div className="pt-14 min-h-screen bg-[#0A0A0A] text-white">
      <BackButton variant="inline" />
      <GlobalNavBar />
      {/* Header */}
      <div className="border-b border-[#00E5FF]/10 bg-[#0A0A0A]/95 backdrop-blur-md">
        <div className="container py-6">
          <div className="flex items-center justify-between mb-4">
            <a href="/" className="inline-flex items-center gap-2 text-[#B0B0B0] hover:text-[#00E5FF] transition-colors text-sm">
              <ArrowLeft size={16} /> Volver al inicio
            </a>
            <UserNavBadge variant="compact" />
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <img src={YAYALIN_IMG} alt="YAYALIN" className="w-14 h-14 rounded-full border-2 border-[#00E5FF]/40 object-cover" />
              <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#00E5FF] flex items-center justify-center">
                <Rocket size={10} className="text-[#0A0A0A]" />
              </div>
            </div>
            <div>
              <h1 className="font-['Space_Grotesk'] font-bold text-2xl sm:text-3xl">
                <span className="text-white">Changelog</span>{" "}
                <span className="text-[#00E5FF]">LINCE</span>
              </h1>
              <p className="text-[#B0B0B0] text-sm mt-0.5">
                Qué hay nuevo y qué viene en camino
              </p>
            </div>
          </div>
          {/* Avatar speech bubble */}
          <div className="mt-4 inline-flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-white/[0.03] border border-[#00E5FF]/15">
            <img src={AVATAR_EXPRESSIONS.YAYALIN?.celebrando || YAYALIN_IMG} alt="" className="w-9 h-9 rounded-full object-cover" />
            <p className="text-[#B0B0B0] text-xs italic">
              "Soy <span className="text-[#00E5FF] font-bold">Duolino</span>, el abuelo.
              Aquí te cuento todo lo que hemos construido y lo que viene."
            </p>
          </div>

          {/* Stats bar */}
          <div className="flex items-center gap-4 mt-4">
            <div className="flex items-center gap-1.5 text-sm">
              <CheckCircle2 size={14} className="text-emerald-400" />
              <span className="text-emerald-400 font-semibold">{liveCount}</span>
              <span className="text-[#B0B0B0]">activas</span>
            </div>
            <div className="flex items-center gap-1.5 text-sm">
              <Clock size={14} className="text-[#B0B0B0]" />
              <span className="text-[#B0B0B0] font-semibold">{comingCount}</span>
              <span className="text-[#B0B0B0]">en camino</span>
            </div>
          </div>

          {/* Filters */}
          <div className="flex gap-2 mt-4">
            {([
              { key: "all" as const, label: "Todas" },
              { key: "live" as const, label: "Activas" },
              { key: "coming" as const, label: "Próximamente" },
            ]).map((f) => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  filter === f.key
                    ? "bg-[#00E5FF]/20 text-[#00E5FF] border border-[#00E5FF]/40"
                    : "bg-white/5 text-[#B0B0B0] border border-white/10 hover:bg-white/10"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="container py-8">
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-5 top-0 bottom-0 w-px bg-gradient-to-b from-[#00E5FF]/40 via-[#00E5FF]/20 to-transparent" />

          <div className="space-y-6">
            {filtered.map((entry, i) => {
              const sc = STATUS_CONFIG[entry.status];
              return (
                <div key={i} className="relative flex gap-4 pl-12">
                  {/* Timeline dot */}
                  <div className="absolute left-3 top-2">
                    {entry.status === "live" ? (
                      <div className="w-4 h-4 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]" />
                    ) : entry.status === "beta" ? (
                      <div className="w-4 h-4 rounded-full bg-[#D4A843] shadow-[0_0_8px_rgba(212,168,67,0.4)]" />
                    ) : (
                      <Circle size={16} className="text-[#B0B0B0]/50" />
                    )}
                  </div>

                  {/* Card */}
                  <div className={`flex-1 rounded-xl border ${sc.border} ${sc.bg} p-4 transition-all hover:border-[#00E5FF]/30`}>
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex items-center gap-2">
                        <span className={sc.color}>{entry.icon}</span>
                        <h3 className="font-['Space_Grotesk'] font-semibold text-sm text-white">
                          {entry.title}
                        </h3>
                        {entry.version && (
                          <span className="text-[10px] font-mono text-[#00E5FF]/60 bg-[#00E5FF]/5 px-1.5 py-0.5 rounded">
                            {entry.version}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${sc.bg} ${sc.color} border ${sc.border}`}>
                          {sc.label}
                        </span>
                        <span className="text-[10px] text-[#B0B0B0]/60">{entry.date}</span>
                      </div>
                    </div>
                    <p className="text-xs text-[#B0B0B0] leading-relaxed">{entry.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#00E5FF]/20 bg-[#00E5FF]/5">
            <Zap size={14} className="text-[#00E5FF]" />
            <span className="text-xs text-[#B0B0B0]">
              Construido por{" "}
              <span className="text-[#D4A843] font-semibold">ACNB IA SL</span>
              {" "}— ACNB IA
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { UserNavBadge } from "@/components/UserNavBadge";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Image as ImageIcon,
  Wand2,
  Loader2,
  Download,
  Copy,
  X,
  Plus,
  Clock,
  Palette,
  MapPin,
  Shield,
  Sparkles,
  Eye,
  ChevronDown,
  ChevronUp,
  Lightbulb,
  Camera,
  Paintbrush,
  Layers,
  Info,
} from "lucide-react";
import { toast } from "sonner";
import { GlobalNavBar } from "@/components/GlobalNavBar";
import { BackButton } from "@/components/BackButton";

const STYLE_LABELS: Record<string, string> = {
  realista: "Fotorrealista",
  cartoon: "Cartoon / Animación",
  acuarela: "Acuarela",
  "3d-render": "3D Render",
  "pixel-art": "Pixel Art",
  "oil-painting": "Óleo Clásico",
  minimalista: "Minimalista",
  cyberpunk: "Cyberpunk",
  anime: "Anime / Manga",
  sketch: "Boceto / Dibujo",
};

const ENV_LABELS: Record<string, string> = {
  estudio: "Estudio Fotográfico",
  naturaleza: "Naturaleza",
  ciudad: "Ciudad / Urbano",
  espacio: "Espacio Exterior",
  marino: "Marino",
  fantasia: "Fantasía",
  interior: "Interior",
  desierto: "Desierto",
  noche: "Escena Nocturna",
  abstracto: "Abstracto",
};

type PromptCreation = {
  id: number;
  subject: string | null;
  style: string;
  environment: string;
  details: string | null;
  enhancedPrompt: string | null;
  imageUrl: string | null;
  status: string;
  createdAt: Date;
};

// ─── Score Badge Component ───
function ScoreBadge({ score }: { score: number }) {
  const getColor = () => {
    if (score >= 80) return { bg: "bg-emerald-500/20", text: "text-emerald-400", border: "border-emerald-500/30" };
    if (score >= 60) return { bg: "bg-[#D4A843]/20", text: "text-[#D4A843]", border: "border-[#D4A843]/30" };
    if (score >= 40) return { bg: "bg-orange-500/20", text: "text-orange-400", border: "border-orange-500/30" };
    return { bg: "bg-red-500/20", text: "text-red-400", border: "border-red-500/30" };
  };
  const getLabel = () => {
    if (score >= 80) return "Excelente";
    if (score >= 60) return "Bueno";
    if (score >= 40) return "Regular";
    return "Mejorable";
  };
  const c = getColor();
  return (
    <span className={`text-[10px] px-2 py-0.5 rounded-full ${c.bg} ${c.text} border ${c.border} font-bold`}>
      {score}% — {getLabel()}
    </span>
  );
}

// ─── Image Modal with Full Details ───
function ImageModal({ creation, onClose }: { creation: PromptCreation; onClose: () => void }) {
  const [showBreakdown, setShowBreakdown] = useState(false);

  const copyPrompt = () => {
    if (creation.enhancedPrompt) {
      navigator.clipboard.writeText(creation.enhancedPrompt);
      toast.success("Prompt mejorado copiado al portapapeles");
    }
  };

  const copyOriginal = () => {
    const original = `Sujeto: ${creation.subject}\nEstilo: ${creation.style}\nEntorno: ${creation.environment}${creation.details ? `\nDetalles: ${creation.details}` : ""}`;
    navigator.clipboard.writeText(original);
    toast.success("Prompt original copiado");
  };

  return (
    <div className="pt-14 fixed inset-0 z-[100] bg-black/85 backdrop-blur-md flex items-center justify-center p-4" onClick={onClose}>
      <BackButton variant="inline" />
      <GlobalNavBar />
      <div
        className="bg-[#0D0D0D] border border-white/[0.08] rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-white/[0.06]">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-[#00E5FF]/10 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-4 h-4 text-[#00E5FF]" />
            </div>
            <div className="min-w-0">
              <h3 className="font-['Space_Grotesk'] font-bold text-white text-lg truncate">{creation.subject}</h3>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-[#B0B0B0]/50 text-[10px] flex items-center gap-1">
                  <Clock className="w-2.5 h-2.5" />
                  {new Date(creation.createdAt).toLocaleString("es-ES")}
                </span>
                <span className="text-[#B0B0B0]/30">|</span>
                <span className="text-[10px] text-emerald-400/60 flex items-center gap-1">
                  <Shield className="w-2.5 h-2.5" />
                  Almacenado en BD
                </span>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="text-[#B0B0B0] hover:text-white transition-colors flex-shrink-0 p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid md:grid-cols-[1.2fr_1fr] gap-0">
          {/* Image */}
          <div className="p-4 sm:p-5">
            {creation.imageUrl ? (
              <div className="relative group rounded-xl overflow-hidden">
                <img
                  src={creation.imageUrl}
                  alt={creation.subject || "Imagen generada por IA"}
                  className="w-full rounded-xl object-contain"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            ) : (
              <div className="aspect-square bg-white/[0.02] rounded-xl flex items-center justify-center">
                <ImageIcon className="w-12 h-12 text-[#B0B0B0]/20" />
              </div>
            )}
          </div>

          {/* Details Panel */}
          <div className="p-4 sm:p-5 space-y-4 border-l border-white/[0.04]">
            {/* Original Input Fields */}
            <div>
              <h4 className="font-['Space_Grotesk'] font-bold text-white text-sm mb-3 flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#00E5FF]" />
                Campos Originales (4 inputs)
              </h4>
              <div className="space-y-2.5">
                <div className="p-2.5 bg-white/[0.02] rounded-lg border border-white/[0.04]">
                  <div className="flex items-center gap-2 mb-1">
                    <Eye className="w-3 h-3 text-[#00E5FF]" />
                    <span className="text-[#00E5FF] text-[10px] font-bold uppercase tracking-wider">Sujeto</span>
                  </div>
                  <p className="text-[#B0B0B0] text-xs">{creation.subject || "—"}</p>
                </div>
                <div className="p-2.5 bg-white/[0.02] rounded-lg border border-white/[0.04]">
                  <div className="flex items-center gap-2 mb-1">
                    <Paintbrush className="w-3 h-3 text-[#D4A843]" />
                    <span className="text-[#D4A843] text-[10px] font-bold uppercase tracking-wider">Estilo</span>
                  </div>
                  <p className="text-[#B0B0B0] text-xs">{STYLE_LABELS[creation.style] || creation.style}</p>
                </div>
                <div className="p-2.5 bg-white/[0.02] rounded-lg border border-white/[0.04]">
                  <div className="flex items-center gap-2 mb-1">
                    <MapPin className="w-3 h-3 text-[#00C853]" />
                    <span className="text-[#00C853] text-[10px] font-bold uppercase tracking-wider">Entorno</span>
                  </div>
                  <p className="text-[#B0B0B0] text-xs">{ENV_LABELS[creation.environment] || creation.environment}</p>
                </div>
                {creation.details && (
                  <div className="p-2.5 bg-white/[0.02] rounded-lg border border-white/[0.04]">
                    <div className="flex items-center gap-2 mb-1">
                      <Lightbulb className="w-3 h-3 text-[#9C27B0]" />
                      <span className="text-[#9C27B0] text-[10px] font-bold uppercase tracking-wider">Detalles</span>
                    </div>
                    <p className="text-[#B0B0B0] text-xs">{creation.details}</p>
                  </div>
                )}
                <button
                  onClick={copyOriginal}
                  className="w-full text-center text-[10px] text-[#B0B0B0]/50 hover:text-[#B0B0B0] py-1.5 transition-colors flex items-center justify-center gap-1"
                >
                  <Copy className="w-2.5 h-2.5" /> Copiar campos originales
                </button>
              </div>
            </div>

            {/* Enhanced Prompt */}
            {creation.enhancedPrompt && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-['Space_Grotesk'] font-bold text-[#D4A843] text-sm flex items-center gap-2">
                    <Wand2 className="w-4 h-4" />
                    Prompt Mejorado por IA
                  </h4>
                  <button
                    onClick={copyPrompt}
                    className="text-[#B0B0B0] hover:text-[#D4A843] transition-colors p-1"
                    title="Copiar prompt mejorado"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="relative">
                  <p className="text-[#B0B0B0] text-[11px] leading-relaxed font-['JetBrains_Mono'] p-3 bg-[#D4A843]/[0.03] rounded-lg border border-[#D4A843]/10">
                    {creation.enhancedPrompt}
                  </p>
                  <div className="absolute top-2 right-2">
                    <span className="text-[8px] px-1.5 py-0.5 rounded bg-[#D4A843]/20 text-[#D4A843] font-bold">EN</span>
                  </div>
                </div>

                {/* Breakdown toggle */}
                <button
                  onClick={() => setShowBreakdown(!showBreakdown)}
                  className="mt-2 w-full flex items-center justify-center gap-1 text-[10px] text-[#B0B0B0]/50 hover:text-[#B0B0B0] transition-colors py-1"
                >
                  {showBreakdown ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                  {showBreakdown ? "Ocultar análisis" : "Ver análisis del prompt"}
                </button>

                {showBreakdown && (
                  <div className="mt-2 p-3 bg-white/[0.01] rounded-lg border border-white/[0.04] space-y-2">
                    <p className="text-[10px] text-[#B0B0B0]/60 flex items-center gap-1">
                      <Info className="w-3 h-3" />
                      La IA analizó tus 4 campos y generó un prompt profesional con:
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="p-2 bg-white/[0.02] rounded">
                        <span className="text-[#00E5FF] text-[9px] font-bold block mb-0.5">Composición</span>
                        <span className="text-[#B0B0B0]/60 text-[9px]">Regla de tercios, profundidad de campo</span>
                      </div>
                      <div className="p-2 bg-white/[0.02] rounded">
                        <span className="text-[#D4A843] text-[9px] font-bold block mb-0.5">Iluminación</span>
                        <span className="text-[#B0B0B0]/60 text-[9px]">Volumétrica, rim light, ambiente</span>
                      </div>
                      <div className="p-2 bg-white/[0.02] rounded">
                        <span className="text-[#00C853] text-[9px] font-bold block mb-0.5">Paleta de Color</span>
                        <span className="text-[#B0B0B0]/60 text-[9px]">Armonía cromática profesional</span>
                      </div>
                      <div className="p-2 bg-white/[0.02] rounded">
                        <span className="text-[#9C27B0] text-[9px] font-bold block mb-0.5">Términos Técnicos</span>
                        <span className="text-[#B0B0B0]/60 text-[9px]">8K, ultra-detailed, masterpiece</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Security badge */}
            <div className="p-3 bg-emerald-500/[0.03] rounded-lg border border-emerald-500/10">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-emerald-400" />
                <div>
                  <p className="text-emerald-400 text-[10px] font-bold">Datos Seguros</p>
                  <p className="text-[#B0B0B0]/40 text-[9px]">
                    Entrada sanitizada, almacenada en BD con validación, rate limiting activo
                  </p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              {creation.imageUrl && (
                <a
                  href={creation.imageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#00E5FF] text-[#0A0A0A] rounded-lg font-bold text-xs hover:bg-[#00E5FF]/90 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Descargar
                </a>
              )}
              <a
                href="/prompt-studio"
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-white/5 text-white rounded-lg font-bold text-xs hover:bg-white/10 transition-colors border border-white/10"
              >
                <Wand2 className="w-4 h-4" />
                Crear Similar
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Gallery Page ───
export default function Galeria() {
  const [selectedCreation, setSelectedCreation] = useState<PromptCreation | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const { data: creations, isLoading, error } = trpc.promptStudio.list.useQuery({
    limit: 100,
    offset: 0,
  });

  const completedCreations = (creations || []).filter(
    (c) => c.status === "completed" && c.imageUrl
  ) as PromptCreation[];

  // Count unique styles
  const uniqueStyles = new Set(completedCreations.map((c) => c.style)).size;

  return (
    <div className="bg-[#0A0A0A] min-h-screen">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#0A0A0A]/95 backdrop-blur-md border-b border-[#00E5FF]/10">
        <div className="container flex items-center justify-between h-16">
          <a href="/" className="flex items-center gap-1">
            <ArrowLeft className="w-4 h-4 text-[#B0B0B0]" />
            
            <span className="font-['Space_Grotesk'] font-bold text-base text-[#00E5FF]">LINCE</span>
          </a>
          <div className="flex items-center gap-3">
            <a
              href="/prompt-studio"
              className="text-[#00E5FF] text-xs font-medium px-3 py-1.5 rounded-full bg-[#00E5FF]/10 border border-[#00E5FF]/30 hover:bg-[#00E5FF]/20 transition-colors"
            >
              Crear Imagen
            </a>
            <span className="text-[#D4A843] text-xs font-medium px-3 py-1.5 rounded-full bg-[#D4A843]/10 border border-[#D4A843]/30">
              Galería
            </span>
            <UserNavBadge variant="compact" />
          </div>
        </div>
      </header>

      <main className="pt-24 pb-16">
        <div className="container">
          {/* Hero */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#D4A843]/30 bg-[#D4A843]/5 mb-6">
              <ImageIcon className="w-4 h-4 text-[#D4A843]" />
              <span className="text-[#D4A843] text-sm font-medium">Creaciones de la Comunidad</span>
            </div>
            <h1 className="font-['Space_Grotesk'] font-bold text-4xl sm:text-5xl text-white mb-4">
              Galería <span className="text-[#D4A843]">LINCE</span>
            </h1>
            <p className="text-[#B0B0B0] text-lg max-w-2xl mx-auto mb-2">
              Explora las imágenes generadas con IA usando Crear Imagen. Cada imagen fue creada con solo 4 campos simples.
            </p>
            <p className="text-[#B0B0B0]/40 text-xs flex items-center justify-center gap-1">
              <Shield className="w-3 h-3" />
              Todas las creaciones se almacenan de forma segura en base de datos con validación completa
            </p>
          </div>

          {/* Stats Bar */}
          <div className="flex items-center justify-center gap-6 mb-10 flex-wrap">
            <div className="text-center">
              <span className="font-['Space_Grotesk'] font-bold text-2xl text-[#00E5FF]">{completedCreations.length}</span>
              <p className="text-[#B0B0B0] text-xs">Imágenes</p>
            </div>
            <div className="w-px h-8 bg-white/10 hidden sm:block" />
            <div className="text-center">
              <span className="font-['Space_Grotesk'] font-bold text-2xl text-[#D4A843]">{uniqueStyles}</span>
              <p className="text-[#B0B0B0] text-xs">Estilos</p>
            </div>
            <div className="w-px h-8 bg-white/10 hidden sm:block" />
            <a
              href="/prompt-studio"
              className="flex items-center gap-2 px-5 py-2.5 bg-[#00E5FF] text-[#0A0A0A] rounded-xl font-['Space_Grotesk'] font-bold text-sm hover:bg-[#00E5FF]/90 transition-colors shadow-[0_0_20px_rgba(0,229,255,0.2)]"
            >
              <Plus className="w-4 h-4" />
              Crear Nueva
            </a>
          </div>

          {/* Loading */}
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <Loader2 className="w-8 h-8 text-[#00E5FF] animate-spin" />
              <p className="text-[#B0B0B0] text-sm">Cargando galería...</p>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="text-center py-20">
              <p className="text-[#FF5252] text-sm">Error al cargar la galería: {error.message}</p>
            </div>
          )}

          {/* Empty State */}
          {!isLoading && !error && completedCreations.length === 0 && (
            <div className="text-center py-20">
              <div className="w-20 h-20 rounded-2xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-center mx-auto mb-6">
                <ImageIcon className="w-10 h-10 text-[#B0B0B0]/20" />
              </div>
              <h3 className="font-['Space_Grotesk'] font-bold text-white text-xl mb-2">La galería está vacía</h3>
              <p className="text-[#B0B0B0] text-sm mb-6">Sé el primero en crear una imagen con Crear Imagen</p>
              <a
                href="/prompt-studio"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#00E5FF] text-[#0A0A0A] rounded-xl font-['Space_Grotesk'] font-bold text-sm shadow-[0_0_20px_rgba(0,229,255,0.2)]"
              >
                <Wand2 className="w-4 h-4" />
                Crear Imagen
              </a>
            </div>
          )}

          {/* Gallery Grid */}
          {completedCreations.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {completedCreations.map((creation) => (
                <button
                  key={creation.id}
                  onClick={() => setSelectedCreation(creation)}
                  className="group text-left bg-white/[0.02] border border-white/[0.06] rounded-xl overflow-hidden hover:border-[#00E5FF]/30 transition-all duration-300"
                >
                  {/* Image */}
                  <div className="aspect-square overflow-hidden relative">
                    <img
                      src={creation.imageUrl!}
                      alt={creation.subject || "Imagen generada por IA"}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                      <div className="flex items-center gap-2">
                        <Eye className="w-4 h-4 text-white" />
                        <span className="text-white text-xs font-medium">Ver detalle</span>
                      </div>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-4">
                    <h3 className="text-white text-sm font-medium mb-2 line-clamp-2 group-hover:text-[#00E5FF] transition-colors">
                      {creation.subject}
                    </h3>
                    <div className="flex items-center gap-2 flex-wrap mb-2">
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#D4A843]/10 text-[#D4A843] flex items-center gap-1">
                        <Palette className="w-2.5 h-2.5" />
                        {STYLE_LABELS[creation.style] || creation.style}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#00C853]/10 text-[#00C853] flex items-center gap-1">
                        <MapPin className="w-2.5 h-2.5" />
                        {ENV_LABELS[creation.environment] || creation.environment}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[#B0B0B0]/40 text-[10px] flex items-center gap-1">
                        <Clock className="w-2.5 h-2.5" />
                        {new Date(creation.createdAt).toLocaleDateString("es-ES")}
                      </span>
                      <span className="text-[10px] text-emerald-400/40 flex items-center gap-1">
                        <Shield className="w-2.5 h-2.5" />
                        BD
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* How it works - Educational Footer */}
          {completedCreations.length > 0 && (
            <div className="mt-16 p-6 bg-white/[0.01] border border-white/[0.04] rounded-2xl">
              <h3 className="font-['Space_Grotesk'] font-bold text-white text-lg mb-4 flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-[#D4A843]" />
                Cómo se crearon estas imágenes
              </h3>
              <div className="grid sm:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-white/[0.02] rounded-xl">
                  <div className="w-10 h-10 rounded-full bg-[#00E5FF]/10 flex items-center justify-center mx-auto mb-2">
                    <span className="font-['Space_Grotesk'] font-bold text-[#00E5FF]">1</span>
                  </div>
                  <p className="text-white text-xs font-bold mb-1">Sujeto</p>
                  <p className="text-[#B0B0B0]/60 text-[10px]">Describe qué quieres ver</p>
                </div>
                <div className="text-center p-4 bg-white/[0.02] rounded-xl">
                  <div className="w-10 h-10 rounded-full bg-[#D4A843]/10 flex items-center justify-center mx-auto mb-2">
                    <span className="font-['Space_Grotesk'] font-bold text-[#D4A843]">2</span>
                  </div>
                  <p className="text-white text-xs font-bold mb-1">Estilo</p>
                  <p className="text-[#B0B0B0]/60 text-[10px]">Elige el estilo visual</p>
                </div>
                <div className="text-center p-4 bg-white/[0.02] rounded-xl">
                  <div className="w-10 h-10 rounded-full bg-[#00C853]/10 flex items-center justify-center mx-auto mb-2">
                    <span className="font-['Space_Grotesk'] font-bold text-[#00C853]">3</span>
                  </div>
                  <p className="text-white text-xs font-bold mb-1">Entorno</p>
                  <p className="text-[#B0B0B0]/60 text-[10px]">Define dónde ocurre</p>
                </div>
                <div className="text-center p-4 bg-white/[0.02] rounded-xl">
                  <div className="w-10 h-10 rounded-full bg-[#9C27B0]/10 flex items-center justify-center mx-auto mb-2">
                    <span className="font-['Space_Grotesk'] font-bold text-[#9C27B0]">4</span>
                  </div>
                  <p className="text-white text-xs font-bold mb-1">Detalles</p>
                  <p className="text-[#B0B0B0]/60 text-[10px]">Añade colores e iluminación</p>
                </div>
              </div>
              <div className="mt-4 text-center">
                <a
                  href="/prompt-studio"
                  className="inline-flex items-center gap-2 text-[#00E5FF] text-sm font-medium hover:underline"
                >
                  <Camera className="w-4 h-4" />
                  Prueba Crear Imagen ahora
                </a>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Modal */}
      {selectedCreation && (
        <ImageModal creation={selectedCreation} onClose={() => setSelectedCreation(null)} />
      )}
    </div>
  );
}

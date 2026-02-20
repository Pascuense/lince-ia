import { tl } from "@/contexts/PRDLanguageContext";
import { useState, useMemo } from "react";
import {
  ArrowLeft,
  Clock,
  Image,
  FileText,
  Search,
  Filter,
  ExternalLink,
  Loader2,
  AlertCircle,
  Sparkles,
  Eye,
  Copy,
  CheckCircle,
  RefreshCw,
  X,
} from "lucide-react";
import { useGameLang } from "@/hooks/useGameLang";
import { trpc } from "@/lib/trpc";
import { UserNavBadge } from "@/components/UserNavBadge";
import { GlobalNavBar } from "@/components/GlobalNavBar";
import { BackButton } from "@/components/BackButton";

// ─── Translations ───
const TR: Record<string, Record<string, string>> = {
  es: {
    pageTitle: "Historial de Prompts",
    pageSubtitle: "Consulta y reutiliza todas tus creaciones anteriores",
    back: "Volver",
    search: "Buscar por tema, estilo o entorno...",
    all: "Todos",
    completed: "Completados",
    pending: "Pendientes",
    failed: "Fallidos",
    noResults: "No se encontraron prompts",
    noResultsDesc: "Crea tu primer prompt en IMAGELIN",
    goToStudio: "Ir a IMAGELIN",
    goToProStudio: "Ir al Prompt Profesional",
    loading: "Cargando historial...",
    error: "Error al cargar el historial",
    retry: "Reintentar",
    subject: "Tema",
    style: "Estilo",
    environment: "Entorno",
    details: "Detalles",
    enhancedPrompt: "Prompt mejorado",
    status: "Estado",
    date: "Fecha",
    copyPrompt: "Copiar prompt",
    copied: "¡Copiado!",
    reuseInStudio: "Reutilizar en Studio",
    viewImage: "Ver imagen",
    closePreview: "Cerrar",
    statusCompleted: "Completado",
    statusPending: "Pendiente",
    statusGenerating: "Generando...",
    statusFailed: "Fallido",
    totalCreations: "creaciones",
    imagePrompts: "Prompts de imagen",
    textPrompts: "Prompts de texto",
    gallery: "Ver Galería",
  },
  en: {
    pageTitle: "Prompt History",
    pageSubtitle: "View and reuse all your previous creations",
    back: "Back",
    search: "Search by topic, style or environment...",
    all: "All",
    completed: "Completed",
    pending: "Pending",
    failed: "Failed",
    noResults: "No prompts found",
    noResultsDesc: "Create your first prompt in the IMAGELIN",
    goToStudio: "Go to IMAGELIN",
    goToProStudio: "Go to Pro Prompt",
    loading: "Loading history...",
    error: "Error loading history",
    retry: "Retry",
    subject: "Subject",
    style: "Style",
    environment: "Environment",
    details: "Details",
    enhancedPrompt: "Enhanced prompt",
    status: "Status",
    date: "Date",
    copyPrompt: "Copy prompt",
    copied: "Copied!",
    reuseInStudio: "Reuse in Studio",
    viewImage: "View image",
    closePreview: "Close",
    statusCompleted: "Completed",
    statusPending: "Pending",
    statusGenerating: "Generating...",
    statusFailed: "Failed",
    totalCreations: "creations",
    imagePrompts: "Image prompts",
    textPrompts: "Text prompts",
    gallery: "View Gallery",
  },
  zh: {
    pageTitle: "提示词历史",
    pageSubtitle: "查看和重用您之前的所有创作",
    back: "返回",
    search: "按主题、风格或环境搜索...",
    all: "全部",
    completed: "已完成",
    pending: "待处理",
    failed: "失败",
    noResults: "未找到提示词",
    noResultsDesc: "在提示词工作室创建您的第一个提示词",
    goToStudio: "前往提示词工作室",
    goToProStudio: "前往专业提示词",
    loading: "加载历史记录...",
    error: "加载历史记录时出错",
    retry: "重试",
    subject: "主题",
    style: "风格",
    environment: "环境",
    details: "详情",
    enhancedPrompt: "增强提示词",
    status: "状态",
    date: "日期",
    copyPrompt: "复制提示词",
    copied: "已复制！",
    reuseInStudio: "在工作室中重用",
    viewImage: "查看图片",
    closePreview: "关闭",
    statusCompleted: "已完成",
    statusPending: "待处理",
    statusGenerating: "生成中...",
    statusFailed: "失败",
    totalCreations: "创作",
    imagePrompts: "图像提示词",
    textPrompts: "文本提示词",
    gallery: "查看画廊",
  },
};

const STATUS_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  completed: { bg: "bg-[#00C853]/10", text: "text-[#00C853]", border: "border-[#00C853]/30" },
  pending: { bg: "bg-[#FF9800]/10", text: "text-[#FF9800]", border: "border-[#FF9800]/30" },
  generating: { bg: "bg-[#00E5FF]/10", text: "text-[#00E5FF]", border: "border-[#00E5FF]/30" },
  failed: { bg: "bg-[#FF5252]/10", text: "text-[#FF5252]", border: "border-[#FF5252]/30" },
};

export default function PromptHistory() {
  const { lang } = useGameLang();
  const t = TR[lang] || TR.es;

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<number | null>(null);

  // Fetch all prompts from DB (public gallery)
  const { data: prompts, isLoading, error, refetch } = trpc.promptStudio.list.useQuery({ limit: 100, offset: 0 });

  const filteredPrompts = useMemo(() => {
    if (!prompts) return [];
    let filtered = [...prompts];

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((p) => p.status === statusFilter);
    }

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.subject.toLowerCase().includes(q) ||
          p.style.toLowerCase().includes(q) ||
          p.environment.toLowerCase().includes(q) ||
          (p.details && p.details.toLowerCase().includes(q)) ||
          (p.enhancedPrompt && p.enhancedPrompt.toLowerCase().includes(q))
      );
    }

    return filtered;
  }, [prompts, statusFilter, searchQuery]);

  const stats = useMemo(() => {
    if (!prompts) return { total: 0, completed: 0, withImage: 0 };
    return {
      total: prompts.length,
      completed: prompts.filter((p) => p.status === "completed").length,
      withImage: prompts.filter((p) => p.imageUrl).length,
    };
  }, [prompts]);

  const copyToClipboard = (text: string, id: number) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const formatDate = (date: Date | string) => {
    const d = new Date(date);
    return d.toLocaleDateString(tl(lang, { es: "es-ES", en: "en-US", zh: "zh-CN", 'pt-BR': "es-ES", 'pt-PT': "es-ES" }), {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusLabel = (status: string) => {
    const map: Record<string, string> = {
      completed: t.statusCompleted,
      pending: t.statusPending,
      generating: t.statusGenerating,
      failed: t.statusFailed,
    };
    return map[status] || status;
  };

  return (
    <div className="pt-14 bg-[#0A0A0A] min-h-screen">
      <BackButton variant="inline" fallbackPath="/promptear" />
      <GlobalNavBar />
      {/* Image Preview Modal */}
      {previewImage && (
        <div className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4" onClick={() => setPreviewImage(null)}>
          <button onClick={() => setPreviewImage(null)} className="absolute top-4 right-4 text-white/60 hover:text-white">
            <X className="w-6 h-6" />
          </button>
          <img src={previewImage} alt="" className="max-w-full max-h-[85vh] object-contain rounded-xl" />
        </div>
      )}

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#0A0A0A]/95 backdrop-blur-md border-b border-[#00E5FF]/10">
        <div className="container flex items-center justify-between h-16">
          <a href="/" className="flex items-center gap-2 text-[#B0B0B0] hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">{t.back}</span>
          </a>
          <div className="flex items-center gap-2">
            <a href="/prompt-studio" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#00E5FF]/10 border border-[#00E5FF]/30 text-[#00E5FF] text-xs font-bold hover:bg-[#00E5FF]/20 transition-all">
              <Image className="w-3.5 h-3.5" /> {t.goToStudio}
            </a>
            <a href="/prompt-profesional" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#D4A843]/10 border border-[#D4A843]/30 text-[#D4A843] text-xs font-bold hover:bg-[#D4A843]/20 transition-all">
              <FileText className="w-3.5 h-3.5" /> {t.goToProStudio}
            </a>
            <UserNavBadge variant="compact" />
          </div>
        </div>
      </header>

      <main className="pt-24 pb-16">
        <div className="container max-w-4xl">
          {/* Title */}
          <div className="mb-8">
            <h1 className="font-['Space_Grotesk'] font-bold text-3xl sm:text-4xl text-white mb-2">{t.pageTitle}</h1>
            <p className="text-[#B0B0B0] text-sm">{t.pageSubtitle}</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="p-4 rounded-xl bg-[#00E5FF]/[0.06] border border-[#00E5FF]/20 text-center">
              <Sparkles className="w-5 h-5 text-[#00E5FF] mx-auto mb-1" />
              <p className="text-white font-bold text-lg">{stats.total}</p>
              <p className="text-[#B0B0B0] text-[10px]">{t.totalCreations}</p>
            </div>
            <div className="p-4 rounded-xl bg-[#D4A843]/[0.06] border border-[#D4A843]/20 text-center">
              <Image className="w-5 h-5 text-[#D4A843] mx-auto mb-1" />
              <p className="text-white font-bold text-lg">{stats.withImage}</p>
              <p className="text-[#B0B0B0] text-[10px]">{t.imagePrompts}</p>
            </div>
            <div className="p-4 rounded-xl bg-emerald-500/[0.06] border border-emerald-500/20 text-center">
              <CheckCircle className="w-5 h-5 text-emerald-400 mx-auto mb-1" />
              <p className="text-white font-bold text-lg">{stats.completed}</p>
              <p className="text-[#B0B0B0] text-[10px]">{t.completed}</p>
            </div>
          </div>

          {/* Search & Filter */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#666]" />
              <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.search}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.1] text-white text-sm placeholder:text-[#666] focus:border-[#00E5FF]/50 focus:outline-none transition-colors" />
            </div>
            <div className="flex gap-1">
              {["all", "completed", "pending", "failed"].map((s) => (
                <button key={s} onClick={() => setStatusFilter(s)}
                  className={`px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                    statusFilter === s
                      ? "bg-[#00E5FF] text-[#0A0A0A]"
                      : "bg-white/[0.05] text-[#B0B0B0] hover:bg-white/[0.1]"
                  }`}>
                  {s === "all" ? t.all : s === "completed" ? t.completed : s === "pending" ? t.pending : t.failed}
                </button>
              ))}
            </div>
          </div>

          {/* Loading */}
          {isLoading && (
            <div className="text-center py-16">
              <Loader2 className="w-8 h-8 text-[#00E5FF] mx-auto mb-3 animate-spin" />
              <p className="text-[#B0B0B0] text-sm">{t.loading}</p>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="text-center py-16">
              <AlertCircle className="w-8 h-8 text-[#FF5252] mx-auto mb-3" />
              <p className="text-[#FF5252] text-sm mb-3">{t.error}</p>
              <button onClick={() => refetch()} className="flex items-center gap-1.5 mx-auto px-4 py-2 rounded-lg bg-[#FF5252]/10 text-[#FF5252] text-xs font-bold hover:bg-[#FF5252]/20 transition-all">
                <RefreshCw className="w-3.5 h-3.5" /> {t.retry}
              </button>
            </div>
          )}

          {/* Empty */}
          {!isLoading && !error && filteredPrompts.length === 0 && (
            <div className="text-center py-16">
              <Sparkles className="w-10 h-10 text-[#00E5FF]/20 mx-auto mb-3" />
              <p className="text-white text-lg font-bold mb-1">{t.noResults}</p>
              <p className="text-[#666] text-sm mb-4">{t.noResultsDesc}</p>
              <a href="/prompt-studio" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#00E5FF] text-[#0A0A0A] font-bold text-sm hover:brightness-110 transition-all">
                <Sparkles className="w-4 h-4" /> {t.goToStudio}
              </a>
            </div>
          )}

          {/* Prompt List */}
          <div className="space-y-3">
            {filteredPrompts.map((prompt) => {
              const statusStyle = STATUS_COLORS[prompt.status] || STATUS_COLORS.pending;
              return (
                <div key={prompt.id} className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] hover:border-white/[0.12] transition-all">
                  <div className="flex items-start gap-3">
                    {/* Thumbnail */}
                    {prompt.imageUrl && (
                      <button onClick={() => setPreviewImage(prompt.imageUrl!)} className="flex-shrink-0">
                        <img src={prompt.imageUrl} alt="" className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover border border-white/[0.1] hover:border-[#00E5FF]/50 transition-colors" />
                      </button>
                    )}

                    <div className="flex-1 min-w-0">
                      {/* Subject & Status */}
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className="text-white font-bold text-sm truncate">{prompt.subject}</h3>
                        <span className={`flex-shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full border ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`}>
                          {getStatusLabel(prompt.status)}
                        </span>
                      </div>

                      {/* Meta */}
                      <div className="flex flex-wrap gap-1.5 mb-2">
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#D4A843]/10 text-[#D4A843] border border-[#D4A843]/20">{prompt.style}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#00E5FF]/10 text-[#00E5FF] border border-[#00E5FF]/20">{prompt.environment}</span>
                      </div>

                      {/* Enhanced prompt preview */}
                      {prompt.enhancedPrompt && (
                        <p className="text-[#888] text-xs leading-relaxed line-clamp-2 mb-2">{prompt.enhancedPrompt}</p>
                      )}

                      {/* Actions & Date */}
                      <div className="flex items-center justify-between">
                        <div className="flex gap-1.5">
                          {prompt.enhancedPrompt && (
                            <button onClick={() => copyToClipboard(prompt.enhancedPrompt!, prompt.id)}
                              className="flex items-center gap-1 px-2 py-1 rounded-md bg-white/[0.05] text-[#B0B0B0] text-[10px] hover:bg-white/[0.1] transition-all">
                              {copiedId === prompt.id ? <CheckCircle className="w-3 h-3 text-[#00C853]" /> : <Copy className="w-3 h-3" />}
                              {copiedId === prompt.id ? t.copied : t.copyPrompt}
                            </button>
                          )}
                          {prompt.imageUrl && (
                            <button onClick={() => setPreviewImage(prompt.imageUrl!)}
                              className="flex items-center gap-1 px-2 py-1 rounded-md bg-white/[0.05] text-[#B0B0B0] text-[10px] hover:bg-white/[0.1] transition-all">
                              <Eye className="w-3 h-3" /> {t.viewImage}
                            </button>
                          )}
                          <a href={`/prompt-studio?subject=${encodeURIComponent(prompt.subject)}&style=${encodeURIComponent(prompt.style)}&environment=${encodeURIComponent(prompt.environment)}&details=${encodeURIComponent(prompt.details || "")}`}
                            className="flex items-center gap-1 px-2 py-1 rounded-md bg-[#00E5FF]/[0.05] text-[#00E5FF] text-[10px] hover:bg-[#00E5FF]/[0.1] transition-all">
                            <RefreshCw className="w-3 h-3" /> {t.reuseInStudio}
                          </a>
                        </div>
                        <span className="text-[#666] text-[10px] flex items-center gap-1 flex-shrink-0">
                          <Clock className="w-3 h-3" /> {formatDate(prompt.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}

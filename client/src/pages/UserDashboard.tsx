import { useState, useEffect, useMemo } from "react";
import {
  ArrowLeft,
  BarChart3,
  BookOpen,
  Brain,
  Clock,
  Eye,
  FileText,
  Lightbulb,
  Sparkles,
  TrendingUp,
  Wrench,
  Zap,
  ChevronRight,
  Copy,
  ExternalLink,
} from "lucide-react";
import { useGameLang } from "@/hooks/useGameLang";
import { trpc } from "@/lib/trpc";
import { AVATAR_FRONTAL } from "@/lib/avatarConstants";
import { UserNavBadge } from "@/components/UserNavBadge";
import { GlobalNavBar } from "@/components/GlobalNavBar";
import { BackButton } from "@/components/BackButton";

// ─── Translations ───
const TR: Record<string, Record<string, string>> = {
  es: {
    title: "Mi Panel de Control",
    subtitle: "Estadísticas de tu actividad en LINCE",
    back: "Volver",
    totalPrompts: "Prompts Creados",
    totalCourses: "Cursos Diseñados",
    totalToolViews: "Herramientas Consultadas",
    recentPrompts: "Últimos Prompts",
    recentCourses: "Últimos Cursos",
    recentTools: "Herramientas Recientes",
    noData: "Aún no tienes actividad. ¡Empieza a explorar!",
    noPrompts: "No has creado prompts aún",
    noCourses: "No has diseñado cursos aún",
    noTools: "No has consultado herramientas aún",
    viewAll: "Ver todo",
    views: "visitas",
    score: "Puntuación",
    visual: "Visual",
    profesional: "Profesional",
    modules: "módulos",
    lastViewed: "Última visita",
    created: "Creado",
    loginRequired: "Inicia sesión para ver tu panel",
    loginBtn: "Iniciar Sesión",
    avatarSays: "¡Hola! Aquí puedes ver todo lo que has aprendido y creado. ¡Sigue así!",
    startExploring: "Empieza a explorar",
    goToArsenal: "Ver Herramientas IA",
    goToPromptStudio: "Crear Imagen",
    goToCourseBuilder: "Crea tu Curso",
    activityOverview: "Resumen de Actividad",
    quickActions: "Acciones Rápidas",
  },
  en: {
    title: "My Dashboard",
    subtitle: "Your activity statistics on LINCE",
    back: "Back",
    totalPrompts: "Prompts Created",
    totalCourses: "Courses Designed",
    totalToolViews: "Tools Consulted",
    recentPrompts: "Recent Prompts",
    recentCourses: "Recent Courses",
    recentTools: "Recent Tools",
    noData: "No activity yet. Start exploring!",
    noPrompts: "No prompts created yet",
    noCourses: "No courses designed yet",
    noTools: "No tools consulted yet",
    viewAll: "View all",
    views: "views",
    score: "Score",
    visual: "Visual",
    profesional: "Professional",
    modules: "modules",
    lastViewed: "Last viewed",
    created: "Created",
    loginRequired: "Log in to see your dashboard",
    loginBtn: "Log In",
    avatarSays: "Hi! Here you can see everything you've learned and created. Keep it up!",
    startExploring: "Start exploring",
    goToArsenal: "Go to AI Arsenal",
    goToPromptStudio: "Create Image",
    goToCourseBuilder: "Create Course",
    activityOverview: "Activity Overview",
    quickActions: "Quick Actions",
  },
  zh: {
    title: "我的控制面板",
    subtitle: "您在LINCE上的活动统计",
    back: "返回",
    totalPrompts: "创建的提示词",
    totalCourses: "设计的课程",
    totalToolViews: "查看的工具",
    recentPrompts: "最近的提示词",
    recentCourses: "最近的课程",
    recentTools: "最近的工具",
    noData: "暂无活动。开始探索吧！",
    noPrompts: "暂无提示词",
    noCourses: "暂无课程",
    noTools: "暂无工具",
    viewAll: "查看全部",
    views: "次查看",
    score: "评分",
    visual: "视觉",
    profesional: "专业",
    modules: "模块",
    lastViewed: "最后查看",
    created: "创建于",
    loginRequired: "请登录查看面板",
    loginBtn: "登录",
    avatarSays: "你好！在这里你可以看到你学到和创造的一切。继续加油！",
    startExploring: "开始探索",
    goToArsenal: "前往AI武器库",
    goToPromptStudio: "前往山猫图像",
    goToCourseBuilder: "前往课程构建器",
    activityOverview: "活动概览",
    quickActions: "快捷操作",
  },
};

function formatDate(dateStr: string | Date | null | undefined): string {
  if (!dateStr) return "-";
  const d = new Date(dateStr);
  return d.toLocaleDateString("es-ES", { day: "2-digit", month: "short", year: "numeric" });
}

export default function UserDashboard() {
  const { lang } = useGameLang();
  const t = TR[lang] || TR.es;

  // Get logged-in game player from localStorage
  const [gamePlayer, setGamePlayer] = useState<{ id: number; username: string; realName: string } | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("lince-user");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.id) setGamePlayer(parsed);
      }
    } catch {}
  }, []);

  // Fetch dashboard stats
  const { data: stats, isLoading } = trpc.dashboard.stats.useQuery(
    { gamePlayerId: gamePlayer?.id ?? 0 },
    { enabled: !!gamePlayer?.id }
  );

  // Not logged in
  if (!gamePlayer) {
    return (
      <div className="pt-14 bg-[#0A0A0A] min-h-screen flex items-center justify-center">
      <BackButton variant="inline" />
      <GlobalNavBar />
        <div className="text-center max-w-md px-6">
          <Brain className="w-16 h-16 text-[#00E5FF]/30 mx-auto mb-6" />
          <h1 className="font-display font-bold text-2xl text-white mb-3">{t.loginRequired}</h1>
          <p className="text-[#B0B0B0] text-sm mb-6">{t.noData}</p>
          <a href="/login" className="inline-flex items-center gap-2 px-6 py-3 bg-[#00E5FF] text-[#0A0A0A] font-bold rounded-xl hover:brightness-110 transition-all">
            {t.loginBtn}
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#0A0A0A] min-h-screen">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#0A0A0A]/95 backdrop-blur-md border-b border-[#00E5FF]/10">
        <div className="container flex items-center justify-between h-16">
          <a href="/" className="flex items-center gap-2 text-[#B0B0B0] hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">{t.back}</span>
          </a>
          <div className="flex items-center gap-2">
            <UserNavBadge variant="compact" />
          </div>
        </div>
      </header>

      <main className="pt-24 pb-16">
        <div className="container max-w-5xl">
          {/* Title + Avatar */}
          <div className="mb-10 flex flex-col sm:flex-row items-start gap-6">
            <div className="flex-1">
              <h1 className="font-display font-bold text-3xl sm:text-4xl text-white mb-2">{t.title}</h1>
              <p className="text-[#B0B0B0] text-sm">{t.subtitle}</p>
            </div>
            <div className="flex items-start gap-3 p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] max-w-sm">
              <img src={AVATAR_FRONTAL.SABELIN} alt="" className="w-12 h-12 rounded-full object-cover border-2 border-[#00E5FF] flex-shrink-0" />
              <p className="text-[#B0B0B0] text-xs italic leading-relaxed">"{t.avatarSays}"</p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
            <div className="p-5 rounded-2xl bg-gradient-to-br from-[#00E5FF]/[0.08] to-transparent border border-[#00E5FF]/20">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-[#00E5FF]/10 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-[#00E5FF]" />
                </div>
                <span className="text-[#B0B0B0] text-sm font-medium">{t.totalPrompts}</span>
              </div>
              <p className="font-display font-bold text-3xl text-white">
                {isLoading ? "..." : stats?.totalPrompts ?? 0}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-gradient-to-br from-[#D4A843]/[0.08] to-transparent border border-[#D4A843]/20">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-[#D4A843]/10 flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-[#D4A843]" />
                </div>
                <span className="text-[#B0B0B0] text-sm font-medium">{t.totalCourses}</span>
              </div>
              <p className="font-display font-bold text-3xl text-white">
                {isLoading ? "..." : stats?.totalCourses ?? 0}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-gradient-to-br from-[#9C27B0]/[0.08] to-transparent border border-[#9C27B0]/20">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-[#9C27B0]/10 flex items-center justify-center">
                  <Wrench className="w-5 h-5 text-[#9C27B0]" />
                </div>
                <span className="text-[#B0B0B0] text-sm font-medium">{t.totalToolViews}</span>
              </div>
              <p className="font-display font-bold text-3xl text-white">
                {isLoading ? "..." : stats?.totalToolViews ?? 0}
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mb-10">
            <h2 className="font-display font-bold text-lg text-white mb-4 flex items-center gap-2">
              <Zap className="w-4 h-4 text-[#00E5FF]" /> {t.quickActions}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <a href="/arsenal-ia" className="flex items-center gap-3 p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:border-[#00E5FF]/30 transition-all group">
                <Wrench className="w-5 h-5 text-[#00E5FF]" />
                <span className="text-sm text-[#B0B0B0] group-hover:text-white transition-colors">{t.goToArsenal}</span>
                <ChevronRight className="w-4 h-4 text-[#B0B0B0]/30 ml-auto" />
              </a>
              <a href="/prompt-studio" className="flex items-center gap-3 p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:border-[#D4A843]/30 transition-all group">
                <Sparkles className="w-5 h-5 text-[#D4A843]" />
                <span className="text-sm text-[#B0B0B0] group-hover:text-white transition-colors">{t.goToPromptStudio}</span>
                <ChevronRight className="w-4 h-4 text-[#B0B0B0]/30 ml-auto" />
              </a>
              <a href="/course-builder" className="flex items-center gap-3 p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:border-[#9C27B0]/30 transition-all group">
                <BookOpen className="w-5 h-5 text-[#9C27B0]" />
                <span className="text-sm text-[#B0B0B0] group-hover:text-white transition-colors">{t.goToCourseBuilder}</span>
                <ChevronRight className="w-4 h-4 text-[#B0B0B0]/30 ml-auto" />
              </a>
            </div>
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Prompts */}
            <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display font-bold text-base text-white flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#00E5FF]" /> {t.recentPrompts}
                </h3>
                <a href="/historial-prompts" className="text-xs text-[#00E5FF] hover:underline">{t.viewAll}</a>
              </div>
              {!stats?.recentPrompts?.length ? (
                <p className="text-[#666] text-sm text-center py-8">{t.noPrompts}</p>
              ) : (
                <div className="space-y-3">
                  {stats.recentPrompts.map((p: any, i: number) => (
                    <div key={i} className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:border-white/[0.1] transition-all">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          p.type === "visual" ? "bg-[#D4A843]/10 text-[#D4A843]" : "bg-[#00E5FF]/10 text-[#00E5FF]"
                        }`}>
                          {p.type === "visual" ? t.visual : t.profesional}
                        </span>
                        {p.qualityScore && (
                          <span className="text-[10px] text-[#B0B0B0]">{t.score}: {p.qualityScore}/10</span>
                        )}
                        <span className="text-[10px] text-[#666] ml-auto">{formatDate(p.createdAt)}</span>
                      </div>
                      <p className="text-xs text-[#B0B0B0] line-clamp-2">{p.generatedPrompt || p.inputSubject || "-"}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Recent Tools */}
            <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display font-bold text-base text-white flex items-center gap-2">
                  <Wrench className="w-4 h-4 text-[#9C27B0]" /> {t.recentTools}
                </h3>
                <a href="/arsenal-ia" className="text-xs text-[#9C27B0] hover:underline">{t.viewAll}</a>
              </div>
              {!stats?.recentTools?.length ? (
                <p className="text-[#666] text-sm text-center py-8">{t.noTools}</p>
              ) : (
                <div className="space-y-3">
                  {stats.recentTools.map((tv: any, i: number) => (
                    <a key={i} href={`/arsenal-ia/${tv.toolId}`} className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:border-[#9C27B0]/30 transition-all">
                      <div className="w-8 h-8 rounded-lg bg-[#9C27B0]/10 flex items-center justify-center flex-shrink-0">
                        <Eye className="w-4 h-4 text-[#9C27B0]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-white font-medium truncate">{tv.toolName}</p>
                        <p className="text-[10px] text-[#666]">{tv.viewCount} {t.views}</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-[#B0B0B0]/30 flex-shrink-0" />
                    </a>
                  ))}
                </div>
              )}
            </div>

            {/* Recent Courses */}
            <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06] lg:col-span-2">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display font-bold text-base text-white flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-[#D4A843]" /> {t.recentCourses}
                </h3>
                <a href="/course-builder" className="text-xs text-[#D4A843] hover:underline">{t.viewAll}</a>
              </div>
              {!stats?.recentCourses?.length ? (
                <p className="text-[#666] text-sm text-center py-8">{t.noCourses}</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {stats.recentCourses.map((c: any, i: number) => (
                    <div key={i} className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:border-[#D4A843]/30 transition-all">
                      <h4 className="text-sm text-white font-bold mb-1 line-clamp-1">{c.title}</h4>
                      <p className="text-xs text-[#B0B0B0] line-clamp-2 mb-2">{c.description || "-"}</p>
                      <div className="flex items-center gap-2 text-[10px] text-[#666]">
                        <span className="px-2 py-0.5 rounded-full bg-white/[0.05]">{c.level}</span>
                        <span>{c.duration}h</span>
                        <span className="ml-auto">{formatDate(c.updatedAt)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

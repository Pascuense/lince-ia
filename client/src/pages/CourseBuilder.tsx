import { useState, useCallback } from "react";
import {
  ArrowLeft,
  Plus,
  Trash2,
  GripVertical,
  Save,
  Download,
  BookOpen,
  Clock,
  Target,
  Layers,
  ChevronDown,
  ChevronUp,
  FileText,
  Video,
  HelpCircle,
  CheckCircle,
  Lightbulb,
  Zap,
  Star,
  FolderOpen,
  Edit3,
  Trash,
  Database,
} from "lucide-react";
import { useGameLang } from "@/hooks/useGameLang";
import { AVATAR_FRONTAL } from "@/lib/avatarConstants";
import { trpc } from "@/lib/trpc";
import { UserNavBadge } from "@/components/UserNavBadge";
import { toast as sonnerToast } from "sonner";
import { GlobalNavBar } from "@/components/GlobalNavBar";
import { BackButton } from "@/components/BackButton";

// ─── Types ───
interface Lesson {
  id: string;
  title: string;
  type: "video" | "text" | "quiz" | "practice";
  duration: number; // minutes
  description: string;
}

interface Module {
  id: string;
  title: string;
  description: string;
  lessons: Lesson[];
  expanded: boolean;
}

interface CourseData {
  title: string;
  description: string;
  category: string;
  difficulty: string;
  targetAudience: string;
  estimatedHours: number;
  modules: Module[];
}

// ─── Translations ───
const TR: Record<string, Record<string, string>> = {
  es: {
    pageTitle: "Course Builder",
    pageSubtitle: "Diseña tu propio curso formativo de IA paso a paso",
    back: "Volver",
    courseTitle: "Título del curso",
    courseTitlePlaceholder: "Ej: Introducción a la Inteligencia Artificial",
    courseDesc: "Descripción",
    courseDescPlaceholder: "Describe de qué trata tu curso y qué aprenderán los estudiantes...",
    category: "Categoría",
    difficulty: "Dificultad",
    targetAudience: "Público objetivo",
    targetAudiencePlaceholder: "Ej: Profesionales de marketing sin experiencia técnica",
    modules: "Módulos",
    addModule: "Añadir módulo",
    moduleTitle: "Título del módulo",
    moduleTitlePlaceholder: "Ej: Fundamentos de IA",
    moduleDesc: "Descripción del módulo",
    moduleDescPlaceholder: "¿Qué aprenderán en este módulo?",
    lessons: "Lecciones",
    addLesson: "Añadir lección",
    lessonTitle: "Título",
    lessonTitlePlaceholder: "Ej: ¿Qué es la IA?",
    lessonType: "Tipo",
    lessonDuration: "Duración (min)",
    lessonDesc: "Descripción",
    lessonDescPlaceholder: "Breve descripción de la lección...",
    deleteModule: "Eliminar módulo",
    deleteLesson: "Eliminar lección",
    saveDraft: "Guardar borrador",
    exportJSON: "Exportar JSON",
    preview: "Vista previa",
    summary: "Resumen del curso",
    totalModules: "Módulos totales",
    totalLessons: "Lecciones totales",
    estimatedTime: "Tiempo estimado",
    hours: "horas",
    minutes: "min",
    video: "Video",
    text: "Texto",
    quiz: "Quiz",
    practice: "Práctica",
    beginner: "Principiante",
    intermediate: "Intermedio",
    advanced: "Avanzado",
    catIA: "Inteligencia Artificial",
    catML: "Machine Learning",
    catPrompt: "Prompt Engineering",
    catAuto: "Automatización",
    catData: "Datos y Analítica",
    catDesign: "Diseño con IA",
    catBusiness: "Negocios e IA",
    catOther: "Otro",
    savedLocally: "Borrador guardado localmente",
    exported: "Curso exportado como JSON",
    avatarTip: "¡Buen trabajo! Organiza tu curso en módulos de 3-5 lecciones para que sea fácil de seguir.",
    emptyState: "Empieza añadiendo tu primer módulo",
    coursePreview: "Vista Previa del Curso",
    close: "Cerrar",
  },
  en: {
    pageTitle: "Course Builder",
    pageSubtitle: "Design your own AI training course step by step",
    back: "Back",
    courseTitle: "Course title",
    courseTitlePlaceholder: "E.g.: Introduction to Artificial Intelligence",
    courseDesc: "Description",
    courseDescPlaceholder: "Describe what your course is about and what students will learn...",
    category: "Category",
    difficulty: "Difficulty",
    targetAudience: "Target audience",
    targetAudiencePlaceholder: "E.g.: Marketing professionals with no technical experience",
    modules: "Modules",
    addModule: "Add module",
    moduleTitle: "Module title",
    moduleTitlePlaceholder: "E.g.: AI Fundamentals",
    moduleDesc: "Module description",
    moduleDescPlaceholder: "What will they learn in this module?",
    lessons: "Lessons",
    addLesson: "Add lesson",
    lessonTitle: "Title",
    lessonTitlePlaceholder: "E.g.: What is AI?",
    lessonType: "Type",
    lessonDuration: "Duration (min)",
    lessonDesc: "Description",
    lessonDescPlaceholder: "Brief lesson description...",
    deleteModule: "Delete module",
    deleteLesson: "Delete lesson",
    saveDraft: "Save draft",
    exportJSON: "Export JSON",
    preview: "Preview",
    summary: "Course summary",
    totalModules: "Total modules",
    totalLessons: "Total lessons",
    estimatedTime: "Estimated time",
    hours: "hours",
    minutes: "min",
    video: "Video",
    text: "Text",
    quiz: "Quiz",
    practice: "Practice",
    beginner: "Beginner",
    intermediate: "Intermediate",
    advanced: "Advanced",
    catIA: "Artificial Intelligence",
    catML: "Machine Learning",
    catPrompt: "Prompt Engineering",
    catAuto: "Automation",
    catData: "Data & Analytics",
    catDesign: "Design with AI",
    catBusiness: "Business & AI",
    catOther: "Other",
    savedLocally: "Draft saved locally",
    exported: "Course exported as JSON",
    avatarTip: "Great job! Organize your course into modules of 3-5 lessons to make it easy to follow.",
    emptyState: "Start by adding your first module",
    coursePreview: "Course Preview",
    close: "Close",
  },
  zh: {
    pageTitle: "课程构建器",
    pageSubtitle: "逐步设计您自己的AI培训课程",
    back: "返回",
    courseTitle: "课程标题",
    courseTitlePlaceholder: "例如：人工智能入门",
    courseDesc: "描述",
    courseDescPlaceholder: "描述您的课程内容和学生将学到什么...",
    category: "类别",
    difficulty: "难度",
    targetAudience: "目标受众",
    targetAudiencePlaceholder: "例如：没有技术经验的营销专业人士",
    modules: "模块",
    addModule: "添加模块",
    moduleTitle: "模块标题",
    moduleTitlePlaceholder: "例如：AI基础",
    moduleDesc: "模块描述",
    moduleDescPlaceholder: "在这个模块中他们将学到什么？",
    lessons: "课程",
    addLesson: "添加课程",
    lessonTitle: "标题",
    lessonTitlePlaceholder: "例如：什么是AI？",
    lessonType: "类型",
    lessonDuration: "时长（分钟）",
    lessonDesc: "描述",
    lessonDescPlaceholder: "课程简要描述...",
    deleteModule: "删除模块",
    deleteLesson: "删除课程",
    saveDraft: "保存草稿",
    exportJSON: "导出JSON",
    preview: "预览",
    summary: "课程摘要",
    totalModules: "总模块数",
    totalLessons: "总课程数",
    estimatedTime: "预计时间",
    hours: "小时",
    minutes: "分钟",
    video: "视频",
    text: "文本",
    quiz: "测验",
    practice: "练习",
    beginner: "初级",
    intermediate: "中级",
    advanced: "高级",
    catIA: "人工智能",
    catML: "机器学习",
    catPrompt: "提示工程",
    catAuto: "自动化",
    catData: "数据与分析",
    catDesign: "AI设计",
    catBusiness: "商业与AI",
    catOther: "其他",
    savedLocally: "课程已保存到云端",
    exported: "课程已导出为JSON",
    savedCourses: "我保存的课程",
    loadCourse: "加载",
    deleteCourse: "删除",
    newCourse: "新课程",
    confirmDelete: "删除这个课程？",
    courseDeleted: "课程已删除",
    noSavedCourses: "还没有保存的课程",
    loginToSave: "登录后可保存课程到云端",
    presencialTitle: "线下课程",
    presencialDesc: "我们提供线下课程，有日程安排。已创建的课程或按需定制的课程。",
    presencialContact: "培训联系",
    generalContact: "一般沟通",
    avatarTip: "做得好！将课程组织成3-5节课的模块，便于学习。",
    emptyState: "从添加第一个模块开始",
    coursePreview: "课程预览",
    close: "关闭",
  },
};

const LESSON_ICONS: Record<string, React.ReactNode> = {
  video: <Video className="w-4 h-4" />,
  text: <FileText className="w-4 h-4" />,
  quiz: <HelpCircle className="w-4 h-4" />,
  practice: <Zap className="w-4 h-4" />,
};

function genId() {
  return Math.random().toString(36).slice(2, 10);
}

export default function CourseBuilder() {
  const { lang } = useGameLang();
  const t = TR[lang] || TR.es;

  const [showPreview, setShowPreview] = useState(false);
  // Toast now uses sonner globally

  // Get logged-in player from localStorage
  const [playerId] = useState<number | null>(() => {
    try {
      const u = localStorage.getItem("lince-user");
      if (u) { const p = JSON.parse(u); return p.id ?? null; }
    } catch {}
    return null;
  });

  const [editingCourseId, setEditingCourseId] = useState<number | null>(null);
  const [showSavedCourses, setShowSavedCourses] = useState(false);

  const [course, setCourse] = useState<CourseData>({
    title: "",
    description: "",
    category: "ia",
    difficulty: "beginner",
    targetAudience: "",
    estimatedHours: 0,
    modules: [],
  });

  // tRPC hooks for DB persistence
  const savedCoursesQuery = trpc.courses.list.useQuery(
    { gamePlayerId: playerId ?? 0 },
    { enabled: !!playerId }
  );
  const createCourseMut = trpc.courses.create.useMutation({
    onSuccess: () => { savedCoursesQuery.refetch(); },
  });
  const updateCourseMut = trpc.courses.update.useMutation({
    onSuccess: () => { savedCoursesQuery.refetch(); },
  });
  const deleteCourseMut = trpc.courses.delete.useMutation({
    onSuccess: () => { savedCoursesQuery.refetch(); },
  });

  const showToast = (msg: string) => {
    sonnerToast.success(msg);
  };

  const updateCourse = useCallback((updates: Partial<CourseData>) => {
    setCourse((prev) => ({ ...prev, ...updates }));
  }, []);

  const addModule = () => {
    setCourse((prev) => ({
      ...prev,
      modules: [
        ...prev.modules,
        { id: genId(), title: "", description: "", lessons: [], expanded: true },
      ],
    }));
  };

  const removeModule = (moduleId: string) => {
    setCourse((prev) => ({
      ...prev,
      modules: prev.modules.filter((m) => m.id !== moduleId),
    }));
  };

  const updateModule = (moduleId: string, updates: Partial<Module>) => {
    setCourse((prev) => ({
      ...prev,
      modules: prev.modules.map((m) => (m.id === moduleId ? { ...m, ...updates } : m)),
    }));
  };

  const toggleModule = (moduleId: string) => {
    updateModule(moduleId, { expanded: !course.modules.find((m) => m.id === moduleId)?.expanded });
  };

  const addLesson = (moduleId: string) => {
    setCourse((prev) => ({
      ...prev,
      modules: prev.modules.map((m) =>
        m.id === moduleId
          ? { ...m, lessons: [...m.lessons, { id: genId(), title: "", type: "video", duration: 15, description: "" }] }
          : m
      ),
    }));
  };

  const removeLesson = (moduleId: string, lessonId: string) => {
    setCourse((prev) => ({
      ...prev,
      modules: prev.modules.map((m) =>
        m.id === moduleId ? { ...m, lessons: m.lessons.filter((l) => l.id !== lessonId) } : m
      ),
    }));
  };

  const updateLesson = (moduleId: string, lessonId: string, updates: Partial<Lesson>) => {
    setCourse((prev) => ({
      ...prev,
      modules: prev.modules.map((m) =>
        m.id === moduleId
          ? { ...m, lessons: m.lessons.map((l) => (l.id === lessonId ? { ...l, ...updates } : l)) }
          : m
      ),
    }));
  };

  const saveDraft = async () => {
    if (!playerId) {
      localStorage.setItem("lince-course-draft", JSON.stringify(course));
      showToast(t.loginToSave);
      return;
    }
    try {
      const modulesForDB = course.modules.map(m => ({
        id: m.id, title: m.title, description: m.description,
        lessons: m.lessons.map(l => ({ id: l.id, title: l.title, type: l.type, duration: l.duration, description: l.description })),
      }));
      if (editingCourseId) {
        await updateCourseMut.mutateAsync({
          id: editingCourseId, gamePlayerId: playerId,
          title: course.title, description: course.description || null,
          category: course.category, difficulty: course.difficulty,
          targetAudience: course.targetAudience || null,
          estimatedHours: totalHours, courseData: { modules: modulesForDB },
        });
      } else {
        const created = await createCourseMut.mutateAsync({
          gamePlayerId: playerId, title: course.title || "Sin t\u00edtulo",
          description: course.description, category: course.category,
          difficulty: course.difficulty, targetAudience: course.targetAudience,
          estimatedHours: totalHours, courseData: { modules: modulesForDB },
        });
        setEditingCourseId(created.id);
      }
      showToast(t.savedLocally);
    } catch (err) {
      console.error("Error saving course:", err);
      localStorage.setItem("lince-course-draft", JSON.stringify(course));
      showToast(t.savedLocally);
    }
  };

  const loadCourse = (c: any) => {
    setEditingCourseId(c.id);
    const modules = (c.courseData?.modules || []).map((m: any) => ({ ...m, expanded: false }));
    setCourse({ title: c.title || "", description: c.description || "", category: c.category || "ia",
      difficulty: c.difficulty || "beginner", targetAudience: c.targetAudience || "",
      estimatedHours: c.estimatedHours || 0, modules });
    setShowSavedCourses(false);
    showToast(`Cargado: ${c.title}`);
  };

  const handleDeleteCourse = async (courseId: number) => {
    if (!playerId) return;
    if (!confirm(t.confirmDelete)) return;
    await deleteCourseMut.mutateAsync({ id: courseId, gamePlayerId: playerId });
    if (editingCourseId === courseId) {
      setEditingCourseId(null);
      setCourse({ title: "", description: "", category: "ia", difficulty: "beginner", targetAudience: "", estimatedHours: 0, modules: [] });
    }
    showToast(t.courseDeleted);
  };

  const newCourse = () => {
    setEditingCourseId(null);
    setCourse({ title: "", description: "", category: "ia", difficulty: "beginner", targetAudience: "", estimatedHours: 0, modules: [] });
  };

  const exportJSON = () => {
    const blob = new Blob([JSON.stringify(course, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${course.title || "course"}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast(t.exported);
  };

  // Stats
  const totalLessons = course.modules.reduce((sum, m) => sum + m.lessons.length, 0);
  const totalMinutes = course.modules.reduce((sum, m) => sum + m.lessons.reduce((s, l) => s + l.duration, 0), 0);
  const totalHours = Math.floor(totalMinutes / 60);
  const remainingMin = totalMinutes % 60;

  const categories = [
    { value: "ia", label: t.catIA },
    { value: "ml", label: t.catML },
    { value: "prompt", label: t.catPrompt },
    { value: "auto", label: t.catAuto },
    { value: "data", label: t.catData },
    { value: "design", label: t.catDesign },
    { value: "business", label: t.catBusiness },
    { value: "other", label: t.catOther },
  ];

  const difficulties = [
    { value: "beginner", label: t.beginner },
    { value: "intermediate", label: t.intermediate },
    { value: "advanced", label: t.advanced },
  ];

  const lessonTypes = [
    { value: "video", label: t.video },
    { value: "text", label: t.text },
    { value: "quiz", label: t.quiz },
    { value: "practice", label: t.practice },
  ];

  return (
    <div className="pt-14 bg-[#0A0A0A] min-h-screen">
      <BackButton variant="inline" />
      <GlobalNavBar />
      {/* Toast handled by global Sonner Toaster */}

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#0A0A0A]/95 backdrop-blur-md border-b border-[#00E5FF]/10">
        <div className="container flex items-center justify-between h-16">
          <a href="/" className="flex items-center gap-2 text-[#B0B0B0] hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">{t.back}</span>
          </a>
          <div className="flex items-center gap-2">
            <button onClick={saveDraft} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#00E5FF]/10 border border-[#00E5FF]/30 text-[#00E5FF] text-xs font-bold hover:bg-[#00E5FF]/20 transition-all">
              <Save className="w-3.5 h-3.5" /> {t.saveDraft}
            </button>
            <button onClick={exportJSON} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#D4A843]/10 border border-[#D4A843]/30 text-[#D4A843] text-xs font-bold hover:bg-[#D4A843]/20 transition-all">
              <Download className="w-3.5 h-3.5" /> {t.exportJSON}
            </button>
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

          {/* Avatar tip */}
          <div className="mb-8 p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] flex items-start gap-3">
            <img src={AVATAR_FRONTAL.SABELIN} alt="" className="w-10 h-10 rounded-full object-cover border-2 border-[#00E5FF] flex-shrink-0" />
            <div>
              <p className="text-[#00E5FF] text-xs font-bold mb-0.5">SABELIN</p>
              <p className="text-[#B0B0B0] text-xs italic">{t.avatarTip}</p>
            </div>
          </div>

          {/* Course Info */}
          <div className="mb-8 p-5 rounded-2xl bg-white/[0.03] border border-white/[0.08] space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#B0B0B0] mb-1.5">{t.courseTitle}</label>
              <input type="text" value={course.title} onChange={(e) => updateCourse({ title: e.target.value })}
                placeholder={t.courseTitlePlaceholder}
                className="w-full px-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.1] text-white text-sm placeholder:text-[#666] focus:border-[#00E5FF]/50 focus:outline-none transition-colors" />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#B0B0B0] mb-1.5">{t.courseDesc}</label>
              <textarea value={course.description} onChange={(e) => updateCourse({ description: e.target.value })}
                placeholder={t.courseDescPlaceholder} rows={3}
                className="w-full px-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.1] text-white text-sm placeholder:text-[#666] focus:border-[#00E5FF]/50 focus:outline-none transition-colors resize-none" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#B0B0B0] mb-1.5">{t.category}</label>
                <select value={course.category} onChange={(e) => updateCourse({ category: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.1] text-white text-sm focus:border-[#00E5FF]/50 focus:outline-none transition-colors">
                  {categories.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-[#B0B0B0] mb-1.5">{t.difficulty}</label>
                <select value={course.difficulty} onChange={(e) => updateCourse({ difficulty: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.1] text-white text-sm focus:border-[#00E5FF]/50 focus:outline-none transition-colors">
                  {difficulties.map((d) => <option key={d.value} value={d.value}>{d.label}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-[#B0B0B0] mb-1.5">{t.targetAudience}</label>
                <input type="text" value={course.targetAudience} onChange={(e) => updateCourse({ targetAudience: e.target.value })}
                  placeholder={t.targetAudiencePlaceholder}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.1] text-white text-sm placeholder:text-[#666] focus:border-[#00E5FF]/50 focus:outline-none transition-colors" />
              </div>
            </div>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-3 gap-3 mb-8">
            <div className="p-4 rounded-xl bg-[#00E5FF]/[0.06] border border-[#00E5FF]/20 text-center">
              <Layers className="w-5 h-5 text-[#00E5FF] mx-auto mb-1" />
              <p className="text-white font-bold text-lg">{course.modules.length}</p>
              <p className="text-[#B0B0B0] text-[10px]">{t.totalModules}</p>
            </div>
            <div className="p-4 rounded-xl bg-[#D4A843]/[0.06] border border-[#D4A843]/20 text-center">
              <BookOpen className="w-5 h-5 text-[#D4A843] mx-auto mb-1" />
              <p className="text-white font-bold text-lg">{totalLessons}</p>
              <p className="text-[#B0B0B0] text-[10px]">{t.totalLessons}</p>
            </div>
            <div className="p-4 rounded-xl bg-emerald-500/[0.06] border border-emerald-500/20 text-center">
              <Clock className="w-5 h-5 text-emerald-400 mx-auto mb-1" />
              <p className="text-white font-bold text-lg">{totalHours}h {remainingMin}m</p>
              <p className="text-[#B0B0B0] text-[10px]">{t.estimatedTime}</p>
            </div>
          </div>

          {/* Modules */}
          <div className="mb-6">
            <h2 className="font-['Space_Grotesk'] font-bold text-xl text-white mb-4 flex items-center gap-2">
              <Layers className="w-5 h-5 text-[#00E5FF]" /> {t.modules}
            </h2>

            {course.modules.length === 0 && (
              <div className="p-8 rounded-2xl bg-white/[0.02] border border-dashed border-white/[0.1] text-center">
                <BookOpen className="w-10 h-10 text-[#00E5FF]/20 mx-auto mb-3" />
                <p className="text-[#666] text-sm">{t.emptyState}</p>
              </div>
            )}

            <div className="space-y-4">
              {course.modules.map((mod, modIdx) => (
                <div key={mod.id} className="rounded-2xl bg-white/[0.03] border border-white/[0.08] overflow-hidden">
                  {/* Module header */}
                  <div className="flex items-center gap-3 p-4 cursor-pointer" onClick={() => toggleModule(mod.id)}>
                    <GripVertical className="w-4 h-4 text-[#666] flex-shrink-0" />
                    <span className="text-[#00E5FF] font-bold text-sm flex-shrink-0">{modIdx + 1}.</span>
                    <input type="text" value={mod.title} onChange={(e) => { e.stopPropagation(); updateModule(mod.id, { title: e.target.value }); }}
                      onClick={(e) => e.stopPropagation()}
                      placeholder={t.moduleTitlePlaceholder}
                      className="flex-1 bg-transparent text-white text-sm font-medium placeholder:text-[#666] focus:outline-none" />
                    <span className="text-[#B0B0B0] text-xs flex-shrink-0">{mod.lessons.length} {t.lessons.toLowerCase()}</span>
                    <button onClick={(e) => { e.stopPropagation(); removeModule(mod.id); }} className="text-red-400/50 hover:text-red-400 transition-colors p-1">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    {mod.expanded ? <ChevronUp className="w-4 h-4 text-[#B0B0B0]" /> : <ChevronDown className="w-4 h-4 text-[#B0B0B0]" />}
                  </div>

                  {/* Module content */}
                  {mod.expanded && (
                    <div className="px-4 pb-4 border-t border-white/[0.05]">
                      <div className="pt-3 mb-3">
                        <textarea value={mod.description} onChange={(e) => updateModule(mod.id, { description: e.target.value })}
                          placeholder={t.moduleDescPlaceholder} rows={2}
                          className="w-full px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.06] text-[#B0B0B0] text-xs placeholder:text-[#555] focus:border-[#00E5FF]/30 focus:outline-none resize-none" />
                      </div>

                      {/* Lessons */}
                      <div className="space-y-2">
                        {mod.lessons.map((lesson, lIdx) => (
                          <div key={lesson.id} className="flex items-start gap-2 p-3 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                            <span className="text-[#00E5FF]/50 text-xs font-bold mt-2 flex-shrink-0">{modIdx + 1}.{lIdx + 1}</span>
                            <div className="flex-1 space-y-2">
                              <div className="flex gap-2">
                                <input type="text" value={lesson.title} onChange={(e) => updateLesson(mod.id, lesson.id, { title: e.target.value })}
                                  placeholder={t.lessonTitlePlaceholder}
                                  className="flex-1 px-2.5 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.06] text-white text-xs placeholder:text-[#555] focus:border-[#00E5FF]/30 focus:outline-none" />
                                <select value={lesson.type} onChange={(e) => updateLesson(mod.id, lesson.id, { type: e.target.value as Lesson["type"] })}
                                  className="px-2 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.06] text-[#B0B0B0] text-xs focus:outline-none">
                                  {lessonTypes.map((lt) => <option key={lt.value} value={lt.value}>{lt.label}</option>)}
                                </select>
                                <input type="number" value={lesson.duration} onChange={(e) => updateLesson(mod.id, lesson.id, { duration: parseInt(e.target.value) || 0 })}
                                  min={1} max={180}
                                  className="w-16 px-2 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.06] text-[#B0B0B0] text-xs text-center focus:outline-none" />
                                <span className="text-[#666] text-xs mt-2 flex-shrink-0">{t.minutes}</span>
                              </div>
                              <input type="text" value={lesson.description} onChange={(e) => updateLesson(mod.id, lesson.id, { description: e.target.value })}
                                placeholder={t.lessonDescPlaceholder}
                                className="w-full px-2.5 py-1.5 rounded-lg bg-white/[0.02] border border-white/[0.04] text-[#888] text-xs placeholder:text-[#444] focus:border-[#00E5FF]/20 focus:outline-none" />
                            </div>
                            <button onClick={() => removeLesson(mod.id, lesson.id)} className="text-red-400/30 hover:text-red-400 transition-colors p-1 mt-1">
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>

                      <button onClick={() => addLesson(mod.id)}
                        className="mt-3 flex items-center gap-1.5 px-3 py-2 rounded-lg border border-dashed border-white/[0.1] text-[#B0B0B0] text-xs hover:border-[#00E5FF]/30 hover:text-[#00E5FF] transition-all w-full justify-center">
                        <Plus className="w-3.5 h-3.5" /> {t.addLesson}
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <button onClick={addModule}
              className="mt-4 flex items-center gap-2 px-5 py-3 rounded-xl border border-dashed border-[#00E5FF]/30 text-[#00E5FF] text-sm font-bold hover:bg-[#00E5FF]/5 transition-all w-full justify-center">
              <Plus className="w-4 h-4" /> {t.addModule}
            </button>
          </div>

          {/* Preview button */}
          {course.modules.length > 0 && (
            <button onClick={() => setShowPreview(true)}
              className="w-full py-3 rounded-xl bg-[#00E5FF] text-[#0A0A0A] font-bold text-sm hover:brightness-110 transition-all">
              <BookOpen className="w-4 h-4 inline mr-2" /> {t.preview}
            </button>
          )}

          {/* Saved Courses Panel */}
          {playerId && (
            <div className="mt-8">
              <button onClick={() => setShowSavedCourses(!showSavedCourses)}
                className="flex items-center gap-2 text-[#00E5FF] text-sm font-bold mb-4 hover:underline">
                <FolderOpen className="w-4 h-4" /> {t.savedCourses} ({savedCoursesQuery.data?.length ?? 0})
                {showSavedCourses ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>

              {showSavedCourses && (
                <div className="space-y-2 mb-6">
                  {(!savedCoursesQuery.data || savedCoursesQuery.data.length === 0) && (
                    <p className="text-[#666] text-sm text-center py-4">{t.noSavedCourses}</p>
                  )}
                  {savedCoursesQuery.data?.map((c: any) => (
                    <div key={c.id} className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/[0.08] hover:border-[#00E5FF]/30 transition-colors">
                      <Database className="w-4 h-4 text-[#00E5FF] flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm font-medium truncate">{c.title}</p>
                        <p className="text-[#666] text-xs">{c.category} \u2022 {c.difficulty} \u2022 {c.estimatedHours}h</p>
                      </div>
                      <button onClick={() => loadCourse(c)}
                        className="px-2.5 py-1 rounded-lg bg-[#00E5FF]/10 border border-[#00E5FF]/30 text-[#00E5FF] text-xs font-bold hover:bg-[#00E5FF]/20 transition-all">
                        <Edit3 className="w-3 h-3 inline mr-1" />{t.loadCourse}
                      </button>
                      <button onClick={() => handleDeleteCourse(c.id)}
                        className="px-2.5 py-1 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-bold hover:bg-red-500/20 transition-all">
                        <Trash className="w-3 h-3 inline mr-1" />{t.deleteCourse}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Presencial Courses Info */}
          <div className="mt-8 p-5 rounded-2xl bg-gradient-to-br from-[#D4A843]/10 to-[#D4A843]/5 border border-[#D4A843]/30">
            <h3 className="font-['Space_Grotesk'] font-bold text-lg text-[#D4A843] mb-2 flex items-center gap-2">
              <Target className="w-5 h-5" /> {t.presencialTitle}
            </h3>
            <p className="text-[#B0B0B0] text-sm mb-4 leading-relaxed">{t.presencialDesc}</p>
            <div className="flex flex-col sm:flex-row gap-3">
              <a href="mailto:formacionia@acnb.es"
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#D4A843]/20 border border-[#D4A843]/40 text-[#D4A843] text-sm font-bold hover:bg-[#D4A843]/30 transition-all">
                <span>\u2709\uFE0F</span> {t.presencialContact}: formacionia@acnb.es
              </a>
              <a href="mailto:info@acnb.es"
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.1] text-[#B0B0B0] text-sm font-bold hover:bg-white/[0.08] transition-all">
                <span>\u2709\uFE0F</span> {t.generalContact}: info@acnb.es
              </a>
            </div>
          </div>
        </div>
      </main>

      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setShowPreview(false)}>
          <div className="bg-[#111] rounded-2xl border border-white/[0.1] max-w-2xl w-full max-h-[80vh] overflow-y-auto p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-['Space_Grotesk'] font-bold text-xl text-white">{t.coursePreview}</h2>
              <button onClick={() => setShowPreview(false)} className="text-[#B0B0B0] hover:text-white text-sm">{t.close}</button>
            </div>

            <h3 className="font-['Space_Grotesk'] font-bold text-2xl text-white mb-2">{course.title || "—"}</h3>
            <p className="text-[#B0B0B0] text-sm mb-4">{course.description}</p>

            <div className="flex gap-2 mb-6 flex-wrap">
              <span className="text-xs px-2.5 py-1 rounded-full bg-[#00E5FF]/10 text-[#00E5FF] border border-[#00E5FF]/30">
                {categories.find((c) => c.value === course.category)?.label}
              </span>
              <span className="text-xs px-2.5 py-1 rounded-full bg-[#D4A843]/10 text-[#D4A843] border border-[#D4A843]/30">
                {difficulties.find((d) => d.value === course.difficulty)?.label}
              </span>
              <span className="text-xs px-2.5 py-1 rounded-full bg-white/[0.05] text-[#B0B0B0] border border-white/[0.1]">
                {totalHours}h {remainingMin}m
              </span>
            </div>

            <div className="space-y-4">
              {course.modules.map((mod, i) => (
                <div key={mod.id} className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                  <h4 className="font-bold text-white text-sm mb-1">
                    <span className="text-[#00E5FF]">{i + 1}.</span> {mod.title || "—"}
                  </h4>
                  {mod.description && <p className="text-[#888] text-xs mb-3">{mod.description}</p>}
                  <div className="space-y-1.5">
                    {mod.lessons.map((l, j) => (
                      <div key={l.id} className="flex items-center gap-2 text-xs text-[#B0B0B0]">
                        <span className="text-[#00E5FF]/50">{LESSON_ICONS[l.type]}</span>
                        <span>{i + 1}.{j + 1}</span>
                        <span className="text-white">{l.title || "—"}</span>
                        <span className="ml-auto text-[#666]">{l.duration} {t.minutes}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

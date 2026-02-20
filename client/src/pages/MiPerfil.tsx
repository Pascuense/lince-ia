import { tl } from "@/contexts/PRDLanguageContext";
import { useState, useEffect, useMemo } from "react";
import { useGame } from "@/contexts/GameContext";
import { AVATAR_FRONTAL, AVATAR_EXPRESSIONS, getAvatarImage, ALL_CHARACTERS, type CharacterData } from "@/lib/avatarConstants";
import { AvatarSelector } from "@/components/AvatarSelector";
import { CountrySelector } from "@/components/CountrySelector";
import { ArtistChatModal } from "@/components/ArtistChatModal";
import { toast as sonnerToast } from "sonner";
import { Link } from "wouter";
import { Camera, MessageCircle, Trash2, ChevronRight } from "lucide-react";
import { StreakFire } from "@/components/StreakFire";
import { GlobalNavBar } from "@/components/GlobalNavBar";
import { BackButton } from "@/components/BackButton";
import { NotificationSettings } from "@/components/NotificationSettings";
import { trpc } from "@/lib/trpc";

const RELATIONSHIP_CONFIG: Record<string, { label: Record<string, string>; emoji: string; color: string }> = {
  new: {
    label: { es: "Desconocido", en: "Stranger", zh: "陌生人" },
    emoji: "👋",
    color: "#6B7280",
  },
  known: {
    label: { es: "Conocido", en: "Acquaintance", zh: "认识" },
    emoji: "🤝",
    color: "#3B82F6",
  },
  friend: {
    label: { es: "Amigo", en: "Friend", zh: "朋友" },
    emoji: "💚",
    color: "#10B981",
  },
  best_friend: {
    label: { es: "Confidente", en: "Confidant", zh: "知己" },
    emoji: "💎",
    color: "#8B5CF6",
  },
};

const T: Record<string, Record<string, string>> = {
  es: {
    title: "Mi Perfil",
    back: "← Volver",
    username: "Usuario",
    realName: "Nombre",
    email: "Email",
    country: "País",
    changeCountry: "Cambiar país",
    changeAvatar: "Cambiar avatar",
    stats: "Estadísticas",
    linceCoins: "LinceCoins",
    xp: "Experiencia",
    level: "Nivel Actual",
    streak: "Racha",
    days: "días",
    prompts: "Prompts Escritos",
    levelsCompleted: "Niveles Completados",
    totalStars: "Estrellas Totales",
    progressTitle: "Progreso Visual",
    xpProgress: "Progreso XP",
    nextLevel: "Siguiente nivel",
    skillBreakdown: "Desglose de Habilidades",
    promptSkill: "Prompts",
    imageSkill: "Imágenes",
    chatSkill: "Conversaciones",
    challengeSkill: "Retos",
    overallProgress: "Progreso General",
    memberSince: "Miembro desde",
    achievements: "Logros",
    firstPrompt: "Primer Prompt",
    firstPromptDesc: "Escribiste tu primer prompt",
    levelMaster: "Maestro de Nivel",
    levelMasterDesc: "Completaste un nivel con 3 estrellas",
    streakHero: "Héroe de Racha",
    streakHeroDesc: "Mantuviste una racha de 7 días",
    coinCollector: "Coleccionista",
    coinCollectorDesc: "Acumulaste 500 LinceCoins",
    locked: "Bloqueado",
    unlocked: "Desbloqueado",
    avatarChanged: "¡Avatar cambiado!",
    avatarError: "Error al cambiar avatar",
    dangerZone: "Zona de Peligro",
    deleteAccount: "Eliminar mi cuenta",
    deleteWarning: "Esta acción es irreversible. Se borrarán todos tus datos, progreso, prompts y creaciones.",
    deleteConfirm: "Escribe tu contraseña para confirmar:",
    deleteButton: "ELIMINAR CUENTA PERMANENTEMENTE",
    deleteSuccess: "Cuenta eliminada correctamente",
    deleteError: "Error al eliminar. Verifica tu contraseña.",
    deleting: "Eliminando...",
    myConversations: "Mis Conversaciones",
    noConversations: "Aún no has hablado con ningún avatar. ¡Ve a Personajes y empieza a chatear!",
    messages: "mensajes",
    continueChat: "Continuar",
    deleteChat: "Eliminar",
    deleteChatConfirm: "¿Eliminar esta conversación?",
    deleteChatSuccess: "Conversación eliminada",
    deleteChatError: "Error al eliminar conversación",
    loadingConversations: "Cargando conversaciones...",
    loginRequired: "Inicia sesión para ver tus conversaciones",
  },
  en: {
    title: "My Profile",
    back: "← Back",
    username: "Username",
    realName: "Name",
    email: "Email",
    country: "Country",
    changeCountry: "Change country",
    changeAvatar: "Change avatar",
    stats: "Statistics",
    linceCoins: "LinceCoins",
    xp: "Experience",
    level: "Current Level",
    streak: "Streak",
    days: "days",
    prompts: "Prompts Written",
    levelsCompleted: "Levels Completed",
    totalStars: "Total Stars",
    progressTitle: "Visual Progress",
    xpProgress: "XP Progress",
    nextLevel: "Next level",
    skillBreakdown: "Skill Breakdown",
    promptSkill: "Prompts",
    imageSkill: "Images",
    chatSkill: "Conversations",
    challengeSkill: "Challenges",
    overallProgress: "Overall Progress",
    memberSince: "Member since",
    achievements: "Achievements",
    firstPrompt: "First Prompt",
    firstPromptDesc: "You wrote your first prompt",
    levelMaster: "Level Master",
    levelMasterDesc: "Completed a level with 3 stars",
    streakHero: "Streak Hero",
    streakHeroDesc: "Maintained a 7-day streak",
    coinCollector: "Collector",
    coinCollectorDesc: "Accumulated 500 LinceCoins",
    locked: "Locked",
    unlocked: "Unlocked",
    avatarChanged: "Avatar changed!",
    avatarError: "Error changing avatar",
    dangerZone: "Danger Zone",
    deleteAccount: "Delete my account",
    deleteWarning: "This action is irreversible. All your data, progress, prompts and creations will be deleted.",
    deleteConfirm: "Type your password to confirm:",
    deleteButton: "DELETE ACCOUNT PERMANENTLY",
    deleteSuccess: "Account deleted successfully",
    deleteError: "Error deleting. Check your password.",
    deleting: "Deleting...",
    myConversations: "My Conversations",
    noConversations: "You haven't talked to any avatar yet. Go to Characters and start chatting!",
    messages: "messages",
    continueChat: "Continue",
    deleteChat: "Delete",
    deleteChatConfirm: "Delete this conversation?",
    deleteChatSuccess: "Conversation deleted",
    deleteChatError: "Error deleting conversation",
    loadingConversations: "Loading conversations...",
    loginRequired: "Log in to see your conversations",
  },
  zh: {
    title: "我的资料",
    back: "← 返回",
    username: "用户名",
    realName: "姓名",
    email: "邮箱",
    country: "国家",
    changeCountry: "更换国家",
    changeAvatar: "更换头像",
    stats: "统计数据",
    linceCoins: "林斯币",
    xp: "经验值",
    level: "当前等级",
    streak: "连续",
    days: "天",
    prompts: "已写提示词",
    levelsCompleted: "已完成关卡",
    totalStars: "总星数",
    memberSince: "注册于",
    achievements: "成就",
    firstPrompt: "第一个提示词",
    firstPromptDesc: "写了你的第一个提示词",
    levelMaster: "关卡大师",
    levelMasterDesc: "以3星完成一个关卡",
    streakHero: "连续英雄",
    streakHeroDesc: "保持7天连续",
    coinCollector: "收藏家",
    coinCollectorDesc: "积累500林斯币",
    locked: "锁定",
    unlocked: "已解锁",
    avatarChanged: "头像已更换！",
    avatarError: "更换头像失败",
    dangerZone: "危险区域",
    deleteAccount: "删除我的账户",
    deleteWarning: "此操作不可撤销。您的所有数据、进度、提示词和创作都将被删除。",
    deleteConfirm: "输入密码确认：",
    deleteButton: "永久删除账户",
    deleteSuccess: "账户已成功删除",
    deleteError: "删除失败。请检查密码。",
    deleting: "删除中...",
    myConversations: "我的对话",
    noConversations: "你还没有和任何角色聊过天。去角色页面开始聊天吧！",
    messages: "条消息",
    continueChat: "继续",
    deleteChat: "删除",
    deleteChatConfirm: "删除此对话？",
    deleteChatSuccess: "对话已删除",
    deleteChatError: "删除对话失败",
    loadingConversations: "加载对话中...",
    loginRequired: "登录后查看对话",
  },
};

export default function MiPerfil() {
  const { state, loggedUser } = useGame();
  const [lang, setLang] = useState<"es" | "en" | "zh">("es");
  const [showAvatarSelector, setShowAvatarSelector] = useState(false);
  const [savingAvatar, setSavingAvatar] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [chatArtist, setChatArtist] = useState<CharacterData | null>(null);
  const [deletingSessionId, setDeletingSessionId] = useState<number | null>(null);
  const t = T[lang] || T.es;

  const gamePlayerId = loggedUser?.id ?? null;

  // Stable query input for sessions
  const sessionsInput = useMemo(() => ({
    gamePlayerId: gamePlayerId ?? 0,
  }), [gamePlayerId]);

  // Load chat sessions from backend
  const {
    data: chatSessions,
    isLoading: sessionsLoading,
    refetch: refetchSessions,
  } = trpc.avatarChat.listSessions.useQuery(
    sessionsInput,
    {
      enabled: !!gamePlayerId && gamePlayerId > 0,
      staleTime: 30_000,
      refetchOnWindowFocus: true,
    }
  );

  // Delete session mutation
  const deleteSessionMutation = trpc.avatarChat.deleteSession.useMutation({
    onSuccess: () => {
      sonnerToast.success(t.deleteChatSuccess);
      refetchSessions();
      setDeletingSessionId(null);
    },
    onError: () => {
      sonnerToast.error(t.deleteChatError);
      setDeletingSessionId(null);
    },
  });

  const handleDeleteSession = (sessionId: number) => {
    if (!gamePlayerId) return;
    if (!window.confirm(t.deleteChatConfirm)) return;
    setDeletingSessionId(sessionId);
    deleteSessionMutation.mutate({ sessionId, gamePlayerId });
  };

  const handleOpenChat = (avatarKey: string) => {
    const character = ALL_CHARACTERS.find(c => c.key === avatarKey);
    if (character) {
      setChatArtist(character);
    } else {
      // Fallback: create a minimal character data for unknown avatars
      setChatArtist({
        key: avatarKey,
        name: avatarKey,
        role: { es: "Avatar IA", en: "AI Avatar", zh: "AI角色" },
        specialty: { es: "Inteligencia Artificial", en: "Artificial Intelligence", zh: "人工智能" },
        region: "LINCE",
        flag: "🤖",
        color: "#00E5FF",
      });
    }
  };

  const handleDeleteAccount = async () => {
    if (!loggedUser?.email || !deletePassword) return;
    setDeleting(true);
    try {
      const res = await fetch('/api/trpc/gamePlayer.deleteAccount', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ json: { email: loggedUser.email, password: deletePassword } }),
      });
      if (res.ok) {
        localStorage.removeItem('lince-user');
        localStorage.removeItem('lince-users');
        localStorage.removeItem('lince-game-token');
        sonnerToast.success(t.deleteSuccess);
        setTimeout(() => { window.location.href = '/'; }, 1500);
      } else {
        sonnerToast.error(t.deleteError);
      }
    } catch {
      sonnerToast.error(t.deleteError);
    } finally {
      setDeleting(false);
    }
  };

  useEffect(() => {
    try {
      const stored = localStorage.getItem("lince-user");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.language) setLang(parsed.language);
      }
    } catch { /* ignore */ }
  }, []);

  const avatarImg = getAvatarImage(state.avatarKey) || AVATAR_FRONTAL.PEQUELIN;
  const completedLevels = state.levels.filter((l) => l.completed).length;
  const totalStars = state.levels.reduce((sum, l) => sum + l.stars, 0);

  // Handle avatar change
  const handleAvatarChange = async (newKey: string) => {
    setSavingAvatar(true);
    try {
      const stored = localStorage.getItem("lince-user");
      if (!stored) throw new Error("No user");
      const user = JSON.parse(stored);
      const gameToken = localStorage.getItem("lince-game-token");

      if (user.id && gameToken) {
        const res = await fetch("/api/trpc/gamePlayer.setAvatar", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-game-token": gameToken,
          },
          credentials: "include",
          body: JSON.stringify({ json: { playerId: Number(user.id), avatarKey: newKey } }),
        });
        if (!res.ok) throw new Error("Server error");
      }

      user.avatarKey = newKey;
      localStorage.setItem("lince-user", JSON.stringify(user));

      const gameState = localStorage.getItem("lince_game_state");
      if (gameState) {
        const gs = JSON.parse(gameState);
        gs.avatarKey = newKey;
        localStorage.setItem("lince_game_state", JSON.stringify(gs));
      }

      window.dispatchEvent(new CustomEvent("lince-avatar-change", { detail: newKey }));
      window.dispatchEvent(new CustomEvent("lince-login"));

      sonnerToast.success(t.avatarChanged);
      setShowAvatarSelector(false);

      setTimeout(() => window.location.reload(), 500);
    } catch {
      sonnerToast.error(t.avatarError);
    } finally {
      setSavingAvatar(false);
    }
  };

  // Achievements
  const achievements = [
    {
      id: "firstPrompt",
      icon: "✍️",
      name: t.firstPrompt,
      desc: t.firstPromptDesc,
      unlocked: state.totalPromptsWritten > 0,
    },
    {
      id: "levelMaster",
      icon: "⭐",
      name: t.levelMaster,
      desc: t.levelMasterDesc,
      unlocked: state.levels.some((l) => l.stars >= 3),
    },
    {
      id: "streakHero",
      icon: "🔥",
      name: t.streakHero,
      desc: t.streakHeroDesc,
      unlocked: state.streak >= 7,
    },
    {
      id: "coinCollector",
      icon: "🪙",
      name: t.coinCollector,
      desc: t.coinCollectorDesc,
      unlocked: state.linceCoins >= 500,
    },
  ];

  // Format relative time
  const formatRelativeTime = (dateStr: string | Date) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return tl(lang, { es: "ahora", en: "just now", zh: "刚刚", 'pt-BR': "ahora", 'pt-PT': "ahora" });
    if (diffMins < 60) return `${diffMins}m`;
    if (diffHours < 24) return `${diffHours}h`;
    if (diffDays < 7) return `${diffDays}d`;
    return date.toLocaleDateString();
  };

  return (
    <div className="pt-14 min-h-screen bg-[oklch(0.10_0.01_240)] text-white">
      <BackButton variant="inline" />
      <GlobalNavBar />
      {/* Header */}
      <div className="sticky top-0 z-50 bg-[oklch(0.10_0.01_240)]/95 backdrop-blur-md border-b border-[oklch(0.82_0.15_195)]/10">
        <div className="container flex items-center justify-between h-14 px-4">
          <Link href="/" className="text-gray-400 hover:text-white text-sm font-medium transition-colors">
            {t.back}
          </Link>
          <h1 className="font-['Space_Grotesk'] font-bold">{t.title}</h1>
          <div className="flex gap-1">
            {(["es", "en", "zh"] as const).map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={`px-2 py-1 text-xs rounded-md ${lang === l ? "bg-[oklch(0.82_0.15_195)]/20 text-[oklch(0.82_0.15_195)]" : "text-gray-500"}`}
              >
                {l === "es" ? "ES" : l === "en" ? "EN" : "中"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Avatar Card with Change Button */}
      <div className="container px-4 pt-6">
        <div className="flex flex-col items-center text-center bg-[oklch(0.14_0.015_240)] rounded-2xl p-6 border border-[oklch(0.82_0.15_195)]/10">
          <div className="relative group">
            <div className="w-24 h-24 rounded-full overflow-hidden border-3 border-[oklch(0.82_0.15_195)] shadow-[0_0_30px_oklch(0.82_0.15_195/0.3)]">
              <img src={avatarImg} alt="Avatar" className="w-full h-full object-cover" />
            </div>
            <button
              onClick={() => setShowAvatarSelector(true)}
              className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
            >
              <Camera className="w-6 h-6 text-white" />
            </button>
          </div>
          <h2 className="font-['Space_Grotesk'] font-bold text-xl text-[oklch(0.82_0.15_195)] mt-4">
            {loggedUser?.username || state.playerName}
          </h2>
          <p className="text-gray-400 text-sm mt-1">{loggedUser?.realName}</p>
          <button
            onClick={() => setShowAvatarSelector(true)}
            className="mt-3 px-4 py-1.5 rounded-lg border border-[oklch(0.82_0.15_195)]/30 text-[oklch(0.82_0.15_195)] text-xs font-bold hover:bg-[oklch(0.82_0.15_195)]/10 transition-all flex items-center gap-1.5"
          >
            <Camera className="w-3.5 h-3.5" />
            {t.changeAvatar}
          </button>
        </div>
      </div>

      {/* Country Selector */}
      <div className="container px-4 pt-4">
        <CountrySelector />
      </div>

      {/* Stats Grid */}
      <div className="container px-4 pt-4">
        <h3 className="font-['Space_Grotesk'] font-bold text-lg mb-3">{t.stats}</h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-[oklch(0.14_0.015_240)] rounded-xl p-4 border border-white/5">
            <span className="text-2xl">🪙</span>
            <p className="text-[oklch(0.72_0.12_75)] font-bold text-xl mt-1">{state.linceCoins}</p>
            <p className="text-gray-500 text-xs">{t.linceCoins}</p>
          </div>
          <div className="bg-[oklch(0.14_0.015_240)] rounded-xl p-4 border border-white/5">
            <span className="text-2xl">⚡</span>
            <p className="text-[oklch(0.82_0.15_195)] font-bold text-xl mt-1">{state.xp}</p>
            <p className="text-gray-500 text-xs">{t.xp}</p>
          </div>
          <div className="bg-[oklch(0.14_0.015_240)] rounded-xl p-4 border border-white/5 flex flex-col items-center">
            <StreakFire size="md" showLabel={false} />
            <p className="text-gray-500 text-xs mt-1">{t.streak} ({t.days})</p>
          </div>
          <div className="bg-[oklch(0.14_0.015_240)] rounded-xl p-4 border border-white/5">
            <span className="text-2xl">📝</span>
            <p className="text-white font-bold text-xl mt-1">{state.totalPromptsWritten}</p>
            <p className="text-gray-500 text-xs">{t.prompts}</p>
          </div>
          <div className="bg-[oklch(0.14_0.015_240)] rounded-xl p-4 border border-white/5">
            <span className="text-2xl">✅</span>
            <p className="text-emerald-400 font-bold text-xl mt-1">{completedLevels}/3</p>
            <p className="text-gray-500 text-xs">{t.levelsCompleted}</p>
          </div>
          <div className="bg-[oklch(0.14_0.015_240)] rounded-xl p-4 border border-white/5">
            <span className="text-2xl">⭐</span>
            <p className="text-yellow-400 font-bold text-xl mt-1">{totalStars}/9</p>
            <p className="text-gray-500 text-xs">{t.totalStars}</p>
          </div>
        </div>
      </div>

      {/* ─── VISUAL PROGRESS ─── */}
      <div className="container px-4 pt-6">
        <h3 className="font-['Space_Grotesk'] font-bold text-lg mb-3">{t.progressTitle}</h3>
        
        {/* XP Progress Bar */}
        <div className="bg-[oklch(0.14_0.015_240)] rounded-xl p-4 border border-white/5 mb-3">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-400">{t.xpProgress}</span>
            <span className="text-xs text-[oklch(0.82_0.15_195)]">{t.nextLevel}: {(() => { const thresholds = [0, 100, 300, 600, 1000, 1500, 2500, 4000, 6000, 10000]; const next = thresholds.find(th => th > state.xp) || 10000; return next; })()} XP</span>
          </div>
          <div className="w-full h-3 bg-[oklch(0.18_0.01_240)] rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-1000"
              style={{
                width: `${Math.min(100, (state.xp / ((() => { const thresholds = [100, 300, 600, 1000, 1500, 2500, 4000, 6000, 10000]; return thresholds.find(th => th > state.xp) || 10000; })()) ) * 100)}%`,
                background: 'linear-gradient(90deg, oklch(0.82 0.15 195), oklch(0.72 0.12 75))',
              }}
            />
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-xs text-gray-500">{state.xp} XP</span>
            <span className="text-xs text-gray-500">{(() => { const thresholds = [0, 100, 300, 600, 1000, 1500, 2500, 4000, 6000, 10000]; const idx = thresholds.filter(th => th <= state.xp).length; return `Lv.${idx}`; })()}</span>
          </div>
        </div>

        {/* Skill Breakdown Bars */}
        <div className="bg-[oklch(0.14_0.015_240)] rounded-xl p-4 border border-white/5 mb-3">
          <p className="text-sm text-gray-400 mb-3">{t.skillBreakdown}</p>
          {[
            { label: t.promptSkill, value: state.totalPromptsWritten, max: 50, color: 'oklch(0.82 0.15 195)', icon: '✍️' },
            { label: t.imageSkill, value: (() => { try { return parseInt(localStorage.getItem('lince-images-created') || '0', 10); } catch { return 0; } })(), max: 20, color: 'oklch(0.65 0.15 300)', icon: '🎨' },
            { label: t.chatSkill, value: (() => { try { const sessions = JSON.parse(localStorage.getItem('lince-chat-sessions') || '[]'); return Array.isArray(sessions) ? sessions.length : 0; } catch { return 0; } })(), max: 30, color: 'oklch(0.72 0.12 75)', icon: '💬' },
            { label: t.challengeSkill, value: (() => { try { let count = 0; for (let i = 0; i < localStorage.length; i++) { const key = localStorage.key(i); if (key && key.startsWith('lince-reto-completed-')) count++; } return count; } catch { return 0; } })(), max: 30, color: 'oklch(0.70 0.15 150)', icon: '⚡' },
          ].map((skill, i) => (
            <div key={i} className="mb-3 last:mb-0">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs text-gray-300 flex items-center gap-1.5">
                  <span>{skill.icon}</span> {skill.label}
                </span>
                <span className="text-xs text-gray-500">{skill.value}/{skill.max}</span>
              </div>
              <div className="w-full h-2 bg-[oklch(0.18_0.01_240)] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${Math.min(100, (skill.value / skill.max) * 100)}%`,
                    backgroundColor: skill.color,
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Overall Progress Ring */}
        <div className="bg-[oklch(0.14_0.015_240)] rounded-xl p-4 border border-white/5 flex items-center gap-4">
          <div className="relative w-16 h-16 flex-shrink-0">
            <svg className="w-16 h-16 -rotate-90" viewBox="0 0 36 36">
              <circle cx="18" cy="18" r="15.9" fill="none" stroke="oklch(0.18 0.01 240)" strokeWidth="3" />
              <circle
                cx="18" cy="18" r="15.9" fill="none"
                stroke="url(#progressGradient)"
                strokeWidth="3"
                strokeDasharray={`${Math.min(100, ((completedLevels / 3) * 30 + (state.totalPromptsWritten > 0 ? 20 : 0) + (state.streak >= 7 ? 20 : 0) + (totalStars / 9) * 30))} 100`}
                strokeLinecap="round"
              />
              <defs>
                <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="oklch(0.82 0.15 195)" />
                  <stop offset="100%" stopColor="oklch(0.72 0.12 75)" />
                </linearGradient>
              </defs>
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white">
              {Math.round((completedLevels / 3) * 30 + (state.totalPromptsWritten > 0 ? 20 : 0) + (state.streak >= 7 ? 20 : 0) + (totalStars / 9) * 30)}%
            </span>
          </div>
          <div>
            <p className="text-sm font-bold text-white">{t.overallProgress}</p>
            <p className="text-xs text-gray-400 mt-0.5">
              {completedLevels}/3 {t.levelsCompleted} · {totalStars}/9 {t.totalStars}
            </p>
          </div>
        </div>
      </div>

      {/* ─── MIS CONVERSACIONES ─── */}
      <div className="container px-4 pt-6">
        <h3 className="font-['Space_Grotesk'] font-bold text-lg mb-3 flex items-center gap-2">
          <MessageCircle className="w-5 h-5 text-[oklch(0.82_0.15_195)]" />
          {t.myConversations}
        </h3>

        {!gamePlayerId || gamePlayerId <= 0 ? (
          <div className="bg-[oklch(0.14_0.015_240)] rounded-xl p-6 border border-white/5 text-center">
            <p className="text-gray-400 text-sm">{t.loginRequired}</p>
          </div>
        ) : sessionsLoading ? (
          <div className="bg-[oklch(0.14_0.015_240)] rounded-xl p-6 border border-white/5 text-center">
            <div className="flex items-center justify-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[oklch(0.82_0.15_195)] animate-pulse" />
              <p className="text-gray-400 text-sm">{t.loadingConversations}</p>
            </div>
          </div>
        ) : !chatSessions || chatSessions.length === 0 ? (
          <div className="bg-[oklch(0.14_0.015_240)] rounded-xl p-6 border border-white/5 text-center">
            <MessageCircle className="w-10 h-10 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400 text-sm">{t.noConversations}</p>
            <Link href="/personajes" className="inline-block mt-3 px-4 py-2 bg-[oklch(0.82_0.15_195)]/10 border border-[oklch(0.82_0.15_195)]/30 text-[oklch(0.82_0.15_195)] rounded-lg text-xs font-bold hover:bg-[oklch(0.82_0.15_195)]/20 transition-all">
              {tl(lang, { es: "Ir a Personajes", en: "Go to Characters", zh: "前往角色", 'pt-BR': "Ir a Personajes", 'pt-PT': "Ir a Personajes" })}
            </Link>
          </div>
        ) : (
          <div className="space-y-2">
            {chatSessions.map((session) => {
              const character = ALL_CHARACTERS.find(c => c.key === session.avatarKey);
              const avatarImage = getAvatarImage(session.avatarKey);
              const relConfig = RELATIONSHIP_CONFIG[session.relationshipLevel] || RELATIONSHIP_CONFIG.new;
              const isDeleting = deletingSessionId === session.id;

              return (
                <div
                  key={session.id}
                  className="flex items-center gap-3 p-3 bg-[oklch(0.14_0.015_240)] rounded-xl border border-white/5 hover:border-[oklch(0.82_0.15_195)]/20 transition-all group"
                >
                  {/* Avatar image */}
                  <div className="w-11 h-11 rounded-full overflow-hidden border-2 flex-shrink-0" style={{ borderColor: character?.color || "#00E5FF" }}>
                    {avatarImage ? (
                      <img src={avatarImage} alt={session.avatarKey} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gray-700 flex items-center justify-center text-lg">🤖</div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-['Space_Grotesk'] font-bold text-sm truncate" style={{ color: character?.color || "#00E5FF" }}>
                        {character?.name || session.avatarKey}
                      </p>
                      <span
                        className="text-[9px] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0"
                        style={{ background: `${relConfig.color}20`, color: relConfig.color }}
                      >
                        {relConfig.emoji} {relConfig.label[lang] || relConfig.label.es}
                      </span>
                    </div>
                    <p className="text-gray-500 text-[10px] truncate mt-0.5">
                      {session.lastMessagePreview || (tl(lang, { es: "Sin mensajes aún", en: "No messages yet", zh: "暂无消息", 'pt-BR': "Sin mensajes aún", 'pt-PT': "Sin mensajes aún" }))}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-gray-600 text-[9px]">{session.messageCount} {t.messages}</span>
                      <span className="text-gray-700 text-[9px]">·</span>
                      <span className="text-gray-600 text-[9px]">{formatRelativeTime(session.updatedAt)}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button
                      onClick={() => handleOpenChat(session.avatarKey)}
                      className="px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all flex items-center gap-1"
                      style={{ background: `${character?.color || "#00E5FF"}20`, color: character?.color || "#00E5FF" }}
                    >
                      {t.continueChat}
                      <ChevronRight className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => handleDeleteSession(session.id)}
                      disabled={isDeleting}
                      className="p-1.5 rounded-lg text-gray-600 hover:text-red-400 hover:bg-red-500/10 transition-all disabled:opacity-30"
                      title={t.deleteChat}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Achievements */}
      <div className="container px-4 pt-6 pb-8">
        <h3 className="font-['Space_Grotesk'] font-bold text-lg mb-3">{t.achievements}</h3>
        <div className="space-y-3">
          {achievements.map((a) => (
            <div
              key={a.id}
              className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${
                a.unlocked
                  ? "bg-[oklch(0.14_0.015_240)] border-[oklch(0.82_0.15_195)]/20"
                  : "bg-[oklch(0.12_0.01_240)] border-white/5 opacity-50"
              }`}
            >
              <span className="text-3xl">{a.icon}</span>
              <div className="flex-1">
                <h4 className="font-bold text-sm">{a.name}</h4>
                <p className="text-gray-400 text-xs">{a.desc}</p>
              </div>
              <span
                className={`text-xs font-bold px-2 py-1 rounded-full ${
                  a.unlocked ? "bg-emerald-500/20 text-emerald-400" : "bg-gray-800 text-gray-500"
                }`}
              >
                {a.unlocked ? t.unlocked : t.locked}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Share Profile Button */}
      <div className="container px-4 pb-4">
        <Link
          href="/perfil-publico"
          className="flex items-center justify-center gap-2 w-full p-3 rounded-xl bg-[oklch(0.82_0.15_195)]/10 border border-[oklch(0.82_0.15_195)]/30 text-[oklch(0.82_0.15_195)] text-sm font-bold hover:bg-[oklch(0.82_0.15_195)]/20 transition-all"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
          {tl(lang, { es: "Compartir Mi Perfil", en: "Share My Profile", zh: "分享我的资料", 'pt-BR': "Compartir Mi Perfil", 'pt-PT': "Compartir Mi Perfil" })}
        </Link>
      </div>

      {/* Notification Settings */}
      <div className="container px-4 pb-4">
        <NotificationSettings lang={lang as "es" | "en" | "zh"} playerId={gamePlayerId} />
      </div>

      {/* P0-2: GDPR Delete Account */}
      <div className="container px-4 pb-8">
        <div className="border border-red-500/30 rounded-xl p-5 bg-red-500/5">
          <h3 className="text-red-400 font-bold text-lg mb-2">{t.dangerZone}</h3>
          <p className="text-gray-400 text-sm mb-4">{t.deleteWarning}</p>
          {!showDeleteConfirm ? (
            <button onClick={() => setShowDeleteConfirm(true)} className="px-4 py-2 bg-red-600/20 border border-red-500/40 text-red-400 rounded-lg text-sm font-medium hover:bg-red-600/30 transition-colors">
              {t.deleteAccount}
            </button>
          ) : (
            <div className="space-y-3">
              <p className="text-red-300 text-sm font-medium">{t.deleteConfirm}</p>
              <input type="password" value={deletePassword} onChange={(e) => setDeletePassword(e.target.value)} placeholder="********" className="w-full bg-black/50 border border-red-500/30 rounded-lg px-3 py-2 text-white text-sm" />
              <div className="flex gap-3">
                <button onClick={handleDeleteAccount} disabled={deleting || !deletePassword} className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-bold hover:bg-red-700 disabled:opacity-50 transition-colors">
                  {deleting ? t.deleting : t.deleteButton}
                </button>
                <button onClick={() => { setShowDeleteConfirm(false); setDeletePassword(''); }} className="px-4 py-2 bg-gray-800 text-gray-300 rounded-lg text-sm hover:bg-gray-700 transition-colors">
                  Cancelar
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Avatar Selector Modal */}
      <AvatarSelector
        isOpen={showAvatarSelector}
        onClose={() => setShowAvatarSelector(false)}
        currentAvatarKey={state.avatarKey}
        onSelect={handleAvatarChange}
        saving={savingAvatar}
      />

      {/* Chat Modal */}
      {chatArtist && (
        <ArtistChatModal
          artist={chatArtist}
          lang={lang}
          onClose={() => {
            setChatArtist(null);
            // Refetch sessions to update last message preview
            refetchSessions();
          }}
        />
      )}

      {/* Toast handled by global Sonner Toaster */}
    </div>
  );
}

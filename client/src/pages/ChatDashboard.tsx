import { useState, useRef, useEffect, useCallback, useMemo, lazy, Suspense } from "react";
import { FAMILY_CHARACTERS, getAvatarImage, getAvatarProfilePic, AVATAR_BG, type CharacterData } from "@/lib/avatarConstants";
import { usePRDLanguage, COUNTRY_FLAGS, type AvatarCountry } from "@/contexts/PRDLanguageContext";
import { ArtistChatModal } from "@/components/ArtistChatModal";
import { PRDLanguageSelector } from "@/components/PRDLanguageSelector";
import { FirstUseTutorial } from "@/components/FirstUseTutorial";
import { Search, ChevronLeft, Menu, X, Sparkles, Wrench, MessageCircle, Image as ImageIcon, Loader2, FileText } from "lucide-react";

const PromptStudio = lazy(() => import("@/pages/PromptStudio"));
const PromptProfesional = lazy(() => import("@/pages/PromptProfesional"));

// ─── SPECIALTY BADGE ───
function getSpecialtyBadge(speciality: string): string {
  const s = speciality.toLowerCase();
  if (s.includes('ética') || s.includes('etic')) return '⚖️';
  if (s.includes('ciberseguridad') || s.includes('protección de datos')) return '🛡️';
  if (s.includes('prompt')) return '✨';
  if (s.includes('automatización') || s.includes('workflow')) return '⚙️';
  if (s.includes('liderazgo') || s.includes('gestión de proyectos')) return '👑';
  if (s.includes('análisis de datos') || s.includes('métricas')) return '📊';
  if (s.includes('arquitectura')) return '🏗️';
  if (s.includes('prototipado') || s.includes('mvp')) return '⚡';
  if (s.includes('generativa') || s.includes('arte') || s.includes('artístic')) return '🎨';
  if (s.includes('storytelling') || s.includes('historia')) return '📚';
  if (s.includes('creatividad')) return '💡';
  if (s.includes('decisión') || s.includes('presión')) return '🎯';
  if (s.includes('deporte') || s.includes('táctico')) return '⚽';
  if (s.includes('marketing') || s.includes('contenido') || s.includes('redes social')) return '📣';
  if (s.includes('educación') || s.includes('pedagog')) return '🎓';
  if (s.includes('salud') || s.includes('bienestar')) return '🩺';
  if (s.includes('música') || s.includes('audio')) return '🎵';
  if (s.includes('finanzas') || s.includes('inversión')) return '💰';
  if (s.includes('legal') || s.includes('regulación')) return '📋';
  if (s.includes('accesibilidad')) return '♿';
  if (s.includes('videojuego') || s.includes('gaming')) return '🎮';
  if (s.includes('robótica') || s.includes('hardware')) return '🤖';
  if (s.includes('idioma') || s.includes('traducción')) return '🌐';
  if (s.includes('imagen') || s.includes('visual')) return '🖼️';
  if (s.includes('negocio') || s.includes('empresa') || s.includes('emprendimiento')) return '💼';
  if (s.includes('programación') || s.includes('código')) return '💻';
  if (s.includes('sostenibilidad')) return '🌿';
  return '🧠';
}

// ─── GROUP COLOR ───
function getGroupColor(region: string): { accent: string; bg: string; border: string } {
  if (region === 'Zaragoza') return { accent: '#D4A843', bg: 'rgba(212,168,67,0.08)', border: 'rgba(212,168,67,0.2)' };
  if (region === 'MUSICALIN') return { accent: '#00E5FF', bg: 'rgba(0,229,255,0.08)', border: 'rgba(0,229,255,0.2)' };
  return { accent: '#58a6ff', bg: 'rgba(88,166,255,0.08)', border: 'rgba(88,166,255,0.2)' };
}

// ─── PROFESSOR TYPE ───
type Professor = {
  key: string;
  name: string;
  role: string;
  speciality: string;
  image: string;
  profilePic: string;
  bgImage: string;
  color: string;
  group: string;
  region: string;
};

// ─── BUILD PROFESSOR LIST (Solo Familia — 10 personajes) ───
function buildProfessorList(): Professor[] {
  return FAMILY_CHARACTERS.map(c => ({
    key: c.key,
    name: c.name,
    role: typeof c.role === 'string' ? c.role : c.role.es,
    speciality: typeof c.specialty === 'string' ? c.specialty : c.specialty.es,
    image: getAvatarImage(c.key),
    profilePic: getAvatarProfilePic(c.key),
    bgImage: AVATAR_BG[c.key] || '',
    color: c.color,
    group: 'Familia',
    region: c.region,
  }));
}

// ─── GROUP PROFESSORS ───
function groupProfessors(profs: Professor[]): { label: string; items: Professor[]; icon: string }[] {
  const order = ['Familia', 'Musicalin', 'Zaragoza Histórico'];
  const groups: Record<string, Professor[]> = {};
  for (const p of profs) {
    const g = p.group;
    if (!groups[g]) groups[g] = [];
    groups[g].push(p);
  }
  const iconMap: Record<string, string> = { 'Familia': '👨‍👩‍👧‍👦', 'Musicalin': '🎵', 'Zaragoza Histórico': '⚽' };
  return Object.entries(groups)
    .sort(([a], [b]) => {
      const ai = order.indexOf(a);
      const bi = order.indexOf(b);
      return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
    })
    .map(([label, items]) => ({ label, items, icon: iconMap[label] || '🧠' }));
}

// ─── AVATAR IMAGE COMPONENT ───
function AvatarCircle({ src, name, size = 'md', color }: { src: string; name: string; size?: 'sm' | 'md' | 'lg'; color: string }) {
  const [imgError, setImgError] = useState(false);
  const sizeClasses = {
    sm: 'w-9 h-9',
    md: 'w-16 h-16 sm:w-[72px] sm:h-[72px]',
    lg: 'w-20 h-20',
  };

  return (
    <div
      className={`${sizeClasses[size]} rounded-full overflow-hidden flex-shrink-0 relative`}
      style={{
        background: `radial-gradient(circle at 50% 30%, ${color}80, ${color}45 50%, #1e2d40)`,
        boxShadow: `0 0 0 2px ${color}60, 0 0 16px ${color}30`,
      }}
    >
      {src && !imgError ? (
        <img
          src={src}
          alt={name}
          className="w-full h-full object-cover"
          loading="lazy"
          onError={() => setImgError(true)}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <span className="text-lg font-bold" style={{ color: color }}>
            {name.charAt(0)}
          </span>
        </div>
      )}
    </div>
  );
}

// ─── SPECIALTY TOPICS PER CHARACTER ───
function getSpecialtyTopics(key: string): { icon: string; text: string }[] {
  const topicsMap: Record<string, { icon: string; text: string }[]> = {
    YAYALIN: [
      { icon: '💼', text: 'Estrategia empresarial con IA' },
      { icon: '📊', text: 'Toma de decisiones con datos' },
      { icon: '🤝', text: 'Liderazgo en la era digital' },
      { icon: '🚀', text: 'Transformación digital de negocios' },
    ],
    YAYALINA: [
      { icon: '🧓', text: 'IA explicada para mayores' },
      { icon: '📱', text: 'Tecnología fácil paso a paso' },
      { icon: '🛡️', text: 'Seguridad digital para mayores' },
      { icon: '💡', text: 'Trucos para usar el móvil mejor' },
    ],
    PAPALIN: [
      { icon: '🧠', text: 'Machine Learning desde cero' },
      { icon: '📚', text: 'Cómo enseñar con IA' },
      { icon: '🔬', text: 'Redes neuronales explicadas fácil' },
      { icon: '🎓', text: 'Recursos educativos con IA' },
    ],
    MAMALINA: [
      { icon: '⚖️', text: 'Ética en la Inteligencia Artificial' },
      { icon: '🔍', text: 'Investigación científica con IA' },
      { icon: '📋', text: 'Regulación y leyes de IA' },
      { icon: '🌍', text: 'Impacto social de la tecnología' },
    ],
    CHAVALIN: [
      { icon: '🎮', text: 'IA en videojuegos' },
      { icon: '🕹️', text: 'Crear juegos con IA' },
      { icon: '🤖', text: 'NPCs inteligentes y bots' },
      { icon: '🏆', text: 'Gaming competitivo y IA' },
    ],
    CHAVALINA: [
      { icon: '🎨', text: 'Diseño gráfico con IA' },
      { icon: '🖼️', text: 'Crear imágenes con IA' },
      { icon: '✏️', text: 'Arte digital y creatividad' },
      { icon: '📸', text: 'Edición de fotos con IA' },
    ],
    PEQUELIN: [
      { icon: '🔭', text: 'Explorar la IA jugando' },
      { icon: '🧩', text: 'Puzzles y retos de IA para niños' },
      { icon: '🌟', text: 'Primeros pasos en programación' },
      { icon: '🤖', text: 'Robots y IA para niños' },
    ],
    PEQUELINA: [
      { icon: '💡', text: 'Creatividad infantil con IA' },
      { icon: '📖', text: 'Escribir cuentos con IA' },
      { icon: '🎵', text: 'Crear música con IA' },
      { icon: '🎭', text: 'Inventar personajes con IA' },
    ],
    ATOLONDRALIN: [
      { icon: '🛡️', text: 'Ciberseguridad básica' },
      { icon: '🔒', text: 'Proteger tus contraseñas' },
      { icon: '🕵️', text: 'Detectar estafas online' },
      { icon: '🔐', text: 'Privacidad en internet' },
    ],
    SABELIN: [
      { icon: '💡', text: 'Inventar con IA' },
      { icon: '🚀', text: 'Crear una startup con IA' },
      { icon: '⚡', text: 'Automatización inteligente' },
      { icon: '🔧', text: 'Prototipos rápidos con IA' },
    ],
  };
  return topicsMap[key] || [
    { icon: '🧠', text: 'Inteligencia Artificial general' },
    { icon: '💬', text: 'Conversación sobre IA' },
    { icon: '📚', text: 'Aprendizaje personalizado' },
    { icon: '🔍', text: 'Resolución de dudas' },
  ];
}

// ─── EXAMPLE QUESTIONS PER CHARACTER ───
function getExampleQuestions(key: string): string[] {
  const questionsMap: Record<string, string[]> = {
    YAYALIN: [
      '¿Cómo puedo usar ChatGPT para mejorar mi negocio?',
      '¿Qué es la inteligencia artificial y para qué sirve en una empresa?',
      '¿Cómo puedo tomar mejores decisiones usando datos?',
    ],
    YAYALINA: [
      '¿Cómo puedo usar el móvil para hablar con una inteligencia artificial?',
      '¿Es seguro usar internet a mi edad?',
      '¿Puedes explicarme qué es ChatGPT como si fuera la primera vez?',
    ],
    PAPALIN: [
      '¿Qué es el Machine Learning explicado de forma sencilla?',
      '¿Cómo puedo usar IA para enseñar mejor a mis alumnos?',
      '¿Qué son las redes neuronales y para qué sirven?',
    ],
    MAMALINA: [
      '¿Es ético que una IA tome decisiones por nosotros?',
      '¿Qué leyes regulan la inteligencia artificial en Europa?',
      '¿Cómo afecta la IA a la privacidad de las personas?',
    ],
    CHAVALIN: [
      '¿Cómo usan los videojuegos la inteligencia artificial?',
      '¿Puedo crear mi propio videojuego con IA?',
      '¿Qué juegos usan la mejor IA del mundo?',
    ],
    CHAVALINA: [
      '¿Cómo puedo crear una imagen con inteligencia artificial?',
      '¿Qué herramientas de diseño con IA son las mejores?',
      '¿Puedo hacer un logo para mi proyecto usando IA?',
    ],
    PEQUELIN: [
      '¿Qué es la inteligencia artificial? Explícamelo fácil',
      '¿Puedo programar un robot con IA?',
      '¿Hay juegos para aprender sobre IA?',
    ],
    PEQUELINA: [
      '¿Puedo escribir un cuento con ayuda de la IA?',
      '¿Cómo puedo crear música con inteligencia artificial?',
      '¿La IA puede ayudarme a dibujar?',
    ],
    ATOLONDRALIN: [
      '¿Cómo puedo proteger mis contraseñas?',
      '¿Cómo sé si un email es una estafa?',
      '¿Qué debo hacer para estar seguro en internet?',
    ],
    SABELIN: [
      '¿Cómo puedo inventar algo nuevo usando IA?',
      '¿Qué necesito para crear una startup de tecnología?',
      '¿Puedo automatizar tareas aburridas con IA?',
    ],
  };
  return questionsMap[key] || [
    '¿Qué es la inteligencia artificial?',
    '¿Cómo puedo empezar a usar IA en mi día a día?',
    '¿Qué herramientas de IA me recomiendas?',
  ];
}

// ─── MAIN COMPONENT ───
export default function ChatDashboard() {
  const { lang, getAvatarName, country } = usePRDLanguage();
  const [search, setSearch] = useState("");
  const [chatProfessor, setChatProfessor] = useState<Professor | null>(null);
  const [selectedProfessor, setSelectedProfessor] = useState<Professor | null>(null);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [expandedInfo, setExpandedInfo] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'familia' | 'imagelin' | 'prompts'>('familia');

  const searchRef = useRef<HTMLInputElement>(null);

  const professors = useMemo(() => buildProfessorList(), []);

  const filteredProfessors = useMemo(() => {
    if (!search.trim()) return professors;
    const q = search.toLowerCase();
    return professors.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.role.toLowerCase().includes(q) ||
      p.speciality.toLowerCase().includes(q) ||
      getAvatarName(p.key).toLowerCase().includes(q)
    );
  }, [professors, search, getAvatarName]);



  const getDisplayName = useCallback((p: Professor) => {
    return getAvatarName(p.key) || p.name;
  }, [getAvatarName]);

  // First click shows profile, second click (or button) opens chat
  const showProfile = useCallback((p: Professor) => {
    setSelectedProfessor(p);
    setChatProfessor(null);
    setMobileSidebarOpen(false);
  }, []);

  const openChat = useCallback((p: Professor) => {
    setChatProfessor(p);
    setSelectedProfessor(null);
    setMobileSidebarOpen(false);
  }, []);

  const handleSwitchAvatar = useCallback((avatarKey: string) => {
    const target = professors.find(p => p.key === avatarKey || p.key === avatarKey.toUpperCase());
    if (target) {
      setChatProfessor(null);
      setTimeout(() => setChatProfessor(target), 50);
    }
  }, [professors]);

  const profToCharacterData = useCallback((p: Professor): CharacterData => ({
    key: p.key,
    name: p.name,
    role: { es: p.role, en: p.role, zh: p.role },
    specialty: { es: p.speciality, en: p.speciality, zh: p.speciality },
    region: p.region,
    flag: "",
    color: p.color,
  }), []);

  // Ctrl+K to focus search
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  return (
    <div className="h-screen flex flex-col bg-[#0b0f19] text-white overflow-hidden">
      {/* Tutorial de primer uso */}
      {!chatProfessor && !selectedProfessor && <FirstUseTutorial page="chat" />}

      {/* ─── TOP NAV BAR ─── */}
      <header className="flex-shrink-0 h-16 border-b border-white/[0.08] bg-[#0f1320]/95 backdrop-blur-md flex items-center px-4 sm:px-6 gap-4 z-50">
        {/* Mobile menu toggle */}
        <button
          onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          className="lg:hidden p-2.5 text-white/50 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
          aria-label="Abrir menú de familia"
        >
          {mobileSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Logo */}
        <a href="/" className="flex items-center gap-2 flex-shrink-0">
          <img
            src="https://files.manuscdn.com/user_upload_by_module/session_file/310419663032363896/bUKqcjlDiFJuymcE.png"
            alt="LINCE"
            className="w-9 h-9 rounded-xl object-cover"
          />
          <span className="font-['Space_Grotesk'] font-bold text-lg text-white/90">LINCE</span>
        </a>

        {/* Country flag */}
        <div className="hidden sm:flex items-center gap-2 ml-1 px-3 py-1.5 rounded-lg bg-white/[0.05]">
          <span className="text-base">{COUNTRY_FLAGS[country] || '🇪🇸'}</span>
          <span className="text-xs text-white/40 uppercase font-medium">{country}</span>
        </div>

        {/* Language selector */}
        <div className="hidden sm:block">
          <PRDLanguageSelector />
        </div>

        {/* Center tabs */}
        <nav className="flex items-center gap-1 bg-white/[0.04] rounded-xl p-1 border border-white/[0.06]">
          <button
            onClick={() => { setActiveTab('familia'); setChatProfessor(null); setSelectedProfessor(null); }}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-lg transition-all ${
              activeTab === 'familia'
                ? 'bg-[#D4A843]/20 text-[#D4A843] border border-[#D4A843]/30'
                : 'text-white/50 hover:text-white/80 hover:bg-white/5'
            }`}
          >
            <span className="text-base">👨‍👩‍👧‍👦</span>
            <span className="hidden sm:inline">Familia</span>
          </button>
          <button
            onClick={() => { setActiveTab('imagelin'); setChatProfessor(null); setSelectedProfessor(null); }}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-lg transition-all ${
              activeTab === 'imagelin'
                ? 'bg-[#9C27B0]/20 text-[#9C27B0] border border-[#9C27B0]/30'
                : 'text-white/50 hover:text-white/80 hover:bg-white/5'
            }`}
          >
            <ImageIcon size={16} />
            <span className="hidden sm:inline">Crear Imagen</span>
          </button>
          <button
            onClick={() => { setActiveTab('prompts'); setChatProfessor(null); setSelectedProfessor(null); }}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-lg transition-all ${
              activeTab === 'prompts'
                ? 'bg-[#D4A843]/20 text-[#D4A843] border border-[#D4A843]/30'
                : 'text-white/50 hover:text-white/80 hover:bg-white/5'
            }`}
          >
            <FileText size={16} />
            <span className="hidden sm:inline">Generar Prompts</span>
          </button>
        </nav>

        <div className="flex-1" />

        {/* Right actions */}
        <nav className="flex items-center gap-2">
          <a
            href="/arsenal-ia"
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-white/50 hover:text-white/90 hover:bg-white/10 rounded-xl transition-colors"
          >
            <Wrench size={16} />
            <span className="hidden lg:inline">Herramientas</span>
          </a>
          <a
            href="/lincelin"
            className="flex items-center gap-2 px-3 py-2 text-sm font-bold text-[#00E5FF] bg-[#00E5FF]/10 hover:bg-[#00E5FF]/20 rounded-xl transition-colors border border-[#00E5FF]/20"
          >
            <Sparkles size={16} />
            <span className="hidden lg:inline">Mi Avatar</span>
          </a>
        </nav>
      </header>

      {/* ─── MAIN CONTENT ─── */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Mobile overlay */}
        {mobileSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/60 z-40 lg:hidden"
            onClick={() => setMobileSidebarOpen(false)}
          />
        )}

        {/* ─── LEFT SIDEBAR ─── */}
        {activeTab === 'familia' && (
        <aside
          className={`
            flex-shrink-0 border-r border-white/[0.06] bg-[#0b0f19] flex flex-col overflow-hidden transition-transform duration-200
            w-[260px]
            ${mobileSidebarOpen ? 'fixed inset-y-14 left-0 z-50 translate-x-0' : 'max-lg:-translate-x-full max-lg:fixed max-lg:inset-y-14 max-lg:left-0 max-lg:z-50 lg:translate-x-0'}
          `}
        >
          {/* Search */}
          <div className="p-4">
            <div className="relative">
              <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
              <input
                ref={searchRef}
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar familiar..."
                className="w-full bg-white/[0.05] border border-white/[0.08] rounded-xl pl-11 pr-4 py-3 text-base text-white placeholder-white/30 focus:outline-none focus:border-[#00E5FF]/40 focus:bg-white/[0.08] transition-all"
              />
            </div>
          </div>

          {/* Familia header */}
          <div className="px-4 pb-3 flex items-center gap-2">
            <span className="text-lg">👨‍👩‍👧‍👦</span>
            <span className="text-sm font-bold uppercase tracking-wider text-[#D4A843]">
              Familia
            </span>
            <div className="flex-1" />
            <span className="text-xs text-white/30 font-medium">{professors.length}</span>
          </div>

          {/* Divider */}
          <div className="h-px bg-[#D4A843]/15 mx-4" />

          {/* Professor list */}
          <div className="flex-1 overflow-y-auto pt-2">
            {filteredProfessors.map((prof) => {
              const isActive = chatProfessor?.key === prof.key || selectedProfessor?.key === prof.key;
              const isExpanded = expandedInfo === prof.key;
              const displayName = getDisplayName(prof);
              const badge = getSpecialtyBadge(prof.speciality);
              return (
                <div key={prof.key}>
                  <div
                    className={`
                      w-full flex items-center gap-3 px-4 py-3 text-left transition-all rounded-xl mx-1 min-h-[56px] cursor-pointer
                      ${isActive
                        ? 'bg-white/[0.08]'
                        : 'hover:bg-white/[0.05]'
                      }
                    `}
                    style={isActive ? { borderLeft: `3px solid ${prof.color}` } : { borderLeft: '3px solid transparent' }}
                  >
                    <div onClick={() => showProfile(prof)} className="flex items-center gap-3 flex-1 min-w-0">
                      <AvatarCircle
                        src={prof.profilePic || prof.image}
                        name={displayName}
                        size="sm"
                        color={prof.color}
                      />
                      <div className="min-w-0 flex-1">
                        <div className={`text-sm font-bold truncate ${isActive ? 'text-white' : 'text-white/80'}`}>
                          {displayName}
                        </div>
                        <div className="text-xs text-white/35 truncate mt-0.5">
                          {prof.role}
                        </div>
                      </div>
                    </div>
                    {/* Info toggle */}
                    <button
                      onClick={(e) => { e.stopPropagation(); setExpandedInfo(isExpanded ? null : prof.key); }}
                      className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                        isExpanded ? 'bg-[#00E5FF]/15 text-[#00E5FF]' : 'bg-white/5 text-white/30 hover:text-white/60 hover:bg-white/10'
                      }`}
                      title="Ver info"
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        {isExpanded ? <path d="M18 15l-6-6-6 6" /> : <path d="M6 9l6 6 6-6" />}
                      </svg>
                    </button>
                  </div>
                  {/* Expandable info panel */}
                  {isExpanded && (
                    <div className="mx-3 mb-2 px-3 py-3 rounded-xl bg-white/[0.03] border border-white/[0.06] animate-[fadeIn_0.2s_ease-out]">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-base">{badge}</span>
                        <span className="text-xs font-bold" style={{ color: prof.color }}>{prof.speciality}</span>
                      </div>
                      <div className="space-y-1.5 mb-3">
                        {getSpecialtyTopics(prof.key).slice(0, 3).map((topic, i) => (
                          <div key={i} className="flex items-center gap-2 text-[10px] text-white/50">
                            <span className="text-xs flex-shrink-0">{topic.icon}</span>
                            <span className="truncate">{topic.text}</span>
                          </div>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => showProfile(prof)}
                          className="flex-1 text-[10px] font-bold py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-all border border-white/[0.06]"
                        >
                          Ver perfil
                        </button>
                        <button
                          onClick={() => openChat(prof)}
                          className="flex-1 text-[10px] font-bold py-1.5 rounded-lg transition-all"
                          style={{ background: `${prof.color}25`, color: prof.color, border: `1px solid ${prof.color}40` }}
                        >
                          Chatear
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Bottom */}
          <div className="border-t border-white/[0.06] p-4">
            <a href="/" className="flex items-center gap-2.5 text-sm text-white/40 hover:text-white/70 transition-colors px-1 py-1 font-medium">
              <ChevronLeft size={18} />
              Volver al inicio
            </a>
          </div>
        </aside>
        )}

        {/* ─── MAIN AREA ─── */}
        <main className="flex-1 flex flex-col overflow-hidden bg-[#0d1219]">
          {activeTab === 'prompts' ? (
            /* ─── PROMPT PROFESIONAL EMBEDDED VIEW ─── */
            <Suspense fallback={
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <Loader2 className="w-8 h-8 text-[#D4A843] animate-spin mx-auto mb-3" />
                  <p className="text-white/50 text-sm">Cargando Generador de Prompts...</p>
                </div>
              </div>
            }>
              <PromptProfesional embedded={true} />
            </Suspense>
          ) : activeTab === 'imagelin' ? (
            /* ─── IMAGELIN EMBEDDED VIEW ─── */
            <Suspense fallback={
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <Loader2 className="w-8 h-8 text-[#00E5FF] animate-spin mx-auto mb-3" />
                  <p className="text-white/50 text-sm">Cargando IMAGELIN...</p>
                </div>
              </div>
            }>
              <PromptStudio embedded={true} />
            </Suspense>
          ) : chatProfessor ? (
            /* ─── EMBEDDED CHAT VIEW ─── */
            <div className="flex-1 flex flex-col overflow-hidden">
              <ArtistChatModal
                artist={profToCharacterData(chatProfessor)}
                lang={lang as "es" | "en" | "zh" | "pt-BR" | "pt-PT"}
                onClose={() => { setChatProfessor(null); setSelectedProfessor(null); }}
                onSwitchAvatar={handleSwitchAvatar}
                embedded={true}
              />
            </div>
          ) : selectedProfessor ? (
            /* ─── SPECIALTY PROFILE VIEW ─── */
            <div className="flex-1 overflow-y-auto">
              <div className="max-w-[800px] mx-auto px-5 sm:px-8 pt-8 sm:pt-12 pb-16">
                {/* Back button */}
                <button
                  onClick={() => setSelectedProfessor(null)}
                  className="flex items-center gap-2 text-white/50 hover:text-white text-base font-medium mb-8 transition-colors px-3 py-2 -ml-3 rounded-xl hover:bg-white/5"
                >
                  <ChevronLeft size={22} />
                  <span>Volver a la familia</span>
                </button>

                {/* Profile header */}
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-8 mb-10">
                  {/* Big avatar */}
                  <div className="flex-shrink-0">
                    <div
                      className="w-40 h-40 sm:w-48 sm:h-48 rounded-full flex items-center justify-center relative"
                      style={{
                        background: `radial-gradient(circle, ${selectedProfessor.color}30 0%, ${selectedProfessor.color}15 60%, #1a2a30 100%)`,
                        boxShadow: `0 0 0 5px ${selectedProfessor.color}, 0 0 30px ${selectedProfessor.color}80, 0 0 60px ${selectedProfessor.color}40`,
                        border: `3px solid ${selectedProfessor.color}60`,
                      }}
                    >
                      {/* Profile image - clean display without overlays */}
                      <img
                        src={selectedProfessor.profilePic || selectedProfessor.image}
                        alt={getDisplayName(selectedProfessor)}
                        className="absolute inset-0 w-full h-full object-cover rounded-full"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                      />
                    </div>
                  </div>
                  {/* Name and role */}
                  <div className="text-center sm:text-left flex-1">
                    <h1 className="font-['Space_Grotesk'] font-black text-3xl sm:text-4xl text-white mb-2">
                      {getDisplayName(selectedProfessor)}
                    </h1>
                    <p className="text-xl sm:text-2xl text-white/60 mb-3">
                      {selectedProfessor.role}
                    </p>
                    <div
                      className="inline-block px-5 py-2 rounded-full text-base sm:text-lg font-bold"
                      style={{
                        backgroundColor: `${selectedProfessor.color}20`,
                        color: selectedProfessor.color,
                        border: `2px solid ${selectedProfessor.color}40`,
                      }}
                    >
                      {selectedProfessor.speciality}
                    </div>
                  </div>
                </div>

                {/* What does this person teach? */}
                <div className="bg-gradient-to-br from-[#00E5FF]/[0.06] to-[#D4A843]/[0.04] border border-[#00E5FF]/15 rounded-2xl p-6 sm:p-8 mb-8">
                  <h2 className="text-xl sm:text-2xl font-black text-white mb-4 flex items-center gap-3">
                    <span className="text-2xl">📚</span> ¿Qué te puede enseñar?
                  </h2>
                  <p className="text-white/70 text-base sm:text-lg leading-relaxed mb-5">
                    <strong className="text-white">{getDisplayName(selectedProfessor)}</strong> es el/la <strong className="text-[#D4A843]">{selectedProfessor.role}</strong> de la familia LINCE IA.
                    Su especialidad es <strong style={{ color: selectedProfessor.color }}>{selectedProfessor.speciality}</strong>.
                    Puedes preguntarle cualquier cosa sobre este tema y te lo explicará de forma sencilla.
                  </p>
                  {/* Topics this person covers */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {getSpecialtyTopics(selectedProfessor.key).map((topic, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.04] border border-white/[0.06]">
                        <span className="text-lg flex-shrink-0">{topic.icon}</span>
                        <span className="text-white/70 text-base">{topic.text}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Example questions */}
                <div className="bg-[#0f1520] border border-white/[0.08] rounded-2xl p-6 sm:p-8 mb-10">
                  <h2 className="text-xl sm:text-2xl font-black text-white mb-4 flex items-center gap-3">
                    <span className="text-2xl">💬</span> Ejemplos de preguntas que puedes hacerle
                  </h2>
                  <p className="text-white/50 text-base mb-5">
                    No necesitas saber nada de tecnología. Aquí tienes ideas para empezar:
                  </p>
                  <div className="space-y-3">
                    {getExampleQuestions(selectedProfessor.key).map((q, i) => (
                      <button
                        key={i}
                        onClick={() => openChat(selectedProfessor)}
                        className="w-full text-left p-4 sm:p-5 rounded-xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/[0.06] hover:border-white/[0.12] transition-all group"
                      >
                        <div className="flex items-start gap-3">
                          <span className="text-[#00E5FF] text-xl flex-shrink-0 mt-0.5">❓</span>
                          <span className="text-white/70 group-hover:text-white text-base sm:text-lg leading-relaxed transition-colors">
                            "{q}"
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* BIG CHAT BUTTON */}
                <div className="text-center">
                  <button
                    data-tour="chat-button"
                    onClick={() => openChat(selectedProfessor)}
                    className="inline-flex items-center gap-4 px-10 sm:px-14 py-5 sm:py-6 rounded-2xl text-xl sm:text-2xl font-black transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg"
                    style={{
                      background: `linear-gradient(135deg, ${selectedProfessor.color}, ${selectedProfessor.color}cc)`,
                      color: '#000',
                      boxShadow: `0 8px 32px ${selectedProfessor.color}50`,
                    }}
                  >
                    <MessageCircle size={28} />
                    Empezar a chatear con {getDisplayName(selectedProfessor)}
                  </button>
                  <p className="text-white/40 text-base mt-4">
                    También puedes hacer clic en cualquier pregunta de arriba para empezar directamente
                  </p>
                </div>
              </div>
            </div>
          ) : (
            /* ─── WELCOME + GRID VIEW ─── */
            <div className="flex-1 overflow-y-auto">
              {/* ═══ WELCOME EXPLANATION SECTION ═══ */}
              <div className="max-w-[900px] mx-auto px-5 sm:px-8 pt-10 sm:pt-14 pb-6">
                {/* Main title with lince mascot */}
                <div className="text-center mb-8">
                  {/* Lince mascot image */}
                  <div className="mx-auto mb-6 w-28 h-28 sm:w-36 sm:h-36 rounded-full overflow-hidden border-4 border-[#00E5FF]/40" style={{ boxShadow: '0 0 30px rgba(0,229,255,0.3), 0 0 60px rgba(0,229,255,0.15)' }}>
                    <img
                      src="https://files.manuscdn.com/user_upload_by_module/session_file/310419663032363896/bUKqcjlDiFJuymcE.png"
                      alt="LINCE - Mascota"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-[#00E5FF]/10 to-[#D4A843]/10 border border-[#00E5FF]/20 mb-6">
                    <span className="text-base sm:text-lg font-bold text-[#00E5FF]">Aprende Inteligencia Artificial jugando</span>
                  </div>
                  <h1 className="font-['Space_Grotesk'] font-black text-3xl sm:text-4xl lg:text-5xl mb-5 text-white leading-tight">
                    Bienvenido a <span className="text-[#00E5FF]">LINCE</span> <span className="text-[#D4A843]">IA</span>
                  </h1>
                  <p className="text-white/70 text-lg sm:text-xl lg:text-2xl max-w-2xl mx-auto leading-relaxed">
                    La plataforma donde <strong className="text-white">toda la familia</strong> aprende a usar la Inteligencia Artificial.
                    Desde <strong className="text-[#00E5FF]">13 años hasta 90 años</strong>, cada persona aprende a su ritmo.
                  </p>
                </div>

                {/* What is this? - Big clear explanation */}
                <div className="bg-gradient-to-br from-[#00E5FF]/[0.06] to-[#D4A843]/[0.04] border border-[#00E5FF]/15 rounded-2xl p-6 sm:p-8 mb-8">
                  <h2 className="text-xl sm:text-2xl font-black text-white mb-4 flex items-center gap-3">
                    <span className="text-2xl">❓</span> ¿Qué es esto?
                  </h2>
                  <p className="text-white/70 text-base sm:text-lg leading-relaxed">
                    LINCE IA es como tener una <strong className="text-white">familia de profesores de IA</strong> siempre disponible.
                    Cada miembro de la familia es un <strong className="text-[#D4A843]">especialista</strong> en un tema diferente de Inteligencia Artificial.
                    Tú les haces preguntas, ellos te enseñan. <strong className="text-white">Así de fácil.</strong>
                  </p>
                </div>

                {/* Step by step - HOW TO USE */}
                <div className="mb-10">
                  <h2 className="text-xl sm:text-2xl font-black text-white mb-6 text-center">
                    📝 Cómo usar LINCE IA en 3 pasos
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
                    {/* Step 1 */}
                    <div className="bg-[#0f1520] border border-[#00E5FF]/15 rounded-2xl p-5 sm:p-6 text-center">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#00E5FF]/10 border-2 border-[#00E5FF]/30 flex items-center justify-center mx-auto mb-4">
                        <span className="text-3xl sm:text-4xl font-black text-[#00E5FF]">1</span>
                      </div>
                      <h3 className="text-lg sm:text-xl font-bold text-white mb-2">Elige un familiar</h3>
                      <p className="text-white/50 text-sm sm:text-base leading-relaxed">
                        Mira la lista de la izquierda. Cada uno sabe de un tema diferente. <strong className="text-white/70">Haz clic en el que te interese.</strong>
                      </p>
                    </div>
                    {/* Step 2 */}
                    <div className="bg-[#0f1520] border border-[#D4A843]/15 rounded-2xl p-5 sm:p-6 text-center">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#D4A843]/10 border-2 border-[#D4A843]/30 flex items-center justify-center mx-auto mb-4">
                        <span className="text-3xl sm:text-4xl font-black text-[#D4A843]">2</span>
                      </div>
                      <h3 className="text-lg sm:text-xl font-bold text-white mb-2">Hazle una pregunta</h3>
                      <p className="text-white/50 text-sm sm:text-base leading-relaxed">
                        Escribe lo que quieras saber sobre IA. <strong className="text-white/70">No hay preguntas tontas.</strong> Pregunta lo que sea.
                      </p>
                    </div>
                    {/* Step 3 */}
                    <div className="bg-[#0f1520] border border-[#00E5FF]/15 rounded-2xl p-5 sm:p-6 text-center">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#00E5FF]/10 border-2 border-[#00E5FF]/30 flex items-center justify-center mx-auto mb-4">
                        <span className="text-3xl sm:text-4xl font-black text-[#00E5FF]">3</span>
                      </div>
                      <h3 className="text-lg sm:text-xl font-bold text-white mb-2">Aprende y disfruta</h3>
                      <p className="text-white/50 text-sm sm:text-base leading-relaxed">
                        El familiar te responde con explicaciones claras. <strong className="text-white/70">¡Aprende IA sin complicaciones!</strong>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Who is each family member? */}
                <div className="mb-6">
                  <h2 className="text-xl sm:text-2xl font-black text-white mb-2 text-center">
                    👨‍👩‍👧‍👦 Conoce a la Familia
                  </h2>
                  <p className="text-white/50 text-base sm:text-lg text-center mb-6">
                    Haz clic en cualquier familiar para empezar a hablar con él
                  </p>
                </div>
              </div>

              {/* Grid of family cards */}
              <div className="px-5 sm:px-8 lg:px-10 pb-16 max-w-[900px] mx-auto">
                <div data-tour="family-grid" className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                  {filteredProfessors.map((prof) => {
                    const displayName = getDisplayName(prof);
                    const badge = getSpecialtyBadge(prof.speciality);
                    const imgSrc = prof.image || prof.profilePic;
                    return (
                      <button
                        key={prof.key}
                        onClick={() => showProfile(prof)}
                        className="group flex items-center gap-4 sm:gap-5 p-4 sm:p-5 rounded-2xl transition-all duration-200 border-2 border-white/[0.06] hover:border-white/[0.15] bg-[#0f1520] hover:bg-[#131a28] text-left min-h-[90px]"
                      >
                        {/* Avatar */}
                        <div className="relative flex-shrink-0">
                          <div
                            className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden transition-all duration-300 group-hover:scale-105"
                            style={{
                              background: `radial-gradient(circle at 50% 25%, ${prof.color}90, ${prof.color}50 55%, #1e2d40)`,
                              boxShadow: `0 0 0 3px ${prof.color}70, 0 4px 24px ${prof.color}30`,
                            }}
                          >
                            {imgSrc ? (
                              <img
                                src={imgSrc}
                                alt={displayName}
                                className="w-full h-full object-cover"
                                loading="lazy"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).style.display = 'none';
                                }}
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-3xl">
                                {badge}
                              </div>
                            )}
                          </div>
                          {/* Badge */}
                          <div
                            className="absolute -bottom-1 -right-1 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-sm border-2 border-[#0f1520]"
                            style={{ backgroundColor: `${prof.color}35` }}
                          >
                            {badge}
                          </div>
                        </div>
                        {/* Info */}
                        <div className="min-w-0 flex-1">
                          <div className="font-bold text-base sm:text-lg text-white/90 group-hover:text-white transition-colors leading-tight">
                            {displayName}
                          </div>
                          <div className="text-sm sm:text-base text-white/40 mt-0.5 leading-tight">
                            {prof.role}
                          </div>
                          <div className="text-xs sm:text-sm text-[#00E5FF]/50 mt-1.5 leading-tight">
                            {prof.speciality}
                          </div>
                        </div>
                        {/* Arrow */}
                        <div className="flex-shrink-0 text-white/20 group-hover:text-[#00E5FF]/60 transition-colors text-xl">
                          →
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Empty state */}
                {filteredProfessors.length === 0 && (
                  <div className="text-center py-16">
                    <Search size={40} className="mx-auto mb-4 text-white/10" />
                    <p className="text-white/40 text-lg">No se encontraron familiares</p>
                    <button
                      onClick={() => { setSearch(''); }}
                      className="mt-4 text-[#00E5FF]/60 hover:text-[#00E5FF] text-base font-medium transition-colors"
                    >
                      Limpiar búsqueda
                    </button>
                  </div>
                )}

                {/* Bottom encouragement */}
                <div className="mt-10 text-center p-6 bg-gradient-to-r from-[#00E5FF]/[0.04] to-[#D4A843]/[0.04] border border-white/[0.06] rounded-2xl">
                  <p className="text-white/50 text-base sm:text-lg">
                    💡 <strong className="text-white/70">Consejo:</strong> No necesitas saber nada de tecnología.
                    Solo elige un familiar y pregúntale lo que quieras. <strong className="text-white/70">¡Él te enseña!</strong>
                  </p>
                </div>
              </div>
            </div>
          )}
        </main>

        {/* Right panel removed - welcome content is now in the main area */}
      </div>
    </div>
  );
}

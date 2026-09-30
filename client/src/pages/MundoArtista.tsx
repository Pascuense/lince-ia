import { useState, useEffect, useRef } from "react";
import { useRoute } from "wouter";
import { usePRDLanguage, tl, type PRDLanguage } from "@/contexts/PRDLanguageContext";
import { AVATAR_MUSICALIN } from "@/lib/avatarConstants";
import { ArrowLeft, Music, Sparkles, Mic2, Video, Headphones, Star, ExternalLink, Copy, Check } from "lucide-react";
import { GlobalNavBar } from "@/components/GlobalNavBar";

// ─── ARTIST CODES DATABASE ───
interface ArtistProfile {
  code: string;
  avatarKey: string;
  name: string;
  realName: string;
  role: { es: string; en: string; zh: string };
  bio: { es: string; en: string; zh: string };
  greeting: { es: string; en: string; zh: string };
  color: string;
  accentColor: string;
  stats: { followers: string; streams: string; videos: string };
  socialLinks: { platform: string; url: string; icon: string }[];
  featuredContent: { title: { es: string; en: string; zh: string }; type: string; desc: { es: string; en: string; zh: string } }[];
  aiTools: { name: string; use: { es: string; en: string; zh: string }; url: string }[];
}

const ARTIST_PROFILES: Record<string, ArtistProfile> = {
  "YOUNGBRIEL": {
    code: "YOUNGBRIEL",
    avatarKey: "LUMALIN",
    name: "LUMALIN",
    realName: "LUMALIN",
    role: { es: "Mentor IA Generativa", en: "Generative AI Mentor", zh: "生成式AI导师" },
    bio: {
      es: "Artista musical que fusiona la música con la inteligencia artificial. Referente en el uso de IA para la creación de contenido musical y visual. En LINCE, LUMALIN te enseña a usar la IA como herramienta creativa para potenciar tu arte.",
      en: "Music artist who fuses music with artificial intelligence. A reference in the use of AI for musical and visual content creation. In LINCE, LUMALIN teaches you to use AI as a creative tool to enhance your art.",
      zh: "智利城市艺术家，将音乐与人工智能融合。在AI音乐和视觉内容创作方面的先驱。在LINCE中，LUMALIN教你将AI作为创意工具来提升你的艺术。"
    },
    greeting: {
      es: "¡Qué onda, crack! Soy LUMALIN, tu guía en el mundo de la IA creativa. Aquí vas a aprender a crear música, vídeos y contenido brutal usando inteligencia artificial. ¡Vamos con todo!",
      en: "Hey, what's up! I'm LUMALIN, your guide in the world of creative AI. Here you'll learn to create music, videos and amazing content using artificial intelligence. Let's go!",
      zh: "嘿！我是LUMALIN，你在创意AI世界的向导。在这里你将学会使用人工智能创作音乐、视频和精彩内容。我们开始吧！"
    },
    color: "#FF6B35",
    accentColor: "#FF9F1C",
    stats: { followers: "500K+", streams: "50M+", videos: "200+" },
    socialLinks: [
      { platform: "Instagram", url: "https://instagram.com/youngbriel", icon: "📸" },
      { platform: "YouTube", url: "https://youtube.com/@youngbriel", icon: "🎬" },
      { platform: "Spotify", url: "#", icon: "🎵" },
      { platform: "TikTok", url: "https://tiktok.com/@youngbriel", icon: "📱" },
    ],
    featuredContent: [
      { title: { es: "Crea tu beat con IA", en: "Create your beat with AI", zh: "用AI创作你的节拍" }, type: "tutorial", desc: { es: "Aprende a generar beats profesionales usando Suno AI y herramientas de producción musical con IA", en: "Learn to generate professional beats using Suno AI and AI music production tools", zh: "学习使用Suno AI和AI音乐制作工具生成专业节拍" } },
      { title: { es: "Videoclip con Kling AI", en: "Music video with Kling AI", zh: "用Kling AI制作MV" }, type: "tutorial", desc: { es: "Genera un videoclip completo para tu canción usando Kling AI y HeyGen", en: "Generate a complete music video for your song using Kling AI and HeyGen", zh: "使用Kling AI和HeyGen为你的歌曲生成完整MV" } },
      { title: { es: "Portada de álbum con Midjourney", en: "Album cover with Midjourney", zh: "用Midjourney制作专辑封面" }, type: "tutorial", desc: { es: "Diseña portadas de álbum profesionales con prompts creativos en Midjourney", en: "Design professional album covers with creative prompts in Midjourney", zh: "用Midjourney的创意提示设计专业专辑封面" } },
      { title: { es: "Letra con ChatGPT", en: "Lyrics with ChatGPT", zh: "用ChatGPT写歌词" }, type: "tutorial", desc: { es: "Usa ChatGPT para escribir letras, encontrar rimas y crear hooks memorables", en: "Use ChatGPT to write lyrics, find rhymes and create memorable hooks", zh: "使用ChatGPT写歌词、找韵脚和创作难忘的Hook" } },
    ],
    aiTools: [
      { name: "Suno AI", use: { es: "Crear música y beats con IA", en: "Create music and beats with AI", zh: "用AI创作音乐和节拍" }, url: "https://suno.com" },
      { name: "ChatGPT", use: { es: "Escribir letras y crear conceptos", en: "Write lyrics and create concepts", zh: "写歌词和创建概念" }, url: "https://chat.openai.com" },
      { name: "Midjourney", use: { es: "Diseñar portadas y arte visual", en: "Design covers and visual art", zh: "设计封面和视觉艺术" }, url: "https://midjourney.com" },
      { name: "Kling AI", use: { es: "Generar videoclips y contenido visual", en: "Generate music videos and visual content", zh: "生成MV和视觉内容" }, url: "https://klingai.com" },
      { name: "HeyGen", use: { es: "Crear vídeos con avatar IA", en: "Create videos with AI avatar", zh: "用AI头像创建视频" }, url: "https://www.heygen.com" },
      { name: "ElevenLabs", use: { es: "Clonar voz y crear audio IA", en: "Clone voice and create AI audio", zh: "克隆声音和创建AI音频" }, url: "https://elevenlabs.io" },
    ],
  },
  "GIULANOSOSA": {
    code: "GIULANOSOSA",
    avatarKey: "STILIN",
    name: "STILIN",
    realName: "Julianno Sosa (3M+ oyentes, 110M views)",
    role: { es: "Streamer & Coach IA Gaming", en: "Streamer & AI Gaming Coach", zh: "主播与AI游戏教练" },
    bio: {
      es: "Cantante con más de 3 millones de oyentes y 110 millones de visualizaciones. En LINCE, STILIN te enseña a usar la IA para streaming, gaming y entretenimiento digital. Aprende a crear contenido viral con herramientas de inteligencia artificial.",
      en: "Singer with over 3 million listeners and 110 million views. In LINCE, STILIN teaches you to use AI for streaming, gaming and digital entertainment. Learn to create viral content with AI tools.",
      zh: "智利城市歌手，拥有超过300万听众和1.1亿观看量。在LINCE中，STILIN教你使用AI进行直播、游戏和数字娱乐。学习使用AI工具创建病毒式内容。"
    },
    greeting: {
      es: "¡Wena, compadre! Soy STILIN, tu coach de IA para el mundo del streaming y el gaming. Acá te voy a enseñar a usar la inteligencia artificial para crear contenido que reviente. ¡Dale que vamos!",
      en: "Hey, buddy! I'm STILIN, your AI coach for the streaming and gaming world. Here I'll teach you to use artificial intelligence to create content that blows up. Let's go!",
      zh: "嘿，伙伴！我是STILIN，你在直播和游戏世界的AI教练。在这里我会教你使用人工智能创建爆款内容。我们开始吧！"
    },
    color: "#1DB954",
    accentColor: "#00E5FF",
    stats: { followers: "3M+", streams: "110M+", videos: "500+" },
    socialLinks: [
      { platform: "Instagram", url: "https://instagram.com/juliannososa", icon: "📸" },
      { platform: "YouTube", url: "https://youtube.com/@juliannososa", icon: "🎬" },
      { platform: "Spotify", url: "#", icon: "🎵" },
      { platform: "TikTok", url: "https://tiktok.com/@juliannososa", icon: "📱" },
    ],
    featuredContent: [
      { title: { es: "Stream con IA integrada", en: "Stream with integrated AI", zh: "集成AI的直播" }, type: "tutorial", desc: { es: "Configura tu stream con herramientas de IA para interactuar con tu audiencia de forma automática", en: "Set up your stream with AI tools to interact with your audience automatically", zh: "使用AI工具设置你的直播，自动与观众互动" } },
      { title: { es: "Edita vídeos con Runway", en: "Edit videos with Runway", zh: "用Runway编辑视频" }, type: "tutorial", desc: { es: "Usa Runway ML para editar tus vídeos con efectos de IA cinematográficos", en: "Use Runway ML to edit your videos with cinematic AI effects", zh: "使用Runway ML用电影级AI特效编辑你的视频" } },
      { title: { es: "Genera thumbnails virales", en: "Generate viral thumbnails", zh: "生成病毒式缩略图" }, type: "tutorial", desc: { es: "Crea thumbnails que atraigan clics usando DALL-E 3 y Canva AI", en: "Create click-attracting thumbnails using DALL-E 3 and Canva AI", zh: "使用DALL-E 3和Canva AI创建吸引点击的缩略图" } },
      { title: { es: "Música para tus streams", en: "Music for your streams", zh: "为你的直播创作音乐" }, type: "tutorial", desc: { es: "Genera música libre de copyright para tus streams con Suno AI", en: "Generate copyright-free music for your streams with Suno AI", zh: "用Suno AI为你的直播生成无版权音乐" } },
    ],
    aiTools: [
      { name: "ChatGPT", use: { es: "Crear guiones y conceptos para streams", en: "Create scripts and concepts for streams", zh: "为直播创建脚本和概念" }, url: "https://chat.openai.com" },
      { name: "Runway ML", use: { es: "Editar vídeos con efectos IA", en: "Edit videos with AI effects", zh: "用AI特效编辑视频" }, url: "https://runwayml.com" },
      { name: "DALL-E 3", use: { es: "Generar thumbnails y arte", en: "Generate thumbnails and art", zh: "生成缩略图和艺术" }, url: "https://openai.com/dall-e-3" },
      { name: "Suno AI", use: { es: "Crear música para contenido", en: "Create music for content", zh: "为内容创作音乐" }, url: "https://suno.com" },
      { name: "Kling AI", use: { es: "Generar clips de vídeo con IA", en: "Generate AI video clips", zh: "生成AI视频剪辑" }, url: "https://klingai.com" },
      { name: "Canva AI", use: { es: "Diseñar gráficos para redes", en: "Design graphics for social media", zh: "为社交媒体设计图形" }, url: "https://www.canva.com" },
    ],
  },
};

// ─── ANIMATED GREETING COMPONENT ───
function AnimatedGreeting({ artist, lang, onComplete }: { artist: ArtistProfile; lang: string; onComplete: () => void }) {
  const [charIndex, setCharIndex] = useState(0);
  const [showAvatar, setShowAvatar] = useState(false);
  const greeting = artist.greeting[lang as keyof typeof artist.greeting] || artist.greeting.es;
  const avatarImg = AVATAR_MUSICALIN[artist.avatarKey as keyof typeof AVATAR_MUSICALIN];

  useEffect(() => {
    const t1 = setTimeout(() => setShowAvatar(true), 300);
    return () => clearTimeout(t1);
  }, []);

  useEffect(() => {
    if (charIndex < greeting.length) {
      const timer = setTimeout(() => setCharIndex(prev => prev + 1), 25);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(onComplete, 2000);
      return () => clearTimeout(timer);
    }
  }, [charIndex, greeting.length, onComplete]);

  return (
    <div className="pt-14 fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-xl">
      <GlobalNavBar />
      <div className="max-w-lg w-full mx-4 text-center">
        {/* Avatar with glow */}
        <div className={`mb-6 transition-all duration-700 ${showAvatar ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}>
          <div className="relative inline-block">
            <div className="absolute inset-0 rounded-full blur-2xl opacity-50" style={{ background: artist.color }} />
            <img
              src={avatarImg}
              alt={artist.name}
              className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-full border-4 object-cover animate-bounce"
              style={{ borderColor: artist.color, animationDuration: '2s' }}
            />
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-black font-bold text-sm" style={{ background: artist.color }}>
              {artist.name}
            </div>
          </div>
        </div>

        {/* Typing greeting */}
        <div className="bg-[#111]/80 border rounded-2xl p-6 mx-2" style={{ borderColor: `${artist.color}40` }}>
          <p className="text-white text-base sm:text-lg leading-relaxed text-left font-medium min-h-[80px]">
            {greeting.substring(0, charIndex)}
            {charIndex < greeting.length && <span className="animate-pulse" style={{ color: artist.color }}>|</span>}
          </p>
        </div>

        {/* Skip button */}
        <button
          onClick={onComplete}
          className="mt-4 px-6 py-2 rounded-full text-sm font-medium text-white/60 hover:text-white border border-white/20 hover:border-white/40 transition-all"
        >
          {tl(lang as PRDLanguage, { es: 'Saltar', en: 'Skip', zh: '跳过', 'pt-BR': 'Pular', 'pt-PT': 'Pular' })}
        </button>
      </div>
    </div>
  );
}

// ─── MAIN COMPONENT ───
export default function MundoArtista() {
  const [, params] = useRoute("/artista/:code");
  const code = (params?.code || "").toUpperCase();
  const { lang } = usePRDLanguage();
  const [showGreeting, setShowGreeting] = useState(true);
  const [copiedTool, setCopiedTool] = useState<string | null>(null);

  const artist = ARTIST_PROFILES[code];

  const t = (key: string) => {
    const texts: Record<string, Record<string, string>> = {
      es: {
        notFound: "Código de artista no encontrado",
        notFoundDesc: "El código que ingresaste no corresponde a ningún artista registrado en LINCE.",
        back: "Volver al inicio",
        enterCode: "Ingresa tu código de artista",
        enterCodeDesc: "Si tienes un código de artista, ingrésalo para acceder a su mundo exclusivo.",
        go: "Entrar",
        about: "Sobre el artista",
        stats: "Estadísticas",
        followers: "Seguidores",
        streams: "Reproducciones",
        videos: "Vídeos",
        social: "Redes sociales",
        content: "Contenido destacado",
        aiToolkit: "Kit de herramientas IA",
        aiToolkitDesc: "Las herramientas de IA que usa este artista para crear contenido",
        openTool: "Abrir",
        comingSoon: "En construcción",
        comingSoonDesc: "Este contenido estará disponible pronto. Estamos trabajando para ti.",
        plan: "Plan Básico LINCE",
        planDesc: "Acceso gratuito a las funcionalidades básicas de la plataforma",
        planFeature1: "Acceso a 3 niveles de aprendizaje de IA",
        planFeature2: "Juego de Prompts (modo creativo y técnico)",
        planFeature3: "Explorador del Mundo LINCE (6 habitaciones)",
        planFeature4: "Galería de 22 avatares de la Familia LINCE",
        planFeature5: "Herramientas IA con guías de 14 herramientas gratuitas",
        planFeature6: "Recompensas diarias y sistema de XP",
        planFeature7: "Acceso a mundos de artistas con código",
        planFeature8: "Soporte de la comunidad LINCE",
        planFree: "GRATIS",
        planCta: "Ya estás en el Plan Básico",
      },
      en: {
        notFound: "Artist code not found",
        notFoundDesc: "The code you entered does not match any registered artist in LINCE.",
        back: "Back to home",
        enterCode: "Enter your artist code",
        enterCodeDesc: "If you have an artist code, enter it to access their exclusive world.",
        go: "Enter",
        about: "About the artist",
        stats: "Statistics",
        followers: "Followers",
        streams: "Streams",
        videos: "Videos",
        social: "Social media",
        content: "Featured content",
        aiToolkit: "AI Toolkit",
        aiToolkitDesc: "The AI tools this artist uses to create content",
        openTool: "Open",
        comingSoon: "Under construction",
        comingSoonDesc: "This content will be available soon. We're working on it.",
        plan: "LINCE Basic Plan",
        planDesc: "Free access to basic platform features",
        planFeature1: "Access to 3 AI learning levels",
        planFeature2: "Prompt Game (creative and technical modes)",
        planFeature3: "LINCE World Explorer (6 rooms)",
        planFeature4: "Gallery of 22 LINCE Family avatars",
        planFeature5: "AI Arsenal with guides for 14 free tools",
        planFeature6: "Daily rewards and XP system",
        planFeature7: "Access to artist worlds with code",
        planFeature8: "LINCE community support",
        planFree: "FREE",
        planCta: "You're already on the Basic Plan",
      },
      zh: {
        notFound: "未找到艺术家代码",
        notFoundDesc: "您输入的代码不匹配LINCE中的任何注册艺术家。",
        back: "返回首页",
        enterCode: "输入您的艺术家代码",
        enterCodeDesc: "如果您有艺术家代码，请输入以访问其专属世界。",
        go: "进入",
        about: "关于艺术家",
        stats: "统计数据",
        followers: "粉丝",
        streams: "播放量",
        videos: "视频",
        social: "社交媒体",
        content: "精选内容",
        aiToolkit: "AI工具包",
        aiToolkitDesc: "该艺术家用于创建内容的AI工具",
        openTool: "打开",
        comingSoon: "建设中",
        comingSoonDesc: "此内容即将推出。我们正在努力。",
        plan: "LINCE基础计划",
        planDesc: "免费访问平台基本功能",
        planFeature1: "访问3个AI学习级别",
        planFeature2: "提示游戏（创意和技术模式）",
        planFeature3: "LINCE世界探索器（6个房间）",
        planFeature4: "22个LINCE家族头像画廊",
        planFeature5: "AI武器库，14个免费工具指南",
        planFeature6: "每日奖励和XP系统",
        planFeature7: "使用代码访问艺术家世界",
        planFeature8: "LINCE社区支持",
        planFree: "免费",
        planCta: "您已在基础计划中",
      },
    };
    return texts[lang]?.[key] || texts.es[key] || key;
  };

  // ─── CODE INPUT PAGE (no code in URL) ───
  if (!code) {
    return <CodeInputPage t={t} lang={lang} />;
  }

  // ─── ARTIST NOT FOUND ───
  if (!artist) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">🔍</div>
          <h1 className="font-display font-bold text-2xl text-white mb-3">{t('notFound')}</h1>
          <p className="text-[#B0B0B0] mb-6">{t('notFoundDesc')}</p>
          <a href="/" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#00E5FF]/20 text-[#00E5FF] font-medium hover:bg-[#00E5FF]/30 transition-colors">
            <ArrowLeft size={18} /> {t('back')}
          </a>
        </div>
      </div>
    );
  }

  const avatarImg = AVATAR_MUSICALIN[artist.avatarKey as keyof typeof AVATAR_MUSICALIN];
  const tArtist = (obj: { es: string; en: string; zh: string }) => obj[lang as keyof typeof obj] || obj.es;

  const copyAndOpen = (url: string, toolName: string) => {
    navigator.clipboard.writeText(url);
    setCopiedTool(toolName);
    setTimeout(() => setCopiedTool(null), 2000);
    window.open(url, '_blank');
  };

  return (
    <>
      {/* Animated greeting on first visit */}
      {showGreeting && <AnimatedGreeting artist={artist} lang={lang} onComplete={() => setShowGreeting(false)} />}

      <div className="min-h-screen bg-[#0A0A0A] text-white">
        {/* Hero */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 opacity-20" style={{ background: `radial-gradient(ellipse at 30% 50%, ${artist.color}40, transparent 70%)` }} />
          <div className="container pt-20 sm:pt-28 pb-12 sm:pb-16 relative z-10">
            <a href="/" className="inline-flex items-center gap-2 text-[#B0B0B0] hover:text-white mb-8 transition-colors text-sm">
              <ArrowLeft size={16} /> {t('back')}
            </a>

            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-8">
              <div className="relative flex-shrink-0">
                <div className="absolute inset-0 rounded-full blur-xl opacity-40" style={{ background: artist.color }} />
                <img src={avatarImg} alt={artist.name} className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-full border-4 object-cover" style={{ borderColor: artist.color }} />
              </div>
              <div className="text-center sm:text-left">
                <h1 className="font-display font-bold text-3xl sm:text-5xl mb-2" style={{ color: artist.color }}>{artist.name}</h1>
                <p className="text-[#B0B0B0] text-sm sm:text-base mb-1">{artist.realName}</p>
                <p className="font-medium mb-4" style={{ color: artist.accentColor }}>{tArtist(artist.role)}</p>

                {/* Stats */}
                <div className="flex flex-wrap gap-3 justify-center sm:justify-start">
                  {[
                    { icon: <Star size={14} />, label: t('followers'), value: artist.stats.followers },
                    { icon: <Headphones size={14} />, label: t('streams'), value: artist.stats.streams },
                    { icon: <Video size={14} />, label: t('videos'), value: artist.stats.videos },
                  ].map((s, i) => (
                    <div key={i} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10">
                      <span style={{ color: artist.color }}>{s.icon}</span>
                      <span className="text-white font-bold text-sm">{s.value}</span>
                      <span className="text-[#B0B0B0] text-xs">{s.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="container pb-16 space-y-10">
          {/* Bio */}
          <section>
            <h2 className="font-display font-bold text-xl mb-4 flex items-center gap-2">
              <Mic2 size={20} style={{ color: artist.color }} /> {t('about')}
            </h2>
            <p className="text-[#B0B0B0] leading-relaxed max-w-3xl">{tArtist(artist.bio)}</p>
          </section>

          {/* Social Links */}
          <section>
            <h2 className="font-display font-bold text-xl mb-4 flex items-center gap-2">
              <Music size={20} style={{ color: artist.color }} /> {t('social')}
            </h2>
            <div className="flex flex-wrap gap-3">
              {artist.socialLinks.map((link, i) => (
                <a key={i} href={link.url} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:border-white/30 transition-all text-sm">
                  <span className="text-lg">{link.icon}</span>
                  <span className="text-white font-medium">{link.platform}</span>
                  <ExternalLink size={12} className="text-[#B0B0B0]" />
                </a>
              ))}
            </div>
          </section>

          {/* Featured Content */}
          <section>
            <h2 className="font-display font-bold text-xl mb-4 flex items-center gap-2">
              <Sparkles size={20} style={{ color: artist.color }} /> {t('content')}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {artist.featuredContent.map((item, i) => (
                <div key={i} className="relative p-5 rounded-xl bg-white/[0.03] border border-white/10 hover:border-white/20 transition-all group">
                  <div className="absolute top-3 right-3 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider" style={{ background: `${artist.color}20`, color: artist.color }}>
                    {t('comingSoon')}
                  </div>
                  <h3 className="font-display font-bold text-white mb-2 pr-20">{tArtist(item.title)}</h3>
                  <p className="text-[#B0B0B0] text-sm leading-relaxed">{tArtist(item.desc)}</p>
                  <p className="text-[#B0B0B0]/50 text-xs mt-3 italic">{t('comingSoonDesc')}</p>
                </div>
              ))}
            </div>
          </section>

          {/* AI Toolkit */}
          <section>
            <h2 className="font-display font-bold text-xl mb-2 flex items-center gap-2">
              <Sparkles size={20} style={{ color: artist.color }} /> {t('aiToolkit')}
            </h2>
            <p className="text-[#B0B0B0] text-sm mb-4">{t('aiToolkitDesc')}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {artist.aiTools.map((tool, i) => (
                <div key={i} className="p-4 rounded-xl bg-white/[0.03] border border-white/10 hover:border-white/20 transition-all">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-white text-sm">{tool.name}</h3>
                    <button
                      onClick={() => copyAndOpen(tool.url, tool.name)}
                      className="flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-medium transition-all"
                      style={{ background: `${artist.color}20`, color: artist.color }}
                    >
                      {copiedTool === tool.name ? <><Check size={12} /> OK</> : <><ExternalLink size={12} /> {t('openTool')}</>}
                    </button>
                  </div>
                  <p className="text-[#B0B0B0] text-xs">{tArtist(tool.use)}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Plan Básico */}
          <section className="border-2 rounded-2xl p-6 sm:p-8" style={{ borderColor: `${artist.color}30`, background: `${artist.color}05` }}>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="font-display font-bold text-xl text-white">{t('plan')}</h2>
                <p className="text-[#B0B0B0] text-sm mt-1">{t('planDesc')}</p>
              </div>
              <div className="px-5 py-2 rounded-full font-black text-lg" style={{ background: artist.color, color: '#000' }}>
                {t('planFree')}
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {['planFeature1','planFeature2','planFeature3','planFeature4','planFeature5','planFeature6','planFeature7','planFeature8'].map((key, i) => (
                <div key={i} className="flex items-start gap-2 py-1.5">
                  <span className="mt-0.5 text-sm" style={{ color: artist.color }}>✓</span>
                  <span className="text-[#B0B0B0] text-sm">{t(key)}</span>
                </div>
              ))}
            </div>
            <div className="mt-6 text-center">
              <span className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-white/5 border border-white/10 text-[#B0B0B0] text-sm font-medium">
                ✓ {t('planCta')}
              </span>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}

// ─── CODE INPUT PAGE ───
function CodeInputPage({ t, lang }: { t: (key: string) => string; lang: string }) {
  const [inputCode, setInputCode] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputCode.trim()) {
      window.location.href = `/artista/${inputCode.trim().toUpperCase()}`;
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <div className="text-6xl mb-6">🎤</div>
        <h1 className="font-display font-bold text-2xl sm:text-3xl text-white mb-3">{t('enterCode')}</h1>
        <p className="text-[#B0B0B0] mb-8">{t('enterCodeDesc')}</p>

        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={inputCode}
            onChange={(e) => setInputCode(e.target.value.toUpperCase())}
            placeholder="YOUNGBRIEL"
            className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/20 text-white font-display font-bold text-center text-lg tracking-wider placeholder:text-white/20 focus:outline-none focus:border-[#00E5FF]/50"
          />
          <button type="submit" className="px-6 py-3 rounded-xl bg-[#00E5FF] text-black font-bold hover:brightness-110 transition-all">
            {t('go')}
          </button>
        </form>

        <div className="mt-8">
          <a href="/" className="inline-flex items-center gap-2 text-[#B0B0B0] hover:text-white text-sm transition-colors">
            <ArrowLeft size={16} /> {t('back')}
          </a>
        </div>
      </div>
    </div>
  );
}

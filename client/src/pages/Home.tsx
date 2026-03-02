import { useState, useEffect, useRef, lazy, Suspense } from "react";
import { usePRDLanguage, tl} from "@/contexts/PRDLanguageContext";
import { AVATAR_FRONTAL, AVATAR_EXPRESSIONS, AVATAR_MUSICALIN, ALL_CHARACTERS, FAMILY_CHARACTERS, getAvatarImage } from "@/lib/avatarConstants";
import { ChangeToastProvider } from "@/components/ChangeToast";
import { isAdminUser } from "@/lib/accessControl";
import { FadeIn, SectionHeader, CollapsibleSection, ScrollToTopButton } from "@/components/HomeUI";
import { Navigation, NAV_ITEMS } from "@/components/HomeNavigation";
import { Footer } from "@/components/HomeFooter";
import { AvatarStoryModal } from "@/components/AvatarStoryModal";
import { SocialShareBar } from "@/components/SocialShareBar";
import { WelcomeMissions } from "@/components/WelcomeMissions";
import { FirstUseTutorial } from "@/components/FirstUseTutorial";
// GlobalSearch, PRDLanguageSelector, UserNavBadge now only used in HomeNavigation

const WelcomeModal = lazy(() => import("@/components/WelcomeModal"));

// CDN URLs for images
const HERO_IMG = "https://files.manuscdn.com/user_upload_by_module/session_file/310419663032363896/yboYHmRuuKzxTKzs.png";
const DUOLINGO_LOGO = "https://files.manuscdn.com/user_upload_by_module/session_file/310419663032363896/qgXZcfwSCwpzPeFx.png";
// LINCE CEO image — SABELIN is the CEO and boss of LINCE
const LINCE_CEO_IMG = AVATAR_FRONTAL.SABELIN || "https://files.manuscdn.com/user_upload_by_module/session_file/310419663032363896/jtEEtbRUpTtEBKGn.png";

const AVATARS = AVATAR_FRONTAL;

// Navigation imported from @/components/HomeNavigation
// Footer imported from @/components/HomeFooter

function HeroSection() {
  const { t, lang } = usePRDLanguage();
  return (
    <section id="hero" className="relative min-h-[70vh] sm:min-h-[85vh] flex items-center overflow-hidden">
      <div className="absolute inset-0">
        <img src={HERO_IMG} alt="LINCE - Aprende IA jugando" className="w-full h-full object-cover opacity-30 object-center sm:object-[center_30%]" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A]/80 via-[#0A0A0A]/60 to-[#0A0A0A]" />
      </div>
      <div className="container relative z-10 pt-32 sm:pt-36 pb-12 sm:pb-16">
        <FadeIn delay={100}>
          <h1 className="font-['Space_Grotesk'] font-bold text-5xl sm:text-7xl lg:text-8xl text-white leading-[0.95] mb-5 sm:mb-7">
            <span className="text-[#00E5FF]">LINCE</span>
          </h1>
        </FadeIn>
        <FadeIn delay={200}>
          <h2 className="font-['Space_Grotesk'] text-xl sm:text-3xl lg:text-4xl text-[#D4A843] font-semibold mb-5 sm:mb-7">
            {t('hero.subtitle')}
          </h2>
        </FadeIn>
        <FadeIn delay={300}>
          <p className="text-white/80 text-lg sm:text-xl lg:text-2xl max-w-3xl leading-relaxed mb-10 sm:mb-12">
            {t('hero.description') || 'Una app donde aprendes a usar inteligencia artificial de forma fácil y divertida. Paso a paso, con personajes que te guían, juegos y retos. Da igual si tienes 13 o 80 años: aquí cualquiera puede aprender. Tú eliges tu ritmo, tu personaje y tu idioma.'}
          </p>
        </FadeIn>

        {/* Quick access buttons — GRANDES y claros */}
        <FadeIn delay={350}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 mb-10 max-w-4xl">
            {/* FAMILIA — PRIMERA y más prominente */}
            <a href="/chat" data-tour="avatars" className="group relative sm:col-span-2 lg:col-span-3 flex items-center gap-4 px-6 py-5 bg-amber-500/20 border-3 border-amber-400/60 rounded-2xl hover:bg-amber-500/30 hover:border-amber-400/80 transition-all duration-300 min-h-[80px] shadow-[0_0_20px_rgba(217,170,67,0.15)]">
              <span className="text-4xl">🐱</span>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="text-amber-300 font-['Space_Grotesk'] font-black text-xl sm:text-2xl">{tl(lang, { es: 'Familia LINCE IA', en: 'LINCE IA Family', zh: 'LINCE IA家族', 'pt-BR': 'Família LINCE IA', 'pt-PT': 'Família LINCE IA' })}</span>
                  <span className="px-2.5 py-0.5 bg-amber-400/30 text-amber-200 text-xs sm:text-sm font-bold rounded-full">{tl(lang, { es: '¡EMPIEZA AQUÍ!', en: 'START HERE!', zh: '从这里开始!', 'pt-BR': 'COMECE AQUI!', 'pt-PT': 'COMECE AQUI!' })}</span>
                </div>
                <span className="text-amber-200/70 text-sm sm:text-base mt-0.5">{tl(lang, { es: '10 especialistas en IA te enseñan paso a paso. Elige uno y pregúntale lo que quieras.', en: '10 AI specialists teach you step by step. Pick one and ask anything.', zh: '10位AI专家一步步教你。选一个，问任何问题。', 'pt-BR': '10 especialistas em IA te ensinam passo a passo. Escolha um e pergunte o que quiser.', 'pt-PT': '10 especialistas em IA ensinam-te passo a passo. Escolhe um e pergunta o que quiseres.' })}</span>
              </div>
              <span className="ml-auto text-amber-400 text-2xl">→</span>
            </a>

            {/* Crear Imagen */}
            <a href="/prompt-studio" data-tour="prompt-studio" className="group flex items-center gap-3 px-5 py-4 bg-purple-500/15 border-2 border-purple-500/40 rounded-2xl hover:bg-purple-500/25 transition-all duration-300 min-h-[70px]">
              <span className="text-2xl">🖼️</span>
              <div className="flex flex-col">
                <span className="text-purple-300 font-['Space_Grotesk'] font-bold text-base sm:text-lg">{tl(lang, { es: 'Crear Imagen', en: 'Create Image', zh: '创建图像', 'pt-BR': 'Criar Imagem', 'pt-PT': 'Criar Imagem' })}</span>
                <span className="text-purple-300/60 text-xs sm:text-sm">{tl(lang, { es: 'Genera imágenes con IA', en: 'Generate images with AI', zh: '用AI生成图像', 'pt-BR': 'Gere imagens com IA', 'pt-PT': 'Gera imagens com IA' })}</span>
              </div>
            </a>

            {/* Mi Avatar */}
            <a href="/lincelin" className="group flex items-center gap-3 px-5 py-4 bg-pink-500/15 border-2 border-pink-500/40 rounded-2xl hover:bg-pink-500/25 transition-all duration-300 min-h-[70px]">
              <span className="text-2xl">🎨</span>
              <div className="flex flex-col">
                <span className="text-pink-300 font-['Space_Grotesk'] font-bold text-base sm:text-lg">{tl(lang, { es: 'Mi Avatar', en: 'My Avatar', zh: '我的头像', 'pt-BR': 'Meu Avatar', 'pt-PT': 'Meu Avatar' })}</span>
                <span className="text-pink-300/60 text-xs sm:text-sm">{tl(lang, { es: 'Crea tu personaje LINCE', en: 'Create your LINCE character', zh: '创建你的LINCE角色', 'pt-BR': 'Crie seu personagem LINCE', 'pt-PT': 'Cria o teu personagem LINCE' })}</span>
              </div>
            </a>

            {/* Herramientas IA */}
            <a href="/arsenal-ia" className="group flex items-center gap-3 px-5 py-4 bg-[#00E5FF]/15 border-2 border-[#00E5FF]/40 rounded-2xl hover:bg-[#00E5FF]/25 transition-all duration-300 min-h-[70px]">
              <span className="text-2xl">⚡</span>
              <div className="flex flex-col">
                <span className="text-[#00E5FF] font-['Space_Grotesk'] font-bold text-base sm:text-lg">{tl(lang, { es: 'Herramientas IA', en: 'AI Tools', zh: 'AI工具', 'pt-BR': 'Ferramentas IA', 'pt-PT': 'Ferramentas IA' })}</span>
                <span className="text-[#00E5FF]/60 text-xs sm:text-sm">{tl(lang, { es: 'Descubre las mejores apps de IA', en: 'Discover the best AI apps', zh: '发现最好的AI应用', 'pt-BR': 'Descubra os melhores apps de IA', 'pt-PT': 'Descobre as melhores apps de IA' })}</span>
              </div>
            </a>

            {/* Aprender Prompts */}
            <a href="/promptear" className="group flex items-center gap-3 px-5 py-4 bg-violet-500/15 border-2 border-violet-500/40 rounded-2xl hover:bg-violet-500/25 transition-all duration-300 min-h-[70px]">
              <span className="text-2xl">🧠</span>
              <div className="flex flex-col">
                <span className="text-violet-300 font-['Space_Grotesk'] font-bold text-base sm:text-lg">{tl(lang, { es: 'Aprender Prompts', en: 'Learn Prompts', zh: '学习提示', 'pt-BR': 'Aprender Prompts', 'pt-PT': 'Aprender Prompts' })}</span>
                <span className="text-violet-300/60 text-xs sm:text-sm">{tl(lang, { es: 'Aprende a hablar con la IA', en: 'Learn to talk to AI', zh: '学习与AI对话', 'pt-BR': 'Aprenda a falar com a IA', 'pt-PT': 'Aprende a falar com a IA' })}</span>
              </div>
            </a>

            {/* JUGAR — al final */}
            <a href="/tutorial" data-tour="play" className="group flex items-center gap-3 px-5 py-4 bg-[oklch(0.82_0.15_195)]/20 border-2 border-[oklch(0.82_0.15_195)]/50 rounded-2xl hover:bg-[oklch(0.82_0.15_195)]/30 transition-all duration-300 min-h-[70px]">
              <span className="text-2xl">🕹️</span>
              <div className="flex flex-col">
                <span className="text-[oklch(0.82_0.15_195)] font-['Space_Grotesk'] font-bold text-base sm:text-lg">{tl(lang, { es: '¡JUGAR!', en: 'PLAY!', zh: '开始玩!', 'pt-BR': 'JOGAR!', 'pt-PT': 'JOGAR!' })}</span>
                <span className="text-[oklch(0.82_0.15_195)]/60 text-xs sm:text-sm">{tl(lang, { es: 'Juega y sube de nivel', en: 'Play and level up', zh: '玩游戏升级', 'pt-BR': 'Jogue e suba de nível', 'pt-PT': 'Joga e sobe de nível' })}</span>
              </div>
            </a>
            {isAdminUser() && (
              <>
                <a href="/mundo" className="group flex items-center gap-3 px-5 py-4 bg-amber-500/10 border-2 border-amber-500/30 rounded-2xl hover:bg-amber-500/20 transition-all duration-300 opacity-70 min-h-[60px]">
                  <span className="text-2xl">🌍</span>
                  <span className="text-amber-400 font-['Space_Grotesk'] font-bold text-base">{tl(lang, { es: 'Mundo', en: 'World', zh: '世界', 'pt-BR': 'Mundo', 'pt-PT': 'Mundo' })}</span>
                </a>
                <a href="/raids" className="group flex items-center gap-3 px-5 py-4 bg-red-500/10 border-2 border-red-500/30 rounded-2xl hover:bg-red-500/20 transition-all duration-300 opacity-70 min-h-[60px]">
                  <span className="text-2xl">⚔️</span>
                  <span className="text-red-400 font-['Space_Grotesk'] font-bold text-base">Batallas</span>
                </a>
                <a href="/academia" className="group flex items-center gap-3 px-5 py-4 bg-emerald-500/10 border-2 border-emerald-500/30 rounded-2xl hover:bg-emerald-500/20 transition-all duration-300 opacity-70 min-h-[60px]">
                  <span className="text-2xl">🎓</span>
                  <span className="text-emerald-400 font-['Space_Grotesk'] font-bold text-base">{tl(lang, { es: 'Academia', en: 'Academy', zh: '学院', 'pt-BR': 'Academia', 'pt-PT': 'Academia' })}</span>
                </a>
              </>
            )}
          </div>
        </FadeIn>

        {/* Stats — bigger text */}
        <FadeIn delay={450}>
          <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-3 sm:gap-4 mb-8">
            <div className="px-4 sm:px-6 py-3 sm:py-4 bg-[#00E5FF]/10 border border-[#00E5FF]/30 rounded-xl">
              <span className="text-[#00E5FF] font-['Space_Grotesk'] font-bold text-2xl sm:text-3xl">85</span>
              <span className="text-white/70 text-sm sm:text-base ml-2 font-medium">{t('hero.stat1')}</span>
            </div>
            <div className="px-4 sm:px-6 py-3 sm:py-4 bg-[#D4A843]/10 border border-[#D4A843]/30 rounded-xl">
              <span className="text-[#D4A843] font-['Space_Grotesk'] font-bold text-2xl sm:text-3xl">6</span>
              <span className="text-white/70 text-sm sm:text-base ml-2 font-medium">{t('hero.stat2')}</span>
            </div>
            <div className="px-4 sm:px-6 py-3 sm:py-4 bg-[#00E5FF]/10 border border-[#00E5FF]/30 rounded-xl">
              <span className="text-[#00E5FF] font-['Space_Grotesk'] font-bold text-2xl sm:text-3xl">3</span>
              <span className="text-white/70 text-sm sm:text-base ml-2 font-medium">{t('hero.stat3')}</span>
            </div>
            <div className="px-4 sm:px-6 py-3 sm:py-4 bg-[#D4A843]/10 border border-[#D4A843]/30 rounded-xl">
              <span className="text-[#D4A843] font-['Space_Grotesk'] font-bold text-2xl sm:text-3xl">5</span>
              <span className="text-white/70 text-sm sm:text-base ml-2 font-medium">{t('hero.stat4')}</span>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════
// 3. VISIÓN — Narrada por LINCE (CEO de LINCE)
// ═══════════════════════════════════════════════════════════════
function VisionSection() {
  const { lang } = usePRDLanguage();

  const content = {
    es: {
      badge: "MANIFIESTO LINCE",
      title: "La IA no es el futuro.",
      titleHighlight: "Es el presente.",
      titleEnd: "Y es para TODOS.",
      intro: "Soy LINCE, CEO de LINCE. Y tengo algo que decirte:",
      p1: "La inteligencia artificial no debería dar miedo. No debería ser un privilegio de unos pocos. No debería estar encerrada en universidades caras, en cursos aburridos o en tutoriales que solo entienden los ingenieros.",
      p2: "La IA es la herramienta más poderosa que ha creado la humanidad. Y si solo la dominan unos pocos, el mundo se divide en dos: los que la usan y los que son usados por ella.",
      p3: "Por eso creamos LINCE.",
      why: "¿POR QUÉ?",
      reason1title: "Porque tu abuela merece entender qué es ChatGPT",
      reason1: "sin que nadie la haga sentir tonta.",
      reason2title: "Porque un niño de 8 años puede aprender a crear con IA",
      reason2: "si se lo enseñas jugando.",
      reason3title: "Porque un artista musical puede usar IA",
      reason3: "para revolucionar su música y su carrera.",
      reason4title: "Porque un emprendedor sin recursos puede competir",
      reason4: "con las grandes empresas si domina las herramientas.",
      manifesto: "Democratizar no es regalar. Es abrir las puertas. Es quitar el miedo. Es enseñar con cariño, con juego, con avatares que te acompañan como familia.",
      closing: "No queremos ser una app más. Queremos ser el movimiento que hizo que millones de personas dejaran de tener miedo a la IA y empezaran a usarla para cambiar sus vidas.",
      signature: "— LINCE, CEO de LINCE",
      cta: "ÚNETE AL MOVIMIENTO",
    },
    en: {
      badge: "LINCE MANIFESTO",
      title: "AI is not the future.",
      titleHighlight: "It's the present.",
      titleEnd: "And it's for EVERYONE.",
      intro: "I'm LINCE, CEO of LINCE. And I have something to tell you:",
      p1: "Artificial intelligence shouldn't be scary. It shouldn't be a privilege for the few. It shouldn't be locked away in expensive universities, boring courses, or tutorials that only engineers understand.",
      p2: "AI is the most powerful tool humanity has ever created. And if only a few master it, the world splits in two: those who use it and those who are used by it.",
      p3: "That's why we created LINCE.",
      why: "WHY?",
      reason1title: "Because your grandmother deserves to understand ChatGPT",
      reason1: "without anyone making her feel stupid.",
      reason2title: "Because an 8-year-old can learn to create with AI",
      reason2: "if you teach them through play.",
      reason3title: "Because a music artist can use AI",
      reason3: "to revolutionize their music and career.",
      reason4title: "Because an entrepreneur with no resources can compete",
      reason4: "with big companies if they master the tools.",
      manifesto: "Democratizing isn't giving away. It's opening doors. It's removing fear. It's teaching with love, with play, with avatars that accompany you like family.",
      closing: "We don't want to be just another app. We want to be the movement that made millions of people stop fearing AI and start using it to change their lives.",
      signature: "— LINCE, CEO of LINCE",
      cta: "JOIN THE MOVEMENT",
    },
    zh: {
      badge: "LINCE宣言",
      title: "AI不是未来。",
      titleHighlight: "它是现在。",
      titleEnd: "它属于每一个人。",
      intro: "我是LINCE，LINCE的CEO。我有话要对你说：",
      p1: "人工智能不应该令人恐惧。它不应该是少数人的特权。它不应该被锁在昂贵的大学、无聊的课程或只有工程师才能理解的教程中。",
      p2: "AI是人类创造的最强大的工具。如果只有少数人掌握它，世界就会分裂为两部分：使用它的人和被它使用的人。",
      p3: "这就是我们创建LINCE的原因。",
      why: "为什么？",
      reason1title: "因为你的祖母值得了解ChatGPT",
      reason1: "而不会让任何人觉得她很笨。",
      reason2title: "因为8岁的孩子可以学会用AI创造",
      reason2: "如果你通过游戏教他们。",
      reason3title: "因为智利的城市艺术家可以使用AI",
      reason3: "来革新他们的音乐和事业。",
      reason4title: "因为没有资源的企业家可以竞争",
      reason4: "如果他们掌握了工具。",
      manifesto: "民主化不是赠送。是打开大门。是消除恐惧。是用爱、用游戏、用像家人一样陪伴你的角色来教学。",
      closing: "我们不想只是另一个应用。我们想成为让数百万人不再害怕AI并开始用它改变生活的运动。",
      signature: "— LINCE，LINCE CEO",
      cta: "加入运动",
    },
  };

  const c = content[lang as keyof typeof content] || content.es;

  return (
    <section className="py-16 sm:py-28 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#00E5FF] rounded-full blur-[150px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#D4A843] rounded-full blur-[150px]" />
      </div>

      <div className="container relative z-10">
        {/* Badge */}
        <FadeIn>
          <div className="flex justify-center mb-8">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-[#00E5FF]/40 bg-[#00E5FF]/5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#00E5FF] animate-pulse" />
              <span className="text-[#00E5FF] text-sm font-['Space_Grotesk'] font-bold tracking-wider">{c.badge}</span>
            </div>
          </div>
        </FadeIn>

        {/* LINCE CEO avatar + Title */}
        <FadeIn delay={100}>
          <div className="flex flex-col items-center text-center mb-12">
            <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full overflow-hidden border-4 border-[#00E5FF]/50 shadow-[0_0_40px_rgba(0,229,255,0.3)] mb-6">
              <img src={LINCE_CEO_IMG} alt="LINCE - CEO de LINCE" className="w-full h-full object-cover" />
            </div>
            <h2 className="font-['Space_Grotesk'] font-bold text-3xl sm:text-5xl lg:text-6xl text-white leading-tight mb-2">
              {c.title}
            </h2>
            <h2 className="font-['Space_Grotesk'] font-bold text-3xl sm:text-5xl lg:text-6xl text-[#00E5FF] leading-tight mb-2">
              {c.titleHighlight}
            </h2>
            <h2 className="font-['Space_Grotesk'] font-bold text-3xl sm:text-5xl lg:text-6xl text-[#D4A843] leading-tight">
              {c.titleEnd}
            </h2>
          </div>
        </FadeIn>

        {/* LINCE speaks */}
        <div className="max-w-3xl mx-auto">
          <FadeIn delay={200}>
            <div className="flex items-start gap-4 mb-8">
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#00E5FF]/30 flex-shrink-0 mt-1">
                <img src={LINCE_CEO_IMG} alt="LINCE CEO" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1">
                <p className="text-[#00E5FF] font-['Space_Grotesk'] font-bold text-sm mb-2">LINCE</p>
                <p className="text-white text-lg sm:text-xl font-medium italic leading-relaxed">"{c.intro}"</p>
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={300}>
            <p className="text-[#B0B0B0] text-base sm:text-lg leading-relaxed mb-6">{c.p1}</p>
          </FadeIn>

          <FadeIn delay={350}>
            <p className="text-white text-lg sm:text-xl font-medium leading-relaxed mb-6 pl-4 border-l-4 border-[#00E5FF]">{c.p2}</p>
          </FadeIn>

          <FadeIn delay={400}>
            <p className="text-[#D4A843] text-2xl sm:text-3xl font-['Space_Grotesk'] font-bold text-center my-10">{c.p3}</p>
          </FadeIn>

          {/* WHY — 4 reasons */}
          <FadeIn delay={450}>
            <h3 className="text-[#00E5FF] text-3xl sm:text-4xl font-['Space_Grotesk'] font-black text-center mb-8">{c.why}</h3>
          </FadeIn>

          <div className="space-y-6">
            {[
              { title: c.reason1title, sub: c.reason1, icon: "👵", color: "#00E5FF" },
              { title: c.reason2title, sub: c.reason2, icon: "🧒", color: "#D4A843" },
              { title: c.reason3title, sub: c.reason3, icon: "🎤", color: "#FF6B35" },
              { title: c.reason4title, sub: c.reason4, icon: "🚀", color: "#00E5FF" },
            ].map((r, i) => (
              <FadeIn key={i} delay={500 + i * 80}>
                <div className="flex items-start gap-4 p-5 bg-white/[0.03] border border-white/[0.08] rounded-xl hover:border-opacity-30 transition-all" style={{ borderColor: `${r.color}30` }}>
                  <span className="text-3xl flex-shrink-0">{r.icon}</span>
                  <div>
                    <p className="font-['Space_Grotesk'] font-bold text-white text-base sm:text-lg" style={{ color: r.color }}>{r.title}</p>
                    <p className="text-[#B0B0B0] text-sm sm:text-base mt-1">{r.sub}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>

          {/* Manifesto quote */}
          <FadeIn delay={850}>
            <div className="my-12 p-6 sm:p-10 bg-gradient-to-br from-[#00E5FF]/5 via-transparent to-[#D4A843]/5 border border-[#00E5FF]/20 rounded-2xl text-center">
              <p className="text-white text-lg sm:text-2xl font-['Space_Grotesk'] font-medium leading-relaxed italic">
                "{c.manifesto}"
              </p>
            </div>
          </FadeIn>

          {/* Closing + signature */}
          <FadeIn delay={900}>
            <p className="text-[#B0B0B0] text-base sm:text-lg leading-relaxed mb-6">{c.closing}</p>
            <div className="flex items-center gap-4 mt-8">
              <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-[#D4A843]/50">
                <img src={LINCE_CEO_IMG} alt="LINCE CEO" className="w-full h-full object-cover" />
              </div>
              <p className="text-[#D4A843] font-['Space_Grotesk'] font-bold text-lg">{c.signature}</p>
            </div>
          </FadeIn>

          {/* CTA */}
          <FadeIn delay={950}>
            <div className="text-center mt-12">
              <a href="/registro" className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[#00E5FF] to-[#00B8D4] text-black font-['Space_Grotesk'] font-black text-lg rounded-xl hover:shadow-[0_0_30px_rgba(0,229,255,0.4)] hover:scale-105 transition-all duration-300">
                🔥 {c.cta}
              </a>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════
// 4. GRACIAS A DUOLINGO — ENTRETENIDA con avatares
// ═══════════════════════════════════════════════════════════════
function GraciasSection() {
  const { t, tData } = usePRDLanguage();
  const [hoveredLesson, setHoveredLesson] = useState<number | null>(null);
  const [showComparison, setShowComparison] = useState(false);

  // Each lesson card gets a different avatar that "teaches" that lesson
  const LESSON_AVATARS = [
    { key: 'PEQUELIN', expr: 'celebrando' },   // Gamificación
    { key: 'YAYALINA', expr: 'feliz' },     // Acceso universal
    { key: 'SABELIN', expr: 'pensando' },      // Mascota con alma
    { key: 'CHAVALIN', expr: 'feliz' },           // Lecciones 5 min
    { key: 'ATOLONDRALIN', expr: 'celebrando' },  // Aprender sin miedo
    { key: 'MAMALINA', expr: 'celebrando' },        // Competir para crecer
  ];

  const compRows = (tData('gracias.compRows') || []) as any[];

  return (
    <section className="py-12 sm:py-20 relative overflow-hidden">
      {/* Background with animated gradient */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, #58CC02 0%, transparent 50%), radial-gradient(circle at 80% 50%, #00E5FF 0%, transparent 50%)' }} />
      </div>

      {/* Floating avatars in background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Object.values(AVATAR_FRONTAL).slice(0, 8).map((url, i) => (
          <img key={i} src={url} alt="" className="absolute w-12 h-12 sm:w-16 sm:h-16 rounded-full object-cover opacity-[0.04]"
            style={{
              top: `${10 + (i * 12) % 80}%`,
              left: i % 2 === 0 ? `${2 + i * 3}%` : `${85 - i * 3}%`,
              animation: `float ${6 + i * 0.7}s ease-in-out infinite alternate`,
              animationDelay: `${i * 0.5}s`,
            }} />
        ))}
      </div>

      <style>{`
        @keyframes float { 0% { transform: translateY(0) rotate(0deg); } 100% { transform: translateY(-15px) rotate(5deg); } }
        @keyframes pulse-glow { 0%, 100% { box-shadow: 0 0 20px rgba(88,204,2,0.2); } 50% { box-shadow: 0 0 40px rgba(88,204,2,0.4); } }
      `}</style>

      <div className="container relative z-10">
        <FadeIn>
          <SectionHeader number="02" title={t('gracias.sectionTitle')} subtitle={t('gracias.sectionSubtitle')} />
        </FadeIn>

        <div className="mt-12 max-w-5xl mx-auto">
          {/* Main tribute card with Duolingo logo + animated avatars parade */}
          <FadeIn delay={100}>
            <div className="relative p-5 sm:p-8 lg:p-12 bg-gradient-to-br from-[#58CC02]/5 via-white/[0.02] to-[#00E5FF]/5 border border-[#58CC02]/20 rounded-2xl" style={{ animation: 'pulse-glow 4s ease-in-out infinite' }}>
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#58CC02] via-[#89E219] to-[#58CC02] rounded-t-2xl" />

              {/* Avatar parade strip at top */}
              <div className="flex justify-center mb-6 -mt-2">
                <div className="flex -space-x-3">
                  {Object.entries(AVATAR_FRONTAL).slice(0, 10).map(([key, url], i) => (
                    <img key={key} src={url} alt={key}
                      className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover border-2 border-[#0A0A0A] hover:scale-125 hover:z-10 transition-transform duration-300 cursor-pointer"
                      style={{ zIndex: 10 - i, animation: `float ${5 + i * 0.3}s ease-in-out infinite alternate`, animationDelay: `${i * 0.2}s` }}
                      title={key.replace(/_/g, ' ')} />
                  ))}
                </div>
              </div>

              <div className="flex flex-col lg:flex-row items-center gap-5 sm:gap-8 lg:gap-12">
                <div className="flex-shrink-0 relative">
                  <div className="w-24 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40 rounded-2xl bg-[#58CC02]/10 border border-[#58CC02]/20 flex items-center justify-center p-3 sm:p-4">
                    <img src={DUOLINGO_LOGO} alt="Duolingo" className="w-full h-full object-contain" />
                  </div>
                  {/* Small LINCE peeking from behind */}
                  <img src={LINCE_CEO_IMG} alt="LINCE CEO" className="absolute -bottom-3 -right-3 w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover border-2 border-[#00E5FF]" style={{ animation: 'float 3s ease-in-out infinite alternate' }} />
                </div>
                <div className="flex-1 text-center lg:text-left">
                  <h3 className="font-['Space_Grotesk'] font-bold text-xl sm:text-2xl lg:text-3xl text-white mb-3 sm:mb-4">
                    {tData('gracias.tributeTitle') as string} <span className="text-[#58CC02]">{tData('gracias.tributeHighlight') as string}</span>
                  </h3>
                  <p className="text-[#B0B0B0] text-sm sm:text-lg leading-relaxed mb-3 sm:mb-4">
                    {tData('gracias.tributeP1') as string}
                    <span className="text-white font-medium"> {tData('gracias.tributeP1Bold') as string}</span>
                    {tData('gracias.tributeP1End') as string}
                  </p>
                  <p className="text-[#B0B0B0] text-sm sm:text-lg leading-relaxed">
                    {tData('gracias.tributeP2Start') as string}{' '}
                    <span className="text-[#00E5FF] font-medium">{tData('gracias.tributeP2Cyan') as string}</span>
                    {tData('gracias.tributeP2Mid') as string}{' '}
                    <span className="text-[#D4A843] font-medium">{tData('gracias.tributeP2Gold') as string}</span>
                    {tData('gracias.tributeP2End') as string}
                  </p>
                </div>
              </div>
            </div>
          </FadeIn>

          {/* Lesson cards — each with an avatar that "teaches" */}
          <FadeIn delay={200}>
            <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {((tData('gracias.lessons') || []) as any[]).map((item: any, i: number) => {
                const avatarInfo = LESSON_AVATARS[i];
                const avatarImg = avatarInfo ? (AVATAR_EXPRESSIONS[avatarInfo.key]?.[avatarInfo.expr] || AVATARS[avatarInfo.key]) : undefined;
                const isHovered = hoveredLesson === i;
                return (
                  <div key={i}
                    onMouseEnter={() => setHoveredLesson(i)}
                    onMouseLeave={() => setHoveredLesson(null)}
                    className={`relative p-6 bg-white/[0.02] border rounded-xl transition-all duration-500 group cursor-default overflow-hidden ${
                      isHovered ? 'border-[#58CC02]/40 bg-[#58CC02]/[0.03] scale-[1.02]' : 'border-white/[0.06] hover:border-[#58CC02]/20'
                    }`}>
                    {/* Avatar peeking from corner */}
                    {avatarImg && (
                      <img src={avatarImg} alt="" className={`absolute -top-2 -right-2 w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover border-2 border-[#0A0A0A] transition-all duration-500 ${
                        isHovered ? 'opacity-100 scale-110 rotate-[-5deg]' : 'opacity-30 scale-90'
                      }`} />
                    )}
                    <div className="text-3xl mb-3">{item.icon}</div>
                    <h4 className="font-['Space_Grotesk'] font-bold text-white text-lg mb-2 group-hover:text-[#58CC02] transition-colors pr-12">{item.title}</h4>
                    <p className="text-[#B0B0B0] text-sm leading-relaxed">{item.desc}</p>
                    {/* Fun progress bar */}
                    <div className="mt-3 w-full h-1 bg-white/5 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full transition-all duration-1000 ${isHovered ? 'w-full' : 'w-0'}`}
                        style={{ background: 'linear-gradient(90deg, #58CC02, #00E5FF)' }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </FadeIn>

          {/* Duolingo vs LINCE comparison table */}
          <FadeIn delay={250}>
            <div className="mt-12">
              <button
                onClick={() => setShowComparison(!showComparison)}
                className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-[#58CC02]/5 via-white/[0.01] to-[#00E5FF]/5 border border-[#58CC02]/20 rounded-xl hover:border-[#58CC02]/40 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-2">
                    <img src={DUOLINGO_LOGO} alt="" className="w-8 h-8 rounded-full object-contain bg-[#58CC02]/20 p-1 border border-[#58CC02]/30" />
                    <img src={AVATARS.PEQUELIN} alt="" className="w-8 h-8 rounded-full object-cover border-2 border-[#00E5FF]" />
                  </div>
                  <span className="font-['Space_Grotesk'] font-bold text-white text-sm sm:text-base">
                    {tData('gracias.comparisonTitle') as string || 'Duolingo vs LINCE'}
                  </span>
                </div>
                <svg className={`w-5 h-5 text-[#B0B0B0] transition-transform duration-300 ${showComparison ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7" /></svg>
              </button>

              {showComparison && compRows.length > 0 && (
                <div className="mt-3 overflow-hidden rounded-xl border border-white/[0.06]">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-white/[0.03]">
                        <th className="text-left py-3 px-4 text-[#B0B0B0] font-medium"></th>
                        <th className="text-center py-3 px-4">
                          <div className="flex items-center justify-center gap-2">
                            <img src={DUOLINGO_LOGO} alt="" className="w-6 h-6 object-contain" />
                            <span className="text-[#58CC02] font-['Space_Grotesk'] font-bold">{tData('gracias.compDuolingo') as string}</span>
                          </div>
                        </th>
                        <th className="text-center py-3 px-4">
                          <div className="flex items-center justify-center gap-2">
                            <img src={AVATARS.PEQUELIN} alt="" className="w-6 h-6 rounded-full object-cover" />
                            <span className="text-[#00E5FF] font-['Space_Grotesk'] font-bold">{tData('gracias.compLince') as string}</span>
                          </div>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {compRows.map((row: any, i: number) => (
                        <tr key={i} className={`border-t border-white/[0.04] ${i % 2 === 0 ? 'bg-white/[0.01]' : ''}`}>
                          <td className="py-3 px-4 text-[#B0B0B0] font-medium">{row.aspect}</td>
                          <td className="py-3 px-4 text-center text-[#58CC02]/80">{row.duo}</td>
                          <td className="py-3 px-4 text-center text-[#00E5FF] font-medium">{row.lince}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </FadeIn>

          {/* Emotional quote with family avatars */}
          <FadeIn delay={300}>
            <div className="mt-12 text-center">
              <div className="inline-block p-5 sm:p-8 lg:p-10 bg-gradient-to-br from-[#58CC02]/5 to-[#00E5FF]/5 border border-white/[0.08] rounded-2xl max-w-3xl relative">
                {/* Family avatars celebrating around the quote */}
                <div className="flex justify-center mb-6 -space-x-2">
                  {Object.entries(AVATAR_EXPRESSIONS).slice(0, 6).map(([key, exprs]) => (
                    <img key={key} src={exprs.celebrando || AVATARS[key]} alt={key}
                      className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover border-2 border-[#0A0A0A] hover:scale-110 transition-transform"
                      style={{ animation: `float ${4 + Math.random() * 2}s ease-in-out infinite alternate` }} />
                  ))}
                </div>
                <p className="text-white text-base sm:text-xl lg:text-2xl font-['Space_Grotesk'] font-medium leading-relaxed mb-4 sm:mb-6">
                  {tData('gracias.emotionalQuote') as string}
                </p>
                <div className="w-16 h-0.5 bg-gradient-to-r from-[#58CC02] to-[#00E5FF] mx-auto mb-4" />
                <p className="text-[#B0B0B0] text-sm">{tData('gracias.emotionalAuthor') as string}</p>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════
// 5. AVATARES — TODOS los personajes (Familia + MUSICALIN + futuros)
// ═══════════════════════════════════════════════════════════════
function AvatarSection() {
  const { lang, getAvatarName } = usePRDLanguage();
  const [filter, setFilter] = useState<'all' | 'family' | 'musicalin'>('all');
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);

  const familyAvatars = Object.entries(AVATAR_FRONTAL).map(([key, img]) => ({
    key, img, region: "🇪🇸 Zaragoza", group: 'family' as const,
  }));

  // ALL MUSICALIN avatars unified (original + international)
  const musicalinAvatars = Object.entries(AVATAR_MUSICALIN).map(([key, img]) => ({
    key, img, region: "🎵 MUSICALIN", group: 'musicalin' as const,
  }));

  const allAvatarsList = [...familyAvatars, ...musicalinAvatars];
  const filteredAvatars = filter === 'all' ? allAvatarsList
    : filter === 'family' ? familyAvatars
    : musicalinAvatars;

  const charData = ALL_CHARACTERS;

  return (
    <section className="py-12 sm:py-24 relative">
      <div className="container">
        <FadeIn>
          <SectionHeader
            number="03"
            title={tl(lang, { es: 'Conoce a la Familia LINCE IA', en: 'Meet the LINCE IA Family', zh: '认识LINCE IA家族', 'pt-BR': 'Conheça a Família LINCE IA', 'pt-PT': 'Conheça a Família LINCE IA' })}
            subtitle={tl(lang, { es: `${allAvatarsList.length} personajes únicos — toca cualquiera para descubrir su historia`, en: `${allAvatarsList.length} unique characters — click any to discover their story`, zh: `${allAvatarsList.length}个独特角色 — 点击任何一个发现他们的故事`, 'pt-BR': `${allAvatarsList.length} personajes únicos — toca cualquiera para descubrir su historia`, 'pt-PT': `${allAvatarsList.length} personajes únicos — toca cualquiera para descubrir su historia` })}
          />
        </FadeIn>

        {/* Filters */}
        <FadeIn delay={100}>
          <div className="flex flex-wrap gap-2 mt-6 mb-8">
            {[
              { key: 'all' as const, label: tl(lang, { es: 'Todos', en: 'All', zh: '全部', 'pt-BR': 'Todos', 'pt-PT': 'Todos' }), count: allAvatarsList.length, color: '#00E5FF' },
              { key: 'family' as const, label: tl(lang, { es: '🇪🇸 Familia', en: '🇪🇸 Family', zh: '🇪🇸 家族', 'pt-BR': '🇪🇸 Familia', 'pt-PT': '🇪🇸 Familia' }), count: familyAvatars.length, color: '#00E5FF' },
              { key: 'musicalin' as const, label: tl(lang, { es: '🎵 MUSICALIN', en: '🎵 MUSICALIN', zh: '🎵 MUSICALIN', 'pt-BR': '🎵 MUSICALIN', 'pt-PT': '🎵 MUSICALIN' }), count: musicalinAvatars.length, color: '#FF6B35' },
            ].map((f) => (
              <button key={f.key} onClick={() => setFilter(f.key)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${filter === f.key ? 'text-black' : 'bg-white/5 text-[#B0B0B0] hover:bg-white/10'}`}
                style={filter === f.key ? { backgroundColor: f.color } : {}}>
                {f.label} ({f.count})
              </button>
            ))}
          </div>
        </FadeIn>

        {/* Avatar Grid — clickable */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filteredAvatars.map((avatar, i) => {
            const char = charData.find(c => c.key === avatar.key);
            const displayName = getAvatarName(avatar.key) || char?.name || avatar.key;
            const role = char ? (tl(lang, { es: char.role.es, en: char.role.en, zh: char.role.zh, 'pt-BR': char.role.es, 'pt-PT': char.role.es })) : '';
            return (
              <FadeIn key={avatar.key} delay={i * 30}>
                <button
                  type="button"
                  onClick={() => setSelectedAvatar(avatar.key)}
                  className="group p-3 bg-white/[0.03] border border-white/[0.06] rounded-xl hover:border-[#00E5FF]/30 hover:bg-white/[0.06] transition-all duration-300 text-center w-full cursor-pointer"
                >
                  <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto rounded-xl overflow-hidden border border-white/10 mb-3 group-hover:border-[#00E5FF]/40 transition-all">
                    <img src={avatar.img} alt={displayName} className="w-full h-full object-cover group-hover:scale-105 transition-transform" loading="lazy" />
                  </div>
                  <h4 className="font-['Space_Grotesk'] font-bold text-white text-xs sm:text-sm truncate">{displayName}</h4>
                  {char?.realArtist && <p className="text-[#D4A843] text-[10px] truncate mt-0.5">{char.realArtist.split(',')[0]}</p>}
                  <p className="text-[#B0B0B0] text-[10px] sm:text-xs mt-1 truncate">{role}</p>
                  <p className="text-white/30 text-[10px] mt-1">{avatar.region}</p>
                  <p className="text-[#00E5FF]/50 text-[9px] mt-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    {tl(lang, { es: 'Toca para ver historia', en: 'Click for story', zh: '点击查看故事', 'pt-BR': 'Toque para ver história', 'pt-PT': 'Toque para ver história' })}
                  </p>
                </button>
              </FadeIn>
            );
          })}
        </div>

        {/* Social sharing */}
        <FadeIn delay={200}>
          <div className="mt-8 flex flex-col items-center gap-4">
            <SocialShareBar
              title="Conoce a la Familia LINCE IA — Aprende IA con avatares únicos"
              imageUrl={Object.values(AVATAR_FRONTAL)[0]}
            />
            <a href="/personajes" className="inline-flex items-center gap-2 px-6 py-3 bg-[#00E5FF]/10 border border-[#00E5FF]/30 rounded-xl text-[#00E5FF] font-['Space_Grotesk'] font-bold hover:bg-[#00E5FF]/20 transition-all">
              🎭 {tl(lang, { es: 'Ver Todos los Personajes', en: 'View All Characters', zh: '查看所有角色', 'pt-BR': 'Ver Todos os Personagens', 'pt-PT': 'Ver Todos os Personagens' })}
            </a>
          </div>
        </FadeIn>
      </div>

      {/* Avatar Story Modal */}
      {selectedAvatar && (
        <AvatarStoryModal
          character={ALL_CHARACTERS.find(c => c.key === selectedAvatar) || FAMILY_CHARACTERS[0]}
          lang={lang}
          onClose={() => setSelectedAvatar(null)}
        />
      )}
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════
// 6. FAMILIA — Fotos de personajes juntos de diferentes países
// ═══════════════════════════════════════════════════════════════
function FamiliaSection() {
  const { lang, getAvatarName } = usePRDLanguage();
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);

  // ALL MUSICALIN unified — no split between original and evento
  const allMusicalinEntries = Object.entries(AVATAR_MUSICALIN).map(([key, img]) => ({ key, img }));

  const familyGroups = [
    {
      title: tl(lang, { es: 'La Familia Original — Zaragoza, España', en: 'The Original Family — Zaragoza, Spain', zh: '原始家族 — 西班牙萨拉戈萨', 'pt-BR': 'A Família Original — Zaragoza, Espanha', 'pt-PT': 'A Família Original — Zaragoza, Espanha' }),
      flag: "🇪🇸",
      members: Object.entries(AVATAR_FRONTAL).map(([key, img]) => ({ key, img })),
      color: "#00E5FF",
      description: tl(lang, { es: '10 miembros de la familia LINCE, cada uno especializado en un área diferente de la IA.', en: '10 members of the LINCE family, each specialized in a different area of AI.', zh: 'LINCE家族的10位成员。', 'pt-BR': '10 membros da família LINCE, cada um especializado em uma área diferente da IA.', 'pt-PT': '10 membros da família LINCE, cada um especializado em uma área diferente da IA.' }),
    },
    {
      title: tl(lang, { es: 'MUSICALIN — Avatares Cantantes', en: 'MUSICALIN — Music & AI Artists', zh: 'MUSICALIN — 音乐与AI艺术家', 'pt-BR': 'MUSICALIN — Avatares Cantores', 'pt-PT': 'MUSICALIN — Avatares Cantores' }),
      flag: "🎵",
      members: allMusicalinEntries,
      color: "#FF6B35",
      description: tl(lang, { es: `${allMusicalinEntries.length} avatares musicales ficticios que enseñan IA a través de la música. Artistas de España, Argentina, Puerto Rico, Colombia y más.`, en: `${allMusicalinEntries.length} fictional music avatars who teach AI through music. Artists from Spain, Argentina, Puerto Rico, Colombia and more.`, zh: `${allMusicalinEntries.length}个通过音乐教授AI的虚构音乐化身。`, 'pt-BR': `${allMusicalinEntries.length} avatares musicales ficticios que enseñan IA a través de la música. Artistas de España, Argentina, Puerto Rico, Colombia y más.`, 'pt-PT': `${allMusicalinEntries.length} avatares musicales ficticios que enseñan IA a través de la música. Artistas de España, Argentina, Puerto Rico, Colombia y más.` }),
    },
  ];

  return (
    <section className="py-12 sm:py-24 relative">
      <div className="container">
        <FadeIn>
          <SectionHeader
            number="04"
            title={tl(lang, { es: 'La Familia LINCE IA en el Mundo', en: 'The LINCE IA Family Around the World', zh: 'LINCE IA家族遍布全球', 'pt-BR': 'A Família LINCE IA no Mundo', 'pt-PT': 'A Família LINCE IA no Mundo' })}
            subtitle={tl(lang, { es: 'Toca cualquier avatar para descubrir su historia de origen', en: 'Click any avatar to discover their origin story', zh: '点击任何角色发现他们的起源故事', 'pt-BR': 'Toca cualquier avatar para descubrir su historia de origen', 'pt-PT': 'Toca cualquier avatar para descubrir su historia de origen' })}
          />
        </FadeIn>

        <div className="space-y-12 mt-10">
          {familyGroups.map((group, gi) => (
            <FadeIn key={gi} delay={gi * 100}>
              <div className="p-6 sm:p-8 bg-white/[0.02] border border-white/[0.06] rounded-2xl">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl">{group.flag}</span>
                  <h3 className="font-['Space_Grotesk'] font-bold text-xl sm:text-2xl text-white">{group.title}</h3>
                </div>
                <p className="text-[#B0B0B0] text-sm mb-6 max-w-3xl">{group.description}</p>
                {/* Family photo: all members together — CLICKABLE */}
                <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
                  {group.members.map(({ key, img }) => {
                    const char = ALL_CHARACTERS.find(c => c.key === key);
                    const displayName = getAvatarName(key) || char?.name || key;
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => setSelectedAvatar(key)}
                        className="group relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border-2 transition-all hover:scale-110 hover:shadow-lg cursor-pointer"
                        style={{ borderColor: `${group.color}40` }}
                        title={displayName}
                      >
                        <img src={img} alt={displayName} className="w-full h-full object-cover" loading="lazy" />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-end justify-center">
                          <span className="text-white text-[8px] font-bold pb-1 opacity-0 group-hover:opacity-100 transition-opacity truncate px-0.5">{displayName}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
                <div className="mt-4 flex items-center justify-center gap-4">
                  <span className="text-sm font-['Space_Grotesk'] font-medium" style={{ color: group.color }}>
                    {group.members.length} {tl(lang, { es: 'personajes', en: 'characters', zh: '个角色', 'pt-BR': 'personajes', 'pt-PT': 'personajes' })}
                  </span>
                  <SocialShareBar
                    title={`Familia LINCE IA — ${group.title}`}
                    imageUrl={group.members[0]?.img || ''}
                  />
                </div>
              </div>
            </FadeIn>
          ))}
        </div>

        {/* Coming soon */}
        <FadeIn delay={300}>
          <div className="mt-8 p-6 bg-[#D4A843]/5 border border-[#D4A843]/20 rounded-2xl text-center">
            <h3 className="font-['Space_Grotesk'] font-bold text-lg text-[#D4A843] mb-2">
              {tl(lang, { es: 'Más Países Próximamente', en: 'More Countries Coming Soon', zh: '更多国家即将推出', 'pt-BR': 'Más Países Próximamente', 'pt-PT': 'Más Países Próximamente' })}
            </h3>
            <p className="text-[#B0B0B0] text-sm">
              🇲🇽 México · 🇦🇷 Argentina · 🇨🇴 Colombia · 🇧🇷 Brasil · 🇺🇸 USA · 🇯🇵 Japón · 🇰🇷 Corea
            </p>
          </div>
        </FadeIn>
      </div>

      {/* Avatar Story Modal */}
      {selectedAvatar && (
        <AvatarStoryModal
          character={ALL_CHARACTERS.find(c => c.key === selectedAvatar) || FAMILY_CHARACTERS[0]}
          lang={lang}
          onClose={() => setSelectedAvatar(null)}
        />
      )}
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════
// 7. SECCIONES DE JUEGO — Mundo, Batallas, Cursos, Herramientas, Aprender Prompts
// ═══════════════════════════════════════════════════════════════
function GameSectionsPreview() {
  const { lang } = usePRDLanguage();

  const isAdmin = isAdminUser();

  // Secciones visibles para TODOS los usuarios
  const userSections = [
    {
      icon: "⚡",
      title: "Herramientas IA",
      desc: tl(lang, { es: '62+ herramientas de IA catalogadas con guías paso a paso. Desde ChatGPT hasta Midjourney, aprende a usar cada herramienta.', en: '62+ AI tools catalogued with step-by-step guides. From ChatGPT to Midjourney, learn to use every tool.', zh: '62+个AI工具，配有分步指南。从ChatGPT到Midjourney，学会使用每个工具。', 'pt-BR': '62+ herramientas de IA catalogadas con guías paso a paso. Desde ChatGPT hasta Midjourney, aprende a usar cada herramienta.', 'pt-PT': '62+ herramientas de IA catalogadas con guías paso a paso. Desde ChatGPT hasta Midjourney, aprende a usar cada herramienta.' }),
      href: "/arsenal-ia",
      color: "#00E5FF",
      gradient: "from-cyan-500/10 to-cyan-600/5",
      border: "border-cyan-500/20 hover:border-cyan-500/40",
    },
    {
      icon: "✨",
      title: tl(lang, { es: 'Crear Imagen', en: 'Create Image', zh: '创建图像', 'pt-BR': 'Criar Imagem', 'pt-PT': 'Criar Imagem' }),
      subtitle: tl(lang, { es: 'Creador de Imágenes IA', en: 'AI Image Creator', zh: 'AI图像创作器', 'pt-BR': 'Creador de Imágenes IA', 'pt-PT': 'Creador de Imágenes IA' }),
      desc: tl(lang, { es: 'Genera imágenes con IA usando 4 campos simples. Todas las imágenes incluyen marca de agua LINCE y descarga PNG.', en: 'Generate images with AI using 4 simple fields. All images include LINCE watermark and PNG download.', zh: '使用4个简单字段用AI生成图像。所有图像包含LINCE水印和PNG下载。', 'pt-BR': 'Genera imágenes con IA usando 4 campos simples. Todas las imágenes incluyen marca de agua LINCE y descarga PNG.', 'pt-PT': 'Genera imágenes con IA usando 4 campos simples. Todas las imágenes incluyen marca de agua LINCE y descarga PNG.' }),
      href: "/prompt-studio",
      color: "#9C27B0",
      gradient: "from-purple-500/10 to-purple-600/5",
      border: "border-purple-500/20 hover:border-purple-500/40",
    },
    {
      icon: "🐱",
      title: tl(lang, { es: 'Especialistas', en: 'Specialists', zh: '专家', 'pt-BR': 'Especialistas', 'pt-PT': 'Especialistas' }),
      desc: tl(lang, { es: 'Conoce a los 85 personajes de LINCE. Chatea con ellos, aprende sus especialidades y descubre sus personalidades únicas.', en: 'Meet all 85 LINCE characters. Chat with them, learn their specialties, and discover their unique personalities.', zh: '认识85个LINCE角色。与他们聊天，了解他们的专长，发现他们独特的个性。', 'pt-BR': 'Conoce a los 85 personajes de LINCE. Chatea con ellos, aprende sus especialidades y descubre sus personalidades únicas.', 'pt-PT': 'Conoce a los 85 personajes de LINCE. Chatea con ellos, aprende sus especialidades y descubre sus personalidades únicas.' }),
      href: "/personajes",
      color: "#FFB300",
      gradient: "from-amber-500/10 to-amber-600/5",
      border: "border-amber-500/20 hover:border-amber-500/40",
    },
    {
      icon: "🎨",
      title: "Mi Avatar",
      subtitle: tl(lang, { es: 'Creador de Avatares IA', en: 'AI Avatar Creator', zh: 'AI角色创建器', 'pt-BR': 'Creador de Avatares IA', 'pt-PT': 'Creador de Avatares IA' }),
      desc: tl(lang, { es: 'Diseña tu propio avatar lince único con IA. Elige estilo, colores, accesorios y dale vida a tu avatar.', en: 'Design your own unique lynx avatar with AI. Choose style, colors, accessories and bring your avatar to life.', zh: '用AI设计你自己的独特山猫角色。选择风格、颜色、配件，让你的角色活起来。', 'pt-BR': 'Diseña tu propio avatar lince único con IA. Elige estilo, colores, accesorios y dale vida a tu avatar.', 'pt-PT': 'Diseña tu propio avatar lince único con IA. Elige estilo, colores, accesorios y dale vida a tu avatar.' }),
      href: "/lincelin",
      color: "#EC4899",
      gradient: "from-pink-500/10 to-pink-600/5",
      border: "border-pink-500/20 hover:border-pink-500/40",
    },
    {
      icon: "🧠",
      title: 'Aprender Prompts',
      subtitle: tl(lang, { es: 'Juego Competitivo', en: 'Competitive Game', zh: '竞技游戏', 'pt-BR': 'Juego Competitivo', 'pt-PT': 'Juego Competitivo' }),
      desc: tl(lang, { es: '6 modos de juego: Creativo, Técnico, Negocio, Ética, Speed Run, Battle. Escribe prompts y compite con evaluación IA.', en: '6 game modes: Creative, Technical, Business, Ethics, Speed Run, Battle. Write prompts and compete with AI evaluation.', zh: '6种游戏模式：创意、技术、商业、伦理、极速、对战。编写提示并通过AI评估竞争。', 'pt-BR': '6 modos de juego: Creativo, Técnico, Negocio, Ética, Speed Run, Battle. Escribe prompts y compite con evaluación IA.', 'pt-PT': '6 modos de juego: Creativo, Técnico, Negocio, Ética, Speed Run, Battle. Escribe prompts y compite con evaluación IA.' }),
      href: "/promptear",
      color: "#7C3AED",
      gradient: "from-violet-500/10 to-violet-600/5",
      border: "border-violet-500/20 hover:border-violet-500/40",
    },
    {
      icon: "🎪",
      title: tl(lang, { es: 'Tienda', en: 'Rewards Shop', zh: '奖励商店', 'pt-BR': 'Tienda', 'pt-PT': 'Tienda' }),
      subtitle: tl(lang, { es: 'Gasta tus LinceCoins', en: 'Spend your LinceCoins', zh: '花费你的LinceCoins', 'pt-BR': 'Gasta tus LinceCoins', 'pt-PT': 'Gasta tus LinceCoins' }),
      desc: tl(lang, { es: 'Desbloquea avatares exclusivos, escudos de racha, fondos personalizados y tareas premium con tus LinceCoins.', en: 'Unlock exclusive avatars, streak shields, custom backgrounds and premium tasks with your earned LinceCoins.', zh: '用你获得的LinceCoins解锁独家角色、连续盾牌、自定义背景和高级任务。', 'pt-BR': 'Desbloquea avatares exclusivos, escudos de racha, fondos personalizados y tareas premium con tus LinceCoins.', 'pt-PT': 'Desbloquea avatares exclusivos, escudos de racha, fondos personalizados y tareas premium con tus LinceCoins.' }),
      href: "/mercado",
      color: "#F59E0B",
      gradient: "from-yellow-500/10 to-yellow-600/5",
      border: "border-yellow-500/20 hover:border-yellow-500/40",
    },
    {
      icon: "🏆",
      title: tl(lang, { es: 'Reto del Día', en: 'Daily Challenge', zh: '每日挑战', 'pt-BR': 'Reto del Día', 'pt-PT': 'Reto del Día' }),
      subtitle: tl(lang, { es: 'Compite cada d\u00EDa', en: 'Compete daily', zh: '每日竞争', 'pt-BR': 'Compite cada d\u00EDa', 'pt-PT': 'Compite cada d\u00EDa' }),
      desc: tl(lang, { es: 'Un nuevo reto de prompts cada d\u00EDa. Escribe el mejor prompt, recibe puntuaci\u00F3n IA y sube en el ranking diario.', en: 'A new prompt challenge every day. Write the best prompt, get scored by AI, and climb the daily ranking.', zh: '每天一个新的提示词挑战。写出最佳提示词，获得AI评分，攻克每日排名。', 'pt-BR': 'Un nuevo reto de prompts cada d\u00EDa. Escribe el mejor prompt, recibe puntuaci\u00F3n IA y sube en el ranking diario.', 'pt-PT': 'Un nuevo reto de prompts cada d\u00EDa. Escribe el mejor prompt, recibe puntuaci\u00F3n IA y sube en el ranking diario.' }),
      href: "/reto-diario",
      color: "#EF4444",
      gradient: "from-red-500/10 to-red-600/5",
      border: "border-red-500/20 hover:border-red-500/40",
    },
    {
      icon: "🗺\uFE0F",
      title: tl(lang, { es: 'Mapa de Progresi\u00F3n', en: 'Progression Map', zh: '进度地图', 'pt-BR': 'Mapa de Progresi\u00F3n', 'pt-PT': 'Mapa de Progresi\u00F3n' }),
      subtitle: tl(lang, { es: '\u00C1rbol de habilidades', en: 'Skill tree', zh: '技能树', 'pt-BR': '\u00C1rbol de habilidades', 'pt-PT': '\u00C1rbol de habilidades' }),
      desc: tl(lang, { es: 'Visualiza tu camino de aprendizaje IA. Desbloquea 6 \u00E1reas con 19 habilidades: Fundamentos, Prompts, Im\u00E1genes, Marketing, C\u00F3digo, Negocios.', en: 'See your AI learning journey. Unlock 6 areas with 19 skills: Fundamentals, Prompts, Images, Marketing, Code, Business.', zh: '查看你的AI学习旅程。解锁6个领域19个技能：基础、提示词、图像、营销、代码、商业。', 'pt-BR': 'Visualiza tu camino de aprendizaje IA. Desbloquea 6 \u00E1reas con 19 habilidades: Fundamentos, Prompts, Im\u00E1genes, Marketing, C\u00F3digo, Negocios.', 'pt-PT': 'Visualiza tu camino de aprendizaje IA. Desbloquea 6 \u00E1reas con 19 habilidades: Fundamentos, Prompts, Im\u00E1genes, Marketing, C\u00F3digo, Negocios.' }),
      href: "/progresion",
      color: "#06B6D4",
      gradient: "from-teal-500/10 to-teal-600/5",
      border: "border-teal-500/20 hover:border-teal-500/40",
    },
  ];

  // Secciones SOLO para admins
  const adminSections = [
    {
      icon: "🌍",
      title: tl(lang, { es: 'Mundo LINCE', en: 'LINCE World', zh: 'LINCE世界', 'pt-BR': 'Mundo LINCE', 'pt-PT': 'Mundo LINCE' }),
      desc: tl(lang, { es: 'Construye tu ciudad IA, completa misiones familiares y compite con otros jugadores en un mundo virtual persistente.', en: 'Build your AI city, complete family missions, and compete with other players in a persistent virtual world.', zh: '建造你的AI城市，完成家族任务，在持久虚拟世界中与其他玩家竞争。', 'pt-BR': 'Construye tu ciudad IA, completa misiones familiares y compite con otros jugadores en un mundo virtual persistente.', 'pt-PT': 'Construye tu ciudad IA, completa misiones familiares y compite con otros jugadores en un mundo virtual persistente.' }),
      href: "/mundo",
      color: "#FFB300",
      gradient: "from-amber-500/10 to-amber-600/5",
      border: "border-amber-500/20 hover:border-amber-500/40",
    },
    {
      icon: "⚔️",
      title: "LINCE Batallas",
      desc: tl(lang, { es: 'Ataca y defiende con prompts de IA. Únete a ligas, gana recompensas exclusivas y sube en el ranking global.', en: 'Attack and defend with AI prompts. Join leagues, earn exclusive rewards, and climb the global ranking.', zh: '用AI提示进行攻击和防御。加入联赛，获得独家奖励，攀登全球排名。', 'pt-BR': 'Ataca y defiende con prompts de IA. Únete a ligas, gana recompensas exclusivas y sube en el ranking global.', 'pt-PT': 'Ataca y defiende con prompts de IA. Únete a ligas, gana recompensas exclusivas y sube en el ranking global.' }),
      href: "/raids",
      color: "#FF5252",
      gradient: "from-red-500/10 to-red-600/5",
      border: "border-red-500/20 hover:border-red-500/40",
    },
    {
      icon: "🎓",
      title: tl(lang, { es: 'Cursos IA', en: 'AI Courses', zh: 'AI课程', 'pt-BR': 'Cursos IA', 'pt-PT': 'Cursos IA' }),
      desc: tl(lang, { es: '10 habitaciones temáticas, 50 cursos, 900+ lecciones. Aprende IA de cero a experto con tu avatar como guía.', en: '10 thematic rooms, 50 courses, 900+ lessons. Learn AI from zero to expert with your avatar as guide.', zh: '10个主题教室，50门课程，900+节课。从零到专家，你的角色作为向导学习AI。', 'pt-BR': '10 habitaciones temáticas, 50 cursos, 900+ lecciones. Aprende IA de cero a experto con tu avatar como guía.', 'pt-PT': '10 habitaciones temáticas, 50 cursos, 900+ lecciones. Aprende IA de cero a experto con tu avatar como guía.' }),
      href: "/academia",
      color: "#00C853",
      gradient: "from-emerald-500/10 to-emerald-600/5",
      border: "border-emerald-500/20 hover:border-emerald-500/40",
    },
  ];

  const sections = isAdmin ? [...userSections, ...adminSections] : userSections;

  return (
    <section className="py-12 sm:py-24 relative">
      <div className="container">
        <FadeIn>
          <SectionHeader
            number="05"
            title={tl(lang, { es: 'Explora y Juega', en: 'Explore & Play', zh: '探索与游戏', 'pt-BR': 'Explora y Juega', 'pt-PT': 'Explora y Juega' })}
            subtitle={tl(lang, { es: 'Todo lo que necesitas para dominar la IA, en un solo lugar', en: 'Everything you need to master AI, all in one place', zh: '掌握AI所需的一切，尽在一处', 'pt-BR': 'Todo lo que necesitas para dominar la IA, en un solo lugar', 'pt-PT': 'Todo lo que necesitas para dominar la IA, en un solo lugar' })}
          />
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
          {sections.map((s, i) => (
            <FadeIn key={i} delay={i * 80}>
              <a href={s.href} className={`block p-6 sm:p-8 bg-gradient-to-br ${s.gradient} border-2 ${s.border} rounded-2xl transition-all duration-300 hover:scale-[1.02] group min-h-[200px]`}>
                <div className="text-5xl mb-5">{s.icon}</div>
                <h3 className="font-['Space_Grotesk'] font-bold text-2xl text-white group-hover:brightness-125 mb-2" style={{ color: s.color }}>{s.title}</h3>
                {('subtitle' in s && (s as any).subtitle) ? <span className="block text-sm font-medium text-white/60 mb-4 font-['Space_Grotesk'] uppercase tracking-wider">{(s as any).subtitle}</span> : <div className="mb-4" />}
                <p className="text-white/70 text-base leading-relaxed mb-5">{s.desc}</p>
                <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-base font-bold transition-all" style={{ color: s.color, backgroundColor: s.color + '15' }}>
                  <span>{tl(lang, { es: 'Entrar', en: 'Enter', zh: '进入', 'pt-BR': 'Entrar', 'pt-PT': 'Entrar' })}</span>
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" /></svg>
                </div>
              </a>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  const [activeSection, setActiveSection] = useState("hero");
  const [showWelcome, setShowWelcome] = useState(false);
  const [welcomeData, setWelcomeData] = useState<{ name: string; lang: string } | null>(null);

  // Always scroll to top when Home mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Check if we need to show the WelcomeModal (post-registration)
  useEffect(() => {
    const raw = localStorage.getItem("lince-show-welcome");
    if (raw) {
      try {
        const data = JSON.parse(raw);
        setWelcomeData(data);
        setShowWelcome(true);
        localStorage.removeItem("lince-show-welcome");
      } catch { /* ignore */ }
    }
  }, []);

  useEffect(() => {
    const sections = ["hero", ...NAV_ITEMS.map(n => n.id)];
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { rootMargin: "-40% 0px -40% 0px" }
    );
    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  const { lang } = usePRDLanguage();

  return (
    <div className="bg-[#0A0A0A] min-h-screen">
      <ChangeToastProvider />
      {/* WelcomeModal overlay — appears on top of Home after registration */}
      {showWelcome && welcomeData && (
        <Suspense fallback={
          <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm">
            <div className="w-12 h-12 border-4 border-[#FF6B35] border-t-transparent rounded-full animate-spin" />
          </div>
        }>
          <WelcomeModal
            userName={welcomeData.name}
            lang={welcomeData.lang as "es" | "en" | "zh"}
            onComplete={() => setShowWelcome(false)}
            onSkip={() => setShowWelcome(false)}
          />
        </Suspense>
      )}

      <Navigation activeSection={activeSection} />
      <FirstUseTutorial page="home" />
      <div className="pt-16">
      </div>
      <HeroSection />

      {/* Misiones de bienvenida gamificadas */}
      <div className="container px-4 py-6">
        <WelcomeMissions lang={lang as "es" | "en" | "zh"} />
      </div>

      {/* Secciones de juego — CTA principal después del hero */}
      <GameSectionsPreview />

      {/* LINCE URBAN: Oculto por solicitud del usuario */}

      {/* ─── SECCIONES INFORMATIVAS DESPLEGABLES ─── */}
      <div className="mt-12 mb-6">
        <div className="container">
          <FadeIn>
            <h2 className="font-['Space_Grotesk'] font-bold text-2xl sm:text-3xl text-white/70 mb-3">
              {tl(lang, { es: 'Conoce Más Sobre LINCE', en: 'Learn More About LINCE', zh: '了解更多关于LINCE', 'pt-BR': 'Conoce Más Sobre LINCE', 'pt-PT': 'Conoce Más Sobre LINCE' })}
            </h2>
            <p className="text-white/50 text-base sm:text-lg">
              {tl(lang, { es: 'Toca cualquier sección para ver más información', en: 'Tap any section to see more', zh: '点击展开任何部分', 'pt-BR': 'Toca cualquier sección para expandir', 'pt-PT': 'Toca cualquier sección para expandir' })}
            </p>
          </FadeIn>
        </div>
      </div>

      <CollapsibleSection
        id="avatares"
        title={tl(lang, { es: 'Conoce a la Familia LINCE IA', en: 'Meet the LINCE IA Family', zh: '认识LINCE IA家族', 'pt-BR': 'Conheça a Família LINCE IA', 'pt-PT': 'Conheça a Família LINCE IA' })}
        icon="🐱"
      >
        <AvatarSection />
      </CollapsibleSection>

      {/* Urban section hidden per user request */}

      <CollapsibleSection
        id="familia"
        title={tl(lang, { es: 'La Familia LINCE IA en el Mundo', en: 'The LINCE IA Family Around the World', zh: 'LINCE IA家族遍布全球', 'pt-BR': 'A Família LINCE IA no Mundo', 'pt-PT': 'A Família LINCE IA no Mundo' })}
        icon="🌍"
      >
        <FamiliaSection />
      </CollapsibleSection>

      <CollapsibleSection
        id="vision"
        title={tl(lang, { es: 'Manifiesto LINCE', en: 'LINCE Manifesto', zh: 'LINCE宣言', 'pt-BR': 'Manifiesto LINCE', 'pt-PT': 'Manifiesto LINCE' })}
        icon="🔥"
      >
        <VisionSection />
      </CollapsibleSection>

      <CollapsibleSection
        id="gracias"
        title={tl(lang, { es: 'Gracias, Duolingo', en: 'Thank You, Duolingo', zh: '感谢Duolingo', 'pt-BR': 'Gracias, Duolingo', 'pt-PT': 'Gracias, Duolingo' })}
        icon="💚"
      >
        <GraciasSection />
      </CollapsibleSection>
      <Footer />
      <ScrollToTopButton />
    </div>
  );
}

import { tl, type PRDLanguage} from "@/contexts/PRDLanguageContext";
import { useState, useEffect, useRef } from 'react';
import { Link } from 'wouter';
import { UserNavBadge } from '@/components/UserNavBadge';
import { useGameLang } from "@/hooks/useGameLang";
import { GameLanguageSelector } from '../components/GameLanguageSelector';
import { MUNDO_IMAGES, AVATAR_FRONTAL, AVATAR_MUSICALIN, ALL_CHARACTERS, getAvatarImage } from '../lib/avatarConstants';
import { GlossaryTooltip } from '../components/GlossaryTooltip';
import { Construction, ArrowLeft, X, Lock, Sparkles, Home as HomeIcon, ChefHat, Gamepad2, BookOpen, Leaf, FlaskConical, ArrowRight, MessageCircle } from 'lucide-react';
import { GlobalNavBar } from "@/components/GlobalNavBar";
import { BackButton } from "@/components/BackButton";

const IMAGES = MUNDO_IMAGES;

/* ─── Under Construction Modal ─── */
function UnderConstructionModal({ open, onClose, lang }: { open: boolean; onClose: () => void; lang: string }) {
  if (!open) return null;
  const msgs: Record<string, { title: string; body: string; btn: string }> = {
    es: { title: "En Construcción", body: "Esta funcionalidad está siendo desarrollada por el equipo LINCE. Pronto podrás disfrutarla. ¡Vuelve pronto!", btn: "Entendido" },
    en: { title: "Under Construction", body: "This feature is being developed by the LINCE team. You'll be able to enjoy it soon. Come back soon!", btn: "Got it" },
    zh: { title: "建设中", body: "此功能正在由LINCE团队开发中。您很快就能享受它。敬请期待！", btn: "知道了" },
  };
  const m = msgs[lang] || msgs.es;
  return (
    <div className="pt-14 fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
      <BackButton variant="inline" />
      <GlobalNavBar />
      <div className="bg-[#1A1A2E] border border-yellow-500/30 rounded-2xl p-8 max-w-md w-full text-center" onClick={e => e.stopPropagation()}>
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-yellow-500/20 flex items-center justify-center">
          <Construction className="w-8 h-8 text-yellow-400" />
        </div>
        <h3 className="text-2xl font-bold text-yellow-400 mb-3">{m.title}</h3>
        <p className="text-gray-300 mb-6 leading-relaxed">{m.body}</p>
        <div className="flex justify-center gap-3 mb-4">
          {[AVATAR_FRONTAL.PEQUELIN, AVATAR_FRONTAL.PEQUELINA, AVATAR_FRONTAL.SABELIN].map((src, i) => (
            <img key={i} src={src} alt="" className="w-10 h-10 rounded-full object-cover border-2 border-yellow-500/30 animate-bounce" style={{ animationDelay: `${i * 200}ms` }} />
          ))}
        </div>
        <button onClick={onClose} className="px-6 py-2.5 bg-yellow-500 text-black font-bold rounded-full hover:bg-yellow-400 transition-colors">{m.btn}</button>
      </div>
    </div>
  );
}

/* ─── Room Explorer (interactive experience) ─── */
function RoomExplorer({ lang, onClose }: { lang: string; onClose: () => void }) {
  const [activeRoom, setActiveRoom] = useState(0);
  const [showConstruction, setShowConstruction] = useState(false);

  const rooms: Record<string, Array<{ icon: React.ReactNode; name: string; desc: string; avatar: string; avatarName: string; prompt: string; xp: string; ready: boolean }>> = {
    es: [
      { icon: <HomeIcon className="w-6 h-6" />, name: "Sala de Estar", desc: "Donde toda la familia se reúne. Escribe prompts para decorar, añadir muebles inteligentes y crear un ambiente acogedor. Tu avatar te da la bienvenida.", avatar: AVATAR_FRONTAL.YAYALIN, avatarName: "YAYALIN", prompt: "Crea un sofá inteligente que cambie de color según el estado de ánimo de la familia", xp: "+100 XP", ready: false },
      { icon: <ChefHat className="w-6 h-6" />, name: "Cocina IA", desc: "La abuela y los nietos cocinan juntos con un robot asistente. Cada receta es un prompt que genera una comida virtual.", avatar: AVATAR_FRONTAL.YAYALINA, avatarName: "MAMALINA ABUELA", prompt: "Genera una receta de paella valenciana paso a paso con asistente de voz IA", xp: "+120 XP", ready: false },
      { icon: <Gamepad2 className="w-6 h-6" />, name: "Sala Gaming", desc: "El espacio del joven nativo digital. Setup con pantallas holográficas, retos de IA y competiciones con amigos.", avatar: AVATAR_FRONTAL.CHAVALIN, avatarName: "CHAVALÍN", prompt: "Diseña un torneo de prompts donde 4 jugadores compiten por crear el mejor chatbot", xp: "+150 XP", ready: false },
      { icon: <BookOpen className="w-6 h-6" />, name: "Biblioteca Mágica", desc: "Libros que cobran vida con IA. Cada libro es un curso, cada página es una lección interactiva.", avatar: AVATAR_FRONTAL.MAMALINA, avatarName: "MAMALINA", prompt: "Abre el libro de Machine Learning y crea una simulación visual de redes neuronales", xp: "+130 XP", ready: false },
      { icon: <Leaf className="w-6 h-6" />, name: "Jardín del Saber", desc: "Planta semillas de conocimiento que crecen con cada prompt completado. Un árbol = un tema dominado.", avatar: AVATAR_FRONTAL.PEQUELINA, avatarName: "PEQUELINA", prompt: "Planta una semilla de Python y riégala con 3 ejercicios de código para que crezca", xp: "+80 XP", ready: false },
      { icon: <FlaskConical className="w-6 h-6" />, name: "Laboratorio", desc: "Experimenta con IA. Crea robots, entrena modelos, prueba algoritmos. Todo con prompts.", avatar: AVATAR_FRONTAL.SABELIN, avatarName: "SABELIN", prompt: "Construye un robot mascota que aprenda trucos nuevos cada día usando reinforcement learning", xp: "+200 XP", ready: false },
    ],
    en: [
      { icon: <HomeIcon className="w-6 h-6" />, name: "Living Room", desc: "Where the whole family gathers. Write prompts to decorate, add smart furniture and create a cozy atmosphere.", avatar: AVATAR_FRONTAL.YAYALIN, avatarName: "YAYALIN", prompt: "Create a smart sofa that changes color based on the family's mood", xp: "+100 XP", ready: false },
      { icon: <ChefHat className="w-6 h-6" />, name: "AI Kitchen", desc: "Grandma and grandkids cook together with a robot assistant. Each recipe is a prompt that generates a virtual meal.", avatar: AVATAR_FRONTAL.YAYALINA, avatarName: "GRANDMA MAMALINA", prompt: "Generate a step-by-step paella recipe with AI voice assistant", xp: "+120 XP", ready: false },
      { icon: <Gamepad2 className="w-6 h-6" />, name: "Gaming Room", desc: "The young digital native's space. Holographic screens, AI challenges and friend competitions.", avatar: AVATAR_FRONTAL.CHAVALIN, avatarName: "CHAVALÍN", prompt: "Design a prompt tournament where 4 players compete to create the best chatbot", xp: "+150 XP", ready: false },
      { icon: <BookOpen className="w-6 h-6" />, name: "Magic Library", desc: "Books that come alive with AI. Each book is a course, each page an interactive lesson.", avatar: AVATAR_FRONTAL.MAMALINA, avatarName: "MAMALINA", prompt: "Open the Machine Learning book and create a visual neural network simulation", xp: "+130 XP", ready: false },
      { icon: <Leaf className="w-6 h-6" />, name: "Knowledge Garden", desc: "Plant seeds of knowledge that grow with each completed prompt. One tree = one mastered topic.", avatar: AVATAR_FRONTAL.PEQUELINA, avatarName: "PEQUELINA", prompt: "Plant a Python seed and water it with 3 code exercises to make it grow", xp: "+80 XP", ready: false },
      { icon: <FlaskConical className="w-6 h-6" />, name: "Laboratory", desc: "Experiment with AI. Create robots, train models, test algorithms. All with prompts.", avatar: AVATAR_FRONTAL.SABELIN, avatarName: "SABELIN", prompt: "Build a pet robot that learns new tricks daily using reinforcement learning", xp: "+200 XP", ready: false },
    ],
    zh: [
      { icon: <HomeIcon className="w-6 h-6" />, name: "客厅", desc: "全家聚会的地方。写提示词来装饰、添加智能家具和创造温馨氛围。", avatar: AVATAR_FRONTAL.YAYALIN, avatarName: "YAYALIN", prompt: "创建一个根据家庭心情变色的智能沙发", xp: "+100 XP", ready: false },
      { icon: <ChefHat className="w-6 h-6" />, name: "AI厨房", desc: "奶奶和孙辈与机器人助手一起烹饪。每个食谱都是生成虚拟美食的提示词。", avatar: AVATAR_FRONTAL.YAYALINA, avatarName: "奶奶MAMALINA", prompt: "生成带AI语音助手的西班牙海鲜饭逐步食谱", xp: "+120 XP", ready: false },
      { icon: <Gamepad2 className="w-6 h-6" />, name: "游戏室", desc: "年轻数字原住民的空间。全息屏幕、AI挑战和朋友竞赛。", avatar: AVATAR_FRONTAL.CHAVALIN, avatarName: "CHAVALÍN", prompt: "设计一个4人竞争创建最佳聊天机器人的提示词锦标赛", xp: "+150 XP", ready: false },
      { icon: <BookOpen className="w-6 h-6" />, name: "魔法图书馆", desc: "用AI让书籍活起来。每本书是一门课程，每页是一节互动课。", avatar: AVATAR_FRONTAL.MAMALINA, avatarName: "MAMALINA", prompt: "打开机器学习书籍，创建神经网络可视化模拟", xp: "+130 XP", ready: false },
      { icon: <Leaf className="w-6 h-6" />, name: "知识花园", desc: "种下知识种子，每完成一个提示词就会生长。一棵树=一个掌握的主题。", avatar: AVATAR_FRONTAL.PEQUELINA, avatarName: "PEQUELINA", prompt: "种下Python种子，用3个代码练习浇灌使其生长", xp: "+80 XP", ready: false },
      { icon: <FlaskConical className="w-6 h-6" />, name: "实验室", desc: "用AI实验。创建机器人、训练模型、测试算法。全部用提示词。", avatar: AVATAR_FRONTAL.SABELIN, avatarName: "SABELIN", prompt: "建造一个每天用强化学习学新技巧的宠物机器人", xp: "+200 XP", ready: false },
    ],
  };

  const currentRooms = rooms[lang] || rooms.es;
  const room = currentRooms[activeRoom];

  const labels: Record<string, { explore: string; close: string; enterRoom: string; promptExample: string; construction: string; roomOf: string }> = {
    es: { explore: "Explorar Habitaciones", close: "Cerrar", enterRoom: "Entrar a la habitación", promptExample: "Ejemplo de prompt:", construction: "Próximamente", roomOf: "Habitación" },
    en: { explore: "Explore Rooms", close: "Close", enterRoom: "Enter the room", promptExample: "Example prompt:", construction: "Coming Soon", roomOf: "Room" },
    zh: { explore: "探索房间", close: "关闭", enterRoom: "进入房间", promptExample: "示例提示词：", construction: "即将推出", roomOf: "房间" },
  };
  const l = labels[lang] || labels.es;

  return (
    <div className="fixed inset-0 z-[90] bg-black/80 backdrop-blur-md flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-gradient-to-b from-[#0D1117] to-[#1A1A2E] border border-cyan-500/20 rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-cyan-500/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">{l.explore}</h2>
              <p className="text-xs text-gray-400">{l.roomOf} {activeRoom + 1}/6</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
            <X className="w-4 h-4 text-white" />
          </button>
        </div>

        {/* Room Tabs */}
        <div className="flex overflow-x-auto gap-1 p-3 border-b border-white/5">
          {currentRooms.map((r, i) => (
            <button
              key={i}
              onClick={() => setActiveRoom(i)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                activeRoom === i
                  ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30"
                  : "bg-white/5 text-gray-400 border border-transparent hover:bg-white/10 hover:text-white"
              }`}
            >
              {r.icon}
              <span className="hidden sm:inline">{r.name}</span>
            </button>
          ))}
        </div>

        {/* Active Room Content */}
        <div className="p-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Left: Room Info */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-400">
                  {room.icon}
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">{room.name}</h3>
                  <span className="text-xs font-bold text-yellow-400 bg-yellow-400/10 px-2 py-0.5 rounded-full">{room.xp}</span>
                </div>
              </div>
              <p className="text-gray-300 leading-relaxed mb-6">{room.desc}</p>

              {/* Prompt Example */}
              <div className="bg-black/40 border border-cyan-500/20 rounded-xl p-4 mb-6">
                <p className="text-cyan-400 text-xs font-bold mb-2">{l.promptExample}</p>
                <div className="flex items-start gap-2">
                  <span className="text-cyan-400 text-xs font-mono mt-0.5">{'>'}_</span>
                  <p className="text-cyan-300/80 text-sm font-mono italic leading-relaxed">"{room.prompt}"</p>
                </div>
              </div>

              {/* Enter Room Button */}
              <button
                onClick={() => setShowConstruction(true)}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-emerald-500 text-black font-bold rounded-xl hover:scale-[1.02] transition-transform"
              >
                <Lock className="w-4 h-4" />
                {l.enterRoom}
                <span className="text-xs opacity-70">({l.construction})</span>
              </button>
            </div>

            {/* Right: Avatar Guide */}
            <div className="flex flex-col items-center justify-center">
              <div className="relative mb-4">
                <img
                  src={room.avatar}
                  alt={room.avatarName}
                  className="w-32 h-32 rounded-2xl object-cover border-2 border-cyan-500/30 shadow-[0_0_30px_rgba(0,229,255,0.15)]"
                />
                <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-cyan-500 flex items-center justify-center">
                  <MessageCircle className="w-4 h-4 text-black" />
                </div>
              </div>
              <p className="text-cyan-400 font-bold text-lg mb-1">{room.avatarName}</p>
              <div className="bg-white/5 border border-white/10 rounded-xl p-4 max-w-xs">
                <p className="text-gray-300 text-sm italic text-center leading-relaxed">
                  {tl(lang as PRDLanguage, { es: `"¡Bienvenido a mi ${room.name}! Aquí aprenderás a usar la IA de forma divertida. Pronto podrás explorar cada rincón."`, en: `"Welcome to my ${room.name}! Here you'll learn to use AI in a fun way. Soon you'll be able to explore every corner."`, zh: `"欢迎来到我的${room.name}！在这里你将以有趣的方式学习使用AI。很快你就能探索每个角落。"`, 'pt-BR': `"¡Bienvenido a mi ${room.name}! Aquí aprenderás a usar la IA de forma divertida. Pronto podrás explorar cada rincón."`, 'pt-PT': `"¡Bienvenido a mi ${room.name}! Aquí aprenderás a usar la IA de forma divertida. Pronto podrás explorar cada rincón."` })}
                </p>
              </div>

              {/* Other avatars peeking */}
              <div className="flex gap-2 mt-6">
                {currentRooms.filter((_, i) => i !== activeRoom).slice(0, 4).map((r, i) => (
                  <img key={i} src={r.avatar} alt="" className="w-8 h-8 rounded-full object-cover border border-white/20 opacity-50 hover:opacity-100 transition-opacity cursor-pointer" onClick={() => setActiveRoom(currentRooms.indexOf(r))} />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Navigation arrows */}
        <div className="flex items-center justify-between p-4 border-t border-white/5">
          <button
            onClick={() => setActiveRoom(Math.max(0, activeRoom - 1))}
            disabled={activeRoom === 0}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ArrowLeft className="w-4 h-4" /> {tl(lang as PRDLanguage, { es: 'Anterior', en: 'Previous', zh: '上一个', 'pt-BR': 'Anterior', 'pt-PT': 'Anterior' })}
          </button>
          <div className="flex gap-1.5">
            {currentRooms.map((_, i) => (
              <button key={i} onClick={() => setActiveRoom(i)} className={`w-2.5 h-2.5 rounded-full transition-colors ${i === activeRoom ? 'bg-cyan-400' : 'bg-white/20 hover:bg-white/40'}`} />
            ))}
          </div>
          <button
            onClick={() => setActiveRoom(Math.min(currentRooms.length - 1, activeRoom + 1))}
            disabled={activeRoom === currentRooms.length - 1}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            {tl(lang as PRDLanguage, { es: 'Siguiente', en: 'Next', zh: '下一个', 'pt-BR': 'Próximo', 'pt-PT': 'Próximo' })} <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <UnderConstructionModal open={showConstruction} onClose={() => setShowConstruction(false)} lang={lang} />
    </div>
  );
}

/* ─── Translations ─── */
const mundoTranslations: Record<string, Record<string, any>> = {
  es: {
    nav: { back: '← Inicio', raids: '⚔️ LINCE Raids', comoJugar: '🎮 Cómo Jugar', register: 'Registro' },
    hero: {
      badge: '🌍 Nuevo Mundo Virtual',
      title: 'MUNDO',
      titleAccent: 'LINCE',
      subtitle: 'Donde la IA acerca familias — Un mundo virtual tipo Sims donde tu familia aprende, juega y crece junta',
      description: 'Imagina un mundo donde cada miembro de tu familia tiene su propia casa virtual, donde los abuelos envían misiones de IA a los nietos, donde los amigos crean mundos privados para jugar y aprender juntos. Y lo mejor: TODO se hace escribiendo prompts. Cada acción, cada construcción, cada interacción requiere pensar y escribir. La IA no es solo una herramienta — es el puente que conecta generaciones.',
      cta: '🏠 Explorar el Mundo',
      stats: [
        { number: '∞', label: 'Mundos por crear' },
        { number: '10+', label: 'Tipos de habitación' },
        { number: '50+', label: 'Misiones familiares' },
        { number: '24/7', label: 'Conexión familiar' },
      ],
    },
    concept: {
      badge: '💡 El Concepto',
      title: 'Tu Familia, Tu Mundo, Tus Prompts',
      subtitle: 'Cada acción en el Mundo LINCE requiere escribir un prompt de IA. Así, mientras juegas, aprendes. Mientras construyes, piensas. Mientras conectas con tu familia, dominas la inteligencia artificial.',
      cards: [
        { icon: '🏠', title: 'Construye con Prompts', description: 'Quieres una cocina nueva? Escribe: "Diseña una cocina futurista con robot asistente y jardín vertical". La calidad de tu prompt determina la calidad de tu construcción.', prompt: '"Diseña una habitación mágica con techo de estrellas y una biblioteca flotante para mi avatar Pequelina"', xp: '+150 XP por prompt creativo' },
        { icon: '👨‍👩‍👧‍👦', title: 'Misiones Familiares', description: 'La abuela envía una misión al nieto: "Escribe un prompt para crear una receta de IA". El nieto responde, la abuela evalúa, ambos ganan XP.', prompt: '"Crea un asistente de cocina IA que ayude a la abuela a digitalizar sus recetas tradicionales"', xp: '+200 XP por misión familiar' },
        { icon: '🤝', title: 'Mundos de Amigos', description: 'Crea mundos privados con tus amigos. Conversa, juega, envía tareas. En vez de estar dentro de una pantalla, haces cosas EN la pantalla.', prompt: '"Construye un club secreto con sala de estrategia, laboratorio de IA y pista de obstáculos"', xp: '+100 XP por mundo compartido' },
        { icon: '⚔️', title: '¡Te Pueden Robar!', description: 'Tus amigos pueden visitar tu casa y... ¡intentar robarte recursos! Para robar necesitan escribir un prompt de hackeo. Y tú puedes defenderte con prompts de seguridad.', prompt: '"Hackea el sistema de seguridad de la casa usando ingeniería social y un prompt de distracción"', xp: '+300 XP por defensa exitosa' },
      ],
    },
    familyWorld: {
      badge: '🏡 Casa Familiar',
      title: 'Tu Casa, Tu Universo',
      subtitle: 'Cada familia tiene su propia casa virtual construida enteramente con prompts de IA',
      rooms: [
        { icon: '🛋️', name: 'Sala de Estar', desc: 'Donde toda la familia se reúne. Escribe prompts para decorar, añadir muebles inteligentes y crear un ambiente acogedor.', prompt: 'Prompt ejemplo: "Crea un sofá inteligente que cambie de color según el estado de ánimo de la familia"' },
        { icon: '🍳', name: 'Cocina IA', desc: 'La abuela y los nietos cocinan juntos con un robot asistente. Cada receta es un prompt que genera una comida virtual.', prompt: 'Prompt ejemplo: "Genera una receta de paella valenciana paso a paso con asistente de voz IA"' },
        { icon: '🎮', name: 'Sala Gaming', desc: 'El espacio del joven nativo digital. Setup con pantallas holográficas, retos de IA y competiciones con amigos.', prompt: 'Prompt ejemplo: "Diseña un torneo de prompts donde 4 jugadores compiten por crear el mejor chatbot"' },
        { icon: '📚', name: 'Biblioteca Mágica', desc: 'Libros que cobran vida con IA. Cada libro es un curso, cada página es una lección interactiva.', prompt: 'Prompt ejemplo: "Abre el libro de Machine Learning y crea una simulación visual de redes neuronales"' },
        { icon: '🌿', name: 'Jardín del Saber', desc: 'Planta semillas de conocimiento que crecen con cada prompt completado. Un árbol = un tema dominado.', prompt: 'Prompt ejemplo: "Planta una semilla de Python y riégala con 3 ejercicios de código para que crezca"' },
        { icon: '🔬', name: 'Laboratorio', desc: 'Experimenta con IA. Crea robots, entrena modelos, prueba algoritmos. Todo con prompts.', prompt: 'Prompt ejemplo: "Construye un robot mascota que aprenda trucos nuevos cada día usando reinforcement learning"' },
      ],
    },
    friendsWorld: {
      badge: '🌐 Mundos de Amigos',
      title: 'Conecta, Juega, Aprende Juntos',
      subtitle: 'Crea mundos privados con amigos y familia. La IA es el puente que acerca relaciones.',
      features: [
        { icon: '💬', title: 'Chat con IA', desc: 'Conversa con amigos mientras un avatar IA modera, sugiere temas y propone retos.' },
        { icon: '🎯', title: 'Misiones Compartidas', desc: 'Recibe misiones que requieren colaboración. Trabajo en equipo = más XP.' },
        { icon: '🏗️', title: 'Construcción Colaborativa', desc: 'Construye mundos juntos. Cada amigo aporta un prompt para una parte del mundo.' },
        { icon: '📮', title: 'Cartas de IA', desc: 'Envía "cartas mágicas" a tu abuelo, tu primo, tu mejor amigo.' },
        { icon: '🏆', title: 'Ligas Privadas', desc: 'Compite con tu grupo de amigos en ligas de prompts.' },
        { icon: '🎪', title: 'Eventos Especiales', desc: 'Navidad, Halloween, vuelta al cole... Eventos temáticos con prompts creativos.' },
      ],
    },
    robbery: {
      badge: '🦹 Sistema de Robos',
      title: '¡Cuidado! Tus Amigos Pueden Robarte',
      subtitle: 'El PvP más inteligente: para robar necesitas escribir mejores prompts que la defensa de tu víctima',
      attack: {
        title: '⚔️ Modo Ataque',
        desc: 'Visita la casa de un amigo y escribe un prompt para hackear su seguridad.',
        steps: [
          { step: '1', text: 'Elige la casa de un amigo para asaltar' },
          { step: '2', text: 'Analiza sus defensas' },
          { step: '3', text: 'Escribe tu prompt de ataque' },
          { step: '4', text: 'La IA evalúa tu prompt vs la defensa' },
          { step: '5', text: '¡Si ganas, te llevas LinceCoins!' },
        ],
        examplePrompt: '"Usa ingeniería social para convencer al robot guardián de que eres un técnico de mantenimiento"',
      },
      defense: {
        title: '🛡️ Modo Defensa',
        desc: 'Protege tu casa escribiendo prompts de seguridad.',
        steps: [
          { step: '1', text: 'Escribe prompts para crear trampas inteligentes' },
          { step: '2', text: 'Configura un robot guardián con instrucciones de IA' },
          { step: '3', text: 'Crea escudos de encriptación' },
          { step: '4', text: 'Recibe alertas cuando alguien intenta robarte' },
          { step: '5', text: 'Gana XP extra por cada defensa exitosa' },
        ],
        examplePrompt: '"Crea un sistema de seguridad con 3 capas: reconocimiento facial IA, pregunta secreta y trampa de laberinto"',
      },
    },
    activities: {
      badge: '🎮 Actividades',
      title: 'Todo Se Hace con Prompts',
      subtitle: 'Cada actividad requiere pensar y escribir. No hay botones mágicos — solo tu creatividad.',
      list: [
        { icon: '🌱', title: 'Plantar Conocimiento', desc: 'Escribe un prompt para plantar una semilla de saber.', xp: '+50 XP/día' },
        { icon: '🧩', title: 'Puzzles de IA', desc: 'Resuelve puzzles donde las piezas son prompts.', xp: '+100 XP/puzzle' },
        { icon: '📖', title: 'Storytelling IA', desc: 'Crea historias donde tus avatares son los protagonistas.', xp: '+75 XP/capítulo' },
        { icon: '🤖', title: 'Construir Robots', desc: 'Diseña robots con prompts. Define su personalidad y habilidades.', xp: '+200 XP/robot' },
        { icon: '🎨', title: 'Arte con IA', desc: 'Genera arte para decorar tu casa.', xp: '+80 XP/obra' },
        { icon: '🏅', title: 'Torneos de Prompts', desc: 'Compite contra otros jugadores.', xp: '+500 XP/torneo' },
      ],
    },
    connection: {
      badge: '❤️ Conexión Familiar',
      title: 'La IA Que Acerca Corazones',
      subtitle: 'Tecnología para que la abuela y el nieto compartan momentos, para que los amigos se rían juntos.',
      quote: '"Imagina que conectas con tu abuelo y en vez de estar dentro de una pantalla, empiezas a hacer cosas en la pantalla para acercar relaciones."',
      scenarios: [
        { emoji: '👵↔️👧', title: 'Abuela + Nieta', desc: 'La abuela envía un prompt-receta. La nieta lo mejora con IA. Juntas crean algo nuevo.' },
        { emoji: '👨↔️👦', title: 'Padre + Hijo', desc: 'El padre propone un reto de negocio con IA. El hijo lo resuelve con creatividad.' },
        { emoji: '👫↔️👫', title: 'Amigos', desc: 'Crean un mundo privado donde cada uno aporta prompts. Construyen, compiten, se ayudan.' },
        { emoji: '👨‍👩‍👧‍👦', title: 'Familia Completa', desc: 'Misión familiar: "Escriban un prompt cada uno para construir la casa de vacaciones perfecta".' },
      ],
    },
    economy: {
      title: '💰 Economía del Mundo',
      subtitle: 'LinceCoins — La moneda que se gana pensando',
      items: [
        { icon: '✍️', action: 'Escribir un prompt', coins: '+10-50 LC', detail: 'Según calidad' },
        { icon: '🏠', action: 'Construir habitación', coins: '-100 LC', detail: 'Invierte en tu mundo' },
        { icon: '⚔️', action: 'Robo exitoso', coins: '+200 LC', detail: 'Riesgo alto' },
        { icon: '🛡️', action: 'Defensa exitosa', coins: '+150 LC', detail: 'Protege lo tuyo' },
        { icon: '👨‍👩‍👧‍👦', action: 'Misión familiar', coins: '+300 LC', detail: 'Bonus colaboración' },
        { icon: '🏆', action: 'Ganar torneo', coins: '+1000 LC', detail: 'El premio gordo' },
      ],
    },
    cta: {
      title: '¿Listo para construir tu mundo?',
      subtitle: 'Explora las habitaciones y descubre lo que te espera',
      button: '🚀 Comenzar Ahora',
      secondary: '⚔️ Ver LINCE Raids',
    },
  },
  en: {
    nav: { back: '← Home', raids: '⚔️ LINCE Raids', comoJugar: '🎮 How to Play', register: 'Register' },
    hero: {
      badge: '🌍 New Virtual World',
      title: 'MUNDO',
      titleAccent: 'LINCE',
      subtitle: 'Where AI brings families closer — A Sims-like virtual world where your family learns, plays and grows together',
      description: 'Imagine a world where every family member has their own virtual house, where grandparents send AI missions to grandchildren, where friends create private worlds to play and learn together.',
      cta: '🏠 Explore the World',
      stats: [
        { number: '∞', label: 'Worlds to create' },
        { number: '10+', label: 'Room types' },
        { number: '50+', label: 'Family missions' },
        { number: '24/7', label: 'Family connection' },
      ],
    },
    concept: {
      badge: '💡 The Concept',
      title: 'Your Family, Your World, Your Prompts',
      subtitle: 'Every action in Mundo LINCE requires writing an AI prompt. While you play, you learn. While you build, you think.',
      cards: [
        { icon: '🏠', title: 'Build with Prompts', description: 'Want a new kitchen? Write a prompt. Your prompt quality determines your construction quality.', prompt: '"Design a magical room with a starry ceiling and a floating library"', xp: '+150 XP for creative prompt' },
        { icon: '👨‍👩‍👧‍👦', title: 'Family Missions', description: 'Grandma sends a mission to grandson. Both earn XP. AI bridges generations through creative challenges.', prompt: '"Create an AI kitchen assistant that helps grandma digitize her traditional recipes"', xp: '+200 XP for family mission' },
        { icon: '🤝', title: 'Friend Worlds', description: 'Create private worlds with friends. Chat, play, send tasks. Bring relationships closer.', prompt: '"Build a secret club with strategy room, AI lab and obstacle course"', xp: '+100 XP for shared world' },
        { icon: '⚔️', title: 'They Can Rob You!', description: 'Friends can visit your house and try to steal resources! To steal they need hacking prompts. Defend with security prompts.', prompt: '"Hack the security system using social engineering"', xp: '+300 XP for successful defense' },
      ],
    },
    familyWorld: {
      badge: '🏡 Family House',
      title: 'Your House, Your Universe',
      subtitle: 'Each family has their own virtual house built entirely with AI prompts',
      rooms: [
        { icon: '🛋️', name: 'Living Room', desc: 'Where the whole family gathers. Write prompts to decorate and create a cozy atmosphere.', prompt: 'Example: "Create a smart sofa that changes color based on mood"' },
        { icon: '🍳', name: 'AI Kitchen', desc: 'Grandma and grandkids cook together with a robot assistant.', prompt: 'Example: "Generate a step-by-step paella recipe with AI voice assistant"' },
        { icon: '🎮', name: 'Gaming Room', desc: 'Holographic screens, AI challenges and friend competitions.', prompt: 'Example: "Design a prompt tournament where 4 players compete"' },
        { icon: '📚', name: 'Magic Library', desc: 'Books that come alive with AI. Each book is a course.', prompt: 'Example: "Open the Machine Learning book and create a visual simulation"' },
        { icon: '🌿', name: 'Knowledge Garden', desc: 'Plant seeds of knowledge that grow with each completed prompt.', prompt: 'Example: "Plant a Python seed and water it with code exercises"' },
        { icon: '🔬', name: 'Laboratory', desc: 'Experiment with AI. Create robots, train models, test algorithms.', prompt: 'Example: "Build a pet robot that learns new tricks daily"' },
      ],
    },
    friendsWorld: {
      badge: '🌐 Friend Worlds',
      title: 'Connect, Play, Learn Together',
      subtitle: 'Create private worlds with friends and family.',
      features: [
        { icon: '💬', title: 'AI Chat', desc: 'Chat with friends while an AI avatar moderates and proposes challenges.' },
        { icon: '🎯', title: 'Shared Missions', desc: 'Receive missions that require collaboration. Teamwork = more XP.' },
        { icon: '🏗️', title: 'Collaborative Building', desc: 'Build worlds together. Each friend contributes a prompt.' },
        { icon: '📮', title: 'AI Letters', desc: 'Send "magic letters" that generate unique surprises.' },
        { icon: '🏆', title: 'Private Leagues', desc: 'Compete with friends in prompt leagues.' },
        { icon: '🎪', title: 'Special Events', desc: 'Themed events where the whole community participates.' },
      ],
    },
    robbery: {
      badge: '🦹 Robbery System',
      title: 'Watch Out! Your Friends Can Rob You',
      subtitle: 'The smartest PvP: to steal you need better prompts than the defense',
      attack: {
        title: '⚔️ Attack Mode',
        desc: 'Visit a friend\'s house and write a prompt to hack their security.',
        steps: [
          { step: '1', text: 'Choose a friend\'s house to raid' },
          { step: '2', text: 'Analyze their defenses' },
          { step: '3', text: 'Write your attack prompt' },
          { step: '4', text: 'AI evaluates your prompt vs defense' },
          { step: '5', text: 'If you win, take LinceCoins!' },
        ],
        examplePrompt: '"Use social engineering to convince the guardian robot you\'re a maintenance technician"',
      },
      defense: {
        title: '🛡️ Defense Mode',
        desc: 'Protect your house by writing security prompts.',
        steps: [
          { step: '1', text: 'Write prompts to create smart traps' },
          { step: '2', text: 'Configure a guardian robot with AI instructions' },
          { step: '3', text: 'Create encryption shields' },
          { step: '4', text: 'Receive alerts when someone tries to rob you' },
          { step: '5', text: 'Earn extra XP for each successful defense' },
        ],
        examplePrompt: '"Create a 3-layer security system: AI facial recognition, secret question, and maze trap"',
      },
    },
    activities: {
      badge: '🎮 Activities',
      title: 'Everything Is Done with Prompts',
      subtitle: 'Every activity requires thinking and writing. No magic buttons — only your creativity.',
      list: [
        { icon: '🌱', title: 'Plant Knowledge', desc: 'Write a prompt to plant a seed of knowledge.', xp: '+50 XP/day' },
        { icon: '🧩', title: 'AI Puzzles', desc: 'Solve puzzles where the pieces are prompts.', xp: '+100 XP/puzzle' },
        { icon: '📖', title: 'AI Storytelling', desc: 'Create stories with your avatars as protagonists.', xp: '+75 XP/chapter' },
        { icon: '🤖', title: 'Build Robots', desc: 'Design robots with prompts.', xp: '+200 XP/robot' },
        { icon: '🎨', title: 'AI Art', desc: 'Generate art to decorate your house.', xp: '+80 XP/artwork' },
        { icon: '🏅', title: 'Prompt Tournaments', desc: 'Compete against other players.', xp: '+500 XP/tournament' },
      ],
    },
    connection: {
      badge: '❤️ Family Connection',
      title: 'AI That Brings Hearts Closer',
      subtitle: 'Technology so grandma and grandson share moments, so friends laugh together.',
      quote: '"Imagine connecting with your grandfather and doing things on the screen to bring relationships closer."',
      scenarios: [
        { emoji: '👵↔️👧', title: 'Grandma + Granddaughter', desc: 'Grandma sends a recipe-prompt. Granddaughter improves it with AI.' },
        { emoji: '👨↔️👦', title: 'Father + Son', desc: 'Father proposes an AI business challenge. Son solves it with creativity.' },
        { emoji: '👫↔️👫', title: 'Friends', desc: 'They create a private world where each contributes prompts.' },
        { emoji: '👨‍👩‍👧‍👦', title: 'Full Family', desc: 'Family mission: "Each write a prompt to build the perfect vacation house".' },
      ],
    },
    economy: {
      title: '💰 World Economy',
      subtitle: 'LinceCoins — The currency earned by thinking',
      items: [
        { icon: '✍️', action: 'Write a prompt', coins: '+10-50 LC', detail: 'Based on quality' },
        { icon: '🏠', action: 'Build room', coins: '-100 LC', detail: 'Invest in your world' },
        { icon: '⚔️', action: 'Successful robbery', coins: '+200 LC', detail: 'High risk' },
        { icon: '🛡️', action: 'Successful defense', coins: '+150 LC', detail: 'Protect yours' },
        { icon: '👨‍👩‍👧‍👦', action: 'Family mission', coins: '+300 LC', detail: 'Collaboration bonus' },
        { icon: '🏆', action: 'Win tournament', coins: '+1000 LC', detail: 'The jackpot' },
      ],
    },
    cta: {
      title: 'Ready to build your world?',
      subtitle: 'Explore the rooms and discover what awaits you',
      button: '🚀 Start Now',
      secondary: '⚔️ See LINCE Raids',
    },
  },
  zh: {
    nav: { back: '← 首页', raids: '⚔️ LINCE突袭', comoJugar: '🎮 如何游玩', register: '注册' },
    hero: {
      badge: '🌍 全新虚拟世界',
      title: 'MUNDO',
      titleAccent: 'LINCE',
      subtitle: 'AI拉近家庭距离 — 一个类似模拟人生的虚拟世界',
      description: '想象一个世界，每个家庭成员都有自己的虚拟房屋，祖父母向孙辈发送AI任务，朋友们创建私人世界一起玩耍和学习。',
      cta: '🏠 探索世界',
      stats: [
        { number: '∞', label: '可创建的世界' },
        { number: '10+', label: '房间类型' },
        { number: '50+', label: '家庭任务' },
        { number: '24/7', label: '家庭连接' },
      ],
    },
    concept: {
      badge: '💡 概念',
      title: '你的家庭，你的世界，你的提示词',
      subtitle: '每个动作都需要编写AI提示词。玩的时候学习，建造的时候思考。',
      cards: [
        { icon: '🏠', title: '用提示词建造', description: '提示词质量决定建筑质量。', prompt: '"为我的角色设计一个有星空天花板的魔法房间"', xp: '+150 XP' },
        { icon: '👨‍👩‍👧‍👦', title: '家庭任务', description: '奶奶给孙子发任务，双方都获得XP。', prompt: '"创建一个AI厨房助手"', xp: '+200 XP' },
        { icon: '🤝', title: '朋友世界', description: '与朋友创建私人世界。', prompt: '"建造一个秘密俱乐部"', xp: '+100 XP' },
        { icon: '⚔️', title: '他们可以抢你！', description: '朋友可以尝试偷你的资源！', prompt: '"入侵安全系统"', xp: '+300 XP' },
      ],
    },
    familyWorld: {
      badge: '🏡 家庭房屋',
      title: '你的房子，你的宇宙',
      subtitle: '每个家庭都有用AI提示词建造的虚拟房屋',
      rooms: [
        { icon: '🛋️', name: '客厅', desc: '全家聚会的地方。', prompt: '示例："创建一个智能沙发"' },
        { icon: '🍳', name: 'AI厨房', desc: '奶奶和孙辈一起烹饪。', prompt: '示例："生成海鲜饭食谱"' },
        { icon: '🎮', name: '游戏室', desc: '全息屏幕、AI挑战。', prompt: '示例："设计提示词锦标赛"' },
        { icon: '📚', name: '魔法图书馆', desc: '用AI让书籍活起来。', prompt: '示例："创建神经网络模拟"' },
        { icon: '🌿', name: '知识花园', desc: '种下知识种子。', prompt: '示例："种下Python种子"' },
        { icon: '🔬', name: '实验室', desc: '用AI实验。', prompt: '示例："建造宠物机器人"' },
      ],
    },
    friendsWorld: {
      badge: '🌐 朋友世界',
      title: '连接、玩耍、一起学习',
      subtitle: '与朋友和家人创建私人世界。',
      features: [
        { icon: '💬', title: 'AI聊天', desc: 'AI角色主持聊天。' },
        { icon: '🎯', title: '共享任务', desc: '需要协作的任务。' },
        { icon: '🏗️', title: '协作建造', desc: '一起建造世界。' },
        { icon: '📮', title: 'AI信件', desc: '发送魔法信件。' },
        { icon: '🏆', title: '私人联赛', desc: '提示词联赛竞争。' },
        { icon: '🎪', title: '特别活动', desc: '主题活动。' },
      ],
    },
    robbery: {
      badge: '🦹 抢劫系统',
      title: '小心！你的朋友可以抢你',
      subtitle: '最聪明的PvP',
      attack: {
        title: '⚔️ 攻击模式',
        desc: '写提示词入侵安全系统。',
        steps: [
          { step: '1', text: '选择朋友房屋' },
          { step: '2', text: '分析防御' },
          { step: '3', text: '写攻击提示词' },
          { step: '4', text: 'AI评估' },
          { step: '5', text: '获得LinceCoins！' },
        ],
        examplePrompt: '"使用社会工程学说服守卫机器人"',
      },
      defense: {
        title: '🛡️ 防御模式',
        desc: '写安全提示词保护房子。',
        steps: [
          { step: '1', text: '创建智能陷阱' },
          { step: '2', text: '配置守卫机器人' },
          { step: '3', text: '创建加密盾牌' },
          { step: '4', text: '收到警报' },
          { step: '5', text: '获得额外XP' },
        ],
        examplePrompt: '"创建3层安全系统"',
      },
    },
    activities: {
      badge: '🎮 活动',
      title: '一切都用提示词完成',
      subtitle: '每个活动都需要思考和写作。',
      list: [
        { icon: '🌱', title: '种植知识', desc: '写提示词种下种子。', xp: '+50 XP/天' },
        { icon: '🧩', title: 'AI拼图', desc: '解决提示词拼图。', xp: '+100 XP' },
        { icon: '📖', title: 'AI讲故事', desc: '创建角色故事。', xp: '+75 XP' },
        { icon: '🤖', title: '建造机器人', desc: '用提示词设计机器人。', xp: '+200 XP' },
        { icon: '🎨', title: 'AI艺术', desc: '生成装饰艺术。', xp: '+80 XP' },
        { icon: '🏅', title: '提示词锦标赛', desc: '与其他玩家竞争。', xp: '+500 XP' },
      ],
    },
    connection: {
      badge: '❤️ 家庭连接',
      title: '拉近心灵的AI',
      subtitle: '让奶奶和孙子分享时刻。',
      quote: '"在屏幕上做事来拉近关系。"',
      scenarios: [
        { emoji: '👵↔️👧', title: '奶奶+孙女', desc: '奶奶发送提示词食谱。' },
        { emoji: '👨↔️👦', title: '父亲+儿子', desc: '父亲提出AI挑战。' },
        { emoji: '👫↔️👫', title: '朋友', desc: '创建私人世界。' },
        { emoji: '👨‍👩‍👧‍👦', title: '全家', desc: '家庭任务。' },
      ],
    },
    economy: {
      title: '💰 世界经济',
      subtitle: 'LinceCoins — 用思考赚取的货币',
      items: [
        { icon: '✍️', action: '写提示词', coins: '+10-50 LC', detail: '根据质量' },
        { icon: '🏠', action: '建造房间', coins: '-100 LC', detail: '投资世界' },
        { icon: '⚔️', action: '成功抢劫', coins: '+200 LC', detail: '高风险' },
        { icon: '🛡️', action: '成功防御', coins: '+150 LC', detail: '保护' },
        { icon: '👨‍👩‍👧‍👦', action: '家庭任务', coins: '+300 LC', detail: '协作奖励' },
        { icon: '🏆', action: '赢得锦标赛', coins: '+1000 LC', detail: '大奖' },
      ],
    },
    cta: {
      title: '准备好建造你的世界了吗？',
      subtitle: '探索房间，发现等待你的一切',
      button: '🚀 立即开始',
      secondary: '⚔️ 查看LINCE突袭',
    },
  },
};

/* ─── Fade-in animation component ─── */
function FadeIn({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } }, { threshold: 0.15 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} className={`transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

/* ─── Prompt Display Component ─── */
function PromptDisplay({ prompt, xp }: { prompt: string; xp?: string }) {
  return (
    <div className="mt-3 bg-black/40 border border-cyan-500/30 rounded-lg p-3">
      <div className="flex items-start gap-2">
        <span className="text-cyan-400 text-xs font-mono mt-0.5">{'>'}_</span>
        <p className="text-cyan-300/80 text-xs font-mono italic leading-relaxed">{prompt}</p>
      </div>
      {xp && <p className="text-right text-[10px] text-yellow-400/80 font-bold mt-1">{xp}</p>}
    </div>
  );
}

/* ─── Main Page Component ─── */
export default function MundoLince() {
  const { lang } = useGameLang();
  const t = mundoTranslations[lang] || mundoTranslations.es;
  const [showExplorer, setShowExplorer] = useState(false);
  const [showConstruction, setShowConstruction] = useState(false);

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      {/* Navigation */}

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-14">
        <div className="absolute inset-0">
          <img src={IMAGES.hero} alt="Mundo LINCE" className="w-full h-full object-cover opacity-40" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0A] via-[#0A0A0A]/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-[#0A0A0A]/50" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 py-20">
          <FadeIn>
            <span className="inline-block bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold px-4 py-1.5 rounded-full mb-6">{t.hero.badge}</span>
          </FadeIn>
          <FadeIn delay={100}>
            <h1 className="text-6xl md:text-8xl font-black tracking-tight mb-4">
              <span className="text-white">{t.hero.title}</span>{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400">{t.hero.titleAccent}</span>
            </h1>
          </FadeIn>
          <FadeIn delay={200}>
            <p className="text-xl md:text-2xl text-yellow-400/90 font-medium max-w-3xl mb-6">{t.hero.subtitle}</p>
          </FadeIn>
          <FadeIn delay={300}>
            <p className="text-gray-300/80 text-base max-w-2xl mb-8 leading-relaxed">{t.hero.description}</p>
          </FadeIn>
          <FadeIn delay={400}>
            <div className="flex flex-wrap gap-4 mb-10">
              {t.hero.stats.map((s: any, i: number) => (
                <div key={i} className="bg-white/5 border border-white/10 rounded-xl px-5 py-3 text-center">
                  <div className="text-2xl font-black text-cyan-400">{s.number}</div>
                  <div className="text-xs text-gray-400">{s.label}</div>
                </div>
              ))}
            </div>
          </FadeIn>
          <FadeIn delay={500}>
            <button
              onClick={() => setShowExplorer(true)}
              className="inline-block bg-gradient-to-r from-cyan-500 to-emerald-500 text-black font-bold px-8 py-3 rounded-full text-lg hover:scale-105 transition-transform cursor-pointer"
            >
              {t.hero.cta}
            </button>
          </FadeIn>
        </div>
      </section>

      {/* Concept Section */}
      <section id="concept" className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <FadeIn>
            <span className="inline-block bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 text-xs font-bold px-4 py-1.5 rounded-full mb-4">{t.concept.badge}</span>
            <h2 className="text-4xl md:text-5xl font-black mb-4">{t.concept.title}</h2>
            <p className="text-gray-400 text-lg max-w-3xl mb-12">{t.concept.subtitle}</p>
          </FadeIn>
          <div className="grid md:grid-cols-2 gap-6">
            {t.concept.cards.map((card: any, i: number) => (
              <FadeIn key={i} delay={i * 100}>
                <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-2xl p-6 hover:border-cyan-500/30 transition-colors h-full">
                  <div className="text-3xl mb-3">{card.icon}</div>
                  <h3 className="text-xl font-bold text-white mb-2">{card.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed mb-3">{card.description}</p>
                  <PromptDisplay prompt={card.prompt} xp={card.xp} />
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Family World Section */}
      <section className="py-24 px-4 relative">
        <div className="absolute inset-0 opacity-15">
          <img src={IMAGES.familyWorld} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A] via-transparent to-[#0A0A0A]" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto">
          <FadeIn>
            <span className="inline-block bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold px-4 py-1.5 rounded-full mb-4">{t.familyWorld.badge}</span>
            <h2 className="text-4xl md:text-5xl font-black mb-4">{t.familyWorld.title}</h2>
            <p className="text-gray-400 text-lg max-w-3xl mb-12">{t.familyWorld.subtitle}</p>
          </FadeIn>
          <div className="grid md:grid-cols-3 gap-5">
            {t.familyWorld.rooms.map((room: any, i: number) => (
              <FadeIn key={i} delay={i * 80}>
                <div
                  className="bg-[#0A0A0A]/80 backdrop-blur border border-white/10 rounded-xl p-5 hover:border-emerald-500/30 transition-colors h-full cursor-pointer group"
                  onClick={() => setShowConstruction(true)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl">{room.icon}</span>
                    <span className="text-[9px] font-bold text-yellow-400 bg-yellow-400/10 px-2 py-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                      <Construction className="w-3 h-3" />
                      {tl(lang as PRDLanguage, { es: 'Próximamente', en: 'Coming Soon', zh: '即将推出', 'pt-BR': 'Próximamente', 'pt-PT': 'Próximamente' })}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{room.name}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed mb-3">{room.desc}</p>
                  <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-lg p-2">
                    <p className="text-emerald-300/70 text-[10px] font-mono">{room.prompt}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Robbery System Section */}
      <section className="py-24 px-4 bg-gradient-to-b from-red-900/5 to-transparent">
        <div className="max-w-7xl mx-auto">
          <FadeIn>
            <span className="inline-block bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-bold px-4 py-1.5 rounded-full mb-4">{t.robbery.badge}</span>
            <h2 className="text-4xl md:text-5xl font-black mb-4">{t.robbery.title}</h2>
            <p className="text-gray-400 text-lg max-w-3xl mb-12">{t.robbery.subtitle}</p>
          </FadeIn>
          <div className="grid md:grid-cols-2 gap-8">
            {/* Attack Mode */}
            <FadeIn delay={100}>
              <div className="bg-gradient-to-br from-red-500/10 to-orange-500/5 border border-red-500/20 rounded-2xl p-6">
                <h3 className="text-2xl font-black text-red-400 mb-2">{t.robbery.attack.title}</h3>
                <p className="text-gray-400 text-sm mb-5">{t.robbery.attack.desc}</p>
                <div className="space-y-3 mb-5">
                  {t.robbery.attack.steps.map((s: any, i: number) => (
                    <div key={i} className="flex items-start gap-3">
                      <span className="bg-red-500/20 text-red-400 text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center shrink-0">{s.step}</span>
                      <p className="text-gray-300 text-sm">{s.text}</p>
                    </div>
                  ))}
                </div>
                <PromptDisplay prompt={t.robbery.attack.examplePrompt} />
              </div>
            </FadeIn>
            {/* Defense Mode */}
            <FadeIn delay={200}>
              <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/5 border border-blue-500/20 rounded-2xl p-6">
                <h3 className="text-2xl font-black text-blue-400 mb-2">{t.robbery.defense.title}</h3>
                <p className="text-gray-400 text-sm mb-5">{t.robbery.defense.desc}</p>
                <div className="space-y-3 mb-5">
                  {t.robbery.defense.steps.map((s: any, i: number) => (
                    <div key={i} className="flex items-start gap-3">
                      <span className="bg-blue-500/20 text-blue-400 text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center shrink-0">{s.step}</span>
                      <p className="text-gray-300 text-sm">{s.text}</p>
                    </div>
                  ))}
                </div>
                <PromptDisplay prompt={t.robbery.defense.examplePrompt} />
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Friends World Section */}
      <section className="py-24 px-4 relative">
        <div className="absolute inset-0 opacity-10">
          <img src={IMAGES.friendsWorld} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A] via-transparent to-[#0A0A0A]" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto">
          <FadeIn>
            <span className="inline-block bg-purple-500/10 border border-purple-500/30 text-purple-400 text-xs font-bold px-4 py-1.5 rounded-full mb-4">{t.friendsWorld.badge}</span>
            <h2 className="text-4xl md:text-5xl font-black mb-4">{t.friendsWorld.title}</h2>
            <p className="text-gray-400 text-lg max-w-3xl mb-12">{t.friendsWorld.subtitle}</p>
          </FadeIn>
          <div className="grid md:grid-cols-3 gap-5">
            {t.friendsWorld.features.map((f: any, i: number) => (
              <FadeIn key={i} delay={i * 80}>
                <div
                  className="bg-[#0A0A0A]/80 backdrop-blur border border-white/10 rounded-xl p-5 hover:border-purple-500/30 transition-colors h-full cursor-pointer"
                  onClick={() => setShowConstruction(true)}
                >
                  <div className="text-2xl mb-2">{f.icon}</div>
                  <h3 className="text-lg font-bold text-white mb-2">{f.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Activities Section */}
      <section className="py-24 px-4 relative">
        <div className="absolute inset-0 opacity-10">
          <img src={IMAGES.activities} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A] via-transparent to-[#0A0A0A]" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto">
          <FadeIn>
            <span className="inline-block bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold px-4 py-1.5 rounded-full mb-4">{t.activities.badge}</span>
            <h2 className="text-4xl md:text-5xl font-black mb-4">{t.activities.title}</h2>
            <p className="text-gray-400 text-lg max-w-3xl mb-12">{t.activities.subtitle}</p>
          </FadeIn>
          <div className="grid md:grid-cols-3 gap-5">
            {t.activities.list.map((a: any, i: number) => (
              <FadeIn key={i} delay={i * 80}>
                <div
                  className="bg-[#0A0A0A]/80 backdrop-blur border border-white/10 rounded-xl p-5 hover:border-cyan-500/30 transition-colors h-full cursor-pointer"
                  onClick={() => setShowConstruction(true)}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-2xl">{a.icon}</span>
                    <span className="text-yellow-400 text-xs font-bold bg-yellow-400/10 px-2 py-0.5 rounded-full">{a.xp}</span>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{a.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{a.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Connection Section */}
      <section className="py-24 px-4 relative">
        <div className="absolute inset-0 opacity-20">
          <img src={IMAGES.connection} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A] via-transparent to-[#0A0A0A]" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto">
          <FadeIn>
            <span className="inline-block bg-pink-500/10 border border-pink-500/30 text-pink-400 text-xs font-bold px-4 py-1.5 rounded-full mb-4">{t.connection.badge}</span>
            <h2 className="text-4xl md:text-5xl font-black mb-4">{t.connection.title}</h2>
            <p className="text-gray-400 text-lg max-w-3xl mb-6">{t.connection.subtitle}</p>
          </FadeIn>
          <FadeIn delay={100}>
            <blockquote className="bg-gradient-to-r from-cyan-500/10 to-pink-500/10 border-l-4 border-cyan-400 rounded-r-xl p-6 mb-12 max-w-3xl">
              <p className="text-cyan-100 text-lg italic leading-relaxed">{t.connection.quote}</p>
            </blockquote>
          </FadeIn>
          <div className="grid md:grid-cols-2 gap-6">
            {t.connection.scenarios.map((s: any, i: number) => (
              <FadeIn key={i} delay={i * 100}>
                <div className="bg-[#0A0A0A]/80 backdrop-blur border border-white/10 rounded-xl p-6 hover:border-pink-500/30 transition-colors">
                  <div className="text-3xl mb-3">{s.emoji}</div>
                  <h3 className="text-xl font-bold text-white mb-2">{s.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{s.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Economy Section */}
      <section className="py-24 px-4">
        <div className="max-w-4xl mx-auto">
          <FadeIn>
            <h2 className="text-4xl md:text-5xl font-black mb-2 text-center">{t.economy.title}</h2>
            <p className="text-gray-400 text-lg text-center mb-12">{t.economy.subtitle}</p>
          </FadeIn>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {t.economy.items.map((item: any, i: number) => (
              <FadeIn key={i} delay={i * 60}>
                <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center hover:border-yellow-500/30 transition-colors">
                  <div className="text-2xl mb-2">{item.icon}</div>
                  <p className="text-white text-sm font-bold mb-1">{item.action}</p>
                  <p className="text-yellow-400 text-lg font-black">{item.coins}</p>
                  <p className="text-gray-500 text-xs">{item.detail}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent">
        <div className="max-w-3xl mx-auto text-center">
          <FadeIn>
            <h2 className="text-4xl md:text-5xl font-black mb-4">{t.cta.title}</h2>
            <p className="text-gray-400 text-lg mb-8">{t.cta.subtitle}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => setShowExplorer(true)}
                className="bg-gradient-to-r from-cyan-500 to-emerald-500 text-black font-bold px-8 py-3 rounded-full text-lg hover:scale-105 transition-transform cursor-pointer"
              >
                {t.cta.button}
              </button>
              <Link href="/raids" className="bg-white/5 border border-yellow-500/30 text-yellow-400 font-bold px-8 py-3 rounded-full text-lg hover:bg-yellow-500/10 transition-colors inline-block">
                {t.cta.secondary}
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-white/5">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-gray-600 text-xs">LINCE® — ACNB IA SL — {new Date().getFullYear()}</p>
        </div>
      </footer>

      {/* Room Explorer Modal */}
      {showExplorer && <RoomExplorer lang={lang} onClose={() => setShowExplorer(false)} />}

      {/* Under Construction Modal */}
      <UnderConstructionModal open={showConstruction} onClose={() => setShowConstruction(false)} lang={lang} />
    </div>
  );
}

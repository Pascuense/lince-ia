import { useLocation, Link } from "wouter";
import { AVATAR_FRONTAL } from "@/lib/avatarConstants";

const T: Record<string, Record<string, string>> = {
  es: {
    title: "404",
    subtitle: "Ups... esta ruta no existe",
    description: "Parece que te has perdido en el Mundo LINCE. Esta página no existe o ha sido movida.",
    goHome: "Volver al Inicio",
    goPlay: "Ir a Jugar",
    goExplore: "Explorar el Mundo",
    avatarSays: "¡Ey! Aquí no hay nada... pero hay mucho por descubrir en LINCE.",
  },
  en: {
    title: "404",
    subtitle: "Oops... this page doesn't exist",
    description: "Looks like you got lost in the LINCE World. This page doesn't exist or has been moved.",
    goHome: "Go Home",
    goPlay: "Play Now",
    goExplore: "Explore the World",
    avatarSays: "Hey! Nothing here... but there's a lot to discover in LINCE.",
  },
  zh: {
    title: "404",
    subtitle: "哎呀...这个页面不存在",
    description: "看起来你在LINCE世界中迷路了。这个页面不存在或已被移动。",
    goHome: "返回首页",
    goPlay: "去玩",
    goExplore: "探索世界",
    avatarSays: "嘿！这里什么都没有...但LINCE有很多东西等你发现。",
  },
};

export default function NotFound() {
  const [, setLocation] = useLocation();

  // Detect language from localStorage
  const stored = typeof window !== "undefined" ? localStorage.getItem("lince-user") : null;
  let lang = "es";
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      if (parsed.language && T[parsed.language]) lang = parsed.language;
    } catch { /* default es */ }
  }
  const t = T[lang] || T.es;

  return (
    <div className="min-h-screen bg-[oklch(0.10_0.01_240)] text-white flex items-center justify-center p-4">
      <div className="max-w-lg w-full text-center">
        {/* Avatar */}
        <div className="relative inline-block mb-6">
          <div className="w-28 h-28 rounded-2xl overflow-hidden border-2 border-[oklch(0.82_0.15_195)]/40 shadow-[0_0_30px_oklch(0.82_0.15_195/0.2)] mx-auto">
            <img
              src={AVATAR_FRONTAL.PEQUELIN}
              alt="PEQUELIN"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute -top-2 -right-2 w-10 h-10 bg-red-500 rounded-full flex items-center justify-center text-white font-black text-sm border-2 border-[oklch(0.10_0.01_240)]">
            ?!
          </div>
        </div>

        {/* Title */}
        <h1 className="text-7xl sm:text-8xl font-black mb-3">
          <span className="bg-gradient-to-r from-[oklch(0.82_0.15_195)] to-red-400 bg-clip-text text-transparent">
            {t.title}
          </span>
        </h1>
        <h2 className="text-xl sm:text-2xl font-bold text-white mb-3">
          {t.subtitle}
        </h2>
        <p className="text-gray-400 text-sm sm:text-base mb-4 max-w-md mx-auto leading-relaxed">
          {t.description}
        </p>

        {/* Avatar speech bubble */}
        <div className="bg-[oklch(0.14_0.015_240)] border border-[oklch(0.82_0.15_195)]/20 rounded-xl p-4 mb-8 max-w-sm mx-auto relative">
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-[oklch(0.14_0.015_240)] border-l border-t border-[oklch(0.82_0.15_195)]/20 rotate-45" />
          <p className="text-gray-300 text-sm italic">"{t.avatarSays}"</p>
          <p className="text-[oklch(0.82_0.15_195)] text-xs font-bold mt-1">— PEQUELIN</p>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="px-6 py-3 bg-gradient-to-r from-[oklch(0.82_0.15_195)] to-emerald-500 text-black font-black rounded-xl hover:brightness-110 transition-all shadow-[0_0_20px_oklch(0.82_0.15_195/0.3)] text-sm"
          >
            {t.goHome}
          </Link>
          <Link
            href="/jugar"
            className="px-6 py-3 bg-white/10 border border-white/20 text-white font-bold rounded-xl hover:bg-white/20 transition-all text-sm"
          >
            {t.goPlay}
          </Link>
          <Link
            href="/mundo"
            className="px-6 py-3 bg-white/5 border border-white/10 text-gray-300 font-medium rounded-xl hover:bg-white/10 transition-all text-sm"
          >
            {t.goExplore}
          </Link>
        </div>

        {/* Footer */}
        <p className="text-gray-600 text-xs mt-10">
          LINCE &copy; 2024-2026 ACNB IA SL
        </p>
      </div>
    </div>
  );
}

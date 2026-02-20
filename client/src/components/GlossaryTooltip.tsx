import { useState, useRef, useEffect, type ReactNode } from "react";
import { usePRDLanguage } from "@/contexts/PRDLanguageContext";

/* ─── Glossary definitions (ES / EN / ZH) ─── */
const GLOSSARY: Record<string, Record<string, { title: string; desc: string; icon: string }>> = {
  prompt: {
    es: { title: "Prompt", desc: "Una instrucción que le escribes a la IA. Cuanto mejor la escribas, mejor resultado obtienes. ¡Es como un hechizo mágico!", icon: "✍️" },
    en: { title: "Prompt", desc: "An instruction you write to the AI. The better you write it, the better the result. It's like a magic spell!", icon: "✍️" },
    zh: { title: "提示词", desc: "你写给AI的指令。写得越好，结果越好。就像魔法咒语！", icon: "✍️" },
  },
  raid: {
    es: { title: "Raid", desc: "Un asalto a la casa de otro jugador. Escribes prompts de ataque para robar LinceCoins y recursos. ¡El mejor prompt gana!", icon: "⚔️" },
    en: { title: "Raid", desc: "An assault on another player's house. You write attack prompts to steal LinceCoins and resources. The best prompt wins!", icon: "⚔️" },
    zh: { title: "突袭", desc: "对其他玩家房屋的攻击。你写攻击提示词来偷取LinceCoins和资源。最好的提示词获胜！", icon: "⚔️" },
  },
  lincecoins: {
    es: { title: "LinceCoins", desc: "La moneda virtual del juego. Las ganas escribiendo prompts, completando misiones, ganando raids y estudiando en la Academia.", icon: "💰" },
    en: { title: "LinceCoins", desc: "The in-game virtual currency. You earn them by writing prompts, completing missions, winning raids, and studying at the Academy.", icon: "💰" },
    zh: { title: "LinceCoins", desc: "游戏中的虚拟货币。通过写提示词、完成任务、赢得突袭和在学院学习来获得。", icon: "💰" },
  },
  avatar: {
    es: { title: "Avatar", desc: "Tu personaje virtual en LINCE. Lo personalizas eligiendo generación, ropa, accesorios y mascota. ¡Sin límites de género ni edad!", icon: "👤" },
    en: { title: "Avatar", desc: "Your virtual character in LINCE. Customize it by choosing generation, clothes, accessories, and pet. No gender or age limits!", icon: "👤" },
    zh: { title: "头像", desc: "你在LINCE中的虚拟角色。通过选择世代、衣服、配饰和宠物来个性化。没有性别或年龄限制！", icon: "👤" },
  },
  mundo: {
    es: { title: "Mundo LINCE", desc: "Tu hogar virtual tipo Los Sims. Construyes habitaciones, decoras con prompts y vives con tu familia y amigos.", icon: "🌍" },
    en: { title: "World LINCE", desc: "Your Sims-like virtual home. Build rooms, decorate with prompts, and live with your family and friends.", icon: "🌍" },
    zh: { title: "LINCE世界", desc: "你的类似模拟人生的虚拟家园。建造房间，用提示词装饰，和家人朋友一起生活。", icon: "🌍" },
  },
  academia: {
    es: { title: "Academia LINCE", desc: "10 habitaciones de aprendizaje, cada una con un personaje guía que te enseña un área diferente de la IA.", icon: "🎓" },
    en: { title: "Academy LINCE", desc: "10 learning rooms, each with a guide character that teaches you a different area of AI.", icon: "🎓" },
    zh: { title: "LINCE学院", desc: "10个学习房间，每个都有一个引导角色教你AI的不同领域。", icon: "🎓" },
  },
  xp: {
    es: { title: "XP (Experiencia)", desc: "Puntos que ganas con cada acción. Cuantos más tengas, más alto es tu nivel y más cosas desbloqueas.", icon: "⭐" },
    en: { title: "XP (Experience)", desc: "Points you earn with every action. The more you have, the higher your level and the more you unlock.", icon: "⭐" },
    zh: { title: "XP（经验值）", desc: "每次操作获得的积分。积分越多，等级越高，解锁的内容越多。", icon: "⭐" },
  },
  racha: {
    es: { title: "Racha Diaria", desc: "Juega todos los días seguidos para mantener tu racha. Cada día consecutivo multiplica tus recompensas.", icon: "🔥" },
    en: { title: "Daily Streak", desc: "Play every day in a row to keep your streak. Each consecutive day multiplies your rewards.", icon: "🔥" },
    zh: { title: "每日连续", desc: "每天连续玩以保持你的连续记录。每个连续日都会增加你的奖励。", icon: "🔥" },
  },
  liga: {
    es: { title: "Liga Semanal", desc: "Compite con otros jugadores cada semana. Los mejores suben de liga (Bronce → Plata → Oro → Diamante → Lince).", icon: "🏆" },
    en: { title: "Weekly League", desc: "Compete with other players each week. The best move up (Bronze → Silver → Gold → Diamond → Lynx).", icon: "🏆" },
    zh: { title: "每周联赛", desc: "每周与其他玩家竞争。最好的晋级（青铜→白银→黄金→钻石→猞猁）。", icon: "🏆" },
  },
  ia: {
    es: { title: "IA (Inteligencia Artificial)", desc: "Tecnología que permite a las máquinas aprender y crear. En LINCE aprendes a comunicarte con ella escribiendo prompts.", icon: "🤖" },
    en: { title: "AI (Artificial Intelligence)", desc: "Technology that allows machines to learn and create. In LINCE you learn to communicate with it by writing prompts.", icon: "🤖" },
    zh: { title: "AI（人工智能）", desc: "让机器学习和创造的技术。在LINCE中，你通过写提示词学会与它交流。", icon: "🤖" },
  },
  pvp: {
    es: { title: "PvP (Jugador vs Jugador)", desc: "Modo de juego donde compites directamente contra otro jugador. En Raids, tus prompts luchan contra los suyos.", icon: "🎯" },
    en: { title: "PvP (Player vs Player)", desc: "Game mode where you compete directly against another player. In Raids, your prompts fight against theirs.", icon: "🎯" },
    zh: { title: "PvP（玩家对玩家）", desc: "直接与另一个玩家竞争的游戏模式。在突袭中，你的提示词与他们的对抗。", icon: "🎯" },
  },
  familialince: {
    es: { title: "Familia LINCE", desc: "Los 10 personajes guía del juego, cada uno experto en un área de la IA. Son tus profesores y mentores.", icon: "👨‍👩‍👧‍👦" },
    en: { title: "LINCE Family", desc: "The 10 guide characters of the game, each expert in an area of AI. They are your teachers and mentors.", icon: "👨‍👩‍👧‍👦" },
    zh: { title: "LINCE家族", desc: "游戏中的10个引导角色，每个都是AI某个领域的专家。他们是你的老师和导师。", icon: "👨‍👩‍👧‍👦" },
  },
};

export type GlossaryTerm = keyof typeof GLOSSARY;

/* ─── Tooltip Component ─── */
interface GlossaryTooltipProps {
  term: GlossaryTerm;
  children: ReactNode;
  /** Override display style: 'underline' (default) or 'highlight' */
  variant?: "underline" | "highlight";
}

export function GlossaryTooltip({ term, children, variant = "underline" }: GlossaryTooltipProps) {
  const { lang } = usePRDLanguage();
  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState<"top" | "bottom">("top");
  const triggerRef = useRef<HTMLSpanElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const entry = GLOSSARY[term]?.[lang] || GLOSSARY[term]?.es;
  if (!entry) return <>{children}</>;

  const show = () => {
    clearTimeout(timeoutRef.current);
    // Calculate position
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const spaceAbove = rect.top;
      setPosition(spaceAbove < 180 ? "bottom" : "top");
    }
    setVisible(true);
  };

  const hide = () => {
    timeoutRef.current = setTimeout(() => setVisible(false), 150);
  };

  const keepVisible = () => {
    clearTimeout(timeoutRef.current);
  };

  const baseClasses = variant === "highlight"
    ? "bg-[#00E5FF]/10 text-[#00E5FF] px-1 rounded cursor-help"
    : "border-b border-dashed border-[#00E5FF]/40 cursor-help";

  return (
    <span className="relative inline-block" onMouseEnter={show} onMouseLeave={hide} onFocus={show} onBlur={hide}>
      <span ref={triggerRef} className={`${baseClasses} transition-colors hover:border-[#00E5FF] hover:text-[#00E5FF]`} tabIndex={0} role="button" aria-describedby={`tooltip-${term}`}>
        {children}
      </span>

      {visible && (
        <div
          ref={tooltipRef}
          id={`tooltip-${term}`}
          role="tooltip"
          onMouseEnter={keepVisible}
          onMouseLeave={hide}
          className={`absolute z-[9999] w-72 sm:w-80 left-1/2 -translate-x-1/2 ${position === "top" ? "bottom-full mb-2" : "top-full mt-2"}`}
          style={{ animation: "tooltipFadeIn 0.2s ease-out" }}
        >
          <div className="bg-[#111111] border border-[#00E5FF]/30 rounded-xl p-4 shadow-[0_0_20px_rgba(0,229,255,0.15)]">
            {/* Arrow */}
            <div className={`absolute left-1/2 -translate-x-1/2 w-3 h-3 bg-[#111111] border-[#00E5FF]/30 rotate-45 ${position === "top" ? "-bottom-1.5 border-r border-b" : "-top-1.5 border-l border-t"}`} />

            {/* Content */}
            <div className="relative">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-lg">{entry.icon}</span>
                <span className="font-['Space_Grotesk'] font-bold text-[#00E5FF] text-sm">{entry.title}</span>
              </div>
              <p className="text-[#B0B0B0] text-xs leading-relaxed">{entry.desc}</p>
            </div>
          </div>
        </div>
      )}
    </span>
  );
}

/* ─── Helper: wrap known terms in a text string ─── */
export function useGlossaryTerms() {
  const { lang } = usePRDLanguage();
  return { glossary: GLOSSARY, lang };
}

export default GlossaryTooltip;

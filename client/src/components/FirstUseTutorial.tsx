import { useState, useEffect, useCallback } from "react";

const LINCE_MASCOT = "https://files.manuscdn.com/user_upload_by_module/session_file/310419663032363896/bUKqcjlDiFJuymcE.png";

const TUTORIAL_KEY = "lince-tutorial-completed";

// ─── TUTORIAL STEPS ───
interface TutorialStep {
  id: string;
  title: string;
  description: string;
  targetSelector: string; // CSS selector for the element to highlight
  arrowDirection: "down" | "up" | "left" | "right";
  position: "top" | "bottom" | "center";
  mascotMessage: string;
}

const HOME_STEPS: TutorialStep[] = [
  {
    id: "welcome",
    title: "¡Bienvenido a LINCE IA!",
    description: "Soy LINCE, tu guía. Te voy a enseñar cómo funciona LINCE IA en 3 pasos muy fáciles.",
    targetSelector: "",
    arrowDirection: "down",
    position: "center",
    mascotMessage: "¡Hola! Soy LINCE. Vamos a aprender juntos.",
  },
  {
    id: "familia-card",
    title: "Paso 1: Ve a la Familia",
    description: "Haz clic en «Familia LINCE IA» para conocer a los 10 especialistas en IA que te van a enseñar. Cada uno sabe de un tema diferente.",
    targetSelector: '[data-tour="avatars"]',
    arrowDirection: "down",
    position: "top",
    mascotMessage: "¡Aquí empieza todo! Haz clic en Familia LINCE IA.",
  },
];

const CHAT_STEPS: TutorialStep[] = [
  {
    id: "choose-familiar",
    title: "Paso 2: Elige un familiar",
    description: "Mira la lista de familiares. Cada uno es especialista en un tema de IA. Haz clic en el que más te interese para ver su perfil.",
    targetSelector: '[data-tour="family-grid"]',
    arrowDirection: "down",
    position: "top",
    mascotMessage: "¡Elige al que más te llame la atención!",
  },
  {
    id: "start-chat",
    title: "Paso 3: ¡Pregúntale lo que quieras!",
    description: "Cuando veas el perfil del familiar, haz clic en «Empezar a chatear». Escribe cualquier pregunta sobre IA y él te responderá. ¡No hay preguntas tontas!",
    targetSelector: '[data-tour="chat-button"]',
    arrowDirection: "down",
    position: "top",
    mascotMessage: "¡Pregunta lo que sea! Aquí se aprende sin miedo.",
  },
];

// ─── ANIMATED ARROW COMPONENT ───
function AnimatedArrow({ direction }: { direction: "down" | "up" | "left" | "right" }) {
  const arrows: Record<string, React.ReactNode> = {
    down: (
      <svg width="48" height="64" viewBox="0 0 48 64" fill="none" className="animate-bounce-slow">
        <path d="M24 0V52M24 52L8 36M24 52L40 36" stroke="#00E5FF" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="24" cy="58" r="5" fill="#00E5FF" className="animate-pulse" />
      </svg>
    ),
    up: (
      <svg width="48" height="64" viewBox="0 0 48 64" fill="none" className="animate-bounce-slow">
        <path d="M24 64V12M24 12L8 28M24 12L40 28" stroke="#00E5FF" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="24" cy="6" r="5" fill="#00E5FF" className="animate-pulse" />
      </svg>
    ),
    left: (
      <svg width="64" height="48" viewBox="0 0 64 48" fill="none" className="animate-bounce-horizontal">
        <path d="M64 24H12M12 24L28 8M12 24L28 40" stroke="#00E5FF" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="6" cy="24" r="5" fill="#00E5FF" className="animate-pulse" />
      </svg>
    ),
    right: (
      <svg width="64" height="48" viewBox="0 0 64 48" fill="none" className="animate-bounce-horizontal">
        <path d="M0 24H52M52 24L36 8M52 24L36 40" stroke="#00E5FF" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="58" cy="24" r="5" fill="#00E5FF" className="animate-pulse" />
      </svg>
    ),
  };
  return arrows[direction] || arrows.down;
}

// ─── TUTORIAL OVERLAY ───
interface FirstUseTutorialProps {
  page: "home" | "chat";
  onComplete?: () => void;
}

export function FirstUseTutorial({ page, onComplete }: FirstUseTutorialProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [visible, setVisible] = useState(false);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);

  const steps = page === "home" ? HOME_STEPS : CHAT_STEPS;

  // Check if tutorial should show
  useEffect(() => {
    const completed = localStorage.getItem(TUTORIAL_KEY);
    if (!completed) {
      // Small delay so page renders first
      const timer = setTimeout(() => setVisible(true), 800);
      return () => clearTimeout(timer);
    }
  }, []);

  // Find and highlight target element
  useEffect(() => {
    if (!visible || !steps[currentStep]) return;
    const step = steps[currentStep];
    if (!step.targetSelector) {
      setTargetRect(null);
      return;
    }
    const el = document.querySelector(step.targetSelector);
    if (el) {
      const rect = el.getBoundingClientRect();
      setTargetRect(rect);
      // Scroll into view if needed
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    } else {
      setTargetRect(null);
    }
  }, [visible, currentStep, steps]);

  const handleNext = useCallback(() => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  }, [currentStep, steps.length]);

  const handleComplete = useCallback(() => {
    if (page === "home") {
      // Mark home tutorial as done, chat tutorial will show when they visit /chat
      localStorage.setItem(TUTORIAL_KEY + "-home", "true");
    } else {
      // Mark full tutorial as complete
      localStorage.setItem(TUTORIAL_KEY, "true");
    }
    setVisible(false);
    onComplete?.();
  }, [page, onComplete]);

  const handleSkip = useCallback(() => {
    localStorage.setItem(TUTORIAL_KEY, "true");
    setVisible(false);
    onComplete?.();
  }, [onComplete]);

  if (!visible) return null;

  const step = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;
  const isFirstStep = currentStep === 0;

  return (
    <div className="fixed inset-0 z-[9999]" style={{ pointerEvents: "auto" }}>
      {/* Dark overlay with cutout for target */}
      <div
        className="absolute inset-0 bg-black/70 transition-all duration-500"
        onClick={(e) => e.stopPropagation()}
      />

      {/* Highlight ring around target element */}
      {targetRect && (
        <div
          className="absolute z-[10000] rounded-2xl transition-all duration-500"
          style={{
            top: targetRect.top - 8,
            left: targetRect.left - 8,
            width: targetRect.width + 16,
            height: targetRect.height + 16,
            boxShadow: "0 0 0 4px #00E5FF, 0 0 30px rgba(0,229,255,0.5), 0 0 60px rgba(0,229,255,0.3), 0 0 9999px 9999px rgba(0,0,0,0.7)",
            pointerEvents: "none",
          }}
        />
      )}

      {/* Tutorial card */}
      <div
        className={`absolute z-[10001] w-[90vw] max-w-md transition-all duration-500 ${
          step.position === "center"
            ? "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            : step.position === "top"
            ? "top-8 left-1/2 -translate-x-1/2"
            : "bottom-8 left-1/2 -translate-x-1/2"
        }`}
      >
        {/* Arrow pointing to target */}
        {targetRect && step.position === "top" && (
          <div className="flex justify-center mb-2">
            <AnimatedArrow direction={step.arrowDirection} />
          </div>
        )}

        <div className="bg-gradient-to-br from-[#0d1a2a] to-[#0b1520] border-2 border-[#00E5FF]/40 rounded-3xl p-6 sm:p-8 shadow-2xl" style={{ boxShadow: "0 0 40px rgba(0,229,255,0.2), 0 20px 60px rgba(0,0,0,0.5)" }}>
          {/* Mascot + speech bubble */}
          <div className="flex items-start gap-4 mb-5">
            <div className="flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden border-3 border-[#00E5FF]/50" style={{ boxShadow: "0 0 20px rgba(0,229,255,0.3)" }}>
              <img src={LINCE_MASCOT} alt="LINCE" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 bg-[#00E5FF]/10 border border-[#00E5FF]/20 rounded-2xl rounded-tl-sm px-4 py-3">
              <p className="text-[#00E5FF] text-sm sm:text-base font-bold leading-relaxed">
                {step.mascotMessage}
              </p>
            </div>
          </div>

          {/* Step content */}
          <h3 className="font-['Space_Grotesk'] font-black text-xl sm:text-2xl text-white mb-3">
            {step.title}
          </h3>
          <p className="text-white/70 text-base sm:text-lg leading-relaxed mb-6">
            {step.description}
          </p>

          {/* Progress dots */}
          <div className="flex items-center justify-center gap-2 mb-5">
            {steps.map((_, i) => (
              <div
                key={i}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  i === currentStep
                    ? "bg-[#00E5FF] scale-125"
                    : i < currentStep
                    ? "bg-[#00E5FF]/40"
                    : "bg-white/20"
                }`}
              />
            ))}
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-between gap-3">
            <button
              onClick={handleSkip}
              className="px-5 py-3 text-white/50 hover:text-white text-sm font-medium transition-colors rounded-xl hover:bg-white/5"
            >
              Saltar tutorial
            </button>
            <div className="flex items-center gap-2">
              {!isFirstStep && (
                <button
                  onClick={() => setCurrentStep(currentStep - 1)}
                  className="px-5 py-3 text-white/70 hover:text-white text-sm font-bold transition-colors rounded-xl hover:bg-white/5 border border-white/10"
                >
                  Anterior
                </button>
              )}
              <button
                onClick={handleNext}
                className="px-6 sm:px-8 py-3 bg-gradient-to-r from-[#00E5FF] to-[#00b8d4] text-black font-black text-sm sm:text-base rounded-xl hover:brightness-110 transition-all shadow-lg"
                style={{ boxShadow: "0 4px 20px rgba(0,229,255,0.3)" }}
              >
                {isLastStep ? (page === "home" ? "¡Ir a la Familia LINCE IA!" : "¡Entendido!") : "Siguiente"}
              </button>
            </div>
          </div>
        </div>

        {/* Arrow pointing to target (bottom position) */}
        {targetRect && step.position === "bottom" && (
          <div className="flex justify-center mt-2">
            <AnimatedArrow direction="up" />
          </div>
        )}
      </div>

      {/* Custom animations */}
      <style>{`
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-12px); }
        }
        @keyframes bounce-horizontal {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(-12px); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 1.5s ease-in-out infinite;
        }
        .animate-bounce-horizontal {
          animation: bounce-horizontal 1.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

// ─── HELPER: Check if tutorial is completed ───
export function isTutorialCompleted(): boolean {
  return localStorage.getItem(TUTORIAL_KEY) === "true";
}

// ─── HELPER: Reset tutorial (for testing) ───
export function resetTutorial(): void {
  localStorage.removeItem(TUTORIAL_KEY);
  localStorage.removeItem(TUTORIAL_KEY + "-home");
}

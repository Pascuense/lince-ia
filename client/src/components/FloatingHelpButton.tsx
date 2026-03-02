import { useState, useEffect } from "react";

/**
 * PASO 6: Floating help button (?) — green #00FF88
 * Shows contextual help for the current page section.
 * Appears on all pages, positioned bottom-right above MobileBottomNav.
 */

const HELP_CONTENT: Record<string, { title: string; tips: string[] }> = {
  "/": {
    title: "Portada LINCE",
    tips: [
      "Desliza hacia abajo para ver todas las secciones.",
      "Toca los avatares para conocer a cada personaje.",
      "Usa la barra inferior para navegar rápidamente.",
    ],
  },
  "/jugar": {
    title: "Centro de Juego",
    tips: [
      "Elige un nivel para empezar a aprender IA.",
      "Completa lecciones para ganar LinceCoins.",
      "Reclama tu recompensa diaria cada 24 horas.",
    ],
  },
  "/personajes": {
    title: "Galería de Personajes",
    tips: [
      "Toca cualquier personaje para ver su ficha completa.",
      "Desde la ficha puedes iniciar un chat con el avatar.",
      "Cada personaje es experto en un área diferente de la IA.",
    ],
  },
  "/prompt-studio": {
    title: "Crear Imagen",
    tips: [
      "Rellena los 4 campos y la IA mejorará tu prompt.",
      "Prueba el modo Visual para generar imágenes con IA.",
      "Prueba el modo Profesional para crear prompts de texto.",
    ],
  },
  "/arsenal-ia": {
    title: "Herramientas IA",
    tips: [
      "Explora más de 60 herramientas de IA organizadas por categoría.",
      "Filtra por tipo: Chat, Imagen, Video, Audio, Código...",
      "Toca una herramienta para ver su guía paso a paso.",
    ],
  },
  "/catalogo-formativo": {
    title: "Todos los Cursos",
    tips: [
      "Más de 120 cursos de 7 horas cada uno.",
      "Filtra por categoría y nivel (Básico/Intermedio/Avanzado).",
      "Contacta para inscribirte en cualquier curso.",
    ],
  },
  "/como-jugar": {
    title: "Cómo Jugar",
    tips: [
      "Lee la guía completa antes de empezar.",
      "Cada avatar explica el juego adaptado a su audiencia.",
      "Consulta el manual de herramientas para sacar el máximo partido.",
    ],
  },
  "/mundo": {
    title: "Mundo LINCE",
    tips: [
      "Explora las diferentes regiones del mundo LINCE.",
      "Cada zona tiene misiones y desafíos únicos.",
      "Completa misiones para desbloquear nuevas áreas.",
    ],
  },
  "/raids": {
    title: "LINCE Batallas",
    tips: [
      "Los raids son desafíos cooperativos en equipo.",
      "Forma equipo con otros jugadores para completar misiones.",
      "Las recompensas son mayores cuanto más difícil sea el raid.",
    ],
  },
};

export function FloatingHelpButton() {
  const [open, setOpen] = useState(false);
  const [path, setPath] = useState(window.location.pathname);

  useEffect(() => {
    const onPop = () => setPath(window.location.pathname);
    window.addEventListener("popstate", onPop);
    // Also listen for pushState/replaceState
    const origPush = history.pushState.bind(history);
    const origReplace = history.replaceState.bind(history);
    history.pushState = (...args) => { origPush(...args); setPath(window.location.pathname); };
    history.replaceState = (...args) => { origReplace(...args); setPath(window.location.pathname); };
    return () => {
      window.removeEventListener("popstate", onPop);
      history.pushState = origPush;
      history.replaceState = origReplace;
    };
  }, []);

  // Find best matching help content
  const helpKey = Object.keys(HELP_CONTENT)
    .filter((k) => path.startsWith(k))
    .sort((a, b) => b.length - a.length)[0] || "/";
  const help = HELP_CONTENT[helpKey] || HELP_CONTENT["/"];

  return (
    <>
      {/* Floating ? button */}
      <button
        onClick={() => setOpen(!open)}
        aria-label="Ayuda contextual"
        className="fixed bottom-24 right-4 z-40 w-12 h-12 rounded-full flex items-center justify-center text-black font-bold text-xl shadow-lg transition-all duration-200 active:scale-90 md:bottom-6"
        style={{
          backgroundColor: "#00FF88",
          boxShadow: "0 0 20px rgba(0,255,136,0.4), 0 4px 12px rgba(0,0,0,0.3)",
        }}
      >
        ?
      </button>

      {/* Help panel */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4" onClick={() => setOpen(false)}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div
            className="relative bg-[#111111] border border-[#00FF88]/30 rounded-2xl w-full max-w-sm p-6 mb-20 sm:mb-0"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="Panel de ayuda"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-[#00FF88] flex items-center justify-center text-black font-bold text-sm">?</span>
                <h3 className="font-['Space_Grotesk'] font-bold text-lg text-white">{help.title}</h3>
              </div>
              <button
                onClick={() => setOpen(false)}
                aria-label="Cerrar ayuda"
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/60 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>
            <ul className="space-y-3">
              {help.tips.map((tip, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-[#00FF88]/20 text-[#00FF88] flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <span className="text-white/80 text-sm leading-relaxed">{tip}</span>
                </li>
              ))}
            </ul>
            <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
              <a
                href="/como-jugar"
                className="text-[#00FF88] text-xs font-medium hover:underline"
                onClick={() => setOpen(false)}
              >
                Ver guía completa →
              </a>
              <button
                onClick={() => {
                  setOpen(false);
                  localStorage.removeItem("lince-onboarding-completed");
                  localStorage.setItem("lince-needs-onboarding", "true");
                  window.location.reload();
                }}
                className="text-[#00E5FF] text-xs font-medium hover:underline"
              >
                Repetir tour ↻
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

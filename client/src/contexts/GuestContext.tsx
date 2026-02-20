import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";

// ═══════════════════════════════════════════════════════════════
// LINCE GUEST MODE — 20 pruebas sin registro
// ═══════════════════════════════════════════════════════════════
// Acciones que CONSUMEN 1 prueba:
//   - Abrir chat con un avatar (1 por conversación nueva)
//   - Usar IMAGELIN (1 por prompt generado)
//   - Crear un Lincelin (1 por generación)
//   - Usar Prompt Profesional (1 por uso)
//
// Acceso LIBRE (no consume):
//   - Ver galería de Personajes (navegar, filtrar)
//   - Ver Arsenal IA (catálogo de herramientas)
//   - Ver Cómo Jugar (tutorial)
//   - Ver Aviso Legal
//   - Ver Home/Landing
//
// BLOQUEADO siempre sin registro:
//   - Jugar niveles (requiere nombre de usuario)
//   - Perfil / Recompensas
//   - Panel admin
//   - Historial de prompts (no hay usuario)
//   - Galería de imágenes guardadas
// ═══════════════════════════════════════════════════════════════

const GUEST_STORAGE_KEY = "lince-guest-trials";
const GUEST_FINGERPRINT_KEY = "lince-guest-fp";
const MAX_TRIALS = 20;

export type TrialAction = "chat" | "prompt_studio" | "prompt_profesional" | "lincelin";

interface TrialRecord {
  action: TrialAction;
  timestamp: number;
  detail?: string; // e.g., avatar key or prompt subject
}

interface GuestState {
  trialsUsed: number;
  trialsRemaining: number;
  history: TrialRecord[];
  fingerprint: string;
  firstVisit: number;
}

interface GuestContextType {
  isGuest: boolean;
  trialsUsed: number;
  trialsRemaining: number;
  maxTrials: number;
  trialHistory: TrialRecord[];
  /** Try to consume a trial. Returns true if allowed, false if exhausted. */
  consumeTrial: (action: TrialAction, detail?: string) => boolean;
  /** Check if trials are available without consuming */
  canUseTrial: () => boolean;
  /** Show the conversion modal */
  showConversionModal: boolean;
  setShowConversionModal: (show: boolean) => void;
  /** Reset guest state (for testing) */
  resetGuest: () => void;
}

const GuestContext = createContext<GuestContextType | null>(null);

// Generate a simple fingerprint for the browser
function generateFingerprint(): string {
  const nav = window.navigator;
  const screen = window.screen;
  const raw = [
    nav.userAgent,
    nav.language,
    screen.width,
    screen.height,
    screen.colorDepth,
    new Date().getTimezoneOffset(),
    nav.hardwareConcurrency || 0,
  ].join("|");
  // Simple hash
  let hash = 0;
  for (let i = 0; i < raw.length; i++) {
    const char = raw.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return "guest_" + Math.abs(hash).toString(36);
}

function loadGuestState(): GuestState {
  try {
    const saved = localStorage.getItem(GUEST_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        trialsUsed: parsed.trialsUsed || 0,
        trialsRemaining: Math.max(0, MAX_TRIALS - (parsed.trialsUsed || 0)),
        history: parsed.history || [],
        fingerprint: parsed.fingerprint || generateFingerprint(),
        firstVisit: parsed.firstVisit || Date.now(),
      };
    }
  } catch { /* ignore */ }

  const fp = (() => {
    try {
      const saved = localStorage.getItem(GUEST_FINGERPRINT_KEY);
      if (saved) return saved;
    } catch { /* ignore */ }
    return generateFingerprint();
  })();

  return {
    trialsUsed: 0,
    trialsRemaining: MAX_TRIALS,
    history: [],
    fingerprint: fp,
    firstVisit: Date.now(),
  };
}

function saveGuestState(state: GuestState) {
  try {
    localStorage.setItem(GUEST_STORAGE_KEY, JSON.stringify(state));
    localStorage.setItem(GUEST_FINGERPRINT_KEY, state.fingerprint);
  } catch { /* ignore */ }
}

export function GuestProvider({ children }: { children: ReactNode }) {
  const [guestState, setGuestState] = useState<GuestState>(loadGuestState);
  const [showConversionModal, setShowConversionModal] = useState(false);

  // Check if user is a guest (not logged in)
  const isGuest = (() => {
    try {
      return !localStorage.getItem("lince-user");
    } catch {
      return true;
    }
  })();

  // Persist on change
  useEffect(() => {
    if (isGuest) {
      saveGuestState(guestState);
    }
  }, [guestState, isGuest]);

  const canUseTrial = useCallback(() => {
    return guestState.trialsUsed < MAX_TRIALS;
  }, [guestState.trialsUsed]);

  const consumeTrial = useCallback((action: TrialAction, detail?: string): boolean => {
    if (guestState.trialsUsed >= MAX_TRIALS) {
      setShowConversionModal(true);
      return false;
    }

    const record: TrialRecord = {
      action,
      timestamp: Date.now(),
      detail,
    };

    setGuestState(prev => {
      const newUsed = prev.trialsUsed + 1;
      const newState = {
        ...prev,
        trialsUsed: newUsed,
        trialsRemaining: Math.max(0, MAX_TRIALS - newUsed),
        history: [...prev.history, record],
      };
      return newState;
    });

    return true;
  }, [guestState.trialsUsed]);

  const resetGuest = useCallback(() => {
    const fresh: GuestState = {
      trialsUsed: 0,
      trialsRemaining: MAX_TRIALS,
      history: [],
      fingerprint: guestState.fingerprint,
      firstVisit: guestState.firstVisit,
    };
    setGuestState(fresh);
    saveGuestState(fresh);
  }, [guestState.fingerprint, guestState.firstVisit]);

  return (
    <GuestContext.Provider
      value={{
        isGuest,
        trialsUsed: guestState.trialsUsed,
        trialsRemaining: guestState.trialsRemaining,
        maxTrials: MAX_TRIALS,
        trialHistory: guestState.history,
        consumeTrial,
        canUseTrial,
        showConversionModal,
        setShowConversionModal,
        resetGuest,
      }}
    >
      {children}
    </GuestContext.Provider>
  );
}

export function useGuest() {
  const ctx = useContext(GuestContext);
  if (!ctx) throw new Error("useGuest must be used within GuestProvider");
  return ctx;
}

import { lazy, Suspense, useState, useEffect, useCallback } from "react";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Route, Switch, Redirect } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { GameProvider } from "./contexts/GameContext";
import { PRDLanguageProvider } from "./contexts/PRDLanguageContext";
import { GuestProvider } from "./contexts/GuestContext";
import { PWAInstallBanner } from "./components/PWAInstallBanner";
import { OfflineSyncIndicator } from "./components/OfflineSyncIndicator";
import { CookieBanner } from "./components/CookieBanner";
import { BetaBanner } from "./components/BetaBanner";
import { UnlockCelebration } from "./components/UnlockCelebration";
import { GlobalFooter } from "./components/GlobalFooter";
import { LincelinFAB } from "./components/LincelinFAB";
import { MobileBottomNav } from "./components/MobileBottomNav";
import { GuestTrialBadge } from "./components/GuestTrialBadge";
import { ConversionModal } from "./components/ConversionModal";
import { useSwipeBack } from "./hooks/useSwipeBack";
import { RouteGuard } from "./components/RouteGuard";
import { OnboardingTour } from "./components/OnboardingTour";
import { StreakRiskNotification } from "./components/StreakRiskNotification";
import { NotificationPrompt } from "./components/NotificationPrompt";
import { NotificationScheduler } from "./components/NotificationScheduler";
import { useGame } from "./contexts/GameContext";
import { usePRDLanguage } from "./contexts/PRDLanguageContext";
import { isAdminUser } from "./lib/accessControl";

// ─── Critical pages: loaded eagerly (needed immediately) ───
import Register from "./pages/Register";
import Login from "./pages/Login";
import NotFound from "@/pages/NotFound";

// ─── Lazy-loaded pages: split into separate chunks for performance ───
// Public
const Home = lazy(() => import("./pages/Home"));
const AvisoLegal = lazy(() => import("./pages/AvisoLegal"));
const ComoJugar = lazy(() => import("./pages/ComoJugar"));
const MundoArtista = lazy(() => import("./pages/MundoArtista"));

// Tutorial & Onboarding
const Tutorial = lazy(() => import("./pages/Tutorial"));
const Bienvenida = lazy(() => import("./pages/Bienvenida"));

// Game Hub & Levels
const GameHub = lazy(() => import("./pages/GameHub"));
const Nivel1 = lazy(() => import("./pages/Nivel1"));
const Nivel2 = lazy(() => import("./pages/Nivel2"));
const Nivel3 = lazy(() => import("./pages/Nivel3"));
const DailyRewards = lazy(() => import("./pages/DailyRewards"));
const MiPerfil = lazy(() => import("./pages/MiPerfil"));

// Content & Tools
const Personajes = lazy(() => import("./pages/Personajes"));
const MundoLince = lazy(() => import("./pages/MundoLince"));
const LinceRaids = lazy(() => import("./pages/LinceRaids"));
const AcademiaLince = lazy(() => import("./pages/AcademiaLince"));
const ArsenalIA = lazy(() => import("./pages/ArsenalIA"));
const ArsenalIADetail = lazy(() => import("./pages/ArsenalIADetail"));
const CatalogoFormativo = lazy(() => import("./pages/CatalogoFormativo"));
const PromptStudio = lazy(() => import("./pages/PromptStudio"));
const PromptProfesional = lazy(() => import("./pages/PromptProfesional"));
const PromptHistory = lazy(() => import("./pages/PromptHistory"));
const CourseBuilder = lazy(() => import("./pages/CourseBuilder"));
const Galeria = lazy(() => import("./pages/Galeria"));
const UserDashboard = lazy(() => import("./pages/UserDashboard"));
const AvatarCustomizer = lazy(() => import("./pages/AvatarCustomizer"));
const Changelog = lazy(() => import("./pages/Changelog"));
const PromptGame = lazy(() => import("./pages/PromptGame"));
const RaidsBattle = lazy(() => import("./pages/RaidsBattle"));
const GuiaBase44 = lazy(() => import("./pages/GuiaBase44"));
const CreaTuLincelin = lazy(() => import("./pages/CreaTuLincelin"));

// Public Profile
const PublicProfile = lazy(() => import("./pages/PublicProfile"));

// Retention systems
const Mercado = lazy(() => import("./pages/Mercado"));
const RetoDiario = lazy(() => import("./pages/RetoDiario"));
const MapaProgresion = lazy(() => import("./pages/MapaProgresion"));

// Admin
const AdminPanel = lazy(() => import("./pages/AdminPanel"));

// ─── Loading fallback with LINCE branding ───
function PageLoader() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
      <div className="text-center">
        <div className="inline-flex items-center gap-1 mb-4">
          
          <span className="font-['Space_Grotesk'] font-bold text-2xl text-[#00E5FF]">LINCE</span>
        </div>
        <div className="flex items-center justify-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-[#00E5FF] animate-bounce" style={{ animationDelay: "0ms" }} />
          <div className="w-2 h-2 rounded-full bg-[#00E5FF] animate-bounce" style={{ animationDelay: "150ms" }} />
          <div className="w-2 h-2 rounded-full bg-[#00E5FF] animate-bounce" style={{ animationDelay: "300ms" }} />
        </div>
      </div>
    </div>
  );
}

/**
 * AllRoutes: TODAS las herramientas accesibles sin registro.
 * Solo las rutas admin-only se bloquean para usuarios no-admin.
 * El tutorial desbloquea JUGAR, pero no se requiere registro.
 */
function AllRoutes() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Switch>
        {/* ─── Home ─── */}
        <Route path={"/"} component={Home} />
        <Route path={"/home"} component={Home} />

        {/* ─── Registro/Login (solo para admin) ─── */}
        <Route path={"/login"} component={Login} />
        <Route path={"/registro"} component={Register} />

        {/* ─── Tutorial & Onboarding ─── */}
        <Route path={"/tutorial"} component={Tutorial} />
        <Route path={"/bienvenida"} component={Bienvenida} />

        {/* ─── CORE TOOLS: Accesibles para TODOS sin registro ─── */}
        {/* Arsenal IA */}
        <Route path={"/arsenal-ia"} component={ArsenalIA} />
        <Route path={"/arsenal-ia/:toolId"} component={ArsenalIADetail} />

        {/* IMAGELIN (Prompt Studio) */}
        <Route path={"/prompt-studio"} component={PromptStudio} />

        {/* PROMPTLIN (Juego competitivo de prompts) */}
        <Route path={"/promptear"} component={PromptGame} />

        {/* LINCELIN (Crea tu avatar) */}
        <Route path={"/lincelin"} component={CreaTuLincelin} />
        {/* Legacy redirect */}
        <Route path={"/crea-tu-lincelin"}>{() => <Redirect to="/lincelin" />}</Route>

        {/* Avatares */}
        <Route path={"/personajes"} component={Personajes} />

        {/* Juego de niveles */}
        <Route path={"/jugar"} component={GameHub} />
        <Route path={"/jugar/nivel-1"} component={Nivel1} />
        <Route path={"/jugar/nivel-2"} component={Nivel2} />
        <Route path={"/jugar/nivel-3"} component={Nivel3} />

        {/* Perfil y recompensas */}
        <Route path={"/perfil"} component={MiPerfil} />
        <Route path={"/perfil-publico"} component={PublicProfile} />
        <Route path={"/recompensas"} component={DailyRewards} />

        {/* Retention systems */}
        <Route path={"/mercado"} component={Mercado} />
        <Route path={"/reto-diario"} component={RetoDiario} />
        <Route path={"/progresion"} component={MapaProgresion} />

        {/* Legal & info */}
        <Route path={"/aviso-legal"} component={AvisoLegal} />
        <Route path={"/como-jugar"} component={ComoJugar} />
        <Route path={"/artista/:code"} component={MundoArtista} />
        <Route path={"/artista"} component={MundoArtista} />

        {/* ─── ADMIN ONLY: Solo cristobalalisteg@gmail.com y cristobal@acnb.es ─── */}
        <Route path={"/mundo"} component={MundoLince} />
        <Route path={"/raids"} component={LinceRaids} />
        <Route path={"/raids-batalla"} component={RaidsBattle} />
        <Route path={"/academia"} component={AcademiaLince} />
        <Route path={"/catalogo-formativo"} component={CatalogoFormativo} />
        <Route path={"/course-builder"} component={CourseBuilder} />
        <Route path={"/avatar-customizer"} component={AvatarCustomizer} />
        <Route path={"/mi-panel"} component={UserDashboard} />
        <Route path={"/changelog"} component={Changelog} />
        <Route path={"/admin"} component={AdminPanel} />
        <Route path={"/guia-base44"} component={GuiaBase44} />
        <Route path={"/prompt-profesional"} component={PromptProfesional} />
        <Route path={"/historial-prompts"} component={PromptHistory} />
        <Route path={"/galeria"} component={Galeria} />

        {/* ─── 404 ─── */}
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

const ONBOARDING_KEY = "lince-onboarding-completed";

function AppContent() {
  const { isLoggedIn } = useGame();
  const { lang } = usePRDLanguage();
  const [showOnboarding, setShowOnboarding] = useState(false);
  useSwipeBack(true); // Always enable swipe back for all users

  // Show onboarding for new users after first login
  useEffect(() => {
    if (!isLoggedIn) return;
    const completed = localStorage.getItem(ONBOARDING_KEY);
    const needsOnboarding = localStorage.getItem("lince-needs-onboarding");
    if (!completed && needsOnboarding === "true") {
      const timer = setTimeout(() => setShowOnboarding(true), 1500);
      return () => clearTimeout(timer);
    }
  }, [isLoggedIn]);

  const handleOnboardingComplete = useCallback(() => {
    setShowOnboarding(false);
    localStorage.setItem(ONBOARDING_KEY, "true");
    localStorage.removeItem("lince-needs-onboarding");
  }, []);

  return (
    <>
      <Toaster />
      <a href="#main-content" className="skip-to-content">Saltar al contenido</a>
      <CookieBanner />

      <PWAInstallBanner />
      <OfflineSyncIndicator />
      <div id="main-content" className="min-h-screen flex flex-col">
        <div className="flex-1">
          <RouteGuard>
            <AllRoutes />
          </RouteGuard>
        </div>
        <GlobalFooter />
      </div>
      <LincelinFAB />
      <MobileBottomNav />
      {/* Guest mode: floating trial badge + conversion modal */}
      <GuestTrialBadge />
      <ConversionModal />
      {isLoggedIn && <StreakRiskNotification />}
      <NotificationScheduler lang={lang} />
      <NotificationPrompt lang={lang as "es" | "en" | "zh"} />
      <BetaBanner />
      <UnlockCelebration />
      {showOnboarding && (
        <OnboardingTour
          onComplete={handleOnboardingComplete}
          lang={lang as "es" | "en" | "zh"}
        />
      )}
    </>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <PRDLanguageProvider>
          <GameProvider>
            <GuestProvider>
              <TooltipProvider>
                <AppContent />
              </TooltipProvider>
            </GuestProvider>
          </GameProvider>
        </PRDLanguageProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;

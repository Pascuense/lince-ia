import { Link, useLocation } from "wouter";

interface NavItem {
  path: string;
  label: string;
  icon: React.ReactNode;
}

const NAV_ITEMS: NavItem[] = [
  {
    path: "/",
    label: "Inicio",
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
  },
  {
    path: "/jugar",
    label: "Jugar",
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="6" width="20" height="12" rx="2" />
        <circle cx="8" cy="12" r="2" />
        <path d="M15 9.5v5" />
        <path d="M17.5 12h-5" />
      </svg>
    ),
  },
  {
    path: "/chat",
    label: "Familia",
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    path: "/perfil",
    label: "Perfil",
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
  },
];

/**
 * MobileBottomNav — Fixed bottom navigation bar for mobile devices.
 * VERSIÓN ACCESIBLE: Iconos más grandes (26px), texto 12px, targets 56px mínimo.
 * Diseño democrático para todas las edades.
 */
export function MobileBottomNav() {
  const [location] = useLocation();

  const publicRoutes = ["/login", "/registro"];
  if (publicRoutes.includes(location)) return null;

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-[#0A0A0A]/95 backdrop-blur-md border-t border-white/15"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
      aria-label="Navegación principal"
    >
      <div className="flex items-center justify-around h-[68px]">
        {NAV_ITEMS.map((item) => {
          const isActive = location === item.path || 
            (item.path !== "/" && location.startsWith(item.path));
          
          return (
            <Link
              key={item.path}
              href={item.path}
              className={`flex flex-col items-center justify-center min-w-[56px] min-h-[56px] px-4 py-1.5 rounded-xl transition-colors ${
                isActive
                  ? "text-[#00E5FF] bg-[#00E5FF]/10"
                  : "text-[#999] hover:text-white"
              }`}
              aria-label={item.label}
              aria-current={isActive ? "page" : undefined}
            >
              {item.icon}
              <span className={`text-xs mt-1 font-semibold ${isActive ? "text-[#00E5FF]" : ""}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

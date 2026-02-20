import { Link, useLocation } from "wouter";

/**
 * Floating home button that appears on all pages except the landing (/).
 * Provides easy navigation back to the main landing page.
 */
export function FloatingHomeButton() {
  const [location] = useLocation();

  // Don't show on the landing page itself
  if (location === "/") return null;

  return (
    <Link
      href="/"
      className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-[#00E5FF] shadow-[0_0_20px_rgba(0,229,255,0.4)] flex items-center justify-center hover:scale-110 transition-all group"
      aria-label="Volver al inicio"
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#000"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
      <span className="absolute -top-8 right-0 px-2 py-1 rounded bg-black/80 text-white text-[9px] font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        Inicio
      </span>
    </Link>
  );
}

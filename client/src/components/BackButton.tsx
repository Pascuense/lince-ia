import { useLocation } from "wouter";

interface BackButtonProps {
  /** Override the default back behavior with a specific path */
  fallbackPath?: string;
  /** Label text (default: "Volver") */
  label?: string;
  /** Additional CSS classes */
  className?: string;
  /** Variant: "sticky" (fixed top-left) or "inline" (in-flow) */
  variant?: "sticky" | "inline";
}

/**
 * BackButton — Accessible back navigation component.
 * 
 * - Minimum 44x44px touch target (WCAG 2.5.5)
 * - Uses browser history when available, falls back to fallbackPath or "/"
 * - Two variants: sticky (fixed position) and inline (in document flow)
 */
export function BackButton({
  fallbackPath = "/",
  label = "Volver",
  className = "",
  variant = "sticky",
}: BackButtonProps) {
  const [, navigate] = useLocation();

  const handleBack = () => {
    // Check if there's browser history to go back to
    if (window.history.length > 1) {
      window.history.back();
    } else {
      navigate(fallbackPath);
    }
  };

  if (variant === "inline") {
    return (
      <button
        onClick={handleBack}
        className={`inline-flex items-center gap-1.5 min-w-[44px] min-h-[44px] px-3 py-2 text-sm font-medium text-[#B0B0B0] hover:text-white transition-colors rounded-lg hover:bg-white/5 focus-visible:outline-2 focus-visible:outline-[#00E5FF] ${className}`}
        aria-label={label}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 12H5" />
          <polyline points="12 19 5 12 12 5" />
        </svg>
        <span>{label}</span>
      </button>
    );
  }

  // Sticky variant — fixed top-left
  return (
    <button
      onClick={handleBack}
      className={`fixed top-20 left-4 z-40 flex items-center gap-1.5 min-w-[44px] min-h-[44px] px-3 py-2 bg-[#0A0A0A]/90 backdrop-blur-sm border border-white/10 rounded-full text-sm font-medium text-[#B0B0B0] hover:text-white hover:border-[#00E5FF]/30 transition-all shadow-lg focus-visible:outline-2 focus-visible:outline-[#00E5FF] ${className}`}
      aria-label={label}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 12H5" />
        <polyline points="12 19 5 12 12 5" />
      </svg>
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}

/**
 * P2-7: Shared UI utilities extracted from Home.tsx
 * Reusable across multiple pages
 */
import { useState, useEffect, useRef, type ReactNode } from "react";

// ─── useInView hook ───
export function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setIsVisible(true); }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, isVisible };
}

// ─── FadeIn wrapper ───
export function FadeIn({ children, className = "", delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const { ref, isVisible } = useInView();
  return (
    <div ref={ref} className={`transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"} ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

// ─── SectionHeader ───
export function SectionHeader({ number, title, subtitle }: { number: string; title: string; subtitle: string }) {
  return (
    <div className="mb-8 sm:mb-12">
      <span className="text-[#00E5FF] font-display font-bold text-sm tracking-[0.3em] uppercase">{number}</span>
      <h2 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl text-white mt-2 mb-3">{title}</h2>
      <p className="text-[#B0B0B0] text-base sm:text-lg max-w-2xl">{subtitle}</p>
    </div>
  );
}

// ─── CollapsibleSection ───
export function CollapsibleSection({ id, title, icon, defaultOpen = false, children }: { id: string; title: string; icon: string; defaultOpen?: boolean; children: ReactNode }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <section id={id} className="border-b border-white/5">
      <div className="container">
        <button
          onClick={() => setOpen(!open)}
          className="w-full flex items-center justify-between py-5 sm:py-6 text-left group"
          aria-expanded={open}
          aria-controls={`section-${id}`}
        >
          <div className="flex items-center gap-3">
            <span className="text-xl sm:text-2xl">{icon}</span>
            <h2 className="font-display font-bold text-base sm:text-lg text-white/80 group-hover:text-white transition-colors">{title}</h2>
          </div>
          <svg
            className={`w-5 h-5 text-[#00E5FF]/50 group-hover:text-[#00E5FF] transition-all duration-300 ${open ? 'rotate-180' : ''}`}
            fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"
          >
            <path d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        <div
          id={`section-${id}`}
          className={`overflow-hidden transition-all duration-500 ${open ? 'max-h-[5000px] opacity-100 pb-8' : 'max-h-0 opacity-0'}`}
        >
          {children}
        </div>
      </div>
    </section>
  );
}

// ─── ScrollToTopButton ───
export function ScrollToTopButton() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 600);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  if (!show) return null;
  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="fixed bottom-20 right-6 z-50 w-12 h-12 bg-[#00E5FF] text-black rounded-full shadow-[0_0_20px_rgba(0,229,255,0.4)] hover:shadow-[0_0_30px_rgba(0,229,255,0.6)] hover:scale-110 transition-all duration-300 flex items-center justify-center"
      aria-label="Volver al inicio"
    >
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
        <path d="M5 15l7-7 7 7" />
      </svg>
    </button>
  );
}

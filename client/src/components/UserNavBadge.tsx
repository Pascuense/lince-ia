import { useState, useEffect, useRef } from "react";
import { Link } from "wouter";
import { AVATAR_FRONTAL, AVATAR_MUSICALIN, getAvatarImage } from "@/lib/avatarConstants";
import { CountrySelector } from "@/components/CountrySelector";
import { usePRDLanguage, tl} from "@/contexts/PRDLanguageContext";

interface NavUser {
  id?: number;
  username: string;
  realName: string;
  avatarKey?: string;
}

interface UserNavBadgeProps {
  variant?: "compact" | "full";
  className?: string;
  onAvatarClick?: () => void;
}

/**
 * Shared component that shows the logged-in user in any navigation bar.
 * Uses centralized avatar images from avatarConstants.
 * If no user is logged in, shows a Login/Register button.
 * Includes logout dropdown on username click.
 */
export function UserNavBadge({ variant = "compact", className = "", onAvatarClick }: UserNavBadgeProps) {
  const { lang } = usePRDLanguage();
  const [user, setUser] = useState<NavUser | null>(() => {
    try {
      const stored = localStorage.getItem('lince-user');
      if (stored) {
        const u = JSON.parse(stored);
        if (u.username) return u;
      }
    } catch {}
    return null;
  });
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateUser = () => {
      try {
        const stored = localStorage.getItem('lince-user');
        if (stored) {
          const u = JSON.parse(stored);
          if (u.username) { setUser(u); return; }
        }
      } catch {}
      setUser(null);
    };

    window.addEventListener('storage', updateUser);
    window.addEventListener('lince-login', updateUser);
    window.addEventListener('lince-logout', updateUser);
    window.addEventListener('lince-avatar-change', updateUser);
    const interval = setInterval(updateUser, 3000);

    return () => {
      window.removeEventListener('storage', updateUser);
      window.removeEventListener('lince-login', updateUser);
      window.removeEventListener('lince-logout', updateUser);
      window.removeEventListener('lince-avatar-change', updateUser);
      clearInterval(interval);
    };
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    // Clear all game/user data
    localStorage.removeItem('lince-user');
    localStorage.removeItem('lince-game-token');
    localStorage.removeItem('lince-game-state');
    sessionStorage.removeItem('lince-nda-accepted');
    setUser(null);
    setDropdownOpen(false);
    // Notify other components
    window.dispatchEvent(new Event('lince-logout'));
    // Redirect to home
    window.location.href = '/';
  };

  const logoutLabel = tl(lang, { es: 'Salir', en: 'Log out', zh: '退出', 'pt-BR': 'Sair', 'pt-PT': 'Sair' });
  const profileLabel = tl(lang, { es: 'Mi Progreso', en: 'My Progress', zh: '我的进度', 'pt-BR': 'Meu Progresso', 'pt-PT': 'Meu Progresso' });

  if (user) {
    const avatarUrl = user.avatarKey ? getAvatarImage(user.avatarKey) : "";

    if (variant === "compact") {
      return (
        <div ref={dropdownRef} className={`relative flex items-center gap-1.5 px-2 py-1 text-xs font-bold text-cyan-400 rounded-lg border border-[#00E5FF]/20 bg-[#00E5FF]/5 ${className}`}>
          <CountrySelector compact className="mr-0.5" />
          <button
            onClick={onAvatarClick}
            className="relative group flex-shrink-0"
            title="Cambiar avatar"
          >
            {avatarUrl ? (
              <img src={avatarUrl} alt="" className="w-5 h-5 rounded-full object-cover border border-[#00E5FF]/40 group-hover:border-[#00E5FF] transition-colors" />
            ) : (
              <span className="w-5 h-5 rounded-full bg-[#00E5FF]/20 flex items-center justify-center text-[9px]">👤</span>
            )}
          </button>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-1.5 hover:opacity-80 transition-opacity"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#00FF88] animate-pulse" />
            <span className="font-black whitespace-nowrap">{user.username}</span>
            <svg className={`w-3 h-3 transition-transform ${dropdownOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {dropdownOpen && (
            <div className="absolute top-full right-0 mt-1 bg-[#0A0A0A]/98 backdrop-blur-md border border-[#00E5FF]/20 rounded-lg shadow-xl py-1 min-w-[160px] z-[60]">
              <Link
                href="/jugar"
                onClick={() => setDropdownOpen(false)}
                className="block w-full text-left px-4 py-2.5 text-[12px] font-medium text-[#B0B0B0] hover:text-white hover:bg-white/5 transition-all"
              >
                🕹️ {tl(lang, { es: 'Jugar', en: 'Play', zh: '游戏', 'pt-BR': 'Jugar', 'pt-PT': 'Jugar' })}
              </Link>
              <Link
                href="/mi-panel"
                onClick={() => setDropdownOpen(false)}
                className="block w-full text-left px-4 py-2.5 text-[12px] font-medium text-[#B0B0B0] hover:text-white hover:bg-white/5 transition-all"
              >
                👤 {profileLabel}
              </Link>
              <div className="w-full h-px bg-white/10 my-1" />
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2.5 text-[12px] font-medium text-red-400 hover:text-red-300 hover:bg-red-400/10 transition-all"
              >
                🚪 {logoutLabel}
              </button>
            </div>
          )}
        </div>
      );
    }

    // Full variant (mobile)
    return (
      <div ref={dropdownRef} className={`relative flex items-center gap-2 px-3 py-1.5 text-sm font-bold text-cyan-400 rounded-xl border border-[#00E5FF]/20 bg-[#00E5FF]/5 ${className}`}>
        <CountrySelector compact className="mr-0.5" />
        <button
          onClick={onAvatarClick}
          className="relative group flex-shrink-0"
          title="Cambiar avatar"
        >
          {avatarUrl ? (
            <img src={avatarUrl} alt="" className="w-8 h-8 rounded-full object-cover border-2 border-[#00E5FF]/40 shadow-[0_0_8px_rgba(0,229,255,0.2)] group-hover:border-[#00E5FF] transition-colors" />
          ) : (
            <span className="w-8 h-8 rounded-full bg-[#00E5FF]/20 flex items-center justify-center text-sm">👤</span>
          )}
          <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-[#00E5FF] rounded-full flex items-center justify-center text-[6px] text-black font-bold opacity-0 group-hover:opacity-100 transition-opacity">✎</span>
        </button>
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="flex flex-col items-start hover:opacity-80 transition-opacity"
        >
          <span className="font-black whitespace-nowrap leading-tight flex items-center gap-1">
            {user.username}
            <svg className={`w-3 h-3 transition-transform ${dropdownOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M19 9l-7 7-7-7" />
            </svg>
          </span>
          <span className="text-[9px] text-[#00FF88] flex items-center gap-1 leading-tight">
            <span className="w-1 h-1 rounded-full bg-[#00FF88] animate-pulse inline-block" /> {tl(lang, { es: 'En línea', en: 'Online', zh: '在线', 'pt-BR': 'En línea', 'pt-PT': 'En línea' })}
          </span>
        </button>
        {dropdownOpen && (
          <div className="absolute top-full right-0 mt-1 bg-[#0A0A0A]/98 backdrop-blur-md border border-[#00E5FF]/20 rounded-lg shadow-xl py-1 min-w-[160px] z-[60]">
            <Link
              href="/jugar"
              onClick={() => setDropdownOpen(false)}
              className="block w-full text-left px-4 py-2.5 text-sm font-medium text-[#B0B0B0] hover:text-white hover:bg-white/5 transition-all"
            >
              🕹️ {tl(lang, { es: 'Jugar', en: 'Play', zh: '游戏', 'pt-BR': 'Jugar', 'pt-PT': 'Jugar' })}
            </Link>
            <Link
              href="/mi-panel"
              onClick={() => setDropdownOpen(false)}
              className="block w-full text-left px-4 py-2.5 text-sm font-medium text-[#B0B0B0] hover:text-white hover:bg-white/5 transition-all"
            >
              👤 {profileLabel}
            </Link>
            <div className="w-full h-px bg-white/10 my-1" />
            <button
              onClick={handleLogout}
              className="block w-full text-left px-4 py-2.5 text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-400/10 transition-all"
            >
              🚪 {logoutLabel}
            </button>
          </div>
        )}
      </div>
    );
  }

  // Not logged in — show direct access button (no registration needed)
  return (
    <Link
      href="/tutorial"
      className={`bg-gradient-to-r from-cyan-500 to-emerald-500 text-black text-xs font-bold px-3 py-1.5 rounded-lg hover:opacity-90 transition-opacity whitespace-nowrap ${className}`}
    >
      {tl(lang, { es: '¡JUGAR!', en: 'PLAY', zh: '开始', 'pt-BR': '¡JUGAR!', 'pt-PT': '¡JUGAR!' })}
    </Link>
  );
}

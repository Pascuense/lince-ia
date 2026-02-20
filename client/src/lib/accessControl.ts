/**
 * LINCE Access Control System
 * 
 * Two tiers:
 * - ADMIN: Full access to everything (only 2 emails in the world)
 * - USER: Limited access to core features only
 */

// ─── Admin Emails (ONLY these 2 emails get full access) ───
const ADMIN_EMAILS: string[] = [
  "cristobalalisteg@gmail.com",
  "cristobal@acnb.es",
];

// ─── Routes accessible by ALL registered users ───
export const USER_ROUTES: string[] = [
  "/",
  "/home",
  // Core tools
  "/arsenal-ia",
  "/arsenal-ia/:toolId",
  "/prompt-studio",       // IMAGELIN
  "/promptear",           // PROMPTLIN
  "/lincelin",            // LINCELIN (nombre oficial: LINCELIN)
  "/personajes",          // Avatares
  // Tutorial
  "/tutorial",
  // Game
  "/jugar",
  "/jugar/nivel-1",
  "/jugar/nivel-2",
  "/jugar/nivel-3",
  // Profile & rewards
  "/perfil",
  "/perfil-publico",
  "/recompensas",
  // Retention systems
  "/mercado",
  "/reto-diario",
  "/progresion",
  // Legal & info
  "/aviso-legal",
  "/como-jugar",
  "/artista/:code",
  "/artista",
];

// ─── Routes ONLY for admins ───
export const ADMIN_ONLY_ROUTES: string[] = [
  "/urban",
  "/mundo",
  "/raids",
  "/raids-batalla",
  "/academia",
  "/catalogo-formativo",
  "/course-builder",
  "/avatar-customizer",
  "/mi-panel",
  "/changelog",
  "/admin",
  "/guia-base44",
  "/prompt-profesional",
  "/historial-prompts",
  "/galeria",
  // Legacy route redirect
  "/crea-tu-lincelin",
];

// ─── Navigation items for regular users ───
export interface NavItem {
  id: string;
  label: string;
  labelKey?: string;
  path: string;
  icon?: string;
}

export const USER_NAV_ITEMS: NavItem[] = [
  { id: "arsenal", label: "Arsenal IA", path: "/arsenal-ia", icon: "🛡️" },
  { id: "imagelin", label: "IMAGELIN", path: "/prompt-studio", icon: "🖼️" },
  { id: "promptlin", label: "PROMPTLIN", path: "/promptear", icon: "🧠" },
  { id: "lincelin", label: "LINCELIN", path: "/lincelin", icon: "🎨" },
  { id: "avatares", label: "Avatares", path: "/personajes", icon: "🐱" },
  { id: "jugar", label: "¡JUGAR!", path: "/jugar", icon: "🕹️" },
  { id: "mercado", label: "Mercado", path: "/mercado", icon: "🎪" },
  { id: "reto", label: "Reto Diario", path: "/reto-diario", icon: "🏆" },
  { id: "progresion", label: "Progresi\u00F3n", path: "/progresion", icon: "🗺\uFE0F" },
];

// ─── Helper functions ───

export function isAdminEmail(email: string | undefined | null): boolean {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email.toLowerCase().trim());
}

export function isAdminUser(): boolean {
  try {
    const stored = localStorage.getItem("lince-user");
    if (!stored) return false;
    const user = JSON.parse(stored);
    return isAdminEmail(user.email);
  } catch {
    return false;
  }
}

export function getUserEmail(): string | null {
  try {
    const stored = localStorage.getItem("lince-user");
    if (!stored) return null;
    const user = JSON.parse(stored);
    return user.email || null;
  } catch {
    return null;
  }
}

export function canAccessRoute(path: string): boolean {
  // Admins can access everything
  if (isAdminUser()) return true;
  
  // Only block /admin for non-admin users. Everything else is open.
  if (path === "/admin") return false;
  
  // All other routes are accessible to everyone without registration
  return true;
}

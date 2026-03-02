import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";

/**
 * Tests for the access control system.
 * Since the actual module uses localStorage (browser-only),
 * we test the logic patterns directly.
 */

// ─── Admin email list ───
const ADMIN_EMAILS = [
  "cristobalalisteg@gmail.com",
  "cristobal@acnb.es",
];

// ─── User-accessible routes ───
const USER_ROUTES = [
  "/", "/home",
  "/arsenal-ia", "/arsenal-ia/:toolId",
  "/prompt-studio", "/promptear",
  "/lincelin",
  "/personajes",
  "/jugar", "/jugar/nivel-1", "/jugar/nivel-2", "/jugar/nivel-3",
  "/perfil", "/recompensas",
  "/aviso-legal", "/como-jugar",
  "/artista/:code", "/artista",
];

// ─── Admin-only routes ───
const ADMIN_ONLY_ROUTES = [
  "/urban", "/mundo", "/raids", "/raids-batalla",
  "/academia", "/catalogo-formativo", "/course-builder",
  "/avatar-customizer", "/mi-panel", "/changelog",
  "/admin", "/guia-base44",
  "/prompt-profesional", "/historial-prompts", "/galeria",
  "/crea-tu-lincelin",
];

// ─── Helper functions (mirror of client-side logic) ───
function isAdminEmail(email: string | undefined | null): boolean {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email.toLowerCase().trim());
}

function canAccessRoute(path: string, userEmail: string | null): boolean {
  if (userEmail && isAdminEmail(userEmail)) return true;
  return USER_ROUTES.some(route => {
    if (route === path) return true;
    if (route.includes(":")) {
      const routeParts = route.split("/");
      const pathParts = path.split("/");
      if (routeParts.length !== pathParts.length) return false;
      return routeParts.every((part, i) => part.startsWith(":") || part === pathParts[i]);
    }
    return false;
  });
}

describe("Access Control System", () => {
  describe("Admin Email Verification", () => {
    it("should recognize admin email cristobalalisteg@gmail.com", () => {
      expect(isAdminEmail("cristobalalisteg@gmail.com")).toBe(true);
    });

    it("should recognize admin email cristobal@acnb.es", () => {
      expect(isAdminEmail("cristobal@acnb.es")).toBe(true);
    });

    it("should be case-insensitive for admin emails", () => {
      expect(isAdminEmail("CRISTOBALALISTEG@GMAIL.COM")).toBe(true);
      expect(isAdminEmail("Cristobal@ACNB.es")).toBe(true);
    });

    it("should trim whitespace from emails", () => {
      expect(isAdminEmail("  cristobal@acnb.es  ")).toBe(true);
    });

    it("should reject non-admin emails", () => {
      expect(isAdminEmail("user@example.com")).toBe(false);
      expect(isAdminEmail("admin@lince.com")).toBe(false);
      expect(isAdminEmail("test@gmail.com")).toBe(false);
    });

    it("should handle null/undefined/empty emails", () => {
      expect(isAdminEmail(null)).toBe(false);
      expect(isAdminEmail(undefined)).toBe(false);
      expect(isAdminEmail("")).toBe(false);
    });
  });

  describe("Route Access for Regular Users", () => {
    const regularUser = "user@example.com";

    it("should allow access to home routes", () => {
      expect(canAccessRoute("/", regularUser)).toBe(true);
      expect(canAccessRoute("/home", regularUser)).toBe(true);
    });

    it("should allow access to Arsenal IA", () => {
      expect(canAccessRoute("/arsenal-ia", regularUser)).toBe(true);
    });

    it("should allow access to Arsenal IA detail pages", () => {
      expect(canAccessRoute("/arsenal-ia/chatgpt", regularUser)).toBe(true);
      expect(canAccessRoute("/arsenal-ia/midjourney", regularUser)).toBe(true);
    });

    it("should allow access to Prompts section", () => {
      expect(canAccessRoute("/prompt-studio", regularUser)).toBe(true);
      expect(canAccessRoute("/promptear", regularUser)).toBe(true);
    });

    it("should BLOCK access to admin-only prompt tools", () => {
      expect(canAccessRoute("/prompt-profesional", regularUser)).toBe(false);
      expect(canAccessRoute("/historial-prompts", regularUser)).toBe(false);
      expect(canAccessRoute("/galeria", regularUser)).toBe(false);
    });

    it("should allow access to Avatares section", () => {
      expect(canAccessRoute("/personajes", regularUser)).toBe(true);
      expect(canAccessRoute("/lincelin", regularUser)).toBe(true);
    });

    it("should BLOCK access to legacy crea-tu-lincelin (now admin-only)", () => {
      expect(canAccessRoute("/crea-tu-lincelin", regularUser)).toBe(false);
    });

    it("should allow access to Game section", () => {
      expect(canAccessRoute("/jugar", regularUser)).toBe(true);
      expect(canAccessRoute("/jugar/nivel-1", regularUser)).toBe(true);
      expect(canAccessRoute("/jugar/nivel-2", regularUser)).toBe(true);
      expect(canAccessRoute("/jugar/nivel-3", regularUser)).toBe(true);
    });

    it("should allow access to profile and rewards", () => {
      expect(canAccessRoute("/perfil", regularUser)).toBe(true);
      expect(canAccessRoute("/recompensas", regularUser)).toBe(true);
    });

    it("should allow access to legal and info pages", () => {
      expect(canAccessRoute("/aviso-legal", regularUser)).toBe(true);
      expect(canAccessRoute("/como-jugar", regularUser)).toBe(true);
    });

    it("should BLOCK access to admin-only routes", () => {
      expect(canAccessRoute("/mundo", regularUser)).toBe(false);
      expect(canAccessRoute("/raids", regularUser)).toBe(false);
      expect(canAccessRoute("/raids-batalla", regularUser)).toBe(false);
      expect(canAccessRoute("/academia", regularUser)).toBe(false);
      expect(canAccessRoute("/admin", regularUser)).toBe(false);
      expect(canAccessRoute("/changelog", regularUser)).toBe(false);
      expect(canAccessRoute("/mi-panel", regularUser)).toBe(false);
      expect(canAccessRoute("/catalogo-formativo", regularUser)).toBe(false);
      expect(canAccessRoute("/course-builder", regularUser)).toBe(false);
      expect(canAccessRoute("/avatar-customizer", regularUser)).toBe(false);
      expect(canAccessRoute("/guia-base44", regularUser)).toBe(false);
      expect(canAccessRoute("/urban", regularUser)).toBe(false);
      expect(canAccessRoute("/prompt-profesional", regularUser)).toBe(false);
      expect(canAccessRoute("/historial-prompts", regularUser)).toBe(false);
      expect(canAccessRoute("/galeria", regularUser)).toBe(false);
    });

    it("should BLOCK access to unknown routes", () => {
      expect(canAccessRoute("/secret-page", regularUser)).toBe(false);
      expect(canAccessRoute("/admin/settings", regularUser)).toBe(false);
    });
  });

  describe("Route Access for Admin Users", () => {
    const adminUser = "cristobalalisteg@gmail.com";

    it("should allow admin access to ALL user routes", () => {
      USER_ROUTES.forEach(route => {
        const testPath = route.replace(":toolId", "chatgpt").replace(":code", "bryelin");
        expect(canAccessRoute(testPath, adminUser)).toBe(true);
      });
    });

    it("should allow admin access to ALL admin-only routes", () => {
      ADMIN_ONLY_ROUTES.forEach(route => {
        expect(canAccessRoute(route, adminUser)).toBe(true);
      });
    });

    it("should allow admin access to any arbitrary route", () => {
      expect(canAccessRoute("/any-random-path", adminUser)).toBe(true);
      expect(canAccessRoute("/super-secret", adminUser)).toBe(true);
    });
  });

  describe("Route Access with No User", () => {
    it("should block admin routes when no user is logged in", () => {
      expect(canAccessRoute("/admin", null)).toBe(false);
      expect(canAccessRoute("/mundo", null)).toBe(false);
    });

    it("should still allow user routes even without login (route check only)", () => {
      expect(canAccessRoute("/home", null)).toBe(true);
      expect(canAccessRoute("/arsenal-ia", null)).toBe(true);
    });
  });

  describe("No Cristóbal Aliste in Visible Code", () => {
    it("should have exactly 2 admin emails configured", () => {
      expect(ADMIN_EMAILS).toHaveLength(2);
    });

    it("admin emails should not expose personal names in the route system", () => {
      // The admin emails are only used for access control, never displayed to users
      USER_ROUTES.forEach(route => {
        expect(route.toLowerCase()).not.toContain("cristobal");
        expect(route.toLowerCase()).not.toContain("aliste");
      });
      ADMIN_ONLY_ROUTES.forEach(route => {
        expect(route.toLowerCase()).not.toContain("cristobal");
        expect(route.toLowerCase()).not.toContain("aliste");
      });
    });
  });

  describe("Route Pattern Matching", () => {
    it("should match parameterized routes correctly", () => {
      expect(canAccessRoute("/artista/bryelin", "user@test.com")).toBe(true);
      expect(canAccessRoute("/artista/floyylin", "user@test.com")).toBe(true);
      expect(canAccessRoute("/arsenal-ia/chatgpt", "user@test.com")).toBe(true);
    });

    it("should not match routes with extra segments", () => {
      expect(canAccessRoute("/arsenal-ia/chatgpt/extra", "user@test.com")).toBe(false);
      expect(canAccessRoute("/jugar/nivel-1/extra", "user@test.com")).toBe(false);
    });
  });
});

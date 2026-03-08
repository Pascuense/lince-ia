import { useState, useEffect } from "react";
import { useGame } from "@/contexts/GameContext";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";

/**
 * AdminPanel: Protected admin zone.
 * Only accessible by the owner/admin.
 * Contains all technical tools, prompt studio, arsenal, etc.
 */

const ADMIN_OPEN_ID = "owner"; // Will check via role

export default function AdminPanel() {
  const { loggedUser } = useGame();
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");
  const [showPasswordInput, setShowPasswordInput] = useState(false);
  const [error, setError] = useState("");

  // Simple admin check: check if user has admin role or is the owner
  useEffect(() => {
    try {
      const stored = localStorage.getItem("lince-user");
      if (stored) {
        const parsed = JSON.parse(stored);
        // Admin if username contains ADMIN or if email matches owner
        if (parsed.username?.includes("ADMIN") || parsed.email === "admin@lince.com") {
          setIsAdmin(true);
        }
      }
    } catch { /* ignore */ }
  }, []);

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[oklch(0.10_0.01_240)] text-white flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <span className="text-6xl block mb-4">🔒</span>
          <h1 className="text-2xl font-bold mb-2">Zona Admin</h1>
          <p className="text-gray-400 mb-6">Esta sección es solo para administradores.</p>
          <Link href="/" className="text-[oklch(0.82_0.15_195)] hover:underline">
            ← Volver al juego
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[oklch(0.10_0.01_240)] text-white">
      <div className="sticky top-0 z-50 bg-[oklch(0.10_0.01_240)]/95 backdrop-blur-md border-b border-red-500/20">
        <div className="container flex items-center justify-between h-14 px-4">
          <Link href="/" className="text-gray-400 hover:text-white text-sm">← Volver</Link>
          <h1 className="font-bold text-red-400">Panel Admin</h1>
          <span className="text-xs text-red-400 bg-red-500/10 px-2 py-1 rounded">ADMIN</span>
        </div>
      </div>

      <div className="container px-4 py-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { name: "Crear Imagen", desc: "Generador de imágenes con IA", icon: "🎨", href: "/prompt-studio" },
            { name: "Prompt Profesional", desc: "Técnicas Anthropic", icon: "📝", href: "/prompt-profesional" },
            { name: "Herramientas IA", desc: "62 herramientas de IA", icon: "🛡️", href: "/arsenal-ia" },
            { name: "Todos los Cursos", desc: "120 cursos de IA", icon: "📚", href: "/catalogo-formativo" },
            { name: "Crea tu Curso", desc: "Diseñar cursos propios", icon: "🏗️", href: "/course-builder" },
            { name: "Historial Prompts", desc: "Creaciones guardadas", icon: "📋", href: "/historial-prompts" },
            { name: "Galería", desc: "Imágenes generadas", icon: "🖼️", href: "/galeria" },
            { name: "Guía Base44", desc: "Prompts de desarrollo", icon: "📖", href: "/guia-base44" },
            { name: "Changelog", desc: "Historial de cambios", icon: "📰", href: "/changelog" },
            { name: "Legal", desc: "Información legal", icon: "⚖️", href: "/aviso-legal" },
          ].map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="flex items-center gap-4 p-4 rounded-xl bg-[oklch(0.14_0.015_240)] border border-white/5 hover:border-red-500/30 transition-all"
            >
              <span className="text-3xl">{item.icon}</span>
              <div>
                <h3 className="font-bold text-sm">{item.name}</h3>
                <p className="text-gray-500 text-xs">{item.desc}</p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

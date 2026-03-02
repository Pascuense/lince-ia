import { useState, type ReactNode } from "react";
import { toast } from "sonner";

// ─── Types ───
export interface GeneratedContent {
  type: "image" | "text" | "prompt" | "lincelin" | "chat_response";
  url?: string;
  text?: string;
  filename?: string;
  avatarName?: string;
  recommendedTool?: {
    id: string;
    name: string;
    why: string;
  };
}

type SocialPlatform = "whatsapp" | "instagram" | "telegram" | "x" | "facebook" | "linkedin" | "email";

// ─── SVG Icons for each platform ───
const SOCIAL_ICONS: Record<SocialPlatform, ReactNode> = {
  whatsapp: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  ),
  instagram: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
    </svg>
  ),
  telegram: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M11.944 0A12 12 0 000 12a12 12 0 0012 12 12 12 0 0012-12A12 12 0 0012 0a12 12 0 00-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 01.171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.479.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
    </svg>
  ),
  x: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  ),
  facebook: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  ),
  linkedin: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  ),
  email: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2"/>
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
    </svg>
  ),
};

// ─── Share text builder ───
function buildShareText(content: GeneratedContent, platform: SocialPlatform): string {
  const avatarLabel = content.avatarName ? ` (${content.avatarName})` : "";
  const texts: Record<string, Record<SocialPlatform, string>> = {
    image: {
      whatsapp:  "Cree esta imagen con IA en LINCE! Aprende tu tambien:",
      telegram:  "Cree esta imagen con IA! Aprende en LINCE",
      x:         "Cree esto con IA en @LINCE_app! Aprende a hacerlo tu tambien #IA #LINCE",
      facebook:  "Cree esta imagen con IA en LINCE! Plataforma de formacion en inteligencia artificial para todos.",
      linkedin:  "Acabo de crear esta imagen usando IA generativa en LINCE. El aprendizaje de IA nunca fue tan accesible.",
      instagram: "Cree esta imagen con IA en @lince.app. Te animas a aprender? #IA #LINCE #InteligenciaArtificial",
      email:     "Mira esta imagen que cree con IA en LINCE!",
    },
    prompt: {
      whatsapp:  "Cree este prompt de IA con LINCE! Usalo para tus conversaciones con ChatGPT:",
      telegram:  "Mira el prompt que hice con LINCE! Aprende tu tambien",
      x:         "Mi prompt de IA creado con @LINCE_app! #PromptEngineering #IA #LINCE",
      facebook:  "Comparto este prompt de IA creado en LINCE. Aprende prompt engineering de forma divertida!",
      linkedin:  "Comparto este prompt de IA que cree en LINCE. El prompt engineering es la habilidad mas demandada de 2026.",
      instagram: "Mi primer prompt de IA hecho en @lince.app #PromptEngineering #IA #AprendizajeIA",
      email:     "Te comparto este prompt de IA que cree en LINCE:",
    },
    lincelin: {
      whatsapp:  "Mira mi personaje lince de LINCE! Crea el tuyo gratis:",
      telegram:  "Mi avatar personal de LINCE! Crea el tuyo:",
      x:         "Mi avatar de @LINCE_app! Cada uno es unico. Crea el tuyo gratis #LINCE",
      facebook:  "Mira mi avatar personalizado de LINCE! Crea el tuyo gratis en la plataforma de IA mas divertida.",
      linkedin:  "Este es mi avatar personal en LINCE, la plataforma de alfabetizacion en IA!",
      instagram: "Mi avatar personalizado de @lince.app!",
      email:     "Mira mi avatar personalizado de LINCE!",
    },
    text: {
      whatsapp:  "Mira lo que aprendi con LINCE! Plataforma de IA educativa:",
      telegram:  "Aprendi esto con LINCE! Pruebalo:",
      x:         "Aprendiendo IA con @LINCE_app! #IA #Educacion #LINCE",
      facebook:  "Estoy aprendiendo IA con LINCE! Una plataforma gamificada increible.",
      linkedin:  "Comparto lo que aprendi sobre IA en LINCE. Plataforma educativa accesible para todos.",
      instagram: "Aprendiendo IA con @lince.app #IA #Educacion",
      email:     "Te comparto lo que aprendi con LINCE:",
    },
    chat_response: {
      whatsapp:  `Mira la respuesta que me dio un avatar${avatarLabel} de LINCE! Aprende IA con personajes interactivos:`,
      telegram:  `Respuesta de un avatar${avatarLabel} de LINCE! Aprende IA de forma divertida:`,
      x:         "Chateando con avatares de IA en @LINCE_app! #IA #LINCE",
      facebook:  `Estoy chateando con avatares de IA en LINCE! Mira esta respuesta${avatarLabel}:`,
      linkedin:  "Los avatares de LINCE ensenan IA de forma interactiva. Una experiencia educativa unica.",
      instagram: "Chateando con avatares de IA en @lince.app #IA #LINCE",
      email:     `Mira esta conversacion con un avatar${avatarLabel} de LINCE:`,
    },
  };

  const typeTexts = texts[content.type] || texts.text;
  return typeTexts[platform] || typeTexts.whatsapp;
}

// ─── Share handler ───
function triggerShare(platform: SocialPlatform, content: GeneratedContent, onDownload: () => void) {
  const shareText = buildShareText(content, platform);
  const shareUrl = `https://lince.app?utm_source=${platform}&utm_medium=share`;

  switch (platform) {
    case "whatsapp": {
      const waText = encodeURIComponent(`${shareText}\n\n${content.text ? content.text.slice(0, 300) + "...\n\n" : ""}${shareUrl}`);
      window.open(`https://wa.me/?text=${waText}`, "_blank");
      break;
    }
    case "telegram": {
      const tgText = encodeURIComponent(`${shareText}\n\n${content.text ? content.text.slice(0, 300) + "..." : ""}`);
      const tgUrl = encodeURIComponent(shareUrl);
      window.open(`https://t.me/share/url?url=${tgUrl}&text=${tgText}`, "_blank");
      break;
    }
    case "x": {
      const xText = encodeURIComponent(`${shareText} ${shareUrl}`);
      window.open(`https://twitter.com/intent/tweet?text=${xText}`, "_blank");
      break;
    }
    case "facebook": {
      const fbUrl = encodeURIComponent(shareUrl);
      const fbQuote = encodeURIComponent(shareText);
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${fbUrl}&quote=${fbQuote}`, "_blank");
      break;
    }
    case "linkedin": {
      const liUrl = encodeURIComponent(shareUrl);
      const liTitle = encodeURIComponent("Aprendiendo IA con LINCE");
      window.open(`https://www.linkedin.com/shareArticle?mini=true&url=${liUrl}&title=${liTitle}`, "_blank");
      break;
    }
    case "email": {
      const subject = encodeURIComponent("Mira lo que hice con LINCE - Aprende IA Jugando");
      const body = encodeURIComponent(`${shareText}\n\n${content.text ? content.text.slice(0, 500) + "\n\n" : ""}Pruebalo gratis: ${shareUrl}`);
      window.open(`mailto:?subject=${subject}&body=${body}`, "_self");
      break;
    }
    case "instagram": {
      // Instagram doesn't support web share — download + show instructions
      onDownload();
      break;
    }
  }
}

// ─── Watermark helper ───
function addLinceIAWatermark(imgBlob: Blob): Promise<Blob> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) { resolve(imgBlob); return; }

      ctx.drawImage(img, 0, 0);

      const stripH = Math.max(36, img.height * 0.06);
      ctx.fillStyle = "rgba(0, 0, 0, 0.55)";
      ctx.fillRect(0, img.height - stripH, img.width, stripH);

      const fontSize = Math.max(14, Math.min(24, img.width * 0.028));
      ctx.font = `bold ${fontSize}px 'Space Grotesk', sans-serif`;
      ctx.textBaseline = "middle";
      const y = img.height - stripH / 2;

      ctx.fillStyle = "#00E5FF";
      ctx.textAlign = "left";
      ctx.fillText("LINCE IA", 12, y);

      ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
      ctx.textAlign = "right";
      ctx.font = `${fontSize * 0.8}px 'Space Grotesk', sans-serif`;
      ctx.fillText("lince.app", img.width - 12, y);

      canvas.toBlob((b) => resolve(b || imgBlob), "image/png");
    };
    img.onerror = () => resolve(imgBlob);
    img.src = URL.createObjectURL(imgBlob);
  });
}

// ─── Download handler ───
function handleDownload(content: GeneratedContent): Promise<void> {
  return new Promise((resolve) => {
    if ((content.type === "image" || content.type === "lincelin") && content.url) {
      fetch(content.url)
        .then((r) => r.blob())
        .then((blob) => addLinceIAWatermark(blob))
        .then((watermarkedBlob) => {
          const url = URL.createObjectURL(watermarkedBlob);
          const a = document.createElement("a");
          a.href = url;
          a.download = content.filename || `lince-creacion-${Date.now()}.png`;
          a.click();
          URL.revokeObjectURL(url);
          resolve();
        })
        .catch(() => resolve());
    } else if (content.text) {
      const blob = new Blob([content.text], { type: "text/plain;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = content.filename || `lince-chat-${Date.now()}.txt`;
      a.click();
      URL.revokeObjectURL(url);
      resolve();
    } else {
      resolve();
    }
  });
}

// ─── Copy handler ───
async function handleCopy(content: GeneratedContent): Promise<boolean> {
  const textToCopy = content.text || content.url || "";
  if (!textToCopy) return false;
  try {
    await navigator.clipboard.writeText(textToCopy);
    return true;
  } catch {
    const ta = document.createElement("textarea");
    ta.value = textToCopy;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    document.execCommand("copy");
    document.body.removeChild(ta);
    return true;
  }
}

// ─── Social buttons config ───
const SOCIAL_BUTTONS: { platform: SocialPlatform; label: string; color: string }[] = [
  { platform: "whatsapp", label: "WhatsApp", color: "#25D366" },
  { platform: "facebook", label: "Facebook", color: "#1877F2" },
  { platform: "instagram", label: "Instagram", color: "#E4405F" },
  { platform: "x", label: "X", color: "#000000" },
  { platform: "telegram", label: "Telegram", color: "#0088CC" },
  { platform: "linkedin", label: "LinkedIn", color: "#0A66C2" },
  { platform: "email", label: "Email", color: "#D4A843" },
];

// ─── Component ───
interface ShareDownloadBarProps {
  content: GeneratedContent;
  compact?: boolean;
  className?: string;
}

export default function ShareDownloadBar({ content, compact = false, className = "" }: ShareDownloadBarProps) {
  const [showSocial, setShowSocial] = useState(false);
  const [showInstaModal, setShowInstaModal] = useState(false);

  const onDownload = async () => {
    await handleDownload(content);
    toast.success("Archivo guardado en tu dispositivo");
  };

  const onCopy = async () => {
    const ok = await handleCopy(content);
    if (ok) {
      toast.success("Contenido copiado al portapapeles");
    }
  };

  const onShare = (platform: SocialPlatform) => {
    if (platform === "instagram") {
      handleDownload(content).then(() => setShowInstaModal(true));
    } else {
      triggerShare(platform, content, onDownload);
    }
    toast.success(`Compartiendo en ${SOCIAL_BUTTONS.find(b => b.platform === platform)?.label || platform}...`);
  };

  const onNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "LINCE - Aprende IA Jugando",
          text: content.text ? content.text.slice(0, 200) : "Mira lo que hice con LINCE!",
          url: content.url || "https://lince.app",
        });
      } catch {
        // User cancelled — fallback to social buttons
        setShowSocial(!showSocial);
      }
    } else {
      setShowSocial(!showSocial);
    }
  };

  return (
    <div className={`${className}`}>
      {/* Primary actions row */}
      <div className={`flex items-center gap-2 ${compact ? "flex-wrap" : "justify-center flex-wrap"}`}>
        {/* Download / Save */}
        {(content.url || content.text) && (
          <button
            onClick={onDownload}
            aria-label="Guardar archivo"
            className="flex items-center gap-1.5 px-3 py-2 bg-[#00E5FF]/10 border border-[#00E5FF]/30 rounded-lg text-[#00E5FF] text-sm font-medium hover:bg-[#00E5FF]/20 transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            Guardar
          </button>
        )}

        {/* Copy */}
        {content.text && (
          <button
            onClick={onCopy}
            aria-label="Copiar al portapapeles"
            className="flex items-center gap-1.5 px-3 py-2 bg-[#D4A843]/10 border border-[#D4A843]/30 rounded-lg text-[#D4A843] text-sm font-medium hover:bg-[#D4A843]/20 transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
            Copiar
          </button>
        )}

        {/* Share button — triggers native share on mobile, social grid on desktop */}
        <button
          onClick={onNativeShare}
          aria-label="Compartir"
          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
            showSocial
              ? "bg-[#00E5FF]/20 border border-[#00E5FF]/40 text-[#00E5FF]"
              : "bg-white/5 border border-white/20 text-white hover:bg-white/10"
          }`}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
          Compartir
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform duration-200 ${showSocial ? "rotate-180" : ""}`}><polyline points="6 9 12 15 18 9"/></svg>
        </button>
      </div>

      {/* Social buttons grid — expandable */}
      {showSocial && (
        <div className="mt-3 p-3 bg-white/5 border border-white/10 rounded-xl animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
            {SOCIAL_BUTTONS.map((btn) => (
              <button
                key={btn.platform}
                onClick={() => onShare(btn.platform)}
                aria-label={`Compartir en ${btn.label}`}
                className="flex flex-col items-center gap-1.5 p-2 rounded-xl transition-all hover:scale-105 active:scale-95 group"
                style={{ backgroundColor: `${btn.color}15` }}
              >
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center transition-all group-hover:shadow-lg"
                  style={{ backgroundColor: `${btn.color}25`, color: btn.color }}
                >
                  {SOCIAL_ICONS[btn.platform]}
                </div>
                {!compact && (
                  <span className="text-[10px] font-semibold text-[#B0B0B0] group-hover:text-white transition-colors">
                    {btn.label}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Tool recommendation */}
      {content.recommendedTool && (
        <div className="flex items-center gap-2 mt-3 px-3 py-2 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
          <span className="text-emerald-400 text-xs">Para ir mas lejos:</span>
          <a
            href={`/arsenal-ia/${content.recommendedTool.id}`}
            className="text-emerald-300 text-xs font-bold hover:underline"
          >
            Usar en {content.recommendedTool.name}
          </a>
          {content.recommendedTool.why && (
            <span className="text-emerald-400/60 text-[10px] hidden sm:inline">— {content.recommendedTool.why}</span>
          )}
        </div>
      )}

      {/* Instagram modal */}
      {showInstaModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 p-4" onClick={() => setShowInstaModal(false)}>
          <div
            className="bg-[#1A1A2E] border border-[#E4405F]/30 rounded-xl p-6 max-w-sm w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#f09433] via-[#e6683c] to-[#bc1888] flex items-center justify-center text-white">
                {SOCIAL_ICONS.instagram}
              </div>
              <h3 className="text-white font-bold text-lg">Compartir en Instagram</h3>
            </div>
            <p className="text-[#B0B0B0] text-sm mb-4">
              Tu {content.type === "image" || content.type === "lincelin" ? "imagen" : "contenido"} ya se descargo. Para subirlo a Instagram:
            </p>
            <ol className="text-[#B0B0B0] text-sm space-y-2 mb-4 list-decimal list-inside">
              <li>Abre Instagram en tu movil</li>
              <li>Toca el <strong className="text-white">+</strong> para crear una nueva publicacion</li>
              <li>Selecciona el archivo descargado de tu galeria</li>
              <li>Etiqueta a <strong className="text-[#E4405F]">@lince.app</strong></li>
            </ol>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  const shareText = buildShareText(content, "instagram");
                  navigator.clipboard.writeText(shareText);
                  toast.success("Texto para Instagram copiado");
                }}
                className="flex-1 px-3 py-2.5 bg-[#E4405F]/20 border border-[#E4405F]/40 rounded-lg text-[#E4405F] text-sm font-medium hover:bg-[#E4405F]/30 transition-colors"
              >
                Copiar texto
              </button>
              <button
                onClick={() => setShowInstaModal(false)}
                className="flex-1 px-3 py-2.5 bg-white/10 border border-white/20 rounded-lg text-white text-sm font-medium hover:bg-white/15 transition-colors"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

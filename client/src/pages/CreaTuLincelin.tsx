import { useState, useRef, useCallback } from "react";
import { trpc } from "@/lib/trpc";
import { IMAGE_UNAVAILABLE_MSG, useFeatures } from "@/hooks/useFeatures";
import { useGuest } from "@/contexts/GuestContext";
import { toast } from "sonner";
import ShareDownloadBar from "@/components/ShareDownloadBar";
import { Button } from "@/components/ui/button";
import { NextStepFooter } from "@/components/NextStepFooter";
import { LINCELIN_STYLES, CDN_ASSETS } from "@/lib/gameConfig";
import type { LincelinStyleId } from "@/lib/gameConfig";
import { GlobalNavBar } from "@/components/GlobalNavBar";
import { BackButton } from "@/components/BackButton";

// ─── Constants ───
const LINCE_LOGO = CDN_ASSETS.SABELIN_FALLBACK;
const STYLES = LINCELIN_STYLES;
type StyleId = LincelinStyleId;

type GeneratedAvatar = {
  imageUrl: string;
  style: StyleId;
};

// ─── Helper: convert file to base64 ───
function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// ─── Upload Zone Component ───
function UploadZone({ onFileSelect, preview }: { onFileSelect: (file: File) => void; preview: string | null }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) onFileSelect(file);
    else toast.error("Solo se aceptan imágenes (PNG, JPG, WEBP)");
  }, [onFileSelect]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onFileSelect(file);
  }, [onFileSelect]);

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
      className={`relative cursor-pointer rounded-2xl border-2 border-dashed transition-all duration-300 overflow-hidden ${
        isDragging
          ? "border-[#00E5FF] bg-[#00E5FF]/10 scale-[1.02]"
          : preview
          ? "border-[#00E5FF]/40 bg-transparent"
          : "border-[#333] bg-[#111]/60 hover:border-[#00E5FF]/50 hover:bg-[#111]/80"
      }`}
      style={{ minHeight: preview ? "auto" : "280px" }}
    >
      <input ref={inputRef} type="file" accept="image/png,image/jpeg,image/webp" className="hidden" onChange={handleChange} />

      {preview ? (
        <div className="relative">
          <img src={preview} alt="Tu foto" className="w-full max-h-[400px] object-contain rounded-xl" />
          <div className="absolute bottom-3 right-3 px-3 py-1.5 bg-black/70 backdrop-blur-sm rounded-full text-xs text-[#00E5FF] font-medium">
            Toca para cambiar foto
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 px-6 text-center gap-4">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#00E5FF]/20 to-[#D4A843]/20 flex items-center justify-center">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#00E5FF" strokeWidth="1.5">
              <path d="M12 16V8m0 0l-3 3m3-3l3 3" />
              <path d="M3 16.5V18a3 3 0 003 3h12a3 3 0 003-3v-1.5" />
              <circle cx="12" cy="4" r="1.5" fill="#00E5FF" />
            </svg>
          </div>
          <div>
            <p className="text-white font-semibold text-lg">Sube tu foto</p>
            <p className="text-[#888] text-sm mt-1">Arrastra o toca para seleccionar</p>
            <p className="text-[#555] text-xs mt-2">PNG, JPG o WEBP · Máx 10MB</p>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Style Selector Component ───
function StyleSelector({ selected, onSelect, disabled }: { selected: StyleId[]; onSelect: (id: StyleId) => void; disabled: boolean }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
      {STYLES.map((s) => {
        const isSelected = selected.includes(s.id);
        return (
          <button
            key={s.id}
            onClick={() => onSelect(s.id)}
            disabled={disabled || (selected.length >= 3 && !isSelected)}
            className={`relative p-4 rounded-xl border-2 transition-all duration-200 text-left ${
              isSelected
                ? "border-current bg-current/10 scale-[1.02]"
                : "border-[#222] bg-[#111]/60 hover:border-[#333] hover:bg-[#111]/80"
            } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"} ${
              selected.length >= 3 && !isSelected && !disabled ? "opacity-30" : ""
            }`}
            style={{ borderColor: isSelected ? s.color : undefined, color: s.color }}
          >
            <span className="text-2xl block mb-2">{s.emoji}</span>
            <span className="text-white font-bold text-sm block">{s.label}</span>
            <span className="text-[#888] text-[11px] block mt-1 leading-tight">{s.desc}</span>
            {isSelected && (
              <div className="absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-black" style={{ backgroundColor: s.color }}>
                {selected.indexOf(s.id) + 1}
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}

// ─── Generation Progress Component ───
function GenerationProgress({ current, total, currentStyle }: { current: number; total: number; currentStyle: string }) {
  const styleName = STYLES.find(s => s.id === currentStyle)?.label || currentStyle;
  const progress = total > 0 ? (current / total) * 100 : 0;

  return (
    <div className="py-16 flex flex-col items-center gap-6">
      {/* Animated Lince */}
      <div className="relative">
        <div className="w-28 h-28 rounded-full bg-gradient-to-br from-[#00E5FF]/20 to-[#D4A843]/20 flex items-center justify-center animate-pulse">
          <img src={LINCE_LOGO} alt="LINCE" className="w-16 h-16 object-contain" />
        </div>
        <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-[#0A0A0A] border-2 border-[#00E5FF] flex items-center justify-center">
          <span className="text-[#00E5FF] text-xs font-bold">{current}/{total}</span>
        </div>
      </div>

      <div className="text-center">
        <h3 className="text-white font-bold text-xl mb-1">Generando Avatar...</h3>
        <p className="text-[#888] text-sm">Generando estilo <span className="text-[#00E5FF] font-semibold">{styleName}</span></p>
      </div>

      {/* Progress bar */}
      <div className="w-full max-w-xs">
        <div className="h-2 bg-[#1a1a1a] rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#00E5FF] to-[#D4A843] rounded-full transition-all duration-1000"
            style={{ width: `${Math.max(progress, 5)}%` }}
          />
        </div>
      </div>

      <div className="flex gap-2 mt-2">
        {["Analizando rasgos", "Creando lince", "Aplicando estilo"].map((step, i) => (
          <span key={i} className={`text-[11px] px-3 py-1 rounded-full ${
            i < current ? "bg-[#00E5FF]/20 text-[#00E5FF]" : "bg-[#1a1a1a] text-[#555]"
          }`}>{step}</span>
        ))}
      </div>
    </div>
  );
}

// ─── Result Card Component ───
function ResultCard({ avatar, index }: { avatar: GeneratedAvatar; index: number }) {
  const style = STYLES.find(s => s.id === avatar.style);
  const [sharing, setSharing] = useState(false);

  const handleDownload = async () => {
    try {
      const response = await fetch(avatar.imageUrl);
      const blob = await response.blob();
      // Add LINCELIN watermark
      const img = new Image(); img.crossOrigin = 'anonymous';
      img.onload = () => {
        const c = document.createElement('canvas'); c.width = img.width; c.height = img.height;
        const cx = c.getContext('2d'); if (!cx) return;
        cx.drawImage(img, 0, 0);
        const sh = Math.max(36, img.height * 0.06);
        cx.fillStyle = 'rgba(0,0,0,0.55)'; cx.fillRect(0, img.height - sh, img.width, sh);
        const fs = Math.max(14, Math.min(24, img.width * 0.028));
        cx.font = `bold ${fs}px 'Space Grotesk', sans-serif`; cx.textBaseline = 'middle';
        const ym = img.height - sh / 2;
        cx.fillStyle = '#00E5FF'; cx.textAlign = 'left'; cx.fillText('LINCE IA', 12, ym);
        cx.fillStyle = 'rgba(255,255,255,0.6)'; cx.textAlign = 'right'; cx.font = `${fs*0.8}px 'Space Grotesk', sans-serif`; cx.fillText('lince.app', img.width - 12, ym);
        c.toBlob((b) => {
          if (!b) return;
          const u = URL.createObjectURL(b);
          const a = document.createElement('a'); a.href = u; a.download = `mi-lincelin-${avatar.style}-${Date.now()}.png`; a.click();
          URL.revokeObjectURL(u);
          toast.success("¡Avatar descargado con marca LINCE!");
        }, 'image/png');
      };
      img.src = URL.createObjectURL(blob);
    } catch {
      toast.error("Error al descargar");
    }
  };

  const handleShare = async (platform: string) => {
    setSharing(true);
    const text = encodeURIComponent("¡Mira mi avatar LINCE! 🐱 Crea el tuyo en LINCE — la plataforma de IA gamificada 🚀");
    const url = encodeURIComponent(window.location.origin + "/crea-tu-lincelin");
    const imageUrl = encodeURIComponent(avatar.imageUrl);

    const urls: Record<string, string> = {
      twitter: `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${text}`,
      whatsapp: `https://wa.me/?text=${text}%20${url}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
      telegram: `https://t.me/share/url?url=${url}&text=${text}`,
    };

    if (urls[platform]) {
      window.open(urls[platform], "_blank", "width=600,height=400");
    }
    setTimeout(() => setSharing(false), 1000);
  };

  return (
    <div className="group relative rounded-2xl overflow-hidden bg-[#111] border border-[#222] hover:border-[#00E5FF]/30 transition-all duration-300">
      {/* Style badge */}
      <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/70 backdrop-blur-sm">
        <span className="text-sm">{style?.emoji}</span>
        <span className="text-xs font-bold" style={{ color: style?.color }}>{style?.label}</span>
      </div>

      {/* Option number */}
      <div className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full flex items-center justify-center text-sm font-black text-black" style={{ backgroundColor: style?.color }}>
        {index + 1}
      </div>

      {/* Avatar Image */}
      <div className="aspect-square bg-[#0a0a0a] flex items-center justify-center p-2">
        <img src={avatar.imageUrl} alt={`Avatar ${style?.label}`} className="w-full h-full object-contain rounded-xl" />
      </div>

      {/* Actions - ShareDownloadBar */}
        <div className="p-4">
          <ShareDownloadBar
            content={{
              type: "lincelin",
              url: avatar.imageUrl,
              text: `Mi avatar estilo ${style?.label} creado en LINCE!`,
              filename: `mi-lincelin-${avatar.style}-${Date.now()}.png`,
            }}
          />
        </div>
    </div>
  );
}









// ═══════════════════════════════════════════════
// ─── MAIN PAGE COMPONENT ───
// ═══════════════════════════════════════════════
export default function CreaTuLincelin() {
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [selectedStyles, setSelectedStyles] = useState<StyleId[]>(["urban", "neon", "classic"]);
  const [generatedAvatars, setGeneratedAvatars] = useState<GeneratedAvatar[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState({ current: 0, total: 0, currentStyle: "" });


  const uploadMutation = trpc.lincelin.uploadPhoto.useMutation();
  const generateMutation = trpc.lincelin.generate.useMutation();
  const { imageGeneration } = useFeatures();

  const handleFileSelect = useCallback(async (file: File) => {
    if (file.size > 10 * 1024 * 1024) {
      toast.error("La foto es demasiado grande (máx 10MB)");
      return;
    }
    setPhotoFile(file);
    const preview = URL.createObjectURL(file);
    setPhotoPreview(preview);
    setGeneratedAvatars([]);
  }, []);

  const handleStyleToggle = useCallback((id: StyleId) => {
    setSelectedStyles(prev => {
      if (prev.includes(id)) return prev.filter(s => s !== id);
      if (prev.length >= 3) return prev;
      return [...prev, id];
    });
  }, []);

  // Guest trial system
  const { isGuest, consumeTrial, canUseTrial, setShowConversionModal } = useGuest();

  const handleGenerate = useCallback(async () => {
    if (!imageGeneration) {
      toast.info(IMAGE_UNAVAILABLE_MSG);
      return;
    }
    if (!photoFile) {
      toast.error("Sube una foto primero");
      return;
    }
    if (selectedStyles.length === 0) {
      toast.error("Selecciona al menos un estilo");
      return;
    }
    // Guest trial gate
    if (isGuest) {
      if (!canUseTrial()) { setShowConversionModal(true); return; }
      if (!consumeTrial("lincelin")) return;
    }

    setIsGenerating(true);
    setGeneratedAvatars([]);
    setGenerationProgress({ current: 0, total: selectedStyles.length, currentStyle: selectedStyles[0] });

    try {
      // 1. Upload photo
      const base64 = await fileToBase64(photoFile);
      const mimeType = photoFile.type as "image/png" | "image/jpeg" | "image/webp";
      const { photoUrl } = await uploadMutation.mutateAsync({ photoBase64: base64, mimeType });

      // 2. Generate each style sequentially
      const results: GeneratedAvatar[] = [];
      for (let i = 0; i < selectedStyles.length; i++) {
        const style = selectedStyles[i];
        setGenerationProgress({ current: i + 1, total: selectedStyles.length, currentStyle: style });

        const result = await generateMutation.mutateAsync({ photoUrl, style });
        if (result.imageUrl) {
          results.push({ imageUrl: result.imageUrl, style });
          setGeneratedAvatars([...results]);
        }
      }

      if (results.length === 0) {
        toast.error("No se pudieron generar los avatares. Inténtalo de nuevo.");
      } else {
        // Mark LINCELIN mission as complete for welcome missions
        try { localStorage.setItem("lince-mission-lincelin", "true"); } catch {}
        toast.success(`¡${results.length} Avatar${results.length > 1 ? "es" : ""} creado${results.length > 1 ? "s" : ""}!`);
      }
    } catch (error: any) {
      toast.error(error.message || "Error al generar. Inténtalo de nuevo.");
    } finally {
      setIsGenerating(false);
    }
  }, [imageGeneration, photoFile, selectedStyles, uploadMutation, generateMutation]);

  const handleReset = useCallback(() => {
    setPhotoFile(null);
    setPhotoPreview(null);
    setGeneratedAvatars([]);
    setSelectedStyles(["urban", "neon", "classic"]);
  }, []);

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white pt-14">
      <GlobalNavBar />
      <BackButton variant="inline" />
      {/* Hero Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#00E5FF]/5 via-transparent to-transparent" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#00E5FF]/3 rounded-full blur-[200px]" />

        <div className="container relative pt-24 pb-12 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#00E5FF]/30 bg-[#00E5FF]/5 mb-6">
            <span className="w-2 h-2 rounded-full bg-[#00E5FF] animate-pulse" />
            <span className="text-[#00E5FF] text-xs font-medium tracking-wide">GENERADOR IA</span>
          </div>

          <h1 className="font-display font-black text-4xl sm:text-5xl lg:text-7xl leading-[0.95] mb-4">
            CREA TU{" "}
            <span className="bg-gradient-to-r from-[#00E5FF] via-[#00E5FF] to-[#D4A843] bg-clip-text text-transparent">
              Mi Avatar
            </span>
          </h1>

          <p className="text-white/50 text-lg sm:text-xl max-w-xl mx-auto leading-relaxed mb-4">
            Sube tu foto y nuestra IA creará tu avatar como <strong className="text-white">lince ibérico</strong> personalizado.
            Elige hasta 3 estilos y comparte en redes sociales.
          </p>

          <div className="flex justify-center gap-8 mt-6 text-base">
            <div className="flex items-center gap-2.5 text-white/50">
              <span className="w-2.5 h-2.5 rounded-full bg-[#00E5FF]" />
              <span className="font-semibold">Sube tu foto</span>
            </div>
            <div className="flex items-center gap-2.5 text-white/50">
              <span className="w-2.5 h-2.5 rounded-full bg-[#D4A843]" />
              <span className="font-semibold">Elige 3 estilos</span>
            </div>
            <div className="flex items-center gap-2.5 text-white/50">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FF6B35]" />
              <span className="font-semibold">Comparte</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container pb-24">
        {!imageGeneration && (
          <div className="max-w-2xl mx-auto mb-10 rounded-2xl border border-[#D4A843]/30 bg-[#D4A843]/5 p-6 text-center">
            <p className="text-[#D4A843] font-bold text-lg mb-1">Próximamente</p>
            <p className="text-white/60 text-sm">{IMAGE_UNAVAILABLE_MSG}</p>
          </div>
        )}
        {imageGeneration && (<>
        {/* Step 1: Upload */}
        <div className="max-w-2xl mx-auto mb-10">
          <div className="flex items-center gap-4 mb-5">
            <div className="w-10 h-10 rounded-full bg-[#00E5FF] text-black font-black text-lg flex items-center justify-center">1</div>
            <h2 className="text-white font-bold text-xl sm:text-2xl">Sube tu foto</h2>
            {photoPreview && (
              <button onClick={handleReset} className="ml-auto text-xs text-[#888] hover:text-[#00E5FF] transition-colors">
                Cambiar foto
              </button>
            )}
          </div>
          <UploadZone onFileSelect={handleFileSelect} preview={photoPreview} />
        </div>

        {/* Step 2: Select Styles */}
        {photoPreview && (
          <div className="max-w-3xl mx-auto mb-10">
            <div className="flex items-center gap-4 mb-5">
              <div className="w-10 h-10 rounded-full bg-[#D4A843] text-black font-black text-lg flex items-center justify-center">2</div>
              <h2 className="text-white font-bold text-xl sm:text-2xl">Elige hasta 3 estilos</h2>
              <span className="ml-auto text-sm text-white/40 font-semibold">{selectedStyles.length}/3 seleccionados</span>
            </div>
            <StyleSelector selected={selectedStyles} onSelect={handleStyleToggle} disabled={isGenerating} />
          </div>
        )}

        {/* Generate Button */}
        {photoPreview && selectedStyles.length > 0 && !isGenerating && generatedAvatars.length === 0 && (
          <div className="text-center mb-12">
            <button
              onClick={handleGenerate}
              className="relative px-10 py-4 rounded-2xl font-black text-lg text-black bg-gradient-to-r from-[#00E5FF] to-[#D4A843] hover:brightness-110 active:scale-95 transition-all shadow-[0_0_30px_rgba(0,229,255,0.3)]"
            >
              <span className="relative z-10 flex items-center gap-2">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
                CREAR MI AVATAR
              </span>
            </button>
            <p className="text-[#555] text-xs mt-3">Generación con IA · {selectedStyles.length} estilo{selectedStyles.length > 1 ? "s" : ""} · ~30 segundos cada uno</p>
          </div>
        )}

        {/* Generation Progress */}
        {isGenerating && (
          <GenerationProgress
            current={generationProgress.current}
            total={generationProgress.total}
            currentStyle={generationProgress.currentStyle}
          />
        )}

        {/* Results */}
        {generatedAvatars.length > 0 && (
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-full bg-[#FF6B35] text-black font-black text-sm flex items-center justify-center">3</div>
              <h2 className="text-white font-bold text-lg">
                {generatedAvatars.length === 1 ? "Tu Avatar" : `Tus ${generatedAvatars.length} Avatares`}
              </h2>
              {!isGenerating && (
                <button
                  onClick={handleGenerate}
                  className="ml-auto text-xs text-[#00E5FF] hover:text-white transition-colors flex items-center gap-1"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M1 4v6h6M23 20v-6h-6" />
                    <path d="M20.49 9A9 9 0 005.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 013.51 15" />
                  </svg>
                  Regenerar
                </button>
              )}
            </div>

            <div className={`grid gap-6 ${
              generatedAvatars.length === 1 ? "grid-cols-1 max-w-sm mx-auto" :
              generatedAvatars.length === 2 ? "grid-cols-1 sm:grid-cols-2 max-w-2xl mx-auto" :
              "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
            }`}>
              {generatedAvatars.map((avatar, i) => (
                <ResultCard key={`${avatar.style}-${i}`} avatar={avatar} index={i} />
              ))}
            </div>


          </div>
        )}
        </>)}

      </div>

      {/* P2-9: Next Step Footer */}
      <NextStepFooter currentPath="/crea-tu-lincelin" />

      {/* Accessibility: skip link */}
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-[#00E5FF] text-black px-4 py-2 rounded-lg font-bold z-50">
        Ir al contenido principal
      </a>
    </div>
  );
}

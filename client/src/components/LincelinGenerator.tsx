import { tl } from "@/contexts/PRDLanguageContext";
import { useState, useEffect, useRef, useCallback } from "react";
import { trpc } from "@/lib/trpc";

const LINCE_LOGO = "/assets/jtEEtbRUpTtEBKGn.png";

// 5 minutes in seconds
const REQUIRED_TIME_SECONDS = 5 * 60;
const TIMER_STORAGE_KEY = "lince-engagement-timer";
const LINCELIN_STORAGE_KEY = "lince-lincelin-url";

type Lang = "es" | "en" | "zh" | "pt-BR" | "pt-PT";

const T: Record<string, Record<string, string>> = {
  es: {
    lockedTitle: "CREA TU PROPIO AVATAR",
    lockedSub: "Explora la plataforma durante 5 minutos para desbloquear el generador de avatares",
    timeLeft: "Tiempo restante",
    tipExplore: "Toca a los artistas de la Crew para hablar con ellos y aprender sobre IA",
    unlockedTitle: "GENERADOR DE AVATAR",
    unlockedSub: "Sube tu foto y te convertimos en un lince ibérico con tu estilo",
    uploadBtn: "SUBIR MI FOTO",
    uploadHint: "Solo fotos de tu rostro. Sin contenido inapropiado.",
    generating: "Creando tu avatar...",
    generatingHint: "Estamos extrayendo tus rasgos y transformándote en lince ibérico...",
    ready: "TU AVATAR ESTÁ LISTO",
    shareWhatsapp: "Compartir por WhatsApp",
    shareInstagram: "Guardar para Instagram",
    download: "Descargar imagen",
    useAsProfile: "Usar como foto de perfil",
    tryAgain: "Generar otro estilo",
    styleUrban: "MUSICALIN",
    styleClassic: "Clásico",
    styleNeon: "Neón",
    styleRetro: "Retro",
    styleMinimal: "Minimal",
    selectStyle: "Elige tu estilo:",
    errorUpload: "Error al subir la foto. Inténtalo de nuevo.",
    errorGenerate: "Error al generar. Inténtalo de nuevo.",
    photoRules: "Tu foto debe mostrar tu rostro claramente. No se aceptan fotos de otras personas, contenido inapropiado ni imágenes con menores de 13 años.",
    contact: "Contacto: info@acnb.es",
    minutes: "min",
    seconds: "seg",
  },
  en: {
    lockedTitle: "CREATE YOUR OWN AVATAR",
    lockedSub: "Explore the platform for 5 minutes to unlock the avatar generator",
    timeLeft: "Time remaining",
    tipExplore: "Tap the Crew artists to chat with them and learn about AI",
    unlockedTitle: "AVATAR GENERATOR",
    unlockedSub: "Upload your photo and we'll turn you into an Iberian lynx with your style",
    uploadBtn: "UPLOAD MY PHOTO",
    uploadHint: "Face photos only. No inappropriate content.",
    generating: "Creating your avatar...",
    generatingHint: "We're extracting your traits and transforming you into an Iberian lynx...",
    ready: "YOUR AVATAR IS READY",
    shareWhatsapp: "Share on WhatsApp",
    shareInstagram: "Save for Instagram",
    download: "Download image",
    useAsProfile: "Use as profile picture",
    tryAgain: "Generate another style",
    styleUrban: "Urban",
    styleClassic: "Classic",
    styleNeon: "Neon",
    styleRetro: "Retro",
    styleMinimal: "Minimal",
    selectStyle: "Choose your style:",
    errorUpload: "Error uploading photo. Try again.",
    errorGenerate: "Error generating. Try again.",
    photoRules: "Your photo must clearly show your face. No photos of other people, inappropriate content, or images with minors under 13.",
    contact: "Contact: info@acnb.es",
    minutes: "min",
    seconds: "sec",
  },
  zh: {
    lockedTitle: "Mi Avatar",
    lockedSub: "探索平台5分钟以解锁头像生成器",
    timeLeft: "剩余时间",
    tipExplore: "点击Crew艺术家与他们聊天并了解AI",
    unlockedTitle: "我的角色生成器",
    unlockedSub: "上传你的照片，我们将把你变成一只具有你风格的伊比利亚猞猁",
    uploadBtn: "上传我的照片",
    uploadHint: "仅限面部照片。禁止不当内容。",
    generating: "正在生成...",
    generatingHint: "我们正在提取你的特征并将你变成伊比利亚猞猁...",
    ready: "你的角色已准备好",
    shareWhatsapp: "通过WhatsApp分享",
    shareInstagram: "保存到Instagram",
    download: "下载图片",
    useAsProfile: "用作头像",
    tryAgain: "生成另一种风格",
    styleUrban: "都市",
    styleClassic: "经典",
    styleNeon: "霓虹",
    styleRetro: "复古",
    styleMinimal: "简约",
    selectStyle: "选择你的风格：",
    errorUpload: "上传照片出错。请重试。",
    errorGenerate: "生成出错。请重试。",
    photoRules: "你的照片必须清楚地显示你的面部。禁止他人照片、不当内容或13岁以下未成年人的图片。",
    contact: "联系方式：info@acnb.es",
    minutes: "分",
    seconds: "秒",
  },
};

const STYLES = ["urban", "classic", "neon", "retro", "minimal"] as const;

type GeneratorState = "locked" | "upload" | "generating" | "ready";

export function LincelinGenerator({ lang }: { lang: Lang }) {
  const t = T[lang] || T.es;
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Timer state
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [state, setState] = useState<GeneratorState>("locked");
  const [selectedStyle, setSelectedStyle] = useState<typeof STYLES[number]>("urban");
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [generatedUrl, setGeneratedUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploadedPhotoUrl, setUploadedPhotoUrl] = useState<string | null>(null);

  const uploadMutation = trpc.lincelin.uploadPhoto.useMutation();
  const generateMutation = trpc.lincelin.generate.useMutation();

  // Load timer from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(TIMER_STORAGE_KEY);
      if (stored) {
        const data = JSON.parse(stored);
        const elapsed = data.elapsed || 0;
        setElapsedSeconds(elapsed);
        if (elapsed >= REQUIRED_TIME_SECONDS) {
          setState("upload");
        }
      }
      // Check if user already has a LINCELIN
      const savedUrl = localStorage.getItem(LINCELIN_STORAGE_KEY);
      if (savedUrl) {
        setGeneratedUrl(savedUrl);
        setState("ready");
      }
    } catch {}
  }, []);

  // Timer tick
  useEffect(() => {
    if (state !== "locked") return;
    const interval = setInterval(() => {
      setElapsedSeconds((prev) => {
        const next = prev + 1;
        try {
          localStorage.setItem(TIMER_STORAGE_KEY, JSON.stringify({ elapsed: next, lastUpdate: Date.now() }));
        } catch {}
        if (next >= REQUIRED_TIME_SECONDS) {
          setState("upload");
        }
        return next;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [state]);

  const remainingSeconds = Math.max(0, REQUIRED_TIME_SECONDS - elapsedSeconds);
  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;
  const progress = Math.min(100, (elapsedSeconds / REQUIRED_TIME_SECONDS) * 100);

  // Upload photo: convert to base64, send to server, get S3 URL
  const handleFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError(t.errorUpload);
      return;
    }
    // Validate size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError(t.errorUpload);
      return;
    }

    setError(null);

    // Convert to base64
    const base64 = await new Promise<string>((resolve) => {
      const r = new FileReader();
      r.onload = () => resolve(r.result as string);
      r.readAsDataURL(file);
    });

    // Show preview
    setPhotoPreview(base64);

    // Upload to S3 via tRPC
    try {
      const mimeType = file.type as "image/png" | "image/jpeg" | "image/webp";
      const result = await uploadMutation.mutateAsync({
        photoBase64: base64,
        mimeType: ["image/png", "image/jpeg", "image/webp"].includes(mimeType) ? mimeType : "image/png",
      });
      if (result.success && result.photoUrl) {
        setUploadedPhotoUrl(result.photoUrl);
      } else {
        setError(t.errorUpload);
      }
    } catch {
      setError(t.errorUpload);
    }
  }, [t, uploadMutation]);

  // Generate LINCELIN using the uploaded S3 URL
  const handleGenerate = useCallback(async () => {
    if (!uploadedPhotoUrl) return;
    setError(null);
    setState("generating");

    try {
      const result = await generateMutation.mutateAsync({
        photoUrl: uploadedPhotoUrl,
        style: selectedStyle,
      });

      if (result.success && result.imageUrl) {
        setGeneratedUrl(result.imageUrl);
        setState("ready");
        localStorage.setItem(LINCELIN_STORAGE_KEY, result.imageUrl);
      } else {
        setError(t.errorGenerate);
        setState("upload");
      }
    } catch (err: any) {
      setError(err.message || t.errorGenerate);
      setState("upload");
    }
  }, [uploadedPhotoUrl, selectedStyle, generateMutation, t]);

  // Share functions
  const shareWhatsApp = () => {
    if (!generatedUrl) return;
    const text = tl(lang, { es: "¡Mira mi avatar LINCE! Creado con LINCE 🐱", en: "Check out my LINCE avatar! Created with LINCE 🐱", zh: "看看我的LINCE角色！用LINCE创建 🐱", 'pt-BR': "¡Mira mi avatar LINCE! Creado con LINCE 🐱", 'pt-PT': "¡Mira mi avatar LINCE! Creado con LINCE 🐱" });
    window.open(`https://wa.me/?text=${encodeURIComponent(text + " " + generatedUrl)}`, "_blank");
  };

  const shareInstagram = () => {
    if (!generatedUrl) return;
    // Download the image for Instagram
    downloadImage();
  };

  const downloadImage = () => {
    if (!generatedUrl) return;
    const a = document.createElement("a");
    a.href = generatedUrl;
    a.download = "mi-lincelin-lince.png";
    a.target = "_blank";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const useAsProfile = () => {
    if (!generatedUrl) return;
    try {
      const stored = localStorage.getItem("lince-user");
      if (stored) {
        const user = JSON.parse(stored);
        user.avatar = generatedUrl;
        user.lincelinUrl = generatedUrl;
        localStorage.setItem("lince-user", JSON.stringify(user));
        // Dispatch event so other components update
        window.dispatchEvent(new Event("storage"));
        window.dispatchEvent(new CustomEvent("lince-avatar-updated", { detail: { url: generatedUrl } }));
      }
    } catch {}
  };

  const resetGenerator = () => {
    setPhotoPreview(null);
    setUploadedPhotoUrl(null);
    setGeneratedUrl(null);
    setState("upload");
    localStorage.removeItem(LINCELIN_STORAGE_KEY);
  };

  // ─── LOCKED STATE ───
  if (state === "locked") {
    return (
      <section className="py-16 sm:py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#00E5FF]/3 to-transparent" />
        <div className="container relative z-10 px-4">
          <div className="max-w-lg mx-auto text-center">
            {/* Lock icon */}
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-white/5 border-2 border-white/10 flex items-center justify-center relative">
              <svg className="w-8 h-8 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              {/* Pulsing ring */}
              <div className="absolute inset-0 rounded-full border-2 border-[#00E5FF]/20 animate-ping" />
            </div>

            <h3 className="font-display font-black text-2xl sm:text-3xl text-white mb-2">
              {t.lockedTitle}
            </h3>
            <p className="text-white/40 text-sm mb-8">{t.lockedSub}</p>

            {/* Progress bar */}
            <div className="w-full bg-white/5 rounded-full h-3 mb-4 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#00E5FF] to-[#FF6B35] rounded-full transition-all duration-1000"
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* Timer */}
            <div className="flex items-center justify-center gap-2 mb-6">
              <span className="text-white/40 text-sm">{t.timeLeft}:</span>
              <span className="font-display font-bold text-xl text-[#00E5FF]">
                {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
              </span>
            </div>

            {/* Tip */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FF6B35]/5 border border-[#FF6B35]/10">
              <span className="text-[#FF6B35]/60 text-xs">{t.tipExplore}</span>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // ─── UPLOAD STATE ───
  if (state === "upload") {
    return (
      <section className="py-16 sm:py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#00E5FF]/3 to-transparent" />
        <div className="container relative z-10 px-4">
          <div className="max-w-lg mx-auto text-center">
            {/* Unlocked icon */}
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[#00E5FF]/10 border-2 border-[#00E5FF]/30 flex items-center justify-center">
              <img src={LINCE_LOGO} alt="LINCE" className="w-12 h-12 rounded-full" />
            </div>

            <h3 className="font-display font-black text-2xl sm:text-3xl text-white mb-2">
              {t.unlockedTitle}
            </h3>
            <p className="text-white/40 text-sm mb-6">{t.unlockedSub}</p>

            {/* Style selector */}
            <p className="text-white/30 text-xs mb-3">{t.selectStyle}</p>
            <div className="flex flex-wrap justify-center gap-2 mb-6">
              {STYLES.map((s) => (
                <button
                  key={s}
                  onClick={() => setSelectedStyle(s)}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                    selectedStyle === s
                      ? "bg-[#00E5FF]/20 border border-[#00E5FF]/50 text-[#00E5FF]"
                      : "bg-white/5 border border-white/10 text-white/40 hover:bg-white/10"
                  }`}
                >
                  {t[`style${s.charAt(0).toUpperCase() + s.slice(1)}` as keyof typeof t] || s}
                </button>
              ))}
            </div>

            {/* Photo preview */}
            {photoPreview && (
              <div className="mb-6">
                <div className="w-32 h-32 mx-auto rounded-full overflow-hidden border-3 border-[#00E5FF]/40 shadow-[0_0_30px_rgba(0,229,255,0.2)]">
                  <img src={photoPreview} alt="Tu foto" className="w-full h-full object-cover" />
                </div>
              </div>
            )}

            {/* Upload button */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              className="hidden"
              onChange={handleFileSelect}
            />

            {!photoPreview ? (
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full max-w-xs mx-auto py-4 bg-gradient-to-r from-[#00E5FF] to-[#00B8D4] text-black font-black text-sm rounded-xl hover:brightness-110 transition-all shadow-[0_0_20px_rgba(0,229,255,0.3)] mb-4"
              >
                {t.uploadBtn}
              </button>
            ) : (
              <div className="space-y-3">
                <button
                  onClick={handleGenerate}
                  disabled={!uploadedPhotoUrl}
                  className="w-full max-w-xs mx-auto py-4 bg-gradient-to-r from-[#FF6B35] to-[#FF8F65] text-black font-black text-sm rounded-xl hover:brightness-110 transition-all shadow-[0_0_20px_rgba(255,107,53,0.3)] disabled:opacity-50"
                >
                  {tl(lang, { es: "GENERAR MI AVATAR", en: "GENERATE MY AVATAR", zh: "生成我的角色", 'pt-BR': "GENERAR MI AVATAR", 'pt-PT': "GENERAR MI AVATAR" })}
                </button>
                <button
                  onClick={() => { setPhotoPreview(null); setUploadedPhotoUrl(null); fileInputRef.current?.click(); }}
                  className="text-white/30 text-xs hover:text-white/50 transition-colors"
                >
                  {tl(lang, { es: "Cambiar foto", en: "Change photo", zh: "更换照片", 'pt-BR': "Cambiar foto", 'pt-PT': "Cambiar foto" })}
                </button>
              </div>
            )}

            <p className="text-white/20 text-[10px] mt-4 max-w-sm mx-auto">{t.uploadHint}</p>
            <p className="text-white/15 text-[9px] mt-2 max-w-sm mx-auto">{t.photoRules}</p>

            {error && (
              <div className="mt-4 px-4 py-2 rounded-lg bg-red-500/10 border border-red-500/30">
                <p className="text-red-400 text-xs">{error}</p>
              </div>
            )}

            <p className="text-white/15 text-[9px] mt-4">{t.contact}</p>
          </div>
        </div>
      </section>
    );
  }

  // ─── GENERATING STATE ───
  if (state === "generating") {
    return (
      <section className="py-16 sm:py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#00E5FF]/3 to-transparent" />
        <div className="container relative z-10 px-4">
          <div className="max-w-lg mx-auto text-center">
            {/* Spinning animation */}
            <div className="w-24 h-24 mx-auto mb-6 relative">
              <div className="absolute inset-0 rounded-full border-4 border-[#00E5FF]/20" />
              <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#00E5FF] animate-spin" />
              {photoPreview && (
                <div className="absolute inset-2 rounded-full overflow-hidden">
                  <img src={photoPreview} alt="" className="w-full h-full object-cover opacity-50" />
                </div>
              )}
            </div>

            <h3 className="font-display font-black text-2xl text-white mb-2">
              {t.generating}
            </h3>
            <p className="text-white/40 text-sm mb-4">{t.generatingHint}</p>

            {/* Progress dots */}
            <div className="flex justify-center gap-2">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-3 h-3 rounded-full bg-[#00E5FF]"
                  style={{
                    animation: "pulse 1.5s ease-in-out infinite",
                    animationDelay: `${i * 0.3}s`,
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  // ─── READY STATE ───
  return (
    <section className="py-16 sm:py-24 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#FF6B35]/3 to-transparent" />
      <div className="container relative z-10 px-4">
        <div className="max-w-lg mx-auto text-center">
          <h3 className="font-display font-black text-2xl sm:text-3xl text-white mb-6">
            {t.ready}
          </h3>

          {/* Generated avatar */}
          {generatedUrl && (
            <div className="mb-8">
              <div className="w-48 h-48 sm:w-64 sm:h-64 mx-auto rounded-2xl overflow-hidden border-3 border-[#FF6B35]/40 shadow-[0_0_40px_rgba(255,107,53,0.3)]">
                <img src={generatedUrl} alt="Tu Avatar" className="w-full h-full object-cover" />
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="space-y-3 max-w-xs mx-auto">
            {/* WhatsApp */}
            <button
              onClick={shareWhatsApp}
              className="w-full py-3 bg-[#25D366]/20 border border-[#25D366]/40 text-[#25D366] font-bold text-sm rounded-xl hover:bg-[#25D366]/30 transition-colors flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              {t.shareWhatsapp}
            </button>

            {/* Instagram / Download */}
            <button
              onClick={shareInstagram}
              className="w-full py-3 bg-gradient-to-r from-[#833AB4]/20 via-[#FD1D1D]/20 to-[#F77737]/20 border border-[#FD1D1D]/30 text-white font-bold text-sm rounded-xl hover:brightness-110 transition-all flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
              </svg>
              {t.shareInstagram}
            </button>

            {/* Download */}
            <button
              onClick={downloadImage}
              className="w-full py-3 bg-white/5 border border-white/10 text-white font-bold text-sm rounded-xl hover:bg-white/10 transition-colors flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              {t.download}
            </button>

            {/* Use as profile */}
            <button
              onClick={useAsProfile}
              className="w-full py-3 bg-[#FF6B35]/10 border border-[#FF6B35]/30 text-[#FF6B35] font-bold text-sm rounded-xl hover:bg-[#FF6B35]/20 transition-colors flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              {t.useAsProfile}
            </button>

            {/* Try again */}
            <button
              onClick={resetGenerator}
              className="text-white/30 text-xs hover:text-white/50 transition-colors mt-2"
            >
              {t.tryAgain}
            </button>
          </div>

          <p className="text-white/15 text-[9px] mt-6">{t.contact}</p>
        </div>
      </div>
    </section>
  );
}

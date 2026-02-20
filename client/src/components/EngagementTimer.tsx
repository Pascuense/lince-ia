import { useState, useEffect, useRef, useCallback } from "react";

const TIMER_KEY = "lince-engagement-timer-v2";
const THANK_YOU_DISMISSED_KEY = "lince-thankyou-dismissed";
const TOTAL_SECONDS = 5 * 60; // 5 minutes

type Lang = "es" | "en" | "zh" | "pt-BR" | "pt-PT";

// ─── Trait Options ───
const HAIR_COLORS = [
  { id: "black", es: "Negro", en: "Black", zh: "黑色", hex: "#1a1a1a" },
  { id: "brown", es: "Castaño", en: "Brown", zh: "棕色", hex: "#6B3A2A" },
  { id: "blonde", es: "Rubio", en: "Blonde", zh: "金色", hex: "#D4A843" },
  { id: "red", es: "Pelirrojo", en: "Red", zh: "红色", hex: "#B33A1F" },
  { id: "gray", es: "Gris/Canoso", en: "Gray/White", zh: "灰白", hex: "#A0A0A0" },
  { id: "colored", es: "Color fantasía", en: "Fantasy color", zh: "彩色", hex: "#9B59B6" },
];

const HAIR_STYLES = [
  { id: "short", es: "Corto", en: "Short", zh: "短发" },
  { id: "medium", es: "Medio", en: "Medium", zh: "中长" },
  { id: "long", es: "Largo", en: "Long", zh: "长发" },
  { id: "curly", es: "Rizado", en: "Curly", zh: "卷发" },
  { id: "bald", es: "Calvo/Rapado", en: "Bald/Shaved", zh: "光头" },
  { id: "braids", es: "Trenzas", en: "Braids", zh: "辫子" },
];

const SKIN_TONES = [
  { id: "light", es: "Clara", en: "Light", zh: "浅色", hex: "#FDDBB4" },
  { id: "medium", es: "Media", en: "Medium", zh: "中等", hex: "#C68642" },
  { id: "olive", es: "Oliva", en: "Olive", zh: "橄榄色", hex: "#A67C52" },
  { id: "dark", es: "Oscura", en: "Dark", zh: "深色", hex: "#6B4226" },
];

const ACCESSORIES_LIST = [
  { id: "glasses", es: "Gafas", en: "Glasses", zh: "眼镜", emoji: "👓" },
  { id: "sunglasses", es: "Gafas de sol", en: "Sunglasses", zh: "太阳镜", emoji: "🕶️" },
  { id: "earrings", es: "Pendientes", en: "Earrings", zh: "耳环", emoji: "💎" },
  { id: "hat", es: "Gorra/Sombrero", en: "Hat/Cap", zh: "帽子", emoji: "🧢" },
  { id: "headphones", es: "Auriculares", en: "Headphones", zh: "耳机", emoji: "🎧" },
  { id: "piercing", es: "Piercing", en: "Piercing", zh: "穿孔", emoji: "✨" },
  { id: "tattoo", es: "Tatuajes", en: "Tattoos", zh: "纹身", emoji: "🎨" },
  { id: "beard", es: "Barba", en: "Beard", zh: "胡子", emoji: "🧔" },
];

const STYLES = [
  { id: "urban", es: "MUSICALIN", en: "MUSICALIN", zh: "都市", emoji: "🏙️" },
  { id: "classic", es: "Clásico", en: "Classic", zh: "经典", emoji: "✨" },
  { id: "neon", es: "Neón", en: "Neon", zh: "霓虹", emoji: "💜" },
  { id: "retro", es: "Retro", en: "Retro", zh: "复古", emoji: "📼" },
  { id: "minimal", es: "Minimal", en: "Minimal", zh: "简约", emoji: "🤍" },
];

const T: Record<string, Record<string, string>> = {
  es: {
    exploring: "Explorando LINCE",
    timeLeft: "Tiempo explorando",
    tip: "Habla con los artistas, juega y aprende IA",
    thankTitle: "¡GRACIAS POR ESTAR AQUÍ!",
    thankText: "Llevas 5 minutos aprendiendo sin darte cuenta. Eso es lo que hace LINCE: te enseña IA mientras te diviertes.",
    thankSub: "¡Confía en el proceso, esto va a ser BESTIAL! Mientras tanto...",
    giftTitle: "¡TE REGALAMOS ALGO!",
    giftText: "Crea tu propio avatar de LINCE IBÉRICO con tus rasgos. Solo tienes que seguir estos pasos:",
    step1: "PASO 1: Describe cómo eres",
    step2: "PASO 2: Elige tu estilo",
    step3: "PASO 3: Copia el prompt y pégalo en cualquier IA",
    orUpload: "O sube tu foto para que lo hagamos automático",
    uploadBtn: "SUBIR MI FOTO",
    uploadHint: "Analizaremos tus rasgos automáticamente",
    hairColor: "Color de pelo",
    hairStyle: "Tipo de pelo",
    skinTone: "Tono de piel",
    accessories: "Accesorios (elige los que tengas)",
    artStyle: "Estilo artístico",
    generatePrompt: "GENERAR MI PROMPT",
    yourPrompt: "TU PROMPT PERSONALIZADO",
    promptReady: "¡Listo! Copia este texto y pégalo en cualquiera de estas IAs:",
    copyPrompt: "COPIAR PROMPT",
    copied: "¡COPIADO!",
    openGemini: "Abrir Gemini",
    openChatGPT: "Abrir ChatGPT",
    openGrok: "Abrir Grok",
    openCopilot: "Abrir Copilot",
    howTo: "¿Cómo usarlo? Muy fácil:",
    howToStep1: "1. Copia el prompt con el botón de arriba",
    howToStep2: "2. Abre cualquiera de las IAs de abajo",
    howToStep3: "3. Pega el texto y adjunta tu foto",
    howToStep4: "4. ¡La IA creará tu avatar de lince ibérico!",
    backToApp: "VOLVER A LINCE",
    analyzingPhoto: "Analizando tu foto...",
    photoAnalyzed: "¡Rasgos detectados! Revisa y ajusta si quieres:",
    minutes: "min",
    seconds: "seg",
    followUs: "Síguenos en Instagram para ver los mejores LINCELINS",
    madeWith: "Hecho con LINCE — Aprende IA de forma fácil y divertida",
  },
  en: {
    exploring: "Exploring LINCE",
    timeLeft: "Time exploring",
    tip: "Talk to the artists, play and learn AI",
    thankTitle: "THANK YOU FOR BEING HERE!",
    thankText: "You've been learning for 5 minutes without even realizing it. That's what LINCE does: it teaches you AI while you have fun.",
    thankSub: "Trust the process — this is going to be EPIC! Meanwhile...",
    giftTitle: "WE HAVE A GIFT FOR YOU!",
    giftText: "Create your own IBERIAN LYNX avatar with your features. Just follow these steps:",
    step1: "STEP 1: Describe yourself",
    step2: "STEP 2: Choose your style",
    step3: "STEP 3: Copy the prompt and paste it in any AI",
    orUpload: "Or upload your photo for automatic detection",
    uploadBtn: "UPLOAD MY PHOTO",
    uploadHint: "We'll analyze your features automatically",
    hairColor: "Hair color",
    hairStyle: "Hair type",
    skinTone: "Skin tone",
    accessories: "Accessories (select what you have)",
    artStyle: "Art style",
    generatePrompt: "GENERATE MY PROMPT",
    yourPrompt: "YOUR PERSONALIZED PROMPT",
    promptReady: "Ready! Copy this text and paste it in any of these AIs:",
    copyPrompt: "COPY PROMPT",
    copied: "COPIED!",
    openGemini: "Open Gemini",
    openChatGPT: "Open ChatGPT",
    openGrok: "Open Grok",
    openCopilot: "Open Copilot",
    howTo: "How to use it? Super easy:",
    howToStep1: "1. Copy the prompt with the button above",
    howToStep2: "2. Open any of the AIs below",
    howToStep3: "3. Paste the text and attach your photo",
    howToStep4: "4. The AI will create your Iberian lynx avatar!",
    backToApp: "BACK TO LINCE",
    analyzingPhoto: "Analyzing your photo...",
    photoAnalyzed: "Features detected! Review and adjust if needed:",
    minutes: "min",
    seconds: "sec",
    followUs: "Follow us on Instagram to see the best LINCELINS",
    madeWith: "Made with LINCE — Learn AI the easy and fun way",
  },
  zh: {
    exploring: "探索LINCE",
    timeLeft: "探索时间",
    tip: "与艺术家交谈，玩耍并学习AI",
    thankTitle: "感谢你的到来！",
    thankText: "你已经不知不觉学习了5分钟。这就是LINCE的魔力：在你玩乐的同时教你AI。",
    thankSub: "相信这个过程，这将会非常震撼！同时...",
    giftTitle: "送你一份礼物！",
    giftText: "用你的特征创建自己的伊比利亚猞猁头像。只需按照以下步骤：",
    step1: "步骤1：描述你的外貌",
    step2: "步骤2：选择你的风格",
    step3: "步骤3：复制提示词并粘贴到任何AI中",
    orUpload: "或上传你的照片自动检测",
    uploadBtn: "上传我的照片",
    uploadHint: "我们将自动分析你的特征",
    hairColor: "发色",
    hairStyle: "发型",
    skinTone: "肤色",
    accessories: "配饰（选择你有的）",
    artStyle: "艺术风格",
    generatePrompt: "生成我的提示词",
    yourPrompt: "你的个性化提示词",
    promptReady: "准备好了！复制此文本并粘贴到以下任何AI中：",
    copyPrompt: "复制提示词",
    copied: "已复制！",
    openGemini: "打开Gemini",
    openChatGPT: "打开ChatGPT",
    openGrok: "打开Grok",
    openCopilot: "打开Copilot",
    howTo: "如何使用？超级简单：",
    howToStep1: "1. 用上面的按钮复制提示词",
    howToStep2: "2. 打开下面任何一个AI",
    howToStep3: "3. 粘贴文本并附上你的照片",
    howToStep4: "4. AI将创建你的伊比利亚猞猁头像！",
    backToApp: "返回LINCE",
    analyzingPhoto: "正在分析你的照片...",
    photoAnalyzed: "特征已检测！如需调整请修改：",
    minutes: "分",
    seconds: "秒",
    followUs: "在Instagram上关注我们，查看最佳LINCELINS",
    madeWith: "由LINCE制作 — 轻松有趣地学习AI",
  },
};

// ─── Build the perfect prompt ───
function buildLincelinPrompt(traits: {
  hairColor: string;
  hairStyle: string;
  skinTone: string;
  accessories: string[];
  artStyle: string;
  photoAttached: boolean;
}, lang: Lang): string {
  const hairColorLabel = HAIR_COLORS.find(h => h.id === traits.hairColor)?.[lang === "pt-BR" || lang === "pt-PT" ? "es" : lang === "zh" ? "zh" : lang === "en" ? "en" : "es"] || traits.hairColor;
  const hairStyleLabel = HAIR_STYLES.find(h => h.id === traits.hairStyle)?.[lang === "pt-BR" || lang === "pt-PT" ? "es" : lang === "zh" ? "zh" : lang === "en" ? "en" : "es"] || traits.hairStyle;
  const skinToneLabel = SKIN_TONES.find(s => s.id === traits.skinTone)?.[lang === "pt-BR" || lang === "pt-PT" ? "es" : lang === "zh" ? "zh" : lang === "en" ? "en" : "es"] || traits.skinTone;
  const styleLabel = STYLES.find(s => s.id === traits.artStyle)?.[lang === "pt-BR" || lang === "pt-PT" ? "es" : lang === "zh" ? "zh" : lang === "en" ? "en" : "es"] || traits.artStyle;

  const accessoryLabels = traits.accessories.map(a => {
    const item = ACCESSORIES_LIST.find(acc => acc.id === a);
    return item ? item[lang === "pt-BR" || lang === "pt-PT" ? "es" : lang === "zh" ? "zh" : lang === "en" ? "en" : "es"] : a;
  });

  const styleModifiers: Record<string, string> = {
    urban: "Street fashion, gold chains, sneakers, graffiti-style background with neon cyan and orange glow",
    classic: "Elegant attire, warm golden lighting, classic portrait composition with subtle circuit patterns",
    neon: "Futuristic neon outfit, intense cyan/magenta/purple glow, holographic effects, cyberpunk city background",
    retro: "80s/90s retro fashion, synthwave colors, VHS aesthetic, pixel art elements in background",
    minimal: "Clean simple outfit, soft pastel accents, minimal background with gentle gradient",
  };

  const photoInstruction = traits.photoAttached
    ? `\n\nIMPORTANT: I'm attaching my photo. Please extract my exact facial features, expression, and any details you can see from the photo and apply them to the lynx character.`
    : "";

  return `Transform me into an anthropomorphic Iberian lynx (lince ibérico) character in the LINCE art style.

MY FEATURES:
- Hair: ${hairColorLabel}, ${hairStyleLabel}
- Skin tone: ${skinToneLabel} (map this to the warmth/shade of the lynx fur)
${accessoryLabels.length > 0 ? `- Accessories: ${accessoryLabels.join(", ")}` : "- No special accessories"}

CRITICAL RULES FOR THE LYNX CHARACTER:
1. The lynx MUST have: spotted golden-brown fur, tufted ears with black tips, prominent sideburns (patillas), amber/golden eyes, short bobbed tail
2. TRANSFER my hair onto the lynx's head (same color, same style, on top of the lynx head)
3. TRANSFER all my accessories onto the lynx (glasses, earrings, hat, etc.)
4. The lynx's fur warmth should match my skin tone
5. The expression should be confident and friendly

ART STYLE: Vibrant cartoon/anime cel-shaded illustration, bold outlines, ${styleModifiers[traits.artStyle] || styleModifiers.urban}

COMPOSITION: Upper body portrait, arms visible, confident pose, looking at camera
Include subtle "LINCE" watermark text in the bottom corner.${photoInstruction}

Created with LINCE — lince.app`;
}

// ─── Main Component ───
export function EngagementTimer({ lang = "es" }: { lang?: Lang }) {
  const t = T[lang] || T.es;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [elapsed, setElapsed] = useState(0);
  const [showThankYou, setShowThankYou] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [minimized, setMinimized] = useState(false);

  // Prompt generator state
  const [showPromptGenerator, setShowPromptGenerator] = useState(false);
  const [hairColor, setHairColor] = useState("brown");
  const [hairStyle, setHairStyle] = useState("short");
  const [skinTone, setSkinTone] = useState("medium");
  const [selectedAccessories, setSelectedAccessories] = useState<string[]>([]);
  const [artStyle, setArtStyle] = useState("urban");
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [generatedPrompt, setGeneratedPrompt] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Load saved timer state
  useEffect(() => {
    try {
      const stored = localStorage.getItem(TIMER_KEY);
      if (stored) {
        const data = JSON.parse(stored);
        setElapsed(data.elapsed || 0);
      }
      const thankDismissed = sessionStorage.getItem(THANK_YOU_DISMISSED_KEY);
      if (thankDismissed) setDismissed(true);
    } catch {}
  }, []);

  // Timer tick
  useEffect(() => {
    if (elapsed >= TOTAL_SECONDS && !dismissed) {
      setShowThankYou(true);
      return;
    }
    if (elapsed >= TOTAL_SECONDS) return;

    const interval = setInterval(() => {
      setElapsed((prev) => {
        const next = prev + 1;
        try {
          localStorage.setItem(TIMER_KEY, JSON.stringify({ elapsed: next, lastUpdate: Date.now() }));
        } catch {}
        if (next >= TOTAL_SECONDS) {
          setShowThankYou(true);
        }
        return next;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [elapsed, dismissed]);

  const remaining = Math.max(0, TOTAL_SECONDS - elapsed);
  const mins = Math.floor(remaining / 60);
  const secs = remaining % 60;
  const progress = Math.min(100, (elapsed / TOTAL_SECONDS) * 100);
  const isComplete = elapsed >= TOTAL_SECONDS;

  // Toggle accessory
  const toggleAccessory = useCallback((id: string) => {
    setSelectedAccessories(prev =>
      prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
    );
  }, []);

  // Handle photo upload
  const handlePhotoUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) return;
    if (file.size > 10 * 1024 * 1024) return;

    const reader = new FileReader();
    reader.onload = () => setPhotoPreview(reader.result as string);
    reader.readAsDataURL(file);
  }, []);

  // Generate the prompt
  const handleGeneratePrompt = useCallback(() => {
    const prompt = buildLincelinPrompt({
      hairColor,
      hairStyle,
      skinTone,
      accessories: selectedAccessories,
      artStyle,
      photoAttached: !!photoPreview,
    }, lang);
    setGeneratedPrompt(prompt);
  }, [hairColor, hairStyle, skinTone, selectedAccessories, artStyle, photoPreview, lang]);

  // Copy to clipboard
  const handleCopy = useCallback(async () => {
    if (!generatedPrompt) return;
    try {
      await navigator.clipboard.writeText(generatedPrompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch {
      // Fallback for older browsers
      const ta = document.createElement("textarea");
      ta.value = generatedPrompt;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  }, [generatedPrompt]);

  // Open AI platforms
  const openAI = useCallback((platform: string) => {
    const urls: Record<string, string> = {
      gemini: "https://gemini.google.com/app",
      chatgpt: "https://chat.openai.com/",
      grok: "https://grok.com/",
      copilot: "https://copilot.microsoft.com/",
    };
    window.open(urls[platform] || urls.chatgpt, "_blank");
  }, []);

  // ─── THANK YOU + PROMPT GENERATOR MODAL ───
  if (showThankYou && !dismissed) {
    return (
      <div className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-md overflow-y-auto">
        <div className="min-h-screen flex items-start justify-center p-4 py-8">
          <div className="max-w-2xl w-full">

            {/* Thank You Header */}
            {!showPromptGenerator && !generatedPrompt && (
              <div className="text-center mb-8">
                <div className="text-6xl mb-4">🎉</div>
                <h2 className="font-['Space_Grotesk'] font-black text-2xl sm:text-3xl text-white mb-3">
                  {t.thankTitle}
                </h2>
                <p className="text-gray-300 text-sm sm:text-base leading-relaxed mb-3">
                  {t.thankText}
                </p>
                <p className="text-[#FF6B35]/70 text-xs mb-6">
                  {t.thankSub}
                </p>

                {/* Gift CTA */}
                <div className="bg-gradient-to-br from-[#00E5FF]/10 to-[#FF6B35]/10 border border-[#00E5FF]/30 rounded-2xl p-6 mb-6">
                  <div className="text-4xl mb-3">🎁</div>
                  <h3 className="font-['Space_Grotesk'] font-black text-xl text-[#00E5FF] mb-2">
                    {t.giftTitle}
                  </h3>
                  <p className="text-gray-300 text-sm leading-relaxed mb-4">
                    {t.giftText}
                  </p>
                  <button
                    onClick={() => setShowPromptGenerator(true)}
                    className="px-8 py-4 bg-gradient-to-r from-[#00E5FF] to-[#FF6B35] text-black font-black rounded-xl text-lg hover:brightness-110 transition-all shadow-[0_0_30px_rgba(0,229,255,0.3)] w-full sm:w-auto"
                  >
                    {t.generatePrompt}
                  </button>
                </div>

                <button
                  onClick={() => {
                    setShowThankYou(false);
                    setDismissed(true);
                    sessionStorage.setItem(THANK_YOU_DISMISSED_KEY, "1");
                  }}
                  className="text-gray-500 hover:text-gray-300 text-sm underline transition-colors"
                >
                  {t.backToApp}
                </button>
              </div>
            )}

            {/* Prompt Generator */}
            {showPromptGenerator && !generatedPrompt && (
              <div className="space-y-6">
                {/* Back button */}
                <button
                  onClick={() => setShowPromptGenerator(false)}
                  className="text-gray-400 hover:text-white text-sm flex items-center gap-1 transition-colors"
                >
                  ← {t.backToApp}
                </button>

                <div className="text-center mb-4">
                  <h2 className="font-['Space_Grotesk'] font-black text-xl sm:text-2xl text-[#00E5FF] mb-2">
                    {t.step1}
                  </h2>
                  <p className="text-gray-400 text-sm">{t.giftText}</p>
                </div>

                {/* Photo Upload (Optional) */}
                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <p className="text-gray-300 text-sm mb-3">{t.orUpload}</p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="px-4 py-2 bg-[#FF6B35]/20 border border-[#FF6B35]/40 text-[#FF6B35] font-bold rounded-lg text-sm hover:bg-[#FF6B35]/30 transition-all"
                    >
                      📷 {t.uploadBtn}
                    </button>
                    {photoPreview && (
                      <div className="flex items-center gap-2">
                        <img src={photoPreview} alt="Preview" className="w-10 h-10 rounded-full object-cover border-2 border-[#00E5FF]" />
                        <span className="text-[#00E5FF] text-xs">✓</span>
                      </div>
                    )}
                    <span className="text-gray-500 text-xs">{t.uploadHint}</span>
                  </div>
                </div>

                {/* Hair Color */}
                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <h4 className="text-white font-bold text-sm mb-3">{t.hairColor}</h4>
                  <div className="flex flex-wrap gap-2">
                    {HAIR_COLORS.map(color => (
                      <button
                        key={color.id}
                        onClick={() => setHairColor(color.id)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                          hairColor === color.id
                            ? "bg-[#00E5FF]/20 border-2 border-[#00E5FF] text-white"
                            : "bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10"
                        }`}
                      >
                        <span className="w-4 h-4 rounded-full border border-white/20" style={{ backgroundColor: color.hex }} />
                        {color[lang === "pt-BR" || lang === "pt-PT" ? "es" : lang === "zh" ? "zh" : lang === "en" ? "en" : "es"]}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Hair Style */}
                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <h4 className="text-white font-bold text-sm mb-3">{t.hairStyle}</h4>
                  <div className="flex flex-wrap gap-2">
                    {HAIR_STYLES.map(style => (
                      <button
                        key={style.id}
                        onClick={() => setHairStyle(style.id)}
                        className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                          hairStyle === style.id
                            ? "bg-[#00E5FF]/20 border-2 border-[#00E5FF] text-white"
                            : "bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10"
                        }`}
                      >
                        {style[lang === "pt-BR" || lang === "pt-PT" ? "es" : lang === "zh" ? "zh" : lang === "en" ? "en" : "es"]}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Skin Tone */}
                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <h4 className="text-white font-bold text-sm mb-3">{t.skinTone}</h4>
                  <div className="flex flex-wrap gap-2">
                    {SKIN_TONES.map(tone => (
                      <button
                        key={tone.id}
                        onClick={() => setSkinTone(tone.id)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                          skinTone === tone.id
                            ? "bg-[#00E5FF]/20 border-2 border-[#00E5FF] text-white"
                            : "bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10"
                        }`}
                      >
                        <span className="w-4 h-4 rounded-full border border-white/20" style={{ backgroundColor: tone.hex }} />
                        {tone[lang === "pt-BR" || lang === "pt-PT" ? "es" : lang === "zh" ? "zh" : lang === "en" ? "en" : "es"]}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Accessories */}
                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <h4 className="text-white font-bold text-sm mb-3">{t.accessories}</h4>
                  <div className="flex flex-wrap gap-2">
                    {ACCESSORIES_LIST.map(acc => (
                      <button
                        key={acc.id}
                        onClick={() => toggleAccessory(acc.id)}
                        className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                          selectedAccessories.includes(acc.id)
                            ? "bg-[#FF6B35]/20 border-2 border-[#FF6B35] text-white"
                            : "bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10"
                        }`}
                      >
                        <span>{acc.emoji}</span>
                        {acc[lang === "pt-BR" || lang === "pt-PT" ? "es" : lang === "zh" ? "zh" : lang === "en" ? "en" : "es"]}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Art Style */}
                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <h4 className="text-white font-bold text-sm mb-3">{t.step2}: {t.artStyle}</h4>
                  <div className="flex flex-wrap gap-2">
                    {STYLES.map(style => (
                      <button
                        key={style.id}
                        onClick={() => setArtStyle(style.id)}
                        className={`flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-sm font-bold transition-all ${
                          artStyle === style.id
                            ? "bg-gradient-to-r from-[#00E5FF]/30 to-[#FF6B35]/30 border-2 border-[#00E5FF] text-white"
                            : "bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10"
                        }`}
                      >
                        <span>{style.emoji}</span>
                        {style[lang === "pt-BR" || lang === "pt-PT" ? "es" : lang === "zh" ? "zh" : lang === "en" ? "en" : "es"]}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Generate Button */}
                <button
                  onClick={handleGeneratePrompt}
                  className="w-full px-8 py-4 bg-gradient-to-r from-[#00E5FF] to-[#FF6B35] text-black font-black rounded-xl text-lg hover:brightness-110 transition-all shadow-[0_0_30px_rgba(0,229,255,0.3)]"
                >
                  {t.step3.split(":")[0]} →
                </button>
              </div>
            )}

            {/* Generated Prompt Result */}
            {generatedPrompt && (
              <div className="space-y-6">
                {/* Back button */}
                <button
                  onClick={() => {
                    setGeneratedPrompt(null);
                    setShowPromptGenerator(true);
                  }}
                  className="text-gray-400 hover:text-white text-sm flex items-center gap-1 transition-colors"
                >
                  ← {t.step1}
                </button>

                <div className="text-center mb-4">
                  <div className="text-5xl mb-3">🐱</div>
                  <h2 className="font-['Space_Grotesk'] font-black text-xl sm:text-2xl text-[#00E5FF] mb-2">
                    {t.yourPrompt}
                  </h2>
                  <p className="text-gray-300 text-sm">{t.promptReady}</p>
                </div>

                {/* The Prompt Box */}
                <div className="relative bg-[#0A0A0A] border-2 border-[#00E5FF]/40 rounded-xl p-4 sm:p-5">
                  <pre className="text-gray-200 text-xs sm:text-sm whitespace-pre-wrap font-mono leading-relaxed max-h-[300px] overflow-y-auto">
                    {generatedPrompt}
                  </pre>
                  <button
                    onClick={handleCopy}
                    className={`mt-4 w-full px-6 py-3 font-black rounded-xl text-base transition-all ${
                      copied
                        ? "bg-green-500 text-white shadow-[0_0_20px_rgba(34,197,94,0.4)]"
                        : "bg-[#00E5FF] text-black hover:brightness-110 shadow-[0_0_20px_rgba(0,229,255,0.3)]"
                    }`}
                  >
                    {copied ? `✓ ${t.copied}` : `📋 ${t.copyPrompt}`}
                  </button>
                </div>

                {/* How To Use */}
                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <h4 className="text-white font-bold text-sm mb-3">{t.howTo}</h4>
                  <div className="space-y-2 text-gray-300 text-sm">
                    <p>{t.howToStep1}</p>
                    <p>{t.howToStep2}</p>
                    <p className="font-bold text-[#FF6B35]">{t.howToStep3}</p>
                    <p className="text-[#00E5FF] font-bold">{t.howToStep4}</p>
                  </div>
                </div>

                {/* AI Platform Buttons */}
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => openAI("gemini")}
                    className="flex items-center justify-center gap-2 px-4 py-3.5 bg-[#4285F4]/15 border border-[#4285F4]/40 text-white font-bold rounded-xl text-sm hover:bg-[#4285F4]/25 transition-all"
                  >
                    <span className="text-lg">✨</span> {t.openGemini}
                  </button>
                  <button
                    onClick={() => openAI("chatgpt")}
                    className="flex items-center justify-center gap-2 px-4 py-3.5 bg-[#10A37F]/15 border border-[#10A37F]/40 text-white font-bold rounded-xl text-sm hover:bg-[#10A37F]/25 transition-all"
                  >
                    <span className="text-lg">🤖</span> {t.openChatGPT}
                  </button>
                  <button
                    onClick={() => openAI("grok")}
                    className="flex items-center justify-center gap-2 px-4 py-3.5 bg-[#1DA1F2]/15 border border-[#1DA1F2]/40 text-white font-bold rounded-xl text-sm hover:bg-[#1DA1F2]/25 transition-all"
                  >
                    <span className="text-lg">⚡</span> {t.openGrok}
                  </button>
                  <button
                    onClick={() => openAI("copilot")}
                    className="flex items-center justify-center gap-2 px-4 py-3.5 bg-[#9B59B6]/15 border border-[#9B59B6]/40 text-white font-bold rounded-xl text-sm hover:bg-[#9B59B6]/25 transition-all"
                  >
                    <span className="text-lg">🔷</span> {t.openCopilot}
                  </button>
                </div>


                {/* Footer */}
                <div className="text-center space-y-3 pt-2">
                  <p className="text-gray-600 text-xs">{t.madeWith}</p>
                  <button
                    onClick={() => {
                      setShowThankYou(false);
                      setDismissed(true);
                      setGeneratedPrompt(null);
                      setShowPromptGenerator(false);
                      sessionStorage.setItem(THANK_YOU_DISMISSED_KEY, "1");
                    }}
                    className="px-8 py-3 bg-[#FF6B35] text-black font-black rounded-xl text-base hover:brightness-110 transition-all shadow-[0_0_20px_rgba(255,107,53,0.3)]"
                  >
                    {t.backToApp}
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    );
  }

  // Don't show timer bar if complete and dismissed
  if (isComplete && dismissed) return null;

  // Minimized: just a small floating pill
  if (minimized) {
    return (
      <button
        onClick={() => setMinimized(false)}
        className="fixed top-20 right-4 z-[100] px-3 py-1.5 rounded-full bg-[#0A0A0A]/90 border border-[#FF6B35]/30 backdrop-blur-md flex items-center gap-2 hover:border-[#FF6B35]/60 transition-all shadow-lg"
      >
        <span className="text-[#FF6B35] font-['Space_Grotesk'] font-bold text-xs">
          {String(mins).padStart(2, "0")}:{String(secs).padStart(2, "0")}
        </span>
        <div className="w-8 h-1 rounded-full bg-white/10 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-1000"
            style={{
              width: `${progress}%`,
              background: "linear-gradient(90deg, #FF6B35, #00E5FF)",
            }}
          />
        </div>
      </button>
    );
  }

  // Full timer bar
  return (
    <div className="fixed top-16 left-0 right-0 z-[99] bg-[#0A0A0A]/95 backdrop-blur-md border-b border-[#FF6B35]/10">
      <div className="container px-4 py-2 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <span className="text-[10px] sm:text-xs text-gray-400 whitespace-nowrap">{t.exploring}</span>
          <div className="flex-1 h-1.5 rounded-full bg-white/5 overflow-hidden max-w-[200px]">
            <div
              className="h-full rounded-full transition-all duration-1000"
              style={{
                width: `${progress}%`,
                background: "linear-gradient(90deg, #FF6B35, #00E5FF)",
              }}
            />
          </div>
          <span className="font-['Space_Grotesk'] font-bold text-sm text-[#FF6B35] tabular-nums whitespace-nowrap">
            {String(mins).padStart(2, "0")}:{String(secs).padStart(2, "0")}
          </span>
        </div>
        <div className="hidden sm:block text-[10px] text-gray-500 truncate max-w-[200px]">
          {t.tip}
        </div>
        <button
          onClick={() => setMinimized(true)}
          className="text-gray-500 hover:text-white text-xs p-1"
          aria-label="Minimizar timer"
        >
          ✕
        </button>
      </div>
    </div>
  );
}

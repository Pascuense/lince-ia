import { useState, useRef, useCallback, useEffect } from "react";
import domtoimage from "dom-to-image-more";
import { useGameLang } from "@/hooks/useGameLang";
import { AVATAR_FRONTAL, AVATAR_EXPRESSIONS } from "@/lib/avatarConstants";
import { UserNavBadge } from "@/components/UserNavBadge";
import { usePRDLanguage, tl} from "@/contexts/PRDLanguageContext";
import { GlobalNavBar } from "@/components/GlobalNavBar";
import { BackButton } from "@/components/BackButton";

// AVATARS_GROUP uses same images as AVATAR_FRONTAL for consistency
const AVATARS_GROUP = AVATAR_FRONTAL;

// ─── DATA DEFINITIONS ───
interface AvatarInfo {
  key: string;
  name: string;
  role: string;
  generation: string;
  color: string;
  icon: string;
}

const AVATAR_LIST: AvatarInfo[] = [
  { key: "YAYALIN", name: "ABUELO", role: "El Sabio Paciente", generation: "Abuelos (65+)", color: "#B0B0B0", icon: "👴" },
  { key: "YAYALINA", name: "ABUELA", role: "La Cariñosa", generation: "Abuelos (65+)", color: "#B0B0B0", icon: "👵" },
  { key: "PAPALIN", name: "PAPÁ", role: "El Práctico", generation: "Adultos (35-64)", color: "#00E5FF", icon: "💼" },
  { key: "MAMALINA", name: "MAMÁ", role: "La Tutora Principal", generation: "Adultos (35-64)", color: "#00E5FF", icon: "👩\u200D💻" },
  { key: "CHAVALIN", name: "HIJO", role: "El Nativo Digital", generation: "Jóvenes (16-34)", color: "#00C853", icon: "🎧" },
  { key: "CHAVALINA", name: "HIJA", role: "La Creativa", generation: "Jóvenes (16-34)", color: "#00C853", icon: "🎨" },
  { key: "PEQUELIN", name: "NIÑO", role: "El Explorador", generation: "Niños (6-15)", color: "#FFD700", icon: "🎒" },
  { key: "PEQUELINA", name: "NIÑA", role: "La Imaginativa", generation: "Niños (6-15)", color: "#FFD700", icon: "🎀" },
  { key: "ATOLONDRALIN", name: "TÍO", role: "El Despistado", generation: "Especial", color: "#FF5252", icon: "🤪" },
  { key: "SABELIN", name: "PRIMO", role: "El Genio Mentor", generation: "Especial", color: "#9C27B0", icon: "🎓" },
];

const FUR_COLORS = [
  { id: "crema", name: "Crema Claro", hex: "#F5DEB3" },
  { id: "arena", name: "Arena", hex: "#C2B280" },
  { id: "dorado", name: "Dorado", hex: "#DAA520" },
  { id: "canela", name: "Canela", hex: "#D2691E" },
  { id: "cobre", name: "Cobre", hex: "#B87333" },
  { id: "rojizo", name: "Rojizo", hex: "#A0522D" },
  { id: "chocolate", name: "Chocolate", hex: "#7B3F00" },
  { id: "marron", name: "Marrón Oscuro", hex: "#4E2E0F" },
  { id: "gris_claro", name: "Gris Claro", hex: "#A9A9A9" },
  { id: "gris_oscuro", name: "Gris Oscuro", hex: "#696969" },
  { id: "negro", name: "Negro", hex: "#2C2C2C" },
  { id: "blanco", name: "Blanco Nieve", hex: "#FFFAFA" },
];

const EYE_COLORS = [
  { id: "ambar", name: "Ámbar", hex: "#FFBF00" },
  { id: "verde", name: "Verde", hex: "#2E8B57" },
  { id: "azul", name: "Azul", hex: "#4169E1" },
  { id: "marron", name: "Marrón", hex: "#8B4513" },
  { id: "gris", name: "Gris", hex: "#808080" },
  { id: "miel", name: "Miel", hex: "#EB9605" },
  { id: "hetero_az_vd", name: "Heterocromía (Azul/Verde)", hex: "linear-gradient(90deg, #4169E1 50%, #2E8B57 50%)" },
  { id: "hetero_am_az", name: "Heterocromía (Ámbar/Azul)", hex: "linear-gradient(90deg, #FFBF00 50%, #4169E1 50%)" },
];

const SPOT_PATTERNS = [
  { id: "clasico", name: "Clásico", desc: "Manchas naturales del lince" },
  { id: "sutil", name: "Sutil", desc: "Manchas muy tenues" },
  { id: "intenso", name: "Intenso", desc: "Manchas marcadas y definidas" },
  { id: "asimetrico", name: "Asimétrico", desc: "Patrón único e irregular" },
  { id: "sin_manchas", name: "Sin manchas", desc: "Pelaje uniforme" },
  { id: "vitiligo", name: "Vitíligo", desc: "Manchas claras en el pelaje" },
];

const CLOTHING_OPTIONS = [
  { id: "camiseta", name: "Camiseta", icon: "👕" },
  { id: "camisa", name: "Camisa", icon: "👔" },
  { id: "sudadera", name: "Sudadera", icon: "🧥" },
  { id: "vestido", name: "Vestido", icon: "👗" },
  { id: "traje", name: "Traje", icon: "🤵" },
  { id: "bata", name: "Bata Científica", icon: "🥼" },
  { id: "hoodie", name: "Hoodie", icon: "🧥" },
  { id: "chaqueta", name: "Chaqueta", icon: "🧥" },
  { id: "jersey", name: "Jersey", icon: "🧶" },
  { id: "chaleco", name: "Chaleco", icon: "🦺" },
  { id: "kimono", name: "Kimono", icon: "👘" },
  { id: "poncho", name: "Poncho", icon: "🧣" },
  { id: "deportivo", name: "Ropa Deportiva", icon: "🏃" },
  { id: "pijama", name: "Pijama", icon: "😴" },
  { id: "uniforme", name: "Uniforme Escolar", icon: "🎓" },
];

const CLOTHING_COLORS = [
  { id: "cyan", name: "Cyan LINCE", hex: "#00E5FF" },
  { id: "dorado", name: "Dorado", hex: "#D4A843" },
  { id: "rojo", name: "Rojo", hex: "#FF5252" },
  { id: "verde", name: "Verde", hex: "#00C853" },
  { id: "azul", name: "Azul", hex: "#4169E1" },
  { id: "morado", name: "Morado", hex: "#9C27B0" },
  { id: "rosa", name: "Rosa", hex: "#FF69B4" },
  { id: "naranja", name: "Naranja", hex: "#FF8C00" },
  { id: "blanco", name: "Blanco", hex: "#F5F5F5" },
  { id: "negro", name: "Negro", hex: "#1A1A1A" },
];

const HEAD_ACCESSORIES = [
  { id: "ninguno", name: "Ninguno", icon: "❌" },
  { id: "gorra", name: "Gorra", icon: "🧢" },
  { id: "panuelo", name: "Pañuelo", icon: "🎀" },
  { id: "hijab", name: "Hijab", icon: "🧕" },
  { id: "kipa", name: "Kipá", icon: "⭐" },
  { id: "turbante", name: "Turbante", icon: "👳" },
  { id: "diadema", name: "Diadema", icon: "👑" },
  { id: "corona_flores", name: "Corona de Flores", icon: "🌸" },
  { id: "sombrero", name: "Sombrero", icon: "🎩" },
  { id: "gorro_lana", name: "Gorro de Lana", icon: "🧶" },
  { id: "cinta", name: "Cinta Deportiva", icon: "🏋️" },
];

const HAIRSTYLES = [
  { id: "corto", name: "Corto", icon: "✂️" },
  { id: "largo", name: "Largo", icon: "💇" },
  { id: "mono", name: "Moño", icon: "💁" },
  { id: "trenzas", name: "Trenzas", icon: "🎀" },
  { id: "afro", name: "Afro", icon: "🌀" },
  { id: "rapado", name: "Rapado", icon: "💈" },
  { id: "mohicano", name: "Mohicano", icon: "🔥" },
  { id: "calvo", name: "Calvo", icon: "🌕" },
  { id: "coleta", name: "Coleta", icon: "🎗️" },
  { id: "rizado", name: "Rizado", icon: "🌊" },
];

const BODY_ACCESSORIES = [
  { id: "ninguno", name: "Ninguno", icon: "❌" },
  { id: "collar", name: "Collar", icon: "📿" },
  { id: "pendientes", name: "Pendientes", icon: "💎" },
  { id: "piercings", name: "Piercings", icon: "🔗" },
  { id: "reloj", name: "Reloj", icon: "⌚" },
  { id: "pulseras", name: "Pulseras", icon: "💫" },
  { id: "gafas_sol", name: "Gafas de Sol", icon: "🕶️" },
  { id: "gafas_vista", name: "Gafas de Vista", icon: "👓" },
  { id: "mochila", name: "Mochila", icon: "🎒" },
  { id: "bufanda", name: "Bufanda", icon: "🧣" },
];

const ASSISTIVE_DEVICES = [
  { id: "ninguno", name: "Ninguno", icon: "❌", free: true },
  { id: "silla_manual", name: "Silla de Ruedas Manual", icon: "♿", free: true },
  { id: "silla_electrica", name: "Silla de Ruedas Eléctrica", icon: "🦽", free: true },
  { id: "silla_deportiva", name: "Silla Deportiva", icon: "🏅", free: true },
  { id: "protesis_brazo", name: "Prótesis de Brazo", icon: "💪", free: true },
  { id: "protesis_pierna", name: "Prótesis de Pierna (Blade)", icon: "🦿", free: true },
  { id: "audifonos", name: "Audífonos", icon: "🦻", free: true },
  { id: "implante_coclear", name: "Implante Coclear", icon: "🔊", free: true },
  { id: "baston", name: "Bastón", icon: "🦯", free: true },
  { id: "baston_blanco", name: "Bastón Blanco (Ceguera)", icon: "🦯", free: true },
  { id: "muleta", name: "Muleta", icon: "🩼", free: true },
  { id: "perro_guia", name: "Perro Guía", icon: "🐕‍🦺", free: true },
  { id: "parche_ocular", name: "Parche Ocular", icon: "🏴‍☠️", free: true },
  { id: "oxigeno", name: "Oxígeno (Cánula Nasal)", icon: "💨", free: true },
  { id: "alopecia", name: "Alopecia", icon: "🌕", free: true },
  { id: "cicatrices", name: "Cicatrices", icon: "⚡", free: true },
];

const ASSISTIVE_COLORS = [
  { id: "cyan", name: "Cyan", hex: "#00E5FF" },
  { id: "rojo", name: "Rojo", hex: "#FF5252" },
  { id: "azul", name: "Azul", hex: "#4169E1" },
  { id: "verde", name: "Verde", hex: "#00C853" },
  { id: "morado", name: "Morado", hex: "#9C27B0" },
  { id: "negro", name: "Negro", hex: "#2C2C2C" },
];

const VOICE_OPTIONS = [
  { id: "grave", name: "Grave", icon: "🔈" },
  { id: "media", name: "Media", icon: "🔉" },
  { id: "aguda", name: "Aguda", icon: "🔊" },
];

const PRONOUN_OPTIONS = [
  { id: "el", name: "Él" },
  { id: "ella", name: "Ella" },
  { id: "elle", name: "Elle" },
  { id: "sin", name: "Sin preferencia" },
];

// ─── CUSTOMIZATION STATE ───
interface CustomizationState {
  selectedAvatar: string | null;
  avatarName: string;
  pronouns: string;
  furColor: string;
  eyeColor: string;
  spotPattern: string;
  clothing: string;
  clothingColor: string;
  headAccessory: string;
  hairstyle: string;
  bodyAccessory: string;
  assistiveDevice: string;
  assistiveColor: string;
  voice: string;
  expression: string;
}

const INITIAL_STATE: CustomizationState = {
  selectedAvatar: null,
  avatarName: "",
  pronouns: "sin",
  furColor: "blanco",
  eyeColor: "ambar",
  spotPattern: "clasico",
  clothing: "camiseta",
  clothingColor: "cyan",
  headAccessory: "ninguno",
  hairstyle: "corto",
  bodyAccessory: "ninguno",
  assistiveDevice: "ninguno",
  assistiveColor: "cyan",
  voice: "media",
  expression: "frontal",
};

// ─── STEP DEFINITIONS ───
type Step = "select" | "appearance" | "identity" | "clothing" | "accessories" | "assistive" | "summary";

const STEP_IDS: Step[] = ["select", "appearance", "identity", "clothing", "accessories", "assistive", "summary"];
const STEP_ICONS = ["🐾", "🎨", "✨", "👕", "💎", "♿", "🎉"];
const STEP_LABELS_ES = ["Elige Avatar", "Apariencia", "Identidad", "Ropa", "Accesorios", "Diversidad", "Resumen"];
const STEP_LABELS_EN = ["Choose Avatar", "Appearance", "Identity", "Clothing", "Accessories", "Diversity", "Summary"];
const STEP_LABELS_ZH = ["选择头像", "外观", "身份", "服装", "配饰", "多样性", "总结"];

function useSteps() {
  const { lang } = useGameLang();
  const labelsMap: Record<string, string[]> = { es: STEP_LABELS_ES, en: STEP_LABELS_EN, zh: STEP_LABELS_ZH, 'pt-BR': STEP_LABELS_ES, 'pt-PT': STEP_LABELS_ES };
  const labels = labelsMap[lang] || STEP_LABELS_ES;
  return STEP_IDS.map((id, i) => ({ id, label: labels[i], icon: STEP_ICONS[i] }));
}

// Keep backward compat
const STEPS: { id: Step; label: string; icon: string }[] = [
  { id: "select", label: "Elige Avatar", icon: "🐾" },
  { id: "appearance", label: "Apariencia", icon: "🎨" },
  { id: "identity", label: "Identidad", icon: "✨" },
  { id: "clothing", label: "Ropa", icon: "👕" },
  { id: "accessories", label: "Accesorios", icon: "💎" },
  { id: "assistive", label: "Diversidad", icon: "♿" },
  { id: "summary", label: "Resumen", icon: "🎉" },
];

// ─── COMPONENTS ───

function ColorSwatch({ hex, selected, onClick, name, size = "md" }: {
  hex: string; selected: boolean; onClick: () => void; name: string; size?: "sm" | "md";
}) {
  const isGradient = hex.includes("gradient");
  const sizeClass = size === "sm" ? "w-8 h-8" : "w-10 h-10";
  return (
    <button
      onClick={onClick}
      title={name}
      className={`${sizeClass} rounded-full border-2 transition-all duration-200 flex-shrink-0 ${
        selected ? "border-[#00E5FF] scale-110 shadow-[0_0_12px_rgba(0,229,255,0.5)]" : "border-white/20 hover:border-white/50 hover:scale-105"
      }`}
      style={isGradient ? { background: hex } : { backgroundColor: hex }}
      aria-label={`Color: ${name}`}
    />
  );
}

function OptionButton({ selected, onClick, children, className = "" }: {
  selected: boolean; onClick: () => void; children: React.ReactNode; className?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
        selected
          ? "bg-[#00E5FF] text-[#0A0A0A] shadow-[0_0_16px_rgba(0,229,255,0.3)]"
          : "bg-white/5 text-[#B0B0B0] hover:bg-white/10 hover:text-white border border-white/10"
      } ${className}`}
    >
      {children}
    </button>
  );
}

function SectionLabel({ children, badge }: { children: React.ReactNode; badge?: string }) {
  return (
    <div className="pt-14 flex items-center gap-2 mb-3">
      <BackButton variant="inline" />
      <GlobalNavBar />
      <h4 className="font-['Space_Grotesk'] font-bold text-white text-sm">{children}</h4>
      {badge && (
        <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#00C853]/20 text-[#00C853] font-bold">{badge}</span>
      )}
    </div>
  );
}

// ─── AVATAR PREVIEW ───
function AvatarPreview({ state, compact = false, previewRef }: { state: CustomizationState; compact?: boolean; previewRef?: React.RefObject<HTMLDivElement | null> }) {
  const avatarKey = state.selectedAvatar;
  if (!avatarKey) return null;

  const furColorObj = FUR_COLORS.find(c => c.id === state.furColor);
  const eyeColorObj = EYE_COLORS.find(c => c.id === state.eyeColor);
  const clothingColorObj = CLOTHING_COLORS.find(c => c.id === state.clothingColor);
  const assistiveColorObj = ASSISTIVE_COLORS.find(c => c.id === state.assistiveColor);
  const assistiveDevice = ASSISTIVE_DEVICES.find(d => d.id === state.assistiveDevice);
  const clothing = CLOTHING_OPTIONS.find(c => c.id === state.clothing);
  const headAcc = HEAD_ACCESSORIES.find(a => a.id === state.headAccessory);
  const bodyAcc = BODY_ACCESSORIES.find(a => a.id === state.bodyAccessory);
  const hairstyle = HAIRSTYLES.find(h => h.id === state.hairstyle);
  const spotPattern = SPOT_PATTERNS.find(s => s.id === state.spotPattern);

  // Get the right image based on expression
  let imgSrc = AVATAR_FRONTAL[avatarKey] || AVATARS_GROUP[avatarKey];
  if (state.expression !== "frontal" && AVATAR_EXPRESSIONS[avatarKey]?.[state.expression]) {
    imgSrc = AVATAR_EXPRESSIONS[avatarKey][state.expression];
  }

  const containerSize = compact ? "w-48 h-48" : "w-72 h-72 sm:w-80 sm:h-80";

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Avatar container with overlays */}
      <div ref={previewRef} className={`${containerSize} relative rounded-2xl overflow-hidden bg-[#111111]`}>
        {/* Background glow */}
        <div className="absolute inset-0 rounded-2xl" style={{
          background: `radial-gradient(circle at 50% 50%, ${furColorObj?.hex || '#DAA520'}20, transparent 70%)`,
        }} />

        {/* Fur color tint overlay */}
        <div className="absolute inset-0 rounded-2xl mix-blend-color opacity-20 z-10" style={{
          backgroundColor: furColorObj?.hex || '#DAA520',
        }} />

        {/* Main avatar image */}
        <img
          src={imgSrc}
          alt={state.avatarName || avatarKey}
          className="w-full h-full object-contain relative z-[5]"
        />

        {/* Eye color overlay - two large radial glows over each eye */}
        {(() => {
          const isHetero = eyeColorObj?.hex?.includes('gradient');
          const leftColor = isHetero ? eyeColorObj!.hex.split(',')[1]?.match(/#[A-Fa-f0-9]{6}/)?.[0] || '#FFBF00' : eyeColorObj?.hex || '#FFBF00';
          const rightColor = isHetero ? eyeColorObj!.hex.split(',')[2]?.match(/#[A-Fa-f0-9]{6}/)?.[0] || '#2E8B57' : eyeColorObj?.hex || '#FFBF00';
          return (
            <>
              {/* Left eye (viewer's left) */}
              <div className="absolute z-[11] pointer-events-none rounded-full"
                style={{
                  top: '28%', left: '26%',
                  width: '14%', height: '14%',
                  background: `radial-gradient(circle, ${leftColor}cc 0%, ${leftColor}88 35%, ${leftColor}22 70%, transparent 100%)`,
                  mixBlendMode: 'color',
                  filter: 'blur(1px)',
                }}
              />
              {/* Left eye - hard color core */}
              <div className="absolute z-[12] pointer-events-none rounded-full"
                style={{
                  top: '30%', left: '28.5%',
                  width: '8%', height: '8%',
                  background: `radial-gradient(circle, ${leftColor} 0%, ${leftColor}aa 60%, transparent 100%)`,
                  mixBlendMode: 'hue',
                  opacity: 0.85,
                }}
              />
              {/* Right eye (viewer's right) */}
              <div className="absolute z-[11] pointer-events-none rounded-full"
                style={{
                  top: '28%', right: '26%',
                  width: '14%', height: '14%',
                  background: `radial-gradient(circle, ${rightColor}cc 0%, ${rightColor}88 35%, ${rightColor}22 70%, transparent 100%)`,
                  mixBlendMode: 'color',
                  filter: 'blur(1px)',
                }}
              />
              {/* Right eye - hard color core */}
              <div className="absolute z-[12] pointer-events-none rounded-full"
                style={{
                  top: '30%', right: '28.5%',
                  width: '8%', height: '8%',
                  background: `radial-gradient(circle, ${rightColor} 0%, ${rightColor}aa 60%, transparent 100%)`,
                  mixBlendMode: 'hue',
                  opacity: 0.85,
                }}
              />
            </>
          );
        })()}

        {/* Clothing color band at bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-[30%] z-[12] pointer-events-none" style={{
          background: `linear-gradient(to top, ${clothingColorObj?.hex || '#00E5FF'}40, transparent)`,
        }} />

        {/* Spot pattern overlay */}
        {state.spotPattern === "vitiligo" && (
          <div className="absolute inset-0 z-[13] pointer-events-none opacity-20"
            style={{
              background: 'radial-gradient(ellipse at 30% 40%, white 0%, transparent 30%), radial-gradient(ellipse at 70% 60%, white 0%, transparent 25%)',
            }}
          />
        )}
        {state.spotPattern === "intenso" && (
          <div className="absolute inset-0 z-[13] pointer-events-none opacity-15"
            style={{
              background: 'radial-gradient(circle at 25% 35%, #2C2C2C 0%, transparent 8%), radial-gradient(circle at 60% 30%, #2C2C2C 0%, transparent 6%), radial-gradient(circle at 40% 55%, #2C2C2C 0%, transparent 7%), radial-gradient(circle at 75% 50%, #2C2C2C 0%, transparent 5%)',
            }}
          />
        )}
      </div>

      {/* Accessory badges below avatar */}
      <div className="flex flex-wrap gap-2 justify-center max-w-80">
        {clothing && clothing.id !== "camiseta" && (
          <span className="text-xs px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-[#B0B0B0]">
            {clothing.icon} {clothing.name}
          </span>
        )}
        {headAcc && headAcc.id !== "ninguno" && (
          <span className="text-xs px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-[#B0B0B0]">
            {headAcc.icon} {headAcc.name}
          </span>
        )}
        {hairstyle && (
          <span className="text-xs px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-[#B0B0B0]">
            {hairstyle.icon} {hairstyle.name}
          </span>
        )}
        {bodyAcc && bodyAcc.id !== "ninguno" && (
          <span className="text-xs px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-[#B0B0B0]">
            {bodyAcc.icon} {bodyAcc.name}
          </span>
        )}
        {spotPattern && spotPattern.id !== "clasico" && (
          <span className="text-xs px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-[#B0B0B0]">
            🐆 {spotPattern.name}
          </span>
        )}
        {assistiveDevice && assistiveDevice.id !== "ninguno" && (
          <span className="text-xs px-2.5 py-1 rounded-full border text-[#00C853] font-bold" style={{
            backgroundColor: `${assistiveColorObj?.hex || '#00E5FF'}15`,
            borderColor: `${assistiveColorObj?.hex || '#00E5FF'}40`,
          }}>
            {assistiveDevice.icon} {assistiveDevice.name}
          </span>
        )}
      </div>

      {/* Name and info */}
      {!compact && (
        <div className="text-center">
          <h3 className="font-['Space_Grotesk'] font-bold text-white text-xl">
            {state.avatarName || AVATAR_LIST.find(a => a.key === avatarKey)?.name || avatarKey}
          </h3>
          <p className="text-[#B0B0B0] text-sm mt-1">
            {AVATAR_LIST.find(a => a.key === avatarKey)?.role}
          </p>
        </div>
      )}
    </div>
  );
}

// ─── STEP CONTENT COMPONENTS ───

function StepSelect({ state, setState }: { state: CustomizationState; setState: (s: CustomizationState) => void }) {
  const { lang } = useGameLang();
  const t = (key: string) => key.split('.').pop() || key;
  const { getAvatarName, country } = usePRDLanguage();
  const [filter, setFilter] = useState("all");
  const generations = ["all", "Abuelos (65+)", "Adultos (35-64)", "Jóvenes (16-34)", "Niños (6-15)", "Especial"];

  const filtered = filter === "all" ? AVATAR_LIST : AVATAR_LIST.filter(a => a.generation === filter);

  return (
    <div>
      <div className="mb-6">
        <h3 className="font-['Space_Grotesk'] font-bold text-white text-xl mb-2">{t('customizer.chooseAvatar')}</h3>
        <p className="text-[#B0B0B0] text-sm">{t('customizer.chooseAvatarDesc')}</p>
      </div>

      {/* Generation filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        {generations.map(g => (
          <button key={g} onClick={() => setFilter(g)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              filter === g ? "bg-[#00E5FF]/20 text-[#00E5FF] border border-[#00E5FF]/30" : "bg-white/5 text-[#B0B0B0] hover:bg-white/10 border border-white/10"
            }`}>
            {g === "all" ? "Todos" : g}
          </button>
        ))}
      </div>

      {/* Avatar grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {filtered.map(avatar => {
          const isSelected = state.selectedAvatar === avatar.key;
          const img = AVATAR_FRONTAL[avatar.key] || AVATARS_GROUP[avatar.key];
          return (
            <button
              key={avatar.key}
              onClick={() => setState({ ...state, selectedAvatar: avatar.key })}
              className={`group relative p-3 rounded-xl transition-all duration-300 ${
                isSelected
                  ? "bg-[#00E5FF]/10 border-2 border-[#00E5FF] shadow-[0_0_24px_rgba(0,229,255,0.2)] scale-[1.02]"
                  : "bg-white/[0.03] border border-white/[0.08] hover:border-white/20 hover:bg-white/[0.05]"
              }`}
            >
              {isSelected && (
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-[#00E5FF] rounded-full flex items-center justify-center z-20">
                  <span className="text-[#0A0A0A] text-xs font-bold">✓</span>
                </div>
              )}
              <div className="w-full aspect-square rounded-lg overflow-hidden mb-2 bg-white/[0.02]">
                <img src={img} alt={avatar.name} className="w-full h-full object-contain" />
              </div>
              <p className="font-['Space_Grotesk'] font-bold text-white text-xs text-center truncate">{getAvatarName(avatar.key)}</p>
              {country !== 'default' && getAvatarName(avatar.key) !== avatar.name && <p className="text-[9px] text-white/30 text-center">({avatar.name})</p>}
              <p className="text-[10px] text-center mt-0.5" style={{ color: avatar.color }}>{avatar.role}</p>
              <p className="text-[#B0B0B0]/60 text-[10px] text-center mt-0.5">{avatar.generation}</p>
            </button>
          );
        })}
      </div>

      {/* Inclusivity note */}
      <div className="mt-6 p-4 bg-[#9C27B0]/10 border border-[#9C27B0]/20 rounded-xl">
        <p className="text-[#B0B0B0] text-xs text-center">
          <span className="text-[#9C27B0] font-bold">{t('customizer.inclusivePhilosophy')}:</span> {t('customizer.inclusiveDesc')}
        </p>
      </div>
    </div>
  );
}

function StepAppearance({ state, setState }: { state: CustomizationState; setState: (s: CustomizationState) => void }) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-['Space_Grotesk'] font-bold text-white text-xl mb-2">Personaliza la apariencia</h3>
        <p className="text-[#B0B0B0] text-sm">Dale tu toque personal al pelaje, ojos y patrón de manchas.</p>
      </div>

      {/* Fur Color */}
      <div>
        <SectionLabel>Tono de pelaje</SectionLabel>
        <div className="flex flex-wrap gap-3">
          {FUR_COLORS.map(c => (
            <ColorSwatch key={c.id} hex={c.hex} name={c.name} selected={state.furColor === c.id}
              onClick={() => setState({ ...state, furColor: c.id })} />
          ))}
        </div>
        <p className="text-[#B0B0B0]/60 text-xs mt-2">Seleccionado: {FUR_COLORS.find(c => c.id === state.furColor)?.name}</p>
      </div>

      {/* Eye Color */}
      <div>
        <SectionLabel>Color de ojos</SectionLabel>
        <div className="flex flex-wrap gap-3">
          {EYE_COLORS.map(c => (
            <ColorSwatch key={c.id} hex={c.hex} name={c.name} selected={state.eyeColor === c.id}
              onClick={() => setState({ ...state, eyeColor: c.id })} />
          ))}
        </div>
        <p className="text-[#B0B0B0]/60 text-xs mt-2">Seleccionado: {EYE_COLORS.find(c => c.id === state.eyeColor)?.name}</p>
      </div>

      {/* Spot Pattern */}
      <div>
        <SectionLabel>Patrón de manchas</SectionLabel>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {SPOT_PATTERNS.map(s => (
            <OptionButton key={s.id} selected={state.spotPattern === s.id}
              onClick={() => setState({ ...state, spotPattern: s.id })}>
              <span className="block font-bold">{s.name}</span>
              <span className="block text-[10px] opacity-70 mt-0.5">{s.desc}</span>
            </OptionButton>
          ))}
        </div>
      </div>

      {/* Expression */}
      <div>
        <SectionLabel>Expresión</SectionLabel>
        <div className="flex flex-wrap gap-2">
          <OptionButton selected={state.expression === "frontal"}
            onClick={() => setState({ ...state, expression: "frontal" })}>
            😊 Frontal
          </OptionButton>
          {state.selectedAvatar && AVATAR_EXPRESSIONS[state.selectedAvatar] &&
            Object.keys(AVATAR_EXPRESSIONS[state.selectedAvatar]).map(expr => (
              <OptionButton key={expr} selected={state.expression === expr}
                onClick={() => setState({ ...state, expression: expr })}>
                {expr === "feliz" ? "😄" : expr === "pensando" ? "🤔" : expr === "celebrando" ? "🎉" : "😉"} {expr.charAt(0).toUpperCase() + expr.slice(1)}
              </OptionButton>
            ))
          }
        </div>
      </div>
    </div>
  );
}

function StepIdentity({ state, setState }: { state: CustomizationState; setState: (s: CustomizationState) => void }) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-['Space_Grotesk'] font-bold text-white text-xl mb-2">Define la identidad</h3>
        <p className="text-[#B0B0B0] text-sm">Nombre, pronombres y voz. Todo es opcional y sin restricciones.</p>
      </div>

      {/* Custom Name */}
      <div>
        <SectionLabel>Nombre personalizado <span className="text-[#B0B0B0]/40 font-normal">(opcional)</span></SectionLabel>
        <input
          type="text"
          value={state.avatarName}
          onChange={e => setState({ ...state, avatarName: e.target.value })}
          placeholder={AVATAR_LIST.find(a => a.key === state.selectedAvatar)?.name || "Nombre del avatar"}
          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-[#B0B0B0]/40 focus:border-[#00E5FF] focus:outline-none focus:shadow-[0_0_12px_rgba(0,229,255,0.2)] transition-all font-['Space_Grotesk']"
          maxLength={20}
        />
        <p className="text-[#B0B0B0]/40 text-xs mt-1">{state.avatarName.length}/20 caracteres</p>
      </div>

      {/* Pronouns */}
      <div>
        <SectionLabel>Pronombres <span className="text-[#B0B0B0]/40 font-normal">(opcional)</span></SectionLabel>
        <div className="flex flex-wrap gap-2">
          {PRONOUN_OPTIONS.map(p => (
            <OptionButton key={p.id} selected={state.pronouns === p.id}
              onClick={() => setState({ ...state, pronouns: p.id })}>
              {p.name}
            </OptionButton>
          ))}
        </div>
      </div>

      {/* Voice */}
      <div>
        <SectionLabel>Voz del tutor</SectionLabel>
        <p className="text-[#B0B0B0]/60 text-xs mb-3">La voz es independiente del avatar elegido</p>
        <div className="flex flex-wrap gap-2">
          {VOICE_OPTIONS.map(v => (
            <OptionButton key={v.id} selected={state.voice === v.id}
              onClick={() => setState({ ...state, voice: v.id })}>
              {v.icon} {v.name}
            </OptionButton>
          ))}
        </div>
      </div>

      {/* Hairstyle */}
      <div>
        <SectionLabel>Peinado <span className="text-[#B0B0B0]/40 font-normal">(sin restricción de género)</span></SectionLabel>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {HAIRSTYLES.map(h => (
            <OptionButton key={h.id} selected={state.hairstyle === h.id}
              onClick={() => setState({ ...state, hairstyle: h.id })}>
              {h.icon} {h.name}
            </OptionButton>
          ))}
        </div>
      </div>
    </div>
  );
}

function StepClothing({ state, setState }: { state: CustomizationState; setState: (s: CustomizationState) => void }) {
  const t = (key: string) => key.split('.').pop() || key;
  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-['Space_Grotesk'] font-bold text-white text-xl mb-2">{t('customizer.clothing')}</h3>
        <p className="text-[#B0B0B0] text-sm">{t('customizer.clothingDesc')}</p>
      </div>

      {/* Clothing type */}
      <div>
        <SectionLabel>{t('customizer.clothingType')}</SectionLabel>
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
          {CLOTHING_OPTIONS.map(c => (
            <OptionButton key={c.id} selected={state.clothing === c.id}
              onClick={() => setState({ ...state, clothing: c.id })}>
              <span className="block text-lg">{c.icon}</span>
              <span className="block text-[10px] mt-0.5">{c.name}</span>
            </OptionButton>
          ))}
        </div>
      </div>

      {/* Clothing color */}
      <div>
        <SectionLabel>{t('customizer.clothingColor')}</SectionLabel>
        <div className="flex flex-wrap gap-3">
          {CLOTHING_COLORS.map(c => (
            <ColorSwatch key={c.id} hex={c.hex} name={c.name} selected={state.clothingColor === c.id}
              onClick={() => setState({ ...state, clothingColor: c.id })} />
          ))}
        </div>
        <p className="text-[#B0B0B0]/60 text-xs mt-2">{t('customizer.selected')}: {CLOTHING_COLORS.find(c => c.id === state.clothingColor)?.name}</p>
      </div>
    </div>
  );
}

function StepAccessories({ state, setState }: { state: CustomizationState; setState: (s: CustomizationState) => void }) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-['Space_Grotesk'] font-bold text-white text-xl mb-2">Accesorios</h3>
        <p className="text-[#B0B0B0] text-sm">Accesorios de cabeza, cuerpo y diversidad cultural.</p>
      </div>

      {/* Head accessories */}
      <div>
        <SectionLabel>Accesorios de cabeza</SectionLabel>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {HEAD_ACCESSORIES.map(a => (
            <OptionButton key={a.id} selected={state.headAccessory === a.id}
              onClick={() => setState({ ...state, headAccessory: a.id })}>
              <span className="mr-1">{a.icon}</span> {a.name}
            </OptionButton>
          ))}
        </div>
      </div>

      {/* Body accessories */}
      <div>
        <SectionLabel>Accesorios de cuerpo</SectionLabel>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {BODY_ACCESSORIES.map(a => (
            <OptionButton key={a.id} selected={state.bodyAccessory === a.id}
              onClick={() => setState({ ...state, bodyAccessory: a.id })}>
              <span className="mr-1">{a.icon}</span> {a.name}
            </OptionButton>
          ))}
        </div>
      </div>
    </div>
  );
}

function StepAssistive({ state, setState }: { state: CustomizationState; setState: (s: CustomizationState) => void }) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-['Space_Grotesk'] font-bold text-white text-xl mb-2">Diversidad Funcional</h3>
        <p className="text-[#B0B0B0] text-sm">Representación respetuosa de la diversidad. Todos los dispositivos son gratuitos.</p>
      </div>

      {/* Free banner */}
      <div className="p-4 bg-[#00C853]/10 border border-[#00C853]/30 rounded-xl">
        <p className="text-[#00C853] font-['Space_Grotesk'] font-bold text-sm flex items-center gap-2">
          <span>❤️</span> REGLA INQUEBRANTABLE: Los dispositivos de asistencia son SIEMPRE GRATUITOS. La representación NUNCA se monetiza.
        </p>
      </div>

      {/* Assistive devices */}
      <div>
        <SectionLabel badge="GRATIS SIEMPRE">Dispositivo de asistencia</SectionLabel>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {ASSISTIVE_DEVICES.map(d => (
            <OptionButton key={d.id} selected={state.assistiveDevice === d.id}
              onClick={() => setState({ ...state, assistiveDevice: d.id })}
              className={state.assistiveDevice === d.id ? "" : ""}>
              <span className="block text-lg">{d.icon}</span>
              <span className="block text-[10px] mt-0.5">{d.name}</span>
            </OptionButton>
          ))}
        </div>
      </div>

      {/* Assistive color */}
      {state.assistiveDevice !== "ninguno" && (
        <div>
          <SectionLabel>Color del dispositivo</SectionLabel>
          <div className="flex flex-wrap gap-3">
            {ASSISTIVE_COLORS.map(c => (
              <ColorSwatch key={c.id} hex={c.hex} name={c.name} selected={state.assistiveColor === c.id}
                onClick={() => setState({ ...state, assistiveColor: c.id })} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function StepSummary({ state, onExportJSON, onExportPNG, isExporting }: { state: CustomizationState; onExportJSON: () => void; onExportPNG: () => void; isExporting: boolean }) {
  const avatar = AVATAR_LIST.find(a => a.key === state.selectedAvatar);
  const fur = FUR_COLORS.find(c => c.id === state.furColor);
  const eye = EYE_COLORS.find(c => c.id === state.eyeColor);
  const spot = SPOT_PATTERNS.find(s => s.id === state.spotPattern);
  const cloth = CLOTHING_OPTIONS.find(c => c.id === state.clothing);
  const clothColor = CLOTHING_COLORS.find(c => c.id === state.clothingColor);
  const head = HEAD_ACCESSORIES.find(a => a.id === state.headAccessory);
  const hair = HAIRSTYLES.find(h => h.id === state.hairstyle);
  const body = BODY_ACCESSORIES.find(a => a.id === state.bodyAccessory);
  const assist = ASSISTIVE_DEVICES.find(d => d.id === state.assistiveDevice);
  const voice = VOICE_OPTIONS.find(v => v.id === state.voice);
  const pronoun = PRONOUN_OPTIONS.find(p => p.id === state.pronouns);

  const summaryRows = [
    { label: "Avatar base", value: avatar?.name || "—", color: avatar?.color },
    { label: "Nombre", value: state.avatarName || avatar?.name || "—" },
    { label: "Pronombres", value: pronoun?.name || "—" },
    { label: "Pelaje", value: fur?.name || "—", swatch: fur?.hex },
    { label: "Ojos", value: eye?.name || "—", swatch: eye?.hex },
    { label: "Manchas", value: spot?.name || "—" },
    { label: "Peinado", value: `${hair?.icon || ""} ${hair?.name || "—"}` },
    { label: "Ropa", value: `${cloth?.icon || ""} ${cloth?.name || "—"} (${clothColor?.name || ""})`, swatch: clothColor?.hex },
    { label: "Cabeza", value: head?.id !== "ninguno" ? `${head?.icon || ""} ${head?.name || "—"}` : "Ninguno" },
    { label: "Cuerpo", value: body?.id !== "ninguno" ? `${body?.icon || ""} ${body?.name || "—"}` : "Ninguno" },
    { label: "Diversidad", value: assist?.id !== "ninguno" ? `${assist?.icon || ""} ${assist?.name || "—"}` : "Ninguno" },
    { label: "Voz", value: `${voice?.icon || ""} ${voice?.name || "—"}` },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-['Space_Grotesk'] font-bold text-white text-xl mb-2">Tu avatar está listo</h3>
        <p className="text-[#B0B0B0] text-sm">Resumen de todas las personalizaciones. Puedes volver a cualquier paso para cambiar algo.</p>
      </div>

      <div className="grid gap-2">
        {summaryRows.map((row, i) => (
          <div key={i} className="flex items-center justify-between py-2 px-3 bg-white/[0.02] rounded-lg border border-white/[0.04]">
            <span className="text-[#B0B0B0] text-sm">{row.label}</span>
            <div className="flex items-center gap-2">
              {row.swatch && (
                <div className="w-4 h-4 rounded-full border border-white/20" style={{
                  background: row.swatch.includes('gradient') ? row.swatch : row.swatch,
                  backgroundColor: row.swatch.includes('gradient') ? undefined : row.swatch,
                }} />
              )}
              <span className="text-white text-sm font-medium" style={row.color ? { color: row.color } : {}}>
                {row.value}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Export buttons */}
      <div className="p-5 bg-white/[0.02] border border-white/[0.08] rounded-xl">
        <h4 className="font-['Space_Grotesk'] font-bold text-white text-sm mb-3">Exportar configuración</h4>
        <p className="text-[#B0B0B0] text-xs mb-4">Descarga tu avatar personalizado para compartirlo con el equipo o guardarlo como referencia.</p>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={onExportJSON}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#00E5FF]/10 border border-[#00E5FF]/30 text-[#00E5FF] rounded-lg font-bold text-sm hover:bg-[#00E5FF]/20 transition-all"
          >
            <span>📋</span> Descargar JSON
          </button>
          <button
            onClick={onExportPNG}
            disabled={isExporting}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-bold text-sm transition-all ${
              isExporting
                ? "bg-white/10 text-white/40 cursor-wait"
                : "bg-[#D4A843]/10 border border-[#D4A843]/30 text-[#D4A843] hover:bg-[#D4A843]/20"
            }`}
          >
            <span>{isExporting ? "⏳" : "🖼️"}</span> {isExporting ? "Generando..." : "Descargar PNG"}
          </button>
        </div>
      </div>

      {/* CTA */}
      <div className="p-5 bg-gradient-to-r from-[#00E5FF]/10 to-[#D4A843]/10 border border-[#00E5FF]/20 rounded-xl text-center">
        <p className="text-white font-['Space_Grotesk'] font-bold text-lg mb-2">
          ¡{state.avatarName || avatar?.name} está listo para enseñarte IA!
        </p>
        <p className="text-[#B0B0B0] text-sm">
          Podrás cambiar cualquier personalización en cualquier momento desde Perfil &gt; Mi Avatar
        </p>
        <div className="mt-4 flex justify-center gap-3">
          <span className="px-4 py-2 bg-[#00E5FF] text-[#0A0A0A] rounded-lg font-bold text-sm shadow-[0_0_20px_rgba(0,229,255,0.3)]">
            Empezar a aprender
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── MAIN PAGE COMPONENT ───
export default function AvatarCustomizer() {
  const t = (key: string) => key.split('.').pop() || key;
  const steps = useSteps();
  const [state, setState] = useState<CustomizationState>(INITIAL_STATE);
  const [currentStep, setCurrentStep] = useState<Step>("select");
  const [isExporting, setIsExporting] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const avatarPreviewRef = useRef<HTMLDivElement>(null);

  const currentStepIndex = steps.findIndex(s => s.id === currentStep);
  const canGoNext = currentStep === "select" ? !!state.selectedAvatar : true;

  // Export avatar config as JSON
  const handleExportJSON = useCallback(() => {
    const avatar = AVATAR_LIST.find(a => a.key === state.selectedAvatar);
    const exportData = {
      _meta: {
        app: "LINCE",
        version: "1.0.0",
        exportDate: new Date().toISOString(),
        copyright: "\u00a9 2026 ACNB IA SL. Todos los derechos reservados.",
      },
      avatar: {
        base: state.selectedAvatar,
        baseName: avatar?.name || state.selectedAvatar,
        generation: avatar?.generation || "—",
        role: avatar?.role || "—",
        customName: state.avatarName || avatar?.name || "",
      },
      identity: {
        pronouns: state.pronouns,
        pronounsLabel: PRONOUN_OPTIONS.find(p => p.id === state.pronouns)?.name || "—",
        voice: state.voice,
        voiceLabel: VOICE_OPTIONS.find(v => v.id === state.voice)?.name || "—",
      },
      appearance: {
        furColor: state.furColor,
        furColorName: FUR_COLORS.find(c => c.id === state.furColor)?.name || "—",
        furColorHex: FUR_COLORS.find(c => c.id === state.furColor)?.hex || "—",
        eyeColor: state.eyeColor,
        eyeColorName: EYE_COLORS.find(c => c.id === state.eyeColor)?.name || "—",
        spotPattern: state.spotPattern,
        spotPatternName: SPOT_PATTERNS.find(s => s.id === state.spotPattern)?.name || "—",
        expression: state.expression,
        hairstyle: state.hairstyle,
        hairstyleName: HAIRSTYLES.find(h => h.id === state.hairstyle)?.name || "—",
      },
      clothing: {
        type: state.clothing,
        typeName: CLOTHING_OPTIONS.find(c => c.id === state.clothing)?.name || "—",
        color: state.clothingColor,
        colorName: CLOTHING_COLORS.find(c => c.id === state.clothingColor)?.name || "—",
        colorHex: CLOTHING_COLORS.find(c => c.id === state.clothingColor)?.hex || "—",
      },
      accessories: {
        head: state.headAccessory,
        headName: HEAD_ACCESSORIES.find(a => a.id === state.headAccessory)?.name || "—",
        body: state.bodyAccessory,
        bodyName: BODY_ACCESSORIES.find(a => a.id === state.bodyAccessory)?.name || "—",
      },
      diversity: {
        assistiveDevice: state.assistiveDevice,
        assistiveDeviceName: ASSISTIVE_DEVICES.find(d => d.id === state.assistiveDevice)?.name || "Ninguno",
        assistiveColor: state.assistiveColor,
        assistiveColorName: ASSISTIVE_COLORS.find(c => c.id === state.assistiveColor)?.name || "—",
        note: "Los dispositivos de asistencia son SIEMPRE GRATUITOS. La representaci\u00f3n NUNCA se monetiza.",
      },
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `lince-avatar-${(state.avatarName || avatar?.name || state.selectedAvatar || "avatar").toLowerCase().replace(/\s+/g, "-")}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [state]);

  // Export avatar preview as PNG — generates a branded card with avatar info
  const handleExportPNG = useCallback(async () => {
    setIsExporting(true);
    try {
      const avatar = AVATAR_LIST.find(av => av.key === state.selectedAvatar);
      const avatarKey = state.selectedAvatar || "YAYALIN";
      const furColor = FUR_COLORS.find(f => f.id === state.furColor);
      const eyeColor = EYE_COLORS.find(e => e.id === state.eyeColor);
      
      const W = 600;
      const H = 720;
      const canvas = document.createElement("canvas");
      canvas.width = W;
      canvas.height = H;
      const ctx = canvas.getContext("2d")!;
      
      // Background gradient
      const grad = ctx.createLinearGradient(0, 0, 0, H);
      grad.addColorStop(0, "#0f172a");
      grad.addColorStop(0.5, "#1a1a2e");
      grad.addColorStop(1, "#0a0a14");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, W, H);
      
      // Accent top bar
      ctx.fillStyle = "#00E5FF";
      ctx.fillRect(0, 0, W, 5);
      
      // LINCE header
      ctx.font = "bold 14px sans-serif";
      ctx.fillStyle = "#00E5FF";
      ctx.textAlign = "center";
      ctx.fillText("LINCE\u00ae \u2014 AVATAR PERSONALIZADO", W / 2, 35);
      
      // Large avatar circle with fur color
      const circleY = 140;
      const circleR = 80;
      ctx.save();
      ctx.beginPath();
      ctx.arc(W / 2, circleY, circleR, 0, Math.PI * 2);
      const circGrad = ctx.createRadialGradient(W / 2, circleY, 0, W / 2, circleY, circleR);
      circGrad.addColorStop(0, furColor?.hex || "#DAA520");
      circGrad.addColorStop(1, "rgba(0,0,0,0.3)");
      ctx.fillStyle = circGrad;
      ctx.fill();
      ctx.restore();
      
      // Paw emoji in circle
      ctx.font = "60px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("\uD83D\uDC3E", W / 2, circleY);
      ctx.textBaseline = "alphabetic";
      
      // Avatar name
      const nameY = circleY + circleR + 40;
      ctx.font = "bold 36px sans-serif";
      ctx.fillStyle = "#FFFFFF";
      ctx.textAlign = "center";
      ctx.fillText(state.avatarName || avatar?.name || avatarKey, W / 2, nameY);
      
      // Role subtitle
      ctx.font = "18px sans-serif";
      ctx.fillStyle = "#00E5FF";
      ctx.fillText(avatar?.role || "", W / 2, nameY + 30);
      
      // Generation badge
      ctx.font = "12px sans-serif";
      ctx.fillStyle = "rgba(255,255,255,0.4)";
      ctx.fillText(avatar?.generation || "", W / 2, nameY + 52);
      
      // Separator line
      ctx.strokeStyle = "rgba(0,229,255,0.3)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(80, nameY + 70);
      ctx.lineTo(W - 80, nameY + 70);
      ctx.stroke();
      
      // Customization details
      const detailsY = nameY + 100;
      const leftCol = 80;
      const rightCol = W - 80;
      const lineH = 32;
      
      const details: [string, string, string][] = [
        ["\uD83E\uDDF6", "Pelaje", furColor?.name || "Dorado"],
        ["\uD83D\uDC41\uFE0F", "Ojos", eyeColor?.name || "\u00c1mbar"],
        ["\uD83D\uDC3E", "Manchas", SPOT_PATTERNS.find(s => s.id === state.spotPattern)?.name || "Cl\u00e1sico"],
        ["\u2702\uFE0F", "Peinado", HAIRSTYLES.find(h => h.id === state.hairstyle)?.name || "Corto"],
        ["\uD83D\uDC55", "Ropa", CLOTHING_OPTIONS.find(c => c.id === state.clothing)?.name || "Camiseta"],
        ["\uD83D\uDDE3\uFE0F", "Pronombres", PRONOUN_OPTIONS.find(p => p.id === state.pronouns)?.name || "Sin preferencia"],
        ["\u267F", "Diversidad", ASSISTIVE_DEVICES.find(d => d.id === state.assistiveDevice)?.name || "Ninguno"],
      ];
      
      details.forEach(([icon, label, value], i) => {
        const y = detailsY + i * lineH;
        // Row background (alternating)
        if (i % 2 === 0) {
          ctx.fillStyle = "rgba(255,255,255,0.03)";
          ctx.fillRect(leftCol - 10, y - 14, rightCol - leftCol + 20, lineH);
        }
        // Icon
        ctx.font = "14px sans-serif";
        ctx.textAlign = "left";
        ctx.fillText(icon, leftCol, y + 2);
        // Label
        ctx.font = "14px sans-serif";
        ctx.fillStyle = "rgba(255,255,255,0.5)";
        ctx.textAlign = "left";
        ctx.fillText(label, leftCol + 28, y + 2);
        // Value
        ctx.font = "bold 14px sans-serif";
        ctx.fillStyle = "#FFFFFF";
        ctx.textAlign = "right";
        ctx.fillText(value, rightCol, y + 2);
      });
      
      // Footer
      ctx.font = "11px sans-serif";
      ctx.fillStyle = "rgba(255,255,255,0.25)";
      ctx.textAlign = "center";
      ctx.fillText("\u00a9 2026 ACNB IA SL \u2014 LINCE\u00ae \u2014 Todos los derechos reservados", W / 2, H - 20);
      ctx.font = "10px sans-serif";
      ctx.fillText("Propiedad de ACNB IA SL \u2014 Propiedad Intelectual Registrada", W / 2, H - 6);
      
      // Download
      const dataUrl = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = `lince-avatar-${(state.avatarName || avatar?.name || avatarKey).toLowerCase().replace(/\s+/g, "-")}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (err) {
      console.error("Error exporting PNG:", err);
    } finally {
      setIsExporting(false);
    }
  }, [state]);

  const goNext = useCallback(() => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStep(steps[currentStepIndex + 1].id);
      contentRef.current?.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [currentStepIndex, steps]);

  const goPrev = useCallback(() => {
    if (currentStepIndex > 0) {
      setCurrentStep(steps[currentStepIndex - 1].id);
      contentRef.current?.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [currentStepIndex, steps]);

  // Scroll to top on step change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentStep]);

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      {/* Top bar */}
      <header className="sticky top-0 z-50 bg-[#0A0A0A]/95 backdrop-blur-md border-b border-[#00E5FF]/10">
        <div className="container flex items-center justify-between h-12 sm:h-14">
          <a href="/?nda=ok" className="flex items-center gap-1.5 hover:opacity-80 transition-opacity">
            
            <span className="font-['Space_Grotesk'] font-bold text-base sm:text-lg text-[#00E5FF]">LINCE</span>
          </a>
          <span className="text-[#B0B0B0] text-[10px] sm:text-xs font-['JetBrains_Mono'] hidden sm:inline">{t('customizer.headerTitle')}</span>
          <div className="flex items-center gap-2">
            <a href="/?nda=ok" className="text-[#B0B0B0] text-xs sm:text-sm hover:text-white transition-colors">← <span className="hidden sm:inline">{t('customizer.backToPRD')}</span><span className="sm:hidden">Inicio</span></a>
            <UserNavBadge variant="compact" />
          </div>
        </div>
      </header>

      {/* Progress bar */}
      <div className="bg-[#111111] border-b border-white/5">
        <div className="container py-2 sm:py-3">
          <div className="flex items-center gap-1 overflow-x-auto pb-1 -mx-4 px-4 sm:mx-0 sm:px-0">
            {steps.map((step, i) => {
              const isActive = step.id === currentStep;
              const isPast = i < currentStepIndex;
              return (
                <button
                  key={step.id}
                  onClick={() => {
                    if (isPast || isActive) {
                      setCurrentStep(step.id);
                    } else if (canGoNext) {
                      setCurrentStep(step.id);
                    }
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                    isActive
                      ? "bg-[#00E5FF] text-[#0A0A0A] font-bold shadow-[0_0_16px_rgba(0,229,255,0.3)]"
                      : isPast
                        ? "bg-[#00E5FF]/10 text-[#00E5FF] cursor-pointer hover:bg-[#00E5FF]/20"
                        : "bg-white/5 text-[#B0B0B0]/50"
                  }`}
                >
                  <span>{step.icon}</span>
                  <span className="hidden sm:inline">{step.label}</span>
                  <span className="sm:hidden">{i + 1}</span>
                </button>
              );
            })}
          </div>
          {/* Progress line */}
          <div className="mt-2 h-1 bg-white/5 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#00E5FF] to-[#D4A843] rounded-full transition-all duration-500"
              style={{ width: `${((currentStepIndex + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="container py-4 sm:py-8">
        <div className={`grid gap-4 sm:gap-8 ${currentStep !== "select" && state.selectedAvatar ? "lg:grid-cols-[1fr_320px]" : ""}`}>
          {/* Left: Step content */}
          <div ref={contentRef} className="min-w-0">
            {currentStep === "select" && <StepSelect state={state} setState={setState} />}
            {currentStep === "appearance" && <StepAppearance state={state} setState={setState} />}
            {currentStep === "identity" && <StepIdentity state={state} setState={setState} />}
            {currentStep === "clothing" && <StepClothing state={state} setState={setState} />}
            {currentStep === "accessories" && <StepAccessories state={state} setState={setState} />}
            {currentStep === "assistive" && <StepAssistive state={state} setState={setState} />}
            {currentStep === "summary" && <StepSummary state={state} onExportJSON={handleExportJSON} onExportPNG={handleExportPNG} isExporting={isExporting} />}
          </div>

          {/* Right: Live preview (sticky) */}
          {currentStep !== "select" && state.selectedAvatar && (
            <div className="hidden lg:block">
              <div className="sticky top-24">
                <div className="p-6 bg-[#111111] border border-white/[0.06] rounded-2xl">
                  <h4 className="font-['Space_Grotesk'] font-bold text-[#00E5FF] text-xs mb-4 text-center tracking-widest uppercase">
                    Vista previa en vivo
                  </h4>
                  <AvatarPreview state={state} previewRef={avatarPreviewRef} />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Mobile preview (collapsible) */}
        {currentStep !== "select" && state.selectedAvatar && (
          <div className="lg:hidden mt-4 sm:mt-6">
            <details className="bg-[#111111] border border-white/[0.06] rounded-xl sm:rounded-2xl" open>
              <summary className="p-3 sm:p-4 cursor-pointer font-['Space_Grotesk'] font-bold text-[#00E5FF] text-xs sm:text-sm text-center">
                👁️ Ver vista previa del avatar
              </summary>
              <div className="p-3 sm:p-4 pt-0">
                <AvatarPreview state={state} compact previewRef={currentStep === "summary" ? avatarPreviewRef : undefined} />
              </div>
            </details>
          </div>
        )}

        {/* Navigation buttons */}
        <div className="mt-6 sm:mt-8 flex items-center justify-between gap-2">
          <button
            onClick={goPrev}
            disabled={currentStepIndex === 0}
            className={`px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-['Space_Grotesk'] font-bold text-xs sm:text-sm transition-all ${
              currentStepIndex === 0
                ? "bg-white/5 text-[#B0B0B0]/30 cursor-not-allowed"
                : "bg-white/5 text-white hover:bg-white/10 border border-white/10"
            }`}
          >
            ← <span className="hidden sm:inline">{t('customizer.previous')}</span>
          </button>

          <span className="text-[#B0B0B0]/40 text-[10px] sm:text-xs font-['JetBrains_Mono']">
            {currentStepIndex + 1} / {steps.length}
          </span>

          {currentStepIndex < steps.length - 1 ? (
            <button
              onClick={goNext}
              disabled={!canGoNext}
              className={`px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-['Space_Grotesk'] font-bold text-xs sm:text-sm transition-all ${
                canGoNext
                  ? "bg-[#00E5FF] text-[#0A0A0A] hover:bg-[#00E5FF]/90 shadow-[0_0_20px_rgba(0,229,255,0.3)]"
                  : "bg-white/10 text-white/30 cursor-not-allowed"
              }`}
            >
              <span className="hidden sm:inline">{t('customizer.next')}</span> →
            </button>
          ) : (
            <a
              href="/?nda=ok"
              className="px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-['Space_Grotesk'] font-bold text-xs sm:text-sm bg-gradient-to-r from-[#00E5FF] to-[#D4A843] text-[#0A0A0A] shadow-[0_0_20px_rgba(0,229,255,0.3)] hover:opacity-90 transition-opacity"
            >
              {t('customizer.backToPRD')}
            </a>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/5 py-4 sm:py-6 mt-8 sm:mt-12">
        <div className="container text-center">
          <p className="text-[#B0B0B0]/30 text-[10px]">
              {t('common.copyright')} — {t('customizer.headerTitle')}
          </p>
          <p className="text-[#B0B0B0]/20 text-[10px] mt-1">
              {t('common.createdBy')}
          </p>
        </div>
      </footer>
    </div>
  );
}

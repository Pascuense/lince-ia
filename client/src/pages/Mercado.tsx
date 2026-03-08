import { useState, useMemo } from "react";
import { useGame } from "@/contexts/GameContext";
import { usePRDLanguage } from "@/contexts/PRDLanguageContext";
import { AVATAR_FRONTAL, ALL_CHARACTERS } from "@/lib/avatarConstants";
import { GlobalNavBar } from "@/components/GlobalNavBar";
import { BackButton } from "@/components/BackButton";
import RequireLogin from "@/components/RequireLogin";
import { toast } from "sonner";
import { ShoppingBag, Flame, Palette, Star, Lock, Check, Sparkles, Shield, Crown } from "lucide-react";

// ─── Types ───
interface ShopItem {
  id: string;
  name: Record<string, string>;
  desc: Record<string, string>;
  price: number;
  category: "avatar" | "background" | "shield" | "badge" | "boost";
  icon: string;
  rarity: "common" | "rare" | "epic" | "legendary";
  preview?: string; // avatar key or color
}

// ─── Shop Catalog ───
const SHOP_ITEMS: ShopItem[] = [
  // ─── Exclusive Avatars ───
  {
    id: "avatar_golden_lince",
    name: { es: "Lince Dorado", en: "Golden Lynx", zh: "金色山猫" },
    desc: { es: "Un lince legendario bañado en oro. Solo para los más dedicados.", en: "A legendary golden lynx. Only for the most dedicated.", zh: "传说中的金色山猫。只属于最专注的人。" },
    price: 500,
    category: "avatar",
    icon: "👑",
    rarity: "legendary",
    preview: "PEQUELIN",
  },
  {
    id: "avatar_cyber_lince",
    name: { es: "Lince Cyber", en: "Cyber Lynx", zh: "赛博山猫" },
    desc: { es: "Versión cyberpunk con circuitos neón. Impresiona a todos.", en: "Cyberpunk version with neon circuits. Impress everyone.", zh: "赛博朋克版本，带有霓虹电路。给所有人留下深刻印象。" },
    price: 350,
    category: "avatar",
    icon: "🤖",
    rarity: "epic",
    preview: "TECNOLINX",
  },
  {
    id: "avatar_ninja_lince",
    name: { es: "Lince Ninja", en: "Ninja Lynx", zh: "忍者山猫" },
    desc: { es: "Sigiloso y letal. El avatar perfecto para maestros del prompt.", en: "Stealthy and lethal. The perfect avatar for prompt masters.", zh: "隐秘而致命。提示词大师的完美化身。" },
    price: 250,
    category: "avatar",
    icon: "🥷",
    rarity: "rare",
    preview: "YAYALIN",
  },
  {
    id: "avatar_space_lince",
    name: { es: "Lince Espacial", en: "Space Lynx", zh: "太空山猫" },
    desc: { es: "Explora las galaxias de la IA con este avatar cósmico.", en: "Explore AI galaxies with this cosmic avatar.", zh: "用这个宇宙化身探索AI银河系。" },
    price: 200,
    category: "avatar",
    icon: "🚀",
    rarity: "rare",
    preview: "SABELIN",
  },
  {
    id: "avatar_fire_lince",
    name: { es: "Lince de Fuego", en: "Fire Lynx", zh: "火焰山猫" },
    desc: { es: "Arde con pasión por aprender. Efecto de llamas incluido.", en: "Burns with passion for learning. Flame effect included.", zh: "燃烧着学习的热情。包含火焰效果。" },
    price: 150,
    category: "avatar",
    icon: "🔥",
    rarity: "common",
    preview: "PAPALIN",
  },

  // ─── Profile Backgrounds ───
  {
    id: "bg_nebula",
    name: { es: "Fondo Nebulosa", en: "Nebula Background", zh: "星云背景" },
    desc: { es: "Un fondo cósmico con estrellas y nebulosas para tu perfil.", en: "A cosmic background with stars and nebulas for your profile.", zh: "为你的个人资料提供带有星星和星云的宇宙背景。" },
    price: 100,
    category: "background",
    icon: "🌌",
    rarity: "rare",
  },
  {
    id: "bg_matrix",
    name: { es: "Fondo Matrix", en: "Matrix Background", zh: "矩阵背景" },
    desc: { es: "Lluvia de código verde al estilo Matrix. Para hackers de IA.", en: "Green code rain Matrix-style. For AI hackers.", zh: "矩阵风格的绿色代码雨。适合AI黑客。" },
    price: 80,
    category: "background",
    icon: "💚",
    rarity: "common",
  },
  {
    id: "bg_aurora",
    name: { es: "Fondo Aurora Boreal", en: "Northern Lights Background", zh: "极光背景" },
    desc: { es: "Luces del norte danzando en tu perfil. Elegante y único.", en: "Northern lights dancing on your profile. Elegant and unique.", zh: "北极光在你的个人资料上舞动。优雅而独特。" },
    price: 120,
    category: "background",
    icon: "🌈",
    rarity: "epic",
  },

  // ─── Streak Shields ───
  {
    id: "shield_bronze",
    name: { es: "Escudo de Bronce", en: "Bronze Shield", zh: "青铜盾牌" },
    desc: { es: "Protege tu racha por 1 día. No pierdas tu progreso.", en: "Protect your streak for 1 day. Don't lose your progress.", zh: "保护你的连续记录1天。不要失去你的进度。" },
    price: 50,
    category: "shield",
    icon: "🛡️",
    rarity: "common",
  },
  {
    id: "shield_silver",
    name: { es: "Escudo de Plata", en: "Silver Shield", zh: "银盾" },
    desc: { es: "Protege tu racha por 2 días. Doble seguridad.", en: "Protect your streak for 2 days. Double security.", zh: "保护你的连续记录2天。双重安全。" },
    price: 100,
    category: "shield",
    icon: "🛡️",
    rarity: "rare",
  },
  {
    id: "shield_gold",
    name: { es: "Escudo de Oro", en: "Gold Shield", zh: "金盾" },
    desc: { es: "Protege tu racha por 3 días. La protección definitiva.", en: "Protect your streak for 3 days. The ultimate protection.", zh: "保护你的连续记录3天。终极保护。" },
    price: 200,
    category: "shield",
    icon: "🛡️",
    rarity: "epic",
  },

  // ─── Badges ───
  {
    id: "badge_creator",
    name: { es: "Insignia Creador", en: "Creator Badge", zh: "创作者徽章" },
    desc: { es: "Demuestra que fuiste de los primeros en LINCE.", en: "Show you were one of the first in LINCE.", zh: "证明你是LINCE的先驱之一。" },
    price: 75,
    category: "badge",
    icon: "🏅",
    rarity: "rare",
  },
  {
    id: "badge_ai_master",
    name: { es: "Insignia Maestro IA", en: "AI Master Badge", zh: "AI大师徽章" },
    desc: { es: "Solo para quienes dominan el arte del prompt.", en: "Only for those who master the art of prompting.", zh: "只属于掌握提示词艺术的人。" },
    price: 300,
    category: "badge",
    icon: "🧠",
    rarity: "legendary",
  },

  // ─── Boosts ───
  {
    id: "boost_double_xp",
    name: { es: "Doble XP (24h)", en: "Double XP (24h)", zh: "双倍经验(24小时)" },
    desc: { es: "Gana el doble de XP durante 24 horas. Sube de nivel más rápido.", en: "Earn double XP for 24 hours. Level up faster.", zh: "24小时内获得双倍经验值。更快升级。" },
    price: 150,
    category: "boost",
    icon: "⚡",
    rarity: "epic",
  },
  {
    id: "boost_double_coins",
    name: { es: "Doble Monedas (24h)", en: "Double Coins (24h)", zh: "双倍金币(24小时)" },
    desc: { es: "Gana el doble de LinceCoins durante 24 horas.", en: "Earn double LinceCoins for 24 hours.", zh: "24小时内获得双倍林斯币。" },
    price: 175,
    category: "boost",
    icon: "💰",
    rarity: "epic",
  },
];

const RARITY_COLORS: Record<string, { bg: string; border: string; text: string; glow: string }> = {
  common: { bg: "bg-gray-800/50", border: "border-gray-600/30", text: "text-gray-400", glow: "" },
  rare: { bg: "bg-blue-900/30", border: "border-blue-500/30", text: "text-blue-400", glow: "shadow-[0_0_15px_rgba(59,130,246,0.15)]" },
  epic: { bg: "bg-purple-900/30", border: "border-purple-500/30", text: "text-purple-400", glow: "shadow-[0_0_20px_rgba(139,92,246,0.2)]" },
  legendary: { bg: "bg-amber-900/20", border: "border-amber-500/40", text: "text-amber-400", glow: "shadow-[0_0_25px_rgba(245,158,11,0.25)]" },
};

const RARITY_LABELS: Record<string, Record<string, string>> = {
  common: { es: "Común", en: "Common", zh: "普通" },
  rare: { es: "Raro", en: "Rare", zh: "稀有" },
  epic: { es: "Épico", en: "Epic", zh: "史诗" },
  legendary: { es: "Legendario", en: "Legendary", zh: "传说" },
};

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  avatar: <Crown className="w-4 h-4" />,
  background: <Palette className="w-4 h-4" />,
  shield: <Shield className="w-4 h-4" />,
  badge: <Star className="w-4 h-4" />,
  boost: <Sparkles className="w-4 h-4" />,
};

const CATEGORY_LABELS: Record<string, Record<string, string>> = {
  all: { es: "Todo", en: "All", zh: "全部" },
  avatar: { es: "Especialistas", en: "Avatars", zh: "角色" },
  background: { es: "Fondos", en: "Backgrounds", zh: "背景" },
  shield: { es: "Escudos", en: "Shields", zh: "盾牌" },
  badge: { es: "Insignias", en: "Badges", zh: "徽章" },
  boost: { es: "Boosts", en: "Boosts", zh: "加速" },
};

const T: Record<string, Record<string, string>> = {
  es: {
    title: "Tienda LINCE",
    subtitle: "Gasta tus LinceCoins en premios exclusivos",
    balance: "Tu saldo",
    buy: "Comprar",
    owned: "Adquirido",
    notEnough: "Fondos insuficientes",
    confirmTitle: "Confirmar compra",
    confirmMsg: "¿Quieres comprar",
    confirmPrice: "por",
    confirmYes: "Comprar",
    confirmNo: "Cancelar",
    purchased: "¡Compra realizada!",
    equipped: "¡Equipado!",
    equip: "Equipar",
    earnMore: "Gana más LinceCoins",
    earnTip1: "Completa niveles del juego",
    earnTip2: "Reclama recompensas diarias",
    earnTip3: "Mantén tu racha activa",
    earnTip4: "Completa retos diarios",
    empty: "No hay items en esta categoría",
  },
  en: {
    title: "LINCE Shop",
    subtitle: "Spend your LinceCoins on exclusive prizes",
    balance: "Your balance",
    buy: "Buy",
    owned: "Owned",
    notEnough: "Insufficient funds",
    confirmTitle: "Confirm purchase",
    confirmMsg: "Do you want to buy",
    confirmPrice: "for",
    confirmYes: "Buy",
    confirmNo: "Cancel",
    purchased: "Purchase complete!",
    equipped: "Equipped!",
    equip: "Equip",
    earnMore: "Earn more LinceCoins",
    earnTip1: "Complete game levels",
    earnTip2: "Claim daily rewards",
    earnTip3: "Keep your streak active",
    earnTip4: "Complete daily challenges",
    empty: "No items in this category",
  },
  zh: {
    title: "LINCE 商店",
    subtitle: "用你的林斯币兑换独家奖励",
    balance: "你的余额",
    buy: "购买",
    owned: "已拥有",
    notEnough: "余额不足",
    confirmTitle: "确认购买",
    confirmMsg: "你想购买",
    confirmPrice: "花费",
    confirmYes: "购买",
    confirmNo: "取消",
    purchased: "购买成功！",
    equipped: "已装备！",
    equip: "装备",
    earnMore: "赚取更多林斯币",
    earnTip1: "完成游戏关卡",
    earnTip2: "领取每日奖励",
    earnTip3: "保持连续记录",
    earnTip4: "完成每日挑战",
    empty: "此类别没有物品",
  },
};

const PURCHASED_KEY = "lince_purchased_items";
const EQUIPPED_KEY = "lince_equipped_items";

function getPurchasedItems(): string[] {
  try {
    return JSON.parse(localStorage.getItem(PURCHASED_KEY) || "[]");
  } catch { return []; }
}

function savePurchasedItems(items: string[]) {
  localStorage.setItem(PURCHASED_KEY, JSON.stringify(items));
}

function getEquippedItems(): Record<string, string> {
  try {
    return JSON.parse(localStorage.getItem(EQUIPPED_KEY) || "{}");
  } catch { return {}; }
}

function saveEquippedItems(items: Record<string, string>) {
  localStorage.setItem(EQUIPPED_KEY, JSON.stringify(items));
}

export default function Mercado() {
  const { state, addCoins } = useGame();
  const { lang } = usePRDLanguage();
  const l = lang as string;
  const t = (key: string) => T[l]?.[key] || T.es[key] || key;

  const [category, setCategory] = useState<string>("all");
  const [purchasedItems, setPurchasedItems] = useState<string[]>(getPurchasedItems);
  const [equippedItems, setEquippedItems] = useState<Record<string, string>>(getEquippedItems);
  const [confirmItem, setConfirmItem] = useState<ShopItem | null>(null);
  const [buyAnimation, setBuyAnimation] = useState<string | null>(null);

  const filteredItems = useMemo(() => {
    if (category === "all") return SHOP_ITEMS;
    return SHOP_ITEMS.filter(i => i.category === category);
  }, [category]);

  const handleBuy = (item: ShopItem) => {
    if (purchasedItems.includes(item.id)) {
      // Already owned — equip it
      const newEquipped = { ...equippedItems, [item.category]: item.id };
      setEquippedItems(newEquipped);
      saveEquippedItems(newEquipped);
      toast.success(`${item.icon} ${t("equipped")}`);
      return;
    }
    if (state.linceCoins < item.price) {
      toast.error(t("notEnough"));
      return;
    }
    setConfirmItem(item);
  };

  const confirmPurchase = () => {
    if (!confirmItem) return;
    // Deduct coins
    addCoins(-confirmItem.price);
    // Add to purchased
    const newPurchased = [...purchasedItems, confirmItem.id];
    setPurchasedItems(newPurchased);
    savePurchasedItems(newPurchased);
    // Auto-equip
    const newEquipped = { ...equippedItems, [confirmItem.category]: confirmItem.id };
    setEquippedItems(newEquipped);
    saveEquippedItems(newEquipped);
    // Animation
    setBuyAnimation(confirmItem.id);
    setTimeout(() => setBuyAnimation(null), 1500);
    toast.success(`${confirmItem.icon} ${t("purchased")}`);
    setConfirmItem(null);
  };

  return (
    <RequireLogin>
      <div className="min-h-screen bg-[#0A0A0A]">
        <GlobalNavBar />
        <div className="container pt-20 pb-24">
          <BackButton />

          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-3 mb-4">
              <ShoppingBag className="w-8 h-8 text-[#00E5FF]" />
              <h1 className="font-['Space_Grotesk'] font-bold text-3xl sm:text-4xl text-white">
                {t("title")}
              </h1>
            </div>
            <p className="text-[#B0B0B0] text-lg">{t("subtitle")}</p>

            {/* Balance */}
            <div className="inline-flex items-center gap-3 mt-6 px-6 py-3 bg-gradient-to-r from-amber-500/10 to-amber-600/5 border border-amber-500/30 rounded-2xl">
              <span className="text-2xl">🪙</span>
              <div className="text-left">
                <span className="text-amber-400/70 text-xs font-medium block">{t("balance")}</span>
                <span className="font-['Space_Grotesk'] font-bold text-2xl text-amber-400">
                  {state.linceCoins.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {["all", "avatar", "background", "shield", "badge", "boost"].map(cat => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  category === cat
                    ? "bg-[#00E5FF]/20 text-[#00E5FF] border border-[#00E5FF]/40"
                    : "bg-white/5 text-[#B0B0B0] border border-white/10 hover:bg-white/10"
                }`}
              >
                {cat !== "all" && CATEGORY_ICONS[cat]}
                {CATEGORY_LABELS[cat]?.[l] || CATEGORY_LABELS[cat]?.es}
              </button>
            ))}
          </div>

          {/* Items Grid */}
          {filteredItems.length === 0 ? (
            <div className="text-center py-16 text-[#B0B0B0]">{t("empty")}</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredItems.map(item => {
                const owned = purchasedItems.includes(item.id);
                const equipped = equippedItems[item.category] === item.id;
                const canAfford = state.linceCoins >= item.price;
                const r = RARITY_COLORS[item.rarity];
                const isAnimating = buyAnimation === item.id;

                return (
                  <div
                    key={item.id}
                    className={`relative p-5 rounded-2xl border transition-all duration-300 ${r.bg} ${r.border} ${r.glow} ${
                      isAnimating ? "scale-105 ring-2 ring-amber-400/50" : "hover:scale-[1.02]"
                    }`}
                  >
                    {/* Rarity badge */}
                    <div className="flex items-center justify-between mb-3">
                      <span className={`text-xs font-bold uppercase tracking-wider ${r.text}`}>
                        {RARITY_LABELS[item.rarity]?.[l] || RARITY_LABELS[item.rarity]?.es}
                      </span>
                      {owned && (
                        <span className="flex items-center gap-1 text-xs font-medium text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full">
                          <Check className="w-3 h-3" /> {t("owned")}
                        </span>
                      )}
                    </div>

                    {/* Icon + Preview */}
                    <div className="flex items-start gap-4 mb-4">
                      <div className="text-4xl flex-shrink-0">{item.icon}</div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-['Space_Grotesk'] font-bold text-lg text-white truncate">
                          {item.name[l] || item.name.es}
                        </h3>
                        <p className="text-[#B0B0B0] text-sm leading-relaxed mt-1">
                          {item.desc[l] || item.desc.es}
                        </p>
                      </div>
                    </div>

                    {/* Preview image for avatars */}
                    {item.category === "avatar" && item.preview && AVATAR_FRONTAL[item.preview] && (
                      <div className="mb-4 flex justify-center">
                        <img
                          src={AVATAR_FRONTAL[item.preview]}
                          alt={item.name[l] || item.name.es}
                          className="w-20 h-20 rounded-xl object-contain bg-white/5 p-1"
                        />
                      </div>
                    )}

                    {/* Price + Buy */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="text-lg">🪙</span>
                        <span className="font-['Space_Grotesk'] font-bold text-xl text-amber-400">
                          {item.price}
                        </span>
                      </div>
                      <button
                        onClick={() => handleBuy(item)}
                        disabled={!owned && !canAfford}
                        className={`px-5 py-2 rounded-xl text-sm font-bold transition-all ${
                          owned
                            ? equipped
                              ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 cursor-default"
                              : "bg-[#00E5FF]/20 text-[#00E5FF] border border-[#00E5FF]/30 hover:bg-[#00E5FF]/30"
                            : canAfford
                              ? "bg-amber-500 text-black hover:bg-amber-400 active:scale-95"
                              : "bg-gray-700/50 text-gray-500 cursor-not-allowed"
                        }`}
                      >
                        {owned ? (equipped ? `✓ ${t("equipped")}` : t("equip")) : canAfford ? t("buy") : (
                          <span className="flex items-center gap-1"><Lock className="w-3 h-3" /> {item.price}</span>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* How to earn more */}
          <div className="mt-12 p-6 bg-gradient-to-r from-cyan-500/5 to-purple-500/5 border border-white/10 rounded-2xl">
            <h3 className="font-['Space_Grotesk'] font-bold text-lg text-white mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#00E5FF]" />
              {t("earnMore")}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {["earnTip1", "earnTip2", "earnTip3", "earnTip4"].map((tip, i) => (
                <div key={tip} className="flex items-center gap-3 text-[#B0B0B0] text-sm">
                  <span className="w-6 h-6 rounded-full bg-[#00E5FF]/10 text-[#00E5FF] flex items-center justify-center text-xs font-bold flex-shrink-0">
                    {i + 1}
                  </span>
                  {t(tip)}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Confirm Modal */}
        {confirmItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={() => setConfirmItem(null)}>
            <div className="bg-[#1A1A2E] border border-white/10 rounded-2xl p-6 max-w-sm w-full" onClick={e => e.stopPropagation()}>
              <h3 className="font-['Space_Grotesk'] font-bold text-xl text-white mb-2">{t("confirmTitle")}</h3>
              <p className="text-[#B0B0B0] mb-4">
                {t("confirmMsg")} <strong className="text-white">{confirmItem.name[l] || confirmItem.name.es}</strong> {t("confirmPrice")}{" "}
                <strong className="text-amber-400">🪙 {confirmItem.price}</strong>?
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setConfirmItem(null)}
                  className="flex-1 px-4 py-2.5 bg-white/5 text-[#B0B0B0] rounded-xl hover:bg-white/10 transition-all font-medium"
                >
                  {t("confirmNo")}
                </button>
                <button
                  onClick={confirmPurchase}
                  className="flex-1 px-4 py-2.5 bg-amber-500 text-black rounded-xl hover:bg-amber-400 transition-all font-bold"
                >
                  {t("confirmYes")} 🪙 {confirmItem.price}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </RequireLogin>
  );
}

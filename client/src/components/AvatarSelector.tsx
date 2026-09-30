import { useState } from "react";
import { AVATAR_FRONTAL, AVATAR_MUSICALIN, getAvatarImage } from "@/lib/avatarConstants";
import { X } from "lucide-react";

// All avatar keys — just icons, no names
const ALL_AVATAR_KEYS = [
  // Familia Zaragoza (11)
  ...Object.keys(AVATAR_FRONTAL),
  // MUSICALIN (10)
  ...Object.keys(AVATAR_MUSICALIN),
];

interface AvatarSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  currentAvatarKey: string;
  onSelect: (avatarKey: string) => void;
  saving?: boolean;
}

export function AvatarSelector({ isOpen, onClose, currentAvatarKey, onSelect, saving }: AvatarSelectorProps) {
  const [selected, setSelected] = useState(currentAvatarKey);

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (selected && selected !== currentAvatarKey) {
      onSelect(selected);
    } else {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4" onClick={onClose}>
      <div
        className="relative w-full max-w-md bg-[oklch(0.12_0.015_240)] rounded-2xl border border-[oklch(0.82_0.15_195)]/20 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <h3 className="font-display font-bold text-lg text-white">
            Elige tu avatar
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Avatar Grid — only icons, no names */}
        <div className="p-4 max-h-[60vh] overflow-y-auto">
          <div className="grid grid-cols-5 gap-3">
            {ALL_AVATAR_KEYS.map((key) => {
              const imgUrl = getAvatarImage(key);
              if (!imgUrl) return null;
              const isSelected = selected === key;
              const isCurrent = currentAvatarKey === key;
              return (
                <button
                  key={key}
                  onClick={() => setSelected(key)}
                  className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all hover:scale-105 ${
                    isSelected
                      ? "border-[oklch(0.82_0.15_195)] shadow-[0_0_15px_oklch(0.82_0.15_195/0.4)] scale-105"
                      : isCurrent
                        ? "border-[oklch(0.72_0.12_75)]/60"
                        : "border-white/10 hover:border-white/30"
                  }`}
                >
                  <img
                    src={imgUrl}
                    alt=""
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  {isSelected && (
                    <div className="absolute inset-0 bg-[oklch(0.82_0.15_195)]/20 flex items-center justify-center">
                      <span className="text-2xl">✓</span>
                    </div>
                  )}
                  {isCurrent && !isSelected && (
                    <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-center py-0.5">
                      <span className="text-[8px] text-[oklch(0.72_0.12_75)] font-bold">ACTUAL</span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-white/20 text-gray-400 hover:text-white hover:bg-white/5 text-sm font-bold transition-all"
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirm}
            disabled={saving || selected === currentAvatarKey}
            className="flex-1 py-2.5 rounded-xl bg-[oklch(0.82_0.15_195)] text-black text-sm font-bold hover:brightness-110 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {saving ? "Guardando..." : "Confirmar"}
          </button>
        </div>
      </div>
    </div>
  );
}

import { useState, useEffect } from "react";
import { APP_VERSION, CHANGELOG } from "@/lib/gameConstants";

interface UpdateNotificationProps {
  lang: string;
}

const LAST_SEEN_VERSION_KEY = "lince-last-seen-version";

export function UpdateNotification({ lang }: UpdateNotificationProps) {
  const [visible, setVisible] = useState(false);
  const [showChangelog, setShowChangelog] = useState(false);
  const l = lang as "es" | "en" | "zh";

  useEffect(() => {
    const lastSeen = localStorage.getItem(LAST_SEEN_VERSION_KEY);
    if (lastSeen !== APP_VERSION) {
      setVisible(true);
    }
  }, []);

  const handleDismiss = () => {
    localStorage.setItem(LAST_SEEN_VERSION_KEY, APP_VERSION);
    setVisible(false);
    setShowChangelog(false);
  };

  const labels = {
    es: {
      title: "Nueva actualización disponible",
      current: "Versión actual",
      seeChanges: "Ver cambios",
      hideChanges: "Ocultar cambios",
      dismiss: "Entendido",
      updated: "¡Ya estás actualizado!",
    },
    en: {
      title: "New update available",
      current: "Current version",
      seeChanges: "See changes",
      hideChanges: "Hide changes",
      dismiss: "Got it",
      updated: "You're up to date!",
    },
    zh: {
      title: "新更新可用",
      current: "当前版本",
      seeChanges: "查看更改",
      hideChanges: "隐藏更改",
      dismiss: "知道了",
      updated: "你已经是最新版本！",
    },
  };
  const t = labels[l] || labels.es;

  if (!visible) return null;

  const latestEntry = CHANGELOG[0];

  return (
    <div className="fixed inset-0 z-[9998] flex items-start justify-center pt-20 px-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={handleDismiss} />

      {/* Notification card */}
      <div className="relative z-10 w-full max-w-md rounded-2xl overflow-hidden border border-[oklch(0.82_0.15_195)]/30 bg-[oklch(0.12_0.01_240)] shadow-[0_0_40px_oklch(0.82_0.15_195/0.15)]">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-[oklch(0.82_0.15_195)]/10 to-[oklch(0.72_0.12_75)]/10 border-b border-[oklch(0.82_0.15_195)]/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[oklch(0.82_0.15_195)]/20 flex items-center justify-center text-xl">
              🔄
            </div>
            <div>
              <h3 className="font-black text-white">{t.title}</h3>
              <p className="text-xs text-gray-400">{t.current}: <span className="text-[oklch(0.82_0.15_195)] font-bold">v{APP_VERSION}</span></p>
            </div>
          </div>
        </div>

        {/* Latest update title */}
        {latestEntry && (
          <div className="px-5 pt-4">
            <p className="text-sm font-bold text-[oklch(0.72_0.12_75)]">
              v{latestEntry.version} — {latestEntry.title[l] || latestEntry.title.es}
            </p>
          </div>
        )}

        {/* Changes toggle */}
        <div className="px-5 pt-3">
          <button
            onClick={() => setShowChangelog(!showChangelog)}
            className="text-xs text-[oklch(0.82_0.15_195)] hover:underline font-medium"
          >
            {showChangelog ? t.hideChanges : t.seeChanges}
          </button>
        </div>

        {/* Changelog */}
        {showChangelog && latestEntry && (
          <div className="px-5 pt-3 max-h-48 overflow-y-auto">
            <ul className="space-y-1.5">
              {(latestEntry.changes[l] || latestEntry.changes.es).map((change, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-gray-300">
                  <span className="text-[oklch(0.82_0.15_195)] mt-0.5 shrink-0">✦</span>
                  <span>{change}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Action button */}
        <div className="p-5">
          <button
            onClick={handleDismiss}
            className="w-full py-3 rounded-xl font-bold text-black bg-gradient-to-r from-[oklch(0.82_0.15_195)] to-[oklch(0.72_0.12_75)] hover:brightness-110 transition-all"
          >
            {t.dismiss}
          </button>
        </div>
      </div>
    </div>
  );
}

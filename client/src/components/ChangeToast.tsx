import { useState, useEffect, useCallback } from "react";

interface ToastData {
  message: string;
  icon: string;
}

let showToastFn: ((data: ToastData) => void) | null = null;

export function showChangeToast(message: string, icon: string = "✅") {
  if (showToastFn) showToastFn({ message, icon });
}

export function ChangeToastProvider() {
  const [toast, setToast] = useState<ToastData | null>(null);
  const [visible, setVisible] = useState(false);

  const show = useCallback((data: ToastData) => {
    setToast(data);
    setVisible(true);
    setTimeout(() => setVisible(false), 2500);
    setTimeout(() => setToast(null), 3000);
  }, []);

  useEffect(() => {
    showToastFn = show;
    return () => { showToastFn = null; };
  }, [show]);

  if (!toast) return null;

  return (
    <div
      className={`fixed top-20 left-1/2 -translate-x-1/2 z-[99999] transition-all duration-300 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
      }`}
    >
      <div className="flex items-center gap-2.5 px-5 py-3 bg-[#0c0c14]/95 backdrop-blur-md border border-[#00E5FF]/30 rounded-xl shadow-[0_0_20px_rgba(0,229,255,0.15)]">
        <span className="text-xl">{toast.icon}</span>
        <span className="text-white text-sm font-medium font-['Space_Grotesk']">{toast.message}</span>
      </div>
    </div>
  );
}

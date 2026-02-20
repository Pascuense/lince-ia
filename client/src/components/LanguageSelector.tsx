import { useLanguage } from "@/contexts/LanguageContext";
import { Globe } from "lucide-react";

export default function LanguageSelector() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center gap-2">
      <Globe className="h-4 w-4 text-[#7C8A9D]" />
      <button
        onClick={() => setLanguage("es")}
        className={`text-sm font-medium px-2 py-1 transition-colors ${
          language === "es"
            ? "text-[#FFB200] bg-[#00294A]"
            : "text-[#7C8A9D] hover:text-[#00294A]"
        }`}
      >
        ES
      </button>
      <span className="text-[#7C8A9D]">|</span>
      <button
        onClick={() => setLanguage("en")}
        className={`text-sm font-medium px-2 py-1 transition-colors ${
          language === "en"
            ? "text-[#FFB200] bg-[#00294A]"
            : "text-[#7C8A9D] hover:text-[#00294A]"
        }`}
      >
        EN
      </button>
    </div>
  );
}

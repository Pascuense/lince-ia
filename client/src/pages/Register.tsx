import { tl } from "@/contexts/PRDLanguageContext";
import { useState } from "react";
import { Link, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

// ─── Admin emails that can register with full form ───
const ADMIN_EMAILS = ["cristobalalisteg@gmail.com", "cristobal@acnb.es"];

// ─── Translations ───
const T: Record<string, Record<string, string>> = {
  es: {
    title: "Bienvenido a LINCE",
    subtitle: "Aprende IA Jugando",
    enterBtn: "ENTRAR A LINCE",
    entering: "Entrando...",
    ageCheck: "Confirmo que tengo 13 años o más",
    ageLegal: "Requerido por RGPD Art. 8 y LOPIVI",
    errorAge: "Debes tener 13 años o más para usar LINCE",
    acceptTerms: "Al entrar aceptas los",
    termsLink: "Términos de Uso",
    and: "y la",
    privacyLink: "Política de Privacidad",
    adminTitle: "Acceso Administrador",
    adminSubtitle: "Solo para cuentas autorizadas",
    nameLabel: "Tu nombre",
    namePlaceholder: "¿Cómo te llamas?",
    emailLabel: "Tu email",
    emailPlaceholder: "tu@email.com",
    registerBtn: "ENTRAR",
    registering: "Entrando...",
    loginLink: "Iniciar sesión",
    alreadyAccount: "¿Ya tienes cuenta?",
    errorEmail: "Escribe un email válido",
    errorName: "Escribe tu nombre",
    passwordLabel: "Contraseña",
    passwordPlaceholder: "Mínimo 8 caracteres",
    confirmLabel: "Repite la contraseña",
    errorPassword: "La contraseña debe tener al menos 8 caracteres",
    errorConfirm: "Las contraseñas no coinciden",
    adminAccess: "Acceso admin",
    explore: "Explora, aprende y diviértete con IA",
  },
  en: {
    title: "Welcome to LINCE",
    subtitle: "Learn AI by Playing",
    enterBtn: "ENTER LINCE",
    entering: "Entering...",
    ageCheck: "I confirm I am 13 years old or older",
    ageLegal: "Required by GDPR Art. 8 and LOPIVI",
    errorAge: "You must be 13 or older to use LINCE",
    acceptTerms: "By entering you accept the",
    termsLink: "Terms of Use",
    and: "and the",
    privacyLink: "Privacy Policy",
    adminTitle: "Admin Access",
    adminSubtitle: "Authorized accounts only",
    nameLabel: "Your name",
    namePlaceholder: "What's your name?",
    emailLabel: "Your email",
    emailPlaceholder: "your@email.com",
    registerBtn: "ENTER",
    registering: "Entering...",
    loginLink: "Log in",
    alreadyAccount: "Already have an account?",
    errorEmail: "Enter a valid email",
    errorName: "Enter your name",
    passwordLabel: "Password",
    passwordPlaceholder: "At least 8 characters",
    confirmLabel: "Repeat the password",
    errorPassword: "Password must be at least 8 characters",
    errorConfirm: "Passwords do not match",
    adminAccess: "Admin access",
    explore: "Explore, learn and have fun with AI",
  },
  zh: {
    title: "欢迎来到LINCE",
    subtitle: "玩着学AI",
    enterBtn: "进入LINCE",
    entering: "正在进入...",
    ageCheck: "我确认已满13岁",
    ageLegal: "根据GDPR第8条和LOPIVI要求",
    errorAge: "您必须年满13岁才能使用LINCE",
    acceptTerms: "进入即表示你接受",
    termsLink: "使用条款",
    and: "和",
    privacyLink: "隐私政策",
    adminTitle: "管理员访问",
    adminSubtitle: "仅限授权账户",
    nameLabel: "你的名字",
    namePlaceholder: "你叫什么？",
    emailLabel: "你的邮箱",
    emailPlaceholder: "your@email.com",
    registerBtn: "进入",
    registering: "正在进入...",
    loginLink: "登录",
    alreadyAccount: "已有账户？",
    errorEmail: "请输入有效邮箱",
    errorName: "请输入你的名字",
    passwordLabel: "密码",
    passwordPlaceholder: "至少8个字符",
    confirmLabel: "再次输入密码",
    errorPassword: "密码至少需要8个字符",
    errorConfirm: "两次输入的密码不一致",
    adminAccess: "管理员访问",
    explore: "探索、学习并享受AI的乐趣",
  },
};

const LINCE_LOGO = "/assets/jtEEtbRUpTtEBKGn.png";

export default function Register() {
  const [, navigate] = useLocation();
  const [lang, setLang] = useState<"es" | "en" | "zh">("es");
  const t = T[lang] || T.es;

  // State
  const [ageConfirmed, setAgeConfirmed] = useState(false);
  const [ageError, setAgeError] = useState(false);
  const [entering, setEntering] = useState(false);
  const [showAdminForm, setShowAdminForm] = useState(false);

  // Admin form state
  const [realName, setRealName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const registerMutation = trpc.gamePlayer.register.useMutation({
    onSuccess: (data) => {
      localStorage.setItem("lince-user", JSON.stringify({
        id: data.id, email: data.email, username: data.username,
        realName: data.realName, avatarKey: data.avatarKey, language: data.language,
        linceCoins: data.linceCoins, xp: data.xp, currentLevel: data.currentLevel,
      }));
      if (data.gameToken) localStorage.setItem("lince-game-token", data.gameToken);
      if (data.needsOnboarding) localStorage.setItem("lince-needs-onboarding", "true");
      window.dispatchEvent(new Event("lince-login"));
      toast.success(tl(lang, { es: `¡Bienvenido, ${data.realName}!`, en: `Welcome, ${data.realName}!`, zh: `欢迎，${data.realName}！`, 'pt-BR': `¡Bienvenido, ${data.realName}!`, 'pt-PT': `¡Bienvenido, ${data.realName}!` }));
      localStorage.setItem("lince-show-welcome", JSON.stringify({ name: data.realName, lang }));
      // Redirect new users to the onboarding welcome screen
      const bienvenidaCompleted = localStorage.getItem("lince-bienvenida-completed");
      navigate(bienvenidaCompleted ? "/home" : "/bienvenida");
    },
    onError: (error) => {
      if (error.message.includes("email")) setErrors(prev => ({ ...prev, email: error.message }));
      else setErrors(prev => ({ ...prev, general: error.message }));
      toast.error(error.message);
    },
  });

  // ─── Direct entry for regular users (no form, just age check) ───
  const handleDirectEntry = () => {
    if (!ageConfirmed) {
      setAgeError(true);
      return;
    }
    setEntering(true);
    // Navigate to onboarding if first time, otherwise home
    const bienvenidaCompleted = localStorage.getItem("lince-bienvenida-completed");
    navigate(bienvenidaCompleted ? "/home" : "/bienvenida");
  };

  // ─── Admin registration with full form ───
  const handleAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    if (!realName.trim() || realName.trim().length < 2) newErrors.realName = t.errorName;
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = t.errorEmail;
    if (password.length < 8) newErrors.password = t.errorPassword;
    else if (password !== confirmPassword) newErrors.confirmPassword = t.errorConfirm;
    if (!ageConfirmed) newErrors.age = t.errorAge;
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    // Check if email is admin
    if (!ADMIN_EMAILS.includes(email.toLowerCase().trim())) {
      setErrors({ email: tl(lang, { es: "Este email no tiene acceso de administrador", en: "This email is not authorized for admin access", zh: "此邮箱无管理员权限", 'pt-BR': "Este email no tiene acceso de administrador", 'pt-PT': "Este email no tiene acceso de administrador" }) });
      return;
    }

    registerMutation.mutate({
      email: email.toLowerCase().trim(),
      realName: realName.trim(),
      password,
      language: lang,
    });
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white flex flex-col">
      {/* Header */}
      <header className="border-b border-[#00E5FF]/10 bg-[#0A0A0A]/95 backdrop-blur-md sticky top-0 z-50">
        <div className="container px-4 py-3 flex items-center justify-between">
          <Link href="/" className="font-display font-bold text-lg">
            <span className="text-[#00E5FF]">LINCE</span>
          </Link>
          <div className="flex gap-1">
            {(["es", "en", "zh"] as const).map((l) => (
              <button key={l} onClick={() => setLang(l)} className={`px-2 py-1 text-xs rounded-md transition-all ${lang === l ? "bg-[#00E5FF]/20 text-[#00E5FF]" : "text-gray-500 hover:text-white"}`}>
                {l === "es" ? "ES" : l === "en" ? "EN" : "中"}
              </button>
            ))}
          </div>
        </div>
      </header>

      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="max-w-md w-full">
          {/* Logo + Title */}
          <div className="text-center mb-8">
            <div className="w-24 h-24 mx-auto rounded-full overflow-hidden border-2 border-[#00E5FF]/40 shadow-[0_0_40px_rgba(0,229,255,0.25)] mb-5">
              <img src={LINCE_LOGO} alt="LINCE" className="w-full h-full object-cover" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-black mb-2">
              {showAdminForm ? t.adminTitle : t.title}
            </h1>
            <p className="text-gray-400 text-base">
              {showAdminForm ? t.adminSubtitle : t.subtitle}
            </p>
          </div>

          {!showAdminForm ? (
            /* ═══════════════════════════════════════════════════
               DEFAULT VIEW: Simple entry — just confirm age and enter
               ═══════════════════════════════════════════════════ */
            <div className="space-y-5">
              {/* Age confirmation */}
              <div className={`p-5 rounded-xl border transition-colors ${ageConfirmed ? "bg-[#00E5FF]/5 border-[#00E5FF]/30" : ageError ? "bg-red-500/5 border-red-500/30" : "bg-white/[0.02] border-white/10"}`}>
                <label className="flex items-start gap-3 cursor-pointer" htmlFor="age-check">
                  <input
                    id="age-check"
                    type="checkbox"
                    checked={ageConfirmed}
                    onChange={(e) => { setAgeConfirmed(e.target.checked); setAgeError(false); }}
                    className="mt-1 w-5 h-5 rounded border-2 border-white/20 bg-transparent accent-[#00E5FF] flex-shrink-0"
                  />
                  <div>
                    <span className="text-white font-bold text-sm">{t.ageCheck}</span>
                    <p className="text-gray-500 text-[11px] mt-0.5">{t.ageLegal}</p>
                  </div>
                </label>
                {ageError && <p className="text-red-400 text-xs mt-2">{t.errorAge}</p>}
              </div>

              {/* Terms */}
              <p className="text-gray-500 text-[10px] text-center leading-relaxed">
                {t.acceptTerms}{" "}
                <a href="/aviso-legal" target="_blank" className="text-[#00E5FF] underline">{t.termsLink}</a>{" "}
                {t.and}{" "}
                <a href="/aviso-legal" target="_blank" className="text-[#00E5FF] underline">{t.privacyLink}</a>
                {" · RGPD (UE 2016/679) · ACNB IA SL"}
              </p>

              {/* BIG ENTER BUTTON */}
              <button
                onClick={handleDirectEntry}
                disabled={entering}
                className="w-full bg-[#00E5FF] text-black font-black py-5 rounded-xl text-xl hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_30px_rgba(0,229,255,0.3)] hover:shadow-[0_0_50px_rgba(0,229,255,0.5)]"
              >
                {entering ? t.entering : t.enterBtn}
              </button>

              <p className="text-center text-gray-500 text-sm">{t.explore}</p>

              {/* Small admin access link at bottom */}
              <div className="pt-4 border-t border-white/5 flex items-center justify-center gap-4">
                <button
                  onClick={() => setShowAdminForm(true)}
                  className="text-gray-600 text-xs hover:text-gray-400 transition-colors"
                >
                  {t.adminAccess} →
                </button>
                <Link href="/login" className="text-gray-600 text-xs hover:text-gray-400 transition-colors">
                  {t.loginLink}
                </Link>
              </div>
            </div>
          ) : (
            /* ═══════════════════════════════════════════════════
               ADMIN FORM: Full registration for authorized emails only
               ═══════════════════════════════════════════════════ */
            <div>
              {errors.general && (
                <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl">
                  <p className="text-red-400 text-sm">{errors.general}</p>
                </div>
              )}

              <form onSubmit={handleAdminSubmit} className="space-y-5" noValidate>
                {/* Name */}
                <div>
                  <label htmlFor="realName" className="block text-sm font-bold text-gray-200 mb-1.5">{t.nameLabel}</label>
                  <input
                    id="realName"
                    type="text"
                    value={realName}
                    onChange={(e) => { setRealName(e.target.value); setErrors(prev => ({ ...prev, realName: "" })); }}
                    placeholder={t.namePlaceholder}
                    autoComplete="name"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-white text-lg placeholder-gray-500 focus:border-[#00E5FF] focus:ring-1 focus:ring-[#00E5FF] outline-none transition-colors"
                  />
                  {errors.realName && <p className="text-red-400 text-xs mt-1">{errors.realName}</p>}
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-bold text-gray-200 mb-1.5">{t.emailLabel}</label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setErrors(prev => ({ ...prev, email: "" })); }}
                    placeholder={t.emailPlaceholder}
                    autoComplete="email"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-white text-lg placeholder-gray-500 focus:border-[#00E5FF] focus:ring-1 focus:ring-[#00E5FF] outline-none transition-colors"
                  />
                  {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-bold text-gray-200 mb-1.5">{t.passwordLabel}</label>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setErrors(prev => ({ ...prev, password: "" })); }}
                    placeholder={t.passwordPlaceholder}
                    autoComplete="new-password"
                    minLength={8}
                    maxLength={128}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-white text-lg placeholder-gray-500 focus:border-[#00E5FF] focus:ring-1 focus:ring-[#00E5FF] outline-none transition-colors"
                  />
                  {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-bold text-gray-200 mb-1.5">{t.confirmLabel}</label>
                  <input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => { setConfirmPassword(e.target.value); setErrors(prev => ({ ...prev, confirmPassword: "" })); }}
                    autoComplete="new-password"
                    maxLength={128}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-white text-lg placeholder-gray-500 focus:border-[#00E5FF] focus:ring-1 focus:ring-[#00E5FF] outline-none transition-colors"
                  />
                  {errors.confirmPassword && <p className="text-red-400 text-xs mt-1">{errors.confirmPassword}</p>}
                </div>

                {/* Age confirmation */}
                <div className={`p-4 rounded-xl border transition-colors ${ageConfirmed ? "bg-[#00E5FF]/5 border-[#00E5FF]/30" : errors.age ? "bg-red-500/5 border-red-500/30" : "bg-white/[0.02] border-white/10"}`}>
                  <label className="flex items-start gap-3 cursor-pointer" htmlFor="admin-age-check">
                    <input
                      id="admin-age-check"
                      type="checkbox"
                      checked={ageConfirmed}
                      onChange={(e) => { setAgeConfirmed(e.target.checked); setErrors(prev => ({ ...prev, age: "" })); }}
                      className="mt-1 w-5 h-5 rounded border-2 border-white/20 bg-transparent accent-[#00E5FF] flex-shrink-0"
                    />
                    <div>
                      <span className="text-white font-bold text-sm">{t.ageCheck}</span>
                      <p className="text-gray-500 text-[11px] mt-0.5">{t.ageLegal}</p>
                    </div>
                  </label>
                  {errors.age && <p className="text-red-400 text-xs mt-2">{errors.age}</p>}
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={registerMutation.isPending}
                  className="w-full bg-[#00E5FF] text-black font-black py-4 rounded-xl text-xl hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(0,229,255,0.3)]"
                >
                  {registerMutation.isPending ? t.registering : t.registerBtn}
                </button>

                {/* Back + Login */}
                <div className="flex items-center justify-center gap-4">
                  <button
                    type="button"
                    onClick={() => setShowAdminForm(false)}
                    className="text-gray-400 text-sm hover:text-white transition-colors"
                  >
                    ← {tl(lang, { es: "Volver", en: "Back", zh: "返回", 'pt-BR': "Volver", 'pt-PT': "Volver" })}
                  </button>
                  <Link href="/login" className="text-[#D4A843] text-sm font-medium hover:underline">
                    {t.loginLink}
                  </Link>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-[#00E5FF]/10 py-4 mt-auto">
        <p className="text-center text-gray-600 text-xs">LINCE &copy; 2024-2026 ACNB IA SL · info@acnb.es</p>
      </footer>
    </div>
  );
}

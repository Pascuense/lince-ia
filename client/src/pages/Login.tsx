import { tl } from "@/contexts/PRDLanguageContext";
import { useState } from "react";
import { Link, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { AVATAR_FRONTAL } from "@/lib/avatarConstants";
import { toast } from "sonner";

const T: Record<string, Record<string, string>> = {
  es: {
    title: "Iniciar Sesión",
    subtitle: "Bienvenido de vuelta a LINCE",
    emailLabel: "Email",
    emailPlaceholder: "tu@email.com",
    passwordLabel: "Contraseña",
    passwordPlaceholder: "Tu contraseña",
    loginBtn: "INICIAR SESIÓN",
    loggingIn: "Iniciando sesión...",
    noAccount: "¿No tienes cuenta?",
    registerLink: "Regístrate aquí",
    errorEmail: "Introduce un email válido",
    errorPassword: "Introduce tu contraseña",
    errorGeneral: "Email o contraseña incorrectos",
  },
  en: {
    title: "Log In",
    subtitle: "Welcome back to LINCE",
    emailLabel: "Email",
    emailPlaceholder: "your@email.com",
    passwordLabel: "Password",
    passwordPlaceholder: "Your password",
    loginBtn: "LOG IN",
    loggingIn: "Logging in...",
    noAccount: "Don't have an account?",
    registerLink: "Register here",
    errorEmail: "Enter a valid email",
    errorPassword: "Enter your password",
    errorGeneral: "Incorrect email or password",
  },
  zh: {
    title: "登录",
    subtitle: "欢迎回到LINCE",
    emailLabel: "邮箱",
    emailPlaceholder: "your@email.com",
    passwordLabel: "密码",
    passwordPlaceholder: "你的密码",
    loginBtn: "登录",
    loggingIn: "正在登录...",
    noAccount: "没有账户？",
    registerLink: "注册",
    errorEmail: "请输入有效邮箱",
    errorPassword: "请输入密码",
    errorGeneral: "邮箱或密码错误",
  },
};

export default function Login() {
  const [, navigate] = useLocation();
  const [lang, setLang] = useState<"es" | "en" | "zh">("es");
  const t = T[lang] || T.es;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const loginMutation = trpc.gamePlayer.login.useMutation({
    onSuccess: (data) => {
      localStorage.setItem("lince-user", JSON.stringify({
        id: data.id,
        email: data.email,
        username: data.username,
        realName: data.realName,
        avatarKey: data.avatarKey,
        language: data.language,
        linceCoins: data.linceCoins,
        xp: data.xp,
        currentLevel: data.currentLevel,
        totalPromptsWritten: data.totalPromptsWritten,
        streak: data.streak,
        lastPlayedDate: data.lastPlayedDate,
        levelsData: data.levelsData,
        dailyRewardsData: data.dailyRewardsData,
      }));
      if (data.gameToken) {
        localStorage.setItem("lince-game-token", data.gameToken);
      }
      window.dispatchEvent(new Event("lince-login"));
      toast.success(tl(lang, { es: `¡Bienvenido de vuelta, ${data.username}!`, en: `Welcome back, ${data.username}!`, zh: `欢迎回来，${data.username}！`, 'pt-BR': `¡Bienvenido de vuelta, ${data.username}!`, 'pt-PT': `¡Bienvenido de vuelta, ${data.username}!` }));
      // Redirect to onboarding if never completed, otherwise home
      const bienvenidaCompleted = localStorage.getItem("lince-bienvenida-completed");
      navigate(bienvenidaCompleted ? "/home" : "/bienvenida");
    },
    onError: (error) => {
      setErrors({ general: error.message || t.errorGeneral });
      toast.error(error.message || t.errorGeneral);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = t.errorEmail;
    }
    if (!password) {
      newErrors.password = t.errorPassword;
    }
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;
    loginMutation.mutate({ email, password });
  };

  return (
    <div className="min-h-screen bg-[oklch(0.10_0.01_240)] text-white flex flex-col">
      {/* Header */}
      <header className="border-b border-white/10 bg-[oklch(0.10_0.01_240)]/95 backdrop-blur-md sticky top-0 z-50">
        <div className="container px-4 py-3 flex items-center justify-between">
          <span className="font-display font-bold text-lg">
            <span className="text-[oklch(0.82_0.15_195)]">LINCE</span>
          </span>
          <div className="flex gap-1">
            {(["es", "en", "zh"] as const).map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={`px-2 py-1 text-xs rounded-md ${lang === l ? "bg-[oklch(0.82_0.15_195)]/20 text-[oklch(0.82_0.15_195)]" : "text-gray-500"}`}
              >
                {l === "es" ? "ES" : l === "en" ? "EN" : "中"}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Main */}
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="max-w-md w-full">
          {/* Avatar + Title */}
          <div className="text-center mb-8">
            <div className="flex justify-center gap-2 mb-4">
              <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-[oklch(0.82_0.15_195)]/30 opacity-60">
                <img src={AVATAR_FRONTAL.PEQUELIN} alt="" className="w-full h-full object-cover" />
              </div>
              <div className="w-18 h-18 rounded-full overflow-hidden border-2 border-[oklch(0.82_0.15_195)] shadow-[0_0_20px_oklch(0.82_0.15_195/0.3)]">
                <img src={AVATAR_FRONTAL.SABELIN} alt="" className="w-full h-full object-cover" />
              </div>
              <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-[oklch(0.82_0.15_195)]/30 opacity-60">
                <img src={AVATAR_FRONTAL.PEQUELINA} alt="" className="w-full h-full object-cover" />
              </div>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold mb-2 bg-gradient-to-r from-[oklch(0.82_0.15_195)] to-emerald-400 bg-clip-text text-transparent">
              {t.title}
            </h1>
            <p className="text-gray-400 text-sm">{t.subtitle}</p>
          </div>

          {/* Error */}
          {errors.general && (
            <div className="mb-5 bg-red-500/10 border border-red-500/30 rounded-xl p-3 text-center">
              <p className="text-red-400 text-sm">{errors.general}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            {/* Email */}
            <div>
              <label htmlFor="login-email" className="block text-sm font-medium text-gray-300 mb-1.5">
                {t.emailLabel}
              </label>
              <input
                id="login-email"
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setErrors({}); }}
                placeholder={t.emailPlaceholder}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-[oklch(0.82_0.15_195)] focus:ring-1 focus:ring-[oklch(0.82_0.15_195)] outline-none transition-colors"
              />
              {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="login-password" className="block text-sm font-medium text-gray-300 mb-1.5">
                {t.passwordLabel}
              </label>
              <div className="relative">
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setErrors({}); }}
                  placeholder={t.passwordPlaceholder}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-[oklch(0.82_0.15_195)] focus:ring-1 focus:ring-[oklch(0.82_0.15_195)] outline-none transition-colors pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white text-sm"
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
              {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loginMutation.isPending}
              className="w-full bg-gradient-to-r from-[oklch(0.82_0.15_195)] to-emerald-500 text-black font-black py-4 rounded-xl text-lg hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_oklch(0.82_0.15_195/0.3)]"
            >
              {loginMutation.isPending ? t.loggingIn : t.loginBtn}
            </button>

            {/* Register link */}
            <p className="text-center text-gray-400 text-sm">
              {t.noAccount}{" "}
              <Link href="/registro" className="text-[oklch(0.82_0.15_195)] font-medium hover:underline">
                {t.registerLink}
              </Link>
            </p>
          </form>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/5 py-4">
        <p className="text-center text-gray-600 text-xs">LINCE &copy; 2024-2026 ACNB IA SL</p>
      </footer>
    </div>
  );
}

import { useState, useEffect, useCallback } from "react";
import { trpc } from "@/lib/trpc";

const LINCE_LOGO = "/assets/jtEEtbRUpTtEBKGn.png";

const LEGAL_ACCEPTED_KEY = "lince-legal-accepted";
const LEGAL_VERSION = "2.0"; // Bumped: merged NDA + IP gate

type Lang = "es" | "en" | "zh" | "pt-BR" | "pt-PT";

const translations: Record<string, {
  confidential: string;
  langLabel: string;
  warning: string;
  title: string;
  subtitle: string;
  copyright: string;
  // NDA section
  ndaTitle: string;
  titular: string;
  titularValue: string;
  creador: string;
  creadorValue: string;
  clausula1Title: string;
  clausula1Text: string;
  clausula2Title: string;
  clausula2Text: string;
  clausula3Title: string;
  clausula3Text: string;
  clausula4Title: string;
  clausula4Text: string;
  clausula5Title: string;
  clausula5Text: string;
  clausula6Title: string;
  clausula6Text: string;
  // IP section
  ipTitle: string;
  ip1: string;
  ip2: string;
  ip3: string;
  ip4: string;
  ip5: string;
  // Terms
  termsTitle: string;
  terms1: string;
  terms2: string;
  terms3: string;
  terms4: string;
  // Actions
  acceptWarning: string;
  checkboxLabel: string;
  acceptBtn: string;
  rejectBtn: string;
  errorMsg: string;
  footer: string;
  footerSub: string;
  lawRef: string;
}> = {
  es: {
    confidential: "DOCUMENTO CONFIDENCIAL — PROPIEDAD DE ACNB IA SL",
    langLabel: "Idioma",
    warning: "CONTENIDO PROTEGIDO — ACCESO RESTRINGIDO",
    title: "ACUERDO DE CONFIDENCIALIDAD Y PROTECCIÓN DE PROPIEDAD INTELECTUAL",
    subtitle: "Antes de acceder a LINCE, debe leer y aceptar íntegramente los siguientes términos:",
    copyright: "© 2023-2026 ACNB IA SL. Todos los derechos reservados.",
    ndaTitle: "ACUERDO DE NO DIVULGACIÓN (NDA)",
    titular: "TITULAR:",
    titularValue: "ACNB IA SL, NIF B24838690, con domicilio social en Avda Buenos Aires 10, Esc. 3, Planta 3, Puerta D, 50180 Utebo (Zaragoza), España.",
    creador: "CREADOR:",
    creadorValue: "ACNB IA SL, empresa española 🇪🇸",
    clausula1Title: "CLÁUSULA 1 — OBJETO",
    clausula1Text: "El presente acuerdo tiene por objeto proteger la información confidencial contenida en este documento, incluyendo pero no limitado a: conceptos de producto, diseños de personajes, arquitectura técnica, modelos de negocio, estrategias de gamificación, roadmap de desarrollo y cualquier otro material relacionado con el proyecto LINCE®.",
    clausula2Title: "CLÁUSULA 2 — DEFINICIÓN DE INFORMACIÓN CONFIDENCIAL",
    clausula2Text: "Se considera información confidencial toda la información contenida en este sitio web, incluyendo: (a) el concepto y diseño de la plataforma LINCE®; (b) los personajes PAPALIN®, MAMALINA®, YAYALIN®, PEQUELIN®, PEQUELINA®, ATOLONDRALIN®, SABELIN® y toda la Familia LINCE®; (c) la estructura pedagógica y de contenidos; (d) la arquitectura técnica y modelo de datos; (e) los planes de monetización y roadmap; (f) cualquier material gráfico, textual o audiovisual.",
    clausula3Title: "CLÁUSULA 3 — OBLIGACIONES",
    clausula3Text: "Al acceder a este contenido, usted se compromete a: (a) NO reproducir, copiar, distribuir ni compartir ninguna parte de este documento; (b) NO utilizar la información para desarrollar productos competidores o similares; (c) NO divulgar el contenido a terceros sin autorización expresa y por escrito de ACNB IA SL; (d) NO realizar capturas de pantalla, grabaciones o cualquier forma de registro del contenido; (e) Mantener la más estricta confidencialidad sobre todo lo visualizado.",
    clausula4Title: "CLÁUSULA 4 — PROPIEDAD INTELECTUAL",
    clausula4Text: "Todos los derechos de propiedad intelectual e industrial sobre LINCE® y sus contenidos pertenecen exclusivamente a ACNB IA SL. El acceso a este documento NO otorga ningún derecho, licencia ni autorización de uso sobre la propiedad intelectual contenida.",
    clausula5Title: "CLÁUSULA 5 — LEGISLACIÓN APLICABLE",
    clausula5Text: "Este acuerdo se rige por la legislación española, incluyendo: Ley de Propiedad Intelectual (RDL 1/1996), Ley de Marcas (Ley 17/2001), Ley de Competencia Desleal (Ley 3/1991), Código Penal (artículos 270-272 sobre delitos contra la propiedad intelectual), RGPD, Convenio de Berna y Tratado OMPI.",
    clausula6Title: "CLÁUSULA 6 — CONSECUENCIAS DEL INCUMPLIMIENTO",
    clausula6Text: "El incumplimiento de cualquiera de las obligaciones establecidas en este acuerdo podrá dar lugar a acciones legales civiles y penales, incluyendo reclamaciones por daños y perjuicios, medidas cautelares y denuncia penal por revelación de secretos empresariales.",
    ipTitle: "PROTECCIÓN DE PROPIEDAD INTELECTUAL",
    ip1: "Todo el contenido de esta plataforma, incluyendo pero no limitado a: código fuente, algoritmos, diseños de personajes (Familia LINCE), interfaces de usuario, metodología pedagógica, sistema de gamificación, sistema de karma, contenido educativo, textos, imágenes, vídeos, audio y cualquier otro elemento, es propiedad exclusiva de ACNB IA SL.",
    ip2: "Los personajes de la Familia LINCE (Duolingenio, Yayolín, Duolincito, Lincepreneur, Mamálince, Papálince, Tiolince, Tíalince, Abuelince, Primolince) son creaciones originales protegidas por derechos de autor.",
    ip3: "La marca LINCE®, su logotipo y todos los signos distintivos asociados son propiedad de ACNB IA SL.",
    ip4: "Queda estrictamente prohibida la reproducción, distribución, comunicación pública, transformación, descompilación, ingeniería inversa, extracción de datos (scraping), o cualquier otra forma de explotación, total o parcial, de los contenidos de esta plataforma sin autorización previa y por escrito de ACNB IA SL.",
    ip5: "El uso no autorizado de cualquier elemento de esta plataforma constituye una infracción de los derechos de propiedad intelectual e industrial de ACNB IA SL y será perseguido conforme a la legislación vigente.",
    termsTitle: "Al acceder a esta plataforma, usted acepta que:",
    terms1: "No copiará, reproducirá ni distribuirá ningún contenido de la plataforma.",
    terms2: "No realizará ingeniería inversa, descompilación ni extracción de datos.",
    terms3: "No utilizará el contenido con fines comerciales sin autorización expresa.",
    terms4: "Cualquier infracción será perseguida conforme a la legislación española y europea vigente.",
    acceptWarning: "AL HACER CLIC EN \"ACEPTO\", USTED DECLARA HABER LEÍDO, COMPRENDIDO Y ACEPTADO ÍNTEGRAMENTE LOS TÉRMINOS DE ESTE ACUERDO DE CONFIDENCIALIDAD Y PROTECCIÓN DE PROPIEDAD INTELECTUAL.",
    checkboxLabel: "He leído y acepto íntegramente el Acuerdo de Confidencialidad (NDA) y los avisos de Propiedad Intelectual. Entiendo que este contenido es propiedad exclusiva de ACNB IA SL, y me comprometo a no divulgar, copiar ni utilizar la información contenida sin autorización expresa.",
    acceptBtn: "ACEPTO — ACCEDER A LINCE",
    rejectBtn: "NO ACEPTO — SALIR",
    errorMsg: "⚠ Debe aceptar los términos para continuar.",
    footer: "© 2023-2026 ACNB IA SL. Todos los derechos reservados.",
    footerSub: "Este acceso queda registrado. Cualquier uso no autorizado será perseguido legalmente.",
    lawRef: "Protegido por: RDL 1/1996 (Ley de Propiedad Intelectual) · Ley 1/2019 (Secretos Empresariales) · Ley 17/2001 (Marcas) · Directiva 2004/48/CE · RGPD (UE) 2016/679 · Convenio de Berna · Tratado OMPI",
  },
  en: {
    confidential: "CONFIDENTIAL DOCUMENT — PROPERTY OF ACNB IA SL",
    langLabel: "Language",
    warning: "PROTECTED CONTENT — RESTRICTED ACCESS",
    title: "CONFIDENTIALITY AGREEMENT AND INTELLECTUAL PROPERTY PROTECTION",
    subtitle: "Before accessing LINCE, you must read and fully accept the following terms:",
    copyright: "© 2023-2026 ACNB IA SL. All rights reserved.",
    ndaTitle: "NON-DISCLOSURE AGREEMENT (NDA)",
    titular: "OWNER:",
    titularValue: "ACNB IA SL, Tax ID (NIF) B24838690, registered at Avda Buenos Aires 10, Esc. 3, Planta 3, Puerta D, 50180 Utebo (Zaragoza), Spain.",
    creador: "CREATOR:",
    creadorValue: "ACNB IA SL, Spanish company 🇪🇸",
    clausula1Title: "CLAUSE 1 — PURPOSE",
    clausula1Text: "This agreement aims to protect the confidential information contained in this document, including but not limited to: product concepts, character designs, technical architecture, business models, gamification strategies, development roadmap and any other material related to the LINCE® project.",
    clausula2Title: "CLAUSE 2 — DEFINITION OF CONFIDENTIAL INFORMATION",
    clausula2Text: "All information contained on this website is considered confidential, including: (a) the concept and design of the LINCE® platform; (b) the characters PAPALIN®, MAMALINA®, YAYALIN®, PEQUELIN®, PEQUELINA®, ATOLONDRALIN®, SABELIN® and the entire LINCE® Family; (c) the pedagogical and content structure; (d) the technical architecture and data model; (e) monetization plans and roadmap; (f) any graphic, textual or audiovisual material.",
    clausula3Title: "CLAUSE 3 — OBLIGATIONS",
    clausula3Text: "By accessing this content, you commit to: (a) NOT reproduce, copy, distribute or share any part of this document; (b) NOT use the information to develop competing or similar products; (c) NOT disclose the content to third parties without express written authorization from ACNB IA SL; (d) NOT take screenshots, recordings or any form of content capture; (e) Maintain the strictest confidentiality about everything viewed.",
    clausula4Title: "CLAUSE 4 — INTELLECTUAL PROPERTY",
    clausula4Text: "All intellectual and industrial property rights over LINCE® and its contents belong exclusively to ACNB IA SL. Access to this document does NOT grant any right, license or authorization to use the intellectual property contained herein.",
    clausula5Title: "CLAUSE 5 — APPLICABLE LAW",
    clausula5Text: "This agreement is governed by Spanish law, including: Intellectual Property Law (RDL 1/1996), Trademark Law (Law 17/2001), Unfair Competition Law (Law 3/1991), Criminal Code (articles 270-272 on crimes against intellectual property), GDPR, Berne Convention and WIPO Treaty.",
    clausula6Title: "CLAUSE 6 — CONSEQUENCES OF BREACH",
    clausula6Text: "Breach of any of the obligations established in this agreement may give rise to civil and criminal legal actions, including claims for damages, injunctive measures, and criminal prosecution for disclosure of trade secrets.",
    ipTitle: "INTELLECTUAL PROPERTY PROTECTION",
    ip1: "All content on this platform, including but not limited to: source code, algorithms, character designs (LINCE Family), user interfaces, pedagogical methodology, gamification system, karma system, educational content, texts, images, videos, audio and any other element, is the exclusive property of ACNB IA SL.",
    ip2: "The characters of the LINCE Family (Duolingenio, Yayolín, Duolincito, Lincepreneur, Mamálince, Papálince, Tiolince, Tíalince, Abuelince, Primolince) are original creations protected by copyright.",
    ip3: "The LINCE® brand, its logo and all associated distinctive signs are the property of ACNB IA SL.",
    ip4: "The reproduction, distribution, public communication, transformation, decompilation, reverse engineering, data extraction (scraping), or any other form of exploitation, in whole or in part, of the contents of this platform is strictly prohibited without prior written authorization from ACNB IA SL.",
    ip5: "Unauthorized use of any element of this platform constitutes an infringement of the intellectual and industrial property rights of ACNB IA SL and will be prosecuted in accordance with applicable law.",
    termsTitle: "By accessing this platform, you agree that:",
    terms1: "You will not copy, reproduce or distribute any content from the platform.",
    terms2: "You will not reverse engineer, decompile or extract data.",
    terms3: "You will not use the content for commercial purposes without express authorization.",
    terms4: "Any infringement will be prosecuted under applicable Spanish and European law.",
    acceptWarning: "BY CLICKING \"I ACCEPT\", YOU DECLARE THAT YOU HAVE READ, UNDERSTOOD AND FULLY ACCEPTED THE TERMS OF THIS CONFIDENTIALITY AGREEMENT AND INTELLECTUAL PROPERTY PROTECTION.",
    checkboxLabel: "I have read and fully accept the Confidentiality Agreement (NDA) and Intellectual Property notices. I understand that this content is the exclusive property of ACNB IA SL, and I commit to not disclose, copy or use the information contained without express authorization.",
    acceptBtn: "I ACCEPT — ACCESS LINCE",
    rejectBtn: "I DO NOT ACCEPT — EXIT",
    errorMsg: "⚠ You must accept the terms to continue.",
    footer: "© 2023-2026 ACNB IA SL. All rights reserved.",
    footerSub: "This access is recorded. Any unauthorized use will be legally prosecuted.",
    lawRef: "Protected by: RDL 1/1996 (IP Law) · Law 1/2019 (Trade Secrets) · Law 17/2001 (Trademarks) · Directive 2004/48/EC · GDPR (EU) 2016/679 · Berne Convention · WIPO Treaty",
  },
  zh: {
    confidential: "机密文件 — ACNB IA SL 财产",
    langLabel: "语言",
    warning: "受保护内容 — 限制访问",
    title: "保密协议和知识产权保护",
    subtitle: "在访问 LINCE 之前，您必须阅读并完全接受以下条款：",
    copyright: "© 2023-2026 ACNB IA SL. 保留所有权利。",
    ndaTitle: "保密协议 (NDA)",
    titular: "所有者：",
    titularValue: "ACNB IA SL，税号 (NIF) B24838690，注册地址：Avda Buenos Aires 10, Esc. 3, Planta 3, Puerta D, 50180 Utebo (Zaragoza)，西班牙。",
    creador: "创作者：",
    creadorValue: "ACNB IA SL，西班牙公司 🇪🇸",
    clausula1Title: "第一条 — 目的",
    clausula1Text: "本协议旨在保护本文件中包含的机密信息，包括但不限于：产品概念、角色设计、技术架构、商业模式、游戏化策略、开发路线图以及与 LINCE® 项目相关的任何其他材料。",
    clausula2Title: "第二条 — 机密信息定义",
    clausula2Text: "本网站包含的所有信息均被视为机密信息，包括：(a) LINCE® 平台的概念和设计；(b) PAPALIN®、MAMALINA®、YAYALIN®、PEQUELIN®、PEQUELINA®、ATOLONDRALIN®、SABELIN® 角色及整个 LINCE® 家族；(c) 教学和内容结构；(d) 技术架构和数据模型；(e) 货币化计划和路线图；(f) 任何图形、文本或视听材料。",
    clausula3Title: "第三条 — 义务",
    clausula3Text: "访问此内容即表示您承诺：(a) 不复制、拷贝、分发或分享本文件的任何部分；(b) 不使用该信息开发竞争或类似产品；(c) 未经 ACNB IA SL 书面明确授权，不向第三方披露内容；(d) 不进行截图、录制或任何形式的内容捕获；(e) 对所有查看内容保持最严格的保密。",
    clausula4Title: "第四条 — 知识产权",
    clausula4Text: "LINCE® 及其内容的所有知识产权和工业产权专属于 ACNB IA SL。访问本文件不授予任何权利、许可或使用所含知识产权的授权。",
    clausula5Title: "第五条 — 适用法律",
    clausula5Text: "本协议受西班牙法律管辖，包括：知识产权法（RDL 1/1996）、商标法（17/2001法）、不正当竞争法（3/1991法）、刑法（第270-272条关于知识产权犯罪）、GDPR、伯尔尼公约和WIPO条约。",
    clausula6Title: "第六条 — 违约后果",
    clausula6Text: "违反本协议规定的任何义务可能导致民事和刑事法律诉讼，包括损害赔偿索赔、禁令措施和因泄露商业秘密的刑事起诉。",
    ipTitle: "知识产权保护",
    ip1: "本平台上的所有内容，包括但不限于：源代码、算法、角色设计（LINCE 家族）、用户界面、教学方法、游戏化系统、因果报应系统、教育内容、文本、图像、视频、音频和任何其他元素，均为 ACNB IA SL 的专有财产。",
    ip2: "LINCE 家族的角色（Duolingenio、Yayolín、Duolincito、Lincepreneur、Mamálince、Papálince、Tiolince、Tíalince、Abuelince、Primolince）是受版权保护的原创作品。",
    ip3: "LINCE® 品牌、其标志和所有相关标识均为 ACNB IA SL 的财产。",
    ip4: "严禁未经 ACNB IA SL 事先书面授权，以任何形式全部或部分复制、分发、公开传播、改编、反编译、逆向工程、数据提取（爬虫）或以其他方式利用本平台的内容。",
    ip5: "未经授权使用本平台的任何元素均构成对 ACNB IA SL 知识产权和工业产权的侵犯，将依据适用法律予以追究。",
    termsTitle: "访问本平台即表示您同意：",
    terms1: "您不会复制、再现或分发平台上的任何内容。",
    terms2: "您不会进行逆向工程、反编译或数据提取。",
    terms3: "未经明确授权，您不会将内容用于商业目的。",
    terms4: "任何侵权行为将依据西班牙和欧洲现行法律予以追究。",
    acceptWarning: "点击\"我接受\"即表示您声明已阅读、理解并完全接受本保密协议和知识产权保护条款。",
    checkboxLabel: "我已阅读并完全接受保密协议（NDA）和知识产权声明。我理解此内容是 ACNB IA SL 的专有财产，我承诺未经明确授权不会披露、复制或使用所含信息。",
    acceptBtn: "我接受 — 进入 LINCE",
    rejectBtn: "我不接受 — 退出",
    errorMsg: "⚠ 您必须接受条款才能继续。",
    footer: "© 2023-2026 ACNB IA SL. 版权所有。",
    footerSub: "此访问已被记录。任何未经授权的使用将被依法追究。",
    lawRef: "受以下法律保护：RDL 1/1996（知识产权法）· 1/2019法（商业秘密）· 17/2001法（商标）· 2004/48/EC指令 · GDPR (EU) 2016/679 · 伯尔尼公约 · WIPO条约",
  },
};

const FLAG_MAP: Record<string, string> = { es: "🇪🇸", en: "🇬🇧", zh: "🇨🇳" };
const LANG_LABELS: Record<string, string> = { es: "Español", en: "English", zh: "中文" };

export function LegalGate({ children }: { children: React.ReactNode }) {
  const [accepted, setAccepted] = useState<boolean | null>(null);
  const [checked, setChecked] = useState(false);
  const [showError, setShowError] = useState(false);
  const [lang, setLang] = useState<Lang>("es");
  const [animateIn, setAnimateIn] = useState(false);
  const [langOpen, setLangOpen] = useState(false);

  useEffect(() => {
    try {
      // If user is already logged in, skip NDA automatically
      const loggedUser = localStorage.getItem('lince-user');
      if (loggedUser) {
        try {
          const u = JSON.parse(loggedUser);
          if (u.username && u.id) {
            setAccepted(true);
            sessionStorage.setItem('lince-nda-accepted', 'true');
            return;
          }
        } catch {}
      }
      const stored = localStorage.getItem(LEGAL_ACCEPTED_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.version === LEGAL_VERSION && parsed.accepted) {
          setAccepted(true);
          // Also set sessionStorage for Home NDA compatibility
          sessionStorage.setItem('lince-nda-accepted', 'true');
          return;
        }
      }
      // Also check sessionStorage (from login/register flow)
      if (sessionStorage.getItem('lince-nda-accepted') === 'true') {
        setAccepted(true);
        return;
      }
    } catch {}
    setAccepted(false);
    setTimeout(() => setAnimateIn(true), 100);
  }, []);

  const logAcceptanceMutation = trpc.legal.logAcceptance.useMutation();

  // Generate a simple device fingerprint from browser signals
  const generateFingerprint = useCallback(() => {
    const signals = [
      navigator.userAgent,
      navigator.language,
      screen.width + "x" + screen.height,
      screen.colorDepth,
      navigator.platform,
      Intl.DateTimeFormat().resolvedOptions().timeZone,
      new Date().getTimezoneOffset(),
      navigator.hardwareConcurrency || "unknown",
      (navigator as any).deviceMemory || "unknown",
    ].join("|");
    // Simple hash
    let hash = 0;
    for (let i = 0; i < signals.length; i++) {
      const char = signals.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash |= 0;
    }
    return "fp_" + Math.abs(hash).toString(36) + "_" + signals.length;
  }, []);

  const handleAccept = () => {
    if (!checked) {
      setShowError(true);
      return;
    }

    // Save to localStorage
    localStorage.setItem(
      LEGAL_ACCEPTED_KEY,
      JSON.stringify({
        version: LEGAL_VERSION,
        accepted: true,
        timestamp: new Date().toISOString(),
        lang,
      })
    );
    sessionStorage.setItem('lince-nda-accepted', 'true');

    // Log acceptance to database (fire-and-forget, don't block the UI)
    try {
      const fingerprint = generateFingerprint();
      logAcceptanceMutation.mutate({
        termsVersion: LEGAL_VERSION,
        browserLanguage: navigator.language,
        screenResolution: screen.width + "x" + screen.height,
        platform: navigator.platform,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        fingerprint,
        selectedLanguage: lang,
        referrer: document.referrer || undefined,
      });
    } catch {
      // Don't block acceptance if logging fails
    }

    setAccepted(true);
  };

  const handleReject = () => {
    window.location.href = "https://www.acnb.es";
  };

  // Still loading
  if (accepted === null) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="w-12 h-12 border-2 border-[#00E5FF]/30 border-t-[#00E5FF] rounded-full animate-spin" />
      </div>
    );
  }

  // Already accepted
  if (accepted) return <>{children}</>;

  const t = translations[lang];

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center p-3 sm:p-4 relative overflow-hidden">
      {/* Background grid */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-full h-full" style={{
          backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 50px, rgba(0,229,255,0.03) 50px, rgba(0,229,255,0.03) 51px),
                           repeating-linear-gradient(90deg, transparent, transparent 50px, rgba(0,229,255,0.03) 50px, rgba(0,229,255,0.03) 51px)`
        }} />
      </div>
      
      {/* Scanning line */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute w-full h-[2px] bg-gradient-to-r from-transparent via-[#00E5FF]/20 to-transparent"
          style={{ animation: "scanLine 4s linear infinite" }} />
      </div>

      <div className={`relative max-w-2xl w-full my-4 sm:my-8 transition-all duration-700 ${animateIn ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
        {/* Confidential header bar */}
        <div className="bg-red-900/30 border border-red-500/40 rounded-t-xl px-4 py-2 flex items-center justify-between">
          <span className="text-red-400 text-[10px] sm:text-xs font-mono font-bold tracking-wider">{t.confidential}</span>
          {/* Language selector with flags */}
          <div className="relative">
            <button
              onClick={() => setLangOpen(!langOpen)}
              className="flex items-center gap-1.5 px-2 py-1 rounded border border-[#00E5FF]/30 bg-[#0A0A0A]/50 hover:bg-[#00E5FF]/10 transition-colors"
            >
              <span className="text-sm">{FLAG_MAP[lang]}</span>
              <span className="text-[#00E5FF] text-xs font-medium">{LANG_LABELS[lang]}</span>
              <svg className={`w-3 h-3 text-[#00E5FF]/60 transition-transform ${langOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {langOpen && (
              <div className="absolute right-0 top-full mt-1 bg-[#111] border border-[#00E5FF]/30 rounded-lg overflow-hidden z-50 shadow-xl">
                {(["es", "en", "zh"] as Lang[]).map((l) => (
                  <button
                    key={l}
                    onClick={() => { setLang(l); setLangOpen(false); }}
                    className={`flex items-center gap-2 px-4 py-2 w-full text-left hover:bg-[#00E5FF]/10 transition-colors ${lang === l ? "bg-[#00E5FF]/5 text-[#00E5FF]" : "text-[#B0B0B0]"}`}
                  >
                    <span className="text-sm">{FLAG_MAP[l]}</span>
                    <span className="text-xs font-medium">{LANG_LABELS[l]}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Main card */}
        <div className="bg-[#0D0D0D] border-x border-b border-[#00E5FF]/20 rounded-b-xl overflow-hidden">
          {/* Header with logo */}
          <div className="relative px-6 pt-6 pb-4 text-center border-b border-[#00E5FF]/10">
            <div className="flex justify-center mb-3">
              <div className="relative">
                <img
                  src={LINCE_LOGO}
                  alt="LINCE"
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-2 border-[#00E5FF]/40"
                  draggable={false}
                />
                <div className="absolute -top-1 -right-1 w-5 h-5 sm:w-6 sm:h-6 bg-[#D4A843] rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-black" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>
            <h1 className="font-display font-bold text-xl sm:text-2xl text-white mb-1 tracking-wide">
              <span className="text-[#00E5FF]">LINCE</span><span className="text-[#D4A843] text-xs sm:text-sm align-super">®</span>
            </h1>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/30 mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              <span className="text-red-400 text-[10px] sm:text-xs font-bold">{t.warning}</span>
            </div>
            <h2 className="font-display font-semibold text-xs sm:text-sm text-[#D4A843]">{t.title}</h2>
            <p className="text-[#B0B0B0] text-[10px] sm:text-xs mt-1">{t.subtitle}</p>
          </div>

          {/* Scrollable content */}
          <div className="px-4 sm:px-6 py-4 max-h-[50vh] overflow-y-auto custom-scrollbar" style={{ userSelect: 'none' }}>
            {/* Copyright */}
            <p className="text-[#00E5FF] font-mono text-[10px] sm:text-xs font-bold mb-3">{t.copyright}</p>

            {/* NDA Section */}
            <div className="bg-white/[0.02] border border-[#FF5252]/20 rounded-lg p-3 sm:p-4 mb-4">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-lg">⚖️</span>
                <h3 className="text-white font-display font-bold text-xs sm:text-sm">{t.ndaTitle}</h3>
              </div>
              <p className="text-[#B0B0B0] text-[10px] sm:text-xs mb-1"><span className="text-white font-medium">{t.titular}</span> {t.titularValue}</p>
              <p className="text-[#B0B0B0] text-[10px] sm:text-xs mb-3"><span className="text-white font-medium">{t.creador}</span> {t.creadorValue}</p>
              
              <div className="space-y-2">
                {[
                  [t.clausula1Title, t.clausula1Text],
                  [t.clausula2Title, t.clausula2Text],
                  [t.clausula3Title, t.clausula3Text],
                  [t.clausula4Title, t.clausula4Text],
                  [t.clausula5Title, t.clausula5Text],
                  [t.clausula6Title, t.clausula6Text],
                ].map(([title, text], i) => (
                  <div key={i}>
                    <p className="text-white font-medium text-[10px] sm:text-xs">{title}</p>
                    <p className="text-[#B0B0B0] text-[10px] sm:text-xs leading-relaxed">{text}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* IP Section */}
            <div className="bg-white/[0.02] border border-[#00E5FF]/20 rounded-lg p-3 sm:p-4 mb-4">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-lg">🛡️</span>
                <h3 className="text-white font-display font-bold text-xs sm:text-sm">{t.ipTitle}</h3>
              </div>
              <div className="space-y-2">
                {[t.ip1, t.ip2, t.ip3, t.ip4, t.ip5].map((text, i) => (
                  <div key={i} className="flex gap-2">
                    <span className="text-[#D4A843] font-mono text-[10px] font-bold mt-0.5 flex-shrink-0">{String(i + 1).padStart(2, "0")}.</span>
                    <p className="text-[#B0B0B0] text-[10px] sm:text-xs leading-relaxed">{text}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Terms */}
            <div className="border-t border-[#00E5FF]/10 pt-3 mb-3">
              <h3 className="text-white font-display font-semibold text-xs mb-2">{t.termsTitle}</h3>
              <div className="space-y-1.5">
                {[t.terms1, t.terms2, t.terms3, t.terms4].map((term, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <svg className="w-3.5 h-3.5 text-red-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                    <p className="text-[#B0B0B0] text-[10px] sm:text-xs">{term}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Accept warning */}
            <p className="text-[#FF5252] font-bold text-[10px] sm:text-xs mb-3">{t.acceptWarning}</p>

            {/* Law references */}
            <div className="bg-[#00E5FF]/5 border border-[#00E5FF]/10 rounded-lg px-3 py-2">
              <p className="text-[#00E5FF]/60 text-[9px] sm:text-[10px] font-mono">{t.lawRef}</p>
            </div>
          </div>

          {/* Acceptance area */}
          <div className="px-4 sm:px-6 py-4 border-t border-[#00E5FF]/10 bg-[#080808]">
            <div
              className="flex items-start gap-3 cursor-pointer group mb-3"
              onClick={() => { setChecked(!checked); setShowError(false); }}
            >
              <div className="relative flex-shrink-0 mt-0.5">
                <div className={`w-5 h-5 rounded border-2 transition-all flex items-center justify-center ${
                  checked
                    ? "bg-[#00E5FF] border-[#00E5FF]"
                    : "border-[#B0B0B0]/40 group-hover:border-[#00E5FF]/60"
                }`}>
                  {checked && (
                    <svg className="w-3 h-3 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
              </div>
              <span className="text-[#B0B0B0] text-[10px] sm:text-xs leading-relaxed group-hover:text-white transition-colors select-none">
                {t.checkboxLabel}
              </span>
            </div>

            {showError && (
              <p className="text-[#FF5252] text-xs font-medium animate-pulse mb-3">{t.errorMsg}</p>
            )}

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-2">
              <button
                onClick={handleAccept}
                className={`flex-1 py-3 px-6 rounded-xl font-display font-bold text-xs sm:text-sm transition-all duration-300 ${
                  checked
                    ? "bg-gradient-to-r from-[#00E5FF] to-[#00B8D4] text-black hover:shadow-[0_0_20px_rgba(0,229,255,0.3)] hover:scale-[1.01] active:scale-[0.99]"
                    : "bg-white/10 text-white/40 cursor-not-allowed"
                }`}
              >
                {checked ? "🔓 " : "🔒 "}{t.acceptBtn}
              </button>
              <button
                onClick={handleReject}
                className="py-3 px-6 rounded-xl font-display font-bold text-xs sm:text-sm border border-white/20 text-[#B0B0B0] hover:border-[#FF5252]/50 hover:text-[#FF5252] transition-all duration-300"
              >
                {t.rejectBtn}
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="px-4 sm:px-6 py-2 border-t border-[#00E5FF]/5 text-center">
            <p className="text-[#B0B0B0]/40 text-[9px] sm:text-[10px] leading-relaxed">
              {t.footer}<br />
              {t.footerSub}
            </p>
          </div>
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(0,229,255,0.2); border-radius: 2px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(0,229,255,0.4); }
        @keyframes scanLine {
          0% { top: -2px; }
          100% { top: 100%; }
        }
      `}</style>
    </div>
  );
}

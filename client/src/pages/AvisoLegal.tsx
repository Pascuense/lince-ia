import { tl } from "@/contexts/PRDLanguageContext";
import { useState, useEffect, useRef } from "react";
import { UserNavBadge } from "@/components/UserNavBadge";
import { GlobalNavBar } from "@/components/GlobalNavBar";
import { BackButton } from "@/components/BackButton";

type Lang = "es" | "en" | "zh" | "pt-BR" | "pt-PT";

const FLAG_MAP: Record<string, string> = { es: "🇪🇸", en: "🇬🇧", zh: "🇨🇳" };
const LANG_LABELS: Record<string, string> = { es: "Español", en: "English", zh: "中文" };

// ─── TRANSLATIONS ───
const t: Record<string, Record<string, string>> = {
  es: {
    pageTitle: "Legal",
    backBtn: "← Volver",
    lastUpdate: "Última actualización: Febrero 2026",

    // 1. Identificación del titular
    s1Title: "1. Identificación del Titular",
    s1RazonSocial: "Razón Social",
    s1RazonSocialVal: "ACNB IA SL",
    s1NIF: "NIF",
    s1NIFVal: "B24838690",
    s1DomicilioSocial: "Domicilio Social",
    s1DomicilioSocialVal: "Avda Buenos Aires 10, Esc. 3, Planta 3, Puerta D, 50180 Utebo (Zaragoza), España",
    s1DomicilioFiscal: "Domicilio Fiscal",
    s1DomicilioFiscalVal: "Avda Buenos Aires 10, Esc. 3, Planta 3, Puerta D, 50180 Utebo (Zaragoza), España",
    s1Web: "Sitio Web Corporativo",
    s1WebVal: "www.acnb.es",
    s1Email: "Correo Electrónico de Contacto",
    s1EmailVal: "info@acnb.es",
    s1DPO: "Delegado de Protección de Datos (DPO)",
    s1DPOVal: "dpo@lince.com",
    s1Privacidad: "Correo de Privacidad",
    s1PrivacidadVal: "privacy@lince.com",
    s1Creador: "Creador y Fundador",
    s1CreadorVal: "ACNB IA SL",
    s1Registro: "Registro Mercantil",
    s1RegistroVal: "Inscrita en el Registro Mercantil de Zaragoza",
    s1Actividad: "Actividad",
    s1ActividadVal: "Desarrollo de aplicaciones educativas de inteligencia artificial",
    s1Intro: "En cumplimiento del artículo 10 de la Ley 34/2002, de 11 de julio, de Servicios de la Sociedad de la Información y de Comercio Electrónico (LSSI-CE), se pone a disposición de los usuarios la siguiente información identificativa del titular de este sitio web:",

    // 2. Objeto del sitio web
    s2Title: "2. Objeto del Sitio Web",
    s2Text: "LINCE® es una app educativa propiedad de ACNB IA SL donde cualquier persona, de cualquier edad, puede aprender inteligencia artificial jugando. El sitio web da acceso a cursos, lecciones interactivas, juegos educativos y recursos para aprender sobre inteligencia artificial, automatización y nuevas tecnologías.",

    // 3. Propiedad intelectual e industrial
    s3Title: "3. Propiedad Intelectual e Industrial",
    s3Text1: "Todos los contenidos de este sitio web, incluyendo a título enunciativo pero no limitativo: textos, gráficos, imágenes, diseños, logotipos, iconos, software, código fuente, bases de datos, algoritmos, diseños de personajes, interfaces de usuario, metodología pedagógica, sistema de gamificación, contenido educativo, vídeos, audio y cualquier otro material, están protegidos por las leyes de propiedad intelectual e industrial vigentes en España y en el ámbito internacional.",
    s3Text2: "La marca LINCE®, su logotipo y todos los signos distintivos asociados son propiedad exclusiva de ACNB IA SL. Los personajes de la Familia LINCE — incluyendo Duolingenio®, Yayolín®, Duolincito®, Lincepreneur®, Mamálince®, Papálince®, Tiolince®, Tíalince®, Abuelince® y Primolince® — son creaciones originales protegidas por derechos de autor.",
    s3Text3: "Queda estrictamente prohibida la reproducción, distribución, comunicación pública, transformación, descompilación, ingeniería inversa, extracción de datos (scraping), o cualquier otra forma de explotación, total o parcial, de los contenidos de esta plataforma sin autorización previa y por escrito de ACNB IA SL.",
    s3Text4: "El uso no autorizado de cualquier elemento de esta plataforma constituye una infracción de los derechos de propiedad intelectual e industrial de ACNB IA SL y será perseguido conforme a la legislación vigente.",
    s3Text5: "AVISO SOBRE PERSONAJES FICTICIOS: Determinados avatares de la plataforma LINCE® (colecciones 'MUSICALIN' y 'Zaragoza Histórico') son personajes ficticios generados mediante inteligencia artificial con fines exclusivamente educativos y de entretenimiento. Cualquier parecido o referencia a personas reales, vivas o fallecidas, no implica vinculación, afiliación, patrocinio ni respaldo alguno por parte de dichas personas. Las imágenes, nombres y personalidades de estos avatares son creaciones originales de ACNB IA SL y no representan la imagen, opiniones ni declaraciones de ninguna persona real. ACNB IA SL se reserva el derecho de modificar o retirar cualquier avatar en caso de reclamación legítima por parte de los titulares de derechos de imagen.",

    // 4. Condiciones de uso
    s4Title: "4. Condiciones de Uso",
    s4Text1: "El acceso y uso de este sitio web atribuye la condición de usuario e implica la aceptación plena y sin reservas de todas las disposiciones incluidas en este Aviso Legal. Si no está de acuerdo con alguna de las condiciones aquí establecidas, no deberá utilizar este sitio web.",
    s4Text2: "El usuario se compromete a hacer un uso adecuado de los contenidos y servicios ofrecidos a través de este sitio web, absteniéndose de:",
    s4List1: "Utilizar los contenidos con fines ilícitos o contrarios a lo establecido en este Aviso Legal.",
    s4List2: "Reproducir, copiar, distribuir o poner a disposición de terceros los contenidos sin autorización.",
    s4List3: "Realizar actividades de ingeniería inversa, descompilación o extracción de datos.",
    s4List4: "Introducir virus informáticos, gusanos, troyanos o cualquier otro software malicioso.",
    s4List5: "Intentar acceder a áreas restringidas del servidor o de los sistemas informáticos de ACNB IA SL.",
    s4List6: "Suplantar la identidad de otros usuarios o de ACNB IA SL.",

    // 5. Política de privacidad
    s5Title: "5. Política de Privacidad",
    s5Intro: "En cumplimiento del Reglamento General de Protección de Datos (RGPD — UE 2016/679) y la Ley Orgánica 3/2018 de Protección de Datos Personales y Garantía de los Derechos Digitales (LOPDGDD), ACNB IA SL informa a los usuarios sobre el tratamiento de sus datos personales:",
    s5Responsable: "Responsable del Tratamiento",
    s5ResponsableVal: "ACNB IA SL, NIF B24838690",
    s5Finalidad: "Finalidad del Tratamiento",
    s5FinalidadVal: "Gestión de cuentas de usuario, prestación de servicios educativos, personalización de la experiencia de aprendizaje, envío de comunicaciones relacionadas con el servicio y cumplimiento de obligaciones legales.",
    s5Legitimacion: "Base Jurídica",
    s5LegitimacionVal: "Consentimiento del interesado (art. 6.1.a RGPD), ejecución de un contrato (art. 6.1.b RGPD), cumplimiento de una obligación legal (art. 6.1.c RGPD) e interés legítimo (art. 6.1.f RGPD).",
    s5Datos: "Datos Recopilados",
    s5DatosVal: "Nombre de usuario, dirección de correo electrónico, contraseña (cifrada), progreso de aprendizaje, preferencias de idioma, datos de navegación y, en caso de suscripción Premium, datos de facturación.",
    s5Destinatarios: "Destinatarios",
    s5DestinatariosVal: "Los datos no serán cedidos a terceros salvo obligación legal. ACNB IA SL no vende, comparte ni transfiere datos personales a terceros con fines comerciales.",
    s5Conservacion: "Plazo de Conservación",
    s5ConservacionVal: "Los datos se conservarán mientras se mantenga la relación con el usuario y, una vez finalizada, durante los plazos legalmente establecidos para atender posibles responsabilidades.",
    s5Derechos: "Derechos del Usuario",
    s5DerechosVal: "El usuario puede ejercer sus derechos de acceso, rectificación, supresión, portabilidad, limitación y oposición al tratamiento de sus datos dirigiéndose a privacy@lince.com. Asimismo, tiene derecho a presentar una reclamación ante la Agencia Española de Protección de Datos (AEPD) en www.aepd.es.",
    s5Seguridad: "Medidas de Seguridad",
    s5SeguridadVal: "ACNB IA SL ha adoptado las medidas técnicas y organizativas necesarias para garantizar la seguridad de los datos personales, incluyendo cifrado de contraseñas, conexiones seguras (HTTPS/TLS), control de acceso y copias de seguridad periódicas.",

    // 6. Política de cookies
    s6Title: "6. Política de Cookies",
    s6Text1: "Este sitio web utiliza cookies propias y de terceros para mejorar la experiencia del usuario, analizar el tráfico y personalizar el contenido. Las cookies utilizadas son:",
    s6Cookie1Nombre: "Cookie de sesión",
    s6Cookie1Desc: "Necesaria para mantener la sesión del usuario autenticado. Tipo: propia, técnica. Duración: sesión.",
    s6Cookie2Nombre: "Preferencia de idioma",
    s6Cookie2Desc: "Almacena la preferencia de idioma del usuario. Tipo: propia, funcional. Duración: 1 año.",
    s6Cookie3Nombre: "Aceptación legal",
    s6Cookie3Desc: "Registra la aceptación del acuerdo de confidencialidad. Tipo: propia, técnica. Duración: permanente.",
    s6Cookie4Nombre: "Analítica (Umami)",
    s6Cookie4Desc: "Recopila estadísticas anónimas de uso del sitio web. Tipo: terceros, analítica. Duración: sesión. Sin datos personales.",
    s6Text2: "El usuario puede configurar su navegador para rechazar las cookies, aunque esto podría afectar al funcionamiento del sitio web. Para más información sobre cómo gestionar las cookies, consulte la ayuda de su navegador.",

    // 7. Limitación de responsabilidad
    s7Title: "7. Limitación de Responsabilidad",
    s7Text1: "ACNB IA SL no se hace responsable de los daños o perjuicios que pudieran derivarse del acceso o uso de este sitio web, incluyendo, sin limitación, los producidos por virus informáticos o por contenidos de terceros.",
    s7Text2: "ACNB IA SL se reserva el derecho de modificar, suspender o interrumpir el acceso al sitio web o a cualquiera de sus contenidos sin previo aviso.",
    s7Text3: "Los contenidos educativos proporcionados a través de LINCE® tienen carácter informativo y formativo. ACNB IA SL no garantiza que los mismos sean completos, exactos o actualizados en todo momento.",

    // 8. Legislación aplicable y jurisdicción
    s8Title: "8. Legislación Aplicable y Jurisdicción",
    s8Text1: "Este Aviso Legal se rige por la legislación española. En particular, son de aplicación las siguientes normas:",
    s8Law1: "Ley 34/2002, de 11 de julio, de Servicios de la Sociedad de la Información y de Comercio Electrónico (LSSI-CE)",
    s8Law2: "Reglamento General de Protección de Datos (RGPD — UE 2016/679)",
    s8Law3: "Ley Orgánica 3/2018, de 5 de diciembre, de Protección de Datos Personales y Garantía de los Derechos Digitales (LOPDGDD)",
    s8Law4: "Real Decreto Legislativo 1/1996, de 12 de abril, por el que se aprueba el Texto Refundido de la Ley de Propiedad Intelectual",
    s8Law5: "Ley 17/2001, de 7 de diciembre, de Marcas",
    s8Law6: "Ley 1/2019, de 20 de febrero, de Secretos Empresariales",
    s8Law7: "Ley 3/1991, de 10 de enero, de Competencia Desleal",
    s8Law8: "Directiva 2004/48/CE del Parlamento Europeo sobre el respeto de los derechos de propiedad intelectual",
    s8Law9: "Convenio de Berna para la Protección de las Obras Literarias y Artísticas",
    s8Law10: "Tratado de la OMPI sobre Derecho de Autor",
    s8Text2: "Para la resolución de cualquier controversia derivada del uso de este sitio web, las partes se someten a los Juzgados y Tribunales de Zaragoza (España), con renuncia expresa a cualquier otro fuero que pudiera corresponderles.",

    // 9. Contacto
    s9Title: "9. Contacto",
    s9Text: "Para cualquier consulta, reclamación o ejercicio de derechos relacionados con este Aviso Legal, puede ponerse en contacto con ACNB IA SL a través de los siguientes medios:",
    s9General: "Consultas generales",
    s9Privacy: "Privacidad y protección de datos",
    s9DPO: "Delegado de Protección de Datos",
    s9Web: "Sitio web corporativo",

    // Footer
    footerText: "© 2023-2026 ACNB IA SL (NIF B24838690). Todos los derechos reservados.",
    footerCreator: "Propiedad de ACNB IA SL",
  },
  en: {
    pageTitle: "Legal Notice",
    backBtn: "← Back",
    lastUpdate: "Last updated: February 2026",

    s1Title: "1. Owner Identification",
    s1RazonSocial: "Company Name",
    s1RazonSocialVal: "ACNB IA SL",
    s1NIF: "Tax ID (NIF)",
    s1NIFVal: "B24838690",
    s1DomicilioSocial: "Registered Office",
    s1DomicilioSocialVal: "Avda Buenos Aires 10, Esc. 3, Planta 3, Puerta D, 50180 Utebo (Zaragoza), Spain",
    s1DomicilioFiscal: "Tax Address",
    s1DomicilioFiscalVal: "Avda Buenos Aires 10, Esc. 3, Planta 3, Puerta D, 50180 Utebo (Zaragoza), Spain",
    s1Web: "Corporate Website",
    s1WebVal: "www.acnb.es",
    s1Email: "Contact Email",
    s1EmailVal: "info@acnb.es",
    s1DPO: "Data Protection Officer (DPO)",
    s1DPOVal: "dpo@lince.com",
    s1Privacidad: "Privacy Email",
    s1PrivacidadVal: "privacy@lince.com",
    s1Creador: "Creator and Founder",
    s1CreadorVal: "ACNB IA SL",
    s1Registro: "Commercial Registry",
    s1RegistroVal: "Registered in the Commercial Registry of Zaragoza",
    s1Actividad: "Business Activity",
    s1ActividadVal: "Development of artificial intelligence educational applications",
    s1Intro: "In compliance with Article 10 of Law 34/2002, of July 11, on Information Society Services and Electronic Commerce (LSSI-CE), the following identifying information of the owner of this website is made available to users:",

    s2Title: "2. Purpose of the Website",
    s2Text: "LINCE® is an educational app owned by ACNB IA SL where anyone, of any age, can learn artificial intelligence by playing. The website provides access to courses, interactive lessons, educational games and resources to learn about artificial intelligence, automation and new technologies.",

    s3Title: "3. Intellectual and Industrial Property",
    s3Text1: "All content on this website, including but not limited to: texts, graphics, images, designs, logos, icons, software, source code, databases, algorithms, character designs, user interfaces, pedagogical methodology, gamification system, educational content, videos, audio and any other material, is protected by intellectual and industrial property laws in force in Spain and internationally.",
    s3Text2: "The LINCE® brand, its logo and all associated distinctive signs are the exclusive property of ACNB IA SL. The characters of the LINCE Family — including Duolingenio®, Yayolín®, Duolincito®, Lincepreneur®, Mamálince®, Papálince®, Tiolince®, Tíalince®, Abuelince® and Primolince® — are original creations protected by copyright.",
    s3Text3: "The reproduction, distribution, public communication, transformation, decompilation, reverse engineering, data extraction (scraping), or any other form of exploitation, in whole or in part, of the contents of this platform is strictly prohibited without prior written authorization from ACNB IA SL.",
    s3Text4: "Unauthorized use of any element of this platform constitutes an infringement of the intellectual and industrial property rights of ACNB IA SL and will be prosecuted in accordance with applicable law.",
    s3Text5: "NOTICE REGARDING FICTIONAL CHARACTERS: Certain avatars on the LINCE® platform ('Urban' and 'Zaragoza Histórico' collections) are fictional characters generated using artificial intelligence for exclusively educational and entertainment purposes. Any resemblance or reference to real persons, living or deceased, constitutes an artistic and cultural tribute and does not imply any connection, affiliation, sponsorship or endorsement by such persons. The images, names and personalities of these avatars are original creations of ACNB IA SL and do not represent the image, opinions or statements of any real person. ACNB IA SL reserves the right to modify or remove any avatar in the event of a legitimate claim by image rights holders.",

    s4Title: "4. Terms of Use",
    s4Text1: "Access to and use of this website confers the status of user and implies full and unreserved acceptance of all provisions included in this Legal Notice. If you do not agree with any of the conditions set forth herein, you should not use this website.",
    s4Text2: "The user agrees to make appropriate use of the content and services offered through this website, refraining from:",
    s4List1: "Using the content for illegal purposes or contrary to what is established in this Legal Notice.",
    s4List2: "Reproducing, copying, distributing or making available to third parties the content without authorization.",
    s4List3: "Carrying out reverse engineering, decompilation or data extraction activities.",
    s4List4: "Introducing computer viruses, worms, trojans or any other malicious software.",
    s4List5: "Attempting to access restricted areas of the server or computer systems of ACNB IA SL.",
    s4List6: "Impersonating other users or ACNB IA SL.",

    s5Title: "5. Privacy Policy",
    s5Intro: "In compliance with the General Data Protection Regulation (GDPR — EU 2016/679) and Organic Law 3/2018 on the Protection of Personal Data and Guarantee of Digital Rights (LOPDGDD), ACNB IA SL informs users about the processing of their personal data:",
    s5Responsable: "Data Controller",
    s5ResponsableVal: "ACNB IA SL, Tax ID (NIF) B24838690",
    s5Finalidad: "Purpose of Processing",
    s5FinalidadVal: "User account management, provision of educational services, personalization of the learning experience, sending service-related communications and compliance with legal obligations.",
    s5Legitimacion: "Legal Basis",
    s5LegitimacionVal: "Consent of the data subject (Art. 6.1.a GDPR), performance of a contract (Art. 6.1.b GDPR), compliance with a legal obligation (Art. 6.1.c GDPR) and legitimate interest (Art. 6.1.f GDPR).",
    s5Datos: "Data Collected",
    s5DatosVal: "Username, email address, password (encrypted), learning progress, language preferences, browsing data and, in case of Premium subscription, billing data.",
    s5Destinatarios: "Recipients",
    s5DestinatariosVal: "Data will not be transferred to third parties except by legal obligation. ACNB IA SL does not sell, share or transfer personal data to third parties for commercial purposes.",
    s5Conservacion: "Retention Period",
    s5ConservacionVal: "Data will be retained as long as the relationship with the user is maintained and, once terminated, for the legally established periods to address possible liabilities.",
    s5Derechos: "User Rights",
    s5DerechosVal: "Users may exercise their rights of access, rectification, erasure, portability, restriction and objection to the processing of their data by contacting privacy@lince.com. They also have the right to file a complaint with the Spanish Data Protection Agency (AEPD) at www.aepd.es.",
    s5Seguridad: "Security Measures",
    s5SeguridadVal: "ACNB IA SL has adopted the necessary technical and organizational measures to ensure the security of personal data, including password encryption, secure connections (HTTPS/TLS), access control and regular backups.",

    s6Title: "6. Cookie Policy",
    s6Text1: "This website uses its own and third-party cookies to improve the user experience, analyze traffic and personalize content. The cookies used are:",
    s6Cookie1Nombre: "Session cookie",
    s6Cookie1Desc: "Necessary to maintain the authenticated user session. Type: own, technical. Duration: session.",
    s6Cookie2Nombre: "Language preference",
    s6Cookie2Desc: "Stores the user's language preference. Type: own, functional. Duration: 1 year.",
    s6Cookie3Nombre: "Legal acceptance",
    s6Cookie3Desc: "Records acceptance of the confidentiality agreement. Type: own, technical. Duration: permanent.",
    s6Cookie4Nombre: "Analytics (Umami)",
    s6Cookie4Desc: "Collects anonymous website usage statistics. Type: third-party, analytics. Duration: session. No personal data.",
    s6Text2: "Users can configure their browser to reject cookies, although this may affect the functionality of the website. For more information on how to manage cookies, consult your browser's help section.",

    s7Title: "7. Limitation of Liability",
    s7Text1: "ACNB IA SL is not responsible for any damages that may arise from access to or use of this website, including, without limitation, those caused by computer viruses or third-party content.",
    s7Text2: "ACNB IA SL reserves the right to modify, suspend or interrupt access to the website or any of its content without prior notice.",
    s7Text3: "The educational content provided through LINCE® is for informational and educational purposes. ACNB IA SL does not guarantee that it is complete, accurate or up-to-date at all times.",

    s8Title: "8. Applicable Law and Jurisdiction",
    s8Text1: "This Legal Notice is governed by Spanish law. In particular, the following regulations apply:",
    s8Law1: "Law 34/2002, of July 11, on Information Society Services and Electronic Commerce (LSSI-CE)",
    s8Law2: "General Data Protection Regulation (GDPR — EU 2016/679)",
    s8Law3: "Organic Law 3/2018, of December 5, on the Protection of Personal Data and Guarantee of Digital Rights (LOPDGDD)",
    s8Law4: "Royal Legislative Decree 1/1996, of April 12, approving the Consolidated Text of the Intellectual Property Law",
    s8Law5: "Law 17/2001, of December 7, on Trademarks",
    s8Law6: "Law 1/2019, of February 20, on Trade Secrets",
    s8Law7: "Law 3/1991, of January 10, on Unfair Competition",
    s8Law8: "Directive 2004/48/EC of the European Parliament on the enforcement of intellectual property rights",
    s8Law9: "Berne Convention for the Protection of Literary and Artistic Works",
    s8Law10: "WIPO Copyright Treaty",
    s8Text2: "For the resolution of any dispute arising from the use of this website, the parties submit to the Courts and Tribunals of Zaragoza (Spain), with express waiver of any other jurisdiction that may correspond to them.",

    s9Title: "9. Contact",
    s9Text: "For any inquiry, complaint or exercise of rights related to this Legal Notice, you may contact ACNB IA SL through the following means:",
    s9General: "General inquiries",
    s9Privacy: "Privacy and data protection",
    s9DPO: "Data Protection Officer",
    s9Web: "Corporate website",

    footerText: "© 2023-2026 ACNB IA SL (NIF B24838690). All rights reserved.",
    footerCreator: "Property of ACNB IA SL",
  },
  zh: {
    pageTitle: "法律声明",
    backBtn: "← 返回",
    lastUpdate: "最后更新：2026年2月",

    s1Title: "1. 所有者身份信息",
    s1RazonSocial: "公司名称",
    s1RazonSocialVal: "ACNB IA SL",
    s1NIF: "税号 (NIF)",
    s1NIFVal: "B24838690",
    s1DomicilioSocial: "注册地址",
    s1DomicilioSocialVal: "Avda Buenos Aires 10, Esc. 3, Planta 3, Puerta D, 50180 Utebo (Zaragoza), 西班牙",
    s1DomicilioFiscal: "税务地址",
    s1DomicilioFiscalVal: "Avda Buenos Aires 10, Esc. 3, Planta 3, Puerta D, 50180 Utebo (Zaragoza), 西班牙",
    s1Web: "企业网站",
    s1WebVal: "www.acnb.es",
    s1Email: "联系邮箱",
    s1EmailVal: "info@acnb.es",
    s1DPO: "数据保护官 (DPO)",
    s1DPOVal: "dpo@lince.com",
    s1Privacidad: "隐私邮箱",
    s1PrivacidadVal: "privacy@lince.com",
    s1Creador: "创始人",
    s1CreadorVal: "ACNB IA SL",
    s1Registro: "商业登记",
    s1RegistroVal: "已在萨拉戈萨商业登记处注册",
    s1Actividad: "业务活动",
    s1ActividadVal: "人工智能教育平台开发（教育科技）",
    s1Intro: "根据2002年7月11日第34/2002号法律（信息社会服务和电子商务法，LSSI-CE）第10条的规定，向用户提供本网站所有者的以下身份信息：",

    s2Title: "2. 网站目的",
    s2Text: "LINCE® 是 ACNB IA SL 旗下的游戏化教育科技平台，旨在让所有世代都能接触人工智能培训。该网站提供与人工智能、机器学习、自动化和新兴技术相关的课程、互动课程、游戏化工具和教育资源。",

    s3Title: "3. 知识产权和工业产权",
    s3Text1: "本网站的所有内容，包括但不限于：文本、图形、图像、设计、标志、图标、软件、源代码、数据库、算法、角色设计、用户界面、教学方法、游戏化系统、教育内容、视频、音频和任何其他材料，均受西班牙和国际知识产权和工业产权法律的保护。",
    s3Text2: "LINCE® 品牌、其标志和所有相关标识均为 ACNB IA SL 的专有财产。LINCE 家族的角色——包括 Duolingenio®、Yayolín®、Duolincito®、Lincepreneur®、Mamálince®、Papálince®、Tiolince®、Tíalince®、Abuelince® 和 Primolince®——是受版权保护的原创作品。",
    s3Text3: "严禁未经 ACNB IA SL 事先书面授权，以任何形式全部或部分复制、分发、公开传播、改编、反编译、逆向工程、数据提取（爬虫）或以其他方式利用本平台的内容。",
    s3Text4: "未经授权使用本平台的任何元素均构成对 ACNB IA SL 知识产权和工业产权的侵犯，将依据适用法律予以追究。",
    s3Text5: "关于虚构角色的声明：LINCE® 平台上的某些头像（“Urban”和“Zaragoza Histórico”系列）是使用人工智能生成的虚构角色，仅用于教育和娱乐目的。与真实人物（在世或已故）的任何相似或引用均为艺术和文化致敬，并不意味着与这些人物有任何关联、附属、赞助或背书关系。这些头像的图像、名称和个性是 ACNB IA SL 的原创作品，不代表任何真实人物的形象、观点或声明。ACNB IA SL 保留在肠像权持有人提出合法索赔时修改或删除任何头像的权利。",

    s4Title: "4. 使用条款",
    s4Text1: "访问和使用本网站即赋予用户身份，并意味着完全无保留地接受本法律声明中包含的所有条款。如果您不同意本文所述的任何条件，请勿使用本网站。",
    s4Text2: "用户承诺合理使用本网站提供的内容和服务，不得：",
    s4List1: "将内容用于非法目的或违反本法律声明规定的目的。",
    s4List2: "未经授权复制、拷贝、分发或向第三方提供内容。",
    s4List3: "进行逆向工程、反编译或数据提取活动。",
    s4List4: "引入计算机病毒、蠕虫、木马或任何其他恶意软件。",
    s4List5: "试图访问 ACNB IA SL 服务器或计算机系统的受限区域。",
    s4List6: "冒充其他用户或 ACNB IA SL。",

    s5Title: "5. 隐私政策",
    s5Intro: "根据《通用数据保护条例》（GDPR — EU 2016/679）和第3/2018号组织法（个人数据保护和数字权利保障法，LOPDGDD），ACNB IA SL 向用户告知其个人数据的处理情况：",
    s5Responsable: "数据控制者",
    s5ResponsableVal: "ACNB IA SL，税号 (NIF) B24838690",
    s5Finalidad: "处理目的",
    s5FinalidadVal: "用户账户管理、提供教育服务、个性化学习体验、发送与服务相关的通信以及履行法律义务。",
    s5Legitimacion: "法律依据",
    s5LegitimacionVal: "数据主体同意（GDPR第6.1.a条）、合同执行（GDPR第6.1.b条）、法律义务（GDPR第6.1.c条）和合法利益（GDPR第6.1.f条）。",
    s5Datos: "收集的数据",
    s5DatosVal: "用户名、电子邮箱、密码（加密）、学习进度、语言偏好、浏览数据，以及Premium订阅时的账单数据。",
    s5Destinatarios: "接收方",
    s5DestinatariosVal: "除法律义务外，数据不会转移给第三方。ACNB IA SL 不会出于商业目的向第三方出售、共享或转让个人数据。",
    s5Conservacion: "保留期限",
    s5ConservacionVal: "数据将在与用户的关系存续期间保留，关系终止后，在法定期限内保留以应对可能的责任。",
    s5Derechos: "用户权利",
    s5DerechosVal: "用户可通过联系 privacy@lince.com 行使访问、更正、删除、转移、限制和反对处理其数据的权利。用户还有权向西班牙数据保护局（AEPD）提出投诉，网址：www.aepd.es。",
    s5Seguridad: "安全措施",
    s5SeguridadVal: "ACNB IA SL 已采取必要的技术和组织措施来确保个人数据的安全，包括密码加密、安全连接（HTTPS/TLS）、访问控制和定期备份。",

    s6Title: "6. Cookie 政策",
    s6Text1: "本网站使用自有和第三方 Cookie 来改善用户体验、分析流量和个性化内容。使用的 Cookie 包括：",
    s6Cookie1Nombre: "会话 Cookie",
    s6Cookie1Desc: "维护已认证用户会话所必需。类型：自有，技术性。持续时间：会话。",
    s6Cookie2Nombre: "语言偏好",
    s6Cookie2Desc: "存储用户的语言偏好。类型：自有，功能性。持续时间：1年。",
    s6Cookie3Nombre: "法律接受",
    s6Cookie3Desc: "记录保密协议的接受。类型：自有，技术性。持续时间：永久。",
    s6Cookie4Nombre: "分析（Umami）",
    s6Cookie4Desc: "收集匿名网站使用统计数据。类型：第三方，分析性。持续时间：会话。无个人数据。",
    s6Text2: "用户可以配置浏览器拒绝 Cookie，但这可能会影响网站的功能。有关如何管理 Cookie 的更多信息，请查阅浏览器的帮助部分。",

    s7Title: "7. 责任限制",
    s7Text1: "ACNB IA SL 对因访问或使用本网站而可能产生的任何损害不承担责任，包括但不限于由计算机病毒或第三方内容造成的损害。",
    s7Text2: "ACNB IA SL 保留在不事先通知的情况下修改、暂停或中断网站访问或其任何内容的权利。",
    s7Text3: "通过 LINCE® 提供的教育内容仅供参考和教育目的。ACNB IA SL 不保证其在任何时候都是完整、准确或最新的。",

    s8Title: "8. 适用法律和管辖权",
    s8Text1: "本法律声明受西班牙法律管辖。特别适用以下法规：",
    s8Law1: "2002年7月11日第34/2002号法律（信息社会服务和电子商务法，LSSI-CE）",
    s8Law2: "《通用数据保护条例》（GDPR — EU 2016/679）",
    s8Law3: "2018年12月5日第3/2018号组织法（个人数据保护和数字权利保障法，LOPDGDD）",
    s8Law4: "1996年4月12日第1/1996号皇家立法令（知识产权法统一文本）",
    s8Law5: "2001年12月7日第17/2001号法律（商标法）",
    s8Law6: "2019年2月20日第1/2019号法律（商业秘密法）",
    s8Law7: "1991年1月10日第3/1991号法律（不正当竞争法）",
    s8Law8: "欧洲议会第2004/48/EC号指令（知识产权执法）",
    s8Law9: "《保护文学和艺术作品伯尔尼公约》",
    s8Law10: "《WIPO版权条约》",
    s8Text2: "对于因使用本网站而产生的任何争议，双方提交至萨拉戈萨（西班牙）的法院和法庭管辖，明确放弃可能对应的任何其他管辖权。",

    s9Title: "9. 联系方式",
    s9Text: "如有任何与本法律声明相关的咨询、投诉或权利行使，您可以通过以下方式联系 ACNB IA SL：",
    s9General: "一般咨询",
    s9Privacy: "隐私和数据保护",
    s9DPO: "数据保护官",
    s9Web: "企业网站",

    footerText: "© 2023-2026 ACNB IA SL (NIF B24838690). 保留所有权利。",
    footerCreator: "ACNB IA SL所有",
  },
};

// ─── SECTION COMPONENT ───
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="pt-14 mb-10">
      <BackButton variant="inline" />
      <GlobalNavBar />
      <h2 className="font-['Space_Grotesk'] font-bold text-xl sm:text-2xl text-[#00E5FF] mb-4 pb-2 border-b border-[#00E5FF]/20">
        {title}
      </h2>
      {children}
    </section>
  );
}

// ─── DATA ROW ───
function DataRow({ label, value, isLink, isEmail }: { label: string; value: string; isLink?: boolean; isEmail?: boolean }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-3 py-2 border-b border-white/[0.04]">
      <span className="text-[#D4A843] font-semibold text-sm min-w-[200px] flex-shrink-0">{label}:</span>
      {isLink ? (
        <a href={`https://${value}`} target="_blank" rel="noopener noreferrer" className="text-[#00E5FF] hover:underline text-sm break-all">{value}</a>
      ) : isEmail ? (
        <a href={`mailto:${value}`} className="text-[#00E5FF] hover:underline text-sm break-all">{value}</a>
      ) : (
        <span className="text-[#B0B0B0] text-sm">{value}</span>
      )}
    </div>
  );
}

// ─── MAIN PAGE ───
export default function AvisoLegal() {
  const [lang, setLang] = useState<Lang>("es");
  const topRef = useRef<HTMLDivElement>(null);
  const l = t[lang];

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // TOC sections
  const sections = [
    { id: "s1", label: l.s1Title },
    { id: "s2", label: l.s2Title },
    { id: "s3", label: l.s3Title },
    { id: "s4", label: l.s4Title },
    { id: "s5", label: l.s5Title },
    { id: "s6", label: l.s6Title },
    { id: "s7", label: l.s7Title },
    { id: "s8", label: l.s8Title },
    { id: "s9", label: l.s9Title },
  ];

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div ref={topRef} className="min-h-screen bg-[#0A0A0A] text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#0A0A0A]/95 backdrop-blur-md border-b border-[#00E5FF]/10">
        <div className="container flex items-center justify-between h-14 gap-2">
          <div className="flex items-center gap-3">
            <a href="/" className="text-[#B0B0B0] hover:text-white text-sm font-medium transition-colors">
              {l.backBtn}
            </a>
            <span className="text-white/20">|</span>
            <span className="font-['Space_Grotesk'] font-bold text-sm">
              <span className="text-[#00E5FF]">LINCE</span>
            </span>
          </div>
          <div className="flex items-center gap-1">
            {(Object.keys(FLAG_MAP) as Lang[]).map((k) => (
              <button
                key={k}
                onClick={() => setLang(k)}
                className={`px-2 py-1 text-xs rounded transition-all ${lang === k ? "bg-[#00E5FF]/20 text-[#00E5FF] font-bold" : "text-[#B0B0B0] hover:text-white hover:bg-white/5"}`}
              >
                {FLAG_MAP[k]} {LANG_LABELS[k]}
              </button>
            ))}
            <UserNavBadge variant="compact" />
          </div>
        </div>
      </header>

      <div className="container py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">
          {/* Sidebar TOC */}
          <aside className="hidden lg:block">
            <nav className="sticky top-20 space-y-1">
              <p className="font-['Space_Grotesk'] font-bold text-[#D4A843] text-xs uppercase tracking-wider mb-3">
                {tl(lang, { es: "Índice", en: "Table of Contents", zh: "目录", 'pt-BR': "Índice", 'pt-PT': "Índice" })}
              </p>
              {sections.map((s) => (
                <button
                  key={s.id}
                  onClick={() => scrollTo(s.id)}
                  className="block w-full text-left px-3 py-2 text-xs text-[#B0B0B0] hover:text-[#00E5FF] hover:bg-[#00E5FF]/5 rounded transition-all leading-snug"
                >
                  {s.label}
                </button>
              ))}
            </nav>
          </aside>

          {/* Main Content */}
          <main className="min-w-0">
            {/* Page Title */}
            <div className="mb-8">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#00E5FF]/30 bg-[#00E5FF]/5 mb-4">
                <span className="w-2 h-2 rounded-full bg-[#00E5FF]" />
                <span className="text-[#00E5FF] text-xs font-medium">{l.lastUpdate}</span>
              </div>
              <h1 className="font-['Space_Grotesk'] font-bold text-3xl sm:text-4xl text-white mb-2">
                {l.pageTitle}
              </h1>
              <p className="font-['Space_Grotesk'] text-lg text-[#D4A843]">
                <span className="text-[#00E5FF]">LINCE</span><span className="text-[#D4A843] text-xs align-super">®</span> — ACNB IA SL
              </p>
            </div>

            {/* Mobile TOC */}
            <div className="lg:hidden mb-8 p-4 bg-white/[0.02] border border-white/[0.06] rounded-lg">
              <p className="font-['Space_Grotesk'] font-bold text-[#D4A843] text-xs uppercase tracking-wider mb-2">
                {tl(lang, { es: "Índice", en: "Table of Contents", zh: "目录", 'pt-BR': "Índice", 'pt-PT': "Índice" })}
              </p>
              <div className="flex flex-wrap gap-1">
                {sections.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => scrollTo(s.id)}
                    className="px-2 py-1 text-[10px] text-[#B0B0B0] hover:text-[#00E5FF] hover:bg-[#00E5FF]/5 rounded transition-all"
                  >
                    {s.label.split(". ")[0]}
                  </button>
                ))}
              </div>
            </div>

            {/* ─── SECTION 1: Identificación ─── */}
            <div id="s1">
              <Section title={l.s1Title}>
                <p className="text-[#B0B0B0] text-sm leading-relaxed mb-6">{l.s1Intro}</p>
                <div className="bg-white/[0.02] border border-white/[0.06] rounded-lg p-4 sm:p-6">
                  <DataRow label={l.s1RazonSocial} value={l.s1RazonSocialVal} />
                  <DataRow label={l.s1NIF} value={l.s1NIFVal} />
                  <DataRow label={l.s1DomicilioSocial} value={l.s1DomicilioSocialVal} />
                  <DataRow label={l.s1DomicilioFiscal} value={l.s1DomicilioFiscalVal} />
                  <DataRow label={l.s1Registro} value={l.s1RegistroVal} />
                  <DataRow label={l.s1Actividad} value={l.s1ActividadVal} />
                  <DataRow label={l.s1Creador} value={l.s1CreadorVal} />
                  <DataRow label={l.s1Web} value={l.s1WebVal} isLink />
                  <DataRow label={l.s1Email} value={l.s1EmailVal} isEmail />
                  <DataRow label={l.s1DPO} value={l.s1DPOVal} isEmail />
                  <DataRow label={l.s1Privacidad} value={l.s1PrivacidadVal} isEmail />
                </div>
              </Section>
            </div>

            {/* ─── SECTION 2: Objeto ─── */}
            <div id="s2">
              <Section title={l.s2Title}>
                <p className="text-[#B0B0B0] text-sm leading-relaxed">{l.s2Text}</p>
              </Section>
            </div>

            {/* ─── SECTION 3: Propiedad Intelectual ─── */}
            <div id="s3">
              <Section title={l.s3Title}>
                <div className="space-y-4">
                  <p className="text-[#B0B0B0] text-sm leading-relaxed">{l.s3Text1}</p>
                  <p className="text-[#B0B0B0] text-sm leading-relaxed">{l.s3Text2}</p>
                  <div className="p-4 bg-[#FF5252]/5 border border-[#FF5252]/15 rounded-lg">
                    <p className="text-[#FF5252]/80 text-sm leading-relaxed font-medium">{l.s3Text3}</p>
                  </div>
                  <p className="text-[#B0B0B0] text-sm leading-relaxed">{l.s3Text4}</p>
                  <div className="p-4 bg-amber-500/5 border border-amber-500/15 rounded-lg mt-2">
                    <p className="text-amber-400/80 text-sm leading-relaxed font-medium">{l.s3Text5}</p>
                  </div>
                </div>
              </Section>
            </div>

            {/* ─── SECTION 4: Condiciones de Uso ─── */}
            <div id="s4">
              <Section title={l.s4Title}>
                <p className="text-[#B0B0B0] text-sm leading-relaxed mb-4">{l.s4Text1}</p>
                <p className="text-[#B0B0B0] text-sm leading-relaxed mb-3">{l.s4Text2}</p>
                <ul className="space-y-2 ml-4">
                  {[l.s4List1, l.s4List2, l.s4List3, l.s4List4, l.s4List5, l.s4List6].map((item, i) => (
                    <li key={i} className="text-[#B0B0B0] text-sm leading-relaxed flex items-start gap-2">
                      <span className="text-[#D4A843] mt-1 flex-shrink-0">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </Section>
            </div>

            {/* ─── SECTION 5: Privacidad ─── */}
            <div id="s5">
              <Section title={l.s5Title}>
                <p className="text-[#B0B0B0] text-sm leading-relaxed mb-6">{l.s5Intro}</p>
                <div className="space-y-4">
                  {[
                    { label: l.s5Responsable, value: l.s5ResponsableVal },
                    { label: l.s5Finalidad, value: l.s5FinalidadVal },
                    { label: l.s5Legitimacion, value: l.s5LegitimacionVal },
                    { label: l.s5Datos, value: l.s5DatosVal },
                    { label: l.s5Destinatarios, value: l.s5DestinatariosVal },
                    { label: l.s5Conservacion, value: l.s5ConservacionVal },
                    { label: l.s5Derechos, value: l.s5DerechosVal },
                    { label: l.s5Seguridad, value: l.s5SeguridadVal },
                  ].map((item, i) => (
                    <div key={i} className="bg-white/[0.02] border border-white/[0.04] rounded-lg p-4">
                      <h4 className="text-[#D4A843] font-semibold text-sm mb-2">{item.label}</h4>
                      <p className="text-[#B0B0B0] text-sm leading-relaxed">{item.value}</p>
                    </div>
                  ))}
                </div>
              </Section>
            </div>

            {/* ─── SECTION 6: Cookies ─── */}
            <div id="s6">
              <Section title={l.s6Title}>
                <p className="text-[#B0B0B0] text-sm leading-relaxed mb-4">{l.s6Text1}</p>
                <div className="overflow-x-auto mb-4">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-[#00E5FF]/20">
                        <th className="text-left text-[#00E5FF] font-semibold py-2 px-3">Cookie</th>
                        <th className="text-left text-[#00E5FF] font-semibold py-2 px-3">
                          {tl(lang, { es: "Descripción", en: "Description", zh: "描述", 'pt-BR': "Descripción", 'pt-PT': "Descripción" })}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { name: l.s6Cookie1Nombre, desc: l.s6Cookie1Desc },
                        { name: l.s6Cookie2Nombre, desc: l.s6Cookie2Desc },
                        { name: l.s6Cookie3Nombre, desc: l.s6Cookie3Desc },
                        { name: l.s6Cookie4Nombre, desc: l.s6Cookie4Desc },
                      ].map((c, i) => (
                        <tr key={i} className="border-b border-white/[0.04]">
                          <td className="py-2 px-3 text-[#D4A843] font-medium whitespace-nowrap">{c.name}</td>
                          <td className="py-2 px-3 text-[#B0B0B0]">{c.desc}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="text-[#B0B0B0] text-sm leading-relaxed">{l.s6Text2}</p>
              </Section>
            </div>

            {/* ─── SECTION 7: Limitación de responsabilidad ─── */}
            <div id="s7">
              <Section title={l.s7Title}>
                <div className="space-y-4">
                  <p className="text-[#B0B0B0] text-sm leading-relaxed">{l.s7Text1}</p>
                  <p className="text-[#B0B0B0] text-sm leading-relaxed">{l.s7Text2}</p>
                  <p className="text-[#B0B0B0] text-sm leading-relaxed">{l.s7Text3}</p>
                </div>
              </Section>
            </div>

            {/* ─── SECTION 8: Legislación ─── */}
            <div id="s8">
              <Section title={l.s8Title}>
                <p className="text-[#B0B0B0] text-sm leading-relaxed mb-4">{l.s8Text1}</p>
                <div className="bg-white/[0.02] border border-white/[0.06] rounded-lg p-4 sm:p-6 mb-4">
                  <ul className="space-y-2">
                    {[l.s8Law1, l.s8Law2, l.s8Law3, l.s8Law4, l.s8Law5, l.s8Law6, l.s8Law7, l.s8Law8, l.s8Law9, l.s8Law10].map((law, i) => (
                      <li key={i} className="text-[#B0B0B0] text-sm leading-relaxed flex items-start gap-2">
                        <span className="text-[#00E5FF] mt-0.5 flex-shrink-0">§</span>
                        <span>{law}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="p-4 bg-[#D4A843]/5 border border-[#D4A843]/15 rounded-lg">
                  <p className="text-[#D4A843] text-sm leading-relaxed font-medium">{l.s8Text2}</p>
                </div>
              </Section>
            </div>

            {/* ─── SECTION 9: Contacto ─── */}
            <div id="s9">
              <Section title={l.s9Title}>
                <p className="text-[#B0B0B0] text-sm leading-relaxed mb-4">{l.s9Text}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="bg-white/[0.02] border border-white/[0.06] rounded-lg p-4">
                    <p className="text-[#D4A843] font-semibold text-xs mb-1">{l.s9General}</p>
                    <a href="mailto:info@acnb.es" className="text-[#00E5FF] hover:underline text-sm">info@acnb.es</a>
                  </div>
                  <div className="bg-white/[0.02] border border-white/[0.06] rounded-lg p-4">
                    <p className="text-[#D4A843] font-semibold text-xs mb-1">{l.s9Privacy}</p>
                    <a href="mailto:privacy@lince.com" className="text-[#00E5FF] hover:underline text-sm">privacy@lince.com</a>
                  </div>
                  <div className="bg-white/[0.02] border border-white/[0.06] rounded-lg p-4">
                    <p className="text-[#D4A843] font-semibold text-xs mb-1">{l.s9DPO}</p>
                    <a href="mailto:dpo@lince.com" className="text-[#00E5FF] hover:underline text-sm">dpo@lince.com</a>
                  </div>
                  <div className="bg-white/[0.02] border border-white/[0.06] rounded-lg p-4">
                    <p className="text-[#D4A843] font-semibold text-xs mb-1">{l.s9Web}</p>
                    <a href="https://www.acnb.es" target="_blank" rel="noopener noreferrer" className="text-[#00E5FF] hover:underline text-sm">www.acnb.es</a>
                  </div>
                </div>
              </Section>
            </div>

            {/* ─── FOOTER ─── */}
            <div className="mt-12 pt-6 border-t border-white/[0.06] text-center">
              <p className="font-['Space_Grotesk'] font-bold text-sm text-white mb-1">
                <span className="text-[#00E5FF]">LINCE</span><span className="text-[#D4A843] text-xs align-super">®</span>
              </p>
              <p className="text-[#B0B0B0]/60 text-xs mb-1">{l.footerText}</p>
              <p className="text-[#B0B0B0]/40 text-[10px]">{l.footerCreator}</p>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

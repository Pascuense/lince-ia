import { useState, useMemo } from "react";
import {
  ArrowLeft,
  Search,
  BookOpen,
  Clock,
  Target,
  Users,
  Star,
  Filter,
  ChevronDown,
  ChevronRight,
  CheckCircle2,
  Zap,
  Brain,
  Briefcase,
  Code,
  Palette,
  MessageSquare,
  Shield,
  TrendingUp,
  Globe,
} from "lucide-react";
import { AVATAR_FRONTAL, AVATAR_EXPRESSIONS } from "@/lib/avatarConstants";
import { UserNavBadge } from "@/components/UserNavBadge";
import { GlobalNavBar } from "@/components/GlobalNavBar";
import { BackButton } from "@/components/BackButton";

// ─── Avatar Guide for Todos los Cursos ───
const GUIDE_AVATAR = {
  name: "MAMALINA ABUELA",
  role: "La Abuela Sabia",
  img: AVATAR_FRONTAL.YAYALINA,
  expr: AVATAR_EXPRESSIONS.YAYALINA,
  color: "#D4A843",
};

// ─── Course Categories (8 from ACNB.es) ───
const COURSE_CATEGORIES = [
  { id: "all", label: "Todos", icon: <BookOpen className="w-4 h-4" />, color: "#00E5FF", count: 0 },
  { id: "empresa", label: "Empresa", icon: <Briefcase className="w-4 h-4" />, color: "#D4A843", desc: "IA aplicada a gestión, RRHH, finanzas y operaciones empresariales" },
  { id: "marketing", label: "Marketing", icon: <TrendingUp className="w-4 h-4" />, color: "#FF5252", desc: "IA para marketing digital, contenido, SEO y publicidad" },
  { id: "desarrollo", label: "Desarrollo", icon: <Code className="w-4 h-4" />, color: "#00C853", desc: "Programación asistida por IA, automatización y DevOps" },
  { id: "creativo", label: "Creativo", icon: <Palette className="w-4 h-4" />, color: "#9C27B0", desc: "Diseño, imagen, video y audio generados con IA" },
  { id: "educacion", label: "Educación", icon: <BookOpen className="w-4 h-4" />, color: "#2196F3", desc: "IA aplicada a formación, e-learning y pedagogía" },
  { id: "datos", label: "Datos", icon: <Brain className="w-4 h-4" />, color: "#00BCD4", desc: "Análisis de datos, machine learning y business intelligence" },
  { id: "comunicacion", label: "Comunicación", icon: <MessageSquare className="w-4 h-4" />, color: "#FF9800", desc: "IA para redacción, traducción y comunicación corporativa" },
  { id: "etica", label: "Ética y Legal", icon: <Shield className="w-4 h-4" />, color: "#607D8B", desc: "Regulación, ética, privacidad y uso responsable de IA" },
];

// ─── Course Database (representative selection of 150 courses) ───
const COURSES = [
  // Empresa (15)
  { name: "IA Generativa desde Cero", category: "empresa", level: "Básico", hours: 7, objectives: ["Identificar 5 herramientas de IA generativa", "Crear prompts efectivos para tareas empresariales", "Evaluar riesgos y oportunidades de la IA en tu sector"], featured: true },
  { name: "IA para Directivos", category: "empresa", level: "Intermedio", hours: 7, objectives: ["Diseñar estrategia de adopción de IA", "Calcular ROI de implementación de IA", "Liderar equipos en transformación digital"] },
  { name: "Automatización de Procesos con IA", category: "empresa", level: "Intermedio", hours: 7, objectives: ["Mapear procesos automatizables", "Implementar workflows con Zapier/Make", "Medir ahorro de tiempo y costes"] },
  { name: "IA para RRHH y Selección", category: "empresa", level: "Intermedio", hours: 7, objectives: ["Redactar ofertas con IA", "Filtrar candidatos automáticamente", "Crear planes de onboarding con IA"] },
  { name: "IA para Finanzas y Contabilidad", category: "empresa", level: "Intermedio", hours: 7, objectives: ["Automatizar informes financieros", "Detectar anomalías con IA", "Generar previsiones de cashflow"] },
  { name: "IA para Atención al Cliente", category: "empresa", level: "Básico", hours: 7, objectives: ["Implementar chatbots inteligentes", "Automatizar respuestas frecuentes", "Medir satisfacción con análisis de sentimiento"] },
  { name: "IA para Logística y Supply Chain", category: "empresa", level: "Intermedio", hours: 7, objectives: ["Optimizar rutas de distribución", "Predecir demanda con ML", "Automatizar gestión de inventario"] },
  { name: "IA para Ventas B2B", category: "empresa", level: "Intermedio", hours: 7, objectives: ["Cualificar leads automáticamente", "Personalizar propuestas con IA", "Predecir cierre de oportunidades"] },
  { name: "Transformación Digital con IA", category: "empresa", level: "Avanzado", hours: 7, objectives: ["Crear roadmap de transformación", "Gestionar el cambio organizacional", "Medir madurez digital de la empresa"] },
  { name: "IA para PYMES: Guía Práctica", category: "empresa", level: "Básico", hours: 7, objectives: ["Identificar quick wins de IA", "Implementar herramientas gratuitas", "Calcular inversión vs retorno"], featured: true },
  { name: "IA para Gestión de Proyectos", category: "empresa", level: "Intermedio", hours: 7, objectives: ["Planificar proyectos con IA", "Automatizar seguimiento y reporting", "Predecir riesgos y desviaciones"] },
  { name: "IA para Compliance y Regulación", category: "empresa", level: "Avanzado", hours: 7, objectives: ["Monitorizar cumplimiento normativo", "Automatizar auditorías internas", "Gestionar riesgos regulatorios"] },
  { name: "IA para Innovación Empresarial", category: "empresa", level: "Avanzado", hours: 7, objectives: ["Generar ideas con IA", "Validar conceptos rápidamente", "Crear prototipos con herramientas IA"] },
  { name: "IA para Sostenibilidad (ESG)", category: "empresa", level: "Intermedio", hours: 7, objectives: ["Medir huella de carbono con IA", "Generar informes ESG automáticos", "Optimizar consumo energético"] },
  { name: "IA para Internacionalización", category: "empresa", level: "Intermedio", hours: 7, objectives: ["Traducir y localizar contenido", "Analizar mercados internacionales", "Adaptar estrategia por país con IA"] },

  // Marketing (15)
  { name: "Marketing Digital con IA", category: "marketing", level: "Básico", hours: 7, objectives: ["Crear contenido para redes con IA", "Optimizar campañas publicitarias", "Analizar métricas con herramientas IA"], featured: true },
  { name: "SEO con IA", category: "marketing", level: "Intermedio", hours: 7, objectives: ["Investigar keywords con IA", "Optimizar contenido para buscadores", "Analizar competencia automáticamente"] },
  { name: "Copywriting con IA", category: "marketing", level: "Intermedio", hours: 7, objectives: ["Escribir copies que conviertan", "Crear secuencias de email", "A/B testing de mensajes con IA"] },
  { name: "Social Media con IA", category: "marketing", level: "Básico", hours: 7, objectives: ["Generar calendarios de contenido", "Crear imágenes para redes", "Automatizar publicación y análisis"] },
  { name: "Email Marketing con IA", category: "marketing", level: "Intermedio", hours: 7, objectives: ["Segmentar audiencias automáticamente", "Personalizar emails a escala", "Optimizar tasas de apertura y clic"] },
  { name: "Publicidad Digital con IA", category: "marketing", level: "Avanzado", hours: 7, objectives: ["Crear anuncios con IA generativa", "Optimizar pujas automáticamente", "Predecir ROAS con machine learning"] },
  { name: "Content Marketing con IA", category: "marketing", level: "Intermedio", hours: 7, objectives: ["Generar artículos de blog", "Crear lead magnets con IA", "Distribuir contenido automáticamente"] },
  { name: "Video Marketing con IA", category: "marketing", level: "Intermedio", hours: 7, objectives: ["Crear videos con avatares IA", "Generar subtítulos automáticos", "Editar videos con herramientas IA"] },
  { name: "Branding con IA", category: "marketing", level: "Intermedio", hours: 7, objectives: ["Generar identidad visual", "Crear guidelines de marca", "Mantener consistencia con IA"] },
  { name: "E-commerce con IA", category: "marketing", level: "Intermedio", hours: 7, objectives: ["Generar descripciones de producto", "Personalizar recomendaciones", "Optimizar precios dinámicamente"] },
  { name: "Influencer Marketing con IA", category: "marketing", level: "Intermedio", hours: 7, objectives: ["Identificar influencers relevantes", "Analizar engagement real", "Medir ROI de campañas"] },
  { name: "Growth Hacking con IA", category: "marketing", level: "Avanzado", hours: 7, objectives: ["Automatizar experimentos", "Analizar funnels con IA", "Escalar tácticas ganadoras"] },
  { name: "CRM e IA", category: "marketing", level: "Intermedio", hours: 7, objectives: ["Enriquecer datos de clientes", "Predecir churn", "Automatizar nurturing"] },
  { name: "Analytics con IA", category: "marketing", level: "Avanzado", hours: 7, objectives: ["Crear dashboards inteligentes", "Detectar anomalías en datos", "Generar insights automáticos"] },
  { name: "Neuromarketing e IA", category: "marketing", level: "Avanzado", hours: 7, objectives: ["Analizar respuestas emocionales", "Optimizar UX con eye-tracking IA", "Predecir comportamiento de compra"] },

  // Desarrollo (15)
  { name: "Programación con IA (Copilot)", category: "desarrollo", level: "Básico", hours: 7, objectives: ["Configurar GitHub Copilot", "Escribir código 3x más rápido", "Revisar y depurar con IA"], featured: true },
  { name: "No-Code con IA", category: "desarrollo", level: "Básico", hours: 7, objectives: ["Crear apps sin programar", "Usar Bolt.new y v0.dev", "Desplegar proyectos funcionales"] },
  { name: "Automatización con Python e IA", category: "desarrollo", level: "Intermedio", hours: 7, objectives: ["Automatizar tareas repetitivas", "Integrar APIs de IA", "Crear scripts inteligentes"] },
  { name: "APIs de IA: Guía Práctica", category: "desarrollo", level: "Intermedio", hours: 7, objectives: ["Integrar OpenAI API", "Usar Claude y Gemini API", "Gestionar costes y rate limits"] },
  { name: "Web Development con IA", category: "desarrollo", level: "Intermedio", hours: 7, objectives: ["Generar interfaces con v0", "Crear backends con Cursor", "Desplegar apps full-stack"] },
  { name: "Chatbots Inteligentes", category: "desarrollo", level: "Intermedio", hours: 7, objectives: ["Diseñar flujos conversacionales", "Implementar RAG", "Integrar con WhatsApp/Telegram"] },
  { name: "Machine Learning Práctico", category: "desarrollo", level: "Avanzado", hours: 7, objectives: ["Entrenar modelos básicos", "Evaluar rendimiento", "Desplegar modelos en producción"] },
  { name: "RAG: Retrieval Augmented Generation", category: "desarrollo", level: "Avanzado", hours: 7, objectives: ["Implementar búsqueda semántica", "Crear bases de conocimiento", "Optimizar respuestas con contexto"] },
  { name: "Fine-tuning de Modelos", category: "desarrollo", level: "Avanzado", hours: 7, objectives: ["Preparar datasets", "Entrenar modelos personalizados", "Evaluar y desplegar"] },
  { name: "Agentes IA Autónomos", category: "desarrollo", level: "Avanzado", hours: 7, objectives: ["Diseñar agentes con herramientas", "Implementar planificación", "Gestionar memoria y estado"] },
  { name: "DevOps con IA", category: "desarrollo", level: "Intermedio", hours: 7, objectives: ["Automatizar CI/CD con IA", "Monitorizar con detección de anomalías", "Optimizar infraestructura"] },
  { name: "Testing con IA", category: "desarrollo", level: "Intermedio", hours: 7, objectives: ["Generar tests automáticamente", "Detectar bugs con IA", "Crear test suites completas"] },
  { name: "Bases de Datos e IA", category: "desarrollo", level: "Intermedio", hours: 7, objectives: ["Optimizar queries con IA", "Diseñar esquemas inteligentes", "Migrar datos automáticamente"] },
  { name: "Seguridad e IA", category: "desarrollo", level: "Avanzado", hours: 7, objectives: ["Detectar vulnerabilidades con IA", "Implementar seguridad en APIs IA", "Prevenir prompt injection"] },
  { name: "Mobile Apps con IA", category: "desarrollo", level: "Intermedio", hours: 7, objectives: ["Crear apps móviles con IA", "Integrar modelos on-device", "Optimizar rendimiento"] },

  // Creativo (15)
  { name: "Diseño Gráfico con IA", category: "creativo", level: "Básico", hours: 7, objectives: ["Generar imágenes con Midjourney", "Editar fotos con IA", "Crear identidad visual"], featured: true },
  { name: "Generación de Imágenes Avanzada", category: "creativo", level: "Intermedio", hours: 7, objectives: ["Dominar Midjourney/DALL-E/Stable Diffusion", "Crear estilos consistentes", "Técnicas de prompting visual"] },
  { name: "Video con IA", category: "creativo", level: "Intermedio", hours: 7, objectives: ["Generar videos con Runway/Sora", "Crear avatares de video", "Editar con IA automáticamente"] },
  { name: "Música con IA", category: "creativo", level: "Básico", hours: 7, objectives: ["Componer con Suno/Udio", "Crear bandas sonoras", "Producir podcasts con voz IA"] },
  { name: "Fotografía e IA", category: "creativo", level: "Intermedio", hours: 7, objectives: ["Mejorar fotos con IA", "Generar fondos y escenas", "Crear composiciones profesionales"] },
  { name: "Animación con IA", category: "creativo", level: "Intermedio", hours: 7, objectives: ["Animar imágenes estáticas", "Crear motion graphics", "Generar personajes animados"] },
  { name: "3D con IA", category: "creativo", level: "Avanzado", hours: 7, objectives: ["Generar modelos 3D desde texto", "Crear escenas virtuales", "Renderizar con IA"] },
  { name: "UX/UI Design con IA", category: "creativo", level: "Intermedio", hours: 7, objectives: ["Generar wireframes con IA", "Crear prototipos rápidos", "Testear usabilidad con IA"] },
  { name: "Ilustración Digital con IA", category: "creativo", level: "Intermedio", hours: 7, objectives: ["Crear ilustraciones con estilo propio", "Mantener consistencia visual", "Combinar técnica manual + IA"] },
  { name: "Producción Audiovisual con IA", category: "creativo", level: "Avanzado", hours: 7, objectives: ["Planificar producción con IA", "Generar storyboards", "Post-producción automatizada"] },
  { name: "Storytelling Visual con IA", category: "creativo", level: "Intermedio", hours: 7, objectives: ["Crear narrativas visuales", "Generar secuencias de imágenes", "Diseñar presentaciones impactantes"] },
  { name: "Tipografía e IA", category: "creativo", level: "Intermedio", hours: 7, objectives: ["Generar fuentes con IA", "Combinar tipografías", "Crear lettering digital"] },
  { name: "Packaging con IA", category: "creativo", level: "Intermedio", hours: 7, objectives: ["Diseñar envases con IA", "Crear mockups realistas", "Iterar diseños rápidamente"] },
  { name: "Moda e IA", category: "creativo", level: "Intermedio", hours: 7, objectives: ["Diseñar prendas con IA", "Crear lookbooks virtuales", "Predecir tendencias"] },
  { name: "Arquitectura e IA", category: "creativo", level: "Avanzado", hours: 7, objectives: ["Generar renders arquitectónicos", "Optimizar diseños con IA", "Crear visualizaciones inmersivas"] },

  // Educación (15)
  { name: "IA para Formadores", category: "educacion", level: "Básico", hours: 7, objectives: ["Crear material didáctico con IA", "Diseñar evaluaciones automáticas", "Personalizar itinerarios formativos"], featured: true },
  { name: "Gamificación con IA", category: "educacion", level: "Intermedio", hours: 7, objectives: ["Diseñar mecánicas de juego", "Implementar sistemas de puntos", "Crear experiencias de aprendizaje inmersivas"] },
  { name: "E-Learning con IA", category: "educacion", level: "Intermedio", hours: 7, objectives: ["Crear cursos online con IA", "Generar contenido multimedia", "Implementar aprendizaje adaptativo"] },
  { name: "Evaluación con IA", category: "educacion", level: "Intermedio", hours: 7, objectives: ["Crear exámenes automáticos", "Analizar resultados con IA", "Dar feedback personalizado"] },
  { name: "Tutorías Virtuales con IA", category: "educacion", level: "Intermedio", hours: 7, objectives: ["Implementar tutores IA", "Personalizar ayuda en tiempo real", "Medir progreso del alumno"] },
  { name: "Creación de Contenido Educativo", category: "educacion", level: "Básico", hours: 7, objectives: ["Generar presentaciones con IA", "Crear infografías automáticas", "Producir videos educativos"] },
  { name: "Accesibilidad Educativa con IA", category: "educacion", level: "Intermedio", hours: 7, objectives: ["Adaptar contenido para diversidad", "Generar subtítulos y traducciones", "Crear materiales inclusivos"] },
  { name: "Investigación Educativa con IA", category: "educacion", level: "Avanzado", hours: 7, objectives: ["Analizar datos educativos", "Identificar patrones de aprendizaje", "Publicar resultados con IA"] },
  { name: "Diseño Instruccional con IA", category: "educacion", level: "Intermedio", hours: 7, objectives: ["Aplicar taxonomía de Bloom con IA", "Crear objetivos medibles", "Diseñar secuencias didácticas"] },
  { name: "Microlearning con IA", category: "educacion", level: "Básico", hours: 7, objectives: ["Crear píldoras formativas", "Optimizar retención", "Distribuir contenido adaptativo"] },
  { name: "Realidad Virtual en Educación", category: "educacion", level: "Avanzado", hours: 7, objectives: ["Crear experiencias VR educativas", "Simular entornos de práctica", "Evaluar en entornos inmersivos"] },
  { name: "Competencias Digitales (DigComp)", category: "educacion", level: "Básico", hours: 7, objectives: ["Evaluar competencias digitales", "Diseñar itinerarios DigComp 2.2", "Certificar habilidades digitales"] },
  { name: "Formación Corporativa con IA", category: "educacion", level: "Intermedio", hours: 7, objectives: ["Detectar necesidades formativas", "Crear planes de formación", "Medir impacto y ROI"] },
  { name: "Coaching con IA", category: "educacion", level: "Intermedio", hours: 7, objectives: ["Implementar coaching asistido", "Crear planes de desarrollo", "Dar feedback continuo con IA"] },
  { name: "Idiomas con IA", category: "educacion", level: "Básico", hours: 7, objectives: ["Practicar conversación con IA", "Crear ejercicios personalizados", "Evaluar pronunciación automáticamente"] },

  // Datos (15)
  { name: "Análisis de Datos con IA", category: "datos", level: "Básico", hours: 7, objectives: ["Analizar datos con ChatGPT/Claude", "Crear visualizaciones automáticas", "Extraer insights de datasets"], featured: true },
  { name: "Excel/Sheets con IA", category: "datos", level: "Básico", hours: 7, objectives: ["Crear fórmulas con IA", "Automatizar informes", "Limpiar datos automáticamente"] },
  { name: "Business Intelligence con IA", category: "datos", level: "Intermedio", hours: 7, objectives: ["Crear dashboards inteligentes", "Detectar tendencias automáticamente", "Generar informes ejecutivos"] },
  { name: "Python para Datos e IA", category: "datos", level: "Intermedio", hours: 7, objectives: ["Manipular datos con Pandas", "Visualizar con Matplotlib/Plotly", "Crear modelos predictivos básicos"] },
  { name: "SQL con IA", category: "datos", level: "Básico", hours: 7, objectives: ["Escribir queries con IA", "Optimizar consultas", "Analizar bases de datos grandes"] },
  { name: "Predicción y Forecasting", category: "datos", level: "Avanzado", hours: 7, objectives: ["Crear modelos de predicción", "Validar precisión de modelos", "Implementar en producción"] },
  { name: "NLP: Procesamiento de Lenguaje", category: "datos", level: "Avanzado", hours: 7, objectives: ["Analizar sentimiento", "Clasificar textos automáticamente", "Extraer entidades y relaciones"] },
  { name: "Computer Vision Práctico", category: "datos", level: "Avanzado", hours: 7, objectives: ["Clasificar imágenes", "Detectar objetos", "Implementar OCR inteligente"] },
  { name: "Data Storytelling con IA", category: "datos", level: "Intermedio", hours: 7, objectives: ["Narrar con datos", "Crear presentaciones de datos", "Comunicar insights efectivamente"] },
  { name: "Web Scraping con IA", category: "datos", level: "Intermedio", hours: 7, objectives: ["Extraer datos de webs", "Automatizar recopilación", "Limpiar y estructurar datos"] },
  { name: "ETL con IA", category: "datos", level: "Avanzado", hours: 7, objectives: ["Diseñar pipelines de datos", "Automatizar transformaciones", "Monitorizar calidad de datos"] },
  { name: "Estadística con IA", category: "datos", level: "Intermedio", hours: 7, objectives: ["Aplicar tests estadísticos", "Interpretar resultados con IA", "Crear informes estadísticos"] },
  { name: "Big Data e IA", category: "datos", level: "Avanzado", hours: 7, objectives: ["Procesar grandes volúmenes", "Implementar streaming analytics", "Optimizar costes de procesamiento"] },
  { name: "Data Governance con IA", category: "datos", level: "Avanzado", hours: 7, objectives: ["Catalogar datos automáticamente", "Gestionar calidad de datos", "Cumplir regulaciones de datos"] },
  { name: "Visualización Avanzada con IA", category: "datos", level: "Intermedio", hours: 7, objectives: ["Crear visualizaciones interactivas", "Generar gráficos con IA", "Diseñar dashboards ejecutivos"] },

  // Comunicación (15)
  { name: "Redacción con IA", category: "comunicacion", level: "Básico", hours: 7, objectives: ["Escribir textos profesionales", "Adaptar tono y estilo", "Revisar y mejorar con IA"], featured: true },
  { name: "Traducción con IA", category: "comunicacion", level: "Básico", hours: 7, objectives: ["Traducir documentos profesionales", "Localizar contenido", "Revisar traducciones automáticas"] },
  { name: "Presentaciones con IA", category: "comunicacion", level: "Básico", hours: 7, objectives: ["Crear slides con Gamma/IA", "Diseñar presentaciones impactantes", "Generar guiones de presentación"] },
  { name: "Comunicación Interna con IA", category: "comunicacion", level: "Intermedio", hours: 7, objectives: ["Automatizar newsletters", "Crear contenido para intranet", "Medir engagement interno"] },
  { name: "Relaciones Públicas con IA", category: "comunicacion", level: "Intermedio", hours: 7, objectives: ["Redactar notas de prensa", "Monitorizar medios con IA", "Gestionar crisis comunicacional"] },
  { name: "Storytelling Corporativo", category: "comunicacion", level: "Intermedio", hours: 7, objectives: ["Crear narrativas de marca", "Generar casos de éxito", "Comunicar valores con impacto"] },
  { name: "Podcasting con IA", category: "comunicacion", level: "Básico", hours: 7, objectives: ["Producir podcasts con voz IA", "Editar audio automáticamente", "Distribuir y promocionar"] },
  { name: "Comunicación Visual con IA", category: "comunicacion", level: "Intermedio", hours: 7, objectives: ["Crear infografías con IA", "Diseñar reportes visuales", "Comunicar datos visualmente"] },
  { name: "Redes Sociales Corporativas", category: "comunicacion", level: "Básico", hours: 7, objectives: ["Gestionar perfiles corporativos", "Crear contenido de valor", "Medir impacto social"] },
  { name: "Escritura Técnica con IA", category: "comunicacion", level: "Intermedio", hours: 7, objectives: ["Documentar procesos", "Crear manuales técnicos", "Generar FAQs automáticas"] },
  { name: "Comunicación de Crisis con IA", category: "comunicacion", level: "Avanzado", hours: 7, objectives: ["Detectar crisis tempranamente", "Generar respuestas rápidas", "Monitorizar reputación online"] },
  { name: "Oratoria con IA", category: "comunicacion", level: "Intermedio", hours: 7, objectives: ["Preparar discursos con IA", "Practicar con feedback IA", "Crear presentaciones memorables"] },
  { name: "Negociación con IA", category: "comunicacion", level: "Avanzado", hours: 7, objectives: ["Preparar argumentos con IA", "Simular negociaciones", "Analizar estilos de negociación"] },
  { name: "Comunicación Intercultural", category: "comunicacion", level: "Intermedio", hours: 7, objectives: ["Adaptar mensajes por cultura", "Evitar errores culturales", "Usar IA para localización"] },
  { name: "Personal Branding con IA", category: "comunicacion", level: "Básico", hours: 7, objectives: ["Crear marca personal", "Generar contenido LinkedIn", "Optimizar perfil profesional"] },

  // Ética y Legal (15)
  { name: "Ética de la IA", category: "etica", level: "Básico", hours: 7, objectives: ["Identificar sesgos en IA", "Aplicar principios éticos", "Evaluar impacto social de la IA"], featured: true },
  { name: "Regulación Europea de IA (AI Act)", category: "etica", level: "Intermedio", hours: 7, objectives: ["Entender el AI Act de la UE", "Clasificar riesgos de sistemas IA", "Implementar compliance"] },
  { name: "Protección de Datos e IA", category: "etica", level: "Intermedio", hours: 7, objectives: ["Cumplir RGPD con IA", "Anonimizar datos personales", "Gestionar consentimiento"] },
  { name: "Propiedad Intelectual e IA", category: "etica", level: "Intermedio", hours: 7, objectives: ["Entender derechos de autor en IA", "Usar contenido generado legalmente", "Proteger creaciones propias"] },
  { name: "Uso Responsable de IA", category: "etica", level: "Básico", hours: 7, objectives: ["Verificar información generada", "Detectar deepfakes", "Usar IA con transparencia"] },
  { name: "Sesgos Algorítmicos", category: "etica", level: "Avanzado", hours: 7, objectives: ["Detectar sesgos en datos", "Mitigar discriminación algorítmica", "Auditar modelos de IA"] },
  { name: "IA y Empleo: Impacto Laboral", category: "etica", level: "Intermedio", hours: 7, objectives: ["Analizar impacto en el empleo", "Preparar equipos para el cambio", "Crear planes de reconversión"] },
  { name: "Ciberseguridad e IA", category: "etica", level: "Avanzado", hours: 7, objectives: ["Detectar amenazas con IA", "Prevenir ataques a sistemas IA", "Implementar seguridad en prompts"] },
  { name: "Gobernanza de IA Corporativa", category: "etica", level: "Avanzado", hours: 7, objectives: ["Crear comité de IA", "Definir políticas de uso", "Implementar framework de gobernanza"] },
  { name: "Transparencia y Explicabilidad", category: "etica", level: "Avanzado", hours: 7, objectives: ["Implementar IA explicable", "Comunicar decisiones de IA", "Documentar modelos y procesos"] },
  { name: "IA y Sostenibilidad", category: "etica", level: "Intermedio", hours: 7, objectives: ["Medir impacto ambiental de IA", "Optimizar eficiencia energética", "Aplicar IA a objetivos ODS"] },
  { name: "Desinformación y Deepfakes", category: "etica", level: "Básico", hours: 7, objectives: ["Detectar contenido falso", "Verificar fuentes con IA", "Proteger contra manipulación"] },
  { name: "IA en el Sector Público", category: "etica", level: "Intermedio", hours: 7, objectives: ["Implementar IA en administración", "Garantizar equidad algorítmica", "Cumplir normativa pública"] },
  { name: "Auditoría de Sistemas IA", category: "etica", level: "Avanzado", hours: 7, objectives: ["Diseñar frameworks de auditoría", "Evaluar riesgos de modelos", "Documentar hallazgos"] },
  { name: "IA y Derechos Fundamentales", category: "etica", level: "Intermedio", hours: 7, objectives: ["Evaluar impacto en derechos", "Implementar evaluaciones DPIA", "Garantizar no discriminación"] },
];

export default function CatalogoFormativo() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [activeLevel, setActiveLevel] = useState("all");
  const [expandedCourse, setExpandedCourse] = useState<string | null>(null);

  const filteredCourses = useMemo(() => {
    return COURSES.filter((course) => {
      const matchesCategory = activeCategory === "all" || course.category === activeCategory;
      const matchesLevel = activeLevel === "all" || course.level === activeLevel;
      const matchesSearch = search === "" ||
        course.name.toLowerCase().includes(search.toLowerCase()) ||
        course.objectives.some(o => o.toLowerCase().includes(search.toLowerCase()));
      return matchesCategory && matchesLevel && matchesSearch;
    });
  }, [search, activeCategory, activeLevel]);

  const categoryColor = (catId: string) => COURSE_CATEGORIES.find(c => c.id === catId)?.color || "#00E5FF";

  const levelColor = (level: string) => {
    switch (level) {
      case "Básico": return "#00C853";
      case "Intermedio": return "#D4A843";
      case "Avanzado": return "#FF5252";
      default: return "#B0B0B0";
    }
  };

  return (
    <div className="pt-14 bg-[#0A0A0A] min-h-screen">
      <BackButton variant="inline" />
      <GlobalNavBar />
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#0A0A0A]/95 backdrop-blur-md border-b border-[#00E5FF]/10">
        <div className="container flex items-center justify-between h-16">
          <a href="/" className="flex items-center gap-1">
            <ArrowLeft className="w-4 h-4 text-[#B0B0B0]" />
            
            <span className="font-display font-bold text-base text-[#00E5FF]">LINCE</span>
          </a>
          <div className="flex items-center gap-2">
            <span className="text-[#00E5FF] text-xs font-medium px-3 py-1 rounded-full bg-[#00E5FF]/10 border border-[#00E5FF]/30 flex items-center gap-1.5">
              <BookOpen className="w-3 h-3" /> {COURSES.length} cursos
            </span>
            <UserNavBadge variant="compact" />
          </div>
        </div>
      </header>

      <main className="pt-24 pb-16">
        <div className="container max-w-6xl">
          {/* Hero with Avatar Guide */}
          <div className="text-center mb-10">
            <div className="flex justify-center mb-4">
              <div className="relative">
                <img
                  src={GUIDE_AVATAR.img}
                  alt={GUIDE_AVATAR.name}
                  className="w-20 h-20 rounded-full object-cover border-2 border-[#D4A843]"
                />
                <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#D4A843] flex items-center justify-center">
                  <BookOpen className="w-3 h-3 text-[#0A0A0A]" />
                </div>
              </div>
            </div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#00E5FF]/30 bg-[#00E5FF]/5 mb-4">
              <BookOpen className="w-4 h-4 text-[#00E5FF]" />
              <span className="text-[#00E5FF] text-sm font-medium">Formación Profesional en IA</span>
            </div>
            <h1 className="font-display font-bold text-4xl sm:text-5xl text-white mb-4">
              Catálogo <span className="text-[#00E5FF]">Formativo</span>
            </h1>
            <p className="text-[#B0B0B0] text-lg max-w-2xl mx-auto">
              <span className="text-[#00E5FF] font-bold">{COURSES.length} cursos profesionales</span> de{" "}
              <span className="text-[#D4A843] font-bold">7 horas</span> cada uno, organizados en{" "}
              <span className="text-[#00E5FF] font-bold">{COURSE_CATEGORIES.length - 1} categorías</span>.
              Cada curso tiene objetivos claros y medibles alineados con DigComp 2.2.
            </p>
            {/* Avatar speech bubble */}
            <div className="mt-4 inline-flex items-center gap-3 px-5 py-3 rounded-2xl bg-white/[0.03] border border-[#D4A843]/15">
              <img src={GUIDE_AVATAR.expr?.feliz || GUIDE_AVATAR.img} alt="" className="w-10 h-10 rounded-full object-cover" />
              <p className="text-[#B0B0B0] text-sm italic text-left">
                "Soy <span className="text-[#D4A843] font-bold">Duolina Abuela</span>, la sabia de la familia.
                Aquí encontrarás todos los cursos que necesitas para dominar la IA."
              </p>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-4 mt-6">
              <div className="px-4 py-2 bg-[#00E5FF]/10 border border-[#00E5FF]/30 rounded-lg">
                <span className="text-[#00E5FF] font-display font-bold text-xl">{COURSES.length}</span>
                <span className="text-[#B0B0B0] text-xs ml-2">Cursos</span>
              </div>
              <div className="px-4 py-2 bg-[#D4A843]/10 border border-[#D4A843]/30 rounded-lg">
                <span className="text-[#D4A843] font-display font-bold text-xl">7h</span>
                <span className="text-[#B0B0B0] text-xs ml-2">Por curso</span>
              </div>
              <div className="px-4 py-2 bg-[#00C853]/10 border border-[#00C853]/30 rounded-lg">
                <span className="text-[#00C853] font-display font-bold text-xl">3</span>
                <span className="text-[#B0B0B0] text-xs ml-2">Objetivos/curso</span>
              </div>
              <div className="px-4 py-2 bg-[#9C27B0]/10 border border-[#9C27B0]/30 rounded-lg">
                <span className="text-[#9C27B0] font-display font-bold text-xl">{COURSE_CATEGORIES.length - 1}</span>
                <span className="text-[#B0B0B0] text-xs ml-2">Categorías</span>
              </div>
            </div>
          </div>

          {/* ═══ PRESENCIAL COURSES + SPECIALIST WARNING ═══ */}
          <div className="mb-10 p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-[#D4A843]/[0.08] to-[#00E5FF]/[0.04] border border-[#D4A843]/20">
            <div className="flex flex-col sm:flex-row items-start gap-6">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 rounded-2xl bg-[#D4A843]/10 border border-[#D4A843]/30 flex items-center justify-center">
                  <Users className="w-8 h-8 text-[#D4A843]" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="font-display font-bold text-xl text-white mb-2 flex items-center gap-2">
                  <span className="text-[#D4A843]">Cursos Presenciales</span> con Agenda
                </h3>
                <p className="text-[#B0B0B0] text-sm leading-relaxed mb-3">
                  Impartimos cursos presenciales con agenda personalizada. Puedes elegir cualquier curso del catálogo o solicitar un curso a medida según las necesidades de tu empresa u organización. Nuestros formadores certificados se desplazan a tu ubicación.
                </p>
                {/* Specialist Warning */}
                <div className="mb-4 p-3 rounded-xl bg-amber-500/[0.08] border border-amber-500/20 flex items-start gap-2">
                  <Shield className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                  <p className="text-amber-200/80 text-xs leading-relaxed">
                    <span className="font-bold text-amber-400">Importante:</span> Todo curso debe ser impartido por un especialista certificado. La plataforma y sus contenidos sirven como guía de apoyo, pero <span className="font-bold">no sustituyen la formación presencial con un formador cualificado</span>. El material no es 100% fiable sin la supervisión de un profesional.
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                  <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                    <p className="text-[10px] font-bold text-[#D4A843] mb-1 uppercase tracking-wider">Formación y Cursos</p>
                    <a href="mailto:formacionia@acnb.es" className="text-white text-sm font-bold hover:text-[#00E5FF] transition-colors">
                      formacionia@acnb.es
                    </a>
                    <p className="text-[#B0B0B0] text-[10px] mt-1">Solicita cursos ya creados o diseña tu curso a medida</p>
                  </div>
                  <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                    <p className="text-[10px] font-bold text-[#00E5FF] mb-1 uppercase tracking-wider">Comunicaciones Generales</p>
                    <a href="mailto:info@acnb.es" className="text-white text-sm font-bold hover:text-[#D4A843] transition-colors">
                      info@acnb.es
                    </a>
                    <p className="text-[#B0B0B0] text-[10px] mt-1">Consultas, colaboraciones y propuestas</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="text-[10px] font-bold px-3 py-1.5 rounded-full bg-[#00C853]/10 border border-[#00C853]/30 text-[#00C853]">Cursos del catálogo</span>
                  <span className="text-[10px] font-bold px-3 py-1.5 rounded-full bg-[#D4A843]/10 border border-[#D4A843]/30 text-[#D4A843]">Cursos a medida</span>
                  <span className="text-[10px] font-bold px-3 py-1.5 rounded-full bg-[#9C27B0]/10 border border-[#9C27B0]/30 text-[#9C27B0]">In-company</span>
                  <span className="text-[10px] font-bold px-3 py-1.5 rounded-full bg-[#00E5FF]/10 border border-[#00E5FF]/30 text-[#00E5FF]">Agenda flexible</span>
                </div>
              </div>
            </div>
          </div>

          {/* Search */}
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#B0B0B0]/40" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar curso por nombre u objetivo..."
              className="w-full pl-12 pr-4 py-3 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white placeholder:text-[#B0B0B0]/40 focus:border-[#00E5FF]/50 focus:outline-none transition-colors"
            />
          </div>

          {/* Filters */}
          <div className="space-y-3 mb-8">
            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              {COURSE_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${
                    activeCategory === cat.id
                      ? "text-[#0A0A0A] border-transparent"
                      : "bg-white/[0.02] border-white/[0.06] text-[#B0B0B0] hover:border-white/[0.15] hover:text-white"
                  }`}
                  style={activeCategory === cat.id ? { backgroundColor: cat.color } : {}}
                >
                  {cat.icon} {cat.label}
                  {cat.id !== "all" && (
                    <span className="text-[10px] opacity-70">({COURSES.filter(c => c.category === cat.id).length})</span>
                  )}
                </button>
              ))}
            </div>

            {/* Level Filter */}
            <div className="flex gap-2">
              {["all", "Básico", "Intermedio", "Avanzado"].map((level) => (
                <button
                  key={level}
                  onClick={() => setActiveLevel(level)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${
                    activeLevel === level
                      ? "text-[#0A0A0A] border-transparent"
                      : "bg-white/[0.02] border-white/[0.06] text-[#B0B0B0] hover:border-white/[0.15] hover:text-white"
                  }`}
                  style={activeLevel === level ? { backgroundColor: level === "all" ? "#00E5FF" : levelColor(level) } : {}}
                >
                  {level === "all" ? "Todos los niveles" : level}
                </button>
              ))}
            </div>
          </div>

          {/* Results count */}
          <div className="flex items-center justify-between mb-4">
            <span className="text-[#B0B0B0] text-sm">{filteredCourses.length} cursos encontrados</span>
          </div>

          {/* Course List */}
          {filteredCourses.length === 0 ? (
            <div className="p-12 text-center bg-white/[0.02] border border-white/[0.06] rounded-xl">
              <Search className="w-12 h-12 text-[#B0B0B0]/20 mx-auto mb-3" />
              <p className="text-[#B0B0B0]/50 text-sm">No se encontraron cursos con ese criterio</p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredCourses.map((course, i) => {
                const isExpanded = expandedCourse === course.name;
                return (
                  <div key={i} className={`border rounded-xl transition-all ${isExpanded ? "border-white/[0.15] bg-white/[0.03]" : "border-white/[0.06] bg-white/[0.01] hover:border-white/[0.1]"}`}>
                    <button
                      onClick={() => setExpandedCourse(isExpanded ? null : course.name)}
                      className="w-full flex items-center justify-between p-4 text-left"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {course.featured && <Star className="w-4 h-4 text-[#D4A843] flex-shrink-0" />}
                        <h4 className="font-display font-bold text-white text-sm truncate">{course.name}</h4>
                        <span className="text-[9px] font-bold px-2 py-0.5 rounded-full flex-shrink-0" style={{ backgroundColor: `${categoryColor(course.category)}15`, color: categoryColor(course.category) }}>
                          {COURSE_CATEGORIES.find(c => c.id === course.category)?.label}
                        </span>
                        <span className="text-[9px] font-bold px-2 py-0.5 rounded-full flex-shrink-0" style={{ backgroundColor: `${levelColor(course.level)}15`, color: levelColor(course.level) }}>
                          {course.level}
                        </span>
                        <span className="text-[#B0B0B0]/50 text-[10px] flex items-center gap-1 flex-shrink-0">
                          <Clock className="w-3 h-3" /> {course.hours}h
                        </span>
                      </div>
                      <ChevronDown className={`w-4 h-4 text-[#B0B0B0] transition-transform flex-shrink-0 ml-2 ${isExpanded ? "rotate-180" : ""}`} />
                    </button>

                    {isExpanded && (
                      <div className="px-4 pb-4 space-y-3">
                        <div>
                          <p className="text-[#00E5FF] text-[11px] font-bold mb-2 flex items-center gap-1.5">
                            <Target className="w-3.5 h-3.5" /> Objetivos del curso (7 horas)
                          </p>
                          <div className="space-y-1.5">
                            {course.objectives.map((obj, j) => (
                              <div key={j} className="flex items-start gap-2">
                                <CheckCircle2 className="w-3.5 h-3.5 text-[#00C853] mt-0.5 flex-shrink-0" />
                                <span className="text-[#B0B0B0] text-xs">{obj}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="flex items-center gap-4 pt-2 border-t border-white/[0.06]">
                          <span className="text-[#B0B0B0]/50 text-[10px] flex items-center gap-1">
                            <Clock className="w-3 h-3" /> Duración: {course.hours} horas
                          </span>
                          <span className="text-[#B0B0B0]/50 text-[10px] flex items-center gap-1">
                            <Users className="w-3 h-3" /> Presencial + Digital
                          </span>
                          <span className="text-[#B0B0B0]/50 text-[10px] flex items-center gap-1">
                            <Shield className="w-3 h-3" /> DigComp 2.2
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}



          {/* Footer */}
          <div className="mt-12 text-center">
            <p className="text-[#B0B0B0]/40 text-xs mb-4">
              Todos los cursos siguen el formato de 7 horas con objetivos medibles. Alineados con el marco DigComp 2.2.
            </p>
            <div className="inline-flex gap-4">
              <a href="/prompt-profesional" className="inline-flex items-center gap-2 px-6 py-3 bg-[#D4A843]/10 border border-[#D4A843]/30 text-[#D4A843] rounded-xl font-display font-bold text-sm hover:bg-[#D4A843]/20 transition-colors">
                <Brain className="w-4 h-4" /> Prompt Profesional
              </a>
              <a href="/arsenal-ia" className="inline-flex items-center gap-2 px-6 py-3 bg-[#00E5FF]/10 border border-[#00E5FF]/30 text-[#00E5FF] rounded-xl font-display font-bold text-sm hover:bg-[#00E5FF]/20 transition-colors">
                <Zap className="w-4 h-4" /> Herramientas IA
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

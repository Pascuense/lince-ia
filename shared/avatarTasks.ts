/**
 * LINCE V3 — TAREAS PREDEFINIDAS CON DERIVACIÓN
 * Formularios ejecutables para avatares clave con sistema de derivación inteligente.
 */

export interface TaskField {
  id: string;
  label: string;
  placeholder?: string;
  type: "text" | "textarea" | "select" | "multiselect" | "range";
  options?: string[];
  min?: number;
  max?: number;
  required?: boolean;
}

export interface TaskDerivation {
  trigger: string;
  avatarKey: string;
  avatarName: string;
  reason: string;
}

export interface PredefinedTask {
  id: string;
  name: string;
  icon: string;
  description: string;
  fields: TaskField[];
  derivations: TaskDerivation[];
  buildPrompt: (data: Record<string, string>) => string;
}

export interface AvatarTaskSet {
  avatarKey: string;
  tasks: PredefinedTask[];
  quickQuestions: { text: string; hint?: string }[];
}

// ═══════════════════════════════════════════════════
// YAYALÍN — Estrategia Empresarial
// ═══════════════════════════════════════════════════
const YAYALIN_TASKS: AvatarTaskSet = {
  avatarKey: "YAYALIN",
  tasks: [
    {
      id: "plan_estrategico_90d",
      name: "Plan Estratégico 90 Días con IA",
      icon: "📊",
      description: "Crea un plan accionable de 12 semanas para implementar IA en tu negocio",
      fields: [
        { id: "negocio", label: "Tu negocio", placeholder: "Qué haces, sector, tamaño equipo", type: "text", required: true },
        { id: "objetivo", label: "Objetivo principal", placeholder: "Aumentar ventas 30%, reducir costes 20%...", type: "text", required: true },
        { id: "recursos", label: "Recursos disponibles", placeholder: "Presupuesto, equipo, tecnología actual", type: "textarea" },
        { id: "areas_criticas", label: "Áreas críticas", type: "multiselect", options: ["Marketing", "Ventas", "Operaciones", "Datos", "Producto", "RRHH", "Finanzas"] },
      ],
      derivations: [
        { trigger: "automatización", avatarKey: "CRISTALIN", avatarName: "CRISTALÍN", reason: "Workflows complejos" },
        { trigger: "marketing", avatarKey: "SONALIN", avatarName: "SONALÍN", reason: "Estrategia GTM" },
        { trigger: "datos", avatarKey: "TRAPZOLIN", avatarName: "TRAPZOLÍN", reason: "Analytics profundo" },
        { trigger: "ML", avatarKey: "PAPALIN", avatarName: "PAPALÍN", reason: "Modelos predictivos" },
      ],
      buildPrompt: (data) => `Analiza y crea plan estratégico 90 días con IA:

NEGOCIO: ${data.negocio || "No especificado"}
OBJETIVO: ${data.objetivo || "No especificado"}
RECURSOS: ${data.recursos || "No especificados"}
ÁREAS CRÍTICAS: ${data.areas_criticas || "No especificadas"}

Entrega:
1. Diagnóstico actual (3-5 puntos críticos)
2. Oportunidades IA por área
3. Plan semanal (12 semanas, hitos concretos)
4. Herramientas IA específicas (nombre + URL)
5. KPIs semanales medibles
6. Riesgos y mitigaciones
7. Especialistas LINCE recomendados para cada área`,
    },
    {
      id: "automatizar_proceso",
      name: "Automatizar un Proceso",
      icon: "⚡",
      description: "Analiza y automatiza un proceso repetitivo de tu negocio",
      fields: [
        { id: "proceso", label: "Proceso a automatizar", placeholder: "Descripción completa del proceso actual", type: "textarea", required: true },
        { id: "complejidad", label: "Complejidad percibida (1-10)", type: "range", min: 1, max: 10 },
        { id: "integraciones", label: "Apps/sistemas involucrados", placeholder: "Gmail, Notion, Salesforce, Excel...", type: "text" },
      ],
      derivations: [
        { trigger: "complejidad >= 7", avatarKey: "CRISTALIN", avatarName: "CRISTALÍN", reason: "Automatización compleja" },
      ],
      buildPrompt: (data) => `Analiza automatización de proceso:

PROCESO: ${data.proceso || "No especificado"}
COMPLEJIDAD: ${data.complejidad || "5"}/10
INTEGRACIONES: ${data.integraciones || "No especificadas"}

Entrega:
1. Viabilidad automatización (SÍ/NO + razón)
2. Herramienta recomendada (Zapier/Make/n8n + por qué)
3. Pasos configuración (numerados)
4. Tiempo ahorro estimado (horas/mes)
5. Si complejidad >= 7, derivar a CRISTALÍN`,
    },
    {
      id: "presentacion_ejecutiva",
      name: "Presentación Ejecutiva con IA",
      icon: "🎯",
      description: "Genera estructura y contenido para una presentación de impacto",
      fields: [
        { id: "tema", label: "Tema", placeholder: "Resultados Q4, propuesta inversión...", type: "text", required: true },
        { id: "audiencia", label: "Audiencia", type: "select", options: ["Inversores", "Equipo", "Clientes", "Junta directiva"] },
        { id: "complejidad_visual", label: "Complejidad visual", type: "select", options: ["Simple", "Media", "Alta"] },
      ],
      derivations: [
        { trigger: "diseño avanzado", avatarKey: "CHAVALINA", avatarName: "CHAVALINA", reason: "Diseño visual complejo" },
        { trigger: "datos complejos", avatarKey: "TRAPZOLIN", avatarName: "TRAPZOLÍN", reason: "Visualización datos" },
      ],
      buildPrompt: (data) => `Crea presentación ejecutiva:

TEMA: ${data.tema || "No especificado"}
AUDIENCIA: ${data.audiencia || "General"}
COMPLEJIDAD VISUAL: ${data.complejidad_visual || "Media"}

Entrega:
1. Estructura slides (título cada slide)
2. Mensajes clave por slide
3. Datos/gráficos a incluir
4. CTA final
5. Prompt exacto para Gamma AI
6. Si diseño complejo → sugerir CHAVALINA`,
    },
  ],
  quickQuestions: [
    { text: "¿Qué procesos automatizar HOY?", hint: "Puede derivar a CRISTALÍN" },
    { text: "Plan estratégico 90 días IA", hint: "Multi-derivación posible" },
    { text: "Herramientas IA con impacto inmediato", hint: "Derivación por herramienta" },
  ],
};

// ═══════════════════════════════════════════════════
// PAPALÍN — Machine Learning / Deep Learning
// ═══════════════════════════════════════════════════
const PAPALIN_TASKS: AvatarTaskSet = {
  avatarKey: "PAPALIN",
  tasks: [
    {
      id: "modelo_ml",
      name: "Diseñar Modelo ML para tu Negocio",
      icon: "🧠",
      description: "Diseña un modelo de machine learning adaptado a tu caso de uso",
      fields: [
        { id: "problema", label: "Problema a resolver", placeholder: "Predecir churn, clasificar tickets, detectar fraude...", type: "textarea", required: true },
        { id: "datos_disponibles", label: "Datos disponibles", placeholder: "CSV ventas, logs usuarios, imágenes productos...", type: "textarea" },
        { id: "nivel_tecnico", label: "Tu nivel técnico", type: "select", options: ["Principiante", "Intermedio", "Avanzado"] },
      ],
      derivations: [
        { trigger: "ética datos", avatarKey: "MAMALINA", avatarName: "MAMALINA", reason: "Sesgo y ética en datos" },
        { trigger: "visualización", avatarKey: "TRAPZOLIN", avatarName: "TRAPZOLÍN", reason: "Dashboard de métricas" },
      ],
      buildPrompt: (data) => `Diseña modelo ML:

PROBLEMA: ${data.problema || "No especificado"}
DATOS: ${data.datos_disponibles || "No especificados"}
NIVEL: ${data.nivel_tecnico || "Intermedio"}

Entrega:
1. Tipo de modelo recomendado (clasificación/regresión/clustering)
2. Pipeline completo (datos → preprocesamiento → entrenamiento → evaluación)
3. Código Python funcional con scikit-learn/TensorFlow
4. Métricas de evaluación relevantes
5. Consideraciones éticas → derivar a MAMALINA si hay sesgo`,
    },
    {
      id: "tutorial_python_ia",
      name: "Tutorial Python + IA Paso a Paso",
      icon: "🐍",
      description: "Aprende a implementar IA con Python desde cero",
      fields: [
        { id: "objetivo_aprendizaje", label: "¿Qué quieres aprender?", placeholder: "Análisis sentimiento, chatbot, predicción ventas...", type: "text", required: true },
        { id: "experiencia_python", label: "Experiencia con Python", type: "select", options: ["Ninguna", "Básica", "Intermedia", "Avanzada"] },
      ],
      derivations: [],
      buildPrompt: (data) => `Tutorial Python + IA:

OBJETIVO: ${data.objetivo_aprendizaje || "No especificado"}
EXPERIENCIA: ${data.experiencia_python || "Básica"}

Entrega tutorial paso a paso:
1. Conceptos clave (explicados simple)
2. Código completo comentado
3. Librerías necesarias (pip install)
4. Resultado esperado
5. Ejercicio práctico para consolidar`,
    },
  ],
  quickQuestions: [
    { text: "¿Qué modelo ML necesito para mi caso?", hint: "Análisis personalizado" },
    { text: "Python para IA desde cero", hint: "Tutorial paso a paso" },
    { text: "¿TensorFlow o PyTorch? ¿Cuál elegir?", hint: "Comparativa técnica" },
  ],
};

// ═══════════════════════════════════════════════════
// MAMALINA — Ética IA
// ═══════════════════════════════════════════════════
const MAMALINA_TASKS: AvatarTaskSet = {
  avatarKey: "MAMALINA",
  tasks: [
    {
      id: "auditoria_etica",
      name: "Auditoría Ética de tu Proyecto IA",
      icon: "⚖️",
      description: "Evalúa los riesgos éticos de tu proyecto de inteligencia artificial",
      fields: [
        { id: "proyecto", label: "Describe tu proyecto IA", placeholder: "Qué hace, qué datos usa, a quién afecta...", type: "textarea", required: true },
        { id: "sector", label: "Sector", type: "select", options: ["Salud", "Finanzas", "Educación", "RRHH", "Marketing", "Gobierno", "Otro"] },
        { id: "datos_sensibles", label: "¿Usa datos sensibles?", type: "select", options: ["Sí, datos personales", "Sí, datos médicos", "Sí, datos financieros", "No"] },
      ],
      derivations: [
        { trigger: "RGPD", avatarKey: "DATOLIN", avatarName: "DATOLÍN", reason: "Cumplimiento RGPD específico" },
        { trigger: "legal", avatarKey: "ABOGALIN", avatarName: "ABOGALÍN", reason: "Implicaciones legales" },
      ],
      buildPrompt: (data) => `Auditoría ética proyecto IA:

PROYECTO: ${data.proyecto || "No especificado"}
SECTOR: ${data.sector || "General"}
DATOS SENSIBLES: ${data.datos_sensibles || "No especificado"}

Entrega:
1. Análisis de riesgos éticos (sesgos, privacidad, transparencia)
2. Checklist EU AI Act aplicable
3. Recomendaciones de mitigación
4. Si RGPD → derivar a DATOLÍN
5. Si implicaciones legales → derivar a ABOGALÍN
6. Plan de ética continua`,
    },
  ],
  quickQuestions: [
    { text: "¿Mi proyecto IA tiene sesgos?", hint: "Análisis de fairness" },
    { text: "¿Cómo cumplir el EU AI Act?", hint: "Regulación europea" },
    { text: "Checklist ética antes de lanzar IA", hint: "Pre-launch review" },
  ],
};

// ═══════════════════════════════════════════════════
// SABELÍN — CEO / Visión General
// ═══════════════════════════════════════════════════
const SABELIN_TASKS: AvatarTaskSet = {
  avatarKey: "SABELIN",
  tasks: [
    {
      id: "roadmap_ia",
      name: "Roadmap IA para tu Empresa",
      icon: "🗺️",
      description: "Diseña la hoja de ruta de adopción de IA para tu organización",
      fields: [
        { id: "empresa", label: "Tu empresa", placeholder: "Sector, tamaño, madurez digital...", type: "textarea", required: true },
        { id: "presupuesto", label: "Presupuesto anual IA", type: "select", options: ["< 5K€", "5K-20K€", "20K-100K€", "> 100K€"] },
        { id: "prioridad", label: "Prioridad", type: "select", options: ["Reducir costes", "Aumentar ingresos", "Mejorar experiencia cliente", "Innovar producto"] },
      ],
      derivations: [
        { trigger: "estrategia", avatarKey: "YAYALIN", avatarName: "YAYALÍN", reason: "Plan táctico detallado" },
        { trigger: "emprendimiento", avatarKey: "EMPRENDALIN", avatarName: "EMPRENDALÍN", reason: "Startup/innovación" },
      ],
      buildPrompt: (data) => `Roadmap IA empresarial:

EMPRESA: ${data.empresa || "No especificado"}
PRESUPUESTO: ${data.presupuesto || "No especificado"}
PRIORIDAD: ${data.prioridad || "General"}

Entrega visión CEO:
1. Estado actual de madurez IA
2. Oportunidades quick-win (30 días)
3. Roadmap 6-12 meses
4. Stack tecnológico recomendado
5. Equipo necesario
6. Derivaciones a especialistas LINCE por área`,
    },
  ],
  quickQuestions: [
    { text: "¿Por dónde empiezo con IA en mi empresa?", hint: "Visión general" },
    { text: "¿Qué avatar de LINCE necesito?", hint: "Derivación inteligente" },
    { text: "Tendencias IA 2025-2026", hint: "Visión estratégica" },
  ],
};

// ═══════════════════════════════════════════════════
// YAYALINA — Mayores / Tecnología Accesible
// ═══════════════════════════════════════════════════
const YAYALINA_TASKS: AvatarTaskSet = {
  avatarKey: "YAYALINA",
  tasks: [
    {
      id: "primer_paso_ia",
      name: "Mi Primer Paso con IA",
      icon: "🌟",
      description: "Aprende a usar IA desde cero, sin tecnicismos, a tu ritmo",
      fields: [
        { id: "que_quieres", label: "¿Qué te gustaría hacer?", placeholder: "Escribir cartas, organizar fotos, hablar con familia...", type: "text", required: true },
        { id: "dispositivo", label: "¿Qué dispositivo usas?", type: "select", options: ["Móvil Android", "iPhone", "Tablet", "Ordenador", "No estoy seguro/a"] },
      ],
      derivations: [
        { trigger: "salud", avatarKey: "DOCTOLIN", avatarName: "DOCTOLÍN", reason: "Consultas de salud" },
      ],
      buildPrompt: (data) => `Guía primer paso con IA para persona mayor:

QUIERE: ${data.que_quieres || "No especificado"}
DISPOSITIVO: ${data.dispositivo || "No especificado"}

IMPORTANTE: Lenguaje MUY sencillo, paso a paso con capturas mentales, sin tecnicismos.
Entrega:
1. Qué app descargar (nombre exacto + dónde buscarla)
2. Cómo abrirla paso a paso
3. Qué escribir exactamente (ejemplo literal)
4. Qué esperar como resultado
5. Consejo de seguridad sencillo`,
    },
  ],
  quickQuestions: [
    { text: "¿Cómo uso ChatGPT en mi móvil?", hint: "Paso a paso sencillo" },
    { text: "¿La IA es segura para mí?", hint: "Seguridad explicada fácil" },
    { text: "Quiero escribir una carta bonita", hint: "Tarea práctica" },
  ],
};

// ═══════════════════════════════════════════════════
// ABOGALÍN — Legal IA (con disclaimer obligatorio)
// ═══════════════════════════════════════════════════
const ABOGALIN_TASKS: AvatarTaskSet = {
  avatarKey: "ABOGALIN",
  tasks: [
    {
      id: "consulta_legal_ia",
      name: "Consulta Legal sobre IA",
      icon: "⚖️",
      description: "Orientación general sobre aspectos legales de la IA (no sustituye asesoría legal)",
      fields: [
        { id: "consulta", label: "Tu consulta legal", placeholder: "Derechos de autor IA, contratos, RGPD...", type: "textarea", required: true },
        { id: "jurisdiccion", label: "Jurisdicción", type: "select", options: ["España", "UE", "Latinoamérica", "Internacional", "No sé"] },
      ],
      derivations: [
        { trigger: "RGPD", avatarKey: "DATOLIN", avatarName: "DATOLÍN", reason: "Protección de datos específica" },
        { trigger: "ética", avatarKey: "MAMALINA", avatarName: "MAMALINA", reason: "Implicaciones éticas" },
      ],
      buildPrompt: (data) => `Consulta legal IA (orientación general):

CONSULTA: ${data.consulta || "No especificada"}
JURISDICCIÓN: ${data.jurisdiccion || "No especificada"}

IMPORTANTE: Incluir SIEMPRE disclaimer legal al final.
Entrega:
1. Marco legal aplicable
2. Análisis de la situación
3. Recomendaciones generales
4. Fuentes legales oficiales
5. Si RGPD → derivar a DATOLÍN
6. DISCLAIMER: "Esta orientación NO sustituye asesoría legal profesional. Consulta con un abogado colegiado."`,
    },
  ],
  quickQuestions: [
    { text: "¿Puedo usar imágenes generadas por IA comercialmente?", hint: "Derechos de autor" },
    { text: "¿Qué dice el EU AI Act?", hint: "Regulación europea" },
    { text: "Contratos con proveedores de IA", hint: "Cláusulas clave" },
  ],
};

// ═══════════════════════════════════════════════════
// DOCTOLÍN — Salud IA (con disclaimer obligatorio)
// ═══════════════════════════════════════════════════
const DOCTOLIN_TASKS: AvatarTaskSet = {
  avatarKey: "DOCTOLIN",
  tasks: [
    {
      id: "ia_salud",
      name: "IA Aplicada a Salud",
      icon: "🏥",
      description: "Aprende cómo la IA está transformando la salud (no sustituye consulta médica)",
      fields: [
        { id: "interes", label: "¿Qué te interesa?", placeholder: "Diagnóstico asistido, wearables, telemedicina...", type: "text", required: true },
        { id: "perfil", label: "Tu perfil", type: "select", options: ["Profesional salud", "Estudiante", "Paciente/Familiar", "Emprendedor healthtech"] },
      ],
      derivations: [
        { trigger: "ética médica", avatarKey: "MAMALINA", avatarName: "MAMALINA", reason: "Ética en IA médica" },
        { trigger: "datos pacientes", avatarKey: "DATOLIN", avatarName: "DATOLÍN", reason: "RGPD datos médicos" },
      ],
      buildPrompt: (data) => `IA aplicada a salud:

INTERÉS: ${data.interes || "No especificado"}
PERFIL: ${data.perfil || "General"}

IMPORTANTE: Incluir SIEMPRE disclaimer médico al final.
Entrega:
1. Estado actual de la IA en esa área de salud
2. Herramientas/proyectos reales (con fuentes)
3. Limitaciones actuales
4. Consideraciones éticas
5. DISCLAIMER: "Esta información es EDUCATIVA. NO sustituye diagnóstico ni tratamiento médico. Consulta SIEMPRE con un profesional sanitario."`,
    },
  ],
  quickQuestions: [
    { text: "¿Cómo usa la IA un hospital hoy?", hint: "Casos reales" },
    { text: "Wearables con IA para salud", hint: "Dispositivos actuales" },
    { text: "IA en diagnóstico por imagen", hint: "Radiología asistida" },
  ],
};

// ═══════════════════════════════════════════════════
// EMPRENDALÍN — Startups / Emprendimiento
// ═══════════════════════════════════════════════════
const EMPRENDALIN_TASKS: AvatarTaskSet = {
  avatarKey: "EMPRENDALIN",
  tasks: [
    {
      id: "validar_idea",
      name: "Validar tu Idea de Negocio con IA",
      icon: "🚀",
      description: "Valida tu idea de startup usando herramientas de IA en 24 horas",
      fields: [
        { id: "idea", label: "Tu idea", placeholder: "Describe tu idea de negocio en 2-3 frases", type: "textarea", required: true },
        { id: "mercado", label: "Mercado objetivo", placeholder: "¿A quién va dirigido?", type: "text" },
        { id: "competencia", label: "Competencia conocida", placeholder: "¿Quién hace algo similar?", type: "text" },
      ],
      derivations: [
        { trigger: "marketing", avatarKey: "SONALIN", avatarName: "SONALÍN", reason: "Go-to-market strategy" },
        { trigger: "prototipo", avatarKey: "VILLALIN", avatarName: "VILLALÍN", reason: "MVP rápido" },
        { trigger: "legal", avatarKey: "ABOGALIN", avatarName: "ABOGALÍN", reason: "Estructura legal" },
      ],
      buildPrompt: (data) => `Validación idea startup con IA:

IDEA: ${data.idea || "No especificada"}
MERCADO: ${data.mercado || "No especificado"}
COMPETENCIA: ${data.competencia || "No especificada"}

Entrega en 24h:
1. Análisis de viabilidad (1-10)
2. Mercado potencial (TAM/SAM/SOM)
3. Competencia y diferenciación
4. MVP mínimo (qué construir primero)
5. Herramientas IA para validar
6. Derivaciones: marketing → SONALÍN, prototipo → VILLALÍN, legal → ABOGALÍN`,
    },
  ],
  quickQuestions: [
    { text: "¿Mi idea de negocio es viable?", hint: "Validación rápida" },
    { text: "¿Cómo crear un MVP en un fin de semana?", hint: "Puede derivar a VILLALÍN" },
    { text: "Pitch deck con IA", hint: "Presentación inversores" },
  ],
};

// ═══════════════════════════════════════════════════
// EXPORT: Mapa completo de tareas por avatar
// ═══════════════════════════════════════════════════
export const AVATAR_TASKS: Record<string, AvatarTaskSet> = {
  YAYALIN: YAYALIN_TASKS,
  PAPALIN: PAPALIN_TASKS,
  MAMALINA: MAMALINA_TASKS,
  SABELIN: SABELIN_TASKS,
  YAYALINA: YAYALINA_TASKS,
  ABOGALIN: ABOGALIN_TASKS,
  DOCTOLIN: DOCTOLIN_TASKS,
  EMPRENDALIN: EMPRENDALIN_TASKS,
};

export function getAvatarTasks(avatarKey: string): AvatarTaskSet | undefined {
  return AVATAR_TASKS[avatarKey];
}

export function hasAvatarTasks(avatarKey: string): boolean {
  return avatarKey in AVATAR_TASKS;
}

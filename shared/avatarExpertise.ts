/**
 * LINCE V3 — SISTEMA DE EXPERTISE SCORES Y DERIVACIÓN INTELIGENTE
 * 65 avatares interconectados con threshold 70%
 * Metodología Claude Professional Framework
 * Actualizado: Febrero 2026
 */

export interface ExpertiseScores {
  [domain: string]: number; // 0-100
}

export interface DerivationRule {
  trigger: string;
  targetAvatar: string;
  reason: string;
}

export interface AvatarExpertise {
  key: string;
  scores: ExpertiseScores;
  derivations: DerivationRule[];
  disclaimer?: string;
}

// ═══════════════════════════════════════════════════════════════
// GRUPO 1: FAMILIA ORIGINAL (10 AVATARES)
// ═══════════════════════════════════════════════════════════════

export const AVATAR_EXPERTISE: Record<string, AvatarExpertise> = {
  // ─── FAMILIA ORIGINAL ───
  SABELIN: {
    key: "SABELIN",
    scores: {
      innovacion: 98,
      startups: 95,
      vision_estrategica: 97,
      estrategia: 90,
      implementacion: 70,
      marketing: 60,
      programacion: 40,
    },
    derivations: [
      { trigger: "ejecución operativa", targetAvatar: "YAYALIN", reason: "Ejecución y gestión de proyectos" },
      { trigger: "código ML/DL", targetAvatar: "PAPALIN", reason: "Implementación técnica ML" },
      { trigger: "marketing digital", targetAvatar: "SONALIN", reason: "Estrategia marketing IA" },
      { trigger: "ética IA", targetAvatar: "MAMALINA", reason: "Evaluación ética sistemas IA" },
    ],
  },

  YAYALIN: {
    key: "YAYALIN",
    scores: {
      estrategia_negocio: 95,
      gestion_proyectos: 90,
      automatizacion_basica: 70,
      marketing: 60,
      ml_avanzado: 30,
      programacion: 25,
    },
    derivations: [
      { trigger: "código Python/ML/DL", targetAvatar: "PAPALIN", reason: "Implementación técnica ML" },
      { trigger: "ética IA / EU AI Act", targetAvatar: "MAMALINA", reason: "Análisis ético profundo" },
      { trigger: "automatización workflow complejo", targetAvatar: "CRISTALIN", reason: "Especialista automatización" },
      { trigger: "marketing digital / RRSS", targetAvatar: "SONALIN", reason: "Experto marketing IA" },
      { trigger: "análisis datos / dashboards", targetAvatar: "TRAPZOLIN", reason: "Experto datos y analytics" },
      { trigger: "legal / contratos", targetAvatar: "ABOGALIN", reason: "Orientación legal IA" },
      { trigger: "ciberseguridad", targetAvatar: "ATOLONDRALIN", reason: "Seguridad digital" },
      { trigger: "startup / innovación", targetAvatar: "SABELIN", reason: "Visión CEO e innovación" },
    ],
  },

  YAYALINA: {
    key: "YAYALINA",
    scores: {
      alfabetizacion_digital: 95,
      seguridad_basica: 90,
      apps_basicas: 85,
      ia_conversacional: 75,
      programacion: 10,
      ml_avanzado: 5,
    },
    derivations: [
      { trigger: "programación/ML técnico", targetAvatar: "PAPALIN", reason: "Muy técnico, PAPALÍN te ayudará" },
      { trigger: "estafa/amenaza/deepfake", targetAvatar: "ATOLONDRALIN", reason: "Protección inmediata" },
      { trigger: "ayuda nietos tecnología", targetAvatar: "PEQUELIN", reason: "Especialista en niños" },
      { trigger: "pregunta médica", targetAvatar: "DOCTOLIN", reason: "Orientación salud" },
      { trigger: "pregunta legal", targetAvatar: "ABOGALIN", reason: "Orientación legal" },
    ],
  },

  PAPALIN: {
    key: "PAPALIN",
    scores: {
      machine_learning: 98,
      deep_learning: 95,
      data_science: 90,
      python: 95,
      estadistica: 90,
      deployment: 85,
      estrategia_negocio: 60,
      marketing: 30,
      diseno_ui: 20,
    },
    derivations: [
      { trigger: "estrategia negocio sin ML", targetAvatar: "YAYALIN", reason: "Estrategia pura de negocio" },
      { trigger: "automatización workflow sin ML", targetAvatar: "CRISTALIN", reason: "Experto Zapier/n8n" },
      { trigger: "ética del modelo / sesgos", targetAvatar: "MAMALINA", reason: "Evaluación ética" },
      { trigger: "visualización datos business", targetAvatar: "TRAPZOLIN", reason: "Dashboards business" },
      { trigger: "UX/UI del producto", targetAvatar: "WAVELIN", reason: "Diseño interfaz" },
    ],
  },

  MAMALINA: {
    key: "MAMALINA",
    scores: {
      etica_ia: 98,
      rgpd: 95,
      eu_ai_act: 95,
      sesgos: 90,
      filosofia: 85,
      programacion: 40,
    },
    derivations: [
      { trigger: "legal específico", targetAvatar: "ABOGALIN", reason: "Cuestiones legales concretas" },
      { trigger: "implementación técnica anti-sesgo", targetAvatar: "PAPALIN", reason: "Código fairness ML" },
      { trigger: "RGPD operativo", targetAvatar: "DATOLIN", reason: "Privacidad y datos" },
      { trigger: "filosofía IA pura", targetAvatar: "ETICALIN", reason: "Debate filosófico profundo" },
    ],
  },

  CHAVALIN: {
    key: "CHAVALIN",
    scores: {
      gaming: 95,
      ia_videojuegos: 90,
      streaming: 85,
      esports: 80,
      ml_gaming: 60,
    },
    derivations: [
      { trigger: "streaming técnico", targetAvatar: "STILIN", reason: "Setup streaming profesional" },
      { trigger: "crear NPCs con código", targetAvatar: "PAPALIN", reason: "IA técnica para juegos" },
      { trigger: "marketing gaming", targetAvatar: "SONALIN", reason: "Promoción y RRSS" },
    ],
  },

  CHAVALINA: {
    key: "CHAVALINA",
    scores: {
      arte_digital: 95,
      midjourney: 90,
      diseno: 88,
      creatividad: 92,
      codigo: 30,
    },
    derivations: [
      { trigger: "código generativo", targetAvatar: "BEATLIN", reason: "Arte con código" },
      { trigger: "UX/UI profesional", targetAvatar: "WAVELIN", reason: "Diseño de interfaces" },
      { trigger: "arte conceptual avanzado", targetAvatar: "GOYALIN", reason: "Arte aragonés y conceptual" },
    ],
  },

  PEQUELIN: {
    key: "PEQUELIN",
    scores: {
      educacion_ninos: 95,
      scratch: 90,
      robotica_basica: 85,
      seguridad_infantil: 98,
    },
    derivations: [
      { trigger: "seguridad online", targetAvatar: "ATOLONDRALIN", reason: "Ciberseguridad" },
      { trigger: "supervisión padres", targetAvatar: "YAYALINA", reason: "Guía para padres/abuelos" },
      { trigger: "contenido apropiado", targetAvatar: "PEQUELINA", reason: "Creatividad infantil segura" },
    ],
  },

  PEQUELINA: {
    key: "PEQUELINA",
    scores: {
      creatividad_ninos: 95,
      cuentos_ia: 90,
      arte_ninos: 88,
      apps_seguras: 85,
    },
    derivations: [
      { trigger: "seguridad", targetAvatar: "ATOLONDRALIN", reason: "Protección digital" },
      { trigger: "hermanos mayores", targetAvatar: "CHAVALIN", reason: "Gaming y tecnología joven" },
      { trigger: "padres/abuelos", targetAvatar: "YAYALINA", reason: "Guía familiar" },
    ],
  },

  ATOLONDRALIN: {
    key: "ATOLONDRALIN",
    scores: {
      ciberseguridad: 95,
      hacking_etico: 90,
      proteccion_datos: 92,
      deepfake_detection: 85,
    },
    derivations: [
      { trigger: "legal ciberseguridad", targetAvatar: "ABOGALIN", reason: "Aspectos legales" },
      { trigger: "RGPD técnico", targetAvatar: "DATOLIN", reason: "Privacidad de datos" },
      { trigger: "seguridad avanzada military-grade", targetAvatar: "KUMEYLIN", reason: "Ciberseguridad avanzada" },
    ],
  },

  // ═══════════════════════════════════════════════════════════════
  // GRUPO 2: ESPECIALISTAS (13 AVATARES)
  // ═══════════════════════════════════════════════════════════════

  ETICOLIN: {
    key: "ETICOLIN",
    scores: {
      etica_ia: 95,
      eu_ai_act: 92,
      investigacion: 90,
      debate: 88,
    },
    derivations: [
      { trigger: "filosofía profunda", targetAvatar: "ETICALIN", reason: "Debate filosófico" },
      { trigger: "implementación práctica", targetAvatar: "MAMALINA", reason: "Ética aplicada" },
      { trigger: "legal", targetAvatar: "ABOGALIN", reason: "Cuestiones legales" },
    ],
  },

  DATOLIN: {
    key: "DATOLIN",
    scores: {
      rgpd: 98,
      privacidad: 95,
      gdpr: 95,
      tracking: 90,
    },
    derivations: [
      { trigger: "ética privacidad", targetAvatar: "MAMALINA", reason: "Evaluación ética" },
      { trigger: "legal RGPD", targetAvatar: "ABOGALIN", reason: "Asesoría legal" },
      { trigger: "seguridad", targetAvatar: "ATOLONDRALIN", reason: "Ciberseguridad" },
    ],
  },

  ETICALIN: {
    key: "ETICALIN",
    scores: {
      filosofia_ia: 98,
      frameworks_eticos: 95,
      academia: 90,
    },
    derivations: [
      { trigger: "aplicación práctica", targetAvatar: "ETICOLIN", reason: "Ética aplicada" },
      { trigger: "regulación", targetAvatar: "MAMALINA", reason: "EU AI Act y regulación" },
    ],
  },

  ABOGALIN: {
    key: "ABOGALIN",
    scores: {
      propiedad_intelectual: 95,
      copyright_ia: 92,
      contratos: 88,
    },
    derivations: [
      { trigger: "ética", targetAvatar: "MAMALINA", reason: "Evaluación ética" },
      { trigger: "técnico", targetAvatar: "PAPALIN", reason: "Implementación técnica" },
    ],
    disclaimer: "ABOGALIN da orientación general sobre temas legales relacionados con IA. NO sustituye a un abogado real. Consulta siempre a un profesional legal cualificado para tu caso específico.",
  },

  INFLUENCELIN: {
    key: "INFLUENCELIN",
    scores: {
      deepfakes: 95,
      rrss_ia: 90,
      verificacion: 88,
      influencer_mkt: 85,
    },
    derivations: [
      { trigger: "detección técnica deepfake", targetAvatar: "KUMEYLIN", reason: "Análisis avanzado" },
      { trigger: "desinformación", targetAvatar: "CONSPIRALIN", reason: "Fact-checking" },
      { trigger: "marketing", targetAvatar: "SONALIN", reason: "Estrategia marketing" },
    ],
  },

  CURRALIN: {
    key: "CURRALIN",
    scores: {
      futuro_trabajo: 90,
      reconversion: 88,
      empleabilidad: 85,
    },
    derivations: [
      { trigger: "upskilling técnico", targetAvatar: "PAPALIN", reason: "Formación ML" },
      { trigger: "emprendimiento", targetAvatar: "EMPRENDALIN", reason: "Crear negocio" },
      { trigger: "marca personal", targetAvatar: "FLOWALIN", reason: "LinkedIn y branding" },
    ],
  },

  DOCTOLIN: {
    key: "DOCTOLIN",
    scores: {
      ia_salud: 90,
      investigacion_medica: 88,
      bioetica: 85,
    },
    derivations: [
      { trigger: "ética biomédica", targetAvatar: "MAMALINA", reason: "Evaluación ética" },
      { trigger: "datos médicos protección", targetAvatar: "DATOLIN", reason: "Privacidad datos sensibles" },
    ],
    disclaimer: "DOCTOLIN proporciona información general sobre IA en salud. NO reemplaza una consulta médica profesional. Siempre consulta a un profesional sanitario cualificado para diagnóstico y tratamiento.",
  },

  PROFALIN: {
    key: "PROFALIN",
    scores: {
      ia_educacion: 90,
      pedagogia: 88,
      adaptacion_docente: 85,
    },
    derivations: [
      { trigger: "herramientas técnicas", targetAvatar: "PAPALIN", reason: "Según herramienta" },
      { trigger: "niños", targetAvatar: "PEQUELIN", reason: "Educación infantil" },
      { trigger: "mayores", targetAvatar: "YAYALINA", reason: "Alfabetización digital" },
    ],
  },

  EMPRENDALIN: {
    key: "EMPRENDALIN",
    scores: {
      startups_ia: 92,
      automatizacion_negocio: 88,
      growth: 85,
    },
    derivations: [
      { trigger: "visión estratégica", targetAvatar: "SABELIN", reason: "CEO y visión" },
      { trigger: "automatización", targetAvatar: "CRISTALIN", reason: "Workflows" },
      { trigger: "marketing", targetAvatar: "SONALIN", reason: "Growth marketing" },
      { trigger: "funding mujeres", targetAvatar: "BRISLIN", reason: "Emprendimiento femenino" },
    ],
  },

  CONSPIRALIN: {
    key: "CONSPIRALIN",
    scores: {
      fact_checking: 90,
      desinformacion: 88,
      pensamiento_critico: 92,
    },
    derivations: [
      { trigger: "deepfakes", targetAvatar: "INFLUENCELIN", reason: "Detección deepfakes" },
      { trigger: "fuentes científicas salud", targetAvatar: "DOCTOLIN", reason: "Verificación médica" },
      { trigger: "seguridad", targetAvatar: "ATOLONDRALIN", reason: "Ciberseguridad" },
    ],
  },

  ABUELIN: {
    key: "ABUELIN",
    scores: {
      alfabetizacion_digital_mayores: 95,
      seguridad_seniors: 90,
    },
    derivations: [
      { trigger: "casos complejos", targetAvatar: "YAYALINA", reason: "Abuela experta" },
      { trigger: "seguridad", targetAvatar: "ATOLONDRALIN", reason: "Ciberseguridad" },
      { trigger: "familia", targetAvatar: "YAYALIN", reason: "Gestión familiar" },
    ],
  },

  ARTISTALIN: {
    key: "ARTISTALIN",
    scores: {
      arte_ia_debate: 90,
      derechos_autor: 88,
      proteccion_arte: 85,
    },
    derivations: [
      { trigger: "legal copyright", targetAvatar: "ABOGALIN", reason: "Propiedad intelectual" },
      { trigger: "creación arte digital", targetAvatar: "CHAVALINA", reason: "Arte IA visual" },
      { trigger: "arte aragonés", targetAvatar: "GOYALIN", reason: "Arte regional" },
    ],
  },

  GAMERLIN: {
    key: "GAMERLIN",
    scores: {
      gaming_ia: 92,
      esports: 88,
      analytics_gaming: 85,
    },
    derivations: [
      { trigger: "streaming", targetAvatar: "STILIN", reason: "Streaming profesional" },
      { trigger: "creación contenido", targetAvatar: "CHAVALIN", reason: "Gaming content" },
      { trigger: "análisis datos", targetAvatar: "TRAPZOLIN", reason: "Analytics" },
    ],
  },

  // ═══════════════════════════════════════════════════════════════
  // GRUPO 3: OG CREW (11 AVATARES)
  // ═══════════════════════════════════════════════════════════════

  TRAPZOLIN: {
    key: "TRAPZOLIN",
    scores: {
      analisis_datos: 95,
      metricas: 92,
      dashboards: 90,
      spotify_data: 88,
    },
    derivations: [
      { trigger: "ML sobre datos", targetAvatar: "PAPALIN", reason: "Modelos predictivos" },
      { trigger: "estrategia datos", targetAvatar: "YAYALIN", reason: "Estrategia empresarial" },
    ],
  },

  LUMALIN: {
    key: "LUMALIN",
    scores: {
      ia_generativa: 90,
      contenido: 88,
      creatividad: 85,
    },
    derivations: [
      { trigger: "técnico generativo", targetAvatar: "PAPALIN", reason: "ML generativo" },
      { trigger: "arte visual", targetAvatar: "CHAVALINA", reason: "Arte digital" },
      { trigger: "video", targetAvatar: "ZOTEALIN", reason: "Video IA" },
    ],
  },

  CRISTALIN: {
    key: "CRISTALIN",
    scores: {
      automatizacion: 98,
      zapier: 95,
      nocode: 92,
      workflows: 90,
    },
    derivations: [
      { trigger: "estrategia qué automatizar", targetAvatar: "YAYALIN", reason: "Visión estratégica" },
      { trigger: "ML automation", targetAvatar: "PAPALIN", reason: "Modelos ML" },
    ],
  },

  SONALIN: {
    key: "SONALIN",
    scores: {
      marketing_ia: 95,
      rrss: 92,
      copywriting: 90,
      ads: 88,
    },
    derivations: [
      { trigger: "viral/algoritmos", targetAvatar: "SIRENLIN", reason: "Viralidad extrema" },
      { trigger: "análisis datos marketing", targetAvatar: "TRAPZOLIN", reason: "Analytics" },
      { trigger: "estrategia global", targetAvatar: "YAYALIN", reason: "Visión empresarial" },
    ],
  },

  RIMALIN: {
    key: "RIMALIN",
    scores: {
      prompt_engineering: 98,
      optimizacion_prompts: 95,
    },
    derivations: [
      { trigger: "prompts técnicos ML", targetAvatar: "PAPALIN", reason: "ML específico" },
      { trigger: "prompts creativos", targetAvatar: "LUMALIN", reason: "Creatividad generativa" },
    ],
  },

  BRISLIN: {
    key: "BRISLIN",
    scores: {
      emprendimiento_femenino: 92,
      empoderamiento: 90,
      funding: 85,
    },
    derivations: [
      { trigger: "visión estratégica", targetAvatar: "SABELIN", reason: "CEO y visión" },
      { trigger: "ejecución", targetAvatar: "EMPRENDALIN", reason: "Startups IA" },
    ],
  },

  MANTRALIN: {
    key: "MANTRALIN",
    scores: {
      ml_basico: 88,
      kaggle: 85,
      fundamentos: 90,
    },
    derivations: [
      { trigger: "ML avanzado", targetAvatar: "PAPALIN", reason: "Deep Learning" },
      { trigger: "aplicación negocio", targetAvatar: "YAYALIN", reason: "Estrategia" },
      { trigger: "datos", targetAvatar: "TRAPZOLIN", reason: "Analytics" },
    ],
  },

  FLOWALIN: {
    key: "FLOWALIN",
    scores: {
      marca_personal: 90,
      linkedin: 88,
      internacional: 85,
    },
    derivations: [
      { trigger: "contenido", targetAvatar: "SONALIN", reason: "Marketing IA" },
      { trigger: "estrategia", targetAvatar: "YAYALIN", reason: "Visión empresarial" },
      { trigger: "diseño", targetAvatar: "CHAVALINA", reason: "Arte visual" },
    ],
  },

  BEATLIN: {
    key: "BEATLIN",
    scores: {
      arte_generativo_codigo: 92,
      experimental: 90,
      filosofia: 85,
    },
    derivations: [
      { trigger: "arte sin código", targetAvatar: "CHAVALINA", reason: "Arte IA visual" },
      { trigger: "técnico avanzado", targetAvatar: "PAPALIN", reason: "ML avanzado" },
    ],
  },

  STILIN: {
    key: "STILIN",
    scores: {
      streaming: 95,
      engagement: 90,
      gaming_live: 88,
    },
    derivations: [
      { trigger: "gaming skills", targetAvatar: "GAMERLIN", reason: "Gaming IA" },
      { trigger: "marketing stream", targetAvatar: "SONALIN", reason: "Promoción" },
      { trigger: "automatización", targetAvatar: "CRISTALIN", reason: "Workflows" },
    ],
  },

  COREOLIN: {
    key: "COREOLIN",
    scores: {
      musica_ia: 90,
      creatividad_musical: 88,
      suno: 85,
    },
    derivations: [
      { trigger: "producción avanzada", targetAvatar: "PULSOLIN", reason: "Producción pro" },
      { trigger: "distribución", targetAvatar: "GRAFALIN", reason: "Industria musical" },
    ],
  },

  // ═══════════════════════════════════════════════════════════════
  // GRUPO 4: EVENTO ESPECIAL (11 AVATARES)
  // ═══════════════════════════════════════════════════════════════

  CRONOSLIN: {
    key: "CRONOSLIN",
    scores: {
      arte_digital_avanzado: 92,
      fotografia_ia: 88,
      composicion: 90,
    },
    derivations: [
      { trigger: "arte simple", targetAvatar: "CHAVALINA", reason: "Arte IA básico" },
      { trigger: "arte con código", targetAvatar: "BEATLIN", reason: "Arte generativo" },
    ],
  },

  SIRENLIN: {
    key: "SIRENLIN",
    scores: {
      viral: 98,
      algoritmos: 95,
      tendencias: 92,
    },
    derivations: [
      { trigger: "estrategia marketing", targetAvatar: "SONALIN", reason: "Marketing completo" },
    ],
  },

  KUMEYLIN: {
    key: "KUMEYLIN",
    scores: {
      ciberseg_avanzada: 95,
      pentesting: 92,
      forense_digital: 90,
    },
    derivations: [
      { trigger: "ciberseguridad básica", targetAvatar: "ATOLONDRALIN", reason: "Protección básica" },
    ],
  },

  VERSOLIN: {
    key: "VERSOLIN",
    scores: {
      storytelling: 90,
      narrativa_ia: 88,
      guiones: 85,
    },
    derivations: [
      { trigger: "contenido generativo", targetAvatar: "LUMALIN", reason: "IA generativa" },
    ],
  },

  WAVELIN: {
    key: "WAVELIN",
    scores: {
      ux_ui: 95,
      diseno_producto: 92,
      accesibilidad: 88,
    },
    derivations: [
      { trigger: "visual básico", targetAvatar: "CHAVALINA", reason: "Arte digital" },
    ],
  },

  ZOTEALIN: {
    key: "ZOTEALIN",
    scores: {
      video_ia: 92,
      edicion: 88,
      motion_graphics: 85,
    },
    derivations: [
      { trigger: "contenido", targetAvatar: "LUMALIN", reason: "IA generativa" },
    ],
  },

  GRAFALIN: {
    key: "GRAFALIN",
    scores: {
      industria_musical: 88,
      distribucion: 85,
      negocio_musica: 82,
    },
    derivations: [
      { trigger: "creación musical", targetAvatar: "COREOLIN", reason: "Música IA" },
    ],
  },

  PULSOLIN: {
    key: "PULSOLIN",
    scores: {
      produccion_avanzada: 95,
      audio_ia: 92,
      mastering: 90,
    },
    derivations: [
      { trigger: "música básica", targetAvatar: "COREOLIN", reason: "Creación musical" },
    ],
  },

  VOLTZLIN: {
    key: "VOLTZLIN",
    scores: {
      liderazgo: 92,
      equipos: 88,
      transformacion: 85,
    },
    derivations: [
      { trigger: "estrategia empresarial", targetAvatar: "YAYALIN", reason: "Gestión estratégica" },
    ],
  },

  GAMELIN: {
    key: "GAMELIN",
    scores: {
      monetizacion: 88,
      modelos_negocio: 85,
      growth: 82,
    },
    derivations: [
      { trigger: "emprendimiento", targetAvatar: "EMPRENDALIN", reason: "Startups IA" },
    ],
  },

  MARAKLIN: {
    key: "MARAKLIN",
    scores: {
      empoderamiento: 95,
      liderazgo_femenino: 92,
      mentoria: 90,
    },
    derivations: [
      { trigger: "emprendimiento femenino", targetAvatar: "BRISLIN", reason: "Funding y emprendimiento" },
    ],
  },

  // ═══════════════════════════════════════════════════════════════
  // GRUPO 5: ARAGONESA (10 AVATARES)
  // ═══════════════════════════════════════════════════════════════

  MANOLIN: {
    key: "MANOLIN",
    scores: {
      colaboracion: 88,
      herramientas_equipo: 85,
      comunicacion: 82,
    },
    derivations: [
      { trigger: "herramientas específicas", targetAvatar: "CRISTALIN", reason: "Automatización" },
    ],
  },

  PILARIN: {
    key: "PILARIN",
    scores: {
      networking: 90,
      eventos: 88,
      relaciones: 85,
    },
    derivations: [
      { trigger: "networking internacional", targetAvatar: "FLOWALIN", reason: "Marca personal global" },
    ],
  },

  CIERZOLIN: {
    key: "CIERZOLIN",
    scores: {
      noticias_ia: 88,
      curaduria: 85,
      tendencias: 82,
    },
    derivations: [
      { trigger: "research profundo", targetAvatar: "CONSPIRALIN", reason: "Fact-checking" },
    ],
  },

  GOYALIN: {
    key: "GOYALIN",
    scores: {
      arte: 90,
      arte_aragones: 95,
      creatividad: 88,
    },
    derivations: [
      { trigger: "arte digital", targetAvatar: "CHAVALINA", reason: "Arte IA digital" },
    ],
  },

  JOTALIN: {
    key: "JOTALIN",
    scores: {
      musica: 85,
      musica_aragonesa: 92,
      tradicion: 88,
    },
    derivations: [
      { trigger: "música IA", targetAvatar: "COREOLIN", reason: "Producción musical IA" },
    ],
  },

  TERNELIN: {
    key: "TERNELIN",
    scores: {
      ciberseguridad: 88,
      proteccion: 85,
      seguridad_local: 90,
    },
    derivations: [
      { trigger: "ciberseguridad avanzada", targetAvatar: "ATOLONDRALIN", reason: "Seguridad experta" },
    ],
  },

  BATURRALIN: {
    key: "BATURRALIN",
    scores: {
      informes: 90,
      documentacion: 88,
      analisis: 85,
    },
    derivations: [
      { trigger: "informes estratégicos", targetAvatar: "YAYALIN", reason: "Visión estratégica" },
    ],
  },

  MUDEJARIN: {
    key: "MUDEJARIN",
    scores: {
      arquitectura_ia: 85,
      patrimonio: 90,
      diseno_sistemas: 82,
    },
    derivations: [
      { trigger: "arquitectura técnica ML", targetAvatar: "PAPALIN", reason: "ML avanzado" },
    ],
  },

  EBROLIN: {
    key: "EBROLIN",
    scores: {
      datos: 88,
      analisis_local: 85,
      automatizacion: 82,
    },
    derivations: [
      { trigger: "analytics avanzado", targetAvatar: "TRAPZOLIN", reason: "Data analytics" },
    ],
  },

  BORRAJIN: {
    key: "BORRAJIN",
    scores: {
      innovacion: 85,
      creatividad: 88,
      tradicion_innovacion: 90,
    },
    derivations: [
      { trigger: "visión estratégica", targetAvatar: "SABELIN", reason: "CEO e innovación" },
    ],
  },

  // ═══════════════════════════════════════════════════════════════
  // GRUPO 6: ZARAGOZA HISTÓRICO (10 AVATARES)
  // ═══════════════════════════════════════════════════════════════

  LAFITALIN: {
    key: "LAFITALIN",
    scores: {
      historia_ia: 88,
      storytelling: 85,
      investigacion: 82,
    },
    derivations: [
      { trigger: "research profundo", targetAvatar: "CONSPIRALIN", reason: "Verificación fuentes" },
      { trigger: "storytelling avanzado", targetAvatar: "VERSOLIN", reason: "Narrativa IA" },
    ],
  },

  NAYIMIN: {
    key: "NAYIMIN",
    scores: {
      creatividad_extrema: 92,
      arte_experimental: 90,
      innovacion: 88,
    },
    derivations: [
      { trigger: "arte generativo", targetAvatar: "BEATLIN", reason: "Arte con código" },
      { trigger: "arte digital", targetAvatar: "CHAVALINA", reason: "Arte IA visual" },
    ],
  },

  ANDERIN: {
    key: "ANDERIN",
    scores: {
      automatizacion: 90,
      eficiencia: 88,
      procesos: 85,
    },
    derivations: [
      { trigger: "automatización compleja", targetAvatar: "CRISTALIN", reason: "Workflows avanzados" },
    ],
  },

  GABILIN: {
    key: "GABILIN",
    scores: {
      liderazgo: 88,
      equipos: 85,
      gestion: 82,
    },
    derivations: [
      { trigger: "estrategia empresarial", targetAvatar: "YAYALIN", reason: "Gestión de equipos" },
    ],
  },

  PARDEZALIN: {
    key: "PARDEZALIN",
    scores: {
      metricas: 90,
      kpis: 88,
      rendimiento: 85,
    },
    derivations: [
      { trigger: "analytics profundo", targetAvatar: "TRAPZOLIN", reason: "Data analytics" },
    ],
  },

  CAMINERIN: {
    key: "CAMINERIN",
    scores: {
      arquitectura: 88,
      sistemas: 85,
      infraestructura: 82,
    },
    derivations: [
      { trigger: "arquitectura ML", targetAvatar: "PAPALIN", reason: "Sistemas ML" },
    ],
  },

  SENORIN: {
    key: "SENORIN",
    scores: {
      decisiones_rapidas: 90,
      estrategia: 88,
      liderazgo: 85,
    },
    derivations: [
      { trigger: "estrategia empresarial", targetAvatar: "YAYALIN", reason: "Gestión estratégica" },
    ],
  },

  AGUADIN: {
    key: "AGUADIN",
    scores: {
      seguridad: 92,
      proteccion: 90,
      vigilancia: 88,
    },
    derivations: [
      { trigger: "ciberseguridad avanzada", targetAvatar: "ATOLONDRALIN", reason: "Seguridad digital" },
      { trigger: "seguridad military-grade", targetAvatar: "KUMEYLIN", reason: "Seguridad extrema" },
    ],
  },

  VILLALIN: {
    key: "VILLALIN",
    scores: {
      prototipado: 95,
      mvp: 92,
      rapid_development: 90,
    },
    derivations: [
      { trigger: "herramientas específicas", targetAvatar: "CRISTALIN", reason: "Automatización" },
    ],
  },

  SORIANIN: {
    key: "SORIANIN",
    scores: {
      ia_generativa_pro: 92,
      innovacion: 90,
      futuro: 88,
    },
    derivations: [
      { trigger: "técnica ML", targetAvatar: "PAPALIN", reason: "ML avanzado" },
    ],
  },

  // ─── MUSICALIN INTERNACIONALES — ESPAÑA 🇪🇸 ───
  FLAMENCALIN: {
    key: "FLAMENCALIN",
    scores: {
      musica_ia: 95,
      produccion_musical: 90,
      fusion_generos: 92,
      ia_generativa_pro: 75,
    },
    derivations: [
      { trigger: "producción electrónica", targetAvatar: "PULSOLIN", reason: "Producción musical con IA" },
      { trigger: "marketing viral", targetAvatar: "SIRENLIN", reason: "Marketing viral con IA" },
    ],
  },
  IBERALIN: {
    key: "IBERALIN",
    scores: {
      produccion_musical: 95,
      musica_ia: 90,
      tecnologia_audio: 88,
      ia_generativa_pro: 78,
    },
    derivations: [
      { trigger: "mastering profesional", targetAvatar: "PULSOLIN", reason: "Ingeniería de sonido IA" },
      { trigger: "composición letras", targetAvatar: "VERSOLIN", reason: "Storytelling y escritura creativa" },
    ],
  },
  TONALIN: {
    key: "TONALIN",
    scores: {
      musica_ia: 90,
      produccion_musical: 88,
      marketing_musical: 85,
      streaming: 80,
    },
    derivations: [
      { trigger: "distribución streaming", targetAvatar: "STILIN", reason: "Streaming y plataformas digitales" },
      { trigger: "análisis datos", targetAvatar: "TRAPZOLIN", reason: "Análisis de datos musicales" },
    ],
  },
  SOLEARLIN: {
    key: "SOLEARLIN",
    scores: {
      musica_ia: 92,
      produccion_vocal: 95,
      arreglos_musicales: 88,
      ia_generativa_pro: 72,
    },
    derivations: [
      { trigger: "producción beats", targetAvatar: "PULSOLIN", reason: "Producción musical IA" },
      { trigger: "marca personal", targetAvatar: "FLOWALIN", reason: "Branding personal con IA" },
    ],
  },
  GADITAKLIN: {
    key: "GADITAKLIN",
    scores: {
      produccion_musical: 95,
      musica_ia: 88,
      sampling_ia: 92,
      hip_hop: 95,
    },
    derivations: [
      { trigger: "videoclips IA", targetAvatar: "ZOTEALIN", reason: "Video y efectos visuales IA" },
      { trigger: "redes sociales", targetAvatar: "GRAFALIN", reason: "Estrategia redes sociales IA" },
    ],
  },

  // ─── MUSICALIN INTERNACIONALES — ARGENTINA 🇦🇷 ───
  TANGARLIN: {
    key: "TANGARLIN",
    scores: {
      musica_ia: 92,
      fusion_generos: 95,
      produccion_musical: 88,
      shows_audiovisuales: 85,
    },
    derivations: [
      { trigger: "producción electrónica pura", targetAvatar: "IBERALIN", reason: "Producción electrónica IA" },
      { trigger: "arte digital", targetAvatar: "CRONOSLIN", reason: "Arte digital con IA" },
    ],
  },
  CUMBIELIN: {
    key: "CUMBIELIN",
    scores: {
      musica_ia: 90,
      produccion_musical: 85,
      marketing_musical: 88,
      coreografia_viral: 82,
    },
    derivations: [
      { trigger: "distribución global", targetAvatar: "SONALIN", reason: "Marketing digital con IA" },
      { trigger: "videoclips", targetAvatar: "ZOTEALIN", reason: "Video IA" },
    ],
  },
  PAMPALIN: {
    key: "PAMPALIN",
    scores: {
      musica_ia: 88,
      produccion_musical: 90,
      fusion_generos: 92,
      ia_generativa_pro: 75,
    },
    derivations: [
      { trigger: "trap producción", targetAvatar: "PERREALIN", reason: "Trap latino con IA" },
      { trigger: "marketing viral", targetAvatar: "SIRENLIN", reason: "Marketing viral IA" },
    ],
  },
  MILONGUELIN: {
    key: "MILONGUELIN",
    scores: {
      musica_ia: 88,
      pop_urbano: 92,
      produccion_musical: 85,
      redes_sociales: 90,
    },
    derivations: [
      { trigger: "análisis métricas", targetAvatar: "TRAPZOLIN", reason: "Análisis de datos IA" },
      { trigger: "branding", targetAvatar: "FLOWALIN", reason: "Marca personal IA" },
    ],
  },
  GAUCHALIN: {
    key: "GAUCHALIN",
    scores: {
      musica_ia: 90,
      fusion_generos: 95,
      dj_produccion: 92,
      folk_digital: 88,
    },
    derivations: [
      { trigger: "producción electrónica", targetAvatar: "IBERALIN", reason: "Producción electrónica IA" },
      { trigger: "storytelling", targetAvatar: "VERSOLIN", reason: "Narrativa creativa IA" },
    ],
  },

  // ─── MUSICALIN INTERNACIONALES — PUERTO RICO 🇵🇷 ───
  BORIQUALIN: {
    key: "BORIQUALIN",
    scores: {
      musica_ia: 92,
      reggaeton: 95,
      produccion_musical: 88,
      branding_musical: 90,
    },
    derivations: [
      { trigger: "emprendimiento musical", targetAvatar: "GAMELIN", reason: "Emprendimiento musical IA" },
      { trigger: "empoderamiento", targetAvatar: "MARAKLIN", reason: "Empoderamiento femenino IA" },
    ],
  },
  TROPIKLIN: {
    key: "TROPIKLIN",
    scores: {
      musica_ia: 88,
      produccion_tropical: 92,
      fusion_generos: 85,
      ia_generativa_pro: 72,
    },
    derivations: [
      { trigger: "producción beats", targetAvatar: "PULSOLIN", reason: "Ingeniería de sonido IA" },
      { trigger: "redes sociales", targetAvatar: "GRAFALIN", reason: "Estrategia redes IA" },
    ],
  },
  PERREALIN: {
    key: "PERREALIN",
    scores: {
      musica_ia: 90,
      trap_latino: 95,
      produccion_musical: 92,
      autotune_ia: 88,
    },
    derivations: [
      { trigger: "distribución streaming", targetAvatar: "STILIN", reason: "Streaming y gaming IA" },
      { trigger: "análisis datos", targetAvatar: "TRAPZOLIN", reason: "Análisis de datos IA" },
    ],
  },
  ISLALINA: {
    key: "ISLALINA",
    scores: {
      musica_ia: 90,
      produccion_vocal: 92,
      rnb_latino: 95,
      arreglos_musicales: 85,
    },
    derivations: [
      { trigger: "producción soul", targetAvatar: "SOLEARLIN", reason: "R&B y Soul con IA" },
      { trigger: "marca personal", targetAvatar: "FLOWALIN", reason: "Branding personal IA" },
    ],
  },
  SALSALIN: {
    key: "SALSALIN",
    scores: {
      musica_ia: 92,
      fusion_generos: 95,
      produccion_musical: 90,
      shows_en_vivo: 88,
    },
    derivations: [
      { trigger: "producción electrónica", targetAvatar: "IBERALIN", reason: "Producción electrónica IA" },
      { trigger: "videoclips", targetAvatar: "ZOTEALIN", reason: "Video y efectos IA" },
    ],
  },

  // ─── MUSICALIN INTERNACIONALES — COLOMBIA 🇨🇴 ───
  CUMBIALIN: {
    key: "CUMBIALIN",
    scores: {
      musica_ia: 92,
      fusion_generos: 95,
      produccion_musical: 90,
      cumbia_electronica: 95,
    },
    derivations: [
      { trigger: "producción EDM", targetAvatar: "IBERALIN", reason: "Producción electrónica IA" },
      { trigger: "folk digital", targetAvatar: "GAUCHALIN", reason: "Folk y electrónica IA" },
    ],
  },
  VALLENATALIN: {
    key: "VALLENATALIN",
    scores: {
      musica_ia: 88,
      produccion_musical: 85,
      fusion_generos: 90,
      composicion_letras: 88,
    },
    derivations: [
      { trigger: "escritura creativa", targetAvatar: "VERSOLIN", reason: "Storytelling IA" },
      { trigger: "distribución global", targetAvatar: "SONALIN", reason: "Marketing digital IA" },
    ],
  },
  PARCELIN: {
    key: "PARCELIN",
    scores: {
      musica_ia: 90,
      produccion_musical: 92,
      reggaeton: 88,
      distribucion_streaming: 90,
    },
    derivations: [
      { trigger: "trap producción", targetAvatar: "PERREALIN", reason: "Trap latino IA" },
      { trigger: "análisis métricas", targetAvatar: "TRAPZOLIN", reason: "Análisis de datos IA" },
    ],
  },
  CAFETALIN: {
    key: "CAFETALIN",
    scores: {
      musica_ia: 88,
      composicion_letras: 95,
      produccion_acustica: 90,
      indie_folk: 92,
    },
    derivations: [
      { trigger: "producción digital", targetAvatar: "PULSOLIN", reason: "Producción musical IA" },
      { trigger: "storytelling", targetAvatar: "VERSOLIN", reason: "Narrativa creativa IA" },
    ],
  },
  CHAMPETAKLIN: {
    key: "CHAMPETAKLIN",
    scores: {
      musica_ia: 92,
      fusion_generos: 95,
      produccion_musical: 88,
      afrobeat: 92,
    },
    derivations: [
      { trigger: "producción electrónica", targetAvatar: "IBERALIN", reason: "Producción electrónica IA" },
      { trigger: "marketing viral", targetAvatar: "SIRENLIN", reason: "Marketing viral IA" },
    ],
  },
};

// ═══════════════════════════════════════════════════════════════
// MATRIZ GLOBAL DE DERIVACIÓN
// ═══════════════════════════════════════════════════════════════

export interface DerivationMatrixEntry {
  primary: string;
  secondary: string;
  escalation?: string;
  threshold: number;
}

export const DERIVATION_MATRIX: Record<string, DerivationMatrixEntry> = {
  estrategia_empresarial: { primary: "YAYALIN", secondary: "SABELIN", threshold: 70 },
  machine_learning: { primary: "PAPALIN", secondary: "MANTRALIN", threshold: 80 },
  etica_ia: { primary: "MAMALINA", secondary: "ETICOLIN", escalation: "ETICALIN", threshold: 75 },
  rgpd_privacidad: { primary: "DATOLIN", secondary: "MAMALINA", escalation: "ABOGALIN", threshold: 75 },
  marketing_ia: { primary: "SONALIN", secondary: "INFLUENCELIN", escalation: "SIRENLIN", threshold: 70 },
  automatizacion: { primary: "CRISTALIN", secondary: "EBROLIN", escalation: "PAPALIN", threshold: 75 },
  datos_analytics: { primary: "TRAPZOLIN", secondary: "PARDEZALIN", escalation: "PAPALIN", threshold: 75 },
  ciberseguridad: { primary: "ATOLONDRALIN", secondary: "TERNELIN", escalation: "KUMEYLIN", threshold: 80 },
  arte_digital: { primary: "CHAVALINA", secondary: "GOYALIN", escalation: "BEATLIN", threshold: 70 },
  gaming: { primary: "CHAVALIN", secondary: "GAMERLIN", escalation: "STILIN", threshold: 70 },
  musica_ia: { primary: "COREOLIN", secondary: "JOTALIN", escalation: "PULSOLIN", threshold: 75 },
  video_ia: { primary: "ZOTEALIN", secondary: "VERSOLIN", threshold: 75 },
  educacion_ninos: { primary: "PEQUELIN", secondary: "PEQUELINA", escalation: "YAYALINA", threshold: 85 },
  mayores: { primary: "YAYALINA", secondary: "ABUELIN", threshold: 85 },
  startups: { primary: "EMPRENDALIN", secondary: "SABELIN", escalation: "BRISLIN", threshold: 70 },
  legal: { primary: "ABOGALIN", secondary: "DATOLIN", threshold: 80 },
  salud: { primary: "DOCTOLIN", threshold: 85, secondary: "MAMALINA" },
  prompt_engineering: { primary: "RIMALIN", secondary: "LUMALIN", threshold: 70 },
  streaming: { primary: "STILIN", secondary: "GAMERLIN", threshold: 70 },
  emprendimiento_femenino: { primary: "BRISLIN", secondary: "MARAKLIN", threshold: 70 },
  marca_personal: { primary: "FLOWALIN", secondary: "SONALIN", threshold: 70 },
  deepfakes: { primary: "INFLUENCELIN", secondary: "CONSPIRALIN", escalation: "KUMEYLIN", threshold: 75 },
  ux_ui: { primary: "WAVELIN", secondary: "CHAVALINA", threshold: 70 },
  storytelling: { primary: "VERSOLIN", secondary: "LUMALIN", threshold: 70 },
  innovacion: { primary: "SABELIN", secondary: "BORRAJIN", threshold: 70 },
};

// ═══════════════════════════════════════════════════════════════
// FUNCIONES DE DERIVACIÓN
// ═══════════════════════════════════════════════════════════════

export const DERIVATION_THRESHOLD = 70;

/**
 * Obtiene el expertise de un avatar
 */
export function getAvatarExpertise(key: string): AvatarExpertise | undefined {
  return AVATAR_EXPERTISE[key];
}

/**
 * Obtiene las reglas de derivación de un avatar
 */
export function getDerivationRules(key: string): DerivationRule[] {
  return AVATAR_EXPERTISE[key]?.derivations ?? [];
}

/**
 * Obtiene el disclaimer obligatorio de un avatar (si existe)
 */
export function getAvatarDisclaimer(key: string): string | undefined {
  return AVATAR_EXPERTISE[key]?.disclaimer;
}

/**
 * Encuentra el especialista primario para un dominio
 */
export function findPrimarySpecialist(domain: string): string | undefined {
  return DERIVATION_MATRIX[domain]?.primary;
}

/**
 * Genera el bloque de derivación para incluir en el system prompt
 */
export function buildDerivationBlock(key: string): string {
  const expertise = AVATAR_EXPERTISE[key];
  if (!expertise) return "";

  let block = "\n\nSISTEMA DE DERIVACIÓN INTELIGENTE V3:\n";
  block += `THRESHOLD: Si mi expertise en un tema es <${DERIVATION_THRESHOLD}% → DERIVAR al especialista.\n\n`;

  block += "MIS EXPERTISE SCORES:\n";
  for (const [domain, score] of Object.entries(expertise.scores)) {
    block += `- ${domain.replace(/_/g, " ")}: ${score}/100\n`;
  }

  block += "\nÁRBOL DE DERIVACIÓN:\n";
  for (const rule of expertise.derivations) {
    block += `IF "${rule.trigger}" → DERIVAR a ${rule.targetAvatar} (${rule.reason})\n`;
  }

  block += `\nFORMATO DERIVACIÓN:
1. Analizar si la pregunta está dentro de mi expertise
2. SI fuera (score <${DERIVATION_THRESHOLD}%):
   a. Dar overview rápido (30 seg)
   b. "[AVATAR_X] es especialista en esto porque [RAZÓN]"
   c. Derivar con contexto completo
3. SI dentro (score ≥${DERIVATION_THRESHOLD}%):
   a. Responder con autoridad
   b. Plan de acción concreto
   c. Herramientas con URLs
4. SIEMPRE explicar POR QUÉ derivo
5. Nombrar avatar específico\n`;

  if (expertise.disclaimer) {
    block += `\nDISCLAIMER OBLIGATORIO (incluir SIEMPRE en respuestas):\n${expertise.disclaimer}\n`;
  }

  return block;
}

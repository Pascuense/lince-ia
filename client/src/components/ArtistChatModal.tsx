import { tl } from "@/contexts/PRDLanguageContext";
import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { AVATAR_MUSICALIN, AVATAR_FRONTAL, AVATAR_PROFILE_PIC, getAvatarImage, type CharacterData } from "@/lib/avatarConstants";
import { FictionalDisclaimer } from "./FictionalDisclaimer";
import ShareDownloadBar from "@/components/ShareDownloadBar";
import { getAvatarPrompt } from "@shared/avatarPrompts";
import { trpc } from "@/lib/trpc";
import { useFeatures } from "@/hooks/useFeatures";
import { useGame } from "@/contexts/GameContext";
import { useGuest } from "@/contexts/GuestContext";
import confetti from "canvas-confetti";

// ─── SUGGESTED QUESTIONS PER ARTIST (quick-start topics) ───
type SuggestedQ = string;

const ARTIST_SUGGESTIONS: Record<string, SuggestedQ[]> = {
  // OG CREW
  LUMALIN: [
    "¿Qué es LINCE?",
    "¿Qué puedo aprender aquí?",
    "¿Es gratis?",
    "¿Qué es un prompt?",
    "¿Necesito saber programar?",
    "¿Quién creó LINCE?",
  ],
  VOLTZLIN: [
    "¿Qué hace un Director de Academia?",
    "¿Qué es la estrategia IA?",
    "¿Cómo la IA puede ayudar a un artista?",
    "¿Qué nivel necesito para empezar?",
    "¿Qué son las Batallas?",
  ],
  RIMALIN: [
    "¿Qué es prompt engineering?",
    "¿Cómo escribo un buen prompt?",
    "¿Puedo ganar dinero con prompts?",
    "¿La IA reemplazará a los creativos?",
    "¿Qué herramientas recomiendas?",
  ],
  CRISTALIN: [
    "¿Qué es la automatización con IA?",
    "¿Qué herramientas de automatización existen?",
    "¿Cuánto tiempo se ahorra automatizando?",
    "¿Puedo automatizar mi negocio?",
  ],
  SONALIN: [
    "¿Qué es el marketing con IA?",
    "¿Cómo la IA ayuda a vender más?",
    "¿Puedo crear contenido para redes con IA?",
    "¿Funciona para negocios pequeños?",
  ],
  COREOLIN: [
    "¿Se puede crear música con IA?",
    "¿Qué herramientas de música IA existen?",
    "¿Puedo crear beats con IA?",
    "¿Cómo hago una canción completa?",
  ],
  MANTRALIN: [
    "¿Qué es la IA generativa?",
    "¿Cómo se crea una imagen con IA?",
    "¿Qué herramientas de imagen IA existen?",
    "¿Puedo crear arte profesional con IA?",
  ],
  BRISLIN: [
    "¿Cómo la IA ayuda en educación?",
    "¿Puede la IA ser tutora personal?",
    "¿Qué herramientas educativas con IA existen?",
    "¿Cómo usar IA en el aula?",
  ],
  BEATLIN: [
    "¿Qué es el análisis de datos con IA?",
    "¿Qué herramientas de datos IA existen?",
    "¿Puedo analizar datos sin saber programar?",
    "¿Cómo la IA predice tendencias?",
  ],
  FLOWALIN: [
    "¿Qué es la IA ética?",
    "¿Cuáles son los riesgos de la IA?",
    "¿Cómo se regulará la IA?",
    "¿La IA tiene sesgos?",
  ],
  STILIN: [
    "¿Qué es la IA en salud?",
    "¿Puede la IA diagnosticar enfermedades?",
    "¿Qué herramientas de salud IA existen?",
    "¿Es segura la IA en medicina?",
  ],
  // MÁS ARTISTAS CREW
  SIRENLIN: [
    "¿Cómo la IA transforma la industria musical?",
    "¿Qué es el storytelling con IA?",
    "¿Cómo crear narrativas con IA?",
    "¿Qué herramientas usa un artista con IA?",
  ],
  ZOTEALIN: [
    "¿Qué es la producción musical con IA?",
    "¿Cómo crear beats con inteligencia artificial?",
    "¿Qué herramientas de producción IA existen?",
    "¿La IA puede masterizar canciones?",
  ],
  PULSOLIN: [
    "¿Qué es la IA multimodal?",
    "¿Cómo combinar texto, imagen y audio con IA?",
    "¿Qué proyectos creativos puedo hacer?",
    "¿Cómo ser versátil con herramientas IA?",
  ],
  GRAFALIN: [
    "¿Qué es el branding personal con IA?",
    "¿Cómo crear una marca con inteligencia artificial?",
    "¿Qué herramientas de branding IA existen?",
    "¿Cómo monetizar contenido con IA?",
  ],
  CRONOSLIN: [
    "¿Qué es la innovación con IA?",
    "¿Cómo crear productos nuevos con IA?",
    "¿Qué startups usan IA?",
    "¿Cómo emprender con inteligencia artificial?",
  ],
  GAMELIN: [
    "¿Cómo los jóvenes pueden usar IA?",
    "¿Qué carreras del futuro usan IA?",
    "¿Cómo crear contenido viral con IA?",
    "¿Qué herramientas de IA son gratis?",
  ],
  TRAPZOLIN: [
    "¿Qué son las redes neuronales?",
    "¿Cómo funciona el deep learning?",
    "¿Qué es el machine learning?",
    "¿Cómo entrenar un modelo de IA?",
  ],
  WAVELIN: [
    "¿Qué es la IA en el entretenimiento?",
    "¿Cómo crear videojuegos con IA?",
    "¿Qué herramientas de gaming IA existen?",
    "¿La IA puede crear guiones?",
  ],
  KUMEYLIN: [
    "¿Qué es la visualización de datos con IA?",
    "¿Cómo crear dashboards inteligentes?",
    "¿Qué herramientas de análisis visual existen?",
    "¿Cómo presentar datos de forma efectiva?",
  ],
  VERSOLIN: [
    "¿Qué es la IA conversacional?",
    "¿Cómo crear chatbots con IA?",
    "¿Qué herramientas de chatbot existen?",
    "¿Cómo mejorar la atención al cliente con IA?",
  ],
  // FAMILIA
  SABELIN: [
    "¿Cuál es la visión de LINCE?",
    "¿Qué hace ACNB IA SL?",
    "¿Cómo va a cambiar la IA el mundo?",
    "¿Qué planes tiene LINCE?",
  ],
  YAYALIN: [
    "¿Cómo la IA ayuda en el trabajo?",
    "¿Qué herramientas de productividad IA existen?",
    "¿Cómo automatizar tareas del hogar?",
    "¿La IA puede ayudar con las finanzas?",
  ],
  YAYALINA: [
    "¿Cómo uso el móvil mejor?",
    "¿Qué es internet?",
    "¿Es seguro usar tecnología?",
    "¿Puedo aprender a mi edad?",
  ],
  PAPALIN: [
    "¿Cómo emprender con IA?",
    "¿Qué negocios puedo crear con IA?",
    "¿Cómo la IA reduce costos?",
    "¿Qué es un modelo de negocio IA?",
  ],
  MAMALINA: [
    "¿Cómo la IA ayuda en salud?",
    "¿Qué apps de bienestar con IA existen?",
    "¿Puede la IA ayudar con el estrés?",
    "¿Cómo usar IA para organizar la vida?",
  ],
  CHAVALIN: [
    "¿Qué videojuegos usan IA?",
    "¿Cómo crear mods con IA?",
    "¿Puedo programar con IA?",
    "¿Qué es la robótica?",
  ],
  CHAVALINA: [
    "¿Cómo crear arte digital con IA?",
    "¿Qué apps de dibujo con IA existen?",
    "¿Puedo hacer animaciones con IA?",
    "¿Cómo crear historias con IA?",
  ],
  PEQUELIN: [
    "¿Qué es la inteligencia artificial?",
    "¿Los robots son amigos?",
    "¿Cómo funciona una computadora?",
    "¿Puedo hablar con una IA?",
  ],
  PEQUELINA: [
    "¿Qué son los colores?",
    "¿Cómo dibujar con la computadora?",
    "¿Los animales usan tecnología?",
    "¿Qué es un robot?",
  ],
  ATOLONDRALIN: [
    "¿Qué es la ciberseguridad?",
    "¿Cómo proteger mis datos?",
    "¿Qué son los hackers?",
    "¿Es segura la IA?",
  ],
  // ESPECIALISTAS
  ETICOLIN: [
    "¿Qué herramientas evalúan la ética de una IA?",
    "¿Cómo detectar sesgos en un algoritmo?",
    "¿Qué dice el EU AI Act?",
    "¿Cómo auditar una IA con Hugging Face?",
  ],
  DATOLIN: [
    "¿Cómo analizar datos con ChatGPT?",
    "¿Qué hace el RGPD con mis datos?",
    "¿Cómo usar Google Sheets con IA?",
    "¿Qué herramientas de análisis de datos recomiendas?",
  ],
  ETICALIN: [
    "¿Qué marcos éticos existen para la IA?",
    "¿Cómo garantizar el uso responsable de la IA?",
    "¿Qué es la filosofía de la tecnología?",
    "¿Cómo enseñar ética de la IA?",
  ],
  ABOGALIN: [
    "¿Quién es dueño de lo que genera una IA?",
    "¿Qué dice la ley sobre copyright e IA?",
    "¿Puedo usar imágenes generadas por IA comercialmente?",
    "¿Qué demandas hay contra Big Tech por IA?",
  ],
  INFLUENCELIN: [
    "¿Cómo detectar un deepfake?",
    "¿Qué herramientas IA escalan redes sociales?",
    "¿Cómo crear contenido viral con IA?",
    "¿Los filtros IA son peligrosos?",
  ],
  CURRALIN: [
    "¿La IA va a quitarme el trabajo?",
    "¿Cómo usar LinkedIn AI para mi carrera?",
    "¿Qué habilidades necesito en la era IA?",
    "¿Cómo reconvertirme profesionalmente con IA?",
  ],
  DOCTOLIN: [
    "¿Puede la IA diagnosticar enfermedades?",
    "¿Qué apps médicas con IA son fiables?",
    "¿Cómo buscar información médica con IA?",
    "¿Qué riesgos tiene la IA en salud?",
  ],
  PROFALIN: [
    "¿Cómo usar IA en el aula sin perder el control?",
    "¿Qué es la técnica CREA para prompts?",
    "¿Los estudiantes hacen trampa con ChatGPT?",
    "¿Cómo adaptar la pedagogía a la era IA?",
  ],
  EMPRENDALIN: [
    "¿Cómo lanzar un negocio con IA?",
    "¿Qué herramientas IA necesita una startup?",
    "¿Cómo automatizar un negocio pequeño?",
    "¿Qué es el growth hacking con IA?",
  ],
  CONSPIRALIN: [
    "¿Cómo detectar noticias falsas generadas por IA?",
    "¿Qué mitos sobre la IA son mentira?",
    "¿Cómo hacer fact-checking con herramientas IA?",
    "¿La IA nos va a controlar?",
  ],
  ABUELIN: [
    "¿Cómo empezar con la IA sin miedo?",
    "¿Qué estafas digitales debo conocer?",
    "¿Cómo usar el móvil de forma segura?",
    "¿Puedo aprender IA a mi edad?",
  ],
  ARTISTALIN: [
    "¿La IA puede crear arte de verdad?",
    "¿Cómo usar Midjourney para crear imágenes?",
    "¿Los artistas pierden trabajo por la IA?",
    "¿Qué derechos de autor tiene el arte IA?",
  ],
  GAMERLIN: [
    "¿Cómo usar IA para mejorar en videojuegos?",
    "¿Qué NPCs inteligentes existen?",
    "¿La IA puede crear videojuegos?",
    "¿Cómo crear contenido gaming con IA?",
  ],
  MARAKLIN: [
    "¿Cómo construir una marca personal con IA?",
    "¿Qué herramientas IA empoderan a mujeres en tech?",
    "¿Cómo monetizar contenido con IA?",
    "¿Cómo dominar redes sociales con IA?",
  ],
  // ARAGONESES
  MANOLIN: [
    "¿Cómo usar IA para trabajo en equipo?",
    "¿Qué herramientas de colaboración IA existen?",
    "¿Cómo no rendirse aprendiendo IA?",
    "¿Qué es Notion AI para equipos?",
  ],
  PILARIN: [
    "¿Cómo crear presentaciones con Gamma?",
    "¿Qué herramientas IA hacen slides?",
    "¿Cómo usar PowerPoint con IA?",
    "¿Cómo hacer networking en tech?",
  ],
  CIERZOLIN: [
    "¿Cómo estar al día en noticias de IA?",
    "¿Qué herramientas IA analizan datos rápido?",
    "¿Cómo tomar decisiones con datos?",
    "¿Qué es Perplexity AI?",
  ],
  GOYALIN: [
    "¿Cómo crear arte con IA generativa?",
    "¿Qué herramientas de creatividad IA existen?",
    "¿Puede la IA ser creativa de verdad?",
    "¿Cómo fusionar arte clásico con IA?",
  ],
  JOTALIN: [
    "¿Cómo automatizar tareas sin código?",
    "¿Qué es Make/Zapier para automatización?",
    "¿Cómo preservar cultura con IA?",
    "¿La IA puede crear música tradicional?",
  ],
  TERNELIN: [
    "¿Cómo proteger mis datos con IA?",
    "¿Qué herramientas de ciberseguridad IA existen?",
    "¿Cómo enfrentar los retos de la IA sin miedo?",
    "¿Qué es la defensa digital?",
  ],
  BATURRALIN: [
    "¿Cómo generar informes con IA?",
    "¿Qué herramientas IA hacen resúmenes?",
    "¿Cómo simplificar conceptos de IA?",
    "¿Qué es el sentido común aplicado a la IA?",
  ],
  MUDEJARIN: [
    "¿Cómo diseñar sistemas de IA desde cero?",
    "¿Qué es la arquitectura de IA?",
    "¿Cómo integrar culturas con tecnología?",
    "¿Qué herramientas de diseño de sistemas existen?",
  ],
  EBROLIN: [
    "¿Cómo tomar decisiones con datos reales?",
    "¿Qué herramientas IA analizan información?",
    "¿Cómo conectar comunidades de IA?",
    "¿Qué es el flujo de conocimiento compartido?",
  ],
  BORRAJIN: [
    "¿Cómo hacer digeribles los conceptos de IA?",
    "¿Qué recetas de aprendizaje IA existen?",
    "¿Cómo enseñar IA de forma creativa?",
    "¿Qué herramientas IA ayudan a aprender?",
  ],
  // ZARAGOZA HISTÓRICO
  LAFITALIN: [
    "¿Cómo la IA se aplica al deporte?",
    "¿Qué herramientas de análisis táctico existen?",
    "¿Cómo usar datos para estrategia competitiva?",
    "¿Qué es el storytelling con IA?",
  ],
  NAYIMIN: [
    "¿Cómo pensar fuera de la caja con IA?",
    "¿Qué soluciones creativas ofrece la IA?",
    "¿Cómo diseñar estrategias ganadoras con IA?",
    "¿Qué es la creatividad extrema con IA?",
  ],
  ANDERIN: [
    "¿Cómo automatizar procesos sin parar?",
    "¿Qué workflows IA son más eficientes?",
    "¿Cómo mejorar la eficiencia operativa con IA?",
    "¿Qué herramientas de automatización recomiendas?",
  ],
  GABILIN: [
    "¿Cómo liderar equipos tech con IA?",
    "¿Qué herramientas de gestión de proyectos IA existen?",
    "¿Cómo coordinar equipos con IA?",
    "¿Qué es el liderazgo en la era IA?",
  ],
  PARDEZALIN: [
    "¿Cómo crear dashboards con IA?",
    "¿Qué herramientas de análisis de datos recomiendas?",
    "¿Cómo medir KPIs con IA?",
    "¿Qué es el análisis de rendimiento con IA?",
  ],
  CAMINERIN: [
    "¿Cómo diseñar arquitecturas de IA?",
    "¿Qué es la visión panorámica en tech?",
    "¿Cómo entrenar liderazgo con simulaciones IA?",
    "¿Qué herramientas de IA conversacional existen?",
  ],
  SENORIN: [
    "¿Cómo tomar decisiones rápidas con IA?",
    "¿Qué herramientas IA ayudan bajo presión?",
    "¿Cómo ser decisivo con datos?",
    "¿Qué es el clutch thinking con IA?",
  ],
  AGUADIN: [
    "¿Cómo proteger datos con IA?",
    "¿Qué herramientas de ciberseguridad IA existen?",
    "¿Cómo construir un muro defensivo digital?",
    "¿Qué es la defensa digital con IA?",
  ],
  VILLALIN: [
    "¿Cómo crear prototipos rápidos con IA?",
    "¿Qué es un MVP con IA?",
    "¿Cómo ejecutar ideas a velocidad de relámpago?",
    "¿Qué herramientas de prototipado IA existen?",
  ],
  SORIANIN: [
    "¿Cómo crear con IA generativa?",
    "¿Qué herramientas de diseño con IA existen?",
    "¿Cómo combinar arte y precisión técnica?",
    "¿Qué es la visión artística computacional?",
  ],
  // ═══ MUSICALIN INTERNACIONAL ═══
  // ESPAÑA
  FLAMENCALIN: [
    "¿Se puede crear flamenco con IA?",
    "¿Qué herramientas de música IA existen?",
    "¿Cómo fusionar flamenco con electrónica?",
    "¿La IA puede componer bulerías?",
  ],
  IBERALIN: [
    "¿Cómo producir electrónica con IA?",
    "¿Qué plugins de IA recomiendas?",
    "¿Cómo hacer mastering con IA?",
    "¿Qué es el diseño sonoro con IA?",
  ],
  TONALIN: [
    "¿Cómo escribir letras de canciones con IA?",
    "¿La IA puede componer melodías?",
    "¿Qué estructura tiene una canción pop?",
    "¿Cómo crear un demo con IA?",
  ],
  SOLEARLIN: [
    "¿Cómo crear rumba con IA?",
    "¿Qué ritmos se pueden producir con IA?",
    "¿Cómo mezclar rumba con reggae?",
    "¿La IA puede crear percusiones?",
  ],
  GADITAKLIN: [
    "¿Cómo escribir letras de rap con IA?",
    "¿La IA puede hacer freestyle?",
    "¿Qué herramientas de hip-hop IA existen?",
    "¿Cómo crear beats de rap con IA?",
  ],
  // ARGENTINA
  TANGARLIN: [
    "¿Se puede crear tango electrónico con IA?",
    "¿Qué es la fusión tango-electrónica?",
    "¿La IA puede simular un bandoneón?",
    "¿Cómo modernizar el tango con tecnología?",
  ],
  CUMBIELIN: [
    "¿Cómo crear cumbia digital con IA?",
    "¿La IA puede hacer remix de cumbia?",
    "¿Qué herramientas de DJ con IA existen?",
    "¿Cómo mezclar cumbia con electrónica?",
  ],
  PAMPALIN: [
    "¿Cómo producir rock con IA?",
    "¿La IA puede simular guitarras?",
    "¿Qué plugins de rock IA existen?",
    "¿Cómo hacer mastering de rock con IA?",
  ],
  MILONGUELIN: [
    "¿Se puede preservar el folklore con IA?",
    "¿Cómo digitalizar música tradicional?",
    "¿La IA puede crear milongas?",
    "¿Qué instrumentos criollos se pueden simular?",
  ],
  GAUCHALIN: [
    "¿Cómo producir trap argentino con IA?",
    "¿Qué son los 808s y cómo crearlos?",
    "¿Cómo usar autotune con IA?",
    "¿Cómo distribuir mi música en Spotify?",
  ],
  // PUERTO RICO
  BORIQUALIN: [
    "¿Cómo producir reggaetón con IA?",
    "¿Qué es un dembow y cómo crearlo?",
    "¿La IA puede crear hits musicales?",
    "¿Cómo viralizar mi música con IA?",
  ],
  TROPIKLIN: [
    "¿Cómo crear música tropical con IA?",
    "¿Qué es el tropical pop?",
    "¿La IA puede crear reggae?",
    "¿Cómo producir dancehall con IA?",
  ],
  PERREALIN: [
    "¿Cómo hacer beats de trap latino?",
    "¿Qué es un 808 y cómo suena?",
    "¿Cómo usar autotune profesional?",
    "¿La IA puede producir perreo?",
  ],
  ISLALINA: [
    "¿Cómo crear R&B con IA?",
    "¿Qué son las armonías vocales con IA?",
    "¿Cómo producir neo-soul digital?",
    "¿La IA puede mejorar mi voz?",
  ],
  SALSALIN: [
    "¿Se puede crear salsa con IA?",
    "¿Qué es la clave de salsa?",
    "¿Cómo fusionar salsa con electrónica?",
    "¿La IA puede crear arreglos de metales?",
  ],
  // COLOMBIA
  CUMBIALIN: [
    "¿Cómo crear cumbia electrónica con IA?",
    "¿Qué es la fusión cumbia-EDM?",
    "¿La IA puede simular gaita colombiana?",
    "¿Cómo producir música de carnaval con IA?",
  ],
  VALLENATALIN: [
    "¿Se puede crear vallenato con IA?",
    "¿Cómo modernizar el vallenato?",
    "¿La IA puede simular acordeón?",
    "¿Cómo escribir letras de vallenato con IA?",
  ],
  PARCELIN: [
    "¿Cómo producir reggaetón colombiano?",
    "¿Cómo distribuir mi música globalmente?",
    "¿Qué estrategias de marketing musical con IA?",
    "¿Cómo monetizar mi música con IA?",
  ],
  CAFETALIN: [
    "¿Cómo crear indie-folk con IA?",
    "¿La IA puede escribir letras poéticas?",
    "¿Qué es la producción lo-fi con IA?",
    "¿Cómo distribuir música indie?",
  ],
  CHAMPETAKLIN: [
    "¿Qué es la champeta y cómo crearla?",
    "¿Cómo producir afrobeat con IA?",
    "¿La IA puede crear ritmos africanos?",
    "¿Cómo llevar la champeta al streaming?",
  ],
};

// ─── RELATIONSHIP LEVEL CONFIG ───
const RELATIONSHIP_LEVELS_ORDER = ["new", "known", "friend", "best_friend"] as const;

const RELATIONSHIP_CONFIG: Record<string, {
  label: Record<string, string>;
  emoji: string;
  color: string;
  celebrationMsg: Record<string, string>;
}> = {
  new: {
    label: { es: "Desconocido", en: "Stranger", zh: "陌生人" },
    emoji: "👋",
    color: "#6B7280",
    celebrationMsg: { es: "", en: "", zh: "" },
  },
  known: {
    label: { es: "Conocido", en: "Acquaintance", zh: "认识" },
    emoji: "🤝",
    color: "#3B82F6",
    celebrationMsg: {
      es: "¡{name} ahora te reconoce! Sois conocidos.",
      en: "{name} now recognizes you! You're acquaintances.",
      zh: "{name}现在认识你了！你们是熟人了。",
    },
  },
  friend: {
    label: { es: "Amigo", en: "Friend", zh: "朋友" },
    emoji: "💚",
    color: "#10B981",
    celebrationMsg: {
      es: "¡{name} y tú sois amigos! Vuestra conexión crece.",
      en: "You and {name} are friends now! Your bond grows stronger.",
      zh: "你和{name}现在是朋友了！你们的关系更深了。",
    },
  },
  best_friend: {
    label: { es: "Confidente", en: "Confidant", zh: "知己" },
    emoji: "💎",
    color: "#8B5CF6",
    celebrationMsg: {
      es: "¡{name} te considera su confidente! Nivel máximo de amistad.",
      en: "{name} considers you a confidant! Maximum friendship level.",
      zh: "{name}把你当作知己了！最高友谊等级。",
    },
  },
};

// ─── CONFETTI CELEBRATION ───
function fireRelationshipConfetti(color: string) {
  // Respect prefers-reduced-motion
  if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return;
  }

  const duration = 2500;
  const end = Date.now() + duration;
  const accentColors = [color, "#00E5FF", "#D4A843", "#FFD700"];

  // Initial big burst
  confetti({
    particleCount: 80,
    spread: 80,
    origin: { y: 0.5 },
    colors: accentColors,
    zIndex: 10100,
    startVelocity: 35,
    gravity: 0.8,
    scalar: 1.1,
  });

  // Side bursts
  const interval = setInterval(() => {
    if (Date.now() > end) {
      clearInterval(interval);
      return;
    }
    confetti({
      particleCount: 20,
      angle: 60,
      spread: 50,
      origin: { x: 0, y: 0.5 },
      colors: accentColors,
      zIndex: 10100,
      startVelocity: 25,
    });
    confetti({
      particleCount: 20,
      angle: 120,
      spread: 50,
      origin: { x: 1, y: 0.5 },
      colors: accentColors,
      zIndex: 10100,
      startVelocity: 25,
    });
  }, 300);

  setTimeout(() => clearInterval(interval), duration + 100);
}

// ─── LEVEL-UP BANNER COMPONENT ───
function LevelUpBanner({
  artistName,
  newLevel,
  lang,
  artistColor,
  onDismiss,
}: {
  artistName: string;
  newLevel: string;
  lang: "es" | "en" | "zh" | "pt-BR" | "pt-PT";
  artistColor: string;
  onDismiss: () => void;
}) {
  const config = RELATIONSHIP_CONFIG[newLevel] || RELATIONSHIP_CONFIG.new;
  const message = (config.celebrationMsg[lang] || config.celebrationMsg.es).replace("{name}", artistName);

  useEffect(() => {
    const timer = setTimeout(onDismiss, 5000);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  return (
    <div
      className="mx-4 my-2 p-3 rounded-xl border-2 text-center animate-[levelUpPulse_0.6s_ease-out]"
      style={{
        background: `linear-gradient(135deg, ${config.color}15, ${artistColor}10)`,
        borderColor: config.color,
        boxShadow: `0 0 20px ${config.color}30, 0 0 40px ${config.color}15`,
      }}
    >
      <div className="flex items-center justify-center gap-2 mb-1">
        <span className="text-2xl">{config.emoji}</span>
        <span
          className="font-display font-black text-sm uppercase tracking-wider"
          style={{ color: config.color }}
        >
          {tl(lang, { es: "¡Nivel de relación subido!", en: "Level Up!", zh: "升级了！", 'pt-BR': "¡Nivel de relación subido!", 'pt-PT': "¡Nivel de relación subido!" })}
        </span>
        <span className="text-2xl">{config.emoji}</span>
      </div>
      <p className="text-white/80 text-xs leading-relaxed">{message}</p>
      <div className="mt-2 flex items-center justify-center gap-1">
        {RELATIONSHIP_LEVELS_ORDER.map((lvl) => {
          const lvlConfig = RELATIONSHIP_CONFIG[lvl];
          const isActive = RELATIONSHIP_LEVELS_ORDER.indexOf(lvl) <= RELATIONSHIP_LEVELS_ORDER.indexOf(newLevel as typeof RELATIONSHIP_LEVELS_ORDER[number]);
          return (
            <div
              key={lvl}
              className="flex items-center gap-0.5"
            >
              <span
                className={`w-6 h-1.5 rounded-full transition-all ${isActive ? "" : "opacity-20"}`}
                style={{ background: isActive ? lvlConfig.color : "#555" }}
              />
            </div>
          );
        })}
      </div>
      <style>{`
        @keyframes levelUpPulse {
          0% { transform: scale(0.8); opacity: 0; }
          50% { transform: scale(1.03); }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes referralSlideIn {
          0% { transform: translateY(8px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

// ─── REFERRAL DATA TYPE ───
type ReferralData = {
  key: string;
  displayName: string;
  specialty: string;
};

// ─── CHAT MESSAGE TYPE ───
type ChatMsg = {
  from: "artist" | "user" | "system";
  text: string;
  isLoading?: boolean;
  imageUrl?: string;
  imagePrompt?: string;
  referral?: ReferralData;
};

// ─── REFERRAL BUTTON COMPONENT ───
function ReferralButton({
  referral,
  lang,
  onSwitch,
}: {
  referral: ReferralData;
  lang: "es" | "en" | "zh" | "pt-BR" | "pt-PT";
  onSwitch: (key: string) => void;
}) {
  const avatarImg = getAvatarImage(referral.key);

  const label = tl(lang, { es: `Hablar con ${referral.displayName}`, en: `Talk to ${referral.displayName}`, zh: `与${referral.displayName}对话`, 'pt-BR': `Hablar con ${referral.displayName}`, 'pt-PT': `Hablar con ${referral.displayName}` });

  const specialtyLabel = tl(lang, { es: `Especialista en: ${referral.specialty}`, en: `Specialist in: ${referral.specialty}`, zh: `专长：${referral.specialty}`, 'pt-BR': `Especialista en: ${referral.specialty}`, 'pt-PT': `Especialista en: ${referral.specialty}` });

  return (
    <button
      onClick={() => onSwitch(referral.key)}
      className="mt-2 w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border border-[#00E5FF]/30 bg-[#00E5FF]/5 hover:bg-[#00E5FF]/15 hover:border-[#00E5FF]/50 transition-all duration-300 group animate-[referralSlideIn_0.5s_ease-out_both]"
    >
      {avatarImg && (
        <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-[#00E5FF]/40 flex-shrink-0 group-hover:border-[#00E5FF]/70 transition-colors">
          <img src={avatarImg} alt={referral.displayName} className="w-full h-full object-cover" />
        </div>
      )}
      <div className="flex-1 text-left min-w-0">
        <p className="text-[#00E5FF] font-display font-bold text-xs truncate group-hover:text-white transition-colors">
          {label}
        </p>
        <p className="text-white/30 text-[10px] truncate">{specialtyLabel}</p>
      </div>
      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#00E5FF]/10 flex items-center justify-center group-hover:bg-[#00E5FF]/30 transition-colors">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#00E5FF" strokeWidth="2.5">
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      </div>
    </button>
  );
}

// ─── COMPONENT ───
interface ArtistChatModalProps {
  artist: CharacterData;
  lang: "es" | "en" | "zh" | "pt-BR" | "pt-PT";
  onClose: () => void;
  onSwitchAvatar?: (avatarKey: string) => void;
  embedded?: boolean;
}

export function ArtistChatModal({ artist, lang, onClose, onSwitchAvatar, embedded = false }: ArtistChatModalProps) {
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [customInput, setCustomInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showImagePrompt, setShowImagePrompt] = useState(false);
  const [imagePromptText, setImagePromptText] = useState("");
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [showHistoryPanel, setShowHistoryPanel] = useState(true);

  // tRPC mutation for image generation
  const generateImageMutation = trpc.avatarChat.generateChatImage.useMutation();
  const { imageGeneration } = useFeatures();

  // Handle image generation
  const handleGenerateImage = async () => {
    const prompt = imagePromptText.trim();
    if (!prompt || isGeneratingImage) return;

    setShowImagePrompt(false);
    setIsGeneratingImage(true);
    setImagePromptText("");

    // Add user request and loading indicator
    setMessages(prev => [
      ...prev,
      { from: "user", text: `🎨 ${tl(lang, { es: "Generar imagen", en: "Generate image", zh: "生成图片", 'pt-BR': "Generar imagen", 'pt-PT': "Generar imagen" })}: ${prompt}` },
      { from: "artist", text: tl(lang, { es: "Generando tu imagen...", en: "Generating your image...", zh: "正在生成图片...", 'pt-BR': "Generando tu imagen...", 'pt-PT': "Generando tu imagen..." }), isLoading: true },
    ]);

    try {
      const result = await generateImageMutation.mutateAsync({
        prompt,
        avatarKey: artist.key,
      });

      // Replace loading with the generated image
      setMessages(prev => {
        const withoutLoading = prev.filter(m => !m.isLoading);
        return [
          ...withoutLoading,
          {
            from: "artist" as const,
            text: tl(lang, { es: "¡Aquí tienes tu imagen!", en: "Here's your image!", zh: "这是你的图片！", 'pt-BR': "¡Aquí tienes tu imagen!", 'pt-PT': "¡Aquí tienes tu imagen!" }),
            imageUrl: result.imageUrl,
            imagePrompt: result.prompt,
          },
        ];
      });
    } catch (error: any) {
      setMessages(prev => {
        const withoutLoading = prev.filter(m => !m.isLoading);
        return [
          ...withoutLoading,
          {
            from: "system" as const,
            text: `⚠️ ${tl(lang, { es: "No se pudo generar la imagen. Inténtalo de nuevo.", en: "Could not generate the image. Try again.", zh: "无法生成图片。请重试。", 'pt-BR': "No se pudo generar la imagen. Inténtalo de nuevo.", 'pt-PT': "No se pudo generar la imagen. Inténtalo de nuevo." })}`,
          },
        ];
      });
    } finally {
      setIsGeneratingImage(false);
    }
  };

  // Download image as PNG with LINCE IA watermark
  const handleDownloadImage = async (imageUrl: string, prompt: string) => {
    try {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        // Add LINCE IA watermark
        const fontSize = Math.max(14, Math.floor(img.width / 30));
        ctx.font = `bold ${fontSize}px 'Space Grotesk', sans-serif`;
        ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
        ctx.textAlign = "right";
        ctx.textBaseline = "bottom";

        // Shadow for better readability
        ctx.shadowColor = "rgba(0, 0, 0, 0.6)";
        ctx.shadowBlur = 4;
        ctx.shadowOffsetX = 1;
        ctx.shadowOffsetY = 1;

        ctx.fillText("LINCE IA", img.width - 15, img.height - 15);

        // Reset shadow
        ctx.shadowColor = "transparent";
        ctx.shadowBlur = 0;

        // Small subtitle
        const subSize = Math.max(10, Math.floor(fontSize * 0.6));
        ctx.font = `${subSize}px 'Space Grotesk', sans-serif`;
        ctx.fillStyle = "rgba(0, 229, 255, 0.4)";
        ctx.fillText("lince.app", img.width - 15, img.height - 15 - fontSize - 2);

        // Download
        const link = document.createElement("a");
        link.download = `lince-ia-${Date.now()}.png`;
        link.href = canvas.toDataURL("image/png");
        link.click();
      };
      img.src = imageUrl;
    } catch (e) {
      console.error("Download failed:", e);
    }
  };
  const [relationshipLevel, setRelationshipLevel] = useState<string>("new");
  const [historyLoaded, setHistoryLoaded] = useState(false);
  const [levelUpInfo, setLevelUpInfo] = useState<{ newLevel: string } | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const avatarUrl = AVATAR_PROFILE_PIC[artist.key] || AVATAR_MUSICALIN[artist.key] || AVATAR_FRONTAL[artist.key];
  const suggestions = ARTIST_SUGGESTIONS[artist.key] || ARTIST_SUGGESTIONS.LUMALIN;
  const prompt = getAvatarPrompt(artist.key);

  // Get the logged-in player's ID from GameContext
  const { loggedUser } = useGame();
  const gamePlayerId = loggedUser?.id ?? null;

  // Guest trial system
  const { isGuest, consumeTrial, canUseTrial, setShowConversionModal } = useGuest();
  const [guestTrialConsumed, setGuestTrialConsumed] = useState(false);

  // tRPC mutation for LLM chat
  const sendMessageMutation = trpc.avatarChat.sendMessage.useMutation();

  // Stable query input to avoid infinite re-renders
  const historyInput = useMemo(() => ({
    gamePlayerId: gamePlayerId ?? 0,
    avatarKey: artist.key,
    limit: 30,
  }), [gamePlayerId, artist.key]);

  // Load chat history from backend when modal opens
  const { data: historyData, isLoading: historyLoading } = trpc.avatarChat.getHistory.useQuery(
    historyInput,
    {
      enabled: !!gamePlayerId && gamePlayerId > 0,
      staleTime: 0,
      refetchOnWindowFocus: false,
    }
  );

  // Populate messages from history when data arrives
  useEffect(() => {
    if (historyLoaded) return;

    // ─── PERSONALIZED GREETING (Avatars that remember) ───
    const buildGreeting = (): string => {
      const baseGreeting = prompt
        ? prompt.welcomeMessage
        : tl(lang, { es: `¡Ey! Soy ${artist.name}. ¡Pregúntame lo que quieras sobre IA y te respondo con mi estilo único!`, en: `Hey! I'm ${artist.name}. Ask me anything about AI and I'll answer with my unique style!`, zh: `嘿！我是${artist.name}。问我任何关于AI的问题，我会用我独特的风格回答！`, 'pt-BR': `¡Ey! Soy ${artist.name}. ¡Pregúntame lo que quieras sobre IA y te respondo con mi estilo único!`, 'pt-PT': `¡Ey! Soy ${artist.name}. ¡Pregúntame lo que quieras sobre IA y te respondo con mi estilo único!` });

      // If returning user with history, add personalized touch
      if (historyData && historyData.messages.length > 0) {
        const msgCount = historyData.messages.length;
        const level = historyData.relationshipLevel || "new";
        // Get player name from localStorage game state
        let playerName = "";
        try { playerName = JSON.parse(localStorage.getItem("lince_game_state") || "{}").playerName || ""; } catch { /* ignore */ }
        const nameStr = playerName ? ` ${playerName}` : "";

        // Find last user message topic for context
        const lastUserMsg = [...historyData.messages].reverse().find(m => m.role === "user");
        const lastTopic = lastUserMsg?.content?.slice(0, 60) || "";

        if (level === "best_friend") {
          if (lang === "en") return `${nameStr ? `Hey${nameStr}!` : "Hey!"} Great to see you again! We've had ${msgCount} messages together. ${lastTopic ? `Last time you asked about "${lastTopic}..." — how did that go?` : "What shall we dive into today?"}`;
          if (lang === "zh") return `${nameStr ? `嘿${nameStr}！` : "嘿！"}很高兴再见到你！我们已经聊了${msgCount}条消息。${lastTopic ? `上次你问了"${lastTopic}..."——进展如何？` : "今天我们聊什么？"}`;
          if (lang === "pt-BR" || lang === "pt-PT") return `${nameStr ? `Ei${nameStr}!` : "Ei!"} Que bom te ver de novo! Já temos ${msgCount} mensagens juntos. ${lastTopic ? `Da última vez você perguntou sobre "${lastTopic}..." — como foi?` : "No que vamos mergulhar hoje?"}`;
          return `${nameStr ? `¡Ey${nameStr}!` : "¡Ey!"} ¡Qué bueno verte de nuevo! Ya llevamos ${msgCount} mensajes juntos. ${lastTopic ? `La última vez me preguntaste sobre "${lastTopic}..." ¿Cómo te fue con eso?` : "¿En qué nos metemos hoy?"}`;
        }
        if (level === "friend") {
          if (lang === "en") return `${nameStr ? `Hi${nameStr}!` : "Hi!"} Good to see you back! We've chatted ${msgCount} times already. What's on your mind today?`;
          if (lang === "zh") return `${nameStr ? `嗨${nameStr}！` : "嗨！"}很高兴你回来了！我们已经聊了${msgCount}次。今天想聊什么？`;
          if (lang === "pt-BR" || lang === "pt-PT") return `${nameStr ? `Olá${nameStr}!` : "Olá!"} Que bom que voltou! Já conversamos ${msgCount} vezes. O que está na sua mente hoje?`;
          return `${nameStr ? `¡Hola${nameStr}!` : "¡Hola!"} ¡Me alegra que vuelvas! Ya hemos charlado ${msgCount} veces. ¿Qué te ronda la cabeza hoy?`;
        }
        if (level === "known") {
          if (lang === "en") return `${nameStr ? `Hey${nameStr}!` : "Hey!"} Welcome back! I remember our last chat. Ready to keep learning?`;
          if (lang === "zh") return `${nameStr ? `嘿${nameStr}！` : "嘿！"}欢迎回来！我记得我们上次的聊天。准备好继续学习了吗？`;
          if (lang === "pt-BR" || lang === "pt-PT") return `${nameStr ? `Ei${nameStr}!` : "Ei!"} Bem-vindo de volta! Lembro da nossa última conversa. Pronto para continuar aprendendo?`;
          return `${nameStr ? `¡Ey${nameStr}!` : "¡Ey!"} ¡Bienvenid@ de vuelta! Me acuerdo de nuestra última charla. ¿Seguimos aprendiendo?`;
        }
      }
      return baseGreeting;
    };
    const greeting = buildGreeting();

    // If no player logged in or no history, just show welcome
    if (!gamePlayerId || gamePlayerId <= 0) {
      setMessages([{ from: "artist", text: greeting }]);
      setHistoryLoaded(true);
      return;
    }

    // Wait for history query to finish
    if (historyLoading) return;

    if (historyData && historyData.messages.length > 0) {
      // Convert backend messages to ChatMsg format
      const loadedMessages: ChatMsg[] = historyData.messages.map((m) => ({
        from: m.role === "user" ? ("user" as const) : ("artist" as const),
        text: m.content,
      }));

      // Prepend the welcome message and add a separator
      const separator: ChatMsg = {
        from: "system",
        text: tl(lang, { es: `── Conversación anterior (${historyData.messages.length} mensajes) ──`, en: `── Previous conversation (${historyData.messages.length} messages) ──`, zh: `── 之前的对话 (${historyData.messages.length} 条消息) ──`, 'pt-BR': `── Conversación anterior (${historyData.messages.length} mensajes) ──`, 'pt-PT': `── Conversación anterior (${historyData.messages.length} mensajes) ──` }),
      };

      setMessages([{ from: "artist", text: greeting }, separator, ...loadedMessages]);
      setRelationshipLevel(historyData.relationshipLevel ?? "new");
    } else {
      setMessages([{ from: "artist", text: greeting }]);
    }
    setHistoryLoaded(true);
  }, [historyData, historyLoading, historyLoaded, gamePlayerId, artist.name, lang, prompt]);

  // Auto-scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Build conversation history for the LLM (exclude system messages and loading).
  // The server accepts at most 20 entries, so only the most recent turns are sent.
  const getHistory = useCallback(() => {
    return messages
      .filter((m) => m.from !== "system" && !m.isLoading)
      .map((m) => ({
        role: m.from === "user" ? ("user" as const) : ("assistant" as const),
        content: m.text,
      }))
      .slice(-20);
  }, [messages]);

  // ─── LEVEL-UP DETECTION ───
  const checkLevelUp = useCallback((oldLevel: string, newLevel: string) => {
    const oldIdx = RELATIONSHIP_LEVELS_ORDER.indexOf(oldLevel as typeof RELATIONSHIP_LEVELS_ORDER[number]);
    const newIdx = RELATIONSHIP_LEVELS_ORDER.indexOf(newLevel as typeof RELATIONSHIP_LEVELS_ORDER[number]);
    if (newIdx > oldIdx && newIdx > 0) {
      // Level went up — fire confetti and show banner
      const config = RELATIONSHIP_CONFIG[newLevel];
      fireRelationshipConfetti(config?.color || artist.color);
      setLevelUpInfo({ newLevel });
    }
  }, [artist.color]);

  // Send message to LLM
  const sendToLLM = useCallback(
    async (text: string) => {
      if (isTyping) return;

      // Guest trial gate: consume 1 trial per NEW conversation (first message only)
      if (isGuest && !guestTrialConsumed) {
        if (!canUseTrial()) {
          setShowConversionModal(true);
          return;
        }
        const allowed = consumeTrial("chat", artist.key);
        if (!allowed) return;
        setGuestTrialConsumed(true);
      }

      // Add user message and typing indicator
      setMessages((prev) => [
        ...prev,
        { from: "user", text },
        { from: "artist", text: "...", isLoading: true },
      ]);
      setIsTyping(true);
      setCustomInput("");

      try {
        const history = getHistory();
        const previousLevel = relationshipLevel;

        const result = await sendMessageMutation.mutateAsync({
          avatarKey: artist.key,
          message: text,
          history,
          language: (lang === "pt-BR" || lang === "pt-PT" ? "es" : lang) as "es" | "en" | "zh",
          // Pass gamePlayerId so backend persists messages
          ...(gamePlayerId && gamePlayerId > 0 ? { gamePlayerId } : {}),
        });

        // Replace loading message with actual response
        setMessages((prev) => {
          const withoutLoading = prev.filter((m) => !m.isLoading);
          return [
            ...withoutLoading,
            {
              from: result.isInsultResponse ? ("system" as const) : ("artist" as const),
              text: result.isInsultResponse ? `⚠️ ${result.response}` : result.response,
            },
          ];
        });

        // Mark chat mission as complete for welcome missions
        try { localStorage.setItem("lince-mission-chat", "true"); } catch {}

        // Update relationship level from response and check for level-up
        if (result.relationshipLevel) {
          checkLevelUp(previousLevel, result.relationshipLevel);
          setRelationshipLevel(result.relationshipLevel);
        }

        // If there's a referral suggestion, add it as an interactive referral message
        if (result.referral) {
          setTimeout(() => {
            setMessages((prev) => [
              ...prev,
              {
                from: "system",
                text: tl(lang, { es: `💡 ¿Quieres saber más sobre ${result.referral!.specialty}?`, en: `💡 Want to learn more about ${result.referral!.specialty}?`, zh: `💡 想了解更多关于${result.referral!.specialty}的内容吗？`, 'pt-BR': `💡 ¿Quieres saber más sobre ${result.referral!.specialty}?`, 'pt-PT': `💡 ¿Quieres saber más sobre ${result.referral!.specialty}?` }),
                referral: {
                  key: result.referral!.key,
                  displayName: result.referral!.displayName,
                  specialty: result.referral!.specialty,
                },
              },
            ]);
          }, 1000);
        }
      } catch (error: any) {
        // Replace loading with error message
        setMessages((prev) => {
          const withoutLoading = prev.filter((m) => !m.isLoading);
          return [
            ...withoutLoading,
            {
              from: "system",
              text: `⚠️ ${
                error?.message?.includes("rate")
                  ? lang === "en"
                    ? "Too many messages! Wait a moment and try again."
                    : lang === "zh"
                      ? "消息太多了！等一下再试。"
                      : "¡Demasiados mensajes! Espera un momento e inténtalo de nuevo."
                  : tl(lang, { es: "¡Ups! Algo salió mal. Inténtalo de nuevo.", en: "Oops! Something went wrong. Try again.", zh: "哎呀！出了点问题。再试一次。", 'pt-BR': "¡Ups! Algo salió mal. Inténtalo de nuevo.", 'pt-PT': "¡Ups! Algo salió mal. Inténtalo de nuevo." })
              }`,
            },
          ];
        });
      } finally {
        setIsTyping(false);
      }
    },
    [artist.key, lang, getHistory, isTyping, sendMessageMutation, gamePlayerId, relationshipLevel, checkLevelUp, isGuest, guestTrialConsumed, canUseTrial, consumeTrial, setShowConversionModal]
  );

  // Handle suggested question click
  const handleSuggestion = (question: string) => {
    sendToLLM(question);
  };

  // Handle custom input
  const handleCustomInput = () => {
    const text = customInput.trim();
    if (!text || isTyping) return;
    sendToLLM(text);
  };

  // Clear chat (reset to welcome only, but keep DB history)
  const handleClearChat = () => {
    const greeting = prompt
      ? prompt.welcomeMessage
      : tl(lang, { es: `¡Ey! Soy ${artist.name}. ¡Pregúntame lo que quieras sobre IA!`, en: `Hey! I'm ${artist.name}. Ask me anything about AI!`, zh: `嘿！我是${artist.name}。问我任何关于AI的问题！`, 'pt-BR': `¡Ey! Soy ${artist.name}. ¡Pregúntame lo que quieras sobre IA!`, 'pt-PT': `¡Ey! Soy ${artist.name}. ¡Pregúntame lo que quieras sobre IA!` });
    setMessages([{ from: "artist", text: greeting }]);
  };

  // Filter out already-asked suggestions
  const remainingSuggestions = suggestions.filter(
    (q) => !messages.some((m) => m.from === "user" && m.text === q)
  );

  // Relationship indicator
  const relConfig = RELATIONSHIP_CONFIG[relationshipLevel] || RELATIONSHIP_CONFIG.new;
  const userMessageCount = messages.filter(m => m.from === "user").length;

  // ─── CHAT SESSIONS LIST (for history dropdown) ───
  const { loggedUser: gameUser } = useGame();
  const sessionsInput = useMemo(() => ({ gamePlayerId: gameUser?.id ?? 0 }), [gameUser?.id]);
  const { data: allSessions } = trpc.avatarChat.listSessions.useQuery(
    sessionsInput,
    { enabled: !!gameUser?.id && gameUser.id > 0, staleTime: 10000 }
  );
  const thisSessions = useMemo(() => {
    if (!allSessions) return [];
    return allSessions.filter(s => s.avatarKey === artist.key && s.messageCount > 0);
  }, [allSessions, artist.key]);

  return (
    <div className={embedded ? "flex flex-col h-full w-full" : "fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"} onClick={embedded ? undefined : onClose}>
      <div
        className={embedded ? "relative flex-1 flex flex-col bg-[#0A0A12] overflow-hidden" : "relative w-full max-w-lg max-h-[90vh] bg-[#0A0A12] border border-white/10 rounded-2xl overflow-hidden flex flex-col"}
        onClick={embedded ? undefined : (e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center gap-3 p-4 border-b border-white/5" style={{ background: `linear-gradient(135deg, ${artist.color}15, transparent)` }}>
          <div className="w-12 h-12 rounded-full overflow-hidden border-2 flex-shrink-0" style={{ borderColor: artist.color }}>
            <img src={avatarUrl} alt={artist.name} className="w-full h-full object-cover" />
          </div>
          <div className="min-w-0">
            <p className="font-display font-black text-sm" style={{ color: artist.color }}>{artist.name}</p>
            <p className="text-white/40 text-[10px] truncate">
              {prompt ? prompt.specialty : (artist.role[lang] || artist.role.es)}
              {artist.realArtist ? ` · ${artist.realArtist}` : ""}
            </p>
          </div>
          <div className="ml-auto flex items-center gap-2 flex-shrink-0">
            {/* Relationship indicator */}
            <span
              className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full"
              style={{ background: `${relConfig.color}20`, color: relConfig.color }}
              title={relConfig.label[lang] || relConfig.label.es}
            >
              {relConfig.emoji} {relConfig.label[lang] || relConfig.label.es}
            </span>
            <span className="flex items-center gap-1 text-[10px] text-emerald-400/60 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              IA
            </span>
            {/* History toggle button - always visible */}
              <button
                onClick={() => setShowHistoryPanel(!showHistoryPanel)}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[10px] font-bold transition-all border ${
                  showHistoryPanel
                    ? 'bg-[#00E5FF]/15 border-[#00E5FF]/30 text-[#00E5FF]'
                    : 'bg-white/5 border-white/10 text-white/40 hover:text-white/70 hover:border-white/20'
                }`}
                title={tl(lang, { es: 'Historial de conversaciones', en: 'Conversation history', zh: '对话历史', 'pt-BR': 'Historial de conversaciones', 'pt-PT': 'Historial de conversaciones' })}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                <span className="hidden sm:inline">{tl(lang, { es: 'Historial', en: 'History', zh: '历史', 'pt-BR': 'Historial', 'pt-PT': 'Historial' })}</span>
              </button>
            {embedded ? (
              <button onClick={onClose} aria-label="Volver a la Familia" className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#D4A843]/15 hover:bg-[#D4A843]/25 border border-[#D4A843]/30 text-[#D4A843] hover:text-[#D4A843] transition-all text-sm font-bold min-h-[40px]">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
                <span className="hidden sm:inline">Familia</span>
              </button>
            ) : (
              <button onClick={onClose} aria-label="Cerrar chat" className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/50 hover:text-white transition-all">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
              </button>
            )}
          </div>
        </div>

        {/* Fictional character disclaimer */}
        <FictionalDisclaimer variant="chat" lang={lang} className="mx-4 mt-2" />

        {/* Level-Up Celebration Banner */}
        {levelUpInfo && (
          <LevelUpBanner
            artistName={artist.name}
            newLevel={levelUpInfo.newLevel}
            lang={lang}
            artistColor={artist.color}
            onDismiss={() => setLevelUpInfo(null)}
          />
        )}

        {/* ─── HISTORY DROPDOWN PANEL ─── */}
        {showHistoryPanel && (
          <div className="border-b border-white/5 bg-gradient-to-b from-[#0a0e18] to-[#08080f] max-h-[220px] overflow-y-auto">
            <div className="px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-[#00E5FF]/60">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                <span className="text-xs font-bold text-white/50 uppercase tracking-wider">
                  {tl(lang, { es: `Conversaciones con ${artist.name}`, en: `Conversations with ${artist.name}`, zh: `与${artist.name}的对话`, 'pt-BR': `Conversaciones con ${artist.name}`, 'pt-PT': `Conversaciones con ${artist.name}` })}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => {
                    handleClearChat();
                    setShowHistoryPanel(false);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all border bg-emerald-500/10 border-emerald-500/25 text-emerald-400 hover:bg-emerald-500/20 hover:border-emerald-500/40"
                  title={tl(lang, { es: 'Iniciar nueva conversación', en: 'Start new conversation', zh: '开始新对话', 'pt-BR': 'Iniciar nueva conversación', 'pt-PT': 'Iniciar nueva conversación' })}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                  <span>{tl(lang, { es: 'Nueva', en: 'New', zh: '新建', 'pt-BR': 'Nueva', 'pt-PT': 'Nueva' })}</span>
                </button>
                <button
                  onClick={() => setShowHistoryPanel(false)}
                  className="p-1 rounded-lg text-white/30 hover:text-white/60 hover:bg-white/5 transition-all"
                  title={tl(lang, { es: 'Ocultar historial', en: 'Hide history', zh: '隐藏历史', 'pt-BR': 'Ocultar historial', 'pt-PT': 'Ocultar historial' })}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 15l-6-6-6 6" /></svg>
                </button>
              </div>
            </div>
            {(!gamePlayerId || gamePlayerId <= 0) ? (
              <div className="px-4 pb-4 text-center">
                <p className="text-white/30 text-xs">
                  {tl(lang, { es: 'Regístrate en el juego para guardar tus conversaciones.', en: 'Register in the game to save your conversations.', zh: '注册游戏以保存你的对话。', 'pt-BR': 'Regístrate en el juego para guardar tus conversaciones.', 'pt-PT': 'Regístrate en el juego para guardar tus conversaciones.' })}
                </p>
                <a href="/registro" className="inline-flex items-center gap-1.5 mt-2 px-4 py-2 rounded-xl bg-[#00E5FF]/10 border border-[#00E5FF]/20 text-[#00E5FF] text-xs font-bold hover:bg-[#00E5FF]/20 transition-all">
                  {tl(lang, { es: 'Registrarse', en: 'Register', zh: '注册', 'pt-BR': 'Registrarse', 'pt-PT': 'Registrarse' })}
                </a>
              </div>
            ) : thisSessions.length === 0 ? (
              <div className="px-4 pb-4 text-center">
                <div className="w-10 h-10 rounded-full bg-white/[0.03] border border-white/[0.06] flex items-center justify-center mx-auto mb-2">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-white/15">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                </div>
                <p className="text-white/30 text-xs">
                  {tl(lang, { es: 'Esta es tu primera conversación. ¡Se guardará automáticamente!', en: 'This is your first conversation. It will be saved automatically!', zh: '这是你的第一次对话。它会自动保存！', 'pt-BR': 'Esta es tu primera conversación. ¡Se guardará automáticamente!', 'pt-PT': 'Esta es tu primera conversación. ¡Se guardará automáticamente!' })}
                </p>
              </div>
            ) : (
              <div className="px-3 pb-3 space-y-2">
                {thisSessions.map((session) => {
                  const relCfg = RELATIONSHIP_CONFIG[session.relationshipLevel] || RELATIONSHIP_CONFIG.new;
                  const dateStr = session.updatedAt ? new Date(session.updatedAt).toLocaleDateString(lang === 'en' ? 'en-US' : lang === 'zh' ? 'zh-CN' : 'es-ES', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : '';
                  return (
                    <div
                      key={session.id}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/[0.06] hover:border-[#00E5FF]/20 transition-all cursor-pointer group"
                    >
                      {/* Session icon */}
                      <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: `${relCfg.color}15`, border: `1.5px solid ${relCfg.color}30` }}>
                        <span className="text-sm">{relCfg.emoji}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-xs font-bold" style={{ color: relCfg.color }}>
                            {relCfg.label[lang] || relCfg.label.es}
                          </span>
                          <span className="text-[10px] text-white/25">· {session.messageCount} {tl(lang, { es: 'mensajes', en: 'messages', zh: '条消息', 'pt-BR': 'mensajes', 'pt-PT': 'mensajes' })}</span>
                        </div>
                        {session.lastMessagePreview && (
                          <p className="text-xs text-white/35 truncate leading-tight group-hover:text-white/50 transition-colors">
                            {session.lastMessagePreview}
                          </p>
                        )}
                        <p className="text-[10px] text-white/20 mt-1">{dateStr}</p>
                      </div>
                      {/* Arrow indicator */}
                      <div className="flex-shrink-0 text-white/10 group-hover:text-[#00E5FF]/40 transition-colors">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6" /></svg>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Loading history indicator */}
        {historyLoading && gamePlayerId && gamePlayerId > 0 && (
          <div className="px-4 py-2 text-center">
            <span className="text-[10px] text-white/30 flex items-center justify-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-white/20 animate-pulse" />
              {tl(lang, { es: "Cargando historial de conversación...", en: "Loading conversation history...", zh: "加载对话历史...", 'pt-BR': "Cargando historial de conversación...", 'pt-PT': "Cargando historial de conversación..." })}
            </span>
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0" style={{ maxHeight: "50vh" }}>
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[85%] px-3 py-2 rounded-xl text-xs sm:text-sm leading-relaxed ${
                  msg.from === "user"
                    ? "bg-white/10 text-white rounded-br-sm"
                    : msg.from === "system"
                      ? "bg-white/3 border border-white/5 text-white/30 rounded-bl-sm text-center text-[10px] italic"
                      : "bg-white/5 text-white/80 rounded-bl-sm"
                }`}
                style={msg.from === "artist" ? { borderLeft: `2px solid ${artist.color}` } : {}}
              >
                {msg.isLoading ? (
                  <span className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ background: artist.color, animationDelay: "0ms" }} />
                    <span className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ background: artist.color, animationDelay: "150ms" }} />
                    <span className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ background: artist.color, animationDelay: "300ms" }} />
                  </span>
                ) : (
                  <>
                    <span style={{ whiteSpace: "pre-wrap" }}>{msg.text}</span>
                    {msg.imageUrl && (
                      <div className="mt-2 relative group">
                        <img
                          src={msg.imageUrl}
                          alt={msg.imagePrompt || "Generated image"}
                          className="w-full max-w-[280px] rounded-lg border border-white/10"
                          loading="lazy"
                        />
                        <button
                          onClick={() => handleDownloadImage(msg.imageUrl!, msg.imagePrompt || "image")}
                          className="absolute bottom-2 right-2 px-2 py-1 rounded-md bg-black/70 text-white text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 hover:bg-black/90"
                          title={tl(lang, { es: "Descargar PNG", en: "Download PNG", zh: "下载PNG", 'pt-BR': "Descargar PNG", 'pt-PT': "Descargar PNG" })}
                        >
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
                          PNG
                        </button>
                        <span className="absolute bottom-2 left-2 text-[8px] text-white/30 font-bold">LINCE IA</span>
                      </div>
                    )}
                    {msg.from === "artist" && !msg.imageUrl && (
                      <ShareDownloadBar
                        content={{ type: "chat_response", text: msg.text }}
                        compact
                        className="mt-2 pt-2 border-t border-white/5"
                      />
                    )}
                    {msg.referral && onSwitchAvatar && (
                      <ReferralButton
                        referral={msg.referral}
                        lang={lang}
                        onSwitch={onSwitchAvatar}
                      />
                    )}
                  </>
                )}
              </div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>

        {/* Suggested Questions */}
        {remainingSuggestions.length > 0 && !isTyping && (
          <div className="px-4 py-2 border-t border-white/5 overflow-x-auto">
            <p className="text-[9px] text-white/20 mb-1.5 font-bold uppercase">
              {tl(lang, { es: "Preguntas sugeridas", en: "Suggested questions", zh: "建议问题", 'pt-BR': "Preguntas sugeridas", 'pt-PT': "Preguntas sugeridas" })}
            </p>
            <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
              {remainingSuggestions.slice(0, 4).map((q, i) => (
                <button
                  key={i}
                  onClick={() => handleSuggestion(q)}
                  disabled={isTyping}
                  className="flex-shrink-0 px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white text-[10px] sm:text-xs transition-all border border-white/5 hover:border-white/15 disabled:opacity-30"
                >
                  {q.length > 40 ? q.slice(0, 40) + "..." : q}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Image Prompt Modal */}
        {showImagePrompt && (
          <div className="px-4 py-3 border-t border-white/5 bg-[#0A0A15]">
            <p className="text-[10px] text-white/40 mb-2 font-bold">
              {tl(lang, { es: "Describe la imagen que quieres crear:", en: "Describe the image you want to create:", zh: "描述你想创建的图片：", 'pt-BR': "Describe la imagen que quieres crear:", 'pt-PT': "Describe la imagen que quieres crear:" })}
            </p>
            <div className="flex gap-2">
              <input
                type="text"
                value={imagePromptText}
                onChange={(e) => setImagePromptText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleGenerateImage()}
                placeholder={tl(lang, { es: "Un lince futurista programando...", en: "A futuristic lynx coding...", zh: "一只未来主义的山猫在编程...", 'pt-BR': "Un lince futurista programando...", 'pt-PT': "Un lince futurista programando..." })}
                autoFocus
                className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder:text-white/20 focus:outline-none focus:border-[#00E5FF]/30"
              />
              <button
                onClick={handleGenerateImage}
                disabled={!imagePromptText.trim() || isGeneratingImage}
                className="px-3 py-2 rounded-lg font-bold text-xs transition-all disabled:opacity-30 bg-gradient-to-r from-[#00E5FF] to-[#7C4DFF] text-black"
              >
                {isGeneratingImage ? (
                  <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" strokeDasharray="60" strokeDashoffset="20" />
                  </svg>
                ) : (
                  tl(lang, { es: "Crear", en: "Create", zh: "创建", 'pt-BR': "Crear", 'pt-PT': "Crear" })
                )}
              </button>
              <button
                onClick={() => { setShowImagePrompt(false); setImagePromptText(""); }}
                className="px-2 py-2 rounded-lg text-white/40 hover:text-white/70 text-xs transition-all"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {/* Input */}
        <div className="p-3 border-t border-white/5 bg-[#050508]">
          <div className="flex gap-2">
            {/* Image generation button */}
            {imageGeneration && (
            <button
              onClick={() => setShowImagePrompt(!showImagePrompt)}
              disabled={isTyping || isGeneratingImage}
              className={`px-2.5 py-2 rounded-lg text-xs transition-all border disabled:opacity-30 ${
                showImagePrompt
                  ? "bg-[#00E5FF]/20 border-[#00E5FF]/30 text-[#00E5FF]"
                  : "bg-white/5 border-white/10 text-white/40 hover:text-white/70 hover:border-white/20"
              }`}
              title={tl(lang, { es: "Generar imagen", en: "Generate image", zh: "生成图片", 'pt-BR': "Generar imagen", 'pt-PT': "Generar imagen" })}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
            </button>
            )}
            <input
              type="text"
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleCustomInput()}
              placeholder={
                isTyping
                  ? lang === "en" ? "Thinking..." : lang === "zh" ? "思考中..." : "Pensando..."
                  : isGeneratingImage
                    ? lang === "en" ? "Generating image..." : lang === "zh" ? "生成图片中..." : "Generando imagen..."
                    : tl(lang, { es: "Pregúntame lo que quieras sobre IA...", en: "Ask me anything about AI...", zh: "问我任何关于AI的问题...", 'pt-BR': "Pregúntame lo que quieras sobre IA...", 'pt-PT': "Pregúntame lo que quieras sobre IA..." })
              }
              disabled={isTyping || isGeneratingImage}
              className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder:text-white/20 focus:outline-none focus:border-white/20 disabled:opacity-50"
            />
            <button
              onClick={handleCustomInput}
              disabled={isTyping || isGeneratingImage || !customInput.trim()}
              className="px-3 py-2 rounded-lg font-bold text-xs transition-all disabled:opacity-30"
              style={{ background: artist.color, color: "#000" }}
            >
              {isTyping ? (
                <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" strokeDasharray="60" strokeDashoffset="20" />
                </svg>
              ) : (
                tl(lang, { es: "Enviar", en: "Send", zh: "发送", 'pt-BR': "Enviar", 'pt-PT': "Enviar" })
              )}
            </button>
          </div>
          <div className="flex items-center justify-between mt-2">
            <p className="text-[9px] text-white/15">
              {tl(lang, { es: "Impulsado por ", en: "Powered by ", zh: "由 ", 'pt-BR': "Impulsado por ", 'pt-PT': "Impulsado por " })}
              <span className="text-[#00E5FF]/40">LINCE IA</span>
              {lang === "en" ? " · " : " · "}
              <a href="mailto:info@acnb.es" className="text-[#00E5FF]/30 hover:text-[#00E5FF] underline">info@acnb.es</a>
            </p>
            <div className="flex items-center gap-2">
              <span className="text-[9px] text-white/20 font-mono">
                {userMessageCount}/20
              </span>
              {messages.length > 1 && (
                <button
                  onClick={handleClearChat}
                  className="text-[9px] text-white/20 hover:text-white/50 transition-colors"
                  title={tl(lang, { es: "Limpiar chat", en: "Clear chat", zh: "清除聊天", 'pt-BR': "Limpiar chat", 'pt-PT': "Limpiar chat" })}
                >
                  ↻
                </button>
              )}
              <p className="text-[9px] text-emerald-400/40 flex items-center gap-1">
                <span className="w-1 h-1 rounded-full bg-emerald-400" />
                {tl(lang, { es: "IA en tiempo real", en: "AI-powered", zh: "AI驱动", 'pt-BR': "IA en tiempo real", 'pt-PT': "IA en tiempo real" })}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

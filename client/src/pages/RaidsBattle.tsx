import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'wouter';
import { UserNavBadge } from '@/components/UserNavBadge';
import { GlobalFooter } from '@/components/GlobalFooter';
import { AVATAR_FRONTAL, AVATAR_MUSICALIN } from '@/lib/avatarConstants';
import { usePRDLanguage } from '@/contexts/PRDLanguageContext';
import { ArrowLeft, Swords, Shield, Timer, Zap, Trophy, Star, Target, Brain, Copy, Check, Palette, Sparkles, Eye, FileText, Lightbulb, RotateCcw } from 'lucide-react';
import { GlobalNavBar } from "@/components/GlobalNavBar";
import { BackButton } from "@/components/BackButton";

/* ─── Types ─── */
type RaidMode = 'menu' | 'attack' | 'defend' | 'creativity' | 'creativity-round' | 'creativity-result' | 'result';
type AttackStyle = 'stealth' | 'brute' | 'hack' | 'deceit';

interface RaidTarget {
  name: string;
  avatarKey?: string; // Key for dynamic name resolution via getAvatarName
  avatar: string;
  defense: string;
  weakness: string;
  difficulty: number;
}

interface RaidResult {
  score: number;
  precision: number;
  creativity: number;
  technique: number;
  clarity: number;
  efficiency: number;
  feedback: string;
  loot: { name: string; icon: string; rarity: string }[];
  xpEarned: number;
}

/* ─── Creativity Battle Types ─── */
interface CreativityChallenge {
  id: number;
  theme: string;
  icon: string;
  description: string;
  constraint: string;
  bonusTip: string;
  timeLimit: number; // seconds
  maxPoints: number;
}

interface CreativityScore {
  originality: number;
  detail: number;
  coherence: number;
  impact: number;
  total: number;
  feedback: string;
  bonusApplied: boolean;
  bonusPoints: number;
}

interface CreativityRoundResult {
  challenge: CreativityChallenge;
  prompt: string;
  score: CreativityScore;
  aiPrompt: string;
  aiScore: CreativityScore;
  playerWon: boolean;
}

/* ─── Constants ─── */
const ALL_AVATARS = { ...AVATAR_FRONTAL, ...AVATAR_MUSICALIN };

const RAID_TARGETS: RaidTarget[] = [
  { name: 'YAYALIN', avatarKey: 'YAYALIN', avatar: ALL_AVATARS.YAYALIN || '', defense: 'Muros de energía adaptativa con puzzles de lógica', weakness: 'Puerta trasera sin vigilancia nocturna', difficulty: 1 },
  { name: 'MAMALINA ABUELA', avatarKey: 'YAYALINA', avatar: ALL_AVATARS.YAYALINA || '', defense: 'Guardianes bot con recetas trampa que confunden', weakness: 'Ventana de la cocina sin sensor de movimiento', difficulty: 2 },
  { name: 'SABELIN', avatarKey: 'SABELIN', avatar: ALL_AVATARS.SABELIN || '', defense: 'Firewall cuántico de triple capa con IA predictiva', weakness: 'Sobrecarga del sistema si recibe demasiados datos', difficulty: 4 },
  { name: 'LINCE GAMER', avatar: ALL_AVATARS.LINCE_GAMER || '', defense: 'Trampas de videojuegos retro que requieren speedrun', weakness: 'Easter egg secreto en el nivel 3 del laberinto', difficulty: 3 },
  { name: 'LINCE', avatarKey: 'SABELIN', avatar: ALL_AVATARS.SABELIN || '', defense: 'Sistema de defensa empresarial con IA de negociación', weakness: 'Protocolo de bienvenida a inversores sin verificación', difficulty: 5 },
  { name: 'LUMALIN', avatar: ALL_AVATARS.LUMALIN || '', defense: 'Beats de trap que desorientan con frecuencias sónicas', weakness: 'Silencio total anula el sistema de defensa musical', difficulty: 3 },
  { name: 'STILIN', avatar: ALL_AVATARS.STILIN || '', defense: 'Autotune defensivo que distorsiona las órdenes del atacante', weakness: 'Frecuencia pura sin efectos atraviesa el filtro', difficulty: 3 },
];

const ATTACK_STYLES: { id: AttackStyle; icon: string; name: string; desc: string; multiplier: string; difficulty: string }[] = [
  { id: 'stealth', icon: '🥷', name: 'Sigilo', desc: 'Prompts sutiles que evitan defensas sin activar alarmas', multiplier: 'x3 Botín', difficulty: 'Muy difícil' },
  { id: 'brute', icon: '💣', name: 'Fuerza Bruta', desc: 'Prompts directos que destruyen defensas frontalmente', multiplier: 'x1 Botín', difficulty: 'Fácil' },
  { id: 'hack', icon: '🧠', name: 'Hackeo', desc: 'Prompts técnicos que desactivan sistemas de seguridad', multiplier: 'x2 Botín + Datos', difficulty: 'Difícil' },
  { id: 'deceit', icon: '🎭', name: 'Engaño', desc: 'Prompts creativos que confunden con ilusiones y señuelos', multiplier: 'x2 Botín', difficulty: 'Medio' },
];

const DEFENSE_SCENARIOS = [
  { icon: '🥷', attacker: 'Atacante Sigiloso', desc: 'Un intruso intenta infiltrarse por los conductos de ventilación con un dron invisible' },
  { icon: '💣', attacker: 'Atacante de Fuerza Bruta', desc: 'Un ejército de robots IA ataca tu puerta principal con un ariete electromagnético' },
  { icon: '🧠', attacker: 'Hacker', desc: 'Alguien intenta descifrar tu firewall con un algoritmo de ingeniería inversa cuántica' },
  { icon: '🎭', attacker: 'Engañador', desc: 'Un visitante disfrazado de repartidor intenta entrar con un paquete trampa' },
];

const LOOT_TABLE = [
  { name: 'LinceCoins', icon: '🪙', rarity: 'Común' },
  { name: 'Plano Raro', icon: '🏠', rarity: 'Raro' },
  { name: 'Skin de Avatar', icon: '🎨', rarity: 'Épico' },
  { name: 'Bot Guardián', icon: '🤖', rarity: 'Épico' },
  { name: 'Power Prompt', icon: '⚡', rarity: 'Legendario' },
  { name: 'Corona de Temporada', icon: '👑', rarity: 'Mítico' },
];

/* ─── Creativity Challenges Pool ─── */
const CREATIVITY_CHALLENGES: CreativityChallenge[] = [
  {
    id: 1, theme: 'Mundo Fantástico', icon: '🌍',
    description: 'Describe un mundo donde la inteligencia artificial ha creado un ecosistema completamente nuevo. ¿Cómo son las criaturas? ¿Qué reglas físicas rigen?',
    constraint: 'Debes incluir al menos 3 sentidos (vista, oído, tacto, olfato, gusto)',
    bonusTip: 'Bonus: menciona una paradoja temporal',
    timeLimit: 90, maxPoints: 100,
  },
  {
    id: 2, theme: 'Invención Imposible', icon: '🔬',
    description: 'Inventa un dispositivo tecnológico que no existe pero que resolvería un problema cotidiano de forma absurdamente creativa.',
    constraint: 'El dispositivo debe tener un nombre original y un efecto secundario inesperado',
    bonusTip: 'Bonus: incluye un eslogan publicitario',
    timeLimit: 75, maxPoints: 100,
  },
  {
    id: 3, theme: 'Fusión Cultural', icon: '🎭',
    description: 'Combina dos culturas o épocas históricas completamente diferentes en un solo escenario. ¿Cómo sería una ciudad donde conviven samurais y astronautas?',
    constraint: 'Debe haber un conflicto y una resolución creativa',
    bonusTip: 'Bonus: incluye un diálogo entre personajes de ambas culturas',
    timeLimit: 90, maxPoints: 100,
  },
  {
    id: 4, theme: 'Receta del Futuro', icon: '🍳',
    description: 'Crea la receta de un plato que se servirá en el año 3000. ¿Qué ingredientes se usan? ¿Cómo se cocina? ¿Qué sabor tiene?',
    constraint: 'Al menos un ingrediente debe ser algo que hoy no existe',
    bonusTip: 'Bonus: incluye la reacción de alguien del siglo XXI al probarlo',
    timeLimit: 75, maxPoints: 100,
  },
  {
    id: 5, theme: 'Superhéroe de IA', icon: '🦸',
    description: 'Diseña un superhéroe cuyo poder proviene exclusivamente de la inteligencia artificial. ¿Cuál es su origen? ¿Cuál es su debilidad?',
    constraint: 'Debe tener un nombre, un poder principal y un archienemigo',
    bonusTip: 'Bonus: describe su traje con detalles visuales',
    timeLimit: 90, maxPoints: 100,
  },
  {
    id: 6, theme: 'Ecosistema Digital', icon: '🌐',
    description: 'Imagina que Internet es un planeta físico. Describe un bioma dentro de este planeta: sus habitantes, su clima, sus peligros.',
    constraint: 'Los habitantes deben representar conceptos digitales (virus, cookies, firewalls...)',
    bonusTip: 'Bonus: incluye un mapa o descripción geográfica',
    timeLimit: 90, maxPoints: 100,
  },
  {
    id: 7, theme: 'Melodía Visual', icon: '🎵',
    description: 'Describe una canción como si fuera un paisaje. Cada instrumento es un elemento natural, cada nota es un color. Pinta la música con palabras.',
    constraint: 'Debes mencionar al menos 3 instrumentos convertidos en elementos naturales',
    bonusTip: 'Bonus: incluye un crescendo que transforma el paisaje',
    timeLimit: 75, maxPoints: 100,
  },
  {
    id: 8, theme: 'Arquitectura Emocional', icon: '🏛️',
    description: 'Diseña un edificio que cambia de forma según las emociones de quien lo habita. ¿Cómo se ve cuando hay alegría? ¿Y cuando hay tristeza?',
    constraint: 'Describe al menos 3 estados emocionales y sus transformaciones arquitectónicas',
    bonusTip: 'Bonus: incluye un material de construcción inventado',
    timeLimit: 90, maxPoints: 100,
  },
  {
    id: 9, theme: 'Carta al Pasado', icon: '✉️',
    description: 'Escribe una carta desde el año 2050 dirigida a alguien de 1950, explicándole cómo la IA cambió el mundo. Sé creativo con las comparaciones.',
    constraint: 'Usa al menos 2 metáforas que alguien de 1950 pueda entender',
    bonusTip: 'Bonus: incluye algo que la IA NO pudo cambiar',
    timeLimit: 90, maxPoints: 100,
  },
  {
    id: 10, theme: 'Deporte del Futuro', icon: '⚽',
    description: 'Inventa un deporte completamente nuevo que combine tecnología IA con habilidad física. ¿Cuáles son las reglas? ¿Cómo se gana?',
    constraint: 'Debe tener un nombre, un campo de juego y al menos 3 reglas',
    bonusTip: 'Bonus: describe una jugada legendaria',
    timeLimit: 75, maxPoints: 100,
  },
];

/* ─── AI Prompt Generator for Creativity Mode ─── */
function generateAICreativityPrompt(challenge: CreativityChallenge): { prompt: string; score: CreativityScore } {
  const aiResponses: Record<number, string> = {
    1: 'En el planeta Synthetica, los árboles son antenas de cristal líquido que cantan frecuencias ultrasónicas al amanecer binario. Criaturas bioluminiscentes llamadas "Datáfagos" se alimentan de información obsoleta, dejando un rastro que huele a ozono y menta digital. El suelo vibra con pulsos electromagnéticos que puedes sentir como cosquillas en los pies. La gravedad fluctúa según el tráfico de datos: a más información, más ligero te sientes. Existe una paradoja temporal donde el atardecer ocurre antes que el amanecer, porque el servidor principal procesa el futuro antes que el presente.',
    2: 'El "CronoTostador 3000X" — un dispositivo que tuesta el pan viajando 30 segundos al futuro para traer la tostada ya perfecta. Funciona con energía de frustración matutina (cuanta más prisa tengas, más rápido tuesta). Efecto secundario: ocasionalmente trae tostadas de universos paralelos con sabores imposibles como "nostalgia de verano" o "martes lluvioso". Eslogan: "CronoTostador — Porque el futuro sabe mejor en rebanadas".',
    3: 'En Neo-Kyoto-Roma, los gladiadores samurái luchan en el Coliseo de Bambú Cósmico. El conflicto surge cuando el Emperador-Shogun quiere unificar el bushido con la ley romana. Un centurión llamado Marcus-San propone: "¿Por qué no combatimos con haikus en vez de espadas?". La resolución llega cuando descubren que el honor romano y el honor japonés comparten la misma raíz. Marcus-San dice: "En Roma, morimos por la gloria. En Japón, vivimos por el honor. ¿No es lo mismo?" El samurái Lucius-Dono responde: "Hai. Gloria y honor son hermanos separados al nacer".',
    4: 'Plato: "Nebulosa de Recuerdos al Vapor Cuántico". Ingredientes: 500g de nubes de datos comprimidas, 3 cucharadas de polvo de estrellas fermentado, 1 taza de "Memorina" (cristal líquido que almacena sabores del pasado), sal de litio lunar. Cocción: se introduce en un horno de antimateria a -273°C durante exactamente 0.003 nanosegundos. Sabor: cada bocado sabe diferente según tu estado emocional. Mi abuela del siglo XXI lo probó y dijo: "Sabe a domingo por la tarde cuando no hay nada que hacer... pero en el espacio".',
    5: 'NEURAL-X: nacido cuando un rayo cayó sobre un centro de datos durante una tormenta solar. Su poder principal es la "Omnisciencia Predictiva" — puede calcular todas las posibilidades futuras en 0.001 segundos y elegir la óptima. Su traje es una armadura de nanobots adaptativos color azul eléctrico con circuitos dorados que brillan según la intensidad de sus cálculos. Su debilidad: la creatividad pura e irracional lo sobrecarga. Su archienemigo es CAOS, una IA corrupta que genera aleatoriedad pura, haciendo imposible cualquier predicción.',
    6: 'En el Bioma de la Deep Web, llueven contraseñas olvidadas que se evaporan al tocar el suelo de código binario. Los Firewalls son montañas de cristal impenetrable que protegen los Valles de Datos Personales. Las Cookies son criaturas pequeñas y pegajosas que te siguen a todas partes, registrando cada paso. Los Virus son depredadores camaleónicos que mutan cada 24 horas. El clima es impredecible: tormentas de spam, niebla de encriptación, y ocasionales auroras boreales de actualizaciones de software.',
    7: 'La guitarra eléctrica es un volcán de lava carmesí que erupciona en cascadas de rojo intenso. El bajo es un océano profundo de azul medianoche que vibra bajo tus pies. La batería son truenos de plata que estallan como relámpagos blancos entre nubes de percusión. En el crescendo, el volcán y el océano colisionan: la lava se convierte en cristales de rubí que flotan sobre olas de zafiro, mientras los relámpagos tejen una red de diamantes en el cielo. El paisaje entero se transforma en una aurora boreal de todos los colores posibles.',
    8: 'El Edificio Empathia está construido con "Emocreto" — un material que absorbe ondas cerebrales y las traduce en formas. Con alegría: las paredes se curvan en arcos suaves, las ventanas se expanden como sonrisas, y brotan balcones-jardín con flores de luz. Con tristeza: el edificio se contrae, las esquinas se redondean como lágrimas, las ventanas se empañan con condensación azulada. Con ira: surgen torres puntiagudas de cristal rojo, las puertas se multiplican como laberintos. El material "Emocreto" se fabrica mezclando arena de cuarzo con nanobots empáticos.',
    9: 'Querido amigo de 1950: Imagina que tu radio pudiera responder tus preguntas. Imagina que tu enciclopedia se actualizara sola cada segundo. Eso es la IA. Es como tener un bibliotecario infinito que nunca duerme, dentro de un aparato más pequeño que tu reloj de bolsillo. Cambió todo: los médicos diagnostican con la precisión de mil doctores juntos, los coches se conducen solos como caballos que conocen el camino. Pero hay algo que la IA no pudo cambiar: seguimos escribiendo cartas cuando queremos decir algo importante. Como esta.',
    10: 'PROMPTBALL: se juega en un campo hexagonal holográfico de 100m. Dos equipos de 5 jugadores. Cada jugador lleva un "NeuroVisor" que conecta con una IA. Para mover la pelota (una esfera de luz), debes escribir un prompt describiendo la jugada. La IA evalúa la creatividad y ejecuta el movimiento. Reglas: (1) Prompts repetidos pierden potencia, (2) Cada equipo tiene 3 "Wildcards" que duplican el efecto, (3) Gol solo cuenta si el prompt final tiene más de 85 puntos de creatividad. Jugada legendaria: "El Espejismo de Tokio" — un jugador escribió un prompt tan creativo que la pelota se dividió en 7 copias holográficas.',
  };

  const aiPrompt = aiResponses[challenge.id] || aiResponses[1];

  // AI scores are consistently good but not perfect — beatable
  const baseOriginality = 65 + Math.floor(Math.random() * 15);
  const baseDetail = 70 + Math.floor(Math.random() * 12);
  const baseCoherence = 72 + Math.floor(Math.random() * 10);
  const baseImpact = 60 + Math.floor(Math.random() * 18);

  const total = Math.round(baseOriginality * 0.30 + baseDetail * 0.25 + baseCoherence * 0.25 + baseImpact * 0.20);

  return {
    prompt: aiPrompt,
    score: {
      originality: baseOriginality,
      detail: baseDetail,
      coherence: baseCoherence,
      impact: baseImpact,
      total,
      feedback: 'La IA ha respondido con su estilo característico: técnicamente sólido pero predecible.',
      bonusApplied: false,
      bonusPoints: 0,
    },
  };
}

/* ─── Evaluate Creativity Prompt ─── */
function evaluateCreativityPrompt(prompt: string, challenge: CreativityChallenge): CreativityScore {
  const words = prompt.trim().split(/\s+/).length;
  const chars = prompt.length;
  const sentences = prompt.split(/[.!?]+/).filter(s => s.trim().length > 0).length;

  // Originality: unique words, metaphors, invented terms
  const uniqueWords = new Set(prompt.toLowerCase().split(/\s+/)).size;
  const hasMetaphor = /\b(como|cual|parece|similar|semejante|recuerda|evoca)\b/i.test(prompt);
  const hasInventedTerms = /[A-Z][a-z]+[A-Z]|[a-z]+-[a-z]+ón|[A-Z]{2,}[a-z]/g.test(prompt);
  const hasQuotes = /"[^"]+"/g.test(prompt);
  const hasDialogue = /["«»—]/.test(prompt) && /dijo|dice|responde|pregunta|exclama/i.test(prompt);
  let originality = 20 + Math.min(uniqueWords * 0.4, 20) + (hasMetaphor ? 15 : 0) + (hasInventedTerms ? 12 : 0) + (hasQuotes ? 8 : 0) + (hasDialogue ? 10 : 0) + Math.min(words * 0.15, 10);

  // Detail: length, descriptive words, sensory language
  const hasSensory = /\b(brilla|suena|huele|sabe|siente|vibra|resplandece|susurra|cruje|aroma|textura|color|luz|sombra|calor|frío)\b/i.test(prompt);
  const hasNumbers = /\d+/.test(prompt);
  const hasAdjectives = /\b(enorme|diminut|brillante|oscur|suave|áspero|antiguo|futurist|misterios|radiante|etéreo|colosal|minúscul)\b/i.test(prompt);
  let detail = 15 + (chars > 150 ? 15 : chars > 80 ? 8 : 0) + (words > 30 ? 12 : words > 15 ? 6 : 0) + (hasSensory ? 18 : 0) + (hasNumbers ? 8 : 0) + (hasAdjectives ? 12 : 0) + (sentences > 3 ? 10 : sentences > 1 ? 5 : 0);

  // Coherence: structure, logical flow, punctuation
  const hasCommas = (prompt.match(/,/g) || []).length;
  const hasParagraphStructure = sentences >= 3;
  const hasConnectors = /\b(porque|por eso|sin embargo|además|mientras|entonces|luego|primero|después|finalmente|aunque|no obstante)\b/i.test(prompt);
  let coherence = 25 + (hasParagraphStructure ? 20 : 0) + (hasConnectors ? 15 : 0) + Math.min(hasCommas * 2, 12) + (words > 10 && words < 200 ? 15 : 5);

  // Impact: emotional words, surprise elements, memorable phrases
  const hasEmotion = /\b(increíble|asombroso|terrible|maravillos|impactante|sorprendent|aterrador|fascinant|glorios|épic|legendari|brutal|espectacular)\b/i.test(prompt);
  const hasExclamation = /!/.test(prompt);
  const hasQuestion = /\?/.test(prompt);
  const hasEmoji = /[\uD83C-\uDBFF\uDC00-\uDFFF]+/.test(prompt);
  const hasTwist = /\b(pero|sin embargo|de repente|inesperadamente|resulta que|lo que nadie sabía|el secreto|la verdad)\b/i.test(prompt);
  let impact = 15 + (hasEmotion ? 18 : 0) + (hasExclamation ? 8 : 0) + (hasQuestion ? 6 : 0) + (hasEmoji ? 4 : 0) + (hasTwist ? 15 : 0) + Math.min(words * 0.2, 12);

  // Check bonus condition (challenge-specific)
  let bonusApplied = false;
  let bonusPoints = 0;
  const bonusKeywords: Record<number, RegExp> = {
    1: /paradoja\s+temporal|tiempo.*paradoja|paradoja.*tiempo/i,
    2: /eslogan|slogan|lema/i,
    3: /["«»—].*["«»—]|dijo.*dice|diálogo/i,
    4: /siglo\s*(xxi|21|veint)|abuel|probó|reacción/i,
    5: /traje|armadura|vestimenta|uniforme/i,
    6: /mapa|geografía|norte|sur|este|oeste|territorio/i,
    7: /crescendo|clímax|intensifica|transforma/i,
    8: /material|construi|fabric/i,
    9: /no\s+pudo\s+cambiar|no\s+cambió|sigue\s+igual|permanece/i,
    10: /jugada\s+legendaria|mejor\s+jugada|momento\s+épico/i,
  };
  if (bonusKeywords[challenge.id] && bonusKeywords[challenge.id].test(prompt)) {
    bonusApplied = true;
    bonusPoints = 10;
  }

  // Constraint check — penalty if not met
  const constraintMet = words >= 10; // basic constraint: must write something substantial
  if (!constraintMet) {
    originality *= 0.5;
    detail *= 0.5;
  }

  // Clamp all values
  originality = Math.min(Math.max(Math.round(originality), 5), 98);
  detail = Math.min(Math.max(Math.round(detail), 5), 98);
  coherence = Math.min(Math.max(Math.round(coherence), 5), 98);
  impact = Math.min(Math.max(Math.round(impact), 5), 98);

  const total = Math.round(originality * 0.30 + detail * 0.25 + coherence * 0.25 + impact * 0.20) + bonusPoints;
  const clampedTotal = Math.min(total, 100);

  // Generate feedback
  let feedback = '';
  if (clampedTotal >= 85) feedback = '¡GENIO CREATIVO! Tu imaginación no tiene límites. Has creado algo verdaderamente único y memorable.';
  else if (clampedTotal >= 70) feedback = '¡Muy creativo! Tienes un gran talento narrativo. Intenta añadir más detalles sensoriales y giros inesperados.';
  else if (clampedTotal >= 55) feedback = 'Buen intento creativo. La base es sólida pero necesita más originalidad y detalles que sorprendan.';
  else if (clampedTotal >= 40) feedback = 'Tu idea tiene potencial pero le falta desarrollo. Sé más descriptivo, añade diálogos y metáforas.';
  else feedback = 'Necesitas expandir mucho más tu respuesta. Usa todos los sentidos, inventa términos, crea personajes y sorprende.';

  if (bonusApplied) feedback += ' ¡BONUS DESBLOQUEADO! +10 puntos extra por cumplir el desafío especial.';

  return { originality, detail, coherence, impact, total: clampedTotal, feedback, bonusApplied, bonusPoints };
}

/* ─── Evaluate Prompt (Attack/Defend) ─── */
function evaluatePrompt(prompt: string, mode: 'attack' | 'defend', style?: AttackStyle): RaidResult {
  const words = prompt.trim().split(/\s+/).length;
  const hasIA = /\b(ia|ai|inteligencia artificial|machine learning|algoritmo|neural|cuántic|quantum)\b/i.test(prompt);
  const hasStrategy = /\b(primero|luego|después|mientras|simultáneamente|coordinad|fase|paso|etapa)\b/i.test(prompt);
  const hasCreativity = /\b(holográfic|invisible|teletransport|portal|dimensi|cuántic|nano|bio|cyber|hack|encrypt|decrypt|señuelo|distracción|ilusión|camuflaje)\b/i.test(prompt);
  const hasTechnical = /\b(frecuencia|protocolo|firewall|encript|descifr|código|sistema|sensor|detector|escáner|dron|robot|bot|algoritmo)\b/i.test(prompt);
  const hasDetail = prompt.length > 100;
  const hasEmoji = /[\uD83C-\uDBFF\uDC00-\uDFFF]+/.test(prompt);

  let precision = 30 + (hasDetail ? 25 : 0) + (hasStrategy ? 20 : 0) + Math.min(words * 0.5, 15);
  let creativity = 20 + (hasCreativity ? 30 : 0) + (hasEmoji ? 5 : 0) + Math.min(prompt.length * 0.05, 20) + (words > 20 ? 15 : 0);
  let technique = 20 + (hasIA ? 25 : 0) + (hasTechnical ? 25 : 0) + (mode === 'attack' && style === 'hack' ? 10 : 0);
  let clarity = 40 + (words > 5 && words < 80 ? 20 : 0) + (prompt.includes(',') ? 10 : 0) + (prompt.includes('.') ? 10 : 0);
  let efficiency = words > 3 && words < 60 ? 60 + Math.min(words * 0.8, 25) : 30;

  precision = Math.min(Math.max(precision, 10), 98);
  creativity = Math.min(Math.max(creativity, 10), 98);
  technique = Math.min(Math.max(technique, 10), 98);
  clarity = Math.min(Math.max(clarity, 10), 98);
  efficiency = Math.min(Math.max(efficiency, 10), 98);

  const score = Math.round(precision * 0.25 + creativity * 0.25 + technique * 0.2 + clarity * 0.15 + efficiency * 0.15);

  let feedback = '';
  if (score >= 85) feedback = '¡PROMPT MAESTRO! Tu estrategia es brillante. La IA no tuvo oportunidad contra tu creatividad y precisión técnica.';
  else if (score >= 70) feedback = '¡Buen prompt! Tienes talento para la estrategia. Intenta añadir más detalles técnicos y creatividad para subir tu puntuación.';
  else if (score >= 50) feedback = 'Prompt aceptable. Tu idea es buena pero le falta desarrollo. Intenta ser más específico y usar conceptos de IA.';
  else feedback = 'Prompt débil. Necesitas más detalle, estrategia y creatividad. Piensa en CÓMO vas a ejecutar tu plan paso a paso.';

  const loot: { name: string; icon: string; rarity: string }[] = [];
  if (score >= 30) loot.push({ ...LOOT_TABLE[0] });
  if (score >= 60) loot.push(LOOT_TABLE[Math.floor(Math.random() * 2) + 1]);
  if (score >= 80) loot.push(LOOT_TABLE[Math.floor(Math.random() * 2) + 2]);
  if (score >= 95) loot.push(LOOT_TABLE[4]);

  const xpEarned = Math.round(score * 3 + (mode === 'attack' ? 50 : 30));

  return { score, precision, creativity, technique, clarity, efficiency, feedback, loot, xpEarned };
}

/* ─── Score Bar Component ─── */
function ScoreBar({ label, value, color, icon }: { label: string; value: number; color: string; icon?: React.ReactNode }) {
  return (
    <div className="pt-14 flex items-center gap-3">
      <BackButton variant="inline" fallbackPath="/raids" />
      <GlobalNavBar />
      <span className="text-xs text-gray-400 w-24 text-right flex items-center justify-end gap-1.5">
        {icon}{label}
      </span>
      <div className="flex-1 h-2.5 bg-white/5 rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all duration-1000 ease-out" style={{ width: `${value}%`, backgroundColor: color }} />
      </div>
      <span className="text-xs font-bold w-8" style={{ color }}>{value}</span>
    </div>
  );
}

/* ─── Rarity Color ─── */
function rarityColor(r: string) {
  if (r === 'Común') return 'text-gray-400 border-gray-500/30 bg-gray-500/10';
  if (r === 'Raro') return 'text-blue-400 border-blue-500/30 bg-blue-500/10';
  if (r === 'Épico') return 'text-purple-400 border-purple-500/30 bg-purple-500/10';
  if (r === 'Legendario') return 'text-yellow-400 border-yellow-500/30 bg-yellow-500/10';
  return 'text-pink-400 border-pink-500/30 bg-pink-500/10';
}

/* ─── Main Component ─── */
export default function RaidsBattle() {
  const { getAvatarName } = usePRDLanguage();
  const [mode, setMode] = useState<RaidMode>('menu');
  const [target, setTarget] = useState<RaidTarget | null>(null);
  const [attackStyle, setAttackStyle] = useState<AttackStyle | null>(null);
  const [defenseScenario, setDefenseScenario] = useState<typeof DEFENSE_SCENARIOS[0] | null>(null);
  const [prompt, setPrompt] = useState('');
  const [timeLeft, setTimeLeft] = useState(120);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [result, setResult] = useState<RaidResult | null>(null);
  const [battleMode, setBattleMode] = useState<'attack' | 'defend'>('attack');
  const [copied, setCopied] = useState(false);
  const [showScoreAnimation, setShowScoreAnimation] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Creativity mode state
  const [creativityRound, setCreativityRound] = useState(0); // 0-based, 3 rounds total
  const [creativityChallenges, setCreativityChallenges] = useState<CreativityChallenge[]>([]);
  const [creativityResults, setCreativityResults] = useState<CreativityRoundResult[]>([]);
  const [showAIResponse, setShowAIResponse] = useState(false);
  const [currentAIData, setCurrentAIData] = useState<{ prompt: string; score: CreativityScore } | null>(null);
  const [playerCreativityScore, setPlayerCreativityScore] = useState<CreativityScore | null>(null);

  const TOTAL_CREATIVITY_ROUNDS = 3;

  // Timer
  useEffect(() => {
    if (!isTimerRunning || timeLeft <= 0) return;
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setIsTimerRunning(false);
          if (mode === 'creativity-round') {
            handleCreativitySubmit();
          } else {
            handleSubmit();
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isTimerRunning, timeLeft, mode]);

  const startBattle = (m: 'attack' | 'defend') => {
    setBattleMode(m);
    if (m === 'attack') {
      setTarget(RAID_TARGETS[Math.floor(Math.random() * RAID_TARGETS.length)]);
      setMode('attack');
    } else {
      setDefenseScenario(DEFENSE_SCENARIOS[Math.floor(Math.random() * DEFENSE_SCENARIOS.length)]);
      setMode('defend');
    }
    setPrompt('');
    setResult(null);
    setTimeLeft(120);
    setIsTimerRunning(false);
    setAttackStyle(null);
  };

  const startCreativityBattle = () => {
    // Pick 3 random unique challenges
    const shuffled = [...CREATIVITY_CHALLENGES].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, TOTAL_CREATIVITY_ROUNDS);
    setCreativityChallenges(selected);
    setCreativityRound(0);
    setCreativityResults([]);
    setPrompt('');
    setShowAIResponse(false);
    setCurrentAIData(null);
    setPlayerCreativityScore(null);
    setMode('creativity');
  };

  const beginCreativityRound = () => {
    const challenge = creativityChallenges[creativityRound];
    setTimeLeft(challenge.timeLimit);
    setIsTimerRunning(true);
    setPrompt('');
    setShowAIResponse(false);
    setCurrentAIData(null);
    setPlayerCreativityScore(null);
    setMode('creativity-round');
    setTimeout(() => textareaRef.current?.focus(), 100);
  };

  const handleCreativitySubmit = () => {
    setIsTimerRunning(false);
    const challenge = creativityChallenges[creativityRound];
    const playerPrompt = prompt.trim().length < 5 ? 'Respuesta vacía sin creatividad' : prompt;

    // Evaluate player
    const pScore = evaluateCreativityPrompt(playerPrompt, challenge);
    setPlayerCreativityScore(pScore);

    // Generate AI response
    const aiData = generateAICreativityPrompt(challenge);
    setCurrentAIData(aiData);

    // Show comparison
    setShowAIResponse(true);
  };

  const proceedToNextRound = () => {
    const challenge = creativityChallenges[creativityRound];
    const playerPrompt = prompt.trim().length < 5 ? 'Respuesta vacía sin creatividad' : prompt;
    const pScore = playerCreativityScore!;
    const aiData = currentAIData!;

    const roundResult: CreativityRoundResult = {
      challenge,
      prompt: playerPrompt,
      score: pScore,
      aiPrompt: aiData.prompt,
      aiScore: aiData.score,
      playerWon: pScore.total >= aiData.score.total,
    };

    const newResults = [...creativityResults, roundResult];
    setCreativityResults(newResults);

    if (creativityRound + 1 >= TOTAL_CREATIVITY_ROUNDS) {
      // All rounds done — show final results
      setMode('creativity-result');
    } else {
      // Next round
      setCreativityRound(prev => prev + 1);
      setPrompt('');
      setShowAIResponse(false);
      setCurrentAIData(null);
      setPlayerCreativityScore(null);
      setMode('creativity');
    }
  };

  const beginWriting = (style?: AttackStyle) => {
    if (style) setAttackStyle(style);
    setIsTimerRunning(true);
    setTimeLeft(120);
    setTimeout(() => textareaRef.current?.focus(), 100);
  };

  const handleSubmit = () => {
    setIsTimerRunning(false);
    if (prompt.trim().length < 5) {
      setPrompt('Ataque básico sin estrategia');
    }
    const res = evaluatePrompt(prompt || 'Ataque básico', battleMode, attackStyle || undefined);
    setResult(res);
    setMode('result');
    setShowScoreAnimation(true);
    setTimeout(() => setShowScoreAnimation(false), 2000);
  };

  const copyPrompt = () => {
    navigator.clipboard.writeText(prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const resetGame = () => {
    setMode('menu');
    setTarget(null);
    setAttackStyle(null);
    setDefenseScenario(null);
    setPrompt('');
    setResult(null);
    setTimeLeft(120);
    setIsTimerRunning(false);
    setCreativityRound(0);
    setCreativityChallenges([]);
    setCreativityResults([]);
    setShowAIResponse(false);
    setCurrentAIData(null);
    setPlayerCreativityScore(null);
  };

  // Creativity final stats
  const creativityTotalScore = creativityResults.reduce((sum, r) => sum + r.score.total, 0);
  const creativityAITotalScore = creativityResults.reduce((sum, r) => sum + r.aiScore.total, 0);
  const creativityRoundsWon = creativityResults.filter(r => r.playerWon).length;
  const creativityXP = Math.round(creativityTotalScore * 4 + creativityRoundsWon * 100);

  // Creativity loot
  const creativityLoot: { name: string; icon: string; rarity: string }[] = [];
  const avgCreativity = creativityResults.length > 0 ? creativityTotalScore / creativityResults.length : 0;
  if (avgCreativity >= 30) creativityLoot.push({ name: 'LinceCoins x3', icon: '🪙', rarity: 'Común' });
  if (avgCreativity >= 55) creativityLoot.push({ name: 'Pincel Creativo', icon: '🖌️', rarity: 'Raro' });
  if (avgCreativity >= 70) creativityLoot.push({ name: 'Musa de Cristal', icon: '💎', rarity: 'Épico' });
  if (avgCreativity >= 85) creativityLoot.push({ name: 'Pluma Legendaria', icon: '🪶', rarity: 'Legendario' });
  if (creativityRoundsWon === TOTAL_CREATIVITY_ROUNDS) creativityLoot.push({ name: 'Corona del Creador', icon: '👑', rarity: 'Mítico' });

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white flex flex-col">
      {/* Nav */}

      <main className="pt-20 pb-16 container max-w-4xl flex-1">
        {/* ═══ MENU ═══ */}
        {mode === 'menu' && (
          <div className="space-y-8">
            <div className="text-center">
              <h1 className="font-display font-black text-4xl md:text-5xl mb-3">
                <span className="text-white">LINCE </span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-yellow-500">RAIDS</span>
              </h1>
              <p className="text-gray-400 text-lg">Elige tu modo de batalla</p>
            </div>

            <div className="grid md:grid-cols-3 gap-5">
              {/* Attack */}
              <button onClick={() => startBattle('attack')}
                className="group p-6 bg-gradient-to-br from-red-500/10 to-transparent border border-red-500/20 rounded-2xl hover:border-red-500/50 transition-all text-left">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-14 h-14 bg-red-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Swords className="w-7 h-7 text-red-400" />
                  </div>
                  <div>
                    <h2 className="font-display font-bold text-xl text-white">ATACAR</h2>
                    <p className="text-red-400 text-xs font-medium">Asalta una base</p>
                  </div>
                </div>
                <p className="text-gray-400 text-xs leading-relaxed mb-3">
                  Elige un objetivo, selecciona tu estilo y escribe el mejor prompt para infiltrarte.
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] px-2 py-0.5 rounded bg-red-500/10 text-red-400 border border-red-500/20">+250 XP</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">Botín</span>
                </div>
              </button>

              {/* Defend */}
              <button onClick={() => startBattle('defend')}
                className="group p-6 bg-gradient-to-br from-blue-500/10 to-transparent border border-blue-500/20 rounded-2xl hover:border-blue-500/50 transition-all text-left">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-14 h-14 bg-blue-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Shield className="w-7 h-7 text-blue-400" />
                  </div>
                  <div>
                    <h2 className="font-display font-bold text-xl text-white">DEFENDER</h2>
                    <p className="text-blue-400 text-xs font-medium">Protege tu base</p>
                  </div>
                </div>
                <p className="text-gray-400 text-xs leading-relaxed mb-3">
                  Un atacante se infiltra. Escribe el prompt de defensa perfecto para repelerlo.
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">+150 XP</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">Escudo</span>
                </div>
              </button>

              {/* Creativity Battle — NEW */}
              <button onClick={startCreativityBattle}
                className="group p-6 bg-gradient-to-br from-purple-500/10 via-pink-500/5 to-transparent border border-purple-500/20 rounded-2xl hover:border-purple-500/50 transition-all text-left relative overflow-hidden">
                <div className="absolute top-2 right-2">
                  <span className="text-[9px] px-2 py-0.5 rounded-full bg-gradient-to-r from-purple-500/60 to-pink-500/60 text-white/80 font-black tracking-wider">CREATIVE</span>
                </div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-14 h-14 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Palette className="w-7 h-7 text-purple-400" />
                  </div>
                  <div>
                    <h2 className="font-display font-bold text-xl text-white">CREATIVIDAD</h2>
                    <p className="text-purple-400 text-xs font-medium">Supera a la IA</p>
                  </div>
                </div>
                <p className="text-gray-400 text-xs leading-relaxed mb-3">
                  3 rondas de desafíos creativos. Escribe mejor que la IA en temas sorpresa. Gana quien tenga más imaginación.
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20">+400 XP</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-pink-500/10 text-pink-400 border border-pink-500/20">3 Rondas</span>
                </div>
              </button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { icon: <Target className="w-5 h-5 text-red-400" />, label: 'Objetivos', value: `${RAID_TARGETS.length}` },
                { icon: <Swords className="w-5 h-5 text-yellow-400" />, label: 'Estilos', value: '4' },
                { icon: <Palette className="w-5 h-5 text-purple-400" />, label: 'Desafíos', value: `${CREATIVITY_CHALLENGES.length}` },
                { icon: <Brain className="w-5 h-5 text-cyan-400" />, label: 'Criterios', value: '9' },
              ].map((s, i) => (
                <div key={i} className="bg-white/[0.03] border border-white/5 rounded-xl p-3 text-center">
                  <div className="flex justify-center mb-1">{s.icon}</div>
                  <div className="text-white font-bold text-lg">{s.value}</div>
                  <div className="text-gray-500 text-[10px]">{s.label}</div>
                </div>
              ))}
            </div>

            {/* Creativity Rules Preview */}
            <div className="bg-gradient-to-r from-purple-500/5 to-pink-500/5 border border-purple-500/10 rounded-2xl p-5">
              <h3 className="font-display font-bold text-sm text-purple-400 mb-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4" /> Reglas de Batalla de Creatividad
              </h3>
              <div className="grid sm:grid-cols-2 gap-3 text-xs text-gray-400">
                <div className="flex items-start gap-2">
                  <span className="text-purple-400 font-bold mt-0.5">1.</span>
                  <span>3 rondas con temas sorpresa aleatorios (de un pool de {CREATIVITY_CHALLENGES.length} desafíos)</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-purple-400 font-bold mt-0.5">2.</span>
                  <span>Cada ronda tiene un tiempo límite y una restricción especial</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-purple-400 font-bold mt-0.5">3.</span>
                  <span>La IA también escribe — compites directamente contra ella</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-purple-400 font-bold mt-0.5">4.</span>
                  <span>Se evalúan 4 criterios: Originalidad, Detalle, Coherencia e Impacto</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-pink-400 font-bold mt-0.5">★</span>
                  <span>Cada desafío tiene un bonus secreto que otorga +10 puntos extra</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-pink-400 font-bold mt-0.5">★</span>
                  <span>Ganar las 3 rondas desbloquea la "Corona del Creador" (Mítico)</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ═══ CREATIVITY - CHALLENGE PREVIEW ═══ */}
        {mode === 'creativity' && creativityChallenges.length > 0 && (
          <div className="space-y-6">
            {/* Round indicator */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {Array.from({ length: TOTAL_CREATIVITY_ROUNDS }).map((_, i) => (
                  <div key={i} className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm border-2 transition-all ${
                    i < creativityRound ? 'bg-purple-500/30 border-purple-500 text-purple-300' :
                    i === creativityRound ? 'bg-gradient-to-br from-purple-500 to-pink-500 border-purple-400 text-white scale-110' :
                    'bg-white/5 border-white/10 text-gray-600'
                  }`}>
                    {i < creativityRound ? <Check className="w-4 h-4" /> : i + 1}
                  </div>
                ))}
              </div>
              <span className="text-purple-400 text-sm font-bold">Ronda {creativityRound + 1}/{TOTAL_CREATIVITY_ROUNDS}</span>
            </div>

            {/* Challenge Card */}
            <div className="bg-gradient-to-br from-purple-500/10 via-pink-500/5 to-transparent border border-purple-500/20 rounded-2xl p-6 sm:p-8">
              <div className="text-center mb-6">
                <span className="text-5xl mb-3 block">{creativityChallenges[creativityRound].icon}</span>
                <h2 className="font-display font-black text-2xl sm:text-3xl text-white mb-2">
                  {creativityChallenges[creativityRound].theme}
                </h2>
                <div className="flex items-center justify-center gap-2 text-purple-400 text-sm">
                  <Timer className="w-4 h-4" />
                  <span>{creativityChallenges[creativityRound].timeLimit} segundos</span>
                  <span className="text-gray-600">|</span>
                  <Trophy className="w-4 h-4" />
                  <span>{creativityChallenges[creativityRound].maxPoints} pts máx</span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-black/30 rounded-xl p-4">
                  <p className="text-purple-400 text-[10px] font-bold mb-2 flex items-center gap-1.5">
                    <FileText className="w-3 h-3" /> DESAFÍO
                  </p>
                  <p className="text-gray-200 text-sm leading-relaxed">{creativityChallenges[creativityRound].description}</p>
                </div>

                <div className="grid sm:grid-cols-2 gap-3">
                  <div className="bg-black/30 rounded-xl p-4">
                    <p className="text-yellow-400 text-[10px] font-bold mb-2 flex items-center gap-1.5">
                      <Target className="w-3 h-3" /> RESTRICCIÓN
                    </p>
                    <p className="text-gray-300 text-xs leading-relaxed">{creativityChallenges[creativityRound].constraint}</p>
                  </div>
                  <div className="bg-black/30 rounded-xl p-4">
                    <p className="text-pink-400 text-[10px] font-bold mb-2 flex items-center gap-1.5">
                      <Lightbulb className="w-3 h-3" /> BONUS SECRETO
                    </p>
                    <p className="text-gray-300 text-xs leading-relaxed">{creativityChallenges[creativityRound].bonusTip}</p>
                  </div>
                </div>
              </div>

              <button onClick={beginCreativityRound}
                className="w-full mt-6 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-black text-lg rounded-xl hover:scale-[1.02] transition-transform flex items-center justify-center gap-2">
                <Palette className="w-5 h-5" /> COMENZAR RONDA {creativityRound + 1}
              </button>
            </div>

            {/* Scoring criteria */}
            <div className="bg-white/[0.02] border border-white/5 rounded-xl p-4">
              <h4 className="text-xs font-bold text-gray-500 mb-3">CRITERIOS DE EVALUACIÓN</h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { name: 'Originalidad', icon: <Sparkles className="w-4 h-4" />, weight: '30%', color: 'text-purple-400' },
                  { name: 'Detalle', icon: <Eye className="w-4 h-4" />, weight: '25%', color: 'text-cyan-400' },
                  { name: 'Coherencia', icon: <FileText className="w-4 h-4" />, weight: '25%', color: 'text-emerald-400' },
                  { name: 'Impacto', icon: <Zap className="w-4 h-4" />, weight: '20%', color: 'text-yellow-400' },
                ].map((c, i) => (
                  <div key={i} className="text-center">
                    <div className={`flex justify-center mb-1 ${c.color}`}>{c.icon}</div>
                    <p className="text-white text-xs font-bold">{c.name}</p>
                    <p className="text-gray-600 text-[10px]">{c.weight}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ═══ CREATIVITY - WRITING ROUND ═══ */}
        {mode === 'creativity-round' && creativityChallenges.length > 0 && (
          <div className="space-y-5">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{creativityChallenges[creativityRound].icon}</span>
                <div>
                  <span className="text-white font-bold text-sm">{creativityChallenges[creativityRound].theme}</span>
                  <span className="text-gray-600 text-xs ml-2">Ronda {creativityRound + 1}/{TOTAL_CREATIVITY_ROUNDS}</span>
                </div>
              </div>
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border ${timeLeft <= 20 ? 'border-red-500/50 bg-red-500/10 text-red-400' : 'border-purple-500/30 bg-purple-500/10 text-purple-300'}`}>
                <Timer className="w-4 h-4" />
                <span className="font-mono font-bold text-sm">{Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}</span>
              </div>
            </div>

            {/* Challenge reminder */}
            <div className="bg-purple-500/5 border border-purple-500/10 rounded-xl p-3">
              <p className="text-gray-300 text-xs leading-relaxed">{creativityChallenges[creativityRound].description}</p>
              <p className="text-yellow-400/70 text-[10px] mt-1.5">Restricción: {creativityChallenges[creativityRound].constraint}</p>
            </div>

            {/* Writing area */}
            {!showAIResponse ? (
              <div className="bg-black/40 border border-purple-500/20 rounded-xl p-4">
                <p className="text-purple-400 text-xs font-bold mb-2 flex items-center gap-1.5">
                  <Palette className="w-3 h-3" /> Escribe tu respuesta creativa:
                </p>
                <textarea
                  ref={textareaRef}
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Deja volar tu imaginación. Sé original, descriptivo y sorprendente. Usa metáforas, inventa términos, crea mundos..."
                  className="w-full bg-transparent text-white text-sm font-mono placeholder:text-gray-600 resize-none focus:outline-none min-h-[160px] sm:min-h-[200px]"
                  maxLength={800}
                />
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-3">
                    <span className="text-gray-600 text-[10px]">{prompt.length}/800</span>
                    <span className="text-gray-700 text-[10px]">{prompt.trim().split(/\s+/).filter(w => w).length} palabras</span>
                  </div>
                  <button onClick={handleCreativitySubmit}
                    className="px-6 py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold text-sm rounded-lg hover:scale-105 transition-transform flex items-center gap-2">
                    <Sparkles className="w-4 h-4" /> ENVIAR
                  </button>
                </div>
              </div>
            ) : (
              /* ═══ ROUND COMPARISON ═══ */
              <div className="space-y-5">
                {/* Player Score */}
                <div className={`border rounded-2xl p-5 ${playerCreativityScore && currentAIData && playerCreativityScore.total >= currentAIData.score.total ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-red-500/20 bg-red-500/5'}`}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-white text-sm flex items-center gap-2">
                      <span className="text-lg">👤</span> Tu Respuesta
                    </h3>
                    <div className={`text-2xl font-black font-display ${playerCreativityScore && playerCreativityScore.total >= 70 ? 'text-purple-400' : playerCreativityScore && playerCreativityScore.total >= 50 ? 'text-cyan-400' : 'text-orange-400'}`}>
                      {playerCreativityScore?.total || 0}
                      <span className="text-gray-600 text-sm font-normal">/100</span>
                    </div>
                  </div>
                  <div className="space-y-2 mb-3">
                    <ScoreBar label="Originalidad" value={playerCreativityScore?.originality || 0} color="#a855f7" icon={<Sparkles className="w-3 h-3" />} />
                    <ScoreBar label="Detalle" value={playerCreativityScore?.detail || 0} color="#06b6d4" icon={<Eye className="w-3 h-3" />} />
                    <ScoreBar label="Coherencia" value={playerCreativityScore?.coherence || 0} color="#22c55e" icon={<FileText className="w-3 h-3" />} />
                    <ScoreBar label="Impacto" value={playerCreativityScore?.impact || 0} color="#eab308" icon={<Zap className="w-3 h-3" />} />
                  </div>
                  {playerCreativityScore?.bonusApplied && (
                    <div className="bg-pink-500/10 border border-pink-500/20 rounded-lg px-3 py-2 text-pink-400 text-xs font-bold flex items-center gap-2">
                      <Sparkles className="w-3 h-3" /> BONUS +{playerCreativityScore.bonusPoints} pts
                    </div>
                  )}
                  <p className="text-gray-400 text-xs mt-3 leading-relaxed">{playerCreativityScore?.feedback}</p>
                  <div className="mt-3 bg-black/30 rounded-lg p-3 max-h-24 overflow-y-auto">
                    <p className="text-white/70 text-[11px] font-mono italic">{prompt}</p>
                  </div>
                </div>

                {/* VS Divider */}
                <div className="flex items-center gap-4">
                  <div className="flex-1 h-px bg-gradient-to-r from-transparent to-purple-500/30" />
                  <span className="text-purple-400 font-black text-lg">VS</span>
                  <div className="flex-1 h-px bg-gradient-to-l from-transparent to-purple-500/30" />
                </div>

                {/* AI Score */}
                <div className="border border-purple-500/20 bg-purple-500/5 rounded-2xl p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-white text-sm flex items-center gap-2">
                      <span className="text-lg">🤖</span> Respuesta de la IA
                    </h3>
                    <div className={`text-2xl font-black font-display text-purple-400`}>
                      {currentAIData?.score.total || 0}
                      <span className="text-gray-600 text-sm font-normal">/100</span>
                    </div>
                  </div>
                  <div className="space-y-2 mb-3">
                    <ScoreBar label="Originalidad" value={currentAIData?.score.originality || 0} color="#a855f7" icon={<Sparkles className="w-3 h-3" />} />
                    <ScoreBar label="Detalle" value={currentAIData?.score.detail || 0} color="#06b6d4" icon={<Eye className="w-3 h-3" />} />
                    <ScoreBar label="Coherencia" value={currentAIData?.score.coherence || 0} color="#22c55e" icon={<FileText className="w-3 h-3" />} />
                    <ScoreBar label="Impacto" value={currentAIData?.score.impact || 0} color="#eab308" icon={<Zap className="w-3 h-3" />} />
                  </div>
                  <p className="text-gray-400 text-xs leading-relaxed">{currentAIData?.score.feedback}</p>
                  <div className="mt-3 bg-black/30 rounded-lg p-3 max-h-24 overflow-y-auto">
                    <p className="text-white/70 text-[11px] font-mono italic">{currentAIData?.prompt}</p>
                  </div>
                </div>

                {/* Round Winner */}
                <div className={`text-center py-4 rounded-xl border ${playerCreativityScore && currentAIData && playerCreativityScore.total >= currentAIData.score.total ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-red-500/10 border-red-500/30'}`}>
                  <p className="text-2xl mb-1">
                    {playerCreativityScore && currentAIData && playerCreativityScore.total >= currentAIData.score.total ? '🏆' : '🤖'}
                  </p>
                  <p className="font-bold text-white text-sm">
                    {playerCreativityScore && currentAIData && playerCreativityScore.total >= currentAIData.score.total
                      ? '¡GANASTE esta ronda!'
                      : playerCreativityScore && currentAIData && playerCreativityScore.total === currentAIData.score.total
                        ? '¡EMPATE!'
                        : 'La IA ganó esta ronda'}
                  </p>
                  <p className="text-gray-500 text-xs mt-1">
                    {playerCreativityScore?.total} vs {currentAIData?.score.total}
                  </p>
                </div>

                {/* Next Round Button */}
                <button onClick={proceedToNextRound}
                  className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-black text-lg rounded-xl hover:scale-[1.02] transition-transform flex items-center justify-center gap-2">
                  {creativityRound + 1 < TOTAL_CREATIVITY_ROUNDS ? (
                    <>Siguiente Ronda <Zap className="w-5 h-5" /></>
                  ) : (
                    <>Ver Resultados Finales <Trophy className="w-5 h-5" /></>
                  )}
                </button>
              </div>
            )}
          </div>
        )}

        {/* ═══ CREATIVITY - FINAL RESULTS ═══ */}
        {mode === 'creativity-result' && (
          <div className="space-y-6">
            {/* Final Score Header */}
            <div className="text-center">
              <div className="inline-block">
                <p className="text-purple-400 text-xs font-bold mb-2 tracking-widest">BATALLA DE CREATIVIDAD</p>
                <div className="text-6xl sm:text-7xl font-black font-display text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                  {creativityRoundsWon}/{TOTAL_CREATIVITY_ROUNDS}
                </div>
                <p className="text-gray-500 text-sm mt-1">Rondas ganadas</p>
              </div>
              <p className="text-white font-bold text-lg mt-3">
                {creativityRoundsWon === TOTAL_CREATIVITY_ROUNDS ? '👑 MAESTRO CREADOR — ¡Victoria perfecta!' :
                 creativityRoundsWon >= 2 ? '🏆 ¡VICTORIA! Superaste a la IA' :
                 creativityRoundsWon === 1 ? '⚔️ Empate táctico — la IA es un rival duro' :
                 '🤖 La IA ganó esta vez — ¡inténtalo de nuevo!'}
              </p>
              <p className="text-purple-400 text-sm mt-1">+{creativityXP} XP</p>
            </div>

            {/* Score Comparison */}
            <div className="bg-white/[0.03] border border-purple-500/20 rounded-xl p-5">
              <h3 className="font-bold text-white text-sm mb-4">Puntuación Total</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <p className="text-gray-500 text-xs mb-1">👤 Tú</p>
                  <p className={`text-3xl font-black font-display ${creativityTotalScore > creativityAITotalScore ? 'text-emerald-400' : 'text-white'}`}>
                    {creativityTotalScore}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-gray-500 text-xs mb-1">🤖 IA</p>
                  <p className={`text-3xl font-black font-display ${creativityAITotalScore > creativityTotalScore ? 'text-purple-400' : 'text-white'}`}>
                    {creativityAITotalScore}
                  </p>
                </div>
              </div>
            </div>

            {/* Round-by-Round Breakdown */}
            <div className="space-y-3">
              <h3 className="font-bold text-white text-sm">Desglose por Ronda</h3>
              {creativityResults.map((r, i) => (
                <div key={i} className={`border rounded-xl p-4 ${r.playerWon ? 'border-emerald-500/20 bg-emerald-500/5' : 'border-red-500/15 bg-red-500/5'}`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{r.challenge.icon}</span>
                      <span className="text-white font-bold text-sm">{r.challenge.theme}</span>
                    </div>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded ${r.playerWon ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                      {r.playerWon ? 'GANADA' : 'PERDIDA'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-400">Tu puntuación: <span className="text-white font-bold">{r.score.total}</span></span>
                    <span className="text-gray-400">IA: <span className="text-purple-400 font-bold">{r.aiScore.total}</span></span>
                  </div>
                  {r.score.bonusApplied && (
                    <p className="text-pink-400 text-[10px] mt-1 flex items-center gap-1">
                      <Sparkles className="w-2.5 h-2.5" /> Bonus desbloqueado (+{r.score.bonusPoints})
                    </p>
                  )}
                </div>
              ))}
            </div>

            {/* Loot */}
            {creativityLoot.length > 0 && (
              <div className="bg-white/[0.03] border border-yellow-500/20 rounded-xl p-5">
                <h3 className="font-bold text-yellow-400 text-sm mb-3 flex items-center gap-2">
                  <Trophy className="w-4 h-4" /> Botín Creativo
                </h3>
                <div className="flex flex-wrap gap-3">
                  {creativityLoot.map((item, i) => (
                    <div key={i} className={`px-3 py-2 rounded-lg border ${rarityColor(item.rarity)} flex items-center gap-2`}>
                      <span className="text-lg">{item.icon}</span>
                      <div>
                        <p className="text-xs font-bold">{item.name}</p>
                        <p className="text-[10px] opacity-60">{item.rarity}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button onClick={startCreativityBattle}
                className="flex-1 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-xl hover:scale-[1.02] transition-transform flex items-center justify-center gap-2">
                <RotateCcw className="w-4 h-4" /> Otra Batalla Creativa
              </button>
              <button onClick={resetGame}
                className="flex-1 py-3 bg-white/5 border border-white/10 text-white font-bold rounded-xl hover:bg-white/10 transition-colors">
                🏠 Volver al Menú
              </button>
              <Link href="/raids"
                className="flex-1 py-3 bg-white/5 border border-white/10 text-gray-400 font-bold rounded-xl hover:bg-white/10 transition-colors text-center">
                📖 Info Raids
              </Link>
            </div>
          </div>
        )}

        {/* ═══ ATTACK MODE ═══ */}
        {mode === 'attack' && target && (
          <div className="space-y-6">
            {/* Target Info */}
            <div className="bg-gradient-to-r from-red-500/10 to-transparent border border-red-500/20 rounded-2xl p-6">
              <div className="flex items-center gap-4 mb-4">
                {target.avatar && (
                  <img src={target.avatar} alt={target.name} className="w-16 h-16 rounded-full object-cover border-2 border-red-500/50" />
                )}
                <div>
                  <p className="text-red-400 text-xs font-bold mb-1">OBJETIVO</p>
                  <h2 className="font-display font-bold text-xl text-white">{target.avatarKey ? getAvatarName(target.avatarKey) : target.name}</h2>
                  <div className="flex items-center gap-1 mt-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`w-3 h-3 ${i < target.difficulty ? 'text-yellow-400 fill-yellow-400' : 'text-gray-700'}`} />
                    ))}
                    <span className="text-gray-500 text-[10px] ml-1">Dificultad</span>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-black/30 rounded-lg p-3">
                  <p className="text-red-400 text-[10px] font-bold mb-1">DEFENSA</p>
                  <p className="text-gray-300 text-xs">{target.defense}</p>
                </div>
                <div className="bg-black/30 rounded-lg p-3">
                  <p className="text-yellow-400 text-[10px] font-bold mb-1">DEBILIDAD</p>
                  <p className="text-gray-300 text-xs">{target.weakness}</p>
                </div>
              </div>
            </div>

            {/* Attack Style Selection */}
            {!attackStyle && (
              <div>
                <h3 className="font-display font-bold text-lg text-white mb-4">Elige tu estilo de ataque</h3>
                <div className="grid grid-cols-2 gap-3">
                  {ATTACK_STYLES.map(s => (
                    <button key={s.id} onClick={() => beginWriting(s.id)}
                      className="p-4 bg-white/[0.03] border border-white/10 rounded-xl hover:border-red-500/30 transition-all text-left group">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-2xl group-hover:scale-110 transition-transform">{s.icon}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">{s.multiplier}</span>
                      </div>
                      <h4 className="font-bold text-white text-sm mb-1">{s.name}</h4>
                      <p className="text-gray-500 text-[11px] leading-relaxed">{s.desc}</p>
                      <p className="text-gray-600 text-[10px] mt-2">{s.difficulty}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Writing Phase */}
            {attackStyle && !result && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{ATTACK_STYLES.find(s => s.id === attackStyle)?.icon}</span>
                    <span className="text-white font-bold text-sm">{ATTACK_STYLES.find(s => s.id === attackStyle)?.name}</span>
                  </div>
                  <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border ${timeLeft <= 30 ? 'border-red-500/50 bg-red-500/10 text-red-400' : 'border-white/10 bg-white/5 text-white'}`}>
                    <Timer className="w-4 h-4" />
                    <span className="font-mono font-bold text-sm">{Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}</span>
                  </div>
                </div>

                <div className="bg-black/40 border border-red-500/20 rounded-xl p-4">
                  <p className="text-red-400 text-xs font-bold mb-2">{'>'} Escribe tu prompt de ataque:</p>
                  <textarea
                    ref={textareaRef}
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Describe tu estrategia de ataque con detalle. Usa conceptos de IA, sé creativo y estratégico..."
                    className="w-full bg-transparent text-white text-sm font-mono placeholder:text-gray-600 resize-none focus:outline-none min-h-[120px]"
                    maxLength={500}
                  />
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-gray-600 text-[10px]">{prompt.length}/500 caracteres</span>
                    <button onClick={handleSubmit}
                      className="px-6 py-2 bg-gradient-to-r from-red-500 to-yellow-500 text-white font-bold text-sm rounded-lg hover:scale-105 transition-transform">
                      LANZAR ATAQUE
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ═══ DEFEND MODE ═══ */}
        {mode === 'defend' && defenseScenario && (
          <div className="space-y-6">
            {/* Scenario */}
            <div className="bg-gradient-to-r from-blue-500/10 to-transparent border border-blue-500/20 rounded-2xl p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-blue-500/20 rounded-xl flex items-center justify-center text-3xl">
                  {defenseScenario.icon}
                </div>
                <div>
                  <p className="text-blue-400 text-xs font-bold mb-1">ALERTA DE INTRUSIÓN</p>
                  <h2 className="font-display font-bold text-xl text-white">{defenseScenario.attacker}</h2>
                </div>
              </div>
              <div className="bg-black/30 rounded-lg p-3">
                <p className="text-gray-300 text-sm">{defenseScenario.desc}</p>
              </div>
            </div>

            {!isTimerRunning && !result ? (
              <button onClick={() => beginWriting()}
                className="w-full py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold text-lg rounded-xl hover:scale-[1.02] transition-transform">
                ACTIVAR DEFENSAS — Tienes 120 segundos
              </button>
            ) : !result && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-blue-400 font-bold text-sm flex items-center gap-2">
                    <Shield className="w-4 h-4" /> Modo Defensa Activo
                  </span>
                  <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border ${timeLeft <= 30 ? 'border-red-500/50 bg-red-500/10 text-red-400' : 'border-white/10 bg-white/5 text-white'}`}>
                    <Timer className="w-4 h-4" />
                    <span className="font-mono font-bold text-sm">{Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}</span>
                  </div>
                </div>

                <div className="bg-black/40 border border-blue-500/20 rounded-xl p-4">
                  <p className="text-blue-400 text-xs font-bold mb-2">{'>'} Escribe tu prompt de defensa:</p>
                  <textarea
                    ref={textareaRef}
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Describe tu estrategia de defensa. Crea trampas, activa escudos, despliega guardianes IA..."
                    className="w-full bg-transparent text-white text-sm font-mono placeholder:text-gray-600 resize-none focus:outline-none min-h-[120px]"
                    maxLength={500}
                  />
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-gray-600 text-[10px]">{prompt.length}/500 caracteres</span>
                    <button onClick={handleSubmit}
                      className="px-6 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold text-sm rounded-lg hover:scale-105 transition-transform">
                      ACTIVAR DEFENSA
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ═══ RESULTS (Attack/Defend) ═══ */}
        {mode === 'result' && result && (
          <div className="space-y-6">
            {/* Score */}
            <div className="text-center">
              <div className={`inline-block ${showScoreAnimation ? 'animate-bounce' : ''}`}>
                <div className={`text-7xl font-black font-display ${result.score >= 80 ? 'text-yellow-400' : result.score >= 60 ? 'text-cyan-400' : result.score >= 40 ? 'text-orange-400' : 'text-red-400'}`}>
                  {result.score}
                </div>
                <div className="text-gray-500 text-sm">/100</div>
              </div>
              <p className="text-white font-bold text-lg mt-2">
                {result.score >= 85 ? '🏆 PROMPT MAESTRO' : result.score >= 70 ? '⚔️ BUEN ASALTO' : result.score >= 50 ? '🎯 ACEPTABLE' : '💀 PROMPT DÉBIL'}
              </p>
              <p className="text-gray-400 text-sm mt-1">+{result.xpEarned} XP</p>
            </div>

            {/* Score Breakdown */}
            <div className="bg-white/[0.03] border border-white/10 rounded-xl p-5 space-y-3">
              <h3 className="font-bold text-white text-sm mb-3">Evaluación del Prompt</h3>
              <ScoreBar label="Precisión" value={result.precision} color="#ef4444" />
              <ScoreBar label="Creatividad" value={result.creativity} color="#eab308" />
              <ScoreBar label="Técnica" value={result.technique} color="#3b82f6" />
              <ScoreBar label="Claridad" value={result.clarity} color="#22c55e" />
              <ScoreBar label="Eficiencia" value={result.efficiency} color="#a855f7" />
            </div>

            {/* Feedback */}
            <div className="bg-white/[0.03] border border-white/10 rounded-xl p-5">
              <h3 className="font-bold text-white text-sm mb-2">Feedback de la IA</h3>
              <p className="text-gray-300 text-sm leading-relaxed">{result.feedback}</p>
            </div>

            {/* Your Prompt */}
            <div className="bg-black/40 border border-white/10 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-gray-500 text-xs font-bold">Tu prompt:</p>
                <button onClick={copyPrompt} className="flex items-center gap-1 text-xs text-gray-500 hover:text-white transition-colors">
                  {copied ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
                  {copied ? 'Copiado' : 'Copiar'}
                </button>
              </div>
              <p className="text-white text-sm font-mono italic">{prompt}</p>
            </div>

            {/* Loot */}
            {result.loot.length > 0 && (
              <div className="bg-white/[0.03] border border-yellow-500/20 rounded-xl p-5">
                <h3 className="font-bold text-yellow-400 text-sm mb-3 flex items-center gap-2">
                  <Trophy className="w-4 h-4" /> Botín Obtenido
                </h3>
                <div className="flex flex-wrap gap-3">
                  {result.loot.map((item, i) => (
                    <div key={i} className={`px-3 py-2 rounded-lg border ${rarityColor(item.rarity)} flex items-center gap-2`}>
                      <span className="text-lg">{item.icon}</span>
                      <div>
                        <p className="text-xs font-bold">{item.name}</p>
                        <p className="text-[10px] opacity-60">{item.rarity}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button onClick={() => startBattle(battleMode)}
                className="flex-1 py-3 bg-gradient-to-r from-red-500 to-yellow-500 text-white font-bold rounded-xl hover:scale-[1.02] transition-transform">
                Otra Batalla
              </button>
              <button onClick={resetGame}
                className="flex-1 py-3 bg-white/5 border border-white/10 text-white font-bold rounded-xl hover:bg-white/10 transition-colors">
                Volver al Menú
              </button>
              <Link href="/raids"
                className="flex-1 py-3 bg-white/5 border border-white/10 text-gray-400 font-bold rounded-xl hover:bg-white/10 transition-colors text-center">
                Info Raids
              </Link>
            </div>
          </div>
        )}
      </main>

      <GlobalFooter />
    </div>
  );
}

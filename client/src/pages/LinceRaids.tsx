import { useState, useEffect, useRef } from 'react';
import { Link } from 'wouter';
import { UserNavBadge } from '@/components/UserNavBadge';
import { useGameLang } from "@/hooks/useGameLang";
import { PRDLanguageSelector } from '../components/PRDLanguageSelector';
import { GameLanguageSelector } from '../components/GameLanguageSelector';
import { RAIDS_IMAGES } from '../lib/avatarConstants';
import { GlossaryTooltip } from '../components/GlossaryTooltip';
import { GlobalNavBar } from "@/components/GlobalNavBar";
import { BackButton } from "@/components/BackButton";

const IMAGES = RAIDS_IMAGES;

/* ─── Translations ─── */
const raidsTranslations: Record<string, Record<string, any>> = {
  es: {
    nav: { back: '← Volver al Mundo', home: '🏠 Inicio', comoJugar: '🎮 Cómo Jugar', register: 'Registro' },
    hero: {
      badge: '⚔️ PvP con Prompts de IA',
      title: 'LINCE',
      titleAccent: 'RAIDS',
      subtitle: 'Asalta, Defiende, Conquista — Todo Escribiendo Prompts de IA',
      description: 'Tus amigos construyeron casas increíbles en el Mundo LINCE. ¿Y si pudieras asaltarlas? En LINCE Raids, cada ataque y cada defensa requiere escribir un prompt de IA brillante. Mejor prompt = mejor resultado. No es fuerza bruta — es inteligencia artificial.',
      stats: [
        { number: '⚔️', label: 'Modos de Ataque' },
        { number: '🛡️', label: 'Sistemas de Defensa' },
        { number: '🏆', label: 'Ligas Semanales' },
        { number: '🧠', label: 'Todo con Prompts' },
      ],
    },
    howItWorks: {
      badge: '🎮 ¿Cómo Funciona?',
      title: 'El Primer Juego PvP Donde Gana el Mejor Prompt',
      subtitle: 'Olvida los clics rápidos. Aquí gana quien piensa mejor, escribe mejor, y domina la IA.',
      steps: [
        {
          number: '01',
          icon: '🏠',
          title: 'Construye tu Base',
          desc: 'Usa prompts para construir habitaciones, trampas, y defensas. Cada prompt genera una pieza única de tu fortaleza.',
          prompt: '"Diseña una trampa de laberinto holográfico con puzzles de IA que confundan a los intrusos"',
          xp: '+100 XP por trampa creada',
        },
        {
          number: '02',
          icon: '🔍',
          title: 'Espía a tus Rivales',
          desc: 'Escribe prompts de reconocimiento para descubrir las debilidades de las casas enemigas. La IA analiza y te da pistas.',
          prompt: '"Analiza la estructura defensiva de la casa de mi amigo y encuentra 3 puntos débiles"',
          xp: '+75 XP por informe de espionaje',
        },
        {
          number: '03',
          icon: '⚔️',
          title: 'Lanza el Asalto',
          desc: 'Escribe el prompt de ataque perfecto. La IA evalúa tu creatividad, lógica y estrategia para determinar el daño.',
          prompt: '"Ejecuta un ataque de distracción con drones holográficos mientras mi avatar principal hackea la puerta trasera"',
          xp: '+250 XP por asalto exitoso',
        },
        {
          number: '04',
          icon: '💰',
          title: 'Roba el Botín',
          desc: 'Si tu prompt fue lo suficientemente bueno, te llevas LinceCoins, recursos y objetos raros de la casa rival.',
          prompt: '"Extrae los 3 objetos más valiosos del inventario usando un portal de teletransporte IA"',
          xp: '+500 XP + LinceCoins robados',
        },
      ],
    },
    attack: {
      badge: '🔴 Modo Ataque',
      title: 'El Arte del Asalto con IA',
      subtitle: 'Cada tipo de ataque requiere un prompt diferente. Domina todos los estilos para ser el mejor asaltante.',
      types: [
        {
          icon: '🥷',
          name: 'Sigilo',
          desc: 'Prompts sutiles y elegantes que evitan las defensas sin activar alarmas',
          difficulty: '⭐⭐⭐⭐⭐',
          reward: 'x3 Botín',
          example: '"Crea una copia holográfica de mi avatar que distraiga a los guardias mientras el real se infiltra por el conducto de ventilación"',
        },
        {
          icon: '💣',
          name: 'Fuerza Bruta',
          desc: 'Prompts directos y poderosos que destruyen las defensas frontalmente',
          difficulty: '⭐⭐',
          reward: 'x1 Botín',
          example: '"Lanza un ataque masivo de robots IA contra la puerta principal con un ariete electromagnético"',
        },
        {
          icon: '🧠',
          name: 'Hackeo',
          desc: 'Prompts técnicos que desactivan los sistemas de seguridad desde dentro',
          difficulty: '⭐⭐⭐⭐',
          reward: 'x2 Botín + Datos',
          example: '"Escribe un algoritmo de IA que descifre el código de seguridad de 3 capas usando ingeniería inversa"',
        },
        {
          icon: '🎭',
          name: 'Engaño',
          desc: 'Prompts creativos que confunden a las defensas con ilusiones y señuelos',
          difficulty: '⭐⭐⭐',
          reward: 'x2 Botín',
          example: '"Genera una ilusión de que soy un visitante amigable con un regalo mientras mi equipo entra por la ventana"',
        },
      ],
    },
    defense: {
      badge: '🔵 Modo Defensa',
      title: 'Protege tu Mundo con Prompts',
      subtitle: 'No basta con construir bonito — hay que construir inteligente. Cada defensa es un prompt que protege tu hogar.',
      layers: [
        {
          icon: '🔒',
          name: 'Capa 1: Muros de IA',
          desc: 'Escribe prompts para generar muros inteligentes que se adaptan a cada tipo de ataque',
          prompt: '"Crea un muro de energía adaptativo que analice el tipo de ataque y cambie su frecuencia de defensa automáticamente"',
        },
        {
          icon: '🤖',
          name: 'Capa 2: Guardianes Bot',
          desc: 'Crea bots guardianes con personalidad propia que patrullan tu casa',
          prompt: '"Diseña un guardián robot con forma de lince que detecte intrusos y les lance acertijos de IA como trampa"',
        },
        {
          icon: '🕸️',
          name: 'Capa 3: Trampas Prompt',
          desc: 'Coloca trampas que obligan al atacante a resolver puzzles de IA para avanzar',
          prompt: '"Instala una trampa que cuando se active, obligue al intruso a escribir un prompt perfecto en 30 segundos o sea expulsado"',
        },
        {
          icon: '🛡️',
          name: 'Capa 4: Escudo Familiar',
          desc: 'Tu familia puede contribuir prompts de defensa. Más miembros = más fuerte el escudo',
          prompt: '"Activa el escudo familiar combinando los prompts de defensa de todos los miembros de la familia LINCE"',
        },
      ],
    },
    scoring: {
      badge: '📊 Sistema de Puntuación',
      title: '¿Cómo se Evalúan los Prompts?',
      subtitle: 'La IA analiza cada prompt en 5 dimensiones. No es solo escribir — es escribir BIEN.',
      criteria: [
        { icon: '🎯', name: 'Precisión', desc: '¿El prompt describe exactamente lo que quieres lograr?', weight: '25%', color: 'text-red-400' },
        { icon: '💡', name: 'Creatividad', desc: '¿Es original? ¿Tiene un enfoque único e inesperado?', weight: '25%', color: 'text-yellow-400' },
        { icon: '🔧', name: 'Técnica', desc: '¿Usa conceptos de IA correctamente? ¿Es técnicamente viable?', weight: '20%', color: 'text-blue-400' },
        { icon: '📝', name: 'Claridad', desc: '¿Está bien escrito? ¿Es fácil de entender para la IA?', weight: '15%', color: 'text-green-400' },
        { icon: '⚡', name: 'Eficiencia', desc: '¿Logra el máximo resultado con el mínimo de palabras?', weight: '15%', color: 'text-purple-400' },
      ],
      example: {
        title: 'Ejemplo de Evaluación',
        bad: {
          label: '❌ Prompt Débil',
          text: '"Ataca la casa"',
          score: '12/100 — Vago, sin estrategia, sin creatividad',
        },
        good: {
          label: '✅ Prompt Maestro',
          text: '"Despliega 3 drones de reconocimiento IA que mapeen las defensas del objetivo, identifica el punto más débil, y ejecuta un ataque coordinado de hackeo cuántico en la puerta trasera mientras una distracción holográfica mantiene ocupados a los guardianes bot del patio delantero"',
          score: '94/100 — Preciso, creativo, técnico, claro, eficiente',
        },
      },
    },
    leagues: {
      badge: '🏆 Ligas y Temporadas',
      title: 'Compite en Ligas Semanales',
      subtitle: 'Cada semana, los mejores asaltantes y defensores suben de liga. ¿Llegarás a la Liga Diamante?',
      tiers: [
        { name: 'Bronce', icon: '🥉', range: '0-500 XP', color: 'from-amber-700 to-amber-900', reward: '100 LC/semana' },
        { name: 'Plata', icon: '🥈', range: '501-1500 XP', color: 'from-gray-300 to-gray-500', reward: '300 LC/semana' },
        { name: 'Oro', icon: '🥇', range: '1501-3000 XP', color: 'from-yellow-400 to-yellow-600', reward: '500 LC/semana' },
        { name: 'Platino', icon: '💎', range: '3001-5000 XP', color: 'from-cyan-300 to-cyan-500', reward: '1000 LC/semana' },
        { name: 'Diamante', icon: '👑', range: '5001+ XP', color: 'from-purple-400 to-pink-500', reward: '2000 LC + Skin Exclusiva' },
      ],
      seasons: 'Temporadas de 4 semanas con recompensas exclusivas, skins de avatar, y trofeos permanentes.',
    },
    brainrot: {
      badge: '🧠 Modo Brainrot',
      title: 'Desafíos Rápidos Tipo Brainrot',
      subtitle: 'Rondas rápidas de 60 segundos donde tienes que escribir el mejor prompt posible. Adictivo, rápido, y educativo.',
      modes: [
        {
          icon: '⏱️',
          name: 'Speed Prompt',
          desc: 'Escribe el mejor prompt en 60 segundos. La IA evalúa al instante. El más rápido y creativo gana.',
          players: '1v1',
          time: '60s',
        },
        {
          icon: '🎲',
          name: 'Prompt Roulette',
          desc: 'La ruleta elige un tema random: "Hackea un banco de datos", "Diseña una trampa". Improvisa tu mejor prompt.',
          players: '4 jugadores',
          time: '45s',
        },
        {
          icon: '🔄',
          name: 'Prompt Chain',
          desc: 'Cada jugador añade una línea al prompt del anterior. El prompt final se ejecuta. ¿Será genial o un desastre?',
          players: '2-6 jugadores',
          time: '30s/turno',
        },
        {
          icon: '👑',
          name: 'Prompt King',
          desc: 'Todos escriben un prompt para el mismo objetivo. La IA elige al ganador. El rey defiende su corona cada ronda.',
          players: '3-8 jugadores',
          time: '90s',
        },
        {
          icon: '🎯',
          name: 'Prompt Sniper',
          desc: 'Un objetivo específico, un solo intento. Si tu prompt falla, estás eliminado. Último en pie gana.',
          players: '2-10 jugadores',
          time: '120s',
        },
        {
          icon: '👨‍👩‍👧‍👦',
          name: 'Family Raid',
          desc: 'Equipos familiares compiten contra otras familias. Abuelos, padres e hijos escriben prompts juntos.',
          players: 'Familias',
          time: '5 min',
        },
        {
          icon: '🎨',
          name: 'Batalla de Creatividad',
          desc: '3 rondas de desafíos creativos temáticos. Compites directamente contra la IA. Gana quien tenga más imaginación, detalle e impacto.',
          players: '1 vs IA',
          time: '75-90s/ronda',
        },
      ],
    },
    rewards: {
      badge: '🎁 Recompensas',
      title: '¿Qué Ganas Asaltando?',
      subtitle: 'Cada raid exitoso te da recompensas que puedes usar en el Mundo LINCE.',
      items: [
        { icon: '🪙', name: 'LinceCoins', desc: 'Moneda del juego para comprar muebles, skins, y mejoras', rarity: 'Común' },
        { icon: '🏠', name: 'Planos Raros', desc: 'Diseños exclusivos de habitaciones que solo se obtienen en raids', rarity: 'Raro' },
        { icon: '🎨', name: 'Skins de Avatar', desc: 'Apariencias únicas para tu avatar que muestran tu rango', rarity: 'Épico' },
        { icon: '🤖', name: 'Bots Guardianes', desc: 'Robots de defensa avanzados con IA personalizada', rarity: 'Épico' },
        { icon: '⚡', name: 'Power Prompts', desc: 'Prompts pre-fabricados de alta potencia para emergencias', rarity: 'Legendario' },
        { icon: '👑', name: 'Corona de Temporada', desc: 'Solo para el #1 de cada temporada. Brilla sobre tu avatar', rarity: 'Mítico' },
      ],
    },
    rules: {
      badge: '📜 Reglas del Juego',
      title: 'Código de Honor LINCE',
      subtitle: 'Los raids son divertidos, pero hay reglas. Esto es educación, no caos.',
      rulesList: [
        { icon: '🕐', name: 'Ventana de Raid', desc: 'Solo puedes ser asaltado cuando estás online o en las horas de raid programadas' },
        { icon: '🛡️', name: 'Escudo de Novato', desc: 'Los nuevos jugadores tienen 7 días de protección para construir sus defensas' },
        { icon: '💰', name: 'Límite de Robo', desc: 'Máximo 20% de los recursos del rival pueden ser robados por raid' },
        { icon: '🤝', name: 'Pactos de Paz', desc: 'Las familias pueden firmar pactos de no agresión con otras familias' },
        { icon: '📚', name: 'Siempre Educativo', desc: 'Los prompts ofensivos o sin relación con IA son rechazados automáticamente' },
        { icon: '🔄', name: 'Revancha', desc: 'Si te asaltan, tienes 24h para una revancha con bonus de +50% daño' },
      ],
    },
    cta: {
      title: '¿Listo para tu Primer Raid?',
      subtitle: 'Regístrate, construye tu base, y demuestra que eres el mejor escritor de prompts del Mundo LINCE.',
      button: '⚔️ Empezar a Asaltar',
      secondary: '🏠 Volver al Mundo',
    },
  },
  en: {
    nav: { back: '← Back to World', home: '🏠 Home', comoJugar: '🎮 How to Play', register: 'Register' },
    hero: {
      badge: '⚔️ PvP with AI Prompts',
      title: 'LINCE',
      titleAccent: 'RAIDS',
      subtitle: 'Raid, Defend, Conquer — All by Writing AI Prompts',
      description: 'Your friends built amazing houses in the LINCE World. What if you could raid them? In LINCE Raids, every attack and defense requires writing a brilliant AI prompt. Better prompt = better result. It\'s not brute force — it\'s artificial intelligence.',
      stats: [
        { number: '⚔️', label: 'Attack Modes' },
        { number: '🛡️', label: 'Defense Systems' },
        { number: '🏆', label: 'Weekly Leagues' },
        { number: '🧠', label: 'All with Prompts' },
      ],
    },
    howItWorks: {
      badge: '🎮 How It Works',
      title: 'The First PvP Game Where the Best Prompt Wins',
      subtitle: 'Forget quick clicks. Here, the one who thinks better, writes better, and masters AI wins.',
      steps: [
        {
          number: '01',
          icon: '🏠',
          title: 'Build Your Base',
          desc: 'Use prompts to build rooms, traps, and defenses. Each prompt generates a unique piece of your fortress.',
          prompt: '"Design a holographic maze trap with AI puzzles that confuse intruders"',
          xp: '+100 XP per trap created',
        },
        {
          number: '02',
          icon: '🔍',
          title: 'Spy on Rivals',
          desc: 'Write reconnaissance prompts to discover enemy house weaknesses. The AI analyzes and gives you clues.',
          prompt: '"Analyze my friend\'s defensive structure and find 3 weak points"',
          xp: '+75 XP per spy report',
        },
        {
          number: '03',
          icon: '⚔️',
          title: 'Launch the Raid',
          desc: 'Write the perfect attack prompt. The AI evaluates your creativity, logic and strategy to determine damage.',
          prompt: '"Execute a distraction attack with holographic drones while my main avatar hacks the back door"',
          xp: '+250 XP per successful raid',
        },
        {
          number: '04',
          icon: '💰',
          title: 'Steal the Loot',
          desc: 'If your prompt was good enough, you take LinceCoins, resources and rare items from the rival house.',
          prompt: '"Extract the 3 most valuable items from the inventory using an AI teleportation portal"',
          xp: '+500 XP + stolen LinceCoins',
        },
      ],
    },
    attack: {
      badge: '🔴 Attack Mode',
      title: 'The Art of AI Raiding',
      subtitle: 'Each attack type requires a different prompt. Master all styles to be the best raider.',
      types: [
        {
          icon: '🥷',
          name: 'Stealth',
          desc: 'Subtle and elegant prompts that avoid defenses without triggering alarms',
          difficulty: '⭐⭐⭐⭐⭐',
          reward: 'x3 Loot',
          example: '"Create a holographic copy of my avatar to distract guards while the real one infiltrates through the ventilation duct"',
        },
        {
          icon: '💣',
          name: 'Brute Force',
          desc: 'Direct and powerful prompts that destroy defenses head-on',
          difficulty: '⭐⭐',
          reward: 'x1 Loot',
          example: '"Launch a massive AI robot attack against the main door with an electromagnetic battering ram"',
        },
        {
          icon: '🧠',
          name: 'Hacking',
          desc: 'Technical prompts that disable security systems from within',
          difficulty: '⭐⭐⭐⭐',
          reward: 'x2 Loot + Data',
          example: '"Write an AI algorithm that decrypts the 3-layer security code using reverse engineering"',
        },
        {
          icon: '🎭',
          name: 'Deception',
          desc: 'Creative prompts that confuse defenses with illusions and decoys',
          difficulty: '⭐⭐⭐',
          reward: 'x2 Loot',
          example: '"Generate an illusion that I\'m a friendly visitor with a gift while my team enters through the window"',
        },
      ],
    },
    defense: {
      badge: '🔵 Defense Mode',
      title: 'Protect Your World with Prompts',
      subtitle: 'Building pretty isn\'t enough — you need to build smart. Each defense is a prompt that protects your home.',
      layers: [
        {
          icon: '🔒',
          name: 'Layer 1: AI Walls',
          desc: 'Write prompts to generate smart walls that adapt to each attack type',
          prompt: '"Create an adaptive energy wall that analyzes the attack type and automatically changes its defense frequency"',
        },
        {
          icon: '🤖',
          name: 'Layer 2: Guardian Bots',
          desc: 'Create guardian bots with their own personality that patrol your house',
          prompt: '"Design a lynx-shaped guardian robot that detects intruders and throws AI riddles as traps"',
        },
        {
          icon: '🕸️',
          name: 'Layer 3: Prompt Traps',
          desc: 'Place traps that force attackers to solve AI puzzles to advance',
          prompt: '"Install a trap that when activated, forces the intruder to write a perfect prompt in 30 seconds or be expelled"',
        },
        {
          icon: '🛡️',
          name: 'Layer 4: Family Shield',
          desc: 'Your family can contribute defense prompts. More members = stronger shield',
          prompt: '"Activate the family shield by combining defense prompts from all LINCE family members"',
        },
      ],
    },
    scoring: {
      badge: '📊 Scoring System',
      title: 'How Are Prompts Evaluated?',
      subtitle: 'The AI analyzes each prompt across 5 dimensions. It\'s not just writing — it\'s writing WELL.',
      criteria: [
        { icon: '🎯', name: 'Precision', desc: 'Does the prompt describe exactly what you want to achieve?', weight: '25%', color: 'text-red-400' },
        { icon: '💡', name: 'Creativity', desc: 'Is it original? Does it have a unique, unexpected approach?', weight: '25%', color: 'text-yellow-400' },
        { icon: '🔧', name: 'Technique', desc: 'Does it use AI concepts correctly? Is it technically viable?', weight: '20%', color: 'text-blue-400' },
        { icon: '📝', name: 'Clarity', desc: 'Is it well-written? Is it easy for the AI to understand?', weight: '15%', color: 'text-green-400' },
        { icon: '⚡', name: 'Efficiency', desc: 'Does it achieve maximum result with minimum words?', weight: '15%', color: 'text-purple-400' },
      ],
      example: {
        title: 'Evaluation Example',
        bad: {
          label: '❌ Weak Prompt',
          text: '"Attack the house"',
          score: '12/100 — Vague, no strategy, no creativity',
        },
        good: {
          label: '✅ Master Prompt',
          text: '"Deploy 3 AI reconnaissance drones to map the target\'s defenses, identify the weakest point, and execute a coordinated quantum hacking attack on the back door while a holographic distraction keeps the front yard guardian bots busy"',
          score: '94/100 — Precise, creative, technical, clear, efficient',
        },
      },
    },
    leagues: {
      badge: '🏆 Leagues & Seasons',
      title: 'Compete in Weekly Leagues',
      subtitle: 'Every week, the best raiders and defenders climb the leagues. Will you reach Diamond League?',
      tiers: [
        { name: 'Bronze', icon: '🥉', range: '0-500 XP', color: 'from-amber-700 to-amber-900', reward: '100 LC/week' },
        { name: 'Silver', icon: '🥈', range: '501-1500 XP', color: 'from-gray-300 to-gray-500', reward: '300 LC/week' },
        { name: 'Gold', icon: '🥇', range: '1501-3000 XP', color: 'from-yellow-400 to-yellow-600', reward: '500 LC/week' },
        { name: 'Platinum', icon: '💎', range: '3001-5000 XP', color: 'from-cyan-300 to-cyan-500', reward: '1000 LC/week' },
        { name: 'Diamond', icon: '👑', range: '5001+ XP', color: 'from-purple-400 to-pink-500', reward: '2000 LC + Exclusive Skin' },
      ],
      seasons: '4-week seasons with exclusive rewards, avatar skins, and permanent trophies.',
    },
    brainrot: {
      badge: '🧠 Brainrot Mode',
      title: 'Quick Brainrot-Style Challenges',
      subtitle: 'Fast 60-second rounds where you must write the best prompt possible. Addictive, fast, and educational.',
      modes: [
        { icon: '⏱️', name: 'Speed Prompt', desc: 'Write the best prompt in 60 seconds. AI evaluates instantly. Fastest and most creative wins.', players: '1v1', time: '60s' },
        { icon: '🎲', name: 'Prompt Roulette', desc: 'The roulette picks a random topic: "Hack a database", "Design a trap". Improvise your best prompt.', players: '4 players', time: '45s' },
        { icon: '🔄', name: 'Prompt Chain', desc: 'Each player adds a line to the previous prompt. The final prompt executes. Will it be genius or disaster?', players: '2-6 players', time: '30s/turn' },
        { icon: '👑', name: 'Prompt King', desc: 'Everyone writes a prompt for the same objective. AI picks the winner. The king defends the crown each round.', players: '3-8 players', time: '90s' },
        { icon: '🎯', name: 'Prompt Sniper', desc: 'One specific target, one attempt. If your prompt fails, you\'re eliminated. Last one standing wins.', players: '2-10 players', time: '120s' },
        { icon: '👨‍👩‍👧‍👦', name: 'Family Raid', desc: 'Family teams compete against other families. Grandparents, parents and kids write prompts together.', players: 'Families', time: '5 min' },
        { icon: '🎨', name: 'Creativity Battle', desc: '3 rounds of themed creative challenges. Compete directly against the AI. Whoever has the most imagination, detail and impact wins.', players: '1 vs AI', time: '75-90s/round' },
      ],
    },
    rewards: {
      badge: '🎁 Rewards',
      title: 'What Do You Win by Raiding?',
      subtitle: 'Each successful raid gives you rewards to use in the LINCE World.',
      items: [
        { icon: '🪙', name: 'LinceCoins', desc: 'In-game currency for furniture, skins, and upgrades', rarity: 'Common' },
        { icon: '🏠', name: 'Rare Blueprints', desc: 'Exclusive room designs only obtainable through raids', rarity: 'Rare' },
        { icon: '🎨', name: 'Avatar Skins', desc: 'Unique avatar appearances that show your rank', rarity: 'Epic' },
        { icon: '🤖', name: 'Guardian Bots', desc: 'Advanced defense robots with custom AI', rarity: 'Epic' },
        { icon: '⚡', name: 'Power Prompts', desc: 'Pre-built high-power prompts for emergencies', rarity: 'Legendary' },
        { icon: '👑', name: 'Season Crown', desc: 'Only for #1 each season. Shines above your avatar', rarity: 'Mythic' },
      ],
    },
    rules: {
      badge: '📜 Game Rules',
      title: 'LINCE Honor Code',
      subtitle: 'Raids are fun, but there are rules. This is education, not chaos.',
      rulesList: [
        { icon: '🕐', name: 'Raid Window', desc: 'You can only be raided when online or during scheduled raid hours' },
        { icon: '🛡️', name: 'Newbie Shield', desc: 'New players get 7 days of protection to build their defenses' },
        { icon: '💰', name: 'Theft Limit', desc: 'Maximum 20% of rival\'s resources can be stolen per raid' },
        { icon: '🤝', name: 'Peace Pacts', desc: 'Families can sign non-aggression pacts with other families' },
        { icon: '📚', name: 'Always Educational', desc: 'Offensive or non-AI-related prompts are automatically rejected' },
        { icon: '🔄', name: 'Revenge', desc: 'If raided, you have 24h for revenge with +50% damage bonus' },
      ],
    },
    cta: {
      title: 'Ready for Your First Raid?',
      subtitle: 'Register, build your base, and prove you\'re the best prompt writer in the LINCE World.',
      button: '⚔️ Start Raiding',
      secondary: '🏠 Back to World',
    },
  },
  zh: {
    nav: { back: '← 返回世界', home: '🏠 首页', comoJugar: '🎮 如何游玩', register: '注册' },
    hero: {
      badge: '⚔️ AI提示词PvP对战',
      title: 'LINCE',
      titleAccent: 'RAIDS',
      subtitle: '突袭、防御、征服 — 全靠编写AI提示词',
      description: '你的朋友在LINCE世界里建造了令人惊叹的房子。如果你可以突袭它们呢？在LINCE Raids中，每次攻击和防御都需要编写出色的AI提示词。更好的提示词 = 更好的结果。这不是蛮力 — 这是人工智能。',
      stats: [
        { number: '⚔️', label: '攻击模式' },
        { number: '🛡️', label: '防御系统' },
        { number: '🏆', label: '每周联赛' },
        { number: '🧠', label: '全靠提示词' },
      ],
    },
    howItWorks: {
      badge: '🎮 如何运作',
      title: '第一款最佳提示词获胜的PvP游戏',
      subtitle: '忘记快速点击。在这里，思考更好、写作更好、掌握AI的人获胜。',
      steps: [
        { number: '01', icon: '🏠', title: '建造基地', desc: '使用提示词建造房间、陷阱和防御。每个提示词生成你堡垒的独特部分。', prompt: '"设计一个带有AI谜题的全息迷宫陷阱来迷惑入侵者"', xp: '+100 XP/陷阱' },
        { number: '02', icon: '🔍', title: '侦察对手', desc: '编写侦察提示词发现敌方房屋弱点。AI分析并给你线索。', prompt: '"分析我朋友的防御结构并找出3个弱点"', xp: '+75 XP/侦察报告' },
        { number: '03', icon: '⚔️', title: '发起突袭', desc: '编写完美的攻击提示词。AI评估你的创造力、逻辑和策略来确定伤害。', prompt: '"用全息无人机执行分散注意力的攻击，同时主角色黑入后门"', xp: '+250 XP/成功突袭' },
        { number: '04', icon: '💰', title: '抢夺战利品', desc: '如果你的提示词足够好，你将获得LinceCoins、资源和对手房屋的稀有物品。', prompt: '"使用AI传送门提取库存中3件最有价值的物品"', xp: '+500 XP + 抢夺的LinceCoins' },
      ],
    },
    attack: {
      badge: '🔴 攻击模式',
      title: 'AI突袭的艺术',
      subtitle: '每种攻击类型需要不同的提示词。掌握所有风格成为最佳突袭者。',
      types: [
        { icon: '🥷', name: '潜行', desc: '微妙优雅的提示词，不触发警报避开防御', difficulty: '⭐⭐⭐⭐⭐', reward: 'x3 战利品', example: '"创建我的头像全息副本分散守卫注意力，同时真身通过通风管道潜入"' },
        { icon: '💣', name: '蛮力', desc: '直接强力的提示词正面摧毁防御', difficulty: '⭐⭐', reward: 'x1 战利品', example: '"用电磁攻城锤对主门发动大规模AI机器人攻击"' },
        { icon: '🧠', name: '黑客', desc: '从内部禁用安全系统的技术提示词', difficulty: '⭐⭐⭐⭐', reward: 'x2 战利品 + 数据', example: '"编写AI算法使用逆向工程破解3层安全代码"' },
        { icon: '🎭', name: '欺骗', desc: '用幻觉和诱饵迷惑防御的创意提示词', difficulty: '⭐⭐⭐', reward: 'x2 战利品', example: '"生成我是带礼物的友好访客的幻觉，同时我的团队从窗户进入"' },
      ],
    },
    defense: {
      badge: '🔵 防御模式',
      title: '用提示词保护你的世界',
      subtitle: '光建得漂亮不够——要建得聪明。每个防御都是保护你家园的提示词。',
      layers: [
        { icon: '🔒', name: '第1层：AI墙壁', desc: '编写提示词生成适应每种攻击类型的智能墙壁', prompt: '"创建自适应能量墙，分析攻击类型并自动改变防御频率"' },
        { icon: '🤖', name: '第2层：守护机器人', desc: '创建有自己个性的守护机器人巡逻你的房子', prompt: '"设计一个猞猁形状的守护机器人，检测入侵者并投掷AI谜语作为陷阱"' },
        { icon: '🕸️', name: '第3层：提示词陷阱', desc: '放置迫使攻击者解决AI谜题才能前进的陷阱', prompt: '"安装一个陷阱，激活时迫使入侵者在30秒内写出完美提示词否则被驱逐"' },
        { icon: '🛡️', name: '第4层：家庭护盾', desc: '你的家人可以贡献防御提示词。更多成员 = 更强护盾', prompt: '"结合所有LINCE家庭成员的防御提示词激活家庭护盾"' },
      ],
    },
    scoring: {
      badge: '📊 评分系统',
      title: '提示词如何评估？',
      subtitle: 'AI从5个维度分析每个提示词。不只是写——是写得好。',
      criteria: [
        { icon: '🎯', name: '精确度', desc: '提示词是否准确描述了你想要实现的目标？', weight: '25%', color: 'text-red-400' },
        { icon: '💡', name: '创造力', desc: '是否原创？是否有独特意想不到的方法？', weight: '25%', color: 'text-yellow-400' },
        { icon: '🔧', name: '技术性', desc: '是否正确使用AI概念？技术上是否可行？', weight: '20%', color: 'text-blue-400' },
        { icon: '📝', name: '清晰度', desc: '写得好吗？AI容易理解吗？', weight: '15%', color: 'text-green-400' },
        { icon: '⚡', name: '效率', desc: '是否用最少的词达到最大效果？', weight: '15%', color: 'text-purple-400' },
      ],
      example: {
        title: '评估示例',
        bad: { label: '❌ 弱提示词', text: '"攻击房子"', score: '12/100 — 模糊，无策略，无创意' },
        good: { label: '✅ 大师提示词', text: '"部署3架AI侦察无人机映射目标防御，识别最薄弱点，在全息干扰让前院守护机器人忙碌时对后门执行协调量子黑客攻击"', score: '94/100 — 精确、创意、技术、清晰、高效' },
      },
    },
    leagues: {
      badge: '🏆 联赛与赛季',
      title: '参加每周联赛',
      subtitle: '每周，最佳突袭者和防御者晋升联赛。你能到达钻石联赛吗？',
      tiers: [
        { name: '青铜', icon: '🥉', range: '0-500 XP', color: 'from-amber-700 to-amber-900', reward: '100 LC/周' },
        { name: '白银', icon: '🥈', range: '501-1500 XP', color: 'from-gray-300 to-gray-500', reward: '300 LC/周' },
        { name: '黄金', icon: '🥇', range: '1501-3000 XP', color: 'from-yellow-400 to-yellow-600', reward: '500 LC/周' },
        { name: '铂金', icon: '💎', range: '3001-5000 XP', color: 'from-cyan-300 to-cyan-500', reward: '1000 LC/周' },
        { name: '钻石', icon: '👑', range: '5001+ XP', color: 'from-purple-400 to-pink-500', reward: '2000 LC + 独家皮肤' },
      ],
      seasons: '4周赛季，独家奖励、头像皮肤和永久奖杯。',
    },
    brainrot: {
      badge: '🧠 脑洞模式',
      title: '快速脑洞挑战',
      subtitle: '60秒快速回合，你必须写出最好的提示词。上瘾、快速、有教育意义。',
      modes: [
        { icon: '⏱️', name: '极速提示词', desc: '60秒内写出最佳提示词。AI即时评估。最快最有创意的获胜。', players: '1v1', time: '60秒' },
        { icon: '🎲', name: '提示词轮盘', desc: '轮盘选择随机主题："黑入数据库"、"设计陷阱"。即兴发挥你最好的提示词。', players: '4人', time: '45秒' },
        { icon: '🔄', name: '提示词接龙', desc: '每个玩家在前一个提示词上添加一行。最终提示词执行。是天才还是灾难？', players: '2-6人', time: '30秒/轮' },
        { icon: '👑', name: '提示词之王', desc: '所有人为同一目标写提示词。AI选出赢家。国王每轮捍卫王冠。', players: '3-8人', time: '90秒' },
        { icon: '🎯', name: '提示词狙击手', desc: '一个特定目标，一次机会。提示词失败就淘汰。最后站立者获胜。', players: '2-10人', time: '120秒' },
        { icon: '👨‍👩‍👧‍👦', name: '家庭突袭', desc: '家庭团队与其他家庭竞争。祖父母、父母和孩子一起写提示词。', players: '家庭', time: '5分钟' },
        { icon: '🎨', name: '创意对战', desc: '3轮主题创意挑战。直接与AI竞争。想象力、细节和影响力最强的获胜。', players: '1 vs AI', time: '75-90秒/轮' },
      ],
    },
    rewards: {
      badge: '🎁 奖励',
      title: '突袭能赢得什么？',
      subtitle: '每次成功突袭都给你在LINCE世界中使用的奖励。',
      items: [
        { icon: '🪙', name: 'LinceCoins', desc: '游戏货币，用于购买家具、皮肤和升级', rarity: '普通' },
        { icon: '🏠', name: '稀有蓝图', desc: '只能通过突袭获得的独家房间设计', rarity: '稀有' },
        { icon: '🎨', name: '头像皮肤', desc: '展示你排名的独特头像外观', rarity: '史诗' },
        { icon: '🤖', name: '守护机器人', desc: '具有自定义AI的高级防御机器人', rarity: '史诗' },
        { icon: '⚡', name: '强力提示词', desc: '用于紧急情况的预制高威力提示词', rarity: '传说' },
        { icon: '👑', name: '赛季皇冠', desc: '仅限每赛季第1名。在你的头像上闪耀', rarity: '神话' },
      ],
    },
    rules: {
      badge: '📜 游戏规则',
      title: 'LINCE荣誉守则',
      subtitle: '突袭很有趣，但有规则。这是教育，不是混乱。',
      rulesList: [
        { icon: '🕐', name: '突袭窗口', desc: '只有在线或在预定突袭时间内才能被突袭' },
        { icon: '🛡️', name: '新手护盾', desc: '新玩家有7天保护期来建造防御' },
        { icon: '💰', name: '盗窃限制', desc: '每次突袭最多偷取对手20%的资源' },
        { icon: '🤝', name: '和平条约', desc: '家庭可以与其他家庭签署互不侵犯条约' },
        { icon: '📚', name: '始终教育性', desc: '攻击性或与AI无关的提示词自动被拒绝' },
        { icon: '🔄', name: '复仇', desc: '被突袭后24小时内可复仇，伤害加成+50%' },
      ],
    },
    cta: {
      title: '准备好你的第一次突袭了吗？',
      subtitle: '注册，建造你的基地，证明你是LINCE世界中最好的提示词作家。',
      button: '⚔️ 开始突袭',
      secondary: '🏠 返回世界',
    },
  },
};

/* ─── FadeIn Animation Component ─── */
function FadeIn({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setVisible(true); }, { threshold: 0.1 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return (
    <div ref={ref} className="pt-14 transition-all duration-700" style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(30px)', transitionDelay: `${delay}ms` }}>
      <BackButton variant="inline" />
      <GlobalNavBar />
      {children}
    </div>
  );
}

/* ─── Prompt Display Component ─── */
function PromptBox({ prompt, xp }: { prompt: string; xp?: string }) {
  return (
    <div className="mt-3 bg-black/40 border border-red-500/30 rounded-lg p-3">
      <div className="flex items-start gap-2">
        <span className="text-red-400 text-xs font-mono mt-0.5">{'>'}_</span>
        <p className="text-red-300/80 text-xs font-mono italic leading-relaxed">{prompt}</p>
      </div>
      {xp && <p className="text-right text-[10px] text-yellow-400/80 font-bold mt-1">{xp}</p>}
    </div>
  );
}

/* ─── Rarity Badge ─── */
function RarityBadge({ rarity }: { rarity: string }) {
  const colors: Record<string, string> = {
    'Común': 'bg-gray-500/20 text-gray-400 border-gray-500/30',
    'Common': 'bg-gray-500/20 text-gray-400 border-gray-500/30',
    '普通': 'bg-gray-500/20 text-gray-400 border-gray-500/30',
    'Raro': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    'Rare': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    '稀有': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    'Épico': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    'Epic': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    '史诗': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    'Legendario': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    'Legendary': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    '传说': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    'Mítico': 'bg-pink-500/20 text-pink-400 border-pink-500/30',
    'Mythic': 'bg-pink-500/20 text-pink-400 border-pink-500/30',
    '神话': 'bg-pink-500/20 text-pink-400 border-pink-500/30',
  };
  return (
    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${colors[rarity] || 'bg-gray-500/20 text-gray-400 border-gray-500/30'}`}>
      {rarity}
    </span>
  );
}

/* ─── Main Page Component ─── */
export default function LinceRaids() {
  const { lang } = useGameLang();
  const t = raidsTranslations[lang] || raidsTranslations.es;

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      {/* Navigation */}

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-14">
        <div className="absolute inset-0">
          <img src={IMAGES.hero} alt="LINCE Raids" className="w-full h-full object-cover opacity-40" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0A] via-[#0A0A0A]/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-[#0A0A0A]/50" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 py-20">
          <FadeIn>
            <span className="inline-block bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-bold px-4 py-1.5 rounded-full mb-6">{t.hero.badge}</span>
          </FadeIn>
          <FadeIn delay={100}>
            <h1 className="text-6xl md:text-8xl font-black tracking-tight mb-4">
              <span className="text-white">{t.hero.title}</span>{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-yellow-500">{t.hero.titleAccent}</span>
            </h1>
          </FadeIn>
          <FadeIn delay={200}>
            <p className="text-xl md:text-2xl text-yellow-400/90 font-medium max-w-3xl mb-6">{t.hero.subtitle}</p>
          </FadeIn>
          <FadeIn delay={300}>
            <p className="text-gray-300/80 text-base max-w-2xl mb-8 leading-relaxed">
              {lang === 'es' ? <>
                Asalta las casas de tus amigos y defiende la tuya. Escribe <GlossaryTooltip term="prompt">prompts</GlossaryTooltip> de ataque y defensa. La <GlossaryTooltip term="ia">IA</GlossaryTooltip> decide quién gana. Gana <GlossaryTooltip term="lincecoins">LinceCoins</GlossaryTooltip>, sube de <GlossaryTooltip term="liga">liga</GlossaryTooltip> y demuestra que eres el mejor.
              </> : lang === 'en' ? <>
                Raid your friends' houses and defend yours. Write attack and defense <GlossaryTooltip term="prompt">prompts</GlossaryTooltip>. <GlossaryTooltip term="ia">AI</GlossaryTooltip> decides who wins. Earn <GlossaryTooltip term="lincecoins">LinceCoins</GlossaryTooltip>, climb <GlossaryTooltip term="liga">leagues</GlossaryTooltip> and prove you're the best.
              </> : <>
                突袭朋友的房子并保护你的。写攻击和防御<GlossaryTooltip term="prompt">提示词</GlossaryTooltip>。<GlossaryTooltip term="ia">AI</GlossaryTooltip>决定谁赢。赚取<GlossaryTooltip term="lincecoins">LinceCoins</GlossaryTooltip>，晋级<GlossaryTooltip term="liga">联赛</GlossaryTooltip>。
              </>}
            </p>
          </FadeIn>
          <FadeIn delay={400}>
            <div className="flex flex-wrap gap-4">
              {t.hero.stats.map((s: any, i: number) => (
                <div key={i} className="bg-white/5 border border-white/10 rounded-xl px-5 py-3 text-center">
                  <div className="text-2xl">{s.number}</div>
                  <div className="text-xs text-gray-400">{s.label}</div>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* How It Works */}
      <section id="how" className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <FadeIn>
            <span className="inline-block bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 text-xs font-bold px-3 py-1 rounded-full mb-4">{t.howItWorks.badge}</span>
            <h2 className="text-4xl md:text-5xl font-black mb-2">{t.howItWorks.title}</h2>
            <p className="text-gray-400 text-lg mb-12 max-w-2xl">{t.howItWorks.subtitle}</p>
          </FadeIn>
          <div className="space-y-6">
            {t.howItWorks.steps.map((step: any, i: number) => (
              <FadeIn key={i} delay={i * 100}>
                <div className="flex gap-6 bg-white/[0.02] border border-white/5 rounded-2xl p-6 hover:border-yellow-500/20 transition-colors">
                  <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-red-500/20 to-yellow-500/20 rounded-xl flex items-center justify-center">
                    <span className="text-3xl">{step.icon}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-red-500/50 font-mono text-sm">{step.number}</span>
                      <h3 className="text-xl font-bold text-white">{step.title}</h3>
                    </div>
                    <p className="text-gray-400 text-sm leading-relaxed mb-2">{step.desc}</p>
                    <PromptBox prompt={step.prompt} xp={step.xp} />
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Attack Mode */}
      <section className="py-24 px-4 relative">
        <div className="absolute inset-0 opacity-10">
          <img src={IMAGES.attack} alt="" className="w-full h-full object-cover" />
        </div>
        <div className="relative z-10 max-w-6xl mx-auto">
          <FadeIn>
            <span className="inline-block bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-bold px-3 py-1 rounded-full mb-4">{t.attack.badge}</span>
            <h2 className="text-4xl md:text-5xl font-black mb-2">{t.attack.title}</h2>
            <p className="text-gray-400 text-lg mb-12 max-w-2xl">{t.attack.subtitle}</p>
          </FadeIn>
          <div className="grid md:grid-cols-2 gap-6">
            {t.attack.types.map((type: any, i: number) => (
              <FadeIn key={i} delay={i * 100}>
                <div className="bg-[#0A0A0A]/90 backdrop-blur border border-red-500/10 rounded-2xl p-6 hover:border-red-500/30 transition-colors">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{type.icon}</span>
                      <h3 className="text-xl font-bold text-white">{type.name}</h3>
                    </div>
                    <span className="text-yellow-400 text-xs font-bold bg-yellow-400/10 px-2 py-1 rounded">{type.reward}</span>
                  </div>
                  <p className="text-gray-400 text-sm mb-2">{type.desc}</p>
                  <p className="text-xs text-gray-600 mb-3">{type.difficulty}</p>
                  <PromptBox prompt={type.example} />
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Defense Mode */}
      <section className="py-24 px-4 relative">
        <div className="absolute inset-0 opacity-10">
          <img src={IMAGES.defense} alt="" className="w-full h-full object-cover" />
        </div>
        <div className="relative z-10 max-w-6xl mx-auto">
          <FadeIn>
            <span className="inline-block bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-bold px-3 py-1 rounded-full mb-4">{t.defense.badge}</span>
            <h2 className="text-4xl md:text-5xl font-black mb-2">{t.defense.title}</h2>
            <p className="text-gray-400 text-lg mb-12 max-w-2xl">{t.defense.subtitle}</p>
          </FadeIn>
          <div className="space-y-4">
            {t.defense.layers.map((layer: any, i: number) => (
              <FadeIn key={i} delay={i * 100}>
                <div className="bg-[#0A0A0A]/90 backdrop-blur border border-blue-500/10 rounded-2xl p-6 hover:border-blue-500/30 transition-colors">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-2xl">{layer.icon}</span>
                    <h3 className="text-lg font-bold text-white">{layer.name}</h3>
                  </div>
                  <p className="text-gray-400 text-sm mb-3">{layer.desc}</p>
                  <div className="bg-black/40 border border-blue-500/20 rounded-lg p-3">
                    <div className="flex items-start gap-2">
                      <span className="text-blue-400 text-xs font-mono mt-0.5">{'>'}_</span>
                      <p className="text-blue-300/80 text-xs font-mono italic leading-relaxed">{layer.prompt}</p>
                    </div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Scoring System */}
      <section className="py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <FadeIn>
            <span className="inline-block bg-green-500/10 border border-green-500/30 text-green-400 text-xs font-bold px-3 py-1 rounded-full mb-4">{t.scoring.badge}</span>
            <h2 className="text-4xl md:text-5xl font-black mb-2">{t.scoring.title}</h2>
            <p className="text-gray-400 text-lg mb-12 max-w-2xl">{t.scoring.subtitle}</p>
          </FadeIn>
          <div className="grid grid-cols-5 gap-3 mb-12">
            {t.scoring.criteria.map((c: any, i: number) => (
              <FadeIn key={i} delay={i * 80}>
                <div className="bg-white/[0.02] border border-white/5 rounded-xl p-4 text-center hover:border-white/10 transition-colors">
                  <div className="text-3xl mb-2">{c.icon}</div>
                  <h4 className={`font-bold text-sm mb-1 ${c.color}`}>{c.name}</h4>
                  <p className="text-gray-500 text-[10px] leading-tight mb-2">{c.desc}</p>
                  <div className="text-white font-black text-lg">{c.weight}</div>
                </div>
              </FadeIn>
            ))}
          </div>
          <FadeIn>
            <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-white mb-4">{t.scoring.example.title}</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-4">
                  <p className="text-red-400 font-bold text-sm mb-2">{t.scoring.example.bad.label}</p>
                  <p className="text-white font-mono text-sm mb-2">{t.scoring.example.bad.text}</p>
                  <p className="text-red-400/60 text-xs">{t.scoring.example.bad.score}</p>
                </div>
                <div className="bg-green-500/5 border border-green-500/20 rounded-xl p-4">
                  <p className="text-green-400 font-bold text-sm mb-2">{t.scoring.example.good.label}</p>
                  <p className="text-white font-mono text-xs mb-2 leading-relaxed">{t.scoring.example.good.text}</p>
                  <p className="text-green-400/60 text-xs">{t.scoring.example.good.score}</p>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Brainrot Mode */}
      <section className="py-24 px-4 bg-gradient-to-b from-transparent via-purple-500/5 to-transparent">
        <div className="max-w-6xl mx-auto">
          <FadeIn>
            <span className="inline-block bg-purple-500/10 border border-purple-500/30 text-purple-400 text-xs font-bold px-3 py-1 rounded-full mb-4">{t.brainrot.badge}</span>
            <h2 className="text-4xl md:text-5xl font-black mb-2">{t.brainrot.title}</h2>
            <p className="text-gray-400 text-lg mb-12 max-w-2xl">{t.brainrot.subtitle}</p>
          </FadeIn>
          <div className="grid md:grid-cols-3 gap-4">
            {t.brainrot.modes.map((mode: any, i: number) => (
              <FadeIn key={i} delay={i * 80}>
                <div className="bg-white/[0.02] border border-purple-500/10 rounded-2xl p-5 hover:border-purple-500/30 transition-colors group">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-3xl group-hover:scale-110 transition-transform">{mode.icon}</span>
                    <div className="flex gap-2">
                      <span className="text-[10px] text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded">{mode.players}</span>
                      <span className="text-[10px] text-yellow-400 bg-yellow-500/10 px-2 py-0.5 rounded">{mode.time}</span>
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{mode.name}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{mode.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Leagues */}
      <section className="py-24 px-4 relative">
        <div className="absolute inset-0 opacity-10">
          <img src={IMAGES.leaderboard} alt="" className="w-full h-full object-cover" />
        </div>
        <div className="relative z-10 max-w-5xl mx-auto">
          <FadeIn>
            <span className="inline-block bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 text-xs font-bold px-3 py-1 rounded-full mb-4">{t.leagues.badge}</span>
            <h2 className="text-4xl md:text-5xl font-black mb-2">{t.leagues.title}</h2>
            <p className="text-gray-400 text-lg mb-12 max-w-2xl">{t.leagues.subtitle}</p>
          </FadeIn>
          <div className="flex flex-col gap-3 mb-8">
            {t.leagues.tiers.map((tier: any, i: number) => (
              <FadeIn key={i} delay={i * 100}>
                <div className={`bg-gradient-to-r ${tier.color} bg-opacity-20 border border-white/10 rounded-xl p-4 flex items-center justify-between hover:scale-[1.02] transition-transform`}>
                  <div className="flex items-center gap-4">
                    <span className="text-3xl">{tier.icon}</span>
                    <div>
                      <h3 className="text-lg font-bold text-white">{tier.name}</h3>
                      <p className="text-white/60 text-xs">{tier.range}</p>
                    </div>
                  </div>
                  <span className="text-yellow-300 font-bold text-sm">{tier.reward}</span>
                </div>
              </FadeIn>
            ))}
          </div>
          <FadeIn>
            <p className="text-gray-500 text-sm text-center italic">{t.leagues.seasons}</p>
          </FadeIn>
        </div>
      </section>

      {/* Rewards */}
      <section className="py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <FadeIn>
            <span className="inline-block bg-pink-500/10 border border-pink-500/30 text-pink-400 text-xs font-bold px-3 py-1 rounded-full mb-4">{t.rewards.badge}</span>
            <h2 className="text-4xl md:text-5xl font-black mb-2">{t.rewards.title}</h2>
            <p className="text-gray-400 text-lg mb-12 max-w-2xl">{t.rewards.subtitle}</p>
          </FadeIn>
          <div className="grid md:grid-cols-3 gap-4">
            {t.rewards.items.map((item: any, i: number) => (
              <FadeIn key={i} delay={i * 80}>
                <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-5 hover:border-pink-500/20 transition-colors">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-3xl">{item.icon}</span>
                    <RarityBadge rarity={item.rarity} />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-1">{item.name}</h3>
                  <p className="text-gray-400 text-sm">{item.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Rules */}
      <section className="py-24 px-4">
        <div className="max-w-4xl mx-auto">
          <FadeIn>
            <span className="inline-block bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold px-3 py-1 rounded-full mb-4">{t.rules.badge}</span>
            <h2 className="text-4xl md:text-5xl font-black mb-2">{t.rules.title}</h2>
            <p className="text-gray-400 text-lg mb-12 max-w-2xl">{t.rules.subtitle}</p>
          </FadeIn>
          <div className="grid md:grid-cols-2 gap-4">
            {t.rules.rulesList.map((rule: any, i: number) => (
              <FadeIn key={i} delay={i * 80}>
                <div className="flex gap-4 bg-white/[0.02] border border-white/5 rounded-xl p-4 hover:border-cyan-500/20 transition-colors">
                  <span className="text-2xl flex-shrink-0">{rule.icon}</span>
                  <div>
                    <h4 className="font-bold text-white text-sm mb-1">{rule.name}</h4>
                    <p className="text-gray-400 text-xs leading-relaxed">{rule.desc}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4 bg-gradient-to-b from-transparent via-red-500/5 to-transparent">
        <div className="max-w-3xl mx-auto text-center">
          <FadeIn>
            <h2 className="text-4xl md:text-5xl font-black mb-4">{t.cta.title}</h2>
            <p className="text-gray-400 text-lg mb-8">{t.cta.subtitle}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/raids-batalla" className="bg-gradient-to-r from-red-500 to-yellow-500 text-white font-bold px-8 py-3 rounded-full text-lg hover:scale-105 transition-transform inline-block">
                {t.cta.button}
              </Link>
              <Link href="/mundo" className="bg-white/5 border border-cyan-500/30 text-cyan-400 font-bold px-8 py-3 rounded-full text-lg hover:bg-cyan-500/10 transition-colors inline-block">
                {t.cta.secondary}
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-white/5">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-gray-600 text-xs">LINCE® RAIDS — ACNB IA SL — {new Date().getFullYear()}</p>
        </div>
      </footer>
    </div>
  );
}

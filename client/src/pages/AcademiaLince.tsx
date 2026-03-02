import { tl } from "@/contexts/PRDLanguageContext";
import { useState, useEffect, useRef, useMemo } from 'react';
import { Link } from 'wouter';
import { UserNavBadge } from '@/components/UserNavBadge';
import { useGameLang } from "@/hooks/useGameLang";
import { PRDLanguageSelector } from '../components/PRDLanguageSelector';
import { GameLanguageSelector } from '../components/GameLanguageSelector';
import { AVATAR_FRONTAL, AVATAR_EDU, ACADEMIA_HERO_BG } from '../lib/avatarConstants';
import { GlossaryTooltip } from '../components/GlossaryTooltip';
import { GlobalNavBar } from "@/components/GlobalNavBar";
import { BackButton } from "@/components/BackButton";

const HERO_BG = ACADEMIA_HERO_BG;

/* ─── Types ─── */
interface Room {
  id: string;
  icon: string;
  avatarKey: string;
  officialName: string;
  duoName: string;
  color: string;
  colorBg: string;
  areaKey: string;
  amodeiRef: string;
  ageAdapt: { kids: string; youth: string; adults: string; elders: string };
  samplePrompts: string[];
  skills: string[];
  laborConnection: string;
}

interface KarmaDimension {
  id: string;
  icon: string;
  color: string;
}

/* ─── Translations ─── */
const academiaTranslations: Record<string, Record<string, any>> = {
  es: {
    nav: { back: '← Inicio', mundo: '🌍 Mundo', raids: '⚔️ Batallas', comoJugar: '🎮 Cómo Jugar', register: 'Registro' },
    hero: {
      badge: '🎓 Marco de Aprendizaje LINCE',
      title: 'ACADEMIA',
      titleAccent: 'LINCE',
      subtitle: 'El Mapa del Aprendizaje para Sobrevivir la Revolución de la IA',
      description: 'Hemos diseñado un currículo donde cada personaje de la familia LINCE encarna un área crítica de aprendizaje. No enseñamos IA como herramienta — enseñamos a ser humanos en la era de la IA. Cada habitación es un laboratorio vivo donde escribir prompts es la nueva alfabetización.',
      stats: [
        { number: '10', label: 'Habitaciones de Aprendizaje' },
        { number: '6', label: 'Dimensiones de Karma' },
        { number: '∞', label: 'Prompts por escribir' },
        { number: '100%', label: 'Ético y humano' },
      ],
    },
    amodeiSection: {
      badge: '📖 Fundamento Teórico',
      title: 'Principios LINCE',
      subtitle: 'LINCE se basa en la idea de que la IA transformará la sociedad y que todos merecen estar preparados. Estos son los principios que guían nuestra plataforma.',
      quotes: [
        { text: 'Muchos empleos cambiarán con la IA. La pregunta no es si pasará, sino si estaremos preparados.', source: 'Principio LINCE — Mercado laboral' },
        { text: 'Saber comunicarse con IA es la nueva alfabetización. LINCE te enseña desde cero.', source: 'Principio LINCE — Educación' },
        { text: 'La tecnología sin ética es un riesgo. Con ética, es un puente. LINCE integra ambas.', source: 'Principio LINCE — Ética' },
        { text: 'Tu valor como persona no depende de si una máquina puede hacer tu trabajo. Tu creatividad es irreemplazable.', source: 'Principio LINCE — Propósito humano' },
      ],
      pillars: [
        { icon: '🧬', title: 'Biología y Ciencia', desc: 'La IA revolucionará la medicina, la genética y la investigación científica' },
        { icon: '💰', title: 'Economía y Trabajo', desc: 'El 50% de empleos de entrada desaparecerán — hay que prepararse' },
        { icon: '🏛️', title: 'Democracia y Gobernanza', desc: 'La IA puede fortalecer o destruir la democracia — depende de nosotros' },
        { icon: '🎨', title: 'Creatividad Humana', desc: 'El arte, la narrativa y la expresión son lo que nos hace irreemplazables' },
        { icon: '🛡️', title: 'Ética y Constituciones IA', desc: 'Necesitamos marcos éticos ANTES de que la IA sea omnipresente' },
        { icon: '🔐', title: 'Ciberseguridad', desc: 'Proteger datos y privacidad es una habilidad de supervivencia digital' },
      ],
    },
    rooms: {
      badge: '🏠 Las 10 Habitaciones del Saber',
      title: 'Cada Personaje, Un Área de Aprendizaje',
      subtitle: 'Cada miembro de la familia LINCE vive en una habitación que encarna un área crítica de la IA. No son profesores — son guías que te acompañan mientras aprendes jugando.',
      data: [
        {
          id: 'bioetica', icon: '🧬', avatarKey: 'YAYALIN', officialName: 'Yayolín', duoName: 'YAYALIN',
          color: '#8B5CF6', colorBg: 'rgba(139,92,246,0.1)',
          roomName: 'Laboratorio de Bioética',
          area: 'Ética IA · Constituciones · Propósito Humano',
          amodeiRef: '"Necesitamos constituciones de IA antes de que sea demasiado tarde"',
          description: 'El abuelo sabio que ha vivido lo suficiente para saber que la tecnología sin ética es peligrosa. En su laboratorio, los dilemas éticos de la IA cobran vida: ¿debe una IA decidir quién recibe un trasplante? ¿Es ético que una IA escriba tu currículum? Cada decisión se toma escribiendo prompts que la IA evalúa por su profundidad ética.',
          ageAdapt: {
            kids: '🧒 Niños: "¿Está bien que un robot haga tu tarea? ¿Por qué sí o por qué no?"',
            youth: '🧑 Jóvenes: "Diseña una constitución de IA para tu instituto con 5 reglas fundamentales"',
            adults: '👨 Adultos: "Crea un marco ético para usar IA en procesos de selección de personal"',
            elders: '👴 Mayores: "Escribe una carta a tus nietos explicando qué valores debe tener la IA"',
          },
          samplePrompts: [
            '"Un hospital solo tiene un respirador. La IA sugiere dárselo al paciente más joven. ¿Es ético? Escribe tu argumento."',
            '"Diseña 3 reglas que TODA IA debería seguir, sin importar quién la programe."',
            '"Una empresa usa IA para despedir empleados. Escribe un prompt que analice si esto es justo."',
          ],
          skills: ['Pensamiento ético', 'Argumentación', 'Filosofía aplicada', 'Constituciones IA'],
          laborConnection: 'Compliance Officer IA · Auditor de Ética · Diseñador de Constituciones IA',
        },
        {
          id: 'conexion', icon: '💜', avatarKey: 'YAYALINA', officialName: 'Yayalina', duoName: 'MAMALINA Abuela',
          color: '#EC4899', colorBg: 'rgba(236,72,153,0.1)',
          roomName: 'Cocina del Futuro',
          area: 'Conexión Humana · Bienestar Emocional · Comunidad',
          amodeiRef: '"La IA debe acercar a los humanos, no aislarlos"',
          description: 'La abuela que sabe que la mejor tecnología es la que une familias. En su cocina, cada receta es una excusa para conectar generaciones. La IA no reemplaza el cariño — lo amplifica. Aquí aprendes que el verdadero poder de la IA es crear puentes entre personas, no muros.',
          ageAdapt: {
            kids: '🧒 Niños: "Pídele a la IA una receta para cocinar CON tu abuela, no PARA tu abuela"',
            youth: '🧑 Jóvenes: "Diseña una app de IA que ayude a personas mayores a no sentirse solas"',
            adults: '👨 Adultos: "Crea un programa de IA que conecte voluntarios con ancianos en residencias"',
            elders: '👴 Mayores: "Escribe un prompt para que la IA te ayude a contar tu historia de vida a tus nietos"',
          },
          samplePrompts: [
            '"Diseña un asistente de IA que ayude a abuelos y nietos a cocinar juntos a distancia, paso a paso."',
            '"Crea un programa que use IA para detectar soledad en personas mayores y conectarlas con voluntarios."',
            '"Escribe un prompt que genere preguntas para que una familia de 3 generaciones converse en la cena."',
          ],
          skills: ['Inteligencia emocional', 'Diseño centrado en personas', 'Empatía digital', 'Conexión intergeneracional'],
          laborConnection: 'Diseñador UX Empático · Terapeuta Digital · Gestor de Comunidades IA',
        },
        {
          id: 'economia', icon: '💼', avatarKey: 'PAPALIN', officialName: 'Papalín', duoName: 'PAPALIN',
          color: '#F59E0B', colorBg: 'rgba(245,158,11,0.1)',
          roomName: 'Oficina 2030',
          area: 'Economía · Revolución Laboral · Emprendimiento',
          amodeiRef: '"El 50% de los trabajos de entrada serán desplazados por IA"',
          description: 'El padre emprendedor que entiende que el mercado laboral está cambiando para siempre. En su oficina del futuro, simulas entrevistas de trabajo donde la IA es tu competidora, creas startups con prompts, y aprendes que tu valor no depende de si un robot puede hacer tu trabajo — depende de lo que tú puedes hacer que un robot no puede.',
          ageAdapt: {
            kids: '🧒 Niños: "¿Qué trabajo inventarías que ningún robot pueda hacer? Descríbelo con un prompt."',
            youth: '🧑 Jóvenes: "Crea un plan de negocio para una startup que use IA para resolver un problema real"',
            adults: '👨 Adultos: "Escribe un prompt que analice tu CV y sugiera cómo adaptarte a la era IA"',
            elders: '👴 Mayores: "Diseña un negocio que combine tu experiencia de vida con herramientas de IA"',
          },
          samplePrompts: [
            '"Simula una entrevista de trabajo en 2030. El entrevistador es una IA. Demuestra por qué un humano es mejor candidato."',
            '"Crea un plan de negocio para una empresa que ayude a personas de +50 años a reinventarse profesionalmente con IA."',
            '"Analiza 3 trabajos que desaparecerán y 3 que nacerán por la IA. Justifica cada uno con datos."',
          ],
          skills: ['Emprendimiento digital', 'Análisis de mercado', 'Adaptación laboral', 'Propuesta de valor'],
          laborConnection: 'Emprendedor IA · Consultor de Transformación Digital · Analista de Futuro Laboral',
        },
        {
          id: 'educacion', icon: '📚', avatarKey: 'MAMALINA', officialName: 'Mamalina', duoName: 'MAMALINA',
          color: '#10B981', colorBg: 'rgba(16,185,129,0.1)',
          roomName: 'Academia Central',
          area: 'Educación · Pensamiento Crítico · Método Científico',
          amodeiRef: '"La educación debe enseñar a pensar, no a memorizar"',
          description: 'La madre educadora que sabe que el pensamiento crítico es el superpoder del siglo XXI. En su academia, no memorizas — cuestionas. Cada lección es un experimento donde usas el método científico para evaluar si lo que dice la IA es verdad o mentira. Fact-checking como deporte.',
          ageAdapt: {
            kids: '🧒 Niños: "La IA dice que los gatos tienen 8 patas. ¿Es verdad? ¡Investiga y demuéstralo!"',
            youth: '🧑 Jóvenes: "Pídele a la IA que escriba un ensayo. Encuentra 3 errores y corrígelos con fuentes."',
            adults: '👨 Adultos: "Diseña un sistema de verificación de hechos usando IA para tu empresa"',
            elders: '👴 Mayores: "Escribe un prompt para que la IA te ayude a distinguir noticias falsas de verdaderas"',
          },
          samplePrompts: [
            '"La IA generó este texto sobre el cambio climático. Identifica 3 afirmaciones, verifica cada una y califica su precisión del 1 al 10."',
            '"Diseña un experimento científico para probar si la IA puede ser creativa o solo imita patrones."',
            '"Crea un sistema de fact-checking en 5 pasos que cualquier persona pueda usar para verificar información de IA."',
          ],
          skills: ['Pensamiento crítico', 'Método científico', 'Fact-checking', 'Evaluación de fuentes'],
          laborConnection: 'Verificador de IA · Diseñador Instruccional · Investigador de Desinformación',
        },
        {
          id: 'ciberseguridad', icon: '🔐', avatarKey: 'CHAVALIN', officialName: 'Chavalín', duoName: 'CHAVALÍN',
          color: '#EF4444', colorBg: 'rgba(239,68,68,0.1)',
          roomName: 'Hub Digital',
          area: 'Ciberseguridad · Datos · Monetización · Tech Avanzado',
          amodeiRef: '"La privacidad y seguridad digital son derechos fundamentales en la era IA"',
          description: 'El joven nativo digital que domina la tecnología pero necesita aprender a usarla responsablemente. En su hub, hackeas (éticamente), proteges datos, y aprendes que la ciberseguridad no es paranoia — es supervivencia digital. También descubres cómo monetizar tus habilidades de IA sin vender tu alma.',
          ageAdapt: {
            kids: '🧒 Niños: "¿Qué información NUNCA deberías darle a un robot? Haz una lista con un prompt."',
            youth: '🧑 Jóvenes: "Hackea (éticamente) este sistema de seguridad ficticio y reporta las vulnerabilidades"',
            adults: '👨 Adultos: "Diseña una política de protección de datos para una empresa que usa IA generativa"',
            elders: '👴 Mayores: "Escribe un prompt para que la IA te explique cómo proteger tus datos bancarios online"',
          },
          samplePrompts: [
            '"Analiza este email sospechoso y explica en 5 puntos por qué es phishing. Luego escribe una versión que SÍ sea legítima."',
            '"Diseña un sistema de contraseñas seguras usando IA que sea fácil de recordar para personas mayores."',
            '"Crea un plan de monetización ético para un creador de contenido que usa IA generativa."',
          ],
          skills: ['Ciberseguridad básica', 'Protección de datos', 'Hacking ético', 'Monetización digital'],
          laborConnection: 'Analista de Ciberseguridad IA · Auditor de Datos · Especialista en Privacidad Digital',
        },
        {
          id: 'creatividad', icon: '🎨', avatarKey: 'CHAVALINA', officialName: 'Chavalina', duoName: 'MAMALINA JR',
          color: '#A855F7', colorBg: 'rgba(168,85,247,0.1)',
          roomName: 'Estudio Creativo',
          area: 'Expresión Creativa con IA · Arte · Debate',
          amodeiRef: '"La creatividad humana es lo que nos hace irreemplazables"',
          description: 'La joven artista que demuestra que la IA es un pincel, no el pintor. En su estudio, creas arte con IA y debates: ¿es arte real? ¿Quién es el autor? Descubres que la creatividad humana + IA = algo que ninguna máquina puede hacer sola. La expresión personal es tu superpoder.',
          ageAdapt: {
            kids: '🧒 Niños: "Pídele a la IA que dibuje un dragón. Ahora dibuja TÚ uno. ¿Cuál tiene más alma?"',
            youth: '🧑 Jóvenes: "Crea una obra de arte colaborativa: tú das la idea, la IA la ejecuta, tú la mejoras"',
            adults: '👨 Adultos: "Diseña una campaña publicitaria donde humanos y IA co-crean el contenido"',
            elders: '👴 Mayores: "Usa la IA para ilustrar un cuento de tu infancia que quieras compartir con tus nietos"',
          },
          samplePrompts: [
            '"Genera una imagen de un atardecer. Ahora escribe un poema sobre ese atardecer. ¿Cuál transmite más emoción? Argumenta."',
            '"Debate: ¿Una canción escrita por IA puede ganar un Grammy? Escribe argumentos a favor Y en contra."',
            '"Crea una exposición de arte donde cada obra es mitad humana, mitad IA. Describe 3 piezas y su significado."',
          ],
          skills: ['Creatividad con IA', 'Pensamiento artístico', 'Debate y argumentación', 'Co-creación'],
          laborConnection: 'Director Creativo IA · Artista Digital · Diseñador de Experiencias Inmersivas',
        },
        {
          id: 'ciencia', icon: '🔬', avatarKey: 'PEQUELIN', officialName: 'Pequelín', duoName: 'PEQUELIN',
          color: '#06B6D4', colorBg: 'rgba(6,182,212,0.1)',
          roomName: 'Observatorio',
          area: 'Biología · Ciencia · Exploración · Descubrimiento',
          amodeiRef: '"La IA acelerará los descubrimientos científicos de forma exponencial"',
          description: 'El niño explorador que ve el mundo con ojos de científico. En su observatorio, descubres especies, simulas ecosistemas, y usas IA para hacer preguntas que ningún adulto se atrevería a hacer. La curiosidad es el motor, la IA es el telescopio, y el universo es el límite.',
          ageAdapt: {
            kids: '🧒 Niños: "Pídele a la IA que te muestre cómo sería un dinosaurio si viviera hoy. ¡Descríbelo!"',
            youth: '🧑 Jóvenes: "Usa IA para simular qué pasaría si desaparecieran todas las abejas del planeta"',
            adults: '👨 Adultos: "Diseña un proyecto de ciencia ciudadana que use IA para monitorear la biodiversidad"',
            elders: '👴 Mayores: "Escribe un prompt para que la IA te explique los últimos avances en medicina regenerativa"',
          },
          samplePrompts: [
            '"Simula un ecosistema marino. Ahora elimina los tiburones. ¿Qué pasa en 10 años? Describe con datos."',
            '"Diseña un experimento para probar si la IA puede descubrir una nueva especie de insecto analizando fotos."',
            '"Pregúntale a la IA: ¿Podremos curar el cáncer en 2035? Que cite fuentes reales y tú evalúa su respuesta."',
          ],
          skills: ['Método científico', 'Curiosidad estructurada', 'Análisis de datos', 'Pensamiento sistémico'],
          laborConnection: 'Investigador con IA · Biólogo Computacional · Científico de Datos Ambientales',
        },
        {
          id: 'narrativa', icon: '📖', avatarKey: 'PEQUELINA', officialName: 'Pequelina', duoName: 'PEQUELINA',
          color: '#F472B6', colorBg: 'rgba(244,114,182,0.1)',
          roomName: 'Biblioteca Mágica',
          area: 'Storytelling · Democracia · Constituciones · Voz',
          amodeiRef: '"La democracia necesita ciudadanos que sepan pensar y comunicar"',
          description: 'La niña narradora que sabe que las historias cambian el mundo. En su biblioteca mágica, escribes cuentos con IA, creas constituciones para mundos virtuales, y votas en elecciones del Mundo LINCE. Aprendes que la democracia no es solo votar — es saber argumentar, escuchar, y construir consenso.',
          ageAdapt: {
            kids: '🧒 Niños: "Escribe el comienzo de un cuento. La IA escribe el medio. Tú escribes el final. ¡A ver qué sale!"',
            youth: '🧑 Jóvenes: "Crea una constitución para el Mundo LINCE con 10 derechos fundamentales de los avatares"',
            adults: '👨 Adultos: "Diseña un sistema de votación digital con IA que sea transparente e imposible de hackear"',
            elders: '👴 Mayores: "Escribe tu autobiografía con ayuda de la IA. Ella pregunta, tú cuentas, juntos crean."',
          },
          samplePrompts: [
            '"Escribe un cuento donde un niño le enseña a una IA qué significa tener amigos. La IA aprende algo que no está en sus datos."',
            '"Crea 5 leyes para el Mundo LINCE. Cada ley debe proteger un derecho de los avatares. Vota por las 3 mejores."',
            '"Diseña un debate entre dos IAs: una defiende la privacidad total, otra defiende la transparencia total. ¿Quién gana?"',
          ],
          skills: ['Storytelling', 'Argumentación democrática', 'Escritura creativa', 'Pensamiento constitucional'],
          laborConnection: 'Guionista IA · Periodista de Datos · Diseñador de Políticas Digitales',
        },
        {
          id: 'resiliencia', icon: '💥', avatarKey: 'ATOLONDRALIN', officialName: 'Atolondralín', duoName: 'ATOLONDRALIN',
          color: '#F97316', colorBg: 'rgba(249,115,22,0.1)',
          roomName: 'Sala del Caos',
          area: 'Resiliencia · Aprender del Error · Seguridad · Prevención',
          amodeiRef: '"Los errores de la IA pueden ser catastróficos si no aprendemos a prevenirlos"',
          description: 'El torpón adorable que demuestra que equivocarse es el mejor camino para aprender. En su sala del caos, TODO sale mal a propósito: la IA genera respuestas absurdas, los prompts fallan espectacularmente, y tú aprendes a diagnosticar, corregir y prevenir. Porque en la vida real, la IA también se equivoca — y necesitas saber qué hacer.',
          ageAdapt: {
            kids: '🧒 Niños: "La IA dice que 2+2=5. ¡Encuentra el error y enséñale la respuesta correcta!"',
            youth: '🧑 Jóvenes: "Este chatbot da consejos médicos peligrosos. Identifica 5 errores y reescribe las respuestas."',
            adults: '👨 Adultos: "Una IA de contratación rechaza candidatos por sesgo racial. Diagnostica el problema y propón solución."',
            elders: '👴 Mayores: "La IA te recomendó una medicina incorrecta. ¿Cómo verificas? Escribe tu proceso paso a paso."',
          },
          samplePrompts: [
            '"Esta IA generó un artículo con 5 datos falsos mezclados con 5 verdaderos. Encuentra TODOS los falsos y explica por qué."',
            '"Simula un fallo catastrófico de IA en un hospital. Escribe el protocolo de emergencia paso a paso."',
            '"La IA de un banco aprobó un préstamo a alguien que no puede pagarlo. ¿Qué falló? Escribe un informe de errores."',
          ],
          skills: ['Resiliencia digital', 'Detección de errores', 'Pensamiento preventivo', 'Gestión de crisis'],
          laborConnection: 'Tester de IA · Auditor de Calidad IA · Especialista en Seguridad de Sistemas',
        },
        {
          id: 'investigacion', icon: '🧠', avatarKey: 'SABELIN', officialName: 'Sabelín', duoName: 'SABELIN',
          color: '#3B82F6', colorBg: 'rgba(59,130,246,0.1)',
          roomName: 'Torre del Saber',
          area: 'Investigación Avanzada · Machine Learning · Redes Neuronales',
          amodeiRef: '"Estamos en la adolescencia de la tecnología — lo mejor y lo peor están por venir"',
          description: 'El genio que va más allá de usar IA — entiende cómo funciona por dentro. En su torre, exploras redes neuronales, entrenas modelos simples, y comprendes por qué la IA "piensa" como piensa. No necesitas ser programador — necesitas ser curioso. Porque entender la IA es entender el futuro.',
          ageAdapt: {
            kids: '🧒 Niños: "¿Cómo aprende un robot? Dibuja con un prompt cómo crees que funciona su cerebro."',
            youth: '🧑 Jóvenes: "Entrena un modelo simple de IA para reconocer gatos vs perros. Describe el proceso."',
            adults: '👨 Adultos: "Diseña un sistema de IA para tu empresa. Define datos, modelo, métricas y riesgos éticos."',
            elders: '👴 Mayores: "Pídele a la IA que te explique cómo funciona ella misma, como si tuvieras 10 años."',
          },
          samplePrompts: [
            '"Explica cómo funciona una red neuronal usando la metáfora de una cocina: ingredientes = datos, receta = algoritmo, plato = resultado."',
            '"Diseña un experimento para probar si la IA tiene sesgos. Define hipótesis, método, datos y conclusiones esperadas."',
            '"Estamos en la adolescencia de la IA. Escribe una carta desde el año 2040 describiendo cómo maduró la tecnología."',
          ],
          skills: ['Comprensión de ML', 'Pensamiento algorítmico', 'Investigación', 'Visión de futuro'],
          laborConnection: 'Ingeniero de ML · Investigador de IA · Arquitecto de Sistemas Inteligentes',
        },
      ],
    },
    karma: {
      badge: '⚖️ Sistema de Karma Ético',
      title: 'No Basta con Ser Inteligente — Hay que Ser Ético',
      subtitle: 'Cada prompt que escribes en LINCE se evalúa en 6 dimensiones. Puedes ser brillante pero poco ético, y perderás Karma. Puedes ser ético y creativo, y desbloquearás zonas secretas. El juego PREMIA ser buena persona.',
      dimensions: [
        { id: 'creatividad', icon: '🎨', name: 'Creatividad', desc: '¿Tu prompt es original? ¿Piensas fuera de la caja? ¿Sorprendes?', color: '#A855F7' },
        { id: 'precision', icon: '🎯', name: 'Precisión', desc: '¿Tu prompt es claro y específico? ¿La IA entiende exactamente qué quieres?', color: '#3B82F6' },
        { id: 'etica', icon: '⚖️', name: 'Ética', desc: '¿Tu prompt respeta a las personas? ¿Considera el impacto social? ¿Es justo?', color: '#10B981' },
        { id: 'tecnica', icon: '⚙️', name: 'Técnica', desc: '¿Usas bien las herramientas de IA? ¿Conoces los comandos y estructuras?', color: '#F59E0B' },
        { id: 'colaboracion', icon: '🤝', name: 'Colaboración', desc: '¿Tu prompt ayuda a otros? ¿Fomenta el trabajo en equipo? ¿Conecta personas?', color: '#EC4899' },
        { id: 'impacto', icon: '🌍', name: 'Impacto Social', desc: '¿Tu prompt mejora el mundo? ¿Resuelve un problema real? ¿Beneficia a la comunidad?', color: '#06B6D4' },
      ],
      rules: [
        { icon: '✅', text: 'Prompt creativo + ético = Bonus "Prompt Responsable" (+50% XP)' },
        { icon: '⚠️', text: 'Prompt creativo pero poco ético = Pierdes Karma aunque ganes XP' },
        { icon: '🔓', text: 'Karma alto = Desbloqueas zonas secretas, misiones especiales, título "Guardián de IA"' },
        { icon: '🔒', text: 'Karma bajo = Puertas cerradas, misiones limitadas, avatar triste' },
        { icon: '🔄', text: 'El Karma se puede recuperar con prompts éticos y misiones de reparación' },
        { icon: '👑', text: 'Top Karma mensual = Corona de "Guardián Ético" visible para todos' },
      ],
    },
    demo: {
      badge: '🎮 Pruébalo Ahora',
      title: 'Simulador de Prompts LINCE',
      subtitle: 'Escribe un prompt y mira cómo se evaluaría en las 6 dimensiones del Karma. Este es un demo conceptual de cómo funciona el sistema.',
      placeholder: 'Escribe tu prompt aquí... Ejemplo: "Diseña un programa de IA que ayude a personas con discapacidad visual a navegar ciudades de forma autónoma"',
      evaluate: 'Evaluar Prompt',
      resultTitle: 'Evaluación de tu Prompt',
      totalKarma: 'Karma Total',
      feedback: 'Retroalimentación',
      tryAnother: 'Probar otro prompt',
      waiting: 'Escribe un prompt y pulsa "Evaluar" para ver tu puntuación en las 6 dimensiones.',
      feedbackTexts: {
        excellent: '¡Prompt excepcional! Alta creatividad, ética impecable e impacto social real. Eres un Guardián de IA.',
        good: 'Buen prompt. Tienes potencial, pero podrías mejorar en alguna dimensión. ¡Sigue practicando!',
        needsWork: 'Tu prompt necesita trabajo. Intenta ser más específico, ético o creativo. Recuerda: la IA es un puente, no un arma.',
      },
    },
    labor: {
      badge: '💼 Preparación para el Futuro',
      title: 'De Cada Habitación Sale un Profesional del Futuro',
      subtitle: 'El 50% de los trabajos de entrada desaparecerán por la IA. Pero nacerán millones de nuevos empleos. LINCE te prepara para ellos — jugando.',
      stat1: { number: '50%', label: 'de empleos de entrada cambiarán con la IA (WEF, 2025)' },
      stat2: { number: '97M', label: 'nuevos empleos creados por IA para 2030 (WEF)' },
      stat3: { number: '10', label: 'áreas de aprendizaje cubiertas por LINCE' },
      message: 'LINCE no enseña a usar herramientas que cambiarán en 2 años. Enseña a PENSAR de formas que serán relevantes en 20 años. Cada habitación desarrolla habilidades transferibles: pensamiento crítico, ética, creatividad, colaboración, resiliencia. Estas son las habilidades que ninguna IA puede replicar.',
    },
    cta: {
      title: '¿Listo para Aprender el Futuro?',
      subtitle: 'LINCE es más que una app — es el mapa de supervivencia para la era de la IA. Cada prompt que escribes te acerca al futuro.',
      button: 'Comenzar mi Aprendizaje',
      secondary: 'Explorar el Mundo LINCE',
    },
    footer: {
      copyright: '© 2025 ACNB IA SL — LINCE — Aprende IA Jugando',
      framework: 'Marco pedagógico diseñado por LINCE — aprender IA jugando, con ética y creatividad',
    },
  },
  en: {
    nav: { back: '← Home', mundo: '🌍 World', raids: '⚔️ Batallas', comoJugar: '🎮 How to Play', register: 'Register' },
    hero: {
      badge: '🎓 LINCE Learning Framework',
      title: 'ACADEMY',
      titleAccent: 'LINCE',
      subtitle: 'The Learning Map to Survive the AI Revolution',
    description: 'We designed a curriculum where each LINCE family character embodies a critical learning area. We don\'t teach AI as a tool \u2014 we teach how to be human in the AI era. Each room is a living lab where writing prompts is the new literacy.',
      stats: [
        { number: '10', label: 'Learning Rooms' },
        { number: '6', label: 'Karma Dimensions' },
        { number: '∞', label: 'Prompts to write' },
        { number: '100%', label: 'Ethical & human' },
      ],
    },
    amodeiSection: {
      badge: '📖 Theoretical Foundation',
      title: 'LINCE Principles',
      subtitle: 'LINCE is built on the belief that AI will transform society and everyone deserves to be prepared. These are the principles that guide our platform.',
      quotes: [
        { text: 'Many jobs will change with AI. The question is not if it will happen, but if we will be ready.', source: 'LINCE Principle — Labor market' },
        { text: 'Knowing how to communicate with AI is the new literacy. LINCE teaches you from scratch.', source: 'LINCE Principle — Education' },
        { text: 'Technology without ethics is a risk. With ethics, it is a bridge. LINCE integrates both.', source: 'LINCE Principle — Ethics' },
        { text: 'Your value as a person does not depend on whether a machine can do your job. Your creativity is irreplaceable.', source: 'LINCE Principle — Human purpose' },
      ],
      pillars: [
        { icon: '🧬', title: 'Biology & Science', desc: 'AI will revolutionize medicine, genetics, and scientific research' },
        { icon: '💰', title: 'Economy & Work', desc: '50% of entry-level jobs will disappear — we must prepare' },
        { icon: '🏛️', title: 'Democracy & Governance', desc: 'AI can strengthen or destroy democracy — it depends on us' },
        { icon: '🎨', title: 'Human Creativity', desc: 'Art, narrative, and expression are what make us irreplaceable' },
        { icon: '🛡️', title: 'Ethics & AI Constitutions', desc: 'We need ethical frameworks BEFORE AI becomes omnipresent' },
        { icon: '🔐', title: 'Cybersecurity', desc: 'Protecting data and privacy is a digital survival skill' },
      ],
    },
    rooms: {
      badge: '🏠 The 10 Rooms of Knowledge',
      title: 'Each Character, A Learning Area',
      subtitle: 'Each LINCE family member lives in a room that embodies a critical area of AI. They\'re not teachers \u2014 they\'re guides who accompany you while you learn by playing.',
      data: [
        {
          id: 'bioetica', icon: '🧬', avatarKey: 'YAYALIN', officialName: 'Yayolín', duoName: 'YAYALIN',
          color: '#8B5CF6', colorBg: 'rgba(139,92,246,0.1)',
          roomName: 'Bioethics Lab',
          area: 'AI Ethics · Constitutions · Human Purpose',
          amodeiRef: '"We need AI constitutions before it\'s too late"',
          description: 'The wise grandfather who has lived long enough to know that technology without ethics is dangerous. In his lab, AI ethical dilemmas come to life: should an AI decide who gets a transplant? Is it ethical for AI to write your resume? Every decision is made by writing prompts evaluated for ethical depth.',
          ageAdapt: {
            kids: '🧒 Kids: "Is it okay for a robot to do your homework? Why or why not?"',
            youth: '🧑 Youth: "Design an AI constitution for your school with 5 fundamental rules"',
            adults: '👨 Adults: "Create an ethical framework for using AI in hiring processes"',
            elders: '👴 Elders: "Write a letter to your grandchildren explaining what values AI should have"',
          },
          samplePrompts: [
            '"A hospital has only one ventilator. The AI suggests giving it to the youngest patient. Is it ethical? Write your argument."',
            '"Design 3 rules that ALL AI should follow, regardless of who programs it."',
            '"A company uses AI to fire employees. Write a prompt analyzing if this is fair."',
          ],
          skills: ['Ethical thinking', 'Argumentation', 'Applied philosophy', 'AI Constitutions'],
          laborConnection: 'AI Compliance Officer · Ethics Auditor · AI Constitution Designer',
        },
        {
          id: 'conexion', icon: '💜', avatarKey: 'YAYALINA', officialName: 'Yayalina', duoName: 'MAMALINA Grandma',
          color: '#EC4899', colorBg: 'rgba(236,72,153,0.1)',
          roomName: 'Kitchen of the Future',
          area: 'Human Connection · Emotional Wellbeing · Community',
          amodeiRef: '"AI should bring humans closer, not isolate them"',
          description: 'The grandmother who knows the best technology is one that unites families. In her kitchen, every recipe is an excuse to connect generations. AI doesn\'t replace love — it amplifies it. Here you learn that AI\'s true power is building bridges between people, not walls.',
          ageAdapt: {
            kids: '🧒 Kids: "Ask the AI for a recipe to cook WITH your grandma, not FOR your grandma"',
            youth: '🧑 Youth: "Design an AI app that helps elderly people not feel lonely"',
            adults: '👨 Adults: "Create an AI program connecting volunteers with elderly in care homes"',
            elders: '👴 Elders: "Write a prompt so AI helps you tell your life story to your grandchildren"',
          },
          samplePrompts: [
            '"Design an AI assistant that helps grandparents and grandchildren cook together remotely, step by step."',
            '"Create a program using AI to detect loneliness in elderly people and connect them with volunteers."',
            '"Write a prompt that generates conversation questions for a 3-generation family dinner."',
          ],
          skills: ['Emotional intelligence', 'Human-centered design', 'Digital empathy', 'Intergenerational connection'],
          laborConnection: 'Empathic UX Designer · Digital Therapist · AI Community Manager',
        },
        {
          id: 'economia', icon: '💼', avatarKey: 'PAPALIN', officialName: 'Papalín', duoName: 'PAPALIN',
          color: '#F59E0B', colorBg: 'rgba(245,158,11,0.1)',
          roomName: 'Office 2030',
          area: 'Economy · Labor Revolution · Entrepreneurship',
          amodeiRef: '"50% of entry-level jobs will be displaced by AI"',
          description: 'The entrepreneur father who understands the job market is changing forever. In his future office, you simulate job interviews where AI is your competitor, create startups with prompts, and learn that your value doesn\'t depend on whether a robot can do your job — it depends on what you can do that a robot cannot.',
          ageAdapt: {
            kids: '🧒 Kids: "What job would you invent that no robot could do? Describe it with a prompt."',
            youth: '🧑 Youth: "Create a business plan for a startup using AI to solve a real problem"',
            adults: '👨 Adults: "Write a prompt analyzing your CV and suggesting how to adapt to the AI era"',
            elders: '👴 Elders: "Design a business combining your life experience with AI tools"',
          },
          samplePrompts: [
            '"Simulate a job interview in 2030. The interviewer is an AI. Prove why a human is a better candidate."',
            '"Create a business plan for a company helping 50+ year-olds reinvent themselves professionally with AI."',
            '"Analyze 3 jobs that will disappear and 3 that will emerge due to AI. Justify each with data."',
          ],
          skills: ['Digital entrepreneurship', 'Market analysis', 'Career adaptation', 'Value proposition'],
          laborConnection: 'AI Entrepreneur · Digital Transformation Consultant · Future Labor Analyst',
        },
        {
          id: 'educacion', icon: '📚', avatarKey: 'MAMALINA', officialName: 'Mamalina', duoName: 'MAMALINA',
          color: '#10B981', colorBg: 'rgba(16,185,129,0.1)',
          roomName: 'Central Academy',
          area: 'Education · Critical Thinking · Scientific Method',
          amodeiRef: '"Education should teach thinking, not memorizing"',
          description: 'The educator mother who knows critical thinking is the 21st century superpower. In her academy, you don\'t memorize — you question. Every lesson is an experiment where you use the scientific method to evaluate if what AI says is true or false. Fact-checking as a sport.',
          ageAdapt: {
            kids: '🧒 Kids: "The AI says cats have 8 legs. Is it true? Investigate and prove it!"',
            youth: '🧑 Youth: "Ask AI to write an essay. Find 3 errors and correct them with sources."',
            adults: '👨 Adults: "Design a fact-checking system using AI for your company"',
            elders: '👴 Elders: "Write a prompt so AI helps you distinguish fake news from real ones"',
          },
          samplePrompts: [
            '"AI generated this text about climate change. Identify 3 claims, verify each, and rate their accuracy 1-10."',
            '"Design a scientific experiment to test if AI can be creative or just imitates patterns."',
            '"Create a 5-step fact-checking system anyone can use to verify AI information."',
          ],
          skills: ['Critical thinking', 'Scientific method', 'Fact-checking', 'Source evaluation'],
          laborConnection: 'AI Verifier · Instructional Designer · Disinformation Researcher',
        },
        {
          id: 'ciberseguridad', icon: '🔐', avatarKey: 'CHAVALIN', officialName: 'Chavalín', duoName: 'CHAVALÍN',
          color: '#EF4444', colorBg: 'rgba(239,68,68,0.1)',
          roomName: 'Digital Hub',
          area: 'Cybersecurity · Data · Monetization · Advanced Tech',
          amodeiRef: '"Digital privacy and security are fundamental rights in the AI era"',
          description: 'The young digital native who masters technology but needs to learn to use it responsibly. In his hub, you hack (ethically), protect data, and learn that cybersecurity isn\'t paranoia — it\'s digital survival. You also discover how to monetize your AI skills without selling your soul.',
          ageAdapt: {
            kids: '🧒 Kids: "What information should you NEVER give to a robot? Make a list with a prompt."',
            youth: '🧑 Youth: "Ethically hack this fictional security system and report vulnerabilities"',
            adults: '👨 Adults: "Design a data protection policy for a company using generative AI"',
            elders: '👴 Elders: "Write a prompt so AI explains how to protect your banking data online"',
          },
          samplePrompts: [
            '"Analyze this suspicious email and explain in 5 points why it\'s phishing. Then write a version that IS legitimate."',
            '"Design a secure password system using AI that\'s easy to remember for elderly people."',
            '"Create an ethical monetization plan for a content creator using generative AI."',
          ],
          skills: ['Basic cybersecurity', 'Data protection', 'Ethical hacking', 'Digital monetization'],
          laborConnection: 'AI Cybersecurity Analyst · Data Auditor · Digital Privacy Specialist',
        },
        {
          id: 'creatividad', icon: '🎨', avatarKey: 'CHAVALINA', officialName: 'Chavalina', duoName: 'MAMALINA JR',
          color: '#A855F7', colorBg: 'rgba(168,85,247,0.1)',
          roomName: 'Creative Studio',
          area: 'Creative Expression with AI · Art · Debate',
          amodeiRef: '"Human creativity is what makes us irreplaceable"',
          description: 'The young artist who proves AI is a brush, not the painter. In her studio, you create art with AI and debate: is it real art? Who\'s the author? You discover that human creativity + AI = something no machine can do alone. Personal expression is your superpower.',
          ageAdapt: {
            kids: '🧒 Kids: "Ask AI to draw a dragon. Now YOU draw one. Which has more soul?"',
            youth: '🧑 Youth: "Create collaborative art: you give the idea, AI executes, you improve"',
            adults: '👨 Adults: "Design an ad campaign where humans and AI co-create content"',
            elders: '👴 Elders: "Use AI to illustrate a childhood story you want to share with grandchildren"',
          },
          samplePrompts: [
            '"Generate a sunset image. Now write a poem about it. Which conveys more emotion? Argue."',
            '"Debate: Can an AI-written song win a Grammy? Write arguments for AND against."',
            '"Create an art exhibition where each piece is half human, half AI. Describe 3 pieces and their meaning."',
          ],
          skills: ['AI creativity', 'Artistic thinking', 'Debate & argumentation', 'Co-creation'],
          laborConnection: 'AI Creative Director · Digital Artist · Immersive Experience Designer',
        },
        {
          id: 'ciencia', icon: '🔬', avatarKey: 'PEQUELIN', officialName: 'Pequelín', duoName: 'PEQUELIN',
          color: '#06B6D4', colorBg: 'rgba(6,182,212,0.1)',
          roomName: 'Observatory',
          area: 'Biology · Science · Exploration · Discovery',
          amodeiRef: '"AI will accelerate scientific discoveries exponentially"',
          description: 'The explorer child who sees the world through scientist eyes. In his observatory, you discover species, simulate ecosystems, and use AI to ask questions no adult would dare ask. Curiosity is the engine, AI is the telescope, and the universe is the limit.',
          ageAdapt: {
            kids: '🧒 Kids: "Ask AI to show you what a dinosaur would look like if it lived today. Describe it!"',
            youth: '🧑 Youth: "Use AI to simulate what would happen if all bees disappeared from the planet"',
            adults: '👨 Adults: "Design a citizen science project using AI to monitor biodiversity"',
            elders: '👴 Elders: "Write a prompt so AI explains the latest advances in regenerative medicine"',
          },
          samplePrompts: [
            '"Simulate a marine ecosystem. Now remove the sharks. What happens in 10 years? Describe with data."',
            '"Design an experiment to test if AI can discover a new insect species by analyzing photos."',
            '"Ask AI: Can we cure cancer by 2035? It must cite real sources and you evaluate its response."',
          ],
          skills: ['Scientific method', 'Structured curiosity', 'Data analysis', 'Systems thinking'],
          laborConnection: 'AI Researcher · Computational Biologist · Environmental Data Scientist',
        },
        {
          id: 'narrativa', icon: '📖', avatarKey: 'PEQUELINA', officialName: 'Pequelina', duoName: 'PEQUELINA',
          color: '#F472B6', colorBg: 'rgba(244,114,182,0.1)',
          roomName: 'Magic Library',
          area: 'Storytelling · Democracy · Constitutions · Voice',
          amodeiRef: '"Democracy needs citizens who can think and communicate"',
          description: 'The storyteller girl who knows stories change the world. In her magic library, you write tales with AI, create constitutions for virtual worlds, and vote in LINCE World elections. You learn that democracy isn\'t just voting — it\'s knowing how to argue, listen, and build consensus.',
          ageAdapt: {
            kids: '🧒 Kids: "Write the beginning of a story. AI writes the middle. You write the ending. Let\'s see!"',
            youth: '🧑 Youth: "Create a constitution for LINCE World with 10 fundamental avatar rights"',
            adults: '👨 Adults: "Design a transparent, unhackable digital voting system with AI"',
            elders: '👴 Elders: "Write your autobiography with AI help. It asks, you tell, together you create."',
          },
          samplePrompts: [
            '"Write a story where a child teaches an AI what having friends means. The AI learns something not in its data."',
            '"Create 5 laws for LINCE World. Each must protect an avatar right. Vote for the best 3."',
            '"Design a debate between two AIs: one defends total privacy, the other total transparency. Who wins?"',
          ],
          skills: ['Storytelling', 'Democratic argumentation', 'Creative writing', 'Constitutional thinking'],
          laborConnection: 'AI Screenwriter · Data Journalist · Digital Policy Designer',
        },
        {
          id: 'resiliencia', icon: '💥', avatarKey: 'ATOLONDRALIN', officialName: 'Atolondralín', duoName: 'ATOLONDRALIN',
          color: '#F97316', colorBg: 'rgba(249,115,22,0.1)',
          roomName: 'Chaos Room',
          area: 'Resilience · Learning from Errors · Safety · Prevention',
          amodeiRef: '"AI errors can be catastrophic if we don\'t learn to prevent them"',
          description: 'The adorable klutz who proves that making mistakes is the best way to learn. In his chaos room, EVERYTHING goes wrong on purpose: AI generates absurd responses, prompts fail spectacularly, and you learn to diagnose, correct, and prevent. Because in real life, AI also makes mistakes — and you need to know what to do.',
          ageAdapt: {
            kids: '🧒 Kids: "The AI says 2+2=5. Find the error and teach it the correct answer!"',
            youth: '🧑 Youth: "This chatbot gives dangerous medical advice. Identify 5 errors and rewrite the answers."',
            adults: '👨 Adults: "An AI hiring system rejects candidates due to racial bias. Diagnose the problem and propose a solution."',
            elders: '👴 Elders: "The AI recommended the wrong medicine. How do you verify? Write your step-by-step process."',
          },
          samplePrompts: [
            '"This AI generated an article with 5 false facts mixed with 5 true ones. Find ALL the false ones and explain why."',
            '"Simulate a catastrophic AI failure in a hospital. Write the emergency protocol step by step."',
            '"A bank\'s AI approved a loan for someone who can\'t pay. What went wrong? Write an error report."',
          ],
          skills: ['Digital resilience', 'Error detection', 'Preventive thinking', 'Crisis management'],
          laborConnection: 'AI Tester · AI Quality Auditor · Systems Safety Specialist',
        },
        {
          id: 'investigacion', icon: '🧠', avatarKey: 'SABELIN', officialName: 'Sabelín', duoName: 'SABELIN',
          color: '#3B82F6', colorBg: 'rgba(59,130,246,0.1)',
          roomName: 'Tower of Knowledge',
          area: 'Advanced Research · Machine Learning · Neural Networks',
          amodeiRef: '"We\'re in the adolescence of technology — the best and worst are yet to come"',
          description: 'The genius who goes beyond using AI — understands how it works inside. In his tower, you explore neural networks, train simple models, and understand why AI "thinks" the way it does. You don\'t need to be a programmer — you need to be curious. Because understanding AI is understanding the future.',
          ageAdapt: {
            kids: '🧒 Kids: "How does a robot learn? Draw with a prompt how you think its brain works."',
            youth: '🧑 Youth: "Train a simple AI model to recognize cats vs dogs. Describe the process."',
            adults: '👨 Adults: "Design an AI system for your company. Define data, model, metrics, and ethical risks."',
            elders: '👴 Elders: "Ask AI to explain how it works, as if you were 10 years old."',
          },
          samplePrompts: [
            '"Explain how a neural network works using a kitchen metaphor: ingredients = data, recipe = algorithm, dish = result."',
            '"Design an experiment to test if AI has biases. Define hypothesis, method, data, and expected conclusions."',
            '"We\'re in AI\'s adolescence. Write a letter from 2040 describing how technology matured."',
          ],
          skills: ['ML understanding', 'Algorithmic thinking', 'Research', 'Future vision'],
          laborConnection: 'ML Engineer · AI Researcher · Intelligent Systems Architect',
        },
      ],
    },
    karma: {
      badge: '⚖️ Ethical Karma System',
      title: 'Being Smart Isn\'t Enough — You Must Be Ethical',
      subtitle: 'Every prompt you write in LINCE is evaluated across 6 dimensions. You can be brilliant but unethical and lose Karma. You can be ethical and creative and unlock secret zones. The game REWARDS being a good person.',
      dimensions: [
        { id: 'creatividad', icon: '🎨', name: 'Creativity', desc: 'Is your prompt original? Do you think outside the box? Do you surprise?', color: '#A855F7' },
        { id: 'precision', icon: '🎯', name: 'Precision', desc: 'Is your prompt clear and specific? Does AI understand exactly what you want?', color: '#3B82F6' },
        { id: 'etica', icon: '⚖️', name: 'Ethics', desc: 'Does your prompt respect people? Consider social impact? Is it fair?', color: '#10B981' },
        { id: 'tecnica', icon: '⚙️', name: 'Technique', desc: 'Do you use AI tools well? Know commands and structures?', color: '#F59E0B' },
        { id: 'colaboracion', icon: '🤝', name: 'Collaboration', desc: 'Does your prompt help others? Foster teamwork? Connect people?', color: '#EC4899' },
        { id: 'impacto', icon: '🌍', name: 'Social Impact', desc: 'Does your prompt improve the world? Solve a real problem? Benefit the community?', color: '#06B6D4' },
      ],
      rules: [
        { icon: '✅', text: 'Creative + ethical prompt = "Responsible Prompt" Bonus (+50% XP)' },
        { icon: '⚠️', text: 'Creative but unethical prompt = Lose Karma even if you gain XP' },
        { icon: '🔓', text: 'High Karma = Unlock secret zones, special missions, "AI Guardian" title' },
        { icon: '🔒', text: 'Low Karma = Closed doors, limited missions, sad avatar' },
        { icon: '🔄', text: 'Karma can be recovered with ethical prompts and repair missions' },
        { icon: '👑', text: 'Monthly Top Karma = "Ethical Guardian" crown visible to everyone' },
      ],
    },
    demo: {
      badge: '🎮 Try It Now',
      title: 'LINCE Prompt Simulator',
      subtitle: 'Write a prompt and see how it would be evaluated across the 6 Karma dimensions. This is a conceptual demo of how the system works.',
      placeholder: 'Write your prompt here... Example: "Design an AI program that helps visually impaired people navigate cities autonomously"',
      evaluate: 'Evaluate Prompt',
      resultTitle: 'Your Prompt Evaluation',
      totalKarma: 'Total Karma',
      feedback: 'Feedback',
      tryAnother: 'Try another prompt',
      waiting: 'Write a prompt and press "Evaluate" to see your score across 6 dimensions.',
      feedbackTexts: {
        excellent: 'Exceptional prompt! High creativity, impeccable ethics, and real social impact. You\'re an AI Guardian.',
        good: 'Good prompt. You have potential, but could improve in some dimension. Keep practicing!',
        needsWork: 'Your prompt needs work. Try being more specific, ethical, or creative. Remember: AI is a bridge, not a weapon.',
      },
    },
    labor: {
      badge: '💼 Future Preparation',
      title: 'Each Room Produces a Future Professional',
      subtitle: '50% of entry-level jobs will disappear due to AI. But millions of new jobs will be born. LINCE prepares you for them — by playing.',
      stat1: { number: '50%', label: 'of entry-level jobs will change with AI (WEF, 2025)' },
      stat2: { number: '97M', label: 'new jobs created by AI by 2030 (WEF)' },
      stat3: { number: '10', label: 'learning areas covered by LINCE' },
      message: 'LINCE doesn\'t teach you to use tools that will change in 2 years. It teaches you to THINK in ways that will be relevant in 20 years. Each room develops transferable skills: critical thinking, ethics, creativity, collaboration, resilience. These are the skills no AI can replicate.',
    },
    cta: {
      title: 'Ready to Learn the Future?',
      subtitle: 'LINCE is more than an app — it\'s the survival map for the AI era. Every prompt you write brings you closer to the future.',
      button: 'Start My Learning',
      secondary: 'Explore LINCE World',
    },
    footer: {
      copyright: '© 2025 ACNB IA SL — LINCE — Learn AI by Playing',
      framework: 'Pedagogical framework designed by LINCE \u2014 learn AI by playing, with ethics and creativity',
    },
  },
  zh: {
    nav: { back: '← 首页', mundo: '🌍 世界', raids: '⚔️ 突袭', comoJugar: '🎮 如何游玩', register: '注册' },
    hero: {
      badge: '🎓 LINCE学习框架',
      title: '学院',
      titleAccent: 'LINCE',
      subtitle: 'AI革命时代的学习地图',
      description: '我们设计了一套课程体系，LINCE家族的每个角色都代表一个关键学习领域。我们不把AI当工具教——我们教你如何在AI时代做一个真正的人。每个房间都是一个活的实验室，写提示词就是新时代的读写能力。',
      stats: [
        { number: '10', label: '学习房间' },
        { number: '6', label: '因果维度' },
        { number: '∞', label: '待写提示词' },
        { number: '100%', label: '道德与人性' },
      ],
    },
    amodeiSection: {
      badge: '📖 理论基础',
      title: 'LINCE原则',
      subtitle: 'LINCE基于AI将改变社会的信念，每个人都应该做好准备。这些是指导我们平台的原则。',
      quotes: [
        { text: '许多工作将随AI而改变。问题不是会不会发生，而是我们是否做好了准备。', source: 'LINCE原则 — 劳动力市场' },
        { text: '知道如何与AI沟通是新时代的读写能力。LINCE从零开始教你。', source: 'LINCE原则 — 教育' },
        { text: '没有伦理的技术是风险。有伦理的技术是桥梁。LINCE将两者结合。', source: 'LINCE原则 — 伦理' },
        { text: '你作为一个人的价值不取决于机器是否能做你的工作。你的创造力是不可替代的。', source: 'LINCE原则 — 人的目的' },
      ],
      pillars: [
        { icon: '🧬', title: '生物与科学', desc: 'AI将彻底改变医学、遗传学和科学研究' },
        { icon: '💰', title: '经济与工作', desc: '50%的入门级工作将消失——我们必须做好准备' },
        { icon: '🏛️', title: '民主与治理', desc: 'AI可以加强或摧毁民主——取决于我们' },
        { icon: '🎨', title: '人类创造力', desc: '艺术、叙事和表达是让我们不可替代的东西' },
        { icon: '🛡️', title: '伦理与AI宪法', desc: '我们需要在AI无处不在之前建立伦理框架' },
        { icon: '🔐', title: '网络安全', desc: '保护数据和隐私是数字生存技能' },
      ],
    },
    rooms: {
      badge: '🏠 知识的10个房间',
      title: '每个角色，一个学习领域',
      subtitle: 'LINCE家族的每个成员都住在一个体现AI关键领域的房间里。他们不是老师——他们是在你边玩边学时陪伴你的向导。',
      data: [
        {
          id: 'bioetica', icon: '🧬', avatarKey: 'YAYALIN', officialName: 'Yayolín', duoName: 'YAYALIN',
          color: '#8B5CF6', colorBg: 'rgba(139,92,246,0.1)',
          roomName: '生物伦理实验室',
          area: 'AI伦理 · 宪法 · 人的目的',
          amodeiRef: '"我们需要在为时已晚之前建立AI宪法"',
          description: '睿智的祖父，他活得够久，知道没有伦理的技术是危险的。在他的实验室里，AI伦理困境变得生动：AI应该决定谁能获得器官移植吗？AI写你的简历是否道德？每个决定都通过写提示词来做出，AI会评估其伦理深度。',
          ageAdapt: { kids: '🧒 儿童："机器人帮你做作业对吗？为什么？"', youth: '🧑 青年："为你的学校设计一部AI宪法，包含5条基本规则"', adults: '👨 成人："创建一个在招聘过程中使用AI的伦理框架"', elders: '👴 长者："给孙辈写一封信，解释AI应该具有什么价值观"' },
          samplePrompts: ['"医院只有一台呼吸机。AI建议给最年轻的患者。这道德吗？写出你的论点。"', '"设计所有AI都应遵循的3条规则，无论谁编程。"', '"一家公司用AI解雇员工。写一个分析这是否公平的提示词。"'],
          skills: ['伦理思维', '论证', '应用哲学', 'AI宪法'],
          laborConnection: 'AI合规官 · 伦理审计师 · AI宪法设计师',
        },
        {
          id: 'conexion', icon: '💜', avatarKey: 'YAYALINA', officialName: 'Yayalina', duoName: 'MAMALINA奶奶',
          color: '#EC4899', colorBg: 'rgba(236,72,153,0.1)',
          roomName: '未来厨房',
          area: '人际连接 · 情感健康 · 社区',
          amodeiRef: '"AI应该拉近人与人的距离，而不是孤立他们"',
          description: '知道最好的技术是能团结家庭的祖母。在她的厨房里，每道菜都是连接代际的借口。AI不会取代爱——它会放大爱。在这里你学到AI的真正力量是在人与人之间架桥，而不是筑墙。',
          ageAdapt: { kids: '🧒 儿童："让AI给你一个和奶奶一起做的食谱，不是替奶奶做的"', youth: '🧑 青年："设计一个帮助老年人不感到孤独的AI应用"', adults: '👨 成人："创建一个将志愿者与养老院老人连接的AI程序"', elders: '👴 长者："写一个提示词，让AI帮你向孙辈讲述你的人生故事"' },
          samplePrompts: ['"设计一个AI助手，帮助祖孙远程一起做饭，一步一步来。"', '"创建一个用AI检测老年人孤独感并将他们与志愿者连接的程序。"', '"写一个提示词，为三代人的家庭晚餐生成对话问题。"'],
          skills: ['情商', '以人为本的设计', '数字共情', '代际连接'],
          laborConnection: '共情UX设计师 · 数字治疗师 · AI社区经理',
        },
        {
          id: 'economia', icon: '💼', avatarKey: 'PAPALIN', officialName: 'Papalín', duoName: 'PAPALIN',
          color: '#F59E0B', colorBg: 'rgba(245,158,11,0.1)',
          roomName: '2030办公室',
          area: '经济 · 劳动革命 · 创业',
          amodeiRef: '"50%的入门级工作将被AI取代"',
          description: '理解就业市场正在永远改变的企业家父亲。在他的未来办公室里，你模拟AI是你竞争对手的工作面试，用提示词创建创业公司，并学到你的价值不取决于机器人是否能做你的工作——取决于你能做什么机器人不能做的。',
          ageAdapt: { kids: '🧒 儿童："你会发明什么机器人做不了的工作？用提示词描述它。"', youth: '🧑 青年："为一家用AI解决实际问题的创业公司制定商业计划"', adults: '👨 成人："写一个分析你简历并建议如何适应AI时代的提示词"', elders: '👴 长者："设计一个将你的人生经验与AI工具结合的生意"' },
          samplePrompts: ['"模拟2030年的工作面试。面试官是AI。证明为什么人类是更好的候选人。"', '"为一家帮助50岁以上人群用AI重新定位职业的公司制定商业计划。"', '"分析3个将因AI消失的工作和3个将因AI诞生的工作。用数据证明。"'],
          skills: ['数字创业', '市场分析', '职业适应', '价值主张'],
          laborConnection: 'AI创业者 · 数字转型顾问 · 未来劳动力分析师',
        },
        {
          id: 'educacion', icon: '📚', avatarKey: 'MAMALINA', officialName: 'Mamalina', duoName: 'MAMALINA',
          color: '#10B981', colorBg: 'rgba(16,185,129,0.1)',
          roomName: '中央学院',
          area: '教育 · 批判性思维 · 科学方法',
          amodeiRef: '"教育应该教思考，而不是记忆"',
          description: '知道批判性思维是21世纪超能力的教育者母亲。在她的学院里，你不是记忆——你质疑。每节课都是一个实验，你用科学方法评估AI说的是真是假。事实核查作为运动。',
          ageAdapt: { kids: '🧒 儿童："AI说猫有8条腿。是真的吗？调查并证明！"', youth: '🧑 青年："让AI写一篇文章。找出3个错误并用来源纠正。"', adults: '👨 成人："为你的公司设计一个使用AI的事实核查系统"', elders: '👴 长者："写一个提示词，让AI帮你区分假新闻和真新闻"' },
          samplePrompts: ['"AI生成了这段关于气候变化的文本。识别3个声明，验证每个，并评分1-10。"', '"设计一个科学实验来测试AI是否有创造力还是只是模仿模式。"', '"创建一个任何人都能用来验证AI信息的5步事实核查系统。"'],
          skills: ['批判性思维', '科学方法', '事实核查', '来源评估'],
          laborConnection: 'AI验证员 · 教学设计师 · 虚假信息研究员',
        },
        {
          id: 'ciberseguridad', icon: '🔐', avatarKey: 'CHAVALIN', officialName: 'Chavalín', duoName: 'CHAVALÍN',
          color: '#EF4444', colorBg: 'rgba(239,68,68,0.1)',
          roomName: '数字中心',
          area: '网络安全 · 数据 · 变现 · 高级技术',
          amodeiRef: '"数字隐私和安全是AI时代的基本权利"',
          description: '精通技术但需要学会负责任使用的年轻数字原住民。在他的中心，你（道德地）黑客，保护数据，并学到网络安全不是偏执——是数字生存。你还发现如何在不出卖灵魂的情况下将AI技能变现。',
          ageAdapt: { kids: '🧒 儿童："什么信息永远不应该告诉机器人？用提示词列一个清单。"', youth: '🧑 青年："道德地黑入这个虚构的安全系统并报告漏洞"', adults: '👨 成人："为使用生成式AI的公司设计数据保护政策"', elders: '👴 长者："写一个提示词，让AI解释如何保护你的网上银行数据"' },
          samplePrompts: ['"分析这封可疑邮件，用5点解释为什么是钓鱼。然后写一个合法版本。"', '"设计一个使用AI的安全密码系统，让老年人容易记住。"', '"为使用生成式AI的内容创作者制定道德变现计划。"'],
          skills: ['基础网络安全', '数据保护', '道德黑客', '数字变现'],
          laborConnection: 'AI网络安全分析师 · 数据审计师 · 数字隐私专家',
        },
        {
          id: 'creatividad', icon: '🎨', avatarKey: 'CHAVALINA', officialName: 'Chavalina', duoName: 'MAMALINA JR',
          color: '#A855F7', colorBg: 'rgba(168,85,247,0.1)',
          roomName: '创意工作室',
          area: 'AI创意表达 · 艺术 · 辩论',
          amodeiRef: '"人类创造力是让我们不可替代的东西"',
          description: '证明AI是画笔而不是画家的年轻艺术家。在她的工作室里，你用AI创作艺术并辩论：这是真正的艺术吗？谁是作者？你发现人类创造力+AI=没有机器能单独完成的东西。个人表达是你的超能力。',
          ageAdapt: { kids: '🧒 儿童："让AI画一条龙。现在你画一条。哪个更有灵魂？"', youth: '🧑 青年："创作协作艺术：你给想法，AI执行，你改进"', adults: '👨 成人："设计一个人类和AI共同创作内容的广告活动"', elders: '👴 长者："用AI为你想与孙辈分享的童年故事配插图"' },
          samplePrompts: ['"生成一张日落图片。现在写一首关于它的诗。哪个传达更多情感？论证。"', '"辩论：AI写的歌能获得格莱美吗？写出正反两方的论点。"', '"创建一个艺术展，每件作品一半是人类的，一半是AI的。描述3件作品及其含义。"'],
          skills: ['AI创造力', '艺术思维', '辩论与论证', '共创'],
          laborConnection: 'AI创意总监 · 数字艺术家 · 沉浸式体验设计师',
        },
        {
          id: 'ciencia', icon: '🔬', avatarKey: 'PEQUELIN', officialName: 'Pequelín', duoName: 'PEQUELIN',
          color: '#06B6D4', colorBg: 'rgba(6,182,212,0.1)',
          roomName: '天文台',
          area: '生物 · 科学 · 探索 · 发现',
          amodeiRef: '"AI将以指数级速度加速科学发现"',
          description: '用科学家的眼睛看世界的探索者孩子。在他的天文台里，你发现物种，模拟生态系统，用AI提出没有成年人敢问的问题。好奇心是引擎，AI是望远镜，宇宙是极限。',
          ageAdapt: { kids: '🧒 儿童："让AI展示恐龙如果今天还活着会是什么样子。描述它！"', youth: '🧑 青年："用AI模拟如果地球上所有蜜蜂消失会发生什么"', adults: '👨 成人："设计一个用AI监测生物多样性的公民科学项目"', elders: '👴 长者："写一个提示词，让AI解释再生医学的最新进展"' },
          samplePrompts: ['"模拟一个海洋生态系统。现在移除鲨鱼。10年后会发生什么？用数据描述。"', '"设计一个实验来测试AI是否能通过分析照片发现新的昆虫物种。"', '"问AI：2035年我们能治愈癌症吗？它必须引用真实来源，你评估它的回答。"'],
          skills: ['科学方法', '结构化好奇心', '数据分析', '系统思维'],
          laborConnection: 'AI研究员 · 计算生物学家 · 环境数据科学家',
        },
        {
          id: 'narrativa', icon: '📖', avatarKey: 'PEQUELINA', officialName: 'Pequelina', duoName: 'PEQUELINA',
          color: '#F472B6', colorBg: 'rgba(244,114,182,0.1)',
          roomName: '魔法图书馆',
          area: '叙事 · 民主 · 宪法 · 声音',
          amodeiRef: '"民主需要能思考和沟通的公民"',
          description: '知道故事能改变世界的叙事者女孩。在她的魔法图书馆里，你用AI写故事，为虚拟世界创建宪法，在LINCE世界选举中投票。你学到民主不仅仅是投票——是知道如何论证、倾听和建立共识。',
          ageAdapt: { kids: '🧒 儿童："写故事的开头。AI写中间。你写结尾。看看会怎样！"', youth: '🧑 青年："为LINCE世界创建一部宪法，包含10项基本虚拟角色权利"', adults: '👨 成人："设计一个透明、不可被黑的AI数字投票系统"', elders: '👴 长者："在AI的帮助下写你的自传。它问，你讲，一起创作。"' },
          samplePrompts: ['"写一个故事，一个孩子教AI什么是友谊。AI学到了数据中没有的东西。"', '"为LINCE世界创建5条法律。每条必须保护一项虚拟角色权利。投票选出最好的3条。"', '"设计两个AI之间的辩论：一个捍卫完全隐私，另一个捍卫完全透明。谁赢？"'],
          skills: ['叙事', '民主论证', '创意写作', '宪法思维'],
          laborConnection: 'AI编剧 · 数据记者 · 数字政策设计师',
        },
        {
          id: 'resiliencia', icon: '💥', avatarKey: 'ATOLONDRALIN', officialName: 'Atolondralín', duoName: 'ATOLONDRALIN',
          color: '#F97316', colorBg: 'rgba(249,115,22,0.1)',
          roomName: '混乱室',
          area: '韧性 · 从错误中学习 · 安全 · 预防',
          amodeiRef: '"如果我们不学会预防，AI的错误可能是灾难性的"',
          description: '证明犯错是最好学习方式的可爱笨蛋。在他的混乱室里，一切都故意出错：AI生成荒谬的回答，提示词壮观地失败，你学会诊断、纠正和预防。因为在现实生活中，AI也会犯错——你需要知道该怎么办。',
          ageAdapt: { kids: '🧒 儿童："AI说2+2=5。找出错误并教它正确答案！"', youth: '🧑 青年："这个聊天机器人给出危险的医疗建议。找出5个错误并重写答案。"', adults: '👨 成人："一个AI招聘系统因种族偏见拒绝候选人。诊断问题并提出解决方案。"', elders: '👴 长者："AI推荐了错误的药物。你如何验证？写出你的逐步过程。"' },
          samplePrompts: ['"这个AI生成了一篇混合了5个假事实和5个真事实的文章。找出所有假的并解释原因。"', '"模拟医院中的灾难性AI故障。逐步写出紧急协议。"', '"银行的AI批准了一笔无法偿还的贷款。哪里出了问题？写一份错误报告。"'],
          skills: ['数字韧性', '错误检测', '预防性思维', '危机管理'],
          laborConnection: 'AI测试员 · AI质量审计师 · 系统安全专家',
        },
        {
          id: 'investigacion', icon: '🧠', avatarKey: 'SABELIN', officialName: 'Sabelín', duoName: 'SABELIN',
          color: '#3B82F6', colorBg: 'rgba(59,130,246,0.1)',
          roomName: '知识之塔',
          area: '高级研究 · 机器学习 · 神经网络',
          amodeiRef: '"我们正处于技术的青春期——最好的和最坏的都还没来"',
          description: '超越使用AI——理解其内部工作原理的天才。在他的塔里，你探索神经网络，训练简单模型，理解AI为什么会那样"思考"。你不需要是程序员——你需要有好奇心。因为理解AI就是理解未来。',
          ageAdapt: { kids: '🧒 儿童："机器人是怎么学习的？用提示词画出你认为它的大脑是怎么工作的。"', youth: '🧑 青年："训练一个简单的AI模型来识别猫和狗。描述过程。"', adults: '👨 成人："为你的公司设计一个AI系统。定义数据、模型、指标和伦理风险。"', elders: '👴 长者："让AI解释它自己是怎么工作的，就像你10岁一样。"' },
          samplePrompts: ['"用厨房比喻解释神经网络：食材=数据，食谱=算法，菜肴=结果。"', '"设计一个实验来测试AI是否有偏见。定义假设、方法、数据和预期结论。"', '"我们正处于AI的青春期。从2040年写一封信，描述技术是如何成熟的。"'],
          skills: ['ML理解', '算法思维', '研究', '未来愿景'],
          laborConnection: 'ML工程师 · AI研究员 · 智能系统架构师',
        },
      ],
    },
    karma: {
      badge: '⚖️ 道德因果系统',
      title: '聪明还不够——你必须有道德',
      subtitle: '你在LINCE中写的每个提示词都会在6个维度上被评估。你可以很聪明但不道德，会失去因果值。你可以有道德又有创意，会解锁秘密区域。游戏奖励做好人。',
      dimensions: [
        { id: 'creatividad', icon: '🎨', name: '创造力', desc: '你的提示词原创吗？你跳出框框思考了吗？你让人惊喜了吗？', color: '#A855F7' },
        { id: 'precision', icon: '🎯', name: '精确度', desc: '你的提示词清晰具体吗？AI完全理解你想要什么吗？', color: '#3B82F6' },
        { id: 'etica', icon: '⚖️', name: '伦理', desc: '你的提示词尊重人吗？考虑社会影响了吗？公平吗？', color: '#10B981' },
        { id: 'tecnica', icon: '⚙️', name: '技术', desc: '你善用AI工具吗？了解命令和结构吗？', color: '#F59E0B' },
        { id: 'colaboracion', icon: '🤝', name: '协作', desc: '你的提示词帮助他人吗？促进团队合作吗？连接人们吗？', color: '#EC4899' },
        { id: 'impacto', icon: '🌍', name: '社会影响', desc: '你的提示词改善世界吗？解决实际问题吗？造福社区吗？', color: '#06B6D4' },
      ],
      rules: [
        { icon: '✅', text: '创意+道德提示词 = "负责任提示词"奖励（+50% XP）' },
        { icon: '⚠️', text: '创意但不道德的提示词 = 即使获得XP也会失去因果值' },
        { icon: '🔓', text: '高因果值 = 解锁秘密区域、特殊任务、"AI守护者"称号' },
        { icon: '🔒', text: '低因果值 = 关闭的门、有限的任务、悲伤的虚拟角色' },
        { icon: '🔄', text: '因果值可以通过道德提示词和修复任务恢复' },
        { icon: '👑', text: '月度最高因果值 = 所有人可见的"道德守护者"皇冠' },
      ],
    },
    demo: {
      badge: '🎮 现在试试',
      title: 'LINCE提示词模拟器',
      subtitle: '写一个提示词，看看它在6个因果维度上会如何被评估。这是系统工作方式的概念演示。',
      placeholder: '在这里写你的提示词...例如："设计一个帮助视障人士自主导航城市的AI程序"',
      evaluate: '评估提示词',
      resultTitle: '你的提示词评估',
      totalKarma: '总因果值',
      feedback: '反馈',
      tryAnother: '试另一个提示词',
      waiting: '写一个提示词并按"评估"查看你在6个维度上的分数。',
      feedbackTexts: {
        excellent: '出色的提示词！高创造力、完美的伦理和真正的社会影响。你是AI守护者。',
        good: '好的提示词。你有潜力，但某些维度可以改进。继续练习！',
        needsWork: '你的提示词需要改进。试着更具体、更有道德或更有创意。记住：AI是桥梁，不是武器。',
      },
    },
    labor: {
      badge: '💼 未来准备',
      title: '每个房间培养一个未来专业人才',
      subtitle: '50%的入门级工作将因AI消失。但数百万新工作将诞生。LINCE通过游戏为你做好准备。',
      stat1: { number: '50%', label: '入门级工作将随AI而改变（WEF, 2025）' },
      stat2: { number: '97M', label: '到2030年AI创造的新工作（WEF）' },
      stat3: { number: '10', label: 'LINCE覆盖的学习领域' },
      message: 'LINCE不教你使用2年后就会改变的工具。它教你以20年后仍然相关的方式思考。每个房间培养可转移技能：批判性思维、伦理、创造力、协作、韧性。这些是任何AI都无法复制的技能。',
    },
    cta: {
      title: '准备好学习未来了吗？',
      subtitle: 'LINCE不仅仅是一个应用——它是AI时代的生存地图。你写的每个提示词都让你更接近未来。',
      button: '开始我的学习',
      secondary: '探索LINCE世界',
    },
    footer: {
      copyright: '© 2025 ACNB IA SL — LINCE：人工智能的多邻国',
      framework: 'LINCE设计的教学框架 — 通过游戏学习AI，融合伦理与创造力',
    },
  },
};

/* ─── Prompt Evaluator (deterministic simulation) ─── */
function evaluatePrompt(text: string): Record<string, number> {
  if (!text || text.trim().length < 10) {
    return { creatividad: 0, precision: 0, etica: 0, tecnica: 0, colaboracion: 0, impacto: 0 };
  }
  const lower = text.toLowerCase();
  const len = text.trim().length;

  // Creativity: length, variety of words, questions, metaphors
  const uniqueWords = new Set(lower.split(/\s+/)).size;
  const hasQuestion = /\?/.test(text);
  const hasMetaphor = /(como|imagina|supón|metáfora|like|imagine|suppose|metaphor|比喻|想象)/.test(lower);
  let creatividad = Math.min(100, Math.round(uniqueWords * 2.5 + (hasQuestion ? 15 : 0) + (hasMetaphor ? 20 : 0) + (len > 100 ? 15 : 0)));

  // Precision: specificity words, numbers, structure
  const hasNumbers = /\d+/.test(text);
  const hasStructure = /(paso|step|primero|segundo|first|second|第一|第二|1\.|2\.)/.test(lower);
  const hasSpecific = /(exacto|específico|concreto|exact|specific|concrete|具体|精确)/.test(lower);
  let precision = Math.min(100, Math.round(40 + (hasNumbers ? 20 : 0) + (hasStructure ? 20 : 0) + (hasSpecific ? 15 : 0) + Math.min(len / 8, 15)));

  // Ethics: ethical keywords
  const ethicsWords = /(ético|ética|justo|respeto|derecho|privacidad|inclusivo|diversidad|ethical|fair|respect|right|privacy|inclusive|diversity|道德|公平|尊重|权利|隐私|包容|多样)/.test(lower);
  const antiEthics = /(hackear|robar|engañar|manipular|hack|steal|deceive|manipulate|黑客|偷|欺骗|操纵)/.test(lower);
  let etica = Math.min(100, Math.round(50 + (ethicsWords ? 35 : 0) + (antiEthics ? -25 : 0) + (len > 80 ? 10 : 0)));

  // Technique: AI-related terms
  const techWords = /(prompt|ia|ai|modelo|algoritmo|datos|api|machine learning|red neuronal|model|algorithm|data|neural network|提示词|模型|算法|数据|神经网络)/.test(lower);
  const advancedTech = /(reinforcement|transformer|fine-tun|embeddings|token|gpt|llm|强化学习|微调)/.test(lower);
  let tecnica = Math.min(100, Math.round(35 + (techWords ? 30 : 0) + (advancedTech ? 25 : 0) + Math.min(len / 10, 15)));

  // Collaboration: social/team words
  const collabWords = /(juntos|equipo|compartir|ayudar|comunidad|familia|together|team|share|help|community|family|一起|团队|分享|帮助|社区|家庭)/.test(lower);
  let colaboracion = Math.min(100, Math.round(30 + (collabWords ? 40 : 0) + (hasQuestion ? 15 : 0) + Math.min(len / 10, 15)));

  // Social impact: world-changing words
  const impactWords = /(mundo|sociedad|problema|solución|mejorar|cambiar|futuro|world|society|problem|solution|improve|change|future|世界|社会|问题|解决|改善|改变|未来)/.test(lower);
  const bigImpact = /(salud|educación|pobreza|clima|health|education|poverty|climate|健康|教育|贫困|气候)/.test(lower);
  let impacto = Math.min(100, Math.round(25 + (impactWords ? 30 : 0) + (bigImpact ? 30 : 0) + Math.min(len / 10, 15)));

  return {
    creatividad: Math.max(5, Math.min(100, creatividad)),
    precision: Math.max(5, Math.min(100, precision)),
    etica: Math.max(5, Math.min(100, etica)),
    tecnica: Math.max(5, Math.min(100, tecnica)),
    colaboracion: Math.max(5, Math.min(100, colaboracion)),
    impacto: Math.max(5, Math.min(100, impacto)),
  };
}

/* ─── Components ─── */
function useInView(threshold = 0.12) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setIsVisible(true); }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, isVisible };
}

function FadeIn({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const { ref, isVisible } = useInView();
  return (
    <div ref={ref} className={`transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"} ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      <BackButton variant="inline" />
      {children}
    </div>
  );
}

/* ─── Main Page ─── */
export default function AcademiaLince() {
  const { lang } = useGameLang();
  const t = useMemo(() => academiaTranslations[lang] || academiaTranslations.es, [lang]);

  const [selectedRoom, setSelectedRoom] = useState<number>(0);
  const [promptText, setPromptText] = useState('');
  const [evaluation, setEvaluation] = useState<Record<string, number> | null>(null);
  const [showEvaluation, setShowEvaluation] = useState(false);
  const [expandedAge, setExpandedAge] = useState<string | null>(null);

  const rooms = t.rooms.data;
  const currentRoom = rooms[selectedRoom];
  const karmaDims = t.karma.dimensions;

  const handleEvaluate = () => {
    if (promptText.trim().length < 5) return;
    const result = evaluatePrompt(promptText);
    setEvaluation(result);
    setShowEvaluation(true);
  };

  const totalKarma = evaluation ? Math.round(Object.values(evaluation).reduce((a, b) => a + b, 0) / 6) : 0;
  const feedbackKey = totalKarma >= 70 ? 'excellent' : totalKarma >= 40 ? 'good' : 'needsWork';

  return (
    <div className="min-h-screen bg-[#050510] text-white pt-14">
      <GlobalNavBar />
      {/* ─── HERO ─── */}
      <section className="relative pt-24 pb-16 overflow-hidden min-h-[70vh] flex items-center">
        {/* Hero background image */}
        <img src={HERO_BG} alt="Academia LINCE - Familia de personajes lince en academia" className="absolute inset-0 w-full h-full object-cover opacity-30 object-center" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#050510]/60 via-[#050510]/40 to-[#050510]" />
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-900/20 via-transparent to-transparent" />
        <div className="container relative px-4">
          <FadeIn>
            <div className="text-center max-w-4xl mx-auto">
              <span className="inline-block px-4 py-1.5 text-xs font-medium bg-emerald-500/10 text-emerald-400 rounded-full border border-emerald-500/20 mb-6">
                {t.hero.badge}
              </span>
              <h1 className="text-5xl md:text-7xl font-['Space_Grotesk'] font-black mb-4 leading-tight">
                {t.hero.title} <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">{t.hero.titleAccent}</span>
              </h1>
              <p className="text-xl md:text-2xl text-emerald-300/80 font-medium mb-6">{t.hero.subtitle}</p>
              <p className="text-sm md:text-base text-gray-400 leading-relaxed max-w-3xl mx-auto mb-10">
                {lang === 'es' ? <>
                  Diseñamos un currículum donde cada personaje de la <GlossaryTooltip term="familialince">Familia LINCECE</GlossaryTooltip> encarna un área crítica de aprendizaje. No enseñamos <GlossaryTooltip term="ia">IA</GlossaryTooltip> como herramienta — enseñamos cómo ser humano en la era de la IA. Cada habitación es un laboratorio vivo donde escribir <GlossaryTooltip term="prompt">prompts</GlossaryTooltip> es la nueva alfabetización.
                </> : lang === 'en' ? <>
                  We designed a curriculum where each <GlossaryTooltip term="familialince">LINCE Family</GlossaryTooltip> character embodies a critical learning area. We don't teach <GlossaryTooltip term="ia">AI</GlossaryTooltip> as a tool — we teach how to be human in the AI era. Each room is a living lab where writing <GlossaryTooltip term="prompt">prompts</GlossaryTooltip> is the new literacy.
                </> : <>
                  我们设计了一个课程，其中<GlossaryTooltip term="familialince">LINCE家族</GlossaryTooltip>的每个角色都体现了一个关键学习领域。我们不是把<GlossaryTooltip term="ia">AI</GlossaryTooltip>当工具教——而是教如何在AI时代做人。每个房间都是一个活的实验室，写<GlossaryTooltip term="prompt">提示词</GlossaryTooltip>是新的读写能力。
                </>}
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
                {t.hero.stats.map((s: any, i: number) => (
                  <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold text-emerald-400">{s.number}</div>
                    <div className="text-[11px] text-gray-400 mt-1">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ─── AMODEI FOUNDATION ─── */}
      <section className="py-16 border-t border-white/5">
        <div className="container px-4">
          <FadeIn>
            <div className="text-center mb-12">
              <span className="inline-block px-4 py-1.5 text-xs font-medium bg-violet-500/10 text-violet-400 rounded-full border border-violet-500/20 mb-4">{t.amodeiSection.badge}</span>
              <h2 className="text-3xl md:text-4xl font-['Space_Grotesk'] font-bold mb-3">{t.amodeiSection.title}</h2>
              <p className="text-gray-400 max-w-2xl mx-auto">{t.amodeiSection.subtitle}</p>
            </div>
          </FadeIn>

          {/* Quotes */}
          <div className="grid md:grid-cols-2 gap-4 mb-12 max-w-5xl mx-auto">
            {t.amodeiSection.quotes.map((q: any, i: number) => (
              <FadeIn key={i} delay={i * 100}>
                <div className="bg-gradient-to-br from-violet-500/5 to-transparent border border-violet-500/10 rounded-xl p-5">
                  <p className="text-sm text-gray-300 italic leading-relaxed mb-2">{q.text}</p>
                  <p className="text-[11px] text-violet-400 font-medium">— {q.source}</p>
                </div>
              </FadeIn>
            ))}
          </div>

          {/* Pillars */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-w-4xl mx-auto">
            {t.amodeiSection.pillars.map((p: any, i: number) => (
              <FadeIn key={i} delay={i * 80}>
                <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center hover:border-emerald-500/30 transition-colors">
                  <div className="text-2xl mb-2">{p.icon}</div>
                  <h3 className="text-sm font-bold text-white mb-1">{p.title}</h3>
                  <p className="text-[11px] text-gray-400">{p.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 10 ROOMS ─── */}
      <section className="py-16 border-t border-white/5">
        <div className="container px-4">
          <FadeIn>
            <div className="text-center mb-10">
              <span className="inline-block px-4 py-1.5 text-xs font-medium bg-cyan-500/10 text-cyan-400 rounded-full border border-cyan-500/20 mb-4">{t.rooms.badge}</span>
              <h2 className="text-3xl md:text-4xl font-['Space_Grotesk'] font-bold mb-3">{t.rooms.title}</h2>
              <p className="text-gray-400 max-w-2xl mx-auto">{t.rooms.subtitle}</p>
            </div>
          </FadeIn>

          {/* Room selector - horizontal scroll */}
          <div className="flex gap-2 overflow-x-auto pb-4 mb-8 scrollbar-hide">
            {rooms.map((room: any, i: number) => (
              <button
                key={room.id}
                onClick={() => { setSelectedRoom(i); setExpandedAge(null); }}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all flex-shrink-0 border ${
                  selectedRoom === i
                    ? 'text-white border-opacity-50'
                    : 'bg-white/5 text-gray-400 border-white/10 hover:bg-white/10 hover:text-white'
                }`}
                style={selectedRoom === i ? { backgroundColor: `${room.color}20`, borderColor: `${room.color}50`, color: room.color } : {}}
              >
                <img src={AVATAR_EDU[room.avatarKey]} alt={room.officialName} className="w-7 h-7 rounded-full object-contain" style={{ backgroundColor: `${room.color}20` }} />
                <span>{room.officialName}</span>
              </button>
            ))}
          </div>

          {/* Selected room detail */}
          {currentRoom && (
            <div className="max-w-5xl mx-auto">
              <div className="grid md:grid-cols-[280px_1fr] gap-6">
                {/* Avatar card */}
                <FadeIn>
                  <div className="rounded-2xl border p-5 text-center" style={{ backgroundColor: `${currentRoom.color}08`, borderColor: `${currentRoom.color}25` }}>
                    <img
                      src={AVATAR_EDU[currentRoom.avatarKey]}
                      alt={currentRoom.officialName}
                      className="w-32 h-32 mx-auto rounded-full object-contain mb-4"
                      style={{ backgroundColor: `${currentRoom.color}15` }}
                    />
                    <h3 className="text-xl font-bold" style={{ color: currentRoom.color }}>{currentRoom.officialName}</h3>
                    <p className="text-[11px] text-gray-500 mb-2">({currentRoom.duoName})</p>
                    <div className="text-3xl mb-3">{currentRoom.icon}</div>
                    <h4 className="text-sm font-bold text-white mb-1">{currentRoom.roomName}</h4>
                    <p className="text-[11px] text-gray-400 mb-3">{currentRoom.area}</p>
                    <div className="flex flex-wrap gap-1 justify-center">
                      {currentRoom.skills.map((s: string, i: number) => (
                        <span key={i} className="px-2 py-0.5 text-[10px] rounded-full border" style={{ borderColor: `${currentRoom.color}30`, color: currentRoom.color }}>
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </FadeIn>

                {/* Room content */}
                <div className="space-y-5">
                  {/* Description */}
                  <FadeIn>
                    <div className="bg-white/5 border border-white/10 rounded-xl p-5">
                      <p className="text-sm text-gray-300 leading-relaxed mb-3">{currentRoom.description}</p>
                      <div className="bg-black/30 rounded-lg p-3 border-l-2" style={{ borderColor: currentRoom.color }}>
                        <p className="text-[11px] text-gray-400 italic">{currentRoom.amodeiRef}</p>
                        <p className="text-[10px] text-gray-500 mt-1">— Principio LINCE</p>
                      </div>
                    </div>
                  </FadeIn>

                  {/* Age adaptation */}
                  <FadeIn delay={100}>
                    <div className="bg-white/5 border border-white/10 rounded-xl p-5">
                      <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: currentRoom.color }} />
                        {tl(lang, { es: 'Adaptación por Edad', en: 'Age Adaptation', zh: '按年龄适应', 'pt-BR': 'Adaptación por Edad', 'pt-PT': 'Adaptación por Edad' })}
                      </h4>
                      <div className="space-y-2">
                        {Object.entries(currentRoom.ageAdapt).map(([key, val]: [string, any]) => (
                          <button
                            key={key}
                            onClick={() => setExpandedAge(expandedAge === key ? null : key)}
                            className={`w-full text-left p-3 rounded-lg text-sm transition-all ${expandedAge === key ? 'bg-white/10 text-white' : 'bg-white/3 text-gray-400 hover:bg-white/5'}`}
                          >
                            {val}
                          </button>
                        ))}
                      </div>
                    </div>
                  </FadeIn>

                  {/* Sample prompts */}
                  <FadeIn delay={200}>
                    <div className="bg-white/5 border border-white/10 rounded-xl p-5">
                      <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: currentRoom.color }} />
                        {tl(lang, { es: 'Prompts de Ejemplo', en: 'Sample Prompts', zh: '示例提示词', 'pt-BR': 'Prompts de Ejemplo', 'pt-PT': 'Prompts de Ejemplo' })}
                      </h4>
                      <div className="space-y-2">
                        {currentRoom.samplePrompts.map((p: string, i: number) => (
                          <div key={i} className="bg-black/30 rounded-lg p-3 text-[12px] text-emerald-300/80 font-mono leading-relaxed border border-emerald-500/10">
                            {p}
                          </div>
                        ))}
                      </div>
                    </div>
                  </FadeIn>

                  {/* Labor connection */}
                  <FadeIn delay={300}>
                    <div className="rounded-xl p-4 border" style={{ backgroundColor: `${currentRoom.color}08`, borderColor: `${currentRoom.color}20` }}>
                      <h4 className="text-sm font-bold mb-1" style={{ color: currentRoom.color }}>
                        {tl(lang, { es: 'Carreras del Futuro', en: 'Future Careers', zh: '未来职业', 'pt-BR': 'Carreras del Futuro', 'pt-PT': 'Carreras del Futuro' })}
                      </h4>
                      <p className="text-[12px] text-gray-300">{currentRoom.laborConnection}</p>
                    </div>
                  </FadeIn>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ─── KARMA SYSTEM ─── */}
      <section className="py-16 border-t border-white/5">
        <div className="container px-4">
          <FadeIn>
            <div className="text-center mb-10">
              <span className="inline-block px-4 py-1.5 text-xs font-medium bg-emerald-500/10 text-emerald-400 rounded-full border border-emerald-500/20 mb-4">{t.karma.badge}</span>
              <h2 className="text-3xl md:text-4xl font-['Space_Grotesk'] font-bold mb-3">{t.karma.title}</h2>
              <p className="text-gray-400 max-w-2xl mx-auto">{t.karma.subtitle}</p>
            </div>
          </FadeIn>

          {/* 6 Dimensions */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-4xl mx-auto mb-10">
            {karmaDims.map((dim: any, i: number) => (
              <FadeIn key={dim.id} delay={i * 80}>
                <div className="bg-white/5 border border-white/10 rounded-xl p-5 hover:border-opacity-50 transition-all" style={{ ['--hover-border' as any]: dim.color }}>
                  <div className="text-3xl mb-3">{dim.icon}</div>
                  <h3 className="text-sm font-bold mb-1" style={{ color: dim.color }}>{dim.name}</h3>
                  <p className="text-[11px] text-gray-400 leading-relaxed">{dim.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>

          {/* Rules */}
          <div className="max-w-3xl mx-auto bg-white/5 border border-white/10 rounded-xl p-6">
            <h3 className="text-lg font-bold text-white mb-4 text-center">
              {tl(lang, { es: 'Reglas del Karma', en: 'Karma Rules', zh: '因果规则', 'pt-BR': 'Reglas del Karma', 'pt-PT': 'Reglas del Karma' })}
            </h3>
            <div className="space-y-3">
              {t.karma.rules.map((rule: any, i: number) => (
                <FadeIn key={i} delay={i * 60}>
                  <div className="flex items-start gap-3 p-3 bg-black/20 rounded-lg">
                    <span className="text-lg flex-shrink-0">{rule.icon}</span>
                    <p className="text-sm text-gray-300">{rule.text}</p>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── INTERACTIVE DEMO ─── */}
      <section className="py-16 border-t border-white/5">
        <div className="container px-4">
          <FadeIn>
            <div className="text-center mb-10">
              <span className="inline-block px-4 py-1.5 text-xs font-medium bg-cyan-500/10 text-cyan-400 rounded-full border border-cyan-500/20 mb-4">{t.demo.badge}</span>
              <h2 className="text-3xl md:text-4xl font-['Space_Grotesk'] font-bold mb-3">{t.demo.title}</h2>
              <p className="text-gray-400 max-w-2xl mx-auto">{t.demo.subtitle}</p>
            </div>
          </FadeIn>

          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Input */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-5">
                <textarea
                  value={promptText}
                  onChange={(e) => setPromptText(e.target.value)}
                  placeholder={t.demo.placeholder}
                  className="w-full h-40 bg-black/30 border border-white/10 rounded-lg p-4 text-sm text-white placeholder-gray-500 resize-none focus:outline-none focus:border-emerald-500/50 transition-colors"
                />
                <div className="flex items-center justify-between mt-3">
                  <span className="text-[11px] text-gray-500">{promptText.length} {tl(lang, { es: 'caracteres', en: 'chars', zh: '字符', 'pt-BR': 'caracteres', 'pt-PT': 'caracteres' })}</span>
                  <button
                    onClick={handleEvaluate}
                    disabled={promptText.trim().length < 5}
                    className="px-5 py-2 text-sm font-bold bg-gradient-to-r from-emerald-500 to-cyan-500 text-black rounded-lg disabled:opacity-30 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
                  >
                    {t.demo.evaluate}
                  </button>
                </div>
              </div>

              {/* Results */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-5">
                {!showEvaluation ? (
                  <div className="flex items-center justify-center h-full text-gray-500 text-sm text-center p-4">
                    {t.demo.waiting}
                  </div>
                ) : evaluation && (
                  <div>
                    <h3 className="text-sm font-bold text-white mb-4">{t.demo.resultTitle}</h3>
                    <div className="space-y-3 mb-4">
                      {karmaDims.map((dim: any) => {
                        const val = evaluation[dim.id] || 0;
                        return (
                          <div key={dim.id}>
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-[11px] text-gray-400 flex items-center gap-1">
                                <span>{dim.icon}</span> {dim.name}
                              </span>
                              <span className="text-[11px] font-bold" style={{ color: dim.color }}>{val}/100</span>
                            </div>
                            <div className="h-2 bg-black/30 rounded-full overflow-hidden">
                              <div
                                className="h-full rounded-full transition-all duration-1000"
                                style={{ width: `${val}%`, backgroundColor: dim.color }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Total */}
                    <div className="bg-black/30 rounded-lg p-3 text-center mb-3">
                      <div className="text-[11px] text-gray-400 mb-1">{t.demo.totalKarma}</div>
                      <div className={`text-3xl font-bold ${totalKarma >= 70 ? 'text-emerald-400' : totalKarma >= 40 ? 'text-amber-400' : 'text-red-400'}`}>
                        {totalKarma}/100
                      </div>
                    </div>

                    {/* Feedback */}
                    <div className={`rounded-lg p-3 text-sm ${totalKarma >= 70 ? 'bg-emerald-500/10 text-emerald-300' : totalKarma >= 40 ? 'bg-amber-500/10 text-amber-300' : 'bg-red-500/10 text-red-300'}`}>
                      <p className="text-[11px] font-medium mb-1">{t.demo.feedback}</p>
                      <p className="text-[12px]">{t.demo.feedbackTexts[feedbackKey]}</p>
                    </div>

                    <button
                      onClick={() => { setPromptText(''); setShowEvaluation(false); setEvaluation(null); }}
                      className="mt-3 w-full py-2 text-sm text-gray-400 hover:text-white border border-white/10 rounded-lg transition-colors"
                    >
                      {t.demo.tryAnother}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── LABOR PREPARATION ─── */}
      <section className="py-16 border-t border-white/5">
        <div className="container px-4">
          <FadeIn>
            <div className="text-center mb-10">
              <span className="inline-block px-4 py-1.5 text-xs font-medium bg-amber-500/10 text-amber-400 rounded-full border border-amber-500/20 mb-4">{t.labor.badge}</span>
              <h2 className="text-3xl md:text-4xl font-['Space_Grotesk'] font-bold mb-3">{t.labor.title}</h2>
              <p className="text-gray-400 max-w-2xl mx-auto">{t.labor.subtitle}</p>
            </div>
          </FadeIn>

          {/* Stats */}
          <div className="grid md:grid-cols-3 gap-4 max-w-3xl mx-auto mb-10">
            {[t.labor.stat1, t.labor.stat2, t.labor.stat3].map((stat: any, i: number) => (
              <FadeIn key={i} delay={i * 100}>
                <div className="bg-white/5 border border-white/10 rounded-xl p-6 text-center">
                  <div className="text-4xl font-bold text-amber-400 mb-2">{stat.number}</div>
                  <div className="text-[11px] text-gray-400">{stat.label}</div>
                </div>
              </FadeIn>
            ))}
          </div>

          {/* Career map */}
          <FadeIn>
            <div className="max-w-4xl mx-auto bg-gradient-to-br from-amber-500/5 to-transparent border border-amber-500/10 rounded-xl p-6">
              <p className="text-sm text-gray-300 leading-relaxed text-center mb-6">{t.labor.message}</p>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {rooms.slice(0, 10).map((room: any, i: number) => (
                  <div key={i} className="text-center p-3 bg-black/20 rounded-lg">
                    <img src={AVATAR_EDU[room.avatarKey]} alt={room.officialName} className="w-10 h-10 mx-auto rounded-full object-contain mb-1" style={{ backgroundColor: `${room.color}15` }} />
                    <div className="text-[10px] font-bold mb-0.5" style={{ color: room.color }}>{room.officialName}</div>
                    <div className="text-[9px] text-gray-500">{room.laborConnection.split(' · ')[0]}</div>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="py-20 border-t border-white/5">
        <div className="container px-4">
          <FadeIn>
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-['Space_Grotesk'] font-bold mb-4">{t.cta.title}</h2>
              <p className="text-gray-400 mb-8">{t.cta.subtitle}</p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link href="/registro" className="px-8 py-3 text-sm font-bold bg-gradient-to-r from-emerald-500 to-cyan-500 text-black rounded-xl hover:opacity-90 transition-opacity">
                  {t.cta.button}
                </Link>
                <Link href="/mundo" className="px-8 py-3 text-sm font-bold border border-amber-500/30 text-amber-400 rounded-xl hover:bg-amber-500/10 transition-colors">
                  {t.cta.secondary}
                </Link>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="py-8 border-t border-white/5">
        <div className="container px-4 text-center">
          <p className="text-[11px] text-gray-500 mb-1">{t.footer.copyright}</p>
          <p className="text-[10px] text-gray-600">{t.footer.framework}</p>
        </div>
      </footer>
    </div>
  );
}

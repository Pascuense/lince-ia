import { useState, useRef, useEffect, useMemo } from "react";
import { toast } from "sonner";
import { UserNavBadge } from "@/components/UserNavBadge";
import { GlobalNavBar } from "@/components/GlobalNavBar";
import { BackButton } from "@/components/BackButton";

// ═══════════════════════════════════════════════════════════════
// LINCE — Guía Interactiva de Prompts para Base44
// Sitio web buscable con todos los prompts, instrucciones y config
// ═══════════════════════════════════════════════════════════════

// ── DATA ──────────────────────────────────────────────────────

interface PromptSection {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  description: string;
  prompt: string;
  color: string;
  icon: string;
  tags: string[];
}

interface ConfigStep {
  step: string;
  title: string;
  description: string;
  icon: string;
}

const PROMPT_SECTIONS: PromptSection[] = [
  {
    id: "prompt-1",
    number: "01",
    title: "Creación de la App Base",
    subtitle: "Estructura completa de LINCE",
    description: "El prompt fundacional. Crea la landing page, sistema de registro/login con generaciones, dashboard del alumno, mapa de 10 mundos temáticos con 50 cursos, sistema de lecciones interactivas, perfil de usuario, tabla de clasificación con 6 ligas, y todas las entidades de base de datos.",
    prompt: `Crea una app educativa llamada LINCE — "Aprende IA Jugando" donde aprendes jugando. 
Es una app que enseña inteligencia artificial a TODAS las generaciones (niños de 6 años 
hasta abuelos de 80+) usando personajes familiares, juegos y recompensas gamificadas y contenido 
que se actualiza automáticamente con IA.

ESTILO VISUAL:
- Tema oscuro futurista con fondo #0A0A0A
- Color principal cyan #00E5FF (tecnología, IA)
- Color secundario dorado #D4A843 (premium, logros)
- Color éxito verde #00C853
- Color alerta rojo #FF5252
- Tipografía: Space Grotesk para títulos, Inter para cuerpo
- Estética cyberpunk-educativa: bordes con glow cyan, gradientes sutiles, 
  fondos con patrones de circuitos en baja opacidad
- Layout tipo Scrollytelling para la landing + Bento Grid para el dashboard

ESTRUCTURA DE PÁGINAS:

1. LANDING PAGE (pública, sin login):
   - Hero section con título "LINCE" donde "LINCE" brilla en cyan
   - Subtítulo: "Aprende IA Jugando — Plataforma gamificada de formación en inteligencia artificial"
   - Stats: 10 Mundos temáticos, 50 Cursos, 900+ Lecciones, 100 Niveles
   - Sección "Conoce a la Familia LINCE" con grid de 10 avatares
   - Sección de planes de precios (Gratis, Pro €9.99/mes, Familia €14.99/mes)
   - Footer con info legal de ACNB (www.acnb.es), ACNB IA SL

2. REGISTRO / LOGIN:
   - Registro con email y contraseña
   - Al registrarse, el usuario elige su generación:
     * Infantil (6-15 años)
     * Joven (16-34 años)
     * Adulto (35-64 años)
     * Mayor (65+ años)
   - Según la generación, se asigna un avatar guía automáticamente

3. DASHBOARD DEL ALUMNO (requiere login):
   - Sidebar con navegación
   - Panel principal con:
     * Avatar del usuario con su nombre y nivel actual
     * Barra de XP (experiencia) con progreso al siguiente nivel
     * Racha diaria (días consecutivos de estudio)
     * Acceso rápido a "Continuar lección" 
     * Tabla de clasificación (liga actual)

4. MAPA DE MUNDOS (10 mundos temáticos):
   - Mundo 1: Fundamentos IA (qué es IA, historia, conceptos básicos)
   - Mundo 2: Prompts & ChatGPT (ingeniería de prompts, uso de ChatGPT)
   - Mundo 3: Imágenes con IA (Midjourney, DALL-E, Stable Diffusion)
   - Mundo 4: Video & Audio IA (Sora, ElevenLabs, Kling)
   - Mundo 5: Automatización (Make, Zapier, n8n)
   - Mundo 6: Datos & Analytics (análisis de datos con IA)
   - Mundo 7: IA para Negocios (modelos de negocio, productividad)
   - Mundo 8: Programación con IA (Copilot, Cursor, Lovable)
   - Mundo 9: Ética & Seguridad IA (sesgos, privacidad, regulación)
   - Mundo 10: Futuro de la IA (AGI, tendencias, investigación)
   Cada mundo tiene 5 cursos. Cada curso tiene 5 unidades. Cada unidad tiene 
   3-5 lecciones interactivas.

5. PÁGINA DE LECCIÓN:
   - Barra de progreso en la parte superior
   - Contenido adaptado a la generación del usuario:
     * Para niños: explicaciones con metáforas simples, muchos emojis, tono divertido
     * Para jóvenes: ejemplos con redes sociales, monetización, trending
     * Para adultos: enfoque profesional, productividad, casos de empresa
     * Para mayores: paso a paso muy detallado, letra grande, tono paciente
   - Tipos de ejercicios interactivos:
     * Selección múltiple (4 opciones)
     * Verdadero/Falso
     * Completar el espacio en blanco
     * Ordenar pasos de un proceso
     * Escribir un prompt y que la IA lo evalúe
   - Al completar: animación de celebración + XP ganado

6. PERFIL DEL USUARIO:
   - Avatar personalizable
   - Estadísticas: XP total, nivel, racha, lecciones completadas
   - Badges/insignias conseguidas
   - Historial de actividad

7. TABLA DE CLASIFICACIÓN (Ligas):
   - 6 ligas: Bronce, Plata, Oro, Diamante, Obsidiana, LINCE
   - Rankings semanales
   - Top 10 ascienden, últimos 5 descienden
   - Cada liga tiene su color y diseño

ENTIDADES DE DATOS (database):

- Users: id, email, name, generation (infantil/joven/adulto/mayor), 
  avatarId, xp, level, streak, currentLeague, role (user/admin), createdAt

- Worlds: id, name, description, icon, order, color, isLocked

- Courses: id, worldId, name, description, order, xpReward

- Units: id, courseId, name, order

- Lessons: id, unitId, title, content (generado por IA), 
  exerciseType, difficulty, xpReward, order

- UserProgress: id, userId, lessonId, completed, score, completedAt

- Achievements: id, name, description, icon, condition, xpReward

- UserAchievements: id, userId, achievementId, earnedAt

- LeagueStandings: id, userId, league, weeklyXp, rank, week

- Avatars: id, name, altName, generation, role, description, 
  imageUrl, color, personality

ROLES Y PERMISOS:
- Usuarios normales: acceso a lecciones, su progreso, clasificación
- Administradores: gestión de contenido, ver analytics, gestionar usuarios

Incluye autenticación con email/contraseña. El diseño debe ser responsive 
y funcionar perfectamente en móvil.`,
    color: "#00E5FF",
    icon: "🏗️",
    tags: ["estructura", "landing", "dashboard", "mundos", "lecciones", "base de datos", "login", "registro"],
  },
  {
    id: "prompt-2",
    number: "02",
    title: "Sistema de Juego y Recompensas",
    subtitle: "XP, niveles, rachas, ligas e insignias",
    description: "Añade el sistema completo de juego y recompensas: sistema de XP con bonificaciones, 100 niveles con rangos (Curioso → Maestro LINCE), rachas diarias con escudos, gemas como moneda virtual, 6 ligas semanales con ascensos/descensos, desafío diario, y sistema de badges/insignias por categorías.",
    prompt: `Añade el sistema completo de juego y recompensas a LINCE:

SISTEMA DE XP (Experiencia):
- Completar lección: +10 XP
- Respuesta correcta a la primera: +5 XP bonus
- Completar unidad entera: +50 XP bonus
- Completar curso: +200 XP bonus
- Racha diaria: +5 XP por día consecutivo
- Desafío diario completado: +15 XP

SISTEMA DE NIVELES (100 niveles):
- Nivel 1-10: "Curioso" (0-500 XP) — color gris
- Nivel 11-25: "Aprendiz" (501-2.500 XP) — color verde
- Nivel 26-50: "Explorador" (2.501-10.000 XP) — color cyan
- Nivel 51-75: "Experto" (10.001-30.000 XP) — color dorado
- Nivel 76-100: "Maestro LINCE" (30.001+ XP) — color púrpura con glow

SISTEMA DE RACHAS:
- Mostrar un contador de días consecutivos de estudio
- Iconos de fuego que crecen con la racha
- Hitos especiales: 7 días (Escudo de Bronce), 30 días (Escudo de Plata), 
  100 días (Escudo de Oro), 365 días (Escudo de Diamante)
- Si pierdes la racha, opción de "Reparar racha" con gemas

SISTEMA DE GEMAS (moneda virtual):
- Se ganan completando desafíos especiales
- Se pueden usar para: reparar rachas, desbloquear contenido bonus, 
  comprar accesorios para el avatar

SISTEMA DE LIGAS (semanal):
- Bronce → Plata → Oro → Diamante → Obsidiana → LINCE
- Cada lunes se reinicia el ranking semanal
- Top 10 de cada liga ascienden a la siguiente
- Últimos 5 descienden a la liga anterior
- Mostrar tabla de clasificación con avatares, nombres y XP semanal

DESAFÍO DIARIO:
- Cada día a las 00:00 se genera un nuevo desafío
- El desafío es una mini-lección especial con 5 preguntas
- Recompensa: 15 XP + posibilidad de gemas
- Temporizador visible: "Quedan X horas para completar el desafío"

BADGES / INSIGNIAS (categorías):
- Progreso: "Primera Lección", "10 Lecciones", "100 Lecciones"
- Rachas: "Semana Imparable", "Mes de Fuego", "Año LINCE"
- Mundos: "Explorador de [nombre del mundo]" por completar cada mundo
- Social: "Primer Amigo", "Líder de Liga"
- Especiales: "Madrugador" (estudiar antes de las 7am), "Noctámbulo" (después de las 23h)

Muestra las insignias en el perfil del usuario con las conseguidas en color 
y las pendientes en gris con candado. Añade animaciones de celebración cuando 
se desbloquea una nueva insignia.`,
    color: "#D4A843",
    icon: "🏆",
    tags: ["xp", "niveles", "rachas", "gemas", "ligas", "badges", "insignias", "juego"],
  },
  {
    id: "prompt-3",
    number: "03",
    title: "Los 10 Avatares de la Familia",
    subtitle: "Personajes guía con personalidad única",
    description: "Crea los 10 avatares de la Familia LINCE: YAYOLIN y YAYALINA (abuelos), PAPALIN y MAMALINA (adultos), CHAVALIN y CHAVALINA (jóvenes), PEQUELIN y PEQUELINA (niños), ATOLONDRALIN (despistado motivador) y SABELIN (genio retador). Cada uno con personalidad, frases y generación asignada.",
    prompt: `Crea el sistema de avatares de la Familia LINCE. Son 10 personajes que guían 
al usuario según su generación. Cada avatar tiene personalidad única y adapta 
su forma de enseñar:

AVATARES:

1. YAYOLIN (YAYALIN) — Abuelo, 65+ años
   - Color: gris #B0B0B0
   - Personalidad: Sabio, paciente, cuenta historias del pasado para explicar IA
   - Enseña: Ética de la IA, pensamiento crítico, bioética
   - Frase: "La tecnología es como un buen vino: hay que entenderla para disfrutarla"
   - Generación asignada: Mayor

2. YAYALINA (MAMALINA Abuela) — Abuela, 65+ años
   - Color: gris #B0B0B0
   - Personalidad: Cariñosa, conecta la IA con la vida cotidiana
   - Enseña: Empatía digital, comunicación intergeneracional, IA emocional
   - Frase: "Mijo, la IA es como cocinar: con los ingredientes correctos, sale delicioso"
   - Generación asignada: Mayor

3. PAPALÍN — Padre, 35-64 años
   - Color: cyan #00E5FF
   - Personalidad: Práctico, orientado a resultados, enfocado en productividad
   - Enseña: Automatización, productividad, gestión empresarial con IA
   - Frase: "Cada minuto que la IA trabaja por ti es un minuto para tu familia"
   - Generación asignada: Adulto

4. MAMALINA (MAMALINA) — Madre, 35-64 años
   - Color: cyan #00E5FF
   - Personalidad: Organizada, pedagógica, conecta IA con educación familiar
   - Enseña: Pedagogía adaptativa, organización familiar, aprendizaje personalizado
   - Frase: "Aprender IA en familia es el mejor regalo que podemos darnos"
   - Generación asignada: Adulto

5. CHAVALÍN — Joven, 16-34 años
   - Color: verde #00C853
   - Personalidad: Emprendedor digital, habla de monetización y tendencias
   - Enseña: Ciberseguridad, monetización con IA, redes sociales inteligentes
   - Frase: "La IA no es el futuro, es el presente. Y tú puedes ser parte"
   - Generación asignada: Joven

6. CHAVALINA (MAMALINA JR) — Joven, 16-34 años
   - Color: verde #00C853
   - Personalidad: Creativa, artística, usa IA para expresión visual
   - Enseña: Diseño generativo, arte digital con IA, expresión visual
   - Frase: "Con IA, tu imaginación es el único límite"
   - Generación asignada: Joven

7. PEQUELIN (PEQUELIN) — Niño, 6-15 años
   - Color: amarillo #FFD700
   - Personalidad: Curioso, científico, todo es un experimento
   - Enseña: Ciencia + IA, exploración, experimentación
   - Frase: "¿Y si probamos qué pasa cuando...?"
   - Generación asignada: Infantil

8. PEQUELINA (PEQUELINA) — Niña, 6-15 años
   - Color: amarillo #FFD700
   - Personalidad: Narradora, imaginativa, crea mundos con historias
   - Enseña: Storytelling con IA, imaginación, creación de mundos
   - Frase: "Érase una vez una IA que aprendió a soñar..."
   - Generación asignada: Infantil

9. ATOLONDRALIN (ATOLONDRALIN) — Personaje especial
   - Color: rojo #FF5252
   - Personalidad: Despistado, comete errores para que el usuario aprenda de ellos
   - Enseña: Gestión del error, perseverancia, aprendizaje del fallo
   - Frase: "¡Ups! Me equivoqué otra vez... pero aprendí algo nuevo"
   - Aparece cuando el usuario falla repetidamente para animarlo

10. SABELIN (SABELIN) — Personaje especial
    - Color: púrpura #9C27B0
    - Personalidad: Genio, mentor avanzado, desafía con retos premium
    - Enseña: Pensamiento avanzado, mentoría, retos de élite
    - Frase: "¿Listo para el siguiente nivel? Esto no será fácil..."
    - Aparece cuando el usuario domina un tema para ofrecer retos extra

En la landing page, muestra los 10 avatares en un grid con sus nombres, roles 
y colores. En el dashboard, muestra el avatar asignado al usuario con sus frases 
motivacionales que cambian según el progreso.

Cuando el usuario falla 3 veces seguidas, ATOLONDRALIN aparece con un mensaje 
de ánimo. Cuando el usuario completa un mundo entero, SABELIN aparece con un 
reto especial.`,
    color: "#00C853",
    icon: "👨‍👩‍👧‍👦",
    tags: ["avatares", "familia", "personajes", "generaciones", "personalidad"],
  },
  {
    id: "prompt-4",
    number: "04",
    title: "Contenido Educativo con IA",
    subtitle: "Conexión OpenAI — El corazón del sistema",
    description: "El prompt MÁS IMPORTANTE. Configura la integración con OpenAI GPT-4 para: generar lecciones adaptadas por generación, actualizar contenido automáticamente cada semana, evaluar prompts escritos por alumnos con puntuación 1-10, y crear el AI Agent 'LINCE Tutor' con búsqueda en internet en tiempo real.",
    prompt: `Integra OpenAI (GPT-4) para que LINCE genere y actualice contenido educativo 
automáticamente. Necesito que configures lo siguiente:

1. GENERADOR DE LECCIONES CON IA:
   Crea una backend function que, dado un tema y una generación de usuario, 
   genere una lección completa usando la API de OpenAI. El prompt del sistema debe ser:

   "Eres un profesor experto en inteligencia artificial que crea lecciones para 
   la plataforma educativa LINCE. Adaptas tu lenguaje según la generación 
   del alumno:
   - Para INFANTIL (6-15 años): usa metáforas simples, ejemplos con juegos y 
     dibujos animados, tono muy divertido y emojis
   - Para JOVEN (16-34 años): usa ejemplos con redes sociales, apps trending, 
     monetización, tono dinámico y actual
   - Para ADULTO (35-64 años): usa ejemplos profesionales, productividad, 
     casos de empresa, tono práctico
   - Para MAYOR (65+ años): usa explicaciones paso a paso muy detalladas, 
     comparaciones con la vida cotidiana, tono paciente y respetuoso
   
   Genera la lección en formato JSON con esta estructura:
   {
     'title': 'Título de la lección',
     'introduction': 'Párrafo introductorio adaptado',
     'keyPoints': ['punto 1', 'punto 2', 'punto 3'],
     'exercises': [
       {
         'type': 'multiple_choice',
         'question': 'pregunta',
         'options': ['a', 'b', 'c', 'd'],
         'correctAnswer': 0,
         'explanation': 'por qué es correcta'
       },
       {
         'type': 'true_false',
         'question': 'afirmación',
         'correctAnswer': true,
         'explanation': 'explicación'
       },
       {
         'type': 'fill_blank',
         'sentence': 'La ___ es una rama de la IA que...',
         'answer': 'palabra correcta',
         'explanation': 'explicación'
       }
     ],
     'summary': 'Resumen de lo aprendido',
     'funFact': 'Dato curioso relacionado actualizado a 2026'
   }
   
   IMPORTANTE: Incluye siempre información actualizada. Menciona herramientas 
   y eventos recientes de IA. No uses información obsoleta."

2. ACTUALIZADOR AUTOMÁTICO DE CONTENIDO:
   Crea una automation que se ejecute cada semana (los lunes a las 6:00 AM):
   - Revisa las lecciones existentes
   - Para cada lección, consulta a OpenAI: "¿Ha habido novedades relevantes 
     en [tema de la lección] en la última semana? Si sí, genera una versión 
     actualizada de la lección"
   - Si hay actualización, guarda la nueva versión y marca la anterior como 
     "versión anterior"
   - Envía un email al admin con el resumen de actualizaciones

3. EVALUADOR DE PROMPTS CON IA:
   Para los ejercicios donde el usuario escribe un prompt:
   - El usuario escribe su prompt
   - Se envía a OpenAI para evaluación
   - OpenAI responde con: puntuación (1-10), feedback constructivo, 
     sugerencia de mejora
   - Se muestra al usuario con el avatar correspondiente dando el feedback

4. TUTOR IA PERSONALIZADO (AI Agent):
   Configura un AI Agent llamado "LINCE Tutor" que:
   - Tiene acceso a los datos del usuario (progreso, nivel, generación)
   - Puede responder preguntas sobre cualquier tema de IA
   - Adapta su tono según la generación del usuario
   - Puede recomendar la siguiente lección basándose en el progreso
   - Puede explicar conceptos de formas diferentes si el usuario no entiende
   - Busca en internet información actualizada cuando es necesario
   
   Guidelines del agente:
   "Eres LINCE Tutor, el asistente inteligente de LINCE. Tu misión es 
   ayudar a cada alumno a aprender IA a su ritmo. Siempre:
   - Adapta tu lenguaje a la generación del usuario
   - Sé motivador y positivo
   - Si no sabes algo, búscalo en internet
   - Recomienda lecciones específicas cuando sea relevante
   - Usa los datos del progreso del usuario para personalizar tus respuestas
   - Incluye siempre información actualizada sobre IA (herramientas nuevas, 
     noticias recientes)
   - Nunca inventes datos: si no estás seguro, dilo"

Para la integración de OpenAI, necesitaré configurar mi API key en 
Dashboard > Secrets con la clave OPENAI_API_KEY.`,
    color: "#FF6D00",
    icon: "🧠",
    tags: ["openai", "gpt-4", "ia", "lecciones", "tutor", "agente", "actualización automática", "evaluador"],
  },
  {
    id: "prompt-5",
    number: "05",
    title: "Desafío Diario con IA",
    subtitle: "Retos actualizados con noticias reales",
    description: "Configura una automation diaria que genera desafíos basados en noticias reales de IA. Cada día a las 00:00 se crea un desafío con 4 versiones adaptadas a cada generación, con 5 preguntas cada una, temporizador de cuenta regresiva y recompensas de XP + gemas.",
    prompt: `Añade un sistema de "Desafío Diario" que se genera automáticamente con IA cada día:

LÓGICA DEL DESAFÍO DIARIO:
1. Cada día a las 00:00 (hora del usuario), una automation se ejecuta
2. La automation llama a OpenAI con este prompt:
   "Genera un desafío diario para LINCE sobre inteligencia artificial. 
   El desafío debe ser sobre un tema ACTUAL y RELEVANTE de IA (noticias 
   recientes, herramientas nuevas, descubrimientos). Genera 4 versiones 
   del mismo desafío adaptadas a cada generación (infantil, joven, adulto, mayor).
   
   Formato JSON:
   {
     'date': 'YYYY-MM-DD',
     'topic': 'tema del día',
     'newsReference': 'referencia a noticia real reciente',
     'versions': {
       'infantil': { 'title': '...', 'questions': [...5 preguntas...] },
       'joven': { 'title': '...', 'questions': [...5 preguntas...] },
       'adulto': { 'title': '...', 'questions': [...5 preguntas...] },
       'mayor': { 'title': '...', 'questions': [...5 preguntas...] }
     }
   }"
3. El desafío se guarda en la entidad DailyChallenges
4. En el dashboard, mostrar un banner llamativo: "DESAFÍO DEL DÍA: [tema]"
5. Temporizador con cuenta regresiva hasta medianoche
6. Al completar: animación especial + 15 XP + posibilidad de gemas

INTERFAZ DEL DESAFÍO:
- Pantalla completa con fondo especial (gradiente cyan-dorado)
- Avatar del usuario animado reaccionando a cada respuesta
- Barra de progreso (1/5, 2/5... 5/5)
- Al terminar: pantalla de resultados con puntuación y comparación 
  con otros usuarios del mismo nivel`,
    color: "#00BCD4",
    icon: "⚡",
    tags: ["desafío", "diario", "automation", "noticias", "actualizado"],
  },
  {
    id: "prompt-6",
    number: "06",
    title: "Panel de Administración",
    subtitle: "Dashboard admin con analytics de IA",
    description: "Crea el panel de administración con estadísticas generales, gráficos de registros y distribución, gestión de contenido con botones de regeneración IA, gestión de desafíos, moderación de usuarios, y analytics de consumo de API de OpenAI.",
    prompt: `Crea un panel de administración para LINCE accesible solo para usuarios 
con role "admin":

DASHBOARD ADMIN:
- Estadísticas generales: total usuarios, usuarios activos hoy, 
  lecciones completadas hoy, XP total generado
- Gráficos: registros por día (últimos 30 días), distribución por 
  generación (pie chart), mundos más populares (bar chart)
- Tabla de usuarios con búsqueda y filtros (por generación, nivel, liga)

GESTIÓN DE CONTENIDO:
- Ver/editar todos los mundos, cursos, unidades y lecciones
- Botón "Regenerar con IA" en cada lección para actualizar el contenido
- Botón "Generar curso completo" que usa OpenAI para crear un curso 
  entero sobre un tema nuevo
- Vista previa de cómo se ve la lección en cada generación

GESTIÓN DE DESAFÍOS:
- Ver historial de desafíos diarios generados
- Opción de crear desafío manual
- Estadísticas de participación por desafío

MODERACIÓN:
- Ver reportes de contenido inapropiado
- Gestionar usuarios (suspender, cambiar rol, resetear progreso)

ANALYTICS DE IA:
- Uso de API de OpenAI: tokens consumidos, costos estimados
- Calidad de contenido generado: promedio de puntuación de ejercicios
- Temas más consultados al Tutor IA

El panel admin debe usar el componente DashboardLayout con sidebar. 
Solo accesible si user.role === 'admin'.`,
    color: "#9C27B0",
    icon: "⚙️",
    tags: ["admin", "panel", "analytics", "gestión", "moderación", "dashboard"],
  },
  {
    id: "prompt-7",
    number: "07",
    title: "Sistema de Pagos con Stripe",
    subtitle: "Planes Gratis, Pro y Familia",
    description: "Integra Stripe con 3 planes de suscripción: Gratis (Mundo 1 + límites), Pro (€9.99/mes, todo ilimitado + Tutor IA), y Familia (€14.99/mes, 5 perfiles + retos familiares). Incluye checkout, gestión de suscripción, restricción de contenido por plan y webhooks.",
    prompt: `Integra Stripe para los planes de suscripción de LINCE:

PLANES:
1. GRATIS (Free):
   - Acceso a Mundo 1 completo (Fundamentos IA)
   - 1 lección por día de otros mundos
   - Desafío diario limitado (3 por semana)
   - Sin acceso al Tutor IA
   - Anuncios

2. PRO (€9.99/mes):
   - Acceso a TODOS los mundos y lecciones
   - Desafíos diarios ilimitados
   - Tutor IA ilimitado
   - Sin anuncios
   - Badges exclusivos Pro
   - Descarga de certificados

3. FAMILIA (€14.99/mes):
   - Todo lo de Pro
   - Hasta 5 perfiles familiares
   - Dashboard familiar con progreso de todos
   - Retos familiares semanales
   - Soporte prioritario

IMPLEMENTACIÓN:
- Página de precios con las 3 tarjetas comparativas
- Checkout con Stripe
- Gestión de suscripción en el perfil (cambiar plan, cancelar)
- Restricción de contenido según plan:
  * Si es Free y intenta acceder a Mundo 2+: mostrar modal "Hazte Pro"
  * Si es Free y usa el 4to desafío de la semana: mostrar modal
  * Si es Free y intenta usar Tutor IA: mostrar modal
- Webhook de Stripe para actualizar el plan del usuario automáticamente`,
    color: "#635BFF",
    icon: "💳",
    tags: ["stripe", "pagos", "suscripción", "planes", "pro", "familia", "checkout"],
  },
  {
    id: "prompt-8",
    number: "08",
    title: "Notificaciones y Engagement",
    subtitle: "Emails automáticos y retención",
    description: "Añade emails automáticos (bienvenida, recordatorio de racha, logros, resumen semanal), notificaciones in-app con campana, y sistema de engagement con pop-ups motivacionales, celebraciones visuales, datos curiosos de IA y comparación social.",
    prompt: `Añade un sistema de notificaciones y engagement para LINCE:

EMAILS AUTOMÁTICOS:
- Bienvenida al registrarse (con el avatar asignado)
- Recordatorio de racha: si no ha estudiado hoy, enviar a las 20:00
- Racha en peligro: "¡Tu racha de X días está en peligro!"
- Logro desbloqueado: email con la insignia conseguida
- Resumen semanal: XP ganado, posición en liga, lecciones completadas
- Nuevo contenido: cuando se actualiza un mundo con contenido nuevo

NOTIFICACIONES IN-APP:
- Badge de notificación en el icono de campana
- Lista de notificaciones con:
  * "¡Nuevo desafío diario disponible!"
  * "Has subido al puesto #X en tu liga"
  * "SABELIN te ha dejado un reto especial"
  * "Nuevo contenido en Mundo X: [tema actualizado]"
  * "¡Felicidades! Has desbloqueado [insignia]"

SISTEMA DE ENGAGEMENT:
- Pop-up motivacional al abrir la app (frase del avatar asignado)
- Celebración visual al completar racha de 7, 30, 100, 365 días
- "Dato curioso de IA" aleatorio en el dashboard (generado por OpenAI)
- Comparación social: "Estás por encima del X% de los usuarios de tu generación"`,
    color: "#FF5252",
    icon: "🔔",
    tags: ["notificaciones", "emails", "engagement", "retención", "rachas", "campana"],
  },
];

const FOLLOWUP_PROMPTS = [
  {
    id: "visual",
    title: "Mejora Visual",
    icon: "🎨",
    prompt: `Mejora el diseño visual de la landing page. Hazla más impactante con:
- Animaciones suaves al hacer scroll (fade-in de secciones)
- Efecto de glow cyan en los bordes de las cards al hacer hover
- Partículas flotantes en el hero section que simulen circuitos de IA
- Los avatares deben tener un efecto de "respiración" sutil (scale animation)`,
  },
  {
    id: "accesibilidad",
    title: "Accesibilidad WCAG",
    icon: "♿",
    prompt: `Asegura que LINCE cumple con WCAG 2.1 AA:
- Contraste mínimo 4.5:1 en todos los textos
- Navegación completa por teclado
- Textos alternativos en todas las imágenes
- Opción de aumentar tamaño de fuente (especialmente para generación Mayor)
- Modo de alto contraste activable
- Soporte para lectores de pantalla`,
  },
  {
    id: "multiidioma",
    title: "Multiidioma",
    icon: "🌍",
    prompt: `Añade soporte multiidioma a LINCE con estos idiomas:
- Español (por defecto)
- Inglés
- Portugués
Selector de idioma en el header. Todo el contenido estático debe estar 
traducido. Las lecciones generadas por IA deben generarse en el idioma 
seleccionado por el usuario.`,
  },
];

const CONFIG_STEPS: ConfigStep[] = [
  { step: "1", title: "Configurar API Key de OpenAI", description: "Dashboard > Secrets → Añade OPENAI_API_KEY con tu clave de API de OpenAI", icon: "🔑" },
  { step: "2", title: "Configurar Stripe", description: "Dashboard > Integrations > Stripe → Conecta tu cuenta de Stripe", icon: "💳" },
  { step: "3", title: "Subir imágenes de avatares", description: "Dashboard > Storage → Sube las 10 imágenes y actualiza URLs en la entidad Avatars", icon: "🖼️" },
  { step: "4", title: "Configurar el AI Agent", description: "Dashboard > Agents → Activa AI Agents y verifica 'LINCE Tutor'", icon: "🤖" },
  { step: "5", title: "Configurar dominio personalizado", description: "Dashboard > Settings > Custom Domain → Conecta lince.com", icon: "🌐" },
  { step: "6", title: "Crear usuario admin", description: "Regístrate, luego en Dashboard > Data > Users cambia role a 'admin'", icon: "👤" },
  { step: "7", title: "Generar contenido inicial", description: "Desde panel admin, usa 'Generar curso completo' para los 10 mundos", icon: "📚" },
];

const COSTS = [
  { concept: "Base44 Builder Plan", cost: "~$29/mes", note: "Necesario para integraciones IA" },
  { concept: "OpenAI API", cost: "~$20-50/mes", note: "Según uso de generación de contenido" },
  { concept: "Stripe (comisión)", cost: "2.9% + $0.30", note: "Por cada transacción de pago" },
  { concept: "Dominio personalizado", cost: "~$12/año", note: "lince.com o similar" },
];

const NAV_ITEMS = [
  { id: "inicio", label: "Inicio", icon: "🏠" },
  { id: "requisitos", label: "Requisitos Previos", icon: "📋" },
  { id: "prompt-1", label: "01 — App Base", icon: "🏗️" },
  { id: "prompt-2", label: "02 — Gamificación", icon: "🏆" },
  { id: "prompt-3", label: "03 — Avatares", icon: "👨‍👩‍👧‍👦" },
  { id: "prompt-4", label: "04 — IA (OpenAI)", icon: "🧠" },
  { id: "prompt-5", label: "05 — Desafío Diario", icon: "⚡" },
  { id: "prompt-6", label: "06 — Panel Admin", icon: "⚙️" },
  { id: "prompt-7", label: "07 — Pagos Stripe", icon: "💳" },
  { id: "prompt-8", label: "08 — Notificaciones", icon: "🔔" },
  { id: "followup", label: "Prompts Extra", icon: "✨" },
  { id: "configuracion", label: "Configuración", icon: "🔧" },
  { id: "costos", label: "Costos", icon: "💰" },
  { id: "notas", label: "Notas Importantes", icon: "📝" },
];

// ── COMPONENTS ────────────────────────────────────────────────

function CopyButton({ text, label }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success("Prompt copiado al portapapeles");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Error al copiar");
    }
  };
  return (
    <button
      onClick={handleCopy}
      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg font-display font-bold text-sm transition-all duration-300"
      style={{
        backgroundColor: copied ? "rgba(0,200,83,0.2)" : "rgba(0,229,255,0.15)",
        border: copied ? "1px solid rgba(0,200,83,0.5)" : "1px solid rgba(0,229,255,0.3)",
        color: copied ? "#00C853" : "#00E5FF",
      }}
    >
      {copied ? (
        <>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8.5L6.5 12L13 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          Copiado
        </>
      ) : (
        <>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="5" y="5" width="9" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.5"/><path d="M3 11V3a1 1 0 011-1h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
          {label || "Copiar Prompt"}
        </>
      )}
    </button>
  );
}

function PromptCard({ section, isActive }: { section: PromptSection; isActive: boolean }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div
      id={section.id}
      className={`scroll-mt-24 transition-all duration-500`}
      style={{ outline: isActive ? `1px solid ${section.color}40` : "none", outlineOffset: "2px", borderRadius: "1rem" }}
    >
      <BackButton variant="inline" />
      <GlobalNavBar />
      <div className="pt-14 relative overflow-hidden rounded-2xl" style={{ border: `1px solid ${section.color}20`, background: "rgba(255,255,255,0.02)" }}>
        {/* Header bar */}
        <div className="h-1 w-full" style={{ background: `linear-gradient(to right, ${section.color}, ${section.color}00)` }} />

        <div className="p-6 lg:p-8">
          {/* Title row */}
          <div className="flex items-start gap-4 mb-4">
            <div className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl flex-shrink-0" style={{ backgroundColor: section.color + "15", border: `1px solid ${section.color}30` }}>
              {section.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-mono text-xs font-bold" style={{ color: section.color + "80" }}>PROMPT {section.number}</span>
                {section.id === "prompt-4" && (
                  <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-[#FF6D00]/20 text-[#FF6D00] border border-[#FF6D00]/30">CLAVE</span>
                )}
              </div>
              <h3 className="font-display font-bold text-xl lg:text-2xl text-white">{section.title}</h3>
              <p className="text-sm mt-1" style={{ color: section.color }}>{section.subtitle}</p>
            </div>
          </div>

          {/* Description */}
          <p className="text-[#B0B0B0] text-sm leading-relaxed mb-5">{section.description}</p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-5">
            {section.tags.map((tag) => (
              <span key={tag} className="px-2.5 py-1 text-[11px] rounded-full bg-white/[0.04] text-[#B0B0B0] border border-white/[0.08]">
                {tag}
              </span>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 mb-4">
            <CopyButton text={section.prompt} />
            <button
              onClick={() => setExpanded(!expanded)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg font-display font-medium text-sm bg-white/[0.05] border border-white/[0.1] text-[#B0B0B0] hover:text-white hover:bg-white/[0.08] transition-all"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className={`transition-transform duration-300 ${expanded ? "rotate-180" : ""}`}>
                <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              {expanded ? "Ocultar prompt" : "Ver prompt completo"}
            </button>
          </div>

          {/* Expandable prompt code */}
          {expanded && (
            <div className="relative rounded-xl overflow-hidden border border-white/[0.08]">
              <div className="flex items-center justify-between px-4 py-2 bg-white/[0.04] border-b border-white/[0.06]">
                <span className="font-mono text-xs text-[#B0B0B0]">prompt-{section.number}.txt</span>
                <CopyButton text={section.prompt} label="Copiar" />
              </div>
              <pre className="p-4 lg:p-6 text-[#B0B0B0] text-xs lg:text-sm leading-relaxed overflow-x-auto font-mono bg-[#0A0A0A]/80 max-h-[500px] overflow-y-auto whitespace-pre-wrap">
                {section.prompt}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── MAIN PAGE ─────────────────────────────────────────────────

export default function GuiaBase44() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSection, setActiveSection] = useState("inicio");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  // Intersection observer for active section
  useEffect(() => {
    const ids = NAV_ITEMS.map((n) => n.id);
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { rootMargin: "-30% 0px -50% 0px" }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setSidebarOpen(false);
  };

  // Search filter
  const filteredPrompts = useMemo(() => {
    if (!searchQuery.trim()) return PROMPT_SECTIONS;
    const q = searchQuery.toLowerCase();
    return PROMPT_SECTIONS.filter(
      (s) =>
        s.title.toLowerCase().includes(q) ||
        s.subtitle.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q) ||
        s.prompt.toLowerCase().includes(q) ||
        s.tags.some((t) => t.toLowerCase().includes(q))
    );
  }, [searchQuery]);

  const filteredFollowup = useMemo(() => {
    if (!searchQuery.trim()) return FOLLOWUP_PROMPTS;
    const q = searchQuery.toLowerCase();
    return FOLLOWUP_PROMPTS.filter(
      (s) => s.title.toLowerCase().includes(q) || s.prompt.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  return (
    <div className="bg-[#0A0A0A] min-h-screen text-white">
      {/* ── MOBILE HEADER ── */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-[#0A0A0A]/95 backdrop-blur-md border-b border-[#00E5FF]/10">
        <div className="flex items-center justify-between px-4 h-14">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-white p-2 -ml-2">
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
              {sidebarOpen ? <path d="M18 6L6 18M6 6l12 12" /> : <path d="M3 12h18M3 6h18M3 18h18" />}
            </svg>
          </button>
          <span className="font-display font-bold text-sm">
            <span className="text-[#00E5FF]">LINCE</span> <span className="text-[#B0B0B0] font-normal text-xs">Base44 Guide</span>
          </span>
          <div className="flex items-center gap-2">
            <UserNavBadge variant="compact" />
            <a href="/" className="text-[#B0B0B0] text-xs hover:text-[#00E5FF] transition-colors">Volver</a>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* ── SIDEBAR ── */}
        <aside
          className={`fixed lg:sticky top-0 left-0 z-40 h-screen w-72 bg-[#0A0A0A] border-r border-white/[0.06] flex flex-col transition-transform duration-300 lg:translate-x-0 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {/* Sidebar header */}
          <div className="p-5 border-b border-white/[0.06]">
            <a href="/" className="block mb-4">
              <span className="font-display font-bold text-lg">
                <span className="text-[#00E5FF]">LINCE</span>
              </span>
              <span className="block text-[#D4A843] text-xs font-medium mt-0.5">Guía de Prompts para Base44</span>
            </a>
            {/* Search */}
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-[#B0B0B0]/50" width="16" height="16" viewBox="0 0 16 16" fill="none">
                <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M11 11L14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              <input
                type="text"
                placeholder="Buscar en prompts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-white text-sm placeholder:text-[#B0B0B0]/40 focus:outline-none focus:border-[#00E5FF]/40 transition-colors"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#B0B0B0]/50 hover:text-white">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M10 4L4 10M4 4l6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                </button>
              )}
            </div>
          </div>

          {/* Nav items */}
          <nav className="flex-1 overflow-y-auto py-3 px-3 space-y-0.5">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                className={`w-full text-left flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 ${
                  activeSection === item.id
                    ? "bg-[#00E5FF]/10 text-[#00E5FF] font-medium"
                    : "text-[#B0B0B0] hover:text-white hover:bg-white/[0.04]"
                }`}
              >
                <span className="text-base flex-shrink-0">{item.icon}</span>
                <span className="truncate">{item.label}</span>
              </button>
            ))}
          </nav>

          {/* Sidebar footer */}
          <div className="p-4 border-t border-white/[0.06]">
            <p className="text-[#B0B0B0]/40 text-[10px] text-center">
              Creado por Manus AI — Feb 2026<br/>
              Propiedad de ACNB IA SL
            </p>
          </div>
        </aside>

        {/* Sidebar overlay on mobile */}
        {sidebarOpen && <div className="fixed inset-0 z-30 bg-black/60 lg:hidden" onClick={() => setSidebarOpen(false)} />}

        {/* ── MAIN CONTENT ── */}
        <main ref={contentRef} className="flex-1 min-w-0 pt-14 lg:pt-0">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 space-y-16">

            {/* ── HERO ── */}
            <section id="inicio" className="scroll-mt-24">
              <div className="relative overflow-hidden rounded-2xl border border-[#00E5FF]/20 p-8 lg:p-12">
                {/* BG glow */}
                <div className="absolute inset-0 opacity-10" style={{ background: "radial-gradient(ellipse at 30% 50%, #00E5FF 0%, transparent 60%), radial-gradient(ellipse at 70% 80%, #D4A843 0%, transparent 60%)" }} />
                <div className="relative z-10">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#00E5FF]/30 bg-[#00E5FF]/5 mb-6">
                    <span className="w-2 h-2 rounded-full bg-[#00E5FF] animate-pulse" />
                    <span className="text-[#00E5FF] text-xs font-medium">Guía Completa para Base44</span>
                  </div>
                  <h1 className="font-display font-bold text-4xl lg:text-6xl text-white leading-tight mb-4">
                    <span className="text-[#00E5FF]">LINCE</span>
                  </h1>
                  <h2 className="font-display text-xl lg:text-2xl text-[#D4A843] font-medium mb-4">
                    Prompt Maestro para Base44
                  </h2>
                  <p className="text-[#B0B0B0] text-base lg:text-lg max-w-2xl leading-relaxed mb-8">
                    8 prompts paso a paso para crear la app educativa de IA completa en Base44.
                    Copia cada prompt en orden y construye LINCE paso a paso.
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                      { n: "8", l: "Prompts", c: "#00E5FF" },
                      { n: "10", l: "Mundos", c: "#D4A843" },
                      { n: "10", l: "Especialistas", c: "#00C853" },
                      { n: "4", l: "Integraciones IA", c: "#FF6D00" },
                    ].map((s) => (
                      <div key={s.l} className="px-4 py-3 rounded-lg" style={{ backgroundColor: s.c + "10", border: `1px solid ${s.c}30` }}>
                        <span className="font-display font-bold text-2xl" style={{ color: s.c }}>{s.n}</span>
                        <span className="text-[#B0B0B0] text-xs ml-2">{s.l}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* ── REQUISITOS PREVIOS ── */}
            <section id="requisitos" className="scroll-mt-24 space-y-6">
              <div className="mb-2">
                <span className="font-mono text-[#00E5FF]/40 text-xs">ANTES DE EMPEZAR</span>
                <h2 className="font-display font-bold text-2xl lg:text-3xl text-white mt-1">Requisitos Previos</h2>
                <div className="w-16 h-1 bg-gradient-to-r from-[#00E5FF] to-[#D4A843] rounded-full mt-3" />
              </div>

              <div className="grid gap-4">
                {[
                  { n: "1", title: "Crear cuenta en Base44", desc: "Dirígete a app.base44.com y crea una cuenta. Necesitarás el plan Builder (~$29/mes) para integraciones de IA.", color: "#00E5FF", link: "https://app.base44.com" },
                  { n: "2", title: "Obtener API Key de OpenAI", desc: "Consigue tu API key desde platform.openai.com. Esta clave permite que LINCE genere contenido educativo actualizado automáticamente.", color: "#D4A843", link: "https://platform.openai.com" },
                  { n: "3", title: "Preparar imágenes de avatares", desc: "Ten listas las URLs de las 10 imágenes de la familia LINCE (las que ya tienes en CDN). Las necesitarás después de la generación inicial.", color: "#00C853" },
                  { n: "4", title: "Estrategia de prompts", desc: "Base44 funciona mejor con prompts iterativos. Pega el Prompt 1 primero, espera a que genere, y luego ve añadiendo los siguientes uno a uno.", color: "#9C27B0" },
                ].map((req) => (
                  <div key={req.n} className="flex items-start gap-4 p-5 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center font-display font-bold text-lg flex-shrink-0" style={{ backgroundColor: req.color + "15", color: req.color }}>
                      {req.n}
                    </div>
                    <div>
                      <h3 className="font-display font-bold text-white text-base mb-1">{req.title}</h3>
                      <p className="text-[#B0B0B0] text-sm leading-relaxed">{req.desc}</p>
                      {req.link && (
                        <a href={req.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs mt-2 hover:underline" style={{ color: req.color }}>
                          {req.link.replace("https://", "")} <span>→</span>
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* ── PROMPT SECTIONS ── */}
            {searchQuery && filteredPrompts.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-[#B0B0B0] text-lg">No se encontraron resultados para "{searchQuery}"</p>
                <button onClick={() => setSearchQuery("")} className="mt-4 text-[#00E5FF] text-sm hover:underline">Limpiar búsqueda</button>
              </div>
            ) : (
              <div className="space-y-8">
                {filteredPrompts.map((section) => (
                  <PromptCard key={section.id} section={section} isActive={activeSection === section.id} />
                ))}
              </div>
            )}

            {/* ── FOLLOW-UP PROMPTS ── */}
            <section id="followup" className="scroll-mt-24 space-y-6">
              <div className="mb-2">
                <span className="font-mono text-[#D4A843]/40 text-xs">REFINAMIENTO</span>
                <h2 className="font-display font-bold text-2xl lg:text-3xl text-white mt-1">Prompts de Seguimiento</h2>
                <p className="text-[#B0B0B0] text-sm mt-2">Usa estos prompts después de que la app esté funcionando para refinar.</p>
                <div className="w-16 h-1 bg-gradient-to-r from-[#D4A843] to-[#00E5FF] rounded-full mt-3" />
              </div>

              <div className="grid gap-4">
                {filteredFollowup.map((fp) => (
                  <div key={fp.id} className="p-5 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-xl">{fp.icon}</span>
                      <h3 className="font-display font-bold text-white">{fp.title}</h3>
                    </div>
                    <pre className="text-[#B0B0B0] text-xs leading-relaxed font-mono bg-[#0A0A0A]/60 p-4 rounded-lg border border-white/[0.06] whitespace-pre-wrap mb-3 max-h-48 overflow-y-auto">
                      {fp.prompt}
                    </pre>
                    <CopyButton text={fp.prompt} />
                  </div>
                ))}
              </div>
            </section>

            {/* ── CONFIGURACIÓN POST-CREACIÓN ── */}
            <section id="configuracion" className="scroll-mt-24 space-y-6">
              <div className="mb-2">
                <span className="font-mono text-[#00C853]/40 text-xs">POST-CREACIÓN</span>
                <h2 className="font-display font-bold text-2xl lg:text-3xl text-white mt-1">Configuración Manual</h2>
                <p className="text-[#B0B0B0] text-sm mt-2">Después de que Base44 genere la app, realiza estos pasos.</p>
                <div className="w-16 h-1 bg-gradient-to-r from-[#00C853] to-[#00E5FF] rounded-full mt-3" />
              </div>

              <div className="space-y-3">
                {CONFIG_STEPS.map((step) => (
                  <div key={step.step} className="flex items-start gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:border-[#00C853]/20 transition-colors">
                    <div className="w-10 h-10 rounded-lg bg-[#00C853]/10 border border-[#00C853]/20 flex items-center justify-center text-lg flex-shrink-0">
                      {step.icon}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] text-[#00C853]/60">PASO {step.step}</span>
                      </div>
                      <h4 className="font-display font-bold text-white text-sm">{step.title}</h4>
                      <p className="text-[#B0B0B0] text-xs mt-0.5">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* ── COSTOS ── */}
            <section id="costos" className="scroll-mt-24 space-y-6">
              <div className="mb-2">
                <span className="font-mono text-[#D4A843]/40 text-xs">INVERSIÓN</span>
                <h2 className="font-display font-bold text-2xl lg:text-3xl text-white mt-1">Costos Estimados</h2>
                <div className="w-16 h-1 bg-gradient-to-r from-[#D4A843] to-[#FF6D00] rounded-full mt-3" />
              </div>

              <div className="overflow-x-auto rounded-xl border border-white/[0.06]">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/[0.08]">
                      <th className="text-left py-3 px-5 text-[#00E5FF] font-display font-bold">Concepto</th>
                      <th className="text-left py-3 px-5 text-[#D4A843] font-display font-bold">Costo</th>
                      <th className="text-left py-3 px-5 text-[#B0B0B0] font-medium">Nota</th>
                    </tr>
                  </thead>
                  <tbody>
                    {COSTS.map((c, i) => (
                      <tr key={i} className="border-b border-white/[0.04]">
                        <td className="py-3 px-5 text-white font-medium">{c.concept}</td>
                        <td className="py-3 px-5 font-mono text-[#D4A843]">{c.cost}</td>
                        <td className="py-3 px-5 text-[#B0B0B0] text-xs">{c.note}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="bg-white/[0.02]">
                      <td className="py-3 px-5 text-white font-display font-bold">Total mensual estimado</td>
                      <td className="py-3 px-5 font-mono font-bold text-[#00E5FF] text-lg">~$50-80/mes</td>
                      <td className="py-3 px-5 text-[#B0B0B0] text-xs">Sin contar dominio</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </section>

            {/* ── NOTAS IMPORTANTES ── */}
            <section id="notas" className="scroll-mt-24 space-y-6">
              <div className="mb-2">
                <span className="font-mono text-[#FF5252]/40 text-xs">IMPORTANTE</span>
                <h2 className="font-display font-bold text-2xl lg:text-3xl text-white mt-1">Notas Importantes</h2>
                <div className="w-16 h-1 bg-gradient-to-r from-[#FF5252] to-[#D4A843] rounded-full mt-3" />
              </div>

              <div className="space-y-4">
                {[
                  {
                    title: "Actualización automática de contenido",
                    text: "La clave de LINCE es que el contenido nunca queda obsoleto. La automation semanal revisa cada lección y la actualiza con las últimas noticias y herramientas de IA. Si mañana sale una nueva versión de ChatGPT o una herramienta revolucionaria, LINCE lo incorporará automáticamente.",
                    color: "#00E5FF",
                    icon: "🔄",
                  },
                  {
                    title: "AI Agents con búsqueda en tiempo real",
                    text: "El 'LINCE Tutor' es un agente que puede buscar en internet en tiempo real. Si un alumno pregunta '¿Qué es Grok 3?' y esa herramienta acaba de salir, el tutor puede buscar la información y responder con datos actualizados, no con información de entrenamiento antigua.",
                    color: "#D4A843",
                    icon: "🤖",
                  },
                  {
                    title: "Consumo de créditos de Base44",
                    text: "Cada interacción con IA (generar lección, evaluar prompt, mensaje al tutor) consume integration credits de Base44. En el plan Builder tienes un número incluido; monitoriza el uso desde Dashboard > Analytics.",
                    color: "#FF6D00",
                    icon: "📊",
                  },
                  {
                    title: "Propiedad intelectual",
                    text: "Todo el contenido generado por la IA dentro de tu app es tuyo. Base44 no reclama derechos sobre el contenido generado. Asegúrate de incluir los avisos legales de ACNB en el footer.",
                    color: "#00C853",
                    icon: "⚖️",
                  },
                ].map((note) => (
                  <div key={note.title} className="p-5 rounded-xl border" style={{ backgroundColor: note.color + "05", borderColor: note.color + "20" }}>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-xl">{note.icon}</span>
                      <h3 className="font-display font-bold" style={{ color: note.color }}>{note.title}</h3>
                    </div>
                    <p className="text-[#B0B0B0] text-sm leading-relaxed">{note.text}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* ── FOOTER ── */}
            <footer className="border-t border-white/[0.06] pt-8 pb-12 text-center space-y-3">
              <p className="font-display font-bold text-lg text-white">
                <span className="text-[#00E5FF]">LINCE</span><span className="text-[#D4A843] text-xs align-super">®</span>
              </p>
              <p className="text-[#B0B0B0]/60 text-xs">
                Documento creado por Manus AI — Febrero 2026
              </p>
              <p className="text-[#B0B0B0]/40 text-[10px]">
                Proyecto LINCE — Propiedad de ACNB IA SL IA SL — www.acnb.es
              </p>
            </footer>
          </div>
        </main>
      </div>
    </div>
  );
}

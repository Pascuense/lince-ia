import { tl, type PRDLanguage} from "@/contexts/PRDLanguageContext";
import { useEffect } from "react";
import type { CharacterData } from "@/lib/avatarConstants";
import { getAvatarImage } from "@/lib/avatarConstants";
import { SocialShareBar } from "@/components/SocialShareBar";

interface AvatarStoryModalProps {
  character: CharacterData;
  lang: string;
  onClose: () => void;
}

const ORIGIN_STORIES: Record<string, Record<string, string>> = {
  YAYALIN: {
    es: "YAYALIN era un empresario de Zaragoza que vendia aceitunas en el mercado central. Un dia, un algoritmo de IA le sugirio cambiar su estrategia de ventas y triplico sus ganancias en una semana. Desde entonces, no suelta el portatil. 'Si la IA puede vender aceitunas, puede cambiar el mundo', dice mientras programa su proximo modelo de negocio. Ahora dirige toda la familia LINCE y su mision es democratizar la IA para todos.",
    en: "YAYALIN was a Zaragoza businessman selling olives at the central market. One day, an AI algorithm suggested he change his sales strategy and he tripled his profits in a week. Since then, he hasn't let go of his laptop. 'If AI can sell olives, it can change the world.'",
  },
  YAYALINA: {
    es: "La abuela MAMALINA tenia 72 anios cuando su nieto le mostro ChatGPT. 'Esto puede escribir recetas?', pregunto. Tres meses despues, habia creado un blog de cocina aragonesa con IA que tiene 50.000 seguidores. 'Mijo, la IA es como el azafran: un poquito cambia todo el plato'. Ahora ensenia a otros mayores que nunca es tarde para aprender tecnologia.",
    en: "Grandma MAMALINA was 72 when her grandson showed her ChatGPT. 'Can this write recipes?' she asked. Three months later, she had created an AI-powered Aragonese cooking blog with 50,000 followers.",
  },
  PAPALIN: {
    es: "PAPALÍN siempre fue el nerd de la familia. Mientras sus hermanos jugaban futbol, el desarmaba calculadoras. En la universidad descubrio el machine learning y fue amor a primera vista. Ahora es profesor y su frase favorita es: 'Los datos no mienten, pero hay que saber preguntarles'. Tiene un poster de Alan Turing en su habitacion.",
    en: "PAPALÍN was always the family nerd. While his siblings played football, he was taking apart calculators. At university he discovered machine learning and it was love at first sight.",
  },
  MAMALINA: {
    es: "MAMALINA era la rebelde de la familia. Estudio filosofia y todos pensaron que 'nunca haria nada practico'. Pero cuando descubrio que la IA necesitaba etica urgentemente, encontro su proposito. 'Alguien tiene que asegurarse de que las maquinas no se vuelvan locas', dice con una sonrisa. Ahora investiga sesgos algoritmicos.",
    en: "MAMALINA was the family rebel. She studied philosophy and everyone thought she'd 'never do anything practical.' But when she discovered AI urgently needed ethics, she found her purpose.",
  },
  CHAVALIN: {
    es: "CHAVALÍN solo queria ser gamer profesional. Jugaba 8 horas al dia y su padre le decia 'eso no es un trabajo'. Hasta que descubrio que los mejores juegos usan IA para crear mundos procedurales, NPCs inteligentes y dificultad adaptativa. Ahora desarrolla IA para videojuegos y le dice a su padre: 'Te dije que los juegos eran el futuro'.",
    en: "CHAVALÍN just wanted to be a pro gamer. He played 8 hours a day and his dad said 'that's not a job.' Until he discovered that the best games use AI for procedural worlds and smart NPCs.",
  },
  CHAVALINA: {
    es: "MAMALINA JR pasaba horas dibujando en su cuaderno. Un dia probo Midjourney y se quedo sin palabras. 'Puedo crear ESTO con solo escribir?' Desde entonces combina su talento artistico con IA generativa. Sus disenios han ganado concursos internacionales y dice: 'La IA no reemplaza al artista, le da superpoderes'.",
    en: "MAMALINA JR spent hours drawing in her notebook. One day she tried Midjourney and was speechless. 'I can create THIS just by typing?' Since then she combines her artistic talent with generative AI.",
  },
  PEQUELIN: {
    es: "PEQUELIN tiene 8 anios y ya le ensenio a su profesor como usar ChatGPT para hacer las clases mas divertidas. 'Profe, si le preguntas a la IA que explique las fracciones con Pokemon, todos entienden', dijo un martes. Ahora es el 'consultor tecnologico' no oficial de su colegio.",
    en: "PEQUELIN is 8 years old and already taught his teacher how to use ChatGPT to make classes more fun. 'Teacher, if you ask AI to explain fractions with Pokemon, everyone understands.'",
  },
  PEQUELINA: {
    es: "PEQUELINA tiene 6 anios y ya programa con Scratch. Cuando le preguntaron que queria ser de mayor, dijo: 'Inventora de robots que ayuden a los animales'. Usa IA para identificar pajaros en el parque y tiene una coleccion de 200 especies fotografiadas. Es la prueba viviente de que la curiosidad no tiene edad.",
    en: "PEQUELINA is 6 years old and already programs with Scratch. When asked what she wants to be when she grows up, she said: 'An inventor of robots that help animals.'",
  },
  ATOLONDRALIN: {
    es: "El tio ATOLONDRALIN trabajaba en seguridad privada hasta que un dia hackearon la empresa donde trabajaba. En vez de frustrarse, se obsesiono con entender como paso. Aprendio ciberseguridad de forma autodidacta, luego descubrio que la IA podia detectar amenazas 1000 veces mas rapido que un humano.",
    en: "Uncle ATOLONDRALIN worked in private security until one day the company he worked for got hacked. Instead of getting frustrated, he became obsessed with understanding how it happened.",
  },
  SABELIN: {
    es: "El primo SABELIN siempre tuvo ideas locas. A los 15 intento crear un dron con piezas de microondas. A los 18 fundo su primera startup (fracaso). A los 22 descubrio la IA y todo cambio. Su tercera startup usa IA para optimizar rutas de delivery y ya tiene inversores. 'Fracasar es el mejor dataset para entrenar tu cerebro'.",
    en: "Cousin SABELIN always had crazy ideas. At 15 he tried to build a drone from microwave parts. At 22 he discovered AI and everything changed. His third startup uses AI to optimize delivery routes.",
  },
  LUMALIN: {
    es: "LUMALIN estaba en el estudio grabando un beat cuando accidentalmente abrio una pestania de ChatGPT que su productor habia dejado abierta. Escribio 'dame una letra de reggaeton sobre la luna' y lo que salio le volo la cabeza. 'Hermano, esto es el futuro', le dijo a LUMALIN. Desde entonces no para de experimentar con IA generativa.",
    en: "LUMALIN was in the studio recording a beat when he accidentally opened a ChatGPT tab his producer had left open. He typed 'give me reggaeton lyrics about the moon' and what came out blew his mind.",
  },
  VOLTZLIN: {
    es: "VOLTZLIN tenia 962 millones de streams pero sentia que algo faltaba. Un dia un fan le mando un video generado con IA de su cancion y quedo impactado. 'Si un fan puede hacer esto, imagina lo que podemos hacer nosotros'. Fundó la Academia LINCE para que cada artista domine la IA.",
    en: "VOLTZLIN had 962 million streams but felt something was missing. One day a fan sent him an AI-generated video of his song and he was stunned.",
  },
  RIMALIN: {
    es: "RIMALIN siempre fue el mas creativo del grupo. Cuando descubrio el prompt engineering, fue como encontrar su superpoder. 'Un buen prompt es como una buena rima: preciso, inesperado y que te deje pensando'. Ahora ensenia a otros artistas a hablar el idioma de la IA.",
    en: "RIMALIN was always the most creative in the group. When he discovered prompt engineering, it was like finding his superpower.",
  },
  CRISTALIN: {
    es: "CRISTALIN odiaba hacer las mismas tareas repetitivas: subir canciones a 15 plataformas, responder los mismos DMs, programar posts. Un dia dijo 'tiene que haber una forma mejor' y descubrio la automatizacion con IA. En una semana automatizo todo su flujo de trabajo.",
    en: "CRISTALIN hated doing the same repetitive tasks. One day he said 'there has to be a better way' and discovered AI automation.",
  },
  SONALIN: {
    es: "SONALIN era DJ antes de ser artista. Sabia leer al publico mejor que nadie. Cuando descubrio que la IA podia analizar datos de audiencia en tiempo real, combino su intuicion con algoritmos. 'Los datos te dicen QUE funciona, pero tu instinto te dice POR QUE'.",
    en: "SONALIN was a DJ before being an artist. When he discovered AI could analyze audience data in real-time, he combined his intuition with algorithms.",
  },
  COREOLIN: {
    es: "COREOLIN siempre tarareo melodias que nadie mas escuchaba. Tenia 500 notas de voz con ideas musicales. Cuando probo Suno AI por primera vez, convirtio una de esas notas en una cancion completa en 3 minutos. Lloro. 'Toda mi vida tuve la musica en la cabeza pero no sabia producir. La IA me dio la herramienta que me faltaba'.",
    en: "COREOLIN always hummed melodies no one else heard. When he first tried Suno AI, he turned one of those voice notes into a complete song in 3 minutes. He cried.",
  },
  MANTRALIN: {
    es: "MANTRALIN era el tipico 'yo no entiendo de computadores'. Hasta que un amigo le mostro como un modelo de ML predijo exactamente cuantos streams tendria su proxima cancion. 'Espera, la maquina SABE cuanta gente va a escuchar mi tema?' Desde ese dia no paro de estudiar.",
    en: "MANTRALIN was the typical 'I don't understand computers' guy. Until a friend showed him how an ML model predicted exactly how many streams his next song would get.",
  },
  BRISLIN: {
    es: "BRISLIN era la unica mujer en un estudio lleno de hombres. En vez de quejarse, uso IA para crear su propio sello discografico virtual. Automatizo la distribucion, el marketing y hasta la contabilidad. 'No necesito que me abran la puerta, tengo IA para construir mi propia casa'.",
    en: "BRISLIN was the only woman in a studio full of men. Instead of complaining, she used AI to create her own virtual record label.",
  },
  BEATLIN: {
    es: "BEATLIN siempre fue diferente. Mientras otros hacian trap generico, el fusionaba sonidos experimentales con visuales psicodelicos. Cuando descubrio el arte generativo con IA, encontro su tribu. 'La IA no crea arte, amplifica tu vision interior'.",
    en: "BEATLIN was always different. When he discovered generative AI art, he found his tribe. 'AI doesn't create art, it amplifies your inner vision.'",
  },
  FLOWALIN: {
    es: "FLOWALIN creció entre dos culturas. Esa dualidad le ensenio algo crucial: la marca personal lo es TODO. Cuando descubrio que la IA podia analizar tendencias de moda, optimizar fotos y crear contenido personalizado, se convirtio en la embajadora perfecta. 'Tu marca es tu moneda. La IA te ayuda a acuniarla'.",
    en: "FLOWALIN grew up between two cultures. When she discovered AI could analyze fashion trends and create personalized content, she became the perfect ambassador.",
  },
  STILIN: {
    es: "STILIN empezo haciendo streams de gaming a los 16 anios con 3 viewers. Uso IA para analizar que horarios, titulos y thumbnails generaban mas clicks. En 6 meses paso a 10.000 viewers. 'La IA es como tener un manager que nunca duerme y siempre tiene datos frescos'.",
    en: "STILIN started gaming streams at 16 with 3 viewers. He used AI to analyze which schedules and thumbnails generated more clicks. In 6 months he went to 10,000 viewers.",
  },
  SIRENLIN: {
    es: "SIRENLIN estaba celebrando que 'Gata Only' llego al #1 de Billboard cuando su manager le dijo: 'Hermano, un bot de IA predijo este hit hace 3 meses'. Eso le cambio la vida. Si la IA podia predecir hits, que mas podia hacer? Ahora estudia algoritmos de viralidad y ensenia a otros artistas como hacer que su contenido explote.",
    en: "SIRENLIN was celebrating 'Gata Only' reaching #1 on Billboard when his manager told him: 'Bro, an AI bot predicted this hit 3 months ago.' That changed his life.",
  },
  ZOTEALIN: {
    es: "ZOTEALIN grababa videos con su telefono en las calles de Renca. Un dia un editor de video le mostro como la IA podia agregar efectos de Hollywood a videos caseros. 'Espera, puedo hacer que mi video de la esquina parezca un videoclip de un artista global?' Sus videos con efectos IA tienen millones de vistas.",
    en: "ZOTEALIN filmed videos with his phone on the streets of Renca. One day a video editor showed him how AI could add Hollywood effects to homemade videos.",
  },
  PULSOLIN: {
    es: "PULSOLIN siempre quiso que sus beats sonaran como los de los productores gringos pero no tenia presupuesto para un estudio profesional. Cuando descubrio herramientas de IA para masterizacion y mezcla, todo cambio. 'Con $0 y una laptop puedes sonar como si hubieras grabado en Miami'.",
    en: "PULSOLIN always wanted his beats to sound like American producers but didn't have budget for a professional studio. When he discovered AI tools for mastering and mixing, everything changed.",
  },
  GRAFALIN: {
    es: "GRAFALIN colaboro con un artista global y aprendio algo crucial: los artistas mas grandes del mundo usan equipos de 20 personas para manejar sus redes sociales. 'Y si la IA pudiera hacer el trabajo de 20 personas?' Empezo a experimentar y descubrio que si.",
    en: "GRAFALIN collaborated with un artista global and learned something crucial: the world's biggest artists use teams of 20 people to manage their social media. 'What if AI could do the work of 20 people?'",
  },
  CRONOSLIN: {
    es: "CRONOSLIN siempre fue artista visual ademas de musico. Pintaba murales, diseniaba portadas, creaba merch. Cuando llego Midjourney, fue como darle un pincel infinito. 'Antes tardaba 3 semanas en una portada. Ahora genero 100 opciones en una hora y elijo la mejor'.",
    en: "CRONOSLIN was always a visual artist as well as a musician. When Midjourney arrived, it was like giving him an infinite paintbrush.",
  },
  GAMELIN: {
    es: "GAMELIN lleva 30 años en el hip-hop. Ha visto nacer y morir mil tendencias. Cuando llego la IA, muchos veteranos dijeron 'eso es para jovenes'. El no. 'He sobrevivido al cassette, al CD, al MP3, al streaming. La IA es solo el siguiente capitulo'.",
    en: "GAMELIN has been in hip-hop for 30 years. When AI arrived, many veterans said 'that's for young people.' Not him. 'I survived cassettes, CDs, MP3s, streaming. AI is just the next chapter.'",
  },
  TRAPZOLIN: {
    es: "TRAPZOLIN era el tipo que siempre preguntaba 'cuantos streams tengo hoy?' cada 5 minutos. Obsesionado con los numeros. Cuando descubrio que la IA podia crear dashboards en tiempo real con TODOS sus datos de TODAS las plataformas, casi se desmaya. 'Los numeros no mienten. Si sabes leerlos, sabes exactamente que hacer'.",
    en: "TRAPZOLIN was the guy who always asked 'how many streams do I have today?' every 5 minutes. When he discovered AI could create real-time dashboards with ALL his data, he nearly fainted.",
  },
  WAVELIN: {
    es: "WAVELIN es de la nueva generacion y crecio con apps. Pero siempre le frustraba que las apps de musica fueran feas y dificiles de usar. Un dia descubrio que la IA podia generar prototipos de apps en minutos. Aprendio UX/UI en 3 meses usando IA como tutor y ahora disenia experiencias digitales que enamoran.",
    en: "WAVELIN is from the new generation and grew up with apps. One day he discovered AI could generate app prototypes in minutes. He learned UX/UI in 3 months using AI as a tutor.",
  },
  KUMEYLIN: {
    es: "KUMEYLIN perdio su cuenta de Instagram con 500K seguidores por un hackeo. Ese dia juro que nunca mas le pasaria a nadie. Estudio ciberseguridad como si fuera una mision militar. Cuando descubrio que la IA podia detectar amenazas antes de que ocurrieran, se convirtio en el guardian digital de toda la escena urbana.",
    en: "KUMEYLIN lost his Instagram account with 500K followers to a hack. When he discovered AI could detect threats before they happened, he became the digital guardian of the urban scene.",
  },
  VERSOLIN: {
    es: "VERSOLIN siempre fue el poeta del grupo. Mientras otros raperos presumian de dinero y autos, el escribia sobre melancolia, amor y existencialismo. Cuando probo IA para escritura creativa, no la uso para reemplazar su pluma sino para expandirla. 'Le doy a la IA mi primer verso y ella me devuelve 10 caminos que yo nunca habria imaginado'.",
    en: "VERSOLIN was always the poet of the group. When he tried AI for creative writing, he didn't use it to replace his pen but to expand it.",
  },
};

export function AvatarStoryModal({ character, lang, onClose }: AvatarStoryModalProps) {
  const imgUrl = getAvatarImage(character.key);
  const story = ORIGIN_STORIES[character.key];
  const storyText = story ? (story[lang] || story.es) : (tl(lang as PRDLanguage, { es: 'Historia proximamente...', en: 'Story coming soon...', zh: 'Historia proximamente...', 'pt-BR': 'Historia proximamente...', 'pt-PT': 'Historia proximamente...' }));
  const role = character.role[lang] || character.role.es;
  const specialty = character.specialty[lang] || character.specialty.es;

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handleEsc);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-lg max-h-[85vh] overflow-y-auto bg-[#0c0c14] border rounded-2xl shadow-2xl"
        style={{ borderColor: `${character.color}40` }}
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/20 transition-all">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
        </button>

        <div className="p-6 pb-4 flex items-start gap-4">
          <div className="w-24 h-24 rounded-xl overflow-hidden border-2 flex-shrink-0" style={{ borderColor: `${character.color}60` }}>
            {imgUrl ? (
              <img src={imgUrl} alt={character.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-3xl" style={{ backgroundColor: `${character.color}20` }}>
                {character.flag}
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-['Space_Grotesk'] font-bold text-xl text-white">{character.name}</h3>
            {character.realArtist && (
              <p className="text-sm mt-0.5" style={{ color: character.color }}>{character.realArtist}</p>
            )}
            <p className="text-white/60 text-sm mt-1">{role}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-lg">{character.flag}</span>
              <span className="text-white/40 text-xs">{character.region}</span>
            </div>
          </div>
        </div>

        <div className="px-6 pb-4">
          <div className="p-3 rounded-xl" style={{ backgroundColor: `${character.color}10`, borderLeft: `3px solid ${character.color}` }}>
            <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: character.color }}>
              {tl(lang as PRDLanguage, { es: 'Especialidad IA', en: 'AI Specialty', zh: 'Especialidad IA', 'pt-BR': 'Especialidad IA', 'pt-PT': 'Especialidad IA' })}
            </p>
            <p className="text-white/80 text-sm leading-relaxed">{specialty}</p>
          </div>
        </div>

        <div className="px-6 pb-4">
          <h4 className="font-['Space_Grotesk'] font-bold text-sm text-[#D4A843] mb-2 flex items-center gap-2">
            <span>📖</span>
            {tl(lang as PRDLanguage, { es: 'Historia de Origen', en: 'Origin Story', zh: 'Historia de Origen', 'pt-BR': 'Historia de Origen', 'pt-PT': 'Historia de Origen' })}
          </h4>
          <p className="text-white/70 text-sm leading-relaxed">{storyText}</p>
        </div>

        <div className="px-6 pb-6">
          <p className="text-white/40 text-xs mb-2">
            {tl(lang as PRDLanguage, { es: 'Comparte este personaje', en: 'Share this character', zh: 'Comparte este personaje', 'pt-BR': 'Comparte este personaje', 'pt-PT': 'Comparte este personaje' })}
          </p>
          <SocialShareBar
            imageUrl={imgUrl}
            title={`${character.name} - LINCE`}
            description={specialty}
          />
        </div>
      </div>
    </div>
  );
}

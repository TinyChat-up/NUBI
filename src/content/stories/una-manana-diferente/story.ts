import type { Story } from '../../../engine/types.ts';

/**
 * EPISODIO PILOTO — "Una mañana diferente"
 *
 * Contenido original de NUBI. Estado: pendiente de validación pedagógica
 * (ver `validation` y docs/PEDAGOGICAL_FOUNDATIONS.md).
 *
 * Convenciones de texto (docs/CONTENT_STANDARD.md):
 * - Frases cortas, presente o pasado simple, vocabulario concreto.
 * - El narrador describe; no ordena ni juzga.
 * - `short` es la versión de lectura fácil.
 */
export const unaMananaDiferente: Story = {
  id: 'una-manana-diferente',
  title: 'Una mañana diferente',
  tagline: 'Hoy en clase hay una persona nueva y el plan ha cambiado.',
  synopsis:
    'Teo llega al colegio un martes cualquiera. Pero su maestra Carmen no está: hoy viene Andrés, una persona nueva, y el horario ha cambiado. Cada compañero lo vive a su manera. Juntos descubrimos qué sabemos, qué necesitamos saber y qué se puede hacer cuando cambian los planes.',
  place: 'colegio',
  ages: { min: 6, max: 12 },
  durationMinutes: { min: 10, max: 15 },
  formats: ['cuento', 'comic', 'video'],
  cover: 'ume-cover',
  characters: ['teo', 'aya', 'bruno', 'lia', 'andres', 'pilar', 'rosa', 'nubi'],
  strategies: ['anticipar-cambios', 'pedir-ayuda', 'comunicar-necesidad', 'apoyos-sensoriales', 'descansar', 'espacio-tranquilo', 'expresar-desacuerdo'],

  objectives: [
    { id: 'o1', area: 'conciencia', text: 'Reconocer que un cambio inesperado puede provocar emociones distintas en cada persona.' },
    { id: 'o2', area: 'conciencia', text: 'Nombrar emociones como sorpresa, curiosidad, inseguridad y frustración.' },
    { id: 'o3', area: 'autonomia', text: 'Distinguir lo que ya se sabe de lo que se necesita saber, y formular preguntas.' },
    { id: 'o4', area: 'regulacion', text: 'Conocer estrategias para afrontar un cambio de planes: preguntar, ver el plan, usar apoyos, pedir tiempo.' },
    { id: 'o5', area: 'social', text: 'Pedir ayuda a una persona de confianza y comunicar necesidades de distintas formas.' },
    { id: 'o6', area: 'vida-bienestar', text: 'Explorar posibles consecuencias de distintas actuaciones, sin juicios de bien o mal.' },
  ],

  scenes: [
    // ─────────────────────────── ESCENA 1 ───────────────────────────
    {
      id: 'llegada',
      number: 1,
      title: 'La llegada al colegio',
      purpose: 'Presentar la rutina conocida y los apoyos de Teo. Normalizar que conocer el plan da tranquilidad.',
      steps: [
        {
          type: 'beat',
          id: 'llegada-1',
          illustration: 'ume-s1-puerta',
          text: 'Es martes por la mañana. Teo llega al colegio con su abuela Rosa.',
          short: 'Es martes. Teo llega al colegio con su abuela.',
          motion: 'rise',
        },
        {
          type: 'beat',
          id: 'llegada-2',
          illustration: 'ume-s1-puerta',
          text: 'Los martes siempre empiezan igual: colgar la mochila, saludar a Carmen y hacer matemáticas.',
          short: 'Los martes empiezan igual: mochila, saludo y matemáticas.',
        },
        {
          type: 'beat',
          id: 'llegada-3',
          illustration: 'ume-s1-pasillo',
          text: 'A Teo le gusta saber qué va a pasar. Conocer el plan del día le ayuda a sentirse tranquilo.',
          short: 'A Teo le gusta saber qué va a pasar.',
        },
        {
          type: 'beat',
          id: 'llegada-4',
          illustration: 'ume-s1-pasillo',
          text: 'En la mochila lleva sus cascos para el ruido y su tarjeta de descanso. Son sus apoyos. Algunos días los usa y otros no.',
          short: 'En la mochila lleva sus cascos y su tarjeta de descanso.',
        },
      ],
      comic: [
        {
          id: 'k1-1',
          illustration: 'ume-k1-1',
          span: 'half',
          caption: 'Martes, 8:55',
          bubbles: [
            { id: 'b1', kind: 'speech', speaker: 'rosa', text: '¡Que tengas un buen día, Teo!', position: 'top-right' },
            { id: 'b2', kind: 'speech', speaker: 'teo', text: 'Primero, mates con Carmen.', position: 'bottom-left' },
          ],
        },
        {
          id: 'k1-2',
          illustration: 'ume-k1-2',
          span: 'half',
          bubbles: [
            { id: 'b1', kind: 'sound', text: '¡Hola! ¡Corre, corre!', position: 'top-right' },
            { id: 'b2', kind: 'thought', speaker: 'teo', text: 'Hoy hay mucho ruido en el pasillo.', position: 'bottom-left' },
          ],
        },
        {
          id: 'k1-3',
          illustration: 'ume-k1-3',
          span: 'full',
          caption: 'Teo toca sus cascos dentro de la mochila. Saber que están ahí le tranquiliza.',
          bubbles: [],
          motion: 'float',
        },
      ],
    },

    // ─────────────────────────── ESCENA 2 ───────────────────────────
    {
      id: 'cambio',
      number: 2,
      title: 'Descubrimos un cambio',
      purpose:
        'Presentar el cambio de forma descriptiva y mostrar reacciones diversas (sorpresa, curiosidad, frustración, inseguridad). Preguntar al niño o la niña cómo se sentiría, sin respuesta correcta.',
      steps: [
        {
          type: 'beat',
          id: 'cambio-1',
          illustration: 'ume-s2-puerta',
          text: 'En la puerta de la clase no está Carmen. Hay una persona que Teo no conoce.',
          short: 'Carmen no está. Hay una persona nueva.',
        },
        {
          type: 'beat',
          id: 'cambio-2',
          illustration: 'ume-s2-anuncio',
          speaker: 'andres',
          text: '«Hola, me llamo Andrés. Carmen hoy no ha podido venir. Está bien y vuelve mañana. Hoy estaré yo con vosotros.»',
          short: '«Me llamo Andrés. Hoy estaré yo con vosotros.»',
        },
        {
          type: 'beat',
          id: 'cambio-3',
          illustration: 'ume-s2-anuncio',
          speaker: 'andres',
          text: '«Y hay otro cambio: la plástica pasa a la tarde. Ahora iremos a la biblioteca.»',
          short: '«La plástica pasa a la tarde. Ahora vamos a la biblioteca.»',
        },
        {
          type: 'beat',
          id: 'cambio-4',
          illustration: 'ume-s2-reacciones',
          text: 'Cada persona reacciona a su manera. Aya pregunta: «¿Y qué haremos allí?». Bruno protesta: «¡Pero yo quería plástica!». Lía busca en su comunicador el pictograma «no sé».',
          short: 'Aya tiene curiosidad. Bruno se enfada un poco. Lía no está segura.',
        },
        {
          type: 'beat',
          id: 'cambio-5',
          illustration: 'ume-s2-reacciones',
          text: 'Teo se queda quieto. Nota un nudo en la tripa y mueve los dedos rápido, como hace cuando piensa. No esperaba este cambio.',
          short: 'Teo se sorprende. Mueve los dedos para pensar.',
        },
        {
          type: 'beat',
          id: 'cambio-6',
          illustration: 'ume-s2-reacciones',
          speaker: 'nubi',
          text: 'No hay una forma correcta de sentir un cambio. Cada persona lo vive a su manera.',
          motion: 'float',
        },
        {
          type: 'feelings',
          id: 'cambio-sentir',
          prompt: 'Si estuvieras en la clase de Teo, ¿cómo te sentirías?',
          help: 'Puedes elegir varias. O ninguna.',
          options: [
            { id: 'sorpresa', label: 'Sorpresa', emotion: 'sorpresa', icon: 'spark' },
            { id: 'curiosidad', label: 'Curiosidad', emotion: 'curiosidad', icon: 'search' },
            { id: 'inseguridad', label: 'Nervios o inseguridad', emotion: 'inseguridad', icon: 'cloud' },
            { id: 'frustracion', label: 'Frustración', emotion: 'frustracion', icon: 'knot' },
            { id: 'calma', label: 'Tranquilidad', emotion: 'calma', icon: 'leaf' },
            { id: 'saber-plan', label: 'Ganas de saber el plan', icon: 'calendar' },
            { id: 'otra', label: 'Otra cosa', icon: 'dots' },
            { id: 'no-lo-se', label: 'No lo sé', icon: 'question' },
          ],
          intensity: {
            prompt: '¿Cuánto? (si quieres)',
            levels: [
              { id: 'un-poco', label: 'Un poco' },
              { id: 'bastante', label: 'Bastante' },
              { id: 'mucho', label: 'Mucho' },
            ],
          },
        },
      ],
      comic: [
        {
          id: 'k2-1',
          illustration: 'ume-k2-1',
          span: 'half',
          bubbles: [{ id: 'b1', kind: 'thought', speaker: 'teo', text: '¿Dónde está Carmen?', position: 'top-left' }],
        },
        {
          id: 'k2-2',
          illustration: 'ume-k2-2',
          span: 'half',
          bubbles: [
            { id: 'b1', kind: 'speech', speaker: 'andres', text: 'Hola, me llamo Andrés. Carmen hoy no ha podido venir. Está bien y vuelve mañana.', position: 'top-right' },
          ],
        },
        {
          id: 'k2-3',
          illustration: 'ume-k2-3',
          span: 'full',
          bubbles: [
            { id: 'b1', kind: 'speech', speaker: 'andres', text: 'La plástica pasa a la tarde. Ahora vamos a la biblioteca.', position: 'top-left' },
          ],
        },
        {
          id: 'k2-4',
          illustration: 'ume-k2-4',
          span: 'full',
          caption: 'Teo se queda quieto y mueve los dedos. No esperaba este cambio.',
          bubbles: [
            { id: 'b1', kind: 'speech', speaker: 'aya', text: '¿Y qué haremos allí?', position: 'top-left' },
            { id: 'b2', kind: 'speech', speaker: 'bruno', text: '¡Pero yo quería plástica!', position: 'top-right' },
            { id: 'b3', kind: 'device', speaker: 'lia', text: 'NO SÉ', position: 'bottom-right' },
          ],
        },
      ],
    },

    // ─────────────────────────── ESCENA 3 ───────────────────────────
    {
      id: 'saber',
      number: 3,
      title: '¿Qué sabemos y qué necesitamos saber?',
      purpose:
        'Separar información disponible de información que falta. Las preguntas que elige cada niño o niña son personales y se guardan en su resumen.',
      steps: [
        {
          type: 'beat',
          id: 'saber-1',
          illustration: 'ume-s3-pizarra',
          speaker: 'nubi',
          text: 'Cuando algo cambia, ayuda separar lo que ya sabemos de lo que todavía no sabemos.',
          short: 'Veamos qué sabemos y qué no sabemos todavía.',
          motion: 'float',
        },
        {
          type: 'know-need',
          id: 'saber-preguntas',
          knownTitle: 'Lo que ya sabemos',
          known: [
            { id: 'k1', text: 'Carmen hoy no está. Vuelve mañana.', icon: 'user' },
            { id: 'k2', text: 'Andrés estará con la clase.', icon: 'person' },
            { id: 'k3', text: 'Ahora toca biblioteca.', icon: 'book' },
            { id: 'k4', text: 'La plástica no se ha quitado: es por la tarde.', icon: 'palette' },
          ],
          needPrompt: '¿Qué te gustaría saber a ti?',
          help: 'Elige las preguntas que quieras.',
          questions: [
            { id: 'despues', label: '¿Qué haremos después de la biblioteca?', icon: 'arrow-right' },
            { id: 'recreo', label: '¿A qué hora es el recreo?', icon: 'clock' },
            { id: 'sitio', label: '¿Me puedo sentar en mi sitio de siempre?', icon: 'chair' },
            { id: 'ruido', label: '¿Habrá mucho ruido en la biblioteca?', icon: 'ear' },
            { id: 'agobio', label: '¿Qué hago si me agobio?', icon: 'hand' },
            { id: 'andres', label: '¿Cómo es Andrés?', icon: 'person' },
            { id: 'nada', label: 'Ahora no necesito saber nada más', icon: 'check' },
          ],
        },
        {
          type: 'beat',
          id: 'saber-2',
          illustration: 'ume-s4-teo-piensa',
          text: 'Hacer preguntas es una forma de prepararse. Se puede preguntar hablando, por escrito, con pictogramas o pidiendo a alguien que pregunte contigo.',
          short: 'Preguntar ayuda a prepararse. Hay muchas formas de preguntar.',
        },
      ],
      comic: [
        {
          id: 'k3-1',
          illustration: 'ume-k3-1',
          span: 'half',
          motion: 'float',
          bubbles: [{ id: 'b1', kind: 'speech', speaker: 'nubi', text: '¿Qué sabemos ya? ¿Qué nos falta por saber?', position: 'top-right' }],
        },
        {
          id: 'k3-2',
          illustration: 'ume-k3-2',
          span: 'half',
          bubbles: [{ id: 'b1', kind: 'thought', speaker: 'teo', text: '¿Y después de la biblioteca, qué? ¿Y el recreo?', position: 'top-left' }],
        },
      ],
    },

    // ─────────────────────────── ESCENA 4 ───────────────────────────
    {
      id: 'posibilidades',
      number: 4,
      title: 'Varias posibilidades',
      purpose:
        'Ofrecer varias actuaciones posibles, la mayoría válidas, y una frecuente con más inconvenientes (salir sin avisar), tratada sin culpa. Ninguna se presenta como la correcta.',
      steps: [
        {
          type: 'beat',
          id: 'posibilidades-1',
          illustration: 'ume-s4-teo-piensa',
          text: 'Teo tiene muchas preguntas en la cabeza. ¿Qué podría hacer ahora?',
        },
        {
          type: 'choice',
          id: 'posibilidades-elegir',
          prompt: '¿Qué podría hacer Teo?',
          help: 'Hay varias posibilidades. Elige una para ver qué puede pasar. Después puedes probar otras.',
          next: 'consecuencias',
          options: [
            {
              id: 'preguntar',
              label: 'Preguntar qué va a pasar',
              icon: 'question',
              illustration: 'ume-opt-preguntar',
              consequence: {
                story: [
                  { illustration: 'ume-opt-preguntar', text: 'Teo levanta la mano y pregunta: «¿Qué vamos a hacer después de la biblioteca?»' },
                  { illustration: 'ume-c-preguntar', text: 'Andrés responde: «Después, recreo. Y luego, lengua, como siempre.» Teo respira un poco más despacio.' },
                ],
                youMayFeel: 'Más tranquilidad al saber lo que viene. Quizá algo de vergüenza al preguntar delante de todos. Eso también es normal.',
                othersMay: 'Andrés agradece la pregunta: así sabe qué necesita la clase. Puede que otros compañeros tuvieran la misma duda.',
                helpsWhen: 'Te ayuda saber qué viene después y te ves con fuerzas para preguntar.',
                keepInMind: 'A veces el adulto tampoco lo sabe todo. Puede decir: «Aún no lo sé. Te lo cuento en cuanto lo sepa».',
                tools: ['anticipar-cambios', 'comunicar-necesidad'],
              },
            },
            {
              id: 'horario',
              label: 'Pedir que le expliquen el horario',
              icon: 'calendar',
              illustration: 'ume-opt-horario',
              consequence: {
                story: [
                  { illustration: 'ume-opt-horario', text: 'Teo se acerca a Andrés y le dice: «¿Me enseñas el plan de hoy?»' },
                  { illustration: 'ume-c-horario', text: 'Andrés dibuja el plan en la pizarra: biblioteca, recreo, lengua, comida y plástica. Teo lo mira entero, de arriba abajo.' },
                ],
                youMayFeel: 'Alivio al ver el día completo. Cuando el plan se ve, el cambio parece más pequeño.',
                othersMay: 'A Lía y a Aya también les viene bien ver el plan dibujado. Andrés descubre una forma de ayudar a toda la clase.',
                helpsWhen: 'Entiendes mejor las cosas cuando las ves que cuando las oyes.',
                keepInMind: 'Si el plan vuelve a cambiar, puedes pedir que lo actualicen en la pizarra.',
                tools: ['anticipar-cambios'],
              },
            },
            {
              id: 'adulto',
              label: 'Buscar a un adulto de confianza',
              icon: 'hand',
              illustration: 'ume-opt-adulto',
              consequence: {
                story: [
                  { illustration: 'ume-opt-adulto', text: 'Teo va a buscar a Pilar, su maestra de apoyo. Ella le conoce bien.' },
                  { illustration: 'ume-c-adulto', text: 'Pilar le escucha y le acompaña a hablar con Andrés. Juntos le cuentan qué cosas ayudan a Teo.' },
                ],
                youMayFeel: 'Seguridad al estar con alguien que te conoce.',
                othersMay: 'Pilar se alegra de que Teo haya ido a buscarla. Andrés aprende cosas de Teo que no sabía.',
                helpsWhen: 'Todavía no tienes confianza con la persona nueva y otra persona conocida puede ayudarte.',
                keepInMind: 'Ayuda saber de antemano quiénes son tus personas de confianza en el cole y dónde encontrarlas.',
                tools: ['pedir-ayuda'],
              },
            },
            {
              id: 'regulacion',
              label: 'Usar un recurso para estar más tranquilo',
              icon: 'headphones',
              illustration: 'ume-opt-regulacion',
              consequence: {
                story: [
                  { illustration: 'ume-opt-regulacion', text: 'Teo saca sus cascos y se los pone. Aprieta la pelota blanda que lleva en el bolsillo.' },
                  { illustration: 'ume-c-regulacion', text: 'El ruido de la clase se vuelve más suave. Poco a poco, el nudo de la tripa se afloja.' },
                ],
                youMayFeel: 'Más calma en el cuerpo. Con el cuerpo más tranquilo es más fácil pensar.',
                othersMay: 'Los demás siguen con lo suyo. Usar tus apoyos es algo normal, como ponerse unas gafas.',
                helpsWhen: 'El ruido o los nervios no te dejan pensar.',
                keepInMind: 'Tu recurso te calma, pero puede que aún necesites saber qué va a pasar. Se pueden combinar herramientas.',
                tools: ['apoyos-sensoriales', 'descansar'],
              },
            },
            {
              id: 'tiempo',
              label: 'Decir que necesita tiempo',
              icon: 'pause',
              illustration: 'ume-opt-tiempo',
              consequence: {
                story: [
                  { illustration: 'ume-opt-tiempo', text: 'Teo le dice a Andrés: «Necesito un momento antes de ir a la biblioteca.» También podría enseñarle su tarjeta de descanso.' },
                  { illustration: 'ume-c-tiempo', text: 'Andrés responde: «Vale. Avísame cuando estés listo.» Teo se queda un rato mirando cómo se prepara la clase.' },
                ],
                youMayFeel: 'Tranquilidad al poder ir a tu ritmo.',
                othersMay: 'Andrés entiende que Teo necesita un poco más de tiempo. Así no tiene que adivinarlo.',
                helpsWhen: 'Necesitas mirar y entender antes de empezar algo nuevo.',
                keepInMind: 'A veces el grupo tiene que moverse. Se puede pedir ir un poco después, ir con alguien o mirar primero desde la puerta.',
                tools: ['comunicar-necesidad', 'descansar'],
              },
            },
            {
              id: 'salir',
              label: 'Salir de clase sin avisar',
              icon: 'door',
              illustration: 'ume-opt-salir',
              consequence: {
                story: [
                  { illustration: 'ume-opt-salir', text: 'Teo sale al pasillo sin decir nada. Allí hay menos ruido y respira mejor.' },
                  { illustration: 'ume-c-salir', text: 'Pero Andrés no sabe dónde está Teo. Se preocupa y sale a buscarle por los pasillos.' },
                ],
                youMayFeel: 'Alivio al estar en un sitio tranquilo. Quizá también susto o agobio cuando te buscan.',
                othersMay: 'Los adultos se preocupan cuando no saben dónde está un niño o una niña. Su trabajo es que estés seguro.',
                helpsWhen: 'Necesitar salir es válido. Querer un sitio tranquilo muestra que conoces lo que te ayuda.',
                keepInMind: 'Salir sin avisar puede hacer que los demás se preocupen, y que te pidan explicaciones cuando aún no estás preparado.',
                anotherWay:
                  'Puedes conseguir lo mismo avisando: enseña tu tarjeta de descanso, di «necesito salir» o usa una señal acordada. Así tienes tu momento tranquilo y los adultos saben que estás bien.',
                tools: ['espacio-tranquilo', 'descansar', 'comunicar-necesidad'],
              },
            },
          ],
        },
      ],
      comic: [
        {
          id: 'k4-1',
          illustration: 'ume-k4-1',
          span: 'full',
          caption: 'Teo tiene muchas preguntas en la cabeza.',
          bubbles: [{ id: 'b1', kind: 'thought', speaker: 'teo', text: '¿Qué puedo hacer?', position: 'top-right' }],
        },
      ],
    },

    // ─────────────────────────── ESCENA 5 ───────────────────────────
    {
      id: 'consecuencias',
      number: 5,
      title: 'Exploramos consecuencias',
      purpose:
        'Mostrar qué puede pasar con cada opción: cómo te puedes sentir, cómo pueden sentirse otros, cuándo ayuda y qué tener en cuenta. Se puede volver a explorar otras opciones sin límite.',
      next: 'estrategias',
      steps: [
        {
          type: 'consequence',
          id: 'consecuencias-ver',
          choiceStepId: 'posibilidades-elegir',
          routes: [
            { label: 'Probar otra posibilidad', icon: 'refresh', to: { sceneId: 'posibilidades', stepId: 'posibilidades-elegir' } },
            { label: 'Seguir con la historia', icon: 'arrow-right', to: { sceneId: 'estrategias' } },
          ],
        },
      ],
    },

    // ─────────────────────────── ESCENA 6 ───────────────────────────
    {
      id: 'estrategias',
      number: 6,
      title: 'Estrategias que pueden ayudar',
      purpose:
        'Mostrar que cada personaje usa estrategias distintas (incluido expresar desacuerdo y comunicarse con pictogramas) y que cada niño o niña elige las suyas.',
      steps: [
        {
          type: 'beat',
          id: 'estrategias-1',
          illustration: 'ume-s6-plan',
          text: 'Aquella mañana, Teo pidió ver el plan. Andrés lo dibujó en la pizarra y Teo lo miró varias veces.',
          short: 'Andrés dibujó el plan. Teo lo miró varias veces.',
        },
        {
          type: 'beat',
          id: 'estrategias-2',
          illustration: 'ume-s6-biblioteca',
          text: 'En la biblioteca había eco, así que Teo se puso los cascos. Así pudo elegir tranquilo un libro de trenes.',
          short: 'En la biblioteca, Teo se puso los cascos.',
        },
        {
          type: 'beat',
          id: 'estrategias-3',
          illustration: 'ume-s6-biblioteca',
          text: 'Cada persona usó lo que le servía. Aya hizo muchas preguntas. Bruno dijo «no me gusta este cambio» y se tomó un rato. Lía señaló en su comunicador: «Quiero sentarme con Teo».',
          short: 'Aya preguntó. Bruno dijo que no le gustaba el cambio. Lía pidió sentarse con Teo.',
        },
        {
          type: 'beat',
          id: 'estrategias-4',
          illustration: 'ume-s6-biblioteca',
          speaker: 'nubi',
          text: 'Lo que ayuda a una persona puede no ayudar a otra. Por eso está bien tener varias herramientas.',
          motion: 'float',
        },
        {
          type: 'strategies',
          id: 'estrategias-elegir',
          prompt: '¿Cuáles podrían ayudarte a ti cuando cambia un plan?',
          help: 'Puedes elegir varias, o ninguna. Otro día puedes cambiar de idea.',
          tools: ['anticipar-cambios', 'pedir-ayuda', 'comunicar-necesidad', 'apoyos-sensoriales', 'descansar', 'espacio-tranquilo', 'expresar-desacuerdo'],
        },
      ],
      comic: [
        {
          id: 'k6-1',
          illustration: 'ume-k6-1',
          span: 'half',
          bubbles: [
            { id: 'b1', kind: 'speech', speaker: 'teo', text: '¿Me puedes dibujar el plan?', position: 'top-left' },
            { id: 'b2', kind: 'speech', speaker: 'andres', text: '¡Claro! Mira: biblioteca, recreo, lengua…', position: 'bottom-right' },
          ],
        },
        {
          id: 'k6-2',
          illustration: 'ume-k6-2',
          span: 'half',
          caption: 'En la biblioteca hay eco. Teo se pone los cascos.',
          bubbles: [{ id: 'b1', kind: 'thought', speaker: 'teo', text: 'Ahora puedo pensar.', position: 'top-right' }],
        },
        {
          id: 'k6-3',
          illustration: 'ume-k6-3',
          span: 'full',
          bubbles: [
            { id: 'b1', kind: 'speech', speaker: 'bruno', text: 'No me gusta este cambio. Necesito un rato.', position: 'top-left' },
            { id: 'b2', kind: 'speech', speaker: 'aya', text: '¿Hay libros de volcanes?', position: 'top-right' },
            { id: 'b3', kind: 'device', speaker: 'lia', text: 'QUIERO · SENTARME · CON TEO', position: 'bottom-right' },
          ],
        },
      ],
    },

    // ─────────────────────────── ESCENA 7 ───────────────────────────
    {
      id: 'cierre',
      number: 7,
      title: 'Cierre y resumen personal',
      purpose: 'Cerrar con calma, sin moraleja impuesta. Devolver al niño o la niña sus propias respuestas como resumen personal.',
      steps: [
        {
          type: 'beat',
          id: 'cierre-1',
          illustration: 'ume-s7-salida',
          text: 'La mañana termina. Ha sido una mañana diferente. Algunas cosas fueron difíciles y otras salieron bien.',
          short: 'La mañana termina. Ha sido diferente.',
          motion: 'rise',
        },
        {
          type: 'beat',
          id: 'cierre-2',
          illustration: 'ume-s7-salida',
          speaker: 'teo',
          text: 'Teo le cuenta a su abuela: «Hoy no estaba Carmen. Pedí ver el plan y me puse los cascos en la biblioteca».',
          short: '«Pedí ver el plan y me puse los cascos.»',
        },
        {
          type: 'beat',
          id: 'cierre-3',
          illustration: 'ume-s7-salida',
          speaker: 'nubi',
          text: 'Los cambios pueden sorprender. Pero hay cosas que puedes hacer: preguntar, pedir ayuda, usar tus apoyos o tomarte tu tiempo.',
          motion: 'float',
        },
        {
          type: 'summary',
          id: 'cierre-resumen',
          title: 'Mi resumen',
          sections: [
            { title: 'Cómo me sentiría', fromStepId: 'cambio-sentir', empty: 'No elegiste ninguna. También está bien.' },
            { title: 'Lo que me gustaría saber', fromStepId: 'saber-preguntas', empty: 'No elegiste ninguna pregunta.' },
            { title: 'Posibilidades que exploré', fromStepId: 'posibilidades-elegir', empty: 'Aún no has explorado ninguna.' },
            { title: 'Herramientas que podrían ayudarme', fromStepId: 'estrategias-elegir', empty: 'Puedes elegirlas cuando quieras en Mis herramientas.' },
          ],
          closingPhrase: 'Cuando un plan cambia, puedo preguntar, pedir ayuda y tomarme mi tiempo.',
        },
      ],
      comic: [
        {
          id: 'k7-1',
          illustration: 'ume-k7-1',
          span: 'half',
          bubbles: [
            { id: 'b1', kind: 'speech', speaker: 'rosa', text: '¿Qué tal la mañana?', position: 'top-right' },
            { id: 'b2', kind: 'speech', speaker: 'teo', text: 'Diferente. Carmen no estaba.', position: 'bottom-left' },
          ],
        },
        {
          id: 'k7-2',
          illustration: 'ume-k7-2',
          span: 'half',
          caption: 'Mañana vuelve Carmen. Y si algún día cambia otra vez el plan, Teo sabe algunas cosas que puede hacer.',
          bubbles: [{ id: 'b1', kind: 'speech', speaker: 'teo', text: 'Pedí ver el plan. Y me puse los cascos.', position: 'top-left' }],
          motion: 'rise',
        },
      ],
    },
  ],

  recreations: [
    {
      id: 'cuando-cambia-el-plan',
      title: 'Cuando cambia el plan',
      description: 'Prueba distintas formas de actuar y descubre qué puede pasar con cada una.',
      sceneId: 'posibilidades',
      choiceStepId: 'posibilidades-elegir',
      cover: 'ume-s4-teo-piensa',
    },
  ],

  video: {
    status: 'pendiente',
    sources: [
      { src: '/media/stories/una-manana-diferente/video/una-manana-diferente.webm', type: 'video/webm' },
      { src: '/media/stories/una-manana-diferente/video/una-manana-diferente.mp4', type: 'video/mp4' },
    ],
    captions: [{ src: '/media/stories/una-manana-diferente/video/una-manana-diferente.es.vtt', srclang: 'es', label: 'Español' }],
    poster: 'ume-cover',
    chapters: [
      { sceneId: 'llegada', start: 0 },
      { sceneId: 'cambio', start: 32 },
      { sceneId: 'saber', start: 78 },
      { sceneId: 'posibilidades', start: 104 },
      { sceneId: 'estrategias', start: 126 },
      { sceneId: 'cierre', start: 168 },
    ],
    productionNote:
      'El vídeo de este episodio todavía no está producido. Ya están preparados el guion de subtítulos y el reproductor. Mientras tanto, puedes disfrutar la historia como cuento o como cómic.',
  },

  familyGuide: {
    intro:
      'Esta historia trata sobre los cambios inesperados en el colegio: una persona nueva en clase y un horario distinto. No busca que el niño o la niña "se acostumbre" sin más, sino que reconozca lo que siente, sepa qué información necesita y conozca formas de pedirla.',
    beforeReading: [
      'Elegid un momento tranquilo, no justo después de un cambio difícil.',
      'Dejad que el niño o la niña elija el formato: cuento, cómic o escuchar.',
      'Si lo necesita, contadle antes de qué trata: "Es la historia de un día en el que cambia el plan".',
    ],
    duringReading: [
      'No hace falta responder a todas las preguntas. Se pueden saltar.',
      'Si elige "No lo sé" u "Otra cosa", es una respuesta válida.',
      'Evitad corregir lo que siente. Podéis decir: "A mí también me pasa" o "Tiene sentido".',
      'Es normal que se mueva, se balancee o no mire a la pantalla mientras escucha.',
    ],
    afterReading: [
      'Mirad juntos el resumen personal. Preguntad qué herramienta le gustaría probar primero.',
      'Pensad en un cambio real que haya vivido y qué le ayudó (o qué le habría ayudado).',
      'Si quiere, imprimid o dibujad su "tarjeta" preferida de Mis herramientas.',
    ],
    dailyPractice: [
      { id: 'p1', title: 'El plan del día, a la vista', text: 'Por la mañana, repasad juntos el plan del día con dibujos o pictogramas. Si algo cambia, actualizadlo delante de él o ella.', tool: 'anticipar-cambios' },
      { id: 'p2', title: 'Personas de confianza', text: 'Haced una lista (con fotos o dibujos) de las personas del colegio a las que puede acudir y dónde encontrarlas.', tool: 'pedir-ayuda' },
      { id: 'p3', title: 'Pequeños cambios con aviso', text: 'Introducid algún cambio pequeño y previsible en casa ("hoy cenamos en otro orden") avisando antes y comentando después cómo fue.', tool: 'anticipar-cambios' },
      { id: 'p4', title: 'Mi tarjeta de descanso', text: 'Cread juntos una tarjeta o señal para pedir un descanso y practicadla en momentos tranquilos.', tool: 'descansar' },
      { id: 'p5', title: 'Puedo decir que no me gusta', text: 'Cuando exprese desacuerdo, escuchadlo primero sin corregir. Después, buscad juntos qué parte se puede negociar.', tool: 'expresar-desacuerdo' },
    ],
    pendingActivities: [
      { id: 'a1', title: 'Explorar todas las posibilidades', text: 'En la escena 4 hay seis posibilidades. Se pueden explorar en distintos días.' },
      { id: 'a2', title: 'Elegir una herramienta para probar', text: 'Elegir una herramienta de la escena 6 y probarla esta semana en una situación real.' },
      { id: 'a3', title: 'Hablar con el colegio', text: 'Compartir con el equipo docente qué apoyos ayudan al niño o la niña ante cambios de profesorado u horario.' },
    ],
    resources: [
      { id: 'r1', title: 'Guía de la historia', description: 'Esta misma guía, en una página.', status: 'disponible' },
      { id: 'r2', title: 'Horario visual imprimible', description: 'Plantilla para construir el plan del día con dibujos.', status: 'en-preparacion' },
      { id: 'r3', title: 'Tarjetas de herramientas', description: 'Tarjetas para recortar: descanso, ayuda, necesito saber…', status: 'en-preparacion' },
      { id: 'r4', title: 'Nota para el colegio', description: 'Plantilla para contar al profesorado qué ayuda ante los cambios.', status: 'en-preparacion' },
    ],
    pauseSignals: [
      'Si la historia le recuerda una situación reciente que le resultó muy difícil.',
      'Si muestra señales de agobio: lo más importante es su bienestar, no terminar el episodio.',
      'Si prefiere hablarlo otro día. La historia se puede retomar donde se dejó.',
    ],
    respectNotes: [
      'No se pide contacto visual en ningún momento.',
      'Todas las formas de comunicarse son válidas: palabras, gestos, pictogramas, escritura.',
      'Las respuestas no se evalúan. No hay puntuaciones ni resultados.',
      'Moverse, balancearse o mover las manos son formas válidas de regularse.',
    ],
  },

  references: [
    { source: 'bisquerra', status: 'fundamento', howApplied: 'Los seis objetivos se asocian a bloques de competencia emocional. El recorrido va de la conciencia emocional (escena 2) a la regulación (escenas 4-6).' },
    { source: 'ibarrola', status: 'fundamento', howApplied: 'Una sola situación cotidiana con pocas emociones nombradas, acompañada de una guía para familias.' },
    { source: 'gray', status: 'fundamento', howApplied: 'Narración descriptiva, paciente y sin juicios; se describe qué pasa y qué pueden sentir otras personas antes de sugerir opciones. NO es una Social Story™.' },
    { source: 'social-situation-mapping', status: 'fundamento', howApplied: 'Cada posibilidad de la escena 4 enlaza acción → lo que puede pasar → cómo se sienten otros → cómo te sientes tú (escena 5).' },
    { source: 'zones', status: 'fundamento', howApplied: 'Las estrategias se presentan como habilidades practicables, y se incluye la corregulación (buscar a Pilar). Sin sistema de zonas ni colores.' },
    { source: 'five-point-scale', status: 'propuesta', howApplied: 'Escala propia opcional de tres niveles ("un poco, bastante, mucho") en la escena 2. Pendiente de validar.' },
    { source: 'neurodiversity-affirming', status: 'propuesta', howApplied: 'Teo mueve los dedos sin que nadie lo corrija; Lía se comunica con pictogramas; la opción "salir sin avisar" se trata sin culpa y con una alternativa que consigue lo mismo.' },
  ],

  validation: {
    status: 'pendiente-validacion',
    notes:
      'Borrador completo. Requiere revisión por profesionales de educación especial, personas autistas adultas y familias antes de su uso comercial: lenguaje, nivel de lectura (6 años), escala de intensidad y tratamiento de la opción "salir sin avisar".',
  },
};

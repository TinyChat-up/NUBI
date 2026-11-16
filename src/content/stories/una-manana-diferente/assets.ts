import type { AssetSpec, PlaceholderFigure, PlaceholderMotif } from '../../../engine/types.ts';
import { defineAsset } from '../../assets/helpers.ts';

/** Recursos del episodio piloto "Una mañana diferente". */

const BASE = '/media/stories/una-manana-diferente';
const NO_TEXT = 'Sin texto dentro de la imagen (los textos y bocadillos los pone la app).';

interface SceneInput {
  id: string;
  usage: string;
  description: string;
  characters: string[];
  emotionOrAction: string;
  background: string;
  alt: string;
  motif: PlaceholderMotif;
  figures?: PlaceholderFigure[];
}

const scene = (i: SceneInput): AssetSpec =>
  defineAsset('escena', {
    id: `ume-${i.id}`,
    file: `${BASE}/scenes/${i.id}.webp`,
    usage: i.usage,
    description: i.description,
    characters: i.characters,
    emotionOrAction: i.emotionOrAction,
    aspect: '16:9',
    background: `${i.background} Dejar el cuarto inferior con poco detalle: ahí se superpone el texto en móvil. ${NO_TEXT}`,
    alt: i.alt,
    placeholder: { motif: i.motif, figures: i.figures },
  });

const panel = (i: SceneInput & { wide?: boolean }): AssetSpec =>
  defineAsset('vineta', {
    id: `ume-${i.id}`,
    file: `${BASE}/comic/${i.id}.webp`,
    usage: i.usage,
    description: i.description,
    characters: i.characters,
    emotionOrAction: i.emotionOrAction,
    aspect: i.wide ? '16:9' : '4:3',
    background: `${i.background} Reservar una zona despejada para los bocadillos indicada en la descripción. Línea de contorno algo más marcada que en el cuento. ${NO_TEXT}`,
    alt: i.alt,
    placeholder: { motif: i.motif, figures: i.figures },
  });

const option = (i: SceneInput): AssetSpec =>
  defineAsset('opcion', {
    id: `ume-${i.id}`,
    file: `${BASE}/options/${i.id}.webp`,
    usage: i.usage,
    description: i.description,
    characters: i.characters,
    emotionOrAction: i.emotionOrAction,
    aspect: '4:3',
    background: `${i.background} Composición legible en tamaño pequeño (tarjeta de opción de 300 px). ${NO_TEXT}`,
    alt: i.alt,
    placeholder: { motif: i.motif, figures: i.figures },
  });

export const unaMananaDiferenteAssets: AssetSpec[] = [
  defineAsset('cubierta', {
    id: 'ume-cover',
    file: `${BASE}/cover.webp`,
    usage: 'Tarjeta en el catálogo de historias, ficha de la historia y póster del vídeo',
    description:
      'Teo, de espaldas a tres cuartos, en la puerta abierta de su clase. Dentro se intuye una figura adulta nueva (Andrés) junto a una pizarra con dibujos cambiados de sitio. Luz de mañana entrando por la ventana. Sensación de umbral: algo nuevo, pero no amenazante.',
    characters: ['teo', 'andres'],
    emotionOrAction: 'Curiosidad y un poco de incertidumbre',
    aspect: '4:3',
    background: `Interior de colegio en tonos crema y azul petróleo, acentos coral. Margen superior despejado. ${NO_TEXT}`,
    alt: 'Teo en la puerta de su clase, donde hay una persona nueva.',
    placeholder: { motif: 'classroom-door', figures: [{ character: 'teo', mood: 'curious' }, { character: 'andres', mood: 'happy' }] },
  }),

  // ───────── Escenas del cuento ─────────
  scene({
    id: 's1-puerta',
    usage: 'Escena 1 · pasos 1-2',
    description: 'Teo y su abuela Rosa llegan a la verja del colegio. Rosa le da la mano. Otros niños entran al fondo. Teo mira el reloj del colegio.',
    characters: ['teo', 'rosa'],
    emotionOrAction: 'Rutina conocida, tranquilidad',
    background: 'Exterior del colegio por la mañana: verja, árbol, reloj en la fachada.',
    alt: 'Teo llega al colegio de la mano de su abuela.',
    motif: 'school-gate',
    figures: [{ character: 'rosa', mood: 'happy' }, { character: 'teo', mood: 'calm' }],
  }),
  scene({
    id: 's1-pasillo',
    usage: 'Escena 1 · pasos 3-4',
    description: 'Teo en el pasillo, junto a las perchas, con la mano dentro de la mochila tocando sus cascos verdes. A su alrededor, niños pasan corriendo (ligeramente desenfocados).',
    characters: ['teo'],
    emotionOrAction: 'Busca su apoyo; pasillo ruidoso',
    background: 'Pasillo con perchas de colores, dibujos infantiles en la pared, luz de ventanal.',
    alt: 'Teo en el pasillo toca sus cascos dentro de la mochila.',
    motif: 'hallway',
    figures: [{ character: 'teo', mood: 'neutral' }],
  }),
  scene({
    id: 's2-puerta',
    usage: 'Escena 2 · paso 1',
    description: 'Puerta de la clase. Andrés, desconocido para Teo, espera en la puerta con una carpeta. Teo se ha detenido a unos pasos, sorprendido.',
    characters: ['teo', 'andres'],
    emotionOrAction: 'Sorpresa',
    background: 'Puerta de aula con un cartel de la clase (sin texto legible).',
    alt: 'En la puerta de la clase hay una persona que Teo no conoce.',
    motif: 'classroom-door',
    figures: [{ character: 'teo', mood: 'surprised' }, { character: 'andres', mood: 'happy' }],
  }),
  scene({
    id: 's2-anuncio',
    usage: 'Escena 2 · pasos 2-3',
    description: 'Andrés, de pie delante de la pizarra, habla a la clase con gesto tranquilo. Los niños sentados escuchan.',
    characters: ['andres', 'teo', 'aya', 'bruno', 'lia'],
    emotionOrAction: 'Andrés se presenta y explica el cambio',
    background: 'Aula luminosa con pizarra verde, mesas en grupos, ventana a la izquierda.',
    alt: 'Andrés se presenta a la clase delante de la pizarra.',
    motif: 'classroom',
    figures: [{ character: 'andres', mood: 'happy' }, { character: 'aya', mood: 'neutral' }, { character: 'teo', mood: 'neutral' }],
  }),
  scene({
    id: 's2-reacciones',
    usage: 'Escena 2 · pasos 4-6',
    description:
      'Plano de la clase con cuatro reacciones distintas: Aya inclinada hacia delante con la mano levantada (curiosidad), Bruno con los brazos cruzados (frustración), Lía mirando su comunicador (inseguridad), Teo quieto moviendo los dedos (sorpresa). Ninguna reacción se ve como "mala".',
    characters: ['aya', 'bruno', 'lia', 'teo'],
    emotionOrAction: 'Curiosidad, frustración, inseguridad, sorpresa',
    background: 'Aula, plano medio, fondo simplificado para que destaquen las cuatro figuras.',
    alt: 'Aya levanta la mano, Bruno cruza los brazos, Lía mira su comunicador y Teo mueve los dedos.',
    motif: 'classroom',
    figures: [
      { character: 'aya', mood: 'curious' },
      { character: 'bruno', mood: 'frustrated' },
      { character: 'lia', mood: 'worried' },
      { character: 'teo', mood: 'surprised' },
    ],
  }),
  scene({
    id: 's3-pizarra',
    usage: 'Escena 3 · paso 1',
    description: 'Nubi flota junto a una pizarra dividida en dos columnas: a la izquierda, cuatro dibujos sencillos (una silueta de maestra con una flecha de "mañana", un adulto, un libro, una paleta); a la derecha, signos de interrogación.',
    characters: ['nubi'],
    emotionOrAction: 'Ordenar lo que sabemos y lo que no',
    background: 'Pizarra grande ocupando dos tercios, aula difuminada detrás.',
    alt: 'Nubi junto a una pizarra con dos columnas: lo que sabemos y lo que no.',
    motif: 'board-schedule',
    figures: [{ character: 'nubi', mood: 'thinking' }],
  }),
  scene({
    id: 's4-teo-piensa',
    usage: 'Escena 3 · paso final, escena 4 · paso 1, portada de la recreación',
    description: 'Teo sentado en su mesa, con varias burbujas de pensamiento vacías flotando sobre él (reloj, libro, puerta, cascos, pizarra). Mueve los dedos.',
    characters: ['teo'],
    emotionOrAction: 'Pensar qué hacer',
    background: 'Mesa de Teo en primer plano, aula muy difuminada.',
    alt: 'Teo piensa en su mesa, rodeado de burbujas de pensamiento.',
    motif: 'classroom',
    figures: [{ character: 'teo', mood: 'thinking' }],
  }),
  scene({
    id: 's6-plan',
    usage: 'Escena 6 · paso 1',
    description: 'Andrés dibuja en la pizarra un horario visual con cinco dibujos en fila (libro, pelota, lápiz, plato, pincel). Teo, a su lado, lo señala.',
    characters: ['andres', 'teo'],
    emotionOrAction: 'Anticipación; Teo más tranquilo',
    background: 'Pizarra en primer plano. Dibujos de tiza sencillos y reconocibles.',
    alt: 'Andrés dibuja el plan de la mañana en la pizarra y Teo lo señala.',
    motif: 'board-schedule',
    figures: [{ character: 'andres', mood: 'happy' }, { character: 'teo', mood: 'calm' }],
  }),
  scene({
    id: 's6-biblioteca',
    usage: 'Escena 6 · pasos 2-4',
    description: 'Biblioteca escolar. Teo con sus cascos verdes elige un libro de trenes. Lía, sentada a su lado, señala su comunicador. Aya hojea un libro de volcanes. Bruno, en un puf, respira tranquilo.',
    characters: ['teo', 'lia', 'aya', 'bruno'],
    emotionOrAction: 'Cada uno usa su estrategia',
    background: 'Estanterías bajas de madera, alfombra, pufs, luz cálida.',
    alt: 'En la biblioteca, Teo lleva sus cascos, Lía usa su comunicador, Aya lee y Bruno descansa en un puf.',
    motif: 'library',
    figures: [
      { character: 'teo', mood: 'calm' },
      { character: 'lia', mood: 'happy' },
      { character: 'aya', mood: 'curious' },
      { character: 'bruno', mood: 'calm' },
    ],
  }),
  scene({
    id: 's7-salida',
    usage: 'Escena 7 · todos los pasos',
    description: 'Mediodía. Teo sale del colegio y camina junto a su abuela Rosa, contándole algo con las manos. Nubi flota en el cielo.',
    characters: ['teo', 'rosa', 'nubi'],
    emotionOrAction: 'Cierre tranquilo, satisfacción',
    background: 'Exterior del colegio a mediodía, luz más cálida que en la escena 1 (misma localización).',
    alt: 'Teo sale del colegio con su abuela y le cuenta cómo ha ido la mañana.',
    motif: 'school-gate',
    figures: [{ character: 'teo', mood: 'happy' }, { character: 'rosa', mood: 'happy' }],
  }),

  // ───────── Opciones de la escena 4 y consecuencias (escena 5) ─────────
  option({ id: 'opt-preguntar', usage: 'Escena 4 · opción "Preguntar" y escena 5', description: 'Teo levanta la mano desde su sitio. Andrés le mira atento.', characters: ['teo', 'andres'], emotionOrAction: 'Preguntar', background: 'Aula.', alt: 'Teo levanta la mano para preguntar.', motif: 'classroom', figures: [{ character: 'teo', mood: 'curious' }, { character: 'andres', mood: 'neutral' }] }),
  option({ id: 'c-preguntar', usage: 'Escena 5 · consecuencia de "Preguntar"', description: 'Andrés responde contando con los dedos. Teo escucha con los hombros más relajados.', characters: ['teo', 'andres'], emotionOrAction: 'Tranquilidad al saber', background: 'Aula.', alt: 'Andrés responde a Teo, que se relaja.', motif: 'classroom', figures: [{ character: 'andres', mood: 'happy' }, { character: 'teo', mood: 'calm' }] }),
  option({ id: 'opt-horario', usage: 'Escena 4 · opción "Horario" y escena 5', description: 'Teo, junto a la mesa del maestro, señala la pizarra vacía.', characters: ['teo', 'andres'], emotionOrAction: 'Pedir ver el plan', background: 'Aula, pizarra.', alt: 'Teo pide a Andrés que le enseñe el plan.', motif: 'board-schedule', figures: [{ character: 'teo', mood: 'neutral' }, { character: 'andres', mood: 'neutral' }] }),
  option({ id: 'c-horario', usage: 'Escena 5 · consecuencia de "Horario"', description: 'Pizarra con el horario dibujado (cinco iconos). Teo lo recorre con el dedo.', characters: ['teo'], emotionOrAction: 'Alivio', background: 'Pizarra en primer plano.', alt: 'El plan dibujado en la pizarra; Teo lo recorre con el dedo.', motif: 'board-schedule', figures: [{ character: 'teo', mood: 'calm' }] }),
  option({ id: 'opt-adulto', usage: 'Escena 4 · opción "Adulto de confianza" y escena 5', description: 'Teo camina por el pasillo hacia la puerta abierta del aula de apoyo, donde está Pilar.', characters: ['teo', 'pilar'], emotionOrAction: 'Buscar apoyo', background: 'Pasillo, puerta del aula de apoyo.', alt: 'Teo va a buscar a Pilar, su maestra de apoyo.', motif: 'hallway', figures: [{ character: 'teo', mood: 'worried' }, { character: 'pilar', mood: 'happy' }] }),
  option({ id: 'c-adulto', usage: 'Escena 5 · consecuencia de "Adulto de confianza"', description: 'Pilar, Teo y Andrés hablando juntos en la puerta de la clase. Pilar apoya la mano en el hombro de Teo (si él lo acepta).', characters: ['pilar', 'teo', 'andres'], emotionOrAction: 'Seguridad, acompañamiento', background: 'Puerta de clase.', alt: 'Pilar acompaña a Teo a hablar con Andrés.', motif: 'classroom-door', figures: [{ character: 'pilar', mood: 'happy' }, { character: 'teo', mood: 'calm' }, { character: 'andres', mood: 'happy' }] }),
  option({ id: 'opt-regulacion', usage: 'Escena 4 · opción "Recurso para calmarse" y escena 5', description: 'Teo se pone los cascos verdes y aprieta una pelota blanda.', characters: ['teo'], emotionOrAction: 'Autorregulación sensorial', background: 'Mesa de Teo.', alt: 'Teo se pone los cascos y aprieta una pelota blanda.', motif: 'calm-corner', figures: [{ character: 'teo', mood: 'neutral' }] }),
  option({ id: 'c-regulacion', usage: 'Escena 5 · consecuencia de "Recurso para calmarse"', description: 'Misma composición; las ondas de ruido alrededor de Teo se han vuelto suaves y lejanas. Teo con expresión calmada.', characters: ['teo'], emotionOrAction: 'Calma', background: 'Mesa de Teo, ondas de sonido estilizadas.', alt: 'Con los cascos, el ruido se vuelve suave y Teo está más tranquilo.', motif: 'calm-corner', figures: [{ character: 'teo', mood: 'calm' }] }),
  option({ id: 'opt-tiempo', usage: 'Escena 4 · opción "Necesito tiempo" y escena 5', description: 'Teo enseña a Andrés su tarjeta de descanso (sin texto legible, un símbolo de pausa).', characters: ['teo', 'andres'], emotionOrAction: 'Pedir tiempo', background: 'Aula.', alt: 'Teo enseña su tarjeta a Andrés para pedir un momento.', motif: 'classroom', figures: [{ character: 'teo', mood: 'neutral' }, { character: 'andres', mood: 'neutral' }] }),
  option({ id: 'c-tiempo', usage: 'Escena 5 · consecuencia de "Necesito tiempo"', description: 'Teo, sentado junto a la puerta, observa a la clase que prepara sus cosas. Andrés le hace un gesto tranquilo desde lejos.', characters: ['teo', 'andres'], emotionOrAction: 'Ir a su ritmo', background: 'Aula vista desde la puerta.', alt: 'Teo observa desde la puerta mientras la clase se prepara.', motif: 'classroom-door', figures: [{ character: 'teo', mood: 'calm' }, { character: 'andres', mood: 'happy' }] }),
  option({ id: 'opt-salir', usage: 'Escena 4 · opción "Salir sin avisar" y escena 5', description: 'Teo en el pasillo vacío, apoyado en la pared, respirando. Sin dramatismo.', characters: ['teo'], emotionOrAction: 'Alivio momentáneo', background: 'Pasillo vacío, luz tranquila.', alt: 'Teo está solo en el pasillo, apoyado en la pared.', motif: 'hallway', figures: [{ character: 'teo', mood: 'calm' }] }),
  option({ id: 'c-salir', usage: 'Escena 5 · consecuencia de "Salir sin avisar"', description: 'Andrés sale de la clase mirando a ambos lados del pasillo, preocupado. Teo, al fondo, no le ha visto aún.', characters: ['andres', 'teo'], emotionOrAction: 'Preocupación del adulto (no enfado)', background: 'Pasillo.', alt: 'Andrés busca a Teo por el pasillo con cara de preocupación.', motif: 'hallway', figures: [{ character: 'andres', mood: 'worried' }, { character: 'teo', mood: 'neutral' }] }),

  // ───────── Viñetas del cómic ─────────
  panel({ id: 'k1-1', usage: 'Cómic · escena 1 · viñeta 1', description: 'Plano medio: Rosa se despide de Teo en la verja. Bocadillos: Rosa arriba a la derecha, Teo abajo a la izquierda.', characters: ['rosa', 'teo'], emotionOrAction: 'Despedida tranquila', background: 'Verja del colegio.', alt: 'Rosa se despide de Teo en la puerta del colegio.', motif: 'school-gate', figures: [{ character: 'rosa', mood: 'happy' }, { character: 'teo', mood: 'neutral' }] }),
  panel({ id: 'k1-2', usage: 'Cómic · escena 1 · viñeta 2', description: 'Pasillo lleno de movimiento, niños corriendo. Teo en primer plano. Zona arriba a la derecha para onomatopeya; abajo a la izquierda para pensamiento.', characters: ['teo'], emotionOrAction: 'Ruido', background: 'Pasillo.', alt: 'Teo en un pasillo lleno de niños corriendo.', motif: 'hallway', figures: [{ character: 'teo', mood: 'worried' }] }),
  panel({ id: 'k1-3', wide: true, usage: 'Cómic · escena 1 · viñeta 3', description: 'Primer plano de la mano de Teo dentro de la mochila tocando los cascos verdes.', characters: ['teo'], emotionOrAction: 'Seguridad', background: 'Interior de mochila, detalle.', alt: 'La mano de Teo toca sus cascos dentro de la mochila.', motif: 'calm-corner', figures: [{ character: 'teo', mood: 'calm' }] }),
  panel({ id: 'k2-1', usage: 'Cómic · escena 2 · viñeta 1', description: 'Teo ante la puerta de la clase, desde atrás. Arriba a la izquierda, espacio para pensamiento.', characters: ['teo'], emotionOrAction: 'Extrañeza', background: 'Puerta de clase.', alt: 'Teo se detiene ante la puerta de su clase.', motif: 'classroom-door', figures: [{ character: 'teo', mood: 'surprised' }] }),
  panel({ id: 'k2-2', usage: 'Cómic · escena 2 · viñeta 2', description: 'Andrés, plano medio, se presenta con la mano en el pecho. Espacio arriba a la derecha.', characters: ['andres'], emotionOrAction: 'Presentación amable', background: 'Aula.', alt: 'Andrés se presenta.', motif: 'classroom', figures: [{ character: 'andres', mood: 'happy' }] }),
  panel({ id: 'k2-3', wide: true, usage: 'Cómic · escena 2 · viñeta 3', description: 'Andrés mueve en la pizarra el dibujo de un pincel hacia la parte de la tarde. Espacio arriba a la izquierda.', characters: ['andres'], emotionOrAction: 'Explicar el cambio', background: 'Pizarra.', alt: 'Andrés mueve la plástica a la tarde en el horario de la pizarra.', motif: 'board-schedule', figures: [{ character: 'andres', mood: 'neutral' }] }),
  panel({ id: 'k2-4', wide: true, usage: 'Cómic · escena 2 · viñeta 4', description: 'Panorámica de la clase con las cuatro reacciones (ver ume-s2-reacciones). Bocadillos arriba a izquierda y derecha; comunicador de Lía abajo a la derecha.', characters: ['aya', 'bruno', 'lia', 'teo'], emotionOrAction: 'Reacciones diversas', background: 'Aula.', alt: 'Aya pregunta, Bruno protesta, Lía usa su comunicador y Teo mueve los dedos.', motif: 'classroom', figures: [{ character: 'aya', mood: 'curious' }, { character: 'bruno', mood: 'frustrated' }, { character: 'lia', mood: 'worried' }, { character: 'teo', mood: 'surprised' }] }),
  panel({ id: 'k3-1', usage: 'Cómic · escena 3 · viñeta 1', description: 'Nubi flota delante de la pizarra de dos columnas.', characters: ['nubi'], emotionOrAction: 'Pregunta abierta', background: 'Pizarra.', alt: 'Nubi pregunta qué sabemos.', motif: 'board-schedule', figures: [{ character: 'nubi', mood: 'thinking' }] }),
  panel({ id: 'k3-2', usage: 'Cómic · escena 3 · viñeta 2', description: 'Teo en su mesa con una gran burbuja de pensamiento (arriba a la izquierda).', characters: ['teo'], emotionOrAction: 'Dudas', background: 'Mesa.', alt: 'Teo piensa en sus dudas.', motif: 'classroom', figures: [{ character: 'teo', mood: 'thinking' }] }),
  panel({ id: 'k4-1', wide: true, usage: 'Cómic · escena 4 · viñeta 1', description: 'Teo en el centro; a su alrededor, seis pequeños caminos o puertas que representan posibilidades (sin texto).', characters: ['teo'], emotionOrAction: 'Considerar opciones', background: 'Fondo abstracto crema con caminos.', alt: 'Teo rodeado de varios caminos posibles.', motif: 'classroom', figures: [{ character: 'teo', mood: 'thinking' }] }),
  panel({ id: 'k6-1', usage: 'Cómic · escena 6 · viñeta 1', description: 'Teo y Andrés frente a la pizarra; Andrés empieza a dibujar. Bocadillos arriba izquierda y abajo derecha.', characters: ['teo', 'andres'], emotionOrAction: 'Colaboración', background: 'Pizarra.', alt: 'Teo pide a Andrés que dibuje el plan.', motif: 'board-schedule', figures: [{ character: 'teo', mood: 'neutral' }, { character: 'andres', mood: 'happy' }] }),
  panel({ id: 'k6-2', usage: 'Cómic · escena 6 · viñeta 2', description: 'Teo con cascos en la biblioteca, sosteniendo un libro de trenes. Ondas de sonido suaves al fondo.', characters: ['teo'], emotionOrAction: 'Calma', background: 'Biblioteca.', alt: 'Teo con sus cascos en la biblioteca.', motif: 'library', figures: [{ character: 'teo', mood: 'calm' }] }),
  panel({ id: 'k6-3', wide: true, usage: 'Cómic · escena 6 · viñeta 3', description: 'Bruno en un puf (izquierda), Aya junto a la estantería (derecha), Lía mostrando su comunicador (abajo derecha).', characters: ['bruno', 'aya', 'lia'], emotionOrAction: 'Estrategias distintas', background: 'Biblioteca.', alt: 'Bruno descansa, Aya busca libros y Lía usa su comunicador.', motif: 'library', figures: [{ character: 'bruno', mood: 'calm' }, { character: 'aya', mood: 'curious' }, { character: 'lia', mood: 'happy' }] }),
  panel({ id: 'k7-1', usage: 'Cómic · escena 7 · viñeta 1', description: 'Teo y Rosa salen por la verja. Bocadillos arriba derecha y abajo izquierda.', characters: ['teo', 'rosa'], emotionOrAction: 'Reencuentro', background: 'Verja del colegio a mediodía.', alt: 'Rosa recoge a Teo a la salida.', motif: 'school-gate', figures: [{ character: 'rosa', mood: 'happy' }, { character: 'teo', mood: 'neutral' }] }),
  panel({ id: 'k7-2', usage: 'Cómic · escena 7 · viñeta 2', description: 'Teo y Rosa caminando de espaldas por la acera; Nubi en el cielo.', characters: ['teo', 'rosa', 'nubi'], emotionOrAction: 'Cierre tranquilo', background: 'Calle arbolada.', alt: 'Teo y su abuela caminan hacia casa.', motif: 'park', figures: [{ character: 'teo', mood: 'happy' }, { character: 'rosa', mood: 'happy' }] }),
];

import type { Reference, ReferenceId } from '../engine/types.ts';

/**
 * Fundamentos pedagógicos. NUBI se inspira en estos marcos pero NO reproduce
 * sus materiales, personajes, actividades ni metodologías registradas.
 * Detalle completo en docs/PEDAGOGICAL_FOUNDATIONS.md.
 */
export const referenceList: Reference[] = [
  {
    id: 'bisquerra',
    authors: 'Rafael Bisquerra',
    work: 'Educación emocional y modelo de competencias emocionales',
    url: 'https://www.rafaelbisquerra.com/educacion-emocional/',
    verified:
      'Define la educación emocional como innovación educativa orientada a desarrollar competencias emocionales, organizadas en cinco bloques: conciencia emocional, regulación emocional, autonomía emocional, competencia social y competencias para la vida y el bienestar.',
    inNubi: 'Los objetivos de cada historia se etiquetan con uno de los cinco bloques. Las escenas trabajan primero la conciencia (nombrar) y después la regulación (herramientas).',
    limits: 'Usamos el marco de competencias como estructura curricular, no sus materiales.',
  },
  {
    id: 'ibarrola',
    authors: 'Begoña Ibarrola',
    work: 'Cuentos para la educación emocional',
    url: 'https://www.begoibarrola.com/cuentos',
    verified: 'Cuentos breves centrados cada uno en una emoción o valor, con materiales de acompañamiento para familias y docentes.',
    inNubi: 'Una historia = una situación y unas pocas emociones nombradas. Cada historia incluye guía para familias.',
    limits: 'No se reproducen sus cuentos, personajes ni fichas. Las historias de NUBI son originales.',
  },
  {
    id: 'gray',
    authors: 'Carol Gray',
    work: 'Social Stories™',
    url: 'https://carolgraysocialstories.com/social-stories/what-is-a-social-story/',
    verified:
      'Una Social Story describe con precisión un tema relevante para la persona siguiendo diez criterios definidos, con un enfoque descriptivo, significativo, respetuoso, paciente y que garantiza la seguridad física, social y emocional.',
    inNubi:
      'El tono narrativo de NUBI es descriptivo, paciente y sin juicios: describe qué pasa y qué piensan o sienten las personas antes de sugerir opciones.',
    limits:
      'Las historias de NUBI NO son Social Stories™ ni afirman cumplir sus diez criterios. «Social Stories» es marca registrada; no usamos el término para nuestros contenidos.',
  },
  {
    id: 'zones',
    authors: 'Leah Kuypers',
    work: 'The Zones of Regulation®',
    url: 'https://zonesofregulation.com/curriculum/',
    verified:
      'Currículo de regulación emocional para mayores de 4 años, presentado como compatible con distintos neurotipos y preferencias de comunicación, que construye un lenguaje común y enseña habilidades de regulación practicables.',
    inNubi: 'La regulación se presenta como habilidades que se aprenden y practican con herramientas concretas, y como algo que se hace también con otras personas (corregulación).',
    limits: 'No usamos su sistema de zonas de colores, sus nombres ni sus materiales. Es una marca registrada con licencia propia.',
  },
  {
    id: 'five-point-scale',
    authors: 'Kari Dunn Buron y Mitzi Curtis',
    work: 'The Incredible 5-Point Scale',
    verified:
      'Escala personalizada de 1 a 5 para reconocer niveles de una emoción o conducta, asociando cada nivel a cómo se ve, cómo se siente y qué se puede intentar. (Verificación parcial: ficha de aula de terceros; falta consultar la obra original.)',
    inNubi:
      'En «¿Cómo te sentirías?» se puede indicar opcionalmente cuánto (un poco / bastante / mucho). Es una escala propia, de tres niveles, sin números ni colores.',
    limits: 'No reproducimos la escala de 5 puntos ni su formato. Pendiente de validar si 3 niveles son suficientes.',
  },
  {
    id: 'social-situation-mapping',
    authors: 'Michelle Garcia Winner y Pamela Crooke',
    work: 'Social Situation Mapping (antes Social Behavior Mapping)',
    url: 'https://www.socialthinking.com/products/social-situation-mapping',
    verified:
      'Herramienta del marco Social Thinking® (revisada en 2023) para observar la situación y decidir qué hacer o decir, relacionando acciones, cómo pueden sentirse los demás, consecuencias y cómo se siente uno.',
    inNubi:
      'Cada opción de una decisión muestra: lo que puede pasar, cómo pueden sentirse otros, cómo te puedes sentir tú y cuándo puede ayudar. No usamos la dicotomía «esperado/inesperado».',
    limits: 'No reproducimos los mapas, plantillas ni terminología de Social Thinking®.',
  },
  {
    id: 'neurodiversity-affirming',
    authors: 'Enfoque de afirmación de la neurodiversidad',
    work: 'Principios transversales de NUBI',
    verified: 'Principio de diseño adoptado por el proyecto (no es una fuente única).',
    inNubi:
      'Todas las formas de comunicación valen; pedir ayuda es normal; no se exige contacto visual; no se penaliza la autorregulación inocua (moverse, balancearse, mover las manos); no se enseña a ocultar emociones; siempre hay varias opciones válidas.',
    limits: 'Propuesta propia: requiere validación con personas autistas, familias y profesionales.',
  },
];

export const references: Record<ReferenceId, Reference> = Object.fromEntries(referenceList.map((r) => [r.id, r])) as Record<
  ReferenceId,
  Reference
>;

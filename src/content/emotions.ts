import type { Emotion, EmotionId } from '../engine/types.ts';

/**
 * "Mis emociones". Todas son válidas. Cada una se puede notar de formas distintas
 * en cada persona: nunca se describe una sola manera "normal" de sentir.
 */
export const emotionList: Emotion[] = [
  {
    id: 'alegria',
    name: 'Alegría',
    childText: 'Cuando algo te gusta o sale como esperabas.',
    icon: 'sun',
    mood: 'happy',
    illustration: 'emo-alegria',
    mayFeelLike: ['Ganas de moverte o saltar', 'Ganas de contarlo', 'Una sensación tranquila y calentita', 'A veces, ganas de estar solo disfrutándolo'],
    tools: ['comunicar-necesidad'],
  },
  {
    id: 'calma',
    name: 'Calma',
    childText: 'Cuando el cuerpo y la cabeza van despacio.',
    icon: 'leaf',
    mood: 'calm',
    illustration: 'emo-calma',
    mayFeelLike: ['Respiras despacio', 'Los músculos están blandos', 'Te puedes concentrar en lo que te gusta'],
    tools: ['espacio-tranquilo'],
  },
  {
    id: 'sorpresa',
    name: 'Sorpresa',
    childText: 'Cuando pasa algo que no esperabas.',
    icon: 'spark',
    mood: 'surprised',
    illustration: 'emo-sorpresa',
    mayFeelLike: ['Te quedas quieto o quieta', 'Abres mucho los ojos', 'El corazón va rápido', 'Necesitas un momento para entender qué pasa'],
    tools: ['anticipar-cambios', 'pedir-ayuda'],
  },
  {
    id: 'curiosidad',
    name: 'Curiosidad',
    childText: 'Cuando quieres saber más sobre algo.',
    icon: 'search',
    mood: 'curious',
    illustration: 'emo-curiosidad',
    mayFeelLike: ['Muchas preguntas en la cabeza', 'Ganas de mirar de cerca', 'Ganas de probar'],
    tools: ['anticipar-cambios'],
  },
  {
    id: 'inseguridad',
    name: 'Inseguridad',
    childText: 'Cuando no sabes bien qué va a pasar o qué hacer.',
    icon: 'cloud',
    mood: 'worried',
    illustration: 'emo-inseguridad',
    mayFeelLike: ['Cosquillas o nudo en la tripa', 'Ganas de quedarte cerca de alguien', 'Muchas preguntas', 'Ganas de esperar y mirar primero'],
    tools: ['anticipar-cambios', 'pedir-ayuda', 'comunicar-necesidad'],
  },
  {
    id: 'frustracion',
    name: 'Frustración',
    childText: 'Cuando algo no sale como querías o esperabas.',
    icon: 'knot',
    mood: 'frustrated',
    illustration: 'emo-frustracion',
    mayFeelLike: ['Calor en la cara', 'Ganas de protestar', 'Ganas de dejarlo todo', 'Los puños apretados'],
    tools: ['expresar-desacuerdo', 'descansar'],
  },
  {
    id: 'tristeza',
    name: 'Tristeza',
    childText: 'Cuando echas algo de menos o algo te duele por dentro.',
    icon: 'drop',
    mood: 'worried',
    illustration: 'emo-tristeza',
    mayFeelLike: ['Ganas de llorar', 'El cuerpo pesa', 'Ganas de estar con alguien… o de estar solo'],
    tools: ['pedir-ayuda', 'espacio-tranquilo'],
  },
  {
    id: 'enfado',
    name: 'Enfado',
    childText: 'Cuando algo te parece injusto o te molesta mucho.',
    icon: 'flame',
    mood: 'frustrated',
    illustration: 'emo-enfado',
    mayFeelLike: ['Mucha energía en el cuerpo', 'Ganas de gritar', 'Calor', 'Ganas de alejarte'],
    tools: ['descansar', 'espacio-tranquilo', 'expresar-desacuerdo'],
  },
  {
    id: 'cansancio',
    name: 'Cansancio',
    childText: 'Cuando el cuerpo o la cabeza necesitan parar.',
    icon: 'moon',
    mood: 'calm',
    illustration: 'emo-cansancio',
    mayFeelLike: ['Bostezos', 'Te cuesta escuchar', 'Los ruidos molestan más', 'Ganas de tumbarte'],
    tools: ['descansar', 'apoyos-sensoriales'],
  },
];

export const emotions: Record<EmotionId, Emotion> = Object.fromEntries(emotionList.map((e) => [e.id, e])) as Record<
  EmotionId,
  Emotion
>;

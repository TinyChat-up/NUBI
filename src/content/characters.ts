import type { Character } from '../engine/types.ts';

/**
 * Reparto provisional. Los nombres y descripciones son originales de NUBI.
 * La apariencia definitiva la producirá el equipo de ilustración (docs/ASSET_REQUESTS.md).
 */
export const characters: Record<string, Character> = {
  nubi: {
    id: 'nubi',
    name: 'Nubi',
    role: 'Guía del mundo de historias',
    visual:
      'Pequeña nube redondeada, color crema cálido con borde azul petróleo suave, ojos de punto, mejillas coral. Sin boca grande ni gestos exagerados. Flota a poca altura. Diseño maestro editorial en docs/art-direction/models/nubi.webp.',
    traits: 'Hace preguntas abiertas, nunca juzga. Habla en frases cortas. Recuerda que cada persona siente a su manera.',
    color: '#F4EAD7',
    isGuide: true,
  },
  teo: {
    id: 'teo',
    name: 'Teo',
    role: 'Protagonista · 8 años',
    visual:
      'Niño de 8 años, pelo castaño despeinado, sudadera azul petróleo con capucha, mochila mostaza con un llavero de tren. Lleva unos cascos antirruido verdes colgados de la mochila.',
    traits:
      'Le encantan los mapas y los trenes. Saber el plan del día le ayuda a estar tranquilo. Cuando piensa, mueve los dedos: es su forma de ordenarse y nadie se lo impide.',
    color: '#2B6E7A',
  },
  aya: {
    id: 'aya',
    name: 'Aya',
    role: 'Compañera de clase',
    visual: 'Niña de 8 años, pelo negro recogido en dos moños, jersey coral, gafas redondas.',
    traits: 'Curiosa. Ante algo nuevo, quiere saberlo todo y hace muchas preguntas.',
    color: '#E2704F',
  },
  bruno: {
    id: 'bruno',
    name: 'Bruno',
    role: 'Compañero de clase',
    visual: 'Niño de 9 años, pelo rizado pelirrojo, camiseta mostaza, rodilleras de jugar al fútbol.',
    traits: 'Cuando algo cambia sin avisar se frustra. Lo dice en voz alta y después necesita un rato.',
    color: '#E3AE4C',
  },
  lia: {
    id: 'lia',
    name: 'Lía',
    role: 'Compañera de clase',
    visual:
      'Niña de 7 años, pelo corto rubio oscuro con horquilla de estrella, peto verde salvia. Lleva una tableta pequeña de comunicación con pictogramas en una funda con asa.',
    traits:
      'Se comunica sobre todo con su comunicador de pictogramas y con gestos. A veces se siente insegura ante lo nuevo.',
    color: '#6A8C69',
  },
  andres: {
    id: 'andres',
    name: 'Andrés',
    role: 'Maestro sustituto',
    visual: 'Adulto de unos 35 años, barba corta, camisa de cuadros azul y crema, sonrisa tranquila, lleva una carpeta.',
    traits: 'Nuevo en el cole. Amable y paciente. Cuando se lo piden, dibuja el plan en la pizarra.',
    color: '#3F5D7A',
  },
  carmen: {
    id: 'carmen',
    name: 'Carmen',
    role: 'Maestra de siempre',
    visual: 'Adulta de unos 50 años, pelo gris corto, chaqueta de punto coral, pendientes de botón.',
    traits: 'La maestra habitual de la clase. Hoy no está.',
    color: '#C9573F',
  },
  pilar: {
    id: 'pilar',
    name: 'Pilar',
    role: 'Maestra de apoyo',
    visual: 'Adulta de unos 40 años, pelo largo oscuro trenzado, jersey verde salvia, colgante de madera.',
    traits: 'Conoce bien a Teo. Es una persona de confianza a la que se puede acudir.',
    color: '#7A5C8A',
  },
  rosa: {
    id: 'rosa',
    name: 'Rosa',
    role: 'Abuela de Teo',
    visual: 'Adulta mayor, pelo blanco recogido, abrigo mostaza, bufanda azul.',
    traits: 'Acompaña a Teo al colegio cada mañana.',
    color: '#B98A3E',
  },
};

export const getCharacter = (id: string): Character | undefined => characters[id];

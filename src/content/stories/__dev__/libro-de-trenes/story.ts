/**
 * «EL LIBRO DE TRENES» — cuento 2 (SOLO DESARROLLO, fase 22).
 *
 * Guion: docs/stories/STORY_02_PROPOSAL.md · Mapa: docs/stories/STORY_02_BRANCH_MAP.md.
 * PROPUESTA PENDIENTE DE APROBACIÓN EDITORIAL. No está en la biblioteca, no está validado y no debe publicarse.
 * Los textos son los del guion, sin cambios. Las ilustraciones marcadas como provisional son marcadores.
 */
import type { Story } from '../../../../engine/types.ts';

export const libroDeTrenes: Story = {
  id: 'libro-de-trenes',
  title: 'El libro de trenes',
  tagline: 'Teo quiere seguir leyendo. Lía quiere mirar los trenes.',
  synopsis:
    'Es la hora de la biblioteca. Teo lee su libro de trenes con los cascos puestos. Lía se acerca y quiere mirarlo con él. Cada uno puede hacer algo distinto, y la tarde puede seguir de tres formas.',
  place: 'colegio',
  ages: { min: 6, max: 12 },
  durationMinutes: { min: 3, max: 6 },
  formats: ['cuento'],
  cover: 'lt-cover',
  objectives: [],
  characters: ['teo', 'lia', 'aya', 'nubi'],
  strategies: ['comunicar-necesidad', 'apoyos-sensoriales', 'expresar-desacuerdo'],
  recreations: [],
  engineVersion: 2,
  scenes: [
    // P1 · Situación
    {
      id: 'lt-leer',
      number: 1,
      title: 'En la biblioteca',
      purpose: 'Teo está tranquilo, leyendo con sus cascos.',
      role: 'situacion',
      next: 'lt-lia',
      steps: [{ type: 'beat', id: 'lt-p1', illustration: 'ume-k6-2', text: 'Es la hora de la biblioteca. Teo lee su libro de trenes con los cascos puestos.' }],
    },
    // P2 · Lía se acerca (+ pregunta emocional opcional sobre Teo, P3)
    {
      id: 'lt-lia',
      number: 2,
      title: 'Lía se acerca',
      purpose: 'Lía quiere compartir el libro. Pregunta opcional: cómo podría sentirse Teo.',
      role: 'situacion',
      next: 'lt-decidir-1',
      steps: [
        { type: 'beat', id: 'lt-p2a', illustration: 'ume-s6-biblioteca', text: 'Lía se acerca. Teo no la oye, pero ve su comunicador.' },
        { type: 'beat', id: 'lt-p2b', illustration: 'ume-s6-biblioteca', speaker: 'lia', text: 'QUIERO · MIRAR · TRENES' },
        {
          type: 'feelings',
          id: 'lt-sentir-teo',
          prompt: '¿Cómo podría sentirse Teo?',
          help: 'Puedes elegir varias. O ninguna.',
          options: [
            { id: 'sorpresa', label: 'Sorpresa', emotion: 'sorpresa', icon: 'spark' },
            { id: 'curiosidad', label: 'Curiosidad', emotion: 'curiosidad', icon: 'search' },
            { id: 'tranquilidad', label: 'Tranquilidad', emotion: 'calma', icon: 'leaf' },
            { id: 'seguir-leyendo', label: 'Ganas de seguir leyendo', icon: 'book' },
            { id: 'inseguridad', label: 'Nervios o inseguridad', emotion: 'inseguridad', icon: 'cloud' },
            { id: 'otra', label: 'Otra cosa', icon: 'dots' },
            { id: 'no-lo-se', label: 'No lo sé', icon: 'question' },
          ],
        },
      ],
    },
    // P4 · Decisión 1
    {
      id: 'lt-decidir-1',
      number: 3,
      title: '¿Qué podría hacer Teo?',
      purpose: 'Primera decisión: dos alternativas, ninguna mejor.',
      role: 'decision',
      next: 'lt-espera',
      steps: [
        {
          type: 'choice',
          id: 'lt-elegir-1',
          prompt: '¿Qué podría hacer Teo?',
          help: 'Elige una. Después puedes probar la otra.',
          next: 'lt-espera',
          options: [
            { id: 'ensenar', label: 'Enseñarle el libro a Lía', icon: 'book', illustration: 'lt-opt-ensenar', next: 'lt-juntos' },
            { id: 'seguir', label: 'Seguir leyendo', icon: 'book', illustration: 'ume-k6-2', next: 'lt-espera' },
          ],
        },
      ],
    },
    // FINAL A
    {
      id: 'lt-juntos',
      number: 4,
      title: 'Mirar los trenes juntos',
      purpose: 'Final A: Teo y Lía miran el libro juntos.',
      role: 'final',
      ending: { id: 'final-juntos', title: 'Mirar los trenes juntos' },
      steps: [{ type: 'beat', id: 'lt-p5a', illustration: 'lt-juntos', text: 'Teo gira el libro. Lía señala un tren. Los dos miran los dibujos.' }],
    },
    // P5b + P5c (opcional, perspectiva de Lía) · consecuencia B
    {
      id: 'lt-espera',
      number: 5,
      title: 'Lía espera',
      purpose: 'Lía espera junto a Teo sin saber si la ha visto. Pregunta opcional: cómo podría sentirse Lía.',
      role: 'consecuencia',
      next: 'lt-decidir-2',
      steps: [
        { type: 'beat', id: 'lt-p5b', illustration: 'lt-espera', text: 'Teo sigue leyendo. Lía espera a su lado. No sabe si Teo la ha visto.' },
        {
          type: 'feelings',
          id: 'lt-sentir-lia',
          prompt: '¿Cómo podría sentirse Lía?',
          help: 'Puedes elegir varias. O ninguna.',
          options: [
            { id: 'curiosidad', label: 'Curiosidad', emotion: 'curiosidad', icon: 'search' },
            { id: 'tristeza', label: 'Tristeza', emotion: 'tristeza', icon: 'drop' },
            { id: 'tranquilidad', label: 'Tranquilidad', emotion: 'calma', icon: 'leaf' },
            { id: 'sorpresa', label: 'Sorpresa', emotion: 'sorpresa', icon: 'spark' },
            { id: 'otra', label: 'Otra cosa', icon: 'dots' },
            { id: 'no-lo-se', label: 'No lo sé', icon: 'question' },
          ],
        },
      ],
    },
    // P6 · Decisión 2
    {
      id: 'lt-decidir-2',
      number: 6,
      title: '¿Qué podría hacer Teo ahora?',
      purpose: 'Segunda decisión: dos alternativas dentro de la rama B.',
      role: 'decision',
      next: 'lt-con-aya',
      steps: [
        {
          type: 'choice',
          id: 'lt-elegir-2',
          prompt: '¿Qué podría hacer Teo ahora?',
          help: 'Elige una. Después puedes probar la otra.',
          next: 'lt-con-aya',
          options: [
            { id: 'luego', label: 'Decirle: «Ahora no. Luego sí»', icon: 'arrow-right', illustration: 'lt-opt-luego', next: 'lt-luego' },
            { id: 'sin-decir', label: 'Seguir sin decir nada', icon: 'arrow-right', illustration: 'lt-espera', next: 'lt-con-aya' },
          ],
        },
      ],
    },
    // FINAL B1
    {
      id: 'lt-luego',
      number: 7,
      title: 'Ahora no, luego sí',
      purpose: 'Final B1: Teo le avisa a Lía y miran los trenes más tarde.',
      role: 'final',
      ending: { id: 'final-luego', title: 'Ahora no, luego sí' },
      steps: [
        {
          type: 'beat',
          id: 'lt-pb1',
          illustration: 'lt-luego',
          text: 'Teo le hace a Lía su gesto de «luego». Lía lo entiende y lee con Aya. Más tarde, miran los trenes juntos.',
        },
      ],
    },
    // P7 · Consecuencia B2 + oferta de Nubi + final B2
    {
      id: 'lt-con-aya',
      number: 8,
      title: 'Cada uno con su libro',
      purpose: 'Final B2: Lía se va con Aya; Nubi ofrece otra forma, sin imponerla.',
      role: 'final',
      offer: true,
      ending: { id: 'final-cada-uno', title: 'Cada uno con su libro' },
      steps: [{ type: 'beat', id: 'lt-p7', illustration: 'lt-con-aya', text: 'Lía se va con Aya. Miran juntas un libro de volcanes.' }],
    },
  ],
  familyGuide: {
    intro: 'PROPUESTA PROVISIONAL DE DESARROLLO. Guía pendiente de aprobación editorial (STORY_02_PROPOSAL.md §5).',
    beforeReading: ['Es un cuento sobre querer seguir con lo tuyo cuando otra persona quiere compartirlo.', 'Lía se comunica con un comunicador de pictogramas.'],
    duringReading: ['No hay respuesta correcta. Seguir leyendo es una opción válida.', 'Los otros caminos se pueden explorar otro día.'],
    afterReading: ['¿Tienes una forma de decir «luego»?', 'Si quiere, preparad juntos una tarjeta o un gesto de «luego».'],
    dailyPractice: [],
    pendingActivities: [],
    resources: [],
    pauseSignals: ['Si el cuento le recuerda una situación difícil, dejadlo para otro día.'],
    respectNotes: ['No se pide contacto visual.', 'Todas las formas de comunicarse son válidas.', 'Las respuestas no se evalúan.'],
  },
  references: [],
  validation: {
    status: 'borrador',
    notes: 'PROPUESTA PROVISIONAL DE DESARROLLO. Guion pendiente de aprobación editorial. No validado. No publicar.',
  },
};

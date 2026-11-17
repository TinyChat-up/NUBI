/**
 * HISTORIA TÉCNICA DE PRUEBA (fase 21) — NO ES CONTENIDO EDUCATIVO.
 *
 * Sirve solo para probar el motor ramificado en tests y en la ruta de desarrollo `/dev/historia-ramificada`.
 * No está en la biblioteca (`storyList`), no tiene ilustraciones definitivas (usa placeholders) y su texto es
 * deliberadamente técnico. No debe publicarse ni presentarse como cuento aprobado.
 *
 *   t-situacion ─▶ t-decision-1 ─┬─ Camino A ─▶ t-rama-a ─▶ t-decision-2 ─┬─ Camino A1 ─▶ t-fin-a1 (final)
 *   (pregunta                     │                                       └─ Camino A2 ─▶ t-fin-a2 (final)
 *    emocional opcional)          └─ Camino B ─▶ t-rama-b (Nubi ofrece otra forma) ─▶ t-fin-b (final)
 */
import { defineAsset } from '../../assets/helpers.ts';
import type { AssetSpec, ComicPanel, Story } from '../../../engine/types.ts';

const art = (id: string, kind: 'escena' | 'opcion' | 'cubierta', motif: AssetSpec['placeholder']['motif'], alt: string): AssetSpec =>
  defineAsset(kind, {
    id,
    file: `/dev/${id}.webp`, // no existe: el recurso está «pendiente» y se dibuja su placeholder
    usage: 'Historia técnica de prueba (solo desarrollo)',
    description: 'Placeholder técnico. No es una ilustración del proyecto.',
    characters: ['teo'],
    aspect: '4:3',
    alt,
    placeholder: { motif, figures: [{ character: 'teo', mood: 'neutral' }], tint: 'crema' },
  });

export const branchingTestAssets: AssetSpec[] = [
  art('test-cover', 'cubierta', 'landscape', 'Portada de prueba.'),
  art('test-situacion', 'escena', 'park', 'Escena de prueba: un camino.'),
  art('test-decision', 'escena', 'park', 'Escena de prueba: dos caminos.'),
  art('test-opt-a', 'opcion', 'school-gate', 'Opción de prueba A.'),
  art('test-opt-b', 'opcion', 'hallway', 'Opción de prueba B.'),
  art('test-rama-a', 'escena', 'school-gate', 'Rama de prueba A.'),
  art('test-rama-b', 'escena', 'hallway', 'Rama de prueba B.'),
  art('test-opt-a1', 'opcion', 'classroom', 'Opción de prueba A1.'),
  art('test-opt-a2', 'opcion', 'library', 'Opción de prueba A2.'),
  art('test-fin-a1', 'escena', 'classroom', 'Final de prueba A1.'),
  art('test-fin-a2', 'escena', 'library', 'Final de prueba A2.'),
  art('test-fin-b', 'escena', 'calm-corner', 'Final de prueba B.'),
];

const panel = (id: string, illustration: string, caption: string): ComicPanel[] => [{ id, illustration, span: 'full', caption, bubbles: [] }];

export const branchingTestStory: Story = {
  id: 'prueba-ramificada',
  title: 'Historia técnica de prueba',
  tagline: 'Solo para probar el motor ramificado. No es un cuento.',
  synopsis: 'Historia técnica para pruebas automatizadas: dos decisiones y tres finales.',
  place: 'colegio',
  ages: { min: 6, max: 12 },
  durationMinutes: { min: 1, max: 2 },
  formats: ['cuento', 'comic'],
  cover: 'test-cover',
  objectives: [],
  characters: ['teo'],
  strategies: [],
  recreations: [],
  engineVersion: 2,
  scenes: [
    {
      id: 't-situacion',
      number: 1,
      title: 'Situación de prueba',
      purpose: 'Prueba técnica: situación inicial y pregunta emocional opcional.',
      role: 'situacion',
      next: 't-decision-1',
      steps: [
        { type: 'beat', id: 't-s1', illustration: 'test-situacion', text: 'Prueba: Teo llega a un camino.' },
        { type: 'beat', id: 't-s2', illustration: 'test-situacion', text: 'Prueba: el camino se divide en dos.' },
        {
          type: 'feelings',
          id: 't-sentir',
          prompt: 'Prueba: ¿cómo podría sentirse Teo?',
          help: 'Puedes elegir varias. O ninguna.',
          options: [
            { id: 'sorpresa', label: 'Sorpresa', emotion: 'sorpresa', icon: 'spark' },
            { id: 'calma', label: 'Tranquilidad', emotion: 'calma', icon: 'leaf' },
            { id: 'otra', label: 'Otra cosa', icon: 'dots' },
            { id: 'no-lo-se', label: 'No lo sé', icon: 'question' },
          ],
        },
      ],
      comic: panel('tk-s', 'test-situacion', 'Prueba: Teo llega a un camino que se divide en dos.'),
    },
    {
      id: 't-decision-1',
      number: 2,
      title: 'Primera decisión de prueba',
      purpose: 'Prueba técnica: decisión con dos opciones que llevan a ramas distintas.',
      role: 'decision',
      steps: [
        { type: 'beat', id: 't-d1', illustration: 'test-decision', text: 'Prueba: hay dos caminos.' },
        {
          type: 'choice',
          id: 't-elegir-1',
          prompt: '¿Qué podría hacer Teo?',
          help: 'Prueba: elige un camino.',
          next: 't-rama-a',
          options: [
            { id: 'a', label: 'Camino A', icon: 'arrow-right', illustration: 'test-opt-a', next: 't-rama-a' },
            { id: 'b', label: 'Camino B', icon: 'arrow-right', illustration: 'test-opt-b', next: 't-rama-b' },
          ],
        },
      ],
      comic: panel('tk-d1', 'test-decision', 'Prueba: hay dos caminos.'),
    },
    {
      id: 't-rama-a',
      number: 3,
      title: 'Rama A de prueba',
      purpose: 'Prueba técnica: consecuencia de la opción A, que lleva a otra decisión.',
      role: 'consecuencia',
      next: 't-decision-2',
      steps: [{ type: 'beat', id: 't-a1', illustration: 'test-rama-a', text: 'Prueba: rama A. Aparece otra decisión.' }],
      comic: panel('tk-a', 'test-rama-a', 'Prueba: rama A.'),
    },
    {
      id: 't-decision-2',
      number: 4,
      title: 'Segunda decisión de prueba',
      purpose: 'Prueba técnica: decisión dentro de una rama.',
      role: 'decision',
      steps: [
        { type: 'beat', id: 't-d2', illustration: 'test-rama-a', text: 'Prueba: dos caminos más.' },
        {
          type: 'choice',
          id: 't-elegir-2',
          prompt: '¿Y ahora qué podría hacer Teo?',
          next: 't-fin-a1',
          options: [
            { id: 'a1', label: 'Camino A1', icon: 'arrow-right', illustration: 'test-opt-a1', next: 't-fin-a1' },
            { id: 'a2', label: 'Camino A2', icon: 'arrow-right', illustration: 'test-opt-a2', next: 't-fin-a2' },
          ],
        },
      ],
      comic: panel('tk-d2', 'test-rama-a', 'Prueba: dos caminos más.'),
    },
    {
      id: 't-rama-b',
      number: 5,
      title: 'Rama B de prueba',
      purpose: 'Prueba técnica: consecuencia con una dificultad; Nubi ofrece probar otra forma.',
      role: 'consecuencia',
      offer: true,
      next: 't-fin-b',
      steps: [{ type: 'beat', id: 't-b1', illustration: 'test-rama-b', text: 'Prueba: rama B. Aparece una dificultad.' }],
      comic: panel('tk-b', 'test-rama-b', 'Prueba: rama B.'),
    },
    {
      id: 't-fin-a1',
      number: 6,
      title: 'Final de prueba A1',
      purpose: 'Prueba técnica: final.',
      role: 'final',
      ending: { id: 'final-a1', title: 'Final de prueba A1' },
      steps: [{ type: 'beat', id: 't-fa1', illustration: 'test-fin-a1', text: 'Prueba: final A1.' }],
      comic: panel('tk-fa1', 'test-fin-a1', 'Prueba: final A1.'),
    },
    {
      id: 't-fin-a2',
      number: 7,
      title: 'Final de prueba A2',
      purpose: 'Prueba técnica: final.',
      role: 'final',
      ending: { id: 'final-a2', title: 'Final de prueba A2' },
      steps: [{ type: 'beat', id: 't-fa2', illustration: 'test-fin-a2', text: 'Prueba: final A2.' }],
      comic: panel('tk-fa2', 'test-fin-a2', 'Prueba: final A2.'),
    },
    {
      id: 't-fin-b',
      number: 8,
      title: 'Final de prueba B',
      purpose: 'Prueba técnica: final.',
      role: 'final',
      ending: { id: 'final-b', title: 'Final de prueba B' },
      steps: [{ type: 'beat', id: 't-fb', illustration: 'test-fin-b', text: 'Prueba: final B.' }],
      comic: panel('tk-fb', 'test-fin-b', 'Prueba: final B.'),
    },
  ],
  familyGuide: {
    intro: 'Historia técnica de prueba. No tiene guía.',
    beforeReading: [],
    duringReading: [],
    afterReading: [],
    dailyPractice: [],
    pendingActivities: [],
    resources: [],
    pauseSignals: [],
    respectNotes: [],
  },
  references: [],
  validation: { status: 'borrador', notes: 'Solo para pruebas automatizadas. No es contenido educativo ni debe publicarse.' },
};

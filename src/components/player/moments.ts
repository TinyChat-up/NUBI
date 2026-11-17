import type { Scene, SceneId, Story } from '../../engine/types.ts';

/**
 * Los tres momentos de un cuento social (fase 19). Son una forma de PRESENTAR la historia,
 * no secciones de navegación ni datos nuevos: se deducen de su estructura.
 *
 * - `pasa`: las escenas anteriores a la primera decisión («Qué está pasando»).
 * - `decide`: la escena que contiene la decisión («¿Qué podría hacer …?»).
 * - `despues`: lo que sigue (consecuencias, lo que pasó y el cierre).
 *
 * Una historia sin decisiones queda entera en `pasa`. No cambia el motor, las escenas
 * ni las partidas guardadas: solo cómo se agrupan en pantalla.
 */
export type MomentId = 'pasa' | 'decide' | 'despues';

export interface Moment {
  id: MomentId;
  number: 1 | 2 | 3;
  /** Nombre corto para la barra del lector. */
  label: string;
  scenes: Scene[];
}

const hasChoice = (scene: Scene) => scene.steps.some((s) => s.type === 'choice');

/** Nombre del protagonista (primer personaje de la historia), para «¿Qué podría hacer Teo?». */
export function protagonistName(story: Story, names: Record<string, { name: string }>): string {
  return names[story.characters[0]]?.name ?? 'el personaje';
}

export function storyMoments(story: Story, protagonist: string): Moment[] {
  const first = story.scenes.findIndex(hasChoice);
  const labels: Record<MomentId, string> = {
    pasa: 'Qué está pasando',
    decide: `¿Qué podría hacer ${protagonist}?`,
    despues: 'Qué podría pasar',
  };
  const groups: Record<MomentId, Scene[]> = { pasa: [], decide: [], despues: [] };
  // Fase 21: si la historia declara el papel de sus escenas (ramificadas), manda el papel, no la posición.
  const byRole: Record<NonNullable<Scene['role']>, MomentId> = { situacion: 'pasa', decision: 'decide', consecuencia: 'despues', final: 'despues' };
  const declared = story.scenes.some((sc) => sc.role);
  story.scenes.forEach((scene, i) => {
    const id: MomentId = declared
      ? byRole[scene.role ?? (hasChoice(scene) ? 'decision' : 'consecuencia')]
      : first < 0 || i < first ? 'pasa' : i === first ? 'decide' : 'despues';
    groups[id].push(scene);
  });
  return (['pasa', 'decide', 'despues'] as const)
    .map((id, i) => ({ id, number: (i + 1) as 1 | 2 | 3, label: labels[id], scenes: groups[id] }))
    .filter((m) => m.scenes.length > 0);
}

export function momentOf(moments: Moment[], sceneId: SceneId): Moment {
  return moments.find((m) => m.scenes.some((s) => s.id === sceneId)) ?? moments[0];
}

/** ¿Empieza aquí un momento? (primera escena del grupo) */
export function startsMoment(moments: Moment[], sceneId: SceneId): Moment | undefined {
  return moments.find((m) => m.scenes[0]?.id === sceneId);
}

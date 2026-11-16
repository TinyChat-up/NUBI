import { describe, expect, it } from 'vitest';
import { createRun, type RunState } from '../../engine/storyEngine.ts';
import { unaMananaDiferente as story } from '../../content/stories/una-manana-diferente/story.ts';
import { pageGroup } from './presentation.ts';

const at = (sceneId: string, stepIndex: number): RunState => {
  const run = createRun(story, 'cuento', sceneId);
  return { ...run, position: { sceneId, stepIndex } };
};

describe('pageGroup (páginas que comparten ilustración)', () => {
  it('agrupa las páginas seguidas con la misma ilustración, incluida la actual', () => {
    // Escena «cambio»: s2-puerta, s2-anuncio ×2, s2-reacciones ×3, pregunta.
    expect(pageGroup(story, at('cambio', 1)).map((g) => g.index)).toEqual([1, 2]);
    expect(pageGroup(story, at('cambio', 4)).map((g) => g.index)).toEqual([3, 4, 5]);
    expect(pageGroup(story, at('cambio', 0)).map((g) => g.index)).toEqual([0]);
  });

  it('todas las páginas del grupo usan la ilustración de la actual', () => {
    const group = pageGroup(story, at('estrategias', 2));
    expect(new Set(group.map((g) => g.beat.illustration))).toEqual(new Set(['ume-s6-biblioteca']));
    expect(group.map((g) => g.index)).toEqual([1, 2, 3]);
  });

  it('devuelve un grupo vacío fuera de las páginas de cuento', () => {
    expect(pageGroup(story, at('cambio', 6))).toEqual([]);
  });
});

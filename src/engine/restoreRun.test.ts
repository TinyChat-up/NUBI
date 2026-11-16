import { describe, expect, it } from 'vitest';
import { unaMananaDiferente as story } from '../content/stories/una-manana-diferente/story.ts';
import { createRun } from './storyEngine.ts';
import { restoreRun } from './restoreRun.ts';

describe('recuperación de progreso no fiable', () => {
  it('descarta la partida incompleta que dejaba la pantalla en blanco', () => {
    expect(restoreRun(story, 'cuento', { storyId: story.id, position: { sceneId: 'llegada', stepIndex: 0 } })).toBeNull();
  });
  it.each(['cuento', 'comic'] as const)('conserva una partida válida de %s', (format) => {
    const run = createRun(story, format);
    expect(restoreRun(story, format, JSON.parse(JSON.stringify(run)))).toEqual(run);
  });
  it.each([
    null, {}, { history: undefined },
    { history: null }, { responses: { sentimiento: null } }, { explored: [] },
    { visitedScenes: ['eliminada'] }, { format: 'comic' },
    { position: { sceneId: 'llegada', stepIndex: -1 } },
    { position: { sceneId: 'llegada', stepIndex: 999 } },
    { history: [{ sceneId: 'eliminada', stepIndex: 0 }] },
    { choices: { 'posibilidades-elegir': 'eliminada' } },
  ])('descarta datos incompletos o incompatibles: %j', (patch) => {
    const value = patch === null ? null : { ...createRun(story, 'cuento'), ...patch };
    // Un objeto vacío no altera la partida válida; se comprueba como dato independiente.
    expect(restoreRun(story, 'cuento', patch && Object.keys(patch).length === 0 ? {} : value)).toBeNull();
  });
});

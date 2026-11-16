import { describe, expect, it } from 'vitest';
import { assets } from '../content/assets/index.ts';
import { characters } from '../content/characters.ts';
import { storyList } from '../content/stories/index.ts';
import { unaMananaDiferente as story } from '../content/stories/una-manana-diferente/story.ts';
import { tools } from '../content/tools.ts';
import { canAdvance, createRun, currentPlayStep, getPlaySteps, getScene, isAtEnd, runReducer, type RunState } from './storyEngine.ts';
import { validateStory } from './validate.ts';

const play = (state: RunState, ...actions: Parameters<typeof runReducer>[2][]) =>
  actions.reduce((s, a) => runReducer(story, s, a), state);

/** Avanza hasta encontrar un paso de un tipo dado (o el final). */
function advanceUntil(state: RunState, type: string, max = 80): RunState {
  let s = state;
  for (let i = 0; i < max; i++) {
    const p = currentPlayStep(story, s);
    if (p.kind === 'interactive' && p.step.type === type) return s;
    const next = runReducer(story, s, { type: 'next' });
    if (next === s) throw new Error(`Atascado en ${s.position.sceneId}#${s.position.stepIndex}`);
    s = next;
  }
  throw new Error(`No se encontró ${type}`);
}

describe('contenido', () => {
  it.each(storyList.map((s) => [s.id, s] as const))('%s pasa la validación estructural', (_, s) => {
    expect(validateStory(s, { assets, tools, characters })).toEqual([]);
  });

  it('todos los recursos tienen texto alternativo y ruta en /media', () => {
    for (const a of Object.values(assets)) {
      expect(a.alt.length, a.id).toBeGreaterThan(3);
      expect(a.file.startsWith('/media/'), a.id).toBe(true);
    }
  });

  it('el piloto tiene exactamente 7 escenas', () => {
    expect(story.scenes.map((s) => s.number)).toEqual([1, 2, 3, 4, 5, 6, 7]);
  });
});

describe('motor de historias', () => {
  it('recorre el cuento de principio a fin explorando varias posibilidades', () => {
    let s = createRun(story, 'cuento');
    s = advanceUntil(s, 'feelings');
    s = play(s, { type: 'respond', stepId: 'cambio-sentir', values: ['sorpresa', 'no-lo-se'] });

    s = advanceUntil(s, 'choice');
    expect(canAdvance(story, s)).toBe(false); // hay que elegir, sin límite de tiempo
    s = play(s, { type: 'choose', stepId: 'posibilidades-elegir', optionId: 'salir' }, { type: 'next' });
    expect(s.position.sceneId).toBe('consecuencias');

    // Volver a explorar otra opción
    s = play(s, { type: 'goto', sceneId: 'posibilidades', stepId: 'posibilidades-elegir' });
    s = play(s, { type: 'choose', stepId: 'posibilidades-elegir', optionId: 'horario' }, { type: 'next' });
    expect(s.explored['posibilidades-elegir']).toEqual(['salir', 'horario']);

    s = play(s, { type: 'goto', sceneId: 'estrategias' });
    s = advanceUntil(s, 'summary');
    expect(isAtEnd(story, s)).toBe(true);
    expect(s.responses['cambio-sentir']).toEqual(['sorpresa', 'no-lo-se']);
  });

  it('el formato cómic descubre las viñetas una a una y conserva las interacciones', () => {
    const scene = getScene(story, 'cambio');
    const steps = getPlaySteps(scene, 'comic');
    expect(steps.filter((p) => p.kind === 'panel')).toHaveLength(scene.comic!.length);
    expect(steps.at(-1)).toMatchObject({ kind: 'interactive' });

    let s = createRun(story, 'comic');
    s = advanceUntil(s, 'choice');
    s = play(s, { type: 'choose', stepId: 'posibilidades-elegir', optionId: 'tiempo' });
    s = advanceUntil(s, 'summary');
    expect(isAtEnd(story, s)).toBe(true);
  });

  it('"Atrás" deshace la navegación, incluso tras una decisión', () => {
    let s = createRun(story, 'cuento', 'posibilidades');
    s = advanceUntil(s, 'choice');
    const before = s.position;
    s = play(s, { type: 'choose', stepId: 'posibilidades-elegir', optionId: 'adulto' }, { type: 'next' }, { type: 'prev' });
    expect(s.position).toEqual(before);
  });

  it('repetir escena vuelve al primer paso', () => {
    let s = createRun(story, 'cuento');
    s = play(s, { type: 'next' }, { type: 'next' }, { type: 'restartScene' });
    expect(s.position).toEqual({ sceneId: 'llegada', stepIndex: 0 });
  });
});

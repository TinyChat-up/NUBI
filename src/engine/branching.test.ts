import { describe, expect, it } from 'vitest';
import { assets } from '../content/assets/index.ts';
import { characters } from '../content/characters.ts';
import { branchingTestAssets, branchingTestStory as story } from '../content/stories/__dev__/branching-test.ts';
import { storyList } from '../content/stories/index.ts';
import { unaMananaDiferente as pilot } from '../content/stories/una-manana-diferente/story.ts';
import { tools } from '../content/tools.ts';
import { restoreRun } from './restoreRun.ts';
import { canAdvance, createRun, currentPlayStep, isAtEnd, runReducer, type RunAction, type RunState } from './storyEngine.ts';
import type { Story } from './types.ts';
import { branchErrors, branchWarnings, validateStory } from './validate.ts';

const ctx = { assets: { ...assets, ...Object.fromEntries(branchingTestAssets.map((a) => [a.id, a])) }, tools, characters };
const run = (s: RunState, ...actions: RunAction[]) => actions.reduce((st, a) => runReducer(story, st, a), s);

/** Avanza con «Siguiente» hasta la decisión indicada (o hasta un final/oferta). */
function to(state: RunState, target: 'choice' | 'offer' | 'ending', stepId?: string): RunState {
  let s = state;
  for (let i = 0; i < 30; i++) {
    const p = currentPlayStep(story, s);
    if (target === 'choice' && p.kind === 'interactive' && p.step.type === 'choice' && (!stepId || p.step.id === stepId)) return s;
    if (p.kind === target) return s;
    const n = runReducer(story, s, { type: 'next' });
    if (n === s) throw new Error(`Atascado en ${s.position.sceneId}#${s.position.stepIndex}`);
    s = n;
  }
  throw new Error('No se llegó');
}
const pick = (s: RunState, stepId: string, optionId: string) => run(s, { type: 'choose', stepId, optionId }, { type: 'next' });

describe('Historia técnica ramificada: estructura', () => {
  it('es válida, tiene tres finales alcanzables y ningún ciclo', () => {
    expect(validateStory(story, ctx)).toEqual([]);
    expect(branchErrors(story)).toEqual([]);
    expect(story.scenes.filter((s) => s.ending)).toHaveLength(3);
    expect(branchWarnings(story)).toEqual([]);
  });

  it('NO está en la biblioteca ni en el registro oficial de recursos', () => {
    expect(storyList.map((s) => s.id)).not.toContain(story.id);
    for (const a of branchingTestAssets) expect(assets[a.id]).toBeUndefined();
  });

  it('el validador detecta ciclos, escenas inalcanzables y escenas que no continúan', () => {
    const scenes = story.scenes.map((s) => (s.id === 't-rama-a' ? { ...s, next: 't-situacion' } : s));
    expect(branchErrors({ ...story, scenes }).some((e) => e.startsWith('Ciclo accidental'))).toBe(true);
    const orphan: Story = { ...story, scenes: [...story.scenes, { ...story.scenes[5], id: 'huerfana', ending: { id: 'x', title: 'X' } }] };
    expect(branchErrors(orphan)).toContain('La escena huerfana no es alcanzable desde el principio');
    const stuck: Story = { ...story, scenes: story.scenes.map((s) => (s.id === 't-rama-b' ? { ...s, next: undefined } : s)) };
    expect(branchErrors(stuck)).toContain('La escena t-rama-b no continúa: añade next, una decisión o ending');
  });

  it('más de dos opciones es solo un aviso de diseño; el piloto de seis sigue siendo válido', () => {
    const many: Story = {
      ...story,
      scenes: story.scenes.map((s) => (s.id === 't-decision-1' ? { ...s, steps: s.steps.map((st) => (st.type === 'choice' ? { ...st, options: [...st.options, { ...st.options[0], id: 'c' }] } : st)) } : s)),
    };
    expect(validateStory(many, ctx)).toEqual([]);
    expect(branchWarnings(many)).toHaveLength(1);
    expect(validateStory(pilot, { assets, tools, characters })).toEqual([]);
  });
});

describe('Motor ramificado: recorrer, volver y explorar otro camino', () => {
  const start = () => createRun(story, 'cuento');

  it('la pregunta emocional es opcional y no decide la rama', () => {
    const s = to(start(), 'choice', 't-elegir-1');
    const withFeeling = to(run(start(), { type: 'next' }, { type: 'next' }, { type: 'respond', stepId: 't-sentir', values: ['sorpresa'] }), 'choice', 't-elegir-1');
    expect(pick(s, 't-elegir-1', 'b').position.sceneId).toBe('t-rama-b');
    expect(pick(withFeeling, 't-elegir-1', 'b').position.sceneId).toBe('t-rama-b');
  });

  it('cada opción lleva a su escena; la rama A tiene una segunda decisión y dos finales', () => {
    const a = pick(to(start(), 'choice', 't-elegir-1'), 't-elegir-1', 'a');
    expect(a.position.sceneId).toBe('t-rama-a');
    const d2 = to(a, 'choice', 't-elegir-2');
    const a1 = to(pick(d2, 't-elegir-2', 'a1'), 'ending');
    expect(a1.position.sceneId).toBe('t-fin-a1');
    expect(isAtEnd(story, a1)).toBe(true);
    expect(a1.completed).toBe(true);
    expect(canAdvance(story, a1)).toBe(false);
    expect(a1.endingsSeen).toEqual(['final-a1']);
    expect(a1.path?.map((e) => `${e.choiceStepId}:${e.optionId}`)).toEqual(['t-elegir-1:a', 't-elegir-2:a1']);
  });

  it('un final no continúa por el orden del array', () => {
    const a1 = to(pick(to(pick(to(start(), 'choice'), 't-elegir-1', 'a'), 'choice', 't-elegir-2'), 't-elegir-2', 'a1'), 'ending');
    expect(runReducer(story, a1, { type: 'next' })).toBe(a1);
  });

  it('la rama B ofrece otra forma (sin obligar) y después llega a su final', () => {
    const offer = to(pick(to(start(), 'choice'), 't-elegir-1', 'b'), 'offer');
    expect(offer.position.sceneId).toBe('t-rama-b');
    expect(canAdvance(story, offer)).toBe(true);
    const end = to(runReducer(story, offer, { type: 'next' }), 'ending');
    expect(end.position.sceneId).toBe('t-fin-b');
  });

  it('volver a una decisión deshace el tramo posterior sin mezclar caminos; conserva lo explorado y los finales', () => {
    const a1 = to(pick(to(pick(to(start(), 'choice'), 't-elegir-1', 'a'), 'choice', 't-elegir-2'), 't-elegir-2', 'a1'), 'ending');
    const back = runReducer(story, a1, { type: 'rewind', sceneId: 't-decision-1', stepId: 't-elegir-1' });
    expect(back.position).toEqual({ sceneId: 't-decision-1', stepIndex: 1 });
    expect(back.path).toEqual([]);
    expect(back.history.some((p) => p.sceneId === 't-rama-a')).toBe(false); // Atrás ya no pasa por la rama A
    expect(back.explored['t-elegir-1']).toEqual(['a']);
    expect(back.endingsSeen).toEqual(['final-a1']);
    const b = to(pick(back, 't-elegir-1', 'b'), 'ending');
    expect(b.path?.map((e) => e.optionId)).toEqual(['b']);
    expect(b.endingsSeen).toEqual(['final-a1', 'final-b']);
    expect(b.explored['t-elegir-1']).toEqual(['a', 'b']);
    // Atrás desde la rama B no vuelve a la A: retrocede por B hasta la decisión.
    let s = b;
    while (s.history.length) s = runReducer(story, s, { type: 'prev' });
    expect(s.position.sceneId).toBe('t-situacion');
    expect(s.path).toEqual([]);
  });

  it('Atrás después de una decisión quita esa decisión del camino', () => {
    const a = pick(to(start(), 'choice'), 't-elegir-1', 'a');
    expect(a.path).toHaveLength(1);
    const back = runReducer(story, a, { type: 'prev' });
    expect(back.position.sceneId).toBe('t-decision-1');
    expect(back.path).toEqual([]);
  });

  it('volver a un punto no recorrido no hace nada', () => {
    const s = to(start(), 'choice');
    expect(runReducer(story, s, { type: 'rewind', sceneId: 't-rama-b' })).toBe(s);
  });

  it('cómic: mismo recorrido y mismos finales', () => {
    let s = createRun(story, 'comic');
    s = to(pick(to(s, 'choice'), 't-elegir-1', 'b'), 'ending');
    expect(s.position.sceneId).toBe('t-fin-b');
    expect(s.endingsSeen).toEqual(['final-b']);
  });
});

describe('Compatibilidad de partidas guardadas', () => {
  it('una partida de la fase 20 (sin path ni endingsSeen) se restaura igual, con valores vacíos', () => {
    const old = { ...createRun(pilot, 'cuento'), position: { sceneId: 'posibilidades', stepIndex: 1 }, history: [{ sceneId: 'llegada', stepIndex: 0 }] } as Partial<RunState>;
    delete old.path;
    delete old.endingsSeen;
    const restored = restoreRun(pilot, 'cuento', JSON.parse(JSON.stringify(old)));
    expect(restored?.position).toEqual({ sceneId: 'posibilidades', stepIndex: 1 });
    expect(restored?.path).toEqual([]);
    expect(restored?.endingsSeen).toEqual([]);
  });

  it('una partida ramificada guardada se restaura con su camino', () => {
    const a = pick(to(createRun(story, 'cuento'), 'choice'), 't-elegir-1', 'a');
    const restored = restoreRun(story, 'cuento', JSON.parse(JSON.stringify(a)));
    expect(restored?.path).toEqual(a.path);
    expect(restored?.position).toEqual(a.position);
  });

  it('descarta un camino malformado en lugar de usarlo', () => {
    const a = { ...createRun(story, 'cuento'), path: [{ choiceStepId: 't-elegir-1' }] };
    expect(restoreRun(story, 'cuento', a)).toBeNull();
  });

  it('el piloto sigue igual: seis opciones, escena común de consecuencias y «Probar otra decisión»', () => {
    let s = createRun(pilot, 'cuento');
    for (let i = 0; i < 40; i++) {
      const p = currentPlayStep(pilot, s);
      if (p.kind === 'interactive' && p.step.type === 'choice') break;
      s = runReducer(pilot, s, { type: 'next' });
    }
    const p = currentPlayStep(pilot, s);
    expect(p.kind === 'interactive' && p.step.type === 'choice' && p.step.options.length).toBe(6);
    const after = runReducer(pilot, runReducer(pilot, s, { type: 'choose', stepId: 'posibilidades-elegir', optionId: 'salir' }), { type: 'next' });
    expect(after.position.sceneId).toBe('consecuencias');
    expect(currentPlayStep(pilot, after).kind).toBe('interactive');
  });
});

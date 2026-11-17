import { describe, expect, it } from 'vitest';
import { assets } from '../content/assets/index.ts';
import { characters } from '../content/characters.ts';
import { storyList } from '../content/stories/index.ts';
import { devAssetsByStory } from '../content/stories/__dev__/index.ts';
import { libroDeTrenes as story } from '../content/stories/__dev__/libro-de-trenes/story.ts';
import { libroProvisionalAssets } from '../content/stories/__dev__/libro-de-trenes/assets.ts';
import { tools } from '../content/tools.ts';
import { createRun, currentPlayStep, runReducer, type RunAction, type RunState } from './storyEngine.ts';
import { branchErrors, branchWarnings, validateStory } from './validate.ts';

const devAll = Object.fromEntries([...devAssetsByStory['libro-de-trenes']].map((a) => [a.id, a]));
const ctx = { assets: { ...assets, ...devAll }, tools, characters };
const act = (s: RunState, ...actions: RunAction[]) => actions.reduce((st, a) => runReducer(story, st, a), s);
const decisionStep = (s: RunState) => {
  const p = currentPlayStep(story, s);
  return p.kind === 'interactive' && p.step.type === 'choice' ? p.step : undefined;
};
/** Avanza con «Siguiente» hasta la decisión indicada o hasta la oferta/final. */
function until(s: RunState, stop: (s: RunState) => boolean): RunState {
  let cur = s;
  for (let i = 0; i < 40 && !stop(cur); i++) {
    const n = runReducer(story, cur, { type: 'next' });
    if (n === cur) throw new Error(`Atascado en ${cur.position.sceneId}#${cur.position.stepIndex}`);
    cur = n;
  }
  if (!stop(cur)) throw new Error('No se llegó al punto esperado');
  return cur;
}
const atChoice = (id: string) => (s: RunState) => decisionStep(s)?.id === id;
const choose = (s: RunState, stepId: string, optionId: string) => act(s, { type: 'choose', stepId, optionId }, { type: 'next' });

describe('«El libro de trenes»: estructura (propuesta, solo desarrollo)', () => {
  it('es válido, dos decisiones, tres finales, sin ciclos ni avisos', () => {
    expect(validateStory(story, ctx)).toEqual([]);
    expect(branchErrors(story)).toEqual([]);
    expect(branchWarnings(story)).toEqual([]);
    expect(story.scenes.filter((s) => s.ending).map((s) => s.ending!.title)).toEqual(['Mirar los trenes juntos', 'Ahora no, luego sí', 'Cada uno con su libro']);
    expect(story.scenes.flatMap((s) => s.steps).filter((s) => s.type === 'choice')).toHaveLength(2);
  });

  it('NO está en la biblioteca pública, ni en el registro oficial', () => {
    expect(storyList.map((s) => s.id)).not.toContain('libro-de-trenes');
    expect(assets['lt-cover']).toBeUndefined();
  });

  it('todo lo que no existe está marcado como provisional (7 marcadores); lo reutilizado existe en el registro oficial', () => {
    expect(libroProvisionalAssets).toHaveLength(7);
    for (const a of libroProvisionalAssets) {
      expect(a.provisional).toBe(true);
      expect(a.status).toBe('pendiente');
      expect(a.alt.startsWith('Marcador provisional')).toBe(true);
    }
    const used = new Set(story.scenes.flatMap((s) => s.steps.flatMap((st) => (st.type === 'beat' ? [st.illustration] : st.type === 'choice' ? st.options.map((o) => o.illustration) : []))));
    const provisional = new Set(libroProvisionalAssets.map((a) => a.id));
    for (const id of used) if (!provisional.has(id)) expect(assets[id], `reutilizado: ${id}`).toBeDefined();
    expect(provisional.has('lt-cover')).toBe(true);
  });

  it('la validación sigue en borrador y no dice que esté validado', () => {
    expect(story.validation.status).toBe('borrador');
    expect(story.validation.notes).toMatch(/pendiente de aprobación/i);
  });
});

describe('«El libro de trenes»: caminos', () => {
  const start = () => createRun(story, 'cuento');

  it('camino A → «Mirar los trenes juntos»', () => {
    const d = until(start(), atChoice('lt-elegir-1'));
    const end = until(choose(d, 'lt-elegir-1', 'ensenar'), (s) => s.completed);
    expect(end.position.sceneId).toBe('lt-juntos');
    expect(end.endingsSeen).toEqual(['final-juntos']);
  });

  it('camino B1 → «Ahora no, luego sí»', () => {
    const d1 = until(start(), atChoice('lt-elegir-1'));
    const d2 = until(choose(d1, 'lt-elegir-1', 'seguir'), atChoice('lt-elegir-2'));
    const end = until(choose(d2, 'lt-elegir-2', 'luego'), (s) => s.completed);
    expect(end.position.sceneId).toBe('lt-luego');
    expect(end.endingsSeen).toEqual(['final-luego']);
  });

  it('camino B2 → oferta de Nubi → «Cada uno con su libro»', () => {
    const d1 = until(start(), atChoice('lt-elegir-1'));
    const d2 = until(choose(d1, 'lt-elegir-1', 'seguir'), atChoice('lt-elegir-2'));
    const offer = until(choose(d2, 'lt-elegir-2', 'sin-decir'), (s) => currentPlayStep(story, s).kind === 'offer');
    expect(offer.position.sceneId).toBe('lt-con-aya');
    const end = until(runReducer(story, offer, { type: 'next' }), (s) => s.completed);
    expect(end.endingsSeen).toEqual(['final-cada-uno']);
  });

  it('desde B2, probar la otra (B1) y terminar en su final, sin mezclar caminos', () => {
    const d1 = until(start(), atChoice('lt-elegir-1'));
    const d2 = until(choose(d1, 'lt-elegir-1', 'seguir'), atChoice('lt-elegir-2'));
    const offer = until(choose(d2, 'lt-elegir-2', 'sin-decir'), (s) => currentPlayStep(story, s).kind === 'offer');
    const other = act(offer, { type: 'rewind', sceneId: 'lt-decidir-2', stepId: 'lt-elegir-2' }, { type: 'choose', stepId: 'lt-elegir-2', optionId: 'luego' }, { type: 'next' });
    const end = until(other, (s) => s.completed);
    expect(end.position.sceneId).toBe('lt-luego');
    expect(end.path?.map((e) => e.optionId)).toEqual(['seguir', 'luego']);
    // «Descubierto» = escena alcanzada: B2 se visitó (oferta incluida) antes de probar B1.
    expect(end.endingsSeen).toEqual(['final-cada-uno', 'final-luego']);
  });

  it('las preguntas emocionales son opcionales y no cambian el camino', () => {
    const withAnswers = act(
      until(start(), (s) => { const p = currentPlayStep(story, s); return p.kind === 'interactive' && p.step.type === 'feelings'; }),
      { type: 'respond', stepId: 'lt-sentir-teo', values: ['sorpresa', 'seguir-leyendo'] },
    );
    const without = until(start(), atChoice('lt-elegir-1'));
    const a = until(withAnswers, atChoice('lt-elegir-1'));
    expect(a.position).toEqual(without.position);
    expect(choose(a, 'lt-elegir-1', 'ensenar').position.sceneId).toBe('lt-juntos');
  });

  it('todas las respuestas son posibles: ninguna emoción obliga ni se evalúa', () => {
    const s = until(start(), (x) => { const p = currentPlayStep(story, x); return p.kind === 'interactive' && p.step.type === 'feelings'; });
    expect(runReducer(story, s, { type: 'next' }).position.sceneId).toBe('lt-decidir-1');
  });
});

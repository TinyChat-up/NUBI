import { describe, expect, it } from 'vitest';
import { assets } from '../content/assets/index.ts';
import { characters } from '../content/characters.ts';
import { tools } from '../content/tools.ts';
import { unaMananaDiferente as story } from '../content/stories/una-manana-diferente/story.ts';
import { readableBeat, readableConsequence } from './readable.ts';
import type { ChoiceOption, ChoiceStep, Story } from './types.ts';
import { validateStory } from './validate.ts';

const choice = story.scenes.flatMap((s) => s.steps).find((s): s is ChoiceStep => s.type === 'choice')!;
const salir = choice.options.find((o) => o.id === 'salir')!;
/** Consecuencia sintética de prueba (no son textos educativos ni propuestas). */
const withShort = (short: NonNullable<ChoiceOption['consequence']>['short']): ChoiceOption => ({ ...salir, consequence: { ...salir.consequence!, short } });

describe('readableBeat', () => {
  const beat = { text: 'Texto completo de la página.', short: 'Texto corto.' };
  it('usa el texto completo por defecto', () => expect(readableBeat(beat, false)).toBe(beat.text));
  it('usa la versión corta con «Textos cortos»', () => expect(readableBeat(beat, true)).toBe('Texto corto.'));
  it('sin versión corta (o vacía) vuelve al texto completo', () => {
    expect(readableBeat({ text: 'Completo.' }, true)).toBe('Completo.');
    expect(readableBeat({ text: 'Completo.', short: '  ' }, true)).toBe('Completo.');
  });
});

describe('readableConsequence', () => {
  it('el piloto aún no tiene versiones cortas de consecuencias: con y sin el ajuste se lee lo mismo', () => {
    for (const o of choice.options) {
      expect(o.consequence!.short).toBeUndefined();
      expect(readableConsequence(o.consequence!, true)).toEqual(readableConsequence(o.consequence!, false));
      expect(readableConsequence(o.consequence!, false).story).toEqual(o.consequence!.story.map((f) => f.text));
    }
  });

  it('usa cada versión corta solo donde existe; el resto sigue completo', () => {
    const c = withShort({ story: [undefined, 'MOMENTO 2 CORTO'], keepInMind: 'TENER EN CUENTA CORTO' }).consequence!;
    const r = readableConsequence(c, true);
    expect(r.story).toEqual([c.story[0].text, 'MOMENTO 2 CORTO']);
    expect(r.keepInMind).toBe('TENER EN CUENTA CORTO');
    expect(r.youMayFeel).toBe(c.youMayFeel);
    expect(r.anotherWay).toBe(c.anotherWay);
    expect(readableConsequence(c, false).keepInMind).toBe(c.keepInMind); // el ajuste apagado nunca usa la corta
  });
});

describe('validateStory: versiones cortas', () => {
  const ctx = { assets, tools, characters };
  const variant = (short: NonNullable<ChoiceOption['consequence']>['short']): Story => ({
    ...story,
    scenes: story.scenes.map((sc) => ({
      ...sc,
      steps: sc.steps.map((st) => (st.type === 'choice' ? { ...st, options: st.options.map((o) => (o.id === 'salir' ? withShort(short) : o)) } : st)),
    })),
  });

  it('acepta versiones cortas bien formadas', () => {
    expect(validateStory(variant({ story: [undefined, 'Corto.'], keepInMind: 'Corto.' }), ctx)).toEqual([]);
  });

  it('rechaza versiones cortas vacías o de momentos que no existen', () => {
    const errors = validateStory(variant({ story: ['', 'a', 'b'], othersMay: ' ' }), ctx);
    expect(errors.some((e) => e.includes('más momentos cortos'))).toBe(true);
    expect(errors.some((e) => e.includes('story[0]: versión corta vacía'))).toBe(true);
    expect(errors.some((e) => e.includes('othersMay: versión corta vacía'))).toBe(true);
  });

  it('rechaza una versión corta vacía en una página del cuento', () => {
    const s: Story = { ...story, scenes: story.scenes.map((sc, i) => (i ? sc : { ...sc, steps: sc.steps.map((st, j) => (j || st.type !== 'beat' ? st : { ...st, short: '' })) })) };
    expect(validateStory(s, ctx).some((e) => e.includes('versión corta vacía'))).toBe(true);
  });
});

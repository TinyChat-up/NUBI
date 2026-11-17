import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { unaMananaDiferente as story } from '../../content/stories/una-manana-diferente/story.ts';
import type { ChoiceOption, ChoiceStep } from '../../engine/types.ts';
import { ConsequenceBody } from './interactions.tsx';

const choice = story.scenes.flatMap((s) => s.steps).find((s): s is ChoiceStep => s.type === 'choice')!;
const salir = choice.options.find((o) => o.id === 'salir')!;
/** Consecuencia sintética de prueba (no son textos educativos ni propuestas). */
const withShort = (short: ChoiceOption['consequence']['short']): ChoiceOption => ({ ...salir, consequence: { ...salir.consequence, short } });

describe('ConsequenceBody con «Textos cortos»', () => {
  const render = (short: boolean) =>
    renderToStaticMarkup(createElement(ConsequenceBody, { option: withShort({ story: ['MOMENTO 1 CORTO'], anotherWay: 'OTRA FORMA CORTA' }), short }))
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ');

  it('muestra las versiones cortas escritas y el resto completo', () => {
    const html = render(true);
    expect(html).toContain('MOMENTO 1 CORTO');
    expect(html).toContain('OTRA FORMA CORTA');
    expect(html).toContain(salir.consequence.story[1].text);
    expect(html).toContain(salir.consequence.youMayFeel);
    expect(html).not.toContain(salir.consequence.story[0].text);
  });

  it('sin el ajuste muestra el texto completo', () => {
    const html = render(false);
    expect(html).toContain(salir.consequence.story[0].text);
    expect(html).toContain(salir.consequence.anotherWay!);
    expect(html).not.toContain('CORTO');
  });
});

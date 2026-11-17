import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { assets } from '../../content/assets/index.ts';
import { toolList, tools } from '../../content/tools.ts';
import { storyList } from '../../content/stories/index.ts';
import { unaMananaDiferente as story } from '../../content/stories/una-manana-diferente/story.ts';
import { createRun } from '../../engine/storyEngine.ts';
import type { StrategiesStep } from '../../engine/types.ts';
import { StrategiesView } from './interactions.tsx';

const strategySteps = () =>
  storyList.flatMap((s) => s.scenes.flatMap((sc) => sc.steps)).filter((st): st is StrategiesStep => st.type === 'strategies');

/** Tarjetas (botones con aria-pressed) del HTML renderizado. */
function cards(html: string) {
  return [...html.matchAll(/<button[^>]*aria-pressed="(true|false)"[^>]*>([\s\S]*?)<\/button>/g)].map(([, pressed, inner]) => ({
    pressed: pressed === 'true',
    asset: /data-asset="([^"]+)"/.exec(inner)?.[1],
    alt: /<img[^>]*alt="([^"]*)"/.exec(inner)?.[1],
    sizes: /<img[^>]*sizes="([^"]*)"/.exec(inner)?.[1],
    leading: inner.includes('data-leading'),
    text: inner.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim(),
    svgs: (inner.match(/<svg/g) ?? []).length,
  }));
}

const render = (step: StrategiesStep, responses: Record<string, string[]> = {}) =>
  cards(renderToStaticMarkup(createElement(StrategiesView, { step, state: { ...createRun(story, 'cuento'), responses }, dispatch: () => {} })));

describe('Herramientas: catálogo ↔ ilustración', () => {
  it('cada herramienta apunta a su recurso definitivo, cuadrado y transparente', () => {
    expect(toolList).toHaveLength(7);
    for (const t of toolList) {
      const a = assets[t.illustration];
      expect(a?.kind).toBe('herramienta');
      expect(a?.status).toBe('listo');
      expect(a?.aspect).toBe('1:1');
      expect(a?.transparent).toBe(true);
    }
  });

  it('todas las herramientas que ofrecen las historias existen en el catálogo', () => {
    for (const step of strategySteps()) for (const id of step.tools) expect(tools[id]).toBeDefined();
  });
});

describe('StrategiesView: ilustraciones en «¿Cuáles podrían ayudarte?»', () => {
  const step = strategySteps()[0];

  it('cada tarjeta muestra la ilustración de su herramienta, decorativa, a 56 px y sin duplicar el icono', () => {
    const list = render(step);
    expect(list).toHaveLength(step.tools.length);
    for (const [i, id] of step.tools.entries()) {
      const t = tools[id];
      expect(list[i].asset).toBe(t.illustration);
      expect(list[i].leading).toBe(true);
      expect(list[i].alt).toBe('');
      expect(list[i].sizes).toBe('56px');
      expect(list[i].svgs).toBe(1); // solo la marca ✓
      expect(list[i].text).toBe(`${t.name} ${t.childText}`); // nombre y descripción intactos
    }
  });

  it('si una ilustración no es definitiva, la tarjeta vuelve al icono', () => {
    const id = step.tools[0];
    const asset = assets[tools[id].illustration];
    const status = asset.status;
    asset.status = 'pendiente';
    try {
      const [first, second] = render(step);
      expect(first.asset).toBeUndefined();
      expect(first.leading).toBe(false);
      expect(first.svgs).toBe(2); // icono + marca ✓
      expect(second.asset).toBe(tools[step.tools[1]].illustration);
    } finally {
      asset.status = status;
    }
  });

  it('conserva la selección múltiple guardada', () => {
    const chosen = [step.tools[0], step.tools[2]];
    const list = render(step, { [step.id]: chosen });
    expect(list.filter((c) => c.pressed).map((c) => c.asset)).toEqual(chosen.map((id) => tools[id].illustration));
  });
});

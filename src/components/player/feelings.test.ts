import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { assets } from '../../content/assets/index.ts';
import { emotionList, emotions } from '../../content/emotions.ts';
import { storyList } from '../../content/stories/index.ts';
import { unaMananaDiferente as story } from '../../content/stories/una-manana-diferente/story.ts';
import { createRun } from '../../engine/storyEngine.ts';
import type { FeelingsStep } from '../../engine/types.ts';
import { FeelingsView } from './interactions.tsx';
import { ToggleCard } from './Toggle.tsx';

const noop = () => {};
const feelingSteps = (list = storyList) =>
  list.flatMap((s) => s.scenes.flatMap((sc) => sc.steps)).filter((st): st is FeelingsStep => st.type === 'feelings');

/** Botones del HTML renderizado, con lo que interesa de cada uno. */
function buttons(html: string) {
  return [...html.matchAll(/<button[^>]*aria-pressed="(true|false)"[^>]*>([\s\S]*?)<\/button>/g)].map(([, pressed, inner]) => ({
    pressed: pressed === 'true',
    asset: /data-asset="([^"]+)"/.exec(inner)?.[1],
    leading: inner.includes('data-leading'),
    text: inner.replace(/<[^>]+>/g, '').trim(),
    svgs: (inner.match(/<svg/g) ?? []).length,
  }));
}

describe('ToggleCard: recurso visual inicial', () => {
  it('sin `leading` muestra el icono, como hasta ahora', () => {
    const html = renderToStaticMarkup(createElement(ToggleCard, { selected: false, onToggle: noop, icon: 'leaf', label: 'Calma' }));
    const [b] = buttons(html);
    expect(b.leading).toBe(false);
    expect(b.svgs).toBe(2); // icono + marca ✓
    expect(b.text).toBe('Calma');
  });

  it('con `leading` muestra ese contenido en el mismo hueco, decorativo, en lugar del icono', () => {
    const html = renderToStaticMarkup(
      createElement(ToggleCard, { selected: true, onToggle: noop, icon: 'leaf', label: 'Calma', leading: createElement('i', { id: 'arte' }) }),
    );
    expect(html).toMatch(/<span aria-hidden="true" data-leading="true" class="grid size-14 shrink-0[^"]*"><i id="arte"><\/i><\/span>/);
    const [b] = buttons(html);
    expect(b.svgs).toBe(1); // solo la marca ✓: el icono no se duplica
    expect(b.pressed).toBe(true);
    expect(b.text).toBe('Calma');
  });

  it('la selección se sigue indicando con borde y marca, no solo con la imagen', () => {
    const on = renderToStaticMarkup(createElement(ToggleCard, { selected: true, onToggle: noop, label: 'A', leading: 'x' }));
    const off = renderToStaticMarkup(createElement(ToggleCard, { selected: false, onToggle: noop, label: 'A', leading: 'x' }));
    expect(on).toContain('border-petroleo-600 bg-petroleo-50');
    expect(on).toContain('bg-petroleo-600 text-crema-50'); // marca ✓ visible
    expect(off).toContain('text-transparent'); // marca oculta sin seleccionar
  });
});

describe('Emociones: catálogo ↔ ilustración', () => {
  it('cada emoción del catálogo tiene su recurso emo-<id> listo, cuadrado y transparente', () => {
    expect(emotionList).toHaveLength(9);
    for (const e of emotionList) {
      // EmotionArt deriva el recurso como `emo-<id>`: debe coincidir con el campo del catálogo.
      expect(e.illustration).toBe(`emo-${e.id}`);
      const a = assets[e.illustration];
      expect(a?.kind).toBe('emocion');
      expect(a?.status).toBe('listo');
      expect(a?.aspect).toBe('1:1');
      expect(a?.transparent).toBe(true);
    }
  });

  it('toda opción de sentimiento con `emotion` apunta a una emoción del catálogo', () => {
    for (const step of feelingSteps()) for (const o of step.options) if (o.emotion) expect(emotions[o.emotion]).toBeDefined();
  });
});

describe('FeelingsView: ilustraciones de Nubi en «¿Cómo te sentirías?»', () => {
  const step = feelingSteps([story])[0];
  const render = (s: FeelingsStep, responses: Record<string, string[]> = {}) =>
    buttons(
      renderToStaticMarkup(
        createElement(FeelingsView, { step: s, state: { ...createRun(story, 'cuento'), responses }, dispatch: noop }),
      ),
    ).slice(0, s.options.length);

  it('las cinco opciones con emoción muestran su ilustración y las tres restantes su icono', () => {
    const cards = render(step);
    expect(cards.map((c) => c.text)).toEqual(step.options.map((o) => o.label)); // textos intactos
    expect(cards.map((c) => c.asset)).toEqual(step.options.map((o) => (o.emotion ? `emo-${o.emotion}` : undefined)));
    expect(cards.filter((c) => c.asset)).toHaveLength(5);
    for (const [i, o] of step.options.entries()) expect(cards[i].svgs).toBe(o.emotion ? 1 : 2);
    // «Nervios o inseguridad» se sigue leyendo así aunque la ilustración sea emo-inseguridad.
    expect(cards.find((c) => c.asset === 'emo-inseguridad')?.text).toBe('Nervios o inseguridad');
    expect(cards.find((c) => c.asset === 'emo-calma')?.text).toBe('Tranquilidad');
  });

  it('decide solo por el campo tipado `emotion`, nunca por la etiqueta', () => {
    const synthetic: FeelingsStep = {
      ...step,
      options: [
        { id: 'a', label: 'Sorpresa', icon: 'spark' }, // etiqueta de emoción, pero sin campo: icono
        { id: 'b', label: 'Cómo me siento', emotion: 'cansancio', icon: 'moon' }, // campo sin etiqueta de emoción: ilustración
      ],
    };
    const [a, b] = render(synthetic);
    expect(a.asset).toBeUndefined();
    expect(a.svgs).toBe(2);
    expect(b.asset).toBe('emo-cansancio');
    expect(b.text).toBe('Cómo me siento');
  });

  it('conserva la selección guardada, incluido «No lo sé» junto a otras respuestas', () => {
    const cards = render(step, { [step.id]: ['sorpresa', 'no-lo-se'] });
    expect(cards.filter((c) => c.pressed).map((c) => c.text)).toEqual(['Sorpresa', 'No lo sé']);
  });
});

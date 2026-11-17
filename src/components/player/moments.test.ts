import { describe, expect, it } from 'vitest';
import { characters } from '../../content/characters.ts';
import { storyList } from '../../content/stories/index.ts';
import { unaMananaDiferente as story } from '../../content/stories/una-manana-diferente/story.ts';
import type { Story } from '../../engine/types.ts';
import { momentOf, protagonistName, startsMoment, storyMoments } from './moments.ts';

describe('Tres momentos del cuento (presentación, sin cambiar contenido)', () => {
  const moments = storyMoments(story, protagonistName(story, characters));

  it('«Una mañana diferente»: qué está pasando → ¿qué podría hacer Teo? → qué podría pasar', () => {
    expect(moments.map((m) => m.label)).toEqual(['Qué está pasando', '¿Qué podría hacer Teo?', 'Qué podría pasar']);
    expect(moments.map((m) => m.scenes.map((s) => s.id))).toEqual([
      ['llegada', 'cambio', 'saber'],
      ['posibilidades'],
      ['consecuencias', 'estrategias', 'cierre'],
    ]);
  });

  it('no pierde ni repite escenas, y conserva su orden', () => {
    for (const s of storyList) {
      const flat = storyMoments(s, 'X').flatMap((m) => m.scenes.map((sc) => sc.id));
      expect(flat).toEqual(s.scenes.map((sc) => sc.id));
    }
  });

  it('el momento 2 es la escena de la decisión y empieza cada grupo en su primera escena', () => {
    expect(momentOf(moments, 'posibilidades').id).toBe('decide');
    expect(startsMoment(moments, 'llegada')?.number).toBe(1);
    expect(startsMoment(moments, 'cambio')).toBeUndefined();
    expect(startsMoment(moments, 'consecuencias')?.number).toBe(3);
  });

  it('una historia sin decisiones queda entera en «Qué está pasando»', () => {
    const plain: Story = { ...story, scenes: story.scenes.map((sc) => ({ ...sc, steps: sc.steps.filter((st) => st.type !== 'choice') })) };
    const m = storyMoments(plain, 'Teo');
    expect(m).toHaveLength(1);
    expect(m[0].scenes).toHaveLength(story.scenes.length);
  });
});

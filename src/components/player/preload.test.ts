import { afterEach, describe, expect, it, vi } from 'vitest';
import { assets } from '../../content/assets/index.ts';
import { unaMananaDiferente as story } from '../../content/stories/una-manana-diferente/story.ts';
import { createRun, getPlaySteps, getScene, type RunState } from '../../engine/storyEngine.ts';
import type { AssetSpec } from '../../engine/types.ts';
import { portraitSrcSet, buildSrcSet, preload } from '../illustration/imageSource.ts';
import { CONSEQUENCE_SIZES, OPTION_CARD_SIZES, SCENE_SIZES } from './imageSizes.ts';
import { upcomingImages } from './presentation.ts';

const at = (sceneId: string, stepIndex: number): RunState => ({ ...createRun(story, 'cuento', sceneId), position: { sceneId, stepIndex } });
const choiceScene = story.scenes.find((s) => s.steps.some((st) => st.type === 'choice'))!;
const choice = choiceScene.steps.find((st) => st.type === 'choice')!;

describe('upcomingImages: la precarga anuncia el mismo `sizes` que tendrá cada imagen', () => {
  it('una página de cuento siguiente se precarga con el `sizes` de la escena', () => {
    const next = upcomingImages(story, at('llegada', 0));
    expect(next.length).toBeGreaterThan(0);
    for (const img of next) expect(img.sizes).toBe(SCENE_SIZES);
  });

  it('en una decisión: tarjetas con el `sizes` de tarjeta y momentos con el de consecuencia', () => {
    const steps = getPlaySteps(getScene(story, choiceScene.id), 'cuento');
    const index = steps.findIndex((p) => p.kind === 'interactive' && p.step.type === 'choice');
    const images = upcomingImages(story, at(choiceScene.id, index));
    const options = choice.type === 'choice' ? choice.options : [];
    for (const o of options) expect(images.find((i) => i.id === o.illustration)?.sizes).toBe(OPTION_CARD_SIZES);
    const second = options.map((o) => o.consequence.story[1].illustration);
    for (const id of second) expect(images.find((i) => i.id === id)?.sizes).toBe(CONSEQUENCE_SIZES);
    expect(new Set(images.map((i) => i.id)).size).toBe(images.length); // sin repetidos
  });
});

describe('preload: misma composición que <picture>', () => {
  const created: { src?: string; srcset?: string; sizes?: string }[] = [];
  const stub = (portrait: boolean) => {
    created.length = 0;
    vi.stubGlobal('Image', class {
      decoding = '';
      sizes = '';
      srcset = '';
      src = '';
      constructor() {
        created.push(this);
      }
    });
    vi.stubGlobal('matchMedia', (q: string) => ({ matches: q === '(orientation: portrait)' ? portrait : false }));
  };
  afterEach(() => vi.unstubAllGlobals());
  // Copias con ids nuevos: `preload` recuerda lo ya precargado por id.
  const scene = (suffix: string): AssetSpec => ({ ...assets['ume-s1-puerta'], id: `prueba-${suffix}` });

  it('en vertical precarga la composición 3:4 con su srcset', () => {
    stub(true);
    const a = scene('vertical');
    preload([{ asset: a, sizes: SCENE_SIZES }]);
    expect(created).toHaveLength(1);
    expect(created[0].srcset).toBe(portraitSrcSet(a));
    expect(created[0].src).toBe(a.portrait!.file);
    expect(created[0].sizes).toBe(SCENE_SIZES);
  });

  it('en horizontal precarga la composición 16:9', () => {
    stub(false);
    const a = scene('horizontal');
    preload([{ asset: a, sizes: SCENE_SIZES }]);
    expect(created[0].srcset).toBe(buildSrcSet(a));
    expect(created[0].src).toBe(a.file);
  });

  it('un recurso sin composición vertical usa siempre su archivo, también en vertical', () => {
    stub(true);
    const a: AssetSpec = { ...assets['ume-opt-preguntar'], id: 'prueba-opcion' };
    preload([{ asset: a, sizes: OPTION_CARD_SIZES }]);
    expect(created[0].srcset).toBe(buildSrcSet(a));
    expect(created[0].sizes).toBe(OPTION_CARD_SIZES);
  });
});

import { describe, expect, it } from 'vitest';
import type { AssetSpec } from '../../engine/types.ts';
import { assets } from '../../content/assets/index.ts';
import { buildSrcSet, cssAspect, defaultFit, isReady, objectPosition, variantPath } from './imageSource.ts';

const base = assets['ume-s1-puerta'];
const with_ = (patch: Partial<AssetSpec>): AssetSpec => ({ ...base, ...patch });

describe('fuentes de ilustración', () => {
  it('solo sirve imágenes de recursos listos', () => {
    expect(isReady(undefined)).toBe(false);
    expect(isReady(with_({ status: 'pendiente' }))).toBe(false);
    expect(isReady(with_({ status: 'listo' }))).toBe(true);
  });

  it('nombra variantes con el sufijo -<ancho>w', () => {
    expect(variantPath('/media/stories/x/scenes/s1.webp', 1200)).toBe('/media/stories/x/scenes/s1-1200w.webp');
    expect(variantPath('/media/a.b/c', 800)).toBe('/media/a.b/c-800w');
  });

  it('construye srcset ordenado, sin duplicados y con el original como mayor', () => {
    expect(buildSrcSet(with_({ variants: undefined }))).toBeUndefined();
    expect(buildSrcSet(with_({ variants: [1600, 800, 800, 9999] }))).toBe(
      `${variantPath(base.file, 800)} 800w, ${variantPath(base.file, 1600)} 1600w, ${base.file} ${base.size.width}w`,
    );
  });

  it('no recorta recursos transparentes y respeta el punto focal', () => {
    expect(defaultFit(with_({ transparent: true }))).toBe('contain');
    expect(defaultFit(with_({ transparent: false }))).toBe('cover');
    expect(objectPosition(with_({ focus: undefined }))).toBe('50% 50%');
    expect(objectPosition(with_({ focus: { x: 30, y: 120 } }))).toBe('30% 100%');
    expect(cssAspect('16:9')).toBe('16 / 9');
  });

  it('los puntos focales y variantes declarados en el registro son válidos', () => {
    for (const a of Object.values(assets)) {
      if (a.focus) {
        expect(a.focus.x, a.id).toBeGreaterThanOrEqual(0);
        expect(a.focus.x, a.id).toBeLessThanOrEqual(100);
        expect(a.focus.y, a.id).toBeGreaterThanOrEqual(0);
        expect(a.focus.y, a.id).toBeLessThanOrEqual(100);
      }
      for (const w of a.variants ?? []) expect(w, a.id).toBeLessThan(a.size.width);
    }
  });
});

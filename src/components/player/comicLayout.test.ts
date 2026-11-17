import { describe, expect, it } from 'vitest';
import { unaMananaDiferente as story } from '../../content/stories/una-manana-diferente/story.ts';
import { comicPanelSizes, comicPanelWidth } from './comicLayout.ts';

/**
 * Intérprete mínimo de `sizes` (solo lo que usa comicPanelSizes: min-width, orientation,
 * calc/min con px, vw y vh). Elige la primera entrada cuya condición se cumple, como el navegador.
 * Con `supportsMin: false` descarta las entradas con min(), como un navegador que no lo entienda.
 */
function resolveSizes(sizes: string, vp: { width: number; height: number }, supportsMin = true): number {
  const entries: string[] = [];
  let depth = 0;
  let start = 0;
  for (let i = 0; i < sizes.length; i++) {
    if (sizes[i] === '(') depth++;
    else if (sizes[i] === ')') depth--;
    else if (sizes[i] === ',' && depth === 0) {
      entries.push(sizes.slice(start, i).trim());
      start = i + 1;
    }
  }
  entries.push(sizes.slice(start).trim());
  for (const entry of entries) {
    const media = /^((?:\([^()]*\)(?:\s+and\s+)?)*)\s*(.*)$/.exec(entry)!;
    const conditions = [...media[1].matchAll(/\(([^()]*)\)/g)].map((m) => m[1].trim());
    const ok = conditions.every((c) => {
      const minWidth = /^min-width:\s*(\d+)px$/.exec(c);
      if (minWidth) return vp.width >= Number(minWidth[1]);
      if (c === 'orientation: landscape') return vp.width > vp.height;
      throw new Error(`condición no prevista: ${c}`);
    });
    if (!ok) continue;
    const value = media[2];
    if (!supportsMin && value.includes('min(')) continue;
    const js = value
      .replace(/calc\(/g, '(')
      .replace(/min\(/g, 'Math.min(')
      .replace(/(\d+(?:\.\d+)?)vw/g, (_, n) => String((Number(n) * vp.width) / 100))
      .replace(/(\d+(?:\.\d+)?)vh/g, (_, n) => String((Number(n) * vp.height) / 100))
      .replace(/(\d+(?:\.\d+)?)px/g, '$1');
    return Number(new Function(`return ${js}`)());
  }
  throw new Error(`sin entrada para ${vp.width}×${vp.height}`);
}

const viewports = [
  { width: 360, height: 740 },
  { width: 390, height: 844 },
  { width: 844, height: 390 },
  { width: 820, height: 1180 },
  { width: 1024, height: 1366 },
  { width: 1024, height: 768 },
  { width: 1180, height: 820 },
  { width: 1366, height: 1024 },
  { width: 1440, height: 900 },
  { width: 1920, height: 1080 },
];

describe('comicPanelWidth (modelo de la rejilla del cómic)', () => {
  it('coincide con las medidas reales tomadas en Chromium', () => {
    expect(comicPanelWidth('half', { width: 390, height: 844 })).toBe(358);
    expect(comicPanelWidth('full', { width: 820, height: 1180 })).toBe(764);
    expect(comicPanelWidth('full', { width: 1180, height: 820 })).toBeCloseTo(966.2, 1);
    expect(comicPanelWidth('half', { width: 1180, height: 820 })).toBeCloseTo(469.1, 1);
  });

  it('las viñetas medias y completas solo se distinguen desde lg', () => {
    expect(comicPanelWidth('half', { width: 820, height: 1180 })).toBe(comicPanelWidth('full', { width: 820, height: 1180 }));
    expect(comicPanelWidth('half', { width: 1180, height: 820 })).toBeLessThan(comicPanelWidth('full', { width: 1180, height: 820 }) / 2);
  });
});

describe('comicPanelSizes (atributo sizes de cada viñeta)', () => {
  for (const span of ['full', 'half', undefined] as const) {
    it(`anuncia el ancho real de una viñeta ${span ?? 'sin span'} en ${viewports.length} viewports`, () => {
      for (const vp of viewports) expect(resolveSizes(comicPanelSizes(span), vp)).toBeCloseTo(comicPanelWidth(span, vp), 1);
    });

    it(`sin soporte de min() el respaldo nunca se queda corto (${span ?? 'sin span'})`, () => {
      for (const vp of viewports) {
        const exact = comicPanelWidth(span, vp);
        const fallback = resolveSizes(comicPanelSizes(span), vp, false);
        expect(fallback).toBeGreaterThanOrEqual(exact - 0.01);
        expect(fallback).toBeLessThanOrEqual(exact * 1.2);
      }
    });
  }

  it('las viñetas completas del piloto ya no anuncian media pantalla en horizontal', () => {
    const full = story.scenes.flatMap((s) => s.comic ?? []).filter((p) => p.span === 'full');
    expect(full.length).toBeGreaterThan(0);
    for (const panel of full) expect(resolveSizes(comicPanelSizes(panel.span), { width: 1180, height: 820 })).toBeGreaterThan(900);
  });
});

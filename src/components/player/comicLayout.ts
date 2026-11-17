/**
 * Medidas de la rejilla del cómic y atributo `sizes` de cada viñeta (sin React; ver comicLayout.test.ts).
 *
 * El navegador elige la variante del `srcset` con el ancho que anuncia `sizes` antes de maquetar.
 * Si `sizes` exagera, descarga de más; si se queda corto, la ilustración pierde definición.
 * Por eso cada viñeta anuncia el ancho que realmente ocupará según su `span`:
 * - `full`: las dos columnas de la rejilla.
 * - `half` (o sin `span`): una columna desde `lg`; el ancho completo por debajo.
 *
 * Estas constantes reflejan las clases de `StoryPlayer.tsx` (escenario) y `ComicView.tsx` (rejilla).
 * Si cambian allí, hay que cambiarlas aquí: `tests/browser/comic-sizes.mjs` compara el modelo con la maqueta real.
 */
import type { ComicPanel } from '../../engine/types.ts';

export const COMIC_GRID = {
  /** `sm` de Tailwind: el escenario pasa de `px-3` a `px-6`. */
  smMin: 640,
  /** `lg` de Tailwind: la rejilla pasa a dos columnas. */
  lgMin: 1024,
  /** Margen lateral del escenario (`px-3` / `sm:px-6`), por lado. */
  padding: 12,
  paddingSm: 24,
  /** `max-w-6xl` (1152 px, con el margen incluido) menos `px-6` × 2. */
  maxContent: 1104,
  /** `lg:gap-5`. */
  gap: 20,
  /** `lg:landscape:max-w-[calc((100dvh-17rem)*16/9)]`: 17rem = 272 px. */
  landscapeReserve: 272,
  landscapeRatio: 16 / 9,
  /** `border-[4px]` de cada viñeta, por lado. */
  border: 4,
} as const;

type Span = ComicPanel['span'];

/** Ancho en px CSS de la imagen de una viñeta en un viewport dado (modelo de la maqueta). */
export function comicPanelWidth(span: Span, viewport: { width: number; height: number }): number {
  const g = COMIC_GRID;
  const { width, height } = viewport;
  const padding = width >= g.smMin ? g.paddingSm : g.padding;
  let grid = Math.min(width - 2 * padding, g.maxContent);
  // CSS `orientation: landscape` = más ancho que alto.
  if (width >= g.lgMin && width > height) grid = Math.min(grid, (height - g.landscapeReserve) * g.landscapeRatio);
  const cell = width >= g.lgMin && span !== 'full' ? (grid - g.gap) / 2 : grid;
  return cell - 2 * g.border;
}

const px = (n: number) => `${Math.round(n * 100) / 100}px`;

/**
 * `sizes` de una viñeta. Las dos primeras entradas usan `min()` y dan el ancho exacto
 * (incluido el límite de alto en horizontal). Si un navegador no entiende `min()` dentro de `sizes`,
 * descarta esas entradas y usa las siguientes: un respaldo que nunca se queda corto.
 */
export function comicPanelSizes(span: Span): string {
  const g = COMIC_GRID;
  const lg = `(min-width: ${g.lgMin}px)`;
  const outer = 2 * g.paddingSm;
  const gridPortrait = `min(100vw - ${outer}px, ${g.maxContent}px)`;
  const gridLandscape = `min(100vw - ${outer}px, ${g.maxContent}px, (100vh - ${g.landscapeReserve}px) * 16 / 9)`;
  const cell = (grid: string) => (span === 'full' ? `calc(${grid} - ${2 * g.border}px)` : `calc((${grid} - ${g.gap}px) / 2 - ${2 * g.border}px)`);
  // Respaldo sin min(): a partir de este ancho el escenario ya está en su máximo.
  const capFrom = g.maxContent + outer;
  const capped = span === 'full' ? g.maxContent - 2 * g.border : (g.maxContent - g.gap) / 2 - 2 * g.border;
  const fluid = span === 'full' ? `calc(100vw - ${outer + 2 * g.border}px)` : `calc(50vw - ${outer / 2 + g.gap / 2 + 2 * g.border}px)`;
  return [
    `${lg} and (orientation: landscape) ${cell(gridLandscape)}`,
    `${lg} ${cell(gridPortrait)}`,
    `(min-width: ${capFrom}px) ${px(capped)}`,
    `${lg} ${fluid}`,
    `(min-width: ${g.smMin}px) calc(100vw - ${outer + 2 * g.border}px)`,
    `calc(100vw - ${2 * g.padding + 2 * g.border}px)`,
  ].join(', ');
}

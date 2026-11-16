/**
 * Lógica pura para servir ilustraciones definitivas: srcset, ajuste, punto focal y precarga.
 * Sin React para poder probarla en Node (imageSource.test.ts).
 */
import type { AspectRatio, AssetSpec } from '../../engine/types.ts';

export type Fit = 'cover' | 'contain';

/** Un recurso solo se sirve como imagen cuando su estado es `listo`. */
export const isReady = (asset: AssetSpec | undefined): asset is AssetSpec => asset?.status === 'listo';

/** `/media/a/b.webp` + 1200 → `/media/a/b-1200w.webp` */
export function variantPath(file: string, width: number): string {
  const dot = file.lastIndexOf('.');
  return dot > file.lastIndexOf('/') ? `${file.slice(0, dot)}-${width}w${file.slice(dot)}` : `${file}-${width}w`;
}

/** srcset con las variantes declaradas + el archivo principal como el ancho mayor. */
export function buildSrcSet(asset: AssetSpec): string | undefined {
  const widths = (asset.variants ?? []).filter((w) => Number.isFinite(w) && w > 0 && w < asset.size.width);
  if (widths.length === 0) return undefined;
  const unique = Array.from(new Set(widths)).sort((a, b) => a - b);
  return [...unique.map((w) => `${variantPath(asset.file, w)} ${w}w`), `${asset.file} ${asset.size.width}w`].join(', ');
}

/** Transparentes (personajes, herramientas, emociones) nunca se recortan. */
export const defaultFit = (asset: AssetSpec): Fit => (asset.transparent ? 'contain' : 'cover');

const clamp = (n: number) => Math.min(100, Math.max(0, n));

/** `object-position` a partir del punto focal (centro si no se declara). */
export function objectPosition(asset: AssetSpec): string {
  const f = asset.focus;
  return f ? `${clamp(f.x)}% ${clamp(f.y)}%` : '50% 50%';
}

/** `aspect-ratio` CSS a partir de la proporción del registro. */
export const cssAspect = (aspect: AspectRatio): string => aspect.replace(':', ' / ');

const preloaded = new Set<string>();

/** Precarga discreta (sin bloquear) de los recursos listos que se verán a continuación. */
export function preload(assets: (AssetSpec | undefined)[]): void {
  if (typeof Image === 'undefined') return;
  for (const a of assets) {
    if (!isReady(a) || preloaded.has(a.id)) continue;
    preloaded.add(a.id);
    const img = new Image();
    img.decoding = 'async';
    const srcSet = buildSrcSet(a);
    if (srcSet) {
      img.sizes = '100vw';
      img.srcset = srcSet;
    }
    img.src = a.file;
  }
}

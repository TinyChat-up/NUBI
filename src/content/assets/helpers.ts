import type { AspectRatio, AssetKind, AssetSpec } from '../../engine/types.ts';

/** Dimensiones recomendadas por proporción (exportar a 2x para tabletas de alta densidad). */
export const SIZES: Record<AspectRatio, { width: number; height: number }> = {
  '16:9': { width: 2400, height: 1350 },
  '4:3': { width: 2048, height: 1536 },
  '3:2': { width: 2100, height: 1400 },
  '1:1': { width: 1024, height: 1024 },
  '3:4': { width: 1536, height: 2048 },
};

type Input = Omit<AssetSpec, 'size' | 'status' | 'kind' | 'transparent' | 'background' | 'characters' | 'emotionOrAction'> &
  Partial<Pick<AssetSpec, 'size' | 'status' | 'transparent' | 'background' | 'characters' | 'emotionOrAction'>>;

export function defineAsset(kind: AssetKind, input: Input): AssetSpec {
  return {
    status: 'pendiente',
    transparent: false,
    background: 'Escena completa con fondo ilustrado.',
    characters: [],
    emotionOrAction: '—',
    size: SIZES[input.aspect],
    kind,
    ...input,
  };
}

export function toRecord(list: AssetSpec[]): Record<string, AssetSpec> {
  const record: Record<string, AssetSpec> = {};
  for (const asset of list) {
    if (record[asset.id]) throw new Error(`Asset duplicado: ${asset.id}`);
    record[asset.id] = asset;
  }
  return record;
}

import type { AssetSpec } from '../../engine/types.ts';
import { commonAssets } from './common.ts';
import { unaMananaDiferenteAssets } from '../stories/una-manana-diferente/assets.ts';
import { toRecord } from './helpers.ts';

/** Registro único de recursos visuales. Fuente de docs/ASSET_REQUESTS.md (npm run assets:doc). */
export const assetGroups: { title: string; assets: AssetSpec[] }[] = [
  { title: 'Plataforma (portada, personajes, lugares, herramientas, emociones)', assets: commonAssets },
  { title: 'Episodio piloto · Una mañana diferente', assets: unaMananaDiferenteAssets },
];

export const assets: Record<string, AssetSpec> = toRecord(assetGroups.flatMap((g) => g.assets));

export const getAsset = (id: string): AssetSpec | undefined => assets[id];

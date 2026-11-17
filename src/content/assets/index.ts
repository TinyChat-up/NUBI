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

/**
 * Recursos de la historia técnica de prueba (fase 21). Solo se registran en desarrollo, desde la ruta
 * de prueba: nunca forman parte del registro oficial, del catálogo ni del paquete de producción.
 */
const devAssets: Record<string, AssetSpec> = {};
export function registerDevAssets(list: AssetSpec[]) {
  for (const a of list) devAssets[a.id] = a;
}

export const getAsset = (id: string): AssetSpec | undefined => assets[id] ?? devAssets[id];

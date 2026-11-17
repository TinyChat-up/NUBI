/**
 * Historias SOLO DE DESARROLLO (no están en la biblioteca ni en el paquete de producción).
 * Se importan únicamente desde src/screens/DevScreens.tsx, que App.tsx carga solo con import.meta.env.DEV.
 */
import type { AssetSpec, Story } from '../../../engine/types.ts';
import { registerDevAssets } from '../../assets/index.ts';
import { branchingTestAssets, branchingTestStory } from './branching-test.ts';
import { libroDeTrenes } from './libro-de-trenes/story.ts';
import { libroProvisionalAssets } from './libro-de-trenes/assets.ts';

export const devStories: Record<string, Story> = {
  [branchingTestStory.id]: branchingTestStory,
  [libroDeTrenes.id]: libroDeTrenes,
};

/** Recursos exclusivos de cada historia de desarrollo (los reutilizados ya están en el registro oficial). */
export const devAssetsByStory: Record<string, AssetSpec[]> = {
  [branchingTestStory.id]: branchingTestAssets,
  [libroDeTrenes.id]: libroProvisionalAssets,
};

Object.values(devAssetsByStory).forEach(registerDevAssets);

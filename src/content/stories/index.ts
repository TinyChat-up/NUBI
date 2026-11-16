import type { PlaceId, Story } from '../../engine/types.ts';
import { unaMananaDiferente } from './una-manana-diferente/story.ts';

/**
 * Registro de historias. Para añadir una historia:
 * 1. Crea src/content/stories/<id>/story.ts y assets.ts.
 * 2. Añade sus assets en src/content/assets/index.ts.
 * 3. Añádela a esta lista. `npm test` valida su estructura.
 */
export const storyList: Story[] = [unaMananaDiferente];

export const stories: Record<string, Story> = Object.fromEntries(storyList.map((s) => [s.id, s]));

export const getStory = (id: string): Story | undefined => stories[id];

export const storiesByPlace = (place: PlaceId): Story[] => storyList.filter((s) => s.place === place);

import { StoryPlayer } from '../components/player/StoryPlayer.tsx';
import { registerDevAssets } from '../content/assets/index.ts';
import { branchingTestAssets, branchingTestStory } from '../content/stories/__dev__/branching-test.ts';
import { useLocation } from '../lib/router.tsx';

registerDevAssets(branchingTestAssets);

/**
 * SOLO DESARROLLO (fase 21): reproduce la historia técnica ramificada para las pruebas de navegador.
 * App.tsx solo registra esta ruta con `import.meta.env.DEV`; no existe en producción ni en la biblioteca.
 */
export function DevBranchingScreen({ format }: { format: 'cuento' | 'comic' }) {
  const { query } = useLocation();
  return (
    <StoryPlayer key={format} story={branchingTestStory} format={format} resume={query.get('continuar') === '1'} exitTo="/" />
  );
}

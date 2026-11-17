import { StoryPlayer } from '../components/player/StoryPlayer.tsx';
import { devStories } from '../content/stories/__dev__/index.ts';
import { LinkButton, Page, PageHeader } from '../components/ui.tsx';
import { useLocation } from '../lib/router.tsx';

/**
 * SOLO DESARROLLO (fases 21–22). Se carga con import() diferido desde App.tsx solo con import.meta.env.DEV.
 * No aparece en la navegación, en la biblioteca ni en el paquete de producción.
 */
export function DevPlayer({ storyId, format }: { storyId: string; format: 'cuento' | 'comic' }) {
  const { query } = useLocation();
  const story = devStories[storyId];
  if (!story) return null;
  return <StoryPlayer key={`${storyId}-${format}`} story={story} format={format} resume={query.get('continuar') === '1'} exitTo="/dev" />;
}

export function DevIndex() {
  return (
    <Page>
      <PageHeader title="Historias de desarrollo" subtitle="Solo para revisión. No son contenido publicado." icon="info" />
      <p className="mb-6 rounded-3xl bg-mostaza-100 p-4 font-bold text-mostaza-700">
        Propuestas pendientes de aprobación editorial. Las ilustraciones marcadas como PROVISIONAL son marcadores, no arte definitivo.
      </p>
      <ul className="grid gap-3">
        <li>
          <LinkButton to="/dev/libro-de-trenes/cuento" size="lg" icon="story">
            El libro de trenes (cuento)
          </LinkButton>
        </li>
        <li>
          <LinkButton to="/dev/historia-ramificada/cuento" variant="secondary" size="lg" icon="footsteps">
            Historia técnica de prueba (cuento)
          </LinkButton>
        </li>
      </ul>
    </Page>
  );
}

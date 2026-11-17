import { storyList } from '../content/stories/index.ts';
import type { Story } from '../engine/types.ts';
import { Icon } from '../components/Icon.tsx';
import { Illustration } from '../components/Illustration.tsx';
import { StoryCard } from '../components/StoryCard.tsx';
import { LinkButton, Page, PageHeader } from '../components/ui.tsx';
import { useProgress } from '../state/progress.tsx';

/**
 * DESCUBRIR UN CUENTO (fase 19). Sin filtros ni anuncios de lo que aún no existe:
 * - con una sola historia, se presenta como protagonista (cubierta grande, título, descripción, un botón);
 * - con varias, se muestran sus tarjetas automáticamente.
 */
export function StoriesScreen() {
  return (
    <Page>
      <PageHeader title="Descubrir un cuento" subtitle="Elige un cuento. Descubre qué pasa y qué podría pasar." icon="story" />
      {storyList.length === 1 ? (
        <FeaturedStory story={storyList[0]} />
      ) : (
        <ul className="story-shelf">
          {storyList.map((s) => (
            <li key={s.id}>
              <StoryCard story={s} />
            </li>
          ))}
        </ul>
      )}
    </Page>
  );
}

function FeaturedStory({ story }: { story: Story }) {
  const { progress } = useProgress();
  const p = progress.stories[story.id];
  return (
    <article className="story-featured" aria-labelledby={`story-${story.id}`}>
      <Illustration id={story.cover} priority ratio fit="contain" sizes="(min-width: 1024px) 560px, (min-width: 768px) 50vw, 100vw" className="story-featured-art" />
      <div className="story-featured-copy">
        <h2 id={`story-${story.id}`} className="reading-text text-4xl text-petroleo-900 sm:text-5xl">
          {story.title}
        </h2>
        <p className="reading-text text-xl">{story.tagline}</p>
        {p && (
          <p className="flex items-center gap-2 font-bold text-salvia-700">
            <Icon name={p.completedAt ? 'check' : 'footsteps'} size={20} />
            {p.completedAt ? 'Ya lo has leído. Puedes volver cuando quieras.' : 'Ya lo empezaste. Puedes seguir donde lo dejaste.'}
          </p>
        )}
        <div>
          <LinkButton to={`/historias/${story.id}`} size="lg" iconAfter="arrow-right">
            Abrir el cuento
          </LinkButton>
        </div>
      </div>
    </article>
  );
}

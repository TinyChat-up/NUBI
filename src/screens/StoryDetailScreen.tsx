import { characters } from '../content/characters.ts';
import { places } from '../content/places.ts';
import { getStory } from '../content/stories/index.ts';
import type { FormatId } from '../engine/types.ts';
import { Icon } from '../components/Icon.tsx';
import { Illustration } from '../components/Illustration.tsx';
import { FORMAT_META } from '../components/StoryCard.tsx';
import { Chip, LinkButton, Page } from '../components/ui.tsx';
import { Link } from '../lib/router.tsx';
import { useProgress } from '../state/progress.tsx';

const FORMAT_TEXT: Record<FormatId, string> = {
  cuento: 'Escenas ilustradas. Puedes leer o escuchar.',
  comic: 'Viñetas que se descubren una a una.',
  video: 'Pequeña película con subtítulos.',
};

/** Ficha de historia: elegir formato, ver escenas y personajes. */
export function StoryDetailScreen({ storyId }: { storyId: string }) {
  const story = getStory(storyId);
  const { progress, loadRun } = useProgress();
  if (!story) return null;

  const p = progress.stories[story.id];
  const place = places[story.place];

  return (
    <Page>
      <div className="mb-4">
        <LinkButton to="/historias" variant="ghost" icon="arrow-left">
          Historias
        </LinkButton>
      </div>

      <section className="story-opening">
        <Illustration id={story.cover} priority ratio fit="contain" sizes="(min-width: 768px) 38vw, 100vw" className="story-cover-art" showBadge />
        <div className="story-opening-copy">
          <div className="flex flex-wrap gap-2">
            <Chip icon={place.icon}>{place.name}</Chip>
            <Chip icon="clock" tone="crema">{story.durationMinutes.min}–{story.durationMinutes.max} min · orientativo</Chip>
            <Chip icon="user" tone="crema">{story.ages.min}–{story.ages.max} años</Chip>
          </div>
          <h1 className="reading-text text-4xl text-petroleo-900 sm:text-5xl">{story.title}</h1>
          <p className="reading-text text-xl">{story.tagline}</p>
          {p && <p className="flex items-center gap-2 font-bold text-salvia-700"><Icon name={p.completedAt ? 'check' : 'footsteps'} size={20} />{p.completedAt ? 'Ya la has terminado. Puedes volver cuando quieras.' : `Has visitado ${p.visitedScenes.length} de ${story.scenes.length} escenas.`}</p>}
        </div>
      </section>

      <section aria-labelledby="formats-title" className="format-section">
        <h2 id="formats-title" className="mb-5 text-2xl text-petroleo-900">¿Cómo quieres descubrirla?</h2>
        <ul className="format-choices">
          {story.formats.map((f) => {
            const pending = f === 'video' && story.video?.status !== 'listo';
            const saved = f !== 'video' && loadRun(story.id, f);
            return (
              <li key={f} className={pending ? 'format-pending' : ''}>
                <Link to={`/historias/${story.id}/${f}${saved ? '?continuar=1' : ''}`} className={`tap format-choice format-${f}`}>
                  {!pending && <span className="format-art" aria-hidden>
                    {f === 'comic' ? story.scenes.flatMap((sc) => sc.comic ?? []).slice(0, 2).map((panel) => <Illustration key={panel.id} id={panel.illustration} decorative ratio fit="contain" sizes="160px" />) : <Illustration id={story.cover} decorative ratio fit="contain" sizes="240px" />}
                  </span>}
                  <span className="format-copy">
                    <span className="flex items-center gap-3 text-2xl font-black text-petroleo-900"><Icon name={FORMAT_META[f].icon} size={28} />{FORMAT_META[f].label}{!pending && <Icon name="arrow-right" className="ml-auto" />}</span>
                    <span className="reading-text mt-2 block text-tinta-suave">{pending ? 'En producción' : saved ? 'Continuar donde lo dejaste' : FORMAT_TEXT[f]}</span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      <details className="story-about group">
        <summary className="flex min-h-14 cursor-pointer items-center gap-3 text-xl font-extrabold text-petroleo-900">Sobre esta historia<Icon name="chevron-right" className="ml-auto group-open:rotate-90" /></summary>
        <p className="reading-text mt-3 text-lg">{story.synopsis}</p>
      </details>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1.4fr_1fr]">
        <section aria-labelledby="scenes-title">
          <h2 id="scenes-title" className="mb-4 text-2xl text-petroleo-900">
            Escenas
          </h2>
          <ol className="grid gap-2">
            {story.scenes.map((scene) => (
              <li key={scene.id}>
                <Link to={`/historias/${story.id}/cuento?escena=${scene.id}`} className="tap flex min-h-14 items-center gap-3 rounded-2xl bg-crema-50 px-4 py-2 font-bold shadow-[var(--shadow-soft)] hover:bg-petroleo-50">
                  <span className="grid size-9 shrink-0 place-items-center rounded-full bg-petroleo-100 font-black text-petroleo-800">{scene.number}</span>
                  <span className="reading-text flex-1">{scene.title}</span>
                  {p?.visitedScenes.includes(scene.id) && <Icon name="check" size={20} label="Visitada" />}
                </Link>
              </li>
            ))}
          </ol>
        </section>

        <section aria-labelledby="cast-title">
          <h2 id="cast-title" className="mb-4 text-2xl text-petroleo-900">
            Personajes
          </h2>
          <ul className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-3">
            {story.characters.map((id) => {
              const c = characters[id];
              return (
                <li key={id} className="flex flex-col items-center gap-1 text-center">
                  <Illustration id={`char-${id}`} ratio sizes="(min-width: 1024px) 140px, (min-width: 640px) 22vw, 30vw" className="w-full rounded-2xl bg-crema-50" />
                  <span className="font-black text-petroleo-900">{c.name}</span>
                  <span className="text-sm leading-tight text-tinta-suave">{c.role}</span>
                </li>
              );
            })}
          </ul>
        </section>
      </div>

      <section className="mt-8 rounded-[var(--radius-card)] bg-petroleo-50 p-6">
        <h2 className="flex items-center gap-2 text-xl text-petroleo-900">
          <Icon name="grown" /> Para personas adultas
        </h2>
        <p className="reading-text mt-2">{story.familyGuide.intro}</p>
        <div className="mt-4">
          <LinkButton to={`/familias?historia=${story.id}`} variant="secondary" icon="book">
            Ver la guía para familias
          </LinkButton>
        </div>
      </section>
    </Page>
  );
}

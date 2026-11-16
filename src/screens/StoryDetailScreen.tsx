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

      <section className="card grid overflow-hidden lg:grid-cols-[1.15fr_1fr]">
        <Illustration id={story.cover} className="aspect-[4/3] w-full lg:aspect-auto lg:h-full" showBadge />
        <div className="flex flex-col gap-4 p-6 sm:p-8">
          <div className="flex flex-wrap gap-2">
            <Chip icon={place.icon}>{place.name}</Chip>
            <Chip icon="clock" tone="crema">
              {story.durationMinutes.min}–{story.durationMinutes.max} min
            </Chip>
            <Chip icon="user" tone="crema">
              {story.ages.min}–{story.ages.max} años
            </Chip>
          </div>
          <h1 className="text-4xl text-petroleo-900 sm:text-5xl">{story.title}</h1>
          <p className="reading-text text-lg">{story.synopsis}</p>
          {p && (
            <p className="flex items-center gap-2 font-bold text-salvia-700">
              <Icon name={p.completedAt ? 'check' : 'footsteps'} size={20} />
              {p.completedAt ? 'Ya la has terminado. Puedes volver cuando quieras.' : `Has visitado ${p.visitedScenes.length} de ${story.scenes.length} escenas.`}
            </p>
          )}
        </div>
      </section>

      <section aria-labelledby="formats-title" className="mt-8">
        <h2 id="formats-title" className="mb-4 text-2xl text-petroleo-900">
          ¿Cómo quieres descubrirla?
        </h2>
        <ul className="grid gap-4 sm:grid-cols-3">
          {story.formats.map((f) => {
            const pending = f === 'video' && story.video?.status !== 'listo';
            const saved = f !== 'video' && loadRun(story.id, f);
            return (
              <li key={f}>
                <Link to={`/historias/${story.id}/${f}${saved ? '?continuar=1' : ''}`} className="tap card flex h-full items-center gap-4 p-5 hover:shadow-[var(--shadow-lift)]">
                  <span className={`grid size-16 shrink-0 place-items-center rounded-2xl ${pending ? 'bg-crema-200 text-tinta-suave' : 'bg-coral-100 text-coral-700'}`}>
                    <Icon name={FORMAT_META[f].icon} size={32} />
                  </span>
                  <span>
                    <span className="block text-xl font-black text-petroleo-900">{FORMAT_META[f].label}</span>
                    <span className="reading-text block text-tinta-suave">{pending ? 'En producción' : saved ? 'Continuar donde lo dejaste' : FORMAT_TEXT[f]}</span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

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
                  <Illustration id={`char-${id}`} className="aspect-[3/4] w-full rounded-2xl bg-crema-50" />
                  <span className="font-black text-petroleo-900">{c.name}</span>
                  <span className="text-xs leading-tight text-tinta-suave">{c.role}</span>
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

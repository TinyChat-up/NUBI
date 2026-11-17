import { getStory } from '../content/stories/index.ts';
import type { FormatId } from '../engine/types.ts';
import { Icon } from '../components/Icon.tsx';
import { Illustration } from '../components/Illustration.tsx';
import { FORMAT_META } from '../components/StoryCard.tsx';
import { LinkButton, Page } from '../components/ui.tsx';
import { Link, useLocation } from '../lib/router.tsx';
import { useProgress } from '../state/progress.tsx';

type Readable = Exclude<FormatId, 'video'>;

const FORMAT_TEXT: Record<Readable, string> = {
  cuento: 'Página a página, con ilustraciones grandes. Puedes leerlo o escucharlo.',
  comic: 'Viñetas que se descubren una a una, con bocadillos.',
};

/**
 * Abrir un cuento (fase 19): elegir CUENTO o CÓMIC, dos formas de leer la misma historia.
 * - Si hay una partida guardada, la opción continúa donde se dejó.
 * - El vídeo, mientras esté en producción, es solo una nota: no compite con los dos formatos.
 * - La guía adulta queda al final, discreta, para volver a ella cuando haga falta.
 */
export function StoryDetailScreen({ storyId }: { storyId: string }) {
  const story = getStory(storyId);
  const { progress, loadRun } = useProgress();
  const { query } = useLocation();
  if (!story) return null;

  const p = progress.stories[story.id];
  const fromGuide = query.get('desde') === 'guia';
  const readable = story.formats.filter((f): f is Readable => f !== 'video');
  const videoReady = story.formats.includes('video') && story.video?.status === 'listo';

  return (
    <Page>
      <div className="mb-4">
        {fromGuide ? (
          <LinkButton to={`/acompanar/${story.id}`} variant="ghost" icon="arrow-left">
            Volver a la guía
          </LinkButton>
        ) : (
          <LinkButton to="/historias" variant="ghost" icon="arrow-left">
            Cuentos
          </LinkButton>
        )}
      </div>

      <section className="story-opening">
        <Illustration id={story.cover} priority ratio fit="contain" sizes="(min-width: 768px) 38vw, 100vw" className="story-cover-art" />
        <div className="story-opening-copy">
          <h1 className="reading-text text-4xl text-petroleo-900 sm:text-5xl">{story.title}</h1>
          <p className="reading-text text-xl">{story.tagline}</p>
          {p && (
            <p className="flex items-center gap-2 font-bold text-salvia-700">
              <Icon name={p.completedAt ? 'check' : 'footsteps'} size={20} />
              {p.completedAt ? 'Ya lo has leído. Puedes volver cuando quieras.' : 'Ya lo empezaste. Puedes seguir donde lo dejaste.'}
            </p>
          )}
        </div>
      </section>

      <section aria-labelledby="formats-title" className="format-section">
        <h2 id="formats-title" className="text-2xl text-petroleo-900">
          ¿Cómo quieres leerlo?
        </h2>
        <p className="reading-text mb-5 text-lg text-tinta-suave">Es la misma historia, contada de dos formas.</p>
        <ul className="format-choices">
          {readable.map((f) => {
            const saved = loadRun(story.id, f);
            return (
              <li key={f}>
                <Link to={`/historias/${story.id}/${f}${saved ? '?continuar=1' : ''}`} className={`tap format-choice format-${f}`}>
                  <span className="format-art" aria-hidden>
                    {f === 'comic' ? (
                      story.scenes
                        .flatMap((sc) => sc.comic ?? [])
                        .slice(0, 2)
                        .map((panel) => <Illustration key={panel.id} id={panel.illustration} decorative ratio fit="contain" sizes="160px" />)
                    ) : (
                      <Illustration id={story.cover} decorative ratio fit="contain" sizes="240px" />
                    )}
                  </span>
                  <span className="format-copy">
                    <span className="flex items-center gap-3 text-2xl font-black text-petroleo-900">
                      <Icon name={FORMAT_META[f].icon} size={28} />
                      {FORMAT_META[f].label}
                      <Icon name="arrow-right" className="ml-auto" />
                    </span>
                    <span className="reading-text mt-2 block text-tinta-suave">{saved ? 'Seguir donde lo dejaste' : FORMAT_TEXT[f]}</span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
        {story.formats.includes('video') &&
          (videoReady ? (
            <p className="mt-4">
              <Link to={`/historias/${story.id}/video`} className="tap inline-flex min-h-12 items-center gap-2 font-bold text-petroleo-700 underline underline-offset-4">
                <Icon name="film" size={20} /> También en vídeo
              </Link>
            </p>
          ) : (
            <p className="mt-4 flex items-center gap-2 text-tinta-suave">
              <Icon name="film" size={20} /> El vídeo de este cuento está en preparación.
            </p>
          ))}
      </section>

      <details className="story-about group">
        <summary className="flex min-h-14 cursor-pointer items-center gap-3 text-xl font-extrabold text-petroleo-900">
          De qué trata
          <Icon name="chevron-right" className="ml-auto group-open:rotate-90" />
        </summary>
        <p className="reading-text mt-3 text-lg">{story.synopsis}</p>
      </details>

      <p className="story-adult-link mt-8">
        <Link to={`/acompanar/${story.id}`} className="tap inline-flex min-h-12 items-center gap-2 rounded-full border-2 border-petroleo-200 px-4 font-bold text-petroleo-800 hover:border-petroleo-400">
          <Icon name="grown" size={20} /> Guía para familias y docentes
        </Link>
      </p>
    </Page>
  );
}

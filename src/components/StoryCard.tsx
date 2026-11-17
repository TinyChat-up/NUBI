import type { FormatId, Story } from '../engine/types.ts';
import { Link } from '../lib/router.tsx';
import { useProgress } from '../state/progress.tsx';
import { Icon } from './Icon.tsx';
import { Illustration } from './Illustration.tsx';

export const FORMAT_META: Record<FormatId, { label: string; icon: string }> = {
  cuento: { label: 'Cuento', icon: 'story' },
  comic: { label: 'Cómic', icon: 'comic' },
  video: { label: 'Vídeo', icon: 'film' },
};

/** Tarjeta de historia: imagen, título, descripción breve, duración y formatos. */
export function StoryCard({ story }: { story: Story }) {
  const { progress } = useProgress();
  const p = progress.stories[story.id];
  const videoPending = story.video?.status !== 'listo';

  return (
    <Link to={`/historias/${story.id}`} className="tap story-book group">
      <div className="relative">
        <Illustration id={story.cover} decorative sizes="(min-width: 640px) 45vw, 100vw" className="aspect-[4/3] w-full" />
        {p && (
          <span className="absolute top-3 right-3 inline-flex items-center gap-1 rounded-full bg-crema-50/95 px-3 py-1 text-sm font-bold text-salvia-700 shadow-[var(--shadow-soft)]">
            <Icon name={p.completedAt ? 'check' : 'footsteps'} size={16} strokeWidth={2.5} />
            {p.completedAt ? 'Terminada' : 'Empezada'}
          </span>
        )}
      </div>
      <div className="story-book-copy">
        <h2 className="text-3xl text-petroleo-900">{story.title}</h2>
        <p className="reading-text flex-1 text-tinta-suave">{story.tagline}</p>
        <div className="mt-2 flex flex-wrap items-center gap-2 text-sm font-bold">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-crema-200 px-3 py-1">
            <Icon name="clock" size={16} /> {story.durationMinutes.min}–{story.durationMinutes.max} min
          </span>
          {story.formats.map((f) => {
            const pending = f === 'video' && videoPending;
            return (
              <span key={f} className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 ${pending ? 'bg-crema-100 text-tinta-suave' : 'bg-petroleo-100 text-petroleo-800'}`}>
                <Icon name={FORMAT_META[f].icon} size={16} /> {FORMAT_META[f].label}
                {pending && <span className="font-semibold">(pronto)</span>}
              </span>
            );
          })}
        </div>
        <span className="book-open">Abrir la historia <Icon name="arrow-right" /></span>
      </div>
    </Link>
  );
}

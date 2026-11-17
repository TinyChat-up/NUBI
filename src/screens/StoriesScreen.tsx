import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { community } from '../content/community.ts';
import { storyList } from '../content/stories/index.ts';
import type { Story } from '../engine/types.ts';
import { Icon } from '../components/Icon.tsx';
import { Illustration } from '../components/Illustration.tsx';
import { GuideArt } from '../components/illustration/GuideArt.tsx';
import { LinkButton, Page, PageHeader } from '../components/ui.tsx';
import { usePrefersReducedMotion } from '../state/settings.tsx';
import { useProgress } from '../state/progress.tsx';

/**
 * DESCUBRIR UN CUENTO (fase 20): carrusel de portadas grandes.
 * - Una tarjeta por historia (se añaden solas) y una final, «Próximamente: nuevas historias», sin historias inventadas.
 * - Funciona con tacto (deslizar), ratón y teclado (flechas visibles «Anterior» / «Siguiente», y ← → dentro del carrusel).
 * - Sin desplazamiento automático. Con movimiento reducido, los saltos son instantáneos.
 */
export function StoriesScreen() {
  const listRef = useRef<HTMLUListElement>(null);
  const reduce = usePrefersReducedMotion();
  const total = storyList.length + 1;
  const [index, setIndex] = useState(0);

  const cards = () => [...(listRef.current?.children ?? [])] as HTMLElement[];

  // Tarjeta más visible ahora mismo (sigue al deslizamiento táctil y a la rueda del ratón).
  const sync = useCallback(() => {
    const list = listRef.current;
    if (!list) return;
    const items = cards();
    const max = list.scrollWidth - list.clientWidth;
    // Si todo cabe, el indicador sigue a las flechas; al final del carril, cuenta la última tarjeta
    // (con tarjetas anchas no se puede alinear la última a la izquierda).
    if (max <= 1) return;
    if (list.scrollLeft >= max - 2) {
      setIndex(items.length - 1);
      return;
    }
    const left = list.getBoundingClientRect().left;
    let best = 0;
    items.forEach((el, i) => {
      if (Math.abs(el.getBoundingClientRect().left - left) < Math.abs(items[best].getBoundingClientRect().left - left)) best = i;
    });
    setIndex(best);
  }, []);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    list.addEventListener('scroll', sync, { passive: true });
    return () => list.removeEventListener('scroll', sync);
  }, [sync]);

  const go = (i: number) => {
    const target = cards()[Math.max(0, Math.min(total - 1, i))];
    if (!target || !listRef.current) return;
    listRef.current.scrollTo({ left: target.offsetLeft - listRef.current.offsetLeft, behavior: reduce ? 'auto' : 'smooth' });
    setIndex(Math.max(0, Math.min(total - 1, i)));
  };

  const onKey = (e: KeyboardEvent) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    e.preventDefault();
    const next = index + (e.key === 'ArrowRight' ? 1 : -1);
    go(next);
    cards()[Math.max(0, Math.min(total - 1, next))]?.querySelector<HTMLElement>('a, h2')?.focus({ preventScroll: true });
  };

  return (
    <Page>
      <PageHeader title="Descubrir un cuento" subtitle="Elige un cuento. Descubre qué pasa y qué podría pasar." icon="story" />

      <section className="story-carousel" aria-roledescription="carrusel" aria-label="Cuentos">
        <ul ref={listRef} className="story-carousel-track" onKeyDown={onKey}>
          {storyList.map((s, i) => (
            <li key={s.id} aria-roledescription="tarjeta" aria-label={`${i + 1} de ${total}`}>
              <StorySlide story={s} />
            </li>
          ))}
          <li aria-roledescription="tarjeta" aria-label={`${total} de ${total}`}>
            <ComingSoon />
          </li>
        </ul>

        <div className="story-carousel-controls">
          <button type="button" className="tap carousel-arrow" onClick={() => go(index - 1)} disabled={index === 0} aria-label="Cuento anterior">
            <Icon name="arrow-left" size={24} />
          </button>
          <p className="font-bold text-tinta-suave" aria-live="polite">
            {index + 1} de {total}
          </p>
          <button type="button" className="tap carousel-arrow" onClick={() => go(index + 1)} disabled={index === total - 1} aria-label="Cuento siguiente">
            <Icon name="arrow-right" size={24} />
          </button>
        </div>
      </section>
    </Page>
  );
}

function StorySlide({ story }: { story: Story }) {
  const { progress } = useProgress();
  const p = progress.stories[story.id];
  return (
    <article className="story-slide" aria-labelledby={`story-${story.id}`}>
      <Illustration id={story.cover} priority ratio fit="contain" sizes="(min-width: 1024px) 560px, (min-width: 768px) 60vw, 86vw" className="story-slide-art" />
      <div className="story-slide-copy">
        <h2 id={`story-${story.id}`} tabIndex={-1} className="reading-text text-3xl text-petroleo-900 sm:text-4xl">
          {story.title}
        </h2>
        <p className="reading-text text-lg sm:text-xl">{story.tagline}</p>
        {p && (
          <p className="flex items-center gap-2 font-bold text-salvia-700">
            <Icon name={p.completedAt ? 'check' : 'footsteps'} size={20} />
            {p.completedAt ? 'Ya lo has leído.' : 'Ya lo empezaste.'}
          </p>
        )}
        <div className="mt-auto">
          <LinkButton to={`/historias/${story.id}`} size="lg" iconAfter="arrow-right">
            Abrir el cuento
          </LinkButton>
        </div>
      </div>
    </article>
  );
}

/** Tarjeta final: invitación honesta, sin historias inventadas ni enlaces que no existan. */
function ComingSoon() {
  return (
    <article className="story-slide story-slide-soon" aria-labelledby="coming-soon">
      <div className="story-slide-soon-art" aria-hidden>
        <GuideArt mood="thinking" size={160} />
      </div>
      <div className="story-slide-copy">
        <h2 id="coming-soon" tabIndex={-1} className="reading-text text-3xl text-petroleo-900 sm:text-4xl">
          Próximamente: nuevas historias
        </h2>
        <p className="reading-text text-lg sm:text-xl">Las próximas historias nacerán de las situaciones que propongáis en los comentarios de Instagram.</p>
        {community.instagramUrl ? (
          <a href={community.instagramUrl} target="_blank" rel="noreferrer noopener" className="tap mt-auto inline-flex min-h-12 items-center gap-2 font-bold text-petroleo-700 underline underline-offset-4">
            Proponer una situación<span className="sr-only"> (Instagram, se abre en otra pestaña)</span>
          </a>
        ) : (
          <p className="reading-text mt-auto font-bold text-petroleo-800">¿Qué situación te gustaría ver en un cuento? Cuéntaselo a una persona adulta para que la proponga.</p>
        )}
      </div>
    </article>
  );
}

import { useEffect, useRef } from 'react';
import type { Bubble, BubblePosition, ComicPanel } from '../../engine/types.ts';
import { characters } from '../../content/characters.ts';
import { Icon } from '../Icon.tsx';
import { Illustration } from '../Illustration.tsx';
import { comicPanelSizes } from './comicLayout.ts';

/**
 * Cómic interactivo: las viñetas se descubren una a una.
 *
 * Bocadillos:
 * - Viñeta ancha (contenedor ≥ 32rem): bocadillos superpuestos en la zona que el arte reserva
 *   (`bubble.position`), con ancho máximo del 44 % para no tapar caras ni comunicadores.
 * - Viñeta estrecha (móvil): los mismos bocadillos se leen DEBAJO de la imagen, en orden.
 *   Nunca se pierde texto ni se tapa la ilustración.
 * Solo una de las dos versiones está visible (display), así que los lectores de pantalla no la leen dos veces.
 */

const POS: Record<BubblePosition, string> = {
  'top-left': 'top-3 left-3 items-start',
  'top-right': 'top-3 right-3 items-end',
  'bottom-left': 'bottom-3 left-3 items-start',
  'bottom-right': 'bottom-3 right-3 items-end',
  top: 'top-3 left-1/2 -translate-x-1/2 items-center',
  bottom: 'bottom-3 left-1/2 -translate-x-1/2 items-center',
};

/** La cola apunta hacia el centro de la viñeta, donde suelen estar los personajes. */
function Tail({ position, thought }: { position: BubblePosition; thought: boolean }) {
  const top = position.startsWith('top');
  const side = position.endsWith('left') ? 'left-7' : position.endsWith('right') ? 'right-7' : 'left-1/2 -translate-x-1/2';
  if (thought) {
    return (
      <span aria-hidden className={`absolute ${side} ${top ? '-bottom-5' : '-top-5'} flex ${top ? 'flex-col' : 'flex-col-reverse'} items-center gap-0.5`}>
        <span className="size-2.5 rounded-full border-[3px] border-tinta bg-crema-50" />
        <span className="size-1.5 rounded-full border-2 border-tinta bg-crema-50" />
      </span>
    );
  }
  return (
    <svg aria-hidden viewBox="0 0 24 16" className={`absolute h-4 w-6 ${side} ${top ? '-bottom-[13px] rotate-180' : '-top-[13px]'}`}>
      <path d="M2 16 L12 2 L22 16" fill="#fffcf6" stroke="#22333A" strokeWidth="3" strokeLinejoin="round" />
    </svg>
  );
}

function SpeakerLabel({ bubble }: { bubble: Bubble }) {
  const speaker = bubble.speaker ? characters[bubble.speaker] : undefined;
  if (!speaker) return null;
  return (
    <span className="w-fit rounded-full border-2 bg-crema-50 px-2.5 py-0.5 text-sm font-black text-petroleo-900" style={{ borderColor: speaker.color }}>
      {speaker.name}
      {bubble.kind === 'thought' ? ' piensa' : bubble.kind === 'device' ? ' · comunicador' : ''}
    </span>
  );
}

function BubbleBody({ bubble, tail }: { bubble: Bubble; tail?: BubblePosition }) {
  if (bubble.kind === 'sound') {
    return <span className="reading-text w-fit -rotate-3 rounded-xl bg-mostaza-200/95 px-3 py-1 text-lg font-black text-mostaza-700 italic sm:text-xl">{bubble.text}</span>;
  }
  if (bubble.kind === 'device') {
    // Comunicador de pictogramas: cada palabra es una casilla.
    return (
      <span className="flex w-fit flex-wrap gap-1.5 rounded-2xl bg-petroleo-900 p-2 shadow-[var(--shadow-lift)]">
        {bubble.text.split('·').map((word) => (
          <span key={word} className="reading-text rounded-lg bg-crema-50 px-2.5 py-1.5 text-sm font-black text-petroleo-900 sm:text-base">
            {word.trim()}
          </span>
        ))}
      </span>
    );
  }
  const thought = bubble.kind === 'thought';
  return (
    <span
      className={`reading-text relative block w-fit border-[3px] border-tinta bg-crema-50 px-3.5 py-2 text-base leading-snug font-bold text-tinta shadow-[var(--shadow-soft)] sm:text-lg ${
        thought ? 'rounded-[2rem] border-dashed' : 'rounded-2xl'
      }`}
    >
      {bubble.text}
      {tail && <Tail position={tail} thought={thought} />}
    </span>
  );
}

function Panel({ panel, current }: { panel: ComicPanel; current: boolean }) {
  const ordered = panel.bubbles;
  return (
    <figure className="@container m-0">
      {panel.caption && <figcaption className="reading-text border-b-[3px] border-tinta bg-mostaza-100 px-4 py-2 text-base font-extrabold sm:text-lg">{panel.caption}</figcaption>}
      <div className="relative">
        <Illustration id={panel.illustration} ratio priority={current} sizes={comicPanelSizes(panel.span)} className="w-full" />
        {/* Bocadillos superpuestos: solo si la viñeta es ancha. */}
        {ordered.map((b, i) => (
          <p
            key={b.id}
            // Abajo: la etiqueta va debajo del bocadillo para que la cola (hacia arriba) no la pise.
            className={`absolute z-10 hidden max-w-[44%] animate-pop gap-1 @lg:flex ${b.position.startsWith('bottom') ? 'flex-col-reverse' : 'flex-col'} ${POS[b.position]}`} style={{ animationDelay: `${250 + i * 450}ms` }}>
            <SpeakerLabel bubble={b} />
            <BubbleBody bubble={b} tail={b.kind === 'speech' || b.kind === 'thought' ? b.position : undefined} />
          </p>
        ))}
      </div>
      {/* Bocadillos en lista: viñeta estrecha. */}
      {ordered.length > 0 && (
        <ol className="flex flex-col gap-3 border-t-[3px] border-tinta bg-crema-100 p-3 @lg:hidden">
          {ordered.map((b, i) => (
            <li key={b.id} className="flex animate-rise flex-col gap-1" style={{ animationDelay: `${150 + i * 300}ms` }}>
              <SpeakerLabel bubble={b} />
              <BubbleBody bubble={b} />
            </li>
          ))}
        </ol>
      )}
    </figure>
  );
}

export function ComicView({ panels, index, pausedMotion, onReveal }: { panels: ComicPanel[]; index: number; pausedMotion: boolean; onReveal?: () => void }) {
  const currentRef = useRef<HTMLLIElement>(null);

  useEffect(() => {
    const reduce = pausedMotion || document.documentElement.dataset.motion === 'reduced' || window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    currentRef.current?.scrollIntoView({ block: 'nearest', behavior: reduce ? 'auto' : 'smooth' });
  }, [index, pausedMotion]);

  const nextPanel = panels[index + 1];

  return (
    // Rejilla y bordes: si cambian, actualizar COMIC_GRID en comicLayout.ts (de ahí sale `sizes`).
    <ol
      className={`mx-auto grid w-full grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-5 lg:landscape:max-w-[calc((100dvh-17rem)*16/9)] ${pausedMotion ? 'anim-paused' : ''}`}
      aria-label="Viñetas del cómic"
    >
      {panels.slice(0, index + 1).map((panel, i) => (
        <li
          key={panel.id}
          ref={i === index ? currentRef : undefined}
          aria-current={i === index ? 'step' : undefined}
          className={`${panel.span === 'full' ? 'lg:col-span-2' : ''} animate-pop overflow-hidden rounded-3xl border-[4px] border-tinta bg-crema-50 ${
            i === index ? 'shadow-[var(--shadow-lift)]' : ''
          }`}
        >
          <Panel panel={panel} current={i === index} />
        </li>
      ))}
      {nextPanel && (
        <li className={nextPanel.span === 'full' ? 'lg:col-span-2' : ''}>
          {onReveal ? (
            <button
              type="button"
              onClick={onReveal}
              className="tap flex min-h-32 w-full flex-col items-center justify-center gap-2 rounded-3xl border-[3px] border-dashed border-crema-400 bg-crema-50/60 p-4 font-extrabold text-petroleo-800 hover:border-petroleo-400 hover:bg-petroleo-50"
            >
              <Icon name="sparkle" size={32} />
              Descubrir la siguiente viñeta
            </button>
          ) : (
            <div aria-label="Viñeta por descubrir" className="grid min-h-32 place-items-center rounded-3xl border-[3px] border-dashed border-crema-400 text-crema-400">
              <Icon name="question" size={40} />
            </div>
          )}
        </li>
      )}
    </ol>
  );
}

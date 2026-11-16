import { useEffect, useRef } from 'react';
import type { Bubble, ComicPanel } from '../../engine/types.ts';
import { characters } from '../../content/characters.ts';
import { Icon } from '../Icon.tsx';
import { Illustration } from '../Illustration.tsx';

const POS: Record<Bubble['position'], string> = {
  'top-left': 'top-3 left-3 items-start',
  'top-right': 'top-3 right-3 items-end',
  'bottom-left': 'bottom-3 left-3 items-start',
  'bottom-right': 'bottom-3 right-3 items-end',
  top: 'top-3 left-1/2 -translate-x-1/2 items-center',
  bottom: 'bottom-3 left-1/2 -translate-x-1/2 items-center',
};

function BubbleView({ bubble, delay }: { bubble: Bubble; delay: number }) {
  const speaker = bubble.speaker ? characters[bubble.speaker] : undefined;
  const style = { animationDelay: `${delay}ms` };
  const wrap = `absolute z-10 flex max-w-[70%] animate-pop flex-col gap-1 ${POS[bubble.position]}`;

  if (bubble.kind === 'sound') {
    return (
      <p className={wrap} style={style}>
        <span className="reading-text -rotate-3 rounded-xl bg-mostaza-200/90 px-3 py-1 text-lg font-black text-mostaza-700 italic sm:text-xl">{bubble.text}</span>
      </p>
    );
  }

  const label = speaker ? (
    <span className="rounded-full border-2 bg-crema-50 px-2 py-0.5 text-xs font-black text-petroleo-900" style={{ borderColor: speaker.color }}>
      {speaker.name}
      {bubble.kind === 'thought' ? ' piensa' : bubble.kind === 'device' ? ' · comunicador' : ''}
    </span>
  ) : null;

  if (bubble.kind === 'device') {
    return (
      <div className={wrap} style={style}>
        {label}
        <p className="flex flex-wrap gap-1.5 rounded-2xl bg-petroleo-900 p-2 shadow-[var(--shadow-lift)]">
          {bubble.text.split('·').map((word) => (
            <span key={word} className="reading-text rounded-lg bg-crema-50 px-2.5 py-1.5 text-sm font-black text-petroleo-900 sm:text-base">
              {word.trim()}
            </span>
          ))}
        </p>
      </div>
    );
  }

  const thought = bubble.kind === 'thought';
  return (
    <div className={wrap} style={style}>
      {label}
      <p
        className={`reading-text relative border-[3px] border-tinta bg-crema-50 px-3.5 py-2 text-base leading-snug font-bold text-tinta shadow-[var(--shadow-soft)] sm:text-lg ${
          thought ? 'rounded-[2rem] border-dashed' : 'rounded-2xl'
        }`}
      >
        {bubble.text}
      </p>
    </div>
  );
}

export function ComicView({ panels, index, pausedMotion }: { panels: ComicPanel[]; index: number; pausedMotion: boolean }) {
  const currentRef = useRef<HTMLLIElement>(null);

  useEffect(() => {
    const reduce = pausedMotion || document.documentElement.dataset.motion === 'reduced' || window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    currentRef.current?.scrollIntoView({ block: 'nearest', behavior: reduce ? 'auto' : 'smooth' });
  }, [index, pausedMotion]);

  return (
    <ol className={`grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 ${pausedMotion ? 'anim-paused' : ''}`} aria-label="Viñetas del cómic">
      {panels.map((panel, i) => {
        const revealed = i <= index;
        const span = panel.span === 'full' ? 'sm:col-span-2' : '';
        if (!revealed) {
          return (
            <li key={panel.id} className={`${span} grid min-h-40 place-items-center rounded-3xl border-[3px] border-dashed border-crema-400 text-crema-400`} aria-label="Viñeta por descubrir">
              <Icon name="question" size={40} />
            </li>
          );
        }
        return (
          <li
            key={panel.id}
            ref={i === index ? currentRef : undefined}
            aria-current={i === index ? 'step' : undefined}
            className={`${span} relative animate-pop overflow-hidden rounded-3xl border-[4px] border-tinta bg-crema-50 ${i === index ? 'shadow-[var(--shadow-lift)]' : 'opacity-90'}`}
          >
            {panel.caption && (
              <p className="reading-text relative z-10 border-b-[3px] border-tinta bg-mostaza-100 px-4 py-2 text-base font-extrabold sm:text-lg">{panel.caption}</p>
            )}
            <div className="relative">
              <Illustration id={panel.illustration} className={`w-full ${panel.span === 'full' ? 'aspect-[16/9]' : 'aspect-[4/3]'} ${panel.motion === 'float' ? '[&_svg]:animate-float' : ''}`} />
              {panel.bubbles.map((b, bi) => (
                <BubbleView key={b.id} bubble={b} delay={250 + bi * 450} />
              ))}
            </div>
          </li>
        );
      })}
    </ol>
  );
}

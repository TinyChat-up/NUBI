import type { BeatStep, Character } from '../../engine/types.ts';
import { Icon } from '../Icon.tsx';
import type { CSSProperties } from 'react';
import { getAsset } from '../../content/assets/index.ts';
import { Illustration } from '../Illustration.tsx';
import { ratioOf } from '../illustration/imageSource.ts';
import { GuideArt } from '../illustration/GuideArt.tsx';

export type PageDirection = 'next' | 'prev';

interface StoryPageProps {
  beat: BeatStep;
  text: string;
  speaker?: Character;
  /** Primera página de la escena: se muestra el título de escena sobre el texto. */
  opener?: { number: number; title: string };
  direction: PageDirection;
  mode: 'leer' | 'escuchar';
  showText: boolean;
  speaking: boolean;
}

/**
 * Página de cuento ilustrado.
 * - La ilustración se muestra entera (misma proporción que el recurso): nunca se recorta ni se tapa.
 * - El texto va en su propia "página": debajo en vertical/móvil, al lado en tableta horizontal.
 * - Narración, diálogo y guía se distinguen visualmente.
 * - Si la ilustración no cambia entre páginas, permanece quieta y solo cambia el texto.
 */
export function StoryPage({ beat, text, speaker, opener, direction, mode, showText, speaking }: StoryPageProps) {
  const pageAnim = direction === 'prev' ? 'animate-page-prev' : 'animate-page-next';
  const isGuide = Boolean(speaker?.isGuide);
  const isDialogue = Boolean(speaker && !isGuide);
  // Proporciones del arte real (o del placeholder) para dimensionar la página sin recortar.
  const asset = getAsset(beat.illustration);
  const ratio = asset ? ratioOf(asset.aspect) : 16 / 9;
  const portraitRatio = asset?.status === 'listo' && asset.portrait ? ratioOf(asset.portrait.aspect) : ratio;

  return (
    <article className="grid w-full items-center gap-4 sm:gap-6 lg:landscape:grid-cols-[minmax(0,2.3fr)_minmax(17rem,1fr)] lg:landscape:gap-10">
      {/*
        Ilustración:
        - Vertical (móvil y tableta): a sangre y pegada a la cabecera, como la página de un álbum.
          Su ancho se limita para que imagen + texto quepan sin desplazar (reserva ~24rem para cabecera,
          controles y texto). Con arte vertical (`portrait`), la imagen ocupa mucho más alto.
        - Horizontal: doble página con la ilustración a la izquierda.
      */}
      <div className="-mx-3 sm:-mx-6 lg:landscape:mx-0" style={{ '--r': ratio, '--r-p': portraitRatio } as CSSProperties}>
        <Illustration
          key={beat.illustration}
          id={beat.illustration}
          ratio
          priority
          sizes="(min-width: 1024px) and (orientation: landscape) 64vw, 100vw"
          className={`mx-auto w-full portrait:max-w-[calc((100dvh-24rem)*var(--r-p))] landscape:max-w-[calc(60dvh*var(--r))] lg:landscape:max-w-none lg:landscape:rounded-[1.75rem] lg:landscape:shadow-[var(--shadow-soft)] ${pageAnim}`}
        />
      </div>

      {/* Página de texto */}
      <div key={beat.id} className={`flex flex-col gap-3 ${direction === 'prev' ? 'animate-page-prev' : 'animate-rise'}`} style={{ animationDelay: '90ms' }}>
        {opener && (
          <p className="flex items-baseline gap-2 text-petroleo-700">
            <span className="text-sm font-black tracking-widest text-coral-700 uppercase">Escena {opener.number}</span>
            <span aria-hidden className="h-px flex-1 bg-crema-300" />
          </p>
        )}

        {!showText ? (
          <div className="flex items-center gap-3 rounded-3xl bg-crema-50/80 p-5 text-tinta-suave">
            <Icon name={speaking ? 'volume' : 'subtitles'} size={30} />
            <p className="font-bold">{speaking ? 'Escuchando…' : 'Subtítulos desactivados'}</p>
          </div>
        ) : mode === 'escuchar' ? (
          // Subtítulo: banda oscura de alto contraste, siempre fuera de la imagen.
          <div className="rounded-3xl bg-petroleo-900 px-5 py-4 text-crema-50 sm:px-7 sm:py-5">
            {speaker && <p className="mb-1 text-sm font-black tracking-wide uppercase opacity-90">{speaker.name}</p>}
            <p className="reading-text text-2xl leading-snug font-bold sm:text-[1.75rem]">{text}</p>
          </div>
        ) : isGuide ? (
          <div className="flex items-end gap-3">
            <GuideArt mood="happy" size={96} className={`w-20 shrink-0 sm:w-24 ${beat.motion === 'float' ? 'animate-sway' : ''}`} />
            <Bubble tail="left" speaker={speaker} text={text} tone="guide" />
          </div>
        ) : isDialogue ? (
          <Bubble tail="up" speaker={speaker} text={text} tone="dialogue" />
        ) : (
          <p className="reading-text text-2xl leading-snug font-bold text-tinta sm:text-[1.8rem] sm:leading-[1.4]">{text}</p>
        )}
      </div>
    </article>
  );
}

function Bubble({ speaker, text, tail, tone }: { speaker?: Character; text: string; tail: 'up' | 'left'; tone: 'dialogue' | 'guide' }) {
  return (
    <figure className="relative min-w-0 flex-1">
      {speaker && (
        <figcaption className="mb-4 inline-flex items-center gap-2 rounded-full border-2 lg:landscape:mb-2 bg-crema-50 px-3 py-0.5 text-sm font-black text-petroleo-900" style={{ borderColor: speaker.color }}>
          <span aria-hidden className="size-2.5 rounded-full" style={{ backgroundColor: speaker.color }} />
          {speaker.name}
        </figcaption>
      )}
      <blockquote
        className={`relative rounded-[1.75rem] border-[3px] px-5 py-4 sm:px-6 sm:py-5 ${tone === 'guide' ? 'border-petroleo-200 bg-petroleo-50' : 'border-tinta/80 bg-crema-50'}`}
      >
        {/* Cola del bocadillo: hacia la ilustración (arriba en vertical, a la izquierda en horizontal) o hacia la guía. */}
        <svg
          aria-hidden
          viewBox="0 0 24 16"
          className={`absolute h-4 w-6 ${
            tail === 'up' ? '-top-[14px] left-8 lg:landscape:top-8 lg:landscape:-left-[19px] lg:landscape:-rotate-90' : '-left-[19px] bottom-6 -rotate-90'
          } ${tone === 'guide' ? 'text-petroleo-200' : 'text-tinta/80'}`}
        >
          <path d="M2 16 L12 2 L22 16" fill={tone === 'guide' ? '#eef6f6' : '#fffcf6'} stroke="currentColor" strokeWidth="3" strokeLinejoin="round" />
        </svg>
        <p className="reading-text text-2xl leading-snug font-bold text-tinta sm:text-[1.75rem]">{text}</p>
      </blockquote>
    </figure>
  );
}

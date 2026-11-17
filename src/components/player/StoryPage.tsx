import type { BeatStep, Character } from '../../engine/types.ts';
import { Icon } from '../Icon.tsx';
import type { CSSProperties, ReactNode } from 'react';
import { getAsset } from '../../content/assets/index.ts';
import { Illustration, hasFinalArt } from '../Illustration.tsx';
import { ratioOf } from '../illustration/imageSource.ts';
import { GuideArt } from '../illustration/GuideArt.tsx';
import { SCENE_SIZES } from './imageSizes.ts';

export type PageDirection = 'next' | 'prev';

/** Texto de una página de cuento (la actual o una de su grupo). */
export interface PageText {
  id: string;
  text: string;
  speaker?: Character;
  /** Primera página de la escena: se muestra «Escena N» sobre el texto. */
  /** Primera página de una escena: su título y, si además empieza uno de los tres momentos, su nombre (fase 19). */
  opener?: { title: string; moment?: string };
}

interface StoryPageProps {
  beat: BeatStep;
  page: PageText;
  /**
   * Páginas seguidas que comparten esta ilustración. Se apilan invisibles bajo la actual para que
   * el bloque de texto mida lo que el más largo: la imagen no cambia de tamaño al pasar página.
   */
  group?: PageText[];
  direction: PageDirection;
  mode: 'leer' | 'escuchar';
  showText: boolean;
  speaking: boolean;
}

/**
 * Página de cuento ilustrado.
 * - La ilustración se muestra entera (misma proporción que el recurso): nunca se recorta ni se tapa.
 * - Vertical: el texto ocupa su alto natural y la ilustración llena el resto de la pantalla
 *   (consultas de contenedor), con composición 3:4 cuando existe. Todo el texto queda a la vista.
 * - Horizontal (≥1024 px): doble página, ilustración a la izquierda y texto a la derecha.
 * - Narración, diálogo y guía se distinguen visualmente.
 * - Si la ilustración no cambia entre páginas, permanece quieta (mismo tamaño) y solo cambia el texto.
 */
export function StoryPage({ beat, page, group = [], direction, mode, showText, speaking }: StoryPageProps) {
  const pageAnim = direction === 'prev' ? 'animate-page-prev' : 'animate-page-next';
  // Proporciones del arte real (o del placeholder) para dimensionar la página sin recortar.
  const asset = getAsset(beat.illustration);
  const ratio = asset ? ratioOf(asset.aspect) : 16 / 9;
  const portraitRatio = asset?.status === 'listo' && asset.portrait ? ratioOf(asset.portrait.aspect) : ratio;
  const textProps = { mode, showText, speaking, motion: beat.motion };

  return (
    <article className="storybook-page flex w-full flex-col gap-4 portrait:flex-1 sm:gap-6 lg:landscape:grid lg:landscape:grid-cols-[minmax(0,2fr)_minmax(20rem,1fr)] lg:landscape:items-center lg:landscape:gap-10">
      {/*
        Ilustración. En vertical, su caja ocupa el alto que deja libre el texto (container-type: size)
        y la imagen se ajusta a esa caja sin recortarse: ancho = mín(ancho disponible, alto × proporción).
        Nunca baja de ~30 % de la pantalla: con textos muy largos o letra grande, la página se desplaza.
        Nota: altura base 0 + `flex-basis: auto` (no `flex: 1 1 0%`): con base porcentual en un contenedor
        de alto indefinido, Chrome resuelve `cqh` a 0 y la imagen desaparece.
      */}
      <div
        className="-mx-3 portrait:h-0 portrait:min-h-[30dvh] portrait:max-h-[calc(100vw/var(--r-p))] portrait:grow portrait:basis-auto portrait:[container-type:size] sm:-mx-6 lg:landscape:mx-0"
        style={{ '--r': ratio, '--r-p': portraitRatio } as CSSProperties}
      >
        <Illustration
          key={beat.illustration}
          id={beat.illustration}
          ratio
          priority
          sizes={SCENE_SIZES}
          className={`mx-auto w-full portrait:max-w-[calc(100cqh*var(--r-p))] landscape:max-w-[calc(60dvh*var(--r))] lg:landscape:max-w-none lg:landscape:rounded-[var(--radius-card)] lg:landscape:shadow-[var(--shadow-soft)] ${pageAnim}`}
        />
      </div>

      {/* Página de texto: la actual encima de las del grupo (invisibles, solo reservan alto). */}
      <div className="storybook-reading grid shrink-0 *:[grid-area:1/1]">
        {group
          .filter((g) => g.id !== page.id)
          .map((g) => (
            <div key={g.id} aria-hidden inert className="invisible">
              <TextPage page={g} {...textProps} />
            </div>
          ))}
        <div key={page.id} className={direction === 'prev' ? 'animate-page-prev' : 'animate-rise'} style={{ animationDelay: '90ms' }}>
          <TextPage page={page} {...textProps} />
        </div>
      </div>
    </article>
  );
}

function TextPage({
  page,
  mode,
  showText,
  speaking,
  motion,
}: {
  page: PageText;
  mode: 'leer' | 'escuchar';
  showText: boolean;
  speaking: boolean;
  motion?: BeatStep['motion'];
}) {
  const { text, speaker, opener } = page;
  const isGuide = Boolean(speaker?.isGuide);
  return (
    <div className="storybook-text flex flex-col gap-3">
      {opener && (
        <div className="flex flex-col gap-1.5">
          {opener.moment && <p className="moment-opener w-fit rounded-full bg-petroleo-600 px-3.5 py-1 text-sm font-black text-crema-50">{opener.moment}</p>}
          <p className="flex items-baseline gap-2 text-petroleo-700">
            <span className="text-sm font-black tracking-widest text-coral-700 uppercase">{opener.title}</span>
            <span aria-hidden className="h-px flex-1 bg-crema-300" />
          </p>
        </div>
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
        // Guía: Nubi sobre su bocadillo, junto a su nombre; el bocadillo usa todo el ancho de la página.
        <Bubble
          tail="guide"
          speaker={speaker}
          text={text}
          tone="guide"
          lead={<GuideArt mood="happy" size={80} className={`w-16 shrink-0 sm:w-20 ${motion === 'float' ? 'animate-sway' : ''}`} />}
        />
      ) : speaker ? (
        <Bubble tail="up" speaker={speaker} text={text} tone="dialogue" />
      ) : (
        <p className="reading-text text-2xl leading-snug font-bold text-tinta sm:text-[1.8rem] sm:leading-[1.4]">{text}</p>
      )}
    </div>
  );
}

function Bubble({
  speaker,
  text,
  tail,
  tone,
  lead,
}: {
  speaker?: Character;
  text: string;
  tail: 'up' | 'guide';
  tone: 'dialogue' | 'guide';
  lead?: ReactNode;
}) {
  return (
    <figure className="relative min-w-0">
      {speaker && (
        <figcaption className="mb-3 flex items-end gap-2">
          {/* Quién habla (fase 20): su retrato oficial junto al nombre; el nombre sigue siendo el texto que cuenta. */}
          {lead ?? (hasFinalArt(`char-${speaker.id}`) && <Illustration id={`char-${speaker.id}`} decorative ratio fit="contain" sizes="48px" className="speaker-portrait w-10 shrink-0 sm:w-12" />)}
          <span className="mb-1 inline-flex items-center gap-2 rounded-full border-2 bg-crema-50 px-3 py-0.5 text-base font-black text-petroleo-900" style={{ borderColor: speaker.color }}>
            <span aria-hidden className="size-2.5 rounded-full" style={{ backgroundColor: speaker.color }} />
            {speaker.name}
          </span>
        </figcaption>
      )}
      <blockquote
        className={`relative rounded-[var(--radius-card)] border-[3px] px-5 py-4 sm:px-6 sm:py-5 ${tone === 'guide' ? 'border-petroleo-200 bg-petroleo-50' : 'border-tinta/80 bg-crema-50'}`}
      >
        {/*
          Cola del bocadillo. Diálogo: hacia la ilustración (arriba en vertical, a la izquierda en la doble página).
          Guía: siempre hacia Nubi, que está encima.
        */}
        <svg
          aria-hidden
          viewBox="0 0 24 16"
          className={`absolute -top-[14px] h-4 w-6 ${
            tail === 'up' ? 'left-8 lg:landscape:top-8 lg:landscape:-left-[19px] lg:landscape:-rotate-90' : 'left-5 sm:left-7'
          } ${tone === 'guide' ? 'text-petroleo-200' : 'text-tinta/80'}`}
        >
          <path d="M2 16 L12 2 L22 16" fill={tone === 'guide' ? '#eef6f6' : '#fffcf6'} stroke="currentColor" strokeWidth="3" strokeLinejoin="round" />
        </svg>
        <p className="reading-text text-2xl leading-snug font-bold text-tinta sm:text-[1.75rem]">{text}</p>
      </blockquote>
    </figure>
  );
}

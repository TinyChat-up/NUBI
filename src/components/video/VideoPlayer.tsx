import { useEffect, useRef, useState } from 'react';
import type { Story, VideoSpec } from '../../engine/types.ts';
import { useSettings } from '../../state/settings.tsx';
import { Icon } from '../Icon.tsx';
import { Illustration } from '../Illustration.tsx';
import { Nubi } from '../Nubi.tsx';
import { LinkButton, ToolButton } from '../ui.tsx';

const fmt = (t: number) => `${Math.floor(t / 60)}:${String(Math.floor(t % 60)).padStart(2, '0')}`;

/**
 * Reproductor de vídeo accesible (MP4/WebM + subtítulos WebVTT).
 * - Nunca hay reproducción automática.
 * - Controles grandes, teclado nativo, subtítulos activables, velocidad más lenta, capítulos por escena.
 * - Si el vídeo aún no existe, lo dice con claridad (no se presenta una demo como vídeo final).
 */
export function VideoPlayer({ story, video }: { story: Story; video: VideoSpec }) {
  const { settings } = useSettings();
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [captions, setCaptions] = useState(settings.subtitles);
  const [slow, setSlow] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [error, setError] = useState(false);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    for (const track of Array.from(v.textTracks)) track.mode = captions ? 'showing' : 'hidden';
  }, [captions]);

  useEffect(() => {
    if (ref.current) ref.current.playbackRate = slow ? 0.75 : 1;
  }, [slow]);

  if (video.status !== 'listo' || error) {
    return (
      <div className="card overflow-hidden">
        <div className="relative">
          <Illustration id={video.poster} className="aspect-[16/9] w-full" decorative />
          <div className="absolute inset-0 grid place-items-center bg-petroleo-900/55 p-4">
            <div className="flex max-w-lg flex-col items-center gap-3 rounded-[var(--radius-card)] bg-crema-50 p-6 text-center">
              <Nubi mood="calm" size={90} />
              <h2 className="text-2xl text-petroleo-900">Vídeo en producción</h2>
              <p className="reading-text text-lg">{error ? 'No se ha podido cargar el vídeo en este dispositivo.' : video.productionNote}</p>
              <div className="flex flex-wrap justify-center gap-3">
                <LinkButton to={`/historias/${story.id}/cuento`} icon="story">
                  Ver como cuento
                </LinkButton>
                {story.formats.includes('comic') && (
                  <LinkButton to={`/historias/${story.id}/comic`} variant="secondary" icon="comic">
                    Ver como cómic
                  </LinkButton>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const v = () => ref.current;
  const toggle = () => {
    const el = v();
    if (!el) return;
    if (el.paused) el.play().catch(() => setError(true));
    else el.pause();
  };

  return (
    <div className="card overflow-hidden">
      <video
        ref={ref}
        className="aspect-[16/9] w-full bg-petroleo-900"
        preload="metadata"
        playsInline
        poster={undefined}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onTimeUpdate={(e) => setTime(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
        onError={() => setError(true)}
        aria-label={`Vídeo: ${story.title}`}
      >
        {video.sources.map((s) => (
          <source key={s.src} src={s.src} type={s.type} />
        ))}
        {video.captions.map((c) => (
          <track key={c.src} kind="captions" src={c.src} srcLang={c.srclang} label={c.label} default={captions} />
        ))}
      </video>

      <div className="flex flex-col gap-3 p-4">
        <label className="flex items-center gap-3 text-sm font-bold">
          <span className="w-12 tabular-nums">{fmt(time)}</span>
          <input
            type="range"
            min={0}
            max={duration || 0}
            step={1}
            value={time}
            onChange={(e) => {
              const el = v();
              if (el) el.currentTime = Number(e.target.value);
            }}
            className="h-3 flex-1 accent-coral-500"
            aria-label="Posición del vídeo"
            aria-valuetext={`${fmt(time)} de ${fmt(duration)}`}
          />
          <span className="w-12 text-right tabular-nums">{fmt(duration)}</span>
        </label>
        <div className="flex flex-wrap items-start justify-center gap-2">
          <ToolButton icon={playing ? 'pause' : 'play'} label={playing ? 'Pausa' : 'Ver'} onClick={toggle} />
          <ToolButton icon="repeat" label="−10 s" aria-label="Retroceder 10 segundos" onClick={() => { const el = v(); if (el) el.currentTime = Math.max(0, el.currentTime - 10); }} />
          <ToolButton icon="subtitles" label="Subtítulos" pressed={captions} onClick={() => setCaptions((c) => !c)} />
          <ToolButton icon="footsteps" label="Más despacio" pressed={slow} onClick={() => setSlow((s) => !s)} />
          <ToolButton icon="film" label="Pantalla" aria-label="Pantalla completa" onClick={() => v()?.requestFullscreen?.()} />
        </div>
        <nav aria-label="Capítulos">
          <ol className="flex flex-wrap justify-center gap-2">
            {video.chapters.map((c) => {
              const scene = story.scenes.find((s) => s.id === c.sceneId);
              return (
                <li key={c.sceneId}>
                  <button
                    type="button"
                    onClick={() => { const el = v(); if (el) el.currentTime = c.start; }}
                    className="tap flex min-h-11 items-center gap-2 rounded-full bg-crema-200 px-3 text-sm font-bold hover:bg-petroleo-100"
                  >
                    <Icon name="play" size={14} /> {scene?.number}. {scene?.title}
                  </button>
                </li>
              );
            })}
          </ol>
        </nav>
      </div>
    </div>
  );
}

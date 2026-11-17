import { useEffect, useRef } from 'react';
import type { Scene, Story } from '../../engine/types.ts';
import type { Moment } from './moments.ts';
import { Icon } from '../Icon.tsx';
import { Button } from '../ui.tsx';

/**
 * Mapa del cuento: permite saltar a cualquier escena (sin bloqueos). Usa <dialog> nativo: Esc y foco atrapado.
 * Fase 19: las escenas se agrupan en los tres momentos (qué está pasando / qué podría hacer / qué podría pasar).
 */
export function SceneMenu({
  open,
  onClose,
  story,
  moments,
  currentSceneId,
  visited,
  onSelect,
  onRestart,
}: {
  open: boolean;
  onClose: () => void;
  story: Story;
  moments?: Moment[];
  currentSceneId: string;
  visited: string[];
  onSelect: (sceneId: string) => void;
  onRestart: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => e.target === ref.current && onClose()}
      aria-labelledby="scene-menu-title"
      className="m-auto w-[min(36rem,calc(100vw-2rem))] overscroll-contain rounded-[var(--radius-card)] bg-crema-50 p-0 text-tinta shadow-[var(--shadow-lift)] backdrop:bg-petroleo-900/40"
    >
      <div className="p-5 sm:p-6">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 id="scene-menu-title" className="text-2xl text-petroleo-900">
            Escenas
          </h2>
          <button type="button" onClick={onClose} className="tap grid size-12 place-items-center rounded-full hover:bg-petroleo-100" aria-label="Cerrar">
            <Icon name="close" />
          </button>
        </div>
        {(moments ?? [{ id: 'pasa', number: 1, label: '', scenes: story.scenes } as Moment]).map((m) => (
          <section key={m.id} aria-labelledby={m.label ? `moment-${m.id}` : undefined} className="mb-4 last:mb-0">
            {m.label && (
              <h3 id={`moment-${m.id}`} className="mb-2 text-sm font-black tracking-wider text-coral-700 uppercase">
                Momento {m.number} · {m.label}
              </h3>
            )}
            <ol className="grid gap-2">
              {m.scenes.map((scene: Scene) => {
                const isCurrent = scene.id === currentSceneId;
                const seen = visited.includes(scene.id);
                return (
                  <li key={scene.id}>
                    <button
                      type="button"
                      onClick={() => onSelect(scene.id)}
                      aria-current={isCurrent ? 'step' : undefined}
                      className={`tap flex min-h-14 w-full items-center gap-3 rounded-2xl px-3 text-left font-bold ${isCurrent ? 'bg-petroleo-600 text-crema-50' : 'bg-crema-100 hover:bg-petroleo-100'}`}
                    >
                      <span className={`grid size-9 shrink-0 place-items-center rounded-full text-base font-black ${isCurrent ? 'bg-crema-50 text-petroleo-800' : 'bg-crema-50 text-petroleo-700'}`}>
                        {scene.number}
                      </span>
                      <span className="reading-text flex-1">{scene.title}</span>
                      {seen && !isCurrent && <Icon name="check" size={20} label="Vista" />}
                    </button>
                  </li>
                );
              })}
            </ol>
          </section>
        ))}
        <div className="mt-5 flex justify-end">
          <Button variant="ghost" icon="refresh" onClick={onRestart}>
            Empezar desde el principio
          </Button>
        </div>
      </div>
    </dialog>
  );
}

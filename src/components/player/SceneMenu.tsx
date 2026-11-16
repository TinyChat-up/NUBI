import { useEffect, useRef } from 'react';
import type { Story } from '../../engine/types.ts';
import { Icon } from '../Icon.tsx';
import { Button } from '../ui.tsx';

/** Mapa de escenas: permite saltar a cualquier escena (sin bloqueos). Usa <dialog> nativo: Esc y foco atrapado. */
export function SceneMenu({
  open,
  onClose,
  story,
  currentSceneId,
  visited,
  onSelect,
  onRestart,
}: {
  open: boolean;
  onClose: () => void;
  story: Story;
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
      className="m-auto w-[min(36rem,calc(100vw-2rem))] rounded-[var(--radius-card)] bg-crema-50 p-0 text-tinta shadow-[var(--shadow-lift)] backdrop:bg-petroleo-900/40"
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
        <ol className="grid gap-2">
          {story.scenes.map((scene) => {
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
        <div className="mt-5 flex justify-end">
          <Button variant="ghost" icon="refresh" onClick={onRestart}>
            Empezar desde el principio
          </Button>
        </div>
      </div>
    </dialog>
  );
}

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { restoreRun } from '../engine/restoreRun.ts';
import { getStory } from '../content/stories/index.ts';
import type { RunState } from '../engine/storyEngine.ts';
import type { ToolId } from '../engine/types.ts';
import { clearAll, readJSON, removeKey, writeJSON } from '../lib/storage.ts';

/**
 * Progreso de DEMOSTRACIÓN, solo en este dispositivo.
 * No contiene nombres ni datos personales, ni puntuaciones.
 * Registra qué se ha explorado, para el Espacio familiar.
 */
export interface StoryProgress {
  startedAt: string;
  lastOpenedAt: string;
  completedAt?: string;
  visitedScenes: string[];
  exploredOptions: string[];
  formatsUsed: string[];
}

export interface Progress {
  stories: Record<string, StoryProgress>;
  /** Herramientas que el niño o la niña ha marcado como "lo he probado". */
  toolsPracticed: Partial<Record<ToolId, string>>;
  /** Herramientas elegidas en historias ("podrían ayudarme"). */
  toolsChosen: ToolId[];
  /** Recreaciones: opciones exploradas por recreación. */
  recreations: Record<string, string[]>;
}

const EMPTY: Progress = { stories: {}, toolsPracticed: {}, toolsChosen: [], recreations: {} };

interface ProgressContextValue {
  progress: Progress;
  recordRun: (run: RunState, opts: { completed: boolean; chosenTools: ToolId[] }) => void;
  markToolPracticed: (id: ToolId, practiced: boolean) => void;
  recordRecreation: (id: string, optionIds: string[]) => void;
  saveRun: (run: RunState) => void;
  loadRun: (storyId: string, format: RunState['format']) => RunState | null;
  clearRun: (storyId: string, format: RunState['format']) => void;
  resetAll: () => void;
}

const ProgressContext = createContext<ProgressContextValue | null>(null);
const runKey = (storyId: string, format: string) => `run.${storyId}.${format}`;

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [progress, setProgress] = useState<Progress>(() => readJSON('progress', EMPTY));

  useEffect(() => writeJSON('progress', progress), [progress]);

  const recordRun = useCallback((run: RunState, { completed, chosenTools }: { completed: boolean; chosenTools: ToolId[] }) => {
    setProgress((p) => {
      const now = new Date().toISOString();
      const prev = p.stories[run.storyId];
      const explored = Object.values(run.explored).flat();
      return {
        ...p,
        toolsChosen: Array.from(new Set([...p.toolsChosen, ...chosenTools])),
        stories: {
          ...p.stories,
          [run.storyId]: {
            startedAt: prev?.startedAt ?? now,
            lastOpenedAt: now,
            completedAt: prev?.completedAt ?? (completed ? now : undefined),
            visitedScenes: Array.from(new Set([...(prev?.visitedScenes ?? []), ...run.visitedScenes])),
            exploredOptions: Array.from(new Set([...(prev?.exploredOptions ?? []), ...explored])),
            formatsUsed: Array.from(new Set([...(prev?.formatsUsed ?? []), run.format])),
          },
        },
      };
    });
  }, []);

  // Acciones estables (no dependen de `progress`) para evitar bucles en efectos.
  const actions = useMemo(
    () => ({
      recordRun,
      markToolPracticed: (id: ToolId, practiced: boolean) =>
        setProgress((p) => {
          const toolsPracticed = { ...p.toolsPracticed };
          if (practiced) toolsPracticed[id] = new Date().toISOString();
          else delete toolsPracticed[id];
          return { ...p, toolsPracticed };
        }),
      recordRecreation: (id: string, optionIds: string[]) =>
        setProgress((p) => ({
          ...p,
          recreations: { ...p.recreations, [id]: Array.from(new Set([...(p.recreations[id] ?? []), ...optionIds])) },
        })),
      saveRun: (run: RunState) => writeJSON(runKey(run.storyId, run.format), run),
      loadRun: (storyId: string, format: RunState['format']) => {
        const run = readJSON<RunState | null>(runKey(storyId, format), null);
        const story = getStory(storyId);
        return story ? restoreRun(story, format, run) : null;
      },
      clearRun: (storyId: string, format: RunState['format']) => removeKey(runKey(storyId, format)),
      resetAll: () => {
        clearAll(['settings']);
        setProgress(EMPTY);
      },
    }),
    [recordRun],
  );

  const value = useMemo<ProgressContextValue>(() => ({ progress, ...actions }), [progress, actions]);

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}

export function useProgress(): ProgressContextValue {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error('useProgress fuera de ProgressProvider');
  return ctx;
}

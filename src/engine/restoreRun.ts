import { getPlaySteps, type PlayableFormat, type Position, type RunState } from './storyEngine.ts';
import type { Story } from './types.ts';

const record = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);
const strings = (value: unknown): value is string[] => Array.isArray(value) && value.every((x) => typeof x === 'string');

/** localStorage no es una fuente fiable: descartar partidas incompletas o de otra versión. */
export function restoreRun(story: Story, format: PlayableFormat, value: unknown): RunState | null {
  if (!record(value) || value.storyId !== story.id || value.format !== format) return null;
  const position = (p: unknown): p is Position => {
    if (!record(p) || !Number.isInteger(p.stepIndex)) return false;
    const scene = story.scenes.find((s) => s.id === p.sceneId);
    return !!scene && (p.stepIndex as number) >= 0 && (p.stepIndex as number) < getPlaySteps(scene, format).length;
  };
  if (!position(value.position) || !Array.isArray(value.history) || !value.history.every(position)) return null;
  if (!strings(value.visitedScenes) || !value.visitedScenes.every((id) => story.scenes.some((s) => s.id === id))) return null;
  if (typeof value.completed !== 'boolean') return null;
  if (!record(value.responses) || !Object.values(value.responses).every(strings)) return null;
  if (!record(value.explored) || !Object.values(value.explored).every(strings)) return null;
  if (!record(value.choices) || !Object.entries(value.choices).every(([id, option]) =>
    story.scenes.some((s) => s.steps.some((step) => step.type === 'choice' && step.id === id && step.options.some((o) => o.id === option))))) return null;
  // Fase 21: campos nuevos opcionales. Una partida anterior se reanuda igual, con camino y finales vacíos.
  const ints = (x: unknown) => Number.isInteger(x) && (x as number) >= 0;
  const path = value.path ?? [];
  if (!Array.isArray(path) || !path.every((e) => record(e) && typeof e.choiceStepId === 'string' && typeof e.optionId === 'string' && ints(e.at))) return null;
  const endingsSeen = value.endingsSeen ?? [];
  if (!strings(endingsSeen)) return null;
  return { ...(value as unknown as RunState), path: path as RunState['path'], endingsSeen };
}

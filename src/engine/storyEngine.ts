/**
 * Motor de historias: lógica pura, sin React ni DOM.
 *
 * Recorre una `Story` paso a paso para un formato concreto (cuento o cómic),
 * guarda las respuestas personales y resuelve rutas (decisiones → consecuencias).
 */
import type {
  BeatStep,
  ChoiceStep,
  ComicPanel,
  FormatId,
  InteractiveStep,
  Scene,
  SceneId,
  Step,
  StepId,
  Story,
} from './types.ts';

export type PlayableFormat = Exclude<FormatId, 'video'>;

/** Un paso tal y como lo ve el reproductor. */
export type PlayStep =
  | { kind: 'beat'; step: BeatStep }
  | { kind: 'panel'; panels: ComicPanel[]; index: number }
  | { kind: 'interactive'; step: InteractiveStep };

export interface Position {
  sceneId: SceneId;
  stepIndex: number;
}

export interface RunState {
  storyId: string;
  format: PlayableFormat;
  position: Position;
  /** Pila de posiciones anteriores para "Atrás". */
  history: Position[];
  /** Respuestas por paso (selección múltiple). */
  responses: Record<StepId, string[]>;
  /** Opción elegida actualmente en cada paso de decisión. */
  choices: Record<StepId, string>;
  /** Opciones exploradas en cada paso de decisión (en orden). */
  explored: Record<StepId, string[]>;
  visitedScenes: SceneId[];
  completed: boolean;
}

export type RunAction =
  | { type: 'next' }
  | { type: 'prev' }
  | { type: 'goto'; sceneId: SceneId; stepId?: StepId }
  | { type: 'restartScene' }
  | { type: 'respond'; stepId: StepId; values: string[] }
  | { type: 'choose'; stepId: StepId; optionId: string }
  | { type: 'restart' };

// ───────────────────────── Consultas ─────────────────────────

export function getScene(story: Story, sceneId: SceneId): Scene {
  const scene = story.scenes.find((s) => s.id === sceneId);
  if (!scene) throw new Error(`Escena desconocida: ${sceneId} en ${story.id}`);
  return scene;
}

export function findStep(story: Story, stepId: StepId): { scene: Scene; step: Step } | undefined {
  for (const scene of story.scenes) {
    const step = scene.steps.find((s) => s.id === stepId);
    if (step) return { scene, step };
  }
  return undefined;
}

/**
 * Lista de pasos de una escena según el formato.
 * - cuento: los pasos tal cual.
 * - cómic: una viñeta por paso (se van descubriendo) seguidas de los pasos interactivos.
 *   Si la escena no tiene cómic, se usan los pasos del cuento.
 */
export function getPlaySteps(scene: Scene, format: PlayableFormat): PlayStep[] {
  const asPlay = (step: Step): PlayStep =>
    step.type === 'beat' ? { kind: 'beat', step } : { kind: 'interactive', step };

  if (format === 'comic' && scene.comic && scene.comic.length > 0) {
    const panels = scene.comic;
    const panelSteps: PlayStep[] = panels.map((_, index) => ({ kind: 'panel', panels, index }));
    const interactive = scene.steps.filter((s) => s.type !== 'beat').map(asPlay);
    return [...panelSteps, ...interactive];
  }
  return scene.steps.map(asPlay);
}

export function nextSceneId(story: Story, sceneId: SceneId): SceneId | undefined {
  const scene = getScene(story, sceneId);
  if (scene.next) return scene.next;
  const index = story.scenes.findIndex((s) => s.id === sceneId);
  return story.scenes[index + 1]?.id;
}

export function currentPlayStep(story: Story, state: RunState): PlayStep {
  const steps = getPlaySteps(getScene(story, state.position.sceneId), state.format);
  return steps[Math.min(state.position.stepIndex, steps.length - 1)];
}

/** ¿Se puede pulsar "Siguiente"? Solo la decisión pide elegir (sin límite de tiempo). */
export function canAdvance(story: Story, state: RunState): boolean {
  const play = currentPlayStep(story, state);
  if (play.kind === 'interactive' && play.step.type === 'choice') {
    return Boolean(state.choices[play.step.id]);
  }
  if (play.kind === 'interactive' && play.step.type === 'summary') return false;
  return true;
}

export function getChoiceStep(story: Story, stepId: StepId): ChoiceStep | undefined {
  const found = findStep(story, stepId);
  return found?.step.type === 'choice' ? found.step : undefined;
}

// ───────────────────────── Estado ─────────────────────────

export function createRun(story: Story, format: PlayableFormat, startSceneId?: SceneId): RunState {
  const sceneId = startSceneId ?? story.scenes[0].id;
  return {
    storyId: story.id,
    format,
    position: { sceneId, stepIndex: 0 },
    history: [],
    responses: {},
    choices: {},
    explored: {},
    visitedScenes: [sceneId],
    completed: false,
  };
}

function moveTo(state: RunState, position: Position, pushHistory = true): RunState {
  return {
    ...state,
    position,
    history: pushHistory ? [...state.history, state.position] : state.history,
    visitedScenes: state.visitedScenes.includes(position.sceneId)
      ? state.visitedScenes
      : [...state.visitedScenes, position.sceneId],
  };
}

function stepIndexById(story: Story, state: RunState, sceneId: SceneId, stepId?: StepId): number {
  if (!stepId) return 0;
  const steps = getPlaySteps(getScene(story, sceneId), state.format);
  const index = steps.findIndex((p) => p.kind !== 'panel' && p.step.id === stepId);
  return index < 0 ? 0 : index;
}

function isLastScene(story: Story, sceneId: SceneId): boolean {
  return nextSceneId(story, sceneId) === undefined;
}

export function runReducer(story: Story, state: RunState, action: RunAction): RunState {
  switch (action.type) {
    case 'next': {
      if (!canAdvance(story, state)) return state;
      const scene = getScene(story, state.position.sceneId);
      const steps = getPlaySteps(scene, state.format);
      const play = steps[state.position.stepIndex];

      // Una decisión lleva a su escena de consecuencias.
      if (play?.kind === 'interactive' && play.step.type === 'choice') {
        return moveTo(state, { sceneId: play.step.next, stepIndex: 0 });
      }
      if (state.position.stepIndex < steps.length - 1) {
        return moveTo(state, { sceneId: scene.id, stepIndex: state.position.stepIndex + 1 });
      }
      const nextId = nextSceneId(story, scene.id);
      if (!nextId) return { ...state, completed: true };
      return moveTo(state, { sceneId: nextId, stepIndex: 0 });
    }

    case 'prev': {
      const previous = state.history[state.history.length - 1];
      if (!previous) return state;
      return { ...state, position: previous, history: state.history.slice(0, -1) };
    }

    case 'goto': {
      getScene(story, action.sceneId); // valida
      const stepIndex = stepIndexById(story, state, action.sceneId, action.stepId);
      return moveTo(state, { sceneId: action.sceneId, stepIndex });
    }

    case 'restartScene':
      if (state.position.stepIndex === 0) return state;
      return moveTo(state, { sceneId: state.position.sceneId, stepIndex: 0 });

    case 'respond':
      return { ...state, responses: { ...state.responses, [action.stepId]: action.values } };

    case 'choose': {
      const explored = state.explored[action.stepId] ?? [];
      return {
        ...state,
        choices: { ...state.choices, [action.stepId]: action.optionId },
        explored: {
          ...state.explored,
          [action.stepId]: explored.includes(action.optionId) ? explored : [...explored, action.optionId],
        },
      };
    }

    case 'restart':
      return createRun(story, state.format);
  }
}

/** La historia se considera terminada al llegar al paso de resumen de la última escena. */
export function isAtEnd(story: Story, state: RunState): boolean {
  const play = currentPlayStep(story, state);
  return (
    isLastScene(story, state.position.sceneId) &&
    play.kind === 'interactive' &&
    play.step.type === 'summary'
  );
}

/** Progreso 0..1 basado en escenas, para la barra superior (no es una puntuación). */
export function sceneProgress(story: Story, state: RunState): { current: number; total: number } {
  const index = story.scenes.findIndex((s) => s.id === state.position.sceneId);
  return { current: index + 1, total: story.scenes.length };
}

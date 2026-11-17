/**
 * Lógica de presentación del reproductor (sin React): qué ilustraciones precargar
 * y qué imagen de la escena sirve de contexto a una pregunta.
 */
import { currentPlayStep, getChoiceStep, getPlaySteps, getScene, runReducer, type PlayStep, type RunState } from '../../engine/storyEngine.ts';
import type { BeatStep, Story } from '../../engine/types.ts';
import { comicPanelSizes } from './comicLayout.ts';

/** Ilustración que se precarga y, si se conoce, el `sizes` con el que se mostrará. */
export interface UpcomingImage {
  id: string;
  sizes?: string;
}

function imagesOf(story: Story, play: PlayStep): UpcomingImage[] {
  const plain = (id: string): UpcomingImage => ({ id });
  switch (play.kind) {
    case 'beat':
      return [plain(play.step.illustration)];
    case 'panel': {
      const panel = play.panels[play.index];
      return panel ? [{ id: panel.illustration, sizes: comicPanelSizes(panel.span) }] : [];
    }
    case 'interactive': {
      const s = play.step;
      if (s.type === 'choice') return s.options.flatMap((o) => [o.illustration, ...o.consequence.story.map((f) => f.illustration)]).map(plain);
      if (s.type === 'consequence') {
        const choice = getChoiceStep(story, s.choiceStepId);
        return choice ? choice.options.flatMap((o) => o.consequence.story.map((f) => f.illustration)).map(plain) : [];
      }
      return [];
    }
  }
}

/** Ilustraciones del paso siguiente (y, en decisiones, de todas sus consecuencias), sin repetir. */
export function upcomingImages(story: Story, state: RunState): UpcomingImage[] {
  const byId = new Map<string, UpcomingImage>();
  const add = (images: UpcomingImage[]) => images.forEach((img) => byId.has(img.id) || byId.set(img.id, img));
  const play = currentPlayStep(story, state);
  if (play.kind === 'interactive' && play.step.type === 'choice') add(imagesOf(story, play));
  const after = runReducer(story, state, { type: 'next' });
  if (after !== state && !after.completed) add(imagesOf(story, currentPlayStep(story, after)));
  return Array.from(byId.values());
}

/**
 * Páginas de cuento seguidas que comparten la ilustración de la página actual (incluida ella),
 * con su índice dentro de la escena. Sirve para reservar el alto del texto más largo del grupo:
 * así la imagen no cambia de tamaño al pasar página, solo cambia el texto.
 */
export function pageGroup(story: Story, state: RunState): { beat: BeatStep; index: number }[] {
  const steps = getPlaySteps(getScene(story, state.position.sceneId), state.format);
  const i = state.position.stepIndex;
  const current = steps[i];
  if (current?.kind !== 'beat') return [];
  const same = (k: number) => {
    const p = steps[k];
    return p?.kind === 'beat' && p.step.illustration === current.step.illustration;
  };
  let start = i;
  let end = i;
  while (start > 0 && same(start - 1)) start--;
  while (end < steps.length - 1 && same(end + 1)) end++;
  return steps.slice(start, end + 1).map((p, k) => ({ beat: (p as Extract<PlayStep, { kind: 'beat' }>).step, index: start + k }));
}

/**
 * Imagen de contexto para un paso interactivo: la última ilustración narrativa
 * vista antes de ese paso en la misma escena (para anclar la pregunta en la historia).
 */
export function contextIllustration(story: Story, state: RunState): string | undefined {
  const steps = getPlaySteps(getScene(story, state.position.sceneId), state.format);
  for (let i = state.position.stepIndex - 1; i >= 0; i--) {
    const p = steps[i];
    if (p.kind === 'beat') return p.step.illustration;
    if (p.kind === 'panel') return p.panels[p.index].illustration;
  }
  return undefined;
}

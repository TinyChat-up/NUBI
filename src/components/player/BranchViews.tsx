import type { Dispatch } from 'react';
import { findStep, type RunAction, type RunState } from '../../engine/storyEngine.ts';
import type { ChoiceOption, ChoiceStep, Scene, Story } from '../../engine/types.ts';
import { Icon } from '../Icon.tsx';
import { Illustration } from '../Illustration.tsx';
import { GuideArt } from '../illustration/GuideArt.tsx';
import { Button } from '../ui.tsx';
import { OPTION_CARD_SIZES } from './imageSizes.ts';

/**
 * Pantallas de las historias ramificadas (fase 21). Son pasos que añade el motor, no contenido:
 * - OfferView: Nubi pregunta «¿Quieres probar otra forma?» y enseña las otras opciones de la última decisión.
 * - EndingView: cierre de un final, con la posibilidad de volver a cualquier decisión del camino.
 * Ninguna opción ni final se presenta como mejor o peor; no hay puntos ni recompensas.
 */

type Ctx = { story: Story; state: RunState; dispatch: Dispatch<RunAction> };

interface Decision {
  scene: Scene;
  step: ChoiceStep;
  chosen?: ChoiceOption;
}

/** Decisiones del camino actual, en orden (las que se pueden volver a tomar). */
export function pathDecisions(story: Story, state: RunState): Decision[] {
  return (state.path ?? []).flatMap((e) => {
    const found = findStep(story, e.choiceStepId);
    if (!found || found.step.type !== 'choice') return [];
    return [{ scene: found.scene, step: found.step, chosen: found.step.options.find((o) => o.id === e.optionId) }];
  });
}

/** Volver a una decisión del camino y elegir otra opción: se deshace el tramo posterior y se sigue por la nueva rama. */
export function tryOption(dispatch: Dispatch<RunAction>, d: Decision, option: ChoiceOption) {
  dispatch({ type: 'rewind', sceneId: d.scene.id, stepId: d.step.id });
  dispatch({ type: 'choose', stepId: d.step.id, optionId: option.id });
  dispatch({ type: 'next' });
}

function OtherOptions({ decision, explored, dispatch }: { decision: Decision; explored: string[]; dispatch: Dispatch<RunAction> }) {
  const others = decision.step.options.filter((o) => o.id !== decision.chosen?.id);
  return (
    <ul className={`choice-cards grid gap-3 sm:gap-4 ${others.length <= 2 ? 'choice-cards-pair' : ''}`}>
      {others.map((o) => (
        <li key={o.id}>
          <button type="button" onClick={() => tryOption(dispatch, decision, o)} className="choice-path tap relative flex h-full w-full flex-col overflow-hidden rounded-[var(--radius-card)] border-[3px] bg-crema-50 text-left">
            <Illustration id={o.illustration} decorative ratio sizes={OPTION_CARD_SIZES} className="choice-path-art w-full" />
            {explored.includes(o.id) && (
              <span className="absolute top-2 left-2 inline-flex items-center gap-1 rounded-full bg-crema-50 px-2.5 py-1 text-sm font-bold text-salvia-700 shadow-[var(--shadow-soft)]">
                <Icon name="check" size={16} strokeWidth={3} /> Ya la exploraste
              </span>
            )}
            <span className="flex flex-1 items-center justify-center p-3 text-center sm:p-4">
              <span className="reading-text text-lg leading-snug font-extrabold">{o.label}</span>
            </span>
          </button>
        </li>
      ))}
    </ul>
  );
}

export function OfferView({ story, state, dispatch, onContinue, onBack, onExit }: Ctx & { onContinue: () => void; onBack: () => void; onExit: () => void }) {
  const last = pathDecisions(story, state).at(-1);
  return (
    <section className="branch-offer animate-rise" aria-labelledby="offer-title">
      <div className="mb-5 flex items-center gap-4">
        <GuideArt mood="thinking" size={110} className="w-20 shrink-0 sm:w-28" />
        <div className="rounded-[var(--radius-card)] border-[3px] border-petroleo-200 bg-petroleo-50 px-5 py-4">
          <h2 id="offer-title" className="reading-text text-2xl text-petroleo-900 sm:text-3xl">
            ¿Quieres probar otra forma?
          </h2>
          <p className="reading-text mt-1 text-lg text-tinta-suave">Puedes seguir con tu elección o mirar otra.</p>
        </div>
      </div>
      {last && <OtherOptions decision={last} explored={state.explored[last.step.id] ?? []} dispatch={dispatch} />}
      <div className="mt-6 flex flex-wrap gap-3">
        <Button iconAfter="arrow-right" onClick={onContinue}>
          Seguir con mi elección
        </Button>
        <Button variant="secondary" icon="arrow-left" onClick={onBack}>
          Volver atrás
        </Button>
        <Button variant="ghost" icon="close" onClick={onExit}>
          Terminar
        </Button>
      </div>
    </section>
  );
}

export function EndingView({ story, state, dispatch, scene, onRestart }: Ctx & { scene: Scene; onRestart: () => void }) {
  const decisions = pathDecisions(story, state);
  const titles = (state.endingsSeen ?? []).map((id) => story.scenes.find((s) => s.ending?.id === id)?.ending?.title).filter(Boolean) as string[];
  return (
    <section className="branch-ending animate-rise" aria-labelledby="ending-title">
      <div className="mb-6 flex flex-col items-center gap-3 text-center">
        <GuideArt mood="happy" size={110} />
        <p className="rounded-full bg-petroleo-600 px-4 py-1 text-sm font-black text-crema-50">Un final del cuento</p>
        <h2 id="ending-title" className="reading-text text-3xl text-petroleo-900 sm:text-4xl">
          {scene.ending?.title}
        </h2>
        <p className="reading-text text-lg text-tinta-suave">Hay otros caminos. Puedes descubrirlos cuando quieras.</p>
      </div>

      {titles.length > 1 && (
        <section aria-labelledby="endings-seen" className="mb-6 rounded-[var(--radius-card)] bg-crema-50 p-5">
          <h3 id="endings-seen" className="reading-text mb-2 text-xl text-petroleo-900">
            Finales que has descubierto
          </h3>
          <ul className="flex flex-wrap gap-2">
            {titles.map((t) => (
              <li key={t} className="reading-text inline-flex items-center gap-2 rounded-full bg-crema-100 px-3.5 py-2 font-bold">
                <Icon name="footsteps" size={18} /> {t}
              </li>
            ))}
          </ul>
        </section>
      )}

      {decisions.length > 0 && (
        <section aria-labelledby="other-path">
          <h3 id="other-path" className="reading-text mb-3 text-2xl text-petroleo-900">
            Explorar otro camino
          </h3>
          <div className="grid gap-6">
            {decisions.map((d) => (
              <div key={d.step.id}>
                <p className="reading-text mb-2 text-lg font-bold">
                  {d.step.prompt} <span className="text-tinta-suave">Elegiste: {d.chosen?.label}</span>
                </p>
                <OtherOptions decision={d} explored={state.explored[d.step.id] ?? []} dispatch={dispatch} />
              </div>
            ))}
          </div>
        </section>
      )}

      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Button variant="secondary" icon="refresh" onClick={onRestart}>
          Leer otra vez
        </Button>
      </div>
    </section>
  );
}

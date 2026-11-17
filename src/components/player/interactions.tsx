import { useId, type Dispatch } from 'react';
import type { RunAction, RunState } from '../../engine/storyEngine.ts';
import type { ChoiceOption, ChoiceStep, FeelingsStep, KnowNeedStep, StrategiesStep, ToolId } from '../../engine/types.ts';
import { readableConsequence } from '../../engine/readable.ts';
import { emotions } from '../../content/emotions.ts';
import { tools } from '../../content/tools.ts';
import { Icon } from '../Icon.tsx';
import { Illustration, hasFinalArt } from '../Illustration.tsx';
import { EmotionArt } from '../illustration/GuideArt.tsx';
import { CONSEQUENCE_SIZES, OPTION_CARD_SIZES } from './imageSizes.ts';
import { StepHeading, ToggleCard } from './Toggle.tsx';

type Ctx = { state: RunState; dispatch: Dispatch<RunAction> };

const toggle = (list: string[], id: string) => (list.includes(id) ? list.filter((x) => x !== id) : [...list, id]);

// ───────────────────────── ¿Cómo te sentirías? ─────────────────────────

/** Ilustración de emoción en el selector: apoyo de 96 px, con nombre y marca de selección. */
const FEELING_ART_SIZE = 96;

export function FeelingsView({ step, state, dispatch, context }: Ctx & { step: FeelingsStep; context?: string }) {
  const selected = state.responses[step.id] ?? [];
  const intensityKey = `${step.id}:intensidad`;
  const intensity = state.responses[intensityKey]?.[0];
  const hasFeeling = selected.some((id) => id !== 'no-lo-se');

  const set = (values: string[]) => dispatch({ type: 'respond', stepId: step.id, values });
  const onToggle = (id: string) => {
    // "No lo sé" es compatible con todo: solo es una forma más de responder.
    set(toggle(selected, id));
  };

  return (
    <div className="animate-rise">
      <StepHeading title={step.prompt} help={step.help} icon="heart" context={context} />
      <div className="feelings-picker grid grid-cols-2 gap-3 sm:grid-cols-4">
        {step.options.map((o, i) => {
          // Solo el campo tipado `emotion` decide la ilustración (nunca la etiqueta ni la historia).
          // El texto visible sigue siendo el de la opción; la imagen es decorativa.
          const emotion = o.emotion ? emotions[o.emotion] : undefined;
          return (
            <ToggleCard
              key={o.id}
              selected={selected.includes(o.id)}
              onToggle={() => onToggle(o.id)}
              icon={o.icon}
              leading={emotion && <EmotionArt emotion={emotion.id} mood={emotion.mood} size={FEELING_ART_SIZE} />}
              label={o.label}
              tone={(['coral', 'petroleo', 'salvia', 'mostaza'] as const)[i % 4]}
            />
          );
        })}
      </div>

      {step.intensity && hasFeeling && (
        <fieldset className="mt-6 animate-rise rounded-3xl bg-crema-50 p-4 shadow-[var(--shadow-soft)]">
          <legend className="sr-only">{step.intensity.prompt}</legend>
          <p aria-hidden className="reading-text mb-3 text-lg font-extrabold text-petroleo-900">
            {step.intensity.prompt}
          </p>
          <div className="flex flex-wrap gap-3">
            {step.intensity.levels.map((level, i) => {
              const on = intensity === level.id;
              return (
                <button
                  key={level.id}
                  type="button"
                  aria-pressed={on}
                  onClick={() => dispatch({ type: 'respond', stepId: intensityKey, values: on ? [] : [level.id] })}
                  className={`tap flex min-h-14 items-center gap-3 rounded-full border-[3px] px-5 font-extrabold ${
                    on ? 'border-petroleo-600 bg-petroleo-50 text-petroleo-900' : 'border-crema-300 bg-crema-50 text-tinta'
                  }`}
                >
                  <span aria-hidden className="flex items-end gap-1">
                    {[0, 1, 2].map((b) => (
                      <span key={b} className={`w-2.5 rounded-full ${b <= i ? 'bg-coral-400' : 'bg-crema-300'}`} style={{ height: 10 + b * 7 }} />
                    ))}
                  </span>
                  <span className="reading-text">{level.label}</span>
                </button>
              );
            })}
          </div>
        </fieldset>
      )}
    </div>
  );
}

// ───────────────────────── Lo que sabemos / lo que necesito saber ─────────────────────────

export function KnowNeedView({ step, state, dispatch, context }: Ctx & { step: KnowNeedStep; context?: string }) {
  const selected = state.responses[step.id] ?? [];
  const onToggle = (id: string) => {
    let next = toggle(selected, id);
    if (id === 'nada' && next.includes('nada')) next = ['nada'];
    else if (id !== 'nada') next = next.filter((x) => x !== 'nada');
    dispatch({ type: 'respond', stepId: step.id, values: next });
  };

  return (
    <div className="grid animate-rise gap-6 lg:grid-cols-[2fr_3fr]">
      <section aria-labelledby="known-title" className="rounded-[var(--radius-card)] bg-salvia-100 p-5">
        <h2 id="known-title" className="reading-text mb-4 flex items-center gap-2 text-2xl text-salvia-700">
          <Icon name="check" size={26} strokeWidth={3} /> {step.knownTitle}
        </h2>
        <ul className="grid gap-3">
          {step.known.map((k, i) => (
            <li key={k.id} className="flex animate-rise items-center gap-3 rounded-2xl bg-crema-50 p-3" style={{ animationDelay: `${i * 120}ms` }}>
              <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-salvia-100 text-salvia-700">
                <Icon name={k.icon} size={24} />
              </span>
              <span className="reading-text text-lg font-bold">{k.text}</span>
            </li>
          ))}
        </ul>
      </section>
      <section>
        <StepHeading title={step.needPrompt} help={step.help} icon="question" context={context} />
        <div className="grid gap-3 sm:grid-cols-2">
          {step.questions.map((q) => (
            <ToggleCard key={q.id} selected={selected.includes(q.id)} onToggle={() => onToggle(q.id)} icon={q.icon} label={q.label} tone={q.id === 'nada' ? 'salvia' : 'mostaza'} />
          ))}
        </div>
      </section>
    </div>
  );
}

// ───────────────────────── Decisión ─────────────────────────

export function ChoiceGrid({
  step,
  explored,
  onChoose,
}: {
  step: ChoiceStep;
  explored: string[];
  onChoose: (option: ChoiceOption) => void;
}) {
  return (
    <div className="animate-rise">
      <StepHeading title={step.prompt} help={step.help} icon="footsteps" />
      {/*
        Fase 20: tarjetas de álbum ilustrado. La ilustración cuenta la acción y una frase breve la nombra.
        Dos columnas desde el móvil (una con poco ancho o letra muy grande), tres en tableta horizontal.
        Todas iguales y en el orden del cuento: ninguna se destaca como preferible.
      */}
      <ul className={`choice-cards grid gap-3 sm:gap-4 ${step.options.length <= 2 ? 'choice-cards-pair' : ''}`}>
        {step.options.map((o) => {
          const seen = explored.includes(o.id);
          return (
            <li key={o.id}>
              <button
                type="button"
                onClick={() => onChoose(o)}
                className="choice-path tap group relative flex h-full w-full flex-col overflow-hidden rounded-[var(--radius-card)] border-[3px] bg-crema-50 text-left transition-colors"
              >
                <Illustration id={o.illustration} decorative ratio sizes={OPTION_CARD_SIZES} className="choice-path-art w-full" />
                {/* Estado de lo ya visto (no es una valoración): siempre con texto y marca, nunca solo color. */}
                {seen && (
                  <span className="choice-seen absolute top-2 left-2 inline-flex items-center gap-1 rounded-full bg-crema-50 px-2.5 py-1 text-sm font-bold text-salvia-700 shadow-[var(--shadow-soft)]">
                    <Icon name="check" size={16} strokeWidth={3} /> Ya la exploraste
                  </span>
                )}
                <span className="choice-path-copy flex flex-1 items-center justify-center p-3 text-center sm:p-4">
                  <span className="reading-text text-lg leading-snug font-extrabold">{o.label}</span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export function ChoiceView({ step, state, dispatch }: Ctx & { step: ChoiceStep }) {
  return (
    <ChoiceGrid
      step={step}
      explored={state.explored[step.id] ?? []}
      onChoose={(o) => {
        dispatch({ type: 'choose', stepId: step.id, optionId: o.id });
        dispatch({ type: 'next' });
      }}
    />
  );
}

// ───────────────────────── Consecuencias ─────────────────────────

/** `short`: Ajustes → «Textos cortos». Solo cambia lo que tenga versión corta escrita (readableConsequence). */
export function ConsequenceBody({ option, protagonist = 'Teo', short = false }: { option: ChoiceOption; protagonist?: string; short?: boolean }) {
  const c = option.consequence;
  if (!c) return null; // opción ramificada (fase 21): su consecuencia se cuenta en escenas
  const text = readableConsequence(c, short);
  const reflections = [
    { icon: 'heart', title: 'Cómo te puedes sentir', text: text.youMayFeel },
    { icon: 'friends', title: 'Cómo pueden sentirse otros', text: text.othersMay },
    { icon: 'check', title: 'Puede ayudar cuando…', text: text.helpsWhen },
    { icon: 'info', title: 'A tener en cuenta', text: text.keepInMind },
  ];
  return (
    <div className="consequence-page animate-rise">
      <p className="mb-1 text-sm font-extrabold tracking-wide text-coral-700 uppercase">Si {protagonist} elige…</p>
      <h2 className="reading-text mb-5 text-2xl text-petroleo-900 sm:text-3xl">{option.label}</h2>

      {/* 1. Lo que podría pasar: tira ilustrada que se lee en orden. Es una posibilidad, no un resultado seguro. */}
      <h3 className="consequence-frame mb-4 flex items-center gap-2 text-lg font-extrabold text-petroleo-800">
        <Icon name="sparkle" size={20} /> Esto es lo que podría pasar
      </h3>
      <ol className="mb-8 grid gap-5 md:grid-cols-2">
        {c.story.map((frame, i) => (
          <li key={i} className="animate-pop" style={{ animationDelay: `${i * 220}ms` }}>
            <Illustration id={frame.illustration} ratio sizes={CONSEQUENCE_SIZES} className="w-full rounded-3xl border-[3px] border-tinta/80" />
            <p className="reading-text mt-3 flex gap-3 text-xl leading-snug font-bold">
              <span aria-hidden className="grid size-8 shrink-0 place-items-center rounded-full bg-petroleo-600 text-base text-crema-50">
                {i + 1}
              </span>
              {text.story[i]}
            </p>
          </li>
        ))}
      </ol>

      {/* 2. Pensamos juntos: una sola reflexión, sin cajas de colores. */}
      <section aria-labelledby={`think-${option.id}`} className="rounded-[var(--radius-card)] bg-crema-50 px-5 py-2 sm:px-7">
        <h3 id={`think-${option.id}`} className="sr-only">
          Pensamos juntos
        </h3>
        {/* Fase 20: dos columnas desde tableta (mismo texto, la mitad de alto). */}
        <ul className="grid divide-y divide-crema-300/70 md:grid-cols-2 md:gap-x-8 md:divide-y-0">
          {reflections.map((r) => (
            <li key={r.title} className="flex gap-4 py-4">
              <span aria-hidden className="mt-0.5 grid size-10 shrink-0 place-items-center rounded-full bg-crema-200 text-petroleo-700">
                <Icon name={r.icon} size={20} />
              </span>
              <p>
                <strong className="block text-sm font-black tracking-wide text-tinta-suave uppercase">{r.title}</strong>
                <span className="reading-text text-lg">{r.text}</span>
              </p>
            </li>
          ))}
        </ul>
      </section>

      {text.anotherWay && (
        <section className="mt-4 flex gap-4 rounded-[var(--radius-card)] border-[3px] border-coral-300 bg-coral-50 p-5">
          <span aria-hidden className="grid size-10 shrink-0 place-items-center rounded-full bg-coral-100 text-coral-700">
            <Icon name="sparkle" size={20} />
          </span>
          <div>
            <h3 className="reading-text mb-1 text-lg text-coral-700">Otra forma de conseguir lo mismo</h3>
            <p className="reading-text text-lg">{text.anotherWay}</p>
          </div>
        </section>
      )}

      {c.tools.length > 0 && <Supports ids={c.tools} />}
    </div>
  );
}

/**
 * Apoyos de esta consecuencia (fase 19): en lugar de un catálogo aparte, cada apoyo relacionado se puede
 * abrir aquí mismo para ver su dibujo, qué es y su tarjeta. Son posibilidades, no la única forma válida.
 */
function Supports({ ids }: { ids: ToolId[] }) {
  const titleId = useId();
  return (
    <section aria-labelledby={titleId} className="consequence-supports mt-5">
      <h3 id={titleId} className="reading-text text-lg font-extrabold text-petroleo-900">
        Apoyos que podrían ayudar
      </h3>
      <p className="reading-text text-tinta-suave">Ábrelos si quieres saber más.</p>
      <ul className="mt-3 grid gap-3 md:grid-cols-2">
        {ids.map((id) => {
          const t = tools[id];
          return (
            <li key={id}>
              <details className="support-card group">
                <summary className="tap flex min-h-14 cursor-pointer list-none items-center gap-3 px-4 py-2 font-extrabold text-petroleo-800">
                  <Icon name={t.icon} size={22} />
                  <span className="flex-1">{t.name}</span>
                  <Icon name="chevron-right" size={20} className="transition-transform group-open:rotate-90" />
                </summary>
                <div className="flex items-start gap-4 px-4 pb-4">
                  {hasFinalArt(t.illustration) && <Illustration id={t.illustration} decorative ratio fit="contain" sizes="96px" className="w-24 shrink-0" />}
                  <div>
                    <p className="reading-text text-lg">{t.childText}</p>
                    <p className="reading-text mt-2 rounded-2xl bg-crema-100 px-3 py-2 font-bold">«{t.card}»</p>
                  </div>
                </div>
              </details>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export function ExploredMeter({ total, explored }: { total: number; explored: number }) {
  return (
    <p className="flex items-center gap-3 font-bold text-tinta-suave">
      <span aria-hidden className="flex gap-1.5">
        {Array.from({ length: total }, (_, i) => (
          <span key={i} className={`size-3 rounded-full ${i < explored ? 'bg-salvia-500' : 'bg-crema-300'}`} />
        ))}
      </span>
      Has explorado {explored} de {total} posibilidades
    </p>
  );
}

// ───────────────────────── Estrategias ─────────────────────────

export function StrategiesView({ step, state, dispatch, context }: Ctx & { step: StrategiesStep; context?: string }) {
  const selected = state.responses[step.id] ?? [];
  return (
    <div className="animate-rise">
      <StepHeading title={step.prompt} help={step.help} icon="backpack" context={context} />
      <div className="strategy-picker grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {step.tools.map((id) => {
          const t = tools[id];
          return (
            <ToggleCard
              key={id}
              selected={selected.includes(id)}
              onToggle={() => dispatch({ type: 'respond', stepId: step.id, values: toggle(selected, id) })}
              icon={t.icon}
              // Ilustración definitiva de la herramienta (la del catálogo); si aún no existe, el icono.
              // Decorativa: el nombre y la descripción ya la explican.
              leading={hasFinalArt(t.illustration) ? <Illustration id={t.illustration} decorative ratio fit="contain" sizes="96px" className="w-full" /> : undefined}
              label={t.name}
              description={t.childText}
              tone={t.color}
            />
          );
        })}
      </div>
    </div>
  );
}

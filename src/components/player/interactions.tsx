import type { Dispatch } from 'react';
import type { RunAction, RunState } from '../../engine/storyEngine.ts';
import type { ChoiceOption, ChoiceStep, FeelingsStep, KnowNeedStep, StrategiesStep } from '../../engine/types.ts';
import { tools } from '../../content/tools.ts';
import { Icon } from '../Icon.tsx';
import { Illustration } from '../Illustration.tsx';
import { StepHeading, ToggleCard } from './Toggle.tsx';

type Ctx = { state: RunState; dispatch: Dispatch<RunAction> };

const toggle = (list: string[], id: string) => (list.includes(id) ? list.filter((x) => x !== id) : [...list, id]);

// ───────────────────────── ¿Cómo te sentirías? ─────────────────────────

export function FeelingsView({ step, state, dispatch }: Ctx & { step: FeelingsStep }) {
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
      <StepHeading title={step.prompt} help={step.help} icon="heart" />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {step.options.map((o, i) => (
          <ToggleCard
            key={o.id}
            selected={selected.includes(o.id)}
            onToggle={() => onToggle(o.id)}
            icon={o.icon}
            label={o.label}
            tone={(['coral', 'petroleo', 'salvia', 'mostaza'] as const)[i % 4]}
          />
        ))}
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

export function KnowNeedView({ step, state, dispatch }: Ctx & { step: KnowNeedStep }) {
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
        <StepHeading title={step.needPrompt} help={step.help} icon="question" />
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
      <ul className="grid grid-cols-1 gap-4 min-[480px]:grid-cols-2 lg:grid-cols-3">
        {step.options.map((o) => {
          const seen = explored.includes(o.id);
          return (
            <li key={o.id}>
              <button
                type="button"
                onClick={() => onChoose(o)}
                className="tap group card flex h-full w-full flex-col overflow-hidden text-left hover:shadow-[var(--shadow-lift)]"
              >
                <Illustration id={o.illustration} decorative className="aspect-[4/3] w-full" />
                <span className="flex flex-1 items-center gap-3 p-4">
                  <span className="grid size-11 shrink-0 place-items-center rounded-full bg-petroleo-100 text-petroleo-700">
                    <Icon name={o.icon} size={22} />
                  </span>
                  <span className="reading-text flex-1 text-lg leading-snug font-extrabold">{o.label}</span>
                </span>
                {seen && (
                  <span className="mx-4 mb-4 -mt-1 inline-flex w-fit items-center gap-1 rounded-full bg-salvia-100 px-3 py-1 text-sm font-bold text-salvia-700">
                    <Icon name="check" size={16} strokeWidth={3} /> Ya la exploraste
                  </span>
                )}
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

export function ConsequenceBody({ option, protagonist = 'Teo' }: { option: ChoiceOption; protagonist?: string }) {
  const c = option.consequence;
  const cards = [
    { icon: 'heart', title: 'Cómo te puedes sentir', text: c.youMayFeel, cls: 'bg-coral-50' },
    { icon: 'friends', title: 'Cómo pueden sentirse otros', text: c.othersMay, cls: 'bg-petroleo-50' },
    { icon: 'check', title: 'Puede ayudar cuando…', text: c.helpsWhen, cls: 'bg-salvia-50' },
    { icon: 'info', title: 'A tener en cuenta', text: c.keepInMind, cls: 'bg-mostaza-50' },
  ];
  return (
    <div className="animate-rise">
      <p className="mb-1 text-sm font-extrabold tracking-wide text-coral-700 uppercase">Si {protagonist} elige…</p>
      <h2 className="reading-text mb-5 text-2xl text-petroleo-900 sm:text-3xl">{option.label}</h2>

      <h3 className="sr-only">Lo que puede pasar</h3>
      <ol className="mb-6 grid gap-4 sm:grid-cols-2">
        {c.story.map((frame, i) => (
          <li key={i} className="card animate-pop overflow-hidden" style={{ animationDelay: `${i * 180}ms` }}>
            <Illustration id={frame.illustration} className="aspect-[4/3] w-full" />
            <p className="reading-text flex gap-3 p-4 text-lg font-bold">
              <span aria-hidden className="grid size-8 shrink-0 place-items-center rounded-full bg-petroleo-600 text-base text-crema-50">
                {i + 1}
              </span>
              {frame.text}
            </p>
          </li>
        ))}
      </ol>

      <div className="grid gap-3 sm:grid-cols-2">
        {cards.map((card) => (
          <section key={card.title} className={`rounded-3xl p-4 ${card.cls}`}>
            <h3 className="reading-text mb-1 flex items-center gap-2 text-lg text-petroleo-900">
              <Icon name={card.icon} size={22} /> {card.title}
            </h3>
            <p className="reading-text text-lg">{card.text}</p>
          </section>
        ))}
      </div>

      {c.anotherWay && (
        <section className="mt-3 rounded-3xl border-[3px] border-coral-300 bg-crema-50 p-4">
          <h3 className="reading-text mb-1 flex items-center gap-2 text-lg text-coral-700">
            <Icon name="sparkle" size={22} /> Otra forma de conseguir lo mismo
          </h3>
          <p className="reading-text text-lg">{c.anotherWay}</p>
        </section>
      )}

      <p className="mt-4 flex flex-wrap items-center gap-2 text-base font-bold text-tinta-suave">
        <span>Herramientas relacionadas:</span>
        {c.tools.map((t) => (
          <span key={t} className="inline-flex items-center gap-1.5 rounded-full bg-crema-50 px-3 py-1 text-petroleo-800 shadow-[var(--shadow-soft)]">
            <Icon name={tools[t].icon} size={16} /> {tools[t].name}
          </span>
        ))}
      </p>
    </div>
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

export function StrategiesView({ step, state, dispatch }: Ctx & { step: StrategiesStep }) {
  const selected = state.responses[step.id] ?? [];
  return (
    <div className="animate-rise">
      <StepHeading title={step.prompt} help={step.help} icon="backpack" />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {step.tools.map((id) => {
          const t = tools[id];
          return (
            <ToggleCard
              key={id}
              selected={selected.includes(id)}
              onToggle={() => dispatch({ type: 'respond', stepId: step.id, values: toggle(selected, id) })}
              icon={t.icon}
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

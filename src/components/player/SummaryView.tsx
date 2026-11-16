import type { RunState } from '../../engine/storyEngine.ts';
import { findStep } from '../../engine/storyEngine.ts';
import type { Story, SummaryStep } from '../../engine/types.ts';
import { tools } from '../../content/tools.ts';
import { Icon } from '../Icon.tsx';
import { Nubi } from '../Nubi.tsx';
import { Button, LinkButton } from '../ui.tsx';

interface Item {
  label: string;
  icon: string;
}

/** Traduce las respuestas guardadas de un paso a etiquetas legibles. */
export function itemsForStep(story: Story, state: RunState, stepId: string): Item[] {
  const found = findStep(story, stepId);
  if (!found) return [];
  const { step } = found;
  const values = state.responses[stepId] ?? [];
  switch (step.type) {
    case 'feelings': {
      const items = step.options.filter((o) => values.includes(o.id)).map((o) => ({ label: o.label, icon: o.icon }));
      const level = state.responses[`${stepId}:intensidad`]?.[0];
      const levelLabel = step.intensity?.levels.find((l) => l.id === level)?.label;
      return levelLabel && items.length ? [...items, { label: `Intensidad: ${levelLabel.toLowerCase()}`, icon: 'motion' }] : items;
    }
    case 'know-need':
      return step.questions.filter((q) => values.includes(q.id)).map((q) => ({ label: q.label, icon: q.icon }));
    case 'choice':
      return (state.explored[stepId] ?? [])
        .map((id) => step.options.find((o) => o.id === id))
        .filter((o) => o !== undefined)
        .map((o) => ({ label: o.label, icon: o.icon }));
    case 'strategies':
      return values.filter((v) => v in tools).map((v) => ({ label: tools[v as keyof typeof tools].name, icon: tools[v as keyof typeof tools].icon }));
    default:
      return [];
  }
}

const TONES = ['bg-coral-50', 'bg-mostaza-50', 'bg-petroleo-50', 'bg-salvia-50'];

export function SummaryView({ story, state, step, onRestart }: { story: Story; state: RunState; step: SummaryStep; onRestart: () => void }) {
  return (
    <div className="animate-rise">
      <div className="mb-6 flex flex-col items-center gap-3 text-center sm:flex-row sm:text-left">
        <Nubi size={110} mood="happy" className="animate-float shrink-0" />
        <div>
          <h2 className="text-3xl text-petroleo-900 sm:text-4xl">{step.title}</h2>
          <p className="reading-text mt-1 text-lg text-tinta-suave">Esto es lo que elegiste. No hay respuestas buenas ni malas: son las tuyas.</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {step.sections.map((section, i) => {
          const items = itemsForStep(story, state, section.fromStepId);
          return (
            <section key={section.title} className={`rounded-[var(--radius-card)] p-5 ${TONES[i % TONES.length]}`}>
              <h3 className="reading-text mb-3 text-xl text-petroleo-900">{section.title}</h3>
              {items.length ? (
                <ul className="flex flex-wrap gap-2">
                  {items.map((item) => (
                    <li key={item.label} className="reading-text inline-flex items-center gap-2 rounded-full bg-crema-50 px-3.5 py-2 font-bold shadow-[var(--shadow-soft)]">
                      <Icon name={item.icon} size={18} /> {item.label}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="reading-text text-tinta-suave">{section.empty}</p>
              )}
            </section>
          );
        })}
      </div>

      <blockquote className="reading-text mt-6 rounded-[var(--radius-card)] bg-petroleo-700 p-6 text-center text-2xl leading-snug font-extrabold text-crema-50 sm:text-3xl">
        {step.closingPhrase}
      </blockquote>

      <p className="mt-3 text-center text-sm font-bold text-tinta-suave">Tu resumen se guarda solo en este dispositivo.</p>

      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <LinkButton to="/herramientas" icon="backpack">
          Ver mis herramientas
        </LinkButton>
        <Button variant="secondary" icon="refresh" onClick={onRestart}>
          Leer otra vez
        </Button>
        <LinkButton to="/mundo" variant="secondary" icon="map">
          Volver a Mi mundo
        </LinkButton>
      </div>
    </div>
  );
}

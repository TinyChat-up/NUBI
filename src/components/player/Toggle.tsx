import type { ReactNode } from 'react';
import { Icon } from '../Icon.tsx';

/** Tarjeta seleccionable grande (selección múltiple, sin "correcto/incorrecto"). */
export function ToggleCard({
  selected,
  onToggle,
  icon,
  label,
  description,
  tone = 'petroleo',
  children,
}: {
  selected: boolean;
  onToggle: () => void;
  icon?: string;
  label: string;
  description?: string;
  tone?: 'petroleo' | 'coral' | 'salvia' | 'mostaza';
  children?: ReactNode;
}) {
  const tones = {
    petroleo: 'bg-petroleo-100 text-petroleo-700',
    coral: 'bg-coral-100 text-coral-700',
    salvia: 'bg-salvia-100 text-salvia-700',
    mostaza: 'bg-mostaza-100 text-mostaza-700',
  };
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onToggle}
      className={`tap soft-border relative flex min-h-20 w-full items-center gap-3 rounded-3xl border-[3px] p-3 text-left transition-colors ${
        selected ? 'border-petroleo-600 bg-petroleo-50' : 'border-transparent bg-crema-50 shadow-[var(--shadow-soft)] hover:border-petroleo-200'
      }`}
    >
      {icon && (
        <span className={`grid size-14 shrink-0 place-items-center rounded-2xl ${tones[tone]}`}>
          <Icon name={icon} size={28} />
        </span>
      )}
      <span className="flex-1">
        <span className="reading-text block text-lg leading-snug font-extrabold text-tinta">{label}</span>
        {description && <span className="reading-text mt-0.5 block text-[0.95rem] leading-snug text-tinta-suave">{description}</span>}
        {children}
      </span>
      <span
        aria-hidden
        className={`grid size-8 shrink-0 place-items-center rounded-full border-2 transition-colors ${
          selected ? 'border-petroleo-600 bg-petroleo-600 text-crema-50' : 'border-crema-400 text-transparent'
        }`}
      >
        <Icon name="check" size={18} strokeWidth={3} />
      </span>
    </button>
  );
}

export function StepHeading({ title, help, icon = 'sparkle' }: { title: string; help?: string; icon?: string }) {
  return (
    <div className="mb-5 flex items-start gap-3">
      <span className="mt-1 grid size-11 shrink-0 place-items-center rounded-full bg-coral-100 text-coral-700">
        <Icon name={icon} size={24} />
      </span>
      <div>
        <h2 className="reading-text text-2xl text-petroleo-900 sm:text-3xl">{title}</h2>
        {help && <p className="reading-text mt-1 text-lg text-tinta-suave">{help}</p>}
      </div>
    </div>
  );
}

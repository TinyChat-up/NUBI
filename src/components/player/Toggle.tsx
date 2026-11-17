import type { ReactNode } from 'react';
import { Icon } from '../Icon.tsx';
import { Illustration } from '../Illustration.tsx';

/**
 * Tarjeta seleccionable grande (selección múltiple, sin "correcto/incorrecto").
 *
 * Al principio va un recurso visual en un hueco fijo de 56 px con fondo tintado:
 * - `leading`: un elemento propio (p. ej. la ilustración de una emoción), decorativo;
 * - si no hay `leading`, el icono `icon`.
 * El nombre accesible es siempre el texto visible; la selección se indica con borde,
 * marca ✓ y `aria-pressed`, nunca solo con la imagen.
 */
export function ToggleCard({
  selected,
  onToggle,
  icon,
  leading,
  label,
  description,
  tone = 'petroleo',
  children,
}: {
  selected: boolean;
  onToggle: () => void;
  icon?: string;
  /** Recurso visual decorativo que sustituye al icono en el mismo hueco (56 × 56 px). */
  leading?: ReactNode;
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
        selected ? 'border-petroleo-600 bg-petroleo-50' : 'border-crema-300/80 bg-crema-50 hover:border-petroleo-200'
      }`}
    >
      {leading ? (
        <span aria-hidden data-leading className={`grid size-14 shrink-0 place-items-center rounded-2xl ${tones[tone]}`}>
          {leading}
        </span>
      ) : (
        icon && (
          <span className={`grid size-14 shrink-0 place-items-center rounded-2xl ${tones[tone]}`}>
            <Icon name={icon} size={28} />
          </span>
        )
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

export function StepHeading({ title, help, icon = 'sparkle', context }: { title: string; help?: string; icon?: string; context?: string }) {
  return (
    <div className="mb-6 flex items-center gap-4">
      {context ? (
        // Miniatura de la escena (proporción completa, sin recorte) para anclar la pregunta en la historia.
        <Illustration id={context} decorative ratio className="w-28 shrink-0 rounded-2xl shadow-[var(--shadow-soft)] sm:w-44" sizes="176px" />
      ) : (
        <span className="grid size-11 shrink-0 place-items-center self-start rounded-full bg-coral-100 text-coral-700">
          <Icon name={icon} size={24} />
        </span>
      )}
      <div className="min-w-0">
        <h2 className="reading-text text-2xl text-petroleo-900 sm:text-3xl">{title}</h2>
        {help && <p className="reading-text mt-1 text-lg text-tinta-suave">{help}</p>}
      </div>
    </div>
  );
}

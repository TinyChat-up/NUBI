import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { Icon } from './Icon.tsx';
import { Link } from '../lib/router.tsx';

type Variant = 'primary' | 'secondary' | 'soft' | 'ghost' | 'coral';
type Size = 'md' | 'lg';

const base =
  'tap inline-flex items-center justify-center gap-2.5 rounded-full font-extrabold select-none disabled:cursor-not-allowed disabled:opacity-45';

const variants: Record<Variant, string> = {
  primary: 'bg-petroleo-600 text-crema-50 shadow-[var(--shadow-soft)] hover:bg-petroleo-700',
  coral: 'bg-coral-400 text-tinta shadow-[var(--shadow-soft)] hover:bg-coral-300',
  secondary: 'soft-border border-2 border-petroleo-200 bg-crema-50 text-petroleo-800 hover:border-petroleo-400',
  soft: 'bg-petroleo-100 text-petroleo-800 hover:bg-petroleo-200',
  ghost: 'text-petroleo-800 hover:bg-petroleo-100',
};

const sizes: Record<Size, string> = {
  md: 'min-h-14 px-6 text-base',
  lg: 'min-h-16 px-8 text-lg',
};

export const buttonClass = (variant: Variant = 'primary', size: Size = 'md', extra = '') =>
  `${base} ${variants[variant]} ${sizes[size]} ${extra}`;

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  icon?: string;
  iconAfter?: string;
}

export function Button({ variant = 'primary', size = 'md', icon, iconAfter, className = '', children, type = 'button', ...rest }: ButtonProps) {
  return (
    <button type={type} className={buttonClass(variant, size, className)} {...rest}>
      {icon && <Icon name={icon} size={size === 'lg' ? 26 : 22} />}
      {children}
      {iconAfter && <Icon name={iconAfter} size={size === 'lg' ? 26 : 22} />}
    </button>
  );
}

interface LinkButtonProps {
  to: string;
  variant?: Variant;
  size?: Size;
  icon?: string;
  iconAfter?: string;
  className?: string;
  children: ReactNode;
}

export function LinkButton({ to, variant = 'primary', size = 'md', icon, iconAfter, className = '', children }: LinkButtonProps) {
  return (
    <Link to={to} className={buttonClass(variant, size, className)}>
      {icon && <Icon name={icon} size={size === 'lg' ? 26 : 22} />}
      {children}
      {iconAfter && <Icon name={iconAfter} size={size === 'lg' ? 26 : 22} />}
    </Link>
  );
}

/** Botón redondo de icono con etiqueta visible debajo (más comprensible para peques). */
interface ToolButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: string;
  label: string;
  pressed?: boolean;
  tone?: 'light' | 'dark';
}

export function ToolButton({ icon, label, pressed, tone = 'light', className = '', ...rest }: ToolButtonProps) {
  const on = pressed === true;
  const colors =
    tone === 'dark'
      ? on
        ? 'bg-crema-50 text-petroleo-900'
        : 'bg-petroleo-800 text-crema-50 hover:bg-petroleo-700'
      : on
        ? 'bg-petroleo-600 text-crema-50'
        : 'bg-crema-50 text-petroleo-800 hover:bg-petroleo-100';
  return (
    <button
      type="button"
      aria-pressed={pressed}
      className={`tap flex min-w-16 flex-col items-center gap-1 rounded-2xl px-2 py-1.5 text-sm font-extrabold disabled:opacity-40 ${className}`}
      {...rest}
    >
      <span className={`grid size-12 place-items-center rounded-full ${colors} transition-colors`}>
        <Icon name={icon} size={24} />
      </span>
      <span className={tone === 'dark' ? 'text-crema-50' : 'text-tinta'}>{label}</span>
    </button>
  );
}

export function PageHeader({ title, subtitle, icon, children }: { title: string; subtitle?: string; icon?: string; children?: ReactNode }) {
  return (
    <header className="page-heading mb-6 flex flex-col gap-3 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
      <div className="flex items-center gap-4">
        {icon && (
          <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-crema-50 text-petroleo-700 shadow-[var(--shadow-soft)]">
            <Icon name={icon} size={28} />
          </span>
        )}
        <div>
          <h1 className="text-3xl text-petroleo-900 sm:text-4xl">{title}</h1>
          {subtitle && <p className="mt-1 text-lg text-tinta-suave">{subtitle}</p>}
        </div>
      </div>
      {children}
    </header>
  );
}

export function Chip({ children, icon, tone = 'petroleo' }: { children: ReactNode; icon?: string; tone?: 'petroleo' | 'coral' | 'salvia' | 'mostaza' | 'crema' }) {
  const tones = {
    petroleo: 'bg-petroleo-100 text-petroleo-800',
    coral: 'bg-coral-100 text-coral-700',
    salvia: 'bg-salvia-100 text-salvia-700',
    mostaza: 'bg-mostaza-100 text-mostaza-700',
    crema: 'bg-crema-200 text-tinta',
  };
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-bold ${tones[tone]}`}>
      {icon && <Icon name={icon} size={16} />}
      {children}
    </span>
  );
}

export const toneBg = {
  petroleo: 'bg-petroleo-100',
  coral: 'bg-coral-100',
  salvia: 'bg-salvia-100',
  mostaza: 'bg-mostaza-100',
} as const;

export const toneText = {
  petroleo: 'text-petroleo-700',
  coral: 'text-coral-700',
  salvia: 'text-salvia-700',
  mostaza: 'text-mostaza-700',
} as const;

/** Contenedor de página con márgenes adaptados a tableta/móvil. */
export function Page({ children, className = '' }: { children: ReactNode; className?: string }) {
  // `app-page`: en ventana baja la navegación inferior no es fija y sobra la reserva de pb-32 (index.css).
  return <div className={`app-page mx-auto w-full max-w-6xl px-4 pt-6 pb-32 sm:px-8 sm:pt-10 ${className}`}>{children}</div>;
}

import { useRef, type ReactNode } from 'react';
import { Icon } from './Icon.tsx';
import { GuideArt } from './illustration/GuideArt.tsx';
import { Link, useLocation } from '../lib/router.tsx';
import { SINGLE_BAR, useTightViewport } from '../lib/useTightViewport.ts';

export function Logo({ size = 40 }: { size?: number }) {
  return (
    <span className="flex items-center gap-2">
      <GuideArt size={size} />
      <span className="logo-word text-2xl font-black tracking-[0.08em] text-petroleo-800">NUBI</span>
    </span>
  );
}

export function AppShell({ children, chrome = true }: { children: ReactNode; chrome?: boolean }) {
  const { path } = useLocation();
  // Ventana baja (zoom alto): la cabecera deja de ser fija para no tapar el contenido.
  // Fase 19: sin pestañas. Solo el logotipo (volver al inicio) y Ajustes; las dos funciones de NUBI
  // (Descubrir un cuento / Para familias y docentes) se eligen en la portada.
  const headerRef = useRef<HTMLElement>(null);
  const tight = useTightViewport([headerRef], chrome, SINGLE_BAR);

  return (
    <div className="paper flex min-h-dvh flex-col">
      <a href="#contenido" className="skip-link rounded-full bg-petroleo-800 px-5 py-3 font-bold text-crema-50">
        Saltar al contenido
      </a>

      {chrome && (
        <header ref={headerRef} className={`${tight ? 'static' : 'sticky top-0'} z-30 border-b border-crema-300/70 bg-crema-100`}>
          <div className="app-bar mx-auto flex min-h-18 max-w-6xl flex-wrap items-center justify-between gap-x-3 px-4 sm:px-8">
            <Link to="/" aria-label="NUBI, ir a la portada" className="tap flex min-h-12 items-center rounded-2xl pr-2">
              <Logo />
            </Link>

            <div className="flex items-center gap-1.5">
              <Link to="/" className="tap flex min-h-12 min-w-12 items-center justify-center gap-2 rounded-full px-3 font-extrabold text-petroleo-800 hover:bg-petroleo-100 sm:px-4">
                <Icon name="home" size={22} />
                Inicio
              </Link>
              <Link
                to="/ajustes"
                aria-current={path === '/ajustes' ? 'page' : undefined}
                className="tap flex min-h-12 min-w-12 items-center justify-center gap-2 rounded-full px-3 font-extrabold text-petroleo-800 hover:bg-petroleo-100 sm:px-4"
              >
                <Icon name="settings" size={22} />
                Ajustes
              </Link>
            </div>
          </div>
        </header>
      )}

      <main id="contenido" className="flex-1">
        {children}
      </main>
    </div>
  );
}

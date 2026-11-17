import { useRef, type ReactNode } from 'react';
import { Icon } from './Icon.tsx';
import { GuideArt } from './illustration/GuideArt.tsx';
import { Link, useLocation } from '../lib/router.tsx';
import { useTightViewport } from '../lib/useTightViewport.ts';

const NAV = [
  { to: '/mundo', label: 'Mi mundo', icon: 'map' },
  { to: '/historias', label: 'Historias', icon: 'story' },
  { to: '/recreaciones', label: 'Recreaciones', icon: 'footsteps' },
  { to: '/herramientas', label: 'Herramientas', icon: 'backpack' },
];

function isActive(path: string, to: string) {
  return path === to || path.startsWith(`${to}/`);
}

export function Logo({ size = 40 }: { size?: number }) {
  return (
    <span className="flex items-center gap-2">
      <GuideArt size={size} />
      <span className="text-2xl font-black tracking-[0.08em] text-petroleo-800">NUBI</span>
    </span>
  );
}

export function AppShell({ children, chrome = true }: { children: ReactNode; chrome?: boolean }) {
  const { path } = useLocation();
  // Ventana baja (zoom alto): cabecera y navegación inferior dejan de ser fijas para no tapar el contenido.
  const headerRef = useRef<HTMLElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const tight = useTightViewport([headerRef, navRef], chrome);

  return (
    <div className="paper flex min-h-dvh flex-col">
      <a href="#contenido" className="skip-link rounded-full bg-petroleo-800 px-5 py-3 font-bold text-crema-50">
        Saltar al contenido
      </a>

      {chrome && (
        <header ref={headerRef} className={`${tight ? 'static' : 'sticky top-0'} z-30 border-b border-crema-300/70 bg-crema-100`}>
          <div className="mx-auto flex h-18 max-w-6xl items-center justify-between gap-3 px-4 sm:px-8">
            <Link to="/" aria-label="NUBI, ir a la portada" className="tap flex min-h-12 items-center rounded-2xl pr-2">
              <Logo />
            </Link>

            <nav aria-label="Principal" className="hidden xl:block">
              <ul className="flex gap-1">
                {NAV.map((item) => {
                  const active = isActive(path, item.to);
                  return (
                    <li key={item.to}>
                      <Link
                        to={item.to}
                        aria-current={active ? 'page' : undefined}
                        className={`tap flex min-h-12 items-center gap-2 rounded-full px-4 font-extrabold ${
                          active ? 'bg-petroleo-600 text-crema-50' : 'text-petroleo-800 hover:bg-petroleo-100'
                        }`}
                      >
                        <Icon name={item.icon} size={20} />
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>

            <div className="flex items-center gap-1.5">
              <Link
                to="/ajustes"
                aria-current={isActive(path, '/ajustes') ? 'page' : undefined}
                className="tap flex min-h-12 min-w-12 items-center justify-center gap-2 rounded-full px-3 font-extrabold text-petroleo-800 hover:bg-petroleo-100 sm:px-4"
              >
                <Icon name="settings" size={22} />
                <span className="hidden sm:inline">Ajustes</span>
                <span className="sr-only sm:hidden">Ajustes</span>
              </Link>
              <Link
                to="/familias"
                aria-current={isActive(path, '/familias') ? 'page' : undefined}
                className="tap flex min-h-12 min-w-12 items-center justify-center gap-2 rounded-full border-2 border-petroleo-200 px-3 font-extrabold text-petroleo-800 hover:border-petroleo-400 sm:px-4"
              >
                <Icon name="grown" size={22} />
                <span className="hidden sm:inline">Familias</span>
                <span className="sr-only sm:hidden">Espacio familiar</span>
              </Link>
            </div>
          </div>
        </header>
      )}

      <main id="contenido" className="flex-1">
        {children}
      </main>

      {chrome && (
        <nav ref={navRef} aria-label="Principal" className={`primary-tabs safe-bottom ${tight ? 'static' : 'fixed inset-x-0 bottom-0'} z-30 border-t border-crema-300/70 bg-crema-50 xl:hidden`}>
          <ul className="mx-auto grid max-w-xl grid-cols-4 px-1 pt-2">
            {NAV.map((item) => {
              const active = isActive(path, item.to);
              return (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    aria-current={active ? 'page' : undefined}
                    className="tap flex flex-col items-center gap-1 rounded-2xl py-1.5 text-sm font-extrabold text-petroleo-800"
                  >
                    <span className={`grid h-10 w-14 place-items-center rounded-full transition-colors ${active ? 'bg-petroleo-600 text-crema-50' : ''}`}>
                      <Icon name={item.icon} size={24} />
                    </span>
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      )}
    </div>
  );
}

import { storyList } from '../content/stories/index.ts';
import { Icon } from '../components/Icon.tsx';
import { Illustration, hasFinalArt } from '../components/Illustration.tsx';
import { GuideArt } from '../components/illustration/GuideArt.tsx';
import { Nubi } from '../components/Nubi.tsx';
import { LinkButton } from '../components/ui.tsx';
import { Link } from '../lib/router.tsx';
import { useProgress } from '../state/progress.tsx';

/** A. PORTADA — exploración, calma y curiosidad. */
export function HomeScreen() {
  const featured = storyList[0];
  const { progress } = useProgress();
  const started = Boolean(progress.stories[featured.id]);

  return (
    <div className="relative">
      {/* Escena principal */}
      <section className="relative isolate flex min-h-[100dvh] flex-col overflow-hidden" aria-labelledby="home-title">
        {hasFinalArt('portada-fondo') ? (
          <>
            <Illustration
              id="portada-fondo"
              decorative
              priority
              fit="cover"
              className="absolute inset-x-0 bottom-0 -z-10 w-full portrait:aspect-[4/3] landscape:top-0 landscape:h-full"
              imgClassName="portrait:[mask-image:linear-gradient(to_bottom,transparent,black_38%)]"
            />
            {/* Velo de papel en la parte superior para que el título se lea sobre cualquier cielo. */}
            <div aria-hidden className="absolute inset-x-0 top-0 -z-10 hidden h-[55%] bg-gradient-to-b from-crema-100/85 via-crema-100/45 to-transparent landscape:block" />
          </>
        ) : (
          <Illustration id="portada-fondo" decorative className="absolute inset-x-0 bottom-0 -z-10 h-[62%] w-full [&_svg]:h-full" />
        )}

        {/* nubes que derivan (decorativas, se detienen con movimiento reducido) */}
        <div aria-hidden className="pointer-events-none absolute inset-x-0 top-24 -z-10 h-40 overflow-hidden">
          <div className="absolute top-2 h-10 w-40 animate-drift rounded-full bg-crema-50/80 blur-[1px]" />
          <div className="absolute top-20 h-8 w-28 animate-drift rounded-full bg-crema-50/70 [animation-delay:-35s]" />
        </div>

        <header className="flex items-center justify-end gap-2 px-4 pt-4 sm:px-8 sm:pt-6">
          <Link to="/ajustes" className="tap flex min-h-12 items-center gap-2 rounded-full bg-crema-50/85 px-4 font-extrabold text-petroleo-800 shadow-[var(--shadow-soft)]">
            <Icon name="settings" size={22} /> <span className="hidden sm:inline">Ajustes</span>
            <span className="sr-only sm:hidden">Ajustes</span>
          </Link>
          <Link to="/familias" className="tap flex min-h-12 items-center gap-2 rounded-full bg-crema-50/85 px-4 font-extrabold text-petroleo-800 shadow-[var(--shadow-soft)]">
            <Icon name="grown" size={22} /> <span className="hidden sm:inline">Familias</span>
            <span className="sr-only sm:hidden">Espacio familiar</span>
          </Link>
        </header>

        <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col items-center justify-start gap-6 px-6 pt-[4vh] pb-[30vh] text-center lg:flex-row lg:items-start lg:justify-start lg:gap-10 lg:pt-[8vh] lg:text-left">
          {hasFinalArt('nubi-saludo') ? (
            <GuideArt size={200} className="w-36 animate-sway sm:w-48" label="Nubi, la nube guía, te saluda" />
          ) : (
            <Nubi size={190} mood="happy" wave className="animate-float drop-shadow-[0_18px_24px_rgba(34,51,58,0.15)] max-sm:w-36" label="Nubi, la nube guía, te saluda" />
          )}
          <div className="animate-rise">
            <h1 id="home-title" className="text-[4.5rem] leading-none font-black tracking-[0.12em] text-petroleo-800 sm:text-[6.5rem]">
              NUBI
            </h1>
            <p className="mt-2 text-2xl font-extrabold text-tinta sm:text-3xl">Un mundo de historias por descubrir</p>
            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row lg:items-start">
              <LinkButton to="/mundo" size="lg" iconAfter="arrow-right">
                Entrar en mi mundo
              </LinkButton>
              <LinkButton to="/historias" size="lg" variant="secondary" icon="story">
                Ver historias
              </LinkButton>
            </div>
          </div>
        </div>
      </section>

      {/* Historia destacada */}
      <section aria-labelledby="featured-title" className="relative -mt-[16vh] px-4 pb-16 sm:px-8">
        <div className="card mx-auto grid max-w-5xl overflow-hidden md:grid-cols-[1.1fr_1fr]">
          <Illustration id={featured.cover} ratio sizes="(min-width: 768px) 50vw, 100vw" className="w-full md:self-center" />
          <div className="flex flex-col justify-center gap-4 p-6 sm:p-8">
            <p className="text-sm font-black tracking-widest text-coral-700 uppercase">Episodio piloto</p>
            <h2 id="featured-title" className="text-3xl text-petroleo-900 sm:text-4xl">
              {featured.title}
            </h2>
            <p className="reading-text text-lg">{featured.tagline}</p>
            <div className="mt-2 flex flex-wrap gap-3">
              <LinkButton to={`/historias/${featured.id}`} icon="play">
                {started ? 'Seguir explorando' : 'Empezar la historia'}
              </LinkButton>
            </div>
          </div>
        </div>

        <p className="mx-auto mt-10 flex max-w-3xl flex-wrap items-center justify-center gap-x-6 gap-y-2 text-center text-sm font-bold text-tinta-suave">
          <span className="inline-flex items-center gap-1.5">
            <Icon name="lock" size={16} /> Sin cuentas ni datos personales
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Icon name="volume-off" size={16} /> Sin sonidos inesperados
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Icon name="clock" size={16} /> Sin prisas ni temporizadores
          </span>
        </p>
      </section>
    </div>
  );
}

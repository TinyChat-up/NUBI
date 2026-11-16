import { useMemo, useState } from 'react';
import { referenceList } from '../content/references.ts';
import { getStory, storyList } from '../content/stories/index.ts';
import { tools } from '../content/tools.ts';
import type { ToolId } from '../engine/types.ts';
import { Icon } from '../components/Icon.tsx';
import { Button, Chip, LinkButton, Page, PageHeader } from '../components/ui.tsx';
import { useLocation } from '../lib/router.tsx';
import { useProgress } from '../state/progress.tsx';

const NUMBERS = [
  { n: 14, word: 'catorce' },
  { n: 41, word: 'cuarenta y uno' },
  { n: 27, word: 'veintisiete' },
  { n: 72, word: 'setenta y dos' },
];

/** Puerta sencilla para adultos (no es seguridad: solo evita entradas accidentales). */
function AdultGate({ onPass }: { onPass: () => void }) {
  const target = useMemo(() => NUMBERS[Math.floor(Math.random() * NUMBERS.length)], []);
  const options = useMemo(() => [...NUMBERS].sort(() => Math.random() - 0.5), []);
  const [wrong, setWrong] = useState(false);
  return (
    <Page>
      <div className="card mx-auto max-w-lg p-6 text-center sm:p-8">
        <span className="mx-auto mb-4 grid size-16 place-items-center rounded-2xl bg-petroleo-100 text-petroleo-700">
          <Icon name="grown" size={32} />
        </span>
        <h1 className="text-3xl text-petroleo-900">Espacio para familias</h1>
        <p className="mt-2 text-lg">Esta zona es para personas adultas. Esta puerta de demostración no es una autenticación segura.</p>
        <p className="mt-4 text-lg font-bold">
          Pulsa el número <span className="text-coral-700">{target.word}</span>
        </p>
        <div className="mt-4 grid grid-cols-2 gap-3">
          {options.map((o) => (
            <Button key={o.n} variant="secondary" size="lg" onClick={() => (o.n === target.n ? onPass() : setWrong(true))}>
              {o.n}
            </Button>
          ))}
        </div>
        {wrong && (
          <p role="status" className="mt-4 font-bold text-tinta-suave">
            Ese no es. Si eres un niño o una niña, ¡vuelve a tu mundo de historias!
          </p>
        )}
        <div className="mt-6">
          <LinkButton to="/mundo" variant="ghost" icon="arrow-left">
            Volver a Mi mundo
          </LinkButton>
        </div>
      </div>
    </Page>
  );
}

let unlockedThisSession = false;

/** H. ESPACIO FAMILIAR — demo sin datos personales, sin perfiles ni puntuaciones. */
export function FamilyScreen() {
  const [unlocked, setUnlocked] = useState(unlockedThisSession);
  const { progress, resetAll } = useProgress();
  const { query } = useLocation();
  const [confirmReset, setConfirmReset] = useState(false);
  const story = getStory(query.get('historia') ?? '') ?? storyList[0];

  if (!unlocked)
    return (
      <AdultGate
        onPass={() => {
          unlockedThisSession = true;
          setUnlocked(true);
        }}
      />
    );

  const explored = storyList.filter((s) => progress.stories[s.id]);
  const practiced = Object.keys(progress.toolsPracticed) as ToolId[];
  const chosen = progress.toolsChosen.filter((t) => !practiced.includes(t));
  const guide = story.familyGuide;
  const storyProgress = progress.stories[story.id];
  const allOptions = story.scenes.flatMap((sc) => sc.steps).flatMap((st) => (st.type === 'choice' ? st.options : []));
  const pending = guide.pendingActivities.filter((a) => {
    switch (a.doneWhen) {
      case 'all-options-explored':
        return (storyProgress?.exploredOptions.length ?? 0) < allOptions.length;
      case 'any-tool-practiced':
        return practiced.length === 0;
      case 'story-completed':
        return !storyProgress?.completedAt;
      default:
        return true;
    }
  });

  return (
    <Page>
      <PageHeader title="Espacio familiar" subtitle="Ideas para acompañar, sin evaluar." icon="grown" />

      <p className="mb-8 flex items-start gap-3 rounded-3xl bg-mostaza-100 p-4 text-mostaza-700">
        <Icon name="info" className="mt-0.5 shrink-0" />
        <span className="font-bold">
          Versión de demostración. Lo que ves aquí se guarda solo en este dispositivo: no hay cuentas, ni perfiles, ni diagnósticos, ni puntuaciones.
        </span>
      </p>

      <div className="grid gap-5 lg:grid-cols-2">
        {/* Historias exploradas */}
        <section className="card p-6">
          <h2 className="mb-4 flex items-center gap-2 text-2xl text-petroleo-900">
            <Icon name="story" /> Historias exploradas
          </h2>
          {explored.length ? (
            <ul className="grid gap-3">
              {explored.map((s) => {
                const p = progress.stories[s.id];
                return (
                  <li key={s.id} className="rounded-2xl bg-crema-100 p-4">
                    <p className="text-lg font-black">{s.title}</p>
                    <p className="text-tinta-suave">
                      Escenas visitadas: {p.visitedScenes.length} de {s.scenes.length} · Formatos: {p.formatsUsed.join(', ')}
                      {p.completedAt ? ' · Terminada' : ''}
                    </p>
                    {p.exploredOptions.length > 0 && <p className="text-tinta-suave">Posibilidades exploradas: {p.exploredOptions.length}</p>}
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="text-tinta-suave">Todavía no se ha explorado ninguna historia en este dispositivo.</p>
          )}
        </section>

        {/* Estrategias */}
        <section className="card p-6">
          <h2 className="mb-4 flex items-center gap-2 text-2xl text-petroleo-900">
            <Icon name="backpack" /> Estrategias practicadas
          </h2>
          {practiced.length || chosen.length ? (
            <div className="grid gap-4">
              {practiced.length > 0 && (
                <div>
                  <p className="mb-2 font-bold text-tinta-suave">Marcadas como «la he probado»:</p>
                  <div className="flex flex-wrap gap-2">
                    {practiced.map((t) => (
                      <Chip key={t} icon={tools[t].icon} tone="salvia">
                        {tools[t].name}
                      </Chip>
                    ))}
                  </div>
                </div>
              )}
              {chosen.length > 0 && (
                <div>
                  <p className="mb-2 font-bold text-tinta-suave">Elegidas en las historias como «podría ayudarme»:</p>
                  <div className="flex flex-wrap gap-2">
                    {chosen.map((t) => (
                      <Chip key={t} icon={tools[t].icon} tone="mostaza">
                        {tools[t].name}
                      </Chip>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <p className="text-tinta-suave">Aún no hay estrategias marcadas. Se pueden elegir en las historias o en «Mis herramientas».</p>
          )}
        </section>

        {/* Actividades pendientes */}
        <section className="card p-6">
          <h2 className="mb-4 flex items-center gap-2 text-2xl text-petroleo-900">
            <Icon name="footsteps" /> Actividades pendientes
          </h2>
          <ul className="grid gap-3">
            {(explored.length ? pending : [{ id: 'start', title: `Empezar «${story.title}»`, text: 'Elegid juntos el formato: cuento, cómic o escuchar.' }]).map((a) => (
              <li key={a.id} className="flex gap-3 rounded-2xl bg-crema-100 p-4">
                <span className="mt-1 size-3 shrink-0 rounded-full bg-coral-400" aria-hidden />
                <span>
                  <span className="block font-black">{a.title}</span>
                  <span className="text-tinta-suave">{a.text}</span>
                </span>
              </li>
            ))}
          </ul>
        </section>

        {/* Recursos */}
        <section className="card p-6">
          <h2 className="mb-4 flex items-center gap-2 text-2xl text-petroleo-900">
            <Icon name="book" /> Recursos disponibles
          </h2>
          <ul className="grid gap-3">
            {guide.resources.map((r) => (
              <li key={r.id} className="flex items-center gap-3 rounded-2xl bg-crema-100 p-4">
                <span className="flex-1">
                  <span className="block font-black">{r.title}</span>
                  <span className="text-tinta-suave">{r.description}</span>
                </span>
                {r.status === 'disponible' ? (
                  <a href="#guia" className="tap inline-flex min-h-12 items-center rounded-full bg-petroleo-600 px-4 py-2 font-bold text-crema-50">
                    Ver
                  </a>
                ) : (
                  <Chip tone="crema">En preparación</Chip>
                )}
              </li>
            ))}
          </ul>
        </section>
      </div>

      {/* Práctica cotidiana */}
      <section className="mt-8">
        <h2 className="mb-4 flex items-center gap-2 text-2xl text-petroleo-900">
          <Icon name="home" /> Propuestas de práctica cotidiana
        </h2>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {guide.dailyPractice.map((d) => (
            <li key={d.id} className="card p-5">
              {d.tool && (
                <span className="mb-2 inline-flex items-center gap-1.5 text-sm font-bold text-coral-700">
                  <Icon name={tools[d.tool].icon} size={16} /> {tools[d.tool].name}
                </span>
              )}
              <h3 className="text-xl text-petroleo-900">{d.title}</h3>
              <p className="mt-1">{d.text}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* Guía de la historia */}
      <section id="guia" className="mt-8 scroll-mt-24 rounded-[var(--radius-card)] bg-petroleo-50 p-6 sm:p-8">
        <h2 className="text-2xl text-petroleo-900">Guía de «{story.title}»</h2>
        <p className="mt-2 text-lg">{guide.intro}</p>

        <h3 className="mt-6 text-lg text-petroleo-900">Objetivos educativos</h3>
        <ul className="mt-2 grid gap-1.5">
          {story.objectives.map((o) => (
            <li key={o.id} className="flex gap-2">
              <Icon name="check" size={20} className="mt-0.5 shrink-0 text-salvia-700" /> {o.text}
            </li>
          ))}
        </ul>

        <div className="mt-6 grid gap-5 md:grid-cols-3">
          {[
            { title: 'Antes', items: guide.beforeReading },
            { title: 'Durante', items: guide.duringReading },
            { title: 'Después', items: guide.afterReading },
          ].map((block) => (
            <div key={block.title} className="rounded-3xl bg-crema-50 p-5">
              <h3 className="mb-2 text-lg text-petroleo-900">{block.title}</h3>
              <ul className="grid list-disc gap-1.5 pl-5">
                {block.items.map((i) => (
                  <li key={i}>{i}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-5 grid gap-5 md:grid-cols-2">
          <div className="rounded-3xl bg-coral-50 p-5">
            <h3 className="mb-2 text-lg text-coral-700">Cuándo parar</h3>
            <ul className="grid list-disc gap-1.5 pl-5">
              {guide.pauseSignals.map((i) => (
                <li key={i}>{i}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-3xl bg-salvia-50 p-5">
            <h3 className="mb-2 text-lg text-salvia-700">Respeto y diversidad</h3>
            <ul className="grid list-disc gap-1.5 pl-5">
              {guide.respectNotes.map((i) => (
                <li key={i}>{i}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Fundamentos */}
      <details className="card group mt-8 p-6">
        <summary className="flex min-h-12 cursor-pointer list-none items-center gap-2 text-2xl font-black text-petroleo-900">
          <Icon name="info" /> Fundamentos pedagógicos
          <Icon name="chevron-right" className="ml-auto transition-transform group-open:rotate-90" />
        </summary>
        <p className="mt-3 text-tinta-suave">
          NUBI se inspira en estos marcos, pero sus historias, personajes y actividades son originales. Indicamos qué es un fundamento verificado y qué es una propuesta propia pendiente de validar.
        </p>
        <ul className="mt-4 grid gap-3">
          {story.references.map((r) => {
            const ref = referenceList.find((x) => x.id === r.source)!;
            return (
              <li key={r.source} className="rounded-2xl bg-crema-100 p-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-black">{ref.authors}</span>
                  <span className="text-tinta-suave">· {ref.work}</span>
                  <Chip tone={r.status === 'fundamento' ? 'salvia' : 'mostaza'}>{r.status === 'fundamento' ? 'Fundamento' : 'Propuesta por validar'}</Chip>
                </div>
                <p className="mt-1">{r.howApplied}</p>
                {ref.url && (
                  <a href={ref.url} target="_blank" rel="noreferrer noopener" className="mt-1 inline-block font-bold text-petroleo-700 underline underline-offset-4">
                    Fuente
                  </a>
                )}
              </li>
            );
          })}
        </ul>
      </details>

      {/* Privacidad */}
      <section className="mt-8 rounded-[var(--radius-card)] border-2 border-crema-300 p-6">
        <h2 className="flex items-center gap-2 text-xl text-petroleo-900">
          <Icon name="lock" /> Datos de este dispositivo
        </h2>
        <p className="mt-2">
          NUBI guarda en este navegador solo las preferencias de lectura y el progreso de prueba que ves en esta página. No se envía nada a ningún servidor.
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          {confirmReset ? (
            <>
              <span className="font-bold">¿Borrar todo el progreso?</span>
              <Button
                variant="coral"
                icon="trash"
                onClick={() => {
                  resetAll();
                  setConfirmReset(false);
                }}
              >
                Sí, borrar
              </Button>
              <Button variant="ghost" onClick={() => setConfirmReset(false)}>
                Cancelar
              </Button>
            </>
          ) : (
            <Button variant="secondary" icon="trash" onClick={() => setConfirmReset(true)}>
              Reiniciar el progreso
            </Button>
          )}
        </div>
      </section>
    </Page>
  );
}

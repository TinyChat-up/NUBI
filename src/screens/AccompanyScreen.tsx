import type { ReactNode } from 'react';
import { characters } from '../content/characters.ts';
import { referenceList } from '../content/references.ts';
import { getStory, storyList } from '../content/stories/index.ts';
import { tools } from '../content/tools.ts';
import type { Story } from '../engine/types.ts';
import { Icon } from '../components/Icon.tsx';
import { Illustration } from '../components/Illustration.tsx';
import { protagonistName, storyMoments } from '../components/player/moments.ts';
import { Chip, LinkButton, Page, PageHeader } from '../components/ui.tsx';
import { Link } from '../lib/router.tsx';

/**
 * ACOMPAÑAR UN CUENTO (fase 19), para familias y docentes.
 *
 * - Mismas historias y mismo reproductor que el niño o la niña: aquí solo hay una guía breve por cuento.
 * - Sin panel, estadísticas, porcentajes, perfiles ni respuestas del menor (no se muestra nada de lo que elige).
 * - Sin puerta numérica: aquella barrera de demostración parecía seguridad y no lo era. Un aviso claro basta.
 * - Todo el texto de la guía procede de `story.familyGuide` y del propio cuento; lo que falta está en
 *   docs/product/PHASE_19_SIMPLIFICATION_REPORT.md como propuesta editorial pendiente de aprobación.
 */
export function AccompanyScreen() {
  return (
    <Page>
      <PageHeader title="Para familias y docentes" subtitle="Una guía breve para acompañar cada cuento." icon="grown" />
      <AdultNote />

      <ol className="accompany-steps" aria-label="Cómo funciona">
        <li><span aria-hidden>1</span> Elige un cuento.</li>
        <li><span aria-hidden>2</span> Lee su guía: antes, durante y después.</li>
        <li><span aria-hidden>3</span> Empezad el cuento juntos, si el niño o la niña quiere.</li>
      </ol>

      <h2 className="mt-8 mb-4 text-2xl text-petroleo-900">Cuentos</h2>
      <ul className="grid gap-5 md:grid-cols-2">
        {storyList.map((story) => (
          <li key={story.id}>
            <Link to={`/acompanar/${story.id}`} className="tap accompany-story">
              <Illustration id={story.cover} decorative ratio fit="contain" sizes="(min-width: 768px) 220px, 40vw" className="accompany-story-art" />
              <span className="flex flex-col gap-1">
                <span className="text-2xl font-black text-petroleo-900">{story.title}</span>
                <span className="reading-text text-tinta-suave">{story.tagline}</span>
                <span className="mt-2 inline-flex items-center gap-2 font-extrabold text-petroleo-700">
                  Ver la guía <Icon name="arrow-right" size={20} />
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </Page>
  );
}

function AdultNote() {
  return (
    <p className="adult-note mb-6 flex items-start gap-3 rounded-3xl bg-petroleo-50 p-4 text-petroleo-900">
      <Icon name="info" className="mt-0.5 shrink-0" />
      <span>
        Esta parte es para personas adultas. No muestra lo que responde el niño o la niña: sus respuestas son suyas. NUBI no tiene cuentas, no
        evalúa y no envía datos.
      </span>
    </p>
  );
}

function Block({ id, title, intro, children }: { id: string; title: string; intro: string; children: ReactNode }) {
  return (
    <section aria-labelledby={id} className="guide-block">
      <h2 id={id} className="text-3xl text-petroleo-900">
        {title}
      </h2>
      <p className="reading-text mt-1 text-lg text-tinta-suave">{intro}</p>
      <div className="mt-5 grid gap-6">{children}</div>
    </section>
  );
}

function Part({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <h3 className="mb-2 text-xl text-petroleo-900">{title}</h3>
      {children}
    </div>
  );
}

const List = ({ items }: { items: string[] }) => (
  <ul className="guide-list">
    {items.map((i) => (
      <li key={i}>{i}</li>
    ))}
  </ul>
);

/** Las preguntas que el propio cuento hace al niño o la niña (texto del cuento, sin cambios). */
function storyQuestions(story: Story) {
  return story.scenes.flatMap((sc) =>
    sc.steps.flatMap((st) => {
      switch (st.type) {
        case 'feelings':
          return [{ id: st.id, text: st.prompt, optional: true }];
        case 'know-need':
          return [{ id: st.id, text: st.needPrompt, optional: true }];
        case 'choice':
          return [{ id: st.id, text: st.prompt, optional: false }];
        case 'strategies':
          return [{ id: st.id, text: st.prompt, optional: true }];
        default:
          return [];
      }
    }),
  );
}

const VALIDATION_TEXT: Record<Story['validation']['status'], string> = {
  borrador: 'Borrador: este cuento todavía no ha sido revisado por especialistas.',
  'pendiente-validacion': 'Pendiente de validación pedagógica: el contenido aún se está revisando con especialistas.',
  validado: 'Validado pedagógicamente.',
};

export function AccompanyGuideScreen({ storyId }: { storyId: string }) {
  const story = getStory(storyId);
  if (!story) return null;
  const guide = story.familyGuide;
  const protagonist = protagonistName(story, characters);
  const moments = storyMoments(story, protagonist);
  const questions = storyQuestions(story);
  const start = `/historias/${story.id}?desde=guia`;

  return (
    <Page>
      <div className="mb-4">
        <LinkButton to="/acompanar" variant="ghost" icon="arrow-left">
          Para familias y docentes
        </LinkButton>
      </div>

      <header className="guide-head">
        <Illustration id={story.cover} priority ratio fit="contain" sizes="(min-width: 768px) 300px, 100vw" className="guide-head-art" />
        <div className="flex flex-col gap-3">
          <p className="text-sm font-black tracking-wider text-coral-700 uppercase">Guía para acompañar</p>
          <h1 className="reading-text text-4xl text-petroleo-900 sm:text-5xl">{story.title}</h1>
          <p className="reading-text text-xl">{story.tagline}</p>
          <div className="flex flex-wrap gap-2">
            <Chip icon="user" tone="crema">{story.ages.min}–{story.ages.max} años</Chip>
            <Chip icon="clock" tone="crema">{story.durationMinutes.min}–{story.durationMinutes.max} min · orientativo</Chip>
          </div>
          <div>
            <LinkButton to={start} size="lg" icon="story">
              Empezar el cuento
            </LinkButton>
          </div>
          <p className="text-tinta-suave">El niño o la niña puede recorrerlo sin esta guía. Puedes volver aquí cuando quieras.</p>
        </div>
      </header>

      <AdultNote />

      <p className="reading-text mb-6 text-lg">{guide.intro}</p>

      <section aria-labelledby="moments-title" className="guide-moments">
        <h2 id="moments-title" className="text-2xl text-petroleo-900">
          Cómo se cuenta la historia
        </h2>
        <ol className="mt-3 grid gap-3 md:grid-cols-3">
          {moments.map((m) => (
            <li key={m.id} className="rounded-3xl bg-crema-50 p-4 shadow-[var(--shadow-soft)]">
              <p className="font-black text-coral-700">Momento {m.number}</p>
              <p className="text-lg font-black text-petroleo-900">{m.label}</p>
              <p className="mt-1 text-tinta-suave">{m.scenes.map((s) => s.title).join(' · ')}</p>
            </li>
          ))}
        </ol>
      </section>

      <div className="guide-blocks">
        <Block id="antes" title="Antes del cuento" intro="Qué situación presenta y cómo prepararse.">
          <Part title="Qué situación se presenta">
            <p className="reading-text text-lg">{story.synopsis}</p>
          </Part>
          <Part title="Qué se puede explicar antes de empezar">
            <List items={guide.beforeReading} />
          </Part>
          <Part title="Apoyos que aparecen en el cuento">
            <ul className="guide-supports">
              {story.strategies.map((id) => {
                const t = tools[id];
                return (
                  <li key={id}>
                    <Illustration id={t.illustration} decorative ratio fit="contain" sizes="64px" className="guide-support-art" />
                    <span>
                      <strong className="block text-petroleo-900">{t.name}</strong>
                      <span className="text-tinta-suave">{t.familyTip}</span>
                    </span>
                  </li>
                );
              })}
            </ul>
          </Part>
        </Block>

        <Block id="durante" title="Durante el cuento" intro="Acompañar sin dirigir: cada respuesta es válida.">
          <Part title="Preguntas que hace el propio cuento">
            <ul className="guide-list">
              {questions.map((q) => (
                <li key={q.id}>
                  «{q.text}»{' '}
                  <span className="text-tinta-suave">{q.optional ? '(se puede no responder)' : '(elige una posibilidad; se pueden probar otras)'}</span>
                </li>
              ))}
            </ul>
          </Part>
          <Part title="Cómo acompañar">
            <List items={guide.duringReading} />
          </Part>
          <Part title="Respetar silencios y respuestas diferentes">
            <List items={guide.respectNotes} />
          </Part>
          <Part title="Cuándo parar">
            <List items={guide.pauseSignals} />
          </Part>
        </Block>

        <Block id="despues" title="Después del cuento" intro="Relacionar la historia con la vida diaria, sin prisa.">
          <Part title="Para hablar después">
            <List items={guide.afterReading} />
          </Part>
          <Part title="Ideas para el día a día">
            <ul className="grid gap-3 sm:grid-cols-2">
              {guide.dailyPractice.map((d) => (
                <li key={d.id} className="rounded-3xl bg-crema-50 p-4 shadow-[var(--shadow-soft)]">
                  <strong className="block text-lg text-petroleo-900">{d.title}</strong>
                  <span>{d.text}</span>
                </li>
              ))}
            </ul>
          </Part>
          <Part title="Más ideas">
            <ul className="guide-list">
              {guide.pendingActivities.map((a) => (
                <li key={a.id}>
                  <strong>{a.title}.</strong> {a.text}
                </li>
              ))}
            </ul>
          </Part>
        </Block>
      </div>

      <details className="card group mt-8 p-6">
        <summary className="flex min-h-12 cursor-pointer list-none items-center gap-2 text-2xl font-black text-petroleo-900">
          <Icon name="info" /> Qué trabaja este cuento y en qué se basa
          <Icon name="chevron-right" className="ml-auto transition-transform group-open:rotate-90" />
        </summary>
        <p className="mt-3 font-bold">{VALIDATION_TEXT[story.validation.status]}</p>
        <h3 className="mt-4 text-lg text-petroleo-900">Objetivos</h3>
        <List items={story.objectives.map((o) => o.text)} />
        <h3 className="mt-4 text-lg text-petroleo-900">Fundamentos</h3>
        <p className="text-tinta-suave">Las historias, personajes y actividades son originales. Se indica qué es un fundamento verificado y qué es una propuesta propia pendiente de validar.</p>
        <ul className="mt-3 grid gap-3">
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
                  <a href={ref.url} target="_blank" rel="noreferrer noopener" className="mt-1 inline-flex min-h-12 items-center font-bold text-petroleo-700 underline underline-offset-4">
                    Fuente<span className="sr-only">: {ref.authors} (se abre en otra pestaña)</span>
                  </a>
                )}
              </li>
            );
          })}
        </ul>
      </details>

      <section className="guide-start mt-8 flex flex-col items-start gap-3 rounded-[var(--radius-card)] bg-petroleo-50 p-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="reading-text text-lg font-bold text-petroleo-900">¿Listos? El niño o la niña elige si lo lee como cuento o como cómic.</p>
        <LinkButton to={start} size="lg" icon="story">
          Empezar el cuento
        </LinkButton>
      </section>

      <div className="mt-6 flex flex-wrap items-center gap-3 text-tinta-suave">
        <p>Las preferencias de lectura y el punto del cuento se guardan solo en este dispositivo. Se pueden borrar en Ajustes.</p>
        <LinkButton to="/ajustes" variant="ghost" icon="settings">
          Ir a Ajustes
        </LinkButton>
      </div>
    </Page>
  );
}

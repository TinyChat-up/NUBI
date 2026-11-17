// FUERA DE LA NAVEGACIÓN desde la fase 19 (NUBI = cuentos sociales). Se conserva sin borrar por si sus
// piezas se reutilizan dentro de las historias; no tiene ruta. Ver docs/product/REMOVED_NAVIGATION.md.
import { useEffect, useRef, useState } from 'react';
import { getTool, toolList } from '../../content/tools.ts';
import { Icon } from '../../components/Icon.tsx';
import { Illustration } from '../../components/Illustration.tsx';
import { Button, LinkButton, Page, PageHeader, toneBg, toneText } from '../../components/ui.tsx';
import { Link } from '../../lib/router.tsx';
import { useNarration } from '../../lib/useNarration.ts';
import { useProgress } from '../../state/progress.tsx';

/** G. MIS HERRAMIENTAS — biblioteca visual de estrategias. */
export function ToolsScreen() {
  const { progress } = useProgress();
  return (
    <Page>
      <PageHeader title="Mis herramientas" subtitle="Ideas que pueden ayudar. No todas sirven a todo el mundo." icon="backpack" />
      <ul className="tool-gallery">
        {toolList.map((t) => {
          const practiced = Boolean(progress.toolsPracticed[t.id]);
          const chosen = progress.toolsChosen.includes(t.id);
          return (
            <li key={t.id} >
              <Link to={`/herramientas/${t.id}`} className="tap tool-entry">
                <Illustration id={t.illustration} decorative sizes="(min-width: 640px) 208px, 144px" className="tool-art" />
                <span className="flex min-w-0 flex-1 flex-col gap-2">
                  <span className="text-xl font-black text-petroleo-900">{t.name}</span>
                  <span className="reading-text text-tinta-suave">{t.childText}</span>
                  <span className="mt-1 flex flex-wrap gap-1.5">
                    {practiced && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-salvia-100 px-2.5 py-0.5 text-sm font-bold text-salvia-700">
                        <Icon name="check" size={14} strokeWidth={3} /> La he probado
                      </span>
                    )}
                    {chosen && !practiced && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-mostaza-100 px-2.5 py-0.5 text-sm font-bold text-mostaza-700">
                        <Icon name="star" size={14} /> Me podría ayudar
                      </span>
                    )}
                  </span>
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </Page>
  );
}

function CardDialog({ text, open, onClose }: { text: string; open: boolean; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);
  return (
    <dialog
      ref={ref}
      onClose={onClose}
      aria-label="Tarjeta para enseñar"
      className="m-0 h-dvh max-h-none w-screen max-w-none bg-petroleo-800 p-0 text-crema-50 backdrop:bg-petroleo-900"
    >
      <div className="flex h-full flex-col items-center justify-center gap-10 p-6 text-center">
        <p className="reading-text text-[clamp(2.5rem,9vw,6rem)] leading-tight font-black">{text}</p>
        <Button variant="secondary" size="lg" icon="close" onClick={onClose}>
          Cerrar tarjeta
        </Button>
      </div>
    </dialog>
  );
}

export function ToolDetailScreen({ toolId }: { toolId: string }) {
  const tool = getTool(toolId);
  const { progress, markToolPracticed } = useProgress();
  const narration = useNarration();
  const [cardOpen, setCardOpen] = useState(false);
  if (!tool) return null;
  const practiced = Boolean(progress.toolsPracticed[tool.id]);

  return (
    <Page>
      <div className="mb-4">
        <LinkButton to="/herramientas" variant="ghost" icon="arrow-left">
          Mis herramientas
        </LinkButton>
      </div>

      <section className={`tool-detail-opening grid gap-6 overflow-hidden rounded-[var(--radius-card)] p-6 sm:grid-cols-[auto_1fr] sm:items-center sm:p-8 ${toneBg[tool.color]}`}>
        <Illustration id={tool.illustration} priority sizes="(min-width: 640px) 288px, 208px" className="tool-detail-art mx-auto size-52 sm:size-72" />
        <div>
          <h1 className={`text-4xl sm:text-5xl ${toneText[tool.color]}`}>{tool.name}</h1>
          <p className="reading-text mt-3 text-xl font-bold">{tool.childText}</p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Button icon="card" onClick={() => setCardOpen(true)}>
              Mi tarjeta
            </Button>
            <Button variant={practiced ? 'soft' : 'secondary'} icon={practiced ? 'check' : 'star'} aria-pressed={practiced} onClick={() => markToolPracticed(tool.id, !practiced)}>
              {practiced ? 'La he probado' : 'Marcar: la he probado'}
            </Button>
          </div>
        </div>
      </section>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <section className="card p-6">
          <h2 className="mb-4 text-2xl text-petroleo-900">Cómo hacerlo</h2>
          <ol className="grid gap-3">
            {tool.steps.map((s, i) => (
              <li key={s} className="flex items-start gap-3">
                <span className="grid size-9 shrink-0 place-items-center rounded-full bg-petroleo-600 font-black text-crema-50">{i + 1}</span>
                <span className="reading-text pt-1 text-lg">{s}</span>
              </li>
            ))}
          </ol>
        </section>

        <section className="card p-6">
          <h2 className="mb-4 text-2xl text-petroleo-900">Frases que puedes usar</h2>
          <ul className="grid gap-2">
            {tool.phrases.map((ph) => (
              <li key={ph} className="flex items-center gap-2 rounded-2xl bg-crema-100 p-2 pl-4">
                <span className="reading-text flex-1 text-lg font-bold">«{ph}»</span>
                {narration.available && (
                  <button type="button" onClick={() => narration.speak(ph)} className="tap grid size-12 place-items-center rounded-full text-petroleo-700 hover:bg-petroleo-100" aria-label={`Escuchar: ${ph}`}>
                    <Icon name="volume" />
                  </button>
                )}
              </li>
            ))}
          </ul>
        </section>

        <section className="card p-6">
          <h2 className="mb-4 text-2xl text-petroleo-900">Formas de hacerlo</h2>
          <ul className="flex flex-wrap gap-2">
            {tool.ways.map((w) => (
              <li key={w} className="reading-text rounded-full bg-salvia-100 px-4 py-2 font-bold text-salvia-700">
                {w}
              </li>
            ))}
          </ul>
          <p className="reading-text mt-5 flex gap-2 rounded-2xl bg-mostaza-50 p-4 text-lg">
            <Icon name="info" className="mt-1 shrink-0 text-mostaza-700" /> {tool.note}
          </p>
        </section>

        <details className="card group p-6">
          <summary className="flex min-h-12 cursor-pointer list-none items-center gap-2 text-xl font-black text-petroleo-900">
            <Icon name="grown" /> Para personas adultas
            <Icon name="chevron-right" className="ml-auto transition-transform group-open:rotate-90" />
          </summary>
          <p className="reading-text mt-3 text-lg">{tool.familyTip}</p>
        </details>
      </div>

      <CardDialog text={tool.card} open={cardOpen} onClose={() => setCardOpen(false)} />
    </Page>
  );
}

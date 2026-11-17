// FUERA DE LA NAVEGACIÓN desde la fase 19 (NUBI = cuentos sociales). Se conserva sin borrar por si sus
// piezas se reutilizan dentro de las historias; no tiene ruta. Ver docs/product/REMOVED_NAVIGATION.md.
import { useState } from 'react';
import { emotionList } from '../../content/emotions.ts';
import { tools } from '../../content/tools.ts';
import type { EmotionId } from '../../engine/types.ts';
import { Icon } from '../../components/Icon.tsx';
import { EmotionArt } from '../../components/illustration/GuideArt.tsx';
import { LinkButton, Page, PageHeader } from '../../components/ui.tsx';
import { Link } from '../../lib/router.tsx';


/** Mis emociones: conocer lo que sentimos. Todas las emociones son válidas. */
export function EmotionsScreen() {
  const [selected, setSelected] = useState<EmotionId>('sorpresa');
  const emotion = emotionList.find((e) => e.id === selected)!;

  return (
    <Page>
      <div className="mb-4">
        <LinkButton to="/mundo" variant="ghost" icon="arrow-left">
          Mi mundo
        </LinkButton>
      </div>
      <PageHeader title="Mis emociones" subtitle="Todas las emociones son válidas. Cada persona las siente a su manera." icon="heart" />

      <div className="emotion-explorer">
        <div role="group" aria-label="Emociones" className="emotion-gallery">
          {emotionList.map((e) => {
            const on = e.id === selected;
            return (
              <button
                key={e.id}
                type="button"
                aria-pressed={on}
                onClick={() => setSelected(e.id)}
                className={`tap emotion-entry relative flex flex-col items-center gap-1 rounded-3xl border-[3px] p-3 font-extrabold ${on ? 'border-petroleo-600 bg-crema-50' : 'border-crema-300 bg-crema-50'}`}
              >
                <EmotionArt emotion={e.id} mood={e.mood} size={96} className="emotion-art" />
                <span className="reading-text text-center leading-tight">{e.name}</span>
                <span aria-hidden className="emotion-check">{on && <Icon name="check" size={20} />}</span>
              </button>
            );
          })}
        </div>

        <section aria-live="polite" className="emotion-detail card animate-pop p-6" key={emotion.id}>
          <div className="flex items-center gap-4">
            <EmotionArt emotion={emotion.id} mood={emotion.mood} size={120} />
            <div>
              <h2 className="text-3xl text-petroleo-900">{emotion.name}</h2>
              <p className="reading-text text-lg">{emotion.childText}</p>
            </div>
          </div>
          <h3 className="mt-6 mb-3 text-xl text-petroleo-900">Puede notarse así</h3>
          <ul className="grid gap-2">
            {emotion.mayFeelLike.map((f) => (
              <li key={f} className="reading-text flex items-center gap-3 rounded-2xl bg-crema-100 px-4 py-3 text-lg font-bold">
                <Icon name={emotion.icon} size={20} className="shrink-0 text-coral-700" /> {f}
              </li>
            ))}
          </ul>
          <p className="reading-text mt-3 text-tinta-suave">A cada persona le pasa de una forma distinta. A veces, de ninguna de estas.</p>
          <h3 className="mt-6 mb-3 text-xl text-petroleo-900">Herramientas que pueden ayudar</h3>
          <ul className="flex flex-wrap gap-2">
            {emotion.tools.map((id) => (
              <li key={id}>
                <Link to={`/herramientas/${id}`} className="tap inline-flex min-h-12 items-center gap-2 rounded-full bg-petroleo-100 px-4 font-bold text-petroleo-800 hover:bg-petroleo-200">
                  <Icon name={tools[id].icon} size={20} /> {tools[id].name}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </Page>
  );
}

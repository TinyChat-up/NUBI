import { useState } from 'react';
import { placeList } from '../content/places.ts';
import { storyList } from '../content/stories/index.ts';
import type { PlaceId } from '../engine/types.ts';
import { Icon } from '../components/Icon.tsx';
import { GuideArt } from '../components/illustration/GuideArt.tsx';
import { StoryCard } from '../components/StoryCard.tsx';
import { Page, PageHeader } from '../components/ui.tsx';

/** C. HISTORIAS — catálogo en tarjetas ilustradas. */
export function StoriesScreen() {
  const [filter, setFilter] = useState<PlaceId | 'todas'>('todas');
  const storyPlaces = placeList.filter((p) => p.kind === 'stories');
  const list = filter === 'todas' ? storyList : storyList.filter((s) => s.place === filter);

  return (
    <Page>
      <PageHeader title="Historias" subtitle="Cuentos, cómics y vídeos para explorar sin prisa." icon="story" />

      <div role="group" aria-label="Filtrar por lugar" className="mb-6 flex flex-wrap gap-2">
        {[{ id: 'todas' as const, name: 'Todas', icon: 'sparkle' }, ...storyPlaces].map((p) => {
          const on = filter === p.id;
          return (
            <button
              key={p.id}
              type="button"
              aria-pressed={on}
              onClick={() => setFilter(p.id)}
              className={`tap flex min-h-12 shrink-0 items-center gap-2 rounded-full px-5 font-extrabold ${on ? 'bg-petroleo-600 text-crema-50' : 'bg-crema-50 text-petroleo-800 shadow-[var(--shadow-soft)]'}`}
            >
              <Icon name={p.icon} size={20} /> {p.name}
            </button>
          );
        })}
      </div>

      <ul className="story-shelf">
        {list.map((s) => (
          <li key={s.id}>
            <StoryCard story={s} />
          </li>
        ))}
        <li className="coming-stories flex min-h-64 flex-col items-center justify-center gap-3 rounded-[var(--radius-card)] border-[3px] border-dashed border-crema-300 p-6 text-center text-tinta-suave">
          <GuideArt size={80} mood="calm" />
          <p className="reading-text text-lg font-bold">Más historias en camino</p>
          <p className="reading-text text-sm">Las preparamos con calma y con ayuda de familias y docentes.</p>
        </li>
      </ul>
    </Page>
  );
}

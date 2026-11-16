import { placeList, places } from '../content/places.ts';
import { storiesByPlace } from '../content/stories/index.ts';
import type { Place, PlaceId } from '../engine/types.ts';
import { Icon } from '../components/Icon.tsx';
import { Illustration } from '../components/Illustration.tsx';
import { GuideArt } from '../components/illustration/GuideArt.tsx';
import { StoryCard } from '../components/StoryCard.tsx';
import { LinkButton, Page, PageHeader, toneBg, toneText } from '../components/ui.tsx';
import { Link } from '../lib/router.tsx';

const placeHref = (place: Place) => (place.kind === 'emotions' ? '/emociones' : place.kind === 'tools' ? '/herramientas' : `/mundo/${place.id}`);

function placeStatus(place: Place): string {
  if (place.kind === 'emotions') return 'Conocer emociones';
  if (place.kind === 'tools') return '7 herramientas';
  const n = storiesByPlace(place.id).length;
  return n === 0 ? 'Próximamente' : n === 1 ? '1 historia' : `${n} historias`;
}

/** B. MI MUNDO — biblioteca de escenarios. */
export function WorldScreen() {
  return (
    <Page>
      <PageHeader title="Mi mundo" subtitle="¿Adónde quieres ir hoy?" icon="map" />
      <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {placeList.map((place, i) => {
          const soon = placeStatus(place) === 'Próximamente';
          return (
            <li key={place.id} className="animate-rise" style={{ animationDelay: `${i * 60}ms` }}>
              <Link to={placeHref(place)} className="tap card group block h-full overflow-hidden hover:shadow-[var(--shadow-lift)]">
                <Illustration id={place.illustration} decorative sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" className="aspect-[4/3] w-full transition-transform duration-500 group-hover:scale-[1.02]" />
                <div className="flex items-center gap-4 p-5">
                  <span className={`grid size-14 shrink-0 place-items-center rounded-2xl ${toneBg[place.color]} ${toneText[place.color]}`}>
                    <Icon name={place.icon} size={28} />
                  </span>
                  <span className="flex-1">
                    <span className="block text-2xl font-black text-petroleo-900">{place.name}</span>
                    <span className="reading-text block text-tinta-suave">{place.description}</span>
                  </span>
                </div>
                <span className={`mx-5 mb-5 inline-flex rounded-full px-3 py-1 text-sm font-bold ${soon ? 'bg-crema-200 text-tinta-suave' : 'bg-salvia-100 text-salvia-700'}`}>
                  {placeStatus(place)}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </Page>
  );
}

/** Página de un lugar: sus historias, o un aviso honesto si aún no hay. */
export function PlaceScreen({ placeId }: { placeId: string }) {
  const place = places[placeId as PlaceId];
  if (!place) return null;
  const list = storiesByPlace(place.id);

  return (
    <Page>
      <div className="mb-4">
        <LinkButton to="/mundo" variant="ghost" icon="arrow-left">
          Mi mundo
        </LinkButton>
      </div>
      <PageHeader title={place.name} subtitle={place.description} icon={place.icon} />
      {list.length > 0 ? (
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((s) => (
            <li key={s.id}>
              <StoryCard story={s} />
            </li>
          ))}
        </ul>
      ) : (
        <div className="card mx-auto flex max-w-xl flex-col items-center gap-4 p-8 text-center">
          <GuideArt mood="calm" size={120} />
          <h2 className="text-2xl text-petroleo-900">Aquí todavía no hay historias</h2>
          <p className="reading-text text-lg">Las estamos preparando con calma. Mientras tanto, puedes visitar el colegio.</p>
          <LinkButton to="/mundo/colegio" icon="school">
            Ir al colegio
          </LinkButton>
        </div>
      )}
    </Page>
  );
}

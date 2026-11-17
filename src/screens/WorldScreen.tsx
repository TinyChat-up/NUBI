import { placeList, places } from '../content/places.ts';
import { storiesByPlace } from '../content/stories/index.ts';
import type { Place, PlaceId } from '../engine/types.ts';
import { Icon } from '../components/Icon.tsx';
import { Illustration } from '../components/Illustration.tsx';
import { GuideArt } from '../components/illustration/GuideArt.tsx';
import { StoryCard } from '../components/StoryCard.tsx';
import { LinkButton, Page, PageHeader } from '../components/ui.tsx';
import { Link } from '../lib/router.tsx';

const placeHref = (place: Place) => (place.kind === 'emotions' ? '/emociones' : place.kind === 'tools' ? '/herramientas' : `/mundo/${place.id}`);

function placeStatus(place: Place): string {
  if (place.kind === 'emotions') return 'Conocer emociones';
  if (place.kind === 'tools') return '7 herramientas';
  const n = storiesByPlace(place.id).length;
  return n === 0 ? 'Próximamente' : n === 1 ? '1 historia' : `${n} historias`;
}

/** B. MI MUNDO — biblioteca de escenarios. */
function PlaceEntry({ place, featured = false, pending = false }: { place: Place; featured?: boolean; pending?: boolean }) {
  return (
    <Link to={placeHref(place)} className={`tap place-entry ${featured ? 'place-featured' : ''} ${pending ? 'place-pending' : ''}`}>
      <Illustration id={place.illustration} decorative ratio fit="contain" priority={featured} sizes={pending ? '(min-width: 640px) 28vw, 120px' : featured ? '(min-width: 640px) 52vw, 100vw' : '(min-width: 640px) 44vw, 100vw'} className="place-picture" />
      <span className="place-caption">
        <span className="place-title reading-text">{place.name}<Icon name={pending ? 'clock' : 'arrow-right'} size={24} /></span>
        <span className="reading-text place-description">{place.description}</span>
        <span className={`place-status ${pending ? '' : 'place-status-ready'}`}>{placeStatus(place)}</span>
      </span>
    </Link>
  );
}

export function WorldScreen() {
  const available = placeList.filter((p) => p.kind === 'stories' && storiesByPlace(p.id).length > 0);
  const companions = placeList.filter((p) => p.kind !== 'stories');
  const upcoming = placeList.filter((p) => p.kind === 'stories' && storiesByPlace(p.id).length === 0);
  return (
    <Page className="world-page">
      <PageHeader title="Mi mundo" subtitle="¿Adónde quieres ir hoy?">
        <GuideArt size={88} />
      </PageHeader>
      <ul className="world-stories">
        {available.map((place) => <li key={place.id}><PlaceEntry place={place} featured /></li>)}
      </ul>
      <ul className="world-companions">
        {companions.map((place) => <li key={place.id}><PlaceEntry place={place} /></li>)}
      </ul>
      <section aria-labelledby="upcoming-places" className="world-upcoming">
        <h2 id="upcoming-places" className="text-2xl text-petroleo-900">Próximamente</h2>
        <ul>{upcoming.map((place) => <li key={place.id}><PlaceEntry place={place} pending /></li>)}</ul>
      </section>
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
        <ul className="story-shelf">
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

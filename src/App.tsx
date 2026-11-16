import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { AppShell } from './components/AppShell.tsx';
import { Nubi } from './components/Nubi.tsx';
import { LinkButton, Page } from './components/ui.tsx';
import { places } from './content/places.ts';
import { getStory } from './content/stories/index.ts';
import { getTool } from './content/tools.ts';
import { matchPath, useLocation, useRouteFocus } from './lib/router.tsx';
import { EmotionsScreen } from './screens/EmotionsScreen.tsx';
import { FamilyScreen } from './screens/FamilyScreen.tsx';
import { HomeScreen } from './screens/HomeScreen.tsx';
import { PlayerScreen, VideoScreen } from './screens/PlayerScreens.tsx';
import { RecreationPlayScreen, RecreationsScreen } from './screens/RecreationsScreen.tsx';
import { SettingsScreen } from './screens/SettingsScreen.tsx';
import { StoriesScreen } from './screens/StoriesScreen.tsx';
import { StoryDetailScreen } from './screens/StoryDetailScreen.tsx';
import { ToolDetailScreen, ToolsScreen } from './screens/ToolsScreen.tsx';
import { PlaceScreen, WorldScreen } from './screens/WorldScreen.tsx';

interface Route {
  pattern: string;
  title: string;
  chrome?: boolean;
  /** Si devuelve false, se muestra "Este camino no existe". */
  exists?: (params: Record<string, string>) => boolean;
  render: (params: Record<string, string>) => ReactNode;
}

const storyExists = (p: Record<string, string>) => Boolean(getStory(p.id));

const routes: Route[] = [
  { pattern: '/', title: 'NUBI · Un mundo de historias por descubrir', chrome: false, render: () => <HomeScreen /> },
  { pattern: '/mundo', title: 'Mi mundo', render: () => <WorldScreen /> },
  { pattern: '/mundo/:place', title: 'Mi mundo', exists: (p) => p.place in places, render: (p) => <PlaceScreen placeId={p.place} /> },
  { pattern: '/historias', title: 'Historias', render: () => <StoriesScreen /> },
  { pattern: '/historias/:id', title: 'Historia', exists: storyExists, render: (p) => <StoryDetailScreen storyId={p.id} /> },
  { pattern: '/historias/:id/cuento', title: 'Cuento', chrome: false, exists: storyExists, render: (p) => <PlayerScreen storyId={p.id} format="cuento" /> },
  { pattern: '/historias/:id/comic', title: 'Cómic', chrome: false, exists: (p) => Boolean(getStory(p.id)?.formats.includes('comic')), render: (p) => <PlayerScreen storyId={p.id} format="comic" /> },
  { pattern: '/historias/:id/video', title: 'Vídeo', exists: (p) => Boolean(getStory(p.id)?.video), render: (p) => <VideoScreen storyId={p.id} /> },
  { pattern: '/recreaciones', title: 'Recreaciones', render: () => <RecreationsScreen /> },
  { pattern: '/recreaciones/:story/:rec', title: 'Recreación', exists: (p) => Boolean(getStory(p.story)?.recreations.some((r) => r.id === p.rec)), render: (p) => <RecreationPlayScreen storyId={p.story} recId={p.rec} /> },
  { pattern: '/herramientas', title: 'Mis herramientas', render: () => <ToolsScreen /> },
  { pattern: '/herramientas/:id', title: 'Herramienta', exists: (p) => Boolean(getTool(p.id)), render: (p) => <ToolDetailScreen toolId={p.id} /> },
  { pattern: '/emociones', title: 'Mis emociones', render: () => <EmotionsScreen /> },
  { pattern: '/familias', title: 'Espacio familiar', render: () => <FamilyScreen /> },
  { pattern: '/ajustes', title: 'Ajustes', render: () => <SettingsScreen /> },
];

function NotFound() {
  return (
    <Page>
      <div className="card mx-auto flex max-w-lg flex-col items-center gap-4 p-8 text-center">
        <Nubi mood="thinking" size={130} />
        <h1 className="text-3xl text-petroleo-900">Este camino no existe</h1>
        <p className="text-lg">Volvamos a un lugar conocido.</p>
        <LinkButton to="/mundo" icon="map">
          Ir a Mi mundo
        </LinkButton>
      </div>
    </Page>
  );
}

export function App() {
  const { path } = useLocation();
  useRouteFocus(path);

  let content: ReactNode = null;
  let route: Route | undefined;
  for (const r of routes) {
    const params = matchPath(r.pattern, path);
    if (params && (!r.exists || r.exists(params))) {
      route = r;
      content = r.render(params);
      break;
    }
  }
  if (!route) content = <NotFound />;

  useEffect(() => {
    document.title = route && route.pattern !== '/' ? `${route.title} · NUBI` : 'NUBI · Un mundo de historias por descubrir';
  }, [route]);

  return <AppShell chrome={route?.chrome ?? true}>{content}</AppShell>;
}

import type { ReactNode } from 'react';
import { Suspense, lazy, useEffect } from 'react';
import { AppShell } from './components/AppShell.tsx';
import { GuideArt } from './components/illustration/GuideArt.tsx';
import { LinkButton, Page } from './components/ui.tsx';
import { getStory } from './content/stories/index.ts';
import { getTool } from './content/tools.ts';
import { matchPath, useLocation, useRouteFocus } from './lib/router.tsx';
import { AccompanyGuideScreen, AccompanyScreen } from './screens/AccompanyScreen.tsx';
import { HomeScreen } from './screens/HomeScreen.tsx';
import { MovedScreen, type MovedInfo } from './screens/MovedScreen.tsx';
import { PlayerScreen, VideoScreen } from './screens/PlayerScreens.tsx';
import { SettingsScreen } from './screens/SettingsScreen.tsx';
import { StoriesScreen } from './screens/StoriesScreen.tsx';
import { StoryDetailScreen } from './screens/StoryDetailScreen.tsx';

interface Route {
  pattern: string;
  title: string;
  chrome?: boolean;
  /** Si devuelve false, se muestra "Este camino no existe". */
  exists?: (params: Record<string, string>) => boolean;
  render: (params: Record<string, string>) => ReactNode;
}

// Solo desarrollo: importación diferida; no entra en el paquete de producción.
const DevPlayer = import.meta.env.DEV ? lazy(() => import('./screens/DevScreens.tsx').then((m) => ({ default: m.DevPlayer }))) : null;
const DevIndex = import.meta.env.DEV ? lazy(() => import('./screens/DevScreens.tsx').then((m) => ({ default: m.DevIndex }))) : null;

const storyExists = (p: Record<string, string>) => Boolean(getStory(p.id));

/**
 * NUBI tiene dos funciones (fase 19): DESCUBRIR UN CUENTO (`/historias`) y ACOMPAÑAR UN CUENTO
 * (`/acompanar`). Ajustes es una utilidad. Todo lo demás son rutas antiguas que explican a dónde
 * ir, sin redirigir por sorpresa (docs/product/REMOVED_NAVIGATION.md).
 */
const DISCOVER = { to: '/historias', action: 'Descubrir un cuento', icon: 'story' };
const ACCOMPANY = { to: '/acompanar', action: 'Para familias y docentes', icon: 'grown' };

const moved = (info: MovedInfo) => <MovedScreen info={info} />;

function FamilyMoved() {
  const { query } = useLocation();
  const story = getStory(query.get('historia') ?? '');
  return moved({
    was: 'Espacio familiar',
    text: 'Ahora se llama «Para familias y docentes». Tiene una guía breve para acompañar cada cuento, sin registros ni puntuaciones.',
    ...ACCOMPANY,
    to: story ? `/acompanar/${story.id}` : ACCOMPANY.to,
    action: story ? `Guía de «${story.title}»` : ACCOMPANY.action,
  });
}

const routes: Route[] = [
  { pattern: '/', title: 'NUBI · Cuentos sociales interactivos', chrome: false, render: () => <HomeScreen /> },

  // A. Descubrir un cuento
  { pattern: '/historias', title: 'Cuentos', render: () => <StoriesScreen /> },
  { pattern: '/historias/:id', title: 'Cuento', exists: storyExists, render: (p) => <StoryDetailScreen storyId={p.id} /> },
  { pattern: '/historias/:id/cuento', title: 'Cuento', chrome: false, exists: storyExists, render: (p) => <PlayerScreen storyId={p.id} format="cuento" /> },
  { pattern: '/historias/:id/comic', title: 'Cómic', chrome: false, exists: (p) => Boolean(getStory(p.id)?.formats.includes('comic')), render: (p) => <PlayerScreen storyId={p.id} format="comic" /> },
  { pattern: '/historias/:id/video', title: 'Vídeo', exists: (p) => Boolean(getStory(p.id)?.video), render: (p) => <VideoScreen storyId={p.id} /> },

  // B. Acompañar un cuento
  { pattern: '/acompanar', title: 'Para familias y docentes', render: () => <AccompanyScreen /> },
  { pattern: '/acompanar/:id', title: 'Guía para acompañar', exists: storyExists, render: (p) => <AccompanyGuideScreen storyId={p.id} /> },

  // Utilidad
  { pattern: '/ajustes', title: 'Ajustes', render: () => <SettingsScreen /> },

  // Rutas antiguas (fase 18 y anteriores): explican el cambio y ofrecen un destino nuevo.
  { pattern: '/mundo', title: 'NUBI ha cambiado', render: () => moved({ was: 'Mi mundo', text: 'Ahora todos los cuentos están en un mismo lugar. Elige uno y descubre qué pasa.', ...DISCOVER }) },
  { pattern: '/mundo/:place', title: 'NUBI ha cambiado', render: () => moved({ was: 'Mi mundo', text: 'Ahora todos los cuentos están en un mismo lugar. Elige uno y descubre qué pasa.', ...DISCOVER }) },
  { pattern: '/recreaciones', title: 'NUBI ha cambiado', render: () => moved({ was: 'Recreaciones', text: 'Ahora las decisiones se exploran dentro de cada cuento. Puedes probar todas las que quieras.', ...DISCOVER }) },
  {
    pattern: '/recreaciones/:story/:rec',
    title: 'NUBI ha cambiado',
    render: (p) => {
      const story = getStory(p.story);
      const rec = story?.recreations.find((r) => r.id === p.rec);
      return moved({
        was: 'Recreaciones',
        text: 'Ahora las decisiones se exploran dentro de cada cuento. Puedes probar todas las que quieras.',
        ...(story && rec ? { to: `/historias/${story.id}/cuento?escena=${rec.sceneId}`, action: `Ir a las decisiones de «${story.title}»`, icon: 'footsteps' } : DISCOVER),
      });
    },
  },
  { pattern: '/emociones', title: 'NUBI ha cambiado', render: () => moved({ was: 'Mis emociones', text: 'Ahora las emociones se descubren dentro de los cuentos, cuando el personaje vive algo.', ...DISCOVER }) },
  { pattern: '/herramientas', title: 'NUBI ha cambiado', render: () => moved({ was: 'Mis herramientas', text: 'Ahora los apoyos aparecen dentro de los cuentos, cuando pueden ayudar a un personaje.', ...DISCOVER, also: ACCOMPANY }) },
  {
    pattern: '/herramientas/:id',
    title: 'NUBI ha cambiado',
    render: (p) => {
      const tool = getTool(p.id);
      return moved({ was: tool ? `Mis herramientas · ${tool.name}` : 'Mis herramientas', text: 'Ahora los apoyos aparecen dentro de los cuentos, cuando pueden ayudar a un personaje.', ...DISCOVER, also: ACCOMPANY });
    },
  },
  { pattern: '/familias', title: 'NUBI ha cambiado', render: () => <FamilyMoved /> },

  // Solo desarrollo (fases 21–22): historias de prueba y revisión. No existen en producción.
  ...(import.meta.env.DEV && DevPlayer && DevIndex
    ? [
        { pattern: '/dev', title: 'Historias de desarrollo', chrome: false, render: () => <Suspense fallback={null}><DevIndex /></Suspense> },
        { pattern: '/dev/libro-de-trenes/cuento', title: 'El libro de trenes (desarrollo)', chrome: false, render: () => <Suspense fallback={null}><DevPlayer storyId="libro-de-trenes" format="cuento" /></Suspense> },
        { pattern: '/dev/historia-ramificada/cuento', title: 'Prueba técnica', chrome: false, render: () => <Suspense fallback={null}><DevPlayer storyId="prueba-ramificada" format="cuento" /></Suspense> },
        { pattern: '/dev/historia-ramificada/comic', title: 'Prueba técnica', chrome: false, render: () => <Suspense fallback={null}><DevPlayer storyId="prueba-ramificada" format="comic" /></Suspense> },
      ]
    : []),
];

function NotFound() {
  return (
    <Page>
      <div className="card mx-auto flex max-w-lg flex-col items-center gap-4 p-8 text-center">
        <GuideArt mood="thinking" size={130} />
        <h1 className="text-3xl text-petroleo-900">Este camino no existe</h1>
        <p className="text-lg">Volvamos a un lugar conocido.</p>
        <LinkButton to="/" icon="home">
          Ir al inicio
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
    document.title = route && route.pattern !== '/' ? `${route.title} · NUBI` : 'NUBI · Cuentos sociales interactivos';
  }, [route]);

  return <AppShell chrome={route?.chrome ?? true}>{content}</AppShell>;
}

import { getStory } from '../content/stories/index.ts';
import { StoryPlayer } from '../components/player/StoryPlayer.tsx';
import { VideoPlayer } from '../components/video/VideoPlayer.tsx';
import { LinkButton, Page, PageHeader } from '../components/ui.tsx';
import { useLocation } from '../lib/router.tsx';

/** D. REPRODUCTOR DE CUENTOS y E. CÓMIC INTERACTIVO (mismo motor, distinta presentación). */
export function PlayerScreen({ storyId, format }: { storyId: string; format: 'cuento' | 'comic' }) {
  const story = getStory(storyId);
  const { query } = useLocation();
  if (!story || !story.formats.includes(format)) return null;
  const start = query.get('escena') ?? undefined;
  const validStart = start && story.scenes.some((s) => s.id === start) ? start : undefined;
  return (
    <StoryPlayer
      key={`${story.id}-${format}-${validStart ?? ''}`}
      story={story}
      format={format}
      startSceneId={validStart}
      resume={query.get('continuar') === '1' && !validStart}
    />
  );
}

/** Formato vídeo (MP4/WebM + subtítulos). */
export function VideoScreen({ storyId }: { storyId: string }) {
  const story = getStory(storyId);
  if (!story?.video) return null;
  return (
    <Page>
      <div className="mb-4">
        <LinkButton to={`/historias/${story.id}`} variant="ghost" icon="arrow-left">
          {story.title}
        </LinkButton>
      </div>
      <PageHeader title={story.title} subtitle="Vídeo con subtítulos" icon="film" />
      <VideoPlayer story={story} video={story.video} />
    </Page>
  );
}

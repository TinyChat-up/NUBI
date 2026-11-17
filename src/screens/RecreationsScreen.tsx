import { useState } from 'react';
import { characters } from '../content/characters.ts';
import { getStory, storyList } from '../content/stories/index.ts';
import { getChoiceStep } from '../engine/storyEngine.ts';
import type { ChoiceOption } from '../engine/types.ts';
import { Illustration } from '../components/Illustration.tsx';
import { GuideArt } from '../components/illustration/GuideArt.tsx';
import { ChoiceGrid, ConsequenceBody, ExploredMeter } from '../components/player/interactions.tsx';
import { Button, LinkButton, Page, PageHeader } from '../components/ui.tsx';
import { Link } from '../lib/router.tsx';
import { useProgress } from '../state/progress.tsx';
import { useSettings } from '../state/settings.tsx';

const recKey = (storyId: string, recId: string) => `${storyId}/${recId}`;

/** F. RECREACIONES — escenas para elegir actuaciones y descubrir consecuencias. */
export function RecreationsScreen() {
  const { progress } = useProgress();
  const items = storyList.flatMap((story) => story.recreations.map((rec) => ({ story, rec })));

  return (
    <Page>
      <PageHeader title="Recreaciones" subtitle="Elige qué hacer y descubre qué puede pasar." icon="footsteps" />
      <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {items.map(({ story, rec }) => {
          const total = getChoiceStep(story, rec.choiceStepId)?.options.length ?? 0;
          const explored = progress.recreations[recKey(story.id, rec.id)]?.length ?? 0;
          return (
            <li key={rec.id}>
              <Link to={`/recreaciones/${story.id}/${rec.id}`} className="tap card flex h-full flex-col overflow-hidden hover:shadow-[var(--shadow-lift)]">
                <Illustration id={rec.cover} decorative ratio sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" className="w-full" />
                <div className="flex flex-1 flex-col gap-2 p-5">
                  <p className="text-sm font-black tracking-wider text-coral-700 uppercase">{story.title}</p>
                  <h2 className="text-2xl text-petroleo-900">{rec.title}</h2>
                  <p className="reading-text flex-1 text-tinta-suave">{rec.description}</p>
                  <div className="mt-2">
                    <ExploredMeter total={total} explored={explored} />
                  </div>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </Page>
  );
}

export function RecreationPlayScreen({ storyId, recId }: { storyId: string; recId: string }) {
  const story = getStory(storyId);
  const rec = story?.recreations.find((r) => r.id === recId);
  const step = story && rec ? getChoiceStep(story, rec.choiceStepId) : undefined;
  const { progress, recordRecreation } = useProgress();
  const { settings: { shortText } } = useSettings();
  const [option, setOption] = useState<ChoiceOption | null>(null);

  if (!story || !rec || !step) return null;
  const key = recKey(story.id, rec.id);
  const explored = progress.recreations[key] ?? [];
  const allDone = explored.length >= step.options.length;

  const choose = (o: ChoiceOption) => {
    setOption(o);
    recordRecreation(key, [o.id]);
    window.scrollTo({ top: 0 });
  };

  return (
    <Page>
      <div className="mb-4">
        <LinkButton to="/recreaciones" variant="ghost" icon="arrow-left">
          Recreaciones
        </LinkButton>
      </div>
      <PageHeader title={rec.title} subtitle={`De la historia «${story.title}»`} icon="footsteps" />

      {!option ? (
        <>
          <div className="card mb-6 flex flex-col items-center gap-4 p-5 sm:flex-row">
            <GuideArt mood="thinking" size={90} />
            <p className="reading-text text-lg">{rec.intro}</p>
          </div>
          <ChoiceGrid step={step} explored={explored} onChoose={choose} />
          {allDone && (
            <p className="mt-6 rounded-3xl bg-salvia-100 p-4 text-center text-lg font-bold text-salvia-700" role="status">
              Has explorado todas las posibilidades. ¿Cuál crees que te ayudaría más a ti?
            </p>
          )}
        </>
      ) : (
        <>
          <ConsequenceBody option={option} protagonist={characters[story.characters[0]]?.name} short={shortText} />
          <div className="mt-6 flex flex-col gap-4 rounded-[var(--radius-card)] bg-crema-200/70 p-5 sm:flex-row sm:items-center sm:justify-between">
            <ExploredMeter total={step.options.length} explored={explored.length} />
            <div className="flex flex-wrap gap-3">
              <Button variant="secondary" icon="refresh" onClick={() => setOption(null)}>
                Probar otra posibilidad
              </Button>
              <LinkButton to="/recreaciones" icon="check">
                Terminar
              </LinkButton>
            </div>
          </div>
        </>
      )}
    </Page>
  );
}

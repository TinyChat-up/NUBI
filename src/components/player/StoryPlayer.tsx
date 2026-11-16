import { useCallback, useEffect, useMemo, useReducer, useRef, useState, type ReactNode } from 'react';
import {
  canAdvance,
  createRun,
  currentPlayStep,
  getChoiceStep,
  getScene,
  isAtEnd,
  runReducer,
  sceneProgress,
  type PlayStep,
  type PlayableFormat,
  type RunAction,
  type RunState,
} from '../../engine/storyEngine.ts';
import { restoreRun } from '../../engine/restoreRun.ts';
import type { Story, ToolId } from '../../engine/types.ts';
import { characters } from '../../content/characters.ts';
import { navigate } from '../../lib/router.tsx';
import { useNarration } from '../../lib/useNarration.ts';
import { useProgress } from '../../state/progress.tsx';
import { useSettings, type Settings } from '../../state/settings.tsx';
import { getAsset } from '../../content/assets/index.ts';
import { Icon } from '../Icon.tsx';
import { useSwipe } from '../../lib/useSwipe.ts';
import { preload } from '../illustration/imageSource.ts';
import { GuideArt } from '../illustration/GuideArt.tsx';
import { Button, ToolButton } from '../ui.tsx';
import { ComicView } from './ComicView.tsx';
import { ChoiceView, ConsequenceBody, ExploredMeter, FeelingsView, KnowNeedView, StrategiesView } from './interactions.tsx';
import { SceneMenu } from './SceneMenu.tsx';
import { contextIllustration, upcomingIllustrations } from './presentation.ts';
import { StoryPage, type PageDirection } from './StoryPage.tsx';
import { SummaryView } from './SummaryView.tsx';

interface StoryPlayerProps {
  story: Story;
  format: PlayableFormat;
  startSceneId?: string;
  resume?: boolean;
}

/** Texto que se lee en voz alta / se anuncia para lectores de pantalla. */
function speechFor(story: Story, state: RunState, play: PlayStep, settings: Settings): { text: string; src?: string } {
  if (play.kind === 'beat') return { text: settings.shortText && play.step.short ? play.step.short : play.step.text, src: play.step.narration };
  if (play.kind === 'panel') {
    const p = play.panels[play.index];
    const parts = [p.caption, ...p.bubbles.map((b) => (b.speaker && b.kind !== 'sound' ? `${characters[b.speaker]?.name}: ${b.text.replace(/·/g, ' ')}` : b.text))];
    return { text: parts.filter(Boolean).join('. ') };
  }
  const s = play.step;
  switch (s.type) {
    case 'feelings':
      return { text: `${s.prompt} ${s.help ?? ''}` };
    case 'know-need':
      return { text: `${s.knownTitle}: ${s.known.map((k) => k.text).join(' ')} ${s.needPrompt}` };
    case 'choice':
      return { text: `${s.prompt} ${s.options.map((o) => o.label).join('. ')}.` };
    case 'consequence': {
      const choice = getChoiceStep(story, s.choiceStepId);
      const option = choice?.options.find((o) => o.id === state.choices[s.choiceStepId]);
      return { text: option ? `${option.label}. ${option.consequence.story.map((f) => f.text).join(' ')}` : '' };
    }
    case 'strategies':
      return { text: `${s.prompt} ${s.help ?? ''}` };
    case 'summary':
      return { text: `${s.title}. ${s.closingPhrase}` };
  }
}

export function StoryPlayer({ story, format, startSceneId, resume }: StoryPlayerProps) {
  const { settings } = useSettings();
  const { recordRun, saveRun, loadRun, clearRun } = useProgress();
  const narration = useNarration();

  const [state, rawDispatch] = useReducer(
    (s: RunState, a: RunAction) => runReducer(story, s, a),
    undefined,
    () => {
      const loaded = resume ? loadRun(story.id, format) : null;
      // Una partida guardada con una escena que ya no existe (contenido editado) se descarta.
      const saved = restoreRun(story, format, loaded);
      return saved ?? createRun(story, format, startSceneId);
    },
  );

  // Dirección de lectura para animar el cambio de página (adelante / atrás).
  const direction = useRef<PageDirection>('next');
  const dispatch = useCallback((a: RunAction) => {
    direction.current = a.type === 'prev' ? 'prev' : 'next';
    rawDispatch(a);
  }, []);

  const [mode, setMode] = useState<Settings['playerMode']>('leer');
  const [subtitles, setSubtitles] = useState(settings.subtitles);
  const [motionPaused, setMotionPaused] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [voiceNotice, setVoiceNotice] = useState(false);

  const scene = getScene(story, state.position.sceneId);
  const play = currentPlayStep(story, state);
  const { current, total } = sceneProgress(story, state);
  const atEnd = isAtEnd(story, state);
  const speech = useMemo(() => speechFor(story, state, play, settings), [story, state, play, settings]);
  const stageRef = useRef<HTMLDivElement>(null);

  // Persistencia local + registro para el Espacio familiar
  useEffect(() => {
    saveRun(state);
    const chosenTools = story.scenes
      .flatMap((sc) => sc.steps)
      .filter((st) => st.type === 'strategies')
      .flatMap((st) => state.responses[st.id] ?? []) as ToolId[];
    recordRun(state, { completed: atEnd, chosenTools });
  }, [state, atEnd, story, saveRun, recordRun]);

  // Precarga discreta de las ilustraciones que vienen después (solo recursos listos).
  useEffect(() => {
    preload(upcomingIllustrations(story, state).map(getAsset));
  }, [story, state]);

  // En modo "Escuchar", cada paso nuevo se narra (el niño o la niña lo ha pedido).
  const stepKey = `${state.position.sceneId}#${state.position.stepIndex}`;
  useEffect(() => {
    if (mode !== 'escuchar') {
      narration.stop();
      return;
    }
    const ok = narration.speak(speech.text, speech.src);
    setVoiceNotice(!ok);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stepKey, mode]);

  // Al cambiar de paso, el escenario vuelve arriba (salvo en el cómic, que desplaza hasta la viñeta nueva).
  const isPanel = play.kind === 'panel';
  useEffect(() => {
    if (!isPanel) stageRef.current?.scrollTo({ top: 0 });
    stageRef.current?.focus({ preventScroll: true });
  }, [stepKey, isPanel]);

  const next = useCallback(() => dispatch({ type: 'next' }), [dispatch]);
  const prev = useCallback(() => dispatch({ type: 'prev' }), [dispatch]);
  const advanceAllowed = canAdvance(story, state);
  const canGoBack = state.history.length > 0;

  // Teclado: flechas para avanzar/retroceder.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (menuOpen || e.altKey || e.ctrlKey || e.metaKey) return;
      const target = e.target as HTMLElement;
      if (target.closest('input, textarea, select, dialog')) return;
      if (e.key === 'ArrowRight' && advanceAllowed && !atEnd) { e.preventDefault(); next(); }
      if (e.key === 'ArrowLeft' && canGoBack) { e.preventDefault(); prev(); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [advanceAllowed, atEnd, canGoBack, menuOpen, next, prev]);

  const exit = () => {
    narration.stop();
    navigate(`/historias/${story.id}`);
  };

  const restart = () => {
    clearRun(story.id, format);
    dispatch({ type: 'restart' });
  };

  const toggleMode = () => {
    const nextMode = mode === 'leer' ? 'escuchar' : 'leer';
    setMode(nextMode);
  };

  const repeat = () => {
    dispatch({ type: 'restartScene' });
    if (mode === 'escuchar' && state.position.stepIndex === 0) narration.speak(speech.text, speech.src);
  };

  const showText = mode === 'leer' || subtitles || voiceNotice || narration.error;

  // ───────── Contenido del escenario ─────────
  let stage: ReactNode;
  if (play.kind === 'beat') {
    const beat = play.step;
    stage = (
      <StoryPage
        beat={beat}
        text={settings.shortText && beat.short ? beat.short : beat.text}
        speaker={beat.speaker ? characters[beat.speaker] : undefined}
        opener={state.position.stepIndex === 0 ? { number: scene.number, title: scene.title } : undefined}
        direction={direction.current}
        mode={mode}
        showText={showText}
        speaking={narration.speaking}
      />
    );
  } else if (play.kind === 'panel') {
    stage = <ComicView panels={play.panels} index={play.index} pausedMotion={motionPaused} onReveal={next} />;
  } else {
    const s = play.step;
    const context = contextIllustration(story, state);
    switch (s.type) {
      case 'feelings':
        stage = <FeelingsView step={s} state={state} dispatch={dispatch} context={context} />;
        break;
      case 'know-need':
        stage = <KnowNeedView step={s} state={state} dispatch={dispatch} context={context} />;
        break;
      case 'choice':
        stage = <ChoiceView step={s} state={state} dispatch={dispatch} />;
        break;
      case 'consequence': {
        const choice = getChoiceStep(story, s.choiceStepId);
        const option = choice?.options.find((o) => o.id === state.choices[s.choiceStepId]);
        stage =
          option && choice ? (
            <div>
              <ConsequenceBody option={option} protagonist={characters[story.characters[0]]?.name} />
              <div className="mt-6 flex flex-col gap-4 rounded-[var(--radius-card)] bg-crema-200/70 p-5 sm:flex-row sm:items-center sm:justify-between">
                <ExploredMeter total={choice.options.length} explored={(state.explored[choice.id] ?? []).length} />
                <div className="flex flex-wrap gap-3">
                  {s.routes.map((r, i) => (
                    <Button key={r.label} variant={i === 0 ? 'secondary' : 'primary'} icon={i === 0 ? r.icon : undefined} iconAfter={i === 0 ? undefined : r.icon} onClick={() => dispatch({ type: 'goto', sceneId: r.to.sceneId, stepId: r.to.stepId })}>
                      {r.label}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="grid place-items-center gap-4 py-10 text-center">
              <GuideArt mood="thinking" size={120} />
              <p className="reading-text text-xl font-bold">Primero elige una posibilidad para ver qué puede pasar.</p>
              <Button icon="arrow-left" onClick={() => dispatch({ type: 'goto', sceneId: s.routes[0].to.sceneId, stepId: s.routes[0].to.stepId })}>
                Ver las posibilidades
              </Button>
            </div>
          );
        break;
      }
      case 'strategies':
        stage = <StrategiesView step={s} state={state} dispatch={dispatch} context={context} />;
        break;
      case 'summary':
        stage = <SummaryView story={story} state={state} step={s} onRestart={restart} />;
        break;
    }
  }

  const isChoice = play.kind === 'interactive' && play.step.type === 'choice';
  const swipe = useSwipe({
    enabled: play.kind !== 'interactive',
    onNext: () => advanceAllowed && !atEnd && next(),
    onPrev: () => canGoBack && prev(),
  });

  return (
    <div className={`flex h-dvh flex-col bg-crema-100 ${motionPaused ? 'anim-paused' : ''}`}>
      {/* Barra superior */}
      <header className="flex items-center gap-2 border-b border-crema-300/70 bg-crema-50/90 px-3 py-2 sm:gap-4 sm:px-6">
        <button type="button" onClick={exit} className="tap flex min-h-12 items-center gap-2 rounded-full px-3 font-extrabold text-petroleo-800 hover:bg-petroleo-100">
          <Icon name="close" size={24} />
          <span className="hidden sm:inline">Volver a la historia</span>
          <span className="sr-only sm:hidden">Volver a la historia</span>
        </button>
        <div className="min-w-0 flex-1 text-center">
          <p className="truncate text-xs font-black tracking-wider text-coral-700 uppercase">
            {story.title} · {format === 'comic' ? 'Cómic' : 'Cuento'}
          </p>
          <h1 className="truncate text-lg text-petroleo-900 sm:text-xl" data-route-focus>
            <span className="sr-only">Escena {current} de {total}: </span>
            {scene.title}
          </h1>
          <div aria-hidden className="mx-auto mt-1.5 flex max-w-xs justify-center gap-1.5">
            {story.scenes.map((sc, i) => (
              <span key={sc.id} className={`h-1.5 flex-1 rounded-full transition-colors ${i + 1 < current ? 'bg-petroleo-400' : i + 1 === current ? 'bg-coral-400' : 'bg-crema-300'}`} />
            ))}
          </div>
        </div>
        <button type="button" onClick={() => setMenuOpen(true)} className="tap flex min-h-12 items-center gap-2 rounded-full px-3 font-extrabold text-petroleo-800 hover:bg-petroleo-100">
          <Icon name="map" size={24} />
          <span className="hidden sm:inline">Escenas</span>
          <span className="sr-only sm:hidden">Escenas</span>
        </button>
      </header>

      {/* Escenario */}
      <div ref={stageRef} tabIndex={-1} role="region" aria-label="Contenido de la escena" className="flex-1 touch-pan-y overflow-x-hidden overflow-y-auto focus-visible:shadow-none focus-visible:[outline-offset:-6px]" {...swipe}>
        <div className={`mx-auto flex min-h-full w-full flex-col px-3 py-4 sm:px-6 sm:py-6 ${play.kind === 'beat' ? 'max-w-7xl justify-center' : 'max-w-6xl'}`}>{stage}</div>
      </div>

      {/* Región viva para lectores de pantalla */}
      <p className="sr-only" aria-live="polite">
        {speech.text}
      </p>

      {/* Controles */}
      <footer className="safe-bottom border-t border-crema-300/70 bg-crema-50/95 px-2 pt-2 sm:px-6">
        {(voiceNotice || narration.error) && mode === 'escuchar' && (
          <p className="mb-2 rounded-2xl bg-mostaza-100 px-4 py-2 text-center text-sm font-bold text-mostaza-700" role="status">
            Este episodio aún no tiene audio grabado y la voz del dispositivo no está disponible. Puedes leer el texto o activarla en Ajustes.
          </p>
        )}
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2">
          <Button variant="secondary" icon="arrow-left" onClick={prev} disabled={!canGoBack} className="flex-1 px-4 sm:flex-none sm:px-6">
            Atrás
          </Button>

          <div className="order-first flex w-full items-start justify-around sm:order-none sm:w-auto sm:justify-center sm:gap-2" role="group" aria-label="Opciones del reproductor">
            <ToolButton icon="repeat" label="Repetir" onClick={repeat} aria-label="Repetir la escena" />
            <ToolButton
              icon={mode === 'escuchar' ? 'volume' : 'story'}
              label={mode === 'escuchar' ? 'Escuchar' : 'Leer'}
              pressed={mode === 'escuchar'}
              onClick={toggleMode}
              aria-label={mode === 'escuchar' ? 'Modo escuchar activado. Cambiar a leer' : 'Modo leer activado. Cambiar a escuchar'}
            />
            <ToolButton
              icon="subtitles"
              label="Subtítulos"
              pressed={mode === 'escuchar' ? subtitles : undefined}
              onClick={() => setSubtitles((v) => !v)}
              disabled={mode === 'leer'}
              title={mode === 'leer' ? 'Los subtítulos se usan en el modo Escuchar' : undefined}
            />
            <ToolButton
              icon={motionPaused ? 'motion-off' : 'motion'}
              label={motionPaused ? 'Quietas' : 'Animaciones'}
              pressed={motionPaused}
              onClick={() => setMotionPaused((v) => !v)}
              aria-label={motionPaused ? 'Animaciones detenidas. Reanudar' : 'Detener animaciones'}
            />
          </div>

          {atEnd ? (
            <Button icon="close" onClick={exit} className="flex-1 px-4 sm:flex-none sm:px-6">
              Salir
            </Button>
          ) : (
            <Button iconAfter="arrow-right" onClick={next} disabled={!advanceAllowed} className="flex-1 px-4 sm:flex-none sm:px-6" aria-describedby={isChoice ? 'choice-hint' : undefined}>
              Siguiente
            </Button>
          )}
        </div>
        {isChoice && (
          <p id="choice-hint" className="pb-1 text-center text-sm font-bold text-tinta-suave">
            Elige una posibilidad. Tómate el tiempo que necesites.
          </p>
        )}
      </footer>

      <SceneMenu
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        story={story}
        currentSceneId={state.position.sceneId}
        visited={state.visitedScenes}
        onSelect={(sceneId) => {
          dispatch({ type: 'goto', sceneId });
          setMenuOpen(false);
        }}
        onRestart={() => {
          restart();
          setMenuOpen(false);
        }}
      />
    </div>
  );
}

/**
 * NUBI — Esquema del motor de historias.
 *
 * Este archivo es el contrato entre CONTENIDO (src/content), LÓGICA (src/engine)
 * e INTERFAZ (src/components, src/screens). Una historia nueva es un objeto
 * `Story` que cumple este esquema: no hace falta programar pantallas nuevas.
 *
 * Reglas de diseño (ver docs/CONTENT_STANDARD.md):
 * - Ningún paso exige una respuesta "correcta". Las respuestas son personales.
 * - Ninguna interacción tiene temporizador.
 * - El texto nunca se incrusta en las imágenes: va siempre en los datos.
 */

// ───────────────────────── Identificadores ─────────────────────────

export type FormatId = 'cuento' | 'comic' | 'video';

export type PlaceId = 'colegio' | 'casa' | 'parque' | 'amigos' | 'emociones' | 'herramientas';

export type ToolId =
  | 'pedir-ayuda'
  | 'descansar'
  | 'espacio-tranquilo'
  | 'comunicar-necesidad'
  | 'anticipar-cambios'
  | 'expresar-desacuerdo'
  | 'apoyos-sensoriales';

export type EmotionId =
  | 'alegria'
  | 'calma'
  | 'sorpresa'
  | 'curiosidad'
  | 'inseguridad'
  | 'frustracion'
  | 'tristeza'
  | 'enfado'
  | 'cansancio';

export type ReferenceId =
  | 'bisquerra'
  | 'ibarrola'
  | 'gray'
  | 'zones'
  | 'five-point-scale'
  | 'social-situation-mapping'
  | 'neurodiversity-affirming';

/** Identificador de un recurso del registro de assets (src/content/assets). */
export type AssetId = string;
export type CharacterId = string;
export type SceneId = string;
export type StepId = string;

// ───────────────────────── Recursos visuales ─────────────────────────

export type AssetKind =
  | 'portada'
  | 'personaje'
  | 'lugar'
  | 'cubierta'
  | 'escena'
  | 'vineta'
  | 'opcion'
  | 'herramienta'
  | 'emocion';

export type AspectRatio = '16:9' | '4:3' | '3:2' | '1:1' | '3:4';

/** Motivos que el generador de placeholders sabe dibujar. */
export type PlaceholderMotif =
  | 'landscape'
  | 'school-gate'
  | 'hallway'
  | 'classroom'
  | 'classroom-door'
  | 'board-schedule'
  | 'library'
  | 'calm-corner'
  | 'home'
  | 'park'
  | 'friends'
  | 'emotions'
  | 'toolbox'
  | 'portrait'
  | 'icon';

export type Mood = 'neutral' | 'happy' | 'surprised' | 'worried' | 'curious' | 'frustrated' | 'calm' | 'thinking';

export interface PlaceholderFigure {
  character: CharacterId;
  mood?: Mood;
}

export interface AssetSpec {
  id: AssetId;
  /** Ruta pública definitiva, p. ej. /media/stories/una-manana-diferente/s1-llegada.webp */
  file: string;
  kind: AssetKind;
  /** `listo` solo cuando el archivo definitivo existe en /public. */
  status: 'pendiente' | 'listo';
  /** Dónde se usa (escena, pantalla). */
  usage: string;
  description: string;
  characters: CharacterId[];
  emotionOrAction: string;
  aspect: AspectRatio;
  size: { width: number; height: number };
  background: string;
  transparent: boolean;
  alt: string;
  /** Instrucciones para el placeholder temporal. */
  placeholder: {
    motif: PlaceholderMotif;
    figures?: PlaceholderFigure[];
    /** Un icono de la librería interna (para herramientas, emociones, lugares). */
    icon?: string;
    tint?: 'crema' | 'petroleo' | 'coral' | 'salvia' | 'mostaza';
  };

  // ── Campos OPCIONALES de presentación (contrato: docs/ILLUSTRATION_INTEGRATION.md) ──

  /**
   * Punto focal en % (0-100) de la zona pedagógicamente importante (caras, gestos,
   * comunicador). Solo se usa cuando un contenedor no tiene la misma proporción que
   * el recurso y hay que recortar. Por defecto: centro (50, 50).
   */
  focus?: { x: number; y: number };
  /**
   * Anchos (px) de variantes responsive ya exportadas junto al archivo principal,
   * con el sufijo `-<ancho>w`: p. ej. `s1-puerta-1200w.webp` para 1200.
   * El archivo principal (`file`) se usa como tamaño mayor.
   */
  variants?: number[];
  /**
   * Versión RECOMPUESTA para pantallas en vertical (dirección de arte, no un recorte):
   * misma escena con más cielo/suelo para que la ilustración llene la pantalla del móvil.
   * Se sirve con <picture media="(orientation: portrait)">. Debe existir si el recurso está `listo`.
   */
  portrait?: {
    file: string;
    aspect: AspectRatio;
    size: { width: number; height: number };
    variants?: number[];
  };
}

// ───────────────────────── Personajes ─────────────────────────

export interface Character {
  id: CharacterId;
  name: string;
  role: string;
  /** Descripción para la persona que ilustra (ver ASSET_REQUESTS). */
  visual: string;
  /** Rasgos narrativos y de comunicación. */
  traits: string;
  /** Color de identificación en placeholders y bocadillos. */
  color: string;
  /** Es el personaje guía de NUBI (provisional). */
  isGuide?: boolean;
}

// ───────────────────────── Pasos de escena ─────────────────────────

/** Página narrativa del cuento. */
export interface BeatStep {
  type: 'beat';
  id: StepId;
  text: string;
  /** Versión corta (lectura fácil). Si falta, se usa `text`. */
  short?: string;
  illustration: AssetId;
  speaker?: CharacterId;
  /** Audio narrado (opcional). Si falta, la voz del dispositivo puede leer el texto si la familia lo activa. */
  narration?: string;
  motion?: 'float' | 'rise' | 'none';
}

export interface FeelingOption {
  id: string;
  label: string;
  emotion?: EmotionId;
  icon: string;
}

/** ¿Cómo te sentirías tú? Elección múltiple, nunca evaluada. */
export interface FeelingsStep {
  type: 'feelings';
  id: StepId;
  prompt: string;
  help?: string;
  options: FeelingOption[];
  intensity?: {
    prompt: string;
    levels: { id: string; label: string }[];
  };
}

/** Lo que sabemos / lo que me gustaría saber. */
export interface KnowNeedStep {
  type: 'know-need';
  id: StepId;
  knownTitle: string;
  known: { id: string; text: string; icon: string }[];
  needPrompt: string;
  questions: { id: string; label: string; icon: string }[];
  help?: string;
}

export interface Consequence {
  /** Lo que puede pasar, contado en 1-3 viñetas narrativas. */
  story: { text: string; illustration: AssetId }[];
  youMayFeel: string;
  othersMay: string;
  helpsWhen: string;
  keepInMind: string;
  /** Otra manera de conseguir lo mismo (sobre todo en opciones con más inconvenientes). */
  anotherWay?: string;
  tools: ToolId[];
  /** Versión corta (Ajustes → «Textos cortos»). Opcional, campo a campo; lo que falte usa el texto completo. */
  short?: ConsequenceShort;
}

/**
 * Lectura fácil de una consecuencia. Cada texto es **editorial y explícito** (lo escribe y aprueba
 * una persona): nunca se genera ni se recorta automáticamente. Debe conservar hechos, personajes y
 * formas de comunicación (p. ej. la CAA de Lía). docs/review/EDITORIAL_APPROVAL_PHASE_15.md.
 */
export interface ConsequenceShort {
  /** En el mismo orden que `story`; una posición vacía usa el texto completo de ese momento. */
  story?: (string | undefined)[];
  youMayFeel?: string;
  othersMay?: string;
  helpsWhen?: string;
  keepInMind?: string;
  anotherWay?: string;
}

export interface ChoiceOption {
  id: string;
  label: string;
  icon: string;
  illustration: AssetId;
  /**
   * Consecuencia contada dentro del paso `consequence` (modelo de la fase 19: varias opciones, una escena común).
   * Obligatoria si la opción no tiene `next`; opcional en historias ramificadas, donde la consecuencia son escenas.
   */
  consequence?: Consequence;
  /** Fase 21: escena a la que lleva ESTA opción (rama propia). Si falta, se usa `ChoiceStep.next`. */
  next?: SceneId;
}

/** Varias posibilidades de actuación. Ninguna es "la correcta". */
export interface ChoiceStep {
  type: 'choice';
  id: StepId;
  prompt: string;
  help?: string;
  options: ChoiceOption[];
  /** Escena a la que se va tras elegir (normalmente la de consecuencias). */
  next: SceneId;
}

export interface Route {
  label: string;
  icon: string;
  to: { sceneId: SceneId; stepId?: StepId };
}

/** Muestra la consecuencia de la opción elegida en `choiceStepId`. */
export interface ConsequenceStep {
  type: 'consequence';
  id: StepId;
  choiceStepId: StepId;
  /** Rutas posibles: volver a explorar otra opción, seguir… */
  routes: Route[];
}

export interface StrategiesStep {
  type: 'strategies';
  id: StepId;
  prompt: string;
  help?: string;
  tools: ToolId[];
}

export interface SummaryStep {
  type: 'summary';
  id: StepId;
  title: string;
  sections: {
    title: string;
    /** Paso del que se leen las respuestas. */
    fromStepId: StepId;
    /** Para pasos `choice`: se listan las opciones exploradas. */
    empty: string;
  }[];
  closingPhrase: string;
}

export type InteractiveStep = FeelingsStep | KnowNeedStep | ChoiceStep | ConsequenceStep | StrategiesStep | SummaryStep;
export type Step = BeatStep | InteractiveStep;

// ───────────────────────── Cómic ─────────────────────────

export type BubbleKind = 'speech' | 'thought' | 'device' | 'sound' | 'caption';
export type BubblePosition = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'top' | 'bottom';

export interface Bubble {
  id: string;
  kind: BubbleKind;
  speaker?: CharacterId;
  text: string;
  position: BubblePosition;
}

export interface ComicPanel {
  id: string;
  illustration: AssetId;
  /** Ancho de la viñeta en la rejilla. */
  span?: 'full' | 'half';
  caption?: string;
  bubbles: Bubble[];
  motion?: 'float' | 'rise' | 'none';
}

// ───────────────────────── Escenas e historia ─────────────────────────

export interface Scene {
  id: SceneId;
  number: number;
  title: string;
  /** Propósito pedagógico de la escena (documentación y guía familiar). */
  purpose: string;
  steps: Step[];
  /** Página de cómic. En formato cómic sustituye a los pasos `beat`. */
  comic?: ComicPanel[];
  /** Escena siguiente. Si falta, se usa el orden del array (salvo en finales: ver `ending`). */
  next?: SceneId;
  /** Fase 21: papel narrativo (momentos del lector). Si falta, se deduce de la posición respecto a la decisión. */
  role?: 'situacion' | 'decision' | 'consecuencia' | 'final';
  /** Fase 21: la escena es un final. Tras su último paso el cuento termina (no sigue el orden del array). */
  ending?: { id: string; title: string };
  /**
   * Fase 21: al terminar esta escena, Nubi pregunta «¿Quieres probar otra forma?» y muestra las demás
   * opciones de la última decisión. Nunca obliga: se puede seguir, volver atrás o terminar.
   */
  offer?: boolean;
}

export interface VideoSpec {
  status: 'pendiente' | 'listo';
  sources: { src: string; type: 'video/mp4' | 'video/webm' }[];
  captions: { src: string; srclang: string; label: string }[];
  poster: AssetId;
  /** Capítulos (segundos) para saltar a cada escena. */
  chapters: { sceneId: SceneId; start: number }[];
  /** Nota honesta sobre el estado de producción. */
  productionNote: string;
}

export interface Objective {
  id: string;
  text: string;
  /** Bloque de competencia (marco de Bisquerra) al que contribuye. */
  area: 'conciencia' | 'regulacion' | 'autonomia' | 'social' | 'vida-bienestar';
}

export interface Recreation {
  id: string;
  title: string;
  description: string;
  /** Contexto breve que se muestra antes de elegir. */
  intro: string;
  sceneId: SceneId;
  choiceStepId: StepId;
  cover: AssetId;
}

export interface FamilyGuide {
  intro: string;
  beforeReading: string[];
  duringReading: string[];
  afterReading: string[];
  dailyPractice: { id: string; title: string; text: string; tool?: ToolId }[];
  /** `doneWhen` permite marcarlas como hechas a partir del progreso local. */
  pendingActivities: { id: string; title: string; text: string; doneWhen?: 'all-options-explored' | 'any-tool-practiced' | 'story-completed' }[];
  resources: { id: string; title: string; description: string; status: 'disponible' | 'en-preparacion'; href?: string }[];
  pauseSignals: string[];
  respectNotes: string[];
}

export interface StoryReference {
  source: ReferenceId;
  howApplied: string;
  /** `fundamento`: apoyado en la fuente verificada. `propuesta`: decisión propia pendiente de validar. */
  status: 'fundamento' | 'propuesta';
}

export interface Story {
  id: string;
  title: string;
  /** Una línea para la tarjeta. */
  tagline: string;
  synopsis: string;
  place: PlaceId;
  ages: { min: number; max: number };
  durationMinutes: { min: number; max: number };
  formats: FormatId[];
  cover: AssetId;
  objectives: Objective[];
  characters: CharacterId[];
  scenes: Scene[];
  strategies: ToolId[];
  recreations: Recreation[];
  video?: VideoSpec;
  familyGuide: FamilyGuide;
  references: StoryReference[];
  validation: {
    status: 'borrador' | 'pendiente-validacion' | 'validado';
    notes: string;
  };
  /** Fase 21: 1 = una decisión con escena común (por defecto). 2 = ramificada (`option.next`, finales). */
  engineVersion?: 1 | 2;
}

// ───────────────────────── Bibliotecas ─────────────────────────

export interface Tool {
  id: ToolId;
  name: string;
  /** Frase breve para el niño o la niña. */
  childText: string;
  icon: string;
  illustration: AssetId;
  color: 'petroleo' | 'coral' | 'salvia' | 'mostaza';
  steps: string[];
  /** Diferentes formas válidas de hacerlo (palabras, gestos, pictogramas, tarjeta…). */
  ways: string[];
  phrases: string[];
  /** Tarjeta grande que se puede enseñar a un adulto. */
  card: string;
  note: string;
  familyTip: string;
}

export interface Emotion {
  id: EmotionId;
  name: string;
  childText: string;
  icon: string;
  mood: Mood;
  illustration: AssetId;
  /** Formas distintas en que puede notarse. Nunca una sola. */
  mayFeelLike: string[];
  tools: ToolId[];
}

export interface Place {
  id: PlaceId;
  name: string;
  description: string;
  icon: string;
  illustration: AssetId;
  color: 'petroleo' | 'coral' | 'salvia' | 'mostaza';
  kind: 'stories' | 'emotions' | 'tools';
}

export interface Reference {
  id: ReferenceId;
  authors: string;
  work: string;
  url?: string;
  /** Qué se ha verificado en la fuente. */
  verified: string;
  /** Cómo inspira a NUBI sin copiar. */
  inNubi: string;
  limits: string;
}

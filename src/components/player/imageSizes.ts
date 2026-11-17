/**
 * Atributo `sizes` de las ilustraciones del cuento, compartido por quien las muestra
 * (StoryPage, interactions) y por quien las precarga (presentation → preload).
 * Si la precarga anunciara otro `sizes`, el navegador podría descargar otra variante
 * y desperdiciarla (fase 13: tests/browser/story-preload.mjs). Las viñetas tienen el suyo
 * en comicLayout.ts.
 */

/** Página de cuento: escena entera (3:4 en vertical gracias a <picture>, 16:9 en horizontal). */
export const SCENE_SIZES = '(orientation: landscape) and (min-width: 1024px) 62vw, (orientation: portrait) 85vw, 100vw';

/** Tarjetas de «¿Qué podría hacer…?»: 2 columnas (1 por debajo de 360 px) → 3 desde 1024 px (fase 20). */
export const OPTION_CARD_SIZES = '(min-width: 1024px) 33vw, (min-width: 360px) 50vw, 100vw';

/** Momentos de una consecuencia (1 → 2 columnas). */
export const CONSEQUENCE_SIZES = '(min-width: 768px) 50vw, 100vw';

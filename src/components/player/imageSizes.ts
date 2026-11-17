/**
 * Atributo `sizes` de las ilustraciones del cuento, compartido por quien las muestra
 * (StoryPage, interactions) y por quien las precarga (presentation → preload).
 * Si la precarga anunciara otro `sizes`, el navegador podría descargar otra variante
 * y desperdiciarla (fase 13: tests/browser/story-preload.mjs). Las viñetas tienen el suyo
 * en comicLayout.ts.
 */

/** Página de cuento: escena entera (3:4 en vertical gracias a <picture>, 16:9 en horizontal). */
export const SCENE_SIZES = '(orientation: landscape) and (min-width: 1024px) 62vw, (orientation: portrait) 85vw, 100vw';

/** Tarjetas de «¿Qué podría hacer…?»: en móvil, filas con la imagen a la izquierda (≈ 40 %); después 2 → 3 columnas. */
export const OPTION_CARD_SIZES = '(min-width: 1024px) 33vw, (min-width: 480px) 50vw, 40vw';

/** Momentos de una consecuencia (1 → 2 columnas). */
export const CONSEQUENCE_SIZES = '(min-width: 768px) 50vw, 100vw';

# Fase 12 · Herramientas y lugares

Base real: `integration/phase-11` en `48c0d82e7edc613155b5e2fdbbfa72ec6521bf5d`. Rama de entrega: `feat/codex-art-batch-6`. Sin merge ni despliegue.

## Producción y continuidad

Se leyeron AGENTS.md, CLAUDE.md, VISUAL_GUIDE, NUBI_DESIGN_PRINCIPLES, ILLUSTRATION_INTEGRATION, ASSET_REQUESTS y PHASE_11_REPORT; se consultaron los registros y los catálogos tools/emotions. Se inspeccionaron visualmente las hojas maestras de Teo, Aya y Andrés, la escena de llegada, el panorama de portada, las viñetas k6-1/k6-3, la lámina del cómic y las emociones definitivas. Las referencias reales se adjuntaron a Image Gen.

Mismo mundo de gouache y lápiz, luz cálida, materiales de papel, crema, petróleo, coral, salvia, mostaza y marrones. Teo y Aya actúan con autonomía; Andrés se agacha para escuchar. Las tarjetas, la mochila mostaza, los cascos verdes y el horario conservan continuidad con las escenas. El colegio conserva fachada clara, tejado de teja, reloj, ventanas y puerta petróleo, verja y árbol. El jardín de emociones usa nubes sin caras, sin crear mascotas oficiales nuevas ni categorías emocionales por color.

Correcciones: se simplificó el horario quitando el personaje y las plantas añadidos por la primera generación; se eliminó el fondo blanco y las sombras del kit sensorial; se quitaron los personajes añadidos al rincón tranquilo. El primer jardín de emociones mostraba un colegio dominante y se solicitó sustituirlo por jardín abierto. Los originales de cada generación final se conservan sin modificación fuera de `public/`; son PNG raster nativos, no documentos por capas. Los prompts y referencias están en `generation.json`.

## Exportaciones

`public/media/tools/`: siete PNG 1024×1024, variantes 256/512. `public/media/places/`: seis WebP 2048×1536, variantes 800/1200. Perfil sRGB. `exports.json` registra resolución nativa real, resolución exportada, remuestreo, bytes y SHA256. Se añade un margen transparente de exportación del 3 % por lado a las herramientas, conservando la composición entera. La limpieza de exportación elimina solo ruido alfa 1–2/255; no redibuja personajes ni cambia contenido. Los originales pesados no se cargan en la app.

Láminas: [herramientas](tools-review.png), [56/96/176 px](legibility-review.png), [lugares](places-review.png), [alfa sobre petróleo](alpha-review.png). Las etiquetas se añaden solo a las láminas, nunca a los archivos de aplicación.

La legibilidad en pequeño es una revisión editorial, no un estudio con niños ni validación pedagógica. Las palabras y los apoyos de la interfaz siguen siendo necesarios. No hay cambios educativos ni obligación de usar una estrategia específica.

## Pruebas y capturas

Las pruebas nuevas usan `NUBI_ART_EVIDENCE` o `/tmp/nubi-art-batch-6` por defecto. No se ejecutó la prueba histórica art-batch-5 que sobrescribe sus propias evidencias. Se conservan los informes y las capturas de lotes anteriores. Las pruebas de navegador usan herramientas externas a las dependencias de aplicación y Chromium emulado, no dispositivos físicos ni lector de pantalla.

## Integración para Claude

Los registros activan las imágenes en Mi mundo, Mis herramientas y las fichas existentes. El selector de estrategias del cuento todavía usa iconos: conectarlo requiere una tarea de interfaz con `leading` y ToolId, como ya señala PHASE_11_REPORT. No se modifican React, CSS, navegación, escenas, viñetas, emociones ni logotipo.

## Resoluciones y peso de las entregas

Herramientas: originales 1254×1254, reducidos con Lanczos y margen transparente. Lugares: originales 1448×1086, ampliados a 2048×1536 con Lanczos; la resolución principal es de exportación, **no nativa**. No se recorta ni estira la proporción.

| ID | Nativo | Principal (KiB) | Variantes (KiB) |
|---|---|---|---|
| tool-pedir-ayuda | 1254×1254 | 1165.8 | 87.2, 304.7 |
| tool-descansar | 1254×1254 | 1013.2 | 74.1, 266.6 |
| tool-espacio-tranquilo | 1254×1254 | 992.2 | 70.8, 254.3 |
| tool-comunicar-necesidad | 1254×1254 | 1058.9 | 77.9, 276.2 |
| tool-anticipar-cambios | 1254×1254 | 905.3 | 59.4, 225.2 |
| tool-expresar-desacuerdo | 1254×1254 | 1125.6 | 86.2, 300.1 |
| tool-apoyos-sensoriales | 1254×1254 | 995.4 | 78.2, 268.0 |
| place-colegio | 1448×1086 | 455.7 | 128.3, 234.7 |
| place-casa | 1448×1086 | 407.0 | 111.7, 212.8 |
| place-parque | 1448×1086 | 329.0 | 91.3, 173.9 |
| place-amigos | 1448×1086 | 402.5 | 109.6, 208.2 |
| place-emociones | 1448×1086 | 182.2 | 47.5, 88.7 |
| place-herramientas | 1448×1086 | 327.5 | 84.3, 163.7 |

## Revisión a escala de uso

Se revisaron las cuatro láminas y capturas reales de Mi mundo, rejilla y fichas. A 56 px se conservan las siluetas principales: tarjeta frente al adulto, cojín, tienda abierta, tres vías de comunicación, tablero/flecha, mano que expresa opinión y kit de objetos. Pedir ayuda y expresar desacuerdo comparten dos figuras: la tarjeta grande frente a la mano abierta las diferencia; las etiquetas siguen siendo esenciales. A 96 y 176 px se leen mejor manos, pictogramas y apoyos. No se exige contacto visual ni hay gestos de castigo. No se observan halos visibles en la lámina sobre petróleo.

Las tarjetas de lugar mantienen la proporción completa 4:3 y descargan 800w en DPR 1 en los tres tamaños. Las herramientas descargan 256w tanto en la rejilla de 96 px como en los detalles de 176–208 px. Las medidas reales y `sizes` anunciados se guardan en [browser-results.json](browser-results.json). El diseño de la interfaz no ha cambiado. Los avisos «Próximamente» corresponden al contenido de historias disponible, no al estado de las imágenes.

## Capturas de la aplicación

- 390 px: [Mi mundo](previews/390-mundo-viewport.png) · [rejilla](previews/390-herramientas-viewport.png) · [detalle](previews/390-herramientas-pedir-ayuda-viewport.png).
- 820 px: [Mi mundo](previews/820-mundo-viewport.png) · [rejilla](previews/820-herramientas-viewport.png) · [detalle](previews/820-herramientas-pedir-ayuda-viewport.png).
- 1180 px: [Mi mundo](previews/1180-mundo-viewport.png) · [rejilla](previews/1180-herramientas-viewport.png) · [detalle](previews/1180-herramientas-pedir-ayuda-viewport.png).

Se incluyen también capturas de las otras seis fichas por tamaño en `previews/`.

## Resultados finales

| Comando | Resultado |
|---|---|
| `npm run assets:doc` | 72 recursos, documento regenerado desde los registros |
| `npm run check` | Tipos, **63 tests en 8 archivos** y build correctos |
| `python tests/art-batch-6-files.py` | 13 originales con hash; 39 exportaciones con formato, ICC, dimensiones, alfa y márgenes correctos |
| `art-batch-6.mjs` | 13 recursos / 39 archivos; 27 pantallas, tres viewports, variantes, carga y ausencia de desbordamiento |
| `art-files.mjs` | **72 recursos / 224 archivos**, hashes, decodificación, tamaños y alfa correctos |
| `art-layout.mjs` | **204 cargas, 0 provisionales, 0 errores**, tres viewports; solo recorte decorativo previsto de portada |
| `screens.mjs` | Nueve rutas, sin errores de página ni desbordamiento; axe devuelve cero infracciones |
| `quality.mjs` | Pasa en 390/820/1180: cuento, cómic, seis opciones, emociones, intensidad, resumen, persistencia, borrado, teclado y vídeo; axe sin infracciones |
| `focus-obscured.mjs` | Finaliza con código 0, sin fallo de foco tapado |

Registros en [validation/](validation/), validación gráfica en [file-validation.json](file-validation.json) y [browser-results.json](browser-results.json). Ejecución: Vite en puerto 5173, Chromium `/usr/bin/chromium`, herramientas Playwright/axe externas en `/tmp/nubi-browser-tools`. Comandos de navegador: `NUBI_BROWSER_TOOLS=/tmp/nubi-browser-tools node tests/browser/<prueba>.mjs`; la prueba nueva admite `NUBI_URL` y `NUBI_ART_EVIDENCE`. `quality` usó `NUBI_EVIDENCE=/tmp/nubi-phase12/quality`; `art-files`, `NUBI_FILE_RESULTS=/tmp/nubi-phase12/art-files.json`.

## Catálogo y alcance final

[Calculado desde los registros](catalog.json): **72 listos, 0 pendientes, 72 totales**. Los trece recursos solicitados están entregados; ninguno queda pendiente. Los recursos previos y las evidencias históricas permanecen intactos. No se modifican componentes, estilos, motor, textos, navegación, IDs, emociones, escenas, viñetas ni logotipo. La integración futura del selector de estrategias sigue siendo recomendación para Claude, no un cambio realizado en este lote.

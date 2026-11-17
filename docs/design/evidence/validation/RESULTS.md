# Resultados técnicos · Fase 17

Ejecución: 17 de noviembre de 2026, Chromium local sin interfaz. Versiones y base en [environment.json](environment.json). Los resultados corresponden al React de esta rama; no implican validación con personas ni conformidad WCAG completa.

## Comprobaciones ejecutadas

| Comprobación | Resultado | Evidencia |
|---|---|---|
| `npm run check` | Tipos, 87 tests en 13 archivos y build correctos | [check.log](check.log) |
| `quality` | Recorridos, seis decisiones, selecciones, recuperación, resumen, borrado, teclado y axe correctos | [quality.log](quality.log), [JSON](quality.json) |
| `screens` | Pantallas generales sin infracciones axe detectadas; ahora la prueba también falla si aparecen | [screens.log](screens.log) |
| `story-fit` | 23 páginas × 3 tamaños × 2 tamaños de letra; imágenes íntegras y lectura alcanzable | [story-fit.log](story-fit.log) |
| `focus-obscured` | Foco visible en 12 rutas, tres tamaños y dos tamaños de letra | [focus-obscured.log](focus-obscured.log) |
| `reflow` | Diseño habitual y recorrido completo en 320×256: cuento 24 pasos, cómic 19; ocho pantallas generales | [reflow.log](reflow.log) |
| `short-text` | Versiones existentes, consecuencias sin versión corta y preferencias conservadas | [short-text.log](short-text.log) |
| `comic-flow`, `comic-sizes` | Navegación, revelado, teclado y composición correctos | [flujo](comic-flow.log), [tamaños](comic-sizes.log) |
| `art-layout`, `story-preload` | Composición y carga de escenas correctas | [composición](art-layout.log), [precarga](story-preload.log) |
| `art-files` | 72 recursos / 224 archivos: SHA256, decodificación, dimensiones y alfa correctos | [art-files.log](art-files.log) |
| Lotes gráficos 2, 3 y 4 | Recursos, escenas, consecuencias y 15 viñetas comprobados | [lote 2](art-batch-2.log), [lote 3](art-batch-3.log), [lote 4](art-batch-4.log) |
| Lotes gráficos 5 y 6 | Emociones/herramientas ampliadas; etiquetas, selección, transparencia y teclado conservados | [lote 5](art-batch-5.log), [lote 6](art-batch-6.log) |
| `narration` | Comportamiento de voz local comprobado por la batería existente | [narration.log](narration.log) |
| `ux-redesign` | 80 pantallas, cero fallos; 10 recorridos de imágenes con DPR 1/2 | [ux-matrix.log](ux-matrix.log), [JSON completo](ux-matrix.json) |

Las 15 baterías agrupadas tienen código de salida 0 en [suites.json](suites.json). Tras los últimos ajustes responsive se repitieron `screens`, `focus-obscured` y `art-layout`; sus registros enlazados son los finales y sus salidas se conservan en [final-suites.json](final-suites.json). `reflow`, `story-fit` y la matriz adicional tienen registros independientes. Se volvió a ejecutar `npm run check` antes del commit.

## Matriz adicional y correcciones

`ux-redesign` combina 390×844, 820×1180, 1180×820, 320×256 y 640×512 con letra normal y 125 %, en ocho rutas generales. Activa simultáneamente contraste alto, movimiento reducido y el ajuste existente de textos cortos. Comprueba ausencia de desbordamiento horizontal, una h1, objetivos de al menos 48 px (tolerancia de redondeo de 0,5 px), errores de JavaScript y reglas automáticas axe WCAG 2/2.1/2.2 A/AA. El enlace de salto, oculto hasta recibir foco, se excluye de la medida geométrica inicial.

La matriz descubrió desbordamientos de navegación y nombres largos con letra grande. Se corrigieron con navegación inferior hasta 1280 px, dos columnas en móviles estrechos, fichas apiladas y columnas `minmax(0,1fr)`. No se redujo la letra ni se ocultó el desbordamiento global. El resultado final tiene cero fallos.

Muestras del viewport real con contraste alto y 125 %:

- 320×256: [portada](320-xl-portada.png), [biblioteca](320-xl-historias.png), [herramientas](320-xl-herramientas.png).
- 390×844: [mundo](390-xl-mundo.png), [herramientas](390-xl-herramientas.png).
- 640×512: [mundo](640-xl-mundo.png).

Las diez visitas de imágenes cubren portada, mundo, emociones, herramientas y ficha a DPR 1 y 2. Comprueban decodificación, `contain` y resolución suficiente hasta el máximo del original. Los lotes gráficos complementan esto con variantes narrativas y regiones protegidas.

## Evidencia visual y preservación

Se conservan 42 estados antes y 42 después, cada uno con captura de viewport y de página completa: 14 estados × tres tamaños. [Antes/después](../../BEFORE_AFTER.md) incluye comparación móvil/tableta y enlaces al inventario. Las capturas posteriores se renovaron después del último cambio de CSS. Se inspeccionaron visualmente las tres composiciones responsive y las pantallas narrativas; las capturas no sustituyen un recorrido táctil real.

`git diff` frente a la base no muestra cambios en `src/content/`, `src/engine/`, `src/state/`, `public/` ni `docs/review/`. No se alteran recursos, esquemas, respuestas, borradores editoriales ni evidencias históricas. Las pruebas de presentación se adaptan al tamaño deliberado de 96 px y a la resolución de la ficha ampliada; mantienen sus comprobaciones funcionales.

## Límites

En `story-fit`, la letra al 125 % requiere desplazamiento vertical en 16 páginas móviles y tres horizontales; el contenido sigue alcanzable. A 320×256 las barras pasan al flujo, como prevé el mecanismo existente de zoom alto. Estos tamaños emulan reajuste CSS: no son una prueba de zoom real del navegador/SO.

No se han probado Safari, Firefox, lectores de pantalla reales ni dispositivos táctiles físicos. Tampoco se han realizado sesiones con niños, personas autistas o familias. La voz del sistema se comprueba técnicamente, sin afirmar calidad de pronunciación. El [plan de validación humana](../../PENDING_USER_VALIDATION.md) conserva estos pendientes y las hipótesis de comprensión.

## Reproducción

Con la aplicación en `http://127.0.0.1:5173` y Playwright/axe instalados fuera del proyecto:

```sh
npm run check
NUBI_BROWSER_TOOLS=/ruta/a/herramientas node tests/browser/quality.mjs
NUBI_BROWSER_TOOLS=/ruta/a/herramientas node tests/browser/ux-redesign.mjs
NUBI_BROWSER_TOOLS=/ruta/a/herramientas NUBI_EVIDENCE=/tmp/nubi-capturas node tests/browser/ux-captures.mjs
```

Las demás baterías se ejecutan de igual manera por su nombre en `tests/browser/`. Establecer `NUBI_EVIDENCE` y, para los lotes que lo admiten, `NUBI_ART_EVIDENCE` en un directorio temporal para conservar las evidencias históricas.

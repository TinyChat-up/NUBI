# NUBI — Fase 9 · Integración del cómic completo

17/11/2026 · Rama `integration/phase-9`, creada desde `integration/phase-7` (`5d95c92`) con `feat/codex-art-batch-4` (`2ab7f1c`) fusionada. **Sin merge a `main` y sin despliegue.**

Resumen: el cómic de «Una mañana diferente» tiene sus **15 viñetas ilustradas** e integradas sin conflictos. Se corrigió la selección de resoluciones que señaló Codex. La medición en Chromium mostró **dos causas**:

1. Un `sizes` único para todas las viñetas.
2. Una precarga que siempre anunciaba `100vw`.

Ahora cada viñeta descarga **una sola vez** la variante adecuada a su ancho real, en móvil y tableta, con DPR 1 y 2. Cuento y cómic quedan **completamente ilustrados**. No se ha tocado ningún archivo gráfico, registro de recursos ni texto educativo.

---

## 1. Resultado del merge

| Dato | Valor |
|---|---|
| Base | `integration/phase-7` @ `5d95c92` |
| Rama artística | `feat/codex-art-batch-4` @ `2ab7f1c`: un único commit sobre `5d95c92`. Se comprobó que parte de la base |
| Merge | `git merge --no-ff origin/feat/codex-art-batch-4` → `634affa` |
| Conflictos | **Ninguno.** El árbol resultante es idéntico al de la rama artística |

Se conservan íntegros:

- 14 WebP principales y 28 variantes (`-800w`, `-1200w`) en `public/media/stories/una-manana-diferente/comic/`.
- 14 PNG originales en `docs/art-batch-4/originals/`.
- El registro (`assets.ts`: 14 entradas `listo` con `variants: [800, 1200]`).
- `tests/browser/art-batch-4.mjs`.
- `scripts/export-art-batch-4.py`.
- Las 62 regiones protegidas (`docs/art-batch-4/protected-regions.json`, 15 viñetas).

## 2. Estado del catálogo

Calculado desde el registro (`src/content/assets/index.ts`): **72 recursos · 50 listos · 22 pendientes**. Coincide con lo esperado. `npm run assets:doc` regenera `docs/ASSET_REQUESTS.md` sin diferencias.

| Tipo | Listos | Pendientes |
|---|---|---|
| Portada | 1 | 0 |
| Personajes | 11 | 0 |
| Cubierta | 1 | 0 |
| Escenas | 10 (todas con 3:4) | 0 |
| Opciones y consecuencias | 12 | 0 |
| **Viñetas** | **15** | **0** |
| Emociones | 0 | 9 |
| Herramientas | 0 | 7 |
| Lugares | 0 | 6 |

## 3. Cambios técnicos

### Problema medido

Se recorrieron las 15 viñetas con caché vacía en cada combinación de tamaño y DPR. Se midió el ancho real, el `currentSrc` y todas las peticiones. Se considera **óptima** la variante más pequeña que cubre `ancho × DPR`; Chromium 153 aplica exactamente esa regla, comprobada aparte con `sizes` fijos.

- **`sizes` único** (`(min-width: 1024px) 50vw, 100vw`). En 1180×820, las viñetas completas miden 966 px pero anunciaban 590 px. `k4-1` descargaba 800w en DPR 1 (lo óptimo es 1200w) y 1200w en DPR 2 (lo óptimo es 2400w): pérdida de definición.
- **Precarga con `sizes = 100vw`.** `preload()` precargaba la viñeta siguiente como si ocupara toda la pantalla. El navegador reutilizaba después esa imagen mayor:
  - En 820×1180 DPR 1, 14 de 15 viñetas cargaban 1200w cuando basta 800w.
  - En 1180×820, las medias (469 px) cargaban 1200w o el original de 2048 px cuando bastan 800w o 1200w.
  - `k2-1` se descargaba **dos veces**.

### Corrección

| Archivo | Cambio |
|---|---|
| `src/components/player/comicLayout.ts` **(nuevo)** | Lógica pura. `COMIC_GRID` recoge las medidas reales del escenario y la rejilla: márgenes de 12/24 px, máximo de 1104 px, dos columnas desde 1024 px con hueco de 20 px, límite horizontal `(100vh − 17rem) × 16/9` y bordes de 4 px. `comicPanelWidth(span, viewport)` es el modelo numérico del ancho. `comicPanelSizes(span)` genera el `sizes` |
| `src/components/player/ComicView.tsx` | `sizes={comicPanelSizes(panel.span)}`: las viñetas `full` anuncian las dos columnas y las `half` una. Comentario que enlaza la rejilla con `COMIC_GRID` |
| `src/components/illustration/imageSource.ts` | `preload()` acepta el `sizes` de cada imagen; por defecto sigue siendo `100vw` |
| `src/components/player/presentation.ts` | `upcomingImages()` sustituye a `upcomingIllustrations()` y devuelve, para cada viñeta, el mismo `sizes` con el que se mostrará. Escenas, opciones y consecuencias no cambian |
| `src/components/player/StoryPlayer.tsx` | Pasa ese `sizes` a la precarga |

`comicPanelSizes` produce dos entradas exactas con `min()`, una para horizontal (incluido el límite de alto) y otra general. Después añade un **respaldo** sin `min()`, que un navegador usa si descarta las primeras por no entenderlas. Se comprobó en Chromium que `min()` con `vw` y `vh` funciona en `sizes` y que una entrada no válida se salta. El respaldo nunca se queda corto: como mucho anuncia un 16 % de más en horizontal.

No cambia ninguna proporción ni recorte: `srcset`, `width/height` y `ratio` son los mismos. No hay una resolución fija; cada dispositivo sigue eligiendo dentro de 800w / 1200w / original.

### `currentSrc` antes y después

Variante elegida, con DPR entre paréntesis. «Óptima» = variante más pequeña ≥ ancho × DPR. Datos completos por viñeta en [`phase-9/current-src.json`](phase-9/current-src.json).

| Viewport | Viñeta (ancho) | DPR 1 antes → después | DPR 2 antes → después |
|---|---|---|---|
| 390×844 | todas (358 px) | 800w → 800w ✓ | 800w → 800w ✓ |
| 820×1180 | `k1-2` media (764 px) | **1200w → 800w** | 2048 → 2048 ✓ |
| 820×1180 | `k4-1` completa (764 px) | **1200w → 800w** | 2400 → 2400 ✓ |
| 1180×820 | `k1-2` media (469 px) | **1200w → 800w** | **2048 → 1200w** |
| 1180×820 | `k4-1` completa (966 px) | **800w → 1200w** | **1200w → 2400** |

| Viewport @ DPR | Viñetas óptimas antes → después | Descarga del cómic antes → después |
|---|---|---|
| 390×844 @1 | 15 → 15 | 1,20 → 1,20 MB |
| 390×844 @2 | 15 → 15 | 1,20 → 1,20 MB |
| 820×1180 @1 | **1 → 15** | **2,18 → 1,20 MB** |
| 820×1180 @2 | 15 → 15 | 4,56 → 4,56 MB |
| 1180×820 @1 | **9 → 15** (1 corta, 5 de más, 1 doble descarga) | **1,98 → 1,48 MB** |
| 1180×820 @2 | **9 → 15** (1 corta, 5 de más, 1 doble descarga) | **3,95 → 3,01 MB** |

Las viñetas completas ganan definición en tableta horizontal y las medias dejan de descargar de más.

### Pruebas añadidas

- `src/components/player/comicLayout.test.ts`: 9 tests.
  - El modelo coincide con las medidas de Chromium: 358 / 764 / 966,2 / 469,1 px.
  - Un intérprete mínimo de `sizes` comprueba en 10 viewports, de 360 a 1920 px y en ambas orientaciones, que cada `sizes` anuncia el ancho real.
  - Sin `min()`, el respaldo nunca se queda corto.
- `tests/browser/comic-sizes.mjs`: 15 viñetas × 3 tamaños × DPR 1/2 con caché vacía.
  - Falla si el ancho medido se aparta más de 1 px del modelo (la rejilla cambió sin actualizar `sizes`).
  - Falla si `currentSrc` no es la variante óptima o si una viñeta descarga más de un archivo.
  - **Sin la corrección falla** (820×1180 @1: `k1-2` cargaba 1200w).
- `tests/browser/comic-flow.mjs`: interacción del cómic completo (§4).

## 4. Revisión del cómic completo

| Comprobación | Resultado | Cómo |
|---|---|---|
| Orden narrativo de las 15 viñetas (k1-1 … k7-2) | ✅ | `comic-flow`, `art-batch-4` |
| Carga de todas las imágenes, sin errores ni 404 | ✅ | `art-batch-4`, `comic-flow`, `art-files` (158 archivos) |
| Aparición progresiva: solo la siguiente, una viñeta actual (`aria-current="step"`) | ✅ | `art-batch-4`, `comic-flow` |
| Bocadillos, pensamientos y leyendas, cada uno una vez; comunicador de Lía por casillas y en orden | ✅ | `art-batch-4` |
| 62 regiones protegidas sin intersecciones con bocadillos | ✅ en 390, 820 y 1180 | `art-batch-4` |
| Botón «Descubrir la siguiente viñeta»: nombre accesible, ≥ 48 px; con ratón, flecha → y Tab + Enter | ✅ | `comic-flow` |
| Foco tras descubrir: vuelve al escenario y el primer Tab llega al botón | ✅ | `comic-flow` |
| `aria-live` lee la leyenda y cada bocadillo con su hablante, también «Lía: QUIERO SENTARME CON TEO» | ✅ | `comic-flow` |
| Atrás (botón) y flecha ← ocultan la última viñeta | ✅ | `comic-flow` |
| Recuperación del progreso (`?continuar=1`) | ✅ | `comic-flow`, `quality` |
| Movimiento reducido: sin animación | ✅ | `comic-flow`, `quality` |
| Consola sin errores ni avisos; sin desbordamiento horizontal | ✅ | `comic-flow`, `art-batch-4` |
| Texto alternativo en cada viñeta | ✅ | `comic-flow` |

**Viñetas críticas, revisadas a ojo en los tres tamaños:**

- **`ume-k2-4`.** Cuatro reacciones distintas y contenidas: Aya levanta la mano, Teo mueve los dedos, Lía usa el comunicador, Bruno cruza los brazos. En tableta, los bocadillos de Aya y Bruno van sobre la pared y la ventana. El «NO SÉ» del comunicador va abajo a la derecha, sobre las piernas y la silla de Bruno, sin tapar caras, manos ni el dispositivo.
- **`ume-k6-3`.** Bruno descansa en el puf; Aya, a la derecha, con un libro de volcanes. El comunicador de Lía, elevado, deja libre la mesa, donde se leen sus tres casillas. Los bocadillos superiores no tapan caras.
- **Móvil (390 px).** Todos los bocadillos se leen debajo de la imagen, en orden y con su hablante.

## 5. Experiencia responsive

| Viewport | Ancho de viñeta | Bocadillos | Variante (DPR 1 / 2) |
|---|---|---|---|
| 390×844 | 358 px | Debajo, en lista | 800w / 800w |
| 820×1180 | 764 px | Superpuestos en las zonas reservadas | 800w / original |
| 1180×820 | 966 px completa · 469 px media | Superpuestos en las completas; debajo en las medias (< 32rem) | completa 1200w / 2400 · media 800w / 1200w |

Sin desbordamiento horizontal. Foco visible y sin quedar bajo barras fijas (`focus-obscured`). Con movimiento reducido no hay animaciones, y la nueva viñeta se lleva a la vista sin desplazamiento suave. La aparición progresiva funciona igual con ratón, teclado y gesto. No se ha hecho ningún cambio estético general.

## 6. Experiencia educativa

Sin cambios de contenido.

- Las emociones se representan con respeto y variedad (sorpresa, desagrado, necesidad de tiempo, calma), sin «correcto/incorrecto».
- Los apoyos (cascos, pelota, plan dibujado, puf de descanso) aparecen como recursos cotidianos.
- La comunicación alternativa de Lía tiene voz propia en el cómic y en el lector de pantalla.
- La metáfora de los seis caminos (`k4-1`) no premia ni amenaza ninguno.
- La decisión no tiene límite de tiempo: «Tómate el tiempo que necesites».

**Sigue pendiente de aprobación humana** la frase «de arriba abajo» de `ume-c-horario`. `k6-1` vuelve a mostrar el plan en horizontal, lo que refuerza la propuesta «de principio a fin». No se ha cambiado.

## 7. Herramientas de diseño

Las dos skills siguen instaladas en `.claude/skills/` (excluidas de Git en local) y **aparecen en la lista de skills de esta sesión**. No se han reinstalado ni invocado. No se ha ejecutado ningún hook ni script de terceros; en particular, el hook `Stop` de `design-taste-frontend`.

Se aplicaron a mano las reglas pertinentes de las Web Interface Guidelines:

- Imágenes con dimensiones y `srcset`/`sizes` honestos.
- Prioridad solo en la viñeta visible.
- Botones con nombre, foco visible y alternativa de teclado al gesto.
- Sin `transition: all`.
- Respeto de `prefers-reduced-motion`.

GetDesign no se usó en esta fase.

## 8. Pruebas

Chromium 153 (preinstalado), Playwright 1.63.0 y `@axe-core/playwright` 4.14.0 en `/tmp/nubi-browser-tools`; Vite en `127.0.0.1:5173`. Ejecución final sobre el código definitivo:

| Prueba | Resultado | Tiempo |
|---|---|---|
| `npm run assets:doc` | ✅ 72 recursos, sin diferencias | — |
| `npm run check` | ✅ tipos, **55 tests en 7 archivos** (46 de base + 9 nuevos) y build | — |
| `art-files.mjs` | ✅ 50 recursos / 158 archivos | 8 s |
| `art-layout.mjs` | ✅ 390/820/1180: cargado 118, provisional 42, **error 0**; solo el recorte decorativo previsto de `portada-fondo` | 70 s |
| `art-batch-2.mjs` | ✅ 10 escenas × 3 tamaños | 22 s |
| `art-batch-3.mjs` | ✅ seis decisiones y doce momentos × 3 tamaños | 12 s |
| `art-batch-4.mjs` | ✅ 15 viñetas × 3 tamaños, 62 regiones protegidas | 12 s |
| `quality.mjs` | ✅ cuento, cómic, seis opciones, persistencia, borrado, teclado; axe sin infracciones | 129 s |
| `story-fit.mjs` | ✅ 23 páginas × 3 tamaños × 2 tamaños de letra | 60 s |
| `focus-obscured.mjs` | ✅ | 75 s |
| `narration.mjs` | ✅ | 3 s |
| `screens.mjs` | ✅ | 7 s |
| `comic-sizes.mjs` **(nueva)** | ✅ 15 viñetas × 3 tamaños × DPR 1/2 | 19 s |
| `comic-flow.mjs` **(nueva)** | ✅ | 10 s |

Las pruebas de Codex no se han modificado. Chromium emulado y axe no sustituyen dispositivos físicos, lector de pantalla ni una auditoría WCAG manual.

## 9. Capturas

| | |
|---|---|
| Secuencia completa a 1180 px | [1180-secuencia-15-vinetas.webp](phase-9/1180-secuencia-15-vinetas.webp) |
| `k2-4` reacciones | [390](phase-9/390-k2-4-reacciones.webp) · [820](phase-9/820-k2-4-reacciones.webp) · [1180](phase-9/1180-k2-4-reacciones.webp) |
| `k6-3` comunicador | [390](phase-9/390-k6-3-comunicador.webp) · [820](phase-9/820-k6-3-comunicador.webp) · [1180](phase-9/1180-k6-3-comunicador.webp) |
| Viñeta completa a 1180 (`k4-1`, 1200w) | [1180-k4-1-completa.webp](phase-9/1180-k4-1-completa.webp) |
| Cierre en móvil | [390-k7-2-cierre.webp](phase-9/390-k7-2-cierre.webp) |

## 10. Pendiente

1. **Revisión humana del cómic**, pedagógica y de lectura con niños y niñas. Técnicamente el cómic está listo para ella.
2. **Frase del horario** (`ume-c-horario`): decisión editorial pendiente.
3. **Mejora opcional (D):** en `k2-4`, el «NO SÉ» de Lía va en la esquina inferior derecha, cerca de Bruno. La etiqueta «Lía · comunicador» lo aclara. Acercarlo a Lía exigiría cambiar `bubble.position` en `story.ts` (contenido) y revisar el arte; solo con aprobación humana.
4. **Precarga fuera del cómic.** Escenas, opciones y consecuencias siguen precargando con `sizes = 100vw`. En vertical, las escenas se muestran con su composición 3:4 (`<picture>`), pero la precarga pide la 16:9, así que puede descargar una imagen que no se usa. No forma parte de esta integración: se recomienda medirlo y corregirlo igual que aquí en una fase técnica posterior.
5. Las mejoras D de la fase 7 siguen documentadas en `PHASE_7_REPORT.md` §8.
6. Sin pruebas en dispositivos físicos, lector de pantalla ni zoom del sistema.

## 11. Recomendaciones para el siguiente lote artístico (Codex)

- **Base:** `feat/codex-art-batch-5`, creada desde `integration/phase-9`.
- **Prioridad sugerida:** las **9 emociones** (`emo-*`). Se ven en *Mis emociones* a 64–100 px y sustituyen al vector provisional de Nubi en `GuideArt`, así que necesitan siluetas legibles a ese tamaño, fondo transparente sin halo y la expresión contenida de las hojas maestras. Después, las **7 herramientas** (`tool-*`, 96 px, 1:1 transparente) y los **6 lugares** (`place-*`, 4:3).
- **Variantes:** para transparentes pequeñas basta con 256/512 px, como `nubi-*`. Declarar `variants` en el registro.
- **Sizes:** para tarjetas y rejillas nuevas, la interfaz ya anuncia `sizes` por componente. Si una entrega cambia proporciones o tamaños, avisar para revisar `sizes` (lo comprueban `comic-sizes.mjs` y `art-layout.mjs`).
- **Verificar como en este lote:** `assets:doc`, `check`, `art-files`, `art-layout`, `screens` y `quality`.
- **No cambiar** `bubble.position`, textos ni el contrato de imágenes sin aprobación humana.

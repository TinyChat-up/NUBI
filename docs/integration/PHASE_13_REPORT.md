# NUBI — Fase 13 · Integración final de los 72 recursos

17/11/2026 · Rama `integration/phase-13`, creada desde `integration/phase-11` (`48c0d82`) con `feat/codex-art-batch-6` (`d0ef1de`) fusionada. **Sin merge a `main` y sin despliegue.**

Resumen: el catálogo gráfico está **completo: 72 de 72 recursos listos**. Las siete herramientas aparecen ahora también en el selector «¿Cuáles podrían ayudarte?» del cuento y del cómic, con la API `leading` de `ToggleCard` (fase 11) y la referencia `tools[id].illustration`. *Mi mundo* y *Mis herramientas* muestran sus ilustraciones definitivas sin cambios de código. Se **confirmó y corrigió** el fallo de precarga pendiente de la fase 9: en vertical se descargaba la composición 16:9 que nunca se muestra, y las tarjetas de decisión recibían variantes mayores de las necesarias.

Arte, registros, textos pedagógicos, logotipo y motor narrativo: sin cambios.

---

## 1. Estado de Git

| Dato | Valor |
|---|---|
| Base | `integration/phase-11` @ `48c0d82` |
| Rama artística | `feat/codex-art-batch-6` @ `d0ef1de`: un único commit sobre `48c0d82`. Se comprobó que parte de la base |
| Nueva rama | `integration/phase-13` |
| Commits de la fase | Merge `3fa3ebd` + interfaz y precarga con sus pruebas + documentación |

## 2. Merge y conflictos

`git merge --no-ff origin/feat/codex-art-batch-6` → `3fa3ebd`. **Sin conflictos**, y el árbol resultante es idéntico al de la rama artística.

Se conservan:

- 13 archivos principales: 7 PNG de herramientas de 1024 px y 6 WebP de lugares de 2048 × 1536.
- Las **26 variantes**: herramientas 256/512 y lugares 800/1200.
- 14 originales en `docs/art-batch-6/originals/`.
- `common.ts` (`status: 'listo'` y `variants` en `place()` y `tool()`).
- `tests/browser/art-batch-6.mjs` y `tests/art-batch-6-files.py`.
- `scripts/export-art-batch-6.py`, las láminas (herramientas, legibilidad, lugares, alfa), las 27 capturas de `previews/`, `validation/` y el manifiesto ampliado.

## 3. Catálogo definitivo

Calculado desde los registros: **72 recursos · 72 listos · 0 pendientes**. `npm run assets:doc` no genera diferencias.

| Tipo | Listos |
|---|---|
| Portada | 1 |
| Personajes (Nubi y reparto) | 11 |
| Cubierta | 1 |
| Escenas (todas con composición 3:4) | 10 |
| Opciones y consecuencias | 12 |
| Viñetas | 15 |
| Emociones | 9 |
| **Herramientas** | **7** |
| **Lugares** | **6** |

El audio humano y el vídeo del piloto siguen fuera de este catálogo visual.

## 4. Cambios en React

| Archivo | Cambio |
|---|---|
| `src/components/player/interactions.tsx` | `StrategiesView` pasa `leading` con la ilustración de la herramienta (ver detalle abajo) |
| `src/components/player/imageSizes.ts` **(nuevo)** | `SCENE_SIZES`, `OPTION_CARD_SIZES` y `CONSEQUENCE_SIZES`: los mismos valores que ya usaban `StoryPage` y `interactions`, ahora compartidos con la precarga |
| `src/components/player/StoryPage.tsx`, `interactions.tsx` | Usan esas constantes; sin cambio de valores |
| `src/components/player/presentation.ts` | `upcomingImages()` devuelve el `sizes` con el que se mostrará cada imagen: escena, tarjeta de opción o momento de consecuencia |
| `src/components/illustration/imageSource.ts` | `preload()` precarga la composición vertical en orientación vertical, la misma condición que `<source media="(orientation: portrait)">` |

**`StrategiesView`.** Cuando `hasFinalArt(t.illustration)`, pasa `leading={<Illustration id={t.illustration} decorative ratio fit="contain" sizes="56px" />}`; si no, se mantiene `icon`. El ID sale **solo** del catálogo (`tools[id].illustration`): sin derivarlo de la etiqueta, sin lógica por historia y sin mapas nuevos. Nombre, descripción, selección, marca ✓, borde, foco, `aria-pressed`, selección múltiple y persistencia no cambian. No hay sombras ni efectos nuevos: la imagen ocupa el hueco tintado de 56 × 56 px que ya existía.

Sin cambios en `ToggleCard`, *Mi mundo*, *Mis herramientas* y sus fichas, el motor, los textos ni los estilos globales.

## 5. Selector de estrategias antes y después

| | Antes (fase 11) | Después (fase 13) |
|---|---|---|
| Recurso visual de cada tarjeta | Icono SVG genérico (calendario, mano, bocadillo…) | Ilustración definitiva `tool-*` a 56 px, transparente, `contain`, variante 256w |
| Nombre y descripción | — | Idénticos |
| Accesibilidad | Icono decorativo | Imagen decorativa (`alt=""` en hueco `aria-hidden`); nombre accesible = texto |
| Selección, ✓, `aria-pressed`, foco, persistencia | — | Sin cambios |

Capturas: [390 cuento](phase-13/390-estrategias-cuento.webp) · [820 cómic](phase-13/820-estrategias-comic.webp) · [1180 cuento](phase-13/1180-estrategias-cuento.webp). En las tres, «Anticipar cambios» y «Pedir ayuda» aparecen seleccionadas **después de recargar** con `?continuar=1`.

## 6. Resultados de pruebas

### Pruebas nuevas o ampliadas

- **`src/components/player/strategies.test.ts`** (5 tests):
  - Las 7 herramientas apuntan a un recurso listo, 1:1 y transparente.
  - Las historias solo usan herramientas del catálogo.
  - Cada tarjeta del piloto lleva su `tool-*` decorativo, con `sizes="56px"`, sin duplicar el icono y con el texto intacto.
  - Con un recurso no definitivo, la tarjeta vuelve al icono.
  - Se restaura la selección múltiple guardada.
- **`src/components/player/preload.test.ts`** (5 tests):
  - `upcomingImages` anuncia el `sizes` de la escena, de la tarjeta o de la consecuencia según dónde se mostrará la imagen.
  - `preload()` usa el `srcset` 3:4 en vertical, el 16:9 en horizontal y el normal si no hay composición vertical.
- **`tests/browser/art-batch-6.mjs`** (ampliada; las comprobaciones de Codex no cambian). Añade el selector de estrategias en cuento y cómic × 390/820/1180:
  - ID correcto de cada herramienta, imagen cargada, decorativa, de 56 px, `contain`, dentro de su hueco y servida en 256w.
  - Nombre y descripción conservados; icono sustituido y marca ✓ conservada.
  - Tab y `:focus-visible`; Enter para seleccionar y deseleccionar; selección múltiple.
  - Persistencia tras `?continuar=1`; sin desbordamiento.
  - Listener de errores y avisos de consola.
  - **Sin la integración falla.**
- **`tests/browser/story-preload.mjs`** (nueva). Recorre el cuento completo con las seis consecuencias, en 3 tamaños × DPR 1/2 y con caché vacía. Falla si se descarga una imagen que no se muestra, si un archivo se pide dos veces, si una escena no usa la composición de su orientación o si, con DPR 1, una imagen no es la variante óptima. **Sin la corrección falla** («390×844@1: descargadas y nunca mostradas»).

### Ejecución final sobre el código definitivo

Chromium 153 (preinstalado), Playwright 1.63.0 y `@axe-core/playwright` 4.14.0 en `/tmp/nubi-browser-tools`; Vite en `127.0.0.1:5173`.

| Prueba | Resultado | Tiempo |
|---|---|---|
| `npm run assets:doc` | ✅ 72 recursos, sin diferencias | — |
| `npm run check` | ✅ tipos, **73 tests en 10 archivos** (63 de base + 10 nuevos) y build | — |
| `art-files.mjs` | ✅ **72 recursos / 224 archivos**: hashes, decodificación, dimensiones y alfa | 8 s |
| `art-layout.mjs` | ✅ 390/820/1180: **cargado 204, provisional 0, error 0**; solo el recorte decorativo previsto de `portada-fondo` | 71 s |
| `art-batch-2.mjs` | ✅ 10 escenas × 3 tamaños | 24 s |
| `art-batch-3.mjs` | ✅ seis decisiones y doce momentos × 3 tamaños | 13 s |
| `art-batch-4.mjs` | ✅ 15 viñetas, 62 regiones protegidas | 13 s |
| `art-batch-5.mjs` | ✅ Mis emociones + selector de emociones (cuento y cómic) | 16 s |
| `art-batch-6.mjs` (ampliada) | ✅ 13 recursos / 39 archivos, 27 pantallas + selector de estrategias (cuento y cómic) | 32 s |
| `quality.mjs` | ✅ cuento, cómic, seis opciones, emociones, intensidad, resumen, persistencia, borrado, teclado, vídeo; axe sin infracciones | 132 s |
| `focus-obscured.mjs` | ✅ | 76 s |
| `screens.mjs` | ✅ 9 rutas, axe sin infracciones | 8 s |
| `story-fit.mjs` | ✅ 23 páginas × 3 tamaños × 2 tamaños de letra | 60 s |
| `narration.mjs` | ✅ | 3 s |
| `comic-sizes.mjs` | ✅ | 19 s |
| `comic-flow.mjs` | ✅ | 11 s |
| `story-preload.mjs` (nueva) | ✅ | 54 s |

**Evidencias.** De las pruebas históricas, solo `art-batch-5.mjs` escribe en una carpeta versionada (9 capturas en `docs/art-batch-5/previews/` y `browser-results.json`). Antes de ejecutarla se guardaron los SHA-256 de esos 10 archivos; después se restauraron **solo esos archivos** con `git checkout -- <archivos>` y se comprobó que los hashes coincidían. El resto de pruebas escribe en carpetas temporales (`NUBI_ART_EVIDENCE`, `NUBI_EVIDENCE`, `NUBI_FILE_RESULTS`). No se usaron comandos destructivos generales.

## 7. Capturas de las nuevas ilustraciones integradas

| | |
|---|---|
| Selector de estrategias | [390 cuento](phase-13/390-estrategias-cuento.webp) · [820 cómic](phase-13/820-estrategias-comic.webp) · [1180 cuento](phase-13/1180-estrategias-cuento.webp) |
| Mi mundo | [390](phase-13/390-mundo.webp) · [1180](phase-13/1180-mundo.webp) |
| Mis herramientas | [820 rejilla](phase-13/820-herramientas.webp) · [390 ficha «Pedir ayuda»](phase-13/390-ficha-pedir-ayuda.webp) · [1180 ficha «Usar apoyos sensoriales»](phase-13/1180-ficha-apoyos-sensoriales.webp) |

Las capturas de Codex de las demás fichas siguen en `docs/art-batch-6/previews/`.

## 8. Revisión de Mi mundo y Mis herramientas

**Mi mundo.** Las seis tarjetas muestran su imagen en 4:3 sin recorte, con variantes de 800 y 1200 (800w en DPR 1). Títulos y descripciones son legibles y las rutas funcionan: `/mundo/colegio`, `/mundo/casa`, `/mundo/parque`, `/mundo/amigos`, `/emociones` y `/herramientas`. Las etiquetas son honestas:

- Colegio: «1 historia».
- Casa, Parque y Amigos: «Próximamente» (no hay historias publicadas, no es por falta de imágenes).
- Mis emociones: «Conocer emociones».
- Mis herramientas: «7 herramientas».

No se ha eliminado ningún «Próximamente».

**Mis herramientas.**

- La rejilla muestra 7 tarjetas con imagen transparente de 96 px (256w).
- Las 7 fichas individuales (`/herramientas/<id>`) muestran la imagen de 176–208 px.
- Funcionan «Mi tarjeta», «Marcar: la he probado» (marcador local), la lectura opcional de frases (botón «Escuchar», nunca automática) y la navegación de vuelta.
- Las instrucciones educativas no cambian.

Lo verifican `art-batch-6.mjs` (27 pantallas × 3 tamaños), `screens.mjs` y el recorrido descrito a continuación.

**Recorrido completo de NUBI.** Se rastrearon todas las rutas internas enlazadas desde la portada, 23 por tamaño en 390/820/1180:

- Portada, Mi mundo y sus 4 lugares, Historias, ficha, vídeo, Recreaciones y su recreación.
- Mis herramientas y sus 7 fichas, Mis emociones, Ajustes y Espacio familiar (con y sin `?historia=`).

Resultado: **0 imágenes provisionales, 0 errores de imagen, 0 respuestas ≥ 400**, sin desbordamiento, ningún control < 48 px, todas las `img` con `alt`, un `h1` por pantalla y consola limpia. La única «repetición», `emo-sorpresa` en Mis emociones, es intencionada: rejilla y detalle de la emoción seleccionada.

El reproductor se recorrió paso a paso en cuento (25 pasos) y cómic (20) × 3 tamaños: sin bloqueos, sin errores y con las seis decisiones mostrando su imagen.

**Iconos que permanecen, todos funcionales:**

- Navegación, botones del reproductor y marcas ✓.
- Iconos de tipo de lugar en las tarjetas de Mi mundo.
- Opciones sin emoción del selector de sentimientos (Ganas de saber el plan, Otra cosa, No lo sé).
- Viñetas de «Puede notarse así», pasos numerados de las fichas, `StepHeading` y los chips «Herramientas relacionadas» de cada consecuencia (iconos de 16 px; a ese tamaño la ilustración no se leería).

**El vector de Nubi solo queda en el logotipo de cabecera** (decisión de marca pendiente) y en la página «Este camino no existe».

## 9. Precarga: medición y corrección

**Problema confirmado.** `preload()` usaba siempre el `srcset` horizontal con `sizes = 100vw`:

- En vertical, `<picture>` muestra la composición 3:4, pero la precarga ya había descargado la 16:9.
- En tableta, las tarjetas de decisión (≈ 372 px) recibían 1200w o el original cuando basta 800w.

Medición (cuento completo, seis consecuencias, caché vacía, solo escenas y opciones; datos en [`phase-13/story-preload.json`](phase-13/story-preload.json)):

| Viewport @ DPR | Antes: descargado / sin usar | Después: descargado / sin usar |
|---|---|---|
| 390×844 @1 | 3,79 MB / **10 archivos, 1,42 MB** (las 10 escenas 16:9 de 1200w) | **2,37 MB / 0** |
| 390×844 @2 | 3,79 MB / 10 archivos, 1,42 MB | **2,37 MB / 0** |
| 820×1180 @1 | 4,77 MB / 10 archivos, 1,42 MB | **2,37 MB / 0** |
| 820×1180 @2 | 10,61 MB / **10 archivos, 3,32 MB** (los originales 16:9 de 2400 px) | **5,33 MB / 0** |
| 1180×820 @1 | 3,46 MB / 0 (pero tarjetas a 1200w) | **2,49 MB / 0** (tarjetas a 800w) |
| 1180×820 @2 | 7,32 MB / 0 (todo a 2048/2400) | **5,91 MB / 0** |

En ningún caso hubo peticiones duplicadas. Con DPR 1, después de la corrección todas las imágenes mostradas son la variante óptima: 26, 32 y 31 de 26, 32 y 31. En DPR 2, las miniaturas de 176 px de las preguntas reutilizan la imagen grande ya descargada de la escena, sin coste adicional.

**Corrección** (criterio del cómic): la precarga pide la misma composición y el mismo `sizes` que se mostrará. `<picture>` y las composiciones 3:4 y 16:9 no cambian, no se recorta nada y las ilustraciones no se tocan.

**Regresión:** `story-preload.mjs` falla con el código anterior y pasa con el nuevo; `preload.test.ts` cubre la lógica en Node.

## 10. Accesibilidad

- **Teclado.** Tab recorre tarjetas y controles, Enter selecciona y deselecciona (comprobado; Espacio lo gestiona el `<button>` nativo, sin prueba específica), y el foco es visible (`:focus-visible` comprobado en las tarjetas de estrategias y emociones). `focus-obscured`: ningún foco queda bajo las barras fijas.
- **Nombres accesibles.** Las imágenes de herramientas y emociones en los selectores son **decorativas** (`alt=""`, hueco `aria-hidden`); el texto de la tarjeta es el nombre accesible y no se anuncia dos veces. En las fichas, la ilustración principal conserva su texto alternativo descriptivo.
- **Estado.** `aria-pressed` + borde + ✓; la imagen nunca es el único indicador.
- **Contraste.** axe sin infracciones en `quality` (36 estados), `screens` y Mis emociones.
- **Objetivos táctiles.** 0 controles < 48 px en 23 rutas × 3 tamaños y en todo el reproductor.
- **Texto.** Sin reducciones: etiquetas a 18 px; los ajustes de tamaño de letra se cubren con `story-fit` y `focus-obscured` al 125 %.
- **Movimiento reducido.** Respetado (`quality`, `comic-flow`); no hay animaciones nuevas.
- **Sonido.** No hay audio automático (`narration`); la lectura es siempre una acción del niño o la niña.
- **Sin límites de tiempo.** La decisión dice «Tómate el tiempo que necesites».
- **Gestos.** El deslizamiento tiene alternativa con botones y flechas (`comic-flow`).

**No es una certificación WCAG.** axe y Chromium emulado no sustituyen lector de pantalla, zoom del sistema ni dispositivos reales.

## 11. Riesgos y limitaciones

- **Peso de los PNG principales de herramientas** (0,9–1,2 MB cada uno). La app sirve las variantes de 256 o 512 px (60–300 KB); el principal solo se descargaría a más de 512 px efectivos, lo que hoy no ocurre en ninguna pantalla.
- **Lugares a 2048 px:** exportación ampliada desde 1448 px nativos (documentado por Codex); la app sirve 800w o 1200w.
- **Legibilidad a 56 px:** «Pedir ayuda» y «Expresar desacuerdo» comparten dos figuras (Codex lo advierte). El texto las distingue; conviene validarlo con niños y niñas.
- La precarga vertical decide la orientación en el momento de precargar. Si el dispositivo gira justo después, el navegador descargará la otra composición al mostrarla (como antes, sin bloqueo).
- Pruebas en Chromium emulado en Linux; no hay dispositivos físicos ni lector de pantalla.

## 12. Decisiones humanas pendientes

- **A. Logotipo.** La cabecera sigue usando el vector de Nubi. La propuesta de Codex (`docs/art-batch-2/brand/`) **no se ha activado**.
- **B. Frase del horario.** `ume-c-horario` dice «Teo lo mira entero, **de arriba abajo**», pero el horario ilustrado es **horizontal** (también en `ume-s6-plan` y `ume-k6-1`). Propuesta pendiente: «de principio a fin». **No se ha cambiado.**
- **C. Validación con niños y niñas.** Ninguna ilustración está validada pedagógicamente con usuarios reales. Que las pruebas automáticas pasen no equivale a esa validación.

## 13. Recomendaciones para la siguiente fase

1. **Evaluación humana** del piloto completo con docentes, familias y, con las garantías adecuadas, alumnado:
   - reconocimiento de emociones a 56–64 px,
   - herramientas a 56 px,
   - comprensión del cómic,
   - lectura de las decisiones.
2. Resolver A y B.
3. Revisión con lector de pantalla real (VoiceOver/TalkBack/NVDA), zoom del sistema al 200–400 % y tabletas físicas.
4. Valorar sustituir el Nubi vectorial de «Este camino no existe» por `GuideArt` (cambio menor de interfaz).
5. **Pruebas que escriben evidencias.** Hacer que `art-batch-5.mjs` admita `NUBI_ART_EVIDENCE` como las demás, para no tener que restaurar evidencias versionadas tras cada ejecución.
6. Audio humano y vídeo del piloto, que siguen fuera del catálogo visual.
7. No empezar nuevas historias hasta cerrar la evaluación humana del piloto.

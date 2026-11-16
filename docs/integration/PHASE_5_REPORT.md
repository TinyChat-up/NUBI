# NUBI — Fase 5 · Integración artística y criterio de diseño

16/11/2026 · Rama `integration/phase-5`, creada desde `integration/phase-3a` (`82df812`) con `feat/codex-art-batch-2` fusionada. **Sin merge a `main` y sin despliegue público.**

Resumen: el segundo lote de Codex está integrado sin conflictos. La auditoría encontró **cuatro problemas importantes**, todos corregidos y verificados. El principal: con las nuevas composiciones 3:4, el texto de las páginas de diálogo y de Nubi quedaba tapado por los controles en móvil y en tableta. También se aplicaron siete mejoras pequeñas y se creó [`docs/NUBI_DESIGN_PRINCIPLES.md`](../NUBI_DESIGN_PRINCIPLES.md).

---

## 1. Resultado de la integración artística

- `git merge --no-ff origin/feat/codex-art-batch-2` → `4c9a54f`.
- **10 IDs nuevos** pasan a `listo`: 9 escenas del cuento y la viñeta `ume-k1-1`. Además, `ume-s1-puerta` recibe su composición vertical.
- 52 archivos públicos nuevos:
  - 9 escenas horizontales y 10 composiciones verticales 3:4.
  - 1 viñeta.
  - 30 variantes WebP.
  - Nubi en 512 px (2 PNG).
- Se conservan IDs, rutas, archivos, proporciones, variantes, transparencia, textos alternativos, campos `portrait` y datos educativos. **No se ha modificado ningún archivo gráfico ni ningún registro de recursos.**
- Fuentes servidas, medidas en navegador con `currentSrc`:

| Tamaño | Página de cuento | Archivo servido | Tamaño en pantalla |
|---|---|---|---|
| 390×844 (DPR 2) | Llegada | `s1-puerta-vertical-768w.webp` (3:4) | 335×446 |
| 820×1180 | Llegada | `s1-puerta-vertical-768w.webp` (3:4) | 635×846 |
| 1180×820 | Llegada | `s1-puerta-1200w.webp` (16:9) | 728×410 |

  En vertical se cargan siempre las 3:4 y en horizontal las 16:9 (`art-batch-2.mjs`, 10 escenas × 3 tamaños). No hay recortes ni estiramientos (`story-fit.mjs` compara la proporción mostrada con la natural en las 23 páginas).
- La propuesta de logotipo de cabecera (`docs/art-batch-2/brand/`) **no se ha conectado**: es una decisión de marca pendiente de aprobación humana (ver §10).

## 2. Conflictos de Git

**Ninguno.** `feat/codex-art-batch-2` desciende de `integration/phase-3a`, así que la fusión no tuvo conflictos. Se hizo con `--no-ff` para que quede registrada.

## 3. Estado de los 72 recursos

**24 listos · 48 pendientes · 72 en total.** Hay 10 recursos con composición vertical.

| Tipo | Listos | Pendientes | Listos |
|---|---|---|---|
| Portada | 1 | 0 | `portada-fondo` |
| Personajes | 11 | 0 | `nubi-saludo`, `nubi-pensando`, `char-*` (9) |
| Cubierta | 1 | 0 | `ume-cover` |
| Escenas | 10 | 0 | las 10 escenas del cuento, todas con versión 3:4 |
| Viñetas | 1 | 14 | `ume-k1-1` |
| Opciones y consecuencias | 0 | 12 | — |
| Herramientas | 0 | 7 | — |
| Emociones | 0 | 9 | — |
| Lugares | 0 | 6 | — |

`npm run assets:doc` regenera `docs/ASSET_REQUESTS.md` **sin diferencias** con la versión de Codex.

## 4. Pruebas ejecutadas y resultados

Entorno: macOS 12, Node 24.14, Chrome 150 del sistema, con Playwright y axe-core en una carpeta externa (sin dependencias nuevas en NUBI). Viewports emulados.

| Prueba | Resultado |
|---|---|
| `npm run assets:doc` | 72 recursos; sin cambios |
| `npm run check` | Tipos, **46 tests** (43 anteriores + 3 nuevos de `pageGroup`) y build ✅ |
| `art-files.mjs` | PASS: 24 recursos / 80 archivos (SHA-256, decodificación, dimensiones, alfa) |
| `art-batch-2.mjs` | PASS 390/820/1180: 10 escenas, orientación, proporción, texto, controles, cómic, Nubi |
| `art-layout.mjs` | PASS: 64 cargados, 96 provisionales, **0 errores**, sin recortes narrativos ni desbordamiento |
| `quality.mjs` | PASS 390/820/1180: cuento, cómic, seis opciones, emociones, intensidad, resumen, persistencia, borrado, teclado, vídeo; axe sin infracciones |
| `narration.mjs` | PASS ×2: sin autoarranque, rechazo de voz remota, error asíncrono, detener |
| `screens.mjs` | 9 pantallas sin infracciones axe |
| **`story-fit.mjs` (nueva)** | PASS: 23 páginas × 3 tamaños; con letra normal no hay desplazamiento, imagen inestable ni recorte |
| Auditoría de objetivos táctiles (script propio) | 18 pantallas × 3 tamaños: **0 controles < 48 px** (antes: 4 tipos) |

Ajustes en las pruebas:
- `narration.mjs` y `screens.mjs` tenían `/usr/bin/chromium` escrito a mano. Ahora respetan `CHROMIUM_PATH`, como el resto de scripts. No cambia lo que comprueban.
- **`story-fit.mjs` se validó contra el código anterior:** falla en la primera página en móvil (texto +10 px bajo los controles) y pasa con el código actual.

**No verificado:** dispositivos físicos, Safari/iOS, Firefox, lector de pantalla real, zoom del sistema al 200–400 % y rendimiento en red lenta. Las comprobaciones automáticas no sustituyen la revisión humana de accesibilidad.

## 5. Capturas

En [`phase-5/`](phase-5/): 13 pantallas × 3 tamaños, con nombre `{390,820,1180}-NN-pantalla.webp`.
- **Pantallas:** portada, biblioteca, ficha, primera escena, diálogo, página de Nubi, pregunta de emociones, decisión, consecuencia, cómic, herramientas, emociones y familias.
- **Antes y después:** [`phase-5/antes/`](phase-5/antes/) guarda los tres estados con el problema de texto tapado o fragmentado, para comparar.

## 6. Auditoría con Taste Skill

**Estado de la herramienta:** `design-taste-frontend` **no está instalada** en este equipo; se buscó en `~/.claude/skills`, `.claude/`, `.agents/` y en el repositorio. Se leyó su `SKILL.md` publicado (v2.5.1, `Leonxlnx/taste-skill`) y se aplicó su lista de comprobación a mano. **No se ejecutaron sus scripts** (`gate.mjs`, `check.mjs`…), porque el brief prohíbe ejecutar scripts externos no revisados. No hay, por tanto, resultados de «GATE» que informar.

La skill está orientada a webs de empresa; lo que se aplica y lo que se descarta está en `NUBI_DESIGN_PRINCIPLES.md` §13. Evaluación con su criterio útil (sistema, bordes, ritmo, proporción, equilibrio, movimiento):

**A. Portada.** Se entiende qué hacer: dos acciones, la principal destacada. El paisaje transmite identidad. *Mejora:* Nubi tenía poco protagonismo (144–192 px; en 1180 quedaba sobre el follaje y competía con el árbol). → 160 / 224 / 240 px. Sin exceso decorativo: las nubes CSS se retiraron en la fase 4. El espacio crema entre los botones y el paisaje en 820 se mantiene: es una pausa visual, no un hueco (*preferencia*).

**B. Biblioteca.** Las historias se distinguen por su cubierta real. Jerarquía: título → filtros por lugar → tarjetas. La tarjeta «Más historias en camino» es honesta y discreta. Parece infantil sin ser infantilona. Sin cambios.

**C. Cuento.**
- *Importante:* el texto no siempre se relacionaba con la escena de forma visible. En vertical, los diálogos y las páginas de Nubi quedaban cortados bajo los controles, sin indicación (antes: 390 y 820). → Corregido (§9.1).
- *Importante:* en la doble página (1180), el texto de Nubi caía en una columna de ~220 px, con 1–2 palabras por línea. → Corregido.
- La ilustración es protagonista en todas las orientaciones: hasta 635×846 en tableta vertical.
- Los controles están bien situados; los de 12 px pasan a 14 px.

**D. Cómic.**
- Orden de viñetas claro, con un botón «Descubrir la siguiente viñeta» inequívoco.
- Los bocadillos no tapan caras. En 390 y 1180 van debajo de la viñeta, porque esta es estrecha.
- *Mejora:* las etiquetas de hablante pasan de 12 a 14 px.

**E. Decisiones.**
- Las opciones se entienden: imagen + pictograma + texto, y el enunciado «Hay varias posibilidades… Después puedes probar otras».
- No hay juicio de correcto o incorrecto; se marca «Ya la exploraste».
- Las consecuencias son una tira numerada más cuatro reflexiones.
- *Pendiente de arte:* opciones y consecuencias siguen con placeholders vectoriales, que contrastan mucho con el gouache de las escenas. Es la prioridad visual n.º 1 para Codex.

**F. Emociones y herramientas.** Objetivos táctiles amplios, rejilla clara de 2–3 columnas y sin sobrecarga. Iconografía provisional pendiente de arte (`emo-*`, `tool-*`).

**G. Espacio familiar.**
- Se distingue claramente: puerta con pregunta para adultos, tono adulto y texto más denso.
- Información útil sin métricas: aviso explícito de que no hay diagnósticos ni puntuaciones.
- *Importante:* los enlaces «Fuente» medían 25 px y abrían otra pestaña sin avisar. → Corregido.

**Coherencia del sistema (Taste: «un sistema»).** Una familia de botones (`ui.tsx`) y una de tarjetas. La escala de radios usaba notaciones distintas para el mismo valor (`rounded-[1.75rem]` = `--radius-card`, `rounded-[1.5rem]` = `rounded-3xl`). → Unificado sin cambio visual.

## 7. Auditoría con Vercel Web Interface Guidelines

**Estado de la herramienta:** `web-design-guidelines` **no está instalada**. Su `SKILL.md` (`vercel-labs/agent-skills`) consiste en descargar las reglas de `vercel-labs/web-interface-guidelines/command.md` y aplicarlas a los archivos, que es lo que se hizo: reglas descargadas y aplicadas a `src/components`, `src/screens`, `src/index.css` e `index.html`.

### Incumplimientos objetivos (corregidos)

```text
src/components/player/StoryPage.tsx      texto de página tapado por los controles sin indicación (contenido inaccesible sin desplazar)
src/components/AppShell.tsx:51           enlaces de navegación 45 px de alto (< 48 px de AGENTS.md §4)
src/components/AppShell.tsx:68           «Ajustes» solo icono 46 px de ancho en móvil
src/components/AppShell.tsx:38           enlace del logo 43 px de alto
src/screens/FamilyScreen.tsx:306         enlace externo 25 px; abre pestaña nueva sin anunciarlo; nombre «Fuente» repetido sin contexto
src/components/player/SceneMenu.tsx:39   diálogo sin overscroll-behavior: contain
src/content/stories/una-manana-diferente/story.ts (guía)  comillas rectas "…" en texto visible → «…»
src/content/references.ts:38,57,68       ídem
```

### Cumple (comprobado)

Foco visible con `:focus-visible` (anillo doble; ningún `outline-none` sin sustituto). Además:
- `prefers-reduced-motion` y dos interruptores más.
- Solo se anima `transform`/`opacity`; no hay `transition: all`.
- `<img>` con `width`/`height`, `fetchpriority` en la visible y `loading="lazy"` en el resto.
- `aria-live` en el cambio de paso.
- Controles con nombre accesible; `<button>` para acciones y `<a>` para navegación.
- Enlace de salto y jerarquía de títulos.
- Gestos (deslizar) con alternativa de botón y teclado.
- Sin bloqueo de zoom; `viewport-fit=cover` y `safe-area-inset-bottom`.
- `theme-color` igual al fondo.
- Confirmación antes de reiniciar el progreso.
- Puntos suspensivos tipográficos.

### Observaciones sin cambio (decisión o preferencia)

```text
src/components/player/StoryPlayer.tsx:278  antetítulo 12 px en mayúsculas: redundante con el título; se mantiene (excepción documentada)
src/index.css:176-181                      text-wrap: balance global anula `truncate` en h1–h3; el título del reproductor ocupa 2 líneas en vez de cortarse; se considera preferible para niños (no se pierde texto)
src/screens/StoriesScreen.tsx:12           filtro de biblioteca no reflejado en la URL; con una historia no aporta; revisar cuando haya más
src/components/player/StoryPlayer.tsx:331  «Subtítulos» deshabilitado en modo Leer sin explicar por qué (WCAG exime los controles deshabilitados) → propuesta §10
```

Se descartan por no aplicar a NUBI: *Title Case* (norma del inglés), virtualización de listas, `autocomplete` en formularios (no hay formularios de datos), `Intl.*` (no hay fechas ni cantidades), modo oscuro.

## 8. Principios aprovechados de DESIGN.md

**Estado:** el archivo `DESIGN.md` **no existía** en el proyecto ni en el equipo, así que `npx getdesign@latest add claude` no se había ejecutado. **No se ejecutó ahora:** sería ejecutar un script externo no revisado, y modificaría el repositorio. El paquete npm `getdesign` (0.6.26) publica sus plantillas desde `VoltAgent/awesome-design-md`. Se leyó desde allí el mismo archivo (`design-md/claude/DESIGN.md`), solo como referencia, y **no se ha añadido a NUBI** (es un análisis de la marca de otra empresa).

Se aprovechan, adaptados:
- Escala de radios jerárquica y cerrada.
- Profundidad por bloques de color con sombras escasas.
- Acento cálido reservado: el coral no es color de acción.
- Ritmo editorial con espacio uniforme y base de 4 px.
- Rejillas que reducen columnas en vez de encoger tarjetas.

**No se adopta:**
- Paleta, tipografía serif, superficies oscuras, marca, patrones conversacionales.
- Botones de 40 px, iconos de 36 px y botones de 14 px (todos por debajo del mínimo infantil).

Detalle en `NUBI_DESIGN_PRINCIPLES.md` §13.

## 9. Cambios concretos realizados

### 9.1 Página de cuento: composición según el contenido (IMPORTANTE)

[`StoryPage.tsx`](../../src/components/player/StoryPage.tsx), [`StoryPlayer.tsx`](../../src/components/player/StoryPlayer.tsx), [`presentation.ts`](../../src/components/player/presentation.ts)

- **Problema:** la ilustración vertical reservaba un hueco fijo de 24 rem para cabecera, controles y texto. Con las composiciones 3:4 de Codex bastaba para la narración corta, pero no para diálogos ni para Nubi. Resultado: texto cortado bajo los controles (390: no se veía ni a Nubi; 820: última línea del bocadillo de Andrés).
- **Solución:** en vertical, el texto ocupa su alto natural y la ilustración llena el resto. La caja de la imagen es un contenedor (`container-type: size`) y la imagen mide `mín(ancho, alto × proporción)`, así que nunca se recorta. Mínimo: 30 % de la pantalla; con letra al 125 % la página se desplaza en vez de tapar nada.
- **Estabilidad (contrato §6 de `ILLUSTRATION_INTEGRATION.md`):** las páginas seguidas que comparten ilustración apilan sus textos invisibles (`invisible` + `aria-hidden` + `inert`) en la misma celda. El bloque mide lo que el más largo y la imagen no cambia de tamaño al pasar página. Lo resuelve `pageGroup()`, con 3 tests unitarios.
- **Nubi** pasa encima de su bocadillo, junto a su nombre, en lugar de ocupar ancho a su lado. El bocadillo usa todo el ancho: en 1180, 4–5 palabras por línea en vez de 1–2.
- **Doble página:** columnas `2fr / minmax(20rem, 1fr)` (antes `2.3fr / 17rem`).
- **`sizes` honesto** (`85vw` en vertical, `62vw` en la doble página): en vertical se descarga la variante de 768 px en lugar de la de 1024 px, unos 35–40 % menos por escena, con resolución suficiente (670 px necesarios a DPR 2).
- **Nota técnica:** con `flex: 1 1 0%` dentro de un contenedor de alto indefinido, Chrome resuelve `cqh` a 0 y la imagen desaparece. Se usa altura base 0 + `flex-basis: auto` + `grow`; queda documentado en el código.

### 9.2 Objetivos táctiles ≥ 48 px (IMPORTANTE)

Enlaces de navegación, «Ajustes» y «Familias» en móvil, logo de cabecera y enlaces «Fuente» del espacio familiar.

### 9.3 Texto infantil ≥ 14 px (IMPORTANTE)

Etiquetas de los botones del reproductor (Repetir, Leer, Subtítulos, Animaciones), roles del reparto en la ficha y etiquetas de hablante del cómic: de 12 a 14 px.

### 9.4 Mejoras

- **Portada:** Nubi a 160 / 224 / 240 px (aprovecha la variante de 512 px de Codex).
- **Enlaces «Fuente»:** texto accesible «Fuente: autor (se abre en otra pestaña)».
- **Diálogo de escenas:** `overscroll-contain`.
- **Comillas latinas** en la guía para familias y en los fundamentos. Solo cambia el glifo; el texto educativo no varía.
- **Radios:** notaciones equivalentes unificadas (sin cambio visual).
- **Pruebas:** `CHROMIUM_PATH` en `narration.mjs` y `screens.mjs`; nueva `tests/browser/story-fit.mjs`.

### 9.5 Documentación

- Nuevo [`docs/NUBI_DESIGN_PRINCIPLES.md`](../NUBI_DESIGN_PRINCIPLES.md).
- [`VISUAL_GUIDE.md`](../VISUAL_GUIDE.md) al día: Nubi ya tiene arte final, repertorio de movimiento, 48 px, 14 px y enlace a los principios.
- [`ILLUSTRATION_INTEGRATION.md`](../ILLUSTRATION_INTEGRATION.md): `portrait` en uso, cómo se dimensiona la página y tamaños reales para el arte.

## 10. Mejoras propuestas, no implementadas (requieren decisión humana)

1. **Controles del reproductor en móvil.** Ocupan unos 165 px (20 % del alto) en dos filas. Una sola fila daría ~70 px más a la ilustración, pero obligaría a esconder herramientas tras un menú (peor descubrimiento) o a quitar etiquetas (peor comprensión). Conviene probarlo con niños antes de decidir.
2. **Escenas pequeñas en grupos con Nubi (móvil).** En la biblioteca y la salida, la imagen baja a 199–236 px de ancho porque el grupo reserva el alto del texto de Nubi. Alternativas:
   - (a) aceptar el compromiso, que es lo actual;
   - (b) acortar esos textos de Nubi (decisión de contenido; existe `short`);
   - (c) dejar de estabilizar el tamaño en móvil (contradice el contrato de imagen quieta).
3. **«Subtítulos» deshabilitado en modo Leer.** Ocultarlo cuando no aplica o añadir «Solo al escuchar». Cambia el diseño del reproductor, que se ha probado así.
4. **Filtro de biblioteca en la URL** (`?lugar=`), cuando haya varias historias.
5. **Logotipo de cabecera de Codex.** Si se aprueba, sustituiría al vector `Logo` de `AppShell.tsx` a 40 px, con 80 px para DPR 2; hace falta registrarlo como recurso. **Decisión de marca: humana.**
6. **Antetítulo del reproductor** a 13–14 px, si se prefiere la regla de 14 px sin excepciones.
7. **Doble página (1180×820):** queda ~120 px de aire arriba y abajo de una escena 16:9, inevitable con texto lateral. Se acepta como pausa visual (*preferencia*).

Descartado por preferencia o por chocar con la identidad: entrada animada de la portada, zoom al pasar el ratón, fotografías, «una sección por pantalla», *Title Case* y tipografía serif.

## 11. Recomendaciones para la siguiente entrega de Codex

Por impacto en la experiencia:

1. **Opciones y consecuencias (12).** Hoy son el mayor salto visual: escenas en gouache junto a decisiones con vectores planos. Formato 4:3, mostradas enteras a ~350–550 px de ancho.
2. **Viñetas del cómic (14 pendientes).** Mantener la norma de `ume-k1-1`: reservar las esquinas de `bubble.position`. En 390 y 1180 los bocadillos van debajo, así que la composición debe leerse sin ellos.
3. **Emociones (9) y herramientas (7).** Deben leerse a 64–100 px: siluetas simples, expresión clara y transparencia limpia.
4. **Lectura a tamaño pequeño.** En móvil una escena 3:4 puede verse a ~200×265 px: caras y apoyos (cascos, comunicador) deben seguir siendo reconocibles a ese tamaño.
5. **Lugares (6)** para «Mi mundo».
6. **Logotipo:** a la espera de la decisión de marca. Si se aprueba, exportarlo con fondo transparente a 40, 80 y 160 px.
7. **Resolución nativa.** Codex ya declara que los maestros están remuestreados desde ~1672 px. Para pantalla es suficiente; para impresión, generar a resolución nativa.

---

*Rama lista para revisión humana. No se ha hecho merge a `main` ni ningún despliegue.*

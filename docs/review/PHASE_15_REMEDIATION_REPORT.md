# NUBI — Fase 15 · Correcciones de accesibilidad previas al piloto

17/11/2026 · Rama `feat/claude-pilot-remediation`, creada desde `review/phase-14-pilot-readiness` (`d20171d`). Referencia técnica: `integration/phase-13` (`779f554`), con el mismo código de aplicación que la base. **Sin merge a `main`, sin despliegue y sin cambios en historias, textos educativos, personajes, ilustraciones ni logotipo.** El estado de validación sigue en `pendiente-validacion`.

## Resumen

| Problema (fase 14) | Estado |
|---|---|
| **C-01**: con zoom del 400 % el reproductor deja 5 px de contenido | **Corregido** y cubierto por la prueba de regresión `tests/browser/reflow.mjs` |
| **C-02**: «Textos cortos» no llega a las consecuencias | **Infraestructura implementada** (esquema, resolución única para pantalla, lector de pantalla y narración, validador, pruebas). **Sin contenido nuevo**: los textos cortos los escribe y aprueba una persona |
| **C-03 / P-02**: la lectura fácil de la escena 2 pierde la CAA de Lía | **Preparado para aprobación** (parche exacto + coherencia). No aplicado |
| D-02 (horario) y D-07 («Salir sin avisar») | **Preparados para aprobación** (parches exactos). No aplicados |

---

## 1. Zoom del 400 % (C-01, WCAG 1.4.10)

### Causa

- El reproductor ocupa exactamente la ventana (`h-dvh`): cabecera arriba, controles abajo y en medio un escenario con desplazamiento propio.
- A 320×256 px CSS, la cabecera mide 82–102 px y los controles 169 px (dos filas en pantallas estrechas), así que el escenario se queda en 5 px.
- En las demás pantallas, la cabecera pegajosa (73 px) y la barra inferior fija (96 px) ocupaban 169 de 256 px.

### Corrección

Comportamiento:

- Cuando las barras ocupan **más de la mitad** de la ventana, se activa la **ventana baja**. Se mide de verdad, porque su alto depende del ancho y del tamaño de letra elegido.
- En ventana baja, las barras **dejan de ser fijas** y la página se desplaza en vertical de forma natural.
- **No se quita ningún control.** Al cambiar de paso, la página muestra el principio del paso nuevo.
- Se sale de la ventana baja por debajo del 45 % (histéresis), para que no alterne al aparecer la pista de la decisión.

| Archivo | Cambio |
|---|---|
| `src/lib/useTightViewport.ts` **(nuevo)** | `nextTight()` (lógica pura) y el hook `useTightViewport()`, que mide las barras con `ResizeObserver` y `resize` y marca `<html data-tight>` |
| `src/components/player/StoryPlayer.tsx` | En ventana baja, raíz `min-h-dvh` en lugar de `h-dvh`, y escenario sin desplazamiento propio. Al cambiar de paso, `scrollIntoView` del principio del contenido |
| `src/components/AppShell.tsx` | En ventana baja, cabecera `static` (antes `sticky`) y navegación inferior `static` (antes `fixed`) |
| `src/components/ui.tsx`, `src/index.css` | En ventana baja: `scroll-padding` de 1 rem (ya no hay barras que esquivar) y sin la reserva de 128 px para la barra inferior |

### Antes y después

Datos de `tests/browser/reflow-probe.mjs` y `tests/browser/reflow.mjs` (Chromium emulado; el zoom se emula con el viewport equivalente en px CSS).

| Viewport | Pantalla | Antes | Después |
|---|---|---|---|
| 320×256 (400 %) | Cuento / cómic | Barras fijas 251 px; **contenido visible 5 px** | Sin barras fijas; el contenido usa los 256 px y la página se desplaza. Cuento (con la decisión) y cómic **completados** |
| 320×256 (400 %) | Pantallas generales | Barras fijas 169 px; contenido 87 px | Sin barras fijas; 256 px |
| 640×512 (200 %) | Cuento | Escenario 275 px, barras fijas | **Igual** (sin cambios) |
| 320×568 (400 % vertical) | Cuento | Escenario 317 px, barras fijas | **Igual** |
| 390×844, 820×1180, 1180×820 | Todas | Diseño habitual | **Igual**: barras fijas, controles visibles sin desplazar |

**Casos límite medidos:**

- Móvil apaisado de 844×390: modo normal.
- Móvil apaisado de 667×375: pasa a ventana baja, porque las barras ocupan el 52 %; es la frontera elegida.
- Letra al 125 % en 390×844, 820×1180 y 1180×820: modo normal.
- Letra al 125 % en 844×390 y 640×512: ventana baja.
- El diálogo «Mi tarjeta» cabe a 320×256 con «Cerrar tarjeta» visible.

**Capturas a 320×256** (DPR 2):

| | Antes | Después |
|---|---|---|
| Cuento al abrir | [antes](phase-15/320x256-antes-cuento-abrir.webp) | [después](phase-15/320x256-despues-cuento-abrir.webp) |
| Página 3 tras avanzar | [antes](phase-15/320x256-antes-cuento-p3.webp) | [después](phase-15/320x256-despues-cuento-p3.webp) |
| Controles | [antes](phase-15/320x256-antes-cuento-p3-controles.webp) | [después](phase-15/320x256-despues-cuento-p3-controles.webp) |
| Mi mundo | [antes](phase-15/320x256-antes-mundo.webp) | [después](phase-15/320x256-despues-mundo.webp) |
| Tarjeta «Necesito ayuda» | — | [después](phase-15/320x256-despues-tarjeta.webp) |

### Pruebas

- **`tests/browser/reflow.mjs`** (nueva):
  - En 390×844, 820×1180, 1180×820, 640×512 y 320×568, el diseño no cambia: cabecera pegajosa, escenario con desplazamiento propio, controles visibles sin desplazar y escenario de al menos 200 px.
  - A 320×256 se completan **cuento y cómic**. En cada paso, el principio del contenido queda a la vista, y **cada texto y control puede llevarse a la vista sin quedar tapado** (comprobado con `elementFromPoint`, controles ≥ 48 px). «Siguiente» enfocado con teclado es visible.
  - En 8 pantallas generales, el foco con Tab nunca queda tapado ni fuera de la vista.
  - Sin desbordamiento horizontal ni errores de consola.
  - **Sin la corrección falla.** Además del atributo de ventana baja, falla por acceso real: «320×256/cuento/paso 0» tiene textos tapados.
- **`src/lib/useTightViewport.test.ts`** (4 tests): umbral con las medidas reales e histéresis.

## 2. Infraestructura de «Textos cortos» (C-02)

**Contenido completo por defecto. Solo cambia lo que tenga una versión corta escrita.**

| Archivo | Cambio |
|---|---|
| `src/engine/types.ts` | `Consequence.short?: ConsequenceShort`, campo a campo (`story[]`, `youMayFeel`, `othersMay`, `helpsWhen`, `keepInMind`, `anotherWay`). Documentado como texto editorial explícito |
| `src/engine/readable.ts` **(nuevo)** | `readableBeat()` y `readableConsequence()`: si el ajuste está activo y existe una versión corta no vacía, la usa; si no, el texto completo. Sin truncado, sin generación ni IA |
| `src/components/player/StoryPlayer.tsx` | Páginas, región `aria-live` y narración usan la **misma** función, así que el lector de pantalla y la voz dicen lo que se ve. La consecuencia recibe el ajuste |
| `src/components/player/interactions.tsx` | `ConsequenceBody` acepta `short` y muestra los textos resueltos |
| `src/screens/RecreationsScreen.tsx` | La recreación respeta el mismo ajuste |
| `src/engine/validate.ts` | Rechaza versiones cortas vacías (también en páginas), más momentos cortos que momentos y `anotherWay` corto sin texto completo |

**Garantías:**

- Las respuestas no dependen del ajuste: se guardan aparte y se conservan al cambiarlo (comprobado en el navegador).
- El piloto no tiene aún versiones cortas de consecuencias, así que su comportamiento es idéntico (test explícito).

**Pruebas:**

- `src/engine/readable.test.ts` (8 tests): resolución, campos parciales, piloto sin cambios y validador.
- `src/components/player/consequence.test.ts` (2 tests): render con y sin el ajuste, con datos sintéticos.
- `tests/browser/short-text.mjs`, en 390×844 y 1180×820:
  - Las 20 páginas muestran su versión corta si existe.
  - `aria-live` coincide exactamente con el texto visible.
  - La consecuencia vuelve al texto completo.
  - Cambiar el ajuste a mitad de la historia conserva la emoción y la intensidad elegidas.

**Textos que necesitan versión corta:** inventario completo en `EDITORIAL_APPROVAL_PHASE_15.md` §E-4. Prioridad 1: 37 textos de consecuencias (603 palabras). Prioridad 2: 4 páginas sin `short`.

## 3. Textos que requieren aprobación

Están en `EDITORIAL_APPROVAL_PHASE_15.md`, con parches exactos en `docs/review/phase-15/` y comprobación de coherencia:

- **E-1 (D-05)**: «Aya pregunta. Bruno protesta. Lía usa su comunicador.» Recupera la CAA, quita las emociones atribuidas y tiene 8 palabras.
- **E-2 (D-02)**: «Teo lo mira entero, de principio a fin.»
- **E-3 (D-07)**: «Salir sin avisar», con lenguaje inclusivo, frases más cortas, invitación en lugar de imperativo y sin «pedir explicaciones».

Aplicados juntos a modo de prueba: validador y 87 tests correctos; después se restauró `story.ts` (hash idéntico).

## 4. Resultado de las pruebas

Ejecución final sobre el código de esta rama. Chromium 153 emulado, Playwright 1.63, axe-core 4.14; Vite en `127.0.0.1:5173`.

| Prueba | Resultado | Tiempo |
|---|---|---|
| `npm run check` | ✅ tipos, **87 tests en 13 archivos** (73 de base + 14 nuevos) y build | — |
| `reflow.mjs` **(nueva)** | ✅ diseño habitual intacto en 5 tamaños; a 320×256 cuento (24 pasos) y cómic (19) completados, todo alcanzable sin quedar tapado; 8 pantallas generales con foco visible | 21 s |
| `reflow-probe.mjs` (diagnóstico) | ✅ 0 pantallas con menos de 120 px útiles (antes: 9) | 16 s |
| `short-text.mjs` **(nueva)** | ✅ 390×844 y 1180×820: 20 páginas, `aria-live` = texto visible, consecuencia completa, respuestas conservadas | 15 s |
| `quality.mjs` | ✅ cuento, cómic, seis opciones, emociones, intensidad, resumen, persistencia, borrado, teclado y vídeo × 3 tamaños; axe sin infracciones | 129 s |
| `focus-obscured.mjs` | ✅ 12 rutas × 3 tamaños × 2 tamaños de letra | 75 s |
| `story-fit.mjs` | ✅ 23 páginas × 3 tamaños × 2 tamaños de letra | 60 s |
| `comic-flow.mjs` | ✅ 15 viñetas, teclado, Atrás, recuperación del progreso | 10 s |
| `story-preload.mjs` | ✅ sin descargas sin usar ni duplicadas | 55 s |
| `narration.mjs` | ✅ | 2 s |
| `screens.mjs` | ✅ 9 rutas, axe sin infracciones | 8 s |
| `art-files.mjs` | ✅ 72 recursos / 224 archivos | 8 s |
| `art-layout.mjs` | ✅ 0 provisionales, 0 errores | 71 s |
| `art-batch-2.mjs` | ✅ | 23 s |
| `art-batch-3.mjs` | ✅ seis decisiones y doce momentos con texto exacto (consecuencias resueltas con `readableConsequence`) | 14 s |
| `art-batch-4.mjs` | ✅ 15 viñetas, 62 regiones protegidas | 13 s |
| `art-batch-5.mjs` | ✅ (evidencias restauradas, hashes idénticos) | 16 s |
| `art-batch-6.mjs` | ✅ incluido el selector de estrategias | 33 s |
| `comic-sizes.mjs` | ✅ | 20 s |

`art-batch-5.mjs` se ejecutó con el procedimiento de conservación: hashes guardados, restauración solo de sus 10 archivos y hashes comprobados idénticos.

**No se ha ejecutado:** VoiceOver, TalkBack, NVDA, zoom real del sistema, dispositivos físicos, Safari y Firefox (`MANUAL_ACCESSIBILITY_PROTOCOL.md`: siguen **PENDIENTES DE EJECUCIÓN MANUAL**), ni ninguna prueba con niños y niñas. La emulación del zoom por viewport es equivalente en px CSS, pero no sustituye la prueba M-06 con zoom real.

## 5. Problemas pendientes

- **C-02, contenido:** faltan los textos cortos (E-4). Hasta que existan, «Textos cortos» sigue sin simplificar las consecuencias.
- **C-03, D-02 y D-07:** pendientes de aprobación humana.
- **Frontera de la ventana baja:** en el móvil apaisado más pequeño (667×375) el reproductor pasa a página desplazable (las barras ocupan el 52 %). Es aceptable según el criterio, pero conviene observarlo en el piloto si se usan móviles en horizontal.
- **Pruebas manuales M-01 a M-16:** sin ejecutar.
- **Resto de hallazgos y decisiones de la fase 14** (D-01, D-03, D-06, D-08 a D-15; hipótesis pendientes de validación): sin cambios.

## 6. Recomendaciones para el piloto

1. Aprobar o ajustar **E-1** antes de cualquier sesión con niños y niñas: es la corrección de la representación de la CAA.
2. Si en el piloto participan niños o niñas que usan «Textos cortos», escribir y aprobar antes al menos las versiones cortas de las consecuencias. Si no, dejar escrito que el piloto no evalúa la lectura fácil de las consecuencias.
3. Ejecutar M-06 (zoom real del 400 %) para confirmar la corrección fuera de la emulación, junto con M-01 o M-03, M-09, M-10 y M-12 en los dispositivos del piloto.
4. Mantener `pendiente-validacion` hasta la revisión profesional, de personas autistas adultas y de familias (`CONTENT_STANDARD.md` §8).

## 7. Commits

- `efa4f22`: corrección del zoom del 400 % y prueba de regresión.
- `fdb9ed7`: infraestructura de textos cortos y pruebas.
- Documentación de la fase (este informe, la aprobación editorial y los parches).

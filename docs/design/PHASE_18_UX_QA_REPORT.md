# NUBI · Revisión UI/UX y portada inmersiva · Fase 18

Rama: `review/phase-18-ux-qa`, creada desde `feat/codex-ux-infantil-v1` (`176e30d`, rediseño de Codex, fase 17). Versión anterior de referencia: `review/phase-16-short-text-drafts` (`e9793cc`). Sin merge a `main` ni a `integration/phase-13`, sin despliegue; la rama de Codex queda intacta.

Comparativa visual de la portada: **[PHASE_18_HOMEPAGE_COMPARISON.md](PHASE_18_HOMEPAGE_COMPARISON.md)**.

> **Ninguna conclusión de este informe procede de sesiones con niños o niñas.** No se ha realizado ninguna. Todo lo que dependa de la experiencia del alumnado figura como hipótesis (§7).

## 1. Resumen

| | |
|---|---|
| Portada | Vuelve a ser un hero ilustrado a pantalla completa (100 % de la primera pantalla en 390, 820, 1180 y 1440 px, frente al 22–35 % de Codex). Conserva la entrada única, Ajustes/Familias con palabra y Nubi oficial |
| Resto del rediseño | Se conserva. Dos errores demostrables corregidos en Consecuencias; nada más se ha rediseñado |
| Logotipo | Sin cambios (decisión pendiente). La nube de 40 px tiene contraste muy bajo sobre crema; documentado en §5 |
| Pruebas | `npm run check`: 14 archivos, **90 tests** (87 de base + 3 nuevos). 20 suites de navegador en verde + 2 nuevas (`homepage.mjs`, `consequence-routes.mjs`) |
| Protegido | Sin cambios en `src/content`, `src/engine`, `public/` (72 ilustraciones, personajes, historias, motor), respuestas guardadas, preferencias, borradores y parches de las fases 15/16, ni estado de validación |

## 2. Corrección de la portada

**Problema (B, Codex):** el paisaje `portada-fondo` aparecía como una imagen rectangular con radio y sombra dentro de una página crema, con grandes espacios vacíos; ocupaba entre el 22 % (móvil) y el 35 % (ordenador) de la primera pantalla.

**Solución (C):** `src/screens/HomeScreen.tsx` y las reglas `.home-hero*` de `src/index.css`.

- `portada-fondo` como fondo decorativo a sangre: `fit="cover"`, `sizes="100vw"`, prioridad de carga, punto focal del registro (50 % / 66 %) → el colegio queda centrado en todas las orientaciones. Sin tarjeta, radio, sombra ni borde; sin deformación (proporción natural 16:9 comprobada).
- Arriba a la derecha, **Ajustes** y **Familias** como pastillas crema discretas con icono y palabra (≥ 48 px).
- En el cielo, Nubi oficial (96 px en móvil, 144 px desde 640 px) junto a **NUBI** y el subtítulo, con un halo crema en el texto en lugar de una caja opaca; debajo, el único botón principal **«Entrar en mi mundo»**.
- Abajo, la nota «Sin sonidos inesperados · Sin prisas».
- `min-height: 100dvh` (no altura fija): con zoom alto la portada crece y se desplaza en vertical. Por debajo de 360 px, Nubi se apila sobre el título (sin esto «NUBI» se recortaba a 320×256).
- Se retiraron las reglas de la portada de Codex (`.home-cover`, `.home-spread`, `.home-landscape`…), que solo usaba esta pantalla.
- Ajuste de `tests/browser/ux-redesign.mjs` (Codex): la portada espera `object-fit: cover` en lugar de `contain`, con el motivo comentado. El resto de esa prueba no cambia.

Resultados medidos (detalle y capturas A/B/C en el documento comparativo):

| Viewport | Ilustración en 1.ª pantalla (A / B / C) | Fin del botón (C) | Reloj del colegio (C) |
|---|---|---|---|
| 390×844 | 33 % / 22 % / **100 %** | 282 px | x = 180 px |
| 820×1180 | 52 % / 33 % / **100 %** | 308 px | x = 389 px |
| 1180×820 | 100 % / 30 % / **100 %** | 308 px | x = 575 px |
| 1440×900 | 100 % / 35 % / **100 %** | 308 px | x = 704 px |

**Prueba de regresión nueva:** `tests/browser/homepage.mjs`. A 390×844 (DPR 2), 820×1180, 1180×820 y 1440×900 comprueba: la ilustración cubre toda la primera pantalla, `cover`, 16:9, sin tarjeta, resolución suficiente; el reloj del colegio centrado (30–70 % del ancho) y el bloque de título y botón por encima del tejado; botón, Ajustes y Familias a la vista, ≥ 48 px y sin tapar; palabras visibles; título y subtítulo sin tapar y subtítulo ≥ 20 px; sin desbordamiento ni recortes por ancho; foco visible con Tab; clic → `/mundo`; consola limpia. A 640×512 y 320×256: sin desbordamiento, la ilustración acompaña a la sección cuando crece y todos los controles y textos se alcanzan sin quedar tapados. **Falla con la portada de Codex** («390×844: el paisaje no cubre la primera pantalla») y fallaba con la primera versión de C a 320 px, lo que motivó el apilado < 360 px.

## 3. Auditoría independiente del rediseño de Codex

Método: capturas y mediciones de la app real, con el mismo script y los mismos pasos en A (`e9793cc`, servida aparte) y en la rama de Codex, a 390×844, 820×1180 y 1180×820, movimiento reducido. Lectura de `AGENTS.md`, `CLAUDE.md`, `VISUAL_GUIDE.md`, `NUBI_DESIGN_PRINCIPLES.md`, `ILLUSTRATION_INTEGRATION.md`, los cuatro documentos de `docs/design/` y los informes de las fases 14–16.

### 3.1 Mejoras reales (medidas)

| Pantalla | Cambio | Evidencia |
|---|---|---|
| Mi mundo | Colegio destacado, apoyos después, lugares futuros en sección aparte | Página a 390 px: 2970 → 1664 px de alto; el destino con historia es lo primero |
| Emociones (selector) | Ilustración de 56 → 96 px; nombre siempre visible; `aria-pressed` y teclado intactos (`art-batch-5`, `ux-redesign`) | A 390 px el escenario desplaza menos que antes (368 → 329 px) aunque cada tarjeta mide 167 px |
| Consecuencias | «Probar otra posibilidad» visible sin desplazar (antes a 2207 px, ahora a 82 px), sin obligar a leer; volver conserva lo explorado | `consequence-routes.mjs`; `explored = ["salir"]` tras volver |
| Herramientas (selector y página) | Ilustraciones de 96 px, nombre y descripción intactos | `strategies.test.ts`, `art-batch-6` |
| Ficha de historia | Formatos Cuento/Cómic con vista previa ilustrada; sinopsis en «Sobre esta historia» | `ux-redesign` |
| Barra inferior | Etiquetas de 12,5 → 14 px; sin `backdrop-blur` | Lectura y rendimiento |
| Movimiento | Sin balanceo/flotación continuos (`animate-sway/float` desactivados) | Atracción visual por ilustración, no por movimiento |
| Pruebas | `screens.mjs` ahora falla con violaciones axe; `art-batch-5` ya no sobrescribe evidencias versionadas | Revisado en el diff |

### 3.2 Regresiones técnicas

| # | Hallazgo | Estado |
|---|---|---|
| R-1 | Portada como imagen rectangular (22–35 % de la pantalla) | **Corregido** (§2) |
| R-2 | En Consecuencias, «Seguir con la historia» pasó de botón principal (petróleo, flecha detrás) a secundario con la flecha delante: al mover la primera ruta arriba, `slice(1)` dejaba la continuación en el índice 0, que el código pintaba como secundario. La consecuencia quedaba sin acción principal | **Corregido**: la continuación vuelve a ser primaria y con la flecha detrás. `consequence-routes.mjs` falla con el código de Codex («ha dejado de ser la acción principal») |
| R-3 | El botón de arriba se tomaba por **posición** (`routes[0]`): una consecuencia sin rutas lanzaba un error al dibujar y una historia con otro orden habría subido «Seguir» arriba. El validador no exige un orden | **Corregido**: `splitConsequenceRoutes` (`src/components/player/consequenceRoutes.ts`) identifica la vuelta por su destino (el paso de la decisión). Si no hay vuelta, no se muestra ni el botón de arriba ni «Ver las posibilidades». 3 tests unitarios. Solo presentación; el motor y las historias no cambian |
| R-4 | Nubi de la portada fijado a 160 px por estilo en línea (`GuideArt` solo cede el ancho a clases `w-*`), anulando el tamaño previsto | **Corregido** en esta fase (96/144 px) |
| R-5 | Logotipo de cabecera: la nube oficial a 40 px apenas se distingue del fondo (§5) | **No se cambia** (decisión de marca pendiente) |

Ninguna otra prueba existente se ha debilitado.

### 3.3 Riesgos de comprensión (sin corregir; requieren observación)

- **Opciones sin ilustración en el selector de emociones.** «Ganas de saber el plan», «Otra cosa» y «No lo sé» muestran un icono de 28 px dentro de un hueco pensado para 96 px; con tarjetas en columna (tableta) parecen tarjetas «vacías» junto a las de Nubi. Riesgo menor: el texto es visible y la función es la misma. Posible mejora (no aplicada, requiere decisión): icono más grande o tratamiento diferenciado.
- **Tarjetas de emoción altas en tableta vertical** (192 px a 820 px): el selector cabe sin desplazar, pero con letra grande crecerá. Vigilar en sesiones con letra 125 %.
- **«Probar otra posibilidad» antes del texto** puede llevar a volver sin leer la consecuencia. No es un bloqueo (no se obliga a leer, que es lo correcto), pero conviene observarlo (hipótesis «Alta» de Codex).
- **Botón de modo «Leer/Escuchar»** muestra el estado, no la acción (antecedente C-05 de la fase 14; sin cambio en el rediseño).
- **Navegación superior desde 1280 px** (antes 1024): en tableta horizontal (1180 px) la navegación es la barra inferior. Coherente con móvil y tableta vertical, pero cambia respecto a la versión anterior.
- **Páginas más largas en móvil**: biblioteca 1173 → 1288 px, mis emociones 1560 → 1763, herramientas 1607 → 1935, ajustes 2632 → 2851. Más desplazamiento a cambio de imágenes mayores.

### 3.4 Preferencias estéticas (no son errores)

- Papel neutro y tarjetas de bordes suaves; dirección «Mundo explorable» elegida por Codex.
- Logotipo ilustrado frente al vector simple (§5).
- Portada a pantalla completa frente a imagen enmarcada: decidido por la persona responsable para esta fase.

### 3.5 Hipótesis que necesitan usuarios

Ver §7 y [PENDING_USER_VALIDATION.md](PENDING_USER_VALIDATION.md) (Codex); se añaden las de la portada.

## 4. Accesibilidad para alumnado autista: comprobación

Verificado en la app real (390×844 salvo indicación) con el script de auditoría, las suites y lectura de código. «Verificado» significa comprobado técnicamente, **no validado con niños o niñas**.

| Criterio | Resultado |
|---|---|
| Se identifica qué se puede pulsar | Botones con forma, borde o fondo y palabra; objetivos ≥ 48 px en 80 pantallas (`ux-redesign`) y en la portada (`homepage`) |
| Botones con palabras claras | Portada: «Entrar en mi mundo», «Ajustes», «Familias» (antes, en A, Ajustes/Familias eran solo iconos en móvil). Reproductor: Repetir, Leer, Subtítulos, Animaciones, Atrás, Siguiente |
| Elementos importantes reconocibles | Emociones y herramientas a 96 px; el logotipo a 40 px es el punto débil (§5), aunque la palabra NUBI lo identifica |
| Una acción principal por momento | Portada: un botón principal. Consecuencias: «Seguir con la historia» vuelve a ser la única acción principal del bloque final (R-2) |
| Navegación con posiciones previsibles | Barra inferior a 747 px y cabecera arriba en Mi mundo, Historias, Recreaciones y Herramientas |
| Las ilustraciones no ocultan información | Portada: el texto queda en el cielo, por encima del tejado (probado). Cómic: bocadillos en lista bajo la viñeta en móvil (`comic-flow`, `art-batch-4`) |
| Sin estímulos inesperados / sin sonido automático | 0 reproducciones de audio, 0 `speechSynthesis.speak` y 0 `autoplay` al recorrer portada, mundo, ficha, cuento y cómic sin pulsar «Leer». Sin animaciones continuas |
| Se puede detener el movimiento | «Animaciones» → `aria-pressed=true` y pausa (`anim-paused`); respeta `prefers-reduced-motion` |
| Es posible no responder | Selector de emociones: «Siguiente» activo con 0 seleccionadas; «Puedes elegir varias. O ninguna.» |
| Se pueden explorar otras posibilidades | «Probar otra posibilidad» visible sin desplazar; contador «Has explorado N de 6»; lo explorado se conserva |
| Emociones sin valorar | Sin «correcto/incorrecto», puntos ni aciertos en el selector (búsqueda en el texto de la pantalla); incluye «Otra cosa» y «No lo sé» |
| Comunicación no oral válida | El cómic mantiene el comunicador de pictogramas; la herramienta «Comunicar una necesidad» sigue disponible |
| Zoom / reajuste | 320×256 y 640×512 sin desbordamiento ni controles tapados (`reflow`, `homepage`) |

No se presupone una preferencia común a todos los niños autistas: si una portada a pantalla completa resulta excesiva para alguien, la respuesta debe ser una opción individual, no un cambio para todos.

## 5. Logotipo (sin cambios)

Codex sustituyó el Nubi vectorial de la cabecera por la ilustración oficial `nubi-saludo` a 40 px (`Logo` en `src/components/AppShell.tsx`). **No se ha modificado.** Medición sobre capturas de la cabecera a 390 px (DPR 2, fondo `crema-100` = `#fbf5ea`):

| | Vector (A) | Ilustración (Codex) |
|---|---|---|
| Píxeles de la nube distintos del fondo | 924 | 1742 |
| … con contraste ≥ 1,5:1 | 598 | 444 |
| … con contraste ≥ 3:1 | **403** | **7** |
| Palabra «NUBI» (petróleo-800 sobre crema-100) | 10,5:1 | 10,5:1 |

- A 40 px la silueta de la nube oficial casi se funde con el fondo: su contorno no alcanza 3:1 (en el vector, un trazo oscuro lo marcaba). Los rasgos (ojos, mejillas) se perciben solo de cerca.
- La identificación del enlace no depende de la imagen: el nombre accesible es «NUBI, ir a la portada» y la palabra NUBI tiene contraste 10,5:1. Al ser parte de un logotipo, WCAG 1.4.11 no obliga, pero el reconocimiento del personaje a ese tamaño es débil.
- Opciones para la decisión de marca (no aplicadas): mantener la ilustración; usar la ilustración con un contorno o fondo circular; aumentar a 48 px; volver al vector en cabecera y reservar la ilustración para tamaños grandes (en portada se ve bien a 96–144 px). Registrar la decisión en `docs/review/DECISION_REGISTER.md`.

## 6. Pruebas

Entorno: Chromium 1243 (`/opt/pw-browsers`), Playwright 1.63.0 y axe-core 4.14.0 instalados fuera del proyecto (`/tmp/nubi-browser-tools`), Vite en `127.0.0.1:5173`. Evidencias de las suites escritas en el scratchpad (`NUBI_EVIDENCE`/`NUBI_ART_EVIDENCE`); `git status` limpio tras cada ejecución, sin tocar las evidencias versionadas.

`npm run check`: TypeScript + Vitest (**14 archivos, 90 tests**) + build de Vite. Correcto.

Ejecución completa (con la portada ya corregida, antes de R-2/R-3/R-4):

| Suite | Resultado |
|---|---|
| `homepage.mjs` (nueva) | PASS · 4 tamaños + 640×512 y 320×256 |
| `ux-redesign.mjs` | PASS · 80 pantallas (5 viewports × 2 tamaños de letra × 8 rutas), axe, ≥ 48 px |
| `quality.mjs` | PASS |
| `screens.mjs` | PASS (sin violaciones axe) |
| `story-fit.mjs` | PASS |
| `focus-obscured.mjs` | PASS · 12 rutas × 3 tamaños × 2 letras |
| `reflow.mjs` / `reflow-probe.mjs` | PASS / 0 pantallas con < 120 px útiles |
| `short-text.mjs` | PASS |
| `comic-flow.mjs` / `comic-sizes.mjs` | PASS / PASS |
| `story-preload.mjs` | PASS · 28 archivos, ninguno de más |
| `narration.mjs` | PASS |
| `art-files.mjs` | PASS · 72 recursos / 224 archivos (SHA-256) |
| `art-layout.mjs` | PASS (informa el recorte decorativo de `portada-fondo`, permitido) |
| `art-batch-2` … `art-batch-6` | PASS × 5 |

Tras R-2/R-3/R-4 se repitieron las suites afectadas: ver §6.1.

### 6.1 Repetición tras las correcciones

Repetidas con el código final (portada con Nubi a 96/144 px y Consecuencias corregidas). Todas **PASS**:

| Suite | Resultado |
|---|---|
| `homepage.mjs` | PASS · 6 tamaños (botón a 282/308 px, texto por encima del tejado) |
| `consequence-routes.mjs` (nueva) | PASS · 390×844, 820×1180, 1180×820: vuelta arriba y a la vista, «Seguir con la historia» principal al final, exploración conservada, contador «2 de 6», paso a la escena siguiente, consola limpia. Falla con el código de Codex |
| `quality.mjs`, `ux-redesign.mjs`, `short-text.mjs`, `art-batch-3.mjs` | PASS × 4 |
| `focus-obscured.mjs`, `reflow.mjs`, `screens.mjs`, `story-fit.mjs`, `art-layout.mjs` | PASS × 5 |

No se repitieron (sin relación con los cambios posteriores, verdes en la ejecución completa): `reflow-probe`, `comic-flow`, `comic-sizes`, `story-preload`, `narration`, `art-files`, `art-batch-2/4/5/6`.

## 7. Decisiones humanas pendientes y validación con niños y niñas

**Decisiones (personas responsables):**

1. Logotipo de cabecera (§5).
2. Tratamiento de las opciones sin ilustración en el selector de emociones (§3.3).
3. Confirmar la portada C como dirección definitiva tras revisarla en dispositivos reales.
4. Siguen pendientes, sin tocar: textos de las fases 15 y 16 (`EDITORIAL_APPROVAL_PHASE_15.md`, `phase-16/APPROVAL_CHECKLIST.md`) y el registro de decisiones de la fase 14.

**Hipótesis para sesiones con alumnado** (según el [protocolo infantil](../review/CHILD_USABILITY_PROTOCOL.md); sin recoger datos personales en NUBI):

| Hipótesis | Observación propuesta |
|---|---|
| La portada a pantalla completa invita a entrar y no abruma | Abrir NUBI sin indicar nada; observar dónde mira y qué pulsa; permitir decir que prefiere otra cosa |
| «Entrar en mi mundo» se reconoce como lo que hay que pulsar sobre una ilustración rica | Tiempo y forma de localizar la entrada, sin cronometrar ni puntuar |
| El texto sobre el cielo se lee bien | Distintas pantallas, brillo y tamaños de letra |
| Las imágenes de 96 px ayudan a reconocer emociones y herramientas | Preguntar qué cree que representa cada una, sin respuesta «correcta» |
| «Probar otra posibilidad» arriba se descubre sin saltarse la consecuencia | Observar si lee antes de volver y si entiende el contador |
| El Nubi de la cabecera se reconoce a 40 px | Preguntar qué ve en la cabecera |

Además, las pruebas manuales M-01 a M-16 ([MANUAL_ACCESSIBILITY_PROTOCOL.md](../review/MANUAL_ACCESSIBILITY_PROTOCOL.md)) siguen pendientes: lectores de pantalla, zoom real, Safari/iPad, Android y voz local.

## 8. Archivos de esta fase

- `src/screens/HomeScreen.tsx`, `src/index.css` (portada).
- `src/components/player/StoryPlayer.tsx`, `src/components/player/consequenceRoutes.ts` (+ `.test.ts`) (R-2, R-3).
- `tests/browser/homepage.mjs`, `tests/browser/consequence-routes.mjs` (nuevas); `tests/browser/ux-redesign.mjs` (aserción de la portada).
- `docs/design/PHASE_18_UX_QA_REPORT.md`, `docs/design/PHASE_18_HOMEPAGE_COMPARISON.md`, `docs/design/phase-18/*.webp` (14 capturas).
- `CLAUDE.md` (aviso de la fase 18).

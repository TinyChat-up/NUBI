# Principios de diseño de NUBI

Criterio para diseñar y revisar **cualquier pantalla** de NUBI, presente o futura. Complementa —no sustituye— a:

- [`VISUAL_GUIDE.md`](VISUAL_GUIDE.md): tokens (paleta, tipografías, formas), personaje y qué evitar. **Fuente de verdad de valores.**
- [`ILLUSTRATION_INTEGRATION.md`](ILLUSTRATION_INTEGRATION.md): cómo se muestra cada tipo de ilustración (recortes, bocadillos, variantes, `portrait`).
- [`CONTENT_STANDARD.md`](CONTENT_STANDARD.md): cómo se escriben los textos infantiles.
- [`AGENTS.md`](../AGENTS.md): líneas rojas de producto y accesibilidad mínima.

Este documento explica **por qué** el sistema es así y **cómo decidir** cuando algo no está previsto. Se redactó en la fase 5 tras auditar la app real con tres referencias externas (§13).

---

## 1. Orden de prioridad

Cuando dos criterios chocan, gana el de arriba:

1. Seguridad, privacidad y bienestar infantil.
2. Accesibilidad y necesidades del niño o la niña.
3. `AGENTS.md`.
4. Contratos técnicos y contenidos ya establecidos (motor, registros, `ILLUSTRATION_INTEGRATION.md`).
5. Identidad visual y personajes aprobados (arte de Codex).
6. Coherencia pedagógica.
7. Recomendaciones aplicables de guías externas.
8. Preferencias estéticas nuevas.

Una recomendación genérica de diseño web nunca prevalece sobre lo que necesita un niño que usa NUBI.

## 2. Identidad: un álbum ilustrado que se puede tocar

- **El arte manda.** La interfaz es el papel y el marco del álbum; la ilustración de Codex (gouache digital, lápiz de color, luz cálida) es el contenido. Ningún elemento de interfaz compite con ella en color, tamaño o movimiento.
- **Calma antes que estímulo.** Fondos crema, un solo acento fuerte por pantalla, nada que parpadee ni se mueva sin motivo.
- **Infantil sin ser infantilón.** Formas redondeadas, letra grande y pictogramas claros; sin dibujos animados genéricos, confeti, estrellas ni mascotas que «premian».
- **Previsible.** Lo mismo está siempre en el mismo sitio: cabecera arriba, controles del reproductor abajo, «Siguiente» a la derecha.
- **Nada evalúa.** No hay acierto/error, puntuación, rachas ni comparaciones (AGENTS.md §1.3).

## 3. Jerarquía visual

Cada pantalla tiene **una** cosa principal y **una** acción principal.

| Pantalla | Protagonista | Acción principal |
|---|---|---|
| Portada | Nubi + paisaje | Entrar en mi mundo |
| Biblioteca | Cubiertas de historias | Abrir una historia |
| Ficha | Cubierta + «¿Cómo quieres descubrirla?» | Cuento / Cómic |
| Cuento | Ilustración de la escena | Siguiente |
| Cómic | Viñeta actual | Descubrir la siguiente viñeta |
| Decisión | Las posibilidades (imagen + texto) | Elegir una |
| Herramientas / Emociones | La rejilla de tarjetas | Abrir una |
| Espacio familiar | Información para adultos | Leer / Reiniciar (con confirmación) |

Reglas:

- La acción principal es el único botón `primary` (petróleo relleno) visible. Las secundarias usan `secondary` (borde) o `ghost`.
- El coral es acento, no acción: antetítulos (`text-coral-700`), progreso actual, foco.
- Títulos en `petroleo-900`, texto en `tinta`, secundario en `tinta-suave`. Tres niveles de gris-azulado como máximo.

## 4. Sistema tipográfico

Nunito (o Atkinson Hyperlegible en «Muy clara»). Escala **real** en uso; no inventar tamaños intermedios:

| Rol | Clase | Tamaño |
|---|---|---|
| Marca en portada | `text-[4.5rem]` / `sm:text-[6.5rem]` | 72 / 104 px |
| Título de página (`PageHeader`) | `text-3xl` / `sm:text-4xl` | 30 / 36 px |
| Título de sección | `text-2xl` | 24 px |
| **Texto de lectura infantil** | `text-2xl` / `sm:text-[1.75rem]` + `reading-text` | 24 / 28 px |
| Opciones, tarjetas, bocadillos de cómic | `text-lg` / `text-xl` + `reading-text` | 18–20 px |
| Cuerpo general | `text-lg` | 18 px |
| Etiquetas, chips, ayudas, nombres | `text-sm` | 14 px |

- **Mínimo 14 px** en todo lo que lee un niño o una niña. Única excepción: el antetítulo en mayúsculas del reproductor (12 px), que repite información del título.
- Todo texto infantil lleva `reading-text` (aplica tamaño, espaciado, fuente y mayúsculas de Ajustes).
- Títulos con `text-wrap: balance`; párrafos con `pretty` (ya en `index.css`).
- Comillas latinas «…» y puntos suspensivos «…» (un carácter). No comillas rectas en texto visible.
- **Nunca se reduce la letra para que quepa algo.** Se reorganiza la composición.

## 5. Espaciado y ritmo

- Base de 4 px (escala de Tailwind). Pasos habituales: `gap-3` (12) dentro de un grupo, `gap-4`/`gap-6` (16/24) entre elementos, `mt-8`/`mb-8` (32) entre secciones.
- Márgenes laterales de página: 16 px en móvil (`px-4`), 32 px desde `sm` (`px-8`). En el reproductor, 12/24 px y la ilustración llega a sangre en vertical.
- Una idea por pantalla. Si una pantalla necesita más de cuatro secciones, probablemente son dos pantallas.
- Agrupar por proximidad antes que por cajas: dos niveles de caja como máximo (tarjeta → elemento interno).

## 6. Composición por orientación

NUBI se diseña **primero para tableta** y se comprueba en tres puntos: 390×844, 820×1180 y 1180×820.

- **Vertical (móvil y tableta):** una columna. En el cuento, ilustración arriba a sangre y texto debajo. La ilustración ocupa el alto que deja libre el texto (consultas de contenedor) y usa la composición 3:4 si existe. **Todo el texto de la página se ve sin desplazar** con la letra por defecto.
- **Horizontal ≥ 1024 px:** doble página. Ilustración a la izquierda (`2fr`), texto a la derecha (`1fr`, mínimo 20 rem para que una frase no se rompa en palabras sueltas).
- **Estabilidad:** si varias páginas seguidas comparten ilustración, la imagen mantiene su tamaño; el bloque de texto reserva el alto del más largo del grupo. Coste aceptado: en móvil, algunas páginas cortas tienen aire bajo el texto.
- Con letra grande (125 %) se permite desplazar; nunca se tapa texto ni se encoge la ilustración por debajo del 30 % de la pantalla.
- Ninguna pantalla produce desplazamiento horizontal.

## 7. Tarjetas

- Una sola familia: fondo `crema-50`, radio `--radius-card` (28 px), sombra `--shadow-soft` (utilidad `card`).
- Escala de radios: `rounded-full` (botones, chips) · `rounded-2xl` 16 px (iconos, elementos internos) · `rounded-3xl` 24 px (viñetas, tiras) · `--radius-card` 28 px (tarjetas, bocadillos, páginas) · 32 px solo para formas especiales (bocadillo de pensamiento, icono de herramienta). No escribir el mismo valor de otra forma (`rounded-[1.75rem]` es `--radius-card`).
- Tarjeta con imagen: imagen arriba en su proporción, texto debajo. Sin pies de foto que expliquen la imagen.
- Tarjetas seleccionables (`ToggleCard`): borde de 3 px, estado con `aria-pressed` y marca visible además del color.
- Estado «pendiente» o «en preparación»: borde discontinuo o chip, nunca una tarjeta rota o vacía.

## 8. Botones y controles

- Píldora, texto + icono, `min-h-14` (56 px) o `min-h-16` (64 px). Variantes de `components/ui.tsx`; no crear botones ad hoc.
- **Objetivo táctil mínimo 48 px** en cualquier control (AGENTS.md §4), incluidos enlaces de cabecera e iconos. Solo se exime un enlace dentro de un párrafo.
- Botones de solo icono: `aria-label` o texto `sr-only`; en móvil se acepta el icono solo si el significado es estable (Ajustes, Familias, Escenas, Cerrar).
- Controles del reproductor (`ToolButton`): icono + etiqueta visible de 14 px. Nada de iconos sin palabra para el niño.
- Verbos claros en botones: «Siguiente», «Descubrir la siguiente viñeta», «Empezar la historia». Nada de «Continuar» genérico si hay algo más preciso.
- Gestos (deslizar) siempre con alternativa de botón y teclado.

## 9. Estados interactivos

| Estado | Tratamiento |
|---|---|
| Reposo | Contraste AA |
| Hover (puntero fino) | Cambio de fondo o borde un paso más oscuro. Sin desplazamientos ni zoom |
| Pulsado | `tap`: escala 0,98 |
| Foco | Anillo doble crema + `coral-700` (`:focus-visible` global). Nunca eliminarlo; el escenario del reproductor usa un anillo interior para no tapar la cabecera |
| Seleccionado | `aria-pressed`/`aria-current` + cambio de fondo **y** marca (✓, borde), no solo color |
| Deshabilitado | Opacidad 40–45 %, cursor no permitido. Explicar por qué si no es obvio (p. ej. «Elige una posibilidad») |
| Cargando imagen | Placeholder provisional, aparición suave; nunca un hueco |

## 10. Uso de ilustraciones

- Se respetan íntegramente las ilustraciones de Codex: ni se redibujan con CSS/SVG, ni se recortan donde narran, ni se estiran.
- Narrativas (escena, viñeta, opción): **enteras**, en su proporción. Decorativas (portada, cubierta ancha): recorte permitido según `focus`.
- El texto **nunca** va encima de una escena del cuento; en el cómic, los bocadillos solo se superponen en viñetas anchas y en las esquinas reservadas.
- `width`/`height` reales, `srcset` + `sizes` honestos (que reflejen el ancho real ocupado), `priority` solo para la ilustración visible.
- Placeholders vectoriales solo donde falta el arte; se presentan como provisionales.
- Personajes recortados (Nubi): sombra en el contenedor, no en la imagen (evita el «cuadrado» al recortar con `overflow-hidden`).

## 11. Movimiento

- El movimiento acompaña un cambio (pasar página, descubrir una viñeta, abrir algo). No hay movimiento decorativo nuevo sin propósito.
- Repertorio cerrado (`index.css`): `page-next`/`page-prev` (18 px + fundido), `rise`, `pop`, `fade`, `sway` (solo Nubi recortada), `float`.
- Solo `transform` y `opacity`. Nunca `transition: all`.
- Las escenas completas no se animan (ni zoom ni panorámica).
- Tres interruptores que lo paran todo: `prefers-reduced-motion`, Ajustes → «Sin animaciones», botón «Animaciones» del reproductor. Nada depende de una animación para entenderse.

## 12. Accesibilidad (además de AGENTS.md §4)

- Contraste AA en todo texto; opción «Más contraste».
- Estructura: un `h1` por pantalla, niveles sin saltos, `main` con enlace de salto.
- Contenido decorativo duplicado (p. ej. textos que solo reservan alto): `invisible` + `aria-hidden` + `inert`.
- Enlaces externos: indican que abren otra pestaña y a qué llevan (texto `sr-only` si el visible es corto).
- Acciones destructivas (reiniciar progreso) con confirmación.
- Diálogos nativos (`<dialog>`) con `overscroll-behavior: contain`.
- Audio y narración siempre opcionales, con texto disponible.
- **Las pruebas automáticas no sustituyen** la revisión con lector de pantalla, zoom del sistema y dispositivos reales.

## 13. Referencias externas: qué se aplica y qué se descarta

Se estudiaron tres referencias en la fase 5. **Ninguna se instaló** en el proyecto ni se ejecutaron sus scripts; se leyó su texto publicado y se aplicó su criterio a mano.

### Taste Skill (`design-taste-frontend`, v2.5.1)

Pensada para webs de empresa (landing pages, tiendas, SaaS).

| Se aplica | Se descarta (y por qué) |
|---|---|
| Un sistema: una familia de botones, una de tarjetas, una escala de radios, una escala tipográfica | Fotografías reales o de stock (NUBI usa solo ilustración propia; AGENTS.md y VISUAL_GUIDE §9) |
| Bordes laterales iguales, nada desalineado | «Una sección por pantalla» y héroes de marketing (NUBI no vende; su portada es una invitación) |
| Objetivos táctiles amplios, nada solapado, sin desplazamiento horizontal | Entrada animada del héroe, «momentos» animados, microanimaciones de hover con zoom (estímulo innecesario) |
| Sin pies de foto que expliquen imágenes | Shaders, escenas WebGL, efectos (prohibidos por el brief) |
| Con movimiento reducido todo queda quieto y visible | Copy comercial («hecho duro» en el primer pantallazo, verbo + objeto de venta) |
| Ningún elemento aparece al hacer scroll | Sus scripts de comprobación (no revisados; prohibido ejecutarlos) |

### Vercel Web Interface Guidelines (`web-design-guidelines`)

Lista de reglas objetivas. Se aplicaron todas las pertinentes (§8, §9, §11, §12): foco visible, `:focus-visible`, `prefers-reduced-motion`, sin `transition: all`, imágenes con dimensiones, `fetchpriority` en la visible, carga diferida, `aria-live`, controles con nombre, gestos con alternativa, sin bloqueo de zoom, `theme-color`, confirmación de acciones destructivas, `overscroll-behavior` en diálogos, comillas y puntos suspensivos tipográficos.

Se descartan: «Title Case» en títulos y botones (norma del inglés; en español, mayúscula inicial), sincronizar todo estado con la URL (la biblioteca tiene un filtro sin URL; se valorará cuando haya más historias) y la virtualización de listas (no hay listas largas).

### DESIGN.md de Claude (getdesign / VoltAgent)

Referencia secundaria de composición. **No se adopta** su paleta, tipografía serif, superficies oscuras, iconografía ni patrones conversacionales: NUBI tiene identidad propia.

| Principio aprovechado | Adaptación en NUBI |
|---|---|
| Escala de radios jerárquica y cerrada | §7 (pill · 16 · 24 · 28 · 32) |
| Profundidad por bloques de color, sombras escasas | Una sola sombra suave para tarjetas; sin apilar sombras |
| El acento cálido es escaso y se reserva | El coral no es color de acción (§3) |
| Ritmo editorial: espacio generoso y uniforme entre bloques | §5 |
| Las rejillas reducen columnas, no encogen tarjetas | Rejillas 1 → 2 → 3 columnas; las tarjetas mantienen tamaño mínimo táctil |
| Base de 4 px | §5 |

Descartado expresamente: botones de 40 px e iconos de 36 px (por debajo del mínimo infantil de 48 px), botones de 14 px, títulos serif y la regla de «no documentar hover».

## 14. Patrones prohibidos

- Puntuaciones, estrellas, insignias, rachas, barras de «nivel», confeti, rojo/verde de acierto.
- Temporizadores, cuentas atrás, autoavance, sonido o vídeo automático.
- Texto sobre escenas del cuento; letra reducida para que algo quepa; texto infantil < 14 px.
- Ilustraciones recortadas o estiradas cuando narran; arte sustituido por CSS/SVG/fotografía.
- Animación decorativa nueva, parallax, aparición al hacer scroll, zoom al pasar el ratón.
- Ventanas emergentes no solicitadas; menús ocultos para acciones principales.
- Controles < 48 px; iconos sin nombre accesible; foco eliminado.
- Valores sueltos: hex en componentes, radios o tamaños que dupliquen un token con otra notación.
- Métricas o tablas en zonas infantiles (el espacio familiar muestra exploración, nunca rendimiento).

## 15. Reglas para una pantalla nueva

Antes de abrir un PR:

1. **Propósito:** ¿cuál es la cosa principal y la acción principal? (§3). Si hay dos, son dos pantallas.
2. **Componentes existentes primero:** `Page`, `PageHeader`, `Button`/`LinkButton`, `Chip`, `ToggleCard`, `Illustration`, `GuideArt`. Si falta algo, se amplía `ui.tsx`, no se copia.
3. **Texto en datos**, no en componentes (AGENTS.md §2), y según `CONTENT_STANDARD.md`.
4. **Ilustración:** registrada con `alt`, proporción y `sizes` honesto; placeholder hasta que Codex entregue.
5. **Composición** en 390 / 820 / 1180 (§6): sin desplazamiento horizontal; nada importante tapado ni fuera de pantalla sin pista.
6. **Accesibilidad:** teclado completo, foco visible, objetivos ≥ 48 px, `aria-pressed`/`aria-current`, un `h1`.
7. **Movimiento:** solo del repertorio (§11) y apagable por los tres interruptores.
8. **Pruebas:** `npm run check` y, con el servidor en marcha, `tests/browser/quality.mjs`, `art-layout.mjs` y —si toca el reproductor— `story-fit.mjs`.
9. **Capturas** en los tres tamaños adjuntas al PR.
10. Si algo de este documento no encaja con la pantalla, se propone el cambio aquí **antes** de implementarlo.

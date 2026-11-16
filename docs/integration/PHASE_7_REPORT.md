# NUBI — Fase 7 · Verificación en la nube y cierre técnico

16/11/2026 · Rama `integration/phase-7` · Continuación en Claude Code en la nube desde el commit de traspaso `3b27492`. **Sin merge a `main` y sin despliegue.**

Resumen: el entorno cloud reproduce el proyecto sin cambiar dependencias. `npm run check` y **las ocho baterías de navegador pendientes pasan**. El recorrido completo de cuento y cómic en 390×844, 820×1180 y 1180×820 no encontró bloqueos, desbordamientos, errores de consola ni imágenes cruzadas entre decisiones. La auditoría encontró **un problema objetivo de accesibilidad**: con teclado, el control enfocado podía quedar oculto bajo la barra inferior o la cabecera fijas. Está corregido con una regla CSS y cubierto por una prueba nueva (`tests/browser/focus-obscured.mjs`). No se ha tocado arte, registros de recursos, textos educativos, personaje ni logotipo.

---

## 1. Estado de Git

| Dato | Valor |
|---|---|
| Repositorio | `TinyChat-up/NUBI` |
| Rama | `integration/phase-7` (sincronizada con `origin` al empezar) |
| Commit inicial | `3b27492` — *docs: phase 7 handoff for cloud session* |
| Árbol al empezar | Limpio |
| Cambios remotos nuevos | Ninguno al empezar (se vuelve a comprobar antes de publicar) |

Las skills de terceros se instalaron dentro del proyecto (`.claude/skills/`, `skills-lock.json`). Se excluyeron **solo en local** con `.git/info/exclude`: no se versionan y no aparecen en `git status` (ver §5).

## 2. Entorno cloud

| Componente | Versión / dato |
|---|---|
| Sistema | Ubuntu 24.04.5 LTS, x86_64, 4 CPU, 15 GiB RAM |
| Node | 22.23.4 (el proyecto exige `>=22.18`) |
| npm | 10.9.9 |
| Git | 2.43.0 |
| Navegador | Chromium preinstalado del entorno: *Google Chrome for Testing* 153.0.8010.12 (build Playwright 1243), en `/opt/pw-browsers/chromium` |
| Red | Proxy del entorno. Hay acceso a npm, a GitHub (clonado de skills) y a `raw.githubusercontent.com` |

El contenedor se reinició una vez durante la sesión. Sobrevivieron el árbol de trabajo, `node_modules` y las herramientas de `/tmp`. Las pruebas finales se repitieron completas después del reinicio.

## 3. Dependencias

- `npm ci` con el `package-lock.json` existente: correcto en ~3 s, 0 vulnerabilidades. **Sin cambios en `package.json` ni en el lockfile.**
- Herramientas de prueba **fuera del proyecto**, en `/tmp/nubi-browser-tools`:
  - `playwright@1.63.0`: la misma versión que trae el entorno. Así usa el Chromium preinstalado y no hace falta `npx playwright install` ni bibliotecas del sistema.
  - `@axe-core/playwright@4.14.0` (axe-core 4.14.1).

## 4. Variables para las pruebas de navegador

```bash
export NUBI_BROWSER_TOOLS=/tmp/nubi-browser-tools
export CHROMIUM_PATH=/opt/pw-browsers/chromium-1243/chrome-linux64/chrome
export NUBI_URL=http://127.0.0.1:5173
```

Vite: `npm run dev -- --host 127.0.0.1 --port 5173 --strictPort`.

## 5. Estado real de las tres herramientas de diseño

Antes de instalar se revisaron los metadatos npm y el código de los CLIs, descargado con `npm pack` a una carpeta aislada:

- `skills@1.9.0` publica desde `vercel-labs/skills`.
- `getdesign@0.6.26` publica desde `VoltAgent/awesome-design-md`.
- Ninguno tiene scripts `install` ni `postinstall`.
- Ambos envían telemetría anónima. Se desactivó con `DISABLE_TELEMETRY=1`, `DO_NOT_TRACK=1` y `GETDESIGN_DISABLE_TELEMETRY=1`.

| Herramienta | Estado | Uso real en esta fase |
|---|---|---|
| **Taste Skill** (`design-taste-frontend`, tasteskill 2.5.1, commit `f6b7657`) | Instalada en `.claude/skills/design-taste-frontend` (proyecto, no global): 1632 archivos, 40 MB. Reconocida por Claude Code **tras reiniciar la sesión** (aparece en la lista de skills). | **No se ha ejecutado.** Solo se ha leído su `SKILL.md`. Motivo: su frontmatter declara un hook `Stop` que ejecuta `node scripts/gate.mjs` (comprobador de terceros con navegador) mientras la skill está activa. Ejecutar scripts no revisados está prohibido por el encargo y por `NUBI_DESIGN_PRINCIPLES.md` §13. Se aplicó a mano el criterio pertinente: un sistema de componentes, bordes iguales, sin desplazamiento horizontal, objetivos amplios y movimiento reducido. |
| **Vercel Web Design Guidelines** (`web-design-guidelines`, commit `1a2c79d`) | Instalada en `.claude/skills/web-design-guidelines`. Reconocida tras reiniciar la sesión. | **Aplicada manualmente**, sin invocar la skill. Se descargaron sus reglas actuales (`command.md`) y se revisó `src/` con búsquedas dirigidas y pruebas de navegador (§8). |
| **GetDesign** (`getdesign@0.6.26 add claude`) | Referencia generada en `/tmp/nubi-claude-design.md` (589 líneas), fuera del repositorio. | **Leída y analizada.** Coincide con lo que ya recoge `NUBI_DESIGN_PRINCIPLES.md` §13: base de 4 px, profundidad por bloques de color y rejillas que reducen columnas. No aporta nada nuevo que adoptar. Se descartan de nuevo sus botones de 40 px e iconos de 36 px, por debajo del mínimo infantil de 48 px. **No se copia nada** de su paleta, tipografía, identidad ni patrones conversacionales. |

Archivos generados por las instalaciones que **no** se versionan: `.claude/skills/**` y `skills-lock.json` (excluidos en `.git/info/exclude`).

**En una sesión nueva** las skills se cargan automáticamente si la carpeta `.claude/skills/` existe. Como no se versionan, cada contenedor nuevo debe reinstalarlas (§14). Si se usa `design-taste-frontend`, revisar antes `scripts/gate.mjs` o leer la skill sin invocarla.

## 6. `npm run check`

| Momento | Resultado |
|---|---|
| Inicial (`3b27492`) | ✅ Tipos, **46 tests en 6 archivos** y build de producción (~3,7 s) |
| Final (con la corrección de foco) | ✅ Tipos, 46 tests en 6 archivos y build |

`npm run assets:doc` regenera `docs/ASSET_REQUESTS.md` **sin diferencias**.

## 7. Pruebas de navegador

Todas en Chromium headless con las variables de §4. Tiempos de la ejecución final, tras el reinicio y sobre el código definitivo:

| Prueba | Resultado | Tiempo | Detalle |
|---|---|---|---|
| `art-files.mjs` | ✅ PASS | ~14 s | 36 recursos listos / 116 archivos: SHA-256, decodificación, dimensiones y alfa |
| `art-layout.mjs` | ✅ PASS | ~71 s | 390/820/1180: cargado 88, provisional 72, **error 0**. Único recorte: `portada-fondo`, decorativo y previsto |
| `art-batch-2.mjs` | ✅ PASS | ~22 s | 10 escenas × 3 tamaños: orientación (3:4 en vertical, 16:9 en horizontal), proporción, texto, controles, cómic y Nubi |
| `art-batch-3.mjs` | ✅ PASS | ~12 s | Seis decisiones y doce momentos × 3 tamaños: 4:3 sin recorte, fuentes responsive, texto exacto y vuelta atrás |
| `quality.mjs` | ✅ PASS | ~127 s | Cuento y cómic, seis opciones, emociones, intensidad, resumen, persistencia, borrado, teclado y vídeo × 3 tamaños. axe (WCAG 2.0/2.1/2.2 A/AA): **0 infracciones** en 36 estados |
| `story-fit.mjs` | ✅ PASS | ~57 s | 23 páginas × 3 tamaños × 2 tamaños de letra. Con letra normal no hay desplazamiento. Con letra grande, el desplazamiento permitido afecta a 15 páginas en móvil y 3 en horizontal |
| `narration.mjs` | ✅ PASS | ~2 s | Rechazo de voz remota con alternativa textual; voz local, error asíncrono y detener |
| `screens.mjs` | ✅ PASS | ~6 s | 9 rutas generales sin infracciones de axe ni desbordamiento |
| `focus-obscured.mjs` **(nueva)** | ✅ PASS | ~74 s | 12 rutas × 3 tamaños × 2 tamaños de letra: ningún control enfocado queda bajo una barra fija. **Sin la corrección falla con 43 casos** |

La primera ejecución, con el código de partida, dio el mismo resultado en las ocho baterías originales. Ninguna prueba se ha desactivado ni relajado.

**Esto no es una certificación WCAG.** axe detecta una parte de los criterios. No se ha probado con lector de pantalla, zoom del sistema al 200–400 % ni dispositivos reales.

## 8. Auditoría UX/UI y de accesibilidad

### Recorrido completo (script de auditoría no versionado)

Cuento y cómic recorridos **paso a paso** en 390×844, 820×1180 y 1180×820. En cada pantalla se midieron objetivos táctiles, desbordamiento, alto de cabecera y controles, imágenes cargadas, errores de consola y si «Siguiente» quedaba bloqueado. En la decisión se exploraron **las seis posibilidades** en ambos formatos.

| Comprobación | Resultado |
|---|---|
| Pasos recorridos | Cuento 25, cómic 20, por tamaño |
| Pantallas bloqueadas | **0**. Solo la decisión exige elegir, y lo explica: «Elige una posibilidad. Tómate el tiempo que necesites.» |
| Cada decisión con su ilustración (`opt-*`) | 6/6 en los 3 tamaños y ambos formatos |
| Cada consecuencia con sus dos momentos (`opt-*` → `c-*`) | 12/12, todos cargados |
| «Probar otra posibilidad» y «Seguir con la historia» | Funcionan desde las seis consecuencias |
| Objetivos táctiles < 48 px | **0** en el reproductor y en portada, biblioteca, ficha, mundo, herramientas, emociones, familias y ajustes |
| Desbordamiento horizontal / errores de consola | 0 / 0 |
| Emociones, intensidad opcional, «No lo sé», sabemos / necesitamos saber, estrategias opcionales | Avanzan sin respuesta obligatoria |
| Resumen | «No hay respuestas buenas ni malas»; muestra lo explorado, sin evaluar |
| Persistencia y borrado | Cubiertos por `quality.mjs`: restaura selecciones e intensidad; el borrado elimina solo `nubi.v1.run.*` y conserva claves ajenas |
| Movimiento reducido | Con `prefers-reduced-motion` no hay animaciones (`quality.mjs`). Las escenas no se animan |
| Estabilidad al pasar página | `story-fit.mjs`: la imagen no cambia de tamaño entre páginas que comparten ilustración |

Apoyos sensoriales y formas de pedir ayuda: el texto y el arte los presentan con respeto. Los cascos y la pelota blanda son «algo normal, como ponerse unas gafas». Pedir tiempo, preguntar y buscar a un adulto de confianza aparecen como opciones válidas. «Salir sin avisar» valida la necesidad («Necesitar salir es válido»), no castiga y ofrece otra forma de hacerlo. No se ha modificado ningún texto.

### Clasificación de hallazgos

**A. Funcionales:** ninguno.

**B. Accesibilidad objetiva:** uno, corregido.

- **Foco oculto bajo barras fijas (WCAG 2.2 · 2.4.11).** Al tabular, el navegador desplaza el elemento enfocado justo hasta el borde de la ventana, donde lo tapan la barra inferior fija (< 1024 px) o la cabecera pegajosa. Hubo 43 casos en 390/820/1180 con letra normal y grande, por ejemplo en Ajustes, en las tarjetas «Cuento / Cómic / Vídeo» de la ficha a 820 px y en Emociones. Corrección en `src/index.css`: `scroll-padding-top` y `scroll-padding-bottom` en `html`, en `rem` para que acompañen al tamaño de letra y con `safe-area-inset-bottom`; desde `lg` solo queda margen superior. Resultado: 0 casos. Evidencia: [390-foco-antes-despues.webp](phase-7/390-foco-antes-despues.webp). El reproductor no se ve afectado porque su escenario tiene su propio desplazamiento.

**C. Comprensión:** ninguno con solución clara que no altere la composición. Se documentan en D.

**D. Mejoras opcionales.** Documentadas, no implementadas:

1. **Cabecera del reproductor de alto variable en móvil.** Los títulos largos («¿Qué sabemos y qué necesitamos saber?», «Estrategias que pueden ayudar») ocupan dos líneas (cabecera de 86 px en lugar de 66). Causa: la regla global sin capa `h1 { text-wrap: balance }` prevalece sobre la utilidad `truncate` de Tailwind, que va en `@layer utilities`. Se mantiene así porque muestra el título completo al niño o la niña. Si se prefiere una sola línea, habría que decidir entre un título corto en datos o aceptar el recorte con «…».
2. **Barra de controles en móvil.** Ocupa 169–193 px de 844, unos 20–23 %, en dos filas. Es coherente con §8 de los principios: etiqueta visible en cada control. Una revisión futura podría compactar la fila de opciones sin bajar de 48 px.
3. **Ficha del episodio.** En 390 y 820 vertical, las tarjetas «Cuento / Cómic» quedan bajo el pliegue, tras la cubierta 4:3 a ancho completo. El título «¿Cómo quieres descubrirla?» asoma como pista. Podría valorarse limitar el alto de la cubierta en vertical; afecta a la composición y requiere aprobación.
4. **Consecuencias en 1180×820.** Los dos momentos ilustrados llenan la pantalla y la ficha «Cómo te puedes sentir…», junto con «Probar otra posibilidad», queda 500–640 px más abajo. La tarjeta asoma como pista de desplazamiento.
5. **Filtros de la biblioteca en móvil.** Se desplazan en horizontal dentro de su fila; el chip cortado indica que hay más.
6. `touch-action: manipulation` en botones (regla de Vercel). Hoy no hay retardo de doble toque con `width=device-width`; no se considera necesario.

Reglas de Vercel ya cumplidas en el código: foco con `:focus-visible` y anillo doble; único `outline: none` con reemplazo; sin `transition: all`; sin bloqueo de zoom; `theme-color`; `aria-live`; imágenes con `width/height`, `srcset` y prioridad; gestos con alternativa de botón y teclado; confirmación al borrar el progreso; `overscroll-behavior` en diálogos; comillas latinas y «…». Se descartan, igual que en la fase 5, «Title Case» (norma del inglés) y sincronizar todo el estado con la URL.

## 9. Correcciones realizadas

| Archivo | Cambio |
|---|---|
| `src/index.css` | `scroll-padding-top/bottom` en `html` para que el foco no quede bajo las barras fijas (B) |
| `tests/browser/focus-obscured.mjs` | Prueba nueva de regresión para el criterio 2.4.11 |
| `CLAUDE.md` | Rama de referencia `integration/phase-7`, con nota histórica sobre `feat/claude-foundation` y enlace al informe |
| `docs/TEST_RESULTS.md`, `docs/HANDOFF_PHASE_7.md` | Resultados de la fase 7 e instrucciones para la nube |
| `docs/integration/phase-7/` | 10 capturas representativas (WebP, 632 kB) |

No se han modificado `public/media/`, registros de recursos, archivos gráficos, textos educativos, motor, personaje Nubi ni logotipo.

## 10. Capturas representativas

| Tamaño | Capturas |
|---|---|
| 390×844 | [Foco antes/después](phase-7/390-foco-antes-despues.webp) · [Decisión](phase-7/390-decision.webp) · [Consecuencia horario](phase-7/390-consecuencia-horario.webp) · [Resumen](phase-7/390-resumen.webp) |
| 820×1180 | [Ficha](phase-7/820-ficha.webp) · [Decisión](phase-7/820-decision.webp) · [Consecuencia regulación](phase-7/820-consecuencia-regulacion.webp) |
| 1180×820 | [Cuento, diálogo](phase-7/1180-cuento-dialogo.webp) · [Consecuencia salir](phase-7/1180-consecuencia-salir.webp) · [Cómic](phase-7/1180-comic.webp) |

## 11. Estado de los 72 recursos

Calculado desde el registro (`src/content/assets/index.ts`), no copiado de informes: **72 recursos · 36 listos · 36 pendientes**. 10 escenas tienen composición vertical 3:4.

| Tipo | Listos | Pendientes |
|---|---|---|
| Portada | 1 | 0 |
| Personajes | 11 | 0 |
| Cubierta | 1 | 0 |
| Escenas | 10 | 0 |
| Opciones y consecuencias | 12 | 0 |
| Viñetas | 1 | **14** (`ume-k1-2`, `ume-k1-3`, `ume-k2-1`…`ume-k2-4`, `ume-k3-1`, `ume-k3-2`, `ume-k4-1`, `ume-k6-1`…`ume-k6-3`, `ume-k7-1`, `ume-k7-2`) |
| Emociones | 0 | **9** |
| Herramientas | 0 | **7** |
| Lugares | 0 | **6** |

El audio humano y el vídeo del piloto siguen pendientes fuera del catálogo.

## 12. Pendiente de validación humana

**Discrepancia editorial en `ume-c-horario`** (`src/content/stories/una-manana-diferente/story.ts`, consecuencia «Pedir que le expliquen el horario»):

- Texto actual: «Andrés dibuja el plan en la pizarra: biblioteca, recreo, lengua, comida y plástica. Teo lo mira entero, **de arriba abajo**.»
- Ilustración: los cinco pictogramas en **fila horizontal**, igual que en `ume-s6-plan`. Se confirmó en las capturas a 390, 820 y 1180 px.
- Propuesta de Codex: «de principio a fin».
- **No se ha modificado.** Es un cambio de contenido educativo y lo aprueba una persona (AGENTS.md §7).

## 13. Limitaciones pendientes

- Sin lector de pantalla (VoiceOver, TalkBack, NVDA), zoom del sistema al 200–400 % ni dispositivos táctiles reales. Las medidas son con viewport emulado.
- Sin vídeo final ni audio humano; la voz del sistema solo se prueba con dobles.
- `design-taste-frontend` no se ha invocado por su hook `Stop` con script de terceros (§5).
- Las skills de terceros no se versionan; hay que reinstalarlas en cada contenedor nuevo.
- La revisión no equivale a validación pedagógica con alumnado.

## 14. Continuar desde una nueva sesión cloud

```bash
git fetch origin integration/phase-7 && git checkout integration/phase-7
npm ci && npm run check
```

Herramientas de navegador, fuera del proyecto y con la versión del Chromium preinstalado:

```bash
mkdir -p /tmp/nubi-browser-tools && cd /tmp/nubi-browser-tools && npm init -y >/dev/null && npm install --no-audit --no-fund playwright@1.63.0 @axe-core/playwright
```

Si el entorno trae otra versión de Playwright, instalar esa misma: `node -e "console.log(require('playwright/package.json').version)"`.

Servidor y pruebas, desde la raíz del proyecto:

```bash
npm run dev -- --host 127.0.0.1 --port 5173 --strictPort
```

```bash
export NUBI_BROWSER_TOOLS=/tmp/nubi-browser-tools CHROMIUM_PATH=/opt/pw-browsers/chromium-1243/chrome-linux64/chrome NUBI_URL=http://127.0.0.1:5173
for t in art-files art-layout art-batch-2 art-batch-3 quality story-fit narration screens focus-obscured; do node tests/browser/$t.mjs > /tmp/p7-$t.log 2>&1; echo "$t exit=$?"; done
```

Skills de diseño, opcionales. Se instalan en el proyecto sin versionarse, con telemetría desactivada:

```bash
printf '/.claude/skills/\n/.agents/\n/skills-lock.json\n' >> .git/info/exclude
DISABLE_TELEMETRY=1 DO_NOT_TRACK=1 npx -y skills@1.9.0 add https://github.com/Leonxlnx/taste-skill --skill design-taste-frontend -a claude-code -y
DISABLE_TELEMETRY=1 DO_NOT_TRACK=1 npx -y skills@1.9.0 add vercel-labs/agent-skills --skill web-design-guidelines -a claude-code -y
GETDESIGN_DISABLE_TELEMETRY=1 npx -y getdesign@0.6.26 add claude --out /tmp/nubi-claude-design.md
```

Las skills aparecen en Claude Code al **iniciar la sesión siguiente**.

## 15. Resumen técnico para Codex (siguiente lote: viñetas del cómic)

- **Base:** crear `feat/codex-art-batch-4` desde `integration/phase-7`, con el commit de esta fase incluido. Los únicos archivos tocados por Claude en esta fase son `src/index.css`, `CLAUDE.md`, `tests/browser/focus-obscured.mjs` y documentación. No coinciden con `public/media/` ni con los registros, así que no se esperan conflictos.
- **Prioridad:** las 14 viñetas pendientes (`ume-k1-2` … `ume-k7-2`) para completar el cómic. Las especificaciones por viñeta (proporción, tamaño, descripción y esquinas reservadas para bocadillos) están en `docs/ASSET_REQUESTS.md`, que es generado y no se edita a mano. Las posiciones de bocadillo vienen de `bubble.position` en `story.ts`.
- **Contrato** (`docs/ILLUSTRATION_INTEGRATION.md` §3): sin texto ni bocadillos en la imagen. Reservar las esquinas indicadas: en viñetas anchas los bocadillos se superponen hasta el 44 % del ancho; en móvil se leen debajo. Si una composición necesita otra esquina, avisarlo en el PR para aprobación humana; no cambiar `position` sin aviso.
- **Entrega:** archivo en `public/` + ruta del registro, `status: 'listo'`, `variants` (p. ej. `[800, 1200]`), `npm run assets:doc`, `npm run check`. Con el servidor en marcha: `art-files.mjs`, `art-layout.mjs`, `art-batch-2.mjs` (cómic) y `quality.mjs`.
- **Hallazgo visual del cómic:** las viñetas se acumulan al descubrirlas. En 1180×820 una escena de cuatro viñetas llega a ~1000 px de desplazamiento; el reproductor lleva la nueva viñeta a la vista. Funciona con placeholders y no requiere nada especial del arte.
- **No incluido:** emociones (9), herramientas (7) y lugares (6) siguen después. Las emociones se ven a 64–100 px, así que necesitan siluetas legibles a ese tamaño.

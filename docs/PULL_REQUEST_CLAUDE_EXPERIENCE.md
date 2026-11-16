# feat: experiencia de cuento ilustrado e integración de ilustraciones definitivas

Base: `feat/codex-quality` · Head: `feat/claude-experience` · **No fusionar sin autorización.**

Prepara NUBI para mostrar las ilustraciones de Codex con calidad editorial, sin reconstruir la plataforma, sin tocar `public/media/` ni los registros de recursos, y sin redibujar personajes ni crear fondos nuevos.

## Qué cambia

**Sistema de ilustraciones**
- `Illustration` sirve el arte final con `width/height` reales (sin saltos), `srcset`/`sizes` desde el campo opcional `variants`, punto focal (`focus`), carga diferida o prioritaria (`fetchpriority`), decodificación asíncrona y aparición suave. Si un archivo falla, vuelve al placeholder.
- Las ilustraciones narrativas (escenas, viñetas, opciones, miniaturas) se muestran **siempre con su proporción completa**: no se recortan en ningún ancho.
- Precarga en segundo plano de las ilustraciones del paso siguiente y de todas las consecuencias al llegar a una decisión.
- `GuideArt` / `EmotionArt`: Nubi y las emociones usan el arte final cuando esté `listo`; mientras tanto, el vector provisional existente.
- Portada con arte final: pantalla completa en horizontal; en vertical, franja 4:3 fundida con el papel.

**Cuento ilustrado** (`StoryPage`)
- La ilustración es protagonista: a sangre en móvil, doble página en tableta horizontal, con altura limitada para que el texto quepa sin desplazar.
- El texto nunca se superpone a la imagen. Narración en texto grande; diálogo en bocadillo con el nombre del personaje; guía (Nubi) con su figura.
- Cambio de página con fundido y desplazamiento corto según la dirección (adelante / atrás); si la ilustración no cambia, se queda quieta. Marca "Escena N" al empezar cada escena.
- Deslizar para pasar página en pantallas táctiles (complementa los botones; ignora el desplazamiento vertical y el ratón).

**Cómic**
- Viñetas con la proporción del recurso; las completas caben en pantalla en tableta horizontal.
- La siguiente viñeta es un botón grande, *Descubrir la siguiente viñeta*.
- Bocadillos superpuestos en las esquinas reservadas cuando la viñeta es ancha (máx. 44 %, cola hacia los personajes); en móvil se leen debajo de la imagen. Nunca tapan caras ni el comunicador.
- Se elimina la flotación de imágenes completas, que resultaba artificial.

**Interacciones**
- Cada pregunta (emociones, qué necesito saber, estrategias) muestra junto a ella una miniatura de la escena.
- Consecuencias como mini-tira ilustrada seguida de una única reflexión, en lugar de cuatro cajas de colores.
- Tarjetas de opción más ligeras: borde suave en lugar de sombra.

**Contrato y herramientas**
- `AssetSpec` gana dos campos **opcionales**: `focus` y `variants`. Los registros actuales siguen siendo válidos y `ASSET_REQUESTS.md` no cambia.
- `docs/ILLUSTRATION_INTEGRATION.md`: cómo se muestra cada tipo, zonas de bocadillos, formato y peso, movimiento y verificación.
- `tests/browser/art-layout.mjs`: comprueba carga, recortes y desbordes con arte real.

## Verificación realizada

| Comprobación | Resultado |
|---|---|
| `npm run check` | Tipos, **41 tests** (36 de Codex + 5 nuevos de fuentes de imagen) y build correctos |
| `tests/browser/quality.mjs` (Codex) en Chrome macOS | PASS 390 / 820 / 1180: cuento, cómic, seis opciones, emociones, intensidad, resumen, persistencia, borrado, teclado, vídeo; **axe sin infracciones** |
| `tests/browser/narration.mjs` (Codex) | PASS: sin autoarranque, rechazo de voz remota, error asíncrono, detener |
| `tests/browser/screens.mjs` (Codex) | 9 pantallas sin infracciones axe ni desbordamiento |
| `tests/browser/art-layout.mjs`, rama real (todo pendiente) | PASS, 153 placeholders, 0 errores |
| `art-layout.mjs` con **72 recursos `listo`** (copia aislada con imágenes de prueba de tamaño exacto, fuera del repo) | PASS: 183 cargas, 0 errores, **0 recortes narrativos**, sin desbordes; `srcset` elige la variante de 1200 px |
| Deslizar con eventos táctiles reales | Avanza, retrocede e ignora el desplazamiento vertical |
| Revisión visual en 390 / 820 / 1180 | Página de cuento (narración, diálogo, guía), preguntas, decisión, consecuencia, cómic (superpuesto y en lista), portada, emociones, herramienta |

**No realizado:** pruebas con ilustraciones auténticas (aún no existen), dispositivos táctiles físicos, Safari/iOS, lector de pantalla real ni zoom 200-400 %. Las capturas con arte simulado validan maquetación y recortes, **no la calidad visual del arte**.

## Posibles incompatibilidades con `feat/codex-art-direction`

La rama no existía en el remoto al cerrar este trabajo; el análisis se basa en el reparto acordado.

| Riesgo | Probabilidad | Cómo resolver |
|---|---|---|
| Ambas ramas editan `src/engine/types.ts` (si Codex añade campos a `AssetSpec`) | Media | Conflicto textual en el mismo bloque: conservar ambos campos |
| Codex cambia extensiones (`.png` → `.webp`) o tamaños en el registro | Alta, y deseable | Sin conflicto: la interfaz lee `file`, `size` y `aspect` del registro |
| El arte coloca personajes en esquinas reservadas a bocadillos | Media | Ajustar la composición o proponer un cambio de `bubble.position` en `story.ts`, con aprobación humana |
| El arte incluye texto | Baja | Contrario al contrato: los textos los pone la app |
| Codex modifica `Illustration.tsx` o `components/placeholder/` | Baja | Son de la interfaz: coordinar antes |
| Ediciones simultáneas de `AGENTS.md` o `docs/ARCHITECTURE.md` | Media | Conflictos de documentación: conservar ambas aportaciones |
| Codex regenera `ASSET_REQUESTS.md` | Esperado | Esta rama no lo modifica: no hay conflicto |
| Póster de vídeo: `ume-cover` es 4:3 y el reproductor es 16:9 | — | Se recorta en el póster; si se quiere uno específico, añadir un recurso 16:9 |

## Integración segura (propuesta)

1. Antes de fusionar, comprobar conflictos sin tocar ramas:
   `git merge-tree --write-tree origin/feat/claude-experience origin/feat/codex-art-direction`
2. Crear `integration/phase-3a` desde `feat/codex-quality`.
3. Fusionar primero `feat/claude-experience` (código) y después `feat/codex-art-direction` (recursos y registros). Resolver conflictos según la tabla.
4. En la rama de integración: `npm run check`, `npm run assets:doc` (sin diferencias), `quality.mjs`, `narration.mjs`, `screens.mjs` y `art-layout.mjs`.
5. Revisión visual humana del arte integrado en tableta vertical, móvil y tableta horizontal.
6. PR de `integration/phase-3a` a `main`, **solo con autorización** de la persona responsable.

## Requisitos visuales pendientes

- Arte de los 72 recursos según `ASSET_REQUESTS.md` y este contrato (esquinas de bocadillos, transparencias limpias, sin texto).
- `focus` para `portada-fondo` y `ume-cover`; `variants: [1200]` recomendado en escenas, viñetas y opciones.
- Decidir si el póster de vídeo necesita un recurso 16:9 propio.
- Opcional: retirar del registro la nota "dejar el cuarto inferior con poco detalle" (ya no se superpone texto).

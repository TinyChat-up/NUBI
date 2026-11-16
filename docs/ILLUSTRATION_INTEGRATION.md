# Integración de ilustraciones definitivas

Contrato técnico entre la interfaz (Claude, `feat/claude-experience`) y la producción artística (Codex, `feat/codex-art-direction`). Describe **cómo muestra NUBI cada recurso** para que el arte se diseñe sabiendo dónde y cómo se verá.

> Los IDs, rutas, proporciones y tamaños siguen definidos en el registro (`src/content/assets/`, `src/content/stories/*/assets.ts`) y en `docs/ASSET_REQUESTS.md` (generado). Este documento no los cambia.

## 1. Entregar un recurso

1. Exportar al tamaño del registro (`size`) y guardar en `public` + `file` (p. ej. `public/media/stories/una-manana-diferente/scenes/s1-puerta.webp`).
2. Cambiar **solo ese recurso** a `status: 'listo'` en su registro.
3. `npm run assets:doc` y `npm run check`. El test `assets.test.ts` falla si un recurso `listo` no tiene archivo.
4. Con el servidor en marcha: `node tests/browser/art-layout.mjs` (ver §7).

Mientras un recurso esté `pendiente`, se ve el placeholder vectorial; al pasar a `listo`, la app usa el archivo **sin tocar código**. Si el archivo falla al cargar, se vuelve al placeholder (nunca queda un hueco).

## 2. Cómo se muestra cada tipo (reglas de recorte)

| Tipo (`kind`) | Dónde | Ajuste | ¿Se recorta? |
|---|---|---|---|
| `escena` 16:9 | Página de cuento | Proporción completa (`ratio`) | **Nunca** |
| `vineta` 4:3 / 16:9 | Cómic | Proporción completa | **Nunca** |
| `opcion` 4:3 | Decisiones y consecuencias | Proporción completa | **Nunca** |
| `escena` (miniatura) | Junto a las preguntas (emociones, saber, estrategias) | Proporción completa, 112-176 px | **Nunca** |
| `cubierta` 4:3 | Tarjetas 4:3, ficha, portada | 4:3 en tarjetas; en la ficha (≥1024 px) llena la altura de la columna | Solo en la ficha ancha, según `focus` |
| `lugar` 4:3 | Mi mundo | 4:3 | No |
| `portada` 16:9 | Fondo de portada | Horizontal: pantalla completa (`cover`). Vertical: franja 4:3 inferior fundida con el papel | **Sí, decorativo** (hasta ~25 %), según `focus` |
| `personaje` 3:4 (transparente) | Ficha (reparto), Nubi en cuento/portada/resumen | `contain` sobre fondo crema | Nunca |
| `herramienta` 1:1 (transparente) | Mis herramientas | `contain` sobre fondo tintado | Nunca |
| `emocion` 1:1 (transparente) | Mis emociones | `contain`, 64-100 px | Nunca |

Consecuencias para el arte:

- **Las ilustraciones narrativas se ven enteras.** Todo lo que está dentro del lienzo se ve; no hace falta margen de seguridad para recortes.
- **El texto nunca se superpone a escenas del cuento.** Va en su propia página (debajo en vertical, al lado en horizontal), así que la imagen no necesita zonas vacías para texto. *(La nota antigua de ASSET_REQUESTS sobre dejar "el cuarto inferior con poco detalle" ya no es necesaria; se puede eliminar del registro cuando Codex lo considere.)*
- **Transparentes**: canal alfa limpio, sin halo blanco. La app añade una sombra suave en Nubi; no la horneéis.
- **Iconos pequeños** (emociones a 64 px, herramientas a 96 px): siluetas legibles a ese tamaño.

## 3. Cómic: zonas de bocadillos

Los bocadillos los pone la app, nunca la imagen.

- **Viñeta ancha** (≥ 32rem de ancho: tableta y ordenador): bocadillos **superpuestos** en la esquina indicada por `bubble.position` de `story.ts` (`top-left`, `top-right`, `bottom-left`, `bottom-right`, `top`, `bottom`), con un ancho máximo del **44 %** de la viñeta y hasta ~25 % del alto. La cola apunta hacia el centro.
- **Viñeta estrecha** (móvil): los bocadillos se leen **debajo** de la imagen, en orden. No tapan nada.

Por tanto, cada viñeta debe **reservar las esquinas** que indica su descripción (p. ej. *"Bocadillos arriba a la izquierda y derecha; comunicador de Lía abajo a la derecha"*): ni caras, ni manos, ni el comunicador en esas esquinas. Si una composición necesita otra esquina, hay que cambiar `position` en `story.ts` (contenido narrativo): **indicadlo en el PR para aprobación humana**, no lo cambiéis sin avisar.

## 4. Campos opcionales nuevos del registro

Añadidos al tipo `AssetSpec` (`src/engine/types.ts`). Son **opcionales**: los registros actuales siguen siendo válidos.

```ts
focus?: { x: number; y: number };   // % 0-100. Zona importante si hay que recortar. Defecto: 50, 50.
variants?: number[];                 // Anchos de variantes exportadas además del original.
```

### `focus` (punto focal)

Solo afecta a los usos que recortan (portada y cubierta en la ficha ancha). Ejemplo para un panorama con el colegio a la izquierda del centro:

```ts
defineAsset('portada', { id: 'portada-fondo', /* … */ focus: { x: 42, y: 70 } })
```

### `variants` (imágenes responsive)

Convención de nombre: el archivo principal con el sufijo `-<ancho>w` antes de la extensión.

```
public/media/stories/una-manana-diferente/scenes/s1-puerta.webp        ← 2400 px (file)
public/media/stories/una-manana-diferente/scenes/s1-puerta-1200w.webp  ← variants: [1200]
```

La app genera `srcset` + `sizes` y el navegador elige. Probado de extremo a extremo: a 390, 820 y 1180 px se descarga la variante de 1200 px. Recomendado para escenas, viñetas y opciones: `variants: [1200]` (o `[800, 1600]`). Un test comprueba que las variantes son menores que el original.

### `portrait` (dirección de arte vertical) — añadido en la fase 4

Una escena 16:9 en un móvil o tableta en vertical ocupa poco alto: queda espacio libre bajo el texto. Para que la ilustración llene la pantalla **sin recortar nada**, se puede entregar una **versión recompuesta** de la misma escena en vertical (más cielo, suelo o entorno; los personajes y objetos importantes, enteros):

```ts
scene({
  id: 's1-puerta',
  status: 'listo',
  variants: [1200],
  portrait: {
    file: '/media/stories/una-manana-diferente/scenes/s1-puerta-vertical.webp',
    aspect: '3:4',
    size: { width: 1536, height: 2048 },
    variants: [768],   // opcional, mismo sufijo -<ancho>w
  },
  /* … */
})
```

- Se sirve con `<picture>` + `media="(orientation: portrait)"`; en horizontal se sigue usando el original 16:9.
- Proporción recomendada: **3:4** (en 390×844 y 820×1180 imagen + texto caben sin desplazar).
- No es un recorte: si el recorte bastara, no haría falta el campo. Debe mantener continuidad con la versión horizontal (mismo momento, misma luz).
- `imageSource.test.ts` comprueba que el archivo vertical y sus variantes existen cuando el recurso está `listo`.
- En uso desde el segundo lote de Codex (fase 5): las 10 escenas del cuento tienen versión 3:4 con variantes 768/1024 px. En vertical se sirve la 3:4; en horizontal, la 16:9 (`tests/browser/art-batch-2.mjs`).
- **Cómo se dimensiona (fase 5):** en vertical, el texto de la página ocupa su alto natural y la ilustración llena el resto (consultas de contenedor), sin recortarse. Las páginas seguidas que comparten ilustración reservan el alto del texto más largo, así que la imagen no cambia de tamaño al pasar página. Consecuencia para el arte: en móvil una escena 3:4 se ve aproximadamente entre 200×265 y 335×446 px; en tableta vertical, entre 530×705 y 635×846 px. Los personajes deben leerse a ~200 px de ancho.

## 5. Formato y peso recomendados

| Tipo | Formato | Peso orientativo |
|---|---|---|
| Escenas y viñetas (2400 px) | WebP, calidad 78-82 | ≤ 350 KB; variante 1200 px ≤ 120 KB |
| Opciones y cubiertas (2048 px) | WebP | ≤ 300 KB |
| Transparentes (personajes, herramientas, emociones) | WebP con alfa preferible; PNG si hace falta | ≤ 250 KB |
| Portada (2400 px) | WebP | ≤ 450 KB |

Si se cambia de `.png` a `.webp` en transparentes, hay que actualizar `file` en el registro (es un cambio de Codex) y regenerar el documento.

**Carga:** la ilustración visible de cada página se pide con prioridad alta y sin carga diferida; el resto, en diferido. El reproductor **precarga** en segundo plano las ilustraciones del paso siguiente (y, en una decisión, las de todas sus consecuencias), así que pasar página no muestra huecos.

## 6. Movimiento

- **Escenas completas: no se animan** (ni zoom ni desplazamiento). Solo aparecen con un fundido y un desplazamiento de 18 px en la dirección de lectura (`page-next` / `page-prev`). Si dos páginas seguidas comparten ilustración, la imagen se queda quieta y solo cambia el texto.
- **Personajes recortados** (Nubi): balanceo muy suave (`sway`, 7 s) cuando el paso tiene `motion: 'float'`, y en portada y resumen.
- **Viñetas**: aparecen una a una (botón *Descubrir la siguiente viñeta*, *Siguiente* o deslizar), y sus bocadillos entran en secuencia.
- Todo se desactiva con `prefers-reduced-motion`, con *Ajustes → Sin animaciones* y con el botón *Animaciones* del reproductor.

Si en el futuro hay **sprites separados** de personajes (personaje sobre fondo transparente + fondo aparte), se podría animar el personaje sin tocar el fondo. Requeriría un campo nuevo; no lo implementéis sin acordarlo.

## 7. Verificar

```bash
npm run dev -- --host 127.0.0.1 --port 5173 --strictPort
# en otra terminal (herramientas como en docs/TEST_RESULTS.md):
NUBI_BROWSER_TOOLS=… CHROMIUM_PATH=… node tests/browser/art-layout.mjs
```

`tests/browser/story-fit.mjs` recorre todas las páginas del cuento y falla si algún texto no cabe sin desplazar (letra por defecto), si una ilustración se recorta o si cambia de tamaño entre páginas que la comparten.

`art-layout.mjs` recorre portada, mundo, ficha, cuento, decisión, consecuencia, cómic, recreaciones, herramientas y emociones en 390/820/1180 px. **Falla** si un recurso listo no carga, si una ilustración narrativa queda recortada o si hay desbordamiento horizontal. Informa (sin fallar) de los recortes decorativos de portada y cubierta.

Validado por Claude con una copia aislada en la que los 72 recursos eran `listo` con imágenes de prueba de tamaño exacto: 183 cargas, 0 errores, 0 recortes narrativos. Las imágenes de prueba no se han incluido en el repositorio.

## 8. Componentes preparados

| Componente | Recurso | Comportamiento |
|---|---|---|
| `components/Illustration.tsx` | Todos | `listo` → `<img>` con `width/height`, `srcset`, `focus`, carga diferida o prioritaria y aparición suave; si no, placeholder; si falla, placeholder |
| `components/player/StoryPage.tsx` | `escena` | Página de cuento: imagen entera (3:4 en vertical si existe) que ocupa el alto libre + página de texto (narración, diálogo con bocadillo o Nubi sobre su bocadillo) |
| `components/player/ComicView.tsx` | `vineta` | Viñetas descubribles, bocadillos superpuestos o en lista según el ancho |
| `components/player/interactions.tsx` | `opcion`, `escena` | Decisiones, tira de consecuencias, miniatura de contexto en preguntas |
| `components/illustration/GuideArt.tsx` | `nubi-saludo`, `nubi-pensando`, `emo-*` | Arte final si está listo; si no, el vector provisional de Nubi |
| `screens/HomeScreen.tsx` | `portada-fondo`, `nubi-saludo`, `ume-cover` | Composición de portada distinta con arte final (ver §2) |
| `screens/StoryDetailScreen.tsx` | `ume-cover`, `char-*` | Cubierta y reparto |
| `screens/ToolsScreen.tsx`, `WorldScreen.tsx`, `RecreationsScreen.tsx`, `StoryCard.tsx` | `tool-*`, `place-*`, `ume-*` | Tarjetas con `sizes` adecuados |
| `components/video/VideoPlayer.tsx` | `ume-cover` (póster) | Póster 16:9 (la cubierta 4:3 se recorta ahí; si se quiere un póster específico, pedir un recurso nuevo) |

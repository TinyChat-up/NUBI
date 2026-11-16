# NUBI · Fase 8 · Cómic completo

Rama de entrega: [`feat/codex-art-batch-4`](https://github.com/TinyChat-up/NUBI/tree/feat/codex-art-batch-4).
Creada desde `integration/phase-7`, referencia `5d95c92`.

Se completan **14 viñetas nuevas** mediante generación y edición real con
`image_gen.imagegen`. Con `ume-k1-1`, que conserva sus bytes, el episodio tiene
sus **15 viñetas ilustradas**. El catálogo calculado queda en **50 listos,
22 pendientes y 72 recursos**.

## Entrega gráfica

Los archivos principales están en
[`public/media/stories/una-manana-diferente/comic/`](../public/media/stories/una-manana-diferente/comic/).
Cada viñeta nueva incluye dos variantes con sufijos `-800w.webp` y `-1200w.webp`:
**14 principales + 28 variantes = 42 WebP nuevos**.

| ID | Archivo principal | Proporción | Exportación | Acción y reserva para bocadillos |
|---|---|---|---|---|
| `ume-k1-2` | `k1-2.webp` | 4:3 | 2048×1536 | Teo en el pasillo; arriba derecha y abajo izquierda libres. |
| `ume-k1-3` | `k1-3.webp` | 16:9 | 2400×1350 | Detalle de mano, mochila y cascos; sin bocadillos. |
| `ume-k2-1` | `k2-1.webp` | 4:3 | 2048×1536 | Vista desde atrás en el umbral; reserva arriba izquierda. |
| `ume-k2-2` | `k2-2.webp` | 4:3 | 2048×1536 | Andrés se presenta con la mano en el pecho; arriba derecha libre. |
| `ume-k2-3` | `k2-3.webp` | 16:9 | 2400×1350 | Andrés mueve la tarjeta del pincel; arriba izquierda libre. |
| `ume-k2-4` | `k2-4.webp` | 16:9 | 2400×1350 | Cuatro reacciones; reservas superiores y abajo derecha, comunicador por encima. |
| `ume-k3-1` | `k3-1.webp` | 4:3 | 2048×1536 | Nubi y pizarra de dos columnas; arriba derecha libre. |
| `ume-k3-2` | `k3-2.webp` | 4:3 | 2048×1536 | Teo reflexiona; arriba izquierda libre para el pensamiento HTML. |
| `ume-k4-1` | `k4-1.webp` | 16:9 | 2400×1350 | Teo y seis caminos/puertas como metáfora prevista; arriba derecha libre. |
| `ume-k6-1` | `k6-1.webp` | 4:3 | 2048×1536 | Teo señala el plan y Andrés dibuja; arriba izquierda y abajo derecha libres. |
| `ume-k6-2` | `k6-2.webp` | 4:3 | 2048×1536 | Teo con cascos y libro de trenes; arriba derecha libre. |
| `ume-k6-3` | `k6-3.webp` | 16:9 | 2400×1350 | Bruno, Aya y Lía; comunicador elevado para liberar el diálogo inferior. |
| `ume-k7-1` | `k7-1.webp` | 4:3 | 2048×1536 | Reencuentro con Rosa a mediodía; arriba derecha y abajo izquierda libres. |
| `ume-k7-2` | `k7-2.webp` | 4:3 | 2048×1536 | Regreso visto desde atrás, Nubi discreto; arriba izquierda libre. |

Se incluyen también, fuera de la aplicación:

- [Catorce PNG originales nativos](art-batch-4/originals/).
- [Lámina de las quince viñetas en orden](art-batch-4/sequence-review.webp).
- [45 capturas definitivas](art-batch-4/previews/) del reproductor: quince por tamaño.
- Láminas de capturas completas a [390](art-batch-4/review-390.webp),
  [820](art-batch-4/review-820.webp) y [1180 px](art-batch-4/review-1180.webp).
- [Nueve capturas de la verificación inicial de llegada](art-batch-4/first-scene/),
  realizada antes de producir los demás grupos.
- [Prompts, referencias y correcciones](art-batch-4/generation.json),
  [exportaciones y hashes](art-batch-4/exports.json),
  [captura del contrato de la rama base](art-batch-4/plan.json),
  [validación de archivos](art-batch-4/file-validation.json) y
  [estado calculado del catálogo](art-batch-4/catalog-state.json).

## Resolución y procedencia

Las nueve composiciones 4:3 se generaron a **1448×1086 px** y las cinco 16:9 a
**1672×941 px**. Los tamaños principales de 2048×1536 y 2400×1350 son
**exportaciones remuestreadas, no resoluciones nativas de generación**.
Se ajusta la mínima diferencia de redondeo del original panorámico al 16:9 exacto.

Variantes 4:3: 800×600 y 1200×900. Variantes 16:9: 800×450 y 1200×675.
Se exportan directamente del PNG nativo, sin ampliaciones encadenadas ni recortes.
No se crean versiones verticales del cómic.

WebP con calidad 76, filtro Lanczos y metadatos eliminados. El detalle exacto de
peso, dimensiones y SHA256 está en `exports.json`; los originales nativos tienen
su hash en `generation.json`. Los PNG se conservan tanto en el entorno de
generación como en la carpeta de originales de esta entrega.

Los principales pesan aproximadamente 206–432 kB, y las variantes 39–229 kB.
Los 42 WebP suman 7.23 MB decimales. Los PNG nativos suman 38.99 MiB y no se
sirven a la aplicación. Los pesos varían con el detalle; se conservó la textura
en lugar de reducir todos los archivos a un mismo presupuesto.

[`scripts/export-art-batch-4.py`](../scripts/export-art-batch-4.py) reproduce las
exportaciones y la lámina de secuencia desde los PNG incluidos. Utiliza Pillow
para inspección e ImageMagick para formatos, tamaños y composición de revisión.
No dibuja personajes ni escenarios. Son herramientas externas de producción,
sin dependencias nuevas ni generación de imágenes incorporada a la aplicación.

## Continuidad artística y narrativa

Se leyeron las guías y los informes indicados, el registro y los diálogos de cada
viñeta antes de generar. Se trabajó por escenas, empezando por `k1-2` y `k1-3`
y comprobándolas junto a `k1-1` en los tres tamaños antes de seguir.

Las hojas maestras y las escenas existentes guiaron cada composición: pelo,
piel, proporciones, ropa, mochila y tren, cascos verdes, comunicador con asa,
gafas y moños de Aya, rodilleras de Bruno, estrella de Lía y recogido bajo de Rosa.
La identidad de Nubi se mantiene; sus archivos anteriores no cambian.

Se alternan planos de conjunto, medios, detalle de objeto, umbral desde atrás,
primer plano de reflexión y salida de espaldas. Se conservan materiales y
elementos del colegio: piedra y tejado de teja, rejas y ventanas petróleo,
pasillo de madera, perchas, mobiliario salvia, plantas y biblioteca.
La luz de llegada evoluciona hacia el mediodía en el cierre.

Las reacciones son distintas y contenidas, sin corrección visual ni castigo.
Los apoyos aparecen como recursos cotidianos. Teo lleva los cascos puestos en
la biblioteca y no se duplican en su mochila. En la salida vuelven a colgar de ella.
El horario mantiene libro, pelota, lápiz, plato y pincel en ese orden.

No hay palabras, diálogos, globos ni onomatopeyas incrustados en el arte.
Los textos visibles en las capturas son HTML de la aplicación. Se conservan los
pictogramas previstos: pausa, interrogación de la pizarra y el comunicador,
actividades y apoyos. Los seis caminos de `k4-1` son la metáfora expresamente
definida en el registro, sin rutas premiadas o amenazantes.

### Correcciones anteriores a la entrega

- Se eliminó alumnado añadido por el generador en el plano dedicado a Andrés,
  incluida una duplicación de cascos; la versión final muestra solo al maestro.
- Se eliminó un Teo añadido en la viñeta dedicada a Nubi y la pizarra.
- Se bajó la posición de Aya y se elevó el comunicador en `k6-3`. La prueba real
  a 820 px detectó todavía un solapamiento con el borde inferior del dispositivo;
  se corrigió elevando la presentación del comunicador y sus manos por completo.
- En `k2-4`, Teo y Bruno intercambian su posición respecto a la primera propuesta
  para colocar a Bruno bajo el bocadillo superior derecho que prescribe `story.ts`.
  Se mantienen las cuatro reacciones, personajes y diálogos. No se cambia el argumento.

## Integración y revisión de bocadillos

El único archivo de `src/` modificado es el registro de assets: catorce entradas
con `status: 'listo'` y `variants: [800, 1200]`. Se marcaron después de verificar
archivos, formatos y dimensiones. El helper `panel` ya propagaba ambos campos.
No se modifican IDs, rutas, proporciones, textos alternativos ni `bubble.position`.
`ASSET_REQUESTS.md` se regenera con `npm run assets:doc`.

Se conservan React, estilos, motor, textos educativos, navegación y las entregas
anteriores. Los 36 objetos anteriores del manifiesto siguen idénticos y sus
archivos mantienen sus hashes. El símbolo de cabecera continúa sin activarse.
No se hace merge a `main` ni a `integration/phase-7`.

La nueva prueba [`art-batch-4.mjs`](../tests/browser/art-batch-4.mjs) recorre las
quince viñetas en orden en el reproductor real. Comprueba que solo se descubre
la siguiente, conserva textos y leyendas, muestra cada bocadillo una vez,
respeta la proporción y carga las fuentes gráficas sin error ni desbordamiento.
El mensaje del comunicador se comprueba por celdas y en su orden de lectura,
como lo representa el componente existente.

Se definieron manualmente **62 regiones protegidas** de caras, manos, apoyos
y objetos narrativos en [protected-regions.json](art-batch-4/protected-regions.json).
La prueba cruza esas regiones con los rectángulos de los bocadillos superpuestos;
la versión final pasa sin intersecciones. Esta comprobación complementa la
inspección visual, no es un reconocimiento automático de caras.

| Viewport emulado | Ancho real de viñeta | Presentación verificada |
|---|---|---|
| 390×844, DPR2 | 358 px | Todos los bocadillos debajo de las imágenes. |
| 820×1180, DPR1 | 764 px | Bocadillos superpuestos; `k1-3` no tiene bocadillos. |
| 1180×820, DPR1 | 469 px en medias / 966 px en completas | Medias con texto debajo; completas con bocadillos superpuestos cuando los tienen. |

Se revisaron visualmente las láminas de los tres tamaños, la asociación de
personajes y voces, manos, expresiones, dispositivo y continuidad del conjunto.
Ejemplos: [reacciones a 820 px](art-batch-4/previews/820-ume-k2-4.jpg),
[comunicador a 820 px](art-batch-4/previews/820-ume-k6-3.jpg) y
[cierre móvil](art-batch-4/previews/390-ume-k7-2.jpg).
Las pruebas son de Chromium en Linux con viewports emulados, no dispositivos físicos.

## Pruebas ejecutadas

Se ejecutaron `npm run assets:doc`, `npm run check` y las diez baterías disponibles
de navegador, sin desactivar ni relajar pruebas. Los resultados finales de cada
batería son correctos. [Logs](art-batch-4/verification/),
[auditorías axe](art-batch-4/verification/quality-results.json) y
[capturas/medidas del cómic](art-batch-4/previews/results.json).

| Prueba | Resultado |
|---|---|
| `npm run assets:doc` | 72 recursos; cabecera y estados generados desde el registro: 50 listos. |
| `npm run check` | Tipos, **46 tests en 6 archivos** y build de producción correctos. |
| `art-files.mjs` | **50 recursos / 158 archivos**: decodificación y dimensiones correctas, hashes principales y alfa de los transparentes. Se repitió tras las correcciones gráficas. |
| `art-batch-4.mjs` | **15 viñetas × 3 viewports**, 45 capturas; orden, textos, bocadillos, fuentes, proporción y 62 regiones protegidas. Se repitió tras cada corrección relevante. |
| `art-layout.mjs` | Integración a 390/820/1180: sin errores de imagen ni recortes narrativos. El único recorte informado es el fondo decorativo previsto de portada. |
| `quality.mjs` | Cuento/cómic, seis alternativas, emociones, intensidad, resumen, persistencia, borrado, teclado y vídeo; **36 estados axe sin infracciones**. |
| `art-batch-2.mjs` | Diez escenas en los tres tamaños: orientación, proporción, texto, controles, primera viñeta y Nubi. |
| `art-batch-3.mjs` | Seis decisiones y doce momentos en los tres tamaños; texto, proporción, fuentes y regreso a la selección. |
| `story-fit.mjs` | 23 páginas × tres tamaños × dos tamaños de letra; sin desplazamiento con letra normal. Con letra grande se permite desplazar y no se oculta texto. |
| `focus-obscured.mjs` | 12 rutas × tres tamaños × dos tamaños de letra; sin controles enfocados bajo barras fijas. |
| `narration.mjs` | Voz local, rechazo de voz remota con alternativa textual, error asíncrono y detener. |
| `screens.mjs` | Nueve rutas generales, sin infracciones axe ni desbordamiento. |
| Exportación y conservación | SHA256 y tamaño de los 42 WebP nuevos y los 14 PNG nativos; 36 entradas anteriores del manifiesto idénticas. |

Las primeras ejecuciones del test nuevo sirvieron para corregir el propio selector
del mensaje segmentado en celdas y para detectar el solapamiento del comunicador.
Una revisión parcial se descartó porque arrancó antes de terminar las exportaciones.
Los resultados definitivos incluyen la ejecución completa con archivos ya entregados
y todas las regiones exigidas; no se cambió React ni se eliminaron comprobaciones.

### Reproducir

Con Vite en `http://127.0.0.1:5173`, Node compatible con el proyecto y herramientas
de navegador externas:

```bash
NUBI_BROWSER_TOOLS=/workspace/quality-tools/node_modules CHROMIUM_PATH=/usr/bin/chromium NUBI_ART_EVIDENCE=/tmp/nubi-comic-review node tests/browser/art-batch-4.mjs
```

Se usa el mismo entorno para las otras baterías. La prueba del cómic admite
`NUBI_COMIC_SCENES=llegada` para revisar un grupo, pero la entrega final se verifica
sin ese filtro. Chromium emulado y axe no sustituyen dispositivos físicos,
lector de pantalla ni validación pedagógica humana.

## Observación técnica para Claude

`ComicView.tsx` declara `sizes="(min-width: 1024px) 50vw, 100vw"` para todas las
viñetas. En 1180×820, una viñeta `span: 'full'` mide unos 966 px, mientras que
`50vw` anuncia 590 px. En la captura medida de `k4-1`, el navegador seleccionó
la variante de 800 px. Carga y composición son correctas, pero la selección
puede perder definición frente a la variante de 1200 disponible.

Petición concreta: adaptar `sizes` al ancho de las viñetas completas y medias
según su `span` y el límite real de la rejilla. Verificar `currentSrc` con caché
vacía y DPR1/DPR2. No se ha modificado el componente ni el contrato para resolverlo.
No queda ningún solapamiento entre bocadillos y regiones protegidas en los
tres tamaños comprobados. La observación editorial del horario recogida en
fase 7 sigue pendiente de revisión humana y no se altera en este lote.

## Pendientes del catálogo

Recuento obtenido del registro, no de los informes históricos:

| Grupo | Pendientes | IDs |
|---|---|---|
| Emociones | 9 | `emo-alegria`, `emo-calma`, `emo-sorpresa`, `emo-curiosidad`, `emo-inseguridad`, `emo-frustracion`, `emo-tristeza`, `emo-enfado`, `emo-cansancio` |
| Herramientas | 7 | `tool-pedir-ayuda`, `tool-descansar`, `tool-espacio-tranquilo`, `tool-comunicar-necesidad`, `tool-anticipar-cambios`, `tool-expresar-desacuerdo`, `tool-apoyos-sensoriales` |
| Lugares | 6 | `place-colegio`, `place-casa`, `place-parque`, `place-amigos`, `place-emociones`, `place-herramientas` |

No quedan viñetas pendientes. El audio humano, vídeo y validación pedagógica
del episodio siguen siendo trabajos independientes del catálogo gráfico.

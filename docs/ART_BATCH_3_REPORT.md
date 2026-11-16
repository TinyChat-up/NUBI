# NUBI · Fase 6 · Decisiones y consecuencias

Fecha: 16 de noviembre de 2026. Rama: `feat/codex-art-batch-3`.
Base: `integration/phase-5`, commit `d46e37392e2c50a926a190acaf81c0ac1969eca8`.

Se entregan las seis parejas completas: doce ilustraciones originales generadas con
`image_gen.imagegen`, integradas en las decisiones y consecuencias del cuento.
El registro real queda en **36 listos, 36 pendientes, 72 recursos**.
Las variantes y los originales de producción no suman IDs al catálogo.

## Archivos entregados

Cada archivo de esta tabla está en
[`public/media/stories/una-manana-diferente/options/`](../public/media/stories/una-manana-diferente/options/).
Cada uno tiene variantes `-800w.webp` y `-1200w.webp` en esa misma carpeta.

| Pareja | ID de opción → archivo | ID de consecuencia → archivo |
|---|---|---|
| Preguntar | `ume-opt-preguntar` → `opt-preguntar.webp` | `ume-c-preguntar` → `c-preguntar.webp` |
| Horario | `ume-opt-horario` → `opt-horario.webp` | `ume-c-horario` → `c-horario.webp` |
| Adulto de confianza | `ume-opt-adulto` → `opt-adulto.webp` | `ume-c-adulto` → `c-adulto.webp` |
| Regulación | `ume-opt-regulacion` → `opt-regulacion.webp` | `ume-c-regulacion` → `c-regulacion.webp` |
| Tiempo | `ume-opt-tiempo` → `opt-tiempo.webp` | `ume-c-tiempo` → `c-tiempo.webp` |
| Salir | `ume-opt-salir` → `opt-salir.webp` | `ume-c-salir` → `c-salir.webp` |

Además de los 36 WebP servidos por la aplicación:

- [Doce PNG nativos](art-batch-3/originals/), con los IDs como nombres de archivo.
- [Lámina OPCIÓN → CONSECUENCIA](art-batch-3/pairs-review.webp), únicamente para revisión.
- [57 capturas del reproductor real](art-batch-3/previews/): seis tarjetas, doce momentos
  con su texto accesible y una vista de selección por tamaño.
- [Prompts y fuentes](art-batch-3/generation.json),
  [exportaciones, tamaños, pesos y SHA256](art-batch-3/exports.json),
  [validación de archivos](art-batch-3/file-validation.json) y
  [estado calculado del catálogo](art-batch-3/catalog-state.json).

## Resolución y exportación

Los doce originales PNG son **1448 × 1086 px**, 4:3. Se conservan sin modificar
tanto en la carpeta de generación del entorno como en `art-batch-3/originals/`.
Las entregas principales son **2048 × 1536 px** por contrato del catálogo:
**son remuestreadas, no generación nativa a 2048 px**.
Las variantes son 800 × 600 y 1200 × 900 px, exportadas directamente del PNG nativo.
No se crean composiciones verticales ni recortes adicionales.

Exportación WebP con ImageMagick, filtro Lanczos, calidad 78 y metadatos eliminados.
Los archivos principales pesan 268–388 kB; las variantes, 74–200 kB.
El lote de producción suma 7.11 MB decimales (doce principales + veinticuatro variantes).
Los PNG nativos de revisión ocupan 33.31 MiB y no forman parte del contenido servido.

[`scripts/export-art-batch-3.py`](../scripts/export-art-batch-3.py) reproduce la
exportación desde los PNG incluidos y comprueba sus hashes. Solo redimensiona,
comprime y compone la lámina de revisión; no dibuja ilustraciones.
Requiere ImageMagick y Pillow como herramientas externas de producción.

## Continuidad y lectura visual

Se consultaron las guías obligatorias, el informe de integración de fase 5,
el lote anterior y las consecuencias completas en `story.ts`.
La primera pareja se generó y revisó antes de producir las otras cinco.
Cada consecuencia utiliza su opción como referencia de generación.

Se mantuvieron Teo, Andrés y Pilar según sus hojas maestras: pelo, piel, ropa,
mochila mostaza con tren, cascos verdes, camisa de cuadros y trenza/colgante de Pilar.
La paleta y el acabado conservan gouache y lápiz, luz cálida, ventanas petróleo,
madera, sillas salvia, plantas y paredes crema. Se revisaron manos, anatomía,
tarjeta, cascos, pelota y ausencia de duplicación de apoyos.

| Pareja | Continuidad y acción revisadas |
|---|---|
| Preguntar | Mismo pupitre y encuadre. Mano levantada → respuesta de Andrés contando dos actividades. |
| Horario | Misma pizarra vacía → cinco dibujos en el orden establecido: libro, pelota, lápiz, plato y pincel. |
| Adulto | Teo busca a Pilar → Pilar participa en la conversación con Andrés, sin tocar a Teo. |
| Regulación | Mismo pupitre, pelota y cascos. Mano ajustando el casco → mano apoyada y postura algo menos tensa, sin euforia ni efecto de cura. |
| Tiempo | Tarjeta con dos barras de pausa → Teo sentado observando mientras Andrés prepara libros, sin prisa ni presión. |
| Salir | Mismo pasillo, banco, perchas y puerta. Teo busca alivio → Andrés mira en otra dirección y aún no lo ha localizado, con preocupación contenida. |

No hay letras, rótulos, diálogos ni bocadillos incrustados en las ilustraciones.
Los cinco dibujos del horario y las dos barras de pausa son los pictogramas
requeridos por las escenas. Los textos visibles en las capturas pertenecen a la interfaz.
La lámina comparativa sí incluye títulos externos al arte, como material de revisión.

## Integración y capturas

Se extendió únicamente el helper de datos `option` para trasladar `status` y
`variants` al registro, igual que ya hacían `scene` y `panel`. Los doce IDs se
marcaron como `listo` después de exportar los archivos. Se regeneró
`ASSET_REQUESTS.md` con el script oficial; no se editaron sus cifras a mano.
No se añadieron campos nuevos al contrato de imágenes.

No hay cambios en React, estilos, motor, textos educativos, rutas, imágenes
anteriores ni símbolo de cabecera. Los 24 objetos anteriores del manifiesto
permanecen idénticos. La generación es una herramienta de producción externa;
no se incorpora generación ni un servicio de IA a la aplicación.

La revisión en Chromium utilizó 390 × 844 (DPR 2), 820 × 1180 y 1180 × 820 (DPR 1).
La prueba específica recorrió todas las elecciones y los doce momentos en cada tamaño,
comprobó proporción 4:3, carga, fuentes responsive, texto narrativo exacto y regreso
a «Probar otra posibilidad». No hubo desbordamiento horizontal ni errores de página.

Las tarjetas midieron aproximadamente 360, 370 y 351 px, respectivamente; los
momentos de consecuencia llegaron a 536 px en horizontal. El navegador seleccionó
800 px en móvil y 1200 px en tableta en estas condiciones. Se inspeccionaron
visualmente las seis parejas capturadas en los tres tamaños.

Ejemplos de capturas:

| Tamaño | Tarjeta de decisión | Consecuencia y texto |
|---|---|---|
| Móvil | [Preguntar](art-batch-3/previews/390-choice-preguntar.jpg) | [Regulación](art-batch-3/previews/390-ume-c-regulacion.jpg) |
| Tableta vertical | [Tiempo](art-batch-3/previews/820-choice-tiempo.jpg) | [Horario](art-batch-3/previews/820-ume-c-horario.jpg) |
| Tableta horizontal | [Adulto](art-batch-3/previews/1180-choice-adulto.jpg) | [Salir](art-batch-3/previews/1180-ume-c-salir.jpg) |

## Pruebas ejecutadas

Todas terminaron con código de salida 0. Los [logs](art-batch-3/verification/)
y [resultados de accesibilidad](art-batch-3/verification/quality-results.json)
se incluyen con la entrega.

| Comando / prueba | Resultado |
|---|---|
| `npm run assets:doc` | Documento generado desde los 72 recursos; 36 listos. |
| `npm run check` | Tipos, 46 tests en seis archivos y build de producción correctos. |
| `tests/browser/art-files.mjs` | 36 recursos listos, 116 archivos decodificados con dimensiones correctas; hashes principales y alfa de recursos transparentes correctos. |
| `tests/browser/art-layout.mjs` | 390/820/1180: cero errores de recurso y cero recortes narrativos; solo se informa el recorte decorativo previsto de `portada-fondo`. |
| `tests/browser/quality.mjs` | Cuento, cómic y seis alternativas en los tres tamaños; accesibilidad automática, teclado, persistencia, resumen y borrado correctos. |
| `tests/browser/story-fit.mjs` | 23 páginas × tres tamaños × dos tamaños de letra; sin desplazamiento con letra normal. Con letra grande, el desplazamiento permitido afecta a 15 páginas móviles y tres horizontales. |
| `tests/browser/art-batch-3.mjs` | Las seis decisiones y sus doce momentos en los tres tamaños; proporción, carga, texto y navegación correctos; 57 capturas. |
| Reproducción de exportaciones | Doce PNG conservados y sus hashes comprobados; 36 WebP reproducidos; hashes verificados. |
| Protección de entregas anteriores | Los 24 objetos del manifiesto anterior permanecen idénticos. |

Las pruebas de navegador utilizaron Playwright, axe-core y Chromium instalados
fuera del proyecto, sin añadir dependencias. Para reproducirlas, iniciar Vite en
`http://127.0.0.1:5173` y ejecutar cada script con
`NUBI_BROWSER_TOOLS=/ruta/a/node_modules` y `CHROMIUM_PATH=/ruta/a/chromium`.
`NUBI_ART_EVIDENCE` permite elegir dónde guardar las capturas de este lote.

## Observación para Claude y revisión humana

El texto existente de `ume-c-horario` dice «lo mira entero, de arriba abajo»,
mientras que el contrato gráfico exige los cinco pictogramas en fila horizontal,
como en `ume-s6-plan`. Se preservan tanto el orden gráfico establecido como el
texto educativo. Propuesta editorial para valorar: describir el recorrido como
«de principio a fin». No se ha aplicado ningún cambio pedagógico.

La revisión artística y técnica aquí documentada no equivale a una validación
pedagógica realizada con alumnado.

## Recursos pendientes

Inventario calculado desde el registro en [catalog-state.json](art-batch-3/catalog-state.json):

| Tipo | Cantidad | IDs pendientes |
|---|---|---|
| Lugares | 6 | `place-colegio`, `place-casa`, `place-parque`, `place-amigos`, `place-emociones`, `place-herramientas` |
| Herramientas | 7 | `tool-pedir-ayuda`, `tool-descansar`, `tool-espacio-tranquilo`, `tool-comunicar-necesidad`, `tool-anticipar-cambios`, `tool-expresar-desacuerdo`, `tool-apoyos-sensoriales` |
| Emociones | 9 | `emo-alegria`, `emo-calma`, `emo-sorpresa`, `emo-curiosidad`, `emo-inseguridad`, `emo-frustracion`, `emo-tristeza`, `emo-enfado`, `emo-cansancio` |
| Viñetas | 14 | `ume-k1-2`, `ume-k1-3`, `ume-k2-1`, `ume-k2-2`, `ume-k2-3`, `ume-k2-4`, `ume-k3-1`, `ume-k3-2`, `ume-k4-1`, `ume-k6-1`, `ume-k6-2`, `ume-k6-3`, `ume-k7-1`, `ume-k7-2` |

El audio humano y el vídeo del piloto continúan pendientes fuera del catálogo
de 72 recursos visuales. Ninguna decisión ni consecuencia queda pendiente en este lote.

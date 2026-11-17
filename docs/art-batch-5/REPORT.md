# Fase 10 · Nueve emociones de Nubi

17 de noviembre de 2026. Rama `feat/codex-art-batch-5`, basada en `integration/phase-9` (`3416c7a67a16aae2ead0b4ea5e30d076ba56c189`). Sin merge ni despliegue.

## Entrega artística

- Nueve PNG RGBA principales de 1024×1024 en `public/media/emotions/` y dieciocho variantes 256/512, con perfil sRGB. Las rutas, los IDs, las descripciones y los textos alternativos existentes se conservan.
- Nueve originales raster nativos **1254×1254**, sin modificar, más la primera serie exploratoria en `originals/`. Image Gen no entrega documentos por capas. No se cargan desde la aplicación.
- Los 1024/512/256 son reducciones Lanczos de cada original individual, no ampliaciones de recortes de la hoja. Se elimina únicamente ruido alfa de opacidad 1–2/255 (<1 %) en la exportación. Operaciones y SHA256 en [exports.json](exports.json); producción en [ART_DIRECTION.md](ART_DIRECTION.md) y [generation.json](generation.json).
- Lámina 3×3: [collection-review.png](collection-review.png). Reconocimiento a 64, 80 y 100 px: [small-size-review.png](small-size-review.png). Alfa sobre petróleo: [alpha-review.png](alpha-review.png).
- Registro: solo se añaden `status: 'listo'` y `variants: [256, 512]` a los nueve recursos de emoción. `ASSET_REQUESTS.md` se regenera mediante su script. Manifiesto de entrega ampliado para que las pruebas existentes sigan verificando todos los recursos.

## Coherencia y diferenciación

Se inspeccionaron directamente la hoja maestra, `nubi.png`, `nubi-saludo.png` y `nubi-pensando.png`. Las generaciones usan las referencias reales. Se preservan nube asimétrica, lóbulo central alto, pequeños brazos, textura de gouache, crema, contorno petróleo, volumen salvia y mejillas coral. No hay texto dentro de los PNG ni fondos decorativos.

| Emoción | Señales que no dependen solo del color |
|---|---|
| Alegría | Silueta expandida, ojos en media luna hacia arriba, sonrisa pequeña |
| Calma | Silueta baja y horizontal, ojos completamente cerrados y relajados |
| Sorpresa | Forma elevada, ojos abiertos, boca pequeña en «o» y dos trazos suaves |
| Curiosidad | Inclinación y lupa grande legible |
| Inseguridad | Silueta recogida, brazos próximos, mirada lateral y boca casi horizontal |
| Frustración | Ceño curvo suave, boca contenida y nudo interior |
| Tristeza | Boca descendente, cejas elevadas hacia el centro y una gota |
| Enfado | Ceño angular perceptible, boca firme y contorno marcado, sin nudo ni amenaza |
| Cansancio | Postura caída, párpados entreabiertos y luna |

Se revisaron las tres láminas y las pantallas reales. Calma/cansancio se separan por postura, ojos y luna; inseguridad/tristeza por mirada lateral frente a gota y boca descendente; frustración/enfado por nudo y ceño curvo frente a ceño angular; sorpresa/curiosidad por ojos/boca/trazos frente a lupa. La inseguridad se corrigió tras la primera serie para evitar que pareciera tristeza. También se rechazaron una calma con halo y dos salidas con varios personajes.

A 64 px los detalles faciales son deliberadamente pequeños: se mantienen las palabras visibles y no se espera que una imagen comunique por sí sola una emoción universal. Esta es una revisión editorial, no un estudio de reconocimiento con niños ni validación pedagógica. Las expresiones son metáforas; cada persona puede expresarse de otra forma.

## Integración real y recomendación para Claude

`EmotionArt` solo se utiliza actualmente en `EmotionsScreen.tsx`: rejilla de 64 px y detalle de 100 px. Las nueve ilustraciones se muestran automáticamente al registrar su disponibilidad, sin modificar React ni CSS.

**El selector «¿Cómo te sentirías?» del cuento no utiliza `EmotionArt`: `FeelingsView` pasa `icon` a `ToggleCard`, que representa un SVG de `Icon`.** Actualizar el catálogo no puede sustituir esos iconos. Se conserva su comportamiento y se verifica selección con teclado, texto, `aria-pressed` e intensidad. Las capturas muestran ese estado real; no se simula una integración inexistente.

Recomendación para una siguiente tarea de Claude: conectar las opciones que realmente correspondan a un `EmotionId` con `EmotionArt`, conservando «Otra cosa», «No lo sé» y las opciones que no sean emociones registradas. Revisar el espacio y `sizes` a 64 px sin cambiar el contenido. Esta entrega no modifica los componentes, el motor ni los textos para resolver esa limitación.

## Catálogo calculado

[Datos calculados desde los registros](catalog.json): **72 recursos · 59 listos · 13 pendientes**. Quedan **7 herramientas y 6 lugares**. Los nueve recursos `emo-*` están listos. No se han cambiado estados de otros recursos.

## Validación

- `npm run assets:doc`: 72 recursos, documento regenerado.
- `npm run check`: tipos, **55 tests en 7 archivos**, compilación de producción correctos.
- `python tests/art-batch-5-files.py`: nueve originales con SHA256 y **27 PNG** con formato, tamaño, ICC, alfa real y márgenes transparentes. [Resultados](file-validation.json).
- `tests/browser/art-files.mjs`: **59 recursos / 185 archivos**; manifiesto, decodificación, dimensiones y alfa correctos. [Resultados](all-art-files.json).
- `tests/browser/art-batch-5.mjs`: nueve emociones en 390×844, 820×1180 y 1180×820; Tab/Enter, foco visible, selección y título textual, `aria-pressed`, imágenes sin recorte, variante de 256 px y axe sin infracciones en Mis emociones. Selector existente del cuento con selección e intensidad verificadas. [Resultados](browser-results.json).
- `tests/browser/art-layout.mjs`: 390/820/1180; **148 cargas, 42 placeholders pendientes, 0 errores**, sin recortes narrativos ni desbordamiento. Solo el recorte decorativo previsto de portada.
- `tests/browser/quality.mjs`: pasa en 390/820/1180; cuento, cómic, seis posibilidades, emociones, intensidad, resumen, persistencia, borrado, teclado y vídeo; comprobaciones axe sin infracciones. [Resultados](quality-results.json).

Las herramientas de navegador son externas al proyecto en `/tmp/nubi-browser-tools`; no se han añadido dependencias. Servidor de estas pruebas en el puerto 5174. Las pruebas emulan Chromium, no dispositivos físicos ni lector de pantalla.

## Capturas

| Pantalla | 390×844 | 820×1180 | 1180×820 |
|---|---|---|---|
| Mis emociones | [móvil](previews/390-emociones.png) | [tableta vertical](previews/820-emociones.png) | [tableta horizontal](previews/1180-emociones.png) |
| Detalle seleccionado | [móvil](previews/390-emocion-detalle.png) | [tableta vertical](previews/820-emocion-detalle.png) | [tableta horizontal](previews/1180-emocion-detalle.png) |
| Selector del cuento existente | [móvil](previews/390-selector-cuento.png) | [tableta vertical](previews/820-selector-cuento.png) | [tableta horizontal](previews/1180-selector-cuento.png) |

# Fase 10 · Dirección artística y producción

Las nueve ilustraciones son variaciones de la mascota aprobada, no personajes nuevos. Referencias inspeccionadas y adjuntadas a Image Gen: `docs/art-direction/models/nubi.webp`, `public/media/characters/nubi-saludo.png`, `nubi-pensando.png`. También se inspeccionó directamente `nubi.png`.

Contrato visual: crema cálido, contorno petróleo de lápiz, volumen salvia, mejillas coral, ojos pequeños, brazos de nube y textura de gouache interior. Sin texto, fondo ni sombra de suelo. Expresiones contenidas, legibles por silueta, ojos y accesorios; el color no es la única señal.

Primera serie: hoja 3×3 generada y conservada en `originals/first-series.png`. Se solicitaron 3072×3072, pero el generador devolvió 1254×1254; no se usaron sus pequeños recortes como exportaciones definitivas. Se generaron después expresiones individuales con referencias directas.

Revisión inicial: la inseguridad se parecía demasiado a tristeza. Se pidió mirada lateral, boca casi horizontal y brazos recogidos. Se rechazó una calma con resplandor exterior y dos resultados que devolvieron hojas de personajes en lugar de una figura. Las correcciones se solicitaron como ediciones reales de una sola imagen individual aprobada.

Los archivos nativos son PNG raster tal como los devuelve Image Gen, no documentos con capas ni ilustraciones vectoriales. Se conservan sin alteración en `originals/`, fuera de `public/`. La herramienta no entrega capas editables. La exportación elimina únicamente ruido alfa aislado de opacidad 1–2/255 (<1 %) fuera de la figura; los originales permanecen intactos. Las exportaciones de aplicación llevan perfil sRGB y variantes PNG 256/512 conforme a la convención existente. Todo remuestreo está declarado en `exports.json`; no se atribuye resolución nativa a un tamaño exportado.

Estas expresiones son metáforas editoriales. No permiten diagnosticar cómo se siente una persona a partir de su cara y no sustituyen la revisión humana con niños y niñas. No se modifican etiquetas ni textos educativos.

## Instrucción común de generación individual

Create ONE individual production illustration of the SAME Nubi mascot from attached master and first-series contact sheet. Square canvas 1024x1024 requested. Single cloud centered, about 80% canvas width, ample safe transparent margin, TRUE alpha transparent background. Follow original asymmetrical cloud: tall central top lobe, side lobes, two lower lobes and tiny cloud arms. Digital gouache with soft brush/paper texture INSIDE character only, warm ivory cream body, subtle sage volume lower right, dark muted petrol pencil outline, tiny petrol eyes, soft coral cheeks, tiny mouth. Exactly the same one-artist editorial finish as attached masters. No text, no background, no checkerboard, no floor shadow, no halo, no floating flecks, no decorative symbols unless specified. Communicate clearly at 64px, natural subtle expressions, not emojis, not dramatic, no human face, no new mascot. Use attached images as direct editing references.

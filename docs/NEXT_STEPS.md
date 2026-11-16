# Siguiente fase

## Claude / revisión técnica

1. Revisar `feat/codex-quality` contra `feat/claude-foundation` y ejecutar `npm run check`; no fusionar sin autorización. Revisar en especial la validación de partidas antiguas (se descartan si son incompatibles), foco y apertura en lectura.
2. Validar teclado y anuncios con NVDA/Firefox y VoiceOver/Safari, zoom 200–400 %, texto grande/espaciado, dispositivos táctiles reales y compatibilidad Android/iOS. Axe en Chromium no acredita cumplimiento total WCAG.
3. Probar voces locales reales y carga tardía de la lista de voces. Si no hay voz local española, NUBI mantiene texto; no sustituirla por voz remota silenciosamente. Probar archivos de narración y fallos de red cuando se entreguen.
4. Al llegar vídeo: comprobar reproducir/pausar, fin, búsqueda, velocidad, fullscreen, carga/fallo de fuentes y activación de subtítulos tras carga. El WebVTT existente es borrador y debe ajustarse al montaje real.
5. Ampliar migración/validación del agregado histórico y ajustes de localStorage; esta fase endurece las partidas reproducibles. Revisar restauración cuando cambie el contenido manteniendo IDs.

## Persona responsable / pedagogía

Mantener `pendiente-validacion`. Revisar con profesionales, personas autistas y familias: claridad para 6–7 años, opción salir sin avisar sin culpa, escala opcional de tres niveles y necesidades sensoriales. Consultar la obra original de la escala de cinco puntos y dejar trazabilidad de las fuentes declaradas verificadas. Esta auditoría no aporta validación clínica ni nuevas afirmaciones bibliográficas.

## ChatGPT / ilustración

No hacen falta recursos nuevos por estas correcciones. Producir los **72 recursos pendientes** de `ASSET_REQUESTS.md`, con sus IDs, rutas, dimensiones, transparencias y alt. Empezar por las hojas de personajes para asegurar consistencia, después localizaciones, cuento, viñetas y decisiones. Conservar apoyos de comunicación y sensoriales; no hornear texto en imágenes. Entregar individualmente WebP/PNG según el registro, cambiar solo el asset entregado a listo y regenerar el documento.

Narración humana y vídeo son entregas posteriores; mantenerlos identificados como pendientes hasta contar con los archivos reales.

## Publicación del trabajo

La creación del PR por GitHub API requiere que esa API esté accesible y autorizada en el entorno. Si falla, usar la rama publicada para abrir un PR con base `feat/claude-foundation`, título y cuerpo de `PULL_REQUEST_CODEX_QUALITY.md`. No hacer merge automático. Comprobar de nuevo conflictos si Claude añade commits después de la comprobación de esta entrega.

Estado de esta entrega: la publicación mediante `git push -u origin feat/codex-quality` funciona. La creación del PR con `gh pr create --base feat/claude-foundation ...` falla con `Post https://api.github.com/graphql: Forbidden` (también falla una lectura REST a api.github.com). No se ha creado el PR ni realizado merge. Abrirlo desde https://github.com/TinyChat-up/NUBI/compare/feat/claude-foundation...feat/codex-quality usando el cuerpo preparado. `git merge-tree --write-tree origin/feat/claude-foundation HEAD` no detecta conflictos contra 447edf0.

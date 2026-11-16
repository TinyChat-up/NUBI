# Resultados de pruebas — 16/11/2026

Entorno: Linux, Node 24.22.1, npm 11.9.0, Chromium del entorno, herramientas externas Playwright y axe-core. Base de Claude: 447edf0. No se instalaron dependencias nuevas en NUBI ni se cambió su lockfile.

## Ejecuciones

| Comprobación | Resultado |
|---|---|
| `npm install --cache /workspace/.npm-cache --no-audit --no-fund` | Correcto, sin diferencias en package.json/package-lock.json |
| `npm run check` inicial | Tipos, 7 tests y build correctos |
| `npm run check` final | Tipos, 36 tests en 4 archivos y build correctos |
| `npm run assets:doc` | 72 recursos, salida idéntica al documento versionado |
| Chromium, recorrido en 390 / 820 / 1180 × 900 | Cuento y cómic, repetición, flechas, diálogo/Escape, seis decisiones, volver, emociones/No lo sé, intensidad, estrategias y resumen |
| Persistencia | Recargar recupera selecciones e intensidad; estado incompleto se descarta sin pantalla vacía |
| Borrado familiar | Elimina partidas NUBI; conserva claves ajenas y preferencias |
| Movimiento | Sin preferencia reducida: detener muestra contenido nuevo con animationName none. Con preferencia reducida: animaciones desactivadas |
| Axe en 36 estados capturados | Sin infracciones automáticas WCAG A/AA en los estados finales; ver audit/results.json |
| Otras pantallas a 390 × 844 | Mundo, colegio, catálogo, recreaciones, herramientas, detalle pedir ayuda, emociones, ajustes y ruta inexistente cargan sin excepciones ni desbordamiento; axe sin infracciones |
| Narración con dobles de navegador | No autoarranque aun con preferencia persistida; rechazo de voz remota; error asíncrono de voz local muestra texto; volver a lectura cancela voz |
| Solicitudes durante recorrido | Sin destinos externos observados |

29 tests añadidos: 12 recorridos (seis opciones × dos formatos), 15 casos de restauración, URL malformada/decodificación válida y registro de recursos. Los 7 tests originales permanecen activos.

Los recorridos del navegador comprueban condiciones y fallan con código distinto de cero; axe no se usa como sustituto de un lector de pantalla. La selección de estrategias es opcional: los tests del motor cubren avanzar sin elegir y el navegador cubre elegir y conservarlo en el resumen.

## Reproducir navegador

Herramientas opcionales fuera del repositorio, sin modificar las dependencias de NUBI:

```bash
npm install --prefix /workspace/quality-tools playwright @axe-core/playwright
cd /workspace/NUBI
npm run dev -- --host 0.0.0.0 --port 5173 --strictPort
# En otra sesión:
NUBI_BROWSER_TOOLS=/workspace/quality-tools NUBI_EVIDENCE=/tmp/nubi-evidence node tests/browser/quality.mjs
NUBI_BROWSER_TOOLS=/workspace/quality-tools node tests/browser/narration.mjs
NUBI_BROWSER_TOOLS=/workspace/quality-tools node tests/browser/screens.mjs
```

`quality.mjs` usa CHROMIUM_PATH (por defecto /usr/bin/chromium), NUBI_URL (por defecto puerto 5173) y NUBI_EVIDENCE para capturas y resultados. Los otros dos scripts usan el Chromium y puerto documentados. No cambiar código mientras se ejecuta el recorrido: HMR puede interrumpirlo; se descartó una ejecución interferida por cambios de hooks y se repitió sobre código estable.

## No ejecutado / límites

No se probó reproducción de vídeo final (todavía no existe), sincronización de WebVTT con ese vídeo, voces reales en dispositivos físicos, lector de pantalla, zoom 200–400 % ni auditoría completa WCAG manual. El vídeo pendiente y las ilustraciones son estados esperados, no tests fallidos. La comprobación general de pantallas no equivale a probar cada herramienta/recreación individual ni todas las combinaciones de ajustes. No se revalidaron citas bibliográficas externas.

# Traspaso: fase 7 (local → Claude Code en la nube)

Fecha: 2026-11-16. Rama: `integration/phase-7`.

## Estado

- `integration/phase-7` = fase 5 + merge de `feat/codex-art-batch-3`
  (commit `0f44664`: ilustradas las seis parejas decisión/consecuencia).
- Árbol de trabajo limpio al hacer el traspaso.
- La sesión local se cortó por disco lleno en el Mac; no hay cambios de código perdidos.

## Verificación de la fase 7

**Completada en la nube** (informe: [`integration/PHASE_7_REPORT.md`](integration/PHASE_7_REPORT.md)).

| Prueba | Estado |
| --- | --- |
| `npm run check` | ✅ 46 tests en 6 archivos y build |
| `tests/browser/art-files.mjs` | ✅ PASS |
| `tests/browser/art-layout.mjs` | ✅ PASS en 390/820/1180 (cargado 88, provisional 72, error 0) |
| `tests/browser/art-batch-2.mjs` | ✅ PASS |
| `tests/browser/art-batch-3.mjs` | ✅ PASS |
| `tests/browser/quality.mjs` | ✅ PASS (axe sin infracciones) |
| `tests/browser/story-fit.mjs` | ✅ PASS |
| `tests/browser/narration.mjs` | ✅ PASS |
| `tests/browser/screens.mjs` | ✅ PASS |
| `tests/browser/focus-obscured.mjs` (nueva) | ✅ PASS tras corregir el foco oculto bajo las barras fijas |

Pendiente de decisión humana: frase «de arriba abajo» en `ume-c-horario` (informe, §12).

## Siguiente paso

1. Codex: lote de viñetas del cómic en `feat/codex-art-batch-4`, creada desde `integration/phase-7` (informe, §15).
2. Persona responsable: validar la frase del horario y, si procede, las mejoras opcionales D del informe (§8).
3. No hacer merge a `main` sin autorización (ver `AGENTS.md`).

## Cómo ejecutar las pruebas de navegador en la nube

> **Actualizado en la fase 7:** el entorno cloud ya trae Chromium en `/opt/pw-browsers` y Playwright 1.63.0. Es mejor instalar esa misma versión y apuntar `CHROMIUM_PATH` al navegador preinstalado (informe, §14). `quality.mjs` y `screens.mjs` necesitan también `@axe-core/playwright`, y `NUBI_BROWSER_TOOLS` debe ser la carpeta que contiene `package.json`. Abajo se conserva la receta original.

Las pruebas no traen Playwright como dependencia del proyecto; lo cargan desde una carpeta externa:

```bash
mkdir -p /tmp/qt && (cd /tmp/qt && npm init -y >/dev/null && npm i playwright && npx playwright install --with-deps chromium)
export NUBI_BROWSER_TOOLS=/tmp/qt/node_modules
export CHROMIUM_PATH=$(node -e "console.log(require('/tmp/qt/node_modules/playwright').chromium.executablePath())")
export NUBI_URL=http://127.0.0.1:5173
export NUBI_ART_EVIDENCE=/tmp/p7-batch3   # carpeta de capturas para art-batch-3
for t in art-layout art-batch-3 art-batch-2 quality story-fit narration screens; do
  node tests/browser/$t.mjs > /tmp/p7-$t.log 2>&1; echo "$t exit=$?"; tail -3 /tmp/p7-$t.log
done
```

# Traspaso: fase 7 (local → Claude Code en la nube)

Fecha: 2026-11-16. Rama: `integration/phase-7`.

## Estado

- `integration/phase-7` = fase 5 + merge de `feat/codex-art-batch-3`
  (commit `0f44664`: ilustradas las seis parejas decisión/consecuencia).
- Árbol de trabajo limpio al hacer el traspaso.
- La sesión local se cortó por disco lleno en el Mac; no hay cambios de código perdidos.

## Verificación de la fase 7

| Prueba | Estado |
| --- | --- |
| `tests/browser/art-layout.mjs` | ✅ PASS en 390/820/1180 (cargado 88, provisional 72, error 0) |
| `tests/browser/art-batch-3.mjs` | ⏳ pendiente |
| `tests/browser/art-batch-2.mjs` | ⏳ pendiente |
| `tests/browser/quality.mjs` | ⏳ pendiente |
| `tests/browser/story-fit.mjs` | ⏳ pendiente |
| `tests/browser/narration.mjs` | ⏳ pendiente |
| `tests/browser/screens.mjs` | ⏳ pendiente |
| `npm run check` | ⏳ repetir en la nube |

## Siguiente paso

1. `npm ci && npm run check`.
2. Levantar la app (`npm run dev -- --host 127.0.0.1 --port 5173`) y ejecutar las pruebas de navegador pendientes.
3. Corregir lo que falle, documentar resultados en `docs/TEST_RESULTS.md` y preparar el informe de fase 7.
4. No hacer merge a `main` sin autorización (ver `AGENTS.md`).

## Cómo ejecutar las pruebas de navegador en la nube

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

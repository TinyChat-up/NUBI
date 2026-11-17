# CLAUDE.md

Las reglas del repositorio están en **[AGENTS.md](AGENTS.md)** y se aplican íntegramente. Este archivo solo añade notas prácticas para Claude Code.

> **Estado:** fase 13 integrada: catálogo gráfico completo (72/72), herramientas también en el selector de estrategias y precarga corregida. Leer primero **[docs/integration/PHASE_13_REPORT.md](docs/integration/PHASE_13_REPORT.md)**; antecedentes en [PHASE_11](docs/integration/PHASE_11_REPORT.md) y [PHASE_9](docs/integration/PHASE_9_REPORT.md); el contexto del entorno cloud sigue en [docs/integration/PHASE_7_REPORT.md](docs/integration/PHASE_7_REPORT.md) y [docs/HANDOFF_PHASE_7.md](docs/HANDOFF_PHASE_7.md).
>
> **Revisión de preparación del piloto (fase 14):** [docs/review/PHASE_14_READINESS_REPORT.md](docs/review/PHASE_14_READINESS_REPORT.md), en la rama `review/phase-14-pilot-readiness`. Es evaluación y protocolos: no cambia la rama estable. Sus decisiones pendientes están en `docs/review/DECISION_REGISTER.md`; no aplicar cambios de texto o diseño sin aprobación.
>
> **Rama de referencia:** `integration/phase-13` (sucesora de `integration/phase-11`, `-9` y `-7`). El trabajo de Claude continúa ahí (o en una rama `feat/claude-*` creada desde ella); el de Codex, en `feat/codex-*` creada desde ella. `main` no recibe merges sin autorización.

## Comandos

```bash
npm run dev          # desarrollo
npm run check        # obligatorio antes de commit: tsc + vitest + vite build
npm run assets:doc   # tras tocar cualquier registro de assets
```

## Dónde está cada cosa

- Esquema de historias: `src/engine/types.ts` (empezar siempre por aquí).
- Motor (reducer puro, testeado): `src/engine/storyEngine.ts`.
- Validador de historias: `src/engine/validate.ts` (se ejecuta en `npm test`).
- Episodio piloto: `src/content/stories/una-manana-diferente/{story,assets}.ts`.
- Reproductor: `src/components/player/StoryPlayer.tsx` (+ `interactions.tsx`, `ComicView.tsx`, `SummaryView.tsx`).
- Placeholders: `src/components/placeholder/` (se dibujan desde `asset.placeholder`).

## Hábitos

- Verificar visualmente los cambios de UI en 390, 820 y 1180 px de ancho.
- Para comprobar un flujo completo del piloto, recorrer cuento y cómic hasta "Mi resumen" (el test `recorre el cuento de principio a fin` cubre la lógica, no la presentación).
- Al añadir texto infantil, releer `docs/CONTENT_STANDARD.md` §2 (lenguaje) y §4 (decisiones).
- Rama actual: `integration/phase-13` (ver el aviso de arriba). Históricamente Claude trabajó en `feat/claude-foundation` y después en `feat/claude-experience`; esas ramas ya están integradas y no deben usarse como base. No hacer merge a `main` sin autorización.
- Pruebas de navegador: Playwright y axe-core se instalan **fuera** del proyecto; instrucciones en `docs/HANDOFF_PHASE_7.md`. En la nube, Chromium ya está en `/opt/pw-browsers/chromium`.
- `tests/browser/art-batch-5.mjs` escribe en `docs/art-batch-5/` (evidencias versionadas de Codex): tras ejecutarla, restaurar solo esos archivos (`git checkout -- docs/art-batch-5/previews docs/art-batch-5/browser-results.json`).

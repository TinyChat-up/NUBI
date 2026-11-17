# CLAUDE.md

Las reglas del repositorio están en **[AGENTS.md](AGENTS.md)** y se aplican íntegramente. Este archivo solo añade notas prácticas para Claude Code.

> **Estado:** fase 13 integrada: catálogo gráfico completo (72/72), herramientas también en el selector de estrategias y precarga corregida. Leer primero **[docs/integration/PHASE_13_REPORT.md](docs/integration/PHASE_13_REPORT.md)**; antecedentes en [PHASE_11](docs/integration/PHASE_11_REPORT.md) y [PHASE_9](docs/integration/PHASE_9_REPORT.md); el contexto del entorno cloud sigue en [docs/integration/PHASE_7_REPORT.md](docs/integration/PHASE_7_REPORT.md) y [docs/HANDOFF_PHASE_7.md](docs/HANDOFF_PHASE_7.md).
>
> **Revisión de preparación del piloto (fase 14):** [docs/review/PHASE_14_READINESS_REPORT.md](docs/review/PHASE_14_READINESS_REPORT.md), en la rama `review/phase-14-pilot-readiness`. Es evaluación y protocolos: no cambia la rama estable. Sus decisiones pendientes están en `docs/review/DECISION_REGISTER.md`; no aplicar cambios de texto o diseño sin aprobación.
>
> **Correcciones previas al piloto (fase 15):** [docs/review/PHASE_15_REMEDIATION_REPORT.md](docs/review/PHASE_15_REMEDIATION_REPORT.md), en la rama `feat/claude-pilot-remediation` (pendiente de revisión, sin integrar). Las propuestas de texto de [EDITORIAL_APPROVAL_PHASE_15.md](docs/review/EDITORIAL_APPROVAL_PHASE_15.md) **no están aplicadas**: solo se aplican con autorización humana expresa.
>
> **Borradores de textos cortos (fase 16):** [docs/review/PHASE_16_REPORT.md](docs/review/PHASE_16_REPORT.md), en la rama `review/phase-16-short-text-drafts`. Son propuestas **no aprobadas ni aplicadas** (`docs/review/phase-16/APPROVAL_CHECKLIST.md`); no incorporarlas a `story.ts` sin autorización expresa.
>
> **Revisión UI/UX y portada inmersiva (fase 18):** [docs/design/PHASE_18_UX_QA_REPORT.md](docs/design/PHASE_18_UX_QA_REPORT.md) y [PHASE_18_HOMEPAGE_COMPARISON.md](docs/design/PHASE_18_HOMEPAGE_COMPARISON.md), en la rama `review/phase-18-ux-qa` (sobre el rediseño de Codex `feat/codex-ux-infantil-v1`, pendiente de revisión, sin integrar). La decisión del logotipo sigue pendiente: no cambiarlo sin autorización.
>
> **Cuentos sociales interactivos (fase 19):** [docs/product/PHASE_19_SIMPLIFICATION_REPORT.md](docs/product/PHASE_19_SIMPLIFICATION_REPORT.md), en la rama `feat/claude-social-stories-v1` (sobre `review/phase-18-ux-qa`, pendiente de revisión, sin integrar). NUBI pasa a tener dos funciones: **Descubrir un cuento** (`/historias`) y **Para familias y docentes** (`/acompanar`), más Ajustes; las rutas antiguas muestran «NUBI ha cambiado» ([REMOVED_NAVIGATION.md](docs/product/REMOVED_NAVIGATION.md)). Pantallas retiradas en `src/screens/legacy/`. Propuestas editoriales P-1…P-8 sin aplicar.
>
> **Cuentos visuales y voz (fase 20):** [docs/product/PHASE_20_VISUAL_REPORT.md](docs/product/PHASE_20_VISUAL_REPORT.md), en la rama `feat/codex-nubi-visual-v1` (sobre la fase 19, pendiente de revisión): carrusel de cuentos, decisiones en tarjetas ilustradas, voz elegible (`src/lib/voices.ts`), índice en la guía. Plan de historias ramificadas (sin implementar): [PHASE_21_BRANCHING_PLAN.md](docs/product/PHASE_21_BRANCHING_PLAN.md). URL de Instagram vacía a propósito en `src/content/community.ts`.
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
- En la rama de la fase 19, `tests/browser/journeys.mjs` recorre el camino del niño y el del adulto en cinco tamaños (incluidos 640×512 y 320×256) y con letra muy grande.
- Al añadir texto infantil, releer `docs/CONTENT_STANDARD.md` §2 (lenguaje) y §4 (decisiones).
- Rama actual: `integration/phase-13` (ver el aviso de arriba). Históricamente Claude trabajó en `feat/claude-foundation` y después en `feat/claude-experience`; esas ramas ya están integradas y no deben usarse como base. No hacer merge a `main` sin autorización.
- Pruebas de navegador: Playwright y axe-core se instalan **fuera** del proyecto; instrucciones en `docs/HANDOFF_PHASE_7.md`. En la nube, Chromium ya está en `/opt/pw-browsers/chromium`.
- En `integration/phase-13`, `tests/browser/art-batch-5.mjs` escribe en `docs/art-batch-5/` (evidencias versionadas de Codex): tras ejecutarla, restaurar solo esos archivos (`git checkout -- docs/art-batch-5/previews docs/art-batch-5/browser-results.json`). Desde el rediseño de Codex (fase 17) escribe en `NUBI_ART_EVIDENCE` o en `/tmp`.

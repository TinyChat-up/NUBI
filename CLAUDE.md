# CLAUDE.md

Las reglas del repositorio están en **[AGENTS.md](AGENTS.md)** y se aplican íntegramente. Este archivo solo añade notas prácticas para Claude Code.

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
- Rama: `feat/claude-foundation`. No hacer merge a `main` sin autorización.

# NUBI

**Un mundo de historias por descubrir.**

Plataforma web de historias interactivas para niños y niñas de 6 a 12 años, especialmente pensada para alumnado autista y abierta a cualquier niño o niña. Cuentos ilustrados, cómics que se descubren viñeta a viñeta y escenas en las que se eligen actuaciones y se exploran sus consecuencias, sin respuestas "buenas" o "malas".

La aplicación **no usa inteligencia artificial**: no hay modelos de lenguaje, chatbots ni contenido generado automáticamente. Todo el contenido está escrito y revisado por personas.

## Estado

Primera versión funcional (`v0.1.0`, rama `feat/claude-foundation`):

- Episodio piloto completo: **«Una mañana diferente»** (7 escenas, cuento + cómic; vídeo pendiente de producción).
- Todas las pantallas: portada, Mi mundo, historias, reproductor, cómic, recreaciones, herramientas, emociones, espacio familiar y ajustes.
- Ilustraciones **provisionales** (placeholders vectoriales). Las definitivas se encargan en [`docs/ASSET_REQUESTS.md`](docs/ASSET_REQUESTS.md).
- Contenido **pendiente de validación pedagógica** (ver [`docs/PEDAGOGICAL_FOUNDATIONS.md`](docs/PEDAGOGICAL_FOUNDATIONS.md)).
- Sin backend, sin cuentas, sin pagos. El progreso de prueba se guarda solo en el navegador y se puede borrar desde el Espacio familiar.

## Empezar

Requisitos: Node ≥ 22.18.

```bash
npm install
npm run dev          # servidor de desarrollo
npm run check        # tipos + tests + build (ejecutar antes de cada commit)
npm run assets:doc   # regenera docs/ASSET_REQUESTS.md desde el registro de recursos
```

| Script | Qué hace |
|---|---|
| `dev` | Vite en modo desarrollo |
| `build` | `tsc -b` + build de producción en `dist/` |
| `typecheck` | Comprobación de tipos |
| `test` | Vitest: motor de historias + validación estructural de todas las historias |
| `preview` | Sirve `dist/` localmente |

## Despliegue

Preparado para Vercel (`vercel.json`): framework Vite, salida `dist/`, reescritura de rutas a `index.html` y cabeceras de seguridad básicas. No requiere variables de entorno.

## Mapa del repositorio

```
src/
  engine/        Lógica pura: esquema de datos, motor (reducer), validador
  content/       Contenido: historias, herramientas, emociones, lugares, personajes, referencias, registro de recursos
  components/    Interfaz reutilizable: reproductor, cómic, vídeo, placeholders, iconos, UI
  screens/       Pantallas (una por ruta)
  state/         Preferencias y progreso local
  lib/           Router mínimo, almacenamiento seguro, narración
public/media/    Recursos definitivos (ilustraciones, audio, vídeo, subtítulos)
scripts/         Generador de ASSET_REQUESTS.md
docs/            Documentación del proyecto
```

## Documentación

| Documento | Para qué |
|---|---|
| [`AGENTS.md`](AGENTS.md) | Reglas compartidas para Claude y Codex |
| [`docs/PROJECT_BRIEF.md`](docs/PROJECT_BRIEF.md) | Visión, público, principios y alcance |
| [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) | Arquitectura, motor de historias y decisiones técnicas |
| [`docs/CONTENT_STANDARD.md`](docs/CONTENT_STANDARD.md) | Cómo escribir y añadir una historia |
| [`docs/PEDAGOGICAL_FOUNDATIONS.md`](docs/PEDAGOGICAL_FOUNDATIONS.md) | Fundamentos verificados vs. propuestas propias |
| [`docs/VISUAL_GUIDE.md`](docs/VISUAL_GUIDE.md) | Identidad visual, accesibilidad y movimiento |
| [`docs/ASSET_REQUESTS.md`](docs/ASSET_REQUESTS.md) | Encargo de ilustraciones (generado) |

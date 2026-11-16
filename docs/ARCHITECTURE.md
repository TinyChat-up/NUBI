# Arquitectura

## 1. Visión general

SPA estática (React 19 + Vite + TypeScript + Tailwind CSS 4) sin backend. Tres capas con dependencias en un solo sentido:

```
 src/content  ──(datos tipados)──▶  src/engine  ──(estado puro)──▶  src/components + src/screens
 historias, herramientas,           types.ts (esquema)              reproductor, cómic, vídeo,
 emociones, assets…                 storyEngine.ts (reducer)        pantallas
                                    validate.ts
```

- **Contenido** no conoce React. Son objetos que cumplen `engine/types.ts`.
- **Lógica** no conoce React ni el DOM. Se prueba con Vitest en Node.
- **Interfaz** solo interpreta datos y despacha acciones al motor.

## 2. Modelo de datos (`src/engine/types.ts`)

Una `Story` contiene: id, título, objetivos (etiquetados por bloque de competencia), edades, duración, formatos, cubierta, reparto, **escenas**, estrategias, recreaciones, vídeo, guía familiar, referencias pedagógicas y estado de validación.

Cada `Scene` tiene una lista de **pasos** (`steps`) y, opcionalmente, **viñetas de cómic** (`comic`).

| Tipo de paso | Propósito | Respuesta guardada |
|---|---|---|
| `beat` | Página narrativa (texto + versión corta + ilustración + narración opcional) | — |
| `feelings` | "¿Cómo te sentirías?" multiselección + intensidad opcional | ids de opciones; `<id>:intensidad` |
| `know-need` | Lo que sabemos / lo que me gustaría saber | ids de preguntas |
| `choice` | Varias posibilidades de actuación, cada una con su consecuencia | opción actual + opciones exploradas |
| `consequence` | Muestra la consecuencia de la opción elegida en un `choice`; define **rutas** | — |
| `strategies` | "¿Qué herramientas podrían ayudarte?" | ids de herramientas |
| `summary` | Resumen personal: lee respuestas de otros pasos | — |

Añadir un tipo de paso = ampliar la unión `Step`, el validador, `speechFor` y el `switch` del reproductor.

## 3. Motor (`src/engine/storyEngine.ts`)

`runReducer(story, state, action)` es una función pura.

- **Estado (`RunState`)**: posición `{sceneId, stepIndex}`, pila `history` (para *Atrás*), `responses`, `choices`, `explored`, escenas visitadas.
- **Acciones**: `next`, `prev`, `goto`, `restartScene`, `respond`, `choose`, `restart`.
- **Formatos**: `getPlaySteps(scene, format)` deriva la secuencia de pasos. En **cómic**, cada viñeta es un paso (se descubren una a una) y después vienen los pasos interactivos de la escena; así cuento y cómic comparten interacciones y resumen.
- **Rutas**: un `choice` lleva a su escena `next` (consecuencias). Un `consequence` ofrece rutas (`Probar otra posibilidad` → vuelve al `choice`; `Seguir` → escena siguiente). La escena siguiente por defecto es la del orden del array salvo que `scene.next` diga otra.
- **Sin bloqueos**: solo el paso `choice` exige elegir para avanzar (no hay tiempo límite). Cualquier escena es accesible desde el mapa de escenas.
- **Final**: `isAtEnd` = paso `summary` de la última escena.

`validate.ts` comprueba referencias (escenas, pasos, assets, personajes, herramientas), mínimo de opciones, presencia de "No lo sé", viñetas de cómic si el formato está declarado y resumen final. Los tests ejecutan la validación sobre **todas** las historias registradas y recorren el piloto completo en ambos formatos.

## 4. Interfaz

- **Router**: `src/lib/router.tsx`, ~80 líneas sobre History API (`useSyncExternalStore`). Rutas declaradas en `App.tsx` con `exists()` para mostrar "Este camino no existe" ante IDs inválidos. Al cambiar de ruta, el foco va al `h1`.
- **Reproductor** (`components/player/StoryPlayer.tsx`): barra superior (volver, título, progreso, mapa de escenas), escenario desplazable y controles (Atrás, Repetir, Leer/Escuchar, Subtítulos, Animaciones, Siguiente). Flechas ← → del teclado. Región `aria-live` con el texto de cada paso.
- **Recreaciones** reutilizan `ChoiceGrid` y `ConsequenceBody` fuera del reproductor.
- **Vídeo** (`components/video/VideoPlayer.tsx`): `<video>` + `<track kind="captions">`, controles grandes propios, capítulos por escena, velocidad lenta, sin autoplay. Si `video.status !== 'listo'` o falla la carga, muestra "Vídeo en producción" con alternativas.
- **Ilustraciones** (`components/Illustration.tsx`): si el asset está `listo`, `<img>` con `alt`; si no (o si falla), placeholder SVG generado de sus metadatos (`motif`, `figures`, `icon`).

## 5. Estado y persistencia

- `state/settings.tsx`: preferencias de lectura/sonido/movimiento → atributos `data-*` en `<html>` que el CSS interpreta.
- `state/progress.tsx`: progreso de prueba (historias, escenas visitadas, opciones exploradas, herramientas probadas/elegidas, recreaciones) y partidas guardadas por historia y formato (para "Continuar donde lo dejaste").
- `lib/storage.ts`: acceso a `localStorage` con `try/catch` (la app funciona sin almacenamiento) y prefijo versionado `nubi.v1.`. "Reiniciar el progreso" borra todo salvo los ajustes.

## 6. Audio y narración

1. Si un `beat` tiene `narration` (ruta a audio), se reproduce ese archivo.
2. Si no, y la familia mantiene activada "voz del dispositivo", se usa una voz española declarada local (`localService`) mediante `window.speechSynthesis` (síntesis local del sistema operativo).
3. Si no hay voz disponible, se avisa y se ofrece leer.

Cada apertura comienza en lectura; una preferencia antigua de Escuchar no activa audio. Solo suena en modo **Escuchar** (elegido por el niño o la niña en esa apertura) o al pulsar un botón de escuchar. Si no hay voz local española, o falla la reproducción, el reproductor ofrece texto aunque los subtítulos estén desactivados. **Decisión a revisar por producto:** la síntesis del sistema no es IA generativa ni servicio externo, pero en algunos dispositivos usa voces "neurales" del SO. Si se quiere excluir cualquier síntesis, basta con poner `deviceVoice: false` por defecto en `DEFAULT_SETTINGS`.

## 7. Accesibilidad (resumen técnico)

Foco visible de doble anillo; objetivos ≥ 48 px; `aria-pressed`/`aria-current`; `<dialog>` nativo para el mapa de escenas y la tarjeta (Esc + foco atrapado); `prefers-reduced-motion` + ajuste propio + botón "detener animaciones" (`.anim-paused`); tamaño de texto por `rem`; espaciado amplio; fuente Atkinson Hyperlegible; mayúsculas; texto corto; contraste alto; enlace "Saltar al contenido". Ver `docs/VISUAL_GUIDE.md`.

## 8. Dependencias

| Paquete | Motivo |
|---|---|
| `react`, `react-dom` | UI |
| `@fontsource-variable/nunito`, `@fontsource/atkinson-hyperlegible` | Fuentes autoalojadas (sin peticiones a Google: privacidad de menores) |
| `vite`, `@vitejs/plugin-react`, `typescript` | Build |
| `tailwindcss`, `@tailwindcss/vite` | Estilos |
| `vitest` | Tests del motor y del contenido |

Se evitaron deliberadamente: router (15 rutas no lo justifican), librería de animación (CSS basta), librería de iconos (set propio de ~50 iconos), gestor de estado.

## 9. Decisiones registradas

| Decisión | Alternativa descartada | Motivo |
|---|---|---|
| Contenido en TypeScript, no JSON/CMS | JSON + esquema | Tipado estricto y autocompletado al escribir historias; migrable a CMS más adelante |
| Cómic derivado de la misma escena | Historia separada para cómic | Una sola fuente de interacciones y respuestas |
| Placeholders generados desde metadatos | Imágenes grises | La experiencia se puede probar con niños antes de tener arte final, y los metadatos son el propio encargo |
| `ASSET_REQUESTS.md` generado | Documento a mano | Imposible que diverja del código |
| Router propio | react-router | Menos dependencias |
| Puerta de adultos con número escrito | PIN | No requiere configuración; en demo no protege datos sensibles |

## 10. Cómo crecer

- **Nueva historia:** `docs/CONTENT_STANDARD.md` §6.
- **Idiomas:** extraer los textos de UI a un diccionario y duplicar `story.ts` por idioma (los IDs se mantienen).
- **Backend/cuentas (futuro):** `ProgressProvider` es la única pieza que habría que sustituir; revisar antes RGPD y normativa de protección de menores.

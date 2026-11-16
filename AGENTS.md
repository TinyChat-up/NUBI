# AGENTS.md — Reglas compartidas del repositorio

Este archivo rige el trabajo de **todos los agentes** (Claude Code, Codex) y de las personas que colaboren. Si una instrucción puntual contradice estas reglas, pregunta antes de actuar.

## 1. Producto: líneas rojas

1. **Sin IA en la app.** No integrar modelos de lenguaje, chatbots, generación automática de texto/imagen/voz en servidor ni servicios de IA. (La voz del sistema del navegador, `speechSynthesis`, es un recurso de accesibilidad local, opcional y desactivable; ver `docs/ARCHITECTURE.md` §6.)
2. **Sin datos personales de menores.** No hay cuentas, analítica, cookies de terceros ni envío de datos. Solo `localStorage` con prefijo `nubi.v1.` para preferencias y progreso de prueba, siempre con opción de borrado.
3. **Sin evaluación.** Nada de puntuaciones, rachas, rankings, "aciertos/fallos", perfiles psicológicos ni diagnósticos. Se puede mostrar *qué se ha explorado*, nunca *qué tal lo ha hecho*.
4. **Sin presión.** Ningún temporizador obligatorio, ningún sonido o reproducción automática sin acción del niño o la niña, ninguna animación imprescindible para entender.
5. **Neurodiversidad.** Todas las formas de comunicación valen; pedir ayuda es normal; no exigir contacto visual; no penalizar autorregulación inocua; no enseñar a ocultar emociones; ofrecer varias opciones válidas.
6. **Originalidad.** No copiar personajes, textos, ilustraciones ni materiales de terceros (incluidos los marcos de `docs/PEDAGOGICAL_FOUNDATIONS.md`). No usar marcas registradas (p. ej. "Social Stories™", "Zones of Regulation®") para describir nuestro contenido.
7. **Honestidad.** Un placeholder se presenta como provisional; un vídeo no producido se indica como "en producción". No presentar contenido no validado como validado.

## 2. Arquitectura: separación estricta

| Capa | Carpeta | Puede importar |
|---|---|---|
| Lógica | `src/engine/` | nada de React ni DOM |
| Contenido | `src/content/` | solo tipos de `engine/types.ts` y otros datos |
| Interfaz | `src/components/`, `src/screens/` | todo lo anterior |

- **Nada de texto de historias en componentes.** Si una pantalla necesita una frase específica de una historia, va en los datos.
- **Nada de lógica por ID** (`if (story.id === ...)`) en la interfaz. Si hace falta, se amplía el esquema.
- Una historia nueva no debe requerir componentes nuevos. Si los requiere, primero se propone un nuevo tipo de paso en `engine/types.ts`.
- Los imports usan extensión `.ts/.tsx` (lo exige la ejecución nativa de TS del script de assets).

## 3. Contenido y recursos

- Seguir `docs/CONTENT_STANDARD.md` para cualquier texto infantil.
- Toda imagen se registra en el registro de assets (`src/content/assets/` o `src/content/stories/<id>/assets.ts`) con texto alternativo. Después: `npm run assets:doc`.
- `docs/ASSET_REQUESTS.md` es **generado**: no editar a mano.
- Al entregar un recurso definitivo: copiarlo a `public/<ruta>` y cambiar `status: 'listo'`.

## 4. Accesibilidad mínima en cada cambio de UI

- Objetivos táctiles ≥ 48 px (preferible 56 px).
- Navegable con teclado y foco visible (no eliminar `:focus-visible`).
- Botones con texto visible o `aria-label`; estados con `aria-pressed` / `aria-current`.
- Respetar `prefers-reduced-motion` y el ajuste "Sin animaciones".
- Probar en 390 px (móvil), 820 px (tableta vertical) y 1180 px (tableta horizontal).

## 5. Calidad

- Antes de cada commit: `npm run check` (tipos + tests + build) en verde.
- Los tests de `src/engine/storyEngine.test.ts` validan **todas** las historias registradas: no desactivarlos para "hacer pasar" contenido.
- Sin dependencias nuevas sin justificarlo en `docs/ARCHITECTURE.md` (§8).

## 6. Git

- Rama de trabajo de Claude: `feat/claude-foundation`. Codex trabaja en ramas propias (`feat/codex-*` o `review/codex-*`).
- **Nunca** hacer merge a `main` sin autorización explícita de la persona responsable.
- Commits pequeños y descriptivos (`feat:`, `fix:`, `docs:`, `content:`, `chore:`).
- No modificar archivos ajenos al proyecto ni configuraciones globales.

## 7. Revisión cruzada (Claude ↔ Codex)

Al revisar trabajo del otro agente, priorizar en este orden:
1. Incumplimientos de §1 (líneas rojas).
2. Errores del motor o historias que no se pueden completar.
3. Accesibilidad.
4. Fidelidad al estándar de contenido.
5. Estilo y simplificación.

Dejar las propuestas de cambio pedagógico como comentario o issue: **los cambios de contenido educativo los aprueba una persona**.

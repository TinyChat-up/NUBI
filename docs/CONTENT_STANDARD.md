# Estándar de contenido

Cómo se escriben las historias de NUBI. Se aplica a todo texto que lea un niño o una niña.

## 1. Estructura recomendada de una historia

Basada en el piloto «Una mañana diferente». Se puede adaptar, pero cada historia debe recorrer **conciencia → comprensión → posibilidades → regulación → cierre**.

| # | Escena | Tipo de pasos | Pregunta que responde |
|---|---|---|---|
| 1 | Situación conocida | `beat` | ¿Qué es lo habitual? ¿Qué apoyos tiene el personaje? |
| 2 | Algo cambia / ocurre | `beat` + `feelings` | ¿Qué pasa? ¿Cómo lo vive cada personaje? ¿Y tú? |
| 3 | Comprender | `beat` + `know-need` | ¿Qué sabemos? ¿Qué necesito saber? |
| 4 | Posibilidades | `beat` + `choice` | ¿Qué se podría hacer? |
| 5 | Consecuencias | `consequence` | ¿Qué puede pasar con cada opción? |
| 6 | Estrategias | `beat` + `strategies` | ¿Qué ayudó a cada personaje? ¿Qué te ayudaría a ti? |
| 7 | Cierre | `beat` + `summary` | ¿Cómo terminó? ¿Qué me llevo? |

Duración orientativa: 10-15 minutos. Entre 3 y 6 `beat` por escena narrativa.

## 2. Lenguaje

- **Frases cortas**: una idea por frase; máximo ~15 palabras en `text`, ~8 en `short`.
- **Concreto y literal**: evitar metáforas, ironía, frases hechas y dobles sentidos ("se le cayó el mundo encima" ✗ → "se sorprendió mucho" ✓).
- **Narrador descriptivo**: describe lo que pasa, lo que alguien dice y lo que puede sentir. No ordena ni moraliza ("Teo debe…" ✗).
- **Probabilidad, no certeza** al hablar de emociones y consecuencias: "puede", "a veces", "quizá" ("Andrés se enfadará" ✗ → "Andrés se preocupa" / "puede preocuparse" ✓).
- **Segunda persona solo para invitar**, nunca para exigir: "¿Cómo te sentirías?", "Puedes elegir varias".
- **Lenguaje inclusivo sin sobrecargar**: "niño o niña" cuando haga falta; preferir formas neutras ("todo el mundo", "cada persona").
- **Diálogos** entre «comillas latinas», con el hablante indicado en `speaker`.
- `short` siempre que `text` tenga más de una frase.

## 3. Respeto a la neurodiversidad (obligatorio)

- Mostrar **reacciones diversas** al mismo hecho; ninguna es "la normal".
- La **autorregulación inocua** (mover las manos, balancearse, usar cascos, mirar a otro lado) aparece con naturalidad y nadie la corrige.
- **Comunicación aumentativa** (pictogramas, gestos, escritura) presentada como igual de válida que hablar.
- **No exigir contacto visual** ni presentarlo como lo correcto.
- **No enseñar a ocultar o "controlar" emociones**: se trata de reconocerlas y de encontrar qué ayuda.
- **Pedir ayuda y pedir tiempo** se presentan como competencias, no como fallos.
- Los **adultos** de las historias son respetuosos y responden a las necesidades.

## 4. Decisiones y consecuencias

- **Mínimo 3, recomendado 5-6 opciones.** La mayoría deben ser adecuadas para alguien.
- Se puede incluir **una opción frecuente con más inconvenientes** (p. ej. "salir sin avisar"), tratada **sin culpa**:
  - validar la necesidad que hay detrás ("Necesitar salir es válido"),
  - explicar el efecto en otras personas sin dramatizar,
  - ofrecer `anotherWay`: otra forma de conseguir **lo mismo**.
- Nunca: opciones absurdas, violentas, humillantes o pensadas para "pillar".
- Prohibido etiquetar opciones como correcta/incorrecta, buena/mala, esperada/inesperada. Sin colores rojo/verde de acierto.
- Cada consecuencia rellena: `story` (1-3 viñetas), `youMayFeel`, `othersMay`, `helpsWhen`, `keepInMind`, `tools`.
- Siempre se puede **volver a explorar** otra opción.

## 5. Pasos interactivos

- `feelings`: al menos 6 opciones, siempre "No lo sé" (`id: 'no-lo-se'`) y "Otra cosa". Intensidad opcional.
- `know-need`: incluir una opción del tipo "Ahora no necesito saber nada más".
- `strategies`: recordar en `help` que se pueden elegir varias o ninguna.
- `summary`: devuelve las respuestas del niño o la niña. Cierre con una frase en primera persona, en positivo y sin obligaciones.

## 6. Añadir una historia nueva (checklist)

1. Crear `src/content/stories/<id>/story.ts` (exporta un `Story`) y `assets.ts` (exporta `AssetSpec[]`).
2. Registrar los assets en `src/content/assets/index.ts` (nuevo grupo).
3. Añadir la historia a `storyList` en `src/content/stories/index.ts`.
4. Si hay personajes nuevos, añadirlos a `src/content/characters.ts` (con descripción visual).
5. Rellenar `familyGuide`, `references` (marcando `fundamento` o `propuesta`) y `validation`.
6. `npm run check` → el validador indica referencias rotas.
7. `npm run assets:doc` para actualizar el encargo de ilustraciones.
8. Recorrer la historia completa en cuento y cómic, en móvil y tableta.

No se necesita tocar ningún componente.

## 7. Guía familiar

- Tono cercano y sin tecnicismos.
- Incluir siempre: antes/durante/después, práctica cotidiana (vinculada a herramientas), señales para parar y notas de respeto.
- Nunca proponer recompensas por "portarse bien", castigos ni extinción de conductas de autorregulación.
- No hacer afirmaciones clínicas ni prometer resultados.

## 8. Validación

Toda historia empieza en `validation.status: 'borrador'` o `'pendiente-validacion'`. Solo una persona responsable puede pasarla a `'validado'` tras revisión por: profesional de educación especial, al menos una persona autista adulta y familias.

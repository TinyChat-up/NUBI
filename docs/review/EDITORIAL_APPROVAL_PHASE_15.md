# Aprobación editorial · fase 15

17/11/2026 · Rama `feat/claude-pilot-remediation`. **Ninguna de estas propuestas está aplicada.** `src/content/stories/una-manana-diferente/story.ts` no se ha modificado. El estado de validación sigue en `pendiente-validacion`.

Este documento es para la persona responsable pedagógica. Cada propuesta tiene un parche exacto, aplicable por separado, y su comprobación de coherencia. Las decisiones correspondientes están en `DECISION_REGISTER.md` (fase 14).

## Cómo aprobar y aplicar

Por cada propuesta aprobada (desde la raíz del repositorio, en una rama de trabajo):

```bash
git apply docs/review/phase-15/D-05-lia-lectura-facil.patch
```

```bash
npm run check
```

Después:

1. Ejecutar las pruebas de navegador `quality`, `short-text`, `art-batch-3` y `story-fit`. Leen los textos de `story.ts`, así que no hay que tocarlas.
2. Anotar en `DECISION_REGISTER.md` la fecha, el rol de quien decide y la opción elegida.
3. Hacer un commit con el mensaje `content: …`.

Si se aprueba con cambios, editar la línea correspondiente de `story.ts` en lugar de aplicar el parche.

**Comprobación realizada en esta fase.** Se aplicaron los tres parches a la vez sobre una copia de trabajo y se obtuvo:

- `git apply --check` limpio para los tres parches.
- Validador de historias y **87 tests** correctos.
- `scripts/content-report.ts`: sin frases largas en las partes modificadas.

Después se restauró `story.ts`, con el hash idéntico al original.

---

## E-1 · Lectura fácil de la escena 2: comunicación de Lía (D-05, P-02, C-03)

Parche: [`phase-15/D-05-lia-lectura-facil.patch`](phase-15/D-05-lia-lectura-facil.patch).

```diff
           id: 'cambio-4',
           text: 'Cada persona reacciona a su manera. Aya pregunta: «¿Y qué haremos allí?». Bruno protesta: «¡Pero yo quería plástica!». Lía busca en su comunicador el pictograma «no sé».',
-          short: 'Aya tiene curiosidad. Bruno se enfada un poco. Lía no está segura.',
+          short: 'Aya pregunta. Bruno protesta. Lía usa su comunicador.',
```

| Comprobación | Actual | Propuesta |
|---|---|---|
| Aya + «pregunta» (hecho del texto completo) | No (atribuye «curiosidad») | Sí |
| Bruno + «protesta» | No (atribuye «se enfada») | Sí |
| Lía + comunicador (CAA) | **No: desaparece** | **Sí** |
| Palabras de emoción atribuidas | 3 | 0 |
| Palabras (estándar: unas 8) | 12 | 8 |

**Variante, si se quiere conservar qué dice Lía:** «Aya pregunta. Bruno protesta. Lía usa su comunicador: "no sé".» (10 palabras).

Revisar con: profesional y persona autista adulta (representación de la CAA).

## E-2 · Frase del horario (D-02)

Parche: [`phase-15/D-02-horario.patch`](phase-15/D-02-horario.patch).

```diff
-  { illustration: 'ume-c-horario', text: 'Andrés dibuja el plan en la pizarra: biblioteca, recreo, lengua, comida y plástica. Teo lo mira entero, de arriba abajo.' },
+  { illustration: 'ume-c-horario', text: 'Andrés dibuja el plan en la pizarra: biblioteca, recreo, lengua, comida y plástica. Teo lo mira entero, de principio a fin.' },
```

**Coherencia:** el horario está dibujado en horizontal en `ume-c-horario`, `ume-s6-plan` y `ume-k6-1`. «De principio a fin» describe el recorrido del plan sin depender de su orientación y conserva «entero» (lo ve completo). No cambia ningún hecho.

**Alternativa del encargo:** «Teo lo mira de principio a fin.»

## E-3 · «Salir de clase sin avisar»: claridad, lenguaje inclusivo y ausencia de culpa (D-07, P-11, P-15)

Parche: [`phase-15/D-07-salir-sin-avisar.patch`](phase-15/D-07-salir-sin-avisar.patch). Cambia tres campos de la consecuencia `salir`; el resto queda igual.

```diff
-                othersMay: 'Los adultos se preocupan cuando no saben dónde está un niño o una niña. Su trabajo es que estés seguro.',
+                othersMay: 'Los adultos se preocupan cuando no saben dónde está un niño o una niña. Su trabajo es que estés a salvo.',
-                keepInMind: 'Salir sin avisar puede hacer que los demás se preocupen, y que te pidan explicaciones cuando aún no estás preparado.',
+                keepInMind: 'Si sales sin avisar, los demás pueden preocuparse y buscarte. Quizá te pregunten qué pasó antes de que estés preparado o preparada.',
-                  'Puedes conseguir lo mismo avisando: enseña tu tarjeta de descanso, di «necesito salir» o usa una señal acordada. Así tienes tu momento tranquilo y los adultos saben que estás bien.',
+                  'Puedes conseguir lo mismo avisando. Puedes enseñar tu tarjeta de descanso, decir «necesito salir» o usar una señal acordada. Así tienes tu momento tranquilo y los adultos saben que estás bien.',
```

| Criterio | Actual | Propuesta |
|---|---|---|
| Lenguaje inclusivo al dirigirse al lector | «preparado», «seguro» (masculino genérico) | «preparado o preparada», «a salvo» |
| Longitud (estándar: unas 15 palabras por frase) | `keepInMind` 20; `anotherWay` 18 | 10 + 12; 5 + 14 + 12 |
| Segunda persona solo para invitar (`CONTENT_STANDARD` §2) | Imperativos: «enseña», «di», «usa» | «Puedes enseñar…, decir… o usar…» |
| Tono | «que te pidan explicaciones» (puede leerse como reproche) | «Quizá te pregunten qué pasó» |
| Consecuencia posible, no inevitable | «puede hacer que» | «pueden preocuparse», «Quizá» |
| Se mantiene | Validación de la necesidad (`helpsWhen`), efecto en otros sin dramatizar, alternativa que consigue lo mismo, herramientas | Igual |

**Sin cambio propuesto en:** `story` (los dos momentos), `youMayFeel` y `helpsWhen` («Necesitar salir es válido…»).

**Pendiente de criterio humano:** si la alternativa debe recordar que la señal se acuerda antes con el colegio (P-11.3). Se propone hacerlo en la guía familiar (D-11), no en el texto infantil.

Revisar con: persona autista adulta y profesional (prioritario).

**No se ha alterado** la viñeta del comunicador (k2-4) ni su bocadillo (D-08 sigue pendiente).

---

## E-4 · Inventario de textos que necesitan versión corta (C-02)

La infraestructura ya admite versiones cortas en las consecuencias (`Consequence.short`; ver `PHASE_15_REMEDIATION_REPORT.md` §2). **No se ha escrito ninguna.** Las cifras son palabras contadas (`node scripts/content-report.ts` y el inventario de esta fase); no miden comprensión.

### Prioridad 1 · Consecuencias (37 textos, 603 palabras)

Es el texto más denso del episodio y el que hoy no cambia con «Textos cortos».

| Posibilidad | Campos | Palabras por campo (momento 1 · momento 2 · youMayFeel · othersMay · helpsWhen · keepInMind · anotherWay) | Total |
|---|---|---|---|
| Preguntar qué va a pasar | 6 | 14 · 15 · 20 · 18 · 13 · 21 | 101 |
| Pedir que le expliquen el horario | 6 | 14 · 20 · 16 · 23 · 11 · 14 | 98 |
| Buscar a un adulto de confianza | 6 | 14 · 18 · 8 · 18 · 14 · 16 | 88 |
| Usar un recurso para estar más tranquilo | 6 | 17 · 19 · 14 · 16 · 9 · 18 | 93 |
| Decir que necesita tiempo | 6 | 21 · 18 · 7 · 15 · 9 · 23 | 93 |
| Salir de clase sin avisar | 7 | 14 · 16 · 15 · 20 · 15 · 20 · 30 | 130 |

**Dónde se escriben** (estructura; los textos son de la persona responsable):

```ts
consequence: {
  // … textos completos actuales …
  short: {
    story: ['<momento 1 corto>', '<momento 2 corto>'], // una posición vacía usa el texto completo
    youMayFeel: '<…>',
    othersMay: '<…>',
    helpsWhen: '<…>',
    keepInMind: '<…>',
    anotherWay: '<…>',                                  // solo si existe anotherWay
  },
},
```

**Criterios para escribirlas** (`CONTENT_STANDARD.md` §2–§4):

- Una idea por frase y unas 8 palabras.
- Los mismos hechos, personajes y formas de comunicación (la CAA nunca desaparece).
- Probabilidad, no certeza («puede», «quizá»).
- No añadir emociones que el texto completo no nombre.
- Sin metáforas.
- Segunda persona solo para invitar.
- En «Salir sin avisar», conservar la validación de la necesidad y la alternativa.

El validador rechaza versiones cortas vacías o de momentos que no existen.

### Prioridad 2 · Páginas del cuento sin versión corta (4)

| Página | Palabras | Texto actual |
|---|---|---|
| `cambio-6` (Nubi) | 16 | No hay una forma correcta de sentir un cambio. Cada persona lo vive a su manera. |
| `posibilidades-1` | 11 | Teo tiene muchas preguntas en la cabeza. ¿Qué podría hacer ahora? |
| `estrategias-4` (Nubi) | 18 | Lo que ayuda a una persona puede no ayudar a otra. Por eso está bien tener varias herramientas. |
| `cierre-3` (Nubi) | 20 | Los cambios pueden sorprender. Pero hay cosas que puedes hacer: preguntar, pedir ayuda, usar tus apoyos o tomarte tu tiempo. |

Ya funcionan con el campo `short` existente; no requieren cambios de código.

### Prioridad 3 · Versiones cortas existentes que superan las 8 palabras (revisión opcional)

- `cambio-4` (12): resuelto en E-1.
- `estrategias-3` (15): «Aya preguntó. Bruno dijo que no le gustaba el cambio. Lía pidió sentarse con Teo.» Conserva la CAA de forma implícita («pidió»). Valorar «Lía pidió con su comunicador sentarse con Teo».
- `llegada-4` (11) y `cambio-3` (11).
- `llegada-1`, `llegada-3`, `saber-2`, `estrategias-1` y `cierre-2` (9 cada una).

### Fuera de esta infraestructura (decidir si hace falta)

- **Preguntas y ayudas de los pasos interactivos.** Ya son breves (4–14 palabras). La más larga es la ayuda de la decisión: «Hay varias posibilidades. Elige una para ver qué puede pasar. Después puedes probar otras.» (14 palabras en 3 frases). Si se decide acortar, haría falta un campo `helpShort` en los pasos interactivos (cambio de esquema pequeño).
- **Cómic.** Los bocadillos son lo que dicen los personajes; se propone **no acortarlos**. Las leyendas (5) podrían tener versión corta con un campo nuevo en `ComicPanel`.
- **Mis herramientas y Mis emociones.** Están fuera del reproductor; requerirían versión corta en `tools.ts` y `emotions.ts` (fase posterior).
- **Resumen.** Los títulos y la frase final son breves (2–12 palabras); sin necesidad aparente.

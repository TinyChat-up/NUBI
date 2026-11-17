# Revisión pedagógica documental · «Una mañana diferente»

17/11/2026 · Rama `review/phase-14-pilot-readiness` (base `integration/phase-13`, `779f554`).

**Alcance y límites.** Es un análisis documental del texto y del comportamiento del producto, contrastado con `CONTENT_STANDARD.md` y `PEDAGOGICAL_FOUNDATIONS.md`. **No sustituye** la revisión por profesionales de PT, AL u orientación, por personas autistas adultas ni por familias, y tampoco la prueba con niños y niñas. No se ha modificado ningún texto.

Cada observación distingue:

- **HECHO**: comprobado en el código o el contenido.
- **HIPÓTESIS**: efecto posible, que solo una prueba con personas puede confirmar o descartar.
- **PROPUESTA**: redacción o cambio sugerido; requiere aprobación humana.

Fuente de todos los textos citados: `src/content/stories/una-manana-diferente/story.ts`, salvo que se indique otra.

---

## 1. Visión general

**HECHO.** El episodio sigue la estructura del estándar: conciencia → comprensión → posibilidades → consecuencias → estrategias → cierre, en 7 escenas.

- **Cuento:** 20 páginas narrativas (382 palabras) y 5 pasos interactivos.
- **Cómic:** 15 viñetas.
- **Validación:** el estado es `pendiente-validacion` y se mantiene.

**HECHO.** No se observan incumplimientos de las líneas rojas de `AGENTS.md` §1:

- No hay puntuaciones, aciertos ni temporizadores.
- No suena nada sin una acción del niño o la niña.
- Las respuestas solo se guardan en `localStorage` (`nubi.v1.`) y se pueden borrar.
- El espacio familiar muestra *qué se ha explorado* (escenas, formatos, número de posibilidades), nunca las emociones elegidas ni una valoración.

### Lo que parece adecuado según el análisis documental

Son hechos del texto; que funcionen con niños y niñas es una hipótesis por validar.

- **Cambio explicado y tranquilizador.** Se dice qué cambia (persona y horario) y por qué, de forma que reduce la incertidumbre: «Carmen hoy no ha podido venir. Está bien y vuelve mañana» (`cambio-2`). Se aclara que la plástica no se quita (dato `k4` de `saber-preguntas`).
- **Reacciones diversas sin jerarquía.** Aya pregunta, Bruno protesta, Lía usa su comunicador y Teo se queda quieto y mueve los dedos (`cambio-4`, `cambio-5`). Nadie corrige a nadie. Nubi lo explicita: «No hay una forma correcta de sentir un cambio» (`cambio-6`).
- **Autorregulación y apoyos como algo normal.** Cascos, tarjeta de descanso, pelota blanda: «Usar tus apoyos es algo normal, como ponerse unas gafas» (consecuencia «regulación»).
- **Comunicación aumentativa con voz propia.** Lía comunica «no sé» y «Quiero sentarme con Teo» con su comunicador, en cuento y cómic. En el cómic el mensaje se muestra por casillas, y el lector de pantalla lo lee como «Lía: QUIERO SENTARME CON TEO».
- **Adultos respetuosos.** Andrés anticipa, dibuja el plan y acepta el tiempo que pide Teo. Pilar acompaña (corregulación).
- **Decisiones sin etiqueta de acierto.** Hay seis opciones, ninguna marcada como correcta, sin colores de acierto. Se pueden explorar todas en cualquier orden, sin límite.
- **Emociones sin diagnóstico.** La actividad es hipotética («Si estuvieras…»), permite elegir varias o ninguna, e incluye «No lo sé», «Otra cosa» y una necesidad («Ganas de saber el plan»).
- **Resumen.** Devuelve las respuestas sin valorarlas («No hay respuestas buenas ni malas: son las tuyas») y cierra en primera persona y en positivo, sin obligación.
- **Guía familiar.** No hay recompensas, castigos ni extinción de conductas. Incluye señales para parar y notas de respeto (sin contacto visual, todas las formas de comunicación valen, moverse es válido).

---

## 2. Observaciones por escena

Formato: **Ruta/escena · Elemento · Problema · Por qué importa · Propuesta · Validación humana**.

### Escena 1 · La llegada

**P-01 · Comprensión del apoyo** — sin observaciones de riesgo. `llegada-4`: «Algunos días los usa y otros no» presenta el apoyo como opcional y no como un déficit. HECHO.

### Escena 2 · Descubrimos un cambio

**P-02 · Versión de lectura fácil de las reacciones**
- **Ruta:** `/historias/una-manana-diferente/cuento?escena=cambio`, página 4, con Ajustes → «Textos cortos: Sí».
- **Elemento:** `cambio-4.short` = «Aya tiene curiosidad. Bruno se enfada un poco. Lía no está segura.»
- **Problema (HECHO):** la versión corta **elimina la comunicación aumentativa de Lía** (el texto completo dice que «busca en su comunicador el pictograma "no sé"»). Además **atribuye emociones** que el texto completo no nombra: Bruno «protesta», no «se enfada»; Lía expresa «no sé».
- **Por qué importa:** la representación de la CAA es un objetivo central del episodio (`references`: neurodiversity-affirming), y quien lee en lectura fácil la pierde en la escena donde se presenta. Atribuir emociones a partir de una conducta va en la dirección contraria a la del propio producto.
- **Propuesta:** «Aya pregunta. Bruno protesta. Lía usa su comunicador.» (8 palabras), o «… Lía señala "no sé" en su comunicador.»
- **Validación:** sí (texto educativo).

**P-03 · Lenguaje figurado en la reacción de Teo**
- **Elemento:** `cambio-5`: «Nota un nudo en la tripa». Se repite en la consecuencia «regulación» («el nudo de la tripa se afloja») y en Mis emociones → Inseguridad («Cosquillas o nudo en la tripa»).
- **Problema (HECHO):** `CONTENT_STANDARD` §2 pide «concreto y literal, evitar metáforas y frases hechas».
- **Por qué importa (HIPÓTESIS):** puede leerse literalmente. También puede ser un vocabulario interoceptivo útil y conocido.
- **Propuesta:** decidir si «nudo en la tripa» se acepta como expresión corporal habitual y documentar la excepción en el estándar, o sustituirla por «nota algo raro en la tripa».
- **Validación:** sí, sobre todo con personas autistas adultas.

**P-04 · Pregunta contrafáctica**
- **Elemento:** `cambio-sentir.prompt`: «Si estuvieras en la clase de Teo, ¿cómo te sentirías?»
- **Problema (HIPÓTESIS):** razonar sobre una situación hipotética puede ser difícil a los 6–7 años y para algunos niños y niñas.
- **Propuesta:** observarlo en la tarea 3 del protocolo; valorar una ayuda alternativa del tipo «Imagina que eres Teo…» o «¿Y a ti, qué te pasa cuando cambia un plan?».
- **Validación:** sí.

**P-05 · Intensidad única para varias respuestas**
- **Elemento:** `FeelingsView` (`src/components/player/interactions.tsx`): una sola pregunta «¿Cuánto? (si quieres)» aparece en cuanto se elige cualquier opción distinta de «No lo sé», incluidas «Otra cosa» y «Ganas de saber el plan».
- **Problema (HECHO):** con dos o más elecciones (p. ej. Sorpresa + Tranquilidad), la intensidad no indica a cuál se refiere, y el resumen muestra una sola «Intensidad: …».
- **Por qué importa (HIPÓTESIS):** ambigüedad para el niño o la niña y para la familia que lee el resumen.
- **Propuesta:** observar en piloto. Si se confirma, decidir entre intensidad por emoción, intensidad solo con una elección, o retirarla (pregunta abierta n.º 3 de los fundamentos).
- **Validación:** sí (cambio de interacción y de esquema).

**P-06 · Coherencia de nombres entre selector y Mis emociones**
- **Elemento:** el selector dice «Nervios o inseguridad» y «Tranquilidad»; Mis emociones usa, con la misma ilustración, «Inseguridad» y «Calma».
- **Problema (HECHO):** son nombres distintos para el mismo Nubi.
- **Por qué importa (HIPÓTESIS):** puede dificultar que se relacionen ambas zonas, o puede enriquecer el vocabulario.
- **Propuesta:** observarlo; si se unifica, hacerlo en los datos.
- **Validación:** sí.

### Escena 3 · ¿Qué sabemos y qué necesitamos saber?

**P-07 · Abstracción para 6–7 años** — HIPÓTESIS ya señalada en `PEDAGOGICAL_FOUNDATIONS.md` (pregunta abierta n.º 1). La lista «Lo que ya sabemos» es concreta (4 frases cortas con icono), pero la distinción saber / necesitar saber es abstracta. Observar en piloto.

**P-08 · Preguntas sin respuesta**
- **Elemento:** las preguntas elegidas en `saber-preguntas` («¿A qué hora es el recreo?», «¿Qué hago si me agobio?»…) aparecen en el resumen («Lo que me gustaría saber»).
- **Problema (HECHO):** la historia no las responde. Algunas se responden de forma indirecta en consecuencias que el niño o la niña puede no visitar. La guía familiar (`afterReading`) no menciona esta sección.
- **Por qué importa (HIPÓTESIS):** para quien necesita anticipación, una pregunta abierta sin respuesta puede generar inquietud.
- **Propuesta:** añadir a la guía familiar «Mirad juntos las preguntas que eligió y respondedlas si podéis».
- **Validación:** sí (texto de la guía).

### Escena 4 · Varias posibilidades

**P-09 · Ninguna opción etiquetada** — HECHO conforme al estándar §4. La ayuda («Elige una para ver qué puede pasar. Después puedes probar otras.») invita a explorar. La única condición para avanzar es elegir, sin límite de tiempo («Tómate el tiempo que necesites»).

**P-10 · «Muchas preguntas en la cabeza»** (`posibilidades-1`, viñeta k4-1) — expresión figurada leve. Misma decisión que P-03.

### Escena 5 · Consecuencias (análisis de las seis)

| Opción | Culpa | Respuesta única | Consecuencia posible, no inevitable | Alternativas | Apoyo sin imponer |
|---|---|---|---|---|---|
| Preguntar | No. Normaliza la vergüenza («Eso también es normal») | No | «Quizá algo de vergüenza»; `keepInMind`: el adulto puede no saberlo | Sí | Sí |
| Pedir el horario | No | No | `youMayFeel` en afirmativo («Alivio…»), bajo el rótulo «Cómo te puedes sentir» | Sí | Sí |
| Adulto de confianza | No | No | Sí | Sí | Sí |
| Usar un recurso | No; «como ponerse unas gafas» | No | `keepInMind`: «puede que aún necesites saber…» | Sí, combinar herramientas | Sí |
| Pedir tiempo | No | No | `keepInMind`: «A veces el grupo tiene que moverse» | Sí, tres alternativas concretas | Sí |
| **Salir sin avisar** | **Bajo riesgo** (ver P-11) | No | «puede hacer que…» | `anotherWay` | Sí |

**P-11 · «Salir sin avisar»**
- **HECHO:**
  - Valida la necesidad: `helpsWhen` dice «Necesitar salir es válido. Querer un sitio tranquilo muestra que conoces lo que te ayuda».
  - Explica el efecto en otras personas sin dramatizar: Andrés «se preocupa y sale a buscarle».
  - Ofrece `anotherWay` para conseguir **lo mismo** avisando.
  - La ilustración no muestra castigo.
  - La opción no está marcada visualmente como peor.
- **Problemas concretos:**
  1. **HECHO:** `keepInMind` tiene 20 palabras (estándar: unas 15) y `anotherWay`, 18.
  2. **HECHO:** se usa el masculino genérico al dirigirse al lector: «cuando aún no estás preparado», «Su trabajo es que estés seguro». En cambio, las herramientas usan «listo o lista» y «preparado o preparada». Ver P-15.
  3. **HIPÓTESIS:** la alternativa («enseña tu tarjeta de descanso… o usa una señal acordada») presupone que el colegio ya conoce y acepta esa señal. Si no es así, la propuesta puede no ser practicable.
  4. **HIPÓTESIS:** «que te pidan explicaciones cuando aún no estás preparado» puede leerse como una amenaza leve.
- **Por qué importa:** es la opción más sensible del episodio (pregunta abierta n.º 2 de los fundamentos).
- **Propuestas:**
  - Dividir `keepInMind` en dos frases e incluir las dos formas («preparado o preparada»).
  - Añadir a la guía familiar una línea que conecte con la práctica `p4` («Mi tarjeta de descanso»): acordar la señal **también con el colegio**.
- **Validación:** sí. Es prioritaria con personas autistas adultas y profesionales.

**P-12 · Respuestas adultas siempre favorables**
- **HECHO:** en las seis consecuencias los adultos responden bien. Las dos únicas fricciones son el matiz de `keepInMind` en «Preguntar» y «Pedir tiempo» y la preocupación de Andrés en «Salir».
- **HIPÓTESIS:** el modelo es deseable y seguro, pero puede crear expectativas que la realidad no cumple.
- **Propuesta:** decidir si basta con los matices actuales o si la guía familiar debe mencionar qué hacer si un adulto no responde así. Ya existe «Si no te entiende, prueba otra forma» en «Pedir ayuda».

**P-13 · Continuidad narrativa tras las decisiones**
- **HECHO:** elija lo que elija el niño o la niña, la escena 6 continúa con un desenlace fijo: «Aquella mañana, Teo pidió ver el plan… se puso los cascos». El tiempo verbal pasa de presente (escenas 1–2) a pasado (escena 6).
- **HIPÓTESIS:** quien explore solo «Salir sin avisar» puede no entender por qué la historia cuenta que Teo pidió el plan, o puede creer que su elección «no valía».
- **Propuesta:** observarlo en la tarea 5. Si se confirma, valorar una frase puente del tipo «Esto es lo que Teo hizo aquella mañana».
- **Validación:** sí.

### Escena 6 · Estrategias

**P-14 · Bruno puede expresar desacuerdo** — HECHO: «Bruno dijo "no me gusta este cambio" y se tomó un rato». Se escucha el desacuerdo sin corregirlo; coherente con «no enseñar a ocultar emociones». `estrategias-3.short` mide 15 palabras (estándar: unas 8).

### Escena 7 · Cierre

Sin observaciones de riesgo. `cierre-3` (16 palabras, sin `short`) y la leyenda de k7-2 (16) superan levemente el estándar.

---

## 3. Lenguaje (transversal)

**HECHO** (`node scripts/content-report.ts`; solo cuenta palabras, no mide comprensión):

- **6 frases de más de 15 palabras**: `adulto/keepInMind` (16), `tiempo/keepInMind` (16), `salir/keepInMind` (20), `salir/anotherWay` (18), `cierre-3` (16) y la leyenda de k7-2 (16).
- **9 versiones `short` de más de 8 palabras.** Las más alejadas son `cambio-4` (12), `estrategias-3` (15), `llegada-4` (11) y `cambio-3` (11).
- **4 páginas de varias frases sin `short`**: `cambio-6`, `posibilidades-1`, `estrategias-4` y `cierre-3`. Las cuatro son reflexiones de Nubi o preguntas.

**P-15 · Masculino genérico dirigido al lector** — HECHO en la consecuencia «Salir» (`keepInMind`, `othersMay`). PROPUESTA: «preparado o preparada», «que estés a salvo». Validación: sí (texto).

**P-16 · Afirmaciones de certeza en herramientas** (`src/content/tools.ts`)
- **HECHO:** el estándar pide «probabilidad, no certeza». Se encuentran:
  - «Saber qué va a pasar **hace que** los cambios sean más pequeños» (Anticipar; además es figurado).
  - «Decir lo que necesitas **ayuda a que** los demás te entiendan» (Comunicar).
  - «Pedir ayuda… **Todo el mundo lo hace**» (Pedir ayuda).
- **PROPUESTA:** «puede hacer que…», «puede ayudar a que…», «Mucha gente lo hace».
- **Validación:** sí.

**P-17 · Imperativos en los pasos de las herramientas**
- **HECHO:** «Busca a una persona de confianza», «Avisa…», «Di qué no te gusta».
- **HIPÓTESIS:** en una secuencia de instrucciones el imperativo suele ser lo más claro, pero el estándar reserva la segunda persona «para invitar, nunca para exigir».
- **PROPUESTA:** decidir y documentar si los pasos procedimentales son una excepción aceptada.

---

## 4. Emociones (`src/content/emotions.ts`, selector del cuento)

**HECHO:**

- Se puede no responder: avanzar no exige elegir.
- «No lo sé» puede coexistir con otras respuestas.
- «Otra cosa» está presente y es útil para lo que no está en la lista.
- La intensidad es opcional y solo aparece si se ha elegido algo.
- No hay interpretación facial ni inferencia: la app nunca atribuye una emoción al niño o la niña.

**HIPÓTESIS:** ver P-04 (contrafáctico), P-05 (intensidad), P-06 (nombres) y la legibilidad de las ilustraciones a 56–64 px (`COGNITIVE_ACCESSIBILITY_REVIEW.md` C-08).

**P-18 · «Cansancio» en la lista de emociones** — HECHO: es un estado físico más que una emoción. PROPUESTA: mantenerlo (es útil y frecuente) y decidir si se presenta como «cómo me noto» en lugar de emoción. Validación: sí.

---

## 5. Herramientas (`src/content/tools.ts`)

**HECHO:** las siete ofrecen pasos concretos (3), varias formas de hacerlo (4–5), frases de ejemplo y una nota que evita prometer resultados universales. Por ejemplo, «A algunas personas les ayuda saberlo todo. A otras, solo lo siguiente» (Anticipar) o «no significa que siempre se vaya a cambiar. Pero tu opinión cuenta» (Desacuerdo). Todas contemplan formas no orales (pictogramas, gestos, escritura, señalar, tarjetas). Observaciones: P-16 y P-17.

**P-19 · Coherencia biblioteca / espacio tranquilo**
- **HECHO:** «Buscar un espacio tranquilo» propone «Biblioteca» como lugar tranquilo, mientras que en la historia la biblioteca tiene eco y Teo necesita cascos (`estrategias-2`).
- **HIPÓTESIS:** contradicción menor que puede confundir.
- **PROPUESTA:** «Biblioteca (si está en silencio)» o retirarla.

**P-20 · «Usar apoyos sensoriales»: «sin necesidad de pedir permiso»** (`familyTip`) — HECHO; es coherente con la afirmación de la neurodiversidad. HIPÓTESIS: en el colegio puede requerir acuerdos previos. Sin propuesta de cambio; consultarlo con profesionales.

---

## 6. Guía familiar (`familyGuide`)

**HECHO:**

- Ayuda a acompañar sin convertir el episodio en una lección de obediencia: «No busca que el niño o la niña "se acostumbre" sin más».
- Se pueden saltar preguntas.
- «No lo sé» es válido.
- «Evitad corregir lo que siente».
- Moverse es válido.
- Señales para parar.
- Escuchar el desacuerdo «sin corregir».
- Los recursos no producidos se marcan «en preparación».

**P-21 · «Pequeños cambios con aviso»** (`dailyPractice` p3: «Introducid algún cambio pequeño y previsible en casa»)
- **HIPÓTESIS:** es una práctica de exposición planificada. Para algunas familias y niños o niñas puede ser estresante si no se ajusta.
- **PROPUESTA:** añadir «si os parece adecuado, y dejadlo si genera malestar».
- **Validación:** sí, con profesionales y personas autistas adultas.

**P-22 · Recordar un cambio real difícil** (`afterReading`: «Pensad en un cambio real que haya vivido») — HIPÓTESIS: puede evocar malestar. Ya existe la señal para parar («Si la historia le recuerda una situación reciente…»). Sin cambio; observarlo con familias.

Véanse también P-08 (preguntas sin respuesta) y P-11.3 (señal acordada con el colegio).

---

## 7. Resumen de necesidades de validación

Prioridad sugerida para la revisión profesional y con personas autistas adultas:

1. P-11 (salir sin avisar).
2. P-02 (lectura fácil de las reacciones).
3. P-05 (intensidad).
4. P-13 (continuidad narrativa).
5. P-03, P-10 y P-16 (lenguaje figurado y certezas).
6. P-21 (práctica de cambios en casa).

Con niños y niñas, observar sobre todo P-04, P-05, P-07, P-13 y la legibilidad de las ilustraciones (ver `CHILD_USABILITY_PROTOCOL.md`).

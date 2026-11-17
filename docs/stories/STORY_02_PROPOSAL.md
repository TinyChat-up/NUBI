# Cuento 2 · Propuesta · «El libro de trenes»

Rama: `feat/claude-nubi-story-2-v1` (desde `feat/claude-nubi-branching-v1`, `6e63e42`). **Propuesta editorial pendiente de aprobación**: no está implementada, no está en la biblioteca y no cambia el motor, la experiencia visual ni «Una mañana diferente».

Documentos:

- [STORY_02_BRANCH_MAP.md](STORY_02_BRANCH_MAP.md): esquema de decisiones y escenas para el motor.
- [STORY_02_ART_INVENTORY.md](STORY_02_ART_INVENTORY.md): qué ilustraciones se reutilizan y cuáles faltan.

## 1. La situación

**Título propuesto:** «El libro de trenes». Alternativas: «Ahora no, luego sí» · «En la biblioteca».

Es la hora de la biblioteca. **Teo** está leyendo su libro de trenes con los cascos puestos: así está tranquilo. **Lía** se acerca y, con su comunicador, le dice que quiere mirar los trenes. Teo no la oye (lleva los cascos), pero ve el comunicador.

¿Qué podría hacer Teo?

### Por qué esta situación

- **Reconocible**: querer seguir con lo que uno está haciendo cuando otra persona quiere compartirlo.
- **Pensada para alumnado autista sin patologizar**:
  - la necesidad de Teo de seguir leyendo tranquilo, con sus cascos, **es válida** y no se corrige;
  - la comunicación de Lía con su comunicador es **comunicación de pleno derecho**;
  - lo que cambia entre caminos es **cómo se entienden** dos personas que se comunican de forma distinta.
- **Social de verdad**: hay otra persona (Lía) con su propio deseo, y el cuento pregunta también cómo podría sentirse ella (perspectiva), siempre como posibilidad.
- **Continuidad con el piloto**: los mismos personajes y la misma biblioteca, donde «Una mañana diferente» deja a Teo con su libro de trenes. Así se reutilizan dos ilustraciones existentes **sin cambiar su significado**.
- **Pocas pantallas**: 2 decisiones de 2 opciones y 3 finales; como máximo 4 pantallas desde la situación hasta un final.

### Lo que el cuento NO dice

- Que Teo **deba** compartir. «Seguir leyendo» es una opción tan legítima como enseñar el libro.
- Que quitarse los cascos o mirar a los ojos sea necesario para comunicarse.
- Que un final sea mejor que otro: los tres son formas posibles de seguir la tarde.

## 2. Guion visual, pantalla a pantalla

Texto pensado para lectura en voz alta y en pantalla: frases cortas (≤ 15 palabras), presente, narrador descriptivo y probabilidad, no certeza (`CONTENT_STANDARD.md` §2). La **narración prevista** es el mismo texto, leído con la voz elegida en Ajustes; no hay audio automático. El comunicador de Lía se lee como «Lía, con su comunicador: …».

| # | Qué ocurre | Qué debe verse | Texto exacto (niño o niña) | Interacción | Siguiente | Recurso |
|---|---|---|---|---|---|---|
| **P1** | Situación | Teo leyendo con los cascos en la biblioteca | «Es la hora de la biblioteca. Teo lee su libro de trenes con los cascos puestos.» | Siguiente / Atrás | P2 | `ume-k6-2` · **existente** |
| **P2a** | Llega Lía | Lía junto a Teo, señalando su comunicador | «Lía se acerca. Teo no la oye, pero ve su comunicador.» | Siguiente / Atrás | P2b | `ume-s6-biblioteca` · **existente** |
| **P2b** | Lía comunica (bocadillo de comunicador, como en el piloto) | Misma imagen | Lía (comunicador): «QUIERO · MIRAR · TRENES» | Siguiente / Atrás | P3 | `ume-s6-biblioteca` · **existente** |
| **P3** | Pregunta emocional **opcional** | Tarjetas de Nubi con emociones | «¿Cómo podría sentirse Teo?» — «Puedes elegir varias. O ninguna.» Opciones: Sorpresa · Curiosidad · Tranquilidad · Ganas de seguir leyendo · Nervios o inseguridad · Otra cosa · No lo sé | Elegir varias, ninguna, o seguir | P4 (sea cual sea la respuesta) | `emo-sorpresa`, `emo-curiosidad`, `emo-calma`, `emo-inseguridad` · **existentes**; «Ganas de seguir leyendo», «Otra cosa» y «No lo sé» con icono |
| **P4** | **Decisión 1** | Dos tarjetas ilustradas del mismo tamaño | «¿Qué podría hacer Teo?» — «Elige una. Después puedes probar la otra.» **A:** «Enseñarle el libro a Lía» · **B:** «Seguir leyendo» | Elegir A o B (táctil, ratón o teclado) | A → P5a · B → P5b | A: `lt-opt-ensenar` · **nueva**. B: `ume-k6-2` · **existente** |
| **P5a** | Consecuencia A | Teo y Lía miran juntos el libro; Lía señala un tren | «Teo gira el libro. Lía señala un tren. Los dos miran los dibujos.» | Siguiente → cierre | **FINAL A** «Mirar los trenes juntos» | `lt-juntos` · **nueva** |
| **P5b** | Consecuencia B | Teo sigue leyendo; Lía espera a su lado con el comunicador | «Teo sigue leyendo. Lía espera a su lado. No sabe si Teo la ha visto.» | Siguiente / Atrás | P5c | `lt-espera` · **nueva** |
| **P5c** | Pregunta emocional **opcional** (perspectiva) | Tarjetas de Nubi | «¿Cómo podría sentirse Lía?» — «Puedes elegir varias. O ninguna.» Opciones: Curiosidad · Tristeza · Tranquilidad · Sorpresa · Otra cosa · No lo sé | Elegir o seguir | P6 | `emo-curiosidad`, `emo-tristeza`, `emo-calma`, `emo-sorpresa` · **existentes** |
| **P6** | **Decisión 2** | Dos tarjetas | «¿Qué podría hacer Teo ahora?» **B1:** «Decirle: “Ahora no. Luego sí”» · **B2:** «Seguir sin decir nada» | Elegir B1 o B2 | B1 → FINAL B1 · B2 → P7 | B1: `lt-opt-luego` · **nueva**. B2: `lt-espera` · **nueva** (la misma de P5b) |
| **FINAL B1** | Consecuencia B1 | Lía lee con Aya; más tarde, Teo le enseña los trenes | «Teo le hace a Lía su gesto de “luego”. Lía lo entiende y lee con Aya. Más tarde, miran los trenes juntos.» | Siguiente → cierre | Cierre «Ahora no, luego sí» | `lt-luego` · **nueva** |
| **P7** | Consecuencia B2 | Lía se va con Aya; Teo sigue leyendo | «Lía se va con Aya. Miran juntas un libro de volcanes.» | Siguiente → oferta de Nubi | Oferta | `lt-con-aya` · **nueva** |
| **Nubi** | Oferta opcional | Nubi pensando + la tarjeta B1 | «¿Quieres probar otra forma?» — «Puedes seguir con tu elección o mirar otra.» (texto del motor) | **Seguir con mi elección** · tocar la tarjeta B1 · **Volver atrás** · **Terminar** | Seguir → cierre B2 · B1 → FINAL B1 | `nubi-pensando` · **existente** |
| **Cierres** | Generados por el motor | Nubi + nombre del final | «Un final del cuento: …» — «Hay otros caminos. Puedes descubrirlos cuando quieras.» · **Explorar otro camino** (decisiones del recorrido con sus otras opciones) · **Leer otra vez** · **Salir** | — | — | `nubi-saludo` · **existente** |

**Nombres de los finales**, neutros y descriptivos: «Mirar los trenes juntos» · «Ahora no, luego sí» · «Cada uno con su libro».

### Notas de redacción

- En B1, el gesto de «luego» puede ser una palabra, un gesto o una tarjeta. La ilustración lo muestra con una tarjeta sin texto legible, para que no parezca que Teo **tiene** que hablar.
- En P5b, «No sabe si Teo la ha visto» describe la situación de Lía, no culpa a Teo.
- En P7, nadie se enfada: la consecuencia es que **Lía hace otra cosa**, no un castigo.
- La versión corta (lectura fácil) de cada texto se redactaría después, con aprobación, como en el piloto.

## 3. Educación emocional dentro del cuento

- **Dos preguntas, ambas opcionales**: una sobre Teo (P3) y otra sobre Lía (P5c, solo en la rama B, donde la perspectiva de Lía importa).
- Se pregunta «¿Cómo **podría** sentirse…?», nunca «¿Cómo te sientes?» ni «¿Qué siente Teo?». Son interpretaciones posibles.
- Siempre están «Otra cosa» y «No lo sé», y se puede no responder.
- **La emoción elegida no cambia el camino** (el motor de la fase 21 ya lo garantiza: las preguntas no tienen salidas).
- No se muestran las respuestas a familias ni a docentes; solo, si se desea, en el resumen del propio niño o niña.

## 4. Nubi como guía

- Aparece **solo una vez**, en la rama B2, donde Lía se queda sin saber qué pasaba: «¿Quieres probar otra forma?».
- Nunca corrige, regaña ni puntúa. «Seguir con mi elección» es el botón principal.
- No aparece tras A ni tras B1, para que su presencia no se lea como «has elegido mal».

## 5. Acompañamiento de familias y docentes (borrador para la guía)

Para la guía «Antes · Durante · Después» del cuento, **pendiente de aprobación**:

- **Antes**: «Es un cuento sobre querer seguir con lo tuyo cuando otra persona quiere compartirlo». Recordar que Lía se comunica con un comunicador de pictogramas.
- **Durante**: no hay respuesta correcta. Si el niño o la niña elige «Seguir leyendo», es una opción válida. Se pueden explorar los otros caminos otro día.
- **Después**: hablar de qué hace él o ella cuando quiere seguir con algo («¿Tienes una forma de decir “luego”?»). Si quiere, preparar juntos una tarjeta o un gesto de «luego».
- **Apoyos que aparecen en el cuento** (`story.strategies`): comunicar una necesidad, apoyos sensoriales y expresar desacuerdo, con sus consejos ya existentes.

## 6. Lo que falta para implementarlo (cuando se apruebe)

1. Aprobación pedagógica del guion (textos de §2 y nombres de los finales).
2. Encargo de **7 ilustraciones nuevas** y 4 composiciones verticales ([inventario §4](STORY_02_ART_INVENTORY.md#4-ilustraciones-nuevas-necesarias)). Cómic opcional: unas 6 viñetas más.
3. Cargar la historia con `engineVersion: 2` y los campos `role`, `ending` y `offer` (sin cambios en el motor). El validador comprobará el grafo.
4. Versiones cortas aprobadas, guía para familias aprobada y pruebas de navegador (`branching.mjs` ampliado).
5. Pruebas con niños, niñas, familias y docentes antes de darlo por bueno.

## 7. Correcciones editoriales pendientes del piloto (no aplicadas)

Arrastradas de las fases 19–21. **Ningún texto se ha modificado.** Están en `src/content/stories/una-manana-diferente/story.ts`.

| # | Campo | Texto actual | Propuesta | Prioridad |
|---|---|---|---|---|
| **P-1** | `cierre-resumen` → «Herramientas que podrían ayudarme» → `empty` | «Puedes elegirlas cuando quieras en Mis herramientas.» | «Puedes elegirlas otra vez cuando vuelvas a leer el cuento.» | **Alta**: lo lee el niño o la niña y nombra una sección que ya no existe |
| **P-2** | `familyGuide.afterReading[2]` | «Si quiere, imprimid o dibujad su «tarjeta» preferida de Mis herramientas.» | «Si quiere, dibujad o imprimid su tarjeta preferida de las que aparecen en el cuento (por ejemplo, «Necesito un descanso»).» | Alta (guía adulta) |
| **P-3a** | `familyGuide.pendingActivities` a1 | «En la escena 4 hay seis posibilidades. Se pueden explorar en distintos días.» | «En el momento 2 («¿Qué podría hacer Teo?») hay seis posibilidades. Se pueden explorar en distintos días.» | Media |
| **P-3b** | `familyGuide.pendingActivities` a2 | «Elegir una herramienta de la escena 6 y probarla esta semana en una situación real.» | «Elegir uno de los apoyos del final del cuento y probarlo esta semana en una situación real.» | Media |

Siguen abiertas, además: P-4 y P-5 (textos nuevos de la guía), P-6 (paso de estrategias, revisión pedagógica), P-7 a P-10 (ver [PHASE_20_VISUAL_REPORT.md §6](../product/PHASE_20_VISUAL_REPORT.md#6-propuestas-editoriales-no-aplicadas)).

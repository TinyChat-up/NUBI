# Peticiones artísticas para Codex · fase 14

17/11/2026. Derivadas de la revisión visual a tamaño real (`COGNITIVE_ACCESSIBILITY_REVIEW.md` C-08, C-09). **Claude no ha modificado ninguna imagen.**

Son **condicionales**: describen una impresión de diseño, no un resultado de reconocimiento con niños y niñas. Se recomienda no redibujar hasta que la revisión con personas (`CHILD_USABILITY_PROTOCOL.md`, tareas 3 y 6) o una persona responsable lo confirme. Excepción: A-1.2, cuya ambigüedad semántica conviene revisar con criterio profesional antes del piloto.

## A-1 · «Pedir ayuda» y «Expresar desacuerdo» (`tool-pedir-ayuda`, `tool-expresar-desacuerdo`)

**Evidencia** (láminas a 56, 96 y 176 px, en color y en escala de grises, DPR 2):

1. **Misma composición.** Niño o niña de pie a la izquierda y Andrés agachado a la derecha, con la misma escala y el mismo fondo. A 56 px (selector de estrategias) solo los distingue un detalle de unos 8 px: la tarjeta con una mano frente a la mano abierta. En escala de grises, ese detalle casi desaparece.
2. **Acción poco reconocible en «Expresar desacuerdo».** Aya sonríe, con la palma abierta hacia arriba, en un gesto de explicar. Sin la etiqueta, se leería como «contar algo» o «conversar», no como desacuerdo.

**Petición** (cuando se confirme):

- Diferenciar la **acción principal por la forma y no solo por el color**. Por ejemplo, Aya mostrando la tarjeta o el pictograma «no me gusta», que ya figura entre las formas de expresar desacuerdo en `tools.ts`.
- Expresión neutra o seria sin agresividad, para que se lea como «no estoy de acuerdo» y no como alegría.
- Si es posible, otra composición o encuadre distinto al de «Pedir ayuda».
- Mantener: sin texto en la imagen, sin gestos de castigo ni amenaza, sin exigir contacto visual, mismo estilo y personajes.

**Condiciones técnicas:** las mismas que en el lote 6 (`tool()` en `common.ts`): PNG 1024 transparente con variantes 256/512. Comprobar con `art-batch-6.mjs`, `art-files.mjs` y la lámina de legibilidad a 56/96/176 px.

## A-2 · Diferenciación de emociones a 56–64 px (`emo-*`)

**Evidencia** (lámina a 56 y 64 px, DPR 1 y 2):

- Calma (silueta horizontal), Curiosidad (lupa) y Cansancio (luna) se distinguen por silueta u objeto.
- Alegría, Sorpresa, Frustración, Tristeza y Enfado comparten silueta y se diferencian sobre todo por rasgos faciales de unos 20 px.
- En el selector del cuento conviven Sorpresa, Inseguridad y Frustración.

**Petición** (solo si la tarea 3 muestra confusión): reforzar las señales de **postura y silueta**, no solo de rasgos faciales, para las emociones afectadas. Por ejemplo:

- Sorpresa más elevada, con los brazos abiertos.
- Inseguridad más recogida o asomándose.
- Frustración con el nudo más visible.

Evitar caricatura, colores de acierto o error y gestos amenazantes. La palabra seguirá siendo siempre la referencia.

## Sin petición

- Escenas, opciones, consecuencias y viñetas: sin problemas de lectura detectados a su tamaño de uso. La posición del «NO SÉ» de Lía en k2-4 (abajo a la derecha, junto a Bruno) depende de `bubble.position` en `story.ts`; es una decisión de contenido (`DECISION_REGISTER.md` D-08), no de arte.
- Logotipo: decisión humana pendiente (`DECISION_REGISTER.md` D-01). No hace falta trabajo nuevo hasta que se decida.
